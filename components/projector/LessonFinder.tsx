'use client';

import Link from 'next/link';
import { useId, useState, type ReactNode } from 'react';
import {
  FAITH_LESSONS,
  GRADES,
  TEACH_ROLES,
  faithSwitchShown,
  findLessons,
  finderHeading,
  gradeName,
  guidesFor,
  libraryPrintables,
  lessonsPath,
  needsSubject,
  readFaith,
  readFinder,
  roleInfo,
  subjectsFor,
  withLessons,
  writeFaith,
  writeFinder,
  type FoundLesson,
  type Grade,
  type Printable,
  type TeachRole,
} from '@/lib/lessons/teach';
import { catalogFor } from '@/lib/lessons/catalog';
import styles from './lessonFinder.module.css';

/*
 * The pieces "Teach with this" (TeachSheet) and the Resources hub
 * (app/resources) share: the four role cards, and the lesson finder. The
 * finder asks who you are in one more step (your grade, and for grades 5–8
 * your subject) and shows just your lesson: open it on a screen, or print its
 * lesson plan and handouts, side by side. A switch keeps faith-based lessons
 * out until it is turned on (FAITH_LESSONS in lib/lessons/teach.ts). The
 * grade, the subject and the switch are kept for the visit. Colours come from
 * the --tw-* custom properties its page sets (teachTheme).
 */

type Level = 2 | 3 | 4 | 5;
function H({ level, children, className, id }: { level: Level; children: ReactNode; className?: string; id?: string }) {
  const Tag = `h${level}` as 'h2' | 'h3' | 'h4' | 'h5';
  return (
    <Tag className={className} id={id}>
      {children}
    </Tag>
  );
}

const ROLE_ICONS: Record<TeachRole, ReactNode> = {
  // A blackboard on its easel.
  teacher: (
    <>
      <rect x="6" y="7" width="36" height="24" rx="2" />
      <path d="M12 15h14M12 21h20M16 31l-4 10M32 31l4 10M24 31v6" />
    </>
  ),
  // Books on a shelf, one leaning.
  librarian: (
    <>
      <path d="M6 40h36" />
      <rect x="9" y="12" width="6" height="28" rx="1" />
      <rect x="17" y="8" width="7" height="32" rx="1" />
      <path d="M28 14l6-2 7 26-6 2z" />
    </>
  ),
  // Two figures, a grown-up and a child.
  parent: (
    <>
      <circle cx="17" cy="11" r="5" />
      <path d="M8 40V27a9 9 0 0 1 18 0v13" />
      <circle cx="33" cy="20" r="4" />
      <path d="M27 40v-8a6 6 0 0 1 12 0v8" />
    </>
  ),
  // A house with an open book in its door.
  homeschool: (
    <>
      <path d="M6 22L24 7l18 15" />
      <path d="M11 18v22h26V18" />
      <path d="M17 34c2.5-1.5 5-1.5 7 0 2-1.5 4.5-1.5 7 0v-9c-2.5-1.5-5-1.5-7 0-2-1.5-4.5-1.5-7 0z" />
      <path d="M24 25v9" />
    </>
  ),
};

function RoleIcon({ role }: { role: TeachRole }) {
  return (
    <svg className={styles.roleIcon} viewBox="0 0 48 48" width="48" height="48" aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {ROLE_ICONS[role]}
      </g>
    </svg>
  );
}

/** The first question: four large cards. */
export function RoleCards({ onChoose }: { onChoose: (r: TeachRole) => void }) {
  return (
    <ul className={styles.roleCards}>
      {TEACH_ROLES.map((r) => (
        <li key={r.id}>
          <button type="button" className={styles.roleCard} onClick={() => onChoose(r.id)}>
            <RoleIcon role={r.id} />
            <span className={styles.roleName}>{r.label}</span>
            <span className={styles.roleHint}>{r.hint}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

/** Once chosen: the four roles in one row, the chosen one pressed. */
export function RoleBar({ role, onChoose }: { role: TeachRole; onChoose: (r: TeachRole) => void }) {
  return (
    <div className={styles.roleBar} role="group" aria-label="Who are you?">
      <span className={styles.roleBarLabel} aria-hidden="true">
        I am a
      </span>
      {TEACH_ROLES.map((r) => (
        <button key={r.id} type="button" className={styles.roleChip} aria-pressed={r.id === role} onClick={() => onChoose(r.id)}>
          {r.label}
        </button>
      ))}
    </div>
  );
}

/** "Include faith-based lessons": a switch, off by default (FAITH_LESSONS). */
export function FaithSwitch({ on, onChange }: { on: boolean; onChange: (on: boolean) => void }) {
  const id = useId();
  return (
    <div className={styles.faith}>
      <button id={id} type="button" role="switch" aria-checked={on} className={styles.switch} onClick={() => onChange(!on)}>
        <span className={styles.switchKnob} aria-hidden="true" />
      </button>
      <label htmlFor={id} className={styles.switchLabel}>
        Include faith-based lessons
      </label>
    </div>
  );
}

function PrintList({ items }: { items: Printable[] }) {
  return (
    <ul className={styles.printList}>
      {items.map((p) => (
        <li key={p.href}>
          <a href={p.href} className={`${styles.printRow} ${p.kind === 'plan' ? styles.printPlan : ''}`} target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false" className={styles.printIcon}>
              <path d="M7 3h7l4 4v14H7z M14 3v4h4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              {p.kind === 'handout' && <path d="M10 12h5M10 15h5M10 18h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />}
            </svg>
            <span className={styles.printText}>
              <span className={styles.printLabel}>{p.label}</span>
              <span className={styles.printDetail}>
                {p.detail}
                <span className={styles.srOnly}> (opens in a new tab)</span>
              </span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

function LessonCardView({ found, level, exhibitionName }: { found: FoundLesson; level: Level; exhibitionName?: string }) {
  const { card, online, printables } = found;
  return (
    <article className={styles.lesson} aria-label={card.title}>
      <div className={styles.lessonOnline}>
        {exhibitionName && <p className={styles.lessonExhibition}>{exhibitionName}</p>}
        <H level={level} className={styles.lessonTitle}>
          {card.title}
        </H>
        <p className={styles.lessonSub}>{card.sub}</p>
        <p className={styles.lessonMeta}>
          <span>{card.grade}</span>
          <span aria-hidden="true"> · </span>
          <span>{card.minutes} minutes</span>
          {card.faith && <span className={styles.faithTag}>Faith-based option</span>}
        </p>
        <Link href={online} className={styles.primary}>
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
            <rect x="3" y="4" width="18" height="12" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <path d="M10 8l4 2-4 2z" fill="currentColor" />
            <path d="M12 16v3M8 20h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          Teach it online
        </Link>
        <p className={styles.lessonHow}>Runs on a classroom screen, one step at a time, with its timings.</p>
      </div>
      <div className={styles.lessonPrint}>
        <p className={styles.printHead}>Print it</p>
        {printables.length > 0 ? (
          <PrintList items={printables} />
        ) : (
          <p className={styles.quiet}>This lesson’s printables are on their way. It runs online in full.</p>
        )}
      </div>
    </article>
  );
}

/**
 * The lesson finder, for one exhibition (the sheet) or many (the hub, which
 * passes `names` so each lesson says which exhibition it is from).
 */
export default function LessonFinder({
  exhibitions,
  role,
  level = 4,
  names,
  showGuides = true,
}: {
  exhibitions: readonly string[];
  role: TeachRole;
  /** The heading level of the finder's own headings. */
  level?: Level;
  names?: Record<string, string>;
  showGuides?: boolean;
}) {
  const ids = withLessons(exhibitions);
  const [grade, setGradeState] = useState<Grade | null>(() => readFinder().grade);
  const [chosenSubject, setSubjectState] = useState<string | null>(() => readFinder().subject);
  const [faith, setFaithState] = useState<boolean>(() => readFaith());
  const askId = useId();
  const subjectId = useId();

  const subjects = grade ? subjectsFor(ids, grade, role, faith) : [];
  const askSubject = grade ? needsSubject(ids, grade, role) : false;
  // A subject that is no longer offered (faith-based lessons turned off) is no longer chosen;
  // where only one subject is offered, it is chosen for you.
  const subject = askSubject ? (chosenSubject && subjects.includes(chosenSubject) ? chosenSubject : subjects.length === 1 ? subjects[0] : null) : null;
  const result = grade ? findLessons(ids, { role, grade, subject, faith }) : null;
  const hasFaith = ids.some((e) => catalogFor(e).some((c) => c.faith));
  const sub = Math.min(level + 1, 5) as Level;

  const setGrade = (g: Grade) => {
    setGradeState(g);
    writeFinder(g, chosenSubject);
  };
  const setSubject = (s: string) => {
    setSubjectState(s);
    writeFinder(grade, s);
  };
  const setFaith = (on: boolean) => {
    setFaithState(on);
    writeFaith(on);
  };

  const libraryIn = (e: string) => (role === 'librarian' && grade ? libraryPrintables(e, grade) : []);
  const groups = result
    ? ids
        .map((e) => ({ exhibition: e, lessons: result.lessons.filter((l) => l.exhibition === e), library: libraryIn(e) }))
        .filter((g) => g.lessons.length > 0 || g.library.length > 0)
    : [];

  const shownCount = groups.reduce((n, g) => n + g.lessons.length, 0);
  const status = !grade || !result || result.needsSubject ? '' : shownCount === 1 ? `Your lesson: ${groups.flatMap((g) => g.lessons)[0].card.title}` : shownCount > 1 ? `${shownCount} lessons found` : groups.length > 0 ? 'Your library set is ready' : 'No lesson found';

  return (
    <div className={styles.finder}>
      <div className={styles.askRow}>
        <div className={styles.ask}>
          <p className={styles.question} id={askId}>
            {roleInfo(role).ask}
          </p>
          <div className={styles.chips} role="group" aria-labelledby={askId}>
            {GRADES.map((g) => (
              <button key={g} type="button" className={styles.gradeChip} aria-pressed={g === grade} aria-label={gradeName(g)} onClick={() => setGrade(g)}>
                {g}
              </button>
            ))}
          </div>
        </div>
        {hasFaith && faithSwitchShown(FAITH_LESSONS) && <FaithSwitch on={faith} onChange={setFaith} />}
      </div>

      {grade && askSubject && subjects.length > 0 && (
        <div className={styles.ask}>
          <p className={styles.question} id={subjectId}>
            {role === 'parent' ? 'Which subject would you like to explore?' : 'Which subject?'}
          </p>
          <div className={styles.chips} role="group" aria-labelledby={subjectId}>
            {subjects.map((s) => (
              <button key={s} type="button" className={styles.subjectChip} aria-pressed={s === subject} onClick={() => setSubject(s)}>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <p className={styles.srOnly} aria-live="polite">
        {status}
      </p>
      <div className={styles.answer}>
        {!grade && <p className={styles.prompt}>Choose a grade, and your lesson appears here.</p>}
        {result?.needsSubject && subjects.length > 0 && <p className={styles.prompt}>Now choose a subject, and your lesson appears here.</p>}
        {grade && result && !result.needsSubject && groups.length > 0 && (
          <>
            <H level={level} className={styles.forWho}>
              {finderHeading(role, grade, subject)}
            </H>
            {groups.map((g) => (
              <div key={g.exhibition} className={styles.group}>
                {g.lessons.map((l) => (
                  <LessonCardView key={l.card.slug} found={l} level={sub} exhibitionName={names?.[g.exhibition]} />
                ))}
                {g.library.length > 0 && (
                  <div className={styles.library}>
                    <p className={styles.printHead}>
                      {names?.[g.exhibition] ? `${names[g.exhibition]}: the library set` : 'The library set'}
                    </p>
                    <p className={styles.quiet}>A lesson plan written for a library visit, with its handouts.</p>
                    <PrintList items={g.library} />
                  </div>
                )}
              </div>
            ))}
          </>
        )}
        {grade && result && !result.needsSubject && groups.length === 0 && (
          <div className={styles.empty}>
            {result.hiddenFaith > 0 ? (
              <>
                <p>
                  The lesson for {gradeName(grade)} {subject ? `${subject} ` : ''}is a faith-based one.
                </p>
                <button type="button" className={styles.secondary} onClick={() => setFaith(true)}>
                  Show faith-based lessons
                </button>
              </>
            ) : (
              <p>There’s no lesson for {gradeName(grade)} yet.</p>
            )}
          </div>
        )}
        {grade && result?.needsSubject && subjects.length === 0 && (
          <div className={styles.empty}>
            <p>There’s no lesson for {gradeName(grade)} yet{result.hiddenFaith > 0 ? ' with faith-based lessons off' : ''}.</p>
          </div>
        )}
      </div>

      {showGuides &&
        ids.map((e) => {
          const guides = guidesFor(e, role);
          return guides.length > 0 ? (
            <div key={e} className={styles.guides}>
              <p className={styles.printHead}>{names?.[e] ? `Guides: ${names[e]}` : 'Guides for the whole exhibition'}</p>
              <PrintList items={guides} />
            </div>
          ) : null;
        })}

      {exhibitions.length === 1 && ids.length === 1 && (
        <Link href={lessonsPath(ids[0])} className={styles.seeAll}>
          See all {catalogFor(ids[0]).length} lessons <span aria-hidden="true">→</span>
        </Link>
      )}
    </div>
  );
}
