import type { ApprovedFact } from '@/components/exhibition/FactNote';
import type { SourceEntry, SourceGroup } from '@/components/exhibition/SourcesDrawer';
import { MET_CREDIT, NOTES, PHOTO_PARTS, PHOTOS, POSITIVE, RAIL_STEPS, WIRE_STEPS, WORKSHOP_TEXT, type PhotoId, type PhotoPart, type RailStepId, type WireStepId } from './inventionsText';

/*
 * Which notes each step of each bench opens under "Did you know?", and the
 * workshop's Sources drawer built from them: every note's source and every
 * photograph's credit, bench by bench and step by step. The benches read
 * their notes from here, so the drawer and the cards cannot drift apart.
 */

/** The railway, step by step. */
export const RAIL_FACTS: Record<RailStepId, ApprovedFact[]> = {
  sun: [NOTES.sunTime, NOTES.plymouth],
  journey: [NOTES.railwayTime, NOTES.travellersWatch],
  catch: [NOTES.missTrain, NOTES.railwayTime],
  set: [NOTES.clearingHouse, NOTES.timeSignals],
  bristol: [NOTES.bristolClock, NOTES.legalTime],
};

/** The telegraph's "How it works", step by step. */
export const WIRE_FACTS: Record<WireStepId, ApprovedFact[]> = {
  battery: [NOTES.wire],
  wire: [NOTES.wire],
  coil: [NOTES.oersted],
  needle: [NOTES.needles],
  morse: [NOTES.morse, NOTES.morseBritain],
};

/** The needle dial. */
export const NEEDLE_FACTS: ApprovedFact[] = [NOTES.telegraph, NOTES.dialLetters, NOTES.needles];

/** Sending a telegram: write it, tap it out, print it. */
export const SEND_FACTS: ApprovedFact[][] = [[NOTES.telegramPrice, NOTES.telegramForm], [NOTES.morse, NOTES.morseBritain], [NOTES.telegramForm]];

/** Receiving a telegram. */
export const RECEIVE_FACTS: ApprovedFact[] = [NOTES.morse, NOTES.morseBritain, NOTES.telegramForm];

/** Every note a photography part can show (some only once something is done), and the photographs it shows. */
export const PHOTO_FACTS: Record<PhotoPart, ApprovedFact[]> = {
  print: [NOTES.negative, NOTES.calotype, NOTES.sunPrint, NOTES.positives],
  still: [NOTES.exposure, NOTES.clamp, NOTES.prunes],
  three: [NOTES.daguerreotype, NOTES.calotype, NOTES.collodion, NOTES.cameron],
  sheet: [NOTES.positives],
};
export const PHOTO_CREDITS: Record<PhotoPart, PhotoId[]> = {
  print: ['negative'],
  still: ['daguerreotype'],
  three: ['daguerreotype', 'openDoor', 'cameron'],
  sheet: ['negative', 'daguerreotype', 'openDoor', 'cameron'],
};

/** Each source once, in the order the notes give them. */
const cite = (facts: ApprovedFact[]): SourceEntry[] =>
  facts.flatMap((f) => f.sources).filter((s, i, all) => all.findIndex((x) => x.href === s.href) === i);

/** A photograph's credit: maker, title, date and medium, linked to its record at the Met. */
const credit = (id: PhotoId): SourceEntry => {
  const p = PHOTOS[id];
  return {
    note: 'Photograph',
    label: `${p.maker}, ${p.title}, ${p.date}. ${p.medium}.${id === 'negative' ? ` ${POSITIVE.note}` : ''}`,
    href: p.href,
    licence: MET_CREDIT,
  };
};

export const INVENTIONS_SOURCES: SourceGroup[] = [
  ...RAIL_STEPS.map((s, i) => ({ title: `${WORKSHOP_TEXT.railwayHeading}, step ${i + 1}: ${s.title}`, items: cite(RAIL_FACTS[s.id]) })),
  ...WIRE_STEPS.map((s, i) => ({ title: `${WORKSHOP_TEXT.telegraphHeading}, how it works, step ${i + 1}: ${s.title}`, items: cite(WIRE_FACTS[s.id]) })),
  { title: `${WORKSHOP_TEXT.telegraphHeading}: the needle dial`, items: cite(NEEDLE_FACTS) },
  { title: `${WORKSHOP_TEXT.telegraphHeading}: send a telegram`, items: cite(SEND_FACTS.flat()) },
  { title: `${WORKSHOP_TEXT.telegraphHeading}: receive a telegram`, items: cite(RECEIVE_FACTS) },
  ...PHOTO_PARTS.map((p) => ({
    title: `${WORKSHOP_TEXT.photoHeading}: ${p.label}`,
    items: [...cite(PHOTO_FACTS[p.id]), ...PHOTO_CREDITS[p.id].map(credit)],
  })),
];
