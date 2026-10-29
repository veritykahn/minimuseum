/*
 * The lab's sounds, all made in the browser (Web Audio): nothing is loaded
 * or recorded, so there are no recordings to license. Sound is off until the
 * visitor turns it on, and the context is only made on that click, as
 * browsers require.
 *
 *   the bed     a low, slow drone that loops for as long as sound is on: two
 *               detuned tones and a breath of air, with a high, uneasy note
 *               that comes and goes. `tension` (0–1) opens its filter and
 *               brings in a rub a semitone up, so it builds as the boxes
 *               creak and the bushes rustle.
 *   effects     a heartbeat, a creak, a skitter, a hiss, wing flaps, a
 *               squeak, the rush and stinger of a jump, a rustle in the
 *               leaves, the wind over the bushes, the thump of a startle, a
 *               swell of dread and a soft tick.
 *
 * Each effect is short and quiet enough to sit over the bed; none is a
 * sudden loud bang. The list of sounds that would be better recorded is in
 * the room's asset list.
 */

export type Creature = 'cockroach' | 'tarantula' | 'bat' | 'snake' | 'rat' | 'centipede';

export type LabSound = {
  /** One heartbeat, "lub-dub"; louder as `strength` (0–1) rises. */
  beat: (strength?: number) => void;
  /** How tense the music is, 0 (calm) to 1. */
  tension: (t: number) => void;
  /** A lid or door creaking open, over `length` seconds. */
  creak: (length?: number) => void;
  /** The jump: a rush of air and a stinger. */
  jump: () => void;
  /** Each creature's own sound, as it appears. */
  creature: (c: Creature) => void;
  rustle: () => void;
  /** The wind over the bushes, on or off. */
  wind: (on: boolean) => void;
  thump: () => void;
  /** A slow swell of dread. */
  swell: () => void;
  tick: () => void;
  close: () => void;
};

export function createLabSound(): LabSound | null {
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
  const wake = () => {
    if (ctx.state === 'suspended') void ctx.resume();
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
    o.connect(g).connect(master);
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
    src.connect(f).connect(g).connect(master);
    src.start(at, Math.random());
    src.stop(at + length + 0.05);
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
  bed.gain.setTargetAtTime(0.55, ctx.currentTime, 1.2);

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
    creak(length = 1.6) {
      wake();
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
      o.connect(body).connect(g).connect(master);
      o.start(at);
      o.stop(at + length + 0.05);
    },
    jump() {
      wake();
      const at = ctx.currentTime + 0.01;
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
        o.connect(lp).connect(g).connect(master);
        o.start(at + 0.17);
        o.stop(at + 1.5);
      });
      thud(at + 0.17, 44, 0.8, 0.6);
    },
    creature(c) {
      wake();
      const at = ctx.currentTime + 0.25;
      if (c === 'cockroach' || c === 'centipede' || c === 'tarantula') {
        // A skitter: tiny, dry clicks of legs on wood.
        const n = c === 'centipede' ? 46 : c === 'cockroach' ? 30 : 16;
        const span = c === 'tarantula' ? 1.1 : 0.9;
        for (let i = 0; i < n; i++) {
          const t = at + Math.random() * span;
          burst(t, 0.012 + Math.random() * 0.01, 0.12 + Math.random() * 0.1, 'highpass', c === 'tarantula' ? 1800 : 3200, 1, 0.001);
        }
      } else if (c === 'snake') {
        // A hiss.
        burst(at, 1.4, 0.22, 'highpass', 4200, 0.5, 0.15);
        burst(at + 0.05, 1.3, 0.08, 'bandpass', 7000, 1.2, 0.2);
      } else if (c === 'bat') {
        // Wing flaps, soft and quick.
        for (let i = 0; i < 7; i++) burst(at + i * 0.13, 0.09, 0.35, 'lowpass', 900, 0.8, 0.01, 300);
      } else if (c === 'rat') {
        // Squeaks: short, high chirps.
        [0, 0.22, 0.36].forEach((d, i) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          const t = at + d;
          o.type = 'sine';
          o.frequency.setValueAtTime(3200 + i * 300, t);
          o.frequency.exponentialRampToValueAtTime(4600 + i * 200, t + 0.06);
          o.frequency.exponentialRampToValueAtTime(3600, t + 0.12);
          g.gain.setValueAtTime(0.0001, t);
          g.gain.exponentialRampToValueAtTime(0.06, t + 0.01);
          g.gain.exponentialRampToValueAtTime(0.0001, t + 0.13);
          o.connect(g).connect(master);
          o.start(t);
          o.stop(t + 0.15);
        });
        for (let i = 0; i < 14; i++) burst(at + 0.5 + Math.random() * 0.5, 0.015, 0.1, 'highpass', 2600, 1, 0.001);
      }
    },
    rustle() {
      wake();
      const at = ctx.currentTime + 0.01;
      // Leaves: many short crackles over a soft brush of noise.
      burst(at, 0.8, 0.12, 'bandpass', 2400, 0.7, 0.06);
      for (let i = 0; i < 18; i++) burst(at + Math.random() * 0.7, 0.03, 0.1, 'bandpass', 3000 + Math.random() * 2000, 2, 0.002);
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
        src.connect(f).connect(g).connect(master);
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
    thump() {
      wake();
      const t = ctx.currentTime + 0.01;
      thud(t, 40, 0.9, 0.5);
      burst(t, 0.25, 0.12, 'bandpass', 600);
    },
    swell() {
      wake();
      const at = ctx.currentTime + 0.01;
      [110, 116.5, 164.8].forEach((f) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'triangle';
        o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, at);
        g.gain.exponentialRampToValueAtTime(0.06, at + 1.2);
        g.gain.exponentialRampToValueAtTime(0.0001, at + 2.4);
        o.connect(g).connect(master);
        o.start(at);
        o.stop(at + 2.5);
      });
    },
    tick() {
      wake();
      const at = ctx.currentTime + 0.01;
      burst(at, 0.04, 0.2, 'bandpass', 1800, 4, 0.001);
    },
    close() {
      clearTimeout(glassTimer);
      void ctx.close();
    },
  };
}
