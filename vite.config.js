import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  server: { host: '127.0.0.1', port: 5173 },
  build: {
    target: 'es2022',
    assetsInlineLimit: 0,
  },
  // .glsl wird als String importiert (?raw), Includes lösen wir selbst auf.
  assetsInclude: ['**/*.glsl'],
});
