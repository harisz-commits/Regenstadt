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
tools/shot.mjs          Standbilder aufnehmen
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
