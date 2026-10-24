'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '@/lib/a11y/usePrefersReducedMotion';
import { usePoppies, type PlaceResult } from './usePoppies';

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
/** If the count can't be reached, the field shows one poppy for each soldier above. */
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

/**
 * Where the first `count` poppies sit in a field `w` × `h` (CSS px), back
 * to front. Sizes shrink as the field fills; the number drawn is capped by
 * the space, so 100,000 costs no more than a full field.
 */
export function fieldLayout(count: number, w: number, h: number): Placed[] {
  if (count <= 0 || w <= 0 || h <= 0) return [];
  const area = w * h;
  const minSize = Math.max(12, Math.min(w, h) / 32);
  const maxSize = Math.min(84, h / 4);
  const size = Math.max(minSize, Math.min(maxSize, Math.sqrt(area / count) * 0.95));
  const capacity = Math.floor(area / (minSize * minSize * 0.42));
  const n = Math.min(count, capacity);
  const out: Placed[] = [];
  for (let i = 0; i < n; i++) {
    // Depth: 0 at the back of the field, 1 at the front. More room at the front.
    const depth = Math.pow(hash01(i, 1), 0.75);
    const scale = 0.5 + 0.5 * depth;
    const s = size * scale * (0.85 + hash01(i, 3) * 0.3);
    const x = hash01(i, 2) * (w + s * 0.4) - s * 0.2;
    const y = h * 0.1 + depth * (h * 0.9 - s * 0.9);
    out.push({ i, x, y, size: s });
  }
  return out.sort((a, b) => a.y - b.y);
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

function drawPoppy(g: CanvasRenderingContext2D, sprite: HTMLCanvasElement | null, p: Placed, grow = 1) {
  const s = p.size * grow;
  const cx = p.x + p.size / 2;
  const cy = p.y + p.size / 2;
  if (sprite) {
    g.drawImage(sprite, cx - s / 2, cy - s / 2, s, s * (SPRITE.h / SPRITE.w));
  } else {
    g.fillStyle = '#d4291f';
    g.beginPath();
    g.arc(cx, cy, s / 2.2, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = '#1a1a1a';
    g.beginPath();
    g.arc(cx, cy, s / 9, 0, Math.PI * 2);
    g.fill();
  }
}

export default function PoppyField() {
  const { count, status, placedToday, busy, place } = usePoppies();
  const reduced = usePrefersReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const spriteRef = useRef<HTMLCanvasElement | null>(null);
  const [spriteReady, setSpriteReady] = useState(false);
  const [message, setMessage] = useState('');
  /** True once this visitor has just placed a poppy, to grow it in. */
  const [growing, setGrowing] = useState(false);
  const [size, setSize] = useState({ w: 0, h: 0 });

  const shown = count ?? FALLBACK_POPPIES;

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

  const draw = useCallback((grow: number) => {
    const canvas = canvasRef.current;
    if (!canvas || !size.w || !size.h) return;
    const g = canvas.getContext?.('2d');
    if (!g) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    if (canvas.width !== Math.round(size.w * dpr)) canvas.width = Math.round(size.w * dpr);
    if (canvas.height !== Math.round(size.h * dpr)) canvas.height = Math.round(size.h * dpr);
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, size.w, size.h);
    const layout = fieldLayout(shown, size.w, size.h);
    // The visitor's own poppy is the newest: the last by number.
    const newest = growing ? shown - 1 : -1;
    for (const p of layout) drawPoppy(g, spriteRef.current, p, p.i === newest ? grow : 1);
  }, [shown, size, growing]);

  // Draw the field; grow the visitor's new poppy in, unless motion is reduced.
  useEffect(() => {
    if (!growing || reduced) {
      draw(1);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / 1400);
      draw(1 - Math.pow(1 - p, 3));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [draw, growing, reduced, spriteReady]);

  const onPlace = async () => {
    const result: PlaceResult = await place();
    if (result === 'placed') {
      setGrowing(true);
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
    <div className="gwm-field">
      <div className="gwm-field-ground" ref={wrapRef}>
        <canvas ref={canvasRef} className="gwm-field-canvas" aria-hidden="true" />
      </div>
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
