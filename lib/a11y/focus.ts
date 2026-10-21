'use client';

import { useCallback, useEffect, useRef } from 'react';
import type React from 'react';

const NATIVELY_FOCUSABLE = 'a[href],button,input,select,textarea,summary,[tabindex]';

/** Focus an element, making it programmatically focusable first if it isn't. */
export function focusElement(el: HTMLElement | null | undefined) {
  if (!el) return;
  if (!el.matches(NATIVELY_FOCUSABLE)) el.setAttribute('tabindex', '-1');
  // Programmatic focus targets don't need a ring; real controls keep theirs.
  if (el.getAttribute('tabindex') === '-1') el.setAttribute('data-focus-target', '');
  el.focus({ preventScroll: true });
}

/** Focus the first heading inside a container, or the container itself. */
export function focusHeadingIn(container: HTMLElement | null | undefined) {
  if (!container) return;
  const heading = container.querySelector<HTMLElement>('h1, h2, h3, h4, h5, h6');
  focusElement(heading ?? container);
}

/**
 * Returns a function that queues a focus move for after the next render.
 * Call it in the same tick as the state update that swaps the content in.
 */
export function usePendingFocus() {
  const pending = useRef<(() => void) | null>(null);
  useEffect(() => {
    if (!pending.current) return;
    const run = pending.current;
    pending.current = null;
    run();
  });
  return useCallback((run: () => void) => {
    pending.current = run;
  }, []);
}

/**
 * Moves focus when a multi-step flow changes step (never on first render), to
 * the first element in `container` matching `selector`, else the container.
 */
export function useFocusOnStepChange(
  stepKey: string,
  containerRef: React.RefObject<HTMLElement | null>,
  selector: string,
) {
  const previous = useRef(stepKey);
  useEffect(() => {
    if (previous.current === stepKey) return;
    previous.current = stepKey;
    const container = containerRef.current;
    if (!container) return;
    focusElement(container.querySelector<HTMLElement>(selector) ?? container);
  }, [stepKey, containerRef, selector]);
}
