/*
 * The signing room's words. Every line that says something about 1776 or the
 * Declaration is quoted from the posters (america250.ts), word for word, and
 * the room's test checks each one against them. The rest is instruction.
 */

export const SIGN_TEXT = {
  title: 'Put Your Name to It',
  signHeading: 'Sign your name',
  signShort: 'Sign',
  copiesHeading: 'A copy of a copy',
  copiesShort: 'Copies',

  signIntro: 'Dip the quill, then sign on the line with your finger or mouse.',
  privacy: 'Nothing you sign is saved or sent.',
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
export const COPY_STAGES: { id: CopyStageId; name: string; quote: string }[] = [
  {
    id: 'rough',
    name: 'Jefferson’s Rough Draft',
    quote: '"We hold these truths to be self-evident" was Franklin\'s alteration of Jefferson\'s original "sacred and undeniable."',
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
