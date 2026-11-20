import { MATERIALS, SYMBOLS, type MaterialId, type ShapeId, type SymbolId } from './amulets';

/*
 * The amulet: a blank of the shape and material the visitor chose (the
 * owner's pictures, made with Leonardo.Ai and cut out of their white
 * backgrounds; not credited on the page, at the owner's request), a scarab,
 * a plain oval or a flat plaque, on its cord. All twelve blanks share one
 * scale, so they match each other as the pictures do. The symbols are cut
 * into it as hieroglyphs (the scarab symbol drawn as a small beetle, so it
 * reads as one), each with a lit edge, so they look carved; the owner's
 * name, if given, runs beneath them.
 */

const FONT = "'Egypt Hieroglyphs', 'Noto Sans Egyptian Hieroglyphs', serif";

/**
 * Each blank's picture, in public/exhibitions/egypt/amulets/{material}-{shape}.webp,
 * and its size in the cut-out's own pixels: the pictures were all made at
 * one size in the frame, so one scale (BLANK_SCALE) keeps them matched.
 */
const BLANK_PX: Record<MaterialId, Record<ShapeId, [number, number]>> = {
  gold: { scarab: [468, 680], oval: [491, 683], plaque: [427, 687] },
  faience: { scarab: [463, 675], oval: [490, 681], plaque: [426, 687] },
  red: { scarab: [464, 682], oval: [496, 685], plaque: [431, 698] },
  blue: { scarab: [462, 679], oval: [489, 679], plaque: [428, 687] },
};
/** The amulet's units to a pixel of the cut-outs: a blank comes out about 400 units tall. */
const BLANK_SCALE = 0.58;
/** The middle of the blank, in the amulet's units (it is 400 wide and 480 tall). */
const BLANK_CENTRE = { x: 200, y: 262 };

/** Where a blank is drawn, in the amulet's units. */
export function blankBox(shape: ShapeId, material: MaterialId) {
  const [w, h] = BLANK_PX[material][shape];
  const width = w * BLANK_SCALE;
  const height = h * BLANK_SCALE;
  return { src: `/exhibitions/egypt/amulets/${material}-${shape}.webp`, x: BLANK_CENTRE.x - width / 2, y: BLANK_CENTRE.y - height / 2, width, height };
}

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
  place,
}: {
  shape: ShapeId;
  material: MaterialId;
  symbols: SymbolId[];
  nameGlyphs: string;
  /** The alt text; empty for a copy that something else already describes. */
  label: string;
  className?: string;
  /** Kept for callers; the amulet no longer needs unique ids on the page. */
  idPrefix?: string;
  /** Where to draw it inside another SVG (a mummy's wrappings, a tomb), in that SVG's units. */
  place?: { x: number; y: number; width: number; height: number };
}) {
  const m = MATERIALS.find((x) => x.id === material)!;
  const gold = material === 'gold';
  const { size, cy } = carving(shape, symbols.length, !!nameGlyphs);
  const nameSize = nameGlyphs ? Math.max(18, Math.min(34, 240 / [...nameGlyphs].length)) : 0;
  const blank = blankBox(shape, material);
  const rim = gold ? '#a8771f' : m.shade;

  return (
    <svg className={className} viewBox="0 0 400 480" {...place} role={label ? 'img' : undefined} aria-label={label || undefined} aria-hidden={label ? undefined : true}>
      {/* The cord, and the ring it runs through, at the top of the blank */}
      <path d="M96 0 Q 200 70 304 0" fill="none" stroke="#7a5a30" strokeWidth="6" strokeLinecap="round" />
      <path d="M96 0 Q 200 70 304 0" fill="none" stroke="#b08a52" strokeWidth="2" strokeDasharray="3 5" />
      <circle cx="200" cy={blank.y - 4} r="13" fill="none" stroke={rim} strokeWidth="7" />

      {/* The blank itself */}
      <image href={blank.src} x={blank.x} y={blank.y} width={blank.width} height={blank.height} />

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
