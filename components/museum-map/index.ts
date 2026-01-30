/**
 * Museum Map module exports
 *
 * The data is extracted for maintainability.
 * The main MuseumMap component still lives at components/MuseumMap.tsx
 * and can be gradually migrated to use these extracted modules.
 */

export * from './types';
export { MUSEUM_ROOMS, getRoomById, getRoomByPath } from './data/rooms';
export { CONNECTIONS } from './data/connections';
