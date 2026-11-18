import { forwardRef, type PointerEvent } from 'react';
import { GLYPHS } from '../rooms';
import AmuletArt from '../amulet/AmuletArt';
import type { SavedAmulet } from '../amulet/savedAmulet';
import { CoffinBase, CoffinLid } from './Coffin';
import { Jar, Organ, type HeadKind } from './JarArt';
import { JARS, LAYERS, type StepId } from './steps';

/*
 * The embalmers' workshop, drawn in SVG: a lamplit wall with a painted
 * frieze and a recumbent jackal (Anubis, as the posters say he could be
 * shown), two oil lamps, a reed mat, and the lion-legged embalming bed. On
 * it lies a figure in the Egyptian manner, face up, head to the left, in a
 * white kilt. It changes as the visitor works, each state built on the
 * last:
 *
 *   dusty → washed → the hook in the nose, the brain drawn out and gone →
 *   the cut on the left side, the organs inside it → each organ gone into
 *   its jar, the heart left → bags of natron, forty days, the body dried
 *   and shrunken → oiled and glossy → linen wound on layer by layer, the
 *   amulets tucked between → lowered into a painted coffin → the lid.
 *
 * The things the visitor handles (the body to wipe and rub, the hook, the
 * linen roll, the mummy, the lid) start a drag through `onGrab`; the room
 * follows the pointer (onMove, onEnd). Everything is in the SVG's own
 * units, so the room can find a point under a finger (the ref is the svg).
 */

const FONT = "'Egypt Hieroglyphs', 'Noto Sans Egyptian Hieroglyphs', serif";

/** The figure, face up: head, neck, chest, hips, legs, feet. */
const BODY =
  'M178 258 C178 236 194 226 212 226 C224 226 232 232 236 241 L250 243 C272 236 310 233 344 234 C384 236 410 238 432 243 C480 247 560 248 606 250 L620 236 C628 230 638 234 637 245 L636 262 C632 271 620 273 606 270 C560 272 480 273 432 275 C410 280 382 282 344 282 C306 282 270 280 250 274 L236 276 C230 286 222 290 210 290 C192 290 178 280 178 258 Z';
const NOSE = 'M203 229 C204 221 213 220 216 229 Z';

/** Where the dust lies until it is washed off. */
export const WASH_PATCHES = [
  { x: 214, y: 262 },
  { x: 300, y: 252 },
  { x: 372, y: 264 },
  { x: 468, y: 256 },
  { x: 540, y: 262 },
  { x: 604, y: 256 },
];

/** Where the bags of natron go, inside and outside the body. */
export const NATRON_SPOTS = [
  { x: 232, y: 212 },
  { x: 320, y: 212 },
  { x: 410, y: 214 },
  { x: 356, y: 258 },
  { x: 500, y: 226 },
  { x: 590, y: 230 },
];

/** Where each organ lies inside the body, through the cut. */
export const ORGAN_SPOTS: Record<string, { x: number; y: number }> = {
  lungs: { x: 290, y: 257 },
  liver: { x: 348, y: 262 },
  stomach: { x: 382, y: 255 },
  intestines: { x: 414, y: 263 },
};

/** The jars on the floor, left to right, in JARS order. */
export const JAR_X = [250, 350, 450, 550];
export const JAR_BASE = 452;
export const JAR_SCALE = 0.95;

/** The hook's tip, out of the nose (0) and in it (1). */
const HOOK_TOP = 168;
const HOOK_IN = 224;
/** The linen roll runs from the head to the feet. */
export const WRAP_FROM = 178;
export const WRAP_TO = 637;
/** How far the mummy is lowered into the coffin, and how far the lid comes down. */
export const MUMMY_DROP = 140;
export const LID_DROP = 150;

const AMULET_SPOTS = [300, 420, 540, 360, 480, 600];

export type Grab = 'wipe' | 'hook' | 'rub' | 'roll' | 'mummy' | 'lid';

export type MummyState = {
  step: StepId;
  /** The wash patches still dusty, by index. */
  dusty: number[];
  /** How far the hook is in (0–1), whether it has reached the brain, and whether the brain is out. */
  hook: number;
  hookIn: boolean;
  brainOut: boolean;
  /** The cut is open (the organs step) and the organs still inside. */
  open: boolean;
  inBody: string[];
  /** The jars filled so far, by god, and whether they stand on the floor. */
  filled: string[];
  jars: boolean;
  /** Light up the heart, left inside. */
  showHeart: boolean;
  /** The natron bags packed, by spot, and the days counted (0–40). */
  packed: boolean[];
  days: number;
  /** How well oiled (0–1), and where the oil cloth is. */
  oil: number;
  cloth: { x: number; y: number } | null;
  /** Layers of linen finished, and how far along the body the current one is (0–1). */
  layers: number;
  wrapAt: number;
  rolling: boolean;
  amulets: { id: string; glyph: string; layer: number }[];
  own: SavedAmulet | null;
  /** The coffin: shown, the mummy lowered (0–1), the lid brought down (0–1). */
  coffin: boolean;
  mummy: number;
  lid: number;
  closed: boolean;
};

type Props = {
  s: MummyState;
  onGrab?: (kind: Grab, e: PointerEvent<SVGElement>) => void;
  onMove?: (e: PointerEvent<SVGSVGElement>) => void;
  onEnd?: (e: PointerEvent<SVGSVGElement>) => void;
};

const MummyScene = forwardRef<SVGSVGElement, Props>(function MummyScene({ s, onGrab, onMove, onEnd }, ref) {
  const dry = Math.min(1, s.days / 40);
  // Dried in the natron, the body shrinks and darkens a little: the room's picture of the forty days.
  const shrink = `translate(0 ${262 * 0.15 * dry}) scale(${1 - 0.03 * dry} ${1 - 0.15 * dry})`;
  const grab = (kind: Grab) => (e: PointerEvent<SVGElement>) => onGrab?.(kind, e);
  const tipY = HOOK_TOP + (HOOK_IN - HOOK_TOP) * s.hook;
  const wrapping = s.step === 'wrap';
  const bodyGrab: Grab | null = s.step === 'wash' && s.dusty.length ? 'wipe' : s.step === 'oils' ? 'rub' : null;
  const coverX = WRAP_FROM + (WRAP_TO - WRAP_FROM) * s.wrapAt;
  const mummyY = MUMMY_DROP * s.mummy;

  return (
    <svg ref={ref} className="egm-svg" viewBox="100 130 640 330" aria-hidden="true" data-step={s.step} onPointerMove={onMove} onPointerUp={onEnd} onPointerCancel={onEnd}>
      <defs>
        <linearGradient id="egm-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5b3d22" />
          <stop offset="0.7" stopColor="#3e2814" />
          <stop offset="1" stopColor="#2a1b0e" />
        </linearGradient>
        <radialGradient id="egm-lamp" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="rgba(255, 200, 110, 0.55)" />
          <stop offset="1" stopColor="rgba(255, 200, 110, 0)" />
        </radialGradient>
        <pattern id="egm-mat" width="16" height="16" patternUnits="userSpaceOnUse">
          <rect width="16" height="16" fill="#6b4a24" />
          <path d="M0 4 H16 M0 12 H16" stroke="#7d5a2e" strokeWidth="4" />
          <path d="M4 0 V4 M12 8 V12" stroke="#4e3418" strokeWidth="1.5" />
        </pattern>
        <pattern id="egm-linen" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(32)">
          <rect width="14" height="14" fill="#eee4cb" />
          <line x1="0" y1="0" x2="0" y2="14" stroke="#c9b88f" strokeWidth="3" />
        </pattern>
        <pattern id="egm-linen-2" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(-32)">
          <rect width="14" height="14" fill="#f3ead4" />
          <line x1="0" y1="0" x2="0" y2="14" stroke="#cdbd97" strokeWidth="3" />
        </pattern>
        <pattern id="egm-salt" width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" fill="#f2f0ea" />
          <circle cx="2" cy="2" r="1.1" fill="#d6d2c7" />
          <circle cx="6" cy="6" r="0.9" fill="#cfcabf" />
        </pattern>
        <linearGradient id="egm-sheen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgba(255, 228, 150, 0.95)" />
          <stop offset="0.5" stopColor="rgba(255, 228, 150, 0)" />
        </linearGradient>
        <clipPath id="egm-body">
          <path d={BODY} />
        </clipPath>
        <clipPath id="egm-wrapped">
          <rect x="140" y="190" width={wrapping ? coverX - 140 : 600} height="120" />
        </clipPath>
      </defs>

      {/* ───── The workshop ───── */}
      <rect x="100" y="130" width="640" height="230" fill="url(#egm-wall)" />
      {/* a frieze along the top of the wall */}
      <g>
        <rect x="100" y="130" width="640" height="22" fill="#1d3f7c" />
        {Array.from({ length: 32 }, (_, i) => (
          <path key={i} d={`M${104 + i * 20} 152 L${104 + i * 20} 138 Q${114 + i * 20} 128 ${124 + i * 20} 138 L${124 + i * 20} 152 Z`} fill={['#c8402a', '#d9a441', '#2f7a4a'][i % 3]} stroke="#1a120a" strokeWidth="1" />
        ))}
        <rect x="100" y="152" width="640" height="4" fill="#d9a441" />
      </g>
      {/* Anubis, as a jackal lying down, painted on the wall */}
      <text x="420" y="214" fontFamily={FONT} fontSize="62" textAnchor="middle" className="egm-wall-jackal">
        {GLYPHS.E15}
      </text>
      <rect x="100" y="350" width="640" height="110" fill="url(#egm-mat)" />
      <rect x="100" y="348" width="640" height="4" fill="#2a1b0e" />
      {/* the two oil lamps, and their light */}
      {[128, 712].map((x) => (
        <g key={x}>
          <circle cx={x} cy={262} r={90} fill="url(#egm-lamp)" />
          <path d={`M${x} 348 L${x} 292`} stroke="#8a6a3a" strokeWidth="4" />
          <path d={`M${x - 14} 292 Q${x} 304 ${x + 14} 292 Z`} fill="#c99a3d" stroke="#5a3e18" strokeWidth="1.5" />
          <path className="egm-flame" d={`M${x} 270 C${x - 6} 280 ${x - 5} 290 ${x} 292 C${x + 5} 290 ${x + 6} 280 ${x} 270 Z`} fill="#ffcf6a" />
        </g>
      ))}

      {/* ───── The embalming bed, with a lion's head and lion's legs ───── */}
      {!s.closed && (
        <g className={`egm-bed ${s.mummy >= 1 ? 'is-away' : ''}`}>
          <rect x="150" y="300" width="540" height="14" rx="3" fill="#8a5a2b" stroke="#4a2c12" strokeWidth="2" />
          <path d="M162 300 C150 288 146 268 156 256 C166 246 180 250 182 262 L184 300 Z" fill="#c99a3d" stroke="#4a2c12" strokeWidth="2" />
          <circle cx="164" cy="266" r="2.5" fill="#2a1a0c" />
          <path d="M152 276 L146 282 M150 270 L142 270" stroke="#4a2c12" strokeWidth="1.5" />
          {[176, 650].map((x) => (
            <g key={x}>
              <path d={`M${x} 314 L${x + 4} 346 L${x + 24} 346 L${x + 22} 314 Z`} fill="#c99a3d" stroke="#4a2c12" strokeWidth="2" />
              <path d={`M${x + 6} 346 v-5 M${x + 12} 346 v-5 M${x + 18} 346 v-5`} stroke="#4a2c12" strokeWidth="1.5" />
            </g>
          ))}
          <path d="M690 304 C712 296 722 310 712 322" fill="none" stroke="#c99a3d" strokeWidth="5" strokeLinecap="round" />
        </g>
      )}

      {/* ───── The coffin's base on the floor ───── */}
      {s.coffin && (
        <g className="egm-coffin" transform="translate(170 404) rotate(-90) scale(0.75 1)">
          {s.closed ? <CoffinLid id="egm-coffin" /> : <CoffinBase />}
        </g>
      )}

      {/* ───── The body ───── */}
      {!s.closed && (
        <g className="egm-figure" style={{ transform: `translateY(${mummyY}px)` }} onPointerDown={s.coffin && s.mummy < 1 ? grab('mummy') : undefined} data-grab={s.coffin && s.mummy < 1 ? 'mummy' : undefined}>
          <g transform={shrink}>
            <path className="egm-body" d={BODY} onPointerDown={bodyGrab ? grab(bodyGrab) : undefined} data-grab={bodyGrab ?? undefined} />
            <path className="egm-body" d={NOSE} />
            {/* darker as it dries */}
            <path d={BODY} fill="#3b2414" opacity={0.42 * dry} pointerEvents="none" />
            {s.oil > 0 && <path d={BODY} fill="url(#egm-sheen)" opacity={s.oil} pointerEvents="none" />}
            {s.oil > 0 &&
              [260, 340, 430, 520, 590].map((x, i) => (s.oil > i / 5 ? <ellipse key={x} className="egm-glint" cx={x} cy={244 + (i % 2) * 4} rx="14" ry="2.5" fill="#fff3c4" pointerEvents="none" /> : null))}
            <g pointerEvents="none">
              <path className="egm-limb" d="M252 262 C300 268 360 268 412 262" />
              <circle cx="206" cy="242" r="2.6" className="egm-eye" />
              <path className="egm-kilt" d="M410 240 L452 244 L452 276 L410 280 Z" />
              {s.dusty.map((i) => (
                <ellipse key={i} className="egm-dust" cx={WASH_PATCHES[i].x} cy={WASH_PATCHES[i].y} rx="26" ry="11" />
              ))}
              {/* the open cut on the left side, and the organs inside */}
              {s.open && (
                <g>
                  <ellipse cx="350" cy="258" rx="84" ry="17" fill="#5a2a1c" stroke="#3a160c" strokeWidth="2" />
                  {s.inBody.map((o) => (
                    <g key={o} className="egm-organ-in" transform={`translate(${ORGAN_SPOTS[o].x} ${ORGAN_SPOTS[o].y}) scale(0.72)`}>
                      <Organ id={o} />
                    </g>
                  ))}
                </g>
              )}
              {!s.open && (s.step !== 'wash' && s.step !== 'brain' && s.step !== 'gods') && <path className="egm-cut" d="M350 266 q14 6 30 0" />}
              {/* the heart, left inside */}
              {(s.open || s.step === 'natron') && (
                <text className={`egm-heart ${s.showHeart ? 'is-shown' : ''}`} x="322" y="261" fontFamily={FONT} fontSize="17" textAnchor="middle">
                  {GLYPHS.F34}
                </text>
              )}
              {/* the brain, inside the head, until it is drawn out */}
              {s.step === 'brain' && !s.brainOut && !s.hookIn && <ellipse cx="208" cy="252" rx="11" ry="8" className="egm-brain-shape is-inside" />}
            </g>

            {/* the linen: finished layers, and the one being wound */}
            {s.layers + s.wrapAt > 0 && (
              <g clipPath="url(#egm-body)" pointerEvents="none">
                {Array.from({ length: Math.min(LAYERS, s.layers) }, (_, i) => (
                  <rect key={i} x="140" y="190" width="600" height="120" fill={i % 2 ? 'url(#egm-linen-2)' : 'url(#egm-linen)'} style={{ opacity: 0.7 + i * 0.08 }} />
                ))}
                {wrapping && s.layers < LAYERS && s.wrapAt > 0 && (
                  <g clipPath="url(#egm-wrapped)">
                    <rect x="140" y="190" width="600" height="120" fill={s.layers % 2 ? 'url(#egm-linen-2)' : 'url(#egm-linen)'} style={{ opacity: 0.78 }} />
                  </g>
                )}
              </g>
            )}
            {/* the amulets, tucked in between the layers */}
            {(s.step === 'wrap' || s.step === 'coffin') &&
              s.amulets.map((a, i) => {
                const x = AMULET_SPOTS[i % AMULET_SPOTS.length];
                const covered = s.layers > a.layer;
                return a.id === 'own' && s.own ? (
                  <g key={i} className={`egm-amulet ${covered ? 'is-covered' : ''}`} pointerEvents="none">
                    <AmuletArt idPrefix={`egm-own-${i}`} shape={s.own.shape} material={s.own.material} symbols={s.own.symbols} nameGlyphs={s.own.nameGlyphs} label="" place={{ x: x - 17, y: 236, width: 34, height: 41 }} />
                  </g>
                ) : (
                  <text key={i} className={`egm-amulet ${covered ? 'is-covered' : ''}`} x={x} y={268} fontFamily={FONT} fontSize="28" textAnchor="middle" pointerEvents="none">
                    {a.glyph}
                  </text>
                );
              })}
          </g>
        </g>
      )}

      {/* ───── The hook, and the brain drawn out on it ───── */}
      {s.step === 'brain' && !s.brainOut && (
        <g className="egm-hook-tool" onPointerDown={grab('hook')} data-grab="hook">
          <rect x="196" y={tipY - 112} width="32" height="110" fill="transparent" />
          <circle cx="212" cy={tipY - 102} r="9" fill="none" stroke="#c99a3d" strokeWidth="4" />
          <path className="egm-hook" d={`M212 ${tipY - 94} L212 ${tipY - 6} q0 6 -5 6`} />
          {s.hookIn && <ellipse className="egm-brain-shape" cx="212" cy={tipY + 6} rx="10" ry="7" style={{ opacity: Math.max(0.15, s.hook) }} />}
          {!s.hookIn && <path d={`M232 ${tipY - 60} l0 22 l-6 -6 m6 6 l6 -6`} className="egm-hint-arrow" />}
          {s.hookIn && <path d={`M232 ${tipY - 40} l0 -22 l-6 6 m6 -6 l6 6`} className="egm-hint-arrow" />}
        </g>
      )}

      {/* ───── The water, while washing ───── */}
      {s.step === 'wash' && s.dusty.length > 0 && (
        <g className="egm-water">
          {[220, 300, 380, 460, 540, 620].map((x, i) => (
            <line key={x} x1={x} y1={168} x2={x - 6} y2={190} style={{ animationDelay: `${i * 0.18}s` }} />
          ))}
        </g>
      )}

      {/* ───── The natron: a spot for each bag; packed, the bags darken as the days pass ───── */}
      {s.step === 'natron' && (
        <g className="egm-natron-spots">
          {NATRON_SPOTS.map((p, i) =>
            s.packed[i] ? (
              <g key={i} className="egm-bag">
                <rect x={p.x - 24} y={p.y - 15} width="48" height="30" rx="11" fill="url(#egm-salt)" stroke="#bdb6a4" strokeWidth="1.5" />
                <rect x={p.x - 24} y={p.y - 15} width="48" height="30" rx="11" fill="#8a7a5c" opacity={0.35 * dry} />
                <path d={`M${p.x - 6} ${p.y - 15} q6 -6 12 0`} fill="none" stroke="#a89a7a" strokeWidth="2" />
              </g>
            ) : (
              <circle key={i} className="egm-spot" cx={p.x} cy={p.y} r="17" />
            ),
          )}
        </g>
      )}
      {s.step === 'natron' && s.days > 0 && (
        <g className="egm-sun">
          <path d="M150 196 Q420 120 690 196" fill="none" stroke="rgba(255, 207, 106, 0.25)" strokeWidth="2" strokeDasharray="4 6" />
          <circle cx={150 + 540 * dry} cy={196 - 152 * dry * (1 - dry)} r="12" fill="#ffcf6a" />
        </g>
      )}

      {/* ───── The oil cloth, under the finger ───── */}
      {s.step === 'oils' && s.cloth && (
        <g pointerEvents="none" transform={`translate(${s.cloth.x} ${s.cloth.y})`}>
          <path d="M-16 -10 C-6 -16 10 -14 16 -6 C18 4 8 12 -4 12 C-14 10 -20 0 -16 -10 Z" fill="#d9c48f" stroke="#8a6a3a" strokeWidth="1.5" />
          <path d="M-10 -4 q8 -4 16 0 M-8 4 q8 -4 14 0" fill="none" stroke="#b89a5c" strokeWidth="1.2" />
        </g>
      )}

      {/* ───── The linen roll, wound from head to feet ───── */}
      {wrapping && s.layers < LAYERS && (
        <g className={`egm-roll ${s.rolling ? 'is-on' : 'is-off'}`} onPointerDown={s.rolling ? grab('roll') : undefined} data-grab={s.rolling ? 'roll' : undefined}>
          <rect x={coverX - 30} y="196" width="60" height="110" fill="transparent" />
          <path d={`M${coverX} 226 L${coverX} 284`} stroke="#e9dfc6" strokeWidth="6" />
          <rect x={coverX - 12} y="204" width="24" height="26" rx="10" fill="#f3ead4" stroke="#a89a7a" strokeWidth="2" />
          <ellipse cx={coverX} cy="204" rx="12" ry="4" fill="#e9dfc6" stroke="#a89a7a" strokeWidth="1.5" />
          {s.rolling && <path d={`M${coverX + 20} 216 l22 0 l-6 -6 m6 6 l-6 6`} className="egm-hint-arrow" />}
        </g>
      )}

      {/* ───── The canopic jars, on the floor in front of the bed ───── */}
      {s.jars &&
        JARS.map((j, i) => (
          <g key={j.god} transform={`translate(${JAR_X[i]} ${JAR_BASE}) scale(${JAR_SCALE})`}>
            <Jar id={`egm-jar-${i}`} head={j.head as HeadKind} organ={j.organ} full={s.filled.includes(j.god)} />
          </g>
        ))}

      {/* ───── The coffin's lid, brought down onto the base ───── */}
      {s.coffin && s.mummy >= 1 && !s.closed && (
        <g className="egm-lid" style={{ transform: `translateY(${-LID_DROP * (1 - s.lid)}px)` }} onPointerDown={grab('lid')} data-grab="lid">
          <g transform="translate(170 404) rotate(-90) scale(0.75 1)" opacity={0.75 + 0.25 * s.lid}>
            <CoffinLid id="egm-lid" />
          </g>
          {s.lid < 0.5 && <path d="M720 232 l0 26 l-6 -6 m6 6 l6 -6" className="egm-hint-arrow" />}
        </g>
      )}
      {s.coffin && s.mummy < 1 && <path d="M720 250 l0 40 l-8 -8 m8 8 l8 -8" className="egm-hint-arrow" />}
    </svg>
  );
});

export default MummyScene;
