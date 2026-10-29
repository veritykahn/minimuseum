'use client';

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { usePrefersReducedMotion } from '@/lib/a11y/usePrefersReducedMotion';
import { REMEMBRANCE_LINE } from '../holocaust';
import { makeFootsteps, type Footsteps } from './footsteps';
import { EYE, FAR, HALF_WIDTH, STEP, easeStep, fog, hash2, makeView, project, rowStones, rowsInView } from './walkScene';

/*
 * The walk: an original piece, inspired by Menashe Kadishman's Fallen
 * Leaves (Shalekhet) at the Jewish Museum Berlin, where visitors walk over
 * the faces that cover the floor and hear them as they go. Here there are
 * no faces and nothing of his: a long path of plain, unnamed stones, each
 * standing for a person, and the visitor walks over them, a step at a
 * time, slowly. Each step is heard, if the visitor turns the sound on
 * (footsteps.ts, made with Web Audio; off until chosen). There is no score
 * and no end. After a few steps, poster 1's first sentence is set beside
 * the path.
 *
 * A step takes a second and a half, and cannot be hurried. With reduced
 * motion the path is still and moves only a step at a time, by button,
 * with no walking on.
 */

export const STEP_MS = 1500;
const AUTO_MS = 2600;
/** After this many steps the poster's line is set beside the path. */
export const LINE_AFTER = 3;

export const KADISHMAN_URL = 'https://www.jmberlin.de/en/shalekhet-fallen-leaves';

export function useWalk() {
  const reduced = usePrefersReducedMotion();
  const [steps, setSteps] = useState(0);
  const [stepAt, setStepAt] = useState<number | null>(null);
  const [walking, setWalking] = useState(false);
  const [sound, setSound] = useState(false);
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
    if (n === 1) setAnnouncement('You step forward, onto the stones.');
    else if (n === LINE_AFTER) setAnnouncement(REMEMBRANCE_LINE);
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

  const stop = useCallback(() => setWalking(false), []);

  return { reduced, steps, stepAt, walking, sound, announcement, step, toggleWalking, toggleSound, stop };
}

type Walk = ReturnType<typeof useWalk>;

/** The path, drawn on one canvas behind the room's title and panel. */
export function WalkScene({ steps, stepAt, reduced }: Pick<Walk, 'steps' | 'stepAt' | 'reduced'>) {
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
      const view = makeView(size.w, size.h);
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
    [size, steps, stepAt],
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
    <div className="hos-scene hos-walk-scene" ref={wrapRef} aria-hidden="true">
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

/** The walk's words and buttons, in the room's panel. */
export function WalkControls({ reduced, steps, walking, sound, announcement, step, toggleWalking, toggleSound }: Walk) {
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowUp' && !(e.target instanceof HTMLInputElement)) {
      e.preventDefault();
      step();
    }
  };
  return (
    <div className="hos-walk" onKeyDown={onKey}>
      <p className="hos-intro">A path of plain stones. Each one stands for a person. Walk over them slowly.</p>
      <p className={`hos-walk-line${steps >= LINE_AFTER ? ' is-shown' : ''}`} aria-hidden={steps >= LINE_AFTER ? undefined : true}>
        {REMEMBRANCE_LINE}
      </p>
      <div className="hos-walk-buttons">
        <button type="button" className="hos-button hos-button-primary" onClick={step} disabled={walking}>
          Take a step
        </button>
        {!reduced && (
          <button type="button" className="hos-button" aria-pressed={walking} onClick={toggleWalking}>
            {walking ? 'Stop' : 'Walk on slowly'}
          </button>
        )}
        <button type="button" className="hos-button hos-button-sound" aria-pressed={sound} onClick={toggleSound}>
          <span aria-hidden="true" className="hos-sound-mark">{sound ? '◉' : '○'}</span> Sound of the steps: {sound ? 'on' : 'off'}
        </button>
      </div>
      <p className="hos-walk-credit">
        Inspired by Menashe Kadishman’s{' '}
        <a href={KADISHMAN_URL} target="_blank" rel="noopener noreferrer">
          <i>Fallen Leaves</i> (<i>Shalekhet</i>)
        </a>{' '}
        at the Jewish Museum Berlin
      </p>
      <p className="visually-hidden" role="status" aria-live="polite">{announcement}</p>
    </div>
  );
}
