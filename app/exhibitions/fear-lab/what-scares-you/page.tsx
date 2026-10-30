import { assetsOnDisk } from './assetSlots';
import WhatScaresYouLab from './WhatScaresYouLab';
import './lab.css';

/*
 * What Scares You? (WhatScaresYouLab.tsx is the room itself). On the server, the page
 * only looks to see which of the lab's drop-in slots the owner has filled
 * (assets.ts), so the lab uses each file as soon as it is there and asks for
 * none that is not.
 */
export default function WhatScaresYou() {
  return <WhatScaresYouLab owned={assetsOnDisk()} />;
}
