import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import LayAStone from '@/app/exhibitions/holocaust/stones/page';
import { FOLLOWS, PROMPTS, PROMPT_AT, PROMPT_MS, planMinute, promptAt } from '@/app/exhibitions/holocaust/stones/stillnessPrompts';
import Stillness from '@/app/exhibitions/holocaust/stones/Stillness';
import { heapLayout } from '@/app/exhibitions/holocaust/stones/MemorialStone';
import { HOLOCAUST, NIEMOLLER, STONE_CUSTOM } from '@/app/exhibitions/holocaust/holocaust';
import { getLevelConfig } from '@/components/museum-map/data/levels';
import { getRoomByPath } from '@/components/museum-map/data/rooms';

/*
 * Never Forget (once Lay a Stone): the heap's layout, laying a stone (and the fallback when the
 * shared count can't be reached), the minute's stillness (Esc, and focus),
 * and its place on the landing page, the map and the projector.
 */

beforeAll(() => {
  // jsdom draws no canvas: the stones are drawn only in a browser.
  jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
});
beforeEach(() => {
  localStorage.clear();
  window.history.replaceState(null, '', '/');
});
afterEach(() => {
  jest.restoreAllMocks();
  jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
});

function mockFetch(handler: (init?: RequestInit) => { status: number; body: unknown }) {
  const fn = jest.fn(async (_url: string, init?: RequestInit) => {
    const { status, body } = handler(init);
    return { ok: status >= 200 && status < 300, status, json: async () => body } as Response;
  });
  global.fetch = fn as unknown as typeof fetch;
  return fn;
}

describe('the heap of stones', () => {
  it('lays nothing for no stones, and every stone while there is room', () => {
    expect(heapLayout(0, 800, 120)).toEqual([]);
    expect(heapLayout(12, 800, 120)).toHaveLength(12);
  });

  it('keeps every stone on the ledge and under the heap’s height', () => {
    for (const s of heapLayout(500, 800, 120)) {
      expect(s.x).toBeGreaterThanOrEqual(0);
      expect(s.x + s.w).toBeLessThanOrEqual(800);
      expect(s.y).toBeGreaterThanOrEqual(0);
      expect(s.y + s.h).toBeLessThanOrEqual(120);
    }
  });

  it('draws large stones when there are few, small ones when there are many, and caps the work', () => {
    const avg = (ss: { w: number }[]) => ss.reduce((a, s) => a + s.w, 0) / ss.length;
    expect(avg(heapLayout(10, 800, 120))).toBeGreaterThan(avg(heapLayout(3000, 800, 120)));
    const full = heapLayout(1_000_000, 800, 120);
    expect(full.length).toBeLessThan(30000);
    expect(full.length).toBe(heapLayout(2_000_000, 800, 120).length);
  });

  it('keeps each stone in its place as more are laid', () => {
    const before = heapLayout(60, 800, 120);
    const after = heapLayout(61, 800, 120);
    expect(after.slice(0, before.length)).toEqual(before);
  });

  it('lays stones of every kind: flat ones, round ones and tall ones, of many sizes', () => {
    const stones = heapLayout(400, 800, 120);
    const ratio = stones.map((s) => s.h / s.w);
    expect(ratio.some((r) => r < 0.45)).toBe(true);
    expect(ratio.some((r) => r > 0.85)).toBe(true);
    const widths = stones.map((s) => s.w);
    expect(Math.max(...widths) / Math.min(...widths)).toBeGreaterThan(2.2);
  });

  // Regression: a full ledge ended in two sheer walls of stones, half the heap's height.
  it('lies as a mound, sloping down to the ends of the ledge', () => {
    const stones = heapLayout(5000, 800, 120);
    const topIn = (from: number, to: number) => Math.max(...stones.filter((s) => s.x + s.w / 2 >= from && s.x + s.w / 2 < to).map((s) => s.y + s.h));
    expect(topIn(0, 20)).toBeLessThan(topIn(380, 420) * 0.45);
    expect(topIn(780, 800)).toBeLessThan(topIn(380, 420) * 0.45);
  });
});

describe('laying a stone', () => {
  it('shows the shared count, lays a stone once, and says so quietly', async () => {
    let count = 26;
    mockFetch((init) => (init?.method === 'POST' ? { status: 200, body: { count: ++count } } : { status: 200, body: { count } }));
    render(<LayAStone />);
    expect(await screen.findByText('26 stones laid')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Lay a stone' }));
    expect(await screen.findByText('27 stones laid')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Thank you. Your stone is on the memorial.');
    expect(screen.getByRole('button', { name: 'Stone laid today' })).toBeDisabled();
  });

  it('says so plainly when no stone has been laid yet', async () => {
    mockFetch(() => ({ status: 200, body: { count: 0 } }));
    render(<LayAStone />);
    expect(await screen.findByText('No stones laid yet')).toBeInTheDocument();
  });

  it('sets one quiet note on the custom beside the invitation, its source in the room’s Sources drawer', async () => {
    // Not poster copy: owner-approved and fact-checked; cited in the drawer, not on the page.
    mockFetch(() => ({ status: 503, body: {} }));
    render(<LayAStone />);
    const panel = screen.getByRole('tabpanel', { name: 'Lay a stone' });
    expect(panel).toHaveTextContent('Lay a stone, to remember.');
    expect(panel).toHaveTextContent(STONE_CUSTOM.text);
    expect(within(panel).queryByRole('link')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Sources' }));
    const drawer = screen.getByRole('dialog', { name: 'Sources' });
    const stone = within(drawer).getByRole('heading', { name: 'Lay a stone' }).closest('section')!;
    expect(within(stone).getByRole('link', { name: 'My Jewish Learning' })).toHaveAttribute('href', 'https://www.myjewishlearning.com/article/ask-the-expert-stones-on-graves/');
    // Every stillness prompt's source is there too, under Stillness.
    const still = within(drawer).getByRole('heading', { name: 'Stillness' }).closest('section')!;
    for (const p of PROMPTS) for (const src of p.sources) expect(within(still).getAllByRole('link', { name: src.label })[0]).toHaveAttribute('href', src.href);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
  });

  it('still shows the stone when the shared count can’t be reached', async () => {
    mockFetch(() => ({ status: 503, body: { error: 'unavailable' } }));
    render(<LayAStone />);
    expect(await screen.findByText('The shared memorial can’t be reached just now.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Lay a stone' }));
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('The memorial can’t be reached just now.'));
  });

  it('moves between the tabs with the arrow keys, and gives each its address', async () => {
    mockFetch(() => ({ status: 503, body: {} }));
    render(<LayAStone />);
    const stone = screen.getByRole('tab', { name: 'Lay a stone' });
    expect(stone).toHaveAttribute('aria-selected', 'true');
    fireEvent.keyDown(stone, { key: 'ArrowRight' });
    const still = screen.getByRole('tab', { name: 'Stillness' });
    expect(still).toHaveAttribute('aria-selected', 'true');
    expect(still).toHaveFocus();
    expect(window.location.hash).toBe('#stillness');
    expect(screen.getByRole('tabpanel', { name: 'Stillness' })).toHaveTextContent('Martin Niemöller');
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
  });
});

describe('the minute’s stillness', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('sets the poster’s words of Martin Niemöller', () => {
    render(<Stillness />);
    expect(screen.getByText(NIEMOLLER.text)).toBeInTheDocument();
    expect(screen.getByText('— Martin Niemöller')).toBeInTheDocument();
  });

  it('keeps a minute’s stillness on request, and ends by itself', () => {
    render(<Stillness />);
    fireEvent.click(screen.getByRole('button', { name: 'Keep a minute’s stillness' }));
    const veil = screen.getByRole('region', { name: 'A minute’s stillness' });
    expect(veil).toHaveTextContent('1:00');
    expect(screen.getByRole('button', { name: 'End the stillness' })).toHaveFocus();
    act(() => { jest.advanceTimersByTime(30_000); });
    expect(veil).toHaveTextContent('0:30');
    act(() => { jest.advanceTimersByTime(31_000); });
    expect(screen.queryByRole('button', { name: 'End the stillness' })).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('A minute has passed. The stillness has ended.');
  });

  it('shows four prompts in the minute, one at a time, each with its source', () => {
    render(<Stillness />);
    fireEvent.click(screen.getByRole('button', { name: 'Keep a minute’s stillness' }));
    const veil = screen.getByRole('region', { name: 'A minute’s stillness' });
    const shown: string[] = [];
    for (let t = 0; t < 60_000; t += 1000) {
      act(() => { jest.advanceTimersByTime(1000); });
      const on = veil.querySelectorAll('[data-prompt]');
      expect(on.length).toBeLessThanOrEqual(1);
      const id = on[0]?.getAttribute('data-prompt');
      if (id && shown[shown.length - 1] !== id) {
        shown.push(id);
        const p = PROMPTS.find((x) => x.id === id)!;
        expect(on[0]).toHaveTextContent(p.text);
        for (const s of p.sources) expect(on[0].querySelector(`a[href="${s.href}"]`)).toHaveTextContent(s.label);
      }
      if (!screen.queryByRole('region', { name: 'A minute’s stillness' })) break;
    }
    expect(shown).toHaveLength(4);
    expect(PROMPTS.find((p) => p.id === shown[0])!.kind).toBe('name');
    expect(PROMPTS.find((p) => p.id === shown[3])!.kind).toBe('question');
  });

  it('draws a different minute each time: a name, words, a name or words, a question', () => {
    expect(PROMPTS).toHaveLength(36);
    expect(PROMPTS.map((p) => p.kind).filter((k) => k === 'name')).toHaveLength(14);
    expect(PROMPTS.map((p) => p.kind).filter((k) => k === 'words')).toHaveLength(15);
    expect(PROMPTS.map((p) => p.kind).filter((k) => k === 'question')).toHaveLength(7);
    for (const p of PROMPTS) expect(p.sources.length).toBeGreaterThan(0);
    let seed = 1;
    const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const seen = new Set<string>();
    let last: string[] = [];
    for (let i = 0; i < 40; i++) {
      const m = planMinute(rand, last);
      expect(m).toHaveLength(4);
      expect(m[0].kind).toBe('name');
      expect(m[1].kind).toBe('words');
      expect(m[3].kind).toBe('question');
      expect(new Set(m.map((p) => p.id)).size).toBe(4);
      // Anne Frank's "good at heart" never stands alone: the next sentence follows it.
      m.forEach((p, k) => { if (FOLLOWS[p.id]) expect(m[k + 1].id).toBe(FOLLOWS[p.id]); });
      expect(m.some((p) => last.includes(p.id) && p.kind === 'question')).toBe(false);
      last = m.map((p) => p.id);
      last.forEach((id) => seen.add(id));
    }
    expect(seen.size).toBeGreaterThan(25);
    expect(promptAt(PROMPT_AT[0] - 1)).toBeNull();
    expect(promptAt(PROMPT_AT[2] + 100)).toBe(2);
    expect(PROMPT_AT[3] + PROMPT_MS).toBeLessThanOrEqual(60_000);
  });

  it('Esc ends it at once, and focus goes back', () => {
    render(<Stillness />);
    const start = screen.getByRole('button', { name: 'Keep a minute’s stillness' });
    fireEvent.click(start);
    act(() => { jest.advanceTimersByTime(5_000); });
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('button', { name: 'End the stillness' })).not.toBeInTheDocument();
    expect(start).toHaveFocus();
  });
});

describe('wiring', () => {
  it('sets the room on the landing page, the map and the projector', () => {
    expect(HOLOCAUST.interactives?.map((c) => c.href)).toEqual(['/exhibitions/holocaust/stones']);
    expect(HOLOCAUST.interactives?.[0].image?.src).toBe('/exhibitions/holocaust/rooms/stones.webp');
    expect(HOLOCAUST.projector.links.map((l) => l.href)).toEqual(['/exhibitions/holocaust/stones']);
    expect(getRoomByPath('/exhibitions/holocaust/stones')?.id).toBe('ho-stones');
    expect(getLevelConfig('/exhibitions/holocaust/stones').title).toBe('Holocaust Memorial Day');
  });
});
