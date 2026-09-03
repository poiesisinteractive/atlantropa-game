import { S, nat } from '../core/state.js';
import { AXES, deathYear } from '../core/character.js';
import { clamp, fmt } from '../core/utils.js';
import { PROJECTS } from '../data/projects.js';
import { NATIONS } from '../data/nations.js';
import { CITIES } from '../data/places.js';
function bar(l,v,max,c,sfx){ const p=clamp(v/max*100,0,100);
  return `<div class="bar"><div class="lab"><span>${l}</span><span>${sfx}</span></div><div class="track"><div class="fill" style="width:${p}%;background:${c}"></div></div></div>`; }

function paneOps(){
  const nMem=Object.values(nat).filter(n=>n.mem).length;
  let h=`<div class="sec">Vannes de Gibraltar</div>`;
  if(S.built.gib){
    h+=`<p style="font-size:11px;color:#9aa3ad;margin:0 0 4px;line-height:1.5">
    Turbiner de l'eau, c'est laisser l'Atlantique compenser l'évaporation : la mer cesse de descendre.
    Mais la puissance vaut <em>débit × hauteur de chute</em> — et la hauteur de chute, c'est justement ce que vous perdez en n'asséchant pas.</p>
    <input id="slider" type="range" min="0" max="100" value="${Math.round(S.turbine*100)}">
    <div style="display:flex;justify-content:space-between;font-size:10.5px;color:#9aa3ad">
      <span>0 % — assèchement</span><span><b style="color:#e6c65a" id="turbVal">${Math.round(S.turbine*100)} %</b></span><span>100 % — niveau stable</span></div>
    <div style="margin-top:8px;font-size:11.5px">
      Descente : <b id="turbDrop">${fmt(S.dropW,2)} m/an</b> &nbsp;·&nbsp;
      Puissance : <b style="color:#e6c65a" id="turbPow">${fmt(S.power,1)} GW</b></div>`;
  } else h+=`<p style="font-size:11px;color:#9aa3ad">Rien ne commence avant que le détroit ne soit fermé. Il faut l'accord de l'Espagne, du Maroc et du Royaume-Uni.</p>`;

  h+=`<div class="sec">Trésorerie</div><div style="font-size:11.5px;line-height:1.75">
     Recettes <b style="color:#8fd096;float:right">+${fmt(S.income,1)} Md/an</b><br>
     Dépenses <b style="color:#e08b82;float:right">−${fmt(S.spend,1)} Md/an</b><br>
     ${S.year<S.debtUntil?`Service de la dette <b style="color:#e08b82;float:right">−${fmt(S.debtService,1)} Md jusqu'en ${S.debtUntil}</b><br>`:''}
     Consortium <b style="float:right">${nMem} / ${NATIONS.length} nations</b><br>
     Décisions prises <b style="float:right">${S.decisions}</b></div>
   <div class="sec">Chantiers</div>`;
  for(const p of PROJECTS){
    const ok=p.req.every(r=>nat[r].mem);
    const st=S.built[p.id]?`<span class="tag ok">achevé</span>`:S.active[p.id]?`<span class="tag">en cours</span>`
      :ok?`<span class="tag">disponible</span>`:`<span class="tag no">accord manquant</span>`;
    const rq=p.req.length?`<div style="font-size:10px;color:#8c949e;margin-top:4px">Requiert : ${p.req.map(r=>`<span style="color:${nat[r].mem?'#8fd096':'#e08b82'}">${nat[r].n}</span>`).join(', ')}</div>`:'';
    h+=`<div class="card"><div class="row"><h4>${p.n}</h4>${st}</div><p>${p.d}</p>${rq}
      <div class="row" style="margin-top:7px"><span class="cost">${p.cost} Md · ${p.yrs} ans</span>
      ${S.built[p.id]?'':`<button ${ok?'':'disabled'} onclick="toggleProj('${p.id}')">${S.active[p.id]?'Suspendre':'Lancer'}</button>`}</div>
      ${S.prog[p.id]>0?`<div class="prog"><i style="width:${S.prog[p.id]*100}%"></i></div>`:''}</div>`;
  }
  if(S.built.gib&&!S.ended){
    h+=`<div class="sec">Option irréversible</div><div class="card"><h4>Rouvrir le détroit</h4>
      <p>${S.levelW<-55?"L'Institut estime qu'une réinondation produirait une cataracte de type zancléen.":"Il est encore tôt : la remontée serait lente et sans dégât majeur."}</p>
      <button onclick="reflood()" style="border-color:#7d3b31;color:#e8a49b">Ouvrir les vannes</button></div>`;
  }
  return h;
}
function paneEnv(){
  return `<div class="sec">Bilan de sel</div>
   ${bar('Salinité (ouest)',S.salW-37,9,'#c9a227',fmt(S.salW,1)+' g/L')}
   ${S.built.sic?bar('Salinité (bassin est)',S.salE-37,9,'#c98527',fmt(S.salE,1)+' g/L'):''}
   <p style="font-size:11px;color:#9aa3ad;line-height:1.55">Le sel ne s'évapore pas. Chaque mètre d'eau perdu concentre ce qui reste.
   Au-delà de 40 g/L la faune méditerranéenne décroche ; à 42 g/L on entre dans le domaine des lagunes hypersalines.
   Référence : la crise messinienne, il y a 6 millions d'années.</p>
   <div class="sec">Vivant</div>
   ${bar('Biodiversité marine',S.biodiv,100,S.biodiv>55?'#5a9e5e':S.biodiv>25?'#c9a227':'#c0392b',fmt(S.biodiv,0)+' %')}
   ${bar('Charge de poussière saline',S.dust,100,'#b9a97e',fmt(S.dust,0)+' %')}
   <p style="font-size:11px;color:#9aa3ad;line-height:1.55">Les fonds émergés sèchent en croûte d'halite et de gypse. Le vent la soulève.
   La mer d'Aral, cent fois plus petite, a suffi à empoisonner l'agriculture de deux républiques.</p>
   <div class="sec">Terres & climat</div><div style="font-size:11.5px;line-height:1.85">
     Fonds émergés <b style="float:right">${fmt(S.land,0)} km²</b><br>
     Dont croûte saline <b style="float:right;color:#b9a97e">${fmt(S.saltArea,0)} km²</b><br>
     Rendement agricole <b style="float:right;color:${S.flags.agrFail?'#e08b82':'#8fd096'}">${fmt(S.agriYield,1)} Md/an</b><br>
     Baisse du niveau des océans <b style="float:right">${fmt(Math.abs(S.levelW)*2.3e12/3.6e14,2)} m</b><br>
     Séismes majeurs <b style="float:right">${S.quakes}</b></div>
   <p style="font-size:11px;color:#9aa3ad;line-height:1.55">Retirer l'eau de la Méditerranée abaisse réellement le niveau global des océans — l'unique effet
   que les projets modernes de barrage à Gibraltar retiennent encore.</p>`;
}
function paneGeo(){
  let h=`<div class="sec">Opinion & légitimité</div>
   ${bar('Soutien des gouvernements',S.support,100,'#4a8fb8',fmt(S.support,0)+' %')}
   ${bar('Opinion publique',S.opinion,100,'#8a6fb8',fmt(S.opinion,0)+' %')}
   ${bar('Déplacés',S.refugees,40,'#c0392b',fmt(S.refugees,1)+' M')}
   <div class="sec">Consortium</div>`;
  for(const k in nat){ const n=nat[k];
    const col=n.att>60?'#5a9e5e':n.att>35?'#c9a227':'#c0392b';
    h+=`<div class="card" style="padding:7px 9px"><div class="row">
      <div><h4 style="margin:0">${n.n}</h4><div class="track" style="width:118px;margin-top:5px"><div class="fill" style="width:${n.att}%;background:${col}"></div></div></div>
      <div style="text-align:right">${n.mem?'<span class="tag ok">membre</span>':`<button onclick="negotiate('${k}')" ${S.money<2?'disabled':''}>Négocier · 2 Md</button>`}
      <div style="font-size:10px;color:#8c949e;margin-top:4px">contribution ${n.ct} Md/an</div></div></div></div>`;
  }
  h+=`<div class="sec">Ports</div><div style="font-size:11.5px;line-height:1.8">`;
  const lim=S.built.prt?42:16;
  for(const c of CITIES.slice().sort((a,b)=>(S.strand[b.n]||0)-(S.strand[a.n]||0))){
    const s=S.strand[c.n]||0;
    h+=`<div style="display:flex;justify-content:space-between;color:${s>lim?'#e08b82':'#c3cbd4'}"><span>${c.n}</span><span>${s<1?'à quai':fmt(s,0)+' km de la mer'}</span></div>`;
  }
  return h+'</div>';
}
/* Le portrait. Des phrases, jamais des barres : c'est la décision du tour 3
   de la spécification, et elle tient tout le panneau. Les traits ne sont
   nommés qu'en toutes lettres, et seulement quand ils penchent assez pour
   qu'une phrase soit vraie.

   Ce que le joueur ne verra jamais ici : l'espérance de vie. Elle se devine
   aux lignes du journal, et c'est tout. */
const PENCHANTS = {
  ideal:  { pos: "Il voit grand, et il en a fait une méthode.", neg: "Il ne dessine que ce qu'une fonderie sait couler." },
  africa: { pos: "Pour lui, la rive sud signe ou ne signe pas — elle ne se prend pas.", neg: "Dans son plan, l'Afrique est une surface." },
  sorgel: { pos: "Il est l'homme de Sörgel, et l'assume.", neg: "Il a toujours corrigé le maître, d'abord au crayon, puis autrement." },
  russia: { pos: "La Russie n'est pas pour lui un deuil, mais une revanche à prendre par l'ouvrage.", neg: "Il parle de la Russie au passé, quand il en parle." },
};

function panePortrait(){
  const age = S.year - S.birth;
  let h = `<div class="sec">Alexeï Morev</div>
  <p style="font-size:11.5px;line-height:1.7;color:#c3cbd4">Né en ${S.birth} près de Taganrog · apatride depuis 1921, passeport Nansen ·
  École des ponts et chaussées, Paris · ${age} ans en ${S.year}.</p>`;

  const dits = Object.entries(AXES).map(([k]) => {
    const v = S.traits[k] || 0;
    if (v >= 25) return PENCHANTS[k].pos;
    if (v <= -25) return PENCHANTS[k].neg;
    return null;
  }).filter(Boolean);
  if (dits.length) h += `<div class="sec">Ce qu'on dit de lui</div>
    <p style="font-size:11.5px;line-height:1.7;color:#c3cbd4">${dits.join('<br>')}</p>`;

  const coeur = { gib: 'Gibraltar', sic: 'la digue Sicile–Tunisie', dard: 'les Dardanelles' }[S.plan.core] || '—';
  const but = { energie: "l'énergie", terres: 'les terres', paix: 'la paix par le chantier' }[S.plan.benefit] || '—';
  const afr = S.plan.africa === 'partenaire' ? 'des États qui signent' : 'une terre à mettre en valeur';
  h += `<div class="sec">Son plan, tel qu'il l'a écrit en 1930</div>
  <div style="font-size:11.5px;line-height:1.75">
    Par où commencer <b style="float:right">${coeur}</b><br>
    Jusqu'où descendre <b style="float:right">${-S.plan.target} m</b><br>
    Ce qu'il met en avant <b style="float:right">${but}</b><br>
    L'Afrique dans le plan <b style="float:right">${afr}</b></div>`;

  h += `<div class="sec">Sa vie</div>`;
  if (!S.portrait.length) h += `<p style="font-size:11.5px;color:#8c949e">Rien encore. Le prologue n'a pas été joué.</p>`;
  else h += S.portrait.map(p =>
    `<div class="card" style="padding:8px 10px"><div style="font-size:10px;color:#8c949e;letter-spacing:.08em">${p.y}</div>
     <p style="margin:3px 0 0;font-size:11.5px;line-height:1.6;color:#c3cbd4">${p.t}</p></div>`).join('');

  if (S.ended) h += `<div class="sec">Fin</div>
    <p style="font-size:11.5px;color:#c3cbd4">Mort en ${S.year}, à ${S.year - S.birth} ans. L'espérance était de ${deathYear()}.</p>`;
  return h;
}

function paneDoc(){
  return `<div class="sec">Le projet réel</div>
  <p style="font-size:11.5px;line-height:1.65;color:#c3cbd4"><b>Atlantropa</b> (ou <i>Panropa</i>) est le projet de l'architecte munichois
  <b>Herman Sörgel</b> (1885-1952), défendu de 1928 à sa mort. Un barrage hydroélectrique de 35 km au détroit de Gibraltar devait abaisser la
  Méditerranée <b>jusqu'à 200 mètres</b>, en produisant environ <b>50 000 MW</b> et en découvrant des centaines de milliers de km² de terres.
  Quatre autres ouvrages étaient prévus : les <b>Dardanelles</b> (retenir la mer Noire), une digue <b>Sicile–Tunisie</b>, un barrage sur le
  <b>Congo</b> pour créer des mers intérieures africaines et irriguer le Sahara, et des <b>écluses à Suez</b>.</p>
  <div class="sec">Ce que Sörgel voulait</div>
  <p style="font-size:11.5px;line-height:1.65;color:#c3cbd4">Un chantier séculaire contre le chômage, l'énergie sans fin, des terres contre la
  surpopulation — et la fusion de l'Europe et de l'Afrique en un bloc capable de tenir tête à l'Amérique et à une « Pan-Asie ». Le projet était
  <b>pacifiste</b> et <b>pan-européen</b> dans son intention, et franchement <b>colonial</b> dans sa structure : l'Afrique y est un espace vide
  à peupler d'Européens, et aucun pays riverain du sud n'a été consulté. En 1938, Sörgel place une citation de Hitler en exergue d'un de ses
  livres pour se rendre acceptable ; en 1942 le régime lui interdit toute propagande.</p>
  <div class="sec">Ce qui serait arrivé</div>
  <p style="font-size:11.5px;line-height:1.65;color:#c3cbd4">
  • <b>Hypersalinité</b> : le sel reste, l'eau part. De 38 à 43-45 g/L — une crise messinienne artificielle, létale pour l'essentiel de la faune.<br>
  • <b>Croûtes de sel</b> : les fonds découverts sont des dépôts évaporitiques, pas de la terre arable. Le « grenier » aurait été un désert salé,
  avec des tempêtes de poussière saline de type mer d'Aral.<br>
  • <b>Ports morts</b> : Venise, Gênes, Marseille, Alexandrie, Le Pirée à des dizaines puis des centaines de kilomètres du rivage.<br>
  • <b>Climat</b> : moins d'évaporation, donc moins de pluies méditerranéennes ; et l'arrêt de la veine d'eau salée qui plonge à Gibraltar
  perturbe la circulation atlantique — l'inverse du bienfait annoncé.<br>
  • <b>Géologie</b> : ôter des centaines de milliers de milliards de tonnes d'eau provoque un rebond de la croûte et une sismicité accrue.</p>
  <div class="sec">Ce qui l'a tué</div>
  <p style="font-size:11.5px;line-height:1.65;color:#c3cbd4">Ni l'écologie ni la morale : le <b>nucléaire civil</b> (1954) a rendu l'argument
  énergétique caduc, la <b>décolonisation</b> a détruit la prémisse eurafricaine, et le coût était sans commune mesure avec la reconstruction
  d'après-guerre. L'Institut Atlantropa a fermé en 1960.</p>
  <div class="sec">Lecture de la carte</div>
  <p style="font-size:11.5px;line-height:1.65;color:#c3cbd4">Le relief est ombré : en s'asséchant, le fond révèle ses talus, ses canyons et ses
  plaines abyssales. Les frontières sont celles de 1930 (Yougoslavie, Transjordanie, Palestine mandataire, Libye italienne). Les calques
  <b>Géologie</b>, <b>Économie</b> et <b>Sel</b> superposent bathymétrie, volcanisme, routes maritimes, ressources et salinité.<br><br>
  Le bouton <b>3D</b> bascule la carte en relief : molette pour zoomer, glisser pour pivoter, clic droit pour déplacer. Trois réglages y
  gouvernent l'échelle verticale — l'<b>inclinaison</b> de la vue, l'exagération du <b>relief</b>, et la compression des <b>abysses</b>,
  sans laquelle les deux cents mètres d'assèchement seraient invisibles au fond d'une fosse de cinq mille. Frontières, toponymes, villes,
  barrages et annotations de calque se tracent dans les deux vues ; en relief ils se posent sur la surface, et suivent donc le rivage
  à mesure qu'il recule.</p>
  <div class="sec">Sources</div>
  <p style="font-size:10.5px;line-height:1.6;color:#8c949e">Wikipédia « Atlantropa » · W. Voigt, <i>Atlantropa — Weltenbauen am Mittelmeer</i> (1998) ·
  A. Gall, <i>Das Atlantropa-Projekt</i> (1998) · Atlas Obscura · Cabinet Magazine n°10 · Environment &amp; Society Portal.<br><br>
  La simulation est calibrée sur des ordres de grandeur réels (déficit évaporatoire net ≈ 0,95 m/an, P = ρgQHη, bilan de sel à masse constante).
  Le relief et la bathymétrie sont réels — <i>Terrain Tiles</i>, AWS Open Data, agrégat de SRTM, NED, ETOPO1 et GEBCO — rééchantillonnés sur une
  grille de 3,37 km. Le trait de côte, lui, reste dessiné à la main, et les frontières sont celles de 1930 : c'est un jeu, pas un SIG.</p>`;
}
export { bar, paneOps, paneEnv, paneGeo, panePortrait, paneDoc };
