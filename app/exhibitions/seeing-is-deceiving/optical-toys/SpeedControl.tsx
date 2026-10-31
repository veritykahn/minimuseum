'use client';

import { SPEED_STEPS } from './spin';

/*
 * The speed: a smooth slider of SPEED_STEPS small steps, from still to the
 * toy's fastest, with a step slower and a step faster beside it (the arrow
 * keys on the slider step one at a time; Page Up and Down, ten). A line says
 * what is on screen at this speed. At the flicker-free step the toy waits,
 * and a calm note asks before it goes on (the flicker is how the real toy
 * works, and not everyone should watch it).
 */
export default function SpeedControl({
  step,
  gate,
  flickerOk,
  asking,
  seen,
  turns,
  onStep,
  onYes,
  onNo,
}: {
  step: number;
  gate: number;
  flickerOk: boolean;
  asking: boolean;
  seen: string;
  /** Turns a second, for the read-out. */
  turns: number;
  onStep: (v: number) => void;
  onYes: () => void;
  onNo: () => void;
}) {
  const pct = (gate / SPEED_STEPS) * 100;
  const turnsText = turns === 0 ? 'Still' : `${turns < 1 ? turns.toFixed(2) : turns.toFixed(1)} turns a second`;
  return (
    <div className="vto-speed" role="group" aria-label="Speed">
      <div className="vto-speed-row">
        <button type="button" className="vto-button vto-button-small" onClick={() => onStep(step - 5)} disabled={step <= 0} aria-label="Slower">
          <span aria-hidden="true">−</span>
        </button>
        <div className="vto-speed-track" style={{ ['--gate' as string]: `${pct}%` }} data-flicker-ok={flickerOk || undefined}>
          <input
            type="range"
            className="vto-speed-range"
            min={0}
            max={SPEED_STEPS}
            step={1}
            value={step}
            aria-label="Speed"
            aria-valuetext={`${turnsText}. ${seen}`}
            onChange={(e) => onStep(Number(e.currentTarget.value))}
          />
          {!flickerOk && <span className="vto-speed-gate" aria-hidden="true" />}
        </div>
        <button type="button" className="vto-button vto-button-small" onClick={() => onStep(step + 5)} disabled={step >= SPEED_STEPS} aria-label="Faster">
          <span aria-hidden="true">+</span>
        </button>
      </div>
      <p className="vto-speed-label">
        <span className="vto-speed-n">{turnsText}</span>
        <span className="vto-speed-seen">{seen}</span>
      </p>
      {asking && (
        <div className="vto-flicker" role="alertdialog" aria-labelledby="vto-flicker-title" aria-describedby="vto-flicker-text">
          <p className="vto-flicker-title" id="vto-flicker-title">Flicker ahead</p>
          <p className="vto-flicker-text" id="vto-flicker-text">
            Faster than this, the toy flickers, just as the real one does. If flickering or flashing light bothers you, or gives you a headache, stay at this speed.
          </p>
          <div className="vto-actions">
            <button type="button" className="vto-button vto-button-primary" onClick={onYes}>
              Go faster
            </button>
            <button type="button" className="vto-button" onClick={onNo}>
              Stay slow
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
