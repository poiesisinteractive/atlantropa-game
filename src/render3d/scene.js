import { Scene, PerspectiveCamera, WebGLRenderer, Color, MathUtils } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { MW, MH } from '../core/geo.js';
import { S, opts } from '../core/state.js';
import { uploadTerrain, uploadExposure } from './textures.js';
import { makeTerrain } from './terrain.js';
import { makeWater } from './water.js';
import { vscale, vscaleUniform, yOf } from './scale.js';

/* La scène. Vue par défaut : zénithale et à champ étroit, donc très proche
   d'une projection orthographique — la carte reste une carte. L'inclinaison
   est un geste volontaire, pas un état de fait. */

const FOV = 22;
const LAYER_ID = { terrain: 0, geo: 1, eco: 2, sel: 3 };

let renderer, scene, camera, controls, terrain, waters = [], host, ready = false;

export function init(container) {
  host = container;
  const canvas = document.createElement('canvas');
  canvas.id = 'cv3';
  /* Juste après le canvas 2D, et surtout AVANT les surcouches : positionnés
     sans z-index, les frères se peignent dans l'ordre du DOM. Ajouté en
     dernier, le canvas recouvrirait les calques, la légende et les réglages —
     et intercepterait leurs clics, qui partiraient dans OrbitControls. */
  container.insertBefore(canvas, container.firstElementChild.nextSibling);

  renderer = new WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  scene = new Scene();
  scene.background = new Color('#05080b');

  camera = new PerspectiveCamera(FOV, 1, 1, 20000);
  controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.rotateSpeed = 0.55;
  controls.minPolarAngle = 0;
  controls.maxPolarAngle = MathUtils.degToRad(78);   // au-delà on ne lit plus rien
  controls.minDistance = 120;
  controls.maxDistance = 6000;
  controls.screenSpacePanning = false;

  uploadTerrain();
  terrain = makeTerrain();
  scene.add(terrain);
  for (const b of [1, 2, 3, 4]) { const w = makeWater(b); waters.push(w); scene.add(w); }

  resize();          // l'aspect doit être connu avant de cadrer
  resetView();
  ready = true;
}

/* Distance à laquelle la carte entière tient dans le cadre, comme le
   Math.min(W/MW, H/MH) de l'ancien rendu. */
function fitDistance() {
  const t = Math.tan(MathUtils.degToRad(FOV) / 2);
  return Math.max(MH / 2 / t, MW / 2 / (t * camera.aspect)) * 1.02;
}

export function resetView() {
  if (!camera) return;
  controls.target.set(0, 0, 0);
  camera.position.set(0, fitDistance(), 0.001);   // 0.001 : évite l'azimut dégénéré
  controls.update();
}

/* Inclinaison en degrés depuis la verticale, à distance constante. */
export function setTilt(deg) {
  const d = camera.position.distanceTo(controls.target);
  const phi = MathUtils.degToRad(MathUtils.clamp(deg, 0, 78));
  const theta = Math.atan2(camera.position.x - controls.target.x,
                           camera.position.z - controls.target.z);
  camera.position.set(
    controls.target.x + d * Math.sin(phi) * Math.sin(theta),
    controls.target.y + d * Math.cos(phi),
    controls.target.z + d * Math.sin(phi) * Math.cos(theta));
  controls.update();
}

export function getTilt() {
  if (!camera) return 0;
  const d = camera.position.clone().sub(controls.target);
  return MathUtils.radToDeg(Math.acos(MathUtils.clamp(d.y / d.length(), -1, 1)));
}

/* Relief et compression des abysses : les deux réglages de l'échelle
   verticale. Le terrain et les nappes se replacent au prochain rendu. */
export function setVScale(patch) {
  Object.assign(vscale, patch);
  if (terrain) terrain.material.uniforms.uVScale.value.fromArray(vscaleUniform());
}

export function resize() {
  if (!renderer) return;
  const r = host.getBoundingClientRect();
  const before = camera.aspect ? fitDistance() : 0;
  camera.aspect = Math.max(r.width, 2) / Math.max(r.height, 2);
  camera.updateProjectionMatrix();
  renderer.setSize(Math.max(2, r.width), Math.max(2, r.height), false);
  // Conserver le cadrage : la caméra recule ou avance du même rapport que la
  // distance d'ajustement, sinon un redimensionnement change le zoom.
  if (before > 0 && ready) {
    const k = fitDistance() / before;
    camera.position.sub(controls.target).multiplyScalar(k).add(controls.target);
    controls.update();
  }
}

let lastExpoYear = -1;

export function frame() {
  if (!ready) return;
  if (S.year !== lastExpoYear) { lastExpoYear = S.year; uploadExposure(); }

  const layer = LAYER_ID[opts.layer] ?? 0;
  const u = terrain.material.uniforms;
  u.uLevels.value.set(S.levelW, S.levelE, S.levelB);
  u.uSal.value.set(S.salW, S.salE);
  u.uLayer.value = layer;

  for (const w of waters) {
    const b = w.userData.basin;
    const lv = b === 1 ? 0 : b === 2 ? S.levelW : b === 3 ? S.levelE : S.levelB;
    w.position.y = yOf(lv);
    w.material.uniforms.uLevel.value = lv;
    w.material.uniforms.uSalinity.value = b === 3 ? S.salE : b === 2 ? S.salW : 38;
    w.material.uniforms.uLayer.value = layer;
    w.material.uniforms.uVScale = u.uVScale;
  }

  controls.update();
  renderer.render(scene, camera);
}

export function domElement() { return renderer?.domElement; }
