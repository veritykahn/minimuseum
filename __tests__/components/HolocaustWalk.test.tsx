import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import NeverForget from '@/app/exhibitions/holocaust/stones/NeverForget';
import Countdown, { isRemembranceDay, nextRemembrance } from '@/app/exhibitions/holocaust/stones/Countdown';
import { AUTO_MS, KADISHMAN_URL, STEP_MS, walkSourceGroups, wordsForStep } from '@/app/exhibitions/holocaust/stones/Walk';
import { AMBIENTS, PLACEHOLDERS, WALK_LINES, ambientSrc, lineForStep, shownLineForStep, slotFiles, slotNumber } from '@/app/exhibitions/holocaust/stones/walkLines';
import { SILHOUETTE_KINDS } from '@/app/exhibitions/holocaust/stones/WalkPicture';
import { walkSlotsOnDisk } from '@/app/exhibitions/holocaust/stones/walkSlots';
import { ACROSS, HALF_WIDTH, fog, project, makeView, rowStones, rowsInView } from '@/app/exhibitions/holocaust/stones/walkScene';
import { LIBERATION_LINE } from '@/app/exhibitions/holocaust/holocaust';

/*
 * Never Forget's countdown to January 27 and its walk: the date sums, the
 * day's own line, the path's geometry, and walking it (slowly, a step at a
 * time, full screen; the history a line a step from the first step, each
 * with its picture (or its placeholder) and its source in the Sources
 * drawer, never inline; no blank step; the sound off until chosen; no
 * walking on under reduced motion; the credit to the Jewish Museum Berlin,
 * in the drawer).
 */

beforeAll(() => {
  jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
});
beforeEach(() => {
  localStorage.clear();
  window.history.replaceState(null, '', '/');
  global.fetch = jest.fn(async () => ({ ok: false, status: 503, json: async () => ({}) }) as Response) as unknown as typeof fetch;
});

function reducedMotion(on: boolean) {
  window.matchMedia = ((q: string) => ({ matches: on && q.includes('reduce'), media: q, addEventListener: () => {}, removeEventListener: () => {} })) as unknown as typeof window.matchMedia;
}

describe('the countdown to January 27', () => {
  it('counts to the next January 27, this year’s until it begins', () => {
    expect(nextRemembrance(new Date(2026, 9, 29, 12))).toEqual(new Date(2027, 0, 27));
    expect(nextRemembrance(new Date(2027, 0, 26, 23, 59))).toEqual(new Date(2027, 0, 27));
    expect(nextRemembrance(new Date(2027, 0, 27, 0, 0, 1))).toEqual(new Date(2028, 0, 27));
    expect(isRemembranceDay(new Date(2027, 0, 27, 15))).toBe(true);
    expect(isRemembranceDay(new Date(2027, 0, 28))).toBe(false);
  });

  describe('on screen', () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    it('gives days, hours, minutes and seconds, with a spoken label', () => {
      jest.setSystemTime(new Date(2027, 0, 25, 22, 30, 15));
      render(<Countdown />);
      expect(screen.getByRole('timer', { name: '1 day, 1 hour and 29 minutes until International Holocaust Remembrance Day, January 27, 2027' })).toHaveTextContent('1day01hour29minutes45seconds');
      act(() => { jest.advanceTimersByTime(1000); });
      expect(screen.getByRole('timer')).toHaveTextContent('44seconds');
    });

    it('on the day itself, says so quietly, in the poster’s words', () => {
      jest.setSystemTime(new Date(2027, 0, 27, 9));
      render(<Countdown />);
      expect(screen.queryByRole('timer')).toBeNull();
      expect(screen.getByText(LIBERATION_LINE, { exact: false })).toHaveTextContent(`Today is International Holocaust Remembrance Day. ${LIBERATION_LINE}`);
    });
  });
});

describe('the path', () => {
  it('lays the same plain stones each time, across the path and in their row', () => {
    expect(rowStones(12)).toEqual(rowStones(12));
    for (const row of [0, 1, 7, 500]) {
      const stones = rowStones(row);
      expect(stones.length).toBe(row % 2 === 0 ? ACROSS : ACROSS - 1);
      for (const s of stones) {
        expect(Math.abs(s.x)).toBeLessThan(HALF_WIDTH);
        expect(s.outline).toHaveLength(8);
      }
    }
  });

  it('draws the rows far to near, and nearer stones lower and brighter', () => {
    const rows = rowsInView(10);
    expect(rows[0]).toBeGreaterThan(rows[rows.length - 1]);
    const v = makeView(1440, 900);
    expect(project(v, 0, 3)![1]).toBeGreaterThan(project(v, 0, 10)![1]);
    expect(project(v, 0, -1)).toBeNull();
    expect(fog(2)).toBeLessThan(fog(20));
  });
});

describe('the walk', () => {
  afterEach(() => {
    jest.useRealTimers();
    reducedMotion(false);
  });

  const begin = () => {
    window.history.replaceState(null, '', '/#walk');
    render(<NeverForget />);
    const panel = screen.getByRole('tabpanel', { name: 'The walk' });
    expect(panel).toHaveTextContent('Each one stands for a person.');
    fireEvent.click(screen.getByRole('button', { name: 'Begin the walk' }));
    return screen.getByRole('dialog', { name: 'The walk' });
  };

  it('is taken full screen, and left with Escape or its button', () => {
    const walk = begin();
    expect(walk).toHaveClass('hos-walk-full');
    expect(walk.parentElement).toBe(document.body);
    fireEvent.keyDown(walk, { key: 'Escape' });
    expect(screen.queryByRole('dialog', { name: 'The walk' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Begin the walk' }));
    fireEvent.click(screen.getByRole('button', { name: 'Leave the walk' }));
    expect(screen.queryByRole('dialog', { name: 'The walk' })).toBeNull();
  });

  it('walks slowly, a step at a time: a line of the history and a picture at every step, from the first, in order, with no blank step', () => {
    jest.useFakeTimers();
    const walk = begin();
    const step = within(walk).getByRole('button', { name: 'Take a step' });
    const say = () => walk.querySelector('[role="status"]')!.textContent;
    fireEvent.click(step);
    expect(say()).toBe(WALK_LINES[0].text);
    // A step cannot be hurried: a second press while it is taken does nothing.
    fireEvent.click(step);
    expect(walk.querySelector('[data-line]')).toHaveAttribute('data-step', '1');
    const next = () => {
      act(() => { jest.advanceTimersByTime(STEP_MS + 10); });
      fireEvent.click(step);
    };
    WALK_LINES.forEach((line, i) => {
      if (i > 0) next();
      expect(say()).toBe(line.text);
      const words = walk.querySelector(`[data-line="${line.id}"]`)!;
      expect(words).toHaveTextContent(line.text);
      // Its sources are in the drawer, not under the line.
      expect(within(words as HTMLElement).queryByRole('link')).toBeNull();
      // The picture ahead: the owner's slot, its placeholder standing in, marked as temporary.
      const picture = walk.querySelector(`[data-slot="${line.slot}"]`)!;
      expect(picture).toHaveAttribute('data-placeholder', line.placeholder);
      expect(picture).toHaveTextContent('Picture to come');
      expect(within(walk).getByRole('img', { name: `${line.image} (picture to come)` })).toBeInTheDocument();
    });
    // Past the last line, the path goes on: the last line and picture stay.
    next();
    expect(say()).toBe('The path goes on.');
    expect(walk.querySelector(`[data-line="${WALK_LINES[31].id}"]`)).toHaveTextContent('The path goes on.');
    expect(walk.querySelector(`[data-slot="${WALK_LINES[31].slot}"]`)).toBeInTheDocument();
  });

  it('lists every line’s source, by step, and the Kadishman credit, in the walk’s Sources drawer', () => {
    const walk = begin();
    expect(within(walk).queryByRole('link')).toBeNull();
    fireEvent.click(within(walk).getByRole('button', { name: 'Sources' }));
    const drawer = within(walk).getByRole('dialog', { name: 'Sources' });
    expect(within(drawer).getByRole('link', { name: /Fallen Leaves/ })).toHaveAttribute('href', KADISHMAN_URL);
    WALK_LINES.forEach((line, i) => {
      const group = within(drawer).getByRole('heading', { name: `The walk, step ${i + 1}` }).closest('section')!;
      for (const s of line.sources) expect(within(group).getByRole('link', { name: s.label })).toHaveAttribute('href', s.href);
    });
    // Escape closes the drawer, and leaves the walk open.
    fireEvent.keyDown(drawer, { key: 'Escape' });
    expect(within(walk).queryByRole('dialog', { name: 'Sources' })).toBeNull();
    expect(screen.getByRole('dialog', { name: 'The walk' })).toBeInTheDocument();
  });

  it('uses the owner’s picture once it is in its slot, under either name', () => {
    window.history.replaceState(null, '', '/#walk');
    render(<NeverForget pictures={{ [WALK_LINES[0].slot]: 'walk-01.jpg' }} />);
    fireEvent.click(screen.getByRole('button', { name: 'Begin the walk' }));
    expect(wordsForStep(1)).toEqual({ kind: 'line', line: WALK_LINES[0], end: false });
    const walk = screen.getByRole('dialog', { name: 'The walk' });
    fireEvent.click(within(walk).getByRole('button', { name: 'Take a step' }));
    expect(within(walk).getByRole('img', { name: WALK_LINES[0].image })).toHaveAttribute('src', '/exhibitions/holocaust/walk/walk-01.jpg');
    expect(within(walk).queryByText('Picture to come')).toBeNull();
  });

  it('keeps the sound off until the visitor turns it on', () => {
    const walk = begin();
    const sound = within(walk).getByRole('button', { name: /Sound: off/ });
    expect(sound).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(sound);
    // jsdom has no Web Audio: it says so, and stays off.
    expect(sound).toHaveAttribute('aria-pressed', 'false');
    expect(walk.querySelector('[role="status"]')).toHaveTextContent('Sound is not available in this browser.');
  });

  it('credits Menashe Kadishman’s Fallen Leaves, at the Jewish Museum Berlin, in the room’s Sources drawer', () => {
    window.history.replaceState(null, '', '/#walk');
    render(<NeverForget />);
    expect(screen.queryByRole('link', { name: /Fallen Leaves/ })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Sources' }));
    const link = screen.getByRole('link', { name: /Fallen Leaves/ });
    expect(link).toHaveAttribute('href', KADISHMAN_URL);
    expect(KADISHMAN_URL).toBe('https://www.jmberlin.de/en/shalekhet-fallen-leaves');
    expect(link.closest('li')).toHaveTextContent('The walk is an original piece, inspired by: Menashe Kadishman, Fallen Leaves (Shalekhet), Jewish Museum Berlin');
    expect(walkSourceGroups()).toHaveLength(WALK_LINES.length + 1);
  });

  it('walks on by itself only when motion is allowed, slowly enough to read', () => {
    expect(AUTO_MS).toBeGreaterThanOrEqual(6000);
    const walk = begin();
    expect(within(walk).getByRole('button', { name: 'Walk on slowly' })).toBeInTheDocument();
    cleanup();
    reducedMotion(true);
    const still = begin();
    expect(still).toHaveClass('is-still');
    expect(within(still).queryByRole('button', { name: 'Walk on slowly' })).toBeNull();
    expect(within(still).getByRole('button', { name: 'Take a step' })).toBeEnabled();
  });

  it('is the third tab, with its own address', () => {
    render(<NeverForget />);
    fireEvent.keyDown(screen.getByRole('tab', { name: 'Lay a stone' }), { key: 'End' });
    expect(screen.getByRole('tab', { name: 'The walk' })).toHaveAttribute('aria-selected', 'true');
    expect(window.location.hash).toBe('#walk');
  });
});

describe('the walk’s lines and slots', () => {
  it('has 32 short lines, in the order of the history, each with a source from Yad Vashem, the USHMM or the HMD Trust, a picture slot and a part', () => {
    expect(WALK_LINES.map((l) => l.id)).toEqual(Array.from({ length: 32 }, (_, i) => `W${i + 1}`));
    for (const l of WALK_LINES) {
      expect(l.sources.length).toBeGreaterThan(0);
      for (const s of l.sources) expect(s.href).toMatch(/^https:\/\/(encyclopedia\.ushmm\.org|collections\.ushmm\.org|(www\.)?hmd\.org\.uk|www\.yadvashem\.org)\//);
      expect(l.slot).toMatch(/^w\d\d-[a-z-]+$/);
      expect(PLACEHOLDERS).toContain(l.placeholder);
      expect(l.text.split(/\s+/).length).toBeLessThanOrEqual(30);
    }
    // Every slot is used once, so every picture has one place.
    expect(new Set(WALK_LINES.map((l) => l.slot)).size).toBe(32);
    expect(WALK_LINES.map((l) => slotNumber(l.slot)).sort((x, y) => x - y)).toEqual(Array.from({ length: 32 }, (_, i) => i + 1));
    expect(WALK_LINES.find((l) => l.text.includes('synagogues'))!.text).toBe('November 9–10, 1938. More than 1,400 synagogues were burned.');
    // In order: every year named comes no earlier than the last.
    const years = WALK_LINES.map((l) => l.text.match(/\b(19[2-4]\d)\b/)?.[1]).filter(Boolean).map(Number);
    expect(years).toEqual([...years].sort((x, y) => x - y));
    expect(years[0]).toBe(1929);
    expect(WALK_LINES[2].text).toMatch(/^In 1933/);
    // Objects and places only: no picture shows a person.
    expect(WALK_LINES.map((l) => l.image.replace(/\(no [^)]*\)/, '')).join(' ')).not.toMatch(/\b(person|people|child|man|woman|face|body|victim)\b/i);
    expect(WALK_LINES.map((l) => l.part)).toEqual([...Array(3).fill('before'), ...Array(21).fill('during'), ...Array(8).fill('after')]);
  });

  it('stands in with silhouettes of the agreed objects only, until the owner’s pictures come', () => {
    expect([...SILHOUETTE_KINDS].sort()).toEqual([...PLACEHOLDERS].sort());
    expect([...PLACEHOLDERS].sort()).toEqual(['candle', 'chair', 'door', 'shoes', 'suitcase', 'tracks']);
  });

  it('finds the owner’s files when the page is built, under the slot’s name or its number, and none are there yet', () => {
    expect(walkSlotsOnDisk()).toEqual({ pictures: {}, ambients: [] });
    expect(slotFiles('w07-broken-window')).toEqual(['w07-broken-window.webp', 'w07-broken-window.jpg', 'walk-07.jpg', 'walk-07.webp', 'walk-07.png']);
    expect(AMBIENTS.map(ambientSrc)).toEqual([
      '/exhibitions/holocaust/walk/sound/ambient-before.mp3',
      '/exhibitions/holocaust/walk/sound/ambient-during.mp3',
      '/exhibitions/holocaust/walk/sound/ambient-after.mp3',
    ]);
    expect(lineForStep(0)).toBeNull();
    expect(lineForStep(1)).toBe(WALK_LINES[0]);
    expect(lineForStep(32)).toBe(WALK_LINES[31]);
    expect(lineForStep(33)).toBeNull();
    expect(shownLineForStep(0)).toBeNull();
    expect(shownLineForStep(40)).toBe(WALK_LINES[31]);
    expect(wordsForStep(0)).toEqual({ kind: 'none' });
    expect(wordsForStep(32)).toEqual({ kind: 'line', line: WALK_LINES[31], end: true });
  });
});
