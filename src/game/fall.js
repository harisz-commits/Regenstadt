/**
 * Welcher Fall gerade läuft.
 *
 * Bis hierher steckte Fall 1 in der Mechanik: Orte, Figuren und Lösung lagen
 * in denselben Dateien wie das Spiel, das sie benutzt. Ein zweiter Fall hätte
 * bedeutet, alles zu verdoppeln — und jede spätere Änderung an der Mechanik
 * zweimal zu machen.
 *
 * Jetzt ist ein Fall reine DATEN unter `src/faelle/<name>/`, und diese Datei
 * sagt, welcher davon gilt. Die Mechanik weiß nicht, welchen sie spielt.
 *
 * DER KNIFF SIND LEBENDE BINDUNGEN.
 *
 * `scenes.js`, `districts.js`, `characters.js` und `anklage.js` führen ihre
 * Daten als `export let` aus und setzen sie beim Fallwechsel neu. ES-Module
 * geben Ausfuhren als lebende Bindung weiter — jeder Importeur sieht die neuen
 * Daten, ohne dass eine einzige Importzeile geändert werden muss. Deshalb hat
 * dieser Umbau keine Aufrufstelle im Spiel angefasst.
 *
 * Ein später vom Modell erzeugter Fall ist genau dasselbe: ein Objekt dieser
 * Form. Es muss dafür nichts nachgebaut werden, was es hier nicht schon gibt.
 *
 * @typedef {{
 *   id: string, titel: string, start: string, praemisse: string,
 *   orte: object, sektoren: object, figuren: object, loesung: object,
 * }} Fall
 */

import { FALL as FALL1 } from '../faelle/fall1/index.js';
import { FALL as FALL2 } from '../faelle/fall2/index.js';
import { FALL as FALL3 } from '../faelle/fall3/index.js';

/** Alle Fälle, in Spielreihenfolge. */
export const FAELLE = [FALL1, FALL2, FALL3];

/** @type {Fall} */
let aktiv = FAELLE[0];

/** Der laufende Fall. */
export const fall = () => aktiv;

/** @type {Set<() => void>} */
const hoerer = new Set();

/** Wird gerufen, nachdem ein anderer Fall gesetzt wurde. */
export function beiFallwechsel(f) { hoerer.add(f); return () => hoerer.delete(f); }

/**
 * Einen anderen Fall setzen.
 *
 * Die Zuhörer laufen in Anmeldereihenfolge, und die Sichten (`scenes.js` und
 * die anderen) melden sich beim Laden ihres Moduls an — also VOR dem Spiel.
 * Damit stehen die neuen Daten, bevor irgendetwas sie liest.
 */
export function setzeFall(id) {
  const neu = FAELLE.find((f) => f.id === id);
  if (!neu || neu === aktiv) return false;
  aktiv = neu;
  for (const f of hoerer) f();
  return true;
}

/** Der Fall danach — oder nichts, wenn dieser der letzte ist. */
export function naechsterFall() {
  const i = FAELLE.indexOf(aktiv);
  return i >= 0 && i + 1 < FAELLE.length ? FAELLE[i + 1] : null;
}
