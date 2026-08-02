/**
 * Prueft, dass ein Verhoer die Ermittlung voranbringt.
 *
 * Gemeldet wurde: „aktuell bringen gespraeche nichts". Das stimmte — `talk.js`
 * kannte das Wort Hinweis nicht, eine `[SPUR]` wurde zu einer Notiz und nie zu
 * einem Schluessel. Reden war Deko.
 *
 * Jetzt tragen die Figuren Gestaendnisse als Daten: eine Bedingung, ein Text
 * und ein echter Hinweis. Der Test haelt einer Figur das Passende vor und
 * schaut, ob am Ende ein Hinweis in der Welt steht — nicht nur eine Zeile in
 * der Akte.
 *
 * Ausserdem geprueft, weil beides gemeldet war:
 *   - Es sind immer VIER Fragen, nicht mal drei, mal vier.
 *   - Keine Frage kommt zweimal, auch nicht umformuliert.
 *   - Die Notfall-Liste („Was verschweigen Sie mir?") taucht nirgends auf.
 *
 *   npm run build && npx vite preview --port 4173
 *   node tools/gespraech-pruefen.mjs
 */

import { chromium } from 'playwright';
import { FIGUREN } from '../src/faelle/fall1/figuren.js';

const argv = process.argv.slice(2);
const arg = (n, d) => { const i = argv.indexOf('--' + n); return i === -1 ? d : argv[i + 1]; };
const url = arg('url', 'http://127.0.0.1:4173/');
const runden = Number(arg('runden', 6));

let schlecht = 0;
const ok = (b, t) => { if (!b) schlecht++; console.log(`${b ? 'ok  ' : 'FEHL'}  ${t}`); };

/** Die drei Fragen aus der alten Notfall-Liste — sie duerfen nie erscheinen. */
const NOTFALL = ['Wie lange stehen Sie hier schon?', 'Wer war heute Abend noch hier?',
                 'Was verschweigen Sie mir?'];

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

/* Doran Vey gesteht, wem die Kisten gehoeren — sobald man das Zollsiegel hat.
   Den Spielstand dafuer setzen wir direkt; getestet wird das Gespraech. */
const figur = FIGUREN['p-coat'];
const ziel = figur.spuren[0];
console.log(`\n  ${figur.name} — erwartet wird das Gestaendnis „${ziel.id}"`);
console.log(`  Es soll den Hinweis "${ziel.clue}" setzen.\n`);

/* Den Beweis auf dem ECHTEN Weg holen, nicht per addClue.
   Ein Hinweis allein reicht naemlich nicht: Die Fragen speisen sich aus der
   AKTE, und die fuellt erst der Knopf „In die Akte". Wer nur den Hinweis
   setzt, laesst die Figur mit leeren Haenden dastehen — und dann gibt es
   nichts vorzuhalten. */
await page.evaluate(() => window.__regenstadt.goTo('alley'));
await page.waitForTimeout(1400);
await page.locator('#hs-layer .hs[aria-label="Kistenstapel"]').click({ force: true });
await page.waitForSelector('#panel.on');
await page.locator('#panel button', { hasText: 'In die Akte' }).click();
await page.locator('#panel button', { hasText: 'Weiter' }).click();
await page.waitForTimeout(700);
ok(await page.evaluate((c) => window.__regenstadt.world.hasClue(c), ziel.wenn.clue),
   `Voraussetzung "${ziel.wenn.clue}" liegt in der Akte`);
await page.locator('#hs-layer .hs[aria-label="Gestalt im Mantel"]').click({ force: true });
await page.waitForSelector('#panel.on');
await page.locator('#panel button', { hasText: 'Ansprechen' }).click();
await page.waitForSelector('#talk.on');
await page.waitForSelector('#talk .sug button', { timeout: 40000 });

const alleFragen = [];
let vorhalteGesehen = 0;
let anzahlen = [];

for (let i = 1; i <= runden; i++) {
  const knoepfe = page.locator('#talk .sug button');
  const n = await knoepfe.count();
  if (!n) break;
  anzahlen.push(n);

  const texte = await knoepfe.allTextContents();
  alleFragen.push(...texte.map((t) => t.trim()));
  // Wenn ein Vorhalt dabei ist, den nehmen — der bricht etwas auf.
  const vorhalt = page.locator('#talk .sug button.hold');
  const nimm = await vorhalt.count() ? vorhalt.first() : knoepfe.first();
  if (await vorhalt.count()) vorhalteGesehen += 1;
  const gewaehlt = (await nimm.textContent()).trim();
  await nimm.click();

  await page.waitForFunction(() => {
    const t = document.querySelectorAll('#talk .turn');
    const a = t[t.length - 1]?.querySelector('.a');
    if (!a || a.querySelector('.thinking')) return false;
    const sug = document.querySelector('#talk .sug');
    if (sug.classList.contains('laedt')) return false;
    return sug.querySelector('button') || sug.querySelector('.aus') || sug.querySelector('.stoerung');
  }, { timeout: 60000 });

  const spur = await page.locator('#talk .spur').count();
  const antworten = await page.locator('#talk .turn .a').allTextContents();
  console.log(`   ${i}. ${n} Fragen · F: ${gewaehlt.slice(0, 58)}`);
  console.log(`      A: ${(antworten[antworten.length - 1] || '').trim().slice(0, 110)}${spur ? '\n      → SPUR' : ''}`);

  if (await page.evaluate((c) => window.__regenstadt.world.hasClue(c), ziel.clue)) break;
}

/* --- Auswertung --------------------------------------------------------- */
const hat = await page.evaluate((c) => window.__regenstadt.world.hasClue(c), ziel.clue);
ok(hat, `Das Gespräch hat den Hinweis "${ziel.clue}" gesetzt`);
ok(await page.locator('#talk .spur').count() > 0, 'Der Fund steht sichtbar im Verlauf');

ok(anzahlen.every((n) => n === 4), `Immer vier Fragen (${anzahlen.join(', ')})`);
ok(vorhalteGesehen > 0, `Vorhalte angeboten (in ${vorhalteGesehen} von ${anzahlen.length} Runden)`);

const norm = (s) => s.toLowerCase().replace(/[^a-zäöüß ]/g, '').split(/\s+/)
  .filter((w) => w.length > 3).sort().join(' ');
const gesehen = new Set();
const doppelt = alleFragen.filter((f) => { const k = norm(f); if (gesehen.has(k)) return true; gesehen.add(k); return false; });
ok(doppelt.length === 0, `Keine Frage doppelt${doppelt.length ? ': ' + doppelt[0] : ''}`);

const notfall = alleFragen.filter((f) => NOTFALL.includes(f));
ok(notfall.length === 0, `Keine Notfall-Fragen${notfall.length ? ': ' + notfall.join(' | ') : ''}`);

const DEUTSCH = /[äöüßÄÖÜ]|\b(sie|ihr|ihre|ihren|ihrem|ihnen|warum|wann|wer|was|wie|welche[rsn]?|haben|hat|hatten|ist|sind|war|waren|der|die|das|des|dem|den|und|noch|nicht|dort|hier|bei|von|aus|mit|auf|in|zu)\b/i;
const engl = alleFragen.filter((f) => !DEUTSCH.test(f));
ok(engl.length === 0, `Alles auf Deutsch${engl.length ? ': ' + engl[0] : ''}`);

await browser.close();
console.log(schlecht ? `\n${schlecht} Fehler.` : '\nAlles gruen.');
process.exit(schlecht ? 1 : 0);
