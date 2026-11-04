import CaseListing from '../case-listing';
import { caseRoom } from '../../rooms';
import { CASE_NOTES } from '../../notes';
import { case8Coins } from '../coin-data';

export default function Case8() {
  return (
    <CaseListing
      caseNumber={8}
      galleryLabel="Gallery II, Case 8"
      title="In Their Hands"
      subtitle="Coins from the Early Church"
      coins={case8Coins}
      notes={CASE_NOTES[8]}
      basePath="/exhibitions/in-their-hands/artifacts/case-8"
      interactive={caseRoom(8)}
    />
  );
}
