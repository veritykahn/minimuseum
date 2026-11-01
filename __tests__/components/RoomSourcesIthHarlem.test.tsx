import fs from 'fs';
import path from 'path';
import { fireEvent, render, screen, within } from '@testing-library/react';
import GospelTimeline from '@/app/exhibitions/in-their-hands/timeline/page';
import { PAINTING_CREDITS, TIMELINE_SOURCES } from '@/app/exhibitions/in-their-hands/timeline/sources';
import { timelineStops } from '@/app/exhibitions/in-their-hands/timeline/timeline-data';
import RealOrReplica from '@/app/exhibitions/in-their-hands/real-or-replica/page';
import { REPLICA_SOURCES } from '@/app/exhibitions/in-their-hands/real-or-replica/data';
import HarlemInWords from '@/app/exhibitions/harlem-renaissance/harlem-in-words/page';
import { MENTOR_POEM, MENTOR_SOURCES } from '@/app/exhibitions/harlem-renaissance/harlem-in-words/mentor-poem';

/*
 * A3: each of these rooms cites in one Sources drawer (bottom left), grouped
 * by step, and nothing on the student's screen says "Source".
 */

const read = (p: string) => fs.readFileSync(path.join(process.cwd(), p), 'utf8');
const openDrawer = () => {
  fireEvent.click(screen.getByRole('button', { name: 'Sources' }));
  return screen.getByRole('dialog', { name: 'Sources' });
};

describe('The Gospel Timeline: Sources drawer', () => {
  it('credits every stop’s painting, and lists its passage', () => {
    for (const s of timelineStops) expect(PAINTING_CREDITS[s.painting.split('/').pop()!]).toEqual(expect.any(String));
    expect(TIMELINE_SOURCES).toHaveLength(timelineStops.length);
  });

  it('opens a drawer with a group per stop, and cites nothing inline', () => {
    render(<GospelTimeline />);
    expect(document.body).not.toHaveTextContent(/Sources?:/);
    const drawer = openDrawer();
    expect(within(drawer).getAllByRole('heading', { level: 3 })).toHaveLength(timelineStops.length);
    expect(drawer).toHaveTextContent('Stop 1: Augustus Caesar');
    expect(drawer).toHaveTextContent('The passage: Luke 2:1');
    expect(drawer).toHaveTextContent('James Tissot (1836–1902), Brooklyn Museum');
    expect(drawer).toHaveTextContent('Vasily Surikov (1848–1916)');
  });
});

describe('Harlem in Words: Sources drawer', () => {
  it('moves the poem’s credit into the drawer, whole, and keeps it on the printed sheet', () => {
    render(<HarlemInWords />);
    fireEvent.click(screen.getByRole('button', { name: 'Enter' }));
    const drawer = openDrawer();
    expect(drawer).toHaveTextContent('Read a mentor poem');
    expect(drawer).toHaveTextContent(`${MENTOR_POEM.author}, “${MENTOR_POEM.title}.” First published in The Crisis (NAACP), June 1921 — Public domain in the United States`);
    expect(drawer).toHaveTextContent('Wikisource');
    expect(drawer).toHaveTextContent('Lehigh University');
    expect(MENTOR_SOURCES[0].items).toHaveLength(3);
    // The figcaption stays in the page for print, hidden on screen.
    expect(document.querySelector('.hw-mentor-credit')).toHaveTextContent('June 1921');
    expect(read('app/exhibitions/harlem-renaissance/harlem-in-words/page.tsx')).toMatch(/@media screen \{ \.hw-mentor-credit \{ display: none; \} \}/);
  });
});

describe('Real or Replica?: Sources drawer', () => {
  it('has no sources to cite yet, so shows no Sources button, and cites nothing inline', () => {
    expect(REPLICA_SOURCES).toEqual([]);
    render(<RealOrReplica />);
    expect(screen.queryByRole('button', { name: 'Sources' })).toBeNull();
    expect(document.body).not.toHaveTextContent(/Sources?:/);
  });

  it('keeps every round’s Fake buttons in one place: the coin frame has one height', () => {
    expect(read('app/exhibitions/in-their-hands/real-or-replica/page.tsx')).toMatch(/\.rr-coin-img-wrap \{[^}]*height: 358px;/);
  });
});
