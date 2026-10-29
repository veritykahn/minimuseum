'use client';

import { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent, type Ref } from 'react';
import { makeSlide, type Grain, type SampleId } from './grains';
import type { Slide } from './slides';
import { freshState, releaseCloth, wipeStep, type Cloth, type SlideState } from './wipe';

/*
 * The view down the microscope: one canvas, the slide's photograph
 * (slides.ts) magnified by the power, with a little loose dust drawn on top
 * (grains.ts). Side by side, the Moon's slide lies left of a line you can
 * drag and an Earth slide right of it. Drag across the slide to wipe the
 * dust with a cloth (wipe.ts). The focus is a blur on the canvas, set by the
 * knob outside.
 */

/** How much each power magnifies, low to high. */
export const POWERS = [1, 2.2, 4.5] as const;

export type WipeReport = { moon: number; earth: number };

export type EyepieceHandle = {
  /** Draw the cloth across the middle of the slide (the button, for keyboards). */
  sweep: () => void;
  /** Fresh slides and a clean cloth. */
  reset: () => void;
};

const SAMPLES: SampleId[] = ['moon', 'wind', 'water', 'life'];
const ease = (t: number) => 1 - Math.pow(1 - t, 3);
/** Which dust lies on a slide: the Moon's, or the Earth sample's. */
const dustOf = (slide: Slide): SampleId => (slide.id.startsWith('moon-') ? 'moon' : (slide.id.slice(6) as SampleId));

/* The photographs, loaded once and kept. */
const photos = new Map<string, HTMLImageElement>();
function photo(src: string, onLoad: () => void): HTMLImageElement | null {
  let img = photos.get(src);
  if (!img) {
    if (typeof Image === 'undefined') return null;
    img = new Image();
    img.decoding = 'async';
    img.src = src;
    photos.set(src, img);
  }
  if (img.complete && img.naturalWidth > 0) return img;
  img.addEventListener('load', onLoad, { once: true });
  return null;
}

/* Each grain's outline, built once at unit size. */
const outlines = new WeakMap<Grain, Path2D>();
function outline(g: Grain): Path2D {
  let p = outlines.get(g);
  if (p) return p;
  p = new Path2D();
  const n = g.shape.length;
  g.shape.forEach((m, i) => {
    const a = (i / n) * Math.PI * 2;
    if (i === 0) p!.moveTo(Math.cos(a) * m, Math.sin(a) * m);
    else p!.lineTo(Math.cos(a) * m, Math.sin(a) * m);
  });
  p.closePath();
  outlines.set(g, p);
  return p;
}

const hsl = (h: number, s: number, l: number, a = 1) => `hsla(${h}, ${s}%, ${Math.max(0, Math.min(100, l))}%, ${a})`;

function drawGrain(ctx: CanvasRenderingContext2D, g: Grain, sample: SampleId, sr: number) {
  if (g.kind === 'speck') {
    ctx.fillStyle = hsl(g.h, g.s, g.l, 0.8);
    const w = Math.max(0.8, sr * 1.6);
    ctx.fillRect(-w / 2, -w / 2, w, w);
    return;
  }
  ctx.scale(sr, sr);
  const px = 1 / sr;

  const path = outline(g);
  // The shadow the grain casts on the glass.
  ctx.translate(0.1, 0.14);
  ctx.fillStyle = 'rgba(6, 4, 16, 0.5)';
  ctx.fill(path);
  ctx.translate(-0.1, -0.14);

  const lit = ctx.createLinearGradient(-1, -1, 1, 1);
  const shine = 12;
  lit.addColorStop(0, hsl(g.h, g.s, g.l + shine));
  lit.addColorStop(0.55, hsl(g.h, g.s, g.l));
  lit.addColorStop(1, hsl(g.h, g.s, g.l - 18));
  ctx.fillStyle = lit;
  ctx.fill(path);

  if (sample === 'moon') {
    // Broken faces, and a hard dark edge.
    if (sr > 5) {
      const n = g.shape.length;
      ctx.strokeStyle = hsl(g.h, g.s, g.l + 22, 0.35);
      ctx.lineWidth = 0.9 * px;
      ctx.beginPath();
      for (let k = 0; k < Math.min(3, n - 2); k++) {
        const a1 = (k * 2 * Math.PI * 2) / n;
        const a2 = ((k * 2 + 3) * Math.PI * 2) / n;
        ctx.moveTo(Math.cos(a1) * g.shape[(k * 2) % n] * 0.95, Math.sin(a1) * g.shape[(k * 2) % n] * 0.95);
        ctx.lineTo(Math.cos(a2) * g.shape[(k * 2 + 3) % n] * 0.4, Math.sin(a2) * g.shape[(k * 2 + 3) % n] * 0.4);
      }
      ctx.stroke();
    }
    if (sr > 14) {
      ctx.fillStyle = hsl(g.h, g.s, g.l - 22, 0.5);
      for (const m of g.marks) {
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.strokeStyle = 'rgba(20, 16, 12, 0.4)';
    ctx.lineWidth = 0.8 * px;
    ctx.stroke(path);
  } else {
    ctx.strokeStyle = hsl(g.h, g.s, g.l - 20, 0.35);
    ctx.lineWidth = 0.8 * px;
    ctx.stroke(path);
  }
}

export default function Eyepiece({
  left,
  right,
  power,
  blur,
  reduced,
  label,
  rightLabel,
  onWiped,
  ref,
}: {
  left: Slide;
  /** An Earth slide beside the Moon's, side by side. */
  right: Slide | null;
  power: number;
  /** The focus: how far out of focus, in CSS px of blur. */
  blur: number;
  reduced: boolean;
  /** What the canvas shows, for a screen reader. */
  label: string;
  rightLabel?: string;
  onWiped: (r: WipeReport) => void;
  ref?: Ref<EyepieceHandle>;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const slides = useMemo(() => Object.fromEntries(SAMPLES.map((id) => [id, makeSlide(id)])) as Record<SampleId, Grain[]>, []);
  const states = useRef<Record<SampleId, SlideState> | null>(null);
  if (!states.current) states.current = Object.fromEntries(SAMPLES.map((id) => [id, freshState(slides[id])])) as Record<SampleId, SlideState>;

  const [size, setSize] = useState(0);
  const [split, setSplit] = useState(0.5);
  const cloth = useRef<(Cloth & { on: boolean }) | null>(null);
  const dirt = useRef(0);
  const report = useRef<WipeReport>({ moon: 0, earth: 0 });
  const enter = useRef<{ left: number; right: number }>({ left: 0, right: 0 });
  const frame = useRef(0);
  const live = useRef({ left, right, power, split, reduced, size });
  live.current = { left, right, power, split, reduced, size };

  // The canvas follows the eyepiece's size.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => setSize(Math.round(el.clientWidth));
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const scheduleRef = useRef<() => void>(() => {});
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const { left: l, right: r, power: p, split: sp, size: W } = live.current;
    const ctx = W > 0 ? canvas?.getContext?.('2d') : null;
    if (!canvas || !ctx) return false;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    if (canvas.width !== Math.round(W * dpr)) {
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(W * dpr);
    }
    const R = W / 2;
    const scale = POWERS[p] * R;
    const now = performance.now();
    let animating = false;
    const slideIn = (t0: number) => {
      if (!t0 || live.current.reduced) return 0;
      const t = (now - t0) / 650;
      if (t >= 1) return 0;
      animating = true;
      return (1 - ease(t)) * W * 1.05;
    };

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, W);
    // The lamp under the slide.
    const lamp = ctx.createRadialGradient(R * 0.85, R * 0.8, 0, R, R, R * 1.05);
    lamp.addColorStop(0, '#4a3c7e');
    lamp.addColorStop(0.55, '#2c2352');
    lamp.addColorStop(1, '#120d24');
    ctx.fillStyle = lamp;
    ctx.fillRect(0, 0, W, W);

    const c = cloth.current;
    const stuckOnTop: { id: SampleId; i: number; off: number }[] = [];

    const drawSlide = (slide: Slide, x0: number, x1: number, off: number) => {
      const id = dustOf(slide);
      const grains = slides[id];
      const st = states.current![id];
      ctx.save();
      ctx.beginPath();
      ctx.rect(x0, 0, x1 - x0, W);
      ctx.clip();
      ctx.translate(R + off, R);
      // The photograph fills the disc at the lowest power; higher powers look closer at its middle.
      const img = photo(slide.src, () => scheduleRef.current());
      if (img) ctx.drawImage(img, -scale, -scale, scale * 2, scale * 2);
      for (let i = 0; i < grains.length; i++) {
        const g = grains[i];
        if (st.stuck[i]) {
          stuckOnTop.push({ id, i, off });
          continue;
        }
        const sr = g.r * scale;
        const sx = st.x[i] * scale;
        const sy = st.y[i] * scale;
        if (sx + off + R < x0 - sr * 1.3 || sx + off + R > x1 + sr * 1.3 || Math.abs(sy) > R + sr * 1.3) continue;
        ctx.save();
        ctx.translate(sx, sy);
        ctx.rotate(g.rot);
        drawGrain(ctx, g, id, sr);
        ctx.restore();
      }
      ctx.restore();
    };

    if (r) {
      const sx = sp * W;
      drawSlide(l, 0, sx, slideIn(enter.current.left) * -1);
      drawSlide(r, sx, W, slideIn(enter.current.right));
    } else {
      drawSlide(l, 0, W, slideIn(enter.current.left));
    }

    // The cloth, a round of white suit cloth that grays as dust clings to it.
    if (c?.on) {
      const cx = R + c.x * scale;
      const cy = R + c.y * scale;
      const cr = c.r * scale;
      const d = dirt.current;
      const tone = Math.round(243 - d * 110);
      const g = ctx.createRadialGradient(cx - cr * 0.3, cy - cr * 0.3, 0, cx, cy, cr);
      g.addColorStop(0, `rgba(${tone + 8}, ${tone + 4}, ${Math.min(255, tone + 14)}, 0.62)`);
      g.addColorStop(1, `rgba(${tone - 30}, ${tone - 34}, ${tone - 18}, 0.62)`);
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, cr, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
      ctx.clip();
      // The weave.
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
      ctx.lineWidth = 1;
      for (let k = -cr; k < cr; k += 4) {
        ctx.beginPath();
        ctx.moveTo(cx + k, cy - cr);
        ctx.lineTo(cx + k, cy + cr);
        ctx.moveTo(cx - cr, cy + k);
        ctx.lineTo(cx + cr, cy + k);
        ctx.stroke();
      }
      ctx.restore();
      ctx.beginPath();
      ctx.arc(cx, cy, cr, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(243, 240, 250, 0.7)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
    // Dust stuck to the cloth, on top of it.
    for (const { id, i, off } of stuckOnTop) {
      const g = slides[id][i];
      const st = states.current![id];
      ctx.save();
      ctx.translate(R + off + st.x[i] * scale, R + st.y[i] * scale);
      ctx.rotate(g.rot);
      drawGrain(ctx, g, id, g.r * scale);
      ctx.restore();
    }

    if (r) {
      // The dividing line.
      const sx = sp * W;
      ctx.fillStyle = 'rgba(243, 240, 250, 0.9)';
      ctx.fillRect(sx - 1, 0, 2, W);
    }
    return animating;
  }, [slides]);

  const schedule = useCallback(() => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(function tick() {
      if (draw()) frame.current = requestAnimationFrame(tick);
    });
  }, [draw]);
  scheduleRef.current = schedule;

  // A new slide slides in from the side.
  const prev = useRef({ left, right });
  useEffect(() => {
    const now = performance.now();
    if (prev.current.left !== left) enter.current.left = now;
    if (prev.current.right !== right && right) enter.current.right = now;
    prev.current = { left, right };
    schedule();
  }, [left, right, power, split, size, schedule]);
  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  // ───── Wiping ─────
  const toSlide = (clientX: number, clientY: number) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const R = rect.width / 2;
    const scale = POWERS[live.current.power] * R;
    return { x: (clientX - rect.left - R) / scale, y: (clientY - rect.top - R) / scale };
  };

  const clothRadius = () => {
    const W = live.current.size || 300;
    return Math.min(52, W * 0.11) / (POWERS[live.current.power] * (W / 2));
  };

  const moveCloth = useCallback((x: number, y: number) => {
    const c = cloth.current;
    if (!c) return;
    c.vx = x - c.x;
    c.vy = y - c.y;
    // Long moves go in short steps, so nothing is skipped over.
    const steps = Math.max(1, Math.ceil(Math.hypot(c.vx, c.vy) / (c.r * 0.4)));
    const { left: lSlide, right: rSlide, split: sp, size: W, power: p } = live.current;
    const l = dustOf(lSlide);
    const r = rSlide && dustOf(rSlide);
    const splitX = r ? ((sp * W - W / 2) / (POWERS[p] * (W / 2))) : Infinity;
    const x0 = c.x;
    const y0 = c.y;
    for (let k = 1; k <= steps; k++) {
      c.x = x0 + (c.vx * k) / steps;
      c.y = y0 + (c.vy * k) / steps;
      const step = { ...c, vx: c.vx / steps, vy: c.vy / steps };
      const n1 = wipeStep(slides[l], states.current![l], step, l === 'moon', (gx) => gx < splitX);
      if (l === 'moon') {
        report.current.moon += n1;
        dirt.current = Math.min(1, dirt.current + n1 * 0.006);
      } else report.current.earth += n1;
      if (r) report.current.earth += wipeStep(slides[r], states.current![r], step, false, (gx) => gx >= splitX);
    }
  }, [slides]);

  const startCloth = (x: number, y: number) => {
    report.current = { moon: 0, earth: 0 };
    cloth.current = { x, y, vx: 0, vy: 0, r: clothRadius(), on: true };
  };
  const endCloth = useCallback(() => {
    if (!cloth.current) return;
    cloth.current = null;
    for (const id of SAMPLES) releaseCloth(states.current![id]);
    schedule();
    onWiped(report.current);
  }, [onWiped, schedule]);

  const onPointerDown = (e: PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const p = toSlide(e.clientX, e.clientY);
    startCloth(p.x, p.y);
    moveCloth(p.x, p.y);
    schedule();
  };
  const onPointerMove = (e: PointerEvent<HTMLCanvasElement>) => {
    if (!cloth.current) return;
    const p = toSlide(e.clientX, e.clientY);
    moveCloth(p.x, p.y);
    schedule();
  };

  // The sweep for the button: across the middle and back, a little lower.
  const sweeping = useRef(0);
  useImperativeHandle(ref, () => ({
    sweep() {
      cancelAnimationFrame(sweeping.current);
      const span = 0.85 / POWERS[live.current.power];
      const at = (t: number) => {
        const there = t < 0.5;
        const u = there ? t * 2 : (t - 0.5) * 2;
        return { x: (there ? -1 + 2 * u : 1 - 2 * u) * span, y: (there ? -0.18 : 0.22) * span + Math.sin(u * Math.PI * 3) * 0.06 * span };
      };
      const p0 = at(0);
      startCloth(p0.x, p0.y);
      if (live.current.reduced) {
        for (let k = 1; k <= 80; k++) {
          const p = at(k / 80);
          moveCloth(p.x, p.y);
        }
        endCloth();
        return;
      }
      const t0 = performance.now();
      const tick = () => {
        const t = Math.min(1, (performance.now() - t0) / 1600);
        const p = at(t);
        moveCloth(p.x, p.y);
        draw();
        if (t < 1) sweeping.current = requestAnimationFrame(tick);
        else endCloth();
      };
      sweeping.current = requestAnimationFrame(tick);
    },
    reset() {
      cancelAnimationFrame(sweeping.current);
      cloth.current = null;
      dirt.current = 0;
      states.current = Object.fromEntries(SAMPLES.map((id) => [id, freshState(slides[id])])) as Record<SampleId, SlideState>;
      schedule();
    },
  }));
  useEffect(() => () => cancelAnimationFrame(sweeping.current), []);

  // ───── The dividing line, side by side ─────
  const dragSplit = useRef(false);
  const onSplitKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const d = e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? -0.05 : e.key === 'ArrowRight' || e.key === 'ArrowUp' ? 0.05 : 0;
    if (!d) return;
    e.preventDefault();
    setSplit((s) => Math.max(0.1, Math.min(0.9, s + d)));
  };
  const onSplitMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragSplit.current) return;
    const rect = wrapRef.current!.getBoundingClientRect();
    setSplit(Math.max(0.1, Math.min(0.9, (e.clientX - rect.left) / rect.width)));
  };

  return (
    <div ref={wrapRef} className="mo-ms-eyepiece" style={{ ['--split' as string]: String(split) }}>
      <canvas
        ref={canvasRef}
        className="mo-ms-canvas"
        role="img"
        aria-label={label}
        style={{ filter: blur > 0.2 ? `blur(${blur.toFixed(1)}px)` : 'none' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endCloth}
        onPointerCancel={endCloth}
      />
      {/* The glass: the reticle, the dark rim, a glint on the lens. */}
      <svg className="mo-ms-reticle" viewBox="0 0 200 200" aria-hidden="true">
        <line x1="100" y1="16" x2="100" y2="184" />
        <line x1="16" y1="100" x2="184" y2="100" />
        {Array.from({ length: 17 }, (_, i) => (
          <line key={i} x1={36 + i * 8} y1="97" x2={36 + i * 8} y2={i % 4 === 0 ? 92 : 95} />
        ))}
      </svg>
      <span className="mo-ms-vignette" aria-hidden="true" />
      {right && (
        <>
          <span className="mo-ms-side mo-ms-side-left" aria-hidden="true">Moon</span>
          <span className="mo-ms-side mo-ms-side-right" aria-hidden="true">{rightLabel}</span>
          <div
            className="mo-ms-split"
            role="slider"
            tabIndex={0}
            aria-label="Move the dividing line"
            aria-valuemin={10}
            aria-valuemax={90}
            aria-valuenow={Math.round(split * 100)}
            aria-valuetext={`${Math.round(split * 100)}% Moon`}
            onKeyDown={onSplitKey}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              dragSplit.current = true;
            }}
            onPointerMove={onSplitMove}
            onPointerUp={() => (dragSplit.current = false)}
            onPointerCancel={() => (dragSplit.current = false)}
          >
            <span className="mo-ms-split-grip" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M9 6 3 12l6 6M15 6l6 6-6 6" />
              </svg>
            </span>
          </div>
        </>
      )}
    </div>
  );
}
