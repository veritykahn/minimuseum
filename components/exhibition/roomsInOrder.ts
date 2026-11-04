/**
 * An exhibition's rooms in the order its Explore row and its case's
 * Interactives both list them: a room marked as the way in (`start`) first,
 * the rest as the config has them. One function for both, so the two lists
 * cannot drift apart.
 */
export function roomsInOrder<R extends { start?: string }>(rooms: readonly R[] | undefined): R[] {
  const all = [...(rooms ?? [])];
  return [...all.filter((r) => r.start), ...all.filter((r) => !r.start)];
}
