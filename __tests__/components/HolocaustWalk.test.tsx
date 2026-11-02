import { act, fireEvent, render, screen, within } from '@testing-library/react';
import NeverForget from '@/app/exhibitions/holocaust/stones/NeverForget';
import Countdown, { isRemembranceDay, nextRemembrance } from '@/app/exhibitions/holocaust/stones/Countdown';
import { AUTO_MS, GAP_MS, HESITATE_MS, KADISHMAN_URL, LINE_AFTER, STEP_MS, nextGap, wordsForStep } from '@/app/exhibitions/holocaust/stones/Walk';
import { CLANK_FILE, RATTLE_SRC, WALK_LINES, lineForStep } from '@/app/exhibitions/holocaust/stones/walkLines';
import { MOTIFS } from '@/app/exhibitions/holocaust/stones/WalkPicture';
import { walkSlotsOnDisk } from '@/app/exhibitions/holocaust/stones/walkSlots';
import { ACROSS, HALF_WIDTH, fog, project, makeView, rowStones, rowsInView } from '@/app/exhibitions/holocaust/stones/walkScene';
import { LIBERATION_LINE, REMEMBRANCE_LINE } from '@/app/exhibitions/holocaust/holocaust';

/*
 * Never Forget's countdown to January 27 and its walk: the date sums, the
 * day's own line, the path's geometry, and walking it (full screen; begun
 * by the visitor and walking on by itself at a slow, uneven pace, a line
 * every few steps; the poster's line first, then the history in order,
 * each with its source and its picture slot; the clanks starting with the
 * walk and turned off by a button; a step at a time, by button, under
 * reduced motion; the credit to the Jewish Museum Berlin).
 */

beforeAll(() => {
  jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
});
beforeEach(() => {
  localStorage.clear();
  window.history.replaceState(null, '', '/');
  global.fetch = jest.fn(async () => ({ ok: false, status: 503, json: async () => ({}) }) as Response) as unknown as typeof fetch;
});

/** Just enough of Web Audio for the walk to make its sound against. */
class FakeAudioContext {
  state = 'running';
  currentTime = 0;
  sampleRate = 44100;
  destination = {};
  closed = false;
  private node() {
    const param = () => ({ value: 0, setValueAtTime() {}, exponentialRampToValueAtTime() {} });
    return { connect: (n: unknown) => n, gain: param(), delayTime: param(), frequency: param(), Q: param(), pan: param(), playbackRate: param(), type: '', buffer: null, start() {}, stop() {} };
  }
  createGain() { return this.node(); }
  createDelay() { return this.node(); }
  createBiquadFilter() { return this.node(); }
  createOscillator() { return this.node(); }
  createBufferSource() { return this.node(); }
  createStereoPanner() { return this.node(); }
  createBuffer(_channels: number, length: number) { return { getChannelData: () => new Float32Array(length) }; }
  decodeAudioData() { return Promise.resolve({}); }
  resume() { return Promise.resolve(); }
  close() {
    this.closed = true;
    return Promise.resolve();
  }
}

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

  it('with reduced motion, goes a step at a time: the poster’s line at step 3, then the history a line a step, in order, each with its source', () => {
    jest.useFakeTimers();
    reducedMotion(true);
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
    reducedMotion(true);
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

  it('starts the sound with the walk, from the visitor’s press, and a button turns it off', () => {
    const made: FakeAudioContext[] = [];
    (window as unknown as { AudioContext: unknown }).AudioContext = class extends FakeAudioContext {
      constructor() {
        super();
        made.push(this);
      }
    };
    try {
      const walk = begin();
      const sound = within(walk).getByRole('button', { name: /Sound: on/ });
      expect(sound).toHaveAttribute('aria-pressed', 'true');
      expect(made).toHaveLength(1);
      fireEvent.click(sound);
      expect(sound).toHaveAttribute('aria-pressed', 'false');
      expect(made[0].closed).toBe(true);
      expect(walk.querySelector('[role="status"]')).toHaveTextContent('Sound off.');
      // Turned off, it stays off when the walk is left and begun again.
      fireEvent.click(within(walk).getByRole('button', { name: 'Leave the walk' }));
      fireEvent.click(screen.getByRole('button', { name: 'Begin the walk' }));
      expect(within(screen.getByRole('dialog', { name: 'The walk' })).getByRole('button', { name: /Sound: off/ })).toBeInTheDocument();
      expect(made).toHaveLength(1);
    } finally {
      delete (window as unknown as { AudioContext?: unknown }).AudioContext;
    }
  });

  it('makes each step of the owner’s clanks once they are in place', () => {
    (window as unknown as { AudioContext: unknown }).AudioContext = FakeAudioContext;
    try {
      window.history.replaceState(null, '', '/#walk');
      render(<NeverForget sounds={{ clanks: ['/exhibitions/holocaust/walk/sound/clank-01.mp3'], rattle: RATTLE_SRC }} />);
      fireEvent.click(screen.getByRole('button', { name: 'Begin the walk' }));
      expect(global.fetch).toHaveBeenCalledWith('/exhibitions/holocaust/walk/sound/clank-01.mp3');
      expect(global.fetch).toHaveBeenCalledWith(RATTLE_SRC);
    } finally {
      delete (window as unknown as { AudioContext?: unknown }).AudioContext;
    }
  });

  it('without Web Audio, says so when the sound is asked for', () => {
    const walk = begin();
    const sound = within(walk).getByRole('button', { name: /Sound: off/ });
    fireEvent.click(sound);
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

  it('walks on by itself once begun, slowly enough to read, until it is paused', () => {
    expect(AUTO_MS).toBeGreaterThanOrEqual(6000);
    jest.useFakeTimers();
    // An even pace for the test: a footfall every GAP_MS midpoint, no hesitations.
    const random = jest.spyOn(Math, 'random').mockReturnValue(0.5);
    const gap = (GAP_MS[0] + GAP_MS[1]) / 2;
    const walk = begin();
    const say = () => walk.querySelector('[role="status"]')!.textContent;
    expect(say()).toBe('The walk, full screen. You walk on, slowly. Press Escape to leave it.');
    expect(within(walk).queryByRole('button', { name: 'Take a step' })).toBeNull();
    // No press: footfalls at once, and the first line on the first footfall after AUTO_MS.
    act(() => { jest.advanceTimersByTime(AUTO_MS - 10); });
    expect(say()).toBe('The walk, full screen. You walk on, slowly. Press Escape to leave it.');
    act(() => { jest.advanceTimersByTime(HESITATE_MS[1] + 20); });
    expect(say()).toBe('You step forward, onto the stones.');
    fireEvent.click(within(walk).getByRole('button', { name: 'Pause' }));
    expect(say()).toBe('You stop.');
    act(() => { jest.advanceTimersByTime(AUTO_MS * 3); });
    expect(say()).toBe('You stop.');
    fireEvent.click(within(walk).getByRole('button', { name: 'Walk on' }));
    // Walking on again: step 2 soon (no words), then the poster's line at step 3, a line's length later.
    act(() => { jest.advanceTimersByTime(AUTO_MS / 2 + gap + AUTO_MS + gap); });
    expect(within(walk).getByRole('button', { name: 'Pause' })).toBeInTheDocument();
    expect(say()).toBe(REMEMBRANCE_LINE);
    random.mockRestore();
  });

  it('steps at a slow, uneven pace, each footfall over before the next', () => {
    expect(nextGap(0.99, 0)).toBe(GAP_MS[0]);
    expect(nextGap(0.99, 1)).toBe(GAP_MS[1]);
    expect(nextGap(0, 1)).toBe(HESITATE_MS[1]);
    expect(GAP_MS[0]).toBeGreaterThan(STEP_MS);
    expect(HESITATE_MS[0]).toBeGreaterThan(GAP_MS[1]);
  });

  it('does not walk on by itself under reduced motion', () => {
    jest.useFakeTimers();
    reducedMotion(true);
    const still = begin();
    expect(still).toHaveClass('is-still');
    expect(within(still).queryByRole('button', { name: 'Pause' })).toBeNull();
    expect(within(still).getByRole('button', { name: 'Take a step' })).toBeEnabled();
    act(() => { jest.advanceTimersByTime(AUTO_MS * 3); });
    expect(still.querySelector('[role="status"]')).toHaveTextContent('Take a step when you are ready.');
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

  it('finds the owner’s files when the page is built: her clanks and the rattle, and no pictures yet', () => {
    const { pictures, sounds } = walkSlotsOnDisk();
    expect(pictures).toEqual([]);
    expect(sounds.clanks).toEqual(Array.from({ length: 14 }, (_, i) => `/exhibitions/holocaust/walk/sound/clank-${String(i + 1).padStart(2, '0')}.mp3`));
    expect(sounds.clanks.every((c) => CLANK_FILE.test(c.split('/').pop()!))).toBe(true);
    expect(sounds.rattle).toBe(RATTLE_SRC);
    expect(RATTLE_SRC).toBe('/exhibitions/holocaust/walk/sound/rattle.mp3');
    expect(lineForStep(LINE_AFTER, LINE_AFTER)).toBeNull();
    expect(lineForStep(LINE_AFTER + 32, LINE_AFTER)).toBe(WALK_LINES[31]);
    expect(lineForStep(LINE_AFTER + 33, LINE_AFTER)).toBeNull();
  });
});
