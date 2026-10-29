'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { NIEMOLLER } from '../holocaust';

/*
 * A minute of stillness. The words of Martin Niemöller, from poster 2, and
 * a button that dims the page for one minute: a thin line that shortens as
 * the minute passes, and nothing else. No sound. Focus is never trapped:
 * the page behind stays reachable, and Esc (or "End the stillness") ends it.
 */

export const STILLNESS_MS = 60 * 1000;

function mss(ms: number) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}

export default function Stillness() {
  const [endsAt, setEndsAt] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const startRef = useRef<HTMLButtonElement>(null);
  const endRef = useRef<HTMLButtonElement>(null);
  const endsRef = useRef<number | null>(null);
  const returnFocusRef = useRef(false);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const end = useCallback((byVisitor: boolean) => {
    if (endsRef.current === null) return;
    endsRef.current = null;
    setEndsAt(null);
    setLeaving(true);
    setAnnouncement(byVisitor ? 'The stillness has ended.' : 'A minute has passed. The stillness has ended.');
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    leaveTimer.current = setTimeout(() => setLeaving(false), 1600);
    returnFocusRef.current = true;
  }, []);

  const begin = useCallback(() => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    setLeaving(false);
    const t = Date.now();
    endsRef.current = t + STILLNESS_MS;
    setEndsAt(t + STILLNESS_MS);
    setNow(t);
    setAnnouncement('A minute’s stillness. Press Escape to end it.');
  }, []);

  // The clock, once a second, while the stillness lasts.
  useEffect(() => {
    if (endsAt === null) return;
    const id = setInterval(() => {
      const t = Date.now();
      setNow(t);
      if (endsRef.current !== null && t >= endsRef.current) end(false);
    }, 1000);
    return () => clearInterval(id);
  }, [endsAt, end]);

  // Esc ends it, wherever focus is.
  useEffect(() => {
    if (endsAt === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        end(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [endsAt, end]);

  // Focus goes to "End the stillness", and back to the start button after.
  useEffect(() => {
    if (endsAt !== null) endRef.current?.focus({ preventScroll: true });
    else if (returnFocusRef.current) {
      returnFocusRef.current = false;
      startRef.current?.focus({ preventScroll: true });
    }
  }, [endsAt]);

  useEffect(() => () => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
  }, []);

  const remaining = endsAt === null ? STILLNESS_MS : endsAt - now;
  /** How much of the minute is left, 1 to 0, for the line. */
  const share = Math.max(0, Math.min(1, remaining / STILLNESS_MS));

  const veil = (endsAt !== null || leaving) && typeof document !== 'undefined'
    ? createPortal(
        <div className={`hos-veil ${endsAt !== null ? 'is-on' : 'is-leaving'}`} data-exhibition="holocaust" role="region" aria-label="A minute’s stillness">
          {endsAt !== null && (
            <div className="hos-veil-inner">
              <p className="hos-veil-title">A minute’s stillness</p>
              <span className="hos-veil-line" aria-hidden="true">
                <span style={{ transform: `scaleX(${share})` }} />
              </span>
              <p className="hos-veil-time" aria-hidden="true">{mss(remaining)}</p>
              <button ref={endRef} type="button" className="hos-button" onClick={() => end(true)}>
                End the stillness
              </button>
              <p className="hos-veil-hint">Press Esc to end it at any time.</p>
            </div>
          )}
        </div>,
        document.body,
      )
    : null;

  return (
    <div className="hos-stillness">
      <blockquote className="hos-quote">
        <p>{NIEMOLLER.text}</p>
        <footer>{NIEMOLLER.cite}</footer>
      </blockquote>
      <button ref={startRef} type="button" className="hos-button hos-button-primary" onClick={begin} disabled={endsAt !== null}>
        Keep a minute’s stillness
      </button>
      <p className="visually-hidden" role="status" aria-live="polite">{announcement}</p>
      {veil}
    </div>
  );
}
