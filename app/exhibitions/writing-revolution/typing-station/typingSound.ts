'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/*
 * The station's sounds, made in the browser with Web Audio. Not recordings.
 *
 *   clack    a typebar striking the platen: a sharp click of filtered noise
 *            over a short wooden knock
 *   space    the carriage stepping on without a strike: a soft tick
 *   bell     the margin bell: two bright partials ringing away
 *   ret      the carriage returned: a ratchet of clicks under a sliding rush
 *   key      the iMac's keyboard: a light, short tap
 *
 * Nothing sounds until the visitor turns sound on or starts typing (a
 * keystroke is the gesture browsers ask for), and once they turn it off it
 * stays off. Everything stops when the page is left.
 */

export type SoundName = 'clack' | 'space' | 'bell' | 'ret' | 'back' | 'key';
/** 'idle' until the visitor types or chooses; then on or off. */
export type SoundState = 'idle' | 'on' | 'off';

function noiseBuffer(ctx: AudioContext): AudioBuffer {
  const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.5), ctx.sampleRate);
  const d = buf.getChannelData(0);
  let seed = 7;
  for (let i = 0; i < d.length; i++) {
    seed = (seed * 16807) % 2147483647;
    d[i] = (seed / 2147483647) * 2 - 1;
  }
  return buf;
}

function burst(ctx: AudioContext, out: AudioNode, noise: AudioBuffer, at: number, o: { freq: number; q: number; gain: number; decay: number; type?: BiquadFilterType }) {
  const src = ctx.createBufferSource();
  src.buffer = noise;
  src.playbackRate.value = 0.8 + Math.random() * 0.4;
  const f = ctx.createBiquadFilter();
  f.type = o.type ?? 'bandpass';
  f.frequency.value = o.freq * (0.92 + Math.random() * 0.16);
  f.Q.value = o.q;
  const g = ctx.createGain();
  g.gain.setValueAtTime(o.gain, at);
  g.gain.exponentialRampToValueAtTime(0.0008, at + o.decay);
  src.connect(f).connect(g).connect(out);
  src.start(at, Math.random() * 0.3);
  src.stop(at + o.decay + 0.02);
}

function tone(ctx: AudioContext, out: AudioNode, at: number, freq: number, gain: number, decay: number, type: OscillatorType = 'sine') {
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.value = freq;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, at);
  g.gain.linearRampToValueAtTime(gain, at + 0.004);
  g.gain.exponentialRampToValueAtTime(0.0005, at + decay);
  osc.connect(g).connect(out);
  osc.start(at);
  osc.stop(at + decay + 0.02);
}

export function playSound(ctx: AudioContext, out: AudioNode, noise: AudioBuffer, name: SoundName) {
  const t = ctx.currentTime + 0.005;
  switch (name) {
    case 'clack':
      burst(ctx, out, noise, t, { freq: 3200, q: 1.4, gain: 0.9, decay: 0.045 });
      burst(ctx, out, noise, t + 0.004, { freq: 420, q: 2.5, gain: 0.7, decay: 0.09 });
      tone(ctx, out, t, 180 + Math.random() * 30, 0.25, 0.06, 'triangle');
      break;
    case 'back':
      burst(ctx, out, noise, t, { freq: 1600, q: 2, gain: 0.45, decay: 0.05 });
      break;
    case 'space':
      burst(ctx, out, noise, t, { freq: 2200, q: 3, gain: 0.35, decay: 0.035 });
      break;
    case 'bell':
      tone(ctx, out, t, 2093, 0.22, 1.6);
      tone(ctx, out, t, 2637, 0.12, 1.2);
      tone(ctx, out, t, 5274, 0.04, 0.5);
      break;
    case 'ret':
      for (let i = 0; i < 9; i++) burst(ctx, out, noise, t + i * 0.028, { freq: 2600, q: 4, gain: 0.35, decay: 0.03 });
      burst(ctx, out, noise, t, { freq: 900, q: 0.7, gain: 0.35, decay: 0.32, type: 'lowpass' });
      burst(ctx, out, noise, t + 0.3, { freq: 380, q: 2, gain: 0.8, decay: 0.12 });
      break;
    case 'key':
      burst(ctx, out, noise, t, { freq: 4200, q: 1.8, gain: 0.32, decay: 0.03 });
      burst(ctx, out, noise, t + 0.01, { freq: 900, q: 2, gain: 0.18, decay: 0.04 });
      break;
  }
}

/** The station's sound switch, and a play() that sounds only when it is on. */
export function useTypingSound() {
  const [state, setState] = useState<SoundState>('idle');
  const stateRef = useRef<SoundState>('idle');
  const audio = useRef<{ ctx: AudioContext; out: GainNode; noise: AudioBuffer } | null>(null);

  const ensure = useCallback(() => {
    if (audio.current) {
      if (audio.current.ctx.state === 'suspended') void audio.current.ctx.resume();
      return audio.current;
    }
    const Ctor = typeof window !== 'undefined' ? window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext : undefined;
    if (!Ctor) return null;
    const ctx = new Ctor();
    const out = ctx.createGain();
    out.gain.value = 0.5;
    out.connect(ctx.destination);
    audio.current = { ctx, out, noise: noiseBuffer(ctx) };
    return audio.current;
  }, []);

  const set = useCallback((s: SoundState) => {
    stateRef.current = s;
    setState(s);
  }, []);

  const toggle = useCallback(() => {
    const next = stateRef.current === 'on' ? 'off' : 'on';
    set(next);
    if (next === 'on') ensure();
  }, [ensure, set]);

  /** Starting to type turns sound on, unless the visitor has turned it off. */
  const play = useCallback(
    (name: SoundName) => {
      if (stateRef.current === 'off') return;
      if (stateRef.current === 'idle') set('on');
      const a = ensure();
      if (a) playSound(a.ctx, a.out, a.noise, name);
    },
    [ensure, set],
  );

  useEffect(
    () => () => {
      void audio.current?.ctx.close();
      audio.current = null;
    },
    [],
  );

  return { state, toggle, play };
}
