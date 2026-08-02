/**
 * FALL 2 — die Figuren.
 *
 * Vier statt acht, und das ist der Punkt: In Fall 1 war die Frage, WER es war.
 * Hier weiss man das nach zwei Orten. Die Frage ist, ob man es beweisen kann,
 * wenn der einzige Zeuge amtlich nicht existiert.
 *
 * Deshalb hat der Zeuge das schwerste Geheimnis von allen — nicht, was er
 * gesehen hat, sondern dass jede Aussage ihn selbst kostet.
 */

export const FIGUREN = {
  'f2-zeuge': {
    id: 'f2-zeuge',
    name: 'Ilja Marek',
    role: 'Seit vierhundertzwanzig Tagen tot',
    portrait: 'details/f2-zeuge.jpg',
    appearance: 'Zwei Mäntel übereinander, Bart bis zum Hals, Hände zwischen '
              + 'den Knien. Er steht nicht auf.',
    voice: 'sehr leise, in kurzen Sätzen, lange Pausen; er antwortet erst, '
         + 'wenn er sicher ist, dass die Frage wirklich zu Ende ist',
    secret: 'Er hat in der Nacht gearbeitet, in der der Tote starb, und er hat '
          + 'gesehen, wer die Plane geholt hat. Jede Aussage dazu beweist, dass '
          + 'er lebt — und wer amtlich tot ist und wieder auftaucht, wird '
          + 'nicht rehabilitiert, sondern entsorgt.',
    knows: 'Er kennt alle sechs bis neun, die jede Nacht geholt wurden, und '
         + 'weiß, wer sie geholt hat.',
    opener: 'Er sieht dich an und wartet, dass du wieder gehst. Als du das '
          + 'nicht tust, rückt er ein Stück zur Seite, damit Platz auf der '
          + 'Matratze ist. Gesagt hat er noch nichts.',
    spuren: [
      {
        id: 'f2-marek-schicht',
        wenn: { clue: 'f2-drei-fenster' },
        clue: 'f2-nachtarbeit',
        was: 'Du hast nach der Stilllegung weitergearbeitet. Nachts, zu sechst '
           + 'bis neunt, ohne Papier und ohne Lohn — für Essen und dafür, dass '
           + 'niemand fragt, warum du noch atmest.',
        notiz: 'Nach der Stilllegung wurde nachts weitergearbeitet — ohne Papier, ohne Lohn.',
      },
      {
        id: 'f2-marek-nacht',
        wenn: { clue: 'f2-zweite-schicht' },
        clue: 'f2-augenzeuge',
        was: 'In der Nacht, in der der Tote starb, warst du dort. Du hast '
           + 'gesehen, wer die Plane geholt hat und wer das Eis aufgeschlagen '
           + 'hat. Es war einer, keiner sonst.',
        notiz: 'Marek war in der Todesnacht im Werk und hat gesehen, wer das Eis aufschlug.',
      },
    ],
  },

  'f2-pfoertnerin': {
    id: 'f2-pfoertnerin',
    name: 'Roswita Kiel',
    role: 'Wache · Werksbüro',
    portrait: 'details/f2-pfoertnerin.jpg',
    appearance: 'Im Mantel in einem geheizten Raum, den Rücken zur Tür, den '
              + 'Blick in die dunkle Halle.',
    voice: 'knapp, unfreundlich aus Gewohnheit, nicht aus Feindseligkeit; '
         + 'antwortet in Dienstvorschriften, wenn sie ausweichen will',
    secret: 'Sie hat die Nachtschichten kommen und gehen sehen und den zweiten '
          + 'Becher jedes Mal weggeräumt. Sie hat nie gefragt, weil sie die '
          + 'Einzige ist, die hier noch bezahlt wird.',
    knows: 'Sie weiß, wer die drei ersetzten Blätter ins Schichtbuch gelegt hat, '
         + 'weil sie ihm den Stift gereicht hat.',
    opener: 'Sie dreht sich nicht um. „Das Werk ist geschlossen", sagt sie in '
          + 'die Halle hinaus. „Seit vier Monaten. Steht am Tor."',
    spuren: [
      {
        id: 'f2-kiel-becher',
        wenn: { clue: 'f2-zwei-becher' },
        clue: 'f2-nicht-allein',
        was: 'Du bist hier nie allein. Jede Nacht kommt einer, trinkt einen '
           + 'Becher und geht wieder in die Halle. Du räumst den Becher weg, '
           + 'bevor der Tag anfängt.',
        notiz: 'Jede Nacht kommt jemand ins Büro, trinkt und geht in die Halle.',
      },
      {
        id: 'f2-kiel-stift',
        wenn: { clue: 'f2-nachtarbeit' },
        clue: 'f2-wer-schrieb',
        was: 'Die drei neuen Blätter im Schichtbuch hat der Werksvorsteher '
           + 'eingelegt. Du hast ihm den Stift gereicht und nicht gefragt.',
        notiz: 'Der Werksvorsteher hat die drei Blätter selbst ins Schichtbuch gelegt.',
      },
    ],
  },

  'f2-technikerin': {
    id: 'f2-technikerin',
    name: 'Bea Ohlert',
    role: 'Spurensicherung',
    portrait: 'details/f2-technikerin.jpg',
    appearance: 'Handschuhe, Stirnlampe hochgeschoben, arbeitet im Stehen und '
              + 'sieht beim Reden nicht auf.',
    voice: 'sachlich, schnell, mit einem trockenen Humor, der nur ihr selbst '
         + 'gilt; sagt lieber „noch nicht" als „nein"',
    secret: 'Der Abgleich, den sie gefahren hat, hat einen Treffer ergeben, den '
          + 'sie nicht melden darf: Die Abdrücke gehören einem Mann, der seit '
          + 'über einem Jahr als tot geführt wird.',
    knows: 'Sie weiß, dass ein Treffer auf einen Toten das Verfahren beendet, '
         + 'bevor es anfängt — und wem das gelegen kommt.',
    opener: 'Sie hört dich kommen und schiebt dir mit dem Ellbogen einen '
          + 'Kaffeebecher hin, ohne aufzusehen. „Fassen Sie nichts an, was auf '
          + 'dem Tablett liegt."',
    spuren: [
      {
        id: 'f2-ohlert-treffer',
        wenn: { clue: 'f2-augenzeuge' },
        clue: 'f2-abgleich',
        was: 'Der Abgleich hat getroffen. Die Abdrücke am Beckenrand gehören '
           + 'einem Mann, der seit über einem Jahr amtlich tot ist. Du hast den '
           + 'Treffer nicht gemeldet, weil er das Verfahren beendet hätte.',
        notiz: 'Die Abdrücke am Beckenrand gehören einem amtlich Toten. Treffer nicht gemeldet.',
      },
    ],
  },

  'f2-vorsteher': {
    id: 'f2-vorsteher',
    name: 'Konrad Selb',
    role: 'Werksvorsteher',
    portrait: 'details/f2-vorsteher.jpg',
    appearance: 'Mütze neben dem Becher, Rücken halb zur Tür, sieht in den '
              + 'verschneiten Hof. Große Hände, sehr ruhig.',
    voice: 'freundlich und langsam, duzt ungefragt, erzählt Anekdoten statt zu '
         + 'antworten; wird nie laut und weicht nie sichtbar aus',
    secret: 'Er hat die zweite Schicht angeordnet und am Laufen gehalten. Der '
          + 'Tote wollte aussteigen und drohte damit, zur Aufsicht zu gehen. '
          + 'Selb hält das nicht für Mord, sondern für die Rettung von acht '
          + 'Leuten, die sonst wieder nichts gewesen wären.',
    knows: 'Alles. Er hat das Buch selbst geschrieben, die Portionen selbst '
         + 'gezählt und den Kanister selbst hergeschleppt.',
    opener: 'Er nickt in Richtung des Stuhls gegenüber, ohne sich umzudrehen. '
          + '„Setzen Sie sich, es zieht an der Tür." Dann erst sieht er dich an.',
    spuren: [
      {
        id: 'f2-selb-schicht',
        wenn: { clue: 'f2-anweisung' },
        clue: 'f2-eingeraeumt',
        was: 'Du hast die zweite Schicht angeordnet und sie am Laufen gehalten '
           + '— für Männer, die es amtlich nicht gibt, damit sie nicht ganz '
           + 'verschwinden. Du hältst das bis heute für richtig.',
        notiz: 'Selb räumt die zweite Schicht ein und hält sie für richtig.',
      },
    ],
  },
};
