/*
 * The make-your-own thaumatrope's pictures: simple line art, drawn for the
 * museum, to colour in. Each pair is drawn on one disc's coordinates (a
 * circle of radius 100 about 0,0), so the front's picture lands inside the
 * back's: the bird inside the cage, the fish inside the bowl's water, the
 * flower's stem down into its pot.
 */

export type PairId = 'bird' | 'fish' | 'flower';

export const PAIRS: { id: PairId; name: string; front: string; back: string }[] = [
  { id: 'bird', name: 'Bird and cage', front: 'A bird on a perch', back: 'An empty birdcage' },
  { id: 'fish', name: 'Fish and bowl', front: 'A fish', back: 'An empty fishbowl' },
  { id: 'flower', name: 'Flower and pot', front: 'A flower', back: 'An empty flowerpot' },
];

const domeY = (x: number) => -30 - 38 * Math.sqrt(Math.max(0, 1 - (x / 40) ** 2));

export function Bird() {
  return (
    <g>
      {/* the perch */}
      <path d="M -34 36 H 34" />
      {/* tail, body, head */}
      <path d="M -18 20 L -42 34 L -36 18 L -42 6 L -19 10" />
      <path d="M -20 15 C -20 -2, 6 -2, 12 2 C 16 -6, 30 -8, 32 2 C 34 12, 26 30, 4 31 C -10 32, -20 26, -20 15 Z" />
      {/* the beak, the eye, a wing */}
      <path d="M 31 -1 L 41 2 L 31 6" />
      <circle cx="23" cy="0" r="2.4" className="ink-fill" />
      <path d="M -10 14 C 0 8, 10 12, 12 20 C 2 24, -6 22, -10 14 Z" />
      {/* legs gripping the perch */}
      <path d="M -2 31 L -4 36 M 8 31 L 10 36" />
    </g>
  );
}

export function Cage() {
  const bars = [-40, -27, -13, 0, 13, 27, 40];
  const dome = Array.from({ length: 41 }, (_, i) => {
    const x = -40 + i * 2;
    return `${i ? 'L' : 'M'} ${x} ${domeY(x).toFixed(2)}`;
  }).join(' ');
  return (
    <g>
      <circle cx="0" cy="-74" r="6" />
      <path d="M 0 -68 V -68" />
      <path d={dome} />
      {bars.map((x) => (
        <path key={x} d={`M ${x} ${domeY(x).toFixed(2)} V 52`} />
      ))}
      <path d="M -40 -30 H 40" />
      <path d="M -46 52 H 46 V 62 H -46 Z" />
      <path d="M -36 62 L -40 70 M 36 62 L 40 70" />
      {/* a little door */}
      <path d="M 16 50 V 18 H 34 V 50" />
    </g>
  );
}

export function Fish() {
  return (
    <g>
      <path d="M -30 10 Q -4 -16 26 10 Q -4 36 -30 10 Z" />
      <path d="M -30 10 L -48 -6 L -44 10 L -48 26 Z" />
      <circle cx="13" cy="5" r="2.6" className="ink-fill" />
      <path d="M 4 -2 Q 0 10 4 22" />
      <path d="M -10 -3 Q -4 -14 6 -9" />
      <path d="M -8 22 Q -4 30 2 24" />
      <circle cx="30" cy="-8" r="3" />
      <circle cx="36" cy="-20" r="2" />
    </g>
  );
}

export function Bowl() {
  return (
    <g>
      <ellipse cx="0" cy="-50" rx="33" ry="6" />
      <path d="M -33 -50 A 64 64 0 1 0 33 -50" />
      <path d="M -54 -30 Q -45 -34 -36 -30 T -18 -30 T 0 -30 T 18 -30 T 36 -30 T 54 -30" />
      <path d="M -30 62 Q -20 54 -10 62 M 6 64 Q 14 56 24 63" />
    </g>
  );
}

export function Flower() {
  const petals = Array.from({ length: 6 }, (_, i) => (i * 360) / 6);
  // Set a little low, so the petals clear the star; the stem still ends inside the pot's rim.
  return (
    <g transform="translate(0 8)">
      <path d="M 0 -38 C -3 -14, 3 4, 0 24" />
      <path d="M 0 -6 C -16 -18, -30 -12, -32 -4 C -20 2, -8 0, 0 -6 Z" />
      <path d="M 1 6 C 16 -6, 30 -2, 32 6 C 20 12, 8 12, 1 6 Z" />
      {petals.map((a) => (
        <ellipse key={a} cx="0" cy="-66" rx="7" ry="13" transform={`rotate(${a} 0 -50)`} />
      ))}
      <circle cx="0" cy="-50" r="9" />
    </g>
  );
}

export function Pot() {
  return (
    <g>
      <path d="M -40 22 H 40 V 36 H -40 Z" />
      <path d="M -34 36 L -26 82 H 26 L 34 36" />
      <path d="M -36 22 Q -18 16 0 20 Q 18 16 36 22" />
      <path d="M -10 52 Q 0 58 10 52" />
    </g>
  );
}

const ART: Record<PairId, { front: () => React.JSX.Element; back: () => React.JSX.Element }> = {
  bird: { front: Bird, back: Cage },
  fish: { front: Fish, back: Bowl },
  flower: { front: Flower, back: Pot },
};

/**
 * One disc to cut out: the cutting circle, a star at the top, the two dots
 * for the strings, and the picture (or none, to draw on). The back's
 * picture is printed upside down, so that twirled about the strings it
 * shows the right way up.
 */
export function Disc({ pair, side, label }: { pair: PairId | null; side: 'front' | 'back'; label: string }) {
  const Art = pair ? ART[pair][side] : null;
  return (
    <svg className="vmt-disc" viewBox="-110 -110 220 220" role="img" aria-label={label}>
      <circle className="vmt-cut" cx="0" cy="0" r="100" />
      <path className="vmt-star" d="M 0 -97 L 2.4 -91.5 L 8 -91.5 L 3.6 -88 L 5.4 -82.5 L 0 -85.8 L -5.4 -82.5 L -3.6 -88 L -8 -91.5 L -2.4 -91.5 Z" />
      <circle className="vmt-hole" cx="-88" cy="0" r="3" />
      <circle className="vmt-hole" cx="88" cy="0" r="3" />
      {Art ? (
        <g className="vmt-art" transform={side === 'back' ? 'rotate(180)' : undefined}>
          <Art />
        </g>
      ) : (
        side === 'back' && (
          <text className="vmt-hint" x="0" y="-60" textAnchor="middle">
            Draw this one upside down
          </text>
        )
      )}
    </svg>
  );
}
