import type { ApprovedFact, FactSource } from '@/components/exhibition/FactNote';
import { AUDIT, TOP_50 } from './remembered';

/*
 * "Meet the three women": the three women among the Top 50 (Joan of Arc,
 * Harriet Tubman, Sacagawea), shown once the names are uncovered. Every
 * line is the owner-approved draft (A18/B13/B14 proposal, 1C), set word for
 * word, each woman's lines from one source:
 *   - Joan of Arc: Library of Congress research guide. No canonization year
 *     (the page gives two). "put to death" is the draft's gentler wording.
 *   - Harriet Tubman: National Women's History Museum. No count of rescue
 *     trips (the page gives two).
 *   - Sacagawea: National Women's History Museum. No death year (the page
 *     gives two accounts).
 *
 * And the note beside the four Confederate names in the Top 50 (the
 * owner's decision: show them as the data shows, with context). Its
 * sources: the audit itself (when the monuments went up), a National Park
 * Service history (the Confederacy and slavery), and the Southern Poverty
 * Law Center's "Whose Heritage?" (removals since 2015). Listed for the
 * owner's review.
 */

export const LOC_JOAN: FactSource = {
  label: 'Library of Congress, “Joan of Arc,” French Women & Feminists in History',
  href: 'https://guides.loc.gov/feminism-french-women-history/famous/joan-of-arc',
};
export const NWHM_TUBMAN: FactSource = {
  label: 'National Women’s History Museum, “Harriet Tubman-Davis”',
  href: 'https://www.womenshistory.org/education-resources/biographies/harriet-tubman',
};
export const NWHM_SACAGAWEA: FactSource = {
  label: 'National Women’s History Museum, “Sacagawea”',
  href: 'https://www.womenshistory.org/education-resources/biographies/sacagawea',
};

export type WomanId = 'joan' | 'tubman' | 'sacagawea';

export type RememberedWoman = {
  id: WomanId;
  /** As the Top 50 prints it. */
  name: string;
  /** Her lines, in order, all from `source`. */
  lines: readonly string[];
  source: FactSource;
  /** Her own words, where the source quotes them. */
  words?: { text: string; cite: string };
};

export const THREE_WOMEN: readonly RememberedWoman[] = [
  {
    id: 'joan',
    name: 'Joan of Arc',
    source: LOC_JOAN,
    lines: [
      'When Joan was a child in her village of Domrémy, much of France was under English control.',
      'She said she heard voices from God telling her to save France, and she kept asking until she was allowed to meet the future king.',
      'In 1429 she helped end the English siege of the city of Orléans.',
      'As a leader in battle, she helped make it possible for Charles to be crowned King Charles VII at Reims.',
      'She was captured at Compiègne, tried, and put to death as a heretic in 1431. More than 20 years later, Charles VII held a new trial to clear her name. Today she is honored as the patron saint of France.',
    ],
  },
  {
    id: 'tubman',
    name: 'Harriet Tubman',
    source: NWHM_TUBMAN,
    lines: [
      'She was born Araminta Ross, called “Minty,” into slavery in Dorchester County, Maryland, in March 1822.',
      'She escaped to Philadelphia and became a “conductor” on the Underground Railroad, bringing about 70 enslaved people to freedom.',
      'In the Civil War she was a nurse, then a scout who organized a group of spies.',
      'She helped plan the Combahee River Raid in South Carolina, which freed about 750 enslaved people. She is recognized as the first woman in US history to both plan and lead a military raid.',
      'Later she founded a home for older people in need and supported women’s right to vote.',
    ],
    words: {
      text: 'I had reasoned this out in my mind; there was one of two things I had the right to, liberty or death; if I could not have one, I would have the other.',
      cite: 'Harriet Tubman, 1886',
    },
  },
  {
    id: 'sacagawea',
    name: 'Sacagawea',
    source: NWHM_SACAGAWEA,
    lines: [
      'Sacagawea was a Lemhi Shoshone woman, born around 1788 in what is now Idaho. When she was about 12, she was captured and taken to the Hidatsa villages near today’s Bismarck, North Dakota.',
      'She traveled west with Lewis and Clark’s Corps of Discovery, carrying her baby son, Jean-Baptiste, born February 11, 1805.',
      'She spoke Shoshone and Hidatsa, interpreted for the expedition, and found plants that were safe to eat.',
      'When a boat tipped over in May 1805, she stayed calm and rescued instruments, books, medicines and clothing from the water.',
      'When the expedition met the Shoshone, she found that their chief, Cameahwait, was her brother. William Clark wrote that she “has been of great service to me as a pilot through this country.”',
    ],
  },
];

/** Her place in the Top 50, from the audit's list. */
export function rankOf(name: string) {
  return TOP_50.find((p) => p.name === name)!;
}

/* ───────── The Confederate names, with context ───────── */

export const CONFEDERATE_NAMES = ['Robert E. Lee', 'Stonewall Jackson', 'Jefferson Davis', 'Nathan Bedford Forrest'] as const;

export const NPS_LOST_CAUSE: FactSource = {
  label: 'National Park Service, “Confronting Slavery and Revealing the ‘Lost Cause’” (James Oliver Horton)',
  href: 'https://www.nps.gov/stories/confronting-slavery-and-revealing-the-lost-cause.htm',
};
export const SPLC_WHOSE_HERITAGE: FactSource = {
  label: 'Southern Poverty Law Center, “Whose Heritage?” (third edition, 2022)',
  href: 'https://www.splcenter.org/presscenter/splc-launches-third-edition-its-whose-heritage-report-tracking-confederate-memorials-and',
};

export const FACT_CONFEDERATE: ApprovedFact = {
  text:
    'Four of these names are leaders of the Confederacy: its president, Jefferson Davis, and its generals Robert E. Lee, Stonewall Jackson and Nathan Bedford Forrest. ' +
    'The Confederacy was made up of Southern states that broke away from the United States and fought against it in the Civil War. A National Park Service history says that “slavery was central to the motivation for secession and war.” ' +
    'Most Confederate monuments went up long after the war: the biggest surges came between 1900 and 1920, with the rise of Jim Crow laws, and again during the civil rights era. ' +
    'Many communities have since asked whether these monuments still belong in public places. Since 2015, 377 Confederate symbols have been removed, renamed or relocated. Others still stand, and people still disagree about them.',
  sources: [AUDIT, NPS_LOST_CAUSE, SPLC_WHOSE_HERITAGE],
};
