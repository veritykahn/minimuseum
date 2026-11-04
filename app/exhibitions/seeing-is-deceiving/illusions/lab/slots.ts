import type { IllusionId } from './data';

/*
 * One picture slot per illusion, so an image file can replace the drawing.
 *
 * Files live in public/exhibitions/seeing/illusions/, named for the
 * illusion: `<id>.jpg` (or .webp, .png), and for an optional "Break it"
 * picture `<id>-break.jpg`. To swap one in, put the file in the folder and
 * set `file` (and `breakFile`) below with the picture's size in pixels.
 * Web size: at most 1600px on the long side, under about 400 KB.
 *
 * Where an illusion is measured by moving its own drawing (a slider that
 * stretches a bar, a marker you drag), the drawing stays for Try it and
 * Break it, and the picture is shown in Why? instead (`measured`). Every
 * other illusion shows the picture in all three steps, with the trick's
 * marks (a strip, a tracing) drawn over it where the bench knows them.
 *
 * `owner: true` credits it in the Sources drawer as one of the owner's
 * original illusion images.
 */

export const SLOT_DIR = '/exhibitions/seeing/illusions/';

export type Slot = {
  /** The Try it picture, in SLOT_DIR, or null for the drawing. */
  file: string | null;
  /** The Break it picture, if it has its own; otherwise the bench breaks the Try picture. */
  breakFile?: string | null;
  /** The picture's size in pixels: its marks are drawn in these units. */
  width: number;
  height: number;
  /** One of the owner's original illusion images. */
  owner?: boolean;
  /** The drawing is what the visitor moves: a picture only shows in Why?. */
  measured?: boolean;
};

const drawn = (measured = false): Slot => ({ file: null, width: 0, height: 0, measured });

export const SLOTS: Record<IllusionId, Slot> = {
  'blind-spot': drawn(),
  kanizsa: drawn(true),
  rubin: drawn(),
  ebbinghaus: drawn(true),
  'muller-lyer': drawn(true),
  ponzo: drawn(true),
  jastrow: drawn(true),
  // The owner's own checker shadow: the chip is measured beside it, and Break it draws a strip from A to B.
  checker: { file: 'checker.jpg', width: 1080, height: 757, owner: true },
  contrast: drawn(true),
  'cafe-wall': drawn(true),
  fraser: drawn(),
  poggendorff: drawn(true),
  lilac: drawn(true),
  waterfall: drawn(true),
  snakes: drawn(),
  // The owner's own Troxler fading: Break it nudges the same picture.
  troxler: { file: 'troxler.jpg', width: 1400, height: 1400, owner: true },
  stroop: drawn(true),
  paris: drawn(true),
  ames: drawn(true),
};

export const slotSrc = (file: string) => `${SLOT_DIR}${file}`;

/** Is the owner's picture on screen for this illusion (for the Sources drawer)? */
export const ownerPicture = (id: IllusionId) => Boolean(SLOTS[id].file && SLOTS[id].owner);
