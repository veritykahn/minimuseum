import PosterExhibition from '@/components/exhibition/PosterExhibition';
import { casesWithPhotos } from '@/components/exhibition/casePhotos';
import { posterMomentsOnDisk, posterSoundsOnDisk } from '@/components/exhibition/posterSounds';
import { FEAR_LAB } from './fearLab';
import './fear-lab.css';

export default function FearLab() {
  return <PosterExhibition config={{ ...FEAR_LAB, cases: casesWithPhotos(FEAR_LAB), posterSounds: posterSoundsOnDisk(FEAR_LAB), moments: posterMomentsOnDisk(FEAR_LAB) }} />;
}
