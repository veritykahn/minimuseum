/**
 * Where the floating Map button sits. Most pages keep it in the bottom-right
 * corner; a page whose own controls live there declares a safer spot here,
 * so the button never covers a player, a hint or a word tile.
 *
 * - `corner`:  bottom-right (the default).
 * - `top`:     top-right, beside the page's own info button. For the 3D
 *              artifact viewers, whose bottom edge holds the title, the
 *              handling hints and (on the phonograph) the audio player.
 * - `clear`:   bottom-right, and on a phone the page gets extra room at its
 *              foot (see globals.css) so its last row of buttons or tiles
 *              can scroll clear of the button instead of ending under it.
 */
export type MapButtonPlacement = 'corner' | 'top' | 'clear';

const RULES: [RegExp, MapButtonPlacement][] = [
  [/^\/exhibitions\/seeing-is-deceiving\/artifacts\/(stereoscope|stereoscope-cards|victorian-cards)\/?$/, 'top'],
  [/^\/exhibitions\/harlem-renaissance\/artifacts\/(phonograph|fire-in-the-flint)\/?$/, 'top'],
  [/^\/exhibitions\/harlem-renaissance\/(harlem-in-words|migration-map)\/?$/, 'clear'],
];

export function mapButtonPlacement(pathname: string | null | undefined): MapButtonPlacement {
  if (!pathname) return 'corner';
  for (const [re, placement] of RULES) if (re.test(pathname)) return placement;
  return 'corner';
}
