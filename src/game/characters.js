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
 * Welche Geständnisse eine Figur JETZT machen könnte.
 *
 * Ein Geständnis (`spuren` in den Falldaten) hat eine Bedingung: Erst wenn der
 * Ermittler das Passende in der Hand hat, ist die Figur überhaupt in der Lage,
 * es preiszugeben. Was er noch nicht hat, steht gar nicht erst in der
 * Anweisung — sonst plaudert die Figur es aus, bevor jemand danach fragt.
 *
 * @param {object} c Figur
 * @param {(req: object) => boolean} erfuellt Bedingungsprüfer aus world.js
 */
export function offeneGestaendnisse(c, erfuellt, schonGesagt = new Set()) {
  return (c.spuren || []).filter((s) => !schonGesagt.has(s.id) && erfuellt(s.wenn));
}

/**
 * Baut die Anweisung, die dem Spieler VORSCHLAGSFRAGEN schreibt.
 *
 * Der erste Versuch hat die Fragen aus Bausteinen gesetzt: „Vorhalten: " plus
 * die Überschrift einer Aktennotiz. Bei einem Fundstück ging das gerade noch,
 * bei einem Ort kam „Ich halte Ihnen vor — Bar" heraus. Das ist kein Satz,
 * den ein Mensch sagt. Deshalb schreibt sie jetzt dasselbe Modell, das auch
 * antwortet.
 *
 * DREI DINGE HABEN SICH IM SPIEL ALS FALSCH ERWIESEN:
 *
 * 1. Die erste der vier Tonlagen war „beiläufig, fast Small Talk". Mit sechzig
 *    Einträgen in der Akte fragte der Ermittler immer noch nach dem Regen auf
 *    dem Mantel — ein Viertel jeder Runde war verschenkt. Small Talk gibt es
 *    jetzt nur noch, solange man wirklich nichts in der Hand hat.
 * 2. Es kamen mal drei, mal vier Fragen, weil das Modell mal drei, mal vier
 *    brauchbare Zeilen lieferte. Für den Spieler sah das aus, als würde die
 *    Auswahl je nach Fortschritt schrumpfen. Jetzt sind es immer vier.
 * 3. Schon gestellte Fragen kamen wieder, weil nur der letzte Gesprächsverlauf
 *    mitging. Jetzt geht die vollständige Liste mit.
 *
 * @param {object} c Figur
 * @param {{label: string, text: string}[]} notes Akte
 * @param {string} place Ort
 * @param {{role: string, text: string}[]} verlauf bisheriges Gespräch
 * @param {string[]} schonGefragt alle je gestellten Fragen an DIESE Figur
 * @param {object[]} gestaendnisse was diese Figur JETZT preisgeben könnte
 */
export function buildFragen(c, notes, place, verlauf, schonGefragt = [], gestaendnisse = []) {
  const wissen = notes.length
    ? notes.map((n) => `- ${n.label}: ${n.text}`).join('\n')
    : '- noch nichts';

  const bisher = verlauf.length
    ? verlauf.slice(-8).map((m) => (m.role === 'user' ? 'ERMITTLER: ' : `${c.name.toUpperCase()}: `) + m.text).join('\n')
    : '(noch nichts gesagt)';

  const gesperrt = schonGefragt.length
    ? schonGefragt.map((q) => `- ${q}`).join('\n')
    : '- (noch keine)';

  // Ohne Akte gibt es nichts vorzuhalten — dann ist Abtasten die einzige
  // ehrliche Möglichkeit.
  const leer = notes.length === 0;

  /*
   * Worauf mindestens ein Vorhalt zielen soll.
   *
   * Gemessen: Ohne diesen Absatz fragte der Ermittler zwar nach dem Zollsiegel,
   * aber so beiläufig, dass die Figur sechs Runden lang auswich — obwohl das
   * Geständnis bereitlag und auf eine direkte Konfrontation sofort kam. Die
   * Vorschlagsfragen müssen dorthin zielen, wo etwas aufbrechen KANN, sonst
   * ist die schönste Mechanik im Hintergrund wirkungslos.
   *
   * Der Text ist bewusst das, was der Ermittler VERMUTET — nicht die Antwort.
   * Er soll fragen, nicht verkünden.
   */
  const ziele = gestaendnisse.length
    ? '\n\nDAHIN ZIELEN: Der Ermittler hat den Verdacht, dass diese Person\n'
      + 'Folgendes verschweigt. Mindestens ein Vorhalt muss direkt und\n'
      + 'unbequem darauf zugehen — als Frage, nicht als Behauptung:\n'
      + gestaendnisse.map((g) => `- ${g.was}`).join('\n')
    : '';

  return `Du schreibst Dialogzeilen für ein deutschsprachiges Neo-Noir-Detektivspiel.

DER ERMITTLER STEHT VOR: ${c.name}, ${c.role}.
AUSSEHEN: ${c.appearance}
ORT: ${place}.

WAS DER ERMITTLER BISHER WEISS:
${wissen}

BISHERIGES GESPRÄCH:
${bisher}

DIESE FRAGEN WURDEN DIESER PERSON BEREITS GESTELLT — keine davon, auch nicht
umformuliert oder mit anderen Worten:
${gesperrt}

Schreibe SECHS Fragen, die der Ermittler dieser Person JETZT stellen könnte.
Das Spiel zeigt davon die ersten vier, die brauchbar sind — schreib deshalb
lieber eine zu viel als eine zu wenig.${ziele}

SPRACHE: Deutsch. Ausschließlich. Kein englisches Wort.

FORM: Vier Zeilen, sonst nichts. Keine Nummerierung, keine Anführungszeichen,
keine Überschrift, keine Erklärung. Jede Zeile beginnt mit einem Zeichen:

  -   eine gewöhnliche Frage
  !   ein VORHALT: Die Frage nennt etwas Konkretes aus der Liste oben und
      konfrontiert die Person damit — direkt, nicht beiläufig.

${leer
    ? 'Der Ermittler hat noch nichts in der Hand. Schreibe deshalb SECHS\n'
      + 'gewöhnliche Fragen mit "- ": abtastend, nach Ort, Zeit, Personen und\n'
      + 'nach dem, was an dieser Person oder an diesem Ort zu sehen ist.'
    : 'Mindestens DREI der sechs Zeilen sind Vorhalte mit "! ". Sie benennen\n'
      + 'verschiedene Dinge aus der Liste oben — nicht zweimal dasselbe.\n'
      + 'Die übrigen Zeilen mit "- " fragen nach Personen, Uhrzeiten, Abläufen.'}

WEITERE REGELN:
- Ganze Sätze in direkter Rede, Sie-Form, so wie ein Mensch fragt.
- Höchstens zwölf Wörter pro Frage. Sie stehen auf Schaltflächen.
- Benenne konkrete Dinge: die Reklame, den Schirm, die Kisten, den Namen aus
  der Akte. Keine Platzhalter, keine allgemeinen Floskeln.
- Kein Small Talk über das Wetter, wenn oben etwas in der Liste steht.
- Erfinde NICHTS: keine Sektornummern, Namen, Firmen, Uhrzeiten oder Orte, die
  nicht oben stehen. Beim Prüfen fragte der Ermittler nach einem „Zollsiegel
  aus Sektor Vier" — den Sektor gibt es nicht, und die Figur kann darauf nur
  Unsinn antworten. Bleib bei dem, was in der Liste und am Ort wirklich steht.`;
}

/**
 * Baut die Anweisung für eine Figur.
 *
 * @param {object} c Figur aus CHARACTERS
 * @param {{label: string, text: string}[]} notes Was in der Akte steht
 * @param {string} place Wo das Gespräch stattfindet
 * @param {boolean} drinnen Innenraum? Draußen regnet es, drinnen nicht.
 * @param {object[]} gestaendnisse Was diese Figur jetzt preisgeben KÖNNTE
 */
export function buildSystem(c, notes, place, drinnen = false, gestaendnisse = []) {
  const known = notes.length
    ? notes.map((n) => `- ${n.label}: ${n.text}`).join('\n')
    : '- nichts';

  /*
   * Geständnisse als Daten.
   *
   * Vorher konnte ein Gespräch nur eine Notiz erzeugen, nie einen Hinweis —
   * Reden war Deko, es hat nie eine Tür geöffnet. Jetzt trägt jede Figur
   * abrufbare Geständnisse mit einer Bedingung, und das Modell markiert das
   * abgerufene mit seiner Kennung. Erst dadurch kann ein Verhör die Ermittlung
   * voranbringen statt sie nur zu färben.
   */
  const abrufbar = gestaendnisse.length
    ? gestaendnisse.map((g) => `[${g.id}] ${g.was}\n    Rückt du damit heraus, hänge als letzte Zeile an: [SPUR:${g.id}]`).join('\n')
    : '(nichts — du hast im Moment nichts, was du preisgeben könntest)';

  return `${NOIR_VOICE}

DU BIST: ${c.name}, ${c.role}.
AUSSEHEN: ${c.appearance}
WESEN: ${c.voice}
DEIN GEHEIMNIS (nicht die Tat, du gibst es nur unter Druck preis): ${c.secret}
WAS DU WEISST: ${c.knows}

ORT: ${place}. ${drinnen
    ? 'Ihr seid beide drinnen. Hier regnet es nicht — erwähne kein Wetter, '
      + 'keine Pfützen und keinen nassen Mantel, außer jemand ist gerade '
      + 'hereingekommen.'
    : 'Es regnet. Ihr steht beide draußen.'}

WAS DER ERMITTLER BEREITS HERAUSGEFUNDEN HAT:
${known}

WAS DU JETZT PREISGEBEN KÖNNTEST — aber nur unter echtem Druck:
${abrufbar}

REGELN:
- Antworte auf Deutsch, in der Ich-Form, zwei bis vier Sätze. Nie länger.
- Du bist keine Auskunftsstelle. Du hast eigene Interessen und wenig Zeit.
- Wird dir etwas vorgehalten, das in der Liste oben steht, reagierst du darauf —
  ausweichend, gereizt oder mit einem Zugeständnis, je nachdem wie nah es an
  deinem Geheimnis liegt.
- Was oben unter „PREISGEBEN KÖNNTEST" steht, kann der Ermittler bereits
  belegen — sonst stünde es dort nicht. Verlange also KEINEN weiteren Beweis
  und kein bestimmtes Schriftstück. Geht er dich direkt darauf an, weichst du
  einmal aus; fragt er nach oder wird konkret, rückst du heraus.
- Auf eine beiläufige Frage rückst du nichts heraus.
- Erfinde keine Namen oder Orte, die es im Spiel nicht gibt.
- Gibst du etwas Neues preis, das oben NICHT als Geständnis steht, hänge als
  letzte Zeile an: [SPUR] eine knappe Notiz in der dritten Person, höchstens
  zwölf Wörter. Sonst lass die Zeile weg.`;
}
