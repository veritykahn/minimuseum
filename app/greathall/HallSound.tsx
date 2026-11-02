'use client';

import { useEffect, useRef, useState } from 'react';

/*
 * The Great Hall's sound: a quiet loop of a large museum hall, off until the
 * visitor turns it on. The owner drops it in as public/greathall/sound/hall.mp3;
 * until the file is there the button never shows. It fades in and out, and
 * stops when the visitor leaves the hall.
 */

export const HALL_SOUND_SRC = '/greathall/sound/hall.mp3';
const LEVEL = 0.3;
const FADE_MS = 1200;

export default function HallSound() {
  const audio = useRef<HTMLAudioElement | null>(null);
  const fade = useRef<number | null>(null);
  const [ready, setReady] = useState(false);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const a = new Audio();
    a.loop = true;
    a.preload = 'metadata';
    a.volume = 0;
    const show = () => setReady(true);
    a.addEventListener('loadedmetadata', show);
    a.src = HALL_SOUND_SRC;
    audio.current = a;
    return () => {
      a.removeEventListener('loadedmetadata', show);
      if (fade.current) cancelAnimationFrame(fade.current);
      a.pause();
      a.removeAttribute('src');
      a.load();
    };
  }, []);

  const fadeTo = (target: number, then?: () => void) => {
    const a = audio.current;
    if (!a) return;
    if (fade.current) cancelAnimationFrame(fade.current);
    const from = a.volume;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / FADE_MS);
      a.volume = from + (target - from) * t;
      if (t < 1) fade.current = requestAnimationFrame(tick);
      else then?.();
    };
    fade.current = requestAnimationFrame(tick);
  };

  const toggle = () => {
    const a = audio.current;
    if (!a) return;
    if (on) {
      setOn(false);
      fadeTo(0, () => a.pause());
      return;
    }
    setOn(true);
    a.play().then(() => fadeTo(LEVEL), () => setOn(false));
  };

  if (!ready) return null;
  return (
    <button type="button" className="btn-reset hall-sound" aria-pressed={on} onClick={toggle}>
      <span className="hall-sound-dot" aria-hidden="true" />
      {on ? 'Sound on' : 'Hear the hall'}
      <style jsx>{`
        .hall-sound {
          position: fixed;
          left: calc(20px + env(safe-area-inset-left, 0px));
          bottom: calc(20px + env(safe-area-inset-bottom, 0px));
          z-index: 100;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          min-height: 44px;
          padding: 0 16px;
          border: 1px solid rgba(250, 250, 250, 0.3);
          border-radius: 999px;
          background: rgba(10, 10, 10, 0.6);
          color: #fafafa;
          font: 300 12px/1 'Outfit', system-ui, sans-serif;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          opacity: 0.75;
          cursor: pointer;
          transition: opacity 0.3s ease;
        }
        .hall-sound:hover,
        .hall-sound[aria-pressed='true'] {
          opacity: 1;
        }
        .hall-sound:focus-visible {
          outline: 2px solid #fafafa;
          outline-offset: 3px;
        }
        .hall-sound-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          border: 1px solid currentColor;
        }
        .hall-sound[aria-pressed='true'] .hall-sound-dot {
          background: currentColor;
        }
        @media print {
          .hall-sound {
            display: none;
          }
        }
      `}</style>
    </button>
  );
}
