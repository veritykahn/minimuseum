import CasePage from '@/components/exhibition/CasePage';
import { HOLOCAUST, HOLOCAUST_CASE } from '../../holocaust';
import '../../holocaust.css';

/*
 * Holocaust Memorial Day's display case: the artifacts exactly as the Mini
 * Museum record lists them, and the case itself, with its photographs to come.
 */
export default function HolocaustCase() {
  return <CasePage config={HOLOCAUST} data={HOLOCAUST_CASE} />;
}
