import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  server: { open: true },
  build: {
    target: 'es2022',
    // Le jeu tient dans un seul bundle : pas de découpage utile, et un
    // fichier unique reste dans l'esprit du projet d'origine.
    chunkSizeWarningLimit: 1600,
  },
});
