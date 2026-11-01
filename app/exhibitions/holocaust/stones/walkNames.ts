import type { FactSource } from '@/components/exhibition/FactNote';
import { WALK_LINES, type WalkLine } from './walkLines';

/*
 * The names on the walk: between some of its steps, one child's name and
 * age, alone on black. Each is a real child, murdered in the Holocaust,
 * with a public record page of their own at the USHMM or the Holocaust
 * Memorial Day Trust; each is checked against that page, and each has its
 * own source in the walk's Sources drawer. Name and age only: nothing on
 * screen says how they died.
 *
 * Each follows a line of the history it belongs with (`after`), so the
 * names come in their place in the history: from the ghettos and the
 * deportations onward, never in the years before.
 */

export type WalkName = {
  id: string;
  name: string;
  /** Their age when they were murdered, as their record gives it. */
  age: string;
  /** The line of the history this name follows. */
  after: string;
  source: FactSource;
};

const ID_CARD = (name: string, slug: string): FactSource => ({ label: `USHMM, ID card: ${name}`, href: `https://encyclopedia.ushmm.org/content/en/id-card/${slug}` });

export const WALK_NAMES: readonly WalkName[] = [
  // REVIEW (Verity): https://encyclopedia.ushmm.org/content/en/id-card/henoch-kornfeld ("born in late 1938"; deported from the Rzeszow ghetto to Belzec, July 7, 1942; "Henoch was 3 and a half years old."). Follows the ghettos line.
  { id: 'N1', name: 'Henoch Kornfeld', age: '3', after: 'W11', source: ID_CARD('Henoch Kornfeld', 'henoch-kornfeld') },
  // REVIEW (Verity): https://encyclopedia.ushmm.org/content/en/id-card/tomas-kulka (born May 25, 1934, Olomouc; deported to Sobibor, May 9, 1942; "He was 7 years old."). Follows the trains line.
  { id: 'N2', name: 'Tomas Kulka', age: '7', after: 'W15', source: ID_CARD('Tomas Kulka', 'tomas-kulka') },
  // REVIEW (Verity): https://collections.ushmm.org/search/catalog/pa1164219 (USHMM Collections, her biography: born May 16, 1931; Theresienstadt, then Auschwitz in the autumn of 1944, "killed upon arrival"; so 13, worked out from those dates: the record gives no age). Follows the Theresienstadt line.
  { id: 'N3', name: 'Hana Brady', age: '13', after: 'W17', source: { label: 'USHMM Collections, Hana Brady (biography)', href: 'https://collections.ushmm.org/search/catalog/pa1164219' } },
  // REVIEW (Verity): https://encyclopedia.ushmm.org/content/en/id-card/zigmond-adler (born July 18, 1936, Liège; Mechelen, then Auschwitz, "where 7-year-old Zigmond was gassed on May 21, 1944"). Follows "As many as 1.5 million Jewish children were murdered."
  { id: 'N4', name: 'Zigmond Adler', age: '7', after: 'W19', source: ID_CARD('Zigmond Adler', 'zigmond-adler') },
  // REVIEW (Verity): https://encyclopedia.ushmm.org/content/en/id-card/judith-schwed (born January 11, 1932, Kiskunfélegyháza, Hungary; deported to Auschwitz June 25–28, 1944; "She was 12 years old."). Follows the hidden child's words (Yvonne Bernstein).
  { id: 'N5', name: 'Judith Schwed', age: '12', after: 'W21', source: ID_CARD('Judith Schwed', 'judith-schwed') },
  // REVIEW (Verity): https://www.hmd.org.uk/resource/anna-maria-settela-steinbach/ ("a nine-year-old Dutch Romani girl"; born December 23, 1934; murdered at Auschwitz, probably during the night of August 2, 1944). A Sinti girl: the walk remembers the Roma and Sinti too. Follows Louisa Gould's words, the last of the rescuers, before liberation.
  { id: 'N6', name: 'Settela Steinbach', age: '9', after: 'W24', source: { label: 'Holocaust Memorial Day Trust, “Anna Maria ‘Settela’ Steinbach”', href: 'https://www.hmd.org.uk/resource/anna-maria-settela-steinbach/' } },
  // REVIEW (Verity): https://hmd.org.uk/resource/anne-frank/ (born June 12, 1929; died at Bergen-Belsen in February 1945, "a few weeks before the camp was liberated"; so 15, worked out from those dates). Follows the line on the five million names Yad Vashem has recovered.
  { id: 'N7', name: 'Anne Frank', age: '15', after: 'W29', source: { label: 'Holocaust Memorial Day Trust, “Anne Frank”', href: 'https://hmd.org.uk/resource/anne-frank/' } },
];

/** One step of the walk: a line of the history with its picture, or a name alone on black. */
export type WalkBeat = { kind: 'line'; line: WalkLine } | { kind: 'name'; name: WalkName };

/** The walk, step by step: every line in order, each name just after the line it follows. */
export const WALK_BEATS: readonly WalkBeat[] = WALK_LINES.flatMap((line): WalkBeat[] => [
  { kind: 'line', line },
  ...WALK_NAMES.filter((n) => n.after === line.id).map((name): WalkBeat => ({ kind: 'name', name })),
]);

/** A name as it is shown, and read out: "Hana Brady, 13". */
export const nameText = (n: WalkName) => `${n.name}, ${n.age}`;

/** The step at `steps` (1-based): null before the first, and after the last. */
export function beatForStep(steps: number): WalkBeat | null {
  return steps >= 1 && steps <= WALK_BEATS.length ? WALK_BEATS[steps - 1] : null;
}
