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
    expect(tally([{ bush: 0, tiger: false, spot: 0, clue: 'leaves' }, { bush: 1, tiger: true, spot: 0, clue: 'tail' }], ['tiger', 'wind'])).toEqual({ fakeAlarms: 1, missed: 1, spotted: 0, calm: 0 });
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

@@NEW@@
describe('wiring', () => {
  it('sets the room on the landing page, the map and the projector', () => {
    expect(FEAR_LAB.interactives?.map((c) => c.href)).toEqual(['/exhibitions/fear-lab/what-scares-you']);
    // The owner's illustration of the boxes, credited on the card.
    expect(FEAR_LAB.interactives?.[0].image).toMatchObject({ src: '/exhibitions/fear-lab/landing-fear-boxes.webp', credit: 'Illustration made with Leonardo.Ai' });
    expect(FEAR_LAB.projector.links.map((l) => l.href)).toEqual(['/exhibitions/fear-lab/what-scares-you']);
    expect(getRoomByPath('/exhibitions/fear-lab/what-scares-you')?.id).toBe('fl-what-scares-you');
    expect(getLevelConfig('/exhibitions/fear-lab/what-scares-you').title).toBe('The Fear Lab');
  });
});
