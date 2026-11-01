'use client';

import { cloneElement, createContext, isValidElement, useCallback, useContext, useRef, type CSSProperties, type ReactElement, type ReactNode, type RefObject, type PointerEvent as RPointerEvent } from 'react';
import { createPortal } from 'react-dom';
import type { IllusionId } from './data';
import type { Entry, LabResult, Phase } from './results';
import { SLOTS, slotSrc } from './slots';

/*
 * The lab's small parts: every illusion is built from these, so every one
 * has the same big controls (48px and up), works with a finger, a mouse or
 * the keyboard, and records to the notebook the same way.
 */

export type Step = 'try' | 'break' | 'why';

export type BenchProps = {
  /** Which step the visitor is on. */
  step: Step;
  /** "Break it" is on: the trick is switched off. */
  broken: boolean;
  /**
   * What a measurement now is: "before" on Try it, "after" on Break it with
   * the trick switched off, and null otherwise (nothing to write down).
   */
  phase: Phase | null;
  /** The notebook's entry for this illusion, if any. */
  entry?: Entry;
  record: (phase: Phase, r: LabResult) => void;
  teach: boolean;
  reduced: boolean;
};

/** The station's task panel, where each illusion's controls go (beside its picture, or under it). */
export const TaskSlot = createContext<HTMLElement | null>(null);

/**
 * An illusion's two parts: its picture, in the station's fixed picture box,
 * and its task, in the station's task panel (one scrolling panel, so the
 * picture and the Previous and Next buttons never move).
 */
export function Work({ figure, task, label }: { figure: ReactNode; task: ReactNode; label: string }) {
  const slot = useContext(TaskSlot);
  return (
    <>
      <figure className="pl-figure" aria-label={label}>
        {figure}
      </figure>
      {slot && createPortal(<div className="pl-task">{task}</div>, slot)}
    </>
  );
}

/**
 * The illusion's picture: the drawing, or the image in its slot when one is
 * set (see slots.ts). `marks` are drawn over an image in its own pixels.
 * A measured illusion keeps its drawing until Why?.
 */
export function Picture({
  id,
  step,
  broken,
  drawing,
  marks,
  label,
  shift = 0,
}: {
  id: IllusionId;
  step: Step;
  broken: boolean;
  drawing: ReactNode;
  marks?: ReactNode;
  label: string;
  /** Nudge the picture sideways, in its own pixels (Troxler's Break it). */
  shift?: number;
}) {
  const slot = SLOTS[id];
  if (!slot.file || (slot.measured && step !== 'why')) return <>{fitted(drawing)}</>;
  const file = broken && slot.breakFile ? slot.breakFile : slot.file;
  return (
    <svg viewBox={`0 0 ${slot.width} ${slot.height}`} className="pl-svg" style={ar(slot.width, slot.height)} role="img" aria-label={label} data-slot={file}>
      <image href={slotSrc(file)} x={shift} y="0" width={slot.width} height={slot.height} preserveAspectRatio="xMidYMid meet" />
      {marks}
    </svg>
  );
}

/** A drawing's shape, so the picture box can fit it whole and show nothing outside it (see .pl-svg in lab.css). */
const ar = (w: number, h: number) => ({ ['--ar' as string]: `${w / h}` }) as CSSProperties;

function fitted(drawing: ReactNode) {
  if (!isValidElement(drawing) || drawing.type !== 'svg') return drawing;
  const el = drawing as ReactElement<{ viewBox?: string; style?: CSSProperties }>;
  const [, , w, h] = (el.props.viewBox ?? '').split(/[\s,]+/).map(Number);
  return w && h ? cloneElement(el, { style: { ...el.props.style, ...ar(w, h) } }) : drawing;
}

/** Write it down: on Try it "before", on Break it "after". */
export function RecordFor({ phase, onRecord, disabled }: { phase: Phase | null; onRecord: (p: Phase) => void; disabled?: boolean }) {
  if (!phase) return null;
  return (
    <Record onClick={() => onRecord(phase)} disabled={disabled}>
      {phase === 'before' ? 'Write it in my notebook' : 'Write it in my notebook: trick off'}
    </Record>
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
