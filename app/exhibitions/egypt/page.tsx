import PosterExhibition from '@/components/exhibition/PosterExhibition';
import { casesWithPhotos } from '@/components/exhibition/casePhotos';
import { EGYPT } from './egypt';
import './egypt.css';

export default function AncientEgypt() {
  return <PosterExhibition config={{ ...EGYPT, cases: casesWithPhotos(EGYPT) }} />;
}
