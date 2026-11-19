'use client';

import { useRef, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import FactNote, { type ApprovedFact } from '@/components/exhibition/FactNote';
import type { SavedAmulet } from '../amulet/savedAmulet';
import { toSvg } from '../dragKit';

/*
 * What every step of the mummification room shares: what the room hands
 * each step (StepKit), the three parts a step fills (its one instruction,
 * its picture, and its tray of tools and notes), the keyboard handles laid
 * over a picture, and a pointer kept on a picture in the picture's own
 * units.
 *
 * Every hands-on gesture has a keyboard way that is the same gesture, not
 * a shortcut past it: a handle over the thing in the picture (the jar of
 * water, the hook, the oil cloth, the linen roll) takes the arrow keys, so
 * the brain is still pushed in and pulled out and the linen still goes
 * round the body pass by pass. The handles take no pointer events (the
 * picture under them does), so a finger or mouse never lands on them.
 */

export type StepKit = {
  /** The step's work was finished before (the visitor came back to it): show it finished. */
  done: boolean;
  /** Call once the step's work is done. */
  finish: () => void;
  /** Say something to a screen reader (the room's status line). */
  say: (s: string) => void;
  reduced: boolean;
  /** The visitor's shuffle seed (null until the page is live). */
  seed: number | null;
  /** The amulet the visitor made in Design an Amulet, if any. */
  own: SavedAmulet | null;
};

export type View = { x: number; y: number; w: number; h: number };

/** A box in a picture's own units, as a CSS box over the picture. */
export const boxIn =
  (v: View) =>
  (x: number, y: number, w: number, h: number): CSSProperties => ({
    left: `${((x - v.x) / v.w) * 100}%`,
    top: `${((y - v.y) / v.h) * 100}%`,
    width: `${(w / v.w) * 100}%`,
    height: `${(h / v.h) * 100}%`,
  });

/** The step's one instruction (or, once it is done, what was done). */
export function Task({ children, done }: { children: ReactNode; done?: boolean }) {
  return <p className={done ? 'egm-task egm-done' : 'egr-task egm-task'}>{children}</p>;
}

/**
 * The picture: a box of the picture's shape, the drawing in it described in
 * words for a screen reader, and anything laid over it (drop places,
 * keyboard handles) after it.
 */
export function Picture({ label, aspect, carrying, children, over }: { label: string; aspect: string; carrying?: boolean; children: ReactNode; over?: ReactNode }) {
  const [w, h] = aspect.split('/').map(Number);
  const style = { aspectRatio: aspect, '--egm-ratio': String(w / h) } as CSSProperties;
  return (
    <div className="egm-scene egr-sizer" data-carrying={carrying ? '' : undefined}>
      <div className="egm-pic" style={style}>
        <div role="img" aria-label={label} className="egm-table">
          {children}
        </div>
        {over}
      </div>
    </div>
  );
}

/** The tray: the step's tools on the left, and what it has just taught on the right. */
export function Tray({ tools, notes }: { tools: ReactNode; notes: readonly ApprovedFact[] }) {
  return (
    <div className="egm-tray">
      <div className="egm-tools">{tools}</div>
      <div className="egm-learned" aria-live="polite">
        {notes.length > 0 && <p className="egm-learned-kicker">Did you know?</p>}
        {notes.map((n) => (
          <FactNote key={n.text} fact={n} className="egr-fact" />
        ))}
      </div>
    </div>
  );
}

/**
 * A keyboard handle over a thing in the picture: focusable, read as a
 * slider with its own words, moved with the arrow keys. `onKey` gets the
 * key and says whether it used it.
 */
export function KeyHandle({ at, label, value, valueText, onKey, shape = 'round' }: { at: CSSProperties; label: string; value: number; valueText: string; onKey: (key: string) => boolean; shape?: 'round' | 'wide' }) {
  return (
    <div
      role="slider"
      tabIndex={0}
      className={`egm-key egm-key-${shape}`}
      style={at}
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value * 100)}
      aria-valuetext={valueText}
      onKeyDown={(e: KeyboardEvent) => {
        if (onKey(e.key)) e.preventDefault();
      }}
    />
  );
}

/**
 * A pointer kept on a picture: the point in the picture's own units, with
 * the pointer captured from the press to the lift, so a finger that slips
 * off the body still carries the tool. (In tests, with no layout, there is
 * no point and nothing happens: the keyboard handles are tested instead.)
 */
export function usePicturePointer(handlers: { down?: (p: { x: number; y: number }) => boolean; move?: (p: { x: number; y: number }) => void; up?: () => void }) {
  const svg = useRef<SVGSVGElement>(null);
  const live = useRef(false);
  const on = (kind: 'down' | 'move' | 'up', e: PointerEvent<SVGSVGElement>) => {
    if (kind === 'up') {
      if (live.current) handlers.up?.();
      live.current = false;
      return;
    }
    const p = toSvg(svg.current, e.clientX, e.clientY);
    if (!p) return;
    if (kind === 'down') {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      if (handlers.down?.(p)) {
        live.current = true;
        e.preventDefault();
        svg.current?.setPointerCapture?.(e.pointerId);
      }
      return;
    }
    if (live.current) handlers.move?.(p);
  };
  return { svg, on };
}
