import Link from 'next/link';
import type { CSSProperties } from 'react';
import { roomsInOrder } from './roomsInOrder';
import type { DisplayCase } from './types';
import './explore-row.css';

/*
 * The landing page's "Explore" row: a card for each of the exhibition's
 * interactive rooms (its picture, its name and its one-line hook), below the
 * posters and display cases, so a visitor finds the rooms without opening the
 * case first. The landing page's first screen keeps its look; the row is
 * reached by scrolling, and a small cue at the foot of that screen
 * (ExploreCue) says it is there.
 *
 * It lists the same rooms, in the same order, as the case page's
 * Interactives tab (roomsInOrder over the same list), so the two cannot
 * drift apart. A room marked `start` (Egypt's Tomb Explorer) comes first,
 * with its label. Wider than a phone the row keeps 88px clear of each side,
 * as the posters do, and its foot clears the floating Map button.
 *
 * Used by PosterExhibition and by the three hand-built exhibitions. Its
 * colors come from --pe-explore-ink, --pe-explore-accent and the faces from
 * --pe-display / --pe-body, which a page can set through `style`.
 */

export const EXPLORE_ID = 'explore';

type CssVars = CSSProperties & Record<`--${string}`, string>;

export default function ExploreRow({ rooms, style }: { rooms: readonly DisplayCase[] | undefined; style?: CssVars }) {
  const list = roomsInOrder(rooms);
  if (list.length === 0) return null;
  return (
    <section id={EXPLORE_ID} className="pe-explore" aria-labelledby={`${EXPLORE_ID}-title`} style={style}>
      <p className="pe-explore-kicker">Interactives</p>
      <h2 id={`${EXPLORE_ID}-title`} className="pe-explore-title">
        Explore
      </h2>
      <ul className={`pe-explore-grid ${list.length === 1 ? 'is-single' : ''}`.trim()}>
        {list.map((r) => (
          <li key={r.href}>
            <Link href={r.href} className={`pe-explore-card ${r.start ? 'is-start' : ''}`.trim()}>
              <span className={`pe-explore-art ${r.image ? '' : 'is-emblem'}`.trim()} aria-hidden="true">
                {r.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={r.image.src} alt="" loading="lazy" />
                ) : (
                  <span className="pe-explore-emblem">{r.emblem}</span>
                )}
              </span>
              <span className="pe-explore-words">
                {r.start && <span className="pe-explore-start">{r.start}</span>}
                <span className="pe-explore-name">{r.title}</span>
                {r.subtitle && <span className="pe-explore-hook">{r.subtitle}</span>}
                <span className="pe-explore-go" aria-hidden="true">
                  Enter <span>&#8594;</span>
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * The cue at the foot of the landing page's first screen that there is more
 * below: "Explore ↓", a link to the row. Set inside the .pe-landing screen,
 * out of its flow, so the posters and cases keep their size.
 */
export function ExploreCue({ rooms }: { rooms: readonly DisplayCase[] | undefined }) {
  const count = rooms?.length ?? 0;
  if (count === 0) return null;
  return (
    <a href={`#${EXPLORE_ID}`} className="pe-explore-cue" aria-label={`Explore: ${count} interactive ${count === 1 ? 'room' : 'rooms'} below`}>
      Explore <span className="pe-explore-cue-arrow" aria-hidden="true">&#8595;</span>
    </a>
  );
}
