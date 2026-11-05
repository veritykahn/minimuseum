'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { useMuseumSound } from '@/lib/museumSound';
import { usePanelMoment } from '@/components/exhibition/PanelMoment';
import { srOnly } from '@/lib/a11y';
import { italicRuns } from './timelineEntries';
import { STOP_TEXT, TIMELINE_STOPS } from './timelineStops';
import { MAP_SRC, STOP_MORE, mapPoint, type StopMore } from './stopMore';

/*
 * A stop on the timeline, open in a window of its own over the dark: its
 * photograph, with a + on each thing in it to look closer at; the date and
 * the poster's words as printed; and, under them, three tabs: what
 * happened, in a few plain words; where, a light on a small map of Europe;
 * and look closer, the things in the photograph explained. Before and Next
 * walk the timeline a stop at a time, keeping the tab open. A stop with a
 * sound plays it once, very quietly, as it opens, with the museum's sound
 * on; such a stop shows a speaker, which is the museum's one switch.
 *
 * The photograph drifts in, very slowly, as the stop opens; the map's light
 * breathes. Under reduced motion, neither moves.
 *
 * Esc closes it, the arrow keys move (between the tabs, on a tab), and the
 * focus stays inside until it closes, when the page puts it back on the
 * date it came from.
 */

type Tab = 'happened' | 'where' | 'closer';
const TABS: readonly Tab[] = ['happened', 'where', 'closer'];

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

/** Where: a light on the map of Europe, and the place named beside it. */
function Where({ where }: { where: StopMore['where'] }) {
  const { x, y } = mapPoint(where.lat, where.lon);
  return (
    <div className="hot-where">
      <div className="hot-map" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element -- the map is a drawing, the same at every stop */}
        <img src={MAP_SRC} alt="" />
        <span className={`hot-map-light${where.wide ? ' is-wide' : ''}`} style={{ left: `${x}%`, top: `${y}%` }} />
      </div>
      <p className="hot-where-label">{where.label}</p>
      {where.note && <p className="hot-where-today">{where.note}</p>}
      {where.today && <p className="hot-where-today">{where.today}</p>}
    </div>
  );
}

export default function TimelineStop({ index, onMove, onClose }: { index: number; onMove: (index: number) => void; onClose: () => void }) {
  const stop = TIMELINE_STOPS[index];
  const more = STOP_MORE[stop.id];
  const count = TIMELINE_STOPS.length;
  const [sound, setSound] = useMuseumSound();
  // The tab stays open from stop to stop; the spot chosen belongs to its stop.
  const [tab, setTab] = useState<Tab>('happened');
  const [spotAt, setSpotAt] = useState<{ id: string; n: number } | null>(null);
  const spot = spotAt?.id === stop.id ? spotAt.n : null;
  const box = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  usePanelMoment(stop.sound, stop.id, { on: sound });

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  const go = (i: number) => {
    if (i >= 0 && i < count) onMove(i);
  };
  const lookAt = (n: number) => {
    setTab('closer');
    setSpotAt({ id: stop.id, n });
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const onTab = (e.target as HTMLElement).getAttribute?.('role') === 'tab';
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (onTab && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
      // On the tabs, the arrows go from tab to tab.
      e.preventDefault();
      const next = TABS[(TABS.indexOf(tab) + (e.key === 'ArrowRight' ? 1 : TABS.length - 1)) % TABS.length];
      setTab(next);
      requestAnimationFrame(() => document.getElementById(`hot-tab-${next}`)?.focus());
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      go(index + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      go(index - 1);
    } else if (e.key === 'Tab') {
      // The focus keeps to the window's own buttons.
      const items = [...(box.current?.querySelectorAll<HTMLElement>('button:not([disabled]):not([tabindex="-1"])') ?? [])];
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
              <div className="hot-stop-frame">
                {/* eslint-disable-next-line @next/next/no-img-element -- a single still, sized by its frame */}
                <img src={stop.picture.src} alt={stop.picture.alt} />
                {more?.closer.map((c, n) => (
                  <button
                    key={n}
                    type="button"
                    className="hot-spot"
                    style={{ left: `${c.x}%`, top: `${c.y}%` }}
                    aria-label={`${STOP_TEXT.closer}: ${c.title}`}
                    aria-pressed={spot === n}
                    onClick={() => lookAt(n)}
                  >
                    <span aria-hidden="true">+</span>
                  </button>
                ))}
              </div>
              <figcaption>{stop.picture.caption}</figcaption>
            </>
          ) : (
            <div className="hot-stop-tocome">{STOP_TEXT.pictureToCome}</div>
          )}
        </figure>

        <div className="hot-stop-side">
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

          {more && (
            <div className="hot-more">
              <div className="hot-tabs" role="tablist" aria-label={STOP_TEXT.more}>
                {TABS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    role="tab"
                    id={`hot-tab-${t}`}
                    className="hot-tab"
                    aria-selected={tab === t}
                    aria-controls="hot-tabpanel"
                    tabIndex={tab === t ? 0 : -1}
                    onClick={() => setTab(t)}
                  >
                    {STOP_TEXT[t]}
                  </button>
                ))}
              </div>
              <div className="hot-tabpanel" role="tabpanel" id="hot-tabpanel" aria-labelledby={`hot-tab-${tab}`} key={`${stop.id}-${tab}`}>
                {tab === 'happened' && <p className="hot-happened">{more.happened.text}</p>}
                {tab === 'where' && <Where where={more.where} />}
                {tab === 'closer' && (
                  <>
                    <p className="hot-closer-how">{STOP_TEXT.closerHow}</p>
                    <ul className="hot-closer">
                      {more.closer.map((c, n) => (
                        <li key={n}>
                          <button type="button" className="hot-closer-item" aria-expanded={spot === n} onClick={() => setSpotAt(spot === n ? null : { id: stop.id, n })}>
                            <span className="hot-closer-mark" aria-hidden="true">
                              +
                            </span>
                            {c.title}
                          </button>
                          {spot === n && <p className="hot-closer-text">{c.text}</p>}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          )}
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
