'use client';

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import './dragKit.css';

/*
 * Drag and drop for the Egypt craft rooms (mummification, the amulet maker,
 * the weighing of the heart, the tomb builder): press on a thing, carry it,
 * and let go over a place marked `data-drop="<id>"`. A small copy of the
 * thing (the ghost) follows the finger or mouse. A press that does not move
 * is left to the button's own click, so every drag also works as "tap the
 * thing, then tap where it goes", and by keyboard (Enter or Space on each).
 */

export type Drag<T> = { item: T; x: number; y: number; moved: boolean };

/** Where a drop landed: the target's id, and the point in client pixels. */
export type DropAt = { target: string; x: number; y: number; el: HTMLElement };

export function useDragDrop<T>(onDrop: (item: T, at: DropAt) => void) {
  const [drag, setDrag] = useState<Drag<T> | null>(null);
  const dropRef = useRef(onDrop);
  useEffect(() => {
    dropRef.current = onDrop;
  }, [onDrop]);
  const live = useRef<Drag<T> | null>(null);
  const origin = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!drag) return;
    const move = (e: PointerEvent) => {
      const d = live.current;
      if (!d) return;
      const moved = d.moved || Math.hypot(e.clientX - origin.current.x, e.clientY - origin.current.y) > 8;
      live.current = { ...d, x: e.clientX, y: e.clientY, moved };
      setDrag(live.current);
    };
    const up = (e: PointerEvent) => {
      const d = live.current;
      live.current = null;
      setDrag(null);
      if (!d || !d.moved) return;
      const el = document.elementFromPoint(e.clientX, e.clientY)?.closest<HTMLElement>('[data-drop]');
      if (el?.dataset.drop) dropRef.current(d.item, { target: el.dataset.drop, x: e.clientX, y: e.clientY, el });
    };
    const cancel = () => {
      live.current = null;
      setDrag(null);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', cancel);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', cancel);
    };
    // One set of listeners for each drag, however often the ghost moves.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drag !== null]);

  /** Start carrying `item` (call from onPointerDown). */
  const start = (item: T, e: ReactPointerEvent) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    origin.current = { x: e.clientX, y: e.clientY };
    live.current = { item, x: e.clientX, y: e.clientY, moved: false };
    setDrag(live.current);
  };

  return { drag: drag?.moved ? drag : null, carrying: drag?.item ?? null, start };
}

/** The ghost that follows the pointer while something is carried. */
export function DragGhost({ at, className = '', children }: { at: { x: number; y: number } | null; className?: string; children: ReactNode }) {
  if (!at) return null;
  return (
    <div className={`egk-ghost ${className}`} style={{ left: at.x, top: at.y }} aria-hidden="true">
      {children}
    </div>
  );
}

/** A point in client pixels, in an SVG's own units (null where the browser cannot say, as in tests). */
export function toSvg(svg: SVGSVGElement | null, x: number, y: number): { x: number; y: number } | null {
  const m = svg?.getScreenCTM?.();
  if (!svg || !m || typeof DOMPoint === 'undefined') return null;
  const p = new DOMPoint(x, y).matrixTransform(m.inverse());
  return { x: p.x, y: p.y };
}
