/**
 * FALL 1 — die Loesung.
 *
 * Bewusst DATEN, wie jede Bedingung im Spiel: Der Abschluss in
 * src/game/anklage.js wertet aus, was hier steht, und muss fuer einen zweiten
 * Fall nicht angefasst werden.
 */

/**
 * Die Lösung des Falls.
 *
 * Bewusst als DATEN, wie alle Bedingungen im Spiel (siehe world.js): Der
 * später generierte Fall wird eine eigene Lösung mitliefern, und die Auswertung
 * hier muss dafür nicht angefasst werden.
 */
export const LOESUNG = {
  taeter: 'p-direktorin',

  /** Was die Anklage tragen muss. Fehlt eines davon, geht sie frei. */
  beweise: [
    { clue: 'ohne-leiche', label: 'Zu keinem der elf Fälle gab es je eine Leiche' },
    { clue: 'elf-namen', label: 'Die Liste ist ein Terminkalender, kein Verzeichnis' },
    { clue: 'letzte-unterschrift', label: 'Die zwölfte Urkunde liegt fertig auf ihrem Tisch' },
  ],

  /**
   * Ohne das hier gibt es gar nichts anzuklagen. Es ist der Punkt, an dem aus
   * einem Vermisstenfall etwas anderes wird: Der Mann lebt.
   */
  voraussetzung: {
    clue: 'haendler-lebt',
    text: 'Ein Vermisster, ein Zollsiegel und ein Verdacht. Damit stellt man '
        + 'sich vor niemanden hin. Solange du nicht weißt, was aus dem Händler '
        + 'geworden ist, hast du keinen Fall, sondern eine Vermutung.',
  },
};

/**
 * Worum es geht — fuer den Nachspann.
 *
 * Stand vorher fest verdrahtet in der Anweisung des Nachspanns. Damit haette
 * Fall 2 die Geschichte von Fall 1 erzaehlt.
 */
export const PRAEMISSE =
  'Ein Marktstandbetreiber gilt als vermisst. Tatsaechlich laeuft in dieser '
  + 'Stadt ein Programm, das Menschen fuer tot erklaert, aus dem Melderegister '
  + 'nimmt und danach weiterverwendet. Elf Totenscheine, zu keinem davon je '
  + 'eine Leiche. Der Vermisste sollte der zwoelfte werden.';
