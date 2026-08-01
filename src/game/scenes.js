/**
 * Orte und ihre Untersuchungspunkte.
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
 *   `requires`  eine Bedingung (siehe world.js). Ist sie nicht erfüllt, sagt
 *               `lockText`, was fehlt — ein Ausgang, der einfach nicht
 *               reagiert, liest sich als Fehler.
 *
 * Die Texte sind Grundzustand. Der generierte Fall legt später eigene
 * Beschreibungen darüber.
 */

export const SCENES = {
  /* ====================================================================== */
  alley: {
    id: 'alley',
    name: 'Kanalgasse',
    sector: 'Sektor 7 · Unterstadt',
    kind: 'street',
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

  /* ====================================================================== */
  alley2: {
    id: 'alley2',
    name: 'Kanalgasse · Hinterer Abschnitt',
    sector: 'Sektor 7 · Unterstadt',
    kind: 'street',
    backdrop: 'alley2-backdrop',
    spots: [
      {
        id: 'door', u: 0.135, v: 0.585, r: 0.095,
        kind: 'exit', dir: 'in', goto: 'backroom',
        requires: { item: 'keycard' },
        lockText: 'Verschlossen. Kein Schloss, nur ein Leser neben dem Rahmen — '
                + 'die Tür will eine Karte sehen, keinen Schlüssel.',
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
            + 'Abfall. Der Deckel hat frische Kratzer, von innen. Zwischen zwei '
            + 'Kanistern klemmt etwas Flaches, Helles.',
        item: {
          id: 'keycard',
          name: 'Schlüsselkarte',
          text: 'Eine Zutrittskarte ohne Aufdruck. Eine Ecke ist angeschmolzen, '
              + 'als hätte jemand versucht, sie unbrauchbar zu machen, und es '
              + 'dann eilig gehabt. Der Chip sitzt fest.',
        },
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
        kind: 'exit', dir: 'forward', goto: 'crossing',
        label: 'Zur Querstraße',
        text: 'Von dort kommt der Verkehr und das Licht.',
      },
      {
        id: 'go-back', u: 0.500, v: 0.930, r: 0.075,
        kind: 'exit', dir: 'back', goto: 'alley',
        label: 'Zurück',
        text: '',
      },
    ],
  },

  /* ====================================================================== */
  backroom: {
    id: 'backroom',
    name: 'Lagerraum',
    sector: 'Sektor 7 · hinter der Stahltür',
    kind: 'interior',
    backdrop: 'backroom-backdrop',
    spots: [
      {
        id: 'workbench', u: 0.300, v: 0.640, r: 0.100,
        label: 'Werkbank',
        text: 'Öl, Metallspäne, ein Schraubstock. Und dazwischen etwas, das hier '
            + 'nicht hingehört: ein sauber gefaltetes Tuch.',
        item: {
          id: 'cloth',
          name: 'Tuch mit dunklen Flecken',
          text: 'Baumwolle, einmal weiß. Die Flecken sind eingetrocknet und haben '
              + 'am Rand einen bräunlichen Hof. Wer das gefaltet hat, hatte Zeit — '
              + 'oder wollte, dass es ordentlich aussieht.',
          analysis: {
            wait: 4,
            label: 'Laborbefund · Tuch',
            clue: 'blut-fremd',
            text: 'Menschliches Blut, mindestens zwei Tage alt. Der Abgleich '
                + 'schlägt nicht beim vermissten Händler an, sondern bei einer '
                + 'zweiten Person — im Melderegister als verstorben geführt, seit '
                + 'vierzehn Monaten. Jemand, der tot sein soll, hat hier geblutet.',
          },
        },
      },
      {
        id: 'shelves', u: 0.590, v: 0.500, r: 0.110,
        label: 'Regalwand',
        text: 'Kanister, Kabeltrommeln, Ersatzteile in Kisten mit demselben '
            + 'Zollsiegel wie draußen in der Gasse. Eine Reihe ist frisch '
            + 'ausgeräumt — der Staub zeigt, was dort gestanden hat.',
      },
      {
        id: 'cot', u: 0.815, v: 0.700, r: 0.090,
        label: 'Feldbett',
        text: 'Jemand schläft hier. Die Decke ist zurückgeschlagen, darunter liegt '
            + 'ein Mantelknopf, der zu keinem Mantel im Raum gehört.',
      },
      {
        id: 'lamp-int', u: 0.470, v: 0.185, r: 0.075,
        label: 'Deckenlampe',
        text: 'Eine einzelne Leuchtröhre an zwei Drähten. Sie flackert im selben '
            + 'Takt wie das Ding, das unter der Gasse läuft.',
      },
      {
        id: 'back-out', u: 0.500, v: 0.930, r: 0.080,
        kind: 'exit', dir: 'out', goto: 'alley2',
        label: 'Hinaus in die Gasse',
        text: '',
      },
    ],
  },

  /* ====================================================================== */
  crossing: {
    id: 'crossing',
    name: 'Querstraße',
    sector: 'Sektor 7 · Unterstadt',
    kind: 'street',
    backdrop: 'crossing-backdrop',
    spots: [
      {
        id: 'traffic', u: 0.500, v: 0.560, r: 0.090,
        label: 'Verkehr',
        text: 'Wagen ziehen durch das Wasser, ohne langsamer zu werden. Niemand '
            + 'sieht hierher. In dieser Stadt ist das eine Dienstleistung.',
      },
      {
        id: 'kiosk', u: 0.230, v: 0.700, r: 0.085,
        label: 'Kiosk',
        text: 'Hinter der Scheibe stapeln sich Waren aus drei Sektoren. Der Mann '
            + 'darin sieht dich an, als hätte er dich erwartet, und sagt nichts.',
      },
      {
        id: 'board', u: 0.780, v: 0.330, r: 0.085,
        label: 'Anzeigetafel',
        text: 'Fahndungen und Vermisste, übereinandergeklebt. Das oberste Blatt '
            + 'ist zwei Tage alt und zeigt kein Gesicht, nur eine Nummer.',
      },
      {
        id: 'to-precinct', u: 0.075, v: 0.640, r: 0.085,
        kind: 'exit', dir: 'left', goto: 'precinct',
        label: 'Zum Präsidium',
        text: 'Die Wache liegt einen Block westlich. Blaues Licht, auch bei Tag.',
      },
      {
        id: 'to-bar', u: 0.925, v: 0.640, r: 0.085,
        kind: 'exit', dir: 'right', goto: 'bar',
        label: 'Zur Bar',
        text: 'Eine Tür unter einer Reklame, die seit Jahren dasselbe verspricht.',
      },
      {
        id: 'cross-back', u: 0.500, v: 0.930, r: 0.075,
        kind: 'exit', dir: 'back', goto: 'alley2',
        label: 'Zurück in die Gasse',
        text: '',
      },
    ],
  },

  /* ====================================================================== */
  precinct: {
    id: 'precinct',
    name: 'Präsidium · Wache',
    sector: 'Sektor 7 · Revier West',
    kind: 'interior',
    backdrop: 'precinct-backdrop',
    spots: [
      {
        id: 'lab-counter', u: 0.500, v: 0.600, r: 0.110, kind: 'lab',
        label: 'Laborschalter',
        text: 'Eine Klappe aus Panzerglas, dahinter eine Frau, die nicht aufsieht. '
            + 'Daneben ein Tablett für das, was untersucht werden soll. Über der '
            + 'Klappe hängt ein Schild: ERGEBNISSE NUR PERSÖNLICH.',
      },
      {
        id: 'files', u: 0.180, v: 0.560, r: 0.095,
        label: 'Aktenschrank',
        text: 'Papier, in einer Stadt, die alles speichert. Was hier liegt, soll '
            + 'nirgends auftauchen. Die oberste Schublade lässt sich nicht öffnen.',
      },
      {
        id: 'bench', u: 0.790, v: 0.700, r: 0.090,
        label: 'Wartebank',
        text: 'Zwei Leute warten. Beide nass, beide still. Einer hat seit einer '
            + 'Stunde dieselbe Nummer in der Hand.',
      },
      {
        id: 'notice', u: 0.680, v: 0.330, r: 0.080,
        label: 'Aushang',
        text: 'Dienstanweisungen und ein handgeschriebener Zettel: Sektor 7, '
            + 'Nachtstreife bis auf Weiteres ausgesetzt. Kein Grund angegeben.',
      },
      {
        id: 'precinct-out', u: 0.500, v: 0.930, r: 0.080,
        kind: 'exit', dir: 'out', goto: 'crossing',
        label: 'Hinaus',
        text: '',
      },
    ],
  },

  /* ====================================================================== */
  bar: {
    id: 'bar',
    name: 'Bar ohne Namen',
    sector: 'Sektor 7 · Querstraße',
    kind: 'interior',
    backdrop: 'bar-backdrop',
    spots: [
      {
        id: 'counter', u: 0.380, v: 0.620, r: 0.105,
        label: 'Tresen',
        text: 'Zinkblech, blank gewetzt an zwei Stellen — dort, wo immer dieselben '
            + 'Leute stehen. Hinter dem Tresen fehlt eine Flasche in einer Reihe, '
            + 'die sonst lückenlos ist.',
      },
      {
        id: 'booth', u: 0.740, v: 0.640, r: 0.100,
        label: 'Nische',
        text: 'Die hinterste Sitzbank hat den besten Blick auf die Tür und ist die '
            + 'einzige, die nass ist. Jemand ist hier aufgestanden, ohne zu '
            + 'trocknen, und in Eile gegangen.',
      },
      {
        id: 'jukebox', u: 0.155, v: 0.600, r: 0.085,
        label: 'Musikautomat',
        text: 'Er läuft, aber der Ton ist abgedreht. Die Scheibe dreht sich für '
            + 'niemanden. Auf dem Glas liegt Staub — außer an einer Stelle.',
      },
      {
        id: 'backdoor', u: 0.900, v: 0.520, r: 0.080,
        label: 'Hintertür',
        text: 'Sie steht einen Spalt offen und führt auf denselben Hinterhof wie '
            + 'die Stahltür. Der Riegel ist von innen aufgebogen.',
      },
      {
        id: 'bar-out', u: 0.500, v: 0.930, r: 0.080,
        kind: 'exit', dir: 'out', goto: 'crossing',
        label: 'Hinaus',
        text: '',
      },
    ],
  },
};

/** Reihenfolge fürs Vorabladen der Hintergründe. */
export const SCENE_IDS = Object.keys(SCENES);

/** Wo das Spiel beginnt. */
export const START = 'alley';
