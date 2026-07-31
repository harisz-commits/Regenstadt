/**
 * Point-and-Click-Schicht.
 *
 * Untersuchungspunkte sind unsichtbare Schaltflächen, die jeden Frame an die
 * Stelle im Bild gesetzt werden, an der ihr Gegenstand steht. Sichtbar wird
 * nur, was das Bild selbst tut: beim Überfahren geht ein Lichtsaum darin auf.
 *
 * Auf Geräten ohne Mauszeiger gibt es kein Überfahren — dort sind die Punkte
 * dauerhaft schwach zu sehen und leuchten beim Antippen auf.
 *
 * Punkte, die woanders hinführen, bekommen einen Pfeil statt eines Kreises.
 * Ein Kreis heißt „sieh dir das an", ein Pfeil heißt „geh dorthin"; die beiden
 * dürfen nicht gleich aussehen.
 */

import { isTouch } from '../ui/viewport.js';

const CSS = `
#hs-layer { position: fixed; inset: 0; z-index: 12; pointer-events: none; }
#hs-layer .hs {
  position: absolute; transform: translate(-50%, -50%);
  background: none; border: 0; padding: 0; margin: 0;
  cursor: pointer; pointer-events: auto; border-radius: 50%;
}
#hs-layer .hs:focus { outline: none; }
#hs-layer .hs .mark {
  position: absolute; inset: 0; border-radius: 50%;
  border: 1px solid rgba(210,232,255,.5);
  box-shadow: 0 0 14px rgba(150,200,255,.28), inset 0 0 10px rgba(150,200,255,.14);
  opacity: 0;
  /* Kein Uebergang auf der Deckkraft.
     Die Schaltflaeche bekommt jeden Frame neue Inline-Masse; dabei startete
     der Opacity-Uebergang staendig neu und blieb bei currentTime 0 haengen —
     die Marke wurde nie sichtbar. Ein frisch eingefuegtes Element mit
     derselben Klasse rechnete korrekt 0.8, das bestehende blieb auf 0.
     Ohne Uebergang schaltet sie sofort, und das genuegt hier voellig. */
}
#hs-layer .hs.person .mark { border-color: rgba(255,178,110,.62); box-shadow: 0 0 16px rgba(255,178,110,.32); }

/* Ausgänge: Pfeil statt Kreis, und dauerhaft sichtbar. Wohin man gehen kann,
   soll man sehen, ohne danach zu suchen. */
#hs-layer .hs.exit .mark {
  border: 0; box-shadow: none; opacity: .62;
  background: no-repeat center/62% 62%;
  filter: drop-shadow(0 2px 7px rgba(0,0,0,.95));
  animation: nudge 2.6s ease-in-out infinite;
}
#hs-layer .hs.exit.forward .mark {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23dcecff' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 20V5M6 11l6-6 6 6'/%3E%3C/svg%3E");
}
#hs-layer .hs.exit.back .mark {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23dcecff' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 4v15M6 13l6 6 6-6'/%3E%3C/svg%3E");
  animation-name: nudgeDown;
}
#hs-layer .hs.exit:hover .mark { opacity: 1; }
@keyframes nudge     { 0%,100% { transform: translateY(3px);  } 50% { transform: translateY(-3px); } }
@keyframes nudgeDown { 0%,100% { transform: translateY(-3px); } 50% { transform: translateY(3px);  } }

#hs-layer.reveal .hs .mark, #hs-layer .hs:focus-visible .mark { opacity: .8; }
#hs-layer.touch .hs:not(.exit) .mark { opacity: .32; }
#hs-layer.touch .hs.active .mark { opacity: .95; }

#hs-label {
  position: fixed; z-index: 14; pointer-events: none; transform: translate(-50%, 0);
  font: 11px/1 ui-monospace, "SFMono-Regular", Menlo, monospace;
  letter-spacing: .17em; text-transform: uppercase; color: #e8f2ff;
  text-shadow: 0 1px 8px rgba(0,0,0,.95), 0 0 22px rgba(0,0,0,.85);
  opacity: 0; transition: opacity .14s ease; white-space: nowrap;
}
#hs-label.on { opacity: 1; }

/* --- Untersuchungstafel: schiebt sich über das Vollbild ------------------ */
#panel {
  position: fixed; left: 0; right: 0; bottom: 0; z-index: 18;
  padding: 22px clamp(18px, 5vw, 70px) calc(26px + env(safe-area-inset-bottom));
  background: linear-gradient(to top, rgba(4,6,10,.985) 62%, rgba(4,6,10,.92) 86%, rgba(4,6,10,0));
  color: #cfe0f0; font: 14px/1.85 ui-monospace, "SFMono-Regular", Menlo, monospace;
  transform: translateY(103%); transition: transform .34s cubic-bezier(.22,.7,.3,1);
  max-height: 76dvh; overflow-y: auto;
  display: grid; grid-template-columns: auto 1fr; gap: 0 26px; align-items: start;
}
#panel.on { transform: translateY(0); }
#panel .shot {
  grid-row: 1 / span 3; width: min(38vw, 340px); aspect-ratio: 4 / 3;
  object-fit: cover; display: none;
  border: 1px solid rgba(126,190,230,.22);
  box-shadow: 0 10px 40px rgba(0,0,0,.75);
  opacity: 0; transition: opacity .4s ease;
}
#panel.has-shot .shot { display: block; }
#panel.has-shot .shot.ready { opacity: 1; }
#panel:not(.has-shot) .ttl,
#panel:not(.has-shot) .body,
#panel:not(.has-shot) .act { grid-column: 1 / -1; }
#panel .ttl { font-size: 10px; letter-spacing: .3em; color: #7fb4d8; margin-bottom: 11px; text-transform: uppercase; }
#panel .body { max-width: 62ch; margin: 0; min-height: 3.6em; }
#panel .act { margin-top: 17px; display: flex; gap: 10px; flex-wrap: wrap; }
#panel button, #akte button {
  font: inherit; font-size: 11px; letter-spacing: .16em; text-transform: uppercase;
  padding: 10px 17px; cursor: pointer; color: #9ec8e4;
  background: rgba(126,190,230,.07); border: 1px solid rgba(126,190,230,.3);
  transition: background .15s, border-color .15s;
}
#panel button:hover, #akte button:hover { background: rgba(126,190,230,.16); border-color: rgba(126,190,230,.6); }
#panel button.mark-clue { color: #ffbe74; border-color: rgba(255,190,116,.38); background: rgba(255,190,116,.07); }
#panel button.mark-clue:hover { background: rgba(255,190,116,.16); }
#panel button.go { color: #cfe6ff; border-color: rgba(207,230,255,.45); background: rgba(207,230,255,.10); }

#topbar {
  position: fixed; top: 0; left: 0; right: 0; z-index: 16;
  display: flex; justify-content: space-between; align-items: flex-start;
  padding: calc(16px + env(safe-area-inset-top)) clamp(16px, 4vw, 40px) 16px;
  font: 10px/1.5 ui-monospace, Menlo, monospace; letter-spacing: .26em;
  color: rgba(190,214,235,.62); text-transform: uppercase;
  background: linear-gradient(to bottom, rgba(4,6,10,.66), rgba(4,6,10,0));
  pointer-events: none;
}
#topbar .actions { display: flex; align-items: center; }
#topbar .right { pointer-events: auto; cursor: pointer; color: rgba(190,214,235,.62); }
#topbar .right:hover { color: #e8f2ff; }
#topbar .sector { color: rgba(255,150,90,.72); }
#topbar .place { color: #dbe9f7; font-size: 13px; letter-spacing: .2em; margin-top: 5px; }
#topbar .help {
  margin-left: 15px; border: 1px solid rgba(126,190,230,.3); border-radius: 50%;
  width: 23px; height: 23px; display: inline-flex; align-items: center;
  justify-content: center; letter-spacing: 0;
}
#topbar .help:hover { border-color: rgba(126,190,230,.7); }

#akte {
  position: fixed; inset: 0; z-index: 30; background: rgba(3,5,9,.975);
  display: none; flex-direction: column; overflow-y: auto;
  padding: clamp(20px, 5vw, 60px) clamp(18px, 5vw, 60px) calc(40px + env(safe-area-inset-bottom));
  font: 13px/1.85 ui-monospace, Menlo, monospace; color: #b9cfe2;
}
#akte.on { display: flex; }
#akte h2 { font-size: 11px; letter-spacing: .3em; color: #7fb4d8; margin: 0 0 22px; font-weight: 400; }
#akte .item { border-left: 2px solid rgba(255,190,116,.5); padding-left: 14px; margin-bottom: 20px; max-width: 74ch; }
#akte .item .h { color: #ffd7a4; letter-spacing: .1em; font-size: 12px; }
#akte .item .t { opacity: .72; margin-top: 5px; }
#akte .empty { opacity: .4; }
#akte button { align-self: flex-start; margin-top: 24px; }

#hint-bar {
  position: fixed; left: 50%; transform: translateX(-50%); z-index: 15;
  bottom: calc(18px + env(safe-area-inset-bottom));
  font: 10px/1.6 ui-monospace, Menlo, monospace; letter-spacing: .18em;
  text-transform: uppercase; color: rgba(206,226,244,.75);
  background: rgba(4,6,10,.66); border: 1px solid rgba(126,190,230,.18);
  padding: 9px 16px; text-align: center; max-width: min(92vw, 660px);
  opacity: 0; transition: opacity .5s ease; pointer-events: none;
  text-shadow: 0 1px 6px rgba(0,0,0,.9);
}
#hint-bar.on { opacity: 1; }

/* Schwarzblende beim Ortswechsel */
#fade {
  position: fixed; inset: 0; z-index: 24; background: #04060a;
  opacity: 0; pointer-events: none; transition: opacity .3s ease;
}
#fade.on { opacity: 1; }

@media (max-width: 820px) {
  #panel { font-size: 15px; line-height: 1.7; padding-left: 18px; padding-right: 18px;
           grid-template-columns: 1fr; gap: 0; }
  #panel .shot { grid-row: auto; width: 100%; max-width: 420px; margin-bottom: 16px; }
  #panel .body { max-width: none; }
  #panel button, #akte button { padding: 12px 18px; font-size: 12px; }
  #topbar .place { font-size: 12px; }
  #akte { font-size: 14px; }
  #hs-label { font-size: 12px; }
  #hint-bar { letter-spacing: .12em; }
}
@media (prefers-reduced-motion: reduce) {
  #panel, #fade, #panel .shot { transition: none; }
  #hs-layer .hs.exit .mark { animation: none; }
}
`;

/**
 * @param {import('../render/renderer.js').Renderer} renderer
 * @param {{ getScene: () => object, goTo: (id: string) => Promise<void> }} host
 */
export function createInteraction(renderer, host) {
  const style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  const touch = isTouch();

  /* --- Kopfzeile --------------------------------------------------------- */
  const top = document.createElement('div');
  top.id = 'topbar';
  const where = document.createElement('div');
  where.innerHTML = '<div class="sector"></div><div class="place"></div>';
  const actions = document.createElement('div');
  actions.className = 'actions';
  const akteBtn = document.createElement('div');
  akteBtn.className = 'right';
  const helpBtn = document.createElement('div');
  helpBtn.className = 'right help';
  helpBtn.textContent = '?';
  helpBtn.setAttribute('role', 'button');
  helpBtn.setAttribute('aria-label', 'Steuerung anzeigen');
  actions.append(akteBtn, helpBtn);
  top.append(where, actions);
  document.body.appendChild(top);

  const layer = document.createElement('div');
  layer.id = 'hs-layer';
  if (touch) layer.classList.add('touch');
  document.body.appendChild(layer);

  const label = document.createElement('div');
  label.id = 'hs-label';
  document.body.appendChild(label);

  const fade = document.createElement('div');
  fade.id = 'fade';
  document.body.appendChild(fade);

  const panel = document.createElement('div');
  panel.id = 'panel';
  panel.innerHTML =
    '<img class="shot" alt="" /><div class="ttl"></div><p class="body"></p><div class="act"></div>';
  document.body.appendChild(panel);
  const pShot = panel.querySelector('.shot');
  const pTtl = panel.querySelector('.ttl');
  const pBody = panel.querySelector('.body');
  const pAct = panel.querySelector('.act');
  pShot.addEventListener('load', () => pShot.classList.add('ready'));

  const akte = document.createElement('div');
  akte.id = 'akte';
  document.body.appendChild(akte);

  const hintBar = document.createElement('div');
  hintBar.id = 'hint-bar';
  // Kurz halten: auf einem Handy lief der lange Satz ueber vier Zeilen und
  // verdeckte mehr Bild, als er erklaerte.
  hintBar.textContent = touch
    ? 'Antippen · Pfeile führen weiter · ziehen zum Umsehen'
    : 'Klicken zum Untersuchen · Pfeile führen weiter · TAB zeigt alle Punkte';
  document.body.appendChild(hintBar);

  /* --- Akte -------------------------------------------------------------- */
  const notes = [];
  const seen = new Set();

  function renderAkte() {
    akte.innerHTML = '<h2>Ermittlungsakte</h2>';
    if (notes.length === 0) {
      const e = document.createElement('div');
      e.className = 'empty';
      e.textContent = 'Noch nichts festgehalten. Sieh dich um.';
      akte.appendChild(e);
    }
    for (const n of notes) {
      const d = document.createElement('div');
      d.className = 'item';
      d.innerHTML = '<div class="h"></div><div class="t"></div>';
      d.querySelector('.h').textContent = n.label;
      d.querySelector('.t').textContent = n.text;
      akte.appendChild(d);
    }
    const b = document.createElement('button');
    b.textContent = 'Schließen';
    b.onclick = () => akte.classList.remove('on');
    akte.appendChild(b);
  }
  const updateAkteBtn = () => { akteBtn.textContent = `Akte · ${notes.length}`; };
  updateAkteBtn();
  akteBtn.onclick = () => { renderAkte(); akte.classList.add('on'); };

  /* --- Steuerungshilfe ---------------------------------------------------- */
  let hintTimer = null;
  function showHint(ms = 8000) {
    hintBar.classList.add('on');
    clearTimeout(hintTimer);
    hintTimer = setTimeout(() => hintBar.classList.remove('on'), ms);
  }
  helpBtn.addEventListener('click', () => {
    if (hintBar.classList.contains('on')) {
      hintBar.classList.remove('on');
      clearTimeout(hintTimer);
    } else showHint(10000);
  });
  setTimeout(() => showHint(), 900);

  /* --- Tafel -------------------------------------------------------------- */
  let typer = null;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const base = import.meta.env.BASE_URL || '/';

  function say(spot) {
    clearInterval(typer);
    pTtl.textContent = spot.label;
    pAct.innerHTML = '';

    // Nahaufnahme: dafür ist das Untersuchen da — es soll etwas passieren,
    // nicht nur ein Satz erscheinen.
    pShot.classList.remove('ready');
    if (spot.detail) {
      panel.classList.add('has-shot');
      pShot.src = base + spot.detail;
      pShot.alt = spot.label;
    } else {
      panel.classList.remove('has-shot');
      pShot.removeAttribute('src');
    }

    const full = spot.text || '';
    if (reduced || full.length === 0) {
      pBody.textContent = full;
    } else {
      pBody.textContent = '';
      let i = 0;
      typer = setInterval(() => {
        i += 2;
        pBody.textContent = full.slice(0, i);
        if (i >= full.length) { clearInterval(typer); typer = null; }
      }, 14);
    }

    if (spot.goto) {
      const g = document.createElement('button');
      g.className = 'go';
      g.textContent = spot.dir === 'back' ? 'Zurückgehen' : 'Hingehen';
      g.onclick = () => { close(); host.goTo(spot.goto); };
      pAct.appendChild(g);
    }

    if (full && !seen.has(spot.id)) {
      const b = document.createElement('button');
      b.className = 'mark-clue';
      b.textContent = 'In die Akte';
      b.onclick = () => {
        seen.add(spot.id);
        notes.push({ label: spot.label, text: full });
        updateAkteBtn();
        b.remove();
      };
      pAct.appendChild(b);
    }

    const c = document.createElement('button');
    c.textContent = 'Weiter';
    c.onclick = close;
    pAct.appendChild(c);

    panel.classList.add('on');
  }

  function close() {
    panel.classList.remove('on');
    clearInterval(typer);
    typer = null;
    if (touch) {
      for (const n of nodes) n.el.classList.remove('active');
      hovered = null;
    }
  }

  /* --- Punkte ------------------------------------------------------------- */
  /** @type {{spot: object, el: HTMLButtonElement}[]} */
  let nodes = [];
  let hovered = null;
  let hoverAmt = 0;

  function buildSpots(spots) {
    layer.innerHTML = '';
    hovered = null;
    hoverAmt = 0;
    renderer.hover[3] = 0;
    nodes = spots.map((s) => {
      const b = document.createElement('button');
      b.className = 'hs' + (s.kind ? ' ' + s.kind : '') + (s.dir ? ' ' + s.dir : '');
      b.type = 'button';
      b.setAttribute('aria-label', s.label);
      b.innerHTML = '<span class="mark"></span>';
      b.addEventListener('pointerenter', () => { if (!touch) hovered = s; });
      b.addEventListener('pointerleave', () => { if (!touch && hovered === s) hovered = null; });
      b.addEventListener('focus', () => { hovered = s; });
      b.addEventListener('blur', () => { if (hovered === s) hovered = null; });
      b.addEventListener('click', () => {
        // Wer quer gezogen hat, wollte sich umsehen und nicht untersuchen.
        if (wasDrag()) return;
        // Ein Pfeil ohne weiteren Text führt sofort weiter — dafür ist er da.
        if (s.goto && !s.text) { close(); host.goTo(s.goto); return; }
        if (touch) {
          for (const n of nodes) n.el.classList.remove('active');
          b.classList.add('active');
          hovered = s;
        }
        say(s);
      });
      layer.appendChild(b);
      return { spot: s, el: b };
    });
  }

  /* --- Seitliches Umsehen -------------------------------------------------- */
  let dragging = false;
  let lastX = 0;
  let moved = 0;
  const stageEl = document.getElementById('stage');

  stageEl.addEventListener('pointerdown', (e) => {
    dragging = true; lastX = e.clientX; moved = 0;
  });
  addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    lastX = e.clientX;
    moved += Math.abs(dx);
    const lim = renderer.panLimit();
    if (lim <= 0.0005) return;
    const perPx = renderer.uvScale()[0] / Math.max(1, renderer.cssWidth);
    renderer.cam.panX = Math.max(-lim, Math.min(lim, renderer.cam.panX - dx * perPx));
  });
  for (const ev of ['pointerup', 'pointercancel']) {
    addEventListener(ev, () => { dragging = false; });
  }
  const wasDrag = () => moved > 9;

  addEventListener('keydown', (e) => {
    if (e.key === 'Tab') { e.preventDefault(); layer.classList.add('reveal'); }
    if (e.key === 'Escape') { close(); akte.classList.remove('on'); }
  });
  addEventListener('keyup', (e) => {
    if (e.key === 'Tab') layer.classList.remove('reveal');
  });

  return {
    /** Ort wechseln: Punkte neu setzen, Kopfzeile beschriften. */
    setScene(scene) {
      buildSpots(scene.spots);
      where.querySelector('.sector').textContent = scene.sector;
      where.querySelector('.place').textContent = scene.name;
      renderer.cam.panX = 0;
    },
    /** Kurze Schwarzblende, damit ein Ortswechsel nicht springt. */
    async fadeOut() {
      fade.classList.add('on');
      await new Promise((r) => setTimeout(r, reduced ? 0 : 300));
    },
    fadeIn() { fade.classList.remove('on'); },

    update(dt) {
      const h = renderer.cssHeight || 1;
      const plateH = renderer.plateScreenHeight();
      for (const { spot, el } of nodes) {
        const [x, y] = renderer.plateUvToScreen(spot.u, spot.v);
        // Maßstab ist die Höhe der PLATTE auf dem Schirm, nicht die
        // Fensterhöhe — sonst werden die Flächen im Hochformat riesig.
        const px = Math.max(34, Math.min(spot.r * plateH * 1.35, h * 0.5));
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        el.style.width = `${px}px`;
        el.style.height = `${px}px`;
      }

      const target = hovered ? 1 : 0;
      hoverAmt += (target - hoverAmt) * (1 - Math.pow(0.0015, dt));

      if (hoverAmt > 0.002 && hovered) {
        const [x, y] = renderer.plateUvToScreen(hovered.u, hovered.v);
        renderer.hover[0] = x / (renderer.cssWidth || 1);
        renderer.hover[1] = 1 - y / h;
        renderer.hover[2] = hovered.r * 1.15;
        renderer.hover[3] = hoverAmt;
        label.style.left = `${x}px`;
        label.style.top = `${y + Math.max(34, hovered.r * plateH * 1.35) * 0.5 + 12}px`;
        label.textContent = hovered.label;
        label.classList.add('on');
      } else {
        renderer.hover[3] = hoverAmt;
        label.classList.remove('on');
      }
    },
  };
}
