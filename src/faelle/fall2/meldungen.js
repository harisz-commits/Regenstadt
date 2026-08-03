/**
 * FALL 2 — Meldungen. Siehe faelle/fall1/meldungen.js fuer das Warum.
 *
 * EINE MELDUNG MUSS AUF ETWAS ZEIGEN, DAS ES WIRKLICH GIBT. Die erste Fassung
 * meldete „In der Siedlung ist ein Licht ausgegangen" — und wer hinfuhr, fand
 * dort nichts, weil der Punkt fehlte. Eine Meldung, die ins Leere zeigt, ist
 * schlimmer als gar keine.
 *
 * Deshalb haengt jede hier an demselben Hinweis wie die Aenderung, die sie
 * ankuendigt: derselbe `clue` laesst den Punkt erscheinen, den Ausgang
 * aufgehen oder das Gestaendnis faellig werden.
 */

export const MELDUNGEN = [
  {
    // f2-nachtarbeit laesst 'f2-dunkles-fenster' in der Siedlung erscheinen.
    id: 'f2-licht-siedlung',
    wenn: { clue: 'f2-nachtarbeit' },
    titel: 'In der Siedlung ist ein Fenster dunkel geworden',
    text: 'Von dreien sind es noch zwei. Der Schnee vor der Tür ist frisch '
        + 'ausgetreten, in eine Richtung.',
  },
  {
    // f2-der-ton laesst 'f2-radio' in der eigenen Wohnung erscheinen.
    id: 'f2-radio-zieht',
    wenn: { clue: 'f2-der-ton' },
    titel: 'Dein Radio zieht nachts weg',
    text: 'Seit Jahren steht es auf demselben Sender. Zwischen zwei und fünf '
        + 'kippt es weg, und was darunter liegt, hast du bisher für die Leitung '
        + 'gehalten.',
  },
  {
    // f2-staub-waechst macht Ohlerts zweites Gestaendnis faellig.
    id: 'f2-ohlert-ruft',
    wenn: { clue: 'f2-staub-waechst' },
    titel: 'Die Frau am Spurenwagen hat zweimal angerufen',
    text: 'Beim ersten Mal hat sie aufgelegt, ohne etwas zu sagen. Beim zweiten '
        + 'Mal hat sie gefragt, ob du allein bist, und dann auch aufgelegt.',
  },
  {
    // f2-schacht oeffnet den Ausgang zum vierten Becken und den Sektor.
    id: 'f2-viertes-becken',
    wenn: { clue: 'f2-schacht' },
    titel: 'Hinter der Beckenreihe steht ein viertes Becken',
    text: 'Leergepumpt, während alle anderen voll stehen und zufrieren. Auf '
        + 'dem Werksplan, den man dir gegeben hat, ist es nicht eingezeichnet.',
  },
  {
    // f2-er-hat-versteckt laesst den Kasten am Mastfuss erscheinen.
    id: 'f2-mastfuss',
    wenn: { clue: 'f2-er-hat-versteckt' },
    titel: 'Auf dem Dach der Pegelstation liegt Schnee falsch',
    text: 'Am Fuß des Antennenmasts ist der Deckel des Betonkastens an einer '
        + 'Ecke frei — nicht vom Wind, sondern von einer Hand, die dort '
        + 'regelmäßig ansetzt.',
  },
];
