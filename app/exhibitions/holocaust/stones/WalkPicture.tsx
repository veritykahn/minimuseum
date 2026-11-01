import { useId, type ReactNode } from 'react';
import type { Placeholder, WalkLine } from './walkLines';
import { slotSrc } from './walkLines';

/*
 * The picture ahead on the walk, for one line: the owner's own picture when
 * it is in place (walkSlots.ts finds it), and until then a placeholder: a
 * dark silhouette of one of the agreed objects (empty tracks, shoes, a
 * suitcase, a closed door, an empty chair, a candle), softly lit from
 * behind, with "Picture to come" beneath it, so it reads as temporary.
 * Objects only: never a person, nothing graphic. Each fades in slowly (not
 * under reduced motion, memorial-stone.css).
 */

/** Each silhouette in a 200 × 140 box, standing on the ground at y = 120. */
const SILHOUETTES: Record<Placeholder, ReactNode> = {
  tracks: (
    <>
      {/* Sleepers, nearer ones wider, running away to the light. */}
      {[0, 1, 2, 3, 4, 5, 6].map((k) => {
        const t = k / 6;
        const y = 132 - t * 70;
        const half = 70 - t * 58;
        return <rect key={k} className="is-rim" x={100 - half - 8} y={y} width={(half + 8) * 2} height={4 - t * 2.6} rx="1" />;
      })}
      <path d="M 24 136 L 92 56 L 95 56 L 32 136 Z" className="is-rim" />
      <path d="M 176 136 L 108 56 L 105 56 L 168 136 Z" className="is-rim" />
    </>
  ),
  shoes: (
    <>
      <path className="is-rim" d="M 58 120 L 58 98 Q 58 92 66 92 L 80 92 Q 84 102 92 104 L 104 108 Q 112 110 112 116 L 112 120 Z" />
      <path className="is-rim" d="M 96 122 L 96 102 Q 96 96 104 96 L 118 96 Q 122 106 130 108 L 142 112 Q 150 114 150 120 L 150 122 Z" />
    </>
  ),
  suitcase: (
    <>
      <rect className="is-rim" x="56" y="70" width="88" height="52" rx="5" />
      <path className="is-rim" d="M 86 70 L 86 60 Q 86 56 90 56 L 110 56 Q 114 56 114 60 L 114 70 L 108 70 L 108 62 L 92 62 L 92 70 Z" />
      <path className="is-seam" d="M 74 72 V 120 M 126 72 V 120 M 58 92 H 142" />
    </>
  ),
  door: (
    <>
      <path className="is-rim" d="M 70 120 V 24 H 130 V 120 Z" />
      <path className="is-seam" d="M 78 32 H 122 V 66 H 78 Z M 78 74 H 122 V 112 H 78 Z" />
      <circle className="is-seam" cx="122" cy="72" r="2.4" />
      {/* Light under the door. */}
      <path className="is-warm-line" d="M 72 121 H 128" />
    </>
  ),
  chair: (
    <>
      <path className="is-rim" d="M 78 120 V 84 H 82 V 120 Z M 118 120 V 84 H 122 V 120 Z M 74 80 H 126 V 86 H 74 Z M 78 80 V 34 H 83 V 80 Z M 117 80 V 34 H 122 V 80 Z M 80 38 H 120 V 46 H 80 Z M 80 54 H 120 V 59 H 80 Z" />
    </>
  ),
  candle: (
    <>
      <circle className="is-flame-glow" cx="100" cy="52" r="30" />
      <path className="is-rim" d="M 90 120 V 66 Q 100 62 110 66 V 120 Z" />
      <path className="is-flame" d="M 100 62 C 94 54 96 46 100 38 C 104 46 106 54 100 62 Z" />
      <path className="is-rim" d="M 76 120 Q 76 114 84 114 H 116 Q 124 114 124 120 Z" />
    </>
  ),
};

export default function WalkPicture({ line, file }: { line: WalkLine; file?: string }) {
  const id = useId().replace(/:/g, '');
  return (
    <figure className={`hos-walk-picture${file ? ' has-picture' : ' is-placeholder'}`} data-slot={line.slot} data-placeholder={file ? undefined : line.placeholder}>
      {file ? (
        // eslint-disable-next-line @next/next/no-img-element -- the owner's picture, dropped in place; sized by the room
        <img src={slotSrc(line.slot, file)} alt={line.image} />
      ) : (
        <>
          <svg viewBox="0 0 200 140" role="img" aria-label={`${line.image} (picture to come)`}>
            <defs>
              <radialGradient id={`${id}-light`} cx="50%" cy="55%" r="55%">
                <stop offset="0" stopColor="#e9dfcf" stopOpacity="0.2" />
                <stop offset="0.55" stopColor="#e9dfcf" stopOpacity="0.06" />
                <stop offset="1" stopColor="#e9dfcf" stopOpacity="0" />
              </radialGradient>
            </defs>
            {/* The soft light behind the object, and the ground it stands on. */}
            <ellipse cx="100" cy="78" rx="96" ry="66" fill={`url(#${id}-light)`} />
            <path d="M 14 120.5 H 186" className="is-ground" />
            <g className="hos-walk-silhouette">{SILHOUETTES[line.placeholder]}</g>
          </svg>
          <figcaption className="hos-walk-tocome" aria-hidden="true">Picture to come</figcaption>
        </>
      )}
    </figure>
  );
}

export const SILHOUETTE_KINDS = Object.keys(SILHOUETTES) as Placeholder[];
