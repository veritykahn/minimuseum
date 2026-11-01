import Image from 'next/image';
import type { ReactNode } from 'react';
import type { GalleryGroup, Lesson, NumberLine, Objectives, PairItem, Person, Step, WorkedExample } from '@/lib/lessons/types';
import {
  type Session,
  clock,
  plannedProgress,
  stepDuration,
  stepElapsed,
  totalElapsed,
  MINUTE,
} from '@/lib/lessons/session';
import type { SourceEntry, SourceGroup } from '@/components/exhibition/SourcesDrawer';
import { ChartScroll } from './ChartScroll';
import { Inline, plain } from './Inline';
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
 * presenter view. Picture and recording credits are not set on the frame:
 * they are behind the classroom's "i" (lessonSourceGroups).
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

  // a number line with a worked example lays out in three rows
  const variant = step?.screen.kind === 'numberline' && step.screen.worked ? 'worked' : undefined;
  // the youngest classes set more than three coins in a row under the task,
  // and fewer than three large, to count; older lessons scale a row by --n
  const coins = step?.screen.kind === 'coins' ? step.screen.coins.length : 3;
  const coinLayout = !lesson.large ? undefined : coins > 3 ? 'many' : coins < 3 ? 'few' : undefined;
  const bg = step?.screen.kind === 'painting' ? step.screen.img.img : !step && !finished ? lesson.hero?.img : undefined;

  return (
    <div
      className={`${styles.stage} ${mini ? styles.stageMini : ''}`}
      data-kind={step?.screen.kind ?? (finished ? 'finish' : 'cover')}
      data-variant={variant}
      data-large={lesson.large ? '' : undefined}
      data-many={coinLayout === 'many' ? '' : undefined}
      data-few={coinLayout === 'few' ? '' : undefined}
    >
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
            {students.length === 1 ? (
              <p className={styles.questionOne}>
                <Inline text={students[0]} />
              </p>
            ) : (
              <ol className={styles.questions}>
                {students.map((q) => (
                  <li key={q}>
                    <span>
                      <Inline text={q} />
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </section>
          <ul className={styles.coinTrio} style={{ ['--n' as string]: s.coins.length }}>
            {s.coins.map((c) => (
              <li key={c.img} className={(c.feature ?? c.replica) ? styles.coinFeature : undefined}>
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
          {s.hint && (
            <p className={styles.reviewHint}>
              <Inline text={s.hint} />
            </p>
          )}
        </div>
      );
    }
    case 'pair':
      return (
        <div className={styles.pairView}>
          <ul className={styles.pair}>
            {s.items.map((it) => (
              <PairFigure key={it.img} item={it} mini={mini} />
            ))}
          </ul>
          {task}
          {s.note && (
            <blockquote className={`${styles.verseCard} ${styles.pairNote}`}>
              <p>
                <Inline text={s.note.text} />
              </p>
              <cite>{s.note.ref}</cite>
            </blockquote>
          )}
        </div>
      );
    case 'people':
      return (
        <div className={styles.peopleView}>
          <ul className={styles.people} style={{ ['--n' as string]: s.people.length }}>
            {s.people.map((p, k) => (
              <li key={p.img}>
                <PersonFrame person={p} mini={mini} letter={s.letters ? String.fromCharCode(65 + k) : undefined} />
                {(p.label || p.name) && (
                  <div className={styles.personCap}>
                    {p.label && <p className={styles.personPlace}>{p.label}</p>}
                    {p.name && <p className={styles.personName}>{p.name}</p>}
                  </div>
                )}
              </li>
            ))}
          </ul>
          {task}
        </div>
      );
    case 'person':
      return (
        <div className={styles.personView}>
          <div className={styles.personBig}>
            <PersonFrame person={s.person} mini={mini} />
          </div>
          <div className={styles.storyCard}>
            {(s.person.label || s.ref) && (
              <p className={styles.labelCase}>{[s.person.label, s.ref].filter(Boolean).join(' · ')}</p>
            )}
            <p className={styles.storyCoin}>
              {s.coinName}
              {s.replica && <span className={styles.storyStamp}>Replica</span>}
            </p>
            <p className={styles.storyText}>
              <Inline text={s.story} />
            </p>
          </div>
          {task}
        </div>
      );
    case 'image':
      return (
        <div className={styles.imageView}>
          <figure className={styles.imageFigure}>
            <div className={`${styles.imageFrame} ${s.fit === 'cover' ? styles.pairCover : ''}`}>
              <div className={styles.imageImg}>
                <Image
                  src={s.img.img}
                  alt={mini ? '' : s.alt}
                  fill
                  sizes="60vw"
                  style={{ objectFit: s.fit ?? 'contain', objectPosition: s.img.pos ?? 'center' }}
                />
              </div>
            </div>
            {s.caption && (
              <figcaption>
                <span className={styles.imageCaption}>
                  <Inline text={s.caption} />
                </span>
              </figcaption>
            )}
          </figure>
          {task}
        </div>
      );
    case 'question': {
      const qs = s.question.split(/(?<=\?)\s+/);
      return (
        <div className={styles.qWrap}>
          <div className={styles.qMain}>
            <ol className={`${styles.questions} ${qs.length === 1 ? styles.questionsOne : ''}`}>
              {qs.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ol>
            {task}
          </div>
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
              <Image
                src={s.img.img}
                alt={mini ? '' : (s.alt ?? 'Jesus and his questioners over the tribute coin, painted by James Tissot')}
                fill
                sizes="40vw"
                style={{ objectPosition: s.pos ?? 'center 30%' }}
              />
            </div>
          </figure>
          <blockquote className={`${styles.verseCard} ${s.verse.text.length > 360 ? styles.verseLong : ''}`}>
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
    case 'chart':
      return (
        <div className={styles.wideView}>
          {task}
          <ChartScroll label={s.caption} mini={mini}>
            <table className={styles.chart}>
              <caption className={styles.srOnly}>{s.caption}</caption>
              <thead>
                <tr>
                  <td className={styles.chartThumb} />
                  {s.columns.map((c) => (
                    <th key={c} scope="col">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {s.rows.map((r) => (
                  <tr key={r.cells[0]}>
                    <td className={styles.chartThumb}>
                      {r.img && (
                        <span className={styles.chartImg}>
                          <Image src={r.img} alt="" fill sizes="5vw" />
                        </span>
                      )}
                    </td>
                    {r.cells.map((c, k) =>
                      k === 0 ? (
                        <th key={k} scope="row">
                          <Inline text={c} />
                          {r.replica && <span className={styles.chartStamp}>Replica</span>}
                        </th>
                      ) : (
                        <td key={k}>
                          <Inline text={c} />
                        </td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </ChartScroll>
        </div>
      );
    case 'gallery':
      return (
        <div className={styles.wideView}>
          {task}
          <Gallery groups={s.groups} mini={mini} />
        </div>
      );
    case 'numberline':
      // with a worked example: the rule beside the heading, the line across,
      // then the example and the task side by side
      return (
        <div className={styles.wideView}>
          {task}
          <Line line={s.line} mini={mini} />
          {s.rule && (
            <p className={styles.lineRule}>
              <span className={styles.ruleKicker}>The rule</span>
              {/* a line break in the rule starts a new line on screen */}
              {s.rule.split('\n').map((line) => (
                <span key={line} className={styles.ruleText}>
                  <Inline text={line} />
                </span>
              ))}
            </p>
          )}
          {s.worked && (
            <div className={styles.lineWorked}>
              <Worked ex={s.worked} mini={mini} />
            </div>
          )}
        </div>
      );
    case 'worked':
      return (
        <div className={styles.wideView}>
          {task}
          <div className={styles.workedRow} style={{ ['--n' as string]: s.examples.length }}>
            {s.examples.map((ex) => (
              <Worked key={ex.title} ex={ex} mini={mini} />
            ))}
          </div>
        </div>
      );
    case 'words': {
      const lines = s.text.split('\n');
      return (
        <div className={styles.wordsView}>
          <blockquote className={`${styles.words} ${s.text.length > 220 ? styles.wordsLong : ''}`}>
            <p>
              {lines.map((line) => (
                <span key={line} className={styles.wordsLine}>
                  <Inline text={line} />
                </span>
              ))}
            </p>
            {s.cite && <cite>{s.cite}</cite>}
          </blockquote>
          {task}
        </div>
      );
    }
    case 'artwork':
      return (
        <div className={`${styles.artworkView} ${s.img ? '' : styles.artworkNamed}`}>
          {s.img && (
            <figure className={styles.frame}>
              <div className={styles.frameImg}>
                <Image src={s.img.img} alt={mini ? '' : (s.alt ?? plain(s.work))} fill sizes="40vw" style={{ objectPosition: s.img.pos ?? 'center' }} />
              </div>
            </figure>
          )}
          <div className={styles.artworkLabel}>
            {(s.artist || s.date) && <p className={styles.labelCase}>{[s.artist, s.date].filter(Boolean).join(' · ')}</p>}
            <p className={styles.labelTitle}>
              <Inline text={s.work} />
            </p>
            {s.links && s.links.length > 0 && (
              <div className={styles.artworkLinks}>
                <p className={styles.artworkKicker}>Show it from the museum’s page</p>
                <ul>
                  {s.links.map((l) => (
                    <li key={l.href}>
                      {mini ? (
                        <span>{l.label}</span>
                      ) : (
                        <a href={l.href} target="_blank" rel="noopener">
                          {l.label}
                          <span className={styles.srOnly}> (opens in a new tab)</span>
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          {task}
        </div>
      );
    case 'listen':
      return (
        <div className={styles.listenView}>
          {s.question && <p className={styles.bigQuestion}>{s.question}</p>}
          <ul className={styles.clips} style={{ ['--n' as string]: s.clips.length }}>
            {s.clips.map((c) => (
              <li key={c.src} className={styles.clip}>
                <p className={styles.clipLabel}>
                  <Inline text={c.label} />
                </p>
                {c.sub && <p className={styles.clipSub}>{c.sub}</p>}
                {/* the presenter's thumbnail shows the clips, the classroom plays them */}
                {!mini && <audio controls preload="none" src={c.src} className={styles.clipPlayer} aria-label={plain(c.label)} />}
              </li>
            ))}
          </ul>
          {task}
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

/** Labelled pictures in groups, side by side. */
function Gallery({ groups, mini }: { groups: GalleryGroup[]; mini?: boolean }) {
  const H = mini ? 'p' : 'h2';
  const count = groups.reduce((a, g) => a + g.items.length, 0);
  // fewer pictures, larger pictures
  const size = count <= 2 ? 'galleryLarge' : count <= 4 ? 'galleryMid' : 'gallerySmall';
  return (
    <div className={`${styles.gallery} ${styles[size]}`} style={{ ['--n' as string]: groups.length }}>
      {groups.map((g) => (
        <section key={g.label} className={styles.galleryGroup}>
          <H className={styles.galleryLabel}>
            <Inline text={g.label} />
          </H>
          {g.text && (
            <p className={styles.galleryText}>
              <Inline text={g.text} />
            </p>
          )}
          <ul className={styles.galleryItems}>
            {g.items.map((it) => (
              <li key={it.img + it.caption}>
                <div className={styles.gallerySlot}>
                  <div className={styles.galleryImg} style={it.aspect ? { aspectRatio: String(it.aspect), ['--w' as string]: it.aspect } : undefined}>
                    <Image src={it.img} alt={mini ? '' : it.alt} fill sizes="25vw" />
                  </div>
                </div>
                <p className={styles.galleryCap}>
                  <Inline text={it.caption} />
                </p>
                {it.sub && (
                  <p className={styles.gallerySub}>
                    <Inline text={it.sub} />
                  </p>
                )}
                {it.replica && <span className={styles.trioStamp}>Replica</span>}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

/** A number line drawn in HTML; read out as one picture. */
function Line({ line, mini }: { line: NumberLine; mini?: boolean }) {
  return (
    <figure className={styles.nline} role={mini ? undefined : 'img'} aria-label={mini ? undefined : line.alt}>
      <div className={styles.nAxis} aria-hidden="true" />
      {line.hops?.map(([a, b], k) => (
        <div key={`${a}-${b}`} className={styles.nHop} style={{ left: `${a}%`, width: `${b - a}%` }} aria-hidden="true">
          <span>{k + 1}</span>
        </div>
      ))}
      {line.ticks.map((t) => (
        <div key={t.at} className={`${styles.nTick} ${t.edge ? styles.nEdge : ''}`} style={{ left: `${t.at}%` }} aria-hidden="true">
          <span>{t.label}</span>
        </div>
      ))}
      {line.notes?.map((n) => (
        <div key={n.at} className={styles.nNote} style={{ left: `${n.at}%` }} aria-hidden="true">
          {n.text}
        </div>
      ))}
    </figure>
  );
}

/** A worked example on a parchment card, its steps numbered. */
function Worked({ ex, mini }: { ex: WorkedExample; mini?: boolean }) {
  const H = mini ? 'p' : 'h2';
  return (
    <section className={styles.worked}>
      <div className={styles.workedHead}>
        {ex.img && (
          <span className={styles.workedImg}>
            <Image src={ex.img} alt={mini ? '' : (ex.alt ?? '')} fill sizes="8vw" />
          </span>
        )}
        <div>
          <p className={styles.labelCase}>Worked example</p>
          <H className={styles.workedTitle}>
            <Inline text={ex.title} />
          </H>
          {ex.replica && <span className={styles.workedStamp}>Replica</span>}
        </div>
      </div>
      <ol className={styles.workedSteps}>
        {ex.steps.map((t) => (
          <li key={t}>
            <span>
              <Inline text={t} />
            </span>
          </li>
        ))}
      </ol>
      {ex.answer && (
        <p className={styles.workedAnswer}>
          <Inline text={ex.answer} />
        </p>
      )}
    </section>
  );
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
    </div>
  );
}

/**
 * A lesson's picture and recording credits, for its Sources and credits
 * drawer: the cover's picture, then each step's, by step.
 */
export function lessonSourceGroups(lesson: Lesson): SourceGroup[] {
  const groups: SourceGroup[] = [];
  if (lesson.hero?.credit) groups.push({ title: 'The cover', items: [{ note: 'Picture', label: lesson.hero.credit }] });
  lesson.steps.forEach((step, k) => {
    const s = step.screen;
    const items: SourceEntry[] = [];
    if ((s.kind === 'painting' || s.kind === 'image' || s.kind === 'artwork') && s.img?.credit) items.push({ note: 'Picture', label: s.img.credit });
    if (s.kind === 'listen') for (const c of s.clips) if (c.credit) items.push({ note: plain(c.label), label: c.credit });
    if (items.length) groups.push({ title: `Step ${k + 1}: ${step.title}`, items });
  });
  return groups;
}

/** The learning objectives, set on a parchment card like the museum labels. */
function ObjectivesCard({ objectives, mini }: { objectives: Objectives; mini?: boolean }) {
  const H = mini ? 'p' : 'h2';
  return (
    <section className={styles.objectives}>
      <H className={styles.objHeading}>{objectives.screenHeading ?? objectives.heading}</H>
      <ol className={styles.objList}>
        {objectives.items.map((o) => (
          <li key={o.text} className={o.deeper ? styles.objDeep : undefined} style={o.deeper ? { ['--deep' as string]: DEEPER } : undefined}>
            {o.deeper && <span className={styles.deepTag}>Go deeper</span>}
            <span>
              <Inline text={o.screen ?? o.text} />
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

/** One of two pictures to compare, with the big label students point to. */
function PairFigure({ item, mini }: { item: PairItem; mini?: boolean }) {
  const cover = item.fit === 'cover';
  return (
    <li className={styles.pairItem}>
      <div className={`${styles.pairFrame} ${cover ? styles.pairCover : ''}`}>
        <div className={styles.pairImg}>
          <Image
            src={item.img}
            alt={mini ? '' : item.alt}
            fill
            sizes="40vw"
            style={{ objectFit: cover ? 'cover' : 'contain', objectPosition: item.pos ?? 'center' }}
          />
        </div>
        {item.stamp && (
          <span className={`${styles.pairStamp} ${item.stampTone === 'red' ? styles.pairStampRed : ''}`}>{item.stamp}</span>
        )}
      </div>
      <p className={styles.pairLabel}>{item.label}</p>
      {item.caption && <p className={styles.pairCaption}>{item.caption}</p>}
    </li>
  );
}

/** A person shown by their hands, the coin they held set over the corner. */
function PersonFrame({ person, mini, letter }: { person: Person; mini?: boolean; letter?: string }) {
  return (
    <div className={styles.personFrame}>
      <div className={styles.personImg}>
        <Image src={person.img} alt={mini ? '' : person.alt} fill sizes="25vw" style={{ objectPosition: person.pos ?? 'center' }} />
      </div>
      {letter && (
        <span className={styles.personLetter} aria-hidden={mini ? true : undefined}>
          {letter}
        </span>
      )}
      {person.coin && (
        <div className={styles.personCoin}>
          <Image src={person.coin} alt={mini ? '' : (person.coinAlt ?? '')} fill sizes="10vw" />
        </div>
      )}
    </div>
  );
}
