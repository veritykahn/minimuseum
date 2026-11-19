'use client';

import { useEffect, useState } from 'react';
import { GLYPHS, type GlyphCode } from '../rooms';
import { spell, type Spelled } from '../hieroglyph-name/alphabet';

/*
 * The cartouche the visitor made in Your Name in Hieroglyphs, read from this
 * browser (localStorage `mm-egypt-cartouche`, written by that room as
 * { name, signs }). The signs are taken as they come: a string of
 * hieroglyphs, a list of hieroglyphs or of sign codes ("S34"), or the
 * spelled letters themselves (a code this room does not know is skipped);
 * failing all of those, the name is spelled again by the same chart. Anything unreadable counts as no cartouche.
 */

export const CARTOUCHE_KEY = 'mm-egypt-cartouche';

export type SavedCartouche = { name: string; spelled: Spelled[] };

function isCode(s: string): s is GlyphCode {
  return Object.prototype.hasOwnProperty.call(GLYPHS, s);
}

/** The signs, as one string of hieroglyphs. */
function glyphsOf(signs: unknown): string {
  if (typeof signs === 'string') return signs;
  if (!Array.isArray(signs)) return '';
  return signs
    .map((s) => {
      // A sign code this room does not know (plain letters and digits) is skipped, not shown as text.
      if (typeof s === 'string') return isCode(s) ? GLYPHS[s] : /^[\x20-\x7e]*$/.test(s) ? '' : s;
      if (s && typeof s === 'object' && typeof (s as Spelled).glyphs === 'string') return (s as Spelled).glyphs;
      return '';
    })
    .join('');
}

export function readCartouche(): SavedCartouche | null {
  try {
    const raw = window.localStorage.getItem(CARTOUCHE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as { name?: unknown; signs?: unknown };
    const name = typeof p.name === 'string' ? p.name.trim() : '';
    const glyphs = glyphsOf(p.signs);
    if (glyphs) return { name, spelled: [{ letters: name, glyphs, codes: [] }] };
    const again = name ? spell(name) : [];
    return again.length ? { name, spelled: again } : null;
  } catch {
    return null;
  }
}

/** The saved cartouche in a component: read in the browser, and again when the visitor comes back to the page. */
export function useSavedCartouche(): SavedCartouche | null {
  const [c, setC] = useState<SavedCartouche | null>(null);
  useEffect(() => {
    const load = () => setC(readCartouche());
    load();
    window.addEventListener('storage', load);
    window.addEventListener('focus', load);
    return () => {
      window.removeEventListener('storage', load);
      window.removeEventListener('focus', load);
    };
  }, []);
  return c;
}
