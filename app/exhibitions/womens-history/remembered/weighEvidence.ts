import type { FactSource } from '@/components/exhibition/FactNote';
import { AUDIT, FACT_MERMAIDS, FACT_OTHERS, FACT_TOP_50, POSTER } from './remembered';
import { LOC_JOAN } from './threeWomen';

/*
 * Tip the scale: weigh the evidence. Poster 1 makes a claim, in its own
 * words: "Historically, women's roles have often been overshadowed by those
 * of men." The visitor weighs seven cards, each a true, sourced fact, one at
 * a time: lay it on the scale (it is evidence for the claim) or set it aside
 * (true, but it does not show the claim). Only real evidence moves the
 * scale; a card that is not evidence "weighs nothing". Then the visitor
 * chooses the heaviest piece of evidence, says why, and gets their argument
 * as claim, evidence and reasoning, to print.
 *
 * Every card's text is a fact already approved for the room (the audit's
 * figures, remembered.ts; the drafts' Joan of Arc and Women's History Month
 * lines), or the audit's own words in quotation marks, with its source. The
 * "why" lines are the room's reasoning about the card and make no new claim.
 */

export const NWHM_MONTH: FactSource = {
  label: 'National Women’s History Museum, “Women’s History Month”',
  href: 'https://www.womenshistory.org/womens-history/womens-history-month',
};

export const CLAIM = 'Historically, women’s roles have often been overshadowed by those of men.';

export type EvidenceCard = {
  id: string;
  text: string;
  sources: readonly FactSource[];
  /** Is it evidence for the claim? */
  weighs: boolean;
  /** Why it weighs, or why it weighs nothing: the room's reasoning, shown after the visitor decides. */
  why: string;
};

export const EVIDENCE: readonly EvidenceCard[] = [
  {
    id: 'top50',
    text: FACT_TOP_50.text,
    sources: FACT_TOP_50.sources,
    weighs: true,
    why: 'It compares women with men, with numbers: of the 50 people honored most, 47 are men.',
  },
  {
    id: 'lincoln',
    text: 'Abraham Lincoln has more recorded public monuments in the United States than anyone else: 193.',
    sources: [AUDIT],
    weighs: false,
    why: 'It is true, but it is about one man. On its own it says nothing about women, so it cannot show who is overlooked.',
  },
  {
    id: 'mermaids',
    text: FACT_MERMAIDS.text,
    sources: FACT_MERMAIDS.sources,
    weighs: true,
    why: 'It is a comparison: more statues of imaginary women than of real women who served in Congress.',
  },
  {
    id: 'march8',
    text: 'The Santa Rosa organizers chose the week of March 8 so that it would line up with International Women’s Day.',
    sources: [NWHM_MONTH],
    weighs: false,
    why: 'It is about the calendar: why the week falls when it does. It does not show who gets remembered.',
  },
  {
    id: 'outnumber',
    text: 'Monument Lab studied 48,178 monuments across the United States. It found that monuments to historical men “grossly outnumber those to historical women.”',
    sources: [AUDIT],
    weighs: true,
    why: 'It comes from a careful study of tens of thousands of monuments, and compares men with women directly.',
  },
  {
    id: 'orleans',
    text: 'In 1429 Joan of Arc helped end the English siege of the city of Orléans.',
    sources: [LOC_JOAN],
    weighs: false,
    why: 'It tells us what one woman did, not whether she was overshadowed. In fact, Joan of Arc is in the Top 50.',
  },
  {
    id: 'others',
    text: FACT_OTHERS.text,
    sources: FACT_OTHERS.sources,
    weighs: false,
    why: 'It is strong evidence, but for a different claim: about other groups whose stories are left out. It does not count women.',
  },
];

export const WEIGHING = EVIDENCE.filter((c) => c.weighs);

export type Choice = 'scale' | 'aside';

/** Is this choice right for this card? */
export function isRight(card: EvidenceCard, choice: Choice) {
  return (choice === 'scale') === card.weighs;
}

/** The beam's tilt in degrees: level with no evidence; down on the evidence side as real evidence is laid on. */
export const MAX_TILT = 14;
export function evidenceTilt(choices: Partial<Record<string, Choice>>): number {
  const n = WEIGHING.filter((c) => choices[c.id] === 'scale').length;
  return Math.round(-MAX_TILT * (n / WEIGHING.length) * 100) / 100 || 0;
}

/** The reasons a visitor can give for choosing the heaviest evidence (they choose one or more, or write their own). */
export const REASONS = [
  { id: 'numbers', label: 'It uses numbers.' },
  { id: 'compares', label: 'It compares women with men.' },
  { id: 'study', label: 'It comes from a careful study of many monuments.' },
  { id: 'surprise', label: 'It surprised me.' },
] as const;
export type ReasonId = (typeof REASONS)[number]['id'];

/** The argument, in a sentence each: claim, evidence, reasoning. */
export function argumentLines(card: EvidenceCard, reasons: readonly ReasonId[], own: string) {
  const picked = REASONS.filter((r) => reasons.includes(r.id)).map((r) => r.label);
  const words = own.trim();
  return {
    claim: CLAIM,
    evidence: card.text,
    reasoning: [...picked, ...(words ? [words] : [])].join(' '),
  };
}

/** What the poster concludes, once the evidence is weighed. */
export const CONCLUSION = [POSTER.deeper, POSTER.households] as const;
