'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import SourcesDrawer from '@/components/exhibition/SourcesDrawer';
import type { Lesson } from '@/lib/lessons/types';
import { StepStage, lessonSourceGroups } from './StepStage';
import { Notes } from './Notes';
import { useLessonSession } from './useLessonSession';
import { useLessonKeys, releaseAfterPointer } from './useLessonKeys';
import { announce } from './announce';
import styles from './lesson.module.css';

type Props = { lesson: Lesson; basePath: string };

/**
 * The classroom view: what goes on the projector. One screen can run the
 * whole lesson (N shows the notes beside the frame); with two, the
 * presenter view opens in its own window and both stay in step. The
 * pictures' and recordings' credits are behind the small "i" in the tool
 * bar (SourcesDrawer), not on the frame.
 */
export function ClassroomView({ lesson, basePath }: Props) {
  const { session, now, dispatch, minutes } = useLessonSession(lesson);
  const [notes, setNotes] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const toggleNotes = useCallback(() => setNotes((v) => !v), []);
  useLessonKeys(dispatch, toggleNotes);
  const sources = useMemo(() => lessonSourceGroups(lesson), [lesson]);

  // ?notes=1 opens with the notes showing, for a one-screen classroom
  useEffect(() => {
    const t = window.setTimeout(() => {
      if (new URLSearchParams(window.location.search).get('notes') === '1') setNotes(true);
    }, 0);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    const onChange = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const n = lesson.steps.length;
  const i = session.index;
  const inLesson = i >= 0 && i < n;
  const presenterHref = `${basePath}/${lesson.slug}/presenter`;

  const openPresenter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const w = window.open(presenterHref, `mm-presenter-${lesson.slug}`, 'popup,width=1280,height=820');
    if (w) {
      e.preventDefault();
      w.focus();
    }
    // if the pop-up is blocked, the link opens the presenter in a new tab
  };

  const toggleFullscreen = (e: React.MouseEvent<HTMLButtonElement>) => {
    releaseAfterPointer(e);
    if (document.fullscreenElement) void document.exitFullscreen();
    else void document.documentElement.requestFullscreen?.().catch(() => {});
  };

  const tools = (
    <nav className={styles.tools} aria-label="Lesson tools">
      <Link href={basePath} className={styles.tool}>
        <span aria-hidden="true">←</span> Lessons
      </Link>
      <SourcesDrawer groups={sources} inline buttonClassName={styles.sourcesTool} />
      <span className={styles.toolsGap} />
      <button
        type="button"
        className={styles.tool}
        aria-pressed={notes}
        aria-keyshortcuts="N"
        onClick={(e) => {
          releaseAfterPointer(e);
          toggleNotes();
        }}
      >
        {notes ? 'Hide notes' : 'Show notes'} <kbd>N</kbd>
      </button>
      <a href={presenterHref} target="_blank" rel="noopener" className={styles.tool} onClick={openPresenter}>
        Presenter view <span aria-hidden="true">↗</span>
      </a>
      <button type="button" className={styles.tool} data-wide="" aria-pressed={fullscreen} onClick={toggleFullscreen}>
        {fullscreen ? 'Exit full screen' : 'Full screen'}
      </button>
    </nav>
  );

  const controls = (
    <div className={styles.controls} role="group" aria-label="Lesson controls">
      <button
        type="button"
        className={styles.ctl}
        onClick={(e) => {
          releaseAfterPointer(e);
          dispatch({ type: 'prev' });
        }}
        disabled={i <= 0}
        aria-label="Previous step"
        aria-keyshortcuts="ArrowLeft"
      >
        <span aria-hidden="true">←</span>
      </button>
      {inLesson && (
        <button
          type="button"
          className={`${styles.ctl} ${styles.ctlPlay}`}
          onClick={(e) => {
            releaseAfterPointer(e);
            dispatch({ type: 'toggle' });
          }}
          aria-label={session.running ? 'Pause the timer' : 'Resume the timer'}
          aria-keyshortcuts="Space"
        >
          {session.running ? <PauseIcon /> : <PlayIcon />}
        </button>
      )}
      <button
        type="button"
        className={styles.ctl}
        onClick={(e) => {
          releaseAfterPointer(e);
          dispatch({ type: 'next' });
        }}
        disabled={i >= n}
        aria-label={i === n - 1 ? 'Finish the lesson' : 'Next step'}
        aria-keyshortcuts="ArrowRight"
      >
        <span aria-hidden="true">→</span>
      </button>
    </div>
  );

  const coverActions = (
    <div className={styles.coverActions}>
      <button
        type="button"
        className={styles.start}
        onClick={(e) => {
          releaseAfterPointer(e);
          dispatch({ type: 'start' });
        }}
      >
        Start the lesson
      </button>
      <a href={presenterHref} target="_blank" rel="noopener" className={styles.ghost} onClick={openPresenter}>
        Open presenter view
      </a>
      <p className={styles.keys}>
        <kbd>→</kbd> next <kbd>←</kbd> back <kbd>Space</kbd> pause <kbd>N</kbd> notes
      </p>
    </div>
  );

  return (
    <div className={`${styles.classroom} ${notes ? styles.withNotes : ''}`}>
      <div className={styles.stageHolder}>
        <StepStage
          lesson={lesson}
          session={session}
          now={now}
          minutes={minutes}
          controls={controls}
          coverActions={coverActions}
        />
        {tools}
      </div>
      {notes && (
        // focusable, so the notes scroll from the keyboard when they overflow
        <aside className={styles.notesPanel} aria-label="Teacher notes" tabIndex={0}>
          <Notes lesson={lesson} session={session} />
        </aside>
      )}
      <p className={styles.srOnly} role="status" aria-live="polite">
        {announce(lesson, session)}
      </p>
    </div>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" />
      <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path d="M8 5.5v13l10.5-6.5z" fill="currentColor" />
    </svg>
  );
}

export { PauseIcon, PlayIcon };
