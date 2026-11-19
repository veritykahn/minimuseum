import { seededShuffle } from '@/components/games/scoring';
import { JARS, type StepId } from './steps';

/*
 * The rules of the mummification room, kept apart from the drawing so they
 * can be read (and tested) on their own. Nothing here is a new fact: each
 * rule only follows the order and the notes in steps.ts (the British
 * Museum's teaching resources).
 *
 *   What comes next?  At the start of most steps the visitor picks the
 *                     embalmers' next tool from a shelf. A wrong pick is
 *                     not punished: it says why not yet, and after two
 *                     wrong picks the right tool is shown.
 *   The brain         The hook must go in through the nose; the ear and
 *                     the top of the head are turned back with a hint.
 *                     Then the brain, out on the hook, is thrown away (a
 *                     jar is turned back: the brain was not kept).
 *   The jars          The four organs go to their gods' jars, which stand in
 *                     a new order (not the order they were met in) with no
 *                     names on them: only the heads. A wrong jar says whose
 *                     jar it is and what that god guards; a second miss for
 *                     the same organ says where it belongs. The heart is
 *                     there to be found, and is caught if it is offered to
 *                     a jar: it stays in the body.
 *   The natron        The body must be covered everywhere, inside and out.
 *                     The forty days can be started early, and then show
 *                     what is still damp.
 *   The oils          Rubbed into every part of the body, not just one.
 *   The linen         Wound round and round the body, one pass at a time,
 *                     head to feet and back, with amulets tucked in between
 *                     the two layers before the second can begin.
 */

/* ───────────────────────── What comes next? ───────────────────────── */

export type ToolId = 'water' | 'hook' | 'jars' | 'natron' | 'oil' | 'linen' | 'coffin';

export type Tool = {
  id: ToolId;
  /** The tool's name, as the shelf labels it. */
  name: string;
  /** The step it is for. */
  step: StepId;
  /** Said when it is picked too early: why not yet, from the order of the steps alone. */
  notYet: string;
};

// REVIEW: new text. Each "not yet" only restates the order of the steps (British Museum visit resource and notes for teachers).
export const TOOLS: Tool[] = [
  { id: 'water', name: 'A jar of water', step: 'wash', notYet: 'The body was washed on the first day.' },
  { id: 'hook', name: 'A long bronze hook', step: 'brain', notYet: 'The brain is already out.' },
  { id: 'jars', name: 'Four canopic jars', step: 'gods', notYet: 'Soon! But first, something comes out through the nose.' },
  { id: 'natron', name: 'Bags of natron', step: 'natron', notYet: 'Not yet. The natron is packed inside the body as well as around it, so what comes out must come out first.' },
  { id: 'oil', name: 'Oils and resin', step: 'oils', notYet: 'Not yet. The oils and resin go on after the natron has dried the body.' },
  { id: 'linen', name: 'Rolls of linen', step: 'wrap', notYet: 'Not yet. The linen goes on near the end, once the body is dry and oiled.' },
  { id: 'coffin', name: 'A painted coffin', step: 'coffin', notYet: 'Not yet. The coffin is the very last thing, at about day 70.' },
];

export const STEP_ORDER: StepId[] = ['wash', 'brain', 'gods', 'organs', 'natron', 'oils', 'wrap', 'coffin'];

/**
 * The steps that open with "What comes next?". Washing is the first thing
 * and needs no choosing; the organs follow the jars' gods; by the coffin
 * only the coffin is left on the shelf.
 */
export const CHOICE_STEPS: StepId[] = ['brain', 'gods', 'natron', 'oils', 'wrap'];

export function needsChoice(step: StepId): boolean {
  return CHOICE_STEPS.includes(step);
}

/** The tools still on the shelf at a step: those for this step or a later one. */
export function shelfAt(step: StepId): Tool[] {
  const at = STEP_ORDER.indexOf(step);
  return TOOLS.filter((t) => STEP_ORDER.indexOf(t.step) >= at);
}

/** The right tool for a step. */
export function toolFor(step: StepId): Tool {
  return TOOLS.find((t) => t.step === step)!;
}

export type ToolVerdict = { ok: boolean; message: string; showRight: boolean };

/** A tool picked at a step, after `misses` wrong picks there already. */
export function judgeTool(step: StepId, tool: ToolId, misses: number): ToolVerdict {
  const right = toolFor(step);
  if (tool === right.id) return { ok: true, message: `Yes: ${right.name.toLowerCase()}.`, showRight: false };
  const picked = TOOLS.find((t) => t.id === tool)!;
  // REVIEW: new text.
  const showRight = misses + 1 >= 2;
  return { ok: false, message: showRight ? `${picked.notYet} Try ${right.name.toLowerCase()}: it is glowing on the shelf.` : picked.notYet, showRight };
}

/* ───────────────────────── The brain ───────────────────────── */

export type Entry = 'nose' | 'ear' | 'crown';
export const ENTRIES: { id: Entry; name: string }[] = [
  { id: 'crown', name: 'the top of the head' },
  { id: 'ear', name: 'the ear' },
  { id: 'nose', name: 'the nose' },
];

/** Where the hook was put, after `misses` wrong places. */
export function judgeEntry(at: Entry, misses: number): { ok: boolean; message: string } {
  // REVIEW: new text. The answer is the British Museum's ("removed through the nose").
  if (at === 'nose') return { ok: true, message: 'In through the nose. Now push the hook up, to the brain.' };
  const name = ENTRIES.find((e) => e.id === at)!.name;
  return { ok: false, message: misses + 1 >= 2 ? `Not through ${name}. The embalmers went in through the nose.` : `Not through ${name}. Try another way in.` };
}

/** Where the brain went once it was out: kept in a jar, or thrown away. */
export function judgeBrain(to: 'jar' | 'basket'): { ok: boolean; message: string } {
  // REVIEW: new text, from the British Museum: the brain "was removed through the nose and discarded".
  return to === 'basket'
    ? { ok: true, message: 'Thrown away. The brain was not kept.' }
    : { ok: false, message: 'Not in a jar. The organs were kept in jars, but the brain was not kept at all. Where does it go?' };
}

/* ───────────────────────── The jars ───────────────────────── */

export type OrganId = 'lungs' | 'liver' | 'stomach' | 'intestines' | 'heart';

/** What lies inside the body when it is opened: the four organs for the jars, and the heart. */
export const IN_BODY: OrganId[] = ['lungs', 'heart', 'liver', 'stomach', 'intestines'];

/**
 * The jars in the order they stand for the challenge: shuffled by the
 * visitor's seed, and never in the order the gods were met in.
 */
export function jarOrder(seed: number | null): typeof JARS {
  if (seed === null) return [JARS[2], JARS[0], JARS[3], JARS[1]];
  const order = seededShuffle(JARS, seed);
  return order.every((j, i) => j === JARS[i]) ? [...order.slice(1), order[0]] : order;
}

export type JarVerdict = { ok: true; message: string } | { ok: false; kind: 'heart' | 'wrong'; message: string; reveal: string | null };

/** An organ offered to a god's jar, after `misses` wrong jars for that organ. */
export function judgeJar(organ: OrganId, god: string, misses: number): JarVerdict {
  const jar = JARS.find((j) => j.god === god)!;
  // REVIEW: new text. Who guards what: the British Museum's Hieroglyphs exhibition text.
  if (organ === 'heart') return { ok: false, kind: 'heart', message: 'Stop! Not the heart. The heart stays inside the body.', reveal: null };
  if (jar.organ === organ) return { ok: true, message: `Yes: ${jar.head}-headed ${jar.god} guards the ${organ}.` };
  const right = JARS.find((j) => j.organ === organ)!;
  if (misses + 1 >= 2) return { ok: false, kind: 'wrong', message: `That is ${jar.god}’s jar. The ${organ} belongs to ${right.god}, the god with the ${right.head}’s head.`, reveal: right.god };
  return { ok: false, kind: 'wrong', message: `That is ${jar.god}’s jar, the ${jar.head}. ${jar.god} guards the ${jar.organ}, not the ${organ}. Try another jar.`, reveal: null };
}

/* ───────────────────────── The body's parts ───────────────────────── */

/**
 * The body, head to feet, in six parts (MummyScene's units): where the dust
 * lies, where the natron must go, and where the oil must be rubbed in.
 */
export const ZONES: { id: string; name: string; x0: number; x1: number }[] = [
  { id: 'head', name: 'the head', x0: 172, x1: 250 },
  { id: 'chest', name: 'the chest', x0: 250, x1: 336 },
  { id: 'belly', name: 'the belly', x0: 336, x1: 416 },
  { id: 'hips', name: 'the hips', x0: 416, x1: 494 },
  { id: 'legs', name: 'the legs', x0: 494, x1: 574 },
  { id: 'feet', name: 'the feet', x0: 574, x1: 650 },
];

/** The part of the body at a point along it, or -1 off the body. */
export function zoneAt(x: number): number {
  return ZONES.findIndex((z) => x >= z.x0 && x < z.x1);
}

/** The places the natron must go: the six parts of the body, and inside it, through the cut. */
export const NATRON_PLACES = [...ZONES.map((z) => z.id), 'inside'];

export function natronDamp(packed: readonly string[]): string[] {
  return NATRON_PLACES.filter((p) => !packed.includes(p));
}

/** What forty days in natron did, given where it was packed. */
export function natronResult(packed: readonly string[]): { dry: boolean; message: string } {
  const damp = natronDamp(packed);
  if (!damp.length) return { dry: true, message: 'Forty days have passed. The body is dry all through.' };
  const inside = damp.includes('inside');
  const outside = damp.filter((d) => d !== 'inside').map((d) => ZONES.find((z) => z.id === d)!.name);
  const where = [...outside, ...(inside ? ['inside the body'] : [])];
  const list = where.length > 1 ? `${where.slice(0, -1).join(', ')} and ${where[where.length - 1]}` : where[0];
  // REVIEW: new text, from the British Museum: natron was packed "inside and outside the body ... until all the moisture had gone".
  return { dry: false, message: `Forty days, but it is still damp: ${list}. The natron must touch every part, inside and out. Pack more, then leave it again.` };
}

/** How much rubbing each part needs, in the SVG's units of movement. */
export const RUB_NEEDED = 260;

/** Oil rubbed into a part (by its index), each part 0–1 coated. */
export function rubInto(coats: readonly number[], zone: number, distance: number): number[] {
  if (zone < 0) return [...coats];
  return coats.map((c, i) => (i === zone ? Math.min(1, c + distance / RUB_NEEDED) : c));
}

export const coated = (coats: readonly number[]) => coats.every((c) => c >= 1);

/* ───────────────────────── The linen ───────────────────────── */

/** Each layer is this many passes round the body. */
export const PASSES = 6;
/** Two layers, with the amulets between them. */
export const WRAP_LAYERS = 2;
export const ALL_PASSES = PASSES * WRAP_LAYERS;

export type WrapState = {
  /** Layers finished (0, 1 or 2). */
  layers: number;
  /** The pass the roll is on next, within its layer (0 to PASSES - 1). */
  pass: number;
  /** Whether the roll waits for an amulet before the second layer. */
  waitsForAmulet: boolean;
  done: boolean;
};

export function wrapState(passes: number, amulets: number): WrapState {
  const layers = Math.floor(passes / PASSES);
  const done = passes >= ALL_PASSES;
  return { layers, pass: done ? PASSES - 1 : passes % PASSES, waitsForAmulet: passes === PASSES && amulets === 0, done };
}

/**
 * Where along the body the roll goes round for a pass: the first layer from
 * head to feet, the second back from feet to head.
 */
export function passX(passes: number): number {
  const layer = Math.floor(Math.min(passes, ALL_PASSES - 1) / PASSES);
  const k = passes % PASSES;
  const slot = layer % 2 === 0 ? k : PASSES - 1 - k;
  return 212 + slot * 80;
}

/** Amulets may be tucked in only on top of the first layer, before the second begins. */
export function canTuck(passes: number, tucked: number, max = 4): boolean {
  return passes === PASSES && tucked < max;
}
