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
  /** who it is for, short enough for a link: "Grades 5–8 · Religion" */
  grade: string;
  minutes: number;
  posters: string[];
}

export const LESSON_CATALOG: Record<string, LessonCard[]> = {
  'in-their-hands': [
    { slug: 'two-tiny-coins', title: 'Two Tiny Coins', sub: 'PreK–Kindergarten · The Widow’s Mite', grade: 'PreK–K', minutes: 25, posters: [] },
    { slug: 'whose-hands-held-this', title: 'Whose Hands Held This?', sub: 'Grades 1–2 · Hands of History · Coins and the people who held them', grade: 'Grades 1–2', minutes: 30, posters: ['poster2'] },
    { slug: 'coin-detectives', title: 'Coin Detectives', sub: 'Grades 3–4 · Real or Replica? · Coins as evidence', grade: 'Grades 3–4', minutes: 40, posters: ['poster1', 'poster2'] },
    { slug: 'whose-image-is-this', title: 'Whose Image Is This?', sub: 'Grades 5–8 · Religion · The Tribute Penny', grade: 'Grades 5–8 · Religion', minutes: 45, posters: ['poster2'] },
    { slug: 'who-ruled-judaea', title: 'Who Ruled Judaea?', sub: 'Grades 5–8 · Social Studies · Coins as primary sources', grade: 'Grades 5–8 · Social Studies', minutes: 45, posters: ['poster2'] },
    { slug: 'the-numbers-in-the-coins', title: 'The Numbers in the Coins', sub: 'Grades 5–8 · Math · Timelines, ratios and the widow’s gift', grade: 'Grades 5–8 · Math', minutes: 45, posters: ['poster2'] },
    { slug: 'small-works-of-power', title: 'Small Works of Power', sub: 'Grades 5–8 · Art · Portrait, symbol and inscription', grade: 'Grades 5–8 · Art', minutes: 45, posters: ['poster1'] },
  ],
  'harlem-renaissance': [
    { slug: 'music-stories-and-movement', title: 'Music, Stories & Movement', sub: 'PreK–K · Homeroom / General', grade: 'PreK–K', minutes: 25, posters: ['poster1'] },
    { slug: 'stories-of-a-great-journey', title: 'Stories of a Great Journey', sub: 'Grades 1–2 · Homeroom / General', grade: 'Grades 1–2', minutes: 30, posters: ['poster1'] },
    { slug: 'making-something-new', title: 'Making Something New', sub: 'Grades 3–4 · Homeroom / General', grade: 'Grades 3–4', minutes: 35, posters: ['poster1'] },
    { slug: 'rhythm-sound-and-the-science-of-music', title: 'Rhythm, Sound & the Science of Music', sub: 'Grades 5–8 · Science', grade: 'Grades 5–8 · Science', minutes: 35, posters: ['poster1'] },
    { slug: 'voice-and-verse', title: 'Voice & Verse', sub: 'The Literature of the Harlem Renaissance · Grades 5–8 · ELA', grade: 'Grades 5–8 · ELA', minutes: 35, posters: ['poster1'] },
    { slug: 'why-people-move', title: 'Why People Move: The Great Migration', sub: 'Grades 5–8 · Social Studies', grade: 'Grades 5–8 · Social Studies', minutes: 35, posters: ['poster1'] },
    { slug: 'seeing-in-silhouette', title: 'Seeing in Silhouette', sub: 'Grades 5–8 · Art · Aaron Douglas and the visual language of the Harlem Renaissance', grade: 'Grades 5–8 · Art', minutes: 39, posters: ['poster1'] },
    { slug: 'migration-by-numbers', title: 'Migration by Numbers', sub: 'Grades 5–8 · Mathematics · The Great Migration in data', grade: 'Grades 5–8 · Math', minutes: 45, posters: ['poster1'] },
    { slug: 'move-like-harlem', title: 'Move Like Harlem', sub: 'Grades 5–8 · Physical Education · The Lindy Hop, the Charleston and the Savoy Ballroom', grade: 'Grades 5–8 · PE', minutes: 45, posters: ['poster1'] },
    { slug: 'created-in-gods-image', title: 'Created in God’s Image', sub: 'Grades 5–8 · Religion', grade: 'Grades 5–8 · Religion', minutes: 45, posters: ['poster1'] },
    { slug: 'el-renacimiento-de-harlem', title: 'El Renacimiento de Harlem', sub: 'Grades 5–8 · Spanish', grade: 'Grades 5–8 · Spanish', minutes: 45, posters: ['poster1'] },
    { slug: 'voice-body-story', title: 'Voice, Body, Story', sub: 'Grades 5–8 · Theater', grade: 'Grades 5–8 · Theater', minutes: 40, posters: ['poster1'] },
    { slug: 'the-sound-of-harlem', title: 'The Sound of Harlem', sub: 'Grades 5–8 · Music', grade: 'Grades 5–8 · Music', minutes: 39, posters: ['poster1'] },
  ],
  'seeing-is-deceiving': [
    { slug: 'my-eyes-can-trick-me', title: 'My Eyes Can Trick Me!', sub: 'PreK–K · 20 minutes · General / Homeroom', grade: 'PreK–K', minutes: 20, posters: ['poster1'] },
    { slug: 'brain-detective', title: 'Brain Detective', sub: 'Looking Closer at What We See · Grades 1–2 · 25 minutes · General / Homeroom', grade: 'Grades 1–2', minutes: 25, posters: ['poster1'] },
    { slug: 'fact-checkers', title: 'Fact-Checkers', sub: 'How to Know What’s Real · Grades 3–4 · 30 minutes · General / Homeroom', grade: 'Grades 3–4', minutes: 30, posters: ['poster1', 'poster2'] },
    { slug: 'how-vision-works', title: 'How Vision Works', sub: 'The Science of Seeing · Grades 5–8 · Science · 30 minutes', grade: 'Grades 5–8 · Science', minutes: 30, posters: ['poster1'] },
    { slug: 'evaluating-sources', title: 'Evaluating Sources', sub: 'Visual and Written Evidence · Grades 5–8 · ELA · 30 minutes', grade: 'Grades 5–8 · ELA', minutes: 30, posters: ['poster2'] },
    { slug: 'visual-propaganda-through-history', title: 'Visual Propaganda Through History', sub: 'Grades 5–8 · Social Studies · 30 minutes', grade: 'Grades 5–8 · Social Studies', minutes: 30, posters: ['poster2'] },
    { slug: 'creating-optical-illusions', title: 'Creating Optical Illusions', sub: 'Art Meets Science · Grades 5–8 · Art · 30 minutes', grade: 'Grades 5–8 · Art', minutes: 30, posters: ['poster1'] },
    { slug: 'geometry-of-perspective', title: 'Geometry of Perspective', sub: 'Math Behind Optical Illusions · Grades 5–8 · Math · 30 minutes', grade: 'Grades 5–8 · Math', minutes: 30, posters: ['poster1'] },
    { slug: 'vision-and-athletics', title: 'Vision and Athletics', sub: 'How Your Eyes Affect Performance · Grades 5–8 · PE · 25 minutes', grade: 'Grades 5–8 · PE', minutes: 25, posters: ['poster1'] },
    { slug: 'bearing-true-witness', title: 'Bearing True Witness', sub: 'Faith and Truth in a World of Deception · Grades 5–8 · Religion · 30 minutes', grade: 'Grades 5–8 · Religion', minutes: 30, posters: ['poster2'] },
    { slug: 'verdad-o-mentira', title: '¿Verdad o Mentira?', sub: 'Truth or Lie? · Grades 5–8 · Spanish · 30 minutes', grade: 'Grades 5–8 · Spanish', minutes: 30, posters: ['poster1', 'poster2'] },
    { slug: 'the-art-of-illusion', title: 'The Art of Illusion', sub: 'Theater’s Willing Deception · Grades 5–8 · Theater · 30 minutes', grade: 'Grades 5–8 · Theater', minutes: 30, posters: ['poster2'] },
    { slug: 'sound-illusions', title: 'Sound Illusions', sub: 'When Your Ears Deceive You · Grades 5–8 · Music · 30 minutes', grade: 'Grades 5–8 · Music', minutes: 30, posters: ['poster1', 'poster2'] },
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
