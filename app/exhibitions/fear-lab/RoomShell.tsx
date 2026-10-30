'use client';

import type { CSSProperties, ReactNode } from 'react';
import ExhibitionNav from '@/components/ExhibitionNav';
import '@/components/exhibition/poster-exhibition.css';
import { roomReturn } from '@/components/exhibition/helpers';
import { rememberReturn, useMuseumReturn } from '@/lib/museumReturn';
import { FEAR_LAB } from './fearLab';
import './fear-lab.css';

/*
 * The frame of a Fear Lab room (what-scares-you): the exhibition's faces and
 * navy ground, "M ← Display Case" in the corner, and one full-screen stage
 * that sets its own heading.
 */

type CssVars = CSSProperties & Record<`--${string}`, string>;

export default function RoomShell({ className, children }: { className: string; children: ReactNode }) {
  const { fonts, palette, slug } = FEAR_LAB;
  const back = useMuseumReturn(roomReturn(FEAR_LAB));
  const style: CssVars = {
    background: palette.page,
    '--pe-display': fonts.display,
    '--pe-body': fonts.body,
    '--pe-ui': fonts.ui ?? fonts.body,
    '--pe-accent': palette.accent,
    '--pe-heading': palette.heading,
  };

  return (
    <div className={`pe-root fl-room ${className}`} data-exhibition={slug} style={style}>
      <style>{`@import url('${fonts.href}');`}</style>

      <ExhibitionNav className="pe-nav pe-nav-left" href={back.href} onClick={() => rememberReturn(back)}>
        <span className="pe-nav-text" aria-hidden="true">M</span>
        <span className="pe-nav-arrow pe-nav-arrow-left" aria-hidden="true">&#8592;</span>
        <span className="pe-nav-label">{back.label}</span>
      </ExhibitionNav>

      <main className="fl-room-stage">{children}</main>
    </div>
  );
}
