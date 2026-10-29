/*
 * The lab's sounds, made in the browser (Web Audio): a heartbeat, a rustle
 * in the leaves, and the low thump of a startle. Nothing is loaded or
 * recorded. Sound is off until the visitor turns it on, and the context is
 * only made on that click, as browsers require.
 */

export type LabSound = {
  /** One heartbeat, "lub-dub"; louder as `strength` (0–1) rises. */
  beat: (strength?: number) => void;
  rustle: () => void;
  thump: () => void;
  close: () => void;
};

export function createLabSound(): LabSound | null {
  const AC = typeof window !== 'undefined' ? window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext : undefined;
  if (!AC) return null;
  const ctx = new AC();
  const master = ctx.createGain();
  master.gain.value = 0.6;
  master.connect(ctx.destination);

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

  const noise = (at: number, length: number, level: number, cutoff: number) => {
    const n = Math.floor(ctx.sampleRate * length);
    const buf = ctx.createBuffer(1, n, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (0.5 + 0.5 * Math.sin((i / n) * Math.PI * 9) ** 2);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const f = ctx.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.value = cutoff;
    f.Q.value = 0.7;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(level, at + 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, at + length);
    src.connect(f).connect(g).connect(master);
    src.start(at);
  };

  return {
    beat(strength = 0.4) {
      if (ctx.state === 'suspended') void ctx.resume();
      const t = ctx.currentTime + 0.01;
      const level = 0.25 + strength * 0.55;
      thud(t, 52, level);
      thud(t + 0.17, 46, level * 0.7);
    },
    rustle() {
      if (ctx.state === 'suspended') void ctx.resume();
      noise(ctx.currentTime + 0.01, 0.7, 0.18, 2400);
    },
    thump() {
      if (ctx.state === 'suspended') void ctx.resume();
      const t = ctx.currentTime + 0.01;
      thud(t, 40, 0.9, 0.5);
      noise(t, 0.25, 0.12, 600);
    },
    close() {
      void ctx.close();
    },
  };
}
