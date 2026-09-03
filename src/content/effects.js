import { S, nat } from '../core/state.js';
import { clamp, fmt } from '../core/utils.js';
import { log } from '../core/journal.js';
import { trait, life, portrait } from '../core/character.js';
const SUD=["MA","TN","DZ","LY","EG","CG","TR","LV"];
const RIV=["ES","FR","IT","GR","TR","EG","LY","TN","DZ","YU","LV","MA"];
const E={
  m:n=>{S.money+=n;},
  s:n=>{S.support=clamp(S.support+n,0,100);},
  o:n=>{S.opinion=clamp(S.opinion+n,0,100);},
  a:(id,n)=>{ if(nat[id]) nat[id].att=clamp(nat[id].att+n,0,100); },
  aa:(ids,n)=>ids.forEach(i=>E.a(i,n)),
  r:n=>{S.refugees=Math.max(0,S.refugees+n);},
  b:n=>{S.biodiv=clamp(S.biodiv+n,0,100);},
  f:k=>{S.flags[k]=true;},
  dette:(md,serv,ans)=>{ S.money+=md; S.debtService+=serv; S.debtUntil=Math.max(S.debtUntil,S.year+ans);
    log(`Emprunt de ${md} Md : service de ${fmt(serv,1)} Md/an jusqu'en ${S.debtUntil}.`); },
  gel:a=>{S.flags.freeze=S.year+a;},
  /* Le personnage. `tr` déplace un trait, `vie` des mois d'espérance, `port`
     ajoute une phrase au portrait — un dossier qui marque un homme doit
     pouvoir le dire, sinon le prologue n'aurait été qu'un décor. */
  tr:(axe,n)=>trait(axe,n),
  vie:n=>life(n),
  port:t=>portrait(t),
  retard:(id,f)=>{ S.prog[id]=Math.max(0,S.prog[id]-f); }
};
export { SUD, RIV, E };
