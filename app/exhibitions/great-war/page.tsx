import PosterExhibition from '@/components/exhibition/PosterExhibition';
import { casesWithPhotos } from '@/components/exhibition/casePhotos';
import { posterSoundsOnDisk } from '@/components/exhibition/posterSounds';
import { GREAT_WAR } from './greatWar';
import './great-war.css';

export default function GreatWar() {
  return <PosterExhibition config={{ ...GREAT_WAR, cases: casesWithPhotos(GREAT_WAR), posterSounds: posterSoundsOnDisk(GREAT_WAR) }} />;
}
