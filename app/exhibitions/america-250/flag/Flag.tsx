'use client';

import { FLAG, starLayout, starPath, stripesFor, unionHeight } from '../sign/flagLayout';

/*
 * The flag, drawn in SVG: its stripes and its union, with a star for each
 * state (13 to 50; the layouts between the official ones are generic:
 * ../sign/flagLayout.ts). The newest stars pop in (not under reduced
 * motion: flag.css). A picture only: the game plays below it (page.tsx).
 */

const RED = '#a8343b';
const WHITE = '#f6f0e2';
const BLUE = '#2f3561';

export default function Flag({ stars, fresh = 0, label }: { stars: number; /** How many of the stars are new. */ fresh?: number; label: string }) {
  const stripes = stripesFor(stars);
  const uh = unionHeight(stripes);
  const sh = FLAG.h / stripes;
  const layout = starLayout(stars, stripes);

  return (
    <svg className="apf-flag-art" viewBox={`0 0 ${FLAG.w} ${FLAG.h}`} role="img" aria-label={label}>
      <rect width={FLAG.w} height={FLAG.h} fill={WHITE} />
      {Array.from({ length: stripes }, (_, i) =>
        i % 2 === 0 ? <rect key={i} x={0} y={i * sh} width={FLAG.w} height={sh + 0.5} fill={RED} /> : null,
      )}
      <rect x={0} y={0} width={FLAG.unionW} height={uh} fill={BLUE} />
      <g fill={WHITE}>
        {layout.map((p, i) => {
          const isNew = i >= layout.length - fresh;
          return (
            <path
              key={isNew ? `new-${stars}-${i}` : i}
              className={isNew ? 'apf-star apf-star-new' : 'apf-star'}
              style={{ transformOrigin: `${p.x}px ${p.y}px` }}
              d={starPath(p)}
            />
          );
        })}
      </g>
      {/* The cloth's light folds */}
      <rect width={FLAG.w} height={FLAG.h} fill="url(#apf-folds)" />
      <defs>
        <linearGradient id="apf-folds" x1="0" x2="1">
          <stop offset="0%" stopColor="#000" stopOpacity="0.06" />
          <stop offset="22%" stopColor="#fff" stopOpacity="0.08" />
          <stop offset="45%" stopColor="#000" stopOpacity="0.08" />
          <stop offset="70%" stopColor="#fff" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.12" />
        </linearGradient>
      </defs>
    </svg>
  );
}
