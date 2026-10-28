'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { usePrefersReducedMotion } from '@/lib/a11y/usePrefersReducedMotion';
import { usePoppies, type PlaceResult } from './usePoppies';
import { SILHOUETTE_PATH, SILHOUETTE_VIEWBOX } from './silhouettePath';

/*
 * Place a poppy: a field that fills as visitors place them. One canvas, not
 * one element per poppy. Each poppy has its own place in the field (from its
 * number), so the field only ever grows. A few poppies are drawn large; as
 * the count climbs they are drawn smaller and closer, until the field is a
 * carpet of red; past what the field can hold, it simply stays full.
 *
 * The poppy is the one cut out for the posters (poppies.png), clipped from
 * its spray.
 */

const SPRITE = { src: '/exhibitions/great-war/poppies.png', x: 332, y: 316, w: 196, h: 206 };
/** If the count can't be reached, the field shows eleven poppies, for the eleventh hour. */
export const FALLBACK_POPPIES = 11;

export type Placed = { i: number; x: number; y: number; size: number };

/** A cheap, stable hash of a poppy's number to 0–1. */
function hash01(i: number, salt: number) {
  let h = Math.imul(i ^ 0x9e3779b9, 0x85ebca6b) ^ Math.imul(salt + 1, 0xc2b2ae35);
  h ^= h >>> 13;
  h = Math.imul(h, 0x27d4eb2f);
  h ^= h >>> 15;
  return (h >>> 0) / 4294967296;
}

/** How far down the scene the horizon sits, as a fraction of its height. */
export const HORIZON = 0.6;
/** On a phone the scene stands taller, and the horizon sits higher (as in memorial.css). */
export const PHONE_HORIZON = 0.47;

/**
 * Where the first `count` poppies sit in a field `w` × `h` (CSS px), back
 * to front. The field runs from the horizon to the foot of the scene: far
 * poppies are small and near the horizon, near ones large at the bottom.
 * Sizes shrink as the field fills; the number drawn is capped by the space,
 * so 100,000 costs no more than a full field.
 */
export function fieldLayout(count: number, w: number, h: number, horizon = HORIZON): Placed[] {
  if (count <= 0 || w <= 0 || h <= 0) return [];
  const top = h * horizon;
  const area = w * (h - top);
  const minSize = Math.max(10, Math.min(w, h) / 45);
  const maxSize = Math.min(96, h / 6);
  const base = Math.max(minSize, Math.min(maxSize, Math.sqrt(area / count) * 1.1));
  const capacity = Math.floor(area / (minSize * minSize * 0.35));
  const n = Math.min(count, capacity);
  const out: Placed[] = [];
  for (let i = 0; i < n; i++) {
    // Depth: 0 at the horizon, 1 at the front. More poppies far off than near.
    const depth = Math.pow(hash01(i, 1), 0.8);
    const s = base * (0.16 + 0.84 * depth) * (0.85 + hash01(i, 3) * 0.3);
    const x = hash01(i, 2) * (w + s * 0.4) - s * 0.2;
    const y = top + (h - top) * (0.03 + 0.97 * Math.pow(depth, 1.5)) - s * 0.6;
    out.push({ i, x, y, size: s });
  }
  return out.sort((a, b) => a.y + a.size - (b.y + b.size));
}

/** A blade of grass in the field: depth 0 at the horizon, 1 at the front. */
type Blade = { x: number; y: number; len: number; lean: number; phase: number; depth: number };

function grassLayout(w: number, h: number, horizon = HORIZON): Blade[] {
  const top = h * horizon;
  const n = Math.min(1600, Math.round((w * (h - top)) / 160));
  const out: Blade[] = [];
  for (let i = 0; i < n; i++) {
    const depth = Math.pow(hash01(i, 11), 0.9);
    out.push({
      x: hash01(i, 12) * w,
      y: top + (h - top) * Math.pow(depth, 1.5) + 2,
      len: (3 + 34 * Math.pow(depth, 1.4)) * (0.6 + hash01(i, 13) * 0.8),
      lean: (hash01(i, 14) - 0.5) * 0.5,
      phase: hash01(i, 15) * Math.PI * 2,
      depth,
    });
  }
  return out.sort((a, b) => a.y - b.y);
}

/** The wind across the field at time t (s): a slow swell with gusts. */
function wind(t: number, x: number) {
  return Math.sin(t * 0.7 - x * 0.004) * 0.6 + Math.sin(t * 1.9 - x * 0.011) * 0.25;
}

function loadSprite(): Promise<HTMLCanvasElement | null> {
  return new Promise((resolve) => {
    if (typeof document === 'undefined') return resolve(null);
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = SPRITE.w;
      c.height = SPRITE.h;
      const g = c.getContext('2d');
      if (!g) return resolve(null);
      // Clip to the flower head, leaving the leaves and stems of the spray behind.
      g.beginPath();
      g.ellipse(SPRITE.w / 2 - 4, SPRITE.h / 2, SPRITE.w / 2 - 10, SPRITE.h / 2 - 6, 0, 0, Math.PI * 2);
      g.clip();
      g.drawImage(img, SPRITE.x, SPRITE.y, SPRITE.w, SPRITE.h, 0, 0, SPRITE.w, SPRITE.h);
      resolve(c);
    };
    img.onerror = () => resolve(null);
    img.src = SPRITE.src;
  });
}

/** Grass lit from behind: far blades catch the low light, near ones are dark against it. */
function bladeColor(depth: number) {
  const r = Math.round(92 - 74 * depth);
  const g = Math.round(58 - 38 * depth);
  const b = Math.round(30 - 16 * depth);
  return `rgb(${r},${g},${b})`;
}

function drawBlade(g: CanvasRenderingContext2D, b: Blade, t: number) {
  const sway = b.lean + wind(t, b.x) * 0.12 * (0.3 + b.depth) + Math.sin(t * 2.3 + b.phase) * 0.03;
  g.strokeStyle = bladeColor(b.depth);
  g.lineWidth = 0.6 + b.depth * 1.6;
  g.beginPath();
  g.moveTo(b.x, b.y);
  g.quadraticCurveTo(b.x + sway * b.len * 0.4, b.y - b.len * 0.6, b.x + sway * b.len, b.y - b.len);
  g.stroke();
}

function drawPoppy(g: CanvasRenderingContext2D, sprite: HTMLCanvasElement | null, p: Placed, h: number, horizon: number, t: number, grow = 1) {
  const depth = Math.min(1, Math.max(0, (p.y + p.size - h * horizon) / (h * (1 - horizon))));
  const s = p.size * grow;
  const stem = p.size * (0.9 + depth * 0.6);
  const baseX = p.x + p.size / 2;
  const baseY = p.y + p.size * 0.6 + stem;
  const sway = wind(t, baseX) * 0.1 * (0.4 + depth) + Math.sin(t * 1.6 + p.i) * 0.025;
  const topY = baseY - stem * grow;
  const cx = baseX + sway * stem * grow;
  // The stem, from the ground up to the flower.
  g.strokeStyle = bladeColor(depth);
  g.lineWidth = Math.max(0.6, p.size / 22);
  g.beginPath();
  g.moveTo(baseX, baseY);
  g.quadraticCurveTo(baseX + sway * stem * 0.3, baseY - stem * grow * 0.5, cx, topY);
  g.stroke();
  // Far poppies sit in the haze of the light; near ones are full red.
  g.globalAlpha = 0.55 + 0.45 * depth;
  if (sprite) {
    g.save();
    g.translate(cx, topY);
    g.rotate(sway * 0.8);
    g.drawImage(sprite, -s / 2, -s / 2, s, s * (SPRITE.h / SPRITE.w));
    g.restore();
  } else {
    g.fillStyle = '#d4291f';
    g.beginPath();
    g.arc(cx, topY, s / 2.2, 0, Math.PI * 2);
    g.fill();
  }
  g.globalAlpha = 1;
}

/**
 * The memorial's scene: the soldier on the rise, lit from behind by a low
 * sun, and the field of poppies running from his feet to the visitor. The
 * poppies are the ones visitors have placed; the grass and the light are
 * only the setting. It fills the memorial behind the tabs.
 */
export default function PoppyField({ count, growFrom }: { count: number | null; growFrom: number | null }) {
  const reduced = usePrefersReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const spriteRef = useRef<HTMLCanvasElement | null>(null);
  const [spriteReady, setSpriteReady] = useState(false);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [visible, setVisible] = useState(true);

  const shown = count ?? FALLBACK_POPPIES;
  const horizon = size.w <= 760 ? PHONE_HORIZON : HORIZON;
  const poppies = useMemo(() => fieldLayout(shown, size.w, size.h, horizon), [shown, size, horizon]);
  const grass = useMemo(() => grassLayout(size.w, size.h, horizon), [size, horizon]);

  useEffect(() => {
    let alive = true;
    loadSprite().then((s) => {
      if (!alive) return;
      spriteRef.current = s;
      setSpriteReady(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
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

  // Only move the field while it is on screen.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const draw = useCallback(
    (t: number, now: number) => {
      const canvas = canvasRef.current;
      if (!canvas || !size.w || !size.h) return;
      const g = canvas.getContext?.('2d');
      if (!g) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      if (canvas.width !== Math.round(size.w * dpr)) canvas.width = Math.round(size.w * dpr);
      if (canvas.height !== Math.round(size.h * dpr)) canvas.height = Math.round(size.h * dpr);
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, size.w, size.h);
      g.lineCap = 'round';
      // The visitor's own poppy is the newest: the last by number.
      const newest = growFrom === null ? -1 : shown - 1;
      const grow = growFrom === null ? 1 : Math.min(1, (now - growFrom) / 2200);
      const eased = 1 - Math.pow(1 - grow, 3);
      // Grass and poppies drawn together, back to front.
      let b = 0;
      for (const p of poppies) {
        const foot = p.y + p.size;
        while (b < grass.length && grass[b].y < foot) drawBlade(g, grass[b++], t);
        drawPoppy(g, spriteRef.current, p, size.h, horizon, t, p.i === newest ? eased : 1);
      }
      while (b < grass.length) drawBlade(g, grass[b++], t);
    },
    [poppies, grass, size, shown, growFrom, horizon],
  );

  // Draw the field; let it sway in the wind unless motion is reduced.
  useEffect(() => {
    if (reduced || !visible) {
      draw(0, Infinity);
      return;
    }
    let raf = 0;
    let last = 0;
    const step = (now: number) => {
      raf = requestAnimationFrame(step);
      if (now - last < 33) return; // about 30 frames a second is plenty for grass
      last = now;
      draw(now / 1000, now);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [draw, reduced, visible, spriteReady]);

  return (
    <div className="gwm-scene-art" ref={wrapRef} aria-hidden="true">
        <span className="gwm-sky" />
        <span className="gwm-sun" />
        <span className="gwm-rays" />
        <svg className="gwm-hills" viewBox="0 0 1000 60" preserveAspectRatio="none" focusable="false">
          <path d="M0 38 C90 22 170 30 250 26 S420 12 520 24 S700 34 790 20 S930 18 1000 30 L1000 60 L0 60 Z" />
        </svg>
        <svg className="gwm-soldier" viewBox={SILHOUETTE_VIEWBOX} focusable="false">
          <path d={SILHOUETTE_PATH} fillRule="evenodd" />
        </svg>
        <span className="gwm-ground" />
        <canvas ref={canvasRef} className="gwm-field-canvas" />
        <span className="gwm-haze" />
        <span className="gwm-petals">
          {Array.from({ length: 7 }, (_, i) => (
            <i key={i} style={{ '--i': i } as CSSProperties} />
          ))}
        </span>
      </div>
  );
}

type ControlsProps = ReturnType<typeof usePoppies> & {
  intro: string;
  /** Called when this visitor's poppy has been placed, to grow it in. */
  onPlaced: () => void;
};

/** "Place a poppy": the count and the button, over the scene. */
export function PoppyControls({ count, status, placedToday, busy, place, intro, onPlaced }: ControlsProps) {
  const [message, setMessage] = useState('');

  const onPlace = async () => {
    const result: PlaceResult = await place();
    if (result === 'placed') {
      onPlaced();
      setMessage('Thank you. Your poppy is in the field.');
    } else if (result === 'already' || result === 'limited') {
      setMessage('A poppy has already been placed from here today. You can place another tomorrow.');
    } else {
      setMessage('The field can’t be reached just now. Please try again in a little while.');
    }
  };

  const countText =
    count === null
      ? status === 'loading'
        ? 'Counting the poppies…'
        : 'The shared field can’t be reached just now.'
      : `${count.toLocaleString('en-US')} ${count === 1 ? 'poppy' : 'poppies'} placed${status === 'offline' ? ' (when last counted)' : ''}`;

  return (
    <div className="gwm-poppy-controls">
      <p className="gwm-intro">{intro}</p>
      <p className="gwm-field-count" data-status={status}>
        {countText}
      </p>
      <button type="button" className="gw-button gw-button-primary gwm-place" onClick={onPlace} disabled={busy || placedToday}>
        <span className="gwm-place-icon" aria-hidden="true" />
        {placedToday ? 'Poppy placed today' : busy ? 'Placing…' : 'Place a poppy'}
      </button>
      <p className="gwm-field-message" role="status" aria-live="polite">
        {message || (placedToday ? 'You have placed a poppy today. You can place another tomorrow.' : '')}
      </p>
    </div>
  );
}
