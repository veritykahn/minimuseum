/*
 * Design a doll: every choice the designer offers, and the doll they make.
 *
 * The range is wide on purpose (twelve skin tones from deepest to lightest,
 * twelve hair styles from an afro to a hijab, eyes, noses, smiles, freckles
 * and vitiligo, glasses, hearing aids and a cochlear implant, a wheelchair,
 * a prosthetic leg and a white cane), so that every child can make a doll
 * that looks like them or someone they love. Features are drawn gently and
 * all to the same scale: no choice exaggerates a face.
 *
 * The doll is the Mini Museum's own: a round-headed, child-proportioned toy
 * drawn for this room (Doll.tsx). It does not imitate any maker's doll,
 * logo or packaging.
 */

export type Choice = { id: string; label: string };
export type Swatch = Choice & { color: string };

/* Skin: deepest to lightest, named by number so no tone is a "default". */
const SKIN_HEX = ['#3b2219', '#4a2c21', '#5c3a28', '#6f4430', '#865336', '#9c6440', '#b07650', '#c68a5f', '#d49e76', '#e2b595', '#edc9ae', '#f6decb'];
export const SKIN: Swatch[] = SKIN_HEX.map((color, i) => ({
  id: `tone-${i + 1}`,
  label: `Skin tone ${i + 1} of ${SKIN_HEX.length}${i === 0 ? ', deepest' : i === SKIN_HEX.length - 1 ? ', lightest' : ''}`,
  color,
}));

export const HAIR_STYLES: Choice[] = [
  { id: 'afro', label: 'Afro' },
  { id: 'puffs', label: 'Afro puffs' },
  { id: 'braids', label: 'Box braids' },
  { id: 'locs', label: 'Locs' },
  { id: 'twists', label: 'Twists' },
  { id: 'knots', label: 'Bantu knots' },
  { id: 'curls', label: 'Curls' },
  { id: 'straight', label: 'Long and straight' },
  { id: 'short', label: 'Short' },
  { id: 'shaved', label: 'Shaved' },
  { id: 'wrap', label: 'Head wrap' },
  { id: 'hijab', label: 'Hijab' },
];
/** Styles that cover the hair: they take a fabric color instead. */
export const COVERED = new Set(['wrap', 'hijab']);

export const HAIR_COLORS: Swatch[] = [
  { id: 'black', label: 'Black', color: '#1b1512' },
  { id: 'dark-brown', label: 'Dark brown', color: '#3a2418' },
  { id: 'brown', label: 'Brown', color: '#5e3b23' },
  { id: 'auburn', label: 'Auburn', color: '#8a3b1e' },
  { id: 'blond', label: 'Blond', color: '#d2a856' },
  { id: 'gray', label: 'Gray', color: '#a8a29a' },
  { id: 'white', label: 'White', color: '#ece8e0' },
  { id: 'pink', label: 'Pink', color: '#e85b9a' },
  { id: 'blue', label: 'Blue', color: '#2f6fd6' },
  { id: 'purple', label: 'Purple', color: '#7a4cc2' },
];

export const EYES: Choice[] = [
  { id: 'round', label: 'Round' },
  { id: 'almond', label: 'Almond' },
  { id: 'hooded', label: 'Hooded' },
];
export const EYE_COLORS: Swatch[] = [
  { id: 'dark-brown', label: 'Dark brown', color: '#2a1a14' },
  { id: 'brown', label: 'Brown', color: '#5b3a22' },
  { id: 'hazel', label: 'Hazel', color: '#7c6a33' },
  { id: 'green', label: 'Green', color: '#3f7a4a' },
  { id: 'blue', label: 'Blue', color: '#3d6fa8' },
  { id: 'gray', label: 'Gray', color: '#6c7a84' },
];
export const NOSES: Choice[] = [
  { id: 'rounded', label: 'Rounded' },
  { id: 'broad', label: 'Broad' },
  { id: 'narrow', label: 'Narrow' },
];
export const MOUTHS: Choice[] = [
  { id: 'smile', label: 'Smile' },
  { id: 'full', label: 'Full smile' },
  { id: 'grin', label: 'Big grin' },
  { id: 'calm', label: 'Calm' },
];
export const MARKS: Choice[] = [
  { id: 'none', label: 'None' },
  { id: 'freckles', label: 'Freckles' },
  { id: 'vitiligo', label: 'Vitiligo' },
  { id: 'both', label: 'Freckles and vitiligo' },
];

export const GLASSES: Choice[] = [
  { id: 'none', label: 'No glasses' },
  { id: 'round', label: 'Round glasses' },
  { id: 'square', label: 'Square glasses' },
];
export const HEARING: Choice[] = [
  { id: 'none', label: 'None' },
  { id: 'aids', label: 'Hearing aids' },
  { id: 'implant', label: 'Cochlear implant' },
];
export const MOBILITY: Choice[] = [
  { id: 'none', label: 'Walking' },
  { id: 'wheelchair', label: 'Wheelchair' },
  { id: 'prosthetic', label: 'Prosthetic leg' },
  { id: 'cane', label: 'White cane' },
];

export const OUTFITS: Choice[] = [
  { id: 'tee', label: 'T-shirt and jeans' },
  { id: 'dress', label: 'Dress' },
  { id: 'hoodie', label: 'Hoodie and joggers' },
  { id: 'overalls', label: 'Overalls' },
  { id: 'jumpsuit', label: 'Jumpsuit' },
  { id: 'sports', label: 'Sports kit' },
];
/* The posters' palette, and a few more. */
export const CLOTH_COLORS: Swatch[] = [
  { id: 'lime', label: 'Lime', color: '#c5da3b' },
  { id: 'pink', label: 'Pink', color: '#ee8dbf' },
  { id: 'red', label: 'Red', color: '#d7262e' },
  { id: 'orange', label: 'Orange', color: '#f7a21b' },
  { id: 'yellow', label: 'Yellow', color: '#f5d33a' },
  { id: 'green', label: 'Green', color: '#1e8a4e' },
  { id: 'blue', label: 'Blue', color: '#2f6fd6' },
  { id: 'purple', label: 'Purple', color: '#7a4cc2' },
  { id: 'black', label: 'Black', color: '#1d1d1d' },
  { id: 'white', label: 'White', color: '#f7f5ee' },
];

export type Doll = {
  skin: string;
  hair: string;
  hairColor: string;
  fabric: string;
  eyes: string;
  eyeColor: string;
  nose: string;
  mouth: string;
  marks: string;
  glasses: string;
  hearing: string;
  mobility: string;
  outfit: string;
  clothes: string;
  name: string;
};

export const FIRST_DOLL: Doll = {
  skin: 'tone-4',
  hair: 'puffs',
  hairColor: 'black',
  fabric: 'orange',
  eyes: 'round',
  eyeColor: 'dark-brown',
  nose: 'rounded',
  mouth: 'smile',
  marks: 'none',
  glasses: 'none',
  hearing: 'none',
  mobility: 'none',
  outfit: 'dress',
  clothes: 'red',
  name: '',
};

/** The doll's choices, by group, as the designer lays them out. */
export const GROUPS = [
  { id: 'skin', label: 'Skin', fields: [{ key: 'skin', label: 'Skin tone', options: SKIN }] },
  {
    id: 'hair',
    label: 'Hair',
    fields: [
      { key: 'hair', label: 'Hair style', options: HAIR_STYLES },
      // A wrap or hijab covers the hair, so it takes the fabric's color in place of the hair's.
      { key: 'hairColor', label: 'Hair color', options: HAIR_COLORS, onlyIf: (d: Doll) => !COVERED.has(d.hair) },
      { key: 'fabric', label: 'Wrap or scarf color', options: CLOTH_COLORS, onlyIf: (d: Doll) => COVERED.has(d.hair) },
    ],
  },
  {
    id: 'face',
    label: 'Face',
    fields: [
      { key: 'eyes', label: 'Eyes', options: EYES },
      { key: 'eyeColor', label: 'Eye color', options: EYE_COLORS },
      { key: 'nose', label: 'Nose', options: NOSES },
      { key: 'mouth', label: 'Mouth', options: MOUTHS },
      { key: 'marks', label: 'Skin', options: MARKS },
    ],
  },
  {
    id: 'extras',
    label: 'Extras',
    fields: [
      { key: 'glasses', label: 'Glasses', options: GLASSES },
      { key: 'hearing', label: 'Hearing', options: HEARING },
      { key: 'mobility', label: 'Getting around', options: MOBILITY },
    ],
  },
  {
    id: 'clothes',
    label: 'Clothes',
    fields: [
      { key: 'outfit', label: 'Outfit', options: OUTFITS },
      { key: 'clothes', label: 'Color', options: CLOTH_COLORS },
    ],
  },
] as const satisfies readonly { id: string; label: string; fields: readonly { key: keyof Doll; label: string; options: readonly Choice[]; onlyIf?: (d: Doll) => boolean }[] }[];

export type GroupId = (typeof GROUPS)[number]['id'];

const pick = <T extends Choice>(xs: readonly T[], r: () => number) => xs[Math.floor(r() * xs.length)].id;

/** A doll of chance choices (the name is kept). */
export function surprise(name: string, r: () => number = Math.random): Doll {
  return {
    skin: pick(SKIN, r),
    hair: pick(HAIR_STYLES, r),
    // Natural colors are likelier than the bright ones.
    hairColor: pick(r() < 0.8 ? HAIR_COLORS.slice(0, 7) : HAIR_COLORS.slice(7), r),
    fabric: pick(CLOTH_COLORS, r),
    eyes: pick(EYES, r),
    eyeColor: pick(EYE_COLORS, r),
    nose: pick(NOSES, r),
    mouth: pick(MOUTHS, r),
    marks: r() < 0.7 ? 'none' : pick(MARKS.slice(1), r),
    glasses: r() < 0.6 ? 'none' : pick(GLASSES.slice(1), r),
    hearing: r() < 0.75 ? 'none' : pick(HEARING.slice(1), r),
    mobility: r() < 0.65 ? 'none' : pick(MOBILITY.slice(1), r),
    outfit: pick(OUTFITS, r),
    clothes: pick(CLOTH_COLORS, r),
    name,
  };
}

export const colorOf = (xs: readonly Swatch[], id: string) => (xs.find((x) => x.id === id) ?? xs[0]).color;
export const labelOf = (xs: readonly Choice[], id: string) => (xs.find((x) => x.id === id) ?? xs[0]).label;

/** A color mixed toward black (amount < 0) or white (amount > 0). */
export function shade(hex: string, amount: number): string {
  const n = parseInt(hex.slice(1), 16);
  const target = amount < 0 ? 0 : 255;
  const t = Math.abs(amount);
  const ch = (v: number) => Math.round(v + (target - v) * t);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(ch);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

/** One color mixed toward another by t (0 to 1). */
export function mix(hex: string, toward: string, t: number): string {
  const a = parseInt(hex.slice(1), 16);
  const b = parseInt(toward.slice(1), 16);
  const ch = (shift: number) => Math.round(((a >> shift) & 255) + ((((b >> shift) & 255) - ((a >> shift) & 255)) * t));
  return `#${((1 << 24) | (ch(16) << 16) | (ch(8) << 8) | ch(0)).toString(16).slice(1)}`;
}

/** How light a color is, 0 to 1. */
export function lightness(hex: string): number {
  const n = parseInt(hex.slice(1), 16);
  return (0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255;
}

/*
 * Vitiligo's lighter patches: the skin toward a warm pale tone, as the skin
 * itself has it. On the lightest tones that pale tone is the skin's own, so
 * the patch is near white with a faint rim a shade darker than the skin, as
 * the edge of a patch often shows.
 */
const PALE = 0.7;
export const vitiligoPatch = (skin: string) => (lightness(skin) > PALE ? '#fffdfa' : mix(skin, '#f8e4d6', 0.78));
export const vitiligoEdge = (skin: string) => (lightness(skin) > PALE ? shade(skin, -0.1) : 'none');

/*
 * Freckles: a shade darker than the skin; on the deepest tones, where a
 * darker shade all but vanishes, a warm shade lighter than the skin instead.
 */
export const freckleColor = (skin: string) => (lightness(skin) < 0.36 ? mix(skin, '#b98466', 0.45) : shade(skin, -0.28));

/* Each hair style in a phrase that reads, with its color ("long, straight blond hair"). */
const HAIR_PHRASE: Record<string, (color: string) => string> = {
  afro: (c) => `a ${c} afro`,
  puffs: (c) => `${c} hair in afro puffs`,
  braids: (c) => `${c} box braids`,
  locs: (c) => `${c} locs`,
  twists: (c) => `${c} twists`,
  knots: (c) => `${c} hair in Bantu knots`,
  curls: (c) => `${c} curls`,
  straight: (c) => `long, straight ${c} hair`,
  short: (c) => `short ${c} hair`,
  shaved: (c) => `close-shaved ${c} hair`,
};
const MOUTH_PHRASE: Record<string, string> = { calm: 'a calm mouth' };

/** The doll in words, for screen readers and the image's description. */
export function describe(d: Doll): string {
  const parts = [
    `${labelOf(SKIN, d.skin).toLowerCase()}`,
    COVERED.has(d.hair) ? `a ${labelOf(CLOTH_COLORS, d.fabric).toLowerCase()} ${labelOf(HAIR_STYLES, d.hair).toLowerCase()}` : HAIR_PHRASE[d.hair](labelOf(HAIR_COLORS, d.hairColor).toLowerCase()),
    `${labelOf(EYES, d.eyes).toLowerCase()} ${labelOf(EYE_COLORS, d.eyeColor).toLowerCase()} eyes`,
    MOUTH_PHRASE[d.mouth] ?? `a ${labelOf(MOUTHS, d.mouth).toLowerCase()}`,
    d.marks !== 'none' ? labelOf(MARKS, d.marks).toLowerCase() : '',
    d.glasses !== 'none' ? labelOf(GLASSES, d.glasses).toLowerCase() : '',
    d.hearing === 'aids' ? 'hearing aids' : d.hearing === 'implant' ? 'a cochlear implant' : '',
    d.mobility === 'wheelchair' ? 'sitting in a wheelchair' : d.mobility === 'prosthetic' ? 'a prosthetic leg' : d.mobility === 'cane' ? 'a white cane' : '',
    `${d.outfit === 'overalls' ? '' : 'a '}${labelOf(CLOTH_COLORS, d.clothes).toLowerCase()} ${labelOf(OUTFITS, d.outfit).toLowerCase()}`,
  ].filter(Boolean);
  return `${d.name.trim() ? `${d.name.trim()}: a` : 'A'} doll with ${parts.join(', ')}.`;
}
