/**
 * Nahaufnahmen für Untersuchungspunkte erzeugen.
 *
 * Der neue Blickwinkel ist das, was aus „ein Satz erscheint" ein Spielereignis
 * macht. Deshalb sollen ihn möglichst ALLE Punkte haben, nicht drei.
 *
 * Erzeugt wird Bild-zu-Bild aus der Platte des jeweiligen ORTES, mit dem
 * Beschreibungstext des Punktes als Anweisung. Das ist der Kniff: Licht,
 * Palette, Wetter und Materialien stehen schon im Ausgangsbild, und der Text
 * beschreibt ohnehin genau das, was zu sehen sein soll. Ein frei erfundenes
 * Bild hätte weder die Farbe des Ortes noch seine Stimmung.
 *
 *   node tools/details.mjs                 # zeigt, was fehlt
 *   node tools/details.mjs --fall fall-2   # ein anderer Fall
 *   node tools/details.mjs --alle          # erzeugt alles Fehlende
 *   node tools/details.mjs --ort terminal  # nur ein Ort
 *   node tools/details.mjs --max 6         # höchstens sechs Stück
 *
 * Ausgänge bekommen keine — dort ist der neue Blickwinkel der nächste Ort.
 *
 * GRÖSSE: Erzeugt wird in 2K, verkleinert wird danach mit
 * tools/verkleinern.mjs. Kleiner zu erzeugen spart nichts — gemessen kosten
 * 1K und 2K gleich viel (1235 gegen 1228 Ausgabe-Token), weil die Abrechnung
 * daran hängt, DASS ein Bild entsteht, nicht an seiner Auflösung. Das
 * Nachpacken bleibt aber Pflicht: Die JPEGs des Modells sind sehr schwach
 * komprimiert, und 64 Bilder à 2,5 MB wären 158 MB Ladelast auf dem Handy.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { FAELLE, setzeFall, fall } from '../src/game/fall.js';

const lauf = promisify(execFile);

/**
 * Wie viele Bilder gleichzeitig.
 *
 * Gemessen: EIN Bild braucht 24,5 s, DREI gleichzeitig brauchen ebenfalls
 * 24 s. Die Zeit geht fast vollstaendig fuer die Rechenzeit des Bildmodells
 * drauf, nicht fuer Leitung oder Aufbereitung — und die laeuft nebenlaeufig.
 * Der erste Stapel lief nacheinander und hat dadurch das Dreifache gebraucht.
 *
 * Vier ist bewusst nicht ausgereizt: Es geht um den Faktor, nicht um das
 * letzte Prozent, und ein Kontingentfehler mitten im Stapel kostet mehr, als
 * die zusaetzliche Nebenlaeufigkeit einbringt.
 */
const GLEICHZEITIG = Number(process.env.GEN_PARALLEL || 4);

const argv = process.argv.slice(2);
const arg = (n, d) => { const i = argv.indexOf('--' + n); return i === -1 ? d : argv[i + 1]; };
const alle = argv.includes('--alle');
const nurOrt = arg('ort', null);
const grenze = Number(arg('max', 999));

/* Welcher Fall.
   Seit die Falldaten unter src/faelle/<name>/ liegen, muss das Werkzeug
   wissen, fuer welchen es arbeitet — und vor allem, in WELCHE Datei es die
   Eintraege nachtraegt. Vorher stand alles in src/game/scenes.js; dorthin zu
   schreiben wuerde jetzt nichts mehr treffen. */
const fallId = arg('fall', FAELLE[0].id);
if (!FAELLE.some((f) => f.id === fallId)) {
  console.error(`Unbekannter Fall: ${fallId}. Bekannt: ${FAELLE.map((f) => f.id).join(', ')}`);
  process.exit(1);
}
setzeFall(fallId);
const SCENES = fall().orte;
const ORTE_DATEI = `src/faelle/${fallId.replace('-', '')}/orte.js`;

/** Punkte, die eine Nahaufnahme verdienen. */
function offeneStellen() {
  const out = [];
  for (const [ortId, ort] of Object.entries(SCENES)) {
    if (nurOrt && ortId !== nurOrt) continue;
    for (const s of ort.spots) {
      // Ausgänge nicht: Dort ist der neue Blickwinkel der nächste Ort selbst.
      if (s.kind === 'exit') continue;
      if (s.detail) continue;
      if (!s.text || s.text.length < 40) continue;
      out.push({ ortId, ort, spot: s, datei: `details/${ortId}-${s.id}.jpg` });
    }
  }
  return out;
}

/**
 * Die Anweisung.
 *
 * Der Beschreibungstext geht wörtlich hinein — er ist bereits die Bildregie,
 * und was dort steht, muss im Bild auch zu sehen sein. Sonst widerspricht die
 * Nahaufnahme dem, was daneben geschrieben steht.
 */
function anweisung(ort, spot) {
  const drinnen = ort.kind === 'interior';
  return `This is a wide shot of a location in a rainy neo-noir city.
Produce a CLOSE-UP of ONE element from this exact scene, as if the same camera
moved much nearer to it and nothing else changed.

THE SUBJECT is "${spot.label}", and the investigator's own words about it are:
"${spot.text}"

Everything named in those words must be visible and must match. Nothing else
may be invented — no objects, no people, no signage that is not implied there.

FRAMING: medium close-up, the subject filling the middle of the frame, seen
from standing height. Shallow depth of field; the rest of the location behind
it reduced to soft shapes but still recognisably the same place.

CONTINUITY — must match the wide shot exactly:
- The same lighting, the same colour palette, the same materials and wear.
${drinnen
    ? '- Indoors: dry, no rain, no puddles, no weather of any kind.'
    : '- Outdoors: the same heavy rain, wet surfaces and damp haze.'}

LOOK: photorealistic cinematic film still, anamorphic 35mm, Blade Runner 2049.
Fine film grain. Highlights roll off, never clip to white.

FORBIDDEN: absolutely no writing of any kind. In particular, the name of the
subject must NEVER appear as a sign, label, stencil or engraving — naming it
above is a description for you, not something to letter onto the object. No
text, no watermark, no logo, no readable letters or numbers anywhere. No faces
towards the camera. Not an illustration, not anime.`;
}

const stellen = offeneStellen();
console.log(`${stellen.length} Punkte ohne Nahaufnahme:\n`);
for (const s of stellen) console.log(`  ${s.ortId.padEnd(10)} ${s.spot.label}`);

if (!alle && !nurOrt) {
  console.log('\n--alle erzeugt sie, --ort <id> nur einen Ort.');
  process.exit(0);
}

let gemacht = 0;

/** Die Warteschlange abarbeiten, hoechstens GLEICHZEITIG auf einmal. */
const warteschlange = stellen.slice(0, grenze).filter((s) => {
  if (existsSync(`public/${s.datei}`)) { console.log(`  übersprungen (da): ${s.datei}`); return false; }
  if (!existsSync(`public/plates/${s.ort.backdrop}.jpg`)) { console.log(`  KEINE PLATTE: ${s.ort.backdrop}`); return false; }
  return true;
});

const t0 = Date.now();
let naechste = 0;
async function arbeiter(nr) {
  while (naechste < warteschlange.length) {
    const s = warteschlange[naechste++];
    const tmp = `/tmp/anw-${s.ortId}-${s.spot.id}.txt`;
    writeFileSync(tmp, anweisung(s.ort, s.spot));
    const t = Date.now();
    try {
      await lauf('node', ['tools/gen.mjs',
        '--in', `public/plates/${s.ort.backdrop}.jpg`,
        '--out', `public/${s.datei.replace(/\.jpg$/, '.png')}`,
        '--prompt', tmp, '--aspect', '4:3']);
      gemacht += 1;
      console.log(`  [${nr}] ${s.ortId} · ${s.spot.label} — ${((Date.now() - t) / 1000).toFixed(1)} s`);
    } catch {
      console.log(`  [${nr}] FEHLGESCHLAGEN: ${s.ortId} · ${s.spot.label}`);
    }
  }
}
await Promise.all(Array.from({ length: GLEICHZEITIG }, (_, i) => arbeiter(i + 1)));
if (warteschlange.length) {
  const dauer = (Date.now() - t0) / 1000;
  console.log(`\n${warteschlange.length} Bilder in ${dauer.toFixed(0)} s `
            + `(${(dauer / warteschlange.length).toFixed(1)} s je Bild bei ${GLEICHZEITIG} gleichzeitig)`);
}

// scenes.js nachtragen — für alles, wofür es jetzt eine Datei gibt.
// Bewusst NICHT an `gemacht > 0` gebunden: Sind die Bilder schon da und nur
// die Einträge fehlen, muss der Lauf sie trotzdem nachtragen können.
{
  let quelle = readFileSync(ORTE_DATEI, 'utf8');
  let n = 0;
  for (const s of stellen) {
    if (!existsSync(`public/${s.datei}`)) continue;
    if (quelle.includes(`'${s.datei}'`)) continue;

    // ERST den Ortsblock eingrenzen, DANN den Punkt darin suchen.
    //
    // Punkt-Kennungen sind nur innerhalb eines Ortes eindeutig: „booth" gibt
    // es in der Bar und am Frachtterminal, „terminal" sogar als Ort und als
    // Punkt. Eine Suche über die ganze Datei nimmt den erstbesten Treffer —
    // so landete die Nahaufnahme der Zollkabine in der Bar und die des
    // Leseterminals beim Portalkran.
    /* Der Ortsblock — mit ODER ohne Anfuehrungszeichen um den Schluessel.
       Fall 1 hat blosse Bezeichner (`alley: {`), Fall 2 braucht wegen der
       Bindestriche Zeichenketten (`'f2-becken': {`). Die erste Fassung kannte
       nur die erste Form und hat deshalb 26 fertige Bilder erzeugt und KEINES
       eingetragen — die Bilder lagen da, das Spiel wusste nichts davon. */
    let anfang = quelle.indexOf(`\n  ${s.ortId}: {`);
    if (anfang === -1) anfang = quelle.indexOf(`\n  '${s.ortId}': {`);
    if (anfang === -1) { console.log(`  Ort nicht gefunden: ${s.ortId}`); continue; }
    const ende = quelle.indexOf('\n  },\n', anfang);
    const block = quelle.slice(anfang, ende);

    const marke = new RegExp(`(id: '${s.spot.id}', u: [^}]*?label: '[^']*',\n)`, 's');
    if (!marke.test(block)) { console.log(`  Marke nicht gefunden: ${s.ortId}.${s.spot.id}`); continue; }
    quelle = quelle.slice(0, anfang)
           + block.replace(marke, `$1        detail: '${s.datei}',\n`)
           + quelle.slice(ende);
    n += 1;
  }
  writeFileSync(ORTE_DATEI, quelle);
  console.log(`\n${gemacht} Bilder erzeugt, ${n} in ${ORTE_DATEI} eingetragen.`);
}
