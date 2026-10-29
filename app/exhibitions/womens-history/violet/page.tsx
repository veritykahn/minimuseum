'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import ExhibitionNav from '@/components/ExhibitionNav';
import '@/components/exhibition/poster-exhibition.css';
import { roomReturn } from '@/components/exhibition/helpers';
import FactNote from '@/components/exhibition/FactNote';
import { BIOGRAPHY_MOTTO, VIOLET_DATES, VIOLET_LETTERING, VIOLET_NAME, VIOLET_NEE, WOMENS_HISTORY } from '../womensHistory';
import Keepsake from './Keepsake';
import OwnTimeline from './OwnTimeline';
import type { OwnTimeline as Timeline } from './yourTimeline';
import { useBox } from './useBox';
import { LIFE, threadLayout, threadPath } from './violetLife';
import './violet.css';

/*
 * Violet's Life, on one screen: a thread sewn across a rose-coloured cloth,
 * with a keepsake for each place and moment of her life along it, from
 * Fulham to the greengrocer. Opening a keepsake sets its part of poster 2's
 * biography on the sheet below, typewritten as the poster sets it, beside
 * the family photograph the poster sets with it. The thread is sewn in
 * orange as far as the visitor has come. Each stop has its own address
 * (#fulham, #blitz…). The Blitz also carries a museum note, owner-approved
 * and fact-checked, set apart from the typed biography with its source
 * (violetLife.ts).
 *
 * A second mode, "Make your own" (#make), sets the same thread out for a
 * woman in the visitor's own life (OwnTimeline.tsx).
 */

type CssVars = CSSProperties & Record<`--${string}`, string>;

type Mode = 'violet' | 'make';
const MAKE_HASH = 'make';

function stopFromHash(hash: string): number {
  const h = hash.replace(/^#/, '');
  return LIFE.findIndex((s) => s.id === h);
}

export default function VioletsLife() {
  const { fonts, slug } = WOMENS_HISTORY;
  const back = roomReturn(WOMENS_HISTORY);
  const [index, setIndex] = useState(0);
  const [visited, setVisited] = useState<Set<number>>(() => new Set([0]));
  const [announcement, setAnnouncement] = useState('');
  const [bandRef, band] = useBox<HTMLDivElement>();
  const [mode, setMode] = useState<Mode>('violet');
  // Your own timeline, held here while Violet's life is open (its photographs live nowhere else).
  const [own, setOwn] = useState<Timeline | null>(null);
  const stopRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const go = useCallback((i: number, { focus = false, announce = false } = {}) => {
    if (i < 0 || i >= LIFE.length) return;
    setIndex(i);
    setVisited((v) => (v.has(i) ? v : new Set(v).add(i)));
    window.history.replaceState(null, '', `#${LIFE[i].id}`);
    if (focus) stopRefs.current[i]?.focus();
    if (announce) setAnnouncement(`${LIFE[i].label}, ${i + 1} of ${LIFE.length}`);
  }, []);

  useEffect(() => {
    const fromHash = () => {
      if (window.location.hash === `#${MAKE_HASH}`) return setMode('make');
      const i = stopFromHash(window.location.hash);
      if (i >= 0) {
        setMode('violet');
        go(i);
      }
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, [go]);

  const choose = (m: Mode) => {
    setMode(m);
    window.history.replaceState(null, '', m === 'make' ? `#${MAKE_HASH}` : `#${LIFE[index].id}`);
    setAnnouncement(m === 'make' ? 'Make your own timeline, for a woman in your life.' : 'Violet’s Life.');
  };

  // Arrow keys, Home and End move along the thread.
  const onStopKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const to =
      e.key === 'ArrowRight' || e.key === 'ArrowDown' ? Math.min(LIFE.length - 1, index + 1)
      : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? Math.max(0, index - 1)
      : e.key === 'Home' ? 0
      : e.key === 'End' ? LIFE.length - 1
      : -1;
    if (to < 0) return;
    e.preventDefault();
    go(to, { focus: true });
  };

  const rows = band.w > 0 && band.w < 760 ? 2 : 1;
  const points = useMemo(() => threadLayout(LIFE.length, band.w, band.h, rows), [band, rows]);
  const fullPath = useMemo(() => threadPath(points), [points]);
  const sewnPath = useMemo(() => threadPath(points.slice(0, index + 1)), [points, index]);

  const stop = LIFE[index];
  const style: CssVars = {
    background: '#d9a8a6',
    '--pe-display': fonts.display,
    '--pe-body': fonts.body,
    '--pe-ui': fonts.ui ?? fonts.body,
  };

  return (
    <div className="pe-root wh-room" data-exhibition={slug} style={style}>
      <style>{`@import url('${fonts.href}');`}</style>

      <ExhibitionNav className="pe-nav pe-nav-left" href={back.href}>
        <span className="pe-nav-text" aria-hidden="true">M</span>
        <span className="pe-nav-arrow pe-nav-arrow-left" aria-hidden="true">&#8592;</span>
        <span className="pe-nav-label">{back.label}</span>
      </ExhibitionNav>

      <main className="whv-stage">
        <span className="whv-cloth" aria-hidden="true" />

        <header className="whv-bar">
          <h1 className="whv-title">
            {mode === 'make' ? 'Your Timeline' : 'Violet’s Life'}
            <span className="whv-title-dates">{mode === 'make' ? 'A woman in your life' : '1907 · 1988'}</span>
          </h1>
          <div className="whv-modes" role="group" aria-label="Mode">
            <button type="button" className="whv-mode" aria-pressed={mode === 'violet'} onClick={() => choose('violet')}>
              Violet’s life
            </button>
            <button type="button" className="whv-mode" aria-pressed={mode === 'make'} onClick={() => choose('make')}>
              Make your own
            </button>
          </div>
        </header>

        {mode === 'make' ? (
          <OwnTimeline announce={setAnnouncement} kept={own} keep={setOwn} />
        ) : (
        <>
        <div className="whv-band" ref={bandRef}>
          <svg className="whv-thread" width={band.w} height={band.h} aria-hidden="true" focusable="false">
            <path className="whv-thread-ahead" d={fullPath} />
            <path className="whv-thread-sewn" d={sewnPath} />
          </svg>
          <div className="whv-stops" role="tablist" aria-label="Violet’s life" aria-orientation="horizontal">
            {LIFE.map((s, i) => {
              const p = points[i];
              return (
                <button
                  key={s.id}
                  ref={(el) => {
                    stopRefs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`whv-tab-${s.id}`}
                  aria-controls="whv-sheet"
                  aria-selected={i === index}
                  tabIndex={i === index ? 0 : -1}
                  className={`whv-stop${visited.has(i) ? ' is-visited' : ''}`}
                  // Until the band is measured the keepsakes have no place yet: unseen, but still there to be reached.
                  style={p ? ({ left: p.x, top: p.y, '--i': String(i) } as CssVars) : { opacity: 0 }}
                  onClick={() => go(i)}
                  onKeyDown={onStopKey}
                >
                  <span className="whv-stop-button">
                    <Keepsake id={s.keepsake} className="whv-stop-art" />
                  </span>
                  <span className="whv-stop-label">
                    {s.label}
                    {s.when && <span className="whv-stop-when">{s.when}</span>}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <section className="whv-sheet" id="whv-sheet" role="tabpanel" aria-labelledby={`whv-tab-${stop.id}`}>
          <div className="whv-sheet-inner" key={stop.id}>
            {index === 0 ? (
              <div className="whv-name">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="whv-name-lettering" src={VIOLET_LETTERING.src} width={VIOLET_LETTERING.width} height={VIOLET_LETTERING.height} alt={VIOLET_NAME} />
                <p className="whv-name-nee">{VIOLET_NEE}</p>
                <p className="whv-name-dates">{VIOLET_DATES}</p>
                <p className="whv-name-motto">{BIOGRAPHY_MOTTO}</p>
                <p className="whv-hint">Follow the thread: open each keepsake in turn.</p>
              </div>
            ) : (
              <>
                <div className="whv-side">
                  <figure className={`whv-picture${stop.photo ? ' whv-picture-photo' : ''}`}>
                    {stop.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={stop.photo.src} alt={stop.photo.alt} />
                    ) : (
                      <Keepsake id={stop.keepsake} className="whv-picture-art" />
                    )}
                  </figure>
                  {stop.note && (
                    <aside className="whv-note" aria-label="Museum note">
                      <span className="whv-note-label" aria-hidden="true">Museum note</span>
                      <FactNote fact={stop.note} className="whv-fact" />
                    </aside>
                  )}
                </div>
                <div className="whv-words">
                  <h2 className="whv-heading">
                    {stop.label}
                    {stop.when && <span className="whv-heading-when">{stop.when}</span>}
                  </h2>
                  <div className="whv-copy">
                    {stop.paragraphs.map((p, i) => (
                      <p key={i}>
                        {i === 0 && stop.lead && <span className="whv-lead">{stop.lead} </span>}
                        {p}
                      </p>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <nav className="whv-steps" aria-label="Along the thread">
            <button type="button" className="whv-step" onClick={() => go(index - 1, { announce: true })} disabled={index === 0}>
              <span aria-hidden="true">&#8592;</span> Back
            </button>
            <span className="whv-step-count" aria-hidden="true">
              {index + 1} / {LIFE.length}
            </span>
            <button type="button" className="whv-step whv-step-next" onClick={() => go(index + 1, { announce: true })} disabled={index === LIFE.length - 1}>
              Next <span aria-hidden="true">&#8594;</span>
            </button>
          </nav>
        </section>
        </>
        )}
        <p className="visually-hidden" role="status" aria-live="polite">{announcement}</p>
      </main>
    </div>
  );
}
