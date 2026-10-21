'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Lesson } from '@/lib/lessons/types';
import { type Action, type Session, initialSession, isSession, reduce } from '@/lib/lessons/session';

type Message =
  | { type: 'hello'; from: string }
  | { type: 'bye'; from: string }
  | { type: 'state'; from: string; state: Session };

/** A session older than this is yesterday's lesson, not one to resume. */
const STALE_MS = 4 * 60 * 60 * 1000;

function storageKey(slug: string) {
  return `mm-lesson:${slug}`;
}

function readStored(slug: string, steps: number): Session | null {
  try {
    const raw = window.localStorage.getItem(storageKey(slug));
    if (!raw) return null;
    const s: unknown = JSON.parse(raw);
    if (!isSession(s, steps) || Date.now() - s.updatedAt > STALE_MS) return null;
    return s;
  } catch {
    return null;
  }
}

function writeStored(slug: string, s: Session) {
  try {
    window.localStorage.setItem(storageKey(slug), JSON.stringify(s));
  } catch {
    /* private mode or storage blocked: the lesson still runs */
  }
}

/**
 * One lesson's running state, shared live between every window that has the
 * lesson open (the projected classroom view and the presenter's notes) over a
 * BroadcastChannel. Any window can drive it; the most recent change wins.
 * It also survives a reload of either window for a few hours.
 */
export function useLessonSession(lesson: Lesson) {
  const n = lesson.steps.length;
  const slug = lesson.slug;
  const [session, setSession] = useState<Session>(() => initialSession(n));
  const [now, setNow] = useState(0);
  const [connected, setConnected] = useState(false);
  const channelRef = useRef<BroadcastChannel | null>(null);
  const idRef = useRef('');
  const sessionRef = useRef(session);

  const adopt = useCallback((s: Session) => {
    if (s.updatedAt < sessionRef.current.updatedAt) return;
    sessionRef.current = s;
    setSession(s);
    writeStored(slug, s);
  }, [slug]);

  // Open the channel, say hello, and pick up any lesson already in progress.
  useEffect(() => {
    idRef.current = Math.random().toString(36).slice(2);
    const stored = readStored(lesson.slug, n);
    // ?step=3 opens the lesson at that step (a link a teacher can share or
    // bookmark); otherwise pick up where this browser left off.
    const asked = Number(new URLSearchParams(window.location.search).get('step'));
    const restore = window.setTimeout(() => {
      const t = Date.now();
      if (Number.isInteger(asked) && asked >= 1 && asked <= n) {
        adopt(reduce(stored ?? initialSession(n, 0), { type: 'goto', index: asked - 1 }, t));
      } else if (stored) {
        adopt(stored);
      }
      setNow(t);
    }, 0);

    if (typeof BroadcastChannel === 'undefined') return () => window.clearTimeout(restore);
    const ch = new BroadcastChannel(storageKey(lesson.slug));
    channelRef.current = ch;
    ch.onmessage = (e: MessageEvent<Message>) => {
      const m = e.data;
      if (!m || m.from === idRef.current) return;
      setConnected(m.type !== 'bye');
      if (m.type === 'hello') {
        ch.postMessage({ type: 'state', from: idRef.current, state: sessionRef.current } satisfies Message);
      } else if (m.type === 'state' && isSession(m.state, n)) {
        adopt(m.state);
      }
    };
    ch.postMessage({ type: 'hello', from: idRef.current } satisfies Message);
    const bye = () => ch.postMessage({ type: 'bye', from: idRef.current } satisfies Message);
    window.addEventListener('pagehide', bye);
    return () => {
      window.removeEventListener('pagehide', bye);
      window.clearTimeout(restore);
      ch.close();
      channelRef.current = null;
    };
  }, [lesson.slug, n, adopt]);

  // A gentle tick: elapsed time is computed from the clock, so a quarter
  // second is plenty and nothing drifts while the tab is in the background.
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(t);
  }, []);

  const dispatch = useCallback(
    (a: Action) => {
      const t = Math.max(Date.now(), sessionRef.current.updatedAt + 1);
      const next = reduce(sessionRef.current, a, t);
      if (next === sessionRef.current) return;
      sessionRef.current = next;
      setSession(next);
      setNow(t);
      writeStored(lesson.slug, next);
      channelRef.current?.postMessage({ type: 'state', from: idRef.current, state: next } satisfies Message);
    },
    [lesson.slug],
  );

  const minutes = useMemo(() => lesson.steps.map((s) => s.minutes), [lesson.steps]);

  return { session, now, dispatch, minutes, connected };
}
