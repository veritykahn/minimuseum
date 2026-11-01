'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type React from 'react';
import { focusElement, focusHeadingIn, usePendingFocus } from '@/lib/a11y/focus';

/**
 * Poster walkthroughs on the exhibition landing pages.
 *
 * `usePosterWalkthrough` owns the open/step/close state machine shared by every
 * exhibition, and wires `usePosterNavigation` into it so a visitor can move
 * through a poster with the keyboard, a swipe, or a tap on either side of the
 * stage, as well as with the Previous/Next buttons.
 */

const OPEN_DELAY = 300;
/** How long the outgoing panel takes to leave. Kept short: the reveal belongs to the incoming one. */
const STEP_DELAY = 260;
const SWIPE_THRESHOLD = 50;
/** Tapping at or right of this fraction of the stage width goes forward. */
const FORWARD_FROM = 0.4;
const HINT_KEY = 'mm-poster-nav-hint-seen';

export const POSTER_NAV_HINT_SR =
  'Use the left and right arrow keys, swipe, or tap the right or left side of the screen to move between panels. Press Escape to close the poster.';

const INTERACTIVE =
  'a[href],button,input,select,textarea,label,summary,details,video,audio,iframe,[role="button"],[role="link"],[role="slider"],[role="tab"],[contenteditable=""],[contenteditable="true"],[tabindex]:not([tabindex="-1"])';

function isFormField(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false;
  if (el.isContentEditable) return true;
  const tag = el.tagName;
  if (tag === 'TEXTAREA' || tag === 'SELECT') return true;
  if (tag === 'INPUT') {
    const type = (el as HTMLInputElement).type;
    return !['button', 'submit', 'reset', 'checkbox', 'radio', 'image'].includes(type);
  }
  return false;
}

function inSourcesDrawer(el: EventTarget | Element | null): boolean {
  return el instanceof Element && !!el.closest('.mm-sources-panel');
}

function hintAlreadySeen(): boolean {
  try {
    return window.sessionStorage.getItem(HINT_KEY) === '1';
  } catch {
    return false;
  }
}

function markHintSeen() {
  try {
    window.sessionStorage.setItem(HINT_KEY, '1');
  } catch {
    /* storage unavailable: the hint simply shows again next time */
  }
}

export type PosterNavigationOptions = {
  /** Listeners are attached only while this is true. */
  active: boolean;
  step: number;
  count: number;
  goTo: (step: number) => void;
  /**
   * Move relative to where the walkthrough is heading. When given, arrows,
   * swipes and taps use it, so a second press during a transition goes one
   * further instead of being swallowed.
   */
  goBy?: (delta: number) => void;
  onClose: () => void;
};

export type PosterStageProps = {
  onClick: React.MouseEventHandler<HTMLElement>;
  onPointerMove: React.PointerEventHandler<HTMLElement>;
  onPointerLeave: React.PointerEventHandler<HTMLElement>;
  onTouchStart: React.TouchEventHandler<HTMLElement>;
  onTouchEnd: React.TouchEventHandler<HTMLElement>;
  'data-poster-stage': '';
};

/**
 * Keyboard (←/→, PageUp/PageDown, Home/End, Escape), horizontal swipe and
 * side-tap navigation for a step-by-step walkthrough. Spread the returned
 * props onto the element that fills the stage.
 */
export function usePosterNavigation({ active, step, count, goTo, goBy, onClose }: PosterNavigationOptions): PosterStageProps {
  // Read the latest values from inside listeners without re-subscribing.
  const latest = useRef({ step, count, goTo, onClose, by: (d: number) => goTo(step + d) });
  useLayoutEffect(() => {
    latest.current = { step, count, goTo, onClose, by: goBy ?? ((d: number) => goTo(step + d)) };
  });

  useEffect(() => {
    if (!active) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      if (isFormField(e.target) || isFormField(document.activeElement)) return;
      // Not under the open Sources and credits drawer (SourcesDrawer): its keys are its own.
      if (inSourcesDrawer(e.target) || inSourcesDrawer(document.activeElement)) return;
      const { count: n, goTo: go, onClose: close, by } = latest.current;
      switch (e.key) {
        case 'ArrowRight':
        case 'PageDown':
          by(1);
          break;
        case 'ArrowLeft':
        case 'PageUp':
          by(-1);
          break;
        case 'Home':
          go(0);
          break;
        case 'End':
          go(n - 1);
          break;
        case 'Escape':
          close();
          break;
        default:
          return;
      }
      e.preventDefault();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [active]);

  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const lastSwipe = useRef(0);

  const onTouchStart = useCallback((e: React.TouchEvent<HTMLElement>) => {
    if (e.touches.length !== 1) {
      touchStart.current = null;
      return;
    }
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  }, []);

  const onTouchEnd = useCallback((e: React.TouchEvent<HTMLElement>) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start || e.changedTouches.length === 0) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    // Mostly-vertical moves are scrolls, not swipes.
    if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    lastSwipe.current = Date.now();
    latest.current.by(dx < 0 ? 1 : -1);
  }, []);

  const onClick = useCallback((e: React.MouseEvent<HTMLElement>) => {
    // detail 0 is a keyboard-activated click, which only ever lands on controls.
    if (e.defaultPrevented || e.button !== 0 || e.detail === 0) return;
    if (Date.now() - lastSwipe.current < 500) return;
    const target = e.target as HTMLElement;
    if (target.closest(INTERACTIVE)) return;
    const selection = window.getSelection?.();
    if (selection && !selection.isCollapsed && selection.toString().trim()) return;
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width === 0) return;
    const forward = (e.clientX - rect.left) / rect.width >= FORWARD_FROM;
    latest.current.by(forward ? 1 : -1);
  }, []);

  // A cursor hint for mouse users: e-resize on the forward side, w-resize on
  // the back side. Set as an attribute so moving the mouse never re-renders.
  const onPointerMove = useCallback((e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse') return;
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0) return;
    const { step: s, count: n } = latest.current;
    const forward = (e.clientX - rect.left) / rect.width >= FORWARD_FROM;
    const side = forward ? (s < n - 1 ? 'next' : '') : s > 0 ? 'prev' : '';
    if (el.dataset.posterSide !== side) el.dataset.posterSide = side;
  }, []);

  const onPointerLeave = useCallback((e: React.PointerEvent<HTMLElement>) => {
    e.currentTarget.dataset.posterSide = '';
  }, []);

  return { onClick, onPointerMove, onPointerLeave, onTouchStart, onTouchEnd, 'data-poster-stage': '' };
}

/**
 * The open → step → close state machine for an exhibition's posters.
 * `lengths` gives the number of panels in each poster, keyed by poster id.
 */
export type PosterWalkthroughOptions = {
  /**
   * False suppresses the first-open tip (and its spoken copy). Projector mode
   * passes false: it shows its own key hints, and Escape does not close there.
   */
  hint?: boolean;
};

export function usePosterWalkthrough<K extends string>(lengths: Record<K, number>, options: PosterWalkthroughOptions = {}) {
  const [activeView, setActiveView] = useState<'main' | K>('main');
  const [posterStep, setPosterStep] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
  const [animationKey, setAnimationKey] = useState(0);
  /** 1 when moving forward, -1 when moving back. Drives directional motion. */
  const [direction, setDirection] = useState<1 | -1>(1);
  /** The panel the visitor came from, so a progress bar can travel from it. */
  const [fromStep, setFromStep] = useState(0);
  const [hintVisible, setHintVisible] = useState(false);
  const [hintAnnounced, setHintAnnounced] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const lastPoster = useRef<K | null>(null);
  const target = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closing = useRef(false);
  const requestFocus = usePendingFocus();
  const hintAllowed = useRef(options.hint !== false);
  useLayoutEffect(() => {
    hintAllowed.current = options.hint !== false;
  });

  const isOpen = activeView !== 'main';
  const count = isOpen ? lengths[activeView as K] : 0;

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const schedule = useCallback((delay: number, run: () => void) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      timer.current = null;
      run();
    }, delay);
  }, []);

  /** Opens a poster at its first panel, or at `at` (a deep link into projector mode). */
  const openPoster = useCallback((poster: K, at = 0) => {
    const start = Math.max(0, Math.min(Math.floor(at) || 0, lengths[poster] - 1));
    lastPoster.current = poster;
    closing.current = false;
    target.current = start;
    setFadeIn(false);
    setHintVisible(false);
    setHintAnnounced(false);
    schedule(OPEN_DELAY, () => {
      requestFocus(() => focusHeadingIn(contentRef.current));
      setActiveView(poster);
      setPosterStep(start);
      setFromStep(start);
      setDirection(1);
      setAnimationKey(prev => prev + 1);
      setFadeIn(true);
      if (hintAllowed.current && !hintAlreadySeen()) {
        markHintSeen();
        setHintVisible(true);
        setHintAnnounced(true);
      }
    });
    // `lengths` is a fresh object literal each render; only its values matter.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestFocus, schedule]);

  const goToStep = useCallback((next: number) => {
    if (!isOpen || closing.current) return;
    const clamped = Math.max(0, Math.min(next, count - 1));
    // Repeated presses during a transition retarget it rather than stacking.
    const inFlight = timer.current !== null;
    if (clamped === (inFlight ? target.current : posterStep)) return;
    target.current = clamped;
    setHintVisible(false);
    setHintAnnounced(false);
    if (inFlight) return;
    const from = posterStep;
    setDirection(clamped > from ? 1 : -1);
    setFadeIn(false);
    schedule(STEP_DELAY, () => {
      requestFocus(() => focusHeadingIn(contentRef.current));
      setDirection(target.current > from ? 1 : -1);
      setFromStep(from);
      setPosterStep(target.current);
      setAnimationKey(prev => prev + 1);
      setFadeIn(true);
    });
  }, [isOpen, count, posterStep, requestFocus, schedule]);

  /** Relative moves count from the panel already on its way in, if any. */
  const goBy = useCallback((delta: number) => {
    const base = timer.current !== null && !closing.current ? target.current : posterStep;
    goToStep(base + delta);
  }, [goToStep, posterStep]);
  const nextStep = useCallback(() => goBy(1), [goBy]);
  const prevStep = useCallback(() => goBy(-1), [goBy]);

  const returnToMain = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    setHintVisible(false);
    setHintAnnounced(false);
    setFadeIn(false);
    schedule(OPEN_DELAY, () => {
      closing.current = false;
      const opener = lastPoster.current;
      requestFocus(() => focusElement(opener ? document.querySelector<HTMLElement>(`[data-poster="${opener}"]`) : null));
      setActiveView('main');
      setPosterStep(0);
      target.current = 0;
      setFadeIn(true);
    });
  }, [requestFocus, schedule]);

  const stageProps = usePosterNavigation({
    active: isOpen,
    step: posterStep,
    count,
    goTo: goToStep,
    goBy,
    onClose: returnToMain,
  });

  const dismissHint = useCallback(() => setHintVisible(false), []);

  /** Text for the page's polite live region. The hint is spoken once, on first open. */
  const announcement = isOpen
    ? `Panel ${posterStep + 1} of ${count}.${hintAnnounced ? ` ${POSTER_NAV_HINT_SR}` : ''}`
    : '';

  return {
    activeView,
    posterStep,
    fromStep,
    direction,
    fadeIn,
    animationKey,
    contentRef,
    openPoster,
    goToStep,
    nextStep,
    prevStep,
    returnToMain,
    stageProps,
    hintVisible,
    dismissHint,
    announcement,
  };
}
