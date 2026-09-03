import { N, GW_, GH_, CELLKM, CELL_AREA, lon2x, lat2y } from './geo.js';
import { clamp, lerp, fmt } from './utils.js';
import { depth, basin, expo } from './grid.js';
import { hypsoMeasure } from './hypsometry.js';
import { S, nat } from './state.js';
import { dirty } from './dirty.js';
import { PROJECTS } from '../data/projects.js';
import { CITIES } from '../data/places.js';
import { log } from './journal.js';
import { COND_EVENTS } from '../content/condEvents.js';
import { ambient, tryDecision } from '../content/engine.js';
import { pickEnding } from '../content/endings.js';
import { deathYear, lifeYear } from './character.js';
import { bondsDue } from './ledger.js';
import { endGame } from './endgame.js';

/* Le débit turbiné compense une part du déficit : la mer descend d'autant moins. */
function applyRates(){
  S.dropW = S.rBase*(1-S.turbine);
  S.dropE = S.built.sic ? S.rBaseE*(1-S.turbine*0.5) : S.dropW;
}
/* Aires et volumes en O(1) par lecture de la courbe hypsométrique.
   La surface de croûte saline, elle, dépend de l'historique d'exposition :
   elle reste comptée cellule par cellule, mais une seule fois par an,
   dans updateExposure(). */
function measure(){
  return hypsoMeasure(S.levelW, S.levelE);
}
/* Version de référence, conservée pour les tests : le balayage complet
   qu'elle remplace. tools/hypso-check.mjs compare les deux. */
function measureExact(){
  let vW=0,vE=0,aW=0,aE=0,land=0;
  for(let i=0;i<N;i++){
    const b=basin[i]; if(b!==2&&b!==3)continue;
    const lv=b===2?S.levelW:S.levelE, col=depth[i]+lv;
    if(col>0){ if(b===2){vW+=col;aW++;} else {vE+=col;aE++;} }
    else land++;
  }
  return {vW:vW*CELL_AREA,vE:vE*CELL_AREA,aW:aW*CELL_AREA,aE:aE*CELL_AREA,
          land:land*CELL_AREA/1e6};
}
function updateExposure(){
  let salt=0;
  for(let i=0;i<N;i++){ const b=basin[i]; if(b!==2&&b!==3)continue;
    const lv=b===2?S.levelW:S.levelE;
    if(depth[i]+lv<=0){
      if(expo[i]<0)expo[i]=S.year;
      if(S.year-expo[i]>6)salt++;
    } else expo[i]=-1; }
  S.saltArea=salt*CELL_AREA/1e6;
}
const wdist=new Float32Array(N);
function waterDistance(){
  const INF=1e9;
  for(let i=0;i<N;i++){ const b=basin[i]; let w;
    if(b===1||b===4)w=true; else if(b===2)w=depth[i]+S.levelW>0;
    else if(b===3)w=depth[i]+S.levelE>0; else w=false;
    wdist[i]=w?0:INF; }
  for(let y=0;y<GH_;y++)for(let x=0;x<GW_;x++){const i=y*GW_+x;let v=wdist[i];
    if(x>0)v=Math.min(v,wdist[i-1]+1); if(y>0)v=Math.min(v,wdist[i-GW_]+1);
    if(x>0&&y>0)v=Math.min(v,wdist[i-GW_-1]+1.414); if(x<GW_-1&&y>0)v=Math.min(v,wdist[i-GW_+1]+1.414); wdist[i]=v;}
  for(let y=GH_-1;y>=0;y--)for(let x=GW_-1;x>=0;x--){const i=y*GW_+x;let v=wdist[i];
    if(x<GW_-1)v=Math.min(v,wdist[i+1]+1); if(y<GH_-1)v=Math.min(v,wdist[i+GW_]+1);
    if(x<GW_-1&&y<GH_-1)v=Math.min(v,wdist[i+GW_+1]+1.414); if(x>0&&y<GH_-1)v=Math.min(v,wdist[i+GW_-1]+1.414); wdist[i]=v;}
}
let baseStrand={};
function computeStrand(first){
  waterDistance();
  for(const c of CITIES){
    const gx=clamp(Math.round(lon2x(c.lo)),0,GW_-1), gy=clamp(Math.round(lat2y(c.la)),0,GH_-1);
    const km=wdist[gy*GW_+gx]*CELLKM;
    if(first)baseStrand[c.n]=km;
    S.strand[c.n]=Math.max(0,km-(baseStrand[c.n]||0));
  }
}

/* ---------------------------------------------------------------- TOUR */
function stepYear(){
  if(S.ended)return;
  S.year++;
  const frozen = S.flags.freeze && S.year<S.flags.freeze;

  let build=0;
  for(const p of PROJECTS){
    if(!S.active[p.id]||S.built[p.id])continue;
    // `projMul` porte l'ouvrage-cœur du prologue : Morev l'a dessiné lui-même,
    // il coûte 15 % de moins.
    const per=p.cost/p.yrs*S.costMul*(S.projMul[p.id]||1);
    if(S.money-build < per){ if(S.year%4===0)log(`Chantier « ${p.n} » au ralenti : les caisses sont vides.`,'bad'); continue; }
    if(frozen)continue;
    build+=per; S.prog[p.id]+=1/p.yrs;
    if(S.prog[p.id]>=0.999){ S.prog[p.id]=1;S.built[p.id]=true;S.active[p.id]=false;
      log(`Achevé : ${p.n}.`,'good');
      if(p.id==='agr')S.flags.agrY=S.year;
      if(p.id==='sic')log("Le bassin oriental est isolé : il peut désormais descendre seul, bien plus bas que l'occidental.",'good');
    }
  }

  const m0=measure();
  /* Taux d'abaissement (m/an), appliqué en continu par la boucle d'animation */
  if(S.built.gib && !frozen){
    let r=0.95;
    if(!S.built.dard && S.levelW>-45) r*=0.66;
    if(!S.built.suez && S.levelW<-20) r*=0.78;
    r*=clamp(m0.aW/S.area0,0.55,1.05);
    S.rBase=r;
    S.rBaseE=S.built.sic ? 0.95*clamp(m0.aE/S.areaE0,0.5,1.05) : 0;
  } else { S.rBase=0; S.rBaseE=0; }
  applyRates();
  S.levelB = S.built.dard ? 0 : Math.max(S.levelW,-42);

  const m=measure();
  const H=-Math.min(S.levelW,0);
  S.power = 0.592*S.turbine*H*(S.built.gib?1:0)*(S.built.dard?1.06:1)*(S.built.sic?1.12:1)*S.powerMul;

  let inc = 3.0 + S.power*(S.flags.oil?0.16:0.115)*(S.built.grd?1.35:1);
  for(const k in nat) if(nat[k].mem) inc+=nat[k].ct;
  if(S.built.cit) inc+=2.4;
  S.agriYield = S.built.agr ? (S.flags.agrFail? Math.max(0,S.agriYield-0.35) : Math.min(3.2,S.agriYield+0.3)) : 0;
  inc=(inc+S.agriYield)*S.incomeMul;
  /* Deux dettes : l'ancienne (`E.dette`, un emprunt forfaitaire attaché à
     certains dossiers) et les émissions du registre, qui s'éteignent d'elles-
     mêmes à leur terme. */
  const dette = (S.year<S.debtUntil ? S.debtService : 0) + bondsDue();
  const exp = build+0.4+dette+(S.built.gib?1.1:0)+(S.built.sic?0.7:0)+(S.built.cgo?0.9:0)+S.refugees*0.18+S.deadPorts*0.22;
  S.income=inc; S.spend=exp; S.money+=inc-exp;
  if(S.money<-12) { endGame('faillite'); return; }

  if(S.built.sic){
    S.salW=38*S.vol0W/Math.max(m.vW,S.vol0W*0.35);
    S.salE=38*S.vol0E/Math.max(m.vE,S.vol0E*0.30);
  } else {
    S.salW=38*(S.vol0W+S.vol0E)/Math.max(m.vW+m.vE,(S.vol0W+S.vol0E)*0.35);
    S.salE=S.salW;
  }
  const sal=Math.max(S.salW,S.salE);
  let bT = sal<=38.6?100 : sal<40?lerp(100,62,(sal-38.6)/1.4) : sal<41.5?lerp(62,30,(sal-40)/1.5)
         : sal<43?lerp(30,9,(sal-41.5)/1.5) : Math.max(1,lerp(9,1,(sal-43)/2));
  bT*=clamp(m.aW/S.area0,0.4,1);
  S.biodiv=clamp(S.biodiv+(bT-S.biodiv)*0.16,0,100);

  /* S.saltArea est tenu à jour par updateExposure(), en fin de tour : la
     charge de poussière lit donc la croûte telle qu'elle était l'an dernier.
     Un an de retard sur une croûte qui met plus de six ans à se former ne
     se voit pas, et cela évite de balayer deux fois les 772 200 cellules. */
  S.land=m.land;
  S.dust=clamp(S.saltArea/9000,0,100)*(S.flags.fixation?0.6:1);

  computeStrand();
  let dead=0; const lim=S.built.prt?42:16;
  for(const c of CITIES) if(S.strand[c.n]>lim) dead++;
  S.deadPorts=dead;

  S.refugees += dead*0.045 + (S.dust>25?0.22:0) + (S.built.cgo&&S.year-(S.flags.cgoY||9e9)<20?0.5:0);
  if(S.built.cgo&&!S.flags.cgoY)S.flags.cgoY=S.year;
  S.opinion=clamp(S.opinion+((S.power>25?1.1:0)+(S.built.cit?0.5:0)+(S.money>25?0.3:0)
             -S.deadPorts*0.28-(100-S.biodiv)*0.035-S.refugees*0.08)*0.55,0,100);
  S.support=clamp(S.support+((S.power>40?0.9:0)+(S.opinion>60?0.6:-0.5)-(S.flags.deco?0.6:0)-S.deadPorts*0.14)*0.5,0,100);

  for(const c of CITIES){ const n=nat[c.nat]; if(n&&S.strand[c.n]>lim) n.att-=0.18*c.w; }
  for(const k in nat){ const n=nat[k];
    n.att=clamp(n.att+(S.support>65?0.35:0)+(S.power>60?0.25:0)-(S.biodiv<40?0.4:0)-(S.dust>25?0.3:0),0,100);
    if(n.mem&&n.att<22){ n.mem=false; log(`${n.n} quitte le consortium Atlantropa.`,'bad'); }
  }

  for(const e of COND_EVENTS) if(e.c()) e.fn();
  if(S.year%10===0) log(`— ${S.year} — niveau ${fmt(S.levelW,1)} m · ${fmt(S.power,0)} GW · ${fmt(S.land,0)} km² émergés · salinité ${fmt(Math.max(S.salW,S.salE),1)} g/L · biodiversité ${fmt(S.biodiv,0)} %`,'big');

  /* Les trois arrêts, puis la mort. L'ordre compte : une partie qui casse
     casse, même l'année où Morev devait mourir. */
  lifeYear();
  if(S.support<8&&S.built.gib) endGame('abandon');
  else if(S.opinion<6) endGame('revolte');
  else if(S.year>=deathYear()) endGame(pickEnding());

  updateExposure();
  dirty.ui=true;
  if(!S.ended){ ambient(); tryDecision(); }
}

export { applyRates, measure, measureExact, updateExposure, waterDistance,
         computeStrand, stepYear, wdist };
