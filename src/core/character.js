import { S } from './state.js';
import { clamp } from './utils.js';
import { log } from './journal.js';

/* Le personnage : quatre traits, un plan, une espérance de vie.

   Rien ici n'est une jauge. Les traits ne s'affichent jamais en chiffres —
   ils se lisent dans le portrait, en phrases, et ils gouvernent quelles
   cartes se présentent. L'espérance de vie ne s'affiche pas non plus : elle
   se devine aux signes que le journal glisse, et elle décide de l'année où
   la partie s'arrête.

   Le principe qui tient tout : le joueur sait ce qu'il a choisi, jamais où
   il en est sur une échelle. */

/* Les quatre axes, de −100 à +100. Le nom de chaque pôle sert au portrait. */
const AXES = {
  ideal:  { neg: 'pragmatique', pos: 'idéaliste' },
  africa: { neg: 'terre vide', pos: 'partenaire' },
  sorgel: { neg: 'indépendant', pos: 'fidèle' },
  russia: { neg: 'deuil', pos: 'revanche' },
};

function trait(axis, d) {
  if (!(axis in S.traits)) return;
  S.traits[axis] = clamp(S.traits[axis] + d, -100, 100);
}

/* Lecture qualitative d'un axe : c'est la seule façon dont le reste du jeu
   a le droit de consulter un trait. Personne ne compare un trait à un
   nombre — on demande s'il penche, et de quel côté. */
function leans(axis, side) {
  const v = S.traits[axis] || 0;
  return side === 'pos' ? v >= 25 : v <= -25;
}

/* ------------------------------------------------------------- LA VIE

   Espérance de départ : 1990. Chaque décision coûteuse retire des mois,
   quelques-unes en rendent. La fenêtre effective, 1975-2000, est celle
   qu'on a posée à la spécification : au-delà, ce n'est plus une vie
   d'homme mais une institution. */
const BASE_DEATH = 1990;
const WINDOW = [1975, 2000];

function deathYear() {
  return clamp(Math.round(BASE_DEATH + S.lifeMonths / 12), WINDOW[0], WINDOW[1]);
}

/* Les signes. Trois paliers, une seule fois chacun : le joueur doit sentir
   que l'homme s'use sans jamais lire un chiffre. `S.health` retient le
   dernier palier franchi pour ne pas répéter la même phrase. */
const SIGNES = [
  [-18, "Vous toussez à nouveau. Le médecin de l'Institut parle d'un « épuisement de la cinquantaine ».", 1],
  [-40, "Deux nuits d'hôpital, sans suite. On vous conseille la montagne ; vous répondez que le chantier n'attend pas.", 2],
  [-72, "Votre secrétaire a pris l'habitude d'annuler les rendez-vous du matin.", 3],
];

function life(months) {
  S.lifeMonths += months;
  for (const [seuil, texte, palier] of SIGNES) {
    if (S.lifeMonths <= seuil && S.health < palier) { S.health = palier; log(texte, 'bad'); }
  }
}

/* L'usure ordinaire, prélevée une fois l'an : deux chantiers de front et une
   trésorerie dans le rouge, c'est une année de surmenage — trois mois. Une
   année sans chantier ouvert et sans découvert en rend un. Le solde de ces
   deux lignes fait qu'une partie prudente gagne quelques années, et qu'une
   partie menée tambour battant en perd davantage. */
function lifeYear() {
  const chantiers = Object.values(S.active).filter(Boolean).length;
  if (chantiers >= 2 && S.money < 0) life(-3);
  else if (chantiers === 0 && S.money > 0) life(1);
}

/* ------------------------------------------------------------- LE PLAN

   Ce que Morev croit construire, arrêté au prologue. Les quatre dimensions
   ont chacune un effet mesurable : sans cela, ce serait de la décoration.

     • l'ouvrage-cœur      — 15 % de moins sur son chantier, il l'a dessiné ;
     • la cible            — le seuil d'irréversibilité et l'ambition affichée ;
     • le bénéfice         — ce qui fait vivre l'Institut, donc ses recettes ;
     • la place de l'Afrique — l'accueil au sud, dès la première année. */
const CIBLES = { '-100': "cent mètres", '-200': "deux cents mètres" };

function applyPlan(nat) {
  const p = S.plan;
  S.projMul[p.core] = 0.85;
  // Viser cent mètres, c'est renoncer au continent de Sörgel pour un ouvrage
  // qu'un homme peut voir finir. L'Institut suit moins, l'opinion suit mieux.
  if (p.target === -100) { S.support -= 6; S.opinion += 8; }
  if (p.benefit === 'energie') S.incomeMul *= 1.08;
  if (p.benefit === 'terres') S.incomeMul *= 0.96;
  if (p.benefit === 'paix') S.support += 6;
  if (p.africa === 'partenaire') {
    for (const k of ['MA', 'TN', 'DZ', 'LY', 'EG', 'CG']) if (nat[k]) nat[k].att = clamp(nat[k].att + 10, 0, 100);
    S.support -= 4;
  } else {
    for (const k of ['FR', 'IT']) if (nat[k]) nat[k].att = clamp(nat[k].att + 6, 0, 100);
    for (const k of ['MA', 'TN', 'DZ', 'CG']) if (nat[k]) nat[k].att = clamp(nat[k].att - 6, 0, 100);
  }
}

/* Une phrase au portrait. Le portrait est de l'état de partie, pas de
   l'affichage : `ui/panes.js` ne fait que le mettre en page. */
function portrait(text) {
  S.portrait.push({ y: S.year, t: text });
}

export { AXES, CIBLES, trait, leans, life, lifeYear, deathYear, applyPlan, portrait };
