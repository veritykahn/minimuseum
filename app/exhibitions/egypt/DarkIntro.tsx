'use client';

import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '@/lib/a11y/usePrefersReducedMotion';
import { isMuseumSoundOn } from '@/lib/museumSound';
import './darkIntro.css';

/*
 * The dark, dramatic opening every Egypt room starts with: a dark grey
 * screen, the room's name rising out of it, then the intro lines one at a
 * time, read aloud. Then "Begin", and the room itself.
 *
 * The voice is the owner's own recording, when it exists: an mp3 at
 * /exhibitions/egypt/voice/<voice>.mp3 (the room's slug, "tomb-intro" say).
 * It plays only when the museum's sound is on. Until it is recorded, or with
 * sound off, the lines appear on their own timing, with nothing missing.
 * "Skip" goes straight in; with reduced motion every line shows at once.
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
  const [shown, setShown] = useState(reduced ? lines.length : -1);
  const audio = useRef<HTMLAudioElement | null>(null);
  const beginRef = useRef<HTMLButtonElement>(null);
  const all = shown >= lines.length;

  useEffect(() => {
    if (reduced) {
      setShown(lines.length);
      return;
    }
    const timers: number[] = [];
    timers.push(window.setTimeout(() => setShown(0), TITLE_MS));
    lines.forEach((_, i) => timers.push(window.setTimeout(() => setShown(i + 1), TITLE_MS + 400 + i * LINE_MS)));
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [lines, reduced]);

  // The owner's voice, if she has recorded it and sound is on. A missing file is simply silent.
  useEffect(() => {
    if (!voice || !isMuseumSoundOn() || typeof Audio === 'undefined') return;
    const a = new Audio(`/exhibitions/egypt/voice/${voice}.mp3`);
    a.volume = 0.9;
    audio.current = a;
    const t = window.setTimeout(() => a.play().catch(() => undefined), reduced ? 0 : TITLE_MS);
    return () => {
      window.clearTimeout(t);
      a.pause();
      audio.current = null;
    };
  }, [voice, reduced]);

  useEffect(() => {
    if (all) beginRef.current?.focus({ preventScroll: true });
  }, [all]);

  const finish = () => {
    audio.current?.pause();
    onDone();
  };

  return (
    <div className="egi-root" role="dialog" aria-modal="true" aria-labelledby="egi-title">
      <h1 id="egi-title" className="egi-title" data-on={shown >= -1 || undefined}>
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
