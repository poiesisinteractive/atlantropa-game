import { DataTexture, RedFormat, FloatType, RGBAFormat, UnsignedByteType,
         LinearFilter, NearestFilter, ClampToEdgeWrapping, NoColorSpace } from 'three';
import { GW_, GH_, N } from '../core/geo.js';
import { isLand, depth, elev, basin, expo, noise } from '../core/grid.js';
import { S } from '../core/state.js';
import { clamp } from '../core/utils.js';

/* Le terrain ne change jamais de la partie : il part au GPU une fois pour
   toutes. Seuls trois flottants — les niveaux des trois bassins — et un octet
   par cellule — l'âge d'exposition, une fois par an — voyagent ensuite.

   heightTex  R32F   altitude en mètres, négative sous le zéro marin.
                     Filtrage linéaire : c'est ce qui donne un trait de côte
                     lisse là où la grille est carrée.
   maskTex    RGBA8  R = indice de bassin : 0 terre · 1 Atlantique ·
                     2 bassin occidental · 3 bassin oriental ·
                     4 Marmara et mer Noire
                     G = bruit de grain, ramené dans [0,1]
                     B = âge d'exposition, 0 = mer, 255 = émergé depuis 22 ans
                     Filtrage au plus proche : la cellule est l'unité de sens. */

export const heightTex = new DataTexture(new Float32Array(N), GW_, GH_, RedFormat, FloatType);
export const maskTex = new DataTexture(new Uint8Array(N * 4), GW_, GH_, RGBAFormat, UnsignedByteType);

for (const t of [heightTex, maskTex]) {
  t.wrapS = t.wrapT = ClampToEdgeWrapping;
  t.colorSpace = NoColorSpace;
  t.generateMipmaps = false;
}
heightTex.minFilter = heightTex.magFilter = LinearFilter;
maskTex.minFilter = maskTex.magFilter = NearestFilter;

/* Corrige le décalage d'un demi-texel : le sommet i de la grille tombe au
   centre du texel i, pas sur son bord. */
export const UV_FIX = [(GW_ - 1) / GW_, (GH_ - 1) / GH_, 0.5 / GW_, 0.5 / GH_];
export const TEXEL = [1 / GW_, 1 / GH_];

export function uploadTerrain() {
  const h = heightTex.image.data, m = maskTex.image.data;
  for (let i = 0; i < N; i++) {
    h[i] = isLand[i] ? elev[i] : -depth[i];
    m[i * 4] = basin[i];
    m[i * 4 + 1] = Math.round((noise[i] * 0.5 + 0.5) * 255);
    m[i * 4 + 3] = 255;
  }
  heightTex.needsUpdate = true;
  uploadExposure();
}

/* Une passe par an. L'âge d'exposition porte la croûte de sel : les fonds
   découverts blanchissent en une vingtaine d'années. */
export function uploadExposure() {
  const m = maskTex.image.data;
  for (let i = 0; i < N; i++) {
    const e = expo[i];
    m[i * 4 + 2] = e < 0 ? 0 : Math.round(clamp((S.year - e) / 22, 0, 1) * 255);
  }
  maskTex.needsUpdate = true;
}
