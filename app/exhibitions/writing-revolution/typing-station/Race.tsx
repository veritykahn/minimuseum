'use client';

import { useEffect, useRef, useState } from 'react';
import { srOnly } from '@/lib/a11y';
import type { Machine } from '@/lib/classBoard';
import { STATION_TEXT } from './stationText';
import { clockText, raceVerdict, spokenTime } from './challenges';

/*
 * The race: the line typed on the typewriter, then on the iMac, each against
 * its own stopwatch. A clock starts at the machine's first key and stops by
 * itself when the line is typed right (or at "Stop the clock"). The results
 * set the two times side by side, big enough for a class to call out from a
 * projector, with the strike-overs the typewriter needed.
 */

const R = STATION_TEXT.race;

export type RaceState = {
  /** The machine racing now, or 'done'. */
  stage: Machine | 'done';
  /** When the racing machine's clock started (its first key), or null until then. */
  start: number | null;
  times: Partial<Record<Machine, number>>;
  /** Letters off the line when each clock stopped: 0 when it stopped by itself. */
  mistakes: Partial<Record<Machine, number>>;
  /** The typewriter's strike-overs when its clock stopped. */
  strikeOvers: number;
};

export const newRace = (): RaceState => ({ stage: 'typewriter', start: null, times: {}, mistakes: {}, strikeOvers: 0 });

/** A stopwatch: still, or running from `start`. Its digits are shown, not read out as they tick. */
function Clock({ label, ms, start, active }: { label: string; ms?: number; start: number | null; active: boolean }) {
  const [now, setNow] = useState(() => Date.now());
  const running = active && start !== null && ms === undefined;
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(t);
  }, [running]);
  const shown = ms ?? (running ? Math.max(0, now - start!) : 0);
  return (
    <span className={`wrs-clock ${active ? 'is-active' : ''} ${ms !== undefined ? 'is-done' : ''}`}>
      <span className="wrs-clock-name">{label}</span>
      <span className="wrs-clock-time" aria-hidden="true">{clockText(shown)}</span>
      <span style={srOnly}>{ms !== undefined ? spokenTime(ms) : running ? 'running' : 'not started'}</span>
    </span>
  );
}

export function RaceBar({
  race,
  line,
  tab,
  onStop,
  onNext,
  onQuit,
}: {
  race: RaceState;
  line: string;
  tab: string;
  onStop: () => void;
  onNext: () => void;
  onQuit: () => void;
}) {
  const { stage, start, times } = race;
  const waiting = stage === 'imac' && tab !== 'imac';
  return (
    <div className="wrs-race" role="group" aria-label="The race">
      <p className="wrs-line">
        <span className="wrs-line-label">{R.label}</span> {line}
      </p>
      <div className="wrs-race-row">
        <Clock label={STATION_TEXT.typewriterTab} ms={times.typewriter} start={start} active={stage === 'typewriter'} />
        <Clock label={STATION_TEXT.imacTab} ms={times.imac} start={start} active={stage === 'imac'} />
        {waiting ? (
          <button type="button" className="wrs-button wrs-button-post" onClick={onNext}>
            {R.onToImac} <span aria-hidden="true">→</span>
          </button>
        ) : (
          stage !== 'done' && (
            <button type="button" className="wrs-button" onClick={onStop} disabled={start === null || stage !== tab}>
              {R.stop}
            </button>
          )
        )}
        <button type="button" className="wrs-button wrs-button-ghost" onClick={onQuit}>
          {R.quit}
        </button>
      </div>
    </div>
  );
}

export function RaceResults({ race, onAgain, onPost, onClose }: { race: RaceState; onAgain: () => void; onPost?: () => void; onClose: () => void }) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => heading.current?.focus(), []);
  const tw = race.times.typewriter ?? 0;
  const im = race.times.imac ?? 0;
  const winner: Machine | null = Math.abs(tw - im) < 100 ? null : im < tw ? 'imac' : 'typewriter';
  const side = (m: Machine, ms: number) => (
    <div className={`wrr-side wrr-side-${m} ${winner === m ? 'is-winner' : ''}`}>
      <p className="wrr-machine">{m === 'imac' ? STATION_TEXT.imacName : STATION_TEXT.typewriterName}</p>
      <p className="wrr-time" aria-label={spokenTime(ms)}>{clockText(ms)}</p>
      {m === 'typewriter' && <p className="wrr-detail wrr-strikes">{R.strikeOvers(race.strikeOvers)}</p>}
      <p className="wrr-detail">{R.mistakes(race.mistakes[m] ?? 0)}</p>
    </div>
  );
  return (
    <section
      className="wrr"
      aria-labelledby="wrr-title"
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose();
      }}
    >
      <div className="wrr-card">
        <h2 id="wrr-title" className="wrr-title" ref={heading} tabIndex={-1}>
          {R.results}
        </h2>
        <p className="wrr-verdict" role="status">
          {raceVerdict(tw, im)}
        </p>
        <div className="wrr-sides">
          {side('typewriter', tw)}
          <span className="wrr-vs" aria-hidden="true">vs</span>
          {side('imac', im)}
        </div>
        <p className="wrr-think">{R.think}</p>
        <div className="wrr-actions">
          <button type="button" className="wrs-button" onClick={onAgain}>{R.again}</button>
          {onPost && (
            <button type="button" className="wrs-button wrs-button-post" onClick={onPost}>{R.post}</button>
          )}
          <button type="button" className="wrs-button wrs-button-ghost" onClick={onClose}>{R.close}</button>
        </div>
      </div>
    </section>
  );
}

/** The race's times as one message for the class board. */
export function raceMessage(race: RaceState): string {
  const tw = race.times.typewriter ?? 0;
  const im = race.times.imac ?? 0;
  return `Our race: typewriter ${clockText(tw)} (${R.strikeOvers(race.strikeOvers)}), iMac ${clockText(im)}. ${raceVerdict(tw, im)}`;
}
