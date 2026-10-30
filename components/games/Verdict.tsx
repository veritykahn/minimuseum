'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { AnswerFeedback } from './feedback/FeedbackKit';
import styles from './games.module.css';

export type VerdictTone = 'right' | 'wrong' | 'neutral';

const MARKS: Record<VerdictTone, string> = { right: '✓', wrong: '✕', neutral: '◆' };

type VerdictProps = {
  tone: VerdictTone;
  /** The one-line verdict ("Sharp eyes!", "Not quite — …"). */
  title: ReactNode;
  /** Explanation under the verdict. */
  children?: ReactNode;
  /** Replace the default ✓ / ✕ / ◆ mark. */
  mark?: string;
  /** Move focus here when it appears (default true). */
  focusOnMount?: boolean;
  /**
   * Play the feedback kit's sound (if the visitor turned sound on) and flash
   * the screen green or orange as the answer lands (default true; a
   * "neutral" verdict never does).
   */
  feedback?: boolean;
  className?: string;
  titleClassName?: string;
  style?: CSSProperties;
};

/**
 * The feedback block shown after an answer: a marked verdict line with a
 * small arrival animation (none under reduced motion), then the explanation.
 * It takes focus when it appears, so the next Tab reaches the explanation's
 * controls and the "Next" button in reading order. Through the feedback kit
 * it also sounds and flashes once (see components/games/feedback).
 */
export default function Verdict({
  tone,
  title,
  children,
  mark,
  focusOnMount = true,
  feedback = true,
  className,
  titleClassName,
  style,
}: VerdictProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (focusOnMount) ref.current?.focus({ preventScroll: false });
  }, [focusOnMount]);

  return (
    <div ref={ref} tabIndex={-1} className={`${styles.verdict} ${className ?? ''}`} data-tone={tone} style={style}>
      <p className={`${styles.verdictLine} ${titleClassName ?? ''}`}>
        <span className={styles.verdictMark} aria-hidden="true">
          {mark ?? MARKS[tone]}
        </span>
        <span>{title}</span>
      </p>
      {children}
      {feedback && tone !== 'neutral' && <AnswerFeedback tone={tone} />}
    </div>
  );
}
