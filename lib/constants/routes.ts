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

  // Exhibitions
  EXHIBITIONS: '/exhibitions',
  FIRST_FLOOR: '/exhibitions/first-floor',
  GROUND_FLOOR: '/exhibitions/ground-floor',

  // Seeing is Deceiving exhibition
  SEEING_IS_DECEIVING: '/exhibitions/seeing-is-deceiving',
  ILLUSIONS: '/exhibitions/seeing-is-deceiving/illusions',
  ARTIFACTS: '/exhibitions/seeing-is-deceiving/artifacts',
  RESOURCES: '/exhibitions/seeing-is-deceiving/resources',

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
