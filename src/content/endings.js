import { S, nat } from '../core/state.js';
import { fmt } from '../core/utils.js';
import { CITIES } from '../data/places.js';
import { deathYear } from '../core/character.js';

/* Les fins, et le tableau qui les accompagne. Du texte et des chiffres :
   `core/endgame.js` les assemble et les annonce, `ui/bridge.js` les met en
   page. Rien ici ne connaît le DOM.

   Depuis que la partie dure une vie d'homme et non deux siècles, les fins se
   partagent en deux familles. Les trois premières sont des *arrêts* : la
   partie casse avant terme. Les autres sont des *bilans* : Morev meurt, et
   l'on regarde ce qu'il laisse. C'est `pickEnding()` qui choisit le bilan —
   il n'y a pas de fin « victoire », parce qu'il n'y a pas de moment où l'on
   gagne. */

const ENDINGS = {
  faillite: ["FAILLITE",
    "L'Institut Atlantropa a cessé ses paiements. Les vannes de Gibraltar restent où vous les avez laissées : une mer à demi vidée n'a pas d'entretien, et personne pour la remplir."],
  abandon: ["LE CONSORTIUM SE DISSOUT",
    "Les nations riveraines se retirent une à une. Le barrage devient un mur sans propriétaire, la mer un problème sans solution."],
  revolte: ["LES PEUPLES DISENT NON",
    "Émeutes du sel de Marseille à Alexandrie. Le Grand Œuvre est arrêté par ceux qu'il devait enrichir."],
  reflood: ["LA RÉINONDATION",
    "Vous avez rouvert Gibraltar. Le débit a dépassé mille fois celui de l'Amazone ; une cataracte de plusieurs centaines de mètres a rempli le bassin en deux ans. Les villes bâties sur les fonds ont disparu en une nuit. C'est ainsi que la Méditerranée s'est remplie il y a 5,3 millions d'années — on appelle cela l'inondation zancléenne. Vous venez de la rejouer."],

  /* ------------------------------------------------------- les bilans
     Elles portent toutes le même en-tête — un homme meurt — et se
     distinguent par ce qu'il laisse. L'ordre de `pickEnding()` est celui de
     la spécification : la catastrophe l'emporte sur tout, puis la course,
     puis l'état du monde. */
  merbasse: ["LA MER BASSE",
    "Alexeï Morev est mort à son bureau, un dossier ouvert. La mer est basse, l'Institut est solide, le consortium tient : rouvrir Gibraltar coûterait maintenant plus cher que de continuer, et c'est la seule forme d'irréversibilité qu'une vie d'homme pouvait produire. Son continent se fera sans lui, lentement, comme il l'avait calculé. Il n'en aura vu que le commencement — c'était écrit dans les chiffres dès 1929."],
  plainedesel: ["UNE PLAINE DE SEL",
    "Il est mort en laissant une plaine. Elle est immense, elle est blanche, et le vent en lève la croûte jusqu'en Provence. Sörgel avait promis un grenier ; c'est une salière de la taille d'un pays. Le projet a réussi exactement comme il avait été calculé, ce qui est la pire chose qu'on puisse en dire."],
  lacdesautres: ["LE LAC DES AUTRES",
    "L'ouvrage lui survit, mais il ne lui appartenait plus depuis longtemps. Les concessions, les clauses, les conseils d'administration : à sa mort, l'Institut n'était plus qu'un locataire de son propre barrage. Il a construit pour d'autres, et il l'a su."],
  confisque: ["L'OUVRAGE CONFISQUÉ",
    "On lui a pris. Un État a mis la main sur le barrage, au nom de sa sécurité, de sa souveraineté ou de sa part — le motif importe peu quand les soldats sont sur la crête. Il est mort en procédure, comme on meurt d'une longue maladie administrative."],
  enterre: ["ENTERRÉ AVEC LUI",
    "Le projet n'a pas survécu à son porteur. Les chantiers sont à l'arrêt, l'Institut licencie, et les plans partent aux archives d'une université qui les classera sous « utopies techniques du XXᵉ siècle ». Il reste une maquette au Deutsches Museum, et personne pour l'expliquer."],
  courant: ["LE COURANT DE L'EUROPE",
    "À sa mort, l'eau produisait plus que l'atome soviétique. L'Europe du Sud s'éclaire à la Méditerranée. Il a gagné la course — en ouvrant les vannes à fond, c'est-à-dire en arrêtant la descente. Le continent promis restera au fond de l'eau, et le courant, lui, passe."],
  atome: ["L'ATOME A GAGNÉ",
    "Obninsk avait raison en 1954. Un réacteur tient dans un hectare, ne demande pas de traité, et ne vide pas une mer. Ou bien les gigawatts soviétiques ont doublé les vôtres pendant qu'on discutait des vannes ; ou bien vous avez fini par commander des réacteurs vous-même, et gagné la course en changeant de camp. Dans les deux cas, la phrase que l'Institut répétait depuis 1928 — l'eau nourrira l'Europe — est morte avant son porteur."],
  zancleen: ["LA NUIT ZANCLÉENNE",
    "Le barrage de Gibraltar a cédé dans la nuit. Ce que la mer avait mis un demi-siècle à descendre, l'Atlantique l'a rendu en quelques semaines : une cataracte de plusieurs dizaines de mètres, un débit de mille Amazones, et les villes bâties dans les fonds sous des mètres d'eau avant l'aube. La Méditerranée s'était remplie ainsi il y a 5,3 millions d'années — on appelle cela l'inondation zancléenne. La différence, cette fois, est qu'il y avait des gens, et que les rapports d'inspection prévenaient depuis des années."],
  passeport: ["LE PASSEPORT",
    "Il est mort soviétique. Le carnet vert des apatrides a fini dans un tiroir de Moscou, échangé contre un passeport rouge et une part de l'ouvrage. On l'a enterré avec les honneurs d'un ingénieur d'État, à deux mille kilomètres du détroit qu'il avait passé sa vie à fermer."],
};

/* Le choix du bilan.

   Les seuils sortent de la physique, pas d'un souhait. Le meilleur cas
   possible — Gibraltar fermé en 1935, vannes closes, argent illimité, tous
   les ouvrages lancés — descend à **−43 m** en 1990 : la mer ne va pas plus
   vite que 0,95 m/an, et une vie d'homme n'en contient que soixante. Le
   « point de non-retour » de la spécification, −55 m, est donc hors
   d'atteinte : le retenir aurait donné une seule fin possible, `enterre`,
   quoi que fasse le joueur. C'est la porte du modèle qui l'a montré, et
   c'est pour cela qu'elle existe.

   Ce qui le remplace n'est pas un seuil plus bas mais une autre idée de
   l'irréversibilité : non plus celle de la roche, mais celle des comptes et
   des traités. Un ouvrage qui descend, un Institut soutenu, un consortium
   qui tient — voilà ce qui survit à un homme.

   Les fins qu'ouvriront les phases suivantes (`confisque` par une saisie
   d'État, `courant` et `atome` par la course, `passeport` par la clause
   soviétique) attendent leurs drapeaux et ne se déclenchent pas avant. */
function pickEnding() {
  if (S.flags.saisi) return 'confisque';
  /* Le passeport *et* la main tendue : il est vraiment parti à l'Est. Cela
     l'emporte sur la course, parce que ce n'est plus la même vie. Le
     passeport seul, signé en 1936 et jamais suivi d'effet, ne passe qu'après. */
  if (S.flags.passeport && S.flags.mainTendue) return 'passeport';
  /* La course tranche — mais seulement si elle a eu lieu. Deux conditions :
     qu'elle ait eu le temps de se jouer (avant 1980 les gigawatts soviétiques
     n'ont pas encore doublé), et que l'eau ait été dans la course, ne
     serait-ce que de loin.

     Ce second garde-fou n'est pas une commodité. Sans lui, tout joueur mort
     après 1980 — c'est-à-dire presque tous, la fenêtre allant de 1975 à 2000
     — recevrait un verdict de course, et les cinq bilans du monde
     deviendraient du texte mort. Or un homme qui a passé sa vie vannes
     closes, à faire descendre la mer sans jamais produire, n'a pas perdu une
     course : il n'y a pas couru. C'est la mer qu'il laisse qui le juge. */
  const eux = S.sovietGW || 0;
  if (S.flags.course && S.year >= 1980 && S.power >= eux * 0.4) {
    const gagne = S.power >= eux;
    return gagne && !S.flags.parinuke ? 'courant' : 'atome';
  }
  if (S.flags.passeport) return 'passeport';

  const membres = Object.values(nat).filter((n) => n.mem).length;
  // Le sel l'emporte sur tout le reste : c'est la réussite qui se retourne.
  if (S.dust > 25 || S.deadPorts >= 6) return 'plainedesel';
  // L'ouvrage survivra-t-il à son porteur ?
  const survit = S.built.gib && S.levelW <= -12 && S.support >= 45 && membres >= 4;
  if (!survit) return 'enterre';
  // Oui — mais à qui appartient-il ?
  const maitre = S.support >= 60 && membres >= 6 && !S.flags.collab && !S.flags.deco;
  return maitre ? 'merbasse' : 'lacdesautres';
}

const EPILOGUE =
  "Herman Sörgel a défendu Atlantropa de 1928 jusqu'à sa mort en 1952, renversé à vélo sur la route de son institut. " +
  "Le projet n'a jamais reçu le moindre coup de pioche : le nucléaire, la décolonisation et le coût l'ont enterré — " +
  "pas l'écologie, qui n'existait pas encore comme argument.";

/* Poste · ce que promettait Sörgel · ce que vous obtenez. */
function verdict() {
  return [
    ["Énergie promise", "« Énergie inépuisable pour l'Europe et l'Afrique »", `${fmt(S.power, 0)} GW`],
    ["Terres promises", "« Un grenier de la taille de la France »", `${fmt(S.land, 0)} km², dont ${fmt(S.saltArea, 0)} km² de croûte saline`],
    ["Paix promise", "« Un chantier pour occuper les armées »", `${fmt(S.refugees, 1)} millions de déplacés`],
    ["Vie marine", "Non mentionnée par Sörgel", `${fmt(S.biodiv, 0)} % subsistant · ${fmt(Math.max(S.salW, S.salE), 1)} g/L`],
    ["Ports", "« De nouveaux ports seront bâtis »", `${S.deadPorts} ports échoués sur ${CITIES.length}`],
    ["Niveau atteint", `−${-S.plan.target} m visés par votre plan`, `${fmt(S.levelW, 1)} m (ouest) · ${fmt(S.levelE, 1)} m (est)`],
    ["Niveau des océans", "Effet non prévu", `−${fmt(Math.abs(S.levelW) * 2.3e12 / 3.6e14, 2)} m dans le monde entier`],
    ["Décisions", "Le plan n'en prévoyait aucune", `${S.decisions} dossiers tranchés en ${S.year - 1930} ans`],
    ["Grand livre", "Sörgel n'avait pas prévu de bailleurs",
      `${S.ledger.length} clause${S.ledger.length > 1 ? 's' : ''} signée${S.ledger.length > 1 ? 's' : ''}, dont ${S.ledger.filter((l) => l.statut === 'denoncee').length} dénoncée(s) · ${S.bonds.length} émission(s)`],
    ["Alexeï Morev", `né en ${S.birth}, entré à l'Institut à ${1930 - S.birth} ans`,
      S.ended && S.year >= deathYear() ? `mort en ${S.year}, à ${S.year - S.birth} ans`
        : `${S.year - S.birth} ans en ${S.year}`],
  ];
}

export { ENDINGS, EPILOGUE, pickEnding, verdict };
