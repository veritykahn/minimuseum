'use client';

import Link from 'next/link';
import type { Lesson } from '@/lib/lessons/types';
import { clock, stepDuration, stepElapsed, totalElapsed, spokenRemaining } from '@/lib/lessons/session';
import { MiniStage } from './MiniStage';
import { Notes, UpNext } from './Notes';
import { Inline } from './Inline';
import { useLessonSession } from './useLessonSession';
import { useLessonKeys, releaseAfterPointer } from './useLessonKeys';
import { announce } from './announce';
import { PauseIcon, PlayIcon } from './ClassroomView';
import { onDark } from './color';
import styles from './lesson.module.css';

type Props = { lesson: Lesson; basePath: string };

/**
 * The teacher's own screen: the script, the clock and its controls, a live
 * miniature of what the class sees, and the handouts to print.
 */
export function PresenterView({ lesson, basePath }: Props) {
  const { session, now, dispatch, minutes, connected } = useLessonSession(lesson);
  useLessonKeys(dispatch);
  const n = lesson.steps.length;
  const i = session.index;
  const step = i >= 0 && i < n ? lesson.steps[i] : undefined;
  const left = step ? stepDuration(session, minutes, i) - stepElapsed(session, i, now) : 0;
  const elapsed = totalElapsed(session, now);
  const classroomHref = `${basePath}/${lesson.slug}`;

  const act = (type: 'prev' | 'next' | 'toggle' | 'addMinute' | 'start') => (e: React.MouseEvent<HTMLButtonElement>) => {
    releaseAfterPointer(e);
    dispatch({ type });
  };

  return (
    <div className={styles.presenter}>
      <header className={styles.pHead}>
        <div>
          <p className={styles.eyebrow}>Presenter view · {lesson.sub}</p>
          <h1 className={styles.pTitle}>{lesson.title}</h1>
        </div>
        <p className={styles.link}>
          <span className={`${styles.linkDot} ${connected ? styles.linkOn : ''}`} aria-hidden="true" />
          {connected ? 'In step with the classroom screen' : (
            <>
              Classroom screen not open.{' '}
              <a href={classroomHref} target="_blank" rel="noopener">
                Open it
              </a>
            </>
          )}
        </p>
      </header>

      <div className={styles.pGrid}>
        <div className={styles.pLeft}>
          <section className={styles.pNotes} aria-label="Script">
            <Notes lesson={lesson} session={session} large showNext={false} />
          </section>
          <div className={styles.pRow}>
            <section className={styles.pScreen} aria-label="On the classroom screen">
              <p className={styles.notesKicker}>On the classroom screen</p>
              <MiniStage lesson={lesson} session={session} now={now} minutes={minutes} />
            </section>
            <UpNext lesson={lesson} session={session} detail />
          </div>
        </div>

        <div className={styles.pSide}>
          <section className={styles.pTimer} aria-label="Timer">
            {step ? (
              <>
                <p className={styles.notesKicker}>
                  {left < 0 ? 'Over time' : 'Left in this step'}
                  {!session.running && <span className={styles.paused}>Paused</span>}
                </p>
                <p className={`${styles.pClock} ${styles.num}`}>
                  <span aria-hidden="true">{left < 0 ? `+${clock(-left)}` : clock(left)}</span>
                  <span className={styles.srOnly}>{spokenRemaining(left)}</span>
                </p>
                <p className={styles.pElapsed}>
                  Lesson <span className={styles.num}>{clock(elapsed)}</span> of {lesson.totalMinutes}:00
                </p>
                <div className={styles.pButtons}>
                  <button type="button" className={`${styles.pBtn} ${styles.pBtnMain}`} onClick={act('toggle')} aria-keyshortcuts="Space">
                    {session.running ? <PauseIcon /> : <PlayIcon />}
                    {session.running ? 'Pause' : 'Resume'}
                  </button>
                  <button type="button" className={styles.pBtn} onClick={act('prev')} disabled={i <= 0} aria-keyshortcuts="ArrowLeft">
                    <span aria-hidden="true">←</span> Back
                  </button>
                  <button type="button" className={styles.pBtn} onClick={act('addMinute')}>
                    +1 min
                  </button>
                  <button type="button" className={styles.pBtn} onClick={act('next')} aria-keyshortcuts="ArrowRight">
                    {i === n - 1 ? 'Finish' : 'Skip'} <span aria-hidden="true">→</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className={styles.notesKicker}>{i < 0 ? 'Ready' : 'Done'}</p>
                <p className={`${styles.pClock} ${styles.num}`}>{i < 0 ? `${lesson.totalMinutes}:00` : clock(elapsed)}</p>
                <div className={styles.pButtons}>
                  {i < 0 ? (
                    <button type="button" className={`${styles.pBtn} ${styles.pBtnMain}`} onClick={act('start')}>
                      <PlayIcon /> Start the lesson
                    </button>
                  ) : (
                    <button type="button" className={styles.pBtn} onClick={act('prev')}>
                      <span aria-hidden="true">←</span> Back to the last step
                    </button>
                  )}
                </div>
              </>
            )}
          </section>


          <section className={styles.pPrint} aria-labelledby="print-heading">
            <p id="print-heading" className={styles.notesKicker}>
              Print
            </p>
            <ul className={styles.handouts}>
              {lesson.handouts.map((h) => (
                <li key={h.key}>
                  <a href={h.href} target="_blank" rel="noopener" style={{ ['--lv' as string]: onDark(h.color) }}>
                    <span className={styles.hDot} aria-hidden="true" />
                    <span>
                      {h.name} handout <small>{h.sub}</small>
                    </span>
                    <span className={styles.srOnly}> (PDF, opens in a new tab)</span>
                  </a>
                </li>
              ))}
              <li>
                <a href={lesson.lessonPlan} target="_blank" rel="noopener">
                  <span className={styles.hDot} aria-hidden="true" />
                  <span>
                    Lesson plan <small>Teacher</small>
                  </span>
                  <span className={styles.srOnly}> (PDF, opens in a new tab)</span>
                </a>
              </li>
            </ul>
          </section>

          {lesson.questions.length > 0 && (
            <details className={styles.pMore}>
              <summary>Questions to ask in front of the case</summary>
              <ul>
                {lesson.questions.map((q) => (
                  <li key={q}>
                    <Inline text={q} />
                  </li>
                ))}
              </ul>
            </details>
          )}
        </div>
      </div>

      <nav className={styles.pSteps} aria-label="Steps">
        <ol>
          {lesson.steps.map((s, k) => (
            <li key={s.id}>
              <button
                type="button"
                aria-current={k === i ? 'step' : undefined}
                className={k === i ? styles.pStepNow : k < i ? styles.pStepDone : undefined}
                style={{ ['--c' as string]: onDark(s.color) }}
                onClick={(e) => {
                  releaseAfterPointer(e);
                  dispatch({ type: 'goto', index: k });
                }}
              >
                <span className={styles.pStepNum}>{k + 1}</span>
                <span className={styles.pStepName}>{s.title}</span>
                <span className={styles.pStepMin}>{s.minutes} min</span>
              </button>
            </li>
          ))}
        </ol>
        <p className={styles.pKeys}>
          <kbd>→</kbd> next <kbd>←</kbd> back <kbd>Space</kbd> pause ·{' '}
          <Link href={basePath}>All lessons</Link>
        </p>
      </nav>

      <p className={styles.srOnly} role="status" aria-live="polite">
        {announce(lesson, session)}
      </p>
    </div>
  );
}
