import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { SOLDIERS } from '@/app/exhibitions/great-war/memorial/soldiers';
import SoldierCard from '@/app/exhibitions/great-war/memorial/SoldierCard';
import TwoMinuteSilence, { inArmisticeSilence } from '@/app/exhibitions/great-war/memorial/TwoMinuteSilence';
import { fieldLayout } from '@/app/exhibitions/great-war/memorial/PoppyField';
import { GREAT_WAR } from '@/app/exhibitions/great-war/greatWar';
import { getLevelConfig } from '@/components/museum-map/data/levels';
import { getRoomByPath } from '@/components/museum-map/data/rooms';

/*
 * The Great War memorial: the eleven soldier cards (data and turning), the
 * poppy field's layout, and the two minutes' silence (countdown and Esc).
 */

describe('the soldier cards', () => {
  it('has all eleven soldiers the owner approved, in order', () => {
    expect(SOLDIERS.map((s) => s.id)).toEqual([
      'gunther', 'stowers', 'stout', 'juan', 'hay', 'healey', 'olson', 'kocak', 'stockham', 'miner', 'henry',
    ]);
  });

  it.each(SOLDIERS.map((s) => [s.name, s] as const))('%s: every card has its facts, a story and at least one source', (_n, s) => {
    expect(s.name).toBeTruthy();
    expect(s.unit).toBeTruthy();
    expect(s.hometown).toBeTruthy();
    expect(s.died).toBeTruthy();
    expect(s.story.length).toBeGreaterThan(0);
    expect(s.sources.length).toBeGreaterThanOrEqual(1);
    for (const src of s.sources) {
      expect(src.label).toBeTruthy();
      expect(src.url).toMatch(/^https?:\/\//);
    }
    expect(s.burial || s.memorial).toBeTruthy();
  });

  it('shows the conflicts the research notes record, honestly', () => {
    const by = Object.fromEntries(SOLDIERS.map((s) => [s.id, s]));
    expect(by.healey.age).toBe('15 (his service record says 18)');
    expect(by.juan.alsoKnownAs).toMatch(/Rivers/);
    expect(by.stockham.born).toMatch(/Detroit/);
    expect(by.stockham.born).toMatch(/New York City/);
    expect(by.kocak.born).toMatch(/^1882/);
    expect(by.kocak.notes?.join(' ')).toMatch(/3 December 1882.*31 December 1882/);
  });

  it('gives Olson no rank and no burial place', () => {
    const olson = SOLDIERS.find((s) => s.id === 'olson')!;
    expect(olson.rank).toBeUndefined();
    expect(olson.burial).toBeUndefined();
    expect(olson.memorial).toMatch(/Bismarck/);
  });

  it('shows the grave plots the notes give', () => {
    const plots = Object.fromEntries(SOLDIERS.filter((s) => s.burial?.plot).map((s) => [s.id, s.burial!.plot]));
    expect(plots).toEqual({
      stowers: 'Plot F, Row 36, Grave 40',
      stout: 'Plot C, Row 41, Grave 14',
      stockham: 'Section C, Block 9, Lot 13, Grave 4',
      henry: 'Section 12, Grave 3434',
    });
  });

  it('turns with a button, and the hidden side is inert', () => {
    const gunther = SOLDIERS[0];
    const { container } = render(<SoldierCard soldier={gunther} />);
    const front = container.querySelector('.gwm-card-front') as HTMLElement;
    const back = container.querySelector('.gwm-card-back') as HTMLElement;
    expect(back).toHaveAttribute('inert');
    expect(front).not.toHaveAttribute('inert');
    expect(screen.getByRole('heading', { level: 3, name: gunther.name })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Turn the card/ }));
    expect(front).toHaveAttribute('inert');
    expect(back).not.toHaveAttribute('inert');
    const links = within(back).getAllByRole('link');
    expect(links.map((a) => a.getAttribute('href'))).toEqual(gunther.sources.map((s) => s.url));
    expect(back).toHaveTextContent('Most Holy Redeemer Cemetery');

    fireEvent.click(screen.getByRole('button', { name: /Turn back to the front/ }));
    expect(back).toHaveAttribute('inert');
  });
});

describe('the poppy field', () => {
  it('draws nothing for no poppies, and every poppy while there is room', () => {
    expect(fieldLayout(0, 800, 400)).toEqual([]);
    expect(fieldLayout(10, 800, 400)).toHaveLength(10);
  });

  it('draws large poppies when there are few, small ones when there are many, and caps the work', () => {
    const few = fieldLayout(10, 800, 400);
    const many = fieldLayout(5000, 800, 400);
    const huge = fieldLayout(100000, 800, 400);
    const avg = (ps: { size: number }[]) => ps.reduce((a, p) => a + p.size, 0) / ps.length;
    expect(avg(few)).toBeGreaterThan(avg(many));
    expect(huge.length).toBeLessThan(10000);
    expect(huge.length).toBe(fieldLayout(1000000, 800, 400).length);
  });

  it('keeps each poppy in its place as the field grows', () => {
    const a = fieldLayout(50, 800, 400).find((p) => p.i === 7)!;
    const b = fieldLayout(51, 800, 400).find((p) => p.i === 7)!;
    expect(b.x / b.size).toBeCloseTo(a.x / a.size, 0);
  });
});

describe('the silence at 11:00', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('knows the two minutes from 11:00 on 11 November', () => {
    expect(inArmisticeSilence(new Date(2026, 10, 11, 11, 0, 0))).toBe(true);
    expect(inArmisticeSilence(new Date(2026, 10, 11, 11, 1, 59))).toBe(true);
    expect(inArmisticeSilence(new Date(2026, 10, 11, 11, 2, 0))).toBe(false);
    expect(inArmisticeSilence(new Date(2026, 10, 11, 10, 59, 59))).toBe(false);
    expect(inArmisticeSilence(new Date(2026, 9, 11, 11, 0, 0))).toBe(false);
  });

  it('keeps two minutes’ silence on request, quietly counts down, and returns', () => {
    jest.setSystemTime(new Date(2026, 9, 24, 15, 0, 0));
    render(<TwoMinuteSilence />);
    expect(screen.getByText('At 11:00 on November 11, people pause in silence to remember.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Keep two minutes’ silence now' }));
    const veil = screen.getByRole('region', { name: 'Two minutes’ silence' });
    expect(veil).toHaveTextContent('2:00');
    expect(screen.getByRole('button', { name: 'End the silence' })).toHaveFocus();

    act(() => { jest.advanceTimersByTime(60_000); });
    expect(veil).toHaveTextContent('1:00');
    act(() => { jest.advanceTimersByTime(61_000); });
    expect(screen.queryByRole('button', { name: 'End the silence' })).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('The silence has ended');
  });

  it('Esc ends the silence at once, and focus goes back', () => {
    jest.setSystemTime(new Date(2026, 9, 24, 15, 0, 0));
    render(<TwoMinuteSilence />);
    const start = screen.getByRole('button', { name: 'Keep two minutes’ silence now' });
    fireEvent.click(start);
    act(() => { jest.advanceTimersByTime(5_000); });
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('button', { name: 'End the silence' })).not.toBeInTheDocument();
    expect(start).toHaveFocus();
  });

  it('holds the silence by itself at 11:00 on 11 November, until 11:02', () => {
    jest.setSystemTime(new Date(2026, 10, 11, 10, 59, 58));
    render(<TwoMinuteSilence />);
    expect(screen.queryByRole('region', { name: 'Two minutes’ silence' })).not.toBeInTheDocument();
    act(() => { jest.advanceTimersByTime(3_000); });
    expect(screen.getByRole('region', { name: 'Two minutes’ silence' })).toBeInTheDocument();
    act(() => { jest.advanceTimersByTime(120_000); });
    expect(screen.queryByRole('button', { name: 'End the silence' })).not.toBeInTheDocument();
  });

  it('does not start the automatic silence again once ended with Esc', () => {
    jest.setSystemTime(new Date(2026, 10, 11, 11, 0, 5));
    render(<TwoMinuteSilence />);
    act(() => { jest.advanceTimersByTime(1_000); });
    expect(screen.getByRole('button', { name: 'End the silence' })).toBeInTheDocument();
    fireEvent.keyDown(window, { key: 'Escape' });
    act(() => { jest.advanceTimersByTime(5_000); });
    expect(screen.queryByRole('button', { name: 'End the silence' })).not.toBeInTheDocument();
  });
});

describe('wiring', () => {
  it('sets both rooms on the landing page, the map and the projector', () => {
    expect(GREAT_WAR.interactives?.map((c) => c.href)).toEqual(['/exhibitions/great-war/silence', '/exhibitions/great-war/memorial']);
    expect(GREAT_WAR.projector.links.map((l) => l.href)).toEqual(['/exhibitions/great-war/silence', '/exhibitions/great-war/memorial']);
    expect(getRoomByPath('/exhibitions/great-war/silence')?.id).toBe('gw-silence');
    expect(getRoomByPath('/exhibitions/great-war/memorial')?.id).toBe('gw-memorial');
    expect(getLevelConfig('/exhibitions/great-war/memorial').title).toBe('The Great War');
  });
});
