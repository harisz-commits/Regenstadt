/**
 * FALL 2 — die Sektoren.
 *
 * Drei statt sechs, und enger beieinander. Fall 1 war eine Stadtdurchquerung;
 * dieser Fall spielt an einem Rand, an dem alles stillsteht. Das soll man auch
 * an der Karte sehen.
 */

export const SEKTOREN = {
  'sektor-11': {
    id: 'sektor-11',
    name: 'Sektor 11 · Klärwerk',
    kurz: 'Klärwerk',
    arrival: 'f2-becken',
    mx: 30, my: 30,
    blurb: 'Stillgelegt seit dem Winter. Die Becken stehen voll und frieren '
         + 'von oben zu. Hier liegt er.',
    offen: true,
  },

  'sektor-6': {
    id: 'sektor-6',
    name: 'Sektor 6 · Werkssiedlung',
    kurz: 'Werkssiedlung',
    arrival: 'f2-siedlung',
    mx: 68, my: 52,
    blurb: 'Zwei Reihen Häuser für Leute, die es nicht mehr gibt. In dreien '
         + 'brennt Licht.',
    requires: { clue: 'f2-marke-gefunden' },
    hint: 'Eine Werksmarke ohne Nummer führt dorthin, wo die Schicht gewohnt hat.',
  },

  'f2-zuhause': {
    id: 'f2-zuhause',
    name: 'Sektor 7 · Zuhause',
    kurz: 'Wohnung',
    arrival: 'f2-wohnung',
    mx: 22, my: 76,
    blurb: 'Vier Wände, eine Pinnwand und alles, was du bisher hast. Hier wird '
         + 'entschieden, wer es gewesen ist.',
    offen: true,
  },
};
