import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import NeverForget from '@/app/exhibitions/holocaust/stones/NeverForget';
import Countdown, { isRemembranceDay, nextRemembrance } from '@/app/exhibitions/holocaust/stones/Countdown';
import { AUTO_MS, STEP_MS, WALK_BEGIN, WALK_CLOSE, WALK_INTRO, walkSourceGroups, wordsForStep } from '@/app/exhibitions/holocaust/stones/Walk';
import { AMBIENTS, PLACEHOLDERS, WALK_LINES, ambientSrc, slotFiles, slotNumber } from '@/app/exhibitions/holocaust/stones/walkLines';
import { WALK_BEATS, WALK_NAMES, beatForStep } from '@/app/exhibitions/holocaust/stones/walkNames';
import { SILHOUETTE_KINDS } from '@/app/exhibitions/holocaust/stones/WalkPicture';
import { walkSlotsOnDisk } from '@/app/exhibitions/holocaust/stones/walkSlots';
import { LIBERATION_LINE } from '@/app/exhibitions/holocaust/holocaust';

/*
 * Never Forget's countdown to January 27 and its walk: the date sums, the
 * day's own line, and the walk (a candle lit first, then slowly, a step at
 * a time, full screen: the history a line and a picture a step, children's
 * names between some steps, each source in the Sources drawer, never
 * inline; no blank step; a quiet close with the candle still lit; the sound
 * off until chosen; no walking on, drift or fades under reduced motion).
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

describe('the walk', () => {
  afterEach(() => {
    jest.useRealTimers();
    reducedMotion(false);
  });

  const begin = (props: Parameters<typeof NeverForget>[0] = {}) => {
    window.history.replaceState(null, '', '/#walk');
    render(<NeverForget {...props} />);
    const panel = screen.getByRole('tabpanel', { name: 'The walk' });
    expect(panel).toHaveTextContent(WALK_INTRO);
    fireEvent.click(screen.getByRole('button', { name: 'Light a candle' }));
    return screen.getByRole('dialog', { name: 'The walk' });
  };
  const status = (walk: HTMLElement) => walk.querySelector(':scope > [role="status"]')!.textContent;

  it('begins with a candle: lit, the walk is taken full screen, and left with Escape or its button; the candle stays lit', () => {
    const walk = begin();
    expect(walk).toHaveClass('hos-walk-full');
    expect(walk.parentElement).toBe(document.body);
    expect(walk.querySelector('.hos-candle-corner.is-lit')).toBeInTheDocument();
    expect(walk).toHaveTextContent(WALK_BEGIN);
    fireEvent.keyDown(walk, { key: 'Escape' });
    expect(screen.queryByRole('dialog', { name: 'The walk' })).toBeNull();
    // Lit once, it stays lit: the way back in is to return to the walk.
    expect(screen.queryByRole('button', { name: 'Light a candle' })).toBeNull();
    expect(document.querySelector('.hos-candle-panel.is-lit')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Return to the walk' }));
    fireEvent.click(screen.getByRole('button', { name: 'Leave the walk' }));
    expect(screen.queryByRole('dialog', { name: 'The walk' })).toBeNull();
  });

  it('has no stones behind it in the room: the first picture, dim, or the dark', () => {
    window.history.replaceState(null, '', '/#walk');
    const { unmount } = render(<NeverForget pictures={{ [WALK_LINES[0].slot]: 'walk-01.webp' }} />);
    expect(document.querySelector('.hos-walk-backdrop canvas')).toBeNull();
    expect(document.querySelector('.hos-walk-backdrop img')).toHaveAttribute('src', '/exhibitions/holocaust/walk/walk-01.webp');
    unmount();
    window.history.replaceState(null, '', '/#walk');
    render(<NeverForget />);
    expect(document.querySelector('.hos-walk-backdrop')).toBeInTheDocument();
    expect(document.querySelector('.hos-walk-backdrop img')).toBeNull();
  });

  it('walks slowly, a step at a time, start to finish: every line with its picture, in order, the names between, no blank step, then a quiet close with the candle still lit', () => {
    jest.useFakeTimers();
    const all = Object.fromEntries(WALK_LINES.map((l) => [l.slot, `walk-${String(slotNumber(l.slot)).padStart(2, '0')}.webp`]));
    const walk = begin({ pictures: all });
    const stepButton = () => within(walk).getByRole('button', { name: 'Take a step' });
    fireEvent.click(stepButton());
    expect(status(walk)).toBe(WALK_LINES[0].text);
    // A step cannot be hurried: a second press while it fades in does nothing.
    fireEvent.click(stepButton());
    expect(walk.querySelector('[data-line]')).toHaveAttribute('data-step', '1');
    const next = () => {
      act(() => { jest.advanceTimersByTime(STEP_MS + 10); });
      fireEvent.click(stepButton());
    };
    const seen: string[] = [];
    WALK_BEATS.forEach((beat, i) => {
      if (i > 0) next();
      expect(walk.querySelector('.hos-candle-corner.is-lit')).toBeInTheDocument();
      if (beat.kind === 'line') {
        const { line } = beat;
        seen.push(line.id);
        expect(status(walk)).toBe(line.text);
        const words = walk.querySelector(`[data-line="${line.id}"]`)!;
        expect(words).toHaveTextContent(line.text);
        expect(words).toHaveAttribute('data-step', String(i + 1));
        // Its sources are in the drawer, not under the line.
        expect(within(words as HTMLElement).queryByRole('link')).toBeNull();
        // Its picture fills the screen.
        expect(within(walk).getByRole('img', { name: line.image })).toHaveAttribute('src', `/exhibitions/holocaust/walk/${all[line.slot]}`);
        expect(walk.querySelector('[data-name]')).toBeNull();
      } else {
        seen.push(beat.name.id);
        const text = `${beat.name.name}, ${beat.name.age}`;
        expect(status(walk)).toBe(text);
        // A name alone on black: no picture, no line.
        const name = walk.querySelector(`[data-name="${beat.name.id}"]`)!;
        expect(name.textContent).toBe(text);
        expect(walk.querySelector('[data-line]')).toBeNull();
        expect(walk.querySelector('.hos-walk-layer.is-current img')).toBeNull();
      }
    });
    expect(seen).toHaveLength(WALK_LINES.length + WALK_NAMES.length);
    // Past the last line, the walk closes quietly; the candle stays lit; there is no further step.
    next();
    expect(status(walk)).toBe(WALK_CLOSE);
    expect(walk).toHaveTextContent(WALK_CLOSE);
    expect(walk.querySelector('.hos-candle-corner.is-lit')).toBeInTheDocument();
    expect(within(walk).queryByRole('button', { name: 'Take a step' })).toBeNull();
    expect(within(walk).queryByRole('button', { name: 'Walk on slowly' })).toBeNull();
    // It may be walked again, from the beginning, the candle still lit.
    fireEvent.click(within(walk).getByRole('button', { name: 'Walk again' }));
    expect(walk).toHaveTextContent(WALK_BEGIN);
    expect(within(walk).getByRole('button', { name: 'Take a step' })).toBeEnabled();
  });

  it('fades each step in over the one before; with reduced motion, one picture at a time, no fade', () => {
    jest.useFakeTimers();
    const walk = begin();
    const stepButton = within(walk).getByRole('button', { name: 'Take a step' });
    fireEvent.click(stepButton);
    act(() => { jest.advanceTimersByTime(STEP_MS + 10); });
    fireEvent.click(stepButton);
    expect(walk.querySelectorAll('.hos-walk-layer')).toHaveLength(2);
    expect(walk.querySelector('.hos-walk-layer.is-before')).toHaveAttribute('aria-hidden', 'true');
    expect(walk.querySelector(`.hos-walk-layer.is-current [data-slot="${WALK_LINES[1].slot}"]`)).toBeInTheDocument();
    cleanup();
    jest.useRealTimers();
    reducedMotion(true);
    const still = begin();
    fireEvent.click(within(still).getByRole('button', { name: 'Take a step' }));
    expect(still.querySelectorAll('.hos-walk-layer')).toHaveLength(1);
  });

  it('lists every line’s and every name’s source, by step, in the walk’s Sources drawer; no credit to Fallen Leaves, now the walk walks over nothing', () => {
    const walk = begin();
    expect(within(walk).queryByRole('link')).toBeNull();
    fireEvent.click(within(walk).getByRole('button', { name: 'Sources and credits' }));
    const drawer = within(walk).getByRole('dialog', { name: 'Sources and credits' });
    expect(within(drawer).queryByRole('link', { name: /Fallen Leaves/ })).toBeNull();
    WALK_BEATS.forEach((beat, i) => {
      const group = within(drawer).getByRole('heading', { name: `The walk, step ${i + 1}` }).closest('section')!;
      const sources = beat.kind === 'line' ? beat.line.sources : [beat.name.source];
      for (const s of sources) expect(within(group).getByRole('link', { name: s.label })).toHaveAttribute('href', s.href);
      if (beat.kind === 'name') expect(group).toHaveTextContent(`${beat.name.name}, ${beat.name.age}`);
    });
    expect(walkSourceGroups()).toHaveLength(WALK_BEATS.length);
    // Escape closes the drawer, and leaves the walk open.
    fireEvent.keyDown(drawer, { key: 'Escape' });
    expect(within(walk).queryByRole('dialog', { name: 'Sources and credits' })).toBeNull();
    expect(screen.getByRole('dialog', { name: 'The walk' })).toBeInTheDocument();
  });

  it('stands in with a placeholder where a picture is not yet in its slot', () => {
    const walk = begin();
    fireEvent.click(within(walk).getByRole('button', { name: 'Take a step' }));
    expect(wordsForStep(1)).toEqual({ kind: 'line', line: WALK_LINES[0] });
    const picture = walk.querySelector(`[data-slot="${WALK_LINES[0].slot}"]`)!;
    expect(picture).toHaveAttribute('data-placeholder', WALK_LINES[0].placeholder);
    expect(picture).toHaveTextContent('Picture to come');
  });

  it('keeps the sound off until the visitor turns it on', () => {
    const walk = begin();
    const sound = within(walk).getByRole('button', { name: /Sound: off/ });
    expect(sound).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(sound);
    // jsdom has no Web Audio: it says so, and stays off.
    expect(sound).toHaveAttribute('aria-pressed', 'false');
    expect(status(walk)).toBe('Sound is not available in this browser.');
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

describe('the names on the walk', () => {
  it('are real children, each with their own record at the USHMM or the HMD Trust: name and age only', () => {
    expect(WALK_NAMES.length).toBeGreaterThanOrEqual(6);
    expect(WALK_NAMES.length).toBeLessThanOrEqual(8);
    expect(new Set(WALK_NAMES.map((n) => n.source.href)).size).toBe(WALK_NAMES.length);
    for (const n of WALK_NAMES) {
      expect(n.source.href).toMatch(/^https:\/\/(encyclopedia\.ushmm\.org\/content\/en\/id-card\/|collections\.ushmm\.org\/search\/catalog\/|(www\.)?hmd\.org\.uk\/resource\/)/);
      expect(n.age).toMatch(/^\d{1,2}$/);
      expect(Number(n.age)).toBeLessThan(18);
    }
    expect(WALK_NAMES.map((n) => `${n.name}, ${n.age}`)).toEqual([
      'Henoch Kornfeld, 3',
      'Tomas Kulka, 7',
      'Hana Brady, 13',
      'Zigmond Adler, 7',
      'Judith Schwed, 12',
      'Settela Steinbach, 9',
      'Anne Frank, 15',
    ]);
  });

  it('come in their place in the history: never before the ghettos, never two together, never first or last', () => {
    const ids = WALK_LINES.map((l) => l.id);
    for (const n of WALK_NAMES) expect(ids.indexOf(n.after)).toBeGreaterThanOrEqual(ids.indexOf('W11'));
    WALK_BEATS.forEach((b, i) => {
      if (b.kind === 'name') expect(WALK_BEATS[i - 1].kind).toBe('line');
    });
    expect(WALK_BEATS[0].kind).toBe('line');
    expect(WALK_BEATS[WALK_BEATS.length - 1].kind).toBe('line');
    // Every line, in order, once.
    expect(WALK_BEATS.flatMap((b) => (b.kind === 'line' ? [b.line.id] : []))).toEqual(ids);
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

  it('finds the owner’s files when the page is built, under the slot’s name or its number: all 32 pictures are in, the sounds not yet', () => {
    const onDisk = walkSlotsOnDisk();
    expect(Object.keys(onDisk.pictures)).toHaveLength(32);
    expect(onDisk.pictures['w07-broken-window']).toBe('walk-07.webp');
    expect(onDisk.ambients).toEqual([]);
    expect(slotFiles('w07-broken-window')).toEqual(['w07-broken-window.webp', 'w07-broken-window.jpg', 'walk-07.jpg', 'walk-07.webp', 'walk-07.png']);
    expect(AMBIENTS.map(ambientSrc)).toEqual([
      '/exhibitions/holocaust/walk/sound/ambient-before.mp3',
      '/exhibitions/holocaust/walk/sound/ambient-during.mp3',
      '/exhibitions/holocaust/walk/sound/ambient-after.mp3',
    ]);
    expect(beatForStep(0)).toBeNull();
    expect(beatForStep(1)).toEqual({ kind: 'line', line: WALK_LINES[0] });
    expect(beatForStep(WALK_BEATS.length)).toEqual({ kind: 'line', line: WALK_LINES[31] });
    expect(beatForStep(WALK_BEATS.length + 1)).toBeNull();
    expect(wordsForStep(0)).toEqual({ kind: 'none' });
    expect(wordsForStep(WALK_BEATS.length + 1)).toEqual({ kind: 'end' });
  });
});
