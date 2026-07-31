import { Renderer } from './render/renderer.js';
import { params } from './render/params.js';
import { buildAlley } from './scene/alley.js';
import { createOverlay } from './ui/overlay.js';

const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('gl'));
const boot = document.getElementById('boot');
const fatal = document.getElementById('fatal');

function die(msg) {
  fatal.style.display = 'flex';
  fatal.textContent = msg;
  boot?.classList.add('gone');
  console.error(msg);
}

let renderer;
try {
  renderer = new Renderer(canvas, params);
} catch (e) {
  die(e.message);
  throw e;
}

let seed = 7;

function loadScene() {
  const t0 = performance.now();
  renderer.setScene(buildAlley(seed));
  console.info(`Platten gebaut in ${(performance.now() - t0).toFixed(0)} ms (Seed ${seed})`);
}

const overlay = createOverlay(params, {
  onChange: (key) => { if (key === 'renderScale') fit(true); },
  onReseed: () => { seed = (Math.random() * 1e9) | 0; loadScene(); },
});

function fit(force = false) {
  const w = window.innerWidth;
  const h = window.innerHeight;
  if (force) renderer.width = 0;
  renderer.resize(w, h);
}

addEventListener('resize', () => fit());

// Sanfter Mausblick — die Kamera folgt träge, nie sprunghaft.
let targetMx = 0, targetMy = 0;
addEventListener('pointermove', (e) => {
  targetMx = (e.clientX / window.innerWidth - 0.5) * 2;
  targetMy = (e.clientY / window.innerHeight - 0.5) * 2;
});

loadScene();
fit();

let last = performance.now();
let warmed = 0;

function loop(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;

  const k = 1 - Math.pow(0.001, dt); // rahmenratenunabhängige Dämpfung
  renderer.cam.mx += (targetMx * params.mouseLook - renderer.cam.mx) * k;
  renderer.cam.my += (targetMy * params.mouseLook - renderer.cam.my) * k;

  renderer.frame(dt);
  overlay.sample(performance.now() - now);

  // Erst nach ein paar Frames einblenden: alle Shader sind dann übersetzt,
  // die Render-Targets warm. Kein Ruckler im ersten Bild.
  if (warmed < 4) {
    warmed++;
    if (warmed === 4) {
      boot?.classList.add('gone');
      window.__ready = true;
    }
  }
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

// Haken für das Screenshot-Werkzeug (tools/shot.mjs)
window.__regenstadt = {
  renderer,
  params,
  reseed(s) { seed = s; loadScene(); },
  setTime(t) { renderer.time = t; },
  freeze() { params.drift = 0; params.mouseLook = 0; renderer.cam.mx = 0; renderer.cam.my = 0; },
};
