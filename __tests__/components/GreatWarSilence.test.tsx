import { act, fireEvent, render, renderHook, screen } from '@testing-library/react';
import SilenceFilm from '@/app/exhibitions/great-war/silence/SilenceFilm';
import { thudSchedule, useArmisticeSound } from '@/app/exhibitions/great-war/silence/armisticeSound';
import { FILM_END, HOUR_AT, IWM, SOUND_NOTE, STRIP_START, TITLE_CARDS, sceneAt, startOf } from '@/app/exhibitions/great-war/silence/film';

/*
 * "When the Guns Fell Silent": the owner's words exactly, the timeline, the
 * barrage stopping before the hour, and the sound stopping when the page
 * goes, driven with a fake AudioContext that counts what is still sounding.
 */

class FakeParam {
  value = 1;
  setValueAtTime(v: number) { this.value = v; }
  linearRampToValueAtTime(v: number) { this.value = v; }
  exponentialRampToValueAtTime(v: number) { this.value = v; }
  cancelScheduledValues() {}
}

let live: Set<FakeNode>;
let contexts: FakeContext[];

class FakeNode {
  gain = new FakeParam();
  frequency = new FakeParam();
  Q = new FakeParam();
  type = '';
  buffer: unknown = null;
  onended: (() => void) | null = null;
  stopped = false;
  connect() {}
  disconnect() {}
  start() { live.add(this); }
  /** stop(when) only schedules the end; stop() with no time stops it now. */
  stop(when?: number) {
    if (when !== undefined) return;
    this.stopped = true;
    live.delete(this);
  }
}

class FakeContext {
  state = 'running';
  currentTime = 0;
  sampleRate = 8000;
  destination = {};
  constructor() { contexts.push(this); }
  createGain() { return new FakeNode(); }
  createBiquadFilter() { return new FakeNode(); }
  createOscillator() { return new FakeNode(); }
  createBufferSource() { return new FakeNode(); }
  createBuffer(_c: number, length: number) { const d = new Float32Array(length); return { getChannelData: () => d }; }
  resume() { this.state = 'running'; return Promise.resolve(); }
  suspend() { this.state = 'suspended'; return Promise.resolve(); }
  close() { this.state = 'closed'; return Promise.resolve(); }
}

beforeEach(() => {
  live = new Set();
  contexts = [];
  (window as unknown as { AudioContext: unknown }).AudioContext = FakeContext;
});
afterEach(() => {
  delete (window as unknown as { AudioContext?: unknown }).AudioContext;
  jest.useRealTimers();
});

describe('the film’s words and timing', () => {
  it('sets the owner’s six title cards exactly', () => {
    expect(TITLE_CARDS).toEqual([
      'After 1,568 days of war.',
      'After 20 million dead.',
      'After boys lied about their age to fight.',
      'After trenches stretched 475 miles across Europe.',
      'After one final soldier fell at 10:59 AM.',
      'The guns finally went silent.',
    ]);
    expect(SOUND_NOTE).toBe('Our sound reconstruction, based on the sound-ranging record. Not a recording.');
  });

  it('runs countdown, cards (with the photograph after the third), the record, then the end', () => {
    expect(sceneAt(0)).toEqual({ kind: 'countdown', n: 5 });
    expect(sceneAt(4500)).toEqual({ kind: 'countdown', n: 1 });
    expect(sceneAt(startOf('card', 0))).toEqual({ kind: 'card', index: 0 });
    expect(sceneAt(startOf('card', 2) + 3900)).toEqual({ kind: 'photo' });
    expect(sceneAt(startOf('card', 3))).toEqual({ kind: 'card', index: 3 });
    expect(sceneAt(STRIP_START)).toEqual({ kind: 'strip' });
    expect(STRIP_START < HOUR_AT && HOUR_AT < FILM_END).toBe(true);
    expect(sceneAt(FILM_END)).toEqual({ kind: 'end' });
  });

  it('credits IWM exactly as its records specify', () => {
    expect(IWM.record.credit).toBe('© IWM (Q 47886)');
    expect(IWM.record.url).toBe('https://www.iwm.org.uk/collections/item/object/205281906');
    expect(IWM.trench.credit).toBe('Image: IWM (Q 1)');
    expect(IWM.reconstruction.label).toBe('How sound ranging worked, at the Imperial War Museum');
  });
});

describe('the barrage', () => {
  it('quickens toward the hour and falls silent before it', () => {
    const thuds = thudSchedule(5, 47);
    expect(thuds.length).toBeGreaterThan(15);
    expect(Math.max(...thuds.map((t) => t.at))).toBeLessThan(47);
    const early = thuds.filter((t) => t.at < 15).length;
    const late = thuds.filter((t) => t.at > 37).length;
    expect(late).toBeGreaterThan(early);
    expect(thudSchedule(5, 47)).toEqual(thuds); // the same every time
  });
});

describe('the sound', () => {
  it('makes no sound before Begin', () => {
    render(<SilenceFilm />);
    expect(contexts).toHaveLength(0);
    expect(screen.getByText(SOUND_NOTE)).toBeInTheDocument();
  });

  it('starts on Begin, mutes on request, and stops when the page goes', () => {
    jest.useFakeTimers();
    const { unmount } = render(<SilenceFilm />);
    fireEvent.click(screen.getByRole('button', { name: 'Begin' }));
    expect(contexts).toHaveLength(1);
    expect(live.size).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: 'Pause' })).toHaveFocus();

    const mute = screen.getByRole('button', { name: 'Sound on' });
    fireEvent.click(mute);
    expect(screen.getByRole('button', { name: 'Sound off' })).toHaveAttribute('aria-pressed', 'true');

    unmount();
    expect(live.size).toBe(0);
    expect(contexts[0].state).toBe('closed');
  });

  it('stops on pagehide', () => {
    const { result } = renderHook(() => useArmisticeSound());
    act(() => result.current.begin(0, 5000, 47000));
    expect(live.size).toBeGreaterThan(0);
    act(() => { window.dispatchEvent(new Event('pagehide')); });
    expect(live.size).toBe(0);
    expect(contexts[0].state).toBe('closed');
  });

  it('schedules nothing when begun after the hour', () => {
    const { result } = renderHook(() => useArmisticeSound());
    act(() => result.current.begin(HOUR_AT + 10, 5000, HOUR_AT));
    expect(live.size).toBe(0);
  });

  it('Skip to the end silences everything and shows IWM’s record and link', () => {
    jest.useFakeTimers();
    render(<SilenceFilm />);
    fireEvent.click(screen.getByRole('button', { name: 'Begin' }));
    fireEvent.click(screen.getByRole('button', { name: 'Skip to the end' }));
    expect(live.size).toBe(0);
    expect(screen.getByRole('link', { name: /How sound ranging worked, at the Imperial War Museum/ })).toHaveAttribute('href', IWM.reconstruction.url);
    expect(screen.getByRole('link', { name: '© IWM (Q 47886)' })).toHaveAttribute('href', IWM.record.url);
    expect(screen.getByRole('button', { name: 'Watch again' })).toHaveFocus();
  });

  it('shows the title cards one at a time as the clock runs', () => {
    jest.useFakeTimers();
    render(<SilenceFilm />);
    fireEvent.click(screen.getByRole('button', { name: 'Begin' }));
    act(() => { jest.advanceTimersByTime(startOf('card', 1) + 200); });
    expect(document.querySelector('.gws-card-text')).toHaveTextContent('After 20 million dead.');
    expect(document.querySelectorAll('.gws-card-text')).toHaveLength(1);
  });
});
