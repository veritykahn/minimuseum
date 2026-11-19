'use client';

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';

/*
 * The Morse kit the telegraph benches share: the sounder's tone, the
 * museum's sound switch as a button, a key that tells a quick tap (a dot)
 * from a longer press (a dash), and dots and dashes drawn as round dots
 * and long bars.
 *
 * The sounder's tone for the Morse key and the telegraph clerk: a steady
 * note while the key is down, silence while it is up. It sounds only while
 * the museum's one sound switch is on (lib/museumSound.ts), so the bench is
 * quiet until the visitor turns sound on, and turning it off anywhere stops
 * it at once.
 */

const TONE_HZ = 620;

export function useTone(on: boolean) {
  const ctx = useRef<AudioContext | null>(null);
  const osc = useRef<OscillatorNode | null>(null);
  const start = useCallback(() => {
    if (!on || typeof window === 'undefined') return;
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    try {
      ctx.current ??= new AC();
      if (osc.current) return;
      const g = ctx.current.createGain();
      g.gain.value = 0.12;
      g.connect(ctx.current.destination);
      const o = ctx.current.createOscillator();
      o.frequency.value = TONE_HZ;
      o.connect(g);
      o.start();
      osc.current = o;
    } catch {}
  }, [on]);
  const stop = useCallback(() => {
    try {
      osc.current?.stop();
    } catch {}
    osc.current = null;
  }, []);
  useEffect(() => () => stop(), [stop]);
  useEffect(() => {
    if (!on) stop();
  }, [on, stop]);
  return { start, stop };
}

/** The museum's sound switch, as a button on a bench. */
export function SoundToggle({ on, set }: { on: boolean; set: (v: boolean) => void }) {
  return (
    <button type="button" className="vbr-option vbi-sound" aria-pressed={on} onClick={() => set(!on)}>
      <span aria-hidden="true">{on ? '🔊' : '🔈'}</span> Sound {on ? 'on' : 'off'}
    </button>
  );
}

/** A press of the key shorter than this is a dot; longer, a dash. */
export const DOT_MS = 260;

/**
 * A Morse key: press and hold it by pointer, or with Space or Enter. While
 * it is down the tone sounds (if sound is on); let go and `onMark` gets a
 * dot for a quick tap, a dash for a longer press. `props` go on the key's
 * button.
 */
export function useMorseKey({ onMark, tone, disabled }: { onMark: (m: '.' | '-') => void; tone: { start: () => void; stop: () => void }; disabled?: boolean }) {
  const [live, setLive] = useState(false);
  const downAt = useRef(0);
  const isDown = useRef(false);
  const down = () => {
    if (isDown.current || disabled) return;
    isDown.current = true;
    downAt.current = Date.now();
    setLive(true);
    tone.start();
  };
  const up = () => {
    if (!isDown.current) return;
    isDown.current = false;
    setLive(false);
    tone.stop();
    onMark(Date.now() - downAt.current < DOT_MS ? '.' : '-');
  };
  const props = {
    onPointerDown: (e: PointerEvent<HTMLButtonElement>) => {
      try {
        e.currentTarget.setPointerCapture?.(e.pointerId);
      } catch {}
      down();
    },
    onPointerUp: up,
    onPointerCancel: up,
    onLostPointerCapture: up,
    onContextMenu: (e: { preventDefault: () => void }) => e.preventDefault(),
    onKeyDown: (e: KeyboardEvent<HTMLButtonElement>) => {
      if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
        e.preventDefault();
        down();
      }
    },
    onKeyUp: (e: KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        up();
      }
    },
  };
  return { live, props };
}

/** A letter's code drawn as dots and dashes, sized by the text around it (its words are given by whatever holds it). */
export function Marks({ code }: { code: string }) {
  return (
    <span className="vbi-marks" aria-hidden="true">
      {code.split('').map((m, i) => (
        <i key={i} className={m === '.' ? 'vbi-m-dot' : 'vbi-m-dash'} />
      ))}
    </span>
  );
}
