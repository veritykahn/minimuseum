import type { ReactNode } from 'react';
import type { Motif, WalkLine } from './walkLines';
import { slotSrc } from './walkLines';

/*
 * The picture ahead on the walk, for one line: the owner's own picture when
 * it is in place (walkSlots.ts finds it), and until then a quiet drawing of
 * the same kind of thing, a few pale lines in the dark. Objects and places
 * only: no people, nothing graphic. Each fades in slowly (not under reduced
 * motion, memorial-stone.css).
 */

const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

/** Each drawing in a 200 × 140 box, standing on a faint ground line at y = 124. */
const DRAWINGS: Record<Motif, ReactNode> = {
  door: (
    <>
      <path d="M72 124V28h56v96" />
      <path d="M128 28l-22 10v94l22-8" />
      <path className="is-light" d="M72 28h34v96H72z" />
      <circle cx="100" cy="80" r="1.8" />
    </>
  ),
  windows: (
    <>
      <path d="M30 124V62l30-20 30 20v62M110 124V52l30-22 30 22v72" />
      {[[40, 72], [62, 72], [40, 96], [62, 96], [120, 64], [146, 64], [120, 92], [146, 92]].map(([x, y]) => (
        <rect key={`${x}-${y}`} className="is-light" x={x} y={y} width="12" height="14" />
      ))}
    </>
  ),
  cone: (
    <>
      <path d="M100 118 74 40h52z" />
      <path d="M74 40c8-8 44-8 52 0M80 58h40M86 76h28M92 94h16" />
      <path d="M50 124h100" />
    </>
  ),
  book: (
    <>
      <path d="M58 112l84-10v12l-84 10z" />
      <path d="M58 112l-6-6 84-10 6 6M52 106v12l6 6" />
      <path d="M30 124h140" />
    </>
  ),
  nameplate: (
    <>
      <path d="M70 124V26h60v98" />
      <rect x="86" y="58" width="28" height="10" strokeDasharray="3 3" />
      <circle cx="88" cy="63" r="0.8" />
      <circle cx="112" cy="63" r="0.8" />
      <circle cx="122" cy="82" r="1.8" />
    </>
  ),
  bench: (
    <>
      <path d="M50 90h100M50 80h100M54 98h92M58 98v26M142 98v26M60 90V72M140 90V72" />
      <path d="M30 124h140" />
    </>
  ),
  pane: (
    <>
      <path d="M60 104V30h80v74M100 30v74M60 67h80" />
      <path d="M104 34l14 18-10 6 18 8M118 52l10-14" />
      <path d="M52 104h96v6H52z" />
      <path d="M70 108l4-2 3 2M118 108l5-3 2 3" />
    </>
  ),
  suitcase: (
    <>
      <rect x="66" y="78" width="68" height="42" rx="4" />
      <path d="M90 78v-8h20v8M66 96h68" />
      <path d="M20 124h160M20 130h160" />
    </>
  ),
  tag: (
    <>
      <rect x="60" y="80" width="80" height="40" rx="4" />
      <path d="M88 80v-10h24v10" />
      <path d="M100 70l14 18 18-4-6-16-14 2z" />
      <circle cx="116" cy="74" r="1.6" />
    </>
  ),
  hat: (
    <>
      <path d="M40 124V70h120v54M40 92h120" />
      <path className="is-warm" d="M76 92c0-16 10-24 24-24s24 8 24 24M66 92c12 4 56 4 68 0" />
    </>
  ),
  gate: (
    <>
      <path d="M20 124V40h40v84M140 124V40h40v84" />
      <path d="M60 124V48h80v76M80 48v76M100 48v76M120 48v76M60 70h80" />
      <path d="M20 56h40M20 72h40M20 88h40M20 104h40M140 56h40M140 72h40M140 88h40M140 104h40" opacity="0.5" />
    </>
  ),
  bookcase: (
    <>
      <path d="M62 124V24h70v100M62 50h70M62 76h70M62 102h70" />
      <path d="M68 50V34M74 50V36M80 50V32M90 76V60M96 76V62M106 102V88M112 102V86" />
      <path className="is-light" d="M132 24l12 6v94l-12-0" />
    </>
  ),
  diary: (
    <>
      <path d="M40 108l60-8 60 8V64l-60-8-60 8z" />
      <path d="M100 56v52" />
      <path d="M50 72l40-5M50 82l40-5M50 92l40-5M110 67l40 5M110 77l40 5" opacity="0.6" />
    </>
  ),
  bicycle: (
    <>
      <circle cx="58" cy="100" r="22" />
      <circle cx="142" cy="100" r="22" />
      <path d="M58 100l26-36h40l18 36M84 64l16 36 24-36M78 58h14M118 56l8-6h10" />
      <path d="M124 64h18v18h-18z" />
    </>
  ),
  tracks: (
    <>
      <path d="M40 132 96 40M160 132 104 40" />
      <path d="M52 112h96M62 96h76M70 82h60M77 70h46M83 60h34M88 52h24" opacity="0.6" />
    </>
  ),
  suitcases: (
    <>
      <rect x="18" y="86" width="44" height="34" rx="3" />
      <rect x="66" y="78" width="40" height="42" rx="3" />
      <rect x="110" y="90" width="38" height="30" rx="3" />
      <rect x="152" y="82" width="32" height="38" rx="3" />
      <path d="M32 86v-6h16v6M78 78v-6h16v6M122 90v-6h14v6M162 82v-6h12v6" />
    </>
  ),
  note: (
    <>
      <path d="M30 124h140" />
      <path d="M60 104l76-8 4 22-76 8z" />
      <circle cx="100" cy="110" r="6" opacity="0.6" />
    </>
  ),
  candle: (
    <>
      <path d="M90 124V66h20v58" />
      <path className="is-warm" d="M100 62c-5-6-4-12 0-20 4 8 5 14 0 20z" />
      <circle className="is-glow" cx="100" cy="52" r="22" />
      <path d="M70 124h60" />
    </>
  ),
  shoes: (
    <>
      <path d="M62 120h30c4 0 4-8-2-10l-12-4-4-12h-10z" />
      <path d="M106 120h30c4 0 4-8-2-10l-12-4-4-12h-10z" />
      <path d="M40 124h120" />
    </>
  ),
  shutter: (
    <>
      <path d="M58 116V28h84v88" />
      <path d="M58 28h40v88M102 28h40v88" />
      <path d="M62 40h32M62 52h32M62 64h32M62 76h32M62 88h32M62 100h32M106 40h32M106 52h32M106 64h32M106 76h32M106 88h32M106 100h32" opacity="0.5" />
      <path className="is-light" d="M99 30v84" />
    </>
  ),
  boat: (
    <>
      <path d="M60 100h80l-12 14H72z" />
      <path d="M100 100V44l26 44h-26" />
      <path d="M20 120c20-4 40 4 60 0s40-4 60 0 30 2 40 0" opacity="0.6" />
      <circle cx="160" cy="34" r="6" opacity="0.6" />
    </>
  ),
  table: (
    <>
      <path d="M30 88h140M40 88v36M160 88v36" />
      <circle cx="62" cy="82" r="10" />
      <circle cx="100" cy="82" r="10" />
      <circle cx="138" cy="82" r="10" />
    </>
  ),
  stones: (
    <>
      <path d="M20 112h160v8H20z" />
      <path d="M34 112c0-8 16-10 18 0M62 112c2-10 20-8 20 0M92 112c0-6 12-8 14 0M116 112c2-10 22-10 22 0M148 112c0-7 14-8 16 0" />
    </>
  ),
  tree: (
    <>
      <path d="M100 124V70M100 92l-14-12M100 84l16-14M100 104l12-8" />
      <path d="M100 50c-14 0-22 10-20 22M100 50c14 0 22 10 20 22" opacity="0.7" />
      <path d="M40 124h120" />
    </>
  ),
  path: (
    <>
      <path d="M30 136 92 44M170 136 108 44" />
      <circle className="is-glow" cx="100" cy="40" r="26" />
    </>
  ),
};

export default function WalkPicture({ line, ready }: { line: WalkLine; ready: boolean }) {
  return (
    <figure className={`hos-walk-picture${ready ? ' has-picture' : ''}`} data-slot={line.slot}>
      {ready ? (
        // eslint-disable-next-line @next/next/no-img-element -- the owner's picture, dropped in place; sized by the room
        <img src={slotSrc(line.slot)} alt={line.image} />
      ) : (
        <svg viewBox="0 0 200 140" role="img" aria-label={line.image}>
          <g {...S}>{DRAWINGS[line.motif]}</g>
          <path d="M10 124h180" className="is-ground" />
        </svg>
      )}
    </figure>
  );
}

export const MOTIFS = Object.keys(DRAWINGS) as Motif[];
