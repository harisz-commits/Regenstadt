/**
 * Point-and-Click-Schicht.
 *
 * Die Untersuchungspunkte sind unsichtbare Schaltflächen, die jeden Frame an
 * die Stelle im Bild gesetzt werden, an der ihr Gegenstand steht. Sichtbar
 * wird nur, was das Bild selbst tut: beim Überfahren geht ein Lichtsaum auf.
 *
 * Bewusst KEINE dauerhaft pulsierenden Punkte über der Szene. Wer alles auf
 * einmal sehen will, hält TAB gedrückt — so machen es moderne Adventures, und
 * es hält das Standbild frei.
 */

import { isTouch } from '../ui/viewport.js';

const CSS = `
#hs-layer { position: fixed; inset: 0; z-index: 12; pointer-events: none; }
#hs-layer .hs {
  position: absolute; transform: translate(-50%, -50%);
  background: none; border: 0; padding: 0; margin: 0;
  cursor: pointer; pointer-events: auto;
  border-radius: 50%;
}
#hs-layer .hs:focus { outline: none; }
#hs-layer .hs .mark {
  position: absolute; inset: 0; border-radius: 50%;
  border: 1px solid rgba(210,232,255,.5);
  box-shadow: 0 0 14px rgba(150,200,255,.28), inset 0 0 10px rgba(150,200,255,.14);
  opacity: 0; transition: opacity .18s ease;
}
#hs-layer .hs.person .mark { border-color: rgba(255,178,110,.62); box-shadow: 0 0 16px rgba(255,178,110,.32); }
#hs-layer .hs.exit .mark { border-style: dashed; }
#hs-layer.reveal .hs .mark, #hs-layer .hs:focus-visible .mark { opacity: .8; }
/* Ohne Mauszeiger gibt es kein Ueberfahren — dann muessen die Punkte
   dauerhaft sichtbar sein, sonst findet sie niemand. */
#hs-layer.touch .hs .mark { opacity: .34; }
#hs-layer.touch .hs.active .mark { opacity: .95; }

#hs-label {
  position: fixed; z-index: 14; pointer-events: none;
  transform: translate(-50%, 0);
  font: 11px/1 ui-monospace, "SFMono-Regular", Menlo, monospace;
  letter-spacing: .17em; text-transform: uppercase;
  color: #e8f2ff; text-shadow: 0 1px 8px rgba(0,0,0,.95), 0 0 22px rgba(0,0,0,.8);
  opacity: 0; transition: opacity .14s ease;
  white-space: nowrap;
}
#hs-label.on { opacity: 1; }

#panel {
  position: fixed; left: 0; right: 0; bottom: 0; z-index: 18;
  padding: 26px clamp(20px, 6vw, 90px) 30px;
  background: linear-gradient(to top, rgba(4,6,10,.97) 55%, rgba(4,6,10,.86) 82%, rgba(4,6,10,0));
  color: #cfe0f0; font: 14px/1.9 ui-monospace, "SFMono-Regular", Menlo, monospace;
  transform: translateY(103%); transition: transform .32s cubic-bezier(.22,.7,.3,1);
}
#panel.on { transform: translateY(0); }
#panel .ttl {
  font-size: 10px; letter-spacing: .3em; color: #7fb4d8;
  margin-bottom: 12px; text-transform: uppercase;
}
#panel .body { max-width: 68ch; margin: 0; min-height: 3.8em; }
#panel .body .cursor { opacity: .55; }
#panel .act { margin-top: 18px; display: flex; gap: 10px; flex-wrap: wrap; }
#panel button {
  font: inherit; font-size: 11px; letter-spacing: .16em; text-transform: uppercase;
  padding: 9px 16px; cursor: pointer; color: #9ec8e4;
  background: rgba(126,190,230,.07); border: 1px solid rgba(126,190,230,.3);
  transition: background .15s, border-color .15s;
}
#panel button:hover { background: rgba(126,190,230,.16); border-color: rgba(126,190,230,.6); }
#panel button.mark-clue { color: #ffbe74; border-color: rgba(255,190,116,.38); background: rgba(255,190,116,.07); }
#panel button.mark-clue:hover { background: rgba(255,190,116,.16); }

#topbar {
  position: fixed; top: 0; left: 0; right: 0; z-index: 16;
  display: flex; justify-content: space-between; align-items: flex-start;
  padding: 16px clamp(16px, 4vw, 40px);
  font: 10px/1.5 ui-monospace, Menlo, monospace; letter-spacing: .26em;
  color: rgba(190,214,235,.62); text-transform: uppercase;
  background: linear-gradient(to bottom, rgba(4,6,10,.62), rgba(4,6,10,0));
  pointer-events: none;
}
#topbar .right { pointer-events: auto; cursor: pointer; color: rgba(190,214,235,.62); }
#topbar .right:hover { color: #e8f2ff; }
#topbar .sector { color: rgba(255,150,90,.7); }
#topbar .place { color: #dbe9f7; font-size: 13px; letter-spacing: .2em; margin-top: 5px; }

#akte {
  position: fixed; inset: 0; z-index: 30; background: rgba(3,5,9,.975);
  display: none; flex-direction: column;
  padding: clamp(20px, 5vw, 60px);
  font: 13px/1.85 ui-monospace, Menlo, monospace; color: #b9cfe2;
  overflow-y: auto;
}
#akte.on { display: flex; }
#akte h2 { font-size: 11px; letter-spacing: .3em; color: #7fb4d8; margin: 0 0 22px; font-weight: 400; }
#akte .item { border-left: 2px solid rgba(255,190,116,.5); padding-left: 14px; margin-bottom: 20px; max-width: 74ch; }
#akte .item .h { color: #ffd7a4; letter-spacing: .1em; font-size: 12px; }
#akte .item .t { opacity: .72; margin-top: 5px; }
#akte .empty { opacity: .4; }
#akte button {
  align-self: flex-start; margin-top: 26px; font: inherit; font-size: 11px;
  letter-spacing: .16em; text-transform: uppercase; padding: 9px 18px; cursor: pointer;
  color: #9ec8e4; background: rgba(126,190,230,.07); border: 1px solid rgba(126,190,230,.3);
}
#akte button:hover { background: rgba(126,190,230,.16); }
#hint-bar {
  position: fixed; left: 50%; transform: translateX(-50%); z-index: 15;
  bottom: calc(18px + env(safe-area-inset-bottom));
  font: 10px/1.6 ui-monospace, Menlo, monospace; letter-spacing: .18em;
  text-transform: uppercase; color: rgba(206,226,244,.72);
  background: rgba(4,6,10,.62); border: 1px solid rgba(126,190,230,.18);
  padding: 9px 16px; text-align: center; max-width: min(92vw, 640px);
  opacity: 0; transition: opacity .5s ease; pointer-events: none;
  text-shadow: 0 1px 6px rgba(0,0,0,.9);
}
#hint-bar.on { opacity: 1; }
#topbar .help {
  pointer-events: auto; cursor: pointer; margin-left: 16px;
  border: 1px solid rgba(126,190,230,.3); border-radius: 50%;
  width: 22px; height: 22px; display: inline-flex;
  align-items: center; justify-content: center; letter-spacing: 0;
}
#topbar .help:hover { color: #e8f2ff; border-color: rgba(126,190,230,.7); }
#topbar .actions { display: flex; align-items: center; }

/* Aussparungen randloser Geraete */
#topbar { padding-top: calc(16px + env(safe-area-inset-top)); }
#panel { padding-bottom: calc(30px + env(safe-area-inset-bottom)); }
#akte { padding-bottom: calc(40px + env(safe-area-inset-bottom)); }

@media (max-width: 780px) {
  #panel { font-size: 15px; line-height: 1.75; padding: 20px 18px 26px; }
  #panel .body { max-width: none; }
  #panel button { padding: 12px 18px; font-size: 12px; }
  #topbar { padding-left: 14px; padding-right: 14px; }
  #topbar .place { font-size: 12px; }
  #akte { font-size: 14px; padding: 20px 18px; }
  #hs-label { font-size: 12px; }
  #hint-bar { font-size: 10px; letter-spacing: .12em; }
}
/* --- Hochformat -----------------------------------------------------------
   Das Bild liegt in einem Band im oberen Drittel, darunter die Bedienung.
   Der Untersuchungstext schiebt sich dort nicht ueber die Szene, sondern
   fuellt den Bereich, der ohnehin dafuer da ist. */
body.portrait #stage {
  box-shadow: 0 0 0 1px rgba(126,190,230,.14), 0 18px 60px rgba(0,0,0,.7);
}
body.portrait #panel {
  background: linear-gradient(to top, rgba(4,6,10,.99) 70%, rgba(4,6,10,.94));
  border-top: 1px solid rgba(126,190,230,.14);
  max-height: 42dvh; overflow-y: auto;
}
body.portrait #hint-bar { bottom: calc(14px + env(safe-area-inset-bottom)); }

@media (prefers-reduced-motion: reduce) { #panel { transition: none; } }
`;

export function createInteraction(renderer, { spots, place, sector }) {
  const style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  /* --- Kopfzeile --------------------------------------------------------- */
  const top = document.createElement('div');
  top.id = 'topbar';
  top.innerHTML =
    `<div><div class="sector">${sector}</div><div class="place">${place}</div></div>`;
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
  top.appendChild(actions);
  document.body.appendChild(top);

  const touch = isTouch();

  /* --- Punkte ------------------------------------------------------------ */
  const layer = document.createElement('div');
  layer.id = 'hs-layer';
  if (touch) layer.classList.add('touch');
  document.body.appendChild(layer);

  const label = document.createElement('div');
  label.id = 'hs-label';
  document.body.appendChild(label);

  /* --- Untersuchungstafel ------------------------------------------------ */
  const panel = document.createElement('div');
  panel.id = 'panel';
  panel.innerHTML = '<div class="ttl"></div><p class="body"></p><div class="act"></div>';
  document.body.appendChild(panel);
  const pTtl = panel.querySelector('.ttl');
  const pBody = panel.querySelector('.body');
  const pAct = panel.querySelector('.act');

  /* --- Akte -------------------------------------------------------------- */
  const akte = document.createElement('div');
  akte.id = 'akte';
  document.body.appendChild(akte);

  /* --- Steuerungshilfe ---------------------------------------------------- */
  const hintBar = document.createElement('div');
  hintBar.id = 'hint-bar';
  hintBar.textContent = touch
    ? 'Auf einen Punkt tippen zum Untersuchen  ·  Akte oben rechts'
    : 'Klicken zum Untersuchen  ·  TAB zeigt alle Punkte  ·  ESC schließt';
  document.body.appendChild(hintBar);

  let hintTimer = null;
  function showHint(ms = 7000) {
    hintBar.classList.add('on');
    clearTimeout(hintTimer);
    hintTimer = setTimeout(() => hintBar.classList.remove('on'), ms);
  }
  function toggleHint() {
    if (hintBar.classList.contains('on')) {
      hintBar.classList.remove('on');
      clearTimeout(hintTimer);
    } else showHint(9000);
  }
  helpBtn.addEventListener('click', toggleHint);
  // Beim ersten Start einmal von selbst zeigen — wer nicht weiß, dass er
  // klicken kann, sieht nur ein hübsches Standbild.
  setTimeout(() => showHint(), 900);

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
      d.innerHTML = `<div class="h"></div><div class="t"></div>`;
      d.querySelector('.h').textContent = n.label;
      d.querySelector('.t').textContent = n.text;
      akte.appendChild(d);
    }
    const b = document.createElement('button');
    b.textContent = 'Schließen';
    b.onclick = () => akte.classList.remove('on');
    akte.appendChild(b);
  }
  function updateAkteBtn() {
    akteBtn.textContent = `Akte · ${notes.length}`;
  }
  updateAkteBtn();
  akteBtn.onclick = () => { renderAkte(); akte.classList.add('on'); };

  /* --- Schreibmaschine --------------------------------------------------- */
  let typer = null;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function say(spot) {
    clearInterval(typer);
    pTtl.textContent = spot.label;
    pAct.innerHTML = '';

    const full = spot.text;
    if (reduced) {
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

    if (!seen.has(spot.id)) {
      const b = document.createElement('button');
      b.className = 'mark-clue';
      b.textContent = 'In die Akte';
      b.onclick = () => {
        seen.add(spot.id);
        notes.push({ label: spot.label, text: spot.text });
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

  /* --- Schaltflächen anlegen --------------------------------------------- */
  const nodes = spots.map((s) => {
    const b = document.createElement('button');
    b.className = 'hs' + (s.kind ? ' ' + s.kind : '');
    b.type = 'button';
    b.setAttribute('aria-label', s.label);
    b.innerHTML = '<span class="mark"></span>';
    b.addEventListener('pointerenter', () => { if (!touch) hovered = s; });
    b.addEventListener('pointerleave', () => { if (!touch && hovered === s) hovered = null; });
    b.addEventListener('focus', () => { hovered = s; });
    b.addEventListener('blur', () => { if (hovered === s) hovered = null; });
    b.addEventListener('click', () => {
      // Wer quer gezogen hat, wollte den Blick verschieben, nicht untersuchen.
      if (wasDrag()) return;
      if (touch) {
        // Auf Beruehrgeraeten gibt es kein Ueberfahren: der Lichtsaum geht
        // beim Antippen auf und bleibt, solange die Tafel offen ist.
        for (const n of nodes) n.el.classList.remove('active');
        b.classList.add('active');
        hovered = s;
      }
      say(s);
    });
    layer.appendChild(b);
    return { spot: s, el: b };
  });

  let hovered = null;
  let hoverAmt = 0;

  /* --- Seitliches Schieben ---------------------------------------------- */
  // Im Hochformat zeigt der Schirm nur einen Ausschnitt der Gasse. Ziehen
  // verschiebt den Blick; das Bild folgt dem Finger 1:1.
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
  /** true, wenn der letzte Zeigerkontakt ein Ziehen war und kein Tippen. */
  const wasDrag = () => moved > 9;

  addEventListener('keydown', (e) => {
    if (e.key === 'Tab') { e.preventDefault(); layer.classList.add('reveal'); }
    if (e.key === 'Escape') { close(); akte.classList.remove('on'); }
  });
  addEventListener('keyup', (e) => {
    if (e.key === 'Tab') layer.classList.remove('reveal');
  });

  return {
    /** Jeden Frame: Punkte an ihre Stelle im Bild setzen. */
    update(dt) {
      const h = renderer.cssHeight || 1;
      for (const { spot, el } of nodes) {
        const [x, y] = renderer.plateUvToScreen(spot.u, spot.v);
        // Radius in Bildkoordinaten → Pixel. Maßstab ist die Höhe der PLATTE
        // auf dem Schirm, nicht die Fensterhöhe — sonst werden die Flächen im
        // Hochformat riesig, weil das Bild dort nur ein Band einnimmt.
        const px = Math.max(30, Math.min(spot.r * renderer.plateScreenHeight() * 1.35, h * 0.5));
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        el.style.width = `${px}px`;
        el.style.height = `${px}px`;
      }

      // Saum weich ein- und ausblenden, nie schalten.
      const target = hovered ? 1 : 0;
      hoverAmt += (target - hoverAmt) * (1 - Math.pow(0.0015, dt));

      if (hoverAmt > 0.002 && hovered) {
        const [x, y] = renderer.plateUvToScreen(hovered.u, hovered.v);
        renderer.hover[0] = x / (renderer.cssWidth || 1);
        renderer.hover[1] = 1 - y / h;
        renderer.hover[2] = hovered.r * 1.15;
        renderer.hover[3] = hoverAmt;
        label.style.left = `${x}px`;
        label.style.top = `${y + Math.max(30, hovered.r * renderer.plateScreenHeight() * 1.35) * 0.5 + 12}px`;
        label.textContent = hovered.label;
        label.classList.add('on');
      } else {
        renderer.hover[3] = hoverAmt;
        label.classList.remove('on');
      }
    },
  };
}
