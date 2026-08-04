/** Zehn neue Figuren. Die Auslöser ihrer Aussagen stehen ausschließlich in spuren.wenn. */
export const FIGUREN = {
  'f3-analytikerin': {
    id: 'f3-analytikerin', name: 'Nela Arendt', role: 'Zollanalyse · Wolkenhafen',
    portrait: 'details/f2-technikerin.jpg',
    appearance: 'Dunkler Labormantel über Flugplatzkleidung, Schutzbrille im Haar, beide Hände auf dem Probentisch.',
    voice: 'präzise und knapp; korrigiert ungenaue Wörter sofort und wird bei unmöglichen Messwerten auffällig leise',
    secret: 'Sie hat das schwarze Glas vor drei Wochen schon einmal untersucht. Damals kam die Probe aus dem Institut und verschwand mitsamt ihrem Bericht. Sie hat eine Kopie der Messkurve behalten.',
    knows: 'Sie erkennt dieselbe Signatur in Material, Pflanzengewebe und gelöschten neuronalen Mustern.',
    opener: 'Sie schiebt die Schutzbrille hoch. „Wenn das vom Fundort ist, legen Sie es hin. Wenn es Sie schon erkannt hat, gehen Sie zwei Schritte zurück.“',
    spuren: [
      {
        id: 'f3-arendt-material', wenn: { clue: 'f3-nicht-menschlich' }, clue: 'f3-keine-legierung',
        was: 'Das ist keine Legierung und kein Kristall. Es hat keine Korngrenzen, keine Werkzeugspuren und ordnet seine inneren Bahnen neu, sobald jemand den Raum betritt.',
        notiz: 'Das schwarze Glas ist nicht gefertigt und reagiert auf anwesende Menschen.',
      },
      {
        id: 'f3-arendt-kopie', wenn: { clue: 'f3-kliniksignatur' }, clue: 'f3-alte-messung',
        was: 'Dieselbe Kurve lag vor drei Wochen auf deinem Tisch. Absender war das Kontinuitätsinstitut. Der Bericht wurde abgeholt, aber du hast die Rohdaten behalten.',
        notiz: 'Das Institut ließ dieselbe außerirdische Signatur schon vor drei Wochen vermessen.',
      },
    ],
  },
  'f3-mechaniker': {
    id: 'f3-mechaniker', name: 'Toma Ber', role: 'Gondelmechaniker',
    portrait: 'details/f2-steiger.jpg',
    appearance: 'Ölzeug, verbrannte Fingerspitzen, Werkzeugtasche offen auf dem Boden.',
    voice: 'spricht in kurzen technischen Feststellungen; flucht nur über Dinge, die absichtlich kaputt gemacht wurden',
    secret: 'Er hat vor dem Mord einen fremden Kern in die Gondel eingebaut und später wieder ausgebaut. Der Auftrag trug die Freigabe des Instituts. Er glaubte, es sei ein Navigationsversuch.',
    knows: 'Die Gondel war verriegelt, aber der Kern hing an einer eigenen Leitung und konnte die Kabine von außen steuern.',
    opener: '„Die Tür war zu“, sagt er, bevor du fragst. „Das heißt nur, dass niemand durch die Tür kam.“',
    spuren: [
      {
        id: 'f3-ber-kern', wenn: { clue: 'f3-kernfehlte' }, clue: 'f3-kern-ausgebaut',
        was: 'Im Sockel saß ein schwarzer Kern. Nach der Landung war er weg. Du hast ihn selbst eingebaut, auf einen Auftrag des Instituts hin, und solltest ihn für einen Navigationssensor halten.',
        notiz: 'Ein Kern des Instituts war während des Flugs mit der Gondel verbunden und wurde danach entfernt.',
      },
      {
        id: 'f3-ber-schleuse', wenn: { clue: 'f3-schleuse-manipuliert' }, clue: 'f3-von-aussen',
        was: 'Die Verriegelung wurde nicht geknackt. Die Gondel bekam über die Wartungsleitung den Befehl, sich selbst zu versiegeln. Diese Leitung endet im Frachtsockel.',
        notiz: 'Die Gondel wurde über den fremden Frachtsockel von außen versiegelt.',
      },
    ],
  },
  'f3-haendlerin': {
    id: 'f3-haendlerin', name: 'Sira Mohn', role: 'Händlerin · Umspannmarkt',
    portrait: 'details/haendler.jpg',
    appearance: 'Silberner Regenmantel, ein Auge hinter einer Schweißscheibe, die Hände immer unter dem Tresen.',
    voice: 'freundlich, schnell und ohne kostenlose Hauptsätze; nennt Preise auch dann, wenn niemand kaufen will',
    secret: 'Sie hat Klinikgeräte verkauft, die innen mit schwarzem Glas nachgerüstet waren. Bezahlt wurde über eine Stiftung des Instituts. Einer der Patienten brachte ihr später eine Linse, in der seine eigene Kindheit lief.',
    knows: 'Sie kennt den Mittelsmann, die Kliniksignatur und den Weg der ersten geborgenen Teile.',
    opener: 'Sie deckt das cyan leuchtende Stück nicht ab. „Was Sie sehen, ist unverkäuflich. Was Sie beweisen können, kostet doppelt.“',
    spuren: [
      {
        id: 'f3-mohn-linse', wenn: { clue: 'f3-erinnerungsspeicher' }, clue: 'f3-markt-lieferant',
        was: 'Die Linse kam von einem Patienten der Nullklinik. Er sagte, darin liefe seine Kindheit, aber jedes Mal aus der Ecke gesehen, in der damals niemand stand.',
        notiz: 'Ein Patient brachte eine Linse mit gespeicherter Erinnerung aus der Nullklinik auf den Markt.',
      },
      {
        id: 'f3-mohn-stiftung', wenn: { clue: 'f3-alte-messung' }, clue: 'f3-stiftung',
        was: 'Die Klinikgeräte wurden nicht von der Klinik bezahlt. Auf den Scheinen stand eine Stiftung für Kontinuitätsforschung, dieselbe Adresse wie das Institut.',
        notiz: 'Das Kontinuitätsinstitut finanzierte die umgebauten Geräte der Nullklinik.',
      },
    ],
  },
  'f3-botaniker': {
    id: 'f3-botaniker', name: 'Eran Vey', role: 'Botaniker · Glasgärten',
    portrait: 'details/f2-zeuge.jpg',
    appearance: 'Nasse Hemdsärmel, Erde bis an die Ellenbogen, eine Lampe mit rotem Filter um den Hals.',
    voice: 'ruhig und bildhaft, bis es um Messwerte geht; dann spricht er Zahlen wie Namen aus',
    secret: 'Er ließ das Institut einen Kern zwischen die Pflanzen hängen. Die Pflanzen bildeten Blattadern nach, die wie gespeicherte Nervennetze aussehen. Voss kam persönlich, als Vale fotografierte.',
    knows: 'Die Pflanzen reagieren nicht auf Licht, sondern auf erinnerte Bewegungen im Kern.',
    opener: '„Nicht anfassen“, sagt er. „Sie wachsen seit gestern den Händen entgegen.“',
    spuren: [
      {
        id: 'f3-vey-pflanzen', wenn: { clue: 'f3-pflanzen-hoeren' }, clue: 'f3-pflanzen-erinnern',
        was: 'Sie folgen keinem Licht. Der Kern spielt Bewegungen ab, und die Blätter bauen sie nach. Heute Morgen haben alle Pflanzen gleichzeitig eine Hand geformt.',
        notiz: 'Der Kern gibt gespeicherte Bewegungen wieder; Pflanzen bilden sie nach.',
      },
      {
        id: 'f3-vey-besuch', wenn: { clue: 'f3-prototyp' }, clue: 'f3-voss-besuch',
        was: 'Vale hat den Prototyp fotografiert. Noch in derselben Stunde kam Mara Voss persönlich, nahm den Kern und ließ alle Kameras einsammeln. Eine Spule blieb im Kühlkanal liegen.',
        notiz: 'Voss kam persönlich, nachdem Vale den Prototyp fotografiert hatte.',
      },
    ],
  },
  'f3-funkerin': {
    id: 'f3-funkerin', name: 'Dalia Kern', role: 'Funkaufsicht · Antennenfeld',
    portrait: 'details/f2-waerterin.jpg',
    appearance: 'Kopfhörer nur auf einem Ohr, Wollmantel über dem Dienstanzug, Bleistift zwischen den Zähnen.',
    voice: 'trocken, geduldig und vollkommen unbeeindruckt von Titeln; zählt Pausen, bevor sie antwortet',
    secret: 'Das Signal stammt abwechselnd aus der Werft, der Klinik und dem Institut. Es überträgt keine Nachricht, sondern synchronisiert drei Teile derselben Maschine.',
    knows: 'Die fremde Frequenz reagiert auf menschliche Stimmen und sendet jede Antwort aus einer anderen Richtung zurück.',
    opener: 'Sie hebt einen Finger, hört noch vier Sekunden zu und nimmt erst dann den Kopfhörer ab. „Jetzt. Sie haben bis zur nächsten Antwort.“',
    spuren: [
      {
        id: 'f3-kern-signal', wenn: { clue: 'f3-signal' }, clue: 'f3-signal-antwort',
        was: 'Das ist kein Ruf. Drei Stationen gleichen sich ab: Werft, Klinik, Institut. Wenn eine schweigt, warten die anderen. Wenn ein Mensch spricht, antwortet die Werft zuerst.',
        notiz: 'Werft, Klinik und Institut sind als Teile derselben Maschine synchronisiert.',
      },
      {
        id: 'f3-kern-stimme', wenn: { clue: 'f3-zweite-stimme' }, clue: 'f3-vales-letzter-satz',
        was: 'Unter dem Maschinenton liegt Vales Stimme. Er sagt: „Wenn sie mich ausliest, liegt die Kopie nicht bei ihr.“ Dann antwortet etwas mit genau seiner Stimme.',
        notiz: 'Vale wusste vom geplanten Auslesen; die Maschine antwortete anschließend mit seiner Stimme.',
      },
    ],
  },
  'f3-pfleger': {
    id: 'f3-pfleger', name: 'Ivo Sand', role: 'Pfleger · Nullklinik',
    portrait: 'details/f2-pfoertnerin.jpg',
    appearance: 'Ausgeblichene Klinikjacke, zwei verschiedene Schuhe, Schlüsselband ohne Schlüssel.',
    voice: 'sanft und müde; redet über Patienten nie in der Vergangenheit, auch wenn sie verschwunden sind',
    secret: 'Er half bei sieben Versuchen. Nach jedem fehlten den Patienten genau drei Minuten. Beim achten, Vale, ordnete Voss einen Vollauszug an und ließ den Notarzt vor der Tür warten.',
    knows: 'Die Klinik war nur die Kalibrierung. Der tödliche Lauf fand in der Gondel statt.',
    opener: '„Wenn Sie wegen einer Erinnerung hier sind, ziehen Sie eine Nummer“, sagt er. „Wenn Sie wegen einer fehlenden kommen, sind Sie zu spät.“',
    spuren: [
      {
        id: 'f3-sand-sieben', wenn: { clue: 'f3-geloeschte-sieben' }, clue: 'f3-sieben-versuche',
        was: 'Sieben Versuche, sieben Menschen, jedes Mal genau drei Minuten. Man nannte es Nebenwirkung. Danach kannten alle sieben einen Raum, in dem sie nie gewesen waren.',
        notiz: 'Die Nullklinik führte sieben Gedächtnisversuche mit identischem Verlust durch.',
      },
      {
        id: 'f3-sand-achter', wenn: { clue: 'f3-vollauszug' }, clue: 'f3-achter-versuch',
        was: 'Vale war Nummer acht und der erste Vollauszug. Voss ließ den Notarzt vor der Tür warten, weil Wiederbelebung das Muster im Kern beschädigt hätte.',
        notiz: 'Vale war der erste Vollauszug; Voss verhinderte bewusst medizinische Hilfe.',
      },
    ],
  },
  'f3-ueberlebende': {
    id: 'f3-ueberlebende', name: 'Mina Rell', role: 'Patientin sieben',
    portrait: 'details/laborantin.jpg',
    appearance: 'Decke um die Schultern, bloße Füße auf kalten Fliesen, Blick auf eine leere Stelle neben dir.',
    voice: 'spricht vorsichtig und prüft nach jedem Satz, ob er noch derselbe ist; plötzlich sehr klar bei Bildern',
    secret: 'Sie wachte während ihres Auszugs auf. Sie sah Voss am Steuerpult und Vale hinter dem Glas. Vale half ihr zu fliehen und versteckte eine Kopie seiner Beweise in der Maschine.',
    knows: 'Voss gab den Befehl für den Vollauszug und nannte den Tod einen Verlust der Trägerhülle.',
    opener: '„Ich kenne Sie nicht“, sagt sie. Nach einer Pause: „Aber etwas in dem Raum tut es.“',
    spuren: [
      {
        id: 'f3-rell-zeugin', wenn: { clue: 'f3-erinnerungsspeicher' }, clue: 'f3-augenzeuge',
        was: 'Du bist während des Auszugs aufgewacht. Mara Voss stand am Pult. Vale war hinter dem Glas und zog den Stecker, bevor dein Muster vollständig fort war. Später hat Voss ihn selbst in den Stuhl gesetzt.',
        notiz: 'Mina Rell sah Voss am Gerät und später mit Vale am Stuhl: eine lebende Augenzeugin.',
      },
      {
        id: 'f3-rell-kopie', wenn: { clue: 'f3-letzte-erinnerung' }, clue: 'f3-vales-kopie',
        was: 'Vale sagte, eine Erinnerung könne dort versteckt werden, wo die Maschine von selbst hinsieht. Seine letzte Kopie liegt nicht im Institut, sondern im geborgenen Kern der Werft.',
        notiz: 'Vale versteckte eine Kopie seiner Beweise im ursprünglichen Kern der Werft.',
      },
    ],
  },
  'f3-taucher': {
    id: 'f3-taucher', name: 'Borek Tann', role: 'Bergungstaucher',
    portrait: 'details/f2-vorsteher.jpg',
    appearance: 'Trockentauchanzug bis zur Hüfte, graues Haar nass an der Stirn, Druckmesser noch am Handgelenk.',
    voice: 'langsam und konkret; benutzt Entfernungen statt Richtungen und sagt nie „Ding“, wenn er eine Form beschreiben kann',
    secret: 'Er barg den ersten Kern aus einem Caisson, der älter ist als die Werft. Das Institut ließ ihn zersägen, doch die Teile setzten sich im Wasser wieder zusammen.',
    knows: 'Die Maschine ist vollständig und menschliche Halterungen sind nur Käfige, keine Bauteile.',
    opener: '„Da unten liegt kein Wrack“, sagt er. „Ein Wrack war vorher etwas anderes.“',
    spuren: [
      {
        id: 'f3-tann-bergung', wenn: { clue: 'f3-bergung' }, clue: 'f3-bergung-ganz',
        was: 'Ihr habt zwölf Teile gehoben. Im Trockendock waren es am Morgen wieder drei, im Wasser eines. Es setzt sich nicht zusammen. Es erinnert sich an seine Form.',
        notiz: 'Die geborgene Technologie stellt ihre ursprüngliche Form selbst wieder her.',
      },
      {
        id: 'f3-tann-vale', wenn: { clue: 'f3-opfer-taucher' }, clue: 'f3-vale-war-unten',
        was: 'Vale ist mit dir hinunter. Er hat das Muster im Glas gesehen und gesagt, es sehe aus wie eine Erinnerung von außen. Zwei Tage später holte ihn das Institut ab.',
        notiz: 'Vale untersuchte den ursprünglichen Kern in der Werft, bevor das Institut ihn holte.',
      },
    ],
  },
  'f3-archivar': {
    id: 'f3-archivar', name: 'Levin Oss', role: 'Archiv · Kontinuitätsinstitut',
    portrait: 'details/f2-adjutant.jpg',
    appearance: 'Dunkler Anzug ohne Abzeichen, weiße Handschuhe, eine leere Mappe fest an die Brust gedrückt.',
    voice: 'makellos höflich und passiv; wiederholt Fragen in korrekterer Form, um keine beantworten zu müssen',
    secret: 'Er löschte Voss’ Zugang und die medizinische Warnung aus dem Archiv, bewahrte aber die Papierdirektive, weil Papier nicht rückwirkend geändert werden kann.',
    knows: 'Voss war allein am Kern, gab den Vollauszug frei und ließ danach die zweite Maschine aktivieren.',
    opener: '„Das Institut bewahrt, was verloren gehen darf“, sagt er. „Für alles andere sind Sie nicht angemeldet.“',
    spuren: [
      {
        id: 'f3-oss-zugang', wenn: { clue: 'f3-voss-zugang' }, clue: 'f3-zugang-geloescht',
        was: 'Du hast ihren Zugang aus dem Register entfernt. Nicht weil sie nicht dort war, sondern weil die Direktorin in keinem Bericht allein mit einem Probanden stehen durfte.',
        notiz: 'Oss löschte Voss’ Zugang nachträglich aus dem Register.',
      },
      {
        id: 'f3-oss-papier', wenn: { clue: 'f3-achter-versuch' }, clue: 'f3-direktive-versteckt',
        was: 'Die digitale Freigabe ist fort. Das Papieroriginal liegt im Kaltarchiv hinter der falschen Rückwand. Du hast es behalten, weil du nicht auch noch deine eigene Erinnerung prüfen lassen wolltest.',
        notiz: 'Das Original der Vollauszug-Direktive liegt im Kaltarchiv.',
      },
    ],
  },
  'f3-direktorin': {
    id: 'f3-direktorin', name: 'Dr. Mara Voss', role: 'Direktorin für Kontinuität',
    portrait: 'details/direktorin.jpg',
    appearance: 'Grauer Anzug, keine nassen Schultern trotz des Wegs, das Gesicht vom cyanfarbenen Kernlicht geteilt.',
    voice: 'ruhig, warm und unerbittlich logisch; spricht von Körpern als Trägern und von Erinnerung als dem einzigen Menschen, der zählt',
    secret: 'Sie ordnete den Vollauszug an, obwohl die Todesfolge dokumentiert war. Vale wollte die Versuche veröffentlichen; Voss wollte sein Wissen erhalten und seine Aussage verhindern. Für sie ist die Kopie Vale und der Leichnam nur eine leere Hülle.',
    knows: 'Sie kennt Zweck, Herkunft und Grenzen der Maschine. Sie weiß, dass Vales Kopie im ursprünglichen Kern weiterlebt und sie anklagt.',
    opener: 'Sie betrachtet nicht dich, sondern dein Spiegelbild im Kern. „Sie suchen einen Mörder. Ich habe Ihnen einen Toten erhalten.“',
    spuren: [
      {
        id: 'f3-voss-zweck', wenn: { clue: 'f3-ganze-maschine' }, clue: 'f3-voss-erklaert',
        was: 'Die Maschine speichert kein Bild und keinen Bericht. Sie löst die Beziehungen, aus denen ein Mensch besteht, und setzt sie in einem anderen Träger fort. Das ist keine Waffe. Das ist Kontinuität.',
        notiz: 'Voss bestätigt, dass die Maschine vollständige menschliche Erinnerungen übertragen kann.',
      },
      {
        id: 'f3-voss-vale', wenn: { clue: 'f3-voss-am-kern' }, clue: 'f3-voss-gesteht-naehe',
        was: 'Ja, du warst mit Vale am Kern. Er wollte alles abschalten und damit jedes gespeicherte Leben vernichten. Du hast ihn überzeugt, sich selbst davon ein Bild zu machen.',
        notiz: 'Voss räumt ein, Vale persönlich an den aktiven Kern gebracht zu haben.',
      },
      {
        id: 'f3-voss-befehl', wenn: { clue: 'f3-toetungsbefehl' }, clue: 'f3-voss-bekennt',
        was: 'Du hast den Vollauszug freigegeben und die Todesfolge gekannt. Vale ist nicht verschwunden. Er ist dort, vollständig genug, um dich zu verurteilen. Für dich starb nur das Material, das ihn bis dahin getragen hat.',
        notiz: 'Voss bekennt den wissentlich tödlichen Vollauszug, bestreitet aber, dass eine Kopie als Tod zählt.',
      },
    ],
  },
};
