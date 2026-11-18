'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import LessonFinder, { RoleBar, RoleCards } from '@/components/projector/LessonFinder';
import { FLOORS } from '@/lib/floors';
import { catalogFor, lessonsPath } from '@/lib/lessons/catalog';
import { MUSEUM_TEACH_THEME, guidesFor, readTeachRole, teachTheme, withLessons, writeTeachRole, type TeachRole } from '@/lib/lessons/teach';
import styles from './resources.module.css';

/*
 * The Resources hub: every exhibition's lessons and printables in one place,
 * by role. The visitor says who they are (kept for the visit, the same choice
 * as "Teach with this"), and the lesson finder asks their grade and subject
 * and shows their lesson from each exhibition that has one, to teach online
 * or print. Below, every exhibition: its guides, all its lessons, or word
 * that its lesson plans are on their way. Linked from the museum map and the
 * Great Hall; inside a room, "Teach with this" holds the same materials.
 */

/** Every open exhibition, floor by floor, as the Great Hall's stairs climb. */
const EXHIBITIONS = FLOORS.flatMap((floor) => floor.exhibitions.filter((e) => e.active).map((e) => ({ ...e, floor: floor.title })));
const SLUGS = EXHIBITIONS.map((e) => e.slug);
const NAMES = Object.fromEntries(EXHIBITIONS.map((e) => [e.slug, e.title]));

export default function ResourcesHub() {
  const [role, setRoleState] = useState<TeachRole | null>(null);
  const finderHeading = useRef<HTMLHeadingElement>(null);
  const chose = useRef(false);
  const vars = useMemo(() => teachTheme(MUSEUM_TEACH_THEME) as CSSProperties, []);

  // The role chosen earlier in the visit (here or in a room's "Teach with this"), read once in the browser.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sessionStorage is only known in the browser
    setRoleState(readTeachRole());
  }, []);

  useEffect(() => {
    if (!chose.current) return;
    chose.current = false;
    finderHeading.current?.focus();
  }, [role]);

  const setRole = (r: TeachRole) => {
    if (role === null) chose.current = true;
    writeTeachRole(r);
    setRoleState(r);
  };

  const withAny = withLessons(SLUGS);

  return (
    <div className={styles.page} style={vars}>
      <Link href="/greathall" className={styles.back}>
        <span className={styles.backM} aria-hidden="true">
          M
        </span>
        <span aria-hidden="true">←</span>
        <span className={styles.backLabel}>Great Hall</span>
      </Link>

      <div className={styles.inner}>
        <header className={styles.head}>
          <p className={styles.kicker}>The Mini Museum</p>
          <h1 className={styles.title}>Resources</h1>
          <p className={styles.lead}>
            Lesson plans and printables from every exhibition, free to use, print and share. Tell us who you are and your grade, and we’ll show you your lesson.
          </p>
        </header>

        <section className={styles.section} aria-labelledby="hub-who">
          <h2 className={styles.sectionTitle} id="hub-who">
            Who are you?
          </h2>
          {role === null ? <RoleCards onChoose={setRole} /> : <RoleBar role={role} onChoose={setRole} />}
        </section>

        {role && (
          <section className={styles.section} aria-labelledby="hub-finder">
            <h2 className={styles.sectionTitle} id="hub-finder" ref={finderHeading} tabIndex={-1}>
              Find your lesson
            </h2>
            <p className={styles.sectionLead}>
              From {withAny.length === 1 ? 'the exhibition' : `the ${withAny.length} exhibitions`} with lesson plans so far. Each lesson runs online, step by step, or
              prints with its lesson plan and handouts.
            </p>
            <LessonFinder exhibitions={withAny} role={role} level={3} names={NAMES} showGuides={false} />
          </section>
        )}

        <section className={styles.section} aria-labelledby="hub-all">
          <h2 className={styles.sectionTitle} id="hub-all">
            Every exhibition
          </h2>
          <p className={styles.sectionLead}>
            In every room, <em>Teach with this</em> puts the posters on a big screen, with their discussion questions to print, and lists the room’s interactives.
          </p>
          <ul className={styles.exhibitions}>
            {EXHIBITIONS.map((e) => {
              const n = catalogFor(e.slug).length;
              const guides = role ? guidesFor(e.slug, role) : [];
              return (
                <li key={e.slug} className={styles.exhibition} style={{ '--hub-accent': e.accent } as CSSProperties}>
                  <p className={styles.floor}>{e.floor}</p>
                  <h3 className={styles.exhibitionTitle}>{e.title}</h3>
                  <p className={styles.exhibitionSub}>{e.subtitle}</p>
                  {n > 0 ? (
                    <Link href={lessonsPath(e.slug)} className={styles.lessonsLink}>
                      All {n} lessons <span aria-hidden="true">→</span>
                    </Link>
                  ) : (
                    <p className={styles.onTheWay}>Lesson plans on their way</p>
                  )}
                  {guides.length > 0 && (
                    <ul className={styles.guides} aria-label={`Guides: ${e.title}`}>
                      {guides.map((g) => (
                        <li key={g.href}>
                          <a href={g.href} target="_blank" rel="noopener noreferrer" className={styles.guide}>
                            {g.label}
                            <span className={styles.srOnly}> (PDF, opens in a new tab)</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                  <Link href={`/exhibitions/${e.slug}`} className={styles.visit}>
                    Visit the exhibition <span aria-hidden="true">→</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}
