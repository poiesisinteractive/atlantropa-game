import { S, nat } from '../core/state.js';
import { log } from '../ui/log.js';
const COND_EVENTS=[
 {id:"gibdone",c:()=>S.built.gib&&!S.flags.gibdone,fn(){S.flags.gibdone=true;
   log("LE DÉTROIT EST FERMÉ. À 3 h 40, les dernières vannes se sont closes. La Méditerranée est désormais une baignoire qui fuit par le ciel.","big");S.support+=14;S.opinion+=16;}},
 {id:"bs1",c:()=>S.built.gib&&!S.built.dard&&S.levelW<-14&&!S.flags.bs1,fn(){S.flags.bs1=true;
   log("La mer Noire se déverse par le Bosphore et les Dardanelles. Un fleuve de 60 km de large ralentit tout l'abaissement.","bad");}},
 {id:"sz1",c:()=>S.built.gib&&!S.built.suez&&S.levelW<-22&&!S.flags.sz1,fn(){S.flags.sz1=true;
   log("Le canal de Suez s'est mué en cataracte : la mer Rouge tombe dans le Sinaï. L'Égypte exige réparation.","bad");nat.EG.att-=18;}},
 {id:"l25",c:()=>S.levelW<-25&&!S.flags.l25,fn(){S.flags.l25=true;
   log("Vingt-cinq mètres. Les premiers hauts-fonds sortent de l'eau : bancs de Gabès, lagunes vénitiennes, plateau du Nil.","big");}},
 {id:"route",c:()=>S.levelW<-60&&!S.flags.route,fn(){S.flags.route=true;
   log("La route Gibraltar–Suez est coupée : trois seuils la barrent désormais. Le commerce Europe–Asie repart par Le Cap.","bad");S.support-=10;}},
 {id:"fish",c:()=>S.salW>39.6&&!S.flags.fish,fn(){S.flags.fish=true;
   log("Les pêcheurs remontent des filets vides. La sardine a disparu du golfe du Lion.","bad");S.opinion-=10;S.biodiv-=8;
   ["ES","IT","GR","TN","DZ","TR"].forEach(k=>nat[k].att-=8);}},
 {id:"mass",c:()=>S.salW>41.5&&!S.flags.mass,fn(){S.flags.mass=true;
   log("MORTALITÉ MASSIVE. Herbiers de posidonie, mérous, cétacés : la mer se vide de sa vie en une décennie. On parle d'une « crise messinienne artificielle ».","big");S.opinion-=22;S.biodiv-=25;}},
 {id:"dust",c:()=>S.dust>26&&!S.flags.dust,fn(){S.flags.dust=true;
   log("TEMPÊTES DE SEL. Le vent lève la croûte des fonds émergés. Chlorures et sulfates retombent sur les vergers de Provence et de Campanie — le scénario de la mer d'Aral, à l'échelle d'un continent.","big");
   S.opinion-=18;S.refugees+=3.5;["FR","IT","ES","GR"].forEach(k=>nat[k].att-=12);}},
 {id:"quake",c:()=>S.levelW<-70&&Math.random()<0.02&&!S.flags.qk,fn(){S.flags.qk=true;S.quakes++;
   log("Séisme majeur en mer Tyrrhénienne. Le rebond isostatique — 400 000 milliards de tonnes d'eau ôtées à la croûte — réveille les failles.","bad");S.money-=8;S.opinion-=8;}},
 {id:"agri",c:()=>S.built.agr&&S.year-(S.flags.agrY||9e9)>12&&!S.flags.agrFail,fn(){S.flags.agrFail=true;
   log("LE GRENIER EST STÉRILE. Après douze récoltes déclinantes, l'évidence : les fonds méditerranéens sont des dépôts évaporitiques. Le sel remonte par capillarité et tue tout. Sörgel avait supposé de la terre ; il n'y avait que du sel.","big");
   S.opinion-=16;S.money-=10;}},
 {id:"port1",c:()=>S.deadPorts>=4&&!S.flags.p4,fn(){S.flags.p4=true;
   log("Quatre grands ports sont désormais des villes de l'intérieur. Gênes, Marseille, Barcelone : les grues surplombent la poussière.","bad");S.opinion-=12;S.refugees+=2;}},
 {id:"port2",c:()=>S.deadPorts>=9&&!S.flags.p9,fn(){S.flags.p9=true;
   log("Neuf ports morts. Le commerce méditerranéen, trois millénaires d'histoire, s'est arrêté en une génération.","big");S.opinion-=18;S.support-=15;}},
 {id:"venice",c:()=>S.levelW<-40&&!S.built.ven&&!S.flags.ven,fn(){S.flags.ven=true;
   log("La lagune de Venise s'est asséchée. Les pilotis de mélèze pourrissent à l'air libre ; la ville s'affaisse.","big");S.opinion-=20;nat.IT.att-=25;}},
 {id:"gulf",c:()=>S.levelW<-120&&!S.flags.gulf,fn(){S.flags.gulf=true;
   log("La circulation thermohaline se dérègle : sans l'eau salée méditerranéenne qui plonge à Gibraltar, la dérive nord-atlantique faiblit. Les hivers britanniques s'allongent — l'inverse exact de ce qu'avait promis Sörgel.","big");S.opinion-=14;nat.UK.att-=20;}},
 {id:"rain",c:()=>S.levelW<-90&&!S.flags.rain,fn(){S.flags.rain=true;
   log("Les pluies manquent. La mer était la chaudière humide de l'Europe du Sud ; réduite d'un cinquième, elle n'alimente plus les dépressions d'automne. Sécheresse d'Andalousie au Liban.","bad");S.opinion-=12;S.refugees+=4;}},
 {id:"irrev",c:()=>S.levelW<-55&&!S.flags.irrev,fn(){S.flags.irrev=true;
   log("Note interne de l'Institut : rouvrir Gibraltar provoquerait une réinondation de type zancléen. Nous avons franchi le point de non-retour.","big");}}
];
export { COND_EVENTS };
