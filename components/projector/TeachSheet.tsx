'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useDialogFocus } from '@/lib/a11y';
import { catalogFor } from '@/lib/lessons/catalog';
import {
  SECTION_ORDER,
  TEACH_ROLES,
  gradeParts,
  isResourcesLink,
  lessonPath,
  lessonsByGrade,
  lessonsPath,
  printablesFor,
  readTeachRole,
  writeTeachRole,
  type TeachRole,
  type TeachSection,
} from '@/lib/lessons/teach';
import { posterChapters, type PosterTalk } from './posterTalk';
import styles from './teachSheet.module.css';

/** What an exhibition hands "Teach with this" to fill its sheet. */
export type TeachContent = {
  /** "seeing-is-deceiving" */
  slug: string;
  /** "Seeing is Deceiving" */
  name: string;
  posters: { id: string; title: string; items: { type: string; text?: string }[]; talk: PosterTalk }[];
  /** The exhibition's interactive rooms (its projector links). */
  links: { label: string; href: string }[];
};

/*
 * The sheet "Teach with this" opens: the visitor says who they are, then sees
 * that role's materials in groups. A modal dialog (focus kept inside, Escape
 * or the backdrop closes it, focus goes back to the button); centered on a
 * wide screen, the full height of a phone, and it scrolls inside itself.
 */
export default function TeachSheet({ content, onPresent, onClose }: { content: TeachContent; onPresent: () => void; onClose: () => void }) {
  const [role, setRoleState] = useState<TeachRole | null>(() => readTeachRole());
  const dialogRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const roleHeading = useRef<HTMLHeadingElement>(null);
  const chose = useRef(false);

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

  // After a choice, start the reader at the top of that role's materials.
  useEffect(() => {
    if (!chose.current) return;
    chose.current = false;
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
    roleHeading.current?.focus({ preventScroll: true });
  }, [role]);

  const setRole = (r: TeachRole) => {
    chose.current = true;
    writeTeachRole(r);
    setRoleState(r);
  };

  const present = () => {
    onClose();
    onPresent();
  };

  const heading = TEACH_ROLES.find((r) => r.id === role)?.heading;

  return createPortal(
    <div className={styles.overlay} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={dialogRef} className={styles.sheet} role="dialog" aria-modal="true" aria-labelledby="teach-sheet-title" tabIndex={-1}>
        <header className={styles.head}>
          <div>
            <p className={styles.eyebrow}>Teach with this</p>
            <h2 className={styles.title} id="teach-sheet-title">
              {content.name}
            </h2>
          </div>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        <div className={styles.body} ref={bodyRef}>
          {role === null ? (
            <section aria-labelledby="teach-who">
              <h3 className={styles.who} id="teach-who">
                Who is teaching?
              </h3>
              <p className={styles.lead}>Choose one, and we’ll show what suits you. You can change it at any time.</p>
              <ul className={styles.roleCards}>
                {TEACH_ROLES.map((r) => (
                  <li key={r.id}>
                    <button type="button" className={styles.roleCard} onClick={() => setRole(r.id)}>
                      <span className={styles.roleName}>{r.label}</span>
                      <span className={styles.roleHint}>{r.hint}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ) : (
            <>
              <div className={styles.roleBar} role="group" aria-label="Who is teaching">
                {TEACH_ROLES.map((r) => (
                  <button key={r.id} type="button" className={styles.roleChip} aria-pressed={r.id === role} onClick={() => setRole(r.id)}>
                    {r.label}
                  </button>
                ))}
              </div>
              <h3 className={styles.forRole} ref={roleHeading} tabIndex={-1}>
                {heading}
              </h3>
              {SECTION_ORDER[role].map((s) => (
                <Section key={s} section={s} role={role} content={content} onPresent={present} />
              ))}
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

function Group({ id, title, intro, children }: { id: string; title: string; intro?: string; children: ReactNode }) {
  return (
    <section className={styles.group} aria-labelledby={`teach-${id}`}>
      <h4 className={styles.groupTitle} id={`teach-${id}`}>
        {title}
      </h4>
      {intro && <p className={styles.groupIntro}>{intro}</p>}
      {children}
    </section>
  );
}

function Section({ section, role, content, onPresent }: { section: TeachSection; role: TeachRole; content: TeachContent; onPresent: () => void }) {
  const { slug, posters } = content;

  if (section === 'present') {
    const n = posters.length;
    return (
      <Group
        id="present"
        title="Present the posters"
        intro={`Projector mode shows ${n === 1 ? 'the poster' : `the ${n} posters`} on a big screen, one panel at a time, with a question to talk about for each chapter. A clicker or the arrow keys move it on.`}
      >
        <button type="button" className={styles.primary} onClick={onPresent}>
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
            <rect x="3" y="4" width="18" height="12" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <path d="M12 16v3M8 20h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          Open projector mode
        </button>
      </Group>
    );
  }

  if (section === 'lessons') {
    const groups = lessonsByGrade(slug, role);
    const total = catalogFor(slug).length;
    if (total === 0) return null;
    const shown = groups.reduce((n, g) => n + g.lessons.length, 0);
    return (
      <Group
        id="lessons"
        title={role === 'librarian' ? 'Lessons for the library' : 'Lessons by grade'}
        intro={
          role === 'librarian'
            ? 'The general lessons for the younger grades, and the reading and research lessons for grades 5–8. Each runs on a screen, step by step.'
            : 'Each runs on a screen, step by step, with the lesson plan and handouts to print.'
        }
      >
        {groups.map((g) => (
          <div key={g.band} className={styles.band}>
            <h5 className={styles.bandTitle}>{g.band}</h5>
            <ul className={styles.lessonList}>
              {g.lessons.map((l) => {
                const { subject } = gradeParts(l);
                return (
                  <li key={l.slug}>
                    <Link href={lessonPath(slug, l.slug)} className={styles.lesson}>
                      <span className={styles.lessonTitle}>{l.title}</span>
                      <span className={styles.lessonMeta}>
                        {subject ?? 'General'} · {l.minutes} min
                        {l.faith && <span className={styles.faith}>Faith-based</span>}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
        <Link href={lessonsPath(slug)} className={styles.more}>
          {shown < total ? `See all ${total} lessons, every subject` : `All ${total} lessons on one page`} <span aria-hidden="true">→</span>
        </Link>
      </Group>
    );
  }

  if (section === 'printables') {
    const items = printablesFor(slug, role);
    if (items.length === 0) return null;
    return (
      <Group id="printables" title="Printables">
        <ul className={styles.linkList}>
          {items.map((p) => (
            <li key={p.label}>
              {p.file ? (
                <a href={p.href} className={styles.linkRow} target="_blank" rel="noopener noreferrer">
                  <span className={styles.linkLabel}>{p.label}</span>
                  <span className={styles.linkDetail}>
                    {p.detail}
                    <span className={styles.srOnly}> (opens in a new tab)</span>
                  </span>
                </a>
              ) : (
                <Link href={p.href} className={styles.linkRow}>
                  <span className={styles.linkLabel}>
                    {p.label} <span aria-hidden="true">→</span>
                  </span>
                  <span className={styles.linkDetail}>{p.detail}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </Group>
    );
  }

  if (section === 'discussion') {
    const sets = posters
      .map((p, i) => ({
        poster: p,
        index: i,
        questions: posterChapters(p.items, p.title)
          .map((c) => ({ chapter: c.name, question: p.talk[c.key] }))
          .filter((q): q is { chapter: string; question: string } => Boolean(q.question)),
      }))
      .filter((s) => s.questions.length > 0);
    if (sets.length === 0) return null;
    return (
      <Group
        id="discussion"
        title={role === 'parent' ? 'Talk about it together' : 'Discussion questions'}
        intro="One question for each chapter of the posters, drawn from that chapter’s own words."
      >
        {sets.map((s) => (
          <details key={s.poster.id} className={styles.details}>
            <summary className={styles.summary}>
              <span className={styles.summaryLabel}>Poster {s.index + 1}</span> {s.poster.title}
              <span className={styles.summaryCount}>
                {s.questions.length} {s.questions.length === 1 ? 'question' : 'questions'}
              </span>
            </summary>
            <ol className={styles.questions}>
              {s.questions.map((q) => (
                <li key={q.chapter}>
                  <span className={styles.chapter}>{q.chapter}</span>
                  {q.question}
                </li>
              ))}
            </ol>
          </details>
        ))}
      </Group>
    );
  }

  // Interactives: the exhibition's hands-on rooms.
  const links = content.links.filter((l) => !isResourcesLink(slug, l.href));
  if (links.length === 0) return null;
  return (
    <Group id="interactives" title="Interactives">
      <ul className={styles.linkList}>
        {links.map((l) => {
          const [label, ...rest] = l.label.split(': ');
          return (
            <li key={l.href}>
              <Link href={l.href} className={styles.linkRow}>
                <span className={styles.linkLabel}>
                  {label} <span aria-hidden="true">→</span>
                </span>
                {rest.length > 0 && <span className={styles.linkDetail}>{rest.join(': ')}</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </Group>
  );
}
