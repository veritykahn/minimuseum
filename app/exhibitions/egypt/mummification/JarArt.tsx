/*
 * The four canopic jars and the four organs, drawn in SVG.
 *
 * A jar stands on its own foot at 0,0 and is about 125 units tall: a pale
 * stone (calcite) body with a painted band down its front, and a lid
 * carved as its god's head, each head shown full face, the way the lids
 * look at you: Imset's human face, with a divine beard, under a striped
 * headcloth; Hapi's baboon face in its shaggy mane; Duamutef's black
 * jackal head with its tall ears; Qebehsenuef's falcon head with the dark
 * marks below its eyes. The lid can be lifted (`open`), and a filled jar
 * glows a little, its organ shown small on its band.
 *
 * The organs are simple, soft shapes (lungs, liver, stomach, intestines,
 * and the heart, which stays in the body), nothing a young visitor need
 * look away from.
 */

const INK = '#2a1a0c';

export type HeadKind = 'human' | 'baboon' | 'jackal' | 'falcon';
export type OrganId = 'liver' | 'lungs' | 'stomach' | 'intestines';

/** An organ, centred on 0,0, about 44 by 34. */
export function Organ({ id }: { id: string }) {
  switch (id) {
    case 'lungs':
      return (
        <g stroke="#8c4a52" strokeWidth="1.8" strokeLinejoin="round">
          <path d="M-3 -12 C-12 -16 -21 -6 -21 6 C-21 15 -12 17 -3 12 Z" fill="#e7a3a8" />
          <path d="M3 -12 C12 -16 21 -6 21 6 C21 15 12 17 3 12 Z" fill="#e7a3a8" />
          <path d="M0 -19 L0 -7 L-6 -2 M0 -7 L6 -2" fill="none" />
        </g>
      );
    case 'liver':
      return <path d="M-22 -3 C-20 -14 4 -16 20 -10 C25 -6 21 2 11 6 C1 12 -16 12 -22 4 Z" fill="#9a4330" stroke="#5a2216" strokeWidth="1.8" />;
    case 'heart':
      return (
        <g stroke="#6e1f1a" strokeWidth="1.8" strokeLinejoin="round">
          <path d="M-2 -14 C-12 -16 -18 -6 -16 4 C-14 12 -6 16 0 18 C8 14 16 6 15 -4 C14 -12 6 -16 -2 -14 Z" fill="#c8402a" />
          <path d="M-4 -14 L-6 -21 M3 -14 L5 -21" fill="none" strokeWidth="3" strokeLinecap="round" />
        </g>
      );
    case 'stomach':
      return <path d="M-14 -12 C-2 -16 8 -10 6 -2 C4 6 12 8 16 4 C18 12 6 18 -6 14 C-18 10 -22 -6 -14 -12 Z" fill="#e0997a" stroke="#8a4a30" strokeWidth="1.8" />;
    default:
      return (
        <g fill="none" strokeLinecap="round">
          <path d="M-14 -8 C-6 -14 6 -14 12 -8 C18 -2 10 4 2 0 C-6 -4 -13 4 -6 10 C0 14 10 12 15 6" stroke="#8a4a3c" strokeWidth="9" />
          <path d="M-14 -8 C-6 -14 6 -14 12 -8 C18 -2 10 4 2 0 C-6 -4 -13 4 -6 10 C0 14 10 12 15 6" stroke="#eab09c" strokeWidth="6" />
        </g>
      );
  }
}

/** A striped headcloth behind a god's face, from the lid's rim (y = 0) up. */
function Headcloth() {
  return (
    <g>
      <path d="M-25 0 L-27 -26 C-25 -45 -12 -53 0 -53 C12 -53 25 -45 27 -26 L25 0 Z" fill="#1d3f7c" stroke={INK} strokeWidth="1.8" />
      {[-44, -36, -28, -20, -12, -4].map((y) => (
        <line key={y} x1="-27" y1={y} x2="27" y2={y} stroke="#e7c46a" strokeWidth="2.2" />
      ))}
      <path d="M-25 0 L-27 -26 C-25 -45 -12 -53 0 -53 C12 -53 25 -45 27 -26 L25 0 Z" fill="none" stroke={INK} strokeWidth="1.8" />
    </g>
  );
}

/** A god's head, full face, for a lid: its rim at y = 0. */
export function JarHead({ kind }: { kind: HeadKind }) {
  if (kind === 'human')
    return (
      <g>
        <Headcloth />
        <ellipse cx="0" cy="-25" rx="14" ry="18" fill="#c98b5a" stroke={INK} strokeWidth="1.6" />
        <path d="M-10 -33 Q-6 -36 -2 -33 M2 -33 Q6 -36 10 -33" fill="none" stroke={INK} strokeWidth="1.6" />
        <path d="M-10 -28 Q-6 -31 -2 -28 Q-6 -26 -10 -28 Z M2 -28 Q6 -31 10 -28 Q6 -26 2 -28 Z" fill="#fff" stroke={INK} strokeWidth="1.2" />
        <circle cx="-6" cy="-28" r="1.5" fill={INK} />
        <circle cx="6" cy="-28" r="1.5" fill={INK} />
        <path d="M0 -26 L-2 -19 L2 -19" fill="none" stroke={INK} strokeWidth="1" />
        <path d="M-4 -14 Q0 -12 4 -14" fill="none" stroke="#8a2a1a" strokeWidth="1.6" />
        {/* the god's plaited beard */}
        <path d="M-4 -9 L4 -9 L3.5 4 Q0 7 -3.5 4 Z" fill="#1d3f7c" stroke={INK} strokeWidth="1.2" />
        <path d="M-3.5 -5 L3.5 -5 M-3.5 -1 L3.5 -1" stroke="#e7c46a" strokeWidth="1" />
      </g>
    );
  if (kind === 'baboon')
    return (
      <g>
        {/* the shaggy mane */}
        <path d="M-27 0 C-33 -18 -27 -44 0 -52 C27 -44 33 -18 27 0 Z" fill="#8e9a84" stroke={INK} strokeWidth="1.8" />
        <path d="M-22 -8 l-6 -4 M-24 -20 l-6 -2 M-20 -32 l-5 -5 M22 -8 l6 -4 M24 -20 l6 -2 M20 -32 l5 -5 M-8 -44 l-2 -6 M8 -44 l2 -6" stroke="#5e6a56" strokeWidth="2" strokeLinecap="round" />
        {/* the face and its long muzzle */}
        <path d="M-12 -34 C-12 -42 12 -42 12 -34 L9 -16 C8 -4 -8 -4 -9 -16 Z" fill="#b98566" stroke={INK} strokeWidth="1.6" />
        <path d="M-12 -33 Q0 -38 12 -33" fill="none" stroke="#6e4a36" strokeWidth="3" />
        <circle cx="-5" cy="-29" r="2.2" fill="#e3b24a" stroke={INK} strokeWidth="1" />
        <circle cx="5" cy="-29" r="2.2" fill="#e3b24a" stroke={INK} strokeWidth="1" />
        <ellipse cx="0" cy="-11" rx="6.5" ry="5" fill="#9a6650" stroke={INK} strokeWidth="1.2" />
        <circle cx="-2.4" cy="-11" r="1.2" fill={INK} />
        <circle cx="2.4" cy="-11" r="1.2" fill={INK} />
      </g>
    );
  if (kind === 'jackal')
    return (
      <g>
        <Headcloth />
        {/* the tall ears */}
        <path d="M-12 -30 L-17 -66 L-2 -40 Z M12 -30 L17 -66 L2 -40 Z" fill="#1b1512" stroke={INK} strokeWidth="1.6" />
        <path d="M-11 -36 L-14 -58 L-5 -41 Z M11 -36 L14 -58 L5 -41 Z" fill="#6a3a2a" />
        {/* the black head and narrow muzzle */}
        <path d="M-13 -10 C-15 -26 -10 -38 0 -40 C10 -38 15 -26 13 -10 C8 -2 -8 -2 -13 -10 Z" fill="#1b1512" stroke={INK} strokeWidth="1.6" />
        <path d="M-5 -20 L0 -3 L5 -20" fill="#3b302a" />
        <path d="M-10 -27 Q-6 -31 -2 -27 Q-6 -25 -10 -27 Z M2 -27 Q6 -31 10 -27 Q6 -25 2 -27 Z" fill="#e7c46a" />
        <circle cx="0" cy="-5" r="2.4" fill="#000" />
      </g>
    );
  return (
    <g>
      <Headcloth />
      {/* the falcon's head: blue-grey feathers, a pale cheek, big round eyes, the hooked beak */}
      <ellipse cx="0" cy="-28" rx="17" ry="19" fill="#5f7291" stroke={INK} strokeWidth="1.6" />
      <path d="M-12 -24 C-10 -14 -4 -10 0 -10 C4 -10 10 -14 12 -24 C8 -18 -8 -18 -12 -24 Z" fill="#e8e2d0" />
      <circle cx="-7" cy="-31" r="4.6" fill="#e7c46a" stroke={INK} strokeWidth="1.4" />
      <circle cx="7" cy="-31" r="4.6" fill="#e7c46a" stroke={INK} strokeWidth="1.4" />
      <circle cx="-7" cy="-31" r="2" fill={INK} />
      <circle cx="7" cy="-31" r="2" fill={INK} />
      {/* the dark marks below the eyes */}
      <path d="M-8 -26 C-10 -20 -11 -15 -9 -11 M8 -26 C10 -20 11 -15 9 -11" fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M-4 -27 C-4 -19 0 -13 0 -11 C0 -13 4 -19 4 -27 Z" fill="#e3b24a" stroke={INK} strokeWidth="1.2" />
      <path d="M-1.5 -16 Q0 -10 1.5 -16" fill="#2a1a0c" />
    </g>
  );
}

/** A canopic jar with its god's head as the lid. */
export function Jar({ head, organ, full = false, open = false, id }: { head: HeadKind; organ: string; full?: boolean; open?: boolean; id: string }) {
  return (
    <g className={`egm-jar ${full ? 'is-full' : ''} ${open ? 'is-open' : ''}`}>
      <defs>
        <linearGradient id={`${id}-stone`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#b8a98a" />
          <stop offset="0.35" stopColor="#f4ecd8" />
          <stop offset="0.6" stopColor="#e6dabd" />
          <stop offset="1" stopColor="#a8987a" />
        </linearGradient>
      </defs>
      {full && <ellipse cx="0" cy="-40" rx="44" ry="56" fill="rgba(255, 210, 110, 0.28)" />}
      <rect x="-19" y="-2" width="38" height="6" rx="2" fill="#a8987a" stroke={INK} strokeWidth="1.4" />
      <path d="M-22 0 C-31 -10 -33 -42 -25 -62 L-21 -70 L21 -70 L25 -62 C33 -42 31 -10 22 0 Z" fill={`url(#${id}-stone)`} stroke={INK} strokeWidth="1.8" />
      {/* the painted band down the front */}
      <rect x="-7" y="-62" width="14" height="52" fill="#efe4c6" stroke="#8a7a5c" strokeWidth="1" />
      {full ? (
        <g transform="translate(0 -36) scale(0.42)">
          <Organ id={organ} />
        </g>
      ) : (
        [-54, -44, -34, -24].map((y) => <line key={y} x1="-4" y1={y} x2="4" y2={y} stroke="#1d3f7c" strokeWidth="2" />)
      )}
      {/* the lid: the god's head, lifted when the jar is opened */}
      <g className="egm-jar-lid" transform={open ? 'translate(-4 -124) rotate(-10)' : 'translate(0 -68)'}>
        <rect x="-22" y="-4" width="44" height="7" rx="2" fill="#d8c9a6" stroke={INK} strokeWidth="1.4" />
        <JarHead kind={head} />
      </g>
      {open && (
        <g transform="translate(0 -84) scale(1.1)">
          <Organ id={organ} />
        </g>
      )}
    </g>
  );
}
