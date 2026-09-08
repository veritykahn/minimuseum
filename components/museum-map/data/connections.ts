import { RoomConnection } from '../types';

/**
 * Connection lines between rooms on the museum map
 */
export const CONNECTIONS: RoomConnection[] = [
  // From Great Hall
  ['greathall', 'about'],
  ['greathall', 'contact'],
  ['greathall', 'first-floor'],
  ['greathall', 'ground-floor'],

  // First Floor connections
  ['first-floor', 'seeing-is-deceiving'],
  ['first-floor', 'harlem-renaissance'],
  ['first-floor', 'in-their-hands'],
  ['first-floor', 'fear-lab'],
  ['first-floor', 'great-war'],

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

  // Ground Floor connections (for future)
  ['ground-floor', 'egypt'],
  ['ground-floor', 'victorian'],
  ['ground-floor', 'holocaust'],
  ['ground-floor', 'black-barbie'],
  ['ground-floor', 'womens-history'],
];
