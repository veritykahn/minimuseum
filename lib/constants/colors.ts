/**
 * Color constants used throughout the Mini Museum application.
 * These should be the single source of truth for all color values.
 */

export const COLORS = {
  // Backgrounds
  background: '#000000',
  backgroundDark: '#0a0a0a',
  backgroundLight: '#1a1a1a',
  backgroundLighter: '#2a2a2a',

  // Foreground / Text
  foreground: '#fafafa',
  textPrimary: '#fafafa',
  textSecondary: '#a3a3a3',
  textMuted: '#737373',
  textSubtle: '#525252',

  // Brand Colors
  accent: '#a8d5e5', // Waves blue - primary accent
  sage: '#7D8471', // Sage green - secondary accent

  // Interactive States
  hoverBorder: 'rgba(168, 213, 229, 0.3)',
  hoverBackground: 'rgba(168, 213, 229, 0.1)',

  // Poster-specific (for IllusionRenderer)
  poster1: {
    background: '#e0dede',
    text: '#2a2a2a',
    accent: '#5a7a8a',
  },
  poster2: {
    background: '#0a0a0a',
    text: '#a8d5e5',
    accent: '#a8d5e5',
  },

  // UI Elements
  scrollbarTrack: '#0a0a0a',
  scrollbarThumb: '#333333',
  scrollbarThumbHover: '#555555',
  border: '#333333',
  borderLight: '#444444',
} as const;

// Type for accessing color values
export type ColorKey = keyof typeof COLORS;
