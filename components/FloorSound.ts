'use client';

import { useEffect, useRef, type RefObject } from 'react';
import { SILENT_EXHIBITIONS } from '@/components/exhibition/posterSoundPaths';
import { setHallDim, useMuseumSound } from '@/lib/museumSound';

/*
 * A floor's sound, as a visitor walks its hall: each exhibition's own sound
 * (floorSoundsOnDisk, posterSounds.ts) heard faintly, as if from its open
 * doorway, as loud as its card is on screen, the way the hall's light is
 * (FloorPage.tsx): halfway between two rooms, a little of each. The hall's own
 * sound (HallSound.tsx) steps back as a room's comes up, and passing the
 * Holocaust exhibition the hall falls almost silent: it has no sound, and the
 * quiet is its sound.
 *
 * It follows the museum's one sound switch (lib/museumSound.ts), so nothing
 * plays or downloads until the visitor has turned sound on, and only the
 * rooms on either side of the visitor are playing at any time. Through Web
 * Audio, where there is one, each room is softened as a doorway softens it
 * (a gentle low-pass) and its level is set even where a phone's browser will
 * not let a page set an element's volume.
 */

/** A room's level at its doorway, with its card full on screen: faint. */
export const FLOOR_LEVEL = 0.2;
/** How far the hall's own sound steps back for a room's, and for a silent one. */
const DIM_FOR_SOUND = 0.55;
const DIM_FOR_SILENCE = 0.92;
/** The doorway's softening, in Hz. */
const DOORWAY_HZ = 1800;

type Player = { audio: HTMLAudioElement; gain: GainNode | null };
type AudioContextClass = typeof AudioContext;

export function useFloorSound(slugs: readonly string[], sounds: Record<string, string> | undefined, scroller: RefObject<HTMLDivElement | null>) {
  const [on] = useMuseumSound();
  const players = useRef(new Map<number, Player>());
  const ctx = useRef<AudioContext | null>(null);

  useEffect(() => {
    const el = scroller.current;
    const all = players.current;
    const quiet = () => {
      all.forEach((p) => {
        p.audio.pause();
        if (p.gain) p.gain.gain.value = 0;
        else p.audio.volume = 0;
      });
      setHallDim(1);
    };
    if (!on || !el || !slugs.some((s) => sounds?.[s] || SILENT_EXHIBITIONS.includes(s))) {
      quiet();
      return undefined;
    }

    const connect = (p: Player) => {
      const c = ctx.current;
      if (!c || p.gain) return;
      try {
        const g = c.createGain();
        g.gain.value = 0;
        const lp = c.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.value = DOORWAY_HZ;
        c.createMediaElementSource(p.audio).connect(lp).connect(g).connect(c.destination);
        p.audio.volume = 1;
        p.gain = g;
      } catch {
        /* no Web Audio for this one: its own volume is used */
      }
    };
    const setLevel = (p: Player, v: number) => {
      if (p.gain) p.gain.gain.value = v;
      else p.audio.volume = v;
    };

    let frame = 0;
    const apply = () => {
      frame = 0;
      const at = el.scrollLeft / (el.clientWidth || 1);
      let dim = 1;
      slugs.forEach((slug, i) => {
        const w = Math.max(0, 1 - Math.abs(at - i));
        if (SILENT_EXHIBITIONS.includes(slug)) {
          dim -= DIM_FOR_SILENCE * w;
          return;
        }
        const src = sounds?.[slug];
        if (!src) return;
        dim -= DIM_FOR_SOUND * w;
        let p = all.get(i);
        if (w > 0.02) {
          if (!p) {
            const audio = new Audio(src);
            audio.loop = true;
            audio.preload = 'auto';
            audio.volume = 0;
            p = { audio, gain: null };
            all.set(i, p);
            connect(p);
          }
          setLevel(p, FLOOR_LEVEL * w);
          if (p.audio.paused) void p.audio.play()?.catch(() => undefined);
        } else if (p && !p.audio.paused) {
          setLevel(p, 0);
          p.audio.pause();
        }
      });
      setHallDim(dim);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };

    // Web Audio is made at the visitor's first press on the floor, as browsers ask.
    const wake = () => {
      if (ctx.current || typeof window === 'undefined') return;
      const AC: AudioContextClass | undefined = window.AudioContext ?? (window as unknown as { webkitAudioContext?: AudioContextClass }).webkitAudioContext;
      if (!AC) return;
      try {
        ctx.current = new AC();
        all.forEach(connect);
        apply();
      } catch {
        ctx.current = null;
      }
    };
    void ctx.current?.resume().catch(() => undefined);

    apply();
    el.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('pointerdown', wake);
    window.addEventListener('keydown', wake);
    return () => {
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('pointerdown', wake);
      window.removeEventListener('keydown', wake);
      if (frame) cancelAnimationFrame(frame);
      quiet();
    };
  }, [on, slugs, sounds, scroller]);

  // Leaving the floor: every room stops, and the hall comes back up.
  useEffect(() => {
    const all = players.current;
    return () => {
      all.forEach((p) => {
        p.audio.pause();
        p.audio.removeAttribute('src');
      });
      all.clear();
      void ctx.current?.close().catch(() => undefined);
      ctx.current = null;
      setHallDim(1);
    };
  }, []);
}
