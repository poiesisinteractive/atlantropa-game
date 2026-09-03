import { S } from '../core/state.js';
import { fmt } from '../core/utils.js';
import { on } from '../core/bus.js';
import { choose, dec } from '../content/engine.js';
import { showModal, hideModal } from './modal.js';
import { setSpeedBtn, refresh } from './hud.js';
import { showCard, showInstitut } from './intro.js';

/* Le pont. Le modèle annonce, l'interface répond — et c'est le seul endroit
   où les deux se rencontrent. Rien d'autre dans `ui/` n'est abonné, rien
   dans `core/` ne connaît le DOM. */

on('speed', setSpeedBtn);

/* --- le prologue : une carte, puis l'Institut --- */
on('prologue', (e) => showCard(e));
on('prologue-done', () => { showInstitut(); refresh(); });

/* --- un dossier s'ouvre --- */
on('decision', ({ ev }) => {
  showModal(`
    <div class="kicker">${S.year} · ${ev.k} · décision n° ${S.decisions}</div>
    <h2>${ev.t}</h2>
    <p>${ev.x}</p>
    <div style="font-size:11px;color:#8c949e;border-top:1px solid #2c333c;margin-top:14px;padding-top:9px">
      Trésor ${fmt(S.money,1)} Md · niveau ${fmt(S.levelW,1)} m · soutien ${fmt(S.support,0)} % · opinion ${fmt(S.opinion,0)} % · ${fmt(S.power,0)} GW
    </div>
    <div class="choices">${ev.o.map((c,i)=>
      `<button onclick="pickChoice(${i})">${c[0]}${c[1]?`<em>${c[1]}</em>`:''}</button>`).join('')}</div>`);
});

/* On referme AVANT de trancher : un effet peut terminer la partie, et la
   modale de verdict qui s'ouvre alors doit rester à l'écran. */
window.pickChoice = (i) => { if(!dec.cur) return; hideModal(); choose(i); };

on('resolved', () => refresh());

/* --- la partie est finie --- */
on('endgame', ({ year, title, text, rows, epilogue }) => {
  showModal(`
    <div class="kicker">Fin de partie · ${year}</div>
    <h2>${title}</h2><p>${text}</p>
    <table class="verdict"><tr><th>Poste</th><th>Ce que promettait Sörgel</th><th>Ce que vous obtenez</th></tr>
    ${rows.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')}</table>
    <p style="font-size:12px;color:#9aa3ad">${epilogue}</p>
    <div class="choices"><button onclick="location.reload()">Recommencer</button></div>`);
});
