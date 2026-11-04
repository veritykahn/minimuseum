import PosterExhibition from '@/components/exhibition/PosterExhibition';
import { casesWithPhotos } from '@/components/exhibition/casePhotos';
import { posterMomentsOnDisk, posterSoundsOnDisk } from '@/components/exhibition/posterSounds';
import { WOMENS_HISTORY } from './womensHistory';
import './womensHistory.css';

export default function WomensHistory() {
  return <PosterExhibition config={{ ...WOMENS_HISTORY, cases: casesWithPhotos(WOMENS_HISTORY), posterSounds: posterSoundsOnDisk(WOMENS_HISTORY), moments: posterMomentsOnDisk(WOMENS_HISTORY) }} />;
}
