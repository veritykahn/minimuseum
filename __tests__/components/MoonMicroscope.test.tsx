import { fireEvent, render, screen } from '@testing-library/react';
import MoonMicroscope from '@/app/exhibitions/moon/microscope/page';
import { blurFor, FOCUS_AT } from '@/app/exhibitions/moon/microscope/focus';
import { makeSlide } from '@/app/exhibitions/moon/microscope/grains';
import { freshState, releaseCloth, wipeStep } from '@/app/exhibitions/moon/microscope/wipe';
import { MOON, REGOLITH } from '@/app/exhibitions/moon/moon';
import { getLevelConfig } from '@/components/museum-map/data/levels';
import { getRoomByPath } from '@/components/museum-map/data/rooms';

/*
 * Under the Microscope: the slides, the cloth, the focus, the room's tabs,
 * and its wiring.
 */

// jsdom has no canvas: the eyepiece draws nothing.
beforeAll(() => {
  jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
});
afterAll(() => jest.restoreAllMocks());

describe('the slides', () => {
  it('lays the same grains every time', () => {
    expect(makeSlide('moon')).toEqual(makeSlide('moon'));
    expect(makeSlide('wind').length).toBeGreaterThan(50);
  });

  it('draws Moon dust with sharper outlines than wind-shaped grains', () => {
    // How far an outline strays from round: the spread of its radii.
    const spread = (s: number[]) => Math.max(...s) - Math.min(...s);
    const avg = (id: 'moon' | 'wind') => {
      const gs = makeSlide(id).filter((g) => g.kind === 'grain');
      return gs.reduce((a, g) => a + spread(g.shape), 0) / gs.length;
    };
    expect(avg('moon')).toBeGreaterThan(avg('wind') * 2);
  });
});

describe('the cloth', () => {
  const cloth = { x: 0, y: 0, vx: 0.01, vy: 0, r: 0.3 };

  it('picks up Moon dust, which travels with it', () => {
    const grains = makeSlide('moon');
    const s = freshState(grains);
    const touched = wipeStep(grains, s, cloth, true, undefined, () => 1);
    expect(touched).toBeGreaterThan(0);
    const stuck = [...s.stuck].findIndex((v) => v === 1);
    wipeStep(grains, s, { ...cloth, x: 0.5 }, true, undefined, () => 1);
    expect(s.x[stuck]).toBeGreaterThan(0.1);
    releaseCloth(s);
    expect(s.stuck.every((v) => v === 0)).toBe(true);
  });

  it('pushes Earth grains out of its way and keeps none', () => {
    const grains = makeSlide('water');
    const s = freshState(grains);
    wipeStep(grains, s, cloth, false);
    expect(s.stuck.every((v) => v === 0)).toBe(true);
    grains.forEach((g, i) => {
      expect(Math.hypot(s.x[i], s.y[i])).toBeGreaterThanOrEqual(Math.min(Math.hypot(g.x, g.y), cloth.r) - 1e-6);
    });
  });
});

describe('the focus', () => {
  it('is sharp only near the mark for each power', () => {
    FOCUS_AT.forEach((at, power) => {
      expect(blurFor(at, power)).toBe(0);
      expect(blurFor(at + 20, power)).toBeGreaterThan(5);
    });
    expect(blurFor(0, 2)).toBe(12);
  });
});

describe('the room', () => {
  it('sets the poster’s words for each slide, and keeps the knob and tabs keyboard-operable', () => {
    render(<MoonMicroscope />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Under the Microscope');
    expect(screen.getByText(`${REGOLITH.unlike} ${REGOLITH.jagged}`)).toBeInTheDocument();

    const knob = screen.getByRole('slider', { name: 'Focus' });
    expect(knob).toHaveAttribute('aria-valuetext', 'Blurry');
    for (let i = 0; i < 8; i++) fireEvent.keyDown(knob, { key: 'ArrowUp' });
    expect(knob).toHaveAttribute('aria-valuenow', '40');
    expect(knob).toHaveAttribute('aria-valuetext', 'In focus');
    expect(screen.getByRole('status')).toHaveTextContent('In focus.');

    const moonTab = screen.getByRole('tab', { name: 'Moon Dust' });
    fireEvent.keyDown(moonTab, { key: 'ArrowRight' });
    expect(screen.getByRole('tab', { name: "Earth's Soil" })).toHaveAttribute('aria-selected', 'true');
    fireEvent.click(screen.getByRole('button', { name: 'Water' }));
    expect(screen.getByText('water', { selector: 'mark' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: 'Side by Side' }));
    expect(screen.getByRole('slider', { name: 'Move the dividing line' })).toBeInTheDocument();
    expect(screen.getByText(`${REGOLITH.surface} ${REGOLITH.differences}`)).toBeInTheDocument();
  });
});

describe('wiring', () => {
  it('sets the room on the landing page, the map and the projector', () => {
    expect(MOON.interactives?.map((c) => c.href)).toEqual(['/exhibitions/moon/microscope']);
    expect(MOON.interactives?.[0].image?.src).toMatch(/\.svg$/);
    expect(MOON.projector.links.map((l) => l.href)).toEqual(['/exhibitions/moon/microscope']);
    expect(getRoomByPath('/exhibitions/moon/microscope')?.id).toBe('mo-microscope');
    expect(getLevelConfig('/exhibitions/moon/microscope').title).toBe('Our Incredible Moon');
  });
});
