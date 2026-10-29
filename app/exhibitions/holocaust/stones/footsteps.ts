/*
 * The walk's footsteps, made here with Web Audio: no recordings, so nothing
 * to license. A step on loose, flat stones: a low thud of the heel, the
 * hard knock of stone on stone, the stone ringing briefly (a few
 * inharmonic tones, as a struck slab rings, dying away), and the toe a
 * moment later, tipping the stone beside it; all of it heard in a large,
 * bare room (a quiet echo).
 * Quiet throughout, and silent until the visitor turns the sound on; the
 * audio only starts from their own press, as browsers ask.
 */

/** A struck slab's partials, as ratios of its lowest tone. */
const SLAB = [1, 2.32, 4.25, 6.63, 9.38];

export type Footsteps = { step: (side: number) => void; close: () => void };

export function makeFootsteps(): Footsteps | null {
  const Ctx = typeof window !== 'undefined' ? window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext : undefined;
  if (!Ctx) return null;
  const ctx = new Ctx();
  const master = ctx.createGain();
  master.gain.value = 0.32;
  master.connect(ctx.destination);

  // The room: one echo, darkened, fed back a little.
  const delay = ctx.createDelay(1);
  delay.delayTime.value = 0.21;
  const feedback = ctx.createGain();
  feedback.gain.value = 0.3;
  const dark = ctx.createBiquadFilter();
  dark.type = 'lowpass';
  dark.frequency.value = 1800;
  const wet = ctx.createGain();
  wet.gain.value = 0.42;
  delay.connect(dark).connect(feedback).connect(delay);
  dark.connect(wet).connect(master);

  const noise = ctx.createBuffer(1, Math.round(ctx.sampleRate * 0.08), ctx.sampleRate);
  const data = noise.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 2);

  const out = (pan: number) => {
    const p = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    const g = ctx.createGain();
    if (p) {
      p.pan.value = pan;
      g.connect(p);
      p.connect(master);
      p.connect(delay);
    } else {
      g.connect(master);
      g.connect(delay);
    }
    return g;
  };

  const strike = (at: number, level: number, base: number, pan: number) => {
    const bus = out(pan);
    // The hard edge of the strike.
    const src = ctx.createBufferSource();
    src.buffer = noise;
    const band = ctx.createBiquadFilter();
    band.type = 'bandpass';
    band.frequency.value = 2400 + Math.random() * 1400;
    band.Q.value = 0.9;
    const sg = ctx.createGain();
    sg.gain.setValueAtTime(0.5 * level, at);
    sg.gain.exponentialRampToValueAtTime(0.0001, at + 0.07);
    src.connect(band).connect(sg).connect(bus);
    src.start(at);
    src.stop(at + 0.09);
    // The stone ringing, briefly.
    SLAB.forEach((ratio, i) => {
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.value = base * ratio * (1 + (Math.random() - 0.5) * 0.012);
      const g = ctx.createGain();
      const peak = (0.11 * level) / (1 + i * 0.9);
      const decay = 0.5 / (1 + i * 0.6);
      g.gain.setValueAtTime(0.0001, at);
      g.gain.exponentialRampToValueAtTime(peak, at + 0.004);
      g.gain.exponentialRampToValueAtTime(0.0001, at + decay);
      o.connect(g).connect(bus);
      o.start(at);
      o.stop(at + decay + 0.05);
    });
  };

  const thud = (at: number, level: number, pan: number) => {
    const bus = out(pan);
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(82, at);
    o.frequency.exponentialRampToValueAtTime(44, at + 0.16);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(0.55 * level, at + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, at + 0.22);
    o.connect(g).connect(bus);
    o.start(at);
    o.stop(at + 0.25);
  };

  return {
    step(side: number) {
      if (ctx.state === 'suspended') void ctx.resume();
      const at = ctx.currentTime + 0.02;
      const pan = side * 0.18;
      const base = 420 + Math.random() * 200;
      thud(at, 1, pan);
      strike(at + 0.008, 1, base, pan);
      // The toe, on the stone beside it.
      strike(at + 0.1 + Math.random() * 0.04, 0.45, base * (1.18 + Math.random() * 0.2), pan * 1.4);
    },
    close() {
      void ctx.close();
    },
  };
}
