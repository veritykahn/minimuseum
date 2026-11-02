import type { Footsteps } from './footsteps';

/*
 * The walk's steps on metal: recorded clanks, one for each footfall, as
 * the visitor's weight comes down on loose iron (the owner's choice of
 * recordings, cut into single clanks: walkSlots.ts finds them). Each
 * footfall takes a clank at random, never the same one twice running, a
 * little higher or lower and a little louder or softer than the last, so
 * no two steps sound alike. Now and then the plate next to it shifts too
 * (a second, quieter clank just after), and every few steps the long,
 * resonant rattle comes in over the clank and rings on under the next.
 * Nothing else: no music, no room tone. Quiet enough to sit beside the
 * words, and only ever started by the visitor's own press, as browsers ask.
 */

/** How often (of footfalls) the resonant rattle overlaps the clank. */
export const RATTLE_CHANCE = 0.3;
/** How often the plate beside it shifts, a moment later. */
export const SHIFT_CHANCE = 0.18;

const between = (lo: number, hi: number) => lo + Math.random() * (hi - lo);

export function makeMetal(clankSrcs: readonly string[], rattleSrc: string | null): Footsteps | null {
  if (!clankSrcs.length) return null;
  const Ctx = typeof window !== 'undefined' ? window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext : undefined;
  if (!Ctx) return null;
  const ctx = new Ctx();
  const master = ctx.createGain();
  master.gain.value = 0.8;
  master.connect(ctx.destination);

  // A little of a large, bare room, so the clanks belong to one place.
  const delay = ctx.createDelay(1);
  delay.delayTime.value = 0.19;
  const feedback = ctx.createGain();
  feedback.gain.value = 0.22;
  const dark = ctx.createBiquadFilter();
  dark.type = 'lowpass';
  dark.frequency.value = 2200;
  const wet = ctx.createGain();
  wet.gain.value = 0.22;
  delay.connect(dark).connect(feedback).connect(delay);
  dark.connect(wet).connect(master);

  const load = async (src: string): Promise<AudioBuffer | null> => {
    try {
      const res = await fetch(src);
      if (!res.ok) return null;
      return await ctx.decodeAudioData(await res.arrayBuffer());
    } catch {
      return null;
    }
  };
  let clanks: AudioBuffer[] = [];
  let rattle: AudioBuffer | null = null;
  void Promise.all(clankSrcs.map(load)).then((bufs) => {
    clanks = bufs.filter((b): b is AudioBuffer => !!b);
  });
  if (rattleSrc) void load(rattleSrc).then((b) => (rattle = b));

  const play = (buf: AudioBuffer, at: number, level: number, rate: number, pan: number) => {
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.playbackRate.value = rate;
    const g = ctx.createGain();
    g.gain.value = level;
    src.connect(g);
    const p = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    const node: AudioNode = p ?? g;
    if (p) {
      p.pan.value = pan;
      g.connect(p);
    }
    node.connect(master);
    node.connect(delay);
    src.start(at);
  };

  let last = -1;
  const pick = () => {
    if (clanks.length === 1) return 0;
    let i = Math.floor(Math.random() * clanks.length);
    if (i === last) i = (i + 1) % clanks.length;
    last = i;
    return i;
  };

  return {
    step(side: number) {
      if (ctx.state === 'suspended') void ctx.resume();
      if (!clanks.length) return;
      const at = ctx.currentTime + 0.01;
      play(clanks[pick()], at, between(0.65, 1), between(0.93, 1.05), side * 0.2);
      if (clanks.length > 1 && Math.random() < SHIFT_CHANCE) {
        play(clanks[pick()], at + between(0.14, 0.3), between(0.22, 0.42), between(1, 1.12), side * 0.35);
      }
      if (rattle && Math.random() < RATTLE_CHANCE) {
        play(rattle, at + between(0.06, 0.35), between(0.35, 0.7), between(0.9, 1.08), -side * 0.25);
      }
    },
    close() {
      void ctx.close();
    },
  };
}
