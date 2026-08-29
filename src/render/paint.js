import { MW, MH, lon2x, lat2y } from '../core/geo.js';
import { clamp, fmt } from '../core/utils.js';
import { S, opts } from '../core/state.js';
import { dirty } from '../core/dirty.js';
import { cv, ctx, off, view } from './canvas.js';
import { rebuildBase } from './base.js';
import { BORDERS, COUNTRIES } from '../data/borders.js';
import { CITIES, GEO_NOTES, VOLCANOES, FAULTS, EVAPORITES, RESOURCES, SEAROUTE }
  from '../data/places.js';
import { DAMS } from '../data/projects.js';
let P; // projection courante {dx,dy,sc,k}
function proj(lo,la){ return [P.dx+lon2x(lo)*P.sc, P.dy+lat2y(la)*P.sc]; }
function poly(pts,close){ ctx.beginPath();
  pts.forEach((p,i)=>{ const q=proj(p[0],p[1]); i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]); });
  if(close)ctx.closePath(); }
function label(txt,lo,la,size,col,align,dy){
  const q=proj(lo,la); ctx.textAlign=align||'center';
  ctx.font=`${size*P.k}px Inter,-apple-system,sans-serif`;
  ctx.lineWidth=3.2*P.k; ctx.strokeStyle='rgba(6,9,12,.9)';
  ctx.strokeText(txt,q[0],q[1]+(dy||0)*P.k);
  ctx.fillStyle=col; ctx.fillText(txt,q[0],q[1]+(dy||0)*P.k);
}

function paint(){
  if(dirty.base) rebuildBase();
  const W=cv.width, H=cv.height, k=devicePixelRatio||1;
  const sc=Math.min(W/MW,H/MH)*view.z;
  P={sc,k,dx:(W-MW*sc)/2+view.ox, dy:(H-MH*sc)/2+view.oy};
  ctx.fillStyle='#05080b'; ctx.fillRect(0,0,W,H);
  ctx.imageSmoothingEnabled=true; ctx.imageSmoothingQuality='high';
  ctx.drawImage(off,P.dx,P.dy,MW*sc,MH*sc);
  ctx.lineJoin='round'; ctx.lineCap='round';

  /* --- frontières --- */
  if(opts.showBorders){
    ctx.setLineDash([5*k,3.5*k]); ctx.lineWidth=1.25*k;
    ctx.strokeStyle=opts.layer==='eco'?'rgba(240,232,210,.55)':'rgba(232,227,214,.38)';
    for(const b of BORDERS){ poly(b); ctx.stroke(); }
    ctx.setLineDash([]);
  }
  if(opts.showLabels){
    for(const c of COUNTRIES) label(c[2],c[0],c[1],c[2].length>9?9.5:10.5,'rgba(228,222,206,.72)');
  }

  /* --- calque géologique --- */
  if(opts.layer==='geo'){
    ctx.setLineDash([]);
    for(const f of FAULTS){
      ctx.strokeStyle='rgba(224,110,90,.85)'; ctx.lineWidth=2*k; poly(f.p); ctx.stroke();
      const mid=f.p[Math.floor(f.p.length/2)];
      label(f.n,mid[0],mid[1],9.5,'#e0806e','center',-7);
    }
    for(const e of EVAPORITES) label(e[2],e[0],e[1],10,'rgba(238,222,168,.9)');
    for(const g of GEO_NOTES){
      label(g[2],g[0],g[1],10.5,'rgba(226,236,244,.92)','center',-5);
      label(g[3],g[0],g[1],9.5,'rgba(160,196,220,.9)','center',7);
    }
    for(const v of VOLCANOES){
      const q=proj(v[0],v[1]);
      ctx.beginPath(); ctx.moveTo(q[0],q[1]-5*k); ctx.lineTo(q[0]+4.5*k,q[1]+3.5*k); ctx.lineTo(q[0]-4.5*k,q[1]+3.5*k); ctx.closePath();
      ctx.fillStyle='#d8543c'; ctx.fill(); ctx.strokeStyle='rgba(6,9,12,.9)'; ctx.lineWidth=1.2*k; ctx.stroke();
      label(v[2],v[0],v[1],9,'#f0b3a2','center',15);
    }
    if(S.levelW<-70) label(`Rebond isostatique — ${S.quakes} séisme(s) majeur(s)`,10,41.5,11,'#e0806e');
  }

  /* --- calque économique --- */
  if(opts.layer==='eco'){
    const cut=S.levelW<-60;
    ctx.setLineDash([9*k,6*k]); ctx.lineWidth=2.2*k;
    ctx.strokeStyle=cut?'rgba(200,70,55,.85)':'rgba(120,200,235,.75)';
    poly(SEAROUTE); ctx.stroke(); ctx.setLineDash([]);
    label(cut?"Route Europe–Asie : COUPÉE":"Route Europe–Asie (Gibraltar–Suez)",17.5,33.6,10.5,cut?'#e08b82':'#8fd0ea');
    if(S.built.grd||S.built.gib){
      ctx.strokeStyle='rgba(230,198,90,.5)'; ctx.lineWidth=1.4*k; ctx.setLineDash([3*k,3*k]);
      for(const c of CITIES.filter(c=>c.w>=3)){ poly([[-5.6,36.0],[c.lo,c.la]]); ctx.stroke(); }
      ctx.setLineDash([]);
    }
    for(const r of RESOURCES){
      if(r[2]==="Pétrole"&&S.year<1959)continue;
      const q=proj(r[0],r[1]);
      ctx.beginPath(); ctx.arc(q[0],q[1],3.2*k,0,7);
      ctx.fillStyle='#c9a227'; ctx.fill(); ctx.strokeStyle='rgba(6,9,12,.9)';ctx.lineWidth=1.2*k;ctx.stroke();
      label(r[2],r[0],r[1],9.5,'#e0c98a','center',-7);
    }
    if(S.land>2000){
      label(`Terres gagnées : ${fmt(S.land,0)} km²`,17.5,37.2,12,'#e6c65a');
      label(`dont ${fmt(S.saltArea,0)} km² de croûte de sel`,17.5,36.4,10,'#c8bfa0');
    }
    label(`${S.deadPorts} port(s) échoué(s) · ${fmt(S.power,0)} GW · ${fmt(S.money,1)} Md`,4.5,31.6,11,'#cfd6dd');
  }

  /* --- calque sel --- */
  if(opts.layer==='sel'){
    label(`Bassin occidental — ${fmt(S.salW,1)} g/L`,4.5,39.4,12,'#f0e0c0');
    label(`Bassin oriental — ${fmt(S.salE,1)} g/L`,25.0,34.2,12,'#f0e0c0');
    label(`Croûte d'halite et de gypse : ${fmt(S.saltArea,0)} km²`,17.5,31.0,11,'#e0d8c0');
    if(S.dust>12){
      ctx.strokeStyle=`rgba(224,208,168,${clamp(S.dust/60,.25,.85)})`; ctx.lineWidth=2.4*k;
      const plumes=[[[13.0,44.0],[11.0,46.2]],[[11.0,34.5],[13.5,32.0]],[[19.0,36.0],[21.5,38.6]],[[30.0,33.5],[33.0,35.6]],[[4.0,40.0],[3.0,42.6]]];
      for(const p of plumes){ poly(p); ctx.stroke();
        const q=proj(p[1][0],p[1][1]); ctx.beginPath(); ctx.arc(q[0],q[1],3*k,0,7); ctx.fillStyle='rgba(230,216,180,.8)'; ctx.fill(); }
      label(`Tempêtes de sel — indice ${fmt(S.dust,0)}`,8.0,45.6,11,'#e6d8b0');
    }
  }

  /* --- barrages --- */
  for(const id in DAMS){
    const built=S.built[id], active=S.active[id];
    if(!built&&!active&&id!=='gib')continue;
    ctx.strokeStyle=built?'#e6c65a':(active?'rgba(230,198,90,.55)':'rgba(255,255,255,.18)');
    ctx.lineWidth=(built?4.5:2.5)*k;
    for(const s of DAMS[id]){ poly(s); ctx.stroke(); }
  }
  if(S.built.gib) label("BARRAGE DE GIBRALTAR",-5.6,35.3,11,'#e6c65a');
  if(S.built.sic) label("DIGUE SICILE–TUNISIE",11.8,36.4,10.5,'#e6c65a');
  if(S.built.dard) label("BARRAGE DES DARDANELLES",26.3,40.9,10,'#e6c65a');

  /* --- villes --- */
  const lim=S.built.prt?42:16;
  for(const c of CITIES){
    const q=proj(c.lo,c.la);
    if(q[0]<-80||q[0]>W+80||q[1]<-40||q[1]>H+40)continue;
    const s=S.strand[c.n]||0, dead=s>lim;
    const rad=(opts.layer==='eco'?(1.8+c.w*1.3):(c.w>=3?3.1:2.5))*k;
    ctx.beginPath(); ctx.arc(q[0],q[1],rad,0,7);
    ctx.fillStyle=dead?'#d0553f':(s>3?'#e0b060':'#f0e9d6'); ctx.fill();
    ctx.strokeStyle='rgba(0,0,0,.75)'; ctx.lineWidth=1.3*k; ctx.stroke();
    if(opts.showLabels&&(sc/k>0.6||c.w>=3)){
      const t=s>1?`${c.n} · ${fmt(s,0)} km`:c.n;
      ctx.textAlign='left'; ctx.font=`500 ${11*k}px Inter,-apple-system,sans-serif`;
      ctx.lineWidth=3.2*k; ctx.strokeStyle='rgba(5,8,11,.9)';
      ctx.strokeText(t,q[0]+rad+3*k,q[1]+3.6*k);
      ctx.fillStyle=dead?'#e39182':'#e8e3d6'; ctx.fillText(t,q[0]+rad+3*k,q[1]+3.6*k);
    }
  }
}
export { paint, proj, poly, label };
