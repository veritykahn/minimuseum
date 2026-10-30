'use client';

import { useId, useMemo, useState, type CSSProperties } from 'react';
import { surprise as surpriseOf, type SurpriseId } from './surprises';

/*
 * The silly surprises, drawn (SVG and CSS, no photographs): slime that
 * splats on the screen and slides down, a party popper's confetti, a
 * jack-in-the-box on its spring, a rubber chicken, bubbles that pop, and a
 * feather that floats down.
 *
 *   SurpriseBurst   what bursts out of the box, in the dark, across the
 *                   whole screen. Every moving piece is a plain element
 *                   moved by a CSS animation on transform and opacity
 *                   alone (lab.css), so an iPad can hand it all to the
 *                   graphics chip. With motion off (or the visitor's
 *                   reduced-motion setting), nothing splats, drips or
 *                   flies: the still picture simply fades in.
 *   SurpriseArt     the still picture of each, for that, and for when the
 *                   lights come back up.
 *
 * For the slime, the owner's own animation (a transparent WebM) plays
 * instead, if she has dropped one in (assets.ts).
 */

/** A small, seeded random: the same pieces each time a surprise is drawn. */
function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r1 = (n: number) => Math.round(n * 10) / 10;

/** A splat's outline: lumpy, with a few arms flung out, smoothed through its midpoints. */
function splatPath(seed: number, scale = 70) {
  const rand = seeded(seed);
  const n = 18;
  const pts = Array.from({ length: n }, (_, k) => {
    const a = (k / n) * Math.PI * 2 + (rand() - 0.5) * 0.25;
    const arm = k % 2 && rand() < 0.6 ? 0.3 + rand() * 0.2 : 0;
    const r = (0.58 + rand() * 0.2 + arm) * scale;
    return { x: Math.cos(a) * r, y: Math.sin(a) * r };
  });
  const mid = (p: { x: number; y: number }, q: { x: number; y: number }) => ({ x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 });
  const start = mid(pts[n - 1], pts[0]);
  let d = `M ${r1(start.x)} ${r1(start.y)}`;
  pts.forEach((p, k) => {
    const m = mid(p, pts[(k + 1) % n]);
    d += ` Q ${r1(p.x)} ${r1(p.y)} ${r1(m.x)} ${r1(m.y)}`;
  });
  return `${d} Z`;
}

function splatDrops(seed: number) {
  const rand = seeded(seed * 7 + 3);
  return Array.from({ length: 5 }, () => {
    const a = rand() * Math.PI * 2;
    const r = 84 + rand() * 12;
    return { cx: r1(Math.cos(a) * r), cy: r1(Math.sin(a) * r), r: r1(3 + rand() * 5) };
  });
}

/** A splat of green slime, seen through the glass. `drips` draws drips into the picture (for the still). */
function SplatSvg({ seed, drips = false }: { seed: number; drips?: boolean }) {
  const d = useMemo(() => splatPath(seed), [seed]);
  const shine = useMemo(() => splatPath(seed + 11, 30), [seed]);
  const drops = useMemo(() => splatDrops(seed), [seed]);
  return (
    <svg viewBox="-100 -100 200 200" className="fl-su-svg" aria-hidden="true" overflow="visible">
      {drips && (
        <g className="fl-su-slime">
          <path d="M -34 40 L -34 78 Q -34 92 -26 92 Q -18 92 -18 78 L -18 40 Z" />
          <path d="M 6 50 L 6 98 Q 6 112 15 112 Q 24 112 24 98 L 24 50 Z" />
          <path d="M 38 30 L 38 62 Q 38 72 44 72 Q 50 72 50 62 L 50 30 Z" />
        </g>
      )}
      <path d={d} className="fl-su-slime" />
      {drops.map((p, i) => <circle key={i} {...p} className="fl-su-slime" />)}
      <path d={shine} transform="translate(-18 -22)" className="fl-su-slime-shine" />
      <ellipse cx="-30" cy="-34" rx="10" ry="5" transform="rotate(-30 -30 -34)" fill="rgba(255,255,255,0.7)" />
    </svg>
  );
}

function PopperSvg() {
  return (
    <svg viewBox="-40 -40 80 90" className="fl-su-svg" aria-hidden="true">
      <path d="M 0 44 L -22 -24 A 22 7 0 0 0 22 -24 Z" fill="#f2b33d" stroke="#9a6a12" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M -15 -2 L 15 -10 M -9 18 L 9 12" stroke="#ff6fa5" strokeWidth="5" strokeLinecap="round" />
      <ellipse cx="0" cy="-24" rx="22" ry="7" fill="#3b2a12" stroke="#9a6a12" strokeWidth="2.5" />
    </svg>
  );
}

const CONFETTI_COLORS = ['#ff6fa5', '#ffd23f', '#5ad1ff', '#7be07b', '#b48cff', '#ff9a3d'];

function ConfettiStill() {
  const bits = useMemo(() => {
    const rand = seeded(42);
    return Array.from({ length: 22 }, (_, i) => ({
      x: r1((rand() - 0.5) * 170),
      y: r1(-90 + rand() * 90),
      rot: Math.round(rand() * 180),
      fill: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      round: rand() < 0.3,
    }));
  }, []);
  return (
    <svg viewBox="-100 -100 200 200" className="fl-su-svg" aria-hidden="true">
      {bits.map((b, i) =>
        b.round ? (
          <circle key={i} cx={b.x} cy={b.y} r="4.5" fill={b.fill} />
        ) : (
          <rect key={i} x={b.x - 3.5} y={b.y - 6} width="7" height="12" rx="1" fill={b.fill} transform={`rotate(${b.rot} ${b.x} ${b.y})`} />
        ),
      )}
      <g transform="translate(0 52) scale(1.1)">
        <path d="M 0 44 L -22 -24 A 22 7 0 0 0 22 -24 Z" fill="#f2b33d" stroke="#9a6a12" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M -15 -2 L 15 -10 M -9 18 L 9 12" stroke="#ff6fa5" strokeWidth="5" strokeLinecap="round" />
        <ellipse cx="0" cy="-24" rx="22" ry="7" fill="#3b2a12" stroke="#9a6a12" strokeWidth="2.5" />
      </g>
    </svg>
  );
}

/** The jack's ruff: a zigzag collar. */
const RUFF = (() => {
  const pts: string[] = [];
  for (let k = 0; k <= 16; k++) {
    const a = Math.PI + (k / 16) * Math.PI;
    const r = k % 2 ? 22 : 34;
    pts.push(`${r1(Math.cos(a) * r * 1.25)},${r1(36 - Math.sin(a) * r * 0.45)}`);
  }
  return pts.join(' ');
})();

function JackHeadSvg() {
  return (
    <svg viewBox="-50 -72 100 124" className="fl-su-svg" aria-hidden="true">
      <JackHeadInner />
    </svg>
  );
}

function SpringSvg() {
  const pts: string[] = [];
  for (let k = 0; k <= 12; k++) pts.push(`${k % 2 ? 36 : 4},${r1(100 - (k / 12) * 100)}`);
  return (
    <svg viewBox="0 0 40 100" preserveAspectRatio="none" className="fl-su-svg" aria-hidden="true">
      <polyline points={pts.join(' ')} fill="none" stroke="#cfd8e2" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function JackStill() {
  return (
    <svg viewBox="-60 -90 120 200" className="fl-su-svg" aria-hidden="true">
      <polyline points="-14,104 14,94 -14,84 14,74 -14,64 14,54 -14,44 14,34" fill="none" stroke="#cfd8e2" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" />
      <svg x="-50" y="-90" width="100" height="124" viewBox="-50 -72 100 124" overflow="visible">
        <JackHeadInner />
      </svg>
    </svg>
  );
}

/** The head's shapes alone, to sit inside another drawing. */
function JackHeadInner() {
  return (
    <>
      <polygon points={RUFF} fill="#5ad1ff" stroke="#1f6f8f" strokeWidth="2.5" strokeLinejoin="round" />
      <circle cy="8" r="30" fill="#ffd23f" stroke="#a87a12" strokeWidth="2.5" />
      <circle cx="-17" cy="16" r="6" fill="#ff8fb4" opacity="0.8" />
      <circle cx="17" cy="16" r="6" fill="#ff8fb4" opacity="0.8" />
      <ellipse cx="-10" cy="0" rx="5.5" ry="7" fill="#fff" />
      <ellipse cx="10" cy="0" rx="5.5" ry="7" fill="#fff" />
      <circle cx="-9" cy="1.5" r="3.2" fill="#2a1f12" />
      <circle cx="11" cy="1.5" r="3.2" fill="#2a1f12" />
      <path d="M -15 14 Q 0 32 15 14 Z" fill="#7a2a2a" stroke="#5a1e12" strokeWidth="2" strokeLinejoin="round" />
      <path d="M -6 22 Q 0 28 6 22 Q 0 20 -6 22 Z" fill="#ff7f8f" />
      <path d="M -27 -14 L 27 -14 L 4 -64 Z" fill="#8a6cff" stroke="#4b3a9a" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M -17 -30 L 19 -26 M -8 -48 L 13 -45" stroke="#ffd23f" strokeWidth="4" strokeLinecap="round" />
      <circle cx="4" cy="-66" r="7" fill="#ff6fa5" stroke="#b03a6a" strokeWidth="2" />
    </>
  );
}

function ChickenSvg() {
  return (
    <svg viewBox="-60 -92 120 184" className="fl-su-svg" aria-hidden="true">
      <g fill="none" stroke="#e8892b" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M -8 40 L -14 78 M -14 78 l -9 6 M -14 78 l -1 10 M -14 78 l 8 6" />
        <path d="M 10 40 L 16 76 M 16 76 l -8 7 M 16 76 l 1 10 M 16 76 l 9 5" />
      </g>
      <g stroke="#a8740a" strokeWidth="2.5" strokeLinejoin="round">
        <path d="M -30 4 Q -44 -4 -40 -18 Q -32 -8 -26 -6 Z" fill="#ffd93b" />
        <path d="M -30 8 C -40 -12 -18 -24 0 -18 C 14 -14 22 -10 30 2 C 40 20 26 44 0 44 C -24 44 -38 30 -30 8 Z" fill="#ffd93b" />
        <path d="M -12 6 C -2 0 14 6 16 18 C 6 24 -8 20 -12 6 Z" fill="#f4c021" />
      </g>
      <path d="M 4 -14 C 6 -36 0 -52 6 -66" fill="none" stroke="#a8740a" strokeWidth="17" strokeLinecap="round" />
      <path d="M 4 -14 C 6 -36 0 -52 6 -66" fill="none" stroke="#ffd93b" strokeWidth="12" strokeLinecap="round" />
      <g stroke="#a8740a" strokeWidth="2.5" strokeLinejoin="round">
        <path d="M -2 -80 Q -2 -92 6 -88 Q 8 -100 16 -93 Q 24 -101 25 -89 Q 13 -87 -2 -80 Z" fill="#e5483b" />
        <circle cx="8" cy="-70" r="13" fill="#ffd93b" />
        <path d="M 19 -75 L 42 -71 L 20 -67 Z" fill="#f08a24" />
        <path d="M 19 -65 L 37 -57 L 18 -61 Z" fill="#f08a24" />
        <path d="M 17 -62 Q 22 -52 16 -50 Q 11 -54 17 -62 Z" fill="#e5483b" />
      </g>
      <circle cx="10" cy="-73" r="4.5" fill="#fff" />
      <circle cx="11.5" cy="-73" r="2.2" fill="#222" />
    </svg>
  );
}

function BubblesStill() {
  const id = useId().replace(/:/g, '');
  const bubbles = [
    { cx: -30, cy: 20, r: 34 },
    { cx: 34, cy: -10, r: 26 },
    { cx: -4, cy: -52, r: 20 },
    { cx: 46, cy: 50, r: 16 },
    { cx: -56, cy: -36, r: 12 },
    { cx: 18, cy: 58, r: 10 },
  ];
  return (
    <svg viewBox="-100 -100 200 200" className="fl-su-svg" aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-b`} cx="35%" cy="32%" r="70%">
          <stop offset="0" stopColor="#fff" stopOpacity="0.95" />
          <stop offset="0.14" stopColor="#fff" stopOpacity="0.15" />
          <stop offset="0.65" stopColor="#9fe6ff" stopOpacity="0.16" />
          <stop offset="1" stopColor="#d0a8ff" stopOpacity="0.6" />
        </radialGradient>
      </defs>
      {bubbles.map((b, i) => (
        <circle key={i} {...b} fill={`url(#${id}-b)`} stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" />
      ))}
    </svg>
  );
}

function FeatherSvg() {
  const barbs: string[] = [];
  for (let y = -72; y <= 60; y += 16) barbs.push(`M 0 ${y} L -15 ${y + 10} M 1 ${y + 6} L 14 ${y + 15}`);
  return (
    <svg viewBox="-30 -100 60 205" className="fl-su-svg" aria-hidden="true">
      <path d="M 1 82 C -22 50 -26 -30 -4 -96 C 2 -98 4 -96 6 -92 C 24 -40 22 40 1 82 Z" fill="#f7d6e6" stroke="#e2a9c4" strokeWidth="1.5" />
      <path d={barbs.join(' ')} stroke="#e7b4cc" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M 1 82 q -10 4 -12 12 M 1 82 q 9 3 11 11 M 1 76 q -12 0 -16 6" stroke="#f7d6e6" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M 1 100 Q 4 0 -3 -92" stroke="#fff8ef" strokeWidth="2.6" strokeLinecap="round" fill="none" />
    </svg>
  );
}

/** The still picture of a surprise. */
export function SurpriseArt({ id, className = '' }: { id: SurpriseId; className?: string }) {
  const s = surpriseOf(id);
  return (
    <div className={`fl-su-art ${className}`} data-id={id} role="img" aria-label={s.alt}>
      {id === 'slime' && <SplatSvg seed={13} drips />}
      {id === 'confetti' && <ConfettiStill />}
      {id === 'jack' && <JackStill />}
      {id === 'chicken' && <ChickenSvg />}
      {id === 'bubbles' && <BubblesStill />}
      {id === 'feather' && <FeatherSvg />}
    </div>
  );
}

type Vars = Record<string, string | number>;
const vars = (v: Vars) => v as unknown as CSSProperties;

/** Where the slime lands, from the box's mouth: across, up (in vw/vh), its size (vmin), and how far it slides. */
const SPLATS = [
  { x: 0, y: -10, size: 64, slide: 9, rot: 8, delay: 0, seed: 22, drips: [34, 50, 64] },
  { x: -31, y: -30, size: 26, slide: 22, rot: -20, delay: 120, seed: 9, drips: [40, 60] },
  { x: 30, y: -26, size: 30, slide: 18, rot: 30, delay: 60, seed: 14, drips: [36, 52, 66] },
  { x: -36, y: 6, size: 21, slide: 26, rot: 60, delay: 200, seed: 21, drips: [48] },
  { x: 35, y: 12, size: 23, slide: 24, rot: -45, delay: 160, seed: 27, drips: [42, 60] },
  { x: -12, y: -38, size: 15, slide: 30, rot: 10, delay: 240, seed: 33, drips: [50] },
  { x: 16, y: -40, size: 12, slide: 32, rot: -70, delay: 280, seed: 38, drips: [48] },
];

function SlimeBurst() {
  return (
    <>
      {SPLATS.map((p, i) => {
        const rand = seeded(p.seed);
        return (
          <div
            key={i}
            className="fl-su-piece fl-su-splat"
            style={vars({ '--x': `${p.x}vw`, '--y': `${p.y}vh`, '--size': `${p.size}vmin`, '--slide': `${p.slide}vh`, '--rot': `${p.rot}deg`, '--d': `${p.delay}ms` })}
          >
            {p.drips.map((left, k) => (
              <span
                key={k}
                className="fl-su-drip"
                style={vars({ left: `${left}%`, '--w': `${r1(5 + rand() * 5)}%`, '--len': `${Math.round(40 + rand() * 50)}%`, '--dd': `${p.delay + 800 + Math.round(rand() * 400)}ms` })}
              />
            ))}
            <SplatSvg seed={p.seed} />
          </div>
        );
      })}
    </>
  );
}

function ConfettiBurst({ count }: { count: number }) {
  const bits = useMemo(() => {
    const rand = seeded(7);
    return Array.from({ length: count }, (_, i) => {
      const spread = (rand() - 0.5) * 2;
      return {
        dx: `${r1(spread * (30 + rand() * 25))}vw`,
        up: `${-Math.round(14 + rand() * 22)}vh`,
        fall: `${Math.round(45 + rand() * 35)}vh`,
        spin: `${Math.round((rand() - 0.5) * 1440)}deg`,
        d: `${Math.round(rand() * 260)}ms`,
        dur: `${Math.round(2300 + rand() * 1000)}ms`,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        shape: rand() < 0.25 ? 'dot' : rand() < 0.15 ? 'streamer' : 'rect',
      };
    });
  }, [count]);
  return (
    <>
      <div className="fl-su-piece fl-su-popper">
        <PopperSvg />
      </div>
      {bits.map((b, i) => (
        <span key={i} className="fl-su-piece fl-su-bit" style={vars({ '--dx': b.dx, '--up': b.up, '--fall': b.fall, '--spin': b.spin, '--d': b.d, '--dur': b.dur })}>
          <i data-shape={b.shape} style={{ background: b.color }} />
        </span>
      ))}
    </>
  );
}

function JackBurst() {
  return (
    <div className="fl-su-jack">
      <div className="fl-su-spring">
        <SpringSvg />
      </div>
      <div className="fl-su-head">
        <div className="fl-su-head-sway">
          <JackHeadSvg />
        </div>
      </div>
    </div>
  );
}

function BubblesBurst({ count }: { count: number }) {
  const bubbles = useMemo(() => {
    const rand = seeded(3);
    return Array.from({ length: count }, () => ({
      dx: `${r1((rand() - 0.5) * 80)}vw`,
      rise: `${-Math.round(18 + rand() * 40)}vh`,
      size: `${r1(4 + rand() * 9)}vmin`,
      d: `${Math.round(rand() * 900)}ms`,
      dur: `${Math.round(1400 + rand() * 1600)}ms`,
      wob: `${r1(0.5 + rand() * 0.5)}s`,
    }));
  }, [count]);
  return (
    <>
      {bubbles.map((b, i) => (
        <span key={i} className="fl-su-piece fl-su-bubble" style={vars({ '--dx': b.dx, '--rise': b.rise, '--size': b.size, '--d': b.d, '--dur': b.dur, '--wob': b.wob })}>
          <i />
        </span>
      ))}
    </>
  );
}

export default function SurpriseBurst({ id, still, video }: { id: SurpriseId; still: boolean; video?: string | null }) {
  const [small] = useState(() => typeof window !== 'undefined' && window.innerWidth < 600);
  const [videoFailed, setVideoFailed] = useState(false);
  const picture = (
    <div className="fl-fb-gift fl-su-still">
      <SurpriseArt id={id} />
    </div>
  );
  if (still)
    return (
      <div className="fl-su" data-id={id} data-still="true" aria-hidden="true">
        {picture}
      </div>
    );
  if (video && !videoFailed)
    return (
      <div className="fl-su" data-id={id} data-kind="video" aria-hidden="true">
        <video className="fl-su-video" src={video} autoPlay muted playsInline onError={() => setVideoFailed(true)} />
      </div>
    );
  return (
    <div className="fl-su" data-id={id} aria-hidden="true">
      <div className="fl-su-burst">
        {id === 'slime' && <SlimeBurst />}
        {id === 'confetti' && <ConfettiBurst count={small ? 40 : 70} />}
        {id === 'jack' && <JackBurst />}
        {id === 'chicken' && (
          <div className="fl-su-piece fl-su-chicken">
            <ChickenSvg />
          </div>
        )}
        {id === 'bubbles' && <BubblesBurst count={small ? 14 : 22} />}
        {id === 'feather' && (
          <div className="fl-su-piece fl-su-feather">
            <div className="fl-su-feather-sway">
              <FeatherSvg />
            </div>
          </div>
        )}
      </div>
      {/* With the visitor's reduced-motion setting, the still picture shows instead (lab.css). */}
      <div className="fl-su-fallback">{picture}</div>
    </div>
  );
}
