import { N, CELL_AREA } from './geo.js';
import { depth, basin } from './grid.js';

/* Courbe hypsométrique — distribution cumulée des profondeurs, par bassin.

   La bathymétrie ne change jamais de la partie ; seul le niveau bouge. Aire
   immergée et volume ne dépendent donc que d'un scalaire, et se lisent dans
   une table au lieu de se recompter sur les 772 200 cellules.

   Notation : T = tirant d'assèchement, en mètres positifs (T = −niveau).
   Une cellule est immergée si sa profondeur dépasse T.

     aire(T)   = n − C(T)                       C(T) = #{ profondeur ≤ T }
     volume(T) = (Σd − S(T)) − T·(n − C(T))     S(T) = Σ{ d ≤ T } d

   Les tables sont interpolées linéairement entre casiers d'un mètre : le
   niveau descend en continu et un rivage qui avancerait par paliers d'un
   mètre se verrait à l'écran. */

const BINS = 5200;               // du rivage à la fosse Calypso, avec de la marge
const curves = new Map();        // index de bassin -> table

export function buildHypsometry() {
  curves.clear();
  for (const b of [2, 3]) {
    // cCnt[k] = nombre de cellules dont floor(profondeur) < k
    // cSum[k] = somme de leurs profondeurs
    const cCnt = new Float64Array(BINS + 2);
    const cSum = new Float64Array(BINS + 2);
    for (let i = 0; i < N; i++) {
      if (basin[i] !== b) continue;
      const d = depth[i];
      const k = d >= BINS ? BINS : d < 0 ? 0 : Math.floor(d);
      cCnt[k + 1]++; cSum[k + 1] += d;
    }
    for (let k = 1; k <= BINS + 1; k++) { cCnt[k] += cCnt[k - 1]; cSum[k] += cSum[k - 1]; }
    curves.set(b, { n: cCnt[BINS + 1], total: cSum[BINS + 1], cCnt, cSum });
  }
}

/* Aire immergée, volume immergé et surface émergée d'un bassin, en cellules. */
function slice(c, T) {
  if (T <= 0) return { area: c.n, vol: c.total - T * c.n, dry: 0 };
  if (T >= BINS) return { area: 0, vol: 0, dry: c.n };
  const k = Math.floor(T), f = T - k;
  const dry = c.cCnt[k] + f * (c.cCnt[k + 1] - c.cCnt[k]);
  const sum = c.cSum[k] + f * (c.cSum[k + 1] - c.cSum[k]);
  const area = c.n - dry;
  return { area, vol: Math.max(0, c.total - sum - T * area), dry };
}

/* Mêmes grandeurs et mêmes unités que l'ancien balayage : volumes en m³,
   aires en m², terres émergées en km². */
export function hypsoMeasure(levelW, levelE) {
  const w = slice(curves.get(2), -levelW);
  const e = slice(curves.get(3), -levelE);
  return {
    vW: w.vol * CELL_AREA, vE: e.vol * CELL_AREA,
    aW: w.area * CELL_AREA, aE: e.area * CELL_AREA,
    land: (w.dry + e.dry) * CELL_AREA / 1e6,
  };
}
