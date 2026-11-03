'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ALL_FLOORS } from '@/lib/floors';

/*
 * The halls' sound: a quiet loop of a large museum hall (Speyer Cathedral,
 * public/greathall/sound/hall.mp3), off until the visitor turns it on.
 *
 * It lives here, once, in the root layout, so it carries on unbroken as the
 * visitor walks between the Great Hall and the floors' exhibition halls: one
 * audio element for the whole visit, never restarted by a page change. Its
 * button, bottom left, shows only in those halls, and only once the file's
 * metadata has loaded. Stepping into an exhibition (a room with sounds of its
 * own) fades it out and pauses it; coming back to a hall with it still on
 * fades it back in.
 *
 * The visitor's choice is kept for the visit in sessionStorage, so a reload
 * remembers it. A browser may refuse to play after a reload until the
 * visitor has touched the page; until it can play, the button shows off,
 * and the hall tries again each time the visitor walks into one.
 */

export const HALL_SOUND_SRC = '/greathall/sound/hall.mp3';
/** sessionStorage key: '1' while the visitor wants the sound on. */
export const HALL_SOUND_KEY = 'hallSound';
const LEVEL = 0.6;
const FADE_MS = 1200;

/** The halls the sound plays in: the Great Hall and every floor's hall. */
const HALL_PATHS = ['/greathall', ...ALL_FLOORS.map((f) => f.path)];

export function isHallRoute(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  return HALL_PATHS.includes(path);
}

function readWish(): boolean {
  try {
    return window.sessionStorage.getItem(HALL_SOUND_KEY) === '1';
  } catch {
    return false;
  }
}

function storeWish(on: boolean) {
  try {
    if (on) window.sessionStorage.setItem(HALL_SOUND_KEY, '1');
    else window.sessionStorage.removeItem(HALL_SOUND_KEY);
  } catch {
    /* storage blocked: the choice lasts until the page is left */
  }
}

export default function HallSound() {
  const pathname = usePathname();
  const inHall = isHallRoute(pathname);
  const audio = useRef<HTMLAudioElement | null>(null);
  const fade = useRef<number | null>(null);
  const [ready, setReady] = useState(false);
  /** What the visitor chose: kept for the visit. */
  const [wish, setWish] = useState(false);
  /** What the button shows: on only while the sound can actually play. */
  const [on, setOn] = useState(false);

  // The visitor's choice from earlier in the visit (read after hydration).
  useEffect(() => {
    setWish(readWish());
  }, []);

  // The one audio element, made the first time the visitor is in a hall and
  // kept from then on, so walking between halls never restarts it.
  useEffect(() => {
    if (!inHall || audio.current) return;
    const a = new Audio();
    a.loop = true;
    a.preload = 'metadata';
    a.volume = 0;
    a.addEventListener('loadedmetadata', () => setReady(true), { once: true });
    a.src = HALL_SOUND_SRC;
    audio.current = a;
  }, [inHall]);

  // Only when the layout itself goes (never, in a visit; a test's unmount).
  useEffect(
    () => () => {
      const a = audio.current;
      if (fade.current) cancelAnimationFrame(fade.current);
      if (!a) return;
      a.pause();
      a.removeAttribute('src');
      a.load();
      audio.current = null;
    },
    [],
  );

  const fadeTo = useCallback((target: number, then?: () => void) => {
    const a = audio.current;
    if (!a) return;
    if (fade.current) cancelAnimationFrame(fade.current);
    const from = a.volume;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / FADE_MS);
      a.volume = from + (target - from) * t;
      if (t < 1) fade.current = requestAnimationFrame(tick);
      else {
        fade.current = null;
        then?.();
      }
    };
    fade.current = requestAnimationFrame(tick);
  }, []);

  // In a hall with the sound wanted: play (if it is not already) and fade in.
  // Anywhere else, or turned off: fade out and pause. Runs again on every
  // page change, so a sound the browser refused after a reload gets another
  // try as the visitor walks into the next hall.
  useEffect(() => {
    const a = audio.current;
    if (!a || !ready) return undefined;
    if (inHall && wish) {
      let live = true;
      const started = a.paused ? a.play() : Promise.resolve();
      started.then(
        () => {
          if (!live) return;
          setOn(true);
          fadeTo(LEVEL);
        },
        () => {
          if (live) setOn(false);
        },
      );
      return () => {
        live = false;
      };
    }
    if (!wish) setOn(false);
    if (!a.paused) fadeTo(0, () => a.pause());
    return undefined;
  }, [inHall, wish, ready, pathname, fadeTo]);

  const toggle = () => {
    const a = audio.current;
    if (!a) return;
    if (on) {
      storeWish(false);
      setWish(false);
      setOn(false);
      return;
    }
    // Played here, in the press itself, so the browser counts it as chosen.
    storeWish(true);
    setWish(true);
    setOn(true);
    a.play().catch(() => {
      storeWish(false);
      setWish(false);
      setOn(false);
    });
  };

  if (!ready || !inHall) return null;
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
        /* Reduced motion still hears the hall; only the button's change is instant. */
        @media (prefers-reduced-motion: reduce) {
          .hall-sound {
            transition: none;
          }
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
