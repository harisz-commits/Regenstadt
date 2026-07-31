# Leistung

## Was pro Frame läuft

| Pass | Auflösung | Kosten-Treiber |
|---|---|---|
| Ebenen (4 Stück) | voll | eine Texturprobe pro Ebene, Alpha-Blending |
| Nasse Straße | voll | Kräuselung (2 Bänder × 3×3 Zellen) + 5 Szenenproben |
| Regen | voll | 3 Bänder + 4 Szenenproben für die Beleuchtung |
| Luft | voll | 16 Proben für die Lichtschächte, 4× fbm3 |
| Bloom | 6 Stufen ab ½ | 13-Punkt-Verkleinerung, 9-Punkt-Vergrößerung |
| Endbild | voll | 2 Tropfenlagen, 3 Proben für den Farbsaum |

Neun Vollbild-Pässe insgesamt, keine Geometrie außer einem Dreieck pro Pass.
Im Renderloop wird kein Objekt angelegt.

## Gemessen

**Auf echter Hardware ist noch nicht gemessen worden.** Die Zahlen unten
stammen aus dem Entwicklungscontainer, der über SwiftShader rendert — einen
reinen CPU-Rasterizer ohne Grafikkarte. Für einen Shader-lastigen Aufbau wie
diesen liegt das zwei bis drei Größenordnungen neben einer echten GPU. Die
Werte taugen als Verhältnis zueinander, nicht als Prognose.

| Stand | Median | 99. Perzentil |
|---|---|---|
| vor der Optimierung | 1133 ms | 3150 ms |
| nach der Optimierung | 983 ms | 2317 ms |

Die Optimierung war: ein Kräuselband weniger im Boden-Shader, 16 statt 26
Proben für die Lichtschächte, und `fbm3` (drei Oktaven) statt `fbm` (fünf) in
den heißen Schleifen. Im Bild ist der Unterschied nicht zu sehen.

Dass nur 13 % herauskamen, sagt das Wesentliche: die Kosten verteilen sich
gleichmäßig über alle neun Pässe, es gibt keinen einzelnen Ausreißer. Auf
einer GPU sind neun Vollbild-Pässe mit dieser ALU-Last unauffällig.

**Nächster Schritt:** `npm run dev`, **F1**, und die Frame-Zeit-Kurve auf der
Zielmaschine ablesen. Der Regler „Renderauflösung" ist der erste Hebel, falls
es klemmt — er skaliert alle Pässe gleichzeitig.

## Plattenbau

Die Platten entstehen einmalig beim Laden: **rund 5,5 s** im Container, und
auch das ist softwaregerendertes Canvas2D. Der bisher größte Einzelposten war
`grime()` mit rund 50 000 Einzelaufrufen von `fillRect` unter `overlay`; das
läuft jetzt über eine gekachelte Rauschtextur und kostete davor gut eine
Sekunde.

Bleibt der Bau auf Zielhardware spürbar, sind die nächsten Kandidaten die
`shadowBlur`-Aufrufe (in Canvas2D teuer, verteilt über Neon, Leuchtschrift und
Fensterglühen) und die rund 300 Radialverläufe der Nässemaske.
