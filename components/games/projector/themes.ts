import type { CSSProperties } from 'react';

/*
 * The projector look for each exhibition. Contrast on each ground (WCAG 2.2):
 * every --pj-ink and --pj-muted pair is 4.5:1 or better, and the accent,
 * right and wrong colors are used for large text or with a mark beside them.
 */

/** In Their Hands on the projector: the timeline's umber and gold. */
export const ITH_PROJECTOR_THEME = {
  '--pj-bg': '#1c1409',
  '--pj-ink': '#f5edd8',
  '--pj-muted': '#b3a68c',
  '--pj-accent': '#c9a84c',
  '--pj-on-accent': '#1c1409',
  '--pj-right': '#7cc98a',
  '--pj-wrong': '#e0b45c',
  '--pj-display': "'Cormorant Garamond', Georgia, serif",
  '--pj-body': "'Outfit', system-ui, sans-serif",
  // Cormorant's old-style figures are hard to read from the back of a room.
  '--pj-number': "'Outfit', system-ui, sans-serif",
  '--pj-number-weight': '300',
} as CSSProperties;

export const ITH_PROJECTOR_FONTS =
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Outfit:wght@300;400;500;600&display=swap';

export const ITH_CLASSROOM_LINKS = [
  { label: 'In Their Hands lessons', href: '/exhibitions/in-their-hands/lessons' },
  { label: 'Teacher resources', href: '/exhibitions/in-their-hands/resources' },
];


/** Harlem Renaissance, the Jazz Lab: Art Deco black and gold. */
export const JAZZ_PROJECTOR_THEME = {
  '--pj-bg': '#0a0a0a',
  '--pj-ink': '#e8e0d0',
  '--pj-muted': '#b3a994',
  '--pj-accent': '#c9a94e',
  '--pj-on-accent': '#0a0a0a',
  '--pj-right': '#7bc67b',
  '--pj-wrong': '#e08a6a',
  '--pj-display': "'Playfair Display', Georgia, serif",
  '--pj-body': "'Josefin Sans', system-ui, sans-serif",
} as CSSProperties;

export const JAZZ_PROJECTOR_FONTS =
  'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,500&family=Josefin+Sans:wght@300;400;600;700&display=swap';

export const HARLEM_CLASSROOM_LINKS = [
  { label: 'Harlem Renaissance teacher resources', href: '/exhibitions/harlem-renaissance/resources' },
];

/** Seeing Is Deceiving, the Perception Lab: black and pale blue. */
export const SEEING_PROJECTOR_THEME = {
  '--pj-bg': '#0a0a0a',
  '--pj-ink': '#e2f0f5',
  '--pj-muted': '#9fc0cc',
  '--pj-accent': '#a8d5e5',
  '--pj-on-accent': '#0a0a0a',
  '--pj-right': '#8fe0a5',
  '--pj-wrong': '#f2b880',
  '--pj-display': "'Cormorant Garamond', Georgia, serif",
  '--pj-body': "'Outfit', system-ui, sans-serif",
  // Cormorant's figures read as letters at this size ("11" looks like "I I").
  '--pj-number': "'Outfit', system-ui, sans-serif",
  '--pj-number-weight': '200',
  // the illusion is the point: it takes the larger share beside the answer
  '--pj-media-share': '1.15fr',
} as CSSProperties;

export const SEEING_PROJECTOR_FONTS = ITH_PROJECTOR_FONTS;

export const SEEING_CLASSROOM_LINKS = [
  { label: 'Seeing Is Deceiving teacher resources', href: '/exhibitions/seeing-is-deceiving/resources' },
];
