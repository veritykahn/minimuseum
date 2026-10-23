'use client';

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';

/*
 * Whether a page is showing in teacher projector mode, and the ?projector=1
 * deep link. The page always renders its normal view first (server and
 * hydration agree), then switches once it has read the address bar.
 *
 * A tiny shared store says "a projector screen is up" so site chrome that
 * lives outside the page — the floating museum map — can step aside.
 *
 * This is the same API as components/games/projector/useProjectorMode.ts on
 * the games branch, so the two can become one module when both are merged.
 */

let active = 0;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

/** Called by a projector screen while it is up. */
export function holdProjectorScreen(): () => void {
  active += 1;
  emit();
  return () => {
    active = Math.max(0, active - 1);
    emit();
  };
}

/** True while a projector screen is up anywhere on the page. */
export function useProjectorScreenUp(): boolean {
  return useSyncExternalStore(subscribe, () => active > 0, () => false);
}

/*
 * Set when a teacher leaves projector mode, so the "Teach with this" button
 * that brought them in can take focus back when the page reappears.
 */
let justExited = false;

/** True once after projector mode closes; reading it clears it. */
export function takeJustExited(): boolean {
  const v = justExited;
  justExited = false;
  return v;
}

export const PROJECTOR_PARAM = 'projector';
/** Poster deep links: ?projector=1&poster=2&panel=7 (both 1-based). */
export const POSTER_PARAM = 'poster';
export const PANEL_PARAM = 'panel';

/** True when the address asks for projector mode (?projector=1). */
export function projectorRequested(search: string): boolean {
  const v = new URLSearchParams(search).get(PROJECTOR_PARAM);
  return v === '1' || v === 'true' || v === 'on';
}

/**
 * The poster and panel a projector link asks for, both 0-based and clamped,
 * or null when it names no poster. `lengths` is the panel count per poster.
 */
export function posterRequested(search: string, lengths: number[]): { poster: number; panel: number } | null {
  const q = new URLSearchParams(search);
  const poster = Number.parseInt(q.get(POSTER_PARAM) ?? '', 10);
  if (!Number.isFinite(poster) || poster < 1 || poster > lengths.length) return null;
  const panel = Number.parseInt(q.get(PANEL_PARAM) ?? '', 10);
  const max = lengths[poster - 1];
  return { poster: poster - 1, panel: Number.isFinite(panel) ? Math.max(0, Math.min(panel - 1, max - 1)) : 0 };
}

/** Writes the projector (and poster position) into the address without a navigation. */
export function writeProjectorParams(on: boolean, at?: { poster: number; panel: number } | null) {
  const url = new URL(window.location.href);
  if (on) url.searchParams.set(PROJECTOR_PARAM, '1');
  else url.searchParams.delete(PROJECTOR_PARAM);
  if (on && at) {
    url.searchParams.set(POSTER_PARAM, String(at.poster + 1));
    url.searchParams.set(PANEL_PARAM, String(at.panel + 1));
  } else {
    url.searchParams.delete(POSTER_PARAM);
    url.searchParams.delete(PANEL_PARAM);
  }
  const next = url.toString();
  if (next !== window.location.href) window.history.replaceState(window.history.state, '', next);
}

/**
 * [on, setOn] for projector mode. Turning it on or off keeps the address in
 * step, so a teacher can bookmark the projector link or share it.
 */
export function useProjectorMode(): [boolean, (on: boolean) => void] {
  const [on, setOnState] = useState(false);

  useEffect(() => {
    // Read after mount, never during render: the server has no address bar.
    const t = window.setTimeout(() => {
      if (projectorRequested(window.location.search)) setOnState(true);
    }, 0);
    return () => window.clearTimeout(t);
  }, []);

  const setOn = useCallback((next: boolean) => {
    if (!next) justExited = true;
    setOnState(next);
    writeProjectorParams(next);
  }, []);

  return [on, setOn];
}

/**
 * The ?projector=1&poster=N&panel=N deep link for an exhibition's posters:
 * once the page has mounted, opens that poster at that panel. Without
 * ?projector=1 the poster and panel are ignored.
 */
export function usePosterDeepLink<K extends string>(
  ids: readonly K[],
  lengths: Record<K, number>,
  openPoster: (poster: K, at?: number) => void,
) {
  useEffect(() => {
    const t = window.setTimeout(() => {
      const search = window.location.search;
      if (!projectorRequested(search)) return;
      const at = posterRequested(search, ids.map((id) => lengths[id]));
      if (at) openPoster(ids[at.poster], at.panel);
    }, 0);
    return () => window.clearTimeout(t);
    // Only the address the page was opened with counts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
