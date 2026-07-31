#version 300 es
precision highp float;

//#include <common.glsl>

/**
 * Regen in drei Tiefenbändern.
 * Fern: fein und dicht. Mitte: klare Striche. Nah: fett, unscharf, schwach —
 * das ist die Ebene, die dem Bild Tiefe gibt.
 *
 * Der Regen wird von der Szene beleuchtet: vor einer Neonreklame ist er hell,
 * in dunklen Ecken fast unsichtbar. Ohne das sieht Regen aus wie Bildrauschen.
 */

uniform sampler2D uScene;
uniform vec2  uResolution;
uniform float uTime;
uniform float uAmount;
uniform float uWind;
uniform float uWander;

out vec4 fragColor;

float band(vec2 uv, float scale, float speed, float thin, float density, float t, float slant) {
  vec2 p = uv * vec2(scale * 0.62, scale);
  p.x += p.y * slant;
  p.y -= t * speed;
  vec2 id = floor(p);
  vec2 f = fract(p);
  vec2 h = hash22(id);
  if (h.x > density) return 0.0;

  float dx = abs(f.x - (0.15 + h.y * 0.7));
  float streak = smoothstep(thin, 0.0, dx);

  // Kopf hell, Schweif ausfransend
  float dy = f.y;
  float body = smoothstep(0.0, 0.10, dy) * (1.0 - smoothstep(0.30, 0.95, dy));

  return streak * body;
}

void main() {
  vec2 suv = gl_FragCoord.xy / uResolution;
  float aspect = uResolution.x / uResolution.y;
  vec2 uv = vec2(suv.x * aspect, suv.y);
  vec3 scene = texture(uScene, suv).rgb;

  float t = uTime;
  float slant = 0.16 * uWind;

  // Ferner Schleier
  float far = band(uv + vec2(uWander * 0.02, 0.0), 130.0, 1.35, 0.055, 0.30, t, slant);
  // Mittlere Striche
  float mid = band(uv * 1.0 + vec2(31.7 + uWander * 0.06, 0.0), 62.0, 2.0, 0.085, 0.24, t, slant);
  // Nahe, unscharfe Tropfen
  float near = band(uv * 1.0 + vec2(77.1 + uWander * 0.16, 0.0), 22.0, 3.1, 0.30, 0.13, t, slant);

  float rain = far * 0.40 + mid * 0.75 + near * 0.42;

  // Beleuchtung durch die Umgebung: Regen streut das Licht, das da ist.
  // Grob umliegende Helligkeit abtasten, damit auch neben einer Lampe etwas ankommt.
  vec3 around = scene;
  around += texture(uScene, suv + vec2(0.012, 0.010)).rgb;
  around += texture(uScene, suv + vec2(-0.012, 0.010)).rgb;
  around += texture(uScene, suv + vec2(0.0, 0.026)).rgb;
  around *= 0.25;

  // Steiler Verlauf: im Dunkeln fast nichts, vor einer Reklame kräftig.
  // Flach angesetzt sieht Regen aus wie Bildrauschen über dem ganzen Bild.
  float amb = clamp(luma(around), 0.0, 2.5);
  float lit = 0.045 + amb * amb * 1.15;

  // Leicht bläulich, aber die Farbe der Umgebung schlägt durch.
  vec3 rainCol = mix(vec3(0.62, 0.78, 0.95), normalize(around + 1e-4) * 1.15, 0.45);

  fragColor = vec4(scene + rainCol * rain * lit * uAmount, 1.0);
}
