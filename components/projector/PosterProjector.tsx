'use client';

import Link from 'next/link';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { srOnly } from '@/lib/a11y';
import { focusHeadingIn } from '@/lib/a11y/focus';
import { chapterAt, posterChapters, type Chapter, type PosterTalk } from './posterTalk';
import { posterKeyCommand } from './posterKeys';
import { catalogFor, lessonPath, lessonsForPoster, lessonsPath, type LessonCard } from '@/lib/lessons/catalog';
import { holdProjectorScreen, takeJustExited, writeProjectorParams } from './useProjectorMode';
import type { AudioGuideState } from '@/components/exhibition/AudioGuide';
import styles from './posterProjector.module.css';
import './poster-projector.css';

/*
 * Teacher projector mode for the poster walkthroughs.
 *
 * The page's own walkthrough — its panels, reveals, progress rail, live
 * region and focus handling — is drawn unchanged inside a classroom frame:
 * a top bar with the tools, the poster filling the stage at projector scale
 * (poster-projector.css), a teacher strip with a discussion question per
 * chapter, and key hints. A clicker drives it; nothing ever advances by
 * itself. Off, it renders its children exactly as before.
 */

type Item = { type: string; text?: string };

export type ProjectorPoster<K extends string> = {
  id: K;
  /** The poster's full title. */
  title: string;
  /** The poster image the landing page shows, for the picker. */
  thumb: string;
  items: Item[];
  talk: PosterTalk;
};

type Props<K extends string> = {
  on: boolean;
  onExit: () => void;
  /** "Seeing is Deceiving" */
  exhibition: string;
  /** --pj-* custom properties (see themes.ts). */
  theme: CSSProperties;
  links: { label: string; href: string }[];
  /** "seeing-is-deceiving": lists the exhibition's on-screen lessons, and each poster's own. */
  exhibitionSlug?: string;
  posters: ProjectorPoster<K>[];
  activeView: 'main' | K;
  step: number;
  openPoster: (poster: K, at?: number) => void;
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  returnToMain: () => void;
  /** The poster's audio guide, when it has recordings: its controls join the tool bar. */
  audioGuide?: AudioGuideState;
  /** The page's walkthrough, as it renders outside projector mode. */
  children: ReactNode;
};

type EndContext = {
  posterIndex: number;
  posterCount: number;
  title: string;
  nextTitle: string | null;
  chapters: Chapter[];
  links: { label: string; href: string }[];
  /** the lessons that go with this poster, and where the exhibition's whole list is */
  lessons: LessonCard[];
  lessonCount: number;
  lessonHref: (slug: string) => string;
  allLessonsHref: string;
  continueOn: () => void;
  backToFirst: () => void;
  goToStep: (step: number) => void;
  allPosters: () => void;
  exit: () => void;
};

const ProjectorEndContext = createContext<EndContext | null>(null);

/** After a mouse or touch press, hand focus back so Space means "next". */
function release(e: MouseEvent<HTMLElement>) {
  if (e.detail > 0) e.currentTarget.blur();
}

function wordCount(text: string) {
  const t = text.trim();
  return t ? t.split(/\s+/).length : 0;
}

/* ───────── Fitting text to the stage ───────── */

const LEVELS = ['xs', 's', 'm', 'l', 'xl'] as const;
const FIT = '[class*="paragraph-text"],[class*="quote-text"],[class*="artwork-desc"]';
const BOX = '[class*="text-content-wrapper"],[class*="artwork-display"],[class*="image-text-stacked"]';

function startLevel(words: number) {
  if (words <= 20) return 4;
  if (words <= 45) return 3;
  if (words <= 75) return 2;
  if (words <= 110) return 1;
  return 0;
}

/** Top of an element in layout terms, ignoring transforms (the reveals move things). */
function layoutTop(el: HTMLElement) {
  let y = 0;
  let n: HTMLElement | null = el;
  while (n) {
    y += n.offsetTop;
    n = n.offsetParent as HTMLElement | null;
  }
  return y;
}

/**
 * Sizes each panel's copy by its length, then steps it down while it would
 * spill out of its box. The smallest step is still 33px at 1080p.
 */
export function fitStage(stage: HTMLElement | null) {
  if (!stage) return;
  const texts = Array.from(stage.querySelectorAll<HTMLElement>(FIT));
  if (!texts.length) return;
  const levels: number[] = texts.map((t) => startLevel(wordCount(t.textContent ?? '')));
  const apply = () => texts.forEach((t, i) => t.setAttribute('data-pj-len', LEVELS[levels[i]]));
  const spills = () =>
    texts.some((t) => {
      const box = t.closest<HTMLElement>(BOX);
      if (!box) return false;
      const cs = getComputedStyle(box);
      const top = layoutTop(box) + parseFloat(cs.paddingTop) - 1;
      const bottom = layoutTop(box) + box.clientHeight - parseFloat(cs.paddingBottom) + 1;
      const tTop = layoutTop(t);
      return tTop < top || tTop + t.offsetHeight > bottom;
    });
  apply();
  for (let guard = 0; guard < LEVELS.length && spills(); guard++) {
    let changed = false;
    levels.forEach((l, i) => {
      if (l > 0) {
        levels[i] = l - 1;
        changed = true;
      }
    });
    if (!changed) break;
    apply();
  }
}

/* ───────── The frame ───────── */

export default function PosterProjector<K extends string>(props: Props<K>) {
  const { on, activeView, children } = props;

  // Leaving projector mode with a poster open: focus its panel in the normal view.
  const wasOn = useRef(on);
  useEffect(() => {
    if (wasOn.current && !on && activeView !== 'main') {
      // The Teach button is not on screen, so it must not take focus later.
      takeJustExited();
      focusHeadingIn(document.querySelector<HTMLElement>('[data-poster-stage] [data-focus-target]'));
    }
    wasOn.current = on;
  }, [on, activeView]);

  if (!on) return <>{children}</>;
  return <ProjectorScreen {...props} />;
}

function ProjectorScreen<K extends string>({
  onExit,
  exhibition,
  theme,
  links,
  exhibitionSlug,
  posters,
  activeView,
  step,
  openPoster,
  goToStep,
  nextStep,
  prevStep,
  returnToMain,
  audioGuide,
  children,
}: Props<K>) {
  const [strip, setStrip] = useState(true);
  const [blank, setBlank] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [notice, setNotice] = useState('');
  const stageRef = useRef<HTMLDivElement>(null);
  const pickerHeading = useRef<HTMLHeadingElement>(null);

  const posterIndex = posters.findIndex((p) => p.id === activeView);
  const open = posterIndex >= 0;
  const poster = open ? posters[posterIndex] : null;
  const count = poster?.items.length ?? 0;
  const chapters = useMemo(() => (poster ? posterChapters(poster.items, poster.title) : []), [poster]);
  const chapter = open ? chapterAt(chapters, step) : null;
  const allLessons = exhibitionSlug ? catalogFor(exhibitionSlug) : [];
  const question = chapter ? poster?.talk[chapter.key] : undefined;
  const atEnd = open && poster?.items[step]?.type === 'end';

  useEffect(() => holdProjectorScreen(), []);

  // The page underneath never scrolls while the projector is up.
  useEffect(() => {
    const html = document.documentElement;
    const before = html.style.overflow;
    html.style.overflow = 'hidden';
    return () => {
      html.style.overflow = before;
    };
  }, []);

  useEffect(() => {
    const onChange = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  // Said once the live region is in the page, so it is actually read.
  useEffect(() => {
    const t = window.setTimeout(
      () =>
        setNotice(
          'Projector mode. The arrow keys, Space or a clicker move between panels. B blanks the screen, T shows or hides the teacher strip, F is full screen.',
        ),
      400,
    );
    return () => window.clearTimeout(t);
  }, []);

  // The address follows the class, so a refresh or a bookmark comes back here.
  // (The picker shows for a moment while a ?poster= link opens; that moment is not written.)
  const linkPending = useRef(true);
  useEffect(() => {
    if (open) linkPending.current = false;
    else if (linkPending.current && new URLSearchParams(window.location.search).has('poster')) return;
    writeProjectorParams(true, open ? { poster: posterIndex, panel: step } : null);
  }, [open, posterIndex, step]);

  // On the picker, focus its heading so the next Tab starts there.
  useEffect(() => {
    if (!open) pickerHeading.current?.focus({ preventScroll: true });
  }, [open]);

  // Each panel's copy is sized for the room, then checked against the stage.
  useLayoutEffect(() => {
    fitStage(stageRef.current);
  });
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let raf = 0;
    const refit = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => fitStage(stageRef.current));
    };
    const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(refit);
    ro?.observe(stage);
    void document.fonts?.ready.then(refit);
    return () => {
      cancelAnimationFrame(raf);
      ro?.disconnect();
    };
  }, [open]);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
    else void document.documentElement.requestFullscreen?.().catch(() => {});
  }, []);

  const exit = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
    onExit();
  }, [onExit]);

  const latestGuide = useRef(audioGuide);
  useLayoutEffect(() => {
    latestGuide.current = audioGuide;
  });

  const setBlankAndSay = useCallback((next: boolean) => {
    // A blanked screen is a pause for the class: the guide stops talking too.
    if (next) latestGuide.current?.pause();
    setBlank(next);
    setNotice(next ? 'Screen blanked. Press B to show it again.' : 'Screen shown.');
  }, []);

  const toggleStrip = useCallback(() => {
    setStrip((v) => {
      setNotice(v ? 'Teacher strip hidden.' : 'Teacher strip shown.');
      return !v;
    });
  }, []);

  const toggleGuide = useCallback(() => {
    const g = latestGuide.current;
    if (!g) return;
    if (g.on) g.turnOff();
    else g.turnOn();
    setNotice(g.on ? 'Audio guide off.' : 'Audio guide on.');
  }, []);

  const playPause = useCallback(() => {
    const g = latestGuide.current;
    if (!g?.on || !g.available) return;
    g.toggle();
  }, []);

  const continueOn = useCallback(() => {
    const next = posters[posterIndex + 1];
    if (next) openPoster(next.id);
  }, [openPoster, posterIndex, posters]);

  const backToFirst = useCallback(() => openPoster(posters[0].id), [openPoster, posters]);

  // Keys: captured on the window before the walkthrough's own handler, so a
  // clicker's → never also moves the page underneath, and Escape never closes it.
  const latest = useRef({ open, atEnd, blank, step, count, posterIndex });
  useLayoutEffect(() => {
    latest.current = { open, atEnd, blank, step, count, posterIndex };
  });
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const s = latest.current;
      const t = e.target as HTMLElement | null;
      const tag = t?.tagName;
      const cmd = posterKeyCommand(
        e.key,
        {
          open: s.open,
          blank: s.blank,
          onControl: tag === 'BUTTON' || tag === 'A' || tag === 'SUMMARY',
          inField: tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || Boolean(t?.isContentEditable),
        },
        { alt: e.altKey, ctrl: e.ctrlKey, meta: e.metaKey },
      );
      if (!cmd) return;
      e.preventDefault();
      e.stopPropagation();
      switch (cmd.type) {
        case 'next':
          if (!s.open) openPoster(posters[0].id);
          else if (s.atEnd) {
            const nextPoster = posters[s.posterIndex + 1];
            if (nextPoster) openPoster(nextPoster.id);
          } else nextStep();
          break;
        case 'prev':
          if (s.open) prevStep();
          break;
        case 'first':
          goToStep(0);
          break;
        case 'last':
          goToStep(s.count - 1);
          break;
        case 'blank':
          setBlankAndSay(true);
          break;
        case 'unblank':
          setBlankAndSay(false);
          break;
        case 'strip':
          toggleStrip();
          break;
        case 'fullscreen':
          toggleFullscreen();
          break;
        case 'audio':
          toggleGuide();
          break;
        case 'play':
          playPause();
          break;
        case 'swallow':
          break;
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [goToStep, nextStep, openPoster, playPause, posters, prevStep, setBlankAndSay, toggleFullscreen, toggleGuide, toggleStrip]);

  const endContext: EndContext | null = poster
    ? {
        posterIndex,
        posterCount: posters.length,
        title: poster.title,
        nextTitle: posters[posterIndex + 1]?.title ?? null,
        chapters,
        links,
        lessons: exhibitionSlug && poster ? lessonsForPoster(exhibitionSlug, poster.id) : [],
        lessonCount: allLessons.length,
        lessonHref: (slug) => lessonPath(exhibitionSlug ?? '', slug),
        allLessonsHref: lessonsPath(exhibitionSlug ?? ''),
        continueOn,
        backToFirst,
        goToStep,
        allPosters: returnToMain,
        exit,
      }
    : null;

  const tools = (
    <nav className={styles.tools} aria-label="Projector tools">
      <button
        type="button"
        className={styles.tool}
        aria-pressed={strip}
        aria-keyshortcuts="T"
        disabled={!open}
        onClick={(e) => {
          release(e);
          toggleStrip();
        }}
      >
        Teacher strip <kbd>T</kbd>
      </button>
      {audioGuide && open && (
        <>
          <button
            type="button"
            className={styles.tool}
            aria-pressed={audioGuide.on}
            aria-keyshortcuts="A"
            onClick={(e) => {
              release(e);
              toggleGuide();
            }}
          >
            Audio guide <kbd>A</kbd>
          </button>
          {audioGuide.on && (
            <button
              type="button"
              className={styles.tool}
              aria-keyshortcuts="P"
              disabled={!audioGuide.available}
              onClick={(e) => {
                release(e);
                playPause();
              }}
            >
              {audioGuide.playing ? 'Pause' : 'Play'} <kbd>P</kbd>
            </button>
          )}
        </>
      )}
      <button
        type="button"
        className={styles.tool}
        aria-keyshortcuts="B"
        onClick={(e) => {
          release(e);
          setBlankAndSay(true);
        }}
      >
        Blank <kbd>B</kbd>
      </button>
      <button
        type="button"
        className={styles.tool}
        aria-pressed={fullscreen}
        aria-keyshortcuts="F"
        onClick={(e) => {
          release(e);
          toggleFullscreen();
        }}
      >
        {fullscreen ? 'Exit full screen' : 'Full screen'} <kbd>F</kbd>
      </button>
      <button type="button" className={`${styles.tool} ${styles.toolExit}`} onClick={exit}>
        Exit projector
      </button>
    </nav>
  );

  const keys = (
    <p className={styles.keys}>
      <span>
        <kbd>→</kbd> or <kbd>Space</kbd> next
      </span>
      <span>
        <kbd>←</kbd> back
      </span>
      {open && (
        <span>
          <kbd>Home</kbd>/<kbd>End</kbd> first/last
        </span>
      )}
      <span>
        <kbd>B</kbd> blank
      </span>
      {open && (
        <span>
          <kbd>T</kbd> strip
        </span>
      )}
      <span>
        <kbd>F</kbd> full screen
      </span>
      {open && audioGuide && (
        <span>
          <kbd>A</kbd> audio guide
        </span>
      )}
    </p>
  );

  return (
    <div className={styles.root} style={theme} data-projector="">
      <div className={styles.frame} data-view={open ? 'poster' : 'picker'}>
        <header className={styles.bar}>
          <p className={styles.barTitle}>
            {exhibition}
            <span className={styles.barCount}>{open ? `Poster ${posterIndex + 1} of ${posters.length}` : 'Posters'}</span>
          </p>
          {tools}
        </header>

        {open ? (
          <ProjectorEndContext.Provider value={endContext}>
            <div className={`${styles.stage} pjp-stage`} ref={stageRef}>
              {children}
            </div>
          </ProjectorEndContext.Provider>
        ) : (
          <div className={styles.picker}>
            <p className={styles.eyebrow}>Teach with the posters</p>
            <h1 className={styles.pickerTitle} ref={pickerHeading} tabIndex={-1}>
              {exhibition}
            </h1>
            <ul className={styles.pickerList}>
              {posters.map((p, i) => (
                <li key={p.id}>
                  <button type="button" className={styles.pickerCard} data-poster={p.id} onClick={() => openPoster(p.id)}>
                    {/* eslint-disable-next-line @next/next/no-img-element -- the same poster image the landing page shows */}
                    <img src={p.thumb} alt="" className={styles.pickerImg} />
                    <span className={styles.pickerLabel}>
                      Poster {i + 1} · {p.items.length} panels
                    </span>
                    <span className={styles.pickerName}>{p.title}</span>
                  </button>
                </li>
              ))}
            </ul>
            {allLessons.length > 0 && exhibitionSlug && (
              <div className={styles.pickerLinks}>
                <h2 className={styles.smallHeading}>Or teach a whole lesson</h2>
                <ul>
                  {allLessons.map((l) => (
                    <li key={l.slug}>
                      <Link href={lessonPath(exhibitionSlug, l.slug)} className={styles.link}>
                        {l.title} <span className={styles.lessonSub}>{l.grade}</span> <span aria-hidden="true">→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {links.length > 0 && (
              <div className={styles.pickerLinks}>
                <h2 className={styles.smallHeading}>For the classroom</h2>
                <ul>
                  {links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className={styles.link}>
                        {l.label} <span aria-hidden="true">→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <footer className={styles.foot}>
          {open && strip && !atEnd && (
            <section className={styles.strip} aria-label="Teacher strip">
              <p className={styles.where}>
                <span className={styles.panelOf}>
                  Panel {step + 1} of {count}
                </span>
                {chapter && <span className={styles.chapterName}>{chapter.name}</span>}
              </p>
              {question && (
                <p className={styles.talk}>
                  <span className={styles.talkLabel}>Talk about it</span> {question}
                </p>
              )}
            </section>
          )}
          {keys}
        </footer>
      </div>

      {blank && (
        <div className={styles.blank} onClick={() => setBlankAndSay(false)}>
          <p className={styles.blankHint}>
            Screen blanked. Press <kbd>B</kbd> to show it again.
          </p>
        </div>
      )}

      <div style={srOnly} role="status" aria-live="polite" aria-atomic="true">
        {notice}
      </div>
    </div>
  );
}

/* ───────── The end of a poster ───────── */

/**
 * Drawn by the page in place of its "Return to Exhibition" panel while the
 * projector is up: where to go next, a way back into any chapter, and the
 * exhibition's classroom links.
 */
export function PosterProjectorEnd() {
  const ctx = useContext(ProjectorEndContext);
  if (!ctx) return null;
  const last = ctx.posterIndex + 1 >= ctx.posterCount;
  return (
    <div className={styles.end}>
      <div className={styles.endCol}>
        <p className={styles.eyebrow}>
          End of poster {ctx.posterIndex + 1} of {ctx.posterCount}
        </p>
        <h2 className={styles.endTitle}>{ctx.title}</h2>
        <div className={styles.endActions}>
          {!last ? (
            <button
              type="button"
              className={`${styles.action} ${styles.actionPrimary}`}
              aria-keyshortcuts="ArrowRight"
              onClick={(e) => {
                release(e);
                ctx.continueOn();
              }}
            >
              Continue to poster {ctx.posterIndex + 2} <span aria-hidden="true">→</span>
            </button>
          ) : (
            <button
              type="button"
              className={`${styles.action} ${styles.actionPrimary}`}
              onClick={(e) => {
                release(e);
                ctx.backToFirst();
              }}
            >
              Back to poster 1
            </button>
          )}
          <button
            type="button"
            className={styles.action}
            onClick={(e) => {
              release(e);
              ctx.allPosters();
            }}
          >
            All posters
          </button>
          <button type="button" className={styles.action} onClick={ctx.exit}>
            Exit projector
          </button>
        </div>
        {!last && ctx.nextTitle && <p className={styles.nextName}>Next: {ctx.nextTitle}</p>}
      </div>
      <div className={styles.endCol}>
        {ctx.lessonCount > 0 && (
          <div className={styles.endLinks}>
            <h3 className={styles.smallHeading}>{ctx.lessons.length > 0 ? 'Teach a lesson with this poster' : 'Teach a lesson'}</h3>
            <ul className={styles.lessonList}>
              {ctx.lessons.map((l) => (
                <li key={l.slug}>
                  <Link href={ctx.lessonHref(l.slug)} className={`${styles.link} ${styles.lessonLink}`}>
                    <span>
                      {l.title} <span aria-hidden="true">→</span>
                    </span>
                    <span className={styles.lessonSub}>{l.grade}</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link href={ctx.allLessonsHref} className={styles.link}>
                  {ctx.lessons.length > 0 ? `All ${ctx.lessonCount} lessons` : `${ctx.lessonCount} lessons for this exhibition`} <span aria-hidden="true">→</span>
                </Link>
              </li>
            </ul>
          </div>
        )}
        {ctx.chapters.length > 0 && (
          <div>
            <h3 className={styles.smallHeading}>Look back at a chapter</h3>
            <ul className={styles.chips}>
              {ctx.chapters.map((c) => (
                <li key={c.start}>
                  <button
                    type="button"
                    className={styles.chip}
                    onClick={(e) => {
                      release(e);
                      ctx.goToStep(c.start);
                    }}
                  >
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        {ctx.links.length > 0 && (
          <div className={styles.endLinks}>
            <h3 className={styles.smallHeading}>For the classroom</h3>
            <ul>
              {ctx.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={styles.link}>
                    {l.label} <span aria-hidden="true">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
