import { defineConfig, loadEnv } from 'vite';
import { execSync } from 'node:child_process';
import { askModel } from './api/chat.js';

/**
 * Welche Fassung laeuft da eigentlich?
 *
 * Gemeldet wurde ein Fehler, der zu dem Zeitpunkt schon behoben und
 * veroeffentlicht war — nur lief im Browser noch die alte Seite. Das liess
 * sich von aussen nicht unterscheiden: Ein Bildschirmfoto sieht gleich aus,
 * egal welches Buendel dahintersteckt.
 *
 * Deshalb steht die Kennung des Standes jetzt IM SPIEL, in der Hilfezeile
 * unter dem Fragezeichen. Damit beantwortet ein Bildschirmfoto die Frage
 * „veroeffentlicht oder nur im Zwischenspeicher?" von selbst.
 */
function fassung() {
  const versuche = [
    () => execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(),
    // Auf Vercel gibt es kein vollstaendiges Arbeitsverzeichnis, aber die
    // Umgebung nennt den Commit.
    () => (process.env.VERCEL_GIT_COMMIT_SHA || '').slice(0, 7),
  ];
  for (const v of versuche) { try { const s = v(); if (s) return s; } catch { /* weiter */ } }
  return 'lokal';
}

/**
 * Im Entwicklungsbetrieb bildet dieses Plugin denselben Endpunkt nach, den
 * Vercel später als Serverless-Funktion bereitstellt. Dadurch läuft lokal und
 * veröffentlicht derselbe Code — und der API-Schlüssel bleibt in beiden Fällen
 * auf der Serverseite, statt im Browser-Bündel zu landen.
 */
function chatEndpoint(env) {
  const middleware = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    if (req.method !== 'POST') {
      res.statusCode = 405;
      res.end(JSON.stringify({ error: 'Nur POST.' }));
      return;
    }
    const key = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!key) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: 'GEMINI_API_KEY fehlt in .env' }));
      return;
    }
    let raw = '';
    for await (const chunk of req) raw += chunk;
    try {
      const out = await askModel(JSON.parse(raw || '{}'), key);
      res.statusCode = out.status;
      res.end(JSON.stringify(out.json));
    } catch (e) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: String(e?.message || e) }));
    }
  };

  return {
    name: 'regenstadt-chat',
    // Beides: `configureServer` gilt nur fuer `vite dev`. Ohne
    // `configurePreviewServer` fehlt der Endpunkt in `vite preview` — und
    // genau darueber laufen die Screenshot-Pruefungen.
    configureServer(server) { server.middlewares.use('/api/chat', middleware); },
    configurePreviewServer(server) { server.middlewares.use('/api/chat', middleware); },
  };
}

export default defineConfig(({ mode }) => {
  // Drittes Argument leer: auch Variablen ohne VITE_-Präfix laden. Die landen
  // NICHT im Bündel — sie werden nur hier im Node-Prozess benutzt.
  const env = loadEnv(mode, process.cwd(), '');
  return {
    base: './',
    server: { host: '127.0.0.1', port: 5173 },
    preview: { host: '127.0.0.1', port: 4173 },
    build: { target: 'es2022', assetsInlineLimit: 0 },
    assetsInclude: ['**/*.glsl'],
    define: {
      __FASSUNG__: JSON.stringify(fassung()),
      __GEBAUT__: JSON.stringify(new Date().toISOString().slice(0, 16).replace('T', ' ')),
    },
    plugins: [chatEndpoint(env)],
  };
});
