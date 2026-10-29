import { act, fireEvent, render, screen } from '@testing-library/react';
import LayAStone from '@/app/exhibitions/holocaust/stones/page';
import Countdown, { isRemembranceDay, nextRemembrance } from '@/app/exhibitions/holocaust/stones/Countdown';
import { KADISHMAN_URL, LINE_AFTER, STEP_MS } from '@/app/exhibitions/holocaust/stones/Walk';
import { ACROSS, HALF_WIDTH, fog, project, makeView, rowStones, rowsInView } from '@/app/exhibitions/holocaust/stones/walkScene';
import { LIBERATION_LINE, REMEMBRANCE_LINE } from '@/app/exhibitions/holocaust/holocaust';

/*
 * Lay a Stone's countdown to January 27 and its walk: the date sums, the
 * day's own line, the path's geometry, and walking it (slowly, a step at a
 * time; the poster's line after a few steps; the sound off until chosen;
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

  it('walks slowly, a step at a time, and sets the poster’s line after a few steps', () => {
    jest.useFakeTimers();
    window.history.replaceState(null, '', '/#walk');
    render(<LayAStone />);
    const panel = screen.getByRole('tabpanel', { name: 'The walk' });
    expect(panel).toHaveTextContent('Each one stands for a person.');
    const step = screen.getByRole('button', { name: 'Take a step' });
    fireEvent.click(step);
    expect(screen.getAllByRole('status').some((s) => s.textContent === 'You step forward, onto the stones.')).toBe(true);
    // A step cannot be hurried: a second press while it is taken does nothing.
    fireEvent.click(step);
    for (let i = 1; i < LINE_AFTER; i++) {
      act(() => { jest.advanceTimersByTime(STEP_MS + 10); });
      fireEvent.click(step);
    }
    expect(screen.getAllByRole('status').some((s) => s.textContent === REMEMBRANCE_LINE)).toBe(true);
    expect(panel.querySelector('.hos-walk-line')).toHaveClass('is-shown');
  });

  it('keeps the sound off until the visitor turns it on', () => {
    window.history.replaceState(null, '', '/#walk');
    render(<LayAStone />);
    const sound = screen.getByRole('button', { name: /Sound of the steps: off/ });
    expect(sound).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(sound);
    // jsdom has no Web Audio: it says so, and stays off.
    expect(sound).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getAllByRole('status').some((s) => s.textContent === 'Sound is not available in this browser.')).toBe(true);
  });

  it('credits Menashe Kadishman’s Fallen Leaves, at the Jewish Museum Berlin', () => {
    window.history.replaceState(null, '', '/#walk');
    render(<LayAStone />);
    const link = screen.getByRole('link', { name: /Fallen Leaves/ });
    expect(link).toHaveAttribute('href', KADISHMAN_URL);
    expect(KADISHMAN_URL).toBe('https://www.jmberlin.de/en/shalekhet-fallen-leaves');
    expect(link.closest('p')).toHaveTextContent('Inspired by Menashe Kadishman’s Fallen Leaves (Shalekhet) at the Jewish Museum Berlin');
  });

  it('walks on by itself only when motion is allowed', () => {
    window.history.replaceState(null, '', '/#walk');
    const { unmount } = render(<LayAStone />);
    expect(screen.getByRole('button', { name: 'Walk on slowly' })).toBeInTheDocument();
    unmount();
    reducedMotion(true);
    render(<LayAStone />);
    expect(screen.queryByRole('button', { name: 'Walk on slowly' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Take a step' })).toBeEnabled();
  });

  it('is the third tab, with its own address', () => {
    render(<LayAStone />);
    fireEvent.keyDown(screen.getByRole('tab', { name: 'Lay a stone' }), { key: 'End' });
    expect(screen.getByRole('tab', { name: 'The walk' })).toHaveAttribute('aria-selected', 'true');
    expect(window.location.hash).toBe('#walk');
  });
});
