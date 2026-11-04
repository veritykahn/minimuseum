import { act, render } from '@testing-library/react';
import { MOMENT_DELAY_MS, MOMENT_LEVEL, MOMENT_UNDER_GUIDE, usePanelMoment } from '@/components/exhibition/PanelMoment';
import { posterMomentsOnDisk } from '@/components/exhibition/posterSounds';
import { momentSrc } from '@/components/exhibition/posterSoundPaths';
import { VICTORIAN } from '@/app/exhibitions/victorian/victorian';
import { GREAT_WAR } from '@/app/exhibitions/great-war/greatWar';
import { WRITING_REVOLUTION } from '@/app/exhibitions/writing-revolution/writingRevolution';
import { MOON } from '@/app/exhibitions/moon/moon';
import { AMERICA_250 } from '@/app/exhibitions/america-250/america250';
import { BLACK_HISTORY } from '@/app/exhibitions/black-history/blackHistory';
import { WOMENS_HISTORY } from '@/app/exhibitions/womens-history/womensHistory';
import { HOLOCAUST } from '@/app/exhibitions/holocaust/holocaust';

/*
 * A panel's moment: one sound as the panel arrives, a beat after it, only
 * with sound on, softer under the audio guide, stopped by a blanked screen;
 * and the files each poster names, found on disk.
 */

let play: jest.SpyInstance;
let pause: jest.SpyInstance;
let volume: number;
beforeEach(() => {
  jest.useFakeTimers();
  play = jest.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(function (this: HTMLMediaElement) {
    this.dispatchEvent(new Event('play'));
    return Promise.resolve();
  });
  pause = jest.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(function (this: HTMLMediaElement) {
    this.dispatchEvent(new Event('pause'));
  });
  jest.spyOn(HTMLMediaElement.prototype, 'volume', 'set').mockImplementation((v: number) => {
    volume = v;
  });
});
afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

function Panel(props: { src?: string; at: string; on: boolean; softer?: boolean; hushed?: boolean; told?: (b: boolean) => void }) {
  usePanelMoment(props.src, props.at, { on: props.on, softer: props.softer, hushed: props.hushed, onSounding: props.told });
  return null;
}

describe('usePanelMoment', () => {
  it('stays silent with sound off', () => {
    render(<Panel src="/m.mp3" at="p:1" on={false} />);
    act(() => jest.advanceTimersByTime(1000));
    expect(play).not.toHaveBeenCalled();
  });

  it('plays once, a beat after the panel arrives, and tells the music to dip', () => {
    const told = jest.fn();
    render(<Panel src="/m.mp3" at="p:1" on told={told} />);
    act(() => jest.advanceTimersByTime(MOMENT_DELAY_MS - 50));
    expect(play).not.toHaveBeenCalled();
    act(() => jest.advanceTimersByTime(100));
    expect(play).toHaveBeenCalledTimes(1);
    expect(volume).toBeCloseTo(MOMENT_LEVEL);
    expect(told).toHaveBeenLastCalledWith(true);
  });

  it('is softer under the audio guide, and stops when the visitor moves on or the screen is blanked', () => {
    const { rerender } = render(<Panel src="/m.mp3" at="p:1" on softer />);
    act(() => jest.advanceTimersByTime(MOMENT_DELAY_MS + 10));
    expect(volume).toBeCloseTo(MOMENT_UNDER_GUIDE);
    rerender(<Panel at="p:2" on />);
    expect(pause).toHaveBeenCalled();
    rerender(<Panel src="/m.mp3" at="p:3" on hushed />);
    act(() => jest.advanceTimersByTime(MOMENT_DELAY_MS + 10));
    expect(play).toHaveBeenCalledTimes(1);
  });
});

describe('moments on disk', () => {
  it('finds every moment the Victorian posters name', () => {
    const named = [...new Set(VICTORIAN.posters.flatMap((p) => p.items.map((i) => i.moment).filter(Boolean)))];
    expect(named.length).toBeGreaterThan(0);
    const found = posterMomentsOnDisk(VICTORIAN) ?? {};
    const files = Object.values(found).flatMap((f) => f ?? []).filter(Boolean);
    expect(new Set(files)).toEqual(new Set(named.map((n) => momentSrc('victorian', n!))));
    // Each file sits at its own panel.
    VICTORIAN.posters.forEach((p) => p.items.forEach((i, n) => expect(found[p.id]?.[n] ?? null).toBe(i.moment ? momentSrc('victorian', i.moment) : null)));
    expect(momentSrc('victorian', 'cracker')).toBe('/exhibitions/victorian/poster-sound/moments/cracker.mp3');
  });

  it.each([
    ['the Great War', GREAT_WAR],
    ['the Writing Revolution', WRITING_REVOLUTION],
    ['the Moon', MOON],
    ['America 250', AMERICA_250],
    ['Black History Month', BLACK_HISTORY],
    ["Women's History", WOMENS_HISTORY],
  ] as const)('has a file in place for every moment %s names', (_name, config) => {
    const found = posterMomentsOnDisk(config) ?? {};
    const byPoster = found as Record<string, (string | null)[] | undefined>;
    for (const p of config.posters) p.items.forEach((i, n) => expect(byPoster[p.id]?.[n] ?? null).toBe(i.moment ? momentSrc(config.slug, i.moment) : null));
  });

  it('never finds one for the Holocaust exhibition', () => {
    expect(posterMomentsOnDisk(HOLOCAUST)).toBeUndefined();
  });
});
