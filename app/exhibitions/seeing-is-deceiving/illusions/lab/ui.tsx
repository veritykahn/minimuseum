'use client';

import { useCallback, useRef, type ReactNode, type RefObject, type PointerEvent as RPointerEvent } from 'react';
import type { LabResult } from './results';

/*
 * The lab's small parts: every illusion is built from these, so every one
 * has the same big controls (48px and up), works with a finger, a mouse or
 * the keyboard, and records to the notebook the same way.
 */

export type BenchProps = {
  /** "Break it" is on: the trick is switched off. */
  broken: boolean;
  /** The notebook's entry for this illusion, if any. */
  result?: LabResult;
  record: (r: LabResult) => void;
  teach: boolean;
  reduced: boolean;
};

/** An illusion's two parts: its picture, and its task beside (or under) it. */
export function Work({ figure, task, label }: { figure: ReactNode; task: ReactNode; label: string }) {
  return (
    <div className="pl-work">
      <figure className="pl-figure" aria-label={label}>
        {figure}
      </figure>
      <div className="pl-task">{task}</div>
    </div>
  );
}

/** A slider with a step down and a step up beside it: arrows, Page Up/Down, Home and End work on it. */
export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  big = 5,
  onChange,
  valueText,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  /** The buttons' step. */
  big?: number;
  onChange: (v: number) => void;
  valueText?: string;
}) {
  const set = (v: number) => onChange(Math.max(min, Math.min(max, Math.round(v / step) * step)));
  return (
    <div className="pl-slider">
      <span className="pl-slider-label">{label}</span>
      <div className="pl-slider-row">
        <button type="button" className="pl-btn pl-btn-icon" onClick={() => set(value - big * step)} disabled={value <= min} aria-label={`${label}: less`}>
          <span aria-hidden="true">−</span>
        </button>
        <input
          type="range"
          className="pl-range"
          min={min}
          max={max}
          step={step}
          value={value}
          aria-label={label}
          aria-valuetext={valueText}
          onChange={(e) => set(Number(e.currentTarget.value))}
        />
        <button type="button" className="pl-btn pl-btn-icon" onClick={() => set(value + big * step)} disabled={value >= max} aria-label={`${label}: more`}>
          <span aria-hidden="true">+</span>
        </button>
      </div>
    </div>
  );
}

/** A question with a few answers, one chosen: the observation the notebook records. */
export function Choices<T extends string>({
  question,
  options,
  value,
  onChoose,
}: {
  question: string;
  options: { id: T; label: string; swatch?: string }[];
  value: T | null;
  onChoose: (id: T) => void;
}) {
  return (
    <fieldset className="pl-choices">
      <legend className="pl-q">{question}</legend>
      <div className="pl-choice-row">
        {options.map((o) => (
          <button key={o.id} type="button" className="pl-btn pl-choice" aria-pressed={value === o.id} onClick={() => onChoose(o.id)}>
            {o.swatch && <span className="pl-swatch" style={{ background: o.swatch }} aria-hidden="true" />}
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function Record({ onClick, children = 'Write it in my notebook', disabled }: { onClick: () => void; children?: ReactNode; disabled?: boolean }) {
  return (
    <button type="button" className="pl-btn pl-btn-primary" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

/** Drag on an SVG: reports the pointer in the SVG's own units. */
export function useSvgDrag(svg: RefObject<SVGSVGElement | null>, onMove: (x: number, y: number) => void) {
  const dragging = useRef(false);
  const at = useCallback(
    (e: RPointerEvent) => {
      const s = svg.current;
      if (!s) return;
      const m = s.getScreenCTM();
      if (!m) return;
      const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
      onMove(p.x, p.y);
    },
    [svg, onMove],
  );
  return {
    onPointerDown: (e: RPointerEvent) => {
      dragging.current = true;
      (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
      at(e);
    },
    onPointerMove: (e: RPointerEvent) => {
      if (dragging.current) at(e);
    },
    onPointerUp: () => {
      dragging.current = false;
    },
    onPointerCancel: () => {
      dragging.current = false;
    },
  };
}

/** A grey from 0 (black) to 255 (white). */
export const grey = (v: number) => {
  const n = Math.round(Math.max(0, Math.min(255, v)));
  return `rgb(${n}, ${n}, ${n})`;
};
