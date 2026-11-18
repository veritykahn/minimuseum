'use client';

import { useEffect, useState } from 'react';
import { MATERIALS, SHAPES, SYMBOLS, type MaterialId, type ShapeId, type SymbolId } from './amulets';

/*
 * The visitor's finished amulet, kept in this browser only (localStorage,
 * one key) so that two other rooms can use it: Mummification tucks it into
 * the mummy's wrappings, and Build Your Own Tomb lays it in the chamber.
 * It holds just what AmuletArt needs to draw it again. Nothing is sent
 * anywhere; with storage blocked the other rooms simply do without it.
 */

export const AMULET_KEY = 'mm-egypt-amulet';
const EVENT = 'mm-egypt-amulet-change';

export type SavedAmulet = {
  shape: ShapeId;
  material: MaterialId;
  symbols: SymbolId[];
  /** The name carved on it, as typed (may be empty). */
  name: string;
  /** That name in hieroglyphs, as the amulet maker spelled it. */
  nameGlyphs: string;
};

/** The saved amulet, checked piece by piece; null if there is none or it is not one. */
export function readAmulet(): SavedAmulet | null {
  try {
    const raw = window.localStorage.getItem(AMULET_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as Partial<SavedAmulet>;
    if (!SHAPES.some((s) => s.id === p.shape) || !MATERIALS.some((m) => m.id === p.material)) return null;
    const symbols = Array.isArray(p.symbols) ? p.symbols.filter((s): s is SymbolId => SYMBOLS.some((x) => x.id === s)) : [];
    return {
      shape: p.shape as ShapeId,
      material: p.material as MaterialId,
      symbols,
      name: typeof p.name === 'string' ? p.name : '',
      nameGlyphs: typeof p.nameGlyphs === 'string' ? p.nameGlyphs : '',
    };
  } catch {
    return null;
  }
}

export function saveAmulet(a: SavedAmulet) {
  try {
    window.localStorage.setItem(AMULET_KEY, JSON.stringify(a));
    window.dispatchEvent(new Event(EVENT));
  } catch {
    /* storage unavailable: the other rooms do without it */
  }
}

/** The saved amulet in a component: read in the browser, kept fresh when another room or tab saves one. */
export function useSavedAmulet(): SavedAmulet | null {
  const [a, setA] = useState<SavedAmulet | null>(null);
  useEffect(() => {
    const load = () => setA(readAmulet());
    load();
    window.addEventListener(EVENT, load);
    window.addEventListener('storage', load);
    window.addEventListener('focus', load);
    return () => {
      window.removeEventListener(EVENT, load);
      window.removeEventListener('storage', load);
      window.removeEventListener('focus', load);
    };
  }, []);
  return a;
}

/** "a gold scarab carved with the ankh and the lotus flower", for alt text. */
export function describeAmulet(a: Pick<SavedAmulet, 'shape' | 'material' | 'symbols'>): string {
  const shape = SHAPES.find((s) => s.id === a.shape)!.name.toLowerCase();
  const material = MATERIALS.find((m) => m.id === a.material)!.name.toLowerCase();
  const picked = a.symbols.map((id) => SYMBOLS.find((s) => s.id === id)!.name.toLowerCase());
  return `${/^[aeiou]/.test(shape) ? 'an' : 'a'} ${shape} of ${material}${picked.length ? `, carved with ${picked.map((p) => `the ${p}`).join(' and ')}` : ''}`;
}
