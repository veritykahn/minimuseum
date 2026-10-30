'use client';

import { useCallback, useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react';
import { drawFrame } from './strips';
import FactNote from '@/components/exhibition/FactNote';
import { POSTER, STRIPS, TOY_NOTES, type StripId } from './toysText';
import { frameAt, SLIT_SHARE, slitsInView, speedAt, TAU, TOY_SPEEDS, ZOE_FRAMES, zoeSeen } from './spin';
import { useSpeed } from './useSpeed';
import SpeedControl from './SpeedControl';

/*
 * The zoetrope: a drum on a stand, slits round its wall and a strip of
 * twelve drawings inside. It works the way the real one does.
 *
 * The big view is the visitor's eye up against the drum's wall: the dark
 * wall, and the slits running past it. Through each slit shows a sliver of
 * the drawing opposite, and each slit that passes shows the next drawing.
 * Turning slowly, a slit crawls by and only a sliver of a drawing is seen;
 * spun fast, the slits flash past so quickly that the slivers join up into
 * whole drawings, one after another, and the horse gallops. There is no
 * finished, moving picture drawn anywhere: only the wall, the slits, and
 * the strip behind them, as they are at that moment.
 *
 * Beside it, the whole drum from a little above, turning (from above, the
 * strip blurs as it would). "Spin" starts it very slowly and lets it climb,
 * step by small step; the slider sets the speed by hand; a flick sideways
 * across either view spins it too. Under reduced motion the drum stays
 * still, and every drawing is shown side by side, stepped by hand.
 *
 * The drum's look is the owner's painting of a zoetrope (made with
 * Leonardo.Ai, not credited on the page, at the owner's request): its painted band of scrolls turns on
 * the drum's wall, and its turned wooden stand holds the drum up. The
 * slits, and the strip of drawings inside, are drawn here.
 */

const LOOK_SRC = '/exhibitions/seeing-is-deceiving/optical-toys/zoetrope.webp';
/** Where the painting's parts are, in its pixels: the drum's centre and half-width, its band of scrolls, and the stand under it. */
const LOOK = { cx: 1505, r: 420, band: [452, 640], stand: [1205, 655, 600, 520] } as const;
/** The stand's left edge in the painting, top to bottom (the right mirrors it), to cut it from the room behind. */
const STAND_OUTLINE: [number, number][] = [
  [1398, 655], [1404, 700], [1448, 745], [1438, 792], [1398, 858], [1418, 930], [1440, 968],
  [1360, 1008], [1290, 1048], [1236, 1098], [1240, 1148], [1300, 1172], [1505, 1176],
];

export const ZOE_SEEN_LABEL = {
  still: 'Still: one slit, and a sliver of a drawing behind it',
  sliver: 'Slow: a slit crawls past, showing a sliver of a drawing',
  glimpses: 'Faster: glimpses of the drawings flicker past',
  moving: 'Fast: the glimpses join up. Watch the drawings move.',
};

const N = ZOE_FRAMES;
const SLOT = TAU / N;
const FW = 320;
const FH = 240;
/** The picture painted at slot k of the strip, so that the pictures play forward as the drum turns. */
const BACK = Math.round(N * 0.75);
const pictureAt = (slot: number) => (((BACK - slot) % N) + N) % N;

/** How quickly the drum follows the control: a share of the gap closed each second. */
const FOLLOW = 2;
const SPIN_DOWN = 0.45;

/** At rest, the drum stands with a slit in the middle of the view. */
const restAt = (angle: number) => (Math.round(angle / SLOT - 0.5) + 0.5) * SLOT;

export default function Zoetrope({ reduced, strip, onStrip, intro, footer }: { reduced: boolean; strip: StripId; onStrip: (s: StripId) => void; intro: string; footer?: ReactNode }) {
  const s = STRIPS.find((x) => x.id === strip)!;
  const [frame, setFrame] = useState(0);
  // Side by side under reduced motion, until the visitor chooses.
  const [framesChoice, setFramesChoice] = useState<boolean | null>(null);
  const showFrames = framesChoice ?? reduced;
  const [thumbs, setThumbs] = useState<string[]>([]);
  const [status, setStatus] = useState('');

  const drum = useRef<HTMLCanvasElement>(null);
  const eye = useRef<HTMLCanvasElement>(null);
  const frames = useRef<HTMLCanvasElement[]>([]);
  const angle = useRef(SLOT / 2);
  /** The angle a frame ago: the drum's blur, seen from above. */
  const before = useRef(SLOT / 2);
  const speed = useRef(0);
  const target = useRef(0);
  const drag = useRef<{ x: number; t: number; v: number } | null>(null);
  const raf = useRef(0);
  // The frame loop calls itself through a ref, so it always runs the latest tick.
  const loop = useRef<FrameRequestCallback | null>(null);
  const last = useRef(0);
  const look = useRef<HTMLImageElement | null>(null);
  const capRef = useRef(TOY_SPEEDS.zoetrope.top);

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
    drawDrum(drum.current, angle.current, before.current, frames.current, look.current);
    drawEyepiece(eye.current, frames.current, angle.current);
  }, []);

  const tick = useCallback(
    (now: number) => {
      const dt = Math.min(0.05, (now - last.current) / 1000 || 0);
      last.current = now;
      before.current = angle.current;
      if (!drag.current) {
        if (target.current > 0) speed.current += (target.current - speed.current) * Math.min(1, dt * FOLLOW);
        else speed.current = Math.max(0, Math.abs(speed.current) - SPIN_DOWN * dt) * Math.sign(speed.current);
        angle.current += speed.current * TAU * dt;
      }
      if (!drag.current && speed.current === 0 && target.current === 0) {
        // At rest it settles with a slit in the middle of the view.
        angle.current = restAt(angle.current);
        before.current = angle.current;
        paint();
        setFrame(frameAt(angle.current));
        raf.current = 0;
        return;
      }
      paint();
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

  // The painting, loaded once; until it comes (or if it never does), the drum is drawn whole.
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      look.current = img;
      paint();
    };
    img.src = LOOK_SRC;
    return () => {
      img.onload = null;
    };
  }, [paint]);

  // Redraw as the stage changes size.
  useEffect(() => {
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => paint());
    if (drum.current) ro.observe(drum.current);
    if (eye.current) ro.observe(eye.current);
    return () => ro.disconnect();
  }, [paint, showFrames]);

  const onSpeed = useCallback(
    (rps: number) => {
      target.current = rps;
      run();
    },
    [run],
  );
  const sp = useSpeed('zoetrope', onSpeed);
  const rps = speedAt('zoetrope', sp.step);
  const seen = zoeSeen(rps);
  const spinning = sp.step > 0;
  capRef.current = sp.flickerOk ? TOY_SPEEDS.zoetrope.top : speedAt('zoetrope', sp.gate);


  const step = (by: number) => {
    if (spinning) sp.stop();
    target.current = 0;
    speed.current = 0;
    angle.current = restAt(angle.current) + by * SLOT;
    before.current = angle.current;
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
    before.current = angle.current;
    angle.current += da;
    const v = da / TAU / Math.max(0.008, (now - g.t) / 1000);
    const cap = capRef.current;
    g.v = Math.max(-cap, Math.min(cap, g.v * 0.6 + v * 0.4));
    g.x = e.clientX;
    g.t = now;
    speed.current = g.v;
  };
  const up = () => {
    const g = drag.current;
    drag.current = null;
    if (!g) return;
    run();
  };

  return (
    <div className="vz-zoe">
      <div className="vto-toy-area">
        {!showFrames ? (
          <div className="vz-views">
            <figure className="vz-eye">
              <canvas
                ref={eye}
                className="vz-eye-canvas"
                role="img"
                aria-label={`Your eye to the drum’s wall: the slits run past, and through them the strip of drawings inside. ${spinning ? ZOE_SEEN_LABEL[seen] : ZOE_SEEN_LABEL.still}.`}
                onPointerDown={down}
                onPointerMove={move}
                onPointerUp={up}
                onPointerCancel={up}
              />
              <figcaption>Your eye to the slits</figcaption>
            </figure>
            <figure className="vz-outside">
              <canvas
                ref={drum}
                className="vz-drum"
                role="img"
                aria-label={`The whole zoetrope, from a little above: a drum on a stand with slits round its wall, and inside it a strip of drawings. ${s.alt}.`}
                onPointerDown={down}
                onPointerMove={move}
                onPointerUp={up}
                onPointerCancel={up}
              />
              <figcaption>The drum</figcaption>
            </figure>
          </div>
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
        <div className="vto-picker" role="group" aria-label="Choose a strip">
          {STRIPS.map((x) => (
            <button key={x.id} type="button" className="vto-pick" aria-pressed={strip === x.id} onClick={() => onStrip(x.id)}>
              <span className="vto-pick-name">{x.name}</span>
            </button>
          ))}
        </div>
        <div className="vto-actions">
          {!reduced && !showFrames && (
            <button type="button" className="vto-button vto-button-primary" aria-pressed={spinning} onClick={spinning ? sp.stop : sp.start}>
              {spinning ? 'Stop' : 'Spin'}
            </button>
          )}
          <button type="button" className="vto-button" onClick={() => step(-1)} aria-label="Previous picture">
            <span aria-hidden="true">←</span>
          </button>
          {/* Spinning, the count would race: it shows the strip's length until the drum stops. */}
          <span className="vz-count" aria-hidden="true" data-spinning={spinning || undefined}>{spinning ? `– / ${N}` : `${frame + 1} / ${N}`}</span>
          <button type="button" className="vto-button" onClick={() => step(1)} aria-label="Next picture">
            <span aria-hidden="true">→</span>
          </button>
          <button type="button" className="vto-button vto-button-quiet" aria-pressed={showFrames} onClick={() => setFramesChoice(!showFrames)}>
            {showFrames ? 'Back to the drum' : 'See every picture'}
          </button>
        </div>
        {!reduced && !showFrames && (
          <SpeedControl
            step={sp.step}
            gate={sp.gate}
            flickerOk={sp.flickerOk}
            asking={sp.asking}
            turns={rps}
            seen={ZOE_SEEN_LABEL[seen]}
            onStep={sp.setByHand}
            onYes={sp.yes}
            onNo={sp.no}
          />
        )}
        {/* The poster's lines for what is on screen: the toy, then what the brain makes of it. */}
        <p className="vto-caption" aria-live="polite">
          {showFrames || seen === 'still' || seen === 'sliver' ? POSTER.zoetrope : seen === 'glimpses' ? POSTER.nothingMoves : `${POSTER.movies} ${POSTER.screens}`}
        </p>
        <FactNote fact={TOY_NOTES.zoetrope} className="vto-fact" />
        {footer}
      </div>
      <p className="vto-status" role="status" aria-live="polite">{spinning ? `${ZOE_SEEN_LABEL[seen]}.` : status}</p>
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
// The painted drum's dark lacquer, lit from the left.
const WALL_DARK = [16, 12, 10];
const WALL_LIGHT = [86, 64, 44];
const SLIT_W = SLOT * 0.16;

/**
 * The drum, from a little above: the strip on the far inside wall, the slits
 * in the near one. Given the painting, its band and stand dress the drum.
 */
export function drawDrum(c: HTMLCanvasElement | null, phi: number, phiBefore: number, frames: CanvasImageSource[], look: HTMLImageElement | null = null) {
  const p = prepare(c);
  if (!p) return;
  const { g, W, H } = p;
  // The painting's stand is taller than the drawn one: the drum a little smaller to make room.
  const standScale = look ? (2 / (LOOK.r * 2)) * LOOK.stand[3] : 0.7;
  const R = Math.min(W * 0.4, H / (0.64 + 0.62 + standScale + 0.04));
  const ry = R * 0.32;
  const Hw = R * 0.62;
  const stand = R * standScale;
  const cx = W / 2;
  const cy = (H - (2 * ry + Hw + stand)) / 2 + ry;
  // Spinning fast, the drum seen from above blurs: drawn at several moments since the last frame, averaged.
  const samples = blurSamples(phi, phiBefore);

  // The shadow and the stand: the painting's, or drawn
  g.fillStyle = 'rgba(40, 30, 28, 0.22)';
  g.beginPath();
  g.ellipse(cx, cy + Hw + stand, R * 0.75, ry * 0.5, 0, 0, TAU);
  g.fill();
  if (look) {
    // The painting's stand, cut out along its turned outline.
    const [sx, sy, sw, sh] = LOOK.stand;
    const k = R / LOOK.r;
    const top = cy + Hw + ry * 0.4;
    const at = (x: number, y: number): [number, number] => [cx + (x - LOOK.cx) * k, top + (y - sy) * k];
    const half = STAND_OUTLINE.map(([x, y]) => at(x, y));
    const outline = [...half, ...half.slice(0, -1).reverse().map(([x, y]) => [2 * cx - x, y] as [number, number])];
    g.save();
    g.beginPath();
    outline.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
    g.closePath();
    g.clip();
    g.drawImage(look, sx, sy, sw, sh, cx + (sx - LOOK.cx) * k, top, sw * k, sh * k);
    g.restore();
  } else drawStand(g, cx, cy, R, ry, Hw, stand);

  drawWalls(g, cx, cy, R, ry, Hw, samples, frames, look);
}

/** The drawn stand: a brass column on a turned foot. */
function drawStand(g: CanvasRenderingContext2D, cx: number, cy: number, R: number, ry: number, Hw: number, stand: number) {
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
}

/** The moments to draw the drum at, from a frame ago to now: one while it turns slowly, up to five when fast. */
export function blurSamples(phi: number, phiBefore: number) {
  const n = Math.max(1, Math.min(5, Math.ceil(Math.abs(phi - phiBefore) / (SLOT * 0.12))));
  return Array.from({ length: n }, (_, i) => phi - ((phi - phiBefore) * i) / n);
}

/** The share of the moments at which the wall at angle `tm` is open: a slit there. */
function slitCover(tm: number, samples: number[]) {
  let open = 0;
  for (const p of samples) {
    const a = (((tm - p) % SLOT) + SLOT) % SLOT;
    if (Math.abs(a - SLOT / 2) < SLIT_W / 2) open++;
  }
  return open / samples.length;
}

function drawWalls(g: CanvasRenderingContext2D, cx: number, cy: number, R: number, ry: number, Hw: number, samples: number[], frames: CanvasImageSource[], look: HTMLImageElement | null) {
  const phi = samples[0];
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
    g.fillStyle = '#0f1216';
    g.fillRect(x0, yt, sw, Hw);
    // the slits, letting in the room's light
    const open = slitCover(tm, samples);
    if (open > 0) {
      g.fillStyle = `rgba(233, 205, 184, ${0.75 * open})`;
      g.fillRect(x0, yt + Hw * 0.04, sw, Hw * 0.3);
    }
    // the strip, averaged over the moments since the last frame
    if (frames.length === N) {
      samples.forEach((p, i) => {
        const alpha = tm - p;
        const u = (((alpha / SLOT) % N) + N) % N;
        const k = Math.floor(u + 1e-6) % N;
        const fx = Math.min(0.999, Math.max(0, u - k));
        const srcW = Math.max(1, Math.min(FW - fx * FW, ((Math.PI / SL) / SLOT) * FW));
        g.globalAlpha = 1 / (i + 1);
        g.drawImage(frames[pictureAt(k)], fx * FW, 0, srcW, FH, x0, yt + Hw * 0.4, sw, Hw * 0.58);
      });
      g.globalAlpha = 1;
    }
  }
  // the far wall darker toward the sides, where it turns away
  const shade = g.createLinearGradient(cx - R, 0, cx + R, 0);
  shade.addColorStop(0, 'rgba(6, 8, 12, 0.7)');
  shade.addColorStop(0.28, 'rgba(6, 8, 12, 0.12)');
  shade.addColorStop(0.5, 'rgba(6, 8, 12, 0)');
  shade.addColorStop(0.72, 'rgba(6, 8, 12, 0.12)');
  shade.addColorStop(1, 'rgba(6, 8, 12, 0.7)');
  g.fillStyle = shade;
  g.beginPath();
  g.ellipse(cx, cy, R, ry, 0, Math.PI, TAU);
  g.lineTo(cx + R, cy + Hw);
  g.ellipse(cx, cy + Hw, R, ry, 0, TAU, Math.PI, true);
  g.closePath();
  g.fill();
  // the strip's frame lines: a thin dark edge above and below
  g.strokeStyle = 'rgba(10, 12, 16, 0.8)';
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
    // the painting's band of scrolls, turning with the drum: each strip of wall takes the painting's at its angle on the drum
    if (look) {
      const th = (((tm - phi) % Math.PI) + Math.PI) % Math.PI;
      const px = LOOK.cx + LOOK.r * Math.cos(th);
      const pw = Math.max(1, LOOK.r * Math.sin(th) * (Math.PI / SL));
      const [b0, b1] = LOOK.band;
      g.globalAlpha = 0.55 + 0.45 * lit;
      g.drawImage(look, px - pw / 2, b0, pw, b1 - b0, x0, yt + Hw * 0.5, sw, Hw * 0.48);
      g.globalAlpha = 1;
    }
    const a = (((tm - phi) % SLOT) + SLOT) % SLOT;
    const open = slitCover(tm, samples);
    if (open > 0) {
      g.fillStyle = `rgba(4, 6, 9, ${0.92 * open})`;
      g.fillRect(x0, yt + Hw * 0.04, sw, Hw * 0.3);
    }
    // a painted gold dot between each pair of slits, below them (the painting has its scrolls there)
    if (!look && samples.length === 1 && Math.abs(a) < SLIT_W * 0.35) {
      g.fillStyle = `rgba(214, 178, 96, ${0.9 * (0.4 + lit * 0.6)})`;
      g.fillRect(x0, yt + Hw * 0.62, sw, Hw * 0.08);
    }
  }
  // gold bands round the drum, and the rims
  g.lineWidth = Math.max(1.5, R * 0.012);
  for (const [f, col] of [
    [0.38, 'rgba(214, 178, 96, 0.9)'],
    [look ? 0.49 : 0.86, 'rgba(214, 178, 96, 0.9)'],
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
  g.strokeStyle = '#11151a';
  g.lineWidth = Math.max(1.5, R * 0.012);
  g.beginPath();
  g.ellipse(cx, cy + Hw, R, ry, 0, 0, Math.PI);
  g.stroke();
}

/**
 * The eye to the drum's wall, close up: the view is one slit's spacing wide.
 * The wall is drawn dark, and cut where the slits are; through each slit is
 * the drawing opposite it, as far as that slit uncovers it at this moment,
 * and nothing more. Far across the drum, the strip drifts a little the other
 * way as the near wall passes.
 */
export function drawEyepiece(c: HTMLCanvasElement | null, frames: CanvasImageSource[], phi: number) {
  const p = prepare(c);
  if (!p) return;
  const { g, W, H } = p;
  const Sp = W;
  const sw = Sp * SLIT_SHARE;
  const top = H * 0.1;
  const bottom = H * 0.9;
  // The wall: dark lacquer, curving away at both sides.
  const wall = g.createLinearGradient(0, 0, W, 0);
  wall.addColorStop(0, '#120d09');
  wall.addColorStop(0.5, '#3a2a1c');
  wall.addColorStop(1, '#120d09');
  g.fillStyle = wall;
  g.fillRect(0, 0, W, H);
  // Its gold rules, above and below the slits.
  g.fillStyle = 'rgba(214, 178, 96, 0.75)';
  g.fillRect(0, top - H * 0.035, W, Math.max(2, H * 0.012));
  g.fillRect(0, bottom + H * 0.022, W, Math.max(2, H * 0.012));

  const pw = Math.min(Sp * 0.8, (bottom - top) * 0.92 * (FW / FH));
  const ph = pw * (FH / FW);
  for (const s of slitsInView(phi)) {
    const xc = s.x * Sp;
    const x0 = xc - sw / 2;
    if (x0 > W || x0 + sw < 0) continue;
    g.save();
    g.beginPath();
    g.rect(x0, top, sw, bottom - top);
    g.clip();
    // Inside the drum: its dark lining, and the strip on the far wall.
    g.fillStyle = '#0d0b09';
    g.fillRect(x0, top, sw, bottom - top);
    const pic = frames[s.picture];
    const px = W / 2 - 0.12 * (xc - W / 2) - pw / 2;
    const py = (top + bottom) / 2 - ph / 2;
    if (pic) g.drawImage(pic, px, py, pw, ph);
    // The slit's edges in shadow.
    const edge = g.createLinearGradient(x0, 0, x0 + sw, 0);
    edge.addColorStop(0, 'rgba(0,0,0,0.55)');
    edge.addColorStop(0.18, 'rgba(0,0,0,0)');
    edge.addColorStop(0.82, 'rgba(0,0,0,0)');
    edge.addColorStop(1, 'rgba(0,0,0,0.55)');
    g.fillStyle = edge;
    g.fillRect(x0, top, sw, bottom - top);
    g.restore();
  }
  // The eye's own vignette.
  const v = g.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, Math.max(W, H) * 0.62);
  v.addColorStop(0, 'rgba(0,0,0,0)');
  v.addColorStop(1, 'rgba(0,0,0,0.55)');
  g.fillStyle = v;
  g.fillRect(0, 0, W, H);
}
