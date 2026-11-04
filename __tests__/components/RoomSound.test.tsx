import { act, fireEvent, render, screen } from '@testing-library/react';
import RoomSound, { DUCK_LEVEL, ROOM_LEVEL, useRoomSound } from '@/components/exhibition/RoomSound';
import { posterSoundsOnDisk } from '@/components/exhibition/posterSounds';
import { HOLOCAUST } from '@/app/exhibitions/holocaust/holocaust';
import { MUSEUM_SOUND_KEY, resetMuseumSoundForTests } from '@/lib/museumSound';

/*
 * The posters' room sound: off and silent until a visitor turns it on, then
 * a quiet loop that fades in, makes way for the audio guide, and fades out on
 * the way back to the posters; and the Holocaust exhibition never has one.
 */

function Room({ src, duck }: { src?: string; duck?: boolean }) {
  return <RoomSound sound={useRoomSound(src, { duck })} color="#fff" bg="#000" />;
}

let play: jest.SpyInstance;
let pause: jest.SpyInstance;
let volumes: number[];

beforeEach(() => {
  jest.useFakeTimers();
  sessionStorage.clear();
  resetMuseumSoundForTests();
  volumes = [];
  play = jest.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(function (this: HTMLMediaElement) {
    Object.defineProperty(this, 'paused', { value: false, configurable: true });
    return Promise.resolve();
  });
  pause = jest.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(function (this: HTMLMediaElement) {
    Object.defineProperty(this, 'paused', { value: true, configurable: true });
  });
  jest.spyOn(HTMLMediaElement.prototype, 'volume', 'set').mockImplementation((v: number) => {
    volumes.push(v);
  });
});

afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

const last = () => volumes[volumes.length - 1];
const settle = () => act(() => jest.advanceTimersByTime(3000));

describe('RoomSound', () => {
  it('shows no button on a poster without a sound', () => {
    render(<Room />);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('stays silent, and downloads nothing, until it is turned on', () => {
    const preload = jest.spyOn(HTMLMediaElement.prototype, 'preload', 'set');
    render(<Room src="/a.mp3" />);
    settle();
    expect(play).not.toHaveBeenCalled();
    expect(preload.mock.calls.every(([v]) => v === 'none')).toBe(true);
    expect(screen.getByRole('button', { name: /room sound/i })).toHaveAttribute('aria-pressed', 'false');
  });

  it('fades in once on, loops, and remembers the choice', () => {
    render(<Room src="/a.mp3" />);
    fireEvent.click(screen.getByRole('button', { name: /room sound/i }));
    expect(play).toHaveBeenCalled();
    expect(sessionStorage.getItem(MUSEUM_SOUND_KEY)).toBe('on');
    act(() => jest.advanceTimersByTime(80));
    expect(last()).toBeGreaterThan(0);
    expect(last()).toBeLessThan(ROOM_LEVEL);
    settle();
    expect(last()).toBeCloseTo(ROOM_LEVEL);
    expect(screen.getByRole('button', { name: /sound off/i })).toHaveAttribute('aria-pressed', 'true');
  });

  it('drops right down while the audio guide speaks, and comes back after', () => {
    sessionStorage.setItem(MUSEUM_SOUND_KEY, 'on');
    const { rerender } = render(<Room src="/a.mp3" />);
    settle();
    rerender(<Room src="/a.mp3" duck />);
    settle();
    expect(last()).toBeCloseTo(DUCK_LEVEL);
    rerender(<Room src="/a.mp3" />);
    settle();
    expect(last()).toBeCloseTo(ROOM_LEVEL);
  });

  it('carries on from panel to panel, and fades out and pauses on the way back to the posters', () => {
    sessionStorage.setItem(MUSEUM_SOUND_KEY, 'on');
    const { rerender } = render(<Room src="/a.mp3" />);
    settle();
    const plays = play.mock.calls.length;
    rerender(<Room src="/a.mp3" />);
    settle();
    expect(play.mock.calls.length).toBe(plays);
    rerender(<Room />);
    settle();
    expect(last()).toBe(0);
    expect(pause).toHaveBeenCalled();
  });

  it('fades out when turned off', () => {
    sessionStorage.setItem(MUSEUM_SOUND_KEY, 'on');
    render(<Room src="/a.mp3" />);
    settle();
    fireEvent.click(screen.getByRole('button', { name: /sound off/i }));
    settle();
    expect(last()).toBe(0);
    expect(pause).toHaveBeenCalled();
    expect(sessionStorage.getItem(MUSEUM_SOUND_KEY)).toBe('off');
  });

  it('is never found for the Holocaust exhibition', () => {
    expect(posterSoundsOnDisk(HOLOCAUST)).toBeUndefined();
  });
});
