import { act, fireEvent, render, screen } from '@testing-library/react';
import HallSound from '@/app/greathall/HallSound';

/*
 * The Great Hall's sound: no button until the owner's file is there, and off
 * until the visitor turns it on.
 */

describe('HallSound', () => {
  let made: HTMLAudioElement[] = [];
  const RealAudio = window.Audio;

  beforeEach(() => {
    made = [];
    window.Audio = jest.fn(() => {
      const a = new RealAudio();
      a.play = jest.fn(() => Promise.resolve());
      a.pause = jest.fn();
      made.push(a);
      return a;
    }) as unknown as typeof Audio;
  });
  afterEach(() => {
    window.Audio = RealAudio;
  });

  it('shows no button while the sound file is not there', () => {
    render(<HallSound />);
    expect(screen.queryByRole('button')).toBeNull();
    expect(made[0].getAttribute('src')).toBe('/greathall/sound/hall.mp3');
  });

  it('once the file loads, offers the sound, off until chosen', async () => {
    render(<HallSound />);
    act(() => {
      made[0].dispatchEvent(new Event('loadedmetadata'));
    });
    const button = screen.getByRole('button', { name: 'Hear the hall' });
    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(made[0].play).not.toHaveBeenCalled();
    await act(async () => {
      fireEvent.click(button);
    });
    expect(made[0].play).toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Sound on' })).toHaveAttribute('aria-pressed', 'true');
  });
});
