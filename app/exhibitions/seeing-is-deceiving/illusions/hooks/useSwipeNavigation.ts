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
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

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
