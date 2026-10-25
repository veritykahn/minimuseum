'use client';

import RoomShell from '../RoomShell';
import SoldierCard from './SoldierCard';
import PoppyField from './PoppyField';
import TwoMinuteSilence from './TwoMinuteSilence';
import RememberSoldier from './RememberSoldier';
import { MEMORIAL_TEXT, SOLDIERS } from './soldiers';
import './memorial.css';
import './remember.css';

/*
 * The memorial: remember a soldier (a memorial card for one of the fallen,
 * to keep or print), the soldier cards, the field of poppies, and the silence
 * at 11:00, in that order on one page.
 */

export default function GreatWarMemorial() {
  const t = MEMORIAL_TEXT;
  return (
    <RoomShell className="gw-memorial" label="Interactive" title={t.title} subtitle="11.11.1918 · 11:00">
      <nav className="gwm-contents" aria-label="On this page">
        <a href="#gwm-remember">{t.rememberHeading}</a>
        <a href="#gwm-cards">{t.cardsHeading}</a>
        <a href="#gwm-poppies">{t.poppyHeading}</a>
        <a href="#gwm-silence">{t.silenceHeading}</a>
      </nav>

      <section className="gwm-section" id="gwm-remember" aria-labelledby="gwm-remember-h">
        <h2 id="gwm-remember-h" className="gwm-h2">{t.rememberHeading}</h2>
        <p className="gwm-intro">{t.rememberIntro}</p>
        <RememberSoldier />
      </section>

      <section className="gwm-section" id="gwm-cards" aria-labelledby="gwm-cards-h">
        <div className="gwm-backlit" aria-hidden="true">
          <div className="gwm-backlit-frame">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/exhibitions/great-war/silhouette.jpg" alt="" />
          </div>
        </div>
        <h2 id="gwm-cards-h" className="gwm-h2">{t.cardsHeading}</h2>
        <p className="gwm-intro">{t.intro}</p>
        <div className="gwm-cards">
          {SOLDIERS.map((s) => (
            <SoldierCard key={s.id} soldier={s} />
          ))}
        </div>
      </section>

      <section className="gwm-section" id="gwm-poppies" aria-labelledby="gwm-poppies-h">
        <h2 id="gwm-poppies-h" className="gwm-h2">{t.poppyHeading}</h2>
        <p className="gwm-intro">{t.poppyIntro}</p>
        <PoppyField />
      </section>

      <section className="gwm-section" id="gwm-silence" aria-labelledby="gwm-silence-h">
        <h2 id="gwm-silence-h" className="gwm-h2">{t.silenceHeading}</h2>
        <TwoMinuteSilence />
      </section>
    </RoomShell>
  );
}
