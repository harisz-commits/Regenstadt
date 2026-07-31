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
  if (typeof system !== 'string' || !Array.isArray(messages) || messages.length === 0) {
    return { status: 400, json: { error: 'system (Text) und messages (Liste) werden gebraucht.' } };
  }
  if (messages.length > 40) {
    return { status: 400, json: { error: 'Gesprächsverlauf zu lang.' } };
  }

  const payload = {
    system_instruction: { parts: [{ text: system.slice(0, 12000) }] },
    contents: messages.slice(-24).map((m) => ({
      role: m.role === 'model' ? 'model' : 'user',
      parts: [{ text: String(m.text).slice(0, 4000) }],
    })),
    generationConfig: {
      maxOutputTokens: MAX_OUTPUT,
      temperature: 1.0,
      // Wenig nachdenken: für Dialog reicht das, und die Denk-Token sind der
      // eigentliche Kostentreiber — sie liegen sonst beim Zehnfachen der
      // ausgegebenen Token.
      thinkingConfig: { thinkingLevel: 'low' },
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
    res.status(500).json({ error: 'GEMINI_API_KEY ist auf dem Server nicht gesetzt.' });
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
