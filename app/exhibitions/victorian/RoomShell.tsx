'use client';

import type { CSSProperties, ReactNode } from 'react';
import ExhibitionNav from '@/components/ExhibitionNav';
import '@/components/exhibition/poster-exhibition.css';
import { VICTORIAN } from './victorian';
import './victorian.css';

/*
 * The frame of a Victorian Britain room (the optical toys): the exhibition's
 * faces, "M ← Exhibition" in the corner, and a full-screen stage that sets
 * its own heading, as the Great War's memorial does.
 */

type CssVars = CSSProperties & Record<`--${string}`, string>;

export default function RoomShell({ className, children }: { className: string; children: ReactNode }) {
  const { fonts, palette, slug } = VICTORIAN;
  const style: CssVars = {
    background: palette.page,
    '--pe-display': fonts.display,
    '--pe-body': fonts.body,
    '--pe-ui': fonts.ui ?? fonts.body,
    '--pe-accent': palette.accent,
    '--pe-heading': palette.heading,
  };

  return (
    <div className={`pe-root vb-room ${className}`} data-exhibition={slug} style={style}>
      <style>{`@import url('${fonts.href}');`}</style>

      <ExhibitionNav className="pe-nav pe-nav-left" href={`/exhibitions/${slug}`}>
        <span className="pe-nav-text" aria-hidden="true">M</span>
        <span className="pe-nav-arrow pe-nav-arrow-left" aria-hidden="true">&#8592;</span>
        <span className="pe-nav-label">Exhibition</span>
      </ExhibitionNav>

      <main className="vb-room-stage">{children}</main>
    </div>
  );
}
