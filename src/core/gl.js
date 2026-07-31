/**
 * Dünne WebGL2-Schicht: Kontext, Shader, Render-Targets, Vollbild-Dreieck.
 * Bewusst klein gehalten — keine Engine, nur das, was die Pässe brauchen.
 */

/** @param {HTMLCanvasElement} canvas */
export function createContext(canvas) {
  const gl = canvas.getContext('webgl2', {
    antialias: false,
    alpha: false,
    depth: false,
    stencil: false,
    // Nötig, damit Screenshots (Playwright) den gerenderten Frame sehen.
    preserveDrawingBuffer: true,
    powerPreference: 'high-performance',
  });
  if (!gl) return { gl: null, float: false };

  const float = !!gl.getExtension('EXT_color_buffer_float');
  gl.getExtension('OES_texture_float_linear');
  gl.disable(gl.DEPTH_TEST);
  gl.disable(gl.CULL_FACE);
  return { gl, float };
}

/**
 * Löst `//#include <name>` in Shaderquellen auf.
 * @param {string} src
 * @param {Record<string,string>} chunks
 */
export function resolveIncludes(src, chunks) {
  return src.replace(/^[ \t]*\/\/#include[ \t]+<([\w.-]+)>[ \t]*$/gm, (m, name) => {
    const chunk = chunks[name];
    if (chunk === undefined) throw new Error(`Shader-Include fehlt: ${name}`);
    return chunk;
  });
}

function compile(gl, type, src, label) {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(sh) || '';
    const numbered = src
      .split('\n')
      .map((l, i) => String(i + 1).padStart(4, ' ') + ' | ' + l)
      .join('\n');
    throw new Error(`Shader-Fehler [${label}]\n${log}\n${numbered}`);
  }
  return sh;
}

/**
 * @returns {{program: WebGLProgram, u: (name:string)=>WebGLUniformLocation|null, use: ()=>void}}
 */
export function createProgram(gl, vsSrc, fsSrc, label = 'program') {
  const vs = compile(gl, gl.VERTEX_SHADER, vsSrc, label + '.vert');
  const fs = compile(gl, gl.FRAGMENT_SHADER, fsSrc, label + '.frag');
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(`Link-Fehler [${label}]: ${gl.getProgramInfoLog(program)}`);
  }
  gl.deleteShader(vs);
  gl.deleteShader(fs);

  const cache = new Map();
  const u = (name) => {
    if (!cache.has(name)) cache.set(name, gl.getUniformLocation(program, name));
    return cache.get(name);
  };
  return { program, u, use: () => gl.useProgram(program) };
}

/** Render-Target mit einer Farbtextur. */
export function createTarget(gl, w, h, { float = false, filter = null, wrap = null } = {}) {
  const f = filter ?? gl.LINEAR;
  const wr = wrap ?? gl.CLAMP_TO_EDGE;
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(
    gl.TEXTURE_2D, 0,
    float ? gl.RGBA16F : gl.RGBA8,
    Math.max(1, w | 0), Math.max(1, h | 0), 0,
    gl.RGBA,
    float ? gl.HALF_FLOAT : gl.UNSIGNED_BYTE,
    null,
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, f);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, f);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wr);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wr);

  const fbo = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  return {
    tex, fbo,
    width: Math.max(1, w | 0),
    height: Math.max(1, h | 0),
    float,
    dispose() { gl.deleteTexture(tex); gl.deleteFramebuffer(fbo); },
  };
}

/** Textur aus einem Canvas (unsere „vorgerenderten" Platten). */
export function textureFromCanvas(gl, canvas, { mips = true } = {}) {
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  if (mips) {
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    const agg = gl.getExtension('EXT_texture_filter_anisotropic');
    if (agg) {
      const max = gl.getParameter(agg.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
      gl.texParameterf(gl.TEXTURE_2D, agg.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(8, max));
    }
  } else {
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  }
  return tex;
}

/** Bindet ein Target (oder den Bildschirm bei null) und setzt den Viewport. */
export function bindTarget(gl, target, screenW, screenH) {
  if (target) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
    gl.viewport(0, 0, target.width, target.height);
  } else {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, screenW, screenH);
  }
}

/**
 * Vollbild-Dreieck ohne Vertex-Buffer (Positionen kommen aus gl_VertexID).
 * Ein VAO braucht es trotzdem, sonst meckern manche Treiber.
 */
export function createFullscreenTriangle(gl) {
  const vao = gl.createVertexArray();
  return {
    draw() {
      gl.bindVertexArray(vao);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      gl.bindVertexArray(null);
    },
  };
}

/** Bindet Texturen auf die Einheiten 0..n und setzt die Sampler-Uniforms. */
export function bindTextures(gl, prog, entries) {
  for (let i = 0; i < entries.length; i++) {
    const [name, tex] = entries[i];
    gl.activeTexture(gl.TEXTURE0 + i);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.uniform1i(prog.u(name), i);
  }
}
