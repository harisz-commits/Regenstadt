import { Renderer } from './render/renderer.js';
import { params, platePreset, interiorPreset } from './render/params.js';
import { buildAlley } from './scene/alley.js';
import { createOverlay } from './ui/overlay.js';
import { createInteraction } from './game/interaction.js';
import { SCENES, START } from './game/scenes.js';
import { createWorld } from './game/world.js';
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
  params.renderScale = 0.62;
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

  // Drinnen regnet es nicht — und zwar unabhängig davon, ob für den Raum
  // schon eine Platte existiert. Stünde das im Zweig oben, behielte ein noch
  // gezeichneter Innenraum die Regeneinstellung des vorherigen Ortes.
  if (def.kind === 'interior') Object.assign(params, interiorPreset);

  renderer.setScene(scene);
  current = def;
  interaction?.setScene(def);
  console.info(
    `Ort "${def.name}" bereit in ${(performance.now() - t0).toFixed(0)} ms ` +
    `(${img ? 'fertige Platte' : 'gezeichnet'})`,
  );
}

/**
 * Der Zustand der Ermittlung: was getragen wird, was im Labor liegt, was
 * schon bekannt ist. Siehe game/world.js.
 */
const world = createWorld();

/** Ortswechsel mit kurzer Schwarzblende, damit das Bild nicht springt. */
async function goTo(id) {
  if (!id || id === current?.id) return;
  await interaction.fadeOut();
  await loadLocation(id);
  // Erst NACH dem Laden zaehlen: Ein Befund, der waehrend der Blende fertig
  // wird, soll am neuen Ort schon bereitliegen.
  const fertig = world.step();
  interaction.fadeIn();
  if (fertig) interaction.notify(
    fertig === 1
      ? 'Ein Befund liegt am Laborschalter bereit.'
      : `${fertig} Befunde liegen am Laborschalter bereit.`,
  );
}

const overlay = createOverlay(params, {
  onChange: (key) => { if (key === 'renderScale') fit(true); },
  onReseed: () => { seed = (Math.random() * 1e9) | 0; loadLocation(current?.id || START); },
});

interaction = createInteraction(renderer, { getScene: () => current, goTo, world });

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

loadLocation(START);
fit();

let last = performance.now();
const started = last;
let warmed = 0;

/* --- Qualitaet nachfuehren ------------------------------------------------
   Auf welchem Geraet das laeuft, weiss niemand vorher. Statt einen festen
   Wert zu raten, wird die Rechenaufloesung gesenkt, wenn die Bildrate
   einbricht — und wieder angehoben, wenn wieder Luft ist. Eine Animation, die
   mit 5 Bildern je Sekunde laeuft, sieht aus, als stuende sie still; lieber
   etwas weicher und fluessig als scharf und ruckelnd. */
const QUALITY_MIN = 0.38;
let qualityBase = params.renderScale;
let slowFrames = 0;
let fastFrames = 0;
let lastAdapt = 0;

function adaptQuality(frameMs) {
  if (warmed < 4) return;                    // Aufwaermphase nicht bewerten
  const now = performance.now();
  if (frameMs > 40) { slowFrames++; fastFrames = 0; }
  else if (frameMs < 20) { fastFrames++; slowFrames = 0; }

  if (now - lastAdapt < 1500) return;
  if (slowFrames > 30 && params.renderScale > QUALITY_MIN) {
    params.renderScale = Math.max(QUALITY_MIN, params.renderScale - 0.12);
    console.info(`Zu langsam — Rechenaufloesung auf ${params.renderScale.toFixed(2)} gesenkt.`);
    fit(true); lastAdapt = now; slowFrames = 0;
  } else if (fastFrames > 90 && params.renderScale < qualityBase) {
    params.renderScale = Math.min(qualityBase, params.renderScale + 0.08);
    fit(true); lastAdapt = now; fastFrames = 0;
  }
}

function loop(now) {
  // `dt` bleibt gedeckelt — es steuert Daempfungen, die bei einem grossen
  // Sprung ueberschiessen wuerden.
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  // Die Animationszeit kommt dagegen aus der Wanduhr. Sonst laeuft der Regen
  // bei niedriger Bildrate in Zeitlupe und wirkt eingefroren.
  if (!renderer.timeFrozen) renderer.time = (now - started) / 1000;

  const k = 1 - Math.pow(0.001, dt); // rahmenratenunabhängige Dämpfung
  renderer.cam.mx += (targetMx * params.mouseLook - renderer.cam.mx) * k;
  renderer.cam.my += (targetMy * params.mouseLook - renderer.cam.my) * k;

  interaction?.update(dt);
  renderer.frame(dt, backdropOnly);
  const frameMs = performance.now() - now;
  overlay.sample(frameMs);
  adaptQuality(frameMs);

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
  reseed(s) { seed = s; return loadLocation(current?.id || START); },
  goTo,
  setTime(t) { renderer.time = t; renderer.timeFrozen = true; },
  freeze() { params.drift = 0; params.mouseLook = 0; renderer.cam.mx = 0; renderer.cam.my = 0; },
  /** Vorlage zum Übermalen: nur die Ebenen, ohne Boden, Regen und Luft. */
  setBackdropOnly(v) { backdropOnly = !!v; },
};
