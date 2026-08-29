/* Drapeaux de rafraîchissement partagés par la simulation, le rendu et l'IHM.
   Un objet plutôt que deux `let` : un binding importé n'est pas réassignable. */
export const dirty = { base: true, ui: false };
