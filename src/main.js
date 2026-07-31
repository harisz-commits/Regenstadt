import { Renderer } from './render/renderer.js';
import { params, platePreset } from './render/params.js';
import { buildAlley } from './scene/alley.js';
import { createOverlay } from './ui/overlay.js';
import { createInteraction } from './game/interaction.js';
import { HOTSPOTS } from './game/hotspots.js';
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
 * Baut die Szene. Liegt unter `public/plates/<id>-backdrop.png` ein fertiges
 * Bild, ersetzt es den gesamten gezeichneten Ebenenstapel.
 *
 * Boden, Nässemaske, Spiegelung, Regen und Luft bleiben davon unberührt — sie
 * arbeiten weiter mit derselben Projektion. Genau dafür wird die Vorlage
 * ohne Boden und ohne Regen exportiert: der Bodenpass braucht dieses Bild als
 * Spiegelquelle, die nasse Straße darf darin noch nicht enthalten sein.
 */
async function loadScene() {
  const t0 = performance.now();
  const scene = buildAlley(seed);

  const base = import.meta.env.BASE_URL || '/';
  // Bildmodelle liefern je nach Größe JPEG oder PNG — beide Endungen prüfen.
  let img = await loadImage(`${base}plates/${scene.id}-backdrop.jpg`);
  if (!img) img = await loadImage(`${base}plates/${scene.id}-backdrop.png`);
  if (img) {
    // WebGL nimmt ein Bild genauso entgegen wie ein Canvas — deshalb ist der
    // Tausch hier eine Zuweisung und kein Umbau.
    scene.layers = [{
      name: 'backdrop', canvas: img, parallax: 0.022,
      fog: 0, fogColor: [0, 0, 0], emissive: 1.0,
    }];
    scene.foreground = [];
    scene.usingPlate = true;
    // Ein generiertes Bild ist bereits belichtet — die volle Kette noch einmal
    // darueber wuerde es auswaschen.
    Object.assign(params, platePreset);
  }

  renderer.setScene(scene);
  if (!interaction) {
    interaction = createInteraction(renderer, {
      spots: HOTSPOTS[scene.id] || [],
      place: scene.name,
      sector: scene.sector,
    });
  }
  console.info(
    `Szene bereit in ${(performance.now() - t0).toFixed(0)} ms ` +
    `(Seed ${seed}, ${img ? 'fertige Platte' : 'gezeichnet'})`,
  );
}

const overlay = createOverlay(params, {
  onChange: (key) => { if (key === 'renderScale') fit(true); },
  onReseed: () => { seed = (Math.random() * 1e9) | 0; loadScene(); },
});

const stage = document.getElementById('stage');

/**
 * Anzeigebereich festlegen.
 *
 * Im Querformat fuellt das Bild den Schirm. Im Hochformat bekommt es ein Band
 * im oberen Drittel und die Bedienung den Rest: ein 16:9-Bild auf einem
 * hochkant gehaltenen Handy ist entweder briefmarkengross oder zeigt einen
 * senkrechten Streifen. Das Band ist der Kompromiss — sichtbar gross, und den
 * Rest der Gasse erreicht man durch seitliches Schieben.
 */
function stageRect() {
  const vv = window.visualViewport;
  const W = Math.round(vv?.width || window.innerWidth);
  const H = Math.round(vv?.height || window.innerHeight);
  if (W / H >= 1.0) return { x: 0, y: 0, w: W, h: H };
  return { x: 0, y: Math.round(H * 0.11), w: W, h: Math.round(H * 0.54) };
}

function fit(force = false) {
  const r = stageRect();
  document.body.classList.toggle('portrait', r.h !== (window.visualViewport?.height || window.innerHeight));
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
  reseed(s) { seed = s; return loadScene(); },
  setTime(t) { renderer.time = t; },
  freeze() { params.drift = 0; params.mouseLook = 0; renderer.cam.mx = 0; renderer.cam.my = 0; },
  /** Vorlage zum Übermalen: nur die Ebenen, ohne Boden, Regen und Luft. */
  setBackdropOnly(v) { backdropOnly = !!v; },
};
