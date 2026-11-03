'use client';

import { useEffect, useRef, useState } from 'react';

/*
 * A poster panel's moment: one sound, an effect or a voice, played once as
 * the panel arrives (a train's whistle as the words reach the railways, a
 * cheery "Merry Christmas!" with A Christmas Carol). It is named on the panel
 * (`moment`), its file dropped in at
 * public/exhibitions/<slug>/poster-sound/moments/<name>.mp3, and a moment
 * whose file is not there yet is simply not played (posterMomentsOnDisk).
 *
 * It follows the museum's one sound switch, as the room's music does, and
 * the music dips under it (RoomSound's duck). It waits a beat for the panel
 * to arrive, plays quieter while the audio guide is speaking, stops when the
 * visitor moves on, and stays silent while a projector's screen is blanked.
 */

/** How long after the panel arrives the moment sounds, so it lands with the words. */
export const MOMENT_DELAY_MS = 450;
export const MOMENT_LEVEL = 0.85;
/** Its level under the audio guide's voice. */
export const MOMENT_UNDER_GUIDE = 0.3;

/**
 * Plays `src` once each time `arrival` changes (a new panel), if `on`, and
 * tells `onSounding` as it starts and stops, so the music can dip under it.
 * Returns whether a moment is sounding.
 */
export function usePanelMoment(
  src: string | undefined,
  arrival: string,
  { on, softer = false, hushed = false, onSounding }: { on: boolean; softer?: boolean; hushed?: boolean; onSounding?: (sounding: boolean) => void },
): boolean {
  const audio = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const live = useRef({ on, softer, hushed });
  const tell = useRef(onSounding);
  useEffect(() => {
    tell.current = onSounding;
  }, [onSounding]);
  useEffect(() => {
    live.current = { on, softer, hushed };
    if (audio.current) audio.current.volume = softer ? MOMENT_UNDER_GUIDE : MOMENT_LEVEL;
  }, [on, softer, hushed]);

  useEffect(() => {
    const a = new Audio();
    a.preload = 'none';
    const start = () => {
      setPlaying(true);
      tell.current?.(true);
    };
    const stop = () => {
      setPlaying(false);
      tell.current?.(false);
    };
    a.addEventListener('play', start);
    a.addEventListener('pause', stop);
    a.addEventListener('ended', stop);
    audio.current = a;
    return () => {
      a.pause();
      a.removeAttribute('src');
      audio.current = null;
    };
  }, []);

  // A new panel: the last moment stops, and this one sounds after a beat.
  useEffect(() => {
    const a = audio.current;
    if (!a) return undefined;
    a.pause();
    if (!src || !live.current.on || live.current.hushed) return undefined;
    const t = setTimeout(() => {
      if (!live.current.on || live.current.hushed) return;
      a.src = src;
      a.volume = live.current.softer ? MOMENT_UNDER_GUIDE : MOMENT_LEVEL;
      a.currentTime = 0;
      try {
        void a.play()?.catch(() => {
          setPlaying(false);
          tell.current?.(false);
        });
      } catch {
        /* this browser will not play it: the panel goes on in quiet */
      }
    }, MOMENT_DELAY_MS);
    return () => clearTimeout(t);
  }, [src, arrival]);

  // Turned off, or the screen blanked: stop at once.
  useEffect(() => {
    if (!on || hushed) audio.current?.pause();
  }, [on, hushed]);

  return playing && on && !hushed;
}
