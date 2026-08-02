/**
 * FALL 1 — die Figuren, mit denen man sprechen kann.
 *
 * Reine Falldaten. Wie mit ihnen geredet wird, steht in src/game/characters.js;
 * hier steht nur, WER sie sind.
 *
 * Jede Figur hat ein Geheimnis, das NICHT die Tat ist. Das ist der Kniff,
 * damit ein Verhoer mehr wird als Ja/Nein: Wer etwas zu verbergen hat, weicht
 * aus, auch wenn er unschuldig ist. Der Ermittler kann daran nicht ablesen,
 * wer der Taeter ist — nur, dass jemand nervoes wird.
 *
 * Die einzige Ausnahme ist die letzte Figur: Bei ihr IST das Geheimnis die
 * Tat, und genau deshalb gibt sie nichts preis.
 */

export const FIGUREN = {
  'p-umbrella': {
    id: 'p-umbrella',
    name: 'Kess Aldemir',
    role: 'Straßenhändlerin',
    portrait: 'details/schirm.jpg',
    appearance: 'Regenmantel aus Werbeplane, Finger voller Ringe, ein Schirm, '
              + 'der zu gut ist für diese Gasse.',
    voice: 'spöttisch, redet schnell, weicht aus, stellt Gegenfragen',
    secret: 'Sie hat eine Schluesselkarte kopiert und weiterverkauft — an '
            + 'jemanden, der nachts kam und bar bezahlt hat.',
    knows: 'Sie steht seit Stunden hier und hat gesehen, wer durch die '
           + 'Stahltuer im hinteren Abschnitt gegangen ist.',
    opener: 'Sie sieht dich kommen, lange bevor du bei ihr bist, und dreht sich '
          + 'nicht weg. Der Regen läuft in Fäden vom Schirmrand.',

    spuren: [
      {
        id: 'kess-karte',
        wenn: { item: 'keycard' },
        clue: 'karte-kopiert',
        was: 'Du hast die Schlüsselkarte kopiert und weiterverkauft — an jemanden, '
           + 'der nachts kam und bar bezahlt hat.',
        notiz: 'Die Schlüsselkarte wurde kopiert und verkauft. Käufer kam nachts, zahlte bar.',
      },
      {
        id: 'kess-tuer',
        wenn: { clue: 'karte-kopiert' },
        clue: 'gesicht-an-der-tuer',
        was: 'Du hast gesehen, wer durch die Stahltür ging: eine Frau im dunklen '
           + 'Anzug, ohne Schirm, die nicht hierhergehörte.',
        notiz: 'Eine Frau im dunklen Anzug ging durch die Stahltür — ohne Schirm, im Regen.',
      },
    ],
  },

  'p-coat': {
    id: 'p-coat',
    name: 'Doran Vey',
    role: 'Barbesitzer',
    portrait: 'details/mantel.jpg',
    appearance: 'Verbrannte linke Hand, ruhige Augen, ein Mantel, der bis zu '
              + 'den Schultern durchnässt ist.',
    voice: 'höflich, langsam, misst jedes Wort, wird nie laut',
    secret: 'Er nimmt Ware an, nach der niemand fragen soll. Die Frachtkisten in '
            + 'der Gasse gehoeren ihm.',
    knows: 'Er weiß, dass der Marktstand seit zwei Tagen unbesetzt ist und dass '
         + 'der Händler nicht freiwillig weggeblieben ist.',
    opener: 'Er steht im Regen, als wäre das eine Verabredung. Als du näher '
          + 'kommst, sieht er dich an und wartet ab, wer zuerst spricht.',

    spuren: [
      {
        id: 'vey-kisten',
        wenn: { clue: 'zollsiegel' },
        clue: 'kisten-gehoeren-vey',
        was: 'Die Frachtkisten in der Gasse gehören dir. Du nimmst Ware an, nach '
           + 'der niemand fragen soll.',
        notiz: 'Doran Vey nimmt Ware an, nach der niemand fragt. Die Kisten gehören ihm.',
      },
      {
        id: 'vey-auftrag',
        wenn: { clue: 'kisten-gehoeren-vey' },
        clue: 'leere-kisten',
        was: 'Die letzten drei Lieferungen waren leer. Bezahlt wurde trotzdem — '
           + 'es ging nie um Ware, sondern um den Papierweg.',
        notiz: 'Die letzten drei Kisten waren leer. Bezahlt wurde trotzdem.',
      },
    ],
  },

  'p-wirtin': {
    id: 'p-wirtin',
    name: 'Vesna Kruse',
    role: 'Wirtin',
    portrait: 'details/wirtin.jpg',
    appearance: 'Ärmelloses Schwarz, Unterarme auf dem Zink, ein Blick, der '
              + 'schon oft befragt wurde und es nie mochte.',
    voice: 'kurz angebunden, trocken, antwortet mit Gegenfragen, nie unhöflich',
    secret: 'Sie ist dafür bezahlt worden zu vergessen, wer in der hinteren '
          + 'Nische saß. Das Geld liegt noch unangerührt da.',
    knows: 'Sie hat gesehen, wer vorgestern in Eile durch die Hintertür ist — '
         + 'jemand, der offiziell seit über einem Jahr tot ist.',
    opener: 'Sie füllt nichts nach und wischt nichts weg. Sie sieht dich den '
          + 'ganzen Weg vom Eingang bis zum Tresen an und sagt nichts.',

    spuren: [
      {
        id: 'kruse-geld',
        wenn: { clue: 'nasse-bank' },
        clue: 'bezahltes-vergessen',
        was: 'Du bist dafür bezahlt worden zu vergessen, wer in der hinteren '
           + 'Nische saß. Das Geld liegt noch unangerührt unter der Kasse.',
        notiz: 'Vesna Kruse wurde bezahlt, um zu vergessen, wer in der Nische saß.',
      },
      {
        id: 'kruse-toter',
        wenn: { clue: 'blut-fremd' },
        clue: 'toter-geht-um',
        was: 'Der Mann, der vorgestern durch die Hintertür ist, ist seit über '
           + 'einem Jahr amtlich tot. Du kennst sein Gesicht von früher.',
        notiz: 'Ein seit einem Jahr amtlich Toter ging vorgestern durch die Hintertür.',
      },
    ],
  },

  // Sitzt hinter dem Panzerglas im Praesidium. Derselbe Punkt ist auch der
  // Laborschalter — die Tafel zeigt dann beides: Ansprechen und Abgeben.
  'lab-counter': {
    id: 'lab-counter',
    name: 'Halina Ferz',
    role: 'Laborantin',
    portrait: 'details/laborantin.jpg',
    appearance: 'Abgetragener Kittel hinter zerkratztem Panzerglas, halb '
              + 'abgewandt. Sie sieht nicht auf, wenn sie spricht.',
    voice: 'sachlich bis zur Unhöflichkeit, redet in Befunden, keine Floskeln',
    secret: 'Ihr wurde untersagt, bestimmte Melderegister-Eintraege '
            + 'gegenzupruefen. Sie hat es einmal trotzdem getan und hat seitdem '
            + 'Angst.',
    knows: 'Sie weiß, dass in diesem Sektor seit vierzehn Monaten Tote gemeldet '
         + 'werden, deren Akten danach nie wieder angefasst wurden.',
    opener: 'Die Klappe bleibt zu. Sie arbeitet weiter, als hätte sie dich nicht '
          + 'bemerkt, und redet in Richtung ihrer Hände.',

    spuren: [
      {
        id: 'ferz-verbot',
        wenn: { clue: 'blut-fremd' },
        clue: 'gegenprobe-verboten',
        was: 'Dir wurde untersagt, Melderegister-Einträge gegenzuprüfen. Einmal '
           + 'hast du es trotzdem getan, und seitdem hast du Angst.',
        notiz: 'Der Laborantin wurde untersagt, Melderegister-Einträge gegenzuprüfen.',
      },
      {
        id: 'ferz-vierzehn',
        wenn: { clue: 'gegenprobe-verboten' },
        clue: 'vierzehn-monate',
        was: 'Seit vierzehn Monaten werden in diesem Sektor Tote gemeldet, deren '
           + 'Akten danach nie wieder angefasst wurden.',
        notiz: 'Seit vierzehn Monaten Tote, deren Akten nie wieder angefasst wurden.',
      },
    ],
  },

  'p-empfang': {
    id: 'p-empfang',
    name: 'Nadja Ferrin',
    role: 'Empfangsleitung',
    portrait: 'details/empfang.jpg',
    appearance: 'Dunkle Uniformjacke, beide Hände flach auf dem Stein, ein '
              + 'Gesicht, das nichts hergibt und darin sehr gut ist.',
    voice: 'höflich bis zur Kälte, spricht in fertigen Sätzen, sagt nie „ich '
         + 'weiß nicht", sondern „dazu kann ich Ihnen nichts sagen"',
    secret: 'Sie führt seit einem Jahr eine eigene Liste — jeden, der hier '
          + 'hereinkommt, ohne eingetragen zu werden. Nicht aus Gewissen, '
          + 'sondern weil ihr einmal etwas angehängt wurde, das sie nicht '
          + 'getan hat.',
    knows: 'Die Person, deren Nummer auf der Patientenkarte steht, ist in den '
         + 'letzten zwei Wochen zweimal durch diese Halle gegangen — nach dem '
         + 'Datum, an dem sie für tot erklärt wurde.',
    opener: 'Sie sieht dich schon an, bevor du auf halber Höhe der Halle bist. '
          + 'Sie sagt nichts, sie wartet nur — als wäre Warten hier eine Form '
          + 'von Höflichkeit.',

    spuren: [
      {
        id: 'ferrin-liste',
        wenn: { clue: 'register-luecke' },
        clue: 'zweite-liste',
        was: 'Du führst seit einem Jahr eine eigene Liste: jeden, der hier '
           + 'hereinkommt, ohne eingetragen zu werden.',
        notiz: 'Die Empfangsleitung führt eine eigene Liste der nicht eingetragenen Besucher.',
      },
      {
        id: 'ferrin-zweimal',
        wenn: { clue: 'zweite-liste' },
        clue: 'tote-gehen-hier-ein',
        was: 'Die Person, deren Nummer auf der Patientenkarte steht, ist in zwei '
           + 'Wochen zweimal durch diese Halle gegangen — nach ihrem Todesdatum.',
        notiz: 'Die Person von der Patientenkarte ging nach ihrem Todesdatum zweimal hier durch.',
      },
    ],
  },

  'p-sachbearbeiter': {
    id: 'p-sachbearbeiter',
    name: 'Anselm Roth',
    role: 'Sachbearbeiter · Meldewesen',
    portrait: 'details/sachbearbeiter.jpg',
    appearance: 'Grauer Strickpullover hinter Glas, Schreiblampe tief gezogen, '
              + 'ein Stempel griffbereit neben der rechten Hand.',
    voice: 'umständlich höflich, redet in Vorschriften und Aktenzeichen, '
         + 'wiederholt Fragen, bevor er antwortet, um Zeit zu gewinnen',
    secret: 'Er hat die elf Totenscheine unterschrieben, ohne je eine Leiche '
          + 'gesehen zu haben. Nicht aus Gier — man hat ihm eine Akte über '
          + 'seine Tochter gezeigt und sie danach nie wieder erwähnt.',
    knows: 'Er kennt den Namen der Person, die ihm die Vorgänge bringt — jemand '
         + 'aus dem Konzern, immer nachts, immer allein.',
    opener: 'Er sieht auf, den Stift noch in der Hand, und legt ihn dann sehr '
          + 'genau parallel zur Kante des Papiers. Erst danach sagt er etwas.',

    spuren: [
      {
        id: 'roth-blanko',
        wenn: { clue: 'ohne-leiche' },
        clue: 'roth-gestand',
        was: 'Du hast elf Totenscheine unterschrieben, ohne je eine Leiche '
           + 'gesehen zu haben. Man hat dir eine Akte über deine Tochter gezeigt.',
        notiz: 'Anselm Roth unterschrieb elf Totenscheine ohne Leiche — unter Druck.',
      },
      {
        id: 'roth-name',
        wenn: { clue: 'roth-gestand' },
        clue: 'nachtbesuch',
        was: 'Die Vorgänge bringt dir jemand aus dem Konzern. Immer nachts, '
           + 'immer allein, immer dieselbe Frau im dunklen Anzug.',
        notiz: 'Die Vorgänge bringt eine Frau im dunklen Anzug — nachts, allein.',
      },
    ],
  },
  // Der Vermisste. Die einzige Figur im Spiel, die nichts verbirgt, weil sie
  // nichts mehr zu verlieren hat — und deshalb die einzige, die zu viel redet.
  'p-haendler': {
    id: 'p-haendler',
    name: 'Emil Bracke',
    role: 'Marktstandbetreiber · seit zwei Tagen vermisst',
    portrait: 'details/haendler.jpg',
    appearance: 'Drei Mäntel übereinander, aufgesprungene Lippen, beide Hände '
              + 'um einen Becher, der längst kalt ist.',
    voice: 'leise und zu schnell, springt mitten im Satz zum nächsten, '
         + 'entschuldigt sich für Dinge, für die sich niemand entschuldigen muss',
    secret: 'Er ist nicht verschleppt worden. Er ist selbst hierhergegangen und '
          + 'hat sich einschließen lassen — bezahlt hat er mit der Ware aus '
          + 'jemand den Frachtbrief oder die Lücke im Palettenstapel vorhält.',
    knows: 'Er kennt den Namen der Person, unter deren Aufsicht seine eigene '
         + 'Sterbeurkunde vorbereitet wird: Iris Malaunt, Bestandsführung, '
         + 'jemand sagt, dass es zu keinem der elf Fälle je eine Leiche gab.',
    opener: 'Er sieht dich durch die beschlagene Scheibe und steht nicht auf. '
          + 'Er wischt nur mit dem Ärmel eine Stelle frei, damit ihr euch '
          + 'ansehen könnt, und wartet, dass du zuerst etwas sagst.',

    spuren: [
      {
        id: 'bracke-freiwillig',
        wenn: { clue: 'frachtbrief' },
        clue: 'freiwillig-verschwunden',
        was: 'Niemand hat dich verschleppt. Du bist selbst hierhergegangen und '
           + 'hast dich einschließen lassen — bezahlt mit Ware aus zwei Kisten.',
        notiz: 'Der Händler ist freiwillig untergetaucht und hat mit fremder Ware bezahlt.',
      },
      {
        id: 'bracke-name',
        wenn: { clue: 'ohne-leiche' },
        clue: 'name-malaunt',
        was: 'Du kennst den Namen, unter dessen Aufsicht deine eigene '
           + 'Sterbeurkunde vorbereitet wird: Iris Malaunt, Bestandsführung.',
        notiz: 'Iris Malaunt, Bestandsführung, lässt die Sterbeurkunden vorbereiten.',
      },
    ],
  },

  // Die letzte Figur. Bei allen anderen ist das Geheimnis NICHT die Tat — hier
  // schon, und genau deshalb gibt sie nichts preis: Sie hat als Einzige etwas
  // zu verlieren und ist als Einzige darin geübt, nichts zu verlieren.
  'p-direktorin': {
    id: 'p-direktorin',
    name: 'Iris Malaunt',
    role: 'Direktorin · Bestandsführung',
    portrait: 'details/direktorin.jpg',
    appearance: 'Dunkler Anzug, kein Schmuck, die Hände locker an den Seiten. '
              + 'Sie steht so, wie andere Leute sitzen.',
    voice: 'ruhig und ausgesucht freundlich, unterbricht nie, beantwortet '
         + 'Fragen mit Gegenfragen, die wie Entgegenkommen klingen, und sagt '
         + '„selbstverständlich", wenn sie nichts sagen will',
    secret: 'Sie führt das Programm: Menschen werden für tot erklärt, aus dem '
          + 'Register genommen und danach weiterverwendet. Sie hält das für '
          + 'Verwaltung, nicht für ein Verbrechen. Sie leugnet nichts und gibt '
          + 'nichts zu. Nur wenn ihr die Unterschriftenmappe UND der lebende '
          + 'Händler zugleich vorgehalten werden, hört sie auf zu lächeln — '
          + 'und auch dann gesteht sie nicht, sondern erklärt.',
    knows: 'Alles. Sie weiß, was in der Akte des Ermittlers steht, bevor er es '
         + 'ausspricht, und sie sagt nie etwas, das ihr schaden könnte. Sie '
         + 'droht nicht; sie bietet an.',
    opener: 'Sie lässt dich die ganze Länge des Raums gehen und sieht dir dabei '
          + 'zu. Als du stehen bleibst, nickt sie einmal, als hättet ihr einen '
          + 'Termin, und sagt deinen Dienstgrad, den du nie genannt hast.',

    spuren: [
      {
        id: 'malaunt-verwaltung',
        wenn: { clue: 'letzte-unterschrift' },
        clue: 'programm-eingeraeumt',
        was: 'Du räumst das Programm ein — aber als Verwaltung, nicht als '
           + 'Verbrechen: Wer aus dem Register fällt, kostet die Stadt nichts mehr.',
        notiz: 'Malaunt räumt das Programm ein und nennt es Verwaltung.',
      },
    ],
  },

  /* --- Figuren, die erst spaeter auftauchen ------------------------------ */

  // Steht seit Jahren an derselben Ecke und hat immer geschwiegen. Sobald der
  // Ermittler weiss, dass jemand Buch fuehrt, faellt ihm ein, dass er das
  // auch tut — auf seine Art.
  'p-kiosk': {
    id: 'p-kiosk',
    name: 'Grigor Anselm',
    role: 'Kioskbetreiber · Querstraße',
    portrait: 'details/kiosk-mann.jpg',
    appearance: 'Sechzig, Strickjacke unter zwei Pullovern, hinter Plexiglas '
              + 'zwischen gestapelter Ware. Er lehnt sich vor und hält dann inne.',
    voice: 'umständlich, redet in Umwegen, entschuldigt sich fürs Reden, '
         + 'kommt aber immer wieder auf denselben Punkt zurück',
    secret: 'Er hat den Wagen notiert, der nachts an der Ecke hält. Immer '
          + 'derselbe, immer dieselbe Uhrzeit, seit vierzehn Monaten.',
    knows: 'Er kennt jedes Gesicht dieser Kreuzung und weiß, welche seit '
         + 'einem Jahr fehlen.',
    opener: 'Er sieht dich schon, als du noch am Zebrastreifen stehst, und '
          + 'schiebt die Klappe einen Spalt auf. Dann wartet er, ob du '
          + 'stehen bleibst.',
    spuren: [
      {
        id: 'kiosk-wagen',
        wenn: { clue: 'zweite-liste' },
        clue: 'nachtwagen',
        was: 'Du hast dir den Wagen notiert, der seit vierzehn Monaten nachts '
           + 'an dieser Ecke hält — immer derselbe, immer dieselbe Uhrzeit.',
        notiz: 'Seit vierzehn Monaten hält nachts derselbe Wagen an der Querstraße.',
      },
      {
        id: 'kiosk-fehlende',
        wenn: { clue: 'nachtwagen' },
        clue: 'fehlende-gesichter',
        was: 'Neun Gesichter von dieser Kreuzung fehlen seit einem Jahr. Du '
           + 'hast nie jemanden gefragt, weil nie jemand gefragt hat.',
        notiz: 'Neun Stammgäste der Kreuzung fehlen seit einem Jahr. Niemand hat gefragt.',
      },
    ],
  },

  // Sitzt in deinem Sessel, sobald du den Namen der Direktorin kennst. Das
  // Spiel sagt dir damit: Sie weiss es auch.
  'p-bote': {
    id: 'p-bote',
    name: 'Unbekannter Mann',
    role: 'Unangemeldeter Besuch',
    portrait: 'details/bote.jpg',
    appearance: 'Vierzig, nasser dunkler Mantel, Unterarme auf den Knien, die '
              + 'Hände locker gefaltet. Er hat den Schirm mit hereingebracht.',
    voice: 'höflich und leise, nennt dich beim Dienstgrad, droht nie — er '
         + 'stellt fest, und das ist schlimmer',
    secret: 'Er ist nicht gekommen, um dich zu warnen. Er ist gekommen, um zu '
          + 'sehen, wie weit du bist, und wird es weitergeben.',
    knows: 'Er kennt den Inhalt deiner Pinnwand, ohne hinzusehen. Er weiß, '
         + 'welche Namen du schon hast und welchen noch nicht.',
    opener: 'Die Tür war zu. Er sitzt trotzdem da, in deinem Sessel, und hat '
          + 'nicht einmal das Licht angemacht. Als du stehen bleibst, sagt er '
          + 'deinen Dienstgrad und wartet.',
    spuren: [
      {
        id: 'bote-auftrag',
        wenn: { clue: 'name-malaunt' },
        clue: 'man-weiss-von-dir',
        was: 'Du bist geschickt worden, um zu sehen, wie weit er ist. Von '
           + 'derselben Etage, aus der die Vorgänge kommen.',
        notiz: 'Der Besuch kam aus der Direktion — man weiß dort, wie weit die Ermittlung ist.',
      },
      {
        id: 'bote-frist',
        wenn: { clue: 'man-weiss-von-dir' },
        clue: 'frist',
        was: 'Die zwölfte Urkunde wird übermorgen unterschrieben. Danach ist '
           + 'der Vorgang abgeschlossen, und niemand fragt mehr nach.',
        notiz: 'Übermorgen wird die zwölfte Urkunde unterschrieben. Danach fragt niemand mehr.',
      },
    ],
  },
};
