import { fireEvent, render, screen } from '@testing-library/react';
import BlackBarbieTimeline from '@/app/exhibitions/black-history/timeline/page';
import { POSTER_SENTENCES, TIMELINE_STOPS, markRuns, stopFromHash } from '@/app/exhibitions/black-history/timeline/timelineStops';
import { BLACK_HISTORY } from '@/app/exhibitions/black-history/blackHistory';
import { getLevelConfig } from '@/components/museum-map/data/levels';
import { getRoomByPath } from '@/components/museum-map/data/rooms';

/*
 * The Black Barbie timeline: every word from the poster, the stops in order,
 * and moving along them by click and by key.
 */

const posterCopy = BLACK_HISTORY.posters[1].items.map((i) => (i as { text?: string }).text ?? '').join(' ');

describe('the stops', () => {
  it('are the poster’s years, in order, ending today', () => {
    expect(TIMELINE_STOPS.map((s) => s.year)).toEqual([1967, 1968, 1980, 2008, 2009, null]);
  });

  it('quote only whole sentences from poster 2, and mark only words in them', () => {
    for (const stop of TIMELINE_STOPS) {
      for (const s of stop.sentences) {
        expect(POSTER_SENTENCES).toContain(s);
        expect(posterCopy).toContain(s);
      }
      for (const m of stop.mark) expect(stop.sentences.some((s) => s.includes(m))).toBe(true);
      if (stop.tag) expect(posterCopy.toLowerCase()).toContain(stop.tag.toLowerCase());
    }
  });

  it('sets the approved order of 2008 and 2009', () => {
    const s = TIMELINE_STOPS.find((x) => x.id === '2008')!.sentences[0];
    expect(s).toContain('the AKA Centennial Barbie (2008) and the "So In Style" line (2009)');
  });

  it('cuts a sentence into plain and marked runs', () => {
    expect(markRuns('one two three', ['two'])).toEqual([
      { text: 'one ', marked: false },
      { text: 'two', marked: true },
      { text: ' three', marked: false },
    ]);
    expect(markRuns('abc', ['zzz'])).toEqual([{ text: 'abc', marked: false }]);
  });

  it('opens at a stop named in the address', () => {
    expect(stopFromHash('#1980')).toBe(2);
    expect(stopFromHash('#today')).toBe(5);
    expect(stopFromHash('#1999')).toBe(-1);
  });
});

describe('the room', () => {
  it('opens on 1967 and moves along by click and by arrow key', () => {
    render(<BlackBarbieTimeline />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('1967: Francie');
    expect(screen.getByRole('button', { name: '1967, Francie' })).toHaveAttribute('aria-current', 'step');
    expect(screen.getByRole('button', { name: 'Earlier' })).toBeDisabled();

    fireEvent.click(screen.getByRole('button', { name: '1980, The first Black Barbie' }));
    expect(screen.getByRole('status')).toHaveTextContent('1980: The first Black Barbie');
    expect(screen.getByText('Designed by Kitty Black Perkins')).toBeInTheDocument();
    expect(screen.getByText('designed by Kitty Black Perkins').tagName).toBe('MARK');

    const stop1980 = screen.getByRole('button', { name: '1980, The first Black Barbie' });
    fireEvent.keyDown(stop1980, { key: 'ArrowRight' });
    const stop2008 = screen.getByRole('button', { name: '2008, AKA Centennial Barbie' });
    expect(stop2008).toHaveAttribute('aria-current', 'step');
    expect(stop2008).toHaveFocus();
    expect(window.location.hash).toBe('#2008');

    fireEvent.keyDown(stop2008, { key: 'End' });
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Today');
    expect(screen.getByRole('button', { name: 'Later' })).toBeDisabled();
  });
});

describe('wiring', () => {
  it('sets the room on the landing page, the map and the projector', () => {
    const href = '/exhibitions/black-history/timeline';
    expect(BLACK_HISTORY.interactives?.map((c) => c.href)).toEqual([href]);
    expect(BLACK_HISTORY.projector.links.map((l) => l.href)).toEqual([href]);
    expect(getRoomByPath(href)?.id).toBe('bh-timeline');
    expect(getLevelConfig(href).title).toBe('Black History Month');
  });
});
