'use client';

import { useEffect, useRef, useState } from 'react';

/*
 * A record to hear beside a poster panel ("The Sound of Harlem"): a play and
 * pause button for each recording, credited as the project credits it
 * elsewhere (the Migration Map, the phonograph in the display case). Nothing
 * plays until it is pressed; one plays at a time, and it stops when the panel
 * changes. It is the panel's own player, apart from any audio guide.
 */

export type PanelTrack = {
  /** A path under public/. */
  src: string;
  title: string;
  artist: string;
  /** The label and year, or where the record is kept. */
  year: string;
};

export default function PanelMusic({ tracks, color }: { tracks: readonly PanelTrack[]; color: string }) {
  const [playing, setPlaying] = useState<number | null>(null);
  const players = useRef<(HTMLAudioElement | null)[]>([]);

  // Stop when the panel changes (the walkthrough unmounts it).
  useEffect(() => {
    const list = [...players.current];
    return () => list.forEach((a) => a?.pause());
  }, []);

  const toggle = (i: number) => {
    const a = players.current[i];
    if (!a) return;
    if (playing === i && !a.paused) {
      a.pause();
      return;
    }
    players.current.forEach((other, j) => {
      if (j !== i && other && !other.paused) other.pause();
    });
    a.play().then(
      () => setPlaying(i),
      () => setPlaying(null),
    );
  };

  return (
    <div className="hr-music" role="group" aria-label="Listen to the music" style={{ color }}>
      {tracks.map((t, i) => {
        const on = playing === i;
        return (
          <div key={t.src} className="hr-music-track">
            <audio
              ref={(el) => {
                players.current[i] = el;
              }}
              src={t.src}
              preload="none"
              onPause={() => setPlaying((p) => (p === i ? null : p))}
              onEnded={() => setPlaying((p) => (p === i ? null : p))}
            />
            <button
              type="button"
              className="hr-music-btn"
              aria-pressed={on}
              aria-label={`${on ? 'Pause' : 'Play'} ${t.title.replace(/[“”]/g, '')}, ${t.artist}`}
              onClick={() => toggle(i)}
              style={{ borderColor: color }}
            >
              <span aria-hidden="true">{on ? '❚❚' : '▶'}</span>
            </button>
            <span className="hr-music-credit">
              <span className="hr-music-title">{t.title}</span>
              <span className="hr-music-artist">{t.artist}</span>
              <span className="hr-music-year">{t.year}</span>
            </span>
          </div>
        );
      })}
    </div>
  );
}
