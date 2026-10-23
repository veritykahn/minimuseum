import type { CSSProperties } from 'react';

/*
 * The projector look for each exhibition's posters. The ground, text and
 * accent follow the games' projector themes on feat/projector-mode (Seeing is
 * Deceiving and In Their Hands are the same values; the Harlem Renaissance
 * takes its posters' purple and rose rather than the Jazz Lab's black and
 * gold). Contrast (WCAG 2.2): --pj-ink and --pj-muted are 4.5:1 or better on
 * --pj-bg, and --pj-on-accent is 4.5:1 or better on --pj-accent.
 */

export const SEEING_POSTER_THEME = {
  '--pj-bg': '#0a0a0a',
  '--pj-ink': '#e2f0f5',
  '--pj-muted': '#9fc0cc',
  '--pj-accent': '#a8d5e5',
  '--pj-on-accent': '#0a0a0a',
  '--pj-display': "'Cormorant Garamond', Georgia, serif",
  '--pj-body': "'Outfit', system-ui, sans-serif",
} as CSSProperties;

export const HARLEM_POSTER_THEME = {
  '--pj-bg': '#140c1f',
  '--pj-ink': '#efd9b4',
  '--pj-muted': '#c3afcc',
  '--pj-accent': '#d992ba',
  '--pj-on-accent': '#140c1f',
  '--pj-display': "'Cormorant Garamond', Georgia, serif",
  '--pj-body': "'Outfit', system-ui, sans-serif",
} as CSSProperties;

export const ITH_POSTER_THEME = {
  '--pj-bg': '#1c1409',
  '--pj-ink': '#f5edd8',
  '--pj-muted': '#b3a68c',
  '--pj-accent': '#c9a84c',
  '--pj-on-accent': '#1c1409',
  '--pj-display': "'Cormorant Garamond', Georgia, serif",
  '--pj-body': "'Outfit', system-ui, sans-serif",
} as CSSProperties;

export const SEEING_POSTER_LINKS = [
  { label: 'Seeing is Deceiving teacher resources', href: '/exhibitions/seeing-is-deceiving/resources' },
];

export const HARLEM_POSTER_LINKS = [
  { label: 'Harlem Renaissance teacher resources', href: '/exhibitions/harlem-renaissance/resources' },
];

export const ITH_POSTER_LINKS = [
  { label: 'Teacher resources', href: '/exhibitions/in-their-hands/resources' },
];
