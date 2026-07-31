#version 300 es
// Vollbild-Dreieck aus gl_VertexID — kein Vertex-Buffer nötig.
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}
