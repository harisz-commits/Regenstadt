/**
 * Sektoren — und warum es das Flugauto gibt.
 *
 * Mit sechs Orten reicht Laufen. Mit zwanzig nicht mehr: Wer vom Kühlhaus
 * zurück in die Kanalgasse will, klickt sich sonst durch sieben Pfeile, und
 * das ist keine Ermittlung, das ist Verwaltung.
 *
 * Das Blade-Runner-Spiel von 1997 hatte dafür den Spinner: eine Karte, ein
 * Ziel, ein Schnitt. Hier ist es genauso — und zwar aus drei Gründen, von
 * denen nur der erste offensichtlich ist:
 *
 *   1. Es macht die Stadt begehbar, ohne sie kleiner zu machen.
 *   2. Es ist der natürliche Ort für Freischaltungen. Ein Sektor, von dem man
 *      noch nichts weiß, steht als gesperrte Zeile auf der Karte — der Spieler
 *      SIEHT, dass es weitergeht, und weiß, dass ihm etwas fehlt. Eine Tür,
 *      die man nie gesehen hat, motiviert niemanden.
 *   3. Ein Flug kostet Zeit. Weil Laborbefunde in Ortswechseln reifen, ist
 *      Herumfliegen kein Leerlauf, sondern bringt die Ermittlung voran.
 *
 * Gelaufen wird INNERHALB eines Sektors, geflogen ZWISCHEN ihnen. Das erhält
 * das Point-and-Click-Gefühl an den Orten, wo es hingehört.
 */

export const DISTRICTS = {
  'sektor-7': {
    id: 'sektor-7',
    name: 'Sektor 7 · Unterstadt',
    kurz: 'Unterstadt',
    arrival: 'alley',
    blurb: 'Kanäle, Marktgassen, zu wenig Licht. Hier hat es angefangen.',
    // Von Anfang an bekannt: Hier steht man, wenn das Spiel beginnt.
    offen: true,
  },

  'sektor-3': {
    id: 'sektor-3',
    name: 'Sektor 3 · Hafenspange',
    kurz: 'Hafenspange',
    arrival: 'terminal',
    blurb: 'Frachtbrücken über schwarzem Wasser. Was hier durchgeht, wird '
         + 'zweimal gezählt und einmal gemeldet.',
    requires: { clue: 'zollsiegel' },
    hint: 'Ein Zollsiegel führt in einen Sektor, den du noch nicht kennst.',
  },
};

/** Reihenfolge auf der Karte. */
export const DISTRICT_IDS = Object.keys(DISTRICTS);
