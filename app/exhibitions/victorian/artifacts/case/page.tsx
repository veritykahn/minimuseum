import CasePage from '@/components/exhibition/CasePage';
import { casePhotosOnDisk } from '@/components/exhibition/casePhotos';
import { VICTORIAN, VICTORIAN_CASE } from '../../victorian';
import '../../victorian.css';

/*
 * Victorian Britain's display case: the artifacts exactly as the Mini Museum
 * record lists them, and the case itself, with its photographs to come.
 */
export default function VictorianCase() {
  return <CasePage config={VICTORIAN} data={VICTORIAN_CASE} photos={casePhotosOnDisk(VICTORIAN, VICTORIAN_CASE)} />;
}
