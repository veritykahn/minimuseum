'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { takeJustExited } from './useProjectorMode';
import TeachSheet, { type TeachContent } from './TeachSheet';

/**
 * "Teach with this". Each exhibition places it in its own header and passes
 * colors that suit its ground; the button keeps a 44px target and a visible
 * focus ring. Given `teach`, it opens the sheet of materials for teachers,
 * librarians and parents (TeachSheet), whose "Open projector mode" calls
 * `onClick`; without it, it opens projector mode directly.
 */
export default function TeachToggle({
  onClick,
  className,
  style,
  teach,
}: {
  onClick: () => void;
  className?: string;
  style?: CSSProperties;
  teach?: TeachContent;
}) {
  const [sheet, setSheet] = useState(false);

  // Coming back from projector mode, focus returns here.
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (takeJustExited()) ref.current?.focus();
  }, []);

  return (
    <>
      <button
        ref={ref}
        type="button"
        className={`mm-teach-toggle ${className ?? ''}`}
        onClick={teach ? () => setSheet(true) : onClick}
        style={style}
        title={teach ? 'Lessons, printables and projector mode' : 'Projector mode for a classroom screen'}
        aria-haspopup={teach ? 'dialog' : undefined}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
          <rect x="3" y="4" width="18" height="12" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M12 16v3M8 20h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <span className="mm-teach-label">Teach with this</span>
        <style>{`
          .mm-teach-toggle {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            min-height: 44px;
            padding: 0 16px;
            border-radius: 100px;
            border: 1px solid var(--teach-border, currentColor);
            background: transparent;
            color: var(--teach-color, inherit);
            font: inherit;
            font-size: 12px;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            cursor: pointer;
            white-space: nowrap;
          }
          .mm-teach-toggle:hover { background: color-mix(in srgb, currentColor 10%, transparent); }
          .mm-teach-toggle:focus-visible { outline: 2px solid currentColor; outline-offset: 3px; }
          @media (max-width: 600px) {
            .mm-teach-toggle { width: 44px; padding: 0; justify-content: center; }
            .mm-teach-label {
              position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
              overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;
            }
          }
        `}</style>
      </button>
      {sheet && teach && <TeachSheet content={teach} onPresent={onClick} onClose={() => setSheet(false)} />}
    </>
  );
}
