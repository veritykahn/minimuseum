import PosterExhibition from '@/components/exhibition/PosterExhibition';
import { casesWithPhotos } from '@/components/exhibition/casePhotos';
import { posterMomentsOnDisk } from '@/components/exhibition/posterSounds';
import { HOLOCAUST } from './holocaust';
import './holocaust.css';

/* No music under the posters (SILENT_EXHIBITIONS): only three very quiet moments, a candle lit, a distant church clock for Anne Frank, water under the Danish boats. */
export default function Holocaust() {
  return <PosterExhibition config={{ ...HOLOCAUST, cases: casesWithPhotos(HOLOCAUST), moments: posterMomentsOnDisk(HOLOCAUST) }} />;
}
