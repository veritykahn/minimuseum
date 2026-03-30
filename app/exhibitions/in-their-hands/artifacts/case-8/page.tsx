import CaseListing from '../case-listing';
import { case8Coins } from '../coin-data';

export default function Case8() {
  return (
    <CaseListing
      caseNumber={8}
      galleryLabel="Gallery II, Case 8"
      title="In Their Hands"
      subtitle="Coins from the Early Church"
      coins={case8Coins}
      basePath="/exhibitions/in-their-hands/artifacts/case-8"
      interactive={{
        id: 'real-or-replica',
        title: 'Real or Replica?',
        subtitle: 'Learn to authenticate ancient coins',
        thumb: '/exhibitions/in-their-hands/real-or-fake.jpg',
        route: '/exhibitions/in-their-hands/real-or-replica',
        status: 'available',
      }}
    />
  );
}
