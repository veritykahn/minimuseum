import fs from 'fs';
import path from 'path';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import SeeingOpticalToys from '@/app/exhibitions/seeing-is-deceiving/optical-toys/page';
import { DISC, POSTER, STRIPS, TOY_NOTES } from '@/app/exhibitions/seeing-is-deceiving/optical-toys/toysText';
import {
  alternationsPerSecond,
  approach,
  faceAt,
  frameAt,
  picturesPerSecond,
  slitStrength,
  thaumaBlend,
  thaumaSeen,
  THAUMA_LADDER,
  THAUMA_MERGED,
  THAUMA_SEEN,
  THAUMA_TOP,
  TAU,
  ZOE_FRAMES,
  ZOE_LADDER,
  ZOE_TOP,
  zoeSeen,
} from '@/app/exhibitions/seeing-is-deceiving/optical-toys/spin';
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
 * fact-checked, and set with their sources); both toys start slowly and
 * climb, rung by rung, never flashing faster than three times a second; and
 * under reduced motion they stand still, their pictures side by side,
 * stepped by hand.
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
    expect(DISC.together).toMatch(/bird, inside the cage/);
    expect(STRIPS.map((s) => s.id)).toEqual(['horses', 'dancers']);
  });
});

describe('no flashing, and a slow start', () => {
  const speeds = Array.from({ length: 401 }, (_, i) => (i / 400) * 5);

  it('shows the thaumatrope’s sides alternating only while slow; faster, merged and steady', () => {
    expect(thaumaBlend(0)).toBe(0);
    expect(thaumaBlend(THAUMA_SEEN)).toBe(0);
    expect(thaumaBlend(THAUMA_MERGED)).toBe(1);
    expect(thaumaBlend(THAUMA_TOP)).toBe(1);
    for (const s of speeds) expect(alternationsPerSecond(s)).toBeLessThanOrEqual(3);
    expect(faceAt(0)).toBe('front');
    expect(faceAt(Math.PI)).toBe('back');
    expect(faceAt(TAU)).toBe('front');
  });

  it('draws the zoetrope’s slits only while fewer than three pass a second, and shows at most 15 pictures a second', () => {
    for (const s of speeds) if (slitStrength(s) > 0) expect(s * ZOE_FRAMES).toBeLessThan(3);
    expect(slitStrength(0)).toBe(1);
    expect(picturesPerSecond(ZOE_TOP)).toBeLessThanOrEqual(15);
  });

  it('climbs from a speed that shows each side or drawing to one that shows the illusion, each rung within the limits', () => {
    for (const ladder of [THAUMA_LADDER, ZOE_LADDER]) {
      for (let i = 1; i < ladder.length; i++) expect(ladder[i].rps).toBeGreaterThan(ladder[i - 1].rps);
      for (const r of ladder.slice(0, -1)) expect(r.hold).toBeGreaterThanOrEqual(3);
      expect(ladder[ladder.length - 1].hold).toBe(Infinity);
    }
    expect(thaumaSeen(THAUMA_LADDER[0].rps)).toBe('sides');
    expect(thaumaSeen(THAUMA_LADDER[THAUMA_LADDER.length - 1].rps)).toBe('merged');
    for (const r of THAUMA_LADDER) expect(alternationsPerSecond(r.rps)).toBeLessThanOrEqual(3);
    // The first rungs show each drawing through the slits; the last, moving.
    expect(zoeSeen(ZOE_LADDER[0].rps)).toBe('drawings');
    expect(slitStrength(ZOE_LADDER[0].rps)).toBeGreaterThan(0);
    expect(picturesPerSecond(ZOE_LADDER[0].rps)).toBeLessThan(1);
    expect(zoeSeen(ZOE_LADDER[ZOE_LADDER.length - 1].rps)).toBe('moving');
    for (const r of ZOE_LADDER) expect(picturesPerSecond(r.rps)).toBeLessThanOrEqual(15);
  });

  it('turns the drum picture by picture, round and round', () => {
    const slot = TAU / ZOE_FRAMES;
    expect(frameAt(0)).toBe(0);
    expect(frameAt(slot * 3)).toBe(3);
    expect(frameAt(TAU + slot)).toBe(1);
    expect(frameAt(-slot)).toBe(ZOE_FRAMES - 1);
    expect(approach(0, 2, 0.5, 1)).toBe(0.5);
    expect(approach(1.9, 2, 0.5, 1)).toBe(2);
    expect(approach(1, 0, 0.5, 1)).toBe(0.5);
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
  beforeEach(() => window.history.replaceState(null, '', '/exhibitions/seeing-is-deceiving/optical-toys'));

  it('starts slowly when twirled, and climbs rung by rung to the bird in its cage', () => {
    jest.useFakeTimers();
    render(<SeeingOpticalToys />);
    expect(screen.getByRole('tab', { name: 'Thaumatrope' })).toHaveAttribute('aria-selected', 'true');
    fireEvent.click(screen.getByRole('button', { name: 'Twirl' }));
    expect(screen.getByRole('button', { name: 'Let it slow' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText(`Speed 1 of ${THAUMA_LADDER.length}`)).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('slow enough to see each side go by');
    act(() => {
      jest.advanceTimersByTime(THAUMA_LADDER[0].hold * 1000);
    });
    expect(screen.getByText(`Speed 2 of ${THAUMA_LADDER.length}`)).toBeInTheDocument();
    // Faster by hand holds the climb; "Keep climbing" carries on.
    fireEvent.click(screen.getByRole('button', { name: 'Faster' }));
    expect(screen.getByText(`Speed 3 of ${THAUMA_LADDER.length}`)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Keep climbing' })).toBeInTheDocument();
    for (let i = 0; i < THAUMA_LADDER.length; i++) fireEvent.click(screen.getByRole('button', { name: 'Faster' }));
    expect(screen.getByText(`Speed ${THAUMA_LADDER.length} of ${THAUMA_LADDER.length}`)).toBeInTheDocument();
    expect(screen.getByText('One picture: the bird in its cage')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Faster' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Slower' }));
    expect(screen.getByText(`Speed ${THAUMA_LADDER.length - 1} of ${THAUMA_LADDER.length}`)).toBeInTheDocument();
  });

  it('flips, and shows both sides side by side, stepped by hand', () => {
    render(<SeeingOpticalToys />);
    expect(screen.getByText(POSTER.thaumatrope)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Flip the disc' }));
    expect(screen.getByRole('status')).toHaveTextContent(`Back: ${DISC.back}.`);
    fireEvent.click(screen.getByRole('button', { name: 'See both sides' }));
    const sides = screen.getByRole('list', { name: /side by side/ });
    expect(within(sides).getAllByRole('button')).toHaveLength(3);
    fireEvent.click(screen.getByRole('button', { name: 'Next side' }));
    expect(screen.getByRole('status')).toHaveTextContent(`Back: ${DISC.back}.`);
    fireEvent.click(screen.getByRole('button', { name: 'Next side' }));
    expect(screen.getByRole('status')).toHaveTextContent(`Together: ${DISC.together}.`);
    expect(screen.getByText(POSTER.discovered)).toBeInTheDocument();
  });

  it('under reduced motion, stands still: no twirling, the sides side by side', () => {
    reducedMotion(true);
    render(<SeeingOpticalToys />);
    expect(screen.queryByRole('button', { name: 'Twirl' })).not.toBeInTheDocument();
    expect(screen.queryByRole('group', { name: 'Speed' })).not.toBeInTheDocument();
    expect(screen.getByRole('list', { name: /side by side/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Previous side' })).toBeInTheDocument();
  });
});

describe('the zoetrope', () => {
  beforeEach(() => window.history.replaceState(null, '', '/exhibitions/seeing-is-deceiving/optical-toys#zoetrope'));

  it('opens from its address, starts slowly, climbs, and steps picture by picture', () => {
    render(<SeeingOpticalToys />);
    expect(screen.getByRole('tab', { name: 'Zoetrope' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText(POSTER.zoetrope)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Spin' }));
    expect(screen.getByRole('button', { name: 'Stop' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText(`Speed 1 of ${ZOE_LADDER.length}`)).toBeInTheDocument();
    for (let i = 0; i < 3; i++) fireEvent.click(screen.getByRole('button', { name: 'Faster' }));
    expect(screen.getByText(POSTER.nothingMoves)).toBeInTheDocument();
    for (let i = 0; i < ZOE_LADDER.length; i++) fireEvent.click(screen.getByRole('button', { name: 'Faster' }));
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
    const heading = screen.getByRole('heading', { level: 2, name: 'Interactives' });
    const rooms = heading.nextElementSibling as HTMLElement;
    expect(within(rooms).getAllByRole('link').map((l) => l.getAttribute('href'))).toEqual([
      '/exhibitions/seeing-is-deceiving/illusions',
      '/exhibitions/seeing-is-deceiving/optical-toys',
    ]);
    expect(fs.existsSync(path.join(process.cwd(), 'public/exhibitions/seeing/room-optical-toys.svg'))).toBe(true);
  });

  it('is linked from The First Motion Pictures, and from the projector', () => {
    const start = poster1Content.findIndex((it) => it.text === 'The First Motion Pictures (1820s–1830s)');
    const next = poster1Content.findIndex((it, i) => i > start && it.type === 'section-title');
    const chapter = poster1Content.slice(start, next);
    expect(chapter.map((it) => it.room?.href).filter(Boolean)).toEqual(['/exhibitions/seeing-is-deceiving/optical-toys']);
    expect(SEEING_POSTER_LINKS.map((l) => l.href)).toContain('/exhibitions/seeing-is-deceiving/optical-toys');
  });
});
