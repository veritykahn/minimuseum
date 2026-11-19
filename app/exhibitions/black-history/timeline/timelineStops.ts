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
  /** Older addresses (and photograph keys) that now open this stop: #2009 opens 2008–09. */
  aliases?: string[];
  /** The years offered in "guess the year", the right one (`year`) among them; none for Today. */
  choices?: number[];
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
    choices: [1958, 1967, 1972, 1985],
    theme: 'lime',
  },
  {
    id: '1968',
    year: 1968,
    name: 'Christie',
    sentences: [EARLIER, CHRISTIE_FRANCIE],
    mark: ['Christie in 1968', "Christie was presented as part of Barbie's friend group"],
    choices: [1968, 1975, 1983, 1991],
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
    choices: [1971, 1976, 1980, 1989],
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
    choices: [1979, 1990, 1996, 2003],
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
    choices: [1984, 1987, 1991, 1998],
    theme: 'lime-dark',
  },
  // One stop for both: the poster names them in one sentence, and both are marked in it.
  // The old #2009 address still opens it (`aliases`), and so does a photograph keyed '2009'.
  {
    id: '2008',
    aliases: ['2009'],
    year: 2008,
    yearLabel: '2008–09',
    stopLabel: '2008',
    name: 'AKA Centennial Barbie and “So In Style”',
    sentences: [SUCCESS],
    mark: ['the AKA Centennial Barbie (2008)', 'the "So In Style" line (2009)'],
    choices: [1999, 2008, 2013, 2018],
    theme: 'pink',
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
    choices: [2005, 2012, 2017, 2022],
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

/*
 * The owner's photographs, one for a stop. Until she adds them this list is
 * empty and the timeline shows no photographs and no placeholders. Each is
 * keyed to a stop by its id (#1980 is '1980'), with the alt text written
 * from the photograph and the credit as its source asks for it. The page
 * sets each beside the year disc, at no more than its own width: `width`
 * and `height` are the file's pixels, and a small file stays small.
 * Never Mattel's product shots or packaging, and never photographs of the
 * installation.
 *
 * TO ADD the V&A's photograph of the first Black Barbie (1980), museum no.
 * B.32:1 to 13-2021: its terms allow non-commercial use online at no more
 * than 768 px wide, credited "© Victoria and Albert Museum, London". Save
 * it at 768 px wide or less as public/exhibitions/black-history/photos/
 * first-black-barbie-1980.jpg, read its pixel size, and add:
 *
 *   {
 *     stop: '1980',
 *     src: '/exhibitions/black-history/photos/first-black-barbie-1980.jpg',
 *     alt: '(what the photograph shows, written from it)',
 *     credit: {
 *       text: '© Victoria and Albert Museum, London',
 *       href: '(the object's page on collections.vam.ac.uk)',
 *     },
 *     width: 768, // the file's own pixels, never more than 768
 *     height: 1024,
 *   },
 *
 * and list the file in the exhibition's picture inventory test
 * (__tests__/components/BlackHistory.test.tsx, "holds only the posters…").
 */
export type OwnerPhoto = {
  /** The stop's id ('1980'). */
  stop: string;
  src: string;
  alt: string;
  /** Set small under the photograph; `href` links to the source. */
  credit: { text: string; href?: string };
  /** The file's own size in pixels: it is never shown wider than `width`. */
  width: number;
  height: number;
};
export const OWNER_BARBIE_PHOTOS: OwnerPhoto[] = [];

/**
 * The photograph for a stop, if the owner has given one: keyed by the stop's
 * id, or by one of its older ids (a photograph keyed '2009' belongs to the
 * merged 2008–09 stop). A photograph keyed by the id itself comes first.
 */
export function photoFor(stopId: string, photos: OwnerPhoto[] = OWNER_BARBIE_PHOTOS): OwnerPhoto | undefined {
  const stop = TIMELINE_STOPS.find((s) => s.id === stopId);
  return photos.find((p) => p.stop === stopId) ?? photos.find((p) => !!stop?.aliases?.includes(p.stop));
}

export const TIMELINE_TEXT = {
  title: 'The Black Barbie Timeline',
  source: 'In the words of the poster',
  /** At an added stop, which carries a museum note rather than the poster's words. */
  noteSource: 'A museum note, not the poster’s words',
  poster: POSTER.title,
  today: 'Today',
  guessHeading: 'When was it? Guess the year!',
  skip: 'Just show me',
  right: 'Yes! You got it.',
  wrong: 'Good try! It was',
  skipped: 'It was',
  score: 'Right guesses',
  soundOn: 'Sound on',
  soundOff: 'Sound off',
  challenge: 'Final challenge',
  // REVIEW: new text (the final challenge, "Before or after?", Nov 19 2026), down to startOver
  challengeCta: 'Final challenge: before or after?',
  orderHeading: 'Before or after?',
  orderHow: 'The first Black Barbie came out in 1980. Read each clue. Did this doll come before it, or after?',
  anchorName: 'The first Black Barbie',
  before: 'Before 1980',
  after: 'After 1980',
  cardCount: (n: number, of: number) => `Card ${n} of ${of}`,
  fromPoster: 'From the poster',
  fromNote: 'From a museum note',
  rightLead: 'Yes!',
  hintLead: 'Not quite. Look again:',
  placed: (name: string, year: string, side: SortSide) => `${name}: ${year}, ${side === 'before' ? 'before' : 'after'} 1980.`,
  next: 'Next card',
  seeLine: 'See them all in time',
  result: (n: number, of: number) => `${n} of ${of} right on the first try.`,
  allRight: 'Every one right on the first try!',
  lineHeading: 'All of them, in time',
  tryAgain: 'Try again',
  backToTimeline: 'Back to the timeline',
  startOver: 'Play again from the start',
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

/**
 * The stop a key moves to from the stop shown, or null if the key isn't the
 * timeline's. Left and Right (and Home and End) work anywhere in the room;
 * Up and Down only on the stops, so they still scroll the words.
 */
export function stepFor(key: string, index: number, onTrack: boolean): number | null {
  const last = TIMELINE_STOPS.length - 1;
  const to =
    key === 'ArrowRight' || (onTrack && key === 'ArrowDown') ? index + 1
    : key === 'ArrowLeft' || (onTrack && key === 'ArrowUp') ? index - 1
    : key === 'Home' ? 0
    : key === 'End' ? last
    : null;
  return to === null ? null : Math.max(0, Math.min(last, to));
}

/** The stop a hash names (#1980, #today, and the older #2009), if any. */
export function stopFromHash(hash: string): number {
  const id = hash.replace(/^#/, '').toLowerCase();
  return TIMELINE_STOPS.findIndex((s) => s.id === id || !!s.aliases?.includes(id));
}

/* ───────── The game: guess the year at each stop, then before or after? ───────── */

/** The address of the final challenge. */
export const ORDER_HASH = 'order';

/** The stops a class guesses and puts in order: every dated one (Today has no year to guess). */
export const DATED_STOPS = TIMELINE_STOPS.filter((s) => s.year !== null);

/** Whether a guess at a stop is right. */
export const isRight = (stop: TimelineStop, guess: number) => guess === stop.year;

/*
 * The final challenge, "Before or after?": not putting the cards in order
 * (the years have just been shown at each stop, so that only tests memory)
 * but reasoning from the words. The first Black Barbie (1980) sits in the
 * middle, and each card gives a clue from the poster or a museum note, with
 * no year: did this doll come before it, or after? A wrong try gets a hint
 * that points at the words that decide it, then another try.
 *
 * Shani is not a card: nothing in its note says whether it came before or
 * after 1980, so it would be a guess. It is in the line of every stop, in
 * time, that ends the challenge.
 */

export type SortSide = 'before' | 'after';
export type SortCard = {
  /** The stop's id. */
  id: string;
  side: SortSide;
  /** The clue: from the poster, whole words quoted exactly; or from a museum note, its words without the years. */
  clue: string;
  from: 'poster' | 'note';
  /** After a wrong try: the words that decide it. */
  hint: string;
};

/** The stop every card is placed against. */
export const ANCHOR_ID = '1980';

// REVIEW: new text (the clues from the museum notes, and every hint, Nov 19 2026)
const EARLIER_HINT = 'The poster says Mattel had “previously created two Black dolls”, Christie and Francie, and that the first Black Barbie “broke away from past missteps”. Previously: before what?';
export const SORT_CARDS: SortCard[] = [
  { id: '1967', side: 'before', from: 'poster', clue: 'Francie was essentially a white doll design with darker skin', hint: EARLIER_HINT },
  { id: '1968', side: 'before', from: 'poster', clue: "Christie was presented as part of Barbie's friend group", hint: EARLIER_HINT },
  {
    id: '1990',
    side: 'after',
    from: 'note',
    clue: 'Barbie’s Dolls of the World series included a Nigerian Barbie and a Ghanaian Barbie.',
    hint: 'These were Black Barbie dolls. Could any Black Barbie come before the first Black Barbie?',
  },
  {
    id: '2008',
    side: 'after',
    from: 'poster',
    clue: 'which highlighted authentic Black features and realistic hair textures',
    hint: 'The poster says “The success of Black Barbie paved the way for” these dolls. Can a doll’s success pave the way before it exists?',
  },
  {
    id: '2022',
    side: 'after',
    from: 'note',
    clue: 'Barbie’s Inspiring Women series honored Ida B. Wells, Madam C. J. Walker and Bessie Coleman.',
    hint: 'These were Barbie dolls of three Black women. Could they come before the first Black Barbie?',
  },
];

/** A stop's name and its year as set ("c. 1990"). */
export const stopName = (id: string) => DATED_STOPS.find((s) => s.id === id)!.name;
export const stopYear = (id: string) => {
  const s = DATED_STOPS.find((x) => x.id === id)!;
  return s.yearLabel ?? String(s.year);
};
