'use client';

import RoomShell from '../RoomShell';
import PoppyField from './PoppyField';
import TwoMinuteSilence from './TwoMinuteSilence';
import RememberSoldier from './RememberSoldier';
import { MEMORIAL_TEXT } from './memorialText';
import './memorial.css';
import './remember.css';

/*
 * The memorial: the soldier on the rise, lit from behind, above the field of
 * poppies visitors have placed; then remember a soldier (a memorial card for one of the fallen,
 * to keep or print); then the silence at 11:00.
 */

export default function GreatWarMemorial() {
  const t = MEMORIAL_TEXT;
  return (
    <RoomShell className="gw-memorial" label="Interactive" title={t.title} subtitle="11.11.1918 · 11:00">
      <nav className="gwm-contents" aria-label="On this page">
        <a href="#gwm-poppies">{t.poppyHeading}</a>
        <a href="#gwm-remember">{t.rememberHeading}</a>
        <a href="#gwm-silence">{t.silenceHeading}</a>
      </nav>

      <section className="gwm-section gwm-section-scene" id="gwm-poppies" aria-labelledby="gwm-poppies-h">
        <PoppyField headingId="gwm-poppies-h" heading={t.poppyHeading} intro={t.poppyIntro} />
      </section>

      <section className="gwm-section" id="gwm-remember" aria-labelledby="gwm-remember-h">
        <h2 id="gwm-remember-h" className="gwm-h2">{t.rememberHeading}</h2>
        <p className="gwm-intro">{t.rememberIntro}</p>
        <RememberSoldier />
      </section>

      <section className="gwm-section" id="gwm-silence" aria-labelledby="gwm-silence-h">
        <h2 id="gwm-silence-h" className="gwm-h2">{t.silenceHeading}</h2>
        <TwoMinuteSilence />
      </section>
    </RoomShell>
  );
}
