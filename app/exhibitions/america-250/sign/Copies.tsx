'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import Magnifier from '@/components/games/Magnifier';
import { COPIES, type CopyId } from './signText';

/*
 * A copy of a copy, on the desk: the four copies of the Declaration side by
 * side (the Dunlap and Goddard broadsides, Stone's engraving and the signed
 * parchment as it is today), real photographs from the Library of Congress
 * and the National Archives. Choose one, and it is brought up close under a
 * magnifying lens (mouse, touch or keyboard: components/games/Magnifier).
 * The words about each are on the card beside it (page.tsx).
 */

export default function Copies({
  selected,
  closer,
  onSelect,
}: {
  selected: CopyId;
  closer: boolean;
  onSelect: (id: CopyId, closer?: boolean) => void;
}) {
  const small = useSmallScreen();
  const copy = COPIES.find((c) => c.id === selected)!;

  if (closer) {
    return (
      <div className="aps-copies aps-copies-closer" data-copy={copy.id}>
        <Magnifier
          key={copy.id}
          src={copy.src}
          alt={copy.alt}
          zoom={small ? 2.6 : 2.8}
          lens={small ? 140 : 210}
          maxHeight={2000}
          className="aps-copy-lens"
          style={{ width: `min(100cqw, (100cqh - 2.6rem) * ${copy.ratio.toFixed(4)})`, '--game-accent': '#e8c77d' } as CSSProperties}
        />
        <p className="aps-copy-caption" aria-hidden="true">
          {copy.name}, <span>{copy.date}</span>
        </p>
      </div>
    );
  }

  return (
    <div className="aps-copies aps-copies-all" role="group" aria-label="Four copies of the Declaration, side by side">
      {COPIES.map((c, i) => (
        <button
          key={c.id}
          type="button"
          className="aps-copy"
          aria-pressed={c.id === selected}
          onClick={() => onSelect(c.id)}
          onDoubleClick={() => onSelect(c.id, true)}
        >
          <span className="aps-copy-frame">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.src} alt="" width={1600} height={Math.round(1600 / c.ratio)} draggable={false} />
          </span>
          <span className="aps-copy-label">
            <span className="aps-copy-n" aria-hidden="true">{i + 1}</span>
            <span className="aps-copy-name">{c.name}</span>
            <span className="aps-copy-date">{c.date}</span>
          </span>
        </button>
      ))}
    </div>
  );
}

/** A phone's width: a smaller lens, so it never covers the whole page. */
function useSmallScreen() {
  const [small, setSmall] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia?.('(max-width: 760px)');
    if (!mq) return;
    const read = () => setSmall(mq.matches);
    read();
    mq.addEventListener?.('change', read);
    return () => mq.removeEventListener?.('change', read);
  }, []);
  return small;
}
