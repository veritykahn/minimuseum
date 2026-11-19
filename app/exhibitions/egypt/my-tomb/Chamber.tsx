import type { CSSProperties, ReactNode } from 'react';
import AmuletArt from '../amulet/AmuletArt';
import { describeAmulet, type SavedAmulet } from '../amulet/savedAmulet';
import Cartouche from '../hieroglyph-name/Cartouche';
import { GLYPHS } from '../rooms';
import { PTOLEMY } from '../rosetta-stone/rosetta';
import type { ActivityId } from '../tombState';
import type { Wall } from '../tomb/scenes';
import { Heart } from '../weighing-of-the-heart/HallArt';
import type { SavedCartouche } from './savedCartouche';
import { GOODS, type GoodId } from './myTomb';

/*
 * The visitor's own burial chamber, fully lit: no torch, nothing hidden.
 * Drawn in SVG in a gentle perspective: a painted ceiling of stars, the
 * plastered back and side walls, a stone floor and two lamps burning. It
 * has six places, one for each of the other Egypt rooms to fill (PLACES,
 * and tombState.ts's TOMB_PLACES):
 *
 *   the painted wall     the framed painting on the back wall: one of The
 *                        Met's facsimiles, the wall the visitor lit in the
 *                        Tomb Explorer
 *   the stone column     their name in a cartouche (Your Name in Hieroglyphs)
 *   the scroll stand     a papyrus with the royal name they decoded (the
 *                        Rosetta Stone Decoder)
 *   the niche            their amulet (Design an Amulet)
 *   the coffin           in the middle of the floor: open and empty, until
 *                        Mummification lays their mummy in it and closes
 *                        its painted lid
 *   the offering table   a heart amulet (the Weighing of the Heart)
 *
 * An empty place is drawn empty (a blank frame, a bare column, an open
 * coffin...), and the page lays a door over it to the room that fills it.
 * The things the visitor furnishes the tomb with stand on the floor where
 * they put them, a little smaller toward the back.
 *
 * The cartouche is the hieroglyph room's own Cartouche, set over the wall's
 * column; the overlays the page adds (the things to move, the doors) go
 * over the chamber as its children, placed by `box()`. The coffin is drawn
 * here, not borrowed from the mummification room, so that room can be
 * redrawn freely.
 */

export const CH_W = 1200;
export const CH_H = 700;
const BACK = { left: 170, right: 1030, top: 50, floor: 430 };
const INK = '#2b1d12';

export const PAINTING_BOX: Box = [330, 92, 540, 288];
export const NICHE_BOX: Box = [196, 160, 112, 180];
export const CARTOUCHE_BOX: Box = [902, 70, 100, 350];
export const COFFIN_BOX: Box = [420, 530, 360, 130];
export const TABLE_BOX: Box = [830, 452, 130, 120];
export const SCROLL_BOX: Box = [236, 446, 150, 126];

/** Each room's place in the chamber, as a box for its door. */
export const PLACES: Record<ActivityId, Box> = {
  walls: PAINTING_BOX,
  name: CARTOUCHE_BOX,
  rosetta: SCROLL_BOX,
  amulet: NICHE_BOX,
  mummification: COFFIN_BOX,
  weighing: TABLE_BOX,
};

/** What fills each place: whatever is missing is drawn empty. */
export type Filled = {
  wall: Wall | null;
  cartouche: SavedCartouche | null;
  amulet: SavedAmulet | null;
  mummy: boolean;
  heart: boolean;
  papyrus: boolean;
};
export const NOTHING: Filled = { wall: null, cartouche: null, amulet: null, mummy: false, heart: false, papyrus: false };
/** Where things may stand: the floor's own bounds (in the chamber's units). */
export const FLOOR = { top: 470, bottom: 680 };

export type Box = [number, number, number, number];
export type Placed = { id: GoodId; x: number; y: number };

/** A box in the chamber's units, as a percentage box for an overlay. */
export function box([x, y, w, h]: Box): CSSProperties {
  return { left: `${(x / CH_W) * 100}%`, top: `${(y / CH_H) * 100}%`, width: `${(w / CH_W) * 100}%`, height: `${(h / CH_H) * 100}%` };
}

/** How large a thing stands at a depth on the floor: smaller toward the back wall. */
export function depthScale(y: number) {
  return 0.72 + (0.5 * (y - FLOOR.top)) / (FLOOR.bottom - FLOOR.top);
}

/** Keep a point on the floor, inside the side walls at its depth. */
export function onFloor(x: number, y: number) {
  const cy = Math.max(FLOOR.top, Math.min(FLOOR.bottom, y));
  const spread = ((cy - BACK.floor) * BACK.left) / (CH_H - BACK.floor);
  const margin = 50;
  return { x: Math.round(Math.max(BACK.left - spread + margin, Math.min(BACK.right + spread - margin, x))), y: Math.round(cy) };
}

/** Free places on the floor, clear of the six places, in the order a tapped thing takes them. */
export const FLOOR_SLOTS = [
  { x: 470, y: 486 },
  { x: 730, y: 486 },
  { x: 200, y: 640 },
  { x: 1000, y: 640 },
  { x: 600, y: 478 },
  { x: 330, y: 676 },
  { x: 870, y: 676 },
  { x: 1010, y: 520 },
  { x: 190, y: 520 },
];

export default function Chamber({
  filled,
  goods,
  selected,
  sealed = false,
  label,
  idPrefix = 'egb',
  children,
}: {
  filled: Filled;
  goods: Placed[];
  selected?: GoodId | null;
  /** The finale: the doorway walled up and sealed. */
  sealed?: boolean;
  label: string;
  idPrefix?: string;
  children?: ReactNode;
}) {
  const { wall, amulet, cartouche } = filled;
  // The back of the floor first, so nearer things stand in front.
  const sorted = [...goods].sort((a, b) => a.y - b.y);
  const front = sorted.filter((g) => g.y >= 600);
  const back = sorted.filter((g) => g.y < 600);
  const thing = (g: Placed) => (
    <g key={g.id} className={`egb-good${selected === g.id ? ' is-selected' : ''}`} transform={`translate(${g.x} ${g.y}) scale(${depthScale(g.y)})`}>
      <ellipse cx="0" cy="2" rx="52" ry="9" fill="#000" opacity="0.22" />
      <GoodArt id={g.id} />
    </g>
  );

  return (
    <div className="egb-chamber">
      <svg className="egb-svg" viewBox={`0 0 ${CH_W} ${CH_H}`} role="img" aria-label={label}>
        <defs>
          <linearGradient id={`${idPrefix}-wall`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#efdcae" />
            <stop offset="1" stopColor="#e2c58a" />
          </linearGradient>
          <linearGradient id={`${idPrefix}-side`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#bf9d62" />
            <stop offset="1" stopColor="#dcc08a" />
          </linearGradient>
          <linearGradient id={`${idPrefix}-floor`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#b48a55" />
            <stop offset="1" stopColor="#8e6838" />
          </linearGradient>
          <radialGradient id={`${idPrefix}-light`} cx="50%" cy="55%" r="60%">
            <stop offset="0" stopColor="#fff3cf" stopOpacity="0.35" />
            <stop offset="1" stopColor="#fff3cf" stopOpacity="0" />
          </radialGradient>
          <clipPath id={`${idPrefix}-painting`}>
            <rect x={PAINTING_BOX[0]} y={PAINTING_BOX[1]} width={PAINTING_BOX[2]} height={PAINTING_BOX[3]} />
          </clipPath>
        </defs>

        {/* Ceiling, painted blue with yellow stars */}
        <path d={`M0 0 H${CH_W} L${BACK.right} ${BACK.top} H${BACK.left} Z`} fill="#22346b" />
        {Array.from({ length: 34 }, (_, i) => {
          const x = 30 + ((i * 97) % 1140);
          const y = 8 + ((i * 13) % 34);
          return <path key={i} d={`M${x} ${y - 6} L${x + 2} ${y - 1} L${x + 7} ${y} L${x + 2} ${y + 1} L${x} ${y + 6} L${x - 2} ${y + 1} L${x - 7} ${y} L${x - 2} ${y - 1} Z`} fill="#f2c94c" />;
        })}

        {/* Side walls and the back wall, plastered */}
        <path d={`M0 0 L${BACK.left} ${BACK.top} V${BACK.floor} L0 ${CH_H} Z`} fill={`url(#${idPrefix}-side)`} />
        <path d={`M0 0 L${BACK.left} ${BACK.top} V${BACK.floor} L0 ${CH_H} Z`} fill={`url(#${idPrefix}-side)`} transform={`translate(${CH_W} 0) scale(-1 1)`} />
        <rect x={BACK.left} y={BACK.top} width={BACK.right - BACK.left} height={BACK.floor - BACK.top} fill={`url(#${idPrefix}-wall)`} />
        {/* a painted dado along the foot of the walls */}
        <rect x={BACK.left} y={BACK.floor - 22} width={BACK.right - BACK.left} height="22" fill="#7a2a18" />
        <rect x={BACK.left} y={BACK.floor - 28} width={BACK.right - BACK.left} height="6" fill="#2f5f9e" />
        <rect x={BACK.left} y={BACK.top} width={BACK.right - BACK.left} height="12" fill="#2f5f9e" />
        <rect x={BACK.left} y={BACK.top + 12} width={BACK.right - BACK.left} height="5" fill="#b23a2a" />

        {/* The painting, in its frame */}
        <rect x={PAINTING_BOX[0] - 12} y={PAINTING_BOX[1] - 12} width={PAINTING_BOX[2] + 24} height={PAINTING_BOX[3] + 24} fill="#d9a441" stroke={INK} strokeWidth="2" />
        <rect x={PAINTING_BOX[0] - 5} y={PAINTING_BOX[1] - 5} width={PAINTING_BOX[2] + 10} height={PAINTING_BOX[3] + 10} fill="#b23a2a" />
        {wall ? (
          <image className="egb-painting" key={wall.id} href={wall.src} x={PAINTING_BOX[0]} y={PAINTING_BOX[1]} width={PAINTING_BOX[2]} height={PAINTING_BOX[3]} preserveAspectRatio="xMidYMid slice" clipPath={`url(#${idPrefix}-painting)`} />
        ) : (
          <g>
            <rect x={PAINTING_BOX[0]} y={PAINTING_BOX[1]} width={PAINTING_BOX[2]} height={PAINTING_BOX[3]} fill="#f3e6c4" />
            <rect x={PAINTING_BOX[0] + 20} y={PAINTING_BOX[1] + 20} width={PAINTING_BOX[2] - 40} height={PAINTING_BOX[3] - 40} fill="none" stroke="#b9975a" strokeWidth="3" strokeDasharray="12 10" />
          </g>
        )}

        {/* The niche for the amulet */}
        <path d={`M${NICHE_BOX[0]} ${NICHE_BOX[1] + NICHE_BOX[3]} V${NICHE_BOX[1] + 46} Q${NICHE_BOX[0] + NICHE_BOX[2] / 2} ${NICHE_BOX[1] - 12} ${NICHE_BOX[0] + NICHE_BOX[2]} ${NICHE_BOX[1] + 46} V${NICHE_BOX[1] + NICHE_BOX[3]} Z`} fill="#5a3f22" stroke={INK} strokeWidth="2.5" />
        <rect x={NICHE_BOX[0] - 8} y={NICHE_BOX[1] + NICHE_BOX[3]} width={NICHE_BOX[2] + 16} height="10" fill="#c9a86a" stroke={INK} strokeWidth="2" />
        {amulet && (
          <AmuletArt
            shape={amulet.shape}
            material={amulet.material}
            symbols={amulet.symbols}
            nameGlyphs={amulet.nameGlyphs}
            label=""
            idPrefix={`${idPrefix}-amulet`}
            place={{ x: NICHE_BOX[0] + 8, y: NICHE_BOX[1] + 24, width: NICHE_BOX[2] - 16, height: NICHE_BOX[3] - 28 }}
          />
        )}

        {/* The stone column for the cartouche */}
        <rect x={CARTOUCHE_BOX[0]} y={CARTOUCHE_BOX[1]} width={CARTOUCHE_BOX[2]} height={CARTOUCHE_BOX[3]} rx="6" fill="#f3e6c4" stroke="#b9975a" strokeWidth="2" />

        {/* Lamps in the two front corners */}
        {[90, 1110].map((x) => (
          <g key={x} transform={`translate(${x} 690)`}>
            <path d="M-8 0 L-4 -150 L4 -150 L8 0 Z" fill="#6b4a22" stroke={INK} strokeWidth="2" />
            <path d="M-26 -150 Q0 -128 26 -150 Z" fill="#d9a441" stroke={INK} strokeWidth="2" />
            <path className="egb-flame" d="M0 -196 C10 -180 14 -164 0 -152 C-14 -164 -10 -180 0 -196 Z" fill="#ffb238" />
            <path className="egb-flame" d="M0 -184 C5 -174 7 -164 0 -156 C-7 -164 -5 -174 0 -184 Z" fill="#fff1a8" />
          </g>
        ))}

        {/* The floor, laid with stone */}
        <path d={`M${BACK.left} ${BACK.floor} H${BACK.right} L${CH_W} ${CH_H} H0 Z`} fill={`url(#${idPrefix}-floor)`} />
        {[0.18, 0.4, 0.66].map((t) => {
          const y = BACK.floor + t * (CH_H - BACK.floor);
          const spread = t * BACK.left;
          return <line key={t} x1={BACK.left - spread} x2={BACK.right + spread} y1={y} y2={y} stroke="#6e4c25" strokeWidth="2" opacity="0.6" />;
        })}
        {[-3, -2, -1, 0, 1, 2, 3].map((k) => (
          <line key={k} x1={600 + k * 130} y1={BACK.floor} x2={600 + k * 220} y2={CH_H} stroke="#6e4c25" strokeWidth="2" opacity="0.5" />
        ))}

        {back.map(thing)}

        {/* The scroll stand, the offering table and the coffin, on the floor */}
        <ScrollStand papyrus={filled.papyrus} />
        <OfferingTable heart={filled.heart} />
        <Coffin mummy={filled.mummy} id={idPrefix} />

        {front.map(thing)}

        {/* The light of the lamps */}
        <rect x="0" y="0" width={CH_W} height={CH_H} fill={`url(#${idPrefix}-light)`} pointerEvents="none" />

        {sealed && <SealedDoor id={idPrefix} cartouche={cartouche} />}
      </svg>

      {cartouche && !sealed && (
        <div className="egb-cartouche" style={box(CARTOUCHE_BOX)}>
          <Cartouche spelled={cartouche.spelled} direction="down" label={`Your name in a cartouche${cartouche.name ? `: ${cartouche.name}` : ''}`} ink={INK} />
        </div>
      )}
      {children}
    </div>
  );
}

/** What the chamber holds, said in words for its alt text. */
export function describeChamber(filled: Filled, goods: Placed[], sealed = false) {
  if (sealed) return 'The doorway of the tomb, walled up with stone and plastered, and stamped with a seal. Everything is safe inside.';
  const { wall, amulet, cartouche } = filled;
  const things = goods.map((g) => GOODS.find((x) => x.id === g.id)!.name.toLowerCase());
  return [
    'A burial chamber, lit by two lamps.',
    filled.mummy ? 'In the middle of the floor, a painted coffin, closed, with the mummy inside.' : 'In the middle of the floor, an open coffin, empty.',
    wall ? `On the back wall: ${wall.title}.` : 'The frame on the back wall is empty.',
    cartouche ? `On the stone column, a cartouche${cartouche.name ? ` with the name ${cartouche.name}` : ''}.` : 'The stone column is bare.',
    amulet ? `In the niche: ${describeAmulet(amulet)}.` : 'The niche is empty.',
    filled.papyrus ? 'On the scroll stand, a papyrus with a royal name in a cartouche.' : 'The scroll stand is empty.',
    filled.heart ? 'On the offering table, a heart amulet.' : 'The offering table is empty.',
    things.length ? `On the floor: ${things.join(', ')}.` : '',
  ]
    .filter(Boolean)
    .join(' ');
}

/**
 * The coffin, lying head to the left on two low trestles: open and empty
 * (its dark inside showing) until the mummy is laid in it, then closed
 * with its painted lid: a gold face framed by a striped blue wig, a broad
 * collar, and the body painted with bands of gold.
 */
function Coffin({ mummy, id }: { mummy: boolean; id: string }) {
  const outline = 'M-172 0 C-172 -30 -158 -46 -128 -50 C-110 -53 -98 -56 -86 -56 C-20 -54 80 -40 140 -32 C160 -30 172 -22 172 0 C172 22 160 30 140 32 C80 40 -20 54 -86 56 C-98 56 -110 53 -128 50 C-158 46 -172 30 -172 0 Z';
  return (
    <g transform="translate(600 586)">
      <ellipse cx="0" cy="58" rx="186" ry="18" fill="#000" opacity="0.25" />
      {/* the trestles */}
      {[-110, 110].map((x) => (
        <path key={x} d={`M${x - 26} 66 L${x - 18} 40 H${x + 18} L${x + 26} 66`} fill="none" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      ))}
      {/* the coffin's side, seen below the lid */}
      <path d={outline} transform="translate(0 16)" fill="#5a3a1c" stroke={INK} strokeWidth="2.5" />
      {mummy ? (
        <g className="egb-lid">
          <defs>
            <linearGradient id={`${id}-coffin-gold`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fff0b0" />
              <stop offset="0.45" stopColor="#e0b13a" />
              <stop offset="1" stopColor="#9a6a14" />
            </linearGradient>
          </defs>
          <path d={outline} fill="#22408a" stroke={INK} strokeWidth="3" />
          {/* bands of gold across the body, and one along it */}
          {[-30, 10, 50, 90, 128].map((x) => (
            <path key={x} d={`M${x} -46 Q${x + 4} 0 ${x} 46`} fill="none" stroke={`url(#${id}-coffin-gold)`} strokeWidth="7" />
          ))}
          <path d="M-60 0 H166" stroke={`url(#${id}-coffin-gold)`} strokeWidth="12" />
          <path d="M-60 0 H166" stroke="#b23a2a" strokeWidth="3" />
          {/* the broad collar: rings of red, gold and blue */}
          {[
            ['#b23a2a', 64],
            ['#e0b13a', 56],
            ['#2f9e8e', 48],
            ['#e0b13a', 40],
          ].map(([c, r]) => (
            <path key={r} d={`M-84 ${-r} A${r} ${r} 0 0 1 -84 ${r}`} fill="none" stroke={c as string} strokeWidth="7" />
          ))}
          {/* the striped wig and the gold face */}
          <ellipse cx="-128" cy="0" rx="44" ry="50" fill="#1d2f66" stroke={INK} strokeWidth="2.5" />
          {[-38, -26, -14, 14, 26, 38].map((y) => (
            <path key={y} d={`M-158 ${y} L-96 ${y * 0.9}`} stroke="#e0b13a" strokeWidth="3" />
          ))}
          <ellipse cx="-136" cy="0" rx="24" ry="28" fill={`url(#${id}-coffin-gold)`} stroke={INK} strokeWidth="2.5" />
          <path d="M-146 -10 h7 M-146 10 h7" stroke={INK} strokeWidth="3" strokeLinecap="round" />
          <path d="M-128 -4 v8" stroke={INK} strokeWidth="2" />
          <path d="M-118 -6 Q-114 0 -118 6" fill="none" stroke="#8a2a1a" strokeWidth="2.5" />
        </g>
      ) : (
        <g>
          {/* open: the coffin's rim, and the dark inside */}
          <path d={outline} fill="#7a5128" stroke={INK} strokeWidth="3" />
          <path d={outline} transform="scale(0.9 0.8)" fill="#140d07" stroke={INK} strokeWidth="2" />
        </g>
      )}
    </g>
  );
}

/** The offering table: a low stand of wood, its top bare, or holding the heart amulet the weighing put there. */
function OfferingTable({ heart }: { heart: boolean }) {
  const [x, y, w, h] = TABLE_BOX;
  const top = y + h - 40;
  return (
    <g>
      <ellipse cx={x + w / 2} cy={y + h + 2} rx={w / 2} ry="8" fill="#000" opacity="0.22" />
      <path d={`M${x + 20} ${y + h} L${x + 26} ${top + 8} M${x + w - 20} ${y + h} L${x + w - 26} ${top + 8} M${x + w / 2} ${y + h} V${top + 10}`} stroke={INK} strokeWidth="6" strokeLinecap="round" />
      <path d={`M${x + 4} ${top} H${x + w - 4} L${x + w - 12} ${top + 12} H${x + 12} Z`} fill="#a8743e" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d={`M${x + 16} ${top + 6} H${x + w - 16}`} stroke="#d9a441" strokeWidth="2" />
      {heart && (
        <g className="egb-heart" transform={`translate(${x + w / 2} ${top - 34}) scale(2.3)`}>
          <Heart />
        </g>
      )}
    </g>
  );
}

/**
 * The scroll stand: a low chest with a sloping top, bare until the Rosetta
 * room's papyrus lies open on it, the royal name the visitor cracked ringed
 * in its cartouche.
 */
function ScrollStand({ papyrus }: { papyrus: boolean }) {
  const [x, y, w, h] = SCROLL_BOX;
  const lean = y + 50;
  return (
    <g>
      <ellipse cx={x + w / 2} cy={y + h + 2} rx={w / 2 + 6} ry="8" fill="#000" opacity="0.22" />
      <path d={`M${x + 10} ${y + h} V${lean + 24} L${x + w - 10} ${lean} V${y + h} Z`} fill="#8a5a2c" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d={`M${x + 10} ${lean + 24} L${x + w - 10} ${lean}`} stroke="#d9a441" strokeWidth="3" />
      {papyrus && (
        <g className="egb-papyrus" transform={`translate(${x + w / 2} ${lean - 8}) rotate(-9)`}>
          <rect x="-70" y="-40" width="140" height="60" fill="#efdcae" stroke={INK} strokeWidth="2" />
          <ellipse cx="-70" cy="-10" rx="8" ry="31" fill="#d9bf86" stroke={INK} strokeWidth="2" />
          <ellipse cx="70" cy="-10" rx="8" ry="31" fill="#d9bf86" stroke={INK} strokeWidth="2" />
          <rect x="-56" y="-30" width="112" height="40" rx="20" fill="none" stroke={INK} strokeWidth="2.5" />
          <text x="0" y="-10" fill={INK} fontFamily="'Egypt Hieroglyphs', 'Noto Sans Egyptian Hieroglyphs', serif" fontSize="22" textAnchor="middle" dominantBaseline="central">
            {PTOLEMY.map((p) => GLYPHS[p.code]).join('')}
          </text>
        </g>
      )}
    </g>
  );
}

/**
 * The finale: the tomb sealed. The doorway is walled up, course by course
 * (each course rises in turn), plastered, and stamped with a seal: the
 * visitor's own cartouche, if they made one.
 */
function SealedDoor({ id, cartouche }: { id: string; cartouche: SavedCartouche | null }) {
  const courses = 9;
  const ch = CH_H / courses;
  return (
    <g className="egb-sealed">
      <rect className="egb-seal-dark" x="0" y="0" width={CH_W} height={CH_H} fill="#0b0805" />
      {Array.from({ length: courses }, (_, row) => {
        const y = CH_H - (row + 1) * ch;
        const offset = row % 2 ? 60 : 0;
        return (
          <g key={row} className="egb-course" style={{ animationDelay: `${0.25 + row * 0.18}s` }}>
            <rect x="0" y={y} width={CH_W} height={ch} fill="#c9a66b" />
            {Array.from({ length: 11 }, (_, k) => (
              <rect key={k} x={-60 + offset + k * 120} y={y + 2} width="116" height={ch - 4} rx="4" fill={`url(#${id}-stone)`} stroke="#7a5a30" strokeWidth="2" />
            ))}
          </g>
        );
      })}
      <defs>
        <linearGradient id={`${id}-stone`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e3c891" />
          <stop offset="1" stopColor="#b8925a" />
        </linearGradient>
      </defs>
      <g className="egb-plaster">
        <rect x="0" y="0" width={CH_W} height={CH_H} fill="#e9d8b0" opacity="0.92" />
      </g>
      <g transform={`translate(${CH_W / 2} ${CH_H / 2})`}>
      <g className="egb-stamp">
        <ellipse cx="0" cy="0" rx="150" ry="120" fill="#c94f2c" opacity="0.18" />
        <ellipse cx="0" cy="0" rx="150" ry="120" fill="none" stroke="#8a2a1a" strokeWidth="8" />
        {cartouche ? (
          <g>
            <rect x="-120" y="-44" width="240" height="88" rx="44" fill="none" stroke="#8a2a1a" strokeWidth="6" />
            <path d="M126 -40 V40" stroke="#8a2a1a" strokeWidth="8" />
            <text x="0" y="0" fill="#8a2a1a" fontFamily="'Egypt Hieroglyphs', 'Noto Sans Egyptian Hieroglyphs', serif" fontSize={Math.min(52, 200 / Math.max(1, [...cartouche.spelled.map((x) => x.glyphs).join('')].length))} textAnchor="middle" dominantBaseline="central">
              {cartouche.spelled.map((x) => x.glyphs).join('')}
            </text>
          </g>
        ) : (
          <text x="0" y="0" fill="#8a2a1a" fontFamily="'Egypt Hieroglyphs', 'Noto Sans Egyptian Hieroglyphs', serif" fontSize="80" textAnchor="middle" dominantBaseline="central">
            {GLYPHS.S34}
          </text>
        )}
      </g>
      </g>
    </g>
  );
}

const line = { stroke: INK, strokeWidth: 2.4, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

/** Each thing, drawn standing on y = 0, about 100 units across at most. */
export function GoodArt({ id }: { id: GoodId }) {
  switch (id) {
    case 'chair':
      return (
        <g {...line}>
          <path d="M-30 -110 L-24 -46 L28 -46 L28 -54 L-16 -54 L-20 -110 Z" fill="#a8743e" />
          <rect x="-30" y="-52" width="62" height="10" fill="#c99a5a" />
          {[-26, 24].map((x) => (
            <path key={x} d={`M${x} -42 L${x} -8 Q${x - 4} -2 ${x - 8} 0 L${x + 6} 0 L${x + 6} -42 Z`} fill="#8a5a2c" />
          ))}
          <path d="M-22 -100 L-18 -60 M-12 -100 L-10 -60" stroke="#e6c48a" strokeWidth="1.6" />
        </g>
      );
    case 'bed':
      return (
        <g {...line}>
          <path d="M-56 -40 L56 -32 L56 -24 L-56 -32 Z" fill="#e8dcc0" />
          <path d="M-58 -30 L58 -22" stroke="#8a5a2c" strokeWidth="6" />
          <path d="M-56 -30 L-58 -60 L-46 -60 L-46 -30 Z" fill="#a8743e" />
          {[-50, 50].map((x) => (
            <path key={x} d={`M${x - 4} -24 L${x - 2} -6 Q${x - 8} 0 ${x - 12} 0 L${x + 6} 0 L${x + 6} -24 Z`} fill="#8a5a2c" />
          ))}
        </g>
      );
    case 'food':
      return (
        <g {...line}>
          <path d="M-44 -24 Q0 -10 44 -24 L36 0 L-36 0 Z" fill="#c99a5a" />
          <path d="M-36 -18 L36 -18 M-34 -10 L34 -10" stroke="#8a5a2c" strokeWidth="1.6" />
          <ellipse cx="-16" cy="-30" rx="18" ry="11" fill="#d9a35a" />
          <circle cx="12" cy="-32" r="10" fill="#b23a2a" />
          <circle cx="26" cy="-28" r="8" fill="#e0b13a" />
          <circle cx="2" cy="-40" r="7" fill="#5a2e5c" />
          <circle cx="12" cy="-44" r="6" fill="#5a2e5c" />
        </g>
      );
    case 'jars':
      return (
        <g {...line}>
          {[-22, 22].map((x, i) => (
            <g key={x} transform={`translate(${x} 0) scale(${i ? 0.9 : 1})`}>
              <path d="M-8 -86 L8 -86 L10 -72 C24 -62 26 -30 14 -12 L4 0 L-4 0 L-14 -12 C-26 -30 -24 -62 -10 -72 Z" fill={i ? '#c4703e' : '#b5602e'} />
              <path d="M-14 -50 C-6 -46 6 -46 14 -50" fill="none" stroke="#2f5f9e" strokeWidth="4" />
              <path d="M-10 -72 C-18 -70 -20 -62 -16 -58 M10 -72 C18 -70 20 -62 16 -58" fill="none" />
            </g>
          ))}
        </g>
      );
    case 'game':
      return (
        <g {...line}>
          <path d="M-46 -30 L46 -30 L46 -16 L-46 -16 Z" fill="#e6c48a" />
          {Array.from({ length: 10 }, (_, i) => (
            <rect key={i} x={-44 + i * 8.8} y="-29" width="8.8" height="5.5" fill={(i % 2 ? '#2f5f9e' : '#f6efdc')} stroke={INK} strokeWidth="0.8" />
          ))}
          {Array.from({ length: 10 }, (_, i) => (
            <rect key={`b${i}`} x={-44 + i * 8.8} y="-23.5" width="8.8" height="5.5" fill={(i % 2 ? '#f6efdc' : '#2f5f9e')} stroke={INK} strokeWidth="0.8" />
          ))}
          <path d="M-44 -16 L-40 0 L40 0 L44 -16 Z" fill="#8a5a2c" />
          <path d="M-12 -30 L-12 -38 Q-10 -42 -8 -38 L-8 -30 Z M6 -30 L6 -36 Q9 -40 12 -36 L12 -30 Z" fill="#b23a2a" />
        </g>
      );
    case 'sandals':
      return (
        <g {...line}>
          {[-14, 14].map((x) => (
            <g key={x} transform={`translate(${x} 0)`}>
              <path d="M-9 0 C-12 -16 -10 -40 0 -44 C10 -40 12 -16 9 0 Z" fill="#c99a5a" />
              <path d="M-8 -18 Q0 -30 8 -18 M0 -30 L0 -40" fill="none" stroke="#7a4e18" strokeWidth="2.4" />
            </g>
          ))}
        </g>
      );
    case 'mirror':
      return (
        <g {...line}>
          <path d="M-6 0 L-4 -40 L4 -40 L6 0 Z" fill="#3f7d4c" />
          <path d="M-12 -40 Q0 -34 12 -40 L4 -46 L-4 -46 Z" fill="#d9a441" />
          <ellipse cx="0" cy="-74" rx="22" ry="27" fill="#e8c76e" />
          <ellipse cx="-6" cy="-80" rx="8" ry="12" fill="#fff6d0" opacity="0.7" stroke="none" />
        </g>
      );
    case 'lamp':
      return (
        <g {...line}>
          <path d="M-22 0 L22 0 L14 -14 L-14 -14 Z" fill="#c99a5a" />
          <path d="M-20 -14 Q0 -36 20 -14 Z" fill="#d9a441" />
          <path className="egb-flame" d="M18 -44 C24 -36 26 -26 18 -18 C10 -26 12 -36 18 -44 Z" fill="#ffb238" />
        </g>
      );
    case 'horse':
      return (
        <g {...line}>
          <path d="M-34 -24 L30 -24 L30 -14 L-34 -14 Z" fill="#8a5a2c" />
          {[-24, 20].map((x) => (
            <circle key={x} cx={x} cy="-8" r="8" fill="#a8743e" />
          ))}
          <path d="M-28 -24 L-26 -46 C-26 -54 18 -56 22 -48 L24 -62 C24 -74 34 -76 40 -66 L44 -56 L36 -54 L32 -46 L28 -24 Z" fill="#c99a5a" />
          <path d="M24 -62 L20 -72" stroke={INK} strokeWidth="3" />
          <circle cx="34" cy="-64" r="1.8" fill={INK} />
          <path d="M-28 -44 Q-40 -40 -38 -28" fill="none" stroke={INK} strokeWidth="3" />
        </g>
      );
    case 'boat':
      return (
        <g {...line}>
          <path d="M-58 -32 Q-46 -6 0 -6 Q46 -6 58 -32 Q40 -18 0 -18 Q-40 -18 -58 -32 Z" fill="#3f7d4c" />
          <path d="M-58 -32 L-64 -40 M58 -32 L64 -40" />
          <path d="M-4 -18 L-4 -70" strokeWidth="3" />
          <path d="M-4 -68 L24 -40 L-4 -38 Z" fill="#f6efdc" />
          <path d="M-12 -6 L-10 0 L10 0 L12 -6 Z" fill="#8a5a2c" />
        </g>
      );
    case 'chest':
      return (
        <g {...line}>
          <rect x="-40" y="-52" width="80" height="44" fill="#a8743e" />
          <path d="M-44 -52 Q0 -72 44 -52 Z" fill="#c99a5a" />
          <rect x="-34" y="-46" width="68" height="10" fill="#2f5f9e" />
          {[-30, -18, -6, 6, 18, 30].map((x) => (
            <rect key={x} x={x - 3} y="-44" width="6" height="6" fill="#d9a441" stroke="none" />
          ))}
          <path d="M-36 -8 L-36 0 M36 -8 L36 0" strokeWidth="5" />
        </g>
      );
  }
}
