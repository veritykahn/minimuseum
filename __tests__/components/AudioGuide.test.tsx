import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { act, fireEvent, render, screen } from '@testing-library/react';
import AudioGuide from '@/components/exhibition/AudioGuide';
import { BLACK_HISTORY } from '@/app/exhibitions/black-history/blackHistory';

/*
 * The audio guide: off until a visitor turns it on, then each panel's
 * recording plays on arrival and stops on leaving; and every recording a
 * poster names is in public/.
 */

let play: jest.SpyInstance;
let pause: jest.SpyInstance;

beforeEach(() => {
  sessionStorage.clear();
  play = jest.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(function (this: HTMLMediaElement) {
    this.dispatchEvent(new Event('play'));
    return Promise.resolve();
  });
  pause = jest.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(function (this: HTMLMediaElement) {
    this.dispatchEvent(new Event('pause'));
  });
});

afterEach(() => jest.restoreAllMocks());

describe('AudioGuide', () => {
  it('stays silent until it is turned on', () => {
    render(<AudioGuide src="/a.mp3" color="#fff" bg="#000" />);
    expect(play).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: /audio guide/i })).toHaveAttribute('aria-pressed', 'false');
  });

  it('plays each panel as it arrives once on, and remembers the choice', () => {
    const { rerender } = render(<AudioGuide src="/a.mp3" color="#fff" bg="#000" />);
    fireEvent.click(screen.getByRole('button', { name: /audio guide/i }));
    expect(play).toHaveBeenCalledTimes(1);
    expect(sessionStorage.getItem('mm-audio-guide')).toBe('on');

    rerender(<AudioGuide src="/b.mp3" color="#fff" bg="#000" />);
    expect(pause).toHaveBeenCalled();
    expect(play).toHaveBeenCalledTimes(2);
  });

  it('pauses, and goes quiet on a panel with no recording', () => {
    const { rerender } = render(<AudioGuide src="/a.mp3" color="#fff" bg="#000" />);
    fireEvent.click(screen.getByRole('button', { name: /audio guide/i }));
    fireEvent.click(screen.getByRole('button', { name: /pause/i }));
    expect(pause).toHaveBeenCalled();

    rerender(<AudioGuide src={undefined} color="#fff" bg="#000" />);
    expect(screen.getByRole('button', { name: /no recording/i })).toBeDisabled();
  });

  it('turns off and stays off', () => {
    render(<AudioGuide src="/a.mp3" color="#fff" bg="#000" />);
    fireEvent.click(screen.getByRole('button', { name: /audio guide/i }));
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: /guide off/i }));
    });
    expect(sessionStorage.getItem('mm-audio-guide')).toBe('off');
    expect(screen.getByRole('button', { name: /audio guide/i })).toBeInTheDocument();
  });
});

describe('Recordings named by the posters', () => {
  const recordings = BLACK_HISTORY.posters.flatMap((p) => p.items.map((i) => i.audio).filter((a): a is string => !!a));

  it('Black History poster 1 has one for each panel of text', () => {
    const poster1 = BLACK_HISTORY.posters[0];
    const text = poster1.items.filter((i) => i.type === 'paragraph' || i.type === 'section-title');
    expect(text.every((i) => i.audio)).toBe(true);
    expect(new Set(recordings).size).toBe(recordings.length);
  });

  it.each(recordings)('%s is in public/', (src) => {
    expect(existsSync(join(process.cwd(), 'public', src))).toBe(true);
  });
});
