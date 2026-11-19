/*
 * Harlem in Words: the pure pieces of the poem board, kept out of the page
 * so they can be tested. A poem is a list of entries (words and line
 * breaks); these turn it into lines, say which bank words it uses, copy a
 * line for a refrain, and check a poem against the prompt the child chose.
 */

export type WordCategory = 'dream' | 'nature' | 'music' | 'emotion' | 'action' | 'harlem';

export type PoemEntry = {
  uid: string;
  text: string;
  category: WordCategory | 'connector';
  /** The bank word this came from (single-use words go back when removed). */
  sourceWord?: string;
  isLineBreak?: boolean;
};

/** The poem as lines of words (line breaks removed; a trailing break leaves no empty line). */
export function poemLines(poem: readonly PoemEntry[]): PoemEntry[][] {
  const lines: PoemEntry[][] = [];
  let line: PoemEntry[] = [];
  for (const e of poem) {
    if (e.isLineBreak) {
      lines.push(line);
      line = [];
    } else {
      line.push(e);
    }
  }
  if (line.length > 0) lines.push(line);
  return lines;
}

/**
 * The bank words in use, worked out from the poem itself. (They used to be
 * kept in a second list alongside it, and an undo or a removal could leave
 * the two disagreeing: a word that was in the poem but back in the bank.)
 */
export function usedWords(poem: readonly PoemEntry[]): Set<string> {
  const used = new Set<string>();
  for (const e of poem) if (e.category !== 'connector' && e.sourceWord) used.add(e.sourceWord);
  return used;
}

/** One line's words as plain text, for comparing lines. */
export function lineText(line: readonly PoemEntry[]): string {
  return line.map((w) => w.text.toLowerCase()).join(' ');
}

/**
 * The entries that add a copy of line `index` at the end of the poem, on a
 * line of its own: a refrain, the way Hughes brings a line back. Bank words
 * are single-use, so without this a child could never repeat a line. The
 * copy keeps each word's bank word: the bank word goes back only when every
 * copy of it has been removed.
 */
export function refrainEntries(poem: readonly PoemEntry[], index: number, nextUid: () => string): PoemEntry[] {
  const lines = poemLines(poem);
  const line = lines[index];
  if (!line || line.length === 0) return [];
  const out: PoemEntry[] = [];
  const last = poem[poem.length - 1];
  if (last && !last.isLineBreak) out.push({ uid: nextUid(), text: '\n', category: 'connector', isLineBreak: true });
  for (const w of line) out.push({ ...w, uid: nextUid() });
  return out;
}

/** How a poem stands against its prompt: done or not, and one line saying where it is. */
export type PromptCheck = { done: boolean; status: string };

const PLACES = new Set(['harlem', 'lenox', 'beale street']);

/**
 * Checks a poem against prompt `index` (PROMPT_CARDS, same order), from the
 * words it uses and their bank categories. These are what the prompt card
 * asks for, nothing more: a poem is never marked wrong, only "not yet".
 */
export function checkPrompt(index: number, poem: readonly PoemEntry[]): PromptCheck {
  const lines = poemLines(poem).filter((l) => l.length > 0);
  // REVIEW: new text (every status line below)
  switch (index) {
    case 0: {
      const ok = lines.some((l) => l[0]?.text.toLowerCase() === 'i' && l[1]?.category === 'action');
      return ok
        ? { done: true, status: 'Done: a line starts with I and an Action word.' }
        : { done: false, status: 'Not yet: start a line with I, then an Action word.' };
    }
    case 1: {
      const place = poem.find((e) => PLACES.has((e.sourceWord ?? e.text).toLowerCase()));
      return place
        ? { done: true, status: `Done: your poem goes to ${place.text}.` }
        : { done: false, status: 'Not yet: add Harlem, Lenox or Beale Street, from City & Migration.' };
    }
    case 2: {
      const ok = lines.some((l) => l.some((w) => w.category === 'nature') && l.some((w) => w.category === 'emotion'));
      return ok
        ? { done: true, status: 'Done: a Nature word and an Emotion word share a line.' }
        : { done: false, status: 'Not yet: put a Nature word and an Emotion word in the same line.' };
    }
    case 3: {
      const n = lines.filter((l) => l.some((w) => w.category === 'action')).length;
      return n >= 4
        ? { done: true, status: 'Done: four lines, each with an Action word.' }
        : { done: false, status: `${n} of 4 lines have an Action word.` };
    }
    case 4: {
      const texts = lines.filter((l) => l.length >= 2).map(lineText);
      const ok = texts.some((t, i) => texts.indexOf(t) !== i);
      return ok
        ? { done: true, status: 'Done: a line comes back, like Hughes’s refrain.' }
        : { done: false, status: 'Not yet: write a line of two words or more, then press Repeat a line.' };
    }
    default:
      return { done: false, status: '' };
  }
}

/**
 * Splits `text` into lines no wider than `maxWidth`, as measured by
 * `measure` (a canvas's measureText in the page), breaking between words.
 * A single word wider than the line stays whole on its own line.
 */
export function wrapText(text: string, maxWidth: number, measure: (s: string) => number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const out: string[] = [];
  let line = '';
  for (const w of words) {
    const tryLine = line ? `${line} ${w}` : w;
    if (line && measure(tryLine) > maxWidth) {
      out.push(line);
      line = w;
    } else {
      line = tryLine;
    }
  }
  if (line) out.push(line);
  return out.length ? out : [''];
}
