/**
 * Antwortzeiten im Verhoer messen.
 *
 * Stoppt jeden Aufruf an /api/chat einzeln und dazu, wie lange der Spieler
 * tatsaechlich ohne anklickbare Frage dasteht. Diese Zahlen sieht man auf
 * keinem Screenshot.
 *
 *   npm run build && npm run preview
 *   node tools/verhoer-zeiten.mjs
 *
 * ACHTUNG: Nach Aenderungen an api/chat.js muss der Vorschau-Server NEU
 * gestartet werden. Er laedt die Datei beim Start ueber vite.config.js; ein
 * laufender Server misst sonst stundenlang alten Code. Genau das hat hier
 * einmal neun Sekunden "Modelllatenz" vorgetaeuscht, die es nie gab.
 */
import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await b.newPage({ viewport: { width: 1280, height: 820 } });
p.on('pageerror', e => console.log('PAGEERROR', String(e).slice(0,200)));
// Jede API-Anfrage einzeln stoppen
const zeiten = [];
p.on('request', r => { if (r.url().includes('/api/chat')) r.__t = Date.now(); });
p.on('response', async r => {
  if (!r.url().includes('/api/chat')) return;
  const t = r.request().__t;
  let art = '?';
  try { const d = JSON.parse(r.request().postData()||'{}'); art = /Schreibe VIER Fragen/.test(d.system||'') ? 'FRAGEN' : 'ANTWORT'; } catch {}
  zeiten.push({ art, ms: Date.now() - t });
  console.log(`  API ${art.padEnd(7)} ${Date.now()-t} ms`);
});
await p.goto('http://127.0.0.1:4173/', { waitUntil: 'load' });
await p.evaluate(() => document.querySelector('#boot')?.remove());
await p.waitForFunction(() => document.querySelectorAll('#hs-layer .hs').length > 0, null, {timeout:20000});
const klick = (rx) => p.evaluate((r) => [...document.querySelectorAll('#hs-layer .hs')]
  .find(x => new RegExp(r,'i').test(x.getAttribute('aria-label')||''))?.click(), rx);
const knopf = (rx) => p.evaluate((r) => { const x=[...document.querySelectorAll('#panel .act button')]
  .find(y=>new RegExp(r,'i').test(y.textContent)); if(x){x.click();return true;} return false; }, rx);

await klick('Kistenstapel'); await p.waitForTimeout(2600); await knopf('Akte'); await knopf('Weiter');
console.log('\n--- Auf die Gestalt geklickt (Vorlauf startet) ---');
const tKlick = Date.now();
await klick('Gestalt mit Schirm'); await p.waitForTimeout(2600);

console.log('--- Verhör öffnen ---');
let t0 = Date.now();
await knopf('Ansprechen');
await p.waitForFunction(() => document.querySelectorAll('#talk .sug button').length > 0, null, {timeout:90000});
console.log(`GESAMT ab "Ansprechen" bis Fragen sichtbar: ${Date.now()-t0} ms`);

console.log('\n--- Frage stellen ---');
t0 = Date.now();
await p.evaluate(() => document.querySelector('#talk .sug button').click());
await p.waitForFunction(() => { const a=[...document.querySelectorAll('#talk .turn .a')].pop();
  return a && a.textContent.trim().length>0 && !a.querySelector('.thinking'); }, null, {timeout:90000});
const tAntwort = Date.now()-t0;
console.log(`  Antwort da nach: ${tAntwort} ms`);
console.log(`  Knöpfe in dieser Zeit weg? ${await p.evaluate(() => document.querySelectorAll('#talk .sug button').length === 0)}`);
// Auf das ENDE des Nachladens warten, nicht auf "irgendein Knopf da" — die
// alten bleiben jetzt absichtlich stehen.
await p.waitForFunction(() => { const s=document.querySelector('#talk .sug');
  return s && !s.classList.contains('laedt') && s.querySelectorAll('button').length>0; }, null, {timeout:90000});
console.log(`GESAMT bis neue Fragen: ${Date.now()-t0} ms  (davon ${Date.now()-t0-tAntwort} ms ohne Knöpfe)`);
console.log('NEUE FRAGEN:');
for (const f of await p.evaluate(() => [...document.querySelectorAll('#talk .sug button')].map(x=>x.textContent))) console.log('  •', f);
await b.close();
