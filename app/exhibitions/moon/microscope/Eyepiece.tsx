'use client';

import { useCallback, useEffect, useImperativeHandle, useRef, useState, type KeyboardEvent, type PointerEvent, type Ref } from 'react';
import type { Slide, SlideId } from './slides';
import { brushAside, newBrush, newMask, smear, type Brush, type Limit, type Pixels } from './wipe';

/*
 * The view down the microscope: one canvas, the slide's photograph
 * (slides.ts) magnified by the power. Side by side, the Moon's slide lies
 * left of a line you can drag and an Earth slide right of it. Drag across
 * the slide to wipe it with a cloth: the wipe works on a copy of the
 * photograph's own pixels (wipe.ts), kept until a fresh slide. The focus is
 * a blur on the canvas, set by the knob outside.
 */

/** How much each power magnifies, low to high: no more than the photographs hold sharp. */
export const POWERS = [1, 1.8, 3] as const;

/** How much dust clung to the cloth on a wipe (0 to 1), and how much Earth sand it pushed aside. */
export type WipeReport = { moon: number; earth: number };

export type EyepieceHandle = {
  /** Draw the cloth across the middle of the slide (the button, for keyboards). */
  sweep: () => void;
  /** Fresh slides and a clean cloth. */
  reset: () => void;
};

const ease = (t: number) => 1 - Math.pow(1 - t, 3);
const isMoon = (slide: Slide) => slide.id.startsWith('moon-');

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

/** A wiped slide: a copy of its photograph's pixels, how clear its glass is (Earth's), and a canvas to show them. */
type Worked = { px: Pixels; mask: Uint8Array; canvas: HTMLCanvasElement; dirty: [number, number, number, number] | null };

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
  const worked = useRef(new Map<SlideId, Worked>());
  const [wiped, setWiped] = useState<SlideId[]>([]);

  const [size, setSize] = useState(0);
  const [split, setSplit] = useState(0.5);
  /** The cloth on the slide, in screen px from the eyepiece's middle, and what it carries. */
  const cloth = useRef<{ x: number; y: number; brush: Brush | null } | null>(null);
  const report = useRef({ earth: 0 });
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

  /** The wiped copy of a slide, made on its first wipe; null until its photograph has loaded. */
  const work = (slide: Slide): Worked | null => {
    const have = worked.current.get(slide.id);
    if (have) return have;
    const img = photo(slide.src, () => scheduleRef.current());
    if (!img) return null;
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0);
    const px = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const w: Worked = { px, mask: newMask(px), canvas, dirty: null };
    worked.current.set(slide.id, w);
    setWiped((ids) => [...ids, slide.id]);
    return w;
  };

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
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.clearRect(0, 0, W, W);
    // The lamp under the slide.
    const lamp = ctx.createRadialGradient(R * 0.85, R * 0.8, 0, R, R, R * 1.05);
    lamp.addColorStop(0, '#4a3c7e');
    lamp.addColorStop(0.55, '#2c2352');
    lamp.addColorStop(1, '#120d24');
    ctx.fillStyle = lamp;
    ctx.fillRect(0, 0, W, W);

    const drawSlide = (slide: Slide, x0: number, x1: number, off: number) => {
      ctx.save();
      ctx.beginPath();
      ctx.rect(x0, 0, x1 - x0, W);
      ctx.clip();
      // The photograph fills the disc at the lowest power; higher powers look closer at its middle.
      // Once wiped, the wiped copy stands in for it.
      const w = worked.current.get(slide.id);
      if (w?.dirty) {
        const [dx, dy, dw, dh] = w.dirty;
        w.canvas.getContext('2d')?.putImageData(w.px as ImageData, 0, 0, dx, dy, dw, dh);
        w.dirty = null;
      }
      const src = w?.canvas ?? photo(slide.src, () => scheduleRef.current());
      if (src) ctx.drawImage(src, R + off - scale, R - scale, scale * 2, scale * 2);
      ctx.restore();
    };

    if (r) {
      const sx = sp * W;
      drawSlide(l, 0, sx, slideIn(enter.current.left) * -1);
      drawSlide(r, sx, W, slideIn(enter.current.right));
    } else {
      drawSlide(l, 0, W, slideIn(enter.current.left));
    }

    // The cloth: a round of white suit cloth, showing the dust it carries.
    const c = cloth.current;
    if (c) {
      const cx = R + c.x;
      const cy = R + c.y;
      const cr = clothRadius();
      const b = c.brush;
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, cr, 0, Math.PI * 2);
      ctx.clip();
      ctx.fillStyle = 'rgba(243, 240, 250, 0.86)';
      ctx.fill();
      if (b?.loaded) {
        // What the cloth has picked up, darkening it: grayer the more it has carried.
        ctx.globalCompositeOperation = 'multiply';
        ctx.globalAlpha = Math.min(0.85, 0.2 + b.dust * 0.8);
        ctx.drawImage(brushImage(b), cx - cr, cy - cr, cr * 2, cr * 2);
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
      }
      // The weave.
      ctx.strokeStyle = 'rgba(120, 112, 140, 0.18)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let k = -cr; k < cr; k += 4) {
        ctx.moveTo(cx + k, cy - cr);
        ctx.lineTo(cx + k, cy + cr);
        ctx.moveTo(cx - cr, cy + k);
        ctx.lineTo(cx + cr, cy + k);
      }
      ctx.stroke();
      ctx.restore();
      ctx.beginPath();
      ctx.arc(cx, cy, cr, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(243, 240, 250, 0.85)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    if (r) {
      // The dividing line.
      const sx = sp * W;
      ctx.fillStyle = 'rgba(243, 240, 250, 0.9)';
      ctx.fillRect(sx - 1, 0, 2, W);
    }
    return animating;
  }, []);

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
  /** The cloth's radius on screen. */
  const clothRadius = () => Math.min(48, (live.current.size || 300) * 0.1);

  /** One step of the cloth, in screen px from the middle, on whichever slide lies under it. */
  const wipeAt = (x0: number, y0: number, x1: number, y1: number) => {
    const c = cloth.current;
    const { left: l, right: r, split: sp, size: W, power: p } = live.current;
    if (!c || !W) return;
    const R = W / 2;
    const scale = POWERS[p] * R;
    // From the screen to the photograph's pixels: it spans 2 × scale on screen.
    const lay = (slide: Slide, limit: Limit) => {
      const w = work(slide);
      if (!w) return;
      const k = w.px.width / (scale * 2);
      const to = (x: number, y: number) => [(x + scale) * k, (y + scale) * k] as const;
      const [ax, ay] = to(x0, y0);
      const [bx, by] = to(x1, y1);
      const rr = clothRadius() * k;
      const lim = { x0: (limit.x0 + scale) * k, x1: (limit.x1 + scale) * k };
      if (isMoon(slide)) {
        if (!c.brush || c.brush.r !== Math.max(2, Math.round(rr))) c.brush = newBrush(rr);
        smear(w.px, c.brush, bx, by, lim);
      } else {
        report.current.earth += brushAside(w.px, w.mask, ax, ay, bx, by, rr, lim);
      }
      const pad = rr * 2 + 4;
      const box = [Math.min(ax, bx) - pad, Math.min(ay, by) - pad, Math.max(ax, bx) + pad, Math.max(ay, by) + pad].map((v) => Math.round(v));
      const d = w.dirty;
      const nb = d ? [Math.min(d[0], box[0]), Math.min(d[1], box[1]), Math.max(d[0] + d[2], box[2]), Math.max(d[1] + d[3], box[3])] : box;
      const x = Math.max(0, nb[0]);
      const y = Math.max(0, nb[1]);
      w.dirty = [x, y, Math.min(w.px.width, nb[2]) - x, Math.min(w.px.height, nb[3]) - y];
    };
    const splitX = sp * W - R;
    if (r) {
      // Each slide only on its own side of the line.
      if (Math.min(x0, x1) - clothRadius() < splitX) lay(l, { x0: -Infinity, x1: splitX });
      if (Math.max(x0, x1) + clothRadius() >= splitX) lay(r, { x0: splitX, x1: Infinity });
    } else lay(l, { x0: -Infinity, x1: Infinity });
  };

  const moveCloth = (x: number, y: number) => {
    const c = cloth.current;
    if (!c) return;
    // Long moves go in short steps, so nothing is skipped over and the smear runs smooth.
    const steps = Math.max(1, Math.ceil(Math.hypot(x - c.x, y - c.y) / (clothRadius() * 0.12)));
    const x0 = c.x;
    const y0 = c.y;
    for (let k = 1; k <= steps; k++) {
      const px = c.x;
      const py = c.y;
      c.x = x0 + ((x - x0) * k) / steps;
      c.y = y0 + ((y - y0) * k) / steps;
      wipeAt(px, py, c.x, c.y);
    }
  };

  const startCloth = (x: number, y: number) => {
    report.current = { earth: 0 };
    cloth.current = { x, y, brush: null };
    wipeAt(x, y, x, y);
  };
  const endCloth = useCallback(() => {
    if (!cloth.current) return;
    const b = cloth.current.brush;
    cloth.current = null;
    schedule();
    onWiped({ moon: b?.dust ?? 0, earth: report.current.earth });
  }, [onWiped, schedule]);

  const fromMiddle = (clientX: number, clientY: number) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: clientX - rect.left - rect.width / 2, y: clientY - rect.top - rect.height / 2 };
  };
  const onPointerDown = (e: PointerEvent<HTMLCanvasElement>) => {
    cancelAnimationFrame(sweeping.current);
    e.currentTarget.setPointerCapture?.(e.pointerId);
    const p = fromMiddle(e.clientX, e.clientY);
    startCloth(p.x, p.y);
    schedule();
  };
  const onPointerMove = (e: PointerEvent<HTMLCanvasElement>) => {
    if (!cloth.current) return;
    const p = fromMiddle(e.clientX, e.clientY);
    moveCloth(p.x, p.y);
    schedule();
  };

  // The sweep for the button: across the middle and back, a little lower.
  const sweeping = useRef(0);
  useImperativeHandle(ref, () => ({
    sweep() {
      cancelAnimationFrame(sweeping.current);
      const span = (live.current.size || 300) * 0.36;
      const at = (t: number) => {
        const there = t < 0.5;
        const u = there ? t * 2 : (t - 0.5) * 2;
        return { x: (there ? -1 + 2 * u : 1 - 2 * u) * span, y: (there ? -0.2 : 0.24) * span + Math.sin(u * Math.PI * 3) * 0.08 * span };
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
        const t = Math.min(1, (performance.now() - t0) / 1800);
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
      // Back to the photographs as they were.
      worked.current.clear();
      setWiped([]);
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
    <div ref={wrapRef} className="mo-ms-eyepiece" style={{ ['--split' as string]: String(split) }} data-wiped={wiped.join(' ')}>
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
              e.currentTarget.setPointerCapture?.(e.pointerId);
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

/** What the cloth carries, as a picture to lay on it. */
const brushCanvas = new WeakMap<Brush, HTMLCanvasElement>();
function brushImage(b: Brush): HTMLCanvasElement {
  let cv = brushCanvas.get(b);
  if (!cv) {
    cv = document.createElement('canvas');
    cv.width = cv.height = b.size;
    brushCanvas.set(b, cv);
  }
  const ctx = cv.getContext('2d');
  if (!ctx) return cv;
  const img = ctx.createImageData(b.size, b.size);
  for (let i = 0, q = 0; i < img.data.length; i += 4, q += 3) {
    img.data[i] = b.rgb[q];
    img.data[i + 1] = b.rgb[q + 1];
    img.data[i + 2] = b.rgb[q + 2];
    img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return cv;
}
