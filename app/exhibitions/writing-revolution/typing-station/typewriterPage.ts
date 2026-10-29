/*
 * The typewriter's page, as a mechanical typewriter keeps it: a sheet of
 * lines, each a row of character cells. A key strikes ink into the cell at
 * the carriage and moves the carriage on; the space bar moves it on without
 * striking. Nothing is ever erased: Back space only moves the carriage back
 * a cell, so the next key strikes over what is there. Near the end of a line
 * the bell rings; at the margin the carriage stops, and every key strikes the
 * same last cell until the carriage is returned.
 */

/** Cells to a line. */
export const LINE_WIDTH = 42;
/** The bell rings as the carriage reaches this many cells from the margin. */
export const BELL_BEFORE = 7;

export type Page = {
  /** Each line's cells; each cell is every character struck into it, in order. */
  lines: string[][];
  /** The line the carriage is on. */
  line: number;
  /** The carriage's cell: 0 … LINE_WIDTH, where LINE_WIDTH is locked at the margin. */
  col: number;
  /** Every strike so far: it keys the typebar's swing. */
  strikes: number;
};

/** What a key did, for the sounds and the live region. */
export type Effect = 'strike' | 'space' | 'bell' | 'locked' | 'back' | 'return';

const emptyLine = () => Array.from({ length: LINE_WIDTH }, () => '');

export function newPage(): Page {
  return { lines: [emptyLine()], line: 0, col: 0, strikes: 0 };
}

/** One key on the typewriter: a printable character, 'Backspace' or 'Enter'. */
export function typeKey(page: Page, key: string): { page: Page; effects: Effect[] } {
  if (key === 'Enter') {
    const lines = [...page.lines, emptyLine()];
    return { page: { ...page, lines, line: page.line + 1, col: 0 }, effects: ['return'] };
  }
  if (key === 'Backspace') {
    return { page: { ...page, col: Math.max(0, page.col - 1) }, effects: ['back'] };
  }
  if ([...key].length !== 1) return { page, effects: [] };

  const effects: Effect[] = [];
  const locked = page.col >= LINE_WIDTH;
  let lines = page.lines;
  let strikes = page.strikes;
  if (key === ' ') {
    effects.push(locked ? 'locked' : 'space');
  } else {
    // At the margin, every key strikes the last cell again.
    const at = Math.min(page.col, LINE_WIDTH - 1);
    lines = page.lines.map((l, i) => (i === page.line ? l.map((c, j) => (j === at ? c + key : c)) : l));
    strikes += 1;
    effects.push(locked ? 'locked' : 'strike');
  }
  const col = Math.min(LINE_WIDTH, page.col + 1);
  if (!locked && col === LINE_WIDTH - BELL_BEFORE) effects.push('bell');
  return { page: { lines, line: page.line, col, strikes }, effects };
}

/** Cells struck more than once on the page. */
export function strikeOvers(page: Page): number {
  return page.lines.reduce((n, l) => n + l.filter((c) => c.length > 1).length, 0);
}

/** The page as plain text, for screen readers: each cell's last strike. */
export function pageText(page: Page): string {
  return page.lines
    .map((l) => l.map((c) => (c ? c[c.length - 1] : ' ')).join('').trimEnd())
    .join('\n')
    .trimEnd();
}

/** A small, steady wobble for a strike, so each letter sits a little off true, as typed ink does. */
export function inkJitter(line: number, col: number, k: number) {
  let h = (line * 73856093) ^ (col * 19349663) ^ (k * 83492791);
  h = Math.imul(h ^ (h >>> 13), 0x5bd1e995);
  const r = (n: number) => (((h >>> n) & 0xff) / 255) * 2 - 1;
  return { dy: r(0) * 0.05, rot: r(8) * 2.4, ink: 0.72 + ((r(16) + 1) / 2) * 0.28 };
}
