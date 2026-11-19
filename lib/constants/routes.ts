/**
 * Route constants for the Mini Museum application.
 * Use these instead of hardcoding paths throughout the codebase.
 */

export const ROUTES = {
  // Main pages
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  GREAT_HALL: '/greathall',
  /** The Resources hub: every exhibition's lessons and printables, by role. */
  RESOURCES_HUB: '/resources',

  // Exhibitions
  EXHIBITIONS: '/exhibitions',
  THIRD_FLOOR: '/exhibitions/third-floor',
  SECOND_FLOOR: '/exhibitions/second-floor',
  FIRST_FLOOR: '/exhibitions/first-floor',
  GROUND_FLOOR: '/exhibitions/ground-floor',

  // Seeing is Deceiving exhibition
  SEEING_IS_DECEIVING: '/exhibitions/seeing-is-deceiving',
  ILLUSIONS: '/exhibitions/seeing-is-deceiving/illusions',
  ARTIFACTS: '/exhibitions/seeing-is-deceiving/artifacts',
  /** The exhibition's old resources page, kept working; rooms link to "Teach with this" and the hub instead. */
  RESOURCES: '/exhibitions/seeing-is-deceiving/resources',

  // In Their Hands exhibition
  IN_THEIR_HANDS: '/exhibitions/in-their-hands',

  // Artifact sub-pages
  STEREOSCOPE: '/exhibitions/seeing-is-deceiving/artifacts/stereoscope',
  STEREOSCOPE_CARDS: '/exhibitions/seeing-is-deceiving/artifacts/stereoscope-cards',
  VICTORIAN_CARDS: '/exhibitions/seeing-is-deceiving/artifacts/victorian-cards',
} as const;

// Type for route keys
export type RouteKey = keyof typeof ROUTES;
export type Route = (typeof ROUTES)[RouteKey];

/**
 * Helper to check if a path matches or starts with a route
 */
export function isActiveRoute(pathname: string, route: Route): boolean {
  if (route === ROUTES.HOME) {
    return pathname === '/';
  }
  return pathname === route || pathname.startsWith(route + '/');
}
