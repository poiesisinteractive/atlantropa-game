<#
  deploy.ps1 — Redéploiement d'Atlantropa sur le VPS OVH.
  Copie du template canonique skills/poiesis-deploy/templates/deploy.ps1 (repo
  poiesis-skills) : SEUL le bloc CONFIG diffère. Toute évolution du template doit
  être répercutée ici (DEPLOY.md §9.3).

  Cible : https://proto.atlantropa-game.poiesis-interactive.com/  ->  /opt/atlantropa-game/site
  Profil PRIVÉ (basic_auth + noindex) : la vérification finale attend un 401.

  ⚠️  Ce script met à jour du CONTENU. Il ne touche NI à Caddy, NI à un service systemd,
      NI au bot de trading. La mise en ligne initiale (DNS, bloc Caddy, basic auth) se fait
      à la main une seule fois — voir DEPLOY.md §3 à §7.

  Fait, dans l'ordre :
    1. build LOCAL (jamais sur le VPS : pas de swap, un OOM y tuerait le bot de trading)
    2. archive du contenu à déployer
    3. contrôle anti-fuite (.env / node_modules / .git)
    4. upload scp vers /tmp
    5. extraction distante dans un dossier temporaire puis SWAP par `mv` (~zéro downtime),
       l'ancien contenu étant conservé en .prev pour rollback
    6. vérification HTTP — 401 attendu si le proto est en profil privé

  Usage :
    .\deploy.ps1               # build + déploie + vérifie
    .\deploy.ps1 -SkipBuild    # déploie le dist/ existant, sans rebuild
    .\deploy.ps1 -Rollback     # restaure le déploiement précédent (.prev)
    .\deploy.ps1 -NoVerify     # saute la vérification HTTP finale

  Vérification authentifiée d'un proto privé (facultatif, le mot de passe ne vit PAS ici) :
    $env:DEPLOY_BASIC_AUTH = 'utilisateur:motdepasse'; .\deploy.ps1

  Ne fait PAS de git commit/push : concern séparé.
#>
[CmdletBinding()]
param(
  [switch]$SkipBuild,
  [switch]$NoVerify,
  [switch]$Rollback
)

$ErrorActionPreference = 'Stop'

# ============================================================================
#  CONFIG — la SEULE section à modifier en copiant ce template
# ============================================================================
$App          = 'atlantropa-game'         # kebab-case : dossier /opt/<App>
$VpsUser      = 'ubuntu'
$VpsHost      = '51.91.103.50'
# Sous-domaine à DEUX niveaux : l'URL n'est donc PAS "$App.poiesis-interactive.com".
# Le template la dérive de $App ; ici on la pose en clair. Le garde-fou de $App
# (kebab-case, pas de point) et celui de $RemoteDir restent intacts.
$SiteUrl      = 'https://proto.atlantropa-game.poiesis-interactive.com/'
$ExpectedCode = 401                      # 401 = profil PRIVÉ (défaut) · 200 = profil public

# Source du contenu — renseigner l'UN des deux :
$DistDir      = 'dist'                   # dossier de build ; son CONTENU est archivé
$Files        = @()                      # sinon : liste de fichiers/dossiers à la racine du repo
$BuildCmd     = 'npm run build'          # '' pour un proto sans build
# ============================================================================

$Target    = "$VpsUser@$VpsHost"
$RemoteDir = "/opt/$App/site"
$Archive   = Join-Path $env:TEMP "$App-site.tgz"
$RemoteTgz = "/tmp/$App-site.tgz"

function Step($m) { Write-Host "`n>>> $m" -ForegroundColor White }
function Info($m) { Write-Host "    $m" -ForegroundColor Cyan }
function Ok($m)   { Write-Host "OK  $m" -ForegroundColor Green }
function Die($m)  { Write-Host "`nECHEC: $m" -ForegroundColor Red; exit 1 }

Set-Location $PSScriptRoot

# --- Garde-fous : refuser une config dangereuse AVANT toute connexion --------
# $RemoteDir est le chemin d'un `rm -rf` distant : il doit être exactement /opt/<app>/site.
if ($App -cnotmatch '^[a-z0-9][a-z0-9-]*$') { Die "App doit etre en kebab-case minuscule : '$App'" }
if (@('trading-bot', 'uv-python') -contains $App) { Die "App reservee au bot de trading : $App" }
if ($RemoteDir -cnotmatch '^/opt/[a-z0-9][a-z0-9-]*/site$') { Die "RemoteDir suspect : $RemoteDir" }
if ($DistDir -and $Files.Count -gt 0) { Die "Renseigne \$DistDir OU \$Files, pas les deux." }
if (-not $DistDir -and $Files.Count -eq 0) { Die "Renseigne \$DistDir ou \$Files." }

# --- Le script distant (deploy | rollback) ----------------------------------
# Envoyé par scp plutôt que par stdin : évite tout souci de BOM / d'encodage du pipe.
$remoteScript = @'
set -e
APP="$1"; DIR="$2"; OP="${3:-deploy}"

# Garde-fou distant, indépendant de l'appelant : DIR doit être /opt/<app>/site.
case "$DIR" in
  /opt/*/site) : ;;
  *) echo "STOP: DIR invalide ($DIR)"; exit 1;;
esac
case "$DIR" in
  */trading-bot/*|*/uv-python/*) echo "STOP: chemin reserve au bot"; exit 1;;
esac

PREV="${DIR}.prev"

if [ "$OP" = "rollback" ]; then
  [ -d "$PREV" ] || { echo "STOP: aucun $PREV a restaurer"; exit 1; }
  SWAP="${DIR}.swap"
  rm -rf "$SWAP"
  if [ -d "$DIR" ]; then mv "$DIR" "$SWAP"; fi
  mv "$PREV" "$DIR"
  # L'ancien live devient le nouveau .prev : un second -Rollback annule le premier.
  if [ -d "$SWAP" ]; then mv "$SWAP" "$PREV"; fi
  echo "rollback effectue: $(ls "$DIR" | tr '\n' ' ')"
  exit 0
fi

TGZ="/tmp/${APP}-site.tgz"
NEW="${DIR}.new"
[ -s "$TGZ" ] || { echo "STOP: archive absente ou vide ($TGZ)"; exit 1; }

rm -rf "$NEW"; mkdir -p "$NEW"
tar -xzf "$TGZ" -C "$NEW"
[ -f "$NEW/index.html" ] || { echo "STOP: index.html absent de l'archive"; rm -rf "$NEW"; exit 1; }
chmod -R a+rX "$NEW"

# Swap : le site n'est jamais dans un état à moitié remplacé.
rm -rf "$PREV"
if [ -d "$DIR" ]; then mv "$DIR" "$PREV"; fi
mv "$NEW" "$DIR"
rm -f "$TGZ"
echo "deploye: $(ls "$DIR" | tr '\n' ' ')"
'@

function Invoke-Remote([string]$Op) {
  $body = ($remoteScript -replace "`r`n", "`n").TrimStart([char]0xFEFF)
  $tmpSh = Join-Path $env:TEMP "$App-deploy-remote.sh"
  [System.IO.File]::WriteAllText($tmpSh, $body, (New-Object System.Text.UTF8Encoding $false))
  & scp -o StrictHostKeyChecking=accept-new -o ConnectTimeout=15 $tmpSh "${Target}:/tmp/$App-deploy-remote.sh"
  if ($LASTEXITCODE -ne 0) { Die "scp du script distant a echoue" }
  Remove-Item $tmpSh -Force
  & ssh -o ConnectTimeout=15 $Target "bash /tmp/$App-deploy-remote.sh '$App' '$RemoteDir' '$Op'; rc=`$?; rm -f /tmp/$App-deploy-remote.sh; exit `$rc"
  if ($LASTEXITCODE -ne 0) { Die "operation distante '$Op' echouee (le contenu en place est intact)" }
}

# --- Vérification HTTP ------------------------------------------------------
# curl.exe (livré avec Windows 10+) plutôt qu'Invoke-WebRequest : celui-ci lève une
# exception sur un 401, qui est précisément le code ATTENDU en profil privé.
function Test-Site {
  Step "Verification HTTP"
  Start-Sleep -Seconds 1
  $code = (& curl.exe -s -o NUL -w "%{http_code}" --max-time 20 $SiteUrl)
  if ($code -ne "$ExpectedCode") {
    if ($ExpectedCode -eq 401) {
      Die "$SiteUrl -> $code, attendu 401.`n     Le proto est PRIVE dans sa config mais repond sans mot de passe : verifie le bloc basic_auth (DEPLOY.md 7.3)."
    }
    Die "$SiteUrl -> $code, attendu $ExpectedCode"
  }
  if ($ExpectedCode -eq 401) { Ok "$SiteUrl -> 401 sans identifiants (verrou en place)" }
  else { Ok "$SiteUrl -> $code" }

  if ($env:DEPLOY_BASIC_AUTH) {
    $authed = (& curl.exe -s -o NUL -w "%{http_code}" --max-time 20 -u $env:DEPLOY_BASIC_AUTH $SiteUrl)
    if ($authed -ne '200') { Die "avec identifiants -> $authed, attendu 200" }
    Ok "avec identifiants -> 200"
  }
}

# --- Rollback ---------------------------------------------------------------
if ($Rollback) {
  Step "Rollback de $App ($RemoteDir -> depuis .prev)"
  Invoke-Remote 'rollback'
  Ok "contenu precedent restaure"
  if (-not $NoVerify) { Test-Site }
  Write-Host "`nRollback termine -> $SiteUrl (Ctrl+F5)" -ForegroundColor Green
  exit 0
}

$sw = Get-Date

# --- 1) Build local ---------------------------------------------------------
if ($SkipBuild -or -not $BuildCmd) {
  Info "build saute"
}
else {
  Step "Build local ($BuildCmd)"
  # npm écrit en couleur sur stderr : ne pas le confondre avec une erreur.
  $ErrorActionPreference = 'Continue'
  Invoke-Expression "& $BuildCmd"
  $code = $LASTEXITCODE
  $ErrorActionPreference = 'Stop'
  if ($code -ne 0) { Die "$BuildCmd a echoue (code $code)" }
}

# --- 2) Archive -------------------------------------------------------------
Step 'Archive du contenu'
if (Test-Path $Archive) { Remove-Item $Archive -Force }
if ($DistDir) {
  if (-not (Test-Path (Join-Path $DistDir 'index.html'))) { Die "$DistDir/index.html absent -> build incomplet ?" }
  & tar -czf $Archive -C $DistDir .          # le CONTENU de dist/, pas le dossier
}
else {
  foreach ($f in $Files) { if (-not (Test-Path $f)) { Die "fichier a deployer introuvable : $f" } }
  & tar -czf $Archive $Files
}
if ($LASTEXITCODE -ne 0) { Die 'tar a echoue' }
Ok ("archive : {0} Ko" -f [math]::Round((Get-Item $Archive).Length / 1KB))

# --- 3) Contrôle anti-fuite (ne doit RIEN matcher) --------------------------
Step 'Controle anti-fuite'
$leak = & tar -tzf $Archive | Select-String -Pattern '\.env|node_modules|\.git/'
if ($leak) { Remove-Item $Archive -Force; Die "FUITE detectee dans l'archive :`n$leak" }
Ok 'aucun secret, aucun node_modules'

# --- 4) Upload --------------------------------------------------------------
Step "Upload vers $Target"
& scp -o StrictHostKeyChecking=accept-new -o ConnectTimeout=15 $Archive "${Target}:$RemoteTgz"
if ($LASTEXITCODE -ne 0) { Die 'scp a echoue' }
Remove-Item $Archive -Force
Ok 'uploade'

# --- 5) Swap distant --------------------------------------------------------
Step "Deploiement distant ($RemoteDir)"
Invoke-Remote 'deploy'
Ok 'contenu swappe (.prev conserve pour rollback)'

# --- 6) Vérification --------------------------------------------------------
if (-not $NoVerify) { Test-Site }

$dur = [math]::Round(((Get-Date) - $sw).TotalSeconds, 1)
Write-Host "`nDeploiement termine en ${dur}s -> $SiteUrl (Ctrl+F5)" -ForegroundColor Green
Write-Host "Rollback si besoin : .\deploy.ps1 -Rollback" -ForegroundColor DarkGray
