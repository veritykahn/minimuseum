/*
 * The microscope's lenses and stage, as numbers.
 *
 * A revolving nosepiece holds three objective lenses, 4×, 10× and 40×, under
 * a 10× eyepiece: the total is the two multiplied (40×, 100×, 400×). Here the
 * lenses zoom in on a photograph already taken down a microscope, so each
 * also says how far it zooms into the photo (`zoom`), no more than the
 * photographs hold sharp.
 *
 * The stage holds the slide. Moving it shows another part of the photo: where
 * the middle of the view is, 0 to 1 across and down the photo. The higher
 * the power, the less of the photo is in view, and the view never runs off
 * its edge.
 */

export const EYEPIECE = 10;

export const OBJECTIVES = [
  { lens: 4, zoom: 1.25 },
  { lens: 10, zoom: 1.9 },
  { lens: 40, zoom: 3 },
] as const;

/** The total magnification with an objective: eyepiece × objective. */
export const totalPower = (objective: number) => EYEPIECE * OBJECTIVES[objective].lens;

export type Pan = { x: number; y: number };
export const CENTRE: Pan = { x: 0.5, y: 0.5 };

/** How much of the photo's width is in view with an objective, 0 to 1. */
export const visibleFraction = (objective: number) => 1 / OBJECTIVES[objective].zoom;

/** Keep the view on the photo: its middle no nearer an edge than half the view. */
export function clampPan(p: Pan, objective: number): Pan {
  const h = visibleFraction(objective) / 2;
  const c = (v: number) => Math.min(1 - h, Math.max(h, v));
  return { x: c(p.x), y: c(p.y) };
}

/**
 * Move the slide by (dx, dy) shares of the view (the arrow buttons and keys
 * move it a quarter of the view at a time): the picture moves the way of the
 * arrow, so the view's middle moves the other way.
 */
export function nudge(p: Pan, dx: number, dy: number, objective: number): Pan {
  const v = visibleFraction(objective);
  return clampPan({ x: p.x - dx * v, y: p.y - dy * v }, objective);
}

/** Which ways the slide can move no further: the view has reached the photo's edge (moving the slide left brings its right edge into view). */
export function atEdge(p: Pan, objective: number) {
  const h = visibleFraction(objective) / 2;
  const e = 1e-6;
  return { left: p.x >= 1 - h - e, right: p.x <= h + e, up: p.y >= 1 - h - e, down: p.y <= h + e };
}
