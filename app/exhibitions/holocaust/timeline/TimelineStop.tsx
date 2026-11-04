'use client';

import { useEffect, useRef, type KeyboardEvent } from 'react';
import { useMuseumSound } from '@/lib/museumSound';
import { usePanelMoment } from '@/components/exhibition/PanelMoment';
import { srOnly } from '@/lib/a11y';
import { italicRuns } from './timelineEntries';
import { STOP_TEXT, TIMELINE_STOPS } from './timelineStops';

/*
 * A stop on the timeline, open in a window of its own over the dark: its
 * photograph (or "Picture to come"), the date and the poster's words as
 * printed, and Before and Next to walk the timeline a stop at a time. A stop
 * with a sound plays it once, very quietly, as it opens, with the museum's
 * sound on; such a stop shows a speaker, which is the museum's one switch.
 *
 * Esc closes it, the arrow keys move, and the focus stays inside until it
 * closes, when the page puts it back on the date it came from.
 */

const Words = ({ text }: { text: string }) => (
  <>{italicRuns(text).map((r, i) => (r.italic ? <em key={i}>{r.text}</em> : <span key={i}>{r.text}</span>))}</>
);

function Speaker({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" />
      {on ? (
        <>
          <path d="M15.5 9a4 4 0 0 1 0 6" />
          <path d="M18 6.5a7.5 7.5 0 0 1 0 11" />
        </>
      ) : (
        <path d="M16 10l4 4M20 10l-4 4" />
      )}
    </svg>
  );
}

export default function TimelineStop({ index, onMove, onClose }: { index: number; onMove: (index: number) => void; onClose: () => void }) {
  const stop = TIMELINE_STOPS[index];
  const count = TIMELINE_STOPS.length;
  const [sound, setSound] = useMuseumSound();
  const box = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  usePanelMoment(stop.sound, stop.id, { on: sound });

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  const go = (i: number) => {
    if (i >= 0 && i < count) onMove(i);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      go(index + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      go(index - 1);
    } else if (e.key === 'Tab') {
      // The focus keeps to the window's own buttons.
      const items = [...(box.current?.querySelectorAll<HTMLElement>('button:not([disabled])') ?? [])];
      if (!items.length) return;
      const at = items.indexOf(document.activeElement as HTMLElement);
      const next = e.shiftKey ? (at <= 0 ? items.length - 1 : at - 1) : at === items.length - 1 ? 0 : at + 1;
      e.preventDefault();
      items[next].focus();
    }
  };

  return (
    <div className="hot-stop-scrim" onClick={onClose}>
      <div
        ref={box}
        className="hot-stop"
        role="dialog"
        aria-modal="true"
        aria-labelledby="hot-stop-when"
        aria-describedby="hot-stop-words"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        <div className="hot-stop-bar">
          {stop.sound && (
            <button type="button" className="hot-stop-sound" aria-pressed={sound} onClick={() => setSound(!sound)}>
              <Speaker on={sound} />
              {STOP_TEXT.sound}
            </button>
          )}
          <button ref={closeRef} type="button" className="hot-stop-close" onClick={onClose} aria-label={STOP_TEXT.close}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        <figure className="hot-stop-figure" key={stop.id}>
          {stop.picture ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element -- a single still, sized by its frame */}
              <img src={stop.picture.src} alt={stop.picture.alt} />
              <figcaption>{stop.picture.caption}</figcaption>
            </>
          ) : (
            <div className="hot-stop-tocome">{STOP_TEXT.pictureToCome}</div>
          )}
        </figure>

        <div className="hot-stop-text" key={`${stop.id}-text`}>
          <h2 id="hot-stop-when" className="hot-stop-when">
            <span aria-hidden="true">
              <span className="hot-year">{stop.year}</span> <span className="hot-date">{stop.date}</span>
            </span>
            <span style={srOnly}>{stop.when}</span>
          </h2>
          <p id="hot-stop-words" className="hot-stop-words">
            <Words text={stop.words} />
          </p>
        </div>

        <div className="hot-stop-nav">
          <button type="button" className="hot-btn" onClick={() => go(index - 1)} disabled={index === 0}>
            <span aria-hidden="true">&#8592; </span>
            {STOP_TEXT.previous}
          </button>
          <span className="hot-stop-count" aria-live="polite">
            {STOP_TEXT.of(index + 1, count)}
          </span>
          <button type="button" className="hot-btn" onClick={() => go(index + 1)} disabled={index === count - 1}>
            {STOP_TEXT.next}
            <span aria-hidden="true"> &#8594;</span>
          </button>
        </div>
      </div>
    </div>
  );
}
