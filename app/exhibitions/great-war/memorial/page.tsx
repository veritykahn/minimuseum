'use client';

import RoomShell from '../RoomShell';
import PoppyField from './PoppyField';
import TwoMinuteSilence from './TwoMinuteSilence';
import RememberSoldier from './RememberSoldier';
import { MEMORIAL_TEXT } from './memorialText';
import { SILHOUETTE_PATH, SILHOUETTE_VIEWBOX } from './silhouettePath';
import './memorial.css';
import './remember.css';

/*
 * The memorial: the soldier's silhouette, lit from behind, beside the field
 * of poppies; then remember a soldier (a memorial card for one of the fallen,
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

      <div className="gwm-top">
        <div className="gwm-backlit" aria-hidden="true">
          <span className="gwm-backlit-light" />
          <span className="gwm-backlit-paper" />
          <svg viewBox={SILHOUETTE_VIEWBOX} focusable="false">
            <path d={SILHOUETTE_PATH} fillRule="evenodd" />
          </svg>
        </div>

        <section className="gwm-section" id="gwm-poppies" aria-labelledby="gwm-poppies-h">
          <h2 id="gwm-poppies-h" className="gwm-h2">{t.poppyHeading}</h2>
          <p className="gwm-intro">{t.poppyIntro}</p>
          <PoppyField />
        </section>
      </div>

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
