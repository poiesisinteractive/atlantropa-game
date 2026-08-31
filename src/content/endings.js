import { S } from '../core/state.js';
import { fmt } from '../core/utils.js';
import { CITIES } from '../data/places.js';

/* Les six fins, et le tableau qui les accompagne. Du texte et des chiffres :
   `core/endgame.js` les assemble et les annonce, `ui/bridge.js` les met en
   page. Rien ici ne connaît le DOM. */

const ENDINGS = {
  faillite: ["FAILLITE",
    "L'Institut Atlantropa a cessé ses paiements. Les vannes de Gibraltar restent où vous les avez laissées : une mer à demi vidée n'a pas d'entretien, et personne pour la remplir."],
  abandon: ["LE CONSORTIUM SE DISSOUT",
    "Les nations riveraines se retirent une à une. Le barrage devient un mur sans propriétaire, la mer un problème sans solution."],
  revolte: ["LES PEUPLES DISENT NON",
    "Émeutes du sel de Marseille à Alexandrie. Le Grand Œuvre est arrêté par ceux qu'il devait enrichir."],
  siecle: ["DEUX SIÈCLES PLUS TARD",
    "Le chantier de Sörgel a duré plus longtemps que la plupart des États qui l'ont financé. Voici ce qu'il en reste."],
  reflood: ["LA RÉINONDATION",
    "Vous avez rouvert Gibraltar. Le débit a dépassé mille fois celui de l'Amazone ; une cataracte de plusieurs centaines de mètres a rempli le bassin en deux ans. Les villes bâties sur les fonds ont disparu en une nuit. C'est ainsi que la Méditerranée s'est remplie il y a 5,3 millions d'années — on appelle cela l'inondation zancléenne. Vous venez de la rejouer."],
  victory: ["L'ATLANTROPA EXISTE",
    "Cent cinquante mètres. Le continent que Sörgel avait dessiné à la règle est là, sous vos pieds : une plaine de sel de la taille d'un pays, bordée de ports morts. Vous avez réussi. Reste la question que le plan n'a jamais posée — pour qui ?"],
};

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
    ["Niveau atteint", "−200 m visés", `${fmt(S.levelW, 1)} m (ouest) · ${fmt(S.levelE, 1)} m (est)`],
    ["Niveau des océans", "Effet non prévu", `−${fmt(Math.abs(S.levelW) * 2.3e12 / 3.6e14, 2)} m dans le monde entier`],
    ["Décisions", "Le plan n'en prévoyait aucune", `${S.decisions} dossiers tranchés en ${S.year - 1930} ans`],
  ];
}

export { ENDINGS, EPILOGUE, verdict };
