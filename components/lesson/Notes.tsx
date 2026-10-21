import type { Lesson } from '@/lib/lessons/types';
import type { Session } from '@/lib/lessons/session';
import { Inline } from './Inline';
import { onDark } from './color';
import styles from './lesson.module.css';

type Props = { lesson: Lesson; session: Session; large?: boolean; showNext?: boolean };

/** The teacher's script for the step on screen, and what comes next. */
export function Notes({ lesson, session, large, showNext = true }: Props) {
  const n = lesson.steps.length;
  const i = session.index;
  const step = i >= 0 && i < n ? lesson.steps[i] : undefined;

  return (
    <div className={`${styles.notes} ${large ? styles.notesLarge : ''}`}>
      <p className={styles.notesKicker}>{step ? 'Now' : i < 0 ? 'Before you start' : 'Lesson complete'}</p>
      {step ? (
        <>
          <h2 className={styles.notesTitle}>
            <span className={styles.phaseDot} style={{ background: onDark(step.color) }} aria-hidden="true" />
            {step.section} <span className={styles.notesDash}>·</span> {step.title}
            <span className={styles.notesMin}>{step.minutes} min</span>
          </h2>
          <div className={styles.script}>
            {step.script.map((p) => (
              <p key={p}>
                <Inline text={p} />
              </p>
            ))}
          </div>
        </>
      ) : i < 0 ? (
        <>
          <h2 className={styles.notesTitle}>Materials</h2>
          <ul className={styles.materials}>
            {lesson.materials.map((m) => (
              <li key={m}>
                <Inline text={m} />
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className={styles.script}>
          {lesson.connection.map((c) => (
            <p key={c}>
              <Inline text={c} />
            </p>
          ))}
        </div>
      )}
      {showNext && <UpNext lesson={lesson} session={session} />}
    </div>
  );
}

/** The step after this one: its name, its minutes and how it opens. */
export function UpNext({ lesson, session, detail }: { lesson: Lesson; session: Session; detail?: boolean }) {
  const i = session.index;
  const next = i + 1 < lesson.steps.length ? lesson.steps[i + 1] : undefined;
  if (!next) return null;
  return (
    <div className={`${styles.upNext} ${detail ? styles.upNextDetail : ''}`}>
      <p className={styles.notesKicker}>Up next</p>
      <p className={styles.upNextTitle}>
        <span className={styles.phaseDot} style={{ background: onDark(next.color) }} aria-hidden="true" />
        {next.title} <span className={styles.notesMin}>{next.minutes} min</span>
      </p>
      {detail && next.script[0] && (
        <p className={styles.upNextText}>
          <Inline text={next.script[0]} />
        </p>
      )}
    </div>
  );
}
