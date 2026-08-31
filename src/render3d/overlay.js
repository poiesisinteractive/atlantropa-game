import { Vector3, MathUtils } from 'three';
import { MW, MH, GW_, GH_, lon2x, lat2y } from '../core/geo.js';
import { isLand, elev, depth, basin } from '../core/grid.js';
import { S, opts } from '../core/state.js';
import { yOf, vscale } from './scale.js';
import { drawOverlays } from '../render/overlays.js';

/* Les surcouches, en relief.

   Elles restent du dessin 2D — du texte lisible et des traits d'épaisseur
   constante, ce qu'aucune géométrie three.js ne donne à ce prix. Ce qui
   change, c'est la projection : au lieu du cadrage plate-carrée, chaque
   longitude-latitude passe par la caméra.

   Deux précautions font toute la différence entre une carte et un gribouillis :

   • le point se pose sur la surface *visible*, c'est-à-dire le maximum du
     terrain et du niveau de son bassin. Un port reste sur sa côte quand la
     mer se retire, et la route maritime flotte sur l'eau au lieu de plonger
     dans la plaine abyssale ;
   • un point derrière la caméra est écarté plutôt que projeté. Sans cela, la
     division perspective le renvoie de l'autre côté de l'écran et les
     frontières se replient en éventail dès qu'on incline la vue. */

let canvas, ctx;
const P = new Vector3();

export function init(container, after) {
  canvas = document.createElement('canvas');
  canvas.id = 'cv3o';
  /* Juste après le canvas WebGL, et avant les surcouches HTML : l'ordre du
     DOM fait l'ordre de peinture. `pointer-events:none` dans la feuille de
     style, sans quoi il avalerait les gestes destinés à OrbitControls. */
  container.insertBefore(canvas, after.nextSibling);
  ctx = canvas.getContext('2d');
  return canvas;
}

export function element() { return canvas; }

export function resize(w, h) {
  if (!canvas) return;
  const k = Math.min(devicePixelRatio || 1, 2);
  canvas.width = Math.max(2, Math.round(w * k));
  canvas.height = Math.max(2, Math.round(h * k));
}

/* Altitude de la surface visible, en mètres. Terre : le relief. Eau : le
   niveau du bassin, ou le fond s'il est déjà découvert. */
function surfaceH(lo, la) {
  const gx = Math.round(lon2x(lo) - 0.5), gy = Math.round(lat2y(la) - 0.5);
  if (gx < 0 || gx >= GW_ || gy < 0 || gy >= GH_) return 0;
  const i = gy * GW_ + gx;
  const h = isLand[i] ? elev[i] : -depth[i];
  const b = basin[i];
  if (b === 0) return h;
  const lv = b === 1 ? 0 : b === 2 ? S.levelW : b === 3 ? S.levelE : S.levelB;
  return Math.max(h, lv);
}

/* Longitude-latitude -> unités de carte. Le maillage du terrain place le
   sommet de colonne i en −MW/2 + i·MW/(GW_−1), et lon2x rend i+0,5 : d'où le
   demi-décalage. Sans lui les toponymes glissent d'une demi-cellule. */
const SX = MW / (GW_ - 1), SZ = MH / (GH_ - 1);
const worldX = (lo) => -MW / 2 + (lon2x(lo) - 0.5) * SX;
const worldZ = (la) => -MH / 2 + (lat2y(la) - 0.5) * SZ;

/* Ce qui, changeant, oblige à redessiner. Comparer une clé coûte moins cher
   que trois cents étiquettes soixante fois par seconde, et la caméra amortie
   d'OrbitControls s'immobilise vite. */
function key(camera) {
  const e = camera.matrixWorldInverse.elements;
  return [
    e[0], e[1], e[2], e[4], e[5], e[6], e[8], e[9], e[10], e[12], e[13], e[14],
    camera.projectionMatrix.elements[5], canvas.width, canvas.height,
    opts.layer, opts.showBorders, opts.showLabels,
    S.levelW, S.levelE, S.levelB, S.year, S.land, S.saltArea, S.dust, S.power,
    S.money, S.salW, S.salE, S.deadPorts, S.quakes,
    vscale.relief, vscale.compress,
  ].join('|');
}

let lastKey = '';

export function draw(camera, dist, force) {
  if (!ctx) return;
  const k = key(camera);
  if (!force && k === lastKey) return;
  lastKey = k;

  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  camera.updateMatrixWorld();
  camera.matrixWorldInverse.copy(camera.matrixWorld).invert();
  const view = camera.matrixWorldInverse, proj = camera.projectionMatrix;
  const near = camera.near;

  const project = (lo, la) => {
    P.set(worldX(lo), yOf(surfaceH(lo, la)), worldZ(la)).applyMatrix4(view);
    if (P.z > -near) return null;                 // derrière la caméra
    P.applyMatrix4(proj);                          // divise par w au passage
    if (P.x < -1.6 || P.x > 1.6 || P.y < -1.6 || P.y > 1.6) return null;
    return [(P.x * 0.5 + 0.5) * W, (-P.y * 0.5 + 0.5) * H];
  };

  /* Même seuil qu'en plan : les petites étiquettes de villes apparaissent
     au-delà de 0,6 pixel par unité de carte. Faute de zoom uniforme, la
     mesure se prend à la distance de la cible. */
  const pxPerUnit = (H / (devicePixelRatio || 1)) / 2
                  / (Math.tan(MathUtils.degToRad(camera.fov) / 2) * Math.max(dist, 1));

  drawOverlays({ ctx, k: Math.min(devicePixelRatio || 1, 2), W, H, proj: project, detail: pxPerUnit > 0.6 });
}

/* Le niveau et l'année bougent hors caméra : la clé les porte, mais un
   changement de calque ou de nappe doit pouvoir forcer la main. */
export function invalidate() { lastKey = ''; }
