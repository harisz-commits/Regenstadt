/**
 * FALL 2 — die Loesung.
 *
 * Fall 1 endete mit einer Anklage gegen die Verwaltung eines Programms, das
 * Menschen fuer tot erklaert. Fall 2 fragt, WOFUER die Toten gebraucht wurden
 * — und die Antwort ist keine, die man in einer Verwaltung erwartet.
 *
 * DIE REIHE IST DIE SCHWIERIGKEIT. Zwischen dem Mann, der die Winde bedient,
 * und dem, der unterschreibt, stehen vier Leute, von denen jeder nur seinen
 * Teil getan hat: einer hat gefahren, einer hat gezaehlt, einer hat getippt,
 * einer hat gezeichnet. Wer den Falschen anklagt, klagt jemanden an, der
 * tatsaechlich dabei war — deshalb sind die falschen Antworten hier nicht
 * dumm, sondern verlockend.
 *
 * Der Werksvorsteher hat den Mann eigenhaendig in den Korb gestellt. Er ist
 * trotzdem nicht der Taeter: Er hat auf einen getippten Zettel hin gehandelt,
 * den ein anderer gezeichnet hat, und er hat geglaubt, der Mann kommt wieder
 * herauf. Das ist der Unterschied, den der Fall verhandelt.
 */

export const LOESUNG = {
  taeter: 'f2-kurator',

  beweise: [
    { clue: 'f2-schacht', label: 'Unter dem vierten Becken liegt ein Schacht, den es in keinem Plan gibt' },
    { clue: 'f2-zehn-stimmen', label: 'Auf dem Band sind zehn Stimmen, obwohl neun Mann eingeteilt waren' },
    { clue: 'f2-freigabe', label: 'Der Abstieg des Wärters war schriftlich freigegeben — gezeichnet' },
  ],

  voraussetzung: {
    clue: 'f2-augenzeuge',
    text: 'Ein Toter auf dem Eis, ein Loch im Boden und ein Ton, den niemand '
        + 'erklären kann. Damit stellt man sich vor niemanden hin. Solange du '
        + 'keinen hast, der gesehen hat, wie sie ihn hinuntergebracht haben, '
        + 'hast du eine sehr seltsame Meldung und keinen Fall.',
  },
};

export const PRAEMISSE =
  'In einem stillgelegten Klaerwerk liegt ein Waerter des Flutwarnnetzes unter '
  + 'einer Plane auf dem Eis. Elf Naechte lang hatte er auf dem Band, das fuer '
  + 'den Ernstfall freizuhalten ist, einen Ton aufgezeichnet: viele Stimmen, '
  + 'kein Wort, immer aus derselben Richtung. Unter dem vierten Becken des '
  + 'Werks liegt ein Schacht, der in keinem Plan steht, und darin steht etwas '
  + 'im Fels, das Licht abgibt und keine Waerme, das im Frost weiterwaechst und '
  + 'auf Schall antwortet. Vierzehn Monate lang haben Maenner, die amtlich fuer '
  + 'tot erklaert wurden, nachts dorthin eingefahren — erst um zu graben, dann '
  + 'um davorzustehen und zu singen, waehrend ihre Werte auf gedruckten '
  + 'Vordrucken mitgeschrieben wurden. Acht von ihnen liegen in einer Baracke '
  + 'am Ende der Siedlung. Der Waerter hat den Ton gefunden, und daraufhin hat '
  + 'das Kuratorium fuer Tiefbau und Vorsorge schriftlich freigegeben, dass er '
  + 'lebend einfaehrt: der erste registrierte Proband der Reihe.';
