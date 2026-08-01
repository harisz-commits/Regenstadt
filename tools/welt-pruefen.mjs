/**
 * Prüft die Ermittlungslogik ohne Browser: Beweiskette, Sperren, Erreichbarkeit.
 *
 * Absichtlich ohne Renderer — diese Fehler sind Logikfehler, und ein
 * Screenshot zeigt sie nicht. Aufruf: node tools/welt-pruefen.mjs
 */
import { createWorld } from '../src/game/world.js';
import { SCENES } from '../src/game/scenes.js';

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

// 6. Erreichbarkeit: kommt man von jedem Ort irgendwohin und zurück?
const alle = Object.keys(SCENES);
const gesehen = new Set(['alley']);
const rand = ['alley'];
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
}
