'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { playEgypt } from './egyptSound';
import { keepInTomb, MY_TOMB_PATH, placeFor, readTomb, type ActivityId } from './tombState';

/*
 * The last step of every Ancient Egypt room: "Put this in your burial tomb".
 * The visitor builds their tomb first (Build Your Own Tomb, first on the
 * Egypt landing); each room they then visit ends by laying what they made
 * there in it (their mummy, their amulet, their name, their heart amulet,
 * the royal name they decoded, a painted wall), and the button takes them
 * back to the tomb to see it in its place. What is kept stays in this
 * browser only (tombState.ts).
 *
 * The moment is made to be seen: a little doorway of the tomb, with the
 * room's thing drawn above it (ThingIcon) and the place it will go named
 * beside it ("A place is waiting for it: the niche"). On the press the
 * thing drops through the doorway, the doorway glows, a soft settling sound
 * plays (with sound on), and "Go to your tomb" takes the focus. Under
 * reduced motion it is simply shown inside. A room done before says
 * "Already in your tomb", and can be put in again, replacing it.
 *
 * Props: `activity` is the room; `what` names the thing plainly, as the
 * tomb will list it ("your mummy in its coffin"). `onPut` runs once it is
 * kept, for a room that also saves what it made (the cartouche, the amulet,
 * the painting). `label` changes the button's words, for a room whose thing
 * is not quite "this" ("Paint this wall in your burial tomb").
 */

export default function PutInTomb({ activity, what, onPut, label = 'Put this in your burial tomb' }: { activity: ActivityId; what: string; onPut?: () => void; label?: string }) {
  const [put, setPut] = useState(false);
  const [before, setBefore] = useState(false);
  const go = useRef<HTMLAnchorElement>(null);
  const place = placeFor(activity);

  // Was something from this room already in the tomb (from an earlier visit)?
  useEffect(() => {
    setBefore(!!readTomb().kept?.[activity]);
  }, [activity]);
  useEffect(() => {
    if (put) go.current?.focus({ preventScroll: true });
  }, [put]);

  return (
    <div className={`egr-put-in-tomb${put ? ' is-put' : ''}`}>
      <div className="egr-put-door" aria-hidden="true">
        <svg viewBox="0 0 120 120">
          {/* the doorway of a rock-cut tomb: a painted lintel, the dark way in */}
          <path d="M14 116 V40 L60 22 L106 40 V116 Z" fill="#c9a66b" stroke="#2b1d12" strokeWidth="3" strokeLinejoin="round" />
          <path d="M34 116 V58 H86 V116 Z" fill="#120c07" stroke="#2b1d12" strokeWidth="3" />
          <path d="M28 52 H92" stroke="#2f5f9e" strokeWidth="5" />
          <path d="M28 46 H92" stroke="#b23a2a" strokeWidth="3" />
          <path className="egr-put-glow" d="M36 114 V60 H84 V114 Z" fill="#ffd27a" />
          <g className="egr-put-thing">
            <ThingIcon activity={activity} x={40} y={2} size={40} />
          </g>
        </svg>
      </div>
      <div className="egr-put-words" aria-live="polite">
        {put ? (
          <>
            <p className="egr-put-title">It is in your tomb!</p>
            <p>
              {cap(what)}, in {place.place}.
            </p>
          </>
        ) : (
          <>
            <p className="egr-put-title">{before ? 'Already in your tomb' : 'Your tomb is waiting'}</p>
            <p>{before ? `Put this one in instead, in ${place.place}.` : `A place is waiting for it: ${place.place}.`}</p>
          </>
        )}
      </div>
      <div className="egr-put-actions">
        {put ? (
          <Link ref={go} className="egr-button egr-button-primary" href={MY_TOMB_PATH}>
            Go to your tomb <span aria-hidden="true">→</span>
          </Link>
        ) : (
          <button
            type="button"
            className="egr-button egr-button-primary"
            onClick={() => {
              keepInTomb(activity, what);
              playEgypt('settle');
              setPut(true);
              onPut?.();
            }}
          >
            {label}
          </button>
        )}
      </div>
    </div>
  );
}

const cap = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : s);

/**
 * Each room's thing, as a small picture: the painting in its frame, the
 * cartouche, the papyrus, the amulet, the coffin, the heart amulet. Drawn in
 * a box `size` across at (x, y), for the doorway here and for the tomb's
 * list of places.
 */
export function ThingIcon({ activity, x = 0, y = 0, size = 48 }: { activity: ActivityId; x?: number; y?: number; size?: number }) {
  const ink = '#2b1d12';
  const line = { stroke: ink, strokeWidth: 2.5, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };
  const art = (() => {
    switch (activity) {
      case 'walls':
        return (
          <g {...line}>
            <rect x="4" y="8" width="40" height="30" fill="#d9a441" />
            <rect x="8" y="12" width="32" height="22" fill="#e8d3a0" />
            <path d="M8 30 Q16 22 22 28 T40 24 V34 H8 Z" fill="#3f7d4c" strokeWidth="1.5" />
            <circle cx="32" cy="18" r="3.5" fill="#b23a2a" strokeWidth="1.5" />
          </g>
        );
      case 'name':
        return (
          <g {...line}>
            <rect x="14" y="2" width="20" height="38" rx="10" fill="#f3e6c4" />
            <path d="M14 44 H34" strokeWidth="4" />
            <circle cx="24" cy="12" r="3" fill={ink} />
            <path d="M19 22 H29 M19 28 Q24 33 29 28" strokeWidth="2" fill="none" />
          </g>
        );
      case 'rosetta':
        return (
          <g {...line}>
            <rect x="8" y="10" width="32" height="28" fill="#efdcae" />
            <ellipse cx="8" cy="24" rx="5" ry="14" fill="#d9bf86" />
            <ellipse cx="40" cy="24" rx="5" ry="14" fill="#d9bf86" />
            <rect x="15" y="18" width="18" height="12" rx="6" fill="none" strokeWidth="1.8" />
          </g>
        );
      case 'amulet':
        return (
          <g {...line}>
            <path d="M24 4 C14 4 10 12 12 18 L36 18 C38 12 34 4 24 4 Z" fill="#3fb3a3" />
            <path d="M11 18 C8 30 14 44 24 44 C34 44 40 30 37 18 Z" fill="#3fb3a3" />
            <path d="M24 18 V44" strokeWidth="1.8" />
            <path d="M12 12 L4 8 M36 12 L44 8 M11 26 L3 28 M37 26 L45 28 M13 36 L6 42 M35 36 L42 42" strokeWidth="2" />
          </g>
        );
      case 'mummification':
        return (
          <g {...line}>
            <path d="M24 2 C33 2 36 9 35 16 C40 22 40 34 36 42 L30 46 H18 L12 42 C8 34 8 22 13 16 C12 9 15 2 24 2 Z" fill="#2f5f9e" />
            <path d="M24 5 C30 5 31 10 30 15 H18 C17 10 18 5 24 5 Z" fill="#e0b13a" />
            <path d="M14 22 H34 M13 29 H35 M14 36 H34" stroke="#d9a441" strokeWidth="2.5" />
          </g>
        );
      case 'weighing':
        return (
          <g {...line}>
            <path d="M12 12 C10 4 18 2 20 8 L28 8 C30 2 38 4 36 12 C40 20 38 34 24 44 C10 34 8 20 12 12 Z" fill="#b23a2a" />
            <path d="M18 8 C18 4 30 4 30 8" fill="none" />
            <path d="M24 14 V30" stroke="#e0b13a" strokeWidth="2" />
          </g>
        );
    }
  })();
  return (
    <svg x={x} y={y} width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      {art}
    </svg>
  );
}
