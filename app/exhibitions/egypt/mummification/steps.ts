import type { ApprovedFact } from '@/components/exhibition/FactNote';
import { EGYPT_CASE } from '../egypt';
import { BM_HIEROGLYPHS, BM_MUMMY_NOTES, BM_MUMMY_VISIT, BUDGE, GLYPHS, met, type GlyphCode } from '../rooms';

/*
 * Mummification, step by step: the seventy days as the British Museum's
 * teaching resources describe them, after Herodotus. It is told plainly and
 * gently, with nothing drawn that a young visitor need look away from: the
 * body is a simple figure in the Egyptian manner, the organs are simple
 * shapes, and the brain is a grey shape that leaves through the nose and is
 * gone (as the British Museum says, it was not kept).
 *
 * Every sentence of fact is a museum note with its source; the one poster
 * line (Anubis) is quoted from the posters' own text.
 */

export type StepId = 'why' | 'wash' | 'brain' | 'organs' | 'natron' | 'oils' | 'wrap' | 'coffin';

export type Step = {
  id: StepId;
  /** The step's short name, for its tab. */
  name: string;
  title: string;
  /** Where the step falls in the seventy days, for the timeline: a share of it, or null when it has no place there. */
  span: [number, number] | null;
  /** The timeline's words for it. */
  when: string;
  notes: ApprovedFact[];
};

/** Poster 2's line on Anubis, word for word. */
export const ANUBIS_POSTER = EGYPT_CASE.artifacts.find((a) => a.id === 'anubis')!.writing![0].text;

export const STEPS: Step[] = [
  {
    id: 'why',
    name: 'Why',
    title: 'A body for the afterlife',
    span: null,
    when: 'Before it begins',
    notes: [
      {
        text: 'Preserving the body was an essential part of ancient Egyptian funerary belief. The body was needed to house the ba, a person’s spiritual side, and let the person live in the afterlife.',
        sources: [BM_MUMMY_NOTES],
      },
      {
        text: 'The clearest written account of mummification comes from Herodotus, a Greek historian who visited Egypt in about 450 BC. In the most elaborate and expensive mummifications, he records, the whole process took 70 days.',
        sources: [BM_MUMMY_VISIT],
      },
    ],
  },
  {
    id: 'wash',
    name: 'Washing',
    title: 'Washing the body',
    span: [0, 0.03],
    when: 'The first day',
    notes: [
      {
        text: 'Mummifying a body was the work of specialist workers. First, the body was purified by washing.',
        sources: [BM_MUMMY_VISIT],
      },
    ],
  },
  {
    id: 'brain',
    name: 'The brain',
    title: 'The brain, through the nose',
    span: [0.02, 0.04],
    when: 'The first days',
    notes: [
      // REVIEW: new text. British Museum, "Ancient Egyptian mummification" visit resource, p. 4: "The brain was removed through the nose and discarded."
      {
        text: 'The brain was removed through the nose, and it was not kept: it was thrown away.',
        sources: [BM_MUMMY_VISIT],
      },
      // REVIEW: new text. British Museum, "What is mummification?" notes for teachers, slide 3: "Bronze probe from Egypt, after 664 BC. Hooks such as this were used to remove the brain."
      {
        text: 'The embalmers used a long bronze hook. The British Museum has one, made after 664 BC.',
        sources: [BM_MUMMY_NOTES],
      },
    ],
  },
  {
    id: 'organs',
    name: 'Canopic jars',
    title: 'The organs and the canopic jars',
    span: [0.02, 0.06],
    when: 'The first days',
    notes: [
      {
        text: 'The internal organs, apart from the heart and sometimes the kidneys, were removed through a cut in the left side of the body. They were dried, wrapped and placed in canopic jars.',
        sources: [BM_MUMMY_VISIT],
      },
      {
        text: 'Each jar had a protective god: human-headed Imset preserved the liver, baboon-headed Hapi cared for the lungs, jackal-headed Duamutef protected the stomach, and falcon-headed Qebehsenuef looked after the intestines.',
        sources: [BM_HIEROGLYPHS],
      },
      {
        text: 'From the late Eighteenth Dynasty, the jars’ stoppers often show these four Sons of Horus, minor gods who protect the organs.',
        sources: [BM_MUMMY_NOTES],
      },
    ],
  },
  {
    id: 'natron',
    name: 'Natron',
    title: 'Forty days in natron',
    span: [0.06, 0.63],
    when: '40 days',
    notes: [
      {
        text: 'Bags of natron, a natural salt, were packed inside and outside the body and left for 40 days, until all the moisture had gone.',
        sources: [BM_MUMMY_VISIT],
      },
    ],
  },
  {
    id: 'oils',
    name: 'Oils',
    title: 'Oils and resin',
    span: [0.63, 0.7],
    when: 'After the natron',
    notes: [
      {
        text: 'The body was filled with linen or clean natron, to restore some of its shape, and coated in resin and sweet-smelling oils to help preserve it.',
        sources: [BM_MUMMY_NOTES, BM_MUMMY_VISIT],
      },
    ],
  },
  {
    id: 'wrap',
    name: 'Wrapping',
    title: 'Wrapping, with amulets',
    span: [0.7, 0.97],
    when: 'The last weeks',
    notes: [
      {
        text: 'The bandaging was done very carefully, with amulets placed between the layers to protect the body and spirit. The bandages were not always made specially: they could be strips of household linen.',
        sources: [BM_MUMMY_NOTES],
      },
      {
        text: 'It has been estimated that one mummy in the British Museum, a young woman’s, needed about 448 square yards of linen wrappings.',
        sources: [BM_MUMMY_NOTES],
      },
    ],
  },
  {
    id: 'coffin',
    name: 'Day 70',
    title: 'Ready for the coffin',
    span: [0.97, 1],
    when: 'About day 70',
    notes: [
      {
        text: 'The mummy was then ready to be placed in its coffin, or coffins, for the burial ceremony.',
        sources: [BM_MUMMY_NOTES],
      },
    ],
  },
];

/** The four Sons of Horus and the organ each protected (the British Museum's Hieroglyphs exhibition text). */
export const JARS: { god: string; head: string; glyph: GlyphCode; organ: string }[] = [
  { god: 'Imset', head: 'human', glyph: 'D1', organ: 'liver' },
  { god: 'Hapi', head: 'baboon', glyph: 'E32', organ: 'lungs' },
  { god: 'Duamutef', head: 'jackal', glyph: 'E15', organ: 'stomach' },
  { god: 'Qebehsenuef', head: 'falcon', glyph: 'G5', organ: 'intestines' },
];

/** The organs in the order the matching game offers them: not the jars' order. */
export const ORGANS = ['stomach', 'liver', 'intestines', 'lungs'];

export function jarFor(organ: string) {
  return JARS.find((j) => j.organ === organ)!;
}

/** The amulets that can be tucked between the wrappings, each with its note. */
export const WRAP_AMULETS: { id: string; name: string; glyph: string; note: ApprovedFact }[] = [
  {
    id: 'wedjat',
    name: 'Wedjat eye',
    glyph: GLYPHS.D10,
    note: { text: 'Because of their power of renewal, wedjat eye amulets were placed in mummy wrappings in great numbers.', sources: [BM_MUMMY_NOTES] },
  },
  {
    id: 'heart',
    name: 'Heart amulet',
    glyph: GLYPHS.F34,
    note: { text: 'Heart amulets were often buried with the dead, sometimes wrapped inside the mummy bandages, for extra protection at the judgement in the afterlife.', sources: [BM_HIEROGLYPHS] },
  },
  {
    id: 'djed',
    name: 'Djed pillar',
    glyph: GLYPHS.R11,
    note: { text: 'A small faience djed pillar amulet, now at The Met, was found on the left arm of a mummy at Deir el-Bahri, together with a wedjat eye amulet and a Thoth amulet.', sources: [met(587565, 'Djed Pillar Amulet')] },
  },
];

/** How many layers of linen the wrapping takes, in the room. */
export const LAYERS = 4;

/**
 * The heart, left inside: once the four jars are full, the visitor is asked
 * which organ the embalmers did not take out.
 */
export const HEART_NOTE: ApprovedFact = {
  // REVIEW: new text. British Museum visit resource, p. 4: "the internal organs, apart from the heart and sometimes the kidneys, were removed". E. A. Wallis Budge, The Book of the Dead (British Museum), ch. VII: "the heart was considered to be the seat of all will, emotion, feeling, reason and intelligence".
  text: 'The heart was left inside the body. The Egyptians thought the heart held a person’s will, feelings and thoughts, and in the afterlife it would be weighed against the feather of truth.',
  sources: [BM_MUMMY_VISIT, BUDGE],
};

/** The short check at the end: three questions, each answered from a step the visitor has done. */
export const CHECK: { q: string; options: string[]; answer: string; after: string }[] = [
  // REVIEW: new text, each answer from the notes above (British Museum visit resource and notes for teachers).
  { q: 'About how many days did the whole process take?', options: ['7 days', '70 days', '700 days'], answer: '70 days', after: 'About 70 days, with 40 of them in natron.' },
  { q: 'Which organ was left inside the body?', options: ['The heart', 'The brain', 'The liver'], answer: 'The heart', after: 'The heart stayed, ready for the weighing.' },
  { q: 'What dried the body out?', options: ['Sand from the river', 'Natron, a natural salt', 'Smoke from a fire'], answer: 'Natron, a natural salt', after: 'Natron, packed inside and out for 40 days.' },
];
