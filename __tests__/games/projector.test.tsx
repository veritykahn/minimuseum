import { ILLUSIONS } from '@/app/exhibitions/seeing-is-deceiving/illusions/lab/data';
import { act, fireEvent, render, screen } from '@testing-library/react';
import {
  classTally,
  initialProjectorState,
  keyCommand,
  projectorReducer,
  voteLine,
  type KeyContext,
  type ProjectorAction,
  type ProjectorState,
} from '@/components/games/projector/machine';
import { projectorRequested } from '@/components/games/projector/useProjectorMode';
import ProjectorStage, { type ProjectorItem } from '@/components/games/projector/ProjectorStage';
import RealOrReplica from '@/app/exhibitions/in-their-hands/real-or-replica/page';
import { ROUNDS } from '@/app/exhibitions/in-their-hands/real-or-replica/data';
import { HANDS_CHARACTERS } from '@/app/exhibitions/in-their-hands/hands/data';
import { INSTRUMENTS } from '@/app/exhibitions/harlem-renaissance/jazz-lab/data';

const run = (state: ProjectorState, ...actions: ProjectorAction[]) => actions.reduce(projectorReducer, state);
const next = { type: 'next' } as const;
const prev = { type: 'prev' } as const;

describe('projector stage machine', () => {
  it('goes question → vote → reveal → next item … → ended', () => {
    let s = initialProjectorState(2);
    expect(s).toMatchObject({ index: 0, stage: 'question' });
    s = run(s, next);
    expect(s.stage).toBe('vote');
    s = run(s, next);
    expect(s.stage).toBe('reveal');
    s = run(s, next);
    expect(s).toMatchObject({ index: 1, stage: 'question' });
    s = run(s, next, next, next);
    expect(s.stage).toBe('ended');
    expect(run(s, next)).toBe(s);
  });

  it('steps back one stage at a time, across items and out of the ending', () => {
    let s = run(initialProjectorState(2), next, next, next); // item 2, question
    s = run(s, prev);
    expect(s).toMatchObject({ index: 0, stage: 'reveal' });
    s = run(s, prev);
    expect(s).toMatchObject({ index: 0, stage: 'vote' });
    s = run(s, prev, prev);
    expect(s).toMatchObject({ index: 0, stage: 'question' });
    s = run(initialProjectorState(2), next, next, next, next, next, next);
    expect(s.stage).toBe('ended');
    expect(run(s, prev)).toMatchObject({ index: 1, stage: 'reveal' });
  });

  it('records the class answer only during the vote, and a second tap clears it', () => {
    let s = run(initialProjectorState(1), { type: 'pick', itemId: 'x', choice: 'a' });
    expect(s.picks).toEqual({});
    s = run(s, next, { type: 'pick', itemId: 'x', choice: 'a' });
    expect(s.picks).toEqual({ x: 'a' });
    expect(s.notice).toEqual({ kind: 'pick', choice: 'a' });
    s = run(s, { type: 'pick', itemId: 'x', choice: 'b' });
    expect(s.picks).toEqual({ x: 'b' });
    s = run(s, { type: 'pick', itemId: 'x', choice: 'b' });
    expect(s.picks).toEqual({});
  });

  it('runs an optional countdown that can be extended, stopped, and never reveals by itself', () => {
    let s = run(initialProjectorState(1), { type: 'countdownStart' });
    expect(s.countdown).toBeNull(); // not before the vote
    s = run(s, next, { type: 'countdownStart' });
    expect(s.countdown).toEqual({ remaining: 10, running: true, peak: 10 });
    for (let i = 0; i < 9; i++) s = run(s, { type: 'tick' });
    expect(s.countdown?.remaining).toBe(1);
    s = run(s, { type: 'countdownExtend' });
    expect(s.countdown).toEqual({ remaining: 11, running: true, peak: 11 });
    for (let i = 0; i < 20; i++) s = run(s, { type: 'tick' });
    expect(s.countdown).toEqual({ remaining: 0, running: false, peak: 11 });
    expect(s.notice).toEqual({ kind: 'countdown-done' });
    expect(s.stage).toBe('vote');
    s = run(s, { type: 'countdownStop' });
    expect(s.countdown).toBeNull();
    s = run(s, { type: 'countdownStart' }, next);
    expect(s.stage).toBe('reveal');
    expect(s.countdown).toBeNull();
  });

  it('keeps team scores only while teams are on, never below zero, and restarts them', () => {
    let s = run(initialProjectorState(3), { type: 'award', team: 0, delta: 1 });
    expect(s.teams.scores).toEqual([0, 0]);
    s = run(s, { type: 'toggleTeams' }, { type: 'award', team: 0, delta: 1 }, { type: 'award', team: 1, delta: -1 }, { type: 'award', team: 0, delta: 1 });
    expect(s.teams).toEqual({ on: true, scores: [2, 0] });
    s = run(s, next, { type: 'pick', itemId: 'a', choice: 'x' }, { type: 'toggleTips' }, { type: 'restart' });
    expect(s).toMatchObject({ index: 0, stage: 'question', picks: {}, tips: false, teams: { on: true, scores: [0, 0] } });
  });

  it('tallies the class from recorded answers, leaving out items with no wrong answer', () => {
    const items = [
      { id: 'a', judge: (c: string) => c === 'x' },
      { id: 'b', judge: (c: string) => c === 'x' },
      { id: 'c', judge: () => null },
      { id: 'd', judge: (c: string) => c === 'x' },
    ];
    expect(classTally(items, { a: 'x', b: 'y', c: 'y' })).toEqual({ voted: 2, correct: 1, missed: [1] });
  });

  it('words the vote', () => {
    expect(voteLine(['Coin A', 'Coin B'])).toBe('Hands up: Coin A or Coin B?');
    expect(voteLine(['A', 'B', 'They’re the same'])).toBe('Hands up: A, B or They’re the same?');
    expect(voteLine(['The Roman Soldier', 'The Widow', 'The Merchant', 'Paul of Tarsus'])).toBe('Hands up: 1, 2, 3 or 4?');
  });

  it('reads ?projector=1', () => {
    expect(projectorRequested('?projector=1')).toBe(true);
    expect(projectorRequested('?x=2&projector=true')).toBe(true);
    expect(projectorRequested('?projector=0')).toBe(false);
    expect(projectorRequested('')).toBe(false);
  });
});

describe('projector keys', () => {
  const ctx = (over: Partial<KeyContext> = {}): KeyContext => ({
    stage: 'question',
    choiceCount: 3,
    onControl: false,
    inField: false,
    inMagnifier: false,
    countdown: null,
    ...over,
  });

  it('drives the stages from a clicker or the keyboard', () => {
    for (const k of ['ArrowRight', 'PageDown', ' ']) expect(keyCommand(k, ctx())).toEqual({ type: 'next' });
    for (const k of ['ArrowLeft', 'PageUp']) expect(keyCommand(k, ctx())).toEqual({ type: 'prev' });
  });

  it('leaves Space to a focused button, and arrows to a magnifier or a field — but a clicker always works', () => {
    expect(keyCommand(' ', ctx({ onControl: true }))).toBeNull();
    expect(keyCommand('ArrowRight', ctx({ onControl: true }))).toEqual({ type: 'next' });
    expect(keyCommand('ArrowRight', ctx({ inMagnifier: true }))).toBeNull();
    expect(keyCommand('ArrowLeft', ctx({ inField: true }))).toBeNull();
    expect(keyCommand('PageDown', ctx({ inMagnifier: true }))).toEqual({ type: 'next' });
    expect(keyCommand('PageUp', ctx({ inField: true }))).toEqual({ type: 'prev' });
    expect(keyCommand('ArrowRight', ctx(), { meta: true })).toBeNull();
  });

  it('records the class answer by number, and runs the countdown, only during the vote', () => {
    expect(keyCommand('2', ctx())).toBeNull();
    expect(keyCommand('2', ctx({ stage: 'vote' }))).toEqual({ type: 'pickIndex', index: 1 });
    expect(keyCommand('4', ctx({ stage: 'vote' }))).toBeNull();
    expect(keyCommand('c', ctx())).toBeNull();
    expect(keyCommand('c', ctx({ stage: 'vote' }))).toEqual({ type: 'countdownStart' });
    expect(keyCommand('C', ctx({ stage: 'vote', countdown: { remaining: 4, running: true, peak: 10 } }))).toEqual({ type: 'countdownStop' });
    expect(keyCommand('+', ctx({ stage: 'vote' }))).toEqual({ type: 'countdownExtend' });
    expect(keyCommand('Escape', ctx({ stage: 'vote', countdown: { remaining: 4, running: true, peak: 10 } }))).toEqual({ type: 'countdownStop' });
  });

  it('toggles tips, full screen and the sound', () => {
    expect(keyCommand('t', ctx())).toEqual({ type: 'toggleTips' });
    expect(keyCommand('F', ctx())).toEqual({ type: 'fullscreen' });
    expect(keyCommand('p', ctx({ stage: 'reveal' }))).toEqual({ type: 'play' });
  });
});

/* ───────── The stage component ───────── */

function makeItems(): ProjectorItem[] {
  return ['one', 'two'].map((id) => ({
    id,
    kicker: `Item ${id}`,
    prompt: `Question ${id}?`,
    choices: [
      { id: 'a', label: 'Coin A' },
      { id: 'b', label: 'Coin B' },
    ],
    judge: (c: string) => c === 'b',
    verdict: (pick: string | null) =>
      pick === null ? { tone: 'neutral' as const, title: 'B it is.' } : pick === 'b' ? { tone: 'right' as const, title: 'Right: B.' } : { tone: 'wrong' as const, title: 'No: B.' },
    media: () => <p>picture {id}</p>,
    explanation: <p>Because of the owl {id}.</p>,
    teacherTip: `Tip for ${id}.`,
  }));
}

const ENDING = {
  eyebrow: 'Test · Your class',
  result: (t: { correct: number; voted: number }) => ({ value: t.correct, caption: `out of ${t.voted}`, title: t.correct === t.voted ? 'All right.' : 'Some missed.' }),
  discuss: <p>Talk about owls.</p>,
  missedLabel: 'Look again',
  links: [{ label: 'Lessons', href: '/lessons' }],
};

const key = (k: string) => act(() => {
  fireEvent.keyDown(window, { key: k });
});

describe('ProjectorStage', () => {
  beforeAll(() => {
    window.matchMedia = window.matchMedia || ((q: string) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {} }) as unknown as MediaQueryList);
  });

  it('is driven by the keyboard, announces each stage, and moves focus to it', () => {
    const exit = jest.fn();
    render(<ProjectorStage title="Test" noun="Round" nounPlural="rounds" items={makeItems()} layout="stack" theme={{}} ending={ENDING} onExit={exit} />);
    const live = () => screen.getByRole('status').textContent;
    expect(screen.getByRole('heading', { level: 1, name: 'Question one?' })).toHaveFocus();
    expect(live()).toBe('Round 1 of 2. Question one?');
    expect(screen.getByRole('listitem', { current: 'step' })).toHaveTextContent('Question');

    key('ArrowRight');
    expect(screen.getByRole('heading', { level: 2, name: /Class vote/ })).toHaveFocus();
    expect(screen.getByText('Hands up: Coin A or Coin B?')).toBeInTheDocument();
    expect(live()).toMatch(/^Class vote\. Hands up: Coin A or Coin B\?/);

    key('2');
    expect(screen.getByRole('button', { name: /Coin B/ })).toHaveAttribute('aria-pressed', 'true');
    expect(live()).toBe('Class answer: Coin B.');

    key('PageDown');
    expect(screen.getByRole('heading', { level: 2, name: 'Right: B.' })).toHaveFocus();
    expect(screen.getByText('The class said “Coin B.”')).toBeInTheDocument();
    expect(screen.getByText('Because of the owl one.')).toBeInTheDocument();
    expect(screen.getByText('Tip for one.')).toBeInTheDocument();
    expect(live()).toBe('Reveal. Right: B.');

    key('t');
    expect(screen.queryByText('Tip for one.')).toBeNull();
    expect(live()).toBe('Teacher tips off.');
    key('t');

    key('ArrowLeft');
    expect(screen.getByRole('heading', { level: 2, name: /Class vote/ })).toHaveFocus();
    key('ArrowRight');
    key('ArrowRight'); // item two
    expect(screen.getByRole('heading', { level: 1, name: 'Question two?' })).toHaveFocus();
    key('ArrowRight');
    key('1');
    key('ArrowRight');
    expect(screen.getByRole('heading', { level: 2, name: 'No: B.' })).toBeInTheDocument();
    key('ArrowRight');

    // The ending: the class result, a Discuss prompt, the missed item and the links.
    expect(screen.getByRole('heading', { level: 1, name: 'Some missed.' })).toHaveFocus();
    expect(screen.getByText('1 out of 2')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Discuss' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Lessons/ })).toHaveAttribute('href', '/lessons');
    fireEvent.click(screen.getByRole('button', { name: 'Item two' }));
    expect(screen.getByRole('heading', { level: 2, name: 'No: B.' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Exit projector' }));
    expect(exit).toHaveBeenCalled();
  });

  it('counts down in whole seconds, can be extended, and leaves the reveal to the teacher', () => {
    jest.useFakeTimers();
    try {
      render(<ProjectorStage title="Test" noun="Round" nounPlural="rounds" items={makeItems()} layout="side" theme={{}} ending={ENDING} onExit={() => {}} />);
      key('ArrowRight');
      key('c');
      expect(screen.getByRole('status')).toHaveTextContent('Countdown started: 10 seconds.');
      act(() => { jest.advanceTimersByTime(3000); });
      expect(screen.getByText('7')).toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: /\+10 sec/ }));
      expect(screen.getByText('17')).toBeInTheDocument();
      act(() => { jest.advanceTimersByTime(20000); });
      expect(screen.getByText('Time')).toBeInTheDocument();
      expect(screen.getByRole('status')).toHaveTextContent('Time’s up. Reveal when you’re ready.');
      expect(screen.getByRole('heading', { level: 2, name: /Class vote/ })).toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: /Reveal/ }));
      expect(screen.getByRole('heading', { level: 2, name: 'B it is.' })).toBeInTheDocument();
    } finally {
      jest.useRealTimers();
    }
  });

  it('awards team points by tap and names the winner at the end', () => {
    render(<ProjectorStage title="Test" noun="Round" nounPlural="rounds" items={makeItems()} layout="stack" theme={{}} ending={ENDING} onExit={() => {}} />);
    expect(screen.queryByRole('group', { name: 'Team scores' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Teams' }));
    fireEvent.click(screen.getByRole('button', { name: '+1 for Team 2' }));
    fireEvent.click(screen.getByRole('button', { name: '+1 for Team 2' }));
    fireEvent.click(screen.getByRole('button', { name: '+1 for Team 1' }));
    expect(screen.getByRole('status')).toHaveTextContent('Team 1: 1 point.');
    for (let i = 0; i < 6; i++) key('ArrowRight');
    expect(screen.getByText('Team 2 wins, 2 to 1.')).toBeInTheDocument();
    // No class answers were recorded: no class score is claimed.
    expect(screen.getByRole('heading', { level: 1, name: 'No class answers recorded.' })).toBeInTheDocument();
  });

  it('leaves keys alone while a dialog is open over it', () => {
    render(
      <>
        <ProjectorStage title="Test" noun="Round" nounPlural="rounds" items={makeItems()} layout="stack" theme={{}} ending={ENDING} onExit={() => {}} />
        <div role="dialog" aria-modal="true">Science</div>
      </>,
    );
    key('ArrowRight');
    expect(screen.getByRole('heading', { level: 1, name: 'Question one?' })).toBeInTheDocument();
    expect(screen.queryByText('Hands up: Coin A or Coin B?')).toBeNull();
  });
});

describe('teacher projector mode in a game', () => {
  afterEach(() => window.history.replaceState(null, '', '/'));

  it('opens from ?projector=1, keeps the game underneath, and returns focus to the toggle on exit', () => {
    jest.useFakeTimers();
    try {
      window.history.replaceState(null, '', '/exhibitions/in-their-hands/real-or-replica?projector=1');
      render(<RealOrReplica />);
      act(() => { jest.runOnlyPendingTimers(); });
      expect(screen.getByRole('heading', { level: 1, name: 'Which is the fake?' })).toHaveFocus();
      expect(screen.getByRole('navigation', { name: 'Projector tools' })).toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: 'Exit projector' }));
      expect(window.location.search).toBe('');
      const toggle = screen.getByRole('button', { name: 'Teach with this' });
      expect(toggle).toHaveFocus();
      expect(screen.getByRole('button', { name: 'Coin A is the fake' })).toBeInTheDocument();
      fireEvent.click(toggle);
      expect(window.location.search).toBe('?projector=1');
    } finally {
      jest.useRealTimers();
    }
  });
});

describe('teacher tips', () => {
  const tipped = (xs: { teacherTip?: string }[]) => xs.every((x) => typeof x.teacherTip === 'string' && /^[A-Z].*[.?]$/.test(x.teacherTip));

  it('every item in all four games has a one-sentence teacher tip', () => {
    expect(tipped(ROUNDS)).toBe(true);
    expect(tipped(HANDS_CHARACTERS)).toBe(true);
    expect(tipped(INSTRUMENTS)).toBe(true);
    const illusions = ILLUSIONS;
    expect(illusions).toHaveLength(19);
    expect(tipped(illusions)).toBe(true);
    for (const t of [...ROUNDS, ...HANDS_CHARACTERS, ...INSTRUMENTS, ...illusions].map((x) => x.teacherTip!)) {
      expect(t.split(/[.?!]\s/).length).toBe(1);
    }
  });
});
