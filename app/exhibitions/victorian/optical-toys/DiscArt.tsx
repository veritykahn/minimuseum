import type { ReactElement } from 'react';
import type { DiscId } from './toysText';

/*
 * The thaumatrope's discs, drawn in the posters' palette: each side is half
 * a picture (a bare tree and its candles; the empty line and its engine; a
 * cold grate and its fire), drawn on a transparent ground in a space from
 * -100 to 100, so the two halves can be laid one over the other.
 */

const GREEN = '#2f4a32';
const SAGE = '#4e6152';
const LEAF = '#3f6446';
const ROSE = '#c98f92';
const DEEP_ROSE = '#a4565c';
const GOLD = '#c9a24a';
const CREAM = '#f4eee3';
const WOOD = '#6b4a32';
const SOOT = '#2a2522';
const FLAME = '#e9883a';

export function DiscArt({ id, side }: { id: DiscId; side: 'front' | 'back' }) {
  const Art = ART[id][side];
  return <Art />;
}

function Candle({ x, y, h = 9 }: { x: number; y: number; h?: number }) {
  return (
    <g>
      <rect x={x - 1.8} y={y - h} width="3.6" height={h} rx="1" fill={CREAM} stroke="#b9a98d" strokeWidth="0.6" />
      <path d={`M${x} ${y - h - 8} C${x + 3} ${y - h - 4} ${x + 2.5} ${y - h - 1} ${x} ${y - h - 0.5} C${x - 2.5} ${y - h - 1} ${x - 3} ${y - h - 4} ${x} ${y - h - 8}Z`} fill={GOLD} />
      <circle cx={x} cy={y - h - 3.5} r="1.3" fill="#fff6d8" />
    </g>
  );
}

function Star({ x, y, r }: { x: number; y: number; r: number }) {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? r * 0.45 : r;
    return `${(x + Math.cos(a) * rr).toFixed(1)},${(y + Math.sin(a) * rr).toFixed(1)}`;
  }).join(' ');
  return <polygon points={pts} fill={GOLD} stroke="#9c7a2c" strokeWidth="0.8" />;
}

const ART: Record<DiscId, Record<'front' | 'back', () => ReactElement>> = {
  tree: {
    front: () => (
      <g>
        <ellipse cx="0" cy="80" rx="34" ry="4" fill={SOOT} opacity="0.15" />
        <rect x="-6" y="44" width="12" height="16" fill={WOOD} />
        <path d="M-22 56 L22 56 L17 80 L-17 80Z" fill={DEEP_ROSE} />
        <rect x="-24" y="54" width="48" height="6" rx="1.5" fill={ROSE} />
        {[
          [-66, 22, -30],
          [-44, 34, -4],
          [-18, 46, 24],
          [6, 58, 46],
        ].map(([top, half, base], i) => (
          <g key={i}>
            <path d={`M0 ${top} L${-half} ${base} Q0 ${base - 6} ${half} ${base}Z`} fill={i % 2 ? LEAF : GREEN} />
            <path d={`M0 ${top + 6} L${-half * 0.55} ${base - 4} M0 ${top + 6} L${half * 0.55} ${base - 4}`} stroke={SAGE} strokeWidth="1.2" opacity="0.8" />
          </g>
        ))}
      </g>
    ),
    back: () => (
      <g>
        <path d="M-18 -26 Q0 -18 18 -26 M-30 0 Q0 12 30 0 M-42 28 Q0 40 42 28" stroke={GOLD} strokeWidth="1.6" fill="none" strokeDasharray="0.1 3.2" strokeLinecap="round" />
        <Star x={0} y={-72} r={11} />
        {[
          [-20, -31],
          [20, -31],
          [-32, -5],
          [32, -5],
          [-44, 23],
          [44, 23],
          [-55, 45],
          [55, 45],
        ].map(([x, y]) => (
          <Candle key={`${x},${y}`} x={x} y={y} />
        ))}
        {[
          [-7, -44, '#a8343a'],
          [8, -16, GOLD],
          [-14, 6, '#a8343a'],
          [16, 12, '#a8343a'],
          [-26, 34, GOLD],
          [4, 34, '#a8343a'],
          [28, 38, GOLD],
          [-4, -20, '#a8343a'],
        ].map(([x, y, c]) => (
          <g key={`${x},${y}`}>
            <circle cx={x} cy={y} r="4.2" fill={c as string} />
            <circle cx={(x as number) - 1.4} cy={(y as number) - 1.4} r="1.2" fill="#fff" opacity="0.7" />
          </g>
        ))}
      </g>
    ),
  },
  railway: {
    front: () => (
      <g>
        <path d="M-96 18 Q-60 4 -30 14 Q10 26 40 10 Q70 -2 96 12 L96 40 L-96 40Z" fill={SAGE} opacity="0.35" />
        <rect x="-96" y="40" width="192" height="40" fill="#d8c9b0" opacity="0.6" />
        {Array.from({ length: 17 }, (_, i) => -88 + i * 11).map((x) => (
          <rect key={x} x={x} y="45" width="5" height="9" fill={WOOD} opacity="0.8" />
        ))}
        <path d="M-96 47 H96 M-96 52 H96" stroke="#4a4440" strokeWidth="2" />
        {[-58, 58].map((x) => (
          <g key={x} stroke={WOOD} strokeWidth="2.6" strokeLinecap="round">
            <path d={`M${x} 44 V-44`} />
            <path d={`M${x - 9} -38 H${x + 9} M${x - 7} -31 H${x + 7}`} strokeWidth="2" />
          </g>
        ))}
        <path d="M-96 -30 Q-77 -22 -58 -38 Q0 -24 58 -38 Q77 -22 96 -30 M-96 -24 Q-77 -16 -58 -31 Q0 -17 58 -31 Q77 -16 96 -24" stroke={SOOT} strokeWidth="0.9" fill="none" />
      </g>
    ),
    back: () => (
      <g>
        {/* steam, rolling back from the chimney */}
        <g fill={CREAM} stroke="#9a9184" strokeWidth="1">
          <circle cx="30" cy="-30" r="9" />
          <circle cx="14" cy="-42" r="12" />
          <circle cx="-8" cy="-50" r="14" />
          <circle cx="-34" cy="-54" r="12" />
        </g>
        <rect x="-50" y="-14" width="32" height="44" rx="2" fill={GREEN} />
        <path d="M-54 -16 H-14" stroke={SOOT} strokeWidth="4" strokeLinecap="round" />
        <rect x="-44" y="-8" width="12" height="12" rx="1.5" fill="#f2d68a" />
        <rect x="-18" y="2" width="62" height="26" rx="12" fill={LEAF} />
        <path d="M-6 2 V28 M14 2 V28" stroke={GOLD} strokeWidth="1.6" />
        <rect x="28" y="-20" width="9" height="24" fill={SOOT} />
        <path d="M24 -22 H41" stroke={SOOT} strokeWidth="4" strokeLinecap="round" />
        <path d="M2 2 Q2 -8 10 -8 Q18 -8 18 2Z" fill={GOLD} />
        <rect x="44" y="18" width="7" height="12" fill={DEEP_ROSE} />
        <rect x="-50" y="28" width="98" height="6" fill={SOOT} />
        {[
          [-34, 12],
          [-8, 12],
          [36, 8],
        ].map(([x, r]) => (
          <g key={x}>
            <circle cx={x} cy={46 - r} r={r} fill={DEEP_ROSE} stroke={SOOT} strokeWidth="2" />
            <path d={`M${x - r * 0.75} ${46 - r} H${x + r * 0.75} M${x} ${46 - r * 1.75} V${46 - r * 0.25}`} stroke={SOOT} strokeWidth="1.2" />
            <circle cx={x} cy={46 - r} r="2" fill={SOOT} />
          </g>
        ))}
        <path d="M-34 40 H-8" stroke="#8a8279" strokeWidth="2.4" strokeLinecap="round" />
      </g>
    ),
  },
  hearth: {
    front: () => (
      <g>
        <rect x="-70" y="-40" width="140" height="118" fill={ROSE} />
        {Array.from({ length: 9 }, (_, r) => (
          <path key={r} d={`M-70 ${-30 + r * 12} H70`} stroke="#b07a7d" strokeWidth="0.9" />
        ))}
        {Array.from({ length: 9 }, (_, r) =>
          Array.from({ length: 6 }, (_, c) => (
            <path key={`${r}-${c}`} d={`M${-70 + c * 28 + (r % 2) * 14} ${-40 + r * 12} v12`} stroke="#b07a7d" strokeWidth="0.9" />
          )),
        )}
        <rect x="-84" y="-52" width="168" height="12" rx="2" fill={WOOD} />
        <path d="M-40 78 V8 Q-40 -16 0 -16 Q40 -16 40 8 V78Z" fill={SOOT} />
        <path d="M-30 56 H30 M-30 64 H30 M-26 56 V70 M-13 56 V70 M0 56 V70 M13 56 V70 M26 56 V70" stroke="#5e5650" strokeWidth="2" />
        <path d="M-34 78 V48 M34 78 V48" stroke="#5e5650" strokeWidth="3.2" strokeLinecap="round" />
      </g>
    ),
    back: () => (
      <g>
        <ellipse cx="0" cy="44" rx="34" ry="30" fill={FLAME} opacity="0.25" />
        <path d="M-24 56 C-30 36 -18 26 -14 10 C-8 24 -2 26 0 -2 C6 20 14 22 18 6 C22 26 32 36 22 56Z" fill={FLAME} />
        <path d="M-14 56 C-16 42 -8 36 -6 26 C-2 34 2 34 4 18 C8 32 14 34 12 56Z" fill={GOLD} />
        <path d="M-6 56 C-6 48 -2 44 0 38 C2 44 6 48 4 56Z" fill="#fff1c4" />
        <path d="M-80 -52 Q-70 -40 -60 -52 Q-50 -40 -40 -52 Q-30 -40 -20 -52 Q-10 -40 0 -52 Q10 -40 20 -52 Q30 -40 40 -52 Q50 -40 60 -52 Q70 -40 80 -52" stroke={GREEN} strokeWidth="5" fill="none" strokeLinecap="round" />
        {[-70, -50, -30, -10, 10, 30, 50, 70].map((x) => (
          <circle key={x} cx={x} cy="-45" r="2.2" fill="#a8343a" />
        ))}
        <Candle x={-64} y={-54} h={16} />
        <Candle x={64} y={-54} h={16} />
      </g>
    ),
  },
};
