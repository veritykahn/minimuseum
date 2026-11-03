'use client';

import { useEffect } from 'react';
import type { SourceGroup } from '@/components/exhibition/SourcesDrawer';
import HolocaustRoom from '../HolocaustRoom';
import MemorialStone from '../stones/MemorialStone';
import { useStones } from '../stones/useStones';
import Stillness from './Stillness';
import { PROMPTS } from './stillnessPrompts';
import '../stones/memorial-stone.css';
import './stillness.css';

/*
 * A Minute's Stillness, on one screen: the memorial stone in its dark room,
 * with the stones visitors have laid on it (the same stone as Lay a Stone's,
 * ../stones), and beside it the words of Martin Niemöller, from poster 2,
 * and the way to keep a minute's stillness (Stillness.tsx), with names,
 * words and questions shown during it (stillnessPrompts.ts). It was once a
 * tab of Never Forget (#stillness), and an old link to that tab comes here.
 * No sound.
 */

const shorten = (t: string) => (t.length > 60 ? `${t.slice(0, 57).trimEnd()}…` : t);

/** Every prompt's source, for the room's Sources drawer: nothing is cited on the page itself. */
export function stillnessSourceGroups(): SourceGroup[] {
  return [{ title: 'Stillness', items: PROMPTS.flatMap((p) => p.sources.map((s) => ({ ...s, note: p.name ?? p.cite ?? shorten(p.text) }))) }];
}

export default function StillnessRoom() {
  const stones = useStones();

  // Niemöller's words are set in League Gothic, which the browser fetches only when they are first shown; fetch it now, so they never appear first in another face.
  useEffect(() => {
    document.fonts?.load('1em "League Gothic"').catch(() => undefined);
  }, []);

  return (
    <HolocaustRoom groups={stillnessSourceGroups()}>
      <main className="hos-stage" data-tab="stillness">
        <MemorialStone count={stones.count} settleFrom={null} />

        <header className="hos-bar">
          {/* REVIEW (Verity): the room's title, as on its card. */}
          <h1 className="hos-title">A Minute’s Stillness</h1>
        </header>

        <section className="hos-panel hos-panel-stillness" aria-label="A minute’s stillness">
          <Stillness />
        </section>
      </main>
    </HolocaustRoom>
  );
}
