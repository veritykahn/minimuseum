import PosterExhibition from '@/components/exhibition/PosterExhibition';
import { casesWithPhotos } from '@/components/exhibition/casePhotos';
import { VICTORIAN } from './victorian';
import './victorian.css';

export default function VictorianBritain() {
  return <PosterExhibition config={{ ...VICTORIAN, cases: casesWithPhotos(VICTORIAN) }} />;
}
