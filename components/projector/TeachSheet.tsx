'use client';

import Link from 'next/link';
import { useEffect, useId, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useDialogFocus } from '@/lib/a11y';
import { MUSEUM_TEACH_THEME, isResourcesLink, readTeachRole, teachTheme, withLessons, writeTeachRole, type TeachRole, type TeachThemeInput } from '@/lib/lessons/teach';
import LessonFinder, { RoleBar, RoleCards } from './LessonFinder';
import { posterChapters, type PosterTalk } from './posterTalk';
import styles from './teachSheet.module.css';

/** One of the exhibition's interactive rooms, as the sheet lists it. */
export type TeachRoom = { href: string; title: string; subtitle?: string; image?: { src: string; alt: string } };

/** What an exhibition hands "Teach with this" to fill its sheet. */
export type TeachContent = {
  /** "seeing-is-deceiving" */
  slug: string;
  /** "Seeing is Deceiving" */
  name: string;
  posters: { id: string; title: string; items: { type: string; text?: string }[]; talk: PosterTalk }[];
  /** The exhibition's projector links: the rooms, where `rooms` is not given. */
  links: { label: string; href: string }[];
  /** The exhibition's interactive rooms, in the order its Explore row lists them. */
  rooms?: TeachRoom[];
  /** A note for whoever teaches with it, shown first (an age recommendation, say). */
  note?: string;
  /** The room's own colours and type; the sheet wears them (teachTheme). */
  theme?: TeachThemeInput;
};

/*
 * "Teach with this": a full-screen sheet in the room's own colours. The
 * visitor says who they are (teacher, librarian, parent or homeschool; kept
 * for the visit), then three steps follow: present the posters (projector
 * mode, with the discussion questions alongside, to read or print), the
 * room's interactives (opened and closed), and the lesson finder, which asks
 * their grade and subject and shows just their lesson, to teach online or to
 * print. An exhibition with no lessons yet says so plainly. A modal dialog:
 * focus kept inside, Escape closes it, focus goes back to the button. The
 * discussion questions print on their own sheet (print CSS in
 * teachSheet.module.css).
 */
export default function TeachSheet({ content, onPresent, onClose }: { content: TeachContent; onPresent: () => void; onClose: () => void }) {
  const [role, setRoleState] = useState<TeachRole | null>(() => readTeachRole());
  const dialogRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const firstStep = useRef<HTMLHeadingElement>(null);
  const chose = useRef(false);
  const vars = useMemo(() => teachTheme(content.theme ?? MUSEUM_TEACH_THEME) as CSSProperties, [content.theme]);

  useDialogFocus(dialogRef, true, { onEscape: onClose });

  // The page underneath stays put while the sheet is open.
  useEffect(() => {
    const html = document.documentElement;
    const before = html.style.overflow;
    html.style.overflow = 'hidden';
    return () => {
      html.style.overflow = before;
    };
  }, []);

  // After the first choice, start the reader at the top of the steps.
  useEffect(() => {
    if (!chose.current) return;
    chose.current = false;
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
    firstStep.current?.focus({ preventScroll: true });
  }, [role]);

  const setRole = (r: TeachRole) => {
    if (role === null) chose.current = true;
    writeTeachRole(r);
    setRoleState(r);
  };

  const present = () => {
    onClose();
    onPresent();
  };

  const questions = discussionSets(content.posters);

  return createPortal(
    <div className={styles.overlay} style={vars} data-teach-sheet="">
      <style>{PRINT_CSS}</style>
      <div ref={dialogRef} className={styles.sheet} role="dialog" aria-modal="true" aria-labelledby="teach-sheet-title" tabIndex={-1}>
        <header className={styles.head}>
          <div className={styles.headInner}>
            <div>
              <p className={styles.eyebrow}>Teach with this</p>
              <h2 className={styles.title} id="teach-sheet-title">
                {content.name}
              </h2>
            </div>
            <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </header>

        <div className={styles.body} ref={bodyRef}>
          <div className={styles.inner}>
            {content.note && (
              <p className={styles.note} role="note">
                <span className={styles.noteLabel}>A note before you teach</span> {content.note}
              </p>
            )}

            {role === null ? (
              <section aria-labelledby="teach-who" className={styles.intro}>
                <h3 className={styles.who} id="teach-who">
                  Who are you?
                </h3>
                <p className={styles.lead}>Choose one, and we’ll set out what suits you: the posters on a big screen, the interactives, and your lesson. You can change it at any time.</p>
                <RoleCards onChoose={setRole} />
              </section>
            ) : (
              <>
                <RoleBar role={role} onChoose={setRole} />
                <PresentStep role={role} content={content} questions={questions} onPresent={present} headingRef={firstStep} />
                <InteractivesStep content={content} />
                <LessonsStep role={role} content={content} />
              </>
            )}
          </div>
        </div>
      </div>
      <PrintQuestions name={content.name} questions={questions} />
    </div>,
    document.body,
  );
}

/**
 * While the sheet is open, printing gives the discussion questions alone:
 * the page behind it and the sheet itself step aside (global, so here and
 * not in the CSS module).
 */
const PRINT_CSS = `@media print {
  html, body { overflow: visible !important; height: auto !important; background: #fff !important; }
  body > :not([data-teach-sheet]) { display: none !important; }
}`;

type QuestionSet = { id: string; index: number; title: string; questions: { chapter: string; question: string }[] };

/** The posters' discussion questions: one for each chapter, drawn from that chapter's own words (posterTalk). */
function discussionSets(posters: TeachContent['posters']): QuestionSet[] {
  return posters
    .map((p, i) => ({
      id: p.id,
      index: i,
      title: p.title,
      questions: posterChapters(p.items, p.title)
        .map((c) => ({ chapter: c.name, question: p.talk[c.key] }))
        .filter((q): q is { chapter: string; question: string } => Boolean(q.question)),
    }))
    .filter((s) => s.questions.length > 0);
}

function Step({ n, id, title, children, headingRef }: { n: number; id: string; title: ReactNode; children: ReactNode; headingRef?: React.Ref<HTMLHeadingElement> }) {
  return (
    <section className={styles.step} aria-labelledby={`teach-${id}`}>
      <h3 className={styles.stepTitle} id={`teach-${id}`} ref={headingRef} tabIndex={headingRef ? -1 : undefined}>
        <span className={styles.stepNumber} aria-hidden="true">
          {n}
        </span>
        {title}
      </h3>
      {children}
    </section>
  );
}

function QuestionList({ sets }: { sets: QuestionSet[] }) {
  return (
    <>
      {sets.map((s) => (
        <div key={s.id} className={styles.qPoster}>
          <p className={styles.qPosterTitle}>
            <span className={styles.qPosterLabel}>Poster {s.index + 1}</span> {s.title}
          </p>
          <ol className={styles.questions}>
            {s.questions.map((q) => (
              <li key={q.chapter}>
                <span className={styles.chapter}>{q.chapter}</span>
                {q.question}
              </li>
            ))}
          </ol>
        </div>
      ))}
    </>
  );
}

function PresentStep({
  role,
  content,
  questions,
  onPresent,
  headingRef,
}: {
  role: TeachRole;
  content: TeachContent;
  questions: QuestionSet[];
  onPresent: () => void;
  headingRef: React.Ref<HTMLHeadingElement>;
}) {
  const [open, setOpen] = useState(false);
  const listId = useId();
  const n = content.posters.length;
  const count = questions.reduce((k, s) => k + s.questions.length, 0);
  const home = role === 'parent' || role === 'homeschool';
  return (
    <Step n={1} id="present" title="Present the posters" headingRef={headingRef}>
      <div className={styles.presentGrid}>
        <div className={styles.projectorCard}>
          <svg className={styles.bigIcon} viewBox="0 0 64 48" width="64" height="48" aria-hidden="true" focusable="false">
            <rect x="4" y="4" width="56" height="32" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M14 28l10-12 8 9 6-6 12 9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <path d="M32 36v6M22 44h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <h4 className={styles.cardTitle}>On the big screen</h4>
          <p className={styles.cardText}>
            Projector mode shows {n === 1 ? 'the poster' : `the ${n} posters`} one panel at a time, with a question to talk about for each chapter. A
            clicker or the arrow keys move it on.
          </p>
          <button type="button" className={styles.primary} onClick={onPresent}>
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
              <rect x="3" y="4" width="18" height="12" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <path d="M12 16v3M8 20h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            Open projector mode
          </button>
        </div>

        {questions.length > 0 && (
          <div className={styles.questionsCard}>
            <svg className={styles.bigIcon} viewBox="0 0 64 48" width="64" height="48" aria-hidden="true" focusable="false">
              <path d="M18 4h22l10 10v30H18z M40 4v10h10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              <path d="M25 22h18M25 29h18M25 36h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <h4 className={styles.cardTitle}>{home ? 'Questions to talk about together' : 'Discussion questions'}</h4>
            <p className={styles.cardText}>
              {count} {count === 1 ? 'question' : 'questions'}, one for each chapter of the posters, drawn from its own words. Print them to keep beside you, or
              to hand out.
            </p>
            <div className={styles.cardActions}>
              <button type="button" className={styles.primary} onClick={() => window.print()}>
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
                  <path d="M7 9V3h10v6M7 17H4v-7h16v7h-3M7 14h10v7H7z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                </svg>
                Print the questions
              </button>
              <button type="button" className={styles.secondary} aria-expanded={open} aria-controls={listId} onClick={() => setOpen((o) => !o)}>
                {open ? 'Hide them' : 'Read them here'}
              </button>
            </div>
            <div id={listId} hidden={!open} className={styles.questionPanel}>
              {open && <QuestionList sets={questions} />}
            </div>
          </div>
        )}
      </div>
    </Step>
  );
}

function InteractivesStep({ content }: { content: TeachContent }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const rooms: TeachRoom[] = content.rooms?.length
    ? content.rooms
    : content.links
        .filter((l) => !isResourcesLink(l.href))
        .map((l) => {
          const [title, ...rest] = l.label.split(': ');
          return { href: l.href, title, subtitle: rest.join(': ') || undefined };
        });
  if (rooms.length === 0) return null;
  const names = rooms.map((r) => r.title);
  return (
    <section className={styles.step} aria-labelledby="teach-interactives">
      <h3 className={styles.stepTitle} id="teach-interactives">
        <span className={styles.stepNumber} aria-hidden="true">
          2
        </span>
        <button type="button" className={styles.disclosure} aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((o) => !o)}>
          <span>Interactives</span>
          <span className={styles.disclosureCount}>
            {rooms.length} {rooms.length === 1 ? 'room' : 'rooms'}
          </span>
          <svg className={styles.chevron} viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
            <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </h3>
      {!open && <p className={styles.stepLead}>{names.join(' · ')}</p>}
      <div id={panelId} hidden={!open}>
        {open && (
          <ul className={styles.rooms}>
            {rooms.map((r) => (
              <li key={r.href}>
                <Link href={r.href} className={styles.room}>
                  {r.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className={styles.roomImage} src={r.image.src} alt="" />
                  ) : (
                    <span className={styles.roomImage} aria-hidden="true" />
                  )}
                  <span className={styles.roomText}>
                    <span className={styles.roomTitle}>
                      {r.title} <span aria-hidden="true">→</span>
                    </span>
                    {r.subtitle && <span className={styles.roomSub}>{r.subtitle}</span>}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function LessonsStep({ role, content }: { role: TeachRole; content: TeachContent }) {
  const has = withLessons([content.slug]).length > 0;
  return (
    <Step n={3} id="lessons" title="Lesson plans">
      {has ? (
        <LessonFinder exhibitions={[content.slug]} role={role} level={4} />
      ) : (
        <div className={styles.onTheWay}>
          <p className={styles.onTheWayTitle}>Lesson plans for {content.name} are on their way.</p>
          <p className={styles.cardText}>
            Until they arrive, the posters work well on a big screen with the discussion questions beside you, and the interactives are ready for the class to
            try.
          </p>
        </div>
      )}
    </Step>
  );
}

/** The discussion questions on paper: hidden on screen, the only thing printed while the sheet is open. */
function PrintQuestions({ name, questions }: { name: string; questions: QuestionSet[] }) {
  if (questions.length === 0) return null;
  return (
    <div className={styles.printSheet} aria-hidden="true">
      <p className={styles.printEyebrow}>The Mini Museum · {name}</p>
      <p className={styles.printTitle}>Discussion questions</p>
      <QuestionList sets={questions} />
      <p className={styles.printFoot}>minimuseumproject.org</p>
    </div>
  );
}
