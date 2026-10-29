import { RoomConnection } from '../types';
import { LESSON_ROOM_IDS, hasLessons } from '@/lib/lessons/catalog';
import { FLOORS, STUDIO } from '@/lib/floors';

/** A floor's room id: the last part of its path ('second-floor'). */
const floorId = (path: string) => path.slice(path.lastIndexOf('/') + 1);

/**
 * Connection lines between rooms on the museum map
 */
export const CONNECTIONS: RoomConnection[] = [
  // From Great Hall
  ['greathall', 'about'],
  ['greathall', 'contact'],
  ...[...FLOORS, STUDIO].map((floor): RoomConnection => ['greathall', floorId(floor.path)]),

  // Each floor to its exhibitions
  ...FLOORS.flatMap((floor) => floor.exhibitions.map((e): RoomConnection => [floorId(floor.path), e.slug])),

  // Each exhibition to its display cases and its other pages; the
  // interactive rooms open from a case, not from the hall.
  ['seeing-is-deceiving', 'artifacts'],
  ['seeing-is-deceiving', 'resources'],
  ['artifacts', 'illusions'],
  ['artifacts', 'sid-optical-toys'],

  ['harlem-renaissance', 'hr-artifacts'],
  ['harlem-renaissance', 'hr-resources'],
  ['hr-artifacts', 'hr-jazz-lab'],
  ['hr-artifacts', 'hr-harlem-in-words'],
  ['hr-artifacts', 'hr-migration-map'],

  // In Their Hands: each case opens onto its own room
  ['in-their-hands', 'ith-case-6'],
  ['in-their-hands', 'ith-case-7'],
  ['in-their-hands', 'ith-case-8'],
  ['ith-case-6', 'ith-timeline'],
  ['ith-case-7', 'ith-hands'],
  ['ith-case-8', 'ith-real-or-replica'],

  ['great-war', 'gw-case'],
  ['egypt', 'eg-case'],
  ['moon', 'mo-case'],
  ['victorian', 'vb-case'],
  ['womens-history', 'wh-case'],
  ['holocaust', 'ho-case'],
  ['black-history', 'bh-case'],
  ['writing-revolution', 'wr-case'],
  ['america-250', 'ap-case'],
  ['fear-lab', 'fl-case'],
  ['gw-case', 'gw-silence'],
  ['gw-case', 'gw-memorial'],
  ['bh-case', 'bh-timeline'],
  ['bh-case', 'bh-representation'],
  ['wr-case', 'wr-typing'],
  ['wh-case', 'wh-violet'],
  ['wh-case', 'wh-remembered'],
  ['ho-case', 'ho-stones'],
  ['vb-case', 'vb-christmas-card'],
  ['vb-case', 'vb-inventions'],
  ['vb-case', 'vb-christmas-parlour'],
  ['mo-case', 'mo-microscope'],
  ['ap-case', 'ap-sign'],
  ['fl-case', 'fl-what-scares-you'],

  // Each exhibition's Lessons room, once it has lessons
  ...Object.keys(LESSON_ROOM_IDS)
    .filter(hasLessons)
    .map((exhibition): RoomConnection => [exhibition, LESSON_ROOM_IDS[exhibition]]),
];
