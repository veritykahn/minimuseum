import { readFileSync } from 'fs';
import { join } from 'path';
import { act, fireEvent, render, screen } from '@testing-library/react';
import GameResult from '@/components/games/GameResult';
import Verdict from '@/components/games/Verdict';
import {
  CONFETTI_PIECES,
  FLASH_MS,
  GOOD_SCORE,
  SoundSwitch,
  isGoodScore,
} from '@/components/games/feedback/FeedbackKit';
import { CUES, SOUND_KEY, isSoundOn, playCue, resetSoundForTests, setSoundOn } from '@/components/games/feedback/sound';
import HandsOfHistory from '@/app/exhibitions/in-their-hands/hands/page';
import RealOrReplica from '@/app/exhibitions/in-their-hands/real-or-replica/page';
import { HANDS_CHARACTERS } from '@/app/exhibitions/in-their-hands/hands/data';
import { CLOSING as REPLICA_CLOSING } from '@/app/exhibitions/in-their-hands/real-or-replica/data';

/* A fake Web Audio context that counts the oscillators it is asked for. */
let oscillators = 0;
let contextsMade = 0;
class FakeParam {
  setValueAtTime() {}
  linearRampToValueAtTime() {}
}
class FakeAudioContext {
  state = 'running';
  currentTime = 0;
  destination = {};
  constructor() { contextsMade += 1; }
  resume() { return Promise.resolve(); }
  createOscillator() {
    oscillators += 1;
    return { type: 'sine', frequency: new FakeParam(), connect() {}, start() {}, stop() {} };
  }
  createGain() { return { gain: new FakeParam(), connect() {} }; }
}

function setReducedMotion(on: boolean) {
  (window.matchMedia as unknown) = (q: string) =>
    ({ matches: on && q.includes('reduce'), media: q, addEventListener() {}, removeEventListener() {} }) as unknown as MediaQueryList;
}

beforeEach(() => {
  oscillators = 0;
  contextsMade = 0;
  window.localStorage.clear();
  resetSoundForTests();
  (window as unknown as { AudioContext: unknown }).AudioContext = FakeAudioContext;
  setReducedMotion(false);
});

afterEach(() => {
  act(() => setSoundOn(false));
  jest.useRealTimers();
});

describe('feedback kit: sound', () => {
  it('is off until the visitor turns it on, and makes no audio context before then', () => {
    expect(isSoundOn()).toBe(false);
    expect(playCue('right')).toBe(false);
    expect(contextsMade).toBe(0);
    expect(oscillators).toBe(0);
  });

  it('plays short cues once turned on, and remembers the choice', () => {
    setSoundOn(true);
    expect(window.localStorage.getItem(SOUND_KEY)).toBe('on');
    expect(playCue('right')).toBe(true);
    expect(oscillators).toBe(CUES.right.length);
    // Every cue is short and quiet.
    for (const cue of Object.values(CUES)) {
      for (const t of cue) {
        expect(t.start + t.dur).toBeLessThanOrEqual(1);
        expect(t.gain).toBeLessThanOrEqual(0.2);
      }
    }
    resetSoundForTests();
    expect(isSoundOn()).toBe(true);
  });

  it('stays quiet, without throwing, where storage or Web Audio is missing', () => {
    const get = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked'); });
    const set = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked'); });
    expect(isSoundOn()).toBe(false);
    delete (window as unknown as { AudioContext?: unknown }).AudioContext;
    expect(() => setSoundOn(true)).not.toThrow();
    expect(playCue('wrong')).toBe(false);
    get.mockRestore();
    set.mockRestore();
  });

  it('has a sound switch that starts off and says what it will do', () => {
    render(<SoundSwitch />);
    const btn = screen.getByRole('button', { name: 'Turn sound on' });
    fireEvent.click(btn);
    expect(screen.getByRole('button', { name: 'Turn sound off' })).toBeInTheDocument();
    expect(isSoundOn()).toBe(true);
    // Turning it on answers with a soft click.
    expect(oscillators).toBe(CUES.click.length);
    fireEvent.click(screen.getByRole('button', { name: 'Turn sound off' }));
    expect(isSoundOn()).toBe(false);
  });
});

describe('feedback kit: flash and celebration', () => {
  it('flashes green for right and orange for wrong, once, then clears', () => {
    jest.useFakeTimers();
    const { rerender } = render(<Verdict key="a" tone="right" title="Correct!" />);
    expect(document.body.querySelector('[data-feedback-flash="right"]')).not.toBeNull();
    act(() => { jest.advanceTimersByTime(FLASH_MS + 10); });
    expect(document.body.querySelector('[data-feedback-flash]')).toBeNull();
    rerender(<Verdict key="b" tone="wrong" title="Not quite" />);
    expect(document.body.querySelector('[data-feedback-flash="wrong"]')).not.toBeNull();
  });

  it('never flashes for a neutral verdict, or when a game turns feedback off', () => {
    render(<><Verdict tone="neutral" title="Noted" /><Verdict tone="right" title="Quiet" feedback={false} /></>);
    expect(document.body.querySelector('[data-feedback-flash]')).toBeNull();
  });

  it('plays the right or wrong cue with the verdict when sound is on', () => {
    setSoundOn(true);
    render(<Verdict tone="wrong" title="Not quite" />);
    expect(oscillators).toBe(CUES.wrong.length);
  });

  it('keeps a still frame instead of a fading flash under reduced motion', () => {
    setReducedMotion(true);
    render(<Verdict tone="right" title="Correct!" />);
    expect(document.body.querySelector('[data-feedback-flash="right"]')).toHaveAttribute('data-reduced');
  });

  it('celebrates a good final score with confetti, and only then', () => {
    const { unmount } = render(<GameResult score={4} scoreCaption="out of 5" title="Sharp eyes" actions={[]} celebrate />);
    const confetti = document.body.querySelector('[data-celebration="confetti"]');
    expect(confetti).not.toBeNull();
    expect(confetti!.children).toHaveLength(CONFETTI_PIECES);
    expect(confetti).toHaveAttribute('aria-hidden', 'true');
    unmount();
    render(<GameResult score={1} scoreCaption="out of 5" title="A start" actions={[]} />);
    expect(document.body.querySelector('[data-celebration]')).toBeNull();
  });

  it('shows still stars instead of falling confetti under reduced motion', () => {
    setReducedMotion(true);
    render(<GameResult score={5} scoreCaption="out of 5" title="Perfect" actions={[]} celebrate />);
    expect(document.body.querySelector('[data-celebration="confetti"]')).toBeNull();
    expect(document.body.querySelector('[data-celebration="still"]')).not.toBeNull();
  });

  it('calls a good score 70% or more', () => {
    expect(GOOD_SCORE).toBe(0.7);
    expect(isGoodScore(5, 7)).toBe(true);
    expect(isGoodScore(4, 7)).toBe(false);
    expect(isGoodScore(4, 5)).toBe(true);
    expect(isGoodScore(9, 12)).toBe(true);
    expect(isGoodScore(8, 12)).toBe(false);
    expect(isGoodScore(0, 0)).toBe(false);
  });
});

describe('feedback kit in the games', () => {
  it('Hands of History: a sound switch in the header, a flash on each answer, confetti for a good score', () => {
    render(<HandsOfHistory />);
    expect(screen.getByRole('button', { name: 'Turn sound on' })).toBeInTheDocument();
    for (let i = 0; i < HANDS_CHARACTERS.length; i++) {
      const prompt = screen.getByRole('heading', { level: 1 }).textContent ?? '';
      const answer = HANDS_CHARACTERS.find((c) => c.prompt === prompt)!;
      fireEvent.click(screen.getByRole('button', { name: answer.character }));
      expect(document.body.querySelector('[data-feedback-flash="right"]')).not.toBeNull();
      fireEvent.click(screen.getByRole('button', { name: /Next|See Results/ }));
    }
    expect(document.body.querySelector('[data-celebration]')).not.toBeNull();
  });

  it('Real or Replica?: a sound switch and a flash on each answer', () => {
    render(<RealOrReplica />);
    expect(screen.getByRole('button', { name: 'Turn sound on' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Coin A is the fake' }));
    expect(document.body.querySelector('[data-feedback-flash]')).not.toBeNull();
  });

  it('Name That Instrument: has the sound switch and passes the celebration to its ending', () => {
    const src = readFileSync(join(process.cwd(), 'app/exhibitions/harlem-renaissance/jazz-lab/NameThatInstrument.tsx'), 'utf8');
    expect(src).toContain('<SoundSwitch');
    expect(src).toMatch(/celebrate=\{isGoodScore\(quiz\.score, total\)\}/);
  });

  it('keeps the Perception Lab out of the kit: it has its own feedback', () => {
    const src = readFileSync(join(process.cwd(), 'app/exhibitions/seeing-is-deceiving/illusions/page.tsx'), 'utf8');
    expect(src).not.toMatch(/games\/feedback|games\/Verdict|games\/GameResult/);
  });
});

describe('projector-sized text in the quiz games', () => {
  const px = (src: string) => Array.from(src.matchAll(/font-size:\s*(\d+(?:\.\d+)?)px/g)).map((m) => Number(m[1]));

  it('sets no fixed label under 14px in the shared answer and results pieces', () => {
    const css = readFileSync(join(process.cwd(), 'components/games/games.module.css'), 'utf8');
    expect(px(css).filter((n) => n < 14)).toEqual([]);
  });

  it('sets no fixed label under 14px in Hands of History or Real or Replica?', () => {
    for (const f of ['app/exhibitions/in-their-hands/hands/page.tsx', 'app/exhibitions/in-their-hands/real-or-replica/page.tsx']) {
      const src = readFileSync(join(process.cwd(), f), 'utf8');
      expect({ f, small: px(src).filter((n) => n < 14) }).toEqual({ f, small: [] });
    }
  });

  it('raises every small label in the Name That Instrument tab to projector size', () => {
    const src = readFileSync(join(process.cwd(), 'app/exhibitions/harlem-renaissance/jazz-lab/NameThatInstrument.tsx'), 'utf8');
    expect(px(src).filter((n) => n < 14)).toEqual([]);
    for (const cls of ['.jl-quiz-hint', '.jl-quiz-progress', '.jl-answer-name', '.jl-score-label', '.jl-btn']) {
      expect(src).toContain(`#jl-panel-quiz ${cls === '.jl-answer-name' ? '.jl-quiz-answer .jl-answer-name' : cls}`);
    }
  });
});

describe('the Pilate coin and the year of the Crucifixion', () => {
  const OLD = /precise year of the Crucifixion|in the year of the Crucifixion|very year of (his|the) Passion/;

  it('no longer claims the coin was minted in the year of the Crucifixion', () => {
    const soldier = HANDS_CHARACTERS.find((c) => c.character === 'The Roman Soldier')!;
    expect(soldier.story).not.toMatch(OLD);
    expect(soldier.story).toContain('within a few years of the Crucifixion, which most scholars date to AD 30 or 33');
    expect(REPLICA_CLOSING).not.toMatch(OLD);
    expect(REPLICA_CLOSING).toContain('within a few years of the Crucifixion, which most scholars date to AD 30 or 33');
    const family = readFileSync(join(process.cwd(), 'resources-src/in-their-hands/family.py'), 'utf8');
    expect(family).not.toMatch(OLD);
    expect(family).toContain('which most scholars date to AD 30 or 33');
  });

  it('matches the owner’s own Pilate label', () => {
    const label = readFileSync(join(process.cwd(), 'app/exhibitions/in-their-hands/artifacts/coin-data.ts'), 'utf8');
    expect(label).toContain('within a few years of the Crucifixion, which most scholars date to AD 30 or 33');
  });
});
