/* Le fil entre le modèle et l'interface.

   Jusqu'ici `core/sim.js` appelait `ui/log`, et `core/endgame.js` fabriquait
   du HTML : la simulation ne tournait donc que dans un navigateur, et la
   moindre vérification du modèle coûtait un Chromium et deux minutes.

   Le modèle n'appelle plus l'interface, il annonce. Ce qu'il annonce :

     log       { year, text, cls }        une ligne de journal
     speed     { speed }                  la vitesse a changé, boutons à jour
     decision  { ev }                     un dossier attend d'être tranché
     resolved  { ev, choice }             il vient de l'être
     endgame   { kind, year, title, … }   la partie est finie, verdict joint

   Personne n'écoute côté modèle : sans abonné, `emit` ne fait rien, et
   `tools/sim-check.mjs` fait tourner deux siècles sans DOM. */

const subs = new Map();

export function on(type, fn) {
  if (!subs.has(type)) subs.set(type, new Set());
  subs.get(type).add(fn);
  return () => off(type, fn);
}

export function off(type, fn) { subs.get(type)?.delete(fn); }

export function emit(type, payload) {
  const set = subs.get(type);
  if (!set) return;
  /* Copie avant parcours : un abonné qui se désabonne en réagissant — la
     modale de fin, typiquement — ne doit pas amputer l'itération en cours. */
  for (const fn of [...set]) fn(payload);
}
