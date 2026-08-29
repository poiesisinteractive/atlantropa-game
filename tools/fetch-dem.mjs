/* Cuit un modèle numérique de terrain sur la grille exacte du jeu.

   Source : Terrain Tiles (AWS Open Data), encodage « terrarium ». Le jeu de
   données agrège SRTM, NED, ETOPO1 et GEBCO : il porte donc la bathymétrie,
   ce qui est la moitié du sujet ici — la Méditerranée vidée, c'est un relief
   sous-marin qu'on regarde.

     altitude = (R × 256 + G + B / 256) − 32768

   On échantillonne au zoom 7 (≈ 960 m/px à 38° de latitude) et on moyenne
   3 × 3 mesures par cellule de 3,37 km : la donnée est plus fine que la
   grille, autant s'en servir pour lisser plutôt que pour crénerer.

   Sortie : src/data/dem.bin — Int16 little-endian, altitudes en mètres,
   ligne 0 au nord, dans l'ordre exact de la grille du jeu.

   Usage : node tools/fetch-dem.mjs [--zoom 7] [--cache .dem-cache] */

import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';
import { GW_, GH_, LON0, LAT1, PXDEG, LATSCALE } from '../src/core/geo.js';

const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const Z = Number(arg('--zoom', 7));
const CACHE = arg('--cache', '.dem-cache');
const OUT = 'src/data/dem.bin';
const BASE = 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium';
const SS = 3;                       // sur-échantillonnage : SS × SS par cellule

const n = 2 ** Z;
const lon2px = (lon) => (lon + 180) / 360 * n * 256;
const lat2px = (lat) => {
  const r = lat * Math.PI / 180;
  return (1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2 * n * 256;
};

/* ------------------------------------------------- quelles tuiles ? */
const lonA = LON0, lonB = LON0 + GW_ / PXDEG;
const latB = LAT1, latA = LAT1 - GH_ / (PXDEG * LATSCALE);
const tx0 = Math.floor(lon2px(lonA) / 256), tx1 = Math.floor(lon2px(lonB) / 256);
const ty0 = Math.floor(lat2px(latB) / 256), ty1 = Math.floor(lat2px(latA) / 256);
const need = [];
for (let ty = ty0; ty <= ty1; ty++) for (let tx = tx0; tx <= tx1; tx++) need.push([tx, ty]);

console.log(`zoom ${Z} · emprise ${lonA.toFixed(1)}..${lonB.toFixed(1)}° E, ` +
            `${latA.toFixed(1)}..${latB.toFixed(1)}° N · ${need.length} tuiles`);

fs.mkdirSync(CACHE, { recursive: true });

async function tile(tx, ty) {
  const f = path.join(CACHE, `${Z}-${tx}-${ty}.png`);
  if (!fs.existsSync(f)) {
    const r = await fetch(`${BASE}/${Z}/${tx}/${ty}.png`);
    if (!r.ok) throw new Error(`${Z}/${tx}/${ty} : HTTP ${r.status}`);
    fs.writeFileSync(f, Buffer.from(await r.arrayBuffer()));
  }
  return PNG.sync.read(fs.readFileSync(f));
}

/* Une tuile fait 256 Ko décodée ; les 126 tiennent largement en mémoire. */
const tiles = new Map();
let done = 0;
for (const [tx, ty] of need) {
  tiles.set(`${tx},${ty}`, await tile(tx, ty));
  if (++done % 20 === 0 || done === need.length) process.stdout.write(`\r  ${done}/${need.length} tuiles`);
}
console.log();

function elevAt(px, py) {
  const tx = Math.floor(px / 256), ty = Math.floor(py / 256);
  const t = tiles.get(`${tx},${ty}`);
  if (!t) return 0;
  const x = Math.min(255, Math.max(0, Math.floor(px - tx * 256)));
  const y = Math.min(255, Math.max(0, Math.floor(py - ty * 256)));
  const o = (y * 256 + x) * 4;
  return t.data[o] * 256 + t.data[o + 1] + t.data[o + 2] / 256 - 32768;
}

/* ------------------------------------------------- rééchantillonnage */
const out = new Int16Array(GW_ * GH_);
let min = 1e9, max = -1e9, sea = 0;
for (let gy = 0; gy < GH_; gy++) {
  for (let gx = 0; gx < GW_; gx++) {
    let s = 0;
    for (let j = 0; j < SS; j++) {
      const lat = LAT1 - (gy + (j + 0.5) / SS) / (PXDEG * LATSCALE);
      const py = lat2px(lat);
      for (let i = 0; i < SS; i++) {
        const lon = LON0 + (gx + (i + 0.5) / SS) / PXDEG;
        s += elevAt(lon2px(lon), py);
      }
    }
    const v = Math.round(s / (SS * SS));
    out[gy * GW_ + gx] = Math.max(-32767, Math.min(32767, v));
    if (v < min) min = v; if (v > max) max = v;
    if (v < 0) sea++;
  }
  if (gy % 100 === 0) process.stdout.write(`\r  ligne ${gy}/${GH_}`);
}
console.log(`\r  ${GW_} × ${GH_} cellules                `);

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, Buffer.from(out.buffer));

console.log(`\naltitude   min ${min} m   max ${max} m`);
console.log(`sous le niveau de la mer : ${(sea / out.length * 100).toFixed(1)} % des cellules`);
console.log(`écrit ${OUT} — ${(out.byteLength / 1024).toFixed(0)} Ko`);
if (min > -1000) console.error('\nATTENTION : pas de bathymétrie dans la source ?');
