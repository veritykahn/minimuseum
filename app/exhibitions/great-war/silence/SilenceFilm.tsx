'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '@/lib/a11y/usePrefersReducedMotion';
import RecordStrip, { STRIP } from './RecordStrip';
import { useArmisticeSound } from './armisticeSound';
import {
  FILM_END,
  HOUR_AT,
  IWM,
  RECORD,
  SOUND_NOTE,
  STRIP_START,
  TITLE_CARDS,
  TIMING,
  sceneAt,
  startOf,
  type Scene,
} from './film';

/*
 * "When the Guns Fell Silent": an old-film countdown, the owner's title
 * cards one at a time, then the 1918 sound-ranging record scrolling past the
 * hour, with our sound reconstruction under it. Everything runs on one
 * clock (ms since Begin) that pauses with the Pause button; the sound is
 * scheduled against the same timeline, so the guns stop as the strip
 * crosses 11:00.
 *
 * Reduced motion: no grain, no sweep, no scrolling. The record is shown
 * whole, and at the hour its silent half is marked.
 */

type Phase = 'ready' | 'playing' | 'paused' | 'done';

function sceneKey(s: Scene) {
  if (s.kind === 'countdown') return `c${s.n}`;
  if (s.kind === 'card') return `t${s.index}`;
  return s.kind;
}

/** What a screen reader hears as each scene arrives. */
function announce(s: Scene, pastHour: boolean): string {
  switch (s.kind) {
    case 'card':
      return TITLE_CARDS[s.index];
    case 'photo':
      return `Photograph: ${IWM.trench.description}`;
    case 'strip':
      return pastHour
        ? `11:00. ${RECORD.after.join(' ')}`
        : `The record, Nov. 11, 1918. ${RECORD.before.join(' ')}`;
    case 'end':
      return 'The guns fell silent at 11:00 on November 11, 1918.';
    default:
      return '';
  }
}

export default function SilenceFilm() {
  const reduced = usePrefersReducedMotion();
  const sound = useArmisticeSound();
  const [phase, setPhase] = useState<Phase>('ready');
  const [scene, setScene] = useState<Scene>({ kind: 'countdown', n: 5 });
  const [pastHour, setPastHour] = useState(false);

  // The clock: elapsed ms, kept in refs so the strip can move every frame
  // without re-rendering the page.
  const elapsedRef = useRef(0);
  const startedAtRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const sceneKeyRef = useRef('');
  const pastHourRef = useRef(false);
  const windowRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const pauseRef = useRef<HTMLButtonElement>(null);
  const againRef = useRef<HTMLButtonElement>(null);
  const focusPauseRef = useRef(false);

  /** Moves the strip so the moment `t` sits under the playhead. */
  const placeStrip = useCallback((t: number) => {
    const win = windowRef.current;
    const track = trackRef.current;
    if (!win || !track) return;
    if (reduced) {
      track.style.transform = '';
      return;
    }
    const scale = track.offsetHeight / STRIP.height || 1;
    const half = win.clientWidth / 2 / scale;
    // Start with the strip's left edge at the window's, so the record opens at its beginning.
    const startX = Math.min(half, STRIP.hourX - 1);
    const speed = (STRIP.hourX - startX) / TIMING.stripBeforeHour; // units per ms
    const local = Math.max(0, t - STRIP_START);
    const centre = Math.min(startX + local * speed, STRIP.width - half);
    track.style.transform = `translateX(${(-(centre - half) * scale).toFixed(1)}px)`;
  }, [reduced]);

  // Each frame calls whatever tick is current.
  const tickRef = useRef<() => void>(() => {});
  const schedule = useCallback(() => {
    rafRef.current = requestAnimationFrame(() => tickRef.current());
  }, []);

  const tick = useCallback(() => {
    const t = elapsedRef.current + (performance.now() - startedAtRef.current);
    const s = sceneAt(t);
    const key = sceneKey(s);
    if (key !== sceneKeyRef.current) {
      sceneKeyRef.current = key;
      setScene(s);
    }
    const past = t >= HOUR_AT;
    if (past !== pastHourRef.current) {
      pastHourRef.current = past;
      setPastHour(past);
    }
    if (s.kind === 'strip') placeStrip(t);
    if (t >= FILM_END) {
      elapsedRef.current = FILM_END;
      rafRef.current = null;
      setPhase('done');
      return;
    }
    schedule();
  }, [placeStrip, schedule]);

  useEffect(() => {
    tickRef.current = tick;
  }, [tick]);

  const stopClock = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  }, []);

  const runFrom = useCallback((t: number) => {
    stopClock();
    elapsedRef.current = t;
    startedAtRef.current = performance.now();
    sceneKeyRef.current = '';
    pastHourRef.current = !(t < HOUR_AT);
    setPastHour(t >= HOUR_AT);
    setPhase('playing');
    schedule();
  }, [stopClock, schedule]);

  const begin = useCallback(() => {
    // The click itself starts the sound: browsers allow audio only after one.
    sound.begin(0, startOf('card', 0), HOUR_AT);
    focusPauseRef.current = true;
    runFrom(0);
  }, [runFrom, sound]);

  const pause = useCallback(() => {
    elapsedRef.current += performance.now() - startedAtRef.current;
    stopClock();
    sound.pause();
    setPhase('paused');
  }, [sound, stopClock]);

  const resume = useCallback(() => {
    sound.resume();
    startedAtRef.current = performance.now();
    setPhase('playing');
    schedule();
  }, [sound, schedule]);

  const skipToEnd = useCallback(() => {
    stopClock();
    sound.stop();
    elapsedRef.current = FILM_END;
    sceneKeyRef.current = 'end';
    pastHourRef.current = true;
    setPastHour(true);
    setScene({ kind: 'end' });
    setPhase('done');
  }, [sound, stopClock]);

  // Leaving the page stops the clock (the sound hook stops itself).
  useEffect(() => stopClock, [stopClock]);

  // Begin (or Watch again) disappears once pressed: focus moves to Pause.
  useEffect(() => {
    if (phase === 'playing' && focusPauseRef.current) {
      focusPauseRef.current = false;
      pauseRef.current?.focus({ preventScroll: true });
    }
  }, [phase]);

  // The record has just appeared: put it in place before the next frame.
  const showStripNow = scene.kind === 'strip' || scene.kind === 'end';
  useEffect(() => {
    if (showStripNow) placeStrip(elapsedRef.current + (rafRef.current ? performance.now() - startedAtRef.current : 0));
  }, [showStripNow, placeStrip]);

  // When the film ends, focus goes to "Watch again" so keyboard users are not left on a vanished button.
  useEffect(() => {
    if (phase === 'done') againRef.current?.focus({ preventScroll: true });
  }, [phase]);

  // Keep the strip in place if the window is resized mid-film, or on reduced motion.
  useEffect(() => {
    const onResize = () => placeStrip(elapsedRef.current + (rafRef.current ? performance.now() - startedAtRef.current : 0));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [placeStrip]);

  const running = phase === 'playing' || phase === 'paused';
  const showStrip = showStripNow;

  return (
    <section className={`gws ${reduced ? 'gws-reduced' : ''}`} aria-labelledby="gws-heading" data-phase={phase} data-scene={sceneKey(scene)}>
      <h2 id="gws-heading" className="visually-hidden">The film</h2>

      <div className="gws-screen" data-past-hour={pastHour ? '' : undefined}>
        {phase === 'ready' && (
          <div className="gws-ready">
            <p className="gws-ready-text">
              A short film in memory of the Armistice: a countdown, six title cards, and the 1918 sound-ranging record of the last minute of the war.
            </p>
            <button type="button" className="gw-button gw-button-primary" onClick={begin}>
              Begin
            </button>
            <p className="gws-sound-note">{SOUND_NOTE}</p>
          </div>
        )}

        {running && scene.kind === 'countdown' && (
          <div className="gws-countdown" aria-hidden="true">
            <svg viewBox="0 0 400 300" className="gws-leader">
              <rect width="400" height="300" className="gws-leader-ground" />
              <line x1="0" y1="150" x2="400" y2="150" className="gws-leader-cross" />
              <line x1="200" y1="0" x2="200" y2="300" className="gws-leader-cross" />
              <circle cx="200" cy="150" r="112" className="gws-leader-ring" />
              <circle cx="200" cy="150" r="96" className="gws-leader-ring" />
              <path key={scene.n} className="gws-leader-sweep" d="M200,150 L200,38 A112,112 0 1,1 199.9,38 Z" />
              <text x="200" y="150" className="gws-leader-digit" textAnchor="middle" dominantBaseline="central">
                {scene.n}
              </text>
            </svg>
          </div>
        )}

        {running && scene.kind === 'card' && (
          <div className="gws-card" key={scene.index}>
            <p className="gws-card-text">{TITLE_CARDS[scene.index]}</p>
          </div>
        )}

        {running && scene.kind === 'photo' && (
          <figure className="gws-photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={IWM.trench.src} alt={IWM.trench.alt} width={IWM.trench.width} height={IWM.trench.height} />
            <figcaption>
              {IWM.trench.description}{' '}
              <a href={IWM.trench.url} target="_blank" rel="noopener noreferrer">
                {IWM.trench.credit}
              </a>
            </figcaption>
          </figure>
        )}

        {showStrip && (
          <div className="gws-record">
            <div className="gws-strip-window" ref={windowRef}>
              <div className="gws-strip-track" ref={trackRef}>
                <RecordStrip id="gws-strip" />
              </div>
              {!reduced && <span className="gws-playhead" aria-hidden="true" />}
            </div>
            <div className="gws-hour" aria-hidden="true">
              <span className="gws-hour-date">11.11.1918</span>
              <span className="gws-hour-time">{pastHour ? '11:00' : '10:59'}</span>
            </div>
            <p className="gws-strip-credit">{RECORD.redrawnCredit}</p>
          </div>
        )}
      </div>

      {/* The film's own controls */}
      <div className="gws-controls">
        {running && (
          <button ref={pauseRef} type="button" className="gw-button" onClick={phase === 'playing' ? pause : resume}>
            {phase === 'playing' ? 'Pause' : 'Resume'}
          </button>
        )}
        {phase !== 'ready' && sound.available && (
          <button type="button" className="gw-button" aria-pressed={sound.muted} onClick={() => sound.setMuted(!sound.muted)}>
            {sound.muted ? 'Sound off' : 'Sound on'}
          </button>
        )}
        {running && (
          <button type="button" className="gw-button" onClick={skipToEnd}>
            Skip to the end
          </button>
        )}
        {phase === 'done' && (
          <button ref={againRef} type="button" className="gw-button" onClick={begin}>
            Watch again
          </button>
        )}
      </div>
      {phase !== 'ready' && (
        <p className="gws-sound-note">
          {sound.available ? SOUND_NOTE : 'Sound is not available in this browser; the film runs in silence.'}
        </p>
      )}

      <p className="visually-hidden" aria-live="polite" aria-atomic="true">
        {running || phase === 'done' ? announce(scene, pastHour) : ''}
      </p>

      {phase === 'done' && (
        <div className="gws-after">
          <p className="gws-closing">
            At 11:00 on November 11, 1918, the guns fell silent.
          </p>
          <figure className="gws-iwm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={IWM.record.src} alt={IWM.record.alt} width={IWM.record.width} height={IWM.record.height} loading="lazy" />
            <figcaption>
              <span>The record itself. {IWM.record.description}</span>{' '}
              <a href={IWM.record.url} target="_blank" rel="noopener noreferrer">
                {IWM.record.credit}
              </a>
            </figcaption>
          </figure>
          <a className="gw-button gw-button-link" href={IWM.reconstruction.url} target="_blank" rel="noopener noreferrer">
            {IWM.reconstruction.label}
            <span className="visually-hidden"> (Imperial War Museums, opens in a new tab)</span>
          </a>
        </div>
      )}

      <details className="gws-transcript">
        <summary>Read the film as text</summary>
        <ol>
          {TITLE_CARDS.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ol>
        <p>
          Then the 1918 sound-ranging record, {RECORD.heading} {RECORD.subheading} {RECORD.date.join(' ')} On the left, {RECORD.before.join(' ').toLowerCase()} On the right, {RECORD.after.join(' ').toLowerCase()}
        </p>
        <p>
          The photograph in the film: {IWM.trench.description} {IWM.trench.credit}.
        </p>
        <p>
          The photographs are used under the{' '}
          <a href={IWM.licence.url} target="_blank" rel="noopener noreferrer">
            {IWM.licence.label}
          </a>
          .
        </p>
      </details>
    </section>
  );
}
