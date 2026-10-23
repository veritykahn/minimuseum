'use client';

import { useMemo } from 'react';
import IllusionRenderer from '@/components/IllusionRenderer';
import { tierFor } from '@/components/games/scoring';
import ProjectorStage, { type ProjectorEnding, type ProjectorItem } from '@/components/games/projector/ProjectorStage';
import pj from '@/components/games/projector/projector.module.css';
import { SEEING_CLASSROOM_LINKS, SEEING_PROJECTOR_FONTS, SEEING_PROJECTOR_THEME } from '@/components/games/projector/themes';
import { ILLUSION_CONTENT, type IllusionItem } from './data';
import { PERCEPTION_TIERS, shortcutsTitle } from './scoring';

const noop = () => {};

/**
 * The verdict with no class answer recorded: the "sharp" line without its
 * praise ("Sharp eyes! They’re identical." → "They’re identical."), where
 * what is left still stands on its own.
 */
export function plainAnswer(item: IllusionItem): string {
  const m = item.sharpLine?.match(/^(?:Sharp|Steady) eyes!\s*(.+)$/);
  if (m && !/caught it/i.test(m[1])) return m[1];
  return 'Here’s the answer.';
}

function buildItems(): ProjectorItem[] {
  return ILLUSION_CONTENT.filter((i): i is IllusionItem & { id: string } => i.type === 'illusion' && Boolean(i.id)).map((item) => {
    const truth = item.truth ?? [];
    // The picture's revealed state needs an answer: the class's, or a right one.
    const shownAnswer = (pick: string | null) => pick ?? truth[0] ?? item.choices?.[0]?.id ?? '';
    return {
      id: item.id,
      kicker: item.name,
      prompt: item.question ?? '',
      choices: item.choices ?? [],
      judge: (choice) => (item.scored ? truth.includes(choice) : null),
      verdict: (pick) => {
        if (!item.scored) return { tone: 'neutral', title: item.neutralLine ?? '' };
        if (pick === null) return { tone: 'neutral', title: plainAnswer(item) };
        return truth.includes(pick)
          ? { tone: 'right', title: item.sharpLine ?? '' }
          : { tone: 'wrong', title: item.fooledLine ?? '', mark: '!' };
      },
      media: ({ stage, pick }) => (
        <IllusionRenderer
          key={item.id}
          item={item}
          answer={stage === 'reveal' ? shownAnswer(pick) : null}
          onAnswer={noop}
          projector
        />
      ),
      explanation: <p className={pj.lead}>{item.answer}</p>,
      teacherTip: item.teacherTip,
      teacherNote: item.teacherNote,
    };
  });
}

const CLOSING = ILLUSION_CONTENT.find((i) => i.type === 'closing')?.text ?? '';

const ENDING: ProjectorEnding = {
  eyebrow: 'Perception Lab · Your class',
  result: (t) => {
    const fooled = t.voted - t.correct;
    return {
      value: fooled,
      caption: `of ${t.voted} illusions fooled the class`,
      title: shortcutsTitle(fooled),
      message: tierFor(fooled, t.voted, PERCEPTION_TIERS).message,
    };
  },
  discuss: <p>{CLOSING}</p>,
  missedLabel: 'Look again at the ones that fooled the class',
  links: SEEING_CLASSROOM_LINKS,
};

export default function PerceptionLabProjector({ onExit }: { onExit: () => void }) {
  const items = useMemo(() => buildItems(), []);
  return (
    <ProjectorStage
      title="Perception Lab"
      noun="Illusion"
      nounPlural="illusions"
      items={items}
      layout={{ question: 'stack', vote: 'stack', reveal: 'side' }}
      theme={SEEING_PROJECTOR_THEME}
      fonts={SEEING_PROJECTOR_FONTS}
      ending={ENDING}
      onExit={onExit}
    />
  );
}
