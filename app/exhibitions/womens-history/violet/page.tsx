'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import ExhibitionNav from '@/components/ExhibitionNav';
import '@/components/exhibition/poster-exhibition.css';
import FactNote from '@/components/exhibition/FactNote';
import { BIOGRAPHY_MOTTO, VIOLET_DATES, VIOLET_LETTERING, VIOLET_NAME, VIOLET_NEE, WOMENS_HISTORY } from '../womensHistory';
import Keepsake from './Keepsake';
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
 */

type CssVars = CSSProperties & Record<`--${string}`, string>;

function stopFromHash(hash: string): number {
  const h = hash.replace(/^#/, '');
  return LIFE.findIndex((s) => s.id === h);
}

export default function VioletsLife() {
  const { fonts, slug } = WOMENS_HISTORY;
  const [index, setIndex] = useState(0);
  const [visited, setVisited] = useState<Set<number>>(() => new Set([0]));
  const [announcement, setAnnouncement] = useState('');
  const [band, setBand] = useState({ w: 0, h: 0 });
  const bandRef = useRef<HTMLDivElement>(null);
  const stopRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const el = bandRef.current;
    if (!el) return;
    const measure = () => setBand({ w: el.clientWidth, h: el.clientHeight });
    measure();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measure);
      return () => window.removeEventListener('resize', measure);
    }
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

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
      const i = stopFromHash(window.location.hash);
      if (i >= 0) go(i);
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, [go]);

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

      <ExhibitionNav className="pe-nav pe-nav-left" href={`/exhibitions/${slug}`}>
        <span className="pe-nav-text" aria-hidden="true">M</span>
        <span className="pe-nav-arrow pe-nav-arrow-left" aria-hidden="true">&#8592;</span>
        <span className="pe-nav-label">Exhibition</span>
      </ExhibitionNav>

      <main className="whv-stage">
        <span className="whv-cloth" aria-hidden="true" />

        <header className="whv-bar">
          <h1 className="whv-title">
            Violet’s Life
            <span className="whv-title-dates">1907 · 1988</span>
          </h1>
        </header>

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
          <p className="visually-hidden" role="status" aria-live="polite">{announcement}</p>
        </section>
      </main>
    </div>
  );
}
