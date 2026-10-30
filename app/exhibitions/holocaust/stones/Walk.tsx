'use client';

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import { useDialogFocus } from '@/lib/a11y';
import { usePrefersReducedMotion } from '@/lib/a11y/usePrefersReducedMotion';
import { FactSources } from '@/components/exhibition/FactNote';
import { REMEMBRANCE_LINE } from '../holocaust';
import { makeFootsteps, type Footsteps } from './footsteps';
import { EYE, FAR, HALF_WIDTH, STEP, easeStep, fog, hash2, makeView, project, rowStones, rowsInView } from './walkScene';
import { WALK_LINES, ambientSrc, lineForStep, type Ambient, type WalkLine } from './walkLines';
import WalkPicture from './WalkPicture';

/*
 * The walk: an original piece, inspired by Menashe Kadishman's Fallen
 * Leaves (Shalekhet) at the Jewish Museum Berlin, where visitors walk over
 * the faces that cover the floor and hear them as they go. Here there are
 * no faces and nothing of his: a long path of plain, unnamed stones, each
 * standing for a person, and the visitor walks over them, a step at a
 * time, slowly. Each step is heard, if the visitor turns the sound on
 * (footsteps.ts, made with Web Audio; off until chosen), with a quiet
 * ambient recording under it where the owner has supplied one. There is no
 * score.
 *
 * The walk is taken full screen, dark to the edges: the path below, a
 * picture far ahead (an object or a place, never a person; walkLines.ts),
 * and one short line a step. Poster 1's first sentence comes at step 3;
 * from step 4, the history, in order, each line with its source. After the
 * last line the path simply goes on.
 *
 * A step takes a second and a half, and cannot be hurried; walking on, a
 * step comes every few seconds, time to read its line. With reduced motion
 * the path is still and moves only a step at a time, by button, with no
 * walking on and no fades.
 */

export const STEP_MS = 1500;
/** Walking on: a step this often, long enough to read a line. */
export const AUTO_MS = 6500;
/** After this many steps the poster's line is set beside the path. */
export const LINE_AFTER = 3;

export const KADISHMAN_URL = 'https://www.jmberlin.de/en/shalekhet-fallen-leaves';

/** What the walk shows at step `steps`: nothing yet, the poster's line, or a line of the history. */
export function wordsForStep(steps: number): { kind: 'none' } | { kind: 'poster' } | { kind: 'line'; line: WalkLine } {
  if (steps === LINE_AFTER) return { kind: 'poster' };
  const line = lineForStep(steps, LINE_AFTER);
  return line ? { kind: 'line', line } : { kind: 'none' };
}

const AMBIENT_LEVEL = 0.22;

export function useWalk(ambients: readonly Ambient[] = []) {
  const reduced = usePrefersReducedMotion();
  const [steps, setSteps] = useState(0);
  const [stepAt, setStepAt] = useState<number | null>(null);
  const [walking, setWalking] = useState(false);
  const [sound, setSound] = useState(false);
  const [full, setFull] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const audio = useRef<Footsteps | null>(null);
  const busyUntil = useRef(0);
  const stepsRef = useRef(0);

  const step = useCallback(() => {
    const now = performance.now();
    if (now < busyUntil.current) return false;
    busyUntil.current = now + (reduced ? 300 : STEP_MS);
    const n = stepsRef.current + 1;
    stepsRef.current = n;
    setSteps(n);
    setStepAt(reduced ? null : now);
    audio.current?.step(n % 2 === 0 ? 1 : -1);
    const words = wordsForStep(n);
    if (n === 1) setAnnouncement('You step forward, onto the stones.');
    else if (words.kind === 'poster') setAnnouncement(REMEMBRANCE_LINE);
    else if (words.kind === 'line') setAnnouncement(words.line.text);
    else if (n === LINE_AFTER + WALK_LINES.length + 1) setAnnouncement('The path goes on.');
    return true;
  }, [reduced]);

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
  const lastLine = steps > LINE_AFTER ? lineForStep(Math.min(steps, LINE_AFTER + WALK_LINES.length), LINE_AFTER) : null;
  const part: Ambient = lastLine?.part ?? 'before';
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
  const leave = useCallback(() => {
    setFull(false);
    setWalking(false);
    setAnnouncement('You leave the walk.');
  }, []);

  return { reduced, steps, stepAt, walking, sound, full, words, announcement, step, toggleWalking, toggleSound, stop, enter, leave };
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

/** The path, drawn on one canvas behind the room's title and panel. */
export function WalkScene({ steps, stepAt, reduced, full = false }: Pick<Walk, 'steps' | 'stepAt' | 'reduced'> & { full?: boolean }) {
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
      <p className="hos-walk-about">Each step brings one short line of the history, in the order it happened, and a picture of a place or a thing left behind. The walk fills the screen.</p>
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
  const { reduced, steps, stepAt, walking, sound, words, announcement, step, toggleWalking, toggleSound, leave } = walk;
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

  const line = words.kind === 'line' ? words.line : null;
  // The picture stays with its line, and the last one stays as the path goes on.
  const shownLine = line ?? (steps > LINE_AFTER + WALK_LINES.length ? WALK_LINES[WALK_LINES.length - 1] : null);

  return createPortal(
    <div ref={ref} className={`hos-walk-full${reduced ? ' is-still' : ''}`} data-exhibition="holocaust" role="dialog" aria-modal="true" aria-label="The walk" tabIndex={-1} onKeyDown={onKey}>
      <WalkScene steps={steps} stepAt={stepAt} reduced={reduced} full />
      {shownLine && (
        <div className="hos-walk-ahead" key={shownLine.slot}>
          <WalkPicture line={shownLine} ready={pictures.includes(shownLine.slot)} />
        </div>
      )}
      <span className="hos-walk-edges" aria-hidden="true" />

      <div className="hos-walk-words">
        {steps === 0 && <p className="hos-walk-say is-intro">A path of plain stones. Each one stands for a person. Take a step when you are ready.</p>}
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
        <button ref={stepRef} type="button" className="hos-button hos-button-primary" onClick={step} disabled={walking}>
          Take a step
        </button>
        {!reduced && (
          <button type="button" className="hos-button" aria-pressed={walking} onClick={toggleWalking}>
            {walking ? 'Stop' : 'Walk on slowly'}
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
