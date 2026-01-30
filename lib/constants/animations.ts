/**
 * Animation timing constants for consistent motion throughout the app.
 */

export const ANIMATION_DURATION = {
  instant: 0,
  fast: 150,
  normal: 300,
  slow: 500,
  slower: 700,
  pageTransition: 400,
  fadeIn: 400,
  fadeOut: 300,
  reveal: 600,
} as const;

export const ANIMATION_DELAY = {
  stagger: 100,
  sequence: 200,
  long: 500,
} as const;

export const EASING = {
  default: 'ease',
  smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
} as const;

// CSS transition helper
export function transition(
  property: string = 'all',
  duration: keyof typeof ANIMATION_DURATION = 'normal',
  easing: keyof typeof EASING = 'smooth'
): string {
  return `${property} ${ANIMATION_DURATION[duration]}ms ${EASING[easing]}`;
}
