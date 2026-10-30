'use client';

import { useRef, useState } from 'react';
import FactNote from '@/components/exhibition/FactNote';
import RoomShell, { RoomHeader } from '../RoomShell';
import Scales from './Scales';
import { DEEDS, JUDGEMENT_NOTES, MISTAKES_ALLOWED, tilt, verdict, type Deed } from './judgement';
import './weighing.css';

/*
 * The Weighing of the Heart, on one screen: the hall of judgement on the
 * left, and on the right the scribe Ani's deeds, one card at a time. Sort
 * each by what Ani says of it before the judges; then read his own words.
 * Right answers lighten his heart toward the feather, wrong ones weigh it
 * down and bring Ammit closer. The facts are museum notes with their sources
 * (judgement.ts); the hall is drawn, not photographed.
 */

type Answer = { deed: Deed; chose: Deed['kind']; right: boolean };

export default function WeighingOfTheHeart() {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [started, setStarted] = useState(false);
  const [showing, setShowing] = useState(false);
  const panelRef = useRef<HTMLHeadingElement>(null);
  const right = answers.filter((a) => a.right).length;
  const wrong = answers.length - right;
  const state = verdict(right, wrong);
  const current = DEEDS[answers.length];
  const last = answers[answers.length - 1];

  const choose = (kind: Deed['kind']) => {
    if (!current || showing) return;
    setAnswers((a) => [...a, { deed: current, chose: kind, right: current.kind === kind }]);
    setShowing(true);
  };
  const next = () => {
    setShowing(false);
    panelRef.current?.focus();
  };
  const again = () => {
    setAnswers([]);
    setShowing(false);
    setStarted(true);
    panelRef.current?.focus();
  };

  const closeness = Math.min(4, wrong);
  const t = tilt(right, wrong);
  const finished = state !== 'weighing' && !showing;
  const status = showing && last
    ? `${last.right ? 'Right.' : 'Not quite.'} Ani says: ${last.deed.quote} The heart ${last.right ? 'grows lighter' : 'grows heavier'}.`
    : finished
      ? state === 'balanced'
        ? 'The scales balance. Thoth writes down the result.'
        : 'The heart is heavier than the feather. Ammit waits.'
      : '';

  return (
    <RoomShell className="eg-weighing">
      <RoomHeader kicker="Interactive · The hall of judgement" title="The Weighing of the Heart">
        <p className="egr-lede">The scribe Ani stands before the judges. His heart will be weighed against the feather of Maat. Help him speak his words.</p>
      </RoomHeader>

      <div className="egr-layout">
        <div className="egr-scene egw-hall" data-state={state} data-tension={Math.min(3, wrong)}>
          <Scales tilt={t} closeness={closeness} verdict={finished ? state : 'weighing'} />
          <p className="egw-reading" aria-hidden="true">
            {finished && state === 'balanced' ? 'Balanced' : t > 0 ? 'The heart is heavier' : ''}
          </p>
          <div
            className="egw-meter"
            role="meter"
            aria-label="Ani’s deeds sorted"
            aria-valuemin={0}
            aria-valuemax={DEEDS.length}
            aria-valuenow={answers.length}
            aria-valuetext={`${answers.length} of ${DEEDS.length} sorted, ${right} right`}
          >
            {DEEDS.map((d, i) => (
              <span key={d.id} className={i < answers.length ? (answers[i].right ? 'is-right' : 'is-wrong') : ''} />
            ))}
          </div>
        </div>

        <section className="egr-panel egw-panel" aria-labelledby="egw-panel-heading">
          <h2 id="egw-panel-heading" ref={panelRef} tabIndex={-1}>
            {!started ? 'Before the judges' : finished ? (state === 'balanced' ? 'The scales balance' : 'The heart is too heavy') : `Deed ${Math.min(answers.length + (showing ? 0 : 1), DEEDS.length)} of ${DEEDS.length}`}
          </h2>

          {!started && (
            <>
              <p>For each deed, choose what Ani tells the judges: is it a wrong he swears he <strong>never did</strong>, or a good deed he says he <strong>did</strong>?</p>
              <FactNote fact={JUDGEMENT_NOTES.scales} className="egr-fact" />
              <div className="egr-actions">
                <button type="button" className="egr-button egr-button-primary" onClick={again}>
                  Begin the weighing
                </button>
              </div>
            </>
          )}

          {started && !finished && !showing && current && (
            <>
              <p className="egw-deed">{current.label}</p>
              <div className="egr-actions egw-choices">
                <button type="button" className="egr-button" onClick={() => choose('never')}>
                  Ani never did this
                </button>
                <button type="button" className="egr-button" onClick={() => choose('did')}>
                  Ani did this
                </button>
              </div>
            </>
          )}

          {started && showing && last && (
            <>
              <p className={`egw-result ${last.right ? 'is-right' : 'is-wrong'}`}>{last.right ? 'Right!' : 'Not quite.'} Ani says:</p>
              <blockquote className="egw-quote">“{last.deed.quote}”</blockquote>
              <FactNote fact={JUDGEMENT_NOTES.ani} className="egr-fact" />
              <div className="egr-actions">
                <button type="button" className="egr-button egr-button-primary" onClick={next}>
                  {answers.length < DEEDS.length ? 'Next deed' : 'See the scales'} <span aria-hidden="true">→</span>
                </button>
              </div>
            </>
          )}

          {finished && (
            <>
              {state === 'balanced' ? (
                <p>Ani’s heart is as light as the feather. Thoth writes down the result, and Ani goes on to meet Osiris.</p>
              ) : (
                <p>
                  The heart sinks below the feather, and Ammit leans in, waiting. This is only a game: Ani can try again. Sort his words with no more than {MISTAKES_ALLOWED} mistake to balance the scales.
                </p>
              )}
              <p className="egw-score">
                {right} of {DEEDS.length} sorted right.
              </p>
              <FactNote fact={JUDGEMENT_NOTES.confession} className="egr-fact" />
              <FactNote fact={JUDGEMENT_NOTES.maat} className="egr-fact" />
              <FactNote fact={JUDGEMENT_NOTES.heart} className="egr-fact" />
              <div className="egr-actions">
                <button type="button" className="egr-button egr-button-primary" onClick={again}>
                  Weigh again
                </button>
              </div>
            </>
          )}
        </section>
      </div>

      <p className="egr-status" role="status" aria-live="polite">
        {status}
      </p>
    </RoomShell>
  );
}
