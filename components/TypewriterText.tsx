'use client';

import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from '@/lib/a11y/usePrefersReducedMotion';

type TypewriterTextProps = {
  text: string;
  color: string;
  /** Class for the blinking cursor (each exhibition styles its own). */
  cursorClassName?: string;
  onComplete?: () => void;
};

/**
 * Types text out character by character. Assistive technology gets the full
 * text at once (the animated copy is aria-hidden), and visitors who prefer
 * reduced motion see the finished line immediately.
 */
export default function TypewriterText({ text, color, cursorClassName = 'typewriter-cursor', onComplete }: TypewriterTextProps) {
  const reduceMotion = usePrefersReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (reduceMotion) return undefined;
    if (count < text.length) {
      const timeout = setTimeout(() => setCount(c => c + 1), 30);
      return () => clearTimeout(timeout);
    }
    onComplete?.();
    return undefined;
  }, [count, text, onComplete, reduceMotion]);

  useEffect(() => {
    if (reduceMotion) onComplete?.();
  }, [reduceMotion, onComplete]);

  return (
    <span style={{ color }}>
      <span className="visually-hidden">{text}</span>
      <span aria-hidden="true">
        {reduceMotion ? text : text.slice(0, count)}
        {!reduceMotion && <span className={cursorClassName}>|</span>}
      </span>
    </span>
  );
}
