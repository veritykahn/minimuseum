import CaseListing from '../case-listing';
import { case6Coins } from '../coin-data';

export default function Case6() {
  return (
    <CaseListing
      caseNumber={6}
      galleryLabel="Gallery II, Case 6"
      title="In Their Hands"
      subtitle="Coins from the World of Jesus"
      coins={case6Coins}
      basePath="/exhibitions/in-their-hands/artifacts/case-6"
      interactive={{
        id: 'timeline',
        title: 'The Gospel Timeline',
        subtitle: 'Follow the coins through the New Testament',
        emoji: '\u{1F4DC}',
        route: '/exhibitions/in-their-hands/timeline',
        status: 'available',
      }}
    />
  );
}
