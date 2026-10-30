import { GLYPHS } from '../rooms';

/*
 * The hall of judgement, drawn in SVG: the great scales in gold, Ani's heart
 * in one pan and the feather of Maat in the other; jackal-headed Anubis at
 * the scales, ibis-headed Thoth with his palette, Maat seated by her feather,
 * and Ammit crouched at the side. The figures are hieroglyphs (rooms.ts):
 * the gods as the script itself draws them. Ammit, who has no sign of her
 * own, is the crocodile, her head.
 *
 * The beam turns about its pivot; the pans hang level beneath its ends, so
 * they move by translation. CSS carries both, smoothly, and stands still
 * under reduced motion.
 */

const PIVOT = { x: 400, y: 128 };
const ARM = 232;

export default function Scales({ tilt, closeness, verdict }: { tilt: number; closeness: number; verdict: 'weighing' | 'balanced' | 'heavy' }) {
  const rad = (tilt * Math.PI) / 180;
  // The heart's end goes down by ARM·sin and in by ARM·(1 − cos); the feather's end the opposite.
  const dy = ARM * Math.sin(rad);
  const dx = ARM * (1 - Math.cos(rad));
  const font = "'Egypt Hieroglyphs', 'Noto Sans Egyptian Hieroglyphs', serif";

  return (
    <svg className="egw-svg" viewBox="0 0 800 540" aria-hidden="true" data-verdict={verdict}>
      <defs>
        <radialGradient id="egw-glow" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="rgba(217,164,65,0.28)" />
          <stop offset="100%" stopColor="rgba(217,164,65,0)" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="800" height="540" fill="url(#egw-glow)" />
      <line x1="40" y1="500" x2="760" y2="500" stroke="rgba(239,235,229,0.35)" strokeWidth="2" />

      {/* The stand */}
      <g className="egw-gold" fill="currentColor" stroke="currentColor">
        <rect x={PIVOT.x - 7} y={PIVOT.y} width="14" height={500 - PIVOT.y} stroke="none" />
        <path d={`M ${PIVOT.x - 60} 500 L ${PIVOT.x} 470 L ${PIVOT.x + 60} 500 Z`} stroke="none" />
        <circle cx={PIVOT.x} cy={PIVOT.y - 18} r="12" stroke="none" />
      </g>

      {/* The beam */}
      <g className="egw-beam" style={{ transform: `rotate(${-tilt}deg)`, transformOrigin: `${PIVOT.x}px ${PIVOT.y}px` }}>
        <rect className="egw-gold-fill" x={PIVOT.x - ARM} y={PIVOT.y - 5} width={ARM * 2} height="10" rx="5" />
        <path className="egw-gold-fill" d={`M ${PIVOT.x} ${PIVOT.y} L ${PIVOT.x - 8} ${PIVOT.y + 40} L ${PIVOT.x + 8} ${PIVOT.y + 40} Z`} />
      </g>

      {/* The heart's pan */}
      <g className="egw-pan" style={{ transform: `translate(${dx}px, ${dy}px)` }}>
        <Pan x={PIVOT.x - ARM} y={PIVOT.y} />
        <text className="egw-heart" x={PIVOT.x - ARM} y={PIVOT.y + 154} fontFamily={font} fontSize="84" textAnchor="middle">
          {GLYPHS.F34}
        </text>
      </g>
      {/* The feather's pan */}
      <g className="egw-pan" style={{ transform: `translate(${-dx}px, ${-dy}px)` }}>
        <Pan x={PIVOT.x + ARM} y={PIVOT.y} />
        <text className="egw-feather" x={PIVOT.x + ARM} y={PIVOT.y + 154} fontFamily={font} fontSize="92" textAnchor="middle">
          {GLYPHS.H6}
        </text>
      </g>

      {/* The gods */}
      <g fontFamily={font} textAnchor="middle" className="egw-figures">
        <text x="250" y="490" fontSize="128" className="egw-anubis">{GLYPHS.C6}</text>
        <text x="600" y="490" fontSize="128" className="egw-thoth">{GLYPHS.C3}</text>
        <text x="505" y="490" fontSize="84" className="egw-maat">{GLYPHS.C10}</text>
        <g className="egw-ammit" style={{ transform: `translateX(${-closeness * 26}px)` }}>
          <text x="735" y="492" fontSize="96">{GLYPHS.I3}</text>
          <circle className="egw-eye" cx="700" cy="458" r="3.5" />
        </g>
      </g>
      <g className="egw-names" fontSize="17" textAnchor="middle">
        <text x="250" y="525">Anubis</text>
        <text x="505" y="525">Maat</text>
        <text x="600" y="525">Thoth</text>
        <text x={735 - closeness * 26} y="525" className="egw-ammit-name">Ammit</text>
      </g>
    </svg>
  );
}

function Pan({ x, y }: { x: number; y: number }) {
  return (
    <g className="egw-pan-shape">
      <line x1={x} y1={y} x2={x - 52} y2={y + 158} />
      <line x1={x} y1={y} x2={x + 52} y2={y + 158} />
      <path d={`M ${x - 64} ${y + 158} Q ${x} ${y + 196} ${x + 64} ${y + 158} Z`} />
    </g>
  );
}
