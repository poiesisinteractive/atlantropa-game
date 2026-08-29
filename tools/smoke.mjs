/* Test de fumée : charge le jeu dans Chromium, attend la fin du boot,
   simule quelques années, et vérifie que rien n'a explosé.
   Sert de filet de sécurité pendant le portage vers three.js.

   Usage : node tools/smoke.mjs [url] [--shot fichier.png] */
import { chromium } from 'playwright-core';

const url = process.argv[2]?.startsWith('http') ? process.argv[2] : 'http://localhost:5173/';
const shotIdx = process.argv.indexOf('--shot');
const shot = shotIdx > 0 ? process.argv[shotIdx + 1] : null;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1500, height: 900 } });

const errors = [];
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });

await page.goto(url, { waitUntil: 'load' });

// Le boot est différé par trois setTimeout et retire #boot en fin de course.
await page.waitForFunction(() => !document.getElementById('boot'), null, { timeout: 20000 });

const boot = await page.evaluate(() => ({
  level: document.getElementById('sLevel').textContent,
  year: document.getElementById('sYear').textContent,
  money: document.getElementById('sMoney').textContent,
  modal: !!document.querySelector('#ov[style*="flex"]'),
  logLines: document.querySelectorAll('#log div').length,
  panePresent: document.getElementById('pane-ops').innerHTML.length,
}));

// Fermer la modale d'ouverture, forcer Gibraltar et faire tourner 40 ans
// pour éprouver la simulation, le rendu des calques et les événements.
await page.evaluate(() => {
  window.hideModal();
  const g = window.__atl;
  g.S.built.gib = true; g.S.prog.gib = 1;
  g.S.money = 900;
  for (let i = 0; i < 40; i++) {
    g.S.levelW -= 0.9; g.S.levelE = g.S.levelW;
    g.stepYear();
    if (g.dec.cur) window.pickChoice(0);   // trancher : éprouve aussi les effets
  }
  window.hideModal();
  g.dirty.base = true;
  g.refresh();
});

const after = await page.evaluate(() => ({
  year: window.__atl.S.year,
  level: +window.__atl.S.levelW.toFixed(2),
  power: +window.__atl.S.power.toFixed(1),
  land: Math.round(window.__atl.S.land),
  sal: +window.__atl.S.salW.toFixed(2),
  biodiv: Math.round(window.__atl.S.biodiv),
  ended: window.__atl.S.ended,
}));

// Chaque calque doit se dessiner sans erreur.
for (const l of ['geo', 'eco', 'sel', 'terrain']) {
  await page.click(`#layers button[data-l="${l}"]`);
  await page.waitForTimeout(120);
}
for (const t of ['env', 'geo', 'doc', 'ops']) {
  await page.click(`#tabs button[data-tab="${t}"]`);
  await page.waitForTimeout(80);
}

if (shot) await page.screenshot({ path: shot });
await browser.close();

console.log('boot   ', boot);
console.log('après  ', after);
if (errors.length) {
  console.error('\nERREURS :');
  errors.forEach((e) => console.error('  ' + e));
  process.exit(1);
}
console.log('\nOK — aucune erreur console, tous les calques et onglets rendus.');
