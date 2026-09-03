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

### Tour 7 — les incidents (03/09/2026)

| Question | Décision | Conséquences |
|---|---|---|
| Jauge atome | **Les quatre** : l'écart de la course, la propagande, le refus de la main tendue, l'embargo technologique. | Tout ce que Morev fait *contre* Moscou monte la jauge. Elle ne baisse que par la coopération : la main tendue acceptée, une clause en échange. L'embargo se retourne : le renseignement soviétique passe côté eau. |
| Jauge eau | **Les quatre** : la hâte, l'entretien sous-financé, la guerre et le sabotage, les séismes — **plus l'Etna**, très actif, qui peut semer la zizanie. | L'Etna s'ajoute au socle sismique existant (`messina`, `sismRisk`, `quake`). Il touche la digue Sicile–Tunisie et Messine : éruptions, coulées, séismes flanc est. Ce n'est pas un choix du joueur : c'est le monde. Mais choisir Sicile–Tunisie d'abord (clause italienne) *choisit* l'Etna. |
| Tchernobyl aggravé | **Il fait basculer, à un prix.** L'atome est discrédité, les GW soviétiques chutent, l'Europe demande l'eau ; mais le vent souffle vers l'ouest. | Retombées sur les terres émergées, opinion, réfugiés. La victoire dans la course arrive salie, et les fins demandent au joueur s'il l'a voulue. |
| Rupture | **Une fin à la grande échelle seulement.** Gibraltar rompu = `reflood` réécrite en catastrophe humaine. Les autres ouvrages = dégâts lourds, années perdues, pays en colère. | L'échelle décide. Une seule fin par rupture, la plus grande ; le reste est du temps et de la réputation perdus. |

#### Les jauges — chiffres à poser

Deux grandeurs nouvelles dans `S`, de 0 à 100 :

| | `S.pressure` (atome) | `S.strain` (eau) |
|---|---|---|
| Monte de | écart de course × k · propagande · main tendue refusée · embargo | hâte × k · entretien manquant · dégâts de guerre · sabotage · séismes · Etna |
| Baisse de | main tendue acceptée, coopération technique | budget d'entretien, dossiers de sûreté (`caissons`, `corrosion`, `sismique`) |
| Produit | incidents gradués (Kychtym 1957, Leningrad 1975, Beloïarsk 1978 sont les dates réelles ; le jeu peut les avancer ou les aggraver) ; en 1986, Tchernobyl à trois issues : historique < 40, aggravée 40-70, *l'Europe contaminée* > 70 | incidents gradués (fuite, vanne, affouillement) ; au-delà d'un seuil, tirage annuel d'une rupture : petit ouvrage = dégâts, Gibraltar = `reflood` |
| Où on le voit | l'onglet Course et la chronologie | l'onglet Chantier et la chronologie |

Les seuils ci-dessus sont des points de départ pour `sim-check`, pas des décisions.

### Tour 8 — postures, chronologie, fins (03/09/2026)

| Question | Décision | Conséquences |
|---|---|---|
| Suite | **Fermer toutes les questions ouvertes** avant la phase 1. | Un ou deux tours de plus : fins à la mort, coût de vie des cartes, chiffres des obligations, `sim-check`. |
| Postures | **Seuils fixes avec hystérésis.** Allié > 65, neutre 35-65, hostile < 35, en guerre < 15 *et* une charnière de guerre ouverte. Un pays ne change de posture qu'après deux ans hors de sa bande. | Lisible, testable : `sim-check` vérifie qu'aucune posture ne clignote. `nat[].posture` et `nat[].since` s'ajoutent à l'état. |
| Chronologie | **Frise à deux lignes.** En haut l'Histoire réelle, dates fixes, barrées quand déviées ; en bas la vôtre : charnières, incidents, ruptures, mort du héros. Indice de divergence en tête ; un clic rouvre le dossier. | Nouvel onglet. La ligne du haut est une donnée statique (`data/history.js`), la ligne du bas se construit depuis le journal. |
| Fins à la mort | **Par ce qu'il laisse** : le nom est l'état du monde à sa mort. | Six à huit fins, une par combinaison de niveau, course et posture. Liste à arrêter au tour 9. |

### Tour 9 — les fins, la vie, la dette, les charnières (03/09/2026)

| Question | Décision | Conséquences |
|---|---|---|
| Fins à la mort | **Les neuf.** Cinq du monde, deux de la course, celle de l'homme, celle de la rupture. | `content/endings.js` passe de six fins à neuf ; `siecle` et `victory` disparaissent, `reflood` est réécrite. Table ci-dessous. |
| Coût de vie | **Une espérance en années.** Mort attendue en 1990 ; les cartes retirent ou rendent des mois. Jamais affichée : le journal glisse des signes. | `S.lifeExpectancy` en années fractionnaires, `S.health` non affiché. Barème ci-dessous. |
| Obligations | **Émissions de 10 à 40 Md**, 15 ou 25 ans. Taux de base 4 %, +1 point par tranche de 20 de soutien manquant, −1,5 point si un bailleur garantit. Deux émissions vives au maximum. | Le service annuel s'ajoute à la dépense existante (`S.debtService` en porte déjà la forme). Le défaut est la `faillite` actuelle, à −12 Md. |
| Texte des charnières | **Comme les dossiers existants** : titre, trois lignes, trois options chiffrées ; la charnière ne se distingue que par ses conditions et sa trace sur la chronologie. | Aucune forme nouvelle à écrire dans l'interface. Je les écris, vous corrigez. |

#### Les neuf fins

| Nom | Condition à la mort du héros | Ce qu'elle dit |
|---|---|---|
| **La mer basse** | Point de non-retour passé (< −55 m), Institut maître de l'ouvrage | L'œuvre lui survit. La fin la plus proche d'une victoire. |
| **Une plaine de sel** | < −100 m, mais `dust` élevé, ports morts, opinion basse | Il a réussi, et le prix est visible depuis l'espace. |
| **Le lac des autres** | L'ouvrage vit, l'Institut n'en est plus maître (bailleurs, États, cartel) | Il a construit pour d'autres. |
| **L'ouvrage confisqué** | Un État a saisi un barrage (charnière de guerre, posture *en guerre*) | Le monde s'est retourné contre le projet. Décidée au tour 6. |
| **Enterré avec lui** | Chantiers à l'arrêt, soutien effondré, rien d'irréversible | Le projet meurt à sa mort. |
| **Le courant de l'Europe** | Les GW de l'eau dépassent l'atome soviétique à la fin de la course | La course gagnée — au prix de la descente, qui s'est arrêtée. |
| **L'atome a gagné** | Moscou l'emporte, ou Tchernobyl n'a pas suffi | L'argument de 1954 avait raison. |
| **Le passeport** | Main tendue acceptée, clause soviétique honorée | Il meurt soviétique. La patrie retrouvée contre l'œuvre. |
| **La nuit zancléenne** | Gibraltar rompu (`S.strain`) | La mer revenue en une nuit, sur des gens. Réécriture de `reflood`. |

Croisement : les fins de la course l'emportent si la course est jouée jusqu'au
bout ; *La nuit zancléenne* et *L'ouvrage confisqué* l'emportent sur tout.

#### Barème du coût de vie

Espérance de départ : **1990**. Les cartes la déplacent en mois, sans jamais
l'afficher.

| Ce qui coûte | Mois |
|---|---|
| Un chantier suivi sur site | −4 |
| Une année de surmenage (deux chantiers actifs, trésorerie négative) | −3 |
| L'exil (Zurich sous le Reich, ou plus loin) | −6 |
| Une rupture vécue, un incident majeur | −12 |
| Un procès, une commission d'enquête | −2 |
| Le retrait, une année sans décision lourde | +3 |
| Zurich, le calme, un médecin | +6 |

Fenêtre effective : ~1975-2000, comme posé au tour 2. Le journal glisse des
signes (« vous toussez à nouveau », « le médecin insiste ») quand l'espérance
descend sous certains paliers.

### Tour 10 — la carte et l'outillage (03/09/2026)

| Question | Décision | Conséquences |
|---|---|---|
| Pays | **Teinter les côtes.** Chaque pays colore son trait de côte selon sa posture, sur quelques centaines de kilomètres. | Zéro donnée nouvelle : les côtes sortent déjà du modèle de terrain, et `render/overlays.js` étant partagé, la teinte marche en 2D comme en relief sans code en double. Aucune frontière figée à 1930 à faire vieillir jusqu'en 1991. |
| Conflits | **Ancrés sur l'ouvrage visé** : un barrage, un port, une terre émergée. Marqueur qui pulse, clic vers le dossier. | Les conflits du jeu portent tous sur l'ouvrage — le marqueur est donc toujours à un endroit qui existe déjà dans l'état (`S.built`, `S.active`, les villes). |
| `sim-check` | **Il joue tout, au hasard**, prologue compris, jusqu'à la mort du héros, et balaye les nouvelles grandeurs. | La porte du modèle couvre `S.pressure`, `S.strain`, l'indice de divergence, l'espérance de vie, la dette. Les 8 parties × 210 ans deviennent 8 parties × ~65 ans : plus rapide, et enfin représentatives de ce qu'un joueur fait. |

Toutes les questions de spécification sont closes. La suite est l'écriture,
dans l'ordre convenu : **1 personnage → 2 financement → 4 course → 3 carte**,
une phase par PR jouable.

## 2. Vue d'ensemble — ce que la spec ajoute au code

Pour lire les six tours d'un coup. Chaque ligne est un module ou une donnée,
avec la phase qui la porte (ordre convenu : 1 → 2 → 4 → 3).

| Phase | Ce qui s'ajoute | Où |
|---|---|---|
| 1 Personnage | Le prologue (1926-1930), les 8-12 cartes, les quatre traits, le portrait en phrases, la mort influencée et ses fins nommées | `content/prologue.js`, `S.traits`, `S.plan`, `content/endings.js` |
| 2 Financement | Le registre des bailleurs (10), les clauses au grand livre et leurs échéances en dossiers, les obligations (émissions, taux, défaut) | `content/backers.js`, `S.ledger`, `S.bonds`, onglet Registre |
| 4 Course | Les GW soviétiques, les quatre leviers (propagande, renseignement, main tendue, pari nucléaire), `S.pressure`, les incidents atome, Tchernobyl à trois issues | `core/race.js`, `content/race.js`, onglet Course |
| 4 aussi | `S.strain` et les incidents eau, l'Etna, la rupture ; ils existent dès que le chantier existe mais leur sens vient de la course | `core/risk.js`, `content/incidents.js` |
| transversal | Le moteur d'histoire alternative : postures depuis `nat[].att`, charnières à plusieurs issues (les six `fy:` réécrites + 1986), l'indice de divergence, la fin *l'ouvrage confisqué* | `core/history.js`, `content/hinges.js`, onglet Chronologie |
| 3 Carte | Villes, pays, conflits, chantiers cliquables ; postures et conflits dessinés | `render/overlays.js` (existe), `render/interact.js`, polygones de pays (donnée nouvelle) |
| outillage | `sim-check` joue le prologue ou démarre en acte II ; balaye `S.pressure`, `S.strain`, l'indice de divergence | `tools/sim-check.mjs` |

## 3. Questions ouvertes ⏳

Aucune question de spécification n'est ouverte. Ce qui reste se tranche au
contact du code, et non par écrit :

- Les seuils des deux jauges (`S.pressure`, `S.strain`) et le barème de vie :
  posés au chiffre proposé, réglés au premier `sim-check`.
- Le texte des charnières et des neuf fins : écrit à la phase concernée,
  relu par le joueur.

## 4. Journal de réalisation

### Phase 1 — le personnage (03/09/2026, branche `claude/phase1-personnage`)

Livré : `core/character.js` (quatre traits, le plan, l'espérance de vie),
`content/prologue.js` (onze cartes de 1926 à 1930, à variantes tirées au sort),
l'onglet **Portrait** en phrases, les trois écrans d'ouverture, les neuf fins
avec leur sélecteur, trois dossiers neufs qui paient les dettes du prologue
(l'exergue de 1938, le carnet vert, l'invitation de Moscou), les effets
`E.tr` / `E.vie` / `E.port`, et un `sim-check` qui joue le prologue.

**Un écart avec la spécification, et pourquoi.** Le tour 9 plaçait *La mer
basse* au point de non-retour de −55 m. La porte du modèle a montré que le
meilleur cas physique d'une vie d'homme — Gibraltar fermé en 1935, vannes
closes, argent illimité, tous les ouvrages lancés — s'arrête à **−43 m** :
0,95 m/an au mieux, soixante ans au plus. Le seuil rendait la fin
inatteignable et n'en laissait qu'une, *Enterré avec lui*, quoi que fasse le
joueur.

Ce qui le remplace n'est pas un seuil plus bas mais une autre idée de
l'irréversibilité : celle des comptes et des traités plutôt que celle de la
roche. *La mer basse* demande un ouvrage qui descend (≤ −12 m), un Institut
soutenu (≥ 60) et un consortium qui tient (≥ 6 nations) ; *Le lac des autres*
est le même ouvrage sans la maîtrise ; *Une plaine de sel* l'emporte sur les
deux dès que la poussière ou les ports morts passent leurs seuils. Le point de
non-retour narratif descend à −35 m, atteignable dans une bonne partie.
`sim-check` rejoue désormais le meilleur cas à chaque lancement et échoue si
le bilan le plus favorable redevient inatteignable.

⏳ Reste ouvert pour la phase 2 : les fins `confisque`, `courant`, `atome` et
`passeport` attendent les drapeaux de leurs systèmes (saisie d'État, course,
clause soviétique) et ne peuvent pas encore tomber.

### Décision de calibrage (03/09/2026)

L'espérance longue est conservée : mort attendue en 1990, fenêtre 1975-2000,
soit un homme de 70 à 95 ans. C'est vingt ans de plus que Sörgel, et c'est
délibéré — la course avec l'URSS a besoin d'un porteur vivant en 1986 et en
1989.

### Phase 2 — financement et géopolitique (03/09/2026, branche `claude/phase2-financement`)

Livré : `core/ledger.js` (clauses signées, émissions, taux), `content/backers.js`
(dix bailleurs — vingt dossiers, offre plus échéance, plus la saisie de 1944),
l'onglet **Registre**, le service de la dette dans le tour de simulation, la
ligne « Grand livre » au verdict, et l'extension de `sim-check` au cycle
complet d'une émission.

**Ce qui a été décidé au contact du code.**

Les bailleurs ne sont pas un système à part : ce sont des dossiers ordinaires,
concaténés à `DECISIONS`. Ils héritent ainsi de la pause du temps, du tirage
pondéré, du journal et de la modale sans une ligne de code d'interface. Seule
la trace est nouvelle. Le moteur a dû apprendre une chose : une échéance à
date fixe porte désormais une condition (`c`) et une fenêtre de grâce
(`fyEnd`, trois ans par défaut) — sans quoi la note d'une clause jamais signée
se présenterait quand même.

Chiffres des obligations, conformes au tour 9 : montants 10 / 25 / 40 Md,
durées 15 ou 25 ans, taux de base 4 %, +1 point par tranche de 20 de soutien
manquant sous 70, −1,5 avec garantie, +0,5 pour le long terme, +0,5 au-delà de
40 Md ; plancher 2 %, plafond 12 %. Deux lignes vives au maximum — c'est la
seule règle qui empêche la fuite en avant, et elle est volontairement brutale.
Mesuré : 25 Md sur 15 ans coûtent 6,50 % à soutien 20 et 4,00 % à soutien 90.

Deux fins de la liste des neuf deviennent atteignables : *Le passeport*, par la
clause soviétique de 1936, et *L'ouvrage confisqué*, par la clause italienne
tenue jusqu'en 1944 sur un chantier de Sicile que la Wehrmacht réquisitionne.
Les deux dernières — *Le courant de l'Europe* et *L'atome a gagné* — attendent
la course.

⏳ Le joueur peut emprunter, jamais l'automate de `sim-check` : émettre est une
action d'interface et non un dossier. Le cycle des obligations est donc éprouvé
à part, hors partie. Si la phase 4 donne à la course un besoin d'argent
automatique, il faudra un dossier « émission » pour que les parties simulées
empruntent aussi.

### Phase 4 — la course (03/09/2026, branche `claude/phase4-course`)

Livré : `core/race.js` (courbe soviétique réelle, les deux jauges, le tour
annuel, la rupture), `content/race.js` (dix-huit dossiers : cinq leviers, trois
équipements de puissance, trois incidents nucléaires réels, Tchernobyl à trois
issues, cinq incidents d'ouvrage dont l'Etna), l'onglet **Course** qui
n'apparaît qu'à Obninsk, les fins `courant`, `atome` et `zancleen`, et trois
nouveaux blocs de `sim-check`.

**Ce qui a été mesuré, et ce que la mesure a changé.**

*La course était ingagnable.* Avec le seul rééquipement existant (+12 %), le
meilleur chemin donnait 26 GW contre 31,9 — la fin `courant` aurait été du
texte mort, exactement comme le seuil de −55 m en phase 1. D'où trois dossiers
d'équipement neufs, tous payants en argent et en contrainte : la seconde usine
que Sörgel avait prévue et qu'on n'a jamais équipée (+16 %), le suréquipement
des groupes (+14 %, +11 de contrainte), la dorsale à courant continu vers la
plaine du Pô (+15 %). Mesures après correction : rien fait, 19,9 contre 31,9 ;
Kaplan seules et bascule en 1975, 26 contre 31,9 ; Kaplan et seconde usine,
bascule en 1978, 32,7 contre 31,9 ; tout équipé, bascule en 1985, 50,7 contre
32,2 ; vannes jamais ouvertes, 0 GW. Les deux extrêmes perdent, et c'est le
dilemme des vannes qui décide — exactement ce qu'on voulait.

*La course rendait cinq fins inatteignables.* Une fois `S.flags.course` posé,
tout joueur mort après 1980 — presque tous — recevait un verdict de course, et
les bilans du monde (`merbasse`, `plainedesel`, `lacdesautres`, `enterre`)
devenaient inaccessibles. La règle a donc un second garde-fou : la course ne
juge que si l'eau y était, ne serait-ce que de loin (au moins 40 % des
gigawatts soviétiques). Un homme qui a passé sa vie vannes closes n'a pas perdu
une course, il n'y a pas couru : c'est la mer qu'il laisse qui le juge.

*Le séisme ne se déclenchait jamais.* L'événement `quake` demandait −70 m,
hérité d'une partie de deux siècles. Seuil ramené à −25 m, et il alimente
désormais la contrainte.

**Le cinquième levier**, resté sans nom au tour 5, est l'**embargo
technologique** : priver l'Est de turbines et d'instruments, ce qui le pousse à
tout fabriquer lui-même — plus vite et moins bien.

**La nuit zancléenne** est une fin distincte de `reflood` et non sa réécriture :
rouvrir Gibraltar volontairement et le voir céder ne sont pas le même geste, et
le jeu offre les deux. Total : treize fins.

⏳ Reste pour la phase 3 : les postures de pays, la chronologie à deux lignes,
les interactions de carte. Le moteur d'histoire alternative n'a pour l'instant
qu'une charnière au sens plein — Tchernobyl à trois issues — et deux portes de
divergence (la saisie de 1944, la course). Les six charnières du tour 6
attendent la carte.
