/**
 * Platten von Gemini übermalen lassen.
 *
 * Kernidee: NICHT aus einem Textprompt heraus generieren. Ein frei erzeugtes
 * Bild hat eine unbekannte Perspektive, und damit brechen Spiegelung,
 * Tiefenrückrechnung und später jeder Hotspot in der Szene.
 *
 * Stattdessen geht der prozedurale Render als Bildvorlage hinein und wird
 * übermalt. Horizont, Fluchtpunkt und Geometrie bleiben erhalten — die
 * gesamte Mathematik im Renderer funktioniert weiter.
 *
 *   node tools/gen.mjs --in shots/x.png --out plates/x.png --prompt prompts/street.txt
 *
 * Der Aufruf läuft über `curl`, nicht über fetch: Node 22 beachtet
 * HTTPS_PROXY in fetch noch nicht, curl schon.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, unlinkSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { tmpdir } from 'node:os';

const argv = process.argv.slice(2);
const arg = (n, d) => {
  const i = argv.indexOf('--' + n);
  return i === -1 ? d : argv[i + 1];
};

const inPath = resolve(arg('in', 'shots/05-warme-palette-props.png'));
const outPath = resolve(arg('out', 'plates/out.png'));
const promptPath = arg('prompt', null);
const model = arg('model', 'gemini-3-pro-image');
const aspect = arg('aspect', '16:9');
const inlinePrompt = arg('text', null);

// --- Schlüssel ------------------------------------------------------------
let key = process.env.GEMINI_API_KEY;
if (!key && existsSync('.env')) {
  const m = readFileSync('.env', 'utf8').match(/^GEMINI_API_KEY=(.+)$/m);
  if (m) key = m[1].trim();
}
if (!key) {
  console.error('GEMINI_API_KEY fehlt (Umgebungsvariable oder .env).');
  process.exit(1);
}

// --- Prompt ---------------------------------------------------------------
const prompt = inlinePrompt ?? (promptPath ? readFileSync(promptPath, 'utf8') : null);
if (!prompt) {
  console.error('Kein Prompt: --prompt <datei> oder --text "…" angeben.');
  process.exit(1);
}

// --- Anfrage --------------------------------------------------------------
const b64 = readFileSync(inPath).toString('base64');
const body = {
  contents: [{
    parts: [
      { inline_data: { mime_type: 'image/png', data: b64 } },
      { text: prompt },
    ],
  }],
  generationConfig: {
    responseModalities: ['IMAGE'],
    imageConfig: { aspectRatio: aspect },
  },
};

const bodyFile = `${tmpdir()}/gen-body-${process.pid}.json`;
const respFile = `${tmpdir()}/gen-resp-${process.pid}.json`;
writeFileSync(bodyFile, JSON.stringify(body));

console.log(`→ ${model}  (${(b64.length / 1.4e6).toFixed(1)} MB Vorlage)`);
const t0 = Date.now();

try {
  execFileSync('curl', [
    '-sS', '--max-time', '600',
    '-X', 'POST',
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    '-H', `x-goog-api-key: ${key}`,
    '-H', 'Content-Type: application/json',
    '--data-binary', `@${bodyFile}`,
    '-o', respFile,
  ], { stdio: ['ignore', 'inherit', 'inherit'] });
} finally {
  unlinkSync(bodyFile);
}

// --- Antwort auswerten ----------------------------------------------------
const raw = readFileSync(respFile, 'utf8');
unlinkSync(respFile);

let json;
try {
  json = JSON.parse(raw);
} catch {
  console.error('Antwort war kein JSON:\n' + raw.slice(0, 800));
  process.exit(1);
}

if (json.error) {
  console.error(`API-Fehler ${json.error.code}: ${json.error.message}`);
  process.exit(1);
}

const cand = json.candidates?.[0];
if (!cand) {
  console.error('Keine Kandidaten. Antwort:\n' + JSON.stringify(json, null, 2).slice(0, 1200));
  process.exit(1);
}
if (cand.finishReason && cand.finishReason !== 'STOP') {
  console.error(`Abbruchgrund: ${cand.finishReason}`);
}

const parts = cand.content?.parts || [];
const img = parts.find((p) => p.inlineData || p.inline_data);
for (const p of parts) if (p.text) console.log('   Modell: ' + p.text.trim().slice(0, 300));

if (!img) {
  console.error('Kein Bild in der Antwort:\n' + JSON.stringify(json, null, 2).slice(0, 1200));
  process.exit(1);
}

const data = (img.inlineData || img.inline_data).data;
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, Buffer.from(data, 'base64'));

const kb = (Buffer.from(data, 'base64').length / 1024).toFixed(0);
console.log(`✓ ${outPath}  (${kb} kB, ${((Date.now() - t0) / 1000).toFixed(1)} s)`);
