'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { createPortal } from 'react-dom';
import { FactSources } from '@/components/exhibition/FactNote';
import { NIEMOLLER } from '../holocaust';
import { ROOM_PATHS } from '../roomPaths';
import { planMinute, promptAt, type StillnessPrompt } from './stillnessPrompts';

/*
 * A minute of stillness. The words of Martin Niemöller, from poster 2, and
 * a button that dims the page for one minute: a thin line that shortens as
 * the minute passes, and, one at a time, four short prompts from the
 * owner-approved bank (stillnessPrompts.ts: a name, someone's own words, a
 * question to sit with), each with its source, drawn afresh each minute.
 * No sound. When the minute is over, or "End the stillness" is pressed,
 * it closes as the walk does: a word of thanks, and the choice of keeping
 * another minute or laying a stone. Focus is never trapped: the page
 * behind stays reachable, and Esc leaves the stillness at once.
 */

export const STILLNESS_MS = 60 * 1000;
// REVIEW (Verity): the stillness's close, and its two ways on.
export const STILLNESS_CLOSE = 'Thank you for keeping the stillness, and for remembering them.';
export const STILLNESS_AGAIN = 'Keep another minute';
export const STILLNESS_STONE = 'Lay a stone';
export const STILLNESS_BACK = 'Back to the room';

function mss(ms: number) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}

export default function Stillness() {
  const [endsAt, setEndsAt] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const [leaving, setLeaving] = useState(false);
  // The minute is over: the close, and the two ways on.
  const [closed, setClosed] = useState(false);
  const againRef = useRef<HTMLButtonElement>(null);
  const [announcement, setAnnouncement] = useState('');
  const startRef = useRef<HTMLButtonElement>(null);
  const endRef = useRef<HTMLButtonElement>(null);
  const endsRef = useRef<number | null>(null);
  const returnFocusRef = useRef(false);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [plan, setPlan] = useState<StillnessPrompt[]>([]);
  const lastPlan = useRef<string[]>([]);

  /** Out of the veil, back to the room. */
  const leave = useCallback(() => {
    setClosed(false);
    setLeaving(true);
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    leaveTimer.current = setTimeout(() => setLeaving(false), 1600);
    returnFocusRef.current = true;
  }, []);

  /** The minute is over (or the visitor ended it): the close, or with Esc, straight back to the room. */
  const end = useCallback((byVisitor: boolean, out = false) => {
    if (endsRef.current === null) return;
    endsRef.current = null;
    setEndsAt(null);
    setAnnouncement(byVisitor ? 'The stillness has ended.' : 'A minute has passed. The stillness has ended.');
    if (out) leave();
    else setClosed(true);
  }, [leave]);

  const begin = useCallback(() => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    setLeaving(false);
    setClosed(false);
    const t = Date.now();
    const next = planMinute(Math.random, lastPlan.current);
    lastPlan.current = next.map((p) => p.id);
    setPlan(next);
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

  // Esc leaves it, wherever focus is: during the minute, or at its close.
  useEffect(() => {
    if (endsAt === null && !closed) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        if (endsAt !== null) end(true, true);
        else leave();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [endsAt, closed, end, leave]);

  // Focus goes to "End the stillness", then to "Keep another minute" at the close, and back to the start button after.
  useEffect(() => {
    if (endsAt !== null) endRef.current?.focus({ preventScroll: true });
    else if (closed) againRef.current?.focus({ preventScroll: true });
    else if (returnFocusRef.current) {
      returnFocusRef.current = false;
      startRef.current?.focus({ preventScroll: true });
    }
  }, [endsAt, closed]);

  useEffect(() => () => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
  }, []);

  const remaining = endsAt === null ? STILLNESS_MS : endsAt - now;
  /** How much of the minute is left, 1 to 0, for the line. */
  const share = Math.max(0, Math.min(1, remaining / STILLNESS_MS));
  const shown = endsAt === null ? null : promptAt(STILLNESS_MS - remaining);
  const prompt = shown === null ? null : plan[shown] ?? null;

  const veil = (endsAt !== null || closed || leaving) && typeof document !== 'undefined'
    ? createPortal(
        <div className={`hos-veil ${endsAt !== null || closed ? 'is-on' : 'is-leaving'}`} data-exhibition="holocaust" role="region" aria-label="A minute’s stillness">
          {closed && (
            <div className="hos-veil-inner hos-veil-close" data-end="true">
              <p className="hos-veil-title">A minute’s stillness</p>
              <p className="hos-veil-close-text">{STILLNESS_CLOSE}</p>
              <div className="hos-ways-on">
                <button ref={againRef} type="button" className="hos-button" onClick={begin}>
                  {STILLNESS_AGAIN}
                </button>
                <Link href={ROOM_PATHS.stones} className="hos-button hos-button-primary hos-stone-link">
                  <span className="hos-stone-mark" aria-hidden="true" />
                  {STILLNESS_STONE}
                </Link>
              </div>
              <button type="button" className="hos-button hos-veil-back" onClick={leave}>
                {STILLNESS_BACK}
              </button>
            </div>
          )}
          {endsAt !== null && (
            <div className="hos-veil-inner">
              <p className="hos-veil-title">A minute’s stillness</p>
              <div className="hos-veil-prompt-area" aria-live="polite">
                {prompt && (
                  <div key={prompt.id} className={`hos-veil-prompt is-${prompt.kind}`} data-prompt={prompt.id}>
                    <p className="hos-veil-prompt-text">
                      {prompt.name && <strong>{prompt.name}</strong>}
                      {prompt.text}
                    </p>
                    {prompt.cite && <p className="hos-veil-prompt-cite">{prompt.cite}</p>}
                    <FactSources sources={prompt.sources} className="hos-veil-prompt-source" />
                  </div>
                )}
              </div>
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
