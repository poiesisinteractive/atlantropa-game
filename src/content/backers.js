import { S, nat } from '../core/state.js';
import { E, SUD } from './effects.js';
import { sign, signed, close } from '../core/ledger.js';
import { leans } from '../core/character.js';
import { log } from '../core/journal.js';

/* LE REGISTRE DES BAILLEURS — dix visages, dix clauses.

   Chaque bailleur vient en deux temps. D'abord **l'offre** : un dossier
   ordinaire, qui se présente dans sa fenêtre et propose de l'argent, des
   hommes ou de la légitimité contre une clause inscrite au grand livre.
   Puis **l'échéance** : un second dossier, à date fixe, qui ne se présente
   *que si la clause a été signée* — c'est le moment où l'Histoire vient la
   lire à voix haute.

   Tout passe par la grammaire des dossiers existants : titre, situation,
   trois options chiffrées. Il n'y a pas de moteur de bailleurs, et c'est
   voulu — un bailleur est un dossier qui laisse une trace.

   Les fenêtres sont historiques. L'Italie disparaît en 1943, le Reich en
   1945, la SDN en 1939, l'Amirauté après Suez, le Plan Marshall après 1952.
   Un bailleur qu'on laisse passer ne revient pas. */

const dispo = (id) => !signed(id);

const BACKERS = [
/* ======================================================== LES RÉGIMES */

{id:"b_italie",t:"Rome propose",k:"Financement",y:[1930,1943],p:3,c:()=>dispo("italie"),
 x:"Un émissaire du Palais de Venise, en civil, avec un chiffre : dix-huit milliards et vingt mille ouvriers dès la première année. L'Italie ne demande pas à entrer au consortium — elle demande que l'ouvrage commence par la digue de Sicile, qu'on l'appelle la route impériale, et que l'Afrique du Nord relève de Rome.",
 o:[["Signer","+18 Md · 20 000 ouvriers · Italie +20 · opinion −10",()=>{E.m(18);E.a("IT",20);E.o(-10);E.aa(SUD,-10);
     S.projMul.sic=Math.min(S.projMul.sic??1,0.7);
     sign("italie","Italie fasciste","la digue de Sicile d'abord, l'ouvrage nommé route impériale, l'Afrique du Nord à Rome","1943");}],
    ["Signer sans la clause africaine — moitié moins","+9 Md · Italie +10",()=>{E.m(9);E.a("IT",10);E.o(-4);
     sign("italie","Italie fasciste","la digue de Sicile d'abord ; l'Afrique du Nord reste hors du texte","1943");}],
    ["Refuser","Italie −16",()=>{E.a("IT",-16);E.f("noItalie");}]]},

{id:"e_italie",t:"La route impériale",k:"Histoire",fy:1943,c:()=>signed("italie"),
 x:"Mussolini est arrêté en juillet, le royaume signe l'armistice en septembre, et la moitié du pays passe sous occupation allemande. Votre clause de 1930 porte le mot impérial en toutes lettres, et vos vingt mille ouvriers étaient des soldats.",
 o:[["Dénoncer la clause publiquement","opinion +14 · Italie −20 · perte du rabais",()=>{E.o(14);E.a("IT",-20);delete S.projMul.sic;
     close("italie","denoncee","La clause italienne est dénoncée. La digue de Sicile perd son financement et son nom.");}],
    ["Attendre : l'Italie de demain renégociera","opinion −12 · Italie +8",()=>{E.o(-12);E.a("IT",8);E.tr("ideal",-10);}],
    ["Se réclamer du royaume du Sud — 4 Md","opinion +6 · Italie +12",()=>{E.m(-4);E.o(6);E.a("IT",12);
     close("italie","honoree","La clause est reprise au compte du royaume du Sud, mot pour mot, sans l'adjectif.");}]]},

/* La seule porte de la saisie, pour l'instant : une clause d'État qu'on a
   choisi de garder alors que l'État en question a changé de camp. Elle ne se
   présente qu'à qui a signé Rome et n'a pas dénoncé en 1943. */
{id:"e_italie2",t:"La ligne Gustave",k:"Histoire",fy:1944,
 c:()=>signed("italie")&&S.ledger.some(l=>l.id==="italie"&&l.statut==="active")&&(S.built.sic||S.active.sic),
 x:"La Wehrmacht tient l'Italie au sud de Rome et considère le chantier de Sicile comme un ouvrage militaire — la clause de 1930 le dit, en toutes lettres : route impériale. Un colonel du génie s'installe dans vos bureaux de Trapani avec une compagnie et un ordre de réquisition.",
 o:[["Évacuer le chantier et brûler les plans","chantier perdu · opinion +10",()=>{E.o(10);S.active.sic=false;E.retard("sic",0.4);
     close("italie","denoncee","Le chantier de Sicile est évacué en trois jours. La clause italienne s'éteint avec lui.");}],
    ["Rester : c'est l'ouvrage, pas la guerre","l'ouvrage est saisi",()=>{E.o(-14);
     saisie("Le chantier de Sicile passe sous administration militaire allemande, en vertu d'une clause que vous avez signée en 1930.");}],
    ["Négocier une exploitation civile — 6 Md","opinion −20 · soutien +8",()=>{E.m(-6);E.o(-20);E.s(8);E.f("collab");
     E.port("Il a négocié en 1944 le maintien d'un chantier civil sous administration militaire allemande. Il n'a jamais accepté d'en parler.");}]]},

{id:"b_reich",t:"Le plus gros chèque",k:"Financement",y:[1933,1944],p:3,c:()=>dispo("reich")&&!signed("sdn"),
 x:"Le ministère de l'Économie du Reich propose trente-deux milliards — davantage que tout ce que l'Institut a vu passer depuis sa fondation. En échange, l'Institut devient un organe d'État, les turbines seront allemandes et exclusivement allemandes, et la tour de Behrens portera un autre nom. Sörgel, lui, y voit la reconnaissance qu'il attendait depuis 1928.",
 o:[["Signer","+32 Md · soutien +16 · opinion −30",()=>{E.m(32);E.s(16);E.o(-30);E.a("UK",-18);E.a("FR",-14);E.f("collab");
     sign("reich","Allemagne du Reich","l'Institut est un organe du Reich ; les turbines sont allemandes et elles seules","1945");}],
    ["Signer les seules turbines","+14 Md · soutien +7 · opinion −12",()=>{E.m(14);E.s(7);E.o(-12);
     sign("reich","Allemagne du Reich","exclusivité allemande sur les turbines ; l'Institut reste privé","1945");}],
    ["Refuser, et le dire à Sörgel","soutien −14 · opinion +16 · indépendance",()=>{E.s(-14);E.o(16);E.tr("sorgel",-20);E.f("noReich");
     E.port("Il a refusé le chèque du Reich en 1934, contre l'avis du maître. On le lui a rappelé à chaque exercice déficitaire.");}]]},

{id:"e_reich",t:"L'épuration",k:"Histoire",fy:1945,c:()=>signed("reich"),
 x:"Les commissions alliées ouvrent les livres de comptes des organismes qui ont traité avec le Reich. Les vôtres sont en ordre, ce qui est précisément le problème : tout y est, signé, daté, contresigné.",
 o:[["Tout produire, et répondre point par point — 8 Md","opinion +12 · soutien −10",()=>{E.m(-8);E.o(12);E.s(-10);
     close("reich","denoncee","Les contrats du Reich sont annulés. L'exclusivité des turbines tombe avec.");}],
    ["Charger Sörgel","opinion +8 · soutien −6 · fidélité −−",()=>{E.o(8);E.s(-6);E.tr("sorgel",-35);
     close("reich","denoncee","Les contrats du Reich sont annulés ; c'est le nom de Sörgel qui figure au procès-verbal.");
     E.port("En 1945, devant la commission, il a laissé porter à Sörgel ce qu'ils avaient signé ensemble.");}],
    ["Se taire et payer l'amende — 16 Md","opinion −8",()=>{E.m(-16);E.o(-8);
     close("reich","honoree","L'amende est payée, les contrats soldés. Le dossier reste ouvert quelque part.");}]]},

/* Moscou n'aborde pas tout le monde de la même façon. Un homme dont la
   Russie est une revanche reçoit la visite dès 1934 ; pour les autres,
   l'Amtorg attend d'avoir une raison commerciale, et arrive en 1937. */
{id:"b_urss",t:"L'ingénieur de l'Amtorg",k:"Financement",y:[1934,1939],p:3,
 c:()=>dispo("urss")&&!signed("vatican")&&(leans("russia","pos")||S.year>=1937),
 x:"Il est venu par Berlin, il a votre âge et votre accent, et il connaît le DnieproGES par cœur. L'URSS offre des ingénieurs, l'expertise du plan GOELRO et de l'argent par l'Amtorg. Trois conditions : une délégation soviétique dans les murs, une part de l'énergie vers l'Est — et, pour vous seul, un passeport rouge à la place du carnet vert.",
 o:[["Signer, passeport compris","+16 Md · soutien −12 · opinion −8 · le passeport",()=>{E.m(16);E.s(-12);E.o(-8);E.tr("russia",25);E.f("passeport");
     sign("urss","URSS","une délégation soviétique dans les murs, une part de l'énergie vers l'Est, un passeport pour Morev","1939");
     E.port("Il a cessé d'être apatride en 1936, à Munich, en signant un contrat avec Moscou.");}],
    ["Signer, sans le passeport","+16 Md · soutien −12 · opinion −8",()=>{E.m(16);E.s(-12);E.o(-8);
     sign("urss","URSS","une délégation soviétique dans les murs, une part de l'énergie vers l'Est","1939");}],
    ["Refuser","deuil",()=>{E.tr("russia",-20);E.f("noUrss");
     E.port("On lui a proposé un passeport soviétique une fois. Il a dit non, et il n'en a jamais reparlé.");}]]},

{id:"e_urss",t:"Le pacte",k:"Histoire",fy:1939,c:()=>signed("urss"),
 x:"Ribbentrop et Molotov signent à Moscou le 23 août. Vos deux principaux appuis viennent de se partager la Pologne, et votre délégation soviétique loge à trois rues du bureau où l'on rédige les contrats allemands.",
 o:[["Renvoyer la délégation","URSS −25 · opinion +10",()=>{E.s(-6);E.o(10);
     close("urss","denoncee","La délégation soviétique quitte Munich en vingt-quatre heures. Le passeport, s'il a été délivré, reste valide.");}],
    ["Les garder, et se taire","soutien −14 · opinion −10",()=>{E.s(-14);E.o(-10);E.tr("russia",15);}],
    ["Les faire passer en Suisse — 5 Md","opinion +16 · santé −4",()=>{E.m(-5);E.o(16);E.vie(-4);
     close("urss","honoree","Onze ingénieurs soviétiques passent en Suisse avec des papiers de l'Institut. Personne n'a jamais écrit qui les avait signés.");
     E.port("En 1939, il a fait passer onze ingénieurs soviétiques en Suisse avec des papiers de l'Institut.");}]]},

/* ==================================================== L'ARGENT PRIVÉ */

{id:"b_rhenan",t:"Le consortium rhénan",k:"Financement",y:[1930,1958],p:3,c:()=>dispo("rhenan"),
 x:"Ciment, aciers spéciaux, turbines Kaplan : quatre maisons de la Ruhr et de Bâle se présentent ensemble, avec un contrat déjà rédigé. Quatorze milliards et du matériel à prix coûtant, contre l'exclusivité des machines et l'assurance que Gibraltar passe avant tout le reste — c'est là que vont les turbines.",
 o:[["Signer","+14 Md · matériel · Gibraltar −15 %",()=>{E.m(14);S.projMul.gib=Math.min(S.projMul.gib??1,0.85);S.costMul*=0.94;
     sign("rhenan","Consortium rhénan","exclusivité des turbines ; Gibraltar avant tout autre ouvrage","1951");}],
    ["Négocier une exclusivité de dix ans","+9 Md",()=>{E.m(9);S.costMul*=0.97;
     sign("rhenan","Consortium rhénan","exclusivité des turbines jusqu'en 1945 ; les autres ouvrages restent libres","1951");}],
    ["Appel d'offres ouvert","coûts +6 % · opinion +8",()=>{S.costMul*=1.06;E.o(8);E.f("noRhenan");}]]},

{id:"e_rhenan",t:"La question du cartel",k:"Économie",fy:1951,c:()=>signed("rhenan"),
 x:"La Haute Autorité de la CECA examine les ententes du charbon et de l'acier. Votre clause d'exclusivité, signée avant la guerre avec des maisons qui ont fourni le Reich, arrive sur la table d'un juriste luxembourgeois qui a tout son temps.",
 o:[["Rompre l'exclusivité","coûts −4 % · Rhénans −· opinion +10",()=>{S.costMul*=0.96;E.o(10);E.s(-5);
     close("rhenan","denoncee","L'exclusivité rhénane est rompue. Les turbines repassent en appel d'offres.");}],
    ["Plaider l'antériorité — 6 Md","opinion −6 · soutien +6",()=>{E.m(-6);E.o(-6);E.s(6);}],
    ["Transférer le contrat à une filiale suisse","opinion −14 · coûts −2 %",()=>{E.o(-14);S.costMul*=0.98;E.tr("ideal",-12);}]]},

{id:"b_zurich",t:"La Bahnhofstrasse",k:"Financement",y:[1930,1980],p:3,c:()=>dispo("zurich"),
 x:"Les banques de Zurich ne proposent pas d'argent : elles proposent le marché. Elles placeront vos émissions et les garantiront, ce qui en fera baisser le taux d'un point et demi. En échange, sûretés de premier rang sur les terres émergées — celles qui n'existent pas encore — et un droit de regard sur toute décision qui rendrait l'ouvrage réversible.",
 o:[["Signer","garantie des émissions · veto sur la réversibilité",()=>{E.f("garant");E.f("veto");
     sign("zurich","Banques de Zurich","sûretés de premier rang sur les terres émergées ; veto sur toute décision réversible","—");}],
    ["Signer les seules sûretés","garantie des émissions · opinion −6",()=>{E.f("garant");E.o(-6);
     sign("zurich","Banques de Zurich","sûretés de premier rang sur les terres émergées","—");}],
    ["Refuser : l'Institut ne gage pas ce qui n'existe pas","opinion +10 · emprunts plus chers",()=>{E.o(10);E.f("noZurich");
     E.port("Il a refusé de gager des terres qui n'existaient pas encore. C'est la phrase qu'on a le plus citée de lui.");}]]},

/* ================================================= LES INSTITUTIONS */

{id:"b_sdn",t:"Genève",k:"Financement",y:[1930,1939],p:3,c:()=>dispo("sdn")&&!signed("reich"),
 x:"La Société des Nations n'a pas d'argent — six milliards, et encore, sur trois exercices. Elle a autre chose : le seul cadre au monde où un ouvrage à cheval sur trois continents puisse être dit légitime. La contrepartie tient en un mot : neutralité. L'ouvrage n'appartient à personne, et vous non plus.",
 o:[["Signer","+6 Md · opinion +20 · soutien +8 · aucun bailleur d'État",()=>{E.m(6);E.o(20);E.s(8);E.aa(Object.keys(nat),8);
     sign("sdn","Société des Nations","neutralité de l'ouvrage, internationalisation de la gestion","1939");}],
    ["Signer une déclaration d'intention seulement","opinion +8",()=>{E.o(8);E.aa(Object.keys(nat),3);}],
    ["Refuser","soutien +5",()=>{E.s(5);E.f("noSdn");}]]},

{id:"e_sdn",t:"Genève ferme",k:"Histoire",fy:1940,c:()=>signed("sdn"),
 x:"Le Palais des Nations est vide, le secrétariat replié à Princeton, et l'organisation qui garantissait votre neutralité n'existe plus que sur du papier à en-tête. La clause, elle, tient toujours : vous ne pouvez accepter aucun bailleur d'État.",
 o:[["Tenir la clause","opinion +18 · soutien −16 · aucun État",()=>{E.o(18);E.s(-16);E.f("neutre");
     E.port("Il a tenu la neutralité de l'Institut pendant toute la guerre, avec six milliards et une organisation morte pour caution.");}],
    ["La suspendre pour la durée de la guerre","opinion −14 · soutien +10",()=>{E.o(-14);E.s(10);
     close("sdn","denoncee","La clause de neutralité est suspendue « pour la durée des hostilités ». On ne l'a jamais rétablie.");}],
    ["La transférer à l'organisation qui viendra","opinion +10 · soutien −6",()=>{E.o(10);E.s(-6);E.f("onu");
     close("sdn","honoree","La clause de neutralité est mise en dépôt, à l'intention de ce qui remplacera la SDN.");}]]},

{id:"b_vatican",t:"Le Saint-Siège",k:"Financement",y:[1930,1975],p:2,c:()=>dispo("vatican")&&!signed("urss"),
 x:"Un monsignore vous reçoit sans façon. L'obole du denier de Saint-Pierre est modeste — quatre milliards — mais l'appui des diocèses méditerranéens ne s'achète pas. Une seule condition, jamais écrite : aucun bailleur sans Dieu ne figurera au grand livre à côté de nous.",
 o:[["Signer","+4 Md · opinion +16 · l'URSS exclue",()=>{E.m(4);E.o(16);E.aa(["IT","ES","FR"],10);
     sign("vatican","Le Vatican","œcuménisme du chantier ; aucun bailleur sans Dieu au grand livre","—");}],
    ["Accepter l'obole sans la condition","+4 Md · opinion +6",()=>{E.m(4);E.o(6);}],
    ["Décliner poliment","opinion −6",()=>{E.o(-6);E.f("noVatican");}]]},

{id:"b_marshall",t:"Le programme de relèvement",k:"Financement",y:[1948,1952],p:4,c:()=>dispo("marshall")&&!signed("urss"),
 x:"L'ECA propose vingt-huit milliards, en dollars, tout de suite. Les conditions sont celles de tout le monde : aucun soviétique dans les murs, comptabilité ouverte à Washington, et une part des marchés aux entreprises américaines. L'Europe entière signe ; refuser serait remarqué.",
 o:[["Signer","+28 Md · soutien +14 · Est fermé",()=>{E.m(28);E.s(14);E.a("UK",10);E.a("FR",10);
     if(signed("urss"))close("urss","denoncee","La délégation soviétique est priée de partir : le programme américain l'exige par écrit.");
     sign("marshall","Plan Marshall","aucun bailleur soviétique ; marchés réservés aux entreprises américaines","1953");}],
    ["Négocier une part réduite","+14 Md · soutien +7",()=>{E.m(14);E.s(7);
     sign("marshall","Plan Marshall","comptabilité ouverte à Washington ; part américaine des marchés","1953");}],
    ["Refuser","soutien −16 · opinion +8",()=>{E.s(-16);E.o(8);E.f("noMarshall");}]]},

{id:"e_marshall",t:"Atoms for Peace",k:"Histoire",fy:1954,c:()=>signed("marshall"),
 x:"Eisenhower propose à l'Assemblée générale de mettre l'atome civil à la disposition du monde. Le pays qui a financé votre chantier vient d'ouvrir un guichet où l'on donne des réacteurs — et vos comptes lui sont ouverts depuis 1948.",
 o:[["Demander un réacteur pour l'Institut","+10 Md · soutien +10 · opinion −10",()=>{E.m(10);E.s(10);E.o(-10);E.f("atomeUS");
     E.port("Il a demandé un réacteur américain en 1954. Ses ingénieurs ont mis dix ans à le lui pardonner.");}],
    ["Refuser, et défendre l'eau","soutien −12 · opinion +12",()=>{E.s(-12);E.o(12);E.f("eauSeule");
     E.port("En 1954, il a refusé l'atome américain. C'était la dernière fois qu'on lui offrait quelque chose sans contrepartie.");}],
    ["Faire chiffrer les deux, publiquement — 5 Md","opinion +8 · soutien −4",()=>{E.m(-5);E.o(8);E.s(-4);E.tr("ideal",-10);}]]},

/* ============================================ LES PUISSANCES COLONIALES */

{id:"b_france",t:"Le corps des Ponts",k:"Financement",y:[1930,1958],p:3,c:()=>dispo("france"),
 x:"Vos anciens camarades sont au ministère, et l'un d'eux dirige le cabinet. La France apporte son école, son réseau et douze milliards. Elle demande que la souveraineté de la rive sud ne soit jamais mise en discussion, et une part algérienne dans les terres émergées.",
 o:[["Signer","+12 Md · France +22 · Sud −12",()=>{E.m(12);E.a("FR",22);E.aa(SUD,-12);
     sign("france","France","souveraineté française sur la rive sud, part algérienne des terres émergées","1962");}],
    ["Signer sans la part algérienne","+7 Md · France +12",()=>{E.m(7);E.a("FR",12);E.aa(SUD,-4);
     sign("france","France","souveraineté française sur la rive sud","1962");}],
    ["Refuser au nom des signatures du sud","France −18 · Sud +16 · opinion +6",()=>{E.a("FR",-18);E.aa(SUD,16);E.o(6);E.tr("africa",20);E.f("noFrance");
     E.port("Il a refusé l'argent de son école pour ne pas signer que l'Afrique du Nord était française.");}]]},

{id:"e_france",t:"Les terres de la clause",k:"Histoire",fy:1958,fyEnd:1962,c:()=>signed("france"),
 x:"La guerre d'Algérie dure depuis quatre ans, et votre clause de 1930 attribue à la France une part des terres émergées — dont les premières se trouvent au large d'Oran. Les deux camps vous écrivent la même semaine, avec la même carte annotée.",
 o:[["Rendre la clause caduque","Sud +24 · France −20 · soutien −10",()=>{E.aa(SUD,24);E.a("FR",-20);E.s(-10);
     close("france","denoncee","La part algérienne est rendue caduque par décision du conseil de l'Institut.");}],
    ["S'en tenir au texte","France +14 · Sud −26 · opinion −12",()=>{E.a("FR",14);E.aa(SUD,-26);E.o(-12);E.tr("africa",-18);}],
    ["Mettre les terres sous séquestre jusqu'à la paix — 6 Md","opinion +14 · soutien −6",()=>{E.m(-6);E.o(14);E.s(-6);
     E.port("Il a mis les terres d'Oran sous séquestre en 1958, en attendant de savoir à qui elles seraient.");}]]},

{id:"b_amiraute",t:"Le Rocher",k:"Financement",y:[1930,1954],p:3,c:()=>dispo("amiraute"),
 x:"L'Amirauté ne finance pas : elle autorise. Sans elle, aucun barrage ne se pose au détroit, et son prix est une écluse militaire de trois cents mètres, entretenue par vos soins, dont elle seule décide de l'usage.",
 o:[["Signer","Royaume-Uni +26 · coût de Gibraltar +8 %",()=>{E.a("UK",26);S.projMul.gib=(S.projMul.gib??1)*1.08;
     sign("amiraute","Amirauté britannique","une écluse militaire de 300 m, à l'usage exclusif de la Royal Navy","1956");}],
    ["Signer une écluse civile partagée","Royaume-Uni +12 · coût +4 %",()=>{E.a("UK",12);S.projMul.gib=(S.projMul.gib??1)*1.04;
     sign("amiraute","Amirauté britannique","une écluse de 300 m, usage partagé civil et militaire","1956");}],
    ["Refuser","Royaume-Uni −24",()=>{E.a("UK",-24);E.f("noAmiraute");}]]},

{id:"e_amiraute",t:"Suez, et le Rocher",k:"Histoire",fy:1956,c:()=>signed("amiraute"),
 x:"Français et Britanniques débarquent à Port-Saïd, puis reculent sous la pression américaine. Pendant l'opération, votre écluse militaire de Gibraltar a laissé passer une flotte — la clause le permettait, et personne ne vous a demandé votre avis.",
 o:[["Exiger la restitution de l'écluse","Royaume-Uni −22 · opinion +16",()=>{E.a("UK",-22);E.o(16);
     close("amiraute","denoncee","L'écluse militaire repasse sous contrôle de l'Institut. Londres proteste par note verbale.");}],
    ["Ne rien dire","opinion −14 · Sud −16",()=>{E.o(-14);E.aa(SUD,-16);}],
    ["Internationaliser l'écluse — 7 Md","opinion +18 · Royaume-Uni −10 · soutien −6",()=>{E.m(-7);E.o(18);E.a("UK",-10);E.s(-6);
     close("amiraute","honoree","L'écluse de Gibraltar passe sous statut international, comme le canal qu'on vient de se disputer.");}]]},
];

/* La saisie d'un ouvrage — la fin « l'ouvrage confisqué » — n'a qu'une porte
   pour l'instant : une clause d'État tenue jusqu'au bout dans un pays en
   guerre. Le moteur d'histoire alternative en ouvrira d'autres. */
function saisie(quoi) {
  S.flags.saisi = true;
  log(`SAISIE. ${quoi} L'Institut n'est plus maître de son ouvrage.`, 'big');
}

export { BACKERS, saisie };
