import Image from 'next/image';
import type { ReactNode } from 'react';
import type { Lesson, Objectives, Step } from '@/lib/lessons/types';
import {
  type Session,
  clock,
  plannedProgress,
  stepDuration,
  stepElapsed,
  totalElapsed,
  MINUTE,
} from '@/lib/lessons/session';
import { Inline } from './Inline';
import { TimingBar } from './TimingBar';
import { onDark } from './color';

/** the Red level's color, which marks the go-deeper objective */
const DEEPER = '#A8452F';
import styles from './lesson.module.css';

type Props = {
  lesson: Lesson;
  session: Session;
  now: number;
  minutes: number[];
  /** a scaled-down copy for the presenter: decorative, no headings */
  mini?: boolean;
  /** the classroom's own buttons, set into the frame */
  controls?: ReactNode;
  coverActions?: ReactNode;
};

/**
 * The projected frame: what the class sees. Every size is in container
 * units, so the same frame fills a projector or sits as a thumbnail in the
 * presenter view.
 */
export function StepStage({ lesson, session, now, minutes, mini, controls, coverActions }: Props) {
  const n = lesson.steps.length;
  const i = session.index;
  const step = i >= 0 && i < n ? lesson.steps[i] : undefined;
  const finished = i >= n;
  const progress = plannedProgress(session, minutes, now);
  const elapsed = totalElapsed(session, now);
  const H = mini ? 'p' : 'h1';

  let content: ReactNode;
  if (step) content = <StepContent step={step} mini={mini} />;
  else if (finished) content = <Finish lesson={lesson} mini={mini} />;
  else content = <Cover lesson={lesson} mini={mini} actions={coverActions} />;

  const bg = step?.screen.kind === 'painting' ? step.screen.img.img : !step && !finished ? lesson.hero?.img : undefined;

  return (
    <div className={`${styles.stage} ${mini ? styles.stageMini : ''}`} data-kind={step?.screen.kind ?? (finished ? 'finish' : 'cover')}>
      {bg && (
        <div className={styles.stageBg} aria-hidden="true">
          <Image src={bg} alt="" fill sizes={mini ? '30vw' : '100vw'} style={{ objectPosition: lesson.hero?.pos ?? 'center' }} priority={!mini} />
        </div>
      )}
      <div className={styles.stageVignette} aria-hidden="true" />

      <header className={styles.strip}>
        <p className={styles.brand}>
          <span className={styles.brandM}>M</span>
          <span>{lesson.exhibition.name}</span>
          <span className={styles.brandSep} aria-hidden="true" />
          <span className={styles.brandTitle}>{lesson.title}</span>
        </p>
      </header>

      {/* the step's heading is the page's h1 on the classroom screen */}
      <div className={styles.content} key={i}>
        {step && (
          <div className={styles.head}>
            <p className={styles.eyebrowRow}>
              <span className={styles.phaseDot} style={{ background: onDark(step.color) }} aria-hidden="true" />
              <span className={styles.eyebrow}>{step.section}</span>
              <span className={styles.stepCount}>
                Step {i + 1} of {n}
              </span>
            </p>
            <H className={styles.stepTitle}>{step.title}</H>
          </div>
        )}
        {content}
      </div>

      <footer className={styles.foot}>
        {step ? (
          <StepClock step={step} session={session} now={now} minutes={minutes} />
        ) : (
          <div className={styles.footNote}>
            <span className={styles.footBig}>{lesson.totalMinutes}</span>
            <span>minutes</span>
          </div>
        )}
        <div className={styles.footBar}>
          <p className={styles.footElapsed} aria-hidden={mini ? true : undefined}>
            {session.index >= 0 ? (
              <>
                <span className={styles.num}>{clock(elapsed)}</span> of {lesson.totalMinutes}:00
                {!session.running && step && <span className={styles.paused}>Paused</span>}
              </>
            ) : (
              <>Press Start when the class is ready</>
            )}
          </p>
          <TimingBar
            lesson={lesson}
            progress={progress}
            current={step?.phase}
            elapsedMinutes={elapsed / MINUTE}
            valueText={`${clock(elapsed)} of ${lesson.totalMinutes}:00${step ? `, ${step.phase}` : ''}`}
          />
        </div>
        {controls}
      </footer>
    </div>
  );
}

function StepClock({ step, session, now, minutes }: { step: Step; session: Session; now: number; minutes: number[] }) {
  const i = session.index;
  const dur = stepDuration(session, minutes, i);
  const el = stepElapsed(session, i, now);
  const left = dur - el;
  const frac = Math.max(0, Math.min(1, el / dur));
  const R = 44;
  const C = 2 * Math.PI * R;
  return (
    <div className={styles.clock}>
      <svg viewBox="0 0 100 100" className={styles.ring} aria-hidden="true">
        <circle cx="50" cy="50" r={R} className={styles.ringTrack} />
        <circle
          cx="50"
          cy="50"
          r={R}
          className={styles.ringFill}
          style={{ stroke: onDark(step.color), strokeDasharray: C, strokeDashoffset: C * frac }}
        />
      </svg>
      <div className={styles.clockText}>
        <span className={`${styles.clockNum} ${styles.num}`}>{left < 0 ? `+${clock(-left)}` : clock(left)}</span>
        <span className={styles.clockLabel}>{left < 0 ? 'over' : 'left'}</span>
      </div>
    </div>
  );
}

/** What students do in this step, set large: the screen's working line. */
function Task({ items, mini, center }: { items: string[]; mini?: boolean; center?: boolean }) {
  const H = mini ? 'p' : 'h2';
  return (
    <section className={`${styles.task} ${center ? styles.taskCenter : ''}`}>
      <H className={styles.taskKicker}>Your task</H>
      {items.length > 1 ? (
        <ol className={styles.taskList}>
          {items.map((t) => (
            <li key={t}>
              <span>
                <Inline text={t} />
              </span>
            </li>
          ))}
        </ol>
      ) : (
        <p className={styles.taskOne}>
          <Inline text={items[0]} />
        </p>
      )}
    </section>
  );
}

function StepContent({ step, mini }: { step: Step; mini?: boolean }) {
  const s = step.screen;
  const students = step.students ?? [];
  const task = students.length > 0 ? <Task items={students} mini={mini} /> : null;
  switch (s.kind) {
    case 'coins': {
      const H = mini ? 'p' : 'h2';
      return (
        <div className={styles.qWrap}>
          <section className={styles.hookTask}>
            <H className={styles.taskKicker}>Your task</H>
            <ol className={styles.questions}>
              {students.map((q) => (
                <li key={q}>
                  <span>
                    <Inline text={q} />
                  </span>
                </li>
              ))}
            </ol>
          </section>
          <ul className={styles.coinTrio}>
            {s.coins.map((c) => (
              <li key={c.img} className={c.replica ? styles.coinFeature : undefined}>
                <div className={styles.trioSlot}>
                  <div className={styles.trioImg}>
                    <Image src={c.img} alt={mini ? '' : c.alt} fill sizes="20vw" />
                  </div>
                </div>
                <p className={styles.trioName}>{c.name}</p>
                {c.sub && <p className={styles.trioSub}>{c.sub}</p>}
                {c.replica && <span className={styles.trioStamp}>Museum-quality replica</span>}
              </li>
            ))}
          </ul>
        </div>
      );
    }
    case 'review': {
      const deeper = new Set(s.deeper ?? []);
      return (
        <div className={styles.reviewView}>
          <p className={styles.reviewLead}>{s.lead}</p>
          <ol className={styles.reviewList}>
            {students.map((q, k) => (
              <li key={q} className={deeper.has(k) ? styles.reviewDeep : undefined} style={deeper.has(k) ? { ['--deep' as string]: onDark(DEEPER) } : undefined}>
                <span className={styles.reviewText}>
                  <Inline text={q} />
                </span>
                {deeper.has(k) && <span className={styles.deepTag}>Go deeper</span>}
              </li>
            ))}
          </ol>
        </div>
      );
    }
    case 'question': {
      const qs = s.question.split(/(?<=\?)\s+/);
      return (
        <div className={styles.qWrap}>
          <ol className={styles.questions}>
            {qs.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ol>
          <div className={styles.coinRings} aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </div>
      );
    }
    case 'painting':
      return (
        <div className={styles.painting}>
          <figure className={styles.frame}>
            <div className={styles.frameImg}>
              <Image src={s.img.img} alt={mini ? '' : 'Jesus and his questioners over the tribute coin, painted by James Tissot'} fill sizes="40vw" style={{ objectPosition: 'center 30%' }} />
            </div>
            {s.img.credit && <figcaption>{s.img.credit}</figcaption>}
          </figure>
          <blockquote className={styles.verseCard}>
            <p>
              <Inline text={s.verse.text} />
            </p>
            <cite>{s.verse.ref}</cite>
          </blockquote>
          {task}
        </div>
      );
    case 'coin':
      return (
        <div className={styles.coinView}>
          <div className={styles.evidence}>
          <div className={styles.coinPair}>
            <figure>
              <div className={styles.coinImg}>
                <Image src={s.coin.img} alt={mini ? '' : s.alt} fill sizes="30vw" />
              </div>
              <figcaption>Front</figcaption>
            </figure>
            {s.back && (
              <figure>
                <div className={styles.coinImg}>
                  <Image src={s.back} alt={mini ? '' : (s.backAlt ?? '')} fill sizes="30vw" />
                </div>
                <figcaption>Back</figcaption>
              </figure>
            )}
          </div>
          <div className={styles.label}>
            <p className={styles.labelCase}>{s.coin.label}</p>
            <p className={styles.labelTitle}>{s.coin.title}</p>
            {s.coin.replica && <span className={styles.stamp}>Replica</span>}
            <dl className={styles.facts}>
              {s.coin.facts.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            {s.coin.body?.map((p) => (
              <p key={p} className={styles.labelBody}>
                <Inline text={p} />
              </p>
            ))}
          </div>
          </div>
          {task}
        </div>
      );
    case 'verse':
      return (
        <div className={styles.verseView}>
          <div className={styles.verseText}>
            {s.question && <p className={styles.bigQuestion}>{s.question}</p>}
            <blockquote className={`${styles.verseCard} ${styles.verseWide}`}>
              <p>
                <Inline text={s.verse.text} />
              </p>
              <cite>{s.verse.ref}</cite>
            </blockquote>
            {task}
          </div>
          {s.echo && (
            <div className={styles.echo} aria-hidden="true">
              <Image src={s.echo} alt="" fill sizes="25vw" />
            </div>
          )}
        </div>
      );
    case 'levels':
      return (
        <div className={styles.levelsView}>
          {task}
          {!task && s.note && (
            <p className={styles.note}>
              <Inline text={s.note} />
            </p>
          )}
          <ul className={styles.levels}>
            {s.levels.map((l) => (
              <li key={l.key} style={{ ['--lv' as string]: l.color }}>
                <p className={styles.lvName}>{l.name}</p>
                <p className={styles.lvSub}>{l.sub}</p>
                <p className={styles.lvBody}>
                  <Inline text={l.summary} />
                </p>
              </li>
            ))}
          </ul>
        </div>
      );
    case 'prayer':
      return (
        <div className={styles.prayerView}>
          {students.length > 0 && <Task items={students} mini={mini} center />}
          <span className={styles.rule} aria-hidden="true" />
          <p className={styles.prayer}>{s.prayer}</p>
          <span className={styles.rule} aria-hidden="true" />
        </div>
      );
  }
}

function Cover({ lesson, mini, actions }: { lesson: Lesson; mini?: boolean; actions?: ReactNode }) {
  const H = mini ? 'p' : 'h1';
  return (
    <div className={`${styles.cover} ${lesson.objectives ? styles.coverSplit : ''}`}>
      <div className={styles.coverMain}>
        <p className={styles.eyebrow}>Lesson · {lesson.sub}</p>
        <H className={styles.coverTitle}>{lesson.title}</H>
        {lesson.objectives ? (
          lesson.objectives.why && (
            <div className={styles.why}>
              <p className={styles.whyKicker}>Why this matters</p>
              <p className={styles.whyText}>
                <Inline text={lesson.objectives.why} />
              </p>
            </div>
          )
        ) : (
          lesson.objective[0] && (
            <p className={styles.coverLede}>
              <Inline text={lesson.objective[0]} />
            </p>
          )
        )}
        {actions}
      </div>
      {lesson.objectives && <ObjectivesCard objectives={lesson.objectives} mini={mini} />}
      {lesson.hero?.credit && <p className={styles.credit}>{lesson.hero.credit}</p>}
    </div>
  );
}

/** The learning objectives, set on a parchment card like the museum labels. */
function ObjectivesCard({ objectives, mini }: { objectives: Objectives; mini?: boolean }) {
  const H = mini ? 'p' : 'h2';
  return (
    <section className={styles.objectives}>
      <H className={styles.objHeading}>{objectives.heading}</H>
      <ol className={styles.objList}>
        {objectives.items.map((o) => (
          <li key={o.text} className={o.deeper ? styles.objDeep : undefined} style={o.deeper ? { ['--deep' as string]: DEEPER } : undefined}>
            {o.deeper && <span className={styles.deepTag}>Go deeper</span>}
            <span>
              <Inline text={o.text} />
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Finish({ lesson, mini }: { lesson: Lesson; mini?: boolean }) {
  const H = mini ? 'p' : 'h1';
  return (
    <div className={styles.cover}>
      <p className={styles.eyebrow}>Mini Museum connection</p>
      <H className={styles.coverTitle}>{lesson.title}</H>
      {lesson.connection.map((c) => (
        <p key={c} className={styles.coverLede}>
          <Inline text={c} />
        </p>
      ))}
      <p className={styles.url}>minimuseumproject.org/exhibitions/{lesson.exhibition.slug}</p>
    </div>
  );
}
