/**
 * Backticks in den CSS-Bloecken finden, bevor der Build daran scheitert.
 *
 * Die Oberflaechen-Dateien halten ihr CSS in einem Template-Literal. Ein
 * Backtick in einem Kommentar darin beendet die Zeichenkette mitten im Text —
 * der Build bricht dann mit „Expected a semicolon" ab und nennt nur die Datei,
 * nicht die Zeile.
 *
 * Das ist in diesem Projekt DREIMAL passiert (viewport.js, zweimal
 * interaction.js), jedes Mal in einem Kommentar, in dem ein Bezeichner in
 * Backticks gesetzt wurde. Zweimal davon ist der Fehler unbemerkt geblieben,
 * weil die Build-Ausgabe abgeschnitten war und die Vorschau auf einem alten
 * Buendel weiterlief — es wurde also eine Weile lang etwas anderes getestet,
 * als im Quelltext stand.
 *
 * Laeuft in Millisekunden und sagt Datei UND Zeile.
 *
 *   node tools/css-pruefen.mjs
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

function dateien(ordner) {
  const out = [];
  for (const n of readdirSync(ordner)) {
    const pfad = join(ordner, n);
    if (statSync(pfad).isDirectory()) out.push(...dateien(pfad));
    else if (n.endsWith('.js')) out.push(pfad);
  }
  return out;
}

let schlecht = 0;
for (const pfad of dateien('src')) {
  const zeilen = readFileSync(pfad, 'utf8').split('\n');
  let drin = false;
  zeilen.forEach((z, i) => {
    // Nur der CSS-Block auf oberster Ebene: `const CSS = \`` bis `\`;` am
    // Zeilenanfang. Die erste Fassung nahm JEDES mehrzeilige Literal — auch
    // `el.innerHTML = \``, das nie am Zeilenanfang schliesst — und meldete
    // daraufhin 62 Stellen, von denen keine ein Fehler war. Ein Pruefer, der
    // faelschlich anschlaegt, wird abgeschaltet und nuetzt dann gar nichts.
    if (!drin && /^const \w*CSS\w* = `\s*$/.test(z)) { drin = true; return; }
    if (drin && /^`;\s*$/.test(z)) { drin = false; return; }
    if (drin && z.includes('`')) {
      console.log(`FEHL  ${pfad}:${i + 1}  Backtick im CSS-Literal`);
      console.log(`      ${z.trim().slice(0, 96)}`);
      schlecht += 1;
    }
  });
  if (drin) { console.log(`FEHL  ${pfad}  CSS-Literal wird nie geschlossen`); schlecht += 1; }
}
console.log(schlecht ? `\n${schlecht} Stelle(n).` : 'ok    Keine Backticks in CSS-Literalen.');
process.exit(schlecht ? 1 : 0);
