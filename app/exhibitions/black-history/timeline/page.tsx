'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties, type TouchEvent } from 'react';
import ExhibitionNav from '@/components/ExhibitionNav';
import '@/components/exhibition/poster-exhibition.css';
import { roomReturn } from '@/components/exhibition/helpers';
import { rememberReturn, useMuseumReturn } from '@/lib/museumReturn';
import FactNote from '@/components/exhibition/FactNote';
import SourcesDrawer from '@/components/exhibition/SourcesDrawer';
import { srOnly, useReducedMotion } from '@/lib/a11y';
import { BLACK_HISTORY } from '../blackHistory';
import { DATED_STOPS, ORDER_HASH, OWNER_BARBIE_PHOTOS, TIMELINE_STOPS, TIMELINE_TEXT, isRight, markRuns, photoFor, stepFor, stopFromHash, type TimelineStop } from './timelineStops';
import { play, type Cue } from './cheer';
import OrderChallenge from './OrderChallenge';
import { TIMELINE_SOURCES } from './sources';
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
 * note (timelineStops.ts), never as the poster's words, its source in the
 * room's Sources drawer (sources.ts).
 *
 * Where the owner has given a photograph for a stop (OWNER_BARBIE_PHOTOS),
 * it is pinned beside the year disc, its credit in the Sources drawer; with none, the
 * room has no photograph and no space kept for one.
 *
 * It is a game for a class as well: at each dated stop the year is hidden
 * ("?") until someone guesses it from four big choices (or the keys 1 to 4),
 * or asks to be shown. A right guess bursts and chimes; a wrong one is told
 * gently, with the year. The words, which give the year away, wait for the
 * guess. At the end (#order) the final challenge puts the stops back in
 * order (OrderChallenge.tsx). Sound is off until the visitor turns it on.
 */

type Guess = number | 'skip';
const SOUND_KEY = 'mm-bh-timeline-sound';

type CssVars = CSSProperties & Record<`--${string}`, string>;

const VIGNETTES = ['musician', 'worker', 'scientist', 'singer', 'notes', 'atom'];

/** The year shown while it counts from one stop to the next. */
function useCountingYear(target: number | null, still: boolean) {
  const [shown, setShown] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    // A hidden year ("?") leaves the count where it was, so a guess counts on from the last year shown.
    const start = from.current;
    if (target !== null) from.current = target;
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
  const back = useMuseumReturn(roomReturn(BLACK_HISTORY));
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [guesses, setGuesses] = useState<Record<string, Guess>>({});
  const [challenge, setChallenge] = useState(false);
  const [sound, setSound] = useState(false);
  const [party, setParty] = useState(0);
  const [said, setSaid] = useState('');
  const revealFocus = useRef(false);
  const stopRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const touchX = useRef<number | null>(null);
  const wordsRef = useRef<HTMLElement>(null);
  const wordsFocus = useRef(false);
  const stop = TIMELINE_STOPS[index];
  const isShown = (s: TimelineStop) => s.year === null || s.id in guesses;
  const shown = isShown(stop);
  const year = useCountingYear(shown ? stop.year : null, reduced);
  const guess = guesses[stop.id];
  const rightCount = DATED_STOPS.filter((s) => typeof guesses[s.id] === 'number' && isRight(s, guesses[s.id] as number)).length;

  // Sound stays off until the visitor turns it on; the choice is remembered in this browser.
  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- the visitor's sound choice comes back from this browser
      if (window.localStorage.getItem(SOUND_KEY) === 'on') setSound(true);
    } catch {
      // No storage: sound stays off.
    }
  }, []);
  const cue = useCallback(
    (c: Cue) => {
      if (sound) play(c);
    },
    [sound],
  );
  const toggleSound = () => {
    const on = !sound;
    setSound(on);
    if (on) play('on');
    try {
      window.localStorage.setItem(SOUND_KEY, on ? 'on' : 'off');
    } catch {
      // Private windows: the choice lasts as long as the page.
    }
  };

  useEffect(() => {
    const fromHash = () => {
      if (window.location.hash.replace(/^#/, '') === ORDER_HASH) return setChallenge(true);
      const i = stopFromHash(window.location.hash);
      if (i >= 0) {
        setChallenge(false);
        setIndex(i);
      }
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, []);

  const go = useCallback((i: number, focus = false) => {
    const to = Math.max(0, Math.min(TIMELINE_STOPS.length - 1, i));
    setChallenge(false);
    setSaid('');
    setIndex(to);
    window.history.replaceState(null, '', `#${TIMELINE_STOPS[to].id}`);
    if (focus) stopRefs.current[to]?.focus();
  }, []);

  const answer = useCallback(
    (g: Guess) => {
      if (stop.year === null || stop.id in guesses) return;
      setGuesses((x) => ({ ...x, [stop.id]: g }));
      revealFocus.current = true;
      const yearSaid = stop.yearLabel ?? String(stop.year);
      if (g === 'skip') {
        setSaid(`${TIMELINE_TEXT.skipped} ${yearSaid}.`);
      } else if (isRight(stop, g)) {
        setParty((n) => n + 1);
        cue('right');
        setSaid(`${TIMELINE_TEXT.right} ${yearSaid}.`);
      } else {
        cue('wrong');
        setSaid(`${TIMELINE_TEXT.wrong} ${yearSaid}.`);
      }
    },
    [stop, guesses, cue],
  );

  const openChallenge = () => {
    setChallenge(true);
    window.history.replaceState(null, '', `#${ORDER_HASH}`);
  };
  const startOver = () => {
    setGuesses({});
    go(0, true);
  };

  // Arrow keys, Home and End move along the stops, from wherever the focus is in the room
  // (a link in a note keeps its own keys). On the stops they carry the focus along too.
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (challenge || e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
      const el = e.target as HTMLElement;
      // The Sources drawer keeps its own keys too.
      if (el !== document.body && (!el.closest('.bht-room') || el.closest('a, input, textarea, select, .mm-sources-scrim'))) return;
      // The keys 1 to 4 guess, where the year is still hidden: a keyboard at the front of the class.
      const choice = /^[1-9]$/.test(e.key) && !shown && stop.choices ? stop.choices[Number(e.key) - 1] : undefined;
      if (choice !== undefined) {
        e.preventDefault();
        answer(choice);
        return;
      }
      const to = stepFor(e.key, index, !!el.closest('.bht-track'));
      if (to === null) return;
      e.preventDefault();
      if (to === index) return;
      // The words are drawn afresh for each stop: if they had the focus, the new ones take it.
      wordsFocus.current = !!el.closest('.bht-words');
      go(to, !!el.closest('.bht-track'));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, go, challenge, shown, stop, answer]);
  useEffect(() => {
    if (!wordsFocus.current) return;
    wordsFocus.current = false;
    wordsRef.current?.focus();
  }, [index]);
  // A guess takes its buttons away: the focus goes on to the words they reveal.
  useEffect(() => {
    if (!revealFocus.current) return;
    revealFocus.current = false;
    wordsRef.current?.focus();
  }, [guesses]);

  // The Earlier and Later buttons go dim at the ends: the focus moves to the stop, not off the page.
  const step = (by: number) => {
    const to = Math.max(0, Math.min(TIMELINE_STOPS.length - 1, index + by));
    go(to, to === 0 || to === TIMELINE_STOPS.length - 1);
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
  const yearText = (s: TimelineStop) => s.yearLabel ?? String(s.year);
  const label = stop.year === null ? stop.name : shown ? `${yearText(stop)}: ${stop.name}` : `Guess the year: ${stop.name}`;
  const stopName = (s: TimelineStop, i: number) => (s.year === null ? s.name : isShown(s) ? `${yearText(s)}, ${s.name}` : `Stop ${i + 1}, ${s.name}, year hidden`);
  // While it counts the year is a plain number; settled, it is set as the stop gives it (c. 1990).
  const yearShown = year === stop.year && stop.yearLabel ? stop.yearLabel : year;
  const longYear = !!stop.yearLabel;
  const photo = shown ? photoFor(stop.id, OWNER_BARBIE_PHOTOS) : undefined;

  return (
    <div className="pe-root bht-room" data-exhibition={slug} data-theme={challenge ? 'pink' : stop.theme} data-mode={challenge ? 'order' : 'stops'} style={style}>
      <style>{`@import url('${fonts.href}');`}</style>
      {/* The added stops' sources and the photographs' credits, in one drawer (sources.ts); none inline. */}
      <SourcesDrawer groups={TIMELINE_SOURCES}>

      <ExhibitionNav className="pe-nav pe-nav-left" href={back.href} onClick={() => rememberReturn(back)}>
        <span className="pe-nav-text" aria-hidden="true">M</span>
        <span className="pe-nav-arrow pe-nav-arrow-left" aria-hidden="true">&#8592;</span>
        <span className="pe-nav-label">{back.label}</span>
      </ExhibitionNav>

      <main className="bht-stage" onTouchStart={challenge ? undefined : onTouchStart} onTouchEnd={challenge ? undefined : onTouchEnd}>
        <div className="bht-ground" aria-hidden="true">
          <span className="bht-rays bht-rays-a" style={{ '--turn': `${index * 9}deg` } as CssVars} />
          <span className="bht-rays bht-rays-b" style={{ '--turn': `${index * -7}deg` } as CssVars} />
        </div>

        <header className="bht-bar">
          <h1 className="bht-title">{TIMELINE_TEXT.title}</h1>
          <p className="bht-source" hidden={challenge}>
            {stop.note ? (
              TIMELINE_TEXT.noteSource
            ) : (
              <>
                {TIMELINE_TEXT.source} <cite>{TIMELINE_TEXT.poster}</cite>
              </>
            )}
          </p>
          <div className="bht-controls">
            <button type="button" className="bht-chip bht-sound" aria-pressed={sound} onClick={toggleSound}>
              <svg className="bht-sound-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" />
                {sound ? <path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /> : <path d="M16 9l5 6M21 9l-5 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
              </svg> {sound ? TIMELINE_TEXT.soundOn : TIMELINE_TEXT.soundOff}
            </button>
            <p className="bht-chip bht-score">
              <span aria-hidden="true">★</span> {TIMELINE_TEXT.score}: <strong>{rightCount}</strong> of {DATED_STOPS.length}
            </p>
            {!challenge && (
              <button type="button" className="bht-chip bht-chip-go" onClick={openChallenge}>
                {TIMELINE_TEXT.challenge} <span aria-hidden="true">&#8594;</span>
              </button>
            )}
          </div>
        </header>

        {challenge ? (
          <OrderChallenge onBack={() => go(index)} onStartOver={startOver} cue={cue} reduced={reduced} />
        ) : (
          <>
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
              {/* A right guess: a bigger burst, further out. */}
              {!reduced && party > 0 && typeof guess === 'number' && isRight(stop, guess) && (
                <div className="bht-burst bht-burst-big" key={`c-${party}`}>
                  {Array.from({ length: 28 }, (_, i) => (
                    <i key={i} style={{ '--a': `${(i * 360) / 28 + 6}deg`, '--d': `${(i % 4) * 0.05}s` } as CssVars} />
                  ))}
                </div>
              )}
              <div className="bht-disc">
                {shown ? (
                  <span className={`bht-year ${stop.year === null ? 'bht-year-word' : ''} ${longYear ? 'bht-year-long' : ''}`}>{yearShown ?? TIMELINE_TEXT.today}</span>
                ) : (
                  <span className="bht-year bht-year-q">?</span>
                )}
                {stop.year !== null && <span className="bht-name" key={`n-${index}`}>{stop.name}</span>}
              </div>
            </div>

            {photo && (
              <figure
                className="bht-photo"
                key={`p-${index}`}
                style={{ '--photo-w': `min(calc(var(--disc-d) * ${+((0.6 * photo.width) / photo.height).toFixed(4)}), calc(var(--disc-d) * 0.5), ${photo.width}px)` } as CssVars}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} />
              </figure>
            )}

            <section ref={wordsRef} className="bht-words" key={`w-${index}-${shown}`} aria-labelledby="bht-stop-heading" tabIndex={0}>
              <h2 id="bht-stop-heading" style={srOnly}>{label}</h2>
              {!shown && stop.choices && (
                <div className="bht-guess">
                  <p className="bht-guess-heading" aria-hidden="true">{TIMELINE_TEXT.guessHeading}</p>
                  <div className="bht-guess-choices" role="group" aria-label={TIMELINE_TEXT.guessHeading}>
                    {stop.choices.map((c, n) => (
                      <button key={c} type="button" className="bht-guess-btn" onClick={() => answer(c)}>
                        <span className="bht-guess-key" aria-hidden="true">{n + 1}</span>
                        {c}
                      </button>
                    ))}
                  </div>
                  <button type="button" className="bht-btn bht-btn-ghost bht-guess-skip" onClick={() => answer('skip')}>
                    {TIMELINE_TEXT.skip}
                  </button>
                </div>
              )}
              {shown && guess !== undefined && guess !== 'skip' && (
                <p className={`bht-feedback ${isRight(stop, guess) ? 'bht-feedback-right' : 'bht-feedback-wrong'}`} aria-hidden="true">
                  {isRight(stop, guess) ? TIMELINE_TEXT.right : `${TIMELINE_TEXT.wrong} ${yearText(stop)}.`}
                </p>
              )}
              {shown && stop.tag && <p className="bht-tag">{stop.tag}</p>}
              {shown && stop.sentences.map((s) => (
                <p key={s} className="bht-sentence">
                  {markRuns(s, stop.mark).map((r, i) => (r.marked ? <mark key={i}>{r.text}</mark> : <span key={i}>{r.text}</span>))}
                </p>
              ))}
              {shown && stop.note && <FactNote fact={stop.note} className="bht-note" />}
              {stop.year === null && (
                <button type="button" className="bht-btn bht-btn-big bht-cta" onClick={openChallenge}>
                  {TIMELINE_TEXT.challengeCta} <span aria-hidden="true">&#8594;</span>
                </button>
              )}
            </section>

            <nav className="bht-track" aria-label="The timeline">
              <button type="button" className="bht-step" onClick={() => step(-1)} disabled={index === 0} aria-label="Earlier">
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
                      aria-label={stopName(s, i)}
                      tabIndex={i === index ? 0 : -1}
                      onClick={() => go(i)}
                    >
                      <span className={`bht-stop-year${s.yearLabel && isShown(s) ? ' bht-stop-year-long' : ''}`} aria-hidden="true">
                        {s.year !== null && !isShown(s) ? (
                        '?'
                      ) : s.yearLabel ? (
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
              <button type="button" className="bht-step" onClick={() => step(1)} disabled={index === TIMELINE_STOPS.length - 1} aria-label="Later">
                <span aria-hidden="true">&#8594;</span>
              </button>
            </nav>

            <p role="status" style={srOnly}>{said ? `${said} ${label}` : label}</p>
          </>
        )}
      </main>
      </SourcesDrawer>
    </div>
  );
}
