import { S } from './state.js';
import { clamp, fmt } from './utils.js';
import { log } from './journal.js';

/* LE GRAND LIVRE — bailleurs et obligations.

   Deux façons de financer, et deux prix. Un **bailleur** a un visage : il
   apporte de l'argent, des hommes ou de la légitimité, et inscrit une
   **clause** au grand livre. La clause ne coûte rien le jour où on la signe ;
   elle présente sa note des années plus tard, quand l'Histoire la rattrape.
   Une **émission** n'a pas de visage : elle a un taux. Elle coûte tout de
   suite, tous les ans, et le défaut est une faillite.

   Le pont entre les deux : un bailleur peut garantir une émission, ce qui en
   baisse le taux. Se passer des bailleurs, c'est emprunter cher. */

/* ------------------------------------------------------------ BAILLEURS */

function sign(id, nom, clause, echeance) {
  if (S.backers[id]) return;
  S.backers[id] = S.year;
  S.ledger.push({ id, nom, clause, echeance, y: S.year, statut: 'active' });
  log(`Au grand livre : ${nom}. Clause — ${clause}`, 'big');
}

const signed = (id) => !!S.backers[id];

/* Une clause s'éteint : honorée, dénoncée, ou rendue caduque par l'Histoire.
   Elle reste inscrite — c'est un grand livre, pas un brouillon. */
function close(id, statut, texte) {
  const l = S.ledger.find((x) => x.id === id && x.statut === 'active');
  if (!l) return;
  l.statut = statut; l.fin = S.year;
  if (texte) log(texte, statut === 'denoncee' ? 'bad' : '');
}

const actives = () => S.ledger.filter((l) => l.statut === 'active');

/* ---------------------------------------------------------- OBLIGATIONS

   Taux de base 4 %, plus un point par tranche de vingt points de soutien
   manquant sous 70 — un projet qu'on croit mort emprunte cher —, moins un
   point et demi si un bailleur garantit l'émission. Le service annuel est
   l'intérêt plus l'amortissement linéaire ; à l'échéance, l'émission
   s'éteint d'elle-même.

   Deux émissions vives au maximum : au-delà, le marché se ferme. C'est la
   seule règle qui empêche la fuite en avant, et elle est volontairement
   brutale. */
const MAX_VIVES = 2;
const MONTANTS = [10, 25, 40];

function bondRate(md, ans) {
  const manque = Math.max(0, 70 - S.support);
  let t = 4 + manque / 20;
  if (S.flags.garant) t -= 1.5;
  if (ans === 25) t += 0.5;              // le long terme se paie
  if (md >= 40) t += 0.5;                // les grosses lignes aussi
  return clamp(t, 2, 12);
}

const bondService = (md, ans, taux) => md * taux / 100 + md / ans;

const liveBonds = () => S.bonds.filter((b) => S.year < b.until);

const bondsDue = () => liveBonds().reduce((s, b) => s + b.service, 0);

function canIssue() {
  return !S.ended && liveBonds().length < MAX_VIVES;
}

function issue(md, ans) {
  if (!canIssue()) return false;
  const taux = bondRate(md, ans);
  const service = bondService(md, ans, taux);
  S.bonds.push({ md, ans, taux, service, y: S.year, until: S.year + ans });
  S.money += md;
  log(`Émission de ${md} Md sur ${ans} ans à ${fmt(taux, 2)} % — service de ${fmt(service, 2)} Md/an jusqu'en ${S.year + ans}.`
    + (S.flags.garant ? " La garantie du bailleur a fait le taux." : ''), 'big');
  return true;
}

export { sign, signed, close, actives, MONTANTS, bondRate, bondService, liveBonds, bondsDue, canIssue, issue };
