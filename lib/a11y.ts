'use client';

import { useEffect, useRef, useSyncExternalStore, type CSSProperties, type KeyboardEvent, type RefObject } from 'react';

/**
 * Visually hidden but still read by screen readers. Used for aria-live
 * announcements and for names that would otherwise be shown only as icons.
 */
export const srOnly: CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

/** True when the visitor has asked the system for reduced motion. */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function subscribeReducedMotion(onChange: () => void) {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {};
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  mq.addEventListener?.('change', onChange);
  return () => mq.removeEventListener?.('change', onChange);
}

/** Reactive version of prefersReducedMotion(); false during server render. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribeReducedMotion, prefersReducedMotion, () => false);
}

/**
 * Keyboard handler for a non-button element given role="button":
 * Enter and Space activate it, as they would a real button.
 */
export function activateOnKey(handler: () => void) {
  return (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      handler();
    }
  };
}

const FOCUSABLE =
  'a[href], area[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), details > summary:first-of-type, [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';

/**
 * Dialog behavior for an element that is open while `active` is true:
 * focus moves into it (to `initialFocus`, else the first focusable child),
 * Tab and Shift+Tab stay inside it, Escape calls `onEscape`, and focus goes
 * back to whatever had it before the dialog opened once it closes.
 */
export function useDialogFocus(
  ref: RefObject<HTMLElement | null>,
  active: boolean,
  options: {
    onEscape?: () => void;
    initialFocus?: RefObject<HTMLElement | null>;
    restoreFocus?: boolean;
    /** Where focus goes on close if the opener is no longer in the page. */
    returnFocus?: () => HTMLElement | null;
  } = {}
) {
  const { onEscape, initialFocus, restoreFocus = true } = options;
  const onEscapeRef = useRef(onEscape);
  useEffect(() => { onEscapeRef.current = onEscape; }, [onEscape]);
  const returnFocusRef = useRef(options.returnFocus);
  useEffect(() => { returnFocusRef.current = options.returnFocus; }, [options.returnFocus]);

  useEffect(() => {
    if (!active) return;
    const active0 = document.activeElement as HTMLElement | null;
    const previous = active0 && active0 !== document.body ? active0 : null;
    const node = ref.current;
    let raf = 0;
    let tries = 0;
    const focusFirst = () => {
      const target =
        initialFocus?.current ||
        (ref.current?.querySelector<HTMLElement>(FOCUSABLE) ?? null) ||
        ref.current ||
        node;
      target?.focus({ preventScroll: true });
      // A dialog that fades in from visibility:hidden can't take focus on
      // its first frame; keep trying briefly until it does.
      if (target && document.activeElement !== target && tries++ < 30) {
        raf = requestAnimationFrame(focusFirst);
      }
    };
    // Wait a frame so content rendered in the same commit is in place.
    raf = requestAnimationFrame(focusFirst);

    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      const el = ref.current;
      if (!el) return;
      if (e.key === 'Escape' && onEscapeRef.current) {
        e.stopPropagation();
        onEscapeRef.current();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (n) => n.offsetParent !== null || n === document.activeElement
      );
      if (items.length === 0) { e.preventDefault(); el.focus(); return; }
      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement as HTMLElement | null;
      if (e.shiftKey && (current === first || !el.contains(current))) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && (current === last || !el.contains(current))) {
        e.preventDefault(); first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown, true);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', onKeyDown, true);
      if (!restoreFocus) return;
      if (previous && document.contains(previous)) {
        previous.focus({ preventScroll: true });
      } else {
        // The opener may have re-rendered as a new node; let it be found again.
        requestAnimationFrame(() => returnFocusRef.current?.()?.focus({ preventScroll: true }));
      }
    };
  }, [active, ref, initialFocus, restoreFocus]);
}
