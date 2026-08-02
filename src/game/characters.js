/**
 * Wie mit einer Figur geredet wird.
 *
 * Hier steht die MECHANIK des Verhörs, nicht sein Inhalt: die Anweisungen, aus
 * denen das Sprachmodell Antworten und Vorschlagsfragen macht. Wer die Figuren
 * sind, steht im Fall (src/faelle/…/figuren.js) — dieselbe Datei baut die
 * Anweisung für Fall 1, Fall 2 und für einen später erzeugten Fall.
 */

import { fall, beiFallwechsel } from './fall.js';

/**
 * Die Figuren des laufenden Falls.
 *
 * Eine `let`-Ausfuhr, kein `const`: Beim Fallwechsel wird sie neu gesetzt, und
 * ES-Module geben Ausfuhren als LEBENDE Bindung weiter — jeder Importeur sieht
 * die neuen Figuren, ohne dass eine einzige Importzeile geändert werden muss.
 */
export let CHARACTERS = fall().figuren;

beiFallwechsel(() => { CHARACTERS = fall().figuren; });

/** Grundhaltung für alle Figuren. */
export const NOIR_VOICE =
  'Du spielst eine Figur in einem deutschsprachigen Neo-Noir-Detektivspiel: '
  + 'Dauerregen, Neonreklame, Konzernmacht, nasse Straßen, moralische Grauzonen. '
  + 'Schreibe knapp, sinnlich und trocken. Keine Klischeehäufung, keine '
  + 'Erklärungen, keine Meta-Kommentare, kein Ausstieg aus der Rolle.';

/**
 * Baut die Anweisung, die dem Spieler VORSCHLAGSFRAGEN schreibt.
 *
 * Der erste Versuch hat die Fragen aus Bausteinen gesetzt: „Vorhalten: " plus
 * die Überschrift einer Aktennotiz. Bei einem Fundstück ging das gerade noch,
 * bei einem Ort kam „Ich halte Ihnen vor — Bar" heraus. Das ist kein Satz,
 * den ein Mensch sagt.
 *
 * Deshalb schreibt sie jetzt dasselbe Modell, das auch antwortet: Es kennt die
 * Figur, den Ort und den Akteninhalt und kann daraus fragen, was ein Ermittler
 * fragen würde — „Warum haben Sie die Reklame draußen nie reparieren lassen?"
 * statt einer Schablone.
 *
 * @param {object} c Figur
 * @param {{label: string, text: string}[]} notes Akte
 * @param {string} place Ort
 * @param {{role: string, text: string}[]} verlauf bisheriges Gespräch
 */
export function buildFragen(c, notes, place, verlauf) {
  const wissen = notes.length
    ? notes.map((n) => `- ${n.label}: ${n.text}`).join('\n')
    : '- noch nichts';

  const bisher = verlauf.length
    ? verlauf.slice(-8).map((m) => (m.role === 'user' ? 'ERMITTLER: ' : `${c.name.toUpperCase()}: `) + m.text).join('\n')
    : '(noch nichts gesagt)';

  return `Du schreibst Dialogzeilen für ein deutschsprachiges Neo-Noir-Detektivspiel.

DER ERMITTLER STEHT VOR: ${c.name}, ${c.role}.
AUSSEHEN: ${c.appearance}
ORT: ${place}.

WAS DER ERMITTLER BISHER WEISS:
${wissen}

BISHERIGES GESPRÄCH:
${bisher}

Schreibe VIER Fragen, die der Ermittler dieser Person JETZT stellen könnte.

REGELN:
- Ganze deutsche Sätze in direkter Rede, so wie ein Mensch fragt. Sie-Form.
- Höchstens zwölf Wörter pro Frage. Sie stehen auf Schaltflächen.
- Benenne konkrete Dinge: die Reklame, den Schirm, die Kisten, den Namen aus
  der Akte. Keine Platzhalter, keine allgemeinen Floskeln.
- Vier verschiedene Tonlagen, in dieser Reihenfolge:
  1. beiläufig, fast Small Talk, etwas Sichtbares am Ort oder an der Person
  2. sachlich, nach einer Person, einer Uhrzeit oder einem Ablauf
  3. etwas aus der Liste oben — aber als Frage formuliert, nicht als Vorwurf
  4. unangenehm: die Frage, die diese Person nicht hören will
- Stelle keine Frage, die im Gespräch oben schon gestellt wurde.
- Erfinde NICHTS: keine Sektornummern, Namen, Firmen, Uhrzeiten oder Orte, die
  nicht oben stehen. Beim Prüfen fragte der Ermittler nach einem „Zollsiegel
  aus Sektor Vier" — den Sektor gibt es nicht, und die Figur kann darauf nur
  Unsinn antworten. Bleib bei dem, was in der Liste und am Ort wirklich steht.
- Keine Nummerierung, keine Anführungszeichen, keine Erklärungen.
- Eine Frage pro Zeile, jede Zeile beginnt mit "- ".`;
}

/**
 * Baut die Anweisung für eine Figur.
 * @param {object} c Figur aus CHARACTERS
 * @param {{label: string, text: string}[]} notes Was in der Akte steht
 * @param {string} place Wo das Gespräch stattfindet
 * @param {boolean} drinnen Innenraum? Draußen regnet es, drinnen nicht.
 */
export function buildSystem(c, notes, place, drinnen = false) {
  const known = notes.length
    ? notes.map((n) => `- ${n.label}: ${n.text}`).join('\n')
    : '- nichts';

  return `${NOIR_VOICE}

DU BIST: ${c.name}, ${c.role}.
AUSSEHEN: ${c.appearance}
WESEN: ${c.voice}
DEIN GEHEIMNIS (nicht die Tat, du gibst es nur unter Druck preis): ${c.secret}
WAS DU WEISST: ${c.knows}

${/* Der Satz stand hier fest verdrahtet auf „Es regnet, ihr steht draußen" —
      auch in der Bar, im Präsidium und zuletzt im Kühlhaus. Eine Figur, die
      dort vom Regen auf ihrem Mantel spricht, entwertet den ganzen Raum. */ ''}
ORT: ${place}. ${drinnen
    ? 'Ihr seid beide drinnen. Hier regnet es nicht — erwähne kein Wetter, '
      + 'keine Pfützen und keinen nassen Mantel, außer jemand ist gerade '
      + 'hereingekommen.'
    : 'Es regnet. Ihr steht beide draußen.'}

WAS DER ERMITTLER BEREITS HERAUSGEFUNDEN HAT:
${known}

REGELN:
- Antworte in der Ich-Form, zwei bis vier Sätze. Nie länger.
- Du bist keine Auskunftsstelle. Du hast eigene Interessen und wenig Zeit.
- Wird dir etwas vorgehalten, das in der Liste oben steht, reagierst du darauf —
  ausweichend, gereizt oder mit einem Zugeständnis, je nachdem wie nah es an
  deinem Geheimnis liegt.
- Erfinde keine Namen oder Orte, die es im Spiel nicht gibt.
- Gibst du etwas wirklich Neues preis, hänge als LETZTE Zeile an:
  [SPUR] eine knappe Notiz in der dritten Person, höchstens zwölf Wörter.
  Sonst lass die Zeile weg.`;
}
