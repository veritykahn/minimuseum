'use client';

import { useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent } from 'react';
import FactNote from '@/components/exhibition/FactNote';
import { srOnly } from '@/lib/a11y';
import { DOLL_TEST_STEPS, DOLL_TEST_TEXT, type DollTestStep } from './representationText';

/*
 * The Doll Test, as a lesson the teacher leads on the projector: a step at a
 * time, from separate schools to the Clarks' doll tests to Brown v. Board,
 * a picture on the black blob at the left and the step's checked facts
 * beside it, each with its source, in type big enough for the back row.
 * Every step ends on a question for the class ("Talk about it"), and the
 * teacher's notes (N, or the button) say how to lead it. It ends on poster
 * 2's own sentence.
 *
 * Nobody takes a test: the pictures are drawn, simple and the same for
 * every doll but its color, as the sources describe the dolls.
 *
 * A presentation clicker works it: the arrow keys and Page Up / Page Down
 * move along the steps from anywhere on the tab (Home and End to the ends),
 * and "Full screen" fills the projector.
 */

const BROWN = '#6f4430';
const LIGHT = '#f2d4bb';
const VIGNETTES = ['musician', 'worker', 'scientist', 'singer', 'notes', 'atom'];
const ARCHIVO = "Archivo, 'Arial Black', sans-serif";

/** The step a key moves to, or null if the key isn't the lesson's. */
export function lessonStep(key: string, i: number, count: number): number | null {
  const to =
    key === 'ArrowRight' || key === 'PageDown' ? i + 1
    : key === 'ArrowLeft' || key === 'PageUp' ? i - 1
    : key === 'Home' ? 0
    : key === 'End' ? count - 1
    : null;
  return to === null ? null : Math.max(0, Math.min(count - 1, to));
}

/** A plain baby doll, the same shape whatever its color. */
function BabyDoll({ x, color }: { x: number; color: string }) {
  return (
    <g transform={`translate(${x} 0)`}>
      <circle cx="0" cy="-58" r="22" fill={color} />
      <path d="M-20 -36 Q0 -44 20 -36 L24 6 Q0 14 -24 6 Z" fill={color} />
      <path d="M-22 -30 L-34 -6 M22 -30 L34 -6 M-12 6 L-14 30 M12 6 L14 30" stroke={color} strokeWidth="11" strokeLinecap="round" />
      <path d="M-23 -6 Q0 4 23 -6 L20 12 Q0 22 -20 12 Z" fill="#f7f5ee" />
      <circle cx="-7" cy="-60" r="2.2" fill="#141414" />
      <circle cx="7" cy="-60" r="2.2" fill="#141414" />
      <path d="M-6 -50 Q0 -46 6 -50" stroke="#141414" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </g>
  );
}

/** A schoolhouse: a roof, a door and a bell. */
function School({ x }: { x: number }) {
  return (
    <g transform={`translate(${x} 0)`} fill="#f7f5ee">
      <path d="M-46 -10 L0 -46 L46 -10 Z" />
      <rect x="-40" y="-10" width="80" height="62" rx="3" />
      <rect x="-10" y="18" width="20" height="34" fill="#111" />
      <rect x="-30" y="2" width="14" height="12" fill="#111" />
      <rect x="16" y="2" width="14" height="12" fill="#111" />
      <circle cx="0" cy="-22" r="6" fill="var(--bh-orange)" />
    </g>
  );
}

function Picture({ kind }: { kind: DollTestStep['picture'] }) {
  if (kind === 'mirror') {
    return (
      <div className="bhr-test-ring" aria-hidden="true">
        {VIGNETTES.map((v, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={v} className={`bhr-ring-vig bhr-ring-vig-${i + 1}`} src={`/exhibitions/black-history/vignettes/${v}.webp`} alt="" />
        ))}
        <span className="bhr-ring-core">You</span>
      </div>
    );
  }
  return (
    <svg className="bhr-test-picture" viewBox="-160 -160 320 320" aria-hidden="true">
      <circle r="150" fill="#111" />
      {kind === 'schools' && (
        <g transform="translate(0 6)">
          <School x={-62} />
          <School x={62} />
          <path d="M0 -70 L0 70" stroke="var(--bh-red)" strokeWidth="8" strokeLinecap="round" strokeDasharray="2 16" />
        </g>
      )}
      {kind === 'clarks' && (
        <g>
          <text y="22" textAnchor="middle" fontFamily={ARCHIVO} fontWeight="900" fontSize="62" fill="#fff">
            1940s
          </text>
          <path d="M-70 52 L70 52" stroke="var(--bh-lime)" strokeWidth="6" strokeLinecap="round" />
        </g>
      )}
      {(kind === 'dolls' || kind === 'answers') && (
        <g transform="translate(0 50)">
          <BabyDoll x={-96} color={BROWN} />
          <BabyDoll x={-32} color={LIGHT} />
          <BabyDoll x={32} color={BROWN} />
          <BabyDoll x={96} color={LIGHT} />
          {kind === 'answers' && (
            <text y="-108" textAnchor="middle" fontFamily="Shrikhand, Georgia, serif" fontSize="56" fill="var(--bh-pink)">
              ?
            </text>
          )}
        </g>
      )}
      {kind === 'asked' && (
        <g>
          <path d="M-92 -78 H92 Q108 -78 108 -62 V18 Q108 34 92 34 H-20 L-52 64 L-46 34 H-92 Q-108 34 -108 18 V-62 Q-108 -78 -92 -78 Z" fill="#f7f5ee" />
          <text y="8" textAnchor="middle" fontFamily="Shrikhand, Georgia, serif" fontSize="84" fill="var(--bh-pink)" stroke="#111" strokeWidth="2">
            ?
          </text>
        </g>
      )}
      {kind === 'drawings' && (
        <g fill="none" stroke="#f7f5ee" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="-50" cy="-52" r="22" />
          <path d="M-50 -30 L-50 34 M-50 -16 L-80 6 M-50 -16 L-20 6 M-50 34 L-70 74 M-50 34 L-30 74" />
          <circle cx="50" cy="-52" r="22" />
          <path d="M50 -30 L22 40 L78 40 Z M40 -16 L20 6 M60 -16 L80 6 M40 40 L36 74 M60 40 L64 74" />
          <g strokeWidth="12" transform="translate(0 104)">
            <path d="M-60 0 L-24 0" stroke="#f7f5ee" />
            <path d="M-12 0 L24 0" stroke="#f5d33a" />
            <path d="M36 0 L72 0" stroke={BROWN} />
          </g>
        </g>
      )}
      {(kind === 'court' || kind === 'decision') && (
        <g fill="#f7f5ee">
          <path d="M-100 -40 L0 -96 L100 -40 Z" />
          {[-80, -40, 0, 40, 80].map((x) => (
            <rect key={x} x={x - 9} y="-32" width="18" height="86" rx="3" />
          ))}
          <rect x="-110" y="56" width="220" height="14" rx="3" />
          {kind === 'decision' && (
            <text y="110" textAnchor="middle" fontFamily={ARCHIVO} fontWeight="800" fontSize="24" fill="var(--bh-lime)">
              May 17, 1954
            </text>
          )}
        </g>
      )}
      {kind === 'footnote' && (
        <g>
          {[-70, -46, -22, 2].map((y) => (
            <path key={y} d={`M-90 ${y} L90 ${y}`} stroke="#444" strokeWidth="8" strokeLinecap="round" />
          ))}
          <text x="0" y="96" textAnchor="middle" fontFamily={ARCHIVO} fontWeight="900" fontSize="104" fill="var(--bh-lime)">
            11
          </text>
        </g>
      )}
    </svg>
  );
}

/* Full screen, where the browser offers it (not on an iPhone). */
const subscribeFullscreen = (f: () => void) => {
  document.addEventListener('fullscreenchange', f);
  return () => document.removeEventListener('fullscreenchange', f);
};
const isFullscreen = () => !!document.fullscreenElement;
const canFullscreen = () => typeof document !== 'undefined' && !!document.documentElement.requestFullscreen && document.fullscreenEnabled !== false;

export default function DollTest({ active = true }: { active?: boolean }) {
  const [i, setI] = useState(0);
  const [notes, setNotes] = useState(false);
  const stepRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const fullscreen = useSyncExternalStore(subscribeFullscreen, isFullscreen, () => false);
  const fullscreenOk = useSyncExternalStore(subscribeFullscreen, canFullscreen, () => false);
  const step = DOLL_TEST_STEPS[i];
  const last = i === DOLL_TEST_STEPS.length - 1;

  // At either end the arrow goes dim, so it hands the focus to that end's step.
  const go = (to: number, focus = false) => {
    const n = Math.max(0, Math.min(DOLL_TEST_STEPS.length - 1, to));
    setI(n);
    if (focus) stepRefs.current[n]?.focus();
  };
  const onKey = (e: KeyboardEvent<HTMLElement>) => {
    const to = lessonStep(e.key, i, DOLL_TEST_STEPS.length);
    if (to === null) return;
    e.preventDefault();
    go(to, true);
  };

  // The clicker: from anywhere on the tab (not a link, a field or the room's own tabs), the keys move the lesson.
  useEffect(() => {
    if (!active) return;
    const onWindowKey = (e: globalThis.KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
      const el = e.target as HTMLElement;
      if (el !== document.body && (!el.closest('.bhr-test') || el.closest('a, input, textarea, select'))) return;
      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setNotes((x) => !x);
        return;
      }
      if (lessonStep(e.key, 0, DOLL_TEST_STEPS.length) === null) return;
      e.preventDefault();
      setI((at) => lessonStep(e.key, at, DOLL_TEST_STEPS.length) ?? at);
    };
    window.addEventListener('keydown', onWindowKey);
    return () => window.removeEventListener('keydown', onWindowKey);
  }, [active]);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen?.();
    else void document.documentElement.requestFullscreen?.().catch(() => {});
  };

  return (
    <div className="bhr-test" data-notes={notes || undefined}>
      {/* The introduction on the first step only: after that the screen is the lesson's. */}
      {i === 0 && <p className="bhr-intro">{DOLL_TEST_TEXT.intro}</p>}
      <div className="bhr-test-body">
        <div className="bhr-test-art" key={`p-${step.id}`}>
          <Picture kind={step.picture} />
        </div>
        <section className="bhr-test-words" key={`w-${step.id}`} aria-labelledby="bhr-step-heading" tabIndex={0}>
          <p className="bhr-step-count" aria-hidden="true">
            Step {i + 1} of {DOLL_TEST_STEPS.length}
          </p>
          <h2 id="bhr-step-heading" className="bhr-step-heading">{step.heading}</h2>
          {step.facts.map((f) => (
            <FactNote key={f.text} fact={f} className="bhr-fact" />
          ))}
          {last && (
            <blockquote className="bhr-poster-quote">
              <p>{DOLL_TEST_TEXT.poster}</p>
              <cite>{DOLL_TEST_TEXT.posterCite}</cite>
            </blockquote>
          )}
          <div className="bhr-prompt">
            <h3 className="bhr-prompt-heading">{DOLL_TEST_TEXT.talk}</h3>
            {last ? (
              <ul className="bhr-prompt-list">
                {DOLL_TEST_TEXT.questions.map((q) => (
                  <li key={q}>{q}</li>
                ))}
              </ul>
            ) : (
              <p className="bhr-prompt-q">{step.prompt}</p>
            )}
          </div>
          {notes && (
            <aside className="bhr-notes" aria-label={DOLL_TEST_TEXT.notesHeading}>
              <h3 className="bhr-notes-heading">{DOLL_TEST_TEXT.notesHeading}</h3>
              <ul>
                {step.notes.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </aside>
          )}
        </section>
      </div>

      <div className="bhr-test-foot">
        <nav className="bhr-steps" aria-label="The lesson">
          <button type="button" className="bhr-step-arrow" onClick={() => go(i - 1, i - 1 === 0)} disabled={i === 0} aria-label="Back">
            <span aria-hidden="true">&#8592;</span>
          </button>
          <ol>
            {DOLL_TEST_STEPS.map((s, n) => (
              <li key={s.id}>
                <button
                  ref={(el) => {
                    stepRefs.current[n] = el;
                  }}
                  type="button"
                  className="bhr-step-dot"
                  aria-current={n === i ? 'step' : undefined}
                  aria-label={`${n + 1}: ${s.heading}`}
                  tabIndex={n === i ? 0 : -1}
                  onClick={() => go(n)}
                  onKeyDown={onKey}
                >
                  <span aria-hidden="true">{n + 1}</span>
                </button>
              </li>
            ))}
          </ol>
          <button type="button" className="bhr-step-arrow" onClick={() => go(i + 1, i + 1 === DOLL_TEST_STEPS.length - 1)} disabled={last} aria-label="Next">
            <span aria-hidden="true">&#8594;</span>
          </button>
        </nav>
        <div className="bhr-teach">
          <button type="button" className="bhr-button bhr-button-ghost" aria-pressed={notes} onClick={() => setNotes((x) => !x)}>
            {DOLL_TEST_TEXT.notesOn}
          </button>
          {fullscreenOk && (
            <button type="button" className="bhr-button bhr-button-ghost bhr-fullscreen" onClick={toggleFullscreen}>
              {fullscreen ? DOLL_TEST_TEXT.exitFullscreen : DOLL_TEST_TEXT.fullscreen}
            </button>
          )}
        </div>
      </div>
      <p className="bhr-small bhr-keys">{DOLL_TEST_TEXT.keys}</p>
      <p role="status" style={srOnly}>{`${i + 1} of ${DOLL_TEST_STEPS.length}: ${step.heading}`}</p>
    </div>
  );
}
