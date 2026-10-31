'use client';

/*
 * The timeline game's sounds, made in the browser with Web Audio: a bright
 * rising chime for a right guess, two soft falling notes for a wrong one
 * (gentle: a guess is never a failure), and a short fanfare when every card
 * is in order. Not recordings.
 *
 * Sound is off until the visitor turns it on (the room's "Sound off"
 * button), and the audio context is made only then, inside that click, as
 * browsers ask. Where there is no Web Audio, every call does nothing.
 */

export type Cue = 'right' | 'wrong' | 'fanfare' | 'on';

/** A note: its pitch in Hz, when it starts and how long it lasts (seconds), and its loudness (0–1). */
export type Note = { hz: number; at: number; dur: number; level: number; wave: OscillatorType };

const C5 = 523.25;
const E5 = 659.25;
const G5 = 783.99;
const C6 = 1046.5;
const A4 = 440;
const F4 = 349.23;

/** The notes of each cue. */
export function notesFor(cue: Cue): Note[] {
  switch (cue) {
    case 'right':
      return [C5, E5, G5, C6].map((hz, i) => ({ hz, at: i * 0.075, dur: 0.32, level: 0.22, wave: 'triangle' }));
    case 'wrong':
      return [
        { hz: A4, at: 0, dur: 0.22, level: 0.12, wave: 'sine' },
        { hz: F4, at: 0.2, dur: 0.36, level: 0.12, wave: 'sine' },
      ];
    case 'fanfare':
      return [
        ...[C5, E5, G5, C6, G5, C6].map((hz, i) => ({ hz, at: i * 0.11, dur: 0.24, level: 0.2, wave: 'triangle' as const })),
        ...[C5, E5, G5, C6].map((hz) => ({ hz, at: 0.72, dur: 0.9, level: 0.11, wave: 'triangle' as const })),
      ];
    case 'on':
      return [{ hz: G5, at: 0, dur: 0.14, level: 0.14, wave: 'triangle' }];
  }
}

type Ctx = AudioContext;
let ctx: Ctx | null = null;

function audio(): Ctx | null {
  if (ctx) return ctx;
  const AC = typeof window !== 'undefined' ? (window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext) : undefined;
  if (!AC) return null;
  try {
    ctx = new AC();
  } catch {
    return null;
  }
  return ctx;
}

/** Play a cue now. Call it only from a visitor's click or key, with sound on. */
export function play(cue: Cue) {
  const a = audio();
  if (!a) return;
  if (a.state === 'suspended') void a.resume();
  const t0 = a.currentTime + 0.02;
  for (const n of notesFor(cue)) {
    const osc = a.createOscillator();
    const gain = a.createGain();
    osc.type = n.wave;
    osc.frequency.value = n.hz;
    const start = t0 + n.at;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(n.level, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + n.dur);
    osc.connect(gain).connect(a.destination);
    osc.start(start);
    osc.stop(start + n.dur + 0.05);
  }
}

/** For tests: forget the audio context. */
export function resetAudioForTests() {
  ctx = null;
}
