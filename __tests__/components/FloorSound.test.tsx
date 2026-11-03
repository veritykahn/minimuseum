import { useRef } from 'react';
import { act, render } from '@testing-library/react';
import { FLOOR_LEVEL, useFloorSound } from '@/components/FloorSound';
import { floorSoundsOnDisk } from '@/components/exhibition/posterSounds';
import { hallDim, isMuseumSoundOn, setMuseumSound } from '@/lib/museumSound';
import { FIRST_FLOOR, GROUND_FLOOR, SECOND_FLOOR } from '@/lib/floors';

/*
 * The museum's one sound switch, and the floors' halls: each room heard
 * faintly from its doorway as its card passes, the hall stepping back, and
 * near silence passing the Holocaust exhibition.
 */

describe('the museum sound switch', () => {
  it('is off until turned on, and kept for the visit', () => {
    expect(isMuseumSoundOn()).toBe(false);
    setMuseumSound(true);
    expect(window.sessionStorage.getItem('mm-sound')).toBe('on');
  });
});

describe('floor sound', () => {
  let made: HTMLAudioElement[];
  beforeEach(() => {
    made = [];
    const Real = window.Audio;
    jest.spyOn(window, 'Audio').mockImplementation((src?: string) => {
      const a = new Real(src);
      let paused = true;
      Object.defineProperty(a, 'paused', { get: () => paused });
      a.play = jest.fn(() => {
        paused = false;
        return Promise.resolve();
      });
      a.pause = jest.fn(() => {
        paused = true;
      });
      made.push(a);
      return a;
    });
    // Each frame runs at once (and hands back no pending frame).
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(0);
      return 0;
    });
  });
  afterEach(() => jest.restoreAllMocks());

  const SLUGS = ['great-war', 'harlem-renaissance', 'holocaust'];
  const SOUNDS = { 'great-war': '/gw.mp3', 'harlem-renaissance': '/hr.mp3' };

  function Floor() {
    const ref = useRef<HTMLDivElement>(null);
    useFloorSound(SLUGS, SOUNDS, ref);
    return <div ref={ref} data-testid="scroller" />;
  }
  const scrollTo = (el: HTMLElement, at: number) => {
    Object.defineProperty(el, 'clientWidth', { value: 1000, configurable: true });
    el.scrollLeft = at * 1000;
    act(() => {
      el.dispatchEvent(new Event('scroll'));
    });
  };

  it('stays silent, and downloads nothing, with sound off', () => {
    const { getByTestId } = render(<Floor />);
    scrollTo(getByTestId('scroller'), 0);
    expect(made).toHaveLength(0);
    expect(hallDim()).toBe(1);
  });

  it('plays the room in front of the visitor, a little of each between two, and falls quiet at the Holocaust', () => {
    act(() => setMuseumSound(true));
    const { getByTestId } = render(<Floor />);
    const el = getByTestId('scroller');
    scrollTo(el, 0);
    expect(made).toHaveLength(1);
    expect(made[0].volume).toBeCloseTo(FLOOR_LEVEL);
    expect(made[0].play).toHaveBeenCalled();

    scrollTo(el, 0.5);
    expect(made).toHaveLength(2);
    expect(made[0].volume).toBeCloseTo(FLOOR_LEVEL / 2);
    expect(made[1].volume).toBeCloseTo(FLOOR_LEVEL / 2);

    scrollTo(el, 2);
    expect(made[0].pause).toHaveBeenCalled();
    expect(made[1].pause).toHaveBeenCalled();
    expect(hallDim()).toBeLessThan(0.1);
  });

  it('turns everything off with the switch, and gives the hall back', () => {
    act(() => setMuseumSound(true));
    const { getByTestId, unmount } = render(<Floor />);
    scrollTo(getByTestId('scroller'), 0);
    act(() => setMuseumSound(false));
    expect(made[0].pause).toHaveBeenCalled();
    expect(hallDim()).toBe(1);
    unmount();
  });

  it('never finds a sound for the Holocaust, and finds no file the floors do not have', () => {
    const slugs = [GROUND_FLOOR, FIRST_FLOOR, SECOND_FLOOR].flatMap((f) => f.exhibitions.map((e) => e.slug));
    const found = floorSoundsOnDisk(slugs) ?? {};
    expect(found.holocaust).toBeUndefined();
    for (const src of Object.values(found)) expect(src).toMatch(/^\/exhibitions\/[a-z0-9-]+\/poster-sound\/[a-z0-9]+\.mp3$/);
  });
});
