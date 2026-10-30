'use client';

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { soundSrc, type SoundSlot } from './sounds';

/*
 * Our sound reconstruction of the last minutes before 11:00 on November 11
 * 1918, made in the browser with Web Audio. Not a recording.
 *
 * The battle, from the first title card to the hour, in two parts, each a
 * drop-in slot (sounds.ts):
 *   battle     rifle fire and machine-gun bursts across the front, rendered
 *              into one buffer: each shot a sharp crack with a short body
 *              and a slap of echo off the ground, coming faster as the hour
 *              approaches.
 *   artillery  under a continuous rumble of the whole front, the guns: each
 *              report a boom of filtered noise with a crack at its front and
 *              a thump beneath, near and far, closer together toward the end.
 * It is voiced in the range laptop and phone speakers actually reproduce
 * (roughly 150 Hz up), and made loud through a compressor and a limiter, so
 * a classroom projector carries it. At the hour every one of these sounds
 * stops dead.
 *
 * Then, only the quiet:
 *   breeze     a gentle breeze, coming up a moment after 11:00, rising and
 *              falling slowly, until a little after the film ends.
 *   bird       right at the very end, a single bird singing.
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

/** No sound is scheduled closer to the hour than this (s), so the hour falls on silence. */
export const HUSH = 0.15;

/**
 * The artillery's reports between `from` and `until` (seconds): already
 * steady at first, much closer together toward the end, the last of them a
 * little before `until` so the hour falls on silence rather than on a report.
 */
export function thudSchedule(from: number, until: number, seed = 1918): Thud[] {
  const rand = seeded(seed);
  const span = until - from;
  const out: Thud[] = [];
  let t = from + 0.4;
  while (t < until - HUSH) {
    const p = (t - from) / span; // 0 → 1 toward the hour
    out.push({
      at: t,
      level: 0.45 + rand() * 0.55 * (0.65 + 0.35 * p),
      cutoff: 260 + rand() * 420,
      decay: 1.4 + rand() * 1.8,
    });
    // Often a second gun, or a whole battery, answers almost at once.
    const answers = rand() < 0.3 + 0.3 * p ? 1 + Math.floor(rand() * 2.5) : 0;
    for (let k = 0, echo = t; k < answers; k++) {
      echo += 0.1 + rand() * 0.3;
      if (echo < until - HUSH) out.push({ at: echo, level: 0.35 + rand() * 0.45, cutoff: 220 + rand() * 300, decay: 1.2 + rand() * 1.4 });
    }
    const gap = 2.2 - 1.85 * Math.pow(p, 1.2); // 2.2 s apart at first, about a third of a second at the end
    t += gap * (0.55 + rand() * 0.9);
  }
  return out.sort((a, b) => a.at - b.at);
}

/** One shot of small-arms fire: when (s), how loud (0–1), and how far off (0 near, 1 far). */
export type Shot = { at: number; level: number; far: number };

/**
 * The rifle and machine-gun fire between `from` and `until` (seconds):
 * scattered rifle shots, and bursts of machine-gun fire at about eight rounds
 * a second, both growing thicker toward the hour; none in its last moment.
 */
export function gunfireSchedule(from: number, until: number, seed = 1111): Shot[] {
  const rand = seeded(seed);
  const span = until - from;
  const end = until - HUSH;
  const out: Shot[] = [];
  // Rifles: shots at random, more of them as the hour comes.
  for (let t = from + rand() * 0.5; t < end; ) {
    const p = (t - from) / span;
    out.push({ at: t, level: 0.35 + rand() * 0.55, far: rand() });
    const rate = 1.6 + 5 * p; // shots a second
    t += (-Math.log(1 - rand() * 0.98) / rate) || 0.05;
  }
  // Machine guns: bursts of rounds, a burst every few seconds, then more often.
  for (let t = from + 1 + rand() * 2; t < end; ) {
    const p = (t - from) / span;
    const rounds = 5 + Math.floor(rand() * (8 + 12 * p));
    const interval = 1 / (7.5 + rand() * 1.5);
    const far = rand();
    const level = 0.4 + rand() * 0.45;
    for (let k = 0; k < rounds; k++) {
      const at = t + k * interval * (0.92 + rand() * 0.16);
      if (at >= end) break;
      out.push({ at, level: level * (0.8 + rand() * 0.25), far });
    }
    t += rounds * interval + (3.6 - 2.6 * p) * (0.5 + rand());
  }
  return out.sort((a, b) => a.at - b.at);
}

/**
 * The small-arms fire, rendered into samples: each shot a sharp crack of
 * noise, a short low body, and a quieter slap of echo; the further off, the
 * duller and quieter. `from` is the time (s) of the buffer's first sample.
 */
export function renderGunfire(sampleRate: number, seconds: number, shots: Shot[], from = 0, seed = 7): Float32Array {
  const out = new Float32Array(Math.max(1, Math.floor(sampleRate * seconds)));
  const rand = seeded(seed);
  const crackLen = Math.floor(sampleRate * 0.09);
  const add = (start: number, level: number, decay: number, dull: number) => {
    let low = 0;
    let prev = 0;
    for (let i = 0; i < crackLen && start + i < out.length; i++) {
      if (start + i < 0) continue;
      const white = rand() * 2 - 1;
      // Duller with distance: a one-pole low-pass; the crack itself is the noise's bright edge.
      low += (white - low) * (1 - dull);
      const bright = low - prev;
      prev = low;
      const env = Math.exp(-i / (sampleRate * decay));
      out[start + i] += (bright * 0.9 + low * 0.6) * env * level;
    }
  };
  for (const s of shots) {
    const start = Math.floor((s.at - from) * sampleRate);
    const level = s.level * (1 - 0.6 * s.far);
    add(start, level, 0.012 + 0.01 * s.far, 0.25 + 0.6 * s.far);
    // The echo off the ground and the trench walls.
    add(start + Math.floor(sampleRate * (0.14 + 0.22 * s.far)), level * 0.22, 0.03, 0.8);
  }
  return out;
}

/** One note of the bird's song: when (s from the song's start), its pitch sweep (Hz) and length (s). */
export type Note = { at: number; from: number; to: number; dur: number };

/**
 * A single bird's song: two short phrases of quick, bright notes with a
 * rest between, the second phrase answering the first.
 */
export function birdSong(seed = 1111): Note[] {
  const rand = seeded(seed);
  const notes: Note[] = [];
  let t = 0;
  for (let phrase = 0; phrase < 2; phrase++) {
    const count = 7 + Math.floor(rand() * 4);
    const base = 3000 + rand() * 900;
    for (let k = 0; k < count; k++) {
      const dur = 0.055 + rand() * 0.09;
      const up = rand() < 0.5;
      const f = base + rand() * 1400 - (k === count - 1 ? 600 : 0);
      notes.push({ at: t, from: up ? f * 0.82 : f * 1.15, to: up ? f * 1.12 : f * 0.8, dur });
      t += dur + 0.035 + rand() * 0.07;
    }
    // A trill to end the phrase.
    for (let k = 0; k < 4; k++) {
      notes.push({ at: t, from: 4200, to: 3600, dur: 0.035 });
      t += 0.055;
    }
    t += 1.1 + rand() * 0.4;
  }
  return notes;
}

/** When the bird begins, before the film's end (s): so it sings right at the very end. */
export const BIRD_LEAD = 3.4;
/** How long the breeze goes on after the film's end (s), fading away. */
export const BREEZE_AFTER = 10;

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

/** The owner's files for the slots she has filled: each a decoded buffer, or null if it would not decode. */
export type SlotFiles = Partial<Record<SoundSlot, Promise<AudioBuffer | null>>>;

/**
 * The engine: one AudioContext for one playing of the film. Every node it
 * starts is kept, so stop() silences all of them.
 */
export class ArmisticeSound {
  private ctx: Ctx;
  private master: GainNode;
  /** The battle: everything here is cut dead at the hour. */
  private bus: GainNode;
  /** The quiet after: the breeze and the bird. */
  private after: GainNode;
  private distance: BiquadFilterNode;
  private sources = new Set<AudioScheduledSourceNode>();
  private noise: AudioBuffer | null = null;
  private closed = false;

  constructor(Ctor: typeof AudioContext) {
    this.ctx = new Ctor();
    this.master = this.ctx.createGain();
    this.master.gain.value = 1;
    this.bus = this.ctx.createGain();
    this.bus.gain.value = 1;
    // The battle passes through a low-pass (the front is a way off), a
    // compressor and make-up gain, so it is loud and the quiet reports still
    // carry on small speakers, and a limiter, so it never clips.
    this.distance = this.ctx.createBiquadFilter();
    this.distance.type = 'lowpass';
    this.distance.frequency.value = 3600;
    const comp = this.ctx.createDynamicsCompressor();
    comp.threshold.value = -26;
    comp.knee.value = 10;
    comp.ratio.value = 5;
    comp.attack.value = 0.004;
    comp.release.value = 0.3;
    const makeUp = this.ctx.createGain();
    makeUp.gain.value = 1.5;
    const limiter = this.ctx.createDynamicsCompressor();
    limiter.threshold.value = -2;
    limiter.knee.value = 0;
    limiter.ratio.value = 20;
    limiter.attack.value = 0.001;
    limiter.release.value = 0.1;
    this.bus.connect(this.distance);
    this.distance.connect(comp);
    comp.connect(makeUp);
    makeUp.connect(limiter);
    limiter.connect(this.master);
    this.after = this.ctx.createGain();
    this.after.gain.value = 1;
    this.after.connect(this.master);
    this.master.connect(this.ctx.destination);
  }

  /**
   * Schedules the film's sound. `elapsed` is how far into the film we are
   * (ms); `startAt`, `hourAt` and `endAt` are the film's own times (ms) for
   * the first shot, for 11:00, and for the film's end (the breeze and the
   * bird need it; without it the sound ends at the hour). `files` are the
   * owner's files for the slots she has filled; each is played in place of
   * its made sound once it has decoded, or the made sound if it will not.
   */
  play(elapsed: number, startAt: number, hourAt: number, endAt?: number, files: SlotFiles = {}) {
    if (this.closed) return;
    if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
    const now = this.ctx.currentTime;
    // The film's clock on the context's: it holds while the context is suspended (paused).
    const zero = now - elapsed / 1000;
    const toCtx = (filmMs: number) => zero + filmMs / 1000;
    const hour = toCtx(hourAt);
    const end = endAt === undefined ? null : toCtx(endAt);
    if (hour <= now && (end === null || end + BREEZE_AFTER <= now)) return; // all over: silence

    this.noise ??= brownNoise(this.ctx, 5);

    const slots: Record<SoundSlot, { make: () => void; file: (b: AudioBuffer) => void } | null> = {
      battle:
        hour > now
          ? {
              make: () => this.gunfire(toCtx(startAt), hour),
              file: (b) => this.loop(b, toCtx(startAt), hour, this.bus, 0.9, 2, 0),
            }
          : null,
      artillery:
        hour > now
          ? {
              make: () => this.artillery(toCtx(startAt), hour),
              file: (b) => this.loop(b, toCtx(startAt), hour, this.bus, 1, 2, 0),
            }
          : null,
      breeze:
        end !== null
          ? {
              make: () => this.breeze(hour + 1, end + BREEZE_AFTER),
              file: (b) => this.loop(b, hour + 1, end + BREEZE_AFTER, this.after, 0.5, 4, 4),
            }
          : null,
      bird:
        end !== null
          ? {
              make: () => this.bird(end - BIRD_LEAD),
              file: (b) => this.once(b, end - BIRD_LEAD, this.after, 0.8),
            }
          : null,
    };
    (Object.keys(slots) as SoundSlot[]).forEach((slot) => {
      const s = slots[slot];
      if (!s) return;
      const file = files[slot];
      if (!file) return s.make();
      file.then(
        (b) => {
          if (this.closed) return;
          if (b) s.file(b);
          else s.make();
        },
        () => !this.closed && s.make(),
      );
    });

    // At 11:00 the whole battle stops dead.
    if (hour > now) {
      this.bus.gain.setValueAtTime(1, Math.max(now, hour - 0.02));
      this.bus.gain.linearRampToValueAtTime(0, hour);
    }
  }

  private keep(node: AudioScheduledSourceNode) {
    this.sources.add(node);
    node.onended = () => {
      this.sources.delete(node);
      try { node.disconnect(); } catch { /* already gone */ }
    };
  }

  /** An owner's file, looped from `from` to `to` (context time), faded in and out, into `dest`. */
  private loop(buf: AudioBuffer, from: number, to: number, dest: AudioNode, level: number, fadeIn: number, fadeOut: number) {
    const now = this.ctx.currentTime;
    const start = Math.max(now, from);
    if (to <= start) return;
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    const env = this.ctx.createGain();
    env.gain.setValueAtTime(0.0001, start);
    env.gain.exponentialRampToValueAtTime(level, Math.min(to, start + Math.max(0.05, fadeIn)));
    if (fadeOut > 0) {
      env.gain.setValueAtTime(level, Math.max(start + fadeIn, to - fadeOut));
      env.gain.linearRampToValueAtTime(0, to);
    }
    src.connect(env);
    env.connect(dest);
    // Late (a slow decode): pick it up where it would be by now.
    src.start(start, buf.duration ? (start - from) % buf.duration : 0);
    src.stop(to);
    this.keep(src);
  }

  /** An owner's file, played once at `at` (context time), into `dest`. */
  private once(buf: AudioBuffer, at: number, dest: AudioNode, level: number) {
    const now = this.ctx.currentTime;
    if (at + (buf.duration || 0) <= now) return;
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const env = this.ctx.createGain();
    env.gain.value = level;
    src.connect(env);
    env.connect(dest);
    src.start(Math.max(now, at), Math.max(0, now - at));
    this.keep(src);
  }

  /** The rifles and machine guns, rendered once and played from `from` to the hour. */
  private gunfire(from: number, hour: number) {
    const now = this.ctx.currentTime;
    const start = Math.max(now, from);
    if (hour <= start) return;
    const seconds = hour - from;
    const buf = this.ctx.createBuffer(1, Math.max(1, Math.floor(this.ctx.sampleRate * seconds)), this.ctx.sampleRate);
    buf.getChannelData(0).set(renderGunfire(this.ctx.sampleRate, seconds, gunfireSchedule(0, seconds)));
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const env = this.ctx.createGain();
    env.gain.value = 0.85;
    src.connect(env);
    env.connect(this.bus);
    src.start(start, start - from);
    src.stop(hour);
    this.keep(src);
  }

  /** The artillery: the rumble of the whole front, and each gun's report. */
  private artillery(from: number, hour: number) {
    const now = this.ctx.currentTime;
    this.rumble(Math.max(now, from), hour);
    for (const thud of thudSchedule(0, hour - from)) {
      const at = from + thud.at;
      if (at < now) continue;
      this.report(at, thud, hour);
    }
  }

  /** The far-off rumble of the whole front, from the first report to the hour. */
  private rumble(from: number, hour: number) {
    if (hour <= from) return;
    const ctx = this.ctx;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    src.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 340;
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, from);
    env.gain.exponentialRampToValueAtTime(0.32, from + 2.5);
    env.gain.setValueAtTime(0.32, Math.max(from + 2.5, hour - 0.02));
    env.gain.linearRampToValueAtTime(0, hour);
    src.connect(filter);
    filter.connect(env);
    env.connect(this.bus);
    src.start(from);
    src.stop(hour);
    this.keep(src);
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
    env.gain.exponentialRampToValueAtTime(thud.level * 2, at + 0.02);
    env.gain.exponentialRampToValueAtTime(0.0001, at + thud.decay);
    src.connect(filter);
    filter.connect(env);
    env.connect(this.bus);
    src.start(at, Math.random() * 1.5);
    src.stop(end);
    this.keep(src);

    // The crack at its front: a short burst of brighter noise, much quieter
    // the further off the gun (a lower cutoff means further away).
    const crackSrc = ctx.createBufferSource();
    crackSrc.buffer = this.noise;
    const crackBand = ctx.createBiquadFilter();
    crackBand.type = 'bandpass';
    crackBand.frequency.value = 900 + thud.cutoff;
    crackBand.Q.value = 0.9;
    const crack = ctx.createGain();
    const crackLevel = thud.level * 0.7 * (thud.cutoff / 620);
    crack.gain.setValueAtTime(0.0001, at);
    crack.gain.exponentialRampToValueAtTime(Math.max(0.001, crackLevel), at + 0.006);
    crack.gain.exponentialRampToValueAtTime(0.0001, at + 0.16);
    crackSrc.connect(crackBand);
    crackBand.connect(crack);
    crack.connect(this.bus);
    crackSrc.start(at, Math.random() * 1.5);
    crackSrc.stop(Math.min(at + 0.2, hour));
    this.keep(crackSrc);

    // The thump under it: a low sine that falls in pitch, pitched high enough
    // for small speakers to give it body.
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(95 + thud.cutoff / 12, at);
    osc.frequency.exponentialRampToValueAtTime(55, at + 0.5);
    const thump = ctx.createGain();
    thump.gain.setValueAtTime(0.0001, at);
    thump.gain.exponentialRampToValueAtTime(thud.level, at + 0.012);
    thump.gain.exponentialRampToValueAtTime(0.0001, at + 0.7);
    osc.connect(thump);
    thump.connect(this.bus);
    osc.start(at);
    osc.stop(Math.min(at + 0.75, hour));
    this.keep(osc);
  }

  /** A gentle breeze: soft noise in the middle of the range, slowly rising and falling, from `from` to `to`. */
  private breeze(from: number, to: number) {
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const start = Math.max(now, from);
    if (to <= start) return;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    src.loop = true;
    const band = ctx.createBiquadFilter();
    band.type = 'bandpass';
    band.frequency.value = 650;
    band.Q.value = 0.6;
    const env = ctx.createGain();
    const level = 0.11;
    env.gain.setValueAtTime(0.0001, start);
    env.gain.exponentialRampToValueAtTime(level, Math.min(to, start + 4));
    env.gain.setValueAtTime(level, Math.max(start + 4, to - 4));
    env.gain.linearRampToValueAtTime(0, to);
    // The breeze rises and falls: a slow swell on its level and on its pitch.
    const sway = ctx.createGain();
    sway.gain.value = 1;
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.11;
    const depth = ctx.createGain();
    depth.gain.value = 0.45;
    lfo.connect(depth);
    depth.connect(sway.gain);
    const lfo2 = ctx.createOscillator();
    lfo2.type = 'sine';
    lfo2.frequency.value = 0.07;
    const pitch = ctx.createGain();
    pitch.gain.value = 260;
    lfo2.connect(pitch);
    pitch.connect(band.frequency);
    src.connect(band);
    band.connect(sway);
    sway.connect(env);
    env.connect(this.after);
    for (const node of [src, lfo, lfo2]) {
      node.start(start);
      node.stop(to);
      this.keep(node);
    }
  }

  /** A single bird singing, from `at`. */
  private bird(at: number) {
    const ctx = this.ctx;
    const now = ctx.currentTime;
    for (const n of birdSong()) {
      const t = at + n.at;
      if (t < now) continue;
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(n.from, t);
      osc.frequency.exponentialRampToValueAtTime(n.to, t + n.dur);
      const env = ctx.createGain();
      env.gain.setValueAtTime(0.0001, t);
      env.gain.exponentialRampToValueAtTime(0.1, t + 0.008);
      env.gain.setValueAtTime(0.1, t + n.dur * 0.6);
      env.gain.exponentialRampToValueAtTime(0.0001, t + n.dur);
      osc.connect(env);
      env.connect(this.after);
      osc.start(t);
      osc.stop(t + n.dur + 0.02);
      this.keep(osc);
    }
  }

  /** Decodes an owner's file on this context: null if it will not decode. */
  decode(data: ArrayBuffer): Promise<AudioBuffer | null> {
    if (this.closed) return Promise.resolve(null);
    return new Promise<AudioBuffer | null>((res) => {
      try {
        const p = this.ctx.decodeAudioData(data.slice(0), (b) => res(b), () => res(null));
        if (p && typeof p.catch === 'function') p.catch(() => res(null));
      } catch {
        res(null);
      }
    });
  }

  setMuted(muted: boolean) {
    if (this.closed) return;
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(this.master.gain.value, now);
    this.master.gain.linearRampToValueAtTime(muted ? 0 : 1, now + 0.08);
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
const noSubscribe = () => () => {};
const hasWebAudio = () => audioContextClass() !== null;
const assumeWebAudio = () => true;

/**
 * The film's sound, for a React page. `owned` are the slots the owner has
 * put a file in (found on disk when the page was built): those files are
 * fetched as the page opens, ready to decode on Begin. begin() must be
 * called from the click that starts the film. Leaving the page, or
 * unmounting, stops everything.
 */
export function useArmisticeSound(owned: readonly SoundSlot[] = []) {
  const engineRef = useRef<ArmisticeSound | null>(null);
  const mutedRef = useRef(false);
  const [muted, setMutedState] = useState(false);
  // Assumed until the page is in the browser, so the server's page and the browser's first match;
  // then checked (a browser without Web Audio drops the prompt and runs the film silent).
  const available = useSyncExternalStore(noSubscribe, hasWebAudio, assumeWebAudio);
  const fetched = useRef(new Map<SoundSlot, Promise<ArrayBuffer | null>>());
  const ownedKey = owned.join(' ');

  // The owner's files, fetched once, as soon as the page opens.
  useEffect(() => {
    if (!ownedKey || typeof fetch !== 'function') return;
    for (const slot of ownedKey.split(' ') as SoundSlot[]) {
      if (fetched.current.has(slot)) continue;
      fetched.current.set(
        slot,
        fetch(soundSrc(slot))
          .then((r) => (r.ok ? r.arrayBuffer() : null))
          .catch(() => null),
      );
    }
  }, [ownedKey]);

  const stop = useCallback(() => {
    engineRef.current?.stop();
    engineRef.current = null;
  }, []);

  const begin = useCallback((elapsed: number, startAt: number, hourAt: number, endAt?: number) => {
    stop();
    const Ctor = audioContextClass();
    if (!Ctor) return;
    let engine: ArmisticeSound | null = null;
    try {
      engine = new ArmisticeSound(Ctor);
      engineRef.current = engine;
      if (mutedRef.current) engine.setMuted(true);
      const e = engine;
      const files: SlotFiles = {};
      fetched.current.forEach((data, slot) => {
        files[slot] = data.then((d) => (d ? e.decode(d) : null));
      });
      engine.play(elapsed, startAt, hourAt, endAt, files);
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
