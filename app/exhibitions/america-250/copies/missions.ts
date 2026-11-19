import type { CopyId } from '../sign/signText';

/*
 * A Copy of a Copy, as a detective's case: one thing to find on each of the
 * four copies, by looking at the photograph itself under the lens. Every
 * answer is there to be seen in the picture (its alt text in signText.ts
 * says so), so nothing is guessed that the room has not shown; what each
 * copy is comes after, in its fact-checked note (signText.ts, COPIES).
 * Instructions and choices only: no new facts.
 */

export type Mission = {
  copy: CopyId;
  /** The detective's task: what to look for, and where. */
  task: string;
  /** Where on the sheet to look, said again after a wrong guess. */
  hint: string;
  choices: { id: string; label: string }[];
  answer: string;
  /** Said when it is found: what the picture shows. */
  found: string;
};

export const MISSIONS: Mission[] = [
  {
    copy: 'dunlap',
    task: 'This is the first printing. Look at the foot of the sheet: how many names are printed there?',
    hint: 'Move the lens to the very bottom of the sheet, under the last lines of type.',
    choices: [
      { id: 'two', label: 'Just two' },
      { id: 'all', label: 'All fifty-six signers' },
      { id: 'none', label: 'None at all' },
    ],
    answer: 'two',
    found: 'Just two: John Hancock’s and Charles Thomson’s.',
  },
  {
    copy: 'goddard',
    task: 'This printing has the signers’ names. Who printed it? Find the printer’s name at the very foot.',
    hint: 'Look under the signers’ names, at the very bottom edge of the sheet.',
    choices: [
      { id: 'dunlap', label: 'John Dunlap' },
      { id: 'goddard', label: 'Mary Katharine Goddard' },
      { id: 'jefferson', label: 'Thomas Jefferson' },
    ],
    answer: 'goddard',
    found: 'Mary Katharine Goddard: she set her own name at its foot.',
  },
  {
    copy: 'stone',
    task: 'Stone’s engraving shows every signature clear and dark. Whose signature is the largest?',
    hint: 'Look at the signatures at the foot. One is much bigger than all the rest.',
    choices: [
      { id: 'franklin', label: 'Benjamin Franklin' },
      { id: 'jefferson', label: 'Thomas Jefferson' },
      { id: 'hancock', label: 'John Hancock' },
    ],
    answer: 'hancock',
    found: 'John Hancock’s, the largest of them all.',
  },
  {
    copy: 'original',
    task: 'This is the signed parchment itself, as it is today. Look at its foot: can you read the signatures?',
    hint: 'Compare its foot with Stone’s engraving, where every name was clear and dark.',
    choices: [
      { id: 'clear', label: 'Yes, clear and dark' },
      { id: 'faded', label: 'Hardly: they have faded almost away' },
      { id: 'never', label: 'It was never signed' },
    ],
    answer: 'faded',
    found: 'Hardly: nearly every signature has faded almost away.',
  },
];
