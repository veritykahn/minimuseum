import PosterExhibition from '@/components/exhibition/PosterExhibition';
import { casesWithPhotos } from '@/components/exhibition/casePhotos';
import { MOON } from './moon';
import './moon.css';

export default function OurIncredibleMoon() {
  return <PosterExhibition config={{ ...MOON, cases: casesWithPhotos(MOON) }} />;
}
