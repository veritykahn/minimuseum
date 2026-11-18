import type { Spelled } from './alphabet';

/*
 * The visitor's finished cartouche, kept in this browser so another room
 * can use it (Build Your Own Tomb places it on a wall). One key, JSON:
 *
 *   mm-egypt-cartouche  { "name": "Maya", "signs": [ ...Spelled ] }
 *
 * `signs` is exactly what Cartouche.tsx draws (its `spelled` prop): each
 * letter or pair ("CH", "SH"), its hieroglyphs as text, and their Gardiner
 * codes. Never sent anywhere. Every read and write is wrapped: where
 * storage is blocked, saving simply does nothing and reading finds nothing.
 */

export const CARTOUCHE_KEY = 'mm-egypt-cartouche';

export type SavedCartouche = { name: string; signs: Spelled[] };

/** Keep the visitor's cartouche; false where storage is blocked. */
export function saveCartouche(name: string, signs: Spelled[]): boolean {
  try {
    window.localStorage.setItem(CARTOUCHE_KEY, JSON.stringify({ name, signs } satisfies SavedCartouche));
    return true;
  } catch {
    return false;
  }
}

/** The saved cartouche, if there is one and it reads as one. */
export function readCartouche(): SavedCartouche | null {
  try {
    const raw = window.localStorage.getItem(CARTOUCHE_KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as Partial<SavedCartouche>;
    if (typeof v.name !== 'string' || !Array.isArray(v.signs)) return null;
    const signs = v.signs.filter((s): s is Spelled => !!s && typeof s.letters === 'string' && typeof s.glyphs === 'string' && Array.isArray(s.codes));
    return { name: v.name, signs };
  } catch {
    return null;
  }
}
