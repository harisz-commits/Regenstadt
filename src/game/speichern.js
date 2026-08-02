/**
 * Den Spielstand sichern — im Browser, nicht auf einem Server.
 *
 * Warum kein Konto mit E-Mail: Dafuer braeuchte es eine Datenbank, eine
 * Anmeldung, ein Passwort-Zuruecksetzen und eine Datenschutzerklaerung — und
 * am Ende laege der Stand irgendwo, wo er niemandem nutzt. Was hier gebraucht
 * wird, ist das Gegenteil: Wer das Spiel auf seinem Geraet spielt, soll SEINEN
 * Stand haben, und zwar ohne sich irgendwo anzumelden. Genau das ist
 * `localStorage`.
 *
 * Zwei Eigenschaften muss man dabei kennen, weil sie sonst als Fehler
 * erscheinen:
 *
 *   - Der Stand haengt an Browser UND Geraet. Dasselbe Spiel in Chrome und in
 *     Safari sind zwei Ermittlungen. Das ist hier erwuenscht — zwei Leute an
 *     zwei Telefonen kommen sich nicht ins Gehege.
 *   - Im privaten Fenster ist er nach dem Schliessen weg, und iOS raeumt
 *     `localStorage` von selten besuchten Seiten nach einigen Wochen ab.
 *
 * GESPEICHERT WIRD NUR, WAS DAS SPIEL NICHT SELBST WEISS.
 *
 * Gegenstaende stehen mit ihrer Kennung im Stand, nicht mit ihrem Text — der
 * kommt beim Zuruecklesen frisch aus scenes.js. Sonst laege im Speicher eine
 * alte Fassung jeder Beschreibung, und wer morgen einen Satz aendert, saehe
 * ihn bei sich selbst nie wieder. Notizen dagegen stammen zum Teil aus den
 * Verhoeren und wurden vom Modell geschrieben; die stehen woertlich drin,
 * weil sie sonst niemand rekonstruieren kann.
 */

import { SCENES, START } from './scenes.js';

const SCHLUESSEL = 'regenstadt.stand';
/** Welcher Fall zuletzt gewaehlt wurde — ueberlebt das Neuladen. */
const FALL_SCHLUESSEL = 'regenstadt.fall';
/** Bei einem Bruch im Aufbau hochzaehlen — alte Staende werden dann verworfen. */
const FASSUNG = 1;

/**
 * Alle Gegenstaende des LAUFENDEN Falls, nach Kennung.
 *
 * Bewusst eine Funktion und keine Konstante: Die erste Fassung hat die Liste
 * einmal beim Laden des Moduls gebaut — aus dem Fall, der damals aktiv war.
 * Nach einem Fallwechsel haette sie die Gegenstaende des alten Falls
 * enthalten, und jedes Asservat aus dem neuen waere beim Zuruecklesen
 * lautlos verschwunden. Zwanzig Orte durchzugehen kostet nichts.
 */
function gegenstaende() {
  const m = new Map();
  for (const ort of Object.values(SCENES)) {
    for (const s of ort.spots) if (s.item) m.set(s.item.id, s.item);
  }
  return m;
}

/** Ist ueberhaupt ein Speicher da? Im privaten Fenster mancher Browser nicht. */
function speicher() {
  try {
    const s = window.localStorage;
    // Nicht nur auf Vorhandensein pruefen: Safari im privaten Modus liefert
    // ein Objekt, das beim Schreiben wirft.
    s.setItem(SCHLUESSEL + '.probe', '1');
    s.removeItem(SCHLUESSEL + '.probe');
    return s;
  } catch { return null; }
}

/** @returns {object|null} der gesicherte Stand, oder nichts */
export function lesen() {
  const s = speicher();
  if (!s) return null;
  try {
    const roh = s.getItem(SCHLUESSEL);
    if (!roh) return null;
    const stand = JSON.parse(roh);
    if (stand?.v !== FASSUNG) return null;
    if (!SCENES[stand.ort]) return null;      // Ort umbenannt oder entfernt
    return stand;
  } catch { return null; }
}

export function schreiben(stand) {
  const s = speicher();
  if (!s) return false;
  try {
    s.setItem(SCHLUESSEL, JSON.stringify({ ...stand, v: FASSUNG, zeit: Date.now() }));
    return true;
  } catch {
    // Voller Speicher. Kein Grund, das Spiel anzuhalten — es laeuft weiter,
    // nur ohne Sicherung.
    return false;
  }
}

export function loeschen() {
  const s = speicher();
  if (s) try { s.removeItem(SCHLUESSEL); } catch { /* dann eben nicht */ }
}

export const moeglich = () => speicher() !== null;

/* --- Welcher Fall laeuft -------------------------------------------------
   Steht getrennt vom Spielstand: Wer den naechsten Fall anfaengt, wirft den
   alten Stand weg, aber die Wahl muss den Neustart ueberleben. */

export function merkeFall(id) {
  const s = speicher();
  if (s) try { s.setItem(FALL_SCHLUESSEL, id); } catch { /* dann eben nicht */ }
}
export function gemerkterFall() {
  const s = speicher();
  try { return s?.getItem(FALL_SCHLUESSEL) || null; } catch { return null; }
}

/**
 * Aus dem gesicherten Zustand wieder etwas machen, mit dem die Welt arbeiten
 * kann: Kennungen zurueck in Gegenstaende.
 */
export function welteinlesen(welt) {
  const GEGENSTAENDE = gegenstaende();
  return {
    clues: welt?.clues || [],
    taken: welt?.taken || [],
    moves: welt?.moves || 0,
    items: (welt?.items || []).map((id) => GEGENSTAENDE.get(id)).filter(Boolean),
    analysen: (welt?.analysen || [])
      .map((a) => ({ item: GEGENSTAENDE.get(a.id), rest: a.rest }))
      .filter((a) => a.item),
  };
}

/** „vor 3 Stunden", „gerade eben" — fuer die Zeile auf dem Startbild. */
function wielange(zeit) {
  const s = Math.max(0, (Date.now() - zeit) / 1000);
  if (s < 90) return 'gerade eben';
  const min = Math.round(s / 60);
  if (min < 60) return `vor ${min} Minuten`;
  const std = Math.round(min / 60);
  if (std < 24) return `vor ${std} ${std === 1 ? 'Stunde' : 'Stunden'}`;
  const tag = Math.round(std / 24);
  return `vor ${tag} ${tag === 1 ? 'Tag' : 'Tagen'}`;
}

const CSS = `
#weiter {
  position: fixed; inset: 0; z-index: 60; display: flex;
  align-items: center; justify-content: center; flex-direction: column;
  background: #04060b; padding: 30px;
  font: 13px/1.9 ui-monospace, "SFMono-Regular", Menlo, monospace; color: #9fb4cc;
  text-align: center;
}
#weiter .t { font-size: 11px; letter-spacing: .28em; color: #2ee6ff; margin-bottom: 40px; }
#weiter .z { font-size: 14px; color: #dbe9f7; letter-spacing: .08em; }
#weiter .d { font-size: 12px; opacity: .55; margin-top: 8px; max-width: 46ch; }
#weiter .k { display: flex; gap: 12px; margin-top: 34px; flex-wrap: wrap; justify-content: center; }
#weiter button {
  font: inherit; font-size: 11px; letter-spacing: .18em; text-transform: uppercase;
  padding: 13px 22px; cursor: pointer; color: #9ec8e4;
  background: rgba(126,190,230,.07); border: 1px solid rgba(126,190,230,.3);
  transition: background .15s, border-color .15s;
}
#weiter button:hover { background: rgba(126,190,230,.16); border-color: rgba(126,190,230,.6); }
#weiter button.ja { color: #ffbe74; border-color: rgba(255,190,116,.45); background: rgba(255,190,116,.08); }
#weiter button.ja:hover { background: rgba(255,190,116,.18); }
`;

/**
 * Fragen, ob fortgesetzt werden soll.
 *
 * Bewusst eine Frage und kein stilles Wiederherstellen: Wer das Spiel jemandem
 * zeigen will, soll nicht mitten in einer fremden Ermittlung landen — und wer
 * weiterspielen will, soll nicht erst ein Menue suchen.
 *
 * @param {object} stand
 * @returns {Promise<boolean>} true = fortsetzen
 */
export function frageFortsetzen(stand) {
  const style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  const el = document.createElement('div');
  el.id = 'weiter';
  const ort = SCENES[stand.ort]?.name || 'unterwegs';
  const spuren = stand.notizen?.length || 0;
  const stuecke = stand.welt?.items?.length || 0;
  const teile = [
    ort,
    `${spuren} ${spuren === 1 ? 'Spur' : 'Spuren'}`,
    stuecke ? `${stuecke} ${stuecke === 1 ? 'Asservat' : 'Asservate'}` : null,
  ].filter(Boolean);

  el.innerHTML = `
    <div class="t">REGENSTADT</div>
    <div class="z">Eine angefangene Ermittlung liegt vor.</div>
    <div class="d"></div>
    <div class="k">
      <button class="ja" type="button">Fortsetzen</button>
      <button class="neu" type="button">Neu beginnen</button>
    </div>`;
  el.querySelector('.d').textContent = `${teile.join(' · ')} — ${wielange(stand.zeit || Date.now())}.`;
  document.body.appendChild(el);

  return new Promise((fertig) => {
    const schliessen = (weiter) => { el.remove(); style.remove(); fertig(weiter); };
    el.querySelector('.ja').onclick = () => schliessen(true);
    el.querySelector('.neu').onclick = () => { loeschen(); schliessen(false); };
    el.querySelector('.ja').focus();
  });
}

/** Wo das Spiel beginnt, wenn nichts gesichert ist. */
export { START };
