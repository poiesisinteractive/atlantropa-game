import { S } from './state.js';
import { emit } from './bus.js';

/* Le journal appartient au modèle : `S.log` est de l'état de partie, pas de
   l'affichage. Écrire une ligne, c'est donc muter S puis l'annoncer ; c'est
   `ui/log.js` qui décide de la peindre, s'il y a un écran. */
export function log(text, cls) {
  const line = { y: S.year, t: text, cls: cls || '' };
  S.log.unshift(line);
  if (S.log.length > 140) S.log.pop();
  emit('log', line);
}
