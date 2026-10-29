'use client';

import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import FactNote from '@/components/exhibition/FactNote';
import { srOnly } from '@/lib/a11y';
import { CCBC_FACT, SURVEY_KINDS, SURVEY_QUESTIONS, SURVEY_TEXT, type SurveyKind, type SurveyQuestion } from './representationText';

/*
 * Who's in your books? A class survey: count the main characters in the
 * books around you (or the toys, shows and games) by background, gender
 * and disability, and the books' authors, and watch each chart grow. The
 * counts stay in this browser (localStorage, when it can) and are never
 * sent. "Print the charts" prints every chart for what you counted.
 *
 * The one comparison is the CCBC's own published figures (representationText.ts).
 */

type Counts = Record<SurveyKind, Record<string, Record<string, number>>>;
const STORE = 'mm-bh-survey-v1';
const empty = (): Counts => ({ books: {}, toys: {}, screens: {} });

function load(): Counts {
  try {
    const raw = window.localStorage.getItem(STORE);
    if (!raw) return empty();
    const c = JSON.parse(raw) as Partial<Counts>;
    return { ...empty(), ...c };
  } catch {
    return empty();
  }
}

/** Questions for what is counted: toys and screens have no authors to count. */
const questionsFor = (kind: SurveyKind) => SURVEY_QUESTIONS.filter((q) => kind === 'books' || q.id !== 'authors');

function Chart({ q, counts, caption }: { q: SurveyQuestion; counts: Record<string, number>; caption?: string }) {
  const total = q.options.reduce((n, o) => n + (counts[o.id] ?? 0), 0);
  const max = Math.max(1, ...q.options.map((o) => counts[o.id] ?? 0));
  return (
    <figure className="bhr-chart">
      <figcaption className="bhr-chart-title">
        {caption ?? q.heading} <span className="bhr-chart-total">({total} counted)</span>
      </figcaption>
      <ul className="bhr-bars">
        {q.options.map((o) => {
          const n = counts[o.id] ?? 0;
          const pct = total ? Math.round((n / total) * 100) : 0;
          return (
            <li key={o.id} className="bhr-bar-row" title={`${o.label}: ${n}${total ? ` (${pct}%)` : ''}`}>
              <span className="bhr-bar-label">{o.label}</span>
              <span className="bhr-bar-track">
                <span className="bhr-bar-fill" style={{ width: `${(n / max) * 100}%` }} />
              </span>
              <span className="bhr-bar-value">
                {n}
                {total > 0 && n > 0 && <span className="bhr-bar-pct"> {pct}%</span>}
              </span>
            </li>
          );
        })}
      </ul>
    </figure>
  );
}

export default function BookSurvey() {
  const [counts, setCounts] = useState<Counts>(empty);
  const [kind, setKind] = useState<SurveyKind>('books');
  const [qid, setQid] = useState(SURVEY_QUESTIONS[0].id);
  const [said, setSaid] = useState('');
  const [confirm, setConfirm] = useState(false);
  const qRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const againRef = useRef<HTMLButtonElement>(null);
  const noRef = useRef<HTMLButtonElement>(null);
  const ids = useId();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the class's counts come back from this browser
    setCounts(load());
  }, []);

  const change = (f: (c: Counts) => Counts) =>
    setCounts((c) => {
      const next = f(c);
      try {
        window.localStorage.setItem(STORE, JSON.stringify(next));
      } catch {
        // Private windows: the counts last as long as the page.
      }
      return next;
    });

  const qs = questionsFor(kind);
  const q = qs.find((x) => x.id === qid) ?? qs[0];
  const these = counts[kind][q.id] ?? {};
  const kindLabel = SURVEY_KINDS.find((k) => k.id === kind)!.label;

  const bump = (opt: string, by: number) => {
    const n = Math.max(0, (these[opt] ?? 0) + by);
    change((c) => ({ ...c, [kind]: { ...c[kind], [q.id]: { ...(c[kind][q.id] ?? {}), [opt]: n } } }));
    setSaid(`${q.options.find((o) => o.id === opt)!.label}: ${n}.`);
  };

  const onQKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const i = qs.findIndex((x) => x.id === q.id);
    const to = e.key === 'ArrowRight' ? (i + 1) % qs.length : e.key === 'ArrowLeft' ? (i - 1 + qs.length) % qs.length : e.key === 'Home' ? 0 : e.key === 'End' ? qs.length - 1 : -1;
    if (to < 0) return;
    e.preventDefault();
    setQid(qs[to].id);
    qRefs.current[qs[to].id]?.focus();
  };

  // The question takes the place of "Start again": the focus goes to its No, and back again after.
  const askConfirm = () => {
    setConfirm(true);
    requestAnimationFrame(() => noRef.current?.focus());
  };
  const endConfirm = () => {
    setConfirm(false);
    requestAnimationFrame(() => againRef.current?.focus());
  };
  const clear = () => {
    change((c) => ({ ...c, [kind]: {} }));
    endConfirm();
    setSaid(`Every count for ${kindLabel.toLowerCase()} is cleared.`);
  };
  const compare = kind === 'books' && (q.id === 'background' || q.id === 'authors');
  const total = q.options.reduce((n, o) => n + (these[o.id] ?? 0), 0);
  const max = Math.max(1, ...q.options.map((o) => these[o.id] ?? 0));

  return (
    <div className="bhr-survey">
      <p className="bhr-intro">{SURVEY_TEXT.intro}</p>

      <div className="bhr-survey-bar">
        <div className="bhr-kinds" role="radiogroup" aria-label="What are you counting?">
          {SURVEY_KINDS.map((k) => (
            <label key={k.id} className="bhr-kind">
              <input type="radio" name={`${ids}-kind`} checked={kind === k.id} onChange={() => setKind(k.id)} />
              <span>{k.label}</span>
            </label>
          ))}
        </div>
        <div className="bhr-qtabs" role="tablist" aria-label="Charts">
          {qs.map((x) => (
            <button
              key={x.id}
              ref={(el) => {
                qRefs.current[x.id] = el;
              }}
              type="button"
              role="tab"
              id={`${ids}-q-${x.id}`}
              aria-controls={`${ids}-qp`}
              aria-selected={q.id === x.id}
              tabIndex={q.id === x.id ? 0 : -1}
              className="bhr-qtab"
              onClick={() => setQid(x.id)}
              onKeyDown={onQKey}
            >
              {x.tab}
            </button>
          ))}
        </div>
      </div>

      <div className="bhr-survey-body" id={`${ids}-qp`} role="tabpanel" aria-labelledby={`${ids}-q-${q.id}`}>
        {/* The tally is the chart: each row's count, and its bar growing beside it. */}
        <div className="bhr-tally-wrap">
          <table className="bhr-tally">
            <caption className="bhr-chart-title">
              {`${kindLabel}: ${q.heading.toLowerCase()}`} <span className="bhr-chart-total">({total} counted)</span>
            </caption>
            <tbody>
              {q.options.map((o) => (
                <tr key={o.id}>
                  <th scope="row">{o.label}</th>
                  <td className="bhr-tally-bar" aria-hidden="true">
                    <span className="bhr-bar-track">
                      <span className="bhr-bar-fill" style={{ width: `${((these[o.id] ?? 0) / max) * 100}%` }} />
                    </span>
                    {total > 0 && !!these[o.id] && <span className="bhr-bar-pct">{Math.round(((these[o.id] ?? 0) / total) * 100)}%</span>}
                  </td>
                  <td className="bhr-tally-btn">
                    <button type="button" className="bhr-count-btn" onClick={() => bump(o.id, -1)} disabled={!these[o.id]} aria-label={`One fewer: ${o.label}`}>
                      −
                    </button>
                  </td>
                  <td className="bhr-count">{these[o.id] ?? 0}</td>
                  <td className="bhr-tally-btn">
                    <button type="button" className="bhr-count-btn bhr-count-add" onClick={() => bump(o.id, 1)} aria-label={`One more: ${o.label}`}>
                      +
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bhr-survey-side">
          {compare && (
            <div className="bhr-compare">
              <p className="bhr-compare-heading">{SURVEY_TEXT.compareHeading}</p>
              <FactNote fact={CCBC_FACT} className="bhr-cmp" />
            </div>
          )}
          <div className="bhr-talk-box">
            <p className="bhr-talk-heading">Talk about it</p>
            <ul className="bhr-talk">
              {SURVEY_TEXT.talk.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="bhr-actions">
        <button type="button" className="bhr-button" onClick={() => window.print()}>
          Print the charts
        </button>
        {confirm ? (
          <span className="bhr-confirm">
            <span>Clear every count for {kindLabel.toLowerCase()}?</span>
            <button type="button" className="bhr-button" onClick={clear}>
              Yes
            </button>
            <button ref={noRef} type="button" className="bhr-button bhr-button-ghost" onClick={endConfirm}>
              No
            </button>
          </span>
        ) : (
          <button ref={againRef} type="button" className="bhr-button bhr-button-ghost" onClick={askConfirm}>
            Start again
          </button>
        )}
      </div>

      {/* What prints: every chart for what was counted. */}
      <div className="bhr-print bhr-print-survey" aria-hidden="true">
        <p className="bhr-print-title">Who’s in our {kindLabel.toLowerCase()}?</p>
        {qs.map((x) => (
          <Chart key={x.id} q={x} counts={counts[kind][x.id] ?? {}} />
        ))}
      </div>

      <p role="status" style={srOnly}>{said}</p>
    </div>
  );
}
