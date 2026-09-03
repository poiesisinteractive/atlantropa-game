import { S } from './state.js';
import { clamp } from './utils.js';
import { log } from './journal.js';
import { endGame } from './endgame.js';

/* LA COURSE — l'atome contre l'eau, 1954-1991.

   Obninsk produit du courant en juin 1954 et tue l'argument de Sörgel dans une
   salle de contrôle, à deux mille kilomètres du détroit. À partir de là, le
   jeu a un adversaire chiffré : les gigawatts nucléaires soviétiques.

   Courbe réelle des GW installés en URSS, qui sert de base :
   0,005 (Obninsk 1954) · 1 (1970) · 5 (1975) · 12 (1980) · 27 (1985) ·
   Tchernobyl (1986) · 34 (1990).

   Deux jauges gouvernent le reste, et elles sont symétriques — c'est tout le
   sens du système. `pressure` mesure ce que Morev fait subir à l'atome :
   l'écart de la course, la propagande, la main tendue refusée, l'embargo.
   Une URSS sous pression construit plus vite **et moins bien**. `strain`
   mesure ce que l'ouvrage subit : la hâte, l'entretien sabré, la guerre, les
   séismes, l'Etna. Ce que Morev fait à l'atome, l'eau peut le subir aussi.

   La conséquence est le nœud du jeu : pousser Moscou, c'est rendre la course
   plus dure à gagner *et* rendre Tchernobyl plus grave. Gagner proprement et
   gagner sale sont deux chemins, et le second passe par la mort de gens qu'on
   ne connaît pas. */

const COURBE = [
  [1954, 0.005], [1958, 0.1], [1964, 0.6], [1970, 1.0],
  [1975, 5], [1980, 12], [1985, 27], [1990, 34], [1996, 38],
];

/* Ce que Tchernobyl fait au programme soviétique, selon sa gravité. La
   catastrophe historique a ralenti le programme sans l'arrêter ; les deux
   autres issues le cassent. */
const APRES_TCHERNOBYL = { historique: 0.92, aggravee: 0.62, contaminee: 0.38 };

function sovietGW(year = S.year) {
  if (year < 1954) return 0;
  let base = COURBE[COURBE.length - 1][1];
  for (let i = 0; i < COURBE.length - 1; i++) {
    const [y0, g0] = COURBE[i], [y1, g1] = COURBE[i + 1];
    if (year <= y1) { base = g0 + (g1 - g0) * (year - y0) / (y1 - y0); break; }
  }
  // Une URSS qu'on humilie construit plus vite. Jusqu'à moitié plus.
  base *= 1 + S.pressure / 200;
  if (S.flags.tcher) base *= APRES_TCHERNOBYL[S.flags.tcher] ?? 1;
  // La coopération acceptée ralentit les deux camps : on partage les turbines,
  // pas les réacteurs.
  if (S.flags.mainTendue) base *= 0.9;
  return base;
}

/* L'écart, en gigawatts. Positif : l'eau mène. */
const ecart = () => S.power - (S.sovietGW || 0);

/* ------------------------------------------------------------ LES JAUGES */

function pressure(n, pourquoi) {
  S.pressure = clamp(S.pressure + n, 0, 100);
  if (pourquoi) log(pourquoi, n > 0 ? 'bad' : 'good');
}
function strain(n, pourquoi) {
  S.strain = clamp(S.strain + n, 0, 100);
  if (pourquoi) log(pourquoi, n > 0 ? 'bad' : 'good');
}

/* Lecture qualitative, pour l'interface et pour les conditions de dossiers.
   Personne ne compare une jauge à un nombre ailleurs qu'ici. */
const NIVEAUX = [[25, 'faible'], [50, 'sensible'], [75, 'forte'], [101, 'critique']];
const niveau = (v) => NIVEAUX.find(([s]) => v < s)[1];

/* --------------------------------------------------------- LE TOUR ANNUEL */

function raceYear() {
  /* La contrainte sur l'ouvrage court dès qu'il y a un ouvrage — bien avant
     1954. La pression sur Moscou n'a de sens qu'une fois la course ouverte. */
  const chantiers = Object.values(S.active).filter(Boolean).length;
  let d = 0;
  if (chantiers >= 2) d += 1.5;                        // la hâte
  else if (chantiers === 1) d += 0.5;
  d += S.flags.entretien ? -2.5 : 1.0;                 // l'entretien, ou son absence
  if (S.levelW < -25) d += 0.6;                        // la charge monte avec la chute
  if (S.flags.sismique) d -= 0.8;                      // la campagne sismique paie
  if (S.built.gib || Object.values(S.active).some(Boolean)) strain(d);

  /* La valeur du jour se dépose dans l'état. C'est ce qui permet aux fins de
     lire la course sans importer ce module — et donc de ne pas fabriquer un
     cycle d'imports entre `endings` et `race`. Elle se fige en 1991 : après,
     il n'y a plus d'Union soviétique à rattraper. */
  if (S.flags.course && S.year <= 1991) S.sovietGW = sovietGW();

  if (S.flags.course) {
    const e = ecart();
    // L'écart pousse Moscou : chaque gigawatt d'avance est une humiliation
    // qu'on répare en coulant du béton plus vite.
    pressure(e > 0 ? Math.min(3, e * 0.25) - 0.8 : -1.2);
  }

  /* La rupture. Au-delà de soixante-quinze, un tirage annuel — et c'est
     Gibraltar qui décide si l'on perd des années ou la partie. */
  if (S.strain > 75 && S.built.gib && !S.ended) {
    const p = (S.strain - 75) / 250;                   // 10 % par an à 100
    if (Math.random() < p) rupture();
  }
}

function rupture() {
  if (S.built.gib) { endGame('zancleen'); return; }
  const ouvrage = ['dard', 'sic', 'suez'].find((k) => S.built[k]);
  if (!ouvrage) return;
  S.built[ouvrage] = false; S.prog[ouvrage] = 0.45;
  strain(-30);
  S.refugees += 1.2;
  log("RUPTURE. Un ouvrage a cédé dans la nuit. Le bilan humain ne sera pas connu avant des semaines, et la reconstruction prendra des années.", 'big');
  S.opinion = clamp(S.opinion - 22, 0, 100);
  S.support = clamp(S.support - 14, 0, 100);
}

export { sovietGW, ecart, pressure, strain, niveau, raceYear, rupture };
