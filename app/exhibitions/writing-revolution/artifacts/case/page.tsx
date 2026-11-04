import CasePage from '@/components/exhibition/CasePage';
import { casePhotosOnDisk } from '@/components/exhibition/casePhotos';
import { WRITING_REVOLUTION, WRITING_REVOLUTION_CASE } from '../../writingRevolution';
import '../../writing-revolution.css';

/*
 * The Writing Revolution's display case: the artifacts exactly as the Mini Museum
 * record lists them, and the case itself, with its photographs to come.
 */
export default function WritingRevolutionCase() {
  return <CasePage config={WRITING_REVOLUTION} data={WRITING_REVOLUTION_CASE} photos={casePhotosOnDisk(WRITING_REVOLUTION, WRITING_REVOLUTION_CASE)} />;
}
