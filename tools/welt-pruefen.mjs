/**
 * Prüft die Ermittlungslogik ohne Browser: Beweiskette, Sperren, Erreichbarkeit.
 *
 * Absichtlich ohne Renderer — diese Fehler sind Logikfehler, und ein
 * Screenshot zeigt sie nicht. Aufruf: node tools/welt-pruefen.mjs
 */
import { createWorld } from '../src/game/world.js';
import { SCENES } from '../src/game/scenes.js';
import { DISTRICTS, DISTRICT_IDS } from '../src/game/districts.js';

const w = createWorld();
const spot = (ort, id) => SCENES[ort].spots.find((s) => s.id === id);
const ok = (b, t) => console.log(`${b ? 'ok  ' : 'FEHL'}  ${t}`);

// 1. Stahltür ist zu, solange die Karte fehlt.
const tuer = spot('alley2', 'door');
ok(!w.meets(tuer.requires), 'Stahltür verschlossen ohne Karte');
ok(Boolean(tuer.lockText), 'Verschlossene Tür nennt einen Grund');

// 2. Karte aus dem Container.
const karte = spot('alley2', 'dumpster').item;
ok(w.take(karte), 'Schlüsselkarte aufgenommen');
ok(!w.take(karte), 'Dieselbe Karte nicht zweimal');
ok(w.meets(tuer.requires), 'Stahltür offen mit Karte');

// 3. Tuch aus dem Lagerraum.
const tuch = spot('backroom', 'workbench').item;
w.take(tuch);
ok(w.hasItem('cloth'), 'Tuch in den Asservaten');

// 4. Abgeben und warten.
w.submit(tuch);
ok(!w.hasItem('cloth'), 'Tuch nach Abgabe nicht mehr getragen');
ok(w.pending().length === 1 && w.ready().length === 0, 'Analyse läuft');
let fertig = 0;
for (let i = 1; i <= 4; i++) fertig += w.step();
ok(fertig === 1, `Befund nach 4 Ortswechseln fertig (${fertig})`);
ok(w.ready().length === 1, 'Befund liegt bereit');

// 5. Abholen setzt die Erkenntnis.
const got = w.collect('cloth');
ok(Boolean(got), 'Befund abgeholt');
ok(w.hasClue('blut-fremd'), 'Erkenntnis blut-fremd gesetzt');
ok(w.ready().length === 0, 'Befund nach Abholen weg');
ok(w.collect('cloth') === null, 'Befund nicht zweimal abholbar');

// 5b. Zweite Kette: Patientenkarte -> Labor -> Archiv -> Personalakte.
//     Das Archiv haengt an einem LABORBEFUND, nicht an einem Fund — die
//     einzige Sperre dieser Art im Spiel, und deshalb pruefenswert.
const w2 = createWorld();
const gang = spot('empfang', 'gang');
ok(!w2.meets(gang.requires), 'Seitengang zu ohne Registerbefund');
const patKarte = spot('klinik', 'instrumente').item;
w2.take(patKarte);
w2.submit(patKarte);
for (let i = 0; i < patKarte.analysis.wait; i++) w2.step();
w2.collect(patKarte.id);
ok(w2.hasClue('register-luecke'), 'Registerbefund abgeholt');
ok(w2.meets(gang.requires), 'Seitengang offen mit Registerbefund');

const persAkte = spot('archiv', 'wagen').item;
ok(Boolean(persAkte.analysis), 'Personalakte ist untersuchbar');
w2.take(persAkte);
w2.submit(persAkte);
for (let i = 0; i < persAkte.analysis.wait; i++) w2.step();
ok(Boolean(w2.collect(persAkte.id)), 'Abgleich der Personalakte abgeholt');
ok(w2.hasClue('konzern-programm'), 'Erkenntnis konzern-programm gesetzt');

// 6. Erreichbarkeit — ZU FUSS innerhalb eines Sektors, per Spinner zwischen
//    ihnen. Ein Ort im Hafen ist von der Kanalgasse aus nicht erlaufbar, und
//    das ist Absicht.
const alle = Object.keys(SCENES);
const start = DISTRICT_IDS.map((d) => DISTRICTS[d].arrival);
const gesehen = new Set(start);
const rand = [...start];
while (rand.length) {
  const o = rand.pop();
  for (const s of SCENES[o].spots) {
    if (s.goto && !gesehen.has(s.goto)) { gesehen.add(s.goto); rand.push(s.goto); }
  }
}
ok(gesehen.size === alle.length, `Alle ${alle.length} Orte erreichbar (${gesehen.size})`);

for (const id of alle) {
  const raus = SCENES[id].spots.filter((s) => s.goto);
  ok(raus.length > 0, `${id}: hat einen Ausgang (${raus.map((s) => s.dir).join(',')})`);
  for (const s of raus) ok(Boolean(SCENES[s.goto]), `${id} → ${s.goto} existiert`);
  ok(Boolean(SCENES[id].district), `${id}: gehört zu einem Sektor`);
  ok(Boolean(DISTRICTS[SCENES[id].district]), `${id}: Sektor ${SCENES[id].district} existiert`);
}

// 7. Sektoren: jeder hat einen Ankunftsort, und jeder ausser dem ersten ist
//    gesperrt, bis ein Hinweis ihn oeffnet.
for (const d of DISTRICT_IDS) {
  const D = DISTRICTS[d];
  ok(Boolean(SCENES[D.arrival]), `${d}: Ankunftsort ${D.arrival} existiert`);
  ok(D.offen || Boolean(D.requires), `${d}: entweder offen oder mit Bedingung`);
  if (D.requires) ok(Boolean(D.hint), `${d}: gesperrter Sektor nennt einen Hinweis`);
}

// 8. Jede Bedingung muss irgendwo im Spiel erfuellbar sein — sonst ist ein
//    Sektor fuer immer zu, und das merkt niemand beim Durchspielen.
const erreichbareHinweise = new Set();
for (const id of alle) for (const s of SCENES[id].spots) {
  if (s.clue) erreichbareHinweise.add(s.clue);
  // Auch Hinweise, die erst aus einem Laborbefund fallen, zaehlen als
  // auffindbar — sonst schlaegt die Pruefung bei jeder Kette an, die ueber
  // das Labor laeuft.
  if (s.item?.analysis?.clue) erreichbareHinweise.add(s.item.analysis.clue);
}
for (const d of DISTRICT_IDS) {
  const c = DISTRICTS[d].requires?.clue;
  if (c) ok(erreichbareHinweise.has(c), `${d}: Hinweis "${c}" ist im Spiel auffindbar`);
}
