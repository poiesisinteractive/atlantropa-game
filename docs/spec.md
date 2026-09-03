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

### Tour 2 — le personnage (31/08/2026)

| Question | Décision | Conséquences |
|---|---|---|
| Formation | **Paris, l'École des Ponts.** (Contre ma recommandation, Berlin.) | Il lit Sörgel en traduction et par la presse, dont *L'Illustration*. Le fil français et africain domine : la France tient l'Algérie et le Maroc, donc la rive sud du barrage. Sa venue à Munich en 1930 est un *départ*, un choix de carte à part entière. |
| Institut | **Disciple dans l'Institut**, à Munich dès 1930. | Le joueur agit de l'intérieur, en désaccord croissant avec le maître (Hitler en exergue, 1938). L'héritage de 1952 est naturel. Le jeu actuel change le moins. |
| Prologue | **8 à 12 cartes, 1926-1930**, au rythme du reste. | Un acte court, rejouable, cinq minutes. Chaque carte pose un trait ou un choix de conception et laisse une trace au journal. La dernière carte est le départ pour Munich. |
| Mort | **Influencée par le jeu.** Espérance de base vers 1990, déplacée par surmenage, chantiers, exil, ennemis. Fenêtre ~1975-2000. | Un enjeu, pas une jauge affichée. Les cartes portent un coût de vie discret (⏳ à chiffrer). |

Arc du personnage, tel qu'il se dessine : né vers 1904-1906 dans une famille
russe, évacué en 1920 (Crimée, Wrangel), passeport Nansen en 1922, Paris, les
Ponts, lit Sörgel en 1929, part pour Munich en 1930. Français de formation,
allemand d'école, russe de deuil, apatride de papiers.

### Tour 3 — traits, conception, victoire (31/08/2026)

| Question | Décision | Conséquences |
|---|---|---|
| Axes de traits | **Les quatre** : idéaliste ↔ pragmatique · Afrique terre vide ↔ partenaire · loyauté ↔ indépendance envers Sörgel · Russie deuil ↔ revanche. | Quatre scalaires dans `S.traits`, posés au prologue, déplacés par les dossiers, lus par l'éligibilité (`c:`) et par des variantes de texte. |
| Visibilité | **Portrait en phrases.** Un onglet qui se remplit de phrases au fil des choix. Pas de barre, pas de chiffre. | Chaque carte qui touche un trait fournit sa phrase de portrait. Le joueur se lit, il ne se mesure pas. |
| Dimensions de conception | **Les quatre** : l'ouvrage-cœur · la cible d'abaissement · le bénéfice mis en avant · la place de l'Afrique dans le plan. | Un objet `S.plan` posé au prologue. Les clauses des bailleurs (acte I) peuvent le **trahir** : c'est là que naissent les fils narratifs. La cible d'abaissement change la physique et le seuil d'irréversibilité. |
| « Le projet vous survit » | **Des fins nommées à la mort**, comme aujourd'hui. L'état du monde décide : irréversibilité atteinte, institution assurée, ou projet mort avec lui. Le tableau « promis / obtenu » reste le verdict. | Les fins `siecle` et `victory` (−155 m) disparaissent ; `faillite`, `abandon`, `revolte`, `reflood` restent. Nouvelles fins : *irréversible*, *assuré*, *enterré avec lui* (⏳ à nommer et à écrire). La note interne du point de non-retour (−55 m) existe déjà. |

## 2. Questions ouvertes ⏳

- Le nom du héros.
- Les fins à la mort : noms, textes, seuils.
- Chiffrage du coût de vie des cartes.
- Modèle de financement (recommandation en attente : registre de bailleurs à
  clauses et échéances).
- Interactions sur la carte : villes (coordonnées existantes), pays (pas de
  polygones aujourd'hui), conflits (donnée nouvelle).
- Adaptation de `sim-check` : il force Gibraltar et saute la négociation ; il
  devra jouer le prologue ou démarrer en acte II.
