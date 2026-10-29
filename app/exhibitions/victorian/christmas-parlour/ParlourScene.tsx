'use client';

import type { CSSProperties } from 'react';
import { PARTS, type PartId } from './parlourText';

/*
 * The parlour on Christmas Eve: the owner's two paintings of the same room
 * (made with Leonardo.Ai, credited in the room), one cold and dark, one
 * warm and lit, lined up so one fades into the other. Each part the poster
 * names is a button over the painting; opened, the warm painting shows
 * through around it (the candles on the tree, the fire, the clock on the
 * mantel), and the whole room warms a little more with each one, until with
 * all six it is the warm painting. What the paintings don't have is drawn
 * over them: the Christmas cards along the mantelpiece, the book lying open
 * on the little table, the clock's second hand, and the snowy village
 * beyond the window (poster 2's own painting, cropped from the poster).
 */

export const SCENE = { w: 2400, h: 1340 };

const COLD = '/exhibitions/victorian/parlour/parlour-cold.webp';
const WARM = '/exhibitions/victorian/parlour/parlour-warm.webp';

/** Where each part's button sits over the painting, in the painting's pixels. */
const SPOTS: Record<PartId, { x: number; y: number; w: number; h: number }> = {
  clock: { x: 585, y: 345, w: 160, h: 225 },
  tree: { x: 1660, y: 330, w: 310, h: 540 },
  cards: { x: 752, y: 470, w: 212, h: 120 },
  book: { x: 1405, y: 815, w: 190, h: 125 },
  window: { x: 1545, y: 85, w: 325, h: 272 },
  hearth: { x: 470, y: 720, w: 330, h: 430 },
};

/** Where the warm painting shows through when a part is opened: a soft ellipse, centre and radii. */
const GLOWS: Record<PartId, [number, number, number, number]> = {
  clock: [662, 460, 120, 150],
  tree: [1810, 600, 230, 340],
  cards: [680, 530, 330, 110],
  book: [1495, 880, 160, 110],
  window: [1710, 400, 230, 360],
  hearth: [640, 900, 440, 420],
};

/** The upper sash's six panes, where the village shows (the tree stands before the lower). */
const PANES = [
  [1556, 132, 114, 120],
  [1684, 116, 112, 136],
  [1810, 132, 58, 120],
  [1556, 272, 114, 144],
  [1684, 272, 112, 144],
  [1810, 272, 58, 144],
];
/** The star on the tree's top, standing against the glass: x, y, radius. */
const STAR = [1822, 368, 48];

/** The cards along the mantel shelf, right of the clock: x, tilt, and the card front on each. */
const MANTEL_CARDS: [number, number, string][] = [
  [768, -5, 'card-robin'],
  [814, 3, 'card-church'],
  [860, -2, 'card-wreath'],
  [906, 5, 'card-feast'],
];
const SHELF = 578;

const pct = (v: number, of: number) => `${(v / of) * 100}%`;

export default function ParlourScene({ open, current, onPart, reduced }: { open: Set<PartId>; current: PartId | null; onPart: (id: PartId) => void; reduced: boolean }) {
  const is = (id: PartId) => open.has(id);
  const warmth = open.size / PARTS.length;
  return (
    <div className="vcp-scene" style={{ '--warmth': warmth } as CSSProperties} data-reduced={reduced || undefined}>
      <svg className="vcp-svg" viewBox={`0 0 ${SCENE.w} ${SCENE.h}`} aria-hidden="true">
        <defs>
          <radialGradient id="vcp-feather">
            <stop offset="0.55" stopColor="#fff" />
            <stop offset="1" stopColor="#000" />
          </radialGradient>
          {PARTS.map(({ id }) => {
            const [cx, cy, rx, ry] = GLOWS[id];
            return (
              <mask key={id} id={`vcp-glow-${id}`} maskUnits="userSpaceOnUse" x="0" y="0" width={SCENE.w} height={SCENE.h}>
                <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="url(#vcp-feather)" />
              </mask>
            );
          })}
          {/* The whole room's warmth, kept off each part until it is opened, so the fire isn't lit before it is. */}
          <radialGradient id="vcp-shade">
            <stop offset="0.55" stopColor="#000" />
            <stop offset="1" stopColor="#000" stopOpacity="0" />
          </radialGradient>
          <mask id="vcp-room" maskUnits="userSpaceOnUse" x="0" y="0" width={SCENE.w} height={SCENE.h}>
            <rect width={SCENE.w} height={SCENE.h} fill="#fff" />
            {PARTS.map(({ id }) => {
              const [cx, cy, rx, ry] = GLOWS[id];
              return <ellipse key={id} className="vcp-shade" data-open={is(id) || undefined} cx={cx} cy={cy} rx={rx} ry={ry} fill="url(#vcp-shade)" />;
            })}
          </mask>
          {/* The glass, clear of the tree's star; the snow falls past the lower sash's left panes too, clear of the tree. */}
          <mask id="vcp-panes" maskUnits="userSpaceOnUse" x="0" y="0" width={SCENE.w} height={SCENE.h}>
            {/* softened at the edges, so the frost on the glass holds the village in */}
            <g filter="url(#vcp-soft)">
              {PANES.map(([x, y, w, h]) => (
                <rect key={`${x},${y}`} x={x + 4} y={y + 4} width={w - 8} height={h - 8} rx="14" fill="#fff" />
              ))}
            </g>
            <circle cx={STAR[0]} cy={STAR[1]} r={STAR[2]} fill="url(#vcp-shade)" />
          </mask>
          <filter id="vcp-soft" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
          <mask id="vcp-glass" maskUnits="userSpaceOnUse" x="0" y="0" width={SCENE.w} height={SCENE.h}>
            {[...PANES, [1556, 462, 92, 296]].map(([x, y, w, h]) => (
              <rect key={`${x},${y}`} x={x} y={y} width={w} height={h} rx="10" fill="#fff" />
            ))}
            <circle cx={STAR[0]} cy={STAR[1]} r={STAR[2]} fill="url(#vcp-shade)" />
          </mask>
          <filter id="vcp-frost">
            <feGaussianBlur stdDeviation="1.6" />
            <feColorMatrix type="saturate" values="0.75" />
            <feComponentTransfer>
              <feFuncR type="linear" slope="1.15" intercept="0.06" />
              <feFuncG type="linear" slope="1.15" intercept="0.07" />
              <feFuncB type="linear" slope="1.15" intercept="0.1" />
            </feComponentTransfer>
          </filter>
        </defs>

        {/* the cold room, and the warm one over it, warming with each part opened */}
        <image href={COLD} width={SCENE.w} height={SCENE.h} />
        <image className="vcp-warm" href={WARM} width={SCENE.w} height={SCENE.h} mask="url(#vcp-room)" />

        {/* each part, brought to life: the warm painting shown round it */}
        {PARTS.map(({ id }) => (
          <image key={id} className={`vcp-lit vcp-lit-${id}`} data-open={is(id) || undefined} href={WARM} width={SCENE.w} height={SCENE.h} mask={`url(#vcp-glow-${id})`} />
        ))}

        {/* the window: the village beyond the frosted glass, and the snow falling past it */}
        <g className="vcp-window" data-open={is('window') || undefined}>
          <g mask="url(#vcp-panes)">
            <image className="vcp-village" href="/exhibitions/victorian/village.jpg" x="1556" y="116" width="312" height="300" preserveAspectRatio="xMidYMid slice" filter="url(#vcp-frost)" />
          </g>
          <g mask="url(#vcp-glass)">
            <g className="vcp-snow">
              {Array.from({ length: 34 }, (_, i) => (
                <circle key={i} cx={1550 + ((i * 47) % 318)} cy={60 + ((i * 89) % 720)} r={i % 3 ? 3 : 4.5} fill="#fff" opacity="0.85" />
              ))}
            </g>
          </g>
        </g>

        {/* the clock: its second hand, going once it is opened */}
        <g className="vcp-clock" data-open={is('clock') || undefined}>
          <line className="vcp-clock-sec" x1="680" y1="461" x2="680" y2="436" stroke="#7a2a24" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* the cards, stood along the mantel shelf, each with a card maker's front on it */}
        <g className="vcp-cards" data-open={is('cards') || undefined}>
          {MANTEL_CARDS.map(([x, r, front], i) => (
            <g key={front} className="vcp-card" style={{ transitionDelay: `${i * 0.12}s` }} transform={`rotate(${r} ${x + 19} ${SHELF})`}>
              <rect x={x} y={SHELF - 52} width="38" height="52" fill="#f4eee3" stroke="#6b4a32" strokeWidth="1.5" />
              <image href={`/exhibitions/victorian/christmas-card/${front}.webp`} x={x + 4} y={SHELF - 48} width="30" height="37" preserveAspectRatio="xMidYMid slice" />
            </g>
          ))}
        </g>

        {/* the book, laid open on top of the pile on the little table */}
        <g className="vcp-book" data-open={is('book') || undefined}>
          <path d="M1440 858 Q1470 846 1498 852 Q1526 846 1556 858 L1556 838 Q1526 826 1498 832 Q1470 826 1440 838Z" fill="#f8f0dc" stroke="#a8343a" strokeWidth="3" />
          <path d="M1498 832 V852" stroke="#c9b48a" strokeWidth="1.5" />
          <path d="M1452 840 H1490 M1452 846 H1486 M1508 840 H1546 M1512 846 H1546" stroke="#6b5a44" strokeWidth="1.2" opacity="0.7" />
        </g>
      </svg>

      {PARTS.map((p) => {
        const s = SPOTS[p.id];
        return (
          <button
            key={p.id}
            type="button"
            className="vcp-spot"
            data-open={is(p.id) || undefined}
            aria-current={current === p.id ? 'true' : undefined}
            aria-pressed={is(p.id)}
            aria-label={`${p.name}, in the room`}
            style={{ left: pct(s.x, SCENE.w), top: pct(s.y, SCENE.h), width: pct(s.w, SCENE.w), height: pct(s.h, SCENE.h) }}
            onClick={() => onPart(p.id)}
          >
            <span className="vcp-spot-label">{p.name}</span>
          </button>
        );
      })}
    </div>
  );
}
