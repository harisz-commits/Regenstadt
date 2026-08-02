/**
 * Prüft die Ermittlungslogik ohne Browser: Beweiskette, Sperren, Erreichbarkeit.
 *
 * Absichtlich ohne Renderer — diese Fehler sind Logikfehler, und ein
 * Screenshot zeigt sie nicht. Aufruf: node tools/welt-pruefen.mjs
 */
import { createWorld } from '../src/game/world.js';
import { SCENES } from '../src/game/scenes.js';
import { DISTRICTS, DISTRICT_IDS } from '../src/game/districts.js';
import { CHARACTERS } from '../src/game/characters.js';
import { LOESUNG } from '../src/game/anklage.js';

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

// Dasselbe fuer die Ausgaenge: Eine Tuer, deren Bedingung nirgends erfuellbar
// ist, macht einen Ort unerreichbar, ohne dass die Erreichbarkeitspruefung
// oben etwas merkt — die laeuft ja ueber `goto`, nicht ueber `requires`.
for (const id of alle) for (const s of SCENES[id].spots) {
  const c = s.requires?.clue;
  if (c) ok(erreichbareHinweise.has(c), `${id}.${s.id}: Bedingung "${c}" ist erfuellbar`);
  if (s.requires) ok(Boolean(s.lockText), `${id}.${s.id}: gesperrter Punkt nennt einen Grund`);
}

/* ======================================================================== */
/* 9. Gestaendnisse.                                                         */
/*                                                                           */
/* Ein Gespraech kann seit dem Umbau echte Hinweise setzen. Damit kann es     */
/* auch Ketten bilden — und eine Kette, deren erstes Glied nirgends           */
/* herkommt, ist eine Figur, die nie etwas sagt. Der Fehler faellt beim       */
/* Spielen nur auf, wenn man genau diese Figur genau dann anspricht.          */
/* ======================================================================== */

/** Alles, was der Spieler ueberhaupt bekommen kann — aus Orten UND Gespraechen. */
const ausOrten = new Set();
const gegenstaende = new Set();
for (const id of alle) for (const s of SCENES[id].spots) {
  if (s.clue) ausOrten.add(s.clue);
  if (s.item) gegenstaende.add(s.item.id);
  if (s.item?.analysis?.clue) ausOrten.add(s.item.analysis.clue);
}
const ausGespraech = new Set();
for (const c of Object.values(CHARACTERS)) for (const g of c.spuren || []) {
  if (g.clue) ausGespraech.add(g.clue);
}

const kennungen = new Set();
for (const [cid, c] of Object.entries(CHARACTERS)) {
  for (const g of c.spuren || []) {
    ok(!kennungen.has(g.id), `Gestaendnis-Kennung "${g.id}" ist eindeutig`);
    kennungen.add(g.id);
    ok(Boolean(g.was && g.notiz), `${cid}.${g.id}: hat Text und Notiz`);
    const w = g.wenn || {};
    if (w.clue) {
      ok(ausOrten.has(w.clue) || ausGespraech.has(w.clue),
         `${cid}.${g.id}: Bedingung "${w.clue}" ist im Spiel erreichbar`);
    }
    if (w.item) {
      ok(gegenstaende.has(w.item), `${cid}.${g.id}: Gegenstand "${w.item}" gibt es`);
    }
  }
}

// Ein Hinweis darf nicht aus zwei Quellen kommen — sonst ist unklar, was ihn
// gesetzt hat, und eine der beiden Quellen ist tote Arbeit.
for (const c of ausGespraech) {
  ok(!ausOrten.has(c), `Hinweis "${c}" kommt nur aus dem Gespraech, nicht auch aus einem Ort`);
}

ok(ausGespraech.size >= 8,
   `Gespraeche bringen echte Hinweise (${ausGespraech.size})`);

/* ======================================================================== */
/* 10. Der Abschluss.                                                         */
/*                                                                           */
/* Das Spiel muss durchspielbar SEIN, nicht nur begehbar. Diese Pruefung      */
/* spielt die ganze Kette in der Reihenfolge durch, in der ein Spieler sie    */
/* gehen muss, und schaut am Ende nach, ob die Anklage traegt.               */
/* ======================================================================== */

// Genau ein Ort, an dem angeklagt wird — sonst waere das Ende zufaellig.
const anklagePunkte = alle.flatMap((id) =>
  SCENES[id].spots.filter((s) => s.kind === 'anklage').map((s) => `${id}.${s.id}`));
ok(anklagePunkte.length === 1, `Genau ein Anklagepunkt (${anklagePunkte.join(', ') || 'keiner'})`);

ok(Boolean(CHARACTERS[LOESUNG.taeter]), `Der Taeter "${LOESUNG.taeter}" ist eine Figur`);

// Jede Figur muss auch irgendwo stehen — sonst kann man jemanden anklagen,
// den man nie treffen konnte.
const personenPunkte = new Set(alle.flatMap((id) =>
  SCENES[id].spots.filter((s) => s.kind === 'person' || s.kind === 'lab').map((s) => s.id)));
for (const cid of Object.keys(CHARACTERS)) {
  ok(personenPunkte.has(cid), `Figur ${cid} steht an einem Ort`);
}

// Ein vollstaendiger Durchlauf: alles finden, alles abgeben, alles abholen.
const p = createWorld();
/** Einen Punkt „anklicken": Hinweis eintragen, Gegenstand nehmen. */
function untersuche(ort, punkt) {
  const s = spot(ort, punkt);
  if (s.clue) p.addClue(s.clue);
  if (s.item) p.take(s.item);
  return s;
}
/** Einen Gegenstand ins Labor geben und den Befund abholen. */
function labor(id, wait) {
  const it = p.items().find((i) => i.id === id);
  p.submit(it);
  for (let i = 0; i < wait; i++) p.step();
  return Boolean(p.collect(id));
}

untersuche('alley', 'crates-right');                // zollsiegel  -> Sektor 3
ok(p.hasClue('zollsiegel'), 'Durchlauf: Zollsiegel gefunden');
untersuche('alley2', 'dumpster');                   // Schluesselkarte
untersuche('backroom', 'workbench');                // Tuch
ok(labor('cloth', 4), 'Durchlauf: Blutbefund abgeholt');
ok(p.hasClue('blut-fremd'), 'Durchlauf: Sektor 9 offen');
untersuche('customs', 'clipboards');                // frachtbrief -> Sektor 1
untersuche('klinik', 'instrumente');                // Patientenkarte
ok(labor('patientenkarte', 3), 'Durchlauf: Registerbefund abgeholt');
untersuche('archiv', 'wagen');                      // Personalakte
ok(labor('personalakte', 3), 'Durchlauf: Konzernprogramm belegt');
ok(p.meets(DISTRICTS['sektor-4'].requires), 'Durchlauf: Sektor 4 offen');
untersuche('leichenhalle', 'fach-offen');           // Fachmarke
ok(labor('zehenmarke', 3), 'Durchlauf: Fachmarke geprueft');
ok(p.hasClue('ohne-leiche'), 'Durchlauf: „ohne Leiche" belegt');

const kuehltuer = spot('customs', 'zum-kuehlhaus');
ok(p.meets(kuehltuer.requires), 'Durchlauf: Kuehlhaus offen');
untersuche('kuehlhaus', 'p-haendler');              // haendler-lebt
untersuche('kuehlhaus', 'buero');                   // Namensliste
ok(labor('namensliste', 2), 'Durchlauf: Namensliste abgeglichen');
ok(p.hasClue('elf-namen'), 'Durchlauf: Liste als Terminkalender erkannt');

const lift = spot('empfang', 'direktionsaufzug');
ok(p.meets(lift.requires), 'Durchlauf: Direktion erreichbar');
untersuche('direktion', 'schreibtisch');            // letzte-unterschrift
ok(p.hasClue('letzte-unterschrift'), 'Durchlauf: zwoelfte Urkunde in der Akte');

ok(p.hasClue(LOESUNG.voraussetzung.clue), 'Durchlauf: Anklage ueberhaupt moeglich');
for (const b of LOESUNG.beweise) ok(p.hasClue(b.clue), `Durchlauf: Beleg "${b.clue}" liegt vor`);

// Und die Gegenprobe: ohne den Durchlauf traegt gar nichts.
const leer = createWorld();
ok(!leer.hasClue(LOESUNG.voraussetzung.clue), 'Ohne Ermittlung keine Anklage');
