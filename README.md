# Atlantropa — Le Grand Œuvre

Un jeu de gestion sur le projet réel d'**Herman Sörgel** (1885-1952) : barrer le détroit de
Gibraltar, abaisser la Méditerranée de deux cents mètres, et souder l'Europe à l'Afrique.

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

## Événements

Le temps est long — deux siècles, jusqu'à 29 secondes par année. Le rythme vient des
décisions, pas de l'horloge : **67 dossiers** à trancher, qui mettent le jeu en pause.

Diplomatie (Montreux 1936, Bandung 1955, la clause impériale de Mussolini), ingénierie
(caissons retournés, corrosion saline, les ossements de Gallipoli sous le chantier des
Dardanelles), économie (krach de 1931, emprunts avec service de dette sur 40 ans),
villes (la lettre du patriarche de Venise, le gypse dans les poumons des enfants de
Provence, *qui peuplera les terres neuves*), science (le rapport Rouch de 1935, les
carottes du Glomar Challenger en 1971, les épaves puniques qui ressortent et se délitent
à l'air), et les rendez-vous imposés par l'Histoire.

S'y ajoutent 30 brèves d'ambiance et un bilan décennal.

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
installés sur la machine : il leur faut donc **un serveur déjà lancé**, et l'URL
en premier argument. Les valeurs par défaut ne sont pas les mêmes partout —
`:5173` pour `smoke`, `:4188` pour les trois autres — le plus sûr est de la
passer explicitement.

```sh
node tools/fetch-dem.mjs                              # recuire le relief depuis les Terrain Tiles
node tools/sim-check.mjs                              # le modèle seul : 8 parties, NaN et invariants
node tools/smoke.mjs       http://localhost:5173/     # non-régression : boot, 40 ans, calques, onglets
node tools/hypso-check.mjs http://localhost:5173/     # la table hypsométrique contre le balayage complet
node tools/ui3d-check.mjs  http://localhost:5173/     # les commandes du relief, par l'interface réelle
node tools/shot3d.mjs      http://localhost:5173/ . -120 0 55   # captures du relief
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

`ui3d-check` passe délibérément par des clics et des glissers plutôt que par
`window.__atl` : c'est ce qui manquait au test de fumée, qui appelait les
fonctions directement et ne pouvait donc pas voir qu'un canvas mal placé dans
l'ordre du DOM recouvrait les commandes et interceptait leurs clics.

### Structure

```
index.html          la coquille : barre d'état, carte, panneau latéral, journal
src/main.js         amorçage, boucle d'animation, bascule 2D/3D, câblage des commandes
src/core/           le modèle : grille, relief, tour de simulation — sans DOM
  geo.js            projection et constantes de grille (1300 × 594, 3,37 km)
  shapes.js         traits de côte lissés, ligne de partage ouest/est
  grid.js           rasterisation, MNT, détail fractal, ombrage
  hypsometry.js     courbe cumulée des profondeurs — aires et volumes en O(1)
  sim.js            le tour d'un an : chantiers, niveau, sel, opinion, ports
  state.js          l'état de partie (S) et les options d'affichage (opts)
  endgame.js        les six fins : arrête l'horloge et annonce son verdict
  bus.js            ce que le modèle annonce à qui veut l'entendre
  journal.js        écrire une ligne de journal (S.log est de l'état, pas de l'écran)
  clock.js          vitesses du temps et changement de vitesse
src/data/           contenu figé : nations, projets, villes, frontières, dem.bin
src/content/        les 67 dossiers, 30 brèves, événements conditionnels, fins
src/render/         le rendu Canvas 2D — le fond raster, reconstruit pixel à pixel
  overlays.js       les surcouches vectorielles, partagées par les deux rendus
src/render3d/       le rendu three.js — terrain, nappes par bassin, échelle verticale
  overlay.js        les mêmes surcouches, projetées par la caméra
src/ui/             HUD, onglets, journal, modales, actions exposées à `window`
  bridge.js         le seul point où le modèle et le DOM se rencontrent
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
