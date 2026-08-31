import { S } from './state.js';
import { emit } from './bus.js';

/* Années par seconde. C'est une constante du modèle et non de l'affichage :
   la boucle d'animation s'en sert pour avancer le temps, `ui/hud.js` n'en
   tire que l'étiquette « 1 an ≈ 29 s ». */
export const SPEEDS = [0, 0.035, 0.10, 0.30];

/* Un seul chemin pour changer de vitesse, donc une seule annonce. Un dossier
   qui met le jeu en pause et un bouton cliqué passent par ici, et les quatre
   boutons se remettent à jour tout seuls. */
export function setSpeed(v) {
  if (S.speed === v) return;
  S.speed = v;
  emit('speed', { speed: v });
}
