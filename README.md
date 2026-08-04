# REGENSTADT

Ein Neo-Noir Point-and-Click Adventure. Feste Kunstrichtung, variabler Inhalt.

ZWEI FAELLE. Fall 1 „Elf Totenscheine": zwanzig Orte in sechs Sektoren, zehn
Figuren, die von einem Sprachmodell antworten, eine Beweiskette mit
Laborbefund, ein Flugauto, um zwischen den Sektoren zu reisen — und ein Ende,
das man erreichen kann.

Fall 2 „Der Chor": achtzehn Orte in sieben Sektoren, neun Figuren, Winter statt
Dauerregen — und unter dem vierten Becken eines stillgelegten Klaerwerks etwas,
das dort nicht sein kann.

Wer Fall 1 abgeschlossen hat, kann beim naechsten Neustart waehlen, mit welchem
er anfaengt (`tools/fallwahl-pruefen.mjs`).

```
npm install
npm run dev        # http://127.0.0.1:5173
```

## Ein Fall ist DATEN

Unter `src/faelle/<name>/` liegen Orte, Sektoren, Figuren, Loesung und
Meldungen. Die Mechanik in `src/game/` liest sie und weiss nicht, welchen Fall
sie spielt. Fall 2 hat deshalb KEINE Zeile Mechanik gebraucht — auch seine
zweite Fassung nicht, die aus sieben Orten achtzehn gemacht hat.

Der Kniff sind lebende ES-Modul-Bindungen: `scenes.js` und die anderen fuehren
ihre Daten als `export let` aus und setzen sie beim Fallwechsel neu. Jeder
Importeur sieht die neuen Daten, ohne dass sich an seiner Importzeile etwas
aendert — deshalb hat der Umbau keine Aufrufstelle angefasst.

```
tools/faelle-pruefen.mjs      Regeln, die fuer JEDEN Fall gelten
tools/fallwechsel-pruefen.mjs der Uebergang im echten Browser
tools/fallwahl-pruefen.mjs    die Fallwahl beim Neustart
```

`faelle-pruefen.mjs` prueft nicht nur, dass jeder Hinweis irgendwo herkommt,
sondern SIMULIERT den Fall bis zum Stillstand: Was ist erreichbar, wenn man
alles nimmt, was mit dem Erreichten schon zu bekommen ist? Ein Gestaendnis,
dessen Bedingung nur aus einem spaeteren Gestaendnis derselben Figur faellt,
ist eine Schlaufe, aus der niemand herauskommt — und beim Spielen faellt so
etwas erst auf, wenn man an genau die Stelle kommt.

**F1** öffnet die Bildsteuerung mit allen Reglern und der Frame-Zeit-Kurve.

## Wie das Bild entsteht

Die Hintergründe sind **vorgerendert**, wie beim Blade-Runner-Spiel von 1997 —
nur zeichnet sie hier Code statt einer 3D-Software. Pro Szene entsteht einmalig
ein Satz „Platten" (Canvas-Ebenen mit Tiefe). Alles Bewegte kommt danach aus
Shadern.

```
Platten (einmalig, Canvas2D)     Pro Frame (WebGL2)
  Himmel                     →     Ebenen mit Parallaxe + Tiefennebel
  ferne Skyline              →     nasse Straße: Spiegelung, Pfützen, Kräuselung
  Gasse (beide Fassaden)     →     Regen in drei Tiefenbändern, von der Szene beleuchtet
  Boden + Nässemaske         →     Bloom-Pyramide + Nebelstreuung
  Vordergrund                →     Objektiv: Tropfen, Farbsaum, Verzeichnung, ACES, Korn
```

Die Platten werden über eine **echte Zentralprojektion** gezeichnet
(`src/scene/projection.js`). Deshalb konvergieren Fassaden korrekt, werden
Fensterachsen mit der Entfernung enger — und deshalb kann der Boden-Shader aus
jedem Bildschirmpunkt die Tiefe zurückrechnen und Pfützen perspektivisch
richtig kräuseln.

## Point-and-Click

Untersuchungspunkte sind in **Bildkoordinaten der Hintergrundplatte** verankert
(`src/game/scenes.js`), nicht in Bildschirmprozenten. `plateUvToScreen()`
rechnet sie jeden Frame in Pixel um — inklusive Naeherungsumkehr der
Objektivverzeichnung. Dadurch wandern sie bei jeder Kamerabewegung mit dem Bild
mit und bleiben auch bei anderem Fensterformat auf ihrem Gegenstand.

Sichtbar ist normalerweise nichts. Beim Ueberfahren geht ein Lichtsaum **im
Bild** auf (`uHover` im Endbild-Shader), nicht als Marke davor. **TAB** gedrueckt
halten zeigt alle Punkte, **ESC** schliesst Tafel und Akte.

## Die Welt

Zwanzig Orte in sechs Sektoren, und man geht nicht nur geradeaus. Ausgaenge kennen acht
Richtungen (`forward`, `back`, `left`, `right`, `in`, `out`, `up`, `down`) mit je eigener
Marke; die **Querstrasse** ist der erste Ort, an dem man waehlen muss — links
das Praesidium, rechts die Bar.

```
        Lagerraum ──in── Kanalgasse hinten ──forward── Querstrasse
      (Innenraum)              │                       ╱        ╲
                            back│                  left          right
                                │                    ╱              ╲
                           Kanalgasse           Praesidium          Bar
                                                (Innenraum)     (Innenraum)
```

Innenraeume (`kind: 'interior'`) schalten Regen, nasse Fahrbahn und
Spiegelung ab. Drinnen regnet es nicht — und der Bodenpass wuerde sonst
mitten im Zimmer eine Pfuetze suchen.

### Die Karte

Gelaufen wird INNERHALB eines Sektors, geflogen ZWISCHEN ihnen. Mit sechs
Orten reicht Laufen; mit zwanzig nicht mehr — wer vom Kuehlhaus zurueck in die
Kanalgasse will, klickt sich sonst durch sieben Pfeile, und das ist keine
Ermittlung, das ist Verwaltung.

Die Karte ist bewusst **gezeichnet** (SVG) und nicht fotografiert. Ein Foto
waere ein Bild von einer Stadt; ein Bordgeraet ist ein Geraet, das im Wagen
eingebaut ist — Raster, Leuchtspuren, ein Zielkreuz, das pulst. Als SVG bleibt
es auf jedem Schirm scharf, und Sektoren koennen leuchten oder gesperrt
aussehen, ohne dass dafuer ein Bild erzeugt werden muss.

Achtung beim Aendern: Die Schriftgroessen im Kartenfeld sind
**Ansichtsfeld-Einheiten, keine Pixel**. Bei 100 Einheiten auf rund 680 px
wird aus `4.4px` am Schirm 30 px — die erste Fassung hatte Sektornamen so
gross wie Ueberschriften.

Ein Sektor, von dem man noch nichts weiss, steht als **gesperrte Zeile** mit
dem Hinweis, was fehlt. Der Spieler sieht, dass es weitergeht — eine Tuer, die
man nie gesehen hat, motiviert niemanden.

Der Flug ist keine Blende, sondern ein Platz im Wagen: die Kanzel von innen,
Regen auf dem Glas, die Stadt zieht vorbei, Ziel und Hoehe laufen auf dem
Display herunter. Ein Schnitt haette es auch getan — dann waere das Flugauto
aber nur ein Menue.

Und ein Flug kostet zwei Ortswechsel statt einem. Weil Laborbefunde in
Ortswechseln reifen, ist Herumfliegen kein Leerlauf, sondern bringt die
Ermittlung voran.

### Die Beweiskette

Damit eine Ermittlung nicht nach zwei Minuten durch ist, muss etwas von etwas
anderem abhaengen. Inzwischen sind es zwei ineinandergreifende Straenge, und
jeder Sektor haengt am Ergebnis des vorigen:

```
Muellcontainer → Schluesselkarte → oeffnet die Stahltuer
                                 → Lagerraum → Tuch mit dunklen Flecken
                                             → Labor → Befund: fremdes Blut
                                                     → SEKTOR 9 Kanalebene

Kistenstapel → Zollsiegel → SEKTOR 3 Hafenspange
                          → Frachtbrief → SEKTOR 1 Konzernterrassen

Kanalebene → Patientenkarte → Labor → Registerluecke → oeffnet das Archiv
                                    → Personalakte → Labor → Konzernprogramm
                                                           → SEKTOR 4 Meldeamt
```

Am Ende steht der Sachbearbeiter, der elf Totenscheine unterschrieben hat.
Fachmarke und Karteikarte belegen, dass es nie eine Leiche gab und dass er es
vor der Vermisstenmeldung wusste — der Punkt, an dem aus Mitwissen
Beteiligung wird. Von dort laeuft die Kette in den Abschluss:

```
Fachmarke → Labor → „ohne Leiche" → oeffnet das KUEHLHAUS im Hafen
                                  → der Vermisste lebt → oeffnet die DIREKTION
Bretterbude → Liste mit elf Namen → Labor → sie ist ein Terminkalender
Schreibtisch → Unterschriftenmappe → die zwoelfte Urkunde, fertig ausser Datum
```

### Der Abschluss

Bis zuletzt konnte das Spiel nicht **enden**. Man konnte alles finden und stand
danach genauso da wie vorher — und eine Ermittlung, die nicht abgeschlossen
werden kann, ist keine Ermittlung, sondern ein Rundgang.

Abgeschlossen wird sie an der Pinnwand in der **eigenen Wohnung**. Sie ist von
Anfang an offen, hat einen eigenen Punkt auf der Karte und ist der einzige Ort,
an dem man nichts ermittelt: Der letzte Zug des Spiels darf nicht der laengste
Fussweg des Spiels sein.

Der Spieler benennt eine Person und legt vor, was er hat. Daraus fallen drei
Enden — und keines davon ist „verloren", denn auch das falsche ist ein Ende:

| | |
|---|---|
| **Anklage** | richtige Person, alle drei Belege. Sie haelt. |
| **Verdacht** | richtige Person, aber Belege fehlen. Sie geht, das Programm heisst kuenftig anders. |
| **Irrtum** | falsche Person. Jemand steht dafuer gerade, der es nicht war. |

Den Nachspann schreibt dasselbe Modell, das auch die Figuren spricht, und zwar
aus dem **tatsaechlichen** Akteninhalt: Nur es weiss, was dieser Spieler
gefunden und was er ausgelassen hat. Faellt das Archiv aus, steht je Ausgang
ein fest geschriebener Text bereit — ein Ende darf nicht an einer Leitung
haengen. Die Loesung liegt als Daten in `src/game/anklage.js`, damit ein
generierter Fall spaeter eine eigene mitliefern kann.

### Der Spielstand

Gesichert wird im **Browser**, nicht auf einem Server: `localStorage`, kein
Konto, keine Anmeldung, keine Datenbank. Das ist hier nicht die billige,
sondern die richtige Loesung — zwei Leute an zwei Telefonen bekommen so ganz
von selbst zwei getrennte Ermittlungen, und niemand muss dafuer eine
E-Mail-Adresse hergeben.

Gespeichert wird nur, was das Spiel nicht selbst weiss. Gegenstaende stehen
mit ihrer **Kennung** im Stand, nicht mit ihrem Text — der kommt beim
Zuruecklesen frisch aus `scenes.js`. Sonst laege im Speicher eine alte Fassung
jeder Beschreibung, und wer morgen einen Satz aendert, saehe ihn bei sich
selbst nie wieder. Notizen dagegen stammen zum Teil aus den Verhoeren und
wurden vom Modell geschrieben; die stehen woertlich drin. Ebenso der
Nachspann: Ein abgeschlossener Fall zeigt nach dem Neuladen **denselben**
Bericht, nicht einen neu erfundenen.

Beim Start wird gefragt statt still fortgesetzt — wer das Spiel jemandem
zeigen will, soll nicht mitten in einer fremden Ermittlung landen. Verworfen
wird in der Akte, mit Rueckfrage.

Zwei Eigenschaften muss man kennen, weil sie sonst wie Fehler aussehen: Der
Stand haengt an Browser UND Geraet (Chrome und Safari sind zwei
Ermittlungen), und im privaten Fenster ist er nach dem Schliessen weg.

### Der Leuchtpunkt

Frueher war jeder Untersuchungspunkt ein duenner Ring, so gross wie seine
Klickflaeche, und normalerweise unsichtbar — man musste die Punkte suchen. Das
hat zwei Probleme gemacht: Man wusste nie, ob man alles gefunden hat, und man
hat abgesuchte Stellen wieder und wieder angeklickt.

Jetzt ist es ein kleiner leuchtender Punkt, dauerhaft sichtbar und immer gleich
gross — die Klickflaeche bleibt, nur die Anzeige haengt nicht mehr an ihr.
BLAU fuer Dinge, ORANGE fuer Menschen, GRUEN fuer die Pinnwand. Der dunkle Ring
um den Punkt ist noetig: Ein reines Leuchten war in der Kanalgasse zwischen den
Neonschildern praktisch unsichtbar.

Und wenn an einer Stelle nichts mehr ist — abgeheftet, nichts mehr
mitzunehmen —, erlischt der Punkt. Das ist die eigentliche Auskunft: Wo keiner
leuchtet, gibt es nichts mehr zu holen. Ausgaenge, Personen, der Laborschalter
und die Pinnwand erloeschen nie.

### Die Stadt bewegt sich

Punkte tragen `erscheint` und `verschwindet` — dieselbe Bedingungsmechanik wie
verschlossene Tueren, nur auf Untersuchungspunkte angewandt. Damit steht an
einem Ort, an dem man dreimal war, auf einmal jemand:

  Querstrasse   der Kiosk schweigt seit Jahren. Sobald der Ermittler weiss,
                dass jemand Buch fuehrt, lehnt sich der Mann darin vor.
  Wohnung       sobald der Name der Direktorin in der Akte steht, sitzt jemand
                im eigenen Sessel. Die Tuer war zu.
  Kanalgasse    der Marktstand ist wieder offen, sobald der Haendler lebt —
                und niemand steht dahinter.

### Wann ein Verhoer zu Ende ist

Neun Fragen an eine Figur, dann sagt der Ermittler selbst, dass hier nichts
mehr kommt. Erst ein Fund DRAUSSEN macht das Gespraech wieder auf. Ab drei
uebrigen Fragen wird vorgewarnt, damit die Sperre nicht aus dem Nichts kommt.

Gezaehlt werden ALLE Fragen, nicht nur die fruchtlosen. Die erste Fassung
zaehlte nur Fragen ohne neue `[SPUR]` und setzte bei jeder Spur zurueck. Das
klang vernuenftig und war es nicht: Bei der ersten Figur ist anfangs fast jede
Antwort neu, also kam laufend eine Spur, also sprang der Zaehler laufend
zurueck — gemeldet wurden dreizehn bis fuenfzehn Fragen am Stueck. Auch die
eigene Spur zaehlt deshalb nicht mehr als Fortschritt; sonst verlaengert jedes
Gespraech sich selbst.

Dahinter lief das Verhoer in eine zweite Wand: `api/chat.js` lehnte lange
Verlaeufe mit „Gespraechsverlauf zu lang" ab, statt sie zu kuerzen — obwohl
zwei Zeilen tiefer ohnehin auf die letzten Wechsel beschnitten wird. Die
Pruefung hat also einen Aufruf abgewiesen, den sie selbst haette bedienen
koennen, und das Gespraech blieb mitten im Spiel stehen. Jetzt wird gekuerzt;
die verbliebene Schranke liegt so hoch, dass sie im Spiel nicht erreichbar ist.

`node tools/verhoer-grenze.mjs` fragt stur dreizehnmal und schaut, wo Schluss
ist. Das laesst sich nur messen, nicht behaupten.

### Zeit

Die Wartezeit laeuft in **Ortswechseln**, nicht in Sekunden. Eine Uhr zwingt
zum Warten, ein Zaehler zwingt zum Weitergehen — und wer das Spiel weglegt,
verliert nichts.

Bedingungen sind Daten (`requires: { item: 'keycard' }`), keine Funktionen.
Das ist Absicht: Der spaeter generierte Fall muss sie ausgeben koennen, und
das kann ein Sprachmodell zuverlaessig nur als Daten. Ein verschlossener
Ausgang bleibt sichtbar, aber matt, und nennt in der Tafel den Grund — ein
Klick, der nichts tut, liest sich als Fehler.

`node tools/welt-pruefen.mjs` prueft die Kette ohne Browser: Sperren, Abgabe,
Wartezeit, Abholung und ob jeder Ort erreichbar ist. Das sind Logikfehler,
und ein Screenshot zeigt sie nicht.

## Verhoere

Figuren antworten nicht aus einem Antwortbaum, sondern von einem Sprachmodell.
Jede Figur in `src/game/characters.js` hat drei Angaben, die zusammen die
Anweisung ergeben: **Wesen** (wie sie redet), **Wissen** (was sie preisgeben
kann) und ein **Geheimnis, das nicht die Tat ist**.

Das Geheimnis ist der eigentliche Kniff. Wer etwas zu verbergen hat, weicht
aus — auch als Unschuldiger. Damit laesst sich aus Nervositaet allein nicht auf
den Taeter schliessen, und Verhoere werden mehr als eine Ja/Nein-Abfrage.

Was in der Akte steht, wird der Figur als Kenntnisstand mitgegeben. Erst dann
gibt Doran Vey zu, dass die Frachtkisten ihm gehoeren. Gibt eine Figur etwas
wirklich Neues preis, haengt sie eine Zeile `[SPUR] …` an; die wandert in die
Akte und faerbt ab da alle weiteren Gespraeche.

### Die Vorschlagsfragen schreibt das Modell

Der erste Versuch hat sie aus Bausteinen gesetzt: „Vorhalten: " plus die
Ueberschrift einer Aktennotiz. Bei einem Fundstueck ging das gerade noch, bei
einem Ort kam **„Ich halte Ihnen vor — Bar"** heraus. Das ist kein Satz, den
ein Mensch sagt, und es hat jedes Gespraech kaputt gemacht.

Jetzt schreibt dieselbe Instanz, die auch antwortet, vor jedem Zug vier Fragen
— sie kennt Figur, Ort, Akte und den bisherigen Verlauf. Vorgegeben sind nur
Laenge (hoechstens zwoelf Woerter, sie stehen auf Schaltflaechen) und vier
Tonlagen: beilaeufig, sachlich, auf einen Fund gezielt, unangenehm. Die letzte
ist im Bild orange.

Heraus kommen Saetze wie „Woher haben Sie einen so guten Schirm fuer diese
Kanalgasse?" oder — aus einem Nebensatz in der Beschreibung des Marktstands —
„Warum ist die Sitzflaeche des Hockers da drueben noch trocken?"

Eine Regel musste nachgereicht werden: **nichts erfinden**. Der erste Durchlauf
fragte nach einem „Zollsiegel aus Sektor Vier" — den Sektor gibt es nicht, und
die Figur kann darauf nur Unsinn antworten.

### Warum es sich fluessig anfuehlt

Drei Sachen, ohne die das Verhoer sich zaeh angefuehlt hat:

**Vorlauf.** Die Fragen werden schon geholt, waehrend der Spieler die
Beschreibung der Person in der Untersuchungstafel liest. Die Sekunden zwischen
„auf die Gestalt geklickt" und „auf Ansprechen geklickt" sind geschenkte Zeit.

**Die alten Fragen bleiben stehen**, bis die neuen da sind — nur matt und ohne
die bereits gestellten. Vorher wurde die Zeile geleert, und der Spieler sass
vor einem Verhoer ganz ohne Schaltflaeche.

**Wenig nachdenken.** Fuer vier kurze Fragen bringt `thinkingLevel: 'low'`
nichts und kostet alles: gemessen 963 Denk-Token gegen 80 ausgegebene.
`minimal` schaltet das Nachdenken ab — 5,5 s auf 1,3 s bei gleichem Ergebnis.
Erlaubt sind nur `low` und `minimal`; `none` und `off` lehnt die API mit 400 ab.

Gemessen mit `node tools/verhoer-zeiten.mjs`: Verhoer oeffnen 10,2 s → 1,5 s.

**Achtung bei Aenderungen an `api/chat.js`:** Der Vorschau-Server laedt die
Datei beim Start ueber `vite.config.js`. Ein laufender Server bedient sonst
weiter den alten Stand — hier hat das einmal neun Sekunden Modelllatenz
vorgetaeuscht, die es nie gab.

Der Schluessel darf **nicht** ins Browser-Buendel — was dort landet, kann jeder
auslesen, und die Rechnung zahlt der Kontoinhaber. Deshalb kennt der Browser nur
`/api/chat`. Lokal bildet `vite.config.js` diesen Endpunkt nach (in `dev` **und**
`preview`), veroeffentlicht laeuft er als Serverless-Funktion:

```
cp .env.example .env     # GEMINI_API_KEY eintragen
```

Beim Veroeffentlichen dieselbe Variable in der Umgebung des Anbieters setzen.

Ein Hinweis zur Obergrenze in `api/chat.js`: Bei den Gemini-3-Modellen zaehlen
die **Denk-Token gegen dasselbe Budget** wie der ausgegebene Text und liegen
beim Acht- bis Zehnfachen davon (gemessen: 499 gedacht, 72 ausgegeben). Mit
`maxOutputTokens: 700` brachen Antworten mitten im Wort ab. Die Kuerze der
Figurenrede regelt die Anweisung, nicht dieses Limit.

## Handy

Das Bild fuellt in **beiden** Lagen den ganzen Schirm. Ein Band im oberen
Drittel mit der Bedienung darunter war einmal da und wurde wieder verworfen:
Der leere untere Teil liess das Bild kaputt aussehen, und von diesem Bild lebt
die Szene. Im Hochformat sieht man deshalb einen Ausschnitt; den Rest der Gasse
erreicht man durch **seitliches Ziehen** — das Bild folgt dem Finger 1:1, und
die Untersuchungspunkte wandern mit.

Was man untersucht, klappt **von unten** in die Tafel auf, statt das Bild zu
verdecken. Verhoere bekommen als einzige den ganzen Schirm — ein Gespraech
dauert laenger als ein Blick auf eine Kiste.

Ohne Mauszeiger gibt es kein Ueberfahren, deshalb sind die Punkte auf
Beruehrgeraeten dauerhaft schwach sichtbar und leuchten beim Antippen auf.

`src/ui/viewport.js` nagelt die vier Zoom-Wege von iOS einzeln zu — Kneifen,
Doppeltippen, Fokus auf ein Eingabefeld und Ueberziehen am Rand. Einen
einzelnen Schalter dafuer gibt es nicht; `user-scalable=no` allein ignoriert
Safari seit iOS 10.

## Aufbau

```
src/
  core/gl.js            WebGL2-Grundlagen: Programme, Render-Targets, Vollbild-Dreieck
  render/plates.js      Zeichenwerkzeuge: Fenstergitter, Neon, Feuerleitern, Rohre, Wandschein
  render/renderer.js    die Bildkette (Ebenen → Boden → Regen → Bloom → Endbild)
  render/params.js      sämtliche Bildparameter; das Overlay wird daraus erzeugt
  scene/projection.js   Lochkamera: Weltkoordinaten ↔ Plattenpixel
  scene/alley.js        „Kanalgasse" — baut den kompletten Plattensatz
  shaders/*.glsl        ein Shader pro Pass
  ui/overlay.js         Regler + Frame-Zeit-Kurve (F1)
  ui/viewport.js        Zoom-Sperren und Geraeteraender fuer Mobilgeraete
  game/scenes.js        Orte, Ausgaenge und Untersuchungspunkte, in Bildkoordinaten
  game/districts.js     Sektoren: Ankunftsort und was sie freischaltet
  game/spinner.js       Flugauto: Bordkarte und Flug zwischen den Sektoren
  game/world.js         Zustand der Ermittlung: Asservate, Analysen, Freischaltungen
  game/interaction.js   Hotspot-Ebene, Untersuchungstafel, Akte
  game/characters.js    Figuren: Wesen, Wissen, Geheimnis — und die Anweisung daraus
  game/anklage.js       Der Abschluss: Loesung, Beweislage, drei Enden, Nachspann
  game/speichern.js     Spielstand im Browser sichern und zuruecklesen
  game/talk.js          Verhoer: Vollbildansicht, Vorhalten, Spuren in die Akte
api/chat.js             Endpunkt fuer die Figurenrede (Schluessel bleibt serverseitig)
tools/welt-pruefen.mjs  Ermittlungslogik ohne Browser pruefen (166 Zusicherungen)
tools/abschluss-pruefen.mjs  den Abschluss im echten Browser durchspielen
tools/anweisung-pruefen.mjs  pruefen, dass keine Anweisung zu lang wird
tools/fragen-messen.mjs  zaehlen, wie viele Fragen bei voller Akte ankommen
tools/stand-pruefen.mjs  pruefen, dass ein Spielstand ein Neuladen ueberlebt
tools/fallwahl-pruefen.mjs  pruefen, dass die Fallwahl beim Neustart stimmt
tools/verhoer-grenze.mjs  pruefen, dass ein Verhoer nach neun Fragen endet
tools/beschneiden.mjs   eingebrannte schwarze Balken von einer Platte schneiden
tools/details.mjs       Nahaufnahmen fuer Untersuchungspunkte erzeugen
tools/verkleinern.mjs   Bilder auf die Groesse bringen, in der sie gezeigt werden
tools/verhoer-zeiten.mjs  Antwortzeiten im Verhoer messen
tools/shot.mjs          Standbilder aufnehmen (--backdrop, --reveal, --hotspot, --touch, --pan)
tools/gen.mjs           Platten von einem Bildmodell uebermalen lassen
prompts/                Bildanweisungen, getrennt vom Code
public/plates/          fertige Hintergruende (siehe README dort)
DECISIONS.md            Begründungen, vor allem für bewusste Abweichungen
```

## Platten durch echte Bilder ersetzen

Jede Ebene ist ein `<canvas>` in dem Objekt, das `buildAlley()` zurückgibt.
Ein KI-generiertes oder gemaltes Bild an dieser Stelle einzusetzen heißt: das
Canvas durch ein geladenes `Image` ersetzen. Renderer, Shader, Parallaxe,
Nebel und Spiegelung bleiben unverändert — sie kennen nur „Textur plus Tiefe".

Damit die Spiegelung weiter passt, muss das Bild denselben Horizont und
Fluchtpunkt verwenden wie `projection.js` (Horizont bei 61 % der Bildhöhe,
Fluchtpunkt mittig).

## Bildgroessen

Gemessen, weil es nicht offensichtlich ist: Ein Bild in **1K kostet genauso
viel wie in 2K** — 1235 gegen 1228 Ausgabe-Token. Die Abrechnung haengt daran,
DASS ein Bild entsteht, nicht an seiner Aufloesung.

Trotzdem ist die Groesse nicht egal:

| | Masse | Datei | Dauer |
|---|---|---|---|
| `--size 1K` | 1200×896 | 771 kB | 18 s |
| `--size 2K` | 2400×1792 | 3009 kB | 23 s |

Alles wird in 2K erzeugt und danach verkleinert.

**Erzeugt wird nebenlaeufig.** Ein Bild braucht 24,5 s, DREI gleichzeitig
brauchen ebenfalls 24 s — die Zeit geht fast vollstaendig fuer die Rechenzeit
des Bildmodells drauf, und die laeuft parallel. Der erste Stapel lief
nacheinander und hat dadurch das Dreifache gebraucht. `tools/details.mjs`
arbeitet jetzt vier auf einmal ab (`GEN_PARALLEL` setzt die Zahl).

Die JPEGs des Modells sind sehr schwach komprimiert. `tools/verkleinern.mjs`
packt sie nach — dasselbe 1200-px-Bild wiegt danach 222 statt 771 kB. Ueber
alle Nahaufnahmen: 157 MB → 13 MB.

## Standbilder aufnehmen

```
npm run build && npm run preview
node tools/shot.mjs --out shots/test.png --w 2560 --h 1440 --t 6
```

Kamera und Zeit werden eingefroren, damit zwei Aufnahmen vergleichbar sind.
