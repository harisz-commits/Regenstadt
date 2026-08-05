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
import { createAnklage } from './anklage.js';
import * as speicher from './speichern.js';
import { createMeldung } from './meldung.js';
import { fall } from './fall.js';

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
  opacity: 0;
  /* Kein Uebergang auf der Deckkraft.
     Die Schaltflaeche bekommt jeden Frame neue Inline-Masse; dabei startete
     der Opacity-Uebergang staendig neu und blieb bei currentTime 0 haengen —
     die Marke wurde nie sichtbar. Ein frisch eingefuegtes Element mit
     derselben Klasse rechnete korrekt 0.8, das bestehende blieb auf 0.
     Ohne Uebergang schaltet sie sofort, und das genuegt hier voellig. */
}

/* --- Der Punkt ----------------------------------------------------------
   Frueher war jeder Untersuchungspunkt ein duenner Ring, so gross wie seine
   Klickflaeche, und normalerweise unsichtbar — man musste die Punkte suchen.
   Das hat zwei Probleme gemacht: Man wusste nie, ob man alles gefunden hat,
   und man hat abgesuchte Stellen wieder und wieder angeklickt.

   Jetzt ist es ein kleiner leuchtender Punkt, dauerhaft sichtbar und immer
   gleich gross — die Klickflaeche bleibt so gross wie vorher, nur die Anzeige
   haengt nicht mehr an ihr. Und wenn an einer Stelle nichts mehr ist, ist der
   Punkt weg (siehe erledigt() weiter unten). Das ist die eigentliche Auskunft:
   Wo kein Punkt leuchtet, gibt es nichts mehr zu holen. */
#hs-layer .hs:not(.exit) .mark {
  inset: auto; left: 50%; top: 50%;
  width: 9px; height: 9px; margin: 0;
  transform: translate(-50%, -50%);
  border: 0; border-radius: 50%;
  background: #cfe9ff;
  /* Dunkler Ring, dann Leuchten. Ohne den Ring verschwindet der Punkt in der
     Kanalgasse zwischen den Neonschildern — gemessen an einem Bildschirmfoto:
     ein reines Leuchten war auf hellem Grund praktisch unsichtbar. */
  box-shadow:
    0 0 0 1.5px rgba(2,6,12,.62),
    0 0 7px 2px rgba(120,195,255,.9),
    0 0 18px 5px rgba(60,150,235,.5);
  opacity: .92;
  animation: punktAtmet 3.2s ease-in-out infinite;
}
#hs-layer .hs:not(.exit):hover .mark,
#hs-layer .hs:not(.exit):focus-visible .mark { opacity: 1; }
@keyframes punktAtmet {
  0%, 100% { transform: translate(-50%, -50%) scale(.86); opacity: .82; }
  50%      { transform: translate(-50%, -50%) scale(1.14); opacity: 1; }
}
/* Personen leuchten warm — ein Mensch ist kein Gegenstand. */
#hs-layer .hs.person .mark {
  width: 11px; height: 11px; background: #ffe2bd;
  box-shadow:
    0 0 0 1.5px rgba(12,4,0,.62),
    0 0 8px 2px rgba(255,186,120,.95),
    0 0 20px 6px rgba(255,150,70,.5);
}
/* Die Pinnwand ist der einzige Punkt, an dem das Spiel endet. */
#hs-layer .hs.anklage .mark {
  width: 12px; height: 12px; background: #d8fff0;
  box-shadow:
    0 0 0 1.5px rgba(0,10,6,.62),
    0 0 9px 3px rgba(130,245,190,.95),
    0 0 22px 7px rgba(90,220,160,.5);
}

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
/* Aufwaerts und abwaerts: fuer Aufzuege und Treppen. Ein Pfeil nach oben waere
   mit „vorwaerts" verwechselbar — deshalb bekommt er einen Balken darueber,
   wie in einem Aufzug. */
#hs-layer .hs.exit.up .mark {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23dcecff' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 3h14M12 21V8M6 14l6-6 6 6'/%3E%3C/svg%3E");
}
#hs-layer .hs.exit.down .mark {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23dcecff' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 21h14M12 3v13M6 10l6 6 6-6'/%3E%3C/svg%3E");
  animation-name: nudgeDown;
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

#hs-layer.reveal .hs .mark { opacity: .95; }
#hs-layer.touch .hs.active .mark { opacity: 1; }

/* --- Was neben dem Schirm liegt -----------------------------------------
   Im Hochformat zeigt die Platte ein knappes Viertel des Ortes. Diese Marke
   sagt, dass dort draussen noch etwas ist, und wie viel. */
#hs-layer .rand {
  /* Ueber den Punkten, nicht darunter: Die Punkte werden bei jedem Ortswechsel
     neu angehaengt und liegen dadurch spaeter im Baum. Ohne z-index fing ein
     Punkt, der zufaellig am Rand steht, den Druck auf die Randmarke ab — und
     die Marke reagierte scheinbar grundlos nicht mehr. */
  position: absolute; z-index: 3; top: 50%; transform: translateY(-50%);
  display: none; align-items: center; gap: 7px;
  padding: 15px 11px; cursor: pointer; pointer-events: auto;
  background: rgba(4,6,10,.62); border: 1px solid rgba(126,190,230,.30);
  color: #cfe6ff;
  font: 11px/1 ui-monospace, "SFMono-Regular", Menlo, monospace; letter-spacing: .1em;
  animation: randpuls 2.6s ease-in-out infinite;
}
#hs-layer .rand.on { display: flex; }
#hs-layer .rand.links { left: 8px; }
#hs-layer .rand.rechts { right: 8px; }
#hs-layer .rand .pf { font-size: 20px; line-height: 1; opacity: .9; }
#hs-layer .rand .n { opacity: .6; }
#hs-layer .rand:hover { background: rgba(126,190,230,.16); }
@keyframes randpuls {
  0%, 100% { border-color: rgba(126,190,230,.28); }
  50%      { border-color: rgba(126,190,230,.66); }
}

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
/* Die geschlossene Tafel schluckt Klicks, obwohl sie nicht zu sehen ist.
   Gemessen, nachdem sie einmal offen war: Auf dem Bild ist sie weg, aber
   getBoundingClientRect meldet sie weiter an ihrer alten Stelle (595 bis 900
   von 900), und elementFromPoint trifft dort sie statt des Punktes. Der
   Compositor hat sie verschoben, die Trefferpruefung im Haupt-Thread nicht.
   Folge im Spiel: Der erste Klick auf einen Untersuchungspunkt ging durch,
   danach war das untere Bilddrittel tot.
   Deckkraft oder Position anzufassen wuerde wieder an Geometrie haengen —
   pointer-events tut das nicht.
   (ACHTUNG: keine Backticks in diesem Kommentar, er steht in einem
   Template-Literal. Genau daran ist der Build hier schon einmal gescheitert.) */
#panel:not(.on) { pointer-events: none; }
#panel .shot-frame {
  grid-row: 1 / span 3; width: min(38vw, 340px); aspect-ratio: 4 / 3;
  position: relative; overflow: hidden; display: none;
  border: 1px solid rgba(126,190,230,.22);
  box-shadow: 0 10px 40px rgba(0,0,0,.75);
  opacity: 0; transition: opacity .4s ease;
}
#panel .shot, #panel .scene-detail {
  position: absolute; inset: 0; width: 100%; height: 100%;
}
#panel .shot { object-fit: cover; }
#panel .scene-detail {
  display: none; background-repeat: no-repeat; background-color: #070a0e;
}
#panel.has-shot .shot-frame { display: block; }
#panel.has-shot .shot-frame.ready { opacity: 1; }
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
#akte .akte-fuss { margin-top: 26px; display: flex; gap: 11px; flex-wrap: wrap; align-items: center; }
#akte .akte-fuss button { margin-top: 0; }
#akte button.gefahr { color: rgba(255,150,150,.8); border-color: rgba(255,120,120,.3); }
#akte button.gefahr:hover { background: rgba(255,120,120,.14); border-color: rgba(255,120,120,.6); }
#akte .akte-hinweis { flex-basis: 100%; font-size: 11px; opacity: .42; max-width: 66ch; line-height: 1.7; }
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
#hint-bar .fassung { display: block; margin-top: 6px; opacity: .45; letter-spacing: .1em; }

/* Schwarzblende beim Ortswechsel */
#fade {
  position: fixed; inset: 0; z-index: 24; background: #04060a;
  opacity: 0; pointer-events: none; transition: opacity .3s ease;
}
#fade.on { opacity: 1; }

@media (max-width: 820px) {
  #panel { font-size: 15px; line-height: 1.7; padding-left: 18px; padding-right: 18px;
           grid-template-columns: 1fr; gap: 0; }
  #panel .shot-frame { grid-row: auto; width: 100%; max-width: 420px; margin-bottom: 16px; }
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
  #panel, #fade, #panel .shot-frame { transition: none; }
  #hs-layer .hs.exit .mark { animation: none; }
  #hs-layer .hs:not(.exit) .mark { animation: none; transform: translate(-50%, -50%); }
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
    '<div class="shot-frame"><img class="shot" alt="" /><div class="scene-detail"></div></div>'
    + '<div class="ttl"></div><p class="body"></p><div class="act"></div>';
  document.body.appendChild(panel);
  const pShotFrame = panel.querySelector('.shot-frame');
  const pShot = panel.querySelector('.shot');
  const pSceneDetail = panel.querySelector('.scene-detail');
  const pTtl = panel.querySelector('.ttl');
  const pBody = panel.querySelector('.body');
  const pAct = panel.querySelector('.act');
  pShot.addEventListener('load', () => pShotFrame.classList.add('ready'));

  const akte = document.createElement('div');
  akte.id = 'akte';
  document.body.appendChild(akte);

  const hintBar = document.createElement('div');
  hintBar.id = 'hint-bar';
  // Kurz halten: auf einem Handy lief der lange Satz ueber vier Zeilen und
  // verdeckte mehr Bild, als er erklaerte.
  // Seit die Punkte leuchten, muss der Balken sie nicht mehr erklaeren — er
  // sagt jetzt, was sie BEDEUTEN.
  hintBar.textContent = touch
    ? 'Leuchtpunkte zeigen, wo es etwas gibt · Pfeile führen weiter · ziehen zum Umsehen'
    : 'Leuchtpunkte zeigen, wo es etwas gibt · erlischt einer, ist dort nichts mehr';
  /* Die Kennung des laufenden Standes — siehe vite.config.js.
     Ein gemeldeter Fehler war zum Zeitpunkt der Meldung laengst behoben und
     veroeffentlicht; im Browser lief nur noch die alte Seite. Von aussen war
     das nicht zu unterscheiden. Jetzt beantwortet ein Bildschirmfoto die
     Frage von selbst. */
  const stempel = document.createElement('span');
  stempel.className = 'fassung';
  stempel.textContent = `Fassung ${__FASSUNG__} · ${__GEBAUT__}`;
  hintBar.appendChild(stempel);
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
    sichern();
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
    // Drinnen regnet es nicht. Ohne diese Auskunft erzaehlte jede Figur vom
    // Regen auf ihrem Mantel — auch im Kuehlhaus und im obersten Stock.
    getInnen: () => currentScene?.kind === 'interior',
    // Damit ein Gestaendnis dasselbe bewirken kann wie ein Fundstueck: eine
    // Tuer oeffnen, einen Sektor freischalten, die Anklage tragen.
    meets: (req) => world.meets(req),
    addClue: (id) => world.addClue(id),
  });

  // Der Abschluss. Liest dieselbe Akte wie das Verhoer, damit der Nachspann
  // von dem erzaehlt, was der Spieler wirklich gefunden hat.
  const anklage = createAnklage({
    world,
    getNotes: () => [
      ...notes,
      ...world.items().map((i) => ({ label: i.name, text: i.text })),
    ],
    // Dass ein Fall durch ist, muss den weggeworfenen Spielstand ueberleben —
    // daran haengt die Fallwahl beim naechsten Neustart.
    onEnde: () => { speicher.merkeAbgeschlossen(fall().id); sichern(); },
    neuAnfangen: () => { speicher.loeschen(); speicher.merkeDirekt(); location.reload(); },
    // Den naechsten Fall anfangen: Der Stand des alten wird verworfen, der
    // gewuenschte Fall vorgemerkt, dann neu geladen. Ueber den Speicher und
    // nicht ueber setzeFall im laufenden Bild, weil sonst mitten im Spiel
    // Platten, Punkte, Figuren und Karte gleichzeitig wechseln muessten —
    // ein Neustart ist hier ehrlicher als ein Umbau bei laufendem Betrieb.
    naechsterFall: (id) => {
      speicher.loeschen(); speicher.merkeFall(id); speicher.merkeDirekt();
      location.reload();
    },
  });

  // Meldungen: was sich woanders geaendert hat. Bleiben stehen, bis sie
  // weggeklickt sind — siehe meldung.js.
  const meldung = createMeldung({ world, onGesehen: () => sichern() });

  /* --- Sichern ------------------------------------------------------------
     Nach jeder Aenderung, aber gebuendelt: Ein Klick auf „In die Akte" loest
     mehrere Aenderungen auf einmal aus (Notiz, Spur, Punkte neu gebaut), und
     dreimal hintereinander in den Speicher zu schreiben ist unnoetig. */
  let sicherTimer = null;
  function sichern() {
    // Solange kein Ort steht, gibt es nichts zu sichern — und ein Stand ohne
    // Ort wird beim naechsten Start verworfen. Das passiert genau einmal:
    // `ladeStand` setzt die Welt, bevor der erste Ort geladen ist.
    if (!currentScene) return;
    clearTimeout(sicherTimer);
    sicherTimer = setTimeout(() => {
      speicher.schreiben({
        ort: currentScene?.id || null,
        welt: world.snapshot(),
        notizen: notes,
        gesehen: [...seen],
        gespraeche: talk.stand(),
        meldungen: meldung.stand(),
        ende: anklage.ausgang(),
      });
    }, 400);
  }

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

    const reihe = document.createElement('div');
    reihe.className = 'akte-fuss';
    const b = document.createElement('button');
    b.textContent = 'Schließen';
    b.onclick = () => akte.classList.remove('on');
    reihe.appendChild(b);

    /* Neu anfangen.
       Zwei Klicks, weil es nicht rueckgaengig zu machen ist — und ein Knopf
       neben „Schliessen", der eine halbe Ermittlung wegwirft, wird sonst
       genau einmal versehentlich getroffen. */
    const weg = document.createElement('button');
    weg.className = 'gefahr';
    weg.textContent = 'Neue Ermittlung';
    let sicher = false;
    weg.onclick = () => {
      if (!sicher) {
        sicher = true;
        weg.textContent = 'Alles verwerfen?';
        setTimeout(() => { if (sicher) { sicher = false; weg.textContent = 'Neue Ermittlung'; } }, 4000);
        return;
      }
      speicher.loeschen();
      location.reload();
    };
    reihe.appendChild(weg);

    const hinweis = document.createElement('div');
    hinweis.className = 'akte-hinweis';
    hinweis.textContent = speicher.moeglich()
      ? 'Der Stand wird auf diesem Gerät gesichert, in diesem Browser. Kein Konto, nichts auf einem Server.'
      : 'Dieser Browser lässt kein Sichern zu — im privaten Fenster ist der Stand nach dem Schließen weg.';
    reihe.appendChild(hinweis);

    akte.appendChild(reihe);
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
    // Erst die Punkte, dann die Meldung: Wer sie wegklickt und sofort
    // hinfliegt, soll den neuen Punkt schon vorfinden.
    meldung.pruefe();
    sichern();
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
  /** Zeichen je Sekunde im Schreibmaschineneffekt. */
  const TYPE_CPS = 140;
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
    pShotFrame.classList.remove('ready');
    if (spot.detail) {
      panel.classList.add('has-shot');
      pSceneDetail.style.display = 'none';
      pShot.style.display = 'block';
      pShot.src = base + spot.detail;
      pShot.alt = spot.label;
    } else if (spot.detailFocus && currentScene?.backdrop) {
      /* Fall 3 nutzt fuer jede Untersuchung einen fokussierten Ausschnitt der
         verlustfreien Ortsplatte. Das ist kein blosses Textfenster mehr: Der
         Klick schneidet sichtbar an den Gegenstand heran, wie die handgemalten
         Nahaufnahmen der ersten beiden Faelle. */
      const { u, v, zoom = 2.5 } = spot.detailFocus;
      panel.classList.add('has-shot');
      pShot.style.display = 'none';
      pShot.removeAttribute('src');
      pSceneDetail.style.display = 'block';
      pSceneDetail.style.backgroundImage = `url("${base}plates/${currentScene.backdrop}.png")`;
      pSceneDetail.style.backgroundSize = `${zoom * 100}% auto`;
      pSceneDetail.style.backgroundPosition = `${u * 100}% ${v * 100}%`;
      requestAnimationFrame(() => pShotFrame.classList.add('ready'));
    } else {
      panel.classList.remove('has-shot');
      pShot.style.display = 'none';
      pSceneDetail.style.display = 'none';
      pSceneDetail.style.backgroundImage = '';
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
      // Aus der WANDUHR rechnen, nicht Ticks zaehlen.
      //
      // Die erste Fassung addierte je Intervall zwei Zeichen. Das setzt
      // voraus, dass setInterval(14) auch wirklich 71-mal je Sekunde feuert —
      // und genau das tut es nicht, wenn der Renderer den Hauptthread
      // auslastet. Gemessen: rund ZWEI Zeichen je Sekunde statt 140, der Text
      // stand nach zehn Sekunden immer noch bei "Schmaler, niedriger,".
      //
      // Derselbe Fehler wie seinerzeit beim Regen, der aus demselben Grund in
      // Zeitlupe lief. Zeitbasiert bleibt die Dauer gleich; auf einem langsamen
      // Geraet kommen die Zeichen nur in groesseren Schueben.
      const start = performance.now();
      typer = setInterval(() => {
        const n = Math.floor(((performance.now() - start) / 1000) * TYPE_CPS);
        pBody.textContent = full.slice(0, n);
        if (n >= full.length) { clearInterval(typer); typer = null; }
      }, 16);
    }

    if (talk.has(spot.id)) {
      // Die Fragen fuer diese Person schon holen, waehrend der Spieler die
      // Beschreibung liest. Das Verhoer oeffnete sonst in zehn Sekunden
      // Leerlauf.
      talk.warmUp(spot.id);
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

    // Die Pinnwand: der einzige Punkt im Spiel, an dem der Fall geschlossen
    // wird. Siehe anklage.js.
    if (spot.kind === 'anklage') {
      const b = document.createElement('button');
      b.className = 'mark-clue';
      b.textContent = anklage.istVorbei() ? 'Bericht ansehen' : 'Den Fall abschließen';
      b.onclick = () => { close(); anklage.open(); };
      pAct.appendChild(b);
    }

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
        // Auch dann sichern, wenn die Notiz schon dastand: `seen` hat sich
        // geaendert, und ohne das taucht „In die Akte" nach dem Neuladen
        // wieder auf.
        sichern();
        // Und die Punkte neu setzen: Diese Stelle ist jetzt erledigt, ihr
        // Punkt gehoert weg. `seen` liegt ausserhalb der Welt, also loest es
        // von selbst kein onChange aus.
        if (currentScene) buildSpots(currentScene.spots);
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

  /**
   * Ist an diesem Punkt noch etwas zu holen?
   *
   * Wo kein Punkt leuchtet, gibt es nichts mehr — das ist die eigentliche
   * Auskunft der neuen Darstellung. Erledigt ist ein Punkt, wenn er in der
   * Akte steht UND nichts mehr hergibt.
   *
   * Ausgaenge, Personen, der Laborschalter und die Pinnwand sind NIE erledigt:
   * Ein Weg bleibt ein Weg, ein Mensch hat spaeter vielleicht mehr zu sagen,
   * der Schalter nimmt den naechsten Gegenstand an, und der Fall wird an der
   * Pinnwand geschlossen.
   */
  function erledigt(s) {
    if (s.kind === 'exit' || s.kind === 'person' || s.kind === 'lab' || s.kind === 'anklage') return false;
    if (!seen.has(s.id)) return false;
    if (s.item && !world.wasTaken(s.item.id)) return false;
    return true;
  }

  /**
   * Welche Punkte gerade dastehen.
   *
   * `erscheint` und `verschwindet` sind dieselbe Bedingungsmechanik wie bei
   * verschlossenen Tueren (siehe world.js) — nur auf Untersuchungspunkte
   * angewandt. Damit bewegt sich die Stadt: An einem Ort, an dem man schon
   * dreimal war, steht auf einmal jemand, der vorher nicht da war, und was
   * dort lag, ist verschwunden.
   */
  function sichtbar(spots) {
    return spots.filter((s) => {
      if (s.erscheint && !world.meets(s.erscheint)) return false;
      if (s.verschwindet && world.meets(s.verschwindet)) return false;
      return !erledigt(s);
    });
  }

  function buildSpots(spots) {
    /* Nur die Punkte wegraeumen, nicht die ganze Ebene: In ihr haengen auch
       die Randmarken, und `innerHTML = ''` hat sie beim ersten Ortswechsel
       mitgenommen — sie waren dann fuer den Rest des Spiels weg. */
    for (const el of layer.querySelectorAll('.hs')) el.remove();
    hovered = null;
    hoverAmt = 0;
    renderer.hover[3] = 0;
    nodes = sichtbar(spots).map((s) => {
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

  /* --- Was neben dem Schirm liegt ------------------------------------------
     Die Platte deckt den Anzeigebereich immer vollstaendig, die schmalere
     Seite wird beschnitten (siehe renderer.uvScale). Auf einem Handy im
     Hochformat bleibt davon ein knappes Viertel uebrig — von acht Punkten in
     der Werkssiedlung stand genau EINER auf dem Schirm. Gemessen:

       quer  1400x800   8 von 8 Punkten sichtbar
       hoch   393x852   1 von 8 Punkten sichtbar

     Schieben konnte man immer, und die Hilfezeile sagt es auch. Aber niemand
     schiebt in eine Richtung, in der er nichts vermutet. Deshalb steht jetzt
     am Rand, DASS dort noch etwas ist — mit der Anzahl. Ein Druck darauf
     schiebt hin. */
  const raender = { links: null, rechts: null };
  for (const seite of ['links', 'rechts']) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = `rand ${seite}`;
    b.innerHTML = '<span class="pf"></span><span class="n"></span>';
    b.querySelector('.pf').textContent = seite === 'links' ? '‹' : '›';
    b.setAttribute('aria-label',
      seite === 'links' ? 'Nach links umsehen' : 'Nach rechts umsehen');
    b.onclick = () => schiebe(seite === 'links' ? -1 : 1);
    layer.appendChild(b);
    raender[seite] = b;
  }

  /** Sanft zur Seite schieben — eine halbe Schirmbreite je Druck. */
  let panZiel = null;
  function schiebe(richtung) {
    const lim = renderer.panLimit();
    if (lim <= 0.0005) return;
    const schritt = renderer.uvScale()[0] * 0.5;
    /* Vom ZIEL aus weiterrechnen, nicht vom aktuellen Bild: Wer zweimal
       hintereinander drueckt, waehrend die Fahrt noch laeuft, kam sonst nur
       eine halbe Strecke weit — der zweite Druck rechnete von einer Stelle,
       die gerade erst durchfahren wurde. */
    const von = panZiel ?? renderer.cam.panX;
    panZiel = Math.max(-lim, Math.min(lim, von + richtung * schritt));
  }

  function zeigeRand(links, rechts) {
    // Nur zeigen, wenn ueberhaupt geschoben werden kann.
    const moeglich = renderer.panLimit() > 0.0005 && !panel.classList.contains('on');
    for (const [seite, n] of [['links', links], ['rechts', rechts]]) {
      const b = raender[seite];
      const an = moeglich && n > 0;
      b.classList.toggle('on', an);
      if (an) b.querySelector('.n').textContent = String(n);
    }
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
    /* Die Randmarken liegen in derselben Ebene wie die Punkte. Ohne diese
       Ausnahme gilt schon ihr Antippen als Ziehbeginn — und die winzige
       Zeigerbewegung beim Klicken bricht die gerade gestartete Fahrt sofort
       wieder ab. */
    const aufRand = e.target?.closest?.('.rand');
    dragging = !aufRand && (stageEl.contains(e.target) || layer.contains(e.target));
  }, true);
  addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    lastX = e.clientX;
    moved += Math.abs(dx);
    const lim = renderer.panLimit();
    if (lim <= 0.0005) return;
    const perPx = renderer.uvScale()[0] / Math.max(1, renderer.cssWidth);
    // Wer selbst schiebt, hat das Kommando — eine laufende Fahrt bricht ab.
    panZiel = null;
    renderer.cam.panX = Math.max(-lim, Math.min(lim, renderer.cam.panX - dx * perPx));
  });
  for (const ev of ['pointerup', 'pointercancel']) {
    addEventListener(ev, () => { dragging = false; });
  }
  const wasDrag = () => moved > 9;

  addEventListener('keydown', (e) => {
    if (e.key === 'Tab') { e.preventDefault(); layer.classList.add('reveal'); }
    if (e.key === 'Escape') {
      // Die schliessen sich selbst.
      if (talk.isOpen() || spinner.isOpen() || anklage.isOpen() || meldung.isOpen()) return;
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
      panZiel = null;
      sichern();
    },

    /**
     * Einen gesicherten Stand zuruecklesen.
     *
     * Wird VOR dem ersten Ortswechsel aufgerufen — sonst wuerde das Sichern im
     * Ortswechsel den Stand ueberschreiben, den es gerade laden will.
     */
    ladeStand(stand) {
      notes.length = 0;
      for (const n of stand.notizen || []) notes.push(n);
      seen.clear();
      for (const id of stand.gesehen || []) seen.add(id);
      talk.setStand(stand.gespraeche);
      // VOR world.restore: Das loest onChange aus, und schon gesehene
      // Meldungen duerfen dabei nicht noch einmal aufpoppen.
      meldung.setStand(stand.meldungen);
      world.restore(speicher.welteinlesen(stand.welt));
      if (stand.ende) anklage.setAusgang(stand.ende);
      updateAkteBtn();
    },
    /** Kurze Schwarzblende, damit ein Ortswechsel nicht springt. */
    async fadeOut() {
      fade.classList.add('on');
      await new Promise((r) => setTimeout(r, reduced ? 0 : 300));
    },
    fadeIn() { fade.classList.remove('on'); },

    update(dt) {
      const h = renderer.cssHeight || 1;
      const w = renderer.cssWidth || 1;
      const plateH = renderer.plateScreenHeight();

      // Ein Druck auf die Randmarke schiebt nicht sprunghaft, sondern faehrt
      // hinueber: Ein Schnitt sieht aus, als waere man woanders.
      if (panZiel !== null) {
        const d = panZiel - renderer.cam.panX;
        if (Math.abs(d) < 0.0004) { renderer.cam.panX = panZiel; panZiel = null; }
        else renderer.cam.panX += d * (1 - Math.pow(0.0002, dt));
      }
      /* Wie viel vom Ort gerade NEBEN dem Schirm liegt.
         Auf einem hochkant gehaltenen Handy sieht man von einer 16:9-Platte
         gut ein Viertel. Der Rest ist da, aber unsichtbar — und wer nicht
         weiss, dass er schieben kann, haelt den Ort fuer leer. Genau das
         wurde gemeldet: eine Meldung schickte in die Siedlung, und dort
         „war nichts". Es war etwas: bei u = 0,885, also weit rechts
         ausserhalb des Schirms. */
      let linksDraussen = 0;
      let rechtsDraussen = 0;
      for (const { spot, el } of nodes) {
        const [x, y] = renderer.plateUvToScreen(spot.u, spot.v);
        // Maßstab ist die Höhe der PLATTE auf dem Schirm, nicht die
        // Fensterhöhe — sonst werden die Flächen im Hochformat riesig.
        const px = Math.max(34, Math.min(spot.r * plateH * 1.35, h * 0.5));
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        el.style.width = `${px}px`;
        el.style.height = `${px}px`;
        if (x < px * 0.5) linksDraussen += 1;
        else if (x > w - px * 0.5) rechtsDraussen += 1;
      }
      zeigeRand(linksDraussen, rechtsDraussen);

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
        // Nicht, solange die Tafel offen ist: Deren Verlauf ist oben
        // durchsichtig, und die Beschriftung schien hindurch — der Name des
        // Punktes stand dann zweimal untereinander, einmal als Ueberschrift
        // und einmal als Geist darueber.
        label.classList.toggle('on', !panel.classList.contains('on'));
      } else {
        renderer.hover[3] = hoverAmt;
        label.classList.remove('on');
      }
    },
  };
}
