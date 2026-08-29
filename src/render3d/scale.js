/* Échelle verticale.

   Le piège du relief méditerranéen : la fosse Calypso est à −4 100 m, et
   Sörgel voulait baisser la mer de 200 m. Une exagération uniforme rend donc
   l'objet même du jeu — le retrait de la mer — invisible au fond d'un gouffre.

   D'où une échelle en deux régimes, comme sur les cartes hypsométriques :

     • linéaire et très dilatée dans la tranche 0 / ±H1, où tout se joue
       (plateau continental, seuil de Gibraltar à −290 m, seuil siculo-tunisien
       à −330 m, golfe de Gabès à −45 m, Adriatique nord à −40 m) ;
     • logarithmique au-delà, ce qui laisse les plaines abyssales et les Alpes
       exister sans les laisser écraser le reste.

   La dérivée est continue en H1 : `compress` est exactement le rapport des
   pentes de part et d'autre. compress = 1 redonne une échelle linéaire.

   Une unité de carte vaut CELLKM ≈ 3,37 km. `relief` est exprimé en unités de
   carte par kilomètre de dénivelé réel, dans la tranche dilatée. */

/* Les valeurs par défaut sont contraintes par le haut : la Méditerranée a des
   côtes qui montent de mille mètres en une cellule de 3,4 km. Au-delà d'une
   trentaine d'unités par kilomètre, ces pentes réelles deviennent des murs
   verticaux et la carte se hérisse de lames. Le retrait de la mer, lui, se
   lit surtout à l'horizontale — un demi-million de kilomètres carrés — et n'a
   pas besoin qu'on force le trait. */
export const vscale = {
  relief: 28,      // unités de carte par km, près de la surface
  H1: 300,         // mètres — hauteur de la tranche dilatée
  H2: 800,         // mètres — échelle du régime logarithmique
  compress: 0.45,  // rapport des pentes au-delà de H1 (1 = linéaire)
};

/* Mètres réels -> unités de carte. Impaire : yOf(−h) = −yOf(h). */
export function yOf(h) {
  const { relief, H1, H2, compress } = vscale;
  const a = Math.abs(h), k = relief / 1000;
  const near = Math.min(a, H1);
  const far = a > H1 ? compress * H2 * Math.log(1 + (a - H1) / H2) : 0;
  return Math.sign(h) * k * (near + far);
}

/* La même chose en GLSL, injectée dans les shaders du terrain et de l'eau.
   Une seule définition, deux langages : si l'une change, l'autre suit. */
export const YOF_GLSL = /* glsl */`
uniform vec4 uVScale;          // relief/1000, H1, H2, compress
float yOf(float h){
  float a = abs(h);
  float near = min(a, uVScale.y);
  float far  = a > uVScale.y
             ? uVScale.w * uVScale.z * log(1.0 + (a - uVScale.y) / uVScale.z)
             : 0.0;
  return sign(h) * uVScale.x * (near + far);
}`;

export function vscaleUniform() {
  return [vscale.relief / 1000, vscale.H1, vscale.H2, vscale.compress];
}
