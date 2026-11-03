'use client';

import type { CSSProperties, ReactNode } from 'react';
import ExhibitionNav from '@/components/ExhibitionNav';
import '@/components/exhibition/poster-exhibition.css';
import { roomReturn } from '@/components/exhibition/helpers';
import SourcesDrawer, { type SourceGroup } from '@/components/exhibition/SourcesDrawer';
import { rememberReturn, useMuseumReturn } from '@/lib/museumReturn';
import { HOLOCAUST } from './holocaust';
import './room.css';

/*
 * What the Holocaust exhibition's rooms share: each of them (The Walk, Lay a
 * Stone, A Minute's Stillness) is its own page, with its own card on the
 * landing page, and each is set in this same dark room: the exhibition's
 * faces, the way back to the exhibition (or to wherever the visitor came
 * from) at the top left, and the room's own Sources drawer, the round "i",
 * holding every source the room uses, so nothing is cited on the page
 * itself. `fontHref` loads a face only that room uses (the walk's film sets
 * its words in a typewriter face).
 */

type CssVars = CSSProperties & Record<`--${string}`, string>;

export default function HolocaustRoom({ groups, fontHref, children }: { groups: readonly SourceGroup[]; fontHref?: string; children: ReactNode }) {
  const { fonts, slug } = HOLOCAUST;
  const back = useMuseumReturn(roomReturn(HOLOCAUST));
  const style: CssVars = {
    background: '#0e0d0c',
    '--pe-display': fonts.display,
    '--pe-body': fonts.body,
    '--pe-ui': fonts.ui ?? fonts.body,
  };
  return (
    <SourcesDrawer groups={groups}>
      <div className="pe-root ho-room" data-exhibition={slug} style={style}>
        <style>{`@import url('${fonts.href}');${fontHref ? `@import url('${fontHref}');` : ''}`}</style>

        <ExhibitionNav className="pe-nav pe-nav-left" href={back.href} onClick={() => rememberReturn(back)}>
          <span className="pe-nav-text" aria-hidden="true">M</span>
          <span className="pe-nav-arrow pe-nav-arrow-left" aria-hidden="true">&#8592;</span>
          <span className="pe-nav-label">{back.label}</span>
        </ExhibitionNav>

        {children}
      </div>
    </SourcesDrawer>
  );
}
