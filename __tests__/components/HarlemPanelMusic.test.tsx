import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { poster1Content } from '@/app/exhibitions/harlem-renaissance/posters';
import HarlemRenaissance from '@/app/exhibitions/harlem-renaissance/page';

/*
 * "The Sound of Harlem" (poster 1): the panels on the music carry recordings
 * from the project's own audio, each credited, with play and pause and no
 * autoplay. Pressing play does not turn the panel; leaving the panel stops it.
 */

describe('The Sound of Harlem: music beside the panels', () => {
  const chapter = poster1Content.findIndex((it) => it.type === 'section-title' && it.text === 'The Sound of Harlem');
  const withMusic = poster1Content.flatMap((it, i) => (it.music?.length ? [i] : []));

  it('puts credited recordings that exist on the chapter’s panels', () => {
    expect(withMusic.length).toBeGreaterThan(0);
    for (const i of withMusic) {
      expect(i).toBeGreaterThan(chapter);
      for (const t of poster1Content[i].music!) {
        expect(existsSync(join(process.cwd(), 'public', t.src))).toBe(true);
        expect(t.title && t.artist && t.year).toBeTruthy();
      }
    }
  });

  describe('in the walkthrough', () => {
    let play: jest.SpyInstance;
    let pause: jest.SpyInstance;
    beforeEach(() => {
      jest.useFakeTimers();
      window.history.replaceState(null, '', '/');
      play = jest.spyOn(window.HTMLMediaElement.prototype, 'play').mockImplementation(() => Promise.resolve());
      pause = jest.spyOn(window.HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
    });
    afterEach(() => {
      jest.useRealTimers();
      play.mockRestore();
      pause.mockRestore();
    });
    const tick = (ms = 400) => act(() => { jest.advanceTimersByTime(ms); });
    const step = () => { fireEvent.keyDown(document, { key: 'ArrowRight' }); tick(); };

    it('plays only when asked, stays on the panel, and stops when the panel changes', async () => {
      render(<HarlemRenaissance />);
      fireEvent.click(screen.getByRole('button', { name: /The Great Migration and The Harlem Renaissance poster/ }));
      tick();
      const first = withMusic[0];
      for (let i = 0; i < first; i++) step();
      const content = document.querySelector('.hr-walkthrough-content') as HTMLElement;
      const audio = content.querySelector('audio') as HTMLAudioElement;
      expect(audio).toHaveAttribute('preload', 'none');
      expect(audio).not.toHaveAttribute('autoplay');
      expect(play).not.toHaveBeenCalled();
      const track = poster1Content[first].music![0];
      expect(within(content).getByText(track.title)).toBeInTheDocument();
      const button = within(content).getByRole('button', { name: /^Play / });
      await act(async () => { fireEvent.click(button); });
      expect(play).toHaveBeenCalledTimes(1);
      expect(within(content).getByRole('button', { name: /^Pause / })).toHaveAttribute('aria-pressed', 'true');
      // Still on the same panel.
      expect(content.querySelector('audio')).toBe(audio);
      pause.mockClear();
      step();
      expect(pause).toHaveBeenCalled();
    });
  });
});
