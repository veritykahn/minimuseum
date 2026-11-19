import { MATERIALS, SYMBOLS, type MaterialId, type ShapeId, type SymbolId } from './amulets';

/*
 * The amulet, drawn in SVG: a scarab beetle (seen from above, as the
 * scarab amulets are carved: the toothed head, the wide shield behind it,
 * the two wing cases, six jointed legs), a plain oval, or a plaque with a
 * rounded top, on its cord. Each material has its own surface: gold is a
 * polished metal (a many-stopped gradient, a bright streak of light and a
 * raised, lit edge), faience a glossy glaze, the stones a deep polish. The
 * symbols are cut into it as hieroglyphs (the scarab symbol drawn as a
 * small beetle, so it reads as one), each with a lit edge, so they look
 * carved; the owner's name, if given, runs beneath them.
 */

const FONT = "'Egypt Hieroglyphs', 'Noto Sans Egyptian Hieroglyphs', serif";

/** A gold surface: dark and light bands, as polished metal reflects a room. */
const GOLD_STOPS: [number, string][] = [
  [0, '#5c3d0c'],
  [0.16, '#b98a2c'],
  [0.32, '#f6dd85'],
  [0.42, '#fffbe2'],
  [0.5, '#f1c94f'],
  [0.66, '#a5721a'],
  [0.82, '#e9c260'],
  [0.92, '#fff0b0'],
  [1, '#7a5410'],
];

/**
 * A scarab beetle seen from above, head up, centred on 0,0 and about 420
 * units from the tips of its front legs to its tail. Its parts are filled
 * with `fill` and outlined with `line`.
 */
export function Beetle({ fill, line, legs = true, lineWidth = 5 }: { fill: string; line: string; legs?: boolean; lineWidth?: number }) {
  return (
    <g>
      {legs && (
        <g fill="none" stroke={line} strokeWidth={lineWidth * 2.2} strokeLinecap="round" strokeLinejoin="round">
          {[1, -1].map((side) => (
            <g key={side} transform={`scale(${side} 1)`}>
              {/* front legs, reaching forward, toothed for digging */}
              <path d="M-56 -112 L-112 -138 L-128 -196" />
              <path d="M-112 -138 l-12 -6 M-118 -158 l-12 -4 M-124 -178 l-12 -2" strokeWidth={lineWidth * 1.3} />
              {/* middle and back legs */}
              <path d="M-86 -14 L-142 6 L-160 76" />
              <path d="M-78 92 L-130 138 L-140 210" />
            </g>
          ))}
        </g>
      )}
      <g fill={fill} stroke={line} strokeWidth={lineWidth} strokeLinejoin="round">
        {/* the wing cases */}
        <path d="M-90 -32 C-110 30 -102 122 -62 170 C-38 196 -14 204 0 204 C14 204 38 196 62 170 C102 122 110 30 90 -32 Z" />
        {/* the shield behind the head */}
        <path d="M-48 -134 C-92 -128 -106 -98 -102 -62 C-100 -48 -96 -40 -90 -34 L90 -34 C96 -40 100 -48 102 -62 C106 -98 92 -128 48 -134 Z" />
        {/* the head, its front edge toothed */}
        <path d="M-46 -132 C-52 -150 -44 -168 -34 -176 L-26 -192 L-16 -182 L-6 -196 L6 -196 L16 -182 L26 -192 L34 -176 C44 -168 52 -150 46 -132 Z" />
      </g>
      <g fill="none" stroke={line} strokeWidth={lineWidth * 0.7} strokeLinecap="round" opacity="0.85">
        {/* the line between the wing cases, the small shield where they meet, and their ridges */}
        <path d="M0 -32 L0 202" />
        <path d="M-14 -32 L0 -12 L14 -32" />
        <path d="M-30 -18 C-40 60 -34 140 -16 190 M30 -18 C40 60 34 140 16 190" />
        <path d="M-62 -16 C-74 52 -68 122 -44 172 M62 -16 C74 52 68 122 44 172" />
        {/* the ridges of the head */}
        <path d="M-20 -140 L-14 -176 M20 -140 L14 -176 M0 -138 L0 -184" />
      </g>
      <g fill={line}>
        <ellipse cx="-44" cy="-144" rx="7" ry="9" />
        <ellipse cx="44" cy="-144" rx="7" ry="9" />
      </g>
    </g>
  );
}

/** Where the symbols are carved: their centre, and how large each is for a given count. */
function carving(shape: ShapeId, count: number, hasName: boolean) {
  const size = count <= 1 ? 120 : count === 2 ? 92 : 68;
  const cy = (shape === 'scarab' ? 318 : 262) - (hasName ? 26 : 0);
  return { size, cy };
}

export default function AmuletArt({
  shape,
  material,
  symbols,
  nameGlyphs,
  label,
  className,
  idPrefix = 'ega',
  place,
}: {
  shape: ShapeId;
  material: MaterialId;
  symbols: SymbolId[];
  nameGlyphs: string;
  /** The alt text; empty for a copy that something else already describes. */
  label: string;
  className?: string;
  /** Keeps the gradients' ids unique when the amulet is drawn more than once on a page. */
  idPrefix?: string;
  /** Where to draw it inside another SVG (a mummy's wrappings, a tomb), in that SVG's units. */
  place?: { x: number; y: number; width: number; height: number };
}) {
  const m = MATERIALS.find((x) => x.id === material)!;
  const id = `${idPrefix}-${shape}-${material}`;
  const gold = material === 'gold';
  const { size, cy } = carving(shape, symbols.length, !!nameGlyphs);
  const nameSize = nameGlyphs ? Math.max(18, Math.min(34, 240 / [...nameGlyphs].length)) : 0;
  const fill = `url(#${id}-face)`;
  const rim = gold ? '#6b4a10' : m.shade;
  const hole = shape === 'scarab' ? 40 : shape === 'oval' ? 92 : 88;

  return (
    <svg className={className} viewBox="0 0 400 480" {...place} role={label ? 'img' : undefined} aria-label={label || undefined} aria-hidden={label ? undefined : true}>
      <defs>
        {gold ? (
          <linearGradient id={`${id}-face`} x1="0" y1="0" x2="1" y2="1">
            {GOLD_STOPS.map(([o, c]) => (
              <stop key={o} offset={o} stopColor={c} />
            ))}
          </linearGradient>
        ) : (
          <radialGradient id={`${id}-face`} cx="38%" cy="26%" r="85%">
            <stop offset="0%" stopColor={m.light} />
            <stop offset="34%" stopColor={m.face} />
            <stop offset="100%" stopColor={m.shade} />
          </radialGradient>
        )}
        {/* The light across the surface: a soft streak, brighter and harder on gold. */}
        <linearGradient id={`${id}-shine`} x1="0" y1="0" x2="1" y2="0.6">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.38" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.46" stopColor="#fff" stopOpacity={gold ? 0.7 : 0.4} />
          <stop offset="0.54" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        {/* A raised, lit edge: light from the top left on the shape's own outline. */}
        <filter id={`${id}-bevel`} x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="5" result="blur" />
          <feSpecularLighting in="blur" surfaceScale={gold ? 6 : 4} specularConstant={gold ? 1.1 : 0.7} specularExponent={gold ? 22 : 16} lightingColor={gold ? '#fff6d0' : '#ffffff'} result="spec">
            <fePointLight x="80" y="-60" z="260" />
          </feSpecularLighting>
          <feComposite in="spec" in2="SourceAlpha" operator="in" result="lit" />
          <feComposite in="SourceGraphic" in2="lit" operator="arithmetic" k1="0" k2="1" k3={gold ? 0.9 : 0.6} k4="0" />
        </filter>
        <clipPath id={`${id}-clip`}>{outline(shape)}</clipPath>
      </defs>

      {/* The cord, and the ring it runs through */}
      <path d="M96 0 Q 200 70 304 0" fill="none" stroke="#7a5a30" strokeWidth="6" strokeLinecap="round" />
      <path d="M96 0 Q 200 70 304 0" fill="none" stroke="#b08a52" strokeWidth="2" strokeDasharray="3 5" />
      <circle cx="200" cy={hole} r="13" fill="none" stroke={gold ? `url(#${id}-face)` : rim} strokeWidth="7" />

      {/* The body of the amulet */}
      <g filter={`url(#${id}-bevel)`}>
        {shape === 'scarab' ? (
          <g transform="translate(200 254)">
            <Beetle fill={fill} line={rim} />
          </g>
        ) : (
          <g fill={fill} stroke={rim} strokeWidth="5">
            {outline(shape)}
          </g>
        )}
      </g>
      {shape !== 'scarab' && (
        <g fill="none" stroke={gold ? '#fff3c4' : m.light} strokeOpacity="0.55" strokeWidth="3" transform="translate(200 262) scale(0.93) translate(-200 -262)">
          {outline(shape)}
        </g>
      )}
      {/* The shine, kept to the amulet's shape */}
      <rect x="0" y="40" width="400" height="440" fill={`url(#${id}-shine)`} clipPath={`url(#${id}-clip)`} />

      {/* The carving: each sign twice, a lit edge below and the cut above, so it looks cut in */}
      {[
        { dx: 1.6, dy: 2.2, color: gold ? '#fff6cc' : m.light, opacity: 0.55 },
        { dx: 0, dy: 0, color: m.ink, opacity: 1 },
      ].map((layer, li) => (
        <g key={li} transform={`translate(${layer.dx} ${layer.dy})`} fill={layer.color} opacity={layer.opacity} fontFamily={FONT} textAnchor="middle" dominantBaseline="central">
          {symbols.map((s, i) => {
            const x = 200 + (i - (symbols.length - 1) / 2) * (size * 1.08);
            const glyph = SYMBOLS.find((x2) => x2.id === s)!.glyph;
            return s === 'scarab' ? (
              <g key={s} transform={`translate(${x} ${cy}) scale(${(size * 0.95) / 420})`}>
                <Beetle fill={layer.color} line={layer.color} lineWidth={10} />
              </g>
            ) : (
              <text key={s} x={x} y={cy} fontSize={size}>
                {glyph}
              </text>
            );
          })}
          {nameGlyphs && (
            <text x="200" y={cy + (symbols.length ? size * 0.72 + 22 : 0)} fontSize={nameSize}>
              {nameGlyphs}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}

/** The outline of the oval, the plaque, or the scarab's wing cases (for clipping the shine). */
function outline(shape: ShapeId) {
  if (shape === 'oval') return <ellipse cx="200" cy="262" rx="140" ry="186" />;
  if (shape === 'plaque') return <path d="M66 166 Q 66 66 200 66 Q 334 66 334 166 L 334 438 Q 334 456 316 456 L 84 456 Q 66 456 66 438 Z" />;
  return <ellipse cx="200" cy="300" rx="108" ry="170" />;
}
