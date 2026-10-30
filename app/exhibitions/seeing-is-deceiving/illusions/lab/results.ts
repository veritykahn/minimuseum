import { CATEGORIES, ILLUSIONS, type Category, type Illusion, type IllusionId } from './data';

/*
 * The Lab Notebook's results, as pure functions (tested). Each illusion
 * gives a measurement or an observation, never "right" or "wrong": the
 * notebook line says what the visitor measured, and a strength from 0 (not
 * fooled at all) to 1 (fooled as much as most people are) feeds the
 * Illusion Fingerprint, the average strength for each kind of trick.
 */

export type LabResult = {
  /** The notebook's line, in plain words. */
  line: string;
  /** How strongly it fooled the visitor, 0 to 1; null where there is no "fooled" (Rubin's vase). */
  strength: number | null;
};

export type Results = Partial<Record<IllusionId, LabResult>>;

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const pct = (n: number) => `${Math.round(Math.abs(n))}%`;

/** A matching task: the visitor's setting against the true one, as a percentage off. */
export function percentOff(chosen: number, truth: number) {
  return ((chosen - truth) / truth) * 100;
}

/** Checker shadow: the chip's shade (0 black to 255 white) set to match how B looks; B is really `truth`. */
export function checkerResult(chip: number, truth: number): LabResult {
  const off = percentOff(chip, truth);
  const line = Math.abs(off) < 3 ? 'You matched B’s real shade almost exactly.' : `You saw B ${pct(off)} ${off > 0 ? 'lighter' : 'darker'} than it really is.`;
  return { line, strength: clamp01(Math.abs(off) / 40) };
}

/** Simultaneous contrast: the right square set to match the left; both are really `truth`. */
export function contrastResult(right: number, truth: number): LabResult {
  const off = percentOff(right, truth);
  const line = Math.abs(off) < 3 ? 'You matched the two squares almost exactly.' : `You made the right square ${pct(off)} ${off > 0 ? 'lighter' : 'darker'} than the left one, to look the same.`;
  return { line, strength: clamp01(Math.abs(off) / 25) };
}

/** Müller-Lyer: the middle's place along the line (0 to 1), with fins and, if tried, without. */
export function mullerLyerResult(withFins: number, withoutFins?: number): LabResult {
  const off = (withFins - 0.5) * 100;
  const side = off > 0 ? 'right' : 'left';
  let line = Math.abs(off) < 1 ? 'With fins: you found the exact middle.' : `With fins: you put the middle ${pct(off)} of the line too far to the ${side}.`;
  if (withoutFins !== undefined) {
    const o2 = (withoutFins - 0.5) * 100;
    line += Math.abs(o2) < 1 ? ' Without fins: exact.' : ` Without fins: ${pct(o2)} off.`;
  }
  return { line, strength: clamp01(Math.abs(off) / 10) };
}

/** Ebbinghaus: the right circle's radius set to match the left one's `truth`. */
export function ebbinghausResult(r: number, truth: number): LabResult {
  const off = percentOff(r, truth);
  const line = Math.abs(off) < 3 ? 'You matched the circles almost exactly.' : `You made the right circle ${pct(off)} too ${off > 0 ? 'big' : 'small'}.`;
  return { line, strength: clamp01(Math.abs(off) / 20) };
}

/** Ponzo: the top bar's length set to match the bottom bar's `truth`. */
export function ponzoResult(w: number, truth: number): LabResult {
  const off = percentOff(w, truth);
  const line = Math.abs(off) < 3 ? 'You matched the bars almost exactly.' : `You made the top bar ${pct(off)} too ${off > 0 ? 'long' : 'short'}.`;
  return { line, strength: clamp01(Math.abs(off) / 20) };
}

/** Poggendorff: how far the marker was from where the line really comes out, as a share of the figure's height. */
export function poggendorffResult(guess: number, truth: number, height: number): LabResult {
  const off = ((guess - truth) / height) * 100;
  const line = Math.abs(off) < 1.5 ? 'You found where the line comes out, almost exactly.' : `Your guess was ${pct(off)} of the picture’s height too ${off < 0 ? 'high' : 'low'}.`;
  return { line, strength: clamp01(Math.abs(off) / 8) };
}

/** Troxler: seconds until it faded, or null if it never did. */
export function troxlerResult(seconds: number | null): LabResult {
  if (seconds === null) return { line: 'The colours did not fade for you this time.', strength: 0 };
  return { line: `The colours faded after ${Math.round(seconds)} seconds.`, strength: clamp01(1 - (seconds - 8) / 40) };
}

/** Stroop: the two rounds' times, in seconds. */
export function stroopResult(patches: number, words: number): LabResult {
  const d = words - patches;
  const line =
    Math.abs(d) < 0.5
      ? `Round 1: ${patches.toFixed(1)} s. Round 2: ${words.toFixed(1)} s. About the same!`
      : `Round 1: ${patches.toFixed(1)} s. Round 2: ${words.toFixed(1)} s. The words made you ${Math.abs(d).toFixed(1)} s ${d > 0 ? 'slower' : 'faster'}.`;
  return { line, strength: clamp01(d / Math.max(1, patches) / 0.5) };
}

/** An observation: what the visitor saw, and how much that means it fooled them. */
export function observed(line: string, strength: number | null): LabResult {
  return { line, strength: strength === null ? null : clamp01(strength) };
}

export type Fingerprint = { category: Category; label: string; score: number | null; count: number }[];

/** The Illusion Fingerprint: for each kind of trick, the average strength of the illusions tried. */
export function fingerprint(results: Results): Fingerprint {
  return CATEGORIES.map((c) => {
    const s = ILLUSIONS.filter((i) => i.category === c.id)
      .map((i) => results[i.id]?.strength)
      .filter((x): x is number => typeof x === 'number');
    return { category: c.id, label: c.label, score: s.length ? s.reduce((a, b) => a + b, 0) / s.length : null, count: s.length };
  });
}

/** The fingerprint's headline: the kind of trick that fooled the visitor most. */
export function fingerprintTitle(fp: Fingerprint) {
  const tried = fp.filter((f) => f.score !== null);
  if (!tried.length) return 'Try an illusion to start your fingerprint.';
  const top = tried.reduce((a, b) => ((b.score ?? 0) > (a.score ?? 0) ? b : a));
  if ((top.score ?? 0) < 0.15) return 'Hardly fooled at all, this time.';
  return `Fooled most by: ${top.label.toLowerCase()}.`;
}

/** Class mode: the hands-up tallies, by illusion and option. */
export type Votes = Partial<Record<IllusionId, Record<string, number>>>;

/** Class mode's notebook line for an illusion: the hands for each answer. */
export function voteLine(illusion: Illusion, v: Record<string, number> | undefined): string | null {
  const total = v ? Object.values(v).reduce((a, b) => a + b, 0) : 0;
  if (!v || !total) return null;
  return `${illusion.vote.options.map((o) => `${o.label}: ${v[o.id] ?? 0}`).join(' · ')} (${total} ${total === 1 ? 'hand' : 'hands'})`;
}

/** The class fingerprint: for each kind of trick, the share of hands that were fooled. */
export function classFingerprint(votes: Votes): Fingerprint {
  return CATEGORIES.map((c) => {
    const shares: number[] = [];
    for (const i of ILLUSIONS.filter((x) => x.category === c.id)) {
      const v = votes[i.id];
      if (!v || !i.vote.options.some((o) => o.fooled)) continue;
      const total = Object.values(v).reduce((a, b) => a + b, 0);
      if (!total) continue;
      const fooled = i.vote.options.filter((o) => o.fooled).reduce((a, o) => a + (v[o.id] ?? 0), 0);
      shares.push(fooled / total);
    }
    return { category: c.id, label: c.label, score: shares.length ? shares.reduce((a, b) => a + b, 0) / shares.length : null, count: shares.length };
  });
}
