/**
 * FALL 1 — Meldungen.
 *
 * Eine Meldung sagt, dass sich woanders etwas geändert hat.
 *
 * Der Grund ist ein Konstruktionsfehler, der beim Bauen aufgefallen ist: Die
 * stärksten Momente des Spiels stehen an Orten, die man nicht besuchen MUSS.
 * Wer nach dem Kühlhaus geradewegs in die Direktion fliegt, erfährt nie, dass
 * jemand in seiner Wohnung gesessen hat. Eine Szene, die niemand sieht, ist
 * keine Szene.
 *
 * Deshalb wird sie gemeldet — und zwar so, dass man sie WEGKLICKEN muss. Eine
 * Kurzmeldung, die nach drei Sekunden von selbst verschwindet, ist genau dann
 * weg, wenn man gerade woanders hinsieht.
 *
 * Was NICHT drinsteht: was man dort finden wird. Die Meldung ist ein Anlass,
 * kein Wegweiser.
 */

export const MELDUNGEN = [
  {
    id: 'licht-wohnung',
    wenn: { clue: 'name-malaunt' },
    titel: 'In deiner Wohnung brennt Licht',
    text: 'Vom Kanal aus sieht man das vierte Fenster von links. Es ist hell. '
        + 'Du warst heute nicht dort, und die Zeitschaltung im Aufgang reicht '
        + 'seit Jahren nur bis zum dritten Stock.',
  },
  {
    id: 'kiosk-winkt',
    wenn: { clue: 'zweite-liste' },
    titel: 'Der Mann im Kiosk hat die Klappe aufgeschoben',
    text: 'Seit Jahren steht sie zu, wenn du vorbeigehst. Heute nicht. Er hat '
        + 'sich vorgelehnt und wieder zurückgesetzt, als er gemerkt hat, dass '
        + 'du ihn ansiehst.',
  },
  {
    id: 'stand-wieder-auf',
    wenn: { clue: 'haendler-lebt' },
    titel: 'Der Marktstand in der Kanalgasse ist wieder offen',
    text: 'Die Plane ist hochgebunden, die Ware liegt aus. Dahinter steht '
        + 'niemand. Aufgesperrt hat jemand, der nicht gesehen werden wollte.',
  },
];
