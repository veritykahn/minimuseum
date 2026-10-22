'use client';

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';

/*
 * Whether a game is showing in teacher projector mode, and the ?projector=1
 * deep link. The page always renders the normal game first (server and
 * hydration agree), then switches once it has read the address bar.
 *
 * A tiny shared store says "a projector screen is up" so site chrome that
 * lives outside the page — the floating museum map — can step aside.
 */

let active = 0;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

/** Called by ProjectorStage while it is mounted. */
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
 * that brought them in can take focus back when the game reappears.
 */
let justExited = false;

/** True once after projector mode closes; reading it clears it. */
export function takeJustExited(): boolean {
  const v = justExited;
  justExited = false;
  return v;
}

export const PROJECTOR_PARAM = 'projector';

/** True when the address asks for projector mode (?projector=1). */
export function projectorRequested(search: string): boolean {
  const v = new URLSearchParams(search).get(PROJECTOR_PARAM);
  return v === '1' || v === 'true' || v === 'on';
}

function writeParam(on: boolean) {
  const url = new URL(window.location.href);
  if (on) url.searchParams.set(PROJECTOR_PARAM, '1');
  else url.searchParams.delete(PROJECTOR_PARAM);
  window.history.replaceState(window.history.state, '', url.toString());
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
    writeParam(next);
  }, []);

  return [on, setOn];
}
