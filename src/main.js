import './style.css';

import { S, opts } from './core/state.js';
import { SPEEDS, setSpeed } from './core/clock.js';
import { dirty } from './core/dirty.js';
import * as bus from './core/bus.js';
import { endGame } from './core/endgame.js';
import { DECISIONS } from './content/decisions.js';
import { buildGrid, setDem } from './core/grid.js';
import * as grid from './core/grid.js';
import * as geo from './core/geo.js';
import demUrl from './data/dem.bin?url';
import { buildHypsometry } from './core/hypsometry.js';
import { measure, measureExact, computeStrand, updateExposure, stepYear } from './core/sim.js';
import { dec, fire, choose } from './content/engine.js';
import { LEGENDS } from './ui/legends.js';
import { log } from './core/journal.js';
import { drawLog } from './ui/log.js';
import { showModal } from './ui/modal.js';
import { setSpeedBtn, refresh } from './ui/hud.js';
import { paint } from './render/paint.js';
import { resize } from './render/interaction.js';
import { cv } from './render/canvas.js';
import * as R3 from './render3d/scene.js';
import './ui/actions.js';
import './ui/bridge.js';

/* Deux rendus cohabitent le temps du portage : l'ancien Canvas 2D, qui reste
   la référence visuelle, et le relief three.js. Le mode vit dans `opts` et
   non dans une variable locale : l'IHM doit savoir s'il faut redessiner la
   carte 2D, qui coûte 40 ms, ou laisser la boucle rendre la scène. */
let inited3d = false;

let last = performance.now(), lastUI = 0, lastMap = 0;

/* Poignée d'inspection : sert aux outils de vérification (tools/smoke.mjs,
   hypso-check, ui3d-check, shot3d) et au débogage à la console. Aucun code
   de jeu n'en dépend. */
window.__atl = { S, opts, dirty, dec, stepYear, measure, measureExact, refresh, paint,
                 R3, set3d: (on) => setMode3d(on), grid, geo,
                 // les coutures du modèle, pour les outils de vérification
                 bus, setSpeed, endGame, choose, DECISIONS,
                 fireDecision: (id) => fire(id ? DECISIONS.find(d => d.id === id) : DECISIONS[0]) };

function loop(t){
  const dt=Math.min(0.12,(t-last)/1000); last=t;
  if(S.speed>0&&!S.ended){
    const yrs=dt*SPEEDS[S.speed];
    // le niveau descend en continu, pas par sauts annuels
    if(S.built.gib&&!(S.flags.freeze&&S.year<S.flags.freeze)){
      const before=S.levelW;
      S.levelW=Math.max(-230,S.levelW-S.dropW*yrs);
      if(S.built.sic) S.levelE=Math.max(-300,S.levelE-S.dropE*yrs);
      else S.levelE=S.levelW;
      if(!S.built.dard) S.levelB=Math.max(S.levelW,-42);
      if(before!==S.levelW) dirty.base=true;
    }
    S.frac+=yrs;
    while(S.frac>=1){ S.frac-=1; stepYear(); if(S.ended||dec.cur)break; }
  }
  if(opts.mode3d) R3.frame();
  // Le rendu 2D reconstruit 772 200 pixels sur le fil principal : il ne peut
  // pas suivre le niveau image par image, d'où ce bridage. Le rendu 3D n'en
  // a pas besoin, le niveau n'y est qu'un uniform.
  else if(dirty.base && t-lastMap>300){ lastMap=t; paint(); }
  if(dirty.ui && t-lastUI>200){ dirty.ui=false; lastUI=t; refresh(); }
  requestAnimationFrame(loop);
}
document.querySelectorAll('#speed button').forEach(b=>b.onclick=()=>setSpeed(+b.dataset.sp));
document.querySelectorAll('#tabs button').forEach(b=>b.onclick=()=>{
  document.querySelectorAll('#tabs button').forEach(x=>x.classList.remove('on'));
  document.querySelectorAll('.pane').forEach(x=>x.classList.remove('on'));
  b.classList.add('on'); document.getElementById('pane-'+b.dataset.tab).classList.add('on'); refresh();});
/* `[data-l]` et non `#layers button` : le bouton 3D partage la barre des
   calques sans en être un, et perdrait son état actif à chaque changement. */
document.querySelectorAll('#layers button[data-l]').forEach(b=>b.onclick=()=>{
  document.querySelectorAll('#layers button[data-l]').forEach(x=>x.classList.remove('on'));
  b.classList.add('on'); opts.layer=b.dataset.l; dirty.base=true;
  document.getElementById('legend').innerHTML=LEGENDS[opts.layer];
  if(!opts.mode3d) paint();});   // en 3D, frame() relit opts.layer à chaque image
document.getElementById('optBorders').onchange=e=>{opts.showBorders=e.target.checked;if(!opts.mode3d)paint();};
document.getElementById('optLabels').onchange=e=>{opts.showLabels=e.target.checked;if(!opts.mode3d)paint();};
addEventListener('keydown',e=>{ if(e.code==='Space'){e.preventDefault();setSpeed(S.speed?0:1);} });

/* ------------------------------------------------------------- RELIEF 3D */
const panel3d = document.getElementById('view3d');
const btn3d = document.getElementById('btn3d');

function setMode3d(on){
  opts.mode3d = on;
  if(on && !inited3d){
    inited3d = true;
    R3.init(document.getElementById('mapwrap'));
  }
  btn3d.classList.toggle('on', on);
  panel3d.hidden = !on;
  cv.hidden = on;
  const c3 = R3.domElement(); if(c3) c3.hidden = !on;

  /* Frontières et toponymes n'existent que dans le rendu 2D : plutôt que
     d'offrir deux cases qui ne feraient rien, on les retire tant que les
     surcouches ne sont pas portées. */
  document.getElementById('mapopt').hidden = on;
  document.getElementById('zoomhint').textContent = on
    ? 'molette : zoom · glisser : pivoter · clic droit : déplacer'
    : 'molette : zoom · glisser : déplacer';

  if(on){ R3.resize(); syncTilt(); } else { dirty.base=true; paint(); }
}
btn3d.onclick = ()=>setMode3d(!opts.mode3d);

function syncTilt(){
  const d = Math.round(R3.getTilt());
  document.getElementById('ctlTilt').value = d;
  document.getElementById('valTilt').textContent = d+'°';
}
document.getElementById('ctlTilt').oninput = e=>{
  R3.setTilt(+e.target.value);
  document.getElementById('valTilt').textContent = e.target.value+'°';
};
document.getElementById('ctlRelief').oninput = e=>{
  R3.setVScale({relief:+e.target.value});
  document.getElementById('valRelief').textContent = e.target.value;
};
document.getElementById('ctlAbyss').oninput = e=>{
  const v = +e.target.value/100;
  R3.setVScale({compress:v});
  document.getElementById('valAbyss').textContent = v.toFixed(2).replace('.',',');
};
document.getElementById('btnReset').onclick = ()=>{ R3.resetView(); syncTilt(); };
addEventListener('resize', ()=>{ if(opts.mode3d) R3.resize(); });

/* ------------------------------------------------------------------ BOOT */
const bm=document.getElementById('bootmsg');
const breathe=()=>new Promise(r=>setTimeout(r,30));

(async ()=>{
  bm.textContent="chargement du relief…"; await breathe();
  try{
    const r=await fetch(demUrl);
    if(r.ok) setDem(new Int16Array(await r.arrayBuffer()));
  }catch{ /* sans MNT, le relief dessiné à la main prend le relais */ }

  bm.textContent="rasterisation des côtes…"; await breathe();
  buildGrid();
  bm.textContent="mesure des volumes…"; await breathe();
  buildHypsometry();
  {
    const m0=measure(); S.vol0W=m0.vW; S.vol0E=m0.vE; S.area0=m0.aW; S.areaE0=m0.aE;
    computeStrand(true); updateExposure();
    document.getElementById('boot').remove();
    resize(); refresh(); drawLog(); setSpeedBtn();
    log("Munich. L'Institut Atlantropa ouvre ses portes. Herman Sörgel a un plan pour l'Europe : lui donner un continent.",'big');
    showModal(`
      <div class="kicker">1930 · Institut Atlantropa, Munich</div>
      <h2>Le Grand Œuvre</h2>
      <p>Vous dirigez l'institut de Herman Sörgel. Le plan est simple et démesuré : barrer le détroit de Gibraltar,
      abaisser la Méditerranée de <b>200 mètres</b>, en tirer une énergie sans fin et un continent neuf, et souder l'Europe à l'Afrique.</p>
      <p><b>Le nœud du jeu.</b> La puissance d'une turbine vaut <i>débit × hauteur de chute</i>. La hauteur de chute, c'est le vide que vous
      creusez. Pour produire, il faut assécher ; pour assécher, il faut renoncer à produire. Et le sel, lui, ne s'évapore jamais.</p>
      <p><b>Le temps est long — deux siècles.</b> Il s'écoule lentement et s'arrête de lui-même à chaque décision : soixante-sept dossiers
      vous seront soumis, diplomatiques, techniques, financiers, sanitaires, archéologiques. C'est là que se joue la partie, pas dans le
      défilement des années.</p>
      <p style="color:#9aa3ad;font-size:12px">Molette pour zoomer, glisser pour déplacer. <b>Espace</b> met en pause.
      Les calques <b>Géologie</b>, <b>Économie</b> et <b>Sel</b> changent la lecture de la carte, et le bouton <b>3D</b> la bascule en relief.
      L'onglet <b>Dossier</b> contient la documentation historique.</p>
      <div class="choices">
        <button onclick="startGame()">Ouvrir le chantier du siècle</button>
        <button onclick="hideModal()">Regarder la carte d'abord</button>
      </div>`);
    requestAnimationFrame(loop);
  }
})();
