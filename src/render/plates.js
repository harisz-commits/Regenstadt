/**
 * Platten-Werkzeugkasten (Canvas2D).
 *
 * Prinzip wie beim Blade-Runner-Spiel von 1997: Hintergründe werden EINMAL
 * gerendert, nicht pro Frame. Nur statt sie in 3D-Software zu bauen,
 * zeichnet sie hier Code — mit so viel Menge und Variation, dass daraus
 * eine Stadt wird und keine Ansammlung von Rechtecken.
 *
 * Jede Platte ist ein Canvas mit Alpha. Später kann jede einzelne durch ein
 * echtes Bild ersetzt werden, ohne dass am Renderer irgendetwas ändert.
 */

export const PLATE_W = 2560;
export const PLATE_H = 1440;

/* ------------------------------- Zufall ---------------------------------- */

/** Deterministischer PRNG — gleicher Seed, gleiche Stadt. */
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const rr = (rng, a, b) => a + (b - a) * rng();
export const ri = (rng, a, b) => Math.floor(rr(rng, a, b + 1));
export const pick = (rng, arr) => arr[Math.min(arr.length - 1, Math.floor(rng() * arr.length))];
export const chance = (rng, p) => rng() < p;

/* ------------------------------ Canvas ----------------------------------- */

export function makeCanvas(w = PLATE_W, h = PLATE_H) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  return { canvas: c, ctx, w, h };
}

/** Setzt Glühen für die nächsten Zeichenoperationen. */
export function glow(ctx, color, blur) {
  ctx.shadowColor = color;
  ctx.shadowBlur = blur;
}
export function noGlow(ctx) {
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
}

/* ------------------------------ Paletten --------------------------------- */

export const PAL = {
  // Fensterlicht — überwiegend gedämpft, wenige sehr helle.
  windowWarm: ['#ffb15e', '#ffcf94', '#e8913f', '#c9702c', '#ffdcae'],
  windowCool: ['#7fe8ff', '#b6f2ff', '#4fc6e8', '#8fd8f0', '#d9f7ff'],
  windowRare: ['#ff4d8d', '#ff2d6f', '#b57bff', '#66ffc2'],
  neon: ['#2ee6ff', '#ff2d6f', '#f0a340', '#b57bff', '#66ffc2', '#ff5a3c'],
};

/* ---------------------------- Grundformen -------------------------------- */

/**
 * Fenstergitter. Lichter treten in Bändern auf (ganze Etagen/Büroflügel),
 * nicht rein zufällig — das ist der Unterschied zwischen „Stadt bei Nacht"
 * und „Rauschen".
 */
export function windowGrid(ctx, rng, x, y, w, h, o = {}) {
  const cellW = o.cellW ?? 9;
  const cellH = o.cellH ?? 14;
  const gapX = o.gapX ?? 5;
  const gapY = o.gapY ?? 8;
  const pad = o.pad ?? 10;
  const litBase = o.lit ?? 0.34;
  const warmBias = o.warmBias ?? 0.62;
  const brightRare = o.brightRare ?? 0.04;
  const maxAlpha = o.maxAlpha ?? 1;

  const cols = Math.floor((w - pad * 2 + gapX) / (cellW + gapX));
  const rows = Math.floor((h - pad * 2 + gapY) / (cellH + gapY));
  if (cols <= 0 || rows <= 0) return;

  const x0 = x + (w - (cols * (cellW + gapX) - gapX)) * 0.5;

  // Pro Etage ein Grundpegel, damit Licht in Bändern klumpt.
  const floorBias = new Float32Array(rows);
  let level = rng();
  for (let r = 0; r < rows; r++) {
    level += (rng() - 0.5) * 0.55;
    level = Math.max(0, Math.min(1, level));
    floorBias[r] = level;
  }

  for (let r = 0; r < rows; r++) {
    const fy = y + pad + r * (cellH + gapY);
    // Etagen im oberen Bereich sind öfter dunkel (Technikgeschosse).
    const p = litBase * (0.35 + floorBias[r] * 1.5);
    let run = 0;
    for (let c = 0; c < cols; c++) {
      const fx = x0 + c * (cellW + gapX);
      // Zusammenhängende Flügel: nach einem hellen Fenster ist das nächste wahrscheinlicher.
      const local = p + (run > 0 ? 0.3 : 0);
      if (rng() > local) { run = 0; continue; }
      run = chance(rng, 0.55) ? run + 1 : 0;

      let col;
      if (chance(rng, brightRare)) col = pick(rng, PAL.windowRare);
      else col = chance(rng, warmBias) ? pick(rng, PAL.windowWarm) : pick(rng, PAL.windowCool);

      const a = rr(rng, 0.18, maxAlpha);
      ctx.globalAlpha = a;
      ctx.fillStyle = col;

      // Ein paar Fenster sind nur teilweise erleuchtet (Jalousie, halbe Scheibe).
      if (chance(rng, 0.22)) {
        const cut = rr(rng, 0.25, 0.7);
        ctx.fillRect(fx, fy + cellH * (1 - cut), cellW, cellH * cut);
      } else {
        ctx.fillRect(fx, fy, cellW, cellH);
      }

      // Sehr wenige Fenster glühen richtig — die tragen später den Bloom.
      if (chance(rng, 0.02)) {
        glow(ctx, col, 26);
        ctx.globalAlpha = Math.min(1, a + 0.35);
        ctx.fillRect(fx, fy, cellW, cellH);
        noGlow(ctx);
      }
    }
  }
  ctx.globalAlpha = 1;
}

/** Ein Hochhaus mit Rücksprüngen, Dachaufbauten und Signalleuchte. */
export function tower(ctx, rng, x, w, topY, baseY, o = {}) {
  const body = o.body ?? '#0a1020';
  const edge = o.edge ?? null;
  let cy = topY;
  let cx = x;
  let cw = w;

  const setbacks = o.setbacks ?? ri(rng, 0, 2);
  const segs = [];
  for (let s = 0; s <= setbacks; s++) {
    const isLast = s === setbacks;
    const segBottom = isLast ? baseY : cy + (baseY - cy) * rr(rng, 0.25, 0.5);
    segs.push({ x: cx, y: cy, w: cw, h: segBottom - cy });
    cy = segBottom;
    const shrink = rr(rng, 0.06, 0.2);
    cx = cx + cw * shrink * 0.5;
    cw = cw * (1 - shrink);
  }

  for (const s of segs) {
    ctx.fillStyle = body;
    ctx.fillRect(s.x, s.y, s.w, s.h);
    if (edge) {
      ctx.strokeStyle = edge;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.35;
      ctx.strokeRect(s.x + 0.5, s.y + 0.5, s.w - 1, s.h - 1);
      ctx.globalAlpha = 1;
    }
    windowGrid(ctx, rng, s.x, s.y, s.w, s.h, o.win);
  }

  // Dachaufbauten
  const top = segs[0];
  if (chance(rng, 0.55)) {
    const mw = rr(rng, 3, 7);
    const mh = rr(rng, 40, 150);
    const mx = top.x + top.w * rr(rng, 0.2, 0.8);
    ctx.fillStyle = body;
    ctx.fillRect(mx, top.y - mh, mw, mh);
    // Rotes Blinklicht an der Spitze
    if (chance(rng, 0.7)) {
      const c = chance(rng, 0.75) ? '#ff3b3b' : '#ffffff';
      glow(ctx, c, 18);
      ctx.fillStyle = c;
      ctx.globalAlpha = rr(rng, 0.5, 1);
      ctx.beginPath();
      ctx.arc(mx + mw * 0.5, top.y - mh, rr(rng, 2, 3.6), 0, Math.PI * 2);
      ctx.fill();
      noGlow(ctx);
      ctx.globalAlpha = 1;
    }
  }
  if (chance(rng, 0.4)) {
    // Wassertank / Technikkasten
    const bw = top.w * rr(rng, 0.18, 0.4);
    const bh = rr(rng, 14, 34);
    ctx.fillStyle = body;
    ctx.fillRect(top.x + top.w * rr(rng, 0.05, 0.6), top.y - bh, bw, bh);
  }
  return segs;
}

/** Leuchtstreifen (Neonröhre). */
export function neonBar(ctx, x, y, w, h, color, o = {}) {
  const g = o.glow ?? 34;
  glow(ctx, color, g);
  ctx.fillStyle = color;
  ctx.globalAlpha = o.alpha ?? 0.9;
  ctx.fillRect(x, y, w, h);
  noGlow(ctx);
  // Heller Kern
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#ffffff';
  const inset = Math.min(w, h) * 0.28;
  ctx.globalAlpha = o.coreAlpha ?? 0.55;
  ctx.fillRect(x + inset, y + inset, Math.max(1, w - inset * 2), Math.max(1, h - inset * 2));
  ctx.globalAlpha = 1;
}

/**
 * Abstrakte Leuchtschrift: Striche in einem Raster, die wie Schriftzeichen
 * lesen, ohne welche zu sein. Vermeidet den Beigeschmack von Fake-Kanji.
 */
export function glyphSign(ctx, rng, x, y, cell, rows, color, o = {}) {
  const stroke = o.stroke ?? Math.max(2, cell * 0.11);
  const g = o.glow ?? 26;
  ctx.lineCap = 'round';
  for (let r = 0; r < rows; r++) {
    const gy = y + r * cell * 1.12;
    const n = ri(rng, 3, 6);
    glow(ctx, color, g);
    ctx.strokeStyle = color;
    ctx.lineWidth = stroke;
    ctx.globalAlpha = rr(rng, 0.75, 1);
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const horizontal = chance(rng, 0.55);
      const pad = cell * 0.16;
      if (horizontal) {
        const yy = gy + pad + (cell - pad * 2) * (i / Math.max(1, n - 1));
        const x0 = x + pad + cell * rr(rng, 0, 0.18);
        const x1 = x + cell - pad - cell * rr(rng, 0, 0.18);
        ctx.moveTo(x0, yy);
        ctx.lineTo(x1, yy);
      } else {
        const xx = x + pad + (cell - pad * 2) * rr(rng, 0, 1);
        ctx.moveTo(xx, gy + pad);
        ctx.lineTo(xx, gy + cell - pad);
      }
    }
    ctx.stroke();
    noGlow(ctx);
    ctx.globalAlpha = 1;
  }
}

/** Feuerleiter: Podeste, Geländer, Schrägtreppen. */
export function fireEscape(ctx, rng, x, y, w, floorH, floors, color, o = {}) {
  const lw = o.lineWidth ?? 2.2;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = lw;
  ctx.globalAlpha = o.alpha ?? 0.85;

  for (let f = 0; f < floors; f++) {
    const fy = y + f * floorH;
    // Podest
    ctx.beginPath();
    ctx.moveTo(x, fy);
    ctx.lineTo(x + w, fy);
    ctx.stroke();
    // Geländer
    const bars = Math.max(3, Math.round(w / 16));
    ctx.beginPath();
    for (let b = 0; b <= bars; b++) {
      const bx = x + (w * b) / bars;
      ctx.moveTo(bx, fy);
      ctx.lineTo(bx, fy - floorH * 0.3);
    }
    ctx.moveTo(x, fy - floorH * 0.3);
    ctx.lineTo(x + w, fy - floorH * 0.3);
    ctx.stroke();
    // Schrägtreppe zum nächsten Podest, Seite alternierend
    if (f < floors - 1) {
      const left = f % 2 === 0;
      const sx = left ? x + w * 0.08 : x + w * 0.92;
      const ex = left ? x + w * 0.55 : x + w * 0.45;
      ctx.beginPath();
      ctx.moveTo(sx, fy);
      ctx.lineTo(ex, fy + floorH);
      ctx.moveTo(sx + (left ? 9 : -9), fy);
      ctx.lineTo(ex + (left ? 9 : -9), fy + floorH);
      ctx.stroke();
      // Stufen
      ctx.lineWidth = lw * 0.7;
      ctx.beginPath();
      const steps = 7;
      for (let s = 1; s < steps; s++) {
        const t = s / steps;
        const px = sx + (ex - sx) * t;
        const py = fy + floorH * t;
        ctx.moveTo(px, py);
        ctx.lineTo(px + (left ? 9 : -9), py);
      }
      ctx.stroke();
      ctx.lineWidth = lw;
    }
  }
  ctx.globalAlpha = 1;
}

/** Rohre an einer Fassade. */
export function pipes(ctx, rng, x, y, w, h, color, count = 4) {
  ctx.lineCap = 'round';
  for (let i = 0; i < count; i++) {
    const px = x + w * rr(rng, 0.05, 0.95);
    ctx.strokeStyle = color;
    ctx.globalAlpha = rr(rng, 0.4, 0.9);
    ctx.lineWidth = rr(rng, 3, 11);
    ctx.beginPath();
    ctx.moveTo(px, y);
    // Leichter Versatz auf halber Höhe — Rohre laufen selten schnurgerade.
    const kink = y + h * rr(rng, 0.25, 0.75);
    const off = rr(rng, -26, 26);
    ctx.lineTo(px, kink);
    ctx.lineTo(px + off, kink + 18);
    ctx.lineTo(px + off, y + h);
    ctx.stroke();
    // Schellen
    ctx.lineWidth = rr(rng, 5, 14);
    ctx.globalAlpha = 0.5;
    const clamps = ri(rng, 2, 5);
    for (let c = 0; c < clamps; c++) {
      const cy = y + h * ((c + 0.5) / clamps);
      ctx.beginPath();
      ctx.moveTo(px - 5, cy);
      ctx.lineTo(px + 5, cy);
      ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;
}

/** Klimagerät / Lüfterkasten. */
export function acUnit(ctx, rng, x, y, w, h, color, accent) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = accent;
  ctx.globalAlpha = 0.35;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
  // Lamellen
  const n = Math.max(3, Math.round(h / 7));
  ctx.globalAlpha = 0.22;
  ctx.beginPath();
  for (let i = 1; i < n; i++) {
    const yy = y + (h * i) / n;
    ctx.moveTo(x + 3, yy);
    ctx.lineTo(x + w - 3, yy);
  }
  ctx.stroke();
  ctx.globalAlpha = 1;
}

/** Durchhängendes Kabel zwischen zwei Punkten. */
export function cable(ctx, x0, y0, x1, y1, sag, color, width = 2, alpha = 0.8) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.globalAlpha = alpha;
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.quadraticCurveTo((x0 + x1) * 0.5, (y0 + y1) * 0.5 + sag, x1, y1);
  ctx.stroke();
  ctx.globalAlpha = 1;
}

/**
 * Hängende Lampe. Der Lichtkegel bleibt bewusst schwach: Bloom und
 * Nebelstreuung im Shader machen daraus später von selbst genug. Wird er hier
 * schon kräftig gezeichnet, brennt die Gasse zu weißen Dreiecken aus.
 */
export function hangingLamp(ctx, x, y, r, color, coneH) {
  const g = ctx.createLinearGradient(x, y, x, y + coneH);
  g.addColorStop(0, color + '30');
  g.addColorStop(0.45, color + '12');
  g.addColorStop(1, color + '00');
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(x - r * 0.8, y);
  ctx.lineTo(x + r * 0.8, y);
  ctx.lineTo(x + coneH * 0.22, y + coneH);
  ctx.lineTo(x - coneH * 0.22, y + coneH);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Schirm
  ctx.fillStyle = '#05070d';
  ctx.beginPath();
  ctx.moveTo(x - r * 1.5, y);
  ctx.lineTo(x + r * 1.5, y);
  ctx.lineTo(x + r * 0.7, y - r * 1.4);
  ctx.lineTo(x - r * 0.7, y - r * 1.4);
  ctx.closePath();
  ctx.fill();

  // Leuchtmittel
  glow(ctx, color, r * 3.5);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r * 0.85, 0, Math.PI * 2);
  ctx.fill();
  noGlow(ctx);
  ctx.fillStyle = '#ffffff';
  ctx.globalAlpha = 0.8;
  ctx.beginPath();
  ctx.arc(x, y, r * 0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
}

/* ------------------------------ Nachbearbeitung -------------------------- */

/** Feines Korn/Schmutz auf die Platte — nimmt den „frisch aus dem Vektor"-Look. */
export function grime(ctx, rng, w, h, amount = 0.05, dots = 26000) {
  ctx.save();
  ctx.globalCompositeOperation = 'overlay';
  for (let i = 0; i < dots; i++) {
    const x = rng() * w;
    const y = rng() * h;
    const a = rng() * amount;
    ctx.fillStyle = rng() < 0.5 ? `rgba(0,0,0,${a})` : `rgba(190,215,255,${a})`;
    ctx.fillRect(x, y, 1 + (rng() < 0.1 ? 1 : 0), 1);
  }
  ctx.restore();
}

/**
 * Licht, das von einer Quelle auf die Wand daneben fällt.
 *
 * `source-atop` begrenzt den Schein auf das, was bereits gezeichnet ist — er
 * legt sich also auf Mauerwerk und nicht in die leere Gasse. Ohne diesen
 * Schritt schweben Fenster und Reklamen auf Schwarz, und genau daran erkennt
 * man ein zusammengesetztes Bild sofort.
 */
export function wallSpill(ctx, x, y, r, color, alpha = 0.5) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, color);
  g.addColorStop(0.45, color + '66');
  g.addColorStop(1, 'transparent');
  ctx.save();
  ctx.globalCompositeOperation = 'source-atop';
  ctx.globalAlpha = alpha;
  ctx.fillStyle = g;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);
  ctx.restore();
}

/** Weiche Streulicht-Kuppel (Lichtverschmutzung über der Skyline). */
export function lightDome(ctx, x, y, r, color, alpha = 0.35) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, color);
  g.addColorStop(1, 'transparent');
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  ctx.globalAlpha = alpha;
  ctx.fillStyle = g;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);
  ctx.restore();
}
