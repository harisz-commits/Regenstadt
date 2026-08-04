/**
 * Misst, wie viele BRAUCHBARE Vorschlagsfragen zurueckkommen — bei voller Akte.
 *
 * Gemeldet aus dem Spiel: Mitten in Fall 2 war ploetzlich aus JEDER Figur
 * „gerade nichts mehr herauszuholen", auch aus denen, die man eben erst
 * getroffen hatte. Der Verdacht faellt zuerst auf das Verhoer. Er ist falsch:
 * Das Modell hat nie versagt, es hat nie die Regeln zu sehen bekommen.
 *
 * Die Anweisung waechst mit der Akte, und die Serverfunktion schnitt sie
 * hinten ab — dort, wo steht, in welcher Form zu antworten ist. Das Modell
 * schrieb Prosa, der Parser fand null Zeilen, das Spiel meldete eine
 * erschoepfte Figur.
 *
 * GEMESSEN, als die Reparatur entstand — dieselben drei Figuren, dieselbe
 * volle Akte, derselbe Endpunkt:
 *
 *   vorher:  Anweisung 25010 Zeichen, davon 13010 abgeschnitten → 0 Fragen
 *   jetzt:   Anweisung  6454 Zeichen, nichts abgeschnitten      → 4 Fragen
 *
 * Dieses Werkzeug haelt den zweiten Zustand fest: Es baut die Anweisung mit
 * der VOLLEN Akte des Falls und zaehlt, wie viele Zeilen der Parser aus
 * talk.js als Frage durchlaesst. Null waere der gemeldete Fehler.
 *
 *   npm run build && npx vite preview --port 4173
 *   node tools/fragen-messen.mjs [--fall fall-2]
 */

import { FAELLE, setzeFall, fall } from '../src/game/fall.js';
import { buildFragen } from '../src/game/characters.js';

const argv = process.argv.slice(2);
const arg = (n, d) => { const i = argv.indexOf('--' + n); return i === -1 ? d : argv[i + 1]; };
const url = arg('url', 'http://127.0.0.1:4173') + '/api/chat';
const fallId = arg('fall', 'fall-2');

setzeFall(fallId);
const F = fall();

let schlecht = 0;
const ok = (b, t) => { if (!b) schlecht++; console.log(`${b ? 'ok  ' : 'FEHL'}  ${t}`); };

/** Die vollstaendige Akte dieses Falls — der Zustand kurz vor der Anklage. */
const akte = [];
for (const o of Object.values(F.orte)) {
  for (const s of o.spots) {
    if (s.kind === 'exit' || !s.text) continue;
    akte.push({ label: s.label, text: s.text });
    if (s.item) akte.push({ label: s.item.name, text: s.item.text });
  }
}

/** Genau die Regeln, nach denen talk.js eine Zeile als Frage durchlaesst. */
function brauchbare(roh) {
  const out = [];
  for (const zeile of String(roh).split('\n')) {
    const m = zeile.trim().match(/^([-!–—•*])\s*(.+)$/);
    if (!m) continue;
    const text = m[2].replace(/^["„»]|["“«]$/g, '').trim();
    if (text.length < 9 || text.length > 130 || !/[?？]$/.test(text)) continue;
    out.push(text);
  }
  return out;
}

async function frag(anweisung) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system: anweisung,
      messages: [{ role: 'user', text: 'Schreib die Fragen.' }],
      denken: 'minimal',
      max: 900,
    }),
  });
  const data = await res.json().catch(() => ({}));
  return brauchbare(data.text || '');
}

console.log(`\n${F.titel}: ${akte.length} Akteneinträge — der Zustand, in dem der Fehler auftrat.\n`);

for (const c of Object.values(F.figuren).slice(0, 3)) {
  const anweisung = buildFragen(c, akte, 'Irgendwo im Sektor', [], [], []);
  const fragen = await frag(anweisung);
  console.log(`  ${c.name} — Anweisung ${anweisung.length} Zeichen → `
            + `${fragen.length} brauchbare Fragen`);
  if (fragen[0]) console.log(`     z. B. „${fragen[0]}"`);
  ok(fragen.length >= 3, `${c.name}: Fragen kommen bei voller Akte an (${fragen.length})`);
}

setzeFall(FAELLE[0].id);
console.log(schlecht ? `\n${schlecht} Fehler.` : '\nAlles gruen.');
process.exit(schlecht ? 1 : 0);
