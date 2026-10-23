/**
 * What the exhibition pages and the museum map need to show a lesson and
 * link to it, without loading the lesson itself (its JSON is large, and the
 * map is on every page). __tests__/lib/lessonCatalog.test.ts keeps this in
 * step with lib/lessons: every registered lesson is listed here, with the
 * same title, subtitle and minutes.
 *
 * `posters` names the exhibition posters (their ids on the exhibition page)
 * a lesson goes with, so a teacher who has just walked a poster sees the
 * lessons that teach it. A lesson on no poster is still on the exhibition's
 * lesson list.
 */

export interface LessonCard {
  slug: string;
  title: string;
  sub: string;
  minutes: number;
  posters: string[];
}

export const LESSON_CATALOG: Record<string, LessonCard[]> = {
  'in-their-hands': [
    { slug: 'two-tiny-coins', title: 'Two Tiny Coins', sub: 'PreK–Kindergarten · The Widow’s Mite', minutes: 25, posters: [] },
    { slug: 'whose-hands-held-this', title: 'Whose Hands Held This?', sub: 'Grades 1–2 · Hands of History · Coins and the people who held them', minutes: 30, posters: ['poster2'] },
    { slug: 'coin-detectives', title: 'Coin Detectives', sub: 'Grades 3–4 · Real or Replica? · Coins as evidence', minutes: 40, posters: ['poster1', 'poster2'] },
    { slug: 'whose-image-is-this', title: 'Whose Image Is This?', sub: 'Grades 5–8 · Religion · The Tribute Penny', minutes: 45, posters: ['poster2'] },
    { slug: 'who-ruled-judaea', title: 'Who Ruled Judaea?', sub: 'Grades 5–8 · Social Studies · Coins as primary sources', minutes: 45, posters: ['poster2'] },
    { slug: 'the-numbers-in-the-coins', title: 'The Numbers in the Coins', sub: 'Grades 5–8 · Math · Timelines, ratios and the widow’s gift', minutes: 45, posters: ['poster2'] },
    { slug: 'small-works-of-power', title: 'Small Works of Power', sub: 'Grades 5–8 · Art · Portrait, symbol and inscription', minutes: 45, posters: ['poster1'] },
  ],
};

/** The id of each exhibition's Lessons room on the museum map. */
export const LESSON_ROOM_IDS: Record<string, string> = {
  'seeing-is-deceiving': 'sid-lessons',
  'harlem-renaissance': 'hr-lessons',
  'in-their-hands': 'ith-lessons',
};

export function catalogFor(exhibition: string): LessonCard[] {
  return LESSON_CATALOG[exhibition] ?? [];
}

export function lessonsForPoster(exhibition: string, poster: string): LessonCard[] {
  return catalogFor(exhibition).filter((l) => l.posters.includes(poster));
}

export function hasLessons(exhibition: string): boolean {
  return catalogFor(exhibition).length > 0;
}

export const lessonsPath = (exhibition: string) => `/exhibitions/${exhibition}/lessons`;
export const lessonPath = (exhibition: string, slug: string) => `${lessonsPath(exhibition)}/${slug}`;

/** The exhibition page opened in projector mode at a poster: the deep link usePosterDeepLink reads. */
export const posterProjectorPath = (exhibition: string, poster: string) =>
  `/exhibitions/${exhibition}?projector=1&poster=${poster.replace(/\D/g, '')}`;
