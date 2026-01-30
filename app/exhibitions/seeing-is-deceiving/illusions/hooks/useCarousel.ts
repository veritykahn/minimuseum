'use client';

import { useState, useCallback, useEffect } from 'react';

type UseCarouselOptions = {
  totalItems: number;
  initialIndex?: number;
  fadeDuration?: number;
};

/**
 * Hook for managing carousel navigation with fade transitions
 */
export function useCarousel({
  totalItems,
  initialIndex = 0,
  fadeDuration = 400,
}: UseCarouselOptions) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [fadeIn, setFadeIn] = useState(true);
  const [animationKey, setAnimationKey] = useState(0);

  const canGoNext = currentIndex < totalItems - 1;
  const canGoPrev = currentIndex > 0;

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
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        next();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
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
