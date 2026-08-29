/* Projection : plate-carrée corrigée par cos(38°) — la Méditerranée n'est pas
   assez haute pour justifier une Mercator, et une grille régulière en longitude
   rend la rasterisation triviale. */
const LON0=-10, LON1=40, LAT0=29, LAT1=47;
const PXDEG=26;
const LATSCALE=1/Math.cos(38*Math.PI/180);
const MW = Math.round((LON1-LON0)*PXDEG);            // 1300
const MH = Math.round((LAT1-LAT0)*PXDEG*LATSCALE);   // ≈594
const CELL = 1;
const GW_ = MW, GH_ = MH;
const KM_LON = 111.32*Math.cos(38*Math.PI/180);
const CELLKM = (CELL/PXDEG)*KM_LON;                  // ≈3,37 km
const CELL_AREA = CELLKM*CELLKM*1e6;                 // m²
const N=GW_*GH_;

const lon2x = l => (l-LON0)*PXDEG;
const lat2y = l => (LAT1-l)*PXDEG*LATSCALE;
const gx2lon = g => LON0 + (g+0.5)/PXDEG;
const gy2lat = g => LAT1 - (g+0.5)/(PXDEG*LATSCALE);
export { LON0, LON1, LAT0, LAT1, PXDEG, LATSCALE, MW, MH, CELL, GW_, GH_,
         KM_LON, CELLKM, CELL_AREA, N, lon2x, lat2y, gx2lon, gy2lat };
