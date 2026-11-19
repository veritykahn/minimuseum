import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import BlackBarbieTimeline from '@/app/exhibitions/black-history/timeline/page';
import OrderChallenge from '@/app/exhibitions/black-history/timeline/OrderChallenge';
import {
  ADDED_NOTES,
  DATED_STOPS,
  POSTER_SENTENCES,
  TIMELINE_STOPS,
  SORT_CARDS,
  TIMELINE_TEXT,
  markRuns,
  photoFor,
  stepFor,
  stopFromHash,
} from '@/app/exhibitions/black-history/timeline/timelineStops';
import { notesFor, resetAudioForTests } from '@/app/exhibitions/black-history/timeline/cheer';
import { BLACK_HISTORY } from '@/app/exhibitions/black-history/blackHistory';
import { getLevelConfig } from '@/components/museum-map/data/levels';
import { getRoomByPath } from '@/components/museum-map/data/rooms';

/*
 * The Black Barbie timeline: every word from the poster, the stops in order,
 * and moving along them by click and by key. Three stops are carved out of
 * "the poster's words": Dolls of the World, Shani and Inspiring Women are
 * owner-approved, fact-checked additions, set as notes with their sources,
 * and carry no poster sentences.
 *
 * It is a game too: each dated stop hides its year until it is guessed (or
 * shown), and the final challenge puts the stops back in order.
 */

const posterCopy = BLACK_HISTORY.posters[1].items.map((i) => (i as { text?: string }).text ?? '').join(' ');

/** A stop's button on the line, whether its year is shown yet or not. */
const stopButton = (name: string) => screen.getByRole('button', { name: new RegExp(`(^|, )${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(, year hidden)?$`) });
/** Show the year at the stop on screen without guessing. */
const showMe = () => fireEvent.click(screen.getByRole('button', { name: 'Just show me' }));
/** The room's Sources drawer, opened; and a stop's group in it. */
const openSources = () => {
  fireEvent.click(screen.getByRole('button', { name: 'Sources and credits' }));
  return screen.getByRole('dialog', { name: 'Sources and credits' });
};
const sourcesGroup = (drawer: HTMLElement, title: string) => within(drawer).getByRole('heading', { name: title }).closest('section') as HTMLElement;

beforeEach(() => {
  window.history.replaceState(null, '', '/');
  window.localStorage.clear();
});

describe('the stops', () => {
  it('are the poster’s years and the approved additions, in order, ending today', () => {
    expect(TIMELINE_STOPS.map((s) => s.year)).toEqual([1967, 1968, 1980, 1990, 1991, 2008, 2022, null]);
    expect(TIMELINE_STOPS.map((s) => s.yearLabel ?? s.year)).toEqual([1967, 1968, 1980, 'c. 1990', 1991, '2008–09', '2022–23', null]);
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
    expect(stopFromHash('#today')).toBe(7);
    expect(stopFromHash('#1991')).toBe(4);
    expect(stopFromHash('#1999')).toBe(-1);
  });
});

/*
 * The owner asked for 2008 and 2009 as one stop: the poster names them in
 * one sentence. Both facts stay marked, the old #2009 address still opens
 * it, and a photograph keyed to either year finds it.
 */
describe('the merged 2008–09 stop', () => {
  const merged = TIMELINE_STOPS.find((s) => s.id === '2008')!;

  it('is one stop that keeps both years’ facts, marked in the poster’s sentence', () => {
    expect(TIMELINE_STOPS.filter((s) => s.id === '2009')).toEqual([]);
    expect(merged.yearLabel).toBe('2008–09');
    expect(merged.name).toBe('AKA Centennial Barbie and “So In Style”');
    expect(merged.mark).toEqual(['the AKA Centennial Barbie (2008)', 'the "So In Style" line (2009)']);
    const runs = markRuns(merged.sentences[0], merged.mark).filter((r) => r.marked).map((r) => r.text);
    expect(runs).toEqual(['the AKA Centennial Barbie (2008)', 'the "So In Style" line (2009)']);
  });

  it('opens from the old #2009 address too', () => {
    expect(stopFromHash('#2009')).toBe(TIMELINE_STOPS.indexOf(merged));
    expect(stopFromHash('#2008')).toBe(TIMELINE_STOPS.indexOf(merged));
  });

  it('finds a photograph keyed by either year, its own id first', () => {
    const photo = (stop: string) => ({ stop, src: `/x/${stop}.jpg`, alt: stop, credit: { text: 'c' }, width: 600, height: 800 });
    expect(photoFor('2008', [photo('2009')])?.stop).toBe('2009');
    expect(photoFor('2008', [photo('2009'), photo('2008')])?.stop).toBe('2008');
    expect(photoFor('2022', [photo('2009')])).toBeUndefined();
  });

  it('shows both marks in the room', () => {
    render(<BlackBarbieTimeline />);
    fireEvent.click(stopButton('AKA Centennial Barbie and “So In Style”'));
    showMe();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('2008–09: AKA Centennial Barbie and “So In Style”');
    expect(screen.getByText('the AKA Centennial Barbie (2008)').tagName).toBe('MARK');
    expect(screen.getByText('the "So In Style" line (2009)').tagName).toBe('MARK');
  });
});

describe('the room', () => {
  it('opens on 1967 and moves along by click and by arrow key', () => {
    render(<BlackBarbieTimeline />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Guess the year: Francie');
    expect(stopButton('Francie')).toHaveAttribute('aria-current', 'step');
    expect(screen.getByRole('button', { name: 'Earlier' })).toBeDisabled();

    fireEvent.click(stopButton('The first Black Barbie'));
    showMe();
    expect(screen.getByRole('status')).toHaveTextContent('1980: The first Black Barbie');
    expect(screen.getByText('Designed by Kitty Black Perkins')).toBeInTheDocument();
    expect(screen.getByText('designed by Kitty Black Perkins').tagName).toBe('MARK');

    const stop1980 = screen.getByRole('button', { name: '1980, The first Black Barbie' });
    fireEvent.keyDown(stop1980, { key: 'ArrowRight' });
    const stop1990 = stopButton('Dolls of the World');
    expect(stop1990).toHaveAttribute('aria-current', 'step');
    expect(window.location.hash).toBe('#1990');
    fireEvent.keyDown(stop1990, { key: 'ArrowRight' });
    fireEvent.keyDown(stopButton('Shani'), { key: 'ArrowRight' });
    const stop2008 = stopButton('AKA Centennial Barbie and “So In Style”');
    expect(stop2008).toHaveAttribute('aria-current', 'step');
    expect(stop2008).toHaveFocus();
    expect(window.location.hash).toBe('#2008');

    fireEvent.keyDown(stop2008, { key: 'End' });
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Today');
    expect(screen.getByRole('button', { name: 'Later' })).toBeDisabled();
  });
});

describe('guess the year', () => {
  it('hides the year and the words that give it away until a guess', () => {
    const { container } = render(<BlackBarbieTimeline />);
    fireEvent.click(stopButton('The first Black Barbie'));
    expect(container.querySelector('.bht-year')).toHaveTextContent('?');
    expect(container.querySelector('.bht-sentence')).toBeNull();
    expect(screen.queryByText('Designed by Kitty Black Perkins')).toBeNull();
    // The stops line hides every year not yet guessed.
    expect(stopButton('Shani')).toHaveAccessibleName('Stop 5, Shani, year hidden');
    expect(stopButton('Shani')).toHaveTextContent('?');
    const choices = within(screen.getByRole('group', { name: /Guess the year/ })).getAllByRole('button');
    expect(choices.map((b) => b.textContent?.replace(/^\d/, ''))).toEqual(['1971', '1976', '1980', '1989']);
  });

  it('gives every dated stop four years to choose from, the right one among them, and Today none', () => {
    for (const s of TIMELINE_STOPS) {
      if (s.year === null) {
        expect(s.choices).toBeUndefined();
        continue;
      }
      expect(s.choices).toHaveLength(4);
      expect(s.choices).toContain(s.year);
      expect([...s.choices!].sort()).toEqual(s.choices);
    }
    // The right answer isn't always in the same place.
    expect(new Set(DATED_STOPS.map((s) => s.choices!.indexOf(s.year!))).size).toBeGreaterThan(2);
  });

  it('cheers a right guess, shows the year and words, and counts it', () => {
    const { container } = render(<BlackBarbieTimeline />);
    fireEvent.click(screen.getByRole('button', { name: /^3?1967$/ }));
    expect(container.querySelector('.bht-feedback-right')).toHaveTextContent('Yes! You got it.');
    expect(screen.getByRole('status')).toHaveTextContent('Yes! You got it. 1967. 1967: Francie');
    expect(container.querySelector('.bht-sentence')).not.toBeNull();
    expect(container.querySelector('.bht-score strong')).toHaveTextContent('1');
    expect(container.querySelector('.bht-burst-big')).not.toBeNull();
    expect(screen.getByRole('region', { name: '1967: Francie' })).toHaveFocus();
    expect(screen.getByRole('button', { name: '1967, Francie' })).toHaveTextContent('1967');
  });

  it('tells a wrong guess kindly, with the year, and doesn’t count it', () => {
    const { container } = render(<BlackBarbieTimeline />);
    fireEvent.click(screen.getByRole('button', { name: /1985$/ }));
    expect(container.querySelector('.bht-feedback-wrong')).toHaveTextContent('Good try! It was 1967.');
    expect(container.querySelector('.bht-score strong')).toHaveTextContent('0');
    expect(container.querySelector('.bht-burst-big')).toBeNull();
    // A guess is made once: the buttons have gone.
    expect(screen.queryByRole('group', { name: /Guess the year/ })).toBeNull();
  });

  it('guesses by the keys 1 to 4, from a keyboard at the front of the class', () => {
    const { container } = render(<BlackBarbieTimeline />);
    fireEvent.keyDown(document.body, { key: '2' });
    expect(container.querySelector('.bht-feedback-right')).not.toBeNull();
    fireEvent.keyDown(document.body, { key: 'ArrowRight' });
    fireEvent.keyDown(document.body, { key: '4' });
    expect(container.querySelector('.bht-feedback-wrong')).toHaveTextContent('Good try! It was 1968.');
    // Once shown, a number key does nothing.
    fireEvent.keyDown(document.body, { key: '1' });
    expect(container.querySelector('.bht-score strong')).toHaveTextContent('1');
  });

  it('shows the last stop, Today, with no guess and a way to the final challenge', () => {
    render(<BlackBarbieTimeline />);
    fireEvent.keyDown(document.body, { key: 'End' });
    expect(screen.queryByRole('group', { name: /Guess the year/ })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /Final challenge: before or after\?/ }));
    expect(screen.getByRole('heading', { level: 2, name: 'Before or after?' })).toHaveFocus();
    expect(window.location.hash).toBe('#order');
  });

  it('opens the final challenge from its address', () => {
    window.history.replaceState(null, '', '/#order');
    render(<BlackBarbieTimeline />);
    expect(screen.getByRole('heading', { level: 2, name: 'Before or after?' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Back to the timeline' }));
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Guess the year: Francie');
  });
});

describe('sound', () => {
  const made: string[] = [];
  class FakeContext {
    state = 'running';
    currentTime = 0;
    destination = {};
    resume = jest.fn();
    createOscillator() {
      made.push('osc');
      return { type: '', frequency: { value: 0 }, connect: (n: unknown) => n, start: jest.fn(), stop: jest.fn() };
    }
    createGain() {
      return { gain: { setValueAtTime: jest.fn(), linearRampToValueAtTime: jest.fn(), exponentialRampToValueAtTime: jest.fn() }, connect: (n: unknown) => n };
    }
  }
  beforeEach(() => {
    made.length = 0;
    resetAudioForTests();
    (window as unknown as { AudioContext: unknown }).AudioContext = FakeContext;
  });
  afterEach(() => {
    delete (window as unknown as { AudioContext?: unknown }).AudioContext;
  });

  it('is off until the visitor turns it on, and remembered', () => {
    render(<BlackBarbieTimeline />);
    const toggle = screen.getByRole('button', { name: /Sound off/ });
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(screen.getByRole('button', { name: /1967$/ }));
    expect(made).toEqual([]);

    fireEvent.click(screen.getByRole('button', { name: '1967, Francie' }));
    fireEvent.keyDown(document.body, { key: 'ArrowRight' });
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
    expect(window.sessionStorage.getItem('mm-sound')).toBe('on');
    made.length = 0;
    fireEvent.click(screen.getByRole('button', { name: /1968$/ }));
    expect(made).toHaveLength(notesFor('right').length);
  });

  it('chimes up for right, falls softly for wrong, and plays a fanfare', () => {
    const right = notesFor('right');
    const wrong = notesFor('wrong');
    expect(right.map((n) => n.hz)).toEqual([...right.map((n) => n.hz)].sort((a, b) => a - b));
    expect(wrong[0].hz).toBeGreaterThan(wrong[1].hz);
    expect(Math.max(...wrong.map((n) => n.level))).toBeLessThan(Math.max(...right.map((n) => n.level)));
    expect(notesFor('fanfare').length).toBeGreaterThan(right.length);
  });
});

describe('the final challenge: before or after?', () => {
  const ids = SORT_CARDS.map((c) => c.id);

  it('reasons from the words: a clue for each doll with no year in it, quoted exactly where it is the poster’s', () => {
    expect([...ids].sort()).toEqual(['1967', '1968', '1990', '2008', '2022']);
    for (const c of SORT_CARDS) {
      expect(c.clue).not.toMatch(/\b(19|20)\d\d\b/);
      if (c.from === 'poster') expect(POSTER_SENTENCES.some((s) => s.includes(c.clue))).toBe(true);
      // Every quotation in a hint is the poster's own words.
      for (const [, q] of c.hint.matchAll(/“([^”]+)”/g)) expect(POSTER_SENTENCES.some((s) => s.includes(q))).toBe(true);
      const year = DATED_STOPS.find((s) => s.id === c.id)!.year!;
      expect(c.side).toBe(year < 1980 ? 'before' : 'after');
    }
    // The notes' clues are their own words, without the years.
    const plain = (t: string) => t.replace(/ \([^)]*\)/g, '').replace(/’/g, "'").replace(/\.$/, '');
    expect(plain(ADDED_NOTES.dollsOfTheWorld.text)).toContain(plain(SORT_CARDS.find((c) => c.id === '1990')!.clue));
    expect(plain(ADDED_NOTES.inspiringWomen.text)).toContain(plain(SORT_CARDS.find((c) => c.id === '2022')!.clue));
    // Shani is not a card: its note does not say whether it came before or after.
    expect(ids).not.toContain('1991');
  });

  const deck = ['2008', '1967', '2022', '1968', '1990'];
  const setup = () => {
    const cue = jest.fn();
    const onStartOver = jest.fn();
    render(<OrderChallenge onBack={jest.fn()} onStartOver={onStartOver} cue={cue} reduced initialDeck={deck} />);
    return { cue, onStartOver };
  };
  const card = () => document.querySelector('.bht-sort-card') as HTMLElement;
  const pile = (side: 'before' | 'after') => document.querySelector(`.bht-pile-${side}`) as HTMLElement;
  const answer = (side: 'before' | 'after') => fireEvent.click(within(card()).getByRole('button', { name: side === 'before' ? 'Before 1980' : 'After 1980' }));

  it('gives a hint after a wrong try, then places the card with its year when right', async () => {
    const { cue } = setup();
    expect(screen.getByRole('heading', { level: 2, name: 'Before or after?' })).toHaveFocus();
    expect(card()).toHaveTextContent('Card 1 of 5');
    expect(card()).toHaveTextContent('AKA Centennial Barbie');
    expect(card()).not.toHaveTextContent('2008');
    answer('before');
    expect(cue).toHaveBeenLastCalledWith('wrong');
    const hint = SORT_CARDS.find((c) => c.id === '2008')!.hint;
    expect(screen.getByRole('status')).toHaveTextContent(hint);
    expect(card()).toHaveAttribute('data-state', 'hint');
    answer('after');
    expect(cue).toHaveBeenLastCalledWith('right');
    expect(screen.getByRole('status')).toHaveTextContent('Yes! AKA Centennial Barbie and “So In Style”: 2008–09, after 1980.');
    expect(pile('after')).toHaveTextContent('2008–09');
    const next = within(card()).getByRole('button', { name: 'Next card' });
    await waitFor(() => expect(next).toHaveFocus());
    fireEvent.click(next);
    expect(card()).toHaveTextContent('Francie');
    await waitFor(() => expect(card()).toHaveFocus());
  });

  it('answers by the arrow keys too, and ends on every stop in time, Shani too', async () => {
    const { cue, onStartOver } = setup();
    for (const id of deck) {
      const side = SORT_CARDS.find((c) => c.id === id)!.side;
      fireEvent.keyDown(card(), { key: side === 'before' ? 'ArrowLeft' : 'ArrowRight' });
      fireEvent.click(within(card()).getByRole('button', { name: id === deck.at(-1) ? 'See them all in time' : 'Next card' }));
    }
    expect(cue).toHaveBeenLastCalledWith('fanfare');
    expect(screen.getByRole('status')).toHaveTextContent('Every one right on the first try!');
    const line = within(screen.getByRole('list')).getAllByRole('listitem').map((li) => li.textContent);
    expect(line).toEqual(DATED_STOPS.map((s) => `${s.yearLabel ?? s.year}${s.name}`));
    expect(line.some((l) => l!.includes('Shani'))).toBe(true);
    await waitFor(() => expect(screen.getByText('Every one right on the first try!', { selector: 'p.bht-order-result' })).toHaveFocus());
    fireEvent.click(screen.getByRole('button', { name: 'Play again from the start' }));
    expect(onStartOver).toHaveBeenCalled();
  });

  it('counts only first tries, and plays again in a new order', () => {
    const { cue } = setup();
    for (const id of deck) {
      const side = SORT_CARDS.find((c) => c.id === id)!.side;
      if (id === '1967') answer('after');
      answer(side);
      fireEvent.click(within(card()).getByRole('button', { name: /Next card|See them all in time/ }));
    }
    expect(cue).not.toHaveBeenCalledWith('fanfare');
    expect(screen.getByRole('status')).toHaveTextContent(TIMELINE_TEXT.result(4, 5));
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(card()).toHaveTextContent('Card 1 of 5');
    expect(pile('before').querySelectorAll('li')).toHaveLength(0);
  });

  it('shuffles the cards from the browser’s seed', () => {
    render(<OrderChallenge onBack={jest.fn()} onStartOver={jest.fn()} cue={jest.fn()} reduced />);
    expect(SORT_CARDS.map((c) => DATED_STOPS.find((s) => s.id === c.id)!.name).some((n) => card().textContent!.includes(n))).toBe(true);
  });

  it('keeps the cards in the room’s keys: the arrows don’t move the timeline behind', () => {
    window.history.replaceState(null, '', '/#order');
    render(<BlackBarbieTimeline />);
    act(() => {
      fireEvent.keyDown(document.body, { key: 'ArrowRight' });
    });
    expect(screen.getByRole('heading', { level: 2, name: 'Before or after?' })).toBeInTheDocument();
  });
});

/*
 * Found in the room's QA pass: the arrow keys worked only from a stop, and
 * counted from the stop shown rather than the one focused; the Earlier and
 * Later buttons dropped the focus as they went dim at the ends.
 */
describe('fixes from the QA pass', () => {
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
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Guess the year: Christie');
    showMe();
    const words = screen.getByRole('region', { name: '1968: Christie' });
    expect(words).toHaveFocus();
    fireEvent.keyDown(words, { key: 'ArrowRight' });
    // The words are drawn afresh, and keep the focus.
    expect(screen.getByRole('region', { name: 'Guess the year: The first Black Barbie' })).toHaveFocus();
    showMe();
    // Down scrolls the words; it doesn't move the timeline.
    fireEvent.keyDown(screen.getByRole('region', { name: '1980: The first Black Barbie' }), { key: 'ArrowDown' });
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('1980: The first Black Barbie');
    // A link in the Sources drawer keeps its keys, and so does the drawer.
    fireEvent.click(stopButton('Shani'));
    showMe();
    const drawer = openSources();
    fireEvent.keyDown(within(drawer).getByRole('link', { name: /Shani and Her Friends/ }), { key: 'ArrowRight' });
    fireEvent.keyDown(drawer, { key: 'ArrowRight' });
    expect(document.getElementById('bht-stop-heading')).toHaveTextContent('1991: Shani');
  });

  it('keeps only the stop shown in the tab order', () => {
    render(<BlackBarbieTimeline />);
    fireEvent.click(stopButton('AKA Centennial Barbie and “So In Style”'));
    const tabbable = screen.getAllByRole('button').filter((b) => b.classList.contains('bht-stop') && b.getAttribute('tabindex') === '0');
    expect(tabbable.map((b) => b.getAttribute('aria-label'))).toEqual(['Stop 6, AKA Centennial Barbie and “So In Style”, year hidden']);
  });

  it('hands the focus to the end stop as Earlier or Later goes dim', () => {
    render(<BlackBarbieTimeline />);
    fireEvent.click(stopButton('Inspiring Women'));
    const later = screen.getByRole('button', { name: 'Later' });
    later.focus();
    fireEvent.click(later);
    expect(later).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Today' })).toHaveFocus();
    const earlier = screen.getByRole('button', { name: 'Earlier' });
    for (let i = 0; i < TIMELINE_STOPS.length - 1; i++) fireEvent.click(earlier);
    expect(earlier).toBeDisabled();
    expect(stopButton('Francie')).toHaveFocus();
  });
});

describe('the added stops', () => {
  it('each show their note, its sources in the Sources drawer, with no poster quote', () => {
    render(<BlackBarbieTimeline />);
    const cases: [string, string, string, string[]][] = [
      ['Dolls of the World', 'c. 1990: Dolls of the World', ADDED_NOTES.dollsOfTheWorld.text, ['https://virtualblackdollmuseum.com/2024/03/15/barbie-dolls-of-the-world/']],
      ['Shani', '1991: Shani', ADDED_NOTES.shani.text, ['https://virtualblackdollmuseum.com/2021/03/18/shani-and-her-friends/']],
      [
        'Inspiring Women',
        '2022–23: Inspiring Women',
        ADDED_NOTES.inspiringWomen.text,
        [
          'https://creations.mattel.com/collections/barbie-signature/products/barbie-inspiring-women-ida-b-wells-hcb81',
          'https://www.nbcnews.com/news/nbcblk/barbie-honors-first-female-self-made-millionaire-madam-cj-walker-new-d-rcna45322',
          'https://edition.cnn.com/style/article/bessie-coleman-barbie-doll-cec',
        ],
      ],
    ];
    for (const [name, heading, text, hrefs] of cases) {
      fireEvent.click(stopButton(name));
      showMe();
      const words = screen.getByRole('region', { name: heading });
      expect(words).toHaveTextContent(text);
      expect(words.querySelector('.bht-sentence')).toBeNull();
      expect(words.querySelector('mark')).toBeNull();
      // Nothing cited inline: the sources are in the drawer, under the stop.
      expect(words.querySelectorAll('a')).toHaveLength(0);
      expect(within(words).queryByText(/^Sources?:/)).toBeNull();
      expect(screen.getByText(/A museum note/)).toBeInTheDocument();
      const group = sourcesGroup(openSources(), heading);
      expect(within(group).getAllByRole('link').map((a) => a.getAttribute('href'))).toEqual(hrefs);
      fireEvent.click(screen.getByRole('button', { name: 'Close sources' }));
    }
    // The drawer lists the three added stops, and only them, until the owner's photographs come.
    expect(within(openSources()).getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual(['c. 1990: Dolls of the World', '1991: Shani', '2022–23: Inspiring Women']);
    fireEvent.click(screen.getByRole('button', { name: 'Close sources' }));
    // Back on a poster stop, the source line is the poster's again.
    fireEvent.click(stopButton('AKA Centennial Barbie and “So In Style”'));
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
  it('add nothing to the room while there are none', () => {
    const { container } = render(<BlackBarbieTimeline />);
    for (const s of TIMELINE_STOPS) {
      fireEvent.click(stopButton(s.name));
      if (s.year !== null) showMe();
      expect(container.querySelector('figure, .bht-photo')).toBeNull();
    }
  });
});
