import { act, fireEvent, render, screen, within } from '@testing-library/react';
import WhatScaresYou from '@/app/exhibitions/fear-lab/what-scares-you/page';
import { BUILD_MS } from '@/app/exhibitions/fear-lab/what-scares-you/FearBoxes';
import { BOX_COUNT, CONTENTS, CREATURES, fillBoxes } from '@/app/exhibitions/fear-lab/what-scares-you/boxes';
import { DECIDE_MS, REVEAL_MS } from '@/app/exhibitions/fear-lab/what-scares-you/RustlingBushes';
import { CHOICES } from '@/app/exhibitions/fear-lab/what-scares-you/KnownOrUnknown';
import { ROUNDS, TIGERS, makeRounds, paceFor, pulseFromTaps, tally, type Call } from '@/app/exhibitions/fear-lab/what-scares-you/lab';
import { FEAR_LAB, FEAR_LAB_COPY } from '@/app/exhibitions/fear-lab/fearLab';
import { getLevelConfig } from '@/components/museum-map/data/levels';
import { getRoomByPath } from '@/components/museum-map/data/rooms';

/*
 * What Scares You?: the lab's arithmetic, the fear boxes (with their
 * warning first), known or unknown, the rustling bushes (with its warning
 * first), and the wiring.
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

describe('the fear boxes', () => {
  it('fills a row of five from the eight contents, never all creatures', () => {
    expect(CONTENTS).toHaveLength(8);
    for (let k = 0; k < 40; k++) {
      const row = fillBoxes();
      expect(row).toHaveLength(BOX_COUNT);
      expect(new Set(row).size).toBe(BOX_COUNT);
      expect(row.some((c) => c.kind !== 'creature')).toBe(true);
    }
  });

  it('gives every creature a checked fact with a source, and a credited photograph', () => {
    expect(CREATURES.map((c) => c.id)).toEqual(['cockroach', 'tarantula', 'bat', 'snake', 'rat', 'centipede']);
    for (const c of CREATURES) {
      expect(c.fact.text.length).toBeGreaterThan(20);
      expect(c.fact.sources.length).toBeGreaterThan(0);
      c.fact.sources.forEach((src) => expect(src.href).toMatch(/^https:\/\//));
      expect(c.credit.href).toMatch(/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/);
      expect(c.credit.licence).toMatch(/^(CC0|CC BY 4\.0|CC BY-SA [234]\.0)$/);
      expect(c.src).toMatch(/^\/exhibitions\/fear-lab\/creatures\/.+\.webp$/);
    }
  });

  it('warns first, then opens a box after the build-up, with what was inside', () => {
    render(<WhatScaresYou />);
    expect(screen.getByRole('note')).toHaveTextContent('Startle warning.');
    expect(screen.getByText(FEAR_LAB_COPY.box)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'I’m ready' }));
    const shelf = screen.getByRole('group', { name: 'Fear boxes' });
    expect(within(shelf).getAllByRole('button')).toHaveLength(BOX_COUNT);
    fireEvent.click(within(shelf).getByRole('button', { name: 'Box 2' }));
    expect(screen.getByRole('status')).toHaveTextContent('Box 2 creaks open');
    // Other boxes wait while one opens.
    fireEvent.click(within(shelf).getByRole('button', { name: 'Box 3' }));
    expect(screen.getByRole('status')).toHaveTextContent('Box 2 creaks open');
    act(() => { jest.advanceTimersByTime(BUILD_MS); });
    const heading = screen.getByRole('heading', { level: 2 }).textContent!;
    const creature = CREATURES.find((c) => c.name === heading);
    if (creature) {
      expect(screen.getByText(creature.fact.text)).toBeInTheDocument();
      expect(screen.getByRole('img', { name: creature.alt })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: creature.credit.licence })).toBeInTheDocument();
    } else if (heading === 'Nothing') {
      expect(screen.getByText(FEAR_LAB_COPY.unknown)).toBeInTheDocument();
    } else {
      expect(heading).toBe('Just a pinecone');
      expect(screen.getByText(FEAR_LAB_COPY.pinecone)).toBeInTheDocument();
    }
    fireEvent.click(screen.getByRole('button', { name: 'Close the box' }));
    expect(within(shelf).getByRole('button', { name: /^Box 2, open: / })).toHaveAttribute('aria-disabled', 'true');
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
    expect(screen.getByRole('note')).toHaveTextContent('Eyes will appear suddenly');
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
    // The card shows the room itself: a screenshot, with no illustration's credit.
    expect(FEAR_LAB.interactives?.[0].image).toEqual({ src: '/exhibitions/fear-lab/rooms/what-scares-you.webp', alt: expect.stringMatching(/^The What Scares You\? room/) });
    expect(FEAR_LAB.projector.links.map((l) => l.href)).toEqual(['/exhibitions/fear-lab/what-scares-you']);
    expect(getRoomByPath('/exhibitions/fear-lab/what-scares-you')?.id).toBe('fl-what-scares-you');
    expect(getLevelConfig('/exhibitions/fear-lab/what-scares-you').title).toBe('The Fear Lab');
  });
});
