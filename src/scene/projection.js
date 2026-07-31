/**
 * Eine echte Lochkamera-Projektion für die Platten.
 *
 * Weltkoordinaten (Kamera im Ursprung, blickt in +d):
 *   X  seitlich   (+ = rechts)
 *   Y  vertikal   (+ = unten)   — die Straße liegt bei Y = CAM_H
 *   d  Tiefe      (>0, in „Blocktiefen")
 *
 * Bildkoordinaten sind Plattenpixel (PLATE_W × PLATE_H).
 *
 * Daraus folgt alles Weitere: Fassaden konvergieren korrekt zum Fluchtpunkt,
 * Fenster werden mit der Entfernung enger, und der Boden-Shader kann aus
 * einem Bildschirm-Y die Tiefe zurückrechnen (siehe ground.frag).
 */

export const VP_X = 1280; // Fluchtpunkt X
export const VP_Y = 880;  // Fluchtpunkt Y = Horizont
export const CAM_H = 420; // Kamerahöhe über der Straße
export const STREET_HALF = 620; // halbe Straßenbreite in Weltkoordinaten

/** Weltpunkt → Plattenpixel. */
export function project(X, Y, d) {
  return [VP_X + X / d, VP_Y + Y / d];
}

/** Bildschirm-Y auf der Straße → Tiefe. Umkehrung von project(). */
export function depthAtY(sy) {
  return CAM_H / (sy - VP_Y);
}

/** Maßstab bei Tiefe d (1 = Nahdistanz). */
export function scaleAt(d) {
  return 1 / d;
}

/** Polygon aus Weltpunkten zeichnen. */
export function polyPath(ctx, pts) {
  ctx.beginPath();
  for (let i = 0; i < pts.length; i++) {
    const [x, y] = pts[i];
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

/** Viereck aus vier Weltpunkten (X,Y,d) füllen. */
export function fillQuadWorld(ctx, a, b, c, e) {
  polyPath(ctx, [
    project(a[0], a[1], a[2]),
    project(b[0], b[1], b[2]),
    project(c[0], c[1], c[2]),
    project(e[0], e[1], e[2]),
  ]);
  ctx.fill();
}
