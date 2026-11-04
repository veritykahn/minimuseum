import CasePage from '@/components/exhibition/CasePage';
import { casePhotosOnDisk } from '@/components/exhibition/casePhotos';
import { WOMENS_HISTORY, WOMENS_HISTORY_CASE } from '../../womensHistory';
import '../../womensHistory.css';

/*
 * Women's History Month's display case: the artifacts exactly as the Mini Museum
 * record lists them, and the case itself, with its photographs to come.
 */
export default function WomensHistoryCase() {
  return <CasePage config={WOMENS_HISTORY} data={WOMENS_HISTORY_CASE} photos={casePhotosOnDisk(WOMENS_HISTORY, WOMENS_HISTORY_CASE)} />;
}
