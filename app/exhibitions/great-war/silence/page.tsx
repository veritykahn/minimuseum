'use client';

import RoomShell from '../RoomShell';
import SilenceFilm from './SilenceFilm';
import './silence.css';

export default function GreatWarSilence() {
  return (
    <RoomShell className="gw-silence" label="Interactive" title="When the Guns Fell Silent" subtitle="The last minute of the war, November 11, 1918">
      <SilenceFilm />
    </RoomShell>
  );
}
