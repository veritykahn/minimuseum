'use client';

import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import Link from 'next/link';
import ExhibitionNav from '@/components/ExhibitionNav';
import '@/components/exhibition/poster-exhibition.css';
import SourcesDrawer, { type SourceGroup } from '@/components/exhibition/SourcesDrawer';
import { SoundSwitch } from '@/components/games/feedback/FeedbackKit';
import { rememberReturn, useMuseumReturn, type MuseumReturn } from '@/lib/museumReturn';
import { EGYPT } from './egypt';
import { FROM_TOMB, TOMB_PATH } from './tombState';
import './egypt.css';
import './rooms.css';
import './kit.css';

/*
 * The frame of an Ancient Egypt room (the name cartouche, the weighing of
 * the heart, the tomb, mummification, the Rosetta Stone, the amulet maker):
 * the posters' near-black ground, white type and orange-red, the
 * exhibition's faces, "M ← Ancient Egypt" in the corner (back to the
 * exhibition's page; "M ← Studio" when the Studio opened it; "M ← Tomb" when
 * the tomb did), and one stage that sets its own heading. A dark band sits
 * behind the corner links, so nothing scrolls under them unseen. A room
 * that fits one screen (`fit`) sets its stage as a column the height of the
 * window: the heading, then the room, filling what is left. Each room's sources
 * and picture credits are in one Sources drawer (bottom left), grouped by
 * step, so none is cited inline. Each room's own stylesheet draws its scene.
 * Top right, the museum's sound switch: the rooms' chisels, scales, water and
 * torch (egyptSound.ts) are heard once it is on, here or anywhere.
 */

type CssVars = CSSProperties & Record<`--${string}`, string>;

const TOMB_RETURN: MuseumReturn = { href: TOMB_PATH, label: 'Tomb' };
/** The rooms' usual way back: the Ancient Egypt exhibition's own page. */
export const EGYPT_RETURN: MuseumReturn = { href: '/exhibitions/egypt', label: 'Ancient Egypt' };

export default function RoomShell({ className, sources, fit = false, children }: { className: string; sources?: readonly SourceGroup[]; fit?: boolean; children: ReactNode }) {
  const { fonts, palette, slug } = EGYPT;
  const museumBack = useMuseumReturn(EGYPT_RETURN);
  // The tomb's doors carry ?from=tomb; read once, in the browser.
  const [fromTomb, setFromTomb] = useState(false);
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('from') === FROM_TOMB) setFromTomb(true);
  }, []);
  const back = fromTomb ? TOMB_RETURN : museumBack;
  const style: CssVars = {
    background: palette.page,
    '--egr-page': palette.page,
    '--pe-display': fonts.display,
    '--pe-body': fonts.body,
    '--pe-ui': fonts.ui ?? fonts.body,
    '--pe-accent': palette.accent,
    '--pe-heading': palette.heading,
  };

  return (
    <div className={`pe-root eg-room ${className}`} data-exhibition={slug} style={style}>
      <style>{`@import url('${fonts.href}');`}</style>

      <div className="egr-topband" aria-hidden="true" />

      <ExhibitionNav className="pe-nav pe-nav-left" href={back.href} onClick={() => rememberReturn(back)}>
        <span className="pe-nav-text" aria-hidden="true">M</span>
        <span className="pe-nav-arrow pe-nav-arrow-left" aria-hidden="true">&#8592;</span>
        <span className="pe-nav-label">{back.label}</span>
      </ExhibitionNav>

      <div className="egr-sound">
        <SoundSwitch style={{ color: palette.heading, fontFamily: 'var(--pe-ui)' }} />
      </div>

      <SourcesDrawer groups={sources ?? []}>
        <main className={`eg-room-stage ${fit ? 'egr-fit' : ''}`}>{children}</main>
      </SourcesDrawer>
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

/**
 * A room told in steps: "Step 2 of 7" and a dot for each step, done or not.
 * Each dot is a button, so a teacher can jump straight to a step.
 */
export function StepDots({ steps, at, done, onGo, label }: { steps: readonly { id: string; title: string }[]; at: number; done: (i: number) => boolean; onGo: (i: number) => void; label: string }) {
  return (
    <nav className="egr-dots-nav" aria-label={label}>
      <p className="egr-dots-count">
        Step {at + 1} of {steps.length}
      </p>
      <ol className="egr-dots">
        {steps.map((s, i) => (
          <li key={s.id}>
            <button type="button" className="egr-dot" aria-current={i === at ? 'step' : undefined} data-done={(i !== at && done(i)) || undefined} aria-label={`Step ${i + 1}: ${s.title}${done(i) ? ' (done)' : ''}`} onClick={() => onGo(i)}>
              {i !== at && done(i) ? '✓' : i + 1}
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** The way back into the tomb, at the end of a room: what the room made is waiting there. */
export function TombDoor({ children = 'Back into the tomb' }: { children?: ReactNode }) {
  return (
    <Link href={TOMB_PATH} className="egr-button egr-tomb-door">
      <span aria-hidden="true">←</span> {children}
    </Link>
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
