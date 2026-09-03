import { S, nat } from '../core/state.js';
import { clamp } from '../core/utils.js';
import { dirty } from '../core/dirty.js';
import { PROJECTS } from '../data/projects.js';
import { log } from '../core/journal.js';
import { refresh } from './hud.js';
import { endGame } from '../core/endgame.js';
import { issue } from '../core/ledger.js';
window.toggleProj=id=>{ S.active[id]=!S.active[id];
  if(S.active[id])log(`Chantier ouvert : ${PROJECTS.find(p=>p.id===id).n}.`); refresh(); };
window.negotiate=k=>{ if(S.money<2)return; S.money-=2; const n=nat[k];
  n.att=clamp(n.att+12+Math.random()*14-(S.flags.deco&&["MA","TN","DZ","LY","EG","CG"].includes(k)?6:0),0,100);
  if(n.att>=58&&!n.mem){n.mem=true;log(`${n.n} rejoint le consortium Atlantropa.`,'good');}
  else if(!n.mem)log(`Pourparlers avec ${n.n} : progrès, sans signature.`);
  refresh(); };
window.issueBond=(md,ans)=>{ if(issue(md,ans)) refresh(); };
window.reflood=()=>{
  if(S.levelW>-8){ S.levelW=0;S.levelE=0;S.built.gib=false;S.prog.gib=0;dirty.base=true;
    log("Les vannes sont rouvertes. La mer reprend sa place sans dommage — et le projet meurt dans l'indifférence.",'big');
    endGame('abandon'); return; }
  endGame('reflood');
};
