/**
 * FALL 2 — „Die zweite Schicht".
 *
 * Sieben Orte in drei Sektoren. Bewusst enger als Fall 1: Der erste Fall war
 * eine Stadtdurchquerung, dieser spielt an einem Rand, an dem alles
 * stillsteht. Winter, ein stillgelegtes Werk, zwei Reihen Häuser.
 *
 * Die eigene Wohnung benutzt die Platte aus Fall 1 — es ist dieselbe Wohnung.
 */

export const ORTE = {
  /* ====================================================================== */
  'f2-becken': {
    id: 'f2-becken',
    district: 'sektor-11',
    name: 'Klärbecken',
    sector: 'Sektor 11 · Klärwerk',
    kind: 'street',
    backdrop: 'f2-becken-backdrop',
    spots: [
      {
        id: 'f2-plane', u: 0.640, v: 0.605, r: 0.090,
        label: 'Plane auf dem Eis',
        detail: 'details/f2-becken-f2-plane.jpg',
        clue: 'f2-fundort',
        text: 'Eine Plane, mit Ziegeln beschwert, mitten auf der Eisfläche. '
            + 'Darunter liegt er seit mindestens zwei Tagen. Das Eis ringsum '
            + 'ist aufgebrochen und wieder zugefroren — er ist nicht '
            + 'eingebrochen, er ist abgelegt worden, als das Loch noch offen war.',
      },
      {
        id: 'f2-eis', u: 0.545, v: 0.735, r: 0.085,
        label: 'Aufgebrochenes Eis',
        detail: 'details/f2-becken-f2-eis.jpg',
        text: 'Die Bruchkanten zeigen nach innen, nicht nach außen. Das Loch '
            + 'ist von oben geschlagen worden, mit etwas Schwerem und ohne Eile. '
            + 'Wer das tut, rechnet nicht damit, dass jemand kommt.',
      },
      {
        id: 'f2-steg', u: 0.375, v: 0.790, r: 0.085,
        label: 'Steg',
        detail: 'details/f2-becken-f2-steg.jpg',
        // Der Sektor haengt an DIESEM Hinweis, nicht an der Marke selbst: Ein
        // Gegenstand verlaesst beim Abgeben die Asservate, und die Siedlung
        // waere wieder zugefallen, sobald man die Marke untersuchen laesst.
        clue: 'f2-marke-gefunden',
        text: 'Schnee liegt darauf, aber nicht überall. Zwei Spuren führen '
            + 'hinaus und zwei zurück, dieselbe Sohle. Er ist zweimal gegangen '
            + 'und beide Male allein — beim zweiten Mal schwerer beladen als '
            + 'beim ersten.',
        item: {
          id: 'f2-marke',
          name: 'Werksmarke ohne Nummer',
          text: 'Eine Blechmarke, wie sie jeder Schichtarbeiter am Bund trägt, '
              + 'im Schnee neben der Spur. Auf der Rückseite gehört eine '
              + 'eingeschlagene Nummer hin. Hier ist die Stelle blank '
              + 'geschliffen — von Hand, sorgfältig, vor langer Zeit.',
        },
      },
      {
        id: 'f2-mast', u: 0.618, v: 0.215, r: 0.075,
        label: 'Flutlichtmast',
        detail: 'details/f2-becken-f2-mast.jpg',
        text: 'Der einzige Mast, der noch brennt, in einem Werk ohne Strom. '
            + 'Am Fuß liegt ein Kabel, das jemand von Hand neu geklemmt hat. '
            + 'Nicht sauber, aber fachkundig.',
      },
      {
        id: 'f2-rand', u: 0.865, v: 0.645, r: 0.085,
        label: 'Beckenrand',
        detail: 'details/f2-becken-f2-rand.jpg',
        text: 'Der Reif am Beton ist über eine Länge von zwei Metern '
            + 'abgeschabt. Etwas ist hier über die Kante geschoben worden, und '
            + 'zwar an der Stelle, die vom Werkstor aus nicht einzusehen ist.',
      },
      {
        id: 'f2-zur-halle', u: 0.300, v: 0.335, r: 0.085,
        kind: 'exit', dir: 'forward', goto: 'f2-halle',
        label: 'Maschinenhalle',
        text: 'Die Fensterbänder sind zerschlagen, aber im Inneren steht Licht. '
            + 'Nicht viel, und nicht überall.',
      },
    ],
  },

  /* ====================================================================== */
  'f2-halle': {
    id: 'f2-halle',
    district: 'sektor-11',
    name: 'Maschinenhalle',
    sector: 'Sektor 11 · Klärwerk',
    kind: 'interior',
    backdrop: 'f2-halle-backdrop',
    spots: [
      {
        id: 'f2-technikerin', u: 0.800, v: 0.580, r: 0.060, kind: 'person',
        label: 'Frau am Spurenwagen',
        detail: 'details/f2-technikerin.jpg',
        text: 'Sie arbeitet im Stehen, mit Handschuhen, und sieht nicht auf. '
            + 'Neben ihr steht der Koffer offen, in dem die Abdrücke abgeglichen '
            + 'werden. Sie ist die Einzige hier, die etwas beweisen kann.',
      },
      {
        id: 'f2-wagen', u: 0.740, v: 0.640, r: 0.090, kind: 'lab',
        label: 'Spurenwagen',
        detail: 'details/f2-halle-f2-wagen.jpg',
        text: 'Ein Kastenwagen mit offenen Hecktüren und einer Arbeitsleuchte '
            + 'auf einem Stativ — das einzige saubere, gewartete Ding im ganzen '
            + 'Werk. Auf der Ladekante liegt ein Tablett für das, was untersucht '
            + 'werden soll.',
      },
      {
        id: 'f2-pumpen', u: 0.245, v: 0.520, r: 0.095,
        label: 'Pumpenreihe',
        detail: 'details/f2-halle-f2-pumpen.jpg',
        text: 'Zwei Reihen Gehäuse unter Planen, alle mit derselben Staubschicht '
            + 'aus derselben Zeit. Bis auf eine: Die Plane liegt daneben, und '
            + 'am Gehäuse ist der Staub in Handbreite abgewischt.',
      },
      {
        id: 'f2-kran', u: 0.500, v: 0.175, r: 0.080,
        label: 'Laufkran',
        detail: 'details/f2-halle-f2-kran.jpg',
        text: 'Mitten über der Halle stehengeblieben, nicht in der Parkstellung. '
            + 'Wer ihn zuletzt bewegt hat, hat ihn dort gelassen, wo er ihn '
            + 'gebraucht hat.',
      },
      {
        id: 'f2-grat', u: 0.200, v: 0.290, r: 0.080,
        label: 'Schneegrat an der Wand',
        detail: 'details/f2-halle-f2-grat.jpg',
        text: 'Unter dem zerschlagenen Fensterband hat der Schnee einen Wall '
            + 'gebildet. An einer Stelle ist er niedergetreten und wieder '
            + 'überweht — jemand ist hier durchs Fenster hereingekommen, statt '
            + 'durch das Tor.',
      },
      {
        id: 'f2-zum-buero', u: 0.497, v: 0.512, r: 0.080,
        kind: 'exit', dir: 'in', goto: 'f2-buero',
        label: 'Werksbüro',
        text: 'Eine Stahltür, angelehnt, dahinter warmes Licht. In einem Werk '
            + 'ohne Strom heizt jemand.',
      },
      {
        id: 'f2-halle-raus', u: 0.500, v: 0.930, r: 0.080,
        kind: 'exit', dir: 'out', goto: 'f2-becken',
        label: 'Hinaus zu den Becken',
        text: '',
      },
    ],
  },

  /* ====================================================================== */
  'f2-buero': {
    id: 'f2-buero',
    district: 'sektor-11',
    name: 'Werksbüro',
    sector: 'Sektor 11 · Klärwerk',
    kind: 'interior',
    backdrop: 'f2-buero-backdrop',
    spots: [
      {
        id: 'f2-pfoertnerin', u: 0.575, v: 0.470, r: 0.060, kind: 'person',
        label: 'Gestalt hinter dem Glas',
        detail: 'details/f2-pfoertnerin.jpg',
        text: 'Sie steht im Mantel in einem Raum, den sie geheizt hat, und '
            + 'sieht in die dunkle Halle hinaus statt auf die Tür. Sie hat dich '
            + 'kommen gehört, lange bevor du da warst, und sich nicht umgedreht.',
      },
      {
        id: 'f2-schichtbuch', u: 0.330, v: 0.615, r: 0.085,
        label: 'Schichtbuch',
        detail: 'details/f2-buero-f2-schichtbuch.jpg',
        text: 'Aufgeschlagen, mit einem Stift daneben. Die letzte Eintragung '
            + 'ist vier Monate alt und schließt das Werk. Danach nichts mehr — '
            + 'außer dass die letzten drei Seiten neuer aussehen als der Rest '
            + 'des Buches.',
        item: {
          id: 'f2-buch',
          name: 'Schichtbuch',
          text: 'Vier Monate nach der Stilllegung endet das Buch ordentlich. '
              + 'Die letzten drei Blätter sind aus einem anderen Bogen — '
              + 'dasselbe Papier, andere Charge, glatter geschnitten. Jemand hat '
              + 'ein Stück Vergangenheit ersetzt und dabei alles richtig gemacht '
              + 'außer dem Papier.',
          analysis: {
            wait: 3,
            label: 'Prüfung · Schichtbuch',
            clue: 'f2-zweite-schicht',
            text: 'Die drei ersetzten Blätter decken genau die Nächte ab, in '
                + 'denen laut Stromzähler des Flutlichtmasts jemand im Werk war. '
                + 'Es hat nach der Stilllegung weiter Schichten gegeben — '
                + 'unbezahlt, unangemeldet und in keinem Buch, das noch existiert.',
          },
        },
      },
      {
        id: 'f2-tafel', u: 0.285, v: 0.400, r: 0.080,
        label: 'Schichttafel',
        detail: 'details/f2-buero-f2-tafel.jpg',
        text: 'Holzhaken für jeden Mann, und an fast jedem hängt nichts mehr. '
            + 'An dreien hängen noch Marken, und alle drei sind auf der '
            + 'Rückseite blank geschliffen. Keine Nummern, keine Namen.',
      },
      {
        id: 'f2-ofen', u: 0.455, v: 0.650, r: 0.070,
        label: 'Ölofen',
        detail: 'details/f2-buero-f2-ofen.jpg',
        text: 'Er brennt. Der Kanister daneben ist zu zwei Dritteln voll und '
            + 'trägt kein Werkszeichen — den hat jemand privat hergebracht, und '
            + 'zwar mehrfach.',
      },
      {
        id: 'f2-becher', u: 0.700, v: 0.650, r: 0.070,
        label: 'Zwei Becher',
        detail: 'details/f2-buero-f2-becher.jpg',
        clue: 'f2-zwei-becher',
        text: 'Auf dem Sims stehen zwei Emailbecher. In einem ist ein Rest, der '
            + 'schon Haut angesetzt hat; der andere ist ausgespült und '
            + 'umgedreht. Wer hier Wache hält, hält sie nicht allein — und der '
            + 'zweite Becher wird jedes Mal weggeräumt.',
      },
      {
        id: 'f2-buero-raus', u: 0.500, v: 0.930, r: 0.080,
        kind: 'exit', dir: 'out', goto: 'f2-halle',
        label: 'Zurück in die Halle',
        text: '',
      },
    ],
  },

  /* ====================================================================== */
  'f2-siedlung': {
    id: 'f2-siedlung',
    district: 'sektor-6',
    name: 'Werkssiedlung',
    sector: 'Sektor 6 · Werkssiedlung',
    kind: 'street',
    backdrop: 'f2-siedlung-backdrop',
    spots: [
      {
        id: 'f2-fenster', u: 0.130, v: 0.545, r: 0.090,
        label: 'Drei erleuchtete Fenster',
        detail: 'details/f2-siedlung-f2-fenster.jpg',
        clue: 'f2-drei-fenster',
        text: 'Zwei Reihen Häuser, und in genau drei Fenstern brennt Licht — '
            + 'nicht nebeneinander, sondern über die ganze Zeile verteilt. Alle '
            + 'drei sind von innen verhängt. Wer hier wohnt, wohnt hier nicht '
            + 'mehr offiziell.',
      },
      {
        /* Die Meldung „In der Siedlung ist ein Licht ausgegangen" hatte keine
           Entsprechung — man ging hin und fand nichts. Eine Meldung, die auf
           nichts zeigt, ist schlimmer als gar keine. Jetzt gibt es das
           dunkle Fenster. */
        id: 'f2-dunkles-fenster', u: 0.885, v: 0.310, r: 0.080,
        label: 'Das dunkle Fenster',
        erscheint: { clue: 'f2-nachtarbeit' },
        clue: 'f2-einer-weniger',
        text: 'Von dreien brennen noch zwei. Im dritten steht die Gardine '
            + 'offen, und dahinter ist nichts mehr — kein Bett, kein Ofen, '
            + 'kein Karton vor der Scheibe. Ausgeräumt, nicht ausgezogen: Die '
            + 'Tür steht angelehnt, und der Schlüssel steckt von außen.',
      },
      {
        id: 'f2-lieferwagen', u: 0.368, v: 0.724, r: 0.085,
        label: 'Lieferwagen',
        detail: 'details/f2-siedlung-f2-lieferwagen.jpg',
        text: 'Ohne Aufschrift, ohne Schnee auf der Scheibe. Er ist vor '
            + 'höchstens einer Stunde gefahren worden. Die Ladefläche ist innen '
            + 'ausgeschlagen mit Decken, die nicht dazugehören.',
      },
      {
        id: 'f2-zaun', u: 0.525, v: 0.635, r: 0.080,
        label: 'Maschendrahtzaun',
        detail: 'details/f2-siedlung-f2-zaun.jpg',
        text: 'Am Ende der Straße, und dahinter der Umriss des Werks. Auf '
            + 'halber Höhe ist der Draht aufgetrennt und mit Bindedraht wieder '
            + 'zusammengezogen — von der Siedlungsseite aus, immer wieder.',
      },
      {
        id: 'f2-schnee', u: 0.290, v: 0.805, r: 0.085,
        label: 'Spuren im Schnee',
        detail: 'details/f2-siedlung-f2-schnee.jpg',
        text: 'Vom mittleren der drei erleuchteten Häuser führt eine Spur zum '
            + 'Zaun und zurück. Sie ist mehrfach benutzt und immer wieder '
            + 'ausgetreten worden, damit sie wie ein Weg aussieht und nicht wie '
            + 'ein Pfad.',
      },
      {
        id: 'f2-zum-haus', u: 0.150, v: 0.700, r: 0.085,
        kind: 'exit', dir: 'in', goto: 'f2-haus',
        label: 'Das mittlere Haus',
        text: 'Die Tür ist nicht abgeschlossen. Sie klemmt nur, weil sie sich '
            + 'im Frost verzogen hat.',
      },
      {
        id: 'f2-zur-kantine', u: 0.845, v: 0.470, r: 0.085,
        kind: 'exit', dir: 'right', goto: 'f2-kantine',
        label: 'Werkskantine',
        text: 'Am Kopf der Zeile, halb im Werksgelände. Drinnen brennt Licht '
            + 'und es steigt Dampf auf. Eine Kantine für ein Werk, das '
            + 'geschlossen ist.',
      },
    ],
  },

  /* ====================================================================== */
  'f2-haus': {
    id: 'f2-haus',
    district: 'sektor-6',
    name: 'Das mittlere Haus',
    sector: 'Sektor 6 · Werkssiedlung',
    kind: 'interior',
    backdrop: 'f2-haus-backdrop',
    spots: [
      {
        id: 'f2-zeuge', u: 0.593, v: 0.520, r: 0.060, kind: 'person',
        label: 'Der Mann, den es nicht gibt',
        detail: 'details/f2-zeuge.jpg',
        clue: 'f2-zeuge-gefunden',
        text: 'Er sitzt auf der Matratze, in zwei Mänteln, und steht nicht auf. '
            + 'Sein Gesicht kennst du: Es steht auf der Liste der elf, die im '
            + 'vorigen Fall für tot erklärt worden sind. Er weiß, dass du es '
            + 'weißt, und sagt trotzdem nichts.',
      },
      {
        id: 'f2-striche', u: 0.664, v: 0.369, r: 0.085,
        label: 'Strichliste',
        detail: 'details/f2-haus-f2-striche.jpg',
        text: 'In den Putz geritzt, in Fünferblöcken, über eine halbe Wand. '
            + 'Vierhundertzwanzig Striche. Er zählt nicht die Tage seit der '
            + 'Stilllegung — er zählt die Tage seit seinem eigenen Todesdatum.',
      },
      {
        id: 'f2-fenster-h', u: 0.484, v: 0.327, r: 0.080,
        label: 'Zugeklebtes Fenster',
        detail: 'details/f2-haus-f2-fenster-h.jpg',
        text: 'Von innen mit Karton verschlossen, sauber verklebt, mit einem '
            + 'Spalt auf Augenhöhe. Der Spalt zeigt nicht auf die Straße, '
            + 'sondern auf den Zaun.',
      },
      {
        id: 'f2-tisch', u: 0.200, v: 0.769, r: 0.085,
        label: 'Tisch aus einer Tür',
        detail: 'details/f2-haus-f2-tisch.jpg',
        text: 'Eine Tür auf zwei Kisten. Darauf ein Radio, ein Blechteller und '
            + 'ein Stapel Zeitungen, alle aus derselben Woche vor einem Jahr. '
            + 'Die oberste ist an einer Stelle durchgelesen bis zum Riss.',
      },
      {
        id: 'f2-maentel', u: 0.867, v: 0.333, r: 0.075,
        label: 'Mäntel am Nagel',
        detail: 'details/f2-haus-f2-maentel.jpg',
        text: 'Drei Mäntel an einem Nagel, für einen Mann. Zwei davon sind zu '
            + 'groß und riechen nach Öl. Er trägt nicht nur seine eigenen.',
      },
      {
        id: 'f2-haus-raus', u: 0.500, v: 0.930, r: 0.080,
        kind: 'exit', dir: 'out', goto: 'f2-siedlung',
        label: 'Hinaus',
        text: '',
      },
    ],
  },

  /* ====================================================================== */
  'f2-kantine': {
    id: 'f2-kantine',
    district: 'sektor-6',
    name: 'Werkskantine',
    sector: 'Sektor 6 · Werkssiedlung',
    kind: 'interior',
    backdrop: 'f2-kantine-backdrop',
    spots: [
      {
        id: 'f2-vorsteher', u: 0.278, v: 0.545, r: 0.060, kind: 'person',
        label: 'Mann am Fenstertisch',
        detail: 'details/f2-vorsteher.jpg',
        text: 'Er sitzt allein an dem einzigen Tisch, der nicht abgeräumt ist, '
            + 'mit dem Rücken halb zur Tür, und sieht in den verschneiten Hof. '
            + 'Die Mütze liegt neben dem Becher. Er hat nicht aufgesehen, als '
            + 'du hereingekommen bist, und das ist eine Entscheidung.',
      },
      {
        id: 'f2-tresen', u: 0.532, v: 0.513, r: 0.085,
        label: 'Ausgabe',
        detail: 'details/f2-kantine-f2-tresen.jpg',
        text: 'Aus einem der Warmhaltefächer steigt Dampf. Für einen Mann kocht '
            + 'niemand — und die Bleche daneben sind für dreißig Portionen '
            + 'ausgelegt und benutzt worden, nicht vor vier Monaten, sondern '
            + 'diese Woche.',
        item: {
          id: 'f2-liste',
          name: 'Ausgabeliste',
          text: 'Unter der Warmhalteplatte klemmt ein Zettel mit Strichen — '
              + 'Portionen, tageweise. Sechs bis neun je Nacht, über vier '
              + 'Monate. Keine Namen, aber eine Handschrift, die dir aus dem '
              + 'Schichtbuch bekannt vorkommt.',
          analysis: {
            wait: 2,
            label: 'Abgleich · Ausgabeliste',
            clue: 'f2-anweisung',
            text: 'Die Handschrift der Ausgabeliste ist dieselbe wie auf den '
                + 'drei ersetzten Blättern im Schichtbuch. Auf der Rückseite '
                + 'des Zettels steht, wofür der Zettel eigentlich gedacht war: '
                + 'eine Anweisung, wie viele in dieser Nacht arbeiten und wer '
                + 'sie holt. Unterschrieben mit einem Kürzel, das im Werk nur '
                + 'einer führt.',
          },
        },
      },
      {
        id: 'f2-anschlag', u: 0.960, v: 0.320, r: 0.080,
        label: 'Anschlagbrett',
        detail: 'details/f2-kantine-f2-anschlag.jpg',
        text: 'Leer bis auf die Reißnägel — und die stecken in einem Raster, '
            + 'das genau die Größe der Blätter hat, die dort gehangen haben. '
            + 'Sie sind alle am selben Tag abgenommen worden.',
      },
      {
        id: 'f2-tische', u: 0.780, v: 0.700, r: 0.090,
        label: 'Tische',
        detail: 'details/f2-kantine-f2-tische.jpg',
        text: 'Auf den meisten stehen die Stühle hochgestellt. Auf sechs nicht. '
            + 'Diese sechs sind abgewischt, und auf einem klebt ein Ring von '
            + 'einem Becher, der heute Nacht dort stand.',
      },
      {
        id: 'f2-kantine-raus', u: 0.500, v: 0.930, r: 0.080,
        kind: 'exit', dir: 'out', goto: 'f2-siedlung',
        label: 'Hinaus',
        text: '',
      },
    ],
  },

  /* ====================================================================== */
  /* Dieselbe Wohnung wie in Fall 1 — dieselbe Platte, dieselbe Pinnwand.   */
  'f2-wohnung': {
    id: 'f2-wohnung',
    district: 'f2-zuhause',
    name: 'Deine Wohnung',
    sector: 'Sektor 7 · Zuhause',
    kind: 'interior',
    backdrop: 'wohnung-backdrop',
    spots: [
      {
        id: 'f2-pinnwand', u: 0.148, v: 0.390, r: 0.115, kind: 'anklage',
        label: 'Pinnwand',
        detail: 'details/f2-wohnung-f2-pinnwand.jpg',
        text: 'Der letzte Fall hängt noch daran, mit Nadeln, die du nicht '
            + 'herausgezogen hast. Daneben ist Platz. Es ist immer Platz.',
      },
      {
        id: 'f2-fenster-w', u: 0.498, v: 0.410, r: 0.100,
        label: 'Fenster',
        detail: 'details/f2-wohnung-f2-fenster-w.jpg',
        text: 'Es schneit in den Kanal. Von hier oben sieht die Stadt aus, als '
            + 'wäre sie zugedeckt worden, und nicht, als hätte sie sich '
            + 'zugedeckt.',
      },
      {
        id: 'f2-kueche', u: 0.878, v: 0.420, r: 0.085,
        label: 'Küchennische',
        detail: 'details/f2-wohnung-f2-kueche.jpg',
        text: 'Der Wasserhahn tropft nicht mehr. Bei diesem Frost tropft nichts '
            + 'mehr, und das ist die einzige gute Nachricht dieses Winters.',
      },
    ],
  },
};
