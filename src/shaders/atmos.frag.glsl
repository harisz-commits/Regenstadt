#version 300 es
precision highp float;

//#include <common.glsl>

/**
 * Alles, was in der Luft hängt: Lichtschächte, Dunst, Dampf.
 *
 * Ohne diesen Pass ist die Gasse ein sauberes Bild von Wänden. Mit ihm steht
 * Luft zwischen der Kamera und der Wand — und erst das erzeugt Tiefe, die man
 * nicht nur an der Perspektive abliest.
 */

uniform sampler2D uScene;
uniform vec2  uResolution;
uniform vec2  uVP;         // Fluchtpunkt in Bildschirm-UV
uniform float uHorizonY;
uniform float uTime;
uniform float uRays;
uniform float uHaze;
uniform float uSteam;
uniform float uWander;

out vec4 fragColor;

const int RAY_SAMPLES = 16;

/* Aufsteigende Dampfsäule aus einem Gully. */
float steamColumn(vec2 uv, float cx, float baseY, float wide, float hgt, float t, float seed) {
  float y = (uv.y - baseY) / hgt;
  if (y < 0.0 || y > 1.0) return 0.0;

  // Verwirbelung: nach oben breiter und langsamer werdend.
  float drift = (fbm3(vec2(uv.y * 3.4 + seed, t * 0.10)) - 0.5) * 0.10 * y;
  float x = (uv.x - cx - drift) / (wide * (0.45 + y * 1.5));

  float n = fbm3(vec2(uv.x * 7.0 + seed, uv.y * 4.2 - t * 0.22 + seed));
  float body = exp(-x * x * 2.6);
  // Unten schmal ansetzen, oben auflösen.
  float fade = smoothstep(0.0, 0.10, y) * (1.0 - smoothstep(0.30, 1.0, y));
  return body * fade * smoothstep(0.32, 0.85, n);
}

void main() {
  vec2 suv = gl_FragCoord.xy / uResolution;
  float aspect = uResolution.x / uResolution.y;
  vec3 col = texture(uScene, suv).rgb;

  /* --- Lichtschächte -----------------------------------------------------
     Die Gasse läuft in einen hellen Dunstkern aus. Ein radialer Schmier von
     dort nach außen ergibt genau die Schächte, die durch Regen sichtbar
     werden. */
  vec2 delta = (suv - uVP) / float(RAY_SAMPLES) * 0.46;
  vec2 p = suv;
  float decay = 1.0;
  vec3 rays = vec3(0.0);
  for (int i = 0; i < RAY_SAMPLES; i++) {
    p -= delta;
    vec3 s = texture(uScene, p).rgb;
    // Hohe Schwelle: nur wirklich helle Stellen werfen Schächte. Niedriger
    // angesetzt verschmiert der Pass auch die Wände und legt flache Bänder
    // über das Bild, statt Licht in die Luft zu stellen.
    rays += max(vec3(0.0), s - 0.95) * decay;
    decay *= 0.93;
  }
  rays /= float(RAY_SAMPLES);
  // Nahe am Kern ausblenden, sonst entsteht dort ein harter Fleck.
  float rmask = smoothstep(0.02, 0.28, length((suv - uVP) * vec2(aspect, 1.0)));
  col += rays * uRays * rmask * vec3(1.0, 0.86, 0.74);

  /* --- Dunst -------------------------------------------------------------
     Zwei gegenläufige Schleier, damit nichts als Muster lesbar wird. */
  vec2 hp = vec2(suv.x * aspect, suv.y);
  float haze = fbm3(hp * 2.1 + vec2(uTime * 0.020 + uWander * 0.05, uTime * 0.008));
  haze += fbm3(hp * 3.7 + vec2(-uTime * 0.014, uTime * 0.011)) * 0.6;
  haze /= 1.6;
  // Am dichtesten knapp über der Straße, nach oben ausdünnend.
  float band = exp(-pow((suv.y - uHorizonY + 0.06) * 3.1, 2.0));
  vec3 hazeCol = mix(vec3(0.30, 0.40, 0.60), vec3(0.62, 0.44, 0.40), smoothstep(0.35, 0.65, suv.x));
  col += hazeCol * haze * band * uHaze * 0.16;

  /* --- Dampf -------------------------------------------------------------- */
  float st = 0.0;
  st += steamColumn(suv, 0.395, uHorizonY - 0.30, 0.030, 0.40, uTime, 0.0);
  st += steamColumn(suv, 0.615, uHorizonY - 0.20, 0.022, 0.32, uTime, 13.7) * 0.8;
  st += steamColumn(suv, 0.520, uHorizonY - 0.09, 0.014, 0.22, uTime, 41.2) * 0.6;
  // Dampf fängt das Licht, das um ihn herum liegt.
  vec3 near = texture(uScene, suv + vec2(0.0, 0.04)).rgb + texture(uScene, suv).rgb;
  col += mix(vec3(0.55, 0.62, 0.75), near * 0.5, 0.55) * st * uSteam * 0.5;

  fragColor = vec4(col, 1.0);
}
