'use client';

import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '@/lib/a11y/usePrefersReducedMotion';
import { useMuseumSound } from '@/lib/museumSound';
import './darkIntro.css';

/*
 * The dark, dramatic opening every Egypt room starts with: a dark grey
 * screen, the room's name rising out of it, then the intro lines one at a
 * time, read aloud. Then "Begin", and the room itself.
 *
 * The voice is the owner's own recording, when it exists: an mp3 at
 * /exhibitions/egypt/voice/<voice>.mp3 (the room's slug, "tomb-intro" say).
 * It plays only when the museum's sound is on; turning the sound switch on
 * during the intro starts it where the lines have got to, and off stops it.
 * Until it is recorded, or with sound off, the lines appear on their own
 * timing, with nothing missing. "Skip" (or Escape) goes straight in; with
 * reduced motion every line shows at once.
 */

export type DarkIntroProps = {
  /** "Tomb Explorer" */
  title: string;
  /** The lines, shown one at a time and read aloud. Keep them short: three to five. */
  lines: readonly string[];
  /** The recording's name under /exhibitions/egypt/voice/, without ".mp3". */
  voice?: string;
  /** What the button that ends the intro says. */
  begin?: string;
  onDone: () => void;
};

const TITLE_MS = 1600;
const LINE_MS = 2600;

export default function DarkIntro({ title, lines, voice, begin = 'Begin', onDone }: DarkIntroProps) {
  const reduced = usePrefersReducedMotion();
  // -1: the title alone; then how many lines are showing.
  const [timed, setShown] = useState(-1);
  // With reduced motion every line shows at once.
  const shown = reduced ? lines.length : timed;
  const audio = useRef<HTMLAudioElement | null>(null);
  const beginRef = useRef<HTMLButtonElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const all = shown >= lines.length;
  // The title rises a moment after the screen goes dark (a first paint has nothing to fade from).
  const [rise, setRise] = useState(false);
  useEffect(() => {
    rootRef.current?.focus({ preventScroll: true });
    const t = window.setTimeout(() => setRise(true), 80);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const timers: number[] = [];
    timers.push(window.setTimeout(() => setShown(0), TITLE_MS));
    lines.forEach((_, i) => timers.push(window.setTimeout(() => setShown(i + 1), TITLE_MS + 400 + i * LINE_MS)));
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [lines, reduced]);

  // When the intro began, so a voice started late picks up where the lines are.
  const started = useRef(0);
  useEffect(() => {
    started.current = Date.now();
  }, []);

  // The owner's voice, if she has recorded it and sound is on. A missing file is simply silent.
  const [soundOn] = useMuseumSound();
  useEffect(() => {
    if (!voice || !soundOn || typeof Audio === 'undefined') return;
    const a = new Audio(`/exhibitions/egypt/voice/${voice}.mp3`);
    a.volume = 0.9;
    audio.current = a;
    const elapsed = Date.now() - started.current;
    const play = () => {
      try {
        if (!reduced && elapsed > TITLE_MS) a.currentTime = (elapsed - TITLE_MS) / 1000;
        const p = a.play();
        if (p && typeof p.catch === 'function') p.catch(() => undefined);
      } catch {
        /* no audio here: the lines carry on without it */
      }
    };
    const t = window.setTimeout(play, reduced ? 0 : Math.max(0, TITLE_MS - elapsed));
    return () => {
      window.clearTimeout(t);
      a.pause();
      audio.current = null;
    };
  }, [voice, reduced, soundOn]);

  useEffect(() => {
    if (all) beginRef.current?.focus({ preventScroll: true });
  }, [all]);

  const finish = () => {
    audio.current?.pause();
    onDone();
  };
  const finishRef = useRef(finish);
  useEffect(() => {
    finishRef.current = finish;
  });
  // Escape skips, as the Skip button does.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') finishRef.current();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div ref={rootRef} className="egi-root" role="dialog" aria-modal="true" aria-labelledby="egi-title" tabIndex={-1}>
      <h1 id="egi-title" className="egi-title" data-on={rise || reduced || undefined}>
        {title}
      </h1>
      <div className="egi-lines" aria-live="polite">
        {lines.map((l, i) => (
          <p key={i} className="egi-line" data-on={i < shown || undefined} aria-hidden={i < shown ? undefined : true}>
            {l}
          </p>
        ))}
      </div>
      <div className="egi-actions">
        <button ref={beginRef} type="button" className="egi-begin" data-on={all || undefined} onClick={finish} tabIndex={all ? 0 : -1}>
          {begin}
        </button>
        {!all && (
          <button type="button" className="egi-skip" onClick={finish}>
            Skip
          </button>
        )}
      </div>
    </div>
  );
}
