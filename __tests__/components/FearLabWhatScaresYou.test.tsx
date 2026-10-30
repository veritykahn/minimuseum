import { act, fireEvent, render, screen, within } from '@testing-library/react';
import WhatScaresYou from '@/app/exhibitions/fear-lab/what-scares-you/page';
import WhatScaresYouLab from '@/app/exhibitions/fear-lab/what-scares-you/WhatScaresYouLab';
import FearBoxes, { BUILD_MS, CLOSE_MS, HARMLESS_MS, SURPRISE_MS, outMs, said } from '@/app/exhibitions/fear-lab/what-scares-you/FearBoxes';
import {
  BOX_COUNT,
  CONTENTS,
  CREATURES,
  MOST_SCARES_IN_A_ROW,
  drawOpening,
  scareStreak,
  type Content,
} from '@/app/exhibitions/fear-lab/what-scares-you/boxes';
import { SURPRISES } from '@/app/exhibitions/fear-lab/what-scares-you/surprises';
import { CLUE_MS, CLUE_TEXT, DECIDE_MS, REVEAL_MS } from '@/app/exhibitions/fear-lab/what-scares-you/RustlingBushes';
import { CHOICES, QUESTION_MS } from '@/app/exhibitions/fear-lab/what-scares-you/KnownOrUnknown';
import { ROUNDS, TIGERS, TIGER_CLUES, makeLayout, makeRounds, paceFor, pulseFromTaps, tally, type Call } from '@/app/exhibitions/fear-lab/what-scares-you/lab';
import { makeSwarm, spiderCount, swarmLength } from '@/app/exhibitions/fear-lab/what-scares-you/spiderPaths';
import { ANIMATION_SLOTS, SLOT_FILES, SOUND_SLOTS, soundUrl } from '@/app/exhibitions/fear-lab/what-scares-you/assets';
import { assetsOnDisk } from '@/app/exhibitions/fear-lab/what-scares-you/assetSlots';
import { creatureSlot, type LabSound } from '@/app/exhibitions/fear-lab/what-scares-you/sound';
import { FEAR_LAB, FEAR_LAB_COPY } from '@/app/exhibitions/fear-lab/fearLab';
import { getLevelConfig } from '@/components/museum-map/data/levels';
import { getRoomByPath } from '@/components/museum-map/data/rooms';

/*
 * What Scares You?: the lab's arithmetic, the fear boxes (with their
 * warning first, and what is inside drawn by chance as each lid opens),
 * known or unknown, the rustling bushes (with its warning first), and the
 * wiring.
 */

// Animation frames run on the fake clock, a frame every 16 ms.
beforeEach(() => {
  jest.useFakeTimers();
  jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => setTimeout(() => cb(performance.now()), 16) as unknown as number);
  jest.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) => clearTimeout(id));
  // jsdom has no canvas: the heart monitor draws nothing.
  jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
});
afterEach(() => {
  window.localStorage.clear();
  jest.useRealTimers();
  jest.restoreAllMocks();
});

/** A scripted chance: these numbers in turn, then the last one again. */
const seq = (...xs: number[]) => {
  let i = 0;
  return jest.fn(() => xs[Math.min(i++, xs.length - 1)]);
};
/** A small seeded random, for long runs of draws. */
const seeded = (seed: number) => () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};
/** Chances that draw a scare (the first creature), or a given surprise. */
const SCARE = [0.01, 0.01];
const surpriseDraw = (k: number) => [0.99, 0.01, (k + 0.5) / SURPRISES.length];

describe('the lab’s arithmetic', () => {
  it('reads a pulse from five or more steady taps, and ignores a long pause', () => {
    expect(pulseFromTaps([0, 800, 1600, 2400])).toBeNull();
    expect(pulseFromTaps([0, 800, 1600, 2400, 3200])).toBe(75);
    expect(pulseFromTaps([0, 1000, 2000, 9000, 9500, 10000, 10500, 11000])).toBe(120);
    expect(pulseFromTaps([0, 700, 1400, 1450, 2100, 2800])).toBe(86);
  });

  it('hides three tigers in eight rounds, and tallies the calls', () => {
    const rounds = makeRounds();
    expect(rounds).toHaveLength(ROUNDS);
    expect(rounds.filter((r) => r.tiger)).toHaveLength(TIGERS);
    const calls = rounds.map((_, i): Call => (i % 2 ? 'tiger' : 'wind'));
    const t = tally(rounds, calls);
    expect(t.fakeAlarms + t.missed + t.spotted + t.calm).toBe(ROUNDS);
    expect(tally([{ bush: 0, tiger: false, spot: 0, clue: 'leaves' }, { bush: 1, tiger: true, spot: 0, clue: 'tail' }], ['tiger', 'wind'])).toEqual({ fakeAlarms: 1, missed: 1, spotted: 0, calm: 0 });
  });

  it('quickens the monitor with fright', () => {
    expect(paceFor(1)).toBeGreaterThan(paceFor(0));
    expect(paceFor(5)).toBe(paceFor(1));
  });
});

describe('what is in a box: drawn by chance as its lid opens', () => {
  it('can be a scare or something harmless, from the same chance, injectably', () => {
    const scare = drawOpening([], false, seq(...SCARE));
    expect(scare.kind).toBe('creature');
    expect(scare).toBe(CREATURES[0]);
    SURPRISES.forEach((s, k) => expect(drawOpening([], false, seq(...surpriseDraw(k)))).toEqual({ kind: 'surprise', id: s.id }));
    expect(drawOpening([], false, seq(0.99, 0.75))).toEqual({ kind: 'pinecone' });
    expect(drawOpening([], false, seq(0.99, 0.95))).toEqual({ kind: 'nothing' });
    // Fourteen things can come out: six creatures, six surprises, the pinecone and nothing.
    expect(CONTENTS).toHaveLength(14);
  });

  it('is about even, mostly harmless in gentle mode, and never more than three scares in a row (two in gentle mode)', () => {
    for (const gentle of [false, true]) {
      const rand = seeded(gentle ? 7 : 3);
      const history: Content[] = [];
      for (let k = 0; k < 4000; k++) history.push(drawOpening(history, gentle, rand));
      const share = history.filter((c) => c.kind === 'creature').length / history.length;
      const [low, high] = gentle ? [0.18, 0.3] : [0.4, 0.55];
      expect(share).toBeGreaterThan(low);
      expect(share).toBeLessThan(high);
      let run = 0;
      let longest = 0;
      history.forEach((c) => {
        run = c.kind === 'creature' ? run + 1 : 0;
        longest = Math.max(longest, run);
      });
      expect(longest).toBeLessThanOrEqual(MOST_SCARES_IN_A_ROW[gentle ? 'gentle' : 'normal']);
      // Every surprise, and every creature, turns up.
      for (const s of SURPRISES) expect(history.some((c) => c.kind === 'surprise' && c.id === s.id)).toBe(true);
      for (const c of CREATURES) expect(history).toContain(c);
    }
    // However the chance falls, gentle mode lets no third scare through.
    const always = () => 0;
    const h: Content[] = [];
    for (let k = 0; k < 9; k++) h.push(drawOpening(h, true, always));
    expect(h.map((c) => c.kind === 'creature')).toEqual([true, true, false, true, true, false, true, true, false]);
    expect(scareStreak(h.slice(0, 2))).toBe(2);
  });

  it('does not bring back a creature or surprise seen in the last few openings', () => {
    const first = drawOpening([], false, seq(...SCARE));
    expect(drawOpening([first], false, seq(...SCARE))).not.toBe(first);
    const slime: Content = { kind: 'surprise', id: 'slime' };
    expect(drawOpening([slime], false, seq(...surpriseDraw(0)))).not.toEqual(slime);
  });
});

/** A sound that only notes what it was asked to play. */
const fakeSound = () => {
  const played: string[] = [];
  const s: LabSound = { beat: () => {}, tension: () => {}, play: (slot) => void played.push(slot), wind: () => {}, setGentle: () => {}, close: () => {} };
  return { s, played };
};

function renderBoxes({ rand, motion = true, gentle = false, owned = [] as string[] }: { rand: () => number; motion?: boolean; gentle?: boolean; owned?: string[] }) {
  const { s, played } = fakeSound();
  const utils = render(
    <div className="fl-room">
      <FearBoxes motion={motion} gentle={gentle} soundOn onSoundOn={() => {}} sound={() => s} onFright={() => {}} rand={rand} owned={owned} />
    </div>,
  );
  fireEvent.click(screen.getByRole('button', { name: 'I’m ready' }));
  // Only what the boxes play from here on.
  played.length = 0;
  const shelf = screen.getByRole('group', { name: 'Fear boxes' });
  const open =(n: number) => fireEvent.click(within(shelf).getByRole('button', { name: `Box ${n}` }));
  return { ...utils, played, shelf, open };
}

describe('the fear boxes', () => {
  it('gives every creature a checked fact with a source, and a credited photograph', () => {
    expect(CREATURES.map((c) => c.id)).toEqual(['cockroach', 'tarantula', 'bat', 'snake', 'rat', 'centipede']);
    for (const c of CREATURES) {
      expect(c.fact.text.length).toBeGreaterThan(20);
      expect(c.fact.sources.length).toBeGreaterThan(0);
      c.fact.sources.forEach((src) => expect(src.href).toMatch(/^https:\/\//));
      expect(c.credit.href).toMatch(/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/);
      expect(c.credit.licence).toMatch(/^(CC0|CC BY 4\.0|CC BY-SA [234]\.0)$/);
      expect(c.src).toMatch(/^\/exhibitions\/fear-lab\/creatures\/.+\.webp$/);
    }
  });

  it('asks for sound and warns first, then darkens the screen, creaks the lid open, and shows what was inside', () => {
    const rand = seq(...SCARE);
    render(<WhatScaresYouLab rand={rand} />);
    expect(screen.getByRole('note')).toHaveTextContent('Startle warning.');
    expect(screen.getByRole('note')).toHaveTextContent('chance decides what comes out');
    expect(screen.getByText(FEAR_LAB_COPY.box)).toBeInTheDocument();
    expect(screen.getByText('Turn the sound on first.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Turn sound on' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'I’m ready' }));
    const shelf = screen.getByRole('group', { name: 'Fear boxes' });
    expect(within(shelf).getAllByRole('button')).toHaveLength(BOX_COUNT);
    // Nothing is decided until a lid opens.
    expect(rand).not.toHaveBeenCalled();

    const i = 2;
    const c = CREATURES[0];
    fireEvent.click(within(shelf).getByRole('button', { name: `Box ${i + 1}` }));
    expect(rand).toHaveBeenCalled();
    // The whole screen goes dark, and the skip button takes focus.
    expect(document.querySelector('.fl-fb-dark')).toHaveAttribute('data-stage', 'build');
    expect(screen.getByRole('button', { name: /Skip/ })).toHaveFocus();
    expect(screen.getByRole('status')).toHaveTextContent(`Box ${i + 1} creaks open`);
    // Other boxes wait while one opens.
    fireEvent.click(within(shelf).getByRole('button', { name: `Box ${((i + 1) % BOX_COUNT) + 1}` }));
    expect(screen.getByRole('status')).toHaveTextContent(`Box ${i + 1} creaks open`);

    // Then the spiders: lots of them, across the screen.
    act(() => { jest.advanceTimersByTime(BUILD_MS); });
    expect(document.querySelector('.fl-fb-dark')).toHaveAttribute('data-stage', 'out');
    expect(document.querySelectorAll('[data-spider]')).toHaveLength(spiderCount(window.innerWidth, window.innerHeight, false));
    expect(document.querySelector('.fl-sp-cartoon')).toBeNull();
    expect(document.querySelector('.fl-su')).toBeNull();

    // Then the lights come up on the creature, with its fact and its source.
    act(() => { jest.advanceTimersByTime(outMs(c, false, false)); });
    expect(document.querySelector('.fl-fb-dark')).toBeNull();
    expect(screen.getByRole('heading', { level: 2, name: c.name })).toBeInTheDocument();
    expect(screen.getByText(c.fact.text)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: c.alt })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: c.credit.licence })).toBeInTheDocument();
    const box = within(shelf).getByRole('button', { name: `Box ${i + 1}, opened: ${said(c)}` });
    expect(box).toHaveAttribute('data-open', 'true');

    // Closing the box shuts its lid on the shelf.
    fireEvent.click(screen.getByRole('button', { name: 'Close the box' }));
    expect(box).toHaveAttribute('data-closing', 'true');
    act(() => { jest.advanceTimersByTime(CLOSE_MS); });
    expect(box).not.toHaveAttribute('data-open');
    expect(box).toHaveAttribute('data-done', 'true');
    expect(box).toHaveAttribute('aria-disabled', 'true');
  });

  it('draws again at every opening, so the same box can hold a scare one time and something silly the next', () => {
    const scary = renderBoxes({ rand: seq(...SCARE) });
    scary.open(1);
    act(() => { jest.advanceTimersByTime(BUILD_MS); });
    expect(document.querySelectorAll('[data-spider]').length).toBeGreaterThan(0);
    scary.unmount();
    const silly = renderBoxes({ rand: seq(...surpriseDraw(0)) });
    silly.open(1);
    act(() => { jest.advanceTimersByTime(BUILD_MS); });
    expect(document.querySelectorAll('[data-spider]')).toHaveLength(0);
    expect(document.querySelector('.fl-su[data-id="slime"]')).toBeInTheDocument();
  });

  it.each(SURPRISES.map((s, k) => [s.id, s, k] as const))('bursts out something silly (%s) with its own sound and a friendly line', (_, s, k) => {
    const { played, shelf, open } = renderBoxes({ rand: seq(...surpriseDraw(k)) });
    open(4);
    expect(played).toEqual(['creak']);
    act(() => { jest.advanceTimersByTime(BUILD_MS); });
    // No spiders, no stinger: the surprise itself, drawn, across the screen.
    expect(document.querySelectorAll('[data-spider]')).toHaveLength(0);
    expect(played).not.toContain('scary');
    const burst = document.querySelector(`.fl-su[data-id="${s.id}"]`);
    expect(burst).toBeInTheDocument();
    expect(burst).not.toHaveAttribute('data-still');
    expect(burst!.querySelector('.fl-su-burst')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent(s.out);
    act(() => { jest.advanceTimersByTime(s.soundAt ?? 0); });
    expect(played).toEqual(['creak', s.sound]);
    act(() => { jest.advanceTimersByTime(SURPRISE_MS - (s.soundAt ?? 0)); });
    // The lights come up on it, with its line.
    expect(document.querySelector('.fl-fb-dark')).toBeNull();
    expect(screen.getByRole('heading', { level: 2, name: s.name })).toBeInTheDocument();
    expect(screen.getByText(s.line)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: s.alt })).toBeInTheDocument();
    // Closed, the box says what was inside.
    fireEvent.click(screen.getByRole('button', { name: 'Close the box' }));
    act(() => { jest.advanceTimersByTime(CLOSE_MS); });
    const box = within(shelf).getByRole('button', { name: `Box 4, opened: ${s.label}` });
    expect(box).toHaveAttribute('data-done', 'true');
    expect(box.querySelector('.fl-fb-done')).toHaveTextContent(s.label);
  });

  it('with motion off, a surprise is a still picture fading in: nothing splats, drips or flies', () => {
    const { played, open } = renderBoxes({ rand: seq(...surpriseDraw(0)), motion: false });
    open(2);
    act(() => { jest.advanceTimersByTime(BUILD_MS); });
    const burst = document.querySelector('.fl-su[data-id="slime"]');
    expect(burst).toHaveAttribute('data-still', 'true');
    expect(document.querySelector('.fl-su-burst, .fl-su-splat, .fl-su-drip')).toBeNull();
    expect(burst!.querySelector('.fl-su-art')).toHaveAttribute('aria-label', SURPRISES[0].alt);
    // Its sound plays at once, with nothing to wait for.
    expect(played).toContain('slime');
    act(() => { jest.advanceTimersByTime(outMs({ kind: 'surprise', id: 'slime' }, false, true)); });
    expect(document.querySelector('.fl-fb-dark')).toBeNull();
    expect(screen.getByRole('heading', { level: 2, name: SURPRISES[0].name })).toBeInTheDocument();
  });

  it('plays the owner’s slime animation, if she has dropped one in', () => {
    const { open } = renderBoxes({ rand: seq(...surpriseDraw(0)), owned: [ANIMATION_SLOTS.slime.file] });
    open(1);
    act(() => { jest.advanceTimersByTime(BUILD_MS); });
    expect(document.querySelector('.fl-su video')).toHaveAttribute('src', '/exhibitions/fear-lab/animations/slime.webm');
  });

  it('skips a surprise with Escape, and the close button takes focus', () => {
    const { open } = renderBoxes({ rand: seq(...surpriseDraw(2)) });
    open(3);
    act(() => { jest.advanceTimersByTime(BUILD_MS); });
    expect(screen.getByRole('button', { name: /Skip/ })).toHaveFocus();
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(document.querySelector('.fl-fb-dark')).toBeNull();
    expect(screen.getByRole('heading', { level: 2, name: SURPRISES[2].name })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close the box' })).toHaveFocus();
  });

  it('brings the pinecone or nothing out, with no spiders', () => {
    for (const [r, heading] of [[0.75, 'Just a pinecone'], [0.95, 'Nothing']] as const) {
      const { open, unmount } = renderBoxes({ rand: seq(0.99, r) });
      open(1);
      act(() => { jest.advanceTimersByTime(BUILD_MS); });
      expect(document.querySelectorAll('[data-spider]')).toHaveLength(0);
      expect(document.querySelector('.fl-fb-gift')).toBeInTheDocument();
      act(() => { jest.advanceTimersByTime(HARMLESS_MS); });
      expect(screen.getByRole('heading', { level: 2, name: heading })).toBeInTheDocument();
      unmount();
    }
  });

  it('has a gentle mode with a few cartoon spiders, and Escape turns the lights back on', () => {
    render(<WhatScaresYouLab rand={seq(...SCARE)} />);
    const gentle = screen.getByRole('button', { name: /Gentle/ });
    expect(gentle).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(gentle);
    expect(gentle).toHaveAttribute('aria-pressed', 'true');
    // Remembered on this device.
    expect(window.localStorage.getItem('fl-lab-gentle')).toBe('on');
    expect(screen.getByRole('note')).toHaveTextContent('Gentle mode is on.');
    expect(screen.getByRole('note')).toHaveTextContent('Mostly it’s something silly');
    fireEvent.click(screen.getByRole('button', { name: 'I’m ready' }));
    fireEvent.click(within(screen.getByRole('group', { name: 'Fear boxes' })).getByRole('button', { name: 'Box 1' }));
    act(() => { jest.advanceTimersByTime(BUILD_MS); });
    expect(document.querySelectorAll('[data-spider]')).toHaveLength(spiderCount(window.innerWidth, window.innerHeight, true));
    expect(document.querySelectorAll('.fl-sp-cartoon').length).toBeGreaterThan(0);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(document.querySelector('.fl-fb-dark')).toBeNull();
    expect(screen.getByRole('button', { name: 'Close the box' })).toHaveFocus();
  });

  it('in gentle mode, lets no third scare in a row out of the boxes', () => {
    const { open } = renderBoxes({ rand: () => 0, gentle: true });
    const kinds: boolean[] = [];
    for (let n = 1; n <= 3; n++) {
      open(n);
      act(() => { jest.advanceTimersByTime(BUILD_MS); });
      kinds.push(document.querySelectorAll('[data-spider]').length > 0);
      fireEvent.keyDown(window, { key: 'Escape' });
      fireEvent.click(screen.getByRole('button', { name: 'Close the box' }));
      act(() => { jest.advanceTimersByTime(CLOSE_MS); });
    }
    expect(kinds).toEqual([true, true, false]);
  });

  it('with motion off, the spiders fade where they are instead of crawling', () => {
    render(<WhatScaresYouLab rand={seq(...SCARE)} />);
    fireEvent.click(screen.getByRole('button', { name: /Motion/ }));
    fireEvent.click(screen.getByRole('button', { name: 'I’m ready' }));
    fireEvent.click(within(screen.getByRole('group', { name: 'Fear boxes' })).getByRole('button', { name: 'Box 1' }));
    act(() => { jest.advanceTimersByTime(BUILD_MS); });
    expect(document.querySelector('.fl-sw')).toHaveAttribute('data-still', 'true');
    act(() => { jest.advanceTimersByTime(outMs(CREATURES[0], false, true)); });
    expect(document.querySelector('.fl-fb-dark')).toBeNull();
  });
});

describe('the spiders’ paths', () => {
  it('sends lots and lots out on a big screen, fewer on a phone, ten in gentle mode', () => {
    expect(spiderCount(1280, 800, false)).toBeGreaterThan(80);
    expect(spiderCount(390, 844, false)).toBeGreaterThanOrEqual(30);
    expect(spiderCount(390, 844, false)).toBeLessThan(spiderCount(1280, 800, false));
    expect(spiderCount(1280, 800, true)).toBe(10);
  });

  it('starts each spider at the box and ends it off the screen, turning smoothly, within the swarm’s time', () => {
    for (const gentle of [false, true]) {
      const paths = makeSwarm({ width: 1280, height: 800, origin: { x: 640, y: 400 }, gentle });
      // Varied: not all on the same line, nor the same speed.
      expect(new Set(paths.map((p) => p.duration)).size).toBeGreaterThan(1);
      expect(new Set(paths.map((p) => p.steps.length)).size).toBeGreaterThanOrEqual(1);
      for (const p of paths) {
        const first = p.steps[0];
        const last = p.steps[p.steps.length - 1];
        expect(Math.hypot(first.x - 640, first.y - 400)).toBeLessThan(40);
        expect(last.x < 0 || last.x > 1280 || last.y < 0 || last.y > 800).toBe(true);
        p.steps.slice(1).forEach((s, k) => expect(Math.abs(s.turn - p.steps[k].turn)).toBeLessThanOrEqual(180));
        expect(p.delay + p.duration).toBeLessThanOrEqual(swarmLength(gentle) + 1);
      }
    }
    // Gentle spiders are slower.
    const slow = makeSwarm({ width: 1280, height: 800, origin: { x: 640, y: 400 }, gentle: true });
    const fast = makeSwarm({ width: 1280, height: 800, origin: { x: 640, y: 400 }, gentle: false });
    expect(Math.min(...slow.map((p) => p.duration))).toBeGreaterThan(Math.max(...fast.map((p) => p.duration)));
  });
});


describe('the drop-in slots', () => {
  it('names a file under the room’s folder for every sound and animation', () => {
    for (const [slot, s] of Object.entries(SOUND_SLOTS)) {
      expect(s.file).toMatch(/^sounds\/[a-z-]+\.mp3$/);
      expect(soundUrl(slot as keyof typeof SOUND_SLOTS)).toBe(`/exhibitions/fear-lab/${s.file}`);
      expect(s.use.length).toBeGreaterThan(10);
    }
    for (const a of Object.values(ANIMATION_SLOTS)) expect(a.file).toMatch(/^animations\/[a-z-]+\.webm$/);
    // Every effect an answer can have is a sound slot, and every creature has one.
    CHOICES.forEach((c) => [c.a, c.b].forEach((o) => expect(SOUND_SLOTS[o.effect]).toBeDefined()));
    CREATURES.forEach((c) => expect(SOUND_SLOTS[creatureSlot(c.id)]).toBeDefined());
  });

  it('has a slot for every silly surprise’s sound, and for the owner’s slime animation', () => {
    expect(SURPRISES.map((s) => SOUND_SLOTS[s.sound].file)).toEqual([
      'sounds/slime.mp3',
      'sounds/confetti.mp3',
      'sounds/boing.mp3',
      'sounds/squeak.mp3',
      'sounds/bubbles.mp3',
      'sounds/feather.mp3',
    ]);
    expect(ANIMATION_SLOTS.slime.file).toBe('animations/slime.webm');
    expect(ANIMATION_SLOTS.slime.use).toMatch(/transparent/);
    expect(SLOT_FILES).toEqual(expect.arrayContaining(['sounds/slime.mp3', 'sounds/squeak.mp3', 'animations/slime.webm']));
  });

  it('looks on disk when the page is built, and asks for no file that is not there', () => {
    expect(assetsOnDisk()).toEqual([]);
    const fetchSpy = jest.fn();
    (global as unknown as { fetch: unknown }).fetch = fetchSpy;
    render(<WhatScaresYou />);
    fireEvent.click(screen.getByRole('button', { name: 'I’m ready' }));
    expect(fetchSpy).not.toHaveBeenCalled();
    delete (global as unknown as { fetch?: unknown }).fetch;
  });
});

describe('known or unknown', () => {
  it('puts the question at the top, with a countdown ring, and shows what people did after each choice', () => {
    render(<WhatScaresYou />);
    fireEvent.click(screen.getByRole('tab', { name: 'Known or Unknown?' }));
    expect(screen.getByRole('button', { name: 'Turn sound on' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Start' }));
    CHOICES.forEach((c, i) => {
      const q = screen.getByRole('heading', { level: 2, name: c.question });
      const options = screen.getByRole('group', { name: new RegExp(`Question ${i + 1} of`) });
      // The question comes before the choices.
      expect(q.compareDocumentPosition(options) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
      expect(screen.getByRole('timer')).toHaveAccessibleName(`${QUESTION_MS / 1000} seconds left`);
      const b = screen.getByRole('button', { name: new RegExp(c.b.text.replace(/[.?]/g, '.')) });
      fireEvent.click(b);
      expect(b).toHaveAttribute('data-effect', c.b.effect);
      if (c.poster) expect(screen.getByText(c.poster)).toBeInTheDocument();
      else {
        expect(screen.getByText(c.fact!.text)).toBeInTheDocument();
        expect(screen.getByText(c.fact!.text).closest('[data-fact="approved"]')).toBeInTheDocument();
      }
      fireEvent.click(screen.getByRole('button', { name: i + 1 < CHOICES.length ? 'Next question' : 'See your choices' }));
    });
    expect(screen.getByRole('list', { name: 'Your choices' }).children).toHaveLength(CHOICES.length);
  });

  it('runs out of time, unless a teacher pauses it', () => {
    render(<WhatScaresYou />);
    fireEvent.click(screen.getByRole('tab', { name: 'Known or Unknown?' }));
    fireEvent.click(screen.getByRole('button', { name: 'Start' }));
    act(() => { jest.advanceTimersByTime(5000); });
    expect(screen.getByRole('timer')).toHaveAccessibleName(`${QUESTION_MS / 1000 - 5} seconds left`);
    const pause = screen.getByRole('button', { name: 'Pause timer' });
    fireEvent.click(pause);
    act(() => { jest.advanceTimersByTime(QUESTION_MS); });
    expect(screen.getByRole('timer')).toHaveAccessibleName(/Timer paused, 15 seconds left/);
    fireEvent.click(screen.getByRole('button', { name: 'Resume timer' }));
    act(() => { jest.advanceTimersByTime(QUESTION_MS); });
    expect(screen.getByRole('status')).toHaveTextContent('Time’s up!');
    expect(screen.getByText(CHOICES[0].poster!)).toBeInTheDocument();
  });

  it('gives every new question a sourced museum note, and the shock a zap', () => {
    expect(CHOICES.length).toBeGreaterThanOrEqual(6);
    CHOICES.filter((c) => !c.poster).forEach((c) => {
      expect(c.fact!.sources.length).toBeGreaterThan(0);
      c.fact!.sources.forEach((s) => expect(s.href).toMatch(/^https:\/\//));
    });
    expect(CHOICES[0].a.effect).toBe('zap');
    expect(CHOICES[1].a.effect).toBe('big-zap');
  });
});

describe('the rustling bushes', () => {
  it('warns before it starts, then plays eight rounds and tallies them', () => {
    render(<WhatScaresYou />);
    fireEvent.click(screen.getByRole('tab', { name: 'The Rustling Bushes' }));
    expect(screen.getByRole('note')).toHaveTextContent('Eyes will appear suddenly');
    expect(screen.queryByRole('button', { name: 'Tiger! Run!' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'I’m ready' }));
    expect(screen.getByRole('status')).toHaveTextContent('Round 1 of 8');
    // A clue appears in the rustling bush, a moment after it starts.
    expect(document.querySelector('.fl-bush[data-rustling] .fl-clue')).toBeNull();
    act(() => { jest.advanceTimersByTime(CLUE_MS); });
    fireEvent.click(screen.getByRole('button', { name: 'Tiger! Run!' }));
    expect(screen.getByRole('status')).toHaveTextContent('The clue:');
    act(() => { jest.advanceTimersByTime(REVEAL_MS); });
    // Not answering is staying put.
    for (let r = 1; r < ROUNDS; r++) {
      act(() => { jest.advanceTimersByTime(DECIDE_MS); });
      act(() => { jest.advanceTimersByTime(REVEAL_MS); });
    }
    expect(screen.getByText(FEAR_LAB_COPY.byDesign)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Play again' })).toBeInTheDocument();
  });

  it('can take the timer away, so a class can guess first', () => {
    render(<WhatScaresYou />);
    fireEvent.click(screen.getByRole('tab', { name: 'The Rustling Bushes' }));
    const guess = screen.getByRole('button', { name: /Guess first/ });
    fireEvent.click(guess);
    expect(guess).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(screen.getByRole('button', { name: 'I’m ready' }));
    act(() => { jest.advanceTimersByTime(DECIDE_MS * 3); });
    expect(screen.getByRole('status')).toHaveTextContent('Round 1 of 8. A bush rustles.');
    // The clue still comes, with no clock running (a wind round may, by chance, have none to show).
    expect(document.querySelector('.fl-bush[data-rustling]')).toBeInTheDocument();
    expect(screen.getByText(/No timer. Look for a clue/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Just the wind' }));
    expect(screen.getByRole('status')).toHaveTextContent('The clue:');
  });

  it('gives each tiger a different clue, moves the rustle about, and rearranges the bushes', () => {
    for (let k = 0; k < 30; k++) {
      const rounds = makeRounds();
      const tigerClues = rounds.filter((r) => r.tiger).map((r) => r.clue);
      expect(new Set(tigerClues).size).toBe(TIGERS);
      tigerClues.forEach((c) => expect(TIGER_CLUES).toContain(c));
      rounds.filter((r) => !r.tiger).forEach((r) => expect(['leaves', 'none']).toContain(r.clue));
      rounds.forEach((r) => expect(Math.abs(r.spot)).toBeLessThanOrEqual(1));
      rounds.slice(1).forEach((r, i) => expect(r.bush).not.toBe(rounds[i].bush));
    }
    const a = makeLayout(() => 0.1);
    const b = makeLayout(() => 0.9);
    expect(a).toHaveLength(5);
    expect(a.map((p) => p.x)).not.toEqual(b.map((p) => p.x));
    a.slice(1).forEach((p, i) => expect(p.x).toBeGreaterThan(a[i].x));
    expect(Object.keys(CLUE_TEXT).sort()).toEqual([...TIGER_CLUES, 'leaves', 'none'].sort());
  });

  it('keeps sound off until asked, and lets motion be switched off', () => {
    render(<WhatScaresYou />);
    expect(screen.getByRole('button', { name: /^Sound/ })).toHaveAttribute('aria-pressed', 'false');
    const motion = screen.getByRole('button', { name: /Motion/ });
    expect(motion).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(motion);
    expect(motion).toHaveAttribute('aria-pressed', 'false');
  });
});

describe('wiring', () => {
  it('sets the room on the landing page, the map and the projector', () => {
    expect(FEAR_LAB.interactives?.map((c) => c.href)).toEqual(['/exhibitions/fear-lab/what-scares-you']);
    // The card shows the room itself: a screenshot, with no illustration's credit.
    expect(FEAR_LAB.interactives?.[0].image).toEqual({ src: '/exhibitions/fear-lab/rooms/what-scares-you.webp', alt: expect.stringMatching(/^The What Scares You\? room/) });
    expect(FEAR_LAB.projector.links.map((l) => l.href)).toEqual(['/exhibitions/fear-lab/what-scares-you']);
    expect(getRoomByPath('/exhibitions/fear-lab/what-scares-you')?.id).toBe('fl-what-scares-you');
    expect(getLevelConfig('/exhibitions/fear-lab/what-scares-you').title).toBe('The Fear Lab');
  });
});
