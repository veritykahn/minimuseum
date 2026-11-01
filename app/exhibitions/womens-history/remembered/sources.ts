import type { FactSource } from '@/components/exhibition/FactNote';
import type { SourceGroup, SourceItem } from '@/components/exhibition/SourcesDrawer';
import { FACT_MERMAIDS, FACT_OTHERS, FACT_TOP_50 } from './remembered';
import { FACT_CONFEDERATE, THREE_WOMEN } from './threeWomen';
import { EVIDENCE } from './weighEvidence';
import { AFTER, BEFORE, EVERYBODY, LISTENING, ORAL_SOURCES, QUESTIONS_NOTE, SHARE_IDEAS, SMITHSONIAN_GUIDE, type Tip } from './oralHistoryText';

/*
 * Every source Who Gets Remembered? cites, for its Sources drawer, by tab
 * (and, in "Talk about it", by step), each once per group, with what it
 * backs. Nothing is cited on the student's screen; the print sheets keep
 * their own source lines.
 */

/** Each source once, its notes joined, in the order first cited. */
export function cite(entries: readonly (readonly [note: string, sources: readonly FactSource[]])[]): SourceItem[] {
  const byHref = new Map<string, SourceItem>();
  for (const [note, sources] of entries) {
    for (const s of sources) {
      const had = byHref.get(s.href);
      if (!had) byHref.set(s.href, { ...s, note });
      else if (!had.note?.split('; ').includes(note)) had.note = `${had.note}; ${note}`;
    }
  }
  return [...byHref.values()];
}

const tips = (label: string, list: readonly Tip[]) => list.map((t) => [label, t.sources] as const);

export const REMEMBERED_SOURCES: readonly SourceGroup[] = [
  {
    title: 'Who gets a statue?',
    items: cite([
      ['The Top 50, their ranks and monuments', FACT_TOP_50.sources],
      ['The mermaids and the congresswomen', FACT_MERMAIDS.sources],
      ...THREE_WOMEN.map((w) => [w.name, [w.source]] as const),
      ['About four of these names', FACT_CONFEDERATE.sources],
    ]),
  },
  {
    title: 'Tip the scale',
    items: cite(EVIDENCE.map((c, i) => [`Evidence ${i + 1}`, c.sources] as const)),
  },
  {
    title: 'Talk about it',
    items: cite([
      ['“Everybody has a story to tell”', EVERYBODY.sources],
      ...tips('Before you start', BEFORE),
      ['The questions', QUESTIONS_NOTE.sources],
      ...tips('While you listen', LISTENING),
      ...tips('Afterwards', AFTER),
      ['Ideas to share it', SHARE_IDEAS.sources],
      ['The last two write-up questions are the guide’s own “Time to Reflect” questions', [SMITHSONIAN_GUIDE]],
      ['Not only women', FACT_OTHERS.sources],
      ['The interview guides', ORAL_SOURCES],
    ]),
  },
];
