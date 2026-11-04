import type { FactSource } from '@/components/exhibition/FactNote';

/*
 * The walk's first names: seven children, each a real child murdered in the
 * Holocaust, with a public record page of their own at the USHMM or the
 * Holocaust Memorial Day Trust; each is checked against that page, and each
 * has its own source in the walk's Sources drawer. Name and age only.
 *
 * The walk's names now come from victims.json, built from real records
 * (victims.ts); these seven stand in while it is empty, shown with what is
 * known of them here: their name and their age, not yet the year they died
 * or where.
 */

export type WalkName = {
  id: string;
  name: string;
  /** Their age when they were murdered, as their record gives it. */
  age: string;
  source: FactSource;
};

const ID_CARD = (name: string, slug: string): FactSource => ({ label: `USHMM, ID card: ${name}`, href: `https://encyclopedia.ushmm.org/content/en/id-card/${slug}` });

export const WALK_NAMES: readonly WalkName[] = [
  // REVIEW (Verity): https://encyclopedia.ushmm.org/content/en/id-card/henoch-kornfeld ("born in late 1938"; deported from the Rzeszow ghetto to Belzec, July 7, 1942; "Henoch was 3 and a half years old.").
  { id: 'N1', name: 'Henoch Kornfeld', age: '3', source: ID_CARD('Henoch Kornfeld', 'henoch-kornfeld') },
  // REVIEW (Verity): https://encyclopedia.ushmm.org/content/en/id-card/tomas-kulka (born May 25, 1934, Olomouc; deported to Sobibor, May 9, 1942; "He was 7 years old.").
  { id: 'N2', name: 'Tomas Kulka', age: '7', source: ID_CARD('Tomas Kulka', 'tomas-kulka') },
  // REVIEW (Verity): https://collections.ushmm.org/search/catalog/pa1164219 (USHMM Collections, her biography: born May 16, 1931; Theresienstadt, then Auschwitz in the autumn of 1944, "killed upon arrival"; so 13, worked out from those dates: the record gives no age).
  { id: 'N3', name: 'Hana Brady', age: '13', source: { label: 'USHMM Collections, Hana Brady (biography)', href: 'https://collections.ushmm.org/search/catalog/pa1164219' } },
  // REVIEW (Verity): https://encyclopedia.ushmm.org/content/en/id-card/zigmond-adler (born July 18, 1936, Liège; Mechelen, then Auschwitz, "where 7-year-old Zigmond was gassed on May 21, 1944").
  { id: 'N4', name: 'Zigmond Adler', age: '7', source: ID_CARD('Zigmond Adler', 'zigmond-adler') },
  // REVIEW (Verity): https://encyclopedia.ushmm.org/content/en/id-card/judith-schwed (born January 11, 1932, Kiskunfélegyháza, Hungary; deported to Auschwitz June 25–28, 1944; "She was 12 years old.").
  { id: 'N5', name: 'Judith Schwed', age: '12', source: ID_CARD('Judith Schwed', 'judith-schwed') },
  // REVIEW (Verity): https://www.hmd.org.uk/resource/anna-maria-settela-steinbach/ ("a nine-year-old Dutch Romani girl"; born December 23, 1934; murdered at Auschwitz, probably during the night of August 2, 1944). A Sinti girl: the walk remembers the Roma and Sinti too.
  { id: 'N6', name: 'Settela Steinbach', age: '9', source: { label: 'Holocaust Memorial Day Trust, “Anna Maria ‘Settela’ Steinbach”', href: 'https://www.hmd.org.uk/resource/anna-maria-settela-steinbach/' } },
  // REVIEW (Verity): https://hmd.org.uk/resource/anne-frank/ (born June 12, 1929; died at Bergen-Belsen in February 1945, "a few weeks before the camp was liberated"; so 15, worked out from those dates).
  { id: 'N7', name: 'Anne Frank', age: '15', source: { label: 'Holocaust Memorial Day Trust, “Anne Frank”', href: 'https://hmd.org.uk/resource/anne-frank/' } },
];
