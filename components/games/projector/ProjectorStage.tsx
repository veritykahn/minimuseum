'use client';

import Link from 'next/link';
import { useCallback, useEffect, useReducer, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from 'react';
import Announcer from '../Announcer';
import type { VerdictTone } from '../Verdict';
import {
  classTally,
  initialProjectorState,
  keyCommand,
  projectorReducer,
  voteLine,
  type ClassTally,
  type Notice,
  type ProjectorState,
  type Stage,
} from './machine';
import { holdProjectorScreen } from './useProjectorMode';
import styles from './projector.module.css';

/* ───────── What a game hands the projector ───────── */

export type ProjectorChoice = { id: string; label: string; icon?: ReactNode };

export type ProjectorItem = {
  id: string;
  /** Small line above the question: the illusion's or coin's name. */
  kicker?: string;
  /** The question, as the game words it. */
  prompt: string;
  choices: ProjectorChoice[];
  /** True if the choice is right, false if wrong, null where nothing is wrong. */
  judge: (choice: string) => boolean | null;
  /** The verdict line for the class's answer, or for no recorded answer. */
  verdict: (pick: string | null) => { tone: VerdictTone; title: string; mark?: string };
  /** The picture, the coins, the play button… drawn for the stage. */
  media: (ctx: { stage: Stage; pick: string | null }) => ReactNode;
  /** The explanation shown, large, under the verdict. */
  explanation: ReactNode;
  teacherTip?: string;
  /** A collapsed content note for the teacher (shown before the reveal too). */
  teacherNote?: string;
  /** Called when the item reaches a stage (Name That Instrument plays its sound). */
  onEnter?: (stage: Stage) => void;
  /** P: play the sound again. */
  play?: () => void;
};

export type ProjectorEnding = {
  eyebrow: string;
  /** The big number, its caption and the headline, from the class's answers. */
  result: (t: ClassTally) => { value: number; caption: string; title: string; message?: string };
  /** "Discuss": a prompt drawn from the game's own words. */
  discuss: ReactNode | ((t: ClassTally) => ReactNode);
  /** Heading over the buttons that go back to the items the class missed. */
  missedLabel?: string;
  links: { label: string; href: string }[];
};

type Props = {
  /** "Real or Replica?" */
  title: string;
  /** "Round", "Illusion", "Sound": used in "Round 2 of 5". */
  noun: string;
  /** "rounds", "illusions", "sounds". */
  nounPlural: string;
  /** Null until the game's order is shuffled in the browser. */
  items: ProjectorItem[] | null;
  /**
   * 'side': picture left, words right. 'stack': question, picture, then the
   * choices. Either one for every stage, or per stage (default 'stack').
   */
  layout: Layout | Partial<Record<Exclude<Stage, 'ended'>, Layout>>;
  /** The game's colors and fonts, as --pj-* custom properties. */
  theme: CSSProperties;
  /** A Google Fonts stylesheet for the theme's faces (the game's own import is not on screen). */
  fonts?: string;
  ending: ProjectorEnding;
  onExit: () => void;
  /** Play again: the game reshuffles, then the projector starts over. */
  onRestart?: () => void;
};

type Layout = 'side' | 'stack';

const MARKS: Record<VerdictTone, string> = { right: '✓', wrong: '✕', neutral: '◆' };
const STAGES: { id: Exclude<Stage, 'ended'>; label: string }[] = [
  { id: 'question', label: 'Question' },
  { id: 'vote', label: 'Class vote' },
  { id: 'reveal', label: 'Reveal' },
];
const TEAM_NAMES = ['Team 1', 'Team 2'] as const;
/** The ending lists at most this many missed items as buttons. */
const MAX_CHIPS = 8;

/** After a mouse or touch press, hand focus back so Space means "next". */
function release(e: MouseEvent<HTMLElement>) {
  if (e.detail > 0) e.currentTarget.blur();
}

function noticeText(n: Notice, item: ProjectorItem | undefined): string {
  switch (n.kind) {
    case 'countdown-start':
      return `Countdown started: ${n.seconds} seconds.`;
    case 'countdown-extend':
      return `Countdown: ${n.seconds} seconds left.`;
    case 'countdown-done':
      return 'Time’s up. Reveal when you’re ready.';
    case 'countdown-stop':
      return 'Countdown stopped.';
    case 'pick': {
      const label = item?.choices.find((c) => c.id === n.choice)?.label;
      return label ? `Class answer: ${label}.` : 'Class answer cleared.';
    }
    case 'team':
      return `${TEAM_NAMES[n.team]}: ${n.score} ${n.score === 1 ? 'point' : 'points'}.`;
    case 'tips':
      return n.on ? 'Teacher tips on.' : 'Teacher tips off.';
    case 'teams':
      return n.on ? 'Team scores on.' : 'Team scores off.';
  }
}

export default function ProjectorStage({ title, noun, nounPlural, items, layout, theme, fonts, ending, onExit, onRestart }: Props) {
  const total = items?.length ?? 0;
  const [state, dispatch] = useReducer(projectorReducer, total, initialProjectorState);
  const [fullscreen, setFullscreen] = useState(false);

  // The game's items arrive after mount (they are shuffled in the browser).
  useEffect(() => {
    if (items && state.total !== items.length) dispatch({ type: 'restart', total: items.length });
  }, [items, state.total]);

  useEffect(() => holdProjectorScreen(), []);

  useEffect(() => {
    const onChange = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const item = items?.[state.index];
  const pick = item ? state.picks[item.id] ?? null : null;
  const tally = items ? classTally(items, state.picks) : { voted: 0, correct: 0, missed: [] };

  // The countdown ticks once a second while it runs.
  const running = state.countdown?.running ?? false;
  useEffect(() => {
    if (!running) return;
    const t = window.setInterval(() => dispatch({ type: 'tick' }), 1000);
    return () => window.clearInterval(t);
  }, [running]);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void document.documentElement.requestFullscreen?.().catch(() => {});
  }, []);

  const exit = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
    onExit();
  }, [onExit]);

  const restart = useCallback(() => {
    onRestart?.();
    dispatch({ type: 'restart' });
  }, [onRestart]);

  // Keys: captured on the window before the game's own handlers, so a
  // clicker's → never also moves the page's carousel underneath.
  const stateRef = useRef<ProjectorState>(state);
  const itemRef = useRef(item);
  useEffect(() => {
    stateRef.current = state;
    itemRef.current = item;
  });
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const s = stateRef.current;
      const it = itemRef.current;
      const t = e.target as HTMLElement | null;
      const tag = t?.tagName;
      const cmd = keyCommand(
        e.key,
        {
          stage: s.stage,
          choiceCount: it?.choices.length ?? 0,
          onControl: tag === 'BUTTON' || tag === 'A' || tag === 'SUMMARY',
          inField: tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || Boolean(t?.isContentEditable) || Boolean(t?.closest?.('[role="slider"]')),
          inMagnifier: Boolean(t?.closest?.('[aria-roledescription="magnifier"]')),
          countdown: s.countdown,
        },
        { alt: e.altKey, ctrl: e.ctrlKey, meta: e.metaKey },
      );
      if (!cmd) return;
      // A modal dialog on top (an illusion's "The Science" card) keeps its keys.
      if (document.querySelector('[role="dialog"][aria-modal="true"]:not([inert])')) return;
      e.preventDefault();
      e.stopPropagation();
      if (cmd.type === 'fullscreen') toggleFullscreen();
      else if (cmd.type === 'play') it?.play?.();
      else if (cmd.type === 'pickIndex') {
        const c = it?.choices[cmd.index];
        if (it && c) dispatch({ type: 'pick', itemId: it.id, choice: c.id });
      } else dispatch(cmd);
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [toggleFullscreen]);

  // Each new stage puts focus on its own heading, so the next Tab starts
  // there and Space keeps meaning "next".
  const focusRef = useRef<HTMLHeadingElement | null>(null);
  useEffect(() => {
    focusRef.current?.focus({ preventScroll: true });
  }, [state.stage, state.index, items]);

  useEffect(() => {
    if (item && state.stage !== 'ended') item.onEnter?.(state.stage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.stage, state.index, items]);

  if (!items || !item) {
    return (
      <div className={styles.root} style={theme}>
        {fonts && <link rel="stylesheet" href={fonts} precedence="default" />}
        <div className={styles.frame}>
          <p className={styles.loading} role="status">
            Setting up the projector…
          </p>
        </div>
      </div>
    );
  }

  const stage = state.stage;
  const verdict = item.verdict(pick);
  const choiceLabel = item.choices.find((c) => c.id === pick)?.label;
  const vote = voteLine(item.choices.map((c) => c.label));
  const stageText =
    stage === 'question'
      ? `${noun} ${state.index + 1} of ${total}. ${item.prompt}`
      : stage === 'vote'
        ? `Class vote. ${vote} ${item.choices.map((c, i) => `${i + 1}: ${c.label}`).join(', ')}.`
        : stage === 'reveal'
          ? `Reveal. ${verdict.title}`
          : `${ending.eyebrow}: finished.`;
  const announcement = state.notice ? noticeText(state.notice, item) : stageText;

  const tools = (
    <nav className={styles.tools} aria-label="Projector tools">
      <button
        type="button"
        className={styles.tool}
        aria-pressed={state.teams.on}
        onClick={(e) => {
          release(e);
          dispatch({ type: 'toggleTeams' });
        }}
      >
        Teams
      </button>
      <button
        type="button"
        className={styles.tool}
        aria-pressed={state.tips}
        aria-keyshortcuts="T"
        onClick={(e) => {
          release(e);
          dispatch({ type: 'toggleTips' });
        }}
      >
        Tips <kbd>T</kbd>
      </button>
      <button
        type="button"
        className={styles.tool}
        aria-pressed={fullscreen}
        aria-keyshortcuts="F"
        onClick={(e) => {
          release(e);
          toggleFullscreen();
        }}
      >
        {fullscreen ? 'Exit full screen' : 'Full screen'} <kbd>F</kbd>
      </button>
      <button type="button" className={`${styles.tool} ${styles.toolExit}`} onClick={exit}>
        Exit projector
      </button>
    </nav>
  );

  const teams = state.teams.on && (
    <div className={styles.teams} role="group" aria-label="Team scores">
      {TEAM_NAMES.map((name, t) => (
        <div className={styles.team} key={name} data-team={t}>
          <span className={styles.teamName}>{name}</span>
          <span className={styles.teamScore} aria-label={`${name}: ${state.teams.scores[t]}`}>
            {state.teams.scores[t]}
          </span>
          <button
            type="button"
            className={styles.teamBtn}
            aria-label={`−1 for ${name}`}
            disabled={state.teams.scores[t] === 0}
            onClick={(e) => {
              release(e);
              dispatch({ type: 'award', team: t as 0 | 1, delta: -1 });
            }}
          >
            −1
          </button>
          <button
            type="button"
            className={`${styles.teamBtn} ${styles.teamPlus}`}
            aria-label={`+1 for ${name}`}
            onClick={(e) => {
              release(e);
              dispatch({ type: 'award', team: t as 0 | 1, delta: 1 });
            }}
          >
            +1
          </button>
        </div>
      ))}
    </div>
  );

  const keys = (
    <p className={styles.keys}>
      <span><kbd>→</kbd> next</span>
      <span><kbd>←</kbd> back</span>
      {stage === 'vote' && (
        <>
          <span><kbd>1</kbd>–<kbd>{item.choices.length}</kbd> class answer</span>
          <span><kbd>C</kbd> countdown</span>
        </>
      )}
      {item.play && stage !== 'ended' && <span><kbd>P</kbd> play</span>}
      <span><kbd>T</kbd> tip</span>
    </p>
  );

  /* ───────── The ending ───────── */

  if (stage === 'ended') {
    // Without a recorded class answer there is no class score to give.
    const r =
      tally.voted > 0
        ? ending.result(tally)
        : {
            value: total,
            caption: `${nounPlural} revealed`,
            title: 'No class answers recorded.',
            message: 'Tap the class’s answer during each vote to keep a class score.',
          };
    const [a, b] = state.teams.scores;
    const teamLine = !state.teams.on ? null : a === b ? `A tie: ${a} all.` : `${a > b ? TEAM_NAMES[0] : TEAM_NAMES[1]} wins, ${Math.max(a, b)} to ${Math.min(a, b)}.`;
    return (
      <div className={styles.root} style={theme}>
        {fonts && <link rel="stylesheet" href={fonts} precedence="default" />}
        <div className={styles.frame} data-stage="ended">
          <header className={styles.bar}>
            <p className={styles.barTitle}>{title}</p>
            {tools}
          </header>
          <div className={styles.ending}>
            <div className={styles.endingCol}>
              <p className={styles.eyebrow}>{ending.eyebrow}</p>
              <p className={styles.bigScore}>
                <span className={styles.bigNumber} aria-hidden="true">{r.value}</span>
                <span className={styles.bigCaption} aria-hidden="true">{r.caption}</span>
                <span className={styles.srOnly}>{`${r.value} ${r.caption}`}</span>
              </p>
              <h1 className={styles.endingTitle} ref={focusRef} tabIndex={-1}>
                {r.title}
              </h1>
              {r.message && <p className={styles.endingMessage}>{r.message}</p>}
              {teamLine && <p className={styles.teamLine}>{teamLine}</p>}
              {tally.missed.length > 0 && ending.missedLabel && (
                <div className={styles.lookAgain}>
                  <h2 className={styles.smallHeading}>{ending.missedLabel}</h2>
                  <ul>
                    {tally.missed.slice(0, MAX_CHIPS).map((i) => (
                      <li key={items[i].id}>
                        <button
                          type="button"
                          className={styles.chip}
                          onClick={() => dispatch({ type: 'goto', index: i, stage: 'reveal' })}
                        >
                          {items[i].kicker ?? `${noun} ${i + 1}`}
                        </button>
                      </li>
                    ))}
                    {tally.missed.length > MAX_CHIPS && (
                      <li className={styles.more}>and {tally.missed.length - MAX_CHIPS} more</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
            <div className={styles.endingCol}>
              <section className={styles.discuss} aria-labelledby="pj-discuss">
                <h2 className={styles.discussLabel} id="pj-discuss">Discuss</h2>
                <div className={styles.discussBody}>{typeof ending.discuss === 'function' ? ending.discuss(tally) : ending.discuss}</div>
              </section>
              {ending.links.length > 0 && (
                <div className={styles.links}>
                  <h2 className={styles.smallHeading}>For the classroom</h2>
                  <ul>
                    {ending.links.map((l) => (
                      <li key={l.href}>
                        <Link href={l.href} className={styles.link}>
                          {l.label} <span aria-hidden="true">→</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className={styles.endActions}>
                <button type="button" className={`${styles.action} ${styles.actionPrimary}`} onClick={restart}>
                  Play again
                </button>
                <button type="button" className={styles.action} onClick={exit}>
                  Back to the game
                </button>
              </div>
            </div>
          </div>
          <footer className={styles.foot}>
            {teams}
            {keys}
          </footer>
          <Announcer message={announcement} />
        </div>
      </div>
    );
  }

  /* ───────── Question, vote and reveal ───────── */

  const tip = state.tips && stage === 'reveal' && item.teacherTip;
  const lay: Layout = typeof layout === 'string' ? layout : (layout[stage] ?? 'stack');
  const countdown = state.countdown;

  return (
    <div className={styles.root} style={theme}>
      {fonts && <link rel="stylesheet" href={fonts} precedence="default" />}
      <div className={styles.frame} data-stage={stage} data-layout={lay}>
        <header className={styles.bar}>
          <p className={styles.barTitle}>
            {title}
            <span className={styles.barCount}>
              {noun} {state.index + 1} of {total}
            </span>
          </p>
          <ol className={styles.steps} aria-label="Stages">
            {STAGES.map((s) => (
              <li key={s.id} className={styles.step} aria-current={s.id === stage ? 'step' : undefined}>
                {s.label}
              </li>
            ))}
          </ol>
          {tools}
        </header>

        <div className={styles.main}>
          <div className={styles.ask}>
            {item.kicker && <p className={styles.kicker}>{item.kicker}</p>}
            <h1 className={styles.prompt} ref={stage === 'question' ? focusRef : undefined} tabIndex={-1}>
              {item.prompt}
            </h1>
          </div>

          <div className={styles.media}>{item.media({ stage, pick })}</div>

          <div className={styles.panel}>

            {stage === 'question' && (
              <>
                <ul className={styles.preview} aria-label="The choices">
                  {item.choices.map((c, i) => (
                    <li key={c.id}>
                      <span className={styles.badge} aria-hidden="true">{i + 1}</span>
                      {c.icon && <span className={styles.choiceIcon} aria-hidden="true">{c.icon}</span>}
                      {c.label}
                    </li>
                  ))}
                </ul>
                <div className={styles.cta}>
                  <button
                    type="button"
                    className={`${styles.action} ${styles.actionPrimary}`}
                    aria-keyshortcuts="ArrowRight"
                    onClick={(e) => {
                      release(e);
                      dispatch({ type: 'next' });
                    }}
                  >
                    Class vote <span aria-hidden="true">→</span>
                  </button>
                </div>
              </>
            )}

            {stage === 'vote' && (
              <section className={styles.vote} aria-labelledby="pj-vote">
                <h2 className={styles.voteHead} id="pj-vote" ref={focusRef} tabIndex={-1}>
                  <span className={styles.voteFlag}>Class vote</span>
                  <span className={styles.voteLine}>{vote}</span>
                </h2>
                <div className={styles.choices} role="group" aria-label="Record the class’s answer (optional)" data-count={item.choices.length}>
                  {item.choices.map((c, i) => (
                    <button
                      type="button"
                      key={c.id}
                      className={styles.choice}
                      aria-pressed={pick === c.id}
                      aria-keyshortcuts={String(i + 1)}
                      onClick={(e) => {
                        release(e);
                        dispatch({ type: 'pick', itemId: item.id, choice: c.id });
                      }}
                    >
                      <span className={styles.badge} aria-hidden="true">{i + 1}</span>
                      {c.icon && <span className={styles.choiceIcon} aria-hidden="true">{c.icon}</span>}
                      <span className={styles.choiceLabel}>{c.label}</span>
                      {pick === c.id && <span className={styles.classTag}>Class answer</span>}
                    </button>
                  ))}
                </div>
                <p className={styles.voteHint}>Tap the class’s answer to keep score, or just reveal.</p>
                <div className={styles.voteBar}>
                  <Countdown countdown={countdown} />
                  <div className={styles.countBtns}>
                    {!countdown || !countdown.running ? (
                      <button
                        type="button"
                        className={styles.action}
                        aria-keyshortcuts="C"
                        onClick={(e) => {
                          release(e);
                          dispatch({ type: 'countdownStart' });
                        }}
                      >
                        {countdown ? 'Restart countdown' : '10-second countdown'} <kbd>C</kbd>
                      </button>
                    ) : (
                      <button
                        type="button"
                        className={styles.action}
                        aria-keyshortcuts="C"
                        onClick={(e) => {
                          release(e);
                          dispatch({ type: 'countdownStop' });
                        }}
                      >
                        Skip countdown <kbd>C</kbd>
                      </button>
                    )}
                    {countdown && (
                      <button
                        type="button"
                        className={styles.action}
                        aria-keyshortcuts="+"
                        onClick={(e) => {
                          release(e);
                          dispatch({ type: 'countdownExtend' });
                        }}
                      >
                        +10 sec <kbd>+</kbd>
                      </button>
                    )}
                  </div>
                  <button
                    type="button"
                    className={`${styles.action} ${styles.actionPrimary} ${styles.reveal}`}
                    aria-keyshortcuts="ArrowRight"
                    onClick={(e) => {
                      release(e);
                      dispatch({ type: 'next' });
                    }}
                  >
                    Reveal <span aria-hidden="true">→</span>
                  </button>
                </div>
              </section>
            )}

            {stage === 'reveal' && (
              <section className={styles.revealBox} aria-labelledby="pj-verdict">
                <h2 className={styles.verdict} data-tone={verdict.tone} id="pj-verdict" ref={focusRef} tabIndex={-1}>
                  <span className={styles.verdictMark} aria-hidden="true">{verdict.mark ?? MARKS[verdict.tone]}</span>
                  <span>{verdict.title}</span>
                </h2>
                {choiceLabel && <p className={styles.classSaid}>The class said “{choiceLabel}.”</p>}
                <div className={styles.explain} tabIndex={0} role="region" aria-label="Explanation">
                  {item.explanation}
                </div>
                <div className={styles.cta}>
                  <button
                    type="button"
                    className={`${styles.action} ${styles.actionPrimary}`}
                    aria-keyshortcuts="ArrowRight"
                    onClick={(e) => {
                      release(e);
                      dispatch({ type: 'next' });
                    }}
                  >
                    {state.index + 1 >= total ? 'Class result' : `Next ${noun.toLowerCase()}`} <span aria-hidden="true">→</span>
                  </button>
                </div>
              </section>
            )}
          </div>
        </div>

        <footer className={styles.foot}>
          {(tip || (state.tips && item.teacherNote)) && (
            <div className={styles.tip}>
              {tip && (
                <p>
                  <span className={styles.tipLabel}>Teacher tip</span> {item.teacherTip}
                </p>
              )}
              {item.teacherNote && (
                <details className={styles.note}>
                  <summary>Before you show this</summary>
                  <p>{item.teacherNote}</p>
                </details>
              )}
            </div>
          )}
          <div className={styles.footRow}>
            {teams}
            {keys}
          </div>
        </footer>
        <Announcer message={announcement} />
      </div>
    </div>
  );
}

function Countdown({ countdown }: { countdown: ProjectorState['countdown'] }) {
  if (!countdown) return <div className={styles.countdown} aria-hidden="true" />;
  const share = countdown.peak ? countdown.remaining / countdown.peak : 0;
  const C = 2 * Math.PI * 44;
  const done = countdown.remaining === 0;
  // Numbers step once a second; only the ring glides, and not under reduced motion.
  return (
    <div className={styles.countdown} data-done={done || undefined} aria-hidden="true">
      <svg viewBox="0 0 100 100" className={styles.ring}>
        <circle cx="50" cy="50" r="44" className={styles.ringTrack} />
        <circle
          cx="50"
          cy="50"
          r="44"
          className={styles.ringLeft}
          strokeDasharray={C}
          strokeDashoffset={C * (1 - share)}
          transform="rotate(-90 50 50)"
        />
      </svg>
      <span className={styles.countNumber}>{done ? 'Time' : countdown.remaining}</span>
    </div>
  );
}
