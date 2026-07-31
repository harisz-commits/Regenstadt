/**
 * Untersuchungspunkte der Kanalgasse.
 *
 * Koordinaten sind Bildkoordinaten der HINTERGRUNDPLATTE (u, v jeweils 0…1,
 * v von oben), nicht Bildschirmprozente. Das ist der Unterschied, der zählt:
 * Wenn die Kamera driftet, wandert der Punkt mit dem Bild mit, statt an Ort
 * und Stelle über der Szene zu kleben.
 *
 * `r` ist der Radius des Lichtsaums, der beim Überfahren im Bild aufgeht —
 * ebenfalls in Bildkoordinaten der Platte.
 *
 * Die Texte hier sind Grundzustand: was der Ermittler sieht, wenn nichts
 * weiter passiert ist. Der Fall legt später eigene Beschreibungen darüber.
 */

export const ALLEY = [
  {
    id: 'stand',
    u: 0.281, v: 0.735, r: 0.085,
    label: 'Marktstand',
    text: 'Unter der Plane liegen Dinge, die niemand mehr abholt. Der Händler '
        + 'ist nicht da. Sein Hocker steht noch da, die Sitzfläche ist trocken.',
  },
  {
    id: 'sign-left',
    u: 0.392, v: 0.583, r: 0.070,
    label: 'Leuchtreklame',
    text: 'Ein Ring aus Neon, das Zeichen darin kennst du nicht. Zwei Röhren '
        + 'sind tot. Der Regen zischt darauf, wo das Glas noch warm ist.',
  },
  {
    id: 'lamp-left',
    u: 0.338, v: 0.610, r: 0.060,
    label: 'Straßenlaterne',
    text: 'Natriumdampf, das alte Zeug. Sie steht in einem Kegel aus Regen und '
        + 'macht alles darunter eine Spur gelber, als es sein müsste.',
  },
  {
    id: 'puddle',
    u: 0.490, v: 0.858, r: 0.100,
    label: 'Pfütze',
    text: 'Der Asphalt hat hier eine Senke. Das Wasser steht seit Tagen und '
        + 'gibt die Reklamen verkehrt herum zurück. Etwas Öliges treibt darauf.',
  },
  {
    id: 'crates-right',
    u: 0.636, v: 0.718, r: 0.080,
    label: 'Kistenstapel',
    text: 'Frachtkisten, dreimal umgepackt. Auf der obersten steht ein Zollcode, '
        + 'den man in diesem Sektor eigentlich nicht sieht.',
  },
  {
    id: 'vent',
    u: 0.696, v: 0.672, r: 0.070,
    label: 'Dampfauslass',
    text: 'Aus dem Gitter kommt Wärme, die nach heißem Metall riecht. '
        + 'Darunter läuft etwas, das nie abgeschaltet wird.',
  },
  {
    id: 'panel-right',
    u: 0.742, v: 0.358, r: 0.075,
    label: 'Leuchttafel',
    text: 'Eine Werbetafel, weiß und blendend. Was sie anpreist, ist unter '
        + 'einer Schicht Ruß nicht mehr zu lesen. Sie brennt trotzdem weiter.',
  },
  {
    id: 'exit-far',
    u: 0.500, v: 0.618, r: 0.075,
    kind: 'exit',
    label: 'Ende der Gasse',
    text: 'Dahinter kreuzt die Hauptstraße. Von dort kommt das Licht, das '
        + 'diese Gasse überhaupt erst sichtbar macht.',
  },

  /* --- Personen ---------------------------------------------------------- */
  {
    id: 'p-umbrella',
    u: 0.365, v: 0.726, r: 0.070,
    kind: 'person',
    label: 'Gestalt mit Schirm',
    text: 'Sie steht da, seit du hergekommen bist. Der Schirm ist zu gut für '
        + 'diese Gasse.',
  },
  {
    id: 'p-coat',
    u: 0.560, v: 0.708, r: 0.065,
    kind: 'person',
    label: 'Gestalt im Mantel',
    text: 'Der Mantel ist nass bis zu den Schultern. Wer so lange im Regen '
        + 'steht, wartet nicht auf gutes Wetter.',
  },
];

/** @type {Record<string, typeof ALLEY>} */
export const HOTSPOTS = { alley: ALLEY };
