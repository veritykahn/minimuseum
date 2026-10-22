import type { Lesson } from './types';
import twoTinyCoins from './in-their-hands/two-tiny-coins.json';
import whoseHands from './in-their-hands/whose-hands-held-this.json';
import coinDetectives from './in-their-hands/coin-detectives.json';
import whoseImage from './in-their-hands/whose-image-is-this.json';

export type { Lesson, Step, Screen, Phase, Handout } from './types';

/**
 * Every lesson that can be taught on screen, by exhibition. The JSON is
 * generated from the PDF source; to add one, give its LESSON a "slug" and
 * its sections a "screen", run resources-src/export_lessons.py, and list it
 * here.
 */
export const LESSONS: Record<string, Lesson[]> = {
  'in-their-hands': [
    twoTinyCoins as Lesson,
    whoseHands as Lesson,
    coinDetectives as Lesson,
    whoseImage as Lesson,
  ],
};

export function lessonsFor(exhibition: string): Lesson[] {
  return LESSONS[exhibition] ?? [];
}

export function getLesson(exhibition: string, slug: string): Lesson | undefined {
  return lessonsFor(exhibition).find((l) => l.slug === slug);
}
