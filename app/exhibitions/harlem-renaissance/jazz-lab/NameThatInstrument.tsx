'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import Announcer from '@/components/games/Announcer';
import GameResult from '@/components/games/GameResult';
import Verdict from '@/components/games/Verdict';
import { plural, tierFor } from '@/components/games/scoring';
import type { GameAction } from '@/components/games/types';
import { ALL_INSTRUMENT_IDS, INSTRUMENTS, INSTRUMENT_MAP, QUIZ_TIERS } from './data';
import { instrumentBreakdown, type useQuiz } from './hooks';
import InstrumentIcon from './InstrumentIcon';
import TeachToggle from '@/components/games/projector/TeachToggle';

type Quiz = ReturnType<typeof useQuiz>;

const THEME = {
  '--game-accent': '#C9A94E',
  '--game-text': '#E8E0D0',
  '--game-muted': '#a59a86',
  '--game-right': '#7BC67B',
  '--game-wrong': '#e08a6a',
  '--game-surface': '#0A0A0A',
  '--game-display': "'Playfair Display', serif",
  '--game-body': "'Josefin Sans', sans-serif",
  '--game-radius': '4px',
} as CSSProperties;

/** The Name That Instrument tab. Uses the page's jl- styles plus the few below. */
export default function NameThatInstrument({ quiz, onTeach }: { quiz: Quiz; onTeach?: () => void }) {
  const last = quiz.lastRecord;
  const answered = quiz.gameState === 'answered';
  const isReplay = quiz.mode === 'replay';

  // Moving on removes the feedback (and the ending removes everything): put
  // focus back on the play button, where the next round starts.
  const playRef = useRef<HTMLButtonElement>(null);
  const prevState = useRef(quiz.gameState);
  useEffect(() => {
    if (quiz.gameState === 'playing' && prevState.current !== 'playing') playRef.current?.focus();
    prevState.current = quiz.gameState;
  }, [quiz.gameState, quiz.currentRound]);

  const announcement = last
    ? `${last.correct ? 'Correct.' : `Not quite. It was the ${INSTRUMENT_MAP[last.round.correctAnswer].name}.`} ${INSTRUMENT_MAP[last.round.correctAnswer].tip}`
    : '';

  return (
    <div role="tabpanel" id="jl-panel-quiz" aria-labelledby="jl-tab-quiz" style={THEME}>
      <style jsx global>{`
        .jl-quiz-answer .jl-answer-icon svg { width: 40px; height: 40px; color: var(--jl-gold-light); display: block; }
        .jl-quiz-answer:focus-visible, .jl-quiz-play-btn:focus-visible, .jl-next-btn:focus-visible {
          outline: 2px solid var(--jl-gold); outline-offset: 3px;
        }
        .jl-quiz-answer .jl-answer-name { color: #b3a994; }
        .jl-quiz-answer.disabled { opacity: 0.45; }
        .jl-feedback {
          margin: 24px auto 0;
          max-width: 500px;
          padding: 20px 22px;
          border: 1px solid rgba(201,169,78,0.25);
          border-radius: 10px;
          background: rgba(201,169,78,0.04);
          text-align: left;
        }
        .jl-feedback-title {
          font-family: 'Playfair Display', serif;
          font-size: 19px;
          margin-bottom: 8px !important;
        }
        .jl-feedback-tip {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 15px;
          line-height: 1.6;
          color: var(--jl-text);
          font-weight: 300;
          margin-bottom: 16px;
        }
        .jl-feedback-foot { display: flex; justify-content: flex-end; gap: 10px; flex-wrap: wrap; }
        .jl-next-btn { background: var(--jl-gold); color: #0A0A0A; border-color: var(--jl-gold); }
        .jl-next-btn:hover { background: var(--jl-gold-light); }
        .jl-mode-badge {
          display: inline-block;
          margin-top: 10px;
          font-family: 'Josefin Sans', sans-serif;
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--jl-gold);
          border: 1px solid var(--jl-gold-dim);
          border-radius: 100px;
          padding: 4px 10px;
          position: relative;
          z-index: 2;
        }
        .jl-breakdown {
          list-style: none;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
          width: 100%;
          max-width: 520px;
          margin: 0 auto 28px;
          padding: 0;
        }
        .jl-breakdown li {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 14px 8px 12px;
          border: 1px solid rgba(201,169,78,0.18);
          border-radius: 10px;
          background: rgba(201,169,78,0.03);
        }
        .jl-breakdown li.perfect { border-color: rgba(123,198,123,0.5); }
        .jl-breakdown svg { width: 34px; height: 34px; color: var(--jl-gold-light); }
        .jl-breakdown-name {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #b3a994;
          font-weight: 600;
        }
        .jl-breakdown-score {
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          color: var(--jl-gold);
        }
        .jl-quiz-result { padding: 30px 0 10px; }
        .jl-teach { display: flex; justify-content: center; margin: -6px 0 18px; }
        @media (max-width: 600px) {
          .jl-breakdown { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
      `}</style>

      <Announcer message={announcement} />

      <div className="jl-instructions">
        Listen to the sound and <em>tap the instrument</em> you think it is.
      </div>
      {onTeach && (
        <div className="jl-teach">
          <TeachToggle onClick={onTeach} style={{ color: 'var(--jl-gold)', fontFamily: "'Josefin Sans', sans-serif" }} />
        </div>
      )}

      <div className="jl-quiz-container">
        {quiz.gameState !== 'gameover' ? (
          <>
            <div className="jl-quiz-stage">
              <button
                type="button"
                ref={playRef}
                aria-label={quiz.gameState === 'idle' ? 'Start the quiz' : 'Play the sound again'}
                className={`jl-quiz-play-btn ${quiz.isQuizPlaying ? 'playing' : ''}`}
                onClick={() => {
                  if (quiz.gameState === 'idle') quiz.startGame();
                  else quiz.replaySound();
                }}
              >
                <span aria-hidden="true">{quiz.isQuizPlaying ? '\u{266A}' : '\u{25B6}'}</span>
              </button>
              <div className="jl-quiz-prompt">
                {quiz.gameState === 'idle'
                  ? 'Tap play to start the quiz'
                  : answered
                    ? 'Tap play to hear it again'
                    : 'What instrument is this?'}
              </div>
              <div className="jl-quiz-hint">
                {quiz.gameState === 'idle' ? '12 rounds' : 'Listen carefully...'}
              </div>
              {quiz.gameState !== 'idle' && (
                <div className="jl-quiz-progress">
                  Round {quiz.currentRound + 1} of {quiz.totalRounds}
                </div>
              )}
              {isReplay && quiz.gameState !== 'idle' && <span className="jl-mode-badge">Replaying the ones you missed</span>}
            </div>

            {quiz.gameState !== 'idle' && (
              <div className="jl-quiz-answers" role="group" aria-label="Which instrument is it?">
                {INSTRUMENTS.map((inst) => {
                  const isChosen = last?.chosen === inst.id;
                  const isCorrectAnswer = last?.round.correctAnswer === inst.id;
                  let className = 'jl-quiz-answer';
                  if (answered && last) {
                    if (isChosen && last.correct) className += ' correct';
                    else if (isChosen) className += ' wrong';
                    else if (isCorrectAnswer) className += ' correct';
                    else className += ' disabled';
                  }

                  return (
                    <button
                      type="button"
                      key={inst.id}
                      className={className}
                      aria-disabled={answered || undefined}
                      onClick={() => {
                        if (quiz.gameState === 'playing') quiz.submitAnswer(inst.id);
                      }}
                    >
                      <span className="jl-answer-icon" aria-hidden="true"><InstrumentIcon id={inst.id} /></span>
                      <span className="jl-answer-name">{inst.name}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {answered && last && (
              <Verdict
                key={`${quiz.mode}-${quiz.currentRound}`}
                className="jl-feedback"
                titleClassName="jl-feedback-title"
                tone={last.correct ? 'right' : 'wrong'}
                title={
                  last.correct
                    ? `Correct — it's the ${INSTRUMENT_MAP[last.round.correctAnswer].name}.`
                    : `Not quite — it was the ${INSTRUMENT_MAP[last.round.correctAnswer].name}.`
                }
              >
                <p className="jl-feedback-tip">{INSTRUMENT_MAP[last.round.correctAnswer].tip}</p>
                <div className="jl-feedback-foot">
                  <button type="button" className="jl-btn jl-next-btn" onClick={quiz.nextRound}>
                    {quiz.currentRound + 1 >= quiz.totalRounds ? 'See your score' : 'Next sound'}{' '}
                    <span aria-hidden="true">{'→'}</span>
                  </button>
                </div>
              </Verdict>
            )}

            <div className="jl-quiz-score-bar">
              <div className="jl-score-item">
                <div className="jl-score-number">{quiz.score}</div>
                <div className="jl-score-label">Correct</div>
              </div>
              <div className="jl-score-item">
                <div className="jl-score-number">{quiz.records.length}</div>
                <div className="jl-score-label">Played</div>
              </div>
            </div>
          </>
        ) : (
          <QuizResult quiz={quiz} />
        )}
      </div>
    </div>
  );
}

function QuizResult({ quiz }: { quiz: Quiz }) {
  const total = quiz.records.length;
  const missed = quiz.records.filter((r) => !r.correct).length;
  const rows = instrumentBreakdown(quiz.records, ALL_INSTRUMENT_IDS);
  const replay = quiz.mode === 'replay';
  const tier = tierFor(quiz.score, total, QUIZ_TIERS);

  const title = replay ? (missed === 0 ? 'Every one, the second time around.' : 'Second listen') : tier.title;
  const message = replay
    ? `You named ${quiz.score} of the ${plural(total, 'sound')} you missed the first time.`
    : tier.message;

  const actions: GameAction[] = [];
  if (!replay && missed > 0) {
    actions.push({
      label: missed === 1 ? 'Replay the one you missed' : `Replay the ${missed} you missed`,
      onClick: quiz.replayMissed,
      primary: true,
    });
  }
  actions.push({ label: replay ? 'Play a new game' : 'Play again', onClick: quiz.startGame, primary: actions.length === 0 });

  return (
    <div className="jl-quiz-result">
      <GameResult
        eyebrow={replay ? 'Name That Instrument · replay' : 'Name That Instrument'}
        score={quiz.score}
        scoreCaption={`out of ${total}`}
        title={title}
        message={<p>{message}</p>}
        actions={actions}
      >
        <ul className="jl-breakdown" aria-label="By instrument">
          {rows.map((row) => (
            <li key={row.id} className={row.correct === row.total ? 'perfect' : ''}>
              <InstrumentIcon id={row.id} />
              <span className="jl-breakdown-name">{INSTRUMENT_MAP[row.id].name}</span>
              <span className="jl-breakdown-score">
                {row.correct}/{row.total}
              </span>
            </li>
          ))}
        </ul>
      </GameResult>
    </div>
  );
}
