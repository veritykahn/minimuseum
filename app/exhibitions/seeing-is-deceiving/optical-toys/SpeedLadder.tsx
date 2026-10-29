'use client';

import type { Rung } from './spin';

/*
 * The speed, as a ladder of rungs that rise left to right: the rung the toy
 * stands on is lit, and a line says what is on screen at that speed. Slower
 * and faster step a rung by hand (which holds the toy there); "Keep
 * climbing" carries on up.
 */
export default function SpeedLadder({
  ladder,
  rung,
  climbing,
  seen,
  onFaster,
  onSlower,
  onClimb,
}: {
  ladder: Rung[];
  rung: number;
  climbing: boolean;
  seen: string;
  onFaster: () => void;
  onSlower: () => void;
  onClimb: () => void;
}) {
  const top = rung === ladder.length - 1;
  return (
    <div className="vto-ladder" role="group" aria-label="Speed">
      <div className="vto-ladder-row">
        <button type="button" className="vto-button vto-button-small" onClick={onSlower} disabled={rung <= 0} aria-label="Slower">
          <span aria-hidden="true">−</span>
        </button>
        <ol className="vto-rungs" aria-hidden="true">
          {ladder.map((_, i) => (
            <li key={i} className="vto-rung" data-on={i <= rung || undefined} data-current={i === rung || undefined} style={{ height: `${30 + (70 * i) / (ladder.length - 1)}%` }} />
          ))}
        </ol>
        <button type="button" className="vto-button vto-button-small" onClick={onFaster} disabled={top} aria-label="Faster">
          <span aria-hidden="true">+</span>
        </button>
      </div>
      <p className="vto-ladder-label">
        <span className="vto-ladder-n">{rung < 0 ? 'Still' : `Speed ${rung + 1} of ${ladder.length}`}</span>
        {rung >= 0 && <span className="vto-ladder-seen">{seen}</span>}
      </p>
      {rung >= 0 && !climbing && !top && (
        <button type="button" className="vto-button vto-button-quiet vto-ladder-climb" onClick={onClimb}>
          Keep climbing
        </button>
      )}
    </div>
  );
}
