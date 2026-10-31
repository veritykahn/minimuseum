/*
 * The keepsakes along Violet's thread, drawn in the posters' navy with a
 * touch of poster 1's orange: one small object for each place or moment of
 * her life. Pictures only, with no claim of their own (each stands for the
 * poster's words beside it), and decorative: the stop's name is its label.
 */

export type KeepsakeId =
  | 'spool'
  | 'house'
  | 'certificate'
  | 'machine'
  | 'rabbit'
  | 'rings'
  | 'coat'
  | 'piano'
  | 'window'
  | 'rose'
  | 'cauliflower'
  | 'radio'
  | 'needle';

/** Each keepsake's name, for choosing one for a stop of your own (OwnTimeline). */
export const KEEPSAKE_NAMES: Record<KeepsakeId, string> = {
  spool: 'Reel of thread',
  house: 'House',
  certificate: 'Certificate',
  machine: 'Sewing machine',
  rabbit: 'Rabbit',
  rings: 'Rings',
  coat: 'Coat',
  piano: 'Piano',
  window: 'Window',
  rose: 'Rose',
  cauliflower: 'Cauliflower',
  radio: 'Radio',
  needle: 'Needle and thread',
};
export const KEEPSAKE_IDS = Object.keys(KEEPSAKE_NAMES) as KeepsakeId[];

const ink = { fill: 'none', stroke: 'currentColor', strokeWidth: 2.4, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
const warm = { fill: 'var(--whv-orange)', stroke: 'currentColor', strokeWidth: 2.4, strokeLinejoin: 'round' } as const;
const soft = { fill: 'var(--whv-rose-soft)', stroke: 'currentColor', strokeWidth: 2.4, strokeLinejoin: 'round' } as const;

const DRAWINGS: Record<KeepsakeId, React.ReactNode> = {
  // A reel of thread: where the thread of her life begins.
  spool: (
    <>
      <rect x="18" y="20" width="28" height="24" {...warm} />
      <path d="M18 26h28M18 32h28M18 38h28" {...ink} strokeWidth={1.6} />
      <rect x="13" y="13" width="38" height="7" rx="2" {...soft} />
      <rect x="13" y="44" width="38" height="7" rx="2" {...soft} />
      <path d="M46 34c6 2 8 8 4 14" {...ink} />
    </>
  ),
  // A London terraced house.
  house: (
    <>
      <path d="M12 30 32 14l20 16" {...ink} />
      <rect x="16" y="29" width="32" height="23" {...soft} />
      <rect x="40" y="12" width="5" height="10" {...ink} />
      <rect x="28" y="38" width="8" height="14" {...warm} />
      <rect x="19" y="33" width="6" height="6" {...ink} />
      <rect x="39" y="33" width="6" height="6" {...ink} />
    </>
  ),
  // A school certificate, rolled at the ends, with its ribbon.
  certificate: (
    <>
      <path d="M14 16h32a4 4 0 0 1 4 4v28H18a4 4 0 0 1-4-4z" {...soft} />
      <path d="M20 24h22M20 30h22M20 36h14" {...ink} strokeWidth={1.8} />
      <circle cx="44" cy="44" r="6" {...warm} />
      <path d="m41 49-2 7 5-3 5 3-2-7" {...ink} strokeWidth={1.8} />
    </>
  ),
  // A sewing machine.
  machine: (
    <>
      <rect x="10" y="46" width="44" height="6" rx="1.5" {...soft} />
      <path d="M16 46V24a6 6 0 0 1 6-6h24a6 6 0 0 1 6 6v6H26v16" {...warm} />
      <path d="M46 30v10M43 40h6" {...ink} />
      <circle cx="54" cy="24" r="5" {...ink} />
    </>
  ),
  // A rabbit, sitting up.
  rabbit: (
    <>
      <path d="M24 52c-8 0-12-6-10-13 2-6 8-9 14-9 3-6 9-8 13-5 4 3 3 9-1 12 3 5 1 15-8 15z" {...soft} />
      <path d="M33 24c-2-6-1-13 2-14s4 7 3 14M38 25c1-6 5-12 8-11s0 8-4 13" {...soft} />
      <circle cx="38" cy="30" r="1.6" fill="currentColor" />
      <circle cx="14" cy="44" r="3.5" {...warm} />
    </>
  ),
  // Two wedding rings.
  rings: (
    <>
      <circle cx="25" cy="36" r="12" {...ink} strokeWidth={3.4} />
      <circle cx="39" cy="32" r="12" fill="none" stroke="var(--whv-orange)" strokeWidth={3.4} />
      <path d="M39 18l-3-4h6z" {...warm} strokeWidth={1.6} />
    </>
  ),
  // A child's coat.
  coat: (
    <>
      <path d="M24 12h16l12 10-5 7-5-4v27H22V25l-5 4-5-7z" {...soft} />
      <path d="M32 14v38" {...ink} strokeWidth={1.8} />
      <circle cx="36" cy="26" r="1.8" {...warm} strokeWidth={1.2} />
      <circle cx="36" cy="34" r="1.8" {...warm} strokeWidth={1.2} />
      <circle cx="36" cy="42" r="1.8" {...warm} strokeWidth={1.2} />
    </>
  ),
  // An upright piano.
  piano: (
    <>
      <rect x="10" y="14" width="44" height="26" rx="2" {...soft} />
      <rect x="10" y="40" width="44" height="8" {...ink} fill="var(--whv-paper)" />
      <path d="M16 40v8M22 40v8M28 40v8M34 40v8M40 40v8M46 40v8" {...ink} strokeWidth={1.4} />
      <path d="M19 40v5M25 40v5M37 40v5M43 40v5" stroke="currentColor" strokeWidth={3} />
      <path d="M14 48v6M50 48v6" {...ink} />
      <path d="M26 22c2-3 6-3 6 0v8M32 30a2.5 2.5 0 1 1-2.5-2" {...ink} stroke="var(--whv-orange)" strokeWidth={2} />
    </>
  ),
  // A window taped against the blast.
  window: (
    <>
      <rect x="14" y="12" width="36" height="40" {...soft} />
      <path d="M32 12v40M14 32h36" {...ink} />
      <path d="M17 15l12 14M29 15 17 29M35 15l12 14M47 15 35 29M17 35l12 14M29 35 17 49M35 35l12 14M47 35 35 49" stroke="var(--whv-orange)" strokeWidth={2} strokeLinecap="round" />
    </>
  ),
  // A rose.
  rose: (
    <>
      <path d="M32 34v20M32 46c-6-1-10-5-10-9 5 0 9 3 10 9z" {...ink} />
      <path d="M32 34c-9 0-13-6-12-13 3 1 5 0 7-3 2 3 3 3 5 2 2 1 3 1 5-2 2 3 4 4 7 3 1 7-3 13-12 13z" {...warm} />
      <path d="M28 24c2 3 6 3 8 0" {...ink} strokeWidth={1.8} />
    </>
  ),
  // A cauliflower, its inner leaves curled over the curd.
  cauliflower: (
    <>
      <path d="M12 38c2 10 10 15 20 15s18-5 20-15c-6 4-14 5-20 5s-14-1-20-5z" {...ink} fill="var(--whv-green)" />
      <path d="M18 34c0-10 6-17 14-17s14 7 14 17c-4 4-24 4-28 0z" {...soft} fill="var(--whv-paper)" />
      <path d="M25 26a3 3 0 0 1 5 0M33 23a3 3 0 0 1 5 0M28 31a3 3 0 0 1 5 0" {...ink} strokeWidth={1.6} />
    </>
  ),
  // A wireless set.
  radio: (
    <>
      <path d="M12 52V28a16 16 0 0 1 40 0v24z" {...soft} />
      <circle cx="26" cy="36" r="8" {...ink} fill="var(--whv-paper)" />
      <path d="M21 33h10M20 37h12M21 41h10" {...ink} strokeWidth={1.4} />
      <circle cx="43" cy="34" r="3.4" {...warm} />
      <circle cx="43" cy="44" r="3.4" {...ink} />
    </>
  ),
  // A needle and its thread.
  needle: (
    <>
      <path d="M14 50 48 16" {...ink} strokeWidth={3} />
      <ellipse cx="46" cy="18" rx="3.6" ry="1.6" transform="rotate(-45 46 18)" fill="var(--whv-paper)" stroke="currentColor" strokeWidth={1.4} />
      <path d="M46 18c8-6 10 6 2 10-8 4-14 10-6 16" fill="none" stroke="var(--whv-orange)" strokeWidth={2.4} strokeLinecap="round" />
    </>
  ),
};

export default function Keepsake({ id, className }: { id: KeepsakeId; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      {DRAWINGS[id]}
    </svg>
  );
}
