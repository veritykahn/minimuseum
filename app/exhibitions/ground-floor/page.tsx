import FloorPage from '@/components/FloorPage';
import { floorSoundsOnDisk } from '@/components/exhibition/posterSounds';
import { GROUND_FLOOR } from '@/lib/floors';

export default function GroundFloor() {
  return <FloorPage floor={GROUND_FLOOR} sounds={floorSoundsOnDisk(GROUND_FLOOR.exhibitions.map((e) => e.slug))} />;
}
