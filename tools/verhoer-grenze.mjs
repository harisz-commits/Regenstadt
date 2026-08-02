/**
 * Prueft, dass ein Verhoer nach neun Fragen wirklich zu Ende ist.
 *
 * Gemeldet wurde: dreizehn bis fuenfzehn Fragen an dieselbe Figur, danach
 * blieb das Gespraech mit „Gespraechsverlauf zu lang" stehen. Zwei Ursachen,
 * beide behoben — aber genau deshalb muss das hier gemessen und nicht
 * behauptet werden:
 *
 *   1. Gezaehlt wurden nur Fragen OHNE neue Spur, und jede Spur setzte den
 *      Zaehler zurueck. Bei der ersten Figur ist anfangs fast jede Antwort
 *      neu — der Zaehler kam nie an.
 *   2. Der Endpunkt lehnte lange Verlaeufe ab, statt sie zu kuerzen.
 *
 * Der Test fragt stur weiter und schaut, wo Schluss ist. Er kostet neun bis
 * zehn Modellaufrufe.
 *
 *   npm run build && npx vite preview --port 4173
 *   node tools/verhoer-grenze.mjs
 */

import { chromium } from 'playwright';

const argv = process.argv.slice(2);
const arg = (n, d) => { const i = argv.indexOf('--' + n); return i === -1 ? d : argv[i + 1]; };
const url = arg('url', 'http://127.0.0.1:4173/');
const ort = arg('ort', 'alley');
const wer = arg('wer', 'p-umbrella');
/** Wie oft ueber die Grenze hinaus versucht wird. */
const MAX_FRAGEN = 9;
const VERSUCHE = Number(arg('versuche', 13));

let schlecht = 0;
const ok = (b, t) => { if (!b) schlecht++; console.log(`${b ? 'ok  ' : 'FEHL'}  ${t}`); };

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium',
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-gpu-sandbox'],
});
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
page.on('pageerror', (e) => { schlecht++; console.log('SEITENFEHLER', String(e)); });

await page.goto(url, { waitUntil: 'load' });
if (await page.locator('#weiter .neu').count()) await page.locator('#weiter .neu').click();
await page.waitForFunction(() => window.__ready === true, { timeout: 40000 });
await page.evaluate(() => window.__regenstadt.freeze());

await page.evaluate((o) => window.__regenstadt.goTo(o), ort);
await page.waitForTimeout(1400);
await page.locator(`#hs-layer .hs[aria-label]`).nth(0);   // Layer ist da
const punkt = page.locator('#hs-layer .hs.person').first();
await punkt.click({ force: true });
await page.waitForSelector('#panel.on');
await page.locator('#panel button', { hasText: 'Ansprechen' }).click();
await page.waitForSelector('#talk.on');
await page.waitForSelector('#talk .sug button', { timeout: 40000 });

const name = (await page.locator('#talk .who .n').textContent())?.trim();
console.log(`\n  ${name} — es wird ${VERSUCHE}-mal gefragt, erlaubt sind ${MAX_FRAGEN}.\n`);

let gestellt = 0;
let zu = 0;                       // bei welcher Frage die Tuer zuging
for (let i = 1; i <= VERSUCHE; i++) {
  const knoepfe = page.locator('#talk .sug button');
  if (await knoepfe.count() === 0) { zu = i; break; }

  await knoepfe.first().click();
  gestellt += 1;
  // Warten, bis die Antwort steht UND die naechste Runde entschieden ist.
  await page.waitForFunction(
    () => {
      const t = document.querySelectorAll('#talk .turn');
      const a = t[t.length - 1]?.querySelector('.a');
      if (!a || a.querySelector('.thinking')) return false;
      const sug = document.querySelector('#talk .sug');
      if (sug.classList.contains('laedt')) return false;
      return sug.querySelector('button') || sug.querySelector('.aus');
    },
    { timeout: 60000 },
  );

  const rest = await page.locator('#talk .sug .rest').count()
    ? (await page.locator('#talk .sug .rest').textContent()).trim() : '';
  console.log(`   ${String(i).padStart(2)}. gefragt${rest ? '   — ' + rest : ''}`);
}
if (!zu && await page.locator('#talk .sug button').count() === 0) zu = gestellt + 1;

/* --- Was dabei herauskam ------------------------------------------------ */
const fehler = await page.locator('#talk .turn .a.err').count();
ok(fehler === 0, `Keine Fehlermeldung im Verlauf (${fehler})`);

ok(gestellt === MAX_FRAGEN, `Genau ${MAX_FRAGEN} Fragen gingen durch (${gestellt})`);
ok(await page.locator('#talk .sug .aus').count() === 1,
   'Der Ermittler sagt selbst, dass nichts mehr kommt');
console.log('   „' + (await page.locator('#talk .sug .aus').textContent())?.trim() + '"');

// Auch die freie Eingabe muss zu sein — sonst tippt man die zehnte Frage.
ok(await page.locator('#talk input').isDisabled(), 'Freie Eingabe ist gesperrt');
ok(await page.locator('#talk .send').isDisabled(), 'Der Fragen-Knopf ist gesperrt');

/* --- Und wieder auf, sobald draussen etwas dazukommt --------------------- */
await page.keyboard.press('Escape');
await page.waitForTimeout(300);
// Etwas anderes untersuchen und abheften: eine Notiz von aussen.
const andere = page.locator('#hs-layer .hs:not(.person):not(.exit)').first();
await andere.click({ force: true });
await page.waitForSelector('#panel.on');
const heften = page.locator('#panel button', { hasText: 'In die Akte' });
ok(await heften.count() === 1, 'Es gibt etwas zum Abheften');
await heften.click();
await page.locator('#panel button', { hasText: 'Weiter' }).click();
// Die Tafel braucht 340 ms zum Hinausfahren. Vorher liegt sie noch ueber dem
// unteren Bilddrittel — und genau dort steht die Figur.
await page.waitForTimeout(700);

await punkt.click({ force: true });
await page.waitForSelector('#panel.on');
await page.locator('#panel button', { hasText: 'Ansprechen' }).click();
await page.waitForSelector('#talk.on');
await page.waitForSelector('#talk .sug button', { timeout: 40000 });
ok(await page.locator('#talk .sug button').count() > 0,
   'Mit einem neuen Fund ist wieder etwas zu fragen');
ok(!(await page.locator('#talk input').isDisabled()), 'Freie Eingabe ist wieder offen');

await browser.close();
console.log(schlecht ? `\n${schlecht} Fehler.` : '\nAlles gruen.');
process.exit(schlecht ? 1 : 0);
