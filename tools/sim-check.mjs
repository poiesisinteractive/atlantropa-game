/* Une vie d'homme, huit fois, dans Node, sans navigateur.

   C'est ce que le découplage `core` / `ui` rend possible : plus rien dans le
   modèle ne touche au DOM, donc le modèle se charge et tourne ici. Huit
   parties entières — prologue compris, de 1926 à la mort d'Alexeï Morev —
   en quelques secondes et sans navigateur.

   Le prologue est joué, pas sauté : c'est lui qui pose le plan et les
   traits, donc le coût du chantier-cœur, les attitudes du sud et l'espérance
   de vie. Une porte qui commencerait en 1930 avec des valeurs par défaut ne
   testerait pas le jeu que l'on livre.

   Ce qu'on vérifie :

     • aucune grandeur ne devient NaN ni infinie, à aucune année. C'est
       exactement la classe de panne qui avait éteint la poussière saline
       pendant tout le portage : NaN traverse clamp(), échoue à toutes les
       comparaisons et s'affiche « 0 ». Rien ne le signale — sauf ceci ;
     • la partie se termine, et par une fin connue ;
     • les invariants tiennent : niveau borné, salinité croissante avec
       l'assèchement, biodiversité et opinions dans [0,100], trésor fini ;
     • le personnage tient : onze cartes de prologue, un plan complet, une
       mort dans la fenêtre 1975-2000.

   Le tirage est déterministe : `Math.random` est remplacé par un générateur
   à graine, donc un échec se rejoue à l'identique. Plusieurs graines par
   lancement, pour ne pas tester un seul chemin dans l'arbre des dossiers.

   Usage : node tools/sim-check.mjs [--seeds 8] [--years 80] */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? Number(process.argv[i + 1]) : d; };
const SEEDS = arg('--seeds', 8);
const YEARS = arg('--years', 80);

/* Générateur à graine, installé avant tout import du modèle : `content/`
   tire au sort dès le premier tour. */
let rngState = 1;
const seed = (n) => { rngState = n >>> 0 || 1; };
Math.random = () => {
  // xorshift32 — court, sans dépendance, largement assez pour du tirage de jeu
  rngState ^= rngState << 13; rngState >>>= 0;
  rngState ^= rngState >>> 17;
  rngState ^= rngState << 5; rngState >>>= 0;
  return rngState / 4294967296;
};

const { S, nat } = await import('../src/core/state.js');
const { buildGrid, setDem } = await import('../src/core/grid.js');
const { buildHypsometry } = await import('../src/core/hypsometry.js');
const { measure, measureExact, computeStrand, updateExposure, stepYear } = await import('../src/core/sim.js');
const { dec, choose } = await import('../src/content/engine.js');
const { playPrologue } = await import('../src/content/prologue.js');
const { deathYear } = await import('../src/core/character.js');
const { on } = await import('../src/core/bus.js');
const { setSpeed } = await import('../src/core/clock.js');

/* ------------------------------------------------------------- le terrain */
const t0 = Date.now();
const dem = fs.readFileSync(path.join(ROOT, 'src/data/dem.bin'));
setDem(new Int16Array(dem.buffer, dem.byteOffset, dem.byteLength / 2));
buildGrid();
buildHypsometry();
const tGrid = Date.now() - t0;

/* Le relief ne dépend pas de la partie : on ne le recuit pas entre les
   graines. Seul l'état de jeu est remis à zéro. */
const S0 = JSON.parse(JSON.stringify(S));
const NAT0 = JSON.parse(JSON.stringify(nat));

function reset(n) {
  seed(n);
  for (const k of Object.keys(S)) delete S[k];
  Object.assign(S, JSON.parse(JSON.stringify(S0)));
  for (const k of Object.keys(nat)) Object.assign(nat[k], NAT0[k]);
  const m0 = measure();
  S.vol0W = m0.vW; S.vol0E = m0.vE; S.area0 = m0.aW; S.areaE0 = m0.aE;
  computeStrand(true);
  updateExposure();
}

/* ------------------------------------------------------- le filet à NaN */
const SKIP = new Set(['log', 'ended', 'built', 'active', 'flags', 'fired', 'prog']);
function scanNumbers(obj, prefix, out) {
  for (const [k, v] of Object.entries(obj)) {
    if (SKIP.has(k)) continue;
    if (typeof v === 'number') { if (!Number.isFinite(v)) out.push(`${prefix}${k} = ${v}`); }
    else if (v && typeof v === 'object' && !Array.isArray(v)) scanNumbers(v, `${prefix}${k}.`, out);
  }
}
function badNumbers() {
  const out = [];
  scanNumbers(S, 'S.', out);
  for (const [k, n] of Object.entries(nat)) scanNumbers(n, `nat.${k}.`, out);
  return out;
}

/* --------------------------------------------------------------- la partie */
const { ENDINGS: TEXTES } = await import('../src/content/endings.js');
const ENDINGS = new Set(Object.keys(TEXTES));
const failures = [];
const rows = [];

for (let s = 1; s <= SEEDS; s++) {
  reset(s * 2654435761);

  let end = null;
  const unsub = on('endgame', (e) => { end = e; });   // une seule par partie

  // Le prologue d'abord : c'est lui qui pose le plan et le personnage.
  playPrologue();
  if (S.portrait.length !== 11) failures.push(`graine ${s} : ${S.portrait.length} phrases de portrait pour 11 cartes`);
  if (S.year !== 1930) failures.push(`graine ${s} : le prologue rend la main en ${S.year}`);
  for (const [k, v] of Object.entries(S.plan)) if (v === null || v === undefined) failures.push(`graine ${s} : plan.${k} non posé`);
  const mort = deathYear();
  if (mort < 1975 || mort > 2000) failures.push(`graine ${s} : espérance hors fenêtre (${mort})`);

  // Gibraltar est acquis : sans lui rien ne descend, et on veut éprouver
  // l'assèchement, pas la négociation.
  S.built.gib = true; S.prog.gib = 1; S.money = 60;
  setSpeed(1);

  let decisions = 0, prevLevel = 0, prevSal = 38, salBreaks = 0;
  const t1 = Date.now();

  for (let y = 0; y < YEARS && !S.ended; y++) {
    // La boucle d'animation fait descendre le niveau en continu ; ici on
    // applique le taux une fois par an, ce qui suffit au modèle.
    S.levelW = Math.max(-230, S.levelW - S.dropW);
    S.levelE = S.built.sic ? Math.max(-300, S.levelE - S.dropE) : S.levelW;
    if (!S.built.dard) S.levelB = Math.max(S.levelW, -42);

    stepYear();
    /* Le couple (niveau, salinité) se lit ici, avant de trancher : certains
       dossiers — la brèche dans le barrage — remontent le niveau de trois
       mètres après coup, et comparer une salinité calculée avant à un niveau
       relevé après ferait crier l'invariant pour rien. */
    const levelAtStep = S.levelW, salAtStep = S.salW;

    while (dec.cur) { choose(Math.floor(Math.random() * dec.cur.o.length)); decisions++; }

    const bad = badNumbers();
    if (bad.length) { failures.push(`graine ${s}, année ${S.year} : ${bad.join(', ')}`); break; }
    if (S.levelW > 0.001 || S.levelW < -230.001) failures.push(`graine ${s} : niveau hors bornes (${S.levelW})`);
    if (S.biodiv < -0.001 || S.biodiv > 100.001) failures.push(`graine ${s} : biodiversité ${S.biodiv}`);
    if (S.opinion < -0.001 || S.opinion > 100.001) failures.push(`graine ${s} : opinion ${S.opinion}`);
    // Le sel ne s'évapore pas : à volume qui diminue, la salinité monte.
    if (levelAtStep < prevLevel - 0.001 && salAtStep < prevSal - 0.001) salBreaks++;
    prevLevel = levelAtStep; prevSal = salAtStep;
  }
  if (salBreaks) failures.push(`graine ${s} : salinité en baisse pendant l'assèchement (${salBreaks} fois)`);

  unsub();
  const ms = Date.now() - t1;
  if (!S.ended) failures.push(`graine ${s} : la partie ne se termine pas en ${YEARS} ans`);
  else if (!ENDINGS.has(S.ended)) failures.push(`graine ${s} : fin inconnue « ${S.ended} »`);
  else if (!end) failures.push(`graine ${s} : fin « ${S.ended} » sans annonce sur le bus`);
  else if (end.rows.length !== 9) failures.push(`graine ${s} : verdict à ${end.rows.length} lignes`);

  rows.push({
    graine: s, fin: S.ended ?? '—', an: S.year, mort,
    coeur: S.plan.core, cible: S.plan.target,
    niveau: S.levelW.toFixed(0), GW: S.power.toFixed(0),
    'km²': Math.round(S.land), sel: S.salW.toFixed(1),
    poussière: S.dust.toFixed(0), biodiv: S.biodiv.toFixed(0),
    dossiers: decisions, ms,
  });
}

/* ------------------------------------------- les bilans sont-ils atteignables ?

   Une fin qu'aucune partie ne peut atteindre est du texte mort. Le cas s'est
   présenté : la spécification plaçait le point de non-retour à −55 m, alors
   que le meilleur cas physique d'une vie d'homme s'arrête à −43 m. Ce bloc
   rejoue ce meilleur cas — Gibraltar fermé en 1935, vannes closes, argent et
   soutien au plafond — et exige que le bilan le plus favorable tombe. */
reset(99);
S.year = 1935; S.built.gib = true; S.prog.gib = 1; S.turbine = 0;
for (const k of Object.keys(S.active)) S.active[k] = true;
for (let y = 0; y < 55 && !S.ended; y++) {
  S.money = 500; S.support = Math.min(100, S.support + 2); S.opinion = Math.min(100, S.opinion + 2);
  for (const k in nat) { nat[k].att = 90; nat[k].mem = true; }
  S.levelW = Math.max(-230, S.levelW - S.dropW);
  S.levelE = S.built.sic ? Math.max(-300, S.levelE - S.dropE) : S.levelW;
  stepYear();
  while (dec.cur) choose(0);
}
const meilleur = { an: S.year, niveau: +S.levelW.toFixed(1), fin: S.ended };
if (S.ended !== 'merbasse')
  failures.push(`meilleur cas : fin « ${S.ended} » au lieu de « merbasse » à ${meilleur.niveau} m — un bilan est devenu inatteignable`);

/* ----------------------------------------------- la table contre le balayage */
S.levelW = -120; S.levelE = -120;
const a = measureExact(), b = measure();
const ecart = Math.max(
  Math.abs(a.aW - b.aW) / Math.max(a.aW, 1e-9),
  Math.abs(a.vW - b.vW) / Math.max(a.vW, 1e-9),
  Math.abs(a.land - b.land) / Math.max(a.land, 1e-9));
if (ecart > 0.005) failures.push(`courbe hypsométrique : écart de ${(ecart * 100).toFixed(3)} % avec le balayage`);

/* ------------------------------------------------------------------ sortie */
console.log(`relief cuit en ${tGrid} ms · ${SEEDS} parties, prologue compris, ${YEARS} ans au plus\n`);
console.table(rows);
console.log(`\nmeilleur cas physique : ${meilleur.niveau} m en ${meilleur.an}, fin « ${meilleur.fin} »`);
console.log(`courbe hypsométrique à −120 m : écart ${(ecart * 100).toFixed(4)} % avec le balayage complet`);
console.log(`total : ${Date.now() - t0} ms, sans navigateur`);

if (failures.length) {
  console.error('\nÉCHECS :');
  failures.forEach((f) => console.error('  ' + f));
  process.exit(1);
}
console.log('\nOK — aucune grandeur non finie, toutes les parties se terminent, invariants et personnage tenus.');
