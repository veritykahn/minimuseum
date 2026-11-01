import { GLYPHS } from '../rooms';
import type { FigureId } from './judgement';

/*
 * The hall of judgement, drawn in SVG: the great scales in gold, Ani's
 * heart in one pan and the feather of Maat in the other; Ani and his wife
 * Tutu, heads bowed, on the left; jackal-headed Anubis at the scales,
 * ibis-headed Thoth with his palette, Maat seated by her feather, and Ammit
 * crouched at the side. The gods are hieroglyphs (rooms.ts), as the script
 * itself draws them. Ammit has no sign of her own, so she is drawn as the
 * British Museum describes her in Ani's papyrus: the head of a crocodile,
 * the front of a lion, the back of a hippopotamus. She is drawn plainly,
 * not to frighten.
 *
 * The beam turns about its pivot; the pans hang level beneath its ends, so
 * they move by translation. It starts level. CSS carries the movement
 * smoothly, and stands still under reduced motion. A figure the visitor is
 * meeting is lit; the others dim a little.
 */

const PIVOT = { x: 400, y: 128 };
const ARM = 232;
const FONT = "'Egypt Hieroglyphs', 'Noto Sans Egyptian Hieroglyphs', serif";

export default function Scales({
  tilt,
  heart,
  focus,
  balanced,
}: {
  /** Degrees; positive, the heart's side down. 0 is level. */
  tilt: number;
  /** Whether Ani's heart is on the scales yet. */
  heart: boolean;
  focus: FigureId | null;
  /** The verdict is given: the hall warms to gold. */
  balanced: boolean;
}) {
  const rad = (tilt * Math.PI) / 180;
  // The heart's end goes down by ARM·sin and in by ARM·(1 − cos); the feather's end the opposite.
  const dy = ARM * Math.sin(rad);
  const dx = ARM * (1 - Math.cos(rad));
  const dim = (id: FigureId) => (focus && focus !== id ? 'is-dim' : focus === id ? 'is-focus' : '');

  return (
    <svg className="egw-svg" viewBox="0 0 800 540" aria-hidden="true" data-tilt={tilt} data-balanced={balanced}>
      <defs>
        <radialGradient id="egw-glow" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor={balanced ? 'rgba(217,164,65,0.45)' : 'rgba(217,164,65,0.28)'} />
          <stop offset="100%" stopColor="rgba(217,164,65,0)" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="800" height="540" fill="url(#egw-glow)" />
      <line x1="20" y1="500" x2="780" y2="500" stroke="rgba(239,235,229,0.35)" strokeWidth="2" />

      {/* The stand */}
      <g className="egw-gold" fill="currentColor" stroke="currentColor">
        <rect x={PIVOT.x - 7} y={PIVOT.y} width="14" height={500 - PIVOT.y} stroke="none" />
        <path d={`M ${PIVOT.x - 60} 500 L ${PIVOT.x} 470 L ${PIVOT.x + 60} 500 Z`} stroke="none" />
        <circle cx={PIVOT.x} cy={PIVOT.y - 18} r="12" stroke="none" />
      </g>

      {/* The beam, and its pointer (Anubis's charge) */}
      <g className="egw-beam" style={{ transform: `rotate(${-tilt}deg)`, transformOrigin: `${PIVOT.x}px ${PIVOT.y}px` }}>
        <rect className="egw-gold-fill" x={PIVOT.x - ARM} y={PIVOT.y - 5} width={ARM * 2} height="10" rx="5" />
        <path className="egw-gold-fill" d={`M ${PIVOT.x} ${PIVOT.y} L ${PIVOT.x - 8} ${PIVOT.y + 40} L ${PIVOT.x + 8} ${PIVOT.y + 40} Z`} />
      </g>

      {/* The heart's pan */}
      <g className="egw-pan" style={{ transform: `translate(${dx}px, ${dy}px)` }}>
        <Pan x={PIVOT.x - ARM} y={PIVOT.y} />
        {heart && (
          <text className="egw-heart" x={PIVOT.x - ARM} y={PIVOT.y + 150} fontFamily={FONT} fontSize="70" textAnchor="middle">
            {GLYPHS.F34}
          </text>
        )}
      </g>
      {/* The feather's pan */}
      <g className="egw-pan" style={{ transform: `translate(${-dx}px, ${-dy}px)` }}>
        <Pan x={PIVOT.x + ARM} y={PIVOT.y} />
        <text className={`egw-feather ${dim('maat')}`} x={PIVOT.x + ARM} y={PIVOT.y + 150} fontFamily={FONT} fontSize="80" textAnchor="middle">
          {GLYPHS.H6}
        </text>
      </g>

      {/* Ani and Tutu, heads bowed */}
      <g className={`egw-ani ${dim('ani')}`}>
        <Person x={58} />
        <Person x={108} wife />
      </g>

      {/* The gods */}
      <g fontFamily={FONT} textAnchor="middle" className="egw-figures">
        <text x="258" y="490" fontSize="118" className={`egw-anubis ${dim('anubis')}`}>{GLYPHS.C6}</text>
        <text x="470" y="490" fontSize="104" className={`egw-maat ${dim('maat')}`}>{GLYPHS.C10}</text>
        <text x="566" y="490" fontSize="118" className={`egw-thoth ${dim('thoth')}`}>{GLYPHS.C3}</text>
      </g>
      <Ammit className={dim('ammit')} />

      <g className="egw-names" fontSize="16" textAnchor="middle">
        <text x="83" y="525">Ani and Tutu</text>
        <text x="258" y="525">Anubis</text>
        <text x="470" y="525">Maat</text>
        <text x="566" y="525">Thoth</text>
        <text x="725" y="525">Ammit</text>
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

/** A standing figure, head bowed, in white linen, in the Egyptian manner; the wife with long hair. */
function Person({ x, wife = false }: { x: number; wife?: boolean }) {
  return (
    <g className="egw-person" transform={`translate(${x} 0)`}>
      {/* hair, then the head bowed forward (toward the scales) */}
      <path d={wife ? 'M-10 376 C-10 362 6 356 16 364 L18 372 L8 378 L4 420 L-12 420 Z' : 'M-8 378 C-8 364 6 358 16 366 L16 376 L-6 386 Z'} className="egw-hair" />
      <ellipse cx="10" cy="378" rx="9" ry="10" className="egw-skin" />
      {/* neck and shoulders, and the long white robe */}
      <path d="M2 386 L14 386 L22 404 L-8 404 Z" className="egw-skin" />
      <path d={wife ? 'M-10 404 L22 404 L26 498 L-14 498 Z' : 'M-8 404 L22 404 L26 498 L-12 498 Z'} className="egw-robe" />
      {/* arms raised in praise */}
      <path d="M14 400 L34 384 L38 389 L18 407 Z" className="egw-skin" />
    </g>
  );
}

/** Ammit: a crocodile's head, a lion's front, a hippopotamus's back, crouched and facing the scales. */
function Ammit({ className }: { className: string }) {
  return (
    <g className={`egw-ammit ${className}`}>
      {/* the hippo's back: round, grey-brown, with short legs */}
      <path className="egw-hippo" d="M736 452 C736 418 760 404 778 414 C794 424 796 470 784 496 L752 496 C742 486 736 470 736 452 Z" />
      <rect className="egw-hippo" x="764" y="480" width="14" height="18" rx="4" />
      {/* the lion's front: gold body, forelegs, a mane */}
      <path className="egw-lion" d="M690 440 C700 424 726 420 744 430 L748 470 C744 482 730 488 716 486 L704 486 Z" />
      <rect className="egw-lion" x="700" y="470" width="12" height="28" rx="4" />
      <rect className="egw-lion" x="722" y="472" width="12" height="26" rx="4" />
      <path className="egw-mane" d="M684 438 C680 418 696 402 716 404 C728 406 734 418 730 432 C716 444 696 448 684 438 Z" />
      {/* the crocodile's head: long green snout, toward the scales */}
      <path className="egw-croc" d="M690 414 C680 409 662 410 648 415 C642 418 642 425 648 427 C662 431 678 431 694 430 Z" />
      <path className="egw-croc-line" d="M650 421 L690 421" />
      <circle className="egw-eye" cx="684" cy="414" r="3" />
    </g>
  );
}
