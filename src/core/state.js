import { NATIONS } from '../data/nations.js';
import { PROJECTS } from '../data/projects.js';
const S={
  year:1930, frac:0, speed:0,
  money:18, income:0, spend:0,
  levelW:0, levelE:0, levelB:0,
  turbine:0.35, dropW:0, dropE:0, rBase:0, rBaseE:0,
  power:0, land:0, salW:38, salE:38, biodiv:100,
  refugees:0, support:52, opinion:58, dust:0, saltArea:0,
  agriYield:0, vol0W:0, vol0E:0, area0:1, areaE0:1,
  powerMul:1, costMul:1, incomeMul:1, debtService:0, debtUntil:0,
  built:{}, prog:{}, active:{},
  flags:{}, fired:{}, log:[], ended:null, decisions:0,
  strand:{}, deadPorts:0, quakes:0
};
PROJECTS.forEach(p=>{S.prog[p.id]=0;S.built[p.id]=false;S.active[p.id]=false;});
const nat={}; NATIONS.forEach(n=>nat[n.id]={...n});
/* Options d'affichage : mutables et lues par le rendu. `mode3d` dit lequel
   des deux rendus est à l'écran — l'IHM s'en sert pour ne pas reconstruire
   inutilement la carte 2D, qui coûte quarante millisecondes. */
export const opts = { layer: 'terrain', showBorders: true, showLabels: true, mode3d: false };

export { S, nat };
