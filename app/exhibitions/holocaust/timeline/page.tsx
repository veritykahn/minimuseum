'use client';

import { useCallback, useEffect, useReducer, useRef, useState, type CSSProperties, type MouseEvent } from 'react';
import ExhibitionNav from '@/components/ExhibitionNav';
import '@/components/exhibition/poster-exhibition.css';
import { exhibitionReturn } from '@/components/exhibition/helpers';
import { rememberReturn, useMuseumReturn } from '@/lib/museumReturn';
import SourcesDrawer from '@/components/exhibition/SourcesDrawer';
import { srOnly } from '@/lib/a11y';
import { HOLOCAUST } from '../holocaust';
import {
  ORDER_HASH,
  POSTER_INTRO,
  POSTER_LEARN_MORE,
  POSTER_NAME,
  POSTER_QR_URL,
  POSTER_TITLE,
  TIMELINE_ENTRIES,
  TIMELINE_TEXT,
  YEARS,
  entryFromHash,
  firstOfYear,
  italicRuns,
} from './timelineEntries';
import OrderEvents from './OrderEvents';
import TimelineStop from './TimelineStop';
import { STOP_TEXT, TIMELINE_STOPS } from './timelineStops';
import { TIMELINE_SOURCES } from './sources';
import './timeline.css';

/*
 * The Timeline of the Holocaust, as the owner's poster sets it: black, the
 * type in the posters' pale stone, a line down the middle with a dot for
 * each date, the date on one side and the poster's words on the other,
 * turn and turn about, and barbed wire down both margins (drawn here in
 * SVG, the cream of the exhibition's wire). The title, the opening line and
 * every entry are the poster's own words (timelineEntries.ts); nothing on
 * the page is cited inline, and every source is in the Sources drawer
 * (sources.ts), with the poster's credit as the owner's design.
 *
 * It was read by scrolling; it is now read a date at a time, on one
 * screen (November 2026, after the owner's testing): a row of years along
 * the top, the one date with its photograph and the poster's words, and
 * Back and Next under it, with "Put them in order" up at the top. What
 * follows describes the scrolling version, kept for its spirit: where the browser can
 * tie an animation to scrolling, each entry opens (fades up) as it comes
 * into view, in CSS alone (timeline.css); with reduced motion, or in a
 * browser that cannot, every entry is simply there. The years along the top
 * go straight to a year's first entry, and each entry has its own address
 * (#1938-11-09; #1938 opens the year).
 *
 * Each date has its photograph under it, which comes in as the date is
 * reached and drifts slowly as the page goes by, and the line draws itself
 * down the page with the reader, each dot lighting as the line reaches it
 * (scroll-driven, in CSS; under reduced motion, all simply there). The
 * words, or the photograph, open the date as a stop (TimelineStop.tsx):
 * the photograph again, larger, with spots to look closer at, the date and
 * the words, what happened, where, and Before and Next to walk the
 * timeline; a few stops have one very quiet sound, with the museum's sound
 * on.
 *
 * At the end, the poster's own "Learn more" box is a link to the USHMM's
 * timeline, where its QR code leads; and "Put them in order" is a quiet
 * exercise for a class (OrderEvents.tsx, #order). Solemn throughout: no
 * music, nothing celebrates, nothing graphic beyond the poster's words.
 */

type CssVars = CSSProperties & Record<`--${string}`, string>;

/** Barbed wire down a margin: two twisted strands, a barb every 120px, drawn as a repeating pattern. */
function Wire({ side }: { side: 'left' | 'right' }) {
  const id = `hot-wire-${side}`;
  return (
    <svg className={`hot-wire hot-wire-${side}`} aria-hidden="true" focusable="false" width="28" height="100%">
      <defs>
        <pattern id={id} width="28" height="120" patternUnits="userSpaceOnUse" y={side === 'left' ? 0 : 60}>
          <g fill="none" stroke="currentColor" strokeLinecap="round">
            <path d="M14 0 C 11 30, 17 30, 14 60 S 11 90, 14 120" strokeWidth="1.8" />
            <path d="M14 0 C 17 30, 11 30, 14 60 S 17 90, 14 120" strokeWidth="1.8" />
            <path d="M9 53 L19 55 M9 56.5 L19 58.5 M9 60 L19 62 M9 63.5 L19 65.5" strokeWidth="1.6" />
            <path d="M14 57 L3 48 M14 57 L26 50 M14 63 L2 70 M14 63 L25 72" strokeWidth="1.6" />
          </g>
        </pattern>
      </defs>
      <rect width="28" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/** The Star of David, as on the poster beside the title. */
function Star() {
  return (
    <svg className="hot-star" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="7" strokeLinejoin="miter">
        <path d="M50 8 L88 72 L12 72 Z" />
        <path d="M50 92 L12 28 L88 28 Z" />
      </g>
    </svg>
  );
}

const Words = ({ text }: { text: string }) => (
  <>{italicRuns(text).map((r, i) => (r.italic ? <em key={i}>{r.text}</em> : <span key={i}>{r.text}</span>))}</>
);

export default function HolocaustTimeline() {
  const { fonts, slug } = HOLOCAUST;
  const back = useMuseumReturn(exhibitionReturn(HOLOCAUST));
  const [order, setOrder] = useState(false);
  // The one date on the screen, by its place on the timeline.
  const [at, setAt] = useState(0);
  // The stop open in its window, by its place on the timeline.
  const [stopAt, setStopAt] = useState<number | null>(null);

  // What takes the focus once the date asked for is on the screen (an element's id).
  const focusNext = useRef<string | null>(null);
  // A render even when the date asked for is already on the screen, so the focus still moves.
  const [, rerender] = useReducer((n: number) => n + 1, 0);
  useEffect(() => {
    const id = focusNext.current;
    focusNext.current = null;
    if (id) document.getElementById(id)?.focus({ preventScroll: true });
  });

  /** Show a date and give it the focus, so the keyboard and the screen reader go with it. */
  const goTo = useCallback((id: string) => {
    const i = TIMELINE_ENTRIES.findIndex((e) => e.id === id);
    if (i < 0) return;
    focusNext.current = id;
    setAt(i);
    rerender();
  }, []);

  useEffect(() => {
    const fromHash = () => {
      const h = window.location.hash.replace(/^#/, '');
      if (h === ORDER_HASH) return setOrder(true);
      const id = entryFromHash(h);
      if (!id) return;
      setOrder(false);
      // After the timeline is drawn again (from the exercise).
      requestAnimationFrame(() => goTo(id));
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, [goTo]);

  /** Back or Next: the date before or after, with its own address. */
  const step = (by: number) => {
    const i = Math.min(TIMELINE_ENTRIES.length - 1, Math.max(0, at + by));
    if (i === at) return;
    window.history.replaceState(null, '', `#${TIMELINE_ENTRIES[i].id}`);
    setAt(i);
  };
  const onYear = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    window.history.replaceState(null, '', `#${id}`);
    goTo(id);
  };
  const openOrder = () => {
    setOrder(true);
    window.history.replaceState(null, '', `#${ORDER_HASH}`);
  };
  const closeOrder = () => {
    setOrder(false);
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
    requestAnimationFrame(() => document.getElementById('hot-order-open')?.focus());
  };

  const closeStop = () => {
    const i = stopAt;
    setStopAt(null);
    if (i === null) return;
    // Back to the date last open, which may be further along than the one first opened.
    focusNext.current = `hot-open-${TIMELINE_ENTRIES[i].id}`;
    setAt(i);
    rerender();
  };

  const style: CssVars = {
    '--pe-display': fonts.display,
    '--pe-body': fonts.body,
    '--pe-ui': fonts.body,
  };
  const e = TIMELINE_STOPS[at];
  const count = TIMELINE_STOPS.length;

  return (
    <div className="pe-root hot-room" data-exhibition={slug} data-mode={order ? 'order' : 'timeline'} style={style}>
      <style>{`@import url('${fonts.href}');`}</style>
      {/* The poster's credit and every entry's sources, in one drawer (sources.ts); none inline. */}
      <SourcesDrawer groups={TIMELINE_SOURCES}>
        <Wire side="left" />
        <Wire side="right" />

        <ExhibitionNav className="pe-nav pe-nav-left" href={back.href} onClick={() => rememberReturn(back)}>
          <span className="pe-nav-text" aria-hidden="true">M</span>
          <span className="pe-nav-arrow pe-nav-arrow-left" aria-hidden="true">&#8592;</span>
          <span className="pe-nav-label">{back.label}</span>
        </ExhibitionNav>

        <main className="hot-main">
          <header className="hot-head">
            {!order && (
              <button type="button" id="hot-order-open" className="hot-btn hot-order-top" onClick={openOrder}>
                {TIMELINE_TEXT.orderOpen}
              </button>
            )}
            <h1 className="hot-title">
              <span className="hot-title-over">{POSTER_TITLE.over}</span> <span className="hot-title-main">{POSTER_TITLE.main}</span>
            </h1>
            <Star />
            <p className="hot-intro">{POSTER_INTRO}</p>
            <p className="hot-source">
              {TIMELINE_TEXT.source} <cite>{POSTER_NAME}</cite>
            </p>
            {!order && (
              <nav className="hot-years" aria-label={TIMELINE_TEXT.years}>
                <ul>
                  {YEARS.map((y) => {
                    const id = firstOfYear(y)!.id;
                    return (
                      <li key={y}>
                        <a href={`#${id}`} onClick={(ev) => onYear(ev, id)} aria-current={e.year === y ? 'true' : undefined}>
                          {y}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            )}
          </header>

          {order ? (
            <OrderEvents onBack={closeOrder} />
          ) : (
            <>
              {/* REVIEW (Verity): the timeline's name for screen readers. One date at a time. */}
              <section className="hot-stage" aria-label="The timeline, 1933 to 1945">
                <article key={e.id} id={e.id} className="hot-slide" tabIndex={-1} aria-labelledby={`hot-when-${e.id}`}>
                  {e.picture ? (
                    /* The date's photograph: a second way into the stop, for a mouse or a finger; the keyboard has the words. */
                    <button type="button" className="hot-photo" tabIndex={-1} aria-label={`${STOP_TEXT.open}: ${e.when}`} onClick={() => setStopAt(at)}>
                      {/* eslint-disable-next-line @next/next/no-img-element -- a still, framed */}
                      <img src={e.picture.src} alt="" decoding="async" />
                      <span className="hot-photo-cue" aria-hidden="true">
                        {STOP_TEXT.open}
                      </span>
                    </button>
                  ) : (
                    <span className="hot-photo hot-photo-none" aria-hidden="true" />
                  )}
                  <div className="hot-slide-text">
                    <p className="hot-when" id={`hot-when-${e.id}`}>
                      <span aria-hidden="true">
                        <span className="hot-year">{e.year}</span>
                        <span className="hot-date">{e.date}</span>
                      </span>
                      <span style={srOnly}>{e.when}</span>
                    </p>
                    <p className="hot-words">
                      <button type="button" id={`hot-open-${e.id}`} className="hot-stop-open" aria-haspopup="dialog" onClick={() => setStopAt(at)}>
                        <Words text={e.words} />
                        <span className="hot-stop-cue">
                          <span aria-hidden="true">+ </span>
                          {STOP_TEXT.open}
                        </span>
                      </button>
                    </p>
                  </div>
                </article>

                <div className="hot-steps">
                  <button type="button" className="hot-btn hot-btn-quiet" onClick={() => step(-1)} disabled={at === 0}>
                    <span aria-hidden="true">&#8592; </span>Back
                  </button>
                  <p className="hot-step-count" aria-live="polite">
                    {STOP_TEXT.of(at + 1, count)}
                  </p>
                  <button type="button" className="hot-btn" onClick={() => step(1)} disabled={at === count - 1}>
                    Next<span aria-hidden="true"> &#8594;</span>
                  </button>
                </div>
                {/* The line, a dot for each date: where this one stands. */}
                <ol className="hot-dots" aria-hidden="true">
                  {TIMELINE_STOPS.map((d, i) => (
                    <li key={d.id} data-at={i === at ? 'here' : i < at ? 'past' : undefined} />
                  ))}
                </ol>
              </section>

              <div className="hot-end">
                <a className="hot-learn" href={POSTER_QR_URL} target="_blank" rel="noopener noreferrer">
                  {POSTER_LEARN_MORE}
                  {/* REVIEW (Verity): said only to screen readers. */}
                  <span style={srOnly}> (opens the United States Holocaust Memorial Museum’s timeline in a new tab)</span>
                </a>
              </div>
            </>
          )}
        </main>

        {stopAt !== null && <TimelineStop index={stopAt} onMove={setStopAt} onClose={closeStop} />}
      </SourcesDrawer>
    </div>
  );
}
