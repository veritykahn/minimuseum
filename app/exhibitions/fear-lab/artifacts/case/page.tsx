import CasePage from '@/components/exhibition/CasePage';
import { FEAR_LAB, FEAR_LAB_CASE } from '../../fearLab';
import '../../fear-lab.css';

/*
 * The Fear Lab's display case: the artifacts exactly as the Mini Museum
 * record lists them, the case itself, with its photographs to come, and the
 * lab (what-scares-you), which opens from here.
 */
export default function FearLabCase() {
  return <CasePage config={FEAR_LAB} data={FEAR_LAB_CASE} />;
}
