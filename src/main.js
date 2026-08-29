import './style.css';

import { S, opts } from './core/state.js';
import { dirty } from './core/dirty.js';
import { buildGrid } from './core/grid.js';
import { buildHypsometry } from './core/hypsometry.js';
import { measure, measureExact, computeStrand, updateExposure, stepYear } from './core/sim.js';
import { dec } from './content/engine.js';
import { LEGENDS } from './ui/legends.js';
import { log, drawLog } from './ui/log.js';
import { showModal } from './ui/modal.js';
import { SPEEDS, setSpeedBtn, refresh } from './ui/hud.js';
import { paint } from './render/paint.js';
import { resize } from './render/interaction.js';
import './ui/actions.js';

let last = performance.now(), lastUI = 0, lastMap = 0;

/* Poignée d'inspection : sert au test de fumée (tools/smoke.mjs) et au
   débogage à la console. Aucun code de jeu n'en dépend. */
window.__atl = { S, opts, dirty, dec, stepYear, measure, measureExact, refresh, paint };

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
  if(dirty.base && t-lastMap>300){ lastMap=t; paint(); }
  if(dirty.ui && t-lastUI>200){ dirty.ui=false; lastUI=t; refresh(); }
  requestAnimationFrame(loop);
}
document.querySelectorAll('#speed button').forEach(b=>b.onclick=()=>{S.speed=+b.dataset.sp;setSpeedBtn();});
document.querySelectorAll('#tabs button').forEach(b=>b.onclick=()=>{
  document.querySelectorAll('#tabs button').forEach(x=>x.classList.remove('on'));
  document.querySelectorAll('.pane').forEach(x=>x.classList.remove('on'));
  b.classList.add('on'); document.getElementById('pane-'+b.dataset.tab).classList.add('on'); refresh();});
document.querySelectorAll('#layers button').forEach(b=>b.onclick=()=>{
  document.querySelectorAll('#layers button').forEach(x=>x.classList.remove('on'));
  b.classList.add('on'); opts.layer=b.dataset.l; dirty.base=true;
  document.getElementById('legend').innerHTML=LEGENDS[opts.layer]; paint();});
document.getElementById('optBorders').onchange=e=>{opts.showBorders=e.target.checked;paint();};
document.getElementById('optLabels').onchange=e=>{opts.showLabels=e.target.checked;paint();};
addEventListener('keydown',e=>{ if(e.code==='Space'){e.preventDefault();S.speed=S.speed?0:1;setSpeedBtn();} });

/* ------------------------------------------------------------------ BOOT */
const bm=document.getElementById('bootmsg');
setTimeout(()=>{ bm.textContent="rasterisation des côtes…"; setTimeout(()=>{
  buildGrid();
  bm.textContent="mesure des volumes…";
  buildHypsometry();
  setTimeout(()=>{
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
      <p><b>Le temps est long — deux siècles.</b> Il s'écoule lentement et s'arrête de lui-même à chaque décision : soixante-dix dossiers
      vous seront soumis, diplomatiques, techniques, financiers, sanitaires, archéologiques. C'est là que se joue la partie, pas dans le
      défilement des années.</p>
      <p style="color:#9aa3ad;font-size:12px">Molette pour zoomer, glisser pour déplacer. <b>Espace</b> met en pause.
      Les calques <b>Géologie</b>, <b>Économie</b> et <b>Sel</b> changent la lecture de la carte.
      L'onglet <b>Dossier</b> contient la documentation historique.</p>
      <div class="choices">
        <button onclick="startGame()">Ouvrir le chantier du siècle</button>
        <button onclick="hideModal()">Regarder la carte d'abord</button>
      </div>`);
    requestAnimationFrame(loop);
  },30);
},30);},40);
