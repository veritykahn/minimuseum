import PosterExhibition from '@/components/exhibition/PosterExhibition';
import { casesWithPhotos } from '@/components/exhibition/casePhotos';
import { AMERICA_250 } from './america250';
import './america250.css';

export default function America250() {
  return <PosterExhibition config={{ ...AMERICA_250, cases: casesWithPhotos(AMERICA_250) }} />;
}
