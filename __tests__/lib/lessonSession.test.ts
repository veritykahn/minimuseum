import {
  initialSession,
  reduce,
  stepElapsed,
  totalElapsed,
  plannedProgress,
  stepDuration,
  clock,
  spokenRemaining,
  isSession,
  MINUTE,
} from '@/lib/lessons/session';
import { getLesson } from '@/lib/lessons';

const minutes = [5, 4, 4, 4, 22, 6];

describe('lesson session', () => {
  it('starts on the cover, stopped', () => {
    const s = initialSession(6);
    expect(s.index).toBe(-1);
    expect(s.running).toBe(false);
    expect(totalElapsed(s, 1000)).toBe(0);
  });

  it('start runs the clock on step one', () => {
    const s = reduce(initialSession(6), { type: 'start' }, 1000);
    expect(s.index).toBe(0);
    expect(s.running).toBe(true);
    expect(stepElapsed(s, 0, 1000 + 30_000)).toBe(30_000);
  });

  it('pauses and resumes without losing time', () => {
    let s = reduce(initialSession(6), { type: 'start' }, 0);
    s = reduce(s, { type: 'toggle' }, 10_000);
    expect(s.running).toBe(false);
    expect(stepElapsed(s, 0, 99_000)).toBe(10_000);
    s = reduce(s, { type: 'toggle' }, 100_000);
    expect(stepElapsed(s, 0, 105_000)).toBe(15_000);
  });

  it('banks time per step when moving, and keeps it on the way back', () => {
    let s = reduce(initialSession(6), { type: 'start' }, 0);
    s = reduce(s, { type: 'next' }, 60_000);
    expect(s.index).toBe(1);
    expect(stepElapsed(s, 0, 70_000)).toBe(60_000);
    expect(stepElapsed(s, 1, 70_000)).toBe(10_000);
    s = reduce(s, { type: 'prev' }, 70_000);
    expect(stepElapsed(s, 0, 80_000)).toBe(70_000);
    expect(totalElapsed(s, 80_000)).toBe(80_000);
  });

  it('adds a minute to the current step only', () => {
    let s = reduce(initialSession(6), { type: 'start' }, 0);
    s = reduce(s, { type: 'addMinute' }, 1);
    expect(stepDuration(s, minutes, 0)).toBe(6 * MINUTE);
    expect(stepDuration(s, minutes, 1)).toBe(4 * MINUTE);
  });

  it('finishes after the last step and stops the clock', () => {
    let s = reduce(initialSession(6), { type: 'goto', index: 5 }, 0);
    expect(s.running).toBe(true);
    s = reduce(s, { type: 'next' }, 1000);
    expect(s.index).toBe(6);
    expect(s.running).toBe(false);
    expect(plannedProgress(s, minutes, 5000)).toBe(1);
  });

  it('keeps the progress marker inside the current segment when over time', () => {
    const s = reduce(initialSession(6), { type: 'start' }, 0);
    expect(plannedProgress(s, minutes, 10 * MINUTE)).toBeCloseTo(5 / 45);
  });

  it('formats clocks and spoken time', () => {
    expect(clock(65_000)).toBe('1:05');
    expect(clock(-32_000)).toBe('−0:32');
    expect(spokenRemaining(61_000)).toBe('1 minute 1 second left');
    expect(spokenRemaining(-30_000)).toBe('30 seconds over');
  });

  it('recognizes a valid stored session', () => {
    expect(isSession(initialSession(6), 6)).toBe(true);
    expect(isSession(initialSession(5), 6)).toBe(false);
    expect(isSession(null, 6)).toBe(false);
  });
});

describe('exported lesson', () => {
  const lesson = getLesson('in-their-hands', 'whose-image-is-this');

  it('exists and its steps fill the timing bar', () => {
    expect(lesson).toBeDefined();
    const steps = lesson!.steps.reduce((a, s) => a + s.minutes, 0);
    const phases = lesson!.phases.reduce((a, p) => a + p.minutes, 0);
    expect(steps).toBe(45);
    expect(phases).toBe(45);
  });

  it('gives every step a script and a screen', () => {
    for (const s of lesson!.steps) {
      expect(s.script.length).toBeGreaterThan(0);
      expect(s.screen.kind).toBeTruthy();
    }
  });
});
