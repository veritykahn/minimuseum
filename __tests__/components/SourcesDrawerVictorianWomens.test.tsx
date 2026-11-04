import fs from 'fs';
import path from 'path';
import type { ComponentType } from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import VictorianChristmasCard from '@/app/exhibitions/victorian/christmas-card/page';
import VictorianChristmasParlour from '@/app/exhibitions/victorian/christmas-parlour/page';
import WhoGetsRemembered from '@/app/exhibitions/womens-history/remembered/page';
import VioletsLife from '@/app/exhibitions/womens-history/violet/page';
import { CARD_NOTES, CARD_SOURCES } from '@/app/exhibitions/victorian/christmas-card/cardText';
import { PARLOUR_NOTES, PARLOUR_SOURCES, PARTS } from '@/app/exhibitions/victorian/christmas-parlour/parlourText';
import { GHOST_NOTES } from '@/app/exhibitions/victorian/christmas-parlour/ghostText';
import { REMEMBERED_SOURCES, cite } from '@/app/exhibitions/womens-history/remembered/sources';
import { AUDIT, FACT_MERMAIDS, FACT_OTHERS, FACT_TOP_50 } from '@/app/exhibitions/womens-history/remembered/remembered';
import { FACT_CONFEDERATE, THREE_WOMEN } from '@/app/exhibitions/womens-history/remembered/threeWomen';
import { EVIDENCE } from '@/app/exhibitions/womens-history/remembered/weighEvidence';
import { AFTER, BEFORE, EVERYBODY, LISTENING, ORAL_SOURCES, QUESTIONS_NOTE, SHARE_IDEAS } from '@/app/exhibitions/womens-history/remembered/oralHistoryText';
import { BLITZ_NOTE, VIOLET_SOURCES } from '@/app/exhibitions/womens-history/violet/violetLife';
import type { SourceGroup } from '@/components/exhibition/SourcesDrawer';
import type { FactSource } from '@/components/exhibition/FactNote';

/*
 * The brief's A3 and A4 for the Christmas card maker, Dickens' Christmas
 * parlour, Who Gets Remembered? and Violet's Life: one Sources drawer per
 * room listing every source it cites, grouped by tab or stop, and nothing
 * cited on the student's screen; and the step controls that stay put while
 * the words around them change.
 */

const read = (p: string) => fs.readFileSync(path.join(process.cwd(), p), 'utf8');
const hrefs = (groups: readonly SourceGroup[]) => new Set(groups.flatMap((g) => g.items.map((i) => i.href)));
const all = (...lists: (readonly FactSource[])[]) => lists.flat().map((s) => s.href);

const ROOMS: [string, ComponentType, readonly SourceGroup[], string[]][] = [
  ['the Christmas card maker', VictorianChristmasCard, CARD_SOURCES, all(...Object.values(CARD_NOTES).map((n) => n.sources))],
  ['Dickens’ Christmas parlour', VictorianChristmasParlour, PARLOUR_SOURCES, all(...Object.values(PARLOUR_NOTES).map((n) => n.sources), ...Object.values(GHOST_NOTES).map((n) => n.sources))],
  [
    'Who Gets Remembered?',
    WhoGetsRemembered,
    REMEMBERED_SOURCES,
    all(
      [AUDIT],
      FACT_TOP_50.sources,
      FACT_MERMAIDS.sources,
      FACT_OTHERS.sources,
      FACT_CONFEDERATE.sources,
      THREE_WOMEN.map((w) => w.source),
      ...EVIDENCE.map((c) => c.sources),
      EVERYBODY.sources,
      QUESTIONS_NOTE.sources,
      SHARE_IDEAS.sources,
      ...[...BEFORE, ...LISTENING, ...AFTER].map((t) => t.sources),
      ORAL_SOURCES,
    ),
  ],
  ['Violet’s Life', VioletsLife, VIOLET_SOURCES, all(BLITZ_NOTE.sources)],
];

beforeEach(() => window.history.replaceState(null, '', '/'));

describe.each(ROOMS)('%s', (_name, Room, groups, cited) => {
  it('lists every source the room cites in its drawer, each with a link', () => {
    const listed = hrefs(groups);
    for (const h of cited) expect(listed).toContain(h);
    for (const g of groups) for (const i of g.items) expect(i.href).toMatch(/^https:\/\//);
    // Never a "made with" credit for the owner's illustrations.
    expect(JSON.stringify(groups)).not.toMatch(/Leonardo/i);
  });

  it('cites nothing on the screen, and opens one Sources drawer grouped by tab or stop', () => {
    const { container } = render(<Room />);
    // Print-only sheets and lines keep their sources; the screen has none.
    const main = container.querySelector('main')!.cloneNode(true) as Element;
    main.querySelectorAll('.whr-print, .whr-print-source').forEach((e) => e.remove());
    expect(main.textContent).not.toMatch(/\bSources?:/);
    const outside = [...container.querySelectorAll('a[href^="http"]')].filter((a) => !a.closest('[role="dialog"]'));
    expect(outside).toHaveLength(0);
    expect(screen.getAllByRole('button', { name: 'Sources and credits' })).toHaveLength(1);
    fireEvent.click(screen.getByRole('button', { name: 'Sources and credits' }));
    const drawer = within(screen.getByRole('dialog', { name: 'Sources and credits' }));
    expect(drawer.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual(groups.map((g) => g.title));
    for (const g of groups) for (const i of g.items) expect(drawer.getAllByRole('link', { name: i.label }).length).toBeGreaterThan(0);
  });
});

describe('the drawers’ groups', () => {
  it('sets the parlour’s notes under their parts, and the ghost story’s under its tab', () => {
    expect(PARLOUR_SOURCES.map((g) => g.title)).toEqual(['The parlour', 'Write a ghost story']);
    expect(PARLOUR_SOURCES[0].items.map((i) => i.note)).toEqual(PARTS.filter((p) => p.note).map((p) => p.name));
  });

  it('lists each of Who Gets Remembered?’s sources once per tab, with everything it backs', () => {
    expect(REMEMBERED_SOURCES.map((g) => g.title)).toEqual(['Who gets a statue?', 'Tip the scale', 'Talk about it']);
    for (const g of REMEMBERED_SOURCES) expect(new Set(g.items.map((i) => i.href)).size).toBe(g.items.length);
    expect(cite([['a', [AUDIT]], ['b', [AUDIT]], ['a', [AUDIT]]])).toEqual([{ ...AUDIT, note: 'a; b' }]);
  });

  it('keeps the argument’s source on its printout, where the screen has none', () => {
    const css = read('app/exhibitions/womens-history/remembered/remembered.css');
    expect(css).toMatch(/\.whr-print-source \{ display: none; \}/);
    expect(css).toMatch(/\[data-print='argument'\] \.whr-print-source \{ display: block;/);
  });
});

describe('controls that stay put (A4)', () => {
  it('sets the parlour’s parts above the part they open, so they never move', () => {
    render(<VictorianChristmasParlour />);
    const card = screen.getByRole('region', { name: 'The parts of a Victorian Christmas' });
    expect(card.firstElementChild).toHaveClass('vcp-parts');
    fireEvent.click(within(card).getByRole('button', { name: 'The Christmas tree' }));
    expect(card.firstElementChild).toHaveClass('vcp-parts');
  });

  it('holds every evidence card’s words and verdict in one place, so “Lay it on the scale” and “Next card” stay put', () => {
    window.history.replaceState(null, '', '/#scale');
    render(<WhoGetsRemembered />);
    const hold = document.querySelector('.whr-card .whr-hold') as HTMLElement;
    expect(hold.children).toHaveLength(EVIDENCE.length);
    expect([...hold.children].filter((c) => !c.hasAttribute('data-held')).map((c) => c.textContent)).toEqual([EVIDENCE[0].text]);
    fireEvent.click(screen.getByRole('button', { name: 'Lay it on the scale' }));
    const verdicts = document.querySelector('.whr-verdict .whr-hold') as HTMLElement;
    expect(verdicts.children).toHaveLength(1 + EVIDENCE.length * 2);
    // The next card comes first in its row, wherever the "instead" button is.
    expect(document.querySelector('.whr-verdict .whr-card-buttons')?.firstElementChild).toHaveTextContent('Next card');
    const css = read('app/exhibitions/womens-history/remembered/remembered.css');
    expect(css).toMatch(/\.whr-hold > \[data-held\] \{ visibility: hidden; \}/);
    expect(css).toMatch(/\.whr-oral-next \{[^}]*margin-top: auto; position: sticky; bottom: 0;/);
  });
});
