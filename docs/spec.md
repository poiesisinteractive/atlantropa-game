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

### Tour 4 — le nom, et l'acte I (31/08/2026)

| Question | Décision | Conséquences |
|---|---|---|
| Nom | **Alexeï Morev** — de *more*, la mer. À Paris on l'écrit Alexis Moreff. | Le nom porte le sujet sans le crier. |
| Financement | **Registre de bailleurs + obligations.** (Au-delà de ma recommandation, qui était le registre seul.) | Deux systèmes : les bailleurs pour le **prix politique** (clauses, échéances), les obligations pour le **prix financier** (taux, service, défaut). L'un a un visage, l'autre un chiffre. À équilibrer ensemble : un bailleur peut aussi *garantir* une émission. |
| Acte I | **Un état de la carte.** La carte existe dès 1930 : c'est celle au mur de l'Institut. Le registre est un onglet de plus. | Une seule interface. L'acte I, c'est la carte sans barrage ; l'acte II commence à la première pierre. Aucun changement d'écran. |
| Bailleurs | **Les quatre blocs** : régimes, argent privé, institutions, puissances coloniales. | Dix bailleurs nommés, ci-dessous. |

#### Le registre des bailleurs

Chaque bailleur a : une **fenêtre** (quand il se présente), une **offre** (argent,
main-d'œuvre, légitimité), une **clause** inscrite au grand livre, et une
**échéance** — le moment de l'Histoire où la clause présente sa note, sous
forme de dossier. Les traits du prologue et `S.plan` gouvernent qui se
présente et à quel prix ; les clauses peuvent **trahir** `S.plan` — c'est là
que naissent les fils narratifs.

| Bailleur | Fenêtre | Offre | Clause | Échéance |
|---|---|---|---|---|
| **Italie fasciste** | 1930-1943 | Argent, 20 000 ouvriers | La digue Sicile–Tunisie d'abord ; l'ouvrage s'appelle *route impériale* ; l'Afrique du Nord relève de Rome | 1943 : le régime tombe, la clause devient toxique ; l'Italie de 1946 renégocie |
| **Allemagne du Reich** | 1933-1945 | Le plus gros chèque du jeu | L'Institut devient organe du Reich ; exclusivité allemande sur les turbines ; la tour de Behrens change de nom | 1945 : tout ce qui fut signé sous le Reich est dénoncé, l'Institut épuré. Lit l'axe *loyauté à Sörgel*, qui a mis Hitler en exergue en 1938 |
| **URSS** | 1934-1939, puis 1955-1991 | Ingénieurs, l'expertise GOELRO, de l'argent par l'Amtorg | Une délégation soviétique *dans* l'Institut ; une part de l'énergie vers l'Est ; et, pour Morev seul, **un passeport soviétique** | 1939 : le pacte germano-soviétique rend la clause intenable. 1955 : la main tendue de Khrouchtchev ouvre la phase 4. Lit l'axe *Russie* |
| **Consortium rhénan** (ciment, turbines) | 1930-1960 | Argent, matériel | Exclusivité des turbines ; Gibraltar d'abord, là où vont les machines | 1938-1945 : ce sont les fournisseurs du Reich ; 1951 : la question du cartel |
| **Banques de Zurich** | 1930-… | Le marché | Taux ; sûretés sur les **terres émergées** ; veto sur la cible réversible | C'est le **visage des obligations**. « La Bourse de Zurich cote des terrains à −100 m » existe déjà en brève |
| **Société des Nations** | 1930-1939 | Peu d'argent, beaucoup de légitimité | Neutralité ; internationalisation de l'ouvrage | 1939 : la SDN meurt et la légitimité avec. Se heurte au *mémorandum espagnol* (souveraineté), déjà en jeu ; l'ONU hérite (Bandung 1955) |
| **Le Vatican** | 1930-… | Modeste ; l'opinion catholique | Œcuménisme ; aucun bailleur « sans Dieu » | Récurrente ; incompatible avec l'URSS. Le patriarche de Venise existe déjà |
| **Plan Marshall** | 1948-1952 | Gros chèque, en dollars | Alignement (aucun soviétique) ; entreprises américaines | **1953 : *Atoms for Peace*.** Le bailleur qui vous a financé vend l'atome. La charnière de la phase 4 |
| **France** (Ponts, ministère des Colonies) | 1930-1962 | Par son école : réseau, argent | Souveraineté sur la rive sud ; part algérienne | 1954-1962 : la guerre d'Algérie fait de la clause un front. Le *Makhzen* existe déjà en dossier |
| **Amirauté britannique** | 1930-1956 | Le Rocher | L'écluse militaire de 300 m | 1940, Mers el-Kébir ; 1956, Suez. *Le Rocher* existe déjà en dossier |

Dix, c'est le plafond : on en retire deux si le tour de jeu s'encombre (le
Vatican et l'Amirauté sont ceux dont les dossiers existants font déjà le
travail).

#### Les obligations — proposition

Étendre la dette actuelle (`S.debtService`, `S.debtUntil`) en **émissions** :
un montant, une durée, un taux. Le taux suit le soutien et l'opinion (un projet
qu'on croit mort emprunte cher), et une garantie de bailleur le baisse — c'est
le pont entre les deux systèmes. Le service de la dette est une dépense annuelle
comme aujourd'hui. Le **défaut** est la `faillite` existante. Rien de neuf dans
l'interface au-delà d'une ligne *Émettre* dans l'onglet Trésorerie. ⏳ Chiffres
à poser au premier prototype.

### Tour 5 — la carte, la course, l'ordre (03/09/2026)

| Question | Décision | Conséquences |
|---|---|---|
| Première pierre | **Question déplacée.** Plutôt qu'une condition de passage, le joueur veut *l'histoire alternative* : ce que le projet aurait pu changer à la géopolitique. C'est un **moteur supplémentaire**, à itérer (tour 6). | Aujourd'hui l'Histoire est un rail : six dossiers à année imposée (`fy:` 1939, 1952, 1954, 1956, 1962, 1973) que le projet subit sans jamais les infléchir. Le moteur inverse le sens : le monde *répond* au projet. Proposition ci-dessous. |
| Interactions sur la carte | **Villes, pays, conflits, chantiers** — les quatre. | Villes : coordonnées existantes. Chantiers : `S.active`/`S.prog` existent, il manque le clic. Pays : `nat[].att` existe, pas de polygone. Conflits : donnée nouvelle, produite par le moteur d'histoire alternative — la phase 3 en dépend. |
| La course avec l'URSS | **Propagande, renseignement, main tendue de Moscou, pari nucléaire** — et *autre chose*, non précisé. ⏳ À nommer au tour 6. | Quatre leviers, deux par camp : la propagande et le pari nucléaire sont ce que Morev *fait* ; le renseignement et la main tendue sont ce que Moscou *lui fait*. |
| Ordre de réalisation | **1 → 2 → 4 → 3.** Personnage, financement, course, carte enrichie. | Chaque phase = une PR jouable. La carte enrichie ferme la marche parce qu'elle consomme les données des trois autres (conflits, bailleurs, course). |

#### Le moteur d'histoire alternative — proposition

Ce qui existe : `nat[]` porte quatorze pays avec une attitude (`att`) et un poids
(`ct`) ; six dossiers d'Histoire tombent à date fixe ; le projet n'a d'effet
que sur les attitudes. Le monde ne bouge jamais.

Ce qui manque : que la Méditerranée fermée *change la guerre*, que la mer
abaissée *change Suez*, que les gigawatts *changent 1973*. Trois couches :

1. **Des charnières.** Six à huit dates de l'Histoire deviennent des
   *embranchements* : chacune a son issue historique (celle qu'on connaît,
   quand le projet est trop petit pour peser) et une ou deux **divergences**
   écrites, déclenchées par l'état du projet à cette date. La divergence a un
   prix et un visage : la digue devient un objectif de guerre, l'écluse de
   Suez devient *votre* Suez, l'embargo de 1973 ne mord pas l'Europe.
2. **Des postures.** L'attitude d'un pays se lit en posture — allié, neutre,
   hostile, en guerre — et les postures produisent les **conflits** de la
   carte (phase 3). Un conflit est un pays en guerre contre un autre, ou
   contre l'ouvrage.
3. **Une chronologie.** Un onglet où la frise réelle se barre au fur et à
   mesure des divergences : le joueur *voit* l'Histoire qu'il a tordue. Un
   indice de divergence alimente les fins.

Charnières candidates, avec ce que le projet doit avoir fait pour les faire
dévier :

| Date | Histoire | Divergence si… | Ce que ça coûte |
|---|---|---|---|
| 1940-43 | Mers el-Kébir, Malte, l'Afrika Korps | Gibraltar fermé ou en chantier : la Méditerranée est un lac, la Regia Marina ne sert à rien ; la digue Sicile–Tunisie ravitaille Rommel par la route | La digue est bombardée, occupée, ou tenue par le camp qui gagne |
| 1943-45 | L'énergie du Reich | Des gigawatts livrés à l'Allemagne avant 1943 | La guerre dure plus longtemps : la divergence la plus sombre du jeu, et l'échéance du bailleur *Reich* |
| 1948-52 | Plan Marshall | Une Europe qui produit déjà son courant | Le chèque est plus petit, la clause plus lourde ; *Atoms for Peace* arrive plus tôt |
| 1954-62 | Guerre d'Algérie | Des terres émergées et des colons sur la rive sud (le dossier *colons* existe) | Le front se déplace sur *vos* terres ; ou l'Algérie devient copropriétaire |
| 1956 | Suez | La mer est déjà en dessous du canal : Suez est une écluse, et elle est à vous | Nasser nationalise *votre* écluse ; la crise se joue contre l'Institut |
| 1973 | L'embargo | `S.power` suffisant pour l'Europe du Sud | L'OPEP ne mord pas ; le cartel vous vise ; le dossier *oil* change de sens |
| 1975 | Mort de Franco | Le barrage est en Espagne : l'Espagne est une puissance | Madrid réclame l'ouvrage ; le *mémorandum espagnol* présente sa note |
| 1989-91 | Chute du mur | Le courant de l'Est vient de la Méditerranée (clause soviétique) | Qui garde les lignes ? La fin de la course se joue là |

⏳ Tout ceci est ouvert : nature du moteur (scripté, systémique, ou hybride),
charnières retenues, où le joueur voit la divergence, et si le monde peut se
retourner *contre* le projet.

### Tour 6 — le moteur d'histoire alternative (03/09/2026)

| Question | Décision | Conséquences |
|---|---|---|
| Nature | **Hybride.** Des postures de pays calculées à partir des attitudes existantes, qui déclenchent des charnières écrites à la main. | Le calcul décide, le texte raconte. `nat[].att` devient la source d'une posture (allié / neutre / hostile / en guerre) ; les six dossiers `fy:` deviennent des charnières à plusieurs issues. |
| Charnières | **Les quatre** (1940-45, 1954-62, 1973, 1975-91) **plus Tchernobyl 1986**, dans une version où la catastrophe est bien plus mortelle et change la donne face à l'énergie de l'eau. Et, en amont : **des incidents nucléaires avant 1986 selon la pression mise sur l'URSS** dans la partie ; **de même pour les barrages**, dont les incidents peuvent mener au désastre. | Un **système d'incidents** naît ici — symétrique : l'atome et l'eau portent chacun leur risque de catastrophe. C'est probablement le cinquième levier de la course resté sans nom au tour 5. Proposition ci-dessous. |
| Affichage | **Les quatre** : chronologie, brèves, carte, fins. | La chronologie est l'onglet du moteur ; les brèves son bruit de fond ; la carte (phase 3) ses postures et conflits ; les fins son bilan. |
| Menace | **Oui, jusqu'à la perte.** Un barrage peut être bombardé, occupé, saisi. | Une fin nouvelle, *l'ouvrage confisqué*, et des dégâts qui coûtent des années. Le prix à payer de la phase 2 prend un corps. |

#### Le système d'incidents — proposition

Deux jauges de risque, une par camp, alimentées par ce que le joueur fait :

| | Jauge | Ce qui la monte | Ce qui la baisse | Ce qu'elle produit |
|---|---|---|---|---|
| **L'atome** | pression sur l'URSS | l'écart de la course (les GW que Moscou doit rattraper), la propagande, les révélations sur la sûreté soviétique | la main tendue acceptée, une coopération technique | des incidents à Kychtym, Leningrad, Beloïarsk… avant 1986 ; puis **Tchernobyl** dont la gravité est celle de la jauge : historique, aggravée, ou *l'Europe contaminée* |
| **L'eau** | risque d'ouvrage | la hâte (cadence de chantier), l'entretien sous-financé, les séismes existants (`S.quakes`), les dégâts de guerre, le sabotage (le *renseignement* de Moscou) | les dossiers de sûreté existants (`caissons`, `undertow`, `corrosion`, `breach`), un budget d'entretien | des incidents de barrage (fuite, vanne, affouillement) puis **la rupture** — l'équivalent de Tchernobyl côté eau |

La symétrie est le sens : ce que Morev fait subir à l'atome, l'eau peut le
subir aussi. Un Tchernobyl aggravé discrédite l'atome et fait de l'eau
l'énergie de l'Europe — mais le vent souffle vers l'ouest, et les terres
émergées reçoivent les retombées. Une rupture de barrage est la réinondation
zancléenne, en une nuit et sur des gens : l'issue `reflood` existe, elle
change de cause.

Ce qui existe déjà et sert de socle : `quake` (2 %/an sous −70 m), `breach`
(brèche volontaire), `reflood` (fin), `S.quakes`, les dossiers techniques.
Ce qui manque : les deux jauges, les incidents gradués, et Tchernobyl comme
charnière à trois issues.

⏳ Ouvert : ce qui alimente chaque jauge au juste, l'échelle des incidents,
si un Tchernobyl aggravé peut gagner la course à lui seul, et si la rupture
est une fin ou un dégât.

## 2. Questions ouvertes ⏳

- Les fins à la mort : noms, textes, seuils.
- Chiffrage du coût de vie des cartes.
- Acte I : chiffres des obligations. (La première pierre est devenue une
  question du moteur d'histoire alternative.)
- Système d'incidents : jauges, échelle, portée de Tchernobyl, la rupture
  (tour 7).
- Moteur d'histoire alternative : les postures (seuils d'attitude), le texte
  des charnières, la fin *l'ouvrage confisqué*.
- Interactions sur la carte : pays (pas de polygones aujourd'hui), conflits
  (produits par le moteur d'histoire alternative).
- Adaptation de `sim-check` : il force Gibraltar et saute la négociation ; il
  devra jouer le prologue ou démarrer en acte II.
