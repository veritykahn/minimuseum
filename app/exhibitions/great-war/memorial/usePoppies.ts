'use client';

import { useCallback, useEffect, useState } from 'react';

/*
 * The shared count of poppies, from /api/poppies, and this visitor's own
 * poppy for today. One poppy per visitor per day is kept in localStorage
 * (the server also limits by address). If the count can't be reached the
 * field still shows: the last count this browser saw, or none at all.
 */

const DAY_KEY = 'gw-poppy-day';
const LAST_KEY = 'gw-poppy-last-count';

export type PoppyStatus = 'loading' | 'ready' | 'offline';
export type PlaceResult = 'placed' | 'already' | 'limited' | 'failed';

/** Today in the visitor's own time zone, as YYYY-MM-DD. */
export function localDay(d = new Date()): string {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function write(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage unavailable: the server's limit still applies */
  }
}

export function usePoppies() {
  const [count, setCount] = useState<number | null>(null);
  const [status, setStatus] = useState<PoppyStatus>('loading');
  const [placedToday, setPlacedToday] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setPlacedToday(read(DAY_KEY) === localDay());
    const last = Number(read(LAST_KEY));
    let alive = true;
    fetch('/api/poppies')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data: { count?: number }) => {
        if (!alive) return;
        const n = Number(data.count);
        if (!Number.isFinite(n)) throw new Error('bad count');
        setCount(n);
        setStatus('ready');
        write(LAST_KEY, String(n));
      })
      .catch(() => {
        if (!alive) return;
        setCount(Number.isFinite(last) && last > 0 ? last : null);
        setStatus('offline');
      });
    return () => {
      alive = false;
    };
  }, []);

  const place = useCallback(async (): Promise<PlaceResult> => {
    if (read(DAY_KEY) === localDay() || placedToday) {
      setPlacedToday(true);
      return 'already';
    }
    setBusy(true);
    try {
      const r = await fetch('/api/poppies', { method: 'POST' });
      const data = (await r.json().catch(() => ({}))) as { count?: number };
      const n = Number(data.count);
      if (r.ok && Number.isFinite(n)) {
        setCount((c) => Math.max(n, c ?? 0));
        setStatus('ready');
        setPlacedToday(true);
        write(DAY_KEY, localDay());
        write(LAST_KEY, String(n));
        return 'placed';
      }
      if (r.status === 429) {
        if (Number.isFinite(n)) setCount(n);
        setPlacedToday(true);
        write(DAY_KEY, localDay());
        return 'limited';
      }
      return 'failed';
    } catch {
      return 'failed';
    } finally {
      setBusy(false);
    }
  }, [placedToday]);

  return { count, status, placedToday, busy, place };
}
