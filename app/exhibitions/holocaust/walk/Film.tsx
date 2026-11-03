'use client';

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { FILM_BLEEDS, FILM_FADE_MS, FILM_FRAMES, FILM_MUSIC, FILM_NEXT, FILM_SKIP, FILM_SKIP_FADE_MS, frameId, frameMs, frameText, type FilmFrame } from './filmText';
import { makeFilmMusic, type FilmMusic } from './filmMusic';
import type { WalkPictures } from './walkLines';
import WalkPicture from './WalkPicture';

/*
 * The film that opens the walk, full screen, from the visitor's press of
 * Begin: a few words on what the Holocaust was, alone on the dark, as the
 * title cards of an old film are; then the history, a line at a time, each
 * over its picture (filmText.ts). It looks like old film: black and white,
 * flickering a little, with grain, a slight weave in the gate, the odd
 * scratch and a darkened edge, all drawn here and in film.css, nothing
 * recorded; and on a few pictures, for a moment, their own color bleeds
 * through. The words are set in Special Elite, a typewriter face, as the
 * documents of the 1930s and 1940s were typed.
 *
 * It plays by itself, about five and a half seconds a line, with Pause and
 * Play, and a quiet "Skip to the walk". The owner's music plays with it
 * when it is in place (filmMusic.ts), from the same press, and fades as the
 * film ends. Under reduced motion nothing flickers or weaves, and the
 * visitor moves it on a line at a time. When it ends, or is skipped, the
 * walk opens out (Walk.tsx). Every line's sources are in the walk's Sources
 * drawer, never on the screen.
 */

/** The film's typewriter face, from Google Fonts. */
export const FILM_FONT_HREF = 'https://fonts.googleapis.com/css2?family=Special+Elite&display=swap';

export function useFilm({ music, reduced, onEnd }: { music: string | null; reduced: boolean; onEnd: () => void }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [running, setRunning] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const player = useRef<FilmMusic | null>(null);
  const musicMuted = useRef(false);
  const remaining = useRef(0);
  const indexRef = useRef(0);
  const onEndRef = useRef(onEnd);
  useEffect(() => {
    onEndRef.current = onEnd;
  }, [onEnd]);
  const last = FILM_FRAMES.length - 1;

  const show = useCallback(
    (i: number) => {
      indexRef.current = i;
      remaining.current = frameMs(FILM_FRAMES[i]);
      setIndex(i);
      setAnnouncement(frameText(FILM_FRAMES[i]));
      // The music fades as the last line is shown.
      if (i === last) player.current?.fade(FILM_FADE_MS);
    },
    [last],
  );

  const finish = useCallback((fadeMs: number) => {
    player.current?.fade(fadeMs);
    setRunning(false);
    setPlaying(false);
    onEndRef.current();
  }, []);

  /** On to the next line; after the last, the walk. */
  const next = useCallback(() => {
    if (indexRef.current >= last) finish(FILM_FADE_MS);
    else show(indexRef.current + 1);
  }, [last, show, finish]);

  /** Begin: called from the visitor's own press, so the music may start with it. */
  const start = useCallback(() => {
    player.current?.stop();
    player.current = makeFilmMusic(music);
    show(0);
    setRunning(true);
    setPlaying(!reduced);
    if (player.current && !musicMuted.current) {
      player.current.play();
      setMusicOn(true);
    } else setMusicOn(false);
  }, [music, reduced, show]);

  // Playing: each frame for its time; a pause keeps what is left of it.
  useEffect(() => {
    if (!running || !playing || reduced) return;
    const t0 = performance.now();
    let fired = false;
    const id = setTimeout(() => {
      fired = true;
      next();
    }, remaining.current);
    return () => {
      clearTimeout(id);
      if (!fired) remaining.current = Math.max(0, remaining.current - (performance.now() - t0));
    };
  }, [running, playing, reduced, index, next]);

  const togglePlaying = () => {
    if (playing) {
      player.current?.pause();
      setAnnouncement('The film is paused.');
    } else {
      if (musicOn) player.current?.play();
      setAnnouncement('The film plays on.');
    }
    setPlaying(!playing);
  };

  const toggleMusic = () => {
    if (!player.current) return;
    if (musicOn) {
      musicMuted.current = true;
      player.current.pause();
      setMusicOn(false);
      setAnnouncement('Music off.');
    } else {
      musicMuted.current = false;
      if (playing || reduced) player.current.play();
      setMusicOn(true);
      setAnnouncement('Music on.');
    }
  };

  const skip = useCallback(() => finish(FILM_SKIP_FADE_MS), [finish]);

  /** Leaving: the music stops at once. */
  const stop = useCallback(() => {
    player.current?.stop();
    player.current = null;
    setRunning(false);
    setPlaying(false);
    setMusicOn(false);
  }, []);

  useEffect(() => () => player.current?.stop(), []);

  return { index, frame: FILM_FRAMES[index], playing, running, musicOn, hasMusic: !!music, announcement, start, next, skip, stop, togglePlaying, toggleMusic };
}

export type FilmState = ReturnType<typeof useFilm>;

/** One frame on the film: an opening card of words, alone on the dark; or a picture, in black and white, its line over it. */
function FilmLayer({ frame, pictures, current }: { frame: FilmFrame; pictures: WalkPictures; current: boolean }) {
  const bleed = frame.kind === 'line' && FILM_BLEEDS.has(frame.line.id) && !!pictures[frame.line.slot];
  return (
    <div className={`hof-layer${current ? ' is-current' : ' is-before'}${frame.kind === 'words' ? ' is-card' : ''}${bleed ? ' is-bleed' : ''}`} aria-hidden={current ? undefined : true}>
      {frame.kind === 'line' && <WalkPicture line={frame.line} file={pictures[frame.line.slot]} />}
    </div>
  );
}

/** The film, full screen. */
export function FilmScreen({ film, pictures, reduced, primaryRef }: { film: FilmState; pictures: WalkPictures; reduced: boolean; primaryRef: RefObject<HTMLButtonElement | null> }) {
  const { index, frame, playing, musicOn, hasMusic, next, skip, togglePlaying, toggleMusic } = film;
  // The frame before stays while this one fades in over it (no fade with reduced motion).
  const frames = [...(reduced || index < 1 ? [] : [FILM_FRAMES[index - 1]]), frame];
  return (
    <div className={`hof-film${reduced ? ' is-still' : ''}`} data-frame={frameId(frame)}>
      <div className="hof-gate">
        {frames.map((f, i) => (
          <FilmLayer key={frameId(f)} frame={f} pictures={pictures} current={i === frames.length - 1} />
        ))}
        <div className={`hof-words${frame.kind === 'words' ? ' is-card' : ''}`} key={frameId(frame)} data-line={frame.kind === 'line' ? frame.line.id : undefined} data-opening={frame.kind === 'words' ? frame.opening.id : undefined}>
          <p>{frameText(frame)}</p>
        </div>
      </div>
      {/* The old film itself, over everything: its grain, its scratches, its flicker and its darkened edge. */}
      <span className="hof-grain" aria-hidden="true" />
      <span className="hof-scratches" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <span className="hof-flicker" aria-hidden="true" />
      <span className="hof-vignette" aria-hidden="true" />

      <div className="hof-bar">
        <div className="hof-bar-side">
          {reduced ? (
            <button ref={primaryRef} type="button" className="hos-button hos-button-primary" onClick={next}>
              {FILM_NEXT}
            </button>
          ) : (
            <button ref={primaryRef} type="button" className="hos-button" onClick={togglePlaying}>
              {playing ? 'Pause' : 'Play'}
            </button>
          )}
          {hasMusic && (
            <button type="button" className="hos-button hos-button-sound" aria-pressed={musicOn} onClick={toggleMusic}>
              <span aria-hidden="true" className="hos-sound-mark">{musicOn ? '◉' : '○'}</span> {FILM_MUSIC}
            </button>
          )}
        </div>
        <div className="hof-bar-side">
          <button type="button" className="hos-button hof-skip" onClick={skip}>
            {FILM_SKIP}
          </button>
        </div>
      </div>
    </div>
  );
}
