'use client';

import type { CSSProperties, ReactNode } from 'react';
import Link from 'next/link';
import ExhibitionNav from '@/components/ExhibitionNav';
import '@/components/exhibition/poster-exhibition.css';
import { GREAT_WAR } from './greatWar';
import './great-war.css';

/*
 * The frame of a Great War room (the silence, the memorial): the
 * exhibition's faces and ground, "M ← Exhibition" in the corner, and the
 * room's label, title and subtitle set as the display case page sets them.
 */

type CssVars = CSSProperties & Record<`--${string}`, string>;

export default function RoomShell({
  className,
  label,
  title,
  subtitle,
  bare = false,
  children,
}: {
  className: string;
  label: string;
  title: string;
  subtitle?: string;
  /** A full-screen room that sets its own heading and has no return link at its foot. */
  bare?: boolean;
  children: ReactNode;
}) {
  const { fonts, palette, slug } = GREAT_WAR;
  const style: CssVars = {
    background: palette.page,
    '--pe-display': fonts.display,
    '--pe-body': fonts.body,
    '--pe-ui': fonts.ui ?? fonts.body,
    '--pe-accent': palette.accent,
    '--pe-heading': palette.heading,
  };

  return (
    <div className={`pe-root gw-case gw-room ${className}`} data-exhibition={slug} style={style}>
      <style>{`@import url('${fonts.href}');`}</style>

      <ExhibitionNav className="pe-nav pe-nav-left" href={`/exhibitions/${slug}`}>
        <span className="pe-nav-text" aria-hidden="true">M</span>
        <span className="pe-nav-arrow pe-nav-arrow-left" aria-hidden="true">&#8592;</span>
        <span className="pe-nav-label">Exhibition</span>
      </ExhibitionNav>

      {bare ? (
        <main className="gw-room-stage">{children}</main>
      ) : (
        <main className="gw-room-main">
          <header className="gw-case-header">
            <p className="gw-case-label">{label}</p>
            <h1 className="gw-case-title">{title}</h1>
            {subtitle && <p className="gw-case-subtitle">{subtitle}</p>}
          </header>

          {children}

          <Link href={`/exhibitions/${slug}`} className="gw-case-return">
            Return to Exhibition
          </Link>
        </main>
      )}
    </div>
  );
}
