import { act, fireEvent, render, renderHook, screen, within } from '@testing-library/react';
import SilenceFilm from '@/app/exhibitions/great-war/silence/SilenceFilm';
import GreatWarSilence from '@/app/exhibitions/great-war/silence/page';
import { ArmisticeSound, BIRD_LEAD, BREEZE_AFTER, HUSH, birdSong, gunfireSchedule, renderGunfire, thudSchedule, useArmisticeSound } from '@/app/exhibitions/great-war/silence/armisticeSound';
import { SLOT_NAMES, SOUND_SLOTS, soundSrc } from '@/app/exhibitions/great-war/silence/sounds';
import { soundSlotsOnDisk } from '@/app/exhibitions/great-war/silence/soundSlots';
import { SILENCE_SOURCES } from '@/app/exhibitions/great-war/silence/sources';
import { FILM_END, HOUR_AT, IWM, SOUND_NOTE, SOUND_NOTE_WITH_FILES, STRIP_START, TITLE_CARDS, sceneAt, startOf } from '@/app/exhibitions/great-war/silence/film';

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
let started: FakeNode[];
let contexts: FakeContext[];

class FakeNode {
  gain = new FakeParam();
  frequency = new FakeParam();
  Q = new FakeParam();
  threshold = new FakeParam();
  knee = new FakeParam();
  ratio = new FakeParam();
  attack = new FakeParam();
  release = new FakeParam();
  loop = false;
  type = '';
  buffer: unknown = null;
  onended: (() => void) | null = null;
  stopped = false;
  connect() {}
  disconnect() {}
  startedAt = 0;
  start(when = 0) { this.startedAt = when; started.push(this); live.add(this); }
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
  createDynamicsCompressor() { return new FakeNode(); }
  createOscillator() { return new FakeNode(); }
  createBufferSource() { return new FakeNode(); }
  createBuffer(_c: number, length: number) { const d = new Float32Array(length); return { getChannelData: () => d }; }
  resume() { this.state = 'running'; return Promise.resolve(); }
  suspend() { this.state = 'suspended'; return Promise.resolve(); }
  close() { this.state = 'closed'; return Promise.resolve(); }
  decodeAudioData(_d: ArrayBuffer, ok: (b: unknown) => void) { ok({ duration: 12, owner: true }); }
}

beforeEach(() => {
  live = new Set();
  started = [];
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
    expect(SOUND_NOTE).toBe('Our sound reconstruction, not a recording. The guns are timed to the sound-ranging record; the breeze and the bird are added.');
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

  it('is heavy: many guns, and more of them near the end', () => {
    const thuds = thudSchedule(0, 42);
    expect(thuds.length).toBeGreaterThan(50);
    expect(thuds.filter((t) => t.at > 32).length).toBeGreaterThan(20);
  });

  it('has rifle fire and machine-gun bursts, thickening toward the hour, and none in its last moment', () => {
    const shots = gunfireSchedule(0, 42);
    expect(shots.length).toBeGreaterThan(200);
    expect(gunfireSchedule(0, 42)).toEqual(shots);
    expect(Math.max(...shots.map((s) => s.at))).toBeLessThan(42 - HUSH);
    expect(shots.filter((s) => s.at > 32).length).toBeGreaterThan(shots.filter((s) => s.at < 10).length);
    // A machine gun's burst: shots about an eighth of a second apart.
    const gaps = shots.slice(1).map((s, i) => s.at - shots[i].at);
    expect(gaps.filter((g) => g > 0.1 && g < 0.15).length).toBeGreaterThan(40);
  });

  it('renders each shot as sound, and nothing after the last', () => {
    const rate = 8000;
    const samples = renderGunfire(rate, 3, [{ at: 0.5, level: 1, far: 0 }, { at: 1, level: 1, far: 1 }]);
    const peak = (a: number, b: number) => Math.max(...Array.from(samples.subarray(a * rate, b * rate), Math.abs));
    expect(peak(0, 0.45)).toBe(0);
    expect(peak(0.5, 0.6)).toBeGreaterThan(0.2);
    // The far one is quieter than the near one.
    expect(peak(1, 1.1)).toBeLessThan(peak(0.5, 0.6));
    expect(peak(2, 3)).toBe(0);
  });

  it('sings as a single bird: two short phrases of high notes', () => {
    const song = birdSong();
    expect(song.length).toBeGreaterThan(14);
    for (const n of song) expect(Math.min(n.from, n.to)).toBeGreaterThan(2000);
    const length = song[song.length - 1].at + song[song.length - 1].dur;
    expect(length).toBeGreaterThan(BIRD_LEAD);
    expect(length).toBeLessThan(BIRD_LEAD + 3);
  });
});

describe('the sound’s shape: battle, the hour, the quiet', () => {
  const play = (elapsed = 0, files = {}) => {
    const engine = new ArmisticeSound(FakeContext as unknown as typeof AudioContext);
    engine.play(elapsed, 5000, HOUR_AT, FILM_END, files);
    return engine;
  };
  const hour = HOUR_AT / 1000;
  const end = FILM_END / 1000;

  it('falls silent at the hour, then only a breeze, then a single bird right at the end', () => {
    play();
    const at = started.map((n) => n.startedAt);
    expect(at.filter((t) => t < hour).length).toBeGreaterThan(50);
    // Nothing starts in the last moment before the hour, nor in the first second after it.
    expect(at.filter((t) => t > hour - HUSH && t < hour + 1)).toEqual([]);
    const after = started.filter((n) => n.startedAt >= hour);
    // The breeze: one looping noise and its two slow swells, starting a second after the hour.
    const breeze = after.filter((n) => n.startedAt === hour + 1);
    expect(breeze).toHaveLength(3);
    expect(breeze.some((n) => n.loop)).toBe(true);
    // The bird: everything else after the hour, and only in the film's last seconds.
    const bird = after.filter((n) => n.startedAt !== hour + 1);
    expect(bird.length).toBe(birdSong().length);
    expect(Math.min(...bird.map((n) => n.startedAt))).toBeCloseTo(end - BIRD_LEAD, 5);
  });

  it('starts only the quiet when begun after the hour, and nothing once all is over', () => {
    play(HOUR_AT + 2000);
    expect(started.length).toBe(3 + birdSong().length);
    started = [];
    play(FILM_END + BREEZE_AFTER * 1000 + 10);
    expect(started).toHaveLength(0);
  });

  it('plays the owner’s file in its slot instead of the made sound', async () => {
    const buf = { duration: 9 } as unknown as AudioBuffer;
    play(0, { battle: Promise.resolve(buf), bird: Promise.resolve(buf), breeze: Promise.resolve(null) });
    await act(async () => {});
    const sources = started.filter((n) => n.buffer === buf);
    // The battle, looped from the first card; the bird, once, at the end.
    expect(sources).toHaveLength(2);
    expect(sources.find((n) => n.loop)?.startedAt).toBe(5);
    expect(sources.find((n) => !n.loop)?.startedAt).toBeCloseTo(end - BIRD_LEAD, 5);
    // A file that will not decode falls back to the made breeze.
    expect(started.filter((n) => n.startedAt === hour + 1)).toHaveLength(3);
    // The made gunfire is not made when her file is there: one rendered buffer fewer.
    expect(started.filter((n) => n.buffer && (n.buffer as { getChannelData?: unknown }).getChannelData && !n.loop && n.startedAt === 5)).toHaveLength(0);
  });
});

describe('the drop-in sound slots', () => {
  it('names the four files the owner can drop in', () => {
    expect(SLOT_NAMES).toEqual(['battle', 'artillery', 'breeze', 'bird']);
    expect(SLOT_NAMES.map(soundSrc)).toEqual([
      '/exhibitions/great-war/sounds/battle.mp3',
      '/exhibitions/great-war/sounds/artillery.mp3',
      '/exhibitions/great-war/sounds/breeze.mp3',
      '/exhibitions/great-war/sounds/bird.mp3',
    ]);
    SLOT_NAMES.forEach((s) => expect(SOUND_SLOTS[s].use.length).toBeGreaterThan(20));
  });

  it('looks on disk, and asks for no file that is not there', () => {
    expect(soundSlotsOnDisk()).toEqual([]);
    const fetchSpy = jest.fn();
    (global as unknown as { fetch: unknown }).fetch = fetchSpy;
    render(<GreatWarSilence />);
    expect(fetchSpy).not.toHaveBeenCalled();
    delete (global as unknown as { fetch?: unknown }).fetch;
  });

  it('fetches a filled slot as the page opens, decodes it on Begin, and changes the note', async () => {
    const fetchSpy = jest.fn(() => Promise.resolve({ ok: true, arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)) }));
    (global as unknown as { fetch: unknown }).fetch = fetchSpy;
    render(<SilenceFilm owned={['bird']} />);
    expect(fetchSpy).toHaveBeenCalledWith('/exhibitions/great-war/sounds/bird.mp3');
    expect(screen.getByText(SOUND_NOTE_WITH_FILES)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Begin' }));
    await act(async () => {});
    const owned = started.filter((n) => (n.buffer as { owner?: boolean } | null)?.owner);
    expect(owned).toHaveLength(1);
    expect(owned[0].loop).toBe(false);
    delete (global as unknown as { fetch?: unknown }).fetch;
  });
});

describe('the sound', () => {
  it('makes no sound before Begin, and asks for sound to be turned on', () => {
    render(<SilenceFilm />);
    expect(contexts).toHaveLength(0);
    expect(screen.getByText(SOUND_NOTE)).toBeInTheDocument();
    expect(screen.getByText('Turn your sound on.')).toBeInTheDocument();
    // The prompt comes before the Begin button.
    const prompt = screen.getByText('Turn your sound on.');
    expect(prompt.compareDocumentPosition(screen.getByRole('button', { name: 'Begin' })) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('asks for sound in the server’s page too, so the browser’s first render matches it', () => {
    // A mismatch here is a hydration error: the server cannot know about Web Audio, so it assumes it.
    const { renderToString } = jest.requireActual<typeof import('react-dom/server')>('react-dom/server.node');
    // As on the server: no Web Audio to be found.
    delete (window as unknown as { AudioContext?: unknown }).AudioContext;
    expect(renderToString(<SilenceFilm />)).toContain('Turn your sound on.');
  });

  it('does not ask for sound where there is none', () => {
    delete (window as unknown as { AudioContext?: unknown }).AudioContext;
    render(<SilenceFilm />);
    expect(screen.queryByText('Turn your sound on.')).toBeNull();
  });

  it('tells the film’s sound in the transcript', () => {
    render(<SilenceFilm />);
    expect(screen.getByText(/single bird singing/)).toBeInTheDocument();
  });

  it('starts on Begin, mutes on request, and stops when the page goes', () => {
    jest.useFakeTimers();
    const { unmount } = render(<SilenceFilm />);
    fireEvent.click(screen.getByRole('button', { name: 'Begin' }));
    expect(contexts).toHaveLength(1);
    expect(live.size).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: 'Pause' })).toHaveFocus();

    const mute = screen.getByRole('button', { name: 'Mute' });
    fireEvent.click(mute);
    expect(screen.getByRole('button', { name: 'Unmute' })).toHaveAttribute('aria-pressed', 'true');

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
    // The photograph's credit is in the room's Sources drawer, not under it.
    expect(screen.queryByRole('link', { name: '© IWM (Q 47886)' })).toBeNull();
    expect(screen.getByRole('img', { name: IWM.record.alt })).toBeInTheDocument();
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

  // The room on one screen: what used to follow the film below the fold is now in its frame, or at its foot.
  it('keeps everything on one screen: the end in the film’s frame, the transcript and the way back at the foot', () => {
    jest.useFakeTimers();
    const { container } = render(<GreatWarSilence />);
    expect(screen.getByRole('heading', { level: 1, name: 'When the Guns Fell Silent' })).toBeInTheDocument();
    expect(screen.getByText('The last minute of the war, November 11, 1918')).toBeInTheDocument();
    const foot = container.querySelector('.gws-foot')!;
    expect(foot).toContainElement(screen.getByText('Read the film as text'));
    expect(foot).toContainElement(screen.getByRole('link', { name: 'Return to Exhibition' }));
    fireEvent.click(screen.getByRole('button', { name: 'Begin' }));
    fireEvent.click(screen.getByRole('button', { name: 'Skip to the end' }));
    const screenEl = container.querySelector('.gws-screen')!;
    expect(screenEl).toContainElement(screen.getByText('At 11:00 on November 11, 1918, the guns fell silent.'));
    expect(screenEl).toContainElement(screen.getByRole('img', { name: IWM.record.alt }));
  });

  it('lists every picture credit and source in its Sources drawer, the licence in full, and cites nothing on the screen', () => {
    jest.useFakeTimers();
    const { container } = render(<GreatWarSilence />);
    fireEvent.click(screen.getByRole('button', { name: 'Begin' }));
    act(() => { jest.advanceTimersByTime(startOf('photo', 0) + 200); });
    // The trench photograph, with its description and no credit line under it.
    const photo = container.querySelector('.gws-photo figcaption')!;
    expect(photo).toHaveTextContent(IWM.trench.description);
    expect(within(photo as HTMLElement).queryByRole('link')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Skip to the end' }));
    expect(container.querySelector('.gws-strip-credit')).toBeNull();
    expect(within(container.querySelector('.gws-screen') as HTMLElement).queryByText(/© IWM|Image: IWM|Redrawn from/)).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Sources and credits' }));
    const drawer = screen.getByRole('dialog', { name: 'Sources and credits' });
    expect(within(drawer).getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual(SILENCE_SOURCES.map((g) => g.title));
    expect(within(drawer).getByRole('link', { name: IWM.trench.credit })).toHaveAttribute('href', IWM.trench.url);
    expect(within(drawer).getAllByRole('link', { name: IWM.record.credit })[0]).toHaveAttribute('href', IWM.record.url);
    expect(within(drawer).getByRole('link', { name: /Redrawn from the 1918 sound-ranging record/ })).toHaveAttribute('href', IWM.record.url);
    expect(within(drawer).getByRole('link', { name: IWM.licence.label })).toHaveAttribute('href', IWM.licence.url);
    expect(within(drawer).getAllByText(/IWM Non-Commercial Licence/).length).toBeGreaterThanOrEqual(3);
  });

  it('closes the transcript with Esc', () => {
    render(<SilenceFilm />);
    const details = screen.getByText('Read the film as text').closest('details')!;
    details.open = true;
    fireEvent.keyDown(details, { key: 'Escape' });
    expect(details.open).toBe(false);
  });
});
