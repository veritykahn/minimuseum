/**
 * The landing page's logo, "The Mini Museum", with a picture in each of its
 * two big Ms. The words are one drawing (logo-words.png); each M is a picture
 * seen through an M-shaped window (its mask), so either picture can be
 * changed by dropping a new file in, with nothing else to redraw:
 *
 *   public/home/m-mini.jpg     the M of "Mini" (top)
 *   public/home/m-museum.jpg   the M of "Museum" (bottom)
 *
 * Any photograph will do: it is scaled to fill its M and centered, so a
 * roughly square crop with the subject in the middle works best. To use
 * another name or format, change the path here.
 *
 * The frame is the old logo.png's (2000 x 775), so the Ms sit exactly where
 * they did; logo.png itself stays as the site's logo in structured data.
 */
export const HOME_M_IMAGES = {
  mini: '/home/m-mini.jpg',
  museum: '/home/m-museum.jpg',
} as const;

/** The words, without the Ms. */
export const HOME_LOGO_WORDS = '/home/logo-words.png';

/** The logo's frame, and each M's window in it, in its pixels. */
export const HOME_LOGO_SIZE = { width: 2000, height: 775 } as const;

export const HOME_M_WINDOWS = {
  mini: { x: 320, y: 0, width: 543, height: 384, mask: '/home/m-mini-mask.png' },
  museum: { x: 320, y: 384, width: 543, height: 391, mask: '/home/m-museum-mask.png' },
} as const;
