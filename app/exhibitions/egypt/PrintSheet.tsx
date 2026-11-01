'use client';

import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { InlineSourcesContext } from '@/components/exhibition/SourcesDrawer';

/*
 * A printed sheet for an Egypt room: while `printing`, the sheet is set in a
 * portal at the foot of the page (rooms.css shows only it on paper), the
 * printer is called once the fonts are in, and `onDone` clears it when the
 * printer is finished. A printed sheet cites its sources on the paper,
 * even though the room's own sources are in its Sources drawer on screen.
 */
export default function PrintSheet({ printing, onDone, children }: { printing: boolean; onDone: () => void; children: ReactNode }) {
  useEffect(() => {
    if (!printing) return;
    let cancelled = false;
    window.addEventListener('afterprint', onDone);
    (async () => {
      await document.fonts?.ready;
      if (!cancelled) window.print();
    })();
    return () => {
      cancelled = true;
      window.removeEventListener('afterprint', onDone);
    };
  }, [printing, onDone]);

  if (!printing) return null;
  return createPortal(
    <InlineSourcesContext.Provider value>
      <div className="egr-print-root" aria-hidden="true">
        {children}
      </div>
    </InlineSourcesContext.Provider>,
    document.body,
  );
}
