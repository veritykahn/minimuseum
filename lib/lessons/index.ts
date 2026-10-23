import type { Lesson } from './types';
import twoTinyCoins from './in-their-hands/two-tiny-coins.json';
import whoseHands from './in-their-hands/whose-hands-held-this.json';
import coinDetectives from './in-their-hands/coin-detectives.json';
import whoseImage from './in-their-hands/whose-image-is-this.json';
import whoRuledJudaea from './in-their-hands/who-ruled-judaea.json';
import numbersInTheCoins from './in-their-hands/the-numbers-in-the-coins.json';
import smallWorksOfPower from './in-their-hands/small-works-of-power.json';
import musicStoriesAndMovement from './harlem-renaissance/music-stories-and-movement.json';
import storiesOfAGreatJourney from './harlem-renaissance/stories-of-a-great-journey.json';
import makingSomethingNew from './harlem-renaissance/making-something-new.json';
import scienceOfMusic from './harlem-renaissance/rhythm-sound-and-the-science-of-music.json';
import voiceAndVerse from './harlem-renaissance/voice-and-verse.json';
import whyPeopleMove from './harlem-renaissance/why-people-move.json';
import seeingInSilhouette from './harlem-renaissance/seeing-in-silhouette.json';
import migrationByNumbers from './harlem-renaissance/migration-by-numbers.json';
import moveLikeHarlem from './harlem-renaissance/move-like-harlem.json';
import createdInGodsImage from './harlem-renaissance/created-in-gods-image.json';
import elRenacimiento from './harlem-renaissance/el-renacimiento-de-harlem.json';
import voiceBodyStory from './harlem-renaissance/voice-body-story.json';
import soundOfHarlem from './harlem-renaissance/the-sound-of-harlem.json';

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
    whoRuledJudaea as Lesson,
    numbersInTheCoins as Lesson,
    smallWorksOfPower as Lesson,
  ],
  'harlem-renaissance': [
    musicStoriesAndMovement as Lesson,
    storiesOfAGreatJourney as Lesson,
    makingSomethingNew as Lesson,
    scienceOfMusic as Lesson,
    voiceAndVerse as Lesson,
    whyPeopleMove as Lesson,
    seeingInSilhouette as Lesson,
    migrationByNumbers as Lesson,
    moveLikeHarlem as Lesson,
    createdInGodsImage as Lesson,
    elRenacimiento as Lesson,
    voiceBodyStory as Lesson,
    soundOfHarlem as Lesson,
  ],
};

export function lessonsFor(exhibition: string): Lesson[] {
  return LESSONS[exhibition] ?? [];
}

export function getLesson(exhibition: string, slug: string): Lesson | undefined {
  return lessonsFor(exhibition).find((l) => l.slug === slug);
}
