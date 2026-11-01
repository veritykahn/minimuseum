import type { SourceGroup } from '@/components/exhibition/SourcesDrawer';
import { CREATURES } from './boxes';
import { CHOICES } from './KnownOrUnknown';

/*
 * Every source and picture credit in What Scares You?, by experiment, for
 * its Sources drawer: nothing is cited on the screen itself. The creatures'
 * photographs are credited in full, title, author and licence, which is
 * what their licences ask. The words on the posters need no source; the
 * boxes are the owner's own pictures, and are not credited, at her request.
 */

const name = (n: string) => n.replace('!', '');

export const LAB_SOURCES: readonly SourceGroup[] = [
  {
    title: 'The Fear Boxes: the creatures’ facts',
    items: CREATURES.flatMap((c) => c.fact.sources.map((s) => ({ ...s, note: name(c.name) }))),
  },
  {
    title: 'The Fear Boxes: the photographs (cut out from their backgrounds)',
    items: CREATURES.map((c) => ({
      label: `${c.credit.title}, ${c.credit.author}`,
      href: c.credit.href,
      note: name(c.name),
      licence: c.credit.licenceHref ? `${c.credit.licence}, ${c.credit.licenceHref}` : c.credit.licence,
    })),
  },
  {
    title: 'Known or Unknown?',
    items: CHOICES.flatMap((c) => (c.fact ? c.fact.sources.map((s) => ({ ...s, note: c.question })) : [])),
  },
];
