import { S } from '../core/state.js';
import { dirty } from '../core/dirty.js';
import { emit } from '../core/bus.js';
import { setSpeed } from '../core/clock.js';
import { log } from '../core/journal.js';
import { DECISIONS } from './decisions.js';
import { AMBIENT } from './ambient.js';

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
  /* 1. événements historiques imposés. Une échéance de clause porte en plus
     une condition — elle ne se présente que si la clause a été signée — et
     une fenêtre de grâce : la note peut revenir un peu après la date, jamais
     dix ans plus tard. */
  for(const e of DECISIONS){
    if(!e.fy || S.fired[e.id]!==undefined || S.year<e.fy) continue;
    if(S.year > (e.fyEnd ?? e.fy+3)) continue;
    if(e.c && !e.c()) continue;
    fire(e); return;
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
/* Un dossier s'ouvre : le temps s'arrête et l'événement est annoncé. Qui
   l'affiche — une modale, une ligne de console, personne — ne regarde pas
   le moteur. */
function fire(e){
  S.fired[e.id]=S.year; dec.cur=e; S.decisions++;
  speedBefore=S.speed||1; setSpeed(0);
  emit('decision', { ev:e });
}
/* Trancher. L'interface referme sa modale AVANT d'appeler ceci : un effet
   peut terminer la partie, et la modale de verdict qui s'ouvre alors ne doit
   pas être refermée dans la foulée. */
function choose(i){
  const e=dec.cur; if(!e)return;
  dec.cur=null;
  log(`<b style="color:#c9a227;position:static">${e.t}</b> — ${e.o[i][0]}`,'big');
  e.o[i][2]();
  if(!S.ended) setSpeed(speedBefore);
  dirty.ui=true;
  emit('resolved', { ev:e, choice:i });
}
function ambient(){
  const pool=AMBIENT.filter(a=>!S.fired['a_'+a.t] && (!a.y||(S.year>=a.y[0]&&S.year<=a.y[1])) && (!a.c||a.c()));
  if(!pool.length||Math.random()>0.5)return;
  const a=pool[Math.floor(Math.random()*pool.length)];
  S.fired['a_'+a.t]=S.year; log(a.t);
}
export { eligible, tryDecision, fire, choose, ambient };
