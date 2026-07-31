#version 300 es
precision highp float;

//#include <common.glsl>

/**
 * Endbild: Objektiv, Streulicht, Tonwertkurve, Korn.
 *
 * Reihenfolge ist Absicht: Verzeichnung und Tropfen verbiegen die UV, BEVOR
 * die Szene abgetastet wird — sonst liegen die Effekte auf dem Bild statt im
 * Strahlengang und sehen aufgeklebt aus.
 */

uniform sampler2D uScene;
uniform sampler2D uBloom;
uniform sampler2D uScatter;   // gröbste Bloom-Stufe = Lichtstreuung im Nebel

uniform vec2  uResolution;
uniform float uTime;

uniform float uBloomAmount;
uniform float uScatterAmount;
uniform vec3  uScatterTint;
uniform float uAberration;
uniform float uBarrel;
uniform float uVignette;
uniform float uGrain;
uniform float uExposure;
uniform float uSaturation;
uniform float uDroplets;
uniform float uLift;          // Schwarzwert anheben (Nebel vor der Linse)

/**
 * Überfahrener Untersuchungspunkt: xy = Bildschirm-UV, z = Radius, w = Stärke.
 *
 * Der Saum wird IM Bild aufgehellt, nicht als Marke davorgelegt. Ein Punkt,
 * der über der Szene schwebt, verrät sofort, dass Bild und Spiel zwei
 * getrennte Dinge sind.
 */
uniform vec4  uHover;

out vec4 fragColor;

/* --- Tropfen auf dem Objektiv ------------------------------------------- */
/* Liefert einen Brechungsversatz und einen Glanzanteil.                    */
vec3 lensDrops(vec2 uv, float aspect, float t) {
  vec2 off = vec2(0.0);
  float spec = 0.0;

  for (int layer = 0; layer < 2; layer++) {
    float scale = layer == 0 ? 7.0 : 12.0;
    vec2 p = vec2(uv.x * aspect, uv.y) * scale;

    // Ein Teil der Tropfen rinnt langsam nach unten.
    float lane = floor(p.x);
    float slide = hash11(lane + float(layer) * 13.7);
    p.y += slide < 0.35 ? t * (0.06 + slide * 0.25) : 0.0;

    vec2 id = floor(p);
    vec2 f = fract(p) - 0.5;
    vec2 h = hash22(id + float(layer) * 91.3);

    // Nur wenige Zellen tragen einen Tropfen. Mehr liest sich sofort als
    // verdreckte Linse und zieht die Aufmerksamkeit vom Bild ab.
    if (h.x > 0.10) continue;

    vec2 c = f - (h - 0.5) * 0.55;
    float r = length(c * vec2(1.0, 1.15));
    float rad = 0.10 + h.y * 0.14;

    float m = smoothstep(rad, rad * 0.35, r);
    if (m <= 0.0) continue;

    // Kugellinse: Versatz proportional zum Abstand vom Tropfenzentrum.
    float prof = sqrt(max(0.0, 1.0 - (r / rad) * (r / rad)));
    off += normalize(c + 1e-5) * prof * m * (0.020 + h.y * 0.018) / scale * 7.0;

    // Heller Rand, wo der Tropfen das Licht bündelt.
    spec += smoothstep(rad * 0.95, rad * 0.55, r) * (1.0 - smoothstep(rad * 0.55, 0.0, r)) * 0.55;
  }
  return vec3(off, spec);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  float aspect = uResolution.x / uResolution.y;

  // --- Objektivverzeichnung ---------------------------------------------
  vec2 cc = uv - 0.5;
  float r2 = dot(cc, cc);
  vec2 duv = uv + cc * r2 * uBarrel;

  // --- Regentropfen auf der Linse ---------------------------------------
  vec3 drop = lensDrops(uv, aspect, uTime);
  duv += drop.xy * uDroplets;

  // --- Chromatische Aberration ------------------------------------------
  vec2 dir = cc * (uAberration * (0.35 + r2 * 2.2));
  vec3 col;
  col.r = texture(uScene, duv + dir).r;
  col.g = texture(uScene, duv).g;
  col.b = texture(uScene, duv - dir).b;

  // --- Bloom + Streulicht ------------------------------------------------
  vec3 bloom = texture(uBloom, duv).rgb;
  col += bloom * uBloomAmount;

  vec3 scatter = texture(uScatter, duv).rgb;
  col += scatter * uScatterTint * uScatterAmount;

  // Tropfen fangen selbst Licht ein.
  col += drop.z * uDroplets * (0.25 + luma(bloom) * 1.6) * vec3(0.75, 0.86, 1.0);

  // --- Tonwert ------------------------------------------------------------
  col *= uExposure;
  col = tonemapACES(col);

  // Nebel hebt den Schwarzwert — echtes Schwarz gibt es in dieser Stadt nicht.
  col = col + uLift * vec3(0.055, 0.070, 0.105) * (1.0 - luma(col));

  float l = luma(col);
  col = mix(vec3(l), col, uSaturation);

  // --- Lichtsaum um den überfahrenen Punkt --------------------------------
  if (uHover.w > 0.001) {
    float aspH = uResolution.x / uResolution.y;
    float d = length((uv - uHover.xy) * vec2(aspH, 1.0));
    float rad = uHover.z * aspH;
    // Weicher Kern plus ein etwas hellerer Ring — das liest sich als Licht,
    // das auf die Sache fällt, und nicht als aufgeklebter Kreis.
    float core = 1.0 - smoothstep(0.0, rad, d);
    float ring = smoothstep(rad * 0.72, rad * 0.92, d) * (1.0 - smoothstep(rad * 0.92, rad * 1.12, d));
    float amt = (core * 0.55 + ring * 0.85) * uHover.w;
    col += col * amt * 0.85 + vec3(0.16, 0.21, 0.27) * amt * 0.5;
  }

  // --- Vignette ----------------------------------------------------------
  // Nach unten begrenzt: eine Vignette, die die Ecken auf Null zieht,
  // schneidet das Bild auf einen Kreis zurecht statt es zu rahmen.
  float vig = 1.0 - smoothstep(0.42, 1.15, length(cc * vec2(1.0, 1.10)) * 1.30) * 0.72;
  col *= mix(1.0, vig, uVignette);

  // --- Korn ---------------------------------------------------------------
  float g = hash12(gl_FragCoord.xy + fract(uTime) * 431.7) - 0.5;
  // In den Schatten stärker sichtbar, wie bei echtem Film.
  col += g * uGrain * (1.0 - l * 0.65);

  fragColor = vec4(max(col, 0.0), 1.0);
}
