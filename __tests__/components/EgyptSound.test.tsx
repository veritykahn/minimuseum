import { playEgypt, resetEgyptSoundForTests, startTorch } from '@/app/exhibitions/egypt/egyptSound';
import { setMuseumSound } from '@/lib/museumSound';

/*
 * The Egypt rooms' sounds: silent until the museum's sound is on, then made
 * in the browser, and never throwing where there is no Web Audio.
 */

let nodes = 0;
class FakeContext {
  state = 'running';
  currentTime = 0;
  sampleRate = 8000;
  destination = {};
  resume = () => Promise.resolve();
  createBuffer = (_c: number, n: number) => ({ sampleRate: 8000, getChannelData: () => new Float32Array(n) });
  private node = () => {
    nodes++;
    const param = { value: 0, setValueAtTime: jest.fn(), linearRampToValueAtTime: jest.fn(), exponentialRampToValueAtTime: jest.fn() };
    return { gain: param, frequency: param, Q: param, type: '', buffer: null, connect: (n: unknown) => n, start: jest.fn(), stop: jest.fn() };
  };
  createGain = this.node;
  createOscillator = this.node;
  createBiquadFilter = this.node;
  createBufferSource = this.node;
}

beforeEach(() => {
  nodes = 0;
  resetEgyptSoundForTests();
  (window as unknown as { AudioContext: unknown }).AudioContext = FakeContext;
});
afterEach(() => {
  delete (window as unknown as { AudioContext?: unknown }).AudioContext;
});

it('is silent until the museum sound is on', () => {
  expect(playEgypt('chisel')).toBe(false);
  expect(nodes).toBe(0);
});

it('plays every cue once on', () => {
  setMuseumSound(true);
  for (const cue of ['chisel', 'miss', 'grind', 'find', 'creak', 'settle', 'water'] as const) expect(playEgypt(cue)).toBe(true);
  expect(nodes).toBeGreaterThan(0);
});

it('crackles the torch only with sound on, and stops when asked', () => {
  jest.useFakeTimers();
  const stop = startTorch();
  jest.advanceTimersByTime(1000);
  expect(nodes).toBe(0);
  setMuseumSound(true);
  jest.advanceTimersByTime(1000);
  expect(nodes).toBeGreaterThan(0);
  stop();
  const n = nodes;
  jest.advanceTimersByTime(1000);
  expect(nodes).toBe(n);
  jest.useRealTimers();
});

it('stays quiet without Web Audio', () => {
  delete (window as unknown as { AudioContext?: unknown }).AudioContext;
  setMuseumSound(true);
  expect(playEgypt('find')).toBe(false);
});
