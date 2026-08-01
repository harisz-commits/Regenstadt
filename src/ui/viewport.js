/**
 * Anzeigebereich für Mobilgeräte absichern.
 *
 * Vier verschiedene Zoom-Wege muss man auf iOS einzeln zunageln — es gibt
 * keinen einzelnen Schalter dafür:
 *
 *  1. Kneifen mit zwei Fingern   → `gesturestart` und Folgeereignisse abfangen.
 *     `user-scalable=no` im Viewport-Tag ignoriert Safari seit iOS 10.
 *  2. Doppeltippen               → `touch-action: manipulation` plus
 *     `dblclick` abfangen.
 *  3. Fokus auf ein Eingabefeld  → Safari zoomt automatisch hinein, wenn die
 *     Schriftgröße unter 16 px liegt. Deshalb sind Eingabefelder hier auf
 *     16 px festgelegt. Das ist der Grund für die Regel, nicht Geschmack.
 *  4. Überziehen am Rand         → `overscroll-behavior: none`, sonst wackelt
 *     die ganze Seite beim Wischen über dem Bild.
 *
 * Dazu die Aussparungen randloser Geräte: `viewport-fit=cover` im Tag und
 * `env(safe-area-inset-*)` in den Abständen, damit nichts unter der Uhr oder
 * dem Streifen am unteren Rand verschwindet.
 */

const GUARD_CSS = `
html, body {
  touch-action: manipulation;
  overscroll-behavior: none;
  -webkit-text-size-adjust: 100%;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  -webkit-user-select: none;
}
/* Die Bildflaeche gehoert dem Spiel, nicht dem Browser.
 *
 * "manipulation" oben schaltet nur das Doppeltippen ab; Wischgesten wertet
 * Chrome auf Android weiter selbst aus. Sobald er eine davon als Seitenlauf
 * einstuft, uebernimmt er sie und schickt pointercancel — und das Ziehen
 * bricht mitten in der Bewegung ab. Unter iOS faellt das nicht auf, weil die
 * Seite dort ohnehin nicht laufen kann.
 *
 * ACHTUNG beim Bearbeiten: Dieser Block steht in einer Template-Zeichenkette.
 * Ein Backtick im Kommentar beendet sie und der Build bricht ab.
 *
 * "none" sagt dem Browser: Hier gibt es nichts zu entscheiden. Bewusst nur
 * auf Bild und Punktebene — Tafel, Verhoer und Karte muessen scrollen. */
#stage, #hs-layer { touch-action: none; }

/* Eingabefelder: 16 px verhindern den Zoom beim Antippen unter iOS. */
input, textarea, select {
  font-size: 16px !important;
  -webkit-user-select: text;
  user-select: text;
}
/* Höhe echter Anzeigefläche — 100vh ist auf Mobilgeräten falsch, solange
   die Adressleiste ein- und ausfährt. */
#stage { height: 100dvh; }
`;

export function guardViewport() {
  const style = document.createElement('style');
  style.textContent = GUARD_CSS;
  document.head.appendChild(style);

  const meta = document.querySelector('meta[name="viewport"]');
  if (meta) {
    meta.setAttribute(
      'content',
      'width=device-width, initial-scale=1, maximum-scale=1, ' +
      'user-scalable=no, viewport-fit=cover',
    );
  }

  // Kneifzoom
  for (const t of ['gesturestart', 'gesturechange', 'gestureend']) {
    document.addEventListener(t, (e) => e.preventDefault(), { passive: false });
  }
  // Doppeltipp-Zoom
  document.addEventListener('dblclick', (e) => e.preventDefault(), { passive: false });

  // Zweifingergesten über dem Bild, die sonst die Seite verschieben.
  document.addEventListener('touchmove', (e) => {
    if (e.touches.length > 1) e.preventDefault();
  }, { passive: false });
}

/** true, wenn das Gerät keinen Mauszeiger hat (Tippen statt Überfahren). */
export function isTouch() {
  return matchMedia('(hover: none), (pointer: coarse)').matches;
}
