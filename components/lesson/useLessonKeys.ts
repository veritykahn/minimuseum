'use client';

import { useEffect } from 'react';
import type { Action } from '@/lib/lessons/session';

/**
 * Right / Left (and Page Down / Page Up, which most clickers send) move
 * between steps; Space pauses and resumes; N shows or hides the notes.
 * Keys typed into a field, and Space or Enter on a focused button or link,
 * keep their usual meaning.
 */
export function useLessonKeys(dispatch: (a: Action) => void, onNotes?: () => void) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      const t = e.target as HTMLElement | null;
      const tag = t?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || t?.isContentEditable) return;
      const onControl = tag === 'BUTTON' || tag === 'A' || tag === 'SUMMARY';
      switch (e.key) {
        case 'ArrowRight':
        case 'PageDown':
          e.preventDefault();
          dispatch({ type: 'next' });
          break;
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault();
          dispatch({ type: 'prev' });
          break;
        case ' ':
          if (onControl) return;
          e.preventDefault();
          dispatch({ type: 'toggle' });
          break;
        case 'n':
        case 'N':
          if (onNotes) {
            e.preventDefault();
            onNotes();
          }
          break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dispatch, onNotes]);
}

/**
 * After a mouse or touch press, give focus back to the page so that Space
 * means pause rather than "press that button again". Keyboard presses
 * (detail 0) keep their focus.
 */
export function releaseAfterPointer(e: React.MouseEvent<HTMLElement>) {
  if (e.detail > 0) e.currentTarget.blur();
}
