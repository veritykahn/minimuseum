import type { SourceGroup } from '@/components/exhibition/SourcesDrawer';
import { MEMORIAL_TEXT } from './memorialText';

/*
 * The memorial's source, for its Sources drawer (SourcesDrawer): the cards
 * drawn under "Remember a soldier" are American Battle Monuments Commission
 * records (fallen.ts), from its public archive. The card itself keeps its
 * own line, "From the records of the American Battle Monuments Commission":
 * it is part of the keepsake, printed and saved with it.
 */
export const ABMC_RECORDS = { label: 'American Battle Monuments Commission, “We Remember”', href: 'https://weremember.abmc.gov/' };

export const MEMORIAL_SOURCES: SourceGroup[] = [
  { title: MEMORIAL_TEXT.rememberHeading, items: [{ ...ABMC_RECORDS, note: 'The soldiers’ records' }] },
];
