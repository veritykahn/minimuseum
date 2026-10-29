import type { CasePageData, ExhibitionConfig } from '@/components/exhibition/types';
import { GREAT_WAR, GREAT_WAR_CASE } from '@/app/exhibitions/great-war/greatWar';
import { EGYPT, EGYPT_CASE } from '@/app/exhibitions/egypt/egypt';
import { MOON, MOON_CASE } from '@/app/exhibitions/moon/moon';
import { VICTORIAN, VICTORIAN_CASE } from '@/app/exhibitions/victorian/victorian';
import { WOMENS_HISTORY, WOMENS_HISTORY_CASE } from '@/app/exhibitions/womens-history/womensHistory';
import { HOLOCAUST, HOLOCAUST_CASE } from '@/app/exhibitions/holocaust/holocaust';
import { BLACK_HISTORY, BLACK_HISTORY_CASE } from '@/app/exhibitions/black-history/blackHistory';
import { WRITING_REVOLUTION, WRITING_REVOLUTION_CASE } from '@/app/exhibitions/writing-revolution/writingRevolution';

/**
 * The poster exhibitions whose display case is built by the engine
 * (components/exhibition: CasePage and ArtifactPage), each with its case. The
 * sitemap lists every artifact page from here. An exhibition joins by adding
 * its config and case data, an artifacts/case page and an
 * artifacts/case/[artifact] route.
 */
export const EXHIBITION_CASES: { config: ExhibitionConfig; data: CasePageData }[] = [
  { config: GREAT_WAR, data: GREAT_WAR_CASE },
  { config: EGYPT, data: EGYPT_CASE },
  { config: MOON, data: MOON_CASE },
  { config: VICTORIAN, data: VICTORIAN_CASE },
  { config: WOMENS_HISTORY, data: WOMENS_HISTORY_CASE },
  { config: HOLOCAUST, data: HOLOCAUST_CASE },
  { config: BLACK_HISTORY, data: BLACK_HISTORY_CASE },
  { config: WRITING_REVOLUTION, data: WRITING_REVOLUTION_CASE },
];
