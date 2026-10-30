'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/*
 * Paints the page's ground behind the scrollbar. The scrollbar track is
 * transparent (globals.css), so what shows through is the document's own
 * background; every page draws its color on a wrapper instead, so without
 * this a band of the body's black ran down the side of every colored page.
 *
 * It reads the color actually drawn at the right-hand edge of the content,
 * walking up from the element there to the first that has a background, and
 * gives that to <html>. It checks again on each navigation and every second,
 * since a page changes its ground as its views change (the landing page, a
 * poster walkthrough). Purely cosmetic: nothing else depends on it.
 */

const TRANSPARENT = /^(transparent|rgba\(0, 0, 0, 0\))$/;

function groundAtEdge(): string | null {
  const x = window.innerWidth - document.documentElement.clientWidth > 0 ? document.documentElement.clientWidth - 2 : window.innerWidth - 2;
  const y = Math.round(window.innerHeight / 2);
  for (let el = document.elementFromPoint(x, y); el && el !== document.documentElement; el = el.parentElement) {
    const bg = getComputedStyle(el).backgroundColor;
    if (!TRANSPARENT.test(bg)) return bg;
  }
  return null;
}

export default function PageGround() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const paint = () => {
      const bg = groundAtEdge();
      if (bg && root.style.backgroundColor !== bg) root.style.backgroundColor = bg;
    };
    const first = window.setTimeout(paint, 50);
    const every = window.setInterval(paint, 1000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(every);
    };
  }, [pathname]);

  return null;
}
