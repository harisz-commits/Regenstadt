/**
 * Alle Bildparameter an einem Ort. Das Einstellungs-Overlay wird direkt aus
 * diesem Schema erzeugt — neuer Regler = ein Eintrag hier, sonst nichts.
 *
 * Die Werte sind das eigentliche Kunstwerk. Der Code drumherum ist nur das
 * Gerüst, an dem sie hängen.
 */

export const params = {
  // Auflösung & Kamera
  renderScale: 1.0,
  zoom: 1.10,
  drift: 0.30,        // Amplitude der langsamen Kamerabewegung
  driftSpeed: 0.055,
  mouseLook: 0.45,

  // Belichtung & Farbe
  exposure: 0.95,
  saturation: 1.18,
  lift: 0.45,

  // Ebenen
  hdrBoost: 1.5,

  // Nasse Straße
  reflect: 1.45,
  // Bewusst unter 1: physikalisch exakt wäre 1.0, aber dann spiegelt die
  // nahe Straße die dunklen Fassadenoberkanten. 0.62 holt die Leuchtreklamen
  // in den Vordergrund — der Grund, warum man nasse Straßen überhaupt filmt.
  reflectSquash: 0.62,
  ripple: 1.0,

  // Regen
  rain: 1.05,
  wind: 1.0,

  // Bloom
  bloomAmount: 0.50,
  bloomThreshold: 0.95,
  bloomKnee: 0.40,
  bloomRadius: 1.35,

  // Streulicht im Nebel
  scatter: 0.20,
  scatterTint: [1.0, 0.66, 0.55],

  // Objektiv
  aberration: 0.0030,
  barrel: 0.050,
  vignette: 0.90,
  grain: 0.045,
  droplets: 0.28,
};

/** Schema für das Overlay: [Schlüssel, Beschriftung, min, max, Schritt]. */
export const SCHEMA = [
  ['— BILD —'],
  ['exposure', 'Belichtung', 0.4, 2.5, 0.01],
  ['saturation', 'Sättigung', 0.0, 2.0, 0.01],
  ['lift', 'Schwarzwert', 0.0, 2.0, 0.01],
  ['hdrBoost', 'Neon-Überstrahlung', 0.0, 6.0, 0.05],

  ['— NASSE STRASSE —'],
  ['reflect', 'Spiegelstärke', 0.0, 2.0, 0.01],
  ['reflectSquash', 'Spiegelstauchung', 0.6, 1.2, 0.005],
  ['ripple', 'Kräuselung', 0.0, 3.0, 0.02],

  ['— REGEN —'],
  ['rain', 'Regenmenge', 0.0, 2.5, 0.01],
  ['wind', 'Wind', 0.0, 3.0, 0.02],
  ['droplets', 'Tropfen auf der Linse', 0.0, 2.0, 0.01],

  ['— LICHT —'],
  ['bloomAmount', 'Bloom', 0.0, 2.0, 0.01],
  ['bloomThreshold', 'Bloom-Schwelle', 0.0, 2.0, 0.01],
  ['bloomKnee', 'Bloom-Knie', 0.01, 1.0, 0.01],
  ['bloomRadius', 'Bloom-Radius', 0.5, 3.0, 0.01],
  ['scatter', 'Nebel-Streulicht', 0.0, 1.5, 0.01],

  ['— OBJEKTIV —'],
  ['aberration', 'Farbsaum', 0.0, 0.02, 0.0002],
  ['barrel', 'Verzeichnung', -0.2, 0.3, 0.005],
  ['vignette', 'Vignette', 0.0, 1.5, 0.01],
  ['grain', 'Korn', 0.0, 0.2, 0.001],

  ['— KAMERA —'],
  ['zoom', 'Zoom', 1.0, 1.6, 0.01],
  ['drift', 'Kameradrift', 0.0, 1.0, 0.01],
  ['mouseLook', 'Mausblick', 0.0, 1.5, 0.01],
  ['renderScale', 'Renderauflösung', 0.4, 1.0, 0.05],
];
