/**
 * FALL 3 — „Das Nulllicht".
 *
 * Einundzwanzig vollständig neue Orte in sieben anfliegbaren Sektoren. Jeder
 * Jeder Ort hat eine eigene, eigens erzeugte Platte. Die fremde Technik ist
 * als schwarzes Glas mit innerem Cyanlicht wiedererkennbar und wird im Verlauf
 * vom Fundstück zur ganzen Maschine.
 */

export const ORTE = {
  /* ====================================================================
     WOLKENHAFEN
     ==================================================================== */
  'f3-flugdeck': {
    id: 'f3-flugdeck', district: 'f3-wolkenhafen', name: 'Flugdeck 9',
    sector: 'Sektor 13 · Wolkenhafen', kind: 'street', backdrop: 'f3-flugdeck-backdrop',
    spots: [
      {
        id: 'f3-gondel', u: 0.69, v: 0.48, r: 0.12, label: 'Versiegelte Gondel', clue: 'f3-nullbrand',
        text: 'Vale sitzt aufrecht hinter beschlagenem Glas. Keine Wunde, kein Kampf. Auf der Scheibe steht sein Schatten heller als der Dampf, als hätte etwas nicht den Körper, sondern den letzten Gedanken eingebrannt.',
      },
      {
        id: 'f3-scherbe', u: 0.22, v: 0.69, r: 0.10, label: 'Schwarzes Glas im Frachtsockel',
        text: 'Kein Kabel, keine Naht. Cyanfarbene Linien treiben unter der Oberfläche und sammeln sich auf der Seite, auf der du stehst.',
        item: {
          id: 'f3-glasscherbe', name: 'Scherbe aus schwarzem Glas',
          text: 'Faustgroß, nahtlos und trotz des Regens trocken. Im Inneren verschieben sich Lichtadern, wenn du dich an etwas erinnerst.',
          analysis: {
            wait: 2, label: 'Materialprüfung · Schwarzes Glas', clue: 'f3-nicht-menschlich',
            text: 'Keine bekannte Legierung, kein Kristallgitter, keine Bearbeitungsspur. Die inneren Bahnen bilden für 0,8 Sekunden das Aktivitätsmuster der Person nach, die das Stück berührt. Das Material speichert neuronale Zustände und ist nicht menschlicher Fertigung.',
          },
        },
      },
      {
        id: 'f3-siegel', u: 0.35, v: 0.72, r: 0.075, label: 'Abgerissenes Frachtsiegel',
        text: 'Die Nummer ist abgeschliffen, aber im weichen Metall blieb der Gegenstempel stehen: ein Bergungsdock, das seit zwölf Jahren unter Wasser liegt.',
        item: {
          id: 'f3-frachtsiegel', name: 'Frachtsiegel ohne Nummer',
          text: 'Der Gegenstempel ist älter als die aktuelle Hafenordnung. Jemand hat nur die sichtbare Seite bereinigt.',
          analysis: {
            wait: 2, label: 'Abgleich · Frachtsiegel', clue: 'f3-werftspur',
            text: 'Der Gegenstempel gehört zur Versunkenen Werft in Sektor 19. Dort wurden in den letzten sechs Wochen zwölf Bergungskisten ausgeführt — alle mit Ziel „Kontinuität", alle ohne Inhaltsangabe.',
          },
        },
      },
      {
        id: 'f3-zum-zoll', u: 0.88, v: 0.54, r: 0.08, kind: 'exit', dir: 'in', goto: 'f3-zollgang',
        label: 'Zollkorridor', text: 'Hinter der Gondel führt ein gläserner Gang zur Abfertigung. Das Licht darin flackert im Takt des schwarzen Kerns.',
      },
    ],
  },
  'f3-zollgang': {
    id: 'f3-zollgang', district: 'f3-wolkenhafen', name: 'Zollkorridor',
    sector: 'Sektor 13 · Wolkenhafen', kind: 'interior', backdrop: 'f3-zollgang-backdrop',
    spots: [
      {
        id: 'f3-analytikerin', u: 0.72, v: 0.53, r: 0.065, kind: 'lab',
        label: 'Nela Arendt am Probentisch',
        text: 'Der improvisierte Labortisch steht direkt an der Scheibe. Arendt hat die Geräte nicht auf die Gondel, sondern auf das schwarze Glas gerichtet.',
      },
      {
        id: 'f3-manifest', u: 0.43, v: 0.70, r: 0.08, label: 'Durchschlag im Lesegerät',
        text: 'Der offizielle Flug war leer. Unter dem Durchschlag liegt ein zweiter Einzug mit derselben Uhrzeit und einem Ziel, das auf keiner Passagierliste steht.',
        item: {
          id: 'f3-frachtweg', name: 'Verdeckter Frachtdurchschlag',
          text: 'Wolkenhafen, Glasgärten, Institut. Drei Stationen, dieselbe Masse, obwohl an jeder etwas ausgeladen worden sein soll.',
          analysis: {
            wait: 2, label: 'Rekonstruktion · Frachtweg', clue: 'f3-glasroute',
            text: 'Die gelöschte Zwischenlandung lag auf dem Gewächshausdach der Glasgärten. Dort blieb die Fracht sechs Stunden, bevor Vale sie selbst wieder verlud.',
          },
        },
      },
      {
        id: 'f3-schleuse', u: 0.81, v: 0.33, r: 0.075, label: 'Schleusenprotokoll', clue: 'f3-schleuse-manipuliert',
        text: 'Die Gondel meldete „von innen verriegelt“, doch der Befehl kam über die Wartungsleitung des Frachtsockels. Jemand draußen ließ eine leere Kabine so aussehen wie ein verschlossener Raum.',
      },
      {
        id: 'f3-zoll-raus', u: 0.18, v: 0.86, r: 0.08, kind: 'exit', dir: 'out', goto: 'f3-flugdeck', label: 'Zurück aufs Flugdeck', text: '',
      },
      {
        id: 'f3-zum-hangar', u: 0.88, v: 0.76, r: 0.08, kind: 'exit', dir: 'in', goto: 'f3-wrackhangar', label: 'Wartungshangar', text: 'Hinter der Brandschleuse steht die zweite Hälfte der Gondel unter offenem Werkzeug.',
      },
    ],
  },
  'f3-wrackhangar': {
    id: 'f3-wrackhangar', district: 'f3-wolkenhafen', name: 'Wartungshangar',
    sector: 'Sektor 13 · Wolkenhafen', kind: 'interior', backdrop: 'f3-wrackhangar-backdrop',
    spots: [
      {
        id: 'f3-mechaniker', u: 0.66, v: 0.55, r: 0.065, kind: 'person', label: 'Mechaniker an der offenen Verkleidung',
        text: 'Toma Ber hält einen Kabelstrang hoch, dessen abgeschnittene Enden im Takt des Kerns schwach blau werden.',
      },
      {
        id: 'f3-schreiber', u: 0.38, v: 0.68, r: 0.08, label: 'Ausgebauter Flugschreiber',
        text: 'Die letzte Minute ist von einem einzelnen Ton übersteuert. Unter dem Ton läuft etwas weiter, zu regelmäßig für Sprache.',
        item: {
          id: 'f3-flugschreiber', name: 'Flugschreiber der Gondel',
          text: 'Das Gehäuse ist warm. Auf der analogen Sicherung steht ein Signal, das der digitale Speicher gelöscht hat.',
          analysis: {
            wait: 3, label: 'Auswertung · Flugschreiber', clue: 'f3-frequenz',
            text: 'Unter dem Störton liegt eine schmale Frequenz mit wandernder Phase. Die Peilung endet im städtischen Antennenfeld. Eine Schüssel hat das Signal nicht empfangen, sondern beantwortet.',
          },
        },
      },
      {
        id: 'f3-leersockel', u: 0.77, v: 0.42, r: 0.085, label: 'Leerer Kernsocket', clue: 'f3-kernfehlte',
        text: 'Zwischen Navigation und Kabinenstrom sitzt ein neuer Sockel. Seine Halter sind nach innen gebogen: Der Einsatz wurde nicht herausgeschraubt, sondern löste sich selbst aus ihnen.',
      },
      {
        id: 'f3-hangar-raus', u: 0.12, v: 0.85, r: 0.08, kind: 'exit', dir: 'out', goto: 'f3-zollgang', label: 'Zurück zum Zoll', text: '',
      },
    ],
  },

  /* ====================================================================
     UMSPANNMARKT
     ==================================================================== */
  'f3-markt': {
    id: 'f3-markt', district: 'f3-nachtmarkt', name: 'Umspannmarkt',
    sector: 'Sektor 5 · Umspannmarkt', kind: 'street', backdrop: 'f3-nachtmarkt-backdrop',
    spots: [
      {
        id: 'f3-haendlerin', u: 0.24, v: 0.62, r: 0.065, kind: 'person', label: 'Händlerin hinter schwarzem Glas',
        text: 'Sira Mohn hat das einzige Stück auf dem ganzen Markt nicht mit einem Preis versehen. Es leuchtet durch das Tuch.',
      },
      {
        id: 'f3-klinikfaser', u: 0.68, v: 0.69, r: 0.08, label: 'Faser im Gerätehaufen',
        text: 'Zwischen Kabeln liegt eine Einwegfaser für medizinische Hirnscanner. Ihre Kupplung ist von innen schwarz angelaufen.',
        item: {
          id: 'f3-neuralfaser', name: 'Veränderte Neuralfaser',
          text: 'Medizinischer Standardstecker, aber das Ende trägt dieselben wandernden Lichtadern wie die Scherbe.',
          analysis: {
            wait: 2, label: 'Signatur · Neuralfaser', clue: 'f3-kliniksignatur',
            text: 'Die Faser wurde in der Nullklinik kalibriert. Sie enthält sieben übereinanderliegende Patientensignaturen und eine achte, die bis zum physikalischen Ende der Leitung reicht.',
          },
        },
      },
      {
        id: 'f3-trafo', u: 0.52, v: 0.23, r: 0.09, label: 'Transformatoren',
        text: 'Jeder Trafo brummt in einer anderen Tonhöhe. Sobald das schwarze Stück auf dem Stand aufleuchtet, fallen sie für einen Herzschlag auf denselben Ton.',
      },
      {
        id: 'f3-zur-pfandleihe', u: 0.11, v: 0.55, r: 0.08, kind: 'exit', dir: 'in', goto: 'f3-pfandleihe', label: 'Pfandleihe', text: 'Der Stand ist vorne schmal und hinten viel tiefer, als das Dach von außen erlaubt.',
      },
      {
        id: 'f3-zum-kino', u: 0.87, v: 0.66, r: 0.08, kind: 'exit', dir: 'back', goto: 'f3-hofkino', label: 'Hinterhofkino', text: 'Hinter den Marktständen läuft ein Projektor ohne Film.',
      },
    ],
  },
  'f3-pfandleihe': {
    id: 'f3-pfandleihe', district: 'f3-nachtmarkt', name: 'Pfandleihe unter Strom',
    sector: 'Sektor 5 · Umspannmarkt', kind: 'interior', backdrop: 'f3-pfandleihe-backdrop',
    spots: [
      {
        id: 'f3-linse', u: 0.26, v: 0.64, r: 0.095, label: 'Schwarze Linse',
        text: 'In der Linse läuft ein Kinderzimmer. Der Blickwinkel ist zu hoch für ein Kind und zu nah an der Wand für einen Erwachsenen.',
        item: {
          id: 'f3-gedaechtnislinse', name: 'Linse mit fremder Kindheit',
          text: 'Das Bild erscheint nur im Augenwinkel. Wer direkt hineinsieht, erkennt für einen Moment die eigene Hand — zehn Jahre jünger.',
          analysis: {
            wait: 3, label: 'Auslesung · Schwarze Linse', clue: 'f3-erinnerungsspeicher',
            text: 'Die Linse enthält keine Aufnahme. Sie speichert ein vollständiges episodisches Muster: Geruch, Körpergefühl, Angst und einen Standpunkt, den der ursprüngliche Mensch nie eingenommen hat. Das Material kann Erinnerungen auslesen und außerhalb eines Gehirns erhalten.',
          },
        },
      },
      {
        id: 'f3-sieben-etiketten', u: 0.58, v: 0.45, r: 0.08, label: 'Sieben abgelöste Etiketten',
        text: 'Auf allen steht dieselbe Klinikcharge. Die Namen sind verschieden, die Entlassungszeit ist bis auf die Minute gleich.',
      },
      {
        id: 'f3-pfand-raus', u: 0.82, v: 0.84, r: 0.08, kind: 'exit', dir: 'out', goto: 'f3-markt', label: 'Zurück auf den Markt', text: '',
      },
    ],
  },
  'f3-hofkino': {
    id: 'f3-hofkino', district: 'f3-nachtmarkt', name: 'Hinterhofkino',
    sector: 'Sektor 5 · Umspannmarkt', kind: 'interior', backdrop: 'f3-hofkino-backdrop',
    spots: [
      {
        id: 'f3-projektion', u: 0.50, v: 0.38, r: 0.12, label: 'Film ohne Projektor', clue: 'f3-fremde-erinnerung',
        text: 'Eine Küche, ein gedeckter Tisch, eine Frau am Fenster. Die Szene wiederholt sich, aber bei jedem Durchlauf fehlt ein Gegenstand mehr. Am Ende bleibt nur der Blick aus der Ecke, in der niemand stand.',
      },
      {
        id: 'f3-leerer-rahmen', u: 0.72, v: 0.67, r: 0.08, label: 'Leerer Filmrahmen',
        text: 'Kein Film, keine Lampe. Das Bild fällt aus der schwarzen Linse auf die Wand und wird schärfer, wenn jemand im Hof die Augen schließt.',
      },
      {
        id: 'f3-kino-raus', u: 0.15, v: 0.84, r: 0.08, kind: 'exit', dir: 'forward', goto: 'f3-markt', label: 'Zurück auf den Markt', text: '',
      },
    ],
  },

  /* ====================================================================
     GLASGÄRTEN
     ==================================================================== */
  'f3-gewachshausdach': {
    id: 'f3-gewachshausdach', district: 'f3-glasgaerten', name: 'Gewächshausdach',
    sector: 'Sektor 8 · Glasgärten', kind: 'street', backdrop: 'f3-glasgarten-backdrop',
    spots: [
      {
        id: 'f3-botaniker', u: 0.73, v: 0.55, r: 0.065, kind: 'person', label: 'Botaniker vor der Kuppel',
        text: 'Eran Vey steht außerhalb seiner eigenen Kuppel. Hinter ihm drehen sich die Pflanzen langsam mit jedem deiner Schritte.',
      },
      {
        id: 'f3-blaetter', u: 0.68, v: 0.37, r: 0.11, label: 'Laub um den Kern', clue: 'f3-pflanzen-hoeren',
        text: 'Jedes Blatt zeigt auf das cyanfarbene Geflecht. Als du die Hand hebst, laufen die Blattspitzen nacheinander dieselbe Bewegung ab — mit einer Sekunde Abstand.',
      },
      {
        id: 'f3-zur-saatbank', u: 0.40, v: 0.68, r: 0.08, kind: 'exit', dir: 'in', goto: 'f3-saatbank', label: 'Saatgutbank', text: 'Ein niedriger Gang führt unter die Kuppel.',
      },
      {
        id: 'f3-zur-kuehlgalerie', u: 0.18, v: 0.48, r: 0.08, kind: 'exit', dir: 'left', goto: 'f3-kuehlgalerie', label: 'Kühlgalerie', text: 'Zwischen den Kuppeln läuft ein gläserner Steg mit beschlagenen Scheiben.',
      },
    ],
  },
  'f3-saatbank': {
    id: 'f3-saatbank', district: 'f3-glasgaerten', name: 'Saatgutbank',
    sector: 'Sektor 8 · Glasgärten', kind: 'interior', backdrop: 'f3-saatbank-backdrop',
    spots: [
      {
        id: 'f3-wurzelprobe', u: 0.67, v: 0.62, r: 0.085, label: 'Wurzel in der Glasröhre',
        text: 'Die Wurzel hat sich nicht verzweigt. Sie hat ein feines Netz gebaut, das einem Hirnschnitt ähnlicher sieht als einer Pflanze.',
        item: {
          id: 'f3-wurzel', name: 'Wurzel mit Lichtadern',
          text: 'Die Adern leuchten nicht selbst. Sie geben das cyanfarbene Muster des Kerns eine halbe Sekunde später wieder.',
          analysis: {
            wait: 3, label: 'Biologie · Veränderte Wurzel', clue: 'f3-biologische-kopie',
            text: 'Das Gewebe enthält keine fremden Zellen. Es hat seine eigene Struktur nach einem externen neuronalen Muster umgebaut. Die Technologie kopiert Information in lebende Materie, ohne Gene oder Chemie zu verändern.',
          },
        },
      },
      {
        id: 'f3-lieferbuch', u: 0.34, v: 0.70, r: 0.08, label: 'Feuchtes Lieferbuch', clue: 'f3-lieferkette',
        text: 'Drei Lieferungen vom Wolkenhafen, zwei Rücksendungen ans Institut. Bei der letzten steht Vales Name statt einer Frachtfirma.',
      },
      {
        id: 'f3-saat-raus', u: 0.50, v: 0.88, r: 0.08, kind: 'exit', dir: 'out', goto: 'f3-gewachshausdach', label: 'Zurück aufs Dach', text: '',
      },
    ],
  },
  'f3-kuehlgalerie': {
    id: 'f3-kuehlgalerie', district: 'f3-glasgaerten', name: 'Kühlgalerie',
    sector: 'Sektor 8 · Glasgärten', kind: 'interior', backdrop: 'f3-kuehlgalerie-backdrop',
    spots: [
      {
        id: 'f3-prototyp', u: 0.72, v: 0.40, r: 0.10, label: 'Abdruck im Reif', clue: 'f3-prototyp',
        text: 'Ein ringförmiger Gegenstand stand hier lange genug, um den Reif fernzuhalten. Die Halterung hat Schrauben; der Abdruck darin nicht eine einzige gerade Kante.',
      },
      {
        id: 'f3-kameraspule', u: 0.25, v: 0.71, r: 0.08, label: 'Spule im Kühlkanal',
        text: 'Ungeschnittenes Überwachungsmaterial. Jemand hat die Kamera abgenommen, aber vergessen, dass diese Anlage analog puffert.',
        item: {
          id: 'f3-spule', name: 'Ungeschnittene Kameraspule',
          text: 'Sechs Minuten Kuppelbild: Vale am Kern, dann eine Frau, die ohne Begleitung eintritt.',
          analysis: {
            wait: 2, label: 'Entwicklung · Kameraspule', clue: 'f3-voss-am-kern',
            text: 'Das Bild zeigt Mara Voss eindeutig. Sie nimmt Vale die Fracht nicht ab; beide aktivieren den Kern gemeinsam. Als Vale zurückweicht, verriegelt Voss den Kuppelgang und bleibt am Steuerpult.',
          },
        },
      },
      {
        id: 'f3-galerie-raus', u: 0.47, v: 0.86, r: 0.08, kind: 'exit', dir: 'right', goto: 'f3-gewachshausdach', label: 'Zurück zur Kuppel', text: '',
      },
    ],
  },

  /* ====================================================================
     ANTENNENFELD
     ==================================================================== */
  'f3-antennen': {
    id: 'f3-antennen', district: 'f3-antennenfeld', name: 'Antennenfeld',
    sector: 'Sektor 14 · Antennenfeld', kind: 'street', backdrop: 'f3-antennenfeld-backdrop',
    spots: [
      {
        id: 'f3-fremdring', u: 0.44, v: 0.25, r: 0.11, label: 'Ring im Empfänger', clue: 'f3-signal',
        text: 'Der Ring schwebt in einer Halterung, die ihn nicht berührt. Jede Regentropfenfolge auf der Schüssel erscheint einen Augenblick später als Lichtfolge in seinem Inneren.',
      },
      {
        id: 'f3-kabelgraben', u: 0.61, v: 0.74, r: 0.08, label: 'Neu verlegter Kabelgraben',
        text: 'Die Leitung führt nicht zur Funkzentrale. Sie endet an einer blinden Wand und läuft von dort drahtlos weiter — als schmale Peilung zur Nullklinik.',
      },
      {
        id: 'f3-zur-leitstelle', u: 0.36, v: 0.62, r: 0.08, kind: 'exit', dir: 'in', goto: 'f3-leitstelle', label: 'Leitstelle', text: 'Unter der großen Schüssel brennt noch eine einzige Tischlampe.',
      },
      {
        id: 'f3-zum-schusselsteg', u: 0.79, v: 0.56, r: 0.08, kind: 'exit', dir: 'up', goto: 'f3-schusselsteg', label: 'Schüsselsteg', text: 'Eine offene Wartungstreppe führt an den Rand der Antenne.',
      },
    ],
  },
  'f3-leitstelle': {
    id: 'f3-leitstelle', district: 'f3-antennenfeld', name: 'Funkleitstelle',
    sector: 'Sektor 14 · Antennenfeld', kind: 'interior', backdrop: 'f3-leitstelle-backdrop',
    spots: [
      {
        id: 'f3-funkerin', u: 0.70, v: 0.55, r: 0.065, kind: 'person', label: 'Funkerin mit halbem Kopfhörer',
        text: 'Dalia Kern hört nur mit einem Ohr. Das andere hält sie frei, als erwarte sie eine Antwort aus dem Raum.',
      },
      {
        id: 'f3-funkband', u: 0.32, v: 0.70, r: 0.085, label: 'Endlosschleife',
        text: 'Ein einzelner Ton, darunter Atem und darunter eine zweite Stimme, die denselben Atem zu früh beginnt.',
        item: {
          id: 'f3-funkaufnahme', name: 'Aufnahme des Antwortsignals',
          text: 'Zwei Spuren liegen fast deckungsgleich. Eine ist menschlich. Die andere lernt sie während der Aufnahme.',
          analysis: {
            wait: 2, label: 'Trennung · Antwortsignal', clue: 'f3-zweite-stimme',
            text: 'Die untere Spur beginnt als Maschinenton und übernimmt innerhalb von 19 Sekunden Rhythmus, Atempausen und Stimme Jorin Vales. Die Kopie setzt seinen letzten Satz fort, nachdem das Original schweigt.',
          },
        },
      },
      {
        id: 'f3-peilprotokoll', u: 0.54, v: 0.41, r: 0.08, label: 'Dreieck aus Peilungen',
        text: 'Werft, Klinik, Institut. Jede Station sendet dasselbe Muster, aber nie gleichzeitig. Eine ruft, zwei erinnern sich daran.',
      },
      {
        id: 'f3-leitstelle-raus', u: 0.15, v: 0.85, r: 0.08, kind: 'exit', dir: 'out', goto: 'f3-antennen', label: 'Zurück ins Antennenfeld', text: '',
      },
    ],
  },
  'f3-schusselsteg': {
    id: 'f3-schusselsteg', district: 'f3-antennenfeld', name: 'Schüsselsteg',
    sector: 'Sektor 14 · Antennenfeld', kind: 'street', backdrop: 'f3-schusselsteg-backdrop',
    spots: [
      {
        id: 'f3-unter-horizont', u: 0.50, v: 0.20, r: 0.11, label: 'Ausrichtung unter den Horizont', clue: 'f3-nicht-von-oben',
        text: 'Sechs Grad nach unten. Die Schüssel hört nicht ins All. Sie hört durch Beton, Wasser und sieben Stadtsektoren auf etwas, das tief in der Werft liegt.',
      },
      {
        id: 'f3-handabdruck', u: 0.70, v: 0.59, r: 0.075, label: 'Trockener Handabdruck',
        text: 'Auf nassem Metall bleibt eine vollkommen trockene Hand. Fünf Finger, aber die Linien darin gehören zu drei verschiedenen Menschen.',
      },
      {
        id: 'f3-steg-runter', u: 0.39, v: 0.88, r: 0.08, kind: 'exit', dir: 'down', goto: 'f3-antennen', label: 'Zurück hinunter', text: '',
      },
    ],
  },

  /* ====================================================================
     NULLKLINIK
     ==================================================================== */
  'f3-klinikempfang': {
    id: 'f3-klinikempfang', district: 'f3-nullklinik', name: 'Empfang der Nullklinik',
    sector: 'Sektor 17 · Nullklinik', kind: 'interior', backdrop: 'f3-traumstation-backdrop',
    spots: [
      {
        id: 'f3-pfleger', u: 0.24, v: 0.58, r: 0.065, kind: 'person', label: 'Pfleger am leeren Schalter',
        text: 'Ivo Sand sitzt hinter einem Schalter ohne Glas. Hinter ihm stehen sieben Patientenakten und ein leerer achter Platz.',
      },
      {
        id: 'f3-patientenkarten', u: 0.66, v: 0.70, r: 0.085, label: 'Sieben Patientenkarten',
        text: 'Verschiedene Namen, Diagnosen und Alter. In jeder Akte fehlt dieselbe Seite zwischen Aufnahme und Entlassung.',
        item: {
          id: 'f3-patientenstreifen', name: 'Messstreifen der sieben Patienten',
          text: 'Sieben Kurven brechen für exakt drei Minuten ab und setzen mit einer achten, identischen Spitze wieder ein.',
          analysis: {
            wait: 3, label: 'Vergleich · Patientenkurven', clue: 'f3-geloeschte-sieben',
            text: 'Allen sieben Patienten fehlen dieselben drei Minuten. Während der Lücke wurde ihr episodisches Gedächtnis vollständig ausgeleitet und anschließend unvollständig zurückgeschrieben. Die achte Signatur gehört Jorin Vale und endet ohne Rücklauf.',
          },
        },
      },
      {
        id: 'f3-zur-traumstation', u: 0.46, v: 0.48, r: 0.08, kind: 'exit', dir: 'in', goto: 'f3-traumstation', label: 'Traumstation', text: 'Hinter einer gepolsterten Tür läuft ein Projektor, obwohl kein Film eingelegt ist.',
      },
      {
        id: 'f3-zum-tresor', u: 0.84, v: 0.45, r: 0.08, kind: 'exit', dir: 'right', goto: 'f3-gedaechtnistresor', label: 'Gedächtnistresor', text: 'Das Beobachtungsglas dahinter ist von innen beschlagen.',
      },
    ],
  },
  'f3-traumstation': {
    id: 'f3-traumstation', district: 'f3-nullklinik', name: 'Traumstation',
    sector: 'Sektor 17 · Nullklinik', kind: 'interior', backdrop: 'f3-gedaechtnistresor-backdrop',
    spots: [
      {
        id: 'f3-ueberlebende', u: 0.68, v: 0.58, r: 0.065, kind: 'person', label: 'Frau unter der Decke',
        text: 'Mina Rell sieht nicht dich an, sondern den cyanfarbenen Umriss, den die Maschine eine Sekunde hinter dir zeichnet.',
      },
      {
        id: 'f3-vollstuhl', u: 0.22, v: 0.64, r: 0.10, label: 'Stuhl für den Vollauszug', clue: 'f3-vollauszug',
        text: 'Die normalen Stühle haben Rücklaufkabel. Dieser nicht. Wer hier angeschlossen wird, gibt alles ab und bekommt nichts zurück. Auf der Armlehne steht Vales frischer Handabdruck.',
      },
      {
        id: 'f3-achte-mulde', u: 0.46, v: 0.36, r: 0.08, label: 'Achte Mulde im Schaltpult',
        text: 'Sieben kleine Fassungen, eine große. Die große ist leer und ihre Ränder sind nach außen gebogen, als hätte der Kern selbst entschieden zu gehen.',
      },
      {
        id: 'f3-traum-raus', u: 0.12, v: 0.85, r: 0.08, kind: 'exit', dir: 'out', goto: 'f3-klinikempfang', label: 'Zurück zum Empfang', text: '',
      },
    ],
  },
  'f3-gedaechtnistresor': {
    id: 'f3-gedaechtnistresor', district: 'f3-nullklinik', name: 'Gedächtnistresor',
    sector: 'Sektor 17 · Nullklinik', kind: 'interior', backdrop: 'f3-nullklinik-backdrop',
    spots: [
      {
        id: 'f3-fremdbogen', u: 0.72, v: 0.38, r: 0.12, label: 'Bogen aus schwarzem Glas', clue: 'f3-technologie-sichtbar',
        text: 'Der Bogen steht ohne Sockel und wirft Lichtbilder von Menschen, die nicht im Raum sind. Manche wiederholen eine Bewegung. Einer dreht den Kopf und sieht dich an.',
      },
      {
        id: 'f3-zylinder', u: 0.30, v: 0.65, r: 0.09, label: 'Sieben Erinnerungszylinder', clue: 'f3-siebte-spur',
        text: 'Jeder Zylinder trägt einen Namen. Darin laufen keine Akten, sondern Geburtstage, Abschiede und Schlaflosigkeit. Der Inhalt gehört lebenden Menschen und liegt trotzdem hier.',
      },
      {
        id: 'f3-tresor-raus', u: 0.48, v: 0.86, r: 0.08, kind: 'exit', dir: 'left', goto: 'f3-klinikempfang', label: 'Zurück zum Empfang', text: '',
      },
    ],
  },

  /* ====================================================================
     VERSUNKENE WERFT
     ==================================================================== */
  'f3-dock': {
    id: 'f3-dock', district: 'f3-werft', name: 'Überflutetes Dock',
    sector: 'Sektor 19 · Versunkene Werft', kind: 'street', backdrop: 'f3-werft-backdrop',
    spots: [
      {
        id: 'f3-taucher', u: 0.75, v: 0.61, r: 0.065, kind: 'person', label: 'Taucher am schwarzen Wasser',
        text: 'Borek Tann hat den Helm abgesetzt, den Druckmesser aber nicht. Im Wasser hinter ihm pulsiert Licht in seinem Atemrhythmus.',
      },
      {
        id: 'f3-caisson', u: 0.48, v: 0.58, r: 0.13, label: 'Geöffneter Bergungscaisson', clue: 'f3-bergung',
        text: 'Unter der Wasserlinie liegt kein Wrack, sondern eine glatte schwarze Struktur, größer als die Gondel. Ihre Teile berühren sich nicht und bewegen sich trotzdem wie ein einziger Körper.',
      },
      {
        id: 'f3-zur-trockenkammer', u: 0.18, v: 0.55, r: 0.08, kind: 'exit', dir: 'in', goto: 'f3-trockenkammer', label: 'Trockenkammer', text: 'Hinter der Schleuse hängen Anzüge und Lieferbücher.',
      },
      {
        id: 'f3-zur-fremdkammer', u: 0.64, v: 0.42, r: 0.08, kind: 'exit', dir: 'down', goto: 'f3-fremdkammer',
        requires: { clue: 'f3-bergung-ganz' },
        lockText: 'Der Tauchgang endet an einer Struktur ohne Eingang. Solange niemand erklärt, wie ihre Teile sich bewegen, ist jeder Spalt nur schwarzes Wasser.',
        label: 'Hinunter zur Fremdkammer', text: 'Tann zeigt auf eine Öffnung, die vor einer Minute noch nicht da war.',
      },
    ],
  },
  'f3-trockenkammer': {
    id: 'f3-trockenkammer', district: 'f3-werft', name: 'Trockenkammer',
    sector: 'Sektor 19 · Versunkene Werft', kind: 'interior', backdrop: 'f3-trockenkammer-backdrop',
    spots: [
      {
        id: 'f3-lieferregister', u: 0.61, v: 0.66, r: 0.09, label: 'Bergungsregister', clue: 'f3-institut-route',
        text: 'Zwölf Teile gingen ans Kontinuitätsinstitut. Das dreizehnte blieb im Wasser, weil es sich nicht heben ließ. Im Summenfeld steht: „Zielmaterial vollständig; Original aktiv.“',
      },
      {
        id: 'f3-taucheranzug', u: 0.26, v: 0.58, r: 0.09, label: 'Vales geliehener Tauchanzug',
        text: 'Zu klein für Tann, innen mit Vales Blutgruppe markiert. Im Filter sitzt schwarzer Staub, der auf keinen Magneten reagiert.',
        item: {
          id: 'f3-filter', name: 'Filter aus Vales Tauchanzug',
          text: 'Salz, Rost und feiner schwarzer Abrieb. In jedem Korn läuft dieselbe Lichtfolge.',
          analysis: {
            wait: 2, label: 'Abgleich · Tauchfilter', clue: 'f3-opfer-taucher',
            text: 'Hautzellen und Blut gehören Jorin Vale. Er war vor zwölf Tagen in der Werft unter Wasser und hatte direkten Kontakt mit dem ursprünglichen Kern.',
          },
        },
      },
      {
        id: 'f3-trocken-raus', u: 0.82, v: 0.84, r: 0.08, kind: 'exit', dir: 'out', goto: 'f3-dock', label: 'Zurück ans Dock', text: '',
      },
    ],
  },
  'f3-fremdkammer': {
    id: 'f3-fremdkammer', district: 'f3-werft', name: 'Fremdkammer',
    sector: 'Sektor 19 · Versunkene Werft', kind: 'interior', backdrop: 'f3-fremdkammer-backdrop',
    spots: [
      {
        id: 'f3-ursprungsmaschine', u: 0.48, v: 0.54, r: 0.16, label: 'Die ganze Maschine', clue: 'f3-ganze-maschine',
        text: 'Im Wasser schließen sich alle schwarzen Flächen zu einem einzigen System. Keine Schraube, kein Leiter, keine Schrift. In der Mitte läuft ein menschliches Erinnerungsmuster, und darum etwas viel Älteres, das ihm beim Erinnern zusieht.',
      },
      {
        id: 'f3-vales-echo', u: 0.70, v: 0.40, r: 0.10, label: 'Vales Echo im Kern', clue: 'f3-letzte-erinnerung',
        text: 'Das Licht wird zu einer Gondel von innen. Vale sitzt im Stuhl, Voss am Pult. Man hört keinen Ton, aber sein Mund formt: „Sie weiß, dass der Vollauszug tötet.“ Dann sieht die Erinnerung direkt zu dir.',
      },
      {
        id: 'f3-fremd-raus', u: 0.18, v: 0.86, r: 0.08, kind: 'exit', dir: 'up', goto: 'f3-dock', label: 'Zurück an die Oberfläche', text: '',
      },
    ],
  },

  /* ====================================================================
     KONTINUITÄTSINSTITUT
     ==================================================================== */
  'f3-atrium': {
    id: 'f3-atrium', district: 'f3-institut', name: 'Atrium der Kontinuität',
    sector: 'Sektor 0 · Institut', kind: 'interior', backdrop: 'f3-kaltarchiv-backdrop',
    spots: [
      {
        id: 'f3-archivar', u: 0.24, v: 0.59, r: 0.065, kind: 'person', label: 'Archivar vor der Schleuse',
        text: 'Levin Oss steht mit einer leeren Mappe vor einer Tür, die seine Karte angeblich nicht öffnet.',
      },
      {
        id: 'f3-zugangsleser', u: 0.74, v: 0.61, r: 0.08, label: 'Ausgebrannter Zugangsleser', clue: 'f3-voss-zugang',
        text: 'Das Register springt von 02:11 auf 05:48. Im thermischen Schatten darunter steht ein einzelner Zugang um 03:06: Direktion, Mara Voss, Kernlabor.',
      },
      {
        id: 'f3-zum-kaltarchiv', u: 0.38, v: 0.50, r: 0.08, kind: 'exit', dir: 'left', goto: 'f3-kaltarchiv', label: 'Kaltarchiv', text: 'Hinter der unscheinbaren Tür lagert das Institut Papier. Es traut seiner eigenen Elektronik nicht.',
      },
      {
        id: 'f3-zum-resonanzlabor', u: 0.82, v: 0.43, r: 0.08, kind: 'exit', dir: 'in', goto: 'f3-resonanzlabor',
        requires: { clue: 'f3-augenzeuge' },
        lockText: 'Die Direktorin empfängt keine Ermittler mit Theorien. Ohne jemanden, der lebend aus ihrer Maschine kam, bleibt die Schleuse geschlossen und jedes Wort dahinter Forschung.',
        label: 'Resonanzlabor', text: 'Die Schleuse öffnet sich auf Minas Patientensignatur. Dahinter hängt die zweite Maschine über der Stadt.',
      },
    ],
  },
  'f3-kaltarchiv': {
    id: 'f3-kaltarchiv', district: 'f3-institut', name: 'Kaltarchiv',
    sector: 'Sektor 0 · Institut', kind: 'interior', backdrop: 'f3-resonanzlabor-backdrop',
    spots: [
      {
        id: 'f3-direktive', u: 0.34, v: 0.66, r: 0.09, label: 'Papier hinter der Rückwand',
        erscheint: { clue: 'f3-direktive-versteckt' },
        text: 'Eine einzige Seite, zweimal gefaltet. „Vollauszug ohne Rückführung.“ Darunter die Warnung: irreversible Auflösung des biologischen Trägers.',
        item: {
          id: 'f3-vollauszug-direktive', name: 'Direktive zum Vollauszug',
          text: 'Die medizinische Warnung ist rot umrandet. Freigabe und Gegenzeichnung stehen auf derselben Minute.',
          analysis: {
            wait: 2, label: 'Prüfung · Vollauszug-Direktive', clue: 'f3-toetungsbefehl',
            text: 'Papier, Tinte und Druck sind echt. Mara Voss gab den Vollauszug an Jorin Vale persönlich frei, nachdem die dokumentierte Folge „Tod des biologischen Trägers“ ergänzt worden war. Die Gegenzeichnung stammt ebenfalls von ihr.',
          },
        },
      },
      {
        id: 'f3-kindheitsband', u: 0.67, v: 0.46, r: 0.09, label: 'Band ohne Aktennummer',
        text: 'Ein Mädchen lernt Fahrradfahren. Voss läuft nebenher, jünger, lachend. Auf der Hülle steht nur ein Todesdatum. Das Institut begann nicht mit Forschung, sondern mit jemandem, den sie nicht verlieren wollte.',
      },
      {
        id: 'f3-archiv-raus', u: 0.82, v: 0.85, r: 0.08, kind: 'exit', dir: 'right', goto: 'f3-atrium', label: 'Zurück ins Atrium', text: '',
      },
    ],
  },
  'f3-resonanzlabor': {
    id: 'f3-resonanzlabor', district: 'f3-institut', name: 'Resonanzlabor',
    sector: 'Sektor 0 · Institut', kind: 'interior', backdrop: 'f3-institut-backdrop',
    spots: [
      {
        id: 'f3-direktorin', u: 0.72, v: 0.57, r: 0.065, kind: 'person', label: 'Mara Voss im Kernlicht',
        text: 'Sie steht zwischen dir und dem Pult. Hinter ihr schweben zwölf geborgene Teile, die langsam eine Form annehmen, die du aus der Werft kennst.',
      },
      {
        id: 'f3-zweite-maschine', u: 0.50, v: 0.32, r: 0.14, label: 'Die zweite Maschine', clue: 'f3-zweite-maschine-aktiv',
        text: 'Die Teile halten Abstand und bilden trotzdem einen Körper. Darin laufen Erinnerungen der sieben Patienten, Vales letzter Blick und etwas, das zu keinem Menschen gehört.',
      },
      {
        id: 'f3-abschluss', u: 0.39, v: 0.69, r: 0.085, kind: 'anklage', label: 'Beweistisch vor dem Kern',
        text: 'Hier liegt alles nebeneinander: die Maschine, die Aufnahme, die Direktive und die Menschen, denen Zeit fehlt. Wenn du jemanden benennst, hört das Nulllicht mit.',
      },
      {
        id: 'f3-labor-raus', u: 0.13, v: 0.85, r: 0.08, kind: 'exit', dir: 'out', goto: 'f3-atrium', label: 'Zurück ins Atrium', text: '',
      },
    ],
  },
};
