/**
 * FALL 2 — „Der Chor".
 *
 * Achtzehn Orte in sieben Sektoren. Die erste Fassung dieses Falls hatte
 * sieben, und das war zu wenig: Ein Fall, der nach einer Stunde durch ist,
 * kann nicht die Wendung tragen, die dieser braucht.
 *
 * DIE FORM DER STADT BLEIBT, DER BODEN DARUNTER NICHT.
 *
 * Oben ist alles wie in Fall 1: Regen, Frost, Verwaltung, Leute, die zu wenig
 * verdienen, um Fragen zu stellen. Unter dem vierten Becken faengt etwas
 * anderes an. Das ist Absicht — die Wendung wirkt nur, wenn der Weg dorthin
 * durch lauter gewoehnliche Raeume fuehrt.
 *
 * Drei Platten kommen aus Fall 1 zurueck: die eigene Wohnung, die Leichenhalle
 * und das Archiv. Dieselbe Stadt hat dieselbe Leichenhalle, und ein Raum, den
 * man wiedererkennt, traegt mehr Geschichte als ein neuer.
 *
 * Koordinaten sind Bildkoordinaten der Platte (u, v 0…1, v von oben) — siehe
 * den Kopf von faelle/fall1/orte.js.
 */

export const ORTE = {
  /* ======================================================================
     SEKTOR 11 · KLAERWERK — wo er liegt
     ====================================================================== */
  'f2-becken': {
    id: 'f2-becken',
    district: 'f2-werk',
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
            + 'eingebrochen, er ist abgelegt worden, als das Loch noch offen '
            + 'war. Und er trägt keine Werkskleidung.',
        item: {
          id: 'f2-ausweis',
          name: 'Durchweichter Dienstausweis',
          text: 'In der Innentasche, das Lichtbild abgelöst, die Prägung nicht. '
              + 'Ein Amtszeichen, das nicht zum Werk gehört und nicht zur '
              + 'Stadtreinigung. Wer immer er war, er war hier im Dienst — nur '
              + 'nicht in diesem.',
          analysis: {
            wait: 2,
            label: 'Prüfung · Dienstausweis',
            clue: 'f2-wer-er-war',
            text: 'Der Ausweis gehört dem Flutwarnnetz. Anton Rube, Wärter der '
                + 'Pegelstation am Nordkanal, seit elf Tagen nicht im Dienst '
                + 'und seit elf Tagen nicht als vermisst gemeldet. Beides steht '
                + 'in derselben Akte, in derselben Handschrift, am selben Tag '
                + 'eingetragen.',
          },
        },
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
        clue: 'f2-strom',
        text: 'Der einzige Mast, der noch brennt, in einem Werk ohne Strom. Am '
            + 'Fuß liegt ein Kabel, das jemand von Hand neu geklemmt hat — '
            + 'fachkundig, nicht sauber. Es läuft nicht zur Halle. Es läuft '
            + 'nach hinten, zum vierten Becken, und dort in den Boden.',
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
      {
        /* Der Fussweg nach unten. Der Sektor auf der Karte tut dasselbe — aber
           wer hier steht und weiss, dass es einen Schacht gibt, soll ihn von
           hier aus erreichen und nicht erst fliegen muessen. */
        id: 'f2-zum-schacht', u: 0.850, v: 0.450, r: 0.080,
        kind: 'exit', dir: 'right', goto: 'f2-schachtkopf',
        requires: { clue: 'f2-schacht' },
        lockText: 'Hinter der Reihe steht noch ein Becken, leergepumpt, dunkel. '
                + 'Ein Klärwerk hat drei. Dieses hier hat vier, und solange du '
                + 'das nur siehst und nicht weißt, ist es ein Becken wie jedes '
                + 'andere.',
        label: 'Das vierte Becken',
        text: 'Leergepumpt, während alle anderen voll stehen und zufrieren. Am '
            + 'Rand steht ein Gerüst, das dort nicht hingehört.',
      },
    ],
  },

  /* ====================================================================== */
  'f2-halle': {
    id: 'f2-halle',
    district: 'f2-werk',
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
            + 'aus derselben Zeit. Bis auf eine: Die Plane liegt daneben, das '
            + 'Gehäuse ist geöffnet, und die Wicklung ist heraus. Sie hat nichts '
            + 'mehr gepumpt. Sie hat Strom geliefert.',
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
        clue: 'f2-einstieg',
        text: 'Unter dem zerschlagenen Fensterband hat der Schnee einen Wall '
            + 'gebildet. An einer Stelle ist er niedergetreten und wieder '
            + 'überweht, dann wieder niedergetreten — nicht einmal, sondern '
            + 'über Nächte hinweg. Jemand ist hier immer wieder durchs Fenster '
            + 'hereingekommen, statt durch das Tor.',
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
    district: 'f2-werk',
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
                + 'denen laut Zähler des Flutlichtmasts Strom gezogen wurde. Es '
                + 'hat nach der Stilllegung weiter Schichten gegeben — '
                + 'unbezahlt, unangemeldet und in keinem Buch, das noch '
                + 'existiert. Und der Verbrauch dieser Nächte ist der eines '
                + 'Werks, das nicht klärt, sondern hebt.',
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

  /* ======================================================================
     SEKTOR 2 · PRAESIDIUM — was der Tote mitgebracht hat
     Zwei Raeume im selben Kellergang. Die Platten kommen aus Fall 1: es ist
     dieselbe Stadt und dieselbe Leichenhalle.
     ====================================================================== */
  'f2-leichenhalle': {
    id: 'f2-leichenhalle',
    district: 'f2-praesidium',
    name: 'Leichenhalle',
    sector: 'Sektor 2 · Präsidium',
    kind: 'interior',
    backdrop: 'f2-leichenhalle-backdrop',
    spots: [
      {
        id: 'f2-pathologe', u: 0.469, v: 0.430, r: 0.060, kind: 'person',
        label: 'Mann am Fach',
        detail: 'details/f2-pathologe.jpg',
        text: 'Er steht an einem offenen Fach, ohne Handschuhe, die Hände auf '
            + 'dem Rücken. Er sieht das an, was darin liegt, wie jemand, der '
            + 'etwas schon einmal gesehen hat und gehofft hatte, es nicht '
            + 'wiederzusehen.',
      },
      {
        id: 'f2-fach', u: 0.307, v: 0.457, r: 0.095,
        label: 'Das offene Fach',
        detail: 'details/f2-leichenhalle-f2-fach.jpg',
        clue: 'f2-kein-frostschaden',
        text: 'Er liegt auf dem Blech, und es stimmt nichts. Keine Wunde, kein '
            + 'Bruch, kein Wasser in den Lungen. Vor allem: keine Frostschäden '
            + 'an Händen und Ohren. Wer zwei Tage auf einem Eisfeld liegt, '
            + 'zeichnet sich. Er war tot, bevor die Kälte an ihn herangekommen '
            + 'ist.',
      },
      {
        /* Die Schale haengt an der Waage und steht nicht auf dem Rollwagen:
           Der Wagen ist auf der Platte leer, und was im Text steht, muss im
           Bild auch zu sehen sein. */
        id: 'f2-schale', u: 0.653, v: 0.400, r: 0.075,
        label: 'Schale der Hängewaage',
        detail: 'details/f2-leichenhalle-f2-schale.jpg',
        clue: 'f2-staub',
        text: 'In der Schale der Waage liegt, was er ihm aus dem Mund geholt '
            + 'hat: ein feiner, heller Staub, mineralisch. '
            + 'Er saß nicht auf den Zähnen, sondern darin — in den Rillen, in '
            + 'den Zwischenräumen, bis unters Zahnfleisch. Geschluckt hat er '
            + 'ihn nicht. Er hat ihn geatmet, lange, in einem geschlossenen '
            + 'Raum.',
        item: {
          id: 'f2-staubprobe',
          name: 'Staubprobe',
          text: 'Zwei Fingerspitzen voll, in einem Schraubglas. Hell, trocken, '
              + 'unter der Lampe von innen heraus schwach schimmernd. Es fühlt '
              + 'sich durch das Glas hindurch wärmer an als der Raum, und das '
              + 'ist unmöglich.',
          analysis: {
            wait: 3,
            label: 'Prüfung · Staubprobe',
            clue: 'f2-staub-waechst',
            text: 'Die Probe ist im verschlossenen Glas schwerer geworden. Vier '
                + 'Prozent in achtzehn Stunden, ohne Zufuhr von außen, bei '
                + 'gleichbleibender Temperatur. Es gibt keinen Katalogeintrag '
                + 'dafür, in keiner Sammlung der Stadt. Was in seinen Lungen '
                + 'liegt, ist am Wachsen und war es die ganze Zeit.',
          },
        },
      },
      {
        id: 'f2-kleidung', u: 0.583, v: 0.840, r: 0.085,
        label: 'Seine Kleidung',
        detail: 'details/f2-leichenhalle-f2-kleidung.jpg',
        clue: 'f2-lehm',
        text: 'In einer Wanne neben der Rinne. An den Knien und an den '
            + 'Ellenbogen klebt ein rötlicher Lehm, der oben nirgends vorkommt '
            + '— nicht am Kanal, nicht im Werk, nicht in der Siedlung. Der '
            + 'liegt tiefer, als in dieser Stadt gegraben wird.',
      },
      {
        id: 'f2-faecher-lh', u: 0.844, v: 0.466, r: 0.095,
        label: 'Fächerwand',
        detail: 'details/f2-leichenhalle-f2-faecher-lh.jpg',
        text: 'Drei Reihen Edelstahl. In diesem Winter sind sie voller als '
            + 'sonst, und die Karten in den Haltern nennen viermal dieselbe '
            + 'Todesursache: Erschöpfung, Kälte, unbekannt. Alle vier aus '
            + 'Sektor 11.',
      },
      {
        id: 'f2-zum-archiv', u: 0.400, v: 0.930, r: 0.080,
        kind: 'exit', dir: 'out', goto: 'f2-archiv',
        label: 'Weiter in den Gang',
        text: 'Derselbe Kellergang, zwanzig Schritte weiter. Wo die Toten '
            + 'aufhören, fangen die Papiere an.',
      },
    ],
  },

  /* ====================================================================== */
  'f2-archiv': {
    id: 'f2-archiv',
    district: 'f2-praesidium',
    name: 'Archiv',
    sector: 'Sektor 2 · Präsidium',
    kind: 'interior',
    backdrop: 'archiv-backdrop',
    spots: [
      {
        id: 'f2-riss-regal', u: 0.360, v: 0.448, r: 0.095,
        label: 'Gasse der Grubenrisse',
        detail: 'details/f2-archiv-f2-riss-regal.jpg',
        text: 'Lagepläne, Kanalrisse, Bohrprotokolle — die einzige Gasse, die '
            + 'aufgekurbelt ist. Die Rolle für Sektor 11 liegt quer oben auf, '
            + 'weil sie zuletzt jemand herausgezogen und nicht zurückgeschoben '
            + 'hat.',
        item: {
          id: 'f2-riss',
          name: 'Grubenriss Sektor 11',
          text: 'Ein Lageplan des Klärwerks, gestempelt vor sechzehn Monaten. '
              + 'Drei Becken, Halle, Büro, Siedlung. Am unteren Rand ist das '
              + 'Papier nicht gerissen, sondern geschnitten — mit einem Lineal, '
              + 'sauber, und danach neu umrandet.',
          analysis: {
            wait: 2,
            label: 'Abgleich · Grubenriss',
            clue: 'f2-schacht',
            text: 'Der abgeschnittene Streifen liegt in der Rolle darunter, '
                + 'weil niemand ihn vernichtet hat. Er zeigt ein viertes Becken '
                + 'und darunter einen Schacht: Teufe vierhundert Meter, '
                + 'begonnen vor vierzehn Monaten, kein Bauträger, kein Zweck. '
                + 'In keinem gültigen Plan dieser Stadt steht er. Unter dem '
                + 'Werk ist gegraben worden, und zwar tiefer als je zuvor.',
          },
        },
      },
      {
        id: 'f2-ausleihe', u: 0.498, v: 0.550, r: 0.080,
        label: 'Ausleihbuch',
        detail: 'details/f2-archiv-f2-ausleihe.jpg',
        erscheint: { clue: 'f2-schacht' },
        clue: 'f2-kuratorium-akte',
        text: 'Wer einen Riss beschneidet, hat ihn vorher geholt. Im Ausleihbuch '
            + 'steht die Tiefbauakte Sektor 11 seit vierzehn Monaten als '
            + 'entnommen — nicht von einem Amt, das baut, und nicht von einem, '
            + 'das prüft. Entnommen hat sie das Kuratorium für Tiefbau und '
            + 'Vorsorge, und zurückgegeben hat sie niemand.',
      },
      {
        id: 'f2-totenscheine', u: 0.675, v: 0.735, r: 0.095,
        label: 'Rollwagen mit Altakten',
        detail: 'details/archiv-wagen.jpg',
        text: 'Vier Kisten, schief gestapelt. Ganz oben liegen elf Totenscheine '
            + 'aus dem vorigen Winter, dieselbe Unterschrift, dieselbe Woche. '
            + 'Auf jedem steht eine Kostenstelle, und es ist nicht die des '
            + 'Meldeamts. Es ist dieselbe, die auch den Schacht bezahlt.',
        clue: 'f2-kostenstelle',
      },
      {
        id: 'f2-handrad-a', u: 0.092, v: 0.457, r: 0.075,
        label: 'Handrad',
        detail: 'details/archiv-handrad.jpg',
        text: 'Die Kurbel der vordersten Gasse ist kalt und blank, die daneben '
            + 'liegen unter Staub. Von hundert Metern Regal wird ein Meter '
            + 'benutzt, und den benutzt jemand oft.',
      },
      {
        id: 'f2-archiv-raus', u: 0.870, v: 0.900, r: 0.080,
        kind: 'exit', dir: 'back', goto: 'f2-leichenhalle',
        label: 'Zurück in die Leichenhalle',
        text: '',
      },
    ],
  },

  /* ======================================================================
     SEKTOR 4 · PEGELNETZ — was er gehoert hat
     ====================================================================== */
  'f2-pegel': {
    id: 'f2-pegel',
    district: 'f2-netz',
    name: 'Pegelstation',
    sector: 'Sektor 4 · Pegelnetz',
    kind: 'interior',
    backdrop: 'f2-pegel-backdrop',
    spots: [
      {
        id: 'f2-waerterin', u: 0.852, v: 0.470, r: 0.060, kind: 'person',
        label: 'Frau am Fenster',
        detail: 'details/f2-waerterin.jpg',
        text: 'Sie steht am Fenster und sieht auf den Kanal hinunter, obwohl auf '
            + 'dem Kanal seit Wochen nichts passiert. Auf dem Tisch hinter ihr '
            + 'liegen zwei Dienstpläne: einer für diese Woche, einer für die '
            + 'vorige, und auf beiden ist derselbe Name durchgestrichen.',
      },
      {
        id: 'f2-bandmaschine', u: 0.140, v: 0.655, r: 0.085,
        label: 'Bandmaschine',
        detail: 'details/f2-pegel-f2-bandmaschine.jpg',
        clue: 'f2-der-ton',
        text: 'Ein Aufnahmegerät mit zwei Spulen, angeschlossen an ein Band, das '
            + 'das Flutwarnnetz freihalten muss — dort darf nichts liegen, damit '
            + 'im Ernstfall jeder durchkommt. Seit elf Nächten liegt dort etwas: '
            + 'kein Rauschen, kein Funkspruch. Stimmen. Viele, gleichzeitig, und '
            + 'kein einziges Wort.',
      },
      {
        id: 'f2-dienstpult', u: 0.490, v: 0.810, r: 0.090,
        label: 'Dienstpult',
        detail: 'details/f2-pegel-f2-dienstpult.jpg',
        text: 'Aufgeräumt bis auf das Dienstbuch, das offen liegt und auf dem '
            + 'ein Bleistift quer über den Bund gelegt ist — so legt man ihn '
            + 'hin, wenn man gleich wiederkommt.',
        item: {
          id: 'f2-dienstbuch',
          name: 'Dienstbuch der Pegelstation',
          text: 'Elf Nächte hintereinander dieselbe Eintragung, jedes Mal ein '
              + 'wenig genauer: Uhrzeit, Dauer, Peilung. Die Peilung ändert '
              + 'sich nie. In der letzten Zeile steht keine Dauer mehr, nur eine '
              + 'Uhrzeit, und die ist unterstrichen.',
          analysis: {
            wait: 2,
            label: 'Prüfung · Dienstbuch',
            clue: 'f2-elf-naechte',
            text: 'Elf Nächte, immer zwischen halb vier und fünf, immer '
                + 'dieselbe Peilung: Sektor 11. Zweimal hat er die Sache nach '
                + 'oben gemeldet; beide Meldungen fehlen im Eingangsbuch der '
                + 'Aufsicht, obwohl er ihre Nummern notiert hat. Die letzte '
                + 'Zeile ist keine Meldung mehr, sondern eine Verabredung mit '
                + 'sich selbst: 4:41.',
          },
        },
      },
      {
        id: 'f2-schaltschrank', u: 0.297, v: 0.430, r: 0.080,
        label: 'Schaltschrank',
        detail: 'details/f2-pegel-f2-schaltschrank.jpg',
        text: 'Reihen von Kippschaltern für Pegel, die er alle namentlich '
            + 'kannte. Einer ist mit Isolierband abgeklebt, damit ihn niemand '
            + 'aus Versehen umlegt — der für das freizuhaltende Band. Das Band '
            + 'stand seit elf Nächten auf Aufnahme.',
      },
      {
        id: 'f2-spind', u: 0.677, v: 0.560, r: 0.075,
        label: 'Sein Spind',
        detail: 'details/f2-pegel-f2-spind.jpg',
        text: 'Offen, weil das Schloss fehlt. Ein Mantel, ein Paar trockene '
            + 'Schuhe, eine Wolldecke, die nach draußen riecht. Was fehlt, sind '
            + 'Bänder: In dem Fach, in dem ein Wärter seine Aufnahmen stapelt, '
            + 'liegt nur der Staubabdruck von zehn Schachteln.',
      },
      {
        id: 'f2-aufs-dach', u: 0.497, v: 0.300, r: 0.080,
        kind: 'exit', dir: 'up', goto: 'f2-pegeldach',
        label: 'Aufs Dach',
        text: 'Eine Eisenleiter zu einer Luke, die nicht verriegelt ist. Auf den '
            + 'Sprossen liegt Schnee, der von oben hereingeweht ist, und in dem '
            + 'Schnee sind Tritte.',
      },
    ],
  },

  /* ====================================================================== */
  'f2-pegeldach': {
    id: 'f2-pegeldach',
    district: 'f2-netz',
    name: 'Dach der Pegelstation',
    sector: 'Sektor 4 · Pegelnetz',
    kind: 'street',
    backdrop: 'f2-pegeldach-backdrop',
    spots: [
      {
        id: 'f2-richtantenne', u: 0.500, v: 0.180, r: 0.095,
        label: 'Richtantenne',
        detail: 'details/f2-pegeldach-f2-richtantenne.jpg',
        clue: 'f2-peilung',
        text: 'Sie gehört auf die Leitstelle ausgerichtet, damit die Station '
            + 'gehört wird. Sie zeigt woanders hin: weg von der Stadt, über den '
            + 'Kanal, und dabei nach unten geneigt, so weit es die Halterung '
            + 'zulässt. Er wollte nicht senden. Er wollte hören, und zwar aus '
            + 'dem Boden.',
      },
      {
        id: 'f2-gegengewicht', u: 0.550, v: 0.603, r: 0.085,
        label: 'Kasten am Mastfuß',
        detail: 'details/f2-pegeldach-f2-gegengewicht.jpg',
        erscheint: { clue: 'f2-er-hat-versteckt' },
        text: 'Der Betonkasten, der den Mast hält, hat einen Deckel, und der '
            + 'Deckel ist an einer Ecke frei gekratzt. Darunter, in Öltuch, ein '
            + 'Stapel Schachteln. Neun sind leer. In der zehnten liegt ein Band.',
        item: {
          id: 'f2-band',
          name: 'Tonband aus dem Mastfuß',
          text: 'Beschriftet ist nur die Nacht. Es ist die letzte, die er '
              + 'aufgenommen hat, und es ist das einzige Band, das er nicht in '
              + 'die Station gebracht hat.',
          analysis: {
            wait: 3,
            label: 'Auswertung · Tonband',
            clue: 'f2-zehn-stimmen',
            text: 'Kein Wort, keine Sprache, kein Gerät: Stimmen, die einen '
                + 'einzigen Ton halten und ihn alle vierzig Sekunden gemeinsam '
                + 'wechseln. Zählbar sind neun. Um 4:41 kommt eine zehnte dazu, '
                + 'eine halbe Oktave tiefer und um einen Atemzug versetzt, und '
                + 'von da an sind es zehn bis zum Bandende. Neun Mann waren in '
                + 'dieser Nacht eingeteilt.',
          },
        },
      },
      {
        id: 'f2-klappstuhl', u: 0.155, v: 0.567, r: 0.090,
        label: 'Klappstuhl unter der Blende',
        detail: 'details/f2-pegeldach-f2-klappstuhl.jpg',
        text: 'Ein Stuhl, eine Kanne, eine Decke, alles unter ein Blech '
            + 'geschoben, das den Schnee abhält. Elf Nächte hat hier jemand '
            + 'gesessen, allein, freiwillig, ohne dass es in einem Dienstplan '
            + 'steht. Die Kanne ist leer und ausgespült.',
      },
      {
        id: 'f2-stadtblick', u: 0.857, v: 0.237, r: 0.085,
        label: 'Blick über den Kanal',
        detail: 'details/f2-pegeldach-f2-stadtblick.jpg',
        text: 'Der halbe Sektor liegt im Dunkeln, weil dort nichts mehr läuft. '
            + 'Ein einziges Licht steht in der Fläche und bewegt sich nicht: der '
            + 'Flutlichtmast eines Werks, das seit vier Monaten geschlossen ist.',
      },
      {
        id: 'f2-dach-runter', u: 0.547, v: 0.912, r: 0.080,
        kind: 'exit', dir: 'down', goto: 'f2-pegel',
        label: 'Zurück hinunter',
        text: '',
      },
    ],
  },

  /* ======================================================================
     SEKTOR 6 · WERKSSIEDLUNG — wer nachts gearbeitet hat
     ====================================================================== */
  'f2-siedlung': {
    id: 'f2-siedlung',
    district: 'f2-zeile',
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
           nichts zeigt, ist schlimmer als gar keine. */
        id: 'f2-dunkles-fenster', u: 0.885, v: 0.310, r: 0.080,
        label: 'Das dunkle Fenster',
        detail: 'details/f2-siedlung-f2-dunkles-fenster.jpg',
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
            + 'ausgeschlagen mit Decken, die nicht dazugehören, und es sind zu '
            + 'viele Decken für Ware.',
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
      {
        id: 'f2-zur-baracke', u: 0.725, v: 0.718, r: 0.080,
        kind: 'exit', dir: 'left', goto: 'f2-baracke',
        requires: { clue: 'f2-die-kranken' },
        lockText: 'Hinter der letzten Hausreihe steht eine Baracke ohne Fenster '
                + 'zur Straße. Ein Geräteschuppen, ein Kohlenlager, irgendetwas '
                + '— solange dir niemand gesagt hat, was drin ist, gehst du '
                + 'daran vorbei wie an jedem anderen Blechdach.',
        label: 'Die Baracke am Ende der Zeile',
        text: 'Kein Fenster zur Straße, aber ein Ofenrohr, das raucht, und ein '
            + 'Weg zur Tür, der ausgetreten ist wie kein zweiter hier.',
      },
    ],
  },

  /* ====================================================================== */
  'f2-haus': {
    id: 'f2-haus',
    district: 'f2-zeile',
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
            + 'groß und riechen nach Öl. Er hebt sie auf für zwei, die sie '
            + 'zuletzt nicht mehr selbst geholt haben.',
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
    district: 'f2-zeile',
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
            clue: 'f2-neun-mann',
            text: 'Dieselbe Hand wie die drei ersetzten Blätter im Schichtbuch. '
                + 'In der Nacht, um die es geht, sind neun Portionen '
                + 'ausgegeben worden — neun Striche, sauber gezählt. Auf der '
                + 'Rückseite steht, wofür der Zettel gedacht war: wie viele '
                + 'einfahren, wie lange sie unten bleiben dürfen und wer sie '
                + 'holt. Unterschrieben mit einem Kürzel, das im Werk nur einer '
                + 'führt.',
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
  'f2-baracke': {
    id: 'f2-baracke',
    district: 'f2-zeile',
    name: 'Die Baracke',
    sector: 'Sektor 6 · Werkssiedlung',
    kind: 'interior',
    backdrop: 'f2-baracke-backdrop',
    spots: [
      {
        id: 'f2-liegen', u: 0.172, v: 0.562, r: 0.110,
        label: 'Die Feldbetten',
        detail: 'details/f2-baracke-f2-liegen.jpg',
        clue: 'f2-die-summenden',
        text: 'Sechs Betten, sechs Männer, alle auf dem Rücken, alle mit '
            + 'offenen Augen. Keiner sieht dich an. Sie summen — denselben Ton, '
            + 'ohne Luft zu holen, wie es niemand kann, und alle sechs wechseln '
            + 'ihn im selben Augenblick. Sie sind nicht bewusstlos. Sie sind '
            + 'beschäftigt.',
      },
      {
        id: 'f2-lautsprecher', u: 0.518, v: 0.119, r: 0.080,
        label: 'Lautsprecher an der Decke',
        detail: 'details/f2-baracke-f2-lautsprecher.jpg',
        clue: 'f2-verbunden',
        text: 'Ein Trichter an einem Bügel, mitten über dem Gang, und daran ein '
            + 'Kabel, das nicht zum Hausnetz geht, sondern im Boden '
            + 'verschwindet. Es kommt von unten. Die sechs summen nicht von '
            + 'selbst — sie antworten.',
      },
      {
        id: 'f2-klemmbretter', u: 0.346, v: 0.742, r: 0.085,
        label: 'Klemmbretter am Fußende',
        detail: 'details/f2-baracke-f2-klemmbretter.jpg',
        text: 'An jedem Bett hängt ein Bogen mit Spalten. Keine Namen, nur '
            + 'Nummern. Und eine Spalte, die es auf keinem Krankenblatt dieser '
            + 'Stadt gibt.',
        item: {
          id: 'f2-blatt',
          name: 'Messbogen aus der Baracke',
          text: 'Zeilen, Uhrzeiten, Werte. Die Spalten heißen Puls, Atmung, '
              + 'Temperatur — und dann eine vierte, in der Minuten stehen: '
              + 'Exposition. Die Zahlen steigen über Wochen. Nach der letzten '
              + 'Zeile jedes Bogens ist das Blatt nicht voll, sondern zu Ende.',
          analysis: {
            wait: 2,
            label: 'Prüfung · Messbogen',
            clue: 'f2-gemessen',
            text: 'Das ist keine Pflege, das ist eine Versuchsreihe. Jeder Bogen '
                + 'führt einen Mann über Wochen, mit steigender Expositionszeit, '
                + 'bis die Werte kippen; danach hört der Bogen auf. Die Vordrucke '
                + 'sind gedruckt, nicht handgemalt — jemand hat sie in Auflage '
                + 'bestellt, bevor der erste Mann hier lag. Und in der Kopfzeile '
                + 'steht dieselbe Kostenstelle wie auf elf Totenscheinen aus dem '
                + 'vorigen Winter.',
          },
        },
      },
      {
        id: 'f2-eimer', u: 0.648, v: 0.801, r: 0.075,
        label: 'Zugebundener Eimer',
        detail: 'details/f2-baracke-f2-eimer.jpg',
        text: 'Neben der Tür, das Tuch mit Draht festgezurrt. Darin derselbe '
            + 'helle Staub, den du in seinem Mund gesehen hast, zwei Handbreit '
            + 'hoch. Der Draht ist neu. Der Eimer steht nicht bereit, um geleert '
            + 'zu werden — er steht bereit, um wieder aufgefüllt zu werden.',
      },
      {
        id: 'f2-ofen-b', u: 0.900, v: 0.794, r: 0.085,
        label: 'Ofen',
        detail: 'details/f2-baracke-f2-ofen-b.jpg',
        text: 'Er wird geheizt, und zwar von jemandem, der zwei- oder dreimal am '
            + 'Tag hereinkommt. Neben dem Ofen steht ein Stuhl mit der Lehne zur '
            + 'Wand und dem Blick auf die Betten. Auf der Sitzfläche liegt ein '
            + 'Buch mit dem Rücken nach oben, aufgeschlagen, seit Stunden.',
      },
      {
        id: 'f2-baracke-raus', u: 0.500, v: 0.930, r: 0.080,
        kind: 'exit', dir: 'out', goto: 'f2-siedlung',
        label: 'Hinaus',
        text: '',
      },
    ],
  },

  /* ======================================================================
     SEKTOR 9 · UNTER DEM WERK — wofuer sie gegraben haben
     ====================================================================== */
  'f2-schachtkopf': {
    id: 'f2-schachtkopf',
    district: 'f2-tiefe',
    name: 'Das vierte Becken',
    sector: 'Sektor 9 · Unter dem Werk',
    kind: 'street',
    backdrop: 'f2-schachtkopf-backdrop',
    spots: [
      {
        id: 'f2-steiger', u: 0.693, v: 0.470, r: 0.060, kind: 'person',
        label: 'Mann an der Winde',
        detail: 'details/f2-steiger.jpg',
        text: 'Er steht an der Winde, wo ein Steiger steht, und hält die Hand '
            + 'am Hebel, obwohl nichts fährt. An seinem Gürtel hängt eine '
            + 'Grubenlampe, die noch warm ist. Er hat dich kommen sehen und ist '
            + 'geblieben, und das ist mehr, als die meisten hier tun.',
      },
      {
        id: 'f2-korb', u: 0.495, v: 0.299, r: 0.095,
        label: 'Förderkorb über dem Loch',
        detail: 'details/f2-schachtkopf-f2-korb.jpg',
        clue: 'f2-fahrt',
        text: 'Mitten im leergepumpten Becken ist der Betonboden aufgestemmt, '
            + 'und über dem Loch steht ein Gerüst mit einem Korb an zwei Seilen. '
            + 'Das ist kein Bauaufzug. Das ist Grubentechnik, und sie ist alt, '
            + 'gebraucht und gut in Schuss.',
      },
      {
        id: 'f2-pressluft', u: 0.193, v: 0.557, r: 0.090,
        label: 'Kompressor',
        detail: 'details/f2-schachtkopf-f2-pressluft.jpg',
        text: 'Ein Preßluftkompressor auf Kufen, daneben ein Schlauch, der über '
            + 'den Beckenrand ins Loch läuft. Der Zähler steht auf einer Zahl, '
            + 'die niemand in vier Monaten erreicht — die erreicht man in vierzehn '
            + 'Monaten, jede Nacht.',
      },
      {
        id: 'f2-abgriff', u: 0.844, v: 0.529, r: 0.080,
        label: 'Kabelabgriff',
        detail: 'details/f2-schachtkopf-f2-abgriff.jpg',
        text: 'Hier endet das Kabel vom Flutlichtmast, in einem Kasten mit vier '
            + 'Abgängen. Drei gehen ins Loch. Der vierte läuft flach unter dem '
            + 'Schnee in Richtung Siedlung, und zwar nicht zu den Häusern, '
            + 'sondern daran vorbei.',
      },
      {
        id: 'f2-stiefel', u: 0.219, v: 0.825, r: 0.095,
        label: 'Reihe Gummistiefel',
        detail: 'details/f2-schachtkopf-f2-stiefel.jpg',
        text: 'Am Beckenrand stehen Stiefel in einer Reihe, Paar an Paar, wie '
            + 'sie hingestellt werden, wenn einer nach der Schicht wieder in '
            + 'seine eigenen Schuhe steigt. Es sind neun Paare. Eines steht '
            + 'seit Tagen falsch herum.',
      },
      {
        id: 'f2-hinab', u: 0.503, v: 0.680, r: 0.085,
        kind: 'exit', dir: 'down', goto: 'f2-stollen',
        label: 'Einfahren',
        text: 'Der Korb ist oben, die Tür offen. Von unten kommt Luft, und sie '
            + 'ist wärmer als die hier.',
      },
    ],
  },

  /* ====================================================================== */
  'f2-stollen': {
    id: 'f2-stollen',
    district: 'f2-tiefe',
    name: 'Der Stollen',
    sector: 'Sektor 9 · Unter dem Werk',
    kind: 'interior',
    backdrop: 'f2-stollen-backdrop',
    spots: [
      {
        id: 'f2-frostringe', u: 0.104, v: 0.230, r: 0.090,
        label: 'Frost an den Wänden',
        detail: 'details/f2-stollen-f2-frostringe.jpg',
        clue: 'f2-frostringe',
        text: 'Vierhundert Meter unter der Stadt ist es wärmer, nicht kälter — '
            + 'trotzdem steht der Reif an den Wänden. Aber nicht gleichmäßig: in '
            + 'Ringen, einer hinter dem anderen, und die Abstände werden nach '
            + 'vorn hin kürzer. Der Frost hat einen Mittelpunkt, und der liegt '
            + 'nicht hinter dir.',
      },
      {
        id: 'f2-karren', u: 0.203, v: 0.750, r: 0.100,
        label: 'Karren mit Bohrkernen',
        detail: 'details/f2-stollen-f2-karren.jpg',
        text: 'Ein Lorenkarren, halb voll mit Bohrkernen in Kästen, geordnet '
            + 'nach Teufe. Die obersten sind Fels wie überall. Die untersten '
            + 'sind es nicht.',
        item: {
          id: 'f2-bohrkern',
          name: 'Bohrkern aus der letzten Kiste',
          text: 'Fingerdick, handlang, hell, und an der Bruchkante nicht '
              + 'körnig, sondern gefasert. Er ist wärmer als der Kasten, in dem '
              + 'er liegt. Er ist wärmer als deine Hand.',
          analysis: {
            wait: 3,
            label: 'Prüfung · Bohrkern',
            clue: 'f2-nicht-von-hier',
            text: 'Der Kern besteht aus demselben Material wie der Staub in '
                + 'seinen Lungen. Er ist nicht gewachsen wie Gestein und nicht '
                + 'abgelagert wie Sediment: Die Fasern laufen alle in eine '
                + 'Richtung, über die ganze Länge, wie bei etwas Gezogenem. Auf '
                + 'Schall gibt er einen Ton zurück, den er nicht bekommen hat. '
                + 'In vierhundert Metern Teufe liegt in dieser Stadt Ton, Sand '
                + 'und Fels. Das hier gehört in keine dieser Schichten.',
          },
        },
      },
      {
        id: 'f2-kritzel', u: 0.909, v: 0.565, r: 0.085,
        label: 'Zeichen an der Wand',
        detail: 'details/f2-stollen-f2-kritzel.jpg',
        text: 'In den Fels geritzt, auf Schulterhöhe, über zwanzig Meter: '
            + 'Striche in Fünferblöcken, wie in dem Haus in der Siedlung, und '
            + 'zwischen den Blöcken Namen. Zwölf. Bei acht von ihnen ist der '
            + 'letzte Strich nicht mehr zu Ende geführt.',
        clue: 'f2-zwoelf-namen',
      },
      {
        id: 'f2-wetterrohr', u: 0.677, v: 0.185, r: 0.085,
        label: 'Wetterrohr',
        detail: 'details/f2-stollen-f2-wetterrohr.jpg',
        text: 'Ein Blechrohr unter der Firste, mit Draht aufgehängt, das die '
            + 'Luft von oben hereinbringt. Alle paar Meter ist ein Loch '
            + 'hineingeschlagen — grob, mit dem Pickel. Wer hier gearbeitet hat, '
            + 'hat sich die Luft genommen, wo er sie brauchte, statt zu warten, '
            + 'bis sie vorn ankommt.',
      },
      {
        id: 'f2-zum-messstand', u: 0.400, v: 0.540, r: 0.085,
        kind: 'exit', dir: 'left', goto: 'f2-messstand',
        label: 'Verschlag mit Licht',
        text: 'Eine Nische, mit Brettern verschalt und mit Decken verhängt. '
            + 'Dahinter brennt Licht, und es surrt etwas.',
      },
      {
        id: 'f2-zur-kammer', u: 0.600, v: 0.560, r: 0.090,
        kind: 'exit', dir: 'forward', goto: 'f2-kammer',
        requires: { clue: 'f2-staub-waechst' },
        lockText: 'Vor dir wird der Stollen weiter und heller, ohne dass dort '
                + 'eine Lampe hängt. Solange du nicht weißt, was der Mann in der '
                + 'Leichenhalle eingeatmet hat, gehst du da nicht hinein.',
        label: 'Weiter nach vorn',
        text: 'Der Stollen wird weiter, und das Licht kommt nicht mehr von den '
            + 'Lampen hinter dir.',
      },
      {
        id: 'f2-ausfahren', u: 0.500, v: 0.930, r: 0.080,
        kind: 'exit', dir: 'back', goto: 'f2-schachtkopf',
        label: 'Ausfahren',
        text: '',
      },
    ],
  },

  /* ====================================================================== */
  'f2-messstand': {
    id: 'f2-messstand',
    district: 'f2-tiefe',
    name: 'Der Messstand',
    sector: 'Sektor 9 · Unter dem Werk',
    kind: 'interior',
    backdrop: 'f2-messstand-backdrop',
    spots: [
      {
        id: 'f2-mikrofone', u: 0.781, v: 0.465, r: 0.100,
        label: 'Wand aus Mikrofonen',
        detail: 'details/f2-messstand-f2-mikrofone.jpg',
        clue: 'f2-aufgezeichnet',
        text: 'Vierzehn Mikrofone auf Stativen, alle in dieselbe Richtung '
            + 'gedreht, alle nach vorn. Kein einziges zeigt auf den Platz, an '
            + 'dem ein Mensch stehen würde. Was hier aufgenommen wurde, sollte '
            + 'nicht von einem Menschen kommen.',
      },
      {
        id: 'f2-schreiber', u: 0.292, v: 0.555, r: 0.095,
        label: 'Schreiber',
        detail: 'details/f2-messstand-f2-schreiber.jpg',
        text: 'Ein Papierschreiber mit sechs Federn, die Rolle läuft noch und '
            + 'liegt in Schlaufen auf dem Boden. Fünf Federn zeichnen ruhige '
            + 'Linien. Die sechste zeichnet etwas, das sich alle vierzig '
            + 'Sekunden wiederholt, und sie tut es seit vierzehn Monaten.',
      },
      {
        id: 'f2-pult', u: 0.560, v: 0.520, r: 0.085,
        label: 'Reglerpult',
        detail: 'details/f2-messstand-f2-pult.jpg',
        text: 'Drehregler in zwei Reihen, jeder mit einer Skala, alle bis auf '
            + 'einen auf Null. Der eine steht weit oben, und an ihm klebt ein '
            + 'Streifen Papier mit einer Bleistiftzahl, die mehrfach '
            + 'durchgestrichen und höher gesetzt worden ist.',
      },
      {
        id: 'f2-kasten', u: 0.503, v: 0.750, r: 0.080,
        label: 'Stahlkasten unter dem Pult',
        detail: 'details/f2-messstand-f2-kasten.jpg',
        text: 'Verschlossen, aber die Scharniere sitzen außen und sind alt. '
            + 'Darin liegen Vordrucke, Durchschläge und ein Ordner mit '
            + 'Laufzetteln — die Verwaltung eines Betriebs, den es nicht gibt, '
            + 'sauber geführt bis zur letzten Nacht.',
        item: {
          id: 'f2-protokoll',
          name: 'Laufzettel aus dem Stahlkasten',
          text: 'Der oberste ist zwei Tage alt. Er ist kein Bericht, sondern '
              + 'eine Freigabe: eine Nummer, eine Uhrzeit, eine Dauer, und '
              + 'darunter zwei Zeilen, die von einer Schreibmaschine stammen und '
              + 'nicht von der Hand, die sonst alles hier schreibt.',
          analysis: {
            wait: 2,
            label: 'Prüfung · Laufzettel',
            clue: 'f2-freigabe',
            text: 'Die Freigabe gilt für einen Abstieg in derselben Nacht, um '
                + '4:20, Dauer offen. Sie nennt den Mann nicht beim Namen, '
                + 'sondern bei einer Ausweisnummer: der des Wärters aus dem '
                + 'Flutwarnnetz. Und sie nennt den Grund. Es steht da als das, '
                + 'was es ist — erster registrierter Proband, lebend, zum '
                + 'Vergleich gegen die bisherige Reihe. Unterschrieben ist sie '
                + 'mit einem Kürzel, das kein Werksmann führt: dem des Kurators '
                + 'für Tiefbau und Vorsorge.',
          },
        },
      },
      {
        id: 'f2-decken', u: 0.085, v: 0.470, r: 0.080,
        label: 'Wolldecken am Verschlag',
        detail: 'details/f2-messstand-f2-decken.jpg',
        text: 'Übereinander an die Bretter genagelt, drei Lagen tief, und an '
            + 'der Innenseite eingedrückt in Kopfhöhe. Sie hängen dort nicht '
            + 'gegen die Kälte. Sie hängen dort gegen den Ton.',
      },
      {
        id: 'f2-messstand-raus', u: 0.455, v: 0.370, r: 0.070,
        kind: 'exit', dir: 'out', goto: 'f2-stollen',
        label: 'Zurück in den Stollen',
        text: '',
      },
    ],
  },

  /* ====================================================================== */
  'f2-kammer': {
    id: 'f2-kammer',
    district: 'f2-tiefe',
    name: 'Die Kammer',
    sector: 'Sektor 9 · Unter dem Werk',
    kind: 'interior',
    backdrop: 'f2-kammer-backdrop',
    spots: [
      {
        id: 'f2-masse', u: 0.339, v: 0.395, r: 0.105,
        label: 'Das, was im Fels steht',
        detail: 'details/f2-kammer-f2-masse.jpg',
        clue: 'f2-der-fund',
        text: 'Es wächst aus der Wand heraus und in den Raum hinein, hell, '
            + 'gerippt, durchscheinend, mannshoch und darüber. Es gibt Licht ab '
            + 'und keine Wärme. Es wirft keinen Schatten, wo einer sein müsste. '
            + 'Es bewegt sich nicht, und trotzdem ist es an dieser Stelle in '
            + 'vierzehn Monaten breiter geworden — die alten Kerben liegen jetzt '
            + 'weiter innen als damals. Es gehört nicht in diese Stadt und in '
            + 'keine, die du kennst.',
      },
      {
        id: 'f2-kerben', u: 0.500, v: 0.591, r: 0.085,
        label: 'Kerben',
        detail: 'details/f2-kammer-f2-kerben.jpg',
        text: 'Aus der Flanke sind Stücke herausgeschnitten, sauber, mit '
            + 'gleichem Abstand, in Reihen wie an einem Feld. Die Schnitte '
            + 'heilen: Die ältesten sind fast zugewachsen, die jüngsten offen. '
            + 'Was man hier abnimmt, holt es sich zurück.',
      },
      {
        id: 'f2-ring', u: 0.469, v: 0.873, r: 0.095,
        label: 'Ring im Staub',
        detail: 'details/f2-kammer-f2-ring.jpg',
        clue: 'f2-der-ring',
        text: 'Auf dem Boden liegt der helle Staub knöcheltief, und darin steht '
            + 'ein Ring aus Fußabdrücken um die Masse herum — dicht an dicht, '
            + 'immer wieder ausgetreten, alle mit den Spitzen nach innen. Hier '
            + 'haben Männer gestanden, nicht gearbeitet. Neun passen in den '
            + 'Ring, wenn sie sich an den Schultern berühren.',
      },
      {
        id: 'f2-mikrofon-k', u: 0.818, v: 0.613, r: 0.075,
        label: 'Einzelnes Mikrofon',
        detail: 'details/f2-kammer-f2-mikrofon-k.jpg',
        text: 'Auf einem Stativ, dicht vor der Masse, mit einem Kabel, das nach '
            + 'hinten in den Stollen läuft. Es ist das einzige Ding hier, das '
            + 'nicht bestaubt ist. Jemand wischt es ab. Jeden Tag.',
      },
      {
        id: 'f2-kammer-raus', u: 0.865, v: 0.417, r: 0.080,
        kind: 'exit', dir: 'back', goto: 'f2-stollen',
        label: 'Zurück',
        text: '',
      },
    ],
  },

  /* ======================================================================
     SEKTOR 1 · KURATORIUM — wer es angeordnet hat
     ====================================================================== */
  'f2-vorzimmer': {
    id: 'f2-vorzimmer',
    district: 'f2-kuratorium',
    name: 'Vorzimmer',
    sector: 'Sektor 1 · Kuratorium',
    kind: 'interior',
    backdrop: 'f2-vorzimmer-backdrop',
    spots: [
      {
        id: 'f2-adjutant', u: 0.331, v: 0.430, r: 0.060, kind: 'person',
        label: 'Mann am Schreibtisch',
        detail: 'details/f2-adjutant.jpg',
        text: 'Er steht neben dem Schreibtisch statt dahinter, mit einer Mappe '
            + 'unter dem Arm, und hat offensichtlich gerade beschlossen, sitzen '
            + 'zu bleiben, bis du wieder weg bist. Der Anzug ist besser als der '
            + 'Raum.',
      },
      {
        id: 'f2-terminbuch', u: 0.487, v: 0.600, r: 0.060,
        label: 'Terminbuch',
        detail: 'details/f2-vorzimmer-f2-terminbuch.jpg',
        text: 'Aufgeschlagen, mit Bleistift geführt, und die letzten vierzehn '
            + 'Monate zeigen dasselbe Muster: alle elf bis vierzehn Tage ein '
            + 'Eintrag ohne Namen, immer nachts, immer mit demselben Zusatz — '
            + 'einer Uhrzeit und einem Strich. Der letzte Eintrag ist von '
            + 'vorgestern und trägt keinen Strich mehr.',
        clue: 'f2-nachts-hinaus',
      },
      {
        id: 'f2-vitrine', u: 0.880, v: 0.503, r: 0.090,
        label: 'Vitrine',
        detail: 'details/f2-vorzimmer-f2-vitrine.jpg',
        clue: 'f2-vitrine',
        text: 'Ein Glaskasten auf einem Sockel, beleuchtet wie eine Reliquie, '
            + 'und darin liegt auf schwarzem Samt ein Bohrkern. Hell, gefasert, '
            + 'handlang. Es ist derselbe wie unten im Karren, nur poliert — und '
            + 'er liegt hier, wo jeder Besucher ihn sieht und niemand fragt, was '
            + 'er ist.',
      },
      {
        id: 'f2-schrank', u: 0.086, v: 0.606, r: 0.095,
        label: 'Aktenschrank',
        detail: 'details/f2-vorzimmer-f2-schrank.jpg',
        text: 'Vier Schübe, drei mit demselben abgegriffenen Schloss, einer mit '
            + 'einem neuen. Der neue trägt kein Schild. Am Griff ist der Lack '
            + 'an genau einer Stelle durchgewetzt, dort, wo ein Daumen liegt, '
            + 'wenn man in Eile aufschließt.',
      },
      {
        id: 'f2-postmappe', u: 0.593, v: 0.588, r: 0.048,
        label: 'Postmappe',
        detail: 'details/f2-vorzimmer-f2-postmappe.jpg',
        text: 'Ledergebunden, für den Weg in ein anderes Haus. Obenauf liegt '
            + 'eine Anfrage aus einem Spurenlabor nach einem unbekannten '
            + 'mineralischen Staub — eingegangen gestern, beantwortet gestern, '
            + 'von einem Haus, das mit Material nichts zu tun hat.',
      },
      {
        id: 'f2-zum-saal', u: 0.500, v: 0.280, r: 0.085,
        kind: 'exit', dir: 'in', goto: 'f2-saal',
        label: 'Die Flügeltür',
        text: 'Zwei Türen, doppelt so hoch wie nötig, angelehnt. Dahinter ist '
            + 'es hell und sehr still, und trotzdem hört man etwas laufen.',
      },
    ],
  },

  /* ====================================================================== */
  'f2-saal': {
    id: 'f2-saal',
    district: 'f2-kuratorium',
    name: 'Sitzungssaal',
    sector: 'Sektor 1 · Kuratorium',
    kind: 'interior',
    backdrop: 'f2-saal-backdrop',
    spots: [
      {
        id: 'f2-kurator', u: 0.906, v: 0.490, r: 0.060, kind: 'person',
        label: 'Mann am Fenster',
        detail: 'details/f2-kurator.jpg',
        text: 'Er steht am Panoramafenster, die Hände auf dem Rücken, und sieht '
            + 'auf eine Stadt hinunter, die unter dem Schnee liegt wie etwas, '
            + 'das man zugedeckt hat. Er hat sich nicht umgedreht, als du '
            + 'hereinkamst, aber er hat aufgehört, sich zu bewegen.',
      },
      {
        id: 'f2-tonband', u: 0.484, v: 0.587, r: 0.085,
        label: 'Bandmaschine auf dem Tisch',
        detail: 'details/f2-saal-f2-tonband.jpg',
        clue: 'f2-er-hoert-mit',
        text: 'Mitten auf dem Sitzungstisch, angeschlossen, laufend, mit dem '
            + 'Lautsprecher auf Zimmerlautstärke. Es ist derselbe Ton wie in der '
            + 'Baracke und derselbe wie auf dem Band aus dem Mastfuß. Er hört '
            + 'ihn sich an. Nicht einmal, um zu prüfen — daneben liegt ein '
            + 'Stapel Bänder, und der Sessel steht davor.',
      },
      {
        id: 'f2-schnittzeichnung', u: 0.161, v: 0.375, r: 0.115,
        label: 'Schnittzeichnung an der Wand',
        detail: 'details/f2-saal-f2-schnittzeichnung.jpg',
        clue: 'f2-modell',
        text: 'Zwei Meter breit, gerahmt, und sie zeigt nicht die Stadt, sondern '
            + 'was unter ihr liegt: Kanäle, Schichten, Teufen — und ganz unten, '
            + 'sorgfältig schraffiert, ein Körper im Fels, um den herum alles '
            + 'andere gezeichnet ist. Das Blatt ist vierzehn Monate alt. Die '
            + 'Schraffur ist mehrfach erweitert worden, mit einem anderen Stift.',
      },
      {
        id: 'f2-protokolle', u: 0.156, v: 0.832, r: 0.095,
        label: 'Sitzungsprotokolle',
        detail: 'details/f2-saal-f2-protokolle.jpg',
        text: 'Ein Stapel Mappen am Kopfende, in Leder, mit Jahreszahlen. Die '
            + 'letzten vierzehn Monate sind dünner als die davor, und in ihnen '
            + 'ist keine Rede von Tiefbau. Es geht um Zuteilung: wie viele, wie '
            + 'lange, wie oft — und darum, dass Zahlen aus der bisherigen Reihe '
            + '„nicht vergleichbar" seien.',
      },
      {
        id: 'f2-fenster-s', u: 0.729, v: 0.385, r: 0.085,
        label: 'Panoramafenster',
        detail: 'details/f2-saal-f2-fenster-s.jpg',
        text: 'Von hier oben sieht man den halben Sektor 11, und man sieht das '
            + 'eine Licht, das dort noch brennt. Es steht genau in der Mitte der '
            + 'Scheibe. Wer an diesem Fenster steht, sieht als Erstes den '
            + 'Flutlichtmast eines Werks, das geschlossen ist.',
      },
      {
        id: 'f2-saal-raus', u: 0.500, v: 0.930, r: 0.080,
        kind: 'exit', dir: 'out', goto: 'f2-vorzimmer',
        label: 'Hinaus',
        text: '',
      },
    ],
  },

  /* ======================================================================
     SEKTOR 7 · ZUHAUSE
     Dieselbe Wohnung wie in Fall 1 — dieselbe Platte, dieselbe Pinnwand.
     ====================================================================== */
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
      {
        /* Erscheint erst, wenn man weiss, was auf dem Band liegt. Vorher ist
           es ein Radio. */
        id: 'f2-radio', u: 0.640, v: 0.640, r: 0.075,
        label: 'Radio',
        detail: 'details/f2-wohnung-f2-radio.jpg',
        erscheint: { clue: 'f2-der-ton' },
        text: 'Es steht seit Jahren auf demselben Sender und läuft leise, damit '
            + 'die Wohnung nicht so leer ist. Zwischen zwei und fünf zieht es '
            + 'ab und zu weg, und dann liegt darunter etwas anderes: derselbe '
            + 'gehaltene Ton, ganz weit hinten. Du hast es für die Leitung '
            + 'gehalten. Vier Nächte lang.',
      },
    ],
  },
};
