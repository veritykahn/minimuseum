/*
 * The walk's steps, made here with Web Audio: no recordings, so nothing to
 * license. The floor is covered with cast-iron faces, and as a foot comes
 * down they knock against each other: a few small, quick hits, one after
 * another (two to four, never the same twice), each a short metallic ring
 * (a few inharmonic tones, as a struck iron plate rings, dying away fast)
 * with a soft click at its start, all of it heard in a large, bare hall (a
 * quiet echo). Quiet throughout, and softened at the top, so it is never
 * harsh. Silent until the visitor turns the sound on; the audio only starts
 * from their own press, as browsers ask.
 */

/** A small cast-iron plate's partials, as ratios of its lowest tone (inharmonic, as a plate's are). */
export const PLATE = [1, 1.59, 2.14, 2.92, 3.61, 4.83];

/** How many pieces of iron knock together at one step: two to four. */
export function hitsForStep(rand: () => number = Math.random): number {
  return 2 + Math.floor(rand() * 3);
}

export type Footsteps = { step: (side: number) => void; close: () => void };

export function makeFootsteps(): Footsteps | null {
  const Ctx = typeof window !== 'undefined' ? window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext : undefined;
  if (!Ctx) return null;
  const ctx = new Ctx();
  // Softened at the top: nothing sharp.
  const soften = ctx.createBiquadFilter();
  soften.type = 'lowpass';
  soften.frequency.value = 4200;
  soften.Q.value = 0.5;
  const master = ctx.createGain();
  master.gain.value = 0.26;
  soften.connect(master).connect(ctx.destination);

  // The hall: one echo, darkened, fed back a little.
  const delay = ctx.createDelay(1);
  delay.delayTime.value = 0.24;
  const feedback = ctx.createGain();
  feedback.gain.value = 0.32;
  const dark = ctx.createBiquadFilter();
  dark.type = 'lowpass';
  dark.frequency.value = 1600;
  const wet = ctx.createGain();
  wet.gain.value = 0.4;
  delay.connect(dark).connect(feedback).connect(delay);
  dark.connect(wet).connect(soften);

  const noise = ctx.createBuffer(1, Math.round(ctx.sampleRate * 0.04), ctx.sampleRate);
  const data = noise.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 3);

  const out = (pan: number) => {
    const p = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    const g = ctx.createGain();
    if (p) {
      p.pan.value = Math.max(-1, Math.min(1, pan));
      g.connect(p);
      p.connect(soften);
      p.connect(delay);
    } else {
      g.connect(soften);
      g.connect(delay);
    }
    return g;
  };

  /** One piece of iron knocking on another. */
  const clank = (at: number, level: number, base: number, pan: number) => {
    const bus = out(pan);
    // The click of the touch.
    const src = ctx.createBufferSource();
    src.buffer = noise;
    const band = ctx.createBiquadFilter();
    band.type = 'bandpass';
    band.frequency.value = 2200 + Math.random() * 1200;
    band.Q.value = 1.2;
    const sg = ctx.createGain();
    sg.gain.setValueAtTime(0.28 * level, at);
    sg.gain.exponentialRampToValueAtTime(0.0001, at + 0.03);
    src.connect(band).connect(sg).connect(bus);
    src.start(at);
    src.stop(at + 0.045);
    // The iron ringing, briefly; the higher tones die first.
    PLATE.forEach((ratio, i) => {
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.value = base * ratio * (1 + (Math.random() - 0.5) * 0.02);
      const g = ctx.createGain();
      const peak = (0.075 * level) / (1 + i * 0.8);
      const decay = (0.22 + Math.random() * 0.12) / (1 + i * 0.45);
      g.gain.setValueAtTime(0.0001, at);
      g.gain.exponentialRampToValueAtTime(peak, at + 0.003);
      g.gain.exponentialRampToValueAtTime(0.0001, at + decay);
      o.connect(g).connect(bus);
      o.start(at);
      o.stop(at + decay + 0.03);
    });
  };

  /** The weight of the step, dull, under the iron. */
  const thud = (at: number, level: number, pan: number) => {
    const bus = out(pan);
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(110, at);
    o.frequency.exponentialRampToValueAtTime(55, at + 0.12);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(0.32 * level, at + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, at + 0.16);
    o.connect(g).connect(bus);
    o.start(at);
    o.stop(at + 0.2);
  };

  return {
    step(side: number) {
      if (ctx.state === 'suspended') void ctx.resume();
      const at = ctx.currentTime + 0.02;
      const pan = side * 0.2;
      thud(at, 1, pan);
      // Two to four faces knock together, one after another, each its own size.
      const hits = hitsForStep();
      let t = at + 0.004;
      for (let h = 0; h < hits; h++) {
        const base = 520 + Math.random() * 520;
        clank(t, h === 0 ? 1 : 0.4 + Math.random() * 0.4, base, pan + (Math.random() - 0.5) * 0.3);
        t += 0.035 + Math.random() * 0.09;
      }
    },
    close() {
      void ctx.close();
    },
  };
}
