/**
 * FALL 2 — die Loesung.
 *
 * Fall 1 endete mit einer Anklage gegen die Verwaltung eines Programms, das
 * Menschen fuer tot erklaert. Fall 2 fragt, was mit denen passiert ist, die
 * schon durch dieses Programm gegangen sind — und dreht die Aufgabe um:
 *
 * In Fall 1 hat man gesucht, WER es war. Hier weiss man das nach zwei Orten.
 * Die Frage ist, ob man es beweisen kann, wenn der einzige Zeuge amtlich nicht
 * existiert und deshalb nicht aussagen darf.
 */

export const LOESUNG = {
  taeter: 'f2-vorsteher',

  beweise: [
    { clue: 'f2-zweite-schicht', label: 'Es gab eine zweite Schicht, die in keinem Buch steht' },
    { clue: 'f2-abgleich', label: 'Die Fingerabdrücke gehören einem amtlich Toten' },
    { clue: 'f2-anweisung', label: 'Die Anweisung kam schriftlich — und ist nicht vernichtet' },
  ],

  voraussetzung: {
    clue: 'f2-zeuge-gefunden',
    text: 'Eine Leiche in einem Werk, in dem laut Buch niemand war. Damit '
        + 'stellt man sich vor niemanden hin. Solange du keinen hast, der '
        + 'in dieser Nacht dort gewesen ist, hast du eine Meldung und keinen Fall.',
  },
};

export const PRAEMISSE =
  'In einem stillgelegten Klaerwerk liegt ein Toter, der laut Schichtbuch nie '
  + 'dort gewesen ist. Der einzige Zeuge ist einer der elf, die im vorigen Fall '
  + 'fuer tot erklaert wurden: Er lebt, aber er existiert amtlich nicht — seine '
  + 'Aussage ist wertlos, und wer ihn vorfuehrt, liefert ihn ans Messer. Der '
  + 'Werksvorsteher hat die Nachtschicht angeordnet, die in keinem Buch steht.';
