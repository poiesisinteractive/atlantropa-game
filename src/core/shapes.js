import { MED_, ATL_, MARM_, BLACK_, ISL_ } from '../data/coastlines.js';
import { chaikin } from './utils.js';
const MED=chaikin(MED_,2), ATL=chaikin(ATL_,1), MARM=chaikin(MARM_,2), BLACK=chaikin(BLACK_,2);
const ISLANDS=ISL_.map(p=>chaikin(p,2));

/* Le bassin oriental est séparé de l'occidental par la ligne Cap Bon –
   Trapani puis le détroit de Messine. */
function isEast(lo,la){
  if(la>41.6) return lo>12.20;
  if(la>38.6) return lo>16.00;
  if(la>37.6) return lo>15.45;
  return lo > 11.05 + 1.61*(la-36.85);
}
export { MED, ATL, MARM, BLACK, ISLANDS, isEast };
