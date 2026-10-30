'use client';

import { useEffect, useState } from 'react';
import { FROM_STUDIO, STUDIO, STUDIO_TOOLS } from './floors';

/*
 * Where a page's top-left "M ←" link goes: back the way the visitor came.
 *
 * Each page knows its usual way back (a room: its display case; an
 * exhibition: its floor, at its own card). The one door that leads somewhere
 * else is the Studio's: its tools are rooms in their exhibitions, so a tool
 * opened from the Studio carries `?from=studio` in its address, and its
 * "M ←" goes back to the Studio, at that tool's card, instead of to the
 * display case. A direct visit, a bookmark or a link from anywhere else has
 * no `from`, and gets the page's usual way back.
 */

export type MuseumReturn = {
  href: string;
  /** The link's visible name: "Display Case", "Studio". */
  label: string;
  /** Saved to sessionStorage on the way out, so a floor opens at the right card. */
  remember?: { key: string; value: string };
};

/** The Studio, at the card of the tool on this page (the one with this #tab, if two share the room). */
export function studioReturnFor(pathname: string, hash = ''): MuseumReturn {
  const strip = (p: string) => p.replace(/\/$/, '');
  const here = strip(pathname);
  const tab = hash.replace(/^#/, '');
  const onPage = STUDIO_TOOLS.map((t, i) => ({ t, i })).filter(({ t }) => strip(t.href.split('#')[0]) === here);
  const match = onPage.find(({ t }) => t.href.split('#')[1] === tab) ?? onPage[0];
  return {
    href: STUDIO.path,
    label: STUDIO.title,
    remember: match ? { key: STUDIO.storageKey, value: String(match.i) } : undefined,
  };
}

/** The way back for a page at this address: the Studio's, or the page's own. */
export function returnFor(location: { pathname: string; search: string; hash: string }, fallback: MuseumReturn): MuseumReturn {
  const from = new URLSearchParams(location.search).get('from');
  return from === FROM_STUDIO ? studioReturnFor(location.pathname, location.hash) : fallback;
}

/** Called as the visitor leaves by the link: the floor it goes to opens at the right card. */
export function rememberReturn(back: MuseumReturn): void {
  if (!back.remember) return;
  try {
    sessionStorage.setItem(back.remember.key, back.remember.value);
  } catch {
    /* storage unavailable: the floor simply opens at its start */
  }
}

/**
 * The way back for this page. It renders the page's own way back first (the
 * server cannot see where the visitor came from), then the Studio's when the
 * address says so, read once as the page opens so a later change of #tab
 * does not move it.
 */
export function useMuseumReturn(fallback: MuseumReturn): MuseumReturn {
  const [fromStudio, setFromStudio] = useState<MuseumReturn | null>(null);
  useEffect(() => {
    // The address is only known in the browser.
    const back = returnFor(window.location, fallback);
    if (back !== fallback) setFromStudio(back);
    // Read once, on arrival: the fallback is a fresh object each render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return fromStudio ?? fallback;
}
