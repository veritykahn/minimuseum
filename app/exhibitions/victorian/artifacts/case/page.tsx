import CasePage from '@/components/exhibition/CasePage';
import { VICTORIAN, VICTORIAN_CASE } from '../../victorian';
import '../../victorian.css';

/*
 * Victorian Britain's display case: photographs of the installation, and the
 * artifacts exactly as the Mini Museum record lists them.
 */
export default function VictorianCase() {
  return <CasePage config={VICTORIAN} data={VICTORIAN_CASE} />;
}
