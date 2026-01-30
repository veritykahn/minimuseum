'use client';

import { useState, useCallback } from 'react';

/**
 * Hook for managing illusion reveal/guess state
 */
export function useIllusionState<T = null>() {
  const [revealed, setRevealed] = useState(false);
  const [guess, setGuess] = useState<T | null>(null);
  const [showScience, setShowScience] = useState(false);

  const handleGuess = useCallback((userGuess: T) => {
    setGuess(userGuess);
    setRevealed(true);
  }, []);

  const reset = useCallback(() => {
    setGuess(null);
    setRevealed(false);
  }, []);

  const reveal = useCallback(() => {
    setRevealed(true);
  }, []);

  const openScience = useCallback(() => {
    setShowScience(true);
  }, []);

  const closeScience = useCallback(() => {
    setShowScience(false);
  }, []);

  return {
    revealed,
    guess,
    showScience,
    handleGuess,
    reset,
    reveal,
    setRevealed,
    openScience,
    closeScience,
  };
}
