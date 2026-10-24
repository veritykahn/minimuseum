import PosterExhibition from '@/components/exhibition/PosterExhibition';
import { GREAT_WAR } from './greatWar';
import './great-war.css';

export default function GreatWar() {
  return <PosterExhibition config={GREAT_WAR} />;
}
