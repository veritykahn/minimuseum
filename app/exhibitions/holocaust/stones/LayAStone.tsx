'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { SourceGroup } from '@/components/exhibition/SourcesDrawer';
import HolocaustRoom from '../HolocaustRoom';
import { STONE_CUSTOM } from '../holocaust';
import { oldTabRoom } from '../roomPaths';
import MemorialStone, { StoneControls } from './MemorialStone';
import Countdown from './Countdown';
import { useStones } from './useStones';
import './memorial-stone.css';

/*
 * Lay a Stone, on one screen: a memorial stone in a dark room, with the
 * stones visitors have laid along its ledge, and beside it the way to lay
 * one (MemorialStone.tsx, useStones.ts). Under the title, the days to
 * International Holocaust Remembrance Day (Countdown.tsx). Quiet
 * throughout: nothing celebrates, and nothing is heard.
 *
 * It was once Never Forget, one room with three tabs; the minute's
 * stillness and the walk are their own rooms now (../stillness, ../walk),
 * and an old link to either tab (#stillness, #walk) is sent on to it here
 * (../roomPaths.ts). The walk closes by inviting the visitor here.
 */

/** Every source in the room, for its Sources drawer: nothing is cited on the page itself. */
export function stoneSourceGroups(): SourceGroup[] {
  return [{ title: 'Lay a stone', items: STONE_CUSTOM.sources.map((s) => ({ ...s, note: 'Stones on a memorial' })) }];
}

export default function LayAStone() {
  const router = useRouter();
  const stones = useStones();
  const [settleFrom, setSettleFrom] = useState<number | null>(null);

  // An old address for one of Never Forget's tabs goes on to the room it became.
  useEffect(() => {
    const to = oldTabRoom(window.location.hash);
    if (to) router.replace(to);
  }, [router]);

  return (
    <HolocaustRoom groups={stoneSourceGroups()}>
      <main className="hos-stage" data-tab="stone">
        <MemorialStone count={stones.count} settleFrom={settleFrom} />

        <header className="hos-bar">
          <h1 className="hos-title">
            Lay a Stone
            <span className="hos-title-date">January 27</span>
          </h1>
          <Countdown />
        </header>

        <section className="hos-panel" id="hos-panel-stone" aria-label="Lay a stone">
          <StoneControls {...stones} onLaid={() => setSettleFrom(performance.now())} />
        </section>
      </main>
    </HolocaustRoom>
  );
}
