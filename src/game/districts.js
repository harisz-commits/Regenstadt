/**
 * Die Sektoren des laufenden Falls — und warum es das Flugauto gibt.
 *
 * Die Sektoren selbst stehen im Fall (`src/faelle/<name>/sektoren.js`); hier
 * steht nur, wie das Spiel an sie kommt. Lebende Bindungen, siehe `fall.js`.
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

import { fall, beiFallwechsel } from './fall.js';

export let DISTRICTS = fall().sektoren;

/** Reihenfolge auf der Karte. */
export let DISTRICT_IDS = Object.keys(DISTRICTS);

beiFallwechsel(() => {
  DISTRICTS = fall().sektoren;
  DISTRICT_IDS = Object.keys(DISTRICTS);
});
