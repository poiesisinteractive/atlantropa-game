/* --- Villes --- */
const CITIES=[
 {n:"Venise",lo:12.34,la:45.44,w:3,nat:"IT"},{n:"Trieste",lo:13.77,la:45.65,w:2,nat:"IT"},
 {n:"Gênes",lo:8.93,la:44.41,w:3,nat:"IT"},{n:"Marseille",lo:5.37,la:43.30,w:3,nat:"FR"},
 {n:"Barcelone",lo:2.17,la:41.39,w:3,nat:"ES"},{n:"Valence",lo:-0.38,la:39.47,w:2,nat:"ES"},
 {n:"Naples",lo:14.27,la:40.85,w:3,nat:"IT"},{n:"Palerme",lo:13.36,la:38.12,w:2,nat:"IT"},
 {n:"Le Pirée",lo:23.62,la:37.94,w:3,nat:"GR"},{n:"Thessalonique",lo:22.94,la:40.64,w:2,nat:"GR"},
 {n:"Izmir",lo:27.14,la:38.42,w:2,nat:"TR"},{n:"Istanbul",lo:28.98,la:41.01,w:3,nat:"TR"},
 {n:"Beyrouth",lo:35.50,la:33.89,w:2,nat:"LV"},{n:"Alexandrie",lo:29.92,la:31.20,w:3,nat:"EG"},
 {n:"Tripoli",lo:13.19,la:32.89,w:2,nat:"LY"},{n:"Tunis",lo:10.30,la:36.85,w:2,nat:"TN"},
 {n:"Alger",lo:3.06,la:36.75,w:3,nat:"DZ"},{n:"Split",lo:16.44,la:43.51,w:2,nat:"YU"}
];

/* --- Annotations de carte --- */
const GEO_NOTES=[
 [4.5,39.6,"Bassin algéro-provençal","−2 800 m"],
 [12.4,39.9,"Mer Tyrrhénienne","−3 500 m"],
 [18.6,35.9,"Plaine abyssale ionienne","−4 100 m · fosse Calypso"],
 [30.8,33.7,"Bassin levantin","−3 000 m"],
 [25.4,36.0,"Mer Égée","−1 500 m"],
 [13.2,44.9,"Adriatique nord","−40 m seulement"],
 [11.0,34.2,"Golfe de Gabès","−45 m"],
 [-5.5,35.95,"Seuil de Gibraltar","−290 m"],
 [11.9,37.0,"Seuil siculo-tunisien","−330 m"],
 [34.2,43.3,"Mer Noire","−2 100 m"]
];
const VOLCANOES=[[14.99,37.75,"Etna"],[14.43,40.82,"Vésuve"],[15.21,38.79,"Stromboli"],[14.96,38.40,"Vulcano"],[25.40,36.40,"Santorin"],[27.17,36.58,"Nisyros"],[14.14,40.83,"Champs Phlégréens"]];
const FAULTS=[
 {n:"Faille nord-anatolienne",p:[[30.0,40.72],[31.5,40.78],[33.0,40.86],[35.0,40.72],[37.0,40.30],[39.0,39.90],[40.0,39.70]]},
 {n:"Arc hellénique — subduction",p:[[21.0,35.6],[22.5,34.9],[24.5,34.6],[26.5,34.7],[28.2,35.3],[29.4,36.0]]},
 {n:"Arc calabrais",p:[[15.2,36.3],[16.4,36.8],[17.2,37.6],[17.4,38.5]]}
];
const EVAPORITES=[[6.0,39.2,"Évaporites messiniennes"],[19.0,35.6,"1 à 3 km de sel sous les fonds"],[29.5,33.5,"Évaporites messiniennes"]];
const RESOURCES=[
 [8.78,34.42,"Phosphates","Gafsa"],[8.13,35.94,"Fer","Ouenza"],[31.80,41.45,"Charbon","Zonguldak"],
 [3.30,32.90,"Gaz","Hassi R'Mel"],[19.50,29.60,"Pétrole","Syrte (1959)"],[10.10,44.08,"Marbre","Carrare"],
 [30.90,30.60,"Coton","Delta du Nil"],[-0.40,39.40,"Agrumes","Huerta de Valence"]
];
const SEAROUTE=[[-5.6,35.95],[-2.0,36.4],[0.5,37.0],[4.0,37.6],[8.0,37.6],[11.4,37.3],[14.0,35.8],[17.5,34.6],[22.0,34.2],[26.0,33.6],[30.0,32.2],[32.3,31.3]];
export { CITIES, GEO_NOTES, VOLCANOES, FAULTS, EVAPORITES, RESOURCES, SEAROUTE };
