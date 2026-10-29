'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { usePrefersReducedMotion } from '@/lib/a11y/usePrefersReducedMotion';
import FactNote from '@/components/exhibition/FactNote';
import { STONE_CUSTOM } from '../holocaust';
import type { LayResult, useStones } from './useStones';

/*
 * The memorial stone: a block of grey granite with the Star of David cut
 * into its face, and on its ledge the stones visitors have laid. One canvas
 * for the stones, not one element each. Each stone has its own place (from
 * its number) and settles on whatever is already there, so the heap only
 * ever grows. A few stones are drawn large; as the count climbs they are
 * drawn smaller, until the ledge is covered; past what it can hold, it
 * simply stays full.
 *
 * The room is lit from one light above: its beam falls on the stone, with a
 * little dust turning slowly in it, and pools on the floor in front. The
 * stone is grey granite on a darker base, with the ledge's upper face
 * catching the light; the granite, the ledge, the wall and the floor are the
 * owner's textures (Leonardo.Ai, credited under the panel), scenery only.
 *
 * Nothing moves but the visitor's own stone, settling once, the dust, and a
 * slow light over the granite (memorial-stone.css); with reduced motion,
 * none of them.
 */

/** If the count can't be reached, the ledge shows twenty-seven stones, for January 27. */
export const FALLBACK_STONES = 27;

export type LaidStone = { i: number; x: number; y: number; w: number; h: number };

/** A cheap, stable hash of a stone's number to 0–1. */
function hash01(i: number, salt: number) {
  let h = Math.imul(i ^ 0x9e3779b9, 0x85ebca6b) ^ Math.imul(salt + 1, 0xc2b2ae35);
  h ^= h >>> 13;
  h = Math.imul(h, 0x27d4eb2f);
  h ^= h >>> 15;
  return (h >>> 0) / 4294967296;
}

/**
 * The stones' size for a count, as a share of the ledge. It steps rather
 * than slides, so between steps every stone keeps its place as more are laid.
 */
function stoneScale(count: number) {
  if (count <= 12) return 1 / 13;
  if (count <= 40) return 1 / 20;
  if (count <= 150) return 1 / 30;
  if (count <= 600) return 1 / 44;
  return 1 / 64;
}

/**
 * Where the first `count` stones lie on a ledge `w` wide, in a heap no
 * higher than `maxH` (CSS px). x is the stone's left edge; y is the height
 * of its foot above the ledge. Each stone falls at its own place along the
 * ledge and settles into the lowest hollow near it, then rolls off any crown
 * it lands on, down whichever side is lower, so the stones lie in layers
 * with sloping sides rather than towers; the heap rises highest in the
 * middle of the ledge, lower toward its ends. Once it is full, no more are drawn, so a
 * million costs no more than a full ledge.
 */
export function heapLayout(count: number, w: number, maxH: number): LaidStone[] {
  if (count <= 0 || w <= 0 || maxH <= 0) return [];
  const base = Math.max(9, Math.min(48, w * stoneScale(count)));
  const bin = 2;
  const heights = new Float32Array(Math.ceil(w / bin) + 1);
  const restOn = (x: number, sw: number) => {
    let under = 0;
    for (let b = Math.floor((x + sw * 0.2) / bin); b <= Math.floor((x + sw * 0.8) / bin); b++) under = Math.max(under, heights[b]);
    return under;
  };
  const out: LaidStone[] = [];
  let misses = 0;
  for (let i = 0; i < count && i < 30000; i++) {
    const [sw, sh] = stoneSize(i, base);
    // Where it falls, then the lowest hollow within reach of it.
    const fall = hash01(i, 3) * (w - sw);
    let x = fall;
    let under = restOn(fall, sw);
    for (let c = -4; c <= 4; c++) {
      const cx = Math.min(w - sw, Math.max(0, fall + c * sw * 0.4));
      const u = restOn(cx, sw);
      if (u < under - 0.5) {
        under = u;
        x = cx;
      }
    }
    // Then it rolls, off a crown and down the lower side, as a stone does on a heap.
    for (let roll = 0; roll < 8; roll++) {
      const l = Math.max(0, x - sw * 0.5);
      const r = Math.min(w - sw, x + sw * 0.5);
      const ul = restOn(l, sw);
      const ur = restOn(r, sw);
      const [bx, bu] = ul <= ur ? [l, ul] : [r, ur];
      if (bu >= under - sh * 0.3) break;
      x = bx;
      under = bu;
    }
    const y = Math.max(0, under - sh * 0.35);
    // The heap's height here: a low mound, highest mid-ledge, its crest uneven as a heap laid by hand is.
    const u = (x + sw / 2) / w;
    const lumps = 0.9 + 0.06 * Math.sin(u * 17.3 + 1.1) + 0.04 * Math.sin(u * 41.9 + 2.3);
    const room = maxH * lumps * (0.05 + 0.95 * Math.pow(Math.sin(Math.PI * u), 0.7));
    if (y + sh > room) {
      if (++misses > 400) break;
      continue;
    }
    misses = 0;
    for (let b = Math.floor((x + sw * 0.1) / bin); b <= Math.floor((x + sw * 0.9) / bin); b++) heights[b] = Math.max(heights[b], y + sh * 0.85);
    out.push({ i, x, y, w: sw, h: sh });
  }
  return out;
}

/**
 * A stone's size (CSS px, width then height), from its number: stones
 * gathered by hand are not alike. Some are flat, skimming stones; most are
 * rounded pebbles; a few stand taller than they are wide; now and then one
 * is larger than the rest. Small ones are commoner than large.
 */
function stoneSize(i: number, base: number): [number, number] {
  const kind = hash01(i, 6);
  const a = hash01(i, 1);
  const b = hash01(i, 2);
  let sw: number;
  let sh: number;
  if (kind < 0.32) {
    sw = base * (0.8 + a * 0.6);
    sh = sw * (0.36 + b * 0.14);
  } else if (kind < 0.84) {
    sw = base * (0.6 + a * a * 0.6);
    sh = sw * (0.6 + b * 0.2);
  } else {
    sw = base * (0.5 + a * 0.3);
    sh = sw * (0.82 + b * 0.24);
  }
  if (hash01(i, 7) > 0.94) {
    sw *= 1.3;
    sh *= 1.3;
  }
  return [sw, sh];
}

/* The stones' colours: the greys, creams and browns of stones gathered by hand, a blue-grey slate, a near-black basalt, a white quartz. */
const TONES = ['#8d8781', '#a29a90', '#c9c2b6', '#e3ddd2', '#6e6964', '#b3a48f', '#7f776c', '#d6cfc2', '#5d5955', '#9c8f7e', '#6f7378', '#3f3c3a', '#efebe4', '#a08a74', '#868a84'];

function lighten(hex: string, by: number) {
  const n = parseInt(hex.slice(1), 16);
  const mix = (c: number) => Math.round(c + (255 - c) * by);
  return `rgb(${mix(n >> 16)},${mix((n >> 8) & 255)},${mix(n & 255)})`;
}
/** A tone darkened, still as #rrggbb (so it can be lightened and darkened again). */
function darkenHex(hex: string, by: number) {
  if (by <= 0) return hex;
  const n = parseInt(hex.slice(1), 16);
  const mix = (c: number) => Math.round(c * (1 - by));
  return `#${((mix(n >> 16) << 16) | (mix((n >> 8) & 255) << 8) | mix(n & 255)).toString(16).padStart(6, '0')}`;
}
/** A tone lightened, still as #rrggbb. */
function lightenHex(hex: string, by: number) {
  const n = parseInt(hex.slice(1), 16);
  const mix = (c: number) => Math.round(c + (255 - c) * by);
  return `#${((mix(n >> 16) << 16) | (mix((n >> 8) & 255) << 8) | mix(n & 255)).toString(16).padStart(6, '0')}`;
}
function darken(hex: string, by: number) {
  const n = parseInt(hex.slice(1), 16);
  const mix = (c: number) => Math.round(c * (1 - by));
  return `rgb(${mix(n >> 16)},${mix((n >> 8) & 255)},${mix(n & 255)})`;
}

/**
 * One stone: an uneven, rounded outline, lit from above and to the left.
 * `dim` (0–1) darkens it, for the stones deep in the heap, in the shade of
 * those above them.
 */
function drawStone(g: CanvasRenderingContext2D, s: LaidStone, ledgeY: number, lift = 0, alpha = 1, dim = 0) {
  const cx = s.x + s.w / 2;
  const cy = ledgeY - s.y - s.h / 2 - lift;
  // Its tone, a little lighter or darker than the next stone of the same kind.
  const jitter = (hash01(s.i, 8) - 0.5) * 0.18;
  const picked = TONES[Math.floor(hash01(s.i, 4) * TONES.length)];
  const tone = darkenHex(jitter > 0 ? lightenHex(picked, jitter) : picked, dim + Math.max(0, -jitter));
  // The smallest stones cast the faintest shadows, or a full ledge reads as a tray of coins.
  const shadow = Math.min(1, 0.35 + s.w / 30);
  // An irregular outline: seven to eleven corners, rounded off, and on some stones one side worn flat.
  const k = 7 + Math.floor(hash01(s.i, 9) * 5);
  const facet = hash01(s.i, 30) < 0.45 ? hash01(s.i, 31) * Math.PI * 2 : null;
  const pts: [number, number][] = [];
  for (let j = 0; j < k; j++) {
    const a = (j / k) * Math.PI * 2 + hash01(s.i, 5) * 0.6;
    let r = 0.82 + hash01(s.i, 10 + j) * 0.26;
    if (facet !== null && Math.cos(a - facet) > 0.7) r = Math.min(r, 0.84);
    // A flatter underside, so each stone sits rather than balances.
    const sy = Math.sin(a) > 0 ? Math.min(1, Math.sin(a) * 1.25) : Math.sin(a);
    pts.push([cx + Math.cos(a) * (s.w / 2) * r, cy + sy * (s.h / 2) * r]);
  }
  g.globalAlpha = alpha;
  // Its shadow: a soft one where the light falls past it, and a dark line where it touches.
  g.fillStyle = `rgba(0,0,0,${0.28 * shadow})`;
  g.beginPath();
  g.ellipse(cx + s.w * 0.1, cy + s.h * 0.4 + lift, s.w * 0.58, s.h * 0.26, 0, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = `rgba(0,0,0,${0.45 * shadow})`;
  g.beginPath();
  g.ellipse(cx + s.w * 0.03, cy + s.h * 0.46 + lift, s.w * 0.4, s.h * 0.1, 0, 0, Math.PI * 2);
  g.fill();
  // Its body, lit from above and to the left, darker underneath.
  const grad = g.createRadialGradient(cx - s.w * 0.2, cy - s.h * 0.34, s.w * 0.04, cx + s.w * 0.04, cy + s.h * 0.05, s.w * 0.66);
  grad.addColorStop(0, lighten(tone, 0.36));
  grad.addColorStop(0.5, tone);
  grad.addColorStop(1, darken(tone, 0.55));
  g.fillStyle = grad;
  stonePath(g, pts);
  g.fill();
  // The stone's grain, on all but the smallest.
  const grain = s.w > 12 ? grainPattern(g) : null;
  if (grain) {
    g.save();
    stonePath(g, pts);
    g.clip();
    g.globalAlpha = alpha * 0.55;
    g.fillStyle = grain;
    g.fillRect(s.x - 2, cy - s.h, s.w + 4, s.h * 2);
    g.restore();
    g.globalAlpha = alpha;
  }
  // Now and then a pale vein of quartz across a larger stone.
  if (s.w > 20 && hash01(s.i, 40) < 0.16) {
    g.save();
    stonePath(g, pts);
    g.clip();
    g.strokeStyle = `rgba(245,240,230,${0.45 * alpha})`;
    g.lineWidth = Math.max(0.8, s.w / 40);
    const tilt = (hash01(s.i, 41) - 0.5) * s.h;
    g.beginPath();
    g.moveTo(s.x - 2, cy - tilt);
    g.quadraticCurveTo(cx, cy + (hash01(s.i, 42) - 0.5) * s.h * 0.6, s.x + s.w + 2, cy + tilt);
    g.stroke();
    g.restore();
  }
  // A soft sheen where the light falls on its crown, and a dark rim round it.
  const sheen = g.createRadialGradient(cx - s.w * 0.16, cy - s.h * 0.3, 0, cx - s.w * 0.16, cy - s.h * 0.3, s.w * 0.3);
  sheen.addColorStop(0, 'rgba(255,250,240,0.16)');
  sheen.addColorStop(1, 'rgba(255,250,240,0)');
  g.fillStyle = sheen;
  stonePath(g, pts);
  g.fill();
  g.strokeStyle = 'rgba(12,10,8,0.35)';
  g.lineWidth = Math.max(0.5, s.w / 70);
  g.stroke();
  g.globalAlpha = 1;
}

function stonePath(g: CanvasRenderingContext2D, pts: [number, number][]) {
  const k = pts.length;
  const mid = (a: [number, number], b: [number, number]) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2] as const;
  const m0 = mid(pts[k - 1], pts[0]);
  g.beginPath();
  g.moveTo(m0[0], m0[1]);
  for (let j = 0; j < k; j++) {
    const m = mid(pts[j], pts[(j + 1) % k]);
    g.quadraticCurveTo(pts[j][0], pts[j][1], m[0], m[1]);
  }
  g.closePath();
}

/** A tile of fine speckle, light and dark, laid over each stone as its grain (made once). */
let grainTile: HTMLCanvasElement | null = null;
function grainPattern(g: CanvasRenderingContext2D): CanvasPattern | null {
  if (!grainTile) {
    const tile = document.createElement('canvas');
    tile.width = tile.height = 96;
    const t = tile.getContext('2d');
    if (!t) return null;
    for (let i = 0; i < 900; i++) {
      const light = hash01(i, 50) > 0.55;
      t.fillStyle = light ? `rgba(255,248,236,${0.08 + hash01(i, 51) * 0.18})` : `rgba(20,16,12,${0.1 + hash01(i, 52) * 0.25})`;
      t.beginPath();
      t.arc(hash01(i, 54) * 96, hash01(i, 55) * 96, 0.3 + hash01(i, 53) * 0.9, 0, Math.PI * 2);
      t.fill();
    }
    grainTile = tile;
  }
  return g.createPattern(grainTile, 'repeat');
}

/**
 * The heap's own shadow, soft, round its foot: its outline filled far off
 * the canvas so that only its blurred shadow falls in place (a canvas
 * shadow, so it is soft in every browser).
 */
function heapShadow(g: CanvasRenderingContext2D, stones: LaidStone[], ledgeY: number, dpr: number) {
  if (stones.length === 0) return;
  const bin = 6;
  let x0 = Infinity;
  let x1 = -Infinity;
  for (const s of stones) {
    x0 = Math.min(x0, s.x);
    x1 = Math.max(x1, s.x + s.w);
  }
  const n = Math.ceil((x1 - x0) / bin) + 1;
  const tops = new Float32Array(n);
  for (const s of stones) {
    for (let b = Math.floor((s.x + s.w * 0.15 - x0) / bin); b <= Math.floor((s.x + s.w * 0.85 - x0) / bin); b++) tops[b] = Math.max(tops[b], s.y + s.h * 0.8);
  }
  const away = 10000;
  g.save();
  g.shadowColor = 'rgba(0,0,0,0.6)';
  g.shadowBlur = 16 * dpr;
  g.shadowOffsetX = away * dpr;
  g.shadowOffsetY = 5 * dpr;
  g.fillStyle = '#000';
  g.beginPath();
  g.moveTo(x0 - away, ledgeY + 6);
  for (let b = 0; b < n; b++) g.lineTo(x0 + b * bin - away, ledgeY - tops[b] * 0.9);
  g.lineTo(x1 - away, ledgeY + 6);
  g.closePath();
  g.fill();
  g.restore();
}

/**
 * The scene: the dark room, the light from above, the granite stone with
 * the star cut into it, and the stones on its ledge. It fills the room
 * behind the tabs.
 */
export default function MemorialStone({ count, settleFrom }: { count: number | null; settleFrom: number | null }) {
  const reduced = usePrefersReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heapRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  const shown = count ?? FALLBACK_STONES;
  const stones = useMemo(() => heapLayout(shown, size.w, size.h * 0.86), [shown, size]);

  useEffect(() => {
    const el = heapRef.current;
    if (!el) return;
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    measure();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measure);
      return () => window.removeEventListener('resize', measure);
    }
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const draw = useCallback(
    (now: number) => {
      const canvas = canvasRef.current;
      if (!canvas || !size.w || !size.h) return true;
      const g = canvas.getContext?.('2d');
      if (!g) return true;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      if (canvas.width !== Math.round(size.w * dpr)) canvas.width = Math.round(size.w * dpr);
      if (canvas.height !== Math.round(size.h * dpr)) canvas.height = Math.round(size.h * dpr);
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, size.w, size.h);
      // The visitor's own stone is the newest: the last by number. It is
      // lowered into its place, slowly, once.
      const newest = settleFrom === null ? -1 : shown - 1;
      const t = settleFrom === null ? 1 : Math.min(1, Math.max(0, (now - settleFrom) / 1800));
      const eased = 1 - Math.pow(1 - t, 3);
      // The heap's crown is in the light; the stones beneath it are in shade.
      let top = 0;
      for (const s of stones) top = Math.max(top, s.y + s.h);
      const dimOf = (s: LaidStone) => (top > 0 ? 0.42 * Math.max(0, (top - s.y - s.h) / top) : 0);
      heapShadow(g, stones, size.h, dpr);
      for (const s of stones) {
        if (s.i === newest) drawStone(g, s, size.h, (1 - eased) * s.h * 1.2, eased);
        else drawStone(g, s, size.h, 0, 1, dimOf(s));
      }
      return t >= 1;
    },
    [stones, size, shown, settleFrom],
  );

  // Draw once; animate only while the visitor's stone settles.
  useEffect(() => {
    if (reduced || settleFrom === null) {
      draw(Infinity);
      return;
    }
    let raf = 0;
    const step = (now: number) => {
      if (!draw(now)) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [draw, reduced, settleFrom]);

  return (
    <div className="hos-scene" aria-hidden="true">
      <span className="hos-room" />
      <span className="hos-wall" />
      <span className="hos-floor" />
      <span className="hos-lamp" />
      <span className="hos-beam" />
      {!reduced && (
        <span className="hos-motes">
          {Array.from({ length: 14 }, (_, i) => (
            <i key={i} style={{ '--m': String(i) } as CSSProperties} />
          ))}
        </span>
      )}
      <span className="hos-ground" />
      <div className="hos-monument">
        <div className="hos-heap" ref={heapRef}>
          <canvas ref={canvasRef} className="hos-heap-canvas" />
        </div>
        <span className="hos-ledge" />
        <div className="hos-stone">
          <span className="hos-stone-top" />
          <span className="hos-stone-mottle" />
          <span className="hos-stone-grain" />
          <span className="hos-stone-light" />
          <svg className="hos-star" viewBox="-60 -66 120 132" focusable="false">
            <g className="hos-star-cut-light">
              <path d="M0 -58 L50.2 29 L-50.2 29 Z" />
              <path d="M0 58 L50.2 -29 L-50.2 -29 Z" />
            </g>
            <g className="hos-star-cut">
              <path d="M0 -58 L50.2 29 L-50.2 29 Z" />
              <path d="M0 58 L50.2 -29 L-50.2 -29 Z" />
            </g>
          </svg>
          <span className="hos-stone-words">Never Forget.</span>
        </div>
        <span className="hos-base" />
      </div>
    </div>
  );
}

type ControlsProps = ReturnType<typeof useStones> & {
  /** Called when this visitor's stone has been laid, to settle it in. */
  onLaid: () => void;
};

/** "Lay a stone": the count and the button, beside the stone. */
export function StoneControls({ count, status, laidToday, busy, lay, onLaid }: ControlsProps) {
  const [message, setMessage] = useState('');

  const onLay = async () => {
    const result: LayResult = await lay();
    if (result === 'laid') {
      onLaid();
      setMessage('Thank you. Your stone is on the memorial.');
    } else if (result === 'already' || result === 'limited') {
      setMessage('A stone has already been laid from here today. You can lay another tomorrow.');
    } else {
      setMessage('The memorial can’t be reached just now. Please try again in a little while.');
    }
  };

  const countText =
    count === null
      ? status === 'loading'
        ? 'Counting the stones…'
        : 'The shared memorial can’t be reached just now.'
      : count === 0
        ? 'No stones laid yet'
        : `${count.toLocaleString('en-US')} ${count === 1 ? 'stone' : 'stones'} laid${status === 'offline' ? ' (when last counted)' : ''}`;

  return (
    <div className="hos-controls">
      <p className="hos-intro">Lay a stone, to remember.</p>
      {/* The custom, owner-approved and fact-checked, with its source (holocaust.ts). */}
      <FactNote fact={STONE_CUSTOM} className="hos-custom" />
      <p className="hos-count" data-status={status}>
        {countText}
      </p>
      <button type="button" className="hos-button hos-button-primary" onClick={onLay} disabled={busy || laidToday}>
        <span className="hos-button-stone" aria-hidden="true" />
        {laidToday ? 'Stone laid today' : busy ? 'Laying…' : 'Lay a stone'}
      </button>
      <p className="hos-message" role="status" aria-live="polite">
        {message || (laidToday ? 'You have laid a stone today. You can lay another tomorrow.' : '')}
      </p>
      <p className="hos-stone-credit">Illustration made with Leonardo.Ai</p>
    </div>
  );
}
