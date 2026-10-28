import CasePage from '@/components/exhibition/CasePage';
import { MOON, MOON_CASE } from '../../moon';
import '../../moon.css';

/*
 * Our Incredible Moon's display case: the artifacts exactly as the Mini Museum
 * record lists them, and the case itself, with its photographs to come.
 */
export default function MoonCase() {
  return <CasePage config={MOON} data={MOON_CASE} />;
}
