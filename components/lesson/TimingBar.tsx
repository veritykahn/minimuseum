import type { Lesson } from '@/lib/lessons/types';
import styles from './lesson.module.css';

type Props = {
  lesson: Lesson;
  /** 0–1 along the planned 45 minutes */
  progress: number;
  /** the phase now being taught, if any */
  current?: string;
  /** what the bar says to assistive technology */
  valueText: string;
  elapsedMinutes: number;
};

/**
 * The lesson's minutes as one bar, in the PDF timing bar's own colors, laid
 * on a parchment track (as on the page) so every color keeps its contrast.
 */
export function TimingBar({ lesson, progress, current, valueText, elapsedMinutes }: Props) {
  const total = lesson.totalMinutes;
  const starts = lesson.phases.map((_, k) => lesson.phases.slice(0, k).reduce((a, p) => a + p.minutes, 0));
  return (
    <div className={styles.timing}>
      <div
        className={styles.track}
        role="progressbar"
        aria-label={`The ${total} minutes`}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={Math.min(total, Math.round(elapsedMinutes))}
        aria-valuetext={valueText}
      >
        {lesson.phases.map((p, k) => {
          const from = starts[k] / total;
          const width = p.minutes / total;
          const fill = Math.max(0, Math.min(1, (progress - from) / width));
          return (
            <div
              key={p.name}
              className={styles.seg}
              data-now={current === p.name ? '' : undefined}
              style={{ flex: p.minutes, ['--c' as string]: p.color }}
            >
              <span className={styles.segFill} style={{ transform: `scaleX(${fill})` }} />
            </div>
          );
        })}
        <span className={styles.marker} style={{ left: `${progress * 100}%` }} aria-hidden="true" />
      </div>
      <div className={styles.segLabels} aria-hidden="true">
        {lesson.phases.map((p) => (
          <span
            key={p.name}
            style={{ flex: p.minutes }}
            className={current === p.name ? styles.segLabelNow : undefined}
          >
            <b>{p.name}</b> <span className={styles.segMin}>{p.minutes} min</span>
          </span>
        ))}
      </div>
    </div>
  );
}
