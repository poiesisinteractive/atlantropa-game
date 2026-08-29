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
  ligne Cap Bon–Trapani, que nulle donnée ne donnerait. Le relief, lui, décide d'où est
  la terre — d'où les Cyclades, la Dalmatie et les Baléares, que la carte à la main ne
  dessinait pas.
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
décisions, pas de l'horloge : **70 dossiers** à trancher, qui mettent le jeu en pause.

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
le **Canvas 2D** d'origine, conservé comme étalon visuel.

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
npm run dev      # serveur de développement
npm run build    # bundle de production
npm run lint

node tools/fetch-dem.mjs     # recuire le relief depuis les Terrain Tiles
node tools/smoke.mjs         # non-régression : boot, 40 ans, calques, onglets
node tools/hypso-check.mjs   # la table hypsométrique contre le balayage complet
node tools/ui3d-check.mjs    # les commandes du relief, par l'interface réelle
node tools/shot3d.mjs        # captures du relief
```

`ui3d-check` passe délibérément par des clics et des glissers plutôt que par
`window.__atl` : c'est ce qui manquait au test de fumée, qui appelait les
fonctions directement et ne pouvait donc pas voir qu'un canvas mal placé dans
l'ordre du DOM recouvrait les commandes et interceptait leurs clics.

Les deux derniers outils pilotent Chromium via `playwright-core`, en réutilisant les
navigateurs déjà installés sur la machine.

### Données

Relief : [Terrain Tiles](https://registry.opendata.aws/terrain-tiles/), AWS Open Data —
agrégat de SRTM (NASA), NED (USGS), ETOPO1 et GEBCO. Domaine public ou licences libres
selon les sources.
