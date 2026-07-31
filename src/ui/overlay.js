/**
 * Einstellungs- und Messwert-Overlay — ein WERKZEUG, kein Teil des Spiels.
 *
 * F1 oder ^ blendet es ein. Es weist sich im Spielbild bewusst mit nichts
 * mehr aus: eine Zeile „F1 · Bildsteuerung" am unteren Rand liest sich für
 * jemanden, der spielen will, als sinnlose Beschriftung.
 */

import { SCHEMA } from '../render/params.js';

const CSS = `
#ov {
  position: fixed; top: 0; right: 0; bottom: 0; width: 330px; z-index: 30;
  background: rgba(5,8,14,.93); border-left: 1px solid rgba(46,230,255,.22);
  color: #9fb4cc; font: 11px/1.5 ui-monospace, "SFMono-Regular", Menlo, monospace;
  overflow-y: auto; padding: 12px 14px 40px; display: none;
  backdrop-filter: blur(8px);
}
#ov.on { display: block; }
#ov h2 { font-size: 10px; letter-spacing: .22em; color: #2ee6ff; margin: 0 0 10px; font-weight: 500; }
#ov .grp { color: #ff2d6f; letter-spacing: .18em; font-size: 9px; margin: 16px 0 7px; }
#ov .row { display: grid; grid-template-columns: 1fr 52px; gap: 6px; align-items: center; margin-bottom: 5px; }
#ov label { color: #8fa6bd; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
#ov .val { text-align: right; color: #dff0ff; font-variant-numeric: tabular-nums; }
#ov input[type=range] { grid-column: 1 / -1; width: 100%; height: 3px; appearance: none; background: rgba(46,230,255,.18); outline: none; margin: 0 0 3px; }
#ov input[type=range]::-webkit-slider-thumb { appearance: none; width: 11px; height: 11px; border-radius: 50%; background: #2ee6ff; cursor: pointer; }
#ov input[type=range]::-moz-range-thumb { width: 11px; height: 11px; border: 0; border-radius: 50%; background: #2ee6ff; cursor: pointer; }
#ov button { width: 100%; margin-top: 8px; padding: 8px; background: rgba(255,45,111,.10);
  border: 1px solid rgba(255,45,111,.4); color: #ff2d6f; font: inherit; letter-spacing: .14em;
  text-transform: uppercase; cursor: pointer; }
#ov button:hover { background: rgba(255,45,111,.2); }
#ov pre { margin: 0; color: #6f8399; font-size: 10px; white-space: pre-wrap; }
#perf { position: fixed; top: 8px; left: 8px; z-index: 29; display: none;
  font: 10px/1.4 ui-monospace, Menlo, monospace; color: #7fe8ff;
  background: rgba(5,8,14,.72); padding: 6px 8px; border: 1px solid rgba(46,230,255,.18); }
#perf.on { display: block; }
#perf canvas { display: block; margin-top: 4px; image-rendering: pixelated; }
`;

export function createOverlay(params, hooks = {}) {
  const style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  const ov = document.createElement('div');
  ov.id = 'ov';
  ov.innerHTML = '<h2>REGENSTADT · BILDSTEUERUNG</h2>';

  for (const entry of SCHEMA) {
    if (entry.length === 1) {
      const g = document.createElement('div');
      g.className = 'grp';
      g.textContent = entry[0];
      ov.appendChild(g);
      continue;
    }
    const [key, label, min, max, step] = entry;
    const row = document.createElement('div');
    row.className = 'row';
    const l = document.createElement('label');
    l.textContent = label;
    const v = document.createElement('span');
    v.className = 'val';
    const input = document.createElement('input');
    input.type = 'range';
    input.min = String(min);
    input.max = String(max);
    input.step = String(step);
    input.value = String(params[key]);
    const show = () => { v.textContent = Number(params[key]).toFixed(step < 0.01 ? 4 : 2); };
    show();
    input.addEventListener('input', () => {
      params[key] = parseFloat(input.value);
      show();
      hooks.onChange?.(key, params[key]);
    });
    row.append(l, v, input);
    ov.appendChild(row);
  }

  const btnSeed = document.createElement('button');
  btnSeed.textContent = 'Stadt neu würfeln';
  btnSeed.onclick = () => hooks.onReseed?.();
  ov.appendChild(btnSeed);

  const btnDump = document.createElement('button');
  btnDump.textContent = 'Werte in die Konsole';
  btnDump.onclick = () => {
    const out = {};
    for (const e of SCHEMA) if (e.length > 1) out[e[0]] = params[e[0]];
    console.log(JSON.stringify(out, null, 2));
  };
  ov.appendChild(btnDump);
  document.body.appendChild(ov);

  // --- Messwerte ----------------------------------------------------------
  const perf = document.createElement('div');
  perf.id = 'perf';
  const txt = document.createElement('pre');
  const cv = document.createElement('canvas');
  cv.width = 150;
  cv.height = 34;
  perf.append(txt, cv);
  document.body.appendChild(perf);
  const pctx = cv.getContext('2d');

  const hist = new Float32Array(150);
  let hi = 0;
  let acc = 0;
  let frames = 0;

  addEventListener('keydown', (e) => {
    if (e.key === 'F1' || e.key === '^' || e.key === '`') {
      e.preventDefault();
      const on = ov.classList.toggle('on');
      perf.classList.toggle('on', on);
    }
  });

  return {
    /** @param {number} ms Frame-Zeit in Millisekunden */
    sample(ms) {
      hist[hi] = ms;
      hi = (hi + 1) % hist.length;
      acc += ms;
      frames++;
      if (frames < 20) return;

      const avg = acc / frames;
      acc = 0;
      frames = 0;

      // 1%-Low: der schlechteste Frame zählt, nicht der Durchschnitt.
      const sorted = Array.from(hist).filter((x) => x > 0).sort((a, b) => b - a);
      const low = sorted[Math.floor(sorted.length * 0.01)] || avg;
      txt.textContent =
        `${(1000 / avg).toFixed(0)} FPS   ${avg.toFixed(1)} ms\n1% low  ${low.toFixed(1)} ms`;

      pctx.clearRect(0, 0, cv.width, cv.height);
      pctx.fillStyle = 'rgba(46,230,255,.10)';
      pctx.fillRect(0, 0, cv.width, cv.height);
      // 16.7-ms-Linie als Bezug
      const y60 = cv.height - (16.7 / 40) * cv.height;
      pctx.fillStyle = 'rgba(255,45,111,.35)';
      pctx.fillRect(0, y60, cv.width, 1);
      pctx.fillStyle = '#2ee6ff';
      for (let i = 0; i < hist.length; i++) {
        const v = hist[(hi + i) % hist.length];
        const h = Math.min(cv.height, (v / 40) * cv.height);
        pctx.fillRect(i, cv.height - h, 1, h);
      }
    },
  };
}
