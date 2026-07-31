/**
 * Orte und ihre Untersuchungspunkte.
 *
 * Koordinaten sind Bildkoordinaten der HINTERGRUNDPLATTE (u, v jeweils 0…1,
 * v von oben), nicht Bildschirmprozente. Wenn die Kamera driftet oder das Bild
 * seitlich geschoben wird, wandert der Punkt mit dem Bild mit.
 *
 * Ein Punkt kann drei Dinge tun:
 *   - `text`   Beschreibung in der Tafel (immer)
 *   - `detail` Nahaufnahme darüber — dafür ist das Untersuchen da: es soll
 *              etwas passieren, nicht nur ein Satz erscheinen
 *   - `goto`   an einen anderen Ort wechseln; solche Punkte bekommen einen
 *              Pfeil statt eines Kreises
 *
 * Die Texte sind Grundzustand. Der generierte Fall legt später eigene
 * Beschreibungen darüber.
 */

export const SCENES = {
  alley: {
    id: 'alley',
    name: 'Kanalgasse',
    sector: 'Sektor 7 · Unterstadt',
    backdrop: 'alley-backdrop',
    spots: [
      {
        id: 'stand', u: 0.281, v: 0.735, r: 0.085,
        label: 'Marktstand',
        text: 'Unter der Plane liegen Dinge, die niemand mehr abholt. Der Händler '
            + 'ist nicht da. Sein Hocker steht noch da, die Sitzfläche ist trocken.',
      },
      {
        id: 'sign-left', u: 0.392, v: 0.583, r: 0.070,
        label: 'Leuchtreklame',
        text: 'Ein Ring aus Neon, das Zeichen darin kennst du nicht. Zwei Röhren '
            + 'sind tot. Der Regen zischt darauf, wo das Glas noch warm ist.',
      },
      {
        id: 'lamp-left', u: 0.338, v: 0.610, r: 0.060,
        label: 'Straßenlaterne',
        text: 'Natriumdampf, das alte Zeug. Sie steht in einem Kegel aus Regen und '
            + 'macht alles darunter eine Spur gelber, als es sein müsste.',
      },
      {
        id: 'puddle', u: 0.490, v: 0.858, r: 0.100,
        label: 'Pfütze',
        text: 'Der Asphalt hat hier eine Senke. Das Wasser steht seit Tagen und '
            + 'gibt die Reklamen verkehrt herum zurück. Etwas Öliges treibt darauf.',
      },
      {
        id: 'crates-right', u: 0.636, v: 0.718, r: 0.080,
        label: 'Kistenstapel',
        detail: 'details/fracht.jpg',
        text: 'Frachtkisten, dreimal umgepackt. Das Holz ist aufgequollen, die '
            + 'Bänder rosten. Auf der obersten steht ein Zollsiegel, das in diesem '
            + 'Sektor eigentlich nichts zu suchen hat.',
      },
      {
        id: 'vent', u: 0.696, v: 0.672, r: 0.070,
        label: 'Dampfauslass',
        text: 'Aus dem Gitter kommt Wärme, die nach heißem Metall riecht. '
            + 'Darunter läuft etwas, das nie abgeschaltet wird.',
      },
      {
        id: 'panel-right', u: 0.742, v: 0.358, r: 0.075,
        label: 'Leuchttafel',
        text: 'Eine Werbetafel, weiß und blendend. Was sie anpreist, ist unter '
            + 'einer Schicht Ruß nicht mehr zu lesen. Sie brennt trotzdem weiter.',
      },
      {
        id: 'p-umbrella', u: 0.365, v: 0.726, r: 0.070, kind: 'person',
        label: 'Gestalt mit Schirm',
        detail: 'details/schirm.jpg',
        text: 'Sie steht da, seit du hergekommen bist, und rührt sich nicht. Der '
            + 'Schirm ist zu gut für diese Gasse. Der Mantel auch.',
      },
      {
        id: 'p-coat', u: 0.560, v: 0.708, r: 0.065, kind: 'person',
        label: 'Gestalt im Mantel',
        detail: 'details/mantel.jpg',
        text: 'Der Mantel ist nass bis zu den Schultern. Wer so lange im Regen '
            + 'steht, wartet nicht auf gutes Wetter.',
      },
      {
        id: 'go-deeper', u: 0.500, v: 0.618, r: 0.070,
        kind: 'exit', dir: 'forward', goto: 'alley2',
        label: 'Tiefer in die Gasse',
        text: 'Die Gasse hört hier nicht auf. Sie knickt ab und wird enger.',
      },
    ],
  },

  alley2: {
    id: 'alley2',
    name: 'Kanalgasse · Hinterer Abschnitt',
    sector: 'Sektor 7 · Unterstadt',
    backdrop: 'alley2-backdrop',
    spots: [
      {
        id: 'door', u: 0.135, v: 0.585, r: 0.095,
        label: 'Stahltür',
        text: 'Eine Diensttür ohne Klingel und ohne Nummer. Der Rost sitzt in '
            + 'Schlieren, aber der Griff ist blank gewetzt. Hier geht regelmäßig '
            + 'jemand hinein.',
      },
      {
        id: 'fire-escape', u: 0.352, v: 0.180, r: 0.085,
        label: 'Feuerleiter',
        text: 'Die unterste Leiter ist hochgezogen und mit Draht gesichert. '
            + 'Der Draht ist neu.',
      },
      {
        id: 'dumpster', u: 0.655, v: 0.700, r: 0.085,
        label: 'Müllcontainer',
        text: 'Halb offen. Was darin liegt, riecht nach Lösungsmittel, nicht nach '
            + 'Abfall. Der Deckel hat frische Kratzer, von innen.',
      },
      {
        id: 'grate', u: 0.895, v: 0.805, r: 0.080,
        label: 'Lüftungsgitter',
        text: 'Warmer Dunst steigt hier heraus, gleichmäßig, ohne Pause. Unter der '
            + 'Gasse läuft etwas, das Strom frisst.',
      },
      {
        id: 'steps', u: 0.750, v: 0.782, r: 0.070,
        label: 'Betonstufen',
        text: 'Drei Stufen zu einer Tür, die es nicht mehr gibt — zugemauert. '
            + 'Auf der obersten Stufe steht Wasser, in dem etwas glitzert.',
      },
      {
        id: 'far-street', u: 0.490, v: 0.540, r: 0.070,
        kind: 'exit', dir: 'forward', goto: null,
        label: 'Querstraße',
        text: 'Von dort kommt der Verkehr und das Licht. Dorthin gehst du erst, '
            + 'wenn du hier fertig bist.',
      },
      {
        id: 'go-back', u: 0.500, v: 0.930, r: 0.075,
        kind: 'exit', dir: 'back', goto: 'alley',
        label: 'Zurück',
        text: '',
      },
    ],
  },
};

/** Reihenfolge fürs Vorabladen der Hintergründe. */
export const SCENE_IDS = Object.keys(SCENES);
