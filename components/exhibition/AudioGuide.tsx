'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';

/*
 * The poster walkthrough's audio guide, as a museum's handset works: it is
 * off until a visitor turns it on, and then each panel's recording plays as
 * the panel arrives and stops when they move on. They can pause, play again,
 * or turn the guide off; the choice lasts the visit (sessionStorage). It
 * never moves the walkthrough on by itself, so everyone reads at their own pace.
 *
 * One <audio> element lives here, outside the panels (which are rebuilt on
 * every step), so a panel change only swaps its source.
 */

const KEY = 'mm-audio-guide';

type CssVars = CSSProperties & Record<`--${string}`, string>;

export default function AudioGuide({ src, color, bg }: { src?: string; color: string; bg: string }) {
  const audio = useRef<HTMLAudioElement | null>(null);
  // Read on first render: the guide is drawn only once a poster is open, on the client.
  const [on, setOn] = useState(() => {
    try {
      return sessionStorage.getItem(KEY) === 'on';
    } catch {
      return false; /* storage unavailable: the guide starts off */
    }
  });
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const a = new Audio();
    a.preload = 'auto';
    const tick = () => setProgress(a.duration ? a.currentTime / a.duration : 0);
    const play = () => setPlaying(true);
    const stop = () => setPlaying(false);
    a.addEventListener('timeupdate', tick);
    a.addEventListener('emptied', tick);
    a.addEventListener('play', play);
    a.addEventListener('pause', stop);
    a.addEventListener('ended', stop);
    audio.current = a;
    return () => {
      a.pause();
      a.removeAttribute('src');
      audio.current = null;
    };
  }, []);

  // A new panel: stop the last recording and, with the guide on, play this one.
  useEffect(() => {
    const a = audio.current;
    if (!a) return;
    a.pause();
    if (!src) {
      a.removeAttribute('src');
      a.load();
      return;
    }
    a.src = src;
    if (on) a.play().catch(() => setPlaying(false));
  }, [src, on]);

  const remember = (value: boolean) => {
    try {
      sessionStorage.setItem(KEY, value ? 'on' : 'off');
    } catch {
      /* storage unavailable: the choice lasts this page only */
    }
  };

  const turnOn = () => {
    setOn(true);
    remember(true);
  };
  const turnOff = () => {
    audio.current?.pause();
    setOn(false);
    remember(false);
  };
  const toggle = () => {
    const a = audio.current;
    if (!a) return;
    if (a.paused) {
      if (a.ended || progress >= 1) a.currentTime = 0;
      a.play().catch(() => setPlaying(false));
    } else a.pause();
  };

  const style: CssVars = { color, borderColor: color, backgroundColor: bg, '--ag-progress': `${Math.round(progress * 360)}deg` };

  if (!on) {
    return (
      <div className="pe-audio-guide">
        <button type="button" className="pe-audio-btn pe-audio-start" style={style} onClick={turnOn} aria-pressed="false">
          <Headphones />
          <span>Audio guide</span>
        </button>
      </div>
    );
  }

  return (
    <div className="pe-audio-guide" role="group" aria-label="Audio guide">
      <button
        type="button"
        className="pe-audio-btn pe-audio-play"
        style={style}
        onClick={toggle}
        disabled={!src}
        aria-label={!src ? 'No recording for this panel' : playing ? 'Pause the audio guide' : 'Play this panel again'}
      >
        {playing ? <Pause /> : <Play />}
      </button>
      <button type="button" className="pe-audio-btn pe-audio-off" style={style} onClick={turnOff} aria-pressed="true">
        <Headphones />
        <span>Guide off</span>
      </button>
    </div>
  );
}

function Headphones() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M4 15v-3a8 8 0 0 1 16 0v3" />
      <rect x="3" y="14" width="4" height="6" rx="1.5" />
      <rect x="17" y="14" width="4" height="6" rx="1.5" />
    </svg>
  );
}

function Play() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="currentColor">
      <path d="M8 5.5v13l10.5-6.5z" />
    </svg>
  );
}

function Pause() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="currentColor">
      <rect x="6.5" y="5" width="4" height="14" rx="1" />
      <rect x="13.5" y="5" width="4" height="14" rx="1" />
    </svg>
  );
}
