'use client';

import { useCallback, useEffect, useState } from 'react';

/**
 * An element's inner size in CSS px, kept up to date as it changes (the
 * thread's band). A callback ref, so a band that comes and goes with the
 * room's mode is measured again each time it comes back.
 */
export function useBox<T extends HTMLElement>() {
  const [el, setEl] = useState<T | null>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const ref = useCallback((node: T | null) => setEl(node), []);
  useEffect(() => {
    if (!el) return;
    const measure = () => setBox({ w: el.clientWidth, h: el.clientHeight });
    measure();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measure);
      return () => window.removeEventListener('resize', measure);
    }
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [el]);
  return [ref, box] as const;
}
