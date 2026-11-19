'use client';

import { useCallback, useEffect, useState } from 'react';

/*
 * What the Egypt rooms remember: the details found on each of the Tomb
 * Explorer's painted walls, each room finished, the visitor's amulet, the
 * name they wrote in a cartouche, and, above all, what each room has put in
 * the visitor's own burial tomb.
 *
 * The journey (Nov 19): the visitor builds their burial tomb first (Build
 * Your Own Tomb, first on the Egypt landing). It has an empty place for each
 * of the other rooms (TOMB_PLACES), and each place is a door to the room
 * that fills it. Every other room ends with "Put this in your burial tomb"
 * (PutInTomb.tsx), which keeps what it made here (keepInTomb) and leads back
 * to the tomb, where it now stands in its place. When every place is full,
 * the visitor seals the tomb. (The Tomb Explorer's old burial chamber, which
 * linked out to the rooms, is gone; this is its own room now.)
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
  /**
   * What each room put in the visitor's burial tomb (Build Your Own Tomb), by
   * room: a short plain name of the thing, "your mummy in its coffin". A room
   * adds it with keepInTomb, from its last step's PutInTomb button.
   */
  kept?: Partial<Record<ActivityId, string>>;
  /** The painted wall the Tomb Explorer put in the visitor's tomb (a wall id from tomb/scenes.ts). */
  painting?: string;
};

/**
 * The places in the visitor's burial tomb, one for each room, in the order
 * the Egypt landing lists the rooms: where each room's thing goes, what the
 * empty place waits for, and the room that fills it. The tomb draws each
 * place empty (a door to its room) or filled; PutInTomb names the place as
 * the thing goes in.
 */
// REVIEW: new text (names of places and rooms; no facts).
export const TOMB_PLACES: { activity: ActivityId; place: string; waits: string; room: string; href: string }[] = [
  { activity: 'walls', place: 'the painted wall', waits: 'a painting for the wall', room: 'Tomb Explorer', href: '/exhibitions/egypt/tomb' },
  { activity: 'name', place: 'the stone column', waits: 'your name, carved in a cartouche', room: 'Your Name in Hieroglyphs', href: '/exhibitions/egypt/hieroglyph-name' },
  { activity: 'rosetta', place: 'the scroll stand', waits: 'a papyrus with a royal name you decode', room: 'The Rosetta Stone Decoder', href: '/exhibitions/egypt/rosetta-stone' },
  { activity: 'amulet', place: 'the niche', waits: 'an amulet you design', room: 'Design an Amulet', href: '/exhibitions/egypt/amulet' },
  { activity: 'mummification', place: 'the coffin', waits: 'a mummy, made by you', room: 'Mummification, Step by Step', href: '/exhibitions/egypt/mummification' },
  { activity: 'weighing', place: 'the offering table', waits: 'a heart amulet, for your judgement', room: 'The Weighing of the Heart', href: '/exhibitions/egypt/weighing-of-the-heart' },
];

/** The place in the tomb for a room's thing. */
export const placeFor = (id: ActivityId) => TOMB_PLACES.find((p) => p.activity === id)!;

/** Is this room's thing in the tomb? */
export const isKept = (s: TombState, id: ActivityId) => !!s.kept?.[id];

/** How many of the tomb's places are filled. */
export const keptCount = (s: TombState) => TOMB_PLACES.filter((p) => isKept(s, p.activity)).length;

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
      kept: parsed.kept && typeof parsed.kept === 'object' ? parsed.kept : {},
      painting: typeof parsed.painting === 'string' ? parsed.painting : undefined,
    };
  } catch {
    return EMPTY;
  }
}

/** Can this browser keep the tomb at all? (Not in some private windows, or with storage blocked.) */
function storageWorks(): boolean {
  try {
    const k = `${TOMB_KEY}-test`;
    window.localStorage.setItem(k, '1');
    window.localStorage.removeItem(k);
    return true;
  } catch {
    return false;
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

/** A room's last step: what it made goes into the visitor's burial tomb (and the room counts as finished). */
export function keepInTomb(id: ActivityId, what: string) {
  return writeTomb((s) => ({ ...s, done: { ...s.done, [id]: true }, kept: { ...(s.kept ?? {}), [id]: what } }));
}

/** Take a room's thing out of the tomb again (the tomb's "start again"). */
export function emptyTomb() {
  return writeTomb((s) => ({ ...s, kept: {}, painting: undefined }));
}

/** The visitor's own burial tomb (Build Your Own Tomb), where every room's last step leads. */
export const MY_TOMB_PATH = '/exhibitions/egypt/my-tomb';

/**
 * The tomb's memory in a component: read once the page is in the browser
 * (the server cannot see it), and kept fresh when another room or tab
 * changes it.
 */
export function useTomb(): [TombState, (update: (s: TombState) => TombState) => void] {
  const [state, setState] = useState<TombState>(EMPTY);
  useEffect(() => {
    // Where storage is blocked, a change elsewhere (a room's keepInTomb)
    // cannot be read back, so the page keeps what it has rather than going
    // blank.
    const load = () => {
      if (storageWorks()) setState(readTomb());
    };
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

/** The tomb's address. `fromTomb` once marked a room opened from the chamber; the mark is now ignored (rooms go back to the exhibition). */
export const TOMB_PATH = '/exhibitions/egypt/tomb';
export const FROM_TOMB = 'tomb';
export const fromTomb = (href: string) => `${href}?from=${FROM_TOMB}`;
