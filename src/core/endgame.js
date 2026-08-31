import { S } from './state.js';
import { setSpeed } from './clock.js';
import { emit } from './bus.js';
import { ENDINGS, EPILOGUE, verdict } from '../content/endings.js';

/* La fin de partie arrête l'horloge, fige `S.ended` et annonce son verdict.
   Elle ne le met plus en page : c'est `ui/bridge.js` qui en fait une modale,
   et `tools/sim-check.mjs` qui en fait une ligne de sortie. */
function endGame(kind) {
  if (S.ended) return;
  S.ended = kind;
  setSpeed(0);
  const [title, text] = ENDINGS[kind];
  emit('endgame', { kind, year: S.year, title, text, rows: verdict(), epilogue: EPILOGUE });
}

export { endGame };
