/*
 * The film's music: the owner's own recording, when it is in place
 * (public/exhibitions/holocaust/walk/film-music.mp3; walkSlots.ts finds it
 * when the page is built). Without it the film is silent. It is started
 * only by the visitor's own press (Begin), as browsers ask; it pauses with
 * the film, and plays once, ending as the toll is shown (filmText.ts); if
 * the visitor gets there sooner, or skips, it fades.
 */

export type FilmMusic = {
  play: () => void;
  pause: () => void;
  /** Fades to silence over `ms`, then stops. */
  fade: (ms: number) => void;
  /** Ends within about `ms`: left alone if it is ending by then, else faded out over it. */
  endBy: (ms: number) => void;
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
  // It plays once, never round: the film is cut to its length, so it ends as the toll is shown (filmText.ts).
  audio.loop = false;
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
  // Once it has ended, it stays ended: Play, or the Music button, will not start it again from the top.
  safely(() => audio.addEventListener?.('ended', () => {
    done = true;
  }));
  const fade = (ms: number) => {
    if (done || fading) return;
    const from = audio.volume;
    const t0 = Date.now();
    fading = setInterval(() => {
      const k = Math.min(1, (Date.now() - t0) / Math.max(1, ms));
      audio.volume = Math.max(0, from * (1 - k));
      if (k >= 1) stop();
    }, 100);
  };
  return {
    play: () => {
      if (!done) safely(() => audio.play());
    },
    pause: () => safely(() => audio.pause()),
    fade,
    endBy: (ms: number) => {
      // Played through, it is just ending on its own; moved on by hand, it may have far to go, and fades now.
      const left = (audio.duration - audio.currentTime) * 1000;
      if (!(left <= ms + 1000)) fade(ms);
    },
    stop,
  };
}
