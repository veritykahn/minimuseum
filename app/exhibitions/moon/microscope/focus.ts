/** Where each power (low, medium, high) comes into focus on the knob, 0 to 100. */
export const FOCUS_AT = [40, 56, 72];

/** How out of focus the view is, in px of blur, for a knob position at a power. */
export function blurFor(focus: number, power: number): number {
  return Math.min(12, Math.max(0, Math.abs(focus - FOCUS_AT[power]) - 3) * 0.42);
}
