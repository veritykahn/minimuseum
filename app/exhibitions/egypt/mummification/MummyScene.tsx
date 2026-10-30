import { GLYPHS } from '../rooms';
import { JARS, LAYERS, type StepId } from './steps';

/*
 * The embalmers' table, drawn simply in SVG: the body lies on a lion-legged
 * bed, under a sheet until the oils; then it is a plain silhouette, never
 * anything more. The natron heaps over it, the linen goes on in layers with
 * the amulets tucked between them, and at the end the coffin closes over it.
 * The four canopic jars stand beside the bed from their step on, each
 * crowned with its god's head (the hieroglyphs for a man's head, a baboon,
 * a jackal and a falcon), filled as the visitor matches the organs.
 */

const BODY =
  'M150 262 C150 234 172 220 198 222 C218 224 230 232 246 238 L596 240 C636 242 660 252 660 264 C660 276 636 286 596 288 L246 290 C230 296 218 304 198 306 C172 308 150 292 150 262 Z';
const FONT = "'Egypt Hieroglyphs', 'Noto Sans Egyptian Hieroglyphs', serif";

const AMULET_SPOTS = [
  { x: 300, y: 262 },
  { x: 420, y: 262 },
  { x: 540, y: 262 },
  { x: 360, y: 262 },
  { x: 480, y: 262 },
  { x: 600, y: 262 },
];

export default function MummyScene({
  step,
  filled,
  layers,
  amulets,
}: {
  step: StepId;
  /** The jars matched so far, by god. */
  filled: string[];
  layers: number;
  /** The amulets tucked in, each with the layer it went under. */
  amulets: { glyph: string; layer: number }[];
}) {
  const order: StepId[] = ['why', 'wash', 'organs', 'natron', 'oils', 'wrap', 'coffin'];
  const at = order.indexOf(step);
  const sheet = at <= order.indexOf('natron');
  const oiled = at >= order.indexOf('oils');
  const showJars = at >= order.indexOf('organs');
  const wrapped = step === 'coffin' ? LAYERS : step === 'wrap' ? layers : 0;

  return (
    <svg className="egm-svg" viewBox="100 150 640 290" aria-hidden="true" data-step={step}>
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
      </defs>

      {/* The bed, with lion legs */}
      <g className="egm-bed">
        <rect x="120" y="306" width="580" height="16" rx="4" />
        <path d="M150 322 L150 380 L170 380 L176 322 Z" />
        <path d="M640 322 L646 380 L668 380 L668 322 Z" />
        <path d="M688 300 C710 292 722 300 720 316 L700 316 Z" />
      </g>

      {/* The body: a silhouette, under a sheet until the oils */}
      <path className={`egm-body ${oiled ? 'is-oiled' : ''}`} d={BODY} />
      {sheet && <path className="egm-sheet" d="M232 236 L600 236 C640 240 664 252 664 266 C664 280 640 290 600 292 L232 298 C224 280 224 254 232 236 Z" />}

      {step === 'wash' && (
        <g className="egm-water">
          {[220, 300, 380, 460, 540, 620].map((x, i) => (
            <line key={x} x1={x} y1={150} x2={x - 6} y2={176} style={{ animationDelay: `${i * 0.18}s` }} />
          ))}
        </g>
      )}

      {step === 'natron' && <path className="egm-natron" d="M136 300 C150 214 230 196 300 204 C400 190 520 196 600 206 C660 214 690 250 684 300 Z" fill="url(#egm-salt)" />}

      {/* The linen, layer by layer, with the amulets tucked under each */}
      {wrapped > 0 && (
        <g clipPath="url(#egm-body)">
          {Array.from({ length: wrapped }, (_, i) => (
            <rect key={i} className="egm-layer" x="140" y="200" width="540" height="120" fill={i % 2 ? 'url(#egm-linen-2)' : 'url(#egm-linen)'} style={{ opacity: 0.62 + i * 0.1 }} />
          ))}
        </g>
      )}
      {step === 'wrap' &&
        amulets.map((a, i) => {
          const spot = AMULET_SPOTS[i % AMULET_SPOTS.length];
          const covered = layers > a.layer;
          return (
            <text key={i} className={`egm-amulet ${covered ? 'is-covered' : ''}`} x={spot.x} y={spot.y + 12} fontFamily={FONT} fontSize="34" textAnchor="middle">
              {a.glyph}
            </text>
          );
        })}

      {step === 'coffin' && (
        <g className="egm-coffin">
          <path d="M140 262 C140 222 170 206 204 208 C226 210 240 220 256 228 L604 228 C650 230 676 246 676 264 C676 282 650 298 604 300 L256 300 C240 308 226 318 204 320 C170 322 140 304 140 262 Z" />
          <circle cx="196" cy="262" r="26" className="egm-coffin-face" />
          <path d="M256 240 L600 240 M256 288 L600 288" className="egm-coffin-band" />
          <text x="430" y="276" fontFamily={FONT} fontSize="40" textAnchor="middle" className="egm-coffin-glyph">
            {GLYPHS.S34}
            {GLYPHS.R11}
            {GLYPHS.S34}
          </text>
        </g>
      )}

      {/* The canopic jars */}
      {showJars && (
        <g className="egm-jars">
          {JARS.map((j, i) => {
            const x = 250 + i * 100;
            const full = filled.includes(j.god) || at > order.indexOf('organs');
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
}
