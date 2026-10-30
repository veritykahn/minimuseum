'use client';

import { useCallback, useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react';
import { drawFrame } from './strips';
import FactNote from '@/components/exhibition/FactNote';
import { POSTER, STRIPS, TOY_NOTES, type StripId } from './toysText';
import { approach, frameAt, slitStrength, TAU, ZOE_FRAMES, ZOE_LADDER, ZOE_STROBE, ZOE_TOP, zoeSeen } from './spin';
import { useLadder } from './useLadder';
import SpeedLadder from './SpeedLadder';

/*
 * The zoetrope: a drum on a stand, slits round its wall and a strip of
 * twelve drawings inside. Drawn on a canvas, as seen from a little above.
 * Spin it and it starts slowly, so each drawing is seen going round past
 * the slits; then it climbs, rung by rung, until the slits blur to a band
 * and the drawings, glimpsed one at a time, move in place: the horses
 * gallop, the people dance. Faster and slower step by hand, and a flick
 * sideways across the drum spins it too. The lens beside it shows the
 * drawing seen through the front slit. Step through the drawings one by
 * one, or see them all side by side: under reduced motion the drum stays
 * still and that is how it is seen.
 *
 * The drum's look is the owner's painting of a zoetrope (made with
 * Leonardo.Ai, not credited on the page, at the owner's request): its painted band of scrolls turns on
 * the drum's wall, and its turned wooden stand holds the drum up. The
 * slits, and the strip of drawings inside, are still drawn here.
 */

const LOOK_SRC = '/exhibitions/seeing-is-deceiving/optical-toys/zoetrope.webp';
/** Where the painting's parts are, in its pixels: the drum's centre and half-width, its band of scrolls, and the stand under it. */
const LOOK = { cx: 1505, r: 420, band: [452, 640], stand: [1205, 655, 600, 520] } as const;
/** The stand's left edge in the painting, top to bottom (the right mirrors it), to cut it from the room behind. */
const STAND_OUTLINE: [number, number][] = [
  [1398, 655], [1404, 700], [1448, 745], [1438, 792], [1398, 858], [1418, 930], [1440, 968],
  [1360, 1008], [1290, 1048], [1236, 1098], [1240, 1148], [1300, 1172], [1505, 1176],
];

const SEEN_LABEL = {
  drawings: 'Slow enough to see each drawing go round',
  moving: 'Each drawing glimpsed in place, one after another',
};

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
  const look = useRef<HTMLImageElement | null>(null);


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
    drawDrum(drum.current, angle.current, rps, frames.current, look.current);
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
    if (lens.current) ro.observe(lens.current);
    return () => ro.disconnect();
  }, [paint, showFrames]);

  const onRung = useCallback(
    (rps: number, rung: number) => {
      target.current = rps;
      setStatus(rung < 0 ? 'Slowing down.' : `Speed ${rung + 1} of ${ZOE_LADDER.length}: ${SEEN_LABEL[zoeSeen(rps)].toLowerCase()}.`);
      run();
    },
    [run],
  );
  const ladder = useLadder(ZOE_LADDER, onRung);
  const spinning = ladder.rung >= 0;
  const seen = spinning ? zoeSeen(ZOE_LADDER[ladder.rung].rps) : 'drawings';

  const step = (by: number) => {
    if (spinning) ladder.stop();
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
            <button type="button" className="vto-button vto-button-primary" aria-pressed={spinning} onClick={spinning ? ladder.stop : ladder.start}>
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
          <SpeedLadder
            ladder={ZOE_LADDER}
            rung={ladder.rung}
            climbing={ladder.climbing}
            seen={SEEN_LABEL[seen]}
            onFaster={spinning ? ladder.faster : ladder.start}
            onSlower={ladder.slower}
            onClimb={ladder.climb}
          />
        )}
        {/* The poster's lines for what is on screen: the toy, then what the brain makes of it. */}
        <p className="vto-caption" aria-live="polite">
          {seen === 'drawings' || showFrames ? POSTER.zoetrope : ladder.top ? `${POSTER.movies} ${POSTER.screens}` : POSTER.nothingMoves}
        </p>
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
// The painted drum's dark lacquer, lit from the left.
const WALL_DARK = [16, 12, 10];
const WALL_LIGHT = [86, 64, 44];
const SLIT_W = SLOT * 0.16;

/**
 * The drum, from a little above: the strip on the far inside wall, the slits
 * in the near one. Given the painting, its band and stand dress the drum.
 */
export function drawDrum(c: HTMLCanvasElement | null, phi: number, rps: number, frames: CanvasImageSource[], look: HTMLImageElement | null = null) {
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
  // Spinning, the slits show each picture in its place: the strip is drawn where the slits catch it.
  const strobe = rps >= ZOE_STROBE;
  const phiStrip = strobe ? Math.floor(phi / SLOT + 1e-6) * SLOT : phi;
  const slit = slitStrength(rps);

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

  drawWalls(g, cx, cy, R, ry, Hw, phi, phiStrip, slit, frames, look);
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

function drawWalls(g: CanvasRenderingContext2D, cx: number, cy: number, R: number, ry: number, Hw: number, phi: number, phiStrip: number, slit: number, frames: CanvasImageSource[], look: HTMLImageElement | null) {
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
    const a = (((tm - phi) % SLOT) + SLOT) % SLOT;
    const inSlit = Math.abs(a - SLOT / 2) < SLIT_W / 2;
    g.fillStyle = `rgba(233, 205, 184, ${inSlit ? 0.75 * slit : 0})`;
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
    if (slit > 0 && Math.abs(a - SLOT / 2) < SLIT_W / 2) {
      g.fillStyle = `rgba(4, 6, 9, ${0.92 * slit})`;
      g.fillRect(x0, yt + Hw * 0.04, sw, Hw * 0.3);
    }
    if (slit < 1) {
      g.fillStyle = `rgba(4, 6, 9, ${0.3 * (1 - slit)})`;
      g.fillRect(x0, yt + Hw * 0.04, sw, Hw * 0.3);
    }
    // a painted gold dot between each pair of slits, below them (the painting has its scrolls there)
    if (!look && slit > 0 && Math.abs(a) < SLIT_W * 0.35) {
      g.fillStyle = `rgba(214, 178, 96, ${0.9 * slit * (0.4 + lit * 0.6)})`;
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
    g.fillStyle = `rgba(10, 12, 16, ${0.55 * slit})`;
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
