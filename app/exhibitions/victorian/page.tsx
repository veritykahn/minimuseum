import PosterExhibition from '@/components/exhibition/PosterExhibition';
import { casesWithPhotos } from '@/components/exhibition/casePhotos';
import { posterMomentsOnDisk, posterSoundsOnDisk } from '@/components/exhibition/posterSounds';
import { VICTORIAN } from './victorian';
import './victorian.css';

export default function VictorianBritain() {
  return <PosterExhibition config={{ ...VICTORIAN, cases: casesWithPhotos(VICTORIAN), posterSounds: posterSoundsOnDisk(VICTORIAN), moments: posterMomentsOnDisk(VICTORIAN) }} />;
}
