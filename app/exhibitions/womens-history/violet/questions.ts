import { PHOTO_FAMILY, PHOTO_FOUR_WOMEN, PHOTO_PROMENADE, PHOTO_VIOLET } from '../womensHistory';
import { LIFE } from './violetLife';

/*
 * One question at each stop of Violet's Life, answered from that stop's own
 * words (poster 2's biography, BIO). A choice question names its right
 * answer by its place in `options`; `why` repeats what the stop says. A
 * think-and-tap question has no wrong answer: tapping shows what the stop
 * says, to think about.
 */

export type StopQuestion =
  | { kind: 'choice'; ask: string; options: readonly string[]; answer: number; why: string }
  | { kind: 'think'; ask: string; reveal: string };

export const QUESTIONS: Record<string, StopQuestion> = {
  violet: {
    kind: 'choice',
    ask: 'Violet Dina Want was “née Knight”. What does née tell us?',
    options: ['She was a knight', 'Knight was her family name before she married', 'She lived in a castle'],
    answer: 1,
    why: 'Née means “born”: she was born Violet Knight, and became Violet Want when she married.',
  },
  fulham: {
    kind: 'choice',
    ask: 'How many brothers and sisters did Violet have?',
    options: ['None', 'Two', 'Five: three sisters and two brothers'],
    answer: 2,
    why: 'She grew up with three sisters and two brothers, and helped care for her younger sisters.',
  },
  school: {
    kind: 'choice',
    ask: 'What did Violet’s teachers hope she would become?',
    options: ['A teacher', 'A doorman', 'A nurse'],
    answer: 0,
    why: 'Her teachers saw great potential in her and encouraged her to become a teacher.',
  },
  factory: {
    kind: 'choice',
    ask: 'Why did Violet leave school at 14?',
    options: ['She did not like school', 'To work and help support her family', 'To move to Essex'],
    answer: 1,
    why: 'Her sister needed a special school, so Violet went to work in a factory to help the family.',
  },
  garden: {
    kind: 'choice',
    ask: 'Why did many families in London grow vegetables and keep rabbits?',
    options: ['For food', 'To win prizes', 'To guard the house'],
    answer: 0,
    why: 'A garden was an important source of food, and rabbits were kept “for the pot”.',
  },
  marriage: {
    kind: 'choice',
    ask: 'Why did Violet say she chose Harold?',
    options: ['He was rich', 'He played the piano', 'He made her laugh'],
    answer: 2,
    why: 'She married Harold in 1928, saying she chose him because he made her laugh.',
  },
  family: {
    kind: 'choice',
    ask: 'Money was tight. How did Violet keep her children warm and well-dressed?',
    options: ['She made adult coats smaller to fit them', 'She bought new coats every year', 'They borrowed coats from neighbours'],
    answer: 0,
    why: 'A skilled seamstress, she took adult coats apart, resized them and sewed them back together.',
  },
  piano: {
    kind: 'choice',
    ask: 'How did Violet play the piano?',
    options: ['Only from sheet music', 'By ear', 'She never played it'],
    answer: 1,
    why: 'She played by ear, and her piano was the centre of lively “knees-up” parties.',
  },
  blitz: {
    kind: 'think',
    ask: 'Before the war, Violet’s family lived in streets close together. What do you think changed for them after the bombing?',
    reveal: 'The Blitz destroyed their homes and scattered the family across the South of England.',
  },
  essex: {
    kind: 'choice',
    ask: 'Which were Violet’s favourite flowers?',
    options: ['Begonias', 'Roses', 'Ice plants'],
    answer: 1,
    why: 'She grew many flowers in Essex, but roses were her favourite.',
  },
  greengrocer: {
    kind: 'choice',
    ask: 'How did Violet say to choose a good cauliflower?',
    options: ['Pick the biggest one', 'Pick one with no leaves', 'Pick one with its inner leaves curled over'],
    answer: 2,
    why: 'Inner leaves curled over keep the cauliflower’s curds white.',
  },
  later: {
    kind: 'choice',
    ask: 'In her seventies, what music did Violet love to hear on the radio?',
    options: ['Strauss waltzes', 'Brass bands', 'Pop songs'],
    answer: 0,
    why: 'She developed a love for Strauss waltzes, and she always kept a piano at home.',
  },
  legacy: {
    kind: 'think',
    ask: 'Violet’s story was written down so it would not be lost. Whose story in your family could you write down?',
    reveal: 'Try it: press “Make your own” at the top to make a timeline for a woman in your life.',
  },
};

/* The family photographs, captioned from what each one shows (womensHistory.ts). */
const CAPTIONS: Record<string, string> = {
  [PHOTO_VIOLET.src]: 'Violet as a young woman',
  [PHOTO_PROMENADE.src]: 'Out for a walk on a promenade',
  [PHOTO_FAMILY.src]: 'A family group outside a house',
  [PHOTO_FOUR_WOMEN.src]: 'Four women by a net-curtained window',
};

/*
 * Every stop after her name shows one of the four family photographs, in
 * place of a drawn keepsake: its own where the poster sets one beside those
 * words, and otherwise one of the others, captioned only with what it shows.
 */
const SHOWN: Record<string, { src: string; alt: string }> = {
  school: PHOTO_VIOLET,
  factory: PHOTO_VIOLET,
  garden: PHOTO_VIOLET,
  piano: PHOTO_PROMENADE,
  blitz: PHOTO_FAMILY,
  essex: PHOTO_FAMILY,
  greengrocer: PHOTO_PROMENADE,
  legacy: PHOTO_VIOLET,
};

export function photoAt(index: number): { src: string; alt: string; caption: string } | null {
  const stop = LIFE[index];
  if (!stop || index === 0) return null;
  const p = stop.photo ?? SHOWN[stop.id];
  if (!p) return null;
  return { src: p.src, alt: p.alt, caption: CAPTIONS[p.src] ?? '' };
}
