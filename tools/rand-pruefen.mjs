/**
 * Prueft, dass man findet, was neben dem Schirm liegt.
 *
 * DER FEHLER, DEN ES DAFUER GAB.
 *
 * Gemeldet aus dem Spiel: „Was soll der Hinweis mit der Siedlung, ein Licht
 * ist ausgegangen — aber da ist weder eine neue Person noch sonst etwas."
 * Doch, es war etwas da: ein neuer Punkt bei u = 0,885. Nur lag der auf einem
 * hochkant gehaltenen Handy weit ausserhalb des Schirms.
 *
 * Die Platte deckt den Anzeigebereich immer vollstaendig, die schmalere Seite
 * wird beschnitten. Im Querformat geht das auf; im Hochformat bleibt ein
 * knappes Viertel des Ortes uebrig. Gemessen in der Werkssiedlung:
 *
 *     quer  1400x800   8 von 8 Punkten sichtbar
 *     hoch   393x852   1 von 8 Punkten sichtbar
 *
 * Schieben ging immer, und die Hilfezeile sagt es auch. Aber niemand schiebt
 * in eine Richtung, in der er nichts vermutet. Deshalb steht jetzt am Rand,
 * DASS dort noch etwas ist und wie viel — und ein Druck darauf faehrt hin.
 *
 *   npm run build && npx vite preview --port 4173
 *   node tools/rand-pruefen.mjs
 */

import { chromium } from 'playwright';
import { FAELLE, setzeFall } from '../src/game/fall.js';

const argv = process.argv.slice(2);
const arg = (n, d) => { const i = argv.indexOf('--' + n); return i === -1 ? d : argv[i + 1]; };
const url = arg('url', 'http://127.0.0.1:4173/');

let schlecht = 0;
const ok = (b, t) => { if (!b) schlecht++; console.log(`${b ? 'ok  ' : 'FEHL'}  ${t}`); };

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium',
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-gpu-sandbox'],
});

/** Wo die Punkte gerade auf dem Schirm stehen. */
async function punkte(page, breite) {
  return page.locator('#hs-layer .hs').evaluateAll((n, w) => n.map((x) => {
    const r = x.getBoundingClientRect();
    const mx = r.x + r.width / 2;
    return { label: x.getAttribute('aria-label'), x: Math.round(mx), drin: mx > 0 && mx < w };
  }), breite);
}

async function oeffne(vp, mobil) {
  const page = await browser.newPage({ viewport: vp, isMobile: mobil, hasTouch: mobil });
  page.on('pageerror', (e) => { schlecht++; console.log('SEITENFEHLER', String(e)); });
  await page.goto(url, { waitUntil: 'load' });
  await page.evaluate(() => {
    localStorage.clear();
    localStorage.setItem('regenstadt.fall', 'fall-2');
    localStorage.setItem('regenstadt.direkt', '1');
  });
  await page.reload({ waitUntil: 'load' });
  await page.waitForFunction(() => window.__ready === true, { timeout: 40000 });
  await page.evaluate(() => window.__regenstadt.freeze());
  // Der Zustand, in dem der Fehler gemeldet wurde: die Siedlung ist offen und
  // das dunkle Fenster ist da.
  await page.evaluate(() => {
    for (const c of ['f2-marke-gefunden', 'f2-nachtarbeit']) window.__regenstadt.world.addClue(c);
  });
  for (let i = 0; i < 6 && await page.locator('#meldung.on').count(); i++) {
    await page.locator('#meldung.on button').first().click({ force: true });
    await page.waitForTimeout(280);
  }
  await page.evaluate(() => window.__regenstadt.goTo('f2-siedlung'));
  await page.waitForTimeout(1500);
  return page;
}

/* --- Querformat: alles sichtbar, keine Randmarken ------------------------ */
{
  const vp = { width: 1400, height: 800 };
  const page = await oeffne(vp, false);
  const p = await punkte(page, vp.width);
  ok(p.every((q) => q.drin), `Quer: alle ${p.length} Punkte auf dem Schirm`);
  ok(await page.locator('#hs-layer .rand.on').count() === 0,
     'Quer: keine Randmarke, weil nichts daneben liegt');
  await page.close();
}

/* --- Hochformat: Randmarken zeigen, was fehlt ---------------------------- */
{
  const vp = { width: 393, height: 852 };
  const page = await oeffne(vp, true);
  const vorher = await punkte(page, vp.width);
  const draussen = vorher.filter((q) => !q.drin);
  ok(draussen.length > 0, `Hoch: ${draussen.length} von ${vorher.length} Punkten liegen neben dem Schirm`);

  const rechts = page.locator('#hs-layer .rand.rechts.on');
  const links = page.locator('#hs-layer .rand.links.on');
  ok(await rechts.count() === 1 && await links.count() === 1,
     'Hoch: beide Randmarken stehen da');
  const summe = Number(await links.locator('.n').textContent()) + Number(await rechts.locator('.n').textContent());
  ok(summe === draussen.length,
     `Die Randmarken nennen die richtige Zahl (${summe} von ${draussen.length})`);

  /* Und ein Druck darauf muss wirklich hinfuehren — bis zum aeussersten Punkt. */
  const ziel = 'Das dunkle Fenster';
  let da = false;
  for (let i = 0; i < 5 && !da; i++) {
    if (await rechts.count()) await rechts.click({ force: true });
    await page.waitForTimeout(1400);
    da = (await punkte(page, vp.width)).find((q) => q.label === ziel)?.drin || false;
  }
  ok(da, `Ein Druck auf die Randmarke führt zu „${ziel}"`);
  await page.close();
}

await browser.close();
setzeFall(FAELLE[0].id);
console.log(schlecht ? `\n${schlecht} Fehler.` : '\nAlles gruen.');
process.exit(schlecht ? 1 : 0);
