'use client';

import { useEffect, useRef, useState } from 'react';
import { FactSources } from '@/components/exhibition/FactNote';
import { CLAIM, CONCLUSION, EVIDENCE, REASONS, WEIGHING, argumentLines, evidenceTilt, isRight, type Choice, type ReasonId } from './weighEvidence';

/*
 * Tip the scale: weigh the evidence (weighEvidence.ts). Three steps, each
 * on the panel in turn: weigh seven cards one at a time (lay it on the
 * scale, or set it aside; only real evidence moves the beam), choose the
 * heaviest and say why, and read (and print) the argument that makes.
 * Buttons only, so it works the same by touch, mouse, keyboard and clicker.
 */

type Step = 'weigh' | 'choose' | 'argue';

export default function WeighTheEvidence({ onSay, onPrint }: { onSay: (s: string) => void; onPrint: () => void }) {
  const [step, setStep] = useState<Step>('weigh');
  const [index, setIndex] = useState(0);
  const [choices, setChoices] = useState<Partial<Record<string, Choice>>>({});
  const [firstTry, setFirstTry] = useState<Partial<Record<string, boolean>>>({});
  const [heaviest, setHeaviest] = useState<string | null>(null);
  const [reasons, setReasons] = useState<ReasonId[]>([]);
  const [own, setOwn] = useState('');
  const [name, setName] = useState('');
  const headRef = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);

  const card = EVIDENCE[index];
  const choice = choices[card.id];
  const tilt = evidenceTilt(choices);
  const onScale = EVIDENCE.filter((c) => choices[c.id] === 'scale');
  const weighed = WEIGHING.filter((c) => choices[c.id] === 'scale').length;

  // A new card or step: the reader starts at its heading.
  useEffect(() => {
    if (!moved.current) return;
    moved.current = false;
    headRef.current?.focus({ preventScroll: true });
  }, [index, step]);

  const decide = (c: Choice) => {
    const right = isRight(card, c);
    setChoices((x) => ({ ...x, [card.id]: c }));
    if (firstTry[card.id] === undefined) setFirstTry((x) => ({ ...x, [card.id]: right }));
    onSay(`${verdict(card.weighs, c)} ${card.why}`);
  };

  const next = () => {
    moved.current = true;
    if (index < EVIDENCE.length - 1) setIndex(index + 1);
    else {
      setStep('choose');
      onSay('All seven cards are weighed. Now choose the heaviest piece of evidence.');
    }
  };

  const restart = () => {
    moved.current = true;
    setStep('weigh');
    setIndex(0);
    setChoices({});
    setFirstTry({});
    setHeaviest(null);
    setReasons([]);
    setOwn('');
    onSay('The scale is empty again.');
  };

  const chosen = WEIGHING.find((c) => c.id === heaviest);
  const canArgue = !!chosen && (reasons.length > 0 || own.trim().length > 0);
  const arg = chosen ? argumentLines(chosen, reasons, own) : null;
  const rightFirst = EVIDENCE.filter((c) => firstTry[c.id]).length;

  return (
    <div className="whr-weigh" data-step={step}>
      <div className="whr-weigh-claim">
        <p className="whr-weigh-eyebrow">The poster’s claim</p>
        <blockquote className="whr-weigh-claim-text">{CLAIM}</blockquote>
      </div>

      <div className="whr-scale" role="img" aria-label={weighed === 0 ? 'A scale, level: no evidence laid on yet' : `A scale, tipped toward the evidence: ${weighed} of ${WEIGHING.length} pieces of real evidence laid on`}>
        <svg viewBox="0 0 600 300" aria-hidden="true" focusable="false">
          <path className="whr-scale-post" d="M296 70h8v186h-8z M240 256h120l10 18H230z" />
          <g className="whr-beam" style={{ transform: `rotate(${tilt}deg)` }}>
            <rect x="90" y="64" width="420" height="10" rx="5" />
            <circle cx="300" cy="69" r="11" />
            <g className="whr-pan" style={{ transform: `rotate(${-tilt}deg)`, transformOrigin: '100px 69px' }}>
              <path className="whr-cord" d="M100 69 48 186M100 69l52 117" />
              <path className={`whr-dish whr-dish-out${choice === 'scale' && !card.weighs ? ' is-nothing' : ''}`} d="M44 186h112c-6 22-28 32-56 32s-50-10-56-32z" />
              {onScale.map((c, k) => (
                <rect key={c.id} className={`whr-weight${c.weighs ? '' : ' is-nothing'}`} x={54 + (k % 3) * 32} y={166 - Math.floor(k / 3) * 20} width="28" height="18" rx="2" />
              ))}
            </g>
            <g className="whr-pan" style={{ transform: `rotate(${-tilt}deg)`, transformOrigin: '500px 69px' }}>
              <path className="whr-cord" d="M500 69l-52 117M500 69l52 117" />
              <path className="whr-dish" d="M444 186h112c-6 22-28 32-56 32s-50-10-56-32z" />
              <path className="whr-claim-mark" d="M474 158h52v26h-52z" />
            </g>
          </g>
          <text className="whr-scale-label" x="100" y="290" textAnchor="middle">the evidence</text>
          <text className="whr-scale-label" x="500" y="290" textAnchor="middle">the claim on its own</text>
        </svg>
      </div>

      <div className="whr-weigh-work">
        {step === 'weigh' && (
          <section className="whr-card" aria-labelledby="whr-card-head">
            <ol className="whr-dots" aria-hidden="true">
              {EVIDENCE.map((c, i) => (
                <li key={c.id} className={`${i === index ? 'is-now' : ''}${choices[c.id] ? ' is-done' : ''}`} />
              ))}
            </ol>
            <h2 className="whr-card-head" id="whr-card-head" ref={headRef} tabIndex={-1}>
              Evidence {index + 1} of {EVIDENCE.length}
            </h2>
            {/* Every card's words are set in one place, the others unseen, so the card keeps the height of the longest and its buttons stay put from card to card. */}
            <div className="whr-hold">
              {EVIDENCE.map((c) => (
                <p key={c.id} className="whr-card-text" aria-hidden={c.id === card.id ? undefined : true} data-held={c.id === card.id ? undefined : ''}>
                  {c.text}
                </p>
              ))}
            </div>
            <FactSources sources={card.sources} className="whr-fact-source" />
            {!choice ? (
              <>
                <p className="whr-card-ask">Is this evidence for the claim?</p>
                <div className="whr-card-buttons">
                  <button type="button" className="whr-button whr-button-primary" onClick={() => decide('scale')}>
                    Lay it on the scale
                  </button>
                  <button type="button" className="whr-button" onClick={() => decide('aside')}>
                    Set it aside
                  </button>
                </div>
              </>
            ) : (
              <div className={`whr-verdict ${isRight(card, choice) ? 'is-right' : 'is-wrong'}`}>
                {/* As with the cards: every verdict held in one place, so "Next card" stays put. */}
                <div className="whr-hold">
                  <p>
                    <strong>{verdict(card.weighs, choice)}</strong> {card.why}
                  </p>
                  {EVIDENCE.flatMap((c) =>
                    (['scale', 'aside'] as const).map((ch) => (
                      <p key={`${c.id}-${ch}`} aria-hidden="true" data-held="">
                        {`${verdict(c.weighs, ch)} ${c.why}`}
                      </p>
                    )),
                  )}
                </div>
                <div className="whr-card-buttons">
                  <button type="button" className="whr-button whr-button-primary" onClick={next}>
                    {index < EVIDENCE.length - 1 ? 'Next card' : 'Weigh it up'}
                  </button>
                  {!isRight(card, choice) && (
                    <button type="button" className="whr-button" onClick={() => decide(choice === 'scale' ? 'aside' : 'scale')}>
                      {choice === 'scale' ? 'Set it aside instead' : 'Lay it on the scale instead'}
                    </button>
                  )}
                </div>
              </div>
            )}
          </section>
        )}

        {step === 'choose' && (
          <section className="whr-card" aria-labelledby="whr-choose-head">
            <h2 className="whr-card-head" id="whr-choose-head" ref={headRef} tabIndex={-1}>
              Which evidence weighs the most?
            </h2>
            <p className="whr-card-note">
              You got {rightFirst} of {EVIDENCE.length} right the first time. These {WEIGHING.length} cards are the real evidence. Choose the one you think is strongest.
            </p>
            <fieldset className="whr-choices">
              <legend className="visually-hidden">The strongest evidence</legend>
              {WEIGHING.map((c) => (
                <label key={c.id} className={`whr-choice${heaviest === c.id ? ' is-on' : ''}`}>
                  <input type="radio" name="whr-heaviest" value={c.id} checked={heaviest === c.id} onChange={() => setHeaviest(c.id)} />
                  <span>{c.text}</span>
                </label>
              ))}
            </fieldset>
            <fieldset className="whr-reasons">
              <legend className="whr-card-ask">Why? Choose any that are true for you.</legend>
              {REASONS.map((r) => (
                <label key={r.id} className="whr-reason">
                  <input
                    type="checkbox"
                    checked={reasons.includes(r.id)}
                    onChange={(e) => setReasons((x) => (e.target.checked ? [...x, r.id] : x.filter((y) => y !== r.id)))}
                  />
                  <span>{r.label}</span>
                </label>
              ))}
            </fieldset>
            <label className="whr-own">
              <span className="whr-card-ask">In your own words</span>
              <textarea rows={2} value={own} maxLength={400} onChange={(e) => setOwn(e.target.value)} placeholder="This evidence matters most because…" />
            </label>
            <div className="whr-card-buttons">
              <button
                type="button"
                className="whr-button whr-button-primary"
                disabled={!canArgue}
                onClick={() => {
                  moved.current = true;
                  setStep('argue');
                  onSay('Your argument is ready.');
                }}
              >
                Build my argument
              </button>
              {!canArgue && <p className="whr-card-hint">Choose one card, and give at least one reason.</p>}
            </div>
          </section>
        )}

        {step === 'argue' && arg && chosen && (
          <section className="whr-card whr-argument" aria-labelledby="whr-argue-head">
            <h2 className="whr-card-head" id="whr-argue-head" ref={headRef} tabIndex={-1}>
              My argument
            </h2>
            <label className="whr-own whr-own-name">
              <span className="whr-card-ask">Name (for the printout)</span>
              <input type="text" value={name} maxLength={60} onChange={(e) => setName(e.target.value)} />
            </label>
            <dl className="whr-cer">
              <dt>Claim</dt>
              <dd>{arg.claim}</dd>
              <dt>Evidence</dt>
              <dd>
                {arg.evidence} <FactSources sources={chosen.sources} className="whr-fact-source" />
                {/* On the printout only: the student's screen cites it in the Sources drawer. */}
                <span className="whr-print-source">Source: {chosen.sources.map((s) => s.label).join('; ')}</span>
              </dd>
              <dt>Reasoning</dt>
              <dd>{arg.reasoning}</dd>
            </dl>
            <div className="whr-conclusion">
              <p className="whr-weigh-eyebrow">What the poster concludes</p>
              {CONCLUSION.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <div className="whr-card-buttons">
              <button type="button" className="whr-button whr-button-primary" onClick={onPrint}>
                Print my argument
              </button>
              <button type="button" className="whr-button" onClick={restart}>
                Start again
              </button>
            </div>
            {name.trim() && <p className="whr-print-name">{name.trim()}</p>}
          </section>
        )}
      </div>
    </div>
  );
}

function verdict(weighs: boolean, choice: Choice) {
  if (choice === 'scale') return weighs ? 'It weighs.' : 'It weighs nothing here.';
  return weighs ? 'Look again.' : 'Set aside: well judged.';
}
