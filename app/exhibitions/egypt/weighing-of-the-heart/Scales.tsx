import { GLYPHS } from '../rooms';
import { Ammit, Ani, Anubis, Feather, Heart, INK, Maat, Thoth, Tutu } from './HallArt';
import type { FigureId } from './judgement';

/*
 * The hall of judgement as a painted papyrus: a cream papyrus sheet with
 * its fibres, a painted border above and below, a row of signs along the
 * top (the gods, the heart and the feather, as decoration), and the figures
 * standing on one ground line (HallArt.tsx). From the left: Tutu and Ani,
 * heads bowed; Anubis at the scales; the great scales, with the heart in
 * one pan and the feather of Maat in the other; Thoth with his palette,
 * facing them; Ammit, sitting by; and Maat, seated at the end.
 *
 * The beam turns about its pivot; the pans hang beneath its ends, so they
 * move by translation. It starts level. CSS carries the movement smoothly,
 * and stands still under reduced motion. A figure the visitor is meeting is
 * lit, the others dim a little.
 *
 * The papyrus can be rolled up: `unrolled` (0 to 1) is how much of the
 * sheet shows, with the roll itself at its edge, so the room can open by
 * unrolling Ani's papyrus.
 */

export const HALL_W = 1100;
export const HALL_H = 420;
const GROUND = 380;
const PIVOT = { x: 480, y: 136 };
const ARM = 112;
const HANG = 118;
const FONT = "'Egypt Hieroglyphs', 'Noto Sans Egyptian Hieroglyphs', serif";

/** Where each figure stands, and the box the room puts its "meet" button over ([x, y, width, height] in the hall's units). */
export const FIGURE_SPOTS: Record<FigureId, { x: number; scale: number; flip?: boolean; box: [number, number, number, number] }> = {
  ani: { x: 165, scale: 1.12, box: [40, 80, 205, 300] },
  anubis: { x: 300, scale: 1.12, box: [258, 60, 92, 320] },
  thoth: { x: 700, scale: 1.12, flip: true, box: [618, 80, 112, 300] },
  ammit: { x: 875, scale: 0.95, flip: true, box: [742, 250, 226, 130] },
  maat: { x: 1022, scale: 1.05, flip: true, box: [956, 130, 140, 250] },
};

/** Where the heart's pan hangs when the scales are level (for its drop target), in the hall's units. */
export const HEART_PAN = { x: PIVOT.x - ARM, y: PIVOT.y + HANG };

function AniAndTutu() {
  return (
    <>
      <g transform="translate(-95 0)">
        <Tutu />
      </g>
      <Ani />
    </>
  );
}

const FIGURE_ART: Record<FigureId, () => React.ReactElement> = {
  ani: AniAndTutu,
  anubis: Anubis,
  thoth: Thoth,
  ammit: Ammit,
  maat: Maat,
};

export default function Scales({
  tilt,
  heart,
  wrongs = 0,
  focus = null,
  glow = [],
  balanced = false,
  unrolled = 1,
  label,
}: {
  /** Degrees; positive, the heart's side down. 0 is level. */
  tilt: number;
  /** Whether a heart is on the scales. */
  heart: boolean;
  /** Wrongs laid on the heart's side (the rule, tried out). */
  wrongs?: number;
  /** The figure being met: lit, the others dimmed. */
  focus?: FigureId | null;
  /** Figures to light softly, as an invitation to tap them. */
  glow?: FigureId[];
  /** The verdict is given: the papyrus warms. */
  balanced?: boolean;
  /** How much of the papyrus is unrolled, 0 to 1. */
  unrolled?: number;
  label: string;
}) {
  const rad = (tilt * Math.PI) / 180;
  const dx = ARM * (1 - Math.cos(rad));
  const dy = ARM * Math.sin(rad);
  const edge = 30 + Math.max(0, Math.min(1, unrolled)) * (HALL_W - 30);

  return (
    <svg className="egw-svg" viewBox={`0 0 ${HALL_W} ${HALL_H}`} role="img" aria-label={label} data-tilt={tilt}>
      <defs>
        <linearGradient id="egw-paper" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f3e5bf" />
          <stop offset="0.55" stopColor="#ecd9a8" />
          <stop offset="1" stopColor="#dfc58c" />
        </linearGradient>
        <linearGradient id="egw-roll" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#a98a4e" />
          <stop offset="0.45" stopColor="#f0dfb2" />
          <stop offset="1" stopColor="#8c6e38" />
        </linearGradient>
        <pattern id="egw-fibres" width="40" height="18" patternUnits="userSpaceOnUse">
          <path d="M0 4 H40 M0 11 H40" stroke="#c9ad74" strokeWidth="0.8" opacity="0.5" />
          <path d="M12 0 V18 M31 0 V18" stroke="#d8bf8a" strokeWidth="0.6" opacity="0.4" />
        </pattern>
        <clipPath id="egw-shown">
          <rect x="0" y="0" width={edge} height={HALL_H} />
        </clipPath>
      </defs>

      <g clipPath="url(#egw-shown)">
        {/* The sheet: fibres, the warm light of the verdict, the borders */}
        <rect x="0" y="0" width={HALL_W} height={HALL_H} fill="url(#egw-paper)" />
        <rect x="0" y="0" width={HALL_W} height={HALL_H} fill="url(#egw-fibres)" />
        <rect className={`egw-warm${balanced ? ' is-on' : ''}`} x="0" y="0" width={HALL_W} height={HALL_H} fill="#f2b84a" />
        <Border y={4} />
        <Border y={GROUND + 8} />
        <line x1="0" y1={GROUND} x2={HALL_W} y2={GROUND} stroke={INK} strokeWidth="3" />

        {/* A row of signs along the top, as decoration: the gods, the heart, the feather */}
        <text className="egw-glyph-line" x={HALL_W / 2} y="52" textAnchor="middle" fontFamily={FONT} fontSize="28" aria-hidden="true">
          {[GLYPHS.S34, GLYPHS.C6, GLYPHS.F34, GLYPHS.H6, GLYPHS.C10, GLYPHS.C3, GLYPHS.S34].join('   ')}
        </text>

        {/* The figures */}
        {(Object.keys(FIGURE_SPOTS) as FigureId[]).map((f) => {
          const s = FIGURE_SPOTS[f];
          const Art = FIGURE_ART[f];
          const cls = focus ? (focus === f ? 'is-lit' : 'is-dim') : glow.includes(f) ? 'is-glow' : '';
          return (
            <g key={f} className={`egw-figure ${cls}`} data-figure={f} transform={`translate(${s.x} ${GROUND}) scale(${s.flip ? -s.scale : s.scale} ${s.scale})`}>
              <Art />
            </g>
          );
        })}

        {/* The scales: a green stand, a painted post, the beam on its pivot */}
        <g className="egw-scales">
          <path d={`M${PIVOT.x - 34} ${GROUND} L${PIVOT.x + 34} ${GROUND} L${PIVOT.x + 20} ${GROUND - 14} L${PIVOT.x - 20} ${GROUND - 14} Z`} fill="#3f7d4c" stroke={INK} strokeWidth="2.4" />
          <rect x={PIVOT.x - 7} y={PIVOT.y} width="14" height={GROUND - 14 - PIVOT.y} fill="#d9a441" stroke={INK} strokeWidth="2.4" />
          {[0.3, 0.55, 0.8].map((t) => (
            <line key={t} x1={PIVOT.x - 7} x2={PIVOT.x + 7} y1={PIVOT.y + t * (GROUND - PIVOT.y)} y2={PIVOT.y + t * (GROUND - PIVOT.y)} stroke="#2f5f9e" strokeWidth="4" />
          ))}
          <g className="egw-beam" style={{ transform: `rotate(${-tilt}deg)`, transformOrigin: `${PIVOT.x}px ${PIVOT.y}px` }}>
            <rect x={PIVOT.x - ARM - 6} y={PIVOT.y - 4} width={2 * ARM + 12} height="8" rx="2" fill="#d9a441" stroke={INK} strokeWidth="2.4" />
            <line x1={PIVOT.x} y1={PIVOT.y + 4} x2={PIVOT.x} y2={PIVOT.y + 40} stroke={INK} strokeWidth="2" />
          </g>
          <circle cx={PIVOT.x} cy={PIVOT.y} r="9" fill="#b23a2a" stroke={INK} strokeWidth="2.4" />
          {/* the heart's pan (left) and the feather's pan (right) */}
          <g className="egw-pan" style={{ transform: `translate(${dx}px, ${dy}px)` }}>
            <Pan x={PIVOT.x - ARM}>
              {heart && (
                <g transform={`translate(${wrongs ? -12 : 0} -18) scale(1.3)`}>
                  <g className="egw-heart">
                    <Heart />
                  </g>
                </g>
              )}
              {Array.from({ length: wrongs }, (_, i) => (
                <g key={i} className="egw-wrong" transform={`translate(${(heart ? 20 : 0) + i * 10} -6)`}>
                  <Wrong />
                </g>
              ))}
            </Pan>
          </g>
          <g className="egw-pan" style={{ transform: `translate(${-dx}px, ${-dy}px)` }}>
            <Pan x={PIVOT.x + ARM}>
              <g transform="translate(-4 -2)">
                <Feather />
              </g>
            </Pan>
          </g>
        </g>
      </g>

      {/* The roll, at the edge of what is unrolled */}
      {unrolled < 1 && (
        <g className="egw-roll" transform={`translate(${edge} 0)`}>
          <rect x="-14" y="0" width="36" height={HALL_H} rx="14" fill="url(#egw-roll)" stroke="#6b5226" strokeWidth="2" />
          <path d={`M-4 ${HALL_H / 2 - 26} l16 26 l-16 26`} fill="none" stroke="#5a3d12" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" className="egw-roll-arrow" />
        </g>
      )}
    </svg>
  );
}

/** A pan of the scales, hung by three cords from the beam's end. */
function Pan({ x, children }: { x: number; children?: React.ReactNode }) {
  const y = PIVOT.y + HANG;
  return (
    <g>
      <path d={`M${x} ${PIVOT.y} L${x - 40} ${y} M${x} ${PIVOT.y} L${x + 40} ${y} M${x} ${PIVOT.y} L${x} ${y}`} stroke={INK} strokeWidth="1.8" />
      <path d={`M${x - 46} ${y} Q${x} ${y + 26} ${x + 46} ${y} Z`} fill="#d9a441" stroke={INK} strokeWidth="2.4" />
      <g transform={`translate(${x} ${y})`}>{children}</g>
    </g>
  );
}

/** A wrong, for trying out the rule: a dark stone with a cross on it. */
export function Wrong() {
  return (
    <g>
      <path d="M-13 0 C-15 -12 -6 -20 2 -19 C12 -18 16 -10 14 0 Z" fill="#4a4038" stroke={INK} strokeWidth="2" />
      <path d="M-5 -13 L5 -5 M5 -13 L-5 -5" stroke="#efe6d2" strokeWidth="2.4" strokeLinecap="round" />
    </g>
  );
}

/** A painted border: a row of coloured blocks, as above and below a papyrus scene. */
function Border({ y }: { y: number }) {
  return (
    <g>
      <rect x="0" y={y} width={HALL_W} height="20" fill="#f6efdc" stroke={INK} strokeWidth="1.5" />
      {Array.from({ length: 55 }, (_, i) => (
        <rect key={i} x={i * 20 + 3} y={y + 4} width="14" height="12" fill={['#2f5f9e', '#b23a2a', '#3f7d4c', '#d9a441'][i % 4]} />
      ))}
    </g>
  );
}
