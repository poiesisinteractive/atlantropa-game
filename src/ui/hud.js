import { S, opts } from '../core/state.js';
import { fmt } from '../core/utils.js';
import { LEGENDS } from './legends.js';
import { paneOps, paneEnv, paneGeo, paneDoc } from './panes.js';
import { paint } from '../render/paint.js';
import { applyRates } from '../core/sim.js';

const SPEEDS = [0, 0.035, 0.10, 0.30];        // années par seconde
const RATE = ["en pause", "1 an ≈ 29 s", "1 an ≈ 10 s", "1 an ≈ 3,3 s"];

function setSpeedBtn(){
  document.querySelectorAll('#speed button').forEach(b => b.classList.toggle('on', +b.dataset.sp === S.speed));
  document.getElementById('rate').textContent = RATE[S.speed];
}
let sliderBusy=false;
function refresh(){
  document.getElementById('sYear').textContent=S.year;
  document.getElementById('sMoney').textContent=fmt(S.money,1);
  document.getElementById('sPower').textContent=fmt(S.power,0);
  document.getElementById('sLand').textContent=fmt(S.land,0);
  document.getElementById('sSal').textContent=fmt(Math.max(S.salW,S.salE),1);
  document.getElementById('sRef').textContent=fmt(S.refugees,1);
  document.getElementById('sLevel').textContent=fmt(S.levelW,1)+' m';
  document.getElementById('legend').innerHTML=LEGENDS[opts.layer];
  const act=document.querySelector('#tabs button.on').dataset.tab;
  if(!(act==='ops'&&sliderBusy)){
    const el=document.getElementById('pane-'+act), sc=el.scrollTop;
    el.innerHTML = act==='ops'?paneOps():act==='env'?paneEnv():act==='geo'?paneGeo():paneDoc();
    el.scrollTop=sc;
    const sl=document.getElementById('slider');
    if(sl){
      sl.addEventListener('pointerdown',()=>sliderBusy=true);
      sl.addEventListener('input',e=>{
        S.turbine=+e.target.value/100;
        applyRates();
        const H=-Math.min(S.levelW,0);
        const p=0.592*S.turbine*H*(S.built.gib?1:0)*(S.built.dard?1.06:1)*(S.built.sic?1.12:1);
        document.getElementById('turbVal').textContent=Math.round(S.turbine*100)+' %';
        document.getElementById('turbDrop').textContent=fmt(S.dropW,2)+' m/an';
        document.getElementById('turbPow').textContent=fmt(p,1)+' GW';
      });
    }
  }
  // En relief, la boucle rend déjà la scène à chaque image : reconstruire en
  // plus le fond 2D coûterait quarante millisecondes pour un canvas masqué.
  if(!opts.mode3d) paint();
}
addEventListener('pointerup',()=>{ if(sliderBusy){sliderBusy=false;refresh();} });
export { SPEEDS, RATE, setSpeedBtn, refresh };
