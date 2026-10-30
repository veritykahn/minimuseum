import { useId } from 'react';
import { PAPERS, PICTURES, type BorderId, type PaperId, type PictureId } from './cardText';

/*
 * The card, drawn in SVG at the printed card's proportions (4" × 5.25", a
 * quarter of a Letter page): its front, with the chosen picture in an
 * arched panel, the border and the greeting; and its inside, with the
 * visitor's words. The pictures, and the paper-lace and gilt borders, are
 * the owner's illustrations, made with Leonardo.Ai in the style of the
 * 1840s–1870s cards (not credited on the page, at the owner's request); none claims to be, or to copy,
 * a real card. The holly and plain borders are drawn.
 */

export const CARD = { w: 400, h: 525 };
/** The arched panel the picture sits in: wide on the drawn borders, inside the opening of the illustrated ones. */
const PANEL = { x: 56, y: 58, w: 288, h: 300 };
const PANEL_FRAMED = { x: 88, y: 92, w: 224, h: 254 };

/**
 * The illustrated borders, laid over the card: the image's size and place in
 * the card's units, set so its paper (not its transparent margin) meets the
 * card's edges. Their centres are transparent, so the paper shows through.
 */
const BORDER_ART: Partial<Record<BorderId, { src: string; x: number; y: number; w: number; h: number }>> = {
  // 946 × 1250, its lace from (3, 61) to (885, 1188).
  lace: { src: '/exhibitions/victorian/christmas-card/border-lace.webp', x: -1.4, y: -28.4, w: 429, h: 582 },
  // 997 × 1250, edge to edge.
  gilt: { src: '/exhibitions/victorian/christmas-card/border-gilt.webp', x: 0, y: 0, w: 400, h: 525 },
};

type Paper = (typeof PAPERS)[number];
const paperOf = (id: PaperId) => PAPERS.find((p) => p.id === id)!;

export function CardFront({ picture, border, paper, greeting, label }: { picture: PictureId; border: BorderId; paper: PaperId; greeting: string; label?: string }) {
  const p = paperOf(paper);
  const uid = useId().replace(/:/g, '');
  const art = BORDER_ART[border];
  const P = art ? PANEL_FRAMED : PANEL;
  const top = P.y + P.w / 2;
  const arch = `M${P.x} ${P.y + P.h} V${top} A${P.w / 2} ${P.w / 2} 0 0 1 ${P.x + P.w} ${top} V${P.y + P.h}Z`;
  const pic = PICTURES.find((x) => x.id === picture)!;
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
        <image href={pic.src} x={P.x} y={P.y} width={P.w} height={P.h} preserveAspectRatio={`xMidYMid slice`} />
      </g>
      <path d={arch} fill="none" stroke={`url(#vcc-gilt-${uid})`} strokeWidth="5" />
      <path d={arch} fill="none" stroke={p.ink} strokeOpacity="0.5" strokeWidth="1" />
      <Greeting text={greeting} paper={p} framed={!!art} />
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

/** The greeting under the picture; inside an illustrated border, set smaller to sit within its opening. */
function Greeting({ text, paper, framed = false }: { text: string; paper: Paper; framed?: boolean }) {
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
  const size = (lines.length > 1 ? (t.length > 44 ? 21 : 26) : t.length > 16 ? 28 : 34) * (framed ? 0.76 : 1);
  return (
    <g className="vcc-greeting">
      {lines.map((l, i) => (
        <text key={i} x="200" y={(lines.length > 1 ? (framed ? 392 : 408) : framed ? 408 : 425) + i * (size * 1.22)} textAnchor="middle" fill={paper.ink} fontSize={size}>
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
  const art = BORDER_ART[id];
  if (art && !quiet) return <image href={art.src} x={art.x} y={art.y} width={art.w} height={art.h} preserveAspectRatio="none" />;
  if (art) {
    // Inside the card, where the words need the room: a gilt double rule for the gilt, a pricked one for the lace.
    return id === 'gilt' ? (
      <g>
        <rect x="14" y="14" width={W - 28} height={H - 28} fill="none" stroke={gilt} strokeWidth="7" />
        <rect x="26" y="26" width={W - 52} height={H - 52} fill="none" stroke={gilt} strokeWidth="1.6" />
      </g>
    ) : (
      <rect x="22" y="22" width={W - 44} height={H - 44} fill="none" stroke={paper.accent} strokeOpacity="0.7" strokeWidth="2" strokeDasharray="1 6" strokeLinecap="round" />
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

/* ───────── The holly, for the holly border and the sprig ───────── */

const GREEN = '#2f4a32';
const LEAF = '#3f6446';
const RED = '#a8343a';

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
