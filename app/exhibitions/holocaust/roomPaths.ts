/*
 * Where the Holocaust exhibition's rooms are. They were once one room,
 * Never Forget, at /exhibitions/holocaust/stones, with three tabs, each with
 * its own address (#stone, #stillness, #walk); now each is its own page. Lay
 * a Stone keeps the old address, and an old link to one of its tabs is sent
 * on to the room that tab became (oldTabRoom, used by Lay a Stone's page:
 * the part after # never reaches the server, so the page itself sends it on).
 */

export const ROOM_PATHS = {
  walk: '/exhibitions/holocaust/walk',
  stones: '/exhibitions/holocaust/stones',
  stillness: '/exhibitions/holocaust/stillness',
} as const;

/** Where an old Never Forget tab's address now leads: null for Lay a Stone itself (#stone, or none). */
export function oldTabRoom(hash: string): string | null {
  const h = hash.replace(/^#/, '');
  if (h === 'walk') return ROOM_PATHS.walk;
  if (h === 'stillness') return ROOM_PATHS.stillness;
  return null;
}
