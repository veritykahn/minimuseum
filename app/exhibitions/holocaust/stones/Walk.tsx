'use client';

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import { useDialogFocus } from '@/lib/a11y';
import { usePrefersReducedMotion } from '@/lib/a11y/usePrefersReducedMotion';
import SourcesDrawer, { type SourceGroup } from '@/components/exhibition/SourcesDrawer';
import { makeFootsteps, type Footsteps } from './footsteps';
import { WALK_LINES, ambientSrc, slotSrc, type Ambient, type WalkPictures } from './walkLines';
import { WALK_BEATS, beatForStep, nameText, type WalkBeat } from './walkNames';
import WalkPicture from './WalkPicture';

/*
 * The walk: the visitor lights a candle, and then walks slowly through the
 * history, full screen, one step at a time. Each step is one of the owner's
 * pictures (an object or a place, never a person; walkLines.ts), filling the
 * screen, dark at the edges and drifting very slowly, with one short line of
 * the history beneath it, in order. Now and then, between the steps, one
 * child's name and age, alone on black (walkNames.ts). The candle stays lit
 * in a corner all the way, and at the end the walk closes quietly, the
 * candle still burning. There is no score.
 *
 * Each step fades slowly into the next, and cannot be hurried; walking on,
 * a step comes every few seconds, time to read its line. The footsteps
 * (footsteps.ts, made with Web Audio) and the quiet ambient recordings under
 * them, where the owner has supplied them, are off until the visitor turns
 * them on. With reduced motion nothing drifts or fades, the flame is still,
 * and the walk moves only a step at a time, by button.
 *
 * Every line's and every name's source is in the walk's Sources drawer, by
 * step, never on the screen.
 */

/** A step's fade; a step can't be taken again until it is done. */
export const STEP_MS = 1800;
/** Walking on: a step this often, long enough to read a line. */
export const AUTO_MS = 6500;

// REVIEW (Verity): the walk's own words, new with the candle.
export const WALK_INTRO = 'Light a candle, then walk slowly through the history, one step at a time.';
export const WALK_ABOUT =
  'Each step brings a picture of a place or a thing left behind, and one short line of the history, in the order it happened. Between the steps, now and then, one child’s name. The walk fills the screen. Sound is off until you turn it on.';
export const WALK_BEGIN = 'Your candle is lit. Take a step when you are ready.';
export const WALK_CLOSE = 'You can leave your candle burning.';

export type WalkWords = { kind: 'none' } | { kind: 'end' } | WalkBeat;

/** What the walk shows at step `steps`: nothing before the first step, then each line or name in turn, then the quiet close. */
export function wordsForStep(steps: number): WalkWords {
  if (steps < 1) return { kind: 'none' };
  return beatForStep(steps) ?? { kind: 'end' };
}

/** What is read out at a step. */
const spoken = (w: WalkWords) => (w.kind === 'line' ? w.line.text : w.kind === 'name' ? nameText(w.name) : w.kind === 'end' ? WALK_CLOSE : '');

/** The walk's sources, step by step (each line's, and each name's own): for the Sources drawer. */
export function walkSourceGroups(): SourceGroup[] {
  const short = (t: string) => (t.length > 60 ? `${t.slice(0, 57).trimEnd()}…` : t.replace(/\.$/, ''));
  return WALK_BEATS.map((b, i) => ({
    title: `The walk, step ${i + 1}`,
    items: b.kind === 'line' ? b.line.sources.map((s) => ({ ...s, note: short(b.line.text) })) : [{ ...b.name.source, note: nameText(b.name) }],
  }));
}

const AMBIENT_LEVEL = 0.22;

export function useWalk(ambients: readonly Ambient[] = []) {
  const reduced = usePrefersReducedMotion();
  const [steps, setSteps] = useState(0);
  const [walking, setWalking] = useState(false);
  const [sound, setSound] = useState(false);
  const [full, setFull] = useState(false);
  const [lit, setLit] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const audio = useRef<Footsteps | null>(null);
  const busyUntil = useRef(0);
  const stepsRef = useRef(0);
  const last = WALK_BEATS.length + 1;

  const step = useCallback(() => {
    const now = performance.now();
    if (now < busyUntil.current || stepsRef.current >= last) return false;
    busyUntil.current = now + (reduced ? 300 : STEP_MS);
    const n = stepsRef.current + 1;
    stepsRef.current = n;
    setSteps(n);
    audio.current?.step(n % 2 === 0 ? 1 : -1);
    setAnnouncement(spoken(wordsForStep(n)));
    // Walking on stops at the close.
    if (n >= last) setWalking(false);
    return true;
  }, [reduced, last]);

  // Walking on: a step every few seconds, until the visitor stops.
  useEffect(() => {
    if (!walking || reduced) return;
    step();
    const id = setInterval(step, AUTO_MS);
    return () => clearInterval(id);
  }, [walking, reduced, step]);

  const toggleWalking = () => {
    setWalking((w) => !w);
    setAnnouncement(walking ? 'You stop.' : 'You walk on, slowly.');
  };

  const toggleSound = () => {
    if (sound) {
      audio.current?.close();
      audio.current = null;
      setSound(false);
      setAnnouncement('Sound off.');
      return;
    }
    audio.current = makeFootsteps();
    setSound(!!audio.current);
    setAnnouncement(audio.current ? 'Sound on. Each step is heard.' : 'Sound is not available in this browser.');
  };

  useEffect(() => () => audio.current?.close(), []);

  // Under the steps, the part of the walk's ambient recording, where there is one: looped, quiet, faded in and out.
  const words = wordsForStep(steps);
  const part: Ambient = partAt(steps);
  const playing = useRef<{ part: Ambient; el: HTMLAudioElement } | null>(null);
  useEffect(() => {
    const want = sound && full && ambients.includes(part) ? part : null;
    const cur = playing.current;
    if (cur?.part === want) return;
    if (cur) fadeOut(cur.el);
    playing.current = null;
    if (!want || typeof Audio === 'undefined') return;
    try {
      const el = new Audio(ambientSrc(want));
      el.loop = true;
      el.volume = 0;
      void el.play()?.catch(() => undefined);
      fadeTo(el, AMBIENT_LEVEL);
      playing.current = { part: want, el };
    } catch {
      /* no audio here */
    }
  }, [sound, full, part, ambients]);
  useEffect(() => () => {
    if (playing.current) playing.current.el.pause();
  }, []);

  const stop = useCallback(() => setWalking(false), []);
  const enter = useCallback(() => {
    setFull(true);
    setAnnouncement('The walk, full screen. Press Escape to leave it.');
  }, []);
  /** The way in: the candle is lit, and the walk begins. */
  const light = useCallback(() => {
    setLit(true);
    enter();
  }, [enter]);
  const leave = useCallback(() => {
    setFull(false);
    setWalking(false);
    setAnnouncement('You leave the walk. Your candle is still lit.');
  }, []);
  /** From the close, back to the beginning; the candle stays lit. */
  const again = useCallback(() => {
    stepsRef.current = 0;
    busyUntil.current = 0;
    setSteps(0);
    setAnnouncement(WALK_BEGIN);
  }, []);

  return { reduced, steps, walking, sound, full, lit, words, announcement, step, toggleWalking, toggleSound, stop, enter, light, leave, again };
}

/** The part of the walk at step `steps`, for its ambient sound: the last line reached. */
function partAt(steps: number): Ambient {
  for (let i = Math.min(steps, WALK_BEATS.length) - 1; i >= 0; i--) {
    const b = WALK_BEATS[i];
    if (b.kind === 'line') return b.line.part;
  }
  return 'before';
}

function fadeTo(el: HTMLAudioElement, to: number, ms = 2000) {
  const from = el.volume;
  const t0 = Date.now();
  const id = setInterval(() => {
    const k = Math.min(1, (Date.now() - t0) / ms);
    try {
      el.volume = from + (to - from) * k;
    } catch {
      clearInterval(id);
    }
    if (k >= 1) clearInterval(id);
  }, 80);
}
function fadeOut(el: HTMLAudioElement) {
  fadeTo(el, 0, 1500);
  setTimeout(() => el.pause(), 1600);
}

type Walk = ReturnType<typeof useWalk>;

/** A candle, drawn: unlit, or with a small flame that moves a little, as a flame does (still, under reduced motion). */
export function Candle({ lit, className = '' }: { lit: boolean; className?: string }) {
  return (
    <svg className={`hos-candle${lit ? ' is-lit' : ''} ${className}`} viewBox="0 0 40 80" aria-hidden="true" focusable="false">
      {lit && (
        <g className="hos-candle-flame">
          <ellipse className="hos-candle-glow" cx="20" cy="22" rx="18" ry="20" />
          <path className="hos-candle-outer" d="M 20 6 C 25 15 27 21 26 26 C 25 31 15 31 14 26 C 13 21 15 15 20 6 Z" />
          <path className="hos-candle-inner" d="M 20 15 C 22.5 20 23.5 23 23 26 C 22.4 29 17.6 29 17 26 C 16.5 23 17.5 20 20 15 Z" />
        </g>
      )}
      <path className="hos-candle-wick" d="M 20 27 V 33" />
      <path className="hos-candle-body" d="M 12 34 Q 20 31.5 28 34 V 76 H 12 Z" />
    </svg>
  );
}

/** Behind the room's title and panel, on the walk's tab: the walk's first picture, very dim, in the dark; or just the dark. */
export function WalkBackdrop({ pictures }: { pictures: WalkPictures }) {
  const first = WALK_LINES[0];
  const file = pictures[first.slot];
  return (
    <div className="hos-scene hos-walk-backdrop" aria-hidden="true">
      {file && (
        // eslint-disable-next-line @next/next/no-img-element -- the owner's picture, as a dim backdrop
        <img src={slotSrc(first.slot, file)} alt="" />
      )}
      <span className="hos-walk-backdrop-veil" />
    </div>
  );
}

/** The walk's place in the room's panel: what it is, and the way in, by lighting a candle. */
export function WalkControls({ announcement, enter, light, full, lit }: Walk) {
  return (
    <div className="hos-walk">
      <p className="hos-intro">{WALK_INTRO}</p>
      <p className="hos-walk-about">{WALK_ABOUT}</p>
      <Candle lit={lit} className="hos-candle-panel" />
      {lit ? (
        <button type="button" className="hos-button hos-button-primary" onClick={enter} aria-expanded={full}>
          Return to the walk
        </button>
      ) : (
        <button type="button" className="hos-button hos-button-primary" onClick={light} aria-expanded={full}>
          Light a candle
        </button>
      )}
      <p className="visually-hidden" role="status" aria-live="polite">{full ? '' : announcement}</p>
    </div>
  );
}

/** What fills the screen at a step: a picture, or black (a name, the beginning, the close). */
type Layer = { key: string; beat: WalkBeat | null };
const layerAt = (steps: number): Layer => {
  const b = beatForStep(steps);
  if (b?.kind === 'line') return { key: b.line.id, beat: b };
  if (b?.kind === 'name') return { key: b.name.id, beat: b };
  return { key: steps < 1 ? 'begin' : 'end', beat: null };
};

/** The walk, full screen: a picture a step, with its line beneath; a name now and then; the candle in its corner; a few quiet buttons. */
export function WalkFull({ walk, pictures }: { walk: Walk; pictures: WalkPictures }) {
  const { reduced, steps, walking, sound, words, announcement, step, toggleWalking, toggleSound, leave, again } = walk;
  const ref = useRef<HTMLDivElement>(null);
  const stepRef = useRef<HTMLButtonElement>(null);
  useDialogFocus(ref, true, { onEscape: leave, initialFocus: stepRef });

  // Full screen where the browser allows it (not on a phone that won't); leaving it leaves the walk.
  useEffect(() => {
    const el = ref.current;
    let asked = false;
    try {
      if (el && document.fullscreenEnabled && !document.fullscreenElement && window.matchMedia?.('(min-width: 761px)').matches) {
        asked = true;
        void el.requestFullscreen?.().catch(() => undefined);
      }
    } catch {
      /* no full screen here: the walk still fills the window */
    }
    const onChange = () => {
      if (asked && !document.fullscreenElement) leave();
    };
    document.addEventListener('fullscreenchange', onChange);
    return () => {
      document.removeEventListener('fullscreenchange', onChange);
      if (document.fullscreenElement) void document.exitFullscreen?.().catch(() => undefined);
    };
  }, [leave]);

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if ((e.key === 'ArrowUp' || e.key === 'ArrowRight' || e.key === 'PageDown') && !(e.target instanceof HTMLInputElement)) {
      e.preventDefault();
      step();
    }
  };

  const ended = words.kind === 'end';
  // The step before stays beneath while this one fades in over it (no fade with reduced motion).
  const layers = [...(reduced || steps < 1 ? [] : [layerAt(steps - 1)]), layerAt(steps)];

  return createPortal(
    <div ref={ref} className={`hos-walk-full${reduced ? ' is-still' : ''}`} data-exhibition="holocaust" role="dialog" aria-modal="true" aria-label="The walk" tabIndex={-1} onKeyDown={onKey}>
      <div className="hos-walk-layers">
        {layers.map((l, i) => {
          const current = i === layers.length - 1;
          return (
            <div key={l.key} className={`hos-walk-layer${current ? ' is-current' : ' is-before'}${l.beat?.kind === 'line' ? '' : ' is-dark'}`} aria-hidden={current ? undefined : true}>
              {l.beat?.kind === 'line' && <WalkPicture line={l.beat.line} file={pictures[l.beat.line.slot]} />}
            </div>
          );
        })}
        <span className="hos-walk-edges" aria-hidden="true" />
      </div>

      {words.kind === 'name' && (
        <div className="hos-walk-name" key={words.name.id} data-name={words.name.id} data-step={steps}>
          <p>{nameText(words.name)}</p>
        </div>
      )}

      <Candle lit className="hos-candle-corner" />

      <div className="hos-walk-words">
        {words.kind === 'none' && <p className="hos-walk-say is-intro">{WALK_BEGIN}</p>}
        {words.kind === 'line' && (
          <div className="hos-walk-say-wrap" key={words.line.id} data-line={words.line.id} data-step={steps}>
            <p className="hos-walk-say">{words.line.text}</p>
          </div>
        )}
        {ended && (
          <div className="hos-walk-say-wrap" key="end" data-end="true">
            <p className="hos-walk-say is-close">{WALK_CLOSE}</p>
          </div>
        )}
      </div>

      <div className="hos-walk-bar">
        {ended ? (
          <button ref={stepRef} type="button" className="hos-button" onClick={again}>
            Walk again
          </button>
        ) : (
          <>
            <button ref={stepRef} type="button" className="hos-button hos-button-primary" onClick={step} disabled={walking}>
              Take a step
            </button>
            {!reduced && (
              <button type="button" className="hos-button" aria-pressed={walking} onClick={toggleWalking}>
                {walking ? 'Stop' : 'Walk on slowly'}
              </button>
            )}
          </>
        )}
        <button type="button" className="hos-button hos-button-sound" aria-pressed={sound} onClick={toggleSound}>
          <span aria-hidden="true" className="hos-sound-mark">{sound ? '◉' : '○'}</span> Sound: {sound ? 'on' : 'off'}
        </button>
        <button type="button" className="hos-button hos-walk-leave" onClick={leave}>
          Leave the walk
        </button>
      </div>
      {/* Every line's and every name's source, by step: the walk's own drawer, at its top left, clear of the steps. */}
      <div className="hos-walk-sources">
        <SourcesDrawer groups={walkSourceGroups()} />
      </div>
      <p className="visually-hidden" role="status" aria-live="polite">{announcement}</p>
    </div>,
    document.body,
  );
}
