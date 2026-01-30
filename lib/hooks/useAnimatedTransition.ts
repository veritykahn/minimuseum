'use client';

import { useState, useCallback } from 'react';
import { ANIMATION_DURATION } from '@/lib/constants';

/**
 * Hook for managing fade in/out transitions with callbacks.
 * Useful for page transitions, modal animations, and content swaps.
 */
export function useAnimatedTransition(duration: number = ANIMATION_DURATION.pageTransition) {
  const [isVisible, setIsVisible] = useState(true);

  const animateOut = useCallback(
    (callback: () => void) => {
      setIsVisible(false);
      setTimeout(() => {
        callback();
        setIsVisible(true);
      }, duration);
    },
    [duration]
  );

  const animateIn = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      setIsVisible(true);
    }, 50); // Small delay to ensure CSS transition triggers
  }, []);

  return {
    isVisible,
    animateOut,
    animateIn,
    setIsVisible,
  };
}
