import { fireEvent, render, screen, within } from '@testing-library/react';
import VictorianOpticalToys from '@/app/exhibitions/victorian/optical-toys/page';
import { DISCS, STRIPS, TOY_NOTES } from '@/app/exhibitions/victorian/optical-toys/toysText';
import {
  alternationsPerSecond,
  approach,
  faceAt,
  frameAt,
  picturesPerSecond,
  slitStrength,
  thaumaBlend,
  THAUMA_MERGED,
  THAUMA_SEEN,
  THAUMA_TOP,
  TAU,
  ZOE_FRAMES,
  ZOE_TOP,
} from '@/app/exhibitions/victorian/optical-toys/spin';
import { VICTORIAN } from '@/app/exhibitions/victorian/victorian';
import { getLevelConfig } from '@/components/museum-map/data/levels';
import { getRoomByPath } from '@/components/museum-map/data/rooms';
import sitemap from '@/app/sitemap';

/*
 * Victorian Britain's optical toys: the captions are the posters' own (the
 * toys' history notes are carved out: owner-approved, fact-checked, and set
 * apart from the captions with their sources), the
 * toys never flash faster than three times a second, and under reduced
 * motion they stand still, their pictures side by side, stepped by hand.
 */

const posterText = VICTORIAN.posters.flatMap((p) => p.items).map((it) => ('text' in it && it.text ? it.text : '')).join('\n').replace(/\*/g, '');

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
afterEach(() => reducedMotion(false));

describe('the words', () => {
  it('captions every disc and strip with a line from the posters, word for word', () => {
    for (const c of [...DISCS, ...STRIPS].map((x) => x.caption)) expect(posterText).toContain(c);
  });
});

describe('no flashing', () => {
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
});

describe('the thaumatrope', () => {
  beforeEach(() => window.history.replaceState(null, '', '/exhibitions/victorian/optical-toys'));

  it('twirls and flips, and offers each disc', () => {
    render(<VictorianOpticalToys />);
    expect(screen.getByRole('tab', { name: 'Thaumatrope' })).toHaveAttribute('aria-selected', 'true');
    const twirl = screen.getByRole('button', { name: 'Twirl' });
    fireEvent.click(twirl);
    expect(screen.getByRole('button', { name: 'Let it slow' })).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(screen.getByRole('button', { name: 'Flip the disc' }));
    expect(screen.getByRole('status')).toHaveTextContent(`Back: ${DISCS[0].back}.`);
    fireEvent.click(screen.getByRole('button', { name: 'Railway' }));
    expect(screen.getByRole('button', { name: 'Railway' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText(DISCS[1].caption)).toBeInTheDocument();
  });

  it('shows both sides side by side, stepped by hand', () => {
    render(<VictorianOpticalToys />);
    fireEvent.click(screen.getByRole('button', { name: 'See both sides' }));
    const sides = screen.getByRole('list', { name: /side by side/ });
    expect(within(sides).getAllByRole('button')).toHaveLength(3);
    fireEvent.click(screen.getByRole('button', { name: 'Next side' }));
    expect(screen.getByRole('status')).toHaveTextContent(`Back: ${DISCS[0].back}.`);
    fireEvent.click(screen.getByRole('button', { name: 'Next side' }));
    expect(screen.getByRole('status')).toHaveTextContent(`Together: ${DISCS[0].together}.`);
  });

  it('under reduced motion, stands still: no twirling, the sides side by side', () => {
    reducedMotion(true);
    render(<VictorianOpticalToys />);
    expect(screen.queryByRole('button', { name: 'Twirl' })).not.toBeInTheDocument();
    expect(screen.getByRole('list', { name: /side by side/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Previous side' })).toBeInTheDocument();
  });
});

describe('the zoetrope', () => {
  beforeEach(() => window.history.replaceState(null, '', '/exhibitions/victorian/optical-toys#zoetrope'));

  it('opens from its address, spins, and steps picture by picture', () => {
    render(<VictorianOpticalToys />);
    expect(screen.getByRole('tab', { name: 'Zoetrope' })).toHaveAttribute('aria-selected', 'true');
    fireEvent.click(screen.getByRole('button', { name: 'Spin' }));
    expect(screen.getByRole('button', { name: 'Stop' })).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(screen.getByRole('button', { name: 'Next picture' }));
    expect(screen.getByRole('status')).toHaveTextContent(`Picture 2 of ${ZOE_FRAMES}.`);
    expect(screen.getByRole('button', { name: 'Spin' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Previous picture' }));
    fireEvent.click(screen.getByRole('button', { name: 'Previous picture' }));
    expect(screen.getByRole('status')).toHaveTextContent(`Picture ${ZOE_FRAMES} of ${ZOE_FRAMES}.`);
    fireEvent.click(screen.getByRole('button', { name: 'Snowfall' }));
    expect(screen.getByText(STRIPS[1].caption)).toBeInTheDocument();
  });

  it('under reduced motion, stands still: every picture side by side, stepped by hand', () => {
    reducedMotion(true);
    render(<VictorianOpticalToys />);
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
    window.history.replaceState(null, '', '/exhibitions/victorian/optical-toys');
    render(<VictorianOpticalToys />);
    // The carve-out: these notes are not the posters' words.
    for (const n of Object.values(TOY_NOTES)) expect(posterText).not.toContain(n.text);

    expect(screen.getAllByText(TOY_NOTES.both.text)).toHaveLength(1);
    const thauma = screen.getByRole('tabpanel', { name: 'Thaumatrope' });
    expect(within(thauma).getByText(TOY_NOTES.thaumatrope.text)).toBeInTheDocument();
    expect(within(thauma).getByRole('link', { name: 'Science Museum Group' })).toHaveAttribute('href', 'https://collection.sciencemuseumgroup.org.uk/objects/co8085499');

    fireEvent.click(screen.getByRole('tab', { name: 'Zoetrope' }));
    const zoe = screen.getByRole('tabpanel', { name: 'Zoetrope' });
    expect(within(zoe).getByText(TOY_NOTES.zoetrope.text)).toBeInTheDocument();
    // The zoetrope's note and the note for both cite the V&A.
    const va = within(zoe).getAllByRole('link', { name: 'V&A' });
    expect(va).toHaveLength(2);
    for (const l of va) expect(l).toHaveAttribute('href', VA);
    expect(within(zoe).getByRole('link', { name: 'US Patent 64,117' })).toHaveAttribute('href', 'https://patents.google.com/patent/US64117A/en');
    expect(screen.getAllByText(TOY_NOTES.both.text)).toHaveLength(1);
    expect(TOY_NOTES.both.sources).toEqual([{ label: 'V&A', href: VA }]);
  });
});

describe('wiring', () => {
  it('sets the room on the landing page, the projector, the map and the sitemap', () => {
    expect(VICTORIAN.interactives?.map((c) => [c.href, c.label, c.title])).toEqual([['/exhibitions/victorian/optical-toys', 'Interactive', 'Optical Toys']]);
    expect(VICTORIAN.interactives?.[0].image?.src).toMatch(/\.svg$/);
    expect(VICTORIAN.projector.links.map((l) => l.href)).toEqual(['/exhibitions/victorian/optical-toys']);
    expect(getRoomByPath('/exhibitions/victorian/optical-toys')?.id).toBe('vb-optical-toys');
    expect(getLevelConfig('/exhibitions/victorian/optical-toys').title).toBe('Victorian Britain');
    expect(sitemap().map((e) => e.url)).toContainEqual(expect.stringMatching(/\/exhibitions\/victorian\/optical-toys$/));
  });
});
