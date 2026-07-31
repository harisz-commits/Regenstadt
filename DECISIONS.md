# Entscheidungen

Kurze Begründungen für alles, was nicht selbsterklärend ist — vor allem dort,
wo bewusst von der physikalisch korrekten Lösung abgewichen wurde.

## Grundsatz: vorgerenderte Platten statt Echtzeit-3D

Das Blade-Runner-Spiel von 1997 hat seine Hintergründe **vorgerendert** und zu
jedem Bild eine Tiefeninformation gespeichert. Genau dieses Vorgehen wird hier
übernommen, nur erzeugt Code die Bilder statt einer 3D-Software.

Ein Point-and-Click braucht keine Echtzeit-Geometrie. Es braucht ein gutes Bild
und eine lebendige Schicht darüber. Das verlagert das gesamte Rechenbudget von
„Geometrie pro Frame" nach „Optik pro Pixel" — und Optik ist das, was man sieht.

Jede Platte ist ein `<canvas>`. Wer sie durch ein KI-generiertes Bild ersetzen
will, tauscht genau dieses eine Canvas aus; Renderer und Shader ändern sich nicht.

## Zentralprojektion in den Platten (`src/scene/projection.js`)

Fassaden und Fenster werden über eine echte Lochkamera projiziert
(`sx = VP_X + X/d`, `sy = VP_Y + Y/d`). Das ist der Grund, warum die Gasse Tiefe
hat: Fensterachsen werden mit der Entfernung korrekt enger, Etagenhöhen
schrumpfen im gleichen Verhältnis, und alle Kanten laufen auf denselben
Fluchtpunkt zu.

Der Nebeneffekt ist wichtiger als die Optik: Weil die Projektion bekannt ist,
kann der Boden-Shader aus einem Bildschirm-Y die Tiefe zurückrechnen
(`d = CAM_H / (sy - VP_Y)`) und Pfützenkräuselung in Weltkoordinaten rechnen.
Ripples werden dadurch mit der Entfernung kleiner, statt gleichmäßig über den
Bildschirm zu laufen.

## Spiegelung an der Horizontlinie — mit Stauchung

Für eine ebene Bodenfläche gilt: das Spiegelbild eines Objekts ist die
Spiegelung an der Linie, an der das Objekt den Boden berührt. Für einen
Bodenpixel in Bildschirmhöhe `y` liegt die Quelle des reflektierten Strahls bei

    y_src = VP_y - (y - VP_y) · k

wobei `k = 1` **exakt** für unendlich weit entfernte Objekte gilt und die
Spiegelung für nahe Objekte staucht (Herleitung: der reflektierte Strahl von
Tiefe `d_g` trifft bei zusätzlicher Tiefe `s` auf Bildschirmhöhe
`VP_y + h·(2d_g − s)/(d_g·s)`, was für `s → ∞` gegen `2·VP_y − y` läuft).

**Abweichung:** Der Standardwert ist `k = 0,62`, nicht `1,0`. Physikalisch
korrekt spiegelt die nahe Fahrbahn die dunklen Fassadenoberkanten — technisch
richtig und bildlich wertlos. `0,62` holt die Leuchtreklamen in den
Vordergrund. Das ist der Grund, warum man nasse Straßen überhaupt filmt.
Regelbar über „Spiegelstauchung" im Overlay.

## Licht auf den Wänden wird in die Platte gebacken

Eine Platte kennt keine Beleuchtung. Ohne Gegenmaßnahme schweben Fenster und
Reklamen auf schwarzen Flächen, und das Bild liest sich sofort als Collage.

Deshalb sammelt `plateStreet` alle Leuchtquellen ein und legt am Ende — wenn
beide Straßenseiten stehen — deren Schein per `source-atop` auf das bereits
Gezeichnete. `source-atop` begrenzt den Schein auf vorhandenes Mauerwerk,
sodass nichts in die leere Gasse leuchtet. Eine Reklame links hellt dadurch
auch die Fassade rechts auf.

## Was bewusst schwach gezeichnet ist

Lichtkegel, Ladenschilder und Fensterglühen sind in den Platten deutlich
schwächer angelegt, als sie im Endbild erscheinen. Bloom, Nebelstreuung und
die HDR-Anhebung im Shader verstärken sie um ein Vielfaches. Wird schon die
Platte kräftig gezeichnet, brennt die Gasse zu weißen Flächen aus — das war der
Zustand nach dem ersten Durchlauf (`shots/m1-01.png`).

## Regen wird von der Szene beleuchtet

Der Regen-Shader tastet die Umgebungshelligkeit ab und skaliert die
Tropfenhelligkeit mit deren Quadrat. Flach angesetzt legt sich Regen als
gleichmäßiges Rauschen über das ganze Bild und liest sich als Bildfehler. Mit
steilem Verlauf ist er vor einer Reklame kräftig und in dunklen Ecken
praktisch unsichtbar — so verhält sich echter Regen auch.

## Kein Fallback-Pfad

WebGL2 ohne Ausweichlösung. Kein WebGL1-Zweig, keine Funktionserkennung. Fehlt
WebGL2, erscheint eine Textzeile. Zeit, die in Kompatibilität fließt, fließt
nicht in das Bild.

## Vignette nach unten begrenzt

Eine Vignette, die die Ecken auf Null zieht, schneidet das Bild auf einen Kreis
zurecht, statt es zu rahmen — nach dem zweiten Durchlauf lag knapp die Hälfte
der Fläche in Schwarz. Die Abdunklung ist jetzt auf 72 % begrenzt.

## Screenshots statt Testsuite

`tools/shot.mjs` nimmt Standbilder auf. Es gibt keine Testsuite. Bei einem
Projekt, dessen einziges Erfolgskriterium „sieht gut aus" lautet, ist die
Rückkopplung das Hinsehen, nicht ein grüner Balken. Aufnahmen frieren Kamera
und Zeit ein, damit zwei Bilder vergleichbar sind.

## Generierte Platten: was sich dadurch ändert

Die Bühne wird von einem Bildmodell übermalt (`tools/gen.mjs`). Der
prozedurale Render geht als Bildvorlage hinein, nicht als Textprompt — dadurch
bleiben Horizont, Fluchtpunkt und die Lage jeder Lichtquelle erhalten, und die
Projektion in `projection.js` gilt weiter.

Drei Dinge folgen daraus:

**Der Bodenpass darf die Straße nicht mehr ersetzen.** Das Modell malt die
nasse Fahrbahn mit. Würde der Bodenpass wie bisher Albedo und Spiegelung
selbst berechnen, überdeckte eine glatte Fläche den gemalten Asphalt. Im
Plattenmodus (`uPlateMode`) kräuselt er deshalb nur noch das vorhandene Bild.
Die Pfützen leben, aber es wird nichts neu erfunden.

**Die Bildkette braucht eine zweite Abstimmung** (`platePreset`). Ein
generiertes Bild ist bereits belichtet und durchgezeichnet; HDR-Anhebung,
kräftiger Bloom, Nebel und Streulicht ein zweites Mal darüber waschen es aus.
Objektiv-Effekte bleiben stark, denn die stecken nicht in der Platte — aber
Verzeichnung und Farbsaum sind zurückgenommen, weil die Platte am Bildrand
endet und ein weiter außen greifendes Objektiv ins Leere tastet.

**Die Stadt ist nicht mehr pro Durchgang neu.** Vorher würfelte jeder Seed
eine andere Gasse. Mit gemalten Platten liegt die Optik fest, und variabel
bleibt der Fall — genau das Modell des Blade-Runner-Spiels von 1997. Der
prozedurale Weg bleibt als Rückfall erhalten: fehlt die Plattendatei, zeichnet
das Spiel wie zuvor.

## Nahaufnahmen statt nur Text

Ein Untersuchungspunkt zeigte anfangs nur einen Satz. Das ist zu wenig — beim
Anklicken soll etwas passieren. Wichtige Punkte haben jetzt eine **Nahaufnahme**
(`detail` in `scenes.js`), erzeugt aus demselben Hintergrundbild mit der
Anweisung „dieselbe Kamera, nur viel näher". Dadurch stimmen Licht, Wetter,
Farben und Umgebung mit der Weitsicht überein; die Nahsicht liest sich als
derselbe Ort und nicht als fremdes Bild.

## Kreis heißt ansehen, Pfeil heißt hingehen

Ausgänge bekommen einen Pfeil statt eines Kreises und sind dauerhaft sichtbar.
Wohin man gehen kann, soll man sehen, ohne danach zu suchen — und die beiden
Bedeutungen dürfen nicht gleich aussehen.

## Kein Übergang auf der Deckkraft der Marken

Die Hotspot-Schaltflächen bekommen jeden Frame neue Inline-Maße. Dabei startete
der CSS-Übergang auf `opacity` ständig neu und blieb bei `currentTime: 0`
hängen — die Marke wurde nie sichtbar, obwohl der Selektor nachweislich griff
und die Regel die höhere Spezifität hatte. Ein frisch eingefügtes Element mit
derselben Klasse rechnete korrekt 0,8, das bestehende blieb auf 0.

Der Übergang ist entfernt. Das ist eine Umgehung, keine vollständige
Ursachenklärung: warum genau der Übergang neu startet, ist nicht abschließend
geklärt. Für eine rein kosmetische Einblendung war weiteres Graben den Aufwand
nicht wert.

## Was im Plattenbetrieb abgeschaltet ist

Der Dampf-Pass ist aus, sobald ein generiertes Bild geladen ist. Das Bild
bringt gemalten Dampf an den Schloten mit; ein zweiter, animierter Dampf
darüber liest sich als ständiges Aufsteigen und lenkt vom Regen ab.
