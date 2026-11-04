import CasePage from '@/components/exhibition/CasePage';
import { casePhotosOnDisk } from '@/components/exhibition/casePhotos';
import { EGYPT, EGYPT_CASE } from '../../egypt';
import '../../egypt.css';

/*
 * Ancient Egypt's display case: the artifacts exactly as the Mini Museum
 * record lists them, and the case itself, with its photographs to come.
 */
export default function EgyptCase() {
  return <CasePage config={EGYPT} data={EGYPT_CASE} photos={casePhotosOnDisk(EGYPT, EGYPT_CASE)} />;
}
