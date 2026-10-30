import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import NeverForget from '@/app/exhibitions/holocaust/stones/NeverForget';
import Countdown, { isRemembranceDay, nextRemembrance } from '@/app/exhibitions/holocaust/stones/Countdown';
import { AUTO_MS, KADISHMAN_URL, LINE_AFTER, STEP_MS, wordsForStep } from '@/app/exhibitions/holocaust/stones/Walk';
import { AMBIENTS, WALK_LINES, ambientSrc, lineForStep } from '@/app/exhibitions/holocaust/stones/walkLines';
import { MOTIFS } from '@/app/exhibitions/holocaust/stones/WalkPicture';
import { walkSlotsOnDisk } from '@/app/exhibitions/holocaust/stones/walkSlots';
import { ACROSS, HALF_WIDTH, fog, project, makeView, rowStones, rowsInView } from '@/app/exhibitions/holocaust/stones/walkScene';
import { LIBERATION_LINE, REMEMBRANCE_LINE } from '@/app/exhibitions/holocaust/holocaust';

/*
 * Never Forget's countdown to January 27 and its walk: the date sums, the
 * day's own line, the path's geometry, and walking it (slowly, a step at a
 * time, full screen; the poster's line after a few steps, then the
 * history a line a step, each with its source and its picture slot; the sound off until chosen;
 * no walking on under reduced motion; the credit to the Jewish Museum
 * Berlin).
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

  it('walks slowly, a step at a time: the poster’s line at step 3, then the history a line a step, in order, each with its source', () => {
    jest.useFakeTimers();
    const walk = begin();
    const step = within(walk).getByRole('button', { name: 'Take a step' });
    const say = () => walk.querySelector('[role="status"]')!.textContent;
    fireEvent.click(step);
    expect(say()).toBe('You step forward, onto the stones.');
    // A step cannot be hurried: a second press while it is taken does nothing.
    fireEvent.click(step);
    const next = () => {
      act(() => { jest.advanceTimersByTime(STEP_MS + 10); });
      fireEvent.click(step);
    };
    for (let i = 1; i < LINE_AFTER; i++) next();
    expect(say()).toBe(REMEMBRANCE_LINE);
    expect(walk).toHaveTextContent(REMEMBRANCE_LINE);
    for (const line of WALK_LINES.slice(0, 4)) {
      next();
      expect(say()).toBe(line.text);
      const words = walk.querySelector(`[data-line="${line.id}"]`)!;
      expect(words).toHaveTextContent(line.text);
      for (const s of line.sources) expect(within(words as HTMLElement).getByRole('link', { name: s.label })).toHaveAttribute('href', s.href);
      // The picture ahead: the owner's slot, standing in until she supplies it.
      expect(walk.querySelector(`[data-slot="${line.slot}"]`)).toBeInTheDocument();
      expect(within(walk).getByRole('img', { name: line.image })).toBeInTheDocument();
    }
  });

  it('uses the owner’s picture once it is in its slot', () => {
    window.history.replaceState(null, '', '/#walk');
    render(<NeverForget pictures={[WALK_LINES[0].slot]} />);
    fireEvent.click(screen.getByRole('button', { name: 'Begin the walk' }));
    expect(wordsForStep(LINE_AFTER + 1)).toEqual({ kind: 'line', line: WALK_LINES[0] });
    const walk = screen.getByRole('dialog', { name: 'The walk' });
    for (let i = 0; i <= LINE_AFTER; i++) {
      act(() => { jest.spyOn(performance, 'now').mockReturnValue(1e6 + i * 10_000); });
      fireEvent.click(within(walk).getByRole('button', { name: 'Take a step' }));
    }
    expect(within(walk).getByRole('img', { name: WALK_LINES[0].image })).toHaveAttribute('src', `/exhibitions/holocaust/walk/${WALK_LINES[0].slot}.webp`);
    jest.restoreAllMocks();
    jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
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

  it('credits Menashe Kadishman’s Fallen Leaves, at the Jewish Museum Berlin', () => {
    window.history.replaceState(null, '', '/#walk');
    render(<NeverForget />);
    const link = screen.getByRole('link', { name: /Fallen Leaves/ });
    expect(link).toHaveAttribute('href', KADISHMAN_URL);
    expect(KADISHMAN_URL).toBe('https://www.jmberlin.de/en/shalekhet-fallen-leaves');
    expect(link.closest('p')).toHaveTextContent('Inspired by Menashe Kadishman’s Fallen Leaves (Shalekhet) at the Jewish Museum Berlin');
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
  it('has the 32 drafted lines, in order, each with a source, a picture slot and a part', () => {
    expect(WALK_LINES.map((l) => l.id)).toEqual(Array.from({ length: 32 }, (_, i) => `W${i + 1}`));
    for (const l of WALK_LINES) {
      expect(l.sources.length).toBeGreaterThan(0);
      expect(l.slot).toMatch(/^w\d\d-[a-z-]+$/);
      expect(MOTIFS).toContain(l.motif);
      expect(l.text.split(/\s+/).length).toBeLessThanOrEqual(30);
    }
    expect(new Set(WALK_LINES.map((l) => l.slot)).size).toBe(32);
    expect(WALK_LINES.find((l) => l.id === 'W7')!.text).toBe('November 9–10, 1938. More than 1,400 synagogues were burned.');
    // Objects and places only: no picture shows a person.
    expect(WALK_LINES.map((l) => l.image.replace(/\(no [^)]*\)/, '')).join(' ')).not.toMatch(/\b(person|people|child|man|woman|face|body|victim)\b/i);
    expect(WALK_LINES.map((l) => l.part)).toEqual([...Array(3).fill('before'), ...Array(21).fill('during'), ...Array(8).fill('after')]);
  });

  it('finds the owner’s files when the page is built, and none are there yet', () => {
    expect(walkSlotsOnDisk()).toEqual({ pictures: [], ambients: [] });
    expect(AMBIENTS.map(ambientSrc)).toEqual([
      '/exhibitions/holocaust/walk/sound/ambient-before.mp3',
      '/exhibitions/holocaust/walk/sound/ambient-during.mp3',
      '/exhibitions/holocaust/walk/sound/ambient-after.mp3',
    ]);
    expect(lineForStep(LINE_AFTER, LINE_AFTER)).toBeNull();
    expect(lineForStep(LINE_AFTER + 32, LINE_AFTER)).toBe(WALK_LINES[31]);
    expect(lineForStep(LINE_AFTER + 33, LINE_AFTER)).toBeNull();
  });
});
