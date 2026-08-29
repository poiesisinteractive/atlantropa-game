/* Compare la courbe hypsométrique O(1) au balayage complet des 772 200
   cellules, à tous les niveaux que la partie peut atteindre, et mesure le
   gain de temps. Doit être relancé si la bathymétrie change.

   Usage : node tools/hypso-check.mjs [url] */
import { chromium } from 'playwright-core';

const url = process.argv[2] || 'http://localhost:4188/';
const browser = await chromium.launch();
const page = await browser.newPage();
page.on('pageerror', (e) => { console.error(e); process.exit(1); });
await page.goto(url, { waitUntil: 'load' });
await page.waitForFunction(() => !document.getElementById('boot'), null, { timeout: 20000 });

const res = await page.evaluate(() => {
  const g = window.__atl, out = [];
  const levels = [0, -1, -5, -25, -45, -80, -120, -155, -200, -230];
  for (const lv of levels) {
    g.S.levelW = lv; g.S.levelE = lv;
    const a = g.measureExact(), b = g.measure();
    out.push({
      lv,
      dAireW: rel(a.aW, b.aW), dVolW: rel(a.vW, b.vW),
      dAireE: rel(a.aE, b.aE), dVolE: rel(a.vE, b.vE),
      dTerres: rel(a.land, b.land),
      km2Exact: Math.round(a.land), km2Table: Math.round(b.land),
    });
  }
  function rel(x, y) { return x === 0 && y === 0 ? 0 : Math.abs(x - y) / Math.max(Math.abs(x), 1e-9); }

  // Chronométrage
  g.S.levelW = -100; g.S.levelE = -100;
  let t = performance.now(); for (let i = 0; i < 20; i++) g.measureExact();
  const tExact = (performance.now() - t) / 20;
  t = performance.now(); for (let i = 0; i < 20000; i++) g.measure();
  const tTable = (performance.now() - t) / 20000;
  return { out, tExact, tTable };
});

await browser.close();

console.log('niveau   écart aire O  écart vol O   écart aire E  écart terres   km² (exact / table)');
let worst = 0;
for (const r of res.out) {
  worst = Math.max(worst, r.dAireW, r.dVolW, r.dAireE, r.dVolE, r.dTerres);
  console.log(
    String(r.lv + ' m').padStart(7),
    (r.dAireW * 100).toFixed(4).padStart(11) + ' %',
    (r.dVolW * 100).toFixed(4).padStart(11) + ' %',
    (r.dAireE * 100).toFixed(4).padStart(11) + ' %',
    (r.dTerres * 100).toFixed(4).padStart(11) + ' %',
    String(r.km2Exact).padStart(10), '/', String(r.km2Table).padStart(7));
}
console.log(`\nbalayage complet : ${res.tExact.toFixed(2)} ms`);
console.log(`lecture de table : ${res.tTable.toFixed(5)} ms  (×${Math.round(res.tExact / res.tTable)} plus rapide)`);
console.log(`écart maximal    : ${(worst * 100).toFixed(4)} %`);

if (worst > 0.005) { console.error('\nÉCART TROP GRAND — la table ne reproduit pas le balayage.'); process.exit(1); }
console.log('\nOK — la table reproduit le balayage à mieux que 0,5 %.');
