import { act, fireEvent, render, screen, within } from '@testing-library/react';
import MoonMicroscope from '@/app/exhibitions/moon/microscope/page';
import { TIMES } from '@/app/exhibitions/moon/microscope/Eyepiece';
import { blurFor, FOCUS_AT, FOCUS_START, FOCUS_STEP, SHARP_WITHIN } from '@/app/exhibitions/moon/microscope/focus';
import { PRACTICE } from '@/app/exhibitions/moon/microscope/practice';
import { EARTH_SLIDES, MOON_SLIDES } from '@/app/exhibitions/moon/microscope/slides';
import { atEdge, CENTRE, clampPan, nudge, OBJECTIVES, totalPower, visibleFraction } from '@/app/exhibitions/moon/microscope/stage';
import { brushAside, changed, cleanness, lamp, lift, newBrush, newMask, paintClean, settleGrains, smudgedGlass, type Pixels } from '@/app/exhibitions/moon/microscope/wipe';
import { MICROSCOPE_NOTES, MOON, MOON_CASE, REGOLITH } from '@/app/exhibitions/moon/moon';
import { getLevelConfig } from '@/components/museum-map/data/levels';
import { getRoomByPath } from '@/components/museum-map/data/rooms';

/*
 * Under the Microscope: the photographs and their captions and credits, the
 * cloth that wipes them, the lenses, the stage and the focus, the room's
 * step-by-step procedure (wipe a fresh slide, place a sample from the tray,
 * focus, magnify, move the slide, compare), and its wiring.
 */

// jsdom has no canvas: the eyepiece draws nothing.
beforeAll(() => {
  jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
});
afterAll(() => jest.restoreAllMocks());

/** Reduced motion (or not): every step at once, so the procedure can be walked without waiting. */
const motion = (reduce: boolean) => {
  const mm = window.matchMedia;
  window.matchMedia = jest.fn().mockImplementation((q: string) => ({
    matches: reduce && q.includes('reduce'),
    media: q,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
  }));
  return () => (window.matchMedia = mm);
};

const room = () => {
  const view = render(<MoonMicroscope />);
  const eyepiece = view.container.querySelector('.mo-ms-eyepiece') as HTMLElement;
  const canvas = view.container.querySelector('canvas') as HTMLCanvasElement;
  const status = () => screen.getByRole('status');
  const button = (name: string | RegExp) => screen.getByRole('button', { name });
  const blurPx = () => {
    const m = /blur\(([\d.]+)px\)/.exec(canvas.style.filter);
    return m ? Number(m[1]) : 0;
  };
  /** Wipe the fresh slide, open the tray and choose a jar. */
  const prepare = (jar: string | RegExp) => {
    fireEvent.click(button('Wipe'));
    fireEvent.click(button('Place sample'));
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: jar }));
  };
  /** Turn the focus knob up until the view is sharp. */
  const focusUp = () => {
    for (let i = 0; i < 40 && blurPx() > 0; i++) fireEvent.click(button('Turn the focus knob up'));
  };
  const currentStep = () => view.container.querySelector('[aria-current="step"]')?.textContent;
  /** Open the room's Sources drawer: every source and credit, by step. */
  const sources = () => {
    if (!screen.queryByRole('dialog', { name: 'Sources and credits' })) fireEvent.click(button('Sources and credits'));
    return screen.getByRole('dialog', { name: 'Sources and credits' });
  };
  return { ...view, eyepiece, canvas, status, button, blurPx, prepare, focusUp, currentStep, sources };
};

describe('the photographs', () => {
  it('has three of Moon dust and one for each of the poster’s three words, each named, captioned from its record and credited', () => {
    expect(MOON_SLIDES.map((s) => s.label)).toEqual(['Soil', 'Glass beads', 'Orange glass']);
    expect(EARTH_SLIDES.map((s) => s.label)).toEqual(['Wind', 'Water', 'Living things']);
    expect([...MOON_SLIDES, ...EARTH_SLIDES].map((s) => s.name)).toEqual([
      'Far-side Moon soil',
      'Apollo 17 glass beads',
      'Apollo 17 orange glass',
      'Gobi Desert sand',
      'Vistula River sand',
      'Bermuda coral sand',
    ]);
    for (const s of [...MOON_SLIDES, ...EARTH_SLIDES]) {
      expect(s.src).toMatch(/^\/exhibitions\/moon\/microscope\/.+\.jpg$/);
      expect(s.caption.sources.length).toBeGreaterThan(0);
      expect(s.credit.href).toMatch(/^https:\/\/(commons\.wikimedia\.org|images\.nasa\.gov)\//);
      if (s.credit.author === 'NASA') expect(s.credit.licence).toBe('Public domain');
      else expect(s.credit.licenceHref).toMatch(/creativecommons\.org/);
    }
  });

  it('shows only real lunar soil on the Moon slides, each from a lunar-sample record', () => {
    // The owner's check: every Moon slide is a photomicrograph of lunar regolith, not a stand-in.
    expect(MOON_SLIDES.map((s) => s.credit.href)).toEqual([
      'https://commons.wikimedia.org/wiki/File:Chang%27e-6_lunar_regolith_under_stereomicroscope.jpg',
      'https://commons.wikimedia.org/wiki/File:S73-15083.jpg',
      'https://images.nasa.gov/details/S73-15171',
    ]);
    expect(JSON.stringify(MOON_SLIDES)).not.toMatch(/S70-2041|impact/i);
    for (const s of MOON_SLIDES) expect(s.caption.text).toMatch(/soil|Apollo 17/i);
    expect(MOON_SLIDES[0].caption.sources.map((x) => x.href)).toContain('https://doi.org/10.1093/nsr/nwae328');
    expect(MOON_SLIDES[0].credit).toMatchObject({ licence: 'CC BY 4.0', licenceHref: 'https://creativecommons.org/licenses/by/4.0/' });
  });
});

describe('the cloth', () => {
  /** A little photo: pale glass with dark grains in a regular pattern. */
  const slide = (): Pixels => {
    const width = 120;
    const height = 120;
    const data = new Uint8ClampedArray(width * height * 4);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const grain = x % 20 < 8 && y % 20 < 8;
        data.set(grain ? [40, 36, 44, 255] : [230, 228, 236, 255], (y * width + x) * 4);
      }
    }
    return { data, width, height };
  };

  it('lifts Moon dust off the glass onto the cloth, which grays as the dust clings to it', () => {
    const px = slide();
    const before = px.data.slice();
    const b = newBrush(10);
    for (let pass = 0; pass < 3; pass++) for (let x = 10; x <= 110; x += 2) lift(px, b, x, 60);
    expect(b.dust).toBeGreaterThan(0);
    for (const x of [24, 44, 64, 84]) expect(Math.abs(px.data[(60 * px.width + x) * 4] - lamp(x, 60, px.width, px.height)[0])).toBeLessThan(12);
    const mean = b.rgb.reduce((s, v) => s + v, 0) / b.rgb.length;
    expect(mean).toBeLessThan(238);
    expect(changed(before.subarray(0, 40 * 120 * 4), px.data.subarray(0, 40 * 120 * 4))).toBe(0);
  });

  it('knows a clean slide when it sees one, all over or in the part in view', () => {
    const px = slide();
    expect(cleanness(px, 1)).toBeLessThan(0.9);
    // Only the clean glass between two rows of grains.
    expect(cleanness(px, 1, { x0: 30, x1: 90, y0: 9, y1: 19 })).toBe(1);
    paintClean(px);
    expect(cleanness(px, 1)).toBe(1);
  });

  it('makes a fresh slide a little dirty, with dust, smudges and a fingerprint the cloth can wipe off', () => {
    const px = smudgedGlass(160);
    expect(smudgedGlass(160).data).toEqual(px.data);
    // Mostly glass, but dirty: worst in the middle, where the fingerprint is.
    const mid = { x0: 40, x1: 120, y0: 40, y1: 120 };
    expect(cleanness(px, 1)).toBeLessThan(0.9);
    expect(cleanness(px, 1, mid)).toBeLessThan(0.75);
    // The fingerprint's ridges: dark and light rings across its middle.
    const row = Array.from({ length: 30 }, (_, i) => px.data[(74 * 160 + 70 + i) * 4]);
    expect(Math.max(...row) - Math.min(...row)).toBeGreaterThan(30);
    // The cloth wipes it all back to lamp-lit glass.
    const b = newBrush(14);
    for (let pass = 0; pass < 3; pass++) for (let y = 0; y <= 160; y += 8) for (let x = 0; x <= 160; x += 3) lift(px, b, x, y);
    expect(cleanness(px, 1)).toBeGreaterThan(0.99);
  });

  it('tips a sample onto the slide as grains that cover all of it, the middle first', () => {
    const grains = settleGrains();
    expect(grains.length).toBeGreaterThan(100);
    expect(settleGrains()).toEqual(grains);
    for (let y = 0.02; y < 1; y += 0.05) {
      for (let x = 0.02; x < 1; x += 0.05) expect(grains.some((g) => Math.hypot(g.x - x, g.y - y) <= g.r)).toBe(true);
    }
    const near = grains.filter((g) => Math.hypot(g.x - 0.5, g.y - 0.5) < 0.15);
    const far = grains.filter((g) => Math.hypot(g.x - 0.5, g.y - 0.5) > 0.6);
    const mean = (gs: typeof grains) => gs.reduce((s, g) => s + g.delay, 0) / gs.length;
    expect(mean(near)).toBeLessThan(mean(far));
  });

  it('pushes Earth grains aside, leaving a lamp-lit lane of glass with soft edges', () => {
    const px = slide();
    const mask = newMask(px);
    const before = px.data.slice();
    let moved = 0;
    for (let x = 10; x < 110; x += 2) moved += brushAside(px, mask, x, 60, x + 2, 60, 14);
    expect(moved).toBeGreaterThan(0);
    expect(changed(before, px.data)).toBeGreaterThan(500);
    const at = (x: number, y: number) => px.data[(y * px.width + x) * 4];
    for (const x of [44, 46, 64]) expect(Math.abs(at(x, 60) - lamp(x, 60, px.width, px.height)[0])).toBeLessThan(30);
    const clear = [0, 2, 4, 6, 8, 10, 12].map((d) => mask[(60 + d) * px.width + 64]);
    for (let i = 1; i < clear.length; i++) expect(clear[i]).toBeLessThanOrEqual(clear[i - 1]);
    expect(clear[0]).toBeGreaterThan(200);
    expect(clear.some((c) => c > 20 && c < 200)).toBe(true);
  });

  it('keeps to its own side of the line, side by side', () => {
    const px = slide();
    const before = px.data.slice();
    brushAside(px, newMask(px), 50, 60, 70, 60, 14, { x0: 60, x1: Infinity });
    lift(px, newBrush(14), 60, 60, { x0: 60, x1: Infinity });
    for (let y = 0; y < px.height; y++) {
      for (let x = 0; x < 60; x++) {
        const k = (y * px.width + x) * 4;
        expect(px.data[k]).toBe(before[k]);
      }
    }
  });
});

describe('the lenses, the stage and the focus', () => {
  it('has a 4×, 10× and 40× objective under a 10× eyepiece: 40×, 100× and 400× in all, each showing less of the slide', () => {
    expect(OBJECTIVES.map((o) => o.lens)).toEqual([4, 10, 40]);
    expect([0, 1, 2].map(totalPower)).toEqual([40, 100, 400]);
    expect(visibleFraction(0)).toBeGreaterThan(visibleFraction(1));
    expect(visibleFraction(1)).toBeGreaterThan(visibleFraction(2));
    expect(visibleFraction(0)).toBeLessThan(1);
  });

  it('keeps the view on the slide: moving the stage stops at its edges, nearer them the stronger the lens', () => {
    for (const o of [0, 1, 2]) {
      const h = visibleFraction(o) / 2;
      expect(clampPan({ x: -5, y: 9 }, o)).toEqual({ x: h, y: 1 - h });
      let p = CENTRE;
      for (let i = 0; i < 20; i++) p = nudge(p, 1, -1, o);
      expect(p.x).toBeCloseTo(h);
      expect(p.y).toBeCloseTo(1 - h);
      // Moved right and up as far as it goes: it can go no further right or up, but can come back.
      expect(atEdge(p, o)).toEqual({ left: false, right: true, up: true, down: false });
    }
    // At 40× the view can go further toward the edge than at 4×.
    expect(clampPan({ x: 0, y: 0 }, 2).x).toBeLessThan(clampPan({ x: 0, y: 0 }, 0).x);
  });

  it('is sharp only near the mark for each lens; a new lens leaves it a little blurry', () => {
    FOCUS_AT.forEach((at, o) => {
      expect(blurFor(at, o)).toBe(0);
      expect(blurFor(at + 20, o)).toBeGreaterThan(5);
    });
    expect(blurFor(FOCUS_START, 0)).toBeGreaterThan(8);
    // A press is big (8 or more), but no wider than the sharp zone: it can't jump right over it.
    expect(FOCUS_STEP).toBeGreaterThanOrEqual(8);
    expect(FOCUS_STEP).toBeLessThanOrEqual(SHARP_WITHIN * 2);
    // From the start, three presses bring the 4× lens sharp; after a lens change, one or two.
    let at = FOCUS_START;
    let presses = 0;
    while (blurFor(at, 0) > 0) (at += FOCUS_STEP), presses++;
    expect(presses).toBeLessThanOrEqual(3);
    for (const [from, to] of [[0, 1], [1, 2], [0, 2]]) {
      let f = FOCUS_AT[from];
      let n = 0;
      while (blurFor(f, to) > 0 && n < 10) (f += FOCUS_STEP), n++;
      expect(n).toBeLessThanOrEqual(2);
    }
    // Switching lens from sharp: blurry, but only a little (a small turn sharpens it).
    for (const [from, to] of [[0, 1], [1, 2], [0, 2], [2, 0]]) {
      const b = blurFor(FOCUS_AT[from], to);
      expect(b).toBeGreaterThan(0.5);
      expect(b).toBeLessThan(4);
    }
  });
});

describe('the procedure', () => {
  let undo: () => void;
  beforeEach(() => {
    undo = motion(true);
    window.history.replaceState(null, '', '/exhibitions/moon/microscope');
  });
  afterEach(() => undo());

  it('starts with a fresh slide on the stage that is a little dirty, and says to wipe it first', () => {
    const r = room();
    expect(r.eyepiece).toHaveAttribute('data-slots', 'smudged');
    expect(screen.getByRole('img', { name: /fresh glass slide.*smudged with dust and a fingerprint/ })).toBeInTheDocument();
    expect(r.currentStep()).toMatch(/Wipe the slide/);
    expect(screen.getByRole('heading', { name: 'A fresh slide' })).toBeInTheDocument();
    expect(screen.getByText(/This fresh slide is smudged/)).toBeInTheDocument();
    // Why: a microscope maker's tip, with its source.
    expect(screen.getByText(PRACTICE.wipe.text)).toBeInTheDocument();
    // Its source is in the Sources drawer, under the step, not on the page.
    expect(screen.queryByRole('link', { name: 'Olympus, Cleaning and Maintenance' })).toBeNull();
    const drawer = r.sources();
    expect(within(drawer).getByRole('heading', { name: 'Wipe the slide' })).toBeInTheDocument();
    expect(within(drawer).getByRole('link', { name: 'Olympus, Cleaning and Maintenance' })).toHaveAttribute('href', PRACTICE.wipe.sources[0].href);
    // No sample tabs or chips at the top.
    expect(screen.queryByRole('tab')).toBeNull();
    expect(screen.queryByRole('tablist')).toBeNull();
  });

  it('says plainly that the views are photographs, which the lens buttons zoom', () => {
    room();
    expect(screen.getByText('These are photographs taken through real microscopes; the lens buttons zoom the photo.')).toBeInTheDocument();
  });

  it('reminds you to wipe the slide before placing a sample, and does not open the tray', () => {
    const r = room();
    fireEvent.click(r.button('Place sample'));
    expect(r.status()).toHaveTextContent('The slide’s smudged. Wipe it first!');
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(r.eyepiece).toHaveAttribute('data-slots', 'smudged');

    fireEvent.click(r.button('Wipe'));
    expect(r.eyepiece).toHaveAttribute('data-slots', 'clean');
    expect(r.status()).toHaveTextContent('The smudges are gone. The slide is clean.');
    expect(r.currentStep()).toMatch(/Place a sample/);
    expect(r.button('Place sample')).toHaveClass('mo-ms-button-next');
    fireEvent.click(r.button('Wipe'));
    expect(r.status()).toHaveTextContent('The slide is already clean.');
  });

  it('opens a tray of labelled Moon and Earth sample jars, and puts the chosen one on the slide', () => {
    const r = room();
    fireEvent.click(r.button('Wipe'));
    fireEvent.click(r.button('Place sample'));
    const tray = screen.getByRole('dialog', { name: 'Choose a sample' });
    expect(within(tray).getByRole('heading', { name: /Moon dust/ })).toBeInTheDocument();
    expect(within(tray).getByRole('heading', { name: /Earth’s soil/ })).toBeInTheDocument();
    const jars = [...tray.querySelectorAll('.mo-ms-jar')].map((j) => j.textContent);
    expect(jars).toEqual([
      'Far-side Moon soil',
      'Apollo 17 glass beads',
      'Apollo 17 orange glass',
      'Gobi Desert sandshaped by wind',
      'Vistula River sandshaped by water',
      'Bermuda coral sandshaped by living things',
    ]);
    // The first jar takes the keyboard; Escape puts the tray away.
    expect(document.activeElement).toBe(tray.querySelector('.mo-ms-jar'));
    fireEvent.keyDown(tray, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();

    fireEvent.click(r.button('Place sample'));
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Apollo 17 glass beads' }));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(r.eyepiece).toHaveAttribute('data-slots', 'moon-beads');
    expect(screen.getByRole('img', { name: MOON_SLIDES[1].alt })).toBeInTheDocument();
    expect(r.status()).toHaveTextContent('The Apollo 17 glass beads is on the slide.');
    expect(r.currentStep()).toMatch(/Focus/);

    // A sample on it already: wipe it off or take a fresh slide first.
    fireEvent.click(r.button('Place sample'));
    expect(r.status()).toHaveTextContent('There’s a sample on this slide already.');
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('sets the chosen sample’s name and caption in the description panel, not under the eyepiece, its source and credit in the drawer', () => {
    const r = room();
    r.prepare('Bermuda coral sand shaped by living things');
    const panel = r.container.querySelector('.mo-ms-panel') as HTMLElement;
    const s = EARTH_SLIDES[2];
    expect(within(panel).getByRole('heading', { level: 2, name: s.name })).toBeInTheDocument();
    expect(within(panel).getByText(s.caption.text)).toBeInTheDocument();
    expect(within(panel).queryByRole('link', { name: s.caption.sources[0].label })).toBeNull();
    expect(within(panel).queryByText(/^Photo:/)).toBeNull();
    const drawer = r.sources();
    expect(within(drawer).getAllByRole('link', { name: s.caption.sources[0].label }).map((a) => a.getAttribute('href'))).toContain(s.caption.sources[0].href);
    expect(within(drawer).getByRole('link', { name: `${s.credit.title}, ${s.credit.author}` })).toHaveAttribute('href', s.credit.href);
    expect(within(drawer).getAllByRole('link', { name: s.credit.licence }).map((a) => a.getAttribute('href'))).toContain(s.credit.licenceHref);
    fireEvent.keyDown(window, { key: 'Escape' });
    // Its poster word marked in poster 1's sentence.
    expect(within(panel).getByText('living things', { selector: 'mark' })).toBeInTheDocument();
    // Nothing under the eyepiece but what to do next.
    const scope = r.container.querySelector('.mo-ms-scope') as HTMLElement;
    expect(within(scope).queryByText(s.caption.text)).toBeNull();
    expect(within(scope).queryByRole('link')).toBeNull();
  });

  it('starts the sample blurred, and the focus knob sharpens it to no blur at all', () => {
    const r = room();
    // Nothing on the slide: nothing to focus.
    fireEvent.click(r.button('Turn the focus knob up'));
    expect(r.status()).toHaveTextContent('Nothing to focus on yet. Place a sample first.');
    r.prepare('Far-side Moon soil');
    const knob = screen.getByRole('slider', { name: 'Focus knob' });
    expect(knob).toHaveAttribute('aria-valuetext', 'Blurry');
    expect(r.blurPx()).toBeGreaterThan(8);
    // The knob turns with the arrow keys too.
    const before = r.blurPx();
    fireEvent.keyDown(knob, { key: 'ArrowUp' });
    expect(r.blurPx()).toBeLessThan(before);
    r.focusUp();
    expect(r.canvas.style.filter).toBe('none');
    expect(Math.abs(Number(knob.getAttribute('aria-valuenow')) - FOCUS_AT[0])).toBeLessThanOrEqual(SHARP_WITHIN);
    expect(knob).toHaveAttribute('aria-valuetext', 'Sharp');
    expect(r.status()).toHaveTextContent('Sharp! Well focused.');
    expect(r.currentStep()).toMatch(/Magnify/);
    // Too far: blurry again.
    for (let i = 0; i < 5; i++) fireEvent.click(r.button('Turn the focus knob up'));
    expect(r.blurPx()).toBeGreaterThan(0);
  });

  it('switches objective lenses on the nosepiece: more magnification, and a little blur to refocus', () => {
    const r = room();
    r.prepare('Apollo 17 orange glass');
    // Skipping focus: a friendly reminder.
    fireEvent.click(r.button('40× objective lens: 400× in all'));
    expect(r.status()).toHaveTextContent('Remember to focus with the 4× lens first');
    fireEvent.click(r.button('4× objective lens: 40× in all'));
    r.focusUp();
    expect(screen.getByText(/10× eyepiece × 4× lens =/)).toHaveTextContent('= 40×');

    fireEvent.click(r.button('10× objective lens: 100× in all'));
    expect(r.button('10× objective lens: 100× in all')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText(/10× eyepiece × 10× lens =/)).toHaveTextContent('= 100×');
    expect(r.status()).toHaveTextContent('Click! The 10× lens: 100× in all.');
    expect(r.blurPx()).toBeGreaterThan(0);
    expect(r.blurPx()).toBeLessThan(4);
    expect(r.currentStep()).toMatch(/Explore/);
    expect(screen.getByText('A little blurry: turn the focus knob a touch.')).toBeInTheDocument();
    // The tip: lenses are made to stay nearly in focus, with its source.
    expect(screen.getByText(PRACTICE.parfocal.text)).toBeInTheDocument();
    r.focusUp();
    expect(r.blurPx()).toBe(0);
    expect(r.status()).toHaveTextContent('Sharp at 100×.');

    fireEvent.click(r.button('40× objective lens: 400× in all'));
    expect(screen.getByText(/10× eyepiece × 40× lens =/)).toHaveTextContent('= 400×');
    expect(r.blurPx()).toBeGreaterThan(0);
    expect(r.blurPx()).toBeLessThan(4);
  });

  it('moves the slide on the stage with the stage buttons, the arrow keys and a drag, and stops at its edges', () => {
    const r = room();
    r.prepare('Gobi Desert sand shaped by wind');
    const pan = () => r.eyepiece.getAttribute('data-pan')!.split(' ').map(Number);
    expect(pan()).toEqual([0.5, 0.5]);
    // At 4×, the slide moves only a little before its edge.
    for (let i = 0; i < 10; i++) fireEvent.click(r.button('Move the slide left'));
    const h4 = visibleFraction(0) / 2;
    expect(pan()[0]).toBeCloseTo(1 - h4, 3);
    expect(r.button('Move the slide left')).toHaveAttribute('aria-disabled', 'true');
    // At 40×, less is in view, and it can travel further.
    r.focusUp();
    fireEvent.click(r.button('40× objective lens: 400× in all'));
    for (let i = 0; i < 10; i++) fireEvent.click(r.button('Move the slide left'));
    const h40 = visibleFraction(2) / 2;
    expect(pan()[0]).toBeCloseTo(1 - h40, 3);
    // Arrow keys on the view.
    fireEvent.keyDown(r.eyepiece, { key: 'ArrowRight' });
    expect(pan()[0]).toBeCloseTo(1 - h40 - visibleFraction(2) / 4, 3);
    for (let i = 0; i < 10; i++) fireEvent.keyDown(r.eyepiece, { key: 'ArrowDown' });
    expect(pan()[1]).toBeCloseTo(h40, 3);
    // The middle button brings it back.
    fireEvent.click(r.button('Move the slide back to the middle'));
    expect(pan()).toEqual([0.5, 0.5]);
    // With a sample on, dragging moves the slide; a long drag stops at the edge.
    expect(r.button('Drag to move')).toHaveAttribute('aria-pressed', 'true');
    const pointer = (type: string, clientX: number, clientY: number) => fireEvent(r.canvas, new MouseEvent(type, { bubbles: true, clientX, clientY }));
    pointer('pointerdown', 0, 0);
    pointer('pointermove', 5000, 5000);
    pointer('pointerup', 5000, 5000);
    expect(pan()[0]).toBeCloseTo(h40, 3);
    expect(pan()[1]).toBeCloseTo(h40, 3);
    // Changing to a weaker lens keeps the view on the slide.
    fireEvent.click(r.button('4× objective lens: 40× in all'));
    expect(pan()[0]).toBeCloseTo(h4, 3);
  });

  it('compares the sample with one from the other world, side by side, and goes back to one slide', () => {
    const r = room();
    r.prepare('Apollo 17 glass beads');
    r.focusUp();
    fireEvent.click(r.button('Compare with Earth’s soil'));
    const tray = screen.getByRole('dialog', { name: 'Choose a sample to compare' });
    expect(within(tray).queryByRole('heading', { name: /Moon dust/ })).toBeNull();
    fireEvent.click(within(tray).getByRole('button', { name: /Vistula River sand/ }));
    expect(r.eyepiece).toHaveAttribute('data-slots', 'moon-beads earth-water');
    expect(screen.getByRole('slider', { name: 'Move the dividing line' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Moon and Earth' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: MOON_SLIDES[1].name })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: EARTH_SLIDES[1].name })).toBeInTheDocument();
    expect(screen.getByText(EARTH_SLIDES[1].caption.text)).toBeInTheDocument();
    expect(screen.getByText(`${REGOLITH.surface} ${REGOLITH.differences}`)).toBeInTheDocument();
    // Wiping both: Moon dust clings, Earth grains brush aside.
    fireEvent.click(r.button('Wipe'));
    expect(r.status()).toHaveTextContent('The Moon dust clings to the cloth. The Earth grains brush aside.');
    expect(r.eyepiece).toHaveAttribute('data-slots', 'clean clean');
    expect(screen.getByText(REGOLITH.gunpowder)).toBeInTheDocument();
    fireEvent.click(r.button('Fresh slide'));
    expect(r.eyepiece).toHaveAttribute('data-slots', 'smudged');
    expect(r.status()).toHaveTextContent('A fresh slide from the box. Look closely: it’s smudged.');
    expect(r.currentStep()).toMatch(/Wipe the slide/);
  });

  it('goes back to one slide when asked', () => {
    const r = room();
    r.prepare('Gobi Desert sand shaped by wind');
    fireEvent.click(r.button('Compare with Moon dust'));
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Far-side Moon soil' }));
    expect(r.eyepiece).toHaveAttribute('data-slots', 'earth-wind moon-soil');
    fireEvent.click(r.button('Back to one slide'));
    expect(r.eyepiece).toHaveAttribute('data-slots', 'earth-wind');
    expect(screen.queryByRole('slider', { name: 'Move the dividing line' })).toBeNull();
  });
});

describe('wiping on the stage, drawn', () => {
  // A stand-in for the canvas: it records what is drawn, and hands out a photo's pixels.
  type Call = { op: string; src?: unknown };
  let calls: Call[];
  let handedOut: Uint8ClampedArray[];
  const photoPixels = (n: number) => {
    const data = new Uint8ClampedArray(n);
    for (let i = 0; i < n; i += 4) data.set((i / 4) % 7 < 3 ? [40, 40, 40, 255] : [230, 230, 236, 255], i);
    return data;
  };
  const undo: (() => void)[] = [];

  beforeEach(() => {
    calls = [];
    handedOut = [];
    const ctx = new Proxy(
      {},
      {
        get(_t, prop: string) {
          if (prop === 'getImageData') {
            return (_x: number, _y: number, w: number, h: number) => {
              const data = photoPixels(w * h * 4);
              handedOut.push(data);
              return { data, width: w, height: h };
            };
          }
          if (prop === 'createImageData') {
            return (w: number, h: number) => {
              const data = new Uint8ClampedArray(w * h * 4);
              handedOut.push(data);
              return { data, width: w, height: h };
            };
          }
          if (prop === 'createRadialGradient' || prop === 'createLinearGradient') return () => ({ addColorStop: () => {} });
          return (...args: unknown[]) => calls.push({ op: prop, src: args[0] });
        },
        set: () => true,
      },
    );
    jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(ctx as never);
    const proto = HTMLImageElement.prototype;
    const keys = ['complete', 'naturalWidth', 'naturalHeight'] as const;
    const was = keys.map((k) => Object.getOwnPropertyDescriptor(proto, k));
    Object.defineProperty(proto, 'complete', { configurable: true, get: () => true });
    Object.defineProperty(proto, 'naturalWidth', { configurable: true, get: () => 200 });
    Object.defineProperty(proto, 'naturalHeight', { configurable: true, get: () => 200 });
    undo.push(() => keys.forEach((k, i) => (was[i] ? Object.defineProperty(proto, k, was[i]!) : delete (proto as unknown as Record<string, unknown>)[k])));
    jest.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(400);
    undo.push(motion(true));
    window.history.replaceState(null, '', '/exhibitions/moon/microscope');
  });
  afterEach(() => {
    undo.splice(0).forEach((f) => f());
    jest.restoreAllMocks();
    jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
  });

  const frames = () => act(() => new Promise((r) => setTimeout(r, 60)));
  const lastDrawn = () => [...calls].reverse().find((c) => c.op === 'drawImage' && (c.src instanceof HTMLImageElement || c.src instanceof HTMLCanvasElement))?.src;
  const drag = (canvas: HTMLCanvasElement, from: number, to: number) => {
    const pointer = (type: string, clientX = 0) => fireEvent(canvas, new MouseEvent(type, { bubbles: true, clientX, clientY: 0 }));
    pointer('pointerdown', from);
    pointer('pointermove', to);
    pointer('pointerup', to);
  };

  it('wipes the smudges off a fresh slide where the cloth is dragged', async () => {
    const r = room();
    await frames();
    expect(r.eyepiece).toHaveAttribute('data-tool', 'cloth');
    expect(r.eyepiece).toHaveAttribute('data-worked', '');
    drag(r.canvas, -120, 120);
    await frames();
    // A copy of the fresh slide's dirty glass, changed where the cloth went, and shown.
    expect(r.eyepiece).toHaveAttribute('data-worked', 'smudged');
    expect(handedOut.length).toBeGreaterThan(0);
    const copy = handedOut[handedOut.length - 1];
    expect(changed(smudgedGlass(360).data, copy)).toBeGreaterThan(100);
    expect(calls.some((c) => c.op === 'putImageData')).toBe(true);
    expect(lastDrawn()).toBeInstanceOf(HTMLCanvasElement);
    expect(r.status()).toHaveTextContent('The smudges are coming off. Keep wiping.');
  });

  it('wipes the Moon photograph itself with the cloth, the dust clinging to it', async () => {
    const r = room();
    r.prepare('Far-side Moon soil');
    await frames();
    expect((lastDrawn() as HTMLImageElement).getAttribute('src')).toBe(MOON_SLIDES[0].src);
    // With a sample on, dragging moves the slide; choose the cloth to wipe it.
    fireEvent.click(r.button('Drag to wipe'));
    handedOut = [];
    drag(r.canvas, -120, 120);
    await frames();
    expect(handedOut).toHaveLength(1);
    expect(changed(photoPixels(handedOut[0].length), handedOut[0])).toBeGreaterThan(100);
    expect(r.eyepiece).toHaveAttribute('data-worked', 'moon-soil');
    expect(lastDrawn()).toBeInstanceOf(HTMLCanvasElement);
    expect(r.status()).toHaveTextContent('The Moon dust clings to the cloth.');
    expect(r.eyepiece).toHaveAttribute('data-pan', '0.500 0.500');
  });

  it('animates the exchange of slides and the sample settling, when motion is welcome', async () => {
    undo.push(motion(false));
    const r = room();
    await frames();
    fireEvent.click(r.button('Fresh slide'));
    expect(r.eyepiece).toHaveAttribute('data-anim', 'swap');
    calls = [];
    await frames();
    // Mid-swap, the edges of both glass slides are drawn crossing the stage (beyond the stage's own fill).
    const draws = calls.filter((c) => c.op === 'clearRect').length;
    expect(calls.filter((c) => c.op === 'fillRect').length).toBeGreaterThanOrEqual(draws * 5);
    await act(() => new Promise((res) => setTimeout(res, TIMES.swap + 60)));
    expect(r.eyepiece).toHaveAttribute('data-anim', '');
    expect(r.eyepiece).toHaveAttribute('data-slots', 'smudged');

    fireEvent.click(r.button('Wipe'));
    await act(() => new Promise((res) => setTimeout(res, TIMES.sweep + TIMES.polish + 200)));
    expect(r.eyepiece).toHaveAttribute('data-slots', 'clean');
    fireEvent.click(r.button('Place sample'));
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Far-side Moon soil' }));
    expect(r.eyepiece).toHaveAttribute('data-anim', 'place');
    await act(() => new Promise((res) => setTimeout(res, TIMES.place * 0.3)));
    calls = [];
    await frames();
    expect(calls.some((c) => c.op === 'arc')).toBe(true);
    await act(() => new Promise((res) => setTimeout(res, TIMES.place + 60)));
    expect(r.eyepiece).toHaveAttribute('data-anim', '');
    expect(r.eyepiece).toHaveAttribute('data-slots', 'moon-soil');
  }, 20000);

  it('opens the jar tray with one press of Place sample, even while the cloth is still wiping', async () => {
    undo.push(motion(false));
    const r = room();
    await frames();
    fireEvent.click(r.button('Wipe'));
    await frames();
    // Pressed mid-wipe: no "wipe it first", and the tray waits for the cloth.
    fireEvent.click(r.button('Place sample'));
    expect(r.status()).not.toHaveTextContent('Wipe it first');
    expect(screen.queryByRole('dialog')).toBeNull();
    await act(() => new Promise((res) => setTimeout(res, TIMES.sweep + TIMES.polish + 200)));
    expect(r.eyepiece).toHaveAttribute('data-slots', 'clean');
    expect(screen.getByRole('dialog', { name: 'Choose a sample' })).toBeInTheDocument();
  }, 20000);
});

describe('the approved notes', () => {
  beforeEach(() => window.history.replaceState(null, '', '/exhibitions/moon/microscope'));

  it('sets what Moon dust is made of with a Moon sample, and the meteorite beside the case link, each with its source', () => {
    const undo = motion(true);
    const r = room();
    expect(screen.queryByText(MICROSCOPE_NOTES.dust.text)).toBeNull();
    expect(screen.getByText(MICROSCOPE_NOTES.adrar.text)).toBeInTheDocument();
    expect(within(r.sources()).getByRole('link', { name: 'Washington University in St. Louis' })).toHaveAttribute('href', 'https://sites.wustl.edu/meteoritesite/?p=16700');
    fireEvent.click(screen.getByRole('button', { name: 'Close sources' }));
    expect(screen.getByRole('link', { name: /lunar meteorite in the display case/ })).toBeInTheDocument();
    r.prepare('Far-side Moon soil');
    expect(screen.getByText(MICROSCOPE_NOTES.dust.text)).toBeInTheDocument();
    expect(within(r.sources()).getByRole('link', { name: 'NASA' })).toHaveAttribute('href', 'https://science.nasa.gov/moon/composition/');
    expect(screen.getByText(`${REGOLITH.unlike} ${REGOLITH.jagged}`)).toBeInTheDocument();
    undo();
  });

  it('cites every microscope tip to a maker, a university or a university science-education site', () => {
    for (const tip of Object.values(PRACTICE)) {
      expect(tip.sources.length).toBeGreaterThan(0);
      for (const s of tip.sources) expect(s.href).toMatch(/^https:\/\/(adobeassets\.evidentscientific\.com|bio\.libretexts\.org|imb\.uq\.edu\.au|www\.sciencelearn\.org\.nz|www\.microscope\.healthcare\.nikon\.com)\//);
    }
    expect(PRACTICE.total.text).toMatch(/10× eyepiece and a 40× lens make 400×/);
  });

  it('keeps the display case to the posters’ sentences', () => {
    const writing = MOON_CASE.artifacts.flatMap((a) => a.writing ?? []).map((w) => w.text);
    for (const n of [...Object.values(MICROSCOPE_NOTES), ...Object.values(PRACTICE)]) expect(writing).not.toContain(n.text);
  });
});

describe('wiring', () => {
  it('sets the room on the landing page, the map and the projector', () => {
    expect(MOON.interactives?.map((c) => c.href)).toEqual(['/exhibitions/moon/microscope']);
    expect(MOON.interactives?.[0].image?.src).toBe('/exhibitions/moon/rooms/microscope.webp');
    expect(MOON.projector.links.map((l) => l.href)).toEqual(['/exhibitions/moon/microscope']);
    expect(getRoomByPath('/exhibitions/moon/microscope')?.id).toBe('mo-microscope');
    expect(getLevelConfig('/exhibitions/moon/microscope').title).toBe('Our Incredible Moon');
  });
});
