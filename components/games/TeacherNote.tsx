'use client';

import type { CSSProperties } from 'react';
import styles from './games.module.css';

/**
 * A collapsed note for teachers on a single game item — content a teacher may
 * want to preview before showing it to a younger class. Closed by default so
 * it never gets in a player's way.
 */
export default function TeacherNote({
  note,
  label = 'For teachers',
  className,
  style,
}: {
  note: string;
  label?: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <details className={`${styles.teacherNote} ${className ?? ''}`} style={style}>
      <summary>{label}</summary>
      <p>{note}</p>
    </details>
  );
}
