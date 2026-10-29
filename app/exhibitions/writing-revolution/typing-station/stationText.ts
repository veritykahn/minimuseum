import { WRITING_REVOLUTION, WRITING_REVOLUTION_CASE } from '../writingRevolution';

/*
 * The typing station's words. The line to type and the top row's sentence
 * are quoted whole from poster 2 ("QWERTY's Accidental Empire") as
 * writingRevolution.ts sets it, looked up there by their opening words, so a
 * fix to the poster copy reaches the station too. The machines are named as
 * the Mini Museum record names them. The rest is interface, and makes no
 * claims.
 */

const POSTER = WRITING_REVOLUTION.posters.find((p) => p.id === 'poster2')!;

/** Poster 2's copy, sentence by sentence. */
const SENTENCES: string[] = POSTER.items.flatMap((item) => {
  const text = (item as { text?: string }).text;
  if (!text || item.type === 'end' || item.type === 'title-image') return [];
  return text.split(/(?<=[.!?])\s+(?=[A-Z"“])/);
});

export function posterSentence(opening: string): string {
  const s = SENTENCES.find((x) => x.startsWith(opening));
  if (!s) throw new Error(`No sentence on poster 2 begins "${opening}"`);
  return s;
}

const record = (id: string) => WRITING_REVOLUTION_CASE.artifacts.find((a) => a.id === id)!.name;

export const STATION_TEXT = {
  title: 'The Typing Station',
  /** The line to type on both machines. */
  line: posterSentence('The keyboard beneath your fingers'),
  lineLabel: 'Type this line',
  typewriterTab: 'Typewriter',
  imacTab: 'iMac',
  topRowTab: 'Top row',
  typewriterName: record('smith-corona-galaxie'),
  imacName: record('imac-g3'),
  typewriterHint: 'Tap the paper or the keys. No erasing: Back space lets you strike over.',
  imacHint: 'Type, select, cut and paste, and change the font.',
  topRowSentence: posterSentence('This layout has literally shaped our language'),
  soundOn: 'Sound on',
  soundOff: 'Sound off',
};

/** The keyboard's rows, as the station tries them. */
export const ROWS = {
  top: 'qwertyuiop',
  bottom: 'zxcvbnm',
} as const;
export type RowName = keyof typeof ROWS;

/**
 * Which of a word's letters lie on a row. Only the letters are checked:
 * whether it is a word is the visitor's to say.
 */
export function rowCheck(word: string, row: RowName) {
  const letters = word.toLowerCase().replace(/[^a-z]/g, '');
  const off = [...new Set([...letters].filter((ch) => !ROWS[row].includes(ch)))];
  return { letters, off, ok: letters.length > 0 && off.length === 0 };
}
