/**
 * Die konkreten Versprechen von Fall 3 festhalten.
 *
 *   node tools/fall3-pruefen.mjs
 */

import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { FAELLE } from '../src/game/fall.js';

let schlecht = 0;
const ok = (b, t) => { if (!b) schlecht++; console.log(`${b ? 'ok  ' : 'FEHL'}  ${t}`); };

const F3 = FAELLE.find((f) => f.id === 'fall-3');
const vorher = FAELLE.filter((f) => f.id !== 'fall-3');
ok(Boolean(F3), 'Fall 3 ist registriert');

if (F3) {
  const orte = Object.values(F3.orte);
  const sektoren = Object.values(F3.sektoren);
  const alteIds = new Set(vorher.flatMap((f) => Object.keys(f.orte)));
  const alteNamen = new Set(vorher.flatMap((f) => Object.values(f.orte).map((o) => o.name)));
  const altePlatten = new Set(vorher.flatMap((f) => Object.values(f.orte).map((o) => o.backdrop)));

  ok(orte.length >= 20, `Mindestens 20 Orte (${orte.length})`);
  ok(sektoren.length >= 7, `Mindestens 7 anfliegbare Sektoren (${sektoren.length})`);
  ok(new Set(sektoren.map((s) => s.arrival)).size >= 7,
     `Mindestens 7 verschiedene Flugziele (${new Set(sektoren.map((s) => s.arrival)).size})`);
  ok(orte.every((o) => !alteIds.has(o.id)), 'Keine Ortskennung aus Fall 1 oder 2 wiederverwendet');
  ok(orte.filter((o) => alteNamen.has(o.name)).length <= 2,
     'Höchstens zwei bekannte Orte wiederverwendet');
  ok(orte.every((o) => !altePlatten.has(o.backdrop)), 'Keine alte Ortsplatte wiederverwendet');

  const platten = [...new Set(orte.map((o) => o.backdrop))];
  ok(platten.length === orte.length,
     `Jeder der ${orte.length} Orte hat eine eigene Kulisse (${platten.length})`);
  for (const p of platten) {
    const da = ['jpg', 'png'].some((ext) => existsSync(join('public', 'plates', `${p}.${ext}`)));
    ok(da, `Bilddatei für „${p}" vorhanden`);
  }

  const fremdText = JSON.stringify({ orte: F3.orte, praemisse: F3.praemisse }).toLowerCase();
  ok(fremdText.includes('außerird') || fremdText.includes('nicht menschlich'),
     'Die außerirdische Herkunft steht im spielbaren Inhalt');
  ok(fremdText.includes('schwarzes glas') && fremdText.includes('maschine'),
     'Die sichtbare Technologie ist als wiederkehrendes Motiv verankert');
}

console.log(schlecht ? `\n${schlecht} Fehler.` : '\nAlles gruen.');
process.exit(schlecht ? 1 : 0);
