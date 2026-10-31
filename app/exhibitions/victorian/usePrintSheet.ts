'use client';

import { useEffect } from 'react';

/*
 * Printing a sheet from a Victorian room (the photography bench's sheet, the
 * Christmas ghost story): while `printing` is true the room renders its
 * sheet into `.vbr-print-root` on the body (rooms.css hides the rest of the
 * page in print). Once the fonts are in and every picture on the sheet has
 * loaded, the browser's print dialog opens; when it closes, `done` clears
 * the sheet. Waiting for the pictures matters: a print started before them
 * comes out with empty frames.
 */

/** Loads a picture by its address, settling (never failing) once it is in or has failed, or after `ms` at most. */
function loaded(src: string, ms = 2500) {
  return new Promise<void>((resolve) => {
    const img = new Image();
    const done = () => resolve();
    img.onload = done;
    img.onerror = done;
    window.setTimeout(done, ms);
    img.src = src;
  });
}

/** Resolves when the fonts are in and every picture on the sheet (an <img>, or an SVG <image> such as a card's front) has loaded. */
export function sheetReady(root: ParentNode | null): Promise<unknown> {
  const imgs = root ? Array.from(root.querySelectorAll('img')) : [];
  const svgImages = root ? Array.from(root.querySelectorAll('image')) : [];
  return Promise.all([
    document.fonts?.ready,
    ...imgs.map((img) => (img.complete && img.naturalWidth ? Promise.resolve() : loaded(img.currentSrc || img.src))),
    ...svgImages.map((im) => {
      const href = im.getAttribute('href') || im.getAttribute('xlink:href');
      return href ? loaded(href) : Promise.resolve();
    }),
  ]);
}

export function usePrintSheet(printing: boolean, done: () => void, root = '.vbr-print-root') {
  useEffect(() => {
    if (!printing) return;
    let cancelled = false;
    const after = () => done();
    window.addEventListener('afterprint', after);
    (async () => {
      await sheetReady(document.querySelector(root));
      if (!cancelled) window.print();
    })();
    return () => {
      cancelled = true;
      window.removeEventListener('afterprint', after);
    };
  }, [printing, done, root]);
}
