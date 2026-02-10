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
  ['first-floor', 'fear-lab'],
  ['first-floor', 'great-war'],

  // Seeing is Deceiving sub-pages
  ['seeing-is-deceiving', 'illusions'],
  ['seeing-is-deceiving', 'artifacts'],
  ['seeing-is-deceiving', 'resources'],

  // Harlem Renaissance sub-pages
  ['harlem-renaissance', 'hr-artifacts'],
  ['harlem-renaissance', 'hr-resources'],

  // Ground Floor connections (for future)
  ['ground-floor', 'egypt'],
  ['ground-floor', 'victorian'],
  ['ground-floor', 'holocaust'],
  ['ground-floor', 'black-barbie'],
  ['ground-floor', 'womens-history'],
];
