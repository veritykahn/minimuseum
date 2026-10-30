/**
 * Where each objective (4×, 10×, 40×) comes into focus on the knob, 0 to 100.
 * They lie close together, as on a real microscope whose lenses are made to
 * stay nearly in focus when you swap one for another: after a switch, a small
 * turn brings the view sharp again.
 */
export const FOCUS_AT = [40, 45, 50];

/** Where the knob is left when a sample goes on: well out of focus, to be turned until sharp. */
export const FOCUS_START = 12;

/** How out of focus the view is, in px of blur, for a knob position with an objective. */
export function blurFor(focus: number, objective: number): number {
  return Math.min(12, Math.max(0, Math.abs(focus - FOCUS_AT[objective]) - 2) * 0.42);
}
