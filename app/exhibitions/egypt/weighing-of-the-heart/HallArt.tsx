/*
 * The people, gods and things of the hall of judgement, drawn in SVG in the
 * manner of the painted papyri: flat colours inside a dark outline; heads,
 * legs and feet in profile, shoulders seen from the front; men's skin a
 * red-brown and women's a yellow; white linen, broad collars of coloured
 * bands, black or striped wigs.
 *
 * Each figure stands on its own ground line at y = 0, facing right (flip it
 * with scale(-1 1) to face left), about 250 units tall:
 *
 *   Ani, the scribe, in a long pleated robe, head bowed, hands raised in praise
 *   Tutu, his wife, in a long white dress, beside him
 *   Anubis, the jackal-headed god, with his hand on the scales
 *   Thoth, the ibis-headed god, with his scribe's palette and reed pen
 *   Maat, the goddess of truth, seated, with her feather on her head
 *   Ammit, sitting on her haunches: the head of a crocodile, the front of a
 *     lion and the back of a hippopotamus (as the British Museum describes
 *     her in Ani's papyrus), drawn plainly, not to frighten
 *
 * and the heart (the jar-shaped heart the Egyptians drew) and the feather.
 */

export const INK = '#2b1d12';
const MAN = '#a5532d';
const WOMAN = '#e2b45c';
const LINEN = '#f6f1e3';
const BLUE = '#2f5f9e';
const GREEN = '#3f7d4c';
const RED = '#b23a2a';
const GOLD = '#d9a441';
const BLACK = '#1d1612';

const line = { stroke: INK, strokeWidth: 2.4, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

/** A broad collar across the shoulders: bands of colour. */
function Collar({ y = -196, w = 27 }: { y?: number; w?: number }) {
  return (
    <g>
      {[
        { d: 0, c: BLUE },
        { d: 5, c: GOLD },
        { d: 10, c: GREEN },
        { d: 15, c: RED },
      ].map((b) => (
        <path key={b.d} d={`M${-w + b.d * 0.3} ${y + b.d} Q0 ${y + 22 + b.d} ${w - b.d * 0.3} ${y + b.d}`} fill="none" stroke={b.c} strokeWidth="5" />
      ))}
      <path d={`M${-w} ${y} Q0 ${y + 40} ${w} ${y}`} fill="none" stroke={INK} strokeWidth="1.2" />
    </g>
  );
}

/** Legs mid-stride, feet in profile toward the right. */
function Legs({ skin, from = -112 }: { skin: string; from?: number }) {
  return (
    <g fill={skin} {...line}>
      <path d={`M-14 ${from} L-6 ${from} L-10 -8 L-18 -8 Z`} />
      <path d="M-28 0 L-6 0 L-8 -9 L-20 -9 Z" />
      <path d={`M2 ${from} L12 ${from} L22 -8 L14 -8 Z`} />
      <path d="M10 0 L36 0 L32 -6 L22 -9 L12 -9 Z" />
    </g>
  );
}

/** A torso, shoulders seen from the front. */
function Torso({ skin, top = -198, waist = -126 }: { skin: string; top?: number; waist?: number }) {
  return <path d={`M-29 ${top + 4} C-30 ${top} 30 ${top} 29 ${top + 4} L20 ${waist} L-18 ${waist} Z`} fill={skin} {...line} />;
}

/** A man's face in profile under a short black wig; bowed, it tips toward the scales. */
function ManHead({ skin, bow = 0 }: { skin: string; bow?: number }) {
  return (
    <g transform={`rotate(${bow} 0 -206)`}>
      <rect x="-6" y="-214" width="13" height="18" fill={skin} {...line} />
      <path d="M8 -250 C16 -248 20 -241 20 -236 L26 -229 L21 -226 L22 -221 L19 -219 L20 -214 C16 -209 10 -207 2 -209 L2 -240 Z" fill={skin} {...line} />
      <path d="M-20 -224 C-22 -246 -6 -258 10 -254 C16 -252 20 -248 20 -244 L8 -242 L6 -226 L-4 -206 L-18 -206 Z" fill={BLACK} {...line} />
      <path d="M9 -236 Q14 -239 18 -236 Q14 -233 9 -236 Z" fill="#fff" stroke={INK} strokeWidth="1.2" />
      <circle cx="14" cy="-236" r="1.6" fill={INK} />
      <path d="M8 -236 L2 -235" stroke={INK} strokeWidth="1.6" />
    </g>
  );
}

/** A striped wig falling behind a god's head and over the shoulders. */
function GodWig() {
  return (
    <g>
      <path d="M-18 -244 C-16 -256 6 -258 10 -248 L10 -196 L-20 -190 Z" fill={BLUE} {...line} />
      {[-240, -230, -220, -210, -200].map((y) => (
        <line key={y} x1="-19" y1={y} x2="9" y2={y - 2} stroke={GOLD} strokeWidth="2.4" />
      ))}
      <path d="M-18 -244 C-16 -256 6 -258 10 -248 L10 -196 L-20 -190 Z" fill="none" {...line} />
    </g>
  );
}

/** Ani: a scribe in a long pleated robe, his head bowed, both hands raised in praise. */
export function Ani() {
  return (
    <g>
      <Legs skin={MAN} />
      <Torso skin={MAN} />
      {/* the long robe, fine enough to see through */}
      <path d="M-24 -132 L22 -132 L34 -22 L-26 -22 Z" fill={LINEN} opacity="0.88" {...line} />
      {[-12, 0, 12, 22].map((x) => (
        <path key={x} d={`M${x} -128 L${x + 4 + x * 0.2} -26`} stroke="#c9bfa8" strokeWidth="1.4" />
      ))}
      <path d="M-20 -196 L20 -196 L20 -150 L-18 -150 Z" fill={LINEN} opacity="0.55" />
      <Collar />
      {/* the arms, raised in praise */}
      <g fill="none" stroke={MAN} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 -190 L44 -176 L56 -204" />
        <path d="M14 -182 L42 -162 L60 -180" />
      </g>
      <g fill="none" stroke={INK} strokeWidth="1.2">
        <path d="M18 -190 L44 -176 L56 -204" />
        <path d="M14 -182 L42 -162 L60 -180" />
      </g>
      <ManHead skin={MAN} bow={10} />
    </g>
  );
}

/** Tutu, Ani's wife, in a long white dress and a long black wig, one hand raised. */
export function Tutu() {
  return (
    <g>
      <g fill={WOMAN} {...line}>
        <path d="M-10 -12 L-2 -12 L-4 -2 L-12 -2 Z" />
        <path d="M-20 0 L0 0 L-2 -8 L-14 -8 Z" />
        <path d="M6 -12 L14 -12 L16 -2 L8 -2 Z" />
        <path d="M6 0 L30 0 L26 -6 L12 -8 Z" />
      </g>
      <path d="M-22 -188 C-24 -192 22 -192 22 -188 L26 -12 L-20 -12 Z" fill={LINEN} {...line} />
      <path d="M-20 -190 C-20 -194 20 -194 20 -190 L16 -132 L-16 -132 Z" fill={WOMAN} opacity="0.6" />
      <Collar y={-190} w={23} />
      <g fill="none" stroke={WOMAN} strokeWidth="7.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 -182 L38 -168 L48 -192" />
        <path d="M-12 -180 L-14 -140 L-6 -118" />
      </g>
      <g fill="none" stroke={INK} strokeWidth="1.1">
        <path d="M16 -182 L38 -168 L48 -192" />
      </g>
      <g transform="translate(0 6) scale(0.94)">
        <rect x="-6" y="-214" width="12" height="18" fill={WOMAN} {...line} />
        <path d="M8 -250 C16 -248 20 -241 20 -236 L25 -229 L20 -226 L21 -221 L18 -219 L19 -214 C16 -209 10 -207 2 -209 L2 -240 Z" fill={WOMAN} {...line} />
        <path d="M-22 -226 C-24 -248 -6 -260 10 -256 C16 -254 20 -250 20 -246 L8 -244 L6 -224 L4 -184 L-24 -176 Z" fill={BLACK} {...line} />
        <path d="M9 -236 Q14 -239 18 -236 Q14 -233 9 -236 Z" fill="#fff" stroke={INK} strokeWidth="1.2" />
        <circle cx="14" cy="-236" r="1.6" fill={INK} />
        <path d="M-20 -252 Q0 -262 18 -250" fill="none" stroke={RED} strokeWidth="3" />
      </g>
    </g>
  );
}

/** Anubis: a man's body in a white kilt, the black head of a jackal, one hand reaching to the scales. */
export function Anubis() {
  return (
    <g>
      <Legs skin={MAN} from={-120} />
      <path d="M-22 -132 L22 -132 L28 -82 L-22 -82 Z" fill={LINEN} {...line} />
      <path d="M8 -128 L30 -84 L10 -84 Z" fill="#ece4cf" {...line} />
      <path d="M-22 -134 L22 -134" stroke={RED} strokeWidth="4" />
      <Torso skin={MAN} />
      <Collar />
      <g fill="none" stroke={MAN} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 -190 L40 -168 L66 -168" />
        <path d="M-16 -186 L-20 -150 L-14 -126" />
      </g>
      <path d="M18 -190 L40 -168 L66 -168" fill="none" stroke={INK} strokeWidth="1.2" />
      <GodWig />
      {/* the jackal's head: tall ear, long snout, gold eye */}
      <path d="M-6 -244 L-2 -280 L10 -248 Z" fill={BLACK} {...line} />
      <path d="M-14 -226 C-16 -244 -6 -254 6 -252 C14 -250 18 -244 20 -240 L40 -233 C43 -230 41 -225 36 -225 L18 -222 C12 -214 2 -210 -8 -212 Z" fill={BLACK} {...line} />
      <path d="M6 -242 Q11 -245 15 -241 Q11 -239 6 -242 Z" fill={GOLD} />
      <circle cx="40" cy="-231" r="1.8" fill="#000" />
    </g>
  );
}

/** Thoth: a man's body in a kilt, the head of an ibis with its long curved beak, holding his palette and pen. */
export function Thoth() {
  return (
    <g>
      <Legs skin={MAN} from={-120} />
      <path d="M-22 -132 L22 -132 L28 -82 L-22 -82 Z" fill={LINEN} {...line} />
      <path d="M8 -128 L30 -84 L10 -84 Z" fill="#ece4cf" {...line} />
      <path d="M-22 -134 L22 -134" stroke={GREEN} strokeWidth="4" />
      <Torso skin={MAN} />
      <Collar />
      {/* the scribe's palette in one hand, the reed pen in the other */}
      <g fill="none" stroke={MAN} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 -190 L34 -160 L58 -170" />
        <path d="M14 -182 L36 -186 L56 -206" />
      </g>
      <rect x="54" y="-196" width="10" height="44" rx="2" transform="rotate(20 59 -174)" fill="#efe2bf" {...line} />
      <circle cx="56" cy="-186" r="2.4" fill={RED} />
      <circle cx="60" cy="-176" r="2.4" fill={BLACK} />
      <path d="M52 -212 L68 -194" stroke={INK} strokeWidth="2" />
      <GodWig />
      {/* the ibis's head and its long, curved beak */}
      <path d="M-12 -232 C-14 -248 -2 -256 8 -252 C16 -248 18 -240 16 -234 C8 -228 -2 -226 -12 -232 Z" fill={BLACK} {...line} />
      <path d="M12 -246 C34 -246 50 -232 58 -204 C52 -222 34 -236 12 -236 Z" fill={BLACK} {...line} />
      <circle cx="6" cy="-244" r="2.4" fill="#fff" />
    </g>
  );
}

/** Maat: seated on a low block, in a long dress, her feather of truth on her head, an ankh in her hand. */
export function Maat() {
  return (
    <g>
      {/* the block she sits on */}
      <path d="M-40 0 L-40 -64 L4 -64 L4 0 Z" fill="#c9a24a" {...line} />
      <path d="M-40 -14 L4 -14 M-24 -64 L-24 -14" stroke={INK} strokeWidth="1.2" />
      {/* her lap and legs, the dress to her ankles */}
      <path d="M-30 -64 L-32 -88 L24 -88 L30 -80 L32 -6 L18 -6 L16 -64 Z" fill={LINEN} {...line} />
      <path d="M16 0 L40 0 L36 -6 L18 -7 Z" fill={WOMAN} {...line} />
      <path d="M-26 -88 C-28 -92 18 -92 20 -88 L22 -158 C22 -162 -24 -162 -26 -158 Z" fill={WOMAN} {...line} />
      <path d="M-24 -126 L20 -126 L22 -88 L-26 -88 Z" fill={LINEN} {...line} />
      <path d="M-14 -158 L-10 -126 M10 -158 L6 -126" stroke={RED} strokeWidth="3" />
      <Collar y={-158} w={22} />
      <g fill="none" stroke={WOMAN} strokeWidth="7.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 -150 L28 -122 L44 -122" />
      </g>
      <path d="M14 -150 L28 -122 L44 -122" fill="none" stroke={INK} strokeWidth="1.1" />
      {/* an ankh in her hand */}
      <g transform="translate(50 -118)" fill="none" stroke={GOLD} strokeWidth="3.5">
        <ellipse cx="0" cy="-10" rx="5" ry="7" />
        <path d="M0 -3 L0 20 M-8 -2 L8 -2" />
      </g>
      <g transform="translate(-2 46)">
        <rect x="-6" y="-214" width="12" height="18" fill={WOMAN} {...line} />
        <path d="M8 -250 C16 -248 20 -241 20 -236 L25 -229 L20 -226 L21 -221 L18 -219 L19 -214 C16 -209 10 -207 2 -209 L2 -240 Z" fill={WOMAN} {...line} />
        <path d="M-22 -226 C-24 -248 -6 -260 10 -256 C16 -254 20 -250 20 -246 L8 -244 L6 -224 L4 -190 L-24 -184 Z" fill={BLUE} {...line} />
        <path d="M9 -236 Q14 -239 18 -236 Q14 -233 9 -236 Z" fill="#fff" stroke={INK} strokeWidth="1.2" />
        <circle cx="14" cy="-236" r="1.6" fill={INK} />
        <path d="M-20 -250 Q0 -260 18 -248" fill="none" stroke={RED} strokeWidth="3.5" />
        {/* the feather of truth */}
        <g transform="translate(-6 -256) rotate(-12)">
          <Feather />
        </g>
      </g>
    </g>
  );
}

/** Ammit, sitting on her haunches: crocodile head, lion front, hippopotamus back. */
export function Ammit() {
  return (
    <g>
      {/* the hippopotamus's back, and its short hind leg */}
      <path d="M-96 -12 C-108 -62 -82 -100 -40 -102 L-12 -100 L-12 -14 Z" fill="#c4705e" {...line} />
      <path d="M-84 -26 C-80 -10 -66 -4 -50 -4 L-50 0 L-90 0 Z" fill="#c4705e" {...line} />
      <path d="M-100 -40 C-112 -36 -114 -28 -108 -22" fill="none" {...line} />
      {/* the lion's front: tawny body, two straight forelegs and paws */}
      <path d="M-20 -100 C8 -110 34 -106 46 -94 L50 -56 L40 -36 L-20 -26 Z" fill="#d6a653" {...line} />
      <path d="M8 -50 L8 -4 L22 -4 L20 -50 Z M28 -52 L30 -4 L44 -4 L42 -54 Z" fill="#d6a653" {...line} />
      <path d="M6 0 L26 0 L24 -6 L8 -6 Z M28 0 L50 0 L46 -6 L30 -6 Z" fill="#d6a653" {...line} />
      {/* the mane around her neck */}
      <path d="M30 -118 C52 -128 74 -112 76 -90 C74 -72 60 -62 44 -64 C34 -80 26 -98 30 -118 Z" fill="#b5782c" {...line} />
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={`M${38 + i * 7} ${-112 + i * 3} L${34 + i * 7} ${-76 + i * 2}`} stroke="#7a4e18" strokeWidth="2" />
      ))}
      {/* the crocodile's head: a long green snout, a ridge of scales, a closed mouth */}
      <path d="M54 -114 C68 -124 88 -122 96 -116 L136 -106 C141 -102 139 -95 132 -95 L96 -92 C84 -86 66 -86 56 -96 Z" fill="#6f8f5a" {...line} />
      <path d="M96 -100 L134 -100" stroke={INK} strokeWidth="1.6" />
      <path d="M100 -100 l3 4 l3 -4 l3 4 l3 -4 l3 4 l3 -4 l3 4 l3 -4" fill="none" stroke="#f6f1e3" strokeWidth="1.4" />
      <path d="M62 -120 l4 -6 l4 5 l4 -6 l4 5 l4 -6 l4 5" fill="none" stroke="#3d5531" strokeWidth="2" />
      <circle cx="84" cy="-114" r="3.4" fill="#ffd34a" stroke={INK} strokeWidth="1.2" />
      <circle cx="84" cy="-114" r="1.3" fill={INK} />
    </g>
  );
}

/** The heart, as the Egyptians drew it: a jar-shaped heart with two little handles. */
export function Heart() {
  return (
    <g>
      <path d="M-11 -16 C-16 -8 -14 6 -7 13 L7 13 C14 6 16 -8 11 -16 L6 -20 L-6 -20 Z" fill="#c8402a" {...line} />
      <path d="M-12 -10 L-17 -12 M12 -10 L17 -12" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
      <rect x="-6" y="-24" width="12" height="5" rx="1.5" fill="#8a2a1a" {...line} />
      <path d="M-6 -10 Q0 -4 6 -10" fill="none" stroke="#f2b0a0" strokeWidth="1.6" />
    </g>
  );
}

/** The feather of Maat: an ostrich feather standing on its quill, its tip curling over. */
export function Feather() {
  return (
    <g>
      <path d="M0 0 C-6 -16 -6 -38 -2 -52 C2 -60 12 -62 14 -54 C10 -56 6 -52 7 -46 C10 -30 8 -12 4 0 Z" fill="#f8f4ea" {...line} />
      <path d="M2 -2 C0 -18 0 -34 4 -48" fill="none" stroke="#b7ad98" strokeWidth="1.4" />
    </g>
  );
}
