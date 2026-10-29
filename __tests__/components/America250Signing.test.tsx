import { fireEvent, render, screen, within } from '@testing-library/react';
import America250Signing from '@/app/exhibitions/america-250/sign/page';
import { COPY_STAGES, SIGN_TEXT } from '@/app/exhibitions/america-250/sign/signText';
import { inkAfter, inkAlpha, INK_PER_DIP, nibQuad, scribbleLine, thin, tracePath } from '@/app/exhibitions/america-250/sign/signing';
import { AMERICA_250 } from '@/app/exhibitions/america-250/america250';
import { getLevelConfig } from '@/components/museum-map/data/levels';
import { getRoomByPath } from '@/components/museum-map/data/rooms';
import sitemap from '@/app/sitemap';

/*
 * America 250's signing room: every line about 1776 is the posters' own, the
 * quill's ink and nib, signing (typed, for the keyboard), and the copies.
 */

/** The posters' words, as read: "*…*" marks italics; quotes and cites both. */
const posterText = AMERICA_250.posters
  .flatMap((p) => p.items)
  .flatMap((it) => ['text' in it && it.text ? it.text : '', 'cite' in it && it.cite ? it.cite : ''])
  .join('\n')
  .replace(/\*/g, '');
const straight = (s: string) => s.replace(/[’‘]/g, "'");

beforeAll(() => {
  // jsdom draws nothing; the room carries on without a canvas.
  jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
});

describe('the words', () => {
  it('quotes the posters word for word, and adds no facts of its own', () => {
    const quoted = [SIGN_TEXT.carroll.text, SIGN_TEXT.epigraph.text, SIGN_TEXT.epigraph.cite, ...SIGN_TEXT.signed, SIGN_TEXT.copiesIntro, SIGN_TEXT.copiesClose, ...COPY_STAGES.map((s) => s.quote)];
    for (const q of quoted) expect(posterText).toContain(q);
  });

  it('names the copies as the posters do, oldest first', () => {
    expect(COPY_STAGES.map((s) => s.id)).toEqual(['rough', 'fair', 'engrossed', 'stone', 'transcription']);
    for (const name of ["Jefferson's Rough Draft", 'July 4 Fair Copy', 'Engrossed Copy']) expect(posterText).toContain(name);
    expect(straight(COPY_STAGES[0].name)).toBe("Jefferson's Rough Draft");
    // The one legible line on the sheet, and the words struck from the draft
    expect(posterText).toContain('We hold these truths to be self-evident');
    expect(posterText).toContain('sacred and undeniable');
  });
});

describe('the quill', () => {
  it('runs dry after a dip of writing, the ink thinning as it goes', () => {
    expect(inkAfter(1, INK_PER_DIP / 2)).toBeCloseTo(0.5);
    expect(inkAfter(0.1, 10)).toBe(0);
    expect(inkAlpha(1)).toBeGreaterThan(inkAlpha(0.3));
    expect(inkAlpha(0.3)).toBeGreaterThan(inkAlpha(0));
  });

  it('writes broad down-strokes and hairlines along the nib, as a broad-nibbed quill does', () => {
    const area = (q: [number, number][]) => Math.abs(q.reduce((a, [x, y], i) => { const [nx, ny] = q[(i + 1) % q.length]; return a + x * ny - nx * y; }, 0)) / 2;
    const down = area(nibQuad({ x: 0, y: 0 }, { x: 0, y: 0.1 }, 1));
    const along = area(nibQuad({ x: 0, y: 0 }, { x: Math.cos((-40 * Math.PI) / 180) * 0.1, y: Math.sin((-40 * Math.PI) / 180) * 0.1 }, 1));
    expect(down).toBeGreaterThan(along * 10);
  });

  it('keeps a stroke’s ends and drops crowded points; a copy is traced the same way each time', () => {
    const s = Array.from({ length: 50 }, (_, i) => ({ x: i * 0.0005, y: 0 }));
    const t = thin(s);
    expect(t[0]).toEqual(s[0]);
    expect(t[t.length - 1]).toEqual(s[s.length - 1]);
    expect(t.length).toBeLessThan(s.length);
    expect(tracePath([s], 700, 0.004, 3)).toBe(tracePath([s], 700, 0.004, 3));
    expect(scribbleLine(5, 0, 100, 500, 10)).toBe(scribbleLine(5, 0, 100, 500, 10));
    expect(scribbleLine(5, 0, 100, 500, 10)).toMatch(/^M/);
  });
});

describe('the room', () => {
  beforeEach(() => window.history.replaceState(null, '', '/exhibitions/america-250/sign'));

  it('has two tabs, and the keyboard moves between them', () => {
    render(<America250Signing />);
    const sign = screen.getByRole('tab', { name: /Sign your name/ });
    const copies = screen.getByRole('tab', { name: /A copy of a copy/ });
    expect(sign).toHaveAttribute('aria-selected', 'true');
    fireEvent.keyDown(sign, { key: 'ArrowRight' });
    expect(copies).toHaveAttribute('aria-selected', 'true');
    expect(copies).toHaveFocus();
    expect(window.location.hash).toBe('#copies');
  });

  it('signs by keyboard: type a name and an address, put your name to it, and the posters answer', () => {
    render(<America250Signing />);
    const seal = screen.getByRole('button', { name: 'Put your name to it' });
    expect(seal).toBeDisabled();
    expect(screen.getByText(SIGN_TEXT.privacy)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Type it instead' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Your name' }), { target: { value: 'A. Visitor' } });
    fireEvent.change(screen.getByRole('textbox', { name: SIGN_TEXT.addressLabel }), { target: { value: 'Baltimore' } });
    expect(seal).toBeEnabled();
    fireEvent.click(seal);
    expect(screen.getByRole('status')).toHaveTextContent('Signed.');
    for (const line of SIGN_TEXT.signed) expect(screen.getByText(line)).toBeInTheDocument();
    expect(screen.getByText(SIGN_TEXT.epigraph.text)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /with your signature/ })).toHaveTextContent('A. Visitor');
    expect(screen.getByRole('img', { name: /with your signature/ })).toHaveTextContent('of Baltimore');
  });

  it('dips the quill', () => {
    render(<America250Signing />);
    fireEvent.click(screen.getByRole('button', { name: 'Dip the quill in the ink' }));
    expect(screen.getByRole('status')).toHaveTextContent('The quill is full of ink.');
  });

  it('follows the signature from copy to copy, to the transcription set in type', () => {
    render(<America250Signing />);
    fireEvent.click(screen.getByRole('button', { name: 'Type it instead' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Your name' }), { target: { value: 'A. Visitor' } });
    fireEvent.click(screen.getByRole('button', { name: 'Put your name to it' }));
    fireEvent.click(screen.getByRole('button', { name: 'Follow it from copy to copy' }));
    const panel = screen.getByRole('tabpanel', { name: /A copy of a copy/ });
    expect(within(panel).getByText(COPY_STAGES[0].quote)).toBeInTheDocument();
    expect(within(panel).getByRole('button', { name: 'Earlier' })).toBeDisabled();
    const next = within(panel).getByRole('button', { name: 'The next copy' });
    fireEvent.click(next);
    fireEvent.click(next);
    expect(screen.getByRole('status')).toHaveTextContent('3 of 5: The Engrossed Copy');
    expect(screen.getByRole('img', { name: /with your signature/ })).toHaveTextContent('A. Visitor');
    fireEvent.click(next);
    fireEvent.click(next);
    expect(next).toBeDisabled();
    expect(within(panel).getByText(SIGN_TEXT.copiesClose)).toBeInTheDocument();
    fireEvent.change(within(panel).getByRole('textbox', { name: SIGN_TEXT.printedNameLabel }), { target: { value: 'Ada Visitor' } });
    expect(screen.getByRole('img', { name: 'A printed page' })).toHaveTextContent('Ada Visitor');
    // Any copy can be chosen directly
    fireEvent.click(within(panel).getByRole('button', { name: /Rough Draft/ }));
    expect(within(panel).getByText(COPY_STAGES[0].quote)).toBeInTheDocument();
  });
});

describe('wiring', () => {
  it('sets the room on the landing page, the projector, the map and the sitemap', () => {
    expect(AMERICA_250.interactives?.map((c) => [c.href, c.label, c.title])).toEqual([['/exhibitions/america-250/sign', 'Interactive', 'Put Your Name to It']]);
    expect(AMERICA_250.interactives?.[0].image?.src).toMatch(/\.svg$/);
    expect(AMERICA_250.projector.links.map((l) => l.href)).toEqual(['/exhibitions/america-250/sign']);
    expect(getRoomByPath('/exhibitions/america-250/sign')?.id).toBe('ap-sign');
    expect(getLevelConfig('/exhibitions/america-250/sign').title).toBe('America 250');
    expect(getLevelConfig('/exhibitions/america-250').floorPlan?.rooms.map((r) => r.path)).toContain('/exhibitions/america-250/sign');
    expect(sitemap().map((e) => e.url)).toContainEqual(expect.stringMatching(/\/exhibitions\/america-250\/sign$/));
  });
});
