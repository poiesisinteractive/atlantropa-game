# Atlantropa — Le Grand Œuvre

Un jeu de gestion sur le projet réel d'**Herman Sörgel** (1885-1952) : barrer le détroit de
Gibraltar, abaisser la Méditerranée de deux cents mètres, et souder l'Europe à l'Afrique.

```
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

- Maillage **1300 × 594** cellules, rasterisation par balayage de lignes.
- Côtes lissées (Chaikin, 2 passes).
- **Modèle d'altitude** (39 massifs) et **bathymétrie** (19 bassins, 10 hauts-fonds),
  puis **ombrage** au soleil du nord-ouest : en se retirant, la mer découvre ses talus,
  ses canyons et ses plaines abyssales.
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

Le trait de côte et la bathymétrie sont schématiques et dessinés à la main : c'est un jeu,
pas un SIG.

## Technique

Aucune dépendance, aucun outil de build, un seul fichier. Canvas 2D, `ImageData`,
transformées de distance par chanfrein. Testé sur navigateurs de bureau récents.
