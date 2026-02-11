'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import { MapLevelConfig, TransitionState } from '../types';
import { getLevelConfig } from '../data/levels';

/**
 * Derives the correct map level configuration from the current pathname.
 * Manages animated transitions when the level changes.
 */
export function useMapLevel(pathname: string) {
  const currentConfig = useMemo(() => getLevelConfig(pathname), [pathname]);

  const [displayedConfig, setDisplayedConfig] = useState<MapLevelConfig>(currentConfig);
  const [transition, setTransition] = useState<TransitionState>('idle');
  const prevRef = useRef({ level: currentConfig.level, title: currentConfig.title });

  useEffect(() => {
    const sameLevel =
      prevRef.current.level === currentConfig.level &&
      prevRef.current.title === currentConfig.title;

    if (sameLevel) {
      // Same level (e.g., navigating between sub-pages) — update immediately
      setDisplayedConfig(currentConfig);
      return;
    }

    // Level changed — trigger exit → swap → enter transition
    setTransition('exiting');

    const exitTimer = setTimeout(() => {
      setDisplayedConfig(currentConfig);
      setTransition('entering');

      const enterTimer = setTimeout(() => {
        setTransition('idle');
      }, 300);

      // Store cleanup for enter timer
      cleanupEnter.current = () => clearTimeout(enterTimer);
    }, 200);

    prevRef.current = { level: currentConfig.level, title: currentConfig.title };

    return () => {
      clearTimeout(exitTimer);
      cleanupEnter.current?.();
    };
  }, [currentConfig]);

  const cleanupEnter = useRef<(() => void) | null>(null);

  return {
    config: displayedConfig,
    level: currentConfig.level,
    transition,
  };
}
