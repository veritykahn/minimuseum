import FloorPage from '@/components/FloorPage';
import { floorSoundsOnDisk } from '@/components/exhibition/posterSounds';
import { FIRST_FLOOR } from '@/lib/floors';

export default function FirstFloor() {
  return <FloorPage floor={FIRST_FLOOR} sounds={floorSoundsOnDisk(FIRST_FLOOR.exhibitions.map((e) => e.slug))} />;
}
