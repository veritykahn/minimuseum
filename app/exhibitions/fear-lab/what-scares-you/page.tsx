'use client';

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { usePrefersReducedMotion } from '@/lib/a11y/usePrefersReducedMotion';
import RoomShell from '../RoomShell';
import HeartTrace from './HeartTrace';
import KnownOrUnknown from './KnownOrUnknown';
import FearBoxes from './FearBoxes';
import RustlingBushes from './RustlingBushes';
import { paceFor } from './lab';
import { createLabSound, type LabSound } from './sound';
import './lab.css';

/*
 * What Scares You?, on one screen: a dark lab with a heart monitor running
 * along its foot, and three tabs over it (the fear boxes, known or unknown,
 * the rustling bushes). Each tab has its own address (#box, #choose,
 * #bushes). The monitor quickens with whatever is frightening on screen; it
 * is a drawing, not a reading.
 *
 * Sound starts off and motion follows the visitor's setting; both have a
 * switch at the top. With sound on, a creepy drone loops under every tab
 * (sound.ts), tightening as the fright rises, with the heartbeat at the
 * monitor's pace and the wind over the bushes. No camera or microphone is
 * used.
 */

const TABS = [
  { id: 'box', label: 'The Fear Boxes', short: 'Boxes' },
  { id: 'choose', label: 'Known or Unknown?', short: 'Choose' },
  { id: 'bushes', label: 'The Rustling Bushes', short: 'Bushes' },
] as const;
type TabId = (typeof TABS)[number]['id'];

export default function WhatScaresYou() {
  const reduced = usePrefersReducedMotion();
  const [tab, setTab] = useState<TabId>('box');
  const [soundOn, setSoundOn] = useState(false);
  const [motionChoice, setMotionChoice] = useState<boolean | null>(null);
  const motion = motionChoice ?? !reduced;
  const [fright, setFright] = useState(0);
  const sound = useRef<LabSound | null>(null);
  const tabRefs = useRef<Record<TabId, HTMLButtonElement | null>>({ box: null, choose: null, bushes: null });

  useEffect(() => {
    const fromHash = () => {
      const h = window.location.hash.slice(1);
      const t = TABS.find((x) => x.id === h);
      if (t) setTab(t.id);
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, []);

  const choose = useCallback((id: TabId, focus = false) => {
    setTab(id);
    setFright(0);
    window.history.replaceState(null, '', `#${id}`);
    if (focus) tabRefs.current[id]?.focus();
  }, []);

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const i = TABS.findIndex((x) => x.id === tab);
    const to =
      e.key === 'ArrowRight' ? (i + 1) % TABS.length
      : e.key === 'ArrowLeft' ? (i - 1 + TABS.length) % TABS.length
      : e.key === 'Home' ? 0
      : e.key === 'End' ? TABS.length - 1
      : -1;
    if (to < 0) return;
    e.preventDefault();
    choose(TABS[to].id, true);
  };

  const toggleSound = () => {
    if (soundOn) {
      sound.current?.close();
      sound.current = null;
      setSoundOn(false);
    } else {
      sound.current = createLabSound();
      setSoundOn(!!sound.current);
    }
  };
  useEffect(() => () => sound.current?.close(), []);
  const getSound = useCallback(() => sound.current, []);
  // The music tightens with the fright, and the wind blows over the bushes.
  useEffect(() => {
    sound.current?.tension(fright);
  }, [fright, soundOn]);
  useEffect(() => {
    sound.current?.wind(soundOn && tab === 'bushes');
  }, [soundOn, tab]);

  // The heartbeat you hear, at the monitor's pace, when sound is on.
  const pace = paceFor(fright);
  const paceRef = useRef(pace);
  const frightRef = useRef(fright);
  useEffect(() => {
    paceRef.current = pace;
    frightRef.current = fright;
  }, [pace, fright]);
  useEffect(() => {
    if (!soundOn) return;
    let t: ReturnType<typeof setTimeout>;
    const beat = () => {
      sound.current?.beat(frightRef.current);
      t = setTimeout(beat, 60000 / paceRef.current);
    };
    t = setTimeout(beat, 200);
    return () => clearTimeout(t);
  }, [soundOn]);

  return (
    <RoomShell className="fl-lab">
      <div className="fl-lab-stage" data-tab={tab} data-motion={motion ? 'on' : 'off'} style={{ ['--beat' as string]: `${(60 / pace).toFixed(2)}s`, ['--fright' as string]: fright.toFixed(2) }}>
        <div className="fl-lab-dark" aria-hidden="true" />

        <header className="fl-lab-bar">
          <h1 className="fl-lab-title">
            What Scares You?
            <span className="fl-lab-title-sub">The Fear Lab</span>
          </h1>
          <div className="fl-lab-tabs" role="tablist" aria-label="Experiments">
            {TABS.map((x) => (
              <button
                key={x.id}
                ref={(el) => {
                  tabRefs.current[x.id] = el;
                }}
                type="button"
                role="tab"
                id={`fl-lab-tab-${x.id}`}
                aria-controls="fl-lab-panel"
                aria-selected={tab === x.id}
                tabIndex={tab === x.id ? 0 : -1}
                className="fl-lab-tab"
                onClick={() => choose(x.id)}
                onKeyDown={onTabKey}
              >
                <span className="fl-lab-tab-long">{x.label}</span>
                <span className="fl-lab-tab-short" aria-hidden="true">{x.short}</span>
              </button>
            ))}
          </div>
          <div className="fl-lab-switches">
            <button type="button" className="fl-lab-switch" aria-pressed={soundOn} onClick={toggleSound}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 9h4l5-4v14l-5-4H4z" />
                {soundOn ? <path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" className="fl-lab-switch-line" /> : <path d="M16 9l5 6M21 9l-5 6" className="fl-lab-switch-line" />}
              </svg>
              Sound <span className="fl-lab-switch-state" aria-hidden="true">{soundOn ? 'on' : 'off'}</span>
            </button>
            <button type="button" className="fl-lab-switch" aria-pressed={motion} onClick={() => setMotionChoice(!motion)}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 12c3-6 6 6 9 0s6 6 9 0" className="fl-lab-switch-line" />
              </svg>
              Motion <span className="fl-lab-switch-state" aria-hidden="true">{motion ? 'on' : 'off'}</span>
            </button>
          </div>
        </header>

        <section className="fl-lab-panel" id="fl-lab-panel" role="tabpanel" aria-labelledby={`fl-lab-tab-${tab}`}>
          {tab === 'box' && <FearBoxes motion={motion} sound={getSound} onFright={setFright} />}
          {tab === 'choose' && <KnownOrUnknown sound={getSound} onFright={setFright} />}
          {tab === 'bushes' && <RustlingBushes motion={motion} sound={getSound} onFright={setFright} />}
        </section>

        <div className="fl-lab-monitor" aria-hidden="true">
          <svg className="fl-lab-heart" viewBox="0 0 32 30">
            <path d="M16 28 C 6 20 1 14 1 8.5 C 1 4.4 4.3 1 8.4 1 C 11.6 1 14.3 3 16 5.8 C 17.7 3 20.4 1 23.6 1 C 27.7 1 31 4.4 31 8.5 C 31 14 26 20 16 28 Z" />
          </svg>
          <HeartTrace pace={pace} still={!motion} />
        </div>
      </div>
    </RoomShell>
  );
}
