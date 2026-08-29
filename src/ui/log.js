import { S } from '../core/state.js';
function log(t,cls){ S.log.unshift({y:S.year,t,cls:cls||''}); if(S.log.length>140)S.log.pop(); drawLog(); }
function drawLog(){
  document.getElementById('log').innerHTML=S.log.slice(0,50).map(e=>`<div class="${e.cls}"><b>${e.y}</b>${e.t}</div>`).join('');
}
export { log, drawLog };
