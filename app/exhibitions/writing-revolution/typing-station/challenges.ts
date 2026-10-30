import { promptWords } from '@/lib/classBoard';

/*
 * The station's challenges, worked out apart from the machines so they can
 * be tested: the race (the line typed on both machines, against the clock),
 * the teacher's word list (which of its words a page has used), and "beat
 * ten" on the top row (the poster's "typewriter" has ten letters).
 */

/* ───────── The race ───────── */

/**
 * Typed text as the race compares it: case, curly quotes and runs of spaces
 * or line breaks don't count, and a word broken at a hyphen across the
 * typewriter's lines is joined up again.
 */
export function raceText(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/-[ \t]*\n\s*/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
}

/** How many single-letter changes stand between what was typed and the line: 0 is a match. */
export function mistakesLeft(typed: string, line: string): number {
  const a = [...raceText(typed)];
  const b = [...raceText(line)];
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[b.length];
}

/** A stopwatch's reading: 0:07.4, 1:02.0. */
export function clockText(ms: number): string {
  const tenths = Math.max(0, Math.floor(ms / 100));
  const m = Math.floor(tenths / 600);
  const s = Math.floor((tenths % 600) / 10);
  return `${m}:${String(s).padStart(2, '0')}.${tenths % 10}`;
}

/** Seconds, said aloud: "7.4 seconds", "1 minute 2.0 seconds". */
export function spokenTime(ms: number): string {
  const tenths = Math.max(0, Math.floor(ms / 100));
  const m = Math.floor(tenths / 600);
  const s = ((tenths % 600) / 10).toFixed(1);
  return m ? `${m} ${m === 1 ? 'minute' : 'minutes'} ${s} seconds` : `${s} seconds`;
}

/** Who won the race, and by how much. */
export function raceVerdict(typewriter: number, imac: number): string {
  const gap = Math.abs(typewriter - imac);
  if (gap < 100) return 'A dead heat!';
  return imac < typewriter ? `The iMac won by ${spokenTime(gap)}.` : `The typewriter won by ${spokenTime(gap)}!`;
}

/* ───────── The teacher's word list ───────── */

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** The word list's words, each with whether the page has used it (as a whole word, in any case). */
export function wordsUsed(listText: string, typed: string): { word: string; used: boolean }[] {
  const page = raceText(typed);
  return promptWords(listText).map((word) => {
    const w = raceText(word);
    return { word, used: !!w && new RegExp(`(^|[^\\p{L}\\p{N}])${escape(w)}($|[^\\p{L}\\p{N}])`, 'u').test(page) };
  });
}

/* ───────── Beat ten ───────── */

/** "typewriter": the poster's top-row word, and its ten letters. */
export const TEN_WORD = 'typewriter';
export const TEN = TEN_WORD.length;

export type TenResult = { kind: 'short'; toGo: number } | { kind: 'poster' } | { kind: 'ten' } | { kind: 'longer'; by: number };

/** A top-row word against "typewriter": short of ten, the poster's own, another ten, or longer. */
export function beatTen(letters: string): TenResult {
  if (letters === TEN_WORD) return { kind: 'poster' };
  if (letters.length < TEN) return { kind: 'short', toGo: TEN - letters.length };
  if (letters.length === TEN) return { kind: 'ten' };
  return { kind: 'longer', by: letters.length - TEN };
}

/** True if a kept word beats ten: another ten-letter top-row word, or a longer one. */
export const beatsTen = (r: TenResult) => r.kind === 'ten' || r.kind === 'longer';

/** The kept words as one board message, longest first, as many as fit. */
export function longestWordsMessage(kept: { word: string; row: 'top' | 'bottom' }[], max: number): string {
  const rows = new Set(kept.map((k) => k.row));
  const head = rows.size === 1 ? `Our longest ${[...rows][0]}-row words:` : 'Our longest one-row words:';
  let text = head;
  for (const [i, k] of kept.entries()) {
    const part = `${i ? ',' : ''} ${k.word.toUpperCase()} (${k.word.length}${rows.size > 1 ? `, ${k.row} row` : ''})`;
    if ([...(text + part)].length > max) break;
    text += part;
  }
  return text;
}
