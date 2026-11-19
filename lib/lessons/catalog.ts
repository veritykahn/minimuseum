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
  /**
   * A faith-based lesson: a Religion lesson, or one that prays with the
   * class. "Teach with this" labels it so, as one choice among the others.
   */
  faith?: true;
}

export const LESSON_CATALOG: Record<string, LessonCard[]> = {
  'in-their-hands': [
    { slug: 'two-tiny-coins', title: 'Two Tiny Coins', sub: 'PreK–Kindergarten · The Widow’s Mite', grade: 'PreK–K', minutes: 25, posters: [], faith: true },
    { slug: 'whose-hands-held-this', title: 'Whose Hands Held This?', sub: 'Grades 1–2 · Hands of History · Coins and the people who held them', grade: 'Grades 1–2', minutes: 30, posters: ['poster2'], faith: true },
    { slug: 'coin-detectives', title: 'Coin Detectives', sub: 'Grades 3–4 · Real or Replica? · Coins as evidence', grade: 'Grades 3–4', minutes: 40, posters: ['poster1', 'poster2'] },
    { slug: 'whose-image-is-this', title: 'Whose Image Is This?', sub: 'Grades 5–8 · Religion · The Tribute Penny', grade: 'Grades 5–8 · Religion', minutes: 45, posters: ['poster2'], faith: true },
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
    { slug: 'created-in-gods-image', title: 'Created in God’s Image', sub: 'Grades 5–8 · Religion', grade: 'Grades 5–8 · Religion', minutes: 45, posters: ['poster1'], faith: true },
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
    { slug: 'bearing-true-witness', title: 'Bearing True Witness', sub: 'Faith and Truth in a World of Deception · Grades 5–8 · Religion · 30 minutes', grade: 'Grades 5–8 · Religion', minutes: 30, posters: ['poster2'], faith: true },
    { slug: 'verdad-o-mentira', title: '¿Verdad o Mentira?', sub: 'Truth or Lie? · Grades 5–8 · Spanish · 30 minutes', grade: 'Grades 5–8 · Spanish', minutes: 30, posters: ['poster1', 'poster2'] },
    { slug: 'the-art-of-illusion', title: 'The Art of Illusion', sub: 'Theater’s Willing Deception · Grades 5–8 · Theater · 30 minutes', grade: 'Grades 5–8 · Theater', minutes: 30, posters: ['poster2'] },
    { slug: 'sound-illusions', title: 'Sound Illusions', sub: 'When Your Ears Deceive You · Grades 5–8 · Music · 30 minutes', grade: 'Grades 5–8 · Music', minutes: 30, posters: ['poster1', 'poster2'] },
  ],
  // <every-exhibition-catalog>
  'moon': [
    { slug: 'footprints-on-the-moon', title: 'Footprints on the Moon', sub: 'PreK–Kindergarten · Apollo 11 and the Moon’s dust', grade: 'PreK–K', minutes: 25, posters: ['poster1'] },
    { slug: 'what-made-this-sand', title: 'What Made This Sand?', sub: 'Grades 1–2 · Under the Microscope · Moon dust and Earth’s sand', grade: 'Grades 1–2', minutes: 30, posters: ['poster1'] },
    { slug: 'the-moons-record-book', title: 'The Moon’s Record Book', sub: 'Grades 3–4 · Our Incredible Moon · Craters, a giant crash and a piece of the Moon', grade: 'Grades 3–4', minutes: 40, posters: ['poster1'] },
    { slug: 'planet-hunters', title: 'Planet Hunters', sub: 'Grades 5–8 Science · Another Earth · Finding planets we cannot see', grade: 'Grades 5–8 · Science', minutes: 45, posters: ['poster2'] },
    { slug: 'weighing-the-evidence', title: 'Weighing the Evidence', sub: 'Grades 5–8 ELA · Our Incredible Moon · Claim, counterclaim and evidence', grade: 'Grades 5–8 · ELA', minutes: 45, posters: ['poster1', 'poster2'] },
    { slug: 'how-far-is-far', title: 'How Far Is Far?', sub: 'Grades 5–8 Math · Our Incredible Moon and Another Earth · Rates, scale and very large numbers', grade: 'Grades 5–8 · Math', minutes: 45, posters: ['poster1', 'poster2'] },
    { slug: 'an-artists-impression', title: 'An Artist’s Impression', sub: 'Grades 5–8 Art · Our Incredible Moon · Evidence and imagination', grade: 'Grades 5–8 · Art', minutes: 45, posters: ['poster2'] },
  ],
  'egypt': [
    { slug: 'hidden-in-the-dark', title: 'Hidden in the Dark', sub: 'PreK–Kindergarten · Tomb Explorer · A painted wall from long ago', grade: 'PreK–K', minutes: 25, posters: ['poster2'] },
    { slug: 'write-like-a-scribe', title: 'Write Like a Scribe', sub: 'Grades 1–2 · Your Name in Hieroglyphs · Signs, sounds and a royal oval', grade: 'Grades 1–2', minutes: 30, posters: ['poster1'] },
    { slug: 'crack-the-code', title: 'Crack the Code', sub: 'Grades 3–4 · The Rosetta Stone Decoder · One message, three scripts', grade: 'Grades 3–4', minutes: 40, posters: ['poster1'] },
    { slug: 'who-built-the-pyramids', title: 'Who Really Built the Pyramids?', sub: 'Grades 5–8 · Social Studies · Testing a belief against the evidence', grade: 'Grades 5–8 · Social Studies', minutes: 45, posters: ['poster1'] },
    { slug: 'weighed-against-a-feather', title: 'Weighed Against a Feather', sub: 'Grades 5–8 · ELA · Reading the scribe Ani’s words', grade: 'Grades 5–8 · ELA', minutes: 45, posters: ['poster2'] },
    { slug: 'seventy-days', title: 'Seventy Days', sub: 'Grades 5–8 · Science · How the Egyptians preserved a body', grade: 'Grades 5–8 · Science', minutes: 45, posters: ['poster2'] },
    { slug: 'stories-on-the-wall', title: 'Stories on the Wall', sub: 'Grades 5–8 · Art · How Egyptian tomb painters told a story', grade: 'Grades 5–8 · Art', minutes: 45, posters: [] },
  ],
  'america-250': [
    { slug: 'we-put-our-names-to-it', title: 'We Put Our Names to It', sub: 'PreK–Kindergarten · Signing the Declaration', grade: 'PreK–K', minutes: 25, posters: ['poster1'] },
    { slug: 'a-star-for-every-state', title: 'A Star for Every State', sub: 'Grades 1–2 · Add a Star', grade: 'Grades 1–2', minutes: 30, posters: ['poster2'] },
    { slug: 'declaration-detectives', title: 'Declaration Detectives', sub: 'Grades 3–4 · A Copy of a Copy', grade: 'Grades 3–4', minutes: 40, posters: ['poster1'] },
    { slug: 'what-it-was-what-it-became', title: 'What It Was, What It Became', sub: 'Grades 5–8 · Social Studies · The Declaration as a primary source', grade: 'Grades 5–8 · Social Studies', minutes: 45, posters: ['poster1', 'poster2'] },
    { slug: 'self-evident', title: 'Self-Evident', sub: 'Grades 5–8 · ELA · The Declaration as an argument', grade: 'Grades 5–8 · ELA', minutes: 45, posters: ['poster1', 'poster2'] },
    { slug: 'counting-a-nation', title: 'Counting a Nation', sub: 'Grades 5–8 · Math · Data and proportion from 1776 to 50 stars', grade: 'Grades 5–8 · Math', minutes: 45, posters: ['poster2'] },
    { slug: 'painting-the-moment', title: 'Painting the Moment', sub: 'Grades 5–8 · Art · How history paintings make a myth', grade: 'Grades 5–8 · Art', minutes: 45, posters: ['poster1', 'poster2'] },
  ],
  'victorian': [
    { slug: 'light-up-the-parlor', title: 'Light Up the Parlor', sub: 'PreK–Kindergarten · Dickens’ Christmas Parlour', grade: 'PreK–K', minutes: 25, posters: ['poster2'] },
    { slug: 'a-card-to-send', title: 'A Card to Send', sub: 'Grades 1–2 · Christmas Card Maker · The first Christmas card', grade: 'Grades 1–2', minutes: 30, posters: ['poster2'] },
    { slug: 'messages-down-the-wire', title: 'Messages Down the Wire', sub: 'Grades 3–4 · Inventions Workshop · The telegraph and Morse code', grade: 'Grades 3–4', minutes: 40, posters: ['poster1'] },
    { slug: 'revolution-for-everyone', title: 'Revolution for Everyone?', sub: 'Grades 5–8 · Social Studies · Change, reform and who it reached', grade: 'Grades 5–8 · Social Studies', minutes: 45, posters: ['poster1', 'poster2'] },
    { slug: 'drawing-with-light', title: 'Drawing with Light', sub: 'Grades 5–8 · Science · Light, the negative and the print', grade: 'Grades 5–8 · Science', minutes: 45, posters: ['poster1'] },
    { slug: 'railway-time', title: 'Railway Time', sub: 'Grades 5–8 · Math · Elapsed time, offsets and rate', grade: 'Grades 5–8 · Math', minutes: 45, posters: ['poster1'] },
    { slug: 'good-design-for-everyone', title: 'Good Design for Everyone', sub: 'Grades 5–8 · Art · Motif, pattern and the decorative arts', grade: 'Grades 5–8 · Art', minutes: 45, posters: ['poster1'] },
  ],
  'great-war': [
    { slug: 'quiet-at-eleven', title: 'Quiet at Eleven', sub: 'PreK–Kindergarten · Poppies, a clock and a quiet time', grade: 'PreK–K', minutes: 25, posters: ['poster2'] },
    { slug: 'what-came-home', title: 'What Came Home', sub: 'Grades 1–2 · The display case · A helmet, a razor and the doughboys', grade: 'Grades 1–2', minutes: 30, posters: ['poster1', 'poster2'] },
    { slug: 'remember-a-soldier', title: 'Remember a Soldier', sub: 'Grades 3–4 · The Memorial · Reading a memorial card', grade: 'Grades 3–4', minutes: 40, posters: ['poster2'] },
    { slug: 'the-last-minute', title: 'The Last Minute of the War', sub: 'Grades 5–8 · Social Studies · Reading the record of November 11, 1918', grade: 'Grades 5–8 · Social Studies', minutes: 45, posters: ['poster1', 'poster2'] },
    { slug: 'the-language-of-remembrance', title: 'The Language of Remembrance', sub: 'Grades 5–8 · ELA · How words are built to be remembered', grade: 'Grades 5–8 · ELA', minutes: 45, posters: ['poster1', 'poster2'] },
    { slug: 'silhouette-and-poppy', title: 'Silhouette and Poppy', sub: 'Grades 5–8 · Art · Designing for remembrance', grade: 'Grades 5–8 · Art', minutes: 45, posters: ['poster1', 'poster2'] },
    { slug: 'music-for-remembering', title: 'Music for Remembering', sub: 'Grades 5–8 · Music · Marches, a Largo and the silence', grade: 'Grades 5–8 · Music', minutes: 45, posters: ['poster1', 'poster2'] },
  ],
  'womens-history': [
    { slug: 'violets-big-family', title: 'Violet’s Big Family', sub: 'PreK–Kindergarten · Home, family and the letters we keep', grade: 'PreK–K', minutes: 25, posters: ['poster2'] },
    { slug: 'violets-keepsakes', title: 'Violet’s Keepsakes', sub: 'Grades 1–2 · Violet’s Life · A life in order', grade: 'Grades 1–2', minutes: 30, posters: ['poster2'] },
    { slug: 'history-at-home', title: 'History at Home', sub: 'Grades 3–4 · Who Gets Remembered? · An everyday life as history', grade: 'Grades 3–4', minutes: 40, posters: ['poster1', 'poster2'] },
    { slug: 'the-war-at-home', title: 'The War at Home', sub: 'Grades 5–8 · Social Studies · One family on the home front', grade: 'Grades 5–8 · Social Studies', minutes: 45, posters: ['poster1', 'poster2'] },
    { slug: 'everybody-has-a-story', title: 'Everybody Has a Story', sub: 'Grades 5–8 · ELA · Biography and the oral-history interview', grade: 'Grades 5–8 · ELA', minutes: 45, posters: ['poster2'] },
    { slug: 'who-counts', title: 'Who Counts?', sub: 'Grades 5–8 · Math · Percent, ratio and the median of a monument count', grade: 'Grades 5–8 · Math', minutes: 45, posters: ['poster1'] },
    { slug: 'a-life-in-shapes', title: 'A Life in Shapes', sub: 'Grades 5–8 · Art · Abstraction, design and a life', grade: 'Grades 5–8 · Art', minutes: 45, posters: ['poster1', 'poster2'] },
  ],
  'holocaust': [
    { slug: 'step-by-step', title: 'Step by Step', sub: 'Grades 5–8 · Social Studies · How the Holocaust unfolded, 1933–1945', grade: 'Grades 5–8 · Social Studies', minutes: 45, posters: ['poster2'] },
    { slug: 'in-their-own-words', title: 'In Their Own Words', sub: 'Grades 5–8 · ELA · Diaries, testimony and quotation in context', grade: 'Grades 5–8 · ELA', minutes: 45, posters: ['poster2'] },
    { slug: 'how-do-we-remember', title: 'How Do We Remember?', sub: 'Grades 5–8 · Art · Memorials as works of art', grade: 'Grades 5–8 · Art', minutes: 45, posters: ['poster1'] },
    { slug: 'sound-and-silence', title: 'Sound and Silence', sub: 'Grades 5–8 · Music · How the exhibition remembers with sound, and without it', grade: 'Grades 5–8 · Music', minutes: 45, posters: ['poster1', 'poster2'] },
  ],
  'black-history': [
    { slug: 'a-doll-like-me', title: 'A Doll Like Me', sub: 'PreK–Kindergarten · The Importance of Black Barbie', grade: 'PreK–K', minutes: 25, posters: ['poster2'] },
    { slug: 'from-a-week-to-a-month', title: 'From a Week to a Month', sub: 'Grades 1–2 · Carter G. Woodson and Black History Month', grade: 'Grades 1–2', minutes: 30, posters: ['poster1'] },
    { slug: 'milestones', title: 'Milestones', sub: 'Grades 3–4 · The Black Barbie Timeline', grade: 'Grades 3–4', minutes: 40, posters: ['poster2'] },
    { slug: 'evidence-for-the-court', title: 'Evidence for the Court', sub: 'Grades 5–8 · Social Studies · The Doll Test and Brown v. Board', grade: 'Grades 5–8 · Social Studies', minutes: 45, posters: ['poster2'] },
    { slug: 'making-the-case', title: 'Making the Case', sub: 'Grades 5–8 · ELA · Poster 1 as an argument', grade: 'Grades 5–8 · ELA', minutes: 45, posters: ['poster1'] },
    { slug: 'designed-to-be-seen', title: 'Designed to Be Seen', sub: 'Grades 5–8 · Art · Designing for representation', grade: 'Grades 5–8 · Art', minutes: 45, posters: ['poster1', 'poster2'] },
    { slug: 'whos-on-our-shelf', title: 'Who’s on Our Shelf?', sub: 'Grades 5–8 · Math · Surveying our books', grade: 'Grades 5–8 · Math', minutes: 45, posters: ['poster2'] },
  ],
  'writing-revolution': [
    { slug: 'clack-clack-ding', title: 'Clack, Clack, Ding!', sub: 'PreK–Kindergarten · The typewriter and its keys', grade: 'PreK–K', minutes: 25, posters: ['poster1', 'poster2'] },
    { slug: 'no-erasing', title: 'No Erasing!', sub: 'Grades 1–2 · The typewriter and the computer', grade: 'Grades 1–2', minutes: 30, posters: ['poster1'] },
    { slug: 'qwertys-secret', title: 'QWERTY’s Secret', sub: 'Grades 3–4 · Why the letters on a keyboard are where they are', grade: 'Grades 3–4', minutes: 40, posters: ['poster2'] },
    { slug: 'chipping-at-the-gates', title: 'Chipping at the Gates', sub: 'Grades 5–8 · ELA · Reading an argument, choosing words', grade: 'Grades 5–8 · ELA', minutes: 45, posters: ['poster1'] },
    { slug: 'who-gets-to-write', title: 'Who Gets to Write?', sub: 'Grades 5–8 · Social Studies · Technology, access and voice', grade: 'Grades 5–8 · Social Studies', minutes: 45, posters: ['poster1'] },
    { slug: 'is-it-a-fair-test', title: 'Is It a Fair Test?', sub: 'Grades 5–8 · Science · Claims, variables and bias', grade: 'Grades 5–8 · Science', minutes: 45, posters: ['poster1', 'poster2'] },
    { slug: 'designed-to-be-read', title: 'Designed to Be Read', sub: 'Grades 5–8 · Art · Graphic design and type', grade: 'Grades 5–8 · Art', minutes: 45, posters: ['poster1', 'poster2'] },
  ],
  'fear-lab': [
    { slug: 'whats-in-the-box', title: 'What’s in the Box?', sub: 'PreK–Kindergarten · The Fear Boxes · Naming feelings and being brave', grade: 'PreK–K', minutes: 25, posters: ['poster1'] },
    { slug: 'tiger-or-wind', title: 'Tiger or Wind?', sub: 'Grades 1–2 · The Rustling Bushes · Your brain’s alarm', grade: 'Grades 1–2', minutes: 30, posters: ['poster1'] },
    { slug: 'is-it-really-a-monster', title: 'Is It Really a Monster?', sub: 'Grades 3–4 · Pareidolia · How your brain fills in the dark', grade: 'Grades 3–4', minutes: 40, posters: ['poster1'] },
    { slug: 'the-science-of-not-knowing', title: 'The Science of Not Knowing', sub: 'Grades 5–8 · Science · Ambiguity, dread and the brain’s alarm', grade: 'Grades 5–8 · Science', minutes: 45, posters: ['poster1'] },
    { slug: 'page-turners', title: 'Page Turners', sub: 'Grades 5–8 · ELA · Suspense, the Gothic and what a monster stands for', grade: 'Grades 5–8 · ELA', minutes: 45, posters: ['poster2'] },
    { slug: 'racing-hearts', title: 'Racing Hearts', sub: 'Grades 5–8 · PE · Your pulse, your alarm and the rustling bushes', grade: 'Grades 5–8 · PE', minutes: 45, posters: ['poster1'] },
    { slug: 'the-shape-of-fear', title: 'The Shape of Fear', sub: 'Grades 5–8 · Art · Silhouette, a three-color palette and what you leave out', grade: 'Grades 5–8 · Art', minutes: 45, posters: ['poster1', 'poster2'] },
  ],
  // </every-exhibition-catalog>
};

/** The id of each exhibition's Lessons room on the museum map. */
export const LESSON_ROOM_IDS: Record<string, string> = {
  'seeing-is-deceiving': 'sid-lessons',
  'harlem-renaissance': 'hr-lessons',
  'in-their-hands': 'ith-lessons',
  // <every-exhibition-rooms>
  'moon': 'moon-lessons',
  'egypt': 'egy-lessons',
  'america-250': 'a250-lessons',
  'victorian': 'vic-lessons',
  'great-war': 'gw-lessons',
  'womens-history': 'wh-lessons',
  'holocaust': 'hol-lessons',
  'black-history': 'bh-lessons',
  'writing-revolution': 'wr-lessons',
  'fear-lab': 'fl-lessons',
  // </every-exhibition-rooms>
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
