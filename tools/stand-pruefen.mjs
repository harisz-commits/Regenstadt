/**
 * Prueft, dass ein Spielstand ein Neuladen ueberlebt.
 *
 * Der Kern dieser Sache ist nicht das Schreiben — das tut `localStorage` von
 * selbst. Der Kern ist, dass NACH dem Neuladen wirklich alles wieder da ist:
 * Ort, Spuren, Asservate, laufende Laborbefunde mit ihrer Restzeit, und die
 * Punkte, die schon in der Akte stehen. Genau das laesst sich nur mit einem
 * echten Neuladen pruefen, nicht durch Hinsehen im Code.
 *
 *   npm run build && npx vite preview --port 4173
 *   node tools/stand-pruefen.mjs
 */

import { chromium } from 'playwright';

const argv = process.argv.slice(2);
const arg = (n, d) => { const i = argv.indexOf('--' + n); return i === -1 ? d : argv[i + 1]; };
const url = arg('url', 'http://127.0.0.1:4173/');

let schlecht = 0;
const ok = (b, t) => { if (!b) schlecht++; console.log(`${b ? 'ok  ' : 'FEHL'}  ${t}`); };

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium',
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-gpu-sandbox'],
});
const page = await browser.newPage({ viewport: { width: 1400, height: 820 } });
page.on('pageerror', (e) => { schlecht++; console.log('SEITENFEHLER', String(e)); });

async function laden() {
  await page.goto(url, { waitUntil: 'load' });
  // Beim ersten Mal gibt es nichts fortzusetzen; danach schon.
  const weiter = page.locator('#weiter .ja');
  const gefragt = await weiter.count() > 0;
  if (gefragt) await weiter.click();
  await page.waitForFunction(() => window.__ready === true, { timeout: 40000 });
  await page.evaluate(() => window.__regenstadt.freeze());
  return gefragt;
}

/* --- Erster Durchgang: etwas erleben ------------------------------------ */
ok(!(await laden()), 'Beim ersten Start wird nicht nach einem Stand gefragt');

/** Einen Punkt untersuchen und in die Akte legen. */
async function untersuche(ort, punktLabel, mitnehmen = false) {
  await page.evaluate((o) => window.__regenstadt.goTo(o), ort);
  await page.waitForTimeout(1200);
  await page.locator(`#hs-layer .hs[aria-label="${punktLabel}"]`).click({ force: true });
  await page.waitForSelector('#panel.on');
  if (mitnehmen) {
    const m = page.locator('#panel button', { hasText: 'Mitnehmen' });
    if (await m.count()) await m.first().click();
  }
  const a = page.locator('#panel button', { hasText: 'In die Akte' });
  if (await a.count()) await a.first().click();
  await page.locator('#panel button', { hasText: 'Weiter' }).click();
  await page.waitForTimeout(200);
}

await untersuche('alley', 'Kistenstapel');                 // Hinweis: zollsiegel
await untersuche('alley2', 'Müllcontainer', true);         // Asservat: Schlüsselkarte
await untersuche('backroom', 'Werkbank', true);            // Asservat: Tuch

// Das Tuch ins Labor geben — eine laufende Analyse ist der empfindlichste
// Teil des Standes, weil an ihr eine Restzeit haengt.
await page.evaluate(() => window.__regenstadt.goTo('precinct'));
await page.waitForTimeout(1200);
await page.locator('#hs-layer .hs[aria-label="Laborschalter"]').click({ force: true });
await page.waitForSelector('#panel.on');
await page.locator('#panel button', { hasText: 'Abgeben' }).first().click();
await page.waitForTimeout(300);

await page.evaluate(() => window.__regenstadt.goTo('crossing'));
await page.waitForTimeout(1200);

const vorher = await page.evaluate(() => {
  const w = window.__regenstadt.world.snapshot();
  return {
    ort: document.querySelector('#topbar .place').textContent,
    akte: document.querySelector('#topbar .right:not(.karte):not(.help)').textContent,
    clues: w.clues.slice().sort(),
    items: w.items.slice().sort(),
    taken: w.taken.slice().sort(),
    analysen: w.analysen,
  };
});
console.log(`\n  vor dem Neuladen: ${vorher.ort} · ${vorher.akte} · `
          + `${vorher.clues.length} Spuren · ${vorher.analysen.length} im Labor\n`);

// Der Stand wird gebuendelt geschrieben — kurz Luft lassen.
await page.waitForTimeout(900);

/* --- Neu laden ----------------------------------------------------------- */
ok(await laden(), 'Nach dem Neuladen wird nach dem Stand gefragt');

const nachher = await page.evaluate(() => {
  const w = window.__regenstadt.world.snapshot();
  return {
    ort: document.querySelector('#topbar .place').textContent,
    akte: document.querySelector('#topbar .right:not(.karte):not(.help)').textContent,
    clues: w.clues.slice().sort(),
    items: w.items.slice().sort(),
    taken: w.taken.slice().sort(),
    analysen: w.analysen,
  };
});

const gleich = (a, b) => JSON.stringify(a) === JSON.stringify(b);
ok(nachher.ort === vorher.ort, `Ort: ${nachher.ort}`);
ok(nachher.akte === vorher.akte, `Akte: ${nachher.akte}`);
ok(gleich(nachher.clues, vorher.clues), `Spuren: ${nachher.clues.join(', ')}`);
ok(gleich(nachher.items, vorher.items), `Asservate: ${nachher.items.join(', ') || '—'}`);
ok(gleich(nachher.taken, vorher.taken), `Aufgehobenes bleibt aufgehoben: ${nachher.taken.join(', ')}`);
ok(gleich(nachher.analysen, vorher.analysen),
   `Labor mit Restzeit: ${JSON.stringify(nachher.analysen)}`);

/* Ein abgehefteter Punkt ist nach dem Neuladen ERLEDIGT — sein Leuchtpunkt
   gehoert weg. Vorher hat der Test nur geprueft, dass „In die Akte" nicht
   noch einmal angeboten wird; seit die Punkte erloeschen, ist die Abwesenheit
   des Punktes die staerkere Zusicherung: Sie beweist, dass `gesehen` den
   Neustart ueberlebt hat UND dass die Anzeige daraus folgt. */
await page.evaluate(() => window.__regenstadt.goTo('alley'));
await page.waitForTimeout(1200);
ok(await page.locator('#hs-layer .hs[aria-label="Kistenstapel"]').count() === 0,
   'Der erledigte Punkt leuchtet nach dem Neuladen nicht mehr');
ok(await page.locator('#hs-layer .hs[aria-label="Leuchtreklame"]').count() === 1,
   'Ein unerledigter Punkt am selben Ort leuchtet weiter');

/* --- Ein Gespraech ueber das Neuladen hinweg -----------------------------
   Gemeldet aus dem Spiel: „Keine Antwort — undefined is not an object
   (evaluating 'd.gefragt.push')", zuverlaessig nach einer laengeren Pause.
   Die Pause war nur der Anlass — wer das Handy weglegt, kommt auf eine neu
   geladene Seite zurueck. Die Ursache war, dass beim Zuruecklesen des
   Gespraechsstandes die Liste der gestellten Fragen wegfiel; der Eintrag
   existierte danach, war aber unvollstaendig, und die erste Frage lief in ein
   `undefined.push`.

   Der Test muss deshalb WIRKLICH fragen, und zwar nach dem Neuladen. Ein
   Blick auf die gesicherten Daten haette den Fehler nicht gefunden: dort
   stand alles drin. */
async function frageEtwas(ort, punktLabel) {
  await page.evaluate((o) => window.__regenstadt.goTo(o), ort);
  await page.waitForTimeout(1200);
  await page.locator(`#hs-layer .hs[aria-label="${punktLabel}"]`).click({ force: true });
  await page.waitForSelector('#panel.on');
  await page.locator('#panel button', { hasText: 'Ansprechen' }).click();
  await page.waitForSelector('#talk.on');
  /* Auf Fragen ODER eine Stoerung warten. Nur auf Schaltflaechen zu warten
     laesst den Test 45 Sekunden lang haengen, wenn das Modell einmal nichts
     Brauchbares liefert — und meldet dann einen Zeitfehler statt der Sache,
     um die es geht. */
  await page.waitForFunction(() => {
    const s = document.querySelector('#talk .sug');
    return Boolean(s && !s.classList.contains('laedt')
      && (s.querySelector('button') || s.querySelector('.aus') || s.querySelector('.stoerung')));
  }, { timeout: 60000 });
  if (!await page.locator('#talk .sug button').count()) {
    const grund = (await page.locator('#talk .sug').innerText()).replace(/\s+/g, ' ');
    await page.keyboard.press('Escape');
    return `KEINE FRAGEN: ${grund}`;
  }
  await page.locator('#talk .sug button').first().click();
  // Auf die Antwort warten: der Platzhalter „… überlegt" muss verschwinden.
  await page.waitForFunction(
    () => !document.querySelector('#talk .thinking'), { timeout: 60000 });
  await page.waitForTimeout(400);
  const text = await page.locator('#talk .log').innerText();
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  return text;
}

const vorReload = await frageEtwas('bar', 'Wirtin');
ok(!/undefined|is not an object|Keine Antwort/i.test(vorReload),
   'Vor dem Neuladen antwortet die Figur');

// Ortswechsel, damit der Gespraechsstand gesichert wird.
await page.evaluate(() => window.__regenstadt.goTo('alley'));
await page.waitForTimeout(1400);

ok(await laden(), 'Der Stand mit dem Gespräch wird beim Neuladen angeboten');
const nachReload = await frageEtwas('bar', 'Wirtin');
ok(!/undefined|is not an object/i.test(nachReload),
   'Nach dem Neuladen läuft das Gespräch ohne Fehler weiter');
ok(!/Keine Antwort/i.test(nachReload),
   `Nach dem Neuladen kommt eine echte Antwort${/Keine Antwort/.test(nachReload) ? ': ' + nachReload.slice(-160) : ''}`);

/* --- Verwerfen ----------------------------------------------------------- */
await page.locator('#topbar .right:not(.karte):not(.help)').click();
await page.waitForSelector('#akte.on');
const weg = page.locator('#akte button.gefahr');
await weg.click();                                  // erster Klick: nachfragen
ok((await weg.textContent())?.includes('verwerfen'), 'Neuanfang fragt erst nach');
await weg.click();                                  // zweiter Klick: wirklich
await page.waitForFunction(() => window.__ready === true, { timeout: 40000 });
ok(await page.locator('#weiter').count() === 0, 'Nach dem Verwerfen liegt kein Stand mehr vor');
const leer = await page.evaluate(() => window.__regenstadt.world.snapshot().clues.length);
ok(leer === 0, `Frische Ermittlung: ${leer} Spuren`);

await browser.close();
console.log(schlecht ? `\n${schlecht} Fehler.` : '\nAlles gruen.');
process.exit(schlecht ? 1 : 0);
