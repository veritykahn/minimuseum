'use client';

import { useCallback, useEffect, useRef, type PointerEvent } from 'react';
import { inkAfter, inkAlpha, nibQuad, thin, SIG_ASPECT, type Pt, type Stroke } from './signing';

/*
 * The line to sign on: a canvas over the sheet's signature box, written on
 * with a broad-nibbed quill by finger, pen or mouse. The quill carries one
 * dip of ink, and the line thins to a dry scratch as it runs out. Nothing
 * leaves the page: the strokes live in the room's state until it is closed.
 */

const INK_RGB = '43, 29, 20';

type Props = {
  strokes: Stroke[];
  onStroke: (s: Stroke) => void;
  ink: number;
  onInk: (level: number) => void;
  /** Called when the visitor tries to write with a dry quill. */
  onDry: () => void;
  disabled?: boolean;
  label: string;
};

export default function SignaturePad({ strokes, onStroke, ink, onInk, onDry, disabled = false, label }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const current = useRef<Stroke | null>(null);
  const level = useRef(ink);
  useEffect(() => {
    level.current = ink;
  }, [ink]);
  // While a stroke is being written, the level runs down here and is handed back when it ends.
  const live = useRef(ink);

  const ctx = useCallback(() => {
    const c = canvas.current;
    if (!c) return null;
    const g = c.getContext('2d');
    return g ? { c, g, w: c.width } : null;
  }, []);

  const mark = useCallback(
    (a: Pt, b: Pt, alpha: number) => {
      const k = ctx();
      if (!k) return;
      const q = nibQuad(a, b, k.w);
      k.g.fillStyle = `rgba(${INK_RGB}, ${alpha})`;
      k.g.beginPath();
      k.g.moveTo(q[0][0], q[0][1]);
      for (let i = 1; i < 4; i++) k.g.lineTo(q[i][0], q[i][1]);
      k.g.closePath();
      k.g.fill();
      // The hairline, so strokes along the nib still show.
      k.g.strokeStyle = `rgba(${INK_RGB}, ${alpha * 0.9})`;
      k.g.lineWidth = Math.max(1, k.w * 0.0018);
      k.g.beginPath();
      k.g.moveTo(a.x * k.w, a.y * k.w);
      k.g.lineTo(b.x * k.w, b.y * k.w);
      k.g.stroke();
    },
    [ctx],
  );

  // Size the canvas to its box (and the screen's density), and redraw what is signed.
  const redraw = useCallback(() => {
    const c = canvas.current;
    if (!c) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = Math.round(c.clientWidth * dpr);
    if (!w) return;
    if (c.width !== w) {
      c.width = w;
      c.height = Math.round(w * SIG_ASPECT);
    }
    const k = ctx();
    if (!k) return;
    k.g.clearRect(0, 0, c.width, c.height);
    for (const s of strokes) {
      if (s.length === 1) mark(s[0], { x: s[0].x + 0.002, y: s[0].y + 0.002 }, s[0].a ?? 0.85);
      for (let i = 1; i < s.length; i++) if (s[i].a !== 0) mark(s[i - 1], s[i], s[i].a ?? 0.85);
    }
  }, [ctx, mark, strokes]);

  useEffect(() => {
    redraw();
    const c = canvas.current;
    if (!c || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(redraw);
    ro.observe(c);
    return () => ro.disconnect();
  }, [redraw]);

  const at = (e: PointerEvent<HTMLCanvasElement>): Pt => {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: (e.clientX - r.left) / r.width, y: ((e.clientY - r.top) / r.height) * SIG_ASPECT };
  };

  const down = (e: PointerEvent<HTMLCanvasElement>) => {
    if (disabled) return;
    if (level.current <= 0) {
      onDry();
      return;
    }
    e.preventDefault();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    live.current = level.current;
    const p = { ...at(e), a: inkAlpha(live.current) };
    current.current = [p];
    mark(p, { x: p.x + 0.002, y: p.y + 0.002 }, p.a);
  };

  const move = (e: PointerEvent<HTMLCanvasElement>) => {
    const s = current.current;
    if (!s) return;
    const events = e.nativeEvent.getCoalescedEvents?.() ?? [e.nativeEvent];
    const r = e.currentTarget.getBoundingClientRect();
    for (const ev of events) {
      const p: Pt = { x: (ev.clientX - r.left) / r.width, y: ((ev.clientY - r.top) / r.height) * SIG_ASPECT };
      const last = s[s.length - 1];
      const d = Math.hypot(p.x - last.x, p.y - last.y);
      if (d < 0.0015) continue;
      live.current = inkAfter(live.current, d);
      // A dry quill skips: some of its marks don't take.
      const skips = live.current < 0.25 && Math.random() < 0.35 * (1 - live.current / 0.25);
      p.a = skips ? 0 : inkAlpha(live.current);
      if (p.a) mark(last, p, p.a);
      s.push(p);
    }
  };

  const up = () => {
    const s = current.current;
    current.current = null;
    if (!s) return;
    onInk(live.current);
    onStroke(thin(s));
    if (live.current <= 0) onDry();
  };

  return (
    <canvas
      ref={canvas}
      className="ap-pad"
      role="img"
      aria-label={label}
      data-disabled={disabled || undefined}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
    />
  );
}
