/**
 * Der Abschluss: die Pinnwand in der eigenen Wohnung.
 *
 * Bis hierher konnte das Spiel nicht enden. Man konnte alles finden und stand
 * danach genauso da wie vorher — und eine Ermittlung, die nicht abgeschlossen
 * werden kann, ist keine Ermittlung, sondern ein Rundgang.
 *
 * Hier wird sie abgeschlossen. Der Spieler benennt eine Person und legt vor,
 * was er hat. Daraus fallen DREI verschiedene Enden, und das ist der Punkt:
 *
 *   Anklage    richtige Person, alle drei Beweise. Der Fall hält.
 *   Verdacht   richtige Person, aber die Beweise fehlen. Sie geht.
 *   Irrtum     falsche Person. Jemand geht dafür, der es nicht war — und
 *              der eigentliche Vorgang läuft weiter.
 *
 * Der Nachspann wird vom selben Modell geschrieben, das auch die Figuren
 * spricht, und zwar aus dem TATSÄCHLICHEN Akteninhalt. Ein fest geschriebener
 * Text wüsste nicht, was der Spieler gefunden hat und was nicht; der Nachspann
 * soll aber genau davon erzählen. Fällt das Archiv aus, steht ein knapper
 * Ersatztext bereit — ein Spiel darf nicht daran scheitern, dass eine Leitung
 * klemmt.
 */

import { CHARACTERS } from './characters.js';
import { fall, beiFallwechsel, naechsterFall } from './fall.js';

/**
 * Die Loesung des laufenden Falls — lebende Bindung, siehe characters.js.
 * Wieder ausgefuehrt, weil die Pruefwerkzeuge sie brauchen.
 */
export let LOESUNG = fall().loesung;

beiFallwechsel(() => { LOESUNG = fall().loesung; });

const CSS = `
#anklage {
  position: fixed; inset: 0; z-index: 33; display: none; flex-direction: column;
  background: rgba(3,5,9,.975);
  font: 13px/1.85 ui-monospace, "SFMono-Regular", Menlo, monospace; color: #b9cfe2;
}
#anklage.on { display: flex; }
#anklage .kopf {
  flex-shrink: 0; display: flex; align-items: baseline; gap: 16px;
  padding: calc(20px + env(safe-area-inset-top)) clamp(18px, 5vw, 60px) 16px;
  border-bottom: 1px solid rgba(126,190,230,.16);
}
#anklage .kopf h2 { font: inherit; font-size: 11px; letter-spacing: .3em; color: #7fb4d8; margin: 0; font-weight: 400; text-transform: uppercase; }
#anklage .kopf .sub { font-size: 12px; opacity: .5; flex: 1; min-width: 0; }
#anklage .rumpf { flex: 1; overflow-y: auto; padding: 24px clamp(18px, 5vw, 60px) 20px; }
#anklage .fuss {
  flex-shrink: 0; border-top: 1px solid rgba(126,190,230,.16);
  padding: 16px clamp(18px, 5vw, 60px) calc(20px + env(safe-area-inset-bottom));
  display: flex; gap: 12px; align-items: center; flex-wrap: wrap;
}
#anklage h3 {
  font: inherit; font-size: 10px; letter-spacing: .3em; color: #7fb4d8;
  font-weight: 400; text-transform: uppercase; margin: 0 0 14px;
}
#anklage h3 + h3, #anklage .beweise + h3 { margin-top: 30px; }

/* --- Beweislage: abgehakt oder offen ------------------------------------ */
#anklage .beweise { max-width: 78ch; margin: 0 0 4px; }
#anklage .beweise .b { display: flex; gap: 12px; padding: 7px 0; align-items: baseline; }
#anklage .beweise .b .k { flex-shrink: 0; width: 1.4em; color: rgba(159,180,204,.4); }
#anklage .beweise .b.da .k { color: #9df3c8; }
#anklage .beweise .b.da { color: #d8ecdf; }
#anklage .beweise .b:not(.da) { opacity: .45; }

/* --- Verdächtige --------------------------------------------------------- */
#anklage .leute { display: grid; gap: 10px; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); max-width: 1000px; }
#anklage .leute button {
  display: flex; gap: 13px; align-items: center; text-align: left; width: 100%;
  font: inherit; cursor: pointer; color: #b9cfe2; padding: 11px 13px;
  background: rgba(126,190,230,.05); border: 1px solid rgba(126,190,230,.22);
  transition: background .15s, border-color .15s;
}
#anklage .leute button:hover { background: rgba(126,190,230,.14); border-color: rgba(126,190,230,.55); }
#anklage .leute button.gewaehlt { border-color: #ffbe74; background: rgba(255,190,116,.1); }
#anklage .leute button img { width: 46px; height: 46px; object-fit: cover; flex-shrink: 0; border: 1px solid rgba(126,190,230,.2); filter: saturate(.85); }
#anklage .leute button .n { font-size: 13px; letter-spacing: .1em; color: #e2f0fb; }
#anklage .leute button.gewaehlt .n { color: #ffd7a4; }
#anklage .leute button .r { font-size: 11px; opacity: .55; margin-top: 3px; }

#anklage button.tat {
  font: inherit; font-size: 11px; letter-spacing: .16em; text-transform: uppercase;
  padding: 13px 20px; cursor: pointer; color: #ffbe74;
  background: rgba(255,190,116,.09); border: 1px solid rgba(255,190,116,.42);
}
#anklage button.tat:hover:not(:disabled) { background: rgba(255,190,116,.2); }
#anklage button.tat:disabled { opacity: .3; cursor: default; }
#anklage button.weg {
  font: inherit; font-size: 11px; letter-spacing: .16em; text-transform: uppercase;
  padding: 13px 20px; cursor: pointer; color: #9ec8e4;
  background: rgba(126,190,230,.07); border: 1px solid rgba(126,190,230,.3);
}
#anklage .warnung { font-size: 12px; color: rgba(255,190,116,.8); max-width: 60ch; }

/* --- Nachspann ----------------------------------------------------------- */
#anklage .ende { max-width: 70ch; margin: 0 auto; padding: min(9vh, 70px) 0 40px; }
#anklage .ende .marke {
  font-size: 10px; letter-spacing: .42em; text-transform: uppercase; margin-bottom: 18px;
}
#anklage .ende.gut .marke { color: #9df3c8; }
#anklage .ende.halb .marke { color: #ffbe74; }
#anklage .ende.falsch .marke { color: #ff9d9d; }
#anklage .ende h1 { font: inherit; font-size: 21px; line-height: 1.5; letter-spacing: .06em; color: #eaf6ff; margin: 0 0 26px; font-weight: 400; }
#anklage .ende p { white-space: pre-wrap; line-height: 1.95; margin: 0 0 18px; }
#anklage .ende .laedt { opacity: .5; letter-spacing: .22em; text-transform: uppercase; font-size: 11px; }
#anklage .ende .bilanz {
  margin-top: 34px; padding-top: 20px; border-top: 1px solid rgba(126,190,230,.16);
  font-size: 12px; opacity: .6;
}

@media (max-width: 820px) {
  #anklage { font-size: 14px; }
  #anklage .kopf, #anklage .rumpf, #anklage .fuss { padding-left: 16px; padding-right: 16px; }
  #anklage .kopf .sub { display: none; }
  #anklage .leute { grid-template-columns: 1fr; }
  #anklage .ende h1 { font-size: 18px; }
}
`;

/**
 * @param {{ world: object, getNotes: () => {label:string,text:string}[] }} host
 */
export function createAnklage(host) {
  const style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  const el = document.createElement('div');
  el.id = 'anklage';
  el.innerHTML = `
    <div class="kopf">
      <h2>Pinnwand</h2><div class="sub"></div>
      <button class="weg" type="button">Zurück</button>
    </div>
    <div class="rumpf"></div>
    <div class="fuss"></div>`;
  document.body.appendChild(el);

  const rumpf = el.querySelector('.rumpf');
  const fuss = el.querySelector('.fuss');
  const sub = el.querySelector('.sub');
  const base = import.meta.env.BASE_URL || '/';

  /** Gewählte Person, solange die Anklage noch nicht erhoben ist. */
  let gewaehlt = null;
  /** Einmal erhoben, bleibt sie erhoben. Das Spiel ist danach vorbei. */
  let vorbei = false;
  /** Der fertige Ausgang, damit er ein Neuladen übersteht. */
  let ausgang = null;

  const w = host.world;
  const hat = (c) => w.hasClue(c);

  /* --- Auswahl ----------------------------------------------------------- */

  function zeigeAuswahl() {
    const bereit = hat(LOESUNG.voraussetzung.clue);
    const vorhanden = LOESUNG.beweise.filter((b) => hat(b.clue));

    sub.textContent = `${host.getNotes().length} Einträge in der Akte`;

    rumpf.innerHTML = '';

    const h1 = document.createElement('h3');
    h1.textContent = 'Was die Anklage tragen müsste';
    rumpf.appendChild(h1);

    const bw = document.createElement('div');
    bw.className = 'beweise';
    for (const b of LOESUNG.beweise) {
      const d = document.createElement('div');
      d.className = 'b' + (hat(b.clue) ? ' da' : '');
      d.innerHTML = '<span class="k"></span><span class="t"></span>';
      d.querySelector('.k').textContent = hat(b.clue) ? '×' : '·';
      d.querySelector('.t').textContent = hat(b.clue) ? b.label : 'Noch offen.';
      bw.appendChild(d);
    }
    rumpf.appendChild(bw);

    const h2 = document.createElement('h3');
    h2.textContent = 'Wer war es';
    rumpf.appendChild(h2);

    const grid = document.createElement('div');
    grid.className = 'leute';
    for (const c of Object.values(CHARACTERS)) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = gewaehlt === c.id ? 'gewaehlt' : '';
      b.innerHTML = '<img alt="" /><div><div class="n"></div><div class="r"></div></div>';
      b.querySelector('img').src = base + c.portrait;
      b.querySelector('img').style.objectPosition = c.portraitPosition || '50% 50%';
      b.querySelector('.n').textContent = c.name;
      b.querySelector('.r').textContent = c.role;
      b.onclick = () => { gewaehlt = gewaehlt === c.id ? null : c.id; zeigeAuswahl(); };
      grid.appendChild(b);
    }
    rumpf.appendChild(grid);

    /* --- Fußzeile -------------------------------------------------------- */
    fuss.innerHTML = '';
    const knopf = document.createElement('button');
    knopf.className = 'tat';
    knopf.type = 'button';
    knopf.textContent = gewaehlt
      ? `Anklage erheben: ${CHARACTERS[gewaehlt].name}`
      : 'Anklage erheben';
    knopf.disabled = !bereit || !gewaehlt;
    knopf.onclick = () => erhebe(gewaehlt);
    fuss.appendChild(knopf);

    const hinweis = document.createElement('div');
    hinweis.className = 'warnung';
    if (!bereit) hinweis.textContent = LOESUNG.voraussetzung.text;
    else if (!gewaehlt) hinweis.textContent = 'Ein Name. Danach gibt es kein Zurück.';
    else if (vorhanden.length < LOESUNG.beweise.length) {
      hinweis.textContent = `Du hast ${vorhanden.length} von ${LOESUNG.beweise.length} `
        + 'Punkten belegt. Es reicht, um jemanden zu beschuldigen. Es reicht '
        + 'nicht unbedingt, um ihn zu behalten.';
    } else hinweis.textContent = 'Das trägt.';
    fuss.appendChild(hinweis);
  }

  /* --- Auswertung -------------------------------------------------------- */

  /**
   * Drei Ausgänge, und keiner davon ist „verloren".
   *
   * Auch das schlechte Ende ist ein Ende: Der Fall wird geschlossen, nur
   * falsch. Ein Spiel, das bei der falschen Antwort einfach weiterläuft,
   * nimmt der richtigen ihr Gewicht.
   */
  function bewerte(id) {
    const fehlend = LOESUNG.beweise.filter((b) => !hat(b.clue));
    if (id !== LOESUNG.taeter) return { art: 'falsch', fehlend };
    return { art: fehlend.length ? 'halb' : 'gut', fehlend };
  }

  const MARKEN = {
    gut: { marke: 'Fall geschlossen', titel: 'Die Anklage hält.' },
    halb: { marke: 'Fall zu den Akten', titel: 'Der Name stimmt. Der Rest nicht.' },
    falsch: { marke: 'Fall geschlossen', titel: 'Es wird jemand dafür geradestehen. Nur nicht die Richtige.' },
  };

  /** Ersatztexte, falls das Archiv nicht antwortet. */
  const NOTFALL = {
    gut: 'Sie wird nicht abgeführt, sie geht selbst — den ganzen Weg durch die '
       + 'Halle, an dem Tresen vorbei, an dem niemand eingetragen wird. Zwei '
       + 'Tage später ist die zwölfte Urkunde ein Beweisstück, und der Mann, '
       + 'auf dessen Namen sie ausgestellt war, steht wieder an seinem Stand '
       + 'und verkauft, als wäre nichts gewesen. Elf andere kommen nicht '
       + 'zurück. Für die reicht es nur zu einer Zeile in einem Bericht, den '
       + 'niemand lesen wird.\n\nDer Regen hört nicht auf. Das tut er nie.',
    halb: 'Sie hört sich alles an, ohne dich zu unterbrechen, und dann bittet '
        + 'sie dich, es noch einmal zu sagen — langsamer, für den Anwalt, der '
        + 'inzwischen im Raum steht. Was du hast, reicht für eine Anzeige und '
        + 'für zwei Zeitungstage. Danach ist die Etage geräumt, das Programm '
        + 'heißt anders und die Liste ist länger.\n\nDu hattest recht. Recht '
        + 'haben ist in dieser Stadt keine Währung.',
    falsch: 'Es geht schneller, als du gedacht hättest. Eine Unterschrift, eine '
          + 'Nummer, eine Zelle. Der Fall gilt als geschlossen, und in den '
          + 'Unterlagen steht, dass er sauber gearbeitet worden ist.\n\nDrei '
          + 'Wochen später wird im Meldeamt eine zwölfte Urkunde '
          + 'unterschrieben. Diesmal ohne Aufsehen. Diesmal ohne dich.',
  };

  /**
   * Der Nachspann.
   *
   * Er wird geschrieben, nicht ausgewählt: Nur das Modell weiß, was der Spieler
   * tatsächlich in der Akte hat, wen er befragt hat und was er ausgelassen hat.
   * Genau darüber soll ein Nachspann reden.
   */
  function bauNachspann(id, urteil) {
    const person = CHARACTERS[id];
    const akte = host.getNotes().map((n) => `- ${n.label}: ${n.text}`).join('\n') || '- nichts';
    const fehlt = urteil.fehlend.map((b) => `- ${b.label}`).join('\n') || '- nichts';
    // Die tragenden Belege NOCH EINMAL, unabhaengig von der Akte.
    //
    // Erst bekam das Modell nur die Notizen. Wer sparsam abgeheftet hat, hatte
    // dort wenig stehen — und der Nachspann erzaehlte dann davon, dass in der
    // Akte nichts steht, statt von dem Fall. Was belegt ist, weiss das Spiel
    // ohnehin: es steht als Haken auf derselben Pinnwand.
    const belegt = LOESUNG.beweise.filter((b) => hat(b.clue))
      .map((b) => `- ${b.label}`).join('\n') || '- nichts davon';

    const lage = {
      gut: 'Die Beschuldigte ist die Richtige, und die Beweislage trägt. Die '
         + 'Anklage hält vor Gericht.',
      halb: 'Die Beschuldigte ist die Richtige, aber es fehlen Belege. Sie kommt '
          + 'davon; das Programm wird umbenannt und läuft weiter.',
      falsch: `Die beschuldigte Person ist UNSCHULDIG. Schuldig ist `
            + `${CHARACTERS[LOESUNG.taeter].name}, ${CHARACTERS[LOESUNG.taeter].role}. `
            + 'Die falsche Person wird verurteilt, der eigentliche Vorgang läuft weiter.',
    }[urteil.art];

    return `Du schreibst den Nachspann eines deutschsprachigen Neo-Noir-Detektivspiels.
Dauerregen, Neonreklame, Konzernmacht, nasse Straßen, moralische Grauzonen.

DER FALL: ${fall().praemisse}

DER ERMITTLER HAT ANGEKLAGT: ${person.name}, ${person.role}.
AUSGANG: ${lage}

WAS ER BELEGEN KANN:
${belegt}

WAS IHM GEFEHLT HAT:
${fehlt}

WAS SONST NOCH IN SEINER AKTE STEHT:
${akte}

Schreibe den Nachspann: sechs bis neun Sätze, zwei Absätze, deutsche Sprache.

REGELN:
- Erzähle, was NACH der Anklage geschieht — Wochen, nicht Minuten.
- Beziehe dich auf mindestens zwei konkrete Dinge aus den Listen oben. Erfinde
  keine Namen, Orte oder Beweise, die dort nicht stehen.
- Rede NICHT über die Akte als Gegenstand und nicht darüber, wie viel oder wie
  wenig darin steht. Erzähle den Ausgang, nicht die Aktenlage.
- Der letzte Satz ist kurz und bleibt hängen. Keine Moral, keine Erklärung,
  kein Ausblick auf eine Fortsetzung.
- Keine Überschrift, keine Aufzählung, keine Anführungszeichen um den Text.`;
  }

  /**
   * Das Ende hinschreiben.
   *
   * Eigene Funktion, weil sie zweimal gebraucht wird: einmal frisch nach der
   * Anklage, einmal beim Zurueckholen eines gesicherten Standes. Ein
   * abgeschlossener Fall soll nach dem Neuladen nicht wieder offen sein — und
   * der Nachspann darf dafuer kein zweites Mal beim Modell bestellt werden,
   * sonst stuende beim naechsten Aufmachen ein anderer da.
   *
   * @returns {HTMLElement} der Absatz, in den der Nachspann kommt
   */
  function zeigeEnde(art, id, bilanzText) {
    const m = MARKEN[art];
    fuss.innerHTML = '';
    sub.textContent = '';
    rumpf.innerHTML = '';

    const ende = document.createElement('div');
    ende.className = 'ende ' + art;
    ende.innerHTML = '<div class="marke"></div><h1></h1><p class="laedt">Der Bericht wird geschrieben …</p>';
    ende.querySelector('.marke').textContent = m.marke;
    ende.querySelector('h1').textContent = m.titel;
    rumpf.appendChild(ende);

    const bilanz = document.createElement('div');
    bilanz.className = 'bilanz';
    bilanz.textContent = bilanzText;
    ende.appendChild(bilanz);

    /*
     * Der naechste Fall.
     *
     * Ein Fall endet, die Stadt nicht. Steht noch einer an, ist er das
     * naheliegende Angebot — und „Von vorn" bleibt daneben stehen, weil man
     * denselben Fall auch anders ausgehen lassen koennen soll.
     *
     * Beides beginnt mit einem frischen Weltzustand: Die Akte des alten Falls
     * gehoert nicht in den neuen. Was bleibt, ist die Wohnung — und dass an
     * der Pinnwand noch Nadeln stecken.
     */
    const weiterFall = naechsterFall();
    if (weiterFall) {
      const w = document.createElement('button');
      w.className = 'tat';
      w.type = 'button';
      w.textContent = `Nächster Fall: ${weiterFall.titel}`;
      w.onclick = () => host.naechsterFall?.(weiterFall.id);
      fuss.appendChild(w);
    }

    const neu = document.createElement('button');
    neu.className = weiterFall ? 'weg' : 'tat';
    neu.type = 'button';
    neu.textContent = 'Denselben Fall von vorn';
    neu.onclick = () => host.neuAnfangen?.();
    fuss.appendChild(neu);

    return ende.querySelector('p');
  }

  /** Die Zeile unter dem Nachspann: was der Fall am Ende wert war. */
  function bilanzZeile(id) {
    const belegt = LOESUNG.beweise.filter((b) => hat(b.clue)).length;
    return `${host.getNotes().length} Einträge in der Akte · ${belegt} von `
         + `${LOESUNG.beweise.length} tragenden Belegen · angeklagt: ${CHARACTERS[id].name}`;
  }

  async function erhebe(id) {
    if (vorbei) return;
    vorbei = true;
    const urteil = bewerte(id);
    const bilanz = bilanzZeile(id);
    const text = zeigeEnde(urteil.art, id, bilanz);

    let erzaehlt = NOTFALL[urteil.art];
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: bauNachspann(id, urteil),
          messages: [{ role: 'user', text: 'Schreib den Nachspann.' }],
          // `low` statt `minimal`: Der Nachspann muss den Akteninhalt
          // verknuepfen, nicht nur vier Fragen formulieren.
          denken: 'low',
          // Und deshalb die volle Obergrenze.
          //
          // Gemessen: `low` verbraucht rund 1120 Token allein fuers Nachdenken.
          // Bei `max: 1200` blieben davon 47 fuer die Antwort — der Nachspann
          // brach nach EINEM Satz ab, mit finishReason MAX_TOKENS. Bei 2200
          // sind es 240 Ausgabe-Token und knapp 1000 Zeichen. Derselbe Fehler
          // wie seinerzeit bei den Vorschlagsfragen.
          max: 2200,
        }),
      });
      const data = await res.json().catch(() => ({}));
      const roh = String(data.text || '').trim();
      // Abgeschnitten ist schlechter als fest geschrieben: Ein Nachspann, der
      // mitten im Satz endet, liest sich als Fehler im Spiel.
      const ganz = data.finish !== 'MAX_TOKENS' && roh.length > 200;
      if (res.ok && ganz) erzaehlt = roh;
    } catch {
      /* Ersatztext steht schon da. Ein Ende darf nicht an einer Leitung hängen. */
    }

    text.classList.remove('laedt');
    text.textContent = erzaehlt;

    // Erst JETZT sichern: Vorher gab es keinen Nachspann, und ein gesicherter
    // Fall ohne Bericht waere ein Ende, das sich nicht ansehen laesst.
    ausgang = { art: urteil.art, wer: id, text: erzaehlt, bilanz };
    host.onEnde?.(ausgang);
  }

  /* --- Ein Weg hinaus, solange noch nichts entschieden ist ---------------- */
  el.querySelector('.weg').onclick = () => { if (!vorbei) close(); };
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && el.classList.contains('on') && !vorbei) close();
  });

  function close() { el.classList.remove('on'); }

  return {
    open() {
      // Nach dem Ende bleibt das Ende stehen. Die Pinnwand noch einmal zu
      // öffnen, um es anders zu versuchen, wäre kein Fall, sondern ein Menü.
      if (!vorbei) { gewaehlt = null; zeigeAuswahl(); }
      el.classList.add('on');
    },
    close,
    isOpen: () => el.classList.contains('on'),
    /** true, sobald die Anklage erhoben ist — danach ist Schluss. */
    istVorbei: () => vorbei,

    /** Der fertige Ausgang, fürs Sichern. `null`, solange nichts entschieden ist. */
    ausgang: () => ausgang,

    /** Einen gesicherten Ausgang zurückholen, ohne das Modell erneut zu fragen. */
    setAusgang(a) {
      if (!a || !CHARACTERS[a.wer]) return;
      ausgang = a;
      vorbei = true;
      const p = zeigeEnde(a.art, a.wer, a.bilanz);
      p.classList.remove('laedt');
      p.textContent = a.text;
    },
  };
}
