'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type TouchEvent } from 'react';
import ExhibitionNav from '@/components/ExhibitionNav';
import '@/components/exhibition/poster-exhibition.css';
import { roomReturn } from '@/components/exhibition/helpers';
import FactNote from '@/components/exhibition/FactNote';
import { srOnly, useReducedMotion } from '@/lib/a11y';
import { BLACK_HISTORY } from '../blackHistory';
import { TIMELINE_STOPS, TIMELINE_TEXT, markRuns, stopFromHash } from './timelineStops';
import '../black-history.css';
import './timeline.css';

/*
 * The Black Barbie timeline, on one screen: the year large on the black
 * blob, ringed by poster 1's vignettes, the poster's own words beside it,
 * and the stops strung along the lime line at the foot. Arrow keys, a swipe
 * or the stops move through it; the year counts up as it goes. Each stop has
 * its own address (#1967 … #today).
 *
 * The added stops (Dolls of the World, Shani, Inspiring Women) are
 * owner-approved and fact-checked, from outside the poster: set as a plain
 * note with its source (timelineStops.ts), never as the poster's words.
 */

type CssVars = CSSProperties & Record<`--${string}`, string>;

const VIGNETTES = ['musician', 'worker', 'scientist', 'singer', 'notes', 'atom'];

/** The year shown while it counts from one stop to the next. */
function useCountingYear(target: number | null, still: boolean) {
  const [shown, setShown] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    const start = from.current;
    from.current = target;
    if (still || target === null || start === null || start === target) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- the count has nothing to animate
      setShown(target);
      return;
    }
    const t0 = performance.now();
    const ms = Math.min(1100, 260 + Math.abs(target - start) * 26);
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / ms);
      const eased = 1 - Math.pow(1 - p, 3);
      setShown(Math.round(start + (target - start) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, still]);
  return shown;
}

export default function BlackBarbieTimeline() {
  const { fonts, palette, slug } = BLACK_HISTORY;
  const back = roomReturn(BLACK_HISTORY);
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const stopRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const touchX = useRef<number | null>(null);
  const stop = TIMELINE_STOPS[index];
  const year = useCountingYear(stop.year, reduced);

  useEffect(() => {
    const fromHash = () => {
      const i = stopFromHash(window.location.hash);
      if (i >= 0) setIndex(i);
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, []);

  const go = useCallback((i: number, focus = false) => {
    const to = Math.max(0, Math.min(TIMELINE_STOPS.length - 1, i));
    setIndex(to);
    window.history.replaceState(null, '', `#${TIMELINE_STOPS[to].id}`);
    if (focus) stopRefs.current[to]?.focus();
  }, []);

  // Arrow keys, Home and End move along the stops.
  const onKey = (e: KeyboardEvent<HTMLElement>) => {
    const to =
      e.key === 'ArrowRight' || e.key === 'ArrowDown' ? index + 1
      : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? index - 1
      : e.key === 'Home' ? 0
      : e.key === 'End' ? TIMELINE_STOPS.length - 1
      : null;
    if (to === null || to < 0 || to >= TIMELINE_STOPS.length) return;
    e.preventDefault();
    go(to, true);
  };

  const onTouchStart = (e: TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
  };

  const style: CssVars = {
    '--pe-display': fonts.display,
    '--pe-body': fonts.body,
    '--pe-ui': fonts.body,
    '--pe-accent': palette.accent,
    '--pe-heading': palette.heading,
  };
  const yearText = (s: (typeof TIMELINE_STOPS)[number]) => s.yearLabel ?? String(s.year);
  const label = stop.year === null ? stop.name : `${yearText(stop)}: ${stop.name}`;
  // While it counts the year is a plain number; settled, it is set as the stop gives it (c. 1990).
  const yearShown = year === stop.year && stop.yearLabel ? stop.yearLabel : year;
  const longYear = !!stop.yearLabel;

  return (
    <div className="pe-root bht-room" data-exhibition={slug} data-theme={stop.theme} style={style}>
      <style>{`@import url('${fonts.href}');`}</style>

      <ExhibitionNav className="pe-nav pe-nav-left" href={back.href}>
        <span className="pe-nav-text" aria-hidden="true">M</span>
        <span className="pe-nav-arrow pe-nav-arrow-left" aria-hidden="true">&#8592;</span>
        <span className="pe-nav-label">{back.label}</span>
      </ExhibitionNav>

      <main className="bht-stage" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div className="bht-ground" aria-hidden="true">
          <span className="bht-rays bht-rays-a" style={{ '--turn': `${index * 9}deg` } as CssVars} />
          <span className="bht-rays bht-rays-b" style={{ '--turn': `${index * -7}deg` } as CssVars} />
        </div>

        <header className="bht-bar">
          <h1 className="bht-title">{TIMELINE_TEXT.title}</h1>
          <p className="bht-source">
            {stop.note ? (
              TIMELINE_TEXT.noteSource
            ) : (
              <>
                {TIMELINE_TEXT.source} <cite>{TIMELINE_TEXT.poster}</cite>
              </>
            )}
          </p>
        </header>

        <div className="bht-disc-wrap" aria-hidden="true">
          <div className="bht-vignettes" key={`v-${index}`}>
            {VIGNETTES.map((v, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={v} className={`bht-vig bht-vig-${i + 1}`} src={`/exhibitions/black-history/vignettes/${v}.webp`} alt="" />
            ))}
          </div>
          {!reduced && (
            <div className="bht-burst" key={`b-${index}`}>
              {Array.from({ length: 14 }, (_, i) => (
                <i key={i} style={{ '--a': `${(i * 360) / 14}deg`, '--d': `${(i % 3) * 0.04}s` } as CssVars} />
              ))}
            </div>
          )}
          <div className="bht-disc">
            <span className={`bht-year ${stop.year === null ? 'bht-year-word' : ''} ${longYear ? 'bht-year-long' : ''}`}>{yearShown ?? TIMELINE_TEXT.today}</span>
            {stop.year !== null && <span className="bht-name" key={`n-${index}`}>{stop.name}</span>}
          </div>
        </div>

        <section className="bht-words" key={`w-${index}`} aria-labelledby="bht-stop-heading" tabIndex={0}>
          <h2 id="bht-stop-heading" style={srOnly}>{label}</h2>
          {stop.tag && <p className="bht-tag">{stop.tag}</p>}
          {stop.sentences.map((s) => (
            <p key={s} className="bht-sentence">
              {markRuns(s, stop.mark).map((r, i) => (r.marked ? <mark key={i}>{r.text}</mark> : <span key={i}>{r.text}</span>))}
            </p>
          ))}
          {stop.note && <FactNote fact={stop.note} className="bht-note" />}
        </section>

        <nav className="bht-track" aria-label="The timeline">
          <button type="button" className="bht-step" onClick={() => go(index - 1)} disabled={index === 0} aria-label="Earlier">
            <span aria-hidden="true">&#8592;</span>
          </button>
          <div className="bht-stops-wrap">
            <svg className="bht-line" viewBox="0 0 600 40" preserveAspectRatio="none" aria-hidden="true">
              <path d="M0 20 C 50 2, 100 2, 150 20 S 250 38, 300 20 S 400 2, 450 20 S 550 38, 600 20" />
            </svg>
            <ol className="bht-stops">
            {TIMELINE_STOPS.map((s, i) => (
              <li key={s.id}>
                <button
                  ref={(el) => {
                    stopRefs.current[i] = el;
                  }}
                  type="button"
                  className="bht-stop"
                  aria-current={i === index ? 'step' : undefined}
                  aria-label={s.year === null ? s.name : `${yearText(s)}, ${s.name}`}
                  onClick={() => go(i)}
                  onKeyDown={onKey}
                >
                  <span className={`bht-stop-year${s.yearLabel ? ' bht-stop-year-long' : ''}`} aria-hidden="true">
                    {s.yearLabel ? (
                      <>
                        <span className="bht-stop-full">{s.yearLabel}</span>
                        <span className="bht-stop-short">{s.stopLabel ?? s.yearLabel}</span>
                      </>
                    ) : (
                      (s.year ?? TIMELINE_TEXT.today)
                    )}
                  </span>
                </button>
              </li>
            ))}
            </ol>
          </div>
          <button type="button" className="bht-step" onClick={() => go(index + 1)} disabled={index === TIMELINE_STOPS.length - 1} aria-label="Later">
            <span aria-hidden="true">&#8594;</span>
          </button>
        </nav>

        <p role="status" style={srOnly}>{label}</p>
      </main>
    </div>
  );
}
