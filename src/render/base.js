import { N, GW_, GH_ } from '../core/geo.js';
import { clamp, lerp } from '../core/utils.js';
import { isLand, depth, elev, basin, expo, shade, noise } from '../core/grid.js';
import { S, opts } from '../core/state.js';
import { dirty } from '../core/dirty.js';
import { img, octx } from './canvas.js';
function isoBand(d){ // bandes bathymétriques pour le calque géologique
  if(d<50)return 0; if(d<200)return 1; if(d<500)return 2; if(d<1000)return 3;
  if(d<2000)return 4; if(d<3000)return 5; return 6;
}
const ISO_COL=[[176,214,226],[132,190,213],[96,163,198],[68,133,180],[44,102,155],[27,72,124],[14,45,92]];

function rebuildBase(){
  const d=img.data;
  for(let i=0;i<N;i++){
    const o=i*4, nz=noise[i], sh=shade[i];
    let r,g,b;
    if(isLand[i]){
      const e=elev[i];
      if(opts.layer==='geo'){ r=58;g=62;b=58; }
      else if(opts.layer==='eco'){ r=52;g=56;b=54; }
      else{
        // teinte hypsométrique
        const t=clamp(e/2600,0,1);
        if(t<0.18){ const u=t/0.18; r=lerp(96,124,u); g=lerp(118,133,u); b=lerp(78,84,u); }
        else if(t<0.5){ const u=(t-0.18)/0.32; r=lerp(124,158,u); g=lerp(133,140,u); b=lerp(84,96,u); }
        else if(t<0.8){ const u=(t-0.5)/0.3; r=lerp(158,150,u); g=lerp(140,118,u); b=lerp(96,96,u); }
        else { const u=(t-0.8)/0.2; r=lerp(150,226,u); g=lerp(118,224,u); b=lerp(96,222,u); }
      }
      const s=opts.layer==='terrain'?sh:lerp(1,sh,0.55);
      r*=s; g*=s; b*=s;
      r*=0.97+0.06*Math.abs(nz); g*=0.97+0.06*Math.abs(nz); b*=0.97+0.06*Math.abs(nz);
    } else {
      const bs=basin[i];
      const lv = bs===1?0 : bs===4?S.levelB : bs===3?S.levelE : S.levelW;
      const col=depth[i]+lv;
      if(col>0){
        if(opts.layer==='geo'){ const c=ISO_COL[isoBand(col)]; r=c[0];g=c[1];b=c[2]; }
        else if(opts.layer==='sel'){
          const sal = bs===3?S.salE : bs===2?S.salW : 38;
          const t=clamp((sal-38)/7,0,1);
          r=lerp(66,206,t); g=lerp(150,176,t); b=lerp(190,96,t);
          const t2=clamp(col/2600,0,1); r*=1-0.45*t2; g*=1-0.45*t2; b*=1-0.45*t2;
        } else {
          const t=Math.pow(clamp(col/2600,0,1),.62);
          r=lerp(112,10,t); g=lerp(198,36,t); b=lerp(224,76,t);
          if(col<40){ r=lerp(r,198,.4); g=lerp(g,228,.4); b=lerp(b,214,.32); }
        }
        const s=lerp(1,sh,opts.layer==='geo'?0.12:0.30);
        r*=s; g*=s; b*=s;
      } else {
        const age=expo[i]<0?0:clamp((S.year-expo[i])/22,0,1);
        const evap=clamp(depth[i]/700,0,1);
        const sf=clamp(age*(0.45+0.55*evap),0,1);
        if(opts.layer==='sel'){ r=lerp(120,250,sf); g=lerp(104,246,sf); b=lerp(80,236,sf); }
        else if(opts.layer==='geo'){ r=lerp(150,214,sf); g=lerp(132,206,sf); b=lerp(104,186,sf); }
        else { r=lerp(126,224,sf); g=lerp(107,220,sf); b=lerp(76,206,sf); }
        if(depth[i]+lv>-8){ r=lerp(r,92,.45); g=lerp(g,84,.45); b=lerp(b,66,.45); }
        r*=sh; g*=sh; b*=sh;
        r*=0.95+0.10*Math.abs(nz); g*=0.95+0.10*Math.abs(nz); b*=0.95+0.10*Math.abs(nz);
      }
    }
    d[o]=r; d[o+1]=g; d[o+2]=b; d[o+3]=255;
  }
  // trait de côte
  const wet=v=>{ if(isLand[v])return 0; const bs=basin[v];
    const lv=bs===1?0:bs===4?S.levelB:bs===3?S.levelE:S.levelW; return depth[v]+lv>0?1:0; };
  for(let y=1;y<GH_-1;y++)for(let x=1;x<GW_-1;x++){
    const i=y*GW_+x, c=wet(i);
    if(c!==wet(i+1)||c!==wet(i+GW_)){ const o=i*4; d[o]*=.55; d[o+1]*=.55; d[o+2]*=.60; }
  }
  octx.putImageData(img,0,0);
  dirty.base=false;
}
export { rebuildBase, isoBand, ISO_COL };
