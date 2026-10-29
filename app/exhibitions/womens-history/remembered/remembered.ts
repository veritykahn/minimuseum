import type { ApprovedFact, FactSource } from '@/components/exhibition/FactNote';

/*
 * Who Gets Remembered?: why women's stories matter, beside the famous men
 * usually told. The room is built on poster 1's own lines (POSTER below,
 * word for word from womensHistory.ts). Its few facts from outside the
 * poster all come from one primary source, Monument Lab's National Monument
 * Audit (2021), checked against the report itself, and are set in the
 * report's own figures and close to its own wording, each with its source:
 *   - the Top 50 list (p. 12 of the report, "Top 50 Individuals Recorded in
 *     US Public Monuments"), ranks and counts as printed; three names
 *     take their usual spelling (the report prints "José Marti", "Simón
 *     Bolivar" and "Merriweather Lewis");
 *   - Key Finding II (pp. 17–18): the three women in the Top 50, the 6%,
 *     the mermaids and the congresswomen, and the Black/Indigenous, Latinx,
 *     Asian, Pacific Islander and LGBTQ+ figures;
 *   - the study set of 48,178 monuments (p. 10).
 * The questions and the room's own lines are interface text and make no
 * claims.
 */

export const AUDIT: FactSource = {
  label: 'Monument Lab, National Monument Audit (2021)',
  href: 'https://www.monumentlab.com/monumentlab-nationalmonumentaudit.pdf',
};

/** Poster 1's own words, as womensHistory.ts sets them. */
export const POSTER = {
  overshadowed: 'Historically, women\'s roles have often been overshadowed by those of men, who were traditionally credited with "shaping history."',
  deeper: "However, women's lived experiences provide a deeper, more nuanced understanding of the past—not just through the contributions of overlooked inventors, activists, artists, and writers, but also through the everyday lives of ordinary women.",
  households: 'Their roles in households and communities offer invaluable insight into the way societies function, making it essential to recognize and celebrate their impact in shaping human history.',
} as const;

export type Monumented = { rank: number; name: string; monuments: number; woman?: true };

/** The audit's Top 50: the individuals with the most recorded public monuments in the US, with their counts, as printed. */
export const TOP_50: readonly Monumented[] = [
  { rank: 1, name: 'Abraham Lincoln', monuments: 193 },
  { rank: 2, name: 'George Washington', monuments: 171 },
  { rank: 3, name: 'Christopher Columbus', monuments: 149 },
  { rank: 4, name: 'Martin Luther King Jr.', monuments: 86 },
  { rank: 5, name: 'Saint Francis of Assisi', monuments: 73 },
  { rank: 6, name: 'Robert E. Lee', monuments: 59 },
  { rank: 7, name: 'Casimir Pulaski', monuments: 51 },
  { rank: 8, name: 'Benjamin Franklin', monuments: 48 },
  { rank: 9, name: 'John F. Kennedy', monuments: 44 },
  { rank: 10, name: 'Thomas Jefferson', monuments: 36 },
  { rank: 11, name: 'Ulysses S. Grant', monuments: 35 },
  { rank: 12, name: 'Stonewall Jackson', monuments: 33 },
  { rank: 13, name: 'Jefferson Davis', monuments: 30 },
  { rank: 14, name: 'Marquis de Lafayette', monuments: 30 },
  { rank: 15, name: 'Andrew Jackson', monuments: 27 },
  { rank: 16, name: 'Theodore Roosevelt', monuments: 27 },
  { rank: 17, name: 'William McKinley', monuments: 27 },
  { rank: 18, name: 'Joan of Arc', monuments: 26, woman: true },
  { rank: 19, name: 'Nathan Hale', monuments: 24 },
  { rank: 20, name: 'William Shakespeare', monuments: 24 },
  { rank: 21, name: 'José Martí', monuments: 23 },
  { rank: 22, name: 'Thaddeus Kosciuszko', monuments: 22 },
  { rank: 23, name: 'William Clark', monuments: 22 },
  { rank: 24, name: 'Harriet Tubman', monuments: 21, woman: true },
  { rank: 25, name: 'Tecumseh', monuments: 21 },
  { rank: 26, name: 'Alexander Hamilton', monuments: 20 },
  { rank: 27, name: 'Junípero Serra', monuments: 20 },
  { rank: 28, name: 'Sacagawea', monuments: 20, woman: true },
  { rank: 29, name: 'Frederick Douglass', monuments: 19 },
  { rank: 30, name: 'Martin Luther', monuments: 19 },
  { rank: 31, name: 'Jacques Marquette', monuments: 18 },
  { rank: 32, name: 'Dwight Eisenhower', monuments: 17 },
  { rank: 33, name: 'Franklin D. Roosevelt', monuments: 17 },
  { rank: 34, name: 'Anthony Wayne', monuments: 16 },
  { rank: 35, name: 'Meriwether Lewis', monuments: 16 },
  { rank: 36, name: 'Simón Bolívar', monuments: 16 },
  { rank: 37, name: 'Robert L. Burns', monuments: 15 },
  { rank: 38, name: 'St. Paul', monuments: 15 },
  { rank: 39, name: 'Washington Irving', monuments: 14 },
  { rank: 40, name: 'William Penn', monuments: 14 },
  { rank: 41, name: 'George Rogers Clark', monuments: 13 },
  { rank: 42, name: 'John Marshall', monuments: 13 },
  { rank: 43, name: 'John Sullivan', monuments: 13 },
  { rank: 44, name: 'Nathan Bedford Forrest', monuments: 13 },
  { rank: 45, name: 'Oliver Hazard Perry', monuments: 13 },
  { rank: 46, name: 'Sam Houston', monuments: 13 },
  { rank: 47, name: 'Daniel Boone', monuments: 12 },
  { rank: 48, name: 'David Glasgow Farragut', monuments: 12 },
  { rank: 49, name: 'James Garfield', monuments: 12 },
  { rank: 50, name: 'John Logan', monuments: 12 },
];

export const WOMEN_IN_TOP_50 = TOP_50.filter((p) => p.woman);

export const FACT_TOP_50: ApprovedFact = {
  text: 'These are the 50 people with the most recorded public monuments in the United States. Joan of Arc, Harriet Tubman and Sacagawea are the only women among them: 6% of the Top 50.',
  sources: [AUDIT],
};

export const FACT_MERMAIDS: ApprovedFact = {
  text: 'Among the 48,178 monuments the audit studied, there are more monuments depicting mermaids (22) than monuments to US congresswomen (just two: Barbara Jordan of Texas and Millicent Fenwick of New Jersey).',
  sources: [AUDIT],
};

export const FACT_OTHERS: ApprovedFact = {
  text: 'Only five of the Top 50 were Black or Indigenous, and there are no US-born Latinx, Asian, Pacific Islander or self-identified LGBTQ+ people among them.',
  sources: [AUDIT],
};

/** What is the guess's verdict? Interface text, from the count alone. */
export function guessLine(guess: number, actual = WOMEN_IN_TOP_50.length): string {
  if (guess === actual) return `You guessed ${guess}. You were right: only ${actual}.`;
  return `You guessed ${guess}. The answer is ${actual}.`;
}

/*
 * The scale. On one pan, the men "traditionally credited with 'shaping
 * history'"; on the other, what poster 1 says the story leaves out, in the
 * poster's own words, laid on one at a time. With all six, it is level.
 */
export const WEIGHTS = [
  { id: 'inventors', label: 'overlooked inventors' },
  { id: 'activists', label: 'activists' },
  { id: 'artists', label: 'artists' },
  { id: 'writers', label: 'writers' },
  { id: 'everyday', label: 'the everyday lives of ordinary women' },
  { id: 'households', label: 'their roles in households and communities' },
] as const;
export type WeightId = (typeof WEIGHTS)[number]['id'];

/** The beam's tilt in degrees for `placed` weights: down to the men's side at first, level with all six. */
export const START_TILT = -16;
export function beamTilt(placed: number): number {
  const k = Math.max(0, Math.min(WEIGHTS.length, placed)) / WEIGHTS.length;
  return Math.round(START_TILT * (1 - k) * 100) / 100 || 0;
}

/** For the class: open questions, no claims. */
export const QUESTIONS = [
  'Whose statues, plaques or street names are there where you live? Who chose them?',
  'Why might so few women have monuments?',
  'Whose stories are missing from the history you learn, and how could we find them?',
  'If you could raise a monument to one woman in your life or your community, who would it be, and why?',
] as const;
