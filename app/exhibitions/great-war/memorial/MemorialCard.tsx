'use client';

import { forwardRef, useCallback, useId, useState } from 'react';
import dynamic from 'next/dynamic';
import type { Fallen } from './fallen';
import { formatDate, restingLines } from './remember';
import { SILHOUETTE_PATH, SILHOUETTE_VIEWBOX } from './silhouettePath';

/*
 * One memorial card, laid out like the printed take-away cards (3.65" × 4.9"):
 * tracing paper, the soldier and the cross from poster 2 with a candle
 * burning behind them, and the record of one of the fallen in real text.
 *
 * Every size inside the card is a fraction of its width, so the card on
 * screen, the saved image and the printed card are the same design at
 * different sizes. The candle flickers only on screen and only when motion is
 * welcome (`live`); prints and saved images use the still frame.
 */

const LiveFlame = dynamic(() => import('./LiveFlame'), { ssr: false });

const STILL = '/exhibitions/great-war/candle-still.svg';

type Props = {
  fallen: Fallen | null;
  /** Play the candle. False for prints and under reduced motion. */
  live?: boolean;
};

const MemorialCard = forwardRef<HTMLElement, Props>(function MemorialCard({ fallen, live = false }, ref) {
  const nameId = useId();
  const [flameReady, setFlameReady] = useState(false);
  const onReady = useCallback(() => setFlameReady(true), []);
  const f = fallen;
  const nameSize = !f ? '' : f.name.length > 34 ? ' is-longest' : f.name.length > 22 ? ' is-long' : '';

  return (
    <article
      ref={ref}
      className={`gwm-mc${live && flameReady ? ' is-flame-live' : ''}`}
      aria-labelledby={f ? nameId : undefined}
      aria-label={f ? undefined : 'A blank memorial card'}
    >
      <div className="gwm-mc-body">
        <div className="gwm-mc-scene" aria-hidden="true">
          <span className="gwm-mc-figure">
            <span className="gwm-mc-glow" />
            <span className="gwm-mc-candle">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="gwm-mc-candle-still" src={STILL} alt="" />
              {live && (
                <span className="gwm-mc-candle-live" data-export-skip="">
                  <LiveFlame onReady={onReady} />
                </span>
              )}
            </span>
            <svg className="gwm-mc-silhouette" viewBox={SILHOUETTE_VIEWBOX} focusable="false">
              <path d={SILHOUETTE_PATH} fillRule="evenodd" />
            </svg>
          </span>
        </div>

        <div className="gwm-mc-text">
          <p className="gwm-mc-inmemory">In Memory</p>
          {f ? (
            <>
              <h3 className={`gwm-mc-name${nameSize}`} id={nameId}>{f.name}</h3>
              {(f.rank || f.unit) && (
                <p className="gwm-mc-service">
                  {f.rank && <span className="gwm-mc-rank">{f.rank}</span>}
                  {f.unit && <span className="gwm-mc-unit">{f.unit}</span>}
                </p>
              )}
              {f.enteredServiceFrom && <p className="gwm-mc-from">From {f.enteredServiceFrom}</p>}
              <p className="gwm-mc-death">
                {f.status}
                <span className="gwm-mc-dot" aria-hidden="true"> · </span>
                <span className="visually-hidden">, </span>
                {formatDate(f.dateOfDeath)}
              </p>
              {f.awards && f.awards.length > 0 && <p className="gwm-mc-awards">{f.awards.join(' · ')}</p>}
              <Resting fallen={f} />
            </>
          ) : (
            <p className="gwm-mc-blank">Press “Remember a soldier” to draw a card.</p>
          )}
        </div>

        <footer className="gwm-mc-foot">
          <p>From the records of the American Battle Monuments Commission</p>
          <p className="gwm-mc-museum">The Mini Museum · The Great War</p>
        </footer>
      </div>
    </article>
  );
});

function Resting({ fallen }: { fallen: Fallen }) {
  const r = restingLines(fallen.resting);
  return (
    <p className="gwm-mc-rest">
      <span className="gwm-mc-rest-lead">{r.lead}</span>
      <span className="gwm-mc-rest-place">{r.place}</span>
      {r.plot && <span className="gwm-mc-rest-plot">{r.plot}</span>}
    </p>
  );
}

export default MemorialCard;
