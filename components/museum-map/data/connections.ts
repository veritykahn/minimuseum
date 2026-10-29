import { RoomConnection } from '../types';
import { LESSON_ROOM_IDS, hasLessons } from '@/lib/lessons/catalog';
import { GROUND_FLOOR, FIRST_FLOOR } from '@/lib/floors';

/**
 * Connection lines between rooms on the museum map
 */
export const CONNECTIONS: RoomConnection[] = [
  // From Great Hall
  ['greathall', 'about'],
  ['greathall', 'contact'],
  ['greathall', 'first-floor'],
  ['greathall', 'ground-floor'],

  // Each floor to its exhibitions
  ...GROUND_FLOOR.exhibitions.map((e): RoomConnection => ['ground-floor', e.slug]),
  ...FIRST_FLOOR.exhibitions.map((e): RoomConnection => ['first-floor', e.slug]),

  // Seeing is Deceiving sub-pages
  ['seeing-is-deceiving', 'illusions'],
  ['seeing-is-deceiving', 'artifacts'],
  ['seeing-is-deceiving', 'resources'],

  // Harlem Renaissance sub-pages
  ['harlem-renaissance', 'hr-artifacts'],
  ['harlem-renaissance', 'hr-jazz-lab'],
  ['harlem-renaissance', 'hr-harlem-in-words'],
  ['harlem-renaissance', 'hr-migration-map'],
  ['harlem-renaissance', 'hr-resources'],

  // In Their Hands sub-pages
  ['in-their-hands', 'ith-case-6'],
  ['in-their-hands', 'ith-case-7'],
  ['in-their-hands', 'ith-case-8'],
  ['in-their-hands', 'ith-timeline'],
  ['in-their-hands', 'ith-hands'],
  ['in-their-hands', 'ith-real-or-replica'],

  // The Great War sub-pages
  ['great-war', 'gw-case'],
  ['egypt', 'eg-case'],
  ['moon', 'mo-case'],
  ['victorian', 'vb-case'],
  ['womens-history', 'wh-case'],
  ['holocaust', 'ho-case'],
  ['black-history', 'bh-case'],
  ['writing-revolution', 'wr-case'],
  ['great-war', 'gw-silence'],
  ['great-war', 'gw-memorial'],
  ['black-history', 'bh-timeline'],
  ['writing-revolution', 'wr-typing'],
  ['womens-history', 'wh-violet'],
  ['womens-history', 'wh-remembered'],
  ['holocaust', 'ho-stones'],
  ['america-250', 'ap-sign'],
  ['victorian', 'vb-optical-toys'],
  ['moon', 'mo-microscope'],
  ['fear-lab', 'fl-what-scares-you'],

  // Each exhibition's Lessons room, once it has lessons
  ...Object.keys(LESSON_ROOM_IDS)
    .filter(hasLessons)
    .map((exhibition): RoomConnection => [exhibition, LESSON_ROOM_IDS[exhibition]]),
];
