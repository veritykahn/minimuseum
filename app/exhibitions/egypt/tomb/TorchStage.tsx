'use client';

import { useCallback, useEffect, useRef, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import { renderedBox, toPicture, type Box } from './scenes';

/*
 * A painted wall in the dark, searched with a torch. With the torch off the
 * wall is black and nothing can be found. With it on, its warm circle of
 * light follows the mouse or the finger (and the arrow keys) and lights the
 * painting where it falls. Once the wall's details are all found, the whole
 * wall lights up (`lit`), slowly, as if every lamp in the tomb were lit.
 *
 * Every place is in the picture's own natural pixels (`width` × `height`).
 * The pointer is mapped into them through the picture's rendered box (the
 * element marked data-picture, object-fit contain), so finding a thing and
 * drawing its ring use one coordinate space, whatever the screen size or
 * letterboxing. The torch's place is set as CSS variables, so moving it does
 * not re-render the room.
 */

type Spot = { id: string; x: number; y: number };

export default function TorchStage({
  width,
  height,
  label,
  torch,
  lit,
  rings,
  onTorch,
  overlay,
  className = '',
  children,
}: {
  width: number;
  height: number;
  /** The stage's accessible name (what it shows, and how to search it). */
  label: string;
  /** Is the torch on? Off, the wall is dark and the torch finds nothing. */
  torch: boolean;
  /** The whole wall lit (every detail found). */
  lit: boolean;
  /** Found things, ringed in gold where they are. */
  rings: readonly Spot[];
  /** Called with the torch's centre in the picture's natural pixels (only while the torch is on). */
  onTorch: (x: number, y: number) => void;
  /** Drawn over the dark (the "turn on your torch" button). */
  overlay?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  const stage = useRef<HTMLDivElement>(null);
  const at = useRef({ x: 0.5, y: 0.5 });
  const searching = torch && !lit;

  /** The picture's rendered box, in client pixels; null before layout (or in a test's DOM). */
  const pictureBox = useCallback((): Box | null => {
    const el = stage.current?.querySelector<HTMLElement | SVGElement>('[data-picture]');
    const r = el?.getBoundingClientRect();
    if (!r || r.width === 0 || r.height === 0) return null;
    return renderedBox({ left: r.left, top: r.top, width: r.width, height: r.height }, width, height, 'contain');
  }, [width, height]);

  /** Light the stage at a share of its box, and report where that is in the picture. */
  const light = useCallback(
    (fx: number, fy: number, client?: { x: number; y: number }) => {
      const el = stage.current;
      const x = Math.min(1, Math.max(0, fx));
      const y = Math.min(1, Math.max(0, fy));
      at.current = { x, y };
      el?.style.setProperty('--tx', `${x * 100}%`);
      el?.style.setProperty('--ty', `${y * 100}%`);
      const box = pictureBox();
      const s = el?.getBoundingClientRect();
      if (box && s && s.width > 0) {
        const p = client ?? { x: s.left + x * s.width, y: s.top + y * s.height };
        const q = toPicture(p.x, p.y, box, width, height);
        onTorch(q.x, q.y);
      } else {
        // No layout to measure (a test's DOM): the stage is the picture.
        onTorch(x * width, y * height);
      }
    },
    [onTorch, pictureBox, width, height],
  );

  // A new picture: the torch back to the middle.
  useEffect(() => {
    at.current = { x: 0.5, y: 0.5 };
    stage.current?.style.setProperty('--tx', '50%');
    stage.current?.style.setProperty('--ty', '50%');
  }, [width, height]);

  const onPointer = (e: PointerEvent<HTMLDivElement>) => {
    if (!searching) return;
    const r = e.currentTarget.getBoundingClientRect();
    if (r.width === 0) return;
    light((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height, { x: e.clientX, y: e.clientY });
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!searching) return;
    const step = e.shiftKey ? 0.12 : 0.05;
    const { x, y } = at.current;
    const to =
      e.key === 'ArrowLeft' ? [x - step, y]
      : e.key === 'ArrowRight' ? [x + step, y]
      : e.key === 'ArrowUp' ? [x, y - step]
      : e.key === 'ArrowDown' ? [x, y + step]
      : null;
    if (!to) return;
    e.preventDefault();
    light(to[0], to[1]);
  };

  /** A ring's place on the stage, as a share of it: the stage keeps the picture's own shape, so the picture fills it exactly. */
  const ringAt = (spot: Spot) => ({ left: `${(spot.x / width) * 100}%`, top: `${(spot.y / height) * 100}%` });

  return (
    <div
      ref={stage}
      className={`egt-stage ${torch ? 'is-on' : 'is-off'} ${lit ? 'is-lit' : ''} ${className}`}
      style={{ aspectRatio: `${width} / ${height}`, ['--egt-aspect' as string]: (width / height).toFixed(4) }}
      tabIndex={0}
      role="group"
      aria-roledescription="torch"
      aria-label={label}
      onPointerMove={onPointer}
      onPointerDown={onPointer}
      onKeyDown={onKey}
    >
      {children}
      <span className="egt-dark" aria-hidden="true" />
      {rings.map((r) => (
        <span key={r.id} className="egt-mark" data-ring={r.id} style={ringAt(r)} aria-hidden="true" />
      ))}
      {overlay}
    </div>
  );
}
