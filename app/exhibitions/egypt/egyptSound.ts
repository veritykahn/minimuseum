'use client';

import { isMuseumSoundOn } from '@/lib/museumSound';

/*
 * The Ancient Egypt rooms' sounds, made in the browser with Web Audio. Not
 * recordings; nothing to download.
 *
 *   chisel   a copper chisel on stone: a bright tick over a dull knock
 *            (each sign of a name; each sign matched on the Rosetta Stone)
 *   miss     a soft, low knock: not that one (gentle: a guess is never a failure)
 *   grind    a stone block dragged a little way (into the tomb's next room;
 *            an amulet set in its niche; a name carved)
 *   find     a lyre's two notes, plucked (something found by torchlight; a
 *            jar filled; a symbol added)
 *   creak    the beam of the scales, tipping
 *   settle   the scales level again: a low, soft bell
 *   water    a splash from the jug (washing)
 *   torch    the torch crackling, while it is in the visitor's hand
 *
 * They follow the museum's one sound switch (lib/museumSound.ts): silent until
 * the visitor turns sound on. The audio context is made at the first sound,
 * which is always a visitor's press. Where there is no Web Audio, nothing
 * plays and nothing breaks.
 */

export type EgyptCue = 'chisel' | 'miss' | 'grind' | 'find' | 'creak' | 'settle' | 'water';

/** Their level, 0 to 1: under talking, as a room's sounds should be. */
const LEVEL = 0.5;

let ctx: AudioContext | null = null;
let noiseBuf: AudioBuffer | null = null;

function context(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const C = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!C) return null;
    try {
      ctx = new C();
    } catch {
      return null;
    }
  }
  if (ctx.state === 'suspended') void ctx.resume().catch(() => undefined);
  return ctx;
}

function noise(ac: AudioContext): AudioBuffer {
  if (noiseBuf && noiseBuf.sampleRate === ac.sampleRate) return noiseBuf;
  const b = ac.createBuffer(1, ac.sampleRate, ac.sampleRate);
  const d = b.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  noiseBuf = b;
  return b;
}

/** A gain that rises over `attack` to `peak`, then falls away over `release`. */
function envelope(ac: AudioContext, at: number, peak: number, attack: number, release: number): GainNode {
  const g = ac.createGain();
  g.gain.setValueAtTime(0.0001, at);
  g.gain.linearRampToValueAtTime(peak * LEVEL, at + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, at + attack + release);
  g.connect(ac.destination);
  return g;
}

function burst(ac: AudioContext, at: number, filter: BiquadFilterType, freq: number, q: number, peak: number, attack: number, release: number, endFreq?: number) {
  const src = ac.createBufferSource();
  src.buffer = noise(ac);
  const f = ac.createBiquadFilter();
  f.type = filter;
  f.frequency.setValueAtTime(freq, at);
  if (endFreq) f.frequency.exponentialRampToValueAtTime(endFreq, at + attack + release);
  f.Q.value = q;
  src.connect(f).connect(envelope(ac, at, peak, attack, release));
  src.start(at, Math.random() * 0.5);
  src.stop(at + attack + release + 0.05);
}

function tone(ac: AudioContext, at: number, type: OscillatorType, freq: number, peak: number, attack: number, release: number, endFreq?: number) {
  const o = ac.createOscillator();
  o.type = type;
  o.frequency.setValueAtTime(freq, at);
  if (endFreq) o.frequency.exponentialRampToValueAtTime(endFreq, at + attack + release);
  o.connect(envelope(ac, at, peak, attack, release));
  o.start(at);
  o.stop(at + attack + release + 0.05);
}

const CUES: Record<EgyptCue, (ac: AudioContext, t: number) => void> = {
  chisel: (ac, t) => {
    burst(ac, t, 'bandpass', 3200, 2.5, 0.55, 0.002, 0.04);
    tone(ac, t, 'sine', 190, 0.35, 0.003, 0.09, 120);
  },
  miss: (ac, t) => {
    tone(ac, t, 'sine', 150, 0.25, 0.005, 0.12, 110);
  },
  grind: (ac, t) => {
    burst(ac, t, 'lowpass', 520, 0.8, 0.5, 0.25, 0.9, 260);
    burst(ac, t + 0.05, 'bandpass', 900, 4, 0.12, 0.2, 0.7);
  },
  find: (ac, t) => {
    tone(ac, t, 'triangle', 587, 0.3, 0.004, 0.9);
    tone(ac, t + 0.11, 'triangle', 880, 0.26, 0.004, 1.1);
  },
  creak: (ac, t) => {
    const o = ac.createOscillator();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(70, t);
    o.frequency.linearRampToValueAtTime(95, t + 0.35);
    o.frequency.linearRampToValueAtTime(62, t + 0.75);
    const f = ac.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.value = 700;
    f.Q.value = 9;
    o.connect(f).connect(envelope(ac, t, 0.5, 0.08, 0.75));
    o.start(t);
    o.stop(t + 0.9);
  },
  settle: (ac, t) => {
    tone(ac, t, 'sine', 392, 0.22, 0.01, 1.6);
    tone(ac, t, 'sine', 784, 0.06, 0.01, 1.0);
  },
  water: (ac, t) => {
    burst(ac, t, 'bandpass', 1400, 1.2, 0.35, 0.01, 0.28, 600);
    burst(ac, t + 0.06, 'highpass', 3000, 0.7, 0.12, 0.01, 0.18);
  },
};

/** Plays a cue if the museum's sound is on. Never throws. */
export function playEgypt(cue: EgyptCue): boolean {
  if (!isMuseumSoundOn()) return false;
  const ac = context();
  if (!ac) return false;
  try {
    CUES[cue](ac, ac.currentTime + 0.01);
    return true;
  } catch {
    return false;
  }
}

/**
 * The torch's crackle: small pops at random, until the returned function is
 * called. Nothing at all while the museum's sound is off.
 */
export function startTorch(): () => void {
  let stopped = false;
  let id: ReturnType<typeof setTimeout> | undefined;
  const pop = () => {
    if (stopped) return;
    const ac = isMuseumSoundOn() ? context() : null;
    if (ac) {
      try {
        const t = ac.currentTime + 0.01;
        burst(ac, t, 'bandpass', 1500 + Math.random() * 2500, 1.5, 0.06 + Math.random() * 0.1, 0.001, 0.015 + Math.random() * 0.03);
        if (Math.random() < 0.2) burst(ac, t, 'lowpass', 300, 0.7, 0.05, 0.05, 0.3);
      } catch {
        /* the crackle stops; nothing else does */
      }
    }
    id = setTimeout(pop, 50 + Math.random() * 220);
  };
  pop();
  return () => {
    stopped = true;
    if (id) clearTimeout(id);
  };
}

/** For tests: forget the audio context. */
export function resetEgyptSoundForTests(): void {
  ctx = null;
  noiseBuf = null;
}
