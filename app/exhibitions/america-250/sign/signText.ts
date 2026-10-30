import type { ApprovedFact, FactSource } from '@/components/exhibition/FactNote';

/*
 * The signing room's words. Every line that says something about 1776 or the
 * Declaration is quoted from the posters (america250.ts), word for word, and
 * the room's test checks each one against them. The rest is instruction.
 *
 * The exceptions are marked as notes, not quotes: the four copies of the
 * Declaration side by side (what each is, when and by whom it was made), and
 * the flag from 13 stars to 50 (which state each star stands for, and the
 * year it joined). Those lines are owner-approved and fact-checked, each set
 * with its source (the Library of Congress, the National Archives, the U.S.
 * House of Representatives' "Our Flag" and the Smithsonian National Postal
 * Museum), and the test carves them out by name.
 */

export const SIGN_TEXT = {
  title: 'Put Your Name to It',
  signHeading: 'Sign your name',
  signShort: 'Sign',
  copiesHeading: 'A copy of a copy',
  copiesShort: 'Copies',
  flagHeading: 'The flag',
  flagShort: 'Flag',

  signIntro: 'Read the Declaration on the parchment, scrolling inside it. Then dip the quill, and sign on the line at its foot with your finger or mouse.',
  typeIntro: 'Read the Declaration on the parchment, scrolling inside it. Then type your name, and it is set on the line at its foot in a flowing hand.',
  toFoot: 'Go to the line to sign',
  privacy: 'Nothing you sign is saved or sent.',
  privacyWritten: 'Nothing you write or sign is saved or sent. Print it to keep it.',

  // The class's and the student's own declarations: instructions only (their wording is the owner's: declaration.ts).
  declarationName: 'The Declaration',
  declarationShort: '1776',
  classIntro: 'Fill in your teacher’s name and your grade at the head of the parchment, and read your class’s declaration. Then each of you signs at its foot, one after another, and you print it.',
  mineIntro: 'Add your name and grade at the head of the parchment if you like, and read your declaration. Then sign at its foot, and print it.',
  versionLabel: 'Version',
  addName: 'Add my name',
  mineSigned: 'Signed. Your declaration is yours to print.',
  addressLabel: 'Add your address',
  addressPlaceholder: 'where you are from',
  carroll: {
    text: 'Carroll responded by adding his full address to his signature — "of Carrollton" — so there could be no mistaking which Charles Carroll had signed.',
  },
  epigraph: {
    text: '"We must all hang together, or assuredly we shall all hang separately."',
    cite: '— attributed to Benjamin Franklin, upon signing the Declaration of Independence',
  },
  /** Set once the visitor has signed. */
  signed: [
    'These men were not signing a certificate of triumph, but a death warrant.',
    'When they lifted their pens to sign, not one of those men could say with certainty what the outcome would be.',
  ],

  copiesIntro: 'What most people picture as the Declaration of Independence was not the actual document present at the Continental Congress.',
  copiesClose: 'The document Americans venerate is a copy of a copy, made nearly fifty years after the fact.',
  /** Instructions for the four copies: no facts. */
  copiesHow: 'Four copies, side by side. Choose one to read about it, then look closer with the magnifier.',
  closer: 'Look closer',
  sideBySide: 'All four side by side',
  lensHint: 'Move over the page, or tap it, to magnify. With the keyboard: Enter, then the arrow keys.',
};

/* ───────────────────────── A copy of a copy ─────────────────────────
 * How the Declaration was copied and spread: the two printed broadsides
 * (1776 and 1777), Stone's engraving (1823) and the signed parchment as it is
 * today, each a real photograph from the Library of Congress or the National
 * Archives (public domain), credited and linked to its record. What each one
 * is, is an owner-approved, fact-checked note with its source; where the
 * posters speak of a copy, their own words are set with it as a quote.
 */

export type CopyId = 'dunlap' | 'goddard' | 'stone' | 'original';

export type Copy = {
  id: CopyId;
  name: string;
  /** The copy's date, as its label shows it. */
  date: string;
  src: string;
  /** The photograph's own width ÷ height. */
  ratio: number;
  alt: string;
  credit: FactSource;
  note: ApprovedFact;
  /** The posters' own words about this copy, where they speak of it. */
  quote?: string;
};

const LOC_PRINTING: FactSource = { label: 'Library of Congress, “Printing the Declaration of Independence”', href: 'https://blogs.loc.gov/bibliomania/2023/07/04/printing-the-declaration-of-independence/' };
const LOC_DUNLAP: FactSource = { label: 'Library of Congress, the Dunlap broadside', href: 'https://www.loc.gov/item/2003576546/' };
const LOC_GODDARD: FactSource = { label: 'Library of Congress, the Goddard broadside', href: 'https://www.loc.gov/item/90898037/' };
const NARA_DECLARATION: FactSource = { label: 'National Archives, “The Declaration of Independence”', href: 'https://www.archives.gov/founding-docs/declaration' };
const NARA_MILESTONE: FactSource = { label: 'National Archives, Milestone Documents', href: 'https://www.archives.gov/milestone-documents/declaration-of-independence' };

export const COPIES: Copy[] = [
  {
    id: 'dunlap',
    name: 'The Dunlap broadside',
    date: 'July 4–5, 1776',
    src: '/exhibitions/america-250/copies/dunlap.jpg',
    ratio: 1600 / 1971,
    alt: 'The Dunlap broadside: a single printed sheet headed “In Congress, July 4, 1776. A Declaration by the Representatives of the United States of America, in General Congress assembled,” the whole text in close lines of type, with only John Hancock’s and Charles Thomson’s names printed at its foot',
    credit: { label: 'John Dunlap, printer, Philadelphia, 1776. Library of Congress, Rare Book and Special Collections Division. Public domain.', href: 'https://www.loc.gov/item/2003576546/' },
    note: {
      text: 'The first printing. John Dunlap, the official printer of the Congress, printed about 200 copies in Philadelphia on the evening of July 4 and the early morning of July 5, 1776. Congress had them sent to governments and military commanders, and to the British Crown in London. It carries only two names from the Congress: John Hancock’s, as President, and Charles Thomson’s, as Secretary. 26 copies are known to survive.',
      sources: [LOC_PRINTING, LOC_DUNLAP],
    },
  },
  {
    id: 'goddard',
    name: 'The Goddard broadside',
    date: '1777',
    src: '/exhibitions/america-250/copies/goddard.jpg',
    ratio: 1600 / 1958,
    alt: 'The Goddard broadside: a printed sheet headed “In Congress, July 4, 1776. The Unanimous Declaration of the Thirteen United States of America,” the text in two columns, and below it the signers’ names in print, grouped by state, with Congress’s order of January 18, 1777, and Hancock’s and Thomson’s handwritten signatures at the foot',
    credit: { label: 'Mary Katharine Goddard, printer, Baltimore, 1777. Library of Congress, Rare Book and Special Collections Division. Public domain.', href: 'https://www.loc.gov/item/90898037/' },
    note: {
      text: 'The first printing with the signers’ names. On January 18, 1777, Congress ordered an authenticated copy, with the names of the members who signed it, sent to each of the states. Mary Katharine Goddard printed it in Baltimore, with every name but Thomas McKean’s, and her own name at its foot.',
      sources: [LOC_GODDARD],
    },
  },
  {
    id: 'stone',
    name: 'Stone’s engraving',
    date: '1823',
    src: '/exhibitions/america-250/copies/stone.jpg',
    ratio: 1600 / 1893,
    alt: 'William J. Stone’s engraving: the Declaration in crisp black lines on white, the heading “In Congress, July 4, 1776” and the title in tall ornate letters, the whole text in a flowing hand, and every signature clear and dark at the foot, John Hancock’s largest',
    credit: { label: 'William J. Stone, engraving of the Declaration of Independence, 1823. National Archives. Public domain.', href: 'https://www.archives.gov/founding-docs/declaration' },
    note: {
      text: 'By 1820 the parchment was already showing signs of age. Secretary of State John Quincy Adams commissioned the printer William J. Stone to make a full-size copperplate engraving, and copies were printed from the plate. The 1823 Stone engraving is the most frequently reproduced version of the Declaration.',
      sources: [NARA_DECLARATION],
    },
    quote: 'an engraving made in 1823 by William J. Stone — itself an imperfect copy of the Engrossed parchment',
  },
  {
    id: 'original',
    name: 'The signed parchment today',
    date: 'Signed 1776',
    src: '/exhibitions/america-250/copies/original.jpg',
    ratio: 1600 / 1949,
    alt: 'The signed parchment of the Declaration as it is today: a pale, worn sheet, its heading “In Congress, July 4, 1776” and its title still dark, but most of its handwriting and nearly all the signatures faded almost away',
    credit: { label: 'The Engrossed Declaration of Independence, signed August 2, 1776. National Archives. Public domain.', href: 'https://catalog.archives.gov/id/1419123' },
    note: {
      text: 'Years of public display have faded and worn the parchment. Today it is kept under the most exacting archival conditions possible, on display in the Rotunda of the National Archives in Washington, D.C.',
      sources: [NARA_DECLARATION, NARA_MILESTONE],
    },
    quote: 'Congress did not order the Engrossed Copy until July 19, and most delegates signed it on August 2.',
  },
];

/* ───────────────────────── The flag ─────────────────────────
 * From 13 stars to 50: owner-approved and fact-checked, not the posters'
 * words. It begins with the 13 stars and the 13 states they stood for; each
 * star added names the state it stands for and the year it joined the Union,
 * in the order "Our Flag" (U.S. House of Representatives) ranks them; and each
 * milestone appears as the count passes its stars. The star layouts drawn
 * between milestones are generic arrangements (flagLayout.ts), claiming no
 * historical flag.
 */
const OUR_FLAG: FactSource = { label: 'U.S. House of Representatives, “Our Flag” (H. Doc. 108-97)', href: 'https://www.govinfo.gov/content/pkg/CDOC-108hdoc97/html/CDOC-108hdoc97.htm' };

export const FLAG_TEXT = {
  intro: 'Add a star for each state. Tap the flag, use the buttons, or the arrow keys.',
  thirteen: {
    text: 'The flag began with a star for each of the 13 states that had been the Thirteen Colonies. A resolution of June 14, 1777, called for “thirteen stars, white in a blue field representing a new constellation.”',
    sources: [OUR_FLAG],
  } satisfies ApprovedFact,
  /** The thirteen, in the order the Declaration's signers are grouped, north to south. */
  originals: [
    'New Hampshire', 'Massachusetts', 'Rhode Island', 'Connecticut', 'New York', 'New Jersey', 'Pennsylvania',
    'Delaware', 'Maryland', 'Virginia', 'North Carolina', 'South Carolina', 'Georgia',
  ],
  originalsLabel: 'The 13 stars: the original states',
  sources: [
    OUR_FLAG,
    { label: 'National Archives, Executive Order 10834', href: 'https://www.archives.gov/federal-register/codification/executive-order/10834.html' },
    { label: 'Smithsonian National Postal Museum, “The Evolution of the American Flag”', href: 'https://postalmuseum.si.edu/exhibition/long-may-it-wave/the-evolution-of-the-american-flag' },
  ] satisfies FactSource[],
};

export const FLAG_MIN = 13;
export const FLAG_MAX = 50;

/**
 * The states after the first thirteen, each with the star it adds and the
 * year it entered the Union: "Entered the Union in 1791 as the 14th State",
 * as "Our Flag" (H. Doc. 108-97) has each one.
 */
export const FLAG_STATES: { stars: number; state: string; year: number }[] = [
  { stars: 14, state: 'Vermont', year: 1791 },
  { stars: 15, state: 'Kentucky', year: 1792 },
  { stars: 16, state: 'Tennessee', year: 1796 },
  { stars: 17, state: 'Ohio', year: 1803 },
  { stars: 18, state: 'Louisiana', year: 1812 },
  { stars: 19, state: 'Indiana', year: 1816 },
  { stars: 20, state: 'Mississippi', year: 1817 },
  { stars: 21, state: 'Illinois', year: 1818 },
  { stars: 22, state: 'Alabama', year: 1819 },
  { stars: 23, state: 'Maine', year: 1820 },
  { stars: 24, state: 'Missouri', year: 1821 },
  { stars: 25, state: 'Arkansas', year: 1836 },
  { stars: 26, state: 'Michigan', year: 1837 },
  { stars: 27, state: 'Florida', year: 1845 },
  { stars: 28, state: 'Texas', year: 1845 },
  { stars: 29, state: 'Iowa', year: 1846 },
  { stars: 30, state: 'Wisconsin', year: 1848 },
  { stars: 31, state: 'California', year: 1850 },
  { stars: 32, state: 'Minnesota', year: 1858 },
  { stars: 33, state: 'Oregon', year: 1859 },
  { stars: 34, state: 'Kansas', year: 1861 },
  { stars: 35, state: 'West Virginia', year: 1863 },
  { stars: 36, state: 'Nevada', year: 1864 },
  { stars: 37, state: 'Nebraska', year: 1867 },
  { stars: 38, state: 'Colorado', year: 1876 },
  { stars: 39, state: 'North Dakota', year: 1889 },
  { stars: 40, state: 'South Dakota', year: 1889 },
  { stars: 41, state: 'Montana', year: 1889 },
  { stars: 42, state: 'Washington', year: 1889 },
  { stars: 43, state: 'Idaho', year: 1890 },
  { stars: 44, state: 'Wyoming', year: 1890 },
  { stars: 45, state: 'Utah', year: 1896 },
  { stars: 46, state: 'Oklahoma', year: 1907 },
  { stars: 47, state: 'New Mexico', year: 1912 },
  { stars: 48, state: 'Arizona', year: 1912 },
  { stars: 49, state: 'Alaska', year: 1959 },
  { stars: 50, state: 'Hawaii', year: 1959 },
];

const ordinal = (n: number) => {
  const s = n % 100 >= 11 && n % 100 <= 13 ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' } as Record<number, string>)[n % 10] ?? 'th';
  return `${n}${s}`;
};

/** The newest star at `stars` stars, as its line reads: "The 14th star: Vermont, which joined the Union in 1791." */
export function starLine(stars: number) {
  const s = FLAG_STATES.find((x) => x.stars === stars);
  return s ? `The ${ordinal(stars)} star: ${s.state}, which joined the Union in ${s.year}.` : null;
}

/** The milestones, with the count of stars at which each appears. */
export const FLAG_MILESTONES: { year: number; stars: number; text: string }[] = [
  { year: 1777, stars: 13, text: '13 stripes and 13 stars, for the 13 states.' },
  { year: 1795, stars: 15, text: '15 stars and 15 stripes, after Vermont and Kentucky joined; the flag of the Star-Spangled Banner.' },
  { year: 1818, stars: 20, text: 'Back to 13 stripes, with a star for every state, added on the July 4 after a state joins.' },
  { year: 1960, stars: 50, text: '50 stars, after Hawaii joined, official on July 4, 1960.' },
];
