import { readFileSync } from 'fs';
import { join } from 'path';
import { act, fireEvent, render, screen } from '@testing-library/react';
import HallSound, { HALL_SOUND_KEY, isHallRoute, unlockHallSound } from '@/components/HallSound';
import { setMuseumSound } from '@/lib/museumSound';
import { MUSEUM_SOUND_KEY, resetMuseumSoundForTests, setHallDim } from '@/lib/museumSound';

/*
 * The halls' sound: one audio element for the whole visit, mounted in the
 * root layout. No button until the owner's file is there, off until the
 * visitor turns it on, playing on through the Great Hall and the floors'
 * halls, and fading out in an exhibition's rooms.
 */

let pathname = '/greathall';
jest.mock('next/navigation', () => ({
  usePathname: () => pathname,
}));

describe('HallSound', () => {
  let made: HTMLAudioElement[] = [];
  let playResult: () => Promise<void>;
  const RealAudio = window.Audio;
  const RealAudioPrototype = RealAudio.prototype;

  beforeEach(() => {
    jest.useFakeTimers();
    made = [];
    pathname = '/greathall';
    playResult = () => Promise.resolve();
    window.sessionStorage.clear();
    resetMuseumSoundForTests();
    window.Audio = jest.fn(() => {
      const a = new RealAudio();
      let paused = true;
      Object.defineProperty(a, 'paused', { get: () => paused });
      a.play = jest.fn(() => {
        paused = false;
        return playResult().catch((e) => {
          paused = true;
          throw e;
        });
      });
      a.pause = jest.fn(() => {
        paused = true;
      });
      made.push(a);
      return a;
    }) as unknown as typeof Audio;
    window.Audio.prototype = RealAudioPrototype;
  });
  afterEach(() => {
    jest.useRealTimers();
    window.Audio = RealAudio;
  });

  /** The file's metadata arrives: the button may show. */
  const loaded = () =>
    act(() => {
      made[0].dispatchEvent(new Event('loadedmetadata'));
    });
  /** Lets a play() settle, then the fades run to their end. */
  const settle = async () => {
    await act(async () => {});
    await act(async () => {
      jest.advanceTimersByTime(2000);
    });
  };

  it('knows the halls: the Great Hall and every floor, not the rooms', () => {
    expect(isHallRoute('/greathall')).toBe(true);
    expect(isHallRoute('/greathall/')).toBe(true);
    expect(isHallRoute('/exhibitions/ground-floor')).toBe(true);
    expect(isHallRoute('/exhibitions/first-floor')).toBe(true);
    expect(isHallRoute('/exhibitions/second-floor')).toBe(true);
    expect(isHallRoute('/exhibitions/third-floor')).toBe(true);
    expect(isHallRoute('/exhibitions/moon')).toBe(false);
    expect(isHallRoute('/exhibitions/ground-floor-x')).toBe(false);
    expect(isHallRoute('/')).toBe(false);
    expect(isHallRoute(null)).toBe(false);
  });

  it('is unlocked by the door’s sound switch, silently, and heard as the visitor walks into the Great Hall', async () => {
    pathname = '/';
    const { rerender } = render(<HallSound />);
    // The press at the door: the hall's audio is made and played muted, then paused.
    act(() => {
      setMuseumSound(true);
      unlockHallSound();
    });
    expect(made).toHaveLength(1);
    expect(made[0].play).toHaveBeenCalledTimes(1);
    expect(made[0].muted).toBe(true);
    await act(async () => {});
    expect(made[0].paused).toBe(true);
    expect(made[0].muted).toBe(false);
    // Through the door: the same audio, played and faded in.
    pathname = '/greathall';
    rerender(<HallSound />);
    loaded();
    await settle();
    expect(made).toHaveLength(1);
    expect(made[0].play).toHaveBeenCalledTimes(2);
    expect(made[0].volume).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: 'Sound on' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('shows no button while the sound file is not there', () => {
    render(<HallSound />);
    expect(screen.queryByRole('button')).toBeNull();
    expect(made[0].getAttribute('src')).toBe('/greathall/sound/hall.mp3');
  });

  it('makes no audio at all outside the halls', () => {
    pathname = '/exhibitions/moon';
    render(<HallSound />);
    expect(made).toHaveLength(0);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('once the file loads, offers the sound, off until chosen, and keeps the choice', async () => {
    render(<HallSound />);
    loaded();
    const button = screen.getByRole('button', { name: 'Hear the hall' });
    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(made[0].play).not.toHaveBeenCalled();
    await act(async () => {
      fireEvent.click(button);
    });
    expect(made[0].play).toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Sound on' })).toHaveAttribute('aria-pressed', 'true');
    expect(window.sessionStorage.getItem(MUSEUM_SOUND_KEY)).toBe('on');
    await settle();
    expect(made[0].volume).toBeCloseTo(0.6);

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Sound on' }));
    });
    expect(screen.getByRole('button', { name: 'Hear the hall' })).toHaveAttribute('aria-pressed', 'false');
    expect(window.sessionStorage.getItem(MUSEUM_SOUND_KEY)).toBe('off');
    await settle();
    expect(made[0].volume).toBe(0);
    expect(made[0].pause).toHaveBeenCalled();
  });

  it('plays on unbroken up into every floor, with one audio element and the button following', async () => {
    const { rerender } = render(<HallSound />);
    loaded();
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Hear the hall' }));
    });
    await settle();
    for (const floor of ['ground-floor', 'first-floor', 'second-floor', 'third-floor']) {
      pathname = `/exhibitions/${floor}`;
      rerender(<HallSound />);
      await settle();
      expect(screen.getByRole('button', { name: 'Sound on' })).toBeInTheDocument();
      expect(made[0].pause).not.toHaveBeenCalled();
      expect(made[0].volume).toBeCloseTo(0.6);
    }
    pathname = '/greathall';
    rerender(<HallSound />);
    await settle();
    expect(made).toHaveLength(1);
    expect(made[0].play).toHaveBeenCalledTimes(1);
    expect(made[0].pause).not.toHaveBeenCalled();
    expect(document.querySelectorAll('.hall-sound')).toHaveLength(1);
  });

  it('fades out and pauses in an exhibition, and comes back on in a hall', async () => {
    const { rerender } = render(<HallSound />);
    loaded();
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Hear the hall' }));
    });
    await settle();

    pathname = '/exhibitions/moon';
    rerender(<HallSound />);
    expect(screen.queryByRole('button')).toBeNull();
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    expect(made[0].volume).toBeGreaterThan(0);
    expect(made[0].pause).not.toHaveBeenCalled();
    await settle();
    expect(made[0].volume).toBe(0);
    expect(made[0].pause).toHaveBeenCalledTimes(1);

    pathname = '/exhibitions/ground-floor';
    rerender(<HallSound />);
    await settle();
    expect(made[0].play).toHaveBeenCalledTimes(2);
    expect(made[0].volume).toBeCloseTo(0.6);
    expect(screen.getByRole('button', { name: 'Sound on' })).toBeInTheDocument();
    expect(made).toHaveLength(1);
  });

  it('stays off in a room if it was off in the hall', async () => {
    const { rerender } = render(<HallSound />);
    loaded();
    pathname = '/exhibitions/moon';
    rerender(<HallSound />);
    pathname = '/exhibitions/first-floor';
    rerender(<HallSound />);
    await settle();
    expect(made[0].play).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Hear the hall' })).toBeInTheDocument();
  });

  it('after a reload, picks the choice back up, showing off while the browser will not play yet', async () => {
    window.sessionStorage.setItem(HALL_SOUND_KEY, '1');
    playResult = () => Promise.reject(new DOMException('not allowed', 'NotAllowedError'));
    const { rerender } = render(<HallSound />);
    loaded();
    await settle();
    expect(made[0].play).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: 'Hear the hall' })).toHaveAttribute('aria-pressed', 'false');
    expect(window.sessionStorage.getItem(HALL_SOUND_KEY)).toBe('1');

    // The visitor has touched the page now; the next hall plays it.
    playResult = () => Promise.resolve();
    pathname = '/exhibitions/second-floor';
    rerender(<HallSound />);
    await settle();
    expect(screen.getByRole('button', { name: 'Sound on' })).toHaveAttribute('aria-pressed', 'true');
    expect(made[0].volume).toBeCloseTo(0.6);
  });

  it('steps back when a floor dims it, and comes back up', async () => {
    window.sessionStorage.setItem(MUSEUM_SOUND_KEY, 'on');
    pathname = '/exhibitions/first-floor';
    render(<HallSound />);
    loaded();
    await settle();
    expect(made[0].volume).toBeCloseTo(0.6);
    act(() => setHallDim(0.1));
    await settle();
    expect(made[0].volume).toBeCloseTo(0.06);
    act(() => setHallDim(1));
    await settle();
    expect(made[0].volume).toBeCloseTo(0.6);
  });

  it('plays straight away after a reload where the browser allows it', async () => {
    window.sessionStorage.setItem(HALL_SOUND_KEY, '1');
    render(<HallSound />);
    loaded();
    await settle();
    expect(made[0].play).toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Sound on' })).toBeInTheDocument();
  });
});

describe('HallSound, mounted once', () => {
  /* The halls share the root layout's one copy; no page makes its own. */
  it('is rendered by the root layout and by no hall page', () => {
    const read = (f: string) => readFileSync(join(__dirname, '..', '..', f), 'utf8');
    expect(read('app/layout.tsx')).toMatch(/<HallSound \/>/);
    for (const f of [
      'app/greathall/page.tsx',
      'components/FloorPage.tsx',
      'app/exhibitions/ground-floor/page.tsx',
      'app/exhibitions/first-floor/page.tsx',
      'app/exhibitions/second-floor/page.tsx',
      'app/exhibitions/third-floor/page.tsx',
    ]) {
      expect(read(f)).not.toMatch(/<HallSound/);
    }
  });
});
