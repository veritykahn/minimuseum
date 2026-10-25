import PosterExhibition from '@/components/exhibition/PosterExhibition';
import { WOMENS_HISTORY } from './womensHistory';
import './womensHistory.css';

export default function WomensHistory() {
  return <PosterExhibition config={WOMENS_HISTORY} />;
}
