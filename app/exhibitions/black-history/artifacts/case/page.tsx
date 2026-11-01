import CasePage from '@/components/exhibition/CasePage';
import { casePhotosOnDisk } from '@/components/exhibition/casePhotos';
import { BLACK_HISTORY, BLACK_HISTORY_CASE } from '../../blackHistory';
import '../../black-history.css';

/*
 * Black History Month's display case: the artifacts exactly as the Mini Museum
 * record lists them, and the case itself, with its photographs to come.
 */
export default function BlackHistoryCase() {
  return <CasePage config={BLACK_HISTORY} data={BLACK_HISTORY_CASE} photos={casePhotosOnDisk(BLACK_HISTORY, BLACK_HISTORY_CASE)} />;
}
