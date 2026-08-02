/**
 * FALL 1 — „Elf Totenscheine".
 *
 * Ein Fall ist DATEN und sonst nichts: Orte, Sektoren, Figuren, Loesung. Die
 * Spielmechanik in src/game/ liest ihn und weiss nicht, welcher Fall laeuft.
 * Ein zweiter Fall ist deshalb ein zweites Verzeichnis dieser Form — kein
 * zweiter Satz Mechanik, keine Abzweigung im Code.
 */

import { ORTE } from './orte.js';
import { SEKTOREN } from './sektoren.js';
import { FIGUREN } from './figuren.js';
import { LOESUNG, PRAEMISSE } from './loesung.js';

export const FALL = {
  id: 'fall-1',
  titel: 'Elf Totenscheine',
  /** Wo das Spiel beginnt. */
  start: 'alley',
  praemisse: PRAEMISSE,
  orte: ORTE,
  sektoren: SEKTOREN,
  figuren: FIGUREN,
  loesung: LOESUNG,
};
