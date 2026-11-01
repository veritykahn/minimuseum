import { fireEvent, render, screen, within } from '@testing-library/react';
import VioletsLife from '@/app/exhibitions/womens-history/violet/page';
import { BLITZ_NOTE, LIFE, threadLayout, threadPath } from '@/app/exhibitions/womens-history/violet/violetLife';
import { BIO, WOMENS_HISTORY } from '@/app/exhibitions/womens-history/womensHistory';
import { getLevelConfig } from '@/components/museum-map/data/levels';
import { getRoomByPath } from '@/components/museum-map/data/rooms';

/*
 * Violet's Life: every paragraph of poster 2's biography, once each and in
 * order; the thread's layout; walking along it by click, arrow keys and
 * Back / Next; and its place on the landing page, the map and the projector.
 */

beforeEach(() => window.history.replaceState(null, '', '/'));

describe('her life, in the poster’s words', () => {
  it('sets every paragraph of the biography, once each, in the poster’s order', () => {
    expect(LIFE.flatMap((s) => s.paragraphs)).toEqual(Object.values(BIO));
  });

  it('gives each stop its own address, and a year only where the poster gives one', () => {
    expect(new Set(LIFE.map((s) => s.id)).size).toBe(LIFE.length);
    expect(LIFE.filter((s) => s.when).map((s) => s.when)).toEqual(['1907', 'At 14', '1928', '1929', '1956']);
  });

  it('uses only the four family photographs from poster 2', () => {
    const photos = LIFE.flatMap((s) => (s.photo ? [s.photo.src] : []));
    expect(photos).toEqual([
      '/exhibitions/womens-history/photo-violet.jpg',
      '/exhibitions/womens-history/photo-promenade.jpg',
      '/exhibitions/womens-history/photo-family.jpg',
      '/exhibitions/womens-history/photo-four-women.jpg',
    ]);
  });
});

describe('the thread', () => {
  it('runs across the band in one row, or back and forth in two', () => {
    const one = threadLayout(13, 1200, 200);
    expect(one).toHaveLength(13);
    expect(one.every((p, i) => i === 0 || p.x > one[i - 1].x)).toBe(true);
    const two = threadLayout(13, 380, 160, 2);
    expect(two[6].x).toBeGreaterThan(two[0].x);
    expect(two[7].x).toBeGreaterThan(two[12].x);
    expect(two[7].y).toBeGreaterThan(two[6].y);
    expect(threadLayout(0, 100, 100)).toEqual([]);
  });

  it('draws a smooth path through every point', () => {
    const pts = threadLayout(4, 400, 100);
    expect(threadPath(pts).match(/C/g)).toHaveLength(3);
    expect(threadPath([])).toBe('');
  });
});

describe('walking the thread', () => {
  it('opens on her name and dates, then each keepsake in turn', () => {
    render(<VioletsLife />);
    expect(screen.getByRole('img', { name: 'Violet Dina Want' })).toBeInTheDocument();
    expect(screen.getByText('Born January 27, 1907 | Died March 2, 1988')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('tab', { name: /The factory/ }));
    expect(screen.getByRole('tabpanel')).toHaveTextContent(BIO.factory);
    expect(window.location.hash).toBe('#factory');
  });

  it('moves with the arrow keys, Home and End', () => {
    render(<VioletsLife />);
    const first = screen.getByRole('tab', { name: 'Violet' });
    fireEvent.keyDown(first, { key: 'ArrowRight' });
    const fulham = screen.getByRole('tab', { name: /Fulham/ });
    expect(fulham).toHaveAttribute('aria-selected', 'true');
    expect(fulham).toHaveFocus();
    expect(screen.getByRole('tabpanel')).toHaveTextContent(BIO.childhood);
    fireEvent.keyDown(fulham, { key: 'End' });
    expect(screen.getByRole('tab', { name: 'Her story' })).toHaveFocus();
    expect(screen.getByRole('tabpanel')).toHaveTextContent(BIO.legacy);
  });

  it('Back and Next step along, and say where they have come to', () => {
    render(<VioletsLife />);
    expect(screen.getByRole('button', { name: /Back/ })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: /Next/ }));
    fireEvent.click(screen.getByRole('button', { name: /Next/ }));
    expect(screen.getByRole('status')).toHaveTextContent(`Home and school, 3 of ${LIFE.length}`);
    expect(screen.getByRole('tabpanel')).toHaveTextContent(BIO.father);
  });

  it('opens at the stop its address names', () => {
    window.history.replaceState(null, '', '/#blitz');
    render(<VioletsLife />);
    expect(screen.getByRole('tab', { name: 'The Blitz' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent(BIO.blast);
  });

  it('sets the Blitz’s museum note apart from her typed story, with its source', () => {
    // The carve-out: one note that is not the poster's, owner-approved and fact-checked.
    expect(LIFE.filter((s) => s.note).map((s) => s.id)).toEqual(['blitz']);
    expect(Object.values(BIO).join(' ')).not.toContain(BLITZ_NOTE.text);
    window.history.replaceState(null, '', '/#blitz');
    render(<VioletsLife />);
    const note = screen.getByRole('complementary', { name: 'Museum note' });
    expect(note).toHaveTextContent('The first V-1 to hit London fell on June 13, 1944.');
    expect(note.closest('.whv-copy')).toBeNull();
    // Its source is in the room's Sources drawer, not under the note.
    expect(within(note).queryByRole('link')).toBeNull();
    expect(note).not.toHaveTextContent(/Source/);
    fireEvent.click(screen.getByRole('button', { name: 'Sources and credits' }));
    const drawer = within(screen.getByRole('dialog', { name: 'Sources and credits' }));
    expect(drawer.getByRole('heading', { name: 'The Blitz' })).toBeInTheDocument();
    expect(drawer.getByRole('link', { name: 'Imperial War Museums' })).toHaveAttribute('href', 'https://memorials.iwm.org.uk/memorial/96212');
    fireEvent.click(drawer.getByRole('button', { name: 'Close sources' }));
    fireEvent.click(screen.getByRole('tab', { name: /The factory/ }));
    expect(screen.queryByRole('complementary', { name: 'Museum note' })).toBeNull();
  });
});

describe('wiring', () => {
  it('sets the room on the landing page, the map and the projector', () => {
    expect(WOMENS_HISTORY.interactives?.map((c) => c.href)).toContain('/exhibitions/womens-history/violet');
    expect(WOMENS_HISTORY.projector.links.map((l) => l.href)).toContain('/exhibitions/womens-history/violet');
    expect(getRoomByPath('/exhibitions/womens-history/violet')?.id).toBe('wh-violet');
    expect(getLevelConfig('/exhibitions/womens-history/violet').title).toBe("Women's History Month");
  });
});
