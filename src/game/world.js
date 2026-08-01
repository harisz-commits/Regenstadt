/**
 * Der Zustand der Ermittlung.
 *
 * Bis hierher war das Spiel zustandslos: Man klickte auf Dinge und bekam Text.
 * Damit ist eine Ermittlung nach zwei Minuten durch, weil nichts von etwas
 * anderem abhaengt.
 *
 * Hier liegt deshalb alles, was sich merkt, was der Spieler getan hat:
 *
 *   Asservate   getragene Gegenstaende. Ein Gegenstand oeffnet eine Tuer oder
 *               kann im Labor abgegeben werden.
 *   Analysen    abgegebene Gegenstaende, deren Ergebnis noch nicht da ist.
 *   Spuren      Erkenntnisse (auch aus Verhoeren). Sie schalten frei.
 *
 * Warum Wartezeit in ORTSWECHSELN und nicht in Sekunden: Eine Uhr zwingt zum
 * Warten, ein Zaehler zwingt zum Weitergehen. Das Ergebnis der Blutprobe ist
 * fertig, wenn der Spieler in der Zwischenzeit woanders war — genau so soll
 * sich eine Ermittlung anfuehlen. Nebenbei bleibt es fair: Wer das Spiel
 * weglegt, verliert nichts.
 */

/**
 * Eine Bedingung ist bewusst DATEN, keine Funktion.
 *
 * Der spaeter generierte Fall wird Orte und Gegenstaende selbst erfinden. Ein
 * Sprachmodell kann `{ item: 'keycard' }` zuverlaessig ausgeben, eine
 * JavaScript-Funktion nicht.
 *
 * @typedef {{item?: string, clue?: string, not?: string, text?: string}} Bedingung
 */

export function createWorld() {
  /** @type {Map<string, object>} getragene Gegenstaende */
  const items = new Map();
  /** @type {Set<string>} Kennungen erledigter Erkenntnisse */
  const clues = new Set();
  /** @type {{id:string, item:object, restBewegungen:number, ergebnis:object}[]} */
  const analysen = [];
  /** @type {Set<string>} bereits eingesammelte Punkte, damit nichts doppelt kommt */
  const taken = new Set();

  let moves = 0;
  const listeners = new Set();
  const emit = () => { for (const f of listeners) f(); };

  return {
    onChange(f) { listeners.add(f); return () => listeners.delete(f); },

    /* --- Asservate ------------------------------------------------------- */

    /** @param {{id:string,name:string,text:string,analysis?:object}} item */
    take(item) {
      if (items.has(item.id) || taken.has(item.id)) return false;
      items.set(item.id, item);
      taken.add(item.id);
      emit();
      return true;
    },
    hasItem: (id) => items.has(id),
    /** Wurde der Gegenstand jemals aufgenommen? Auch nach Abgabe noch wahr. */
    wasTaken: (id) => taken.has(id),
    items: () => [...items.values()],
    drop(id) { const ok = items.delete(id); if (ok) emit(); return ok; },

    /* --- Erkenntnisse ---------------------------------------------------- */

    addClue(id) { if (!id || clues.has(id)) return false; clues.add(id); emit(); return true; },
    hasClue: (id) => clues.has(id),

    /* --- Analysen -------------------------------------------------------- */

    /**
     * Gegenstand abgeben. Er verlaesst die Asservate und kommt als Ergebnis
     * zurueck, sobald der Spieler oft genug woanders war.
     */
    submit(item) {
      if (!item?.analysis) return false;
      items.delete(item.id);
      analysen.push({
        id: item.id,
        item,
        restBewegungen: item.analysis.wait ?? 3,
        ergebnis: item.analysis,
      });
      emit();
      return true;
    },
    /** Laeuft dieser Gegenstand gerade im Labor? */
    isRunning: (id) => analysen.some((a) => a.id === id && a.restBewegungen > 0),
    /** Fertige, noch nicht abgeholte Ergebnisse. */
    ready: () => analysen.filter((a) => a.restBewegungen <= 0),
    pending: () => analysen.filter((a) => a.restBewegungen > 0),
    /** Ergebnis abholen — danach ist es aus der Liste. */
    collect(id) {
      const i = analysen.findIndex((a) => a.id === id && a.restBewegungen <= 0);
      if (i === -1) return null;
      const [a] = analysen.splice(i, 1);
      if (a.ergebnis.clue) clues.add(a.ergebnis.clue);
      emit();
      return a;
    },

    /* --- Zeit ------------------------------------------------------------ */

    /** Ein Ortswechsel. Bringt jede laufende Analyse einen Schritt weiter. */
    step() {
      moves += 1;
      let fertig = 0;
      for (const a of analysen) {
        if (a.restBewegungen > 0 && --a.restBewegungen === 0) fertig += 1;
      }
      emit();
      return fertig;
    },
    moves: () => moves,

    /* --- Bedingungen ----------------------------------------------------- */

    /**
     * Ist die Bedingung erfuellt? Ohne Bedingung: ja.
     * @param {Bedingung=} req
     */
    meets(req) {
      if (!req) return true;
      if (req.item && !items.has(req.item)) return false;
      if (req.clue && !clues.has(req.clue)) return false;
      if (req.not && (clues.has(req.not) || items.has(req.not))) return false;
      return true;
    },

    /** Nur zum Sichern/Wiederherstellen und fuer Pruefungen. */
    snapshot: () => ({
      items: [...items.keys()],
      clues: [...clues],
      analysen: analysen.map((a) => ({ id: a.id, rest: a.restBewegungen })),
      moves,
    }),
  };
}
