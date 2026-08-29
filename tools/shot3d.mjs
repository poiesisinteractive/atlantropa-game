/* Captures du rendu relief, à un niveau et une inclinaison donnés.
   Usage : node tools/shot3d.mjs <url> <dossier> [niveau] [inclinaison...] */
import { chromium } from 'playwright-core';
import path from 'node:path';

const url = process.argv[2] || 'http://localhost:4188/';
const dir = process.argv[3] || '.';
const level = Number(process.argv[4] ?? -120);
const tilts = process.argv.slice(5).map(Number);
const angles = tilts.length ? tilts : [0, 55];

// Chromium doit rendre du WebGL réel : sans ces drapeaux il tombe sur SwiftShader
// ou refuse le contexte, et la capture revient noire.
const browser = await chromium.launch({
  args: ['--use-gl=angle', '--use-angle=default', '--enable-unsafe-swiftshader',
         '--ignore-gpu-blocklist', '--enable-gpu-rasterization'],
});
const page = await browser.newPage({ viewport: { width: 1500, height: 900 } });
const errors = [];
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });

await page.goto(url, { waitUntil: 'load' });
await page.waitForFunction(() => !document.getElementById('boot'), null, { timeout: 25000 });

await page.evaluate((lv) => {
  window.hideModal();
  const g = window.__atl;
  g.S.built.gib = true; g.S.prog.gib = 1; g.S.money = 900; g.S.turbine = 0.35;
  g.S.levelW = lv; g.S.levelE = lv; g.S.levelB = Math.max(lv, -42);
  g.S.salW = 38 * 1 / (1 - Math.min(0.3, -lv / 1500)); g.S.salE = g.S.salW;
  g.S.year = 2050;
  for (let i = 0; i < 3; i++) g.stepYear();
  if (g.dec.cur) window.pickChoice(0);
  window.hideModal();
  g.S.levelW = lv; g.S.levelE = lv;
  g.set3d(true);
}, level);
await page.waitForTimeout(900);

const info = await page.evaluate(() => {
  const c = document.getElementById('cv3');
  const gl = c.getContext('webgl2') || c.getContext('webgl');
  return { canvas: [c.width, c.height], renderer: gl && gl.getParameter(gl.VERSION) };
});

for (const a of angles) {
  await page.evaluate((deg) => {
    window.__atl.R3.setTilt(deg);
    document.getElementById('ctlTilt').value = deg;
  }, a);
  await page.waitForTimeout(450);
  const f = path.join(dir, `relief-${Math.round(-level)}m-${a}deg.png`);
  await page.screenshot({ path: f });
  console.log('->', f);
}

await browser.close();
console.log(info);
if (errors.length) { console.error('\nERREURS :'); errors.forEach((e) => console.error('  ' + e)); process.exit(1); }
console.log('OK');
