'use client';

/*
 * The numbered steps at the head of a bench's card ("Step 2 of 5", a dot
 * for each, done or not), and the Back and Next buttons at its foot. Each
 * step's dot is a button, so a teacher can jump straight to one on the
 * projector.
 */

export function StepDots({ steps, at, done, onGo, label }: { steps: { id: string; title: string }[]; at: number; done: (i: number) => boolean; onGo: (i: number) => void; label: string }) {
  return (
    <nav className="vbi-steps-nav" aria-label={label}>
      <p className="vbi-step-count">
        Step {at + 1} of {steps.length}
      </p>
      <ol className="vbi-step-dots">
        {steps.map((s, i) => (
          <li key={s.id}>
            <button type="button" className="vbi-step-dot" aria-current={i === at ? 'step' : undefined} data-done={done(i) || undefined} aria-label={`Step ${i + 1}: ${s.title}${done(i) ? ' (done)' : ''}`} onClick={() => onGo(i)}>
              {done(i) ? '✓' : i + 1}
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function StepButtons({ at, count, onGo, nextLabel }: { at: number; count: number; onGo: (i: number) => void; nextLabel?: string }) {
  return (
    <div className="vbr-actions vbi-step-buttons">
      <button type="button" className="vbr-button" onClick={() => onGo(at - 1)} disabled={at === 0}>
        <span aria-hidden="true">←</span> Back
      </button>
      {at < count - 1 && (
        <button type="button" className="vbr-button vbr-button-primary" onClick={() => onGo(at + 1)}>
          {nextLabel ?? 'Next step'} <span aria-hidden="true">→</span>
        </button>
      )}
    </div>
  );
}
