#version 300 es
precision highp float;

//#include <common.glsl>

uniform sampler2D uTex;
uniform vec2  uResolution;
uniform vec2  uUvScale;   // Plattenausschnitt (Aspekt + Zoom)
uniform vec2  uUvOffset;  // Parallaxe
uniform float uFog;
uniform vec3  uFogColor;
uniform float uEmissive;
uniform float uHdrBoost;  // hebt helle Stellen über 1.0, damit Bloom sie greift
uniform float uExposure;

out vec4 fragColor;

void main() {
  vec2 suv = gl_FragCoord.xy / uResolution;
  vec2 uv = (suv - 0.5) * uUvScale + 0.5 + uUvOffset;

  // Außerhalb der Platte gibt es nichts — kein Clamp-Schmieren an den Rändern.
  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
    fragColor = vec4(0.0);
    return;
  }

  vec4 t = texture(uTex, uv);
  if (t.a <= 0.001) { fragColor = vec4(0.0); return; }

  vec3 c = t.rgb * uEmissive;

  // Helle Flächen (Neon, Fenster) in den HDR-Bereich schieben.
  float l = luma(c);
  c += c * smoothstep(0.55, 1.0, l) * uHdrBoost;

  // Atmosphärische Perspektive: Kontrast fällt mit der Tiefe.
  c = mix(c, uFogColor, uFog);

  fragColor = vec4(c * uExposure, t.a);
}
