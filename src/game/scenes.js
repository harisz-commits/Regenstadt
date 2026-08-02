/**
 * Die Orte des laufenden Falls.
 *
 * Diese Datei enthält keine Orte mehr — die stehen im Fall unter
 * `src/faelle/<name>/orte.js`. Hier steht nur, wie das Spiel an sie kommt.
 *
 * Die Ausfuhren sind `let` und werden beim Fallwechsel neu gesetzt. ES-Module
 * geben sie als LEBENDE Bindung weiter, deshalb sieht jeder Importeur die
 * Orte des neuen Falls, ohne dass sich an seiner Importzeile etwas ändert.
 * Siehe `fall.js`.
 *
 * Zur Erinnerung, weil es beim Anlegen neuer Orte immer wieder auffällt:
 *
 * Koordinaten sind Bildkoordinaten der HINTERGRUNDPLATTE (u, v jeweils 0…1,
 * v von oben), nicht Bildschirmprozente. Wenn die Kamera driftet oder das Bild
 * seitlich geschoben wird, wandert der Punkt mit dem Bild mit.
 *
 * Ein Ort hat:
 *   `kind`      'street' (Regen, nasse Fahrbahn, Spiegelung) oder
 *               'interior' — drinnen regnet es nicht, siehe main.js
 *   `spots`     alles, was man anklicken kann
 *
 * Ein Punkt kann:
 *   `text`      Beschreibung in der Tafel (immer)
 *   `detail`    Nahaufnahme darüber — dafür ist das Untersuchen da: es soll
 *               etwas passieren, nicht nur ein Satz erscheinen
 *   `item`      einen Gegenstand hergeben, den man mitnimmt
 *   `kind:'exit'` mit `dir` und `goto` an einen anderen Ort führen
 *   `kind:'lab'`  Abgabe und Abholung von Untersuchungen
 *   `kind:'anklage'` den Fall abschließen
 *   `requires`  eine Bedingung (siehe world.js). Ist sie nicht erfüllt, sagt
 *               `lockText`, was fehlt — ein Ausgang, der einfach nicht
 *               reagiert, liest sich als Fehler.
 */

import { fall, beiFallwechsel } from './fall.js';

/** Alle Orte des laufenden Falls, nach Kennung. */
export let SCENES = fall().orte;

/** Reihenfolge fürs Vorabladen der Hintergründe. */
export let SCENE_IDS = Object.keys(SCENES);

/** Wo das Spiel beginnt. */
export let START = fall().start;

beiFallwechsel(() => {
  SCENES = fall().orte;
  SCENE_IDS = Object.keys(SCENES);
  START = fall().start;
});
