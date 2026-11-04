import type { SourceGroup } from '@/components/exhibition/SourcesDrawer';
import { DECLARATION_SOURCE } from './declaration';
import { COPIES, FLAG_TEXT, SIGN_TEXT } from './signText';

/*
 * Every source and picture credit the signing uses, for its Sources drawer
 * (SourcesDrawer), grouped by tab and, under the copies, by copy. The page
 * cites nothing inline; the printed parchment keeps its own credit line.
 */
export const SIGN_SOURCES: SourceGroup[] = [
  { title: SIGN_TEXT.signHeading, items: [{ ...DECLARATION_SOURCE, note: 'The Declaration’s text' }] },
  ...COPIES.map((c) => ({
    title: `${SIGN_TEXT.copiesHeading}: ${c.name}`,
    items: [...c.note.sources, { ...c.credit, note: 'Picture' }],
  })),
  { title: SIGN_TEXT.flagHeading, items: FLAG_TEXT.sources },
];
