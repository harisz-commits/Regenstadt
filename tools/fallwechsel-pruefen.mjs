/**
 * Prueft den Uebergang von einem Fall zum naechsten.
 *
 * Das ist die heikelste Stelle des Fallformats: Beim Wechsel muessen Orte,
 * Sektoren, Figuren, Loesung, Meldungen und der Spielstand GLEICHZEITIG auf
 * den neuen Fall umspringen. Bleibt eines davon zurueck, faellt es nicht
 * sofort auf — sondern erst, wenn ein Asservat verschwindet oder eine Karte
 * einen Sektor zeigt, den es nicht mehr gibt.
 *
 * Genau so ein Fehler steckte hier: speichern.js hat seinen
 * Gegenstands-Index EINMAL beim Laden gebaut, aus dem Fall, der damals aktiv
 * war. Im zweiten Fall waere jedes Asservat beim Zuruecklesen lautlos
 * verschwunden.
 *
 *   npm run build && npx vite preview --port 4173
 *   node tools/fallwechsel-pruefen.mjs
 */

import { chromium } from 'playwright';
import { FAELLE } from '../src/game/fall.js';

const argv = process.argv.slice(2);
const arg = (n, d) => { const i = argv.indexOf('--' + n); return i === -1 ? d : argv[i + 1]; };
const url = arg('url', 'http://127.0.0.1:4173/');

let schlecht = 0;
const ok = (b, t) => { if (!b) schlecht++; console.log(`${b ? 'ok  ' : 'FEHL'}  ${t}`); };

const [F1, F2] = FAELLE;
ok(Boolean(F2), 'Es gibt einen zweiten Fall');

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium',
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-gpu-sandbox'],
});
const page = await browser.newPage({ viewport: { width: 1400, height: 880 } });
page.on('pageerror', (e) => { schlecht++; console.log('SEITENFEHLER', String(e)); });

async function laden() {
  await page.goto(url, { waitUntil: 'load' });
  const neu = page.locator('#weiter .neu');
  if (await neu.count()) await neu.click();
  await page.waitForFunction(() => window.__ready === true, { timeout: 40000 });
  await page.evaluate(() => window.__regenstadt.freeze());
}

/* --- Fall 1 bis zum Ende ------------------------------------------------ */
await laden();
ok((await page.locator('#topbar .place').textContent()) === F1.orte[F1.start].name,
   `Fall 1 startet in „${F1.orte[F1.start].name}"`);

await page.evaluate((cs) => {
  for (const c of cs) window.__regenstadt.world.addClue(c);
}, [F1.loesung.voraussetzung.clue, ...F1.loesung.beweise.map((b) => b.clue)]);
// Meldungen wegklicken, die dadurch faellig geworden sind.
while (await page.locator('#meldung.on').count()) {
  await page.locator('#meldung button').click();
  await page.waitForTimeout(400);
}

const anklageOrt = Object.values(F1.orte).find((o) => o.spots.some((s) => s.kind === 'anklage'));
await page.evaluate((o) => window.__regenstadt.goTo(o), anklageOrt.id);
await page.waitForTimeout(1300);
await page.locator('#hs-layer .hs.anklage').click({ force: true });
await page.locator('#panel button', { hasText: 'Den Fall abschließen' }).click();
await page.waitForSelector('#anklage.on');
await page.locator(`#anklage .leute button:has(img[src*="${F1.loesung.taeter.replace(/^[a-z0-9]+-/, '')}"])`)
  .first().click();
await page.locator('#anklage button.tat').first().click();
await page.waitForFunction(
  () => !document.querySelector('#anklage .ende p')?.classList.contains('laedt'),
  { timeout: 60000 });
ok(true, 'Fall 1 abgeschlossen');

const weiter = page.locator('#anklage button', { hasText: 'Nächster Fall' });
ok(await weiter.count() === 1, `Der Abschluss bietet „${(await weiter.textContent())?.trim()}" an`);

/* --- Hinueber ------------------------------------------------------------ */
await weiter.click();
await page.waitForFunction(() => window.__ready === true, { timeout: 40000 });
await page.evaluate(() => window.__regenstadt.freeze());
await page.waitForTimeout(900);

ok((await page.locator('#topbar .place').textContent()) === F2.orte[F2.start].name,
   `Fall 2 startet in „${F2.orte[F2.start].name}"`);
ok(await page.evaluate(() => window.__regenstadt.world.snapshot().clues.length) === 0,
   'Die Akte des alten Falls ist nicht mit hinübergekommen');

/* Die Karte zeigt die Sektoren des NEUEN Falls. */
await page.locator('#topbar .karte').click();
await page.waitForTimeout(500);
const ziele = await page.locator('#karte .ziel .z-n').allTextContents();
const erwartet = Object.values(F2.sektoren).length;
ok(ziele.length === erwartet, `Karte zeigt ${erwartet} Sektoren (${ziele.length})`);
ok(!ziele.some((z) => z.includes('Unterstadt')),
   `Keine Sektoren aus Fall 1 mehr: ${ziele.map((z) => z.split('·').pop().trim()).join(', ')}`);
await page.keyboard.press('Escape');

/* Eine Figur des neuen Falls muss ansprechbar sein. */
const personOrt = Object.values(F2.orte).find((o) => o.spots.some((s) => s.kind === 'person'));
await page.evaluate((o) => window.__regenstadt.goTo(o), personOrt.id);
await page.waitForTimeout(1300);
await page.locator('#hs-layer .hs.person').first().click({ force: true });
await page.waitForSelector('#panel.on');
await page.locator('#panel button', { hasText: 'Ansprechen' }).click();
await page.waitForSelector('#talk.on');
const name = (await page.locator('#talk .who .n').textContent())?.trim();
ok(Object.values(F2.figuren).some((f) => f.name === name),
   `Figur aus Fall 2 spricht: ${name}`);
await page.keyboard.press('Escape');

/* --- Und der Wechsel ueberlebt ein Neuladen ------------------------------ */
await page.waitForTimeout(900);
await page.goto(url, { waitUntil: 'load' });
const ja = page.locator('#weiter .ja');
ok(await ja.count() === 1, 'Nach dem Neuladen liegt ein Stand von Fall 2 vor');
await ja.click();
await page.waitForFunction(() => window.__ready === true, { timeout: 40000 });
await page.waitForTimeout(700);
const wieder = (await page.locator('#topbar .place').textContent())?.trim();
ok(Object.values(F2.orte).some((o) => o.name === wieder),
   `Nach dem Neuladen wieder in Fall 2: ${wieder}`);

await browser.close();
console.log(schlecht ? `\n${schlecht} Fehler.` : '\nAlles gruen.');
process.exit(schlecht ? 1 : 0);
