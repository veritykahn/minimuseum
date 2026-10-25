import CasePage from '@/components/exhibition/CasePage';
import { WOMENS_HISTORY, WOMENS_HISTORY_CASE } from '../../womensHistory';
import '../../womensHistory.css';

/*
 * Women's History Month's display case: photographs of the installation, and
 * the artifacts exactly as the Mini Museum record lists them.
 */
export default function WomensHistoryCase() {
  return <CasePage config={WOMENS_HISTORY} data={WOMENS_HISTORY_CASE} />;
}
