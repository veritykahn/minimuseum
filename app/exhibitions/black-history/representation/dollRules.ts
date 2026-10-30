import { DOLL_ART, DOLL_BASE, thumbOf, type HairColour, type Pose, type Sex, type Tone } from './dollArt';

/*
 * Design a doll: the choices and the manifest's rules, kept apart from the
 * screen so they can be tested whole.
 *
 * The doll remembers a choice per doll and per pose (the woman's hair and the
 * man's, the standing outfit and the seated one), so switching back and forth
 * never loses what a child picked. Every change goes through `resolve`, which
 * makes an impossible doll impossible: a seated doll wears only seated
 * outfits and has no prosthetic leg, a covering that hides the hair hides it
 * (and the hair comes back when it comes off), and the kippah is the man's
 * and is lifted to sit on his hairstyle.
 */

export type Doll = {
  sex: Sex;
  seated: boolean;
  tone: Tone;
  /** Each doll's hairstyle, remembered while the other is shown. */
  hair: Record<Sex, string>;
  hairColour: HairColour;
  /** Each doll's head covering, or none. */
  covering: Record<Sex, string | null>;
  beard: boolean;
  glasses: boolean;
  hearing: boolean;
  prosthetic: boolean;
  /** The outfit for each pose, remembered while another is shown. */
  outfit: Record<Pose, string>;
  name: string;
};

export type Option = { id: string; label: string };
export type Slot = 'body' | 'outfit' | 'hair' | 'beard' | 'head' | 'glasses' | 'hearing';
export type Layer = { slot: Slot; file: string; src: string; lift: number };

export const SEXES: Sex[] = ['W', 'M'];
export const POSES: Pose[] = ['W', 'M', 'WS', 'MS'];
export const SEX_LABEL: Record<Sex, string> = { W: 'Woman', M: 'Man' };
export const NAME_MAX = 24;

/** The manifest's stacking order, as layer slots: body, outfit, hair, beard, head, then glasses and hearing aid. */
export const SLOT_ORDER: Slot[] = DOLL_ART.order.flatMap((o): Slot[] => {
  if (o === 'extra (beard)') return ['beard'];
  if (/^extra \(/.test(o)) return ['glasses', 'hearing'];
  return [o as Slot];
});

export const poseOf = (d: Pick<Doll, 'sex' | 'seated'>): Pose => (d.seated ? (`${d.sex}S` as Pose) : d.sex);
export const src = (file: string) => DOLL_BASE + file;
export const thumb = (file: string) => DOLL_BASE + thumbOf(file);

const entries = <T extends { label: string }>(rec: Record<string, T>): Option[] => Object.entries(rec).map(([id, v]) => ({ id, label: v.label }));
export const hairStyles = (sex: Sex) => entries(DOLL_ART.hair[sex]);
export const coverings = (sex: Sex) => entries(DOLL_ART.head[sex]);
export const outfitsFor = (pose: Pose) => entries(DOLL_ART.outfits[pose]);

const COLOUR_NAMES: Record<string, string> = { darkbrown: 'dark brown' };
export const colourName = (c: HairColour) => COLOUR_NAMES[c] ?? c;
export const hairColours = (): Option[] => DOLL_ART.hairColours.map((c) => ({ id: c, label: colourName(c)[0].toUpperCase() + colourName(c).slice(1) }));
export const skinTones = (): Option[] => DOLL_ART.skinTones.map((t) => ({ id: t, label: DOLL_ART.skinToneLabels[t] }));

/** True if this covering hides the hair (the manifest names them: hijab, head wrap, headscarf, turban). */
export const hidesHair = (covering: string | null) => covering !== null && DOLL_ART.coversHair.includes(covering);
/** The kippah is the man's only (it is in the manifest for him alone). */
export const KIPPAH = 'kippah';
/** How far to raise the kippah so it sits on top of this hairstyle, in canvas pixels. */
export const kippahLift = (style: string) => DOLL_ART.kippahLift[style] ?? 0;

const first = (xs: Option[]) => xs[0].id;
const has = (xs: Option[], id: string | null) => id !== null && xs.some((x) => x.id === id);

export const FIRST_DOLL: Doll = {
  sex: 'W',
  seated: false,
  tone: 't2',
  hair: { W: 'puffs', M: 'fade' },
  hairColour: 'black',
  covering: { W: null, M: null },
  beard: false,
  glasses: false,
  hearing: false,
  prosthetic: false,
  outfit: { W: 'print', M: 'denim', WS: 'sundress', MS: 'denim' },
  name: '',
};

/** The nearest valid doll: every remembered choice is one the manifest has, and the rules hold. */
export function resolve(d: Doll): Doll {
  const out: Doll = { ...d, hair: { ...d.hair }, covering: { ...d.covering }, outfit: { ...d.outfit } };
  if (!DOLL_ART.skinTones.includes(out.tone)) out.tone = DOLL_ART.skinTones[0];
  if (!DOLL_ART.hairColours.includes(out.hairColour)) out.hairColour = DOLL_ART.hairColours[0];
  for (const s of SEXES) {
    if (!has(hairStyles(s), out.hair[s])) out.hair[s] = first(hairStyles(s));
    if (out.covering[s] !== null && !has(coverings(s), out.covering[s])) out.covering[s] = null;
  }
  for (const p of POSES) if (!has(outfitsFor(p), out.outfit[p])) out.outfit[p] = first(outfitsFor(p));
  // The prosthetic leg is for standing dolls.
  if (out.seated) out.prosthetic = false;
  out.name = out.name.slice(0, NAME_MAX);
  return out;
}

export function setSex(d: Doll, sex: Sex): Doll {
  return resolve({ ...d, sex });
}

/**
 * Sitting down or standing up: the same outfit if the new pose has it,
 * otherwise the one last worn in that pose. An outfit that was only a stand-in
 * (the standing one had no seated version) doesn't replace the one chosen.
 */
export function setSeated(d: Doll, seated: boolean): Doll {
  const from = poseOf(d);
  const to = poseOf({ sex: d.sex, seated });
  const outfit = { ...d.outfit };
  const wasStandIn = !has(outfitsFor(from), d.outfit[to]);
  if (has(outfitsFor(to), d.outfit[from]) && !wasStandIn) outfit[to] = d.outfit[from];
  return resolve({ ...d, seated, outfit, prosthetic: seated ? false : d.prosthetic });
}

/** A hairstyle shows the hair, so a covering that hides it comes off (a kippah or kufi stays on). */
export function setHair(d: Doll, style: string): Doll {
  const covering = hidesHair(d.covering[d.sex]) ? { ...d.covering, [d.sex]: null } : d.covering;
  return resolve({ ...d, hair: { ...d.hair, [d.sex]: style }, covering });
}

/** A covering, or none; the hairstyle underneath is remembered. */
export function setCovering(d: Doll, covering: string | null): Doll {
  return resolve({ ...d, covering: { ...d.covering, [d.sex]: covering } });
}

export function setOutfit(d: Doll, id: string): Doll {
  return resolve({ ...d, outfit: { ...d.outfit, [poseOf(d)]: id } });
}

export function setProsthetic(d: Doll, on: boolean): Doll {
  return resolve({ ...d, prosthetic: on && !d.seated });
}

/** The doll's layers, bottom to top, in the manifest's order. Only what shows is listed. */
export function layersOf(d: Doll): Layer[] {
  const pose = poseOf(d);
  const sex = d.sex;
  const covering = d.covering[sex];
  const style = d.hair[sex];
  const files: Partial<Record<Slot, { file: string; lift?: number }>> = {
    body: { file: d.prosthetic && !d.seated ? DOLL_ART.prosthetic[sex][d.tone] : DOLL_ART.bodies[pose][d.tone] },
    outfit: { file: DOLL_ART.outfits[pose][d.outfit[pose]].file },
  };
  if (!hidesHair(covering)) files.hair = { file: DOLL_ART.hair[sex][style].files[d.hairColour] };
  if (sex === 'M' && d.beard) files.beard = { file: DOLL_ART.extras.M.beard.files[d.hairColour] };
  if (covering) files.head = { file: DOLL_ART.head[sex][covering].file, lift: covering === KIPPAH ? kippahLift(style) : 0 };
  if (d.glasses) files.glasses = { file: DOLL_ART.extras[sex].glasses.file };
  if (d.hearing) files.hearing = { file: DOLL_ART.extras[sex].hearing.file };
  return SLOT_ORDER.flatMap((slot) => {
    const f = files[slot];
    return f ? [{ slot, file: f.file, src: src(f.file), lift: f.lift ?? 0 }] : [];
  });
}

const lower = (s: string) => (/^[A-Z][a-z ]/.test(s) ? s[0].toLowerCase() + s.slice(1) : s);
const article = (s: string) => (/^[aeiou]/i.test(s) ? `an ${s}` : `a ${s}`);

/** The doll in words, for its picture's name and for the live region. */
export function describe(d: Doll): string {
  const sex = d.sex;
  const covering = d.covering[sex];
  const parts: string[] = [`${DOLL_ART.skinToneLabels[d.tone]} skin`];
  if (hidesHair(covering)) parts.push(article(lower(DOLL_ART.head[sex][covering!].label)));
  else {
    parts.push(`${colourName(d.hairColour)} hair (${lower(DOLL_ART.hair[sex][d.hair[sex]].label)})`);
    if (covering) parts.push(article(lower(DOLL_ART.head[sex][covering].label)));
  }
  if (sex === 'M' && d.beard) parts.push(`${article(colourName(d.hairColour))} beard`);
  if (d.glasses) parts.push('glasses');
  if (d.hearing) parts.push('a hearing aid');
  if (d.prosthetic && !d.seated) parts.push('a prosthetic leg');
  const outfit = lower(DOLL_ART.outfits[poseOf(d)][d.outfit[poseOf(d)]].label);
  const who = `${article(sex === 'W' ? 'woman' : 'man')} doll${d.seated ? ' in a wheelchair' : ''}`;
  const list = parts.length > 1 ? `${parts.slice(0, -1).join(', ')} and ${parts.at(-1)}` : parts[0];
  const name = d.name.trim();
  return `${name ? `${name}: ` : ''}${who} with ${list}, wearing ${article(outfit)}.`;
}

/** A whole, valid surprise doll. The name stays. */
export function surprise(name: string, r: () => number = Math.random): Doll {
  const pick = <T>(xs: readonly T[]) => xs[Math.min(xs.length - 1, Math.floor(r() * xs.length))];
  const sex = pick(SEXES);
  const seated = r() < 0.25;
  const covering = {} as Record<Sex, string | null>;
  for (const s of SEXES) covering[s] = r() < 0.2 ? pick(coverings(s)).id : null;
  const outfit = {} as Record<Pose, string>;
  for (const p of POSES) outfit[p] = pick(outfitsFor(p)).id;
  return resolve({
    sex,
    seated,
    tone: pick(DOLL_ART.skinTones),
    hair: { W: pick(hairStyles('W')).id, M: pick(hairStyles('M')).id },
    hairColour: pick(DOLL_ART.hairColours),
    covering,
    beard: r() < 0.4,
    glasses: r() < 0.3,
    hearing: r() < 0.2,
    prosthetic: !seated && r() < 0.15,
    outfit,
    name,
  });
}

/** Is this a doll the manifest allows? (For tests, and as a guard.) */
export function isValid(d: Doll): boolean {
  if (!DOLL_ART.skinTones.includes(d.tone) || !DOLL_ART.hairColours.includes(d.hairColour)) return false;
  if (d.seated && d.prosthetic) return false;
  for (const s of SEXES) {
    if (!has(hairStyles(s), d.hair[s])) return false;
    if (d.covering[s] !== null && !has(coverings(s), d.covering[s])) return false;
  }
  return POSES.every((p) => has(outfitsFor(p), d.outfit[p]));
}

/** The layers a child is likely to pick next, from the group they have open, to fetch ahead. */
export function nextLikely(d: Doll, group: string): string[] {
  const sex = d.sex;
  const pose = poseOf(d);
  const near = <T>(xs: readonly T[], i: number) => [xs[i - 1], xs[i + 1]].filter((x): x is T => x !== undefined);
  const out: string[] = [];
  if (group === 'hair') {
    const styles = hairStyles(sex).map((x) => x.id);
    for (const s of near(styles, styles.indexOf(d.hair[sex]))) out.push(DOLL_ART.hair[sex][s].files[d.hairColour]);
    for (const c of near(DOLL_ART.hairColours, DOLL_ART.hairColours.indexOf(d.hairColour))) out.push(DOLL_ART.hair[sex][d.hair[sex]].files[c]);
  } else if (group === 'clothes') {
    const ids = outfitsFor(pose).map((x) => x.id);
    for (const o of near(ids, ids.indexOf(d.outfit[pose]))) out.push(DOLL_ART.outfits[pose][o].file);
  } else if (group === 'doll') {
    for (const t of near(DOLL_ART.skinTones, DOLL_ART.skinTones.indexOf(d.tone))) out.push(DOLL_ART.bodies[pose][t]);
  }
  return out.map(src);
}
