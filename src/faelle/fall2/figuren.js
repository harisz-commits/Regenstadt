/**
 * FALL 2 — die Figuren.
 *
 * Neun statt vier. Die erste Fassung hatte vier, und mit vier Leuten laesst
 * sich keine Behoerde erzaehlen — nur ein Streit.
 *
 * DIE REIHE IST DER FALL: Vom Mann, der den Korb bedient, bis zu dem, der
 * unterschreibt, steht an jeder Stelle jemand, der nur seinen Teil getan hat.
 * Jeder Einzelne hat recht, und zusammen ergeben sie acht Tote.
 *
 * WAS IN `secret` UND `knows` STEHT, IST NUR DAS GEHEIMNIS — nicht, wann es
 * herauskommt. Das steht in `spuren.wenn`, und zwar dort ALLEIN. Die erste
 * Fassung hatte den Ausloeser zweimal beschrieben, einmal als Prosa im
 * Geheimnis und einmal als Bedingung; das Modell hat dann auf seine eigene
 * Beschreibung gewartet statt auf die Vorlage und sechs Runden lang
 * ausweichende Antworten gegeben.
 */

export const FIGUREN = {
  /* --- Das Werk --------------------------------------------------------- */
  'f2-zeuge': {
    id: 'f2-zeuge',
    name: 'Ilja Marek',
    role: 'Seit vierhundertzwanzig Tagen tot',
    portrait: 'details/f2-zeuge.jpg',
    appearance: 'Zwei Mäntel übereinander, Bart bis zum Hals, Hände zwischen '
              + 'den Knien. Er steht nicht auf.',
    voice: 'sehr leise, in kurzen Sätzen, lange Pausen; er antwortet erst, '
         + 'wenn er sicher ist, dass die Frage wirklich zu Ende ist',
    secret: 'Er hat vierzehn Monate lang nachts unter dem Werk gegraben und in '
          + 'der Kammer gestanden und gesungen, weil das Ding dort unten '
          + 'antwortet. Er hat gesehen, wie sie in der Todesnacht einen '
          + 'Fremden hinuntergebracht haben, der lebend hineinging und nicht '
          + 'wieder herauskam. Jede Aussage dazu beweist, dass er selbst lebt '
          + '— und wer amtlich tot ist und wieder auftaucht, wird nicht '
          + 'rehabilitiert, sondern entsorgt.',
    knows: 'Er kennt alle zwölf, die eingefahren sind, und weiß, welche acht '
         + 'nicht mehr aufstehen. Er weiß, wer den Korb bedient und wer die '
         + 'Zettel schreibt.',
    opener: 'Er sieht dich an und wartet, dass du wieder gehst. Als du das '
          + 'nicht tust, rückt er ein Stück zur Seite, damit Platz auf der '
          + 'Matratze ist. Gesagt hat er noch nichts.',
    spuren: [
      {
        id: 'f2-marek-schicht',
        wenn: { clue: 'f2-drei-fenster' },
        clue: 'f2-nachtarbeit',
        was: 'Du hast nach der Stilllegung weitergearbeitet. Nachts, zu sechst '
           + 'bis neunt, ohne Papier und ohne Lohn — für Essen und dafür, dass '
           + 'niemand fragt, warum du noch atmest.',
        notiz: 'Nach der Stilllegung wurde nachts weitergearbeitet — ohne Papier, ohne Lohn.',
      },
      {
        id: 'f2-marek-kranke',
        wenn: { clue: 'f2-einer-weniger' },
        clue: 'f2-die-kranken',
        was: 'Wer zu lange unten war, wird nicht krank wie andere. Er wird '
           + 'still, dann wird er langsam, dann summt er. Die holt der '
           + 'Lieferwagen, und sie kommen in die Baracke am Ende der Zeile. '
           + 'Zurück kommt keiner.',
        notiz: 'Wer zu lange unten war, kommt in die Baracke am Ende der Zeile.',
      },
      {
        id: 'f2-marek-graben',
        wenn: { clue: 'f2-schacht' },
        clue: 'f2-gegraben',
        was: 'Ihr habt nicht gepumpt und nichts geklärt. Ihr habt gegraben, '
           + 'vierzehn Monate lang, immer tiefer, und als ihr angekommen wart, '
           + 'habt ihr nicht mehr gegraben. Ihr musstet unten stehen und singen. '
           + 'Einen Ton, so lange es ging. Weil es antwortet.',
        notiz: 'Die Schicht hat einen Schacht gegraben — und am Ende unten gesungen, weil es antwortet.',
      },
      {
        id: 'f2-marek-abstieg',
        wenn: { clue: 'f2-der-fund' },
        clue: 'f2-augenzeuge',
        was: 'In jener Nacht war einer dabei, der nicht zu euch gehörte. Kein '
           + 'Werksmann, saubere Hände, ein Fremder. Sie haben ihn '
           + 'hinuntergefahren, während ihr oben warten musstet. Er ist lebend '
           + 'eingestiegen. Auf dem Eis lag er erst danach.',
        notiz: 'Marek hat gesehen, wie in der Todesnacht ein Fremder lebend eingefahren wurde.',
      },
    ],
  },

  'f2-pfoertnerin': {
    id: 'f2-pfoertnerin',
    name: 'Roswita Kiel',
    role: 'Wache · Werksbüro',
    portrait: 'details/f2-pfoertnerin.jpg',
    appearance: 'Im Mantel in einem geheizten Raum, den Rücken zur Tür, den '
              + 'Blick in die dunkle Halle.',
    voice: 'knapp, unfreundlich aus Gewohnheit, nicht aus Feindseligkeit; '
         + 'antwortet in Dienstvorschriften, wenn sie ausweichen will',
    secret: 'Sie hat vierzehn Monate lang die Nachtschichten kommen und gehen '
          + 'sehen, den zweiten Becher jedes Mal weggeräumt und nie gefragt, '
          + 'weil sie die Einzige ist, die hier noch bezahlt wird. In der '
          + 'Todesnacht ist das Flutlicht kurz vor fünf aus- und wieder '
          + 'angegangen — das passiert nur, wenn unten jemand die Winde nimmt.',
    knows: 'Sie weiß, wer die drei ersetzten Blätter ins Schichtbuch gelegt '
         + 'hat, weil sie ihm den Stift gereicht hat.',
    opener: 'Sie dreht sich nicht um. „Das Werk ist geschlossen", sagt sie in '
          + 'die Halle hinaus. „Seit vier Monaten. Steht am Tor."',
    spuren: [
      {
        id: 'f2-kiel-becher',
        wenn: { clue: 'f2-zwei-becher' },
        clue: 'f2-nicht-allein',
        was: 'Du bist hier nie allein. Jede Nacht kommt einer, trinkt einen '
           + 'Becher und geht wieder in die Halle. Du räumst den Becher weg, '
           + 'bevor der Tag anfängt.',
        notiz: 'Jede Nacht kommt jemand ins Büro, trinkt und geht in die Halle.',
      },
      {
        id: 'f2-kiel-stift',
        wenn: { clue: 'f2-zweite-schicht' },
        clue: 'f2-wer-schrieb',
        was: 'Die drei neuen Blätter im Schichtbuch hat der Werksvorsteher '
           + 'eingelegt. Du hast ihm den Stift gereicht und nicht gefragt.',
        notiz: 'Der Werksvorsteher hat die drei Blätter selbst ins Schichtbuch gelegt.',
      },
      {
        id: 'f2-kiel-nacht',
        wenn: { clue: 'f2-elf-naechte' },
        clue: 'f2-vier-uhr-einundvierzig',
        was: 'In jener Nacht ist das Flutlicht kurz vor fünf ausgegangen und '
           + 'gleich wieder an. Das passiert nur, wenn unten jemand die Winde '
           + 'nimmt — die zieht so viel, dass der Mast einbricht. Zweimal in '
           + 'dieser Nacht. Einmal hinunter, einmal herauf.',
        notiz: 'In der Todesnacht brach das Flutlicht zweimal ein: die Winde lief zweimal.',
      },
    ],
  },

  'f2-technikerin': {
    id: 'f2-technikerin',
    name: 'Bea Ohlert',
    role: 'Spurensicherung',
    portrait: 'details/f2-technikerin.jpg',
    appearance: 'Handschuhe, Stirnlampe hochgeschoben, arbeitet im Stehen und '
              + 'sieht beim Reden nicht auf.',
    voice: 'sachlich, schnell, mit einem trockenen Humor, der nur ihr selbst '
         + 'gilt; sagt lieber „noch nicht" als „nein"',
    secret: 'Ihr Abgleich hat einen Treffer ergeben, den sie nicht melden '
          + 'darf: Die Abdrücke am Beckenrand gehören einem Mann, der seit '
          + 'über einem Jahr als tot geführt wird. Und ihre Anfrage nach dem '
          + 'unbekannten Staub ist binnen einer Stunde beantwortet worden — '
          + 'von einem Haus, das mit Material nichts zu tun hat.',
    knows: 'Sie weiß, dass ein Treffer auf einen Toten das Verfahren beendet, '
         + 'bevor es anfängt — und wem das gelegen kommt.',
    opener: 'Sie hört dich kommen und schiebt dir mit dem Ellbogen einen '
          + 'Kaffeebecher hin, ohne aufzusehen. „Fassen Sie nichts an, was auf '
          + 'dem Tablett liegt."',
    spuren: [
      {
        id: 'f2-ohlert-abdruck',
        wenn: { clue: 'f2-zeuge-gefunden' },
        clue: 'f2-abgleich',
        was: 'Der Abgleich hat getroffen. Die Abdrücke am Beckenrand gehören '
           + 'einem Mann, der seit über einem Jahr amtlich tot ist. Du hast den '
           + 'Treffer nicht gemeldet, weil er das Verfahren beendet hätte.',
        notiz: 'Die Abdrücke am Beckenrand gehören einem amtlich Toten. Treffer nicht gemeldet.',
      },
      {
        id: 'f2-ohlert-anfrage',
        wenn: { clue: 'f2-staub-waechst' },
        clue: 'f2-anfrage-abgefangen',
        was: 'Du hast den Staub an die Zentralsammlung gemeldet, weil es keinen '
           + 'Katalogeintrag gibt. Geantwortet hat nach vierzig Minuten nicht '
           + 'die Sammlung, sondern das Kuratorium für Tiefbau und Vorsorge — '
           + 'mit der Anweisung, die Probe dorthin abzugeben und den Vorgang zu '
           + 'schließen.',
        notiz: 'Die Staubanfrage beantwortete das Kuratorium, nicht die Sammlung — mit Abgabeanweisung.',
      },
    ],
  },

  'f2-vorsteher': {
    id: 'f2-vorsteher',
    name: 'Konrad Selb',
    role: 'Werksvorsteher',
    portrait: 'details/f2-vorsteher.jpg',
    appearance: 'Mütze neben dem Becher, Rücken halb zur Tür, sieht in den '
              + 'verschneiten Hof. Große Hände, sehr ruhig.',
    voice: 'freundlich und langsam, duzt ungefragt, erzählt Anekdoten statt zu '
         + 'antworten; wird nie laut und weicht nie sichtbar aus',
    secret: 'Er hat die zweite Schicht geführt, die Portionen gezählt, die '
          + 'Blätter im Buch ersetzt und in der Todesnacht den Fremden selbst '
          + 'zum Korb gebracht — auf einen getippten Laufzettel hin, den er '
          + 'nicht lesen durfte und trotzdem gelesen hat. Er hält sich nicht '
          + 'für einen Mörder, sondern für den Mann, der acht Leuten das Essen '
          + 'organisiert hat, die es sonst nicht mehr gäbe.',
    knows: 'Er weiß, wer die Zettel schreibt, wie oft eingefahren wird und wie '
         + 'lange die Männer unten bleiben dürfen. Er hat den Kanister selbst '
         + 'hergeschleppt und jede Nacht mitgezählt.',
    opener: 'Er nickt in Richtung des Stuhls gegenüber, ohne sich umzudrehen. '
          + '„Setzen Sie sich, es zieht an der Tür." Dann erst sieht er dich an.',
    spuren: [
      {
        id: 'f2-selb-schicht',
        wenn: { clue: 'f2-neun-mann' },
        clue: 'f2-eingeraeumt',
        was: 'Du hast die zweite Schicht geführt und am Laufen gehalten — für '
           + 'Männer, die es amtlich nicht gibt, damit sie nicht ganz '
           + 'verschwinden. Neun in jener Nacht. Du hältst das bis heute für '
           + 'richtig.',
        notiz: 'Selb räumt die zweite Schicht ein: neun Mann in der Todesnacht.',
      },
      {
        id: 'f2-selb-auftrag',
        wenn: { clue: 'f2-gegraben' },
        clue: 'f2-auftrag-von-oben',
        was: 'Der Schacht war nicht deine Idee. Das Werk ist nicht stillgelegt '
           + 'worden, weil es sich nicht mehr rechnet, sondern damit es leer '
           + 'ist. Den Auftrag hat ein Haus erteilt, dem das Werk nicht gehört, '
           + 'und bezahlt wird über eine Kostenstelle, die du nie gesehen hast.',
        notiz: 'Das Werk wurde stillgelegt, damit gegraben werden kann — im Auftrag von außen.',
      },
      {
        id: 'f2-selb-hand',
        wenn: { clue: 'f2-freigabe' },
        clue: 'f2-selb-gestand',
        was: 'Du hast ihn hinuntergebracht. Er hatte sich schon zweimal '
           + 'hereingeschlichen, und diesmal habt ihr ihn erwischt, und dann kam '
           + 'der Zettel. Du hast ihn gelesen, obwohl du nicht solltest, und du '
           + 'hast ihn trotzdem in den Korb gestellt. Du hast geglaubt, er kommt '
           + 'wieder herauf.',
        notiz: 'Selb hat den Wärter selbst zum Korb gebracht — auf einen getippten Laufzettel hin.',
      },
    ],
  },

  /* --- Das Pegelnetz ---------------------------------------------------- */
  'f2-waerterin': {
    id: 'f2-waerterin',
    name: 'Almut Reiff',
    role: 'Pegelnetz · Nachtdienst',
    portrait: 'details/f2-waerterin.jpg',
    appearance: 'Dienstjacke über dem Pullover, die Hände in den Ärmeln, steht '
              + 'am Fenster und sieht auf einen Kanal, auf dem nichts passiert.',
    voice: 'zunächst dienstlich und abweisend, dann übergangslos sehr direkt; '
         + 'sie hat sich die Sätze schon zurechtgelegt, bevor jemand kam',
    secret: 'Sie hat Rube zweimal gedeckt, als er den Aufnahmekanal belegt '
          + 'hat, und sie weiß, dass seine beiden Meldungen nach oben spurlos '
          + 'verschwunden sind. Danach hat er die Bänder nicht mehr in die '
          + 'Station gebracht, sondern draußen versteckt, und sie hat ihm dabei '
          + 'zugesehen, ohne zu fragen wohin.',
    knows: 'Sie weiß, wie ein Wärter peilt, wie lange er dafür sitzt und was '
         + 'es heißt, wenn eine Meldung im Eingangsbuch der Aufsicht fehlt.',
    opener: '„Sie sind wegen Rube da." Sie dreht sich nicht um. „Elf Tage. Ich '
          + 'hab drei Mal angerufen. Beim vierten Mal haben sie mir gesagt, ich '
          + 'soll mich um meinen Pegel kümmern."',
    spuren: [
      {
        id: 'f2-reiff-meldung',
        wenn: { clue: 'f2-elf-naechte' },
        clue: 'f2-meldung-verschwand',
        was: 'Er hat die Sache zweimal ordentlich gemeldet, mit Nummer und '
           + 'Uhrzeit. Beide Meldungen sind im Eingangsbuch der Aufsicht nicht '
           + 'vorhanden. Beim zweiten Mal ist zwei Tage später jemand '
           + 'hergekommen, der nicht wissen wollte, was auf dem Band liegt, '
           + 'sondern wer es außer ihm noch gehört hat.',
        notiz: 'Rubes zwei Meldungen verschwanden. Danach fragte ein Besucher, wer sonst mitgehört hat.',
      },
      {
        id: 'f2-reiff-versteck',
        wenn: { clue: 'f2-peilung' },
        clue: 'f2-er-hat-versteckt',
        was: 'Ab da hat er die Bänder nicht mehr in den Spind gelegt. Er ist '
           + 'jedes Mal mit der Schachtel unter dem Arm aufs Dach gestiegen und '
           + 'ohne sie wieder heruntergekommen. Du hast nie gefragt, wohin — '
           + 'aber es gibt da oben nur eine Stelle, die zugeht.',
        notiz: 'Rube hat seine Bänder oben auf dem Dach versteckt, nicht im Spind.',
      },
    ],
  },

  /* --- Das Praesidium --------------------------------------------------- */
  'f2-pathologe': {
    id: 'f2-pathologe',
    name: 'Gerulf Manns',
    role: 'Leichenhalle · Präsidium',
    portrait: 'details/f2-pathologe.jpg',
    appearance: 'Alt, sehr aufrecht, ohne Handschuhe, die Hände auf dem '
              + 'Rücken. Er sieht das offene Fach an, nicht dich.',
    voice: 'präzise und altmodisch höflich, benutzt lieber ein Fachwort als '
         + 'eine Umschreibung; wenn ihn etwas beunruhigt, wird er langsamer',
    secret: 'Der Mann ist erstickt, und zwar an etwas, das er eingeatmet hat '
          + 'und das in ihm weiterwächst. Manns hat im vorigen Winter elf '
          + 'Befunde unterschrieben, zu denen ihm nie eine Leiche vorgelegt '
          + 'wurde, und diesmal ist zum ersten Mal eine da.',
    knows: 'Er kennt jede Kostenstelle, die je auf einem Totenschein dieser '
         + 'Stadt gestanden hat, und er weiß, welche davon nicht zum Meldeamt '
         + 'gehört.',
    opener: 'Er schiebt das Fach eine Handbreit weiter auf, ohne sich '
          + 'umzudrehen. „Sehen Sie sich das an und sagen Sie mir, was Sie '
          + 'sehen. Ich möchte wissen, ob es an mir liegt."',
    spuren: [
      {
        id: 'f2-manns-befund',
        wenn: { clue: 'f2-staub' },
        clue: 'f2-erstickt',
        was: 'Er ist erstickt, nicht ertrunken und nicht erfroren. Was in ihm '
           + 'sitzt, sitzt bis in die feinsten Verzweigungen, und es hat sich '
           + 'seit der Einlieferung ausgebreitet. In einem Toten breitet sich '
           + 'nichts mehr aus. Dieses schon.',
        notiz: 'Todesursache Ersticken. Das Eingeatmete breitet sich in der Leiche weiter aus.',
      },
      {
        id: 'f2-manns-elf',
        wenn: { clue: 'f2-kostenstelle' },
        clue: 'f2-manns-schweigen',
        was: 'Die Kostenstelle kennst du. Sie stand im vorigen Winter auf elf '
           + 'Totenscheinen, die du unterschrieben hast, ohne dass dir je einer '
           + 'der elf vorgelegt worden wäre. Du hast unterschrieben, weil man '
           + 'in deinem Alter noch drei Jahre bis zur Pension hat.',
        notiz: 'Manns hat elf Totenscheine ohne Leichen unterschrieben — dieselbe Kostenstelle.',
      },
    ],
  },

  /* --- Unter dem Werk --------------------------------------------------- */
  'f2-steiger': {
    id: 'f2-steiger',
    name: 'Wendel Tross',
    role: 'Steiger · Schachtkopf',
    portrait: 'details/f2-steiger.jpg',
    appearance: 'Grubenjacke, Lampe am Gürtel, die Hand am Hebel der Winde, '
              + 'obwohl nichts fährt. Er sieht dich an wie einen Wetterumschlag.',
    voice: 'wortkarg, im Bergmannston, sagt „Seil", „Teufe", „Fahrt", als wären '
         + 'das die einzigen Wörter, die zählen; er lügt nicht, er lässt weg',
    secret: 'Er hat vierzehn Monate lang Männer eingefahren, für die es keine '
          + 'Papiere gab, und er hat die Zeiten unten mitgeschrieben, weil ein '
          + 'Steiger das tut. In der Todesnacht hat er einen zehnten gefahren, '
          + 'der nicht auf der Liste stand, und er ist zweimal gefahren: einmal '
          + 'hinunter mit ihm, einmal herauf ohne ihn.',
    knows: 'Er weiß, wie lange jeder Mann unten war, weil er auf die Uhr '
         + 'geschaut hat, und er weiß, dass die erlaubte Zeit dreimal '
         + 'heraufgesetzt worden ist.',
    opener: 'Er nimmt die Hand nicht vom Hebel. „Sie fahren nicht ein. Nicht '
          + 'mit den Schuhen, nicht mit dem Mantel und nicht ohne mich."',
    spuren: [
      {
        id: 'f2-tross-korb',
        wenn: { clue: 'f2-fahrt' },
        clue: 'f2-abgestiegen',
        was: 'Jede Nacht sechs bis neun Mann, hinunter und nach einer '
           + 'festgesetzten Zeit wieder herauf. Die Zeit stand auf einem Zettel, '
           + 'und sie ist dreimal heraufgesetzt worden. Beim dritten Mal hast du '
           + 'gesagt, das hält keiner aus. Geändert hat es nichts.',
        notiz: 'Sechs bis neun Mann je Nacht, mit festgesetzter Zeit unten — dreimal heraufgesetzt.',
      },
      {
        id: 'f2-tross-fremder',
        wenn: { clue: 'f2-vier-uhr-einundvierzig' },
        clue: 'f2-fremder-abstieg',
        was: 'In jener Nacht bist du zweimal gefahren. Der zehnte stand nicht '
           + 'auf der Liste, hatte keine Marke und kein Zeug, und der Vorsteher '
           + 'hatte einen getippten Zettel in der Hand. Hinunter zu zweit, '
           + 'herauf allein.',
        notiz: 'Tross fuhr in der Todesnacht einen zehnten, nicht gelisteten Mann ein — und kam allein herauf.',
      },
    ],
  },

  /* --- Das Kuratorium --------------------------------------------------- */
  'f2-adjutant': {
    id: 'f2-adjutant',
    name: 'Halvar Prasch',
    role: 'Vorzimmer · Kuratorium',
    portrait: 'details/f2-adjutant.jpg',
    appearance: 'Anzug, der besser ist als der Raum, eine Mappe unter dem Arm, '
              + 'steht neben dem Schreibtisch statt dahinter.',
    voice: 'sehr höflich, sehr schnell, spricht in fertigen Formulierungen; je '
         + 'unangenehmer die Frage, desto vollständiger der Satz',
    secret: 'Er tippt seit vierzehn Monaten Laufzettel, die er nicht versteht, '
          + 'und legt sie zur Unterschrift vor. Er hat auch den getippt, mit '
          + 'dem in der Todesnacht ein Abstieg freigegeben wurde, und er hat '
          + 'die Nummer darauf nachgeschlagen, weil ihm die Formulierung '
          + 'aufgefallen ist.',
    knows: 'Er weiß, wo die entnommene Tiefbauakte liegt, wer den Schlüssel '
         + 'zum neuen Schloss hat und in welchen Nächten der Kurator das Haus '
         + 'verlässt.',
    opener: '„Sie haben keinen Termin." Er sagt es freundlich und stellt sich '
          + 'dabei so, dass er zwischen dir und der Flügeltür steht. „Ich kann '
          + 'Ihnen einen geben. In vierzehn Tagen."',
    spuren: [
      {
        id: 'f2-prasch-akte',
        wenn: { clue: 'f2-vitrine' },
        clue: 'f2-vierzehn-monate',
        was: 'Die Tiefbauakte Sektor 11 ist nie zurückgegangen. Sie liegt im '
           + 'Haus, im vierten Schub mit dem neuen Schloss, und in kein '
           + 'Register eingetragen. Der Bohrkern in der Vitrine kam am selben '
           + 'Tag wie die Akte.',
        notiz: 'Die entnommene Tiefbauakte liegt im Haus, unregistriert, hinter einem neuen Schloss.',
      },
      {
        id: 'f2-prasch-kuerzel',
        wenn: { clue: 'f2-freigabe' },
        clue: 'f2-kuerzel',
        was: 'Den Zettel hast du getippt. Das Kürzel darunter ist das des '
           + 'Kurators, und er hat es selbst gesetzt, im Stehen, ohne sich zu '
           + 'setzen. Du hast die Nummer nachgeschlagen, weil dir „Proband" bei '
           + 'einem lebenden Menschen aufgefallen ist.',
        notiz: 'Prasch tippte die Freigabe; das Kürzel setzte der Kurator selbst.',
      },
    ],
  },

  'f2-kurator': {
    id: 'f2-kurator',
    name: 'Severin Kolp',
    role: 'Kurator für Tiefbau und Vorsorge',
    portrait: 'details/f2-kurator.jpg',
    appearance: 'Am Panoramafenster, die Hände auf dem Rücken, sehr gerade. '
              + 'Ein Mann, der seit vierzehn Monaten wenig schläft und es sich '
              + 'nicht ansehen lässt.',
    voice: 'ruhig, gebildet, ohne jede Drohung; er argumentiert, statt '
         + 'auszuweichen, und wird nur dann scharf, wenn jemand die Sache klein '
         + 'macht',
    secret: 'Er hat den Fund vor vierzehn Monaten gesehen und sofort begriffen, '
          + 'was er ist. Er hat das Werk stilllegen lassen, um zu graben, hat '
          + 'die amtlich Toten aus dem Programm des vorigen Winters als '
          + 'Versuchsreihe verwendet und in der Todesnacht schriftlich '
          + 'freigegeben, dass der Wärter lebend eingefahren wird — als erster '
          + 'registrierter Proband. Er hält das nicht für Mord, sondern für '
          + 'den Preis dafür, dass diese Stadt es zuerst versteht und nicht '
          + 'irgendwer anders.',
    knows: 'Alles. Er hat jeden Laufzettel gezeichnet, jede Expositionszeit '
         + 'selbst heraufgesetzt und hört sich abends die Bänder an.',
    opener: 'Er dreht sich erst um, als du zwei Schritte im Raum bist, und '
          + 'stellt die Bandmaschine leiser statt aus. „Sie sind schneller '
          + 'gewesen, als ich gerechnet habe. Setzen Sie sich. Ich erkläre es '
          + 'Ihnen lieber selbst."',
    spuren: [
      {
        id: 'f2-kolp-fund',
        wenn: { clue: 'f2-der-fund' },
        clue: 'f2-kolp-bekennt',
        was: 'Ja, es ist da unten, und ja, du weißt seit vierzehn Monaten davon. '
           + 'Es ist nicht gewachsen, nicht abgelagert und nicht von hier. Es '
           + 'ist das Wichtigste, was dieser Stadt je passiert ist, und sie darf '
           + 'es nicht erfahren, bevor du weißt, was es tut.',
        notiz: 'Kolp bekennt sich zum Fund und dazu, dass er seit vierzehn Monaten davon weiß.',
      },
      {
        id: 'f2-kolp-reihe',
        wenn: { clue: 'f2-gemessen' },
        clue: 'f2-kolp-reihe-clue',
        was: 'Die Reihe war deine Anordnung. Nur mit Menschen, die amtlich '
           + 'nicht mehr existieren, war sie zu führen — ein Toter kann nicht '
           + 'noch einmal sterben, und niemand meldet ihn ab. Du nennst das '
           + 'nicht Grausamkeit, sondern die einzige Form, in der es überhaupt '
           + 'zu ertragen ist.',
        notiz: 'Kolp hat die Versuchsreihe an amtlich Toten angeordnet.',
      },
      {
        id: 'f2-kolp-freigabe',
        wenn: { clue: 'f2-augenzeuge' },
        clue: 'f2-kolp-unterschrift',
        was: 'Die Freigabe für die letzte Nacht hast du gezeichnet. Die Reihe '
           + 'gab nichts mehr her, weil alle darin schon tot waren, bevor sie '
           + 'anfing — du brauchtest einen Lebenden, Registrierten, Gesunden. '
           + 'Der Mann hat sich selbst angeboten, indem er dreimal eingestiegen '
           + 'ist. Und du würdest es wieder zeichnen.',
        notiz: 'Kolp hat die Freigabe für den Abstieg des Wärters selbst gezeichnet.',
      },
    ],
  },
};
