import CaseListing from '../case-listing';
import { CASE_NOTES } from '../../notes';
import { case6Coins } from '../coin-data';

export default function Case6() {
  return (
    <CaseListing
      caseNumber={6}
      galleryLabel="Gallery II, Case 6"
      title="In Their Hands"
      subtitle="Coins from the World of Jesus"
      coins={case6Coins}
      notes={CASE_NOTES[6]}
      basePath="/exhibitions/in-their-hands/artifacts/case-6"
      interactive={{
        id: 'timeline',
        title: 'The Gospel Timeline',
        subtitle: 'Follow the coins through the New Testament',
        thumb: '/exhibitions/in-their-hands/rooms/timeline.webp',
        route: '/exhibitions/in-their-hands/timeline',
        status: 'available',
      }}
    />
  );
}
