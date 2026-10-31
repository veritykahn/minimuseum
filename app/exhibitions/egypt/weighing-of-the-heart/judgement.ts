import type { ApprovedFact } from '@/components/exhibition/FactNote';
import { BM_ANI, BM_HIEROGLYPHS, BM_MUMMY_NOTES, BUDGE, PENN_JUDGMENT } from '../rooms';

/*
 * The Weighing of the Heart. The visitor helps the scribe Ani through his
 * judgement: each card names a deed, and the visitor sorts it by what Ani
 * says of it before the judges, a wrong he swears he never did or a good
 * deed he says he did. Every card's answer is Ani's own words, from chapter
 * 125 of his Book of the Dead (the Papyrus of Ani, British Museum EA10470),
 * in E. A. Wallis Budge's translation for the British Museum, quoted
 * exactly. The card's own label is only the deed named plainly.
 *
 * Each right answer lightens the heart toward the feather; each wrong one
 * makes it heavier, and Ammit leans closer. The scales balance only when
 * almost every card is sorted right. Nothing is eaten: a heavy heart ends
 * with Ammit waiting and an invitation to try again.
 */

export type Deed = {
  id: string;
  /** The deed, named plainly on the card. */
  label: string;
  /** What Ani says of it: a wrong he never did, or a good deed he did. */
  kind: 'never' | 'did';
  /** Ani's words, exactly as Budge translates them. */
  quote: string;
};

const GAVE = 'I have given bread to the hungry, water to the thirsty, raiment to the naked, and a boat to him that needed one.';

export const DEEDS: Deed[] = [
  { id: 'lied', label: 'Telling lies', kind: 'never', quote: 'I have not lied.' },
  { id: 'bread', label: 'Giving bread to people who are hungry', kind: 'did', quote: GAVE },
  { id: 'robbed', label: 'Robbing someone', kind: 'never', quote: 'I have not robbed.' },
  { id: 'hunger', label: 'Letting someone go hungry', kind: 'never', quote: 'I have not let any man hunger.' },
  { id: 'water', label: 'Giving water to people who are thirsty', kind: 'did', quote: GAVE },
  { id: 'weep', label: 'Making someone cry', kind: 'never', quote: 'I have made no one to weep.' },
  { id: 'milk', label: 'Taking milk from children', kind: 'never', quote: 'I have not taken milk from the mouths of children.' },
  { id: 'boat', label: 'Lending a boat to someone who needed one', kind: 'did', quote: GAVE },
  { id: 'stream', label: 'Stopping water that should flow', kind: 'never', quote: 'I have not stopped water [when it should flow].' },
];

/** How many wrong answers the heart can bear and still balance. */
export const MISTAKES_ALLOWED = 1;

/**
 * The beam's tilt in degrees: positive, the heart's side down. It starts
 * heavy; each right answer lightens it, each wrong one adds weight. When
 * every card is answered within the limit, the scales settle level.
 */
export function tilt(right: number, wrong: number, total = DEEDS.length): number {
  if (verdict(right, wrong, total) === 'balanced') return 0;
  const unanswered = total - right - wrong;
  return Math.min(18, Math.round((unanswered * 1.6 + wrong * 3.5) * 10) / 10);
}

export function verdict(right: number, wrong: number, total = DEEDS.length): 'weighing' | 'balanced' | 'heavy' {
  if (right + wrong < total) return 'weighing';
  return wrong <= MISTAKES_ALLOWED ? 'balanced' : 'heavy';
}

export const JUDGEMENT_NOTES = {
  scales: {
    text: 'In the Book of the Dead of Hunefer, Hunefer’s heart is weighed against the feather of Maat. Anubis watches over the scales, while the “devourer”, part crocodile, part lion and part hippopotamus, waits to see the judgement.',
    sources: [BM_MUMMY_NOTES],
  },
  maat: {
    text: 'Maat, the goddess of truth, is shown as a feather or as a seated goddess with a feather on her head. Thoth, the god of writing, records the result.',
    sources: [BM_HIEROGLYPHS],
  },
  confession: {
    text: 'Before a tribunal in the afterlife, the dead person recited a long list of wrongs they had not done: the so-called Negative Confession. Having shown a good life before the forty-two judges, they were admitted into the presence of Osiris.',
    sources: [PENN_JUDGMENT],
  },
  ani: {
    text: 'Ani’s words come from his Book of the Dead, a papyrus roll now in the British Museum, in the translation by E. A. Wallis Budge.',
    sources: [BM_ANI, BUDGE],
  },
  heart: {
    text: 'Heart amulets were often buried with the dead, sometimes inside the mummy wrappings, for extra protection at the judgement. Some bore a spell telling the heart: “Do not stand as a witness!”',
    sources: [BM_HIEROGLYPHS],
  },
} satisfies Record<string, ApprovedFact>;
