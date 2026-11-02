import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import NeverForget from '@/app/exhibitions/holocaust/stones/NeverForget';
import Countdown, { isRemembranceDay, nextRemembrance } from '@/app/exhibitions/holocaust/stones/Countdown';
import { AUTO_MS, CANDLE, GAP_MS, HESITATE_CHANCE, HESITATE_MS, STEP_MS, WALK_BEGIN, WALK_BEGIN_STILL, WALK_CLOSE, WALK_INSPIRATION, WALK_INSPIRED_BY, WALK_INTRO, WALK_SOUND, nextGap, walkSourceGroups, wordsForStep } from '@/app/exhibitions/holocaust/stones/Walk';
import { EYE, STEP, easeStep, hash2, lightAt, makeView, project, rowPieces, rowsInView, type IronShoe } from '@/app/exhibitions/holocaust/stones/walkScene';
import { PLATE, hitsForStep } from '@/app/exhibitions/holocaust/stones/footsteps';
import { RATTLE_CHANCE } from '@/app/exhibitions/holocaust/stones/metal';
import fs from 'node:fs';
import path from 'node:path';
import { PLACEHOLDERS, WALK_LINES, slotFiles, slotNumber } from '@/app/exhibitions/holocaust/stones/walkLines';
import { WALK_BEATS, WALK_NAMES, beatForStep } from '@/app/exhibitions/holocaust/stones/walkNames';
import { SILHOUETTE_KINDS } from '@/app/exhibitions/holocaust/stones/WalkPicture';
import { walkSlotsOnDisk } from '@/app/exhibitions/holocaust/stones/walkSlots';
import { LIBERATION_LINE } from '@/app/exhibitions/holocaust/holocaust';

/*
 * Never Forget's countdown to January 27 and its walk: the date sums, the
 * day's own line, and the walk (a candle lit first, then slowly, a step at
 * a time, full screen: the history a line and a picture a step, children's
 * names between some steps, each source in the Sources drawer, never
 * inline; no blank step; a quiet close with the candle still lit; begun,
 * it walks on by itself at an uneven pace, its sound starting with it and
 * staying off once turned off; nothing heard but the metal; under reduced
 * motion, no walking on, drift or fades, a step at a time).
 */

beforeAll(() => {
  jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
});
beforeEach(() => {
  localStorage.clear();
  window.history.replaceState(null, '', '/');
  global.fetch = jest.fn(async () => ({ ok: false, status: 503, json: async () => ({}) }) as Response) as unknown as typeof fetch;
});

/** A stand-in for Web Audio, so the walk's sound can be turned on in jsdom: every node connects, every value can be set. */
function fakeAudio() {
  const param = () => ({ value: 0, setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {}, linearRampToValueAtTime: () => {} });
  const node = (): Record<string, unknown> => {
    const n: Record<string, unknown> = { gain: param(), frequency: param(), Q: param(), pan: param(), delayTime: param(), playbackRate: param(), buffer: null, type: '' };
    n.connect = (to: unknown) => to;
    n.start = () => {};
    n.stop = () => {};
    return n;
  };
  class FakeContext {
    state = 'running';
    currentTime = 0;
    sampleRate = 44100;
    destination = node();
    createGain = node;
    createDelay = node;
    createBiquadFilter = node;
    createStereoPanner = node;
    createBufferSource = node;
    createOscillator = node;
    createBuffer = (_c: number, length: number) => ({ getChannelData: () => new Float32Array(length) });
    decodeAudioData = async () => ({});
    resume = async () => {};
    close = async () => {};
  }
  (window as unknown as { AudioContext: unknown }).AudioContext = FakeContext;
  return () => {
    delete (window as unknown as { AudioContext?: unknown }).AudioContext;
  };
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
    expect(walk.querySelector('.hos-walk-candle.is-lit')).toBeInTheDocument();
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

  it('with reduced motion, is taken a step at a time, start to finish: every line with its picture, in order, the names between, no blank step, then a quiet close with the candle still lit', () => {
    jest.useFakeTimers();
    reducedMotion(true);
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
      expect(walk.querySelector('.hos-walk-candle.is-lit')).toBeInTheDocument();
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
    expect(walk.querySelector('.hos-walk-candle.is-lit')).toBeInTheDocument();
    expect(within(walk).queryByRole('button', { name: 'Take a step' })).toBeNull();
    expect(within(walk).queryByRole('button', { name: 'Walk on' })).toBeNull();
    // It may be walked again, from the beginning, the candle still lit.
    fireEvent.click(within(walk).getByRole('button', { name: 'Walk again' }));
    expect(walk).toHaveTextContent(WALK_BEGIN_STILL);
    expect(within(walk).getByRole('button', { name: 'Take a step' })).toBeEnabled();
  });

  it('fades each line in over the one before; with reduced motion, one picture at a time, no fade', () => {
    jest.useFakeTimers();
    const walk = begin();
    act(() => { jest.advanceTimersByTime(2 * (AUTO_MS + HESITATE_MS[1]) + 100); });
    expect(walk.querySelectorAll('.hos-walk-layer')).toHaveLength(2);
    expect(walk.querySelector('.hos-walk-layer.is-before')).toHaveAttribute('aria-hidden', 'true');
    expect(walk.querySelector('.hos-walk-layer.is-current')).toBeInTheDocument();
    cleanup();
    jest.useRealTimers();
    reducedMotion(true);
    const still = begin();
    fireEvent.click(within(still).getByRole('button', { name: 'Take a step' }));
    expect(still.querySelectorAll('.hos-walk-layer')).toHaveLength(1);
  });

  it('lists every line’s and every name’s source, by step, in the walk’s Sources drawer, the two works it is inspired by, and the recordings its steps are cut from', () => {
    const walk = begin();
    expect(within(walk).queryByRole('link')).toBeNull();
    fireEvent.click(within(walk).getByRole('button', { name: 'Sources and credits' }));
    const drawer = within(walk).getByRole('dialog', { name: 'Sources and credits' });
    const inspired = within(drawer).getByRole('heading', { name: WALK_INSPIRED_BY }).closest('section')!;
    const [kadishman, danube] = within(inspired).getAllByRole('link');
    expect(kadishman).toHaveTextContent('Menashe Kadishman, Fallen Leaves (Shalekhet), Jewish Museum Berlin');
    expect(kadishman).toHaveAttribute('href', 'https://www.jmberlin.de/en/shalekhet-fallen-leaves');
    expect(danube).toHaveTextContent('Can Togay and Gyula Pauer, Shoes on the Danube Bank, Budapest');
    expect(danube).toHaveAttribute('href', WALK_INSPIRATION[1].href);
    // No credit for the candle: it is the owner's own.
    expect(within(inspired).getAllByRole('link')).toHaveLength(2);
    expect(drawer).not.toHaveTextContent(/Leonardo/i);
    WALK_BEATS.forEach((beat, i) => {
      const group = within(drawer).getByRole('heading', { name: `The walk, step ${i + 1}` }).closest('section')!;
      const sources = beat.kind === 'line' ? beat.line.sources : [beat.name.source];
      for (const s of sources) expect(within(group).getByRole('link', { name: s.label })).toHaveAttribute('href', s.href);
      if (beat.kind === 'name') expect(group).toHaveTextContent(`${beat.name.name}, ${beat.name.age}`);
    });
    const sounds = within(drawer).getByRole('heading', { name: 'The walk’s sounds' }).closest('section')!;
    expect(within(sounds).getAllByRole('link').map((a) => a.getAttribute('href'))).toEqual(['https://freesound.org/s/365411/', 'https://freesound.org/s/697754/']);
    expect(walkSourceGroups()).toHaveLength(WALK_BEATS.length + 2);
    // Escape closes the drawer, and leaves the walk open.
    fireEvent.keyDown(drawer, { key: 'Escape' });
    expect(within(walk).queryByRole('dialog', { name: 'Sources and credits' })).toBeNull();
    expect(screen.getByRole('dialog', { name: 'The walk' })).toBeInTheDocument();
  });

  it('stands in with a placeholder where a picture is not yet in its slot', () => {
    reducedMotion(true);
    const walk = begin();
    fireEvent.click(within(walk).getByRole('button', { name: 'Take a step' }));
    expect(wordsForStep(1)).toEqual({ kind: 'line', line: WALK_LINES[0] });
    const picture = walk.querySelector(`[data-slot="${WALK_LINES[0].slot}"]`)!;
    expect(picture).toHaveAttribute('data-placeholder', WALK_LINES[0].placeholder);
    expect(picture).toHaveTextContent('Picture to come');
  });

  it('starts its sound with the walk, from the visitor’s own press; turned off, it stays off when they come back', () => {
    const restore = fakeAudio();
    try {
      let walk = begin();
      let sound = within(walk).getByRole('button', { name: WALK_SOUND });
      expect(sound).toHaveAttribute('aria-pressed', 'true');
      fireEvent.click(sound);
      expect(sound).toHaveAttribute('aria-pressed', 'false');
      expect(status(walk)).toBe('Sound off.');
      fireEvent.click(within(walk).getByRole('button', { name: 'Leave the walk' }));
      fireEvent.click(screen.getByRole('button', { name: 'Return to the walk' }));
      walk = screen.getByRole('dialog', { name: 'The walk' });
      sound = within(walk).getByRole('button', { name: WALK_SOUND });
      expect(sound).toHaveAttribute('aria-pressed', 'false');
      fireEvent.click(sound);
      expect(sound).toHaveAttribute('aria-pressed', 'true');
    } finally {
      restore();
    }
  });

  it('says so, and stays quiet, where the browser has no sound', () => {
    const walk = begin();
    const sound = within(walk).getByRole('button', { name: WALK_SOUND });
    expect(sound).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(sound);
    expect(sound).toHaveAttribute('aria-pressed', 'false');
    expect(status(walk)).toBe('Sound is not available in this browser.');
  });

  it('is heard as nothing but the metal: no recording plays under the steps', () => {
    const restore = fakeAudio();
    const audio = jest.fn();
    const before = window.Audio;
    window.Audio = audio as unknown as typeof Audio;
    jest.useFakeTimers();
    try {
      begin({ sounds: { clanks: ['/exhibitions/holocaust/walk/sound/clank-01.mp3'], rattle: '/exhibitions/holocaust/walk/sound/rattle.mp3' } });
      act(() => { jest.advanceTimersByTime(3 * AUTO_MS); });
      expect(audio).not.toHaveBeenCalled();
    } finally {
      window.Audio = before;
      restore();
    }
  });

  it('walks on by itself once begun, at an uneven pace, a new line about every six and a half seconds; Pause and Walk on, never a step button', () => {
    jest.useFakeTimers();
    const walk = begin();
    expect(within(walk).queryByRole('button', { name: 'Take a step' })).toBeNull();
    expect(walk).toHaveTextContent(WALK_BEGIN);
    // Footfalls, but no line until a while in.
    act(() => { jest.advanceTimersByTime(AUTO_MS - 100); });
    expect(walk.querySelector('[data-line]')).toBeNull();
    act(() => { jest.advanceTimersByTime(HESITATE_MS[1] + 200); });
    expect(walk.querySelector('[data-line]')).toHaveAttribute('data-step', '1');
    expect(status(walk)).toBe(WALK_LINES[0].text);
    // Paused, it waits.
    fireEvent.click(within(walk).getByRole('button', { name: 'Pause' }));
    expect(status(walk)).toBe('You pause.');
    act(() => { jest.advanceTimersByTime(4 * AUTO_MS); });
    expect(walk.querySelector('[data-line]')).toHaveAttribute('data-step', '1');
    fireEvent.click(within(walk).getByRole('button', { name: 'Walk on' }));
    act(() => { jest.advanceTimersByTime(AUTO_MS + HESITATE_MS[1]); });
    expect(walk.querySelector('[data-line]')).toHaveAttribute('data-step', '2');
  });

  it('steps unevenly: 1.15 to 1.75 seconds a footfall, and about one in seven a longer pause of 2.4 to 3.4', () => {
    expect(AUTO_MS).toBe(6500);
    expect(GAP_MS).toEqual([1150, 1750]);
    expect(HESITATE_MS).toEqual([2400, 3400]);
    expect(HESITATE_CHANCE).toBeCloseTo(1 / 7);
    expect(nextGap(0.5, 0)).toBe(1150);
    expect(nextGap(0.5, 1)).toBe(1750);
    expect(nextGap(0.1, 0)).toBe(2400);
    expect(nextGap(0.1, 1)).toBe(3400);
  });

  it('walks on by itself only when motion is allowed', () => {
    const walk = begin();
    expect(within(walk).getByRole('button', { name: 'Pause' })).toBeInTheDocument();
    cleanup();
    reducedMotion(true);
    const still = begin();
    expect(still).toHaveClass('is-still');
    expect(still).toHaveTextContent(WALK_BEGIN_STILL);
    expect(within(still).queryByRole('button', { name: 'Pause' })).toBeNull();
    expect(within(still).queryByRole('button', { name: 'Walk on' })).toBeNull();
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

  it('finds the owner’s files when the page is built, under the slot’s name or its number: all 32 pictures, the 14 clanks and the rattle', () => {
    const onDisk = walkSlotsOnDisk();
    expect(Object.keys(onDisk.pictures)).toHaveLength(32);
    expect(onDisk.pictures['w07-broken-window']).toBe('walk-07.webp');
    expect(onDisk).not.toHaveProperty('ambients');
    expect(onDisk.sounds.clanks).toHaveLength(14);
    expect(onDisk.sounds.clanks[0]).toBe('/exhibitions/holocaust/walk/sound/clank-01.mp3');
    expect(onDisk.sounds.rattle).toBe('/exhibitions/holocaust/walk/sound/rattle.mp3');
    expect(slotFiles('w07-broken-window')).toEqual(['w07-broken-window.webp', 'w07-broken-window.jpg', 'walk-07.jpg', 'walk-07.webp', 'walk-07.png']);
    expect(beatForStep(0)).toBeNull();
    expect(beatForStep(1)).toEqual({ kind: 'line', line: WALK_LINES[0] });
    expect(beatForStep(WALK_BEATS.length)).toEqual({ kind: 'line', line: WALK_LINES[31] });
    expect(beatForStep(WALK_BEATS.length + 1)).toBeNull();
    expect(wordsForStep(0)).toEqual({ kind: 'none' });
    expect(wordsForStep(WALK_BEATS.length + 1)).toEqual({ kind: 'end' });
  });
});

describe('the walk’s hall: the iron floor, the candle, the sound', () => {
  afterEach(() => reducedMotion(false));

  const light = () => {
    window.history.replaceState(null, '', '/#walk');
    render(<NeverForget />);
    fireEvent.click(screen.getByRole('button', { name: 'Light a candle' }));
    return screen.getByRole('dialog', { name: 'The walk' });
  };

  it('carries the owner’s candle in front, her film of it; its still under reduced motion; never the drawn candle', () => {
    const walk = light();
    const video = walk.querySelector('.hos-walk-candle video')!;
    expect(video).toHaveAttribute('poster', CANDLE.still);
    expect(video).toHaveAttribute('loop');
    expect((video as HTMLVideoElement).muted).toBe(true);
    expect(Array.from(video.querySelectorAll('source')).map((s) => s.getAttribute('src'))).toEqual([CANDLE.webm, CANDLE.mp4]);
    expect(walk.querySelector('canvas.hos-walk-floor')).toBeInTheDocument();
    expect(document.querySelector('svg.hos-candle')).toBeNull();
    for (const f of [CANDLE.mp4, CANDLE.webm, CANDLE.still]) expect(fs.existsSync(path.join(process.cwd(), 'public', f))).toBe(true);
    cleanup();
    reducedMotion(true);
    const still = light();
    expect(still.querySelector('.hos-walk-candle video')).toBeNull();
    expect(still.querySelector('.hos-walk-candle img')).toHaveAttribute('src', CANDLE.still);
  });

  it('lays the floor with iron faces, each with two eyes and a mouth cut through, and pairs of iron shoes, men’s, women’s and children’s: the same each time', () => {
    const rows = Array.from({ length: 200 }, (_, r) => rowPieces(r));
    expect(rowPieces(17)).toEqual(rows[17]);
    const all = rows.flat();
    const faces = all.flatMap((p) => (p.kind === 'face' ? [p] : []));
    const shoes = all.filter((p): p is IronShoe => p.kind === 'shoe');
    expect(faces.length).toBeGreaterThan(shoes.length * 3);
    expect(shoes.length).toBeGreaterThan(50);
    for (const f of faces) {
      expect(f.holes).toHaveLength(3);
      expect(Math.max(...f.outline.map(([u, v]) => Math.hypot(u, v)))).toBeLessThan(0.36);
    }
    expect(new Set(shoes.map((s) => s.size))).toEqual(new Set(['man', 'woman', 'child']));
    // Faces of different sizes, lying every way.
    expect(new Set(faces.map((f) => Math.round(f.outline[0][0] * 100))).size).toBeGreaterThan(20);
    // Each row lies far to near, so nearer iron lies over farther.
    for (const row of rows) for (let i = 1; i < row.length; i++) expect(row[i].z).toBeLessThanOrEqual(row[i - 1].z);
    expect(hash2(3, 4)).toBe(hash2(3, 4));
  });

  it('sees the floor ahead in perspective, a step at a time, lit by the candle and falling away into the dark', () => {
    const v = makeView(1280, 800);
    const near = project(v, 0, 3)!;
    const far = project(v, 0, 12)!;
    expect(near[1]).toBeGreaterThan(far[1]);
    expect(far[1]).toBeGreaterThan(v.horizon);
    expect(project(v, 0, 3, EYE)![1]).toBeCloseTo(v.horizon);
    expect(project(v, 0, -1)).toBeNull();
    expect(STEP).toBeGreaterThan(0.5);
    const rows = rowsInView(4 * STEP);
    expect(rows[0]).toBeGreaterThan(rows[rows.length - 1]);
    // The candle lights the nearest iron; the far floor is nearly dark, the sides darker than the middle; unlit, almost nothing.
    expect(lightAt(0, 3)).toBeGreaterThan(0.6);
    expect(lightAt(0, 12)).toBeLessThan(0.1);
    expect(lightAt(2.5, 3)).toBeLessThan(lightAt(0, 3));
    expect(lightAt(0, 3, 0)).toBeLessThan(0.02);
    expect(easeStep(0)).toBe(0);
    expect(easeStep(1)).toBe(1);
    expect(easeStep(0.5)).toBeCloseTo(0.5);
  });

  it('brings the rattle in over about one step in three', () => {
    expect(RATTLE_CHANCE).toBeCloseTo(1 / 3);
  });

  it('makes its steps in the browser, until the recordings are in place, as two to four small knocks of iron, rung inharmonically', () => {
    const seen = new Set<number>();
    for (let i = 0; i < 12; i++) seen.add(hitsForStep(() => i / 12));
    expect([...seen].sort()).toEqual([2, 3, 4]);
    expect(PLATE[0]).toBe(1);
    // Not a musical note: no partial a whole multiple of the lowest.
    for (const r of PLATE.slice(1)) expect(Math.abs(r - Math.round(r))).toBeGreaterThan(0.05);
    expect(WALK_SOUND).toBe('Hear your steps');
  });
});
