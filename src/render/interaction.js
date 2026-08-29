import { clamp } from '../core/utils.js';
import { dirty } from '../core/dirty.js';
import { cv, view } from './canvas.js';
import { paint } from './paint.js';
function resize(){ const r=cv.parentElement.getBoundingClientRect();
  cv.width=Math.max(2,Math.floor(r.width*devicePixelRatio));
  cv.height=Math.max(2,Math.floor(r.height*devicePixelRatio)); paint(); }
addEventListener('resize',resize);
cv.addEventListener('wheel',e=>{e.preventDefault();
  const f=e.deltaY<0?1.12:1/1.12; view.z=clamp(view.z*f,1,8);
  if(view.z<=1.001){view.z=1;view.ox=0;view.oy=0} paint();},{passive:false});
let drag=null;
cv.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY,ox:view.ox,oy:view.oy};cv.setPointerCapture(e.pointerId)});
cv.addEventListener('pointermove',e=>{if(!drag)return;
  view.ox=drag.ox+(e.clientX-drag.x)*devicePixelRatio; view.oy=drag.oy+(e.clientY-drag.y)*devicePixelRatio;
  const bd=dirty.base; dirty.base=false; paint(); dirty.base=bd;});   // pas de recalcul du fond pendant le glisser
addEventListener('pointerup',()=>drag=null);
export { resize };
