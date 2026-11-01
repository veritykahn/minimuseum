'use client';

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import { useDialogFocus } from '@/lib/a11y';
import { usePrefersReducedMotion } from '@/lib/a11y/usePrefersReducedMotion';
import SourcesDrawer, { type SourceGroup } from '@/components/exhibition/SourcesDrawer';
import { makeFootsteps, type Footsteps } from './footsteps';
import { WALK_DIR, WALK_LINES, ambientSrc, slotSrc, type Ambient, type WalkPictures } from './walkLines';
import { WALK_BEATS, beatForStep, nameText, type WalkBeat } from './walkNames';
import { STEP, drawFloor, easeStep, makeView, type View } from './walkScene';
import WalkPicture from './WalkPicture';

/*
 * The walk: an original piece, inspired by Menashe Kadishman's Fallen Leaves
 * (Shalekhet) at the Jewish Museum Berlin, where visitors walk over iron
 * faces that cover the floor and hear them as they go, and by the iron
 * Shoes on the Danube Bank in Budapest. The visitor lights a candle, and
 * then walks, full screen, down a dark hall whose floor is covered with
 * cast-iron faces and empty iron shoes (walkScene.ts, drawn here, nothing
 * of theirs), carrying the candle in front of them: it lights the nearest
 * of the iron, and the rest falls away into the dark. At the far end, like
 * a film on the end wall, the owner's pictures (an object or a place, never
 * a person; walkLines.ts), one a step, with one short line of the history
 * beneath, in order. Now and then, between the steps, one child's name and
 * age, alone on black (walkNames.ts). At the end the walk closes quietly,
 * the candle still burning. There is no score.
 *
 * The candle is the owner's own (her Lux Fidei candle, filmed on black and
 * drawn with mix-blend-mode: screen, so the black falls away).
 *
 * Each step moves the visitor forward over the iron, and the picture fades
 * slowly into the next; a step cannot be hurried; walking on, a step comes
 * every few seconds, time to read its line. The steps are heard as the iron
 * knocking together (footsteps.ts, made with Web Audio), with the quiet
 * ambient recordings under them where the owner has supplied them, all off
 * until the visitor turns them on. With reduced motion nothing moves or
 * fades: the floor is still, the light steady, the candle a still picture,
 * and the walk moves only a step at a time, by button.
 *
 * Every line's and every name's source is in the walk's Sources drawer, by
 * step, never on the screen, with the two works the walk is inspired by.
 */

/** A step's fade; a step can't be taken again until it is done. */
export const STEP_MS = 1800;
/** A step forward over the iron. */
export const MOVE_MS = 1500;
/** The candle, lit: its light grows over the floor. */
export const LIGHT_MS = 2600;
/** Walking on: a step this often, long enough to read a line. */
export const AUTO_MS = 6500;

// REVIEW (Verity): the walk's own words, new with the candle and the iron floor.
export const WALK_INTRO = 'Light a candle, then walk slowly through the history, one step at a time.';
export const WALK_ABOUT =
  'You carry your candle down a dark hall, over a floor of iron faces and empty iron shoes. At the far end, a picture of a place or a thing left behind, and one short line of the history, in the order it happened. Between the steps, now and then, one child’s name. The walk fills the screen. Sound is off until you turn it on.';
export const WALK_BEGIN = 'Your candle is lit. Take a step when you are ready.';
export const WALK_CLOSE = 'You can leave your candle burning.';
// REVIEW (Verity): the sound button, inviting the visitor to hear the iron.
export const WALK_SOUND = 'Hear your steps';

/** The owner's candle: her film of it, and its still. */
export const CANDLE = { mp4: `${WALK_DIR}/candle.mp4`, webm: `${WALK_DIR}/candle.webm`, still: `${WALK_DIR}/candle.jpg` };

/** The two works the walk is inspired by. REVIEW (Verity): wording, and the Danube link (Yad Vashem's article on the memorial). */
export const WALK_INSPIRED_BY = 'The walk is an original piece, inspired by';
export const WALK_INSPIRATION = [
  { label: 'Menashe Kadishman, *Fallen Leaves (Shalekhet)*, Jewish Museum Berlin', href: 'https://www.jmberlin.de/en/shalekhet-fallen-leaves' },
  { label: 'Can Togay and Gyula Pauer, *Shoes on the Danube Bank*, Budapest', href: 'https://www.yadvashem.org/articles/general/shoes-on-the-danube-promenade.html' },
] as const;

export type WalkWords = { kind: 'none' } | { kind: 'end' } | WalkBeat;

/** What the walk shows at step `steps`: nothing before the first step, then each line or name in turn, then the quiet close. */
export function wordsForStep(steps: number): WalkWords {
  if (steps < 1) return { kind: 'none' };
  return beatForStep(steps) ?? { kind: 'end' };
}

/** What is read out at a step. */
const spoken = (w: WalkWords) => (w.kind === 'line' ? w.line.text : w.kind === 'name' ? nameText(w.name) : w.kind === 'end' ? WALK_CLOSE : '');

/** The walk's sources, step by step (each line's, and each name's own), then the works it is inspired by: for the Sources drawer. */
export function walkSourceGroups(): SourceGroup[] {
  const short = (t: string) => (t.length > 60 ? `${t.slice(0, 57).trimEnd()}…` : t.replace(/\.$/, ''));
  return [
    ...WALK_BEATS.map((b, i) => ({
      title: `The walk, step ${i + 1}`,
      items: b.kind === 'line' ? b.line.sources.map((s) => ({ ...s, note: short(b.line.text) })) : [{ ...b.name.source, note: nameText(b.name) }],
    })),
    { title: WALK_INSPIRED_BY, items: WALK_INSPIRATION.map((s) => ({ ...s })) },
  ];
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

/**
 * The owner's candle: her film of it burning (looped, silent), on black,
 * screened so the black falls away; its still under reduced motion, or
 * before it is lit, when only the candle shows, the flame not yet there.
 */
export function Candle({ lit, still = false, className = '' }: { lit: boolean; still?: boolean; className?: string }) {
  const video = useRef<HTMLVideoElement>(null);
  // Some browsers need asking, even for a silent film.
  useEffect(() => {
    const v = video.current;
    if (!v || typeof v.play !== 'function') return;
    try {
      void v.play()?.catch(() => undefined);
    } catch {
      /* the still stands in */
    }
  }, [lit, still]);
  return (
    <span className={`hos-candle${lit ? ' is-lit' : ''} ${className}`} aria-hidden="true">
      {lit && !still ? (
        <video ref={video} autoPlay muted loop playsInline preload="auto" poster={CANDLE.still} disablePictureInPicture tabIndex={-1}>
          <source src={CANDLE.webm} type="video/webm" />
          <source src={CANDLE.mp4} type="video/mp4" />
        </video>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element -- the owner's still of her candle
        <img src={CANDLE.still} alt="" />
      )}
    </span>
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
export function WalkControls({ announcement, enter, light, full, lit, reduced }: Walk) {
  return (
    <div className="hos-walk">
      <p className="hos-intro">{WALK_INTRO}</p>
      <p className="hos-walk-about">{WALK_ABOUT}</p>
      <Candle lit={lit} still={reduced} className="hos-candle-panel" />
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

/**
 * The floor of the hall, on a canvas: the iron faces and shoes, lit by the
 * candle, moving forward a step at a time. It draws only while it moves
 * (a step, or the candle's light growing), and once when the screen
 * changes size; under reduced motion it never moves, only jumps.
 */
function WalkFloor({ steps, reduced }: { steps: number; reduced: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const s = useRef({
    ctx: null as CanvasRenderingContext2D | null,
    view: null as View | null,
    at: 0,
    from: 0,
    to: 0,
    moveT0: -1,
    glow: reduced ? 1 : 0,
    lightT0: -1,
    raf: 0,
  });

  const kick = useCallback(() => {
    const st = s.current;
    if (st.raf) return;
    const frame = (now: number) => {
      st.raf = 0;
      let more = false;
      if (st.moveT0 >= 0) {
        const k = Math.min(1, (now - st.moveT0) / MOVE_MS);
        st.at = st.from + (st.to - st.from) * easeStep(k);
        if (k < 1) more = true;
        else st.moveT0 = -1;
      }
      if (st.lightT0 >= 0) {
        const k = Math.min(1, (now - st.lightT0) / LIGHT_MS);
        st.glow = 1 - Math.pow(1 - k, 2);
        if (k < 1) more = true;
        else st.lightT0 = -1;
      }
      if (st.ctx && st.view) drawFloor(st.ctx, st.view, st.at, st.glow);
      if (more) st.raf = requestAnimationFrame(frame);
    };
    st.raf = requestAnimationFrame(frame);
  }, []);

  // The canvas, sized to the screen (no finer than twice its pixels); the candle's light grows as it is carried in.
  useEffect(() => {
    const c = canvas.current;
    const ctx = c?.getContext('2d') ?? null;
    if (!c || !ctx) return;
    const st = s.current;
    st.ctx = ctx;
    const size = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = c.clientWidth || window.innerWidth;
      const h = c.clientHeight || window.innerHeight;
      c.width = Math.round(w * dpr);
      c.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      st.view = makeView(w, h);
      kick();
    };
    size();
    if (!reduced) {
      st.glow = 0;
      st.lightT0 = performance.now();
    }
    window.addEventListener('resize', size);
    return () => {
      window.removeEventListener('resize', size);
      if (st.raf) cancelAnimationFrame(st.raf);
      st.raf = 0;
    };
  }, [reduced, kick]);

  // A step: forward over the iron, slowly; back to the beginning, at once.
  useEffect(() => {
    const st = s.current;
    const to = steps * STEP;
    if (to === st.to && st.moveT0 < 0 && st.at === to) return;
    if (reduced || to < st.at) {
      st.at = to;
      st.to = to;
      st.moveT0 = -1;
    } else {
      st.from = st.at;
      st.to = to;
      st.moveT0 = performance.now();
    }
    kick();
  }, [steps, reduced, kick]);

  return <canvas ref={canvas} className="hos-walk-floor" aria-hidden="true" />;
}

/** What is projected at a step: a picture, or black (a name, the beginning, the close). */
type Layer = { key: string; beat: WalkBeat | null };
const layerAt = (steps: number): Layer => {
  const b = beatForStep(steps);
  if (b?.kind === 'line') return { key: b.line.id, beat: b };
  if (b?.kind === 'name') return { key: b.name.id, beat: b };
  return { key: steps < 1 ? 'begin' : 'end', beat: null };
};

/** The walk, full screen: the iron floor, the pictures at the far end with a line beneath, a name now and then, the candle carried in front, a few quiet buttons. */
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
  // The step before stays on the wall while this one fades in over it (no fade with reduced motion).
  const layers = [...(reduced || steps < 1 ? [] : [layerAt(steps - 1)]), layerAt(steps)];

  return createPortal(
    <div ref={ref} className={`hos-walk-full${reduced ? ' is-still' : ''}`} data-exhibition="holocaust" role="dialog" aria-modal="true" aria-label="The walk" tabIndex={-1} onKeyDown={onKey}>
      <WalkFloor steps={steps} reduced={reduced} />
      <span className="hos-walk-edges" aria-hidden="true" />

      {/* The far end: the pictures, projected on the wall, in the dark. */}
      <div className="hos-walk-screen">
        <div className="hos-walk-layers">
          {layers.map((l, i) => {
            const current = i === layers.length - 1;
            const kind = l.beat?.kind === 'line' ? '' : l.beat ? ' is-dark' : ' is-blank';
            return (
              <div key={l.key} className={`hos-walk-layer${current ? ' is-current' : ' is-before'}${kind}`} aria-hidden={current ? undefined : true}>
                {l.beat?.kind === 'line' && <WalkPicture line={l.beat.line} file={pictures[l.beat.line.slot]} />}
              </div>
            );
          })}
        </div>
        {words.kind === 'name' && (
          <div className="hos-walk-name" key={words.name.id} data-name={words.name.id} data-step={steps}>
            <p>{nameText(words.name)}</p>
          </div>
        )}
        <span className="hos-walk-flicker" aria-hidden="true" />
      </div>

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

      {/* The candle, carried just in front, and its light on the nearest of the iron. */}
      <span className="hos-walk-light" aria-hidden="true" />
      <Candle lit still={reduced} className="hos-walk-candle" />

      <div className="hos-walk-bar">
        <div className="hos-walk-bar-side">
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
        </div>
        <div className="hos-walk-bar-side">
          <button type="button" className="hos-button hos-button-sound" aria-pressed={sound} onClick={toggleSound}>
            <span aria-hidden="true" className="hos-sound-mark">{sound ? '◉' : '○'}</span> {WALK_SOUND}
          </button>
          <button type="button" className="hos-button hos-walk-leave" onClick={leave}>
            Leave the walk
          </button>
        </div>
      </div>
      {/* Every line's and every name's source, by step, and what the walk is inspired by: the walk's own drawer, at its top left, clear of the steps. */}
      <div className="hos-walk-sources">
        <SourcesDrawer groups={walkSourceGroups()} />
      </div>
      <p className="visually-hidden" role="status" aria-live="polite">{announcement}</p>
    </div>,
    document.body,
  );
}
