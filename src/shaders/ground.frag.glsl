#version 300 es
precision highp float;

//#include <common.glsl>

/**
 * Nasse Straße.
 *
 * Die Spiegelung ist eine Spiegelung an der Horizontlinie. Das ist für eine
 * ebene Bodenfläche exakt richtig für unendlich weit entfernte Objekte und
 * staucht für nahe — deshalb der Faktor uReflectSquash. Herleitung in
 * DECISIONS.md.
 *
 * Kräusel- und Pfützenkoordinaten werden in WELTkoordinaten gerechnet
 * (aus dem Bildschirm-Y zurückprojiziert), damit Ripples mit der Entfernung
 * korrekt kleiner werden statt gleichmäßig über den Bildschirm zu laufen.
 */

uniform sampler2D uScene;   // bisher komponierte Szene (Bildschirmraum)
uniform sampler2D uGround;  // Asphalt-Albedo (Platte)
uniform sampler2D uWet;     // R=Pfütze  G=Rauheit  B=Grundnässe

uniform vec2  uResolution;
uniform vec2  uUvScale;
uniform vec2  uUvOffset;
uniform float uTime;

uniform float uHorizonY;       // Horizont in Bildschirm-UV (0 unten … 1 oben)
uniform float uPlateHorizon;   // VP_Y / PLATE_H
uniform float uPlateCamH;      // CAM_H / PLATE_H
uniform float uPlateVpX;       // VP_X / PLATE_W

uniform float uReflect;        // Spiegelstärke
uniform float uReflectSquash;  // 1.0 = reine Horizontspiegelung
uniform float uRipple;         // Stärke der Regentropfen-Ringe
uniform float uRainWind;
uniform float uWander;         // seitlicher Kameraversatz, für die Ripple-Welt

out vec4 fragColor;

/* Regentropfen-Ringe auf der Wasseroberfläche, in Weltkoordinaten. */
vec2 rippleNormal(vec2 wp, float t) {
  vec2 n = vec2(0.0);
  // Drei Frequenzbänder, damit Ringe unterschiedlich groß einschlagen.
  for (int k = 0; k < 3; k++) {
    float sc = 3.0 + float(k) * 5.0;
    vec2 p = wp * sc;
    vec2 id = floor(p);
    vec2 f = fract(p) - 0.5;
    for (int oy = -1; oy <= 1; oy++) {
      for (int ox = -1; ox <= 1; ox++) {
        vec2 o = vec2(float(ox), float(oy));
        vec2 h = hash22(id + o + float(k) * 37.0);
        // Einschlagszeitpunkt pro Zelle versetzt
        float period = 1.1 + h.y * 1.4;
        float age = fract((t + h.x * period) / period) * period;
        vec2 c = o + h - 0.5 - f;
        float r = length(c);
        float front = age * 1.5;             // Ringradius wächst
        float w = exp(-abs(r - front) * 16.0) * exp(-age * 2.6);
        if (w > 0.0005 && r > 0.0001) {
          n += normalize(c) * w * sin((r - front) * 42.0);
        }
      }
    }
  }
  return n;
}

void main() {
  vec2 suv = gl_FragCoord.xy / uResolution;
  vec2 uv = (suv - 0.5) * uUvScale + 0.5 + uUvOffset;

  vec3 scene = texture(uScene, suv).rgb;

  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
    fragColor = vec4(scene, 1.0);
    return;
  }

  vec4 g = texture(uGround, uv);
  if (g.a <= 0.002) { fragColor = vec4(scene, 1.0); return; }

  vec4 wet = texture(uWet, uv);

  // --- Tiefe aus der Plattenposition zurückrechnen ------------------------
  // Plattentextur: y läuft von unten(0) nach oben(1); Horizont bei uPlateHorizon.
  float below = uPlateHorizon - uv.y;          // >0 unterhalb des Horizonts
  float d = uPlateCamH / max(below, 0.0015);   // Tiefe in Weltblöcken
  float Xw = (uv.x - uPlateVpX) * d;           // seitliche Weltkoordinate

  // --- Kräuselung ---------------------------------------------------------
  vec2 world = vec2(Xw * 5.2 + uWander * 2.0, d * 1.35 - uTime * 0.035 * uRainWind);
  vec2 rn = rippleNormal(world, uTime) * uRipple;
  // Langsame Grundwelle, damit auch ohne Einschläge etwas lebt.
  rn += vec2(
    fbm(world * 1.7 + vec2(0.0, uTime * 0.12)) - 0.5,
    fbm(world * 1.7 + vec2(11.3, uTime * 0.09)) - 0.5
  ) * 0.28 * uRipple;

  // Störung in Bildschirmpixel umrechnen: nah = stark, fern = kaum.
  float persp = 1.0 / d;
  vec2 distort = rn * vec2(0.0075, 0.0075) * persp;

  // --- Spiegelung ---------------------------------------------------------
  float dy = suv.y - uHorizonY;                    // negativ (unter Horizont)
  float srcY = uHorizonY - dy * uReflectSquash;
  vec2 rUv = vec2(suv.x, srcY) + distort;

  float rough = 0.35 + wet.g * 0.9;
  // Rauheit weicht die Spiegelung auf — vier vertikal versetzte Proben.
  vec3 refl = vec3(0.0);
  float blur = rough * 0.006 * persp;
  refl += texture(uScene, rUv + vec2(0.0,  blur * 0.3)).rgb;
  refl += texture(uScene, rUv + vec2(0.0, -blur * 0.3)).rgb;
  refl += texture(uScene, rUv + vec2( blur * 0.5, blur)).rgb;
  refl += texture(uScene, rUv + vec2(-blur * 0.5, -blur)).rgb;
  refl *= 0.25;

  // Streifiges Ausbluten senkrecht — nasser Asphalt zieht Lichter in die Länge.
  refl += texture(uScene, rUv + vec2(0.0, blur * 2.6)).rgb * 0.35;
  refl /= 1.35;

  // --- Stärke -------------------------------------------------------------
  // Streifender Blickwinkel (nahe Horizont) spiegelt am stärksten.
  float grazing = smoothstep(0.0, 0.65, 1.0 - clamp(-dy / max(uHorizonY, 0.001), 0.0, 1.0));
  grazing = mix(0.68, 1.0, grazing);

  float puddle = wet.r;
  float base = wet.b * 0.42;                 // Restnässe überall
  float k = clamp((puddle + base) * grazing * uReflect, 0.0, 1.6);

  vec3 albedo = g.rgb;
  vec3 col = albedo * (1.0 - 0.55 * k) + refl * k;

  // Pfützenränder etwas dunkler — sonst schweben sie über dem Asphalt.
  col *= 1.0 - smoothstep(0.25, 0.0, puddle) * 0.12;

  fragColor = vec4(mix(scene, col, g.a), 1.0);
}
