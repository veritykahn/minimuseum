/**
 * The running state of a lesson on screen, as plain data, so the classroom
 * and presenter windows can pass it to each other and agree.
 *
 * Time is kept as banked milliseconds per step plus, while running, the
 * wall-clock moment the clock was last started (`anchor`). Elapsed time is
 * always computed from Date.now(), so two windows that hold the same state
 * show the same clock without ticking in step.
 */

export interface Session {
  /** -1 before Start (the cover), steps.length once the lesson is over */
  index: number;
  running: boolean;
  anchor: number | null;
  /** ms spent on each step before `anchor` */
  spent: number[];
  /** ms added to each step's planned time (+1 minute) */
  extra: number[];
  /** when this state last changed; the newer state wins between windows */
  updatedAt: number;
}

export type Action =
  | { type: 'start' }
  | { type: 'next' }
  | { type: 'prev' }
  | { type: 'goto'; index: number }
  | { type: 'toggle' }
  | { type: 'addMinute' }
  | { type: 'reset' };

export const MINUTE = 60_000;

export function initialSession(stepCount: number, now = 0): Session {
  return {
    index: -1,
    running: false,
    anchor: null,
    spent: Array(stepCount).fill(0),
    extra: Array(stepCount).fill(0),
    updatedAt: now,
  };
}

function live(s: Session, now: number): number {
  return s.running && s.anchor !== null ? Math.max(0, now - s.anchor) : 0;
}

/** Fold the running clock into the current step's bank. */
function bank(s: Session, now: number): Session {
  if (s.index < 0 || s.index >= s.spent.length) return { ...s, anchor: s.running ? now : null };
  const spent = s.spent.slice();
  spent[s.index] += live(s, now);
  return { ...s, spent, anchor: s.running ? now : null };
}

function moveTo(s: Session, index: number, now: number): Session {
  const n = s.spent.length;
  const target = Math.max(0, Math.min(n, index));
  const banked = bank(s, now);
  const finished = target >= n;
  const running = finished ? false : banked.running;
  return { ...banked, index: target, running, anchor: running ? now : null };
}

export function reduce(s: Session, a: Action, now: number): Session {
  const n = s.spent.length;
  let next: Session;
  switch (a.type) {
    case 'start':
      next = { ...s, index: 0, running: true, anchor: now };
      break;
    case 'next':
      next = s.index < 0 ? reduce(s, { type: 'start' }, now) : moveTo(s, s.index + 1, now);
      break;
    case 'prev':
      if (s.index <= 0) return s;
      next = moveTo(s, s.index - 1, now);
      break;
    case 'goto':
      if (s.index < 0) {
        // jumping in from the cover starts the clock
        next = moveTo({ ...s, running: true, anchor: now }, a.index, now);
      } else {
        next = moveTo(s, a.index, now);
      }
      break;
    case 'toggle': {
      if (s.index < 0 || s.index >= n) return s;
      const banked = bank(s, now);
      const running = !s.running;
      next = { ...banked, running, anchor: running ? now : null };
      break;
    }
    case 'addMinute': {
      if (s.index < 0 || s.index >= n) return s;
      const extra = s.extra.slice();
      extra[s.index] += MINUTE;
      next = { ...s, extra };
      break;
    }
    case 'reset':
      next = initialSession(n, now);
      break;
  }
  return { ...next, updatedAt: now };
}

export function stepDuration(s: Session, minutes: number[], i: number): number {
  return minutes[i] * MINUTE + (s.extra[i] ?? 0);
}

export function stepElapsed(s: Session, i: number, now: number): number {
  if (i < 0 || i >= s.spent.length) return 0;
  return s.spent[i] + (i === s.index ? live(s, now) : 0);
}

export function totalElapsed(s: Session, now: number): number {
  return s.spent.reduce((a, b) => a + b, 0) + (s.index >= 0 && s.index < s.spent.length ? live(s, now) : 0);
}

/**
 * Where the lesson stands on the planned timeline, 0–1: whole planned
 * steps behind, plus the current step's share of its own (possibly
 * extended) time, so the marker never leaves the current segment.
 */
export function plannedProgress(s: Session, minutes: number[], now: number): number {
  const total = minutes.reduce((a, b) => a + b, 0);
  if (!total || s.index < 0) return 0;
  if (s.index >= minutes.length) return 1;
  const before = minutes.slice(0, s.index).reduce((a, b) => a + b, 0);
  const frac = Math.min(1, stepElapsed(s, s.index, now) / stepDuration(s, minutes, s.index));
  return (before + frac * minutes[s.index]) / total;
}

/** 4:05, or -0:32 when over time. */
export function clock(ms: number): string {
  const neg = ms < 0;
  const t = Math.floor(Math.abs(ms) / 1000);
  const m = Math.floor(t / 60);
  const sec = t % 60;
  return `${neg ? '−' : ''}${m}:${sec.toString().padStart(2, '0')}`;
}

/** Remaining time read aloud by screen readers: "3 minutes 5 seconds left". */
export function spokenRemaining(ms: number): string {
  const over = ms < 0;
  const t = Math.round(Math.abs(ms) / 1000);
  const m = Math.floor(t / 60);
  const sec = t % 60;
  const parts = [m ? `${m} minute${m === 1 ? '' : 's'}` : '', sec ? `${sec} second${sec === 1 ? '' : 's'}` : '']
    .filter(Boolean)
    .join(' ');
  return over ? `${parts || '0 seconds'} over` : `${parts || '0 seconds'} left`;
}

export function isSession(x: unknown, stepCount: number): x is Session {
  if (!x || typeof x !== 'object') return false;
  const s = x as Session;
  return (
    typeof s.index === 'number' &&
    typeof s.running === 'boolean' &&
    Array.isArray(s.spent) &&
    s.spent.length === stepCount &&
    Array.isArray(s.extra) &&
    s.extra.length === stepCount &&
    typeof s.updatedAt === 'number'
  );
}
