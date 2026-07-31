#version 300 es
precision highp float;

//#include <common.glsl>

/**
 * Ein Shader für alle drei Bloom-Schritte, über uMode gewählt:
 *   0 = Hell-Filter mit weichem Knie
 *   1 = Downsample (13 Proben, Karis-Mittelung gegen Flimmern)
 *   2 = Upsample (3x3-Zelt), additiv über die nächstgrößere Stufe
 */

uniform sampler2D uTex;
uniform vec2  uTexel;     // 1 / Größe der QUELLtextur
uniform int   uMode;
uniform float uThreshold;
uniform float uKnee;
uniform float uRadius;

out vec4 fragColor;

uniform vec2 uResolution;

vec3 S(vec2 uv) { return texture(uTex, uv).rgb; }

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;

  if (uMode == 0) {
    vec3 c = S(uv);
    float l = luma(c);
    // Weiches Knie: kein harter Schnitt, sonst pumpt der Bloom.
    float soft = clamp(l - uThreshold + uKnee, 0.0, 2.0 * uKnee);
    soft = soft * soft / (4.0 * uKnee + 1e-5);
    float w = max(soft, l - uThreshold) / max(l, 1e-5);
    fragColor = vec4(c * w, 1.0);
    return;
  }

  if (uMode == 1) {
    vec2 t = uTexel;
    vec3 a = S(uv + vec2(-2.0, 2.0) * t);
    vec3 b = S(uv + vec2( 0.0, 2.0) * t);
    vec3 c = S(uv + vec2( 2.0, 2.0) * t);
    vec3 d = S(uv + vec2(-2.0, 0.0) * t);
    vec3 e = S(uv);
    vec3 f = S(uv + vec2( 2.0, 0.0) * t);
    vec3 g = S(uv + vec2(-2.0,-2.0) * t);
    vec3 h = S(uv + vec2( 0.0,-2.0) * t);
    vec3 i = S(uv + vec2( 2.0,-2.0) * t);
    vec3 j = S(uv + vec2(-1.0, 1.0) * t);
    vec3 k = S(uv + vec2( 1.0, 1.0) * t);
    vec3 l = S(uv + vec2(-1.0,-1.0) * t);
    vec3 m = S(uv + vec2( 1.0,-1.0) * t);

    vec3 res = e * 0.125;
    res += (a + c + g + i) * 0.03125;
    res += (b + d + f + h) * 0.0625;
    res += (j + k + l + m) * 0.125;
    fragColor = vec4(res, 1.0);
    return;
  }

  // Upsample
  vec2 t = uTexel * uRadius;
  vec3 res = S(uv + vec2(-1.0, 1.0) * t) * 1.0;
  res += S(uv + vec2( 0.0, 1.0) * t) * 2.0;
  res += S(uv + vec2( 1.0, 1.0) * t) * 1.0;
  res += S(uv + vec2(-1.0, 0.0) * t) * 2.0;
  res += S(uv) * 4.0;
  res += S(uv + vec2( 1.0, 0.0) * t) * 2.0;
  res += S(uv + vec2(-1.0,-1.0) * t) * 1.0;
  res += S(uv + vec2( 0.0,-1.0) * t) * 2.0;
  res += S(uv + vec2( 1.0,-1.0) * t) * 1.0;
  fragColor = vec4(res / 16.0, 1.0);
}
