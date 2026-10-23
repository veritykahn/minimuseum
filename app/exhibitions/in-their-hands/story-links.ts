/**
 * Cross-links between the three In Their Hands views of the same coin:
 * the 3D coin viewer, its stop on the Gospel Timeline, and (for seven of
 * the eleven coins) a round of Hands of History. One lesson, "Whose Image
 * Is This?", is built around the Tribute Penny.
 *
 * Kept outside coin-data.ts so the coin copy and the links can change
 * independently.
 */

export const ITH_BASE = '/exhibitions/in-their-hands';
export const HANDS_HREF = `${ITH_BASE}/hands`;
export const LESSONS_HREF = `${ITH_BASE}/lessons`;

export type CoinId =
  | 'augustus' | 'herod-great' | 'aretas'
  | 'widow-mite' | 'tribute-penny' | 'shekel' | 'pilate' | 'antipas'
  | 'agrippa' | 'claudius' | 'festus';

/** Which display case each coin sits in (its viewer lives under case-N/). */
export const COIN_CASE: Record<CoinId, 6 | 7 | 8> = {
  augustus: 6, 'herod-great': 6, aretas: 6,
  'widow-mite': 7, 'tribute-penny': 7, shekel: 7, pilate: 7, antipas: 7,
  agrippa: 8, claudius: 8, festus: 8,
};

/** 1-based Gospel Timeline stop for each coin. */
export const COIN_TIMELINE_STOP: Record<CoinId, number> = {
  augustus: 1, 'herod-great': 2, aretas: 3,
  'widow-mite': 4, 'tribute-penny': 5, shekel: 6, pilate: 7, antipas: 8,
  agrippa: 9, claudius: 10, festus: 11,
};

/**
 * Coins that are a round in Hands of History, keyed to the `coinName` that
 * game uses (checked by a test). The link never names the character, so it
 * does not give the answer away.
 */
export const HANDS_COIN_NAME: Partial<Record<CoinId, string>> = {
  pilate: 'Pontius Pilate Prutah',
  shekel: 'Tyrian Shekel',
  'widow-mite': 'Widow’s Mite — Lepton',
  augustus: 'Augustus AE As',
  'herod-great': 'Herod the Great Prutah',
  festus: 'Porcius Festus Prutah',
  aretas: 'Aretas IV Prutah',
};

/** Lessons built around a coin (slug under /lessons). */
export const COIN_LESSON: Partial<Record<CoinId, { slug: string; title: string }>> = {
  'tribute-penny': { slug: 'whose-image-is-this', title: 'Whose Image Is This?' },
};

export function coinHref(id: CoinId): string {
  return `${ITH_BASE}/artifacts/case-${COIN_CASE[id]}/${id}`;
}

export function timelineHref(stop: number): string {
  return `${ITH_BASE}/timeline?stop=${stop}`;
}

export function lessonHref(slug: string): string {
  return `${LESSONS_HREF}/${slug}`;
}

export type StoryLink = { href: string; label: string; kind: 'timeline' | 'coin' | 'hands' | 'lesson' };

/** Links shown on a coin viewer page: "This coin in the story". */
export function storyLinksForCoin(id: string): StoryLink[] {
  if (!(id in COIN_CASE)) return [];
  const c = id as CoinId;
  const links: StoryLink[] = [
    { kind: 'timeline', href: timelineHref(COIN_TIMELINE_STOP[c]), label: `Gospel Timeline, stop ${COIN_TIMELINE_STOP[c]}` },
  ];
  if (HANDS_COIN_NAME[c]) links.push({ kind: 'hands', href: HANDS_HREF, label: 'Hands of History: whose hands held it?' });
  const lesson = COIN_LESSON[c];
  if (lesson) links.push({ kind: 'lesson', href: lessonHref(lesson.slug), label: `Lesson: ${lesson.title}` });
  return links;
}
