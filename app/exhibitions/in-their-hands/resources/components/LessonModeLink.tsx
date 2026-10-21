'use client';

import Link from 'next/link';

type LessonModeLinkProps = {
  href: string;
  title: string;
};

/**
 * The way in to Lesson mode: run this lesson on the classroom projector,
 * with the teacher's notes in a presenter view.
 */
export function LessonModeLink({ href, title }: LessonModeLinkProps) {
  return (
    <>
      <Link href={href} className="lesson-mode">
        <span className="lm-kicker">New · Lesson mode</span>
        <span className="lm-title">Teach this lesson on screen</span>
        <span className="lm-sub">
          &ldquo;{title}&rdquo; step by step on the projector, with your script, a 45-minute timer and the
          handouts in presenter view.
        </span>
        <span className="lm-go" aria-hidden="true">&rarr;</span>
      </Link>

      <style jsx global>{`
        .lesson-mode {
          position: relative;
          display: grid;
          gap: 6px;
          max-width: 500px;
          margin: 0 auto 40px;
          padding: 22px 64px 22px 24px;
          text-align: left;
          border: 1px solid rgba(201, 168, 76, 0.45);
          border-radius: 6px;
          background: linear-gradient(135deg, rgba(201, 168, 76, 0.12), rgba(201, 168, 76, 0.03));
          transition: border-color 0.3s ease, background 0.3s ease;
        }
        .lesson-mode:hover {
          border-color: #c9a84c;
          background: linear-gradient(135deg, rgba(201, 168, 76, 0.18), rgba(201, 168, 76, 0.05));
        }
        .lesson-mode:focus-visible {
          outline: 3px solid #f5edd8;
          outline-offset: 3px;
        }
        .lm-kicker {
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #c9a84c;
        }
        .lm-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.5rem;
          color: #fafafa;
        }
        .lm-sub {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.02rem;
          line-height: 1.5;
          color: #a0a0a0;
        }
        .lm-go {
          position: absolute;
          right: 24px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 22px;
          color: #c9a84c;
          transition: transform 0.3s ease;
        }
        .lesson-mode:hover .lm-go {
          transform: translate(4px, -50%);
        }
      `}</style>
    </>
  );
}
