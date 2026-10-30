/*
 * The thaumatrope's disc, the classic one the poster names: a bird on one
 * side, an empty cage on the other, drawn as a hand-coloured engraving (sepia
 * line, washed colour) on a transparent ground in a space from -100 to 100,
 * so the two sides can be laid one over the other and the bird sits inside
 * the cage, behind its bars.
 */

const LINE = '#3b2a1c';
const OCHRE = '#c99a3c';
const RUST = '#a8432e';
const WING = '#5a4630';
const BRASS = '#8a6a32';
const CREAM = '#f3ead6';

export function DiscArt({ side }: { side: 'front' | 'back' }) {
  return side === 'front' ? <Bird /> : <Cage />;
}

/** The bird, alone on its perch. */
function Bird() {
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      {/* the perch, swung on two cords from the top of the disc */}
      <path d="M-34 34 H34" stroke={WING} strokeWidth="3.4" />
      <path d="M-30 34 L-22 -44 M30 34 L22 -44" stroke={LINE} strokeWidth="0.8" opacity="0.5" />
      {/* the tail */}
      <path d="M-20 16 L-46 36 L-41 41 L-15 23Z" fill={WING} stroke={LINE} strokeWidth="1.2" />
      <path d="M-24 22 L-42 37" stroke={CREAM} strokeWidth="0.8" opacity="0.6" />
      {/* the body */}
      <path d="M-24 12 C-22 -6 2 -14 15 -6 C27 2 24 20 11 26 C-1 31 -19 27 -24 12Z" fill={OCHRE} stroke={LINE} strokeWidth="1.4" />
      <path d="M-6 24 C2 22 10 18 14 10" stroke={CREAM} strokeWidth="2.2" opacity="0.55" fill="none" />
      {/* the wing, with its bars */}
      <path d="M-15 4 C-6 -5 8 -3 12 6 C4 15 -9 17 -18 13Z" fill={WING} stroke={LINE} strokeWidth="1.2" />
      <path d="M-11 6 C-4 2 3 3 7 7 M-12 10 C-5 7 2 8 5 11" stroke={OCHRE} strokeWidth="1.3" fill="none" />
      {/* the head, with its red face */}
      <circle cx="16" cy="-11" r="11" fill={OCHRE} stroke={LINE} strokeWidth="1.4" />
      <path d="M20 -20 C27 -17 28 -8 24 -3 C20 -6 18 -13 20 -20Z" fill={RUST} />
      <path d="M8 -18 C12 -22 18 -22 22 -20" stroke={LINE} strokeWidth="2.4" fill="none" />
      <path d="M26 -13 L35 -10 L26 -7Z" fill="#e7d3a6" stroke={LINE} strokeWidth="1" />
      <circle cx="19" cy="-13" r="2" fill={LINE} />
      <circle cx="19.6" cy="-13.6" r="0.6" fill="#fff" />
      {/* the feet, gripping the perch */}
      <path d="M-3 27 L-4 34 M6 26 L7 34" stroke={LINE} strokeWidth="1.6" />
    </g>
  );
}

/** The empty cage: a domed wire cage on its tray, hung from a ring. */
function Cage() {
  const bars = Array.from({ length: 11 }, (_, i) => -50 + i * 10);
  const dome = (x: number) => -34 - 40 * Math.sqrt(Math.max(0, 1 - (x / 52) ** 2));
  return (
    <g fill="none" strokeLinecap="round">
      <circle cx="0" cy="-86" r="6" stroke={BRASS} strokeWidth="2.6" />
      <path d="M0 -80 V-74" stroke={BRASS} strokeWidth="2.6" />
      <path d="M-52 -34 C-52 -86 52 -86 52 -34" stroke={BRASS} strokeWidth="3" />
      <ellipse cx="0" cy="-75" rx="8" ry="2.6" fill={BRASS} />
      {bars.map((x) => (
        <path key={x} d={`M${x} ${dome(x).toFixed(1)} V54`} stroke={LINE} strokeWidth={x === -50 || x === 50 ? 2.4 : 1.5} />
      ))}
      <path d="M-52 -34 H52 M-51 44 H51" stroke={BRASS} strokeWidth="2.6" />
      {/* the tray, and its little door shut */}
      <path d="M-58 54 H58 L54 64 H-54Z" fill={BRASS} stroke={LINE} strokeWidth="1.2" />
      <path d="M-56 58 H56" stroke="#d6b46a" strokeWidth="1" />
      <rect x="30" y="10" width="17" height="32" stroke={BRASS} strokeWidth="1.8" />
      <circle cx="44" cy="26" r="1.6" fill={BRASS} />
      {/* the seed pot, at the side */}
      <path d="M-49 -12 h10 v8 h-10Z" fill={CREAM} stroke={LINE} strokeWidth="1" />
    </g>
  );
}
