/* Vérifie que les commandes du relief sont réellement atteignables et
   réellement effectives.

   Le test de fumée appelait `set3d()` et `R3.setTilt()` directement : il ne
   pouvait donc pas voir que le canvas WebGL, ajouté en dernier dans #mapwrap,
   se peignait par-dessus les surcouches et interceptait tous leurs clics. On
   passe donc ici par l'interface, et on compare les pixels rendus.

   Depuis que les surcouches vectorielles sont portées en relief, on vérifie
   aussi qu'elles se dessinent, qu'elles ne recouvrent ni n'interceptent les
   commandes, et que les cases « Frontières » et « Toponymes » agissent bien
   sur le rendu en relief — pas seulement sur le rendu plan.

   Usage : node tools/ui3d-check.mjs [url] */
import { chromium } from 'playwright-core';

/* Cible : premier argument, sinon ATL_URL, sinon le serveur de preview.
   Un seul défaut pour les quatre outils — ils en avaient trois. */
const url = process.argv[2] || process.env.ATL_URL || 'http://localhost:4173/';
const browser = await chromium.launch({
  args: ['--use-gl=angle', '--use-angle=default', '--enable-unsafe-swiftshader',
         '--ignore-gpu-blocklist'],
});
const page = await browser.newPage({ viewport: { width: 1500, height: 900 } });
const errors = [];
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
// Le favicon manque et les deux serveurs le rendent en 404 : c'est du bruit,
// pas une régression, et sans ce filtre tout lancement échouerait.
const bruit = (t) => /favicon\.ico/.test(t);
page.on('console', (m) => {
  if (m.type() === 'error' && !bruit(m.text() + ' ' + (m.location()?.url || '')))
    errors.push('console: ' + m.text());
});

await page.goto(url, { waitUntil: 'load' });
await page.waitForFunction(() => !document.getElementById('boot'), null, { timeout: 25000 });
await page.evaluate(() => {
  window.hideModal();
  const g = window.__atl;
  g.S.built.gib = true; g.S.prog.gib = 1;
  g.S.levelW = -120; g.S.levelE = -120; g.dirty.base = true;
});

/* --- 0. avant tout clic, rien de la 3D ne doit être manipulable ---
   C'est le bug d'origine : `hidden` sur un élément à qui la feuille de style
   donne display:flex ne masque rien, et le panneau était atteignable dès le
   chargement, alors qu'aucune scène n'existait. */
const avant = await page.evaluate(() => {
  const p = document.getElementById('view3d');
  return { affiche: getComputedStyle(p).display !== 'none', canvas3d: !!document.getElementById('cv3') };
});
console.log(`  avant le clic : panneau ${avant.affiche ? 'VISIBLE (fautif)' : 'masqué'}` +
            ` · canvas 3D ${avant.canvas3d ? 'PRÉSENT (fautif)' : 'absent'}`);

await page.click('#btn3d');
await page.waitForTimeout(1000);

/* --- 1. les surcouches sont-elles visibles, et cliquables quand elles doivent
       l'être ? Deux questions distinctes : positionnés sans z-index, les frères
       se peignent dans l'ordre du DOM — être visible, c'est venir après le
       canvas. Être cliquable, c'est en plus ne pas avoir pointer-events:none,
       que la légende porte volontairement. --- */
const hits = await page.evaluate(() => {
  const wrap = document.getElementById('mapwrap');
  const ordre = [...wrap.children];
  const iCanvas = ordre.indexOf(document.getElementById('cv3'));
  return ['#layers', '#view3d', '#mapopt', '#seaBadge', '#legend', '#zoomhint'].map((sel) => {
    const el = document.querySelector(sel);
    if (!el || el.hidden) return { sel, etat: 'masqué' };
    const visible = ordre.indexOf(el) > iCanvas;
    const inerte = getComputedStyle(el).pointerEvents === 'none';
    const r = el.getBoundingClientRect();
    const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    return {
      sel, visible, inerte,
      cliquable: inerte ? null : !!(top && (top === el || el.contains(top))),
      dessus: top ? (top.id || top.tagName) : 'rien',
    };
  });
});

const bad = hits.filter((h) => h.etat !== 'masqué' && (!h.visible || h.cliquable === false));
for (const h of hits) {
  if (h.etat) { console.log(`  ${h.sel.padEnd(11)} ${h.etat}`); continue; }
  const quoi = !h.visible ? `RECOUVERT par le canvas`
    : h.inerte ? 'visible · décoratif (pointer-events:none)'
    : h.cliquable ? 'visible · cliquable'
    : `visible mais NON CLIQUABLE, ${h.dessus} intercepte`;
  console.log(`  ${h.sel.padEnd(11)} ${quoi}`);
}

/* --- 1 bis. le canevas des surcouches ---
   Il se glisse entre le rendu WebGL et les commandes HTML : après le premier
   pour être visible, avant les secondes pour ne pas les recouvrir, et inerte
   au pointeur sinon il avalerait les gestes de la caméra. */
const surcouches = await page.evaluate(() => {
  const wrap = document.getElementById('mapwrap');
  const ordre = [...wrap.children];
  const o = document.getElementById('cv3o');
  if (!o) return { absent: true };
  const ctx = o.getContext('2d');
  const d = ctx.getImageData(0, 0, o.width, o.height).data;
  let peints = 0;
  for (let i = 3; i < d.length; i += 4 * 37) if (d[i] > 8) peints++;   // un pixel sur 37
  return {
    apresCanvas3d: ordre.indexOf(o) === ordre.indexOf(document.getElementById('cv3')) + 1,
    avantLesCommandes: ordre.indexOf(o) < ordre.indexOf(document.getElementById('layers') || wrap.lastElementChild),
    inerte: getComputedStyle(o).pointerEvents === 'none',
    peints,
    taille: [o.width, o.height],
  };
});
if (surcouches.absent) console.log('\n  surcouches   ABSENTES : aucun canevas #cv3o');
else console.log(`\n  surcouches   ${surcouches.taille.join('×')} · ` +
  `${surcouches.apresCanvas3d ? 'juste après le canvas 3D' : 'MAL PLACÉES dans le DOM'} · ` +
  `${surcouches.inerte ? 'inertes au pointeur' : 'INTERCEPTENT LE POINTEUR'} · ` +
  `${surcouches.peints} points dessinés`);
const surcouchesKo = surcouches.absent || !surcouches.apresCanvas3d
                  || !surcouches.avantLesCommandes || !surcouches.inerte || surcouches.peints < 50;

/* --- 1 ter. les frontières se décochent-elles vraiment en relief ?
   La case existait déjà en plan ; ce qu'on vérifie ici, c'est qu'elle agit
   sur le rendu en relief, où rien ne la lisait avant. --- */
const clipCarte = { x: 0, y: 46, width: 1160, height: 680 };

/* `page.click` et non `page.uncheck` : l'assistant de Playwright clique puis
   vérifie l'état, et sur cette case il n'y parvient jamais — il reclique en
   boucle jusqu'au délai d'attente, et repart sur un nombre pair de bascules,
   c'est-à-dire sans rien avoir changé. Un clic simple, lui, fait exactement ce
   que fait la main de l'utilisateur, et c'est la doctrine de cet outil. On
   affirme le changement d'état plutôt que de le supposer : sans cela, deux
   captures identiques passeraient pour une case sans effet. */
const bascule = async (sel) => {
  const avant = await page.locator(sel).isChecked();
  await page.click(sel);
  await page.waitForTimeout(400);
  const apres = await page.locator(sel).isChecked();
  if (avant === apres) throw new Error(`${sel} n'a pas basculé au clic (resté ${apres})`);
  return apres;
};

const avecFrontieres = await page.screenshot({ clip: clipCarte });
await bascule('#optBorders');
const sansFrontieres = await page.screenshot({ clip: clipCarte });
await bascule('#optBorders');
const frontieresInertes = avecFrontieres.equals(sansFrontieres);
console.log(`  frontières   ${frontieresInertes ? 'SANS EFFET en relief' : 'la case agit sur le rendu en relief'}`);

/* --- 2. les curseurs changent-ils l'image ? --- */
const shot = () => page.screenshot({ clip: clipCarte });
const diff = (a, b) => {
  let n = 0;
  const L = Math.min(a.length, b.length);
  for (let i = 0; i < L; i++) if (a[i] !== b[i]) n++;
  return (n / L * 100).toFixed(1) + ' % d\'octets différents';
};

const setSlider = async (sel, value) => {
  // Un vrai geste : on clique sur la piste au bon endroit, puis on complète
  // au clavier. `el.value = x` ne déclencherait pas les mêmes évènements.
  const el = page.locator(sel);
  await el.click();
  await el.fill(String(value));           // input[type=range] accepte fill()
  await el.dispatchEvent('input');
  await page.waitForTimeout(400);
};

const base = await shot();
await setSlider('#ctlRelief', 70);
const apresRelief = await shot();
await setSlider('#ctlRelief', 28);
await setSlider('#ctlTilt', 50);
const apresTilt = await shot();
await setSlider('#ctlTilt', 0);
await setSlider('#ctlAbyss', 95);
const apresAbyss = await shot();

console.log('\n  Relief 28 -> 70   :', diff(base, apresRelief));
console.log('  Inclinaison 0 -> 50:', diff(base, apresTilt));
console.log('  Abysses 0,45 -> 0,95:', diff(base, apresAbyss));

const val = await page.evaluate(() => ({
  tilt: document.getElementById('valTilt').textContent,
  relief: document.getElementById('valRelief').textContent,
  abyss: document.getElementById('valAbyss').textContent,
}));
console.log('  étiquettes :', JSON.stringify(val));

/* --- 3. le retour en 2D range bien la 3D --- */
await page.click('#btn3d');
await page.waitForTimeout(500);
const retour = await page.evaluate(() => {
  const vis = (id) => getComputedStyle(document.getElementById(id)).display !== 'none';
  return {
    panneau: vis('view3d'), canvas3d: vis('cv3'), canvas2d: vis('cv'),
    surcouches3d: vis('cv3o'), options: vis('mapopt'),
    bouton3d: document.getElementById('btn3d').classList.contains('on'),
    boutonCalque: document.querySelector('#layers button[data-l="terrain"]').classList.contains('on'),
  };
});
console.log('\n  retour en 2D :', JSON.stringify(retour));
const retourKo = retour.panneau || retour.canvas3d || retour.surcouches3d
              || !retour.canvas2d || !retour.options || retour.bouton3d;

await browser.close();

const inerte = [['Relief', base, apresRelief], ['Inclinaison', base, apresTilt],
                ['Abysses', base, apresAbyss]]
  .filter(([, a, b]) => a.equals(b)).map(([n]) => n);

if (errors.length) { console.error('\nERREURS :'); errors.forEach((e) => console.error('  ' + e)); }
if (avant.affiche || avant.canvas3d) console.error('\nLA 3D EST EXPOSÉE AVANT D\'ÊTRE INITIALISÉE');
if (bad.length) console.error(`\nRECOUVERTS : ${bad.map((h) => h.sel).join(', ')}`);
if (surcouchesKo) console.error('\nLES SURCOUCHES DU RELIEF SONT ABSENTES, MAL PLACÉES OU VIDES');
if (frontieresInertes) console.error('\nLA CASE FRONTIÈRES N\'AGIT PAS SUR LE RENDU EN RELIEF');
if (inerte.length) console.error(`\nSANS EFFET : ${inerte.join(', ')}`);
if (retourKo) console.error('\nLE RETOUR EN 2D NE RANGE PAS LA 3D');
if (errors.length || avant.affiche || avant.canvas3d || bad.length || inerte.length
    || retourKo || surcouchesKo || frontieresInertes)
  process.exit(1);
console.log('\nOK — la 3D reste rangée tant qu\'on ne la demande pas, ses commandes sont\n' +
            '     atteignables et effectives, ses surcouches se dessinent et obéissent aux\n' +
            '     cases, et le retour en 2D est propre.');
