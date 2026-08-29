import { GW_, GH_, N, CELLKM, gx2lon, gy2lat, LON0, PXDEG } from './geo.js';
import { clamp } from './utils.js';
import { MED, ATL, MARM, BLACK, ISLANDS, isEast } from './shapes.js';
import { BASINS, SHOALS, RANGES } from '../data/relief.js';
const isLand=new Uint8Array(N);
const depth =new Float32Array(N);
const elev  =new Float32Array(N);
const basin =new Uint8Array(N);
const expo  =new Int16Array(N);
const shade =new Float32Array(N);
const noise =new Float32Array(N);
let coastDist=new Float32Array(N);

/* Rasterisation par balayage de lignes : bien plus rapide qu'un test
   point-dans-polygone par cellule. */
function scanFill(poly,cb){
  for(let gy=0;gy<GH_;gy++){
    const la=gy2lat(gy); const xs=[];
    for(let i=0,j=poly.length-1;i<poly.length;j=i++){
      const yi=poly[i][1], yj=poly[j][1];
      if((yi>la)!==(yj>la)){
        const xi=poly[i][0], xj=poly[j][0];
        xs.push(xi+(la-yi)*(xj-xi)/(yj-yi));
      }
    }
    if(xs.length<2)continue;
    xs.sort((a,b)=>a-b);
    const row=gy*GW_;
    for(let k=0;k+1<xs.length;k+=2){
      let g0=Math.ceil((xs[k]-LON0)*PXDEG-0.5), g1=Math.floor((xs[k+1]-LON0)*PXDEG-0.5);
      if(g1<0||g0>GW_-1)continue;
      g0=Math.max(0,g0); g1=Math.min(GW_-1,g1);
      for(let gx=g0;gx<=g1;gx++) cb(row+gx,gx,gy,la);
    }
  }
}
function buildGrid(){
  basin.fill(0); expo.fill(-1);
  scanFill(MED,(i,gx,gy,la)=>{ basin[i]=isEast(gx2lon(gx),la)?3:2; });
  scanFill(BLACK,i=>basin[i]=4);
  scanFill(MARM,i=>basin[i]=4);
  scanFill(ATL,i=>basin[i]=1);
  for(const isl of ISLANDS) scanFill(isl,i=>basin[i]=0);
  for(let i=0;i<N;i++) isLand[i]=basin[i]?0:1;

  for(let gy=0;gy<GH_;gy++){ const la=gy2lat(gy);
    for(let gx=0;gx<GW_;gx++){ const lo=gx2lon(gx);
      noise[gy*GW_+gx]=(Math.sin(lo*137.7+la*91.3)*43758.5453)%1; } }

  // distance à la côte (chanfrein 2 passes)
  const INF=1e9;
  for(let i=0;i<N;i++)coastDist[i]=isLand[i]?0:INF;
  for(let y=0;y<GH_;y++)for(let x=0;x<GW_;x++){const i=y*GW_+x;let v=coastDist[i];
    if(x>0)v=Math.min(v,coastDist[i-1]+1); if(y>0)v=Math.min(v,coastDist[i-GW_]+1);
    if(x>0&&y>0)v=Math.min(v,coastDist[i-GW_-1]+1.414); if(x<GW_-1&&y>0)v=Math.min(v,coastDist[i-GW_+1]+1.414);
    coastDist[i]=v;}
  for(let y=GH_-1;y>=0;y--)for(let x=GW_-1;x>=0;x--){const i=y*GW_+x;let v=coastDist[i];
    if(x<GW_-1)v=Math.min(v,coastDist[i+1]+1); if(y<GH_-1)v=Math.min(v,coastDist[i+GW_]+1);
    if(x<GW_-1&&y<GH_-1)v=Math.min(v,coastDist[i+GW_+1]+1.414); if(x>0&&y<GH_-1)v=Math.min(v,coastDist[i+GW_-1]+1.414);
    coastDist[i]=v;}
  // même chose vers l'intérieur des terres
  const landDist=new Float32Array(N);
  for(let i=0;i<N;i++)landDist[i]=isLand[i]?INF:0;
  for(let y=0;y<GH_;y++)for(let x=0;x<GW_;x++){const i=y*GW_+x;let v=landDist[i];
    if(x>0)v=Math.min(v,landDist[i-1]+1); if(y>0)v=Math.min(v,landDist[i-GW_]+1);
    if(x>0&&y>0)v=Math.min(v,landDist[i-GW_-1]+1.414); if(x<GW_-1&&y>0)v=Math.min(v,landDist[i-GW_+1]+1.414);
    landDist[i]=v;}
  for(let y=GH_-1;y>=0;y--)for(let x=GW_-1;x>=0;x--){const i=y*GW_+x;let v=landDist[i];
    if(x<GW_-1)v=Math.min(v,landDist[i+1]+1); if(y<GH_-1)v=Math.min(v,landDist[i+GW_]+1);
    if(x<GW_-1&&y<GH_-1)v=Math.min(v,landDist[i+GW_+1]+1.414); if(x>0&&y<GH_-1)v=Math.min(v,landDist[i+GW_-1]+1.414);
    landDist[i]=v;}

  // bathymétrie et altimétrie
  for(let gy=0;gy<GH_;gy++){ const la=gy2lat(gy);
    for(let gx=0;gx<GW_;gx++){ const i=gy*GW_+gx, lo=gx2lon(gx);
      if(isLand[i]){
        let e=Math.min(900,landDist[i]*CELLKM*3.2);
        for(const r of RANGES){ const u=(lo-r[0])/r[2], v=(la-r[1])/r[3];
          const g=r[4]*Math.exp(-(u*u+v*v)); if(g>e)e=g; }
        elev[i]=e*(0.90+0.20*Math.abs(noise[i])); depth[i]=0;
      } else {
        let d=0;
        for(const b of BASINS){ const u=(lo-b[0])/b[2], v=(la-b[1])/b[3];
          const g=b[4]*Math.exp(-(u*u+v*v)); if(g>d)d=g; }
        d=Math.min(d,coastDist[i]*CELLKM*11+5);
        for(const s of SHOALS){ const u=(lo-s[0])/s[2], v=(la-s[1])/s[3];
          const w=Math.exp(-(u*u+v*v)); if(w>0.05) d=d*(1-w)+Math.min(d,s[4])*w; }
        // canyons sous-marins : rides fines pour donner du grain au relief noyé
        const rip=Math.sin(lo*7.3+la*5.1)*Math.sin(lo*3.1-la*9.7);
        depth[i]=Math.max(4,d*(0.96+0.08*Math.abs(noise[i]))+rip*Math.min(140,d*0.06));
        elev[i]=0;
      }
    }
  }
  buildShade();
}
/* Ombrage : lumière au nord-ouest, 45° */
function buildShade(){
  const H=new Float32Array(N);
  for(let i=0;i<N;i++) H[i]= isLand[i]? elev[i] : -depth[i];
  const px=CELLKM*1000, Z=9;
  const Lx=-0.5, Ly=-0.5, Lz=0.7071;
  for(let y=0;y<GH_;y++)for(let x=0;x<GW_;x++){
    const i=y*GW_+x;
    const xa=x>0?H[i-1]:H[i], xb=x<GW_-1?H[i+1]:H[i];
    const ya=y>0?H[i-GW_]:H[i], yb=y<GH_-1?H[i+GW_]:H[i];
    const gx=(xb-xa)/(2*px)*Z, gy=(yb-ya)/(2*px)*Z;
    const nx=-gx, ny=-gy, nz=1, len=Math.hypot(nx,ny,nz);
    const s=clamp((nx*Lx+ny*Ly+nz*Lz)/len,0,1)/Lz;   // 1 = terrain plat
    shade[i]=0.45+0.58*s;                             // 0,45 (ubac) … 1,26 (adret)
  }
}
export { isLand, depth, elev, basin, expo, shade, noise, coastDist,
         scanFill, buildGrid, buildShade };
