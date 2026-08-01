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
import { createTalk } from './talk.js';
import { createSpinner } from './spinner.js';

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
#hs-layer .hs.exit.left .mark {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23dcecff' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 12H5M11 6l-6 6 6 6'/%3E%3C/svg%3E");
  animation-name: nudgeLeft;
}
#hs-layer .hs.exit.right .mark {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23dcecff' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 12h15M13 6l6 6-6 6'/%3E%3C/svg%3E");
  animation-name: nudgeRight;
}
/* Hinein und hinaus: eine Tuer, kein Pfeil. Eine Richtung waere hier gelogen —
   die Tuer liegt in der Bildtiefe, nicht links oder rechts. */
#hs-layer .hs.exit.in .mark {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23dcecff' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M14 3H5v18h9M10 12h10M16 8l4 4-4 4'/%3E%3C/svg%3E");
}
#hs-layer .hs.exit.out .mark {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23dcecff' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M10 3h9v18h-9M14 12H4M8 8l-4 4 4 4'/%3E%3C/svg%3E");
  animation-name: nudgeDown;
}
/* Verschlossen: sichtbar, aber matt und ohne Zappeln. Man soll sehen, dass es
   dort weitergeht, und dass es jetzt noch nicht geht. */
#hs-layer .hs.exit.locked .mark {
  opacity: .26; animation: none; filter: grayscale(1) drop-shadow(0 2px 6px rgba(0,0,0,.9));
}
#hs-layer .hs.exit.locked:hover .mark { opacity: .5; }
#hs-layer .hs.exit:hover .mark { opacity: 1; }
@keyframes nudge      { 0%,100% { transform: translateY(3px);  } 50% { transform: translateY(-3px); } }
@keyframes nudgeDown  { 0%,100% { transform: translateY(-3px); } 50% { transform: translateY(3px);  } }
@keyframes nudgeLeft  { 0%,100% { transform: translateX(3px);  } 50% { transform: translateX(-3px); } }
@keyframes nudgeRight { 0%,100% { transform: translateX(-3px); } 50% { transform: translateX(3px);  } }

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
#panel .act { margin-top: 17px; display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
#panel .act .wartet {
  font-size: 11px; letter-spacing: .14em; text-transform: uppercase;
  color: rgba(255,190,116,.75); padding: 4px 0;
}

/* Kurzmeldung, wenn etwas passiert, das die Tafel nicht zeigt. */
#toast {
  position: fixed; z-index: 30; left: 50%; transform: translate(-50%, 14px);
  bottom: calc(24px + env(safe-area-inset-bottom));
  padding: 11px 18px; max-width: min(92vw, 60ch);
  background: rgba(8,12,18,.94); border: 1px solid rgba(255,190,116,.34);
  color: #ffd9a8; font-size: 12.5px; letter-spacing: .04em; text-align: center;
  opacity: 0; pointer-events: none; transition: opacity .22s, transform .22s;
}
#toast.on { opacity: 1; transform: translate(-50%, 0); }
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
  /* Der Ortsname links und die Bedienung rechts haben sich um denselben Platz
     gestritten: Auf schmalen Geraeten stiess "Unterstadt" an den Wagen, und
     das UI sah kaputt aus. Fester Abstand dazwischen, links darf gekuerzt
     werden, rechts nie. */
  gap: clamp(14px, 4vw, 34px);
  padding: calc(16px + env(safe-area-inset-top)) clamp(16px, 4vw, 40px) 16px;
  font: 10px/1.5 ui-monospace, Menlo, monospace; letter-spacing: .26em;
  color: rgba(190,214,235,.62); text-transform: uppercase;
  background: linear-gradient(to bottom, rgba(4,6,10,.66), rgba(4,6,10,0));
  pointer-events: none;
}
#topbar .where { min-width: 0; }
#topbar .where > div { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
/* Auf schmalen Geraeten darf der Ortsname umbrechen. „Kanalgasse · Hint…"
   sagt weniger als zwei volle Zeilen, und der Kopf ist ohnehin nur ein
   Verlauf ueber dem Bild. */
@media (max-width: 560px) {
  #topbar .where .place {
    white-space: normal; letter-spacing: .12em; line-height: 1.35;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
  }
  #topbar .where .sector { letter-spacing: .16em; }
}
#topbar .actions { display: flex; align-items: center; gap: 16px; flex-shrink: 0; }
#topbar .right { pointer-events: auto; cursor: pointer; color: rgba(190,214,235,.62); }
#topbar .right:hover { color: #e8f2ff; }

/* Der Wagen ist der einzige Knopf ohne Wort. Er braucht keins — ein Auto in
   der Ecke eines Detektivspiels heisst „woanders hin". Dafuer bekommt er eine
   Flaeche, damit er sich am Finger nicht wie ein Symbol im Nichts anfuehlt. */
#topbar .karte {
  display: inline-flex; align-items: center; justify-content: center;
  /* Rahmenlos wie „Akte" und „?" daneben — ein Kasten waere das dritte
     Aussehen in einer Zeile mit drei Knoepfen. Die Flaeche fuer den Finger
     macht der Innenabstand, nicht ein Rahmen. */
  padding: 3px 2px; margin: -3px 0; color: rgba(150,205,232,.78);
  transition: color .15s, transform .15s;
}
#topbar .karte svg { width: 25px; display: block; filter: drop-shadow(0 1px 4px rgba(0,0,0,.6)); }
#topbar .karte:hover { color: #bfeaff; transform: translateX(1px); }
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
#akte h3 {
  font-size: 10px; letter-spacing: .3em; color: #7fb4d8; font-weight: 400;
  text-transform: uppercase; margin: 8px 0 18px;
  padding-top: 20px; border-top: 1px solid rgba(126,190,230,.16);
}
/* Was noch laeuft, ist blasser; was fertig ist, leuchtet. Der Unterschied muss
   im Vorbeischauen lesbar sein, ohne den Text zu lesen. */
#akte .item.wartet { border-left-color: rgba(159,180,204,.32); opacity: .6; }
#akte .item.bereit { border-left-color: rgba(120,240,180,.75); }
#akte .item.bereit .h { color: #9df3c8; }
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
  #topbar .actions { gap: 15px; }
  #topbar .karte svg { width: 23px; }
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
  where.className = 'where';
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
  const spinnerBtn = document.createElement('div');
  spinnerBtn.className = 'right karte';
  spinnerBtn.setAttribute('role', 'button');
  spinnerBtn.setAttribute('aria-label', 'Karte öffnen');
  actions.append(spinnerBtn, akteBtn, helpBtn);
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
  let currentScene = null;
  const world = host.world;

  /** Kurze Rueckmeldung, wenn etwas passiert, das die Tafel nicht zeigt. */
  let toastTimer = null;
  const toastEl = document.createElement('div');
  toastEl.id = 'toast';
  document.body.appendChild(toastEl);
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('on'), 3400);
  }

  /** Eine Spur in die Akte legen. Doppelte werden verworfen. */
  function addNote(label, text) {
    if (notes.some((n) => n.label === label)) return;
    notes.push({ label, text });
    updateAkteBtn();
  }

  // Das Verhoer traegt seine eigenen Spuren ein und liest die Akte, um
  // Vorhalten anbieten zu koennen.
  const talk = createTalk({
    // Auch die getragenen Gegenstaende: Jemandem das blutige Tuch hinzuhalten
    // ist der staerkste Vorhalt, den das Spiel hat — er gehoert in dieselbe
    // Liste wie eine Notiz.
    getNotes: () => [
      ...notes,
      ...world.items().map((i) => ({ label: i.name, text: i.text })),
    ],
    addNote,
    getPlace: () => currentScene?.name || 'Kanalgasse',
  });

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
    // Asservate und laufende Untersuchungen stehen in derselben Akte. Ein
    // zweiter Beutel-Knopf waere eine zweite Stelle zum Nachsehen.
    const getragen = world.items();
    const laufend = world.pending();
    const fertig = world.ready();
    if (getragen.length || laufend.length || fertig.length) {
      const h = document.createElement('h3');
      h.textContent = 'Asservate';
      akte.appendChild(h);
      for (const it of getragen) {
        const d = document.createElement('div');
        d.className = 'item';
        d.innerHTML = '<div class="h"></div><div class="t"></div>';
        d.querySelector('.h').textContent = it.name;
        d.querySelector('.t').textContent = it.text;
        akte.appendChild(d);
      }
      for (const a of laufend) {
        const d = document.createElement('div');
        d.className = 'item wartet';
        d.innerHTML = '<div class="h"></div><div class="t"></div>';
        d.querySelector('.h').textContent = `${a.item.name} — im Labor`;
        d.querySelector('.t').textContent =
          `Der Befund ist nicht fertig. Noch ${a.restBewegungen} `
          + `${a.restBewegungen === 1 ? 'Ortswechsel' : 'Ortswechsel'}, dann liegt er am Schalter bereit.`;
        akte.appendChild(d);
      }
      for (const a of fertig) {
        const d = document.createElement('div');
        d.className = 'item bereit';
        d.innerHTML = '<div class="h"></div><div class="t"></div>';
        d.querySelector('.h').textContent = `${a.item.name} — Befund liegt bereit`;
        d.querySelector('.t').textContent = 'Abzuholen am Laborschalter im Präsidium.';
        akte.appendChild(d);
      }
    }

    const b = document.createElement('button');
    b.textContent = 'Schließen';
    b.onclick = () => akte.classList.remove('on');
    akte.appendChild(b);
  }
  const updateAkteBtn = () => {
    const n = notes.length + world.items().length;
    akteBtn.textContent = `Akte · ${n}`;
  };
  updateAkteBtn();
  akteBtn.onclick = () => { renderAkte(); akte.classList.add('on'); };

  // Aendert sich der Weltzustand, muessen die Punkte neu gebaut werden: Wer
  // die Schluesselkarte aufhebt, soll die Stahltuer SOFORT offen sehen und
  // nicht erst, wenn er den Ort einmal verlassen hat.
  world.onChange(() => {
    updateAkteBtn();
    if (currentScene) buildSpots(currentScene.spots);
  });

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

  // Reisen zwischen den Sektoren. Siehe spinner.js — gelaufen wird
  // innerhalb eines Sektors, geflogen zwischen ihnen.
  const spinner = createSpinner({
    world,
    goTo: (id) => host.goTo(id),
    getScene: () => currentScene,
    notify: toast,
  });
  spinnerBtn.innerHTML = spinner.icon;
  spinnerBtn.onclick = () => { close(); spinner.open(); };

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

    // Verschlossen: Der Grund gehoert in denselben Text. Ein Ausgang, der
    // stumm bleibt, liest sich als Fehler im Spiel.
    const gesperrt = spot.goto && !world.meets(spot.requires);
    const full = (spot.text || '') + (gesperrt && spot.lockText ? `\n\n${spot.lockText}` : '');
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

    if (talk.has(spot.id)) {
      const t = document.createElement('button');
      t.className = 'go';
      t.textContent = 'Ansprechen';
      t.onclick = () => { close(); talk.open(spot.id); };
      pAct.appendChild(t);
    }

    /**
     * Der Laborschalter.
     *
     * Abgeben kostet keine Zeit, aber das Ergebnis braucht Wege: Die Wartezeit
     * laeuft in ORTSWECHSELN (world.step), nicht in Sekunden. Wer vor dem
     * Schalter stehen bleibt, wartet ewig; wer weiterermittelt, bekommt den
     * Befund. Genau so soll sich das anfuehlen.
     */
    function labButtons() {
      for (const a of world.ready()) {
        const b = document.createElement('button');
        b.className = 'mark-clue';
        b.textContent = `Befund abholen: ${a.item.name}`;
        b.onclick = () => {
          const got = world.collect(a.id);
          if (!got) return;
          addNote(got.ergebnis.label, got.ergebnis.text);
          close();
          toast('Befund in der Akte.');
        };
        pAct.appendChild(b);
      }

      for (const item of world.items()) {
        if (!item.analysis) continue;
        const b = document.createElement('button');
        b.textContent = `Abgeben: ${item.name}`;
        b.onclick = () => {
          world.submit(item);
          close();
          toast('Abgegeben. Der Befund braucht seine Zeit — geh weiter.');
        };
        pAct.appendChild(b);
      }

      const offen = world.pending();
      if (offen.length) {
        const w = document.createElement('div');
        w.className = 'wartet';
        w.textContent = offen
          .map((a) => `${a.item.name}: noch ${a.restBewegungen} ${a.restBewegungen === 1 ? 'Weg' : 'Wege'}`)
          .join(' · ');
        pAct.appendChild(w);
      }
    }

    // Gegenstand mitnehmen. Erst dadurch wird aus dem Untersuchen eine
    // Ermittlung: Was man in der Hand hat, oeffnet anderswo eine Tuer.
    if (spot.item && !world.wasTaken(spot.item.id)) {
      const m = document.createElement('button');
      m.className = 'mark-clue';
      m.textContent = `Mitnehmen: ${spot.item.name}`;
      m.onclick = () => {
        // Kein addNote: Der Gegenstand steht schon unter „Asservate" in der
        // Akte. Zweimal dieselbe Zeile liest sich wie ein Fehler.
        world.take(spot.item);
        m.remove();
        toast(`${spot.item.name} — in die Asservate.`);
      };
      pAct.appendChild(m);
    }

    if (spot.kind === 'lab') labButtons();

    if (spot.goto) {
      const frei = world.meets(spot.requires);
      const g = document.createElement('button');
      g.className = 'go';
      g.textContent = frei
        ? ({ back: 'Zurückgehen', in: 'Hineingehen', out: 'Hinausgehen' }[spot.dir] || 'Hingehen')
        : 'Verschlossen';
      g.disabled = !frei;
      if (frei) g.onclick = () => { close(); host.goTo(spot.goto); };
      pAct.appendChild(g);
    }

    if (full && !seen.has(spot.id)) {
      const b = document.createElement('button');
      b.className = 'mark-clue';
      b.textContent = 'In die Akte';
      b.onclick = () => {
        seen.add(spot.id);
        addNote(spot.label, full);
        // Manche Funde oeffnen einen Sektor auf der Spinner-Karte.
        if (spot.clue) world.addClue(spot.clue);
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
      b.className = 'hs' + (s.kind ? ' ' + s.kind : '') + (s.dir ? ' ' + s.dir : '')
                  + (s.goto && !world.meets(s.requires) ? ' locked' : '');
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
        // Es sei denn, er ist verschlossen: dann muss die Tafel den Grund
        // nennen, statt dass der Klick ins Leere geht.
        if (s.goto && !s.text && world.meets(s.requires)) { close(); host.goTo(s.goto); return; }
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

  // Am FENSTER lauschen, nicht an der Bildfläche.
  //
  // Die Untersuchungspunkte liegen in einer eigenen Ebene über der Bildfläche.
  // Ein Druck darauf erreicht `#stage` nie — und wenn `moved` nur dort
  // zurückgesetzt wird, bleibt es nach dem ersten Ziehen für immer stehen.
  // Dann hält `wasDrag()` jeden weiteren Klick für einen Ziehvorgang und
  // schluckt ihn. Genau dieser Fehler war es: einmal ziehen, und nichts
  // reagiert mehr.
  addEventListener('pointerdown', (e) => {
    moved = 0;
    lastX = e.clientX;
    // Gezogen wird nur, wenn der Druck im Bild beginnt — nicht auf der Tafel
    // oder der Kopfzeile.
    dragging = stageEl.contains(e.target) || layer.contains(e.target);
  }, true);
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
    if (e.key === 'Escape') {
      if (talk.isOpen() || spinner.isOpen()) return;   // die schliessen sich selbst
      close();
      akte.classList.remove('on');
    }
  });
  addEventListener('keyup', (e) => {
    if (e.key === 'Tab') layer.classList.remove('reveal');
  });

  return {
    /** Kurzmeldung einblenden — etwa, wenn ein Laborbefund fertig wird. */
    notify: toast,

    /** Ort wechseln: Punkte neu setzen, Kopfzeile beschriften. */
    setScene(scene) {
      currentScene = scene;
      talk.close();
      spinner.close();
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
