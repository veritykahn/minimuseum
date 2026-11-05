import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import fs from 'node:fs';
import path from 'node:path';
import WalkRoom from '@/app/exhibitions/holocaust/walk/WalkRoom';
import { FILM_FONT_HREF } from '@/app/exhibitions/holocaust/walk/Film';
import { FILM_BLEEDS, FILM_FRAMES, FILM_LINE_MS, FILM_MS, FILM_OPENING, FILM_OPENING_MS, FILM_SKIP, filmSourceGroups } from '@/app/exhibitions/holocaust/walk/filmText';
import {
  WALK_GO,
  WALK_MEANING,
  DARK_MOST,
  FIRST_NAME_AT,
  GAP_MS,
  HESITATE_CHANCE,
  HESITATE_MS,
  NAMES_PER_WALK,
  NAME_FEET,
  WALK_BEGIN,
  WALK_BEGIN_STILL,
  WALK_CLOSE,
  WALK_INSPIRATION,
  WALK_INSPIRED_BY,
  WALK_INTRO,
  WALK_MS,
  darkness,
  WALK_NAMES_HEADING,
  WALK_SOUND,
  WALK_STONE_INVITE,
  nameSpacing,
  nextGap,
  walkSourceGroups,
} from '@/app/exhibitions/holocaust/walk/Walk';
import { EYE, STEP, easeStep, hash2, hazeAt, lightAt, makeView, project, rowPieces, rowsInView, type IronShoe } from '@/app/exhibitions/holocaust/walk/walkScene';
import { PLATE, hitsForStep } from '@/app/exhibitions/holocaust/walk/footsteps';
import { RATTLE_CHANCE } from '@/app/exhibitions/holocaust/walk/metal';
import { MUSIC_SRC, PLACEHOLDERS, WALK_DIR, WALK_LINES, slotFiles, slotNumber } from '@/app/exhibitions/holocaust/walk/walkLines';
import { FILM_PICTURE_CREDITS } from '@/app/exhibitions/holocaust/walk/filmPictures';
import { WALK_NAMES } from '@/app/exhibitions/holocaust/walk/walkNames';
import { SILHOUETTE_KINDS } from '@/app/exhibitions/holocaust/walk/WalkPicture';
import { walkSlotsOnDisk } from '@/app/exhibitions/holocaust/walk/walkSlots';
import { FALLBACK_VICTIMS, LETY_SHARE, SHOWN_KEY, VICTIMS, drawWalkNames, readVictims, victimText, walkPool, type Victim } from '@/app/exhibitions/holocaust/walk/victims';
import Countdown, { isRemembranceDay, nextRemembrance } from '@/app/exhibitions/holocaust/stones/Countdown';
import { LIBERATION_LINE } from '@/app/exhibitions/holocaust/holocaust';

/*
 * The Walk, its own room: Begin opens it full screen; first the film (a few
 * opening words on what the Holocaust was, then the history's lines,
 * each over its picture, in order, in black and white; about five and a
 * half seconds a line, Pause and Play, a quiet skip; the owner's music, if
 * it is there, from the same press, fading as the film ends; under reduced
 * motion, a line at a time by button); then the grey hall, the iron floor
 * and the clanks, the walk walking on by itself, one child's name at a
 * time coming toward the visitor every two or three footfalls, never
 * crowding; a fresh set each walk, avoiding names shown before; about four
 * minutes; then a quiet close and the way to lay a stone. Every source in
 * the Sources drawer, never inline. And the countdown to January 27, in
 * Lay a Stone.
 */

beforeAll(() => {
  jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
});
beforeEach(() => {
  localStorage.clear();
  window.history.replaceState(null, '', '/');
});
afterEach(() => {
  jest.useRealTimers();
  reducedMotion(false);
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

/** A stand-in for an <audio> element, for the film's music. */
function fakeMusic() {
  const made: { src: string; volume: number; plays: number; pauses: number; loop: boolean }[] = [];
  const before = window.Audio;
  class FakeMusic {
    src: string;
    volume = 1;
    loop = false;
    preload = '';
    plays = 0;
    pauses = 0;
    constructor(src: string) {
      this.src = src;
      made.push(this);
    }
    play() {
      this.plays += 1;
      return Promise.resolve();
    }
    pause() {
      this.pauses += 1;
    }
  }
  window.Audio = FakeMusic as unknown as typeof Audio;
  return { made, restore: () => (window.Audio = before) };
}

function reducedMotion(on: boolean) {
  window.matchMedia = ((q: string) => ({ matches: on && q.includes('reduce'), media: q, addEventListener: () => {}, removeEventListener: () => {}, addListener: () => {}, removeListener: () => {} })) as unknown as typeof window.matchMedia;
}

/** Fixtures: as many children's records as asked for, in victims.json's shape, so the tests hold whatever the file holds. */
const victims = (n: number): Victim[] =>
  Array.from({ length: n }, (_, i) => ({ id: `v${i + 1}`, name: `Child ${i + 1}`, age: String(3 + (i % 14)), died: String(1941 + (i % 4)), place: ['Auschwitz', 'Sobibor', 'Treblinka', 'Bergen-Belsen'][i % 4], source: { label: `Record ${i + 1}`, href: `https://example.org/record/${i + 1}` } }));
const MANY = victims(200);

const ALL_PICTURES = Object.fromEntries(WALK_LINES.map((l) => [l.slot, `walk-${String(slotNumber(l.slot)).padStart(2, '0')}.webp`]));

const tick = (ms: number) => act(() => { jest.advanceTimersByTime(ms); });
/** Time passing a little at a time, so each timer the rooms set as they go is run in its turn. */
const pass = (ms: number, by = 250) => {
  for (let t = 0; t < ms; t += by) tick(Math.min(by, ms - t));
};

function begin(props: Parameters<typeof WalkRoom>[0] = {}) {
  render(<WalkRoom pool={MANY} {...props} />);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('The Walk');
  expect(screen.getByRole('region', { name: 'The walk' })).toHaveTextContent(WALK_INTRO);
  fireEvent.click(screen.getByRole('button', { name: 'Begin' }));
  return screen.getByRole('dialog', { name: 'The film' });
}
const full = () => document.querySelector('.hos-walk-full') as HTMLElement;
const status = () => full().querySelector(':scope > [role="status"]')!.textContent;
/** Straight to the walk, past the film. */
function walkNow(props: Parameters<typeof WalkRoom>[0] = {}) {
  const film = begin(props);
  fireEvent.click(within(film).getByRole('button', { name: FILM_SKIP }));
  return intoTheWalk();
}
/** Past the note on what the walk is, into the walk itself. */
function intoTheWalk() {
  const before = screen.getByRole('dialog', { name: 'The walk' });
  expect(before).toHaveClass('is-threshold');
  fireEvent.click(within(before).getByRole('button', { name: WALK_GO }));
  return screen.getByRole('dialog', { name: 'The walk' });
}
const shownNames = () => Array.from(full().querySelectorAll('[data-name]')).map((n) => [n.getAttribute('data-name')!, Number(n.getAttribute('data-at'))] as const);

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

    it('gives days, hours, minutes and seconds, with a spoken label', () => {
      jest.setSystemTime(new Date(2027, 0, 25, 22, 30, 15));
      render(<Countdown />);
      expect(screen.getByRole('timer', { name: '1 day, 1 hour and 29 minutes until International Holocaust Remembrance Day, January 27, 2027' })).toHaveTextContent('1day01hour29minutes45seconds');
      tick(1000);
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

describe('the film', () => {
  it('opens full screen on Begin, with a few words on the Holocaust first, alone on the dark, in a typewriter face', () => {
    const film = begin();
    expect(film.parentElement).toBe(document.body);
    expect(film).toHaveClass('hos-walk-full', 'is-film');
    expect(film.querySelector('.hof-film')).toBeInTheDocument();
    expect(film.querySelector('[data-opening="F1"]')).toHaveTextContent(FILM_OPENING[0].text);
    expect(film.querySelector('.hof-words.is-card')).toBeInTheDocument();
    expect(status()).toBe(FILM_OPENING[0].text);
    expect(FILM_FONT_HREF).toMatch(/family=Special\+Elite/);
    expect(Array.from(document.querySelectorAll('style')).some((s) => s.textContent?.includes(FILM_FONT_HREF))).toBe(true);
    // The old film over it: grain, scratches, flicker, a darkened edge.
    for (const c of ['hof-grain', 'hof-scratches', 'hof-flicker', 'hof-vignette', 'hof-gate']) expect(film.querySelector(`.${c}`)).toBeInTheDocument();
    // Escape leaves it.
    fireEvent.keyDown(film, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.getByRole('button', { name: 'Begin' })).toBeInTheDocument();
  });

  it('plays by itself: the opening words, then every line in order, each over its picture, about five and a half seconds a line (longer for the toll), then the walk', () => {
    jest.useFakeTimers();
    const film = begin({ pictures: ALL_PICTURES });
    for (const o of FILM_OPENING) {
      expect(film.querySelector(`[data-opening="${o.id}"]`)).toHaveTextContent(o.text);
      tick(FILM_OPENING_MS);
    }
    WALK_LINES.forEach((line, i) => {
      const words = film.querySelector(`[data-line="${line.id}"]`)!;
      expect(words).toHaveTextContent(line.text);
      expect(words.textContent).toBe(line.text);
      expect(status()).toBe(line.text);
      // Its sources are in the drawer, never under the line.
      expect(within(words as HTMLElement).queryByRole('link')).toBeNull();
      // Its picture fills the screen, behind it.
      expect(film.querySelector('.hof-layer.is-current img')).toHaveAttribute('src', `${WALK_DIR}/${ALL_PICTURES[line.slot]}`);
      // Described for a screen reader: the photograph itself, where it is credited, else what the slot shows.
      expect(film.querySelector('.hof-layer.is-current img')).toHaveAttribute('alt', FILM_PICTURE_CREDITS[line.slot]?.alt ?? line.image);
      // Not before its time.
      tick((line.hold ?? FILM_LINE_MS) - 50);
      expect(film.querySelector(`[data-line="${line.id}"]`)).toBeInTheDocument();
      tick(50);
      if (i < WALK_LINES.length - 1) expect(film.querySelector(`[data-line="${WALK_LINES[i + 1].id}"]`)).toBeInTheDocument();
    });
    // After the last line, the note on what the walk is, then the walk.
    expect(screen.getByRole('dialog', { name: 'The walk' })).toHaveClass('is-threshold');
    expect(intoTheWalk()).toHaveClass('is-walk');
    expect(FILM_MS).toBe(FILM_OPENING.length * FILM_OPENING_MS + WALK_LINES.reduce((t, l) => t + (l.hold ?? FILM_LINE_MS), 0));
    // The killing centers' names and the toll are held longer, the last line longest.
    expect(WALK_LINES.filter((l) => l.hold).length).toBeGreaterThanOrEqual(4);
    expect(WALK_LINES[WALK_LINES.length - 1].hold).toBe(Math.max(...WALK_LINES.map((l) => l.hold ?? 0)));
    expect(FILM_LINE_MS).toBeGreaterThanOrEqual(5000);
    expect(FILM_LINE_MS).toBeLessThanOrEqual(6000);
  });

  it('fades each frame in over the one before; Pause holds it, Play goes on', () => {
    jest.useFakeTimers();
    const film = begin();
    tick(FILM_OPENING_MS);
    expect(film.querySelectorAll('.hof-layer')).toHaveLength(2);
    expect(film.querySelector('.hof-layer.is-before')).toHaveAttribute('aria-hidden', 'true');
    tick(FILM_OPENING_MS / 2);
    fireEvent.click(within(film).getByRole('button', { name: 'Pause' }));
    expect(status()).toBe('The film is paused.');
    pass(10 * FILM_LINE_MS);
    expect(film.querySelector('[data-opening="F2"]')).toBeInTheDocument();
    fireEvent.click(within(film).getByRole('button', { name: 'Play' }));
    // Only what was left of the frame.
    tick(FILM_OPENING_MS / 2 + 10);
    expect(film.querySelector('[data-opening="F3"]')).toBeInTheDocument();
  });

  it('can be skipped, quietly, to the walk: first, in silence, a few words on what the walk is, then the walk', () => {
    const film = begin();
    const skip = within(film).getByRole('button', { name: FILM_SKIP });
    expect(skip).toHaveClass('hof-skip');
    fireEvent.click(skip);
    const before = screen.getByRole('dialog', { name: 'The walk' });
    expect(before).toBe(film);
    expect(before).toHaveClass('is-threshold');
    expect(before.querySelector('.hof-film')).toBeNull();
    expect(before.querySelector('canvas.hos-walk-floor')).toBeNull();
    for (const p of WALK_MEANING) expect(before).toHaveTextContent(p);
    expect(WALK_MEANING.join(' ')).toMatch(/iron faces/);
    expect(WALK_MEANING.join(' ')).toMatch(/Kadishman/);
    expect(status()).toBe(WALK_MEANING.join(' '));
    // Its button has the focus, and begins the walk.
    expect(document.activeElement).toHaveTextContent(WALK_GO);
    const walk = intoTheWalk();
    expect(walk).toHaveClass('is-walk');
    expect(walk.querySelector('canvas.hos-walk-floor')).toBeInTheDocument();
  });

  it('leaves from the note too, back to the room', () => {
    const film = begin();
    fireEvent.click(within(film).getByRole('button', { name: FILM_SKIP }));
    fireEvent.click(within(screen.getByRole('dialog', { name: 'The walk' })).getByRole('button', { name: 'Leave the walk' }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('with reduced motion: no flicker or weave, and a line at a time by button, then the walk', () => {
    reducedMotion(true);
    jest.useFakeTimers();
    const film = begin();
    expect(film.querySelector('.hof-film')).toHaveClass('is-still');
    expect(within(film).queryByRole('button', { name: 'Pause' })).toBeNull();
    pass(5 * FILM_LINE_MS);
    expect(film.querySelector('[data-opening="F1"]')).toBeInTheDocument();
    for (let i = 1; i < FILM_FRAMES.length; i++) {
      fireEvent.click(within(film).getByRole('button', { name: 'Next' }));
      expect(film.querySelectorAll('.hof-layer')).toHaveLength(1);
    }
    expect(film.querySelector(`[data-line="${WALK_LINES[WALK_LINES.length - 1].id}"]`)).toBeInTheDocument();
    fireEvent.click(within(film).getByRole('button', { name: 'Next' }));
    expect(screen.getByRole('dialog', { name: 'The walk' })).toBeInTheDocument();
  });

  it('stands in with a placeholder where a picture is not yet in its slot', () => {
    reducedMotion(true);
    const film = begin();
    for (let i = 0; i < FILM_OPENING.length; i++) fireEvent.click(within(film).getByRole('button', { name: 'Next' }));
    const picture = film.querySelector(`[data-slot="${WALK_LINES[0].slot}"]`)!;
    expect(picture).toHaveAttribute('data-placeholder', WALK_LINES[0].placeholder);
    expect(picture).toHaveTextContent('Picture to come');
  });

  it('lets a picture’s color through only now and then, never on two pictures running', () => {
    const ids = WALK_LINES.map((l) => l.id);
    expect(FILM_BLEEDS.size).toBeGreaterThanOrEqual(2);
    expect(FILM_BLEEDS.size).toBeLessThanOrEqual(8);
    for (const id of FILM_BLEEDS) expect(FILM_BLEEDS.has(ids[ids.indexOf(id) + 1])).toBe(false);
  });

  it('plays the owner’s music from the visitor’s press, if it is there, pausing with the film and fading as it ends', () => {
    jest.useFakeTimers();
    const music = fakeMusic();
    try {
      const film = begin({ music: MUSIC_SRC });
      expect(music.made).toHaveLength(1);
      const [m] = music.made;
      expect(m.src).toBe(MUSIC_SRC);
      expect(m.plays).toBe(1);
      fireEvent.click(within(film).getByRole('button', { name: 'Pause' }));
      expect(m.pauses).toBe(1);
      fireEvent.click(within(film).getByRole('button', { name: 'Play' }));
      expect(m.plays).toBe(2);
      // A button turns it off and on.
      const toggle = within(film).getByRole('button', { name: 'Music' });
      expect(toggle).toHaveAttribute('aria-pressed', 'true');
      // It goes round, as the film is longer than the recording.
      expect(m.loop).toBe(true);
      // It plays to the end: as the last line comes, it fades, and is silent as the film ends.
      const lastLine = WALK_LINES[WALK_LINES.length - 1];
      const toll = WALK_LINES.find((l) => /^Six million/.test(l.text))!;
      pass(FILM_MS - (lastLine.hold ?? FILM_LINE_MS) + 10);
      expect(document.querySelector('.hof-film')).toHaveAttribute('data-frame', lastLine.id);
      expect(m.volume).toBeGreaterThan(0);
      expect(toll).toBeTruthy();
      const loud = m.volume;
      pass(FILM_LINE_MS / 2);
      expect(m.volume).toBeLessThan(loud);
      pass(lastLine.hold ?? FILM_LINE_MS);
      expect(m.volume).toBe(0);
      // Then, in silence, the note on what the walk is.
      expect(full()).toHaveClass('is-threshold');
      expect(screen.getByRole('dialog', { name: 'The walk' })).toBeInTheDocument();
    } finally {
      music.restore();
    }
  });

  it('is silent, with no music button, while the music is not there', () => {
    const music = fakeMusic();
    try {
      const film = begin();
      expect(music.made).toHaveLength(0);
      expect(within(film).queryByRole('button', { name: 'Music' })).toBeNull();
    } finally {
      music.restore();
    }
  });

  it('lists every line’s sources, by line, and the opening words’, in the Sources drawer, with what the walk is inspired by and its sounds', () => {
    const film = begin();
    expect(within(film.querySelector('.hof-film') as HTMLElement).queryByRole('link')).toBeNull();
    fireEvent.click(within(film).getByRole('button', { name: 'Sources and credits' }));
    const drawer = within(film).getByRole('dialog', { name: 'Sources and credits' });
    const opening = within(drawer).getByRole('heading', { name: 'The film: its opening words' }).closest('section')!;
    expect(within(opening).getAllByRole('link')[0]).toHaveAttribute('href', 'https://encyclopedia.ushmm.org/content/en/article/introduction-to-the-holocaust');
    WALK_LINES.forEach((line, i) => {
      const group = within(drawer).getByRole('heading', { name: `The film, line ${i + 1}` }).closest('section')!;
      for (const s of line.sources) expect(within(group).getByRole('link', { name: s.label })).toHaveAttribute('href', s.href);
      // A photograph that is not the owner's is credited under its line, last.
      const picture = FILM_PICTURE_CREDITS[line.slot];
      if (picture) expect(within(group).getAllByRole('link').at(-1)).toHaveAttribute('href', picture.href);
    });
    const inspired = within(drawer).getByRole('heading', { name: WALK_INSPIRED_BY }).closest('section')!;
    const [kadishman, danube] = within(inspired).getAllByRole('link');
    expect(kadishman).toHaveTextContent('Menashe Kadishman, Fallen Leaves (Shalekhet), Jewish Museum Berlin');
    expect(kadishman).toHaveAttribute('href', 'https://www.jmberlin.de/en/shalekhet-fallen-leaves');
    expect(danube).toHaveTextContent('Can Togay and Gyula Pauer, Shoes on the Danube Bank, Budapest');
    expect(danube).toHaveAttribute('href', WALK_INSPIRATION[1].href);
    expect(within(inspired).getAllByRole('link')).toHaveLength(2);
    const sounds = within(drawer).getByRole('heading', { name: 'The walk’s sounds' }).closest('section')!;
    expect(within(sounds).getAllByRole('link').map((a) => a.getAttribute('href'))).toEqual(['https://freesound.org/s/365411/', 'https://freesound.org/s/697754/']);
    expect(drawer).not.toHaveTextContent(/Leonardo/i);
    // No credit for a candle: it has gone from the walk.
    expect(within(drawer).queryByRole('heading', { name: /candle/i })).toBeNull();
    // No names yet: their heading comes with the first.
    expect(within(drawer).queryByRole('heading', { name: WALK_NAMES_HEADING })).toBeNull();
    expect(filmSourceGroups()).toHaveLength(1 + WALK_LINES.length);
    // Escape closes the drawer, and leaves the film open.
    fireEvent.keyDown(drawer, { key: 'Escape' });
    expect(within(film).queryByRole('dialog', { name: 'Sources and credits' })).toBeNull();
    expect(screen.getByRole('dialog', { name: 'The film' })).toBeInTheDocument();
  });
});

describe('the walk', () => {
  it('opens out into the grey hall: the iron floor, no candle, no pictures and no lines of the history', () => {
    const walk = walkNow({ pictures: ALL_PICTURES });
    expect(walk).toHaveClass('is-walk');
    expect(walk.querySelector('canvas.hos-walk-floor')).toBeInTheDocument();
    expect(walk.querySelector('.how-open')).toBeInTheDocument();
    expect(walk.querySelector('.hos-candle, video, img')).toBeNull();
    expect(walk.querySelector('[data-line]')).toBeNull();
    expect(walk).toHaveTextContent(WALK_BEGIN);
    expect(walk).not.toHaveTextContent(/candle/i);
    // The candle's files are gone.
    for (const f of ['candle.mp4', 'candle.webm', 'candle.jpg']) expect(fs.existsSync(path.join(process.cwd(), 'public', WALK_DIR, f))).toBe(false);
  });

  it('walks on by itself: a child’s name every two or three footfalls, coming toward the visitor and passing, never more than one arriving as one goes', () => {
    jest.useFakeTimers();
    walkNow();
    const seen = new Map<string, number>();
    for (let t = 0; t < 60_000; t += 250) {
      tick(250);
      const now = shownNames();
      expect(now.length).toBeLessThanOrEqual(2);
      if (now.length === 2) expect(full().querySelectorAll('.how-name.is-passing')).toHaveLength(1);
      for (const [id, at] of now) seen.set(id, at);
    }
    const ats = [...seen.values()].sort((a, b) => a - b);
    expect(ats[0]).toBe(FIRST_NAME_AT);
    expect(ats.length).toBeGreaterThan(10);
    for (let i = 1; i < ats.length; i++) expect(NAME_FEET).toContain(ats[i] - ats[i - 1]);
    // Each name is read out as it comes: name, age, the year and the place.
    const last = MANY.find((v) => v.id === [...seen.keys()].pop())!;
    expect(status()).toBe(victimText(last));
  });

  it('shows a name, age, year and place, styled apart: “Hana Brady, 13 · died 1944, Auschwitz”', () => {
    jest.useFakeTimers();
    const hana: Victim = { id: 'hana', name: 'Hana Brady', age: '13', died: '1944', place: 'Auschwitz', source: { label: 'USHMM Collections, Hana Brady (biography)', href: 'https://collections.ushmm.org/search/catalog/pa1164219' } };
    expect(victimText(hana)).toBe('Hana Brady, 13 · died 1944, Auschwitz');
    walkNow({ pool: [hana] });
    // One name to show: it comes on the second footfall, then no other.
    pass(3_500);
    const name = full().querySelector('[data-name="hana"]')!;
    expect(name.querySelector('.how-name-who')).toHaveTextContent('Hana Brady, 13');
    expect(name.querySelector('.how-name-death')).toHaveTextContent('died 1944, Auschwitz');
    expect(within(name as HTMLElement).queryByRole('link')).toBeNull();
  });

  it('lasts as long as the walk over the faces in the Memory Void, about a minute and a quarter, then closes quietly and invites the visitor to lay a stone', () => {
    jest.useFakeTimers();
    const walk = walkNow();
    expect(WALK_MS).toBe(75_000);
    pass(WALK_MS - 4000);
    expect(walk.querySelector('[data-end]')).toBeNull();
    pass(4000 + HESITATE_MS[1] + 100);
    expect(walk.querySelector('[data-end]')).toBeInTheDocument();
    expect(walk).toHaveTextContent(WALK_CLOSE);
    expect(status()).toBe(WALK_CLOSE);
    expect(walk.querySelector('[data-name]')).toBeNull();
    expect(within(walk).getByRole('link', { name: WALK_STONE_INVITE })).toHaveAttribute('href', '/exhibitions/holocaust/stones');
    expect(within(walk).queryByRole('button', { name: 'Pause' })).toBeNull();
    // The two ways on, side by side, at the close.
    const ways = walk.querySelector('[data-end] .hos-ways-on') as HTMLElement;
    expect(within(ways).getByRole('button', { name: 'Walk again' })).toBeInTheDocument();
    expect(within(ways).getByRole('link', { name: WALK_STONE_INVITE })).toBeInTheDocument();
    // Nothing more comes.
    const feet = shownNames().length;
    pass(30_000);
    expect(shownNames()).toHaveLength(feet);
    expect(within(walk).getByRole('button', { name: 'Walk again' })).toBeInTheDocument();
  });

  it('starts in the dark, walks into the light, and ends in the dark again', () => {
    expect(darkness(0)).toBeCloseTo(DARK_MOST);
    expect(darkness(0.1)).toBeGreaterThan(darkness(0.2));
    expect(darkness(0.5)).toBe(0);
    expect(darkness(0.8)).toBeLessThan(darkness(0.9));
    expect(darkness(1)).toBeCloseTo(DARK_MOST);
    expect(darkness(0.5, true)).toBe(DARK_MOST);
    jest.useFakeTimers();
    const walk = walkNow();
    const dark = () => Number(walk.querySelector('.how-hall')!.getAttribute('data-dark'));
    expect(dark()).toBeGreaterThan(0.9);
    pass(WALK_MS / 2);
    expect(dark()).toBe(0);
    pass(WALK_MS / 2 - 4000);
    expect(dark()).toBeGreaterThan(0.5);
    pass(4000 + HESITATE_MS[1] + 100);
    expect(dark()).toBeCloseTo(DARK_MOST);
  });

  it('walks again with different names, remembering in this browser the ones it has shown', () => {
    jest.useFakeTimers();
    const walk = walkNow();
    const first = new Set<string>();
    const collect = (into: Set<string>, ms: number) => {
      for (let t = 0; t < ms; t += 500) {
        tick(500);
        for (const [id] of shownNames()) into.add(id);
      }
    };
    collect(first, WALK_MS + 5000);
    expect(first.size).toBeGreaterThan(10);
    expect(first.size).toBeLessThanOrEqual(NAMES_PER_WALK);
    expect(JSON.parse(localStorage.getItem(SHOWN_KEY)!)).toEqual(expect.arrayContaining([...first]));
    fireEvent.click(within(walk).getByRole('button', { name: 'Walk again' }));
    expect(walk.querySelector('[data-end]')).toBeNull();
    const second = new Set<string>();
    collect(second, 60_000);
    expect(second.size).toBeGreaterThan(5);
    for (const id of second) expect(first.has(id)).toBe(false);
  });

  it('has Pause and Walk on, never a step button, when motion is allowed', () => {
    jest.useFakeTimers();
    const walk = walkNow();
    expect(within(walk).queryByRole('button', { name: 'Take a step' })).toBeNull();
    pass(8000);
    const before = shownNames().map(([id]) => id).join();
    fireEvent.click(within(walk).getByRole('button', { name: 'Pause' }));
    expect(status()).toBe('You pause.');
    pass(30_000);
    expect(shownNames().map(([id]) => id).join()).toBe(before);
    fireEvent.click(within(walk).getByRole('button', { name: 'Walk on' }));
    // Walking on at once: the next name may come with the first footfall, and is read out in its place.
    expect(within(walk).getByRole('button', { name: 'Pause' })).toBeInTheDocument();
    expect(['You walk on, slowly.', ...MANY.map(victimText)]).toContain(status());
  });

  it('steps unevenly: 1.15 to 1.75 seconds a footfall, and about one in seven a longer pause of 2.4 to 3.4', () => {
    expect(GAP_MS).toEqual([1150, 1750]);
    expect(HESITATE_MS).toEqual([2400, 3400]);
    expect(HESITATE_CHANCE).toBeCloseTo(1 / 7);
    expect(nextGap(0.5, 0)).toBe(1150);
    expect(nextGap(0.5, 1)).toBe(1750);
    expect(nextGap(0.1, 0)).toBe(2400);
    expect(nextGap(0.1, 1)).toBe(3400);
    // A name every two or three footfalls; with only a few to show, spread through the walk.
    expect(NAME_FEET).toEqual([2, 3]);
    expect(nameSpacing(NAMES_PER_WALK, 2)).toBe(2);
    expect(nameSpacing(NAMES_PER_WALK, 3)).toBe(3);
    expect(nameSpacing(7, 2)).toBeGreaterThan(4);
  });

  it('with reduced motion, is taken a step at a time, a name each step, then the close', () => {
    reducedMotion(true);
    jest.useFakeTimers();
    const pool = victims(5);
    const walk = walkNow({ pool });
    expect(walk).toHaveClass('is-still');
    expect(walk.querySelector('.how-open')).toBeNull();
    expect(walk).toHaveTextContent(WALK_BEGIN_STILL);
    expect(within(walk).queryByRole('button', { name: 'Pause' })).toBeNull();
    const seen: string[] = [];
    for (let i = 0; i < pool.length; i++) {
      fireEvent.click(within(walk).getByRole('button', { name: 'Take a step' }));
      const now = shownNames();
      expect(now).toHaveLength(1);
      seen.push(now[0][0]);
      expect(status()).toBe(victimText(pool.find((v) => v.id === now[0][0])!));
      // A step can't be hurried.
      fireEvent.click(within(walk).getByRole('button', { name: 'Take a step' }));
      expect(shownNames()[0][0]).toBe(now[0][0]);
      tick(400);
    }
    expect(new Set(seen).size).toBe(pool.length);
    fireEvent.click(within(walk).getByRole('button', { name: 'Take a step' }));
    expect(walk).toHaveTextContent(WALK_CLOSE);
    expect(within(walk).getByRole('link', { name: WALK_STONE_INVITE })).toBeInTheDocument();
    fireEvent.click(within(walk).getByRole('button', { name: 'Walk again' }));
    expect(walk).toHaveTextContent(WALK_BEGIN_STILL);
  });

  it('falls back to the seven children while victims.json is empty, with what is known of them', () => {
    reducedMotion(true);
    jest.useFakeTimers();
    const walk = walkNow({ pool: walkPool([]) });
    fireEvent.click(within(walk).getByRole('button', { name: 'Take a step' }));
    const [[id]] = shownNames();
    const child = WALK_NAMES.find((n) => n.id === id)!;
    expect(status()).toBe(`${child.name}, ${child.age}`);
    expect(full().querySelector('.how-name-death')).toBeNull();
  });

  it('lists the record of every name it has shown in the Sources drawer', () => {
    reducedMotion(true);
    jest.useFakeTimers();
    const walk = walkNow();
    for (let i = 0; i < 3; i++) {
      fireEvent.click(within(walk).getByRole('button', { name: 'Take a step' }));
      tick(400);
    }
    fireEvent.click(within(walk).getByRole('button', { name: 'Sources and credits' }));
    const drawer = within(walk).getByRole('dialog', { name: 'Sources and credits' });
    const names = within(drawer).getByRole('heading', { name: WALK_NAMES_HEADING }).closest('section')!;
    expect(within(names).getAllByRole('link')).toHaveLength(3);
    const v = MANY.find((x) => x.id === shownNames()[0][0])!;
    expect(within(names).getByRole('link', { name: v.source.label })).toHaveAttribute('href', v.source.href);
    expect(names).toHaveTextContent(victimText(v));
    expect(walkSourceGroups([v]).find((g) => g.title === WALK_NAMES_HEADING)!.items).toHaveLength(1);
  });

  it('starts its sound with the walk, from the press of Begin; turned off, it stays off when the visitor comes back', () => {
    const restore = fakeAudio();
    try {
      let walk = walkNow();
      let sound = within(walk).getByRole('button', { name: WALK_SOUND });
      expect(sound).toHaveAttribute('aria-pressed', 'true');
      fireEvent.click(sound);
      expect(sound).toHaveAttribute('aria-pressed', 'false');
      expect(status()).toBe('Sound off.');
      fireEvent.click(within(walk).getByRole('button', { name: 'Leave the walk' }));
      expect(screen.queryByRole('dialog')).toBeNull();
      fireEvent.click(screen.getByRole('button', { name: 'Begin' }));
      fireEvent.click(within(screen.getByRole('dialog', { name: 'The film' })).getByRole('button', { name: FILM_SKIP }));
      walk = intoTheWalk();
      sound = within(walk).getByRole('button', { name: WALK_SOUND });
      expect(sound).toHaveAttribute('aria-pressed', 'false');
      fireEvent.click(sound);
      expect(sound).toHaveAttribute('aria-pressed', 'true');
    } finally {
      restore();
    }
  });

  it('says so, and stays quiet, where the browser has no sound', () => {
    const walk = walkNow();
    const sound = within(walk).getByRole('button', { name: WALK_SOUND });
    expect(sound).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(sound);
    expect(sound).toHaveAttribute('aria-pressed', 'false');
    expect(status()).toBe('Sound is not available in this browser.');
  });

  it('is heard as nothing but the metal: no recording plays under the steps', () => {
    const restore = fakeAudio();
    const audio = jest.fn();
    const before = window.Audio;
    window.Audio = audio as unknown as typeof Audio;
    jest.useFakeTimers();
    try {
      walkNow({ sounds: { clanks: ['/exhibitions/holocaust/walk/sound/clank-01.mp3'], rattle: '/exhibitions/holocaust/walk/sound/rattle.mp3' } });
      pass(20_000);
      expect(audio).not.toHaveBeenCalled();
    } finally {
      window.Audio = before;
      restore();
    }
  });

  it('leaves with Escape or its button, back to the room', () => {
    const walk = walkNow();
    fireEvent.keyDown(walk, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.getByRole('button', { name: 'Begin' })).toHaveAttribute('aria-expanded', 'false');
  });

  it('has the film’s first picture, dim, behind the room, or the dark', () => {
    const { unmount } = render(<WalkRoom pictures={{ [WALK_LINES[0].slot]: 'walk-01.webp' }} />);
    expect(document.querySelector('.hos-walk-backdrop img')).toHaveAttribute('src', '/exhibitions/holocaust/walk/walk-01.webp');
    unmount();
    render(<WalkRoom />);
    expect(document.querySelector('.hos-walk-backdrop')).toBeInTheDocument();
    expect(document.querySelector('.hos-walk-backdrop img')).toBeNull();
  });
});

describe('the names', () => {
  it('reads victims.json, whatever it holds, keeping only records with an id, a name and a linked source, each once', () => {
    expect(Array.isArray(VICTIMS)).toBe(true);
    for (const v of VICTIMS) {
      expect(v.id).toBeTruthy();
      expect(v.name).toBeTruthy();
      expect(v.source.href).toMatch(/^https?:\/\//);
    }
    expect(new Set(VICTIMS.map((v) => v.id)).size).toBe(VICTIMS.length);
    expect(readVictims(null)).toEqual([]);
    expect(
      readVictims([
        { id: 'a', name: 'Ada', age: 9, died: 1943, place: 'Sobibor', source: { label: 'Record', href: 'https://example.org/a' } },
        { id: 'a', name: 'Twice', source: { label: 'Record', href: 'https://example.org/a2' } },
        { id: 'b', name: '', source: { label: 'Record', href: 'https://example.org/b' } },
        { id: 'c', name: 'No source' },
        { id: 'd', name: 'Not a link', source: { label: 'Record', href: 'somewhere' } },
        { id: 'e', name: 'Eli', source: { label: 'Record', href: 'https://example.org/e' } },
      ]),
    ).toEqual([
      { id: 'a', name: 'Ada', age: '9', died: '1943', place: 'Sobibor', source: { label: 'Record', href: 'https://example.org/a' } },
      { id: 'e', name: 'Eli', age: null, died: null, place: null, source: { label: 'Record', href: 'https://example.org/e' } },
    ]);
  });

  it('falls back to the seven children, name and age, while the file is empty', () => {
    expect(walkPool([])).toBe(FALLBACK_VICTIMS);
    expect(walkPool(MANY)).toBe(MANY);
    expect(FALLBACK_VICTIMS.map(victimText)).toEqual(['Henoch Kornfeld, 3', 'Tomas Kulka, 7', 'Hana Brady, 13', 'Zigmond Adler, 7', 'Judith Schwed, 12', 'Settela Steinbach, 9', 'Anne Frank, 15']);
    expect(walkPool()).toBe(VICTIMS.length ? VICTIMS : FALLBACK_VICTIMS);
    expect(victimText({ ...MANY[0], died: '1942', place: null })).toBe('Child 1, 3 · died 1942');
    expect(victimText({ ...MANY[0], died: null, place: 'Treblinka' })).toBe('Child 1, 3 · died in Treblinka');
    expect(victimText({ ...MANY[0], age: null, died: null, place: null })).toBe('Child 1');
  });

  it('are real children, each with their own record at the USHMM or the HMD Trust', () => {
    expect(WALK_NAMES).toHaveLength(7);
    expect(new Set(WALK_NAMES.map((n) => n.source.href)).size).toBe(7);
    for (const n of WALK_NAMES) {
      expect(n.source.href).toMatch(/^https:\/\/(encyclopedia\.ushmm\.org\/content\/en\/id-card\/|collections\.ushmm\.org\/search\/catalog\/|(www\.)?hmd\.org\.uk\/resource\/)/);
      expect(Number(n.age)).toBeLessThan(18);
    }
  });

  it('draws a fresh set each walk, avoiding names already shown, and starts again when they run out', () => {
    const pool = victims(10);
    const ids = (vs: Victim[]) => vs.map((v) => v.id);
    const a = drawWalkNames(pool, 4, []);
    expect(a.names).toHaveLength(4);
    const b = drawWalkNames(pool, 4, a.shown);
    for (const id of ids(b.names)) expect(ids(a.names)).not.toContain(id);
    expect(b.shown).toHaveLength(8);
    // Two left unshown: those two first, then the list again, without repeating within the walk.
    const c = drawWalkNames(pool, 4, b.shown);
    const left = ids(pool).filter((id) => !b.shown.includes(id));
    expect(ids(c.names).slice(0, 2).sort()).toEqual(left.sort());
    expect(new Set(ids(c.names)).size).toBe(4);
    expect(c.shown).toEqual(ids(c.names));
    // Never more than the list holds, each once.
    expect(drawWalkNames(pool, 50, []).names).toHaveLength(10);
    // Ids no longer in the list are forgotten.
    expect(drawWalkNames(pool, 1, ['gone']).shown).not.toContain('gone');
  });

  it('shows the children who died at Lety in fair proportion, about one name in ten, though they are many in the list', () => {
    const child = (i: number, place: string): Victim => ({ id: `x-${i}`, name: `Child ${i}`, age: '9', died: '1943', place, source: { label: 'Record', href: 'https://example.org/' } });
    const pool = [...Array.from({ length: 60 }, (_, i) => child(i, 'Lety')), ...Array.from({ length: 60 }, (_, i) => child(100 + i, 'Auschwitz'))];
    const { names } = drawWalkNames(pool, 40, []);
    expect(names).toHaveLength(40);
    expect(names.filter((v) => v.place === 'Lety')).toHaveLength(Math.round(40 * LETY_SHARE));
    // With no one else left, they are still shown.
    expect(drawWalkNames(pool.slice(0, 60), 10, []).names).toHaveLength(10);
  });

  it('keeps going where there is no storage', () => {
    const spy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    const set = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    try {
      reducedMotion(true);
      const walk = walkNow();
      fireEvent.click(within(walk).getByRole('button', { name: 'Take a step' }));
      expect(shownNames()).toHaveLength(1);
    } finally {
      spy.mockRestore();
      set.mockRestore();
    }
  });
});

describe('the film’s lines and slots', () => {
  it('has short lines, in the order of the history, building step by step to the toll, each with a source, a picture slot and a part', () => {
    expect(WALK_LINES.map((l) => l.id)).toEqual(Array.from({ length: WALK_LINES.length }, (_, i) => `W${i + 1}`));
    // The owner's film script (November 4, 2026), row for row: 38 lines of the history.
    expect(WALK_LINES).toHaveLength(38);
    for (const l of WALK_LINES) {
      expect(l.sources.length).toBeGreaterThan(0);
      // From Yad Vashem, the USHMM or the HMD Trust; Heine's words, from the Jewish Review of Books.
      for (const s of l.sources) expect(s.href).toMatch(/^https:\/\/(encyclopedia\.ushmm\.org|collections\.ushmm\.org|www\.ushmm\.org|(www\.)?hmd\.org\.uk|www\.yadvashem\.org|jewishreviewofbooks\.com)\//);
      expect(l.slot).toMatch(/^w\d\d-[a-z-]+$/);
      expect(PLACEHOLDERS).toContain(l.placeholder);
      expect(l.text.split(/\s+/).length).toBeLessThanOrEqual(30);
    }
    // A slot to each line, each with its own number; the owner's 32 pictures keep theirs.
    expect(new Set(WALK_LINES.map((l) => l.slot)).size).toBe(WALK_LINES.length);
    expect(new Set(WALK_LINES.map((l) => slotNumber(l.slot))).size).toBe(WALK_LINES.length);
    expect(WALK_LINES.find((l) => l.text.includes('synagogues'))!.text).toBe('November 9–10, 1938. Nazis burned more than 1,400 synagogues and smashed thousands of Jewish shops.');
    const years = WALK_LINES.map((l) => l.text.match(/\b(19[2-4]\d)\b/)?.[1]).filter(Boolean).map(Number);
    expect(years).toEqual([...years].sort((x, y) => x - y));
    expect(years[0]).toBe(1929);
    expect(WALK_LINES[2].text).toMatch(/^In 1933/);
    // The steps, in their order: the first camp, the books, the laws, Kristallnacht, the war, Wannsee, the killing centers, the uprising, Hungary, the death marches, the toll.
    const at = (re: RegExp) => WALK_LINES.findIndex((l) => re.test(l.text));
    const steps = [/Dachau/, /books into bonfires/, /could not be citizens/, /synagogues/, /invaded Poland/, /Wannsee/, /killing centers/, /Warsaw ghetto\.$/, /Hungary/, /could not keep walking/, /^Six million/];
    const where = steps.map(at);
    expect(where.every((i) => i >= 0)).toBe(true);
    expect(where).toEqual([...where].sort((x, y) => x - y));
    // The rows the owner deleted from her script are gone, and her rewordings are in.
    for (const gone of [/^It was not enough\.$/, /later learned that their parents/, /One in every three/, /83,000/, /2\.7 million/, /1\.5 million/, /Treblinka and Sobibor, prisoners/, /Killing squads/]) expect(at(gone)).toBe(-1);
    expect(WALK_LINES[at(/Kindertransport|10,000 children/)].text).toBe('From December 1938, about 10,000 children were sent alone to Britain to find safety. Their parents could not come.');
    expect(WALK_LINES[at(/a star on their clothes/)].text).toBe('In Germany, from 1941, every Jew aged six or older was forced to wear a star on their clothes.');
    expect(WALK_LINES[at(/behind a bookcase/)].text).toBe('In Amsterdam, July 6, 1942. The Frank family went into hiding, behind a bookcase.');
    expect(WALK_LINES.map((l) => l.image.replace(/\(no [^)]*\)/, '')).join(' ')).not.toMatch(/\b(person|people|child|man|woman|face|body|victim)\b/i);
    const parts = WALK_LINES.map((l) => l.part);
    expect(parts).toEqual([...parts].sort((x, y) => ['before', 'during', 'after'].indexOf(x) - ['before', 'during', 'after'].indexOf(y)));
    expect(parts.filter((p) => p === 'before')).toHaveLength(3);
    // The film carries them all, in order, after its opening words.
    expect(FILM_FRAMES.flatMap((f) => (f.kind === 'line' ? [f.line.id] : []))).toEqual(WALK_LINES.map((l) => l.id));
    expect(FILM_FRAMES.slice(0, FILM_OPENING.length).every((f) => f.kind === 'words')).toBe(true);
  });

  it('opens with a few plain words, for children, with nothing graphic, and leaves the toll for the end', () => {
    expect(FILM_OPENING.length).toBeGreaterThanOrEqual(2);
    expect(FILM_OPENING.length).toBeLessThanOrEqual(5);
    const words = FILM_OPENING.map((o) => o.text).join(' ');
    expect(words).toMatch(/step by step/);
    expect(words).not.toMatch(/six million/i);
    expect(words).not.toMatch(/\b(gas|gassed|corpse|bodies|blood|burned alive|shot)\b/i);
    expect(WALK_LINES.slice(-5).some((l) => /^Six million/.test(l.text))).toBe(true);
  });

  it('stands in with silhouettes of the agreed objects only, until the owner’s pictures come', () => {
    expect([...SILHOUETTE_KINDS].sort()).toEqual([...PLACEHOLDERS].sort());
  });

  it('finds the owner’s files when the page is built: her pictures, the 14 clanks, the rattle, and the film’s music if it is there', () => {
    const onDisk = walkSlotsOnDisk();
    // Every line has its picture: the owner's own, and, for the slots added when the film was rebuilt, a credited photograph.
    expect(Object.keys(onDisk.pictures).sort()).toEqual(WALK_LINES.map((l) => l.slot).sort());
    for (const l of WALK_LINES) {
      if (slotNumber(l.slot) <= 32) expect(FILM_PICTURE_CREDITS[l.slot]).toBeUndefined();
      else expect(FILM_PICTURE_CREDITS[l.slot]).toEqual(expect.objectContaining({ href: expect.stringMatching(/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/), label: expect.stringMatching(/, via Wikimedia Commons$/) }));
    }
    expect(onDisk.pictures['w07-broken-window']).toBe('walk-07.webp');
    expect(onDisk.sounds.clanks).toHaveLength(14);
    expect(onDisk.sounds.clanks[0]).toBe('/exhibitions/holocaust/walk/sound/clank-01.mp3');
    expect(onDisk.sounds.rattle).toBe('/exhibitions/holocaust/walk/sound/rattle.mp3');
    expect(MUSIC_SRC).toBe('/exhibitions/holocaust/walk/film-music.mp3');
    expect(onDisk.music).toBe(fs.existsSync(path.join(process.cwd(), 'public', MUSIC_SRC)) ? MUSIC_SRC : null);
    expect(slotFiles('w07-broken-window')).toEqual(['w07-broken-window.webp', 'w07-broken-window.jpg', 'walk-07.jpg', 'walk-07.webp', 'walk-07.png']);
  });
});

describe('the walk’s hall: grey concrete, pale light, the iron floor, the sound', () => {
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
    expect(new Set(faces.map((f) => Math.round(f.outline[0][0] * 100))).size).toBeGreaterThan(20);
    for (const row of rows) for (let i = 1; i < row.length; i++) expect(row[i].z).toBeLessThanOrEqual(row[i - 1].z);
    expect(hash2(3, 4)).toBe(hash2(3, 4));
  });

  it('sees the floor ahead in perspective, in an even, pale light that never falls to dark, lost far off in a grey haze', () => {
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
    // Even: as light far off as near, a little less under the walls; no candle's pool.
    expect(lightAt(0, 12)).toBeCloseTo(lightAt(0, 3));
    expect(lightAt(0, 3)).toBeGreaterThan(0.6);
    expect(lightAt(2.5, 3)).toBeLessThan(lightAt(0, 3));
    expect(lightAt(2.5, 3)).toBeGreaterThan(0.6);
    // The haze grows with distance.
    expect(hazeAt(0)).toBe(0);
    expect(hazeAt(3)).toBeLessThan(hazeAt(12));
    expect(hazeAt(12)).toBeLessThan(1);
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
    for (const r of PLATE.slice(1)) expect(Math.abs(r - Math.round(r))).toBeGreaterThan(0.05);
    expect(WALK_SOUND).toBe('Hear your steps');
  });
});

afterAll(() => cleanup());
