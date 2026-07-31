/**
 * Screenshot-Werkzeug.
 *
 * Der Punkt ist nicht Testen, sondern Hinsehen: ohne einen Blick auf das
 * eigene Bild lässt sich kein Wert sinnvoll abstimmen.
 *
 *   node tools/shot.mjs --out shots/alley.png --w 2560 --h 1440 --t 6
 */

import { chromium } from 'playwright';
import { mkdirSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const argv = process.argv.slice(2);
const arg = (name, def) => {
  const i = argv.indexOf('--' + name);
  return i === -1 ? def : argv[i + 1];
};

const url = arg('url', 'http://127.0.0.1:4173/');
const out = resolve(arg('out', 'shots/alley.png'));
const width = parseInt(arg('w', '2560'), 10);
const height = parseInt(arg('h', '1440'), 10);
const time = parseFloat(arg('t', '6'));
const freeze = arg('freeze', '1') !== '0';

mkdirSync(dirname(out), { recursive: true });

// Die im Container vorinstallierte Chromium-Version passt nicht zwingend zur
// npm-Version von Playwright — deshalb den Pfad direkt angeben statt
// nachzuladen.
const EXEC = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium';

const browser = await chromium.launch({
  executablePath: existsSync(EXEC) ? EXEC : undefined,
  args: [
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
    '--disable-gpu-sandbox',
    '--no-sandbox',
    '--ignore-gpu-blocklist',
  ],
});

const page = await browser.newPage({
  viewport: { width, height },
  deviceScaleFactor: 1,
});

const problems = [];
page.on('console', (m) => {
  const t = m.type();
  if (t === 'error' || t === 'warning') problems.push(`[${t}] ${m.text()}`);
  else console.log('   ' + m.text());
});
page.on('pageerror', (e) => problems.push(`[pageerror] ${e.message}`));

await page.goto(url, { waitUntil: 'load', timeout: 60000 });

try {
  await page.waitForFunction('window.__ready === true', null, { timeout: 45000 });
} catch {
  problems.push('[timeout] window.__ready wurde nie true — vermutlich ein Shader- oder Kontextfehler.');
}

// Bewegung anhalten und einen festen Zeitpunkt setzen, damit zwei Aufnahmen
// vergleichbar sind.
// Vorlage zum Uebermalen: nur die Ebenen, ohne Boden, Regen und Luft.
if (arg('backdrop', '0') === '1') {
  await page.evaluate(() => window.__regenstadt?.setBackdropOnly(true));
}

const seed = arg('seed', null);
if (seed !== null) {
  await page.evaluate((s) => window.__regenstadt?.reseed(s), parseInt(seed, 10));
  await page.waitForTimeout(300);
}

if (freeze) {
  await page.evaluate((t) => {
    window.__regenstadt?.freeze();
    window.__regenstadt?.setTime(t);
    // Den Ladeschleier hart entfernen: er blendet über 0,9 s aus und lag
    // sonst halbtransparent über der Aufnahme.
    document.getElementById('boot')?.remove();
    document.getElementById('hint')?.remove();
  }, time);
  // Alle Untersuchungspunkte einblenden — zum Pruefen, ob sie auf ihren
  // Gegenstaenden sitzen.
  if (arg('reveal', '0') === '1') {
    await page.evaluate(() => document.getElementById('hs-layer')?.classList.add('reveal'));
  }

  // Einen Untersuchungspunkt anfahren und anklicken — so laesst sich der
  // Lichtsaum und die Tafel im Standbild pruefen.
  const hs = arg('hotspot', null);
  if (hs !== null) {
    const nth = parseInt(hs, 10);
    const box = await page.evaluate((n) => {
      const el = document.querySelectorAll('#hs-layer .hs')[n];
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    }, nth);
    if (box) {
      await page.mouse.move(box.x, box.y);
      await page.waitForTimeout(450);
      if (arg('click', '0') === '1') {
        await page.mouse.click(box.x, box.y);
        await page.waitForTimeout(1600); // Schreibmaschine auslaufen lassen
        await page.mouse.move(box.x, box.y);
      }
    } else {
      problems.push(`[hotspot] Index ${nth} existiert nicht`);
    }
  }
  // Ein paar Frames laufen lassen, damit die Änderung im Bild ankommt.
  await page.waitForTimeout(500);
}

await page.screenshot({ path: out, type: 'png' });
await browser.close();

if (problems.length) {
  console.error('\nProbleme im Browser:');
  for (const p of problems.slice(0, 30)) console.error('  ' + p);
}
console.log(`\n→ ${out}  (${width}×${height})`);
process.exit(problems.some((p) => p.includes('pageerror') || p.includes('timeout')) ? 1 : 0);
