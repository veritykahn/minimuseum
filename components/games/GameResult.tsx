'use client';

import Link from 'next/link';
import { useEffect, useId, useRef, type CSSProperties, type ReactNode } from 'react';
import { prefersReducedMotion } from '@/lib/a11y';
import type { GameAction, GamePip } from './types';
import styles from './games.module.css';

type GameResultProps = {
  /** The big number. */
  score: number;
  /** Small line under the number, e.g. "out of 5" or "illusions fooled you". */
  scoreCaption: string;
  /** A short label above the number, e.g. "Your score". */
  eyebrow?: string;
  /** The ending's headline; it takes focus when the ending appears. */
  title: string;
  message?: ReactNode;
  /** Round-by-round dots; each has a text label for screen readers. */
  pips?: GamePip[];
  pipsLabel?: string;
  /** Any game-specific breakdown, placed between the message and the buttons. */
  children?: ReactNode;
  actions: GameAction[];
  /** Heading level of the title; pages without an h1 on the ending use 1. */
  level?: 1 | 2;
  className?: string;
  /** Theme through the --game-* custom properties (see games.module.css). */
  style?: CSSProperties;
};

/**
 * The ending every scored game shares: a counted-up score, a headline that
 * depends on it, an optional breakdown, and the next steps. It moves focus to
 * its headline on arrival so keyboard and screen-reader users land on the
 * result rather than on a button that has just disappeared.
 */
export default function GameResult({
  score,
  scoreCaption,
  eyebrow,
  title,
  message,
  pips,
  pipsLabel = 'Round by round',
  children,
  actions,
  level = 2,
  className,
  style,
}: GameResultProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const titleId = useId();

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  // Count the score up from zero. The number is written straight to the DOM
  // (no re-renders), and the screen-reader text below always holds the total.
  useEffect(() => {
    const el = numberRef.current;
    if (!el) return;
    if (prefersReducedMotion() || score === 0) {
      el.textContent = String(score);
      return;
    }
    const duration = Math.min(1200, 250 + score * 90);
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = String(Math.round(eased * score));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    el.textContent = '0';
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  const Heading = level === 1 ? 'h1' : 'h2';

  return (
    <section className={`${styles.result} ${className ?? ''}`} style={style} aria-labelledby={titleId}>
      {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
      <p className={styles.score}>
        <span ref={numberRef} className={styles.scoreNumber} aria-hidden="true">
          {score}
        </span>
        <span className={styles.scoreCaption} aria-hidden="true">{scoreCaption}</span>
        <span className={styles.srOnly}>{`${score} ${scoreCaption}`}</span>
      </p>
      <Heading ref={titleRef} id={titleId} tabIndex={-1} className={styles.title}>
        {title}
      </Heading>
      {message && <div className={styles.message}>{message}</div>}
      {pips && pips.length > 0 && (
        <ol className={styles.pips} aria-label={pipsLabel}>
          {pips.map((p, i) => (
            <li
              key={i}
              className={`${styles.pip} ${p.correct ? styles.pipGood : styles.pipMiss}`}
              style={{ '--i': i } as CSSProperties}
              title={p.label}
            >
              <span className={styles.srOnly}>{`${p.label}: ${p.status ?? (p.correct ? 'right' : 'missed')}`}</span>
            </li>
          ))}
        </ol>
      )}
      {children}
      <div className={styles.actions}>
        {actions.map((a) =>
          a.href ? (
            <Link
              key={a.label}
              href={a.href}
              onClick={a.onClick}
              className={`${styles.action} ${a.primary ? styles.actionPrimary : ''}`}
            >
              {a.label}
            </Link>
          ) : (
            <button
              key={a.label}
              type="button"
              onClick={a.onClick}
              className={`${styles.action} ${a.primary ? styles.actionPrimary : ''}`}
            >
              {a.label}
            </button>
          ),
        )}
      </div>
    </section>
  );
}
