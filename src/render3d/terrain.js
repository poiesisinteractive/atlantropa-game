import { PlaneGeometry, ShaderMaterial, Mesh, Vector2, Vector3, Vector4, DoubleSide } from 'three';
import { MW, MH, GW_, GH_ } from '../core/geo.js';
import { YOF_GLSL, vscaleUniform } from './scale.js';
import { heightTex, maskTex, UV_FIX, TEXEL } from './textures.js';

/* Le terrain. Un plan déplacé par la texture de hauteur, colorié par un
   portage direct de l'ancien rebuildBase() — mêmes rampes, mêmes seuils,
   mêmes quatre calques — à ceci près que l'ombrage n'est plus précalculé :
   la normale se dérive de la texture de hauteur, donc elle tient compte de
   l'exagération verticale et de la position du soleil. */

const VERT = /* glsl */`
uniform sampler2D uHeight;
uniform vec4 uUvFix;
varying vec2 vSt;
varying float vH;
${YOF_GLSL}
void main(){
  // La ligne 0 de la texture est le nord ; l'UV du plan monte vers le nord.
  vSt = vec2(uv.x, 1.0 - uv.y) * uUvFix.xy + uUvFix.zw;
  vH = texture2D(uHeight, vSt).r;
  vec3 p = position;
  p.y = yOf(vH);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}`;

const FRAG = /* glsl */`
precision highp float;
uniform sampler2D uHeight;
uniform sampler2D uMask;
uniform vec2 uTexel;
uniform vec3 uLevels;     // ouest, est, mer Noire
uniform vec2 uSal;        // salinité ouest, est
uniform vec3 uSun;        // direction de la lumière, normalisée
uniform int  uLayer;      // 0 relief · 1 géologie · 2 économie · 3 sel
uniform float uCoast;     // intensité du liseré de côte
varying vec2 vSt;
varying float vH;
${YOF_GLSL}

float levelOf(float b){
  if (b < 1.5) return 0.0;          // Atlantique
  if (b < 2.5) return uLevels.x;    // bassin occidental
  if (b < 3.5) return uLevels.y;    // bassin oriental
  return uLevels.z;                 // Marmara + mer Noire
}
float basinAt(vec2 st){ return floor(texture2D(uMask, st).r * 255.0 + 0.5); }

// Immergé ? Sert au liseré de côte. 0 = terre ou fond découvert.
float wetAt(vec2 st){
  float b = basinAt(st);
  if (b < 0.5) return 0.0;
  return (levelOf(b) - texture2D(uHeight, st).r) > 0.0 ? 1.0 : 0.0;
}

// Bandes bathymétriques du calque géologique. Chaîne de tests plutôt que
// tableau indexé : GLSL ES 1.00 n'indexe pas dynamiquement les const.
vec3 isoColor(float d){
  if (d <  50.0) return vec3(176.,214.,226.)/255.;
  if (d < 200.0) return vec3(132.,190.,213.)/255.;
  if (d < 500.0) return vec3( 96.,163.,198.)/255.;
  if (d <1000.0) return vec3( 68.,133.,180.)/255.;
  if (d <2000.0) return vec3( 44.,102.,155.)/255.;
  if (d <3000.0) return vec3( 27., 72.,124.)/255.;
  return vec3(14.,45.,92.)/255.;
}

void main(){
  vec4 m = texture2D(uMask, vSt);
  float b  = floor(m.r * 255.0 + 0.5);
  float nz = abs(m.g * 2.0 - 1.0);
  float age = m.b;                      // 0 -> 1 sur vingt-deux ans

  // Normale dérivée de la texture de hauteur. Une cellule vaut une unité de
  // carte, ce qui rend le pas de dérivation trivial.
  float hL = texture2D(uHeight, vSt - vec2(uTexel.x, 0.0)).r;
  float hR = texture2D(uHeight, vSt + vec2(uTexel.x, 0.0)).r;
  float hD = texture2D(uHeight, vSt - vec2(0.0, uTexel.y)).r;
  float hU = texture2D(uHeight, vSt + vec2(0.0, uTexel.y)).r;
  vec3 n = normalize(vec3(-(yOf(hR) - yOf(hL)) * 0.5, 1.0, -(yOf(hU) - yOf(hD)) * 0.5));

  // Même plage que l'ancien ombrage : 0,45 à l'ubac, 1,26 à l'adret.
  float sh = 0.45 + 0.58 * clamp(dot(n, uSun), 0.0, 1.0) / 0.7071;

  vec3 c;
  if (b < 0.5) {
    /* ---- terre ---- */
    if      (uLayer == 1) c = vec3(58., 62., 58.) / 255.;
    else if (uLayer == 2) c = vec3(52., 56., 54.) / 255.;
    else {
      float t = clamp(vH / 2600.0, 0.0, 1.0);
      if      (t < 0.18) c = mix(vec3( 96.,118., 78.), vec3(124.,133., 84.),  t / 0.18) / 255.;
      else if (t < 0.50) c = mix(vec3(124.,133., 84.), vec3(158.,140., 96.), (t - 0.18) / 0.32) / 255.;
      else if (t < 0.80) c = mix(vec3(158.,140., 96.), vec3(150.,118., 96.), (t - 0.50) / 0.30) / 255.;
      else               c = mix(vec3(150.,118., 96.), vec3(226.,224.,222.), (t - 0.80) / 0.20) / 255.;
    }
    c *= (uLayer == 0) ? sh : mix(1.0, sh, 0.55);
    c *= 0.97 + 0.06 * nz;
  } else {
    float lv  = levelOf(b);
    float col = lv - vH;                       // hauteur de la colonne d'eau
    if (col > 0.0) {
      /* ---- fond encore immergé : le shader de l'eau passera par-dessus ---- */
      if      (uLayer == 1) c = isoColor(col);
      else if (uLayer == 3) {
        float sal = (b > 2.5 && b < 3.5) ? uSal.y : (b > 1.5 && b < 2.5) ? uSal.x : 38.0;
        float t = clamp((sal - 38.0) / 7.0, 0.0, 1.0);
        c = mix(vec3(66.,150.,190.), vec3(206.,176.,96.), t) / 255.;
        c *= 1.0 - 0.45 * clamp(col / 2600.0, 0.0, 1.0);
      } else {
        float t = pow(clamp(col / 2600.0, 0.0, 1.0), 0.62);
        c = mix(vec3(112.,198.,224.), vec3(10., 36., 76.), t) / 255.;
        if (col < 40.0) c = mix(c, vec3(198.,228.,214.) / 255., vec3(0.4, 0.4, 0.32));
      }
      c *= mix(1.0, sh, uLayer == 1 ? 0.12 : 0.30);
    } else {
      /* ---- fond découvert : vase, puis croûte d'halite et de gypse ---- */
      float evap = clamp(-vH / 700.0, 0.0, 1.0);
      float sf = clamp(age * (0.45 + 0.55 * evap), 0.0, 1.0);
      if      (uLayer == 3) c = mix(vec3(120.,104., 80.), vec3(250.,246.,236.), sf) / 255.;
      else if (uLayer == 1) c = mix(vec3(150.,132.,104.), vec3(214.,206.,186.), sf) / 255.;
      else                  c = mix(vec3(126.,107., 76.), vec3(224.,220.,206.), sf) / 255.;
      if (col > -8.0) c = mix(c, vec3(92., 84., 66.) / 255., 0.45);   // laisse de mer
      c *= sh;
      c *= 0.95 + 0.10 * nz;
    }
  }

  // Liseré de côte : la cellule change d'état par rapport à ses voisines est
  // et sud. Reprend le second balayage de l'ancien rendu.
  float w = wetAt(vSt);
  if (w != wetAt(vSt + vec2(uTexel.x, 0.0)) || w != wetAt(vSt + vec2(0.0, uTexel.y)))
    c *= mix(1.0, 0.57, uCoast);

  gl_FragColor = vec4(c, 1.0);
}`;

export function makeTerrain() {
  const geo = new PlaneGeometry(MW, MH, GW_ - 1, GH_ - 1);
  geo.rotateX(-Math.PI / 2);
  geo.deleteAttribute('normal');   // dérivée dans le fragment shader

  const mat = new ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    side: DoubleSide,
    uniforms: {
      uHeight: { value: heightTex },
      uMask: { value: maskTex },
      uUvFix: { value: new Vector4(...UV_FIX) },
      uTexel: { value: new Vector2(...TEXEL) },
      uVScale: { value: new Vector4(...vscaleUniform()) },
      uLevels: { value: new Vector3(0, 0, 0) },
      uSal: { value: new Vector2(38, 38) },
      uSun: { value: new Vector3(-0.5, 0.7071, -0.5).normalize() },
      uLayer: { value: 0 },
      uCoast: { value: 1 },
    },
  });

  const mesh = new Mesh(geo, mat);
  mesh.frustumCulled = false;
  mesh.renderOrder = 0;
  return mesh;
}
