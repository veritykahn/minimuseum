import FloorPage from '@/components/FloorPage';
import { floorSoundsOnDisk } from '@/components/exhibition/posterSounds';
import { SECOND_FLOOR } from '@/lib/floors';

export default function SecondFloor() {
  return <FloorPage floor={SECOND_FLOOR} sounds={floorSoundsOnDisk(SECOND_FLOOR.exhibitions.map((e) => e.slug))} />;
}
