import { act, fireEvent, render, screen } from '@testing-library/react';
import MoonMicroscope from '@/app/exhibitions/moon/microscope/page';
import { blurFor, FOCUS_AT } from '@/app/exhibitions/moon/microscope/focus';
import { EARTH_SLIDES, MOON_SLIDES } from '@/app/exhibitions/moon/microscope/slides';
import { brushAside, changed, lamp, newBrush, newMask, smear, type Pixels } from '@/app/exhibitions/moon/microscope/wipe';
import { MICROSCOPE_NOTES, MOON, MOON_CASE, REGOLITH } from '@/app/exhibitions/moon/moon';
import { getLevelConfig } from '@/components/museum-map/data/levels';
import { getRoomByPath } from '@/components/museum-map/data/rooms';

/*
 * Under the Microscope: the photographs and their captions and credits, the
 * cloth that wipes them, the focus, the room's tabs, and its wiring.
 */

// jsdom has no canvas: the eyepiece draws nothing.
beforeAll(() => {
  jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
});
afterAll(() => jest.restoreAllMocks());

describe('the photographs', () => {
  it('has three of Moon dust and one for each of the poster’s three words, each captioned from its record and credited', () => {
    expect(MOON_SLIDES.map((s) => s.label)).toEqual(['Grains', 'Orange glass', 'Impact']);
    expect(EARTH_SLIDES.map((s) => s.label)).toEqual(['Wind', 'Water', 'Living things']);
    for (const s of [...MOON_SLIDES, ...EARTH_SLIDES]) {
      expect(s.src).toMatch(/^\/exhibitions\/moon\/microscope\/.+\.jpg$/);
      expect(s.caption.sources.length).toBeGreaterThan(0);
      expect(s.credit.href).toMatch(/^https:\/\/(commons\.wikimedia\.org|images\.nasa\.gov)\//);
    }
    // NASA's are public domain; the Earth sands are Creative Commons, with the licence linked.
    MOON_SLIDES.forEach((s) => expect(s.credit).toMatchObject({ author: 'NASA', licence: 'Public domain' }));
    EARTH_SLIDES.forEach((s) => expect(s.credit.licenceHref).toMatch(/creativecommons\.org/));
  });

  it('captions and credits the slide on the stage, and both side by side', () => {
    window.history.replaceState(null, '', '/exhibitions/moon/microscope');
    render(<MoonMicroscope />);
    expect(screen.getByText(MOON_SLIDES[0].caption.text)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: MOON_SLIDES[0].credit.title })).toHaveAttribute('href', MOON_SLIDES[0].credit.href);
    fireEvent.click(screen.getByRole('button', { name: 'Orange glass' }));
    expect(screen.getByText(MOON_SLIDES[1].caption.text)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: MOON_SLIDES[1].alt })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('tab', { name: "Earth's Soil" }));
    fireEvent.click(screen.getByRole('button', { name: 'Living things' }));
    expect(screen.getByText(EARTH_SLIDES[2].caption.text)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: EARTH_SLIDES[2].credit.title })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('tab', { name: 'Side by Side' }));
    expect(screen.getByRole('link', { name: MOON_SLIDES[1].credit.title })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: EARTH_SLIDES[2].credit.title })).toBeInTheDocument();
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

  it('smears Moon dust along its path, and grays as the dust clings to it', () => {
    const px = slide();
    const before = px.data.slice();
    const b = newBrush(10);
    for (let x = 10; x <= 110; x += 2) smear(px, b, x, 60);
    expect(changed(before, px.data)).toBeGreaterThan(500);
    expect(b.dust).toBeGreaterThan(0);
    // The glass between the grains is darker for the dust dragged across it.
    expect(px.data[(61 * px.width + 15) * 4]).toBeLessThan(220);
    // Nothing beyond the cloth's reach is touched.
    expect(changed(before.subarray(0, 40 * 120 * 4), px.data.subarray(0, 40 * 120 * 4))).toBe(0);
  });

  it('pushes Earth grains aside, leaving a lamp-lit lane of glass with soft edges', () => {
    const px = slide();
    const mask = newMask(px);
    const before = px.data.slice();
    let moved = 0;
    for (let x = 10; x < 110; x += 2) moved += brushAside(px, mask, x, 60, x + 2, 60, 14);
    expect(moved).toBeGreaterThan(0);
    expect(changed(before, px.data)).toBeGreaterThan(500);
    // The middle of the lane is the lamp's light, where there were grains.
    const at = (x: number, y: number) => px.data[(y * px.width + x) * 4];
    for (const x of [44, 46, 64]) expect(Math.abs(at(x, 60) - lamp(x, 60, px.width, px.height)[0])).toBeLessThan(30);
    // Its edge feathers: from the middle out, the glass clears less and less, a step at a time.
    const clear = [0, 2, 4, 6, 8, 10, 12].map((d) => mask[(60 + d) * px.width + 64]);
    for (let i = 1; i < clear.length; i++) expect(clear[i]).toBeLessThanOrEqual(clear[i - 1]);
    expect(clear[0]).toBeGreaterThan(200);
    expect(clear.some((c) => c > 20 && c < 200)).toBe(true);
    // Going over it again does not harden the edge.
    const once = mask.slice();
    for (let x = 10; x < 110; x += 2) brushAside(px, mask, x, 60, x + 2, 60, 14);
    expect(mask[66 * px.width + 64]).toBeLessThanOrEqual(once[66 * px.width + 64] + 30);
  });

  it('feathers the Moon smear too: the cloth presses softly at its rim', () => {
    const px = slide();
    const before = px.data.slice();
    smear(px, newBrush(20), 60, 60);
    smear(px, newBrush(20), 60, 60);
    // Changes fade toward the rim rather than stopping at a hard edge.
    const delta = (x: number) => Math.abs(px.data[(60 * px.width + x) * 4] - before[(60 * px.width + x) * 4]);
    expect(delta(79)).toBeLessThanOrEqual(delta(70) + 1);
  });

  it('keeps to its own side of the line, side by side', () => {
    const px = slide();
    const before = px.data.slice();
    brushAside(px, newMask(px), 50, 60, 70, 60, 14, { x0: 60, x1: Infinity });
    smear(px, newBrush(14), 60, 60, { x0: 60, x1: Infinity });
    for (let y = 0; y < px.height; y++) {
      for (let x = 0; x < 60; x++) {
        const k = (y * px.width + x) * 4;
        expect(px.data[k]).toBe(before[k]);
      }
    }
  });
});

describe('wiping the photograph on the stage', () => {
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
          if (prop === 'createImageData') return (w: number, h: number) => ({ data: new Uint8ClampedArray(w * h * 4), width: w, height: h });
          if (prop === 'createRadialGradient' || prop === 'createLinearGradient') return () => ({ addColorStop: () => {} });
          return (...args: unknown[]) => calls.push({ op: prop, src: args[0] });
        },
        set: () => true,
      },
    );
    jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(ctx as never);
    // The photographs "load" at once, 200 px square.
    const proto = HTMLImageElement.prototype;
    const keys = ['complete', 'naturalWidth', 'naturalHeight'] as const;
    const was = keys.map((k) => Object.getOwnPropertyDescriptor(proto, k));
    Object.defineProperty(proto, 'complete', { configurable: true, get: () => true });
    Object.defineProperty(proto, 'naturalWidth', { configurable: true, get: () => 200 });
    Object.defineProperty(proto, 'naturalHeight', { configurable: true, get: () => 200 });
    undo.push(() => keys.forEach((k, i) => (was[i] ? Object.defineProperty(proto, k, was[i]!) : delete (proto as unknown as Record<string, unknown>)[k])));
    // The eyepiece has a size; and reduced motion, so the button's sweep is done at once.
    jest.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(400);
    const mm = window.matchMedia;
    window.matchMedia = jest.fn().mockImplementation((q: string) => ({ matches: q.includes('reduce'), media: q, addEventListener: () => {}, removeEventListener: () => {}, addListener: () => {}, removeListener: () => {} }));
    undo.push(() => (window.matchMedia = mm));
  });
  afterEach(() => {
    undo.splice(0).forEach((f) => f());
    jest.restoreAllMocks();
    // Back to the canvas-less eyepiece the rest of this file uses.
    jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
  });

  const frames = () => act(() => new Promise((r) => setTimeout(r, 60)));
  /** What the eyepiece last laid on the stage: the photograph itself, or its wiped copy. */
  const lastSlide = () => [...calls].reverse().find((c) => c.op === 'drawImage' && (c.src instanceof HTMLImageElement || c.src instanceof HTMLCanvasElement))?.src;

  it('shows the photograph alone, with no drawn grains over it', async () => {
    window.history.replaceState(null, '', '/exhibitions/moon/microscope');
    render(<MoonMicroscope />);
    await frames();
    expect(lastSlide()).toBeInstanceOf(HTMLImageElement);
    expect((lastSlide() as HTMLImageElement).getAttribute('src')).toBe(MOON_SLIDES[0].src);
    // The lamp, the clip and the photograph: no grain outlines filled or stroked.
    const ops = new Set(calls.map((c) => c.op));
    for (const op of ['fill', 'stroke', 'arc', 'lineTo']) expect(ops.has(op)).toBe(false);
  });

  it('wipes the photograph itself, and a fresh slide puts it back', async () => {
    window.history.replaceState(null, '', '/exhibitions/moon/microscope');
    const { container } = render(<MoonMicroscope />);
    await frames();
    const eyepiece = container.querySelector('.mo-ms-eyepiece')!;
    expect(eyepiece).toHaveAttribute('data-wiped', '');
    fireEvent.click(screen.getByRole('button', { name: 'Wipe the slide' }));
    await frames();
    // The cloth changed a copy of the photo's own pixels, and the copy is what is shown.
    expect(handedOut).toHaveLength(1);
    expect(changed(photoPixels(handedOut[0].length), handedOut[0])).toBeGreaterThan(100);
    expect(eyepiece).toHaveAttribute('data-wiped', 'moon-grains');
    expect(calls.some((c) => c.op === 'putImageData')).toBe(true);
    expect(lastSlide()).toBeInstanceOf(HTMLCanvasElement);
    expect(screen.getByRole('status')).toHaveTextContent('The Moon dust clings to the cloth.');

    fireEvent.click(screen.getByRole('button', { name: 'Fresh slide' }));
    await frames();
    expect(eyepiece).toHaveAttribute('data-wiped', '');
    expect(lastSlide()).toBeInstanceOf(HTMLImageElement);
    expect(screen.getByRole('status')).toHaveTextContent('Fresh slides and a clean cloth.');
  });

  it('brushes Earth sand aside on its own slide', async () => {
    window.history.replaceState(null, '', '/exhibitions/moon/microscope#earth');
    const { container } = render(<MoonMicroscope />);
    await frames();
    fireEvent.click(screen.getByRole('button', { name: 'Wipe the slide' }));
    await frames();
    expect(container.querySelector('.mo-ms-eyepiece')).toHaveAttribute('data-wiped', 'earth-wind');
    expect(screen.getByRole('status')).toHaveTextContent('The grains brush aside.');
  });
});

describe('the focus', () => {
  it('is sharp only near the mark for each power', () => {
    FOCUS_AT.forEach((at, power) => {
      expect(blurFor(at, power)).toBe(0);
      expect(blurFor(at + 20, power)).toBeGreaterThan(5);
    });
    expect(blurFor(0, 2)).toBe(12);
  });
});

describe('the room', () => {
  it('sets the poster’s words for each slide, and keeps the knob and tabs keyboard-operable', () => {
    window.history.replaceState(null, '', '/exhibitions/moon/microscope');
    render(<MoonMicroscope />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Under the Microscope');
    expect(screen.getByText(`${REGOLITH.unlike} ${REGOLITH.jagged}`)).toBeInTheDocument();

    const knob = screen.getByRole('slider', { name: 'Focus' });
    expect(knob).toHaveAttribute('aria-valuetext', 'Blurry');
    for (let i = 0; i < 8; i++) fireEvent.keyDown(knob, { key: 'ArrowUp' });
    expect(knob).toHaveAttribute('aria-valuenow', '40');
    expect(knob).toHaveAttribute('aria-valuetext', 'In focus');
    expect(screen.getByRole('status')).toHaveTextContent('In focus.');

    const moonTab = screen.getByRole('tab', { name: 'Moon Dust' });
    fireEvent.keyDown(moonTab, { key: 'ArrowRight' });
    expect(screen.getByRole('tab', { name: "Earth's Soil" })).toHaveAttribute('aria-selected', 'true');
    fireEvent.click(screen.getByRole('button', { name: 'Water' }));
    expect(screen.getByText('water', { selector: 'mark' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: 'Side by Side' }));
    expect(screen.getByRole('slider', { name: 'Move the dividing line' })).toBeInTheDocument();
    expect(screen.getByText(`${REGOLITH.surface} ${REGOLITH.differences}`)).toBeInTheDocument();
  });
});

describe('the approved notes', () => {
  it('sets what Moon dust is made of on its slide, and the meteorite beside the case link, each with its source', () => {
    // Not the poster's words: owner-approved, fact-checked, set apart with a source.
    window.history.replaceState(null, '', '/exhibitions/moon/microscope');
    render(<MoonMicroscope />);
    expect(screen.getByText(MICROSCOPE_NOTES.dust.text)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'NASA' })).toHaveAttribute('href', 'https://science.nasa.gov/moon/composition/');
    expect(screen.getByText(MICROSCOPE_NOTES.adrar.text)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Washington University in St. Louis' })).toHaveAttribute('href', 'https://sites.wustl.edu/meteoritesite/?p=16700');
    expect(screen.getByRole('link', { name: /lunar meteorite in the display case/ })).toBeInTheDocument();
    // Moon dust's note is for its own slide only.
    fireEvent.click(screen.getByRole('tab', { name: "Earth's Soil" }));
    expect(screen.queryByText(MICROSCOPE_NOTES.dust.text)).toBeNull();
    expect(screen.getByText(MICROSCOPE_NOTES.adrar.text)).toBeInTheDocument();
  });

  it('keeps the display case to the posters’ sentences', () => {
    const writing = MOON_CASE.artifacts.flatMap((a) => a.writing ?? []).map((w) => w.text);
    for (const n of Object.values(MICROSCOPE_NOTES)) expect(writing).not.toContain(n.text);
  });
});

describe('wiring', () => {
  it('sets the room on the landing page, the map and the projector', () => {
    expect(MOON.interactives?.map((c) => c.href)).toEqual(['/exhibitions/moon/microscope']);
    expect(MOON.interactives?.[0].image?.src).toMatch(/\.svg$/);
    expect(MOON.projector.links.map((l) => l.href)).toEqual(['/exhibitions/moon/microscope']);
    expect(getRoomByPath('/exhibitions/moon/microscope')?.id).toBe('mo-microscope');
    expect(getLevelConfig('/exhibitions/moon/microscope').title).toBe('Our Incredible Moon');
  });
});
