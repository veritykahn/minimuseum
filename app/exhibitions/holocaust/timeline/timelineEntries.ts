import type { FactSource } from '@/components/exhibition/FactNote';

/*
 * The Timeline of the Holocaust: every entry on the owner's poster, word for
 * word.
 *
 * The poster is the owner's own design: a tall chart, cream type on black,
 * barbed wire down both margins and a Star of David at the top right and
 * lower left, running from January 1933 to May 1945. It was transcribed from
 * the full-size original (design-raw/"holocaust timeline copy 3.jpg",
 * 2400 × 12600, in the owner's veritykahn-site repo; "copy 2" there is the
 * Black Barbie timeline, not this poster), read in slices.
 *
 * What is printed is set here exactly: the wording, the capitals and the
 * punctuation, the poster's typos included (each flagged below for the
 * owner, never quietly fixed). The dates are in capitals because the poster
 * prints them so. "*…*" marks the words the poster sets in italics
 * (*Kristallnacht*, *Aktion T4*), as holocaust.ts does. Every word was
 * readable: nothing is marked unreadable.
 *
 * Each entry has its sources, from the USHMM Holocaust Encyclopedia, for the
 * room's Sources drawer (sources.ts). Where a source gives a fact differently
 * from the poster, the poster's words stay as printed and a
 * "REVIEW (Verity):" note says what differs.
 *
 * `when` is the date written out in US style ("January 30, 1933") for the
 * screen reader, the Sources drawer and the order cards: typesetting, not the
 * poster's words. `side` is the side of the line the poster sets the words
 * on (the date is on the other), so the room can lay them out as the poster
 * does.
 */

export type TimelineEntry = {
  /** The entry's address (#1933-01-30) and its sort key: the date, as far as the poster gives it. */
  id: string;
  /** The year, large on the poster. */
  year: number;
  /** The date under the year, as printed. */
  date: string;
  /** The date written out for a label ("January 30, 1933"). */
  when: string;
  /** The poster's words, as printed. "*…*" is italic. */
  words: string;
  /** The side of the line the poster sets the words on. */
  side: 'left' | 'right';
  sources: FactSource[];
};

const ushmm = (title: string, path: string): FactSource => ({
  label: `USHMM Holocaust Encyclopedia, “${title}”`,
  href: `https://encyclopedia.ushmm.org/content/en/${path}`,
});

/** The poster's title, as printed: "TIMELINE OF THE" over "Holocaust". */
export const POSTER_TITLE = { over: 'TIMELINE OF THE', main: 'Holocaust' };

/** The owner's name for the poster, for its credit. */
export const POSTER_NAME = 'The Timeline of the Holocaust';

/** The poster's opening line, as printed (in capitals). */
export const POSTER_INTRO =
  'THE HOLOCAUST WAS THE SYSTEMATIC, STATE-SPONSORED PERSECUTION AND MURDER OF SIX MILLION JEWS BY THE NAZI REGIME AND ITS ALLIES AND COLLABORATORS WHICH BEGAN IN 1933.';

/*
 * The poster's close: a QR code beside a box reading "LEARN MORE ABOUT THE
 * TIMELINE AND EVENTS OF THE HOLOCAUST". The QR code opens the USHMM's
 * Holocaust timeline (decoded from the poster), so on screen the box's words
 * are a link there, as poster 2's QR code is in the exhibition.
 */
export const POSTER_LEARN_MORE = 'LEARN MORE ABOUT THE TIMELINE AND EVENTS OF THE HOLOCAUST';
export const POSTER_QR_URL = 'https://encyclopedia.ushmm.org/content/en/timeline/holocaust';

export const TIMELINE_ENTRIES: TimelineEntry[] = [
  {
    id: '1933-01-30',
    year: 1933,
    date: 'JANUARY 30',
    when: 'January 30, 1933',
    words: 'Adolf Hitler is appointed Chancellor of Germany',
    side: 'right',
    sources: [
      ushmm('Hitler Comes to Power', 'article/hitler-comes-to-power'),
      ushmm('Adolf Hitler is Appointed Chancellor', 'timeline-event/holocaust/1933-1938/hitler-appointed-chancellor'),
    ],
  },
  {
    id: '1933-03-22',
    year: 1933,
    date: 'MARCH 22',
    when: 'March 22, 1933',
    words: 'Dachau, the first concentration camp, is established',
    side: 'left',
    // The USHMM calls Dachau "the first regular concentration camp established by the National Socialist (Nazi) government": the poster's "first" agrees.
    sources: [ushmm('Dachau', 'article/dachau'), ushmm('Establishment of Dachau Camp', 'timeline-event/holocaust/1933-1938/establishment-of-dachau-camp')],
  },
  {
    id: '1933-04-01',
    year: 1933,
    date: 'APRIL 1',
    when: 'April 1, 1933',
    words: 'Nationwide boycott of Jewish businesses in Germany',
    side: 'right',
    sources: [ushmm('The Boycott of Jewish Businesses', 'article/the-boycott-of-jewish-businesses')],
  },
  {
    id: '1935-09-15',
    year: 1935,
    date: 'SEPTEMBER 15',
    when: 'September 15, 1935',
    words: 'The Nuremberg Laws are enacted, stripping Jews of citizenship and banning marriage between Jews and non-Jews',
    side: 'left',
    sources: [ushmm('The Nuremberg Race Laws', 'article/the-nuremberg-race-laws')],
  },
  {
    id: '1938-03-12',
    year: 1938,
    date: 'MARCH 12',
    when: 'March 12, 1938',
    words: 'Germany annexes Austria (Anschluss); persecution of Austrian Jews begins',
    side: 'right',
    // REVIEW (Verity): the USHMM has German troops entering Austria on March 12, 1938, and Austria "incorporated into Germany the next day" (March 13). The poster's date is the day the troops entered; the words stay as printed.
    sources: [ushmm('Austria', 'article/austria')],
  },
  {
    id: '1938-11-09',
    year: 1938,
    date: 'NOVEMBER 9 - 10',
    when: 'November 9–10, 1938',
    words: '*Kristallnacht* (Night of Broken Glass): Synagogues are burned, Jewish businesses are destroyed, and thousands of Jews are arrested',
    side: 'left',
    sources: [ushmm('Kristallnacht', 'article/kristallnacht'), ushmm('Kristallnacht', 'timeline-event/holocaust/1933-1938/kristallnacht')],
  },
  {
    id: '1939-09-01',
    year: 1939,
    date: 'SEPTEMBER 1',
    when: 'September 1, 1939',
    words: 'Germany invades Poland, starting World War II',
    side: 'right',
    sources: [ushmm('Invasion of Poland, Fall 1939', 'article/invasion-of-poland-fall-1939')],
  },
  {
    id: '1939-10',
    year: 1939,
    date: 'OCTOBER',
    when: 'October 1939',
    words: 'Nazis begin *Aktion T4*, the euthanasia program targeting disabled individuals',
    side: 'left',
    // REVIEW (Verity): the USHMM dates the program to 1939: planning for the killing of children began that spring and summer, and Hitler signed the authorization for adults in the autumn, backdated to September 1, 1939. Its one October date is that "beginning in October 1939" health authorities urged parents to admit disabled children to clinics where they were killed. The poster's "October" fits, though the USHMM gives no single start date.
    sources: [ushmm('Euthanasia Program', 'article/euthanasia-program')],
  },
  {
    id: '1940-05',
    year: 1940,
    date: 'MAY',
    when: 'May 1940',
    words: 'Auschwitz concentration camp is established',
    side: 'right',
    // REVIEW (Verity): the USHMM says the SS established Auschwitz in "spring 1940": Rudolf Höss was named commandant on May 4, 1940, and the first prisoners (Polish political prisoners) arrived in June 1940. The poster's "May" fits; the words stay as printed.
    sources: [ushmm('Auschwitz', 'article/auschwitz')],
  },
  {
    id: '1940-10',
    year: 1940,
    date: 'OCTOBER',
    when: 'October 1940',
    words: 'The Warsaw Ghetto is established, confining hundreds of thousands of Jews',
    side: 'left',
    // The USHMM: "In October 1940, German officials decreed the establishment of a ghetto in Warsaw"; it was sealed in November 1940, with over 400,000 Jews inside.
    sources: [ushmm('Warsaw', 'article/warsaw'), ushmm('Warsaw Ghetto Sealed', 'timeline-event/holocaust/1939-1941/warsaw-ghetto-sealed')],
  },
  {
    id: '1941-06-22',
    year: 1941,
    date: 'JUNE 22',
    when: 'June 22, 1941',
    words: 'Germany invades the Soviet Union; Einsatzgruppen begin mass shootings of Jews in occupied territories.',
    side: 'right',
    // The USHMM places the Einsatzgruppen's first mass shootings in the last week of June 1941, days after the invasion.
    sources: [ushmm('Operation Barbarossa', 'timeline-event/holocaust/1939-1941/operation-barbarossa'), ushmm('Einsatzgruppen', 'article/einsatzgruppen')],
  },
  {
    id: '1941-09-29',
    year: 1941,
    date: 'SEPTEMBER 29-30',
    when: 'September 29–30, 1941',
    words: 'Over 33,000 Jews are murdered during the Babi Yar massacre near Kyiv',
    side: 'left',
    // The USHMM gives 33,771 Jews murdered over the two days, from the Einsatzgruppen's own reports.
    sources: [ushmm('Kiev and Babi Yar', 'article/kiev-and-babi-yar')],
  },
  {
    id: '1941-12-08',
    year: 1941,
    date: 'DECEMBER 8',
    when: 'December 8, 1941',
    words: 'Chelmno, the first extermination camp, begins operations',
    side: 'right',
    // REVIEW (Verity): the USHMM spells it Chełmno and calls it "the first stationary facility where the Nazis used poisonous gas for the mass murder of Jews"; it does not use the words "first extermination camp", though the date (December 8, 1941) agrees.
    sources: [ushmm('Chełmno', 'article/chelmno'), ushmm('Killing Operations Begin at Chełmno', 'timeline-event/holocaust/1939-1941/killing-operations-begin-at-chelmno')],
  },
  {
    id: '1942-01-20',
    year: 1942,
    date: 'JANUARY 20, 1942',
    when: 'January 20, 1942',
    words: 'The Wannsee Conference formalizes the “Final Solution,” planning the extermination of Jews.',
    side: 'left',
    // REVIEW (Verity): the USHMM says the men at Wannsee "did not deliberate whether such a plan should be undertaken" but "discussed the implementation of a policy decision that had already been made": coordinating it, more than formalizing it. The words stay as printed. (The poster repeats the year in this date, "JANUARY 20, 1942", as no other date does.)
    sources: [ushmm('Wannsee Conference and the “Final Solution”', 'article/wannsee-conference-and-the-final-solution'), ushmm('Wannsee Conference', 'timeline-event/holocaust/1942-1945/wannsee-conference')],
  },
  {
    id: '1942-03',
    year: 1942,
    date: 'MARCH',
    when: 'March 1942',
    words: 'Mass extermination begins at Belzec, Sobibor, and Treblinka camps',
    side: 'right',
    // REVIEW (Verity): the date differs from the source for two of the three camps. The USHMM: killing at Belzec began in March 1942, Sobibor began operating in May 1942, and Treblinka II opened in July 1942. The poster's "March" is right for Belzec only. The words stay as printed.
    sources: [ushmm('Operation Reinhard (Einsatz Reinhard)', 'article/operation-reinhard-einsatz-reinhard')],
  },
  {
    id: '1943-04-19',
    year: 1943,
    date: 'APRIL 19 - MAY 16',
    when: 'April 19 – May 16, 1943',
    words: 'The Warsaw Ghetto Uprising, where Jews resist deportation to extermination camps, occurs',
    side: 'left',
    // REVIEW (Verity): the USHMM says the uprising began when German troops and police entered the ghetto "to deport its surviving inhabitants", and those captured were sent to Treblinka and to the Poniatowa, Trawniki and Lublin/Majdanek camps: not all to extermination camps. The dates agree. The words stay as printed.
    sources: [ushmm('Warsaw Ghetto Uprising', 'article/warsaw-ghetto-uprising'), ushmm('Warsaw Ghetto Uprising', 'timeline-event/holocaust/1942-1945/warsaw-ghetto-uprising')],
  },
  {
    id: '1944-06-06',
    year: 1944,
    date: 'JUNE 6',
    when: 'June 6, 1944',
    words: 'D-Day: Allied forces invade Normandy, opening a Western front.',
    side: 'right',
    sources: [ushmm('D-Day', 'article/d-day'), ushmm('D-Day', 'timeline-event/holocaust/1942-1945/d-day')],
  },
  {
    id: '1944-07-23',
    year: 1944,
    date: 'JULY 23',
    when: 'July 23, 1944',
    words: 'Soviet forces liberate Majdanek, the first major concentration camp to be freed',
    side: 'left',
    // The USHMM: "The first major Nazi camp to be liberated was Majdanek"; its timeline gives July 23, 1944 (Soviet troops arrived in the night of July 22–23).
    sources: [ushmm('Liberation of Nazi Camps', 'article/liberation-of-nazi-camps'), ushmm('Liberation of Lublin/Majdanek', 'timeline-event/holocaust/1942-1945/liberation-of-lublin-majdanek')],
  },
  {
    id: '1945-01-27',
    year: 1945,
    date: 'JANUARY 27',
    when: 'January 27, 1945',
    // REVIEW (Verity): a typo on the poster: "Auschwitz-Bikenau" is "Auschwitz-Birkenau" (the USHMM's spelling). Set as printed until you decide.
    words: 'Soviet troops liberate Auschwitz-Bikenau',
    side: 'right',
    sources: [ushmm('Auschwitz', 'article/auschwitz'), ushmm('Liberation of Nazi Camps', 'article/liberation-of-nazi-camps')],
  },
  {
    id: '1945-05-08',
    year: 1945,
    date: 'MAY 8',
    when: 'May 8, 1945',
    words: 'Germany surrenders, ending World War II in Europe and the Holocaust',
    side: 'left',
    // REVIEW (Verity): the USHMM: German armed forces "surrendered unconditionally in the west on May 7 and in the east on May 9, 1945", and Victory in Europe (V-E) Day was proclaimed on May 8. The poster's May 8 is V-E Day; the words stay as printed.
    sources: [ushmm('German Forces Surrender to the Allies', 'timeline-event/holocaust/1942-1945/german-forces-surrender-to-the-allies')],
  },
];

/** The years the poster marks, in order, once each. */
export const YEARS: number[] = [...new Set(TIMELINE_ENTRIES.map((e) => e.year))];

/** The first entry of a year: where the year's link goes. */
export const firstOfYear = (year: number) => TIMELINE_ENTRIES.find((e) => e.year === year);

/** The entry a hash names: an entry's own id, or a year (its first entry). */
export function entryFromHash(hash: string): string | null {
  const h = hash.replace(/^#/, '');
  if (TIMELINE_ENTRIES.some((e) => e.id === h)) return h;
  if (/^\d{4}$/.test(h)) return firstOfYear(Number(h))?.id ?? null;
  return null;
}

/** "*…*" runs: italic where the poster sets them in italics. */
export function italicRuns(text: string): { text: string; italic: boolean }[] {
  return text
    .split(/(\*[^*]+\*)/)
    .filter(Boolean)
    .map((part) => (part.length > 2 && part.startsWith('*') && part.endsWith('*') ? { text: part.slice(1, -1), italic: true } : { text: part, italic: false }));
}

/** The words with the italics marks taken out: what is read aloud. */
export const plainWords = (text: string) => text.replace(/\*/g, '');

/* ───────── Put them in order: a quiet exercise, five events at a time ───────── */

/** The address of the exercise. */
export const ORDER_HASH = 'order';

/** How many events the exercise sets out. */
export const ORDER_COUNT = 5;

/**
 * Five entries for the exercise, each from a different year (so no two are
 * close enough to be a matter of days), in their right order. `rand` is
 * Math.random unless a test gives its own.
 */
export function pickEntries(rand: () => number = Math.random, count = ORDER_COUNT): string[] {
  const pool = [...TIMELINE_ENTRIES];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const out: TimelineEntry[] = [];
  for (const e of pool) {
    if (out.length === count) break;
    if (!out.some((o) => o.year === e.year)) out.push(e);
  }
  return sortedIds(out.map((e) => e.id));
}

/** Entry ids in the order the poster gives them. */
export const sortedIds = (ids: readonly string[]) => [...ids].sort((a, b) => TIMELINE_ENTRIES.findIndex((e) => e.id === a) - TIMELINE_ENTRIES.findIndex((e) => e.id === b));

/** The ids in a new order, never already right (or there'd be nothing to do). */
export function shuffled(ids: readonly string[], rand: () => number = Math.random): string[] {
  const out = [...ids];
  for (let tries = 0; tries < 20; tries++) {
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    if (out.some((id, i) => id !== ids[i])) return out;
  }
  return [...ids].reverse();
}

/** The cards with `from` and `to` swapped. */
export function swapped(order: readonly string[], from: number, to: number): string[] {
  const out = [...order];
  [out[from], out[to]] = [out[to], out[from]];
  return out;
}

/** For each card, whether it is in its right place. */
export function placesRight(order: readonly string[]): boolean[] {
  const right = sortedIds(order);
  return order.map((id, i) => right[i] === id);
}

export const entryById = (id: string) => TIMELINE_ENTRIES.find((e) => e.id === id);

/* ───────── The room's own words (not the poster's) ───────── */

// REVIEW (Verity): new UI strings for the timeline room.
export const TIMELINE_TEXT = {
  title: 'The Timeline of the Holocaust',
  source: 'In the words of the poster',
  years: 'Go to a year',
  orderOpen: 'Put them in order',
  orderHeading: 'Put them in order',
  orderHow: 'Five events from the timeline, mixed up. Put them back in order, earliest at the top. Tap one card, then another, to swap them.',
  orderKeys: 'With a card picked up, the up and down arrow keys move it.',
  check: 'Check the order',
  another: 'Five more events',
  allRight: 'All five are in order.',
  notYet: (n: number, of: number) => `${n} of ${of} are in their place. Swap the others and check again.`,
  backToTimeline: 'Back to the timeline',
  earliest: 'Earliest',
  latest: 'Latest',
};
