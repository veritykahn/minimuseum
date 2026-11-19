'use client';

import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import FactNote from '@/components/exhibition/FactNote';
import { srOnly } from '@/lib/a11y';
import { CCBC_FACT, SURVEY_KINDS, SURVEY_QUESTIONS, SURVEY_TEXT, askFor, type SurveyKind, type SurveyQuestion } from './representationText';

/*
 * Point: a class counts who is in its own books and toys, guessing first, so
 * it finds out for itself who is easy to find and who is missing.
 *
 * Who's in your books? A whole-class survey, led from the front: each child
 * picks a book (or a toy, a show or a game), the teacher reads the question
 * out ("Hands up if the main character in your book is…"), counts the
 * hands and sets each count with the big − and + (or types it). Beside the
 * steppers the class's chart grows as the counts change, big enough for the
 * projector, each bar in one of the posters' colors and its count popping
 * as it moves. Background, gender and disability, and the books' authors.
 * Before counting, the class guesses which answer will have the most hands;
 * once there are counts, the room says whether the guess held, and asks why
 * when it didn't.
 *
 * The counts stay in this browser (localStorage, when it can) and are never
 * sent. "Print the charts" prints every chart for what was counted, with a
 * line for the class's name and the date.
 *
 * The one comparison is the CCBC's own published figures (representationText.ts).
 */

type Counts = Record<SurveyKind, Record<string, Record<string, number>>>;
type CssVars = CSSProperties & Record<`--${string}`, string>;
const STORE = 'mm-bh-survey-v1';
const GUESS_STORE = 'mm-bh-survey-guess-v1';
const MAX = 999;
const empty = (): Counts => ({ books: {}, toys: {}, screens: {} });

/** The posters' colors, a bar each, in turn. */
export const BAR_COLORS = ['#ee8dbf', '#f7a21b', '#1e8a4e', '#d7262e', '#141414', '#8a6bd1', '#c5da3b', '#2b7bb9', '#6f4430', '#9a9a9a'];

function load(): Counts {
  try {
    const raw = window.localStorage.getItem(STORE);
    if (!raw) return empty();
    const c = JSON.parse(raw) as Partial<Counts> | null;
    const out = empty();
    for (const k of Object.keys(out) as SurveyKind[]) {
      const v = c?.[k];
      if (v && typeof v === 'object') out[k] = v;
    }
    return out;
  } catch {
    return empty();
  }
}

function loadGuesses(): Record<string, string> {
  try {
    const g = JSON.parse(window.localStorage.getItem(GUESS_STORE) ?? '{}') as unknown;
    return g && typeof g === 'object' ? (g as Record<string, string>) : {};
  } catch {
    return {};
  }
}

/** The answers with the most counts (none while nothing is counted). */
export function topAnswers(options: { id: string }[], counts: Record<string, number>): string[] {
  const max = Math.max(0, ...options.map((o) => counts[o.id] ?? 0));
  return max === 0 ? [] : options.filter((o) => (counts[o.id] ?? 0) === max).map((o) => o.id);
}

/** Questions for what is counted: toys and screens have no authors to count. */
const questionsFor = (kind: SurveyKind) => SURVEY_QUESTIONS.filter((q) => kind === 'books' || q.id !== 'authors');

/** A count as typed: a whole number from 0 to 999. */
export const clampCount = (v: string | number) => {
  const n = Math.floor(Number(v));
  return Number.isFinite(n) ? Math.max(0, Math.min(MAX, n)) : 0;
};

/** The class's chart for one question: a bar for each answer, as long as its share of the biggest. */
export function Chart({ q, counts, caption, big = false }: { q: SurveyQuestion; counts: Record<string, number>; caption?: string; big?: boolean }) {
  const total = q.options.reduce((n, o) => n + (counts[o.id] ?? 0), 0);
  const max = Math.max(1, ...q.options.map((o) => counts[o.id] ?? 0));
  return (
    <figure className={`bhr-chart ${big ? 'bhr-chart-big' : ''}`}>
      <figcaption className="bhr-chart-title">
        {caption ?? q.heading} <span className="bhr-chart-total">({total} counted)</span>
      </figcaption>
      <ul className="bhr-bars">
        {q.options.map((o, i) => {
          const n = counts[o.id] ?? 0;
          const pct = total ? Math.round((n / total) * 100) : 0;
          return (
            <li key={o.id} className="bhr-bar-row" data-empty={n === 0 || undefined} style={{ '--bar': BAR_COLORS[i % BAR_COLORS.length] } as CssVars}>
              <span className="bhr-bar-label">{o.label}</span>
              <span className="bhr-bar-track">
                <span className="bhr-bar-fill" style={{ width: `${(n / max) * 100}%` }} />
                {/* Keyed by the count, so it pops each time it changes. */}
                <span className="bhr-bar-value" key={n}>
                  {n}
                </span>
              </span>
              <span className="bhr-bar-pct">{total > 0 && n > 0 ? `${pct}%` : ''}</span>
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
  const [guesses, setGuesses] = useState<Record<string, string>>({});
  const qRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const againRef = useRef<HTMLButtonElement>(null);
  const noRef = useRef<HTMLButtonElement>(null);
  const changeRef = useRef<HTMLButtonElement>(null);
  const firstPickRef = useRef<HTMLButtonElement>(null);
  const ids = useId();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the class's counts come back from this browser
    setCounts(load());
    setGuesses(loadGuesses());
  }, []);

  const keepGuesses = (next: Record<string, string>) => {
    setGuesses(next);
    try {
      window.localStorage.setItem(GUESS_STORE, JSON.stringify(next));
    } catch {
      // Private windows: the guesses last as long as the page.
    }
  };

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
  const labelOf = (id: string) => q.options.find((o) => o.id === id)?.label ?? id;
  const guessKey = `${kind}:${q.id}`;
  const guess = q.options.some((o) => o.id === guesses[guessKey]) ? guesses[guessKey] : null;
  const tops = topAnswers(q.options, these);
  const setGuess = (id: string | null) => {
    const next = { ...guesses };
    if (id) next[guessKey] = id;
    else delete next[guessKey];
    keepGuesses(next);
    setSaid(id ? SURVEY_TEXT.guessed(labelOf(id)) : SURVEY_TEXT.guessAsk);
    // The button pressed goes away, so the focus moves to what takes its place.
    requestAnimationFrame(() => (id ? changeRef.current : firstPickRef.current)?.focus());
  };
  let verdict = '';
  if (guess && tops.length === 1) verdict = tops[0] === guess ? SURVEY_TEXT.guessRight(labelOf(guess)) : SURVEY_TEXT.guessWrong(labelOf(guess), labelOf(tops[0]));
  else if (guess && tops.length > 1) verdict = SURVEY_TEXT.guessTie(labelOf(guess), tops.map(labelOf).join(', '));

  /** Sets a count from the one before it, so quick taps each count. */
  const setCount = (opt: string, next: (n: number) => number) => {
    const label = q.options.find((o) => o.id === opt)!.label;
    change((c) => {
      const n = clampCount(next(c[kind][q.id]?.[opt] ?? 0));
      setSaid(`${label}: ${n}.`);
      return { ...c, [kind]: { ...c[kind], [q.id]: { ...(c[kind][q.id] ?? {}), [opt]: n } } };
    });
  };
  const bump = (opt: string, by: number) => setCount(opt, (n) => n + by);

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
    keepGuesses(Object.fromEntries(Object.entries(guesses).filter(([k]) => !k.startsWith(`${kind}:`))));
    endConfirm();
    setSaid(`Every count for ${kindLabel.toLowerCase()} is cleared.`);
  };
  const compare = kind === 'books' && (q.id === 'background' || q.id === 'authors');

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
        {/* The teacher's side: the question to read out, and a big stepper for each answer. */}
        <section className="bhr-ask" aria-labelledby={`${ids}-ask`}>
          <p className="bhr-ask-label">{SURVEY_TEXT.askHeading}</p>
          <h3 id={`${ids}-ask`} className="bhr-ask-q">
            {askFor(q, kind)}
          </h3>
          <div className="bhr-guess">
            <p className="bhr-guess-heading" id={`${ids}-guess`}>
              {SURVEY_TEXT.guessHeading}
            </p>
            {guess ? (
              <>
                <p className="bhr-guess-said">{verdict || SURVEY_TEXT.guessed(labelOf(guess))}</p>
                <button ref={changeRef} type="button" className="bhr-guess-change" onClick={() => setGuess(null)}>
                  {SURVEY_TEXT.changeGuess}
                </button>
              </>
            ) : (
              <>
                <p className="bhr-guess-ask">{SURVEY_TEXT.guessAsk}</p>
                <div className="bhr-guess-picks" role="group" aria-labelledby={`${ids}-guess`}>
                  {q.options.map((o, i) => (
                    <button key={o.id} ref={i === 0 ? firstPickRef : undefined} type="button" className="bhr-guess-pick" onClick={() => setGuess(o.id)}>
                      {o.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          <ul className="bhr-steppers">
            {q.options.map((o, i) => (
              <li key={o.id} className="bhr-stepper" style={{ '--bar': BAR_COLORS[i % BAR_COLORS.length] } as CssVars}>
                <span className="bhr-stepper-label" id={`${ids}-o-${o.id}`}>
                  {o.label}
                </span>
                <button type="button" className="bhr-count-btn" onClick={() => bump(o.id, -1)} disabled={!these[o.id]} aria-label={`One fewer: ${o.label}`}>
                  −
                </button>
                <input
                  className="bhr-count-input"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={MAX}
                  value={these[o.id] ?? 0}
                  onChange={(e) => setCount(o.id, () => clampCount(e.target.value))}
                  onFocus={(e) => e.target.select()}
                  aria-label={`How many: ${o.label}`}
                />
                <button type="button" className="bhr-count-btn bhr-count-add" onClick={() => bump(o.id, 1)} aria-label={`One more: ${o.label}`}>
                  +
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* The class's side: the chart, growing as the counts change, then what to talk about. */}
        <div className="bhr-survey-side">
          <Chart q={q} counts={these} caption={`${kindLabel}: ${q.heading.toLowerCase()}`} big />
          {compare && (
            <div className="bhr-compare">
              <p className="bhr-compare-heading">{SURVEY_TEXT.compareHeading}</p>
              <FactNote fact={CCBC_FACT} className="bhr-cmp" />
            </div>
          )}
          <div className="bhr-talk-box">
            <p className="bhr-talk-heading">{SURVEY_TEXT.talkHeading}</p>
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
          {SURVEY_TEXT.print}
        </button>
        {confirm ? (
          <span className="bhr-confirm">
            <span>{SURVEY_TEXT.clearAsk(kindLabel.toLowerCase())}</span>
            <button type="button" className="bhr-button" onClick={clear}>
              {SURVEY_TEXT.yes}
            </button>
            <button ref={noRef} type="button" className="bhr-button bhr-button-ghost" onClick={endConfirm}>
              {SURVEY_TEXT.no}
            </button>
          </span>
        ) : (
          <button ref={againRef} type="button" className="bhr-button bhr-button-ghost" onClick={askConfirm}>
            {SURVEY_TEXT.again}
          </button>
        )}
      </div>

      {/* What prints: every chart for what was counted, with a line for the class and the date. */}
      <div className="bhr-print bhr-print-survey" aria-hidden="true">
        <p className="bhr-print-title">Who’s in our {kindLabel.toLowerCase()}?</p>
        <p className="bhr-print-lines">
          <span>{SURVEY_TEXT.printClass}:</span>
          <span className="bhr-print-blank" />
          <span>{SURVEY_TEXT.printDate}:</span>
          <span className="bhr-print-blank" />
        </p>
        <div className="bhr-print-charts">
          {qs.map((x) => (
            <Chart key={x.id} q={x} counts={counts[kind][x.id] ?? {}} />
          ))}
        </div>
      </div>

      <p role="status" style={srOnly}>{said}</p>
    </div>
  );
}
