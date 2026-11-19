'use client';

import { useState } from 'react';
import Link from 'next/link';
import { keepInTomb, MY_TOMB_PATH, type ActivityId } from './tombState';

/*
 * The last step of every Ancient Egypt room: "Put this in your burial tomb".
 * The visitor builds their tomb first (Build Your Own Tomb); each room they
 * then visit ends by laying what they made there in it (their mummy, their
 * amulet, their name, their heart weighed true...), and the button takes
 * them back to the tomb to see it in place. What is kept stays in this
 * browser only (tombState.ts).
 *
 * Props: `activity` is the room; `what` names the thing plainly, as the
 * tomb will list it ("your mummy in its coffin"). `onPut` runs once it is
 * kept, for a room that wants to show it going in.
 */
export default function PutInTomb({ activity, what, onPut }: { activity: ActivityId; what: string; onPut?: () => void }) {
  const [put, setPut] = useState(false);
  if (put) {
    return (
      <div className="egr-put-in-tomb" role="status">
        <p>It is in your tomb: {what}.</p>
        <Link className="egr-button egr-button-primary" href={MY_TOMB_PATH}>
          Go to your tomb
        </Link>
      </div>
    );
  }
  return (
    <div className="egr-put-in-tomb">
      <button
        type="button"
        className="egr-button egr-button-primary"
        onClick={() => {
          keepInTomb(activity, what);
          setPut(true);
          onPut?.();
        }}
      >
        Put this in your burial tomb
      </button>
    </div>
  );
}
