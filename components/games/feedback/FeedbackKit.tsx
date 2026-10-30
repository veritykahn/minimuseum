'use client';

import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { useReducedMotion } from '@/lib/a11y';
import { mulberry32 } from '../scoring';
import { playCue, useGameSound } from './sound';
import styles from './feedback.module.css';

/*
 * The feedback kit the quiz games share (Name That Instrument, Hands of
 * History, Real or Replica?). Verdict uses AnswerFeedback on every answer and
 * GameResult uses Celebration for a good final score, so each game gets them
 * by using those two pieces; each game puts a SoundSwitch in its header.
 */

/** The share of rounds a player needs for the celebration. */
export const GOOD_SCORE = 0.7;

export function isGoodScore(score: number, total: number): boolean {
  return total > 0 && score / total + 1e-9 >= GOOD_SCORE;
}

const noop = () => () => {};
/** True in the browser after hydration; false on the server. */
function useIsClient(): boolean {
  return useSyncExternalStore(noop, () => true, () => false);
}

/** How long the flash stays: a quick fade, or a still frame for reduced motion. */
export const FLASH_MS = 900;
export const FLASH_REDUCED_MS = 1200;

/**
 * Plays the right or wrong cue (if sound is on) and flashes the screen's
 * edge green or orange, once, when it mounts. Give it a new `key` per answer.
 */
export function AnswerFeedback({ tone }: { tone: 'right' | 'wrong' }) {
  const client = useIsClient();
  const reduced = useReducedMotion();
  const [done, setDone] = useState(false);
  const played = useRef(false);

  useEffect(() => {
    // A ref, so React's development double-run of effects plays it once.
    if (!played.current) {
      played.current = true;
      playCue(tone);
    }
    const t = window.setTimeout(() => setDone(true), reduced ? FLASH_REDUCED_MS : FLASH_MS);
    return () => window.clearTimeout(t);
  }, [tone, reduced]);

  if (!client || done) return null;
  return createPortal(
    <div className={styles.flash} data-tone={tone} data-reduced={reduced ? '' : undefined} data-feedback-flash={tone} aria-hidden="true" />,
    document.body,
  );
}

const CONFETTI_COLORS = ['#E2C36B', '#C9A94E', '#7BC67B', '#B485D2', '#F5EDD8', '#E8913A', '#7BA3C7'];
export const CONFETTI_PIECES = 42;
const CONFETTI_MS = 4200;

/**
 * A good final score: a short fanfare (if sound is on) and confetti falling
 * across the screen. With reduced motion there is no falling: a still row of
 * stars sits above the score instead.
 */
export function Celebration() {
  const client = useIsClient();
  const reduced = useReducedMotion();
  const [done, setDone] = useState(false);
  const played = useRef(false);

  useEffect(() => {
    if (!played.current) {
      played.current = true;
      playCue('finale');
    }
    const t = window.setTimeout(() => setDone(true), CONFETTI_MS);
    return () => window.clearTimeout(t);
  }, []);

  const pieces = useMemo(() => {
    const rng = mulberry32(2026);
    return Array.from({ length: CONFETTI_PIECES }, (_, i) => {
      const w = 7 + rng() * 7;
      return {
        round: rng() < 0.25,
        style: {
          '--x': `${(rng() * 100).toFixed(2)}%`,
          '--w': `${w.toFixed(1)}px`,
          '--h': `${(w * (1.2 + rng() * 0.8)).toFixed(1)}px`,
          '--c': CONFETTI_COLORS[i % CONFETTI_COLORS.length],
          '--delay': `${(rng() * 0.9).toFixed(2)}s`,
          '--dur': `${(2.2 + rng() * 1.4).toFixed(2)}s`,
          '--drift': `${Math.round((rng() - 0.5) * 220)}px`,
          '--rot': `${Math.round(360 + rng() * 540) * (rng() < 0.5 ? -1 : 1)}deg`,
        } as CSSProperties,
      };
    });
  }, []);

  if (reduced) {
    return (
      <p className={styles.stars} aria-hidden="true" data-celebration="still">
        <span>{'★'}</span>
        <span>{'★'}</span>
        <span>{'★'}</span>
      </p>
    );
  }
  if (!client || done) return null;
  return createPortal(
    <div className={styles.confetti} aria-hidden="true" data-celebration="confetti">
      {pieces.map((p, i) => (
        <span key={i} className={styles.piece} data-round={p.round ? '' : undefined} style={p.style} />
      ))}
    </div>,
    document.body,
  );
}

/**
 * The sound switch: off until the visitor turns it on. Turning it on plays a
 * soft click so they know it works. On phones it shrinks to its icon, with
 * its words kept for screen readers.
 */
export function SoundSwitch({ className, style }: { className?: string; style?: CSSProperties }) {
  const [on, setOn] = useGameSound();
  return (
    <button
      type="button"
      className={`${styles.soundSwitch} ${className ?? ''}`}
      style={style}
      onClick={() => {
        setOn(!on);
        if (!on) playCue('click');
      }}
      data-sound={on ? 'on' : 'off'}
      title={on ? 'Sound effects are on' : 'Sound effects are off'}
    >
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
        <path d="M4 9h4l5-4v14l-5-4H4z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        {on ? (
          <path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        ) : (
          <path d="M16 9.5l5 5M21 9.5l-5 5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        )}
      </svg>
      <span className={styles.soundLabel}>{on ? 'Turn sound off' : 'Turn sound on'}</span>
    </button>
  );
}
