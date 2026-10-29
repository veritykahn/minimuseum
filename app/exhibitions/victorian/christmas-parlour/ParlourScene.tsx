'use client';

import type { CSSProperties } from 'react';
import { PARTS, type PartId } from './parlourText';

/*
 * The parlour on Christmas Eve, drawn in SVG in the posters' palette: the
 * damask wall and the dado, the tree in the corner, the window with the
 * snowy village beyond (the village painting is poster 2's own, cropped
 * from the poster), the round table with its book, and the fireplace with
 * the clock on the mantel. Each part the poster names is a button over the
 * drawing; opened, it comes to life (the candles lit, the curtains drawn,
 * the fire blazing), and the room grows warmer with each one.
 */

export const SCENE = { w: 1200, h: 760 };

/** Where each part's button sits over the drawing, in the drawing's units. */
const SPOTS: Record<PartId, { x: number; y: number; w: number; h: number }> = {
  tree: { x: 70, y: 120, w: 270, h: 520 },
  window: { x: 395, y: 110, w: 250, h: 340 },
  book: { x: 540, y: 500, w: 220, h: 120 },
  clock: { x: 880, y: 196, w: 90, h: 102 },
  cards: { x: 780, y: 236, w: 92, h: 66 },
  hearth: { x: 790, y: 330, w: 270, h: 300 },
};

const pct = (v: number, of: number) => `${(v / of) * 100}%`;

export default function ParlourScene({ open, current, onPart, reduced }: { open: Set<PartId>; current: PartId | null; onPart: (id: PartId) => void; reduced: boolean }) {
  const is = (id: PartId) => open.has(id);
  const warmth = open.size / PARTS.length;
  return (
    <div className="vcp-scene" style={{ '--warmth': warmth } as CSSProperties} data-reduced={reduced || undefined}>
      <svg className="vcp-svg" viewBox={`0 0 ${SCENE.w} ${SCENE.h}`} aria-hidden="true">
        <defs>
          <pattern id="vcp-damask" width="60" height="90" patternUnits="userSpaceOnUse">
            <rect width="60" height="90" fill="#c99a9c" />
            <path d="M30 14C34 24 38 30 38 40C38 48 34 52 30 58C26 52 22 48 22 40C22 30 26 24 30 14ZM29 58h2v18h-2z" fill="#a97a7e" />
            <path d="M0 80C3 76 3 74 0 70C-3 74 -3 76 0 80ZM60 80C63 76 63 74 60 70C57 74 57 76 60 80Z" fill="#a97a7e" />
          </pattern>
          <linearGradient id="vcp-floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#5a3324" />
            <stop offset="1" stopColor="#3f2218" />
          </linearGradient>
          <radialGradient id="vcp-fireglow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#ffb25a" stopOpacity="0.6" />
            <stop offset="1" stopColor="#ffb25a" stopOpacity="0" />
          </radialGradient>
          <clipPath id="vcp-glass">
            <rect x="420" y="140" width="200" height="290" />
          </clipPath>
        </defs>

        {/* the wall, the dado and the floor */}
        <rect width={SCENE.w} height="560" fill="url(#vcp-damask)" />
        <rect y="470" width={SCENE.w} height="90" fill="#4e6152" />
        <rect y="466" width={SCENE.w} height="8" fill="#6b4a32" />
        <rect y="556" width={SCENE.w} height="204" fill="url(#vcp-floor)" />
        {Array.from({ length: 13 }, (_, i) => (
          <path key={i} d={`M${i * 100 - 60} 760 L${i * 100 + 20} 556`} stroke="#2a1810" strokeOpacity="0.35" strokeWidth="2" />
        ))}
        <ellipse cx="640" cy="690" rx="420" ry="62" fill="#7a3b3b" />
        <ellipse cx="640" cy="690" rx="390" ry="50" fill="none" stroke="#c9a24a" strokeWidth="3" strokeDasharray="2 10" />

        {/* the window, and the village beyond */}
        <g className="vcp-window" data-open={is('window') || undefined}>
          <rect x="404" y="124" width="232" height="322" fill="#f4eee3" />
          <g clipPath="url(#vcp-glass)">
            <image href="/exhibitions/victorian/village.jpg" x="165" y="140" width="711" height="290" preserveAspectRatio="xMidYMid slice" />
            <rect x="420" y="140" width="200" height="290" className="vcp-night" fill="#1f2a3a" />
            <g className="vcp-snow">
              {Array.from({ length: 30 }, (_, i) => (
                <circle key={i} cx={420 + ((i * 47) % 200)} cy={140 + ((i * 71) % 290)} r={i % 3 ? 2 : 3} fill="#fff" opacity="0.9" />
              ))}
            </g>
          </g>
          <path d="M520 140 V430 M420 285 H620" stroke="#f4eee3" strokeWidth="8" />
          <rect x="420" y="140" width="200" height="290" fill="none" stroke="#6b4a32" strokeWidth="4" />
          <rect x="392" y="440" width="256" height="14" fill="#6b4a32" />
          {/* the curtains: closed over the glass, drawn back once opened */}
          <path className="vcp-curtain vcp-curtain-l" d="M380 110 H526 C510 230 524 340 512 452 H380Z" fill="#2f4a32" />
          <path className="vcp-curtain vcp-curtain-r" d="M660 110 H514 C530 230 516 340 528 452 H660Z" fill="#3f6446" />
          <rect x="370" y="100" width="300" height="16" rx="6" fill="#c9a24a" />
        </g>

        {/* the tree */}
        <g className="vcp-tree" data-open={is('tree') || undefined}>
          <path d="M180 600 L220 600 L214 640 L186 640Z" fill="#a4565c" />
          <rect x="174" y="594" width="52" height="10" rx="2" fill="#c98f92" />
          {[
            [150, 64, 260],
            [205, 92, 360],
            [270, 118, 460],
            [345, 140, 590],
          ].map(([top, half, base], i) => (
            <path key={i} d={`M200 ${top} L${200 - half} ${base} Q200 ${base - 14} ${200 + half} ${base}Z`} fill={i % 2 ? '#3f6446' : '#2f4a32'} />
          ))}
          <path d="M160 240 Q200 256 240 240 M130 340 Q200 362 270 340 M104 444 Q200 470 296 444 M80 560 Q200 590 320 560" stroke="#c9a24a" strokeWidth="2.4" fill="none" strokeDasharray="0.1 6" strokeLinecap="round" />
          {[
            [180, 250, '#a8343a'],
            [222, 300, '#c9a24a'],
            [160, 380, '#a8343a'],
            [246, 400, '#a8343a'],
            [196, 470, '#c9a24a'],
            [130, 520, '#a8343a'],
            [272, 530, '#c9a24a'],
          ].map(([x, y, c]) => (
            <circle key={`${x},${y}`} cx={x as number} cy={y as number} r="8" fill={c as string} />
          ))}
          {[
            [168, 214],
            [232, 214],
            [138, 316],
            [262, 316],
            [112, 420],
            [288, 420],
            [90, 540],
            [310, 540],
            [200, 330],
          ].map(([x, y]) => (
            <g key={`${x},${y}`}>
              <rect x={x - 3} y={y - 14} width="6" height="14" rx="1" fill="#f4eee3" />
              <g className="vcp-flame">
                <circle cx={x} cy={y - 20} r="12" fill="#ffd77a" opacity="0.3" />
                <path d={`M${x} ${y - 30} C${x + 4} ${y - 24} ${x + 4} ${y - 20} ${x} ${y - 16} C${x - 4} ${y - 20} ${x - 4} ${y - 24} ${x} ${y - 30}Z`} fill="#f2b84b" />
              </g>
            </g>
          ))}
          <polygon className="vcp-star" points="200,118 207,136 226,136 211,148 217,166 200,155 183,166 189,148 174,136 193,136" fill="#c9a24a" stroke="#9c7a2c" strokeWidth="1.5" />
        </g>

        {/* the fireplace, its mantel, the clock and the cards */}
        <g className="vcp-hearth" data-open={is('hearth') || undefined}>
          <ellipse className="vcp-glow" cx="925" cy="560" rx="320" ry="220" fill="url(#vcp-fireglow)" />
          <rect x="790" y="300" width="270" height="340" fill="#e6d0cb" />
          <rect x="770" y="290" width="310" height="22" rx="3" fill="#6b4a32" />
          <rect x="806" y="312" width="238" height="328" fill="#d9c2bc" />
          <path d="M845 640 V470 Q845 400 925 400 Q1005 400 1005 470 V640Z" fill="#1e1614" />
          <g className="vcp-fire">
            <path d="M872 628 C860 590 888 572 892 540 C904 568 916 570 920 524 C932 562 948 566 956 536 C964 574 990 590 978 628Z" fill="#e9883a" />
            <path d="M890 628 C886 604 904 594 906 574 C914 590 922 590 926 560 C934 588 946 594 950 628Z" fill="#c9a24a" />
            <path d="M908 628 C908 614 916 606 920 596 C926 606 932 614 930 628Z" fill="#fff1c4" />
          </g>
          <path d="M860 630 H990 M860 642 H990 M876 630 V650 M904 630 V650 M932 630 V650 M960 630 V650" stroke="#5e5650" strokeWidth="4" />
          <rect x="790" y="640" width="270" height="14" fill="#3f2218" />
          <path d="M770 290 Q800 312 830 290 Q860 312 890 290 Q920 312 950 290 Q980 312 1010 290 Q1040 312 1080 290" stroke="#2f4a32" strokeWidth="11" fill="none" strokeLinecap="round" />
        </g>
        <g className="vcp-clock" data-open={is('clock') || undefined}>
          <path d="M890 290 V226 Q890 196 925 196 Q960 196 960 226 V290Z" fill="#6b4a32" stroke="#3f2218" strokeWidth="2" />
          <circle cx="925" cy="236" r="24" fill="#f4eee3" stroke="#c9a24a" strokeWidth="3" />
          <line className="vcp-clock-min" x1="925" y1="236" x2="925" y2="218" stroke="#2a2522" strokeWidth="2.4" strokeLinecap="round" />
          <line x1="925" y1="236" x2="936" y2="242" stroke="#2a2522" strokeWidth="3" strokeLinecap="round" />
          <circle cx="925" cy="236" r="2.6" fill="#a4565c" />
          <g className="vcp-pendulum">
            <line x1="925" y1="262" x2="925" y2="278" stroke="#c9a24a" strokeWidth="2" />
            <circle cx="925" cy="281" r="5" fill="#c9a24a" />
          </g>
        </g>
        <g className="vcp-cards" data-open={is('cards') || undefined}>
          {[
            [786, '#f4eee3', -6],
            [812, '#ecd3d2', 4],
            [838, '#dfe4d6', -3],
            [1002, '#f4eee3', 5],
            [1030, '#ecd3d2', -4],
          ].map(([x, c, r], i) => (
            <g key={i} className="vcp-card" style={{ transitionDelay: `${i * 0.12}s` }} transform={`rotate(${r} ${(x as number) + 12} 290)`}>
              <rect x={x as number} y="252" width="26" height="36" fill={c as string} stroke="#6b4a32" strokeWidth="1.2" />
              <path d={`M${(x as number) + 6} 262 h14 v14 h-14Z`} fill={i % 2 ? '#a8343a' : '#2f4a32'} opacity="0.75" />
            </g>
          ))}
        </g>

        {/* the round table, and the book on it */}
        <g className="vcp-table">
          <ellipse cx="650" cy="580" rx="120" ry="26" fill="#6b4a32" />
          <path d="M530 580 Q534 610 560 618 L740 618 Q766 610 770 580" fill="#7a5a4a" />
          <path d="M640 618 V690 M620 690 H680" stroke="#3f2218" strokeWidth="10" strokeLinecap="round" />
        </g>
        <g className="vcp-book" data-open={is('book') || undefined}>
          <g className="vcp-book-shut">
            <path d="M600 572 L700 572 L716 556 L616 556Z" fill="#a8343a" stroke="#6e1f24" strokeWidth="1.5" />
            <path d="M600 572 L700 572 L700 580 L600 580Z" fill="#f4eee3" />
            <path d="M628 563 H686" stroke="#c9a24a" strokeWidth="2" />
          </g>
          <g className="vcp-book-open">
            <path d="M584 572 Q616 560 650 568 Q684 560 716 572 L716 548 Q684 536 650 544 Q616 536 584 548Z" fill="#f8f0dc" stroke="#a8343a" strokeWidth="3" />
            <path d="M650 544 V568" stroke="#c9b48a" strokeWidth="1.5" />
            <path d="M596 552 H640 M596 558 H636 M660 552 H704 M664 558 H704" stroke="#6b5a44" strokeWidth="1.2" opacity="0.7" />
          </g>
          <g className="vcp-book-candle">
            <rect x="740" y="540" width="8" height="24" fill="#f4eee3" />
            <path d="M744 526 C748 532 748 536 744 540 C740 536 740 532 744 526Z" fill="#f2b84b" />
          </g>
        </g>

        {/* the room's dark, lifting as each part is opened */}
        <rect className="vcp-dim" width={SCENE.w} height={SCENE.h} fill="#1b1012" />
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
