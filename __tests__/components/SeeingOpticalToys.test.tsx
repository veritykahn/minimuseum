import fs from 'fs';
import path from 'path';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import SeeingOpticalToys from '@/app/exhibitions/seeing-is-deceiving/optical-toys/page';
import { DISC, POSTER, STRIPS, TOY_NOTES } from '@/app/exhibitions/seeing-is-deceiving/optical-toys/toysText';
import {
  allowedStep,
  approach,
  CLIMB_RATE,
  faceAt,
  FLICKER_FREE,
  flickerFreeStep,
  flickerRate,
  frameAt,
  picturesPerSecond,
  SLIT_SHARE,
  slitsInView,
  SPEED_STEPS,
  speedAt,
  TAU,
  thaumaSeen,
  TOY_SPEEDS,
  ZOE_FRAMES,
  zoeSeen,
} from '@/app/exhibitions/seeing-is-deceiving/optical-toys/spin';
import { setFlickerOk } from '@/app/exhibitions/seeing-is-deceiving/optical-toys/useSpeed';
import { THAUMA_SEEN_LABEL } from '@/app/exhibitions/seeing-is-deceiving/optical-toys/Thaumatrope';
import { ZOE_SEEN_LABEL } from '@/app/exhibitions/seeing-is-deceiving/optical-toys/Zoetrope';
import { MATERIALS, steps } from '@/app/exhibitions/seeing-is-deceiving/optical-toys/MakeThaumatrope';
import { footAt, knee } from '@/app/exhibitions/seeing-is-deceiving/optical-toys/strips';
import { getLevelConfig } from '@/components/museum-map/data/levels';
import { getRoomByPath } from '@/components/museum-map/data/rooms';
import sitemap from '@/app/sitemap';
import nextConfig from '@/next.config';
import SeeingCase from '@/app/exhibitions/seeing-is-deceiving/artifacts/page';
import { poster1Content } from '@/app/exhibitions/seeing-is-deceiving/posters';
import { SEEING_POSTER_LINKS } from '@/components/projector/themes';

/*
 * Seeing is Deceiving's optical toys: every line that explains them is the
 * poster's own (the toys' history notes are carved out: owner-approved,
 * fact-checked, and set with their sources); both toys work as the real
 * ones do, never showing the finished picture as a still; both start very
 * slowly and rise by many small steps, asking before they flicker more than
 * three times a second; under reduced motion they stand still, stepped by
 * hand; and a printable thaumatrope prints on Letter paper.
 */

/** The poster's lines as the exhibition sets them, in its page and its posters' data. */
const posterSource = ['page.tsx', 'posters.ts']
  .map((f) => fs.readFileSync(path.join(process.cwd(), 'app/exhibitions/seeing-is-deceiving', f), 'utf8'))
  .join('\n')
  .replace(/\\'/g, "'");

function reducedMotion(on: boolean) {
  (window.matchMedia as jest.Mock).mockImplementation((query: string) => ({
    matches: on && query.includes('prefers-reduced-motion'),
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
}

beforeAll(() => {
  // jsdom draws nothing; the toys carry on without a canvas.
  jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
});
afterEach(() => {
  reducedMotion(false);
  jest.useRealTimers();
});

describe('the words', () => {
  it('quotes the poster’s “First Motion Pictures” word for word', () => {
    for (const line of Object.values(POSTER)) expect(posterSource).toContain(line);
    expect(POSTER.thaumatrope).toContain('a bird appears inside a cage');
    expect(POSTER.zoetrope).toContain('horses gallop, people dance');
  });

  it('draws the poster’s own toys: the bird and the cage, the horses and the dancers', () => {
    expect(DISC.front).toMatch(/bird/);
    expect(DISC.back).toMatch(/cage/);
    expect(STRIPS.map((s) => s.id)).toEqual(['horses', 'dancers']);
  });
});

describe('like the real toys: the picture only through movement', () => {
  const src = (f: string) => fs.readFileSync(path.join(process.cwd(), 'app/exhibitions/seeing-is-deceiving/optical-toys', f), 'utf8');

  it('never lays the thaumatrope’s two sides together as a still', () => {
    const t = src('Thaumatrope.tsx');
    expect(t).not.toMatch(/vt-blend|mix-blend|together:\s*'The bird/);
    // Each face draws one side only.
    expect(t).toMatch(/<DiscArt side=\{side\} \/>/);
  });

  it('never draws the zoetrope’s strip snapped in place, or the slits fading away', () => {
    const z = src('Zoetrope.tsx');
    expect(z).not.toMatch(/phiStrip|slitStrength|strobe/);
  });

  it('shows each slit the next picture, and only a slice of it: the view tiles only when the slits run fast', () => {
    const slot = TAU / ZOE_FRAMES;
    // Successive slits passing the middle show successive pictures.
    const mid = (a: number) => slitsInView(a).find((s) => Math.abs(s.x - 0.5) < 0.5 + 1e-9)!.picture;
    expect(mid(slot * 0.5)).toBe(0);
    expect(mid(slot * 1.5)).toBe(1);
    expect(mid(slot * 11.5)).toBe(11);
    expect(mid(slot * 12.5)).toBe(0);
    // A slit is narrower than the view: still, the drawing is never seen whole.
    expect(SLIT_SHARE).toBeLessThan(0.5);
    // At the top speed, a 60-a-second screen shows a slit in enough places to tile the view.
    const perFrame = picturesPerSecond(TOY_SPEEDS.zoetrope.top) / 60;
    expect(SLIT_SHARE).toBeGreaterThanOrEqual(perFrame);
  });

  it('flips the disc about its strings: front, back, front', () => {
    expect(faceAt(0)).toBe('front');
    expect(faceAt(Math.PI)).toBe('back');
    expect(faceAt(TAU)).toBe('front');
    expect(frameAt(slot0(3))).toBe(3);
  });
});

const slot0 = (k: number) => (TAU / ZOE_FRAMES) * (k + 0.5);

describe('a gradual speed, and a word before the flicker', () => {
  it('rises in many small, even steps from very slow', () => {
    expect(SPEED_STEPS).toBeGreaterThanOrEqual(100);
    for (const toy of ['thaumatrope', 'zoetrope'] as const) {
      expect(speedAt(toy, 0)).toBe(0);
      expect(speedAt(toy, 1)).toBeCloseTo(TOY_SPEEDS[toy].min);
      expect(speedAt(toy, SPEED_STEPS)).toBeCloseTo(TOY_SPEEDS[toy].top);
      // The first step is slow: well under one flicker a second.
      expect(flickerRate(toy, speedAt(toy, 1))).toBeLessThan(0.5);
      for (let v = 2; v <= SPEED_STEPS; v++) {
        const r = speedAt(toy, v) / speedAt(toy, v - 1);
        expect(r).toBeGreaterThan(1);
        expect(r).toBeLessThan(1.04);
      }
    }
    // From the slowest to the fastest takes about a minute when it climbs by itself.
    expect(SPEED_STEPS / CLIMB_RATE).toBeGreaterThan(45);
  });

  it('runs up to three flickers a second freely, and no faster until the visitor says yes', () => {
    for (const toy of ['thaumatrope', 'zoetrope'] as const) {
      const gate = flickerFreeStep(toy);
      expect(flickerRate(toy, speedAt(toy, gate))).toBeLessThanOrEqual(FLICKER_FREE);
      expect(flickerRate(toy, speedAt(toy, gate + 1))).toBeGreaterThan(FLICKER_FREE);
      expect(allowedStep(toy, SPEED_STEPS, false)).toBe(gate);
      expect(allowedStep(toy, SPEED_STEPS, true)).toBe(SPEED_STEPS);
    }
    // At the top, fast enough for the eye to join the pictures up.
    expect(thaumaSeen(TOY_SPEEDS.thaumatrope.top)).toBe('together');
    expect(zoeSeen(TOY_SPEEDS.zoetrope.top)).toBe('moving');
    expect(picturesPerSecond(TOY_SPEEDS.zoetrope.top)).toBeLessThanOrEqual(15);
    expect(approach(0, 2, 0.5, 1)).toBe(0.5);
  });

  it('gallops in a loop: each hoof planted and swept back, then lifted and carried forward, the leg bending to reach it', () => {
    expect(footAt(0, 30, 20)).toEqual({ x: 30, y: 0 });
    expect(footAt(0.17, 30, 20).y).toBe(0);
    expect(footAt(0.6, 30, 20).y).toBeLessThan(0);
    expect(footAt(1, 30, 20)).toEqual(footAt(0, 30, 20));
    const k = knee(0, 0, 0, 50, 30, 34, 1);
    expect(Math.hypot(k.x, k.y)).toBeCloseTo(30);
    expect(Math.hypot(k.x, k.y - 50)).toBeCloseTo(34);
  });
});

describe('the thaumatrope', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/exhibitions/seeing-is-deceiving/optical-toys');
    setFlickerOk(false);
  });

  it('starts very slowly when twirled, climbs by itself, and waits at the flicker for a yes', () => {
    jest.useFakeTimers();
    render(<SeeingOpticalToys />);
    expect(screen.getByRole('tab', { name: 'Thaumatrope' })).toHaveAttribute('aria-selected', 'true');
    fireEvent.click(screen.getByRole('button', { name: 'Twirl' }));
    expect(screen.getByRole('button', { name: 'Let it slow' })).toHaveAttribute('aria-pressed', 'true');
    const slider = screen.getByRole('slider', { name: 'Speed' });
    expect(slider).toHaveValue('1');
    expect(screen.getByText(THAUMA_SEEN_LABEL.sides)).toBeInTheDocument();
    act(() => {
      jest.advanceTimersByTime(4000);
    });
    expect(Number((slider as HTMLInputElement).value)).toBeGreaterThan(5);
    // It climbs to the flicker-free step, and asks.
    act(() => {
      jest.advanceTimersByTime(120_000);
    });
    expect(slider).toHaveValue(String(flickerFreeStep('thaumatrope')));
    expect(screen.getByRole('alertdialog', { name: 'Flicker ahead' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Go faster' }));
    act(() => {
      jest.advanceTimersByTime(120_000);
    });
    expect(slider).toHaveValue(String(SPEED_STEPS));
    expect(screen.getByText(THAUMA_SEEN_LABEL.together)).toBeInTheDocument();
    expect(screen.getByText(POSTER.discovered)).toBeInTheDocument();
    // A step slower by hand.
    fireEvent.click(screen.getByRole('button', { name: 'Slower' }));
    expect(slider).toHaveValue(String(SPEED_STEPS - 5));
  });

  it('holds a hand at the flicker too, and “Stay slow” keeps it there', () => {
    render(<SeeingOpticalToys />);
    const slider = screen.getByRole('slider', { name: 'Speed' });
    fireEvent.change(slider, { target: { value: String(SPEED_STEPS) } });
    expect(slider).toHaveValue(String(flickerFreeStep('thaumatrope')));
    fireEvent.click(screen.getByRole('button', { name: 'Stay slow' }));
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    expect(slider).toHaveValue(String(flickerFreeStep('thaumatrope')));
  });

  it('flips, and shows one side at a time, never both together', () => {
    render(<SeeingOpticalToys />);
    expect(screen.getByText(POSTER.thaumatrope)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Flip the disc' }));
    expect(screen.getByRole('status')).toHaveTextContent(`Back: ${DISC.back}.`);
    fireEvent.click(screen.getByRole('button', { name: 'One side at a time' }));
    expect(screen.getByRole('figure', { name: /one side at a time/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Turn it over' }));
    expect(screen.getByRole('status')).toHaveTextContent(`Back: ${DISC.back}.`);
    fireEvent.click(screen.getByRole('button', { name: 'Turn it over' }));
    expect(screen.getByRole('status')).toHaveTextContent(`Front: ${DISC.front}.`);
    expect(screen.queryByText(/Together/)).not.toBeInTheDocument();
  });

  it('under reduced motion, stands still: no twirling, one side at a time', () => {
    reducedMotion(true);
    render(<SeeingOpticalToys />);
    expect(screen.queryByRole('button', { name: 'Twirl' })).not.toBeInTheDocument();
    expect(screen.queryByRole('slider', { name: 'Speed' })).not.toBeInTheDocument();
    expect(screen.getByRole('figure', { name: /one side at a time/ })).toBeInTheDocument();
  });
});

describe('the zoetrope', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/exhibitions/seeing-is-deceiving/optical-toys#zoetrope');
    setFlickerOk(false);
  });

  it('opens from its address, with the eye to the slits; spins slowly, and steps picture by picture', () => {
    render(<SeeingOpticalToys />);
    expect(screen.getByRole('tab', { name: 'Zoetrope' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('img', { name: /Your eye to the drum’s wall/ })).toBeInTheDocument();
    expect(screen.getByText(POSTER.zoetrope)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Spin' }));
    expect(screen.getByRole('button', { name: 'Stop' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText(ZOE_SEEN_LABEL.sliver)).toBeInTheDocument();
    const slider = screen.getByRole('slider', { name: 'Speed' });
    fireEvent.change(slider, { target: { value: String(SPEED_STEPS) } });
    expect(slider).toHaveValue(String(flickerFreeStep('zoetrope')));
    expect(screen.getByText(POSTER.nothingMoves)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Go faster' }));
    fireEvent.change(slider, { target: { value: String(SPEED_STEPS) } });
    expect(screen.getByText(`${POSTER.movies} ${POSTER.screens}`)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Next picture' }));
    expect(screen.getByRole('status')).toHaveTextContent(`Picture 2 of ${ZOE_FRAMES}.`);
    expect(screen.getByRole('button', { name: 'Spin' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Previous picture' }));
    fireEvent.click(screen.getByRole('button', { name: 'Previous picture' }));
    expect(screen.getByRole('status')).toHaveTextContent(`Picture ${ZOE_FRAMES} of ${ZOE_FRAMES}.`);
    fireEvent.click(screen.getByRole('button', { name: 'People dance' }));
    expect(screen.getByRole('button', { name: 'People dance' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('under reduced motion, stands still: every picture side by side, stepped by hand', () => {
    reducedMotion(true);
    render(<SeeingOpticalToys />);
    expect(screen.queryByRole('button', { name: 'Spin' })).not.toBeInTheDocument();
    const frames = screen.getByRole('list', { name: /pictures, side by side/ });
    expect(within(frames).getAllByRole('button')).toHaveLength(ZOE_FRAMES);
    fireEvent.click(within(frames).getByRole('button', { name: `Picture 5 of ${ZOE_FRAMES}` }));
    expect(screen.getByRole('status')).toHaveTextContent(`Picture 5 of ${ZOE_FRAMES}.`);
    fireEvent.click(screen.getByRole('button', { name: 'Next picture' }));
    expect(screen.getByRole('status')).toHaveTextContent(`Picture 6 of ${ZOE_FRAMES}.`);
  });
});

describe('make your own thaumatrope', () => {
  beforeEach(() => window.history.replaceState(null, '', '/exhibitions/seeing-is-deceiving/optical-toys#make'));

  it('prints a sheet for each pair and a blank one, each with what you need and what to do, on Letter paper', () => {
    const print = jest.spyOn(window, 'print').mockImplementation(() => {});
    const { container } = render(<SeeingOpticalToys />);
    expect(screen.getByRole('tab', { name: 'Make your own' })).toHaveAttribute('aria-selected', 'true');
    const sheets = screen.getAllByRole('article');
    expect(sheets.map((s) => s.getAttribute('aria-label'))).toEqual([
      'Sheet: Bird and cage',
      'Sheet: Fish and bowl',
      'Sheet: Flower and pot',
      'Sheet: blank discs',
    ]);
    for (const s of sheets) {
      expect(within(s).getByRole('heading', { name: 'You will need' })).toBeInTheDocument();
      expect(within(s).getByRole('heading', { name: 'What to do' })).toBeInTheDocument();
      expect(within(s).getAllByRole('listitem').length).toBe(MATERIALS.length + steps(false).length);
    }
    expect(within(sheets[0]).getByRole('img', { name: /Back: An empty birdcage, printed upside down/ })).toBeInTheDocument();
    expect(container.innerHTML).toContain('size: 8.5in 11in');
    // Untick two, and print the rest.
    fireEvent.click(screen.getByRole('checkbox', { name: 'Fish and bowl' }));
    fireEvent.click(screen.getByRole('checkbox', { name: 'Blank discs to draw on' }));
    expect(screen.getAllByRole('article')).toHaveLength(2);
    fireEvent.click(screen.getByRole('button', { name: 'Print 2 sheets' }));
    expect(print).toHaveBeenCalled();
  });

  it('prints the back picture upside down, so it turns the right way up on the strings', () => {
    render(<SeeingOpticalToys />);
    const back = screen.getByRole('img', { name: /Back: An empty fishbowl/ });
    expect(back.querySelector('.vmt-art')).toHaveAttribute('transform', 'rotate(180)');
    const front = screen.getByRole('img', { name: /Front: A fish$/ });
    expect(front.querySelector('.vmt-art')).not.toHaveAttribute('transform');
    expect(steps(true)[0]).toMatch(/upside down/);
  });

  it('keeps its print styles to Letter, and shows only the sheets when printing', () => {
    const css = fs.readFileSync(path.join(process.cwd(), 'app/exhibitions/seeing-is-deceiving/optical-toys/optical-toys.css'), 'utf8');
    expect(css).toMatch(/@media print[\s\S]*\.vmt-sheet[\s\S]*break-after: page/);
    expect(css).toMatch(/\.vmt-sheet \{[^}]*width: 7\.5in/);
  });
});

describe('the toys’ history', () => {
  const VA = 'https://collections.vam.ac.uk/item/O96347/optical-toy-zoetrope-zoetrope/';

  it('notes each toy’s history, and once for both, each with its source linked', () => {
    window.history.replaceState(null, '', '/exhibitions/seeing-is-deceiving/optical-toys');
    render(<SeeingOpticalToys />);
    // The carve-out: these notes are not the poster's words.
    for (const n of Object.values(TOY_NOTES)) expect(posterSource).not.toContain(n.text);

    expect(screen.getAllByText(TOY_NOTES.both.text)).toHaveLength(1);
    const thauma = screen.getByRole('tabpanel', { name: 'Thaumatrope' });
    expect(within(thauma).getByText(TOY_NOTES.thaumatrope.text)).toBeInTheDocument();
    expect(within(thauma).getByRole('link', { name: 'Science Museum Group' })).toHaveAttribute('href', 'https://collection.sciencemuseumgroup.org.uk/objects/co8085499');

    fireEvent.click(screen.getByRole('tab', { name: 'Zoetrope' }));
    const zoe = screen.getByRole('tabpanel', { name: 'Zoetrope' });
    expect(within(zoe).getByText(TOY_NOTES.zoetrope.text)).toBeInTheDocument();
    const va = within(zoe).getAllByRole('link', { name: 'V&A' });
    expect(va).toHaveLength(2);
    for (const l of va) expect(l).toHaveAttribute('href', VA);
    expect(within(zoe).getByRole('link', { name: 'US Patent 64,117' })).toHaveAttribute('href', 'https://patents.google.com/patent/US64117A/en');
    expect(TOY_NOTES.both.sources).toEqual([{ label: 'V&A', href: VA }]);
  });
});

describe('wiring', () => {
  it('stands in Seeing is Deceiving on the map and the sitemap, and the old address redirects to it', async () => {
    expect(getRoomByPath('/exhibitions/seeing-is-deceiving/optical-toys')?.id).toBe('sid-optical-toys');
    expect(getRoomByPath('/exhibitions/seeing-is-deceiving/optical-toys')?.parent).toBe('seeing-is-deceiving');
    expect(getLevelConfig('/exhibitions/seeing-is-deceiving/optical-toys').title).toBe('Seeing is Deceiving');
    expect(getLevelConfig('/exhibitions/seeing-is-deceiving').floorPlan?.rooms.map((r) => r.path)).toContain('/exhibitions/seeing-is-deceiving/optical-toys');
    const urls = sitemap().map((e) => e.url);
    expect(urls).toContainEqual(expect.stringMatching(/\/exhibitions\/seeing-is-deceiving\/optical-toys$/));
    expect(urls).not.toContainEqual(expect.stringMatching(/\/exhibitions\/victorian\/optical-toys$/));
    expect(getRoomByPath('/exhibitions/victorian/optical-toys')?.id).not.toBe('vb-optical-toys');
    const redirects = await nextConfig.redirects!();
    expect(redirects).toContainEqual(expect.objectContaining({ source: '/exhibitions/victorian/optical-toys', destination: '/exhibitions/seeing-is-deceiving/optical-toys', permanent: true }));
  });
});

describe('the way in', () => {
  it('opens from the display case, under Interactives beside the Perception Lab, and goes back there', () => {
    render(<SeeingCase />);
    fireEvent.click(screen.getByRole('tab', { name: /Interactives/ }));
    const rooms = screen.getByRole('tabpanel', { name: /Interactives/ });
    expect(within(rooms).getAllByRole('link').map((l) => l.getAttribute('href'))).toEqual([
      '/exhibitions/seeing-is-deceiving/illusions',
      '/exhibitions/seeing-is-deceiving/optical-toys',
    ]);
    // Each card shows the room itself.
    for (const room of ['perception-lab', 'optical-toys']) expect(fs.existsSync(path.join(process.cwd(), `public/exhibitions/seeing/rooms/${room}.webp`))).toBe(true);
  });

  it('is linked from The First Motion Pictures, and from the projector', () => {
    const start = poster1Content.findIndex((it) => it.text === 'The First Motion Pictures (1820s–1830s)');
    const next = poster1Content.findIndex((it, i) => i > start && it.type === 'section-title');
    const chapter = poster1Content.slice(start, next);
    expect(chapter.map((it) => it.room?.href).filter(Boolean)).toEqual(['/exhibitions/seeing-is-deceiving/optical-toys']);
    expect(SEEING_POSTER_LINKS.map((l) => l.href)).toContain('/exhibitions/seeing-is-deceiving/optical-toys');
  });
});
