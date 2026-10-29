import { act, fireEvent, render, screen } from '@testing-library/react';
import WhatScaresYou from '@/app/exhibitions/fear-lab/what-scares-you/page';
import { REACH_MS } from '@/app/exhibitions/fear-lab/what-scares-you/MysteryBox';
import { DECIDE_MS, REVEAL_MS } from '@/app/exhibitions/fear-lab/what-scares-you/RustlingBushes';
import { CHOICES } from '@/app/exhibitions/fear-lab/what-scares-you/KnownOrUnknown';
import { ROUNDS, TIGERS, makeRounds, paceFor, pulseFromTaps, tally, type Call } from '@/app/exhibitions/fear-lab/what-scares-you/lab';
import { FEAR_LAB, FEAR_LAB_COPY } from '@/app/exhibitions/fear-lab/fearLab';
import { getLevelConfig } from '@/components/museum-map/data/levels';
import { getRoomByPath } from '@/components/museum-map/data/rooms';

/*
 * What Scares You?: the lab's arithmetic, the mystery box, known or
 * unknown, the rustling bushes (with its warning first), and the wiring.
 */

// Animation frames run on the fake clock, a frame every 16 ms.
beforeEach(() => {
  jest.useFakeTimers();
  jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => setTimeout(() => cb(performance.now()), 16) as unknown as number);
  jest.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) => clearTimeout(id));
  // jsdom has no canvas: the heart monitor draws nothing.
  jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
});
afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

describe('the lab’s arithmetic', () => {
  it('reads a pulse from five or more steady taps, and ignores a long pause', () => {
    expect(pulseFromTaps([0, 800, 1600, 2400])).toBeNull();
    expect(pulseFromTaps([0, 800, 1600, 2400, 3200])).toBe(75);
    expect(pulseFromTaps([0, 1000, 2000, 9000, 9500, 10000, 10500, 11000])).toBe(120);
    expect(pulseFromTaps([0, 700, 1400, 1450, 2100, 2800])).toBe(86);
  });

  it('hides three tigers in eight rounds, and tallies the calls', () => {
    const rounds = makeRounds();
    expect(rounds).toHaveLength(ROUNDS);
    expect(rounds.filter((r) => r.tiger)).toHaveLength(TIGERS);
    const calls = rounds.map((_, i): Call => (i % 2 ? 'tiger' : 'wind'));
    const t = tally(rounds, calls);
    expect(t.fakeAlarms + t.missed + t.spotted + t.calm).toBe(ROUNDS);
    expect(tally([{ bush: 0, tiger: false }, { bush: 1, tiger: true }], ['tiger', 'wind'])).toEqual({ fakeAlarms: 1, missed: 1, spotted: 0, calm: 0 });
  });

  it('quickens the monitor with fright', () => {
    expect(paceFor(1)).toBeGreaterThan(paceFor(0));
    expect(paceFor(5)).toBe(paceFor(1));
  });
});

describe('the mystery box', () => {
  it('opens on a pinecone after a long enough hold, with the poster’s words', () => {
    render(<WhatScaresYou />);
    expect(screen.getByText(FEAR_LAB_COPY.box)).toBeInTheDocument();
    const hold = screen.getByRole('button', { name: 'Hold to reach in' });
    fireEvent.keyDown(hold, { key: ' ' });
    act(() => { jest.advanceTimersByTime(REACH_MS * 0.5); });
    expect(screen.getByRole('status')).toHaveTextContent('Slimy worms?');
    act(() => { jest.advanceTimersByTime(REACH_MS * 0.6); });
    expect(screen.getByRole('heading', { name: 'Just a pinecone' })).toBeInTheDocument();
    expect(screen.getByText(FEAR_LAB_COPY.pinecone)).toBeInTheDocument();
  });

  it('pulls the hand back out when let go early', () => {
    render(<WhatScaresYou />);
    const hold = screen.getByRole('button', { name: 'Hold to reach in' });
    fireEvent.keyDown(hold, { key: ' ' });
    act(() => { jest.advanceTimersByTime(1500); });
    fireEvent.keyUp(hold, { key: ' ' });
    expect(screen.getByRole('status')).toHaveTextContent('You pulled your hand back out.');
    act(() => { jest.advanceTimersByTime(3000); });
    expect(screen.queryByRole('heading', { name: 'Just a pinecone' })).not.toBeInTheDocument();
  });
});

describe('known or unknown', () => {
  it('shows what the poster says after each choice', () => {
    render(<WhatScaresYou />);
    fireEvent.click(screen.getByRole('tab', { name: 'Known or Unknown?' }));
    CHOICES.forEach((c, i) => {
      fireEvent.click(screen.getByRole('button', { name: new RegExp(c.b.text.replace(/[.?]/g, '.')) }));
      expect(screen.getByText(c.poster)).toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: i + 1 < CHOICES.length ? 'Next question' : 'See your choices' }));
    });
    expect(screen.getByRole('list', { name: 'Your choices' }).children).toHaveLength(3);
  });
});

describe('the rustling bushes', () => {
  it('warns before it starts, then plays eight rounds and tallies them', () => {
    render(<WhatScaresYou />);
    fireEvent.click(screen.getByRole('tab', { name: 'The Rustling Bushes' }));
    expect(screen.getByRole('note')).toHaveTextContent('Startle warning.');
    expect(screen.queryByRole('button', { name: 'Tiger! Run!' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'I’m ready' }));
    expect(screen.getByRole('status')).toHaveTextContent('Round 1 of 8');
    fireEvent.click(screen.getByRole('button', { name: 'Tiger! Run!' }));
    act(() => { jest.advanceTimersByTime(REVEAL_MS); });
    // Not answering is staying put.
    for (let r = 1; r < ROUNDS; r++) {
      act(() => { jest.advanceTimersByTime(DECIDE_MS); });
      act(() => { jest.advanceTimersByTime(REVEAL_MS); });
    }
    expect(screen.getByText(FEAR_LAB_COPY.byDesign)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Play again' })).toBeInTheDocument();
  });

  it('keeps sound off until asked, and lets motion be switched off', () => {
    render(<WhatScaresYou />);
    expect(screen.getByRole('button', { name: /Sound/ })).toHaveAttribute('aria-pressed', 'false');
    const motion = screen.getByRole('button', { name: /Motion/ });
    expect(motion).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(motion);
    expect(motion).toHaveAttribute('aria-pressed', 'false');
  });
});

describe('wiring', () => {
  it('sets the room on the landing page, the map and the projector', () => {
    expect(FEAR_LAB.interactives?.map((c) => c.href)).toEqual(['/exhibitions/fear-lab/what-scares-you']);
    expect(FEAR_LAB.interactives?.[0].image?.src).toMatch(/\.svg$/);
    expect(FEAR_LAB.projector.links.map((l) => l.href)).toEqual(['/exhibitions/fear-lab/what-scares-you']);
    expect(getRoomByPath('/exhibitions/fear-lab/what-scares-you')?.id).toBe('fl-what-scares-you');
    expect(getLevelConfig('/exhibitions/fear-lab/what-scares-you').title).toBe('The Fear Lab');
  });
});
