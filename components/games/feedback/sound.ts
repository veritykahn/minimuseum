'use client';

import { useSyncExternalStore } from 'react';

/*
 * The feedback kit's sounds: short tones made with Web Audio, so there are no
 * files to load. Sound is OFF until the visitor turns it on with the
 * SoundSwitch, and no AudioContext exists until then: a page never makes a
 * noise the visitor did not ask for. The choice is remembered for the next
 * game (per browser), and every read and write of storage is guarded.
 */

export type Cue = 'right' | 'wrong' | 'finale' | 'click';

export type Tone = {
  /** Hz */
  freq: number;
  /** Seconds after the cue starts. */
  start: number;
  /** Seconds. */
  dur: number;
  type: OscillatorType;
  /** Peak gain, kept low: these sit under a teacher's voice. */
  gain: number;
};

/** A bright two-note sting for right, one soft low note for wrong. */
export const CUES: Record<Cue, readonly Tone[]> = {
  right: [
    { freq: 659.25, start: 0, dur: 0.14, type: 'triangle', gain: 0.16 }, // E5
    { freq: 987.77, start: 0.11, dur: 0.26, type: 'triangle', gain: 0.16 }, // B5
  ],
  wrong: [{ freq: 196, start: 0, dur: 0.34, type: 'sine', gain: 0.14 }], // G3
  finale: [
    { freq: 523.25, start: 0, dur: 0.16, type: 'triangle', gain: 0.14 }, // C5
    { freq: 659.25, start: 0.12, dur: 0.16, type: 'triangle', gain: 0.14 }, // E5
    { freq: 783.99, start: 0.24, dur: 0.16, type: 'triangle', gain: 0.14 }, // G5
    { freq: 1046.5, start: 0.36, dur: 0.5, type: 'triangle', gain: 0.15 }, // C6
  ],
  click: [
    { freq: 1500, start: 0, dur: 0.035, type: 'square', gain: 0.05 },
    { freq: 520, start: 0.02, dur: 0.07, type: 'triangle', gain: 0.12 },
  ],
};

export const SOUND_KEY = 'minimuseum:game-sound';

let soundOn: boolean | null = null;
const listeners = new Set<() => void>();

function readStored(): boolean {
  try {
    return window.localStorage.getItem(SOUND_KEY) === 'on';
  } catch {
    return false;
  }
}

export function isSoundOn(): boolean {
  if (typeof window === 'undefined') return false;
  if (soundOn === null) soundOn = readStored();
  return soundOn;
}

export function setSoundOn(on: boolean): void {
  soundOn = on;
  try {
    window.localStorage.setItem(SOUND_KEY, on ? 'on' : 'off');
  } catch {
    /* private window or blocked storage: the switch still works for this page */
  }
  // Turning sound on is the visitor's gesture: the only moment the audio
  // context is made or woken.
  if (on) context();
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

/** [on, set]; always off during server render. */
export function useGameSound(): [boolean, (on: boolean) => void] {
  const on = useSyncExternalStore(subscribe, isSoundOn, () => false);
  return [on, setSoundOn];
}

let ctx: AudioContext | null = null;

function context(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const C =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!C) return null;
    try {
      ctx = new C();
    } catch {
      return null;
    }
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

/**
 * Plays a cue if sound is on. Returns whether it was scheduled. Never throws:
 * a browser without Web Audio simply stays quiet.
 */
export function playCue(cue: Cue): boolean {
  if (!isSoundOn()) return false;
  const ac = context();
  if (!ac) return false;
  try {
    const now = ac.currentTime;
    for (const t of CUES[cue]) {
      const osc = ac.createOscillator();
      const g = ac.createGain();
      osc.type = t.type;
      osc.frequency.setValueAtTime(t.freq, now + t.start);
      // A quick attack and a smooth release: no clicks at either end.
      g.gain.setValueAtTime(0.0001, now + t.start);
      g.gain.linearRampToValueAtTime(t.gain, now + t.start + 0.012);
      g.gain.linearRampToValueAtTime(0.0001, now + t.start + t.dur);
      osc.connect(g);
      g.connect(ac.destination);
      osc.start(now + t.start);
      osc.stop(now + t.start + t.dur + 0.02);
    }
    return true;
  } catch {
    return false;
  }
}

/** For tests: forget the cached choice and context. */
export function resetSoundForTests(): void {
  soundOn = null;
  ctx = null;
}
