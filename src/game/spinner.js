/**
 * Der Spinner — Reisen zwischen den Sektoren.
 *
 * Eine Vollbildkarte: bekannte Sektoren als Ziele, unbekannte als gesperrte
 * Zeile mit einem Hinweis, was noch fehlt. Die gesperrte Zeile ist Absicht,
 * siehe districts.js — sie zeigt dem Spieler, dass die Stadt weitergeht.
 *
 * Der Flug kostet zwei Ortswechsel statt einem. Das ist keine Strafe: Weil
 * Laborbefunde in Ortswechseln reifen, ist ein Umweg über die halbe Stadt
 * genau das, was eine Untersuchung fertig werden lässt.
 */

import { DISTRICTS, DISTRICT_IDS } from './districts.js';

const CSS = `
#spinner {
  position: fixed; inset: 0; z-index: 34; display: none;
  background: #05070b center/cover no-repeat;
  font: 14px/1.8 ui-monospace, "SFMono-Regular", Menlo, monospace; color: #cfe0f0;
}
#spinner.on { display: flex; flex-direction: column; }
/* Das Bild traegt die Stimmung, der Text muss trotzdem lesbar bleiben. */
#spinner::before {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(90deg, rgba(4,6,10,.94) 0%, rgba(4,6,10,.82) 46%, rgba(4,6,10,.30) 100%);
}
#spinner > * { position: relative; }

#spinner .kopf {
  padding: calc(20px + env(safe-area-inset-top)) clamp(18px, 5vw, 60px) 14px;
  display: flex; align-items: flex-start; gap: 16px;
  border-bottom: 1px solid rgba(126,190,230,.16); flex-shrink: 0;
}
#spinner .kopf .t { flex: 1; min-width: 0; }
#spinner .kopf .n { font-size: 11px; letter-spacing: .32em; color: #7fb4d8; text-transform: uppercase; }
#spinner .kopf .s { font-size: 17px; letter-spacing: .16em; color: #eaf6ff; margin-top: 7px; }

#spinner .ziele { flex: 1; overflow-y: auto; padding: 20px clamp(18px, 5vw, 60px); }
#spinner .ziel {
  display: block; width: 100%; text-align: left; margin-bottom: 12px;
  padding: 15px 18px; font: inherit; cursor: pointer; color: #cfe0f0;
  background: rgba(126,190,230,.06); border: 1px solid rgba(126,190,230,.26);
  transition: background .15s, border-color .15s;
}
#spinner .ziel:hover:not(:disabled) { background: rgba(126,190,230,.15); border-color: rgba(126,190,230,.62); }
#spinner .ziel .z-n { font-size: 13px; letter-spacing: .16em; color: #eaf6ff; }
#spinner .ziel .z-b { font-size: 12.5px; opacity: .6; margin-top: 6px; max-width: 62ch; }
#spinner .ziel.hier { border-color: rgba(255,190,116,.5); }
#spinner .ziel.hier .z-n { color: #ffd7a4; }
#spinner .ziel.hier .z-n::after {
  content: ' · DU BIST HIER'; font-size: 10px; letter-spacing: .2em; opacity: .7;
}
/* Gesperrt: sichtbar, aber matt. Man soll sehen, dass die Stadt weitergeht. */
#spinner .ziel.zu { opacity: .42; cursor: default; border-style: dashed; }
#spinner .ziel.zu .z-n { color: #9fb4cc; }
#spinner .ziel.zu .z-b { color: rgba(255,190,116,.85); opacity: .9; }

#spinner .fuss {
  flex-shrink: 0; padding: 14px clamp(18px, 5vw, 60px) calc(18px + env(safe-area-inset-bottom));
  border-top: 1px solid rgba(126,190,230,.16); display: flex; gap: 10px; align-items: center;
}
#spinner .fuss .hinweis { font-size: 11px; letter-spacing: .12em; opacity: .45; }
#spinner button.zurueck {
  font: inherit; font-size: 11px; letter-spacing: .16em; text-transform: uppercase;
  padding: 11px 16px; cursor: pointer; color: #9ec8e4;
  background: rgba(126,190,230,.07); border: 1px solid rgba(126,190,230,.3);
}

/* Der Flug selbst: kurze Schwarzblende mit einer Zeile. */
#flug {
  position: fixed; inset: 0; z-index: 36; background: #04060a;
  display: none; align-items: center; justify-content: center;
  font: 12px/2 ui-monospace, Menlo, monospace; letter-spacing: .3em;
  color: #7fb4d8; text-transform: uppercase; text-align: center; padding: 0 8vw;
}
#flug.on { display: flex; }

@media (max-width: 820px) {
  #spinner { font-size: 15px; }
  #spinner::before { background: linear-gradient(180deg, rgba(4,6,10,.88) 0%, rgba(4,6,10,.93) 40%); }
  #spinner .kopf, #spinner .ziele, #spinner .fuss { padding-left: 16px; padding-right: 16px; }
}
`;

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
  el.id = 'spinner';
  el.innerHTML = `
    <div class="kopf">
      <div class="t">
        <div class="n">Spinner · Zielwahl</div>
        <div class="s">Wohin?</div>
      </div>
      <button class="zurueck" type="button">Abbrechen</button>
    </div>
    <div class="ziele"></div>
    <div class="fuss"><div class="hinweis"></div></div>`;
  document.body.appendChild(el);
  el.style.backgroundImage = `url("${base}plates/spinner-backdrop.jpg")`;

  const flug = document.createElement('div');
  flug.id = 'flug';
  document.body.appendChild(flug);

  const ziele = el.querySelector('.ziele');
  const hinweis = el.querySelector('.fuss .hinweis');
  el.querySelector('.zurueck').onclick = close;

  function close() { el.classList.remove('on'); }

  function build() {
    ziele.innerHTML = '';
    const hier = host.getScene()?.district;
    let offen = 0;

    for (const id of DISTRICT_IDS) {
      const d = DISTRICTS[id];
      const frei = d.offen || host.world.meets(d.requires);
      if (frei) offen += 1;

      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'ziel' + (frei ? '' : ' zu') + (id === hier ? ' hier' : '');
      b.innerHTML = '<div class="z-n"></div><div class="z-b"></div>';
      b.querySelector('.z-n').textContent = frei ? d.name : `${d.kurz} · gesperrt`;
      b.querySelector('.z-b').textContent = frei ? d.blurb : (d.hint || 'Noch kein Anlass, dorthin zu fliegen.');
      b.disabled = !frei || id === hier;
      if (frei && id !== hier) b.onclick = () => fliege(d);
      ziele.appendChild(b);
    }

    hinweis.textContent = offen < DISTRICT_IDS.length
      ? `${offen} von ${DISTRICT_IDS.length} Sektoren freigegeben — Hinweise schalten die übrigen frei.`
      : 'Alle Sektoren freigegeben.';
  }

  async function fliege(d) {
    close();
    flug.textContent = `Anflug · ${d.name}`;
    flug.classList.add('on');
    await host.goTo(d.arrival);
    // Der Flug zaehlt doppelt: Es ist die weiteste Strecke im Spiel, und
    // Laborbefunde reifen in Ortswechseln.
    const fertig = host.world.step();
    await new Promise((r) => setTimeout(r, 700));
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
  };
}
