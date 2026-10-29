'use client';

import { useRef, type KeyboardEvent, type PointerEvent } from 'react';

/*
 * A microscope's focus knob: turn it by dragging around it (or up and down),
 * with the scroll wheel, or with the arrow keys. It is a slider to a screen
 * reader, 0 to 100.
 */

const SWEEP = 300; // degrees from 0 to 100

export default function Knob({
  value,
  onChange,
  label,
  valueText,
}: {
  value: number;
  onChange: (v: number) => void;
  label: string;
  valueText?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef<{ angle: number; value: number; y: number } | null>(null);
  const clamp = (v: number) => Math.max(0, Math.min(100, Math.round(v)));

  const angleOf = (e: PointerEvent) => {
    const r = ref.current!.getBoundingClientRect();
    return (Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180) / Math.PI;
  };
  // Near the middle the angle swings wildly: there only pulling counts.
  const nearMiddle = (e: PointerEvent) => {
    const r = ref.current!.getBoundingClientRect();
    return Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2)) < r.width * 0.3;
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { angle: angleOf(e), value, y: e.clientY };
    e.currentTarget.focus();
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    // Turning around the knob, or pulling straight up and down: whichever moved more.
    let turn = angleOf(e) - d.angle;
    if (turn > 180) turn -= 360;
    if (turn < -180) turn += 360;
    const byTurn = nearMiddle(e) ? 0 : (turn / SWEEP) * 100;
    const byPull = (d.y - e.clientY) * 0.5;
    const next = clamp(d.value + (Math.abs(byTurn) > Math.abs(byPull) ? byTurn : byPull));
    if (next !== value) onChange(next);
    if (Math.abs(turn) > 90 || nearMiddle(e)) drag.current = { angle: angleOf(e), value: next, y: e.clientY };
  };
  const onPointerUp = () => {
    drag.current = null;
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step =
      e.key === 'ArrowUp' || e.key === 'ArrowRight' ? 2
      : e.key === 'ArrowDown' || e.key === 'ArrowLeft' ? -2
      : e.key === 'PageUp' ? 10
      : e.key === 'PageDown' ? -10
      : null;
    if (step !== null) {
      e.preventDefault();
      onChange(clamp(value + step));
    } else if (e.key === 'Home' || e.key === 'End') {
      e.preventDefault();
      onChange(e.key === 'Home' ? 0 : 100);
    }
  };

  const rot = -SWEEP / 2 + (value / 100) * SWEEP;

  return (
    <div
      ref={ref}
      className="mo-knob"
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      aria-valuetext={valueText}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onKeyDown={onKeyDown}
      onWheel={(e) => onChange(clamp(value + (e.deltaY < 0 ? 2 : -2)))}
    >
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <defs>
          <radialGradient id="mo-knob-face" cx="38%" cy="32%" r="75%">
            <stop offset="0" stopColor="#5b4a8f" />
            <stop offset="0.6" stopColor="#2c2350" />
            <stop offset="1" stopColor="#17122c" />
          </radialGradient>
        </defs>
        {/* The scale around the knob */}
        {Array.from({ length: 31 }, (_, i) => {
          const a = ((-SWEEP / 2 + (i / 30) * SWEEP - 90) * Math.PI) / 180;
          const long = i % 5 === 0;
          // Rounded, so the server and the browser write the same numbers.
          const at = (r: number, f: (x: number) => number) => Math.round((50 + f(a) * r) * 100) / 100;
          return (
            <line
              key={i}
              x1={at(47, Math.cos)}
              y1={at(47, Math.sin)}
              x2={at(long ? 41 : 43.5, Math.cos)}
              y2={at(long ? 41 : 43.5, Math.sin)}
              className={i / 30 <= value / 100 ? 'mo-knob-tick is-on' : 'mo-knob-tick'}
            />
          );
        })}
        <g transform={`rotate(${rot} 50 50)`}>
          {/* The knurled rim */}
          <circle cx="50" cy="50" r="37" className="mo-knob-rim" />
          {Array.from({ length: 36 }, (_, i) => (
            <line key={i} x1="50" y1="13.5" x2="50" y2="18" transform={`rotate(${i * 10} 50 50)`} className="mo-knob-knurl" />
          ))}
          <circle cx="50" cy="50" r="31" fill="url(#mo-knob-face)" className="mo-knob-face" />
          <line x1="50" y1="23" x2="50" y2="38" className="mo-knob-mark" />
        </g>
      </svg>
    </div>
  );
}
