/**
 * Gespräche mit den Figuren.
 *
 * Läuft als Serverless-Funktion (Vercel). Der Grund ist der API-Schlüssel:
 * Alles, was im Browser landet, kann jeder auslesen. Ein Schlüssel im
 * Frontend-Bündel ist ein veröffentlichter Schlüssel — und bei einem
 * kostenpflichtigen Konto zahlt der Besitzer die Rechnung.
 *
 * Deshalb kennt der Browser nur diesen Endpunkt, und der Schlüssel steht
 * ausschließlich in den Umgebungsvariablen des Servers.
 *
 * Im Entwicklungsbetrieb bildet `vite.config.js` denselben Pfad nach, damit
 * lokal und veröffentlicht derselbe Code läuft.
 */

const MODEL = 'gemini-3.6-flash';
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

/**
 * Obergrenze pro Antwort.
 *
 * Achtung: Bei den Gemini-3-Modellen zählen die DENK-Token gegen dasselbe
 * Budget wie der ausgegebene Text — und sie liegen beim Acht- bis Zehnfachen
 * der Antwort. Mit 700 wurde die Antwort mitten im Wort abgeschnitten, weil
 * das Nachdenken den Rest verbraucht hatte. Die Kürze der Figurenrede regelt
 * die Anweisung, nicht dieses Limit.
 */
const MAX_OUTPUT = 2200;

/**
 * @param {{system: string, messages: {role: 'user'|'model', text: string}[]}} body
 * @param {string} key
 */
export async function askModel(body, key) {
  const { system, messages } = body;
  /**
   * Wie viel das Modell nachdenken soll.
   *
   * Fuer Figurenrede lohnt sich `low`. Fuer die Vorschlagsfragen nicht: Dort
   * kostete das Nachdenken gemessene neun Sekunden, waehrend die Antwort der
   * Figur in drei da war. `minimal` halbiert das und macht bei vier kurzen
   * Fragen keinen erkennbaren Unterschied.
   *
   * Erlaubt sind nur `low` und `minimal` — `none` und `off` lehnt die API mit
   * 400 ab.
   */
  const denken = body.denken === 'minimal' ? 'minimal' : 'low';
  const grenze = Number.isFinite(body.max) ? Math.min(body.max, MAX_OUTPUT) : MAX_OUTPUT;
  if (typeof system !== 'string' || !Array.isArray(messages) || messages.length === 0) {
    return { status: 400, json: { error: 'system (Text) und messages (Liste) werden gebraucht.' } };
  }
  /*
   * KUERZEN, NICHT ABLEHNEN.
   *
   * Hier stand `if (messages.length > 40) return 400`. Gemeldet wurde: nach
   * dreizehn bis fuenfzehn Fragen an dieselbe Figur blieb das Verhoer mit
   * „Gespraechsverlauf zu lang" stehen, und jede weitere Frage lief in
   * dieselbe Wand — eine Sackgasse mitten im Spiel.
   *
   * Die Pruefung war schon damals ueberfluessig: Zwei Zeilen tiefer wird der
   * Verlauf ohnehin auf die letzten Wechsel beschnitten. Sie hat also einen
   * Aufruf abgewiesen, den sie selbst haette bedienen koennen.
   *
   * Was bleibt, ist eine Schranke gegen missbraeuchlich grosse Anfragen. Die
   * liegt jetzt so hoch, dass sie im Spiel nicht erreichbar ist, und ihre
   * Meldung ist keine, die je ein Spieler zu sehen bekommt.
   */
  if (messages.length > 400) {
    return { status: 413, json: { error: 'Anfrage zu gross.' } };
  }

  /*
   * DIE ANWEISUNG WIRD HINTEN ABGESCHNITTEN — und hinten stehen die Regeln.
   *
   * Hier stand 12000. Gemeldet aus dem Spiel: Mitten in Fall 2 war ploetzlich
   * aus JEDER Figur „gerade nichts mehr herauszuholen", auch aus denen, die
   * man eben erst getroffen hatte. Die Anweisung fuer die Vorschlagsfragen
   * waechst mit der Akte; bei rund vierzig Eintraegen ueberschritt sie diese
   * Marke, und weggeschnitten wurde ausgerechnet der Absatz, der das
   * Ausgabeformat vorschreibt. Das Modell schrieb daraufhin Prosa, der Parser
   * fand null Fragen — und das Spiel meldete eine erschoepfte Figur.
   *
   * Die eigentliche Reparatur steht in characters.js: Dort bekommt die Akte
   * ein Budget, damit die Regeln IMMER mitgehen. Diese Schranke bleibt als
   * Schutz gegen missbraeuchlich grosse Anfragen — aber so weit oben, dass
   * sie im Spiel nicht mehr erreicht wird. Gemessen liegt die laengste
   * Anweisung beider Faelle bei rund 10 000 Zeichen.
   */
  const payload = {
    system_instruction: { parts: [{ text: system.slice(0, 20000) }] },
    contents: messages.slice(-24).map((m) => ({
      role: m.role === 'model' ? 'model' : 'user',
      parts: [{ text: String(m.text).slice(0, 4000) }],
    })),
    generationConfig: {
      maxOutputTokens: grenze,
      temperature: 1.0,
      // Wenig nachdenken: für Dialog reicht das, und die Denk-Token sind der
      // eigentliche Kostentreiber — sie liegen sonst beim Zehnfachen der
      // ausgegebenen Token.
      thinkingConfig: { thinkingLevel: denken },
    },
  };

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'x-goog-api-key': key, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok || !data) {
    const msg = data?.error?.message || `HTTP ${res.status}`;
    return { status: 502, json: { error: msg } };
  }

  const cand = data.candidates?.[0];
  const parts = cand?.content?.parts || [];
  let text = parts.filter((p) => typeof p.text === 'string').map((p) => p.text).join('\n').trim();
  if (!text) {
    return { status: 502, json: { error: 'Leere Antwort vom Modell.' } };
  }

  // Reisst das Budget doch einmal, lieber am letzten vollstaendigen Satz
  // abschneiden als mitten im Wort aufhoeren.
  if (cand.finishReason === 'MAX_TOKENS') {
    const cut = Math.max(text.lastIndexOf('.'), text.lastIndexOf('!'), text.lastIndexOf('?'));
    if (cut > 40) text = text.slice(0, cut + 1);
  }

  const u = data.usageMetadata || {};
  return {
    status: 200,
    json: {
      text,
      finish: cand.finishReason,
      // Fuer die Kostenkontrolle und die Fehlersuche: die Denk-Token sind der
      // groesste Posten und der Grund fuer abgeschnittene Antworten.
      usage: { in: u.promptTokenCount, out: u.candidatesTokenCount, denk: u.thoughtsTokenCount },
    },
  };
}

/** Vercel-Handler. */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Nur POST.' });
    return;
  }
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    // Bewusst spielnah formuliert: Dieser Satz steht am Ende im Verhoer vor
    // dem Spieler, nicht in einem Protokoll. Der Name der Umgebungsvariablen
    // gehoert dorthin nicht.
    res.status(500).json({ error: 'Das Archiv antwortet nicht — kein Zugang auf dem Server hinterlegt.' });
    return;
  }
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const out = await askModel(body || {}, key);
    res.status(out.status).json(out.json);
  } catch (e) {
    res.status(500).json({ error: String(e?.message || e) });
  }
}
