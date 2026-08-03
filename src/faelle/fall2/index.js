/**
 * FALL 2 — „Der Chor".
 *
 * Dieselbe Form wie Fall 1: Orte, Sektoren, Figuren, Loesung, Meldungen. Die
 * Mechanik in src/game/ musste dafuer nicht angefasst werden — genau dafuer
 * war der Umbau auf das Fallformat da. Auch nicht fuer die zweite Fassung:
 * aus sieben Orten wurden achtzehn, aus vier Figuren neun, und aus einem Fall
 * ueber unbezahlte Nachtarbeit einer darueber, wofuer sie geleistet wurde.
 * Geaendert hat sich dabei kein einziger Aufruf im Spiel.
 */

import { ORTE } from './orte.js';
import { SEKTOREN } from './sektoren.js';
import { FIGUREN } from './figuren.js';
import { LOESUNG, PRAEMISSE } from './loesung.js';
import { MELDUNGEN } from './meldungen.js';

export const FALL = {
  id: 'fall-2',
  titel: 'Der Chor',
  start: 'f2-becken',
  praemisse: PRAEMISSE,
  orte: ORTE,
  sektoren: SEKTOREN,
  figuren: FIGUREN,
  loesung: LOESUNG,
  meldungen: MELDUNGEN,
};
