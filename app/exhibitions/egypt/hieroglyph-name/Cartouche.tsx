import type { Spelled } from './alphabet';

/*
 * A cartouche drawn in SVG: a doubled rope around the signs, and at the end
 * of the name the straight line that ties it. Across, it reads left to right
 * and is tied on the right; down, it reads top to bottom and is tied at the
 * foot. The signs are text in the hieroglyph face, so the cartouche prints
 * as sharply as it shows.
 */

const CELL = 100;
const PAD = 46;
const THICK = 168;
const TIE = 26;

export default function Cartouche({
  spelled,
  direction,
  label,
  ink = 'currentColor',
  className,
}: {
  spelled: Spelled[];
  direction: 'across' | 'down';
  label: string;
  ink?: string;
  className?: string;
}) {
  const signs = spelled.flatMap((s) => [...s.glyphs]);
  const n = Math.max(signs.length, 3);
  const length = n * CELL + PAD * 2;
  const across = direction === 'across';
  const w = across ? length + TIE : THICK;
  const h = across ? THICK : length + TIE;
  const offset = ((n - signs.length) * CELL) / 2;
  const r = THICK / 2;
  const ropeW = across ? length : THICK;
  const ropeH = across ? THICK : length;

  return (
    <svg className={className} viewBox={`-8 -8 ${w + 16} ${h + 16}`} role="img" aria-label={label} preserveAspectRatio="xMidYMid meet">
      <g fill="none" stroke={ink}>
        <rect x={0} y={0} width={ropeW} height={ropeH} rx={r} strokeWidth={7} />
        <rect x={12} y={12} width={ropeW - 24} height={ropeH - 24} rx={r - 12} strokeWidth={3} />
        {across ? (
          <>
            <line x1={length + 10} y1={10} x2={length + 10} y2={THICK - 10} strokeWidth={9} />
            <line x1={length - 4} y1={THICK / 2 - 22} x2={length + 22} y2={THICK / 2 - 22} strokeWidth={4} />
            <line x1={length - 4} y1={THICK / 2 + 22} x2={length + 22} y2={THICK / 2 + 22} strokeWidth={4} />
          </>
        ) : (
          <>
            <line x1={10} y1={length + 10} x2={THICK - 10} y2={length + 10} strokeWidth={9} />
            <line x1={THICK / 2 - 22} y1={length - 4} x2={THICK / 2 - 22} y2={length + 22} strokeWidth={4} />
            <line x1={THICK / 2 + 22} y1={length - 4} x2={THICK / 2 + 22} y2={length + 22} strokeWidth={4} />
          </>
        )}
      </g>
      <g fill={ink} fontFamily="'Egypt Hieroglyphs', 'Noto Sans Egyptian Hieroglyphs', serif" fontSize={80} textAnchor="middle" dominantBaseline="central" aria-hidden="true">
        {signs.map((s, i) => {
          const along = PAD + offset + CELL * i + CELL / 2;
          return (
            <text key={i} x={across ? along : THICK / 2} y={across ? THICK / 2 : along}>
              {s}
            </text>
          );
        })}
      </g>
    </svg>
  );
}
