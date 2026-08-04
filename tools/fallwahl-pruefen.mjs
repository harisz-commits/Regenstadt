/**
 * Prueft die Fallwahl beim Neustart.
 *
 * Alle drei Faelle sollen vom ersten Start an direkt waehlbar sein. Dabei
 * gibt es drei Startwege, die man leicht verwechselt:
 *
 *   1. Beim allerersten Start stehen ALLE Faelle zur Wahl.
 *   2. Nach „Nächster Fall" darf NICHT gefragt werden. Der Spieler hat gerade
 *      gewaehlt; die Frage sofort noch einmal zu stellen, sieht aus, als waere
 *      der Klick verlorengegangen. Dafuer gibt es die Einmalmarke in
 *      speichern.js (merkeDirekt/nimmDirekt).
 *   3. Bei „Neu beginnen" mit abgeschlossenem Fall MUSS gefragt werden.
 *
 *   npm run build && npx vite preview --port 4173
 *   node tools/fallwahl-pruefen.mjs
 */

import { chromium } from 'playwright';
import { FAELLE } from '../src/game/fall.js';

const argv = process.argv.slice(2);
const arg = (n, d) => { const i = argv.indexOf('--' + n); return i === -1 ? d : argv[i + 1]; };
const url = arg('url', 'http://127.0.0.1:4173/');

let schlecht = 0;
const ok = (b, t) => { if (!b) schlecht++; console.log(`${b ? 'ok  ' : 'FEHL'}  ${t}`); };

const [F1, F2, F3] = FAELLE;
ok(Boolean(F3), 'Es gibt einen dritten Fall');

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium',
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-gpu-sandbox'],
});
const page = await browser.newPage({ viewport: { width: 1200, height: 760 } });
page.on('pageerror', (e) => { schlecht++; console.log('SEITENFEHLER', String(e)); });

const wahl = () => page.locator('#weiter .liste button');
const ortJetzt = async () => (await page.locator('#topbar .place').textContent())?.trim();

/* --- 1. Erster Start: alle drei Faelle zur Wahl ------------------------- */
await page.goto(url, { waitUntil: 'load' });
await page.waitForTimeout(500);
ok(await wahl().count() === 3, `Beim ersten Start stehen drei Faelle zur Wahl (${await wahl().count()})`);
ok(await page.locator(`#weiter .liste button[data-fall="${F3.id}"]`).count() === 1,
   `Fall 3 steht sofort zur Wahl: "${F3.titel}"`);
await page.locator(`#weiter .liste button[data-fall="${F1.id}"]`).click();
await page.waitForFunction(() => window.__ready === true, { timeout: 40000 });
ok(await ortJetzt() === F1.orte[F1.start].name, `Es beginnt Fall 1 in „${F1.orte[F1.start].name}"`);

/* --- 2. Fall 1 gilt als abgeschlossen ------------------------------------ */
await page.evaluate((id) => {
  localStorage.setItem('regenstadt.abgeschlossen', JSON.stringify([id]));
  localStorage.removeItem('regenstadt.stand');
}, F1.id);
await page.goto(url, { waitUntil: 'load' });
await page.waitForTimeout(600);
ok(await wahl().count() === 3, `Jetzt stehen alle drei Fälle zur Wahl (${await wahl().count()})`);
const beschriftung = await wahl().allTextContents();
ok(beschriftung.some((t) => t.includes(F2.titel)), `Der zweite Fall steht mit Titel da: „${F2.titel}"`);
ok(beschriftung.some((t) => t.includes('Abgeschlossen')), 'Der gespielte Fall ist als abgeschlossen erkennbar');

/* Der hervorgehobene Knopf ist der noch nicht gespielte. */
const betont = await page.locator('#weiter .liste button.ja .ti').textContent();
ok(betont?.trim() === F2.titel, `Hervorgehoben ist der nächste Fall (${betont?.trim()})`);

await page.locator('#weiter .liste button.ja').click();
await page.waitForFunction(() => window.__ready === true, { timeout: 40000 });
await page.waitForTimeout(600);
ok(await ortJetzt() === F2.orte[F2.start].name, `Fall 2 beginnt in „${F2.orte[F2.start].name}"`);

/* --- 3. Nach der Wahl bleibt sie gemerkt --------------------------------- */
ok(await page.evaluate(() => localStorage.getItem('regenstadt.fall')) === F2.id,
   'Die Wahl überlebt als gemerkter Fall');

/* --- 4. „Neu beginnen" fragt wieder -------------------------------------- */
await page.waitForTimeout(900);   // Sicherung ist entprellt
await page.goto(url, { waitUntil: 'load' });
await page.waitForTimeout(600);
const neu = page.locator('#weiter .neu');
ok(await neu.count() === 1, 'Bei laufender Ermittlung wird zuerst nach Fortsetzen gefragt');
await neu.click();
await page.waitForTimeout(400);
ok(await wahl().count() === 3, 'Nach „Neu beginnen" stehen alle drei Fälle zur Wahl');
await page.locator('#weiter .liste button').first().click();
await page.waitForFunction(() => window.__ready === true, { timeout: 40000 });
await page.waitForTimeout(600);
ok(await ortJetzt() === F1.orte[F1.start].name,
   `Der erste Fall lässt sich noch einmal führen (${await ortJetzt()})`);

/* --- 5. Nach Fall 2 steht auch Fall 3 zur Wahl --------------------------- */
await page.evaluate(([f1, f2]) => {
  localStorage.setItem('regenstadt.abgeschlossen', JSON.stringify([f1, f2]));
  localStorage.removeItem('regenstadt.stand');
  localStorage.removeItem('regenstadt.direkt');
}, [F1.id, F2.id]);
await page.goto(url, { waitUntil: 'load' });
await page.waitForTimeout(600);
ok(await wahl().count() === 3, `Nach Fall 2 stehen drei Fälle zur Wahl (${await wahl().count()})`);
const dritter = page.locator(`#weiter .liste button[data-fall="${F3.id}"]`);
ok(await dritter.count() === 1, `Fall 3 steht mit Titel da: „${F3.titel}"`);
ok((await page.locator('#weiter .liste button.ja .ti').textContent())?.trim() === F3.titel,
   'Der dritte, noch nicht geführte Fall ist hervorgehoben');
await dritter.click();
await page.waitForFunction(() => window.__ready === true, { timeout: 40000 });
await page.waitForTimeout(600);
ok(await ortJetzt() === F3.orte[F3.start].name, `Fall 3 beginnt in „${F3.orte[F3.start].name}"`);

/* --- 6. Die Einmalmarke unterdrueckt genau einen Start -------------------- */
await page.evaluate(() => {
  localStorage.removeItem('regenstadt.stand');
  localStorage.setItem('regenstadt.direkt', '1');
});
await page.goto(url, { waitUntil: 'load' });
await page.waitForTimeout(600);
ok(await wahl().count() === 0, 'Mit Einmalmarke wird nicht gefragt');
await page.waitForFunction(() => window.__ready === true, { timeout: 40000 });
ok(await page.evaluate(() => localStorage.getItem('regenstadt.direkt')) === null,
   'Die Einmalmarke ist danach verbraucht');

await browser.close();
console.log(schlecht ? `\n${schlecht} Fehler.` : '\nAlles gruen.');
process.exit(schlecht ? 1 : 0);
