import type { ApprovedFact } from '@/components/exhibition/FactNote';
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
 *
 * Three stops are additions, not the poster's: Dolls of the World (about
 * 1990 and 1996), Shani (1991) and Inspiring Women (2022–2023). Their words
 * are owner-approved and fact-checked, each with its source (Virtual Black
 * Doll Museum; Mattel, NBC News and CNN), and they carry no poster sentences:
 * each is set as a plain museum note with its source, never as a quote.
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
  /** The year as set, where it is not a plain year ("c. 1990", "2022–23"). */
  yearLabel?: string;
  /** The year on the stops line, where the label is too long for it. */
  stopLabel?: string;
  /** An addition from outside the poster: an approved note and its source. */
  note?: ApprovedFact;
  theme: StopTheme;
};

/*
 * The additions: owner-approved and fact-checked, each with its source.
 * Not the poster's words, so they are set as notes, not quotes.
 */
const VBDM = 'Virtual Black Doll Museum';
export const ADDED_NOTES = {
  dollsOfTheWorld: {
    text: "Barbie's Dolls of the World series included a Nigerian Barbie (about 1990) and a Ghanaian Barbie (1996). Boxed editions of both are in our display case.",
    sources: [{ label: `${VBDM}, “Barbie Dolls of the World”`, href: 'https://virtualblackdollmuseum.com/2024/03/15/barbie-dolls-of-the-world/' }],
  },
  shani: {
    text: "Shani, designed by Kitty Black Perkins, was Mattel's first line of Black fashion dolls launched separately from the Barbie line.",
    sources: [{ label: `${VBDM}, “Shani and Her Friends”`, href: 'https://virtualblackdollmuseum.com/2021/03/18/shani-and-her-friends/' }],
  },
  inspiringWomen: {
    text: "Barbie's Inspiring Women series honored Ida B. Wells (2022), Madam C. J. Walker (2022) and Bessie Coleman (2023). All three dolls are in our display case.",
    sources: [
      { label: 'Mattel', href: 'https://creations.mattel.com/collections/barbie-signature/products/barbie-inspiring-women-ida-b-wells-hcb81' },
      { label: 'NBC News', href: 'https://www.nbcnews.com/news/nbcblk/barbie-honors-first-female-self-made-millionaire-madam-cj-walker-new-d-rcna45322' },
      { label: 'CNN', href: 'https://edition.cnn.com/style/article/bessie-coleman-barbie-doll-cec' },
    ],
  },
} satisfies Record<string, ApprovedFact>;

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
  // Added (owner-approved, fact-checked): Virtual Black Doll Museum.
  {
    id: '1990',
    year: 1990,
    yearLabel: 'c. 1990',
    stopLabel: '1990',
    name: 'Dolls of the World',
    sentences: [],
    mark: [],
    note: ADDED_NOTES.dollsOfTheWorld,
    theme: 'pink-red',
  },
  // Added (owner-approved, fact-checked): Virtual Black Doll Museum.
  {
    id: '1991',
    year: 1991,
    name: 'Shani',
    sentences: [],
    mark: [],
    note: ADDED_NOTES.shani,
    theme: 'lime-dark',
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
  // Added (owner-approved, fact-checked): Mattel, NBC News and CNN.
  {
    id: '2022',
    year: 2022,
    yearLabel: '2022–23',
    stopLabel: '2022',
    name: 'Inspiring Women',
    sentences: [],
    mark: [],
    note: ADDED_NOTES.inspiringWomen,
    theme: 'blob',
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
  /** At an added stop, which carries a museum note rather than the poster's words. */
  noteSource: 'A museum note, not the poster’s words',
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
