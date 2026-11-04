import CasePage from '@/components/exhibition/CasePage';
import { casePhotosOnDisk } from '@/components/exhibition/casePhotos';
import { GREAT_WAR, GREAT_WAR_CASE } from '../../greatWar';
import '../../great-war.css';

/*
 * The Great War's display case: the artifacts exactly as the Mini Museum
 * record lists them, each opening its own page, and the case itself, with its
 * photographs to come.
 */
export default function GreatWarCase() {
  return <CasePage config={GREAT_WAR} data={GREAT_WAR_CASE} photos={casePhotosOnDisk(GREAT_WAR, GREAT_WAR_CASE)} />;
}
