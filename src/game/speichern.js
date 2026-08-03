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
import { FAELLE } from './fall.js';

const SCHLUESSEL = 'regenstadt.stand';
/** Welcher Fall zuletzt gewaehlt wurde — ueberlebt das Neuladen. */
const FALL_SCHLUESSEL = 'regenstadt.fall';
/** Welche Faelle schon abgeschlossen sind. Schaltet die Fallwahl frei. */
const FERTIG_SCHLUESSEL = 'regenstadt.abgeschlossen';
/** Einmalmarke „nicht fragen, sofort starten" — siehe nimmDirekt(). */
const DIREKT_SCHLUESSEL = 'regenstadt.direkt';
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

/* --- Welche Faelle schon durch sind ---------------------------------------
   Der Spielstand wird beim Anfangen eines neuen Falls weggeworfen; DASS ein
   Fall abgeschlossen wurde, muss das ueberleben. Sonst waere der zweite Fall
   nach dem ersten Durchlauf wieder verschlossen. */

/** Nach dem Nachspann aufrufen. */
export function merkeAbgeschlossen(id) {
  const s = speicher();
  if (!s) return;
  try {
    const liste = new Set(abgeschlossene());
    liste.add(id);
    s.setItem(FERTIG_SCHLUESSEL, JSON.stringify([...liste]));
  } catch { /* dann eben nicht */ }
}

/** @returns {string[]} Kennungen abgeschlossener Faelle */
export function abgeschlossene() {
  const s = speicher();
  try {
    const roh = s?.getItem(FERTIG_SCHLUESSEL);
    const l = roh ? JSON.parse(roh) : [];
    return Array.isArray(l) ? l : [];
  } catch { return []; }
}

/**
 * Einmalmarke: Der naechste Start soll NICHT fragen.
 *
 * „Nächster Fall" und „Denselben Fall von vorn" auf dem Abschlussbild laden
 * die Seite neu — der Spieler hat gerade gewaehlt und soll nicht sofort
 * dieselbe Frage noch einmal bekommen. Die Marke gilt genau einen Start lang.
 */
export function merkeDirekt() {
  const s = speicher();
  if (s) try { s.setItem(DIREKT_SCHLUESSEL, '1'); } catch { /* dann eben nicht */ }
}
export function nimmDirekt() {
  const s = speicher();
  if (!s) return false;
  try {
    const da = s.getItem(DIREKT_SCHLUESSEL) === '1';
    s.removeItem(DIREKT_SCHLUESSEL);
    return da;
  } catch { return false; }
}

/**
 * Welche Faelle zur Wahl stehen.
 *
 * Freigeschaltet ist der erste immer und jeder weitere, sobald der davor
 * abgeschlossen ist. Der naechste, noch nicht gespielte steht mit in der
 * Liste — er ist ja das Ziel.
 *
 * Wer schon beim zweiten Fall war, hat den ersten hinter sich, auch wenn das
 * damals niemand aufgeschrieben hat: Der gemerkte Fall zaehlt rueckwirkend
 * alles davor als erledigt. Sonst stuenden alte Spielstaende ploetzlich vor
 * einer Wahl, die sie sich laengst verdient haben.
 */
export function freigeschaltet() {
  const fertig = new Set(abgeschlossene());
  const bisher = FAELLE.findIndex((f) => f.id === gemerkterFall());
  for (let i = 0; i < bisher; i++) fertig.add(FAELLE[i].id);

  const out = [];
  for (const f of FAELLE) {
    out.push({ fall: f, fertig: fertig.has(f.id) });
    if (!fertig.has(f.id)) break;   // der uebernaechste bleibt zu
  }
  return out;
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
#weiter .liste {
  display: flex; flex-direction: column; gap: 10px;
  margin-top: 30px; width: min(440px, 88vw);
}
#weiter .liste button {
  display: flex; flex-direction: column; align-items: flex-start; gap: 5px;
  text-align: left; text-transform: none; letter-spacing: normal; padding: 15px 18px;
}
#weiter .liste .nr { font-size: 10px; letter-spacing: .24em; text-transform: uppercase; opacity: .6; }
#weiter .liste .ti { font-size: 14px; letter-spacing: .05em; color: #dbe9f7; }
#weiter .liste button.ja .ti { color: #ffd9a8; }
#weiter .liste .st { font-size: 11px; opacity: .5; }
/* Der weisse Standard-Fokusrahmen des Browsers schlaegt in diesem Bild ein
   Loch. Sichtbar bleiben muss er trotzdem — hier wird er nur eingefaerbt. */
#weiter button:focus-visible { outline: 1px solid rgba(255,190,116,.75); outline-offset: 3px; }
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

/**
 * Welchen Fall — gefragt wird nur, wenn es etwas zu wählen gibt.
 *
 * Wer den ersten Fall abgeschlossen hat, muss ihn nicht noch einmal fuehren,
 * um an den zweiten zu kommen. Und wer ihn noch einmal fuehren will, soll das
 * duerfen: Er geht anders aus, je nachdem, wen man anklagt.
 *
 * Solange nur ein Fall freigeschaltet ist, erscheint hier gar nichts — ein
 * Menue mit einem einzigen Eintrag ist kein Menue, sondern eine Verzoegerung.
 *
 * @returns {Promise<string|null>} Kennung des gewaehlten Falls, oder nichts
 */
export function frageFall() {
  const wahl = freigeschaltet();
  if (wahl.length < 2) return Promise.resolve(null);

  const style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  const el = document.createElement('div');
  el.id = 'weiter';
  el.innerHTML = `
    <div class="t">REGENSTADT</div>
    <div class="z">Womit fängst du an?</div>
    <div class="d">Ein abgeschlossener Fall bleibt offen für einen zweiten
      Durchgang — er geht anders aus, je nachdem, wen du anklagst.</div>
    <div class="liste"></div>`;

  const liste = el.querySelector('.liste');
  // Der naechste, noch nicht gespielte Fall ist der hervorgehobene: Wer hier
  // steht, ist meistens deshalb hier.
  const naechster = wahl.find((w) => !w.fertig) || wahl[wahl.length - 1];
  wahl.forEach((w, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    if (w === naechster) b.className = 'ja';
    b.innerHTML = '<span class="nr"></span><span class="ti"></span><span class="st"></span>';
    b.querySelector('.nr').textContent = `Fall ${i + 1}`;
    b.querySelector('.ti').textContent = w.fall.titel;
    b.querySelector('.st').textContent = w.fertig
      ? 'Abgeschlossen — noch einmal führen'
      : 'Noch nicht geführt';
    b.dataset.fall = w.fall.id;
    liste.appendChild(b);
  });
  document.body.appendChild(el);

  return new Promise((fertig) => {
    liste.onclick = (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      el.remove(); style.remove();
      fertig(b.dataset.fall);
    };
    liste.querySelector('button.ja')?.focus();
  });
}

/** Wo das Spiel beginnt, wenn nichts gesichert ist. */
export { START };
