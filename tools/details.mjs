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
 *   node tools/details.mjs --alle          # erzeugt alles Fehlende
 *   node tools/details.mjs --ort terminal  # nur ein Ort
 *   node tools/details.mjs --max 6         # höchstens sechs Stück
 *
 * Ausgänge bekommen keine — dort ist der neue Blickwinkel der nächste Ort.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { SCENES } from '../src/game/scenes.js';

const argv = process.argv.slice(2);
const arg = (n, d) => { const i = argv.indexOf('--' + n); return i === -1 ? d : argv[i + 1]; };
const alle = argv.includes('--alle');
const nurOrt = arg('ort', null);
const grenze = Number(arg('max', 999));

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
for (const s of stellen) {
  if (gemacht >= grenze) break;
  const ziel = `public/${s.datei}`;
  if (existsSync(ziel)) { console.log(`  übersprungen (da): ${s.datei}`); continue; }

  const vorlage = `public/plates/${s.ort.backdrop}.jpg`;
  if (!existsSync(vorlage)) { console.log(`  KEINE PLATTE: ${vorlage}`); continue; }

  const tmp = `/tmp/anw-${s.ortId}-${s.spot.id}.txt`;
  writeFileSync(tmp, anweisung(s.ort, s.spot));
  process.stdout.write(`\n→ ${s.ortId} · ${s.spot.label} … `);
  try {
    execFileSync('node', ['tools/gen.mjs', '--in', vorlage, '--out', `public/${s.datei.replace(/\.jpg$/, '.png')}`,
      '--prompt', tmp, '--aspect', '4:3'], { stdio: 'inherit' });
    gemacht += 1;
  } catch {
    console.log('  FEHLGESCHLAGEN');
  }
}

// scenes.js nachtragen — nur für Dateien, die es jetzt wirklich gibt.
if (gemacht > 0) {
  let quelle = readFileSync('src/game/scenes.js', 'utf8');
  let n = 0;
  for (const s of stellen) {
    if (!existsSync(`public/${s.datei}`)) continue;
    if (quelle.includes(`'${s.datei}'`)) continue;
    // Nach der label-Zeile des Punktes einfügen.
    const marke = new RegExp(`(id: '${s.spot.id}',[^}]*?label: '[^']*',\\n)`, 's');
    if (!marke.test(quelle)) { console.log(`  Marke nicht gefunden: ${s.spot.id}`); continue; }
    quelle = quelle.replace(marke, `$1        detail: '${s.datei}',\n`);
    n += 1;
  }
  writeFileSync('src/game/scenes.js', quelle);
  console.log(`\n${gemacht} Bilder erzeugt, ${n} in scenes.js eingetragen.`);
}
