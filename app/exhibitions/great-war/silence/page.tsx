'use client';

import Link from 'next/link';
import RoomShell from '../RoomShell';
import SilenceFilm from './SilenceFilm';
import './silence.css';

/*
 * When the Guns Fell Silent, on one screen as the Memorial is: the room's
 * label, title and subtitle above, the film filling what is left, and at
 * its foot the film's controls, the transcript and the way back.
 */
export default function GreatWarSilence() {
  return (
    <RoomShell className="gw-silence" label="Interactive" title="When the Guns Fell Silent" bare>
      <div className="gws-stage">
        <header className="gw-case-header gws-head">
          <p className="gw-case-label">Interactive</p>
          <h1 className="gw-case-title">When the Guns Fell Silent</h1>
          <p className="gw-case-subtitle">The last minute of the war, November 11, 1918</p>
        </header>
        <SilenceFilm returnLink={<Link href="/exhibitions/great-war" className="gws-return">Return to Exhibition</Link>} />
      </div>
    </RoomShell>
  );
}
