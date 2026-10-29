'use client';

import { useEffect, useRef } from 'react';

/*
 * The heart monitor along the foot of the lab: a trace that runs faster as
 * the fright builds. It is drawn, not measured; nothing on it is a reading.
 * With motion off it holds still, the beats spaced by the same pace.
 */

/** One beat's shape, for a phase 0–1: a small bump, the spike, a slow wave. */
export function ecg(p: number): number {
  const bump = (c: number, w: number, h: number) => h * Math.exp(-(((p - c) / w) ** 2));
  return bump(0.12, 0.03, 0.12) - bump(0.2, 0.012, 0.18) + bump(0.235, 0.016, 1) - bump(0.27, 0.016, 0.3) + bump(0.46, 0.05, 0.22);
}

const PX_PER_MS = 0.14;
const STEP = 2;

export default function HeartTrace({ pace, still }: { pace: number; still: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const paceRef = useRef(pace);
  useEffect(() => {
    paceRef.current = pace;
  }, [pace]);
  const heldPace = still ? Math.round(pace) : 0;

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext?.('2d');
    if (!canvas || !ctx) return;
    let raf = 0;
    let samples: number[] = [];
    let phase = 0;
    let last = performance.now();
    let carry = 0;

    const size = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const paint = (pts: number[], head: boolean) => {
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      ctx.clearRect(0, 0, W, H);
      const mid = H * 0.62;
      const amp = H * 0.5;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      // A soft glow under the line, then the line, fading toward the old end.
      const grad = ctx.createLinearGradient(0, 0, W, 0);
      grad.addColorStop(0, 'rgba(242, 179, 61, 0)');
      grad.addColorStop(0.35, 'rgba(242, 179, 61, 0.55)');
      grad.addColorStop(1, 'rgba(251, 246, 236, 1)');
      ctx.beginPath();
      pts.forEach((v, i) => {
        const x = W - (pts.length - 1 - i) * STEP;
        const y = mid - v * amp;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = 'rgba(242, 179, 61, 0.18)';
      ctx.lineWidth = 7;
      ctx.stroke();
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.stroke();
      if (head && pts.length) {
        ctx.beginPath();
        ctx.arc(W, mid - pts[pts.length - 1] * amp, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#fbf6ec';
        ctx.shadowColor = '#f2b33d';
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    };

    size();
    const n = () => Math.ceil(canvas.clientWidth / STEP) + 1;

    if (still) {
      // The same trace, held: beats spaced by the pace.
      const msPerSample = STEP / PX_PER_MS;
      const period = 60000 / paceRef.current;
      samples = Array.from({ length: n() }, (_, i) => ecg(((i * msPerSample) / period + 0.6) % 1));
      paint(samples, false);
      const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => { size(); paint(samples, false); }) : null;
      ro?.observe(canvas);
      return () => ro?.disconnect();
    }

    samples = Array.from({ length: n() }, () => 0);
    const tick = (now: number) => {
      const dt = Math.min(100, now - last);
      last = now;
      carry += dt * PX_PER_MS;
      const msPerSample = STEP / PX_PER_MS;
      while (carry >= STEP) {
        carry -= STEP;
        phase = (phase + msPerSample / (60000 / paceRef.current)) % 1;
        samples.push(ecg(phase));
      }
      const max = n();
      if (samples.length > max) samples = samples.slice(samples.length - max);
      paint(samples, true);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const onResize = () => size();
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
    // A held trace is redrawn when the pace changes; a running one reads it live.
  }, [still, heldPace]);

  return <canvas ref={ref} className="fl-lab-trace" aria-hidden="true" />;
}
