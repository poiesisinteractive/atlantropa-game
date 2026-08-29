/* --- Projets --- */
const PROJECTS=[
 {id:"gib",n:"Barrage de Gibraltar",cost:64,yrs:12,req:["ES","MA","UK"],
  d:"35 km de digue, 200 000 ouvriers, une tour de 400 m dessinée par Peter Behrens. Ferme la Méditerranée et arme les turbines."},
 {id:"dard",n:"Barrage des Dardanelles",cost:20,yrs:7,req:["TR"],
  d:"Retient la mer Noire. Sans lui, elle se déverse dans l'Égée et ralentit l'abaissement d'un tiers."},
 {id:"suez",n:"Écluses de Suez",cost:14,yrs:5,req:["EG","UK"],
  d:"Le canal est au niveau de la mer : sans écluses, la mer Rouge s'y engouffre en cataracte."},
 {id:"sic",n:"Digue Sicile–Tunisie",cost:46,yrs:11,req:["IT","TN"],
  d:"Route Europe–Afrique. Isole le bassin oriental et permet de l'abaisser bien plus bas que l'occidental."},
 {id:"ven",n:"Digue de Venise",cost:7,yrs:3,req:["IT"],
  d:"Enferme la lagune dans un lac. Venise est sauvée — à 400 km du rivage le plus proche."},
 {id:"cgo",n:"Barrage du Congo — mer tchadienne",cost:58,yrs:20,req:["CG","FR"],
  d:"Deux mers intérieures africaines pour irriguer le Sahara. Nécessite le déplacement d'environ 12 millions d'habitants."},
 {id:"prt",n:"Ports en cascade",cost:26,yrs:9,req:[],
  d:"Descendre les ports le long des nouvelles pentes par écluses successives. Réduit de moitié la ruine des villes échouées."},
 {id:"agr",n:"Bonification des fonds",cost:22,yrs:8,req:[],
  d:"Labourer, drainer, dessaler les fonds émergés. Sörgel y voit le grenier de l'Eurafrique."},
 {id:"cit",n:"Villes nouvelles",cost:30,yrs:12,req:[],
  d:"Bâtir sur les terres gagnées. Emplois, prestige, recettes foncières."},
 {id:"grd",n:"Réseau atlantropéen",cost:24,yrs:8,req:["FR","IT"],
  d:"Lignes à très haute tension de Hambourg à Léopoldville. Valorise chaque gigawatt."}
];
const DAMS={
 gib:[[[-5.72,36.14],[-5.48,35.90]]],
 sic:[[[11.05,36.82],[12.55,37.76]],[[15.18,38.36],[15.78,38.02]]],
 dard:[[[25.98,40.52],[26.58,39.96]]],
 ven:[[[12.20,45.20],[12.70,45.62]]]
};
export { PROJECTS, DAMS };
