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

import { CHARACTERS, buildSystem, buildFragen } from './characters.js';

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
   * Wenn das Archiv nicht antwortet, muss trotzdem etwas dastehen. Bewusst
   * allgemein gehalten — konkret kann nur das Modell werden, weil nur es
   * weiß, was in der Akte steht.
   */
  const NOTFALL = [
    'Wie lange stehen Sie hier schon?',
    'Wer war heute Abend noch hier?',
    'Was verschweigen Sie mir?',
  ];

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
  /** Ab hier wird angesagt, dass es zu Ende geht. */
  const WARNUNG_AB = 3;
  /** @type {Map<string, {gestellt: number, standNotizen: number}>} */
  const stand = new Map();

  function zustand(c) {
    if (!stand.has(c.id)) stand.set(c.id, { gestellt: 0, standNotizen: host.getNotes().length });
    const z = stand.get(c.id);
    // Neues in der Akte macht das Gespräch wieder sinnvoll.
    if (host.getNotes().length > z.standNotizen) {
      z.gestellt = 0;
      z.standNotizen = host.getNotes().length;
    }
    return z;
  }
  const offeneFragen = (c) => Math.max(0, MAX_FRAGEN - zustand(c).gestellt);
  const istErschoepft = (c) => offeneFragen(c) === 0;

  function zeigeErschoepft() {
    sug.classList.remove('laedt');
    sug.innerHTML = '';
    const d = document.createElement('div');
    d.className = 'aus';
    // Bewusst ohne Fürwort — das Spiel kennt zu den Figuren kein Geschlecht,
    // und „von der" wäre bei der nächsten Figur schon falsch.
    d.textContent = `Aus ${char.name} ist gerade nichts mehr herauszuholen. `
                  + 'Nicht mit dem, was ich in der Hand habe.';
    sug.appendChild(d);
    input.disabled = true;
    sendBtn.disabled = true;
    input.placeholder = 'Erst mit etwas Neuem …';
  }

  function zeigeFragen(fragen) {
    sug.innerHTML = '';

    /* Vorwarnen, statt die Tuer zuzuschlagen.
       Neun Fragen sind schnell weg, und ohne Ansage fuehlt sich das Ende des
       Gespraechs wie ein Fehler an. Erst ab drei uebrigen — davor waere es nur
       ein Zaehler, der die Aufmerksamkeit vom Gespraech wegzieht. */
    const uebrig = offeneFragen(char);
    if (uebrig <= WARNUNG_AB) {
      const w = document.createElement('div');
      w.className = 'rest';
      w.textContent = uebrig === 1
        ? 'Eine Frage noch, dann ist der Faden hier zu Ende.'
        : `Noch ${uebrig} Fragen, dann ist hier nichts mehr zu holen.`;
      sug.appendChild(w);
    }

    fragen.forEach((q, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      // Die letzte ist laut Anweisung die unangenehme — sie bekommt die
      // warme Farbe, damit man sieht, dass sie etwas kostet.
      if (i === fragen.length - 1 && fragen.length > 2) b.className = 'hold';
      b.textContent = q;
      b.onclick = () => ask(q);
      b.disabled = busy;
      sug.appendChild(b);
    });
  }

  /** Eine Runde Fragen beim Modell holen. Liefert immer eine Liste. */
  async function holeFragen(c, notes, place, verlauf) {
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: buildFragen(c, notes, place, verlauf),
          messages: [{ role: 'user', text: 'Schreib die vier Fragen.' }],
          // Vier kurze Fragen brauchen kein langes Nachdenken. Gemessen: mit
          // `low` neun Sekunden, mit `minimal` gut vier — bei gleichem
          // Ergebnis. Die knappe Obergrenze hilft zusätzlich.
          denken: 'minimal',
          max: 700,
        }),
      });
      const data = await res.json().catch(() => ({}));
      const roh = String(data.text || '')
        .split('\n')
        .map((z) => z.replace(/^\s*(?:[-–—•*]|\d+[.)])\s*/, '').replace(/^["„»]|["“«]$/g, '').trim())
        .filter((z) => z.length > 8 && z.length < 130 && /[?？]$/.test(z));
      return roh.length >= 2 ? roh.slice(0, 4) : NOTFALL;
    } catch {
      return NOTFALL;
    }
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
    vorlauf = { key, p: holeFragen(c, host.getNotes(), host.getPlace(), []) };
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
    // Ausgereizt: gar nicht erst fragen. Spart nebenbei den Aufruf.
    if (istErschoepft(char)) { zeigeErschoepft(); return; }
    // Was schon gefragt wurde, fliegt raus — sonst kann man eine Frage
    // zweimal stellen, waehrend die neuen noch unterwegs sind.
    const gestellt = new Set(history.filter((m) => m.role === 'user').map((m) => m.text));
    for (const b of sug.querySelectorAll('button')) {
      if (gestellt.has(b.textContent)) b.remove();
    }
    const alte = sug.querySelector('button');
    if (alte) {
      sug.classList.add('laedt');
    } else {
      sug.innerHTML = '<div class="sucht">Fragen …</div>';
    }

    const key = `${char.id}|${host.getNotes().length}|${host.getPlace()}`;
    const p = (!history.length && vorlauf?.key === key)
      ? vorlauf.p
      : holeFragen(char, host.getNotes(), host.getPlace(), history);
    vorlauf = null;
    const fragen = await p;

    // Ein späterer Lauf hat inzwischen übernommen: dieses Ergebnis verwerfen.
    if (lauf !== fragenLauf) return;
    sug.classList.remove('laedt');
    zeigeFragen(fragen);
  }

  async function ask(question) {
    if (busy || !char) return;
    // Die Sperre gilt auch fuer die freie Eingabe. Ohne diese Zeile liesse
    // sich die zehnte Frage tippen, obwohl die Schaltflaechen weg sind.
    if (istErschoepft(char)) { zeigeErschoepft(); return; }
    setBusy(true);
    const slot = addTurn(question, '');
    slot.innerHTML = '<span class="thinking">…' + char.name + ' überlegt</span>';

    history.push({ role: 'user', text: question });

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: buildSystem(char, host.getNotes(), host.getPlace(), host.getInnen?.()),
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
      // Die Figur markiert eine neue Spur mit [SPUR] in der letzten Zeile.
      const m = raw.match(/\[SPUR\]\s*(.+)\s*$/im);
      const clean = raw.replace(/\[SPUR\].*$/ims, '').trim();

      slot.textContent = clean;
      history.push({ role: 'model', text: clean });

      // Zaehlen, BEVOR die naechsten Fragen geholt werden — sonst laedt der
      // Vorlauf noch vier Fragen fuer ein Gespraech, das gerade zu Ende ist.
      const z = zustand(char);
      z.gestellt += 1;

      if (m) {
        const spur = m[1].trim();
        // Die Spur steht in der dritten Person und beginnt oft mit dem Namen
        // der Figur — dann nicht noch einmal davorsetzen.
        const doppelt = spur.toLowerCase().startsWith(char.name.toLowerCase());
        const label = doppelt ? kurz(spur, 46) : `${char.name}: ${kurz(spur, 38)}`;
        host.addNote(label, spur);
        // Der Stand wird MITGEZOGEN: Was diese Figur selbst preisgegeben hat,
        // ist kein Fund von draussen und darf das Gespraech nicht verlaengern.
        // Genau diese Zeile fehlte — jede Spur setzte den Zaehler zurueck.
        z.standNotizen = host.getNotes().length;
      }

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
