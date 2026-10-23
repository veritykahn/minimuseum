'use client';

import { useCallback, useReducer } from 'react';
import { countCorrect, type AnswerRecord } from './scoring';

/*
 * The question → feedback → … → ended loop every scored game shares.
 *
 * Teacher projector mode (components/games/projector) runs beside this loop
 * rather than through it: a classroom steps backwards as well as forwards and
 * the class's answer is optional, so it keeps its own question → vote →
 * reveal machine and leaves a visitor's game here untouched.
 */

export type GamePhase = 'question' | 'feedback' | 'ended';

export type GameState = {
  index: number;
  phase: GamePhase;
  records: AnswerRecord[];
};

export type GameAction =
  | { type: 'answer'; itemId: string; choice: string; correct: boolean }
  | { type: 'next'; total: number }
  | { type: 'reset' };

export const initialGameState: GameState = { index: 0, phase: 'question', records: [] };

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'answer':
      // One answer per item: a second click during feedback changes nothing.
      if (state.phase !== 'question') return state;
      return {
        ...state,
        phase: 'feedback',
        records: [...state.records, { itemId: action.itemId, choice: action.choice, correct: action.correct }],
      };
    case 'next':
      if (state.phase !== 'feedback') return state;
      if (state.index + 1 >= action.total) return { ...state, phase: 'ended' };
      return { ...state, index: state.index + 1, phase: 'question' };
    case 'reset':
      return initialGameState;
    default:
      return state;
  }
}

export function useScoredGame(total: number) {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);
  const answer = useCallback(
    (itemId: string, choice: string, correct: boolean) => dispatch({ type: 'answer', itemId, choice, correct }),
    [],
  );
  const next = useCallback(() => dispatch({ type: 'next', total }), [total]);
  const reset = useCallback(() => dispatch({ type: 'reset' }), []);
  const last = state.records[state.records.length - 1] ?? null;
  return {
    ...state,
    score: countCorrect(state.records),
    /** The record for the item on screen, once it has been answered. */
    current: state.phase === 'feedback' ? last : null,
    isLast: state.index === total - 1,
    answer,
    next,
    reset,
  };
}
