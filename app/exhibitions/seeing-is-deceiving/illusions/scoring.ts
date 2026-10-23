import { plural, type Tier } from '@/components/games/scoring';
import type { IllusionItem } from './data';

export type PerceptionResult = { id: string; index: number; name: string; fooled: boolean };

/**
 * "Fooled X of N": N counts the scored illusions answered so far (ambiguous
 * figures like Rubin's vase have no wrong answer and are left out).
 */
export function perceptionTally(items: readonly IllusionItem[], answers: Record<string, string>) {
  const results: PerceptionResult[] = [];
  items.forEach((item, index) => {
    if (item.type !== 'illusion' || !item.scored || !item.id) return;
    const choice = answers[item.id];
    if (!choice) return;
    results.push({ id: item.id, index, name: item.name ?? item.id, fooled: !(item.truth ?? []).includes(choice) });
  });
  const fooled = results.filter((r) => r.fooled).length;
  return { answered: results.length, fooled, results };
}

/** The ending's headline. */
export function shortcutsTitle(fooled: number): string {
  if (fooled === 0) return 'Your brain took no shortcuts. This time.';
  return `Your brain took ${plural(fooled, 'shortcut')}.`;
}

/** Messages by the share of answered illusions that fooled the player. */
export const PERCEPTION_TIERS: Tier[] = [
  { min: 0.75, title: 'Fooled by most', message: 'That isn’t failure — it’s your visual system doing its job, fast.' },
  { min: 0.4, title: 'A mix', message: 'A healthy mix: you saw through some tricks and fell for others.' },
  { min: 0, title: 'Sharp eyes', message: 'Sharp eyes. But knowing a trick rarely switches it off — look again at any of them.' },
];
