import type { ApprovedFact } from '@/components/exhibition/FactNote';

/*
 * The signing room's words. Every line that says something about 1776 or the
 * Declaration is quoted from the posters (america250.ts), word for word, and
 * the room's test checks each one against them. The rest is instruction.
 *
 * The exceptions are marked as notes, not quotes: where two of the copies
 * are held today, and the flag's milestones from 13 stars to 50. Those lines
 * are owner-approved and fact-checked, each set with its source (the National
 * Archives, the Library of Congress, and the Smithsonian National Postal
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
  printedNameLabel: 'Your name, set in type',
  printedNamePlaceholder: 'Your Name',
};

export type CopyStageId = 'rough' | 'fair' | 'engrossed' | 'stone' | 'transcription';

/**
 * The document's copies, oldest first, as poster 1 tells them (newest first)
 * in "The Wrong Document", with the line "The Wrong Author" gives the draft.
 */
/*
 * Where two of the copies are held: owner-approved and fact-checked notes,
 * not the posters' words, each with its source.
 */
export const COPY_NOTES = {
  rough: {
    text: 'Jefferson’s Rough Draft is held by the Library of Congress.',
    sources: [{ label: 'Library of Congress', href: 'https://www.loc.gov/exhibits/creating-the-united-states/interactives/declaration-of-independence/equal/index.html' }],
  },
  engrossed: {
    text: 'The signed Engrossed Copy is on display in the Rotunda of the National Archives in Washington, D.C.',
    sources: [{ label: 'National Archives', href: 'https://www.archives.gov/milestone-documents/declaration-of-independence' }],
  },
} satisfies Partial<Record<CopyStageId, ApprovedFact>>;

export const COPY_STAGES: { id: CopyStageId; name: string; quote: string; note?: ApprovedFact }[] = [
  {
    id: 'rough',
    name: 'Jefferson’s Rough Draft',
    quote: '"We hold these truths to be self-evident" was Franklin\'s alteration of Jefferson\'s original "sacred and undeniable."',
    note: COPY_NOTES.rough,
  },
  {
    id: 'fair',
    name: 'The July 4 Fair Copy',
    quote: "the July 4 Fair Copy, itself an edited version of Jefferson's Rough Draft.",
  },
  {
    id: 'engrossed',
    name: 'The Engrossed Copy',
    quote: 'Congress did not order the Engrossed Copy until July 19, and most delegates signed it on August 2.',
    note: COPY_NOTES.engrossed,
  },
  {
    id: 'stone',
    name: 'Stone’s engraving',
    quote: 'an engraving made in 1823 by William J. Stone — itself an imperfect copy of the Engrossed parchment',
  },
  {
    id: 'transcription',
    name: 'The transcription',
    quote: 'Even the transcription offered by the National Archives is a transcription of the Stone engraving, not the original.',
  },
];

/*
 * The flag, from 13 stars to 50: owner-approved and fact-checked, not the
 * posters' words. Each milestone appears as the count passes its stars. The
 * star layouts drawn between milestones are generic arrangements (flagLayout.ts),
 * claiming no historical flag.
 */
export const FLAG_TEXT = {
  intro: 'Add a star for each state. Tap the flag, use the buttons, or the arrow keys.',
  sources: [
    { label: 'National Archives, Executive Order 10834', href: 'https://www.archives.gov/federal-register/codification/executive-order/10834.html' },
    { label: 'Smithsonian National Postal Museum, “The Evolution of the American Flag”', href: 'https://postalmuseum.si.edu/exhibition/long-may-it-wave/the-evolution-of-the-american-flag' },
  ],
};

export const FLAG_MIN = 13;
export const FLAG_MAX = 50;

/** The milestones, with the count of stars at which each appears. */
export const FLAG_MILESTONES: { year: number; stars: number; text: string }[] = [
  { year: 1777, stars: 13, text: '13 stripes and 13 stars, for the 13 states.' },
  { year: 1795, stars: 15, text: '15 stars and 15 stripes, after Vermont and Kentucky joined; the flag of the Star-Spangled Banner.' },
  { year: 1818, stars: 20, text: 'Back to 13 stripes, with a star for every state, added on the July 4 after a state joins.' },
  { year: 1960, stars: 50, text: '50 stars, after Hawaii joined, official on July 4, 1960.' },
];
