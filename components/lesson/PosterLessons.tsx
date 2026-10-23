import Link from 'next/link';
import { catalogFor, lessonPath, lessonsForPoster, lessonsPath } from '@/lib/lessons/catalog';
import styles from './posterLessons.module.css';

/**
 * Under a poster's "Return to Exhibition": the lessons that teach this
 * poster, and the way to the exhibition's whole list. Drawn in the poster's
 * own text color, so it sits on any of the posters' grounds.
 */
export default function PosterLessons({ exhibition, poster, color }: { exhibition: string; poster: string; color: string }) {
  const all = catalogFor(exhibition);
  if (all.length === 0) return null;
  const mine = lessonsForPoster(exhibition, poster);

  return (
    <section className={styles.box} style={{ color }} aria-labelledby={`poster-lessons-${poster}`}>
      <h2 className={styles.heading} id={`poster-lessons-${poster}`}>
        {mine.length > 0 ? 'Teach this poster' : 'For teachers'}
      </h2>
      {mine.length > 0 && (
        <ul className={styles.list}>
          {mine.map((l) => (
            <li key={l.slug}>
              <Link href={lessonPath(exhibition, l.slug)} className={styles.lesson}>
                <span className={styles.title}>{l.title}</span>
                <span className={styles.sub}>
                  {l.grade} · {l.minutes} min
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <Link href={lessonsPath(exhibition)} className={styles.all}>
        {mine.length > 0 ? `All ${all.length} lessons` : `${all.length} lessons to run on a classroom screen`} <span aria-hidden="true">→</span>
      </Link>
    </section>
  );
}
