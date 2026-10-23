'use client';

import { useMemo } from 'react';
import Magnifier from '@/components/games/Magnifier';
import { tierFor } from '@/components/games/scoring';
import ProjectorStage, { type ProjectorEnding, type ProjectorItem } from '@/components/games/projector/ProjectorStage';
import type { Stage } from '@/components/games/projector/machine';
import { useBoxSize } from '@/components/games/projector/useBoxSize';
import { ITH_CLASSROOM_LINKS, ITH_PROJECTOR_FONTS, ITH_PROJECTOR_THEME } from '@/components/games/projector/themes';
import pj from '@/components/games/projector/projector.module.css';
import { CLOSING, ROUNDS, TIERS, type ReplicaRound, type Side } from './data';

const other = (s: Side): Side => (s === 'a' ? 'b' : 'a');
const coin = (s: Side) => `Coin ${s.toUpperCase()}`;

function Coins({ round, fakeSide, stage }: { round: ReplicaRound; fakeSide: Side; stage: Stage }) {
  const [ref, box] = useBoxSize<HTMLDivElement>();
  const revealed = stage === 'reveal';
  // Side by side while the class looks; one above the other beside the
  // explanation once revealed. As large as the frame allows (a label needs
  // about 70px, the frame 32px).
  const maxHeight = revealed
    ? Math.max(100, Math.min(box.h / 2 - 90, (box.w - 32) / 2.1))
    : Math.max(120, Math.min(box.h - 90, (box.w / 2 - 50) / 2.1));
  const size = Math.round(Math.max(30, Math.min(52, maxHeight / 7)));
  return (
    <div ref={ref} className={pj.mediaFill} style={{ flexDirection: revealed ? 'column' : 'row', gap: revealed ? '2%' : '4%' }}>
      {(['a', 'b'] as Side[]).map((side) => {
        const isFake = side === fakeSide;
        const on = isFake ? 'fake' : 'real';
        const callouts = revealed
          ? round.callouts.map((c, i) => ({ ...c, n: i + 1 })).filter((c) => c.on === on).map(({ n, x, y }) => ({ n, x, y }))
          : undefined;
        return (
          <figure key={`${round.id}-${side}`} style={{ margin: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4em', flex: revealed ? '0 1 auto' : '1 1 0', minWidth: 0, width: '100%' }}>
            <div
              style={{
                borderRadius: 12,
                background: '#0d0a04',
                padding: 12,
                border: `4px solid ${revealed ? (isFake ? 'var(--pj-wrong)' : 'var(--pj-right)') : 'transparent'}`,
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              {box.h > 0 && (
                <Magnifier
                  src={isFake ? round.fakeImage : round.realImage}
                  alt={`${coin(side)}: ${round.coinName}, both faces`}
                  maxHeight={maxHeight}
                  lens={Math.round(Math.min(320, maxHeight * 0.9))}
                  callouts={callouts}
                  calloutTone={isFake ? 'wrong' : 'right'}
                  calloutSize={size}
                  style={{ ['--game-accent' as string]: '#C9A84C', ['--game-right' as string]: '#7cc98a', ['--game-wrong' as string]: '#e0b45c' }}
                />
              )}
            </div>
            <figcaption
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6em',
                fontSize: 'max(18px, calc(var(--u) * 1.9))',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--pj-ink)',
              }}
            >
              {coin(side)}
              {revealed && (
                <span
                  style={{
                    fontSize: '0.7em',
                    padding: '0.2em 0.7em',
                    borderRadius: 100,
                    border: '2px solid currentColor',
                    color: isFake ? 'var(--pj-wrong)' : 'var(--pj-right)',
                  }}
                >
                  {isFake ? 'Fake' : 'Genuine'}
                </span>
              )}
            </figcaption>
          </figure>
        );
      })}
    </div>
  );
}

function buildItems(sides: Side[]): ProjectorItem[] {
  return ROUNDS.map((round, i) => {
    const fakeSide = sides[i] ?? 'a';
    const fake = coin(fakeSide);
    return {
      id: round.id,
      kicker: round.coinName,
      prompt: 'Which is the fake?',
      choices: (['a', 'b'] as Side[]).map((s) => ({ id: s, label: coin(s) })),
      judge: (choice) => choice === fakeSide,
      verdict: (pick) =>
        pick === null
          ? { tone: 'neutral', title: `${fake} is the fake.` }
          : pick === fakeSide
            ? { tone: 'right', title: `Correct! ${fake} is the fake.` }
            : { tone: 'wrong', title: `Not quite — ${fake} is the fake.` },
      media: ({ stage }) => <Coins round={round} fakeSide={fakeSide} stage={stage} />,
      explanation: (
        <div>
          <div>
            <p className={pj.label}>Method: {round.method}</p>
            <p className={pj.label} id={`pj-look-${round.id}`}>Look closer — the numbers on the coins</p>
            <ol className={pj.points} aria-labelledby={`pj-look-${round.id}`}>
              {round.callouts.map((c, n) => (
                <li key={n}>
                  <span className={pj.pointN} data-tone={c.on === 'fake' ? 'wrong' : 'right'} aria-hidden="true">{n + 1}</span>
                  <span>
                    <span className={pj.pointWhere}>
                      {c.on === 'fake' ? 'Fake' : 'Genuine'} (coin {(c.on === 'fake' ? fakeSide : other(fakeSide)).toUpperCase()})
                    </span>{' '}
                    {c.text}
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <p className={pj.small} style={{ marginTop: '0.9em' }}>{round.explanation}</p>
        </div>
      ),
      teacherTip: round.teacherTip,
      teacherNote: round.teacherNote,
    };
  });
}

const ENDING: ProjectorEnding = {
  eyebrow: 'Real or Replica? · Your class',
  result: (t) => {
    const tier = tierFor(t.correct, t.voted, TIERS);
    return { value: t.correct, caption: `out of ${t.voted}`, title: tier.title, message: tier.message };
  },
  discuss: <p>{CLOSING}</p>,
  missedLabel: 'Look again at the ones that fooled the class',
  links: ITH_CLASSROOM_LINKS,
};

export default function RealOrReplicaProjector({
  sides,
  onExit,
  onRestart,
}: {
  sides: Side[] | null;
  onExit: () => void;
  onRestart: () => void;
}) {
  const items = useMemo(() => (sides ? buildItems(sides) : null), [sides]);
  return (
    <ProjectorStage
      title="Real or Replica?"
      noun="Round"
      nounPlural="rounds"
      items={items}
      layout={{ question: 'stack', vote: 'stack', reveal: 'side' }}
      theme={ITH_PROJECTOR_THEME}
      fonts={ITH_PROJECTOR_FONTS}
      ending={ENDING}
      onExit={onExit}
      onRestart={onRestart}
    />
  );
}
