import { fireEvent, render, screen } from '@testing-library/react';
import BlackBarbieTimeline from '@/app/exhibitions/black-history/timeline/page';
import { ADDED_NOTES, POSTER_SENTENCES, TIMELINE_STOPS, markRuns, stepFor, stopFromHash } from '@/app/exhibitions/black-history/timeline/timelineStops';
import { BLACK_HISTORY } from '@/app/exhibitions/black-history/blackHistory';
import { getLevelConfig } from '@/components/museum-map/data/levels';
import { getRoomByPath } from '@/components/museum-map/data/rooms';

/*
 * The Black Barbie timeline: every word from the poster, the stops in order,
 * and moving along them by click and by key. Three stops are carved out of
 * "the poster's words": Dolls of the World, Shani and Inspiring Women are
 * owner-approved, fact-checked additions, set as notes with their sources,
 * and carry no poster sentences.
 */

const posterCopy = BLACK_HISTORY.posters[1].items.map((i) => (i as { text?: string }).text ?? '').join(' ');

describe('the stops', () => {
  it('are the poster’s years and the approved additions, in order, ending today', () => {
    expect(TIMELINE_STOPS.map((s) => s.year)).toEqual([1967, 1968, 1980, 1990, 1991, 2008, 2009, 2022, null]);
    expect(TIMELINE_STOPS.map((s) => s.yearLabel ?? s.year)).toEqual([1967, 1968, 1980, 'c. 1990', 1991, 2008, 2009, '2022–23', null]);
    expect(new Set(TIMELINE_STOPS.map((s) => s.id)).size).toBe(TIMELINE_STOPS.length);
  });

  it('sets the three approved additions as notes with their sources, not as poster quotes', () => {
    // The carve-out: these stops' words are owner-approved additions, not poster 2's.
    const added = TIMELINE_STOPS.filter((s) => s.note);
    expect(added.map((s) => s.id)).toEqual(['1990', '1991', '2022']);
    expect(added.map((s) => s.note)).toEqual([ADDED_NOTES.dollsOfTheWorld, ADDED_NOTES.shani, ADDED_NOTES.inspiringWomen]);
    for (const s of added) {
      expect(s.sentences).toEqual([]);
      expect(s.mark).toEqual([]);
      expect(s.tag).toBeUndefined();
      expect(posterCopy).not.toContain(s.note!.text);
      expect(s.note!.sources.length).toBeGreaterThan(0);
      for (const src of s.note!.sources) expect(src.href).toMatch(/^https:\/\//);
    }
    expect(ADDED_NOTES.inspiringWomen.sources.map((x) => x.label)).toEqual(['Mattel', 'NBC News', 'CNN']);
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
    expect(stopFromHash('#today')).toBe(8);
    expect(stopFromHash('#1991')).toBe(4);
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
    const stop1990 = screen.getByRole('button', { name: 'c. 1990, Dolls of the World' });
    expect(stop1990).toHaveAttribute('aria-current', 'step');
    expect(window.location.hash).toBe('#1990');
    fireEvent.keyDown(stop1990, { key: 'ArrowRight' });
    fireEvent.keyDown(screen.getByRole('button', { name: '1991, Shani' }), { key: 'ArrowRight' });
    const stop2008 = screen.getByRole('button', { name: '2008, AKA Centennial Barbie' });
    expect(stop2008).toHaveAttribute('aria-current', 'step');
    expect(stop2008).toHaveFocus();
    expect(window.location.hash).toBe('#2008');

    fireEvent.keyDown(stop2008, { key: 'End' });
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Today');
    expect(screen.getByRole('button', { name: 'Later' })).toBeDisabled();
  });
});

/*
 * Found in the room's QA pass: the arrow keys worked only from a stop, and
 * counted from the stop shown rather than the one focused; the Earlier and
 * Later buttons dropped the focus as they went dim at the ends.
 */
describe('fixes from the QA pass', () => {
  beforeEach(() => window.history.replaceState(null, '', '/'));

  it('steps by key from the stop shown, Up and Down only on the stops', () => {
    expect(stepFor('ArrowRight', 0, false)).toBe(1);
    expect(stepFor('ArrowLeft', 0, false)).toBe(0);
    expect(stepFor('End', 2, false)).toBe(TIMELINE_STOPS.length - 1);
    expect(stepFor('ArrowRight', TIMELINE_STOPS.length - 1, true)).toBe(TIMELINE_STOPS.length - 1);
    expect(stepFor('ArrowDown', 3, true)).toBe(4);
    expect(stepFor('ArrowDown', 3, false)).toBeNull();
    expect(stepFor('a', 3, true)).toBeNull();
  });

  it('moves along by arrow key from anywhere in the room, not only from a stop', () => {
    render(<BlackBarbieTimeline />);
    fireEvent.keyDown(document.body, { key: 'ArrowRight' });
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('1968: Christie');
    const words = screen.getByRole('region', { name: '1968: Christie' });
    words.focus();
    fireEvent.keyDown(words, { key: 'ArrowRight' });
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('1980: The first Black Barbie');
    // The words are drawn afresh, and keep the focus.
    expect(screen.getByRole('region', { name: '1980: The first Black Barbie' })).toHaveFocus();
    // Down scrolls the words; it doesn't move the timeline.
    fireEvent.keyDown(screen.getByRole('region', { name: '1980: The first Black Barbie' }), { key: 'ArrowDown' });
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('1980: The first Black Barbie');
    // A link in a note keeps its keys.
    fireEvent.click(screen.getByRole('button', { name: '1991, Shani' }));
    fireEvent.keyDown(screen.getByRole('link', { name: /Shani and Her Friends/ }), { key: 'ArrowRight' });
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('1991: Shani');
  });

  it('keeps only the stop shown in the tab order', () => {
    render(<BlackBarbieTimeline />);
    fireEvent.click(screen.getByRole('button', { name: '2009, “So In Style”' }));
    const tabbable = screen.getAllByRole('button').filter((b) => b.classList.contains('bht-stop') && b.getAttribute('tabindex') === '0');
    expect(tabbable.map((b) => b.getAttribute('aria-label'))).toEqual(['2009, “So In Style”']);
  });

  it('hands the focus to the end stop as Earlier or Later goes dim', () => {
    render(<BlackBarbieTimeline />);
    fireEvent.click(screen.getByRole('button', { name: '2022–23, Inspiring Women' }));
    const later = screen.getByRole('button', { name: 'Later' });
    later.focus();
    fireEvent.click(later);
    expect(later).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Today' })).toHaveFocus();
    const earlier = screen.getByRole('button', { name: 'Earlier' });
    for (let i = 0; i < TIMELINE_STOPS.length - 1; i++) fireEvent.click(earlier);
    expect(earlier).toBeDisabled();
    expect(screen.getByRole('button', { name: '1967, Francie' })).toHaveFocus();
  });
});

describe('the added stops', () => {
  it('each show their note and its source link, with no poster quote', () => {
    render(<BlackBarbieTimeline />);
    const cases: [string, string, string[]][] = [
      ['c. 1990, Dolls of the World', ADDED_NOTES.dollsOfTheWorld.text, ['https://virtualblackdollmuseum.com/2024/03/15/barbie-dolls-of-the-world/']],
      ['1991, Shani', ADDED_NOTES.shani.text, ['https://virtualblackdollmuseum.com/2021/03/18/shani-and-her-friends/']],
      [
        '2022–23, Inspiring Women',
        ADDED_NOTES.inspiringWomen.text,
        [
          'https://creations.mattel.com/collections/barbie-signature/products/barbie-inspiring-women-ida-b-wells-hcb81',
          'https://www.nbcnews.com/news/nbcblk/barbie-honors-first-female-self-made-millionaire-madam-cj-walker-new-d-rcna45322',
          'https://edition.cnn.com/style/article/bessie-coleman-barbie-doll-cec',
        ],
      ],
    ];
    for (const [name, text, hrefs] of cases) {
      fireEvent.click(screen.getByRole('button', { name }));
      const words = screen.getByRole('region', { name: name.replace(', ', ': ') });
      expect(words).toHaveTextContent(text);
      expect(words.querySelector('.bht-sentence')).toBeNull();
      expect(words.querySelector('mark')).toBeNull();
      const links = Array.from(words.querySelectorAll('a')).map((a) => a.getAttribute('href'));
      expect(links).toEqual(hrefs);
      expect(screen.getByText(/A museum note/)).toBeInTheDocument();
    }
    // Back on a poster stop, the source line is the poster's again.
    fireEvent.click(screen.getByRole('button', { name: '2008, AKA Centennial Barbie' }));
    expect(screen.getByText(/In the words of the poster/)).toBeInTheDocument();
  });
});

describe('wiring', () => {
  it('sets the room on the landing page, the map and the projector', () => {
    const href = '/exhibitions/black-history/timeline';
    // The timeline first, then Who Do You See? (WhoDoYouSee.test.tsx).
    expect(BLACK_HISTORY.interactives?.map((c) => c.href)[0]).toBe(href);
    expect(BLACK_HISTORY.projector.links.map((l) => l.href)[0]).toBe(href);
    expect(getRoomByPath(href)?.id).toBe('bh-timeline');
    expect(getLevelConfig(href).title).toBe('Black History Month');
  });
});

// With a photograph in place: BlackBarbieTimelinePhotos.test.tsx.
describe('the owner’s photographs', () => {
  beforeEach(() => window.history.replaceState(null, '', '/'));

  it('add nothing to the room while there are none', () => {
    const { container } = render(<BlackBarbieTimeline />);
    for (const s of TIMELINE_STOPS) {
      fireEvent.click(screen.getByRole('button', { name: s.year === null ? s.name : `${s.yearLabel ?? s.year}, ${s.name}` }));
      expect(container.querySelector('figure, .bht-photo')).toBeNull();
    }
  });
});
