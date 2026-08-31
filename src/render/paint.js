import { MW, MH, lon2x, lat2y } from '../core/geo.js';
import { dirty } from '../core/dirty.js';
import { cv, ctx, off, view } from './canvas.js';
import { rebuildBase } from './base.js';
import { drawOverlays } from './overlays.js';

/* Le rendu plan : un fond raster reconstruit pixel par pixel, puis les
   surcouches vectorielles — les mêmes qu'en relief, à la projection près. */

function paint(){
  if(dirty.base) rebuildBase();
  const W=cv.width, H=cv.height, k=devicePixelRatio||1;
  const sc=Math.min(W/MW,H/MH)*view.z;
  const dx=(W-MW*sc)/2+view.ox, dy=(H-MH*sc)/2+view.oy;
  ctx.fillStyle='#05080b'; ctx.fillRect(0,0,W,H);
  ctx.imageSmoothingEnabled=true; ctx.imageSmoothingQuality='high';
  ctx.drawImage(off,dx,dy,MW*sc,MH*sc);

  /* Plate-carrée : la projection ne dépend que du cadrage, et aucun point
     n'est jamais hors champ — d'où un `proj` qui ne rend jamais null. */
  drawOverlays({
    ctx, k, W, H,
    proj: (lo,la) => [dx+lon2x(lo)*sc, dy+lat2y(la)*sc],
    detail: sc/k > 0.6,
  });
}
export { paint };
