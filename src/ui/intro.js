import { S } from '../core/state.js';
import { showModal, hideModal } from './modal.js';
import { setSpeed } from '../core/clock.js';
import { log } from '../core/journal.js';
import { startPrologue, answerPrologue, skipPrologue, pro } from '../content/prologue.js';
import { refresh } from './hud.js';

/* Les trois écrans d'ouverture : la porte, le prologue, l'Institut.

   Ils vivent dans `ui/` et nulle part ailleurs. Le prologue lui-même est du
   contenu (`content/prologue.js`) et tourne sans écran — c'est ce qui permet
   à `sim-check` de le jouer huit fois par lancement, sans navigateur. */

function showOpening() {
  showModal(`
    <div class="kicker">1926 · Paris, École nationale des ponts et chaussées</div>
    <h2>Alexeï Morev</h2>
    <p>Né en 1905 près de Taganrog. Évacué de Crimée en novembre 1920 avec les débris de l'armée Wrangel.
    Passeport Nansen depuis 1922 : le carnet vert des apatrides, à renouveler chaque année, trois heures de queue.
    Élève ingénieur à Paris, où on l'appelle Alexis Moreff parce que c'est plus commode.</p>
    <p><b>Le prologue.</b> Onze cartes, de 1926 à 1930. Elles ne construisent rien : elles décident qui vous êtes
    quand vous montez dans le train de Munich — ce que vous croyez, ce que vous devez, et le plan que vous apportez
    dans votre valise. Il n'y a ni jauge ni score : vous vous lirez dans l'onglet <b>Portrait</b>.</p>
    <p><b>Puis l'Institut.</b> Herman Sörgel existe, et il a douze ans de plus que vous et un continent en tête.
    Vous entrez chez lui comme disciple. Vous hériterez de l'Institut à sa mort, en décembre 1952 — et la partie
    s'arrêtera à la vôtre.</p>
    <div class="choices">
      <button onclick="beginPrologue()">Commencer en 1926</button>
      <button onclick="skipToInstitute()">Passer le prologue — entrer à l'Institut</button>
    </div>`);
}

/* Une carte du prologue. Même grammaire que les dossiers de l'acte II —
   bandeau, titre, situation, choix — parce que c'est le même geste. */
function showCard({ card, step, total }) {
  showModal(`
    <div class="kicker">${card.y} · ${card.k} · carte ${step + 1} sur ${total}</div>
    <h2>${card.t}</h2>
    <p>${card.x}</p>
    <div class="choices">${card.o.map((c, i) =>
      `<button onclick="pickPrologue(${i})">${c[0]}${c[1] ? `<em>${c[1]}</em>` : ''}</button>`).join('')}</div>`);
}

/* L'arrivée à Munich. C'est l'ancienne modale d'ouverture, réécrite pour un
   homme qui entre chez Sörgel au lieu de le remplacer. */
function showInstitut() {
  const plan = S.plan;
  const coeur = { gib: 'Gibraltar', sic: 'la digue Sicile–Tunisie', dard: 'les Dardanelles' }[plan.core];
  const but = { energie: "l'énergie", terres: 'les terres', paix: 'la paix par le chantier' }[plan.benefit];
  showModal(`
    <div class="kicker">1930 · Institut Atlantropa, Munich</div>
    <h2>Le Grand Œuvre</h2>
    <p>Vous entrez à l'Institut de Herman Sörgel. Le plan est simple et démesuré : barrer le détroit de Gibraltar,
    abaisser la Méditerranée, en tirer une énergie sans fin et un continent neuf, et souder l'Europe à l'Afrique.
    Le vôtre commence par <b>${coeur}</b>, vise <b>${-plan.target} mètres</b> et se défend par <b>${but}</b>.</p>
    <p><b>Le nœud du jeu.</b> La puissance d'une turbine vaut <i>débit × hauteur de chute</i>. La hauteur de chute, c'est le vide que vous
    creusez. Pour produire, il faut assécher ; pour assécher, il faut renoncer à produire. Et le sel, lui, ne s'évapore jamais.</p>
    <p><b>Le temps est celui d'une vie.</b> Il s'écoule lentement et s'arrête de lui-même à chaque décision : des dizaines de dossiers
    vous seront soumis, diplomatiques, techniques, financiers, sanitaires, archéologiques. Sörgel mourra en 1952 et vous laissera
    l'Institut ; vous mourrez à votre tour, et l'on jugera ce que vous laissez.</p>
    <p style="color:#9aa3ad;font-size:12px">Molette pour zoomer, glisser pour déplacer. <b>Espace</b> met en pause.
    Les calques <b>Géologie</b>, <b>Économie</b> et <b>Sel</b> changent la lecture de la carte, et le bouton <b>3D</b> la bascule en relief.
    L'onglet <b>Portrait</b> tient votre biographie, l'onglet <b>Dossier</b> la documentation historique.</p>
    <div class="choices">
      <button onclick="startGame()">Ouvrir le chantier du siècle</button>
      <button onclick="hideModal()">Regarder la carte d'abord</button>
    </div>`);
}

window.beginPrologue = () => { startPrologue(); };
window.pickPrologue = (i) => { if (pro.cur) answerPrologue(i); };
window.skipToInstitute = () => {
  skipPrologue();
  log("Munich. Vous descendez du train avec une valise et un dossier de calculs.", 'big');
};
window.startGame = () => { hideModal(); setSpeed(1); refresh(); };

export { showOpening, showCard, showInstitut };
