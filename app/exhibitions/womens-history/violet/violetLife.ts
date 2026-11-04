import type { ApprovedFact } from '@/components/exhibition/FactNote';
import type { SourceGroup } from '@/components/exhibition/SourcesDrawer';
import { BIO, BIO_LEAD, PHOTO_FAMILY, PHOTO_FOUR_WOMEN, PHOTO_PROMENADE, PHOTO_VIOLET } from '../womensHistory';
import type { KeepsakeId } from './Keepsake';

/*
 * Violet's life, as a thread of keepsakes: her places and moments, in the
 * order poster 2 tells them. Every word of her story is the poster's, set
 * from womensHistory.ts (BIO), whole paragraphs at a time; the only words
 * here are each stop's short name, and its year where the poster gives one.
 * The photographs are the four from poster 2, each beside the paragraphs
 * the poster sets it with. The letters themselves are not transcribed
 * anywhere, so none of their words appear.
 *
 * One stop adds a museum note: at the Blitz, when the first V-1 fell on
 * London. It is not the poster's, but owner-approved and fact-checked, set
 * apart from her story with its source (Imperial War Museums).
 */

export const BLITZ_NOTE: ApprovedFact = {
  text: 'The first V-1 to hit London fell on June 13, 1944.',
  sources: [{ label: 'Imperial War Museums', href: 'https://memorials.iwm.org.uk/memorial/96212' }],
};

export type LifeStop = {
  /** The stop's address (#fulham). */
  id: string;
  /** Its short name, under the keepsake and as the card's heading. */
  label: string;
  /** Its year or age, only where the poster gives one. */
  when?: string;
  keepsake: KeepsakeId;
  /** Set in spaced capitals before the first paragraph, as the poster does. */
  lead?: string;
  paragraphs: readonly string[];
  photo?: { src: string; alt: string };
  /** A museum note from outside the poster, with its source. */
  note?: ApprovedFact;
};

export const LIFE: readonly LifeStop[] = [
  // The first stop is her name and dates (page.tsx sets it from the poster's lettering).
  { id: 'violet', label: 'Violet', keepsake: 'spool', paragraphs: [] },
  { id: 'fulham', label: 'Fulham', when: '1907', keepsake: 'house', lead: BIO_LEAD, paragraphs: [BIO.childhood], photo: PHOTO_VIOLET },
  { id: 'school', label: 'Home and school', keepsake: 'certificate', paragraphs: [BIO.father] },
  { id: 'factory', label: 'The factory', when: 'At 14', keepsake: 'machine', paragraphs: [BIO.factory] },
  { id: 'garden', label: 'The garden', keepsake: 'rabbit', paragraphs: [BIO.garden] },
  { id: 'marriage', label: 'Marriage', when: '1928', keepsake: 'rings', paragraphs: [BIO.faith, BIO.harold], photo: PHOTO_PROMENADE },
  { id: 'family', label: 'Family', when: '1929', keepsake: 'coat', paragraphs: [BIO.family, BIO.seamstress], photo: PHOTO_FAMILY },
  { id: 'piano', label: 'The piano', keepsake: 'piano', paragraphs: [BIO.music] },
  { id: 'blitz', label: 'The Blitz', keepsake: 'window', paragraphs: [BIO.blitz, BIO.blast], note: BLITZ_NOTE },
  { id: 'essex', label: 'Essex', keepsake: 'rose', paragraphs: [BIO.essex] },
  { id: 'greengrocer', label: 'The greengrocer', keepsake: 'cauliflower', paragraphs: [BIO.greengrocer] },
  { id: 'later', label: 'Later years', when: '1956', keepsake: 'radio', paragraphs: [BIO.later], photo: PHOTO_FOUR_WOMEN },
  { id: 'legacy', label: 'Her story', keepsake: 'needle', paragraphs: [BIO.legacy] },
];

export type Point = { x: number; y: number };

/**
 * Where the keepsakes sit on a band `w` × `h` (CSS px): in one gentle wave
 * across it, or, on a narrow screen, in `rows` rows that run back and forth,
 * like a seam sewn across a cloth and back.
 */
export function threadLayout(n: number, w: number, h: number, rows = 1): Point[] {
  if (n <= 0 || w <= 0 || h <= 0) return [];
  const perRow = Math.ceil(n / rows);
  const pad = Math.min(70, w / (perRow * 2));
  const out: Point[] = [];
  for (let i = 0; i < n; i++) {
    const row = Math.floor(i / perRow);
    const col = i % perRow;
    const along = perRow === 1 ? 0.5 : col / (perRow - 1);
    const t = row % 2 === 0 ? along : 1 - along;
    const rowH = h / rows;
    const wave = rows === 1 ? Math.sin(i * 0.95) * rowH * 0.16 : Math.sin(i * 1.3) * rowH * 0.08;
    out.push({ x: pad + t * (w - pad * 2), y: rowH * (row + 0.5) + wave - rowH * 0.08 });
  }
  return out;
}

/** A smooth path through the points (Catmull-Rom, as cubic Béziers). */
export function threadPath(pts: Point[]): string {
  if (pts.length === 0) return '';
  let d = `M${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d += ` C${c1.x.toFixed(1)} ${c1.y.toFixed(1)} ${c2.x.toFixed(1)} ${c2.y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

/** The room's Sources drawer: each stop's museum note, by stop. The photographs are the owner's family's own and carry no credit. */
export const VIOLET_SOURCES: readonly SourceGroup[] = LIFE.filter((s) => s.note).map((s) => ({
  title: s.label,
  items: s.note!.sources.map((src) => ({ ...src, note: s.note!.text.replace(/\.$/, '') })),
}));
