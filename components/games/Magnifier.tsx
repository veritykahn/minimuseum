'use client';

import { useCallback, useId, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react';
import styles from './games.module.css';

export type Callout = {
  /** Number drawn on the marker; matches the numbered list beside the image. */
  n: number;
  /** Position as a fraction (0–1) of the image's width and height. */
  x: number;
  y: number;
};

type MagnifierProps = {
  src: string;
  alt: string;
  zoom?: number;
  /** Lens diameter in CSS pixels. */
  lens?: number;
  /** Numbered markers drawn over the image (e.g. after a reveal). */
  callouts?: Callout[];
  /** Tone of the markers: matches the verdict colors of the surrounding game. */
  calloutTone?: 'right' | 'wrong' | 'neutral';
  /** Tallest the image may be drawn, in CSS pixels; it keeps its own shape. */
  maxHeight?: number;
  className?: string;
  style?: CSSProperties;
};

type Pos = { x: number; y: number };

const clamp = (v: number) => Math.min(1, Math.max(0, v));

/**
 * An image with a magnifying lens, usable with every kind of input:
 *  - mouse or pen: the lens follows the pointer while it is over the image;
 *  - touch: tap to turn the lens on, drag to move it (it sits above the
 *    finger so the finger never covers what it shows), tap again to stop.
 *    While it is off the page scrolls and pinch-zooms as normal;
 *  - keyboard: Tab to the image, Enter or Space toggles the lens, the arrow
 *    keys move it (Shift for finer steps), Escape puts it away.
 */
export default function Magnifier({
  src,
  alt,
  zoom = 2.5,
  lens = 160,
  callouts,
  calloutTone = 'neutral',
  maxHeight = 320,
  className,
  style,
}: MagnifierProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<Pos | null>(null);
  const [mode, setMode] = useState<'pointer' | 'touch' | 'key'>('pointer');
  const [box, setBox] = useState({ w: 0, h: 0 });
  // The image's own width ÷ height, so the box always hugs the picture and
  // markers and the lens line up with it, whatever its shape.
  const [ratio, setRatio] = useState(2);
  const touchStart = useRef<{ x: number; y: number; t: number; wasOn: boolean } | null>(null);
  const hintId = useId();

  const measure = useCallback(() => {
    const r = boxRef.current?.getBoundingClientRect();
    if (r) setBox({ w: r.width, h: r.height });
    return r;
  }, []);

  const posFromEvent = useCallback(
    (e: PointerEvent<HTMLDivElement>): Pos | null => {
      const r = measure();
      if (!r || r.width === 0) return null;
      return { x: clamp((e.clientX - r.left) / r.width), y: clamp((e.clientY - r.top) / r.height) };
    },
    [measure],
  );

  const onPointerEnter = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return;
    setMode('pointer');
    setPos(posFromEvent(e));
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') {
      if (mode === 'touch' && pos) setPos(posFromEvent(e));
      return;
    }
    setMode('pointer');
    setPos(posFromEvent(e));
  };
  const onPointerLeave = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'touch' && mode === 'pointer') setPos(null);
  };
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'touch') return;
    const on = mode === 'touch' && pos !== null;
    touchStart.current = { x: e.clientX, y: e.clientY, t: Date.now(), wasOn: on };
    setMode('touch');
    setPos(posFromEvent(e));
    // Keep receiving moves even if the finger slides off the image.
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* not supported */ }
  };
  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'touch' || !touchStart.current) return;
    const s = touchStart.current;
    touchStart.current = null;
    const moved = Math.hypot(e.clientX - s.x, e.clientY - s.y);
    // A short tap on a lens that was already on puts it away.
    if (s.wasOn && moved < 8 && Date.now() - s.t < 350) setPos(null);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 0.02 : 0.08;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      measure();
      setMode('key');
      setPos((p) => (p ? null : { x: 0.5, y: 0.5 }));
      return;
    }
    if (e.key === 'Escape') {
      if (pos) { e.preventDefault(); e.stopPropagation(); setPos(null); }
      return;
    }
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step],
    };
    const m = moves[e.key];
    if (!m) return;
    // Arrow keys belong to the lens while the image has focus, so they never
    // also scroll the page or change the slide.
    e.preventDefault();
    e.stopPropagation();
    measure();
    setMode('key');
    setPos((p) => {
      const base = p ?? { x: 0.5, y: 0.5 };
      return { x: clamp(base.x + m[0]), y: clamp(base.y + m[1]) };
    });
  };

  const active = pos !== null && box.w > 0;
  // Over a touch, lift the lens above the finger.
  const lift = mode === 'touch' ? lens * 0.75 : 0;
  const lensStyle: CSSProperties | undefined = active
    ? {
        width: lens,
        height: lens,
        left: pos.x * box.w - lens / 2,
        top: pos.y * box.h - lens / 2 - lift,
        backgroundImage: `url("${src}")`,
        backgroundSize: `${box.w * zoom}px ${box.h * zoom}px`,
        backgroundPosition: `${-(pos.x * box.w * zoom - lens / 2)}px ${-(pos.y * box.h * zoom - lens / 2)}px`,
      }
    : undefined;

  return (
    <div
      ref={boxRef}
      className={`${styles.magnifier} ${className ?? ''}`}
      style={{ width: `min(100%, ${Math.round(maxHeight * ratio)}px)`, ...style }}
      data-touch-lens={mode === 'touch' && active ? '' : undefined}
      tabIndex={0}
      role="group"
      aria-roledescription="magnifier"
      aria-label={alt}
      aria-describedby={hintId}
      onPointerEnter={onPointerEnter}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={() => {
        // The browser took the touch for a scroll: don't leave a lens behind
        // that the visitor never meant to turn on.
        if (touchStart.current && !touchStart.current.wasOn) setPos(null);
        touchStart.current = null;
      }}
      onKeyDown={onKeyDown}
      onBlur={() => { if (mode === 'key') setPos(null); }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        draggable={false}
        className={styles.magnifierImg}
        onLoad={(e) => {
          const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
          if (w && h) setRatio(w / h);
        }}
      />
      {callouts?.map((c) => (
        <span
          key={c.n}
          className={styles.callout}
          data-tone={calloutTone}
          style={{ left: `${c.x * 100}%`, top: `${c.y * 100}%`, '--i': c.n } as CSSProperties}
          aria-hidden="true"
        >
          {c.n}
        </span>
      ))}
      {active && <span className={styles.lens} style={lensStyle} aria-hidden="true" />}
      <span id={hintId} className={styles.srOnly}>
        Press Enter to magnify, then use the arrow keys to move the lens. Escape puts it away.
      </span>
    </div>
  );
}
