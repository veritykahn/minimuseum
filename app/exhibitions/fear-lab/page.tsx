import PosterExhibition from '@/components/exhibition/PosterExhibition';
import { FEAR_LAB } from './fearLab';
import './fear-lab.css';

export default function FearLab() {
  return <PosterExhibition config={FEAR_LAB} />;
}
