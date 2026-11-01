import PosterExhibition from '@/components/exhibition/PosterExhibition';
import { casesWithPhotos } from '@/components/exhibition/casePhotos';
import { WRITING_REVOLUTION } from './writingRevolution';
import './writing-revolution.css';

export default function WritingRevolution() {
  return <PosterExhibition config={{ ...WRITING_REVOLUTION, cases: casesWithPhotos(WRITING_REVOLUTION) }} />;
}
