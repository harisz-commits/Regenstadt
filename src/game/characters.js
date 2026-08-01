/**
 * Die Figuren, mit denen man sprechen kann.
 *
 * Namen und Rollen stammen aus der allerersten Fassung des Spiels — sie
 * standen dort schon als Notakte, falls das Fallarchiv nicht erreichbar war.
 *
 * Jede Figur hat ein Geheimnis, das NICHT die Tat ist. Das ist der Kniff,
 * damit ein Verhör mehr wird als Ja/Nein: Wer etwas zu verbergen hat, weicht
 * aus, auch wenn er unschuldig ist. Der Ermittler kann daran nicht ablesen,
 * wer der Täter ist — nur, dass jemand nervös wird.
 *
 * Der generierte Fall wird diese Einträge später überschreiben; der Aufbau
 * bleibt derselbe.
 */

export const CHARACTERS = {
  'p-umbrella': {
    id: 'p-umbrella',
    name: 'Kess Aldemir',
    role: 'Straßenhändlerin',
    portrait: 'details/schirm.jpg',
    appearance: 'Regenmantel aus Werbeplane, Finger voller Ringe, ein Schirm, '
              + 'der zu gut ist für diese Gasse.',
    voice: 'spöttisch, redet schnell, weicht aus, stellt Gegenfragen',
    secret: 'Sie hat eine Schlüsselkarte kopiert und weiterverkauft. Das gibt '
          + 'sie nur preis, wenn jemand ihr etwas Konkretes vorhält.',
    knows: 'Sie steht seit Stunden hier und hat gesehen, wer durch die Stahltür '
         + 'im hinteren Abschnitt gegangen ist. Sie erwähnt es nur beiläufig '
         + 'und nur, wenn das Gespräch darauf kommt.',
    opener: 'Sie sieht dich kommen, lange bevor du bei ihr bist, und dreht sich '
          + 'nicht weg. Der Regen läuft in Fäden vom Schirmrand.',
  },

  'p-coat': {
    id: 'p-coat',
    name: 'Doran Vey',
    role: 'Barbesitzer',
    portrait: 'details/mantel.jpg',
    appearance: 'Verbrannte linke Hand, ruhige Augen, ein Mantel, der bis zu '
              + 'den Schultern durchnässt ist.',
    voice: 'höflich, langsam, misst jedes Wort, wird nie laut',
    secret: 'Er nimmt Ware an, nach der niemand fragen soll — die Frachtkisten '
          + 'in der Gasse gehören ihm. Er gibt es erst zu, wenn ihm jemand '
          + 'den Zollcode vorhält.',
    knows: 'Er weiß, dass der Marktstand seit zwei Tagen unbesetzt ist und dass '
         + 'der Händler nicht freiwillig weggeblieben ist.',
    opener: 'Er steht im Regen, als wäre das eine Verabredung. Als du näher '
          + 'kommst, sieht er dich an und wartet ab, wer zuerst spricht.',
  },

  'p-wirtin': {
    id: 'p-wirtin',
    name: 'Vesna Kruse',
    role: 'Wirtin',
    portrait: 'details/wirtin.jpg',
    appearance: 'Ärmelloses Schwarz, Unterarme auf dem Zink, ein Blick, der '
              + 'schon oft befragt wurde und es nie mochte.',
    voice: 'kurz angebunden, trocken, antwortet mit Gegenfragen, nie unhöflich',
    secret: 'Sie ist dafür bezahlt worden zu vergessen, wer in der hinteren '
          + 'Nische saß. Das Geld liegt noch unangerührt da. Sie gibt es nur zu, '
          + 'wenn ihr jemand die nasse Sitzbank vorhält.',
    knows: 'Sie hat gesehen, wer vorgestern in Eile durch die Hintertür ist — '
         + 'jemand, der offiziell seit über einem Jahr tot ist. Sie sagt es erst, '
         + 'wenn ihr der Laborbefund vorgehalten wird.',
    opener: 'Sie füllt nichts nach und wischt nichts weg. Sie sieht dich den '
          + 'ganzen Weg vom Eingang bis zum Tresen an und sagt nichts.',
  },

  // Sitzt hinter dem Panzerglas im Praesidium. Derselbe Punkt ist auch der
  // Laborschalter — die Tafel zeigt dann beides: Ansprechen und Abgeben.
  'lab-counter': {
    id: 'lab-counter',
    name: 'Halina Ferz',
    role: 'Laborantin',
    portrait: 'details/laborantin.jpg',
    appearance: 'Abgetragener Kittel hinter zerkratztem Panzerglas, halb '
              + 'abgewandt. Sie sieht nicht auf, wenn sie spricht.',
    voice: 'sachlich bis zur Unhöflichkeit, redet in Befunden, keine Floskeln',
    secret: 'Ihr wurde untersagt, bestimmte Melderegister-Einträge gegenzuprüfen. '
          + 'Sie hat es einmal trotzdem getan und hat seitdem Angst. Sie sagt es '
          + 'nur, wenn ihr der Laborbefund vorgehalten wird.',
    knows: 'Sie weiß, dass in diesem Sektor seit vierzehn Monaten Tote gemeldet '
         + 'werden, deren Akten danach nie wieder angefasst wurden.',
    opener: 'Die Klappe bleibt zu. Sie arbeitet weiter, als hätte sie dich nicht '
          + 'bemerkt, und redet in Richtung ihrer Hände.',
  },

  'p-empfang': {
    id: 'p-empfang',
    name: 'Nadja Ferrin',
    role: 'Empfangsleitung',
    portrait: 'details/empfang.jpg',
    appearance: 'Dunkle Uniformjacke, beide Hände flach auf dem Stein, ein '
              + 'Gesicht, das nichts hergibt und darin sehr gut ist.',
    voice: 'höflich bis zur Kälte, spricht in fertigen Sätzen, sagt nie „ich '
         + 'weiß nicht", sondern „dazu kann ich Ihnen nichts sagen"',
    secret: 'Sie führt seit einem Jahr eine eigene Liste — jeden, der hier '
          + 'hereinkommt, ohne eingetragen zu werden. Nicht aus Gewissen, '
          + 'sondern weil ihr einmal etwas angehängt wurde, das sie nicht '
          + 'getan hat. Sie gibt es nur preis, wenn ihr jemand zeigt, dass er '
          + 'das Haus ohnehin schon durchschaut hat.',
    knows: 'Die Person, deren Nummer auf der Patientenkarte steht, ist in den '
         + 'letzten zwei Wochen zweimal durch diese Halle gegangen — nach dem '
         + 'Datum, an dem sie für tot erklärt wurde. Sie erwähnt es erst, wenn '
         + 'vom Melderegister oder von der Klinik die Rede ist.',
    opener: 'Sie sieht dich schon an, bevor du auf halber Höhe der Halle bist. '
          + 'Sie sagt nichts, sie wartet nur — als wäre Warten hier eine Form '
          + 'von Höflichkeit.',
  },

  'p-sachbearbeiter': {
    id: 'p-sachbearbeiter',
    name: 'Anselm Roth',
    role: 'Sachbearbeiter · Meldewesen',
    portrait: 'details/sachbearbeiter.jpg',
    appearance: 'Grauer Strickpullover hinter Glas, Schreiblampe tief gezogen, '
              + 'ein Stempel griffbereit neben der rechten Hand.',
    voice: 'umständlich höflich, redet in Vorschriften und Aktenzeichen, '
         + 'wiederholt Fragen, bevor er antwortet, um Zeit zu gewinnen',
    secret: 'Er hat die elf Totenscheine unterschrieben, ohne je eine Leiche '
          + 'gesehen zu haben. Nicht aus Gier — man hat ihm eine Akte über '
          + 'seine Tochter gezeigt und sie danach nie wieder erwähnt. Er bricht '
          + 'erst ein, wenn ihm der Registerabgleich oder das leere Fach in der '
          + 'Leichenhalle vorgehalten wird.',
    knows: 'Er kennt den Namen der Person, die ihm die Vorgänge bringt — jemand '
         + 'aus dem Konzern, immer nachts, immer allein. Er nennt ihn erst, '
         + 'wenn er zugegeben hat, dass er ohne Leiche unterschrieben hat.',
    opener: 'Er sieht auf, den Stift noch in der Hand, und legt ihn dann sehr '
          + 'genau parallel zur Kante des Papiers. Erst danach sagt er etwas.',
  },
};

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
 */
export function buildSystem(c, notes, place) {
  const known = notes.length
    ? notes.map((n) => `- ${n.label}: ${n.text}`).join('\n')
    : '- nichts';

  return `${NOIR_VOICE}

DU BIST: ${c.name}, ${c.role}.
AUSSEHEN: ${c.appearance}
WESEN: ${c.voice}
DEIN GEHEIMNIS (nicht die Tat, du gibst es nur unter Druck preis): ${c.secret}
WAS DU WEISST: ${c.knows}

ORT: ${place}. Es regnet. Ihr steht beide draußen.

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
