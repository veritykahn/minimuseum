import { GLYPHS } from '../rooms';

/*
 * A painted coffin in the shape of a wrapped body (an anthropoid coffin),
 * drawn in SVG, standing upright in its own units: 120 wide, 480 long, the
 * head at the top, centred on x = 0. Lay it down with a transform.
 *
 * The lid is painted the way such coffins were: a gold face with dark
 * outlined eyes under a striped blue-and-gold wig; a broad collar of
 * coloured bands and beads across the chest; a winged sun disc spread
 * below it; a pale column down the legs with protective signs (an ankh, a
 * djed pillar, a wedjat eye, set in the hieroglyph face as decoration, not
 * as words to be read); panels of colour down its sides, and painted feet.
 * The base is the open trough of the same shape.
 */

const FONT = "'Egypt Hieroglyphs', 'Noto Sans Egyptian Hieroglyphs', serif";

/** The coffin's outline: the head, the shoulders, the long taper to the feet. */
export const COFFIN_OUTLINE =
  'M0 0 C34 0 56 22 58 58 C60 86 54 104 56 124 C60 160 58 230 52 300 C48 360 40 410 36 440 C34 466 22 480 0 480 C-22 480 -34 466 -36 440 C-40 410 -48 360 -52 300 C-58 230 -60 160 -56 124 C-54 104 -60 86 -58 58 C-56 22 -34 0 0 0 Z';

const INK = '#2a1a0c';

/** The closed lid, painted. `id` keeps its gradients unique on the page. */
export function CoffinLid({ id }: { id: string }) {
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-ground`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#a8741f" />
          <stop offset="0.3" stopColor="#e7c46a" />
          <stop offset="0.55" stopColor="#f3d98c" />
          <stop offset="1" stopColor="#9a6a1c" />
        </linearGradient>
        <linearGradient id={`${id}-face`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff0b0" />
          <stop offset="0.45" stopColor="#e9b53e" />
          <stop offset="1" stopColor="#a8741f" />
        </linearGradient>
        <clipPath id={`${id}-clip`}>
          <path d={COFFIN_OUTLINE} />
        </clipPath>
      </defs>

      <path d={COFFIN_OUTLINE} fill={`url(#${id}-ground)`} stroke={INK} strokeWidth="3" />

      <g clipPath={`url(#${id}-clip)`}>
        {/* side panels of colour down the length */}
        {[-1, 1].map((side) => (
          <g key={side}>
            {Array.from({ length: 9 }, (_, i) => (
              <rect key={i} x={side < 0 ? -62 : 44} y={250 + i * 24} width="18" height="20" fill={['#1f4f8f', '#b0392a', '#2f7a4a'][i % 3]} stroke={INK} strokeWidth="1" />
            ))}
          </g>
        ))}

        {/* the column of protective signs down the legs */}
        <rect x="-17" y="262" width="34" height="168" fill="#f3e7c8" stroke={INK} strokeWidth="2" />
        <g fontFamily={FONT} fontSize="26" textAnchor="middle" fill="#1f4f8f">
          <text x="0" y="300">{GLYPHS.S34}</text>
          <text x="0" y="344" fill="#b0392a">{GLYPHS.R11}</text>
          <text x="0" y="388">{GLYPHS.D10}</text>
          <text x="0" y="424" fill="#2f7a4a">{GLYPHS.S34}</text>
        </g>

        {/* the winged sun disc */}
        <g>
          {[-1, 1].map((side) => (
            <g key={side} transform={`scale(${side} 1)`}>
              <path d="M10 222 C30 206 50 204 62 210 L62 240 C46 238 28 240 10 236 Z" fill="#1f4f8f" stroke={INK} strokeWidth="1.5" />
              <path d="M10 236 C28 240 46 238 62 240 L62 250 C44 250 26 250 10 244 Z" fill="#2f7a4a" stroke={INK} strokeWidth="1.5" />
              {[18, 28, 38, 48].map((x) => (
                <line key={x} x1={x} y1={x < 30 ? 216 : 210} x2={x} y2="246" stroke="#f3d98c" strokeWidth="1.2" />
              ))}
            </g>
          ))}
          <circle cx="0" cy="226" r="11" fill="#c8402a" stroke={INK} strokeWidth="2" />
        </g>

        {/* the broad collar: bands of colour, then a row of drop beads */}
        {[
          { r: 0, c: '#1f4f8f' },
          { r: 10, c: '#f3d98c' },
          { r: 20, c: '#b0392a' },
          { r: 30, c: '#2f7a4a' },
          { r: 40, c: '#1f4f8f' },
        ].map((b) => (
          <path key={b.r} d={`M-52 ${128 + b.r} Q0 ${176 + b.r * 1.15} 52 ${128 + b.r}`} fill="none" stroke={b.c} strokeWidth="10" />
        ))}
        {Array.from({ length: 11 }, (_, i) => {
          const t = i / 10;
          const x = -48 + t * 96;
          const y = 176 + 26 * (1 - (2 * t - 1) ** 2);
          return <path key={i} d={`M${x - 4} ${y} Q${x} ${y + 14} ${x + 4} ${y} Z`} fill={i % 2 ? '#b0392a' : '#1f4f8f'} stroke={INK} strokeWidth="1" />;
        })}

        {/* the striped wig, falling in two lappets to the chest */}
        <path d="M0 4 C30 4 52 24 54 58 C56 90 52 112 54 152 L32 152 C32 122 30 100 28 86 L-28 86 C-30 100 -32 122 -32 152 L-54 152 C-52 112 -56 90 -54 58 C-52 24 -30 4 0 4 Z" fill="#1d3f7c" stroke={INK} strokeWidth="2" />
        {Array.from({ length: 13 }, (_, i) => (
          <line key={i} x1="-56" y1={14 + i * 11} x2="56" y2={14 + i * 11} stroke="#e7c46a" strokeWidth="3" />
        ))}
        <path d="M0 4 C30 4 52 24 54 58 C56 90 52 112 54 152 L32 152 C32 122 30 100 28 86 L-28 86 C-30 100 -32 122 -32 152 L-54 152 C-52 112 -56 90 -54 58 C-52 24 -30 4 0 4 Z" fill="none" stroke={INK} strokeWidth="2" />
      </g>

      {/* the face */}
      <ellipse cx="0" cy="62" rx="26" ry="32" fill={`url(#${id}-face)`} stroke={INK} strokeWidth="2" />
      <g fill="none" stroke={INK} strokeLinecap="round">
        <path d="M-19 46 Q-11 41 -3 45 M3 45 Q11 41 19 46" strokeWidth="2.5" />
        <path d="M-18 55 Q-11 50 -4 55 Q-11 59 -18 55 Z M4 55 Q11 50 18 55 Q11 59 4 55 Z" fill="#fff" strokeWidth="2" />
        <path d="M-18 55 L-24 57 M18 55 L24 57" strokeWidth="2.5" />
        <path d="M0 58 L-3 72 L3 72" strokeWidth="1.5" />
      </g>
      <circle cx="-11" cy="55" r="2.6" fill={INK} />
      <circle cx="11" cy="55" r="2.6" fill={INK} />
      <path d="M-7 81 Q0 85 7 81 Q0 79 -7 81 Z" fill="#b0392a" stroke={INK} strokeWidth="1" />

      {/* the painted feet */}
      <path d="M-30 446 C-24 470 24 470 30 446" fill="none" stroke={INK} strokeWidth="2" />
      {[-18, -6, 6, 18].map((x) => (
        <rect key={x} x={x - 5} y="452" width="10" height="12" rx="3" fill="#b0392a" stroke={INK} strokeWidth="1" />
      ))}
    </g>
  );
}

/** The open coffin: the trough the mummy is laid in. */
export function CoffinBase() {
  return (
    <g>
      <path d={COFFIN_OUTLINE} fill="#5a3518" stroke={INK} strokeWidth="3" />
      <path d={COFFIN_OUTLINE} fill="#8a5a2b" transform="translate(0 24) scale(0.82 0.9)" stroke="#c99a3d" strokeWidth="2" />
      <path d="M0 60 L0 440" stroke="#c99a3d" strokeWidth="2" strokeDasharray="6 8" opacity="0.6" />
    </g>
  );
}
