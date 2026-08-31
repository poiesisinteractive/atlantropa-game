/* Audit de l'arbre de dépendances — vulnérabilités, licences, dépréciations.

   La politique vit ici, en données lisibles, et non éparpillée dans le YAML du
   workflow : une porte de qualité doit être rejouable à l'identique sur un
   poste, sans lire un fichier GitHub Actions. Le code de sortie est la porte.

   Ce qu'on regarde :

     • vulnérabilités  — `npm audit`, seuil de sévérité ;
     • licences        — celles à obligations réseau (AGPL, SSPL, BUSL) sont
                         refusées : ce jeu est destiné à être servi sur le web,
                         et ces licences y déclenchent une obligation de
                         publication de la source ;
     • dépréciations   — npm ne les imprime que pendant l'installation et nulle
                         part ailleurs. Le CI tee-e son log ; passer son chemin
                         avec --log <fichier> pour les relever.

   Sortie : dependency-report.json, plus un tableau lisible.

   Usage : node tools/deps-check.mjs [--log npm-ci.log] [--strict] */

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const LOG = arg('--log', null);
const STRICT = process.argv.includes('--strict');

/* ------------------------------------------------------------- la politique */
const POLITIQUE = {
  // Bloque à partir de cette sévérité incluse.
  severiteBloquante: ['high', 'critical'],
  // Licences refusées : obligations réseau incompatibles avec un jeu servi en
  // ligne dont on ne veut pas publier tout l'arbre.
  licencesRefusees: [/^AGPL/i, /^SSPL/i, /^BUSL/i, /^CC-BY-NC/i],
  // Signalées sans bloquer : à regarder, pas à corriger toutes affaires cessantes.
  licencesASignaler: [/^GPL-[23]/i, /^CDDL/i, /^EPL/i, /^UNKNOWN$/i],
  // Une dépréciation ne bloque qu'en --strict : elle annonce une fin de
  // support, pas une panne. Le cron hebdomadaire est là pour qu'elle ne
  // s'oublie pas.
  depreciationBloquante: false,
};
const ORDRE = ['info', 'low', 'moderate', 'high', 'critical'];

/* --------------------------------------------------------------- collecte */
function npm(args) {
  try {
    return execFileSync('npm', args, { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  } catch (e) {
    // `npm audit` sort en code non nul dès qu'il trouve quelque chose : c'est
    // un résultat, pas une panne. On lit quand même sa sortie.
    if (e.stdout) return e.stdout;
    throw e;
  }
}

const audit = JSON.parse(npm(['audit', '--json']));
const arbre = JSON.parse(npm(['ls', '--all', '--json', '--long']));

/* Vulnérabilités — `npm audit --json` v2 range tout sous `vulnerabilities`. */
const vulns = Object.values(audit.vulnerabilities || {})
  .filter((v) => ORDRE.indexOf(v.severity) >= ORDRE.indexOf(POLITIQUE.severiteBloquante[0]) || true)
  .map((v) => ({ nom: v.name, severite: v.severity, via: (v.via || []).map((x) => x.title || x).slice(0, 2) }));

const vulnsBloquantes = vulns.filter((v) => POLITIQUE.severiteBloquante.includes(v.severite));

/* Licences — parcours de l'arbre complet, dédoublonné par nom@version. */
const licences = new Map();
(function parcourir(n) {
  for (const [nom, d] of Object.entries(n.dependencies || {})) {
    if (d.version) licences.set(`${nom}@${d.version}`, d.license || 'UNKNOWN');
    parcourir(d);
  }
})(arbre);

const classe = (l) => {
  const t = typeof l === 'string' ? l : JSON.stringify(l);
  if (POLITIQUE.licencesRefusees.some((r) => r.test(t))) return 'refusee';
  if (POLITIQUE.licencesASignaler.some((r) => r.test(t))) return 'a-signaler';
  return 'ok';
};
const parLicence = [...licences].map(([p, l]) => ({ paquet: p, licence: l, verdict: classe(l) }));
const licencesRefusees = parLicence.filter((x) => x.verdict === 'refusee');
const licencesASignaler = parLicence.filter((x) => x.verdict === 'a-signaler');

/* Dépréciations — uniquement lisibles dans le log d'installation. */
let depreciations = [];
if (LOG && fs.existsSync(LOG)) {
  depreciations = [...new Set(fs.readFileSync(LOG, 'utf8').split('\n')
    .filter((l) => l.includes('npm warn deprecated'))
    .map((l) => l.replace(/^.*npm warn deprecated\s*/, '').trim()))];
}

/* ---------------------------------------------------------------- rapport */
const rapport = {
  date: new Date().toISOString(),
  politique: {
    severiteBloquante: POLITIQUE.severiteBloquante,
    licencesRefusees: POLITIQUE.licencesRefusees.map(String),
    depreciationBloquante: POLITIQUE.depreciationBloquante || STRICT,
  },
  paquets: licences.size,
  vulnerabilites: vulns,
  licences: { refusees: licencesRefusees, aSignaler: licencesASignaler },
  depreciations,
};
fs.writeFileSync(path.join(ROOT, 'dependency-report.json'), JSON.stringify(rapport, null, 2));

console.log(`${licences.size} paquets dans l'arbre\n`);

console.log(`vulnérabilités : ${vulns.length}`);
for (const v of vulns) console.log(`  ${v.severite.padEnd(9)} ${v.nom} — ${v.via.join(' · ')}`);

console.log(`\nlicences refusées : ${licencesRefusees.length}`);
for (const l of licencesRefusees) console.log(`  ${l.licence.padEnd(14)} ${l.paquet}`);
console.log(`licences à signaler : ${licencesASignaler.length}`);
for (const l of licencesASignaler) console.log(`  ${String(l.licence).padEnd(14)} ${l.paquet}`);

console.log(`\ndépréciations : ${depreciations.length}${LOG ? '' : "  (passer --log npm-ci.log pour les relever)"}`);
for (const d of depreciations) console.log(`  ${d}`);

/* ------------------------------------------------------------------- porte */
const echecs = [];
if (vulnsBloquantes.length) echecs.push(`${vulnsBloquantes.length} vulnérabilité(s) de sévérité ${POLITIQUE.severiteBloquante.join('/')}`);
if (licencesRefusees.length) echecs.push(`${licencesRefusees.length} licence(s) à obligations réseau`);
if ((POLITIQUE.depreciationBloquante || STRICT) && depreciations.length) echecs.push(`${depreciations.length} paquet(s) déprécié(s)`);

if (echecs.length) {
  console.error('\nÉCHECS :');
  echecs.forEach((e) => console.error('  ' + e));
  process.exit(1);
}
console.log('\nOK — rien de bloquant. Rapport dans dependency-report.json');
