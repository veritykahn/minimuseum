/*
 * The people and gods of the hall of judgement, in the manner of the
 * painted papyri: the owner's pictures (made with Leonardo.Ai and cut out
 * of their white backgrounds; not credited on the page, at the owner's
 * request), flat colours inside a dark outline, all facing right. Each
 * stands on its own ground line at y = 0, centred on x = 0 (flip it with
 * scale(-1 1) to face left):
 *
 *   Ani, the scribe, in a long pleated robe, hands raised in praise
 *   Tutu, his wife, in a long white dress, beside him
 *   Anubis, the jackal-headed god, at the scales
 *   Thoth, the ibis-headed god, with his scribe's palette and reed pen
 *   Maat, the goddess of truth, seated, with her feather on her head
 *   Ammit, sitting on her haunches: the head of a crocodile, the front of a
 *     lion and the back of a hippopotamus (as the British Museum describes
 *     her in Ani's papyrus)
 *
 * The heart (the jar-shaped heart the Egyptians drew) and the feather are
 * drawn in SVG.
 */

export const INK = '#2b1d12';

const line = { stroke: INK, strokeWidth: 2.4, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

/**
 * Each figure's picture, in public/exhibitions/egypt/hall/{name}.webp: its
 * size in the cut-out's own pixels, and how tall it stands in the hall's
 * units, so all six keep one papyrus scale (the people and gods standing
 * about as tall as each other, Maat seated, Ammit crouching low).
 */
const FIGURES = {
  ani: { w: 421, h: 1000, tall: 250 },
  tutu: { w: 408, h: 1000, tall: 245 },
  anubis: { w: 435, h: 1000, tall: 262 },
  thoth: { w: 472, h: 1000, tall: 256 },
  maat: { w: 529, h: 923, tall: 238 },
  ammit: { w: 788, h: 656, tall: 132 },
};

function Figure({ name }: { name: keyof typeof FIGURES }) {
  const { w, h, tall } = FIGURES[name];
  const width = (w / h) * tall;
  return <image href={`/exhibitions/egypt/hall/${name}.webp`} x={-width / 2} y={-tall} width={width} height={tall} />;
}

/** Ani, the scribe, in a long pleated robe, hands raised in praise. */
export function Ani() {
  return <Figure name="ani" />;
}

/** Tutu, his wife, in a long white dress, a sistrum in her hand. */
export function Tutu() {
  return <Figure name="tutu" />;
}

/** Anubis, the jackal-headed god, his hands held out to the scales. */
export function Anubis() {
  return <Figure name="anubis" />;
}

/** Thoth, the ibis-headed god, with his palette and reed pen. */
export function Thoth() {
  return <Figure name="thoth" />;
}

/** Maat, the goddess of truth, seated on her throne, her feather on her head. */
export function Maat() {
  return <Figure name="maat" />;
}

/** Ammit, sitting on her haunches: crocodile head, lion front, hippopotamus back. */
export function Ammit() {
  return <Figure name="ammit" />;
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
