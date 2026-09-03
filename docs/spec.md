# Atlantropa — spécification des évolutions

Document vivant, construit par questions-réponses. Chaque tour enregistre les
décisions prises, ce qu'elles ferment, ce qu'elles ouvrent. Les questions
encore ouvertes sont marquées ⏳.

## 0. Cadre

Quatre phases voulues : **personnage**, **financement et géopolitique**,
**carte enrichie**, **course avec l'URSS**. Elles ne sont pas quatre actes :
les deux premières précèdent la carte, la troisième *est* la carte, la
quatrième se joue *dans* la carte (1954-1991).

Structure retenue :

| | Période | Contenu |
|---|---|---|
| Prologue | ~1926-1930 | Le personnage : traits, premier choix de conception |
| Acte I | 1930-~1938 | Le financement : bailleurs, clauses, prix à payer |
| Acte II | de la première pierre à la mort du héros | La carte. Seconde moitié : la course avec l'URSS |

Charnière historique : Sörgel meurt en décembre 1952, le nucléaire civil arrive
en 1954 (Obninsk) et tue l'argument énergétique. Le héros hérite du chantier au
moment où il faut lui trouver une autre raison d'être.

### Deux faits physiques qui contraignent tout

- **Un humain ne verra jamais la plaine de sel.** La mer descend de 0,95 m/an
  au mieux. −155 m demande 163 ans après la fermeture de Gibraltar. La victoire
  actuelle est hors d'une vie.
- **La puissance suit la descente** (débit × hauteur de chute). Gibraltar
  fermé en 1942, turbinage par défaut : ~5 GW en 1980.

## 1. Décisions prises

### Tour 1 — les fondations (31/08/2026)

| Question | Décision | Conséquences |
|---|---|---|
| Sörgel | **Existe dans le monde ; le héros n'est pas lui.** Il lit *Mittelmeer-Senkung* en 1929 et veut faire mieux. L'Institut lui échoit à la mort de Sörgel, décembre 1952. | Les 67 dossiers gardent leurs ancrages. La mort de 1952 devient la charnière. Le Sörgel qui courtise Hitler en 1938 est un fil : le héros apatride face au Munichois. |
| Durée | **La vie du héros**, 1930 jusqu'à sa mort (vers 1985-2000). | Le jeu passe de 210 ans à ~60. La victoire à −155 m disparaît ; elle est redéfinie : *le projet vous survit* (⏳ à préciser). La fin `siecle` (2140) disparaît. |
| Origine | **Fils d'émigrés russes**, apatride depuis 1921, passeport Nansen. | L'URSS est la patrie perdue *et* le rival : la phase 4 est personnelle. |
| Course URSS | **Atome contre eau** : la course porte sur les watts produits par les centrales nucléaires soviétiques. (Réponse libre, à la place de mes quatre options.) | Voir ci-dessous : ce choix est meilleur que les miens, et il est déjà dans la physique du jeu. |

#### Pourquoi « atome contre eau » est la bonne course

Le nucléaire soviétique part de **zéro en 1954**, l'année même où il tue
l'argument de Sörgel. La course commence donc à égalité, au moment de la
charnière. Courbe réelle, en GW installés : 0,005 (Obninsk, 1954) · ~1 (1970)
· ~5 (1975) · ~12 (1980) · ~27 (1985) · **Tchernobyl (1986)** · ~34 (1990).

Et la course est **gagnable, mais à un prix qui est exactement le nœud du
jeu**. En 1980, avec 24 m de descente, le joueur produit 5 GW au réglage par
défaut (35 % de turbinage) — mais **14 GW à 100 %**, ce qui bat les 12 GW
soviétiques. Sauf qu'à 100 % la mer ne descend plus : gagner la course, c'est
renoncer au continent. L'atome soviétique n'est pas un score à côté du jeu,
c'est **le curseur des vannes avec un visage et une horloge**. Et Tchernobyl
en 1986 est le pendant du sel : les deux promesses d'énergie infinie ont un
grand livre caché.

## 2. Questions ouvertes ⏳

- Formation et ville du héros ; sa position vis-à-vis de l'Institut 1930-1952.
- Forme et longueur du prologue ; visibilité des traits.
- Mécanique de la mort ; définition de « le projet vous survit ».
- Modèle de financement (recommandation en attente : registre de bailleurs à
  clauses et échéances).
- Interactions sur la carte : villes (coordonnées existantes), pays (pas de
  polygones aujourd'hui), conflits (donnée nouvelle).
- Adaptation de `sim-check` : il force Gibraltar et saute la négociation ; il
  devra jouer le prologue ou démarrer en acte II.
