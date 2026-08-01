/**
 * Bilder auf die Größe bringen, in der sie tatsächlich gezeigt werden.
 *
 * Das Bildmodell liefert 2400 px breit. Die Nahaufnahmen erscheinen im Spiel
 * aber höchstens 420 CSS-Pixel breit — bei dreifacher Pixeldichte also rund
 * 1260 echte Bildpunkte. Der Rest ist Ladezeit ohne Gegenwert: 64 Bilder à
 * 2,5 MB sind 158 MB, die auf einem Telefon Stück für Stück durch die Leitung
 * müssen.
 *
 * Gearbeitet wird in Chromium, weil hier weder ImageMagick noch PIL noch
 * sharp vorhanden sind — dieselbe Begründung wie bei tools/beschneiden.mjs.
 * Alle Bilder laufen durch EINEN Browserstart; ein Start je Bild wäre
 * langsamer als das Verkleinern selbst.
 *
 *   node tools/verkleinern.mjs public/details --breite 1400
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from 'playwright';

const argv = process.argv.slice(2);
const ordner = argv.find((a) => !a.startsWith('--')) || 'public/details';
const arg = (n, d) => { const i = argv.indexOf('--' + n); return i === -1 ? d : argv[i + 1]; };
const breite = Number(arg('breite', 1400));
const guete = Number(arg('q', 0.88));

const dateien = readdirSync(ordner).filter((f) => /\.jpe?g$/i.test(f));
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage();

let vorher = 0, nachher = 0, geaendert = 0;
for (const name of dateien) {
  const pfad = join(ordner, name);
  const roh = readFileSync(pfad);
  vorher += roh.length;

  const out = await page.evaluate(async ({ url, breite, guete }) => {
    const img = new Image();
    await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = url; });
    if (img.naturalWidth <= breite) return null;
    const h = Math.round((img.naturalHeight / img.naturalWidth) * breite);
    const c = document.createElement('canvas');
    c.width = breite; c.height = h;
    const g = c.getContext('2d');
    g.imageSmoothingQuality = 'high';
    g.drawImage(img, 0, 0, breite, h);
    return { daten: c.toDataURL('image/jpeg', guete), w: breite, h, vorherW: img.naturalWidth };
  }, { url: `data:image/jpeg;base64,${roh.toString('base64')}`, breite, guete });

  if (!out) { nachher += roh.length; continue; }
  const neu = Buffer.from(out.daten.split(',')[1], 'base64');
  writeFileSync(pfad, neu);
  nachher += neu.length;
  geaendert += 1;
  process.stdout.write(`  ${name.padEnd(30)} ${out.vorherW}px ${(roh.length / 1024 / 1024).toFixed(2)} MB → ${out.w}px ${(neu.length / 1024).toFixed(0)} kB\n`);
}

await browser.close();
const mb = (n) => (n / 1024 / 1024).toFixed(1);
console.log(`\n${geaendert} von ${dateien.length} verkleinert: ${mb(vorher)} MB → ${mb(nachher)} MB`);
