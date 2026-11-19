import type { CSSProperties, ReactNode } from 'react';
import AmuletArt from '../amulet/AmuletArt';
import { describeAmulet, type SavedAmulet } from '../amulet/savedAmulet';
import Cartouche from '../hieroglyph-name/Cartouche';
import { CoffinLid, COFFIN_OUTLINE } from '../mummification/Coffin';
import type { Wall } from '../tomb/scenes';
import type { SavedCartouche } from './savedCartouche';
import { GOODS, type GoodId } from './myTomb';

/*
 * The visitor's own burial chamber, fully lit: no torch, nothing hidden.
 * Drawn in SVG in a gentle perspective: a painted ceiling of stars, the
 * back wall with a framed painting (the wall they chose, one of The Met's
 * facsimiles), a niche for their amulet on the left and a stone column for
 * their cartouche on the right, plastered side walls, a stone floor, two
 * lamps burning, and a painted coffin lying in the middle of the floor.
 * The things they choose stand on the floor where they put them, a little
 * smaller toward the back.
 *
 * The cartouche is the hieroglyph room's own Cartouche, set over the wall's
 * column; the overlays the page adds (the things to move, the places to
 * drop) go over the chamber as its children, placed by `box()`.
 */

export const CH_W = 1200;
export const CH_H = 700;
const BACK = { left: 170, right: 1030, top: 50, floor: 430 };
const INK = '#2b1d12';

export const PAINTING_BOX: Box = [330, 92, 540, 288];
export const NICHE_BOX: Box = [196, 160, 112, 180];
export const CARTOUCHE_BOX: Box = [902, 70, 100, 350];
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

/** Free places on the floor, in the order a tapped thing takes them. */
export const FLOOR_SLOTS = [
  { x: 300, y: 540 },
  { x: 900, y: 540 },
  { x: 420, y: 490 },
  { x: 780, y: 490 },
  { x: 230, y: 650 },
  { x: 970, y: 650 },
  { x: 600, y: 488 },
  { x: 340, y: 670 },
  { x: 860, y: 670 },
];

export default function Chamber({
  wall,
  goods,
  amulet,
  cartouche,
  selected,
  label,
  idPrefix = 'egt',
  children,
}: {
  wall: Wall | null;
  goods: Placed[];
  amulet: SavedAmulet | null;
  cartouche: SavedCartouche | null;
  selected?: GoodId | null;
  label: string;
  idPrefix?: string;
  children?: ReactNode;
}) {
  // The back of the floor first, so nearer things stand in front.
  const sorted = [...goods].sort((a, b) => a.y - b.y);
  const front = sorted.filter((g) => g.y >= 600);
  const back = sorted.filter((g) => g.y < 600);
  const thing = (g: Placed) => (
    <g key={g.id} className={`egt-good${selected === g.id ? ' is-selected' : ''}`} transform={`translate(${g.x} ${g.y}) scale(${depthScale(g.y)})`}>
      <ellipse cx="0" cy="2" rx="52" ry="9" fill="#000" opacity="0.22" />
      <GoodArt id={g.id} />
    </g>
  );

  return (
    <div className="egt-chamber">
      <svg className="egt-svg" viewBox={`0 0 ${CH_W} ${CH_H}`} role="img" aria-label={label}>
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
          <image className="egt-painting" key={wall.id} href={wall.src} x={PAINTING_BOX[0]} y={PAINTING_BOX[1]} width={PAINTING_BOX[2]} height={PAINTING_BOX[3]} preserveAspectRatio="xMidYMid slice" clipPath={`url(#${idPrefix}-painting)`} />
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
            <path className="egt-flame" d="M0 -196 C10 -180 14 -164 0 -152 C-14 -164 -10 -180 0 -196 Z" fill="#ffb238" />
            <path className="egt-flame" d="M0 -184 C5 -174 7 -164 0 -156 C-7 -164 -5 -174 0 -184 Z" fill="#fff1a8" />
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

        {/* The coffin, lying in the middle of the floor */}
        <g transform="translate(452 604) rotate(-90) scale(0.62)">
          <path d={COFFIN_OUTLINE} transform="translate(10 8)" fill="#000" opacity="0.25" />
          <CoffinLid id={`${idPrefix}-coffin`} />
        </g>

        {front.map(thing)}

        {/* The light of the lamps */}
        <rect x="0" y="0" width={CH_W} height={CH_H} fill={`url(#${idPrefix}-light)`} pointerEvents="none" />
      </svg>

      {cartouche && (
        <div className="egt-cartouche" style={box(CARTOUCHE_BOX)}>
          <Cartouche spelled={cartouche.spelled} direction="down" label={`Your name in a cartouche${cartouche.name ? `: ${cartouche.name}` : ''}`} ink={INK} />
        </div>
      )}
      {children}
    </div>
  );
}

/** What the chamber holds, said in words for its alt text. */
export function describeChamber(wall: Wall | null, goods: Placed[], amulet: SavedAmulet | null, cartouche: SavedCartouche | null) {
  const things = goods.map((g) => GOODS.find((x) => x.id === g.id)!.name.toLowerCase());
  return [
    'A burial chamber, lit by two lamps, with a painted coffin lying on the floor.',
    wall ? `On the back wall: ${wall.title}.` : 'The frame on the back wall is empty.',
    things.length ? `On the floor: ${things.join(', ')}.` : '',
    amulet ? `In the niche: ${describeAmulet(amulet)}.` : '',
    cartouche ? `On the wall, a cartouche${cartouche.name ? ` with the name ${cartouche.name}` : ''}.` : '',
  ]
    .filter(Boolean)
    .join(' ');
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
          <path className="egt-flame" d="M18 -44 C24 -36 26 -26 18 -18 C10 -26 12 -36 18 -44 Z" fill="#ffb238" />
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
