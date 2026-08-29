import { PlaneGeometry, ShaderMaterial, Mesh, Vector3, Vector4 } from 'three';
import { MW, MH } from '../core/geo.js';
import { heightTex, maskTex, UV_FIX } from './textures.js';

/* La mer.

   Un plan rigoureusement plat par bassin, plutôt qu'une seule nappe déformée :
   après la digue Sicile–Tunisie, l'ouest et l'est ne sont plus au même niveau,
   et la marche doit être franche. Chaque plan écarte les fragments qui ne sont
   pas de son bassin, puis ceux où le fond dépasse déjà la surface — ce qui
   donne un trait de côte à la précision du texel, quelle que soit la finesse
   du maillage. Le tampon de profondeur se charge du reste : vue de biais, la
   nappe coupe le talus exactement où il faut.

   La teinte reprend la rampe de l'ancien rendu, calque par calque. Ce que la
   3D ajoute, c'est la surface elle-même : un reflet spéculaire, et un
   assombrissement de Fresnel aux angles rasants. */

const VERT = /* glsl */`
uniform vec4 uUvFix;
varying vec2 vSt;
varying vec3 vWorld;
void main(){
  vSt = vec2(uv.x, 1.0 - uv.y) * uUvFix.xy + uUvFix.zw;
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}`;

const FRAG = /* glsl */`
precision highp float;
uniform sampler2D uHeight;
uniform sampler2D uMask;
uniform float uBasin;     // bassin que cette nappe recouvre
uniform float uLevel;     // son niveau, en mètres
uniform float uSalinity;
uniform vec3  uSun;
uniform int   uLayer;
varying vec2 vSt;
varying vec3 vWorld;

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
  if (abs(floor(texture2D(uMask, vSt).r * 255.0 + 0.5) - uBasin) > 0.5) discard;
  float col = uLevel - texture2D(uHeight, vSt).r;
  if (col <= 0.0) discard;

  vec3 c;
  float a;
  if (uLayer == 1) {
    // Le calque géologique lit la colonne d'eau : la nappe y reste opaque.
    c = isoColor(col); a = 0.94;
  } else {
    float t = pow(clamp(col / 2600.0, 0.0, 1.0), 0.62);
    c = mix(vec3(112.,198.,224.), vec3(10., 36., 76.), t) / 255.;
    if (uLayer == 3) {
      float s = clamp((uSalinity - 38.0) / 7.0, 0.0, 1.0);
      c = mix(c, mix(vec3(66.,150.,190.), vec3(206.,176.,96.), s) / 255., 0.75);
    }
    /* Extinction : la lumière qui traverse la colonne d'eau et remonte n'en
       laisse presque rien passer au-delà de quelques dizaines de mètres. Un
       plateau à 20 m laisse voir son sédiment, une plaine abyssale non. */
    a = 1.0 - exp(-col / 22.0);
    a = clamp(a, 0.10, 0.985);
  }
  c *= 0.88;   // la nappe est plane : elle ne prend jamais la lumière d'adret

  vec3 V = normalize(cameraPosition - vWorld);
  vec3 H = normalize(uSun + V);
  float spec = pow(max(dot(vec3(0., 1., 0.), H), 0.0), 90.0);
  c += vec3(0.30, 0.34, 0.36) * spec;
  float fres = pow(1.0 - max(V.y, 0.0), 4.0);
  c = mix(c, c * 0.72 + vec3(0.05, 0.07, 0.09), fres);
  a = max(a + spec * 0.6, fres * 0.85);   // de biais, la surface se voit

  gl_FragColor = vec4(c, clamp(a, 0.0, 1.0));
}`;

/* Une nappe par bassin : 1 Atlantique · 2 occidental · 3 oriental · 4 mer Noire. */
export function makeWater(basinIndex) {
  const geo = new PlaneGeometry(MW, MH, 1, 1);
  geo.rotateX(-Math.PI / 2);
  const mat = new ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    uniforms: {
      uHeight: { value: heightTex },
      uMask: { value: maskTex },
      uUvFix: { value: new Vector4(...UV_FIX) },
      uBasin: { value: basinIndex },
      uLevel: { value: 0 },
      uSalinity: { value: 38 },
      uSun: { value: new Vector3(-0.5, 0.7071, -0.5).normalize() },
      uLayer: { value: 0 },
    },
    transparent: true,
    depthWrite: false,   // le fond est déjà peint : la nappe s'y superpose
  });
  const mesh = new Mesh(geo, mat);
  mesh.frustumCulled = false;
  mesh.renderOrder = 1;
  mesh.userData.basin = basinIndex;
  return mesh;
}
