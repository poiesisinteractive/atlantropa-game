import { clamp, fmt } from '../core/utils.js';
import { S, opts } from '../core/state.js';
import { BORDERS, COUNTRIES } from '../data/borders.js';
import { CITIES, GEO_NOTES, VOLCANOES, FAULTS, EVAPORITES, RESOURCES, SEAROUTE }
  from '../data/places.js';
import { DAMS } from '../data/projects.js';

/* Les surcouches : tout ce qui se trace par-dessus la carte plutôt que dans
   ses pixels — frontières de 1930, toponymes, villes et leur distance à la
   mer, barrages, volcans, failles, isobathes annotées, route maritime,
   panaches de sel.

   Elles ne connaissent que deux choses : un contexte 2D, et une fonction qui
   change une longitude et une latitude en pixels. Le rendu plan lui donne sa
   projection plate-carrée ; le rendu en relief lui donne sa caméra, qui pose
   chaque point sur la surface visible du terrain. Le même code dessine donc
   les deux, et une correction faite ici vaut pour les deux.

   Le contexte attendu :

     ctx      contexte 2D
     k        devicePixelRatio — épaisseurs de trait et corps de texte
     W, H     dimensions du canevas en pixels physiques, pour écarter ce qui
              sort du cadre
     proj     (lon, lat) -> [x, y] en pixels, ou null si le point n'est pas
              devant la caméra
     detail   faut-il écrire les petites étiquettes de villes ? */

function poly(g, pts, close) {
  const c = g.ctx;
  let started = false;
  c.beginPath();
  for (const p of pts) {
    const q = g.proj(p[0], p[1]);
    // Un point derrière la caméra coupe la ligne au lieu de la replier à
    // travers tout l'écran : on repart d'un moveTo au point suivant visible.
    if (!q) { started = false; continue; }
    if (started) c.lineTo(q[0], q[1]); else { c.moveTo(q[0], q[1]); started = true; }
  }
  if (close && started) c.closePath();
}

function label(g, txt, lo, la, size, col, align, dy) {
  const q = g.proj(lo, la);
  if (!q) return;
  const c = g.ctx;
  c.textAlign = align || 'center';
  c.font = `${size * g.k}px Inter,-apple-system,sans-serif`;
  c.lineWidth = 3.2 * g.k; c.strokeStyle = 'rgba(6,9,12,.9)';
  c.strokeText(txt, q[0], q[1] + (dy || 0) * g.k);
  c.fillStyle = col; c.fillText(txt, q[0], q[1] + (dy || 0) * g.k);
}

function dot(g, lo, la, r, fill) {
  const q = g.proj(lo, la);
  if (!q) return;
  const c = g.ctx;
  c.beginPath(); c.arc(q[0], q[1], r, 0, 7);
  c.fillStyle = fill; c.fill();
  c.strokeStyle = 'rgba(6,9,12,.9)'; c.lineWidth = 1.2 * g.k; c.stroke();
}

export function drawOverlays(g) {
  const { ctx, k } = g;
  ctx.lineJoin = 'round'; ctx.lineCap = 'round';

  /* --- frontières --- */
  if (opts.showBorders) {
    ctx.setLineDash([5 * k, 3.5 * k]); ctx.lineWidth = 1.25 * k;
    ctx.strokeStyle = opts.layer === 'eco' ? 'rgba(240,232,210,.55)' : 'rgba(232,227,214,.38)';
    for (const b of BORDERS) { poly(g, b); ctx.stroke(); }
    ctx.setLineDash([]);
  }
  if (opts.showLabels) {
    for (const c of COUNTRIES) label(g, c[2], c[0], c[1], c[2].length > 9 ? 9.5 : 10.5, 'rgba(228,222,206,.72)');
  }

  /* --- calque géologique --- */
  if (opts.layer === 'geo') {
    ctx.setLineDash([]);
    for (const f of FAULTS) {
      ctx.strokeStyle = 'rgba(224,110,90,.85)'; ctx.lineWidth = 2 * k; poly(g, f.p); ctx.stroke();
      const mid = f.p[Math.floor(f.p.length / 2)];
      label(g, f.n, mid[0], mid[1], 9.5, '#e0806e', 'center', -7);
    }
    for (const e of EVAPORITES) label(g, e[2], e[0], e[1], 10, 'rgba(238,222,168,.9)');
    for (const n of GEO_NOTES) {
      label(g, n[2], n[0], n[1], 10.5, 'rgba(226,236,244,.92)', 'center', -5);
      label(g, n[3], n[0], n[1], 9.5, 'rgba(160,196,220,.9)', 'center', 7);
    }
    for (const v of VOLCANOES) {
      const q = g.proj(v[0], v[1]);
      if (q) {
        ctx.beginPath();
        ctx.moveTo(q[0], q[1] - 5 * k); ctx.lineTo(q[0] + 4.5 * k, q[1] + 3.5 * k); ctx.lineTo(q[0] - 4.5 * k, q[1] + 3.5 * k);
        ctx.closePath();
        ctx.fillStyle = '#d8543c'; ctx.fill();
        ctx.strokeStyle = 'rgba(6,9,12,.9)'; ctx.lineWidth = 1.2 * k; ctx.stroke();
      }
      label(g, v[2], v[0], v[1], 9, '#f0b3a2', 'center', 15);
    }
    if (S.levelW < -70) label(g, `Rebond isostatique — ${S.quakes} séisme(s) majeur(s)`, 10, 41.5, 11, '#e0806e');
  }

  /* --- calque économique --- */
  if (opts.layer === 'eco') {
    const cut = S.levelW < -60;
    ctx.setLineDash([9 * k, 6 * k]); ctx.lineWidth = 2.2 * k;
    ctx.strokeStyle = cut ? 'rgba(200,70,55,.85)' : 'rgba(120,200,235,.75)';
    poly(g, SEAROUTE); ctx.stroke(); ctx.setLineDash([]);
    label(g, cut ? "Route Europe–Asie : COUPÉE" : "Route Europe–Asie (Gibraltar–Suez)", 17.5, 33.6, 10.5, cut ? '#e08b82' : '#8fd0ea');
    if (S.built.grd || S.built.gib) {
      ctx.strokeStyle = 'rgba(230,198,90,.5)'; ctx.lineWidth = 1.4 * k; ctx.setLineDash([3 * k, 3 * k]);
      for (const c of CITIES.filter((c) => c.w >= 3)) { poly(g, [[-5.6, 36.0], [c.lo, c.la]]); ctx.stroke(); }
      ctx.setLineDash([]);
    }
    for (const r of RESOURCES) {
      if (r[2] === "Pétrole" && S.year < 1959) continue;
      dot(g, r[0], r[1], 3.2 * k, '#c9a227');
      label(g, r[2], r[0], r[1], 9.5, '#e0c98a', 'center', -7);
    }
    if (S.land > 2000) {
      label(g, `Terres gagnées : ${fmt(S.land, 0)} km²`, 17.5, 37.2, 12, '#e6c65a');
      label(g, `dont ${fmt(S.saltArea, 0)} km² de croûte de sel`, 17.5, 36.4, 10, '#c8bfa0');
    }
    label(g, `${S.deadPorts} port(s) échoué(s) · ${fmt(S.power, 0)} GW · ${fmt(S.money, 1)} Md`, 4.5, 31.6, 11, '#cfd6dd');
  }

  /* --- calque sel --- */
  if (opts.layer === 'sel') {
    label(g, `Bassin occidental — ${fmt(S.salW, 1)} g/L`, 4.5, 39.4, 12, '#f0e0c0');
    label(g, `Bassin oriental — ${fmt(S.salE, 1)} g/L`, 25.0, 34.2, 12, '#f0e0c0');
    label(g, `Croûte d'halite et de gypse : ${fmt(S.saltArea, 0)} km²`, 17.5, 31.0, 11, '#e0d8c0');
    if (S.dust > 12) {
      ctx.strokeStyle = `rgba(224,208,168,${clamp(S.dust / 60, .25, .85)})`; ctx.lineWidth = 2.4 * k;
      const plumes = [[[13.0, 44.0], [11.0, 46.2]], [[11.0, 34.5], [13.5, 32.0]], [[19.0, 36.0], [21.5, 38.6]],
                      [[30.0, 33.5], [33.0, 35.6]], [[4.0, 40.0], [3.0, 42.6]]];
      for (const p of plumes) {
        poly(g, p); ctx.stroke();
        const q = g.proj(p[1][0], p[1][1]);
        if (q) { ctx.beginPath(); ctx.arc(q[0], q[1], 3 * k, 0, 7); ctx.fillStyle = 'rgba(230,216,180,.8)'; ctx.fill(); }
      }
      label(g, `Tempêtes de sel — indice ${fmt(S.dust, 0)}`, 8.0, 45.6, 11, '#e6d8b0');
    }
  }

  /* --- barrages --- */
  for (const id in DAMS) {
    const built = S.built[id], active = S.active[id];
    if (!built && !active && id !== 'gib') continue;
    ctx.strokeStyle = built ? '#e6c65a' : (active ? 'rgba(230,198,90,.55)' : 'rgba(255,255,255,.18)');
    ctx.lineWidth = (built ? 4.5 : 2.5) * k;
    for (const s of DAMS[id]) { poly(g, s); ctx.stroke(); }
  }
  if (S.built.gib) label(g, "BARRAGE DE GIBRALTAR", -5.6, 35.3, 11, '#e6c65a');
  if (S.built.sic) label(g, "DIGUE SICILE–TUNISIE", 11.8, 36.4, 10.5, '#e6c65a');
  if (S.built.dard) label(g, "BARRAGE DES DARDANELLES", 26.3, 40.9, 10, '#e6c65a');

  /* --- villes --- */
  const lim = S.built.prt ? 42 : 16;
  for (const c of CITIES) {
    const q = g.proj(c.lo, c.la);
    if (!q) continue;
    if (q[0] < -80 || q[0] > g.W + 80 || q[1] < -40 || q[1] > g.H + 40) continue;
    const s = S.strand[c.n] || 0, dead = s > lim;
    const rad = (opts.layer === 'eco' ? (1.8 + c.w * 1.3) : (c.w >= 3 ? 3.1 : 2.5)) * k;
    ctx.beginPath(); ctx.arc(q[0], q[1], rad, 0, 7);
    ctx.fillStyle = dead ? '#d0553f' : (s > 3 ? '#e0b060' : '#f0e9d6'); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,.75)'; ctx.lineWidth = 1.3 * k; ctx.stroke();
    if (opts.showLabels && (g.detail || c.w >= 3)) {
      const t = s > 1 ? `${c.n} · ${fmt(s, 0)} km` : c.n;
      ctx.textAlign = 'left'; ctx.font = `500 ${11 * k}px Inter,-apple-system,sans-serif`;
      ctx.lineWidth = 3.2 * k; ctx.strokeStyle = 'rgba(5,8,11,.9)';
      ctx.strokeText(t, q[0] + rad + 3 * k, q[1] + 3.6 * k);
      ctx.fillStyle = dead ? '#e39182' : '#e8e3d6'; ctx.fillText(t, q[0] + rad + 3 * k, q[1] + 3.6 * k);
    }
  }
}
