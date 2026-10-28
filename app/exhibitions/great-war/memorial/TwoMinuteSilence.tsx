'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { MEMORIAL_TEXT } from './memorialText';

/*
 * The silence at 11:00. A clock in the visitor's own time. From 11:00 to
 * 11:02 on November 11 the page dims and holds two minutes' silence by
 * itself; at any other time the visitor can keep two minutes' silence now.
 * The countdown is quiet: no sound at all. Focus is never trapped: the
 * page behind stays reachable, and Esc (or "End the silence") ends it.
 */

export const SILENCE_MS = 2 * 60 * 1000;

/** True from 11:00:00 up to 11:02:00 on November 11, local time. */
export function inArmisticeSilence(d: Date): boolean {
  return d.getMonth() === 10 && d.getDate() === 11 && d.getHours() === 11 && d.getMinutes() < 2;
}

/** When the automatic silence ends (11:02:00 that day). */
function armisticeEnd(d: Date): number {
  const end = new Date(d);
  end.setHours(11, 2, 0, 0);
  return end.getTime();
}

function mmss(ms: number) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}

type Silence = { endsAt: number; auto: boolean } | null;

export default function TwoMinuteSilence() {
  const [now, setNow] = useState<Date | null>(null);
  const [silence, setSilence] = useState<Silence>(null);
  const [leaving, setLeaving] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  /** An automatic silence the visitor ended with Esc is not started again that day. */
  const dismissedRef = useRef<string>('');
  const startRef = useRef<HTMLButtonElement>(null);
  const endRef = useRef<HTMLButtonElement>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const silenceRef = useRef<Silence>(null);
  const returnFocusRef = useRef(false);

  const end = useCallback((byVisitor: boolean) => {
    const s = silenceRef.current;
    if (!s) return;
    if (s.auto && byVisitor) dismissedRef.current = new Date().toDateString();
    silenceRef.current = null;
    setSilence(null);
    setLeaving(true);
    setAnnouncement(byVisitor ? 'The silence has ended.' : 'Two minutes have passed. The silence has ended.');
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    leaveTimer.current = setTimeout(() => setLeaving(false), 1600);
    returnFocusRef.current = true;
  }, []);

  const begin = useCallback((auto: boolean, at = new Date()) => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    setLeaving(false);
    const s = { endsAt: auto ? armisticeEnd(at) : at.getTime() + SILENCE_MS, auto };
    silenceRef.current = s;
    setSilence(s);
    setNow(at);
    setAnnouncement(auto ? 'It is 11:00 on November 11. Two minutes’ silence.' : 'Two minutes’ silence. Press Escape to end it.');
  }, []);

  // The clock, once a second; it also starts and ends the silences.
  useEffect(() => {
    const tickNow = () => {
      const d = new Date();
      setNow(d);
      const s = silenceRef.current;
      if (s && d.getTime() >= s.endsAt) end(false);
      else if (!s && inArmisticeSilence(d) && dismissedRef.current !== d.toDateString()) begin(true, d);
    };
    tickNow();
    const id = setInterval(tickNow, 1000);
    return () => clearInterval(id);
  }, [begin, end]);

  // Esc ends the silence, wherever focus is.
  useEffect(() => {
    if (!silence) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        end(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [silence, end]);

  // Focus goes to "End the silence" (not trapped there: Tab moves on as
  // usual), and back to the start button once the silence is over.
  useEffect(() => {
    if (silence) endRef.current?.focus({ preventScroll: true });
    else if (returnFocusRef.current) {
      returnFocusRef.current = false;
      startRef.current?.focus({ preventScroll: true });
    }
  }, [silence]);

  useEffect(() => () => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
  }, []);

  const remaining = silence && now ? silence.endsAt - now.getTime() : SILENCE_MS;
  const time = now ? now.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', second: '2-digit' }) : '';
  const date = now ? now.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' }) : '';

  const overlay = (silence || leaving) && typeof document !== 'undefined'
    ? createPortal(
        <div
          className={`gwm-silence-veil ${silence ? 'is-on' : 'is-leaving'}`}
          data-exhibition="great-war"
          role="region"
          aria-label="Two minutes’ silence"
        >
          {silence && (
            <div className="gwm-silence-inner">
              <p className="gwm-silence-title">Two minutes’ silence</p>
              <p className="gwm-silence-time" aria-hidden="true">{mmss(remaining)}</p>
              <button ref={endRef} type="button" className="gw-button" onClick={() => end(true)}>
                End the silence
              </button>
              <p className="gwm-silence-hint">Press Esc to end it at any time.</p>
            </div>
          )}
        </div>,
        document.body,
      )
    : null;

  return (
    <div className="gwm-silence">
      <p className="gwm-silence-line">{MEMORIAL_TEXT.silenceLine}</p>
      <div className="gwm-clock" aria-label={now ? `Your local time: ${time}, ${date}` : undefined} role="group">
        <span className="gwm-clock-time" aria-hidden="true" suppressHydrationWarning>{time || ' '}</span>
        <span className="gwm-clock-date" aria-hidden="true" suppressHydrationWarning>{date || ' '}</span>
        <span className="gwm-clock-note">Your local time</span>
      </div>
      <button ref={startRef} type="button" className="gw-button gw-button-primary" onClick={() => begin(false)} disabled={!!silence}>
        Keep two minutes’ silence now
      </button>
      <p className="visually-hidden" role="status" aria-live="polite">{announcement}</p>
      {overlay}
    </div>
  );
}
