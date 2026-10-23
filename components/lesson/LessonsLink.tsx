import Link from 'next/link';
import type { CSSProperties } from 'react';
import { catalogFor, lessonsPath } from '@/lib/lessons/catalog';

/**
 * "7 lessons": sits beside "Teach with this" on an exhibition's landing page
 * and opens its list of on-screen lessons. It takes the same --teach-color
 * and --teach-border as TeachToggle, so the two read as a pair; an
 * exhibition with no lessons yet shows nothing.
 */
export default function LessonsLink({ exhibition, style }: { exhibition: string; style?: CSSProperties }) {
  const count = catalogFor(exhibition).length;
  if (count === 0) return null;

  return (
    <Link href={lessonsPath(exhibition)} className="mm-lessons-link" style={style} title="Lessons to run on a classroom screen">
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
        <path d="M4 5.5C6.5 4.5 9.5 4.5 12 6c2.5-1.5 5.5-1.5 8-.5v13c-2.5-1-5.5-1-8 .5-2.5-1.5-5.5-1.5-8-.5z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M12 6v13.5" stroke="currentColor" strokeWidth="1.6" />
      </svg>
      <span>
        {count} {count === 1 ? 'lesson' : 'lessons'}
      </span>
      <style>{`
        .mm-lessons-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-height: 44px;
          padding: 0 16px;
          border-radius: 100px;
          border: 1px solid var(--teach-border, currentColor);
          background: color-mix(in srgb, var(--teach-color, currentColor) 14%, transparent);
          color: var(--teach-color, inherit);
          font: inherit;
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          text-decoration: none;
          white-space: nowrap;
        }
        .mm-lessons-link:hover { background: color-mix(in srgb, var(--teach-color, currentColor) 24%, transparent); }
        .mm-lessons-link:focus-visible { outline: 2px solid currentColor; outline-offset: 3px; }
      `}</style>
    </Link>
  );
}
