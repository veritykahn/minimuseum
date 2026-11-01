'use client';

import { useEffect, useRef, useState } from 'react';
import { BAND_INSTRUMENTS, type BandInstrumentId } from './data';
import InstrumentIcon from './InstrumentIcon';

/**
 * The band on the stage floor: when an instrument is added, its player walks
 * on from the nearer wing to their place, with their instrument; sent off,
 * they walk back off. The soloist stands in the spotlight. Each player's
 * place lines up with the spotlight's (one sixth of the stage each).
 *
 * Decorative: the instrument buttons below say who is on stage, so this is
 * hidden from screen readers. Under reduced motion the players simply
 * appear and go.
 */

const LEAVE_MS = 650;

/** A musician in silhouette, in the lab's gold, holding (or seated at) their instrument. */
function Player({ id, solo }: { id: BandInstrumentId; solo: boolean }) {
  const seated = id === 'drums' || id === 'piano';
  return (
    <svg className="jl-player-figure" viewBox="0 0 80 112" aria-hidden="true" focusable="false">
      {solo && <path className="jl-player-light" d="M30 0 L50 0 L78 112 L2 112 Z" />}
      <g className="jl-player-body">
        <circle cx="40" cy="22" r="9" />
        {seated ? (
          <>
            <path d="M28 38 Q40 31 52 38 L54 66 L26 66 Z" />
            <path d="M28 66 L22 82 M52 66 L58 82" className="jl-player-limb" />
            {/* The stool, down to the boards */}
            <path d="M26 72 H54 M30 72 L28 106 M50 72 L52 106" className="jl-player-limb jl-player-stool" />
          </>
        ) : (
          <>
            <path d="M27 38 Q40 31 53 38 L55 74 L25 74 Z" />
            <path d="M33 74 L31 104 M47 74 L49 104" className="jl-player-limb jl-player-legs" />
          </>
        )}
      </g>
      <svg x={seated ? 14 : 18} y={seated ? 52 : 40} width={seated ? 52 : 44} height={seated ? 52 : 44} viewBox="0 0 48 48" className="jl-player-instrument">
        <InstrumentIcon id={id} size={48} />
      </svg>
    </svg>
  );
}

export default function StagePlayers({ active, spotlight }: { active: ReadonlySet<BandInstrumentId>; spotlight: BandInstrumentId | null }) {
  // Players just sent off, still walking to the wings.
  const [leaving, setLeaving] = useState<BandInstrumentId[]>([]);
  const before = useRef<ReadonlySet<BandInstrumentId>>(active);
  const timers = useRef<number[]>([]);
  useEffect(() => {
    const gone = [...before.current].filter((id) => !active.has(id));
    before.current = active;
    // Brought straight back: on stage again, not leaving.
    setLeaving((l) => [...l.filter((id) => !active.has(id) && !gone.includes(id)), ...gone]);
    if (!gone.length) return;
    timers.current.push(window.setTimeout(() => setLeaving((l) => l.filter((id) => !gone.includes(id))), LEAVE_MS));
  }, [active]);
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  return (
    <div className="jl-stage-floor" aria-hidden="true" data-players={[...active].join(' ')}>
      {BAND_INSTRUMENTS.map((inst, i) => {
        const on = active.has(inst.id);
        const off = !on && leaving.includes(inst.id);
        // The left three come on from the left wing, the right three from the right.
        const from = i < BAND_INSTRUMENTS.length / 2 ? -1 : 1;
        return (
          <div className="jl-player-spot" key={inst.id}>
            {(on || off) && (
              <div
                className={`jl-player ${off ? 'is-leaving' : ''} ${spotlight === inst.id ? 'is-solo' : ''}`}
                data-player={inst.id}
                style={{ '--from': from } as React.CSSProperties}
              >
                <Player id={inst.id} solo={spotlight === inst.id && on} />
              </div>
            )}
          </div>
        );
      })}
      <span className="jl-stage-boards" />
    </div>
  );
}
