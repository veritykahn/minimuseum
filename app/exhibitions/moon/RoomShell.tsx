'use client';

import type { CSSProperties, ReactNode } from 'react';
import ExhibitionNav from '@/components/ExhibitionNav';
import '@/components/exhibition/poster-exhibition.css';
import { MOON } from './moon';
import './moon.css';

/*
 * The frame of an Our Incredible Moon room (the microscope): the exhibition's
 * faces and night sky, "M ← Exhibition" in the corner, and one full-screen
 * stage that sets its own heading.
 */

type CssVars = CSSProperties & Record<`--${string}`, string>;

export default function RoomShell({ className, children }: { className: string; children: ReactNode }) {
  const { fonts, palette, slug } = MOON;
  const style: CssVars = {
    background: palette.page,
    '--pe-display': fonts.display,
    '--pe-body': fonts.body,
    '--pe-ui': fonts.ui ?? fonts.body,
    '--pe-accent': palette.accent,
    '--pe-heading': palette.heading,
  };

  return (
    <div className={`pe-root mo-room ${className}`} data-exhibition={slug} style={style}>
      <style>{`@import url('${fonts.href}');`}</style>

      <ExhibitionNav className="pe-nav pe-nav-left" href={`/exhibitions/${slug}`}>
        <span className="pe-nav-text" aria-hidden="true">M</span>
        <span className="pe-nav-arrow pe-nav-arrow-left" aria-hidden="true">&#8592;</span>
        <span className="pe-nav-label">Exhibition</span>
      </ExhibitionNav>

      <main className="mo-room-stage">{children}</main>
    </div>
  );
}
