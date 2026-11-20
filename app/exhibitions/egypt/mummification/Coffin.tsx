/*
 * A painted coffin in the shape of a wrapped body (an anthropoid coffin),
 * standing upright in its own units: 480 long, the head at the top, centred
 * on x = 0. Lay it down with a transform. The lid and the open base are the
 * owner's pictures (made with Leonardo.Ai and cut out of their white
 * backgrounds; not credited on the page, at the owner's request), the base
 * made to the lid's outline. COFFIN_OUTLINE is the same shape drawn plainly,
 * 120 wide, for the wrapped mummy that is laid in it.
 */

/** The coffin's outline: the head, the shoulders, the long taper to the feet. */
export const COFFIN_OUTLINE =
  'M0 0 C34 0 56 22 58 58 C60 86 54 104 56 124 C60 160 58 230 52 300 C48 360 40 410 36 440 C34 466 22 480 0 480 C-22 480 -34 466 -36 440 C-40 410 -48 360 -52 300 C-58 230 -60 160 -56 124 C-54 104 -60 86 -58 58 C-56 22 -34 0 0 0 Z';

const LENGTH = 480;
/** The pictures' widths at the coffin's length, from the cut-outs' own pixels. */
const LID_W = Math.round((269 / 1000) * LENGTH);
const BASE_W = Math.round((312 / 1000) * LENGTH);

/** The closed lid, painted. `id` is kept for callers that draw it more than once. */
export function CoffinLid({ id }: { id: string }) {
  return <image data-part={id} href="/exhibitions/egypt/coffin/lid.webp" x={-LID_W / 2} y="0" width={LID_W} height={LENGTH} />;
}

/** The open coffin: the trough the mummy is laid in. */
export function CoffinBase() {
  return <image href="/exhibitions/egypt/coffin/base.webp" x={-BASE_W / 2} y="0" width={BASE_W} height={LENGTH} />;
}
