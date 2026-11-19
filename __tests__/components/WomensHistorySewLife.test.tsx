import { fireEvent, render, screen, within } from '@testing-library/react';
import VioletsLife from '@/app/exhibitions/womens-history/violet/page';
import { dealOrder } from '@/app/exhibitions/womens-history/violet/SewLife';
import {
  BORN,
  SEW_CARDS,
  SEW_START,
  checkLine,
  checkStitches,
  clueIsPosters,
  emptySlots,
  keepRight,
  liftCard,
  placeCard,
} from '@/app/exhibitions/womens-history/violet/sewLife';
import { LIFE, VIOLET_SOURCES } from '@/app/exhibitions/womens-history/violet/violetLife';

/*
 * Sew her life together: Violet's room opens on a challenge, the six
 * keepsakes to be put in the order of her life from clues in her story.
 * The clues are the poster's own words; the order is worked out, not read
 * off; wrong stitches come back with a hint; and the room's other modes
 * keep their addresses (#make for the Studio's link).
 */

beforeEach(() => window.history.replaceState(null, '', '/'));

describe('the clues', () => {
  it('are every one the poster’s own words', () => {
    for (const c of [SEW_START, ...SEW_CARDS]) expect(clueIsPosters(c)).toBe(true);
    expect(clueIsPosters({ ...SEW_START, clue: ['was born on the Moon'] })).toBe(false);
  });

  it('follow her story’s own order, each a stop of it', () => {
    const order = LIFE.map((s) => s.id);
    const ids = [SEW_START, ...SEW_CARDS].map((c) => c.id);
    ids.forEach((id) => expect(order).toContain(id));
    expect([...ids].sort((a, b) => order.indexOf(a) - order.indexOf(b))).toEqual(ids);
  });

  it('give no year for three of the six, so the order has to be worked out', () => {
    const withYear = SEW_CARDS.filter((c) => /\b1[89]\d\d\b/.test(c.clue.join(' ')));
    expect(withYear.map((c) => c.id)).toEqual(['family', 'later']);
    // The ages: 1907 + 14 and 1907 + 21.
    expect(SEW_CARDS.find((c) => c.id === 'factory')!.worked).toContain(String(BORN + 14));
    expect(SEW_CARDS.find((c) => c.id === 'marriage')!.worked).toContain(String(BORN + 21));
  });

  it('cite the two dates the hints use in the room’s Sources drawer', () => {
    const group = VIOLET_SOURCES.find((g) => g.title === 'Sew her life: the hints')!;
    expect(group.items.map((i) => i.href)).toEqual([
      'https://www.iwm.org.uk/history/second-world-war/blitz',
      'https://www.iwm.org.uk/history/second-world-war/victory',
    ]);
  });
});

describe('sewing', () => {
  const ids = SEW_CARDS.map((c) => c.id);

  it('places a card, swaps two, and never moves a stitch that holds', () => {
    let s = placeCard(emptySlots(), 'factory', 2);
    expect(s[2]).toBe('factory');
    s = placeCard(s, 'blitz', 0);
    s = placeCard(s, 'blitz', 2); // blitz moves onto factory: factory goes where blitz was
    expect(s[0]).toBe('factory');
    expect(s[2]).toBe('blitz');
    const locked = new Set([0]);
    expect(placeCard(s, 'essex', 0, locked)).toBe(s);
    expect(placeCard(s, 'factory', 3, locked)).toBe(s);
    expect(liftCard(s, 0, locked)).toBe(s);
    expect(liftCard(s, 2)[2]).toBeNull();
  });

  it('checks the stitches, keeps the right ones and hints at the first wrong one', () => {
    const wrong = [ids[1], ids[0], ...ids.slice(2)];
    const c = checkStitches(wrong);
    expect(c.right).toEqual([2, 3, 4, 5]);
    expect(c.done).toBe(false);
    expect(c.hintFor?.id).toBe('marriage');
    expect(keepRight(wrong, c.right)).toEqual([null, null, ...ids.slice(2)]);
    expect(checkLine(c)).toMatch(/^4 of 6/);
    const all = checkStitches(ids);
    expect(all.done).toBe(true);
    expect(all.hintFor).toBeNull();
  });

  it('deals the basket shuffled, never in the answer’s order', () => {
    for (let seed = 0; seed < 300; seed++) {
      const dealt = dealOrder(seed).map((c) => c.id);
      expect([...dealt].sort()).toEqual([...ids].sort());
      expect(dealt).not.toEqual(ids);
    }
  });
});

describe('the room', () => {
  const card = (label: string) => screen.getByRole('button', { name: new RegExp(`^${label}`) });
  const ring = (place: number) => screen.getByRole('button', { name: new RegExp(`^Place ${place}:`) });
  const sew = (order: readonly string[]) =>
    order.forEach((id, i) => {
      const c = SEW_CARDS.find((x) => x.id === id)!;
      fireEvent.click(card(c.label));
      fireEvent.click(ring(i + 2));
    });

  it('opens on the challenge, with Fulham sewn on and six empty rings', () => {
    render(<VioletsLife />);
    expect(screen.getByRole('heading', { name: 'Sew her life together' })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /^Place \d: empty/ })).toHaveLength(6);
    expect(screen.getByRole('button', { name: 'Check the stitches' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Sew her life' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('sends wrong stitches back with a hint, and sews the right ones on', () => {
    render(<VioletsLife />);
    const ids = SEW_CARDS.map((c) => c.id);
    sew([ids[1], ids[0], ...ids.slice(2)]);
    fireEvent.click(screen.getByRole('button', { name: 'Check the stitches' }));
    expect(screen.getByText(/^4 of 6 are sewn on/, { selector: '.whs-said-line' })).toBeInTheDocument();
    expect(screen.getByText(/Add 21 years/, { selector: '.whs-said-hint' })).toBeInTheDocument();
    expect(ring(4)).toHaveAccessibleName(/Family, sewn on/);
    expect(ring(2)).toHaveAccessibleName(/empty/);
    // Put right, and the life is sewn together.
    sew([ids[0], ids[1]]);
    fireEvent.click(screen.getByRole('button', { name: 'Check the stitches' }));
    expect(screen.getByRole('heading', { name: 'Her life, sewn together' })).toBeInTheDocument();
    const list = screen.getByRole('list', { name: 'Her life, in order' });
    expect(within(list).getAllByRole('listitem')).toHaveLength(7);
    expect(list).toHaveTextContent('1921, at 14');
  });

  it('offers to sew one on after two tries', () => {
    render(<VioletsLife />);
    const back = [...SEW_CARDS.map((c) => c.id)].reverse();
    expect(screen.queryByRole('button', { name: 'Sew one on for me' })).toBeNull();
    sew(back);
    fireEvent.click(screen.getByRole('button', { name: 'Check the stitches' }));
    sew(back);
    fireEvent.click(screen.getByRole('button', { name: 'Check the stitches' }));
    fireEvent.click(screen.getByRole('button', { name: 'Sew one on for me' }));
    expect(ring(2)).toHaveAccessibleName(/The factory, sewn on/);
  });

  it('opens her whole story when it is done', () => {
    render(<VioletsLife />);
    sew(SEW_CARDS.map((c) => c.id));
    fireEvent.click(screen.getByRole('button', { name: 'Check the stitches' }));
    fireEvent.click(screen.getByRole('button', { name: /Read her whole story/ }));
    expect(screen.getByRole('img', { name: 'Violet Dina Want' })).toBeInTheDocument();
    expect(window.location.hash).toBe('#violet');
  });

  it('keeps the Studio’s address for Make your own', () => {
    window.history.replaceState(null, '', '/#make');
    render(<VioletsLife />);
    expect(screen.getByRole('button', { name: 'Make your own' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('heading', { name: 'A woman in your life' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Sew her life together' })).toBeNull();
  });
});
