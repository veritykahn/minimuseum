'use client';

import type { CSSProperties, ReactNode } from 'react';
import ExhibitionNav from '@/components/ExhibitionNav';
import '@/components/exhibition/poster-exhibition.css';
import { roomReturn } from '@/components/exhibition/helpers';
import { rememberReturn, useMuseumReturn } from '@/lib/museumReturn';
import { EGYPT } from './egypt';
import './egypt.css';
import './rooms.css';

/*
 * The frame of an Ancient Egypt room (the name cartouche, the weighing of
 * the heart, the tomb, mummification, the Rosetta Stone, the amulet maker):
 * the posters' near-black ground, white type and orange-red, the
 * exhibition's faces, "M ← Display Case" in the corner (back to the case's
 * Interactives; "M ← Studio" when the Studio opened it), and one stage that
 * sets its own heading. Each room's own stylesheet draws its scene.
 */

type CssVars = CSSProperties & Record<`--${string}`, string>;

export default function RoomShell({ className, children }: { className: string; children: ReactNode }) {
  const { fonts, palette, slug } = EGYPT;
  const back = useMuseumReturn(roomReturn(EGYPT));
  const style: CssVars = {
    background: palette.page,
    '--pe-display': fonts.display,
    '--pe-body': fonts.body,
    '--pe-ui': fonts.ui ?? fonts.body,
    '--pe-accent': palette.accent,
    '--pe-heading': palette.heading,
  };

  return (
    <div className={`pe-root eg-room ${className}`} data-exhibition={slug} style={style}>
      <style>{`@import url('${fonts.href}');`}</style>

      <ExhibitionNav className="pe-nav pe-nav-left" href={back.href} onClick={() => rememberReturn(back)}>
        <span className="pe-nav-text" aria-hidden="true">M</span>
        <span className="pe-nav-arrow pe-nav-arrow-left" aria-hidden="true">&#8592;</span>
        <span className="pe-nav-label">{back.label}</span>
      </ExhibitionNav>

      <main className="eg-room-stage">{children}</main>
    </div>
  );
}

/** A room's heading and its one-line purpose, set the same way in every room. */
export function RoomHeader({ title, kicker, children }: { title: string; kicker: string; children?: ReactNode }) {
  return (
    <header className="egr-head">
      <p className="egr-kicker">{kicker}</p>
      <h1 className="egr-title">{title}</h1>
      {children}
    </header>
  );
}

/** Hieroglyphs as text, set in the rooms' hieroglyph face. Decorative unless given a label. */
export function Glyphs({ text, label, className = '' }: { text: string; label?: string; className?: string }) {
  return label ? (
    <span className={`egr-glyph ${className}`} role="img" aria-label={label}>
      {text}
    </span>
  ) : (
    <span className={`egr-glyph ${className}`} aria-hidden="true">
      {text}
    </span>
  );
}
