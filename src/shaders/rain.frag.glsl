#version 300 es
precision highp float;

//#include <common.glsl>

/**
 * Regen in drei Tiefenbändern plus Aufschlag auf der Straße.
 *
 * Fern: fein und dicht. Mitte: klare, lange Striche. Nah: fett und unscharf —
 * das ist die Ebene, die dem Bild Tiefe gibt.
 *
 * Der Regen wird von der Szene beleuchtet, aber mit einem deutlichen
 * Grundwert: vor einer Reklame ist er hell, im Dunkeln bleibt er sichtbar.
 * Ganz ohne Grundwert verschwindet er in den Schatten, und dann sieht das
 * Bild nur nass aus, statt dass es regnet.
 */

uniform sampler2D uScene;
uniform vec2  uResolution;
uniform float uTime;
uniform float uAmount;
uniform float uWind;
uniform float uWander;
uniform float uHorizonY;   // für die Aufschläge auf der Straße

out vec4 fragColor;

/**
 * Ein Tropfenband. Die Zellen sind schmal und hoch, damit daraus lange
 * Striche werden und keine Punkte.
 */
float band(vec2 uv, float sx, float sy, float speed, float thin,
           float density, float len, float t, float slant) {
  vec2 p = vec2(uv.x * sx, uv.y * sy);
  p.x += p.y * slant;
  p.y -= t * speed;

  vec2 id = floor(p);
  vec2 f = fract(p);
  vec2 h = hash22(id);
  if (h.x > density) return 0.0;

  // Waagrechte Lage in der Zelle
  float dx = abs(f.x - (0.2 + h.y * 0.6));
  float streak = smoothstep(thin, thin * 0.15, dx);

  // Senkrechter Verlauf: heller Kopf, langer ausfransender Schweif
  float dy = f.y;
  float head = smoothstep(0.0, 0.045, dy);
  float tail = 1.0 - smoothstep(len * 0.35, len, dy);
  return streak * head * tail;
}

/** Aufschlag auf der Fahrbahn: kurzer heller Spritzer, der sofort vergeht. */
float splash(vec2 uv, float t) {
  // Zellen zum Horizont hin kleiner — die Straße läuft in die Tiefe.
  float below = max(uHorizonY - uv.y, 0.0);
  if (below <= 0.001) return 0.0;
  float persp = clamp(below / max(uHorizonY, 0.001), 0.0, 1.0);

  vec2 p = vec2(uv.x * (26.0 + 40.0 * (1.0 - persp)), below * 34.0);
  vec2 id = floor(p);
  vec2 f = fract(p) - 0.5;
  vec2 h = hash22(id);

  float period = 0.55 + h.y * 0.9;
  float age = fract((t + h.x * period) / period) * period;
  if (age > 0.22) return 0.0;

  // Kleiner waagrechter Strich, der aufblitzt und verlischt
  float grow = age / 0.22;
  float w = 0.16 + grow * 0.30;
  float body = smoothstep(w, 0.0, abs(f.x)) * smoothstep(0.16, 0.0, abs(f.y) * 2.2);
  return body * (1.0 - grow) * persp;
}

void main() {
  vec2 suv = gl_FragCoord.xy / uResolution;
  float aspect = uResolution.x / uResolution.y;
  vec2 uv = vec2(suv.x * aspect, suv.y);
  vec3 scene = texture(uScene, suv).rgb;

  float t = uTime;
  float slant = 0.13 * uWind;

  // Die Dichten sind der empfindlichste Wert im ganzen Shader. Beim ersten
  // Versuch stand hier das Dreifache, und das Bild war eine Wand aus weißen
  // Strichen — Regen liest man an einzelnen Tropfen, nicht an Menge.
  //
  // Fern: viele feine, kurze Striche
  float far  = band(uv + vec2(uWander * 0.02, 0.0), 190.0, 40.0, 1.05, 0.11, 0.085, 0.72, t, slant);
  // Mitte: die tragende Ebene, klare Striche
  float mid  = band(uv + vec2(31.7 + uWander * 0.06, 0.0), 95.0, 20.0, 1.55, 0.10, 0.075, 0.80, t, slant);
  // Nah: wenige, dicke, unscharfe Tropfen
  float near = band(uv + vec2(77.1 + uWander * 0.16, 0.0), 34.0, 9.0, 2.35, 0.30, 0.038, 0.92, t, slant);

  float rain = far * 0.30 + mid * 0.55 + near * 0.30;

  // Beleuchtung durch die Umgebung, grob abgetastet.
  vec3 around = scene;
  around += texture(uScene, suv + vec2(0.012, 0.010)).rgb;
  around += texture(uScene, suv + vec2(-0.012, 0.010)).rgb;
  around += texture(uScene, suv + vec2(0.0, 0.026)).rgb;
  around *= 0.25;

  float amb = clamp(luma(around), 0.0, 2.5);
  // Deutlicher Grundwert, damit der Regen auch im Dunkeln zu sehen ist —
  // und trotzdem kräftig, wo Licht auf ihn fällt.
  float lit = 0.13 + amb * 1.15;

  vec3 rainCol = mix(vec3(0.70, 0.82, 0.97), normalize(around + 1e-4) * 1.2, 0.40);
  vec3 col = scene + rainCol * rain * lit * uAmount;

  // Aufschläge auf der nassen Fahrbahn
  float sp = splash(suv, t);
  col += vec3(0.78, 0.87, 1.0) * sp * (0.35 + amb * 1.1) * uAmount * 0.85;

  fragColor = vec4(col, 1.0);
}
