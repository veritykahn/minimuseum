import { act, renderHook } from '@testing-library/react';
import { useAudioEngine, useBandBuilder, useQuiz } from '@/app/exhibitions/harlem-renaissance/jazz-lab/hooks';

/*
 * The Jazz Lab's sounds start asynchronously (fetch + decode), so a stop can
 * land before the start it should cancel. These tests drive the engine with a
 * mocked AudioContext whose loads resolve only when the test says so, and
 * count the nodes still sounding after every stop.
 */

class FakeParam {
  value = 1;
  setValueAtTime(v: number) { this.value = v; }
  linearRampToValueAtTime(v: number) { this.value = v; }
  cancelScheduledValues() {}
}

class FakeSource {
  buffer: unknown = null;
  loop = false;
  onended: (() => void) | null = null;
  started = false;
  stopped = false;
  connect() {}
  disconnect() {}
  start() { this.started = true; live.add(this); }
  stop() {
    if (!this.started) throw new Error('not started');
    if (this.stopped) return;
    this.stopped = true;
    live.delete(this);
    // Like the browser, "ended" arrives in a later task, after the stop call
    // returns and after any replacement has started.
    const cb = this.onended;
    setTimeout(() => cb?.(), 0);
  }
}

let live = new Set<FakeSource>();
let created: FakeSource[] = [];

class FakeContext {
  state = 'running';
  currentTime = 0;
  destination = {};
  createBufferSource() { const s = new FakeSource(); created.push(s); return s; }
  createGain() { return { gain: new FakeParam(), connect() {}, disconnect() {} }; }
  decodeAudioData(ab: ArrayBuffer) { return Promise.resolve({ ab }); }
  resume() { return Promise.resolve(); }
  close() { this.state = 'closed'; live.forEach((s) => live.delete(s)); return Promise.resolve(); }
}

/** fetch() that waits for release(url) — or resolves at once if `instant`. */
let pending: Map<string, Array<() => void>>;
let instant = false;
function release(url?: string) {
  for (const [u, fns] of pending) {
    if (url && u !== url) continue;
    fns.forEach((f) => f());
    pending.delete(u);
  }
}
const flush = () => act(async () => { for (let i = 0; i < 10; i++) await Promise.resolve(); });

beforeEach(() => {
  live = new Set();
  created = [];
  pending = new Map();
  instant = false;
  (window as unknown as { AudioContext: unknown }).AudioContext = FakeContext;
  global.fetch = jest.fn((url: string) => {
    const res = { arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)) };
    if (instant) return Promise.resolve(res);
    return new Promise((resolve) => {
      const arr = pending.get(url) ?? [];
      arr.push(() => resolve(res));
      pending.set(url, arr);
    });
  }) as unknown as typeof fetch;
});

afterEach(() => jest.useRealTimers());

describe('useAudioEngine', () => {
  it('a stop pressed while a loop is still loading means it never sounds', async () => {
    const { result } = renderHook(() => useAudioEngine());
    let p!: Promise<void>;
    act(() => { p = result.current.playLoop('bass', '/bass.mp3'); });
    act(() => result.current.stopAll());
    release();
    await act(async () => { await p; });
    expect(live.size).toBe(0);
    expect(created.length).toBe(0);
  });

  it('stopSource during loading cancels that id only', async () => {
    const { result } = renderHook(() => useAudioEngine());
    act(() => { void result.current.playLoop('bass', '/bass.mp3'); void result.current.playLoop('drums', '/drums.mp3'); });
    act(() => result.current.stopSource('bass'));
    release();
    await flush();
    expect(live.size).toBe(1);
    expect(result.current.isPlaying('drums')).toBe(true);
    expect(result.current.isPlaying('bass')).toBe(false);
  });

  it('two quick starts of the same id leave one sound, and stop silences it', async () => {
    const { result } = renderHook(() => useAudioEngine());
    act(() => {
      void result.current.playLoop('bass', '/bass-1.mp3');
      void result.current.playLoop('bass', '/bass-2.mp3');
    });
    release('/bass-2.mp3');
    await flush();
    release('/bass-1.mp3'); // the stale start finishes loading last
    await flush();
    expect(live.size).toBe(1);
    act(() => result.current.stopSource('bass'));
    expect(live.size).toBe(0);
  });

  it('even with every buffer cached, back-to-back starts never orphan a node', async () => {
    instant = true;
    const { result } = renderHook(() => useAudioEngine());
    act(() => {
      for (let i = 0; i < 5; i++) void result.current.playLoop('piano', '/piano.mp3');
    });
    await flush();
    expect(live.size).toBe(1);
    act(() => result.current.stopAll());
    expect(live.size).toBe(0);
  });

  it("a fade-out's timer does not cut off the same instrument brought straight back", async () => {
    jest.useFakeTimers();
    instant = true;
    const { result } = renderHook(() => useAudioEngine());
    act(() => { void result.current.playLoop('sax', '/sax.mp3'); });
    await flush();
    act(() => result.current.fadeOutAndStop('sax'));
    act(() => { void result.current.playLoop('sax', '/sax.mp3'); });
    await flush();
    act(() => { jest.advanceTimersByTime(200); });
    expect(live.size).toBe(1);
    expect(result.current.isPlaying('sax')).toBe(true);
    act(() => result.current.stopSource('sax'));
    expect(live.size).toBe(0);
    jest.useRealTimers();
  });

  it('stopAll also catches a node still fading out', async () => {
    instant = true;
    const { result } = renderHook(() => useAudioEngine());
    act(() => { void result.current.playLoop('sax', '/sax.mp3'); });
    await flush();
    act(() => result.current.fadeOutAndStop('sax'));
    act(() => result.current.stopAll());
    expect(live.size).toBe(0);
  });

  it("a replaced one-shot's late 'ended' does not unhook its replacement", async () => {
    instant = true;
    const { result } = renderHook(() => useAudioEngine());
    act(() => { void result.current.playOnce('quiz', '/a.mp3'); });
    await flush();
    act(() => { void result.current.playOnce('quiz', '/b.mp3'); });
    await act(async () => { await new Promise((r) => setTimeout(r, 5)); }); // the first node's "ended" fires here
    expect(result.current.isPlaying('quiz')).toBe(true);
    act(() => result.current.stopSource('quiz'));
    expect(live.size).toBe(0);
  });

  it('unmounting while loading never starts the sound', async () => {
    const { result, unmount } = renderHook(() => useAudioEngine());
    act(() => { void result.current.playLoop('bass', '/bass.mp3'); });
    unmount();
    release();
    await flush();
    expect(created.length).toBe(0);
  });

  it('pagehide silences everything and empties the band', async () => {
    instant = true;
    const { result } = renderHook(() => {
      const audio = useAudioEngine();
      return useBandBuilder(audio);
    });
    act(() => result.current.tapInstrument('piano'));
    await flush();
    expect(live.size).toBe(1);
    expect(result.current.active.size).toBe(1);
    act(() => { window.dispatchEvent(new Event('pagehide')); });
    expect(live.size).toBe(0);
    expect(result.current.active.size).toBe(0);
  });

  it('is one stable object across renders', () => {
    const { result, rerender } = renderHook(() => useAudioEngine());
    const first = result.current;
    rerender();
    expect(result.current).toBe(first);
  });
});

describe('useQuiz', () => {
  it('a tab change inside the pause after an answer brings the next round up silently', async () => {
    jest.useFakeTimers();
    instant = true;
    const { result } = renderHook(() => {
      const audio = useAudioEngine();
      return { audio, quiz: useQuiz(audio) };
    });
    act(() => result.current.quiz.startGame());
    await flush();
    expect(live.size).toBe(1);
    act(() => result.current.quiz.submitAnswer('piano'));
    expect(live.size).toBe(0);
    act(() => result.current.audio.stopAll()); // what a tab change does
    act(() => { jest.advanceTimersByTime(1600); });
    await flush();
    expect(result.current.quiz.currentRound).toBe(1);
    expect(result.current.quiz.isQuizPlaying).toBe(false);
    expect(created.length).toBe(1);
    expect(live.size).toBe(0);
    jest.useRealTimers();
  });

  it('without an interruption the next round still plays its clip', async () => {
    jest.useFakeTimers();
    instant = true;
    const { result } = renderHook(() => useQuiz(useAudioEngine()));
    act(() => result.current.startGame());
    await flush();
    act(() => result.current.submitAnswer('piano'));
    act(() => { jest.advanceTimersByTime(1600); });
    await flush();
    expect(result.current.isQuizPlaying).toBe(true);
    expect(live.size).toBe(1);
    jest.useRealTimers();
  });
});
