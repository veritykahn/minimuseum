import Link from 'next/link';
import SourcesDrawer from '@/components/exhibition/SourcesDrawer';
import RoomShell from '../RoomShell';
import SilenceFilm from './SilenceFilm';
import { soundSlotsOnDisk } from './soundSlots';
import { SILENCE_SOURCES } from './sources';
import './silence.css';

/*
 * When the Guns Fell Silent, on one screen as the Memorial is: the room's
 * label, title and subtitle above, the film filling what is left, and at
 * its foot the film's controls, the transcript and the way back. On the
 * server, the page only looks to see which of the film's sound slots the
 * owner has filled (sounds.ts), so the film uses each file as soon as it is
 * there and asks for none that is not. The film's picture credits and
 * sources are in the room's Sources drawer (sources.ts), not on the screen.
 */
export default function GreatWarSilence() {
  const owned = soundSlotsOnDisk();
  return (
    <RoomShell className="gw-silence" label="Interactive" title="When the Guns Fell Silent" bare>
      <SourcesDrawer groups={SILENCE_SOURCES}>
      <div className="gws-stage">
        <header className="gw-case-header gws-head">
          <p className="gw-case-label">Interactive</p>
          <h1 className="gw-case-title">When the Guns Fell Silent</h1>
          <p className="gw-case-subtitle">The last minute of the war, November 11, 1918</p>
        </header>
        <SilenceFilm owned={owned} returnLink={<Link href="/exhibitions/great-war" className="gws-return">Return to Exhibition</Link>} />
      </div>
      </SourcesDrawer>
    </RoomShell>
  );
}
