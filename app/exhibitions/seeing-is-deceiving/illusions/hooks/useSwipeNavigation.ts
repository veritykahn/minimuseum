'use client';

import { useRef } from 'react';

type UseSwipeNavigationOptions = {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  minSwipeDistance?: number;
};

/**
 * Hook for handling touch swipe navigation
 */
export function useSwipeNavigation({
  onSwipeLeft,
  onSwipeRight,
  minSwipeDistance = 50,
}: UseSwipeNavigationOptions) {
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchEndX.current = null;
    // A slider or an open dialog keeps its own horizontal drags.
    const t = e.target as HTMLElement;
    if (t.closest?.('input, [role="slider"], [role="dialog"]')) {
      touchStartX.current = null;
      return;
    }
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) {
      touchStartX.current = null;
      return;
    }

    const distance = touchStartX.current - touchEndX.current;

    if (distance > minSwipeDistance) {
      // Swiped left -> go next
      onSwipeLeft();
    } else if (distance < -minSwipeDistance) {
      // Swiped right -> go prev
      onSwipeRight();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
}
