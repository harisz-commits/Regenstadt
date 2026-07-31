/**
 * Die Bildkette.
 *
 *   Ebenen (Himmel → Ferne → Gasse)      → rtA
 *   Nasse Straße (liest rtA)              → rtB
 *   Vordergrund                           → rtB
 *   Regen (liest rtB)                     → rtA
 *   Bloom-Pyramide aus rtA                → mips
 *   Endbild (rtA + Bloom + Streulicht)    → Bildschirm
 */

import {
  createContext, createProgram, createTarget, textureFromCanvas,
  bindTarget, createFullscreenTriangle, bindTextures, resolveIncludes,
} from '../core/gl.js';
import { PLATE_W, PLATE_H } from './plates.js';
import { VP_X, VP_Y, CAM_H } from '../scene/projection.js';

import vsFullscreen from '../shaders/fullscreen.vert.glsl?raw';
import commonChunk from '../shaders/common.glsl?raw';
import fsLayer from '../shaders/layer.frag.glsl?raw';
import fsGround from '../shaders/ground.frag.glsl?raw';
import fsRain from '../shaders/rain.frag.glsl?raw';
import fsBloom from '../shaders/bloom.frag.glsl?raw';
import fsComposite from '../shaders/composite.frag.glsl?raw';

const CHUNKS = { 'common.glsl': commonChunk };
const BLOOM_MIPS = 6;
const PLATE_ASPECT = PLATE_W / PLATE_H;

export class Renderer {
  /** @param {HTMLCanvasElement} canvas */
  constructor(canvas, params) {
    this.canvas = canvas;
    this.params = params;

    const { gl, float } = createContext(canvas);
    if (!gl) throw new Error('WebGL2 wird von diesem Browser nicht unterstützt.');
    this.gl = gl;
    this.float = float;

    const P = (fs, label) => createProgram(gl, vsFullscreen, resolveIncludes(fs, CHUNKS), label);
    this.pLayer = P(fsLayer, 'layer');
    this.pGround = P(fsGround, 'ground');
    this.pRain = P(fsRain, 'rain');
    this.pBloom = P(fsBloom, 'bloom');
    this.pComposite = P(fsComposite, 'composite');

    this.tri = createFullscreenTriangle(gl);
    this.targets = null;
    this.scene = null;
    this.width = 0;
    this.height = 0;
    this.time = 0;
    this.cam = { x: 0, y: 0, mx: 0, my: 0 };
  }

  /** Lädt einen Plattensatz (siehe scene/alley.js) auf die GPU. */
  setScene(scene) {
    const gl = this.gl;
    if (this.scene) this.disposeScene();

    const up = (layer) => ({ ...layer, tex: textureFromCanvas(gl, layer.canvas) });
    this.scene = {
      ...scene,
      layers: scene.layers.map(up),
      foreground: (scene.foreground || []).map(up),
      ground: scene.ground
        ? {
            ...scene.ground,
            tex: textureFromCanvas(gl, scene.ground.canvas),
            wetTex: textureFromCanvas(gl, scene.ground.wet),
          }
        : null,
    };
  }

  disposeScene() {
    const gl = this.gl;
    for (const l of this.scene.layers) gl.deleteTexture(l.tex);
    for (const l of this.scene.foreground) gl.deleteTexture(l.tex);
    if (this.scene.ground) {
      gl.deleteTexture(this.scene.ground.tex);
      gl.deleteTexture(this.scene.ground.wetTex);
    }
    this.scene = null;
  }

  resize(cssW, cssH) {
    const gl = this.gl;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const scale = this.params.renderScale;
    const w = Math.max(2, Math.round(cssW * dpr * scale));
    const h = Math.max(2, Math.round(cssH * dpr * scale));
    if (w === this.width && h === this.height) return;

    this.width = w;
    this.height = h;
    this.canvas.width = w;
    this.canvas.height = h;

    if (this.targets) {
      this.targets.a.dispose();
      this.targets.b.dispose();
      for (const m of this.targets.mips) m.dispose();
    }

    const f = this.float;
    const mips = [];
    let mw = w, mh = h;
    for (let i = 0; i < BLOOM_MIPS; i++) {
      mw = Math.max(1, mw >> 1);
      mh = Math.max(1, mh >> 1);
      mips.push(createTarget(gl, mw, mh, { float: f }));
    }
    this.targets = {
      a: createTarget(gl, w, h, { float: f }),
      b: createTarget(gl, w, h, { float: f }),
      mips,
    };
  }

  /** Bildschirm-UV → Platten-UV (Cover-Fit + Zoom). */
  uvScale() {
    const screenAspect = this.width / this.height;
    const z = 1 / this.params.zoom;
    return screenAspect > PLATE_ASPECT
      ? [z, (PLATE_ASPECT / screenAspect) * z]
      : [(screenAspect / PLATE_ASPECT) * z, z];
  }

  layerOffset(parallax) {
    const c = this.cam;
    return [
      -(c.x + c.mx) * parallax,
      -(c.y + c.my) * parallax * 0.55,
    ];
  }

  drawLayer(layer, target) {
    const gl = this.gl;
    const p = this.pLayer;
    p.use();
    bindTarget(gl, target, this.width, this.height);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const [sx, sy] = this.uvScale();
    const [ox, oy] = this.layerOffset(layer.parallax);
    gl.uniform2f(p.u('uResolution'), this.width, this.height);
    gl.uniform2f(p.u('uUvScale'), sx, sy);
    gl.uniform2f(p.u('uUvOffset'), ox, oy);
    gl.uniform1f(p.u('uFog'), layer.fog ?? 0);
    const fc = layer.fogColor || [0.3, 0.3, 0.4];
    gl.uniform3f(p.u('uFogColor'), fc[0], fc[1], fc[2]);
    gl.uniform1f(p.u('uEmissive'), layer.emissive ?? 1);
    gl.uniform1f(p.u('uHdrBoost'), this.params.hdrBoost);
    gl.uniform1f(p.u('uExposure'), 1.0);
    bindTextures(gl, p, [['uTex', layer.tex]]);
    this.tri.draw();
    gl.disable(gl.BLEND);
  }

  /** Horizontlinie in Bildschirm-UV (für die Spiegelung). */
  horizonScreenY(parallax) {
    const [, sy] = this.uvScale();
    const [, oy] = this.layerOffset(parallax);
    const plateHorizonUv = 1 - VP_Y / PLATE_H; // Textur ist Y-gespiegelt
    return (plateHorizonUv - 0.5 - oy) / sy + 0.5;
  }

  frame(dt) {
    const gl = this.gl;
    const P = this.params;
    if (!this.scene || !this.targets) return;
    this.time += dt;

    // Langsame Kamerafahrt — ein Standbild soll komponiert sein, aber leben.
    const t = this.time * P.driftSpeed;
    this.cam.x = Math.sin(t * 0.9) * 0.62 * P.drift + Math.sin(t * 0.31) * 0.38 * P.drift;
    this.cam.y = Math.sin(t * 0.63 + 1.7) * 0.35 * P.drift;

    const { a, b, mips } = this.targets;

    /* --- 1. Ebenen ------------------------------------------------------ */
    bindTarget(gl, a, this.width, this.height);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    for (const l of this.scene.layers) this.drawLayer(l, a);

    /* --- 2. Nasse Straße ------------------------------------------------ */
    let cur = a;
    if (this.scene.ground) {
      const g = this.scene.ground;
      const p = this.pGround;
      p.use();
      bindTarget(gl, b, this.width, this.height);
      const [sx, sy] = this.uvScale();
      const [ox, oy] = this.layerOffset(g.parallax);
      gl.uniform2f(p.u('uResolution'), this.width, this.height);
      gl.uniform2f(p.u('uUvScale'), sx, sy);
      gl.uniform2f(p.u('uUvOffset'), ox, oy);
      gl.uniform1f(p.u('uTime'), this.time);
      gl.uniform1f(p.u('uHorizonY'), this.horizonScreenY(g.parallax));
      gl.uniform1f(p.u('uPlateHorizon'), 1 - VP_Y / PLATE_H);
      gl.uniform1f(p.u('uPlateCamH'), CAM_H / PLATE_H);
      gl.uniform1f(p.u('uPlateVpX'), VP_X / PLATE_W);
      gl.uniform1f(p.u('uReflect'), P.reflect);
      gl.uniform1f(p.u('uReflectSquash'), P.reflectSquash);
      gl.uniform1f(p.u('uRipple'), P.ripple);
      gl.uniform1f(p.u('uRainWind'), P.wind);
      gl.uniform1f(p.u('uWander'), this.cam.x + this.cam.mx);
      bindTextures(gl, p, [['uScene', a.tex], ['uGround', g.tex], ['uWet', g.wetTex]]);
      this.tri.draw();
      cur = b;
    }

    /* --- 3. Vordergrund ------------------------------------------------- */
    for (const l of this.scene.foreground) this.drawLayer(l, cur);

    /* --- 4. Regen ------------------------------------------------------- */
    const dst = cur === a ? b : a;
    {
      const p = this.pRain;
      p.use();
      bindTarget(gl, dst, this.width, this.height);
      gl.uniform2f(p.u('uResolution'), this.width, this.height);
      gl.uniform1f(p.u('uTime'), this.time);
      gl.uniform1f(p.u('uAmount'), P.rain);
      gl.uniform1f(p.u('uWind'), P.wind);
      gl.uniform1f(p.u('uWander'), this.cam.x + this.cam.mx);
      bindTextures(gl, p, [['uScene', cur.tex]]);
      this.tri.draw();
    }
    const litScene = dst;

    /* --- 5. Bloom-Pyramide ---------------------------------------------- */
    const pb = this.pBloom;
    pb.use();
    // Hell-Filter
    bindTarget(gl, mips[0], this.width, this.height);
    gl.uniform2f(pb.u('uResolution'), mips[0].width, mips[0].height);
    gl.uniform1i(pb.u('uMode'), 0);
    gl.uniform1f(pb.u('uThreshold'), P.bloomThreshold);
    gl.uniform1f(pb.u('uKnee'), P.bloomKnee);
    gl.uniform2f(pb.u('uTexel'), 1 / litScene.width, 1 / litScene.height);
    bindTextures(gl, pb, [['uTex', litScene.tex]]);
    this.tri.draw();

    // Verkleinern
    gl.uniform1i(pb.u('uMode'), 1);
    for (let i = 1; i < mips.length; i++) {
      const src = mips[i - 1];
      bindTarget(gl, mips[i], this.width, this.height);
      gl.uniform2f(pb.u('uResolution'), mips[i].width, mips[i].height);
      gl.uniform2f(pb.u('uTexel'), 1 / src.width, 1 / src.height);
      bindTextures(gl, pb, [['uTex', src.tex]]);
      this.tri.draw();
    }

    // Vergrößern und additiv aufsummieren
    gl.uniform1i(pb.u('uMode'), 2);
    gl.uniform1f(pb.u('uRadius'), P.bloomRadius);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);
    for (let i = mips.length - 1; i > 0; i--) {
      const src = mips[i];
      bindTarget(gl, mips[i - 1], this.width, this.height);
      gl.uniform2f(pb.u('uResolution'), mips[i - 1].width, mips[i - 1].height);
      gl.uniform2f(pb.u('uTexel'), 1 / src.width, 1 / src.height);
      bindTextures(gl, pb, [['uTex', src.tex]]);
      this.tri.draw();
    }
    gl.disable(gl.BLEND);

    /* --- 6. Endbild ------------------------------------------------------ */
    {
      const p = this.pComposite;
      p.use();
      bindTarget(gl, null, this.width, this.height);
      gl.uniform2f(p.u('uResolution'), this.width, this.height);
      gl.uniform1f(p.u('uTime'), this.time);
      gl.uniform1f(p.u('uBloomAmount'), P.bloomAmount);
      gl.uniform1f(p.u('uScatterAmount'), P.scatter);
      gl.uniform3f(p.u('uScatterTint'), P.scatterTint[0], P.scatterTint[1], P.scatterTint[2]);
      gl.uniform1f(p.u('uAberration'), P.aberration);
      gl.uniform1f(p.u('uBarrel'), P.barrel);
      gl.uniform1f(p.u('uVignette'), P.vignette);
      gl.uniform1f(p.u('uGrain'), P.grain);
      gl.uniform1f(p.u('uExposure'), P.exposure);
      gl.uniform1f(p.u('uSaturation'), P.saturation);
      gl.uniform1f(p.u('uDroplets'), P.droplets);
      gl.uniform1f(p.u('uLift'), P.lift);
      bindTextures(gl, p, [
        ['uScene', litScene.tex],
        ['uBloom', mips[0].tex],
        ['uScatter', mips[mips.length - 1].tex],
      ]);
      this.tri.draw();
    }
  }
}
