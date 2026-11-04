'use client';

import { useMemo } from 'react';
import { tierFor } from '@/components/games/scoring';
import ProjectorStage, { type ProjectorEnding, type ProjectorItem } from '@/components/games/projector/ProjectorStage';
import pj from '@/components/games/projector/projector.module.css';
import { ITH_CLASSROOM_LINKS, ITH_PROJECTOR_FONTS, ITH_PROJECTOR_THEME } from '@/components/games/projector/themes';
import { CLOSING, TIERS, type HandsRound } from './data';

function buildItems(rounds: HandsRound[]): ProjectorItem[] {
  return rounds.map(({ character, options }) => ({
    id: character.id,
    prompt: character.prompt,
    choices: options.map((o) => ({ id: o.character, label: o.character })),
    judge: (choice) => choice === character.character,
    verdict: (pick) =>
      pick === null
        ? { tone: 'neutral', title: `These were the hands of ${character.character}.` }
        : pick === character.character
          ? { tone: 'right', title: `Correct! ${character.character}.` }
          : { tone: 'wrong', title: `Not quite — these were the hands of ${character.character}.` },
    media: ({ stage }) => {
      const revealed = stage === 'reveal';
      return (
        <div className={pj.mediaFill}>
          <div className={pj.mediaFrame}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={revealed ? 'full' : 'hands'}
              className={pj.picture}
              src={revealed ? character.fullImage : character.handsImage}
              alt={revealed ? character.character : 'Whose hands?'}
            />
          </div>
        </div>
      );
    },
    explanation: (
      <>
        {/* The coin's caption names it ("Widow's Mite"…), so it is shown with the answer, not above the question. */}
        <p className={pj.label}>{character.caption}</p>
        <p className={pj.label}>Why these hands</p>
        <p className={pj.lead}>{character.clue}</p>
        <p className={pj.small} style={{ marginTop: '1em' }}>{character.story}</p>
      </>
    ),
    teacherTip: character.teacherTip,
    teacherNote: character.teacherNote,
  }));
}

const ENDING: ProjectorEnding = {
  eyebrow: 'Hands of History · Your class',
  result: (t) => {
    const tier = tierFor(t.correct, t.voted, TIERS);
    return { value: t.correct, caption: `out of ${t.voted}`, title: tier.title, message: tier.message };
  },
  discuss: <p>{CLOSING}</p>,
  missedLabel: 'Look again at the hands that kept their secret',
  links: ITH_CLASSROOM_LINKS,
};

export default function HandsProjector({
  rounds,
  onExit,
  onRestart,
}: {
  rounds: HandsRound[] | null;
  onExit: () => void;
  onRestart: () => void;
}) {
  const items = useMemo(() => (rounds ? buildItems(rounds) : null), [rounds]);
  return (
    <ProjectorStage
      title="Hands of History"
      noun="Round"
      nounPlural="rounds"
      items={items}
      layout="side"
      theme={ITH_PROJECTOR_THEME}
      fonts={ITH_PROJECTOR_FONTS}
      ending={ENDING}
      onExit={onExit}
      onRestart={onRestart}
    />
  );
}
