import CasePage from '@/components/exhibition/CasePage';
import { AMERICA_250, AMERICA_250_CASE } from '../../america250';
import '../../america250.css';

/*
 * America 250's display case: the artifacts exactly as the Mini Museum
 * record lists them, the case itself, with its photographs to come, and the
 * signing room, which opens from here.
 */
export default function America250Case() {
  return <CasePage config={AMERICA_250} data={AMERICA_250_CASE} />;
}
