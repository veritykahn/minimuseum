'use client';

import { useCallback, useEffect, useImperativeHandle, useRef, useState, type KeyboardEvent, type PointerEvent, type Ref } from 'react';
import { isMoon, type Slide, type SlideId } from './slides';
import { OBJECTIVES, type Pan } from './stage';
import { brushAside, cleanness, lamp, lift, newBrush, newMask, settleGrains, smudgedGlass, type Brush, type Limit, type Pixels } from './wipe';

/*
 * The view down the microscope: one canvas, showing the slide on the stage
 * through the objective lens in use. The stage holds one slide, or two side
 * by side (a Moon sample and an Earth sample, a line between them to drag).
 * The focus is a blur on the canvas, set by the knob outside; the lens and
 * where the stage has moved the slide (stage.ts) set which part of the
 * slide is in view.
 *
 * A slide is one of three things: a fresh slide from the box, smudged with
 * dust and a fingerprint (wipe.ts, smudgedGlass); clean, bare lamp-lit glass;
 * or carrying a sample (its photograph down a microscope, slides.ts).
 * Drag across it with the cloth to wipe it: the cloth works on a copy of
 * the pixels in view (wipe.ts), lifting off smudges and Moon dust, and
 * brushing Earth's grains aside. The Wipe button draws the cloth back and
 * forth across the whole slide and leaves it clean. A fresh slide is pushed
 * in across the stage, the old one out. Placing a sample tips it onto clean
 * glass: its grains fall and settle, and the photograph comes up. With
 * reduced motion each is a plain swap.
 *
 * With the hand (not the cloth), dragging moves the slide on the stage.
 */

/** What a wipe did: how much dust clung to the cloth (0 to 1), how much Earth sand it pushed aside, whether it wiped smudges, and whether the slides are now clean. */
export type WipeReport = { moon: number; earth: number; smudge: boolean; clean: boolean; already?: boolean };

/** One slide on the stage, as the room sees it. */
export type SlotView = { sample: SlideId | null; smudged: boolean };
export type StageView = { left: SlotView; right: SlotView | null };

/** Placing a sample: done, or why not (the slide is smudged, has a sample already, or something is moving). */
export type PlaceResult = 'ok' | 'smudged' | 'occupied' | 'busy';

export type EyepieceHandle = {
  /** Draw the cloth back and forth across the whole slide, wiping it clean (the button, for keyboards). */
  sweep: () => void;
  /** Push a fresh slide from the box onto the stage (it comes smudged), and take up a clean cloth. */
  fresh: () => void;
  /** Tip a sample onto the clean slide. */
  place: (slide: Slide) => PlaceResult;
  /** Lay a second slide, with a sample on it, beside the first. */
  compare: (slide: Slide) => void;
  /** Take the second slide away. */
  endCompare: () => void;
};

/** How long each change takes, in ms (none with reduced motion). */
export const TIMES = { sweep: 2600, polish: 450, swap: 1100, place: 2000 } as const;

type Anim = { kind: 'polish' | 'swap' | 'place'; t0: number; ms: number };
/** A wiped slide: a copy of its pixels, how clear its glass is (Earth's), and a canvas to show them. */
type Worked = { px: Pixels; mask: Uint8Array; canvas: HTMLCanvasElement; dirty: [number, number, number, number] | null };
/** What lies on a slide. */
type Face = { sample: Slide | null; smudged: boolean; work: Worked | null };
type Slot = Face & { anim: Anim | null; prev: Face | null; enter: number };

const ease = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
/** A grain dropping and coming to rest, with one small bounce. */
const settle = (t: number) => {
  if (t >= 1) return 1;
  if (t < 0.72) return (t / 0.72) ** 2;
  const u = (t - 0.72) / 0.28;
  return 1 - Math.sin(u * Math.PI) * 0.06;
};
const GRAINS = settleGrains();
const SMUDGE_SIZE = 360;
const freshSlot = (): Slot => ({ sample: null, smudged: true, work: null, anim: null, prev: null, enter: 0 });
const isClean = (f: Face) => !f.sample && !f.smudged;
const viewOf = (s: Slot): SlotView => ({ sample: s.sample?.id ?? null, smudged: s.smudged });

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

/** A canvas holding pixels, or null where there is no canvas to draw on. */
function canvasOf(px: Pixels): HTMLCanvasElement | null {
  if (typeof document === 'undefined') return null;
  const cv = document.createElement('canvas');
  cv.width = px.width;
  cv.height = px.height;
  const ctx = cv.getContext('2d');
  if (!ctx) return null;
  const img = ctx.createImageData(px.width, px.height);
  img.data.set(px.data);
  ctx.putImageData(img, 0, 0);
  return cv;
}

/* Bare glass on the lamp: the same light the cloth wipes down to (wipe.ts lamp), drawn small and scaled. */
let glassImage: HTMLCanvasElement | null = null;
function glass(): HTMLCanvasElement | null {
  if (glassImage) return glassImage;
  const n = 128;
  const data = new Uint8ClampedArray(n * n * 4);
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) data.set([...lamp(x, y, n, n), 255], (y * n + x) * 4);
  glassImage = canvasOf({ data, width: n, height: n });
  return glassImage;
}
/* A fresh slide's smudges, as they come from the box. */
let smudgeImage: HTMLCanvasElement | null = null;
const smudge = () => (smudgeImage ??= canvasOf(smudgedGlass(SMUDGE_SIZE)));

export default function Eyepiece({
  objective,
  pan,
  blur,
  reduced,
  label,
  tool,
  onWiped,
  onChange,
  onPan,
  onMove,
  ref,
}: {
  /** Which objective lens is in use (stage.ts). */
  objective: number;
  /** Where the middle of the view is on the slide, 0 to 1 each way. */
  pan: Pan;
  /** The focus: how far out of focus, in CSS px of blur. */
  blur: number;
  reduced: boolean;
  /** What the view shows, for a screen reader. */
  label: string;
  /** What dragging on the slide does: wipe it with the cloth, or move it on the stage. */
  tool: 'cloth' | 'move';
  onWiped: (r: WipeReport) => void;
  /** What is on the stage, whenever that changes, and whether a change is under way. */
  onChange?: (view: StageView, busy: boolean) => void;
  /** The slide dragged on the stage: where the view's middle would go (the room keeps it on the photo). */
  onPan?: (p: Pan) => void;
  /** An arrow key on the view: move the slide by this share of the view. */
  onMove?: (dx: number, dy: number) => void;
  ref?: Ref<EyepieceHandle>;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const slots = useRef<{ left: Slot; right: Slot | null }>({ left: freshSlot(), right: null });
  const [shown, setShown] = useState<{ slots: string; worked: string; anim: string }>({ slots: 'smudged', worked: '', anim: '' });
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const [size, setSize] = useState(0);
  const [split, setSplit] = useState(0.5);
  /** The cloth on the slide, in screen px from the eyepiece's middle, and what it carries. */
  const cloth = useRef<{ x: number; y: number; brush: Brush | null; smudge: Brush | null } | null>(null);
  const report = useRef({ earth: 0, smudge: false });
  const frame = useRef(0);
  const live = useRef({ objective, pan, split, reduced, size });
  live.current = { objective, pan, split, reduced, size };
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
  const allSlots = () => {
    const { left, right } = slots.current;
    return right ? [left, right] : [left];
  };

  /** Tell the room what is on the stage and what is moving. */
  const publish = useCallback(() => {
    const { left, right } = slots.current;
    const all = right ? [left, right] : [left];
    const word = (s: Slot) => s.sample?.id ?? (s.smudged ? 'smudged' : 'clean');
    const kinds = [...new Set(all.map((s) => s.anim?.kind).filter(Boolean))].join(' ');
    setShown({ slots: all.map(word).join(' '), worked: all.filter((s) => s.work).map(word).join(' '), anim: kinds });
    onChangeRef.current?.({ left: viewOf(left), right: right ? viewOf(right) : null }, kinds !== '');
  }, []);

  /** The wiped copy of a slide, made on its first wipe; null for bare glass, or until its photograph has loaded. */
  const work = (slot: Slot): Worked | null => {
    if (slot.anim || isClean(slot)) return null;
    if (slot.work) return slot.work;
    let px: Pixels;
    let canvas: HTMLCanvasElement | null;
    if (slot.sample) {
      const img = photo(slot.sample.src, () => scheduleRef.current());
      if (!img) return null;
      canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return null;
      ctx.drawImage(img, 0, 0);
      px = ctx.getImageData(0, 0, canvas.width, canvas.height);
    } else {
      canvas = document.createElement('canvas');
      canvas.width = canvas.height = SMUDGE_SIZE;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return null;
      const img = ctx.createImageData(SMUDGE_SIZE, SMUDGE_SIZE);
      img.data.set(smudgedGlass(SMUDGE_SIZE).data);
      px = img;
      ctx.putImageData(img, 0, 0);
    }
    slot.work = { px, mask: newMask(px), canvas, dirty: null };
    publish();
    return slot.work;
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const { objective: o, pan: p, split: sp, size: W } = live.current;
    const ctx = W > 0 ? canvas?.getContext?.('2d') : null;
    if (!canvas || !ctx) return false;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    if (canvas.width !== Math.round(W * dpr)) {
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(W * dpr);
    }
    const R = W / 2;
    // The slide's photograph spans S on screen: the eyepiece's width, zoomed by the lens.
    const S = OBJECTIVES[o].zoom * W;
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

    /** The slide's square on screen, moved by the stage, and across by dx. */
    const box = (dx: number) => [R + dx - S * p.x, R - S * p.y, S, S] as const;
    const drawGlass = (dx: number) => {
      const g = glass();
      if (g) ctx.drawImage(g, ...box(dx));
    };
    const flush = (w: Worked) => {
      if (!w.dirty) return;
      const [x, y, dw, dh] = w.dirty;
      w.canvas.getContext('2d')?.putImageData(w.px as ImageData, 0, 0, x, y, dw, dh);
      w.dirty = null;
    };
    /** What lies on a slide: once wiped, its wiped copy stands in for it. */
    const face = (f: Face, dx: number) => {
      if (isClean(f)) return drawGlass(dx);
      if (f.work) flush(f.work);
      const src = f.work?.canvas ?? (f.sample ? photo(f.sample.src, () => scheduleRef.current()) : smudge());
      if (src) ctx.drawImage(src, ...box(dx));
    };
    /** A glass slide's edge, at x on screen: a bright line where the light catches it. */
    const edge = (x: number) => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.fillRect(x - 1.5, 0, 3, W);
      ctx.fillStyle = 'rgba(120, 140, 160, 0.35)';
      ctx.fillRect(x - 6, 0, 4.5, W);
    };

    const drawSlot = (slot: Slot, x0: number, x1: number, off: number) => {
      ctx.save();
      ctx.beginPath();
      ctx.rect(x0, 0, x1 - x0, W);
      ctx.clip();
      const a = slot.anim;
      const t = a ? Math.min(1, (now - a.t0) / a.ms) : 1;
      if (a && t < 1) animating = true;
      if (!a) face(slot, off);
      else if (a.kind === 'polish') {
        // The last of the dust or grains wiped away: the glass comes clear.
        face(slot, off);
        ctx.globalAlpha = ease(t);
        drawGlass(off);
        ctx.globalAlpha = 1;
      } else if (a.kind === 'swap') {
        // The old slide is pushed out to the left; the fresh one follows it in from the right.
        const D = S + W * 0.06;
        const k = easeInOut(t);
        const out = off - k * D;
        const into = off + (1 - k) * D;
        if (slot.prev) face(slot.prev, out);
        face(slot, into);
        edge(box(out)[0] + S);
        edge(box(into)[0]);
      } else if (slot.sample) {
        // The sample is tipped onto the clean glass: its grains fall, then settle, and the view comes up.
        drawGlass(off);
        const img = photo(slot.sample.src, () => scheduleRef.current());
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
          // Settled: the whole view.
          if (t > 0.8) {
            ctx.globalAlpha = ease((t - 0.8) / 0.2);
            ctx.drawImage(img, bx, by, bw, bw);
            ctx.globalAlpha = 1;
          }
        }
      }
      ctx.restore();
    };

    const { left, right } = slots.current;
    if (right) {
      const sx = sp * W;
      drawSlot(left, 0, sx, -slideIn(left.enter));
      drawSlot(right, sx, W, slideIn(right.enter));
    } else {
      drawSlot(left, 0, W, slideIn(left.enter));
    }

    // The cloth: a round of soft white cloth, showing the dust it carries.
    const c = cloth.current;
    if (c) {
      const cx = R + c.x;
      const cy = R + c.y;
      const cr = clothRadius();
      const b = c.brush ?? c.smudge;
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

    if (right) {
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

  useEffect(() => {
    schedule();
  }, [objective, pan, split, size, schedule]);
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
  const run = (on: Slot[], kind: Anim['kind'], done: (s: Slot) => void, after?: () => void) => {
    const finish = () => {
      on.forEach((s) => {
        s.anim = null;
        s.prev = null;
        done(s);
      });
      publish();
      schedule();
      after?.();
    };
    if (live.current.reduced || !on.length) {
      finish();
      return;
    }
    const ms = TIMES[kind];
    const t0 = performance.now();
    on.forEach((s) => (s.anim = { kind, t0, ms }));
    publish();
    schedule();
    timers.current.push(setTimeout(finish, ms + 20));
  };
  const makeClean = (s: Slot) => {
    s.sample = null;
    s.smudged = false;
    s.work = null;
  };
  const busyNow = () => sweeping.current !== 0 || allSlots().some((s) => s.anim);

  // ───── Wiping ─────
  /** The cloth's radius on screen. */
  const clothRadius = () => Math.min(48, (live.current.size || 300) * 0.1);

  /** One step of the cloth, in screen px from the middle, on whichever slide lies under it. */
  const wipeAt = (x0: number, y0: number, x1: number, y1: number) => {
    const c = cloth.current;
    const { split: sp, size: W, objective: o, pan: p } = live.current;
    if (!c || !W) return;
    const R = W / 2;
    const S = OBJECTIVES[o].zoom * W;
    // From the screen (px from the middle) to the slide's pixels: it spans S on screen, moved by the stage.
    const lay = (slot: Slot, limit: Limit) => {
      const w = work(slot);
      if (!w) return;
      const k = w.px.width / S;
      const to = (x: number, y: number) => [(x + S * p.x) * k, (y + S * p.y) * k] as const;
      const [ax, ay] = to(x0, y0);
      const [bx, by] = to(x1, y1);
      const rr = clothRadius() * k;
      const lim = { x0: (limit.x0 + S * p.x) * k, x1: (limit.x1 + S * p.x) * k };
      const r = Math.max(2, Math.round(rr));
      if (!slot.sample) {
        // A fresh slide's smudges come off on the cloth.
        if (!c.smudge || c.smudge.r !== r) c.smudge = newBrush(rr);
        lift(w.px, c.smudge, bx, by, lim);
        report.current.smudge = true;
      } else if (isMoon(slot.sample)) {
        if (!c.brush || c.brush.r !== r) c.brush = withDust(newBrush(rr), c.brush);
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
      w.dirty = [x, y, Math.max(0, Math.min(w.px.width, nb[2]) - x), Math.max(0, Math.min(w.px.height, nb[3]) - y)];
    };
    const { left, right } = slots.current;
    const splitX = sp * W - R;
    if (right) {
      // Each slide only on its own side of the line.
      if (Math.min(x0, x1) - clothRadius() < splitX) lay(left, { x0: -Infinity, x1: splitX });
      if (Math.max(x0, x1) + clothRadius() >= splitX) lay(right, { x0: splitX, x1: Infinity });
    } else lay(left, { x0: -Infinity, x1: Infinity });
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

  /** The cloth keeps its Moon dust from wipe to wipe, until a fresh slide. */
  const clothDust = useRef(0);
  const withDust = (b: Brush, had: Brush | null) => {
    b.dust = had?.dust ?? clothDust.current;
    return b;
  };
  const startCloth = (x: number, y: number) => {
    report.current = { earth: 0, smudge: false };
    cloth.current = { x, y, brush: null, smudge: null };
    wipeAt(x, y, x, y);
  };
  /** The part of a slide's pixels in view: the square inside the round field. */
  const inView = (w: Worked) => {
    const { objective: o, pan: p } = live.current;
    const half = (w.px.width * Math.SQRT1_2) / (2 * OBJECTIVES[o].zoom);
    const cx = p.x * w.px.width;
    const cy = p.y * w.px.height;
    return { x0: cx - half, x1: cx + half, y0: cy - half, y1: cy + half };
  };
  /** Lift the cloth: say what it did, and if the glass in view is all but clean, finish the job. */
  const endCloth = useCallback(() => {
    if (!cloth.current) return;
    const b = cloth.current.brush;
    cloth.current = null;
    if (b) clothDust.current = b.dust;
    const all = allSlots();
    const already = all.every(isClean);
    // A fresh slide's faint smudges count as gone a little sooner than a sample's grains.
    const nearlyClean = all.filter((s) => s.work && !isClean(s) && cleanness(s.work.px, 4, inView(s.work)) > (s.sample ? 0.97 : 0.93));
    run(nearlyClean, 'polish', makeClean);
    schedule();
    onWiped({
      moon: b ? clothDust.current : 0,
      earth: report.current.earth,
      smudge: report.current.smudge,
      clean: all.every((s) => isClean(s) || nearlyClean.includes(s)),
      already,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onWiped, schedule]);

  const fromMiddle = (clientX: number, clientY: number) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: clientX - rect.left - rect.width / 2, y: clientY - rect.top - rect.height / 2 };
  };
  /** The hand on the slide: where it took hold, and where the slide was then. */
  const hand = useRef<{ x: number; y: number; pan: Pan } | null>(null);
  const onPointerDown = (e: PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture?.(e.pointerId);
    if (tool === 'move') {
      hand.current = { x: e.clientX, y: e.clientY, pan: live.current.pan };
      return;
    }
    if (busyNow()) return;
    const p = fromMiddle(e.clientX, e.clientY);
    startCloth(p.x, p.y);
    schedule();
  };
  const onPointerMove = (e: PointerEvent<HTMLCanvasElement>) => {
    const h = hand.current;
    if (h) {
      // The slide follows the hand: the view's middle moves the other way.
      const S = OBJECTIVES[live.current.objective].zoom * (live.current.size || 1);
      onPan?.({ x: h.pan.x - (e.clientX - h.x) / S, y: h.pan.y - (e.clientY - h.y) / S });
      return;
    }
    if (!cloth.current || sweeping.current) return;
    const p = fromMiddle(e.clientX, e.clientY);
    moveCloth(p.x, p.y);
    schedule();
  };
  const onPointerUp = () => {
    if (hand.current) {
      hand.current = null;
      return;
    }
    if (!sweeping.current) endCloth();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    const d: Record<string, [number, number]> = { ArrowLeft: [-0.25, 0], ArrowRight: [0.25, 0], ArrowUp: [0, -0.25], ArrowDown: [0, 0.25] };
    const m = d[e.key];
    if (!m) return;
    e.preventDefault();
    onMove?.(m[0], m[1]);
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
      if (busyNow()) return;
      const dirty = allSlots().filter((s) => !isClean(s));
      if (!dirty.length) {
        onWiped({ moon: 0, earth: 0, smudge: false, clean: true, already: true });
        return;
      }
      const moonish = dirty.some((s) => s.sample && isMoon(s.sample));
      const earthish = dirty.some((s) => s.sample && !isMoon(s.sample));
      const smudgy = dirty.some((s) => !s.sample);
      const finish = (moon: number, earth: number) => {
        cloth.current = null;
        sweeping.current = 0;
        clothDust.current = moon;
        run(dirty, 'polish', makeClean, () =>
          onWiped({ moon: moonish ? moon : 0, earth: earthish ? Math.max(1, earth) : 0, smudge: smudgy, clean: true }),
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
      if (allSlots().some((s) => s.anim)) return;
      cloth.current = null;
      clothDust.current = 0;
      // One fresh slide from the box: the one on the stage is pushed out for it, and a second slide is put away.
      slots.current.right = null;
      const left = slots.current.left;
      left.prev = { sample: left.sample, smudged: left.smudged, work: left.work };
      left.sample = null;
      left.smudged = true;
      left.work = null;
      run([left], 'swap', () => {});
    },
    place(slide) {
      if (busyNow()) return 'busy';
      const left = slots.current.left;
      if (left.smudged) return 'smudged';
      if (left.sample) return 'occupied';
      // The sample goes on the glass at once; its grains are what is seen falling.
      left.sample = slide;
      left.work = null;
      run([left], 'place', () => {});
      return 'ok';
    },
    compare(slide) {
      if (busyNow()) return;
      slots.current.right = { sample: slide, smudged: false, work: null, anim: null, prev: null, enter: performance.now() };
      setSplit(0.5);
      publish();
      schedule();
    },
    endCompare() {
      if (!slots.current.right || busyNow()) return;
      slots.current.right = null;
      publish();
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

  const { left, right } = slots.current;
  const world = (s: Slot) => (s.sample ? (isMoon(s.sample) ? 'Moon' : 'Earth') : 'Glass');

  return (
    <div
      ref={wrapRef}
      className="mo-ms-eyepiece"
      style={{ ['--split' as string]: String(split) }}
      data-slots={shown.slots}
      data-worked={shown.worked}
      data-anim={shown.anim}
      data-tool={tool}
      data-pan={`${pan.x.toFixed(3)} ${pan.y.toFixed(3)}`}
      tabIndex={0}
      role="group"
      aria-label="The view down the microscope. Arrow keys move the slide on the stage."
      onKeyDown={onKeyDown}
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
          <span className="mo-ms-side mo-ms-side-left" aria-hidden="true">{world(left)}</span>
          <span className="mo-ms-side mo-ms-side-right" aria-hidden="true">{world(right)}</span>
          <div
            className="mo-ms-split"
            role="slider"
            tabIndex={0}
            aria-label="Move the dividing line"
            aria-valuemin={10}
            aria-valuemax={90}
            aria-valuenow={Math.round(split * 100)}
            aria-valuetext={`${Math.round(split * 100)}% ${world(left)}`}
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
