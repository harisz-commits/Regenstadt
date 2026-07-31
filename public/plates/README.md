# Fertige Platten

Hier liegen übermalte oder gemalte Hintergründe. Der Renderer sucht beim Start
nach `<szenen-id>-backdrop.png` — also `alley-backdrop.png` für die Kanalgasse.

Wird die Datei gefunden, ersetzt sie den gesamten gezeichneten Ebenenstapel.
Boden, Nässemaske, Spiegelung, Regen, Luft und Objektiv laufen unverändert
weiter, weil sie nur die Projektion brauchen und nicht die Ebenen.
Fehlt die Datei, zeichnet das Spiel prozedural — ohne Fehlermeldung.

## Ablauf

    npm run build && npm run preview

    # 1. Vorlage exportieren: nur die Ebenen, ohne Boden, Regen und Objektiv.
    #    Der Bodenpass braucht genau dieses Bild als Spiegelquelle, deshalb
    #    darf die nasse Strasse darin noch nicht enthalten sein.
    node tools/shot.mjs --out shots/vorlage.png --w 1920 --h 1080 --backdrop 1

    # 2. Uebermalen lassen (setzt aktivierte Abrechnung im Google-Projekt voraus)
    node tools/gen.mjs --in shots/vorlage.png \
                       --out public/plates/alley-backdrop.png \
                       --prompt prompts/gasse.txt

    # 3. Neu bauen und ansehen
    npm run build && node tools/shot.mjs --out shots/ergebnis.png --w 1920 --h 1080

## Worauf ein Ersatzbild achten muss

Horizont und Fluchtpunkt muessen zur Projektion in `src/scene/projection.js`
passen: Horizont bei 61 % der Bildhoehe, Fluchtpunkt waagrecht mittig. Sonst
spiegelt die Strasse an der falschen Stelle.
