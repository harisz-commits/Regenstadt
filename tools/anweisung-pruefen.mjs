/**
 * Prueft, dass keine Anweisung an das Modell zu lang wird.
 *
 * DER FEHLER, DEN ES DAFUER GAB.
 *
 * Gemeldet aus dem Spiel: Mitten in Fall 2 war ploetzlich aus JEDER Figur
 * „gerade nichts mehr herauszuholen" — auch aus denen, die man eben erst
 * getroffen hatte. Das sah nach einem Fehler im Verhoer aus. Es war einer in
 * der Laenge:
 *
 *     10 Akteneintraege →  4709 Zeichen Anweisung
 *     40 Akteneintraege → 11762 Zeichen
 *     84 Akteneintraege → 22445 Zeichen
 *
 * Die Serverfunktion schneidet die Anweisung bei einer festen Marke ab, und
 * zwar HINTEN — genau dort, wo steht, in welcher Form das Modell antworten
 * soll. Ab rund vierzig Eintraegen kam der Absatz nicht mehr an, das Modell
 * schrieb Prosa statt Frageziielen, der Parser fand null brauchbare Zeilen,
 * und das Spiel meldete eine erschoepfte Figur.
 *
 * WARUM DAS KEIN SPIELTEST GEFUNDEN HAT: Alle Verhoerpruefungen laufen mit
 * einer kleinen Akte. Der Fehler beginnt erst, wenn man lange gespielt hat —
 * also genau dann, wenn eine Pruefung ihn am wenigsten sehen kann.
 *
 * Deshalb rechnet dieses Werkzeug mit dem SCHLIMMSTEN Fall: jede Figur jedes
 * Falls, die vollstaendige Akte, ein voller Gespraechsverlauf und eine lange
 * Liste schon gestellter Fragen. Es braucht kein Modell und keinen Browser und
 * laeuft in Millisekunden.
 *
 *   node tools/anweisung-pruefen.mjs
 */

import { FAELLE, setzeFall, fall } from '../src/game/fall.js';
import { buildFragen, buildSystem } from '../src/game/characters.js';

/** Muss zur Schranke in api/chat.js passen. */
const SCHRANKE = 20000;
/** Mit Abstand: Wer knapp darunter liegt, faellt beim naechsten Satz um. */
const WARNUNG = 14000;

let schlecht = 0;
const ok = (b, t) => { if (!b) schlecht++; console.log(`${b ? 'ok  ' : 'FEHL'}  ${t}`); };

for (const F of FAELLE) {
  setzeFall(F.id);
  console.log(`\n=== ${F.id} · ${F.titel} ===`);

  /* Die vollstaendige Akte: alles, was man in diesem Fall abheften kann. */
  const akte = [];
  for (const o of Object.values(fall().orte)) {
    for (const s of o.spots) {
      if (s.kind === 'exit' || !s.text) continue;
      akte.push({ label: s.label, text: s.text });
      if (s.item) akte.push({ label: s.item.name, text: s.item.text });
    }
  }

  /* Ein Gespraechsverlauf, wie er nach neun Fragen aussieht — mit Antworten
     an der Obergrenze dessen, was das Modell liefern darf. */
  const verlauf = Array.from({ length: 18 }, (_, i) => ({
    role: i % 2 ? 'model' : 'user',
    text: 'W'.repeat(i % 2 ? 1200 : 120),
  }));
  const gefragt = akte.map((n) => `Und was sagen Sie zu ${n.label}, ganz konkret und ohne Ausflüchte?`);

  let laengste = 0, wer = '';
  for (const c of Object.values(fall().figuren)) {
    const g = (c.spuren || []).map((s) => ({ id: s.id, was: s.was }));
    const f = buildFragen(c, akte, 'Ein Ort mit langem Namen', verlauf, gefragt, g).length;
    const s = buildSystem(c, akte, 'Ein Ort mit langem Namen', true, g).length;
    const m = Math.max(f, s);
    if (m > laengste) { laengste = m; wer = c.name; }
    ok(m < SCHRANKE, `${c.name}: Fragen ${f}, Antwort ${s} Zeichen`);
  }
  console.log(`  ${akte.length} Akteneinträge · längste Anweisung ${laengste} bei ${wer}`);
  ok(laengste < WARNUNG,
     `Abstand zur Schranke bleibt (${laengste} < ${WARNUNG}, abgeschnitten wird bei ${SCHRANKE})`);

  /* Und die Regeln muessen wirklich hinten stehen bleiben — die Probe darauf,
     dass die Kuerzung vorn ansetzt und nicht hinten. */
  const c0 = Object.values(fall().figuren)[0];
  const kurz = buildFragen(c0, akte.slice(0, 3), 'Ort', [], [], []);
  const lang = buildFragen(c0, akte, 'Ort', verlauf, gefragt, []);
  const schluss = kurz.slice(-200);
  ok(lang.endsWith(schluss), 'Die Regeln am Ende der Anweisung überleben eine volle Akte');
  ok(/weggelassen/.test(lang), 'Die Anweisung sagt offen, dass ältere Einträge fehlen');
}

setzeFall(FAELLE[0].id);
console.log(schlecht ? `\n${schlecht} Fehler.` : '\nAlles gruen.');
process.exit(schlecht ? 1 : 0);
