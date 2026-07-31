/**
 * „Kanalgasse" — die erste Bühne.
 *
 * Baut den kompletten Plattensatz. Jede Platte ist ein Canvas; der Renderer
 * kennt nur noch Textur + Tiefe + Nebelwerte. Wer später ein KI-Bild statt
 * einer gezeichneten Platte einsetzen will, tauscht hier genau ein Canvas aus.
 */

import {
  PLATE_W, PLATE_H, makeCanvas, mulberry32, rr, ri, pick, chance,
  glow, noGlow, windowGrid, tower, neonBar, glyphSign, fireEscape,
  pipes, acUnit, cable, hangingLamp, grime, lightDome, wallSpill, PAL,
} from '../render/plates.js';
import { VP_X, VP_Y, CAM_H, STREET_HALF, project, polyPath } from './projection.js';

const NEAR_D = 0.62; // nächste sichtbare Tiefe (unterer Bildrand)
const FAR_D = 5.4;   // hier endet die Gasse, dahinter die Skyline

/* ========================================================================= */
/*  Himmel                                                                   */
/* ========================================================================= */

function plateSky(rng) {
  const { canvas, ctx, w, h } = makeCanvas();

  // Grundverlauf: tiefes Indigo oben, verschmutztes Rostbraun am Horizont.
  const g = ctx.createLinearGradient(0, 0, 0, VP_Y + 60);
  g.addColorStop(0.0, '#05070f');
  g.addColorStop(0.35, '#0b1024');
  g.addColorStop(0.68, '#1a1a33');
  g.addColorStop(0.88, '#3a2430');
  g.addColorStop(1.0, '#4a2f2a');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, VP_Y + 60);

  // Wolkendecke: große weiche Ballen, per screen-Blend übereinander.
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  for (let i = 0; i < 42; i++) {
    const cx = rr(rng, -200, w + 200);
    const cy = rr(rng, -100, VP_Y * 0.85);
    const rx = rr(rng, 200, 760);
    const ry = rx * rr(rng, 0.24, 0.45);
    const t = 1 - cy / VP_Y;
    const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, rx);
    // Wolken fangen das Stadtlicht von unten — unten wärmer, oben kälter.
    const warm = Math.max(0, 1 - t);
    const col = `rgba(${Math.round(80 + warm * 110)},${Math.round(78 + warm * 60)},${Math.round(105 + warm * 30)},`;
    grd.addColorStop(0, col + rr(rng, 0.05, 0.16) + ')');
    grd.addColorStop(1, col + '0)');
    ctx.fillStyle = grd;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(1, ry / rx);
    ctx.beginPath();
    ctx.arc(0, 0, rx, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();

  // Lichtverschmutzung: Kuppeln über der Stadt.
  lightDome(ctx, w * 0.5, VP_Y + 30, 900, 'rgba(255,150,90,1)', 0.30);
  lightDome(ctx, w * 0.22, VP_Y + 20, 620, 'rgba(60,190,255,1)', 0.16);
  lightDome(ctx, w * 0.78, VP_Y + 20, 560, 'rgba(255,60,120,1)', 0.14);

  return { canvas, ctx };
}

/* ========================================================================= */
/*  Ferne Skyline — was am Ende der Gasse steht                              */
/* ========================================================================= */

function plateFar(rng) {
  const { canvas, ctx, w } = makeCanvas();

  // Megastruktur: eine abgeschnittene Pyramide, weit hinten links.
  const pyBase = VP_Y + 6;
  const pyH = 520;
  const pyHalf = 300;
  const pyTopHalf = 92;
  const px = w * 0.34;
  ctx.fillStyle = '#131c33';
  polyPath(ctx, [
    [px - pyHalf, pyBase],
    [px - pyTopHalf, pyBase - pyH],
    [px + pyTopHalf, pyBase - pyH],
    [px + pyHalf, pyBase],
  ]);
  ctx.fill();
  // Etagenbänder auf der Pyramide
  ctx.globalAlpha = 0.5;
  for (let i = 1; i < 26; i++) {
    const t = i / 26;
    const y = pyBase - pyH * t;
    const half = pyHalf + (pyTopHalf - pyHalf) * t;
    ctx.fillStyle = chance(rng, 0.5) ? '#ffb15e' : '#7fe8ff';
    ctx.globalAlpha = rr(rng, 0.08, 0.3);
    ctx.fillRect(px - half + 8, y, (half - 8) * 2, 2.5);
  }
  ctx.globalAlpha = 1;
  glow(ctx, '#ffb15e', 30);
  ctx.fillStyle = '#ffd9a0';
  ctx.fillRect(px - pyTopHalf * 0.5, pyBase - pyH - 8, pyTopHalf, 6);
  noGlow(ctx);

  // Zweite Megastruktur rechts: schlanker Turm mit Ringen.
  const tx = w * 0.7;
  ctx.fillStyle = '#111a2e';
  ctx.fillRect(tx - 46, VP_Y - 700, 92, 706);
  for (let i = 0; i < 7; i++) {
    const y = VP_Y - 660 + i * 92;
    ctx.fillStyle = '#1b2740';
    ctx.fillRect(tx - 78, y, 156, 16);
    glow(ctx, '#2ee6ff', 16);
    ctx.fillStyle = '#2ee6ff';
    ctx.globalAlpha = rr(rng, 0.25, 0.6);
    ctx.fillRect(tx - 78, y + 5, 156, 3);
    noGlow(ctx);
    ctx.globalAlpha = 1;
  }

  // Generische Türme dazwischen
  let x = -140;
  while (x < w + 120) {
    const bw = rr(rng, 90, 260);
    const bh = rr(rng, 150, 620);
    tower(ctx, rng, x, bw, VP_Y - bh, VP_Y + 8, {
      body: pick(rng, ['#0e1628', '#111c30', '#16223a']),
      setbacks: ri(rng, 0, 2),
      win: { cellW: 5, cellH: 8, gapX: 4, gapY: 6, pad: 7, lit: 0.3, maxAlpha: 0.75, brightRare: 0.05 },
    });
    x += bw * rr(rng, 0.62, 0.95);
  }

  // Querstraße am Ende der Gasse.
  //
  // Durch die Gassenöffnung ist nur ein schmaler Streifen dieser Platte
  // sichtbar. Ohne Struktur genau dort liest sich das Ende der Gasse als
  // flacher heller Riegel — der auffälligste Fehler des zweiten Durchlaufs.
  {
    const cx = w * 0.5;
    // Heller Dunstkern, in den hinein die Gasse ausläuft
    lightDome(ctx, cx, VP_Y - 30, 420, 'rgba(255,180,120,1)', 0.5);

    // Niedrige Bauten und Aufbauten auf Straßenniveau
    for (let i = 0; i < 26; i++) {
      const bx = cx + rr(rng, -560, 560);
      const bw = rr(rng, 26, 110);
      const bh = rr(rng, 30, 150);
      ctx.fillStyle = `rgba(${ri(rng, 8, 20)},${ri(rng, 12, 26)},${ri(rng, 22, 42)},1)`;
      ctx.fillRect(bx, VP_Y - bh, bw, bh + 40);
      // Beleuchtete Fensterreihen
      for (let r = 0; r < 4; r++) {
        if (!chance(rng, 0.5)) continue;
        ctx.fillStyle = chance(rng, 0.6) ? '#ffb15e' : '#7fe8ff';
        ctx.globalAlpha = rr(rng, 0.2, 0.7);
        ctx.fillRect(bx + 3, VP_Y - bh + 8 + r * 11, bw - 6, 4);
        ctx.globalAlpha = 1;
      }
    }

    // Hochbahn quer über die Querstraße
    ctx.fillStyle = 'rgba(7,11,20,1)';
    ctx.fillRect(cx - 620, VP_Y - 122, 1240, 26);
    for (let i = 0; i < 9; i++) {
      ctx.fillRect(cx - 600 + i * 150, VP_Y - 100, 13, 100);
    }
    // Fahrzeuglichter auf der Hochbahn
    for (let i = 0; i < 14; i++) {
      const lx = cx + rr(rng, -600, 600);
      const c = chance(rng, 0.5) ? '#ff5a4a' : '#ffe0b0';
      glow(ctx, c, 14);
      ctx.fillStyle = c;
      ctx.globalAlpha = rr(rng, 0.4, 1);
      ctx.fillRect(lx, VP_Y - 128, rr(rng, 5, 16), 3);
      noGlow(ctx);
      ctx.globalAlpha = 1;
    }

    // Vereinzelte senkrechte Leuchtschilder in der Querstraße
    for (let i = 0; i < 7; i++) {
      const sx = cx + rr(rng, -540, 540);
      const sy = VP_Y - rr(rng, 60, 190);
      const col = pick(rng, PAL.neon);
      glow(ctx, col, 20);
      ctx.fillStyle = col;
      ctx.globalAlpha = rr(rng, 0.5, 0.95);
      ctx.fillRect(sx, sy, rr(rng, 4, 9), rr(rng, 26, 70));
      noGlow(ctx);
      ctx.globalAlpha = 1;
    }
  }

  // Fernnebel-Schleier über der ganzen Platte: senkt Kontrast, hebt Schwarzwert.
  const fog = ctx.createLinearGradient(0, VP_Y - 700, 0, VP_Y + 20);
  fog.addColorStop(0, 'rgba(40,58,86,0.06)');
  fog.addColorStop(0.65, 'rgba(52,62,92,0.18)');
  fog.addColorStop(1, 'rgba(96,78,86,0.34)');
  ctx.fillStyle = fog;
  ctx.fillRect(0, VP_Y - 760, w, 790);

  return { canvas, ctx };
}

/* ========================================================================= */
/*  Die Gasse selbst — perspektivische Fassaden links und rechts             */
/* ========================================================================= */

/** Fensterband auf einer Fassadenebene X = plane, korrekt perspektivisch. */
function facadeWindows(ctx, rng, plane, d0, d1, topY, o) {
  const floors = o.floors;
  const floorH = (CAM_H - topY) / floors;
  const colDepth = o.colDepth ?? 0.115; // Weltbreite einer Fensterachse
  const winFrac = o.winFrac ?? 0.55;

  // Lichter klumpen etagenweise.
  const bias = new Float32Array(floors);
  let lvl = rng();
  for (let f = 0; f < floors; f++) {
    lvl = Math.max(0, Math.min(1, lvl + (rng() - 0.5) * 0.6));
    bias[f] = lvl;
  }

  for (let d = d0; d < d1; d += colDepth) {
    const da = d;
    const db = Math.min(d1, d + colDepth * winFrac);
    if (db - da < 0.004) continue;
    // Weit entfernte Achsen werden schmaler als ein Pixel — überspringen.
    const wpx = Math.abs(project(plane, 0, da)[0] - project(plane, 0, db)[0]);
    if (wpx < 0.9) continue;

    for (let f = 0; f < floors; f++) {
      const ya = topY + f * floorH + floorH * 0.18;
      const yb = ya + floorH * 0.6;
      const p = (o.lit ?? 0.3) * (0.3 + bias[f] * 1.6);
      if (rng() > p) continue;

      let col;
      if (chance(rng, o.brightRare ?? 0.035)) col = pick(rng, PAL.windowRare);
      else col = chance(rng, o.warmBias ?? 0.6) ? pick(rng, PAL.windowWarm) : pick(rng, PAL.windowCool);

      ctx.globalAlpha = rr(rng, 0.16, o.maxAlpha ?? 0.92);
      ctx.fillStyle = col;
      polyPath(ctx, [
        project(plane, ya, da), project(plane, ya, db),
        project(plane, yb, db), project(plane, yb, da),
      ]);
      ctx.fill();

      if (chance(rng, 0.018)) {
        glow(ctx, col, 22);
        ctx.globalAlpha = 1;
        ctx.fill();
        noGlow(ctx);
      }
    }
  }
  ctx.globalAlpha = 1;
}

/** Ein Schild, das quer in die Gasse ragt. */
function protrudingSign(ctx, rng, side, d, o = {}) {
  const plane = side * STREET_HALF;
  const inward = plane - side * rr(rng, 190, 330); // ragt zur Straßenmitte
  const yTop = o.yTop ?? rr(rng, -520, 60);
  const hgt = o.h ?? rr(rng, 170, 330);
  const yBot = yTop + hgt;
  const col = o.color ?? pick(rng, PAL.neon);
  const thick = 0.035; // Tiefe des Schildkörpers

  // Rückseite/Körper (dunkel)
  ctx.fillStyle = '#05070d';
  polyPath(ctx, [
    project(plane, yTop, d), project(inward, yTop, d + thick),
    project(inward, yBot, d + thick), project(plane, yBot, d),
  ]);
  ctx.fill();

  // Leuchtfläche — die zur Kamera gewandte Schmalseite
  const [sx0, sy0] = project(inward, yTop, d + thick);
  const [sx1, sy1] = project(inward, yBot, d + thick);
  const [wx0] = project(plane, yTop, d);
  const signW = Math.abs(wx0 - sx0);
  const rows = o.rows ?? 3;
  const cellH = (sy1 - sy0) / Math.max(1, rows);

  const face = [
    project(plane, yTop, d), project(inward, yTop, d + thick),
    project(inward, yBot, d + thick), project(plane, yBot, d),
  ];

  // Gefüllte Leuchttafel statt hohlem Rahmen — ein Umriss allein liest sich
  // als leeres Rechteck, nicht als Reklame.
  ctx.save();
  polyPath(ctx, face);
  ctx.clip();
  const gx = ctx.createLinearGradient(Math.min(sx0, wx0), sy0, Math.max(sx0, wx0), sy1);
  gx.addColorStop(0, col + 'cc');
  gx.addColorStop(0.55, col + '77');
  gx.addColorStop(1, col + 'bb');
  ctx.fillStyle = gx;
  ctx.globalAlpha = 0.55;
  polyPath(ctx, face);
  ctx.fill();
  ctx.globalAlpha = 1;

  // Zeichen auf dem Schild
  if (signW > 22 && cellH > 12) {
    const gx0 = Math.min(sx0, wx0) + signW * 0.16;
    glyphSign(ctx, rng, gx0, sy0 + cellH * 0.14,
      Math.min(signW * 0.66, cellH * 0.74), rows, '#ffffff',
      { glow: Math.max(6, 22 / d), stroke: Math.max(1.2, 7 / d) });
  }
  ctx.restore();

  // Leuchtrahmen
  glow(ctx, col, Math.max(10, 40 / d));
  ctx.strokeStyle = col;
  ctx.lineWidth = Math.max(1.2, 8 / d);
  ctx.globalAlpha = 0.95;
  polyPath(ctx, face);
  ctx.stroke();
  noGlow(ctx);
  ctx.globalAlpha = 1;

  // Halterung zur Wand
  ctx.strokeStyle = '#0a0f18';
  ctx.lineWidth = Math.max(1, 6 / d);
  ctx.beginPath();
  const [ax, ay] = project(plane, yTop + hgt * 0.2, d);
  const [bx, by] = project(inward, yTop, d + thick);
  ctx.moveTo(ax, ay); ctx.lineTo(bx, by);
  ctx.stroke();

  // Meldet sich als Lichtquelle für den Wandschein zurück.
  const cx = (face[0][0] + face[2][0]) * 0.5;
  const cy = (face[0][1] + face[2][1]) * 0.5;
  return { x: cx, y: cy, r: Math.max(90, 520 / d), color: col, alpha: 0.34 };
}

/**
 * Eine Person in der Gasse. Reine Silhouette mit Lichtsaum — Gesichter und
 * Details wären auf dieser Größe ohnehin Matsch.
 *
 * Wichtig: Figuren stehen in der Straßenplatte, also VOR dem Bodenpass.
 * Dadurch spiegeln sie sich von selbst in der nassen Fahrbahn.
 */
function figure(ctx, rng, X, d, o = {}) {
  const H = o.height ?? 330;
  const [fx, fy] = project(X, CAM_H, d);
  const [, hy] = project(X, CAM_H - H, d);
  const h = fy - hy;
  if (h < 12) return;
  const w = h * 0.24;
  const headR = h * 0.062;
  const headCY = hy + headR * 1.15;
  const shoulderY = hy + h * 0.185;
  const hipY = hy + h * 0.54;
  const hemY = hipY + h * 0.17;

  ctx.save();
  ctx.fillStyle = o.body ?? '#03050b';

  // Beine zuerst, damit der Mantel darüber liegt.
  const legW = w * 0.21;
  ctx.fillRect(fx - w * 0.30, hipY, legW, fy - hipY);
  ctx.fillRect(fx + w * 0.09, hipY, legW, fy - hipY);

  // Mantel: schmale Schultern, nur leicht ausgestellter Saum. Zu viel Flare
  // und die Silhouette liest sich als Kegel statt als Mensch.
  ctx.beginPath();
  ctx.moveTo(fx - w * 0.46, shoulderY);
  ctx.quadraticCurveTo(fx - w * 0.52, hipY, fx - w * 0.56, hemY);
  ctx.lineTo(fx + w * 0.56, hemY);
  ctx.quadraticCurveTo(fx + w * 0.52, hipY, fx + w * 0.46, shoulderY);
  ctx.quadraticCurveTo(fx, shoulderY - h * 0.05, fx - w * 0.46, shoulderY);
  ctx.closePath();
  ctx.fill();

  // Hals und Kopf
  ctx.fillRect(fx - headR * 0.34, headCY, headR * 0.68, shoulderY - headCY + 2);
  ctx.beginPath();
  ctx.arc(fx, headCY, headR, 0, Math.PI * 2);
  ctx.fill();

  // Schirm — dicht über dem Kopf, schmal. Sitzt er zu hoch und zu weit,
  // schwebt eine Scheibe über der Figur.
  if (o.umbrella) {
    const uy = headCY - headR * 2.4;
    const uw = w * 1.05;
    ctx.beginPath();
    ctx.moveTo(fx - uw, uy);
    ctx.quadraticCurveTo(fx, uy - h * 0.115, fx + uw, uy);
    ctx.quadraticCurveTo(fx, uy + h * 0.032, fx - uw, uy);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = o.body ?? '#03050b';
    ctx.lineWidth = Math.max(1, h * 0.012);
    ctx.beginPath();
    ctx.moveTo(fx, uy);
    ctx.lineTo(fx, shoulderY + h * 0.06);
    ctx.stroke();
  }

  // Lichtsaum von einer Seite — trennt die Figur von der dunklen Wand.
  const rimCol = o.rim ?? '#2ee6ff';
  const sgn = o.rimSide ?? 1;
  glow(ctx, rimCol, h * 0.14);
  ctx.strokeStyle = rimCol;
  ctx.globalAlpha = 0.75;
  ctx.lineWidth = Math.max(1, h * 0.018);
  ctx.beginPath();
  ctx.moveTo(fx + sgn * w * 0.46, shoulderY);
  ctx.quadraticCurveTo(fx + sgn * w * 0.52, hipY, fx + sgn * w * 0.56, hemY);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(fx + sgn * headR * 0.2, headCY, headR, -1.2, 0.9);
  ctx.stroke();
  noGlow(ctx);
  ctx.globalAlpha = 1;
  ctx.restore();
}

function plateStreet(rng) {
  const { canvas, ctx, w } = makeCanvas();
  /** Alle Leuchtquellen; ihr Schein wird ganz am Ende auf die Wände gelegt. */
  const lights = [];

  /** Eine Straßenseite. */
  function side(sgn) {
    const plane = sgn * STREET_HALF;
    // Gebäude von hinten nach vorn (Maler-Algorithmus).
    const blocks = [];
    let d = NEAR_D;
    while (d < FAR_D) {
      const ext = rr(rng, 0.55, 1.25);
      blocks.push({ d0: d, d1: Math.min(FAR_D, d + ext) });
      d += ext;
    }
    blocks.reverse();

    for (const b of blocks) {
      const topY = -rr(rng, 620, 2100);
      // Entfernte Baukörper sind durch Dunst heller.
      const t = Math.min(1, (b.d0 - NEAR_D) / (FAR_D - NEAR_D));
      const shade = Math.round(6 + t * 22);
      const body = `rgb(${shade},${shade + 4},${Math.round(shade * 1.7 + 6)})`;

      ctx.fillStyle = body;
      polyPath(ctx, [
        project(plane, topY, b.d1), project(plane, topY, b.d0),
        project(plane, CAM_H, b.d0), project(plane, CAM_H, b.d1),
      ]);
      ctx.fill();

      // Kante zur Straße hin leicht anheben — trennt die Baukörper optisch.
      ctx.strokeStyle = 'rgba(150,180,220,0.10)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      const [ex, ey] = project(plane, topY, b.d0);
      const [fx, fy] = project(plane, CAM_H, b.d0);
      ctx.moveTo(ex, ey); ctx.lineTo(fx, fy);
      ctx.stroke();

      const floors = Math.max(6, Math.round((CAM_H - topY) / 150));
      facadeWindows(ctx, rng, plane, b.d0, b.d1, topY, {
        floors,
        lit: rr(rng, 0.16, 0.34),
        warmBias: rr(rng, 0.45, 0.8),
        maxAlpha: 0.9,
        colDepth: rr(rng, 0.1, 0.15),
      });

      // Feuerleiter auf mittlerer Distanz (näher = zu groß, ferner = Matsch).
      if (b.d0 > 1.1 && b.d0 < 3.4 && chance(rng, 0.62)) {
        const fd = rr(rng, b.d0 + 0.05, Math.min(b.d1, b.d0 + 0.5));
        const [fx0, fy0] = project(plane, -260, fd);
        const [fx1, fy1] = project(plane, CAM_H, fd);
        const fw = Math.max(20, 190 / fd);
        const floorsFE = 5;
        fireEscape(ctx, rng, sgn < 0 ? fx0 : fx0 - fw, fy0, fw,
          (fy1 - fy0) / floorsFE, floorsFE, 'rgba(150,175,205,0.5)',
          { lineWidth: Math.max(1, 3.2 / fd) });
      }

      // Rohre
      if (chance(rng, 0.55) && b.d0 < 3.2) {
        const pd = rr(rng, b.d0, b.d1);
        const [px0, py0] = project(plane, -180, pd);
        const [, py1] = project(plane, CAM_H, pd);
        pipes(ctx, rng, px0 - 60, py0, 120, py1 - py0, 'rgba(16,22,34,0.9)', ri(rng, 2, 4));
      }

      // Klimageräte
      if (chance(rng, 0.6) && b.d0 < 3.0) {
        const n = ri(rng, 1, 3);
        for (let i = 0; i < n; i++) {
          const ad = rr(rng, b.d0, b.d1);
          const ay = rr(rng, -420, 200);
          const [axp, ayp] = project(plane, ay, ad);
          const aw = Math.max(6, 120 / ad);
          acUnit(ctx, rng, sgn < 0 ? axp : axp - aw, ayp, aw, aw * 0.62, '#080c14', '#4a5f7a');
        }
      }

      // Vorspringende Leuchtschilder — das Markenzeichen der Gasse.
      if (b.d0 > 0.8 && chance(rng, 0.75)) {
        const sd = rr(rng, b.d0 + 0.1, Math.max(b.d0 + 0.15, b.d1 - 0.1));
        lights.push(protrudingSign(ctx, rng, sgn, sd, {
          rows: ri(rng, 2, 4),
          color: pick(rng, PAL.neon),
        }));
      }
      // Waagrechter Leuchtstreifen entlang der Fassade
      if (chance(rng, 0.35) && b.d0 < 3.6) {
        const col = pick(rng, PAL.neon);
        const ly = rr(rng, -300, 240);
        glow(ctx, col, Math.max(8, 40 / b.d0));
        ctx.fillStyle = col;
        ctx.globalAlpha = rr(rng, 0.5, 0.85);
        polyPath(ctx, [
          project(plane, ly, b.d0), project(plane, ly, b.d1),
          project(plane, ly + 26, b.d1), project(plane, ly + 26, b.d0),
        ]);
        ctx.fill();
        noGlow(ctx);
        ctx.globalAlpha = 1;
      }
    }

    // Ladenfronten auf Straßenniveau: warme Lichtkästen ganz unten.
    // Endet deutlich vor dem Fluchtpunkt: sonst schieben sich die Lichtkästen
    // beider Straßenseiten dort zu einem waagrechten Riegel zusammen.
    for (let dd = 0.9; dd < FAR_D - 2.1; dd += rr(rng, 0.4, 0.9)) {
      if (!chance(rng, 0.55)) continue;
      const col = chance(rng, 0.6) ? '#ffb15e' : pick(rng, PAL.neon);
      const y0 = rr(rng, 150, 260);
      glow(ctx, col, Math.max(10, 36 / dd));
      ctx.fillStyle = col;
      ctx.globalAlpha = rr(rng, 0.3, 0.6);
      polyPath(ctx, [
        project(plane, y0, dd), project(plane, y0, dd + 0.22),
        project(plane, y0 + 90, dd + 0.22), project(plane, y0 + 90, dd),
      ]);
      ctx.fill();
      noGlow(ctx);
      ctx.globalAlpha = 1;

      const [lx, ly] = project(plane, y0 + 45, dd + 0.11);
      lights.push({ x: lx, y: ly, r: Math.max(120, 620 / dd), color: col, alpha: 0.30 });
    }
  }

  side(-1);
  side(1);

  // Licht auf die Wände legen — jetzt, wo beide Seiten stehen, damit eine
  // Reklame links auch die Fassade rechts anleuchtet.
  for (const L of lights) {
    if (!L) continue;
    wallSpill(ctx, L.x, L.y, L.r, L.color, L.alpha);
  }

  // Grundhelligkeit von unten: die Straße wirft Licht zurück an die Wände.
  {
    const g = ctx.createLinearGradient(0, PLATE_H, 0, VP_Y - 500);
    g.addColorStop(0, 'rgba(120,150,190,0.15)');
    g.addColorStop(0.35, 'rgba(78,100,140,0.06)');
    g.addColorStop(1, 'rgba(40,55,90,0.0)');
    ctx.save();
    ctx.globalCompositeOperation = 'source-atop';
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, PLATE_W, PLATE_H);
    ctx.restore();
  }

  // Kabel quer über die Gasse — bindet die beiden Seiten zusammen.
  // Wenige und hoch hängend: viele Leitungen auf Schilderhöhe lesen sich
  // nicht als Verkabelung, sondern als Kratzer auf dem Bild.
  for (let i = 0; i < 5; i++) {
    const d = rr(rng, 1.2, 4.6);
    const y = rr(rng, -620, -230);
    const [x0, y0] = project(-STREET_HALF, y, d);
    const [x1, y1] = project(STREET_HALF, y, d);
    cable(ctx, x0, y0, x1, y1, Math.max(6, 90 / d), 'rgba(6,9,14,0.95)', Math.max(2.2, 5 / d), 0.85);
    // Vereinzelt Lampen an den Kabeln — sparsam, sonst wird die Gasse
    // zu einer Lichterkette und verliert ihre Schwärze.
    if (chance(rng, 0.3)) {
      const n = ri(rng, 2, 3);
      for (let k = 1; k < n; k++) {
        const t = k / n;
        const lx = x0 + (x1 - x0) * t;
        const ly = y0 + (y1 - y0) * t + Math.max(6, 90 / d) * 2 * t * (1 - t) * 2;
        hangingLamp(ctx, lx, ly, Math.max(1.6, 8 / d), chance(rng, 0.7) ? '#ffcf94' : '#2ee6ff', Math.max(30, 190 / d));
      }
    }
  }

  // Zwei Gestalten in der Gasse. Sie liefern den Maßstab: ohne eine Figur
  // im Bild kann das Auge nicht entscheiden, ob die Gasse vier Meter breit
  // ist oder vierzig.
  figure(ctx, rng, -480, 1.55, { umbrella: true, rim: '#2ee6ff', rimSide: 1 });
  figure(ctx, rng, 340, 2.40, { umbrella: false, rim: '#ff8a4a', rimSide: -1, height: 320 });

  grime(ctx, rng, PLATE_W, PLATE_H, 0.05);
  return { canvas, ctx };
}

/* ========================================================================= */
/*  Boden: Asphalt + Nässemaske                                              */
/* ========================================================================= */

/** Die Straßenfläche als Pfad (zwischen den beiden Fassadenfüßen). */
function streetPath(ctx) {
  const dMin = 0.42;
  polyPath(ctx, [
    project(-STREET_HALF, CAM_H, FAR_D + 1.2),
    project(-STREET_HALF, CAM_H, dMin),
    project(STREET_HALF, CAM_H, dMin),
    project(STREET_HALF, CAM_H, FAR_D + 1.2),
  ]);
}

function plateGround(rng) {
  const { canvas, ctx } = makeCanvas();
  ctx.save();
  streetPath(ctx);
  ctx.clip();

  // Asphalt: dunkel, zum Horizont hin durch Dunst leicht aufgehellt.
  const g = ctx.createLinearGradient(0, VP_Y, 0, PLATE_H);
  g.addColorStop(0, '#141a26');
  g.addColorStop(0.25, '#0c111b');
  g.addColorStop(1, '#070a11');
  ctx.fillStyle = g;
  ctx.fillRect(0, VP_Y - 10, PLATE_W, PLATE_H - VP_Y + 10);

  // Fahrbahnstruktur: Platten- und Rinnenlinien laufen zum Fluchtpunkt.
  ctx.strokeStyle = 'rgba(150,175,210,0.055)';
  for (let d = 0.5; d < FAR_D + 1; d += 0.16) {
    const [xa, ya] = project(-STREET_HALF, CAM_H, d);
    const [xb, yb] = project(STREET_HALF, CAM_H, d);
    ctx.lineWidth = Math.max(0.6, 2.4 / d);
    ctx.beginPath();
    ctx.moveTo(xa, ya); ctx.lineTo(xb, yb);
    ctx.stroke();
  }
  for (let X = -STREET_HALF; X <= STREET_HALF; X += 155) {
    const [xa, ya] = project(X, CAM_H, 0.42);
    const [xb, yb] = project(X, CAM_H, FAR_D + 1.2);
    ctx.lineWidth = 1.4;
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.moveTo(xa, ya); ctx.lineTo(xb, yb);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // Gully, Schachtdeckel, Kanaldeckel
  for (let i = 0; i < 7; i++) {
    const d = rr(rng, 0.7, 4.0);
    const X = rr(rng, -STREET_HALF * 0.85, STREET_HALF * 0.85);
    const [cx, cy] = project(X, CAM_H, d);
    const rw = 120 / d;
    ctx.fillStyle = 'rgba(11,15,22,0.75)';
    ctx.beginPath();
    ctx.ellipse(cx, cy, rw, rw * 0.34, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(120,150,190,0.10)';
    ctx.lineWidth = Math.max(0.6, 2 / d);
    ctx.stroke();
  }

  // Kontaktschatten am Bordstein. Ohne ihn trifft helle Fahrbahn direkt auf
  // dunkle Wand und die Kante wirkt wie mit dem Messer geschnitten.
  for (const sgn of [-1, 1]) {
    for (let d = 0.42; d < FAR_D + 1; d += 0.12) {
      const [x0, y0] = project(sgn * STREET_HALF, CAM_H, d);
      const [x1, y1] = project(sgn * STREET_HALF, CAM_H, d + 0.14);
      const gw = 150 / d;
      const g = ctx.createLinearGradient(x0, y0, x0 - sgn * gw, y0);
      g.addColorStop(0, 'rgba(0,0,0,0.85)');
      g.addColorStop(0.35, 'rgba(0,0,0,0.35)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      polyPath(ctx, [[x0, y0], [x1, y1], [x1 - sgn * gw, y1], [x0 - sgn * gw, y0]]);
      ctx.fill();
    }
  }

  grime(ctx, rng, PLATE_W, PLATE_H, 0.08);
  ctx.restore();
  return { canvas, ctx };
}

/**
 * Nässemaske. R = Pfützentiefe (Spiegelstärke), G = Rauheit/Kräuselung,
 * B = Restnässe des Asphalts. Alpha begrenzt auf die Straßenfläche.
 */
function plateWet(rng) {
  const { canvas, ctx } = makeCanvas();
  ctx.save();
  streetPath(ctx);
  ctx.clip();

  // Grundnässe: alles ist nass, nur unterschiedlich stark. Bewusst niedrig —
  // ist der Grundwert hoch, spiegelt die ganze Fahrbahn gleichmäßig und
  // sieht aus wie poliertes Plastik statt wie nasser Asphalt.
  ctx.fillStyle = 'rgb(16,150,78)';
  ctx.fillRect(0, VP_Y - 10, PLATE_W, PLATE_H - VP_Y + 10);

  // Längsstreifen in Fahrtrichtung: Wasser sammelt sich in den Spurrinnen.
  ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 26; i++) {
    const X = rr(rng, -STREET_HALF, STREET_HALF);
    const wWorld = rr(rng, 40, 130);
    const a = rr(rng, 0.10, 0.34);
    ctx.fillStyle = `rgba(${Math.round(255 * a)},0,0,1)`;
    polyPath(ctx, [
      project(X - wWorld, CAM_H, 0.42), project(X + wWorld, CAM_H, 0.42),
      project(X + wWorld * 0.5, CAM_H, FAR_D + 1), project(X - wWorld * 0.5, CAM_H, FAR_D + 1),
    ]);
    ctx.fill();
  }
  ctx.globalCompositeOperation = 'source-over';

  // Pfützen: weiche Flecken, in der Perspektive breitgezogen.
  ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 190; i++) {
    const d = rr(rng, 0.45, FAR_D + 0.6);
    const X = rr(rng, -STREET_HALF * 1.05, STREET_HALF * 1.05);
    const [cx, cy] = project(X, CAM_H, d);
    const rw = rr(rng, 60, 340) / d;
    const rh = rw * rr(rng, 0.16, 0.34);
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rw);
    const strength = rr(rng, 0.35, 1.0);
    g.addColorStop(0, `rgba(${Math.round(210 * strength)},0,0,1)`);
    g.addColorStop(0.6, `rgba(${Math.round(120 * strength)},0,0,1)`);
    g.addColorStop(1, 'rgba(0,0,0,1)');
    ctx.fillStyle = g;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(1, rh / rw);
    ctx.beginPath();
    ctx.arc(0, 0, rw, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.globalCompositeOperation = 'source-over';

  // Rauheitsvariation im Grünkanal: trockenere Inseln, rauer Belag.
  ctx.globalCompositeOperation = 'multiply';
  for (let i = 0; i < 120; i++) {
    const d = rr(rng, 0.45, FAR_D);
    const X = rr(rng, -STREET_HALF, STREET_HALF);
    const [cx, cy] = project(X, CAM_H, d);
    const rw = rr(rng, 80, 300) / d;
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rw);
    g.addColorStop(0, `rgba(255,${ri(rng, 60, 200)},255,1)`);
    g.addColorStop(1, 'rgba(255,255,255,1)');
    ctx.fillStyle = g;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(1, 0.26);
    ctx.beginPath();
    ctx.arc(0, 0, rw, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.globalCompositeOperation = 'source-over';

  // Am Fahrbahnrand liegt Dreck; dort spiegelt nichts. Das nimmt der
  // Straßenfläche die harte geometrische Kante zur Hauswand.
  ctx.globalCompositeOperation = 'multiply';
  for (const sgn of [-1, 1]) {
    for (let d = 0.42; d < FAR_D + 1; d += 0.1) {
      const [x0, y0] = project(sgn * STREET_HALF, CAM_H, d);
      const [x1, y1] = project(sgn * STREET_HALF, CAM_H, d + 0.12);
      const gw = 110 / d;
      const g = ctx.createLinearGradient(x0, y0, x0 - sgn * gw, y0);
      g.addColorStop(0, 'rgba(0,255,0,1)');
      g.addColorStop(1, 'rgba(255,255,255,1)');
      ctx.fillStyle = g;
      polyPath(ctx, [[x0, y0], [x1, y1], [x1 - sgn * gw, y1], [x0 - sgn * gw, y0]]);
      ctx.fill();
    }
  }
  ctx.globalCompositeOperation = 'source-over';
  ctx.restore();
  return { canvas, ctx };
}

/* ========================================================================= */
/*  Vordergrund — dunkler Rahmen, unscharf                                   */
/* ========================================================================= */

function plateNear(rng) {
  const { canvas, ctx, w, h } = makeCanvas();

  // Zwei sehr nahe Baukanten links und rechts. Nicht reines Schwarz: eine
  // konturlose Fläche über einem Viertel des Bildes liest sich als Fehler,
  // nicht als Vordergrund. Sie bekommt Mauerwerk, Fenster und einen Lichtsaum
  // von der Straße her.
  for (const sgn of [-1, 1]) {
    const plane = sgn * STREET_HALF;
    const d0 = 0.30;
    const d1 = NEAR_D + 0.34;
    const shape = [
      project(plane, -2600, d1), project(plane, -2600, d0),
      project(plane, CAM_H, d0), project(plane, CAM_H, d1),
    ];

    ctx.fillStyle = '#070b14';
    polyPath(ctx, shape);
    ctx.fill();

    ctx.save();
    polyPath(ctx, shape);
    ctx.clip();

    // Grobe Mauerstruktur — nur Andeutung, kein Muster.
    ctx.globalAlpha = 0.5;
    for (let i = 0; i < 110; i++) {
      const yy = rr(rng, 0, PLATE_H);
      const xx = sgn < 0 ? rr(rng, -200, 900) : rr(rng, PLATE_W - 900, PLATE_W + 200);
      ctx.fillStyle = chance(rng, 0.35) ? 'rgba(255,255,255,0.010)' : 'rgba(0,0,0,0.4)';
      ctx.fillRect(xx, yy, rr(rng, 60, 340), rr(rng, 3, 22));
    }
    ctx.globalAlpha = 1;

    // Fenster, sehr schwach — die Wand steht im Schatten. Nur so viel Licht,
    // dass man beim zweiten Hinsehen erkennt, dass da ein Haus steht.
    facadeWindows(ctx, rng, plane, 0.34, d1, -1800, {
      floors: 14, lit: 0.10, maxAlpha: 0.30, colDepth: 0.05, warmBias: 0.75,
    });

    // Rohre als Silhouette vor der Wand
    const [px] = project(plane, 0, 0.55);
    pipes(ctx, rng, px - 180, -50, 360, PLATE_H + 100, 'rgba(2,4,9,0.95)', 3);

    // Lichtsaum von der nassen Straße her — knapp bemessen. Zu viel davon,
    // und der Vordergrund verliert seine Schwärze; dann liegt das ganze Bild
    // auf einem Helligkeitswert und wird flach.
    const [ex, ey] = project(plane, CAM_H, d1);
    const rim = ctx.createRadialGradient(ex, ey, 0, ex, ey, 900);
    rim.addColorStop(0, 'rgba(105,150,205,0.13)');
    rim.addColorStop(0.4, 'rgba(60,90,140,0.045)');
    rim.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = rim;
    ctx.fillRect(ex - 900, ey - 900, 1800, 1800);

    // Schmales Streiflicht direkt auf der Gebäudekante — trennt Vordergrund
    // und Gasse voneinander, ohne die Fläche aufzuhellen.
    const [cx0] = project(plane, -2600, d1);
    const grd = ctx.createLinearGradient(cx0, 0, cx0 - sgn * 55, 0);
    grd.addColorStop(0, 'rgba(160,200,245,0.22)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grd;
    ctx.fillRect(Math.min(cx0, cx0 - sgn * 55), 0, 55, PLATE_H);

    ctx.restore();
  }

  // Ein einzelnes Kabel dicht vor der Kamera — reicht als Vordergrundanker.
  cable(ctx, -80, 120, w + 80, 205, 210, 'rgba(2,4,8,0.98)', 8, 1);

  return { canvas, ctx };
}

/* ========================================================================= */

/**
 * Baut alle Platten der Gasse.
 * @param {number} seed
 */
export function buildAlley(seed = 7) {
  const rng = mulberry32(seed);
  const sky = plateSky(rng);
  const far = plateFar(rng);
  const street = plateStreet(rng);
  const ground = plateGround(rng);
  const wet = plateWet(rng);
  const near = plateNear(rng);

  return {
    id: 'alley',
    name: 'Kanalgasse',
    sector: 'SEKTOR 7 · UNTERSTADT',
    // Reihenfolge = Zeichenreihenfolge. `parallax` in Bildschirmanteilen.
    layers: [
      { name: 'sky',    canvas: sky.canvas,    parallax: 0.010, fog: 0.14, fogColor: [0.17, 0.16, 0.24], emissive: 1.00 },
      { name: 'far',    canvas: far.canvas,    parallax: 0.035, fog: 0.46, fogColor: [0.13, 0.16, 0.25], emissive: 0.82 },
      { name: 'street', canvas: street.canvas, parallax: 0.085, fog: 0.13, fogColor: [0.11, 0.14, 0.21], emissive: 1.08 },
    ],
    // Wird nach den obigen Ebenen und vor `foreground` ausgeführt.
    ground: { canvas: ground.canvas, wet: wet.canvas, parallax: 0.085 },
    foreground: [
      { name: 'near', canvas: near.canvas, parallax: 0.10, fog: 0.02, fogColor: [0.04, 0.06, 0.11], emissive: 0.52 },
    ],
  };
}
