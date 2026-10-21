import type { Lesson } from '@/lib/lessons/types';
import type { Session } from '@/lib/lessons/session';

/**
 * The polite live-region text. It changes only when the step or the
 * pause state changes, never with the ticking clock.
 */
export function announce(lesson: Lesson, s: Session): string {
  const n = lesson.steps.length;
  if (s.index < 0) return '';
  if (s.index >= n) return `Lesson complete: ${lesson.title}.`;
  const step = lesson.steps[s.index];
  return `Step ${s.index + 1} of ${n}, ${step.section}: ${step.title}. ${step.minutes} minutes.${s.running ? '' : ' Timer paused.'}`;
}
