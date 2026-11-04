import type { ApprovedFact } from '@/components/exhibition/FactNote';
import type { SourceGroup } from '@/components/exhibition/SourcesDrawer';
import { BM_ANI, BM_ANI_JUDGEMENT, BM_HIEROGLYPHS, BM_HUNEFER, BM_MUMMY_NOTES, BUDGE, PENN_JUDGMENT } from '../rooms';

/*
 * The Weighing of the Heart, told as a story the visitor follows and
 * predicts. Two papyri in the British Museum show this judgement: the
 * Papyrus of Ani (EA10470) and the Book of the Dead of Hunefer (EA9901).
 * The room introduces both, says which is which, and then follows Ani's,
 * which E. A. Wallis Budge calls the most complete form of the scene.
 * Ani's words are his own, from chapters 30B and 125 of his Book of the
 * Dead, in Budge's translation for the British Museum, quoted exactly.
 *
 * The scales start level, with nothing in the pans. As the story goes on,
 * the visitor predicts what the scales will do, and they move: Ani's heart
 * goes in, a wrong he swears he never did would tip them (and they tip, to
 * show it, then settle back as he speaks the truth), a good deed keeps
 * them level. At the end they balance, as Budge says they do in Ani's
 * papyrus, and Ani goes on to the Field of Reeds. A wrong guess never
 * weighs Ani down: it is only a guess, and the room says so kindly.
 *
 * Which way an unbalanced scale tips is told differently by different
 * writers (Budge writes of hearts "light in the balance"), so the room says
 * only "tip out of balance", never "heavier" or "lighter". Ammit is drawn
 * as the British Museum describes her in Ani's papyrus: the head of a
 * crocodile, the forepart of a lion, the hindquarters of a hippopotamus.
 * Nothing is eaten, and nothing frightening is said.
 *
 * Everything below marked REVIEW is new text for the owner's review.
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
  { id: 'weep', label: 'Making someone cry', kind: 'never', quote: 'I have made no one to weep.' },
  { id: 'stream', label: 'Stopping water that should flow', kind: 'never', quote: 'I have not stopped water [when it should flow].' },
  { id: 'boat', label: 'Lending a boat to someone who needed one', kind: 'did', quote: GAVE },
  { id: 'milk', label: 'Taking milk from children', kind: 'never', quote: 'I have not taken milk from the mouths of children.' },
];

/** Ani's words to his own heart, as it goes on the scales (chapter 30B), exactly as Budge translates them. */
export const HEART_WORDS = 'My heart of my mother! My heart of my mother! My heart of my being! Make no stand against me when testifying … utter no lie against me before the Great God, the Lord of Amentt.';

/** The story's chapters, each a step with its own Back and Next. */
export const CHAPTERS = [
  { id: 'papyri', name: 'Two papyri' },
  { id: 'hall', name: 'The hall' },
  { id: 'heart', name: 'The heart' },
  { id: 'words', name: 'Ani’s words' },
  { id: 'verdict', name: 'The verdict' },
  { id: 'you', name: 'Your scales' },
] as const;
export type ChapterId = (typeof CHAPTERS)[number]['id'];

/** Who is who in the hall, to tap and meet. */
export type FigureId = 'ani' | 'anubis' | 'thoth' | 'maat' | 'ammit';

/** What the scales show: level (0), or tipped out of balance on the heart's side (degrees). */
export const TIP = 12;

/**
 * The prediction the visitor makes for a deed: would the scales stay level
 * or tip? A wrong Ani swears he never did would tip them if he had done it;
 * a good deed he did keeps them level.
 */
export function wouldTip(deed: Deed): boolean {
  return deed.kind === 'never';
}

/** The good choices a visitor can set on their own scales at the end (no wrong answers, nothing scored, nothing stored). */
// REVIEW: new text (a reflection, not a fact).
export const MY_CHOICES = ['I helped someone', 'I told the truth when it was hard', 'I shared', 'I said sorry', 'I was kind to someone new', 'I kept trying', 'I listened', 'I looked after something living'];

export const PAPYRI = {
  ani: {
    // REVIEW: new text. British Museum EA10470,3: "'Book of the Dead', Papyrus of Ani (frame 3): Ani's Judgment … Into this formidable gathering comes Ani, accompanied by his wife Tutu"; production date "1250BC (circa)". Budge: "the scribe Ani"; "The most complete form of it is given in the Papyrus of Ani".
    text: 'The Papyrus of Ani (British Museum EA 10470) was made for the scribe Ani, about 1250 BC. In its judgement scene, Ani comes into the hall with his wife, Tutu. It shows the judgement more completely than any other papyrus, so this story follows Ani.',
    sources: [BM_ANI_JUDGEMENT, BUDGE],
  },
  hunefer: {
    // REVIEW: new text. British Museum notes for teachers: "Scene from the Book of the Dead of Hunefer (1275 BC) which shows Hunefer's heart being weighed against the feather of Maat … Anubis watches over the scales". British Museum EA9901,3: "as royal scribe … Thoth, ibis-headed, holds a pen and scribal palette to record the outcome of the weighing."
    text: 'The Book of the Dead of Hunefer (British Museum EA 9901) was made for Hunefer, a royal scribe, about 1275 BC. It shows the same moment: Hunefer’s heart weighed against the feather of Maat, with Anubis at the scales and Thoth ready to write down the result.',
    sources: [BM_MUMMY_NOTES, BM_HUNEFER],
  },
} satisfies Record<string, ApprovedFact>;

export const FIGURES: Record<FigureId, { name: string; fact: ApprovedFact }> = {
  ani: {
    name: 'Ani and Tutu',
    // REVIEW: new text. British Museum EA10470,3: "Into this formidable gathering comes Ani, accompanied by his wife Tutu." Budge: "Ani, accompanied by his wife, is seen standing with head bent low in adoration".
    fact: { text: 'Ani comes into the hall with his wife, Tutu. He stands with his head bowed low.', sources: [BM_ANI_JUDGEMENT, BUDGE] },
  },
  anubis: {
    name: 'Anubis',
    // REVIEW: new text. Budge: "The pointer of the Balance is in the charge of Anpu" (Anubis).
    fact: { text: 'Jackal-headed Anubis looks after the scales, and watches the pointer.', sources: [BUDGE] },
  },
  thoth: {
    name: 'Thoth',
    fact: { text: 'Thoth, the god of writing, records the result.', sources: [BM_HIEROGLYPHS] },
  },
  maat: {
    name: 'Maat',
    fact: { text: 'Maat, the goddess of truth, is shown as a feather or as a seated goddess with a feather on her head.', sources: [BM_HIEROGLYPHS] },
  },
  ammit: {
    name: 'Ammit',
    // REVIEW: new text. British Museum EA10470,3: "This creature has the head of a crocodile, the forepart of a lion, and the hindquarters of a hippopotamus."
    fact: { text: 'Ammit waits by the scales. She has the head of a crocodile, the front of a lion and the back of a hippopotamus.', sources: [BM_ANI_JUDGEMENT] },
  },
};

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
  // REVIEW: new text. Budge, ch. VII: "the heart was considered to be the seat of all will, emotion, feeling, reason and intelligence" and Ani "addressed it, saying, 'My heart of my mother! …'".
  heartWords: {
    text: 'The Egyptians thought the heart held a person’s will, feelings and thoughts. As his heart is weighed, Ani speaks to it, asking it not to speak against him.',
    sources: [BUDGE],
  },
  // REVIEW: new text. Budge, ch. VII: "when Ani's heart was weighed against Truth, the beam of the Great Balance remained perfectly horizontal"; the gods "were quite satisfied if it exactly counterbalanced Truth".
  level: {
    text: 'In Ani’s papyrus, when his heart is weighed against the feather, the beam of the scales stays perfectly level. That is what the gods hoped for: a heart that balances truth exactly.',
    sources: [BUDGE],
  },
  // REVIEW: new text. Budge, ch. VII: Thoth says "according to the Great Balance his case is truth … No wickedness hath been found in him"; Horus "takes him by the hand and leads him forward" to Osiris; the gods grant "an abiding homestead in the Field of Offerings"; the Sekhet Aaru, "Field of Reeds". British Museum EA10470,3: "All, it seems, goes well for Ani; he has qualified for the Afterlife."
  verdict: {
    text: 'Thoth tells the gods that no wickedness has been found in Ani. Horus takes him by the hand and leads him to Osiris, and the gods give him a home in the fields of the afterlife, the Field of Reeds.',
    sources: [BUDGE, BM_ANI_JUDGEMENT],
  },
  // REVIEW: new text. Budge, ch. VII: the Field of Reeds "represents in many respects a typical Egyptian farm, and we see the deceased engaged in ploughing and reaping".
  reeds: {
    text: 'The Field of Reeds looked like a good Egyptian farm, where the dead ploughed and reaped, just as Sennedjem does on his tomb’s painted wall.',
    sources: [BUDGE],
  },
} satisfies Record<string, ApprovedFact>;

/** The room's Sources drawer, by chapter. */
export const WEIGHING_SOURCES: SourceGroup[] = [
  { title: 'Two papyri', items: [...PAPYRI.ani.sources, ...PAPYRI.hunefer.sources] },
  { title: 'The hall', items: [...new Map(Object.values(FIGURES).flatMap((f) => f.fact.sources).map((s) => [s.href, s])).values()] },
  { title: 'The heart', items: [...JUDGEMENT_NOTES.heartWords.sources, ...JUDGEMENT_NOTES.level.sources.filter((s) => s !== BUDGE), ...JUDGEMENT_NOTES.heart.sources] },
  { title: 'Ani’s words', items: [...JUDGEMENT_NOTES.ani.sources, ...JUDGEMENT_NOTES.confession.sources] },
  { title: 'The verdict', items: [...JUDGEMENT_NOTES.verdict.sources, ...JUDGEMENT_NOTES.scales.sources, ...JUDGEMENT_NOTES.maat.sources.filter((s) => s !== BM_HIEROGLYPHS)] },
  {
    title: 'Pictures',
    items: [
      { label: 'The hall of judgement is drawn for the Mini Museum, after the scenes in the two papyri.' },
      { label: 'Hieroglyphs set in Noto Sans Egyptian Hieroglyphs', licence: 'SIL Open Font License' },
    ],
  },
];
