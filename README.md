# REGENSTADT

Ein Neo-Noir Point-and-Click Adventure. Feste Kunstrichtung, variabler Inhalt.

Dieses Repository enthält aktuell **die Bühne**, noch nicht das Spiel: eine
Szene, deren Standbild für sich stehen muss, bevor Inhalt dazukommt.

```
npm install
npm run dev        # http://127.0.0.1:5173
```

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
(`src/game/hotspots.js`), nicht in Bildschirmprozenten. `plateUvToScreen()`
rechnet sie jeden Frame in Pixel um — inklusive Naeherungsumkehr der
Objektivverzeichnung. Dadurch wandern sie bei jeder Kamerabewegung mit dem Bild
mit und bleiben auch bei anderem Fensterformat auf ihrem Gegenstand.

Sichtbar ist normalerweise nichts. Beim Ueberfahren geht ein Lichtsaum **im
Bild** auf (`uHover` im Endbild-Shader), nicht als Marke davor. **TAB** gedrueckt
halten zeigt alle Punkte, **ESC** schliesst Tafel und Akte.

## Die Welt

Sechs Orte, und man geht nicht nur geradeaus. Ausgaenge kennen sechs
Richtungen (`forward`, `back`, `left`, `right`, `in`, `out`) mit je eigener
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

### Die Beweiskette

Damit eine Ermittlung nicht nach zwei Minuten durch ist, muss etwas von etwas
anderem abhaengen:

```
Muellcontainer → Schluesselkarte → oeffnet die Stahltuer
                                 → Lagerraum → Tuch mit dunklen Flecken
                                             → Laborschalter im Praesidium
                                             → vier Ortswechsel
                                             → Befund: fremdes Blut
```

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

Was in der Akte steht, wird der Figur als Kenntnisstand mitgegeben und
erscheint als **Vorhalten**-Knopf. Erst dann gibt Doran Vey zu, dass die
Frachtkisten ihm gehoeren. Gibt eine Figur etwas wirklich Neues preis, haengt
sie eine Zeile `[SPUR] …` an; die wandert in die Akte und steht ab dann selbst
zum Vorhalten bereit.

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
  game/world.js         Zustand der Ermittlung: Asservate, Analysen, Freischaltungen
  game/interaction.js   Hotspot-Ebene, Untersuchungstafel, Akte
  game/characters.js    Figuren: Wesen, Wissen, Geheimnis — und die Anweisung daraus
  game/talk.js          Verhoer: Vollbildansicht, Vorhalten, Spuren in die Akte
api/chat.js             Endpunkt fuer die Figurenrede (Schluessel bleibt serverseitig)
tools/welt-pruefen.mjs  Ermittlungslogik ohne Browser pruefen
tools/beschneiden.mjs   eingebrannte schwarze Balken von einer Platte schneiden
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

## Standbilder aufnehmen

```
npm run build && npm run preview
node tools/shot.mjs --out shots/test.png --w 2560 --h 1440 --t 6
```

Kamera und Zeit werden eingefroren, damit zwei Aufnahmen vergleichbar sind.
