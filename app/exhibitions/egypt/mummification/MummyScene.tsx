import { forwardRef, type PointerEvent, type ReactNode } from 'react';
import { GLYPHS } from '../rooms';
import AmuletArt from '../amulet/AmuletArt';
import type { SavedAmulet } from '../amulet/savedAmulet';
import { ALL_PASSES, PASSES, ZONES, passX } from './mummyGame';

/*
 * The embalmers' workshop, drawn in SVG, for the steps done on the whole
 * body (washing, the natron, the oils, the linen, and choosing the next
 * tool): a lamplit wall with a painted frieze and a recumbent jackal
 * (Anubis, as the posters say he could be shown), shelves of jars, two oil
 * lamps, a reed mat, and the lion-legged embalming bed. On it lies a
 * figure in the Egyptian manner, face up, head to the left, arms at its
 * sides, in a white kilt.
 *
 * It shows the body as the visitor has left it (`look`): dusty, then
 * washed; the cut in the left side once the organs are out; natron bags
 * where they were packed, and the parts still damp glistening; dried,
 * darker and a little shrunken after the forty days (the room keeps this
 * picture, which Verity likes); glossy where the oil has been rubbed in;
 * the linen wound on pass by pass, the first layer slanting one way and the
 * second the other, with the amulets showing faintly between them.
 *
 * The tool in the visitor's hand (the water jar, the oil cloth, the linen
 * roll) is drawn where `tools` says. The room does the moving: every
 * pointer event on the picture is handed up through `onPointer`, and the
 * room finds its point in the picture's own units (the viewBox).
 */

const FONT = "'Egypt Hieroglyphs', 'Noto Sans Egyptian Hieroglyphs', serif";
export const VIEWBOX = { x: 100, y: 130, w: 640, h: 330 };

/** The figure, face up, head to the left: crown, brow, nose, lips, chin; chest, belly, hips, legs; the feet pointing up. */
export const BODY =
  'M196 286 C182 278 176 256 184 240 C190 230 198 226 204 226 C207 224 209 219 213 218 C216 218 217 223 218 226 C221 226 223 228 222 231 C226 231 230 231 233 234 C237 239 243 241 252 240 C264 238 272 232 292 230 C320 228 344 232 362 238 C390 244 420 242 440 242 C470 242 500 246 540 248 C570 250 598 250 612 248 C618 238 622 226 630 224 C638 224 640 232 638 244 C638 258 640 268 634 274 C600 278 560 280 520 280 C490 282 460 286 430 286 C380 288 320 290 270 286 C250 284 236 286 222 288 C212 290 202 289 196 286 Z';
/** The hair, over the back of the head. */
export const HAIR = 'M196 286 C182 278 176 256 184 240 C190 230 198 226 204 226 C203 236 204 246 210 256 C214 266 212 278 206 286 C202 288 199 288 196 286 Z';
/** The arm, lying along the side, the hand by the hip. */
export const ARM = 'M262 252 C300 258 360 262 404 262 C416 262 426 260 434 262 C440 264 438 270 430 270 C420 270 410 270 400 270 C356 270 300 268 262 262 Z';

/** The closed eye, and the ear. */
export const EYE = 'M206 233 Q210 230 214 233';
export const EAR = 'M214 252 C220 250 222 260 216 262';

/** The middle of each part of the body (ZONES), on its upper side: where dust, damp and oil show. */
const ZONE_MID = ZONES.map((z) => ({ x: (z.x0 + z.x1) / 2, y: 252 }));
/** The cut in the left side, which the natron goes in through. */
export const CUT = { x: 372, y: 262 };

export type BodyLook = {
  /** Parts still dusty, by index. */
  dust?: number[];
  /** The cut in the left side (the organs are out). */
  cut?: boolean;
  /** The cut held open, for natron to go inside. */
  open?: boolean;
  /** Dried in natron, 0–1: darker and a little shrunken. */
  dry?: number;
  /** Natron packed, by place (NATRON_PLACES), and places shown damp. */
  bags?: string[];
  damp?: string[];
  /** Oil rubbed into each part, 0–1. */
  oil?: number[];
  /** Passes of linen wound round the body so far. */
  passes?: number;
  /** Amulets tucked onto the first layer of linen. */
  amulets?: { id: string; glyph: string }[];
  own?: SavedAmulet | null;
  /** The body's outline before it dried, dashed, to show how it shrank. */
  ghost?: boolean;
};

export type HeldTools = {
  jug?: { x: number; y: number; pouring: boolean } | null;
  cloth?: { x: number; y: number } | null;
  roll?: { x: number; y: number; waiting: boolean } | null;
  /** Days passed in the natron, for the sun's path. */
  days?: number | null;
};

type Props = {
  look: BodyLook;
  tools?: HeldTools;
  onPointer?: (kind: 'down' | 'move' | 'up', e: PointerEvent<SVGSVGElement>) => void;
  children?: ReactNode;
};

/** The spots where amulets lie on the linen. */
const AMULET_SPOTS = [292, 452, 372, 532];

/** A band of linen for a pass: a slanting strip round the body at that point. */
function band(i: number) {
  const x = passX(i);
  const s = Math.floor(i / PASSES) % 2 === 0 ? 1 : -1;
  return `M${x - 44 - 16 * s} 206 L${x + 40 - 16 * s} 206 L${x + 44 + 16 * s} 304 L${x - 40 + 16 * s} 304 Z`;
}

const MummyScene = forwardRef<SVGSVGElement, Props>(function MummyScene({ look, tools = {}, onPointer, children }, ref) {
  const dry = look.dry ?? 0;
  // Dried in the natron, the body shrinks and darkens a little: the room's picture of the forty days.
  const shrink = `translate(${410 * 0.04 * dry} ${286 * 0.16 * dry}) scale(${1 - 0.04 * dry} ${1 - 0.16 * dry})`;
  const passes = look.passes ?? 0;
  const oil = look.oil ?? [];
  const firstLayer = Math.min(passes, PASSES);

  return (
    <svg
      ref={ref}
      className="egm-svg"
      viewBox={`${VIEWBOX.x} ${VIEWBOX.y} ${VIEWBOX.w} ${VIEWBOX.h}`}
      aria-hidden="true"
      onPointerDown={onPointer && ((e) => onPointer('down', e))}
      onPointerMove={onPointer && ((e) => onPointer('move', e))}
      onPointerUp={onPointer && ((e) => onPointer('up', e))}
      onPointerCancel={onPointer && ((e) => onPointer('up', e))}
    >
      <defs>
        <linearGradient id="egm-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5b3d22" />
          <stop offset="0.7" stopColor="#3e2814" />
          <stop offset="1" stopColor="#2a1b0e" />
        </linearGradient>
        <radialGradient id="egm-lamp" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="rgba(255, 200, 110, 0.5)" />
          <stop offset="1" stopColor="rgba(255, 200, 110, 0)" />
        </radialGradient>
        <linearGradient id="egm-skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c99066" />
          <stop offset="0.55" stopColor="#ad7448" />
          <stop offset="1" stopColor="#7d4f2e" />
        </linearGradient>
        <pattern id="egm-mat" width="16" height="16" patternUnits="userSpaceOnUse">
          <rect width="16" height="16" fill="#6b4a24" />
          <path d="M0 4 H16 M0 12 H16" stroke="#7d5a2e" strokeWidth="4" />
          <path d="M4 0 V4 M12 8 V12" stroke="#4e3418" strokeWidth="1.5" />
        </pattern>
        <pattern id="egm-linen" width="10" height="10" patternUnits="userSpaceOnUse">
          <rect width="10" height="10" fill="#efe5cc" />
          <path d="M0 3 H10 M0 8 H10" stroke="#d8caa6" strokeWidth="1" />
          <path d="M3 0 V10" stroke="#e2d6b6" strokeWidth="0.8" />
        </pattern>
        <pattern id="egm-salt" width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" fill="#f2f0ea" />
          <circle cx="2" cy="2" r="1.1" fill="#d6d2c7" />
          <circle cx="6" cy="6" r="0.9" fill="#cfcabf" />
        </pattern>
        <linearGradient id="egm-volume" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.1" stopColor="rgba(255, 255, 255, 0.18)" />
          <stop offset="0.5" stopColor="rgba(255, 255, 255, 0)" />
          <stop offset="1" stopColor="rgba(40, 24, 10, 0.4)" />
        </linearGradient>
        <linearGradient id="egm-sheen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgba(255, 220, 140, 0.95)" />
          <stop offset="0.45" stopColor="rgba(214, 150, 60, 0.35)" />
          <stop offset="1" stopColor="rgba(120, 70, 20, 0)" />
        </linearGradient>
        <clipPath id="egm-body">
          <path d={BODY} />
        </clipPath>
        {ZONES.map((z, i) => (
          <clipPath key={z.id} id={`egm-zone-${i}`}>
            <rect x={z.x0} y="200" width={z.x1 - z.x0} height="110" />
          </clipPath>
        ))}
      </defs>

      {/* ───── The workshop ───── */}
      <rect x="100" y="130" width="640" height="230" fill="url(#egm-wall)" />
      <g>
        <rect x="100" y="130" width="640" height="22" fill="#1d3f7c" />
        {Array.from({ length: 32 }, (_, i) => (
          <path key={i} d={`M${104 + i * 20} 152 L${104 + i * 20} 138 Q${114 + i * 20} 128 ${124 + i * 20} 138 L${124 + i * 20} 152 Z`} fill={['#c8402a', '#d9a441', '#2f7a4a'][i % 3]} stroke="#1a120a" strokeWidth="1" />
        ))}
        <rect x="100" y="152" width="640" height="4" fill="#d9a441" />
      </g>
      {/* a shelf of jars on each side of the jackal */}
      {[230, 536].map((x) => (
        <g key={x} opacity="0.85">
          <rect x={x - 54} y={196} width="108" height="5" fill="#2a1b0e" />
          {[-38, -12, 14, 38].map((dx, i) => {
            const h = 22 + (i % 2) * 5;
            return (
              <path
                key={dx}
                d={`M${x + dx - 8} 196 C${x + dx - 13} ${196 - h * 0.45} ${x + dx - 10} ${196 - h} ${x + dx} ${196 - h} C${x + dx + 10} ${196 - h} ${x + dx + 13} ${196 - h * 0.45} ${x + dx + 8} 196 Z`}
                fill={['#8a5a2b', '#c9b48a', '#6e4a2a', '#b99a62'][i]}
                stroke="#1a120a"
                strokeWidth="1"
              />
            );
          })}
        </g>
      ))}
      {/* Anubis, as a jackal lying down, painted on the wall */}
      <text x="383" y="212" fontFamily={FONT} fontSize="58" textAnchor="middle" className="egm-wall-jackal">
        {GLYPHS.E15}
      </text>
      <rect x="100" y="350" width="640" height="110" fill="url(#egm-mat)" />
      <rect x="100" y="348" width="640" height="4" fill="#2a1b0e" />
      {[128, 712].map((x) => (
        <g key={x}>
          <circle cx={x} cy={262} r={90} fill="url(#egm-lamp)" />
          <path d={`M${x} 348 L${x} 292`} stroke="#8a6a3a" strokeWidth="4" />
          <path d={`M${x - 14} 292 Q${x} 304 ${x + 14} 292 Z`} fill="#c99a3d" stroke="#5a3e18" strokeWidth="1.5" />
          <path className="egm-flame" d={`M${x} 270 C${x - 6} 280 ${x - 5} 290 ${x} 292 C${x + 5} 290 ${x + 6} 280 ${x} 270 Z`} fill="#ffcf6a" />
        </g>
      ))}

      {/* ───── The embalming bed, with a lion's head and lion's legs ───── */}
      <g className="egm-bed">
        <rect x="150" y="300" width="540" height="14" rx="3" fill="#8a5a2b" stroke="#4a2c12" strokeWidth="2" />
        <rect x="152" y="302" width="536" height="3" fill="#b07a3e" />
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

      {/* ───── The body ───── */}
      <g className="egm-figure" transform={shrink}>
        <path d={BODY} fill="url(#egm-skin)" stroke="#5e3a20" strokeWidth="2" />
        {/* darker as it dries */}
        {dry > 0 && <path d={BODY} fill="#3b2414" opacity={0.45 * dry} />}
        <path d={HAIR} fill="#1c1410" />
        <path d={ARM} fill="#a26a40" stroke="#5e3a20" strokeWidth="1.5" opacity="0.9" />
        <path d={EYE} fill="none" stroke="#2a1a0c" strokeWidth="1.6" strokeLinecap="round" />
        <path d={EAR} fill="none" stroke="#6e4529" strokeWidth="1.6" />
        <path className="egm-kilt" d="M418 244 C436 242 456 244 470 246 L472 282 C456 284 436 286 418 286 Z" />
        <path d="M424 254 L466 256 M424 266 L468 268" stroke="#d6cdb6" strokeWidth="1" />

        {/* the dust, until it is washed off */}
        {(look.dust ?? []).map((i) => (
          <g key={i} className="egm-dust">
            <ellipse cx={ZONE_MID[i].x} cy={ZONE_MID[i].y - 4} rx="26" ry="9" />
            <ellipse cx={ZONE_MID[i].x - 12} cy={ZONE_MID[i].y + 8} rx="12" ry="6" />
            <ellipse cx={ZONE_MID[i].x + 14} cy={ZONE_MID[i].y + 10} rx="9" ry="5" />
          </g>
        ))}

        {/* the cut in the left side, where the organs came out */}
        {look.cut && !look.open && <path className="egm-cut" d={`M${CUT.x - 16} ${CUT.y} q16 7 32 0`} />}

        {/* damp parts glisten */}
        {(look.damp ?? [])
          .filter((p) => p !== 'inside')
          .map((p) => (
            <g key={p} className="egm-damp">
              {[-18, 4, 20].map((dx, k) => (
                <ellipse key={dx} cx={ZONE_MID[ZONES.findIndex((z) => z.id === p)].x + dx} cy={240 + k * 9} rx={6 - k} ry={2.2} />
              ))}
            </g>
          ))}

        {/* oil and resin, rubbed in part by part */}
        {oil.map((c, i) =>
          c > 0 ? (
            <g key={i} clipPath={`url(#egm-zone-${i})`}>
              <path d={BODY} fill="url(#egm-sheen)" opacity={c} />
              {c >= 1 && <ellipse className="egm-glint" cx={ZONE_MID[i].x} cy={242} rx="14" ry="2.4" fill="#fff3c4" />}
            </g>
          ) : null,
        )}

        {/* the linen: the first layer, the amulets on it, then the second layer over them */}
        {passes > 0 && (
          <g clipPath="url(#egm-body)">
            {Array.from({ length: firstLayer }, (_, i) => (
              <path key={i} d={band(i)} fill="url(#egm-linen)" stroke="#b3a072" strokeWidth="2" />
            ))}
          </g>
        )}
        {(look.amulets ?? []).map((a, i) => {
          const x = AMULET_SPOTS[i % AMULET_SPOTS.length];
          return a.id === 'own' && look.own ? (
            <g key={i} className="egm-amulet">
              <AmuletArt idPrefix={`egm-own-${i}`} shape={look.own.shape} material={look.own.material} symbols={look.own.symbols} nameGlyphs={look.own.nameGlyphs} label="" place={{ x: x - 15, y: 236, width: 30, height: 36 }} />
            </g>
          ) : (
            <text key={i} className="egm-amulet" x={x} y={266} fontFamily={FONT} fontSize="26" textAnchor="middle">
              {a.glyph}
            </text>
          );
        })}
        {passes > PASSES && (
          <g clipPath="url(#egm-body)">
            {Array.from({ length: Math.min(passes, ALL_PASSES) - PASSES }, (_, k) => (
              <path key={k} d={band(PASSES + k)} fill="url(#egm-linen)" stroke="#b3a072" strokeWidth="2" opacity="0.88" />
            ))}
          </g>
        )}

        {passes > 0 && <path d={BODY} fill="url(#egm-volume)" />}
      </g>

      {/* the outline the body had before the natron dried it */}
      {look.ghost && <path d={BODY} fill="none" stroke="rgba(255, 236, 200, 0.55)" strokeWidth="1.5" strokeDasharray="5 5" />}

      {/* natron, heaped over each part of the body, and a bag inside it through the cut */}
      {(look.bags ?? [])
        .filter((p) => p !== 'inside')
        .map((p) => {
          const z = ZONES.find((x) => x.id === p)!;
          const mid = (z.x0 + z.x1) / 2;
          return (
            <g key={p} className="egm-bag">
              <path d={`M${z.x0 - 8} 296 C${z.x0 - 8} 266 ${z.x0 + 2} 226 ${mid} 222 C${z.x1 - 2} 226 ${z.x1 + 8} 266 ${z.x1 + 8} 296 Z`} fill="url(#egm-salt)" stroke="#bdb6a4" strokeWidth="1.5" />
              {dry > 0 && <path d={`M${z.x0 - 8} 296 C${z.x0 - 8} 266 ${z.x0 + 2} 226 ${mid} 222 C${z.x1 - 2} 226 ${z.x1 + 8} 266 ${z.x1 + 8} 296 Z`} fill="#8a7a5c" opacity={0.3 * dry} />}
              <path d={`M${mid - 18} 240 q8 -4 16 0 M${mid - 4} 262 q8 -4 16 0`} fill="none" stroke="#d6d2c7" strokeWidth="1.5" />
            </g>
          );
        })}
      {look.open && (
        <g>
          <ellipse cx={CUT.x} cy={CUT.y} rx="24" ry="8" fill="#3a1a10" stroke="#5a2a1c" strokeWidth="2" />
          {(look.bags ?? []).includes('inside') ? (
            <rect x={CUT.x - 15} y={CUT.y - 7} width="30" height="13" rx="6" fill="url(#egm-salt)" stroke="#bdb6a4" strokeWidth="1.2" />
          ) : (
            <g className="egm-damp">
              <ellipse cx={CUT.x - 6} cy={CUT.y - 2} rx="6" ry="2" />
              <ellipse cx={CUT.x + 9} cy={CUT.y + 1} rx="4" ry="1.5" />
            </g>
          )}
        </g>
      )}

      {/* ───── The sun's path over the forty days ───── */}
      {tools.days != null && (
        <g className="egm-sun">
          <path d="M150 196 Q420 120 690 196" fill="none" stroke="rgba(255, 207, 106, 0.25)" strokeWidth="2" strokeDasharray="4 6" />
          <circle cx={150 + 540 * (tools.days / 40)} cy={196 - 152 * (tools.days / 40) * (1 - tools.days / 40)} r="12" fill="#ffcf6a" />
        </g>
      )}

      {/* ───── The water jar, poured along the body ───── */}
      {tools.jug && (
        <g className="egm-jug" transform={`translate(${tools.jug.x} ${tools.jug.y})`}>
          {tools.jug.pouring && (
            <g className="egm-water">
              <path d="M-14 -2 C-16 14 -14 30 -12 46" />
              <path d="M-9 0 C-9 16 -7 30 -4 46" />
            </g>
          )}
          <g transform={tools.jug.pouring ? 'rotate(-35)' : undefined}>
            <path d="M-12 -2 C-22 -10 -22 -30 -12 -38 L-10 -46 L10 -46 L12 -38 C22 -30 22 -10 12 -2 Z" fill="#b8693a" stroke="#4a2c12" strokeWidth="2" />
            <path d="M-12 -2 L-18 2 L-12 -8" fill="#b8693a" stroke="#4a2c12" strokeWidth="1.5" />
            <path d="M-17 -30 L17 -30" stroke="#1d3f7c" strokeWidth="3" />
            <path d="M-10 -42 L10 -42" stroke="#e7c46a" strokeWidth="2" />
          </g>
        </g>
      )}

      {/* ───── The oil cloth, under the finger ───── */}
      {tools.cloth && (
        <g pointerEvents="none" transform={`translate(${tools.cloth.x} ${tools.cloth.y})`}>
          <path d="M-16 -10 C-6 -16 10 -14 16 -6 C18 4 8 12 -4 12 C-14 10 -20 0 -16 -10 Z" fill="#d9c48f" stroke="#8a6a3a" strokeWidth="1.5" />
          <path d="M-10 -4 q8 -4 16 0 M-8 4 q8 -4 14 0" fill="none" stroke="#b89a5c" strokeWidth="1.2" />
        </g>
      )}

      {/* ───── The linen roll, taken round and round the body ───── */}
      {tools.roll && (
        <g className={`egm-roll ${tools.roll.waiting ? 'is-off' : ''}`}>
          <path d={`M${tools.roll.x} ${tools.roll.y} L${tools.roll.x} ${tools.roll.y < 255 ? 234 : 280}`} stroke="#e9dfc6" strokeWidth="7" opacity="0.9" />
          <g transform={`translate(${tools.roll.x} ${tools.roll.y})`}>
            <rect x="-15" y="-12" width="30" height="24" rx="11" fill="url(#egm-linen)" stroke="#a89a7a" strokeWidth="2" />
            <ellipse cx="-15" cy="0" rx="4" ry="12" fill="#e9dfc6" stroke="#a89a7a" strokeWidth="1.5" />
            <circle cx="-15" cy="0" r="2" fill="#a89a7a" />
          </g>
          {!tools.roll.waiting &&
            (tools.roll.y < 255 ? (
              <path d={`M${tools.roll.x + 26} ${tools.roll.y + 6} l0 30 l-6 -6 m6 6 l6 -6`} className="egm-hint-arrow" />
            ) : (
              <path d={`M${tools.roll.x + 26} ${tools.roll.y - 6} l0 -30 l-6 6 m6 -6 l6 6`} className="egm-hint-arrow" />
            ))}
        </g>
      )}
      {children}
    </svg>
  );
});

export default MummyScene;
