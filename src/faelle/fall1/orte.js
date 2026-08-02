/**
 * FALL 1 — die Orte und ihre Untersuchungspunkte.
 *
 * Reine Falldaten. Was damit passiert, steht in src/game/ — hier steht nur,
 * WAS es gibt. Ein zweiter Fall ist eine zweite Datei dieser Form, kein
 * zweiter Satz Spielmechanik.
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

export const ORTE = {
  /* ====================================================================== */
  alley: {
    id: 'alley',
    district: 'sektor-7',
    name: 'Kanalgasse',
    sector: 'Sektor 7 · Unterstadt',
    kind: 'street',
    backdrop: 'alley-backdrop',
    spots: [
      {
        id: 'stand', u: 0.281, v: 0.735, r: 0.085,
        label: 'Marktstand',
        detail: 'details/alley-stand.jpg',
        text: 'Unter der Plane liegen Dinge, die niemand mehr abholt. Der Händler '
            + 'ist nicht da. Sein Hocker steht noch da, die Sitzfläche ist trocken.',
      },
      {
        id: 'sign-left', u: 0.392, v: 0.583, r: 0.070,
        label: 'Leuchtreklame',
        detail: 'details/alley-sign-left.jpg',
        text: 'Ein Ring aus Neon, das Zeichen darin kennst du nicht. Zwei Röhren '
            + 'sind tot. Der Regen zischt darauf, wo das Glas noch warm ist.',
      },
      {
        id: 'lamp-left', u: 0.338, v: 0.610, r: 0.060,
        label: 'Straßenlaterne',
        detail: 'details/alley-lamp-left.jpg',
        text: 'Natriumdampf, das alte Zeug. Sie steht in einem Kegel aus Regen und '
            + 'macht alles darunter eine Spur gelber, als es sein müsste.',
      },
      {
        id: 'puddle', u: 0.490, v: 0.858, r: 0.100,
        label: 'Pfütze',
        detail: 'details/alley-puddle.jpg',
        text: 'Der Asphalt hat hier eine Senke. Das Wasser steht seit Tagen und '
            + 'gibt die Reklamen verkehrt herum zurück. Etwas Öliges treibt darauf.',
      },
      {
        id: 'crates-right', u: 0.636, v: 0.718, r: 0.080,
        label: 'Kistenstapel',
        // In die Akte gelegt, oeffnet dieser Fund die Hafenspange auf der
        // Spinner-Karte. Siehe districts.js.
        clue: 'zollsiegel',
        detail: 'details/fracht.jpg',
        text: 'Frachtkisten, dreimal umgepackt. Das Holz ist aufgequollen, die '
            + 'Bänder rosten. Auf der obersten steht ein Zollsiegel, das in diesem '
            + 'Sektor eigentlich nichts zu suchen hat.',
      },
      {
        id: 'vent', u: 0.696, v: 0.672, r: 0.070,
        label: 'Dampfauslass',
        detail: 'details/alley-vent.jpg',
        text: 'Aus dem Gitter kommt Wärme, die nach heißem Metall riecht. '
            + 'Darunter läuft etwas, das nie abgeschaltet wird.',
      },
      {
        id: 'panel-right', u: 0.742, v: 0.358, r: 0.075,
        label: 'Leuchttafel',
        detail: 'details/alley-panel-right.jpg',
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
    district: 'sektor-7',
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
        detail: 'details/alley2-fire-escape.jpg',
        text: 'Die unterste Leiter ist hochgezogen und mit Draht gesichert. '
            + 'Der Draht ist neu.',
      },
      {
        id: 'dumpster', u: 0.655, v: 0.700, r: 0.085,
        label: 'Müllcontainer',
        detail: 'details/alley2-dumpster.jpg',
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
        detail: 'details/alley2-grate.jpg',
        text: 'Warmer Dunst steigt hier heraus, gleichmäßig, ohne Pause. Unter der '
            + 'Gasse läuft etwas, das Strom frisst.',
      },
      {
        id: 'steps', u: 0.750, v: 0.782, r: 0.070,
        label: 'Betonstufen',
        detail: 'details/alley2-steps.jpg',
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
    district: 'sektor-7',
    name: 'Lagerraum',
    sector: 'Sektor 7 · hinter der Stahltür',
    kind: 'interior',
    backdrop: 'backroom-backdrop',
    spots: [
      {
        id: 'workbench', u: 0.225, v: 0.545, r: 0.100,
        label: 'Werkbank',
        detail: 'details/backroom-workbench.jpg',
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
        id: 'shelves', u: 0.570, v: 0.470, r: 0.110,
        label: 'Regalwand',
        detail: 'details/backroom-shelves.jpg',
        text: 'Kanister, Kabeltrommeln, Ersatzteile in Kisten mit demselben '
            + 'Zollsiegel wie draußen in der Gasse. Eine Reihe ist frisch '
            + 'ausgeräumt — der Staub zeigt, was dort gestanden hat.',
      },
      {
        id: 'cot', u: 0.635, v: 0.630, r: 0.090,
        label: 'Feldbett',
        detail: 'details/backroom-cot.jpg',
        text: 'Jemand schläft hier. Die Decke ist zurückgeschlagen, darunter liegt '
            + 'ein Mantelknopf, der zu keinem Mantel im Raum gehört.',
      },
      {
        id: 'lamp-int', u: 0.500, v: 0.160, r: 0.075,
        label: 'Deckenlampe',
        detail: 'details/backroom-lamp-int.jpg',
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
    district: 'sektor-7',
    name: 'Querstraße',
    sector: 'Sektor 7 · Unterstadt',
    kind: 'street',
    backdrop: 'crossing-backdrop',
    spots: [
      {
        id: 'traffic', u: 0.480, v: 0.550, r: 0.090,
        label: 'Verkehr',
        detail: 'details/crossing-traffic.jpg',
        text: 'Wagen ziehen durch das Wasser, ohne langsamer zu werden. Niemand '
            + 'sieht hierher. In dieser Stadt ist das eine Dienstleistung.',
      },
      {
        id: 'kiosk', u: 0.270, v: 0.560, r: 0.085,
        label: 'Kiosk',
        detail: 'details/crossing-kiosk.jpg',
        text: 'Hinter der Scheibe stapeln sich Waren aus drei Sektoren. Der Mann '
            + 'darin sieht dich an, als hätte er dich erwartet, und sagt nichts.',
      },
      {
        id: 'board', u: 0.928, v: 0.410, r: 0.085,
        label: 'Anzeigetafel',
        detail: 'details/crossing-board.jpg',
        text: 'Fahndungen und Vermisste, übereinandergeklebt. Das oberste Blatt '
            + 'ist zwei Tage alt und zeigt kein Gesicht, nur eine Nummer.',
      },
      {
        id: 'to-precinct', u: 0.062, v: 0.500, r: 0.085,
        kind: 'exit', dir: 'left', goto: 'precinct',
        label: 'Zum Präsidium',
        text: 'Die Wache liegt einen Block westlich. Blaues Licht, auch bei Tag.',
      },
      {
        id: 'to-bar', u: 0.810, v: 0.500, r: 0.085,
        kind: 'exit', dir: 'right', goto: 'bar',
        label: 'Zur Bar',
        text: 'Eine Tür unter einer Reklame, die seit Jahren dasselbe verspricht.',
      },
      {
        id: 'nach-hause', u: 0.352, v: 0.470, r: 0.075,
        kind: 'exit', dir: 'in', goto: 'wohnung',
        label: 'Hauseingang',
        text: 'Vier Stockwerke über dem Kiosk, zweite Tür von links. Deine. Der '
            + 'Aufgang riecht nach nassem Stein, und die Zeitschaltung im Licht '
            + 'reicht seit Jahren nur bis zum dritten Stock.',
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
    district: 'sektor-7',
    name: 'Präsidium · Wache',
    sector: 'Sektor 7 · Revier West',
    kind: 'interior',
    backdrop: 'precinct-backdrop',
    spots: [
      {
        id: 'lab-counter', u: 0.490, v: 0.400, r: 0.110, kind: 'lab',
        label: 'Laborschalter',
        detail: 'details/precinct-lab-counter.jpg',
        text: 'Eine Klappe aus Panzerglas, dahinter eine Frau, die nicht aufsieht. '
            + 'Daneben ein Tablett für das, was untersucht werden soll. Über der '
            + 'Klappe hängt ein Schild: ERGEBNISSE NUR PERSÖNLICH.',
      },
      {
        id: 'files', u: 0.160, v: 0.580, r: 0.095,
        label: 'Aktenschrank',
        detail: 'details/precinct-files.jpg',
        text: 'Papier, in einer Stadt, die alles speichert. Was hier liegt, soll '
            + 'nirgends auftauchen. Die oberste Schublade lässt sich nicht öffnen.',
      },
      {
        id: 'bench', u: 0.775, v: 0.630, r: 0.090,
        label: 'Wartebank',
        detail: 'details/precinct-bench.jpg',
        text: 'Zwei Leute warten. Beide nass, beide still. Einer hat seit einer '
            + 'Stunde dieselbe Nummer in der Hand.',
      },
      {
        id: 'notice', u: 0.900, v: 0.240, r: 0.080,
        label: 'Aushang',
        detail: 'details/precinct-notice.jpg',
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
    district: 'sektor-7',
    name: 'Bar ohne Namen',
    sector: 'Sektor 7 · Querstraße',
    kind: 'interior',
    backdrop: 'bar-backdrop',
    spots: [
      {
        id: 'p-wirtin', u: 0.395, v: 0.470, r: 0.075, kind: 'person',
        label: 'Wirtin',
        detail: 'details/wirtin.jpg',
        text: 'Sie steht am hellsten gewetzten Stück des Tresens und hat beide '
            + 'Unterarme darauf gelegt. Sie füllt nichts nach. Sie wartet.',
      },
      {
        id: 'counter', u: 0.525, v: 0.730, r: 0.105,
        label: 'Tresen',
        detail: 'details/bar-counter.jpg',
        text: 'Zinkblech, blank gewetzt an zwei Stellen — dort, wo immer dieselben '
            + 'Leute stehen. Hinter dem Tresen fehlt eine Flasche in einer Reihe, '
            + 'die sonst lückenlos ist.',
      },
      {
        id: 'booth', u: 0.750, v: 0.620, r: 0.100,
        label: 'Nische',
        detail: 'details/bar-booth.jpg',
        text: 'Die hinterste Sitzbank hat den besten Blick auf die Tür und ist die '
            + 'einzige, die nass ist. Jemand ist hier aufgestanden, ohne zu '
            + 'trocknen, und in Eile gegangen.',
      },
      {
        id: 'jukebox', u: 0.115, v: 0.620, r: 0.085,
        label: 'Musikautomat',
        detail: 'details/bar-jukebox.jpg',
        text: 'Er läuft, aber der Ton ist abgedreht. Die Scheibe dreht sich für '
            + 'niemanden. Auf dem Glas liegt Staub — außer an einer Stelle.',
      },
      {
        id: 'backdoor', u: 0.632, v: 0.458, r: 0.080,
        label: 'Hintertür',
        detail: 'details/bar-backdoor.jpg',
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

  /* ====================================================================== */
  terminal: {
    id: 'terminal',
    district: 'sektor-3',
    name: 'Frachtterminal',
    sector: 'Sektor 3 · Hafenspange',
    kind: 'street',
    backdrop: 'terminal-backdrop',
    spots: [
      {
        id: 'crane', u: 0.490, v: 0.430, r: 0.080,
        label: 'Portalkran',
        detail: 'details/terminal-crane.jpg',
        text: 'Er steht still, aber die Katze hängt auf halber Höhe — mitten in '
            + 'einer Bewegung abgestellt. Wer hier arbeitet, hat aufgehört, ohne '
            + 'fertig zu werden.',
      },
      {
        id: 'booth', u: 0.905, v: 0.460, r: 0.080,
        label: 'Zollkabine',
        detail: 'details/terminal-booth.jpg',
        text: 'Leer, das Licht brennt. Auf dem Pult liegt ein aufgeschlagenes '
            + 'Buch und daneben ein Becher, aus dem noch Dampf käme, wenn es '
            + 'wärmer wäre. Die Schranke ist unten.',
      },
      {
        id: 'barrier', u: 0.810, v: 0.596, r: 0.070,
        label: 'Schranke',
        detail: 'details/terminal-barrier.jpg',
        text: 'Unten und verriegelt. Der Lack ist an einer Stelle bis aufs Metall '
            + 'abgeschürft, in Höhe einer Stoßstange. Frisch.',
      },
      {
        id: 'pallets', u: 0.090, v: 0.790, r: 0.090,
        label: 'Paletten unter Plane',
        detail: 'details/terminal-pallets.jpg',
        text: 'Die Folie ist aufgerissen und liegt lose. Darunter Kisten mit '
            + 'demselben Zollsiegel wie in der Kanalgasse — und eine Lücke, wo '
            + 'zwei weitere gestanden haben.',
      },
      {
        id: 'quay-puddle', u: 0.560, v: 0.840, r: 0.090,
        label: 'Wasserlache',
        detail: 'details/terminal-quay-puddle.jpg',
        text: 'Regen und etwas anderes. Am Rand hat sich ein dunkler Film '
            + 'abgesetzt, den das Wasser nicht mitnimmt.',
      },
      {
        id: 'to-customs', u: 0.155, v: 0.500, r: 0.085,
        kind: 'exit', dir: 'in', goto: 'customs',
        label: 'Zollhalle',
        text: 'Das Tor der Abfertigungshalle steht offen. Drinnen brennt Licht.',
      },
    ],
  },

  /* ====================================================================== */
  customs: {
    id: 'customs',
    district: 'sektor-3',
    name: 'Zollhalle',
    sector: 'Sektor 3 · Hafenspange',
    kind: 'interior',
    backdrop: 'customs-backdrop',
    spots: [
      {
        id: 'clipboards', u: 0.073, v: 0.376, r: 0.085,
        label: 'Klemmbretter',
        detail: 'details/customs-clipboards.jpg',
        text: 'Eine Reihe Frachtbriefe an Haken, nach Tagen sortiert. Bei '
            + 'vorgestern hängt einer schief, als hätte ihn jemand zurückgehängt '
            + 'und dabei nicht hingesehen.',
        clue: 'frachtbrief',
        item: {
          id: 'manifest',
          name: 'Frachtbrief',
          text: 'Eingegangen vorgestern, 23:40. Vier Kisten, Zollsiegel Sektor 3. '
              + 'Die Spalte für den Ausgang ist leer — die Ware ist angekommen '
              + 'und nie wieder herausgegangen. Unterschrieben hat jemand, dessen '
              + 'Kürzel zweimal durchgestrichen und einmal neu geschrieben wurde.',
        },
      },
      {
        id: 'table-left', u: 0.200, v: 0.575, r: 0.100,
        label: 'Prüftisch',
        detail: 'details/customs-table-left.jpg',
        text: 'Zwei Kisten aufgebrochen, das Stroh liegt daneben auf dem Boden. '
            + 'Der Deckel der vorderen wurde von INNEN aufgedrückt — die Nägel '
            + 'stehen nach außen.',
      },
      {
        id: 'arch', u: 0.835, v: 0.520, r: 0.090,
        label: 'Scanbogen',
        detail: 'details/customs-arch.jpg',
        text: 'Abgeschaltet und aus der Spur gerollt. Das Kabel liegt quer über '
            + 'die Fahrbahn — hier ist etwas durchgefahren, das nicht durch den '
            + 'Bogen sollte.',
      },
      {
        id: 'shutter', u: 0.500, v: 0.450, r: 0.080,
        label: 'Rolltor',
        detail: 'details/customs-shutter.jpg',
        text: 'Geschlossen bis auf einen Spalt am Boden, durch den orangefarbenes '
            + 'Licht fällt. Dahinter der Kai. Von unten kommt Zugluft und der '
            + 'Geruch von Wasser.',
      },
      {
        id: 'straw', u: 0.350, v: 0.810, r: 0.090,
        label: 'Stroh und Bänder',
        detail: 'details/customs-straw.jpg',
        text: 'Verpackungsmaterial über den ganzen Boden verteilt, nicht gefegt. '
            + 'Zwischen den Halmen liegt ein abgerissenes Stück Klebeband mit '
            + 'einem Abdruck darin, der zu keinem Handschuh gehört.',
      },
      {
        id: 'zum-kuehlhaus', u: 0.925, v: 0.545, r: 0.075,
        kind: 'exit', dir: 'right', goto: 'kuehlhaus',
        requires: { clue: 'ohne-leiche' },
        lockText: 'Ein Kühlhaus. Bis eben war das eine Halle wie jede andere im '
                + 'Hafen — es gab ja eine Leiche, und die lag im Meldeamt.',
        label: 'Tür zum Kühlhaus',
        text: 'Eine schmale Tür in der Wellblechwand, rechts hinter dem '
            + 'Scanbogen. Der Rahmen ist von innen vereist, und unter der '
            + 'Schwelle steht eine Pfütze, die nicht vom Regen kommt.',
      },
      {
        id: 'customs-out', u: 0.500, v: 0.930, r: 0.080,
        kind: 'exit', dir: 'out', goto: 'terminal',
        label: 'Hinaus auf den Kai',
        text: '',
      },
    ],
  },

  /* ====================================================================== */
  pumpwerk: {
    id: 'pumpwerk',
    district: 'sektor-9',
    name: 'Pumpwerk',
    sector: 'Sektor 9 · Kanalebene',
    kind: 'interior',
    backdrop: 'pumpwerk-backdrop',
    spots: [
      {
        id: 'pumpe', u: 0.245, v: 0.540, r: 0.105,
        label: 'Pumpengehäuse',
        detail: 'details/pumpwerk-pumpe.jpg',
        text: 'Gusseisen, vernietet, so alt wie die Stadt darüber. Es läuft. Der '
            + 'Boden zittert im Takt, und niemand ist hier, der es abstellen '
            + 'könnte, wenn es aufhören müsste.',
      },
      {
        id: 'pult', u: 0.895, v: 0.710, r: 0.090,
        label: 'Schaltpult',
        detail: 'details/pumpwerk-pult.jpg',
        text: 'Die meisten Zeiger stehen auf Null, weil sie tot sind. Einer nicht. '
            + 'Daneben liegt ein Schichtbuch, aufgeschlagen — der letzte Eintrag '
            + 'ist vierzehn Monate alt und mitten im Satz abgebrochen.',
        clue: 'schichtbuch',
      },
      {
        id: 'schleuse', u: 0.498, v: 0.510, r: 0.085,
        label: 'Schleusentor',
        detail: 'details/pumpwerk-schleuse.jpg',
        text: 'Geschlossen und verriegelt. Auf der Innenseite Kratzspuren in '
            + 'Griffhöhe, dicht an dicht. Jemand wollte hier durch und hatte '
            + 'keinen Schlüssel.',
      },
      {
        id: 'laufsteg', u: 0.485, v: 0.810, r: 0.090,
        label: 'Laufsteg',
        detail: 'details/pumpwerk-laufsteg.jpg',
        text: 'Riffelblech über schwarzem Wasser. In der Mitte ein Streifen, der '
            + 'blanker ist als der Rest — hier geht jemand regelmäßig, und zwar '
            + 'immer dieselbe Linie.',
      },
      {
        id: 'treppe', u: 0.088, v: 0.555, r: 0.090,
        kind: 'exit', dir: 'left', goto: 'tunnel',
        label: 'Wendeltreppe',
        text: 'Sie führt weiter hinunter, in die Tunnelebene. Der Handlauf ist an '
            + 'der Außenseite blank gegriffen.',
      },
    ],
  },

  /* ====================================================================== */
  tunnel: {
    id: 'tunnel',
    district: 'sektor-9',
    name: 'Tunnelkreuz',
    sector: 'Sektor 9 · Kanalebene',
    kind: 'interior',
    backdrop: 'tunnel-backdrop',
    spots: [
      {
        id: 'gitter', u: 0.195, v: 0.430, r: 0.090,
        label: 'Altes Gitter',
        detail: 'details/tunnel-gitter.jpg',
        text: 'Halb hochgezogen und mit einem Stück Kabel festgebunden, damit es '
            + 'nicht zufällt. Dahinter Ziegel und Dunkelheit. Der Knoten ist '
            + 'frisch und sauber gelegt — von jemandem, der wiederkommen will.',
      },
      {
        id: 'rinne', u: 0.495, v: 0.780, r: 0.095,
        label: 'Wasserrinne',
        detail: 'details/tunnel-rinne.jpg',
        text: 'Das Wasser läuft langsam und riecht nicht nach Kanal, sondern nach '
            + 'Desinfektionsmittel. Es kommt aus dem rechten Gang.',
        clue: 'desinfektion',
      },
      {
        id: 'kabel', u: 0.870, v: 0.450, r: 0.080,
        label: 'Kabelstrang',
        detail: 'details/tunnel-kabel.jpg',
        text: 'Neu verlegt, viel zu stark für Beleuchtung. Er verschwindet im '
            + 'rechten Gang. Wer hier unten so viel Strom braucht, betreibt '
            + 'etwas, das nicht ausfallen darf.',
      },
      {
        id: 'roehre', u: 0.498, v: 0.515, r: 0.080,
        label: 'Hauptröhre',
        detail: 'details/tunnel-roehre.jpg',
        text: 'Sie läuft geradeaus weiter, bis das Licht aufhört. Von dort kommt '
            + 'Zugluft und sonst nichts.',
      },
      {
        id: 'zur-klinik', u: 0.710, v: 0.440, r: 0.090,
        kind: 'exit', dir: 'right', goto: 'klinik',
        label: 'Rechter Gang',
        text: 'Neuerer Beton, und um die Ecke brennt Licht. Warmes Licht, nicht '
            + 'das kalte der Wartung.',
      },
      {
        id: 'tunnel-zurueck', u: 0.500, v: 0.930, r: 0.080,
        kind: 'exit', dir: 'back', goto: 'pumpwerk',
        label: 'Zurück zum Pumpwerk',
        text: '',
      },
    ],
  },

  /* ====================================================================== */
  klinik: {
    id: 'klinik',
    district: 'sektor-9',
    name: 'Hinterzimmerklinik',
    sector: 'Sektor 9 · Kanalebene',
    kind: 'interior',
    backdrop: 'klinik-backdrop',
    spots: [
      {
        id: 'op-tisch', u: 0.493, v: 0.630, r: 0.100,
        label: 'Operationstisch',
        detail: 'details/klinik-op-tisch.jpg',
        text: 'Das einzig Saubere im Raum. Frisch abgewischt, noch feucht an den '
            + 'Kanten. Wer hier zuletzt lag, ist nicht lange her weg — und '
            + 'jemand hat sich Mühe gegeben, das zu verbergen.',
      },
      {
        id: 'instrumente', u: 0.165, v: 0.660, r: 0.100,
        label: 'Instrumententisch',
        detail: 'details/klinik-instrumente.jpg',
        text: 'Auf einem Tuch ausgelegt, in Reihe, wie es sich gehört. Ein Platz '
            + 'in der Reihe ist leer. Daneben liegt eine Patientenkarte, die '
            + 'niemand hätte liegen lassen dürfen.',
        item: {
          id: 'patientenkarte',
          name: 'Patientenkarte',
          text: 'Kein Name, nur eine Registriernummer — dieselbe, die auf dem '
              + 'Vermisstenblatt an der Querstraße stand. Behandelt vorgestern '
              + 'nachts. Unter „Kostenträger" steht ein Konzernkürzel, unter '
              + '„Entlassung" steht nichts.',
          analysis: {
            wait: 3,
            label: 'Registerabgleich · Patientenkarte',
            clue: 'register-luecke',
            text: 'Die Nummer gehört zu einer Person, die vor vierzehn Monaten für '
                + 'tot erklärt wurde — vom selben Sachbearbeiter, der in diesem '
                + 'Sektor seither elf weitere Todesfälle beglaubigt hat. Keiner '
                + 'davon wurde je obduziert.',
          },
        },
      },
      {
        id: 'kartons', u: 0.330, v: 0.655, r: 0.085,
        label: 'Kartons',
        detail: 'details/klinik-kartons.jpg',
        text: 'Unbeschriftet, bis auf ein Zollsiegel auf der untersten Lage — '
            + 'dasselbe wie auf den Kisten in der Kanalgasse. Der Weg der Fracht '
            + 'endet also hier unten.',
      },
      {
        id: 'geraete', u: 0.680, v: 0.570, r: 0.090,
        label: 'Gerätewagen',
        detail: 'details/klinik-geraete.jpg',
        text: 'Zusammengestückelt und trotzdem eingeschaltet. Auf dem einen Schirm '
            + 'steht noch die letzte Aufzeichnung: vorgestern, 23:58. Achtzehn '
            + 'Minuten nachdem die Fracht am Terminal eingetroffen ist.',
      },
      {
        id: 'stuhl', u: 0.820, v: 0.726, r: 0.085,
        label: 'Stuhl mit Gurten',
        detail: 'details/klinik-stuhl.jpg',
        text: 'Die Gurte hängen offen, nicht aufgeschnitten. Wer hier saß, wurde '
            + 'losgemacht. Der Lederriemen am rechten Arm ist auf einer Seite '
            + 'ausgeleiert, an der anderen nicht.',
      },
      {
        id: 'abfluss', u: 0.460, v: 0.870, r: 0.060,
        label: 'Bodenabfluss',
        detail: 'details/klinik-abfluss.jpg',
        text: 'Unter dem Tisch, wo man ihn braucht. Das Gitter ist abgehoben und '
            + 'schief zurückgelegt worden. Was hier hineingespült wurde, ist '
            + 'längst im Kanal.',
      },
      {
        id: 'klinik-raus', u: 0.580, v: 0.950, r: 0.075,
        kind: 'exit', dir: 'out', goto: 'tunnel',
        label: 'Zurück in den Tunnel',
        text: '',
      },
    ],
  },

  /* ====================================================================== */
  empfang: {
    id: 'empfang',
    district: 'sektor-1',
    name: 'Empfangshalle',
    sector: 'Sektor 1 · Konzernterrassen',
    kind: 'interior',
    backdrop: 'empfang-backdrop',
    spots: [
      {
        id: 'p-empfang', u: 0.498, v: 0.487, r: 0.060, kind: 'person',
        label: 'Empfangsleitung',
        detail: 'details/empfang.jpg',
        text: 'Sie steht hinter dem Tresen, beide Hände flach auf dem Stein, und '
            + 'sieht dir entgegen, seit die Tür hinter dir zugegangen ist. Sie '
            + 'hat sich nicht bewegt.',
      },
      {
        id: 'tresen', u: 0.680, v: 0.600, r: 0.085,
        label: 'Empfangstresen',
        detail: 'details/empfang-tresen.jpg',
        text: 'Hinterleuchteter Stein, makellos, und darauf liegt nichts — kein '
            + 'Besucherbuch, kein Terminal, nichts. Wer hier hereinkommt, wird '
            + 'nicht eingetragen. Der Stein hat an einer Stelle einen matten '
            + 'Abdruck, als hätte dort lange etwas gestanden.',
      },
      {
        id: 'sitzinsel', u: 0.860, v: 0.700, r: 0.090,
        label: 'Sitzinsel',
        detail: 'details/empfang-sitzinsel.jpg',
        text: 'Schwarzes Leder, eine Pflanze, die zu gesund ist für ein Haus ohne '
            + 'Tageslicht. Auf einem der Sitze ein feuchter Abdruck in der Form '
            + 'eines Mantelsaums. Jemand hat hier vor Kurzem im Nassen gewartet.',
      },
      {
        id: 'aufzug', u: 0.125, v: 0.440, r: 0.095,
        kind: 'exit', dir: 'up', goto: 'dach',
        label: 'Aufzüge',
        text: 'Vier Türen, eine mit brennender Ruftafel. Auf der Anzeige steht '
            + 'nur eine erreichbare Ebene: ganz oben.',
      },
      {
        id: 'gang', u: 0.725, v: 0.484, r: 0.080,
        kind: 'exit', dir: 'right', goto: 'archiv',
        requires: { clue: 'register-luecke' },
        lockText: 'Der Gang führt in die Verwaltung. Ohne einen Grund, den man '
                + 'hier vorbringen kann, ist das ein Gang wie jeder andere — und '
                + 'du hast noch keinen.',
        label: 'Seitengang',
        text: 'Schmaler, niedriger, schlechter beleuchtet als die Halle. Hier '
            + 'gehen die hin, die hier arbeiten.',
      },
      {
        id: 'direktionsaufzug', u: 0.240, v: 0.470, r: 0.080,
        kind: 'exit', dir: 'up', goto: 'direktion',
        requires: { clue: 'haendler-lebt' },
        lockText: 'Ohne einen Namen ist das eine Aufzugtür. Mit einem Namen wäre '
                + 'es eine Adresse — und du hast noch keinen, den du hier oben '
                + 'nennen könntest.',
        label: 'Aufzug ohne Etagenanzeige',
        text: 'Der letzte in der Reihe, schmaler als die anderen, ohne Anzeige '
            + 'über der Tür. Er hat einen Ruftaster und sonst nichts. Wer ihn '
            + 'benutzt, weiß bereits, wohin er fährt.',
      },
    ],
  },

  /* ====================================================================== */
  dach: {
    id: 'dach',
    district: 'sektor-1',
    name: 'Dachterrasse',
    sector: 'Sektor 1 · Konzernterrassen',
    kind: 'street',
    backdrop: 'dach-backdrop',
    spots: [
      {
        id: 'bruestung', u: 0.483, v: 0.573, r: 0.100,
        label: 'Brüstung',
        detail: 'details/dach-bruestung.jpg',
        text: 'Von hier sieht man den Regen von oben, als Decke aus Licht über '
            + 'der Unterstadt. Irgendwo da unten liegt die Kanalgasse. Von hier '
            + 'wirkt sie wie eine Naht im Asphalt.',
      },
      {
        id: 'unterstand', u: 0.825, v: 0.376, r: 0.085,
        label: 'Unterstand',
        detail: 'details/dach-unterstand.jpg',
        text: 'Ein Heizstrahler brennt für niemanden. Unter dem Dach ist der '
            + 'Boden trocken bis auf zwei Stellen — dort hat jemand gestanden, '
            + 'lange genug, dass es von seinem Mantel getropft hat.',
      },
      {
        id: 'tisch', u: 0.800, v: 0.627, r: 0.080,
        label: 'Tisch',
        detail: 'details/dach-tisch.jpg',
        text: 'Nasses Metall. Am Rand ein ausgedrückter Zigarettenstummel, '
            + 'gebogen, nicht ausgetreten — jemand hat ihn eilig abgelegt und '
            + 'ist gegangen. Er ist noch nicht durchgeweicht.',
        clue: 'eiliger-abgang',
      },
      {
        id: 'kuebel', u: 0.060, v: 0.583, r: 0.075,
        label: 'Pflanzkübel',
        detail: 'details/dach-kuebel.jpg',
        text: 'Hartes schwarzes Blattwerk, das den Regen aushält. In der Erde '
            + 'steckt etwas Kantiges, halb eingedrückt, als hätte man es im '
            + 'Vorbeigehen hineingeschoben.',
        item: {
          id: 'chipkarte',
          name: 'Ausweiskarte',
          text: 'Eine Konzernkarte mit abgebrochener Ecke. Das Lichtbild ist '
              + 'herausgelöst, die Nummer darunter nicht. Es ist dieselbe, die '
              + 'auf der Patientenkarte unten in der Klinik stand.',
        },
      },
      {
        id: 'dach-runter', u: 0.170, v: 0.490, r: 0.090,
        kind: 'exit', dir: 'down', goto: 'empfang',
        label: 'Zurück nach unten',
        text: 'Die Aufzugtür steht offen und wartet. Sie ist die einzige Art, '
            + 'hier wieder wegzukommen.',
      },
    ],
  },

  /* ====================================================================== */
  archiv: {
    id: 'archiv',
    district: 'sektor-1',
    name: 'Archiv',
    sector: 'Sektor 1 · Konzernterrassen',
    kind: 'interior',
    backdrop: 'archiv-backdrop',
    spots: [
      {
        id: 'gasse-offen', u: 0.360, v: 0.448, r: 0.095,
        label: 'Offene Regalgasse',
        detail: 'details/archiv-gasse-offen.jpg',
        text: 'Eine einzige Gasse ist aufgekurbelt, alle anderen stehen dicht. '
            + 'Drinnen ist es dunkel, und in der zweiten Reihe fehlen vier '
            + 'Ordner nebeneinander. Der Staub zeigt, wie lange sie dort standen.',
      },
      {
        id: 'terminal', u: 0.498, v: 0.506, r: 0.080,
        label: 'Leseterminal',
        detail: 'details/archiv-terminal.jpg',
        text: 'Es läuft und ist nicht abgemeldet. Die letzte Abfrage steht noch '
            + 'auf dem Schirm: eine Personalnummer, ohne Namen dazu. Wer sie '
            + 'eingegeben hat, ist mitten im Vorgang aufgestanden.',
      },
      {
        id: 'wagen', u: 0.675, v: 0.735, r: 0.095,
        label: 'Rollwagen',
        detail: 'details/archiv-wagen.jpg',
        text: 'Vier Archivkisten, schief gestapelt, in einem Raum, in dem sonst '
            + 'nichts schief steht. Die oberste ist nicht verschlossen. Darin '
            + 'liegt eine Akte, die dorthin gehört, wo die Gasse eine Lücke hat.',
        item: {
          id: 'personalakte',
          name: 'Personalakte',
          text: 'Kein Name auf dem Deckel, nur die Nummer von der Ausweiskarte. '
              + 'Innen ein Vermerk vor vierzehn Monaten: Übertritt in ein '
              + 'internes Programm, Zeile für Zeile geschwärzt. Der letzte '
              + 'Eintrag ist zwei Tage alt und trägt dieselbe Unterschrift wie '
              + 'die elf Totenscheine — die eines Sachbearbeiters im Meldeamt.',
          analysis: {
            wait: 3,
            label: 'Abgleich · Personalakte',
            clue: 'konzern-programm',
            text: 'Die geschwärzten Zeilen sind unter Durchlicht lesbar. Das '
                + 'Programm führt Personen, die amtlich für tot erklärt wurden, '
                + 'als weiterbeschäftigt — bezahlt über denselben Kostenträger, '
                + 'der auch die Klinik unter der Stadt trägt. Elf Namen. Der '
                + 'vermisste Händler ist der zwölfte, und sein Eintrag wurde '
                + 'vorgestern nachts angelegt.',
          },
        },
      },
      {
        id: 'handrad', u: 0.092, v: 0.457, r: 0.075,
        label: 'Handrad',
        detail: 'details/archiv-handrad.jpg',
        text: 'Die Kurbel der vordersten Gasse. Der Griff ist kalt, aber blank — '
            + 'anders als die daneben, auf denen Staub liegt. Diese Gasse wird '
            + 'benutzt, die anderen nicht.',
      },
      {
        id: 'archiv-raus', u: 0.870, v: 0.900, r: 0.080,
        kind: 'exit', dir: 'out', goto: 'empfang',
        label: 'Zurück in die Halle',
        text: '',
      },
    ],
  },

  /* ====================================================================== */
  registratur: {
    id: 'registratur',
    district: 'sektor-4',
    name: 'Registratur',
    sector: 'Sektor 4 · Meldeamt',
    kind: 'interior',
    backdrop: 'registratur-backdrop',
    spots: [
      {
        id: 'p-sachbearbeiter', u: 0.505, v: 0.440, r: 0.060, kind: 'person',
        label: 'Sachbearbeiter',
        detail: 'details/sachbearbeiter.jpg',
        text: 'Hinter dem Glas sitzt ein Mann, der aufsieht, als du hereinkommst, '
            + 'und den Stift nicht weglegt. Neben seiner rechten Hand steht ein '
            + 'Stempel, griffbereit, als würde gleich noch etwas unterschrieben.',
      },
      {
        id: 'schalter', u: 0.430, v: 0.520, r: 0.080,
        label: 'Schalter',
        detail: 'details/registratur-schalter.jpg',
        text: 'Ein Spalt unter der Scheibe, breit genug für Papier und für nichts '
            + 'sonst. Auf dem Holz davor sind zwei blanke Stellen — dort legen '
            + 'Leute ihre Unterarme ab, während sie warten. Nur zwei.',
      },
      {
        id: 'aushang-r', u: 0.608, v: 0.403, r: 0.070,
        label: 'Aushang',
        detail: 'details/registratur-aushang-r.jpg',
        text: 'Hinter dem Glas hängt ein Formularmuster, ausgeblichen bis auf die '
            + 'Stelle, wo die Unterschrift hingehört. Die ist frisch nachgezogen '
            + 'worden, mit einem anderen Stift.',
      },
      {
        id: 'schublade-r', u: 0.235, v: 0.497, r: 0.075,
        label: 'Offene Schublade',
        detail: 'details/registratur-schublade-r.jpg',
        text: 'Eine einzige Lade steht offen, in einer Wand aus hunderten. Die '
            + 'Karten darin sind nach hinten geschoben, als hätte jemand etwas '
            + 'herausgenommen und die Lücke nicht schließen wollen.',
      },
      {
        id: 'zur-kartei', u: 0.055, v: 0.545, r: 0.085,
        kind: 'exit', dir: 'left', goto: 'kartei',
        label: 'Zur Kartei',
        text: 'Die Schrankwand hört nicht an der Ecke auf. Dahinter geht ein '
            + 'schmaler Gang weiter, in dem noch mehr davon steht.',
      },
      {
        id: 'zur-halle', u: 0.895, v: 0.538, r: 0.085,
        kind: 'exit', dir: 'right', goto: 'leichenhalle',
        label: 'Doppeltür',
        text: 'Schwer, mit zwei kleinen Fenstern. Dahinter ist es kälter, und das '
            + 'Licht hat eine andere Farbe.',
      },
    ],
  },

  /* ====================================================================== */
  leichenhalle: {
    id: 'leichenhalle',
    district: 'sektor-4',
    name: 'Leichenhalle',
    sector: 'Sektor 4 · Meldeamt',
    kind: 'interior',
    backdrop: 'leichenhalle-backdrop',
    spots: [
      {
        id: 'fach-offen', u: 0.305, v: 0.448, r: 0.095,
        label: 'Offenes Fach',
        detail: 'details/leichenhalle-fach-offen.jpg',
        clue: 'leeres-fach',
        text: 'Halb herausgezogen und leer. Blankes Blech, frisch gewischt, kein '
            + 'Staub in den Ecken. Im Kartenhalter am Griff steckt noch die '
            + 'Marke von dem, was hier gelegen haben soll.',
        item: {
          id: 'zehenmarke',
          name: 'Fachmarke',
          text: 'Ein steifer Kartonstreifen mit einer Nummer — derselben wie auf '
              + 'der Patientenkarte und der Ausweiskarte. Auf der Rückseite zwei '
              + 'Kürzel: eines für die Einlieferung, eines für die Freigabe. Sie '
              + 'sind von derselben Hand geschrieben.',
          analysis: {
            wait: 3,
            label: 'Prüfung · Fachmarke',
            clue: 'ohne-leiche',
            text: 'Einlieferung und Freigabe tragen dieselbe Handschrift — die '
                + 'des Sachbearbeiters, der auch die elf Totenscheine '
                + 'unterzeichnet hat. Zwischen beiden Einträgen liegen elf '
                + 'Minuten. In elf Minuten wird niemand eingeliefert, untersucht '
                + 'und freigegeben. Es hat nie eine Leiche gegeben.',
          },
        },
      },
      {
        id: 'wagen-lh', u: 0.505, v: 0.573, r: 0.085,
        label: 'Rollwagen',
        detail: 'details/leichenhalle-wagen-lh.jpg',
        text: 'Leer und blank, mitten im Gang abgestellt statt an der Wand. Die '
            + 'Rollen stehen quer. Wer ihn zuletzt geschoben hat, hat ihn '
            + 'losgelassen und ist gegangen.',
      },
      {
        id: 'waage', u: 0.640, v: 0.269, r: 0.075,
        label: 'Waage',
        detail: 'details/leichenhalle-waage.jpg',
        text: 'Sie hängt von der Decke und zeigt nicht auf Null. Jemand hat etwas '
            + 'daraufgelegt und wieder heruntergenommen, ohne sie zurückzustellen.',
      },
      {
        id: 'rinne-lh', u: 0.493, v: 0.807, r: 0.090,
        label: 'Abflussrinne',
        detail: 'details/leichenhalle-rinne-lh.jpg',
        text: 'Sauber bis auf einen Abdruck am Rand, halb weggewischt. Es ist '
            + 'kein Fußabdruck. Es ist die Kante von etwas Rechteckigem, das man '
            + 'hier abgestellt und wieder mitgenommen hat.',
      },
      {
        id: 'faecher', u: 0.850, v: 0.448, r: 0.090,
        label: 'Fächerwand',
        detail: 'details/leichenhalle-faecher.jpg',
        text: 'Drei Reihen Edelstahl, alle geschlossen, alle mit leerem '
            + 'Kartenhalter. In einem Haus, das jeden Toten aktenkundig macht, '
            + 'steht an keinem einzigen Fach ein Name.',
      },
      {
        id: 'lh-raus', u: 0.500, v: 0.930, r: 0.080,
        kind: 'exit', dir: 'out', goto: 'registratur',
        label: 'Zurück zur Registratur',
        text: '',
      },
    ],
  },

  /* ====================================================================== */
  kartei: {
    id: 'kartei',
    district: 'sektor-4',
    name: 'Kartei',
    sector: 'Sektor 4 · Meldeamt',
    kind: 'interior',
    backdrop: 'kartei-backdrop',
    spots: [
      {
        id: 'lade-offen', u: 0.710, v: 0.681, r: 0.100,
        label: 'Ausgezogene Lade',
        detail: 'details/kartei-lade-offen.jpg',
        text: 'Sie liegt oben auf dem Schrank, die Karten aufgefächert und '
            + 'durcheinander — die einzige Unordnung in einem Raum, in dem seit '
            + 'Jahren nichts verrutscht ist. Eine Karte steckt verkehrt herum.',
        item: {
          id: 'karteikarte',
          name: 'Karteikarte',
          text: 'Die Karte des vermissten Händlers. Sie ist zweimal abgelegt '
              + 'worden: einmal vor Jahren, einmal vorgestern — die zweite '
              + 'Ablage ist mit Bleistift datiert, einen Tag BEVOR ihn jemand '
              + 'als vermisst gemeldet hat.',
          analysis: {
            wait: 3,
            label: 'Prüfung · Karteikarte',
            clue: 'vordatiert',
            text: 'Der Bleistiftvermerk stammt vom selben Sachbearbeiter. Er hat '
                + 'die Karte zurückgelegt, bevor die Vermisstenmeldung einging — '
                + 'er wusste also vorher, dass der Händler nicht wiederkommt. '
                + 'Das ist der Punkt, an dem aus Mitwissen Beteiligung wird.',
          },
        },
      },
      {
        id: 'leiter', u: 0.400, v: 0.538, r: 0.085,
        label: 'Leiter',
        detail: 'details/kartei-leiter.jpg',
        text: 'Auf Schiene, an die linke Wand gelehnt. Die drei untersten Sprossen '
            + 'sind staubig, die vierte nicht. Wer hier hinaufgestiegen ist, hat '
            + 'genau eine Höhe gebraucht — und ist nicht schwer gewesen.',
      },
      {
        id: 'fenster-k', u: 0.498, v: 0.448, r: 0.075,
        label: 'Fenster',
        detail: 'details/kartei-fenster-k.jpg',
        text: 'Milchglas, dahinter eine Straßenlaterne als kalter Fleck. Der '
            + 'Rahmen ist von innen zugestrichen worden. Dieses Fenster ist nicht '
            + 'zum Öffnen gedacht und war es nie.',
      },
      {
        id: 'birne', u: 0.498, v: 0.260, r: 0.070,
        label: 'Glühbirne',
        detail: 'details/kartei-birne.jpg',
        text: 'Eine einzige, an einem Kabel, mitten im Gang. Sie brennt. In einem '
            + 'Raum, in den angeblich niemand mehr kommt, hat jemand das Licht '
            + 'angelassen.',
      },
      {
        id: 'schrankwand', u: 0.150, v: 0.448, r: 0.095,
        label: 'Schrankwand',
        detail: 'details/kartei-schrankwand.jpg',
        text: 'Hunderte Laden aus Holz, jede mit einem Messinggriff und einem '
            + 'Schildchen. Auf Höhe der Brust läuft ein Streifen, wo der Lack '
            + 'blanker ist — die Höhe, in der ein Mensch entlangstreicht, wenn er '
            + 'im Gehen sucht.',
      },
      {
        id: 'kartei-raus', u: 0.500, v: 0.930, r: 0.080,
        kind: 'exit', dir: 'out', goto: 'registratur',
        label: 'Zurück zur Registratur',
        text: '',
      },
    ],
  },

  /* ====================================================================== */
  /* Der Abschluss.                                                          */
  /*                                                                         */
  /* Drei Orte, und jeder beantwortet eine Frage, die das Spiel bis hierher   */
  /* offengelassen hat:                                                      */
  /*   Kühlhaus  — wo ist der Händler? (Er lebt.)                             */
  /*   Direktion — wer lässt unterschreiben?                                  */
  /*   Wohnung   — und was machst du jetzt damit?                             */
  /*                                                                         */
  /* Die Wohnung ist von Anfang an offen. Sie ist kein Belohnungsraum, den    */
  /* man freischaltet, sondern der Ort, an dem man zwischendurch nachsieht,   */
  /* was man eigentlich hat — und am Ende der einzige Ort, an dem der Fall    */
  /* geschlossen werden kann.                                                 */
  /* ====================================================================== */
  kuehlhaus: {
    id: 'kuehlhaus',
    district: 'sektor-3',
    name: 'Kühlhaus 9',
    sector: 'Sektor 3 · Hafenspange',
    kind: 'interior',
    backdrop: 'kuehlhaus-backdrop',
    spots: [
      {
        id: 'p-haendler', u: 0.283, v: 0.382, r: 0.058, kind: 'person',
        label: 'Mann hinter der Scheibe',
        detail: 'details/haendler.jpg',
        clue: 'haendler-lebt',
        text: 'In der Bretterbude zwischen den Paletten brennt Licht, und darin '
            + 'sitzt jemand: drei Mäntel übereinander, beide Hände um einen '
            + 'Becher. Das Gesicht kennst du von der Anzeigetafel an der '
            + 'Querstraße. Dort hängt es unter „vermisst". Hier atmet es.',
      },
      {
        id: 'buero', u: 0.372, v: 0.545, r: 0.070,
        label: 'Bretterbude',
        detail: 'details/kuehlhaus-buero.jpg',
        text: 'Sperrholz, in eine Ecke des Kühlraums gestellt, mit einem Ofen '
            + 'darin, der zu klein ist für den Raum und zu groß für die Bude. '
            + 'Innen liegt ein Bogen Papier auf der Kiste, die als Tisch dient. '
            + 'Elf Zeilen, zehn davon durchgestrichen.',
        item: {
          id: 'namensliste',
          name: 'Liste mit elf Namen',
          text: 'Elf Namen in einer Handschrift, die dir inzwischen vertraut ist. '
              + 'Zehn sind mit einem waagrechten Strich erledigt. Der elfte ist '
              + 'der des Händlers, und hinter ihm steht kein Strich, sondern ein '
              + 'Datum: übermorgen.',
          analysis: {
            wait: 2,
            label: 'Abgleich · Liste mit elf Namen',
            clue: 'elf-namen',
            text: 'Die zehn durchgestrichenen Namen sind zehn der elf '
                + 'Totenscheine, die im Meldeamt liegen. Der elfte Name ist der '
                + 'des Händlers — dieselbe Nummer wie auf der Patientenkarte, '
                + 'dieselbe wie an dem leeren Fach. Diese Liste ist kein '
                + 'Verzeichnis von Toten. Sie ist ein Terminkalender.',
          },
        },
      },
      {
        id: 'klappstuhl', u: 0.400, v: 0.680, r: 0.068,
        label: 'Klappstuhl',
        detail: 'details/kuehlhaus-klappstuhl.jpg',
        text: 'Er steht vor der Bude, nicht darin, und zeigt zur Tür. Daneben '
            + 'eine Thermoskanne im Reif. Wer hier gesessen hat, hat sich nicht '
            + 'gewärmt, sondern aufgepasst — und zwar von außen.',
      },
      {
        id: 'paletten-luecke', u: 0.108, v: 0.450, r: 0.090,
        label: 'Palettenstapel',
        detail: 'details/kuehlhaus-paletten-luecke.jpg',
        text: 'Bis unter die Decke, alles unter einer Schicht Reif. Auf halber '
            + 'Höhe fehlen zwei Kisten, und an dieser Stelle ist der Reif '
            + 'abgeplatzt statt gewachsen. Die Lücke ist frisch.',
      },
      {
        id: 'stapel-rechts', u: 0.800, v: 0.400, r: 0.090,
        label: 'Gegenüberliegende Reihe',
        detail: 'details/kuehlhaus-stapel-rechts.jpg',
        text: 'Dieselben Kisten, dasselbe Zollsiegel wie in der Kanalgasse. Eine '
            + 'davon ist geöffnet und wieder verschlossen worden; die Nägel '
            + 'sitzen schief. Ihr Inhalt ist Stroh und sonst nichts.',
      },
      {
        id: 'gitterrost', u: 0.500, v: 0.850, r: 0.085,
        label: 'Gitterrost',
        detail: 'details/kuehlhaus-gitterrost.jpg',
        text: 'Der Boden ist ein Rost, darunter eine Rinne für das Tauwasser. In '
            + 'der Rinne liegt eine Kette mit einer Blechmarke, blank gescheuert '
            + 'und ohne Nummer. Jemand hat sie durchs Gitter fallen lassen, und '
            + 'zwar mit Absicht — sie liegt genau in der Mitte.',
      },
      {
        id: 'kuehl-raus', u: 0.500, v: 0.450, r: 0.085,
        kind: 'exit', dir: 'out', goto: 'customs',
        label: 'Kühlhaustür',
        text: '',
      },
    ],
  },

  /* ====================================================================== */
  direktion: {
    id: 'direktion',
    district: 'sektor-1',
    name: 'Direktion',
    sector: 'Sektor 1 · Konzernterrassen',
    kind: 'interior',
    backdrop: 'direktion-backdrop',
    spots: [
      {
        id: 'p-direktorin', u: 0.500, v: 0.450, r: 0.060, kind: 'person',
        label: 'Frau am Schreibtisch',
        detail: 'details/direktorin.jpg',
        text: 'Sie steht, obwohl ein Stuhl da ist, und sie stand schon, bevor du '
            + 'hereingekommen bist. Der Aufzug braucht vierzig Sekunden nach '
            + 'oben. Vierzig Sekunden haben gereicht, um alles wegzuräumen bis '
            + 'auf das, was sie dich sehen lassen will.',
      },
      {
        id: 'schreibtisch', u: 0.418, v: 0.588, r: 0.085,
        label: 'Schreibtisch',
        detail: 'details/direktion-schreibtisch.jpg',
        clue: 'letzte-unterschrift',
        text: 'Schwarzer Stein, leer bis auf eine Ledermappe und eine Lampe. Die '
            + 'Mappe liegt aufgeschlagen — nicht vergessen, sondern hingelegt.',
        item: {
          id: 'mappe',
          name: 'Unterschriftenmappe',
          text: 'Eine Sterbeurkunde, fertig ausgefüllt bis auf zwei Felder: das '
              + 'Datum und die Unterschrift des Sachbearbeiters. Der Name darauf '
              + 'ist der des Händlers, der zwei Sektoren weiter in einem '
              + 'Kühlhaus sitzt und atmet. Die Nummer ist dieselbe wie an dem '
              + 'leeren Fach.',
        },
      },
      {
        id: 'lampe', u: 0.582, v: 0.512, r: 0.055,
        label: 'Schreiblampe',
        detail: 'details/direktion-lampe.jpg',
        text: 'Die einzige Lampe, die brennt, in einem Raum mit drei Wänden aus '
            + 'Glas. Sie ist nicht auf die Mappe gerichtet, sondern auf den '
            + 'Platz davor — auf den, der unterschreiben soll.',
      },
      {
        id: 'sideboard', u: 0.058, v: 0.575, r: 0.085,
        label: 'Sideboard',
        detail: 'details/direktion-sideboard.jpg',
        text: 'Drei Ordner, gleich breit, gleich beschriftet, und daneben eine '
            + 'Lücke von genau derselben Breite. In dieser Etage verschwindet '
            + 'nichts unbemerkt — außer, es soll verschwinden.',
      },
      {
        id: 'fensterfront', u: 0.780, v: 0.280, r: 0.090,
        label: 'Fensterfront',
        detail: 'details/direktion-fensterfront.jpg',
        text: 'Von hier oben ist der Regen kein Wetter, sondern eine Schicht '
            + 'zwischen dieser Etage und allem anderen. Unten leuchten die '
            + 'Sektoren, in denen die Leute wohnen, deren Namen auf der Liste '
            + 'stehen. Von hier sieht man sie alle auf einmal.',
      },
      {
        id: 'sitzgruppe', u: 0.855, v: 0.700, r: 0.085,
        label: 'Sitzgruppe',
        detail: 'details/direktion-sitzgruppe.jpg',
        text: 'Zwei Sessel und ein Glastisch, beide Sessel exakt gleich weit vom '
            + 'Tisch entfernt. Auf dem Glas steht der Ring eines Glases, das '
            + 'nicht mehr da ist. Hier hat vor Kurzem jemand gesessen, der nicht '
            + 'hierhergehört.',
      },
      {
        id: 'direktion-raus', u: 0.500, v: 0.935, r: 0.080,
        kind: 'exit', dir: 'out', goto: 'empfang',
        label: 'Zurück zum Aufzug',
        text: '',
      },
    ],
  },

  /* ====================================================================== */
  wohnung: {
    id: 'wohnung',
    district: 'wohnung',
    name: 'Deine Wohnung',
    sector: 'Sektor 7 · Zuhause',
    kind: 'interior',
    backdrop: 'wohnung-backdrop',
    spots: [
      {
        id: 'pinnwand', u: 0.148, v: 0.390, r: 0.115, kind: 'anklage',
        label: 'Pinnwand',
        detail: 'details/wohnung-pinnwand.jpg',
        text: 'Kork, halb so lang wie die Wand, und darauf steckt außer einem '
            + 'Foto nichts. Die Nadeln sind da. Was fehlt, ist die Reihenfolge, '
            + 'in der das alles zusammengehört — und ein Name, der am Ende '
            + 'dieser Reihenfolge steht.',
      },
      {
        id: 'foto', u: 0.243, v: 0.345, r: 0.050,
        label: 'Foto',
        detail: 'details/wohnung-foto.jpg',
        text: 'Das einzige Blatt an der Wand. Zwei Leute unter einem Schirm, '
            + 'unscharf, das Papier an den Ecken wellig. Du hängst es seit '
            + 'Jahren um, ohne es je abzunehmen.',
      },
      {
        id: 'fenster-w', u: 0.498, v: 0.410, r: 0.100,
        label: 'Fenster',
        detail: 'details/wohnung-fenster-w.jpg',
        text: 'Drei Bahnen Glas und dahinter die Gasse, von oben. Der Kanal, die '
            + 'Reklame, die seit Jahren dasselbe verspricht. Von hier ist das '
            + 'ein Bild. Unten ist es ein Arbeitsweg.',
      },
      {
        id: 'sessel', u: 0.648, v: 0.760, r: 0.085,
        label: 'Sessel',
        detail: 'details/wohnung-sessel.jpg',
        text: 'Leder, an einer Stelle durchgesessen, und zur Pinnwand gedreht '
            + 'statt zum Fenster. Wer hier sitzt, sieht sich nicht die Stadt an, '
            + 'sondern das, was er über sie weiß.',
      },
      {
        id: 'papiere', u: 0.530, v: 0.865, r: 0.075,
        label: 'Papiere am Boden',
        detail: 'details/wohnung-papiere.jpg',
        text: 'Kopien, Durchschläge, ein halber Meldebogen. Sie liegen so, wie '
            + 'sie hingefallen sind, in einem Bogen um den Sessel — jemand hat '
            + 'sie im Sitzen gelesen und einzeln fallen lassen.',
      },
      {
        id: 'kueche', u: 0.878, v: 0.420, r: 0.085,
        label: 'Küchennische',
        detail: 'details/wohnung-kueche.jpg',
        text: 'Eine Glühbirne ohne Schirm, eine Pfanne, ein Wasserhahn, der '
            + 'tropft. Das einzige warme Licht in dieser Wohnung kommt aus dem '
            + 'Raum, in dem du am wenigsten bist.',
      },
      {
        id: 'tisch', u: 0.880, v: 0.900, r: 0.080,
        label: 'Tisch',
        detail: 'details/wohnung-tisch.jpg',
        text: 'Ein Glas mit einem Rest darin und ein Aschenbecher, der seit '
            + 'gestern nicht geleert wurde. Daneben Zettel mit deiner eigenen '
            + 'Schrift, und auf dem obersten steht eine Uhrzeit, die noch nicht '
            + 'vorbei ist.',
      },
      {
        id: 'wohnung-raus', u: 0.310, v: 0.420, r: 0.070,
        kind: 'exit', dir: 'out', goto: 'crossing',
        label: 'Hinaus',
        text: '',
      },
    ],
  },
};

