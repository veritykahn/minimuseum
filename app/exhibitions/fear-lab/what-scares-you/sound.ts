import { SOUND_SLOTS, ownsSound, soundUrl, type OwnedAssets, type SoundSlot } from './assets';

/*
 * The lab's sounds. Sound is off until the visitor turns it on, and the
 * context is only made on that click, as browsers require. Nothing is
 * recorded, and no camera or microphone is used.
 *
 *   the bed     a low, slow drone that loops for as long as sound is on: two
 *               detuned tones and a breath of air, with a high, uneasy note
 *               that comes and goes. `tension` (0–1) opens its filter and
 *               brings in a rub a semitone up, so it builds as the boxes
 *               creak and the bushes rustle.
 *   effects     every effect is a named slot (assets.ts). If the owner has
 *               dropped in a file for the slot (`owned`, read from disk when
 *               the page was built), that file plays; until then, it is
 *               made here, in the browser (Web Audio). No other file is
 *               asked for.
 *   gentle      gentle mode turns every effect down by about half, and
 *               swaps the scare's stinger for a soft “uh-oh”.
 *
 * Each effect is short and quiet enough to sit over the bed; none is a
 * sudden loud bang.
 */

export type Creature = 'cockroach' | 'tarantula' | 'bat' | 'snake' | 'rat' | 'centipede';

export type LabSound = {
  /** One heartbeat, "lub-dub"; louder as `strength` (0–1) rises. */
  beat: (strength?: number) => void;
  /** How tense the music is, 0 (calm) to 1. */
  tension: (t: number) => void;
  /** Play a named effect: the owner's file if there is one, else the lab's own. `length` is in seconds, for the creak. */
  play: (slot: SoundSlot, opts?: { length?: number }) => void;
  /** The wind over the bushes, on or off. */
  wind: (on: boolean) => void;
  /** Gentle mode: softer, milder effects. */
  setGentle: (gentle: boolean) => void;
  close: () => void;
};

/** The slot for each creature's own sound. */
export const creatureSlot = (c: Creature): SoundSlot => `creature-${c}`;

export function createLabSound(gentleAtStart = false, ownedFiles: OwnedAssets = []): LabSound | null {
  const AC = typeof window !== 'undefined' ? window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext : undefined;
  if (!AC) return null;
  const ctx = new AC();
  const master = ctx.createGain();
  master.gain.value = 0.6;
  // A soft limiter, so stacked effects never clip.
  const limit = ctx.createDynamicsCompressor();
  limit.threshold.value = -10;
  limit.ratio.value = 8;
  master.connect(limit).connect(ctx.destination);
  // Every effect runs through here, so gentle mode can turn them all down.
  let gentle = gentleAtStart;
  const fx = ctx.createGain();
  fx.gain.value = gentle ? 0.45 : 1;
  fx.connect(master);
  const wake = () => {
    if (ctx.state === 'suspended') void ctx.resume();
  };

  // The owner's files, fetched once sound is on; any slot without one is made here.
  const owned = new Map<SoundSlot, AudioBuffer>();
  let closed = false;
  (Object.keys(SOUND_SLOTS) as SoundSlot[])
    .filter((slot) => ownsSound(ownedFiles, slot))
    .forEach((slot) => {
      void (async () => {
        try {
          const data = await (await fetch(soundUrl(slot))).arrayBuffer();
          if (closed) return;
          const buf = await new Promise<AudioBuffer>((res, rej) => ctx.decodeAudioData(data, res, rej));
          owned.set(slot, buf);
        } catch {
          // A file that will not load or decode: the lab's own sound stays.
        }
      })();
    });
  const playOwned = (slot: SoundSlot) => {
    const buf = owned.get(slot);
    if (!buf) return false;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(fx);
    src.start(ctx.currentTime + 0.01);
    return true;
  };

  // Two seconds of white noise, shared by every noisy sound.
  const white = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  {
    const d = white.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  const noiseSource = (loop = false) => {
    const src = ctx.createBufferSource();
    src.buffer = white;
    src.loop = loop;
    return src;
  };

  const thud = (at: number, freq: number, level: number, length = 0.16) => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(freq * 1.6, at);
    o.frequency.exponentialRampToValueAtTime(freq, at + 0.05);
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(level, at + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, at + length);
    o.connect(g).connect(fx);
    o.start(at);
    o.stop(at + length + 0.02);
  };

  /** A burst of filtered noise. */
  const burst = (at: number, length: number, level: number, type: BiquadFilterType, freq: number, q = 0.7, attack = 0.005, to?: number) => {
    const src = noiseSource();
    const f = ctx.createBiquadFilter();
    f.type = type;
    f.frequency.setValueAtTime(freq, at);
    if (to) f.frequency.exponentialRampToValueAtTime(to, at + length);
    f.Q.value = q;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(level, at + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, at + length);
    src.connect(f).connect(g).connect(fx);
    src.start(at, Math.random());
    src.stop(at + length + 0.05);
  };

  /** A plain tone with a quick rise and a long fall. */
  const tone = (at: number, freq: number, length: number, level: number, type: OscillatorType = 'sine', glideTo?: number, attack = 0.01) => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, at);
    if (glideTo) o.frequency.exponentialRampToValueAtTime(glideTo, at + length);
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(level, at + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, at + length);
    o.connect(g).connect(fx);
    o.start(at);
    o.stop(at + length + 0.05);
    return o;
  };

  /** Tiny dry clicks of legs on wood. */
  const skitter = (at: number, n: number, span: number, freq: number, level = 0.12) => {
    for (let i = 0; i < n; i++) burst(at + Math.random() * span, 0.012 + Math.random() * 0.01, level + Math.random() * 0.1, 'highpass', freq, 1, 0.001);
  };

  // ───── The bed ─────
  const bed = ctx.createGain();
  bed.gain.value = 0.0001;
  const bedFilter = ctx.createBiquadFilter();
  bedFilter.type = 'lowpass';
  bedFilter.frequency.value = 260;
  bedFilter.Q.value = 2;
  bedFilter.connect(bed).connect(master);
  const tones = [
    { f: 55, type: 'sawtooth' as OscillatorType, level: 0.16 },
    { f: 55.4, type: 'sawtooth' as OscillatorType, level: 0.16 },
    { f: 82.4, type: 'triangle' as OscillatorType, level: 0.12 },
  ].map(({ f, type, level }) => {
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.value = f;
    const g = ctx.createGain();
    g.gain.value = level;
    o.connect(g).connect(bedFilter);
    o.start();
    return o;
  });
  // The rub: a semitone above the root, silent until the tension rises.
  const rub = ctx.createOscillator();
  rub.type = 'sawtooth';
  rub.frequency.value = 58.3;
  const rubGain = ctx.createGain();
  rubGain.gain.value = 0;
  rub.connect(rubGain).connect(bedFilter);
  rub.start();
  // A slow swell in the filter, so the drone breathes.
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.07;
  const lfoDepth = ctx.createGain();
  lfoDepth.gain.value = 90;
  lfo.connect(lfoDepth).connect(bedFilter.frequency);
  lfo.start();
  // Air: noise, low and quiet.
  const air = noiseSource(true);
  const airFilter = ctx.createBiquadFilter();
  airFilter.type = 'bandpass';
  airFilter.frequency.value = 500;
  airFilter.Q.value = 0.6;
  const airGain = ctx.createGain();
  airGain.gain.value = 0.05;
  air.connect(airFilter).connect(airGain).connect(bed);
  air.start();
  bed.gain.setTargetAtTime(gentle ? 0.3 : 0.55, ctx.currentTime, 1.2);

  // Now and then, a high uneasy note, drifting.
  let glassTimer: ReturnType<typeof setTimeout>;
  const glass = () => {
    const at = ctx.currentTime + 0.05;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    const f = [622, 659, 740, 784][Math.floor(Math.random() * 4)];
    o.frequency.setValueAtTime(f, at);
    o.frequency.linearRampToValueAtTime(f * 0.985, at + 5);
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(0.025, at + 2);
    g.gain.exponentialRampToValueAtTime(0.0001, at + 5.5);
    o.connect(g).connect(bed);
    o.start(at);
    o.stop(at + 6);
    glassTimer = setTimeout(glass, 7000 + Math.random() * 9000);
  };
  glassTimer = setTimeout(glass, 3000);

  // ───── The lab's own effects, one per slot ─────
  const made: Record<SoundSlot, (length: number) => void> = {
    creak(length) {
      // A creak is friction: a fast, uneven train of clicks through a hollow,
      // wooden resonance, slowing and speeding as the hinge turns.
      const at = ctx.currentTime + 0.02;
      const o = ctx.createOscillator();
      o.type = 'square';
      o.frequency.setValueAtTime(38, at);
      o.frequency.linearRampToValueAtTime(70, at + length * 0.35);
      o.frequency.linearRampToValueAtTime(30, at + length * 0.7);
      o.frequency.linearRampToValueAtTime(52, at + length);
      const body = ctx.createBiquadFilter();
      body.type = 'bandpass';
      body.frequency.setValueAtTime(700, at);
      body.frequency.linearRampToValueAtTime(1100, at + length);
      body.Q.value = 9;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, at);
      g.gain.exponentialRampToValueAtTime(0.32, at + 0.12);
      g.gain.setValueAtTime(0.32, at + length * 0.8);
      g.gain.exponentialRampToValueAtTime(0.0001, at + length);
      o.connect(body).connect(g).connect(fx);
      o.start(at);
      o.stop(at + length + 0.05);
    },
    'lid-close'() {
      const at = ctx.currentTime + 0.01;
      thud(at, 70, 0.5, 0.22);
      burst(at, 0.12, 0.15, 'bandpass', 900, 2);
    },
    harmless() {
      // A warm, rising chime: a major arpeggio, softly struck.
      const at = ctx.currentTime + 0.02;
      [523.3, 659.3, 784, 1046.5].forEach((f, i) => tone(at + i * 0.12, f, 1.4, 0.08, 'sine'));
      tone(at, 261.6, 1.6, 0.05, 'triangle');
    },
    empty() {
      burst(ctx.currentTime + 0.02, 1.6, 0.1, 'bandpass', 300, 0.8, 0.5, 180);
    },
    scary() {
      const at = ctx.currentTime + 0.01;
      if (gentle) {
        // An "uh-oh": two soft notes, falling.
        tone(at, 392, 0.3, 0.12, 'triangle');
        tone(at + 0.28, 311, 0.5, 0.12, 'triangle');
        return;
      }
      // The rush: air rising fast.
      burst(at, 0.45, 0.4, 'bandpass', 400, 0.9, 0.2, 3800);
      // The stinger: a tight, dissonant cluster, struck once.
      [233, 247, 277, 330, 349].forEach((f, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = i % 2 ? 'sawtooth' : 'square';
        o.frequency.value = f;
        const lp = ctx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.setValueAtTime(3200, at + 0.18);
        lp.frequency.exponentialRampToValueAtTime(500, at + 1.3);
        g.gain.setValueAtTime(0.0001, at + 0.17);
        g.gain.exponentialRampToValueAtTime(0.07, at + 0.19);
        g.gain.exponentialRampToValueAtTime(0.0001, at + 1.4);
        o.connect(lp).connect(g).connect(fx);
        o.start(at + 0.17);
        o.stop(at + 1.5);
      });
      thud(at + 0.17, 44, 0.8, 0.6);
    },
    spiders() {
      // Lots of little legs, spreading out: dense at first, thinning.
      const at = ctx.currentTime + 0.2;
      if (gentle) skitter(at, 24, 4, 2400, 0.05);
      else {
        skitter(at, 90, 1.6, 3000);
        skitter(at + 1.4, 60, 2.4, 3400, 0.08);
      }
    },
    'creature-cockroach'() {
      skitter(ctx.currentTime + 0.25, 30, 0.9, 3200);
    },
    'creature-tarantula'() {
      skitter(ctx.currentTime + 0.25, 16, 1.1, 1800);
    },
    'creature-centipede'() {
      skitter(ctx.currentTime + 0.25, 46, 0.9, 3200);
    },
    'creature-snake'() {
      const at = ctx.currentTime + 0.25;
      burst(at, 1.4, 0.22, 'highpass', 4200, 0.5, 0.15);
      burst(at + 0.05, 1.3, 0.08, 'bandpass', 7000, 1.2, 0.2);
    },
    'creature-bat'() {
      const at = ctx.currentTime + 0.25;
      for (let i = 0; i < 7; i++) burst(at + i * 0.13, 0.09, 0.35, 'lowpass', 900, 0.8, 0.01, 300);
    },
    'creature-rat'() {
      const at = ctx.currentTime + 0.25;
      [0, 0.22, 0.36].forEach((d, i) => {
        const o = tone(at + d, 3200 + i * 300, 0.13, 0.06, 'sine');
        o.frequency.exponentialRampToValueAtTime(4600 + i * 200, at + d + 0.06);
        o.frequency.exponentialRampToValueAtTime(3600, at + d + 0.12);
      });
      skitter(at + 0.5, 14, 0.5, 2600, 0.1);
    },
    slime() {
      // A wet splat (a thump of low, muffled noise), then a slow, bubbly slurp as it slides.
      const at = ctx.currentTime + 0.01;
      thud(at, 90, 0.45, 0.2);
      burst(at, 0.28, 0.4, 'lowpass', 1400, 2, 0.004, 220);
      for (let i = 0; i < 7; i++) {
        const t = at + 0.35 + i * 0.16 + Math.random() * 0.06;
        tone(t, 180 + Math.random() * 120, 0.12, 0.08, 'sine', 420 + Math.random() * 200, 0.01);
      }
      burst(at + 0.4, 1.3, 0.1, 'bandpass', 500, 3, 0.3, 260);
    },
    confetti() {
      // A party popper: one bright pop, then a patter of paper falling.
      const at = ctx.currentTime + 0.01;
      burst(at, 0.09, 0.5, 'highpass', 900, 0.7, 0.002);
      thud(at, 120, 0.35, 0.1);
      for (let i = 0; i < 40; i++) burst(at + 0.15 + Math.random() * 1.6, 0.015, 0.05 + Math.random() * 0.05, 'bandpass', 3000 + Math.random() * 3000, 2, 0.002);
      [784, 988, 1175].forEach((f, i) => tone(at + 0.12 + i * 0.07, f, 0.5, 0.05, 'triangle'));
    },
    boing() {
      // A spring: a low note that swoops up and wobbles, slowing as it settles.
      const at = ctx.currentTime + 0.01;
      const o = tone(at, 110, 1.3, 0.2, 'triangle', 330, 0.01);
      const wob = ctx.createOscillator();
      wob.frequency.setValueAtTime(14, at);
      wob.frequency.linearRampToValueAtTime(6, at + 1.3);
      const depth = ctx.createGain();
      depth.gain.setValueAtTime(90, at);
      depth.gain.exponentialRampToValueAtTime(4, at + 1.3);
      wob.connect(depth).connect(o.frequency);
      wob.start(at);
      wob.stop(at + 1.4);
    },
    squeak() {
      // A rubber chicken: a squeezed, nasal squawk, rising, twice.
      const at = ctx.currentTime + 0.01;
      [0, 0.42].forEach((d, i) => {
        const t = at + d;
        const o = ctx.createOscillator();
        o.type = 'sawtooth';
        o.frequency.setValueAtTime(700 + i * 80, t);
        o.frequency.exponentialRampToValueAtTime(1500 + i * 120, t + 0.12);
        o.frequency.exponentialRampToValueAtTime(1100, t + 0.3);
        const nose = ctx.createBiquadFilter();
        nose.type = 'bandpass';
        nose.frequency.value = 1800;
        nose.Q.value = 3;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.22, t + 0.03);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.32);
        o.connect(nose).connect(g).connect(fx);
        o.start(t);
        o.stop(t + 0.35);
      });
    },
    bubbles() {
      // Little plips, each a quick upward chirp, here and there.
      const at = ctx.currentTime + 0.05;
      for (let i = 0; i < 14; i++) {
        const t = at + Math.random() * 2;
        const f = 500 + Math.random() * 700;
        tone(t, f, 0.06, 0.09, 'sine', f * 2.4, 0.004);
      }
    },
    feather() {
      // A soft, airy whoosh, and a gentle twinkle as it lands.
      const at = ctx.currentTime + 0.02;
      burst(at, 2.2, 0.08, 'bandpass', 900, 0.8, 0.8, 500);
      [1318.5, 1568, 2093].forEach((f, i) => tone(at + 1.6 + i * 0.14, f, 0.9, 0.035, 'sine'));
    },
    zap() {
      // A buzz with a crackle on top.
      const at = ctx.currentTime + 0.01;
      tone(at, 120, 0.35, 0.12, 'sawtooth', 90, 0.005);
      tone(at, 181, 0.3, 0.06, 'square', 140, 0.005);
      for (let i = 0; i < 8; i++) burst(at + Math.random() * 0.3, 0.02, 0.2, 'highpass', 2500, 1, 0.001);
    },
    'big-zap'() {
      const at = ctx.currentTime + 0.01;
      tone(at, 90, 0.8, 0.16, 'sawtooth', 55, 0.005);
      tone(at, 136, 0.7, 0.08, 'square', 80, 0.005);
      for (let i = 0; i < 20; i++) burst(at + Math.random() * 0.7, 0.025, 0.24, 'highpass', 2000, 1, 0.001);
      thud(at, 50, 0.5, 0.4);
    },
    clock() {
      const at = ctx.currentTime + 0.02;
      for (let i = 0; i < 6; i++) burst(at + i * 0.4, 0.03, i % 2 ? 0.14 : 0.2, 'bandpass', i % 2 ? 2200 : 2800, 6, 0.001);
    },
    dread() {
      const at = ctx.currentTime + 0.01;
      [110, 116.5, 164.8].forEach((f) => tone(at, f, 2.4, 0.06, 'triangle', undefined, 1.2));
    },
    skitter() {
      skitter(ctx.currentTime + 0.05, 18, 0.8, 2200);
    },
    marbles() {
      const at = ctx.currentTime + 0.02;
      for (let i = 0; i < 9; i++) tone(at + i * 0.07 + Math.random() * 0.05, 2400 + Math.random() * 1800, 0.18, 0.05, 'sine');
    },
    ghost() {
      // A friendly "oooo", wobbling.
      const at = ctx.currentTime + 0.02;
      const o = tone(at, 440, 1.8, 0.07, 'sine', 330, 0.4);
      const wob = ctx.createOscillator();
      wob.frequency.value = 5;
      const depth = ctx.createGain();
      depth.gain.value = 12;
      wob.connect(depth).connect(o.frequency);
      wob.start(at);
      wob.stop(at + 1.9);
    },
    haunt() {
      const at = ctx.currentTime + 0.01;
      [73.4, 87.3, 103.8, 110].forEach((f) => tone(at, f, 2.2, 0.06, 'sawtooth', undefined, 0.05));
      thud(at, 40, 0.8, 0.6);
    },
    quiet() {
      tone(ctx.currentTime + 0.02, 120, 2.2, 0.03, 'sine', undefined, 0.8);
    },
    tick() {
      burst(ctx.currentTime + 0.01, 0.04, 0.2, 'bandpass', 1800, 4, 0.001);
    },
    rustle() {
      // Leaves: many short crackles over a soft brush of noise.
      const at = ctx.currentTime + 0.01;
      burst(at, 0.8, 0.12, 'bandpass', 2400, 0.7, 0.06);
      for (let i = 0; i < 18; i++) burst(at + Math.random() * 0.7, 0.03, 0.1, 'bandpass', 3000 + Math.random() * 2000, 2, 0.002);
    },
    growl() {
      // Very low and quiet: a rumble you might just catch.
      const at = ctx.currentTime + 0.02;
      const o = tone(at, 62, 1.2, 0.18, 'sawtooth', 55, 0.3);
      const flutter = ctx.createOscillator();
      flutter.frequency.value = 23;
      const depth = ctx.createGain();
      depth.gain.value = 8;
      flutter.connect(depth).connect(o.frequency);
      flutter.start(at);
      flutter.stop(at + 1.3);
      burst(at, 1.1, 0.06, 'lowpass', 300, 1, 0.3);
    },
    gust() {
      burst(ctx.currentTime + 0.02, 1.3, 0.16, 'bandpass', 500, 1.2, 0.5, 1400);
    },
    startle() {
      const t = ctx.currentTime + 0.01;
      thud(t, 40, 0.9, 0.5);
      burst(t, 0.25, 0.12, 'bandpass', 600);
    },
  };

  // ───── The wind ─────
  let windNodes: { src: AudioBufferSourceNode; g: GainNode; lfo: OscillatorNode } | null = null;

  return {
    beat(strength = 0.4) {
      wake();
      const t = ctx.currentTime + 0.01;
      const level = 0.25 + strength * 0.55;
      thud(t, 52, level);
      thud(t + 0.17, 46, level * 0.7);
    },
    tension(t) {
      const k = Math.max(0, Math.min(1, t));
      const now = ctx.currentTime;
      bedFilter.frequency.setTargetAtTime(240 + k * 900, now, 0.6);
      rubGain.gain.setTargetAtTime(k * 0.14, now, 0.6);
      airGain.gain.setTargetAtTime(0.05 + k * 0.08, now, 0.6);
      tones.forEach((o, i) => o.detune.setTargetAtTime(k * (i === 1 ? 18 : 0), now, 0.8));
    },
    play(slot, opts) {
      wake();
      if (playOwned(slot)) return;
      made[slot](opts?.length ?? 1.6);
    },
    wind(on) {
      if (on && !windNodes) {
        wake();
        const src = noiseSource(true);
        const f = ctx.createBiquadFilter();
        f.type = 'bandpass';
        f.frequency.value = 420;
        f.Q.value = 1.4;
        const l = ctx.createOscillator();
        l.frequency.value = 0.13;
        const depth = ctx.createGain();
        depth.gain.value = 260;
        l.connect(depth).connect(f.frequency);
        const g = ctx.createGain();
        g.gain.value = 0.0001;
        src.connect(f).connect(g).connect(fx);
        src.start();
        l.start();
        g.gain.setTargetAtTime(0.16, ctx.currentTime, 1.5);
        windNodes = { src, g, lfo: l };
      } else if (!on && windNodes) {
        const w = windNodes;
        windNodes = null;
        w.g.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.5);
        w.src.stop(ctx.currentTime + 2.5);
        w.lfo.stop(ctx.currentTime + 2.5);
      }
    },
    setGentle(g) {
      gentle = g;
      fx.gain.setTargetAtTime(g ? 0.45 : 1, ctx.currentTime, 0.1);
      bed.gain.setTargetAtTime(g ? 0.3 : 0.55, ctx.currentTime, 0.5);
    },
    close() {
      closed = true;
      clearTimeout(glassTimer);
      void ctx.close();
    },
  };
}
