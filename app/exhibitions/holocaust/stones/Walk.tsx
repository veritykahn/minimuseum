'use client';

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import { useDialogFocus } from '@/lib/a11y';
import { usePrefersReducedMotion } from '@/lib/a11y/usePrefersReducedMotion';
import { FactSources } from '@/components/exhibition/FactNote';
import { REMEMBRANCE_LINE } from '../holocaust';
import { makeFootsteps, type Footsteps } from './footsteps';
import { EYE, FAR, HALF_WIDTH, STEP, easeStep, fog, hash2, makeView, project, rowStones, rowsInView } from './walkScene';
import { makeMetal } from './metal';
import { NO_SOUNDS, WALK_LINES, lineForStep, type WalkLine, type WalkSounds } from './walkLines';
import WalkPicture from './WalkPicture';

/*
 * The walk: an original piece, inspired by Menashe Kadishman's Fallen
 * Leaves (Shalekhet) at the Jewish Museum Berlin, where visitors walk over
 * the faces that cover the floor and hear them as they go. Here there are
 * no faces and nothing of his: a long path of plain, unnamed stones, each
 * standing for a person, and the visitor walks over them, a step at a
 * time, slowly. The visitor begins it, and it walks on by itself, at a
 * slow, uneven pace, until they stop it. Each step is heard: a clank of
 * metal, and now and then a long rattle over it (metal.ts, from the owner's
 * recordings; footsteps.ts makes a step in the browser until they are in
 * place). Nothing else is heard: no score, no room tone. The sound starts
 * with the walk, from the visitor's own press, and a button turns it off.
 *
 * The walk is taken full screen, dark to the edges: the path below, a
 * picture far ahead (an object or a place, never a person; walkLines.ts),
 * and one short line a step. Poster 1's first sentence comes at step 3;
 * from step 4, the history, in order, each line with its source. After the
 * last line the path simply goes on.
 *
 * A footfall comes every second and a half or so, unevenly, with now and
 * then a pause; a new line comes on a footfall every six and a half
 * seconds or so, time to read it. With reduced motion the path is still
 * and moves only a step at a time, by button (a line and a clank each),
 * with no walking on and no fades.
 */

/** One footfall: the path moves on a stone, and the walker's weight comes down. */
export const STEP_MS = 1000;
/** Walking on: a new line at least this long after the last, long enough to read it. It comes on a footfall. */
export const AUTO_MS = 6500;
/** Walking on: the gap between footfalls, uneven, as a person walks; and now and then a longer one, a hesitation. */
export const GAP_MS: readonly [number, number] = [1150, 1750];
export const HESITATE_MS: readonly [number, number] = [2400, 3400];
export const HESITATE_CHANCE = 0.14;
/** After this many steps the poster's line is set beside the path. */
export const LINE_AFTER = 3;

export const KADISHMAN_URL = 'https://www.jmberlin.de/en/shalekhet-fallen-leaves';

/** What the walk shows at step `steps`: nothing yet, the poster's line, or a line of the history. */
export function wordsForStep(steps: number): { kind: 'none' } | { kind: 'poster' } | { kind: 'line'; line: WalkLine } {
  if (steps === LINE_AFTER) return { kind: 'poster' };
  const line = lineForStep(steps, LINE_AFTER);
  return line ? { kind: 'line', line } : { kind: 'none' };
}

/** How long until the next footfall: mostly an even, slow pace, sometimes a pause. */
export function nextGap(r1 = Math.random(), r2 = Math.random()): number {
  const [lo, hi] = r1 < HESITATE_CHANCE ? HESITATE_MS : GAP_MS;
  return lo + r2 * (hi - lo);
}

export function useWalk(sounds: WalkSounds = NO_SOUNDS) {
  const reduced = usePrefersReducedMotion();
  // `steps` counts the lines reached; `feet`, the footfalls (several to a line when walking on).
  const [steps, setSteps] = useState(0);
  const [feet, setFeet] = useState(0);
  const [footAt, setFootAt] = useState<number | null>(null);
  const [walking, setWalking] = useState(false);
  const [sound, setSound] = useState(false);
  const [full, setFull] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const audio = useRef<Footsteps | null>(null);
  const muted = useRef(false);
  const busyUntil = useRef(0);
  const stepsRef = useRef(0);
  const feetRef = useRef(0);
  const lastLineAt = useRef(0);

  const footfall = useCallback(() => {
    const n = feetRef.current + 1;
    feetRef.current = n;
    setFeet(n);
    setFootAt(reduced ? null : performance.now());
    audio.current?.step(n % 2 === 0 ? 1 : -1);
  }, [reduced]);

  /** A footfall that brings the next line. */
  const step = useCallback(() => {
    const now = performance.now();
    if (now < busyUntil.current) return false;
    busyUntil.current = now + (reduced ? 300 : STEP_MS);
    lastLineAt.current = now;
    const n = stepsRef.current + 1;
    stepsRef.current = n;
    setSteps(n);
    footfall();
    const words = wordsForStep(n);
    if (n === 1) setAnnouncement('You step forward, onto the stones.');
    else if (words.kind === 'poster') setAnnouncement(REMEMBRANCE_LINE);
    else if (words.kind === 'line') setAnnouncement(words.line.text);
    else if (n === LINE_AFTER + WALK_LINES.length + 1) setAnnouncement('The path goes on.');
    return true;
  }, [reduced, footfall]);

  // Walking on: footfalls at a slow, uneven pace, and a new line on the first one after AUTO_MS, until the visitor stops.
  useEffect(() => {
    if (!walking || reduced) return;
    // Starting: the first line comes a while in. Walking on again after a pause: the line already there stays a little.
    lastLineAt.current = performance.now() - (stepsRef.current === 0 ? 0 : AUTO_MS / 2);
    let id: ReturnType<typeof setTimeout>;
    const tick = () => {
      if (performance.now() - lastLineAt.current >= AUTO_MS) step();
      else footfall();
      id = setTimeout(tick, nextGap());
    };
    tick();
    return () => clearTimeout(id);
  }, [walking, reduced, step, footfall]);

  const soundOn = useCallback(() => {
    if (!audio.current) audio.current = makeMetal(sounds.clanks, sounds.rattle) ?? makeFootsteps();
    setSound(!!audio.current);
    return !!audio.current;
  }, [sounds]);
  const soundOff = useCallback(() => {
    audio.current?.close();
    audio.current = null;
    setSound(false);
  }, []);

  const toggleWalking = () => {
    setWalking((w) => !w);
    setAnnouncement(walking ? 'You stop.' : 'You walk on, slowly.');
  };

  const toggleSound = () => {
    if (sound) {
      muted.current = true;
      soundOff();
      setAnnouncement('Sound off.');
      return;
    }
    muted.current = false;
    setAnnouncement(soundOn() ? 'Sound on. Each step is heard.' : 'Sound is not available in this browser.');
  };

  useEffect(() => () => audio.current?.close(), []);

  const stop = useCallback(() => setWalking(false), []);
  // Beginning the walk is the visitor's own press, so the sound can start with it (unless they have turned it off).
  const enter = useCallback(() => {
    setFull(true);
    if (!muted.current) soundOn();
    if (reduced) {
      setAnnouncement('The walk, full screen. Take a step when you are ready. Press Escape to leave it.');
    } else {
      setWalking(true);
      setAnnouncement('The walk, full screen. You walk on, slowly. Press Escape to leave it.');
    }
  }, [reduced, soundOn]);
  const leave = useCallback(() => {
    setFull(false);
    setWalking(false);
    soundOff();
    setAnnouncement('You leave the walk.');
  }, [soundOff]);

  const words = wordsForStep(steps);
  return { reduced, steps, feet, footAt, walking, sound, full, words, announcement, step, toggleWalking, toggleSound, stop, enter, leave };
}

type Walk = ReturnType<typeof useWalk>;

/** The path, drawn on one canvas behind the room's title and panel. */
/** `steps`: how many footfalls the walker has taken; `stepAt`: when the last began (null: standing still). */
export function WalkScene({ steps, stepAt, reduced, full = false }: { steps: number; stepAt: number | null; reduced: boolean; full?: boolean }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    measure();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measure);
      return () => window.removeEventListener('resize', measure);
    }
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const draw = useCallback(
    (now: number) => {
      const canvas = canvasRef.current;
      if (!canvas || !size.w || !size.h) return true;
      const g = canvas.getContext?.('2d');
      if (!g) return true;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      if (canvas.width !== Math.round(size.w * dpr)) canvas.width = Math.round(size.w * dpr);
      if (canvas.height !== Math.round(size.h * dpr)) canvas.height = Math.round(size.h * dpr);
      g.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Where the walker is: between the last step and this one, while it is taken.
      const t = stepAt === null ? 1 : Math.min(1, (now - stepAt) / STEP_MS);
      const at = (steps - 1 + easeStep(t)) * STEP;
      const view = makeView(size.w, size.h, full);
      // The weight of the step: the eye sinks a little as the foot comes down, and rises.
      view.eye = EYE - (stepAt === null ? 0 : Math.sin(Math.PI * Math.min(1, t * 1.25)) * 0.035);

      g.fillStyle = '#060606';
      g.fillRect(0, 0, size.w, size.h);
      // The bed the stones are laid in: a little less dark than the dark beside it.
      const near = project(view, 0, 1.2);
      if (near) {
        const bed = g.createLinearGradient(0, view.horizon, 0, size.h);
        bed.addColorStop(0, '#080808');
        bed.addColorStop(1, '#141312');
        const l0 = project(view, -HALF_WIDTH * 1.04, FAR);
        const r0 = project(view, HALF_WIDTH * 1.04, FAR);
        const l1 = project(view, -HALF_WIDTH * 1.04, 1.2);
        const r1 = project(view, HALF_WIDTH * 1.04, 1.2);
        if (l0 && r0 && l1 && r1) {
          g.fillStyle = bed;
          g.beginPath();
          g.moveTo(l0[0], l0[1]);
          g.lineTo(r0[0], r0[1]);
          g.lineTo(r1[0], r1[1]);
          g.lineTo(l1[0], l1[1]);
          g.closePath();
          g.fill();
        }
      }
      const grain = grainPattern(g);

      for (const row of rowsInView(Math.max(0, at))) {
        for (const s of rowStones(row)) {
          const dz = s.z - at;
          const ground: [number, number][] = [];
          const top: [number, number][] = [];
          let ok = true;
          for (const [ox, oz] of s.outline) {
            const a = project(view, s.x + ox, dz + oz);
            const b = project(view, s.x + ox, dz + oz, s.rise);
            if (!a || !b) {
              ok = false;
              break;
            }
            ground.push(a);
            top.push(b);
          }
          if (!ok) continue;
          if (top.every(([, y]) => y > size.h + 4)) continue;
          const f = fog(dz);
          // Its grey: dark as iron to pale as limestone, then lost in the dark with distance.
          const base = 58 + s.tone * 70;
          const lit = base * (1 - f * 0.92) + 6 * f;
          const shade = (v: number, k: number) => Math.round(v * k);
          // Its near side, in shadow; then its face, a little lit from ahead.
          trace(g, ground);
          g.fillStyle = `rgb(${shade(lit, 0.32)},${shade(lit, 0.31)},${shade(lit, 0.3)})`;
          g.fill();
          // Its face: lit from ahead, so its far edge is a little lighter than its near one.
          let y0 = Infinity;
          let y1 = -Infinity;
          for (const [, y] of top) {
            y0 = Math.min(y0, y);
            y1 = Math.max(y1, y);
          }
          const face = g.createLinearGradient(0, y0, 0, y1);
          face.addColorStop(0, `rgb(${shade(lit, 0.98)},${shade(lit, 0.96)},${shade(lit, 0.92)})`);
          face.addColorStop(1, `rgb(${shade(lit, 0.7)},${shade(lit, 0.68)},${shade(lit, 0.66)})`);
          trace(g, top);
          g.fillStyle = face;
          g.fill();
          // The grain of the stone, on the nearer ones.
          if (dz < 12 && grain) {
            g.save();
            g.clip();
            g.globalAlpha = 0.5 * (1 - f);
            g.fillStyle = grain;
            g.fillRect(Math.min(...top.map(([x]) => x)), y0, Math.max(...top.map(([x]) => x)) - Math.min(...top.map(([x]) => x)), y1 - y0);
            g.restore();
          }
        }
      }
      return t >= 1;
    },
    [size, steps, stepAt, full],
  );

  useEffect(() => {
    if (reduced || stepAt === null) {
      draw(Infinity);
      return;
    }
    let raf = 0;
    const frame = (now: number) => {
      if (!draw(now)) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [draw, reduced, stepAt]);

  return (
    <div className={`hos-scene hos-walk-scene${full ? ' is-full' : ''}`} ref={wrapRef} aria-hidden="true">
      <canvas ref={canvasRef} className="hos-walk-canvas" />
      <span className="hos-walk-glow" />
      <span className="hos-walk-vignette" />
    </div>
  );
}

/** A tile of fine speckle, laid over the nearer stones as their grain (made once). */
let grainTile: HTMLCanvasElement | null = null;
function grainPattern(g: CanvasRenderingContext2D): CanvasPattern | null {
  if (!grainTile) {
    const tile = document.createElement('canvas');
    tile.width = tile.height = 128;
    const t = tile.getContext('2d');
    if (!t) return null;
    for (let i = 0; i < 1400; i++) {
      t.fillStyle = hash2(i, 1) > 0.5 ? `rgba(255,248,236,${0.05 + hash2(i, 2) * 0.12})` : `rgba(0,0,0,${0.08 + hash2(i, 3) * 0.2})`;
      t.fillRect(hash2(i, 4) * 128, hash2(i, 5) * 128, 0.6 + hash2(i, 6) * 1.2, 0.6 + hash2(i, 7) * 1.2);
    }
    grainTile = tile;
  }
  return g.createPattern(grainTile, 'repeat');
}

function trace(g: CanvasRenderingContext2D, pts: [number, number][]) {
  g.beginPath();
  const mid = (a: [number, number], b: [number, number]) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2] as const;
  const n = pts.length;
  const m0 = mid(pts[n - 1], pts[0]);
  g.moveTo(m0[0], m0[1]);
  for (let j = 0; j < n; j++) {
    const m = mid(pts[j], pts[(j + 1) % n]);
    g.quadraticCurveTo(pts[j][0], pts[j][1], m[0], m[1]);
  }
  g.closePath();
}

function Credit() {
  return (
    <p className="hos-walk-credit">
      Inspired by Menashe Kadishman’s{' '}
      <a href={KADISHMAN_URL} target="_blank" rel="noopener noreferrer">
        <i>Fallen Leaves</i> (<i>Shalekhet</i>)
      </a>{' '}
      at the Jewish Museum Berlin
    </p>
  );
}

/** The walk's place in the room's panel: what it is, and the way in. */
export function WalkControls({ announcement, enter, full }: Walk) {
  return (
    <div className="hos-walk">
      <p className="hos-intro">A path of plain stones. Each one stands for a person. Walk over them slowly.</p>
      <p className="hos-walk-about">Every few steps brings one short line of the history, in the order it happened, and a picture of a place or a thing left behind. The walk fills the screen and moves on by itself, slowly; each step is heard, and you can pause it or turn the sound off at any time.</p>
      <button type="button" className="hos-button hos-button-primary" onClick={enter} aria-expanded={full}>
        Begin the walk
      </button>
      <Credit />
      <p className="visually-hidden" role="status" aria-live="polite">{full ? '' : announcement}</p>
    </div>
  );
}

/** The walk, full screen: the path, a picture far ahead, one line a step, and a few quiet buttons. */
export function WalkFull({ walk, pictures }: { walk: Walk; pictures: readonly string[] }) {
  const { reduced, steps, feet, footAt, walking, sound, words, announcement, step, toggleWalking, toggleSound, leave } = walk;
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
    if (reduced && (e.key === 'ArrowUp' || e.key === 'ArrowRight' || e.key === 'PageDown') && !(e.target instanceof HTMLInputElement)) {
      e.preventDefault();
      step();
    }
  };

  const line = words.kind === 'line' ? words.line : null;
  // The picture stays with its line, and the last one stays as the path goes on.
  const shownLine = line ?? (steps > LINE_AFTER + WALK_LINES.length ? WALK_LINES[WALK_LINES.length - 1] : null);

  return createPortal(
    <div ref={ref} className={`hos-walk-full${reduced ? ' is-still' : ''}`} data-exhibition="holocaust" role="dialog" aria-modal="true" aria-label="The walk" tabIndex={-1} onKeyDown={onKey}>
      <WalkScene steps={feet} stepAt={footAt} reduced={reduced} full />
      {shownLine && (
        <div className="hos-walk-ahead" key={shownLine.slot}>
          <WalkPicture line={shownLine} ready={pictures.includes(shownLine.slot)} />
        </div>
      )}
      <span className="hos-walk-edges" aria-hidden="true" />

      <div className="hos-walk-words">
        {steps === 0 && <p className="hos-walk-say is-intro">A path of plain stones. Each one stands for a person. {reduced ? 'Take a step when you are ready.' : 'You walk over them, slowly.'}</p>}
        {words.kind === 'poster' && (
          <p className="hos-walk-say" key="poster">
            {REMEMBRANCE_LINE}
          </p>
        )}
        {line && (
          <div className="hos-walk-say-wrap" key={line.id} data-line={line.id}>
            <p className="hos-walk-say">{line.text}</p>
            <FactSources sources={line.sources} className="hos-walk-source" />
          </div>
        )}
      </div>

      <div className="hos-walk-bar">
        {reduced ? (
          <button ref={stepRef} type="button" className="hos-button hos-button-primary" onClick={step}>
            Take a step
          </button>
        ) : (
          <button ref={stepRef} type="button" className="hos-button hos-button-primary" onClick={toggleWalking}>
            {walking ? 'Pause' : 'Walk on'}
          </button>
        )}
        <button type="button" className="hos-button hos-button-sound" aria-pressed={sound} onClick={toggleSound}>
          <span aria-hidden="true" className="hos-sound-mark">{sound ? '◉' : '○'}</span> Sound: {sound ? 'on' : 'off'}
        </button>
        <button type="button" className="hos-button hos-walk-leave" onClick={leave}>
          Leave the walk
        </button>
      </div>
      <p className="visually-hidden" role="status" aria-live="polite">{announcement}</p>
    </div>,
    document.body,
  );
}
