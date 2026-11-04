/*
 * The film's music: the owner's own recording, when it is in place
 * (public/exhibitions/holocaust/walk/film-music.mp3; walkSlots.ts finds it
 * when the page is built). Without it the film is silent. It is started
 * only by the visitor's own press (Begin), as browsers ask; it pauses with
 * the film, and fades out as the film ends, or quickly if it is skipped.
 */

export type FilmMusic = {
  play: () => void;
  pause: () => void;
  /** Fades to silence over `ms`, then stops. */
  fade: (ms: number) => void;
  stop: () => void;
};

export const MUSIC_VOLUME = 0.7;

export function makeFilmMusic(src: string | null): FilmMusic | null {
  if (!src || typeof window === 'undefined' || typeof window.Audio !== 'function') return null;
  let audio: HTMLAudioElement;
  try {
    audio = new window.Audio(src);
  } catch {
    return null;
  }
  audio.preload = 'auto';
  // The film is longer than the stand-in recording: it goes round, and fades over the film's last line.
  audio.loop = true;
  audio.volume = MUSIC_VOLUME;
  let fading: ReturnType<typeof setInterval> | null = null;
  let done = false;
  const clear = () => {
    if (fading) clearInterval(fading);
    fading = null;
  };
  const safely = (run: () => unknown) => {
    try {
      const p = run();
      if (p && typeof (p as Promise<void>).catch === 'function') (p as Promise<void>).catch(() => undefined);
    } catch {
      /* no music here: the film goes on in silence */
    }
  };
  const stop = () => {
    clear();
    done = true;
    safely(() => audio.pause());
  };
  return {
    play: () => {
      if (!done) safely(() => audio.play());
    },
    pause: () => safely(() => audio.pause()),
    fade: (ms: number) => {
      if (done || fading) return;
      const from = audio.volume;
      const t0 = Date.now();
      fading = setInterval(() => {
        const k = Math.min(1, (Date.now() - t0) / Math.max(1, ms));
        audio.volume = Math.max(0, from * (1 - k));
        if (k >= 1) stop();
      }, 100);
    },
    stop,
  };
}
