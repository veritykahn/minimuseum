'use client';

import { useSyncExternalStore } from 'react';

/*
 * A random seed that exists only in the browser. During the server render and
 * the hydration pass it is null, so anything shuffled from it is rendered only
 * once the page is live — the server and the first client render always agree
 * and React never sees a hydration mismatch (error #418).
 */

let seed: number | null = null;

function getSeed(): number {
  if (seed === null) seed = Math.floor(Math.random() * 0xffffffff) >>> 0;
  return seed;
}

const noopSubscribe = () => () => {};

export function useClientSeed(): number | null {
  return useSyncExternalStore(noopSubscribe, getSeed, () => null);
}

/** Derives a fresh seed for a replay from the session seed and a counter. */
export function nextSeed(base: number, n: number): number {
  return (base + Math.imul(n, 0x9e3779b1)) >>> 0;
}
