/**
 * Schwarze Balken von einer erzeugten Platte abschneiden.
 *
 * Das Bildmodell liefert die Kinoformate manchmal MIT eingebrannten Balken
 * oben und unten. Im Spiel füllt die Platte den Schirm — der Balken wäre
 * dann schlicht ein schwarzer Streifen im Bild.
 *
 * Gearbeitet wird in Chromium, weil in dieser Umgebung weder ImageMagick noch
 * PIL noch sharp vorhanden sind, Playwright aber ohnehin für die Screenshots
 * gebraucht wird. Das Bild geht als data:-URL hinein — eine file:-URL würde
 * das Canvas als fremd markieren und `getImageData` sperren.
 *
 *   node tools/beschneiden.mjs public/plates/x.jpg [--schwelle 26]
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { chromium } from 'playwright';

const argv = process.argv.slice(2);
const datei = argv.find((a) => !a.startsWith('--'));
const arg = (n, d) => { const i = argv.indexOf('--' + n); return i === -1 ? d : argv[i + 1]; };
if (!datei) { console.error('Aufruf: node tools/beschneiden.mjs <bild> [--schwelle 26]'); process.exit(1); }

const schwelle = Number(arg('schwelle', 26));
const qualitaet = Number(arg('q', 0.94));
const roh = readFileSync(datei);
const url = `data:image/${datei.endsWith('.png') ? 'png' : 'jpeg'};base64,${roh.toString('base64')}`;

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage();

const out = await page.evaluate(async ({ url, schwelle, qualitaet }) => {
  const img = new Image();
  await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = url; });
  const c = document.createElement('canvas');
  c.width = img.naturalWidth; c.height = img.naturalHeight;
  const g = c.getContext('2d', { willReadFrequently: true });
  g.drawImage(img, 0, 0);
  const { data } = g.getImageData(0, 0, c.width, c.height);

  /** Ist diese Zeile durchgehend (fast) schwarz? Stichproben reichen. */
  const zeileSchwarz = (y) => {
    for (let x = 0; x < c.width; x += 7) {
      const i = (y * c.width + x) * 4;
      if (data[i] > schwelle || data[i + 1] > schwelle || data[i + 2] > schwelle) return false;
    }
    return true;
  };
  const spalteSchwarz = (x) => {
    for (let y = 0; y < c.height; y += 7) {
      const i = (y * c.width + x) * 4;
      if (data[i] > schwelle || data[i + 1] > schwelle || data[i + 2] > schwelle) return false;
    }
    return true;
  };

  let oben = 0, unten = c.height - 1, links = 0, rechts = c.width - 1;
  while (oben < unten && zeileSchwarz(oben)) oben++;
  while (unten > oben && zeileSchwarz(unten)) unten--;
  while (links < rechts && spalteSchwarz(links)) links++;
  while (rechts > links && spalteSchwarz(rechts)) rechts--;

  const w = rechts - links + 1;
  const h = unten - oben + 1;
  if (w === c.width && h === c.height) return { unveraendert: true, w, h };

  const z = document.createElement('canvas');
  z.width = w; z.height = h;
  z.getContext('2d').drawImage(c, links, oben, w, h, 0, 0, w, h);
  return {
    unveraendert: false,
    w, h, oben, unten: c.height - 1 - unten, links, rechts: c.width - 1 - rechts,
    vorherW: c.width, vorherH: c.height,
    daten: z.toDataURL('image/jpeg', qualitaet),
  };
}, { url, schwelle, qualitaet });

await browser.close();

if (out.unveraendert) {
  console.log(`unverändert — keine Balken gefunden (${out.w}×${out.h})`);
} else {
  const ziel = datei.replace(/\.png$/, '.jpg');
  writeFileSync(ziel, Buffer.from(out.daten.split(',')[1], 'base64'));
  const v = (out.w / out.h).toFixed(2);
  console.log(
    `${out.vorherW}×${out.vorherH} → ${out.w}×${out.h} (${v}:1)  `
    + `weg: oben ${out.oben}, unten ${out.unten}, links ${out.links}, rechts ${out.rechts}`,
  );
  console.log(`→ ${ziel}`);
}
