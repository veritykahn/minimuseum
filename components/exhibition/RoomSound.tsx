'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useMuseumSound } from '@/lib/museumSound';

/*
 * The posters' room sound: a quiet loop under a poster (posterSoundPaths.ts),
 * so each exhibition has a sound of its own, as the halls have theirs
 * (HallSound.tsx). It follows the museum's one sound switch
 * (lib/museumSound.ts): off until a visitor turns sound on, here or anywhere
 * in the museum, for the rest of the visit; nothing is downloaded while it
 * is off. Once on:
 *
 *   - it fades in, and carries on unbroken from panel to panel;
 *   - a poster with another sound crossfades to it (fade out, then in);
 *   - it drops right down while the audio guide speaks, and comes back after;
 *   - it fades out on the way back to the posters, and while a projector's
 *     screen is blanked (hush), and picks up where it was.
 *
 * Its level is set through Web Audio where there is one, since a phone's
 * browser may not let a page set an <audio> element's volume; otherwise
 * through the element itself.
 */

/** Its level under the posters, 0 to 1: quiet, beneath reading. */
export const ROOM_LEVEL = 0.35;
/** Its level while the audio guide is speaking. */
export const DUCK_LEVEL = 0.07;
const FADE_MS = 900;
const STEP_MS = 40;

type CssVars = CSSProperties & Record<`--${string}`, string>;

export type RoomSoundState = {
  on: boolean;
  /** This poster has a room sound, or moments on its panels: its switch is shown. */
  available: boolean;
  /** A projector's screen is blanked. */
  hushed: boolean;
  turnOn: () => void;
  turnOff: () => void;
  /** Silences it for now (a blanked screen) without turning it off, or brings it back. */
  hush: (hushed: boolean) => void;
};

type AudioContextClass = typeof AudioContext;

export function useRoomSound(src: string | undefined, { duck = false, moments = false }: { duck?: boolean; moments?: boolean } = {}): RoomSoundState {
  const audio = useRef<HTMLAudioElement | null>(null);
  const ctx = useRef<AudioContext | null>(null);
  const gain = useRef<GainNode | null>(null);
  const level = useRef(0);
  const target = useRef(0);
  const fading = useRef<ReturnType<typeof setInterval> | null>(null);
  const [on, setOn] = useMuseumSound();
  const [hushed, setHushed] = useState(false);

  const stopFade = () => {
    if (fading.current) clearInterval(fading.current);
    fading.current = null;
  };

  const setLevel = (v: number) => {
    level.current = v;
    if (gain.current) gain.current.gain.value = v;
    else if (audio.current) audio.current.volume = v;
  };

  /** Moves to `to` over about FADE_MS, then calls `then`. */
  const rampTo = (to: number, then?: () => void) => {
    stopFade();
    const step = (ROOM_LEVEL * STEP_MS) / FADE_MS;
    if (Math.abs(level.current - to) <= step) {
      setLevel(to);
      then?.();
      return;
    }
    fading.current = setInterval(() => {
      const left = to - level.current;
      if (Math.abs(left) <= step) {
        stopFade();
        setLevel(to);
        then?.();
      } else setLevel(level.current + Math.sign(left) * step);
    }, STEP_MS);
  };

  const start = () => {
    const a = audio.current;
    if (!a) return;
    void ctx.current?.resume().catch(() => undefined);
    try {
      void a.play()?.catch(() => undefined);
    } catch {
      /* this browser will not play it: the room stays quiet */
    }
  };

  useEffect(() => {
    const a = new Audio();
    a.loop = true;
    // Nothing is fetched while the sound is off (see below).
    a.preload = 'none';
    a.volume = 0;
    audio.current = a;
    return () => {
      stopFade();
      a.pause();
      a.removeAttribute('src');
      audio.current = null;
      void ctx.current?.close().catch(() => undefined);
      ctx.current = null;
      gain.current = null;
    };
  }, []);

  useEffect(() => {
    const a = audio.current;
    if (!a) return;
    target.current = !on || hushed || !src ? 0 : duck ? DUCK_LEVEL : ROOM_LEVEL;
    a.preload = on ? 'auto' : 'none';

    const wanted = src ? new URL(src, window.location.href).href : '';
    if (src && a.src !== wanted) {
      // Another poster's sound: the last fades out, then this one comes in.
      const swap = () => {
        a.pause();
        a.src = src;
        setLevel(0);
        if (target.current > 0) {
          start();
          rampTo(target.current);
        }
      };
      if (!a.paused && level.current > 0) rampTo(0, swap);
      else swap();
      return;
    }
    if (target.current > 0) {
      if (a.paused) start();
      rampTo(target.current);
    } else rampTo(0, () => a.pause());
    // rampTo, start and setLevel read only refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, on, hushed, duck]);

  // Web Audio is set up on the visitor's own press, as browsers ask.
  const connect = () => {
    const a = audio.current;
    if (!a || gain.current || typeof window === 'undefined') return;
    const AC: AudioContextClass | undefined = window.AudioContext ?? (window as unknown as { webkitAudioContext?: AudioContextClass }).webkitAudioContext;
    if (!AC) return;
    try {
      const c = new AC();
      const g = c.createGain();
      g.gain.value = level.current;
      c.createMediaElementSource(a).connect(g).connect(c.destination);
      a.volume = 1;
      ctx.current = c;
      gain.current = g;
    } catch {
      /* no Web Audio here: the element's own volume is used */
    }
  };

  // Sound turned on somewhere else in the museum: Web Audio is set up at the
  // visitor's next press here instead (moving to the next panel will do).
  useEffect(() => {
    if (!on || gain.current) return;
    const wake = () => {
      connect();
      if (target.current > 0) start();
    };
    window.addEventListener('pointerdown', wake, { once: true });
    window.addEventListener('keydown', wake, { once: true });
    return () => {
      window.removeEventListener('pointerdown', wake);
      window.removeEventListener('keydown', wake);
    };
    // connect and start read only refs.
  }, [on]);

  const turnOn = () => {
    connect();
    setOn(true);
  };
  const turnOff = () => setOn(false);

  return { on, available: !!src || moments, hushed, turnOn, turnOff, hush: setHushed };
}

/** The button beside the audio guide; drawn only on a poster that has a room sound. */
export default function RoomSound({ sound, color, bg }: { sound: RoomSoundState; color: string; bg: string }) {
  if (!sound.available) return null;
  const style: CssVars = { color, borderColor: color, backgroundColor: bg };
  return (
    <button
      type="button"
      className="pe-audio-btn pe-room-sound"
      style={style}
      onClick={sound.on ? sound.turnOff : sound.turnOn}
      aria-pressed={sound.on}
      title={sound.on ? 'Turn the room sound off' : 'Play this room’s sound, quietly, under the posters'}
    >
      <Speaker on={sound.on} />
      <span>{sound.on ? 'Sound off' : 'Room sound'}</span>
    </button>
  );
}

function Speaker({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" />
      {on ? (
        <>
          <path d="M15.5 9a4 4 0 0 1 0 6" />
          <path d="M18 6.5a7.5 7.5 0 0 1 0 11" />
        </>
      ) : (
        <path d="M16 10l4 4M20 10l-4 4" />
      )}
    </svg>
  );
}
