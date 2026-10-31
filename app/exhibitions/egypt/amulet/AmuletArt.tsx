import { MATERIALS, SYMBOLS, type MaterialId, type ShapeId, type SymbolId } from './amulets';

/*
 * The amulet, drawn in SVG: a scarab (its back drawn as a beetle's, its
 * symbols set in the oval of its body), a plain oval, or a plaque with a
 * rounded top, in the chosen material, lit from above, with a hole for its
 * cord. The symbols are cut into it as hieroglyphs, and the owner's name,
 * if given, runs beneath them.
 */

const FONT = "'Egypt Hieroglyphs', 'Noto Sans Egyptian Hieroglyphs', serif";

export default function AmuletArt({
  shape,
  material,
  symbols,
  nameGlyphs,
  label,
  className,
  idPrefix = 'ega',
}: {
  shape: ShapeId;
  material: MaterialId;
  symbols: SymbolId[];
  nameGlyphs: string;
  label: string;
  className?: string;
  /** Keeps the gradient's id unique when the amulet is drawn twice (on screen and on the printed sheet). */
  idPrefix?: string;
}) {
  const m = MATERIALS.find((x) => x.id === material)!;
  const id = `${idPrefix}-${shape}-${material}`;
  const glyphs = symbols.map((s) => SYMBOLS.find((x) => x.id === s)!.glyph);
  const size = glyphs.length <= 1 ? 150 : glyphs.length === 2 ? 104 : 70;
  const cx = 200;
  const cy = shape === 'scarab' ? 270 : 260;
  const nameSize = nameGlyphs ? Math.max(18, Math.min(34, 260 / [...nameGlyphs].length)) : 0;

  return (
    <svg className={className} viewBox="0 0 400 480" role="img" aria-label={label}>
      <defs>
        <radialGradient id={`${id}-face`} cx="40%" cy="28%" r="80%">
          <stop offset="0%" stopColor={m.light} />
          <stop offset="30%" stopColor={m.face} />
          <stop offset="100%" stopColor={m.shade} />
        </radialGradient>
      </defs>

      {/* The cord */}
      <path d="M120 0 Q 200 70 280 0" fill="none" stroke="#8a6a3a" strokeWidth="5" />

      {shape === 'scarab' && (
        <g stroke={m.shade} strokeWidth="6" strokeLinecap="round">
          <line x1="96" y1="200" x2="54" y2="170" />
          <line x1="90" y1="280" x2="44" y2="282" />
          <line x1="96" y1="360" x2="56" y2="396" />
          <line x1="304" y1="200" x2="346" y2="170" />
          <line x1="310" y1="280" x2="356" y2="282" />
          <line x1="304" y1="360" x2="344" y2="396" />
        </g>
      )}

      <g fill={`url(#${id}-face)`} stroke={m.shade} strokeWidth="4">
        {shape === 'scarab' && (
          <>
            <ellipse cx="200" cy="96" rx="58" ry="34" />
            <ellipse cx="200" cy="270" rx="118" ry="160" />
          </>
        )}
        {shape === 'oval' && <ellipse cx="200" cy="260" rx="140" ry="190" />}
        {shape === 'plaque' && <path d="M66 160 Q 66 60 200 60 Q 334 60 334 160 L 334 440 Q 334 456 318 456 L 82 456 Q 66 456 66 440 Z" />}
      </g>
      {shape === 'scarab' && <path d="M200 130 L200 150 M150 140 Q200 162 250 140" fill="none" stroke={m.shade} strokeWidth="4" />}

      {/* The hole for the cord */}
      <circle cx="200" cy={shape === 'scarab' ? 76 : shape === 'oval' ? 96 : 92} r="10" fill="#141414" stroke={m.shade} strokeWidth="3" />

      <g fill={m.ink} fontFamily={FONT} fontSize={size} textAnchor="middle" dominantBaseline="central">
        {glyphs.map((g, i) => {
          const offset = (i - (glyphs.length - 1) / 2) * (size * 1.05);
          return (
            <text key={i} x={cx + offset} y={cy - (nameGlyphs ? 22 : 0)}>
              {g}
            </text>
          );
        })}
        {nameGlyphs && (
          <text x={cx} y={cy + (glyphs.length ? size * 0.75 : 0)} fontSize={nameSize}>
            {nameGlyphs}
          </text>
        )}
      </g>
    </svg>
  );
}
