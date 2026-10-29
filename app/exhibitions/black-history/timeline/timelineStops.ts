import { BLACK_HISTORY } from '../blackHistory';

/*
 * The Black Barbie timeline: the stops, and the poster's words at each.
 *
 * Every sentence is quoted whole from poster 2 ("The Importance of Black
 * Barbie") as blackHistory.ts sets it, approved corrections and all, and is
 * looked up there by its opening words, so a fix to the poster copy reaches
 * the timeline too. Nothing is reworded; `mark` picks out the words in a
 * sentence that belong to this stop. The years are the poster's own.
 *
 * The installation's timeline (1967–2020) is not reproduced: only what the
 * poster says. No dolls or packaging are drawn; each stop is typographic,
 * set on the posters' grounds with poster 1's illustrated vignettes.
 */

const POSTER = BLACK_HISTORY.posters.find((p) => p.id === 'poster2')!;

/** Poster 2's copy, sentence by sentence, in the poster's order. */
export const POSTER_SENTENCES: string[] = POSTER.items.flatMap((item) => {
  const text = (item as { text?: string }).text;
  if (!text || item.type === 'end' || item.type === 'title-image') return [];
  return text.split(/(?<=[.!?])\s+(?=[A-Z"“])/);
});

/** The poster's sentence that begins with `opening`. */
export function posterSentence(opening: string): string {
  const s = POSTER_SENTENCES.find((x) => x.startsWith(opening));
  if (!s) throw new Error(`No sentence on poster 2 begins "${opening}"`);
  return s;
}

/* The grounds a stop is set on, from the posters' palette (black-history.css draws them). */
export type StopTheme = 'lime' | 'lime-dark' | 'blob' | 'pink' | 'pink-red' | 'split';

export type TimelineStop = {
  /** The hash that opens this stop (#1980). */
  id: string;
  /** The year as the poster gives it; null for "Today". */
  year: number | null;
  /** The stop's name, as large type in poster 2's bubble face. */
  name: string;
  /** Whole sentences from the poster. */
  sentences: string[];
  /** Words in those sentences that belong to this stop, highlighted. */
  mark: string[];
  /** A swing tag of the poster's own words, where one is due. */
  tag?: string;
  theme: StopTheme;
};

const EARLIER = posterSentence('While Mattel had previously created two Black dolls');
const CHRISTIE_FRANCIE = posterSentence('Christie was presented');
const SUCCESS = posterSentence('The success of Black Barbie');

export const TIMELINE_STOPS: TimelineStop[] = [
  {
    id: '1967',
    year: 1967,
    name: 'Francie',
    sentences: [EARLIER, CHRISTIE_FRANCIE],
    mark: ['Francie in 1967', 'Francie was essentially a white doll design with darker skin'],
    theme: 'lime',
  },
  {
    id: '1968',
    year: 1968,
    name: 'Christie',
    sentences: [EARLIER, CHRISTIE_FRANCIE],
    mark: ['Christie in 1968', "Christie was presented as part of Barbie's friend group"],
    theme: 'lime-dark',
  },
  {
    id: '1980',
    year: 1980,
    name: 'The first Black Barbie',
    sentences: [
      posterSentence('The first Black Barbie doll, introduced by Mattel in 1980'),
      posterSentence('The first Black Barbie, however'),
      posterSentence('This doll broke away'),
    ],
    mark: ['introduced by Mattel in 1980', 'designed by Kitty Black Perkins'],
    tag: 'Designed by Kitty Black Perkins',
    theme: 'blob',
  },
  {
    id: '2008',
    year: 2008,
    name: 'AKA Centennial Barbie',
    sentences: [SUCCESS],
    mark: ['the AKA Centennial Barbie (2008)'],
    theme: 'pink',
  },
  {
    id: '2009',
    year: 2009,
    name: '“So In Style”',
    sentences: [SUCCESS],
    mark: ['the "So In Style" line (2009)'],
    theme: 'pink-red',
  },
  {
    id: 'today',
    year: null,
    name: 'Today',
    sentences: [posterSentence('Each new iteration'), posterSentence('Today, Black Barbie')],
    mark: ['Today'],
    theme: 'split',
  },
];

export const TIMELINE_TEXT = {
  title: 'The Black Barbie Timeline',
  source: 'In the words of the poster',
  poster: POSTER.title,
  today: 'Today',
};

/** A sentence cut into plain runs and marked runs, in order. */
export function markRuns(sentence: string, marks: string[]): { text: string; marked: boolean }[] {
  const hits = marks
    .map((m) => ({ at: sentence.indexOf(m), len: m.length }))
    .filter((h) => h.at >= 0)
    .sort((a, b) => a.at - b.at);
  const out: { text: string; marked: boolean }[] = [];
  let i = 0;
  for (const h of hits) {
    if (h.at < i) continue;
    if (h.at > i) out.push({ text: sentence.slice(i, h.at), marked: false });
    out.push({ text: sentence.slice(h.at, h.at + h.len), marked: true });
    i = h.at + h.len;
  }
  if (i < sentence.length) out.push({ text: sentence.slice(i), marked: false });
  return out;
}

/** The stop a hash names (#1980, #today), if any. */
export function stopFromHash(hash: string): number {
  const id = hash.replace(/^#/, '').toLowerCase();
  return TIMELINE_STOPS.findIndex((s) => s.id === id);
}
