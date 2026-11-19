import { darken, lighten, mix } from './dollShapes';

/*
 * Design a doll: every choice a child can make, the names a screen reader
 * says for them, and the rules that keep the doll whole. Kept apart from the
 * screen (DollDesigner.tsx) and the drawing (DollArt.tsx) so they can be
 * tested whole.
 *
 * The doll is our own: one friendly figure drawn in SVG, not a copy of any
 * toy. It is built to be representative: twelve skin tones from the deepest
 * to the fairest, each with its own shading; twelve hairstyles drawn for
 * their own texture (straight to coily, afro, puffs, braids, locs, twists),
 * in natural and fun colours, each colour with its own highlight and shadow;
 * head coverings; eye shapes and colours, noses and lips; freckles and
 * vitiligo; glasses, hearing aids, a wheelchair and a prosthetic leg; and
 * clothes in any colour.
 *
 * The rules: a covering that hides the hair hides it (and the hair comes
 * back when it comes off); choosing a hairstyle takes such a covering off; a
 * kippah or kufi sits on the hair. Every other choice goes with every other.
 */

/* ───────── Skin ───────── */

export type Tone = { id: string; label: string; base: string };
/** Twelve skin tones, from the deepest to the fairest. */
export const TONES: Tone[] = [
  { id: 's1', label: 'Deepest brown', base: '#3d2319' },
  { id: 's2', label: 'Very deep brown', base: '#502f21' },
  { id: 's3', label: 'Deep brown', base: '#653c28' },
  { id: 's4', label: 'Dark brown', base: '#7a4a31' },
  { id: 's5', label: 'Rich brown', base: '#8e5a3b' },
  { id: 's6', label: 'Warm brown', base: '#a46b46' },
  { id: 's7', label: 'Golden brown', base: '#b87e54' },
  { id: 's8', label: 'Olive', base: '#b99467' },
  { id: 's9', label: 'Tan', base: '#d2a277' },
  { id: 's10', label: 'Light', base: '#e3bb92' },
  { id: 's11', label: 'Fair', base: '#efcfad' },
  { id: 's12', label: 'Very fair', base: '#f7e0cb' },
];

export type SkinPaint = { base: string; shade: string; line: string; blush: string; lip: string; lipLine: string; freckle: string; patch: string };

/** A tone's whole palette: its shading, outline, cheeks, lips, freckles and vitiligo patches. */
export function skinPaint(id: string): SkinPaint {
  const i = Math.max(0, TONES.findIndex((t) => t.id === id));
  const base = TONES[i].base;
  const deep = i < 5;
  return {
    base,
    shade: darken(base, deep ? 0.22 : 0.12),
    line: darken(base, deep ? 0.48 : 0.42),
    blush: mix(base, '#e0606a', deep ? 0.22 : 0.3),
    lip: mix(darken(base, deep ? 0.12 : 0.05), '#b8434f', deep ? 0.22 : 0.42),
    lipLine: darken(base, 0.5),
    freckle: mix(base, '#6b3a1f', deep ? 0.45 : 0.42),
    // Vitiligo: a paler patch, warm, never white.
    patch: mix(base, '#f6e2d3', deep ? 0.72 : 0.6),
  };
}

/* ───────── Hair ───────── */

export type HairColour = { id: string; label: string; base: string; shade: string; deep: string; light: string; brow: string; fun?: true };

const hairColour = (id: string, label: string, base: string, light: string, brow?: string, fun?: true): HairColour => ({
  id,
  label,
  base,
  shade: darken(base, 0.22),
  deep: darken(base, 0.45),
  light,
  brow: brow ?? darken(base, 0.25),
  ...(fun ? { fun } : {}),
});

/** Natural colours, then fun ones. Blond has its own warm highlight and golden shadow, never a flat yellow. */
export const HAIR_COLOURS: HairColour[] = [
  hairColour('black', 'Black', '#2b2528', '#6a6170'),
  hairColour('darkbrown', 'Dark brown', '#4a3023', '#86604a'),
  hairColour('brown', 'Brown', '#6e4529', '#a8784f'),
  hairColour('auburn', 'Auburn', '#8c3d24', '#c76e48'),
  hairColour('red', 'Red', '#c25a2c', '#f0a06a', '#9a4a26'),
  hairColour('blond', 'Blond', '#d6a755', '#f8e3a6', '#a9783c'),
  hairColour('lightblond', 'Light blond', '#e8cf95', '#fbf1d2', '#b08a52'),
  hairColour('grey', 'Grey', '#a5a3a8', '#e6e5ea', '#7d7a80'),
  hairColour('pink', 'Pink', '#e57aac', '#ffc6df', '#5a3a30', true),
  hairColour('blue', 'Blue', '#4b86d6', '#a9cdf7', '#3a2a24', true),
  hairColour('purple', 'Purple', '#8a63cf', '#c9b0f2', '#3a2a24', true),
  hairColour('teal', 'Teal', '#25a596', '#94e2d6', '#3a2a24', true),
];

export type HairStyle = { id: string; label: string };
export const HAIR_STYLES: HairStyle[] = [
  { id: 'straight', label: 'Long and straight' },
  { id: 'wavy', label: 'Wavy' },
  { id: 'curly', label: 'Curly' },
  { id: 'coily', label: 'Short coils' },
  { id: 'afro', label: 'Afro' },
  { id: 'puffs', label: 'Puffs' },
  { id: 'braids', label: 'Braids' },
  { id: 'locs', label: 'Locs' },
  { id: 'twists', label: 'Twists' },
  { id: 'bun', label: 'Bun' },
  { id: 'crop', label: 'Short crop' },
  { id: 'bald', label: 'No hair' },
];

/* ───────── Head coverings ───────── */

export type Covering = { id: string; label: string; hidesHair: boolean };
export const COVERINGS: Covering[] = [
  { id: 'hijab', label: 'Hijab', hidesHair: true },
  { id: 'wrap', label: 'Head wrap', hidesHair: true },
  { id: 'scarf', label: 'Headscarf', hidesHair: true },
  { id: 'turban', label: 'Turban', hidesHair: true },
  { id: 'kippah', label: 'Kippah', hidesHair: false },
  { id: 'kufi', label: 'Kufi', hidesHair: false },
];

/* ───────── Face ───────── */

export const EYE_SHAPES = [
  { id: 'round', label: 'Round' },
  { id: 'almond', label: 'Almond' },
  { id: 'monolid', label: 'Monolid' },
];
export const EYE_COLOURS = [
  { id: 'darkbrown', label: 'Dark brown', color: '#3a2316' },
  { id: 'brown', label: 'Brown', color: '#6b3f1f' },
  { id: 'hazel', label: 'Hazel', color: '#8d6b2c' },
  { id: 'green', label: 'Green', color: '#4d7a3c' },
  { id: 'blue', label: 'Blue', color: '#4a80b8' },
  { id: 'grey', label: 'Grey', color: '#7c8a95' },
];
export const NOSES = [
  { id: 'button', label: 'Button nose' },
  { id: 'broad', label: 'Broad nose' },
  { id: 'long', label: 'Long nose' },
];
export const LIPS = [
  { id: 'full', label: 'Full lips' },
  { id: 'medium', label: 'Medium lips' },
  { id: 'thin', label: 'Thin lips' },
];

/* ───────── Clothes ───────── */

export type Outfit = { id: string; label: string };
export const OUTFITS: Outfit[] = [
  { id: 'tee', label: 'T-shirt and jeans' },
  { id: 'dress', label: 'Party dress' },
  { id: 'print', label: 'Print dress' },
  { id: 'overalls', label: 'Overalls' },
  { id: 'hoodie', label: 'Hoodie and joggers' },
  { id: 'skirt', label: 'Long skirt' },
  { id: 'suit', label: 'Suit' },
  { id: 'kit', label: 'Sports kit' },
  { id: 'lab', label: 'Lab coat' },
];

/** The colours a child can give the clothes, a head covering or the wheelchair (the posters' palette, and a few more). */
export const CLOTH_COLOURS = [
  { id: 'red', label: 'Red', color: '#d7262e' },
  { id: 'pink', label: 'Pink', color: '#ee8dbf' },
  { id: 'orange', label: 'Orange', color: '#f29a1b' },
  { id: 'yellow', label: 'Yellow', color: '#f2cc2e' },
  { id: 'lime', label: 'Lime', color: '#b9d334' },
  { id: 'green', label: 'Green', color: '#1e8a4e' },
  { id: 'teal', label: 'Teal', color: '#1c9f9a' },
  { id: 'blue', label: 'Blue', color: '#2b6fb9' },
  { id: 'purple', label: 'Purple', color: '#7d5cc6' },
  { id: 'navy', label: 'Navy', color: '#24325e' },
  { id: 'black', label: 'Black', color: '#2a2a2e' },
  { id: 'white', label: 'White', color: '#f3efe6' },
];

export type ClothPaint = { base: string; shade: string; line: string; light: string };
export function clothPaint(color: string): ClothPaint {
  const pale = color === '#f3efe6';
  return { base: color, shade: darken(color, pale ? 0.1 : 0.16), line: darken(color, pale ? 0.42 : 0.45), light: lighten(color, 0.3) };
}
export const clothColour = (id: string) => (CLOTH_COLOURS.find((c) => c.id === id) ?? CLOTH_COLOURS[0]).color;

/* ───────── Extras ───────── */

export const GLASSES = [
  { id: 'none', label: 'No glasses' },
  { id: 'round', label: 'Round glasses' },
  { id: 'square', label: 'Square glasses' },
] as const;

/* ───────── The doll ───────── */

export type GlassesId = (typeof GLASSES)[number]['id'];

export type Doll = {
  tone: string;
  eyes: string;
  eyeColour: string;
  nose: string;
  lips: string;
  freckles: boolean;
  vitiligo: boolean;
  hair: string;
  hairColour: string;
  /** A head covering, or none. The hairstyle under it is remembered. */
  covering: string | null;
  coveringColour: string;
  outfit: string;
  outfitColour: string;
  glasses: GlassesId;
  hearing: boolean;
  seated: boolean;
  chairColour: string;
  prosthetic: boolean;
  name: string;
};

export const NAME_MAX = 24;

export const FIRST_DOLL: Doll = {
  tone: 's4',
  eyes: 'almond',
  eyeColour: 'darkbrown',
  nose: 'broad',
  lips: 'full',
  freckles: false,
  vitiligo: false,
  hair: 'puffs',
  hairColour: 'black',
  covering: null,
  coveringColour: 'teal',
  outfit: 'print',
  outfitColour: 'orange',
  glasses: 'none',
  hearing: false,
  seated: false,
  chairColour: 'blue',
  prosthetic: false,
  name: '',
};

type Listed = { id: string; label: string };
const has = (xs: readonly { id: string }[], id: string | null) => id !== null && xs.some((x) => x.id === id);
export const labelOf = (xs: readonly Listed[], id: string) => xs.find((x) => x.id === id)?.label ?? id;

export const hairColourOf = (id: string) => HAIR_COLOURS.find((c) => c.id === id) ?? HAIR_COLOURS[0];
export const hidesHair = (covering: string | null) => covering !== null && !!COVERINGS.find((c) => c.id === covering)?.hidesHair;

/** The nearest valid doll: every choice is one this maker has. */
export function resolve(d: Doll): Doll {
  const out = { ...d };
  const keep = (xs: readonly { id: string }[], v: string) => (has(xs, v) ? v : xs[0].id);
  out.tone = keep(TONES, out.tone);
  out.eyes = keep(EYE_SHAPES, out.eyes);
  out.eyeColour = keep(EYE_COLOURS, out.eyeColour);
  out.nose = keep(NOSES, out.nose);
  out.lips = keep(LIPS, out.lips);
  out.hair = keep(HAIR_STYLES, out.hair);
  out.hairColour = keep(HAIR_COLOURS, out.hairColour);
  if (out.covering !== null && !has(COVERINGS, out.covering)) out.covering = null;
  out.coveringColour = keep(CLOTH_COLOURS, out.coveringColour);
  out.outfit = keep(OUTFITS, out.outfit);
  out.outfitColour = keep(CLOTH_COLOURS, out.outfitColour);
  out.chairColour = keep(CLOTH_COLOURS, out.chairColour);
  out.glasses = keep(GLASSES, out.glasses) as GlassesId;
  out.name = out.name.slice(0, NAME_MAX);
  return out;
}

/** A hairstyle shows the hair, so a covering that hides it comes off (a kippah or kufi stays on). */
export function setHair(d: Doll, style: string): Doll {
  return resolve({ ...d, hair: style, covering: hidesHair(d.covering) ? null : d.covering });
}

/** A covering, or none; the hairstyle underneath is remembered. */
export function setCovering(d: Doll, covering: string | null): Doll {
  return resolve({ ...d, covering });
}

/** Does this outfit cover the lower leg (so a prosthetic leg is under it)? */
export const coversShins = (outfit: string) => ['tee', 'overalls', 'hoodie', 'skirt', 'suit', 'lab'].includes(outfit);

const lower = (s: string) => s[0].toLowerCase() + s.slice(1);
const article = (s: string) => (/^[aeiou]/i.test(s) ? `an ${s}` : `a ${s}`);
const list = (parts: string[]) => (parts.length > 1 ? `${parts.slice(0, -1).join(', ')} and ${parts.at(-1)}` : parts[0]);

/** The doll in words, for its picture's name and for the live region. */
export function describe(d: Doll): string {
  const parts: string[] = [`${lower(labelOf(TONES, d.tone))} skin`];
  if (d.vitiligo) parts.push('vitiligo');
  if (d.freckles) parts.push('freckles');
  parts.push(`${lower(labelOf(EYE_COLOURS, d.eyeColour))} ${lower(labelOf(EYE_SHAPES, d.eyes))} eyes`);
  const covering = d.covering ? lower(labelOf(COVERINGS, d.covering)) : '';
  if (hidesHair(d.covering)) parts.push(article(`${lower(labelOf(CLOTH_COLOURS, d.coveringColour))} ${covering}`));
  else {
    parts.push(d.hair === 'bald' ? 'no hair' : `${lower(hairColourOf(d.hairColour).label)} hair (${lower(labelOf(HAIR_STYLES, d.hair))})`);
    if (covering) parts.push(article(covering));
  }
  if (d.glasses !== 'none') parts.push(lower(labelOf(GLASSES, d.glasses)));
  if (d.hearing) parts.push('hearing aids');
  if (d.prosthetic) parts.push('a prosthetic leg');
  const outfit = `${lower(labelOf(CLOTH_COLOURS, d.outfitColour))} ${lower(labelOf(OUTFITS, d.outfit))}`;
  const name = d.name.trim();
  return `${name ? `${name}: ` : ''}a doll${d.seated ? ' in a wheelchair' : ''} with ${list(parts)}, wearing ${article(outfit)}.`;
}

/** A whole, valid surprise doll. The name stays. */
export function surprise(name: string, r: () => number = Math.random): Doll {
  const pick = <T extends { id: string }>(xs: readonly T[]) => xs[Math.min(xs.length - 1, Math.floor(r() * xs.length))].id;
  return resolve({
    tone: pick(TONES),
    eyes: pick(EYE_SHAPES),
    eyeColour: pick(EYE_COLOURS),
    nose: pick(NOSES),
    lips: pick(LIPS),
    freckles: r() < 0.25,
    vitiligo: r() < 0.1,
    hair: pick(HAIR_STYLES),
    // Mostly natural colours, sometimes a fun one.
    hairColour: r() < 0.8 ? pick(HAIR_COLOURS.filter((c) => !c.fun)) : pick(HAIR_COLOURS.filter((c) => c.fun)),
    covering: r() < 0.18 ? pick(COVERINGS) : null,
    coveringColour: pick(CLOTH_COLOURS),
    outfit: pick(OUTFITS),
    outfitColour: pick(CLOTH_COLOURS),
    glasses: pick(GLASSES) as GlassesId,
    hearing: r() < 0.15,
    seated: r() < 0.2,
    chairColour: pick(CLOTH_COLOURS),
    prosthetic: r() < 0.12,
    name,
  });
}

/** Is this a doll this maker can draw? (For tests, and as a guard.) */
export function isValid(d: Doll): boolean {
  return JSON.stringify(resolve(d)) === JSON.stringify(d);
}
