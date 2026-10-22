import type { Lesson } from './types';
import whoseImage from './in-their-hands/whose-image-is-this.json';
import whoRuledJudaea from './in-their-hands/who-ruled-judaea.json';
import numbersInTheCoins from './in-their-hands/the-numbers-in-the-coins.json';
import smallWorksOfPower from './in-their-hands/small-works-of-power.json';

export type { Lesson, Step, Screen, Phase, Handout } from './types';

/**
 * Every lesson that can be taught on screen, by exhibition. The JSON is
 * generated from the PDF source; to add one, give its LESSON a "slug" and
 * its sections a "screen", run resources-src/export_lessons.py, and list it
 * here.
 */
export const LESSONS: Record<string, Lesson[]> = {
  'in-their-hands': [
    whoseImage as Lesson,
    whoRuledJudaea as Lesson,
    numbersInTheCoins as Lesson,
    smallWorksOfPower as Lesson,
  ],
};

export function lessonsFor(exhibition: string): Lesson[] {
  return LESSONS[exhibition] ?? [];
}

export function getLesson(exhibition: string, slug: string): Lesson | undefined {
  return lessonsFor(exhibition).find((l) => l.slug === slug);
}
