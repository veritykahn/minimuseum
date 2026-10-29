import { useId, type ReactElement } from 'react';
import { PAPERS, type BorderId, type PaperId, type PictureId } from './cardText';

/*
 * The card, drawn in SVG at the printed card's proportions (4" × 5.25", a
 * quarter of a Letter page): its front, with the chosen picture in an
 * arched panel, the border and the greeting; and its inside, with the
 * visitor's words. The pictures are drawn for the room in the posters'
 * palette, after the subjects Victorian cards loved; none claims to copy a
 * real card.
 */

export const CARD = { w: 400, h: 525 };
/** The arched panel the picture sits in. */
const PANEL = { x: 56, y: 58, w: 288, h: 300 };

type Paper = (typeof PAPERS)[number];
const paperOf = (id: PaperId) => PAPERS.find((p) => p.id === id)!;

export function CardFront({ picture, border, paper, greeting, label }: { picture: PictureId; border: BorderId; paper: PaperId; greeting: string; label?: string }) {
  const p = paperOf(paper);
  const uid = useId().replace(/:/g, '');
  const arch = `M${PANEL.x} ${PANEL.y + PANEL.h} V${PANEL.y + 110} A${PANEL.w / 2} ${PANEL.w / 2} 0 0 1 ${PANEL.x + PANEL.w} ${PANEL.y + 110} V${PANEL.y + PANEL.h}Z`;
  const Art = ART[picture];
  return (
    <svg className="vcc-card-svg" viewBox={`0 0 ${CARD.w} ${CARD.h}`} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <defs>
        <clipPath id={`vcc-arch-${uid}`}>
          <path d={arch} />
        </clipPath>
        <linearGradient id={`vcc-gilt-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f3dc96" />
          <stop offset="0.45" stopColor={p.accent} />
          <stop offset="1" stopColor="#7a5a20" />
        </linearGradient>
      </defs>
      <rect width={CARD.w} height={CARD.h} fill={p.bg} />
      <Paperish paper={p} />
      {/* The border first: paper lace is the card's own edge, under the picture. */}
      <Border id={border} paper={p} gilt={`url(#vcc-gilt-${uid})`} />
      <g clipPath={`url(#vcc-arch-${uid})`}>
        <g transform={`translate(${PANEL.x} ${PANEL.y})`}>
          <Art />
        </g>
      </g>
      <path d={arch} fill="none" stroke={`url(#vcc-gilt-${uid})`} strokeWidth="5" />
      <path d={arch} fill="none" stroke={p.ink} strokeOpacity="0.5" strokeWidth="1" />
      <Greeting text={greeting} paper={p} />
    </svg>
  );
}

/**
 * The message's size inside the card, in the card's units: the longer it
 * runs (a new line counts as a short line's worth), the smaller it is set, so
 * the longest still fits between "To" and "from".
 */
export function messageSize(message: string) {
  const t = message.trim();
  const n = t.length + (t.match(/\n/g)?.length ?? 0) * 28;
  return n <= 110 ? 19 : n <= 170 ? 16.5 : n <= 240 ? 14.5 : n <= 330 ? 12.5 : 11;
}

export function CardInside({ to, message, from, paper, border }: { to: string; message: string; from: string; paper: PaperId; border: BorderId }) {
  const p = paperOf(paper);
  const uid = useId().replace(/:/g, '');
  return (
    <svg className="vcc-card-svg" viewBox={`0 0 ${CARD.w} ${CARD.h}`} aria-hidden="true">
      <defs>
        <linearGradient id={`vcc-gilt-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f3dc96" />
          <stop offset="0.45" stopColor={p.accent} />
          <stop offset="1" stopColor="#7a5a20" />
        </linearGradient>
      </defs>
      <rect width={CARD.w} height={CARD.h} fill={p.bg} />
      <Paperish paper={p} />
      <Border id={border} paper={p} gilt={`url(#vcc-gilt-${uid})`} quiet />
      <Sprig x={200} y={92} paper={p} />
      <foreignObject x="58" y="128" width="284" height="320">
        <div className="vcc-inside" style={{ color: p.ink }}>
          {to.trim() && <p className="vcc-inside-to">To {to.trim()},</p>}
          <p className="vcc-inside-message" style={{ fontSize: messageSize(message) }}>{message.trim() || ' '}</p>
          {from.trim() && <p className="vcc-inside-from">from {from.trim()}</p>}
        </div>
      </foreignObject>
    </svg>
  );
}

/** The card's back, as printed: a small sprig and the museum's name. */
export function CardBack({ paper }: { paper: PaperId }) {
  const p = paperOf(paper);
  return (
    <svg className="vcc-card-svg" viewBox={`0 0 ${CARD.w} ${CARD.h}`} aria-hidden="true">
      <rect width={CARD.w} height={CARD.h} fill={p.bg} />
      <Sprig x={200} y={420} paper={p} />
      <text x="200" y="470" textAnchor="middle" className="vcc-back-text" fill={p.ink} fontSize="13" letterSpacing="3">
        THE MINI MUSEUM · VICTORIAN BRITAIN
      </text>
    </svg>
  );
}

/** Card stock: a soft, even age at the edges. */
function Paperish({ paper }: { paper: Paper }) {
  const dark = paper.id === 'night';
  const id = `vcc-age-${useId().replace(/:/g, '')}`;
  return (
    <>
      <defs>
        <radialGradient id={id} cx="50%" cy="48%" r="72%">
          <stop offset="70%" stopColor={dark ? '#000' : '#8a6a3a'} stopOpacity="0" />
          <stop offset="100%" stopColor={dark ? '#000' : '#8a6a3a'} stopOpacity={dark ? 0.35 : 0.14} />
        </radialGradient>
      </defs>
      <rect width={CARD.w} height={CARD.h} fill={`url(#${id})`} />
    </>
  );
}

function Greeting({ text, paper }: { text: string; paper: Paper }) {
  const t = text.trim() || ' ';
  // Long greetings run to two lines, broken nearest the middle.
  const words = t.split(/\s+/);
  let lines = [t];
  if (t.length > 22 && words.length > 1) {
    let best = 1;
    let diff = Infinity;
    for (let i = 1; i < words.length; i++) {
      const d = Math.abs(words.slice(0, i).join(' ').length - words.slice(i).join(' ').length);
      if (d < diff) {
        diff = d;
        best = i;
      }
    }
    lines = [words.slice(0, best).join(' '), words.slice(best).join(' ')];
  }
  const size = lines.length > 1 ? (t.length > 44 ? 21 : 26) : t.length > 16 ? 28 : 34;
  return (
    <g className="vcc-greeting">
      {lines.map((l, i) => (
        <text key={i} x="200" y={(lines.length > 1 ? 408 : 425) + i * (size * 1.22)} textAnchor="middle" fill={paper.ink} fontSize={size}>
          {l}
        </text>
      ))}
    </g>
  );
}

/* ───────── The borders ───────── */

function Border({ id, paper, gilt, quiet = false }: { id: BorderId; paper: Paper; gilt: string; quiet?: boolean }) {
  const W = CARD.w;
  const H = CARD.h;
  if (id === 'rule') {
    return <rect x="20" y="20" width={W - 40} height={H - 40} fill="none" stroke={paper.ink} strokeOpacity="0.6" strokeWidth="1.2" />;
  }
  if (id === 'gilt') {
    const corners = [
      [26, 26],
      [W - 26, 26],
      [26, H - 26],
      [W - 26, H - 26],
    ];
    return (
      <g>
        <rect x="14" y="14" width={W - 28} height={H - 28} fill="none" stroke={gilt} strokeWidth="7" />
        <rect x="26" y="26" width={W - 52} height={H - 52} fill="none" stroke={gilt} strokeWidth="1.6" />
        {!quiet &&
          corners.map(([x, y]) => (
            <g key={`${x},${y}`} transform={`translate(${x} ${y})`} fill={gilt}>
              {[0, 90, 180, 270].map((a) => (
                <ellipse key={a} rx="4" ry="9" transform={`rotate(${a}) translate(0 -8)`} />
              ))}
              <circle r="4" fill={paper.bg} stroke={gilt} strokeWidth="2" />
            </g>
          ))}
      </g>
    );
  }
  if (id === 'lace') {
    // Paper lace: a scalloped edge, pricked with holes.
    const scallops: ReactElement[] = [];
    const step = 18;
    for (let x = step / 2; x < W; x += step) {
      scallops.push(<circle key={`t${x}`} cx={x} cy="10" r="10" />, <circle key={`b${x}`} cx={x} cy={H - 10} r="10" />);
    }
    for (let y = step / 2; y < H; y += step) {
      scallops.push(<circle key={`l${y}`} cx="10" cy={y} r="10" />, <circle key={`r${y}`} cx={W - 10} cy={y} r="10" />);
    }
    const holes: ReactElement[] = [];
    for (let x = 24; x < W - 20; x += 12) holes.push(<circle key={`ht${x}`} cx={x} cy="28" r="2.2" />, <circle key={`hb${x}`} cx={x} cy={H - 28} r="2.2" />);
    for (let y = 36; y < H - 30; y += 12) holes.push(<circle key={`hl${y}`} cx="28" cy={y} r="2.2" />, <circle key={`hr${y}`} cx={W - 28} cy={y} r="2.2" />);
    return (
      <g>
        <g fill="#fbf7ef" opacity={paper.id === 'night' ? 0.9 : 1}>{scallops}</g>
        <rect x="10" y="10" width={W - 20} height={H - 20} fill="#fbf7ef" opacity={paper.id === 'night' ? 0.9 : 1} />
        <rect x="18" y="18" width={W - 36} height={H - 36} fill={paper.bg} />
        <Paperish paper={paper} />
        <g fill={paper.accent} opacity="0.55">{holes}</g>
        <rect x="36" y="38" width={W - 72} height={H - 76} fill="none" stroke={paper.accent} strokeOpacity="0.6" strokeWidth="1" strokeDasharray="1 4" strokeLinecap="round" />
      </g>
    );
  }
  // Holly at the corners, joined by a red rule.
  return (
    <g>
      <rect x="22" y="22" width={W - 44} height={H - 44} fill="none" stroke="#a8343a" strokeWidth="2" />
      <rect x="28" y="28" width={W - 56} height={H - 56} fill="none" stroke={paper.ink} strokeOpacity="0.35" strokeWidth="1" />
      {!quiet &&
        [
          [34, 34, 45],
          [W - 34, 34, 135],
          [34, H - 34, -45],
          [W - 34, H - 34, -135],
        ].map(([x, y, a]) => (
          <g key={`${x},${y}`} transform={`translate(${x} ${y}) rotate(${a}) scale(0.62)`}>
            <HollyLeaf x={-18} y={0} angle={-25} />
            <HollyLeaf x={18} y={0} angle={25} flip />
            <Berries x={0} y={-4} />
          </g>
        ))}
    </g>
  );
}

/* ───────── The pictures, each in a space 288 × 300 ───────── */

const GREEN = '#2f4a32';
const LEAF = '#3f6446';
const RED = '#a8343a';
const GOLD = '#c9a24a';
const CREAM = '#f4eee3';
const WOOD = '#6b4a32';

function Flame({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle r="9" fill="#ffd77a" opacity="0.28" />
      <path d="M0 -9 C3.5 -4 3.5 -1 0 1.5 C-3.5 -1 -3.5 -4 0 -9Z" fill="#f2b84b" />
      <path d="M0 -5 C1.4 -2.6 1.4 -1 0 0.6 C-1.4 -1 -1.4 -2.6 0 -5Z" fill="#fff6d8" />
    </g>
  );
}

function Candle({ x, y, h = 12 }: { x: number; y: number; h?: number }) {
  return (
    <g>
      <rect x={x - 2.4} y={y - h} width="4.8" height={h} rx="1" fill={CREAM} stroke="#b9a98d" strokeWidth="0.6" />
      <Flame x={x} y={y - h - 2} />
    </g>
  );
}

export function HollyLeaf({ x, y, angle, flip = false }: { x: number; y: number; angle: number; flip?: boolean }) {
  // A holly leaf: five spines a side along a curved midrib.
  const pts: string[] = [];
  const n = 5;
  for (let i = 0; i <= n; i++) pts.push(`${-30 + (60 * i) / n} ${i % 2 ? -14 : -9}`);
  for (let i = n; i >= 0; i--) pts.push(`${-30 + (60 * i) / n} ${i % 2 ? 14 : 9}`);
  const d = `M-34 0 L${pts.slice(0, n + 1).join(' L')} L34 0 L${pts.slice(n + 1).join(' L')}Z`;
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${flip ? -1 : 1} 1)`}>
      <path d={d} fill={LEAF} stroke={GREEN} strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M-32 0 Q0 -3 32 0" stroke="#7fa184" strokeWidth="1.2" fill="none" />
    </g>
  );
}

export function Berries({ x, y }: { x: number; y: number }) {
  return (
    <g>
      {[
        [0, 0],
        [-8, 6],
        [8, 6],
      ].map(([dx, dy]) => (
        <g key={`${dx},${dy}`}>
          <circle cx={x + dx} cy={y + dy} r="7" fill={RED} stroke="#6e1f24" strokeWidth="1" />
          <circle cx={x + dx - 2.2} cy={y + dy - 2.4} r="1.8" fill="#fff" opacity="0.6" />
        </g>
      ))}
    </g>
  );
}

function Sprig({ x, y, paper }: { x: number; y: number; paper: Paper }) {
  return (
    <g transform={`translate(${x} ${y}) scale(0.7)`} opacity={paper.id === 'night' ? 0.95 : 1}>
      <HollyLeaf x={-26} y={0} angle={-12} />
      <HollyLeaf x={26} y={0} angle={12} flip />
      <Berries x={0} y={-6} />
    </g>
  );
}

const ART: Record<PictureId, () => ReactElement> = {
  tree: () => (
    <g>
      <rect width="288" height="300" fill="#2b3a4e" />
      <ellipse cx="144" cy="40" rx="200" ry="120" fill="#3f5470" opacity="0.6" />
      <rect y="250" width="288" height="50" fill="#5a3a2a" />
      <path d="M0 250 H288" stroke="#3f2218" strokeWidth="3" />
      {/* the tree in its tub */}
      <path d="M124 252 L164 252 L158 284 L130 284Z" fill="#a4565c" />
      <rect x="120" y="246" width="48" height="8" rx="2" fill="#c98f92" />
      <rect x="139" y="232" width="10" height="16" fill={WOOD} />
      {[
        [40, 40, 90],
        [72, 56, 140],
        [108, 76, 190],
        [146, 98, 238],
      ].map(([top, half, base], i) => (
        <path key={i} d={`M144 ${top} L${144 - half} ${base} Q144 ${base - 10} ${144 + half} ${base}Z`} fill={i % 2 ? LEAF : GREEN} />
      ))}
      {/* tinsel garlands */}
      <path d="M118 96 Q144 108 170 96 M100 146 Q144 162 188 146 M84 196 Q144 214 204 196" stroke={GOLD} strokeWidth="2" fill="none" strokeDasharray="0.1 4" strokeLinecap="round" />
      {[
        [130, 70],
        [158, 70],
        [110, 122],
        [178, 122],
        [92, 172],
        [196, 172],
        [76, 222],
        [212, 222],
      ].map(([x, y]) => (
        <Candle key={`${x},${y}`} x={x} y={y + 14} h={10} />
      ))}
      {[
        [144, 120, RED],
        [126, 160, GOLD],
        [162, 166, RED],
        [104, 210, RED],
        [144, 200, GOLD],
        [184, 214, RED],
      ].map(([x, y, c]) => (
        <g key={`${x},${y}`}>
          <circle cx={x as number} cy={y as number} r="6" fill={c as string} />
          <circle cx={(x as number) - 2} cy={(y as number) - 2} r="1.6" fill="#fff" opacity="0.7" />
        </g>
      ))}
      <polygon points="144,22 149,34 162,34 152,42 156,55 144,47 132,55 136,42 126,34 139,34" fill={GOLD} stroke="#9c7a2c" strokeWidth="1" />
      {/* parcels */}
      <rect x="60" y="258" width="44" height="30" fill="#a8343a" />
      <path d="M82 258 V288 M60 272 H104" stroke={GOLD} strokeWidth="3" />
      <rect x="190" y="264" width="38" height="24" fill="#4e6152" />
      <path d="M209 264 V288 M190 276 H228" stroke={CREAM} strokeWidth="3" />
    </g>
  ),
  village: () => (
    <g>
      <defs>
        <linearGradient id="vcc-dusk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#36405e" />
          <stop offset="0.6" stopColor="#8a7a94" />
          <stop offset="1" stopColor="#d9b7b8" />
        </linearGradient>
      </defs>
      <rect width="288" height="300" fill="url(#vcc-dusk)" />
      <circle cx="222" cy="70" r="18" fill="#f4eee3" opacity="0.85" />
      {/* the church, and the hill it stands on */}
      <path d="M0 200 Q80 170 160 186 T288 178 V300 H0Z" fill="#e9ecea" />
      <rect x="168" y="120" width="26" height="70" fill="#5c5868" />
      <path d="M164 122 L181 60 L198 122Z" fill="#4a4656" />
      <path d="M164 122 L181 60 L186 80Z" fill="#f4f6f4" opacity="0.8" />
      <rect x="176" y="140" width="10" height="16" rx="5" fill="#f2d68a" />
      {/* the cottages, their roofs deep in snow */}
      {[
        [26, 196, 70, 52],
        [104, 212, 64, 46],
        [196, 206, 76, 54],
      ].map(([x, y, w, h], i) => (
        <g key={i}>
          <rect x={x} y={y} width={w} height={h} fill={i === 1 ? '#8a5a4a' : '#7a6a5e'} />
          <path d={`M${x - 8} ${y + 2} L${x + w / 2} ${y - 30} L${x + w + 8} ${y + 2}Z`} fill="#f7f8f7" />
          <rect x={x + 10} y={y + 14} width="14" height="14" fill="#f2c86a" />
          <rect x={x + w - 24} y={y + 14} width="14" height="14" fill="#f2c86a" />
          <rect x={x + w / 2 - 7} y={y + h - 22} width="14" height="22" fill="#3f2a22" />
          <rect x={x + w - 18} y={y - 30} width="8" height="18" fill="#6a5a50" />
        </g>
      ))}
      {/* a fir in the snow */}
      <path d="M262 250 L246 250 L254 226 L248 226 L256 204 L251 204 L262 176 L273 204 L268 204 L276 226 L270 226 L278 250Z" fill={GREEN} />
      <path d="M262 176 L270 196 L262 192 L254 196Z" fill="#fff" opacity="0.8" />
      <path d="M0 262 Q144 248 288 266 V300 H0Z" fill="#fbfcfb" />
      {/* falling snow */}
      {Array.from({ length: 46 }, (_, i) => {
        const x = (i * 61.7) % 288;
        const y = (i * 37.3) % 250;
        return <circle key={i} cx={x} cy={y} r={i % 3 ? 1.6 : 2.4} fill="#fff" opacity="0.85" />;
      })}
    </g>
  ),
  holly: () => (
    <g>
      <rect width="288" height="300" fill="#f7f1e4" />
      <circle cx="144" cy="150" r="118" fill="#ecdcc8" />
      <circle cx="144" cy="150" r="118" fill="none" stroke={GOLD} strokeWidth="1.5" strokeDasharray="2 5" />
      <g transform="translate(144 150) scale(2.2)">
        <HollyLeaf x={-26} y={-6} angle={-28} />
        <HollyLeaf x={26} y={-6} angle={28} flip />
        <HollyLeaf x={0} y={14} angle={90} />
        <Berries x={0} y={-10} />
      </g>
      {/* the ribbon, tied in a bow */}
      <g fill={RED} stroke="#6e1f24" strokeWidth="1.2">
        <path d="M144 236 C120 216 96 226 102 246 C108 262 130 252 144 240Z" />
        <path d="M144 236 C168 216 192 226 186 246 C180 262 158 252 144 240Z" />
        <path d="M140 240 L124 290 L134 286 L142 296 L144 244Z" />
        <path d="M148 240 L164 290 L154 286 L146 296 L144 244Z" />
        <circle cx="144" cy="239" r="7" />
      </g>
    </g>
  ),
  fireside: () => (
    <g>
      <rect width="288" height="300" fill="#4a2a24" />
      <rect y="0" width="288" height="300" fill="#c98f92" opacity="0.18" />
      {/* the chimney breast and the mantel */}
      <rect x="34" y="96" width="220" height="204" fill="#7a5a4a" />
      <rect x="22" y="86" width="244" height="16" rx="3" fill={WOOD} />
      <path d="M22 86 Q48 104 74 86 Q100 104 126 86 Q152 104 178 86 Q204 104 230 86 Q248 100 266 86" stroke={GREEN} strokeWidth="9" fill="none" strokeLinecap="round" />
      {[48, 100, 152, 204, 246].map((x) => (
        <circle key={x} cx={x} cy="94" r="3.4" fill={RED} />
      ))}
      <Candle x={46} y={84} h={30} />
      <Candle x={242} y={84} h={30} />
      <rect x="128" y="58" width="32" height="28" rx="3" fill={GOLD} />
      <circle cx="144" cy="72" r="9" fill={CREAM} />
      <path d="M144 72 V66 M144 72 L148 74" stroke="#2a2522" strokeWidth="1.4" />
      {/* the grate: an iron basket on legs, its logs, and the fire rising from them */}
      <path d="M84 300 V176 Q84 140 144 140 Q204 140 204 176 V300Z" fill="#1e1614" />
      <ellipse cx="144" cy="262" rx="56" ry="22" fill="#e9883a" opacity="0.18" />
      <path d="M104 272 C96 244 116 232 120 208 C128 228 136 230 140 196 C148 224 160 226 166 204 C172 232 190 244 182 272Z" fill="#e9883a" />
      <path d="M118 272 C116 254 128 246 130 232 C136 244 142 244 146 222 C152 242 162 246 166 272Z" fill={GOLD} />
      <path d="M132 272 C132 262 138 256 142 248 C146 256 152 262 150 272Z" fill="#fff1c4" />
      <rect x="98" y="257" width="92" height="13" rx="6.5" fill="#6b4a32" transform="rotate(-7 144 263)" />
      <rect x="98" y="257" width="92" height="13" rx="6.5" fill="#583826" transform="rotate(8 144 263)" />
      <ellipse cx="101" cy="269" rx="4" ry="6" fill="#c9a07a" transform="rotate(8 101 269)" />
      <ellipse cx="187" cy="268" rx="4" ry="6" fill="#c9a07a" transform="rotate(-7 187 268)" />
      <ellipse cx="144" cy="273" rx="40" ry="4" fill="#e9883a" opacity="0.85" />
      <path d="M92 266 H196 L190 282 H98Z" fill="#2a2522" opacity="0.35" />
      <path d="M92 266 H196 M98 282 H190 M92 266 L98 282 M196 266 L190 282 M112 266 V282 M128 266 V282 M144 266 V282 M160 266 V282 M176 266 V282" stroke="#2a2522" strokeWidth="3" strokeLinecap="round" />
      <path d="M102 282 L98 294 M186 282 L190 294" stroke="#2a2522" strokeWidth="4" strokeLinecap="round" />
      <rect x="34" y="294" width="220" height="6" fill="#3f2218" />
    </g>
  ),
};
