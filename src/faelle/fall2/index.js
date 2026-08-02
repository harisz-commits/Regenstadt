/**
 * FALL 2 — „Die zweite Schicht".
 *
 * Dieselbe Form wie Fall 1: Orte, Sektoren, Figuren, Loesung, Meldungen. Die
 * Mechanik in src/game/ musste dafuer nicht angefasst werden — genau dafuer
 * war der Umbau auf das Fallformat da.
 */

import { ORTE } from './orte.js';
import { SEKTOREN } from './sektoren.js';
import { FIGUREN } from './figuren.js';
import { LOESUNG, PRAEMISSE } from './loesung.js';
import { MELDUNGEN } from './meldungen.js';

export const FALL = {
  id: 'fall-2',
  titel: 'Die zweite Schicht',
  start: 'f2-becken',
  praemisse: PRAEMISSE,
  orte: ORTE,
  sektoren: SEKTOREN,
  figuren: FIGUREN,
  loesung: LOESUNG,
  meldungen: MELDUNGEN,
};
