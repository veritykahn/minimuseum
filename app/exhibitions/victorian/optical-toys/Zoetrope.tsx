'use client';

import { useCallback, useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react';
import { drawFrame } from './strips';
import FactNote from '@/components/exhibition/FactNote';
import { STRIPS, TOY_NOTES, type StripId } from './toysText';
import { approach, frameAt, slitStrength, TAU, ZOE_FRAMES, ZOE_STROBE, ZOE_TOP } from './spin';

/*
 * The zoetrope: a drum on a stand, slits round its wall and a strip of
 * twelve pictures inside. Drawn on a canvas, as seen from a little above.
 * Spin it (the button, or a flick sideways across the drum) and the slits
 * blur to a band while the pictures, glimpsed one at a time, move in place.
 * The lens beside it shows the picture seen through the front slit. Step
 * through the pictures one by one, or see them all side by side: under
 * reduced motion the drum stays still and that is how it is seen.
 */

const N = ZOE_FRAMES;
const SLOT = TAU / N;
const FW = 320;
const FH = 240;
/** The picture painted at slot k of the strip, so that the pictures play forward as the drum turns. */
const BACK = Math.round(N * 0.75);
const pictureAt = (slot: number) => (((BACK - slot) % N) + N) % N;

const SPIN_UP = 0.9;
const SPIN_DOWN = 0.45;

export default function Zoetrope({ reduced, strip, onStrip, intro, footer }: { reduced: boolean; strip: StripId; onStrip: (s: StripId) => void; intro: string; footer?: ReactNode }) {
  const s = STRIPS.find((x) => x.id === strip)!;
  const [spinning, setSpinning] = useState(false);
  const [top, setTop] = useState(70);
  const [frame, setFrame] = useState(0);
  // Side by side under reduced motion, until the visitor chooses.
  const [framesChoice, setFramesChoice] = useState<boolean | null>(null);
  const showFrames = framesChoice ?? reduced;
  const [thumbs, setThumbs] = useState<string[]>([]);
  const [status, setStatus] = useState('');

  const drum = useRef<HTMLCanvasElement>(null);
  const lens = useRef<HTMLCanvasElement>(null);
  const frames = useRef<HTMLCanvasElement[]>([]);
  const angle = useRef(0);
  const speed = useRef(0);
  const target = useRef(0);
  const drag = useRef<{ x: number; t: number; v: number } | null>(null);
  const raf = useRef(0);
  // The frame loop calls itself through a ref, so it always runs the latest tick.
  const loop = useRef<FrameRequestCallback | null>(null);
  const last = useRef(0);
  const shown = useRef(-1);


  // Paint the strip's twelve pictures once, off screen.
  useEffect(() => {
    const out: HTMLCanvasElement[] = [];
    const urls: string[] = [];
    for (let k = 0; k < N; k++) {
      const c = document.createElement('canvas');
      c.width = FW;
      c.height = FH;
      const g = c.getContext('2d');
      // Where the canvas cannot be drawn, each picture is still listed, blank.
      let url = '';
      if (g) {
        drawFrame(g, strip, k, N, FW, FH);
        out.push(c);
        try {
          url = c.toDataURL('image/png');
        } catch {
          url = '';
        }
      }
      urls.push(url);
    }
    frames.current = out.length === N ? out : [];
    setThumbs(urls);
    paint();
    // paint reads only refs; it is stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strip]);

  const paint = useCallback(() => {
    const rps = speed.current;
    drawDrum(drum.current, angle.current, rps, frames.current);
    const f = frameAt(angle.current);
    drawLens(lens.current, frames.current[f], angle.current, rps);
    if (f !== shown.current) {
      shown.current = f;
      // Only while the drum is still or stepped: spinning, the count would race.
      if (rps === 0) setFrame(f);
    }
  }, []);

  const tick = useCallback(
    (now: number) => {
      const dt = Math.min(0.05, (now - last.current) / 1000 || 0);
      last.current = now;
      if (!drag.current) {
        speed.current = approach(speed.current, target.current, dt, target.current > speed.current ? SPIN_UP : SPIN_DOWN);
        angle.current += speed.current * TAU * dt;
      }
      paint();
      if (!drag.current && speed.current === 0 && target.current === 0) {
        // At rest it settles on a picture.
        angle.current = Math.round(angle.current / SLOT) * SLOT;
        paint();
        setFrame(frameAt(angle.current));
        raf.current = 0;
        return;
      }
      raf.current = requestAnimationFrame((n) => loop.current?.(n));
    },
    [paint],
  );

  useEffect(() => {
    loop.current = tick;
  }, [tick]);

  const run = useCallback(() => {
    if (reduced || raf.current) return;
    last.current = performance.now();
    raf.current = requestAnimationFrame((n) => loop.current?.(n));
  }, [reduced]);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  // Redraw as the stage changes size.
  useEffect(() => {
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => paint());
    if (drum.current) ro.observe(drum.current);
    if (lens.current) ro.observe(lens.current);
    return () => ro.disconnect();
  }, [paint, showFrames]);

  const setSpin = (on: boolean) => {
    setSpinning(on);
    target.current = on ? (top / 100) * ZOE_TOP : 0;
    setStatus(on ? 'Spinning.' : 'Slowing down.');
    run();
  };

  const onTop = (v: number) => {
    setTop(v);
    if (spinning) {
      target.current = (v / 100) * ZOE_TOP;
      run();
    }
  };

  const step = (by: number) => {
    setSpinning(false);
    target.current = 0;
    speed.current = 0;
    angle.current = (Math.round(angle.current / SLOT) + by) * SLOT;
    const f = frameAt(angle.current);
    setFrame(f);
    paint();
    setStatus(`Picture ${f + 1} of ${N}.`);
  };

  const goTo = (f: number) => step(f - frameAt(angle.current));

  // A flick sideways across the drum spins it.
  const down = (e: PointerEvent<HTMLCanvasElement>) => {
    if (reduced) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    drag.current = { x: e.clientX, t: performance.now(), v: speed.current };
    run();
  };
  const move = (e: PointerEvent<HTMLCanvasElement>) => {
    const g = drag.current;
    if (!g) return;
    const now = performance.now();
    const w = e.currentTarget.getBoundingClientRect().width || 400;
    const da = ((e.clientX - g.x) / (w * 0.42)) * 0.9;
    angle.current += da;
    const v = da / TAU / Math.max(0.008, (now - g.t) / 1000);
    g.v = Math.max(-ZOE_TOP, Math.min(ZOE_TOP, g.v * 0.6 + v * 0.4));
    g.x = e.clientX;
    g.t = now;
    speed.current = Math.abs(g.v);
  };
  const up = () => {
    const g = drag.current;
    drag.current = null;
    if (!g) return;
    speed.current = Math.min(ZOE_TOP, Math.abs(g.v));
    run();
  };

  return (
    <div className="vz-zoe">
      <div className="vto-toy-area">
        {!showFrames ? (
          <canvas
            ref={drum}
            className="vz-drum"
            role="img"
            aria-label={`A zoetrope: a drum on a stand with slits round its wall, and inside it a strip of pictures. ${s.alt}.`}
            onPointerDown={down}
            onPointerMove={move}
            onPointerUp={up}
            onPointerCancel={up}
          />
        ) : (
          <ol className="vz-frames" aria-label={`${s.name}: the strip's ${N} pictures, side by side`}>
            {thumbs.map((src, i) => (
              <li key={i} aria-current={frame === i ? 'step' : undefined}>
                <button type="button" className="vz-frame" onClick={() => goTo(i)} aria-label={`Picture ${i + 1} of ${N}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {src ? <img src={src} alt="" width={FW} height={FH} /> : <span className="vz-frame-blank" />}
                  <span className="vz-frame-n" aria-hidden="true">{i + 1}</span>
                </button>
              </li>
            ))}
          </ol>
        )}
      </div>

      <div className="vto-controls">
        <p className="vto-intro">{intro}</p>
        <div className="vz-lens-row">
          <figure className="vz-lens">
            <canvas ref={lens} className="vz-lens-canvas" role="img" aria-label={`Through the slits: picture ${frame + 1} of ${N}. ${s.alt}.`} />
            <figcaption>Through the slits</figcaption>
          </figure>
          <div className="vto-picker vto-picker-col" role="group" aria-label="Choose a strip">
            {STRIPS.map((x) => (
              <button key={x.id} type="button" className="vto-pick vto-pick-row" aria-pressed={strip === x.id} onClick={() => onStrip(x.id)}>
                <span className="vto-pick-name">{x.name}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="vto-actions">
          {!reduced && (
            <button type="button" className="vto-button vto-button-primary" aria-pressed={spinning} onClick={() => setSpin(!spinning)}>
              {spinning ? 'Stop' : 'Spin'}
            </button>
          )}
          <button type="button" className="vto-button" onClick={() => step(-1)} aria-label="Previous picture">
            <span aria-hidden="true">←</span>
          </button>
          <span className="vz-count" aria-hidden="true">{spinning ? '·' : `${frame + 1} / ${N}`}</span>
          <button type="button" className="vto-button" onClick={() => step(1)} aria-label="Next picture">
            <span aria-hidden="true">→</span>
          </button>
          <button type="button" className="vto-button vto-button-quiet" aria-pressed={showFrames} onClick={() => setFramesChoice(!showFrames)}>
            {showFrames ? 'Back to the drum' : 'See every picture'}
          </button>
        </div>
        {!reduced && !showFrames && (
          <label className="vz-speed">
            <span>Speed</span>
            <input type="range" min={10} max={100} step={5} value={top} onChange={(e) => onTop(Number(e.target.value))} />
          </label>
        )}
        <p className="vto-caption">{s.caption}</p>
        <FactNote fact={TOY_NOTES.zoetrope} className="vto-fact" />
        {footer}
      </div>
      <p className="vto-status" role="status" aria-live="polite">{status}</p>
    </div>
  );
}

/** Size a canvas to its box and the screen's density; null if it cannot be drawn. */
function prepare(c: HTMLCanvasElement | null) {
  if (!c) return null;
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const W = c.clientWidth;
  const H = c.clientHeight;
  if (!W || !H) return null;
  if (c.width !== Math.round(W * dpr) || c.height !== Math.round(H * dpr)) {
    c.width = Math.round(W * dpr);
    c.height = Math.round(H * dpr);
  }
  const g = c.getContext('2d');
  if (!g) return null;
  g.setTransform(dpr, 0, 0, dpr, 0, 0);
  g.clearRect(0, 0, W, H);
  return { g, W, H };
}

const mix = (a: number[], b: number[], t: number) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(',')})`;
const WALL_DARK = [22, 36, 25];
const WALL_LIGHT = [84, 122, 90];
const SLIT_W = SLOT * 0.16;

/** The drum, from a little above: the strip on the far inside wall, the slits in the near one. */
export function drawDrum(c: HTMLCanvasElement | null, phi: number, rps: number, frames: CanvasImageSource[]) {
  const p = prepare(c);
  if (!p) return;
  const { g, W, H } = p;
  const R = Math.min(W * 0.4, H * 0.46);
  const ry = R * 0.32;
  const Hw = R * 0.62;
  const stand = R * 0.7;
  const cx = W / 2;
  const cy = (H - (2 * ry + Hw + stand)) / 2 + ry;
  // Spinning, the slits show each picture in its place: the strip is drawn where the slits catch it.
  const strobe = rps >= ZOE_STROBE;
  const phiStrip = strobe ? Math.floor(phi / SLOT + 1e-6) * SLOT : phi;
  const slit = slitStrength(rps);

  // The shadow and the stand
  g.fillStyle = 'rgba(40, 30, 28, 0.22)';
  g.beginPath();
  g.ellipse(cx, cy + Hw + stand, R * 0.75, ry * 0.5, 0, 0, TAU);
  g.fill();
  const brass = g.createLinearGradient(cx - R * 0.1, 0, cx + R * 0.1, 0);
  brass.addColorStop(0, '#6e4f1e');
  brass.addColorStop(0.45, '#d9b265');
  brass.addColorStop(1, '#5b3f15');
  g.fillStyle = brass;
  g.fillRect(cx - R * 0.03, cy + Hw, R * 0.06, stand * 0.92);
  // the turned foot, and a collar under the drum
  const foot = cy + Hw + stand * 0.92;
  g.fillStyle = '#4a3214';
  g.fillRect(cx - R * 0.26, foot, R * 0.52, R * 0.05);
  g.beginPath();
  g.ellipse(cx, foot + R * 0.05, R * 0.26, ry * 0.26, 0, 0, Math.PI);
  g.fill();
  g.fillStyle = brass;
  g.beginPath();
  g.ellipse(cx, foot, R * 0.26, ry * 0.26, 0, 0, TAU);
  g.fill();
  g.beginPath();
  g.ellipse(cx, cy + Hw + ry + R * 0.03, R * 0.09, ry * 0.09, 0, 0, TAU);
  g.fill();

  const SL = 120;
  // The far wall, seen from inside: the dark lining, the slits' light, and the strip
  for (let i = 0; i < SL; i++) {
    const t0 = Math.PI + (i * Math.PI) / SL;
    const t1 = t0 + Math.PI / SL;
    const tm = (t0 + t1) / 2;
    const x0 = Math.floor(cx + R * Math.cos(t0));
    const x1 = Math.ceil(cx + R * Math.cos(t1));
    const sw = Math.max(1, x1 - x0);
    const yt = cy + ry * Math.sin(tm);
    g.fillStyle = '#15211a';
    g.fillRect(x0, yt, sw, Hw);
    // the slits, letting in the room's light
    const a = (((tm - phi) % SLOT) + SLOT) % SLOT;
    const inSlit = Math.abs(a - SLOT / 2) < SLIT_W / 2;
    g.fillStyle = `rgba(233, 205, 184, ${inSlit ? 0.75 * slit : 0}`;
    if (inSlit && slit > 0) g.fillRect(x0, yt + Hw * 0.04, sw, Hw * 0.3);
    if (slit < 1) {
      g.fillStyle = `rgba(233, 205, 184, ${0.12 * (1 - slit)})`;
      g.fillRect(x0, yt + Hw * 0.04, sw, Hw * 0.3);
    }
    // the strip
    if (frames.length === N) {
      const alpha = tm - phiStrip;
      const u = (((alpha / SLOT) % N) + N) % N;
      const k = Math.floor(u + 1e-6) % N;
      const fx = Math.min(0.999, Math.max(0, u - k));
      const srcW = Math.max(1, Math.min(FW - fx * FW, ((Math.PI / SL) / SLOT) * FW));
      g.drawImage(frames[pictureAt(k)], fx * FW, 0, srcW, FH, x0, yt + Hw * 0.4, sw, Hw * 0.58);
    }
  }
  // the far wall darker toward the sides, where it turns away
  const shade = g.createLinearGradient(cx - R, 0, cx + R, 0);
  shade.addColorStop(0, 'rgba(10, 16, 12, 0.7)');
  shade.addColorStop(0.28, 'rgba(10, 16, 12, 0.12)');
  shade.addColorStop(0.5, 'rgba(10, 16, 12, 0)');
  shade.addColorStop(0.72, 'rgba(10, 16, 12, 0.12)');
  shade.addColorStop(1, 'rgba(10, 16, 12, 0.7)');
  g.fillStyle = shade;
  g.beginPath();
  g.ellipse(cx, cy, R, ry, 0, Math.PI, TAU);
  g.lineTo(cx + R, cy + Hw);
  g.ellipse(cx, cy + Hw, R, ry, 0, TAU, Math.PI, true);
  g.closePath();
  g.fill();
  // the strip's frame lines: a thin dark edge above and below
  g.strokeStyle = 'rgba(20, 28, 22, 0.8)';
  g.lineWidth = 1;
  for (const f of [0.4, 0.98]) {
    g.beginPath();
    g.ellipse(cx, cy + Hw * f, R, ry, 0, Math.PI, TAU);
    g.stroke();
  }

  // The near wall, outside: lit from the left, the slits cut through its top
  for (let i = 0; i < SL; i++) {
    const t0 = (i * Math.PI) / SL;
    const t1 = t0 + Math.PI / SL;
    const tm = (t0 + t1) / 2;
    const x0 = Math.floor(cx + R * Math.cos(t1));
    const x1 = Math.ceil(cx + R * Math.cos(t0));
    const sw = Math.max(1, x1 - x0);
    const yt = cy + ry * Math.sin(tm);
    const lit = Math.max(0, -0.55 * Math.cos(tm) + 0.83 * Math.sin(tm));
    g.fillStyle = mix(WALL_DARK, WALL_LIGHT, lit);
    g.fillRect(x0, yt, sw, Hw);
    const a = (((tm - phi) % SLOT) + SLOT) % SLOT;
    if (slit > 0 && Math.abs(a - SLOT / 2) < SLIT_W / 2) {
      g.fillStyle = `rgba(8, 14, 10, ${0.92 * slit})`;
      g.fillRect(x0, yt + Hw * 0.04, sw, Hw * 0.3);
    }
    if (slit < 1) {
      g.fillStyle = `rgba(8, 14, 10, ${0.3 * (1 - slit)})`;
      g.fillRect(x0, yt + Hw * 0.04, sw, Hw * 0.3);
    }
    // a painted gold dot between each pair of slits, below them
    if (slit > 0 && Math.abs(a) < SLIT_W * 0.35) {
      g.fillStyle = `rgba(214, 178, 96, ${0.9 * slit * (0.4 + lit * 0.6)})`;
      g.fillRect(x0, yt + Hw * 0.62, sw, Hw * 0.08);
    }
  }
  // gold bands round the drum, and the rims
  g.lineWidth = Math.max(1.5, R * 0.012);
  for (const [f, col] of [
    [0.38, 'rgba(214, 178, 96, 0.9)'],
    [0.86, 'rgba(214, 178, 96, 0.9)'],
  ] as const) {
    g.strokeStyle = col;
    g.beginPath();
    g.ellipse(cx, cy + Hw * f, R, ry, 0, 0, Math.PI);
    g.stroke();
  }
  g.strokeStyle = '#d9b265';
  g.lineWidth = Math.max(2, R * 0.018);
  g.beginPath();
  g.ellipse(cx, cy, R, ry, 0, 0, TAU);
  g.stroke();
  g.strokeStyle = '#1a2a1d';
  g.lineWidth = Math.max(1.5, R * 0.012);
  g.beginPath();
  g.ellipse(cx, cy + Hw, R, ry, 0, 0, Math.PI);
  g.stroke();
}

/** The lens: the picture seen through the front slit, with the slits passing while the drum turns slowly. */
export function drawLens(c: HTMLCanvasElement | null, picture: CanvasImageSource | undefined, phi: number, rps: number) {
  const p = prepare(c);
  if (!p) return;
  const { g, W, H } = p;
  g.save();
  g.beginPath();
  g.ellipse(W / 2, H / 2, W / 2 - 2, H / 2 - 2, 0, 0, TAU);
  g.clip();
  g.fillStyle = '#f4eee3';
  g.fillRect(0, 0, W, H);
  if (picture) {
    const s = Math.max(W / FW, H / FH);
    g.drawImage(picture, (W - FW * s) / 2, (H - FH * s) / 2, FW * s, FH * s);
  }
  // Slowly turning, the slit's edges pass across; faster, they are gone.
  const slit = slitStrength(rps);
  if (slit > 0 && rps > 0) {
    const off = ((((phi % SLOT) + SLOT) % SLOT) / SLOT) * W;
    g.fillStyle = `rgba(20, 30, 22, ${0.55 * slit})`;
    g.fillRect(off - W * 1.2, 0, W * 0.9, H);
    g.fillRect(off + W * 0.3, 0, W * 0.9, H);
  }
  const v = g.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.3, W / 2, H / 2, Math.max(W, H) * 0.56);
  v.addColorStop(0, 'rgba(0,0,0,0)');
  v.addColorStop(1, 'rgba(30, 22, 18, 0.45)');
  g.fillStyle = v;
  g.fillRect(0, 0, W, H);
  g.restore();
}
