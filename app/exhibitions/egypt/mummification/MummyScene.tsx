import { forwardRef } from 'react';
import { GLYPHS } from '../rooms';
import { JARS, LAYERS, type StepId } from './steps';

/*
 * The embalmers' table, drawn simply in SVG: a figure in the Egyptian
 * manner lying face up on a lion-legged bed, head to the left, in a white
 * kilt. It changes as the work goes on, each state built on the last:
 *
 *   dusty → washed → the brain out through the nose → the cut on the left
 *   side → covered in bags of natron → dried and shrunken → oiled, glossy →
 *   wrapped layer by layer, with the visitor's amulets → in its coffin.
 *
 * The four canopic jars stand beside the bed from their step on, each
 * crowned with its god's head (the hieroglyphs for a man's head, a baboon,
 * a jackal and a falcon), filled as the visitor matches the organs. The
 * heart stays inside, drawn small on the chest, for the visitor to notice.
 * The wash patches and natron spots are in the SVG's own units, so the room
 * can find them under a finger (MummyScene's ref is the <svg>).
 */

const FONT = "'Egypt Hieroglyphs', 'Noto Sans Egyptian Hieroglyphs', serif";

/** The figure, face up: head, neck, chest, hips, legs, feet. */
const BODY =
  'M178 258 C178 236 194 226 212 226 C224 226 232 232 236 241 L250 243 C272 236 310 233 344 234 C384 236 410 238 432 243 C480 247 560 248 606 250 L620 236 C628 230 638 234 637 245 L636 262 C632 271 620 273 606 270 C560 272 480 273 432 275 C410 280 382 282 344 282 C306 282 270 280 250 274 L236 276 C230 286 222 290 210 290 C192 290 178 280 178 258 Z';
const NOSE = 'M203 229 C204 221 213 220 216 229 Z';

/** Where the dust lies until it is washed off, in the SVG's units. */
export const WASH_PATCHES = [
  { x: 214, y: 262 },
  { x: 300, y: 252 },
  { x: 372, y: 264 },
  { x: 468, y: 256 },
  { x: 540, y: 262 },
  { x: 604, y: 256 },
];

/** Where the bags of natron are packed, inside and outside the body. */
export const NATRON_SPOTS = [
  { x: 230, y: 216 },
  { x: 320, y: 214 },
  { x: 400, y: 218 },
  { x: 360, y: 258 },
  { x: 500, y: 228 },
  { x: 590, y: 232 },
];

const AMULET_SPOTS = [300, 420, 540, 360, 480, 600];

export type MummyState = {
  step: StepId;
  /** The wash patches still dusty, by index. */
  dusty: number[];
  brainOut: boolean;
  /** The jars matched so far, by god. */
  filled: string[];
  /** Bags of natron packed (0–6), and whether the forty days are over. */
  packed: number;
  dried: boolean;
  /** Coats of oil (0–3). */
  oiled: number;
  layers: number;
  /** The amulets tucked in, each with the layer it went under. */
  amulets: { glyph: string; layer: number }[];
  /** At the end: the mummy laid in its coffin, and the lid closed. */
  inCoffin: boolean;
  closed: boolean;
  /** Ask the visitor to look for the heart (it glows). */
  showHeart: boolean;
};

const MummyScene = forwardRef<SVGSVGElement, { s: MummyState; onSpot?: (kind: 'natron', i: number) => void }>(function MummyScene({ s, onSpot }, ref) {
  const order: StepId[] = ['why', 'wash', 'brain', 'organs', 'natron', 'oils', 'wrap', 'coffin'];
  const at = order.indexOf(s.step);
  const past = (id: StepId) => at > order.indexOf(id);
  const washing = s.step === 'wash';
  const dusty = s.step === 'why' ? WASH_PATCHES.map((_, i) => i) : washing ? s.dusty : [];
  const cut = at >= order.indexOf('organs');
  const showJars = at >= order.indexOf('organs');
  const dried = s.dried || past('natron');
  const oil = past('oils') ? 3 : s.step === 'oils' ? s.oiled : 0;
  const wrapped = s.step === 'coffin' ? LAYERS : s.step === 'wrap' ? s.layers : 0;
  const brainShown = s.step === 'brain';

  return (
    <svg ref={ref} className="egm-svg" viewBox="100 150 640 290" aria-hidden="true" data-step={s.step}>
      <defs>
        <clipPath id="egm-body">
          <path d={BODY} />
        </clipPath>
        <pattern id="egm-linen" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(28)">
          <rect width="18" height="18" fill="#e9dfc6" />
          <line x1="0" y1="0" x2="0" y2="18" stroke="#c8b892" strokeWidth="3" />
        </pattern>
        <pattern id="egm-linen-2" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(-28)">
          <rect width="18" height="18" fill="#efe6cf" />
          <line x1="0" y1="0" x2="0" y2="18" stroke="#cdbd97" strokeWidth="3" />
        </pattern>
        <pattern id="egm-salt" width="10" height="10" patternUnits="userSpaceOnUse">
          <rect width="10" height="10" fill="#f2f0ea" />
          <circle cx="3" cy="3" r="1.3" fill="#d6d2c7" />
          <circle cx="8" cy="7" r="1" fill="#cfcabf" />
        </pattern>
        <linearGradient id="egm-sheen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgba(255,226,150,0.85)" />
          <stop offset="0.45" stopColor="rgba(255,226,150,0)" />
        </linearGradient>
      </defs>

      {/* The bed, with lion legs */}
      <g className="egm-bed">
        <rect x="120" y="306" width="580" height="16" rx="4" />
        <path d="M150 322 L150 380 L170 380 L176 322 Z" />
        <path d="M640 322 L646 380 L668 380 L668 322 Z" />
        <path d="M688 300 C710 292 722 300 720 316 L700 316 Z" />
      </g>

      {/* The body: dried, it shrinks a little and darkens; oiled, it shines */}
      {!s.closed && (
        <g className="egm-figure" style={{ transform: dried ? 'scaleY(0.86)' : undefined, transformOrigin: '400px 262px' }}>
          <path className={`egm-body ${dried ? 'is-dried' : ''} ${oil > 0 ? 'is-oiled' : ''}`} d={BODY} />
          <path className={`egm-body ${dried ? 'is-dried' : ''} ${oil > 0 ? 'is-oiled' : ''}`} d={NOSE} />
          {oil > 0 && <path d={BODY} fill="url(#egm-sheen)" style={{ opacity: oil / 3 }} />}
          {/* The arm along the side, the eye, the kilt */}
          <path className="egm-limb" d="M252 262 C300 268 360 268 412 262" />
          <circle cx="206" cy="242" r="2.6" className="egm-eye" />
          <path className="egm-kilt" d="M410 240 L452 244 L452 276 L410 280 Z" />
          {/* The dust, until it is washed away */}
          {dusty.map((i) => (
            <ellipse key={i} className="egm-dust" cx={WASH_PATCHES[i].x} cy={WASH_PATCHES[i].y} rx="26" ry="11" />
          ))}
          {/* The cut on the left side, where the organs came out */}
          {cut && <path className="egm-cut" d="M350 266 q14 6 30 0" />}
          {/* The heart, left inside */}
          {cut && !wrapped && !s.inCoffin && (
            <text className={`egm-heart ${s.showHeart ? 'is-shown' : ''}`} x="322" y="258" fontFamily={FONT} fontSize="18" textAnchor="middle">
              {GLYPHS.F34}
            </text>
          )}
        </g>
      )}

      {/* The brain, leaving through the nose: a grey shape that rises and is gone */}
      {brainShown && (
        <g className={`egm-brain ${s.brainOut ? 'is-out' : ''}`}>
          <path className="egm-hook" d="M212 150 L212 214 q0 8 -6 8" />
          <ellipse className="egm-brain-shape" cx="212" cy="238" rx="12" ry="8" />
        </g>
      )}

      {s.step === 'wash' && s.dusty.length > 0 && (
        <g className="egm-water">
          {[220, 300, 380, 460, 540, 620].map((x, i) => (
            <line key={x} x1={x} y1={150} x2={x - 6} y2={176} style={{ animationDelay: `${i * 0.18}s` }} />
          ))}
        </g>
      )}

      {/* The natron: a spot for each bag, filled as it is packed; a heap over all once the forty days begin */}
      {s.step === 'natron' && !s.dried && (
        <g className="egm-natron-spots">
          {NATRON_SPOTS.map((p, i) =>
            i < s.packed ? (
              <rect key={i} className="egm-bag" x={p.x - 22} y={p.y - 14} width="44" height="28" rx="10" fill="url(#egm-salt)" />
            ) : (
              <circle key={i} className="egm-spot" cx={p.x} cy={p.y} r="16" onClick={() => onSpot?.('natron', i)} />
            ),
          )}
        </g>
      )}

      {/* The linen, layer by layer, with the amulets tucked under each */}
      {wrapped > 0 && !s.closed && (
        <g clipPath="url(#egm-body)" style={{ transform: 'scaleY(0.86)', transformOrigin: '400px 262px' }}>
          {Array.from({ length: wrapped }, (_, i) => (
            <rect key={i} className="egm-layer" x="140" y="200" width="540" height="120" fill={i % 2 ? 'url(#egm-linen-2)' : 'url(#egm-linen)'} style={{ opacity: 0.62 + i * 0.1 }} />
          ))}
        </g>
      )}
      {s.step === 'wrap' &&
        s.amulets.map((a, i) => (
          <text key={i} className={`egm-amulet ${s.layers > a.layer ? 'is-covered' : ''}`} x={AMULET_SPOTS[i % AMULET_SPOTS.length]} y={272} fontFamily={FONT} fontSize="30" textAnchor="middle">
            {a.glyph}
          </text>
        ))}

      {/* The coffin: open beneath the mummy, then its lid with a painted face */}
      {s.step === 'coffin' && s.inCoffin && (
        <g className="egm-coffin">
          {s.closed ? (
            <>
              <path d="M140 262 C140 222 170 206 204 208 C226 210 240 220 256 228 L604 228 C650 230 676 246 676 264 C676 282 650 298 604 300 L256 300 C240 308 226 318 204 320 C170 322 140 304 140 262 Z" />
              <circle cx="196" cy="262" r="26" className="egm-coffin-face" />
              <path d="M256 240 L600 240 M256 288 L600 288" className="egm-coffin-band" />
              <text x="430" y="276" fontFamily={FONT} fontSize="40" textAnchor="middle" className="egm-coffin-glyph">
                {GLYPHS.S34}
                {GLYPHS.R11}
                {GLYPHS.S34}
              </text>
            </>
          ) : (
            <path className="egm-coffin-open" d="M140 280 C150 296 176 304 204 304 L604 300 C650 298 676 290 676 276" />
          )}
        </g>
      )}

      {/* The canopic jars */}
      {showJars && (
        <g className="egm-jars">
          {JARS.map((j, i) => {
            const x = 250 + i * 100;
            const full = s.filled.includes(j.god) || past('organs');
            return (
              <g key={j.god} className={`egm-jar ${full ? 'is-full' : ''}`}>
                <path d={`M${x - 26} 368 C${x - 34} 400 ${x - 24} 432 ${x} 432 C${x + 24} 432 ${x + 34} 400 ${x + 26} 368 Z`} />
                <text x={x} y={366} fontFamily={FONT} fontSize="38" textAnchor="middle" className="egm-jar-head">
                  {GLYPHS[j.glyph]}
                </text>
              </g>
            );
          })}
        </g>
      )}
    </svg>
  );
});

export default MummyScene;
