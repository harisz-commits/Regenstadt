import { Renderer } from './render/renderer.js';
import { params, platePreset } from './render/params.js';
import { buildAlley } from './scene/alley.js';
import { createOverlay } from './ui/overlay.js';
import { createInteraction } from './game/interaction.js';
import { SCENES } from './game/scenes.js';
import { guardViewport, isTouch } from './ui/viewport.js';

// Zoom-Sperren und Geraeteraender setzen, bevor irgendetwas gezeichnet wird.
guardViewport();

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
let backdropOnly = false;
let interaction = null;
let current = null;

// Auf Mobilgeraeten kleiner rendern und den Mausblick abschalten — es gibt
// keinen Zeiger, dem die Kamera folgen koennte.
const TOUCH = isTouch();
if (TOUCH) {
  params.renderScale = 0.7;
  params.mouseLook = 0;
}

/** Lädt ein Bild; liefert null, wenn es nicht existiert. */
function loadImage(url) {
  return new Promise((res) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = () => res(null);
    img.src = url;
  });
}

/**
 * Einen Ort laden.
 *
 * `buildAlley()` liefert weiterhin Boden- und Naessemaske — die braucht der
 * Bodenpass, um die Pfuetzen zu kraeuseln, und sie gelten fuer alle Ansichten
 * derselben Gasse, weil die Projektion dieselbe ist.
 *
 * Liegt unter `public/plates/<backdrop>.jpg` ein fertiges Bild, ersetzt es den
 * gezeichneten Ebenenstapel. Fehlt es, zeichnet das Spiel prozedural weiter.
 */
async function loadLocation(id) {
  const def = SCENES[id];
  if (!def) throw new Error(`Unbekannter Ort: ${id}`);
  const t0 = performance.now();

  const scene = buildAlley(seed);
  scene.id = def.id;
  scene.name = def.name;
  scene.sector = def.sector;

  const base = import.meta.env.BASE_URL || '/';
  let img = await loadImage(`${base}plates/${def.backdrop}.jpg`);
  if (!img) img = await loadImage(`${base}plates/${def.backdrop}.png`);
  if (img) {
    // WebGL nimmt ein Bild genauso entgegen wie ein Canvas — deshalb ist der
    // Tausch hier eine Zuweisung und kein Umbau.
    scene.layers = [{
      name: 'backdrop', canvas: img, parallax: 0.022,
      fog: 0, fogColor: [0, 0, 0], emissive: 1.0,
    }];
    scene.foreground = [];
    scene.usingPlate = true;
    Object.assign(params, platePreset);
  }

  renderer.setScene(scene);
  current = def;
  interaction?.setScene(def);
  console.info(
    `Ort "${def.name}" bereit in ${(performance.now() - t0).toFixed(0)} ms ` +
    `(${img ? 'fertige Platte' : 'gezeichnet'})`,
  );
}

/** Ortswechsel mit kurzer Schwarzblende, damit das Bild nicht springt. */
async function goTo(id) {
  if (!id || id === current?.id) return;
  await interaction.fadeOut();
  await loadLocation(id);
  interaction.fadeIn();
}

const overlay = createOverlay(params, {
  onChange: (key) => { if (key === 'renderScale') fit(true); },
  onReseed: () => { seed = (Math.random() * 1e9) | 0; loadLocation(current?.id || 'alley'); },
});

interaction = createInteraction(renderer, { getScene: () => current, goTo });

const stage = document.getElementById('stage');

/**
 * Anzeigebereich: immer der ganze Schirm.
 *
 * Ein Band im oberen Drittel war der erste Versuch fuers Hochformat. Es hat
 * die Gasse zwar vollstaendig gezeigt, aber die untere Haelfte blieb leer und
 * das Bild wirkte abgeschnitten. Vollbild plus seitliches Ziehen ist besser:
 * das Bild traegt, und die Tafel schiebt sich bei Bedarf darueber.
 */
function stageRect() {
  const vv = window.visualViewport;
  return {
    x: 0, y: 0,
    w: Math.round(vv?.width || window.innerWidth),
    h: Math.round(vv?.height || window.innerHeight),
  };
}

function fit(force = false) {
  const r = stageRect();
  document.body.classList.toggle('portrait', r.w < r.h);
  stage.style.left = `${r.x}px`;
  stage.style.top = `${r.y}px`;
  stage.style.width = `${r.w}px`;
  stage.style.height = `${r.h}px`;
  stage.style.right = 'auto';
  stage.style.bottom = 'auto';
  renderer.originX = r.x;
  renderer.originY = r.y;
  if (force) renderer.width = 0;
  renderer.resize(r.w, r.h);
}

addEventListener('resize', () => fit());
addEventListener('orientationchange', () => setTimeout(fit, 220));
window.visualViewport?.addEventListener('resize', () => fit());

// Sanfter Mausblick — die Kamera folgt träge, nie sprunghaft.
let targetMx = 0, targetMy = 0;
addEventListener('pointermove', (e) => {
  if (TOUCH) return;
  targetMx = (e.clientX / window.innerWidth - 0.5) * 2;
  targetMy = (e.clientY / window.innerHeight - 0.5) * 2;
});

loadLocation('alley');
fit();

let last = performance.now();
let warmed = 0;

function loop(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;

  const k = 1 - Math.pow(0.001, dt); // rahmenratenunabhängige Dämpfung
  renderer.cam.mx += (targetMx * params.mouseLook - renderer.cam.mx) * k;
  renderer.cam.my += (targetMy * params.mouseLook - renderer.cam.my) * k;

  interaction?.update(dt);
  renderer.frame(dt, backdropOnly);
  overlay.sample(performance.now() - now);

  // Erst nach ein paar Frames einblenden: alle Shader sind dann übersetzt,
  // die Render-Targets warm. Kein Ruckler im ersten Bild.
  // `renderer.scene` wird abgefragt, weil das Laden einer fertigen Platte
  // asynchron ist — sonst meldet sich die Seite fertig, bevor etwas da ist.
  if (warmed < 4 && renderer.scene) {
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
  reseed(s) { seed = s; return loadLocation(current?.id || 'alley'); },
  goTo,
  setTime(t) { renderer.time = t; },
  freeze() { params.drift = 0; params.mouseLook = 0; renderer.cam.mx = 0; renderer.cam.my = 0; },
  /** Vorlage zum Übermalen: nur die Ebenen, ohne Boden, Regen und Luft. */
  setBackdropOnly(v) { backdropOnly = !!v; },
};
