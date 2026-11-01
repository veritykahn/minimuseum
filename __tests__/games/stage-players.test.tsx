import { act, render } from '@testing-library/react';
import StagePlayers from '@/app/exhibitions/harlem-renaissance/jazz-lab/StagePlayers';
import type { BandInstrumentId } from '@/app/exhibitions/harlem-renaissance/jazz-lab/data';

/*
 * Build a Band's stage floor: each instrument added brings its player on
 * stage (walking on from the nearer wing); sent off, the player walks off
 * and is gone. Decorative, so hidden from screen readers.
 */

const players = (c: HTMLElement) => [...c.querySelectorAll<HTMLElement>('.jl-player')].map((p) => p.dataset.player);

describe('the players on the stage', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('brings a player on for each instrument added, from the nearer wing, the soloist in the spotlight', () => {
    const { container, rerender } = render(<StagePlayers active={new Set<BandInstrumentId>()} spotlight={null} />);
    const floor = container.querySelector('.jl-stage-floor')!;
    expect(floor).toHaveAttribute('aria-hidden', 'true');
    expect(players(container)).toEqual([]);

    rerender(<StagePlayers active={new Set<BandInstrumentId>(['drums'])} spotlight="drums" />);
    expect(players(container)).toEqual(['drums']);
    const drums = container.querySelector<HTMLElement>('[data-player=drums]')!;
    expect(drums.style.getPropertyValue('--from')).toBe('-1');
    expect(drums).toHaveClass('is-solo');
    expect(drums.querySelector('.jl-player-light')).not.toBeNull();

    rerender(<StagePlayers active={new Set<BandInstrumentId>(['drums', 'trumpet'])} spotlight={null} />);
    expect(players(container)).toEqual(['drums', 'trumpet']);
    expect(container.querySelector<HTMLElement>('[data-player=trumpet]')!.style.getPropertyValue('--from')).toBe('1');
    expect(container.querySelector('.is-solo')).toBeNull();
  });

  it('walks a player off when sent off stage, then they are gone; brought straight back, they stay', () => {
    const { container, rerender } = render(<StagePlayers active={new Set<BandInstrumentId>(['bass', 'piano'])} spotlight={null} />);
    rerender(<StagePlayers active={new Set<BandInstrumentId>(['piano'])} spotlight={null} />);
    expect(container.querySelector('[data-player=bass]')).toHaveClass('is-leaving');
    act(() => {
      jest.advanceTimersByTime(700);
    });
    expect(players(container)).toEqual(['piano']);

    // Off and straight back on: on stage, not leaving.
    rerender(<StagePlayers active={new Set<BandInstrumentId>([])} spotlight={null} />);
    rerender(<StagePlayers active={new Set<BandInstrumentId>(['piano'])} spotlight={null} />);
    expect(container.querySelector('[data-player=piano]')).not.toHaveClass('is-leaving');
    act(() => {
      jest.advanceTimersByTime(700);
    });
    expect(players(container)).toEqual(['piano']);
  });
});
