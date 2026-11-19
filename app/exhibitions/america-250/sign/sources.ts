import type { SourceGroup } from '@/components/exhibition/SourcesDrawer';
import { DECLARATION_SOURCE } from './declaration';
import { COPIES, FLAG_TEXT, SIGN_TEXT } from './signText';

/*
 * Every source and picture credit for the three rooms that grew out of the
 * signing, each for its own Sources drawer (SourcesDrawer): Put Your Name to
 * It (the Declaration's text), A Copy of a Copy (each copy's sources and
 * picture credit) and Add a Star (the flag's). The pages cite nothing
 * inline; the printed parchment keeps its own credit line.
 */
export const SIGN_SOURCES: SourceGroup[] = [
  { title: SIGN_TEXT.title, items: [{ ...DECLARATION_SOURCE, note: 'The Declaration’s text' }] },
];

export const COPIES_SOURCES: SourceGroup[] = COPIES.map((c) => ({
  title: `${SIGN_TEXT.copiesHeading}: ${c.name}`,
  items: [...c.note.sources, { ...c.credit, note: 'Picture' }],
}));

export const FLAG_SOURCES: SourceGroup[] = [{ title: SIGN_TEXT.flagHeading, items: FLAG_TEXT.sources }];
