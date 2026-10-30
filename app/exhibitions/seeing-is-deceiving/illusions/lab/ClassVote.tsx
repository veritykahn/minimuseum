'use client';

import type { Illusion } from './data';

/*
 * Class mode's hands-up tally: the teacher counts the hands for each answer
 * with big + and − buttons, and the bars grow as they do. Nothing is stored
 * or sent; the tallies feed the class fingerprint in the class notebook.
 */
export default function ClassVote({ illusion, votes, onChange }: { illusion: Illusion; votes: Record<string, number>; onChange: (v: Record<string, number>) => void }) {
  const total = illusion.vote.options.reduce((a, o) => a + (votes[o.id] ?? 0), 0);
  const most = Math.max(1, ...illusion.vote.options.map((o) => votes[o.id] ?? 0));
  const set = (id: string, n: number) => onChange({ ...votes, [id]: Math.max(0, n) });
  return (
    <section className="pl-vote" aria-labelledby={`pl-vote-${illusion.id}`}>
      <h2 id={`pl-vote-${illusion.id}`} className="pl-vote-q">
        {illusion.vote.question}
      </h2>
      <ul className="pl-vote-list">
        {illusion.vote.options.map((o) => {
          const n = votes[o.id] ?? 0;
          return (
            <li key={o.id} className="pl-vote-row">
              <span className="pl-vote-label">{o.label}</span>
              <span className="pl-vote-bar" aria-hidden="true">
                <span style={{ width: `${(n / most) * 100}%` }} />
              </span>
              <span className="pl-vote-n" aria-live="polite">
                {n}
              </span>
              <button type="button" className="pl-btn pl-btn-icon" onClick={() => set(o.id, n - 1)} disabled={n === 0} aria-label={`One fewer: ${o.label}`}>
                −
              </button>
              <button type="button" className="pl-btn pl-btn-icon" onClick={() => set(o.id, n + 1)} aria-label={`One more: ${o.label}`}>
                +
              </button>
            </li>
          );
        })}
      </ul>
      <p className="pl-vote-total">
        {total} {total === 1 ? 'hand' : 'hands'}
        {total > 0 && (
          <button type="button" className="pl-link" onClick={() => onChange({})}>
            Clear
          </button>
        )}
      </p>
    </section>
  );
}
