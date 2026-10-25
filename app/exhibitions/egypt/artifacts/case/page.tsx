import CasePage from '@/components/exhibition/CasePage';
import { EGYPT, EGYPT_CASE } from '../../egypt';
import '../../egypt.css';

/*
 * Ancient Egypt's display case: photographs of the installation, and the
 * artifacts exactly as the Mini Museum record lists them.
 */
export default function EgyptCase() {
  return <CasePage config={EGYPT} data={EGYPT_CASE} />;
}
