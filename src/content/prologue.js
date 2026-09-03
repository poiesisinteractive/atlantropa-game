import { S, nat } from '../core/state.js';
import { emit } from '../core/bus.js';
import { log } from '../core/journal.js';
import { trait, life, portrait, applyPlan } from '../core/character.js';

/* LE PROLOGUE — 1926-1930, onze cartes.

   Ce qui se joue ici n'est pas le barrage : c'est l'homme qui le portera.
   Chaque carte pose un trait ou une dimension du plan, laisse une phrase au
   portrait et une ligne au journal. La dernière est le départ pour Munich —
   c'est elle qui ouvre 1930 et le jeu tel qu'il existait avant.

   La structure est en étapes plutôt qu'en pioche libre : l'ordre raconte une
   biographie, et une biographie ne se mélange pas. Mais chaque étape a ses
   variantes, tirées au sort et parfois conditionnées par ce qui précède —
   deux prologues ne se ressemblent pas, et aucun ne se contredit.

   Alexeï Morev, né en 1905 près de Taganrog. Évacué de Crimée en novembre
   1920 avec les débris de l'armée Wrangel. Passeport Nansen en 1922. Paris. */

const P = [
  /* ------------------------------------------------------------- 1926 */
  [{
    id: 'atelier', y: 1926, k: 'École des Ponts',
    t: "L'atelier de dessin",
    x: "Deuxième année. Le sujet du concours est un pont-route sur la Loire. Vous rendez une épure que le correcteur qualifie de « remarquable et parfaitement irréalisable » : trois cent vingt mètres d'une seule portée, là où le programme en demandait quatre.",
    o: [
      ["Défendre l'épure devant le jury", "il faut d'abord voir grand", () => {
        trait('ideal', 25); portrait("À vingt et un ans, il a défendu devant un jury un pont qu'aucune fonderie d'Europe n'aurait su couler.");
      }],
      ["Redessiner en quatre travées", "on construit ce qui se construit", () => {
        trait('ideal', -25); portrait("Il a appris tôt qu'un dessin qu'on ne coule pas n'est pas un ouvrage, mais une gravure.");
      }],
      ["Rendre les deux, et laisser le jury trancher", "les deux sont vraies", () => {
        trait('ideal', 8); portrait("Il rend toujours deux projets : celui qu'on lui demande et celui qu'il aurait voulu.");
      }],
    ],
  }, {
    id: 'calcul26', y: 1926, k: 'École des Ponts',
    t: "La note de calcul",
    x: "Vous relevez une erreur dans les tables de poussée des terres qu'utilise tout l'atelier depuis quinze ans. Elle est petite, elle est réelle, et elle porte le nom d'un professeur qui siège au jury.",
    o: [
      ["Publier la correction", "la vérité, et les ennuis", () => {
        trait('ideal', 12); trait('sorgel', -18);
        portrait("Sa première publication fut la correction d'un maître. Il n'a jamais tout à fait perdu l'habitude.");
      }],
      ["La glisser au professeur, en privé", "corriger sans humilier", () => {
        trait('sorgel', 15); portrait("Il corrige les maîtres en privé — c'est une forme de fidélité, et une forme de calcul.");
      }],
      ["Se taire : ce n'est pas son rang", "on ne conteste pas à vingt ans", () => {
        trait('sorgel', 22); trait('ideal', -8);
        portrait("Il a longtemps cru que le rang valait argument.");
      }],
    ],
  }],

  [{
    id: 'nansen', y: 1926, k: 'Préfecture de police',
    t: "Le bureau des apatrides",
    x: "Renouvellement annuel du passeport Nansen. Le guichetier vous demande votre nationalité ; vous répondez que c'est justement l'objet du document. Il écrit « origine russe » et vous rend le carnet vert sans lever les yeux. Trois heures de queue, chaque année, jusqu'à la fin.",
    o: [
      ["Demander la naturalisation française", "un pays, enfin", () => {
        trait('russia', -20); trait('africa', 6);
        portrait("Il a demandé un passeport français à vingt et un ans. Le dossier a mis onze ans à revenir.");
        log("Dossier de naturalisation déposé. Il sera instruit, dit-on, dans un délai raisonnable.");
      }],
      ["Garder le carnet vert", "on ne remplace pas ce qu'on a perdu", () => {
        trait('russia', 20);
        portrait("Il a gardé le carnet vert des apatrides toute sa vie, alors que rien ne l'y obligeait plus.");
      }],
      ["Écrire à l'Office Nansen pour les autres", "s'occuper de la file, pas de soi", () => {
        trait('russia', 8); trait('ideal', 12);
        portrait("Il a écrit son premier mémoire administratif à vingt et un ans, pour raccourcir une file d'attente.");
      }],
    ],
  }],

  /* ------------------------------------------------------------- 1927 */
  [{
    id: 'stage', y: 1927, k: "L'été",
    t: "Le stage",
    x: "Trois offres pour l'été. Un barrage sur le Rhône, où l'on coule du béton par trente degrés. Le port d'Alger, où l'on rallonge une jetée de six cents mètres. Ou le bureau d'études du boulevard Saint-Germain, où l'on rédige les rapports que les deux autres appliquent.",
    o: [
      ["Le Rhône, sur le chantier", "apprendre par les mains · santé −", () => {
        trait('ideal', -10); life(-2);
        portrait("Il a coulé du béton avant d'en dessiner. Les contremaîtres s'en souviendront.");
        log("Été 1927 : trois mois sur un barrage du Rhône. Il rentre à Paris avec deux doigts en moins d'ongles.");
      }],
      ["Alger, la jetée", "voir la rive sud", () => {
        trait('africa', 22);
        portrait("Il a vu la rive sud à vingt-deux ans, du bon côté de la jetée. Il n'a jamais oublié qui portait les sacs.");
        log("Été 1927 : la jetée d'Alger. Six cents mètres de blocs artificiels, et quatre mille dockers.");
      }],
      ["Le bureau d'études", "voir comment on décide", () => {
        trait('ideal', -6); trait('sorgel', 10);
        portrait("Il a compris tôt que les ouvrages se décident boulevard Saint-Germain, et se construisent ailleurs.");
      }],
    ],
  }],

  [{
    id: 'emigres', y: 1927, k: 'Rue de la Convention',
    t: "Le dîner des émigrés",
    x: "Une salle de patronage, quarante couverts, un portrait du tsar au mur et des ingénieurs qui furent colonels. On lève son verre « à l'année prochaine à Moscou » depuis six ans. Un ancien du génie vous prend à part : il a lu que les Soviets électrifient le Dniepr, et il en tremble d'une émotion qu'il n'arrive pas à nommer.",
    o: [
      ["« Ils construisent, nous dînons »", "l'ouvrage avant le drapeau", () => {
        trait('russia', 22); trait('ideal', 10);
        portrait("Il a dit un soir de 1927 que les bolcheviks construisaient pendant que les émigrés dînaient. On ne l'a plus beaucoup invité.");
        log("On vous a moins invité rue de la Convention, ensuite.");
      }],
      ["Se taire et resservir du vin", "ce sont ses morts aussi", () => {
        trait('russia', -18);
        portrait("Il n'a jamais discuté avec les vieux du dîner des émigrés. C'étaient ses morts aussi.");
      }],
      ["Demander les plans du Dniepr", "un barrage est un barrage", () => {
        trait('russia', 12); trait('ideal', 8);
        portrait("Il a demandé les plans du DnieproGES avant d'avoir son diplôme. C'est par un barrage russe qu'il est entré dans le métier.");
        log("Vous vous procurez les coupes du DnieproGES. Soixante mètres de chute, et une brochure en trois langues.");
      }],
    ],
  }, {
    id: 'lettre', y: 1927, k: 'Courrier',
    t: "La lettre de Taganrog",
    x: "Votre tante écrit. La maison de votre père est devenue une école ; on y enseigne l'électrification. Elle vous demande, sans ironie apparente, si vous comptez rentrer aider.",
    o: [
      ["Répondre qu'il rentrera", "un jour, avec quelque chose", () => {
        trait('russia', 25);
        portrait("Il a promis à sa tante qu'il rentrerait avec quelque chose à montrer. Il a tenu la seconde moitié de la promesse.");
      }],
      ["Ne pas répondre", "il n'y a rien à écrire", () => {
        trait('russia', -22);
        portrait("Il y a une lettre de 1927 à laquelle il n'a jamais répondu.");
      }],
      ["Envoyer de l'argent, sans un mot", "ce qu'on peut", () => {
        trait('russia', -6); trait('ideal', 6);
        portrait("Il a envoyé de l'argent à Taganrog pendant dix ans, sans jamais accompagner un mandat d'une lettre.");
      }],
    ],
  }],

  /* ------------------------------------------------------------- 1928 */
  [{
    id: 'memoire', y: 1928, k: 'Mémoire de fin d\'études',
    t: "Le sujet",
    x: "Il faut choisir. Le jury acceptera n'importe lequel des trois, et le sujet qu'on prend à vingt-trois ans est celui qu'on défendra à cinquante.",
    o: [
      ["« De la houille blanche à l'échelle d'un continent »", "l'énergie · recettes +8 %", () => {
        S.plan.benefit = 'energie'; trait('ideal', 10);
        portrait("Son mémoire portait sur l'énergie. Trente ans plus tard, on le lui rappellera à Obninsk.");
      }],
      ["« Terres gagnées sur la mer : le précédent hollandais »", "les terres · recettes −4 %", () => {
        S.plan.benefit = 'terres'; trait('africa', -8);
        portrait("Son mémoire portait sur les polders. Il a mis vingt ans à apprendre ce que le sel fait aux terres gagnées.");
      }],
      ["« Le grand chantier comme substitut à la guerre »", "la paix · soutien +6", () => {
        S.plan.benefit = 'paix'; trait('ideal', 18);
        portrait("Son mémoire disait qu'un chantier assez grand occuperait les armées. Il l'a écrit en 1928.");
      }],
    ],
  }],

  [{
    id: 'prof', y: 1928, k: 'École des Ponts',
    t: "La proposition du professeur",
    x: "Coyne, qui construit des voûtes minces et fera plus tard Malpasset, vous propose une place dans son bureau. Bien payée, française, sûre. Un apatride qui refuse une place sûre en 1928 doit avoir une raison.",
    o: [
      ["Accepter, et voir venir", "la sécurité d'abord", () => {
        trait('ideal', -14); life(3);
        portrait("Il a travaillé deux ans dans un bureau français avant de tout quitter. Cela lui a laissé une retraite qu'il n'a jamais touchée.");
      }],
      ["Refuser : il cherche autre chose", "sans savoir encore quoi", () => {
        trait('ideal', 16); trait('sorgel', -6);
        portrait("Il a refusé en 1928 une place sûre, sans savoir encore ce qu'il attendait.");
      }],
    ],
  }, {
    id: 'crise', y: 1928, k: 'Paris',
    t: "Ce qu'on lit dans les journaux",
    x: "Le Kellogg-Briand est signé en août : la guerre est mise hors la loi par soixante-deux États. Au même moment, les Ponts recrutent pour les fortifications de l'Est. Un ingénieur de vingt-trois ans doit choisir ce qu'il croit.",
    o: [
      ["Le pacte : on peut désarmer par l'ouvrage", "", () => {
        trait('ideal', 20);
        portrait("Il a cru au pacte Briand-Kellogg. Il n'a jamais tout à fait cessé, ce qui lui a coûté cher deux fois.");
      }],
      ["Les fortifications : on connaît la suite", "", () => {
        trait('ideal', -16);
        portrait("Il savait dès 1928 que la ligne se construirait. Cela ne l'a pas empêché de travailler pour ceux qui la niaient.");
      }],
    ],
  }],

  /* ------------------------------------------------------------- 1929 */
  [{
    id: 'livre', y: 1929, k: 'Munich, par la poste',
    t: "Mittelmeer-Senkung",
    x: "Un architecte munichois nommé Herman Sörgel publie un livre : barrer Gibraltar, abaisser la Méditerranée de deux cents mètres, en tirer de l'énergie sans fin et un continent neuf. Vous le lisez en trois nuits, dans un allemand approximatif. La moitié des chiffres sont faux. L'autre moitié tient.",
    o: [
      ["Écrire à Sörgel : voilà mes corrections", "l'admiration par le calcul", () => {
        trait('sorgel', -12); trait('ideal', 10);
        portrait("Sa première lettre à Sörgel contenait onze corrections de calcul. Sörgel a répondu par une invitation.");
        log("Vous écrivez à Munich. Onze pages, dont neuf de calcul.");
      }],
      ["Écrire à Sörgel : je veux travailler avec vous", "l'admiration franche", () => {
        trait('sorgel', 25);
        portrait("Il a écrit à Sörgel qu'il voulait travailler avec lui. Il avait vingt-quatre ans et rien à offrir qu'une lecture attentive.");
        log("Vous écrivez à Munich. Trois pages, dont une seule sur le calcul.");
      }],
      ["Ne rien écrire, et refaire tous les calculs", "d'abord savoir si c'est vrai", () => {
        trait('sorgel', -22); trait('ideal', -8);
        portrait("Avant d'écrire à Sörgel, il a refait tous ses calculs. Il a mis huit mois, et il avait raison sur trois points.");
      }],
    ],
  }],

  [{
    id: 'coeur', y: 1929, k: 'Le projet',
    t: "Par où commencer",
    x: "Sörgel dessine l'ouvrage entier d'un trait. Vous, vous savez qu'un continent se commence par un chantier — un seul —, et que ce premier chantier décide de tous les autres. Le vôtre est déjà dessiné : c'est celui que vous porterez à Munich.",
    o: [
      ["Gibraltar", "le verrou · −15 % sur ce chantier", () => {
        S.plan.core = 'gib';
        portrait("Il a toujours dit que tout commençait au détroit, et que le reste était de l'arithmétique.");
      }],
      ["La digue Sicile–Tunisie", "couper l'Est en deux · −15 %", () => {
        S.plan.core = 'sic'; trait('africa', 10);
        portrait("Son ouvrage à lui n'était pas Gibraltar mais la digue de Sicile : la route sèche entre deux continents.");
      }],
      ["Les Dardanelles", "fermer la mer Noire · −15 %", () => {
        S.plan.core = 'dard'; trait('russia', 12);
        portrait("Il a voulu fermer les Dardanelles avant Gibraltar. On lui a fait remarquer que la mer Noire était russe.");
      }],
    ],
  }],

  [{
    id: 'cible', y: 1929, k: 'Le projet',
    t: "Jusqu'où descendre",
    x: "Deux cents mètres, c'est le chiffre de Sörgel : un continent, et cent soixante ans de travaux. Cent mètres, c'est la moitié de l'énergie, le quart des terres — et un ouvrage qu'un homme peut voir finir. La différence entre les deux n'est pas technique. Elle est sur ce qu'on attend d'une vie.",
    o: [
      ["Deux cents mètres, comme au livre", "le continent", () => {
        S.plan.target = -200; trait('ideal', 15); trait('sorgel', 12);
        portrait("Il visait deux cents mètres. Il savait dès 1929 qu'il ne les verrait pas.");
      }],
      ["Cent mètres, et qu'on le voie de son vivant", "soutien −6 · opinion +8", () => {
        S.plan.target = -100; trait('ideal', -18); trait('sorgel', -15);
        portrait("Il a divisé par deux le chiffre du maître avant même de le rencontrer. C'était sa manière de le prendre au sérieux.");
      }],
    ],
  }],

  /* ------------------------------------------------------------- 1930 */
  [{
    id: 'afrique', y: 1930, k: 'Le projet',
    t: "Ce que l'Afrique est dans le plan",
    x: "Sörgel écrit « Eurafrique » et dessine un continent d'un seul tenant. Dans son livre, l'Afrique est une surface : de l'espace, du soleil, de la main-d'œuvre. Vous avez vu Alger. Il faut écrire le chapitre, et c'est vous qui tenez la plume.",
    o: [
      ["Une terre à mettre en valeur", "France et Italie +6 · rive sud −6", () => {
        S.plan.africa = 'colonie'; trait('africa', -20);
        portrait("Il a écrit en 1930 le chapitre africain du plan. Il a mis trente ans à ne plus pouvoir le relire.");
      }],
      ["Des États qui signeront ou ne signeront pas", "rive sud +10 · soutien −4", () => {
        S.plan.africa = 'partenaire'; trait('africa', 25);
        portrait("Dès 1930, son plan prévoyait des signatures africaines. On a trouvé cela naïf pendant vingt-cinq ans, puis évident.");
      }],
    ],
  }],

  [{
    id: 'depart', y: 1930, k: 'Gare de l\'Est',
    t: "Le départ",
    x: "Munich a répondu. L'Institut Atlantropa ouvre ses portes et cherche un ingénieur ; le traitement est mauvais, la ville est étrangère, et l'Allemagne de 1930 vient de donner cent sept sièges à un parti qui promet de tout recommencer. Votre carnet vert vous autorise à sortir de France, pas à y revenir sans formalités.",
    o: [
      ["Partir, et se donner entièrement", "santé −4 · fidélité", () => {
        trait('sorgel', 20); life(-4);
        portrait("Il est monté dans le train de Munich avec une valise et un dossier de calculs. Il n'a pas repris de vacances avant 1946.");
        log("Munich. Vous descendez du train avec une valise et onze pages de corrections.", 'big');
      }],
      ["Partir, en gardant une porte à Paris", "prudent · santé +2", () => {
        trait('sorgel', -10); trait('ideal', -8); life(2);
        portrait("Il a gardé une chambre à Paris pendant seize ans, pour le cas où Munich tournerait mal. Elle a servi.");
        log("Munich. Vous gardez la chambre du quinzième arrondissement — au cas où.", 'big');
      }],
      ["Partir, avec ses conditions écrites", "indépendance", () => {
        trait('sorgel', -25); trait('ideal', 8);
        portrait("Il a posé ses conditions par écrit avant d'entrer à l'Institut. Sörgel les a signées sans les lire.");
        log("Munich. Vos conditions tiennent en une page ; Sörgel la signe sans la lire.", 'big');
      }],
    ],
  }],
];

/* ------------------------------------------------------------- LE MOTEUR

   Une carte par étape, tirée parmi les variantes éligibles. Le prologue ne
   passe pas par `content/engine.js` : celui-ci sert l'acte II, où le temps
   coule et où les dossiers se disputent une place. Ici il n'y a ni horloge
   ni concurrence, seulement onze cartes dans l'ordre. */
const pro = { step: -1, cur: null };

function pick(variants) {
  const ok = variants.filter((v) => !v.c || v.c());
  const pool = ok.length ? ok : variants;
  return pool[Math.floor(Math.random() * pool.length)];
}

function next() {
  pro.step++;
  if (pro.step >= P.length) { pro.cur = null; finish(); return; }
  const card = pick(P[pro.step]);
  pro.cur = card;
  S.year = card.y;
  emit('prologue', { card, step: pro.step, total: P.length });
}

function startPrologue() {
  pro.step = -1;
  S.year = P[0][0].y;
  next();
}

function answerPrologue(i) {
  const card = pro.cur;
  if (!card) return;
  pro.cur = null;
  log(`<b style="color:#c9a227;position:static">${card.t}</b> — ${card.o[i][0]}`, 'big');
  card.o[i][2]();
  next();
}

/* Fin du prologue : le plan s'applique au monde, et 1930 commence. C'est le
   seul endroit où le prologue touche à autre chose qu'au personnage. */
function finish() {
  S.year = 1930;
  applyPlan(nat);
  emit('prologue-done', { plan: { ...S.plan }, traits: { ...S.traits } });
}

/* Entrer à l'Institut sans jouer le prologue : le plan par défaut est celui
   du livre de Sörgel, et le portrait le dit. Utile en reprise de partie, et
   pour les outils qui n'éprouvent que l'acte II. */
function skipPrologue() {
  pro.step = P.length; pro.cur = null;
  portrait("Il est arrivé à Munich en 1930 avec le plan de Sörgel et rien à y redire.");
  finish();
}

/* Pour les outils de vérification : jouer tout le prologue au hasard. */
function playPrologue(rand = Math.random) {
  startPrologue();
  let garde = 0;
  while (pro.cur && garde++ < 100) answerPrologue(Math.floor(rand() * pro.cur.o.length));
  return garde;
}

export { P as PROLOGUE, pro, startPrologue, answerPrologue, skipPrologue, playPrologue };
