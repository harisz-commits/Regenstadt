/** Sieben neue Flugziele. Jeder Sektor hat drei begehbare Orte. */
export const SEKTOREN = {
  'f3-wolkenhafen': {
    id: 'f3-wolkenhafen', name: 'Sektor 13 · Wolkenhafen', kurz: 'Wolkenhafen',
    arrival: 'f3-flugdeck', mx: 20, my: 22,
    blurb: 'Ein Flugdeck über den Wolken. In einer versiegelten Gondel sitzt ein Toter, und vor ihm steht Fracht, die keinen Hersteller hat.',
    offen: true,
  },
  'f3-nachtmarkt': {
    id: 'f3-nachtmarkt', name: 'Sektor 5 · Umspannmarkt', kurz: 'Umspannmarkt',
    arrival: 'f3-markt', mx: 22, my: 64,
    blurb: 'Unter den Transformatoren wird verkauft, was in keinem Zollbuch auftauchen darf. Heute leuchtet etwas unter einem Tuch.',
    offen: true,
  },
  'f3-glasgaerten': {
    id: 'f3-glasgaerten', name: 'Sektor 8 · Glasgärten', kurz: 'Glasgärten',
    arrival: 'f3-gewachshausdach', mx: 45, my: 16,
    blurb: 'Gewächshäuser über den Dächern. Die Pflanzen wachsen seit drei Nächten in eine Richtung, die sich bewegt.',
    requires: { clue: 'f3-glasroute' },
    hint: 'Ein abgeglichener Frachtweg führt zu den Glasgärten.',
  },
  'f3-antennenfeld': {
    id: 'f3-antennenfeld', name: 'Sektor 14 · Antennenfeld', kurz: 'Antennenfeld',
    arrival: 'f3-antennen', mx: 70, my: 17,
    blurb: 'Sechs Schüsseln zwischen Wohnblöcken. Eine zeigt nicht in den Himmel, sondern mitten in die Stadt.',
    requires: { clue: 'f3-frequenz' },
    hint: 'Der Flugschreiber enthält eine Frequenz und eine Peilung.',
  },
  'f3-nullklinik': {
    id: 'f3-nullklinik', name: 'Sektor 17 · Nullklinik', kurz: 'Nullklinik',
    arrival: 'f3-klinikempfang', mx: 78, my: 48,
    blurb: 'Eine Klinik für Erinnerungsstörungen. Sieben Patienten können dieselben drei Minuten nicht mehr erzählen.',
    requires: { clue: 'f3-kliniksignatur' },
    hint: 'Eine medizinische Signatur auf dem Markt nennt die Klinik.',
  },
  'f3-werft': {
    id: 'f3-werft', name: 'Sektor 19 · Versunkene Werft', kurz: 'Versunkene Werft',
    arrival: 'f3-dock', mx: 48, my: 72,
    blurb: 'Ein halber Hafen unter schwarzem Wasser. Im Trockendock liegt etwas, das nie ein Schiff war.',
    requires: { clue: 'f3-werftspur' },
    hint: 'Das Frachtsiegel lässt sich bis zu einem Bergungsdock verfolgen.',
  },
  'f3-institut': {
    id: 'f3-institut', name: 'Sektor 0 · Institut', kurz: 'Kontinuitätsinstitut',
    arrival: 'f3-atrium', mx: 52, my: 42,
    blurb: 'Ein Haus über der Stadt, das Erinnerungen bewahrt. Im großen Fenster setzt sich gerade etwas selbst zusammen.',
    requires: { clue: 'f3-institut-route' },
    hint: 'Ein Lieferbuch der Werft nennt den Empfänger der geborgenen Teile.',
  },
};
