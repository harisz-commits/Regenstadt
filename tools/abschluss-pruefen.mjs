/**
 * Den Abschluss im echten Browser durchspielen.
 *
 * `tools/welt-pruefen.mjs` prueft die Logik ohne Bild: dass die Kette
 * aufgeht und dass jeder Beleg auffindbar ist. Was es NICHT pruefen kann, ist
 * das, was am Ende tatsaechlich passiert — ob die Pinnwand anklickbar ist, ob
 * die Anklage geht, ob ein Nachspann kommt und wie lange er braucht.
 *
 * Genau da lagen bisher die Fehler dieses Projekts: Regen in Zeitlupe,
 * Schreibmaschine mit zwei Zeichen je Sekunde, neun Sekunden Wartezeit im
 * Verhoer. Keiner davon war im Code zu sehen, alle waren zu messen.
 *
 *   npm run build && npx vite preview --port 4173
 *   node tools/abschluss-pruefen.mjs                  # das gute Ende
 *   node tools/abschluss-pruefen.mjs --belege 1       # richtig, aber duenn
 *   node tools/abschluss-pruefen.mjs --wer p-coat     # der Irrtum
 *
 * ACHTUNG: Der Vorschau-Server muss nach jeder Aenderung an `api/chat.js` neu
 * gestartet werden. Ein alter Server hat in diesem Projekt schon dreimal
 * „Modell-Latenz" vorgetaeuscht, die keine war.
 */

import { chromium } from 'playwright';
import { LOESUNG } from '../src/game/anklage.js';

const argv = process.argv.slice(2);
const arg = (n, d) => { const i = argv.indexOf('--' + n); return i === -1 ? d : argv[i + 1]; };
const url = arg('url', 'http://127.0.0.1:4173/');
const wer = arg('wer', LOESUNG.taeter);
const bild = arg('bild', 'shots/abschluss.png');
/** Wie viele der tragenden Belege der Spieler hat. Weniger als alle → „Verdacht". */
const belege = Math.min(Number(arg('belege', LOESUNG.beweise.length)), LOESUNG.beweise.length);

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage({ viewport: { width: 1440, height: 810 } });
const fehler = [];
page.on('pageerror', (e) => fehler.push(String(e)));
// Die URL mitschreiben. „404 (Not Found)" ohne Adresse ist keine Meldung,
// sondern ein Raetsel.
page.on('response', (r) => { if (r.status() >= 400) fehler.push(`${r.status()} ${r.url()}`); });
page.on('requestfailed', (r) => fehler.push(`${r.failure()?.errorText} ${r.url()}`));
page.on('console', (m) => { if (m.type() === 'error' && !/status of \d+/.test(m.text())) fehler.push(m.text()); });

const schritt = (t) => console.log(`  ${t}`);
const ok = (b, t) => console.log(`${b ? 'ok  ' : 'FEHL'}  ${t}`);

await page.goto(url, { waitUntil: 'load' });
await page.waitForFunction(() => window.__ready === true, { timeout: 30000 });
await page.evaluate(() => window.__regenstadt.freeze());
schritt('Spiel geladen');

// Den Spielstand herstellen, den ein Spieler nach der ganzen Kette haette.
await page.evaluate((clues) => {
  for (const c of clues) window.__regenstadt.world.addClue(c);
}, [LOESUNG.voraussetzung.clue, ...LOESUNG.beweise.slice(0, belege).map((b) => b.clue)]);
schritt(`Beweislage gesetzt (${belege} von ${LOESUNG.beweise.length})`);

await page.evaluate(() => window.__regenstadt.goTo('wohnung'));
await page.waitForFunction(
  () => document.querySelector('#topbar .place')?.textContent?.includes('Wohnung'),
  { timeout: 20000 },
);
ok(true, 'Wohnung geladen');

// Die Pinnwand ist ein Punkt wie jeder andere — er muss anklickbar sein.
const pin = page.locator('#hs-layer .hs.anklage');
ok(await pin.count() === 1, 'Pinnwand ist genau einmal da');
// `force`, weil die Punkte JEDEN Frame neu gesetzt werden — sie stehen im
// Bild, nicht auf dem Schirm, und driften mit der Kamera. Playwright wartet
// sonst ewig darauf, dass die Schaltflaeche „stabil" wird, und das wird sie
// nie. `freeze()` allein reicht nicht: Der Punkt bewegt sich weiter im
// Subpixelbereich.
await pin.first().click({ force: true });
await page.waitForSelector('#panel.on', { timeout: 5000 });

const abschluss = page.locator('#panel button', { hasText: 'Den Fall abschließen' });
ok(await abschluss.count() === 1, 'Tafel bietet den Abschluss an');
await abschluss.click();
await page.waitForSelector('#anklage.on', { timeout: 5000 });

// Die Beweislage muss dastehen, und zwar abgehakt.
const belegt = await page.locator('#anklage .beweise .b.da').count();
ok(belegt === belege, `${belegt} von ${LOESUNG.beweise.length} Belegen abgehakt`);

const leute = await page.locator('#anklage .leute button').count();
ok(leute >= 7, `${leute} Verdaechtige zur Auswahl`);

// Ohne Auswahl darf nicht angeklagt werden.
ok(await page.locator('#anklage button.tat').isDisabled(), 'Ohne Namen keine Anklage');

// Die Auswahl laeuft ueber das Portrait, nicht ueber eine Kennung — also die
// Schaltflaeche mit dem passenden Bildpfad suchen. Kein dynamisches Import aus
// `/src/`: In der gebauten Fassung gibt es diesen Pfad nicht, das gab ein 404
// und war ein Fehler des Werkzeugs, nicht des Spiels.
const knopf = page.locator(`#anklage .leute button:has(img[src*="${wer.replace('p-', '')}"])`);
const ziel = await knopf.count() ? knopf.first() : page.locator('#anklage .leute button').first();
await ziel.click();
schritt(`Gewaehlt: ${(await ziel.locator('.n').textContent())?.trim()}`);

const tat = page.locator('#anklage button.tat');
ok(!(await tat.isDisabled()), 'Mit Namen ist die Anklage frei');

const t0 = Date.now();
await tat.click();
await page.waitForSelector('#anklage .ende', { timeout: 5000 });
const marke = (await page.locator('#anklage .ende .marke').textContent())?.trim();
const titel = (await page.locator('#anklage .ende h1').textContent())?.trim();
schritt(`Ausgang: ${marke} — „${titel}"`);

// Der Nachspann kommt vom Modell. Er darf dauern, aber er muss kommen.
await page.waitForFunction(
  () => !document.querySelector('#anklage .ende p')?.classList.contains('laedt'),
  { timeout: 60000 },
);
const dauer = (Date.now() - t0) / 1000;
const text = (await page.locator('#anklage .ende p').textContent())?.trim() || '';
ok(text.length > 150, `Nachspann steht (${text.length} Zeichen, ${dauer.toFixed(1)} s)`);
ok(dauer < 25, `Nachspann in unter 25 s (${dauer.toFixed(1)} s)`);
console.log('\n---\n' + text + '\n---\n');

ok(await page.locator('#anklage button.tat', { hasText: 'Von vorn' }).count() === 1,
   'Weg zurueck an den Anfang');

await page.screenshot({ path: bild });
schritt(`Bild: ${bild}`);

ok(fehler.length === 0, `Keine Fehler in der Konsole${fehler.length ? ': ' + fehler.join(' | ') : ''}`);
await browser.close();
