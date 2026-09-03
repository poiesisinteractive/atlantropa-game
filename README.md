# Atlantropa — Le Grand Œuvre

Un jeu de gestion sur le projet réel d'**Herman Sörgel** (1885-1952) : barrer le détroit de
Gibraltar, abaisser la Méditerranée de deux cents mètres, et souder l'Europe à l'Afrique.

On y joue **Alexeï Morev**, né en 1905 près de Taganrog, apatride depuis 1921, formé aux
Ponts à Paris. Il lit Sörgel en 1929, entre à l'Institut en 1930, en hérite à la mort du
maître en 1952 — et la partie s'arrête à la sienne. La spécification des évolutions en
cours vit dans [`docs/spec.md`](docs/spec.md).

```sh
npm install
npm run dev
```

Le jeu passe actuellement d'un rendu Canvas 2D à un rendu **three.js** en relief.
La version 2D d'origine — un seul fichier, aucune dépendance — est figée dans
[`reference/atlantropa-2d.html`](reference/atlantropa-2d.html) et sert d'étalon
visuel pendant le portage.

---

## Le nœud du jeu

La puissance d'une turbine vaut **débit × hauteur de chute**.

- Le débit, c'est l'eau atlantique qu'on laisse entrer — et qui compense l'évaporation,
  donc qui **empêche** la mer de descendre.
- La hauteur de chute, c'est le vide qu'on a creusé — donc ce qu'on n'obtient qu'**en**
  asséchant.

Pour produire, il faut assécher ; pour assécher, il faut renoncer à produire. Le curseur
des vannes est le seul vrai levier du jeu, et il n'a pas de bon réglage. Pendant ce temps
le sel, lui, ne s'évapore jamais.

## Modèle

Simplifié, mais calibré sur des ordres de grandeur réels.

| Grandeur | Valeur retenue | Origine |
|---|---|---|
| Déficit évaporatoire net | ≈ 0,95 m/an | évaporation − (précipitations + fleuves) |
| Puissance | `P = ρ·g·Q·H·η` | ≈ 0,59 GW par mètre de chute à débit d'équilibre |
| Cible de Sörgel | 50 000 MW | atteint vers −100 m dans le modèle |
| Salinité | `S = S₀·V₀/V` | masse de sel conservée : 38 → 43-45 g/L |
| Baisse du niveau des océans | ≈ 1,3 m à −200 m | volume retiré / surface océanique |

Les seuils biologiques (40 g/L : décrochage de la faune méditerranéenne ; 42 g/L : domaine
des lagunes hypersalines) encadrent l'effondrement de la biodiversité.

## Carte

- Maillage **1300 × 594** cellules — environ 3,37 km de côté.
- **Relief réel** : topographie et bathymétrie tirées des *Terrain Tiles* (AWS Open Data,
  agrégat de SRTM, NED, ETOPO1 et GEBCO), rééchantillonnées hors ligne sur cette grille
  par `tools/fetch-dem.mjs`, puis affinées par deux octaves de bruit fractal d'amplitude
  proportionnelle à la pente — la donnée est juste à 3,4 km, le grain manquait.
- Le **trait de côte dessiné à la main** (lissé par Chaikin) ne sert plus qu'à dire à quel
  bassin appartient une cellule d'eau : c'est lui qui porte la coupure ouest/est de la
  ligne Cap Bon–Trapani, que nulle donnée ne donnerait. Le relief, lui, retranche : une
  cellule dessinée en mer que le MNT place au-dessus du zéro redevient terre — d'où les
  Cyclades, la Dalmatie et les Baléares, que la carte à la main ne dessinait pas.
  L'inverse n'est pas vrai, et c'est voulu : une cellule dessinée en terre reste terre
  même sous le niveau de la mer, ce qui garde Qattara (−133 m) et la mer Morte (−430 m)
  hors du bassin. Corollaire assumé : les mers que le trait ne dessine pas — golfe de
  Gascogne, mer Rouge — sont de la terre pour le jeu, et le MNT leur donne alors leur
  vraie profondeur en guise d'altitude.
- **Ombrage** dérivé du relief, soleil au nord-ouest : en se retirant, la mer découvre
  ses talus, ses canyons et ses plaines abyssales.
- Conséquence inattendue du relief réel : la simulation est devenue juste. Le volume de
  la Méditerranée y vaut 3 775 000 km³ contre 3 750 000 réels, sa surface 2 378 000 km²
  contre 2 500 000, et la salinité atteinte à −200 m 42,8 g/L — dans la fourchette
  annoncée plus haut, là où la bathymétrie dessinée à la main donnait 48,9.
- Frontières politiques de **1930** (Yougoslavie, Transjordanie, Palestine mandataire,
  Libye italienne).
- Quatre calques : **Relief**, **Géologie** (isobathes, volcans, failles, évaporites
  messiniennes), **Économie** (route Gibraltar-Suez, réseau électrique, ressources,
  ports échoués), **Sel** (salinité par bassin, croûte d'halite, panaches de poussière).

## Le prologue, 1926-1930

Onze cartes avant la carte. Elles ne construisent rien : elles décident qui porte le
projet. Chacune pose un **trait** — idéaliste ou pragmatique, l'Afrique terre vide ou
partenaire, fidèle à Sörgel ou indépendant, la Russie en deuil ou en revanche — ou une
dimension du **plan** : par où commencer, jusqu'où descendre, ce qu'on met en avant, ce
que l'Afrique est dans le plan.

Rien de tout cela ne s'affiche en chiffres. Les traits se lisent en phrases dans l'onglet
**Portrait**, qui se remplit au fil de la partie ; le plan, lui, a des effets mesurables
(l'ouvrage-cœur coûte 15 % de moins, la cible change le discours, le bénéfice change les
recettes, la place de l'Afrique change l'accueil au sud). Chaque étape a ses variantes,
tirées au sort : deux prologues ne se ressemblent pas.

La vie du personnage se compte en mois, jamais affichés : un chantier suivi sur place, une
année de surmenage, un exil en coûtent ; une année calme en rend. L'espérance part de 1990
et reste dans la fenêtre 1975-2000. Le journal en glisse les signes — une toux, deux nuits
d'hôpital, les rendez-vous du matin annulés.

## Le registre des bailleurs

Dix visages, dix clauses. Chaque bailleur vient en deux temps : **l'offre**,
un dossier qui se présente dans sa fenêtre historique et propose de l'argent,
des hommes ou de la légitimité contre une clause inscrite au grand livre ; puis
**l'échéance**, un second dossier à date fixe qui ne se présente *que si la
clause a été signée* — le moment où l'Histoire vient la lire à voix haute.
L'Italie signe en 1930 et présente sa note en 1943, le Reich en 1934 et en
1945, l'URSS en 1936 et en 1939, le Plan Marshall en 1948 et en 1954. Un
bailleur qu'on laisse passer ne revient pas.

Il n'y a pas de moteur de bailleurs : un bailleur *est* un dossier, avec la
même grammaire que les soixante-dix autres. Ce qu'il laisse derrière lui, en
revanche, est nouveau — une ligne au grand livre, qui reste inscrite même
dénoncée.

À côté, les **obligations**, qui n'ont pas de visage mais un taux : 4 % de
base, plus un point par tranche de vingt points de soutien manquant sous 70,
moins un point et demi si un bailleur garantit. Deux lignes vives au maximum ;
au-delà le marché se ferme. Le service pèse chaque année sur la dépense et
l'émission s'éteint d'elle-même à son terme. Le défaut, c'est la faillite
existante, à −12 Md.

Le tout se lit dans l'onglet **Registre** : la trésorerie, le grand livre, les
émissions, et les six boutons qui permettent d'emprunter.

## La course — l'atome contre l'eau

Obninsk produit du courant en juin 1954 et tue l'argument de Sörgel dans une
salle de contrôle, à deux mille kilomètres du détroit. À partir de là, le jeu a
un adversaire chiffré : les gigawatts nucléaires soviétiques, sur leur courbe
réelle — 0,005 GW en 1954, 1 en 1970, 5 en 1975, 12 en 1980, 27 en 1985,
Tchernobyl en 1986, 34 en 1990. Un onglet **Course** apparaît alors, et pas
avant.

**Deux jauges, symétriques.** `pressure` mesure ce que Morev fait subir à
l'atome — son avance, la propagande, l'embargo, la main tendue refusée. Une
URSS pressée construit plus vite *et moins bien* : elle rattrape jusqu'à
cinquante pour cent plus vite, et Tchernobyl, en 1986, sera à la mesure de ce
chiffre — historique en dessous de 40, deux tranches entre 40 et 70, trois
tranches et l'Europe contaminée au-delà. `strain` mesure ce que l'ouvrage
subit : la hâte, l'entretien sabré, le suréquipement, les séismes, l'Etna. Au
delà de soixante-quinze, un tirage annuel : un petit barrage coûte des années,
Gibraltar coûte la partie.

Ce que Morev fait subir à l'atome, l'eau peut le subir aussi. C'est le sens du
système, et la raison pour laquelle les deux jauges se ressemblent.

**Gagner la course, c'est renoncer au continent.** La puissance vaut *débit ×
hauteur de chute* : pour produire il faut ouvrir les vannes, et la mer cesse
alors de descendre. Mesuré (`tools/sim-check.mjs` et le journal de la
spécification) : vannes closes toute la vie, on finit à −48 m et 0 GW — on n'a
pas couru. Vannes ouvertes dès 1970 sans rien équiper, 19,9 GW contre 31,9 : on
perd. Il faut tenir les vannes fermées jusque vers 1978, avoir équipé la
seconde usine et la dorsale, et alors 32 à 39 GW passent devant l'Union
soviétique. Et l'on peut toujours gagner en commandant des réacteurs — mais
c'est gagner en changeant de camp, et la fin le dit.

## Événements

Le temps est celui d'une vie — soixante ans, jusqu'à 29 secondes par année. Le rythme vient
des décisions, pas de l'horloge : **107 dossiers** à trancher, qui mettent le jeu en pause.

Diplomatie (Montreux 1936, Bandung 1955, la clause impériale de Mussolini), ingénierie
(caissons retournés, corrosion saline, les ossements de Gallipoli sous le chantier des
Dardanelles), économie (krach de 1931, emprunts avec service de dette sur 40 ans),
villes (la lettre du patriarche de Venise, le gypse dans les poumons des enfants de
Provence, *qui peuplera les terres neuves*), science (le rapport Rouch de 1935, les
carottes du Glomar Challenger en 1971, les épaves puniques qui ressortent et se délitent
à l'air), et les rendez-vous imposés par l'Histoire.

Trois d'entre eux n'existent que parce que le prologue a eu lieu et lui rendent la
monnaie : l'exergue de Hitler que Sörgel place dans son livre en 1938, le contrôle des
titres de séjour d'un apatride russe à Munich pendant la guerre, et l'invitation de
l'Académie des sciences d'URSS à revenir voir le Volga — celle-ci ne se présente qu'à un
homme dont la Russie est une revanche et non un deuil.

S'y ajoutent 30 brèves d'ambiance et un bilan décennal.

### Les fins

Quatre **arrêts** cassent la partie avant terme : faillite, dissolution du consortium,
révolte. Les autres sont des **bilans** : Morev meurt, et l'on regarde ce qu'il laisse —
*La mer basse*, *Une plaine de sel*, *Le lac des autres*, *Enterré avec lui*, plus quatre
que les phases suivantes ouvriront (*L'ouvrage confisqué*, *Le courant de l'Europe*,
*L'atome a gagné*, *Le passeport*), et *La nuit zancléenne* quand le barrage
cède de lui-même.

Leurs seuils sortent de la physique et non d'un souhait. Le meilleur cas possible —
Gibraltar fermé en 1935, vannes closes, argent illimité, tous les ouvrages lancés —
descend à **−43 m** en 1990 : la mer ne va pas plus vite que 0,95 m/an et une vie d'homme
n'en contient que soixante. Le « point de non-retour » à −55 m aurait donc rendu *La mer
basse* inatteignable, quoi que fasse le joueur. C'est `sim-check` qui l'a montré, et c'est
`sim-check` qui rejoue ce meilleur cas à chaque lancement pour qu'aucune fin ne redevienne
du texte mort.

## Le projet historique

Atlantropa — ou *Panropa* — fut défendu par Sörgel de 1928 jusqu'à sa mort. Cinq ouvrages :
Gibraltar, les Dardanelles, une digue Sicile-Tunisie, un barrage sur le Congo pour irriguer
le Sahara, des écluses à Suez. Pacifiste et pan-européen dans l'intention, franchement
colonial dans la structure — aucun pays riverain du sud ne fut consulté.

Ce qui l'a tué n'est ni l'écologie ni la morale : le **nucléaire civil** (1954) a rendu
l'argument énergétique caduc, la **décolonisation** a détruit la prémisse eurafricaine,
et le coût était sans commune mesure avec la reconstruction d'après-guerre. L'Institut
Atlantropa a fermé en 1960.

Ce qui serait arrivé, et que le plan ne mentionne pas : hypersalinité de type messinien,
croûtes évaporitiques au lieu de terres arables, tempêtes de sel façon mer d'Aral, ports
antiques échoués à cent kilomètres du rivage, affaiblissement des pluies méditerranéennes
et de la circulation atlantique, rebond isostatique et sismicité.

## Sources

- Wikipédia, « Atlantropa »
- Wolfgang Voigt, *Atlantropa — Weltenbauen am Mittelmeer*, 1998
- Alexander Gall, *Das Atlantropa-Projekt: die Geschichte einer gescheiterten Vision*, 1998
- *Cabinet Magazine* n° 10, « Atlantropa », 2003
- Atlas Obscura, « The Bonkers Real-Life Plan to Drain the Mediterranean »
- Environment & Society Portal, « Atlantropa — Endless Energy from the Mediterranean Sea »

Le relief et la bathymétrie sont réels ; le trait de côte reste schématique, dessiné à la
main, et les frontières sont celles de 1930. C'est un jeu, pas un SIG.

## Technique

Vite et modules ES. Deux rendus cohabitent : le **relief three.js** (bouton *3D*), et
le **Canvas 2D** d'origine, conservé comme étalon visuel. Ils diffèrent par le fond —
pixels reconstruits d'un côté, terrain déplacé au GPU de l'autre — mais partagent
désormais toutes leurs surcouches vectorielles.

Le terrain ne change jamais de la partie : il part au GPU une fois pour toutes en texture
de hauteur, et les trois niveaux de bassin ne sont plus que des uniforms. Une image de
carte coûte 3,5 ms au lieu de 40, et le niveau descend en continu au lieu de sauter trois
fois par seconde. L'échelle verticale a deux régimes — dilatée de 0 à ±300 m, où tout se
joue, comprimée logarithmiquement au-delà — sans quoi les 200 mètres d'assèchement
seraient invisibles au fond d'une fosse de 5 000.

Aires et volumes immergés se lisent dans une courbe hypsométrique cumulée au mètre : la
bathymétrie étant fixe, ils ne dépendent que du niveau. C'est 6 000 fois plus rapide que
le balayage des 772 200 cellules qu'elle remplace, à l'identique.

```sh
npm run dev      # serveur de développement — http://localhost:5173/
npm run build    # bundle de production, dans dist/
npm run preview  # sert le bundle construit
npm run lint     # eslint, sur src/ seulement
```

Les outils de vérification vivent hors du bundle, dans `tools/`. `sim-check`
charge le modèle directement dans Node et n'a besoin de rien. Les quatre autres
pilotent Chromium via `playwright-core`, en réutilisant les navigateurs déjà
installés sur la machine : il leur faut donc **un serveur déjà lancé**. Ils
prennent leur cible dans le premier argument, sinon dans `ATL_URL`, sinon sur
`http://localhost:4173/` — le port de `npm run preview`.

```sh
npm run check:model    # le modèle seul : 8 parties avec prologue, NaN, invariants, fins
npm run check:smoke    # non-régression : boot, prologue joué au clic, 40 ans, calques, onglets
npm run check:hypso    # la table hypsométrique contre le balayage complet
npm run check:ui3d     # les commandes du relief, par l'interface réelle
npm run deps:check     # vulnérabilités, licences, dépréciations

node tools/fetch-dem.mjs                             # recuire le relief depuis les Terrain Tiles
node tools/shot3d.mjs http://localhost:4173/ . -120 0 55   # captures du relief
```

Un piège, si vous éditez pendant qu'un de ces quatre outils tourne : le serveur
de développement recharge la page à la moindre écriture dans le projet — un
`npm run build` concurrent suffit — et le test se retrouve devant une page
revenue à zéro, modale d'ouverture comprise. Les échecs prennent alors des
formes trompeuses (« élément non visible », « case impossible à décocher »).
Contre un chantier actif, servez plutôt un bundle figé : `npm run build` puis
`npm run preview`, et visez ce port-là.

`sim-check` est le filet du modèle : tirage déterministe à graine, donc un échec
se rejoue à l'identique, et un balayage de toutes les grandeurs à chaque année.
C'est lui qui aurait signalé la poussière saline restée à `NaN` pendant tout le
portage — une valeur non finie traverse `clamp()`, échoue à toutes les
comparaisons et s'affiche « 0 » sans que rien ne proteste.

`fetch-dem` télécharge des tuiles, les met en cache dans `.dem-cache/` et
réécrit `src/data/dem.bin`. Il n'a besoin d'être relancé que si la grille
change — auquel cas `hypso-check` doit suivre.

### Intégration continue

`.github/workflows/ci.yml` rejoue tout cela sur chaque PR et chaque push sur
`main` : `lint` + `build`, puis le modèle, l'interface et le relief en trois
jobs séparés. Le bundle est **construit une fois** et c'est cet artefact-là que
les jobs suivants dépaquettent et servent — un artefact testé puis reconstruit
n'est plus l'artefact testé. `dependency-check.yml` audite l'arbre des
dépendances, avec un cron du lundi matin pour attraper une CVE publiée contre du
code que personne n'a touché.

Il n'y a **pas de job de déploiement**. La première mise en ligne s'est faite à la
main, comme le veut la doctrine du studio
([`poiesis-deploy`](https://github.com/poiesisinteractive/poiesis-skills)), et les
redéploiements passent par `deploy.ps1`. Les automatiser est possible désormais
(clé dédiée + forced command, §13.9) ; les gardes du bundle (anti-fuite, plancher
de taille, forme `site/`) sont déjà en place pour greffer le job derrière les
portes existantes.

Pas de job `typecheck` non plus. Le projet est en JavaScript nu, et la mesure a
été faite : `tsc --checkJs` y sort 32 erreurs de typage DOM **sans voir** la
classe de bug qui a réellement mordu ici — une propriété absente lue sur un
objet, restée `NaN` tout un portage durant — parce qu'un type inféré depuis un
`.js` reste ouvert là où le même type déclaré en TS est fermé. La porte qui
attrape celle-là est `check:model`.

Enfin, ces portes ne valent que si `main` les exige : Settings → Branches →
*Require status checks to pass*, et cocher les quatre jobs.

`ui3d-check` passe délibérément par des clics et des glissers plutôt que par
`window.__atl` : c'est ce qui manquait au test de fumée, qui appelait les
fonctions directement et ne pouvait donc pas voir qu'un canvas mal placé dans
l'ordre du DOM recouvrait les commandes et interceptait leurs clics.

### Mise en ligne

Proto **statique** : `npm run build` produit `dist/`, que Caddy sert en direct — aucun
process côté serveur, donc pas de service systemd ni de port. Le jeu charge son MNT par
`fetch`, il lui faut donc bien un serveur HTTP ; il ne tourne pas en `file://`.

| | |
|---|---|
| URL | `https://proto.atlantropa-game.poiesis-interactive.com/` |
| Chemin sur le VPS | `/opt/atlantropa-game/site` |
| Profil | **privé** — `basic_auth` + `noindex`. Le critère de recette n° 1 est un **401 sans identifiants** |

La procédure est celle du studio : [`poiesis-deploy`](https://github.com/poiesisinteractive/poiesis-skills),
`DEPLOY.md` §3 à §8 pour la première mise en ligne (à la main, une seule fois), §9 ensuite.
Les redéploiements passent par [`deploy.ps1`](deploy.ps1), copie du template canonique dont
**seul le bloc CONFIG diffère** — build local, contrôle anti-fuite, swap atomique, `.prev`
conservé, et `-Rollback` :

```powershell
.\deploy.ps1                 # build + archive + anti-fuite + upload + swap + vérification
.\deploy.ps1 -SkipBuild      # redéploie le dist/ existant
.\deploy.ps1 -Rollback       # restaure le déploiement précédent
```

Une particularité à connaître : le sous-domaine a **deux niveaux**, alors que la convention du
studio est `APP == label du sous-domaine`. `$App` reste donc `atlantropa-game` (le garde-fou
refuse un point) et `$SiteUrl` est posée en clair au lieu d'être dérivée.

Le CI n'a **pas** de job de déploiement : §13.9-1 pose qu'un CI n'est pas un chemin de première
mise en ligne. Les gardes du bundle sont déjà en place pour l'y greffer ensuite.

### Structure

```
index.html          la coquille : barre d'état, carte, panneau latéral, journal
src/main.js         amorçage, boucle d'animation, bascule 2D/3D, câblage des commandes
src/core/           le modèle : grille, relief, tour de simulation — sans DOM
  geo.js            projection et constantes de grille (1300 × 594, 3,37 km)
  shapes.js         traits de côte lissés, ligne de partage ouest/est
  grid.js           rasterisation, MNT, détail fractal, ombrage
  hypsometry.js     courbe cumulée des profondeurs — aires et volumes en O(1)
  sim.js            le tour d'un an : chantiers, niveau, sel, opinion, ports, la mort
  state.js          l'état de partie (S) et les options d'affichage (opts)
  character.js      traits, plan, espérance de vie — le personnage, sans jauge
  ledger.js         le grand livre : clauses signées et obligations émises
  race.js           la courbe soviétique, les deux jauges, la rupture
  endgame.js        les fins : arrête l'horloge et annonce son verdict
  bus.js            ce que le modèle annonce à qui veut l'entendre
  journal.js        écrire une ligne de journal (S.log est de l'état, pas de l'écran)
  clock.js          vitesses du temps et changement de vitesse
src/data/           contenu figé : nations, projets, villes, frontières, dem.bin
src/content/        les 107 dossiers, 30 brèves, événements conditionnels, fins
  prologue.js       les onze cartes de 1926-1930, et leur moteur
  backers.js        les dix bailleurs : offres, clauses, échéances
  race.js           la course : leviers, incidents, Tchernobyl à trois issues
src/render/         le rendu Canvas 2D — le fond raster, reconstruit pixel à pixel
  overlays.js       les surcouches vectorielles, partagées par les deux rendus
src/render3d/       le rendu three.js — terrain, nappes par bassin, échelle verticale
  overlay.js        les mêmes surcouches, projetées par la caméra
src/ui/             HUD, onglets, journal, modales, actions exposées à `window`
  bridge.js         le seul point où le modèle et le DOM se rencontrent
  intro.js          les trois écrans d'ouverture : la porte, le prologue, l'Institut
tools/              MNT hors ligne, modèle sans navigateur, vérifications d'écran
reference/          la version 2D d'origine, un seul fichier, figée
```

**Le modèle n'appelle pas l'interface, il annonce.** `core/` et `content/` ne
touchent jamais au DOM : ils émettent sur `core/bus.js` — une ligne de journal,
un changement de vitesse, un dossier à trancher, un verdict de fin — et
`ui/bridge.js` est le seul module abonné. Sans abonné, `emit` ne fait rien, ce
qui permet à `tools/sim-check.mjs` de faire tourner huit parties complètes dans
Node, sans navigateur, en une vingtaine de secondes.

Les deux rendus, eux, lisent le même `S` sans jamais l'écrire ; ils ne
communiquent avec le modèle que par `core/dirty.js`, deux drapeaux de
rafraîchissement.

### Les surcouches, une fois pour les deux rendus

Frontières de 1930, toponymes, villes et leur distance à la mer, barrages,
volcans, failles, isobathes annotées, route maritime, panaches de sel : tout
cela vit dans `render/overlays.js`, qui ne connaît qu'un contexte 2D et une
fonction changeant une longitude-latitude en pixels. Le rendu plan lui donne sa
projection plate-carrée ; le rendu en relief lui donne sa caméra. Une correction
faite là vaut donc pour les deux vues, et les cases *Frontières* et *Toponymes*
agissent sur les deux.

En relief, deux précautions font toute la différence entre une carte et un
gribouillis. Chaque point se pose sur la **surface visible** — le maximum du
terrain et du niveau de son bassin — si bien qu'un port reste sur sa côte à
mesure que la mer se retire, et que la route maritime flotte au lieu de plonger
dans la plaine abyssale. Et un point **derrière la caméra** est écarté plutôt
que projeté : sans cela la division perspective le renvoie de l'autre côté de
l'écran, et les frontières se replient en éventail dès qu'on incline la vue.

Le dessin coûte de 0,3 à 0,9 ms selon le calque, et n'est refait que si quelque
chose a bougé — caméra, niveau, calque, année. Reste une limite assumée : les
étiquettes ne sont pas masquées par le relief, une ville derrière une montagne
se lit quand même. C'est une surcouche d'affichage, pas un objet de la scène.

### Données

Relief : [Terrain Tiles](https://registry.opendata.aws/terrain-tiles/), AWS Open Data —
agrégat de SRTM (NASA), NED (USGS), ETOPO1 et GEBCO. Domaine public ou licences libres
selon les sources.
