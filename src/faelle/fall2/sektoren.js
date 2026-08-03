/**
 * FALL 2 — die Sektoren.
 *
 * Sieben statt drei. Die erste Fassung dieses Falls spielte an einem einzigen
 * Rand der Stadt, und das war der Grund, warum er nach einer Stunde vorbei
 * war: Wo man nicht hinfliegen kann, gibt es auch nichts freizuschalten.
 *
 * Die Ordnung auf der Karte erzaehlt den Fall mit:
 *
 *   Oben liegen die Aemter (Kuratorium, Praesidium, Pegelnetz), in der Mitte
 *   das Werk und seine Siedlung — und darunter, an derselben Stelle wie das
 *   Werk, nur tiefer, der Sektor, den es amtlich nicht gibt.
 *
 * Zwei Sektoren sind von Anfang an offen: das Werk, weil dort die Leiche
 * liegt, und das Praesidium, weil man dorthin nicht eingeladen werden muss.
 * Alles andere muss man sich verdienen.
 */

export const SEKTOREN = {
  'f2-werk': {
    id: 'f2-werk',
    name: 'Sektor 11 · Klärwerk',
    kurz: 'Klärwerk',
    arrival: 'f2-becken',
    // Position auf der Karte (Ansichtsfeld 0…100). Fest, nicht zufaellig.
    mx: 34, my: 30,
    blurb: 'Stillgelegt seit dem Winter. Die Becken stehen voll und frieren '
         + 'von oben zu. Hier liegt er.',
    offen: true,
  },

  'f2-praesidium': {
    id: 'f2-praesidium',
    name: 'Sektor 2 · Präsidium',
    kurz: 'Präsidium',
    arrival: 'f2-leichenhalle',
    mx: 50, my: 66,
    blurb: 'Leichenhalle und Archiv, derselbe Kellergang. Das eine sagt dir, '
         + 'woran er gestorben ist, das andere, wo er dabei war.',
    offen: true,
  },

  'f2-netz': {
    id: 'f2-netz',
    name: 'Sektor 4 · Pegelnetz',
    kurz: 'Pegelnetz',
    arrival: 'f2-pegel',
    mx: 64, my: 16,
    blurb: 'Ein Turm am Nordkanal, der den Wasserstand meldet und sonst '
         + 'nichts. Von hier aus hat einer elf Nächte lang zugehört.',
    requires: { clue: 'f2-wer-er-war' },
    hint: 'Ein Name für den Toten führt an seinen Dienstort.',
  },

  'f2-zeile': {
    id: 'f2-zeile',
    name: 'Sektor 6 · Werkssiedlung',
    kurz: 'Werkssiedlung',
    arrival: 'f2-siedlung',
    mx: 70, my: 46,
    blurb: 'Zwei Reihen Häuser für Leute, die es nicht mehr gibt. In dreien '
         + 'brennt Licht.',
    requires: { clue: 'f2-marke-gefunden' },
    hint: 'Eine Werksmarke ohne Nummer führt dorthin, wo die Schicht gewohnt hat.',
  },

  'f2-tiefe': {
    id: 'f2-tiefe',
    name: 'Sektor 9 · Unter dem Werk',
    kurz: 'Unter dem Werk',
    arrival: 'f2-schachtkopf',
    // Auf der Karte direkt unter dem Werk: Es ist derselbe Ort, nur vierhundert
    // Meter tiefer.
    mx: 34, my: 48,
    blurb: 'Vierhundert Meter unter einem Klärwerk, das drei Becken haben '
         + 'sollte. Es hat vier, und unter dem vierten hört das Bekannte auf.',
    requires: { clue: 'f2-schacht' },
    hint: 'Ein beschnittener Grubenriss führt unter das Werk.',
  },

  'f2-kuratorium': {
    id: 'f2-kuratorium',
    name: 'Sektor 1 · Kuratorium',
    kurz: 'Kuratorium',
    arrival: 'f2-vorzimmer',
    mx: 84, my: 26,
    blurb: 'Ein Haus, das für Tiefbau und Vorsorge zuständig ist und in den '
         + 'letzten vierzehn Monaten weder gebaut noch vorgesorgt hat.',
    requires: { clue: 'f2-kuratorium-akte' },
    hint: 'Wer eine Akte seit vierzehn Monaten entnommen hat, ist auffindbar.',
  },

  'f2-zuhause': {
    id: 'f2-zuhause',
    name: 'Sektor 7 · Zuhause',
    kurz: 'Wohnung',
    arrival: 'f2-wohnung',
    mx: 20, my: 78,
    blurb: 'Vier Wände, eine Pinnwand und alles, was du bisher hast. Hier wird '
         + 'entschieden, wer es gewesen ist.',
    offen: true,
  },
};
