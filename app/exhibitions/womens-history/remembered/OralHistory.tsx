'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import FactNote, { FactSources } from '@/components/exhibition/FactNote';
import { FACT_OTHERS, QUESTIONS } from './remembered';
import {
  AFTER,
  BEFORE,
  EVERYBODY,
  INTERVIEW,
  INTERVIEW_COUNT,
  LISTENING,
  ORAL_INTRO,
  ORAL_SOURCES,
  QUESTIONS_NOTE,
  REFLECT,
  SHARE_IDEAS,
  WRITE_UP,
  type Tip,
  type WriteUpId,
} from './oralHistory';

/*
 * Talk About It: an oral history with a woman in your family
 * (oralHistory.ts). Six short steps, one at a time: who to ask and how to
 * get ready; the fourteen questions; how to listen; afterwards; writing up
 * what you learned; and questions for the class. Two things print: the
 * interview sheet to take along (the tips and the questions, with room for
 * notes), and the visitor's write-up. Nothing typed here leaves the page,
 * and nothing is kept once it closes.
 */

const STEPS = [
  { id: 'start', label: 'Get ready' },
  { id: 'questions', label: 'The questions' },
  { id: 'listen', label: 'While you listen' },
  { id: 'after', label: 'Afterwards' },
  { id: 'write', label: 'Write it up' },
  { id: 'class', label: 'With your class' },
] as const;
type StepId = (typeof STEPS)[number]['id'];

export type PrintKind = 'sheet' | 'writeup' | 'argument';

function Tips({ tips, className = '' }: { tips: readonly Tip[]; className?: string }) {
  return (
    <ul className={`whr-tips ${className}`}>
      {tips.map((t) => (
        <li key={t.text}>
          <span className="whr-tip-text">
            {t.title && <strong>{t.title} </strong>}
            {t.text}
          </span>{' '}
          <FactSources sources={t.sources} className="whr-fact-source" />
        </li>
      ))}
    </ul>
  );
}

export default function OralHistory({ onPrint }: { onPrint: (kind: PrintKind) => void }) {
  const [step, setStep] = useState<StepId>('start');
  const [about, setAbout] = useState({ who: '', family: '', when: '', where: '', by: '' });
  const [notes, setNotes] = useState<Record<WriteUpId, string>>({ story: '', learned: '', surprised: '', reflect1: '', reflect2: '' });
  const headRef = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);

  useEffect(() => {
    if (!moved.current) return;
    moved.current = false;
    headRef.current?.focus({ preventScroll: true });
  }, [step]);

  const go = (id: StepId) => {
    moved.current = true;
    setStep(id);
  };
  const i = STEPS.findIndex((s) => s.id === step);
  const nextStep = STEPS[i + 1];
  const heading = (text: string) => (
    <h2 className="whr-oral-head" ref={headRef} tabIndex={-1}>
      {text}
    </h2>
  );

  return (
    <div className="whr-oral">
      <nav className="whr-oral-steps" aria-label="Steps of the interview">
        <ol>
          {STEPS.map((s, k) => (
            <li key={s.id}>
              <button type="button" className="whr-oral-step" aria-current={s.id === step ? 'step' : undefined} onClick={() => go(s.id)}>
                <span className="whr-oral-step-n" aria-hidden="true">{k + 1}</span> {s.label}
              </button>
            </li>
          ))}
        </ol>
        <button type="button" className="whr-button whr-button-primary whr-oral-print" onClick={() => onPrint('sheet')}>
          Print the interview sheet
        </button>
      </nav>

      <div className="whr-oral-body">
        {step === 'start' && (
          <section>
            {heading('Interview a woman in your family')}
            <p className="whr-oral-lede">{ORAL_INTRO}</p>
            <FactNote fact={EVERYBODY} className="whr-fact" />
            <h3 className="whr-oral-sub">Before you start</h3>
            <Tips tips={BEFORE} className="is-numbered" />
          </section>
        )}

        {step === 'questions' && (
          <section>
            {heading(`${INTERVIEW_COUNT} questions to ask`)}
            <FactNote fact={QUESTIONS_NOTE} className="whr-fact" />
            {INTERVIEW.map((g, gi) => (
              <div key={g.title} className="whr-qgroup">
                <h3 className="whr-oral-sub">{g.title}</h3>
                <ol className="whr-interview" start={startOf(gi)}>
                  {g.questions.map((q) => (
                    <li key={q}>{q}</li>
                  ))}
                </ol>
              </div>
            ))}
          </section>
        )}

        {step === 'listen' && (
          <section>
            {heading('While you listen')}
            <Tips tips={LISTENING} />
          </section>
        )}

        {step === 'after' && (
          <section>
            {heading('Afterwards')}
            <Tips tips={AFTER} />
            <FactNote fact={SHARE_IDEAS} className="whr-fact" />
          </section>
        )}

        {step === 'write' && (
          <section>
            {heading('Write up what you learned')}
            <p className="whr-oral-lede">Write it down while it is fresh. Nothing you type here is saved or sent: print it to keep it.</p>
            <div className="whr-about">
              <label className="whr-own">
                <span className="whr-card-ask">I interviewed</span>
                <input type="text" value={about.who} maxLength={80} onChange={(e) => setAbout({ ...about, who: e.target.value })} />
              </label>
              <label className="whr-own">
                <span className="whr-card-ask">She is my</span>
                <input type="text" value={about.family} maxLength={80} placeholder="grandmother, aunt…" onChange={(e) => setAbout({ ...about, family: e.target.value })} />
              </label>
              <label className="whr-own">
                <span className="whr-card-ask">Date</span>
                <input type="text" value={about.when} maxLength={40} onChange={(e) => setAbout({ ...about, when: e.target.value })} />
              </label>
              <label className="whr-own">
                <span className="whr-card-ask">Place</span>
                <input type="text" value={about.where} maxLength={80} onChange={(e) => setAbout({ ...about, where: e.target.value })} />
              </label>
              <label className="whr-own">
                <span className="whr-card-ask">Written by</span>
                <input type="text" value={about.by} maxLength={60} onChange={(e) => setAbout({ ...about, by: e.target.value })} />
              </label>
            </div>
            {WRITE_UP.map((f) => (
              <label key={f.id} className="whr-own">
                <span className="whr-card-ask">{f.label}</span>
                <textarea rows={3} value={notes[f.id]} maxLength={1500} onChange={(e) => setNotes({ ...notes, [f.id]: e.target.value })} />
              </label>
            ))}
            <p className="whr-fact-source">
              The last two questions are the guide’s own “Time to Reflect” questions. <FactSources sources={[ORAL_SOURCES[0]]} className="whr-fact-source" />
            </p>
            <button type="button" className="whr-button whr-button-primary" onClick={() => onPrint('writeup')}>
              Print my write-up
            </button>
          </section>
        )}

        {step === 'class' && (
          <section>
            {heading('Talk about it with your class')}
            <ol className="whr-questions">
              {QUESTIONS.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ol>
            <aside className="whr-others" aria-label="Not only women">
              <p className="whr-others-title">Not only women</p>
              <p className="whr-others-line">The same is true of other minorities and underrepresented groups: their stories, too, are often left out of the history that gets told.</p>
              <FactNote fact={FACT_OTHERS} className="whr-fact" />
              <Link className="whr-button" href="/exhibitions/womens-history/violet#make">
                Make a timeline of a woman in your life
              </Link>
            </aside>
          </section>
        )}

        {nextStep && (
          <button type="button" className="whr-button whr-oral-next" onClick={() => go(nextStep.id)}>
            Next: {nextStep.label} <span aria-hidden="true">→</span>
          </button>
        )}
        <p className="whr-oral-sources">
          <FactSources sources={ORAL_SOURCES} className="whr-fact-source" />
        </p>
      </div>

      {/* What prints: the interview sheet, or the write-up (never on screen). */}
      <div className="whr-print whr-print-sheet" aria-hidden="true">
        <p className="whr-print-title">My women’s history interview</p>
        <p className="whr-print-line">I am interviewing: ______________________ &nbsp; She is my: ______________ &nbsp; Date: __________</p>
        <p>{ORAL_INTRO}</p>
        <p className="whr-print-h">Before you start</p>
        <PrintTips tips={BEFORE} />
        <p className="whr-print-h">While you listen</p>
        <PrintTips tips={LISTENING} />
        <p className="whr-print-h">The questions</p>
        {INTERVIEW.map((g, gi) => (
          <div key={g.title} className="whr-print-group">
            <p className="whr-print-sub">{g.title}</p>
            <ol start={startOf(gi)}>
              {g.questions.map((q) => (
                <li key={q}>
                  {q}
                  <span className="whr-print-rule" />
                  <span className="whr-print-rule" />
                </li>
              ))}
            </ol>
          </div>
        ))}
        <p className="whr-print-h">Afterwards</p>
        <PrintTips tips={AFTER} />
        <p className="whr-print-h">To reflect on</p>
        <ul>
          {REFLECT.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ul>
        <p className="whr-print-sources">
          Sources: {ORAL_SOURCES.map((s) => s.label).join('; ')}. From the Mini Museum: Women’s History Month, Who Gets Remembered?
        </p>
      </div>

      <div className="whr-print whr-print-writeup" aria-hidden="true">
        <p className="whr-print-title">What I learned: a women’s history interview</p>
        <p className="whr-print-line">
          I interviewed {about.who || '______________________'}, my {about.family || '______________'}, on {about.when || '__________'} at {about.where || '______________'}.
        </p>
        {about.by && <p className="whr-print-line">Written by {about.by}</p>}
        {WRITE_UP.map((f) => (
          <div key={f.id} className="whr-print-group">
            <p className="whr-print-sub">{f.label}</p>
            {notes[f.id].trim() ? (
              <p className="whr-print-answer">{notes[f.id]}</p>
            ) : (
              <>
                <span className="whr-print-rule" />
                <span className="whr-print-rule" />
                <span className="whr-print-rule" />
              </>
            )}
          </div>
        ))}
        <p className="whr-print-sources">The last two questions are from the {ORAL_SOURCES[0].label}.</p>
      </div>
    </div>
  );
}

/** The number of a group's first question, counting on through the groups before it. */
const startOf = (group: number) => INTERVIEW.slice(0, group).reduce((k, g) => k + g.questions.length, 0) + 1;

function PrintTips({ tips }: { tips: readonly Tip[] }) {
  return (
    <ul>
      {tips.map((t) => (
        <li key={t.text}>
          {t.title && <strong>{t.title} </strong>}
          {t.text}
        </li>
      ))}
    </ul>
  );
}
