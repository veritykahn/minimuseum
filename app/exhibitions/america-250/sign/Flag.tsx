'use client';

import type { KeyboardEvent } from 'react';
import { FLAG, starLayout, starPath, stripesFor, unionHeight } from './flagLayout';
import { FLAG_MAX, FLAG_MIN } from './signText';

/*
 * The flag on the desk, drawn in SVG: its stripes and its union, with a star
 * for each state. A tap adds a star; as a slider, the arrow keys add and take
 * away, Home and End go to 13 and 50. The newest star pops in (not under
 * reduced motion: sign.css).
 */

const RED = '#a8343b';
const WHITE = '#f6f0e2';
const BLUE = '#2f3561';

export default function Flag({ stars, grew, onStars }: { stars: number; grew: boolean; onStars: (n: number) => void }) {
  const stripes = stripesFor(stars);
  const uh = unionHeight(stripes);
  const sh = FLAG.h / stripes;
  const layout = starLayout(stars, stripes);

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const to =
      e.key === 'ArrowRight' || e.key === 'ArrowUp' ? stars + 1
      : e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? stars - 1
      : e.key === 'PageUp' ? stars + 5
      : e.key === 'PageDown' ? stars - 5
      : e.key === 'Home' ? FLAG_MIN
      : e.key === 'End' ? FLAG_MAX
      : null;
    if (to === null) return;
    e.preventDefault();
    onStars(Math.max(FLAG_MIN, Math.min(FLAG_MAX, to)));
  };

  return (
    <div
      className="aps-flag"
      role="slider"
      tabIndex={0}
      aria-label="The flag’s stars. Tap to add a star."
      aria-valuemin={FLAG_MIN}
      aria-valuemax={FLAG_MAX}
      aria-valuenow={stars}
      aria-valuetext={`${stars} stars and ${stripes} stripes`}
      onKeyDown={onKey}
      onClick={() => onStars(Math.min(FLAG_MAX, stars + 1))}
    >
      <svg className="aps-flag-art" viewBox={`0 0 ${FLAG.w} ${FLAG.h}`} aria-hidden="true">
        <rect width={FLAG.w} height={FLAG.h} fill={WHITE} />
        {Array.from({ length: stripes }, (_, i) =>
          i % 2 === 0 ? <rect key={i} className="aps-flag-stripe" x={0} y={i * sh} width={FLAG.w} height={sh + 0.5} fill={RED} /> : null,
        )}
        <rect x={0} y={0} width={FLAG.unionW} height={uh} fill={BLUE} />
        <g fill={WHITE}>
          {layout.map((p, i) => (
            <path
              key={grew && i === layout.length - 1 ? `new-${stars}` : i}
              className={grew && i === layout.length - 1 ? 'aps-flag-star aps-flag-star-new' : 'aps-flag-star'}
              style={{ transformOrigin: `${p.x}px ${p.y}px` }}
              d={starPath(p)}
            />
          ))}
        </g>
        {/* The cloth's light folds */}
        <rect width={FLAG.w} height={FLAG.h} fill="url(#aps-flag-folds)" />
        <defs>
          <linearGradient id="aps-flag-folds" x1="0" x2="1">
            <stop offset="0%" stopColor="#000" stopOpacity="0.06" />
            <stop offset="22%" stopColor="#fff" stopOpacity="0.08" />
            <stop offset="45%" stopColor="#000" stopOpacity="0.08" />
            <stop offset="70%" stopColor="#fff" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.12" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
