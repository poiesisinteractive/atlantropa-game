import { S } from '../core/state.js';
import { dirty } from '../core/dirty.js';
import { fmt } from '../core/utils.js';
import { DECISIONS } from './decisions.js';
import { AMBIENT } from './ambient.js';
import { showModal, hideModal } from '../ui/modal.js';
import { log } from '../ui/log.js';
import { setSpeedBtn, refresh } from '../ui/hud.js';

/* Décision en cours. Objet plutôt que `let` exporté : la boucle principale
   doit pouvoir lire la valeur courante, pas une copie figée à l'import. */
export const dec = { cur: null };
let speedBefore = 1, evCooldown = 0;
function eligible(e){
  if(e.fy) return false;
  const f=S.fired[e.id];
  if(f!==undefined && !(e.rep && S.year-f>=e.rep)) return false;
  if(e.y && (S.year<e.y[0]||S.year>e.y[1])) return false;
  if(e.c && !e.c()) return false;
  return true;
}
function tryDecision(){
  if(S.ended||dec.cur)return;
  // 1. événements historiques imposés
  for(const e of DECISIONS){
    if(e.fy && S.fired[e.id]===undefined && S.year>=e.fy){ fire(e); return; }
  }
  if(evCooldown>0){ evCooldown--; return; }
  const pool=DECISIONS.filter(eligible);
  if(!pool.length)return;
  let tot=0; pool.forEach(e=>tot+=(e.p||1));
  let r=Math.random()*tot, pick=pool[0];
  for(const e of pool){ r-=(e.p||1); if(r<=0){pick=e;break;} }
  fire(pick);
  evCooldown=1+Math.floor(Math.random()*3);
}
function fire(e){
  S.fired[e.id]=S.year; dec.cur=e; S.decisions++;
  speedBefore=S.speed||1; S.speed=0; setSpeedBtn();
  showModal(`
    <div class="kicker">${S.year} · ${e.k} · décision n° ${S.decisions}</div>
    <h2>${e.t}</h2>
    <p>${e.x}</p>
    <div style="font-size:11px;color:#8c949e;border-top:1px solid #2c333c;margin-top:14px;padding-top:9px">
      Trésor ${fmt(S.money,1)} Md · niveau ${fmt(S.levelW,1)} m · soutien ${fmt(S.support,0)} % · opinion ${fmt(S.opinion,0)} % · ${fmt(S.power,0)} GW
    </div>
    <div class="choices">${e.o.map((c,i)=>
      `<button onclick="pickChoice(${i})">${c[0]}${c[1]?`<em>${c[1]}</em>`:''}</button>`).join('')}</div>`);
}
window.pickChoice=i=>{
  const e=dec.cur; if(!e)return;
  dec.cur=null; hideModal();
  log(`<b style="color:#c9a227;position:static">${e.t}</b> — ${e.o[i][0]}`,'big');
  e.o[i][2]();
  if(!S.ended){ S.speed=speedBefore; setSpeedBtn(); }
  dirty.ui=true; refresh();
};
function ambient(){
  const pool=AMBIENT.filter(a=>!S.fired['a_'+a.t] && (!a.y||(S.year>=a.y[0]&&S.year<=a.y[1])) && (!a.c||a.c()));
  if(!pool.length||Math.random()>0.5)return;
  const a=pool[Math.floor(Math.random()*pool.length)];
  S.fired['a_'+a.t]=S.year; log(a.t);
}
export { eligible, tryDecision, fire, ambient };
