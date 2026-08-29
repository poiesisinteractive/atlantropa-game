import { S } from '../core/state.js';
import { fmt } from '../core/utils.js';
import { CITIES } from '../data/places.js';
import { showModal } from '../ui/modal.js';
import { setSpeedBtn } from '../ui/hud.js';
function endGame(kind){
  if(S.ended)return; S.ended=kind; S.speed=0; setSpeedBtn();
  const P=[
   ["Énergie promise","« Énergie inépuisable pour l'Europe et l'Afrique »",`${fmt(S.power,0)} GW`],
   ["Terres promises","« Un grenier de la taille de la France »",`${fmt(S.land,0)} km², dont ${fmt(S.saltArea,0)} km² de croûte saline`],
   ["Paix promise","« Un chantier pour occuper les armées »",`${fmt(S.refugees,1)} millions de déplacés`],
   ["Vie marine","Non mentionnée par Sörgel",`${fmt(S.biodiv,0)} % subsistant · ${fmt(Math.max(S.salW,S.salE),1)} g/L`],
   ["Ports","« De nouveaux ports seront bâtis »",`${S.deadPorts} ports échoués sur ${CITIES.length}`],
   ["Niveau atteint","−200 m visés",`${fmt(S.levelW,1)} m (ouest) · ${fmt(S.levelE,1)} m (est)`],
   ["Niveau des océans","Effet non prévu",`−${fmt(Math.abs(S.levelW)*2.3e12/3.6e14,2)} m dans le monde entier`],
   ["Décisions","Le plan n'en prévoyait aucune",`${S.decisions} dossiers tranchés en ${S.year-1930} ans`]
  ];
  const T={
    faillite:["FAILLITE","L'Institut Atlantropa a cessé ses paiements. Les vannes de Gibraltar restent où vous les avez laissées : une mer à demi vidée n'a pas d'entretien, et personne pour la remplir."],
    abandon:["LE CONSORTIUM SE DISSOUT","Les nations riveraines se retirent une à une. Le barrage devient un mur sans propriétaire, la mer un problème sans solution."],
    revolte:["LES PEUPLES DISENT NON","Émeutes du sel de Marseille à Alexandrie. Le Grand Œuvre est arrêté par ceux qu'il devait enrichir."],
    siecle:["DEUX SIÈCLES PLUS TARD","Le chantier de Sörgel a duré plus longtemps que la plupart des États qui l'ont financé. Voici ce qu'il en reste."],
    reflood:["LA RÉINONDATION","Vous avez rouvert Gibraltar. Le débit a dépassé mille fois celui de l'Amazone ; une cataracte de plusieurs centaines de mètres a rempli le bassin en deux ans. Les villes bâties sur les fonds ont disparu en une nuit. C'est ainsi que la Méditerranée s'est remplie il y a 5,3 millions d'années — on appelle cela l'inondation zancléenne. Vous venez de la rejouer."],
    victory:["L'ATLANTROPA EXISTE","Cent cinquante mètres. Le continent que Sörgel avait dessiné à la règle est là, sous vos pieds : une plaine de sel de la taille d'un pays, bordée de ports morts. Vous avez réussi. Reste la question que le plan n'a jamais posée — pour qui ?"]
  }[kind];
  showModal(`
    <div class="kicker">Fin de partie · ${S.year}</div>
    <h2>${T[0]}</h2><p>${T[1]}</p>
    <table class="verdict"><tr><th>Poste</th><th>Ce que promettait Sörgel</th><th>Ce que vous obtenez</th></tr>
    ${P.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')}</table>
    <p style="font-size:12px;color:#9aa3ad">Herman Sörgel a défendu Atlantropa de 1928 jusqu'à sa mort en 1952, renversé à vélo sur la route de son institut. Le projet n'a jamais reçu le moindre coup de pioche : le nucléaire, la décolonisation et le coût l'ont enterré — pas l'écologie, qui n'existait pas encore comme argument.</p>
    <div class="choices"><button onclick="location.reload()">Recommencer</button></div>`);
}
export { endGame };
