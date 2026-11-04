'use client';

import { useCallback, useEffect, useState } from 'react';

/*
 * What the tomb remembers. The Tomb Explorer is the way into the Egypt
 * rooms: each room, once finished, leaves something behind in the tomb (the
 * visitor's amulet in its niche, their cartouche on the wall, the mummy in
 * its coffin), so the tomb fills up with their work.
 *
 * It is kept in this browser only (localStorage, one key), never sent
 * anywhere. Every read and write is wrapped: in a private window, or with
 * storage blocked, the rooms all still work and the tomb simply starts
 * empty each time.
 */

export const TOMB_KEY = 'mm-egypt-tomb';

/** The rooms the tomb opens, as the tomb names them. */
export type ActivityId = 'walls' | 'mummification' | 'weighing' | 'rosetta' | 'name' | 'amulet';

/** The visitor's amulet, as the amulet maker saves it. */
export type SavedAmulet = {
  shape: 'scarab' | 'oval' | 'plaque';
  material: 'faience' | 'gold' | 'red' | 'blue';
  symbols: string[];
  owner: string;
};

export type TombState = {
  /** Each room finished, once. */
  done: Partial<Record<ActivityId, true>>;
  /** The details found on each painted wall, by wall id. */
  found: Record<string, string[]>;
  amulet?: SavedAmulet;
  /** The name written in the cartouche room. */
  cartouche?: string;
};

const EMPTY: TombState = { done: {}, found: {} };
const EVENT = 'mm-egypt-tomb-change';

export function readTomb(): TombState {
  try {
    const raw = window.localStorage.getItem(TOMB_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<TombState>;
    return {
      done: parsed.done && typeof parsed.done === 'object' ? parsed.done : {},
      found: parsed.found && typeof parsed.found === 'object' ? parsed.found : {},
      amulet: parsed.amulet,
      cartouche: typeof parsed.cartouche === 'string' ? parsed.cartouche : undefined,
    };
  } catch {
    return EMPTY;
  }
}

/** Keep the tomb's memory; quietly does nothing where storage is blocked. */
function saveTomb(next: TombState) {
  try {
    window.localStorage.setItem(TOMB_KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable: the tomb forgets, and nothing else changes */
  }
}

/** Change the tomb's memory from another room (finishing it, saving what it made). */
export function writeTomb(update: (s: TombState) => TombState): TombState {
  const next = update(readTomb());
  saveTomb(next);
  try {
    window.dispatchEvent(new Event(EVENT));
  } catch {
    /* no window events */
  }
  return next;
}

/** A room finished: the tomb shows what it left behind. */
export function markDone(id: ActivityId) {
  return writeTomb((s) => (s.done[id] ? s : { ...s, done: { ...s.done, [id]: true } }));
}

/**
 * The tomb's memory in a component: read once the page is in the browser
 * (the server cannot see it), and kept fresh when another room or tab
 * changes it.
 */
export function useTomb(): [TombState, (update: (s: TombState) => TombState) => void] {
  const [state, setState] = useState<TombState>(EMPTY);
  useEffect(() => {
    const load = () => setState(readTomb());
    load();
    window.addEventListener(EVENT, load);
    window.addEventListener('storage', load);
    return () => {
      window.removeEventListener(EVENT, load);
      window.removeEventListener('storage', load);
    };
  }, []);
  // The page's own state leads, so the tomb still fills up while the page is
  // open even where storage is blocked; each change is saved as it is made.
  const update = useCallback(
    (fn: (s: TombState) => TombState) =>
      setState((prev) => {
        const next = fn(prev);
        if (next !== prev) saveTomb(next);
        return next;
      }),
    [],
  );
  return [state, update];
}

/** The tomb's address, and a room's address when the tomb opens it (its "M ←" then goes back to the tomb). */
export const TOMB_PATH = '/exhibitions/egypt/tomb';
export const FROM_TOMB = 'tomb';
export const fromTomb = (href: string) => `${href}?from=${FROM_TOMB}`;
