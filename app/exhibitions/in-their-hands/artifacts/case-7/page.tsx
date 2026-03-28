import CaseListing from '../case-listing';
import { case7Coins } from '../coin-data';

export default function Case7() {
  return (
    <CaseListing
      caseNumber={7}
      galleryLabel="Gallery II, Case 7"
      title="In Their Hands"
      subtitle="Coins from Jesus' Ministry and Passion"
      coins={case7Coins}
      basePath="/exhibitions/in-their-hands/artifacts/case-7"
    />
  );
}
