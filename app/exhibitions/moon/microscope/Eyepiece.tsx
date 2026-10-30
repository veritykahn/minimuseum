'use client';

import { useCallback, useEffect, useImperativeHandle, useRef, useState, type KeyboardEvent, type PointerEvent, type Ref } from 'react';
import type { Slide, SlideId } from './slides';
import { brushAside, cleanness, lamp, lift, newBrush, newMask, settleGrains, type Brush, type Limit, type Pixels } from './wipe';

/*
 * The view down the microscope: one canvas, the slide's photograph
 * (slides.ts) magnified by the power. Side by side, the Moon's slide lies
 * left of a line you can drag and an Earth slide right of it. The focus is a
 * blur on the canvas, set by the knob outside.
 *
 * A slide is either carrying its sample (the photograph) or clean, bare
 * lamp-lit glass. Drag across it to wipe it with a cloth: the wipe works on a
 * copy of the photograph's own pixels (wipe.ts). The Wipe button draws the
 * cloth back and forth across the whole slide and leaves it clean. A fresh
 * slide is pushed in across the stage, the old one out, and is clean. Place
 * sample tips the sample onto a clean slide: its grains fall and settle, and
 * the photomicrograph comes up. With reduced motion each is a plain swap.
 */

/** How much each power magnifies, low to high: no more than the photographs hold sharp. */
export const POWERS = [1, 1.8, 3] as const;

/** What a wipe did: how much dust clung to the cloth (0 to 1), how much Earth sand it pushed aside, and whether the slides are now clean. */
export type WipeReport = { moon: number; earth: number; clean: boolean; already?: boolean };

export type EyepieceHandle = {
  /** Draw the cloth back and forth across the whole slide, wiping it clean (the button, for keyboards). */
  sweep: () => void;
  /** Push a fresh, clean slide onto the stage, and take up a clean cloth. */
  fresh: () => void;
  /** Tip the sample onto the clean slide. False when there is no clean slide to put it on. */
  place: () => boolean;
};

/** How long each change takes, in ms (none with reduced motion). */
export const TIMES = { sweep: 2600, polish: 450, swap: 1100, place: 2000 } as const;

type Anim = { kind: 'polish' | 'swap' | 'place'; t0: number; ms: number };

const ease = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
/** A grain dropping and coming to rest, with one small bounce. */
const settle = (t: number) => {
  if (t >= 1) return 1;
  if (t < 0.72) return (t / 0.72) ** 2;
  const u = (t - 0.72) / 0.28;
  return 1 - Math.sin(u * Math.PI) * 0.06;
};
const isMoon = (slide: Slide) => slide.id.startsWith('moon-');
const GRAINS = settleGrains();

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

/* Bare glass on the lamp: the same light the cloth wipes down to (wipe.ts lamp), drawn small and scaled. */
let glassImage: HTMLCanvasElement | null = null;
function glass(): HTMLCanvasElement | null {
  if (glassImage) return glassImage;
  if (typeof document === 'undefined') return null;
  const cv = document.createElement('canvas');
  const n = 128;
  cv.width = cv.height = n;
  const ctx = cv.getContext('2d');
  if (!ctx) return null;
  const img = ctx.createImageData(n, n);
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const [r, g, b] = lamp(x, y, n, n);
      img.data.set([r, g, b, 255], (y * n + x) * 4);
    }
  }
  ctx.putImageData(img, 0, 0);
  glassImage = cv;
  return cv;
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
  onChange,
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
  /** Which slides are clean glass now, whenever that changes, and whether a change is under way. */
  onChange?: (clean: SlideId[], busy: boolean) => void;
  ref?: Ref<EyepieceHandle>;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const worked = useRef(new Map<SlideId, Worked>());
  const [wiped, setWiped] = useState<SlideId[]>([]);
  /** The slides that are bare, clean glass. */
  const clean = useRef(new Set<SlideId>());
  const [cleanIds, setCleanIds] = useState<SlideId[]>([]);
  /** What each slide is doing: being polished clean, swapped for a fresh one, or having its sample placed. */
  const anims = useRef(new Map<SlideId, Anim>());
  const [busy, setBusy] = useState<string>('');
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const [size, setSize] = useState(0);
  const [split, setSplit] = useState(0.5);
  /** The cloth on the slide, in screen px from the eyepiece's middle, and what it carries. */
  const cloth = useRef<{ x: number; y: number; brush: Brush | null } | null>(null);
  const report = useRef({ earth: 0 });
  const enter = useRef<{ left: number; right: number }>({ left: 0, right: 0 });
  const frame = useRef(0);
  const live = useRef({ left, right, power, split, reduced, size });
  live.current = { left, right, power, split, reduced, size };
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

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

  /** Tell the room what is clean and what is moving. */
  const publish = useCallback(() => {
    const ids = [...clean.current];
    const kinds = [...new Set([...anims.current.values()].map((a) => a.kind))].join(' ');
    setCleanIds(ids);
    setBusy(kinds);
    onChangeRef.current?.(ids, kinds !== '');
  }, []);

  /** The wiped copy of a slide, made on its first wipe; null until its photograph has loaded, or once it is clean. */
  const work = (slide: Slide): Worked | null => {
    if (clean.current.has(slide.id) || anims.current.has(slide.id)) return null;
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
  const forget = (id: SlideId) => {
    if (!worked.current.delete(id)) return;
    setWiped((ids) => ids.filter((x) => x !== id));
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
    // The stage under the slide, dark where no glass lies.
    const stage = ctx.createRadialGradient(R * 0.85, R * 0.8, 0, R, R, R * 1.05);
    stage.addColorStop(0, '#4a3c7e');
    stage.addColorStop(0.55, '#2c2352');
    stage.addColorStop(1, '#120d24');
    ctx.fillStyle = stage;
    ctx.fillRect(0, 0, W, W);

    /** The photograph's square on screen, offset across by dx. */
    const box = (dx: number) => [R + dx - scale, R - scale, scale * 2, scale * 2] as const;
    const drawGlass = (dx: number) => {
      const g = glass();
      if (g) ctx.drawImage(g, ...box(dx));
    };
    const drawSample = (slide: Slide, dx: number) => {
      // The photograph fills the disc at the lowest power; higher powers look closer at its middle.
      // Once wiped, the wiped copy stands in for it.
      const w = worked.current.get(slide.id);
      if (w?.dirty) {
        const [x, y, dw, dh] = w.dirty;
        w.canvas.getContext('2d')?.putImageData(w.px as ImageData, 0, 0, x, y, dw, dh);
        w.dirty = null;
      }
      const src = w?.canvas ?? photo(slide.src, () => scheduleRef.current());
      if (src) ctx.drawImage(src, ...box(dx));
    };
    const face = (slide: Slide, dx: number) => (clean.current.has(slide.id) ? drawGlass(dx) : drawSample(slide, dx));
    /** A glass slide's edge, at x on screen: a bright line where the light catches it. */
    const edge = (x: number) => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.fillRect(x - 1.5, 0, 3, W);
      ctx.fillStyle = 'rgba(120, 140, 160, 0.35)';
      ctx.fillRect(x - 6, 0, 4.5, W);
    };

    const drawSlide = (slide: Slide, x0: number, x1: number, off: number) => {
      ctx.save();
      ctx.beginPath();
      ctx.rect(x0, 0, x1 - x0, W);
      ctx.clip();
      const a = anims.current.get(slide.id);
      const t = a ? Math.min(1, (now - a.t0) / a.ms) : 1;
      if (a && t < 1) animating = true;
      if (!a) face(slide, off);
      else if (a.kind === 'polish') {
        // The last of the dust or grains wiped away: the glass comes clear.
        drawSample(slide, off);
        ctx.globalAlpha = ease(t);
        drawGlass(off);
        ctx.globalAlpha = 1;
      } else if (a.kind === 'swap') {
        // The old slide is pushed out to the left; the fresh one follows it in from the right.
        const gap = W * 0.06;
        const D = scale * 2 + gap;
        const k = easeInOut(t);
        const out = off - k * D;
        const into = off + (1 - k) * D;
        face(slide, out);
        drawGlass(into);
        edge(R + out + scale);
        edge(R + into - scale);
      } else {
        // The sample is tipped onto the clean glass: its grains fall, then settle, and the view comes up.
        drawGlass(off);
        const img = photo(slide.src, () => scheduleRef.current());
        if (img) {
          const [bx, by, bw] = box(off);
          const fall = Math.min(1, t / 0.8);
          for (const g of GRAINS) {
            const u = (fall - g.delay) / 0.38;
            if (u <= 0) continue;
            const s = settle(Math.min(1, u));
            const gx = bx + g.x * bw;
            const gy = by + g.y * bw;
            const rr = g.r * bw * (1.25 - 0.25 * s);
            ctx.save();
            ctx.globalAlpha = Math.min(1, u * 2.5);
            ctx.translate(gx, gy - (1 - s) * g.drop * W);
            ctx.rotate(g.spin * (1 - s));
            ctx.beginPath();
            ctx.arc(0, 0, rr, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(img, bx - gx, by - gy, bw, bw);
            ctx.restore();
          }
          // Settled: the whole view, sharp.
          if (t > 0.8) {
            ctx.globalAlpha = ease((t - 0.8) / 0.2);
            ctx.drawImage(img, bx, by, bw, bw);
            ctx.globalAlpha = 1;
          }
        }
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
      ctx.fillStyle = 'rgba(243, 240, 250, 0.9)';
      ctx.fill();
      if (b?.loaded) {
        // What the cloth has picked up, darkening it.
        ctx.globalCompositeOperation = 'multiply';
        ctx.drawImage(brushImage(b), cx - cr, cy - cr, cr * 2, cr * 2);
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
  useEffect(
    () => () => {
      cancelAnimationFrame(frame.current);
      timers.current.forEach(clearTimeout);
    },
    [],
  );

  /**
   * Run a change on some slides: animate it, then settle what it leaves.
   * With reduced motion it is done at once.
   */
  const run = (ids: SlideId[], kind: Anim['kind'], done: (id: SlideId) => void, after?: () => void) => {
    const finish = () => {
      ids.forEach((id) => {
        anims.current.delete(id);
        done(id);
      });
      publish();
      schedule();
      after?.();
    };
    if (live.current.reduced || !ids.length) {
      finish();
      return;
    }
    const ms = TIMES[kind];
    const t0 = performance.now();
    ids.forEach((id) => anims.current.set(id, { kind, t0, ms }));
    publish();
    schedule();
    timers.current.push(setTimeout(finish, ms + 20));
  };
  const makeClean = (id: SlideId) => {
    clean.current.add(id);
    forget(id);
  };

  // ───── Wiping ─────
  /** The cloth's radius on screen. */
  const clothRadius = () => Math.min(48, (live.current.size || 300) * 0.1);
  const onStage = () => {
    const { left: l, right: r } = live.current;
    return r ? [l, r] : [l];
  };

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
        if (!c.brush || c.brush.r !== Math.max(2, Math.round(rr))) c.brush = withDust(newBrush(rr), c.brush);
        lift(w.px, c.brush, bx, by, lim);
      } else {
        report.current.earth += brushAside(w.px, w.mask, ax, ay, bx, by, rr, lim);
      }
      const pad = rr * 2 + 4;
      const bb = [Math.min(ax, bx) - pad, Math.min(ay, by) - pad, Math.max(ax, bx) + pad, Math.max(ay, by) + pad].map((v) => Math.round(v));
      const d = w.dirty;
      const nb = d ? [Math.min(d[0], bb[0]), Math.min(d[1], bb[1]), Math.max(d[0] + d[2], bb[2]), Math.max(d[1] + d[3], bb[3])] : bb;
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

  /** Move the cloth to (x, y), in steps no longer than `step` of its radius, so nothing is skipped over. */
  const moveCloth = (x: number, y: number, step = 0.12) => {
    const c = cloth.current;
    if (!c) return;
    const steps = Math.max(1, Math.ceil(Math.hypot(x - c.x, y - c.y) / (clothRadius() * step)));
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

  /** The cloth keeps its dust from wipe to wipe, until a fresh slide. */
  const clothDust = useRef(0);
  const withDust = (b: Brush, had: Brush | null) => {
    b.dust = had?.dust ?? clothDust.current;
    return b;
  };
  const startCloth = (x: number, y: number) => {
    report.current = { earth: 0 };
    cloth.current = { x, y, brush: null };
    wipeAt(x, y, x, y);
  };
  /** Lift the cloth: say what it did, and if the glass under it is all but clean, finish the job. */
  const endCloth = useCallback(() => {
    if (!cloth.current) return;
    const b = cloth.current.brush;
    cloth.current = null;
    if (b) clothDust.current = b.dust;
    const slides = onStage();
    const already = slides.every((s) => clean.current.has(s.id));
    const nearlyClean = slides.filter((s) => {
      const w = worked.current.get(s.id);
      return w && !clean.current.has(s.id) && cleanness(w.px, 8) > 0.97;
    });
    run(
      nearlyClean.map((s) => s.id),
      'polish',
      makeClean,
    );
    schedule();
    onWiped({ moon: b ? clothDust.current : 0, earth: report.current.earth, clean: slides.every((s) => clean.current.has(s.id) || nearlyClean.includes(s)), already });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onWiped, schedule]);

  const fromMiddle = (clientX: number, clientY: number) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: clientX - rect.left - rect.width / 2, y: clientY - rect.top - rect.height / 2 };
  };
  const onPointerDown = (e: PointerEvent<HTMLCanvasElement>) => {
    if (sweeping.current || anims.current.size) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    const p = fromMiddle(e.clientX, e.clientY);
    startCloth(p.x, p.y);
    schedule();
  };
  const onPointerMove = (e: PointerEvent<HTMLCanvasElement>) => {
    if (!cloth.current || sweeping.current) return;
    const p = fromMiddle(e.clientX, e.clientY);
    moveCloth(p.x, p.y);
    schedule();
  };
  const onPointerUp = () => {
    if (!sweeping.current) endCloth();
  };

  /** The cloth's path for the button: back and forth across the whole field, top to bottom. */
  const sweepPath = () => {
    const R = (live.current.size || 300) / 2;
    const cr = clothRadius();
    const pts: { x: number; y: number }[] = [];
    const rows = Math.max(3, Math.ceil((2 * R - cr) / (cr * 1.25)));
    for (let i = 0; i <= rows; i++) {
      const y = -R + cr * 0.5 + ((2 * R - cr) * i) / rows;
      const half = Math.sqrt(Math.max(0, R * R - y * y)) + cr * 0.3;
      const [a, b] = i % 2 ? [half, -half] : [-half, half];
      pts.push({ x: a, y }, { x: b, y });
    }
    const lens = pts.slice(1).map((q, i) => Math.hypot(q.x - pts[i].x, q.y - pts[i].y));
    const total = lens.reduce((s, v) => s + v, 0) || 1;
    return (t: number) => {
      let d = t * total;
      for (let i = 0; i < lens.length; i++) {
        if (d <= lens[i] || i === lens.length - 1) {
          const f = lens[i] ? Math.min(1, d / lens[i]) : 1;
          return { x: pts[i].x + (pts[i + 1].x - pts[i].x) * f, y: pts[i].y + (pts[i + 1].y - pts[i].y) * f };
        }
        d -= lens[i];
      }
      return pts[pts.length - 1];
    };
  };

  const sweeping = useRef(0);
  useImperativeHandle(ref, () => ({
    sweep() {
      if (sweeping.current || anims.current.size) return;
      const slides = onStage();
      const dirty = slides.filter((s) => !clean.current.has(s.id));
      if (!dirty.length) {
        onWiped({ moon: 0, earth: 0, clean: true, already: true });
        return;
      }
      const moonish = dirty.some(isMoon);
      const earthish = dirty.some((s) => !isMoon(s));
      const finish = (moon: number, earth: number) => {
        cloth.current = null;
        sweeping.current = 0;
        clothDust.current = moon;
        run(
          dirty.map((s) => s.id),
          'polish',
          makeClean,
          () => onWiped({ moon: moonish ? moon : 0, earth: earthish ? Math.max(1, earth) : 0, clean: true }),
        );
      };
      if (live.current.reduced) {
        // At once: the slide is clean, and the cloth has taken the dust.
        finish(moonish ? Math.min(1, clothDust.current + 0.45) : clothDust.current, earthish ? 1 : 0);
        return;
      }
      const at = sweepPath();
      const p0 = at(0);
      startCloth(p0.x, p0.y);
      const t0 = performance.now();
      const tick = () => {
        const t = Math.min(1, (performance.now() - t0) / TIMES.sweep);
        const p = at(t);
        moveCloth(p.x, p.y, 0.3);
        draw();
        if (t < 1) sweeping.current = requestAnimationFrame(tick);
        else {
          const b = cloth.current?.brush;
          finish(b ? b.dust : clothDust.current, report.current.earth);
        }
      };
      sweeping.current = requestAnimationFrame(tick);
    },
    fresh() {
      if (sweeping.current) {
        cancelAnimationFrame(sweeping.current);
        sweeping.current = 0;
      }
      if (anims.current.size) return;
      cloth.current = null;
      clothDust.current = 0;
      // Every slide in the box is fresh: the ones on the stage are pushed out for clean glass.
      const ids = onStage().map((s) => s.id);
      for (const id of [...worked.current.keys()]) if (!ids.includes(id)) forget(id);
      run(ids, 'swap', makeClean);
    },
    place() {
      if (sweeping.current || anims.current.size) return false;
      const ids = onStage()
        .map((s) => s.id)
        .filter((id) => clean.current.has(id));
      if (!ids.length) return false;
      // The sample goes on the glass at once; its grains are what is seen falling.
      ids.forEach((id) => {
        clean.current.delete(id);
        forget(id);
      });
      run(ids, 'place', () => {});
      publish();
      return true;
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
    <div
      ref={wrapRef}
      className="mo-ms-eyepiece"
      style={{ ['--split' as string]: String(split) }}
      data-wiped={wiped.join(' ')}
      data-clean={cleanIds.join(' ')}
      data-anim={busy}
    >
      <canvas
        ref={canvasRef}
        className="mo-ms-canvas"
        role="img"
        aria-label={label}
        style={{ filter: blur > 0.2 ? `blur(${blur.toFixed(1)}px)` : 'none' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
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
