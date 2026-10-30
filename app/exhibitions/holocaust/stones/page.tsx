import NeverForget from './NeverForget';
import { walkSlotsOnDisk } from './walkSlots';

/*
 * Never Forget: the room itself is NeverForget.tsx. This page, on the
 * server, only looks to see which of the walk's pictures and sounds the
 * owner has dropped into public/exhibitions/holocaust/walk/ (walkSlots.ts),
 * so the walk uses each one as soon as it is there.
 */

export default function NeverForgetPage() {
  const { pictures, ambients } = walkSlotsOnDisk();
  return <NeverForget pictures={pictures} ambients={ambients} />;
}
