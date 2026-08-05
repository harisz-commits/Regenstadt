/**
 * Die konkreten Versprechen von Fall 3 festhalten.
 *
 *   node tools/fall3-pruefen.mjs
 */

import { existsSync, statSync } from 'node:fs';
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
    const png = join('public', 'plates', `${p}.png`);
    ok(existsSync(png), `Verlustfreie Hauptkulisse für „${p}" vorhanden`);
    if (existsSync(png)) ok(statSync(png).size > 1024 * 1024, `Hauptkulisse „${p}" ist nicht stark komprimiert`);
  }

  const untersuchbar = orte.flatMap((ort) =>
    ort.spots.filter((spot) => spot.kind !== 'exit').map((spot) => ({ ort, spot })));
  const proOrt = orte.map((ort) => ort.spots.filter((spot) => spot.kind !== 'exit').length);
  ok(proOrt.every((n) => n >= 5), `Jeder Ort hat mindestens 5 Untersuchungen (Minimum ${Math.min(...proOrt)})`);
  ok(untersuchbar.length / orte.length >= 4.7,
     `Szenendichte entspricht Fall 1/2 (${(untersuchbar.length / orte.length).toFixed(1)} je Ort)`);
  ok(untersuchbar.every(({ spot }) => spot.detail || spot.detailFocus),
     `Jede der ${untersuchbar.length} Untersuchungen hat eine Bildreaktion`);
  ok(Object.values(F3.figuren).every((figur) => figur.portrait.startsWith('plates/f3-')),
     'Keine Figur aus Fall 1 oder 2 als Portraet wiederverwendet');

  const fremdText = JSON.stringify({ orte: F3.orte, praemisse: F3.praemisse }).toLowerCase();
  ok(fremdText.includes('außerird') || fremdText.includes('nicht menschlich'),
     'Die außerirdische Herkunft steht im spielbaren Inhalt');
  ok(fremdText.includes('schwarzes glas') && fremdText.includes('maschine'),
     'Die sichtbare Technologie ist als wiederkehrendes Motiv verankert');
}

console.log(schlecht ? `\n${schlecht} Fehler.` : '\nAlles gruen.');
process.exit(schlecht ? 1 : 0);
