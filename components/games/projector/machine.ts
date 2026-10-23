/*
 * Teacher projector mode: the stage machine every scored game shares.
 *
 *   question → vote → reveal → (next item) question … → ended
 *
 * It sits beside useScoredGame rather than inside it: a classroom runs the
 * game forwards and backwards (a teacher with a clicker presses ← to show the
 * vote again), and the class's answer is optional, so the projector keeps its
 * own record of what was picked and what has been revealed. Everything here
 * is pure, so it is unit-tested directly.
 */

export type Stage = 'question' | 'vote' | 'reveal' | 'ended';

export type Countdown = {
  /** Whole seconds left. */
  remaining: number;
  running: boolean;
  /** The most seconds this countdown has had, for drawing the share left. */
  peak: number;
};

/** Something worth announcing that is not a change of stage. */
export type Notice =
  | { kind: 'countdown-start'; seconds: number }
  | { kind: 'countdown-extend'; seconds: number }
  | { kind: 'countdown-done' }
  | { kind: 'countdown-stop' }
  | { kind: 'pick'; choice: string | null }
  | { kind: 'team'; team: 0 | 1; score: number }
  | { kind: 'tips'; on: boolean }
  | { kind: 'teams'; on: boolean };

export type ProjectorState = {
  index: number;
  stage: Stage;
  total: number;
  /** The class's answer per item id, if the teacher recorded one. */
  picks: Record<string, string>;
  countdown: Countdown | null;
  /** Show the teacher tip strip (T). On by default; tips appear with the reveal. */
  tips: boolean;
  teams: { on: boolean; scores: [number, number] };
  notice: Notice | null;
};

export type ProjectorAction =
  | { type: 'next' }
  | { type: 'prev' }
  | { type: 'pick'; itemId: string; choice: string }
  | { type: 'countdownStart'; seconds?: number }
  | { type: 'countdownExtend'; seconds?: number }
  | { type: 'countdownStop' }
  | { type: 'tick' }
  | { type: 'toggleTips' }
  | { type: 'toggleTeams' }
  | { type: 'award'; team: 0 | 1; delta: 1 | -1 }
  | { type: 'goto'; index: number; stage: Stage }
  | { type: 'restart'; total?: number };

export const COUNTDOWN_SECONDS = 10;

export function initialProjectorState(total: number): ProjectorState {
  return {
    index: 0,
    stage: 'question',
    total,
    picks: {},
    countdown: null,
    tips: true,
    teams: { on: false, scores: [0, 0] },
    notice: null,
  };
}

export function projectorReducer(state: ProjectorState, action: ProjectorAction): ProjectorState {
  const last = state.total - 1;
  switch (action.type) {
    case 'next':
      switch (state.stage) {
        case 'question':
          return { ...state, stage: 'vote', countdown: null, notice: null };
        case 'vote':
          return { ...state, stage: 'reveal', countdown: null, notice: null };
        case 'reveal':
          if (state.index >= last) return { ...state, stage: 'ended', countdown: null, notice: null };
          return { ...state, index: state.index + 1, stage: 'question', countdown: null, notice: null };
        default:
          return state;
      }
    case 'prev':
      switch (state.stage) {
        case 'vote':
          return { ...state, stage: 'question', countdown: null, notice: null };
        case 'reveal':
          return { ...state, stage: 'vote', countdown: null, notice: null };
        case 'question':
          if (state.index === 0) return state;
          return { ...state, index: state.index - 1, stage: 'reveal', countdown: null, notice: null };
        case 'ended':
          return { ...state, index: Math.max(0, last), stage: 'reveal', notice: null };
        default:
          return state;
      }
    case 'pick': {
      if (state.stage !== 'vote') return state;
      const picks = { ...state.picks };
      // Tapping the recorded answer again clears it.
      const cleared = picks[action.itemId] === action.choice;
      if (cleared) delete picks[action.itemId];
      else picks[action.itemId] = action.choice;
      return { ...state, picks, notice: { kind: 'pick', choice: cleared ? null : action.choice } };
    }
    case 'countdownStart': {
      if (state.stage !== 'vote') return state;
      const seconds = action.seconds ?? COUNTDOWN_SECONDS;
      return { ...state, countdown: { remaining: seconds, running: true, peak: seconds }, notice: { kind: 'countdown-start', seconds } };
    }
    case 'countdownExtend': {
      if (state.stage !== 'vote') return state;
      const add = action.seconds ?? COUNTDOWN_SECONDS;
      const remaining = (state.countdown?.remaining ?? 0) + add;
      const peak = Math.max(state.countdown?.peak ?? 0, remaining);
      return { ...state, countdown: { remaining, running: true, peak }, notice: { kind: 'countdown-extend', seconds: remaining } };
    }
    case 'countdownStop':
      if (!state.countdown) return state;
      return { ...state, countdown: null, notice: { kind: 'countdown-stop' } };
    case 'tick': {
      const c = state.countdown;
      if (!c || !c.running) return state;
      const remaining = Math.max(0, c.remaining - 1);
      if (remaining === 0) return { ...state, countdown: { ...c, remaining: 0, running: false }, notice: { kind: 'countdown-done' } };
      return { ...state, countdown: { ...c, remaining } };
    }
    case 'toggleTips':
      return { ...state, tips: !state.tips, notice: { kind: 'tips', on: !state.tips } };
    case 'toggleTeams':
      return { ...state, teams: { ...state.teams, on: !state.teams.on }, notice: { kind: 'teams', on: !state.teams.on } };
    case 'award': {
      if (!state.teams.on) return state;
      const scores: [number, number] = [...state.teams.scores];
      scores[action.team] = Math.max(0, scores[action.team] + action.delta);
      return { ...state, teams: { ...state.teams, scores }, notice: { kind: 'team', team: action.team, score: scores[action.team] } };
    }
    case 'goto':
      if (action.index < 0 || action.index > last) return state;
      return { ...state, index: action.index, stage: action.stage, countdown: null, notice: null };
    case 'restart': {
      const fresh = initialProjectorState(action.total ?? state.total);
      return { ...fresh, tips: state.tips, teams: { on: state.teams.on, scores: [0, 0] } };
    }
    default:
      return state;
  }
}

/** How the class did, from the answers the teacher recorded during the votes. */
export type ClassTally = {
  /** Items with a recorded class answer that have a right answer. */
  voted: number;
  correct: number;
  /** Indexes of the items the class got wrong, in play order. */
  missed: number[];
};

export function classTally(
  items: readonly { id: string; judge: (choice: string) => boolean | null }[],
  picks: Record<string, string>,
): ClassTally {
  let voted = 0;
  let correct = 0;
  const missed: number[] = [];
  items.forEach((item, i) => {
    const pick = picks[item.id];
    if (pick === undefined) return;
    const verdict = item.judge(pick);
    if (verdict === null) return;
    voted += 1;
    if (verdict) correct += 1;
    else missed.push(i);
  });
  return { voted, correct, missed };
}

/**
 * "Hands up: Coin A or Coin B?" when the choices are few and short enough to
 * say; otherwise their numbers ("Hands up: 1, 2, 3 or 4?").
 */
export function voteLine(labels: readonly string[]): string {
  const sayable = labels.length <= 3 && labels.every((l) => l.length <= 16);
  const words = sayable ? labels : labels.map((_, i) => String(i + 1));
  if (words.length <= 1) return `Hands up: ${words[0] ?? ''}?`;
  return `Hands up: ${words.slice(0, -1).join(', ')} or ${words[words.length - 1]}?`;
}

/* ───────── Keyboard ───────── */

export type KeyContext = {
  stage: Stage;
  choiceCount: number;
  /** The key was pressed on a button, link or summary (Space and Enter press it). */
  onControl: boolean;
  /** The key was pressed in a text field, select or slider. */
  inField: boolean;
  /** The key was pressed on a magnifier, which uses Enter, Space, arrows and Escape. */
  inMagnifier: boolean;
  countdown: Countdown | null;
};

export type KeyCommand =
  | ProjectorAction
  | { type: 'pickIndex'; index: number }
  | { type: 'fullscreen' }
  | { type: 'play' };

/**
 * What a key does in projector mode, or null to leave it alone.
 *   → PageDown Space   next stage       ← PageUp   back
 *   1–9  record the class's answer (vote)
 *   C    start / stop the countdown     +  ten more seconds
 *   T    teacher tip    F full screen   P play the sound again
 * A clicker sends PageDown / PageUp (sometimes arrows), so those always work,
 * even with focus on a button or a magnifier.
 */
export function keyCommand(key: string, ctx: KeyContext, mods: { alt?: boolean; ctrl?: boolean; meta?: boolean } = {}): KeyCommand | null {
  if (mods.alt || mods.ctrl || mods.meta) return null;
  if (key === 'PageDown') return { type: 'next' };
  if (key === 'PageUp') return { type: 'prev' };
  if (ctx.inField) return null;
  if (ctx.inMagnifier && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ', 'Enter', 'Escape'].includes(key)) return null;
  switch (key) {
    case 'ArrowRight':
      return { type: 'next' };
    case 'ArrowLeft':
      return { type: 'prev' };
    case ' ':
      return ctx.onControl ? null : { type: 'next' };
    case 't':
    case 'T':
      return { type: 'toggleTips' };
    case 'f':
    case 'F':
      return { type: 'fullscreen' };
    case 'p':
    case 'P':
      return ctx.stage === 'ended' ? null : { type: 'play' };
    case 'c':
    case 'C':
      if (ctx.stage !== 'vote') return null;
      return ctx.countdown?.running ? { type: 'countdownStop' } : { type: 'countdownStart' };
    case '+':
    case '=':
      return ctx.stage === 'vote' ? { type: 'countdownExtend' } : null;
    case 'Escape':
      return ctx.stage === 'vote' && ctx.countdown ? { type: 'countdownStop' } : null;
    default:
      if (/^[1-9]$/.test(key) && ctx.stage === 'vote') {
        const index = Number(key) - 1;
        return index < ctx.choiceCount ? { type: 'pickIndex', index } : null;
      }
      return null;
  }
}
