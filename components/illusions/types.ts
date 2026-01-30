/**
 * Shared types for illusion components
 */

export type IllusionProps = {
  illusionType: string;
  src?: string;
  revealSrc?: string;
  altRevealSrc?: string;
  question?: string;
  answer?: string;
  scienceExplanation?: string;
  isPoster1: boolean;
};

export type IllusionGuessState<T> = {
  guess: T | null;
  revealed: boolean;
  handleGuess: (guess: T) => void;
  reset: () => void;
};

export type IllusionCategory = 'image' | 'svg' | 'static' | 'animation';

// Common illusion state
export type IllusionState = {
  revealed: boolean;
  showScience: boolean;
};
