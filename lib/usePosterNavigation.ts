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
const STEP_DELAY = 400;
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
export function usePosterNavigation({ active, step, count, goTo, onClose }: PosterNavigationOptions): PosterStageProps {
  // Read the latest values from inside listeners without re-subscribing.
  const latest = useRef({ step, count, goTo, onClose });
  useLayoutEffect(() => {
    latest.current = { step, count, goTo, onClose };
  });

  useEffect(() => {
    if (!active) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      if (isFormField(e.target) || isFormField(document.activeElement)) return;
      const { step: s, count: n, goTo: go, onClose: close } = latest.current;
      switch (e.key) {
        case 'ArrowRight':
        case 'PageDown':
          go(s + 1);
          break;
        case 'ArrowLeft':
        case 'PageUp':
          go(s - 1);
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
    const { step: s, goTo: go } = latest.current;
    go(dx < 0 ? s + 1 : s - 1);
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
    const { step: s, goTo: go } = latest.current;
    go(forward ? s + 1 : s - 1);
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
export function usePosterWalkthrough<K extends string>(lengths: Record<K, number>) {
  const [activeView, setActiveView] = useState<'main' | K>('main');
  const [posterStep, setPosterStep] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
  const [animationKey, setAnimationKey] = useState(0);
  const [hintVisible, setHintVisible] = useState(false);
  const [hintAnnounced, setHintAnnounced] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const lastPoster = useRef<K | null>(null);
  const target = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closing = useRef(false);
  const requestFocus = usePendingFocus();

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

  const openPoster = useCallback((poster: K) => {
    lastPoster.current = poster;
    closing.current = false;
    target.current = 0;
    setFadeIn(false);
    schedule(OPEN_DELAY, () => {
      requestFocus(() => focusHeadingIn(contentRef.current));
      setActiveView(poster);
      setPosterStep(0);
      setAnimationKey(prev => prev + 1);
      setFadeIn(true);
      if (!hintAlreadySeen()) {
        markHintSeen();
        setHintVisible(true);
        setHintAnnounced(true);
      }
    });
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
    setFadeIn(false);
    schedule(STEP_DELAY, () => {
      requestFocus(() => focusHeadingIn(contentRef.current));
      setPosterStep(target.current);
      setAnimationKey(prev => prev + 1);
      setFadeIn(true);
    });
  }, [isOpen, count, posterStep, requestFocus, schedule]);

  const nextStep = useCallback(() => goToStep(posterStep + 1), [goToStep, posterStep]);
  const prevStep = useCallback(() => goToStep(posterStep - 1), [goToStep, posterStep]);

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
