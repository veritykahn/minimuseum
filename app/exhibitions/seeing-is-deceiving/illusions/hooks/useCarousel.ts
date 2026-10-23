'use client';

import { useState, useCallback, useEffect } from 'react';

type UseCarouselOptions = {
  totalItems: number;
  initialIndex?: number;
  fadeDuration?: number;
  /**
   * The lowest index "previous" may reach once past it. The illusions page
   * passes 1 so ← from the first illusion stays put (its button is disabled)
   * instead of falling back to the intro.
   */
  minIndex?: number;
};

/**
 * Whether a keydown belongs to something else on the page: a control that
 * uses arrow keys itself (sliders, text fields, a magnifier), or an open modal
 * dialog — "The Science" card, the museum map — which owns the keyboard.
 */
export function keyBelongsElsewhere(e: KeyboardEvent): boolean {
  if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return true;
  const t = e.target as HTMLElement | null;
  if (t && t.closest?.('input, textarea, select, [contenteditable="true"], [role="slider"], [aria-roledescription="magnifier"]')) return true;
  const dialogs = document.querySelectorAll<HTMLElement>('[role="dialog"][aria-modal="true"], dialog[open]');
  for (const d of dialogs) {
    if (d.hasAttribute('inert')) continue;
    const style = window.getComputedStyle(d);
    if (style.visibility !== 'hidden' && style.display !== 'none') return true;
  }
  return false;
}

/**
 * Hook for managing carousel navigation with fade transitions
 */
export function useCarousel({
  totalItems,
  initialIndex = 0,
  fadeDuration = 400,
  minIndex = 0,
}: UseCarouselOptions) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [fadeIn, setFadeIn] = useState(true);
  const [animationKey, setAnimationKey] = useState(0);

  const canGoNext = currentIndex < totalItems - 1;
  const canGoPrev = currentIndex > minIndex;

  const animateTransition = useCallback(
    (callback: () => void) => {
      setFadeIn(false);
      setTimeout(() => {
        callback();
        setAnimationKey((prev) => prev + 1);
        setFadeIn(true);
      }, fadeDuration);
    },
    [fadeDuration]
  );

  const next = useCallback(() => {
    if (canGoNext) {
      animateTransition(() => setCurrentIndex((prev) => prev + 1));
    }
  }, [canGoNext, animateTransition]);

  const prev = useCallback(() => {
    if (canGoPrev) {
      animateTransition(() => setCurrentIndex((prev) => prev - 1));
    }
  }, [canGoPrev, animateTransition]);

  const goTo = useCallback(
    (index: number) => {
      if (index >= 0 && index < totalItems && index !== currentIndex) {
        animateTransition(() => setCurrentIndex(index));
      }
    },
    [totalItems, currentIndex, animateTransition]
  );

  const reset = useCallback(() => {
    animateTransition(() => setCurrentIndex(0));
  }, [animateTransition]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (keyBelongsElsewhere(e)) return;
      // Left and right only: up and down still scroll a tall slide.
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        next();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [next, prev]);

  return {
    currentIndex,
    fadeIn,
    animationKey,
    canGoNext,
    canGoPrev,
    next,
    prev,
    goTo,
    reset,
  };
}
