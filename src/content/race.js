import { S } from '../core/state.js';
import { E } from './effects.js';
import { pressure, strain } from '../core/race.js';

/* LA COURSE, EN DOSSIERS — 1954-1991.

   Quatre leviers, deux par camp. La **propagande** et le **pari nucléaire**
   sont ce que Morev fait ; le **renseignement** et la **main tendue** sont ce
   que Moscou lui fait. L'**embargo** est le cinquième, celui qui se retourne :
   priver l'Est de turbines, c'est l'obliger à venir les chercher.

   Puis les incidents, symétriques eux aussi. Côté atome, ceux qui ont
   réellement eu lieu et que la pression rend possibles ou pires : Kychtym en
   1957, Leningrad en 1975, Beloïarsk en 1977, et Tchernobyl en 1986 — à trois
   issues, selon ce que Morev aura fait subir à l'autre camp. Côté eau, la
   fuite, la vanne, l'affouillement, l'Etna, et au bout la rupture. */

const RACE = [
/* ========================================================= LES LEVIERS */

{id:"r_propagande",t:"Ce qu'on sait de leurs réacteurs",k:"Course",y:[1956,1985],p:2,rep:9,c:()=>S.flags.course,
 x:"Un ingénieur passé à l'Ouest décrit les réacteurs de la filière soviétique : pas d'enceinte de confinement, un coefficient de vide positif, et des délais de chantier qu'aucun bureau d'études occidental n'accepterait. L'information est vraie, invérifiable, et elle vaut de l'or en presse.",
 o:[["Campagne dans toute l'Europe — 6 Md","opinion +14 · pression sur Moscou ++",()=>{E.m(-6);E.o(14);E.s(6);pressure(18,"Moscou répond à la campagne en avançant la mise en service de quatre tranches.");}],
    ["Une note technique aux gouvernements","opinion +5 · pression +",()=>{E.o(5);pressure(7);}],
    ["Se taire : ce n'est pas notre métier","pression −",()=>{pressure(-4);E.tr("ideal",8);}]]},

{id:"r_embargo",t:"Les turbines et les instruments",k:"Course",y:[1957,1976],p:2,c:()=>S.flags.course&&!S.flags.embargo,
 x:"Le comité de coordination occidental révise la liste des matériels interdits à l'exportation vers l'Est. Vos fournisseurs rhénans y figurent, et votre avis pèse : un mot de l'Institut, et l'URSS n'achète plus une seule turbine, plus un seul instrument de mesure à l'ouest de Vienne.",
 o:[["Appuyer l'embargo","soutien +10 · pression ++ · représailles",()=>{E.s(10);E.f("embargo");pressure(22,"L'embargo est voté. Moscou construira ses turbines elle-même, et plus vite.");}],
    ["S'en tenir aux machines militaires","soutien +4 · pression +",()=>{E.s(4);E.f("embargo");pressure(8);}],
    ["Refuser d'y prendre part","opinion +10 · pression −",()=>{E.o(10);E.f("embargo");pressure(-8);
      E.port("Il a refusé de mettre l'Institut au service de l'embargo. On le lui a fait payer deux fois, à Washington et à Bonn.");}]]},

{id:"r_main",t:"La main tendue",k:"Course",y:[1955,1974],p:2,rep:11,c:()=>S.flags.course&&S.pressure>28&&!S.flags.mainTendue,
 x:"Une invitation de l'Académie des sciences, transmise par la légation suisse. Moscou propose une commission mixte : leurs ingénieurs sur vos barrages, les vôtres sur leurs centrales, et un échange de données de sûreté. Le prix est écrit à la dernière page — une part de votre courant vers l'Est, et le silence sur ce que vous verrez.",
 o:[["Accepter","pression −− · soutien −12 · opinion +8",()=>{E.s(-12);E.o(8);E.f("mainTendue");E.tr("russia",18);
      pressure(-32,"La commission mixte s'installe. Pour la première fois depuis vingt ans, on parle de sûreté entre les deux camps.");
      E.port("Il a serré la main tendue de Moscou. Ses ingénieurs ont vu les réacteurs de l'Oural avant les inspecteurs de l'AIEA.");}],
    ["Refuser","soutien +8 · pression +",()=>{E.s(8);pressure(15);E.tr("russia",-15);}],
    ["Temporiser : une commission d'étude — 3 Md","pression −",()=>{E.m(-3);pressure(-6);}]]},

{id:"r_pari",t:"Le pari nucléaire",k:"Course",y:[1957,1979],p:2,c:()=>S.flags.course&&!S.flags.parinuke,
 x:"Votre directeur technique pose le calcul sur la table : deux réacteurs de six cents mégawatts sur la côte, raccordés à votre réseau, coûtent moins cher que dix ans d'assèchement et produisent tout de suite. L'argument est imparable. Il est aussi la négation de tout ce que l'Institut défend depuis 1928.",
 o:[["Commander deux tranches — 22 Md","+4,5 GW · l'argument de l'eau meurt",()=>{E.m(-22);S.atomGW+=4.5;E.f("parinuke");E.s(10);E.o(-10);
      E.port("Il a commandé des réacteurs. L'Institut du Grand Œuvre a produit son premier kilowattheure nucléaire de son vivant.");}],
    ["Une tranche d'étude — 11 Md","+1,8 GW",()=>{E.m(-11);S.atomGW+=1.8;E.f("parinuke");E.s(5);E.o(-5);}],
    ["Refuser : l'eau, ou rien","soutien −10 · opinion +12",()=>{E.s(-10);E.o(12);E.f("eauSeule");E.tr("ideal",15);
      E.port("On lui a proposé des réacteurs ; il a répondu que l'Institut s'appelait Atlantropa et non Électricité d'Europe.");}]]},

{id:"r_renseignement",t:"Le troisième homme",k:"Course",y:[1959,1985],p:2,rep:10,c:()=>S.flags.course&&S.pressure>45,
 x:"La sûreté suisse vous prévient : un dessinateur du bureau des vannes transmet depuis trois ans. Ce qu'il a livré n'a pas de valeur militaire — des cotes, des plans de fondation, des rapports d'inspection. C'est exactement ce qu'il faut pour savoir où un barrage est faible.",
 o:[["Enquête interne complète — 5 Md","contrainte −",()=>{E.m(-5);strain(-8);E.o(-4);}],
    ["Le laisser en place et le nourrir","pression − · opinion −6",()=>{pressure(-10);E.o(-6);E.tr("ideal",-10);}],
    ["Expulser la délégation et le dire","pression + · soutien +8",()=>{E.s(8);pressure(14);strain(6,"Trois mois plus tard, une vanne de garde est retrouvée bloquée par une pièce qui n'a rien à y faire.");}]]},

/* ============================================== CE QUI FAIT LES GIGAWATTS

   Sans ces trois dossiers, la course serait perdue d'avance : la mer ne
   descend que de 0,95 m/an, et le seul rééquipement existant vaut 12 %. Les
   mesures sont dans `tools/sim-check.mjs` — une ligne d'arrivée qu'aucun
   chemin n'atteint n'est pas un défi, c'est du texte mort.

   Ils ont tous le même prix : de l'argent, et de la contrainte sur l'ouvrage.
   Suréquiper une usine, c'est lui demander plus qu'elle n'a été calculée pour
   donner. */

{id:"r_usine2",t:"La seconde usine",k:"Ingénierie",y:[1950,1985],p:2,c:()=>S.built.gib&&!S.flags.usine2,
 x:"Le barrage a été calculé pour deux usines et n'en porte qu'une : Sörgel prévoyait d'équiper la seconde quand la chute le justifierait. La chute le justifie depuis six ans.",
 o:[["Équiper la seconde usine — 26 Md","puissance +16 % · contrainte +",()=>{E.m(-26);S.powerMul*=1.16;E.f("usine2");strain(6);}],
    ["Six groupes seulement — 13 Md","puissance +8 %",()=>{E.m(-13);S.powerMul*=1.08;E.f("usine2");strain(3);}],
    ["Une usine suffit","",()=>{E.f("usine2");}]]},

{id:"r_surequipement",t:"Le suréquipement",k:"Ingénierie",y:[1955,1988],p:2,c:()=>S.built.gib&&S.power>4&&!S.flags.surequip,
 x:"Les groupes tournent à leur point nominal huit mois par an. En acceptant de les pousser au-delà — et d'user les paliers deux fois plus vite — on tire quinze pour cent de plus des mêmes machines. Le constructeur donne son accord par écrit, avec deux pages de réserves.",
 o:[["Pousser les groupes — 6 Md","puissance +14 % · contrainte ++",()=>{E.m(-6);S.powerMul*=1.14;E.f("surequip");strain(11);}],
    ["Pousser aux heures de pointe seulement — 3 Md","puissance +6 % · contrainte +",()=>{E.m(-3);S.powerMul*=1.06;E.f("surequip");strain(4);}],
    ["S'en tenir au point nominal","contrainte −",()=>{E.f("surequip");strain(-5);E.tr("ideal",-8);}]]},

{id:"r_dorsale",t:"La dorsale continentale",k:"Ingénierie",y:[1960,1988],p:2,c:()=>S.flags.course&&S.power>8&&!S.flags.dorsale,
 x:"Ce qui sort des turbines et ce qui arrive à Milan diffèrent d'un quart. Une dorsale à courant continu de Gibraltar à la plaine du Pô coûte le prix d'un petit barrage et livre autant qu'un grand — c'est de l'énergie qu'on ne produit pas deux fois.",
 o:[["Construire la dorsale — 20 Md","puissance livrée +15 %",()=>{E.m(-20);S.powerMul*=1.15;E.f("dorsale");E.s(6);}],
    ["Une antenne vers l'Espagne — 8 Md","puissance livrée +6 %",()=>{E.m(-8);S.powerMul*=1.06;E.f("dorsale");}],
    ["Les pertes en ligne ne sont pas notre affaire","opinion −5",()=>{E.f("dorsale");E.o(-5);}]]},

/* =============================================== LES INCIDENTS DE L'ATOME
   Trois accidents réels, tenus secrets à l'époque. La pression décide s'ils
   arrivent — une filière qu'on presse est une filière qui coupe des coins. */

{id:"s_kychtym",t:"Kychtym",k:"Course",y:[1957,1960],p:3,c:()=>S.flags.course&&S.pressure>22&&!S.flags.kychtym,
 x:"Une cuve de déchets a explosé dans l'Oural, au combinat Maïak. Vingt mille kilomètres carrés contaminés, dix mille personnes déplacées, et pas une ligne dans la presse soviétique. Vous le savez par vos ingénieurs suisses ; le monde, lui, ne l'apprendra qu'en 1976.",
 o:[["Le rendre public","opinion +16 · pression ++",()=>{E.f("kychtym");E.o(16);E.s(6);pressure(20,"Moscou dément, puis accélère : le programme nucléaire devient une affaire d'honneur.");}],
    ["Le transmettre aux seuls gouvernements","opinion +6 · pression +",()=>{E.f("kychtym");E.o(6);pressure(8);}],
    ["Se taire — ce sont des morts, pas un argument","pression −",()=>{E.f("kychtym");pressure(-10);E.tr("ideal",12);
      E.port("Il a su pour Kychtym en 1957 et n'en a rien dit. Il a expliqué plus tard qu'on ne fait pas campagne sur des cadavres.");}]]},

{id:"s_leningrad",t:"La tranche numéro un",k:"Course",y:[1975,1979],p:3,c:()=>S.flags.course&&S.pressure>42&&!S.flags.leningrad,
 x:"Rupture d'un canal de force à la centrale de Leningrad : une fusion partielle, un rejet de radionucléides sur le golfe de Finlande, un mort. La filière incriminée est celle des grands réacteurs de puissance, celle-là même que Moscou déploie à marche forcée.",
 o:[["Publier l'analyse technique — 4 Md","opinion +12 · pression ++",()=>{E.f("leningrad");E.m(-4);E.o(12);pressure(16);}],
    ["Alerter l'AIEA discrètement","opinion +5 · pression +",()=>{E.f("leningrad");E.o(5);pressure(5);}],
    ["Proposer notre aide technique","pression −− · soutien −8",()=>{E.f("leningrad");E.s(-8);pressure(-18);E.tr("russia",12);}]]},

{id:"s_beloyarsk",t:"Beloïarsk",k:"Course",y:[1977,1981],p:3,c:()=>S.flags.course&&S.pressure>58&&!S.flags.beloyarsk,
 x:"Fusion partielle du cœur de la deuxième tranche. Les opérateurs ont travaillé sous rayonnement pour vider le réacteur. Vos correspondants décrivent une filière qui construit plus vite qu'elle ne forme ses équipes — ce que vous savez déjà, puisque c'est vous qui la pressez.",
 o:[["Le publier avec les deux autres","opinion +14 · pression ++",()=>{E.f("beloyarsk");E.o(14);pressure(18);}],
    ["Écrire à l'Académie, en russe, sans témoin","pression −",()=>{E.f("beloyarsk");pressure(-12);E.tr("russia",10);
      E.port("Il a écrit en russe à l'Académie des sciences en 1978. La lettre disait : ralentissez.");}],
    ["Ne rien faire","",()=>{E.f("beloyarsk");}]]},

/* ------------------------------------------------------------ TCHERNOBYL
   Trois dossiers, une seule date : le moteur tire le premier éligible, et
   c'est la pression accumulée depuis trente ans qui décide lequel. */

{id:"t_historique",t:"Tchernobyl",k:"Course",fy:1986,c:()=>S.flags.course&&S.pressure<40,
 x:"Essai de délestage sur la quatrième tranche, dans la nuit du 25 au 26 avril. Le cœur s'emballe en quatre secondes, la dalle de mille tonnes se soulève, et le graphite brûle à ciel ouvert pendant dix jours. Trente et un morts immédiats, une ville évacuée, un nuage qui traverse l'Europe. C'est la catastrophe telle qu'elle devait arriver.",
 o:[["Offrir les ingénieurs de l'Institut","opinion +14 · soutien −5",()=>{E.f2("tcher","historique");E.o(14);E.s(-5);E.tr("russia",12);
      E.port("En mai 1986, il a envoyé quarante ingénieurs à Tchernobyl. Aucun n'était volontaire pour la première semaine ; tous y sont allés.");}],
    ["En tirer l'argument que l'on attendait","soutien +14 · opinion −8",()=>{E.f2("tcher","historique");E.s(14);E.o(-8);pressure(12);}],
    ["Publier un rapport de sûreté comparé — 5 Md","opinion +10 · soutien +6",()=>{E.f2("tcher","historique");E.m(-5);E.o(10);E.s(6);}]]},

{id:"t_aggravee",t:"Tchernobyl, quatre tranches",k:"Course",fy:1986,c:()=>S.flags.course&&S.pressure>=40&&S.pressure<70,
 x:"La quatrième tranche part dans la nuit du 26 avril, et l'incendie de graphite gagne la troisième, mitoyenne, qui n'a pas été arrêtée à temps. Deux cœurs à ciel ouvert. Le programme que vous poussez depuis trente ans à construire plus vite vient de rendre son verdict, et le vent porte au sud-ouest.",
 o:[["Offrir tout ce que l'Institut peut donner","opinion +18 · soutien −8 · santé −4",()=>{E.f2("tcher","aggravee");E.o(18);E.s(-8);E.vie(-4);E.r(1.2);
      E.port("Il a passé l'été 1986 en Ukraine. Il en est revenu avec une toux qu'il n'a plus perdue.");}],
    ["Prendre le marché : l'Europe demande du courant","soutien +20 · opinion −12",()=>{E.f2("tcher","aggravee");E.s(20);E.o(-12);S.incomeMul*=1.15;E.r(0.8);
      E.port("Il a signé douze contrats de fourniture dans les six mois qui ont suivi Tchernobyl.");}],
    ["Demander l'arrêt de toute la filière","opinion +12 · soutien +6 · pression ++",()=>{E.f2("tcher","aggravee");E.o(12);E.s(6);pressure(15);E.r(0.8);}]]},

{id:"t_contaminee",t:"L'Europe contaminée",k:"Course",fy:1986,c:()=>S.flags.course&&S.pressure>=70,
 x:"Trois tranches brûlent. Le nuage passe sur la Pologne, l'Allemagne, l'Autriche, l'Italie du Nord — et sur les fonds émergés, cette plaine sans végétation où rien ne fixe les poussières. Vos terres neuves reçoivent du césium, et le vent y lève la croûte. Vous avez poussé cette filière pendant trente ans ; elle vient de vous répondre.",
 o:[["Évacuer les terres émergées — 14 Md","opinion +10 · déplacés ++",()=>{E.f2("tcher","contaminee");E.m(-14);E.o(10);E.r(3.5);E.b(-10);
      E.port("Il a fait évacuer les fonds émergés en 1986, dix-huit mois après y avoir installé des familles.");}],
    ["Contester les mesures — 6 Md","opinion −22 · soutien +8",()=>{E.f2("tcher","contaminee");E.m(-6);E.o(-22);E.s(8);E.r(2);E.tr("ideal",-15);}],
    ["Tout rendre public, y compris notre part","opinion +16 · soutien −16",()=>{E.f2("tcher","contaminee");E.o(16);E.s(-16);E.r(2.5);
      E.port("Il a publié en 1986 le mémorandum où l'Institut demandait, depuis 1957, que l'URSS construise plus vite.");}]]},

/* ================================================ LES INCIDENTS DE L'EAU
   La contrainte monte en silence ; ces trois dossiers sont les seuls avertis-
   sements que le joueur reçoit avant le tirage de rupture. */

{id:"w_entretien",t:"La ligne d'entretien",k:"Ingénierie",y:[1938,1988],p:3,c:()=>S.built.gib&&!S.flags.entretien,
 x:"Le chef de l'exploitation demande une ligne budgétaire permanente : inspection des joints, sondages du radier, remplacement programmé des vannes de garde. Un milliard par an, tous les ans, pour des choses qui ne se verront jamais si elles sont bien faites.",
 o:[["L'inscrire au budget — 1 Md/an","contrainte −− chaque année",()=>{E.f("entretien");strain(-10,"Une équipe permanente d'inspection s'installe sur l'ouvrage.");}],
    ["Une campagne tous les cinq ans — 4 Md","contrainte −",()=>{E.m(-4);strain(-12);}],
    ["Plus tard : les caisses d'abord","contrainte +",()=>{strain(6);}]]},

{id:"w_fuite",t:"Le débit de fuite",k:"Ingénierie",y:[1940,1990],p:3,c:()=>S.built.gib&&S.strain>35&&!S.flags.fuite,
 x:"Les piézomètres du radier montent depuis deux ans. Ce n'est pas une voie d'eau, c'est un réseau de suintements dans le contact béton-rocher — le genre de courbe que les ingénieurs de Malpasset ont regardée pendant des mois sans y croire.",
 o:[["Injection de coulis, chantier arrêté — 9 Md","contrainte −−",()=>{E.f("fuite");E.m(-9);strain(-18);}],
    ["Instrumenter et surveiller — 3 Md","contrainte −",()=>{E.f("fuite");E.m(-3);strain(-7);}],
    ["C'est dans les tolérances","contrainte +",()=>{E.f("fuite");strain(8);}]]},

{id:"w_vanne",t:"La vanne de garde",k:"Ingénierie",y:[1945,1990],p:3,c:()=>S.built.gib&&S.strain>52&&!S.flags.vanne,
 x:"Essai annuel : la vanne de garde numéro sept met onze minutes à descendre, contre quatre au procès-verbal de réception. Sur une chute de trente mètres, onze minutes suffisent à vider ce qu'il ne faut pas vider.",
 o:[["Remplacer les douze vannes — 16 Md","contrainte −−−",()=>{E.f("vanne");E.m(-16);strain(-26);}],
    ["Remplacer la septième — 4 Md","contrainte −",()=>{E.f("vanne");E.m(-4);strain(-9);}],
    ["Réviser le procès-verbal","contrainte + · opinion −6",()=>{E.f("vanne");strain(10);E.o(-6);E.tr("ideal",-12);}]]},

{id:"w_etna",t:"L'Etna",k:"Ingénierie",y:[1930,1990],p:2,rep:13,c:()=>S.built.sic||S.active.sic,
 x:"Éruption latérale sur le flanc sud-est. Les coulées n'atteindront pas la digue — elles n'atteignent jamais la digue — mais l'essaim sismique qui les accompagne se lit sur vos accéléromètres de Trapani, et la faille de Messine est à cent kilomètres.",
 o:[["Renforcer les appuis — 7 Md","contrainte −−",()=>{E.m(-7);strain(-14);}],
    ["Installer un réseau d'alerte — 2 Md","contrainte −",()=>{E.m(-2);strain(-5);}],
    ["Le volcan est là depuis toujours","contrainte ++",()=>{strain(9);}]]},

{id:"w_sabotage",t:"Ce qu'on a trouvé dans la chambre des vannes",k:"Course",y:[1960,1988],p:2,c:()=>S.flags.course&&S.strain>45&&S.pressure>55&&!S.flags.sabotage,
 x:"Un plongeur de l'entretien remonte une pièce d'acier coincée dans la grille d'un évacuateur. Elle n'appartient à aucun ouvrage de l'Institut. Le rapport tient en une phrase : quelqu'un a essayé, et n'a pas réussi.",
 o:[["Sécuriser l'ouvrage — 12 Md","contrainte −−",()=>{E.f("sabotage");E.m(-12);strain(-20);E.s(6);}],
    ["Le rendre public et accuser","pression ++ · opinion +8",()=>{E.f("sabotage");E.o(8);pressure(20);strain(5);}],
    ["Étouffer l'affaire","contrainte +",()=>{E.f("sabotage");strain(10);E.o(-4);}]]},
];

export { RACE };
