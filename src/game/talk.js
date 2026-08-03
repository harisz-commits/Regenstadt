/**
 * Verhör.
 *
 * Eine eigene Vollbildansicht, kein Aufsatz in der Untersuchungstafel: Ein
 * Gespräch dauert länger als ein Blick auf eine Kiste und braucht Platz für
 * Verlauf und Eingabe.
 *
 * Die Antworten kommen von einem Sprachmodell über `/api/chat`. Der Schlüssel
 * liegt dort auf der Serverseite — siehe `api/chat.js`.
 */

import { CHARACTERS, buildSystem, buildFragen, offeneGestaendnisse } from './characters.js';

const CSS = `
#talk {
  position: fixed; inset: 0; z-index: 32; display: none; flex-direction: column;
  background: rgba(3,5,9,.97);
  font: 14px/1.85 ui-monospace, "SFMono-Regular", Menlo, monospace; color: #cfe0f0;
}
#talk.on { display: flex; }
#talk .head {
  display: flex; gap: 18px; align-items: flex-start; flex-shrink: 0;
  padding: calc(18px + env(safe-area-inset-top)) clamp(18px, 5vw, 60px) 16px;
  border-bottom: 1px solid rgba(126,190,230,.16);
}
#talk .head img {
  width: 96px; height: 96px; object-fit: cover; flex-shrink: 0;
  border: 1px solid rgba(126,190,230,.22); filter: saturate(.9);
}
#talk .who { flex: 1; min-width: 0; }
#talk .who .n { font-size: 17px; letter-spacing: .16em; color: #eaf6ff; }
#talk .who .r { font-size: 11px; letter-spacing: .2em; text-transform: uppercase; color: rgba(255,150,90,.8); margin-top: 5px; }
#talk .who .a { font-size: 12.5px; line-height: 1.7; opacity: .62; margin-top: 9px; max-width: 62ch; }
#talk .head button { flex-shrink: 0; }

#talk .log { flex: 1; overflow-y: auto; padding: 22px clamp(18px, 5vw, 60px); }
#talk .turn { margin-bottom: 24px; max-width: 74ch; }
#talk .q { font-size: 10px; letter-spacing: .26em; text-transform: uppercase; color: #7fb4d8; margin-bottom: 8px; }
/* Bewusst auf .turn eingeschraenkt: der Steckbrief oben benutzt dieselbe
   Klasse und bekam sonst den orangen Balken der Antworten ab. */
#talk .turn .a { border-left: 2px solid rgba(255,150,90,.45); padding-left: 14px; white-space: pre-wrap; }
#talk .turn .a.err { border-color: rgba(255,90,90,.6); color: #ffb0b0; }
#talk .opener { opacity: .55; max-width: 66ch; font-style: italic; }
#talk .thinking { font-size: 11px; letter-spacing: .22em; text-transform: uppercase; color: rgba(255,190,116,.85); }

#talk .ask {
  flex-shrink: 0; border-top: 1px solid rgba(126,190,230,.16);
  padding: 16px clamp(18px, 5vw, 60px) calc(18px + env(safe-area-inset-bottom));
  display: grid; gap: 9px;
}
#talk .ask .sug { display: grid; gap: 8px; }
#talk .ask .sucht {
  font-size: 10px; letter-spacing: .26em; text-transform: uppercase;
  color: rgba(159,180,204,.5); padding: 11px 0;
}
/* Waehrend neue Fragen geholt werden, bleiben die alten stehen und bleiben
   anklickbar — nur matt. Vorher wurde die Zeile geleert, und der Spieler sass
   zehn Sekunden vor einem Verhoer ohne jede Schaltflaeche. */
#talk .ask .sug .aus {
  border-left: 2px solid rgba(255,190,116,.4); padding: 10px 0 10px 14px;
  font-size: 13px; line-height: 1.65; color: rgba(255,214,168,.72); font-style: italic;
  max-width: 62ch;
}
/* Wie viele Fragen noch — erst kurz vor Schluss, siehe zeigeFragen(). */
#talk .ask .sug .rest {
  font-size: 10px; letter-spacing: .2em; text-transform: uppercase;
  color: rgba(255,190,116,.6); padding-bottom: 2px;
}
#talk .ask .sug.laedt button { opacity: .5; }
#talk .ask .sug.laedt::after {
  content: 'Weitere Fragen …';
  font-size: 10px; letter-spacing: .26em; text-transform: uppercase;
  color: rgba(255,190,116,.6); padding-top: 2px;
}
#talk .ask .row { display: flex; gap: 9px; }
#talk .ask input {
  flex: 1; min-width: 0; background: rgba(255,255,255,.045);
  border: 1px solid rgba(159,180,204,.28); color: #dbe8f5;
  padding: 12px 13px; font-family: inherit;
}
#talk .ask input:focus { outline: none; border-color: rgba(126,190,230,.7); }
#talk button {
  font: inherit; font-size: 11px; letter-spacing: .16em; text-transform: uppercase;
  padding: 11px 16px; cursor: pointer; color: #9ec8e4; text-align: left;
  background: rgba(126,190,230,.07); border: 1px solid rgba(126,190,230,.3);
  transition: background .15s, border-color .15s;
  /* Notizen aus dem Verhoer sind unterschiedlich lang. Lieber sauber
     abschneiden als den Knopf sprengen oder mitten im Wort enden. */
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
/* Die Vorschläge sind seit dem Umbau ganze Fragen, keine Etiketten mehr.
   Versalien und eine abgeschnittene Zeile wären hier beides falsch: Ein Satz
   in Grossbuchstaben liest sich schlecht, und „Warum haben Sie die Rekla…"
   ist keine Frage. Also normale Schreibung und Umbruch. */
#talk .ask .sug button {
  white-space: normal; overflow: visible; text-overflow: clip;
  text-transform: none; letter-spacing: .02em; font-size: 13px; line-height: 1.55;
  padding: 12px 15px;
}
#talk button:hover:not(:disabled) { background: rgba(126,190,230,.16); border-color: rgba(126,190,230,.6); }
#talk button:disabled { opacity: .35; cursor: wait; }
#talk button.hold { color: #ffbe74; border-color: rgba(255,190,116,.38); background: rgba(255,190,116,.07); }
/* Eine Stoerung sieht aus wie eine Stoerung — nicht wie ein Spielzustand. */
#talk .ask .sug .stoerung {
  border-left: 2px solid rgba(255,120,120,.5); padding: 10px 0 10px 14px;
  font-size: 13px; line-height: 1.65; color: rgba(255,176,176,.85); max-width: 62ch;
}
/* Was gerade in die Akte gewandert ist, steht im Verlauf — sonst sieht man
   den Fortschritt nur an einer Zahl in der Kopfzeile. */
#talk .spur {
  margin: -8px 0 24px; padding: 9px 0 9px 14px; max-width: 74ch;
  border-left: 2px solid rgba(120,240,180,.6);
  font-size: 11px; letter-spacing: .1em; color: #9df3c8;
}

@media (max-width: 820px) {
  #talk { font-size: 15px; }
  #talk .head { gap: 13px; padding-left: 16px; padding-right: 16px; }
  #talk .head img { width: 68px; height: 68px; }
  #talk .who .a { display: none; }
  #talk .log { padding: 18px 16px; }
  #talk .ask { padding-left: 16px; padding-right: 16px; }
}
`;

/**
 * @param {{ getNotes: () => {label:string,text:string}[],
 *           addNote: (label: string, text: string) => void,
 *           getPlace: () => string,
 *           getInnen: () => boolean }} host
 */
export function createTalk(host) {
  const style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  const el = document.createElement('div');
  el.id = 'talk';
  el.innerHTML = `
    <div class="head">
      <img alt="" />
      <div class="who"><div class="n"></div><div class="r"></div><div class="a"></div></div>
      <button class="back" type="button">Zurück</button>
    </div>
    <div class="log"></div>
    <div class="ask"><div class="sug"></div><div class="row">
      <input type="text" placeholder="Eigene Frage…" autocomplete="off" />
      <button class="send" type="button">Fragen</button>
    </div></div>`;
  document.body.appendChild(el);

  const img = el.querySelector('img');
  const nEl = el.querySelector('.who .n');
  const rEl = el.querySelector('.who .r');
  const aEl = el.querySelector('.who .a');
  const log = el.querySelector('.log');
  const sug = el.querySelector('.sug');
  const input = el.querySelector('input');
  const sendBtn = el.querySelector('.send');
  const backBtn = el.querySelector('.back');

  const base = import.meta.env.BASE_URL || '/';

  /** Kürzt auf Wortgrenze — abgeschnittene Wörter sehen nach Fehler aus. */
  function kurz(s, max) {
    if (s.length <= max) return s;
    const cut = s.slice(0, max);
    const sp = cut.lastIndexOf(' ');
    return (sp > max * 0.5 ? cut.slice(0, sp) : cut).replace(/[,;:.\s]+$/, '') + '…';
  }

  let char = null;
  /** @type {{role:'user'|'model', text:string}[]} */
  let history = [];
  let busy = false;

  function setBusy(v) {
    busy = v;
    // Ist das Gespräch ausgereizt, bleibt die Eingabe zu — sonst gäbe
    // `setBusy(false)` nach der letzten Antwort alles wieder frei, direkt
    // unter dem Satz, dass hier nichts mehr zu holen ist.
    const aus = char ? istErschoepft(char) : false;
    sendBtn.disabled = v || aus;
    input.disabled = v || aus;
    for (const b of sug.querySelectorAll('button')) b.disabled = v;
  }

  function addTurn(question, answer, isError = false) {
    const d = document.createElement('div');
    d.className = 'turn';
    d.innerHTML = '<div class="q"></div><div class="a"></div>';
    d.querySelector('.q').textContent = 'Du · ' + question;
    const a = d.querySelector('.a');
    a.textContent = answer;
    if (isError) a.classList.add('err');
    log.appendChild(d);
    log.scrollTop = log.scrollHeight;
    return a;
  }

  /**
   * Sichtbar machen, dass gerade etwas herausgekommen ist.
   *
   * Ohne diese Zeile merkt man den Fortschritt nur daran, dass die Zahl neben
   * „Akte" oben um eins steigt — und darauf schaut niemand mitten im Gespräch.
   */
  function neueSpur(text) {
    const d = document.createElement('div');
    d.className = 'spur';
    d.textContent = 'IN DIE AKTE · ' + text;
    log.appendChild(d);
    log.scrollTop = log.scrollHeight;
  }

  /**
   * Ein Vergleichsschlüssel für Fragen.
   *
   * Wortgleich zu vergleichen reicht nicht: Das Modell stellt dieselbe Frage
   * gern zweimal mit anderen Worten, und der Spieler sieht sie dann wieder
   * auftauchen, obwohl er sie längst gestellt hat. Der Schlüssel wirft alles
   * weg, was sich leicht umformulieren lässt — Satzzeichen, Höflichkeit,
   * Wortstellung — und behält die bedeutungstragenden Wörter, sortiert.
   */
  function schluessel(frage) {
    const FUELL = new Set(['der','die','das','den','dem','des','ein','eine','einen','einem','einer',
      'und','oder','aber','doch','sie','ihr','ihre','ihren','ihrem','ihnen','mir','mich','ich',
      'was','wer','wie','wann','warum','wo','wieso','denn','noch','mal','eigentlich','hier','da',
      'ist','sind','war','waren','haben','hat','hatte','habe','wird','werden','wurde','sich','nicht']);
    return String(frage).toLowerCase()
      .replace(/[^a-zäöüß\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2 && !FUELL.has(w))
      .sort()
      .join(' ');
  }

  /**
   * Wann ein Gespräch ausgereizt ist.
   *
   * Neun Fragen am Stück, dann sagt der Ermittler selbst, dass hier nichts mehr
   * kommt. Erst wenn DRAUSSEN etwas dazukommt, ist wieder etwas zu fragen.
   *
   * Gezählt werden ALLE Fragen, nicht nur die fruchtlosen.
   *
   * Die erste Fassung zählte nur Fragen ohne neue [SPUR] und setzte bei jeder
   * Spur auf null zurück. Das klang vernünftig und war es nicht: Bei der ersten
   * Figur ist anfangs fast jede Antwort neu, also kam laufend eine Spur, also
   * sprang der Zähler laufend zurück. Gemeldet wurden dreizehn bis fünfzehn
   * Fragen am Stück — und danach lief das Gespräch in die Längengrenze des
   * Endpunkts und blieb mit einer Fehlermeldung stehen.
   *
   * Auch die eigene Spur zählt deshalb NICHT als Fortschritt von draußen (siehe
   * `ask`): Sonst verlängert jedes Gespräch sich selbst, und genau das war der
   * Fehler.
   */
  const MAX_FRAGEN = 9;
  /**
   * Je Figur: wie viele Fragen seit dem letzten Fund, welche Fragen ueberhaupt
   * schon gestellt wurden und welche Gestaendnisse schon heraus sind.
   *
   * `gefragt` haelt ALLE je gestellten Fragen, nicht nur die des laufenden
   * Gespraechs. Vorher ging nur der letzte Verlauf an das Modell, und nach
   * einem Fund tauchten laengst gestellte Fragen wieder auf.
   *
   * @type {Map<string, {gestellt: number, standNotizen: number,
   *                     gefragt: string[], gesagt: string[]}>}
   */
  const stand = new Map();

  function zustand(c) {
    if (!stand.has(c.id)) {
      stand.set(c.id, { gestellt: 0, standNotizen: host.getNotes().length, gefragt: [], gesagt: [] });
    }
    const z = stand.get(c.id);

    /* HIER WIRD EIN UNVOLLSTAENDIGER EINTRAG GEHEILT, UND ZWAR IMMER.
     *
     * Gemeldet aus dem Spiel: „Keine Antwort — undefined is not an object
     * (evaluating 'd.gefragt.push')", und zwar zuverlaessig nach einer
     * laengeren Pause. Die Pause war nicht die Ursache, sie war nur der
     * Anlass: Wer das Handy weglegt, kommt auf eine neu geladene Seite
     * zurueck, und beim Neuladen wird der Gespraechsstand zurueckgelesen.
     * `setStand` hat dabei nur `gestellt` und `standNotizen` uebernommen —
     * `gefragt` und `gesagt` fielen weg. Der Eintrag EXISTIERTE danach, also
     * hat ihn auch niemand mehr angelegt, und die erste Frage lief in ein
     * `undefined.push`.
     *
     * Die Reparatur steht bewusst hier und nicht nur in `setStand`: Diese
     * Funktion ist der einzige Weg an einen Eintrag, und was hier
     * herauskommt, hat garantiert die richtige Form — egal, aus welcher
     * Fassung des Spiels der gesicherte Stand stammt. */
    if (typeof z.gestellt !== 'number') z.gestellt = 0;
    if (typeof z.standNotizen !== 'number') z.standNotizen = host.getNotes().length;
    if (!Array.isArray(z.gefragt)) z.gefragt = [];
    if (!Array.isArray(z.gesagt)) z.gesagt = [];

    // Neues in der Akte macht das Gespräch wieder sinnvoll.
    if (host.getNotes().length > z.standNotizen) {
      z.gestellt = 0;
      z.standNotizen = host.getNotes().length;
    }
    return z;
  }
  const istErschoepft = (c) => zustand(c).gestellt >= MAX_FRAGEN;

  /**
   * @param {object} c Die Figur AUSDRUECKLICH — nicht das laufende `char`.
   *
   * Gemeldet: Im Gespräch mit Bea Ohlert stand „Aus Konrad Selb ist nichts
   * mehr herauszuholen". Der Text las `char` zum Zeitpunkt der Anzeige, und
   * das war nach einem Figurenwechsel jemand anders als der, um den es ging.
   */
  function zeigeErschoepft(c) {
    sug.classList.remove('laedt');
    sug.innerHTML = '';
    const d = document.createElement('div');
    d.className = 'aus';
    // Bewusst ohne Fürwort — das Spiel kennt zu den Figuren kein Geschlecht,
    // und „von der" wäre bei der nächsten Figur schon falsch.
    d.textContent = `Aus ${c.name} ist gerade nichts mehr herauszuholen. `
                  + 'Nicht mit dem, was ich in der Hand habe.';
    sug.appendChild(d);
    input.disabled = true;
    sendBtn.disabled = true;
    input.placeholder = 'Erst mit etwas Neuem …';
  }

  /**
   * Die Vorschlagsfragen hinschreiben.
   *
   * BLAU ist eine gewoehnliche Frage, ORANGE ein Vorhalt: Die Frage nennt
   * etwas Konkretes aus der Akte und konfrontiert die Person damit. Vorher war
   * die letzte Zeile einfach immer orange — „die unangenehme" —, was nirgends
   * stand und deshalb nichts bedeutete. Jetzt sagt die Farbe, ob die Frage
   * einen Beweis einsetzt, und genau das entscheidet, ob etwas aufbricht.
   *
   * Der Zaehler „noch drei Fragen" ist absichtlich weg: Er hat die
   * Aufmerksamkeit vom Gespraech auf ein Budget gezogen.
   *
   * @param {{text: string, vorhalt: boolean}[]} fragen
   */
  function zeigeFragen(fragen) {
    sug.innerHTML = '';
    for (const f of fragen) {
      const b = document.createElement('button');
      b.type = 'button';
      if (f.vorhalt) b.className = 'hold';
      b.textContent = f.text;
      b.title = f.vorhalt ? 'Vorhalt — setzt etwas aus deiner Akte ein' : '';
      b.onclick = () => ask(f.text);
      b.disabled = busy;
      sug.appendChild(b);
    }
  }

  /**
   * Eine Runde Fragen beim Modell holen.
   *
   * ZWEI FEHLER AUS DEM SPIEL SIND HIER BEHOBEN:
   *
   * 1. Die Antwort wurde nie auf Erfolg geprueft. Bei jedem Aussetzer las
   *    `data.text` als leer, und der Spieler bekam wortlos die Notfall-Liste —
   *    „Wie lange stehen Sie hier schon? / Wer war heute Abend noch hier? /
   *    Was verschweigen Sie mir?" — bei jeder Figur dieselben drei. Es sah aus
   *    wie ein Spielzustand und war ein verschluckter Fehler. Jetzt wird
   *    geprueft, einmal wiederholt, und erst dann aufgegeben.
   *
   * 2. Es kamen mal drei, mal vier Fragen, weil das Modell mal drei, mal vier
   *    brauchbare Zeilen lieferte. Fuer den Spieler sah das aus, als schrumpfe
   *    die Auswahl mit dem Fortschritt. Jetzt sind es immer vier.
   *
   * @returns {Promise<{fragen: {text:string,vorhalt:boolean}[], fehler: boolean}>}
   */
  async function holeFragen(c, notes, place, verlauf, schonGefragt, gestaendnisse) {
    const versuch = async () => {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: buildFragen(c, notes, place, verlauf, schonGefragt, gestaendnisse),
          messages: [{ role: 'user', text: 'Schreib die Fragen.' }],
          // Vier kurze Fragen brauchen kein langes Nachdenken. Gemessen: mit
          // `low` neun Sekunden, mit `minimal` gut vier — bei gleichem
          // Ergebnis. Die knappe Obergrenze hilft zusätzlich.
          denken: 'minimal',
          max: 900,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      return String(data.text || '');
    };

    let roh = '';
    for (let i = 0; i < 2 && !roh; i++) {
      try { roh = await versuch(); } catch { if (i) return { fragen: [], fehler: true }; }
    }
    if (!roh) return { fragen: [], fehler: true };

    // „! " markiert einen Vorhalt, „- " eine gewoehnliche Frage.
    const gesperrt = new Set(schonGefragt.map(schluessel));
    const fragen = [];
    for (const zeile of roh.split('\n')) {
      const m = zeile.trim().match(/^([-!–—•*])\s*(.+)$/);
      if (!m) continue;
      const text = m[2].replace(/^["„»]|["“«]$/g, '').trim();
      if (text.length < 9 || text.length > 130 || !/[?？]$/.test(text)) continue;
      // Aehnliche Fragen aussortieren, nicht nur wortgleiche: Das Modell
      // formuliert dieselbe Frage gern zweimal anders.
      const k = schluessel(text);
      if (gesperrt.has(k)) continue;
      gesperrt.add(k);
      fragen.push({ text, vorhalt: m[1] === '!' });
    }
    /* Vorhalte nach vorn.
       Es kommen sechs Zeilen, gezeigt werden vier — und wenn gekuerzt wird,
       darf nicht ausgerechnet der Vorhalt wegfallen. Er ist das Einzige, was
       ein Gestaendnis aufbrechen kann. */
    fragen.sort((a, b) => Number(b.vorhalt) - Number(a.vorhalt));
    return { fragen: fragen.slice(0, 4), fehler: false };
  }

  /**
   * Vorlauf: Fragen schon holen, während der Spieler die Beschreibung der
   * Person in der Untersuchungstafel liest.
   *
   * Das Öffnen des Verhörs dauerte gemessen zehn Sekunden, in denen nichts
   * anklickbar war. Die Sekunden zwischen „auf die Gestalt geklickt" und „auf
   * Ansprechen geklickt" sind geschenkte Zeit — die nutzen wir.
   */
  let vorlauf = null;
  function warmUp(spotId) {
    const c = CHARACTERS[spotId];
    if (!c) return;
    // Nur für ein NEUES Gespräch. Wer zurückkommt, hat schon einen Verlauf,
    // und Fragen ohne diesen Verlauf wären falsch.
    if (char?.id === c.id && history.length) return;
    const key = `${c.id}|${host.getNotes().length}|${host.getPlace()}`;
    if (vorlauf?.key === key) return;
    vorlauf = { key, p: holeFragen(c, host.getNotes(), host.getPlace(), [], zustand(c).gefragt,
                                   offeneGestaendnisse(c, host.meets, new Set(zustand(c).gesagt))) };
  }

  /**
   * Vorschlagsfragen anzeigen.
   *
   * Die alten bleiben stehen, bis die neuen da sind — nur matt und mit einem
   * Hinweis. Vorher wurde die Zeile geleert, und dann stand der Spieler zehn
   * Sekunden lang vor einem Verhör ohne jede Schaltfläche.
   */
  let fragenLauf = 0;
  async function ladeFragen() {
    const lauf = ++fragenLauf;
    /* Die Figur beim Eintritt festhalten.
       Alles hier drin ist asynchron, und `char` kann sich zwischendurch
       aendern — wer waehrend einer laufenden Runde jemand anderen anspricht,
       bekam sonst die Anzeige der vorigen Figur zu sehen. */
    const c = char;
    if (!c) return;
    // Ausgereizt: gar nicht erst fragen. Spart nebenbei den Aufruf.
    if (istErschoepft(c)) { zeigeErschoepft(c); return; }

    const z = zustand(c);
    // Was schon gefragt wurde, fliegt sofort raus — sonst kann man eine Frage
    // zweimal stellen, waehrend die neuen noch unterwegs sind.
    const weg = new Set(z.gefragt.map(schluessel));
    for (const b of sug.querySelectorAll('button')) {
      if (weg.has(schluessel(b.textContent))) b.remove();
    }
    if (sug.querySelector('button')) {
      sug.classList.add('laedt');
    } else {
      sug.innerHTML = '<div class="sucht">Fragen …</div>';
    }

    const key = `${c.id}|${host.getNotes().length}|${host.getPlace()}`;
    const p = (!history.length && vorlauf?.key === key)
      ? vorlauf.p
      : holeFragen(c, host.getNotes(), host.getPlace(), history, z.gefragt,
                   offeneGestaendnisse(c, host.meets, new Set(z.gesagt)));
    vorlauf = null;
    const { fragen, fehler } = await p;

    // Ein späterer Lauf hat inzwischen übernommen, oder die Figur ist
    // gewechselt: dieses Ergebnis verwerfen.
    if (lauf !== fragenLauf || char !== c) return;
    sug.classList.remove('laedt');

    if (fehler) { zeigeStoerung(); return; }
    if (!fragen.length) { zeigeErschoepft(c); return; }
    zeigeFragen(fragen);
  }

  /**
   * Die Leitung klemmt.
   *
   * Vorher wurde dieser Fall wortlos zur Notfall-Liste — drei allgemeine
   * Fragen, bei jeder Figur dieselben. Der Spieler hielt das fuer einen
   * Spielzustand und fragte weiter ins Leere. Ein Fehler muss als Fehler
   * erkennbar sein, und man muss es noch einmal versuchen koennen.
   */
  function zeigeStoerung() {
    sug.classList.remove('laedt');
    sug.innerHTML = '';
    const d = document.createElement('div');
    d.className = 'stoerung';
    d.textContent = 'Das Archiv antwortet gerade nicht. Ohne Verbindung fällt '
                  + 'mir keine Frage ein, die etwas brächte.';
    sug.appendChild(d);
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = 'Noch einmal versuchen';
    b.onclick = () => ladeFragen();
    sug.appendChild(b);
  }

  async function ask(question) {
    if (busy || !char) return;
    /* AN WEN die Frage geht, wird hier festgehalten und nicht spaeter noch
       einmal aus `char` gelesen.
       Gemeldet: Bei Emil Bracke und Iris Malaunt liess sich manchmal keine
       einzige Frage stellen. Ursache: Wer die Figur wechselt, waehrend eine
       Antwort unterwegs ist, bekam sie der NEUEN Figur angerechnet — deren
       Zaehler stieg, ohne dass man sie je etwas gefragt hatte, bis sie bei
       neun stand und als ausgereizt galt. Aus demselben Grund stand in einem
       Gespraech der Name einer ganz anderen Figur. */
    const c = char;
    // Die Sperre gilt auch fuer die freie Eingabe. Ohne diese Zeile liesse
    // sich die zehnte Frage tippen, obwohl die Schaltflaechen weg sind.
    if (istErschoepft(c)) { zeigeErschoepft(c); return; }
    setBusy(true);
    const slot = addTurn(question, '');
    slot.innerHTML = '<span class="thinking">…' + c.name + ' überlegt</span>';

    history.push({ role: 'user', text: question });

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: buildSystem(c, host.getNotes(), host.getPlace(), host.getInnen?.(),
                              offeneGestaendnisse(c, host.meets, new Set(zustand(c).gesagt))),
          // Nur die letzten Wechsel mitschicken. Neun Fragen ergeben achtzehn
          // Eintraege, das passt ohnehin — aber der Endpunkt kuerzt sowieso auf
          // die letzten 24, und was er ohnehin wegwirft, muss nicht durch die
          // Leitung.
          messages: history.slice(-18),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);

      const raw = String(data.text || '');
      // Zwei Formen: `[SPUR:kennung]` verweist auf ein Gestaendnis aus den
      // Falldaten und bringt einen echten Hinweis mit; das blosse `[SPUR] …`
      // ist freie Rede, die nur in die Akte wandert.
      const kEnn = raw.match(/\[SPUR:([a-z0-9-]+)\]/i);
      const kennung = kEnn ? kEnn[1] : null;
      const m = kennung ? null : raw.match(/\[SPUR\]\s*(.+)\s*$/im);
      const clean = raw.replace(/\[SPUR(:[a-z0-9-]+)?\].*$/ims, '').trim();

      slot.textContent = clean;
      history.push({ role: 'model', text: clean });

      // Zaehlen, BEVOR die naechsten Fragen geholt werden — sonst laedt der
      // Vorlauf noch vier Fragen fuer ein Gespraech, das gerade zu Ende ist.
      // Verworfen, wenn inzwischen jemand anders angesprochen wurde: Die
      // Antwort gehoert in ein Gespraech, das nicht mehr offen ist.
      if (char !== c) { setBusy(false); return; }

      const z = zustand(c);
      z.gestellt += 1;
      z.gefragt.push(question);

      /*
       * Ein Gestaendnis aus den Falldaten.
       *
       * Das ist der Unterschied zwischen Reden und Ermitteln: `[SPUR:kennung]`
       * verweist auf einen Eintrag in `spuren` der Figur, und der bringt einen
       * ECHTEN Hinweis mit — denselben, den auch ein Fundstueck setzen wuerde.
       * Damit kann ein Verhoer eine Tuer oeffnen, einen Sektor freischalten
       * und am Ende die Anklage tragen. Vorher erzeugte ein Gespraech nur eine
       * Notiz und hat nie etwas bewegt.
       */
      if (kennung) {
        const g = (c.spuren || []).find((x) => x.id === kennung);
        if (g && !z.gesagt.includes(g.id)) {
          z.gesagt.push(g.id);
          host.addNote(`${c.name}: ${kurz(g.notiz, 38)}`, g.notiz);
          if (g.clue) host.addClue(g.clue);
          neueSpur(g.notiz);
        }
      } else if (m) {
        const spur = m[1].trim();
        // Die Spur steht in der dritten Person und beginnt oft mit dem Namen
        // der Figur — dann nicht noch einmal davorsetzen.
        const doppelt = spur.toLowerCase().startsWith(c.name.toLowerCase());
        const label = doppelt ? kurz(spur, 46) : `${c.name}: ${kurz(spur, 38)}`;
        host.addNote(label, spur);
        neueSpur(spur);
      }
      // Der Stand wird MITGEZOGEN: Was diese Figur selbst preisgegeben hat,
      // ist kein Fund von draussen und darf das Gespraech nicht verlaengern.
      z.standNotizen = host.getNotes().length;

      // Neue Fragen zum neuen Stand. Nebenher, damit die Antwort sofort steht —
      // aber NACH der Notiz, damit sie die frische Spur schon kennen.
      ladeFragen();
    } catch (e) {
      slot.classList.add('err');
      slot.textContent =
        `Keine Antwort — ${String(e.message || e)}.\n`
        + 'Ohne Verbindung zum Archiv redet hier niemand.';
      // Fehlgeschlagene Frage nicht im Verlauf lassen, sonst zieht sie sich
      // durch jede weitere Anfrage.
      history.pop();
    }
    setBusy(false);
    input.value = '';
    log.scrollTop = log.scrollHeight;
  }

  sendBtn.onclick = () => { const q = input.value.trim(); if (q) ask(q); };
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { const q = input.value.trim(); if (q) ask(q); }
  });
  backBtn.onclick = close;
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && el.classList.contains('on')) close();
  });

  function close() {
    el.classList.remove('on');
    input.blur();
  }

  return {
    /** true, wenn es für diesen Punkt überhaupt eine Figur gibt. */
    has: (spotId) => Boolean(CHARACTERS[spotId]),

    /**
     * Wie ausgereizt jedes Gespräch ist — fürs Sichern.
     *
     * Der Verlauf selbst wird NICHT gesichert: Er lebt ohnehin nur, solange man
     * bei derselben Figur bleibt, und ein wiederhergestelltes Gespräch, das
     * mitten in einem Satz weitergeht, wäre seltsamer als ein neues. Was
     * bleiben muss, ist die Erschöpfung — sonst hat man nach dem Neuladen bei
     * jeder Figur wieder neun Fragen frei, obwohl längst nichts mehr kommt.
     *
     * Und es müssen die GESTELLTEN FRAGEN bleiben. Die erste Fassung hat sie
     * beim Zurücklesen weggelassen; das hat nicht nur dieselben Fragen wieder
     * auftauchen lassen, sondern jedes Gespräch nach einem Neuladen mit
     * „undefined is not an object" abgebrochen. Siehe `zustand()`.
     */
    stand: () => [...stand.entries()].map(([id, z]) => [id, { ...z }]),
    setStand(paare) {
      stand.clear();
      for (const [id, z] of paare || []) {
        stand.set(id, {
          // `ohne` ist der alte Name aus der Fassung, die nur fruchtlose Fragen
          // zaehlte. Einen gesicherten Stand deswegen wegzuwerfen waere
          // unhoeflich — er wird uebernommen, auch wenn er niedriger liegt.
          gestellt: z?.gestellt ?? z?.ohne ?? 0,
          standNotizen: z?.standNotizen ?? host.getNotes().length,
          // Beides sind Zeichenketten-Listen. Was aus einem fremden oder
          // aelteren Stand kommt, wird gefiltert statt geglaubt.
          gefragt: Array.isArray(z?.gefragt) ? z.gefragt.filter((s) => typeof s === 'string') : [],
          gesagt: Array.isArray(z?.gesagt) ? z.gesagt.filter((s) => typeof s === 'string') : [],
        });
      }
    },

    /** Fragen vorladen, solange der Spieler noch die Beschreibung liest. */
    warmUp,

    open(spotId) {
      const c = CHARACTERS[spotId];
      if (!c) return;
      // Verlauf nur bei Figurenwechsel zurücksetzen — wer zurückkommt, soll
      // das Gespräch fortsetzen können.
      if (char?.id !== c.id) {
        char = c;
        history = [];
        log.innerHTML = '';
        // Und die Vorschlaege der vorigen Figur sofort weg — nicht erst,
        // wenn die neuen da sind. Sonst steht beim Aufmachen noch der Satz
        // ueber jemand anderen da.
        sug.innerHTML = '';
        const o = document.createElement('div');
        o.className = 'opener';
        o.textContent = c.opener;
        log.appendChild(o);
      }
      img.src = base + c.portrait;
      img.alt = c.name;
      nEl.textContent = c.name;
      rEl.textContent = c.role;
      aEl.textContent = c.appearance;
      input.disabled = false;
      sendBtn.disabled = false;
      input.placeholder = 'Eigene Frage…';
      setBusy(false);
      el.classList.add('on');
      ladeFragen();
    },

    close,
    isOpen: () => el.classList.contains('on'),
  };
}
