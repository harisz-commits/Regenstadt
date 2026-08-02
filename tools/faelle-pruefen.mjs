/**
 * Jeden Fall strukturell abklopfen — nicht nur den, der gerade laeuft.
 *
 * `welt-pruefen.mjs` spielt Fall 1 in der Tiefe durch: benannte Punkte,
 * benannte Gegenstaende, die ganze Kette bis zur Anklage. Das geht nur fuer
 * einen Fall, den man kennt.
 *
 * Hier stehen die Regeln, die fuer JEDEN Fall gelten muessen — und die genau
 * dann brechen, wenn jemand einen neuen schreibt: ein Ausgang ins Nichts, ein
 * Sektor ohne Ankunftsort, ein Hinweis, den niemand bekommen kann, eine Figur,
 * die nirgends steht. Beim Spielen faellt so etwas erst auf, wenn man an genau
 * die Stelle kommt.
 *
 *   node tools/faelle-pruefen.mjs
 */

import { FAELLE, setzeFall } from '../src/game/fall.js';

let schlecht = 0;
const ok = (b, t) => { if (!b) schlecht++; console.log(`${b ? 'ok  ' : 'FEHL'}  ${t}`); };

for (const F of FAELLE) {
  setzeFall(F.id);
  console.log(`\n=== ${F.id} · ${F.titel} ===`);

  const orte = F.orte, sektoren = F.sektoren, figuren = F.figuren;
  const ortIds = Object.keys(orte);
  const sektorIds = Object.keys(sektoren);

  ok(Boolean(orte[F.start]), `Startort "${F.start}" existiert`);
  ok(F.praemisse?.length > 40, 'Der Fall hat eine Praemisse fuer den Nachspann');

  /* --- Woher kommt was? ------------------------------------------------- */
  const ausOrten = new Set(), gegenstaende = new Set(), ausGespraech = new Set();
  for (const o of Object.values(orte)) for (const s of o.spots) {
    if (s.clue) ausOrten.add(s.clue);
    if (s.item) gegenstaende.add(s.item.id);
    if (s.item?.analysis?.clue) ausOrten.add(s.item.analysis.clue);
  }
  for (const c of Object.values(figuren)) for (const g of c.spuren || []) {
    if (g.clue) ausGespraech.add(g.clue);
  }
  const alleHinweise = new Set([...ausOrten, ...ausGespraech]);
  const erfuellbar = (bed, wo) => {
    if (bed?.clue) ok(alleHinweise.has(bed.clue), `${wo}: Hinweis "${bed.clue}" ist erreichbar`);
    if (bed?.item) ok(gegenstaende.has(bed.item), `${wo}: Gegenstand "${bed.item}" gibt es`);
  };

  /* --- Orte -------------------------------------------------------------- */
  const ankuenfte = new Set(sektorIds.map((d) => sektoren[d].arrival));
  for (const id of ortIds) {
    const o = orte[id];
    ok(Boolean(o.backdrop), `${id}: hat eine Platte`);
    ok(Boolean(sektoren[o.district]), `${id}: Sektor "${o.district}" existiert`);
    const raus = o.spots.filter((s) => s.goto);
    // Ein Ankunftsort darf ohne Ausgang auskommen: Von dort kommt man mit der
    // Karte weg. Jeder andere Ort waere eine Sackgasse.
    ok(raus.length > 0 || ankuenfte.has(id),
       `${id}: hat einen Ausgang (oder ist Ankunftsort)`);
    for (const s of raus) ok(Boolean(orte[s.goto]), `${id} → ${s.goto} existiert`);
    for (const s of o.spots) {
      erfuellbar(s.requires, `${id}.${s.id}`);
      erfuellbar(s.erscheint, `${id}.${s.id} erscheint`);
      erfuellbar(s.verschwindet, `${id}.${s.id} verschwindet`);
      if (s.requires) ok(Boolean(s.lockText), `${id}.${s.id}: gesperrter Punkt nennt einen Grund`);
    }
  }

  /* --- Erreichbarkeit zu Fuss ab den Ankunftsorten ----------------------- */
  const gesehen = new Set(ankuenfte);
  const rand = [...ankuenfte];
  while (rand.length) {
    const o = rand.pop();
    for (const s of orte[o]?.spots || []) {
      if (s.goto && !gesehen.has(s.goto)) { gesehen.add(s.goto); rand.push(s.goto); }
    }
  }
  ok(gesehen.size === ortIds.length,
     `Alle ${ortIds.length} Orte erreichbar (${gesehen.size})`);

  /* --- Sektoren ---------------------------------------------------------- */
  let offen = 0;
  for (const d of sektorIds) {
    const D = sektoren[d];
    ok(Boolean(orte[D.arrival]), `${d}: Ankunftsort "${D.arrival}" existiert`);
    ok(D.offen || Boolean(D.requires), `${d}: offen oder mit Bedingung`);
    if (D.offen) offen += 1;
    if (D.requires) { ok(Boolean(D.hint), `${d}: gesperrter Sektor nennt einen Hinweis`); }
    erfuellbar(D.requires, `Sektor ${d}`);
  }
  ok(offen >= 1, `Mindestens ein Sektor ist von Anfang an offen (${offen})`);

  /* --- Figuren und Gestaendnisse ----------------------------------------- */
  const personen = new Set(Object.values(orte).flatMap((o) =>
    o.spots.filter((s) => s.kind === 'person' || s.kind === 'lab').map((s) => s.id)));
  const kennungen = new Set();
  for (const [cid, c] of Object.entries(figuren)) {
    ok(personen.has(cid), `Figur ${cid} steht an einem Ort`);
    ok(Boolean(c.portrait && c.voice && c.secret && c.opener), `Figur ${cid}: vollstaendig`);
    for (const g of c.spuren || []) {
      ok(!kennungen.has(g.id), `Gestaendnis "${g.id}" ist eindeutig`);
      kennungen.add(g.id);
      ok(Boolean(g.was && g.notiz), `${cid}.${g.id}: hat Text und Notiz`);
      erfuellbar(g.wenn, `${cid}.${g.id}`);
    }
  }
  for (const c of ausGespraech) {
    ok(!ausOrten.has(c), `Hinweis "${c}" hat genau eine Quelle`);
  }

  /* --- Der Abschluss ----------------------------------------------------- */
  const L = F.loesung;
  ok(Boolean(figuren[L.taeter]), `Taeter "${L.taeter}" ist eine Figur des Falls`);
  ok(L.beweise.length >= 2, `Mindestens zwei tragende Belege (${L.beweise.length})`);
  erfuellbar(L.voraussetzung, 'Anklage-Voraussetzung');
  for (const b of L.beweise) erfuellbar({ clue: b.clue }, `Beleg "${b.clue}"`);
  const anklagen = Object.values(orte).flatMap((o) =>
    o.spots.filter((s) => s.kind === 'anklage').map((s) => s.id));
  ok(anklagen.length === 1, `Genau ein Anklagepunkt (${anklagen.join(', ') || 'keiner'})`);

  /* --- Meldungen --------------------------------------------------------- */
  for (const m of F.meldungen || []) {
    ok(Boolean(m.titel && m.text), `Meldung "${m.id}": hat Titel und Text`);
    erfuellbar(m.wenn, `Meldung "${m.id}"`);
  }
}

setzeFall(FAELLE[0].id);
console.log(schlecht ? `\n${schlecht} Fehler.` : '\nAlles gruen.');
process.exit(schlecht ? 1 : 0);
