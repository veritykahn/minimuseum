'use client';

import { useEffect, useMemo } from 'react';
import { mulberry32, tierFor } from '@/components/games/scoring';
import ProjectorStage, { type ProjectorEnding, type ProjectorItem } from '@/components/games/projector/ProjectorStage';
import pj from '@/components/games/projector/projector.module.css';
import { HARLEM_CLASSROOM_LINKS, JAZZ_PROJECTOR_FONTS, JAZZ_PROJECTOR_THEME } from '@/components/games/projector/themes';
import { INSTRUMENTS, INSTRUMENT_MAP, QUIZ_TIERS, type InstrumentId } from './data';
import { generateRounds, type QuizRound, type useAudioEngine } from './hooks';
import InstrumentIcon from './InstrumentIcon';

type Audio = Pick<ReturnType<typeof useAudioEngine>, 'playOnce' | 'stopSource'>;

/** Played automatically only after the page has had a click or a key press. */
function mayAutoplay(): boolean {
  const ua = (navigator as Navigator & { userActivation?: { hasBeenActive: boolean } }).userActivation;
  return ua ? ua.hasBeenActive : true;
}

function PlayButton({ onPlay, stage, answer }: { onPlay: () => void; stage: string; answer: InstrumentId }) {
  const inst = INSTRUMENT_MAP[answer];
  return (
    <div className={pj.mediaFill} style={{ gap: 'calc(var(--u) * 2)' }}>
      {stage === 'reveal' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4em', color: 'var(--pj-accent)' }}>
          <span aria-hidden="true" className={pj.bigIcon}>
            <InstrumentIcon id={answer} />
          </span>
          <span style={{ fontFamily: 'var(--pj-display)', fontSize: 'max(24px, calc(var(--u) * 3))', color: 'var(--pj-ink)' }}>{inst.name}</span>
        </div>
      )}
      <button
        type="button"
        onClick={(e) => {
          if (e.detail > 0) e.currentTarget.blur();
          onPlay();
        }}
        aria-keyshortcuts="P"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.3em',
          width: stage === 'reveal' ? 'calc(var(--u) * 11)' : 'calc(var(--u) * 20)',
          height: stage === 'reveal' ? 'calc(var(--u) * 11)' : 'calc(var(--u) * 20)',
          minWidth: 88,
          minHeight: 88,
          borderRadius: '50%',
          border: '3px solid var(--pj-accent)',
          background: 'color-mix(in srgb, var(--pj-accent) 10%, transparent)',
          color: 'var(--pj-accent)',
          cursor: 'pointer',
          font: 'inherit',
        }}
      >
        <span aria-hidden="true" style={{ fontSize: stage === 'reveal' ? 'max(26px, calc(var(--u) * 3.4))' : 'max(40px, calc(var(--u) * 6.5))', lineHeight: 1 }}>
          {'▶'}
        </span>
        <span style={{ fontSize: 'max(13px, calc(var(--u) * 1.05))', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--pj-ink)' }}>
          {stage === 'reveal' ? 'Hear it again' : <>Play the sound <kbd>P</kbd></>}
        </span>
      </button>
    </div>
  );
}

function buildItems(rounds: QuizRound[], audio: Audio): ProjectorItem[] {
  return rounds.map((round, i) => {
    const inst = INSTRUMENT_MAP[round.correctAnswer];
    const play = () => {
      void audio.playOnce('quiz', round.audioSrc).catch(() => {});
    };
    return {
      id: `${i}-${round.id}`,
      prompt: 'What instrument is this?',
      choices: INSTRUMENTS.map((x) => ({ id: x.id, label: x.name, icon: <InstrumentIcon id={x.id} /> })),
      judge: (choice) => choice === round.correctAnswer,
      verdict: (pick) =>
        pick === null
          ? { tone: 'neutral', title: `It was the ${inst.name}.` }
          : pick === round.correctAnswer
            ? { tone: 'right', title: `Correct — it’s the ${inst.name}.` }
            : { tone: 'wrong', title: `Not quite — it was the ${inst.name}.` },
      media: ({ stage }) => <PlayButton onPlay={play} stage={stage} answer={round.correctAnswer} />,
      explanation: (
        <>
          <p className={pj.lead}>{inst.tip}</p>
          <p className={pj.label} style={{ marginTop: '1em' }}>{inst.fact.title}</p>
          <p className={pj.small}>{inst.fact.text}</p>
        </>
      ),
      teacherTip: inst.teacherTip,
      play,
      onLeave: () => audio.stopSource('quiz'),
      onEnter: (stage) => {
        if (stage === 'question' && mayAutoplay()) play();
      },
    };
  });
}

function hardest(items: { judge: (c: string) => boolean | null }[], missed: number[], rounds: QuizRound[]): InstrumentId | null {
  if (missed.length === 0) return null;
  const counts = new Map<InstrumentId, number>();
  for (const i of missed) {
    const id = rounds[i].correctAnswer;
    counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
}

const PREMISE =
  'Born from the genius of Black musicians in the clubs and dance halls of Harlem, jazz became America’s great art form.';

export default function NameThatInstrumentProjector({
  seed,
  playOnce,
  stopSource,
  onExit,
  onRestart,
}: {
  seed: number | null;
  playOnce: Audio['playOnce'];
  stopSource: Audio['stopSource'];
  onExit: () => void;
  onRestart: () => void;
}) {
  const rounds = useMemo(() => (seed === null ? null : generateRounds(mulberry32(seed))), [seed]);
  const items = useMemo(() => (rounds ? buildItems(rounds, { playOnce, stopSource }) : null), [rounds, playOnce, stopSource]);

  // Leaving the projector stops the sound.
  useEffect(() => () => stopSource('quiz'), [stopSource]);

  const ending: ProjectorEnding = useMemo(
    () => ({
      eyebrow: 'Name That Instrument · Your class',
      result: (t) => {
        const tier = tierFor(t.correct, t.voted, QUIZ_TIERS);
        return { value: t.correct, caption: `out of ${t.voted}`, title: tier.title, message: tier.message };
      },
      discuss: (t) => {
        const id = items && rounds ? hardest(items, t.missed, rounds) : null;
        if (!id) return <p>{PREMISE}</p>;
        const inst = INSTRUMENT_MAP[id];
        return (
          <>
            <p>Which sound was hardest to name? The class missed the {inst.name.toLowerCase()} most often.</p>
            <p>{inst.tip}</p>
          </>
        );
      },
      missedLabel: 'Hear again the sounds the class missed',
      links: HARLEM_CLASSROOM_LINKS,
    }),
    [items, rounds],
  );

  return (
    <ProjectorStage
      title="Name That Instrument"
      noun="Sound"
      nounPlural="sounds"
      items={items}
      layout="side"
      theme={JAZZ_PROJECTOR_THEME}
      fonts={JAZZ_PROJECTOR_FONTS}
      ending={ending}
      onExit={onExit}
      onRestart={onRestart}
    />
  );
}
