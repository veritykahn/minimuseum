'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/*
 * Our sound reconstruction of the last minutes before 11:00 on 11 November
 * 1918, made in the browser with Web Audio. Not a recording.
 *
 * Distant artillery: each report is a burst of low, filtered noise with a
 * soft sub-bass thump under it, at irregular intervals that come faster as
 * the hour approaches. At the hour every sound stops dead, and nothing more
 * is scheduled: what follows is silence.
 *
 * Nothing sounds until the visitor presses Begin (browsers allow sound only
 * after a click), and everything stops when the page is left, as the Jazz
 * Lab's engine does.
 */

export type Thud = {
  /** Seconds after the sound starts. */
  at: number;
  /** 0–1: how close it sounds. */
  level: number;
  /** Low-pass cutoff in Hz: lower is further away. */
  cutoff: number;
  /** Seconds the rumble takes to die away. */
  decay: number;
};

/** A small seeded random generator, so the barrage is the same every time (and testable). */
export function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * The reports between `from` and `until` (seconds): sparse at first, closer
 * together toward the end, the last of them a little before `until` so the
 * hour falls on silence rather than on a report.
 */
export function thudSchedule(from: number, until: number, seed = 1918): Thud[] {
  const rand = seeded(seed);
  const span = until - from;
  const out: Thud[] = [];
  let t = from + 0.6;
  while (t < until - 0.15) {
    const p = (t - from) / span; // 0 → 1 toward the hour
    out.push({
      at: t,
      level: 0.35 + rand() * 0.65 * (0.6 + 0.4 * p),
      cutoff: 110 + rand() * 170,
      decay: 1.4 + rand() * 1.6,
    });
    // Sometimes a second gun answers almost at once.
    if (rand() < 0.18 + 0.2 * p) {
      const echo = t + 0.12 + rand() * 0.35;
      if (echo < until - 0.15) out.push({ at: echo, level: 0.3 + rand() * 0.4, cutoff: 100 + rand() * 120, decay: 1.2 + rand() * 1.2 });
    }
    const gap = 3.4 - 2.9 * Math.pow(p, 1.4); // 3.4 s apart at first, about 0.5 s at the end
    t += gap * (0.6 + rand() * 0.8);
  }
  return out.sort((a, b) => a.at - b.at);
}

type Ctx = AudioContext;

function brownNoise(ctx: Ctx, seconds: number): AudioBuffer {
  const length = Math.max(1, Math.floor(ctx.sampleRate * seconds));
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  const rand = seeded(11);
  let last = 0;
  for (let i = 0; i < length; i++) {
    const white = rand() * 2 - 1;
    last = (last + 0.02 * white) / 1.02;
    data[i] = last * 3.5;
  }
  return buffer;
}

/**
 * The engine: one AudioContext for one playing of the film. Every node it
 * starts is kept, so stop() silences all of them.
 */
export class ArmisticeSound {
  private ctx: Ctx;
  private master: GainNode;
  private bus: GainNode;
  private sources = new Set<AudioScheduledSourceNode>();
  private noise: AudioBuffer | null = null;
  private closed = false;

  constructor(Ctor: typeof AudioContext) {
    this.ctx = new Ctor();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.9;
    this.bus = this.ctx.createGain();
    this.bus.gain.value = 1;
    // Everything passes through a gentle low-pass: the guns are miles off.
    const distance = this.ctx.createBiquadFilter();
    distance.type = 'lowpass';
    distance.frequency.value = 420;
    this.bus.connect(distance);
    distance.connect(this.master);
    this.master.connect(this.ctx.destination);
  }

  /**
   * Schedules the barrage. `elapsed` is how far into the film we are (ms),
   * `startAt` and `hourAt` are the film's own times (ms) for the first report
   * and for 11:00.
   */
  play(elapsed: number, startAt: number, hourAt: number) {
    if (this.closed) return;
    if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
    const now = this.ctx.currentTime;
    const toCtx = (filmMs: number) => now + (filmMs - elapsed) / 1000;
    const hour = toCtx(hourAt);
    if (hour <= now) return; // already past the hour: silence

    this.noise ??= brownNoise(this.ctx, 5);
    for (const thud of thudSchedule(startAt / 1000, hourAt / 1000)) {
      const at = toCtx(thud.at * 1000);
      if (at < now) continue;
      this.report(at, thud, hour);
    }
    // At 11:00 the whole barrage stops dead.
    this.bus.gain.setValueAtTime(1, Math.max(now, hour - 0.02));
    this.bus.gain.linearRampToValueAtTime(0, hour);
  }

  private keep(node: AudioScheduledSourceNode) {
    this.sources.add(node);
    node.onended = () => {
      this.sources.delete(node);
      try { node.disconnect(); } catch { /* already gone */ }
    };
  }

  private report(at: number, thud: Thud, hour: number) {
    const ctx = this.ctx;
    const end = Math.min(at + thud.decay, hour);

    // The rumble: filtered noise, a quick swell and a long fall.
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = thud.cutoff;
    filter.Q.value = 0.7;
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, at);
    env.gain.exponentialRampToValueAtTime(thud.level, at + 0.025);
    env.gain.exponentialRampToValueAtTime(0.0001, at + thud.decay);
    src.connect(filter);
    filter.connect(env);
    env.connect(this.bus);
    src.start(at, Math.random() * 1.5);
    src.stop(end);
    this.keep(src);

    // The thump under it: a low sine that falls in pitch.
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(52 + thud.cutoff / 20, at);
    osc.frequency.exponentialRampToValueAtTime(30, at + 0.5);
    const thump = ctx.createGain();
    thump.gain.setValueAtTime(0.0001, at);
    thump.gain.exponentialRampToValueAtTime(thud.level * 0.8, at + 0.012);
    thump.gain.exponentialRampToValueAtTime(0.0001, at + 0.7);
    osc.connect(thump);
    thump.connect(this.bus);
    osc.start(at);
    osc.stop(Math.min(at + 0.75, hour));
    this.keep(osc);
  }

  setMuted(muted: boolean) {
    if (this.closed) return;
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(this.master.gain.value, now);
    this.master.gain.linearRampToValueAtTime(muted ? 0 : 0.9, now + 0.08);
  }

  pause() {
    if (!this.closed && this.ctx.state === 'running') this.ctx.suspend().catch(() => {});
  }

  resume() {
    if (!this.closed && this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
  }

  /** Silences everything and releases the context. Safe to call twice. */
  stop() {
    if (this.closed) return;
    this.closed = true;
    this.sources.forEach((s) => {
      try { s.stop(); } catch { /* not started, or already stopped */ }
      try { s.disconnect(); } catch { /* noop */ }
    });
    this.sources.clear();
    try { this.master.disconnect(); } catch { /* noop */ }
    this.ctx.close().catch(() => {});
  }

  /** How many sounds are scheduled or playing (for tests). */
  get live() {
    return this.sources.size;
  }
}

function audioContextClass(): typeof AudioContext | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext };
  return w.AudioContext ?? w.webkitAudioContext ?? null;
}

/**
 * The film's sound, for a React page. begin() must be called from the click
 * that starts the film. Leaving the page, or unmounting, stops everything.
 */
export function useArmisticeSound() {
  const engineRef = useRef<ArmisticeSound | null>(null);
  const mutedRef = useRef(false);
  const [muted, setMutedState] = useState(false);
  const [available] = useState(() => audioContextClass() !== null);

  const stop = useCallback(() => {
    engineRef.current?.stop();
    engineRef.current = null;
  }, []);

  const begin = useCallback((elapsed: number, startAt: number, hourAt: number) => {
    stop();
    const Ctor = audioContextClass();
    if (!Ctor) return;
    let engine: ArmisticeSound | null = null;
    try {
      engine = new ArmisticeSound(Ctor);
      engineRef.current = engine;
      if (mutedRef.current) engine.setMuted(true);
      engine.play(elapsed, startAt, hourAt);
    } catch (err) {
      if (process.env.NODE_ENV === 'test') console.error(err);
      engine?.stop();
      engineRef.current = null; // no sound: the film runs silent
    }
  }, [stop]);

  const setMuted = useCallback((m: boolean) => {
    mutedRef.current = m;
    setMutedState(m);
    engineRef.current?.setMuted(m);
  }, []);

  const pause = useCallback(() => engineRef.current?.pause(), []);
  const resume = useCallback(() => engineRef.current?.resume(), []);

  useEffect(() => {
    window.addEventListener('pagehide', stop);
    return () => {
      window.removeEventListener('pagehide', stop);
      stop();
    };
  }, [stop]);

  return useMemo(
    () => ({ begin, stop, pause, resume, setMuted, muted, available, engine: () => engineRef.current }),
    [begin, stop, pause, resume, setMuted, muted, available],
  );
}
