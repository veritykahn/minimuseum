/**
 * Where each objective (4×, 10×, 40×) comes into focus on the knob, 0 to 100.
 * They lie close together, as on a real microscope whose lenses are made to
 * stay nearly in focus when you swap one for another: after a switch, a turn
 * or two brings the view sharp again.
 */
export const FOCUS_AT = [40, 47, 54];

/** Where the knob is left when a sample goes on: well out of focus, to be turned until sharp. */
export const FOCUS_START = 12;

/** How far one press of − or + (or an arrow key) turns the knob: from the start, three presses bring a sample sharp. */
export const FOCUS_STEP = 8;

/**
 * How near the mark counts as sharp, either side. Wider than half a step, so
 * a press can never jump right over the sharp zone.
 */
export const SHARP_WITHIN = 4;

/** How out of focus the view is, in px of blur, for a knob position with an objective. */
export function blurFor(focus: number, objective: number): number {
  return Math.min(12, Math.max(0, Math.abs(focus - FOCUS_AT[objective]) - SHARP_WITHIN) * 0.36);
}
