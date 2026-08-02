/**
 * FALL 1 — die Sektoren, und warum es das Flugauto gibt.
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

export const SEKTOREN = {
  'sektor-7': {
    id: 'sektor-7',
    name: 'Sektor 7 · Unterstadt',
    kurz: 'Unterstadt',
    arrival: 'alley',
    // Position auf der Karte (Ansichtsfeld 0…100). Fest, nicht zufällig:
    // Die Karte soll bei jedem Öffnen gleich aussehen.
    mx: 38, my: 62,
    blurb: 'Kanäle, Marktgassen, zu wenig Licht. Hier hat es angefangen.',
    // Von Anfang an bekannt: Hier steht man, wenn das Spiel beginnt.
    offen: true,
  },

  'sektor-3': {
    id: 'sektor-3',
    name: 'Sektor 3 · Hafenspange',
    kurz: 'Hafenspange',
    arrival: 'terminal',
    mx: 76, my: 38,
    blurb: 'Frachtbrücken über schwarzem Wasser. Was hier durchgeht, wird '
         + 'zweimal gezählt und einmal gemeldet.',
    requires: { clue: 'zollsiegel' },
    hint: 'Ein Zollsiegel führt in einen Sektor, den du noch nicht kennst.',
  },

  'sektor-9': {
    id: 'sektor-9',
    name: 'Sektor 9 · Kanalebene',
    kurz: 'Kanalebene',
    arrival: 'pumpwerk',
    mx: 22, my: 84,
    blurb: 'Unter der Stadt. Pumpen, Tunnel, und Leute, die nicht gefunden '
         + 'werden wollen — oder es nicht mehr können.',
    requires: { clue: 'blut-fremd' },
    hint: 'Ein Blutbefund, der auf einen Toten zeigt, führt unter die Stadt.',
  },

  'sektor-1': {
    id: 'sektor-1',
    name: 'Sektor 1 · Konzernterrassen',
    kurz: 'Konzernterrassen',
    arrival: 'empfang',
    mx: 58, my: 24,
    blurb: 'Oben. Wo die Fracht bezahlt wird, die unten ankommt, und wo man '
         + 'den Regen von der anderen Seite sieht.',
    requires: { clue: 'frachtbrief' },
    hint: 'Ein Frachtbrief mit zweimal durchgestrichenem Kürzel führt nach oben.',
  },

  'sektor-4': {
    id: 'sektor-4',
    name: 'Sektor 4 · Meldeamt',
    kurz: 'Meldeamt',
    arrival: 'registratur',
    mx: 62, my: 74,
    blurb: 'Wo aus einem Menschen eine Nummer wird und aus einer Nummer nichts. '
         + 'Ein Stempel, und die Stadt hat einen weniger.',
    requires: { clue: 'konzern-programm' },
    hint: 'Elf Totenscheine von derselben Hand führen zu der Hand.',
  },

  // Die eigene Wohnung ist ein eigener Punkt auf der Karte, kein Zimmer
  // hinter drei Pfeilen. Zwei Gruende:
  //   1. Dort wird der Fall abgeschlossen. Der letzte Zug des Spiels darf
  //      nicht der laengste Fussweg des Spiels sein.
  //   2. Sie ist von Anfang an offen und der einzige Ort, an dem man nichts
  //      ermittelt. Ein Heimknopf auf der Karte sagt genau das.
  wohnung: {
    id: 'wohnung',
    name: 'Sektor 7 · Zuhause',
    kurz: 'Wohnung',
    arrival: 'wohnung',
    mx: 26, my: 44,
    blurb: 'Vier Wände, eine Pinnwand und alles, was du bisher hast. Hier wird '
         + 'entschieden, wer es gewesen ist.',
    offen: true,
  },
};

