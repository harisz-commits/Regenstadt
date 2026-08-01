/**
 * Die Karte — das Bordgerät des Spinners.
 *
 * Reisen zwischen den Sektoren. Gelaufen wird INNERHALB eines Sektors,
 * geflogen ZWISCHEN ihnen. Mit acht Orten reicht Laufen noch, mit zwanzig
 * nicht mehr: Wer vom Kühlhaus zurück in die Kanalgasse will, klickt sich
 * sonst durch sieben Pfeile, und das ist keine Ermittlung, das ist Verwaltung.
 *
 * Die Karte ist bewusst GEZEICHNET und nicht fotografiert. Ein Foto wäre ein
 * Bild von einer Stadt; ein Navigationsdisplay ist ein Gerät, das im Wagen
 * eingebaut ist — Raster, Leuchtspuren, ein Zielkreuz, das sucht. Deshalb
 * SVG: Es bleibt auf jedem Schirm scharf, und die Sektoren können leuchten,
 * blinken und gesperrt aussehen, ohne dass dafür ein Bild erzeugt werden muss.
 *
 * Ein gesperrter Sektor bleibt SICHTBAR, nur unerreichbar — mit dem Hinweis,
 * was fehlt. Der Spieler soll sehen, dass die Stadt weitergeht. Eine Tür, die
 * man nie gesehen hat, motiviert niemanden.
 *
 * Der Flug ist keine Blende, sondern ein Platz im Wagen: die Kanzel von innen,
 * die Stadt zieht vorbei, das Ziel läuft auf dem Display herunter. Ein Schnitt
 * hätte es auch getan — aber dann wäre das Flugauto nur ein Menü.
 */

import { DISTRICTS, DISTRICT_IDS } from './districts.js';

/** Futuristischer Wagen, von der Seite. Auch als Zeiger auf der Karte. */
const AUTO_SVG =
  '<svg viewBox="0 0 32 16" fill="none" xmlns="http://www.w3.org/2000/svg">'
  + '<path d="M3 10.5 L7.5 6.2 C9 4.7 11 4 13.2 4 H20 C23 4 25.6 5.2 27.4 7.4 L29 9.4 '
  + 'C29.6 10.1 29.2 11.2 28.3 11.3 L24 11.7" stroke="currentColor" stroke-width="1.3" '
  + 'stroke-linecap="round" stroke-linejoin="round"/>'
  + '<path d="M3 10.5 H10.5 M14 11.7 H21.5" stroke="currentColor" stroke-width="1.3" '
  + 'stroke-linecap="round"/>'
  + '<circle cx="12.2" cy="11.6" r="1.9" stroke="currentColor" stroke-width="1.3"/>'
  + '<circle cx="22.8" cy="11.6" r="1.9" stroke="currentColor" stroke-width="1.3"/>'
  + '<path d="M10 6.6 H18.5" stroke="currentColor" stroke-width="1.1" opacity=".65"/>'
  + '<path d="M1 7.6 H5.4 M0.4 5.2 H3.6" stroke="currentColor" stroke-width="1.1" '
  + 'stroke-linecap="round" opacity=".5"/></svg>';

const CSS = `
/* --- Bordgerät ---------------------------------------------------------- */
#karte {
  position: fixed; inset: 0; z-index: 34; display: none;
  background: radial-gradient(120% 90% at 50% 42%, #0b1a24 0%, #050a10 58%, #03060a 100%);
  font: 14px/1.7 ui-monospace, "SFMono-Regular", Menlo, monospace; color: #bfe4f5;
}
#karte.on { display: flex; flex-direction: column; }
/* Abtastzeilen: Das Ding ist ein Schirm, kein Fenster. */
#karte::after {
  content: ''; position: absolute; inset: 0; pointer-events: none; z-index: 3;
  background: repeating-linear-gradient(0deg, rgba(0,0,0,.22) 0 1px, transparent 1px 3px);
  mix-blend-mode: multiply;
}

#karte .kopf {
  flex-shrink: 0; display: flex; align-items: center; gap: 14px;
  padding: calc(16px + env(safe-area-inset-top)) clamp(16px, 4vw, 44px) 13px;
  border-bottom: 1px solid rgba(90,200,240,.22);
  background: linear-gradient(180deg, rgba(10,30,42,.75), rgba(5,12,18,0));
}
#karte .kopf .ico { width: 30px; color: #6fd6f5; flex-shrink: 0; }
#karte .kopf .ico svg { width: 100%; display: block; }
#karte .kopf .t { flex: 1; min-width: 0; }
#karte .kopf .n { font-size: 10px; letter-spacing: .38em; color: #5aa8c8; text-transform: uppercase; }
#karte .kopf .s { font-size: 15px; letter-spacing: .2em; color: #d8f4ff; margin-top: 4px; }
#karte .kopf button {
  font: inherit; font-size: 10px; letter-spacing: .2em; text-transform: uppercase;
  padding: 10px 15px; cursor: pointer; color: #8fd4ec; flex-shrink: 0;
  background: rgba(90,200,240,.08); border: 1px solid rgba(90,200,240,.32);
}

/* Karte und Zielliste nebeneinander, auf dem Handy untereinander. */
#karte .rumpf { flex: 1; display: flex; min-height: 0; }
#karte .feld { flex: 1.35; position: relative; min-width: 0; }
#karte .feld svg { position: absolute; inset: 0; width: 100%; height: 100%; }
#karte .liste {
  flex: 1; min-width: 0; max-width: 460px; overflow-y: auto;
  padding: 18px clamp(16px, 4vw, 44px) 18px 0;
}

/* --- Kartenelemente ----------------------------------------------------- */
.k-raster { stroke: rgba(90,200,240,.13); stroke-width: .5; }
.k-block  { fill: rgba(90,200,240,.045); stroke: rgba(90,200,240,.10); stroke-width: .4; }
.k-route  { stroke: rgba(90,200,240,.30); stroke-width: .9; stroke-dasharray: 3 3; fill: none; }
.k-route.frei { stroke: rgba(120,230,255,.6); stroke-dasharray: none; }
.k-knoten circle.ring { fill: rgba(4,12,18,.85); stroke: rgba(120,230,255,.75); stroke-width: 1.2; }
.k-knoten circle.kern { fill: rgba(120,230,255,.9); }
.k-knoten text {
  /* ACHTUNG: Das sind Ansichtsfeld-EINHEITEN, keine Pixel. Bei 100 Einheiten
     auf rund 680 px wird aus 4.4 am Schirm 30 px — die erste Fassung hatte
     Beschriftungen so gross wie Ueberschriften. 2.2 ergibt rund 15 px. */
  fill: #cdefff; font: 2.2px ui-monospace, Menlo, monospace; letter-spacing: .12em;
  text-transform: uppercase; text-anchor: middle;
}
.k-knoten.zu circle.ring { stroke: rgba(140,170,190,.42); stroke-dasharray: 2 2; }
.k-knoten.zu circle.kern { fill: rgba(140,170,190,.42); }
.k-knoten.zu text { fill: rgba(160,190,205,.55); }
.k-knoten.hier circle.ring { stroke: #ffbe74; }
.k-knoten.hier circle.kern { fill: #ffbe74; }
.k-knoten.hier text { fill: #ffd7a4; }
.k-puls { fill: none; stroke: #ffbe74; stroke-width: .7; transform-origin: center; }
.k-knoten:not(.zu) { cursor: pointer; }
.k-knoten:not(.zu):hover circle.ring { stroke-width: 2; }

/* --- Zielliste ---------------------------------------------------------- */
#karte .ziel {
  display: block; width: 100%; text-align: left; margin-bottom: 10px;
  padding: 13px 16px; font: inherit; cursor: pointer; color: #bfe4f5;
  background: rgba(90,200,240,.05); border: 1px solid rgba(90,200,240,.24);
  border-left-width: 3px; transition: background .15s, border-color .15s;
}
#karte .ziel:hover:not(:disabled) { background: rgba(90,200,240,.13); border-color: rgba(120,230,255,.7); }
#karte .ziel .z-n { font-size: 12px; letter-spacing: .17em; color: #dcf5ff; }
#karte .ziel .z-b { font-size: 12px; opacity: .58; margin-top: 5px; }
#karte .ziel.hier { border-left-color: #ffbe74; }
#karte .ziel.hier .z-n { color: #ffd7a4; }
#karte .ziel.hier .z-n::after { content: ' · HIER'; font-size: 9px; letter-spacing: .2em; opacity: .7; }
#karte .ziel.zu { opacity: .46; cursor: default; border-style: dashed; border-left-color: rgba(255,190,116,.5); }
#karte .ziel.zu .z-b { color: rgba(255,190,116,.9); opacity: .95; }

#karte .fuss {
  flex-shrink: 0; padding: 11px clamp(16px, 4vw, 44px) calc(14px + env(safe-area-inset-bottom));
  border-top: 1px solid rgba(90,200,240,.18); font-size: 10px; letter-spacing: .2em;
  text-transform: uppercase; color: rgba(140,200,225,.5);
}

/* --- Flug: Platz im Wagen ----------------------------------------------- */
#flug {
  position: fixed; inset: 0; z-index: 36; display: none;
  background: #04060a; overflow: hidden;
}
#flug.on { display: block; }
/* Die Kanzel von innen. Der langsame Zoom ist die ganze Bewegung — mehr
   braucht es nicht, damit es sich nach Fahrt anfühlt. */
#flug .sicht {
  position: absolute; inset: -6%; background: center/cover no-repeat;
  animation: flugZoom 3.4s cubic-bezier(.4,0,.35,1) forwards;
}
@keyframes flugZoom {
  0%   { transform: scale(1.00) translateY(0); filter: brightness(.55) blur(1.5px); }
  18%  { filter: brightness(1) blur(0); }
  100% { transform: scale(1.16) translateY(-1.5%); filter: brightness(1) blur(0); }
}
/* Leuchtspuren, die vorbeiziehen: der eigentliche Geschwindigkeitseindruck. */
#flug .spuren { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
#flug .spur {
  position: absolute; height: 1px; left: -30%;
  background: linear-gradient(90deg, transparent, rgba(255,214,160,.85), transparent);
  animation: spurZieht linear infinite;
}
@keyframes spurZieht { from { transform: translateX(0); } to { transform: translateX(190vw); } }

#flug .hud {
  position: absolute; left: 0; right: 0; bottom: 0;
  padding: 20px clamp(18px, 5vw, 60px) calc(26px + env(safe-area-inset-bottom));
  background: linear-gradient(to top, rgba(3,7,11,.92), rgba(3,7,11,0));
  font: 11px/1.9 ui-monospace, Menlo, monospace; letter-spacing: .28em;
  text-transform: uppercase; color: #8fd4ec;
}
#flug .hud .zeile { display: flex; justify-content: space-between; gap: 16px; align-items: baseline; }
#flug .hud .ziel-n { color: #ffd7a4; letter-spacing: .22em; font-size: 13px; }
#flug .hud .balken { height: 2px; background: rgba(90,200,240,.22); margin-top: 13px; }
#flug .hud .balken i { display: block; height: 100%; width: 0; background: #6fd6f5; animation: balkenLaeuft 3.4s linear forwards; }
@keyframes balkenLaeuft { to { width: 100%; } }

@media (prefers-reduced-motion: reduce) {
  #flug .sicht { animation: none; }
  #flug .spur { display: none; }
  #flug .hud .balken i { animation-duration: .3s; }
  .k-puls { display: none; }
}

@media (max-width: 900px) {
  #karte .rumpf { flex-direction: column; }
  #karte .feld { flex: none; height: 42vh; min-height: 240px; }
  #karte .liste { flex: 1; max-width: none; padding: 14px 16px 18px; }
  #karte .kopf { padding-left: 16px; padding-right: 16px; }
  #karte .fuss { padding-left: 16px; padding-right: 16px; }
}
`;

/** Straßenraster im Hintergrund — angedeutete Stadt, keine echte Geografie. */
function raster() {
  let d = '';
  for (let x = 6; x <= 94; x += 11) d += `M${x} 4 V96 `;
  for (let y = 8; y <= 96; y += 12) d += `M4 ${y} H96 `;
  let bloecke = '';
  // Feste Auswahl statt Zufall: Die Karte soll bei jedem Öffnen gleich aussehen.
  const b = [[17, 20], [39, 32], [61, 20], [72, 56], [28, 56], [50, 68], [17, 80], [83, 32]];
  for (const [x, y] of b) bloecke += `<rect class="k-block" x="${x}" y="${y}" width="10" height="11"/>`;
  return `<path class="k-raster" d="${d}"/>${bloecke}`;
}

/**
 * @param {{ world: object, goTo: (id: string) => Promise<void>,
 *           getScene: () => object, notify: (s: string) => void }} host
 */
export function createSpinner(host) {
  const style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  const base = import.meta.env.BASE_URL || '/';

  const el = document.createElement('div');
  el.id = 'karte';
  el.innerHTML = `
    <div class="kopf">
      <div class="ico">${AUTO_SVG}</div>
      <div class="t"><div class="n">Bordgerät · Zielwahl</div><div class="s">Karte</div></div>
      <button class="zurueck" type="button">Schließen</button>
    </div>
    <div class="rumpf">
      <div class="feld"><svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet"></svg></div>
      <div class="liste"></div>
    </div>
    <div class="fuss"></div>`;
  document.body.appendChild(el);

  const flug = document.createElement('div');
  flug.id = 'flug';
  flug.innerHTML = `
    <div class="sicht"></div>
    <div class="spuren"></div>
    <div class="hud">
      <div class="zeile"><span class="ziel-n"></span><span class="dist"></span></div>
      <div class="zeile"><span class="stat">Steigflug</span><span class="hoehe"></span></div>
      <div class="balken"><i></i></div>
    </div>`;
  document.body.appendChild(flug);
  flug.querySelector('.sicht').style.backgroundImage = `url("${base}plates/spinner-backdrop.jpg")`;

  // Leuchtspuren einmalig anlegen, in verschiedenen Höhen und Tempi.
  const spuren = flug.querySelector('.spuren');
  for (let i = 0; i < 14; i++) {
    const s = document.createElement('div');
    s.className = 'spur';
    s.style.top = `${8 + i * 6.2}%`;
    s.style.width = `${12 + (i % 4) * 9}%`;
    s.style.opacity = `${0.25 + (i % 3) * 0.22}`;
    s.style.animationDuration = `${0.7 + (i % 5) * 0.34}s`;
    s.style.animationDelay = `${(i % 7) * 0.21}s`;
    spuren.appendChild(s);
  }

  const svg = el.querySelector('.feld svg');
  const liste = el.querySelector('.liste');
  const fuss = el.querySelector('.fuss');
  el.querySelector('.zurueck').onclick = close;

  function close() { el.classList.remove('on'); }

  function build() {
    const hier = host.getScene()?.district;
    const frei = (d) => d.offen || host.world.meets(d.requires);

    /* --- Karte ---------------------------------------------------------- */
    let routen = '';
    const offene = DISTRICT_IDS.filter((id) => frei(DISTRICTS[id]));
    // Jeder erreichbare Sektor bekommt eine Linie zum aktuellen Standort:
    // Das ist die Strecke, die der Wagen fliegen würde.
    const von = DISTRICTS[hier] || DISTRICTS[offene[0]];
    for (const id of DISTRICT_IDS) {
      const d = DISTRICTS[id];
      if (!von || d === von) continue;
      routen += `<path class="k-route${frei(d) ? ' frei' : ''}" `
              + `d="M${von.mx} ${von.my} Q${(von.mx + d.mx) / 2} ${Math.min(von.my, d.my) - 12} ${d.mx} ${d.my}"/>`;
    }

    let knoten = '';
    for (const id of DISTRICT_IDS) {
      const d = DISTRICTS[id];
      const offen = frei(d);
      const cls = 'k-knoten' + (offen ? '' : ' zu') + (id === hier ? ' hier' : '');
      const puls = id === hier
        ? `<circle class="k-puls" cx="${d.mx}" cy="${d.my}" r="3">
             <animate attributeName="r" values="3;7.5;3" dur="2.6s" repeatCount="indefinite"/>
             <animate attributeName="opacity" values=".75;0;.75" dur="2.6s" repeatCount="indefinite"/>
           </circle>` : '';
      knoten += `<g class="${cls}" data-id="${id}" role="button" tabindex="${offen && id !== hier ? 0 : -1}">
          ${puls}
          <circle class="ring" cx="${d.mx}" cy="${d.my}" r="3"/>
          <circle class="kern" cx="${d.mx}" cy="${d.my}" r="1.2"/>
          <text x="${d.mx}" y="${d.my + 6.4}">${offen ? d.kurz : '???'}</text>
        </g>`;
    }
    svg.innerHTML = raster() + routen + knoten;

    for (const g of svg.querySelectorAll('.k-knoten:not(.zu)')) {
      const d = DISTRICTS[g.dataset.id];
      if (g.dataset.id === hier) continue;
      g.onclick = () => fliege(d);
    }

    /* --- Liste ---------------------------------------------------------- */
    liste.innerHTML = '';
    for (const id of DISTRICT_IDS) {
      const d = DISTRICTS[id];
      const offen = frei(d);
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'ziel' + (offen ? '' : ' zu') + (id === hier ? ' hier' : '');
      b.innerHTML = '<div class="z-n"></div><div class="z-b"></div>';
      b.querySelector('.z-n').textContent = offen ? d.name : `${d.kurz} · gesperrt`;
      b.querySelector('.z-b').textContent = offen ? d.blurb : (d.hint || 'Noch kein Anlass, dorthin zu fliegen.');
      b.disabled = !offen || id === hier;
      if (offen && id !== hier) b.onclick = () => fliege(d);
      liste.appendChild(b);
    }

    fuss.textContent = offene.length < DISTRICT_IDS.length
      ? `${offene.length} von ${DISTRICT_IDS.length} Sektoren freigegeben · Hinweise schalten die übrigen frei`
      : `${offene.length} von ${DISTRICT_IDS.length} Sektoren freigegeben`;
  }

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  async function fliege(d) {
    close();
    flug.querySelector('.ziel-n').textContent = d.name;
    flug.classList.add('on');

    // Entfernung und Höhe laufen mit — das Display soll arbeiten, nicht nur
    // dastehen. Die Zahlen sind Stimmung, keine Simulation.
    const dauer = reduced ? 500 : 3400;
    const dist = flug.querySelector('.dist');
    const hoehe = flug.querySelector('.hoehe');
    const stat = flug.querySelector('.stat');
    const t0 = performance.now();
    const tick = () => {
      const p = Math.min(1, (performance.now() - t0) / dauer);
      dist.textContent = `${(8.4 * (1 - p)).toFixed(1)} km`;
      hoehe.textContent = `${Math.round(140 + Math.sin(p * Math.PI) * 900)} m`;
      stat.textContent = p < 0.25 ? 'Steigflug' : p < 0.75 ? 'Reiseflug' : 'Anflug';
      if (p < 1) requestAnimationFrame(tick);
    };
    tick();

    // Der Ortswechsel läuft hinter der Kanzel, damit am Ende nicht noch
    // geladen wird.
    const geladen = host.goTo(d.arrival);
    await new Promise((r) => setTimeout(r, dauer));
    await geladen;

    // Der Flug zählt doppelt: weiteste Strecke im Spiel, und Laborbefunde
    // reifen in Ortswechseln.
    const fertig = host.world.step();
    flug.classList.remove('on');
    if (fertig) host.notify('Ein Befund liegt am Laborschalter bereit.');
  }

  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && el.classList.contains('on')) close();
  });

  return {
    open() { build(); el.classList.add('on'); },
    close,
    isOpen: () => el.classList.contains('on'),
    /** Für die Kopfzeile: derselbe Wagen wie auf dem Bordgerät. */
    icon: AUTO_SVG,
  };
}
