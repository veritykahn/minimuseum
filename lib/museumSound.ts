import { useSyncExternalStore } from 'react';

/*
 * The museum's one sound switch. Every sound that waits for the visitor's
 * say-so (the halls' sound, a poster's room sound, the games' and rooms'
 * sound effects, the Walk's steps) follows this one choice, so a visitor who
 * turns sound on in the Great Hall finds the rooms sounding too, and turning
 * it off anywhere turns it off everywhere. Each place keeps its own button,
 * where a visitor looks for it; every button sets this.
 *
 * Off until the visitor turns it on; kept for the visit (sessionStorage), so
 * a classroom's computer starts quiet again tomorrow. Where storage is
 * blocked the choice lasts the page.
 *
 * Not covered, because the visitor asks for them directly: the audio guide's
 * narration, a record or a film the visitor presses play on (Harlem's music,
 * the Great War's film), each with its own control.
 *
 * Also here, the halls' dimmer (useHallDim): the floors turn the halls' own
 * sound down as a room's sound comes up, and almost to nothing as a visitor
 * passes the Holocaust exhibition.
 */

export const MUSEUM_SOUND_KEY = 'mm-sound';
/** The keys each switch kept before there was one: read once, so a visit already under way keeps its sound. */
const EARLIER: readonly [key: string, on: string][] = [
  ['hallSound', '1'],
  ['mm-room-sound', 'on'],
];

let cached: boolean | null = null;
const listeners = new Set<() => void>();

function readStored(): boolean {
  try {
    const v = window.sessionStorage.getItem(MUSEUM_SOUND_KEY);
    if (v === 'on') return true;
    if (v === 'off') return false;
    return EARLIER.some(([key, on]) => window.sessionStorage.getItem(key) === on);
  } catch {
    return false;
  }
}

export function isMuseumSoundOn(): boolean {
  if (typeof window === 'undefined') return false;
  if (cached === null) cached = readStored();
  return cached;
}

export function setMuseumSound(on: boolean): void {
  if (cached === on) return;
  cached = on;
  try {
    window.sessionStorage.setItem(MUSEUM_SOUND_KEY, on ? 'on' : 'off');
  } catch {
    /* storage blocked: the choice lasts this page */
  }
  listeners.forEach((l) => l());
}

export function subscribeMuseumSound(l: () => void): () => void {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

/** [on, set]; always off during server render. */
export function useMuseumSound(): [boolean, (on: boolean) => void] {
  const on = useSyncExternalStore(subscribeMuseumSound, isMuseumSoundOn, () => false);
  return [on, setMuseumSound];
}

/* ── The halls' dimmer ── */

let dim = 1;
const dimListeners = new Set<() => void>();

/** How loud the halls' own sound should be, 0 to 1 of its level. */
export function setHallDim(level: number): void {
  const v = Math.max(0, Math.min(1, level));
  if (Math.abs(v - dim) < 0.005) return;
  dim = v;
  dimListeners.forEach((l) => l());
}

export function hallDim(): number {
  return dim;
}

function subscribeDim(l: () => void): () => void {
  dimListeners.add(l);
  return () => {
    dimListeners.delete(l);
  };
}

export function useHallDim(): number {
  return useSyncExternalStore(subscribeDim, hallDim, () => 1);
}

/** For tests: forget the cached choice and the dimmer. */
export function resetMuseumSoundForTests(): void {
  cached = null;
  dim = 1;
}
