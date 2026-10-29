import { forwardRef, type ReactNode } from 'react';
import { CLOTH_COLORS, COVERED, EYE_COLORS, HAIR_COLORS, SKIN, colorOf, describe, freckleColor, lightness, mix, shade, vitiligoEdge, vitiligoPatch, type Doll as DollChoices } from './dollOptions';

/*
 * The doll, drawn: the Mini Museum's own round-headed, child-proportioned
 * toy, flat colors and soft outlines, standing (or sitting in its
 * wheelchair) on poster 2's pink, its orange rays behind. Everything is
 * drawn to one scale from the choices in dollOptions.ts, and every feature
 * is shaded from the doll's own skin tone, so no face is drawn as a
 * departure from another.
 *
 * The SVG is self-contained (no CSS from the page), so the designer can
 * save it as a picture or print it as it is.
 */

const CX = 160;
const HEAD = { cy: 132, rx: 58, ry: 62 };
const EYE_Y = 138;
const EYE_X = [138, 182];
const PINK = '#ee8dbf';
/* The head's outline, as a clip for what must stay on it (a shaved head, vitiligo's patches). */
const HEAD_CLIP = 'bhr-doll-head';
const ORANGE = '#f7a21b';
const INK = '#2a1a14';
const DENIM = '#3d5a8a';

/*
 * The face's own colors, from the skin: darker for the lighter tones and,
 * for the deeper tones, a warm rose-brown, so the nose, lips, lids and cheeks
 * read as clearly on every doll (a plain darkening would all but vanish on
 * the deepest skin).
 */
function faceColors(skin: string) {
  const deep = lightness(skin) < 0.42;
  return {
    feature: deep ? mix(skin, '#1a0d08', 0.55) : shade(skin, -0.32),
    lip: deep ? mix(skin, '#b8706a', 0.45) : shade(skin, -0.2),
    lipLine: deep ? mix(skin, '#1a0d08', 0.6) : shade(skin, -0.42),
    lid: deep ? mix(skin, '#1a0d08', 0.45) : shade(skin, -0.18),
    blush: deep ? { fill: '#d9566e', opacity: 0.32 } : { fill: '#e8607a', opacity: 0.2 },
  };
}

/* Coordinates to two places, so the server's drawing and the browser's agree to the digit. */
const r2 = (n: number) => Math.round(n * 100) / 100;

/** Scalloped edge: a blob of circles round a center, for curly and coily hair. */
function bumps(cx: number, cy: number, r: number, n: number, br: number, fill: string, from = 0, to = 360) {
  const out: ReactNode[] = [<circle key="c" cx={cx} cy={cy} r={r} fill={fill} />];
  for (let i = 0; i < n; i++) {
    const a = ((from + ((to - from) * i) / Math.max(1, n - (to - from === 360 ? 0 : 1))) * Math.PI) / 180;
    out.push(<circle key={i} cx={r2(cx + Math.cos(a) * r)} cy={r2(cy + Math.sin(a) * r)} r={br} fill={fill} />);
  }
  return out;
}

/* The hair over the top of the head, leaving the forehead: shared by most styles. */
const CAP = 'M102 128 Q100 66 160 62 Q220 66 218 128 Q206 96 160 92 Q114 96 102 128 Z';

function Hair({ d, color, fabric, layer }: { d: DollChoices; color: string; fabric: string; layer: 'back' | 'front' }) {
  const dark = shade(color, -0.25);
  const light = shade(color, 0.18);
  const strands = (n: number, len: (i: number) => number, w: number | ((i: number) => number), dash?: string, top = 96) =>
    Array.from({ length: n }, (_, i) => {
      const x = 100 + (i * 120) / (n - 1);
      const y0 = top + Math.abs(i - (n - 1) / 2) * 3;
      return (
        <g key={i}>
          <path d={`M${x} ${y0} L${x + (x < CX ? -4 : 4)} ${len(i)}`} stroke={color} strokeWidth={typeof w === 'number' ? w : w(i)} strokeLinecap="round" fill="none" />
          {dash && <path d={`M${x} ${y0 + 8} L${x + (x < CX ? -4 : 4)} ${len(i) - 4}`} stroke={d.hair === 'twists' ? light : dark} strokeWidth={(typeof w === 'number' ? w : w(i)) * 0.5} strokeDasharray={dash} strokeLinecap="round" fill="none" />}
        </g>
      );
    });

  if (layer === 'back') {
    switch (d.hair) {
      case 'afro':
        return <g>{bumps(CX, 112, 84, 22, 18, color)}</g>;
      case 'puffs':
        return (
          <g>
            {bumps(88, 70, 32, 12, 11, color)}
            {bumps(232, 70, 32, 12, 11, color)}
          </g>
        );
      // Braids, locs and twists: the hair's mass, and its strands over it.
      case 'braids':
        return (
          <g>
            <path d="M98 100 Q160 60 222 100 L226 296 Q160 310 94 296 Z" fill={dark} />
            {strands(10, (i) => 300 + (i % 3) * 12, 13, '3 5')}
          </g>
        );
      case 'locs':
        return (
          <g>
            <path d="M98 100 Q160 60 222 100 L226 258 Q160 270 94 258 Z" fill={dark} />
            {strands(9, (i) => 262 + ((i * 7) % 4) * 8, (i) => 14 + ((i * 5) % 3) * 2, '1 9')}
          </g>
        );
      case 'twists':
        return (
          <g>
            <path d="M98 100 Q160 60 222 100 L224 208 Q160 220 96 208 Z" fill={dark} />
            {strands(11, (i) => 212 + (i % 2) * 8, 12, '4 4')}
          </g>
        );
      case 'curls':
        return <g>{bumps(CX, 140, 70, 18, 14, color, 150, 390)}</g>;
      case 'straight':
        return <path d="M96 130 Q92 58 160 56 Q228 58 224 130 L230 292 Q160 304 90 292 Z" fill={color} />;
      case 'hijab':
        return <path d="M90 142 Q84 50 160 48 Q236 50 230 142 L240 240 Q160 262 80 240 Z" fill={shade(fabric, -0.12)} />;
      default:
        return null;
    }
  }

  switch (d.hair) {
    case 'afro':
    case 'twists':
    case 'locs':
      return <path d={CAP} fill={color} />;
    case 'puffs':
      return (
        <g>
          <path d={CAP} fill={color} />
          <path d="M156 64 Q160 80 160 92" stroke={dark} strokeWidth="2" fill="none" />
          <rect x="106" y="80" width="14" height="10" rx="4" fill={ORANGE} transform="rotate(-40 113 85)" />
          <rect x="200" y="80" width="14" height="10" rx="4" fill={ORANGE} transform="rotate(40 207 85)" />
        </g>
      );
    case 'braids':
      return (
        <g>
          <path d={CAP} fill={color} />
          {/* The parts between the braids: down the middle, and across in a grid. */}
          <path d="M160 62 L160 92 M118 84 Q138 74 160 76 Q182 74 202 84 M106 106 Q130 94 160 92 Q190 94 214 106" stroke={light} strokeWidth="1.6" fill="none" />
        </g>
      );
    case 'knots':
      return (
        <g>
          <path d={CAP} fill={color} />
          {[
            [116, 84],
            [140, 66],
            [180, 66],
            [204, 84],
            [160, 58],
          ].map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="15" fill={color} />
              <path d={`M${x} ${y - 9} a9 9 0 1 1 -8 5 a5 5 0 1 1 6 -2`} stroke={light} strokeWidth="2" fill="none" />
            </g>
          ))}
        </g>
      );
    case 'curls':
      return (
        <g>
          <path d={CAP} fill={color} />
          {bumps(CX, 80, 26, 0, 0, color)}
          {[112, 128, 146, 164, 182, 200].map((x, i) => (
            <circle key={i} cx={x + 4} cy={r2(94 - Math.sin((i / 5) * Math.PI) * 12)} r="11" fill={color} />
          ))}
        </g>
      );
    case 'straight':
      return <path d="M102 128 Q100 64 160 60 Q220 64 218 128 Q214 100 196 92 Q150 104 112 100 Q104 112 102 128 Z" fill={color} />;
    case 'short':
      return <path d="M101 124 Q98 62 160 58 Q222 62 219 124 Q210 92 160 86 Q110 92 101 124 Z" fill={color} />;
    case 'shaved':
      // Close-cropped: a shadow of hair on the scalp itself, inside the head's outline.
      return <path d={CAP} fill={color} opacity="0.35" clipPath={`url(#${HEAD_CLIP})`} />;
    case 'wrap':
      // A tall wrap: the fabric gathered up from the hairline, folds sweeping to a knot, its end tucked.
      return (
        <g>
          <path d="M98 132 Q84 64 112 34 Q160 6 208 34 Q236 64 222 132 Q206 98 160 96 Q114 98 98 132 Z" fill={fabric} />
          <path d="M104 112 Q130 58 196 40 M120 102 Q160 70 214 92" stroke={shade(fabric, -0.22)} strokeWidth="3" fill="none" strokeLinecap="round" />
          <ellipse cx="174" cy="30" rx="30" ry="20" fill={fabric} transform="rotate(-18 174 30)" />
          <ellipse cx="138" cy="28" rx="22" ry="16" fill={shade(fabric, -0.1)} transform="rotate(14 138 28)" />
          <path d="M196 22 Q222 12 226 34 Q214 30 200 38 Z" fill={shade(fabric, -0.18)} />
        </g>
      );
    case 'hijab':
      // The face framed by the scarf, which wraps under the chin and drapes over the shoulders.
      return (
        <g>
          <path
            d="M92 132 Q88 50 160 48 Q232 50 228 132 Q234 196 222 232 Q246 252 250 272 Q160 296 70 272 Q74 252 98 232 Q86 196 92 132 Z M114 140 Q116 190 160 193 Q204 190 206 140 Q206 88 160 86 Q114 88 114 140 Z"
            fill={fabric}
            fillRule="evenodd"
          />
          <path d="M112 206 Q160 236 208 206 M104 250 Q160 270 216 250" stroke={shade(fabric, -0.2)} strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
      );
    default:
      return null;
  }
}

function Eye({ x, d, iris, lid }: { x: number; d: DollChoices; iris: string; lid: string }) {
  if (d.eyes === 'round') {
    return (
      <g>
        <ellipse cx={x} cy={EYE_Y} rx="9" ry="9" fill="#f6f1ea" />
        <circle cx={x} cy={EYE_Y + 0.5} r="7" fill={iris} />
        <circle cx={x} cy={EYE_Y + 0.5} r="3" fill="#120c0a" />
        <circle cx={x + 2.2} cy={EYE_Y - 2} r="1.8" fill="#fff" />
      </g>
    );
  }
  const h = d.eyes === 'almond' ? 7 : 5.5;
  const shape = `M${x - 12} ${EYE_Y} Q${x} ${EYE_Y - h * 1.6} ${x + 12} ${EYE_Y} Q${x} ${EYE_Y + h * 1.3} ${x - 12} ${EYE_Y} Z`;
  return (
    <g>
      <path d={shape} fill="#fff" />
      <circle cx={x} cy={EYE_Y + 0.5} r={h - 0.5} fill={iris} />
      <circle cx={x} cy={EYE_Y + 0.5} r={h * 0.45} fill="#120c0a" />
      <circle cx={x + 2} cy={EYE_Y - 1.5} r="1.5" fill="#fff" />
      {d.eyes === 'hooded' && <path d={`M${x - 13} ${EYE_Y - 1} Q${x} ${EYE_Y - h * 2.4} ${x + 13} ${EYE_Y - 2}`} stroke={lid} strokeWidth="3" fill="none" strokeLinecap="round" />}
      <path d={`M${x - 12} ${EYE_Y} Q${x} ${EYE_Y - h * 1.6} ${x + 12} ${EYE_Y}`} stroke="#120c0a" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </g>
  );
}

function Face({ d, skin, hair }: { d: DollChoices; skin: string; hair: string }) {
  const iris = colorOf(EYE_COLORS, d.eyeColor);
  const { feature, lip, lipLine, lid, blush } = faceColors(skin);
  const brow = COVERED.has(d.hair) || d.hair === 'shaved' ? shade(skin, -0.55) : shade(hair, -0.15);
  const marks = d.marks === 'both' ? ['freckles', 'vitiligo'] : [d.marks];
  const patch = vitiligoPatch(skin);
  const edge = vitiligoEdge(skin);
  return (
    <g>
      {/* The patches stay on the face: the head's outline clips them. */}
      {marks.includes('vitiligo') && (
        <g fill={patch} stroke={edge} strokeWidth="1.3" clipPath={`url(#${HEAD_CLIP})`}>
          <path d="M110 118 Q120 110 128 118 Q132 130 122 134 Q110 134 108 126 Z" />
          <path d="M176 167 Q186 161 192 169 Q193 179 185 181 Q176 179 176 167 Z" />
          <path d="M196 120 Q206 116 210 126 Q208 136 200 134 Z" />
        </g>
      )}
      <path d={`M${EYE_X[0] - 11} 121 Q${EYE_X[0]} 114 ${EYE_X[0] + 10} 120`} stroke={brow} strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d={`M${EYE_X[1] - 10} 120 Q${EYE_X[1]} 114 ${EYE_X[1] + 11} 121`} stroke={brow} strokeWidth="4" fill="none" strokeLinecap="round" />
      {EYE_X.map((x) => (
        <Eye key={x} x={x} d={d} iris={iris} lid={lid} />
      ))}
      <circle cx="128" cy="164" r="10" fill={blush.fill} opacity={blush.opacity} />
      <circle cx="192" cy="164" r="10" fill={blush.fill} opacity={blush.opacity} />
      {marks.includes('freckles') && (
        <g fill={freckleColor(skin)}>
          {[
            [134, 154],
            [140, 160],
            [146, 152],
            [128, 160],
            [174, 152],
            [180, 160],
            [186, 154],
            [192, 160],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="1.8" />
          ))}
        </g>
      )}
      {d.nose === 'rounded' && <path d="M154 154 Q160 161 166 154" stroke={feature} strokeWidth="2.6" fill="none" strokeLinecap="round" />}
      {d.nose === 'broad' && <path d="M150 152 Q153 159 160 159 Q167 159 170 152" stroke={feature} strokeWidth="2.6" fill="none" strokeLinecap="round" />}
      {d.nose === 'narrow' && <path d="M160 145 Q157.5 151 156.5 154 Q160 158 163.5 154" stroke={feature} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />}
      {d.mouth === 'smile' && <path d="M147 172 Q160 182 173 172" stroke={lip} strokeWidth="3.4" fill="none" strokeLinecap="round" />}
      {d.mouth === 'full' && (
        <g>
          <path d="M146 172 Q160 176 174 172 Q168 184 160 184 Q152 184 146 172 Z" fill={lip} />
          <path d="M146 172 Q160 178 174 172" stroke={lipLine} strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
      )}
      {d.mouth === 'grin' && (
        <g>
          <path d="M144 170 Q160 190 176 170 Z" fill="#5a2a22" />
          <path d="M147 171 L173 171 L171 175 Q160 177 149 175 Z" fill="#fff" />
          <path d="M144 170 Q160 190 176 170" stroke={lip} strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
      {d.mouth === 'calm' && <path d="M150 175 Q160 179 170 175" stroke={lip} strokeWidth="3.4" fill="none" strokeLinecap="round" />}
    </g>
  );
}

function Glasses({ kind }: { kind: string }) {
  const frame = '#1d1d1d';
  const lens = { fill: '#ffffff', fillOpacity: 0.16, stroke: frame, strokeWidth: 3.2 };
  if (kind === 'round')
    return (
      <g>
        <circle cx={EYE_X[0]} cy={EYE_Y} r="16" {...lens} />
        <circle cx={EYE_X[1]} cy={EYE_Y} r="16" {...lens} />
        <path d={`M${EYE_X[0] + 16} ${EYE_Y - 2} Q160 ${EYE_Y - 8} ${EYE_X[1] - 16} ${EYE_Y - 2} M${EYE_X[0] - 16} ${EYE_Y - 2} L103 ${EYE_Y - 6} M${EYE_X[1] + 16} ${EYE_Y - 2} L217 ${EYE_Y - 6}`} stroke={frame} strokeWidth="3" fill="none" />
      </g>
    );
  return (
    <g>
      <rect x={EYE_X[0] - 18} y={EYE_Y - 13} width="36" height="26" rx="6" {...lens} />
      <rect x={EYE_X[1] - 18} y={EYE_Y - 13} width="36" height="26" rx="6" {...lens} />
      <path d={`M${EYE_X[0] + 18} ${EYE_Y - 4} Q160 ${EYE_Y - 9} ${EYE_X[1] - 18} ${EYE_Y - 4} M${EYE_X[0] - 18} ${EYE_Y - 6} L103 ${EYE_Y - 8} M${EYE_X[1] + 18} ${EYE_Y - 6} L217 ${EYE_Y - 8}`} stroke={frame} strokeWidth="3" fill="none" />
    </g>
  );
}

/* The legs, by how the doll gets around: standing, or seated with the knees toward us. */
function legs(seated: boolean) {
  return seated ? { l: 'M140 344 L140 440', r: 'M180 344 L180 440', foot: 448 } : { l: 'M140 318 L139 458', r: 'M180 318 L181 458', foot: 468 };
}

function Clothes({ d, c, seated }: { d: DollChoices; c: string; seated: boolean }) {
  const accent = c === '#f7f5ee' || c === '#f5d33a' || c === '#c5da3b' ? INK : '#f7f5ee';
  const deep = shade(c, -0.25);
  const lg = legs(seated);
  const top = 'M110 214 Q160 200 210 214 L204 322 Q160 330 116 322 Z';
  const sleeve = (len: 'short' | 'long', color: string) => (
    <g stroke={color} strokeWidth="25" strokeLinecap="round" fill="none">
      <path d={len === 'short' ? 'M118 222 Q110 238 106 256' : 'M118 222 Q102 270 97 312'} />
      <path d={len === 'short' ? 'M202 222 Q210 238 214 256' : 'M202 222 Q218 270 223 312'} />
    </g>
  );
  const trousers = (color: string, to?: number) => (
    <g stroke={color} strokeWidth="30" strokeLinecap="round" fill="none">
      <path d={to ? `M140 318 L140 ${to}` : lg.l} />
      {/* A prosthetic leg shows below the knee: that trouser leg is rolled up. */}
      <path d={to ? `M180 318 L180 ${to}` : d.mobility === 'prosthetic' ? (seated ? 'M180 344 L180 368' : 'M180 318 L180 374') : lg.r} />
      {seated && !to && (
        <g strokeWidth="0" fill={color}>
          <ellipse cx="140" cy="340" rx="19" ry="16" />
          <ellipse cx="180" cy="340" rx="19" ry="16" />
        </g>
      )}
      <path d="M128 316 L192 316" strokeWidth="34" strokeLinecap="butt" />
    </g>
  );
  switch (d.outfit) {
    case 'tee':
      return (
        <g>
          {trousers(DENIM)}
          {sleeve('short', c)}
          <path d={top} fill={c} />
          <path d="M146 208 Q160 220 174 208" stroke={deep} strokeWidth="3" fill="none" />
        </g>
      );
    case 'dress':
      return (
        <g>
          {sleeve('short', c)}
          <path d={top} fill={c} />
          <path d={seated ? 'M114 300 L206 300 L226 372 Q160 386 94 372 Z' : 'M116 296 L204 296 L232 398 Q160 414 88 398 Z'} fill={c} />
          <path d={seated ? 'M98 362 Q160 376 222 362' : 'M92 386 Q160 402 228 386'} stroke={accent} strokeWidth="5" fill="none" opacity="0.85" />
          <path d="M146 208 Q160 222 174 208" stroke={deep} strokeWidth="3" fill="none" />
        </g>
      );
    case 'hoodie':
      return (
        <g>
          {trousers('#6e6a66')}
          <path d="M122 214 Q160 184 198 214 Q160 226 122 214 Z" fill={deep} />
          {sleeve('long', c)}
          <path d={top} fill={c} />
          <path d="M134 284 L186 284 L182 312 L138 312 Z" fill={deep} opacity="0.7" />
          <path d="M152 214 L150 246 M168 214 L170 246" stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
        </g>
      );
    case 'overalls':
      return (
        <g>
          {trousers(c)}
          {sleeve('short', '#f7f5ee')}
          <path d={top} fill="#f7f5ee" />
          <path d="M126 252 L194 252 L198 324 L122 324 Z" fill={c} />
          <path d="M132 254 L124 212 M188 254 L196 212" stroke={c} strokeWidth="9" strokeLinecap="round" />
          <circle cx="134" cy="258" r="3.5" fill={accent} />
          <circle cx="186" cy="258" r="3.5" fill={accent} />
          <rect x="146" y="268" width="28" height="20" rx="3" fill={deep} />
        </g>
      );
    case 'jumpsuit':
      return (
        <g>
          {trousers(c)}
          {sleeve('short', c)}
          <path d={top} fill={c} />
          <path d="M160 206 L160 300" stroke={deep} strokeWidth="2.5" />
          <rect x="116" y="294" width="88" height="11" fill={accent} />
        </g>
      );
    default:
      return (
        <g>
          {trousers(accent === INK ? INK : '#f7f5ee', seated ? 356 : 368)}
          {sleeve('short', c)}
          <path d={top} fill={c} />
          <path d="M114 236 L206 236" stroke={accent} strokeWidth="7" />
          <text x="160" y="290" textAnchor="middle" fontFamily="Arial Black, Arial, sans-serif" fontWeight="900" fontSize="36" fill={accent}>
            7
          </text>
        </g>
      );
  }
}

function Wheelchair({ back }: { back: boolean }) {
  const frame = '#2b2b2b';
  if (back)
    return (
      <g>
        <rect x="104" y="196" width="112" height="140" rx="12" fill={frame} />
        <rect x="100" y="326" width="120" height="22" rx="8" fill="#3d3d3d" />
        <path d="M104 196 L98 182 M216 196 L222 182" stroke={frame} strokeWidth="7" strokeLinecap="round" />
      </g>
    );
  return (
    <g>
      {[78, 242].map((x) => (
        <g key={x}>
          <ellipse cx={x} cy="372" rx="17" ry="82" fill="none" stroke={frame} strokeWidth="9" />
          <ellipse cx={x} cy="372" rx="10" ry="70" fill="none" stroke="#9a9a9a" strokeWidth="3" />
          <circle cx={x} cy="372" r="5" fill="#9a9a9a" />
        </g>
      ))}
      <path d="M96 346 L118 452 M224 346 L202 452" stroke={frame} strokeWidth="6" strokeLinecap="round" />
      <rect x="112" y="450" width="96" height="10" rx="4" fill={frame} />
      <circle cx="114" cy="470" r="9" fill={frame} />
      <circle cx="206" cy="470" r="9" fill={frame} />
    </g>
  );
}

function Hearing({ kind, ears }: { kind: string; ears: boolean }) {
  const body = '#2f6fd6';
  // Under a hijab, hearing aids are hidden, but an implant's coil sits over the scarf.
  if (!ears && kind === 'implant') return <circle cx="220" cy="106" r="10" fill={body} stroke="#f7f5ee" strokeWidth="2" />;
  if (!ears || kind === 'none') return null;
  if (kind === 'aids')
    return (
      <g>
        <path d="M96 124 Q88 134 94 152" stroke={body} strokeWidth="7" strokeLinecap="round" fill="none" />
        <path d="M224 124 Q232 134 226 152" stroke={body} strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="104" cy="142" r="3" fill={body} />
        <circle cx="216" cy="142" r="3" fill={body} />
      </g>
    );
  return (
    <g>
      <path d="M220 104 Q232 116 224 134" stroke="#555" strokeWidth="2.5" fill="none" />
      <circle cx="216" cy="102" r="10" fill={body} stroke="#f7f5ee" strokeWidth="2" />
      <path d="M224 128 Q232 138 226 154" stroke={body} strokeWidth="7" strokeLinecap="round" fill="none" />
    </g>
  );
}

type Props = { doll: DollChoices; title?: string; className?: string };

const DollPicture = forwardRef<SVGSVGElement, Props>(function DollPicture({ doll: d, title, className }, ref) {
  const skin = colorOf(SKIN, d.skin);
  const hair = colorOf(HAIR_COLORS, d.hairColor);
  const fabric = colorOf(CLOTH_COLORS, d.fabric);
  const cloth = colorOf(CLOTH_COLORS, d.clothes);
  const seated = d.mobility === 'wheelchair';
  const lg = legs(seated);
  const ears = d.hair !== 'hijab';
  const outline = shade(skin, -0.3);
  const name = d.name.trim();
  const patch = vitiligoPatch(skin);
  const vitiligo = d.marks === 'vitiligo' || d.marks === 'both';
  const shoe = cloth === '#1d1d1d' ? '#f7f5ee' : INK;

  return (
    <svg ref={ref} className={className} viewBox="0 0 320 540" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={title ?? describe(d)}>
      <title>{title ?? describe(d)}</title>
      {/* Poster 2's pink, its orange rays from the top corner. */}
      <defs>
        <clipPath id="bhr-doll-card">
          <rect width="320" height="540" rx="28" />
        </clipPath>
        <clipPath id={HEAD_CLIP}>
          <ellipse cx={CX} cy={HEAD.cy} rx={HEAD.rx} ry={HEAD.ry} />
        </clipPath>
      </defs>
      <rect width="320" height="540" rx="28" fill={PINK} />
      <g opacity="0.55" clipPath="url(#bhr-doll-card)">
        {Array.from({ length: 9 }, (_, i) => {
          const a = ((-10 + i * 13) * Math.PI) / 180;
          const b = a + (5 * Math.PI) / 180;
          return <path key={i} d={`M320 0 L${r2(320 - Math.cos(a) * 700)} ${r2(Math.sin(a) * 700)} L${r2(320 - Math.cos(b) * 700)} ${r2(Math.sin(b) * 700)} Z`} fill={ORANGE} />;
        })}
      </g>
      <ellipse cx="160" cy="482" rx="104" ry="12" fill={INK} opacity="0.18" />

      {seated && <Wheelchair back />}
      <Hair d={d} color={hair} fabric={fabric} layer="back" />

      {/* Arms and legs, then the body. */}
      <g stroke={skin} strokeLinecap="round" fill="none">
        <path d="M118 222 Q102 270 97 314" strokeWidth="22" />
        <path d="M202 222 Q218 270 223 314" strokeWidth="22" />
        <path d={lg.l} strokeWidth="25" />
        {d.mobility === 'prosthetic' ? <path d={seated ? 'M180 344 L180 380' : 'M180 318 L180.5 386'} strokeWidth="25" /> : <path d={lg.r} strokeWidth="25" />}
      </g>
      <circle cx="96" cy="322" r="12.5" fill={skin} />
      <circle cx="224" cy="322" r="12.5" fill={skin} />
      {vitiligo && <path d="M216 316 Q226 310 232 320 Q230 332 220 330 Z" fill={patch} stroke={vitiligoEdge(skin)} strokeWidth="1.3" />}
      {d.mobility === 'prosthetic' && (
        <g>
          <rect x="172" y={seated ? 376 : 382} width="16" height="12" rx="4" fill="#5a5a5a" />
          <path d={seated ? 'M180 388 L180 442' : 'M180.5 392 L181 460'} stroke="#a9adb1" strokeWidth="7" strokeLinecap="round" />
        </g>
      )}
      <rect x="148" y="184" width="24" height="30" rx="8" fill={skin} />
      <path d="M110 214 Q160 200 210 214 L204 322 Q160 330 116 322 Z" fill={skin} />

      <Clothes d={d} c={cloth} seated={seated} />

      {/* Shoes. */}
      <ellipse cx="135" cy={lg.foot} rx="19" ry="10.5" fill={shoe} />
      <ellipse cx="185" cy={lg.foot} rx="19" ry="10.5" fill={shoe} />
      <path d={`M122 ${lg.foot - 3} L148 ${lg.foot - 3} M172 ${lg.foot - 3} L198 ${lg.foot - 3}`} stroke="#f7f5ee" strokeWidth="2.5" opacity="0.7" />

      {d.mobility === 'cane' && (
        <g>
          <path d="M228 318 L262 476" stroke="#f7f5ee" strokeWidth="6" strokeLinecap="round" />
          <path d="M255 444 L262 476" stroke="#d7262e" strokeWidth="6.5" strokeLinecap="round" />
          <circle cx="224" cy="322" r="12.5" fill={skin} />
        </g>
      )}
      {seated && <Wheelchair back={false} />}

      {/* The head. */}
      {ears && (
        <g fill={skin} stroke={outline} strokeWidth="1.2">
          <ellipse cx="103" cy="140" rx="10" ry="14" />
          <ellipse cx="217" cy="140" rx="10" ry="14" />
        </g>
      )}
      <ellipse cx={CX} cy={HEAD.cy} rx={HEAD.rx} ry={HEAD.ry} fill={skin} />
      <Face d={d} skin={skin} hair={hair} />
      <Hair d={d} color={hair} fabric={fabric} layer="front" />
      <Hearing kind={d.hearing} ears={ears} />
      {d.glasses !== 'none' && <Glasses kind={d.glasses} />}

      {name && (
        <text x="160" y="520" textAnchor="middle" fontFamily="Shrikhand, 'Cooper Black', Georgia, serif" fontSize={name.length > 14 ? 20 : 26} fill={INK}>
          {name}
        </text>
      )}
    </svg>
  );
});

export default DollPicture;
