import PosterExhibition from '@/components/exhibition/PosterExhibition';
import { casesWithPhotos } from '@/components/exhibition/casePhotos';
import { HOLOCAUST } from './holocaust';
import './holocaust.css';

export default function Holocaust() {
  return <PosterExhibition config={{ ...HOLOCAUST, cases: casesWithPhotos(HOLOCAUST) }} />;
}
