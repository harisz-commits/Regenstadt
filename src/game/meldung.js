/**
 * Meldungen — was sich woanders geändert hat.
 *
 * Das Spiel hatte schon eine Kurzmeldung (`toast` in interaction.js), und die
 * ist für „Befund abgeholt" genau richtig: eine Zeile, drei Sekunden, weg.
 *
 * Für die andere Sorte taugt sie nicht. Wenn jemand in der eigenen Wohnung
 * sitzt, ist das kein Nebenbei — und eine Einblendung, die von selbst
 * verschwindet, ist genau dann weg, wenn man gerade woanders hinsieht. Der
 * Spieler fliegt weiter und erfährt nie, dass es die Szene gab.
 *
 * Eine Meldung bleibt deshalb stehen, bis sie weggeklickt ist. Sie sagt, DASS
 * sich etwas geändert hat, und nicht, was man dort finden wird — ein Anlass,
 * kein Wegweiser.
 *
 * Welche es gibt, steht im Fall (`meldungen.js`), nicht hier.
 */

import { fall } from './fall.js';

const CSS = `
#meldung {
  position: fixed; inset: 0; z-index: 26; display: none;
  align-items: flex-end; justify-content: center;
  padding: 0 clamp(16px, 5vw, 60px) calc(52px + env(safe-area-inset-bottom));
  background: linear-gradient(to top, rgba(3,5,9,.72), rgba(3,5,9,0) 46%);
  font: 13px/1.8 ui-monospace, "SFMono-Regular", Menlo, monospace; color: #cfe0f0;
}
#meldung.on { display: flex; }
#meldung .karte {
  max-width: 60ch; width: 100%;
  background: rgba(6,10,16,.96);
  border: 1px solid rgba(255,96,96,.5);
  border-left-width: 3px;
  padding: 18px clamp(16px, 3vw, 26px) 16px;
  box-shadow: 0 18px 60px rgba(0,0,0,.8);
  /* Die Deckkraft haengt BEWUSST an keiner Animation.
     Die erste Fassung liess sie von 0 auf 1 laufen — und blieb gemessen auf 0
     stehen: Die Karte war im DOM, hatte die richtigen Masse und den richtigen
     Text, und war unsichtbar. Genau derselbe Fehler wie seinerzeit bei der
     Hotspot-Marke in interaction.js.
     Eine Meldung, die man wegklicken MUSS, darf nicht unsichtbar sein
     koennen. Animiert wird nur noch die Bewegung; bleibt die haengen, steht
     die Karte einfach sofort da. */
  opacity: 1;
  animation: meldungKommt .38s cubic-bezier(.22,.7,.3,1);
}
@keyframes meldungKommt {
  from { transform: translateY(16px); }
  to   { transform: translateY(0); }
}
/* Rot, und ohne Etikett darueber.
   „ETWAS HAT SICH GEAENDERT" stand als Ueberschrift ueber jeder Meldung und
   hat nur wiederholt, was der Satz darunter ohnehin sagt. Die Farbe macht das
   besser als ein Wort: Orange ist im Spiel die Farbe von Vorhalten und
   Befunden, Rot gibt es sonst nirgends — es heisst also nichts anderes als
   „hiervon solltest du wissen". */
#meldung .h { font-size: 15px; letter-spacing: .06em; color: #ffc9c9; margin-bottom: 10px; }
#meldung .b { opacity: .78; max-width: 56ch; }
#meldung button {
  font: inherit; font-size: 11px; letter-spacing: .18em; text-transform: uppercase;
  margin-top: 17px; padding: 11px 19px; cursor: pointer; color: #ff9c9c;
  background: rgba(255,96,96,.1); border: 1px solid rgba(255,96,96,.5);
}
#meldung button:hover { background: rgba(255,96,96,.22); }
@media (max-width: 820px) {
  #meldung { font-size: 14px; padding-bottom: calc(30px + env(safe-area-inset-bottom)); }
}
@media (prefers-reduced-motion: reduce) { #meldung .karte { animation: none; } }
`;

/**
 * @param {{ world: object, onGesehen: () => void }} host
 */
export function createMeldung(host) {
  const style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  const el = document.createElement('div');
  el.id = 'meldung';
  el.innerHTML = `
    <div class="karte">
      <div class="h"></div>
      <div class="b"></div>
      <button type="button">Verstanden</button>
    </div>`;
  document.body.appendChild(el);

  const hEl = el.querySelector('.h');
  const bEl = el.querySelector('.b');
  const knopf = el.querySelector('button');

  /** Schon gezeigte Meldungen. Kommt in den Spielstand. */
  const gezeigt = new Set();
  /** Was noch aussteht — es können mehrere auf einmal fällig werden. */
  const warteschlange = [];

  function zeige(m) {
    hEl.textContent = m.titel;
    bEl.textContent = m.text;
    el.classList.add('on');
    knopf.focus();
  }

  function weiter() {
    el.classList.remove('on');
    const naechste = warteschlange.shift();
    if (naechste) setTimeout(() => zeige(naechste), 260);
  }
  knopf.onclick = weiter;
  addEventListener('keydown', (e) => {
    if ((e.key === 'Escape' || e.key === 'Enter') && el.classList.contains('on')) weiter();
  });

  return {
    /**
     * Nachsehen, ob etwas fällig geworden ist.
     *
     * Wird nach jeder Änderung am Weltzustand gerufen. Mehrere gleichzeitig
     * fällige Meldungen kommen nacheinander, nicht übereinander.
     */
    pruefe() {
      for (const m of fall().meldungen || []) {
        if (gezeigt.has(m.id) || !host.world.meets(m.wenn)) continue;
        gezeigt.add(m.id);
        if (el.classList.contains('on')) warteschlange.push(m);
        else zeige(m);
        host.onGesehen?.();
      }
    },

    isOpen: () => el.classList.contains('on'),

    /* --- Spielstand ------------------------------------------------------ */
    stand: () => [...gezeigt],
    setStand(ids) {
      gezeigt.clear();
      for (const id of ids || []) gezeigt.add(id);
    },
  };
}
