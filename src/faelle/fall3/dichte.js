/**
 * Zusaetzliche Beobachtungen fuer Fall 3.
 *
 * Fall 1 und 2 geben pro Ort im Mittel knapp fuenf untersuchbare Dinge her.
 * Diese Punkte bringen Fall 3 auf dieselbe Dichte, ohne die Beweiskette mit
 * weiteren Pflicht-Hinweisen aufzublaehen: Sie erzaehlen Material, Gebrauch
 * und Folgen der fremden Technik im Raum selbst.
 */
export const ZUSATZSPUREN = {
  'f3-flugdeck': [
    { id: 'f3-landeklaue', u: 0.50, v: 0.78, r: 0.075, label: 'Verdrehte Landeklaue', text: 'Die Klaue ist nicht vom Aufprall verbogen. Das Metall hat sich in Richtung der Gondel gedreht, als haette es fuer einen Augenblick auf etwas im Inneren gezeigt.' },
    { id: 'f3-kondensschatten', u: 0.73, v: 0.61, r: 0.085, label: 'Schatten im Kondenswasser', text: 'Auf der Scheibe fehlt der Dampf in der Form eines Oberkoerpers. Der Umriss sitzt Vale gegenueber, obwohl der zweite Sitz unbenutzt und der Gurt geschlossen ist.' },
  ],
  'f3-zollgang': [
    { id: 'f3-probenarm', u: 0.57, v: 0.48, r: 0.075, label: 'Ausgeschlagener Probenarm', text: 'Der Greifer endet einen Fingerbreit vor dem schwarzen Glas. Seine Gelenke sind ausgeschlagen, als haette er stundenlang versucht, den fehlenden Abstand zu ueberwinden.' },
    { id: 'f3-trockener-abfluss', u: 0.57, v: 0.83, r: 0.075, label: 'Trockener Bodenabfluss', text: 'Der ganze Korridor ist nass von hereingetragenem Regen. Nur um dieses Gitter bleibt der Boden trocken, und unter ihm pulsiert dasselbe Cyan wie in der Probe.' },
  ],
  'f3-wrackhangar': [
    { id: 'f3-werkzeugtasche', u: 0.61, v: 0.73, r: 0.08, label: 'Offene Werkzeugtasche', text: 'Zangen, Messbruecken, Keramikschneider. Alles liegt in der Reihenfolge, in der Ber es benutzt hat. Das letzte Fach ist leer und innen kreisrund versengt.' },
    { id: 'f3-kabelschatten', u: 0.82, v: 0.64, r: 0.085, label: 'Schatten der Kabel', text: 'Die losen Kabel werfen zwei Schatten: einen im Arbeitslicht und einen zweiten, cyanfarbenen, der eine andere Bewegung zeigt als der Kabelstrang selbst.' },
  ],
  'f3-markt': [
    { id: 'f3-synchronplanen', u: 0.46, v: 0.45, r: 0.09, label: 'Gleichzeitig zuckende Planen', text: 'Der Wind faehrt unregelmaessig durch den Markt. Trotzdem heben sich drei weit auseinanderliegende Planen im exakt gleichen Augenblick, immer wenn das Glas aufleuchtet.' },
    { id: 'f3-blinde-waage', u: 0.80, v: 0.61, r: 0.08, label: 'Blinde Haendlerwaage', text: 'Keine Ware liegt auf der Schale, doch der Zeiger steht bei acht Kilogramm. Wenn du an Vale denkst, sinkt er um eine Teilung und kehrt langsam zurueck.' },
  ],
  'f3-pfandleihe': [
    { id: 'f3-schubladenschwarm', u: 0.76, v: 0.50, r: 0.085, label: 'Schubladen ohne Griffe', text: 'Dutzende flache Laden, alle ohne Schloss und Griff. Hinter jeder Front hoerst du einen anderen Raum: Geschirr, Streit, Schlaf, Regen auf einem Dach.' },
    { id: 'f3-geschmolzene-uhren', u: 0.48, v: 0.31, r: 0.08, label: 'Geschmolzene Taschenuhren', text: 'Die Gehaeuse sind weich geworden, die Werke laufen weiter. Alle Sekundenzeiger bleiben gemeinsam stehen, sobald die Linse ein fremdes Bild zeigt.' },
    { id: 'f3-spiegel-ohne-dich', u: 0.84, v: 0.71, r: 0.085, label: 'Spiegel ohne Gegenwart', text: 'Der blinde Spiegel zeigt den Laden vor wenigen Minuten. Darin steht Sira allein, und hinter ihr geht jemand vorbei, den es auf keiner Seite des Glases gibt.' },
  ],
  'f3-hofkino': [
    { id: 'f3-sitze-warm', u: 0.27, v: 0.75, r: 0.085, label: 'Warme Klappstuehle', text: 'Drei Sitze sind warm und ihre Lehnen noch heruntergeklappt. Im Hof ist niemand ausser dir, doch auf der Wand laufen drei verschiedene Blickwinkel derselben Erinnerung.' },
    { id: 'f3-feuchte-kontur', u: 0.34, v: 0.44, r: 0.09, label: 'Feuchte Kontur an der Wand', text: 'Der Putz ist rund um eine stehende Gestalt trocken. Mit jedem Durchlauf des Films wird die Kontur schmaler, als verlasse jemand das Bild Stueck fuer Stueck.' },
    { id: 'f3-kabel-ohne-projektor', u: 0.83, v: 0.56, r: 0.08, label: 'Kabel ohne Projektor', text: 'Das Stromkabel endet offen auf dem Boden. Trotzdem flimmert an seiner Schnittflaeche Licht im Rhythmus der Szene, als waere die Leitung nur eine Erinnerung an Strom.' },
  ],
  'f3-gewachshausdach': [
    { id: 'f3-rinne-rueckwaerts', u: 0.35, v: 0.73, r: 0.08, label: 'Regenrinne mit Gegenstrom', text: 'Das Wasser laeuft ein kurzes Stueck bergauf, direkt auf die Kuppel zu. Kleine Blaetter treiben darin gegen Wind und Gefaelle zum cyanfarbenen Geflecht.' },
    { id: 'f3-versiegelte-luke', u: 0.51, v: 0.62, r: 0.085, label: 'Versiegelte Wartungsluke', text: 'Das alte Stadtsiegel ist unversehrt. Von innen druecken frische Wurzeln durch die Fuge und bilden ueber dem Schloss das Muster einer menschlichen Hand.' },
    { id: 'f3-versetzte-schatten', u: 0.84, v: 0.33, r: 0.09, label: 'Versetzte Pflanzenschatten', text: 'Die Blaetter stehen still, ihre Schatten nicht. Sie wiederholen Veys letzte drei Bewegungen mit einer Verzoegerung von genau einer Sekunde.' },
  ],
  'f3-saatbank': [
    { id: 'f3-saatladen', u: 0.22, v: 0.48, r: 0.085, label: 'Offene Saatladen', text: 'In jeder Lade liegt dieselbe Sorte, aber die Keime bilden verschiedene Muster: Spiralen, Gesichter, die Linien eines Stadtplans und einmal Vales Fingerabdruck.' },
    { id: 'f3-spruehnebel', u: 0.50, v: 0.73, r: 0.08, label: 'Stehender Spruehnebel', text: 'Die Bewaesserung ist aus. Ein feiner Nebel steht trotzdem reglos ueber dem Tisch und laesst eine unsichtbare, ringfoermige Struktur im Raum erkennen.' },
    { id: 'f3-kaltlicht', u: 0.82, v: 0.30, r: 0.075, label: 'Kaltlicht mit Puls', text: 'Die Roehre bekommt keinen Strom. Ihr Licht folgt nicht dem Netz, sondern den feinen Bewegungen der Wurzel im Glas, Schlag fuer Schlag.' },
  ],
  'f3-kuehlgalerie': [
    { id: 'f3-reifspur', u: 0.48, v: 0.73, r: 0.085, label: 'Spur im Reif', text: 'Eine einzelne Spur beginnt mitten im Gang und endet vor dem ringfoermigen Abdruck. Der linke Fuss gehoert Vale, der rechte hat keine Ferse.' },
    { id: 'f3-leere-kamerahalterung', u: 0.25, v: 0.30, r: 0.075, label: 'Leere Kamerahalterung', text: 'Die Schrauben liegen ordentlich darunter. Wer die Kamera abnahm, hatte Zeit; wer das Kabel abriss, hatte sie ploetzlich nicht mehr.' },
    { id: 'f3-hand-im-kondensat', u: 0.85, v: 0.58, r: 0.085, label: 'Hand im Kondensat', text: 'Fuenf Finger von aussen, drei Handlinien von innen. Das Muster gleicht dem Abdruck am Antennensteg, obwohl dieser Ort mehrere Sektoren entfernt liegt.' },
  ],
  'f3-antennen': [
    { id: 'f3-wartungskasten', u: 0.22, v: 0.66, r: 0.08, label: 'Geoeffneter Wartungskasten', text: 'Die Sicherungen sind gezogen und sauber aufgereiht. Das Feld sendet trotzdem; die Anzeigen beziehen ihre Spannung aus dem schwebenden Ring.' },
    { id: 'f3-regenmesser', u: 0.78, v: 0.32, r: 0.075, label: 'Rueckwaerts laufender Regenmesser', text: 'Die Trommel dreht gegen die Uhr und radiert ihre letzten sechs Stunden aus. Nur die Minuten der Gondellandung werden immer wieder neu eingeritzt.' },
    { id: 'f3-isolatoren', u: 0.55, v: 0.49, r: 0.085, label: 'Singende Isolatoren', text: 'Keramik kann nicht singen. Diese Reihe tut es trotzdem, sehr leise und mit derselben wandernden Phase wie der Flugschreiber.' },
  ],
  'f3-leitstelle': [
    { id: 'f3-karte-mit-loch', u: 0.18, v: 0.30, r: 0.085, label: 'Stadtkarte mit Brandloch', text: 'Das Loch liegt nicht ueber der Werft, sondern unter ihr. Seine Raender sind kalt und die Papierfasern zeigen sternfoermig nach innen.' },
    { id: 'f3-zweiter-kopfhoerer', u: 0.82, v: 0.70, r: 0.08, label: 'Zweiter Kopfhoerer', text: 'Der Buegel ist noch warm. Auf dem Band laeuft keine Stimme, sondern die Pause zwischen zwei Worten, endlos gedehnt und von jemand anderem weitergeatmet.' },
  ],
  'f3-schusselsteg': [
    { id: 'f3-lockere-schraube', u: 0.23, v: 0.72, r: 0.075, label: 'Schwebende Schraube', text: 'Die Schraube hat sich aus der Strebe geloest, faellt aber nicht. Sie haengt einen Millimeter ueber dem nassen Metall und dreht sich zur Werft.' },
    { id: 'f3-regenschatten', u: 0.53, v: 0.47, r: 0.09, label: 'Ringfoermiger Regenschatten', text: 'Der Regen erreicht den Steg ueberall ausser in einem perfekten Kreis. In seiner Mitte ist die Luft waermer und riecht nach nassem Stein.' },
    { id: 'f3-stadt-unter-der-schale', u: 0.84, v: 0.28, r: 0.09, label: 'Stadt unter der Schale', text: 'Von hier oben siehst du die Peillinie: Klinik, Markt, Institut. Die Lichter reagieren nacheinander, obwohl keine sichtbare Verbindung zwischen ihnen besteht.' },
  ],
  'f3-klinikempfang': [
    { id: 'f3-nummerngeber', u: 0.50, v: 0.44, r: 0.075, label: 'Nummerngeber auf Acht', text: 'Die Rolle ist voll und der Hebel verrostet. Trotzdem steckt genau eine Nummer im Schlitz: acht, frisch und an den Kanten warm.' },
    { id: 'f3-nasse-fussspuren', u: 0.48, v: 0.77, r: 0.09, label: 'Nasse Fussspuren', text: 'Sie fuehren vom Schalter zur Traumstation und nicht zurueck. Nach dem siebten Paar folgt ein achtes, das immer nur mit dem linken Fuss auftritt.' },
    { id: 'f3-beobachtungsfenster', u: 0.80, v: 0.35, r: 0.09, label: 'Blindes Beobachtungsfenster', text: 'Hinter dem Glas ist kein Raum zu erkennen. Legst du die Hand an, erscheint fuer einen Moment eine Aufnahme von dir, wie du sie erst eine Sekunde spaeter bewegst.' },
  ],
  'f3-traumstation': [
    { id: 'f3-ruecklaufkabel', u: 0.18, v: 0.45, r: 0.085, label: 'Abgetrennte Ruecklaufkabel', text: 'Sieben Kabel sind sauber beschriftet und angeschlossen. Das achte wurde kurz vor dem Stecker abgeschnitten; die Schnittkante ist glatt und innen schwarz.' },
    { id: 'f3-deckenprojektor', u: 0.82, v: 0.25, r: 0.085, label: 'Projektor ohne Optik', text: 'Im Gehaeuse fehlt jede Linse. Trotzdem zeichnet es hinter Mina einen cyanfarbenen Koerperumriss, der ihre Haltung nicht ganz richtig nachahmt.' },
  ],
  'f3-gedaechtnistresor': [
    { id: 'f3-beobachtungspult', u: 0.18, v: 0.72, r: 0.085, label: 'Verlassenes Beobachtungspult', text: 'Sieben Schalter stehen auf Rueckfuehrung. Der achte ist mit Draht auf Vollauszug gebunden und traegt einen frischen Abdruck von Vossens Handschuh.' },
    { id: 'f3-achter-sockel', u: 0.49, v: 0.61, r: 0.09, label: 'Leerer achter Sockel', text: 'Die sieben Zylinder passen in menschliche Halterungen. Der achte Sockel ist groesser, nahtlos und so kalt, dass der Reif einen Abstand zu ihm haelt.' },
    { id: 'f3-waermehalo', u: 0.83, v: 0.47, r: 0.085, label: 'Waermehalo am Glas', text: 'Eine menschliche Silhouette zeichnet sich warm auf der kalten Scheibe ab. Sie steht auf der falschen Seite und hebt die Hand gleichzeitig mit dir.' },
  ],
  'f3-dock': [
    { id: 'f3-taucherhelm', u: 0.84, v: 0.68, r: 0.085, label: 'Abgesetzter Taucherhelm', text: 'Im Sichtfenster liegt kein Beschlag. Stattdessen zeigt es das Dock von unter Wasser, und darin steht Tann noch immer unten am Caisson.' },
    { id: 'f3-bergungswinde', u: 0.18, v: 0.44, r: 0.09, label: 'Blockierte Bergungswinde', text: 'Das Stahlseil steht unter Zug, obwohl der Haken leer auf dem Kai liegt. Die Kraft kommt aus dem Wasser und bleibt vollkommen gleichmaessig.' },
    { id: 'f3-ruhige-wasserlinie', u: 0.40, v: 0.71, r: 0.09, label: 'Unbewegte Wasserlinie', text: 'Regen zerlegt die ganze Hafenflaeche. Ueber der schwarzen Struktur bleibt ein schmaler Streifen spiegelglatt und bildet Sterne ab, die ueber Regenstadt nicht stehen.' },
  ],
  'f3-trockenkammer': [
    { id: 'f3-druckprotokoll', u: 0.72, v: 0.34, r: 0.08, label: 'Druckprotokoll mit Luecke', text: 'Der Schreiber zeichnet jeden Tauchgang. Bei Vales Abstieg faellt die Nadel fuer drei Minuten aus und setzt anschliessend unterhalb der Messskala wieder ein.' },
    { id: 'f3-trockengestell', u: 0.48, v: 0.44, r: 0.09, label: 'Gestell mit dreizehn Haken', text: 'Zwoelf Haken tragen nummerierte Gurte. Am dreizehnten haengt nur eine schwarze, tropfenfreie Faser, die sich bei jedem Atemzug zusammenzieht.' },
    { id: 'f3-salzfigur', u: 0.50, v: 0.77, r: 0.085, label: 'Figur aus trockenem Salz', text: 'Das Salz bildet den Abdruck eines knienden Menschen. Zwischen den Haenden fehlt Material in Form eines glatten Rings ohne Werkzeugspur.' },
  ],
  'f3-fremdkammer': [
    { id: 'f3-schwebende-naht', u: 0.26, v: 0.43, r: 0.09, label: 'Schwebende Naht', text: 'Zwei schwarze Flaechen halten einen gleichbleibenden Abstand, ohne sich zu beruehren. Im Spalt laeuft eine Erinnerung an Tageslicht durch tiefes Wasser.' },
    { id: 'f3-wasser-ohne-blasen', u: 0.53, v: 0.72, r: 0.09, label: 'Wasser ohne Blasen', text: 'Dein Atem steigt ueberall zur Decke. Ueber der Maschine verschwinden die Blasen und tauchen Sekunden spaeter als Lichtpunkte in ihrem Inneren auf.' },
    { id: 'f3-handmulde', u: 0.81, v: 0.58, r: 0.085, label: 'Mulde fuer eine Hand', text: 'Die Vertiefung hat fuenf Finger, aber keine feste Form. Sie passt sich deiner Hand an, bevor du sie naeher als einen halben Meter bringst.' },
  ],
  'f3-atrium': [
    { id: 'f3-leere-mappe', u: 0.31, v: 0.66, r: 0.075, label: 'Leere Mappe im Frost', text: 'Oss haelt sie wie eine volle Akte. Im schraegen Licht druecken sich trotzdem Seitenraender durch den Umschlag, die beim direkten Hinsehen verschwinden.' },
    { id: 'f3-eis-am-leser', u: 0.72, v: 0.52, r: 0.08, label: 'Eisblume am Kartenleser', text: 'Der Frost waechst nicht nach aussen, sondern zieht sich in das Geraet zurueck. In seiner Mitte bleibt ein warmer Abdruck von Vossens Karte.' },
    { id: 'f3-atriumzylinder', u: 0.49, v: 0.32, r: 0.10, label: 'Schwebende Archivprobe', text: 'Schwarze Teilchen haengen ohne Behaelter in cyanfarbenen Linien. Zusammen ergeben sie fuer einen Moment das Profil eines Kindes, dann wieder nur Geometrie.' },
  ],
  'f3-kaltarchiv': [
    { id: 'f3-filmdosen', u: 0.78, v: 0.68, r: 0.085, label: 'Filmdosen ohne Film', text: 'Die Dosen sind leer, aber beim Drehen hoerst du Kinderstimmen, Sommerwind und einen Namen, den Voss in keinem Protokoll verwendet.' },
    { id: 'f3-gefrorenes-schloss', u: 0.46, v: 0.36, r: 0.08, label: 'Von innen gefrorenes Schloss', text: 'Das Eis sitzt hinter dem Metall. Jemand hat die Kammer nicht aufgebrochen; etwas im Archiv hat den Riegel von innen verlassen.' },
    { id: 'f3-fehlende-lade', u: 0.20, v: 0.54, r: 0.085, label: 'Fehlende Archivlade', text: 'Die Nummern springen von sieben auf neun. Im leeren Fach liegt warmer Staub und ein einzelnes graues Haar, frisch an der Wurzel abgeschnitten.' },
  ],
  'f3-resonanzlabor': [
    { id: 'f3-erinnerungskabel', u: 0.62, v: 0.67, r: 0.085, label: 'Kabel aus schwarzem Glas', text: 'Es verbindet das Pult nicht mit der Maschine, sondern endet vor beiden. Trotzdem wandern Vales letzte Bilder sichtbar von einem Ende zum anderen.' },
    { id: 'f3-trockener-absatz', u: 0.79, v: 0.73, r: 0.075, label: 'Trockener Absatzabdruck', text: 'Der ganze Steg glaenzt vom Regen. Nur Vossens letzter Schritt ist trocken, scharf begrenzt und von einem feinen cyanfarbenen Rand umgeben.' },
  ],
};
