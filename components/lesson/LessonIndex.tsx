import Image from 'next/image';
import Link from 'next/link';
import type { Lesson } from '@/lib/lessons/types';
import { Inline } from './Inline';
import styles from './lessonIndex.module.css';

type Props = {
  lessons: Lesson[];
  basePath: string;
  exhibitionHref: string;
  resourcesHref: string;
  exhibitionName: string;
};

/** Every lesson an exhibition can teach on screen. */
export function LessonIndex({ lessons, basePath, exhibitionHref, resourcesHref, exhibitionName }: Props) {
  return (
    <div className={styles.page}>
      <nav className={styles.crumbs} aria-label="Breadcrumb">
        <Link href={exhibitionHref}>{exhibitionName}</Link>
        <span aria-hidden="true">/</span>
        <Link href={resourcesHref}>Resources</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Lessons</span>
      </nav>

      <header className={styles.head}>
        <p className={styles.eyebrow}>{exhibitionName} · For teachers</p>
        <h1 className={styles.title}>Teach on screen</h1>
        <p className={styles.lede}>
          Put the lesson on the classroom projector and press Start. The class sees one calm step at a
          time; your script, the clock and the handouts stay on your laptop in presenter view.
        </p>
      </header>

      <ul className={styles.list}>
        {lessons.map((l) => (
          <li key={l.slug} className={styles.card}>
            {l.hero && (
              <div className={styles.cardImg}>
                <Image src={l.hero.img} alt="" fill sizes="(max-width: 800px) 100vw, 40vw" style={{ objectPosition: l.hero.pos ?? 'center' }} />
              </div>
            )}
            <div className={styles.cardBody}>
              <p className={styles.eyebrow}>{l.sub}</p>
              <h2 className={styles.cardTitle}>{l.title}</h2>
              {l.objective[0] && (
                <p className={styles.cardText}>
                  <Inline text={l.objective[0]} />
                </p>
              )}
              <div className={styles.bar} aria-label={`${l.totalMinutes} minutes: ${l.phases.map((p) => `${p.name} ${p.minutes}`).join(', ')}`} role="img">
                {l.phases.map((p) => (
                  <span key={p.name} style={{ flex: p.minutes, background: p.color }} />
                ))}
              </div>
              <p className={styles.barLabels} aria-hidden="true">
                {l.phases.map((p) => (
                  <span key={p.name} style={{ flex: p.minutes }}>
                    {p.name} {p.minutes}
                  </span>
                ))}
              </p>
              <div className={styles.actions}>
                <Link href={`${basePath}/${l.slug}`} className={styles.primary}>
                  Teach this lesson on screen
                </Link>
                <a href={l.lessonPlan} className={styles.secondary} target="_blank" rel="noopener">
                  Lesson plan (PDF)
                </a>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
