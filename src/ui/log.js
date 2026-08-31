import { S } from '../core/state.js';
import { on } from '../core/bus.js';

/* Le journal est tenu par `core/journal.js` ; ici on ne fait que le peindre,
   à chaque ligne annoncée. */
function drawLog(){
  document.getElementById('log').innerHTML=S.log.slice(0,50).map(e=>`<div class="${e.cls}"><b>${e.y}</b>${e.t}</div>`).join('');
}
on('log', drawLog);

export { drawLog };
