import WalkRoom from './WalkRoom';
import { walkSlotsOnDisk } from './walkSlots';

/*
 * The Walk: the room itself is WalkRoom.tsx. This page, on the server, only
 * looks to see which of the film's pictures, its music and the walk's
 * sounds the owner has dropped into public/exhibitions/holocaust/walk/
 * (walkSlots.ts), so the room uses each one as soon as it is there.
 */

export default function WalkPage() {
  const { pictures, sounds, music } = walkSlotsOnDisk();
  return <WalkRoom pictures={pictures} sounds={sounds} music={music} />;
}
