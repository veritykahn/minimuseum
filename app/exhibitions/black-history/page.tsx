import PosterExhibition from '@/components/exhibition/PosterExhibition';
import { casesWithPhotos } from '@/components/exhibition/casePhotos';
import { posterMomentsOnDisk, posterSoundsOnDisk } from '@/components/exhibition/posterSounds';
import { BLACK_HISTORY } from './blackHistory';
import './black-history.css';

export default function BlackHistory() {
  return <PosterExhibition config={{ ...BLACK_HISTORY, cases: casesWithPhotos(BLACK_HISTORY), posterSounds: posterSoundsOnDisk(BLACK_HISTORY), moments: posterMomentsOnDisk(BLACK_HISTORY) }} />;
}
