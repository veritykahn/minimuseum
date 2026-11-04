'use client';

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import { useDialogFocus } from '@/lib/a11y';
import { usePrefersReducedMotion } from '@/lib/a11y/usePrefersReducedMotion';
import SourcesDrawer from '@/components/exhibition/SourcesDrawer';
import HolocaustRoom from '../HolocaustRoom';
import { FILM_FONT_HREF, FilmScreen, useFilm, type FilmState } from './Film';
import { NO_SOUNDS, type WalkPictures, type WalkSounds } from './walkLines';
import { WALK_ABOUT, WALK_BEGIN_LABEL, WALK_INTRO, WALK_MEANING, WalkBackdrop, WalkHall, WalkThreshold, useWalk, walkSourceGroups, type WalkState } from './Walk';
import { walkPool, type Victim } from './victims';
import './walk.css';
import './film.css';

/*
 * The Walk, a room of its own: in the dark, the film's first picture, very
 * dim, behind the room's title and a few words on what is to come, and
 * Begin. Begin opens it full screen: first the film (Film.tsx), the history
 * a line and a picture at a time, ending on its music; then, as it ends or
 * is skipped, a few words on what the walk is, alone in the dark and in
 * silence, until the visitor begins it (WalkThreshold); then the screen
 * opens out into the grey hall, and the walk (Walk.tsx), with the
 * children's names, until it closes quietly and invites the visitor to lay
 * a stone. Both are one full screen, so the browser's full screen, asked
 * for on Begin, lasts through both; Escape, or "Leave the walk", leaves it.
 * It was once a tab of Never Forget (#walk), and an old link to that tab
 * comes here.
 *
 * The room's Sources drawer, and the full screen's own, hold the film's
 * sources line by line, the record of every name the walk has shown, what
 * the walk is inspired by, and the recordings its steps are cut from.
 */

type Phase = 'room' | 'film' | 'threshold' | 'walk';

function FullScreen({ phase, film, walk, pictures, onBegin, onLeave }: { phase: Exclude<Phase, 'room'>; film: FilmState; walk: WalkState; pictures: WalkPictures; onBegin: () => void; onLeave: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const primaryRef = useRef<HTMLButtonElement>(null);
  const { reduced, step, ended } = walk;
  useDialogFocus(ref, true, { onEscape: onLeave, initialFocus: primaryRef });

  // From the film to the walk, and from the close to a walk again: the focus goes on to the new first button.
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    primaryRef.current?.focus({ preventScroll: true });
  }, [phase, ended]);

  // Full screen where the browser allows it (not on a phone that won't); leaving it leaves the walk.
  useEffect(() => {
    const el = ref.current;
    let asked = false;
    try {
      if (el && document.fullscreenEnabled && !document.fullscreenElement && window.matchMedia?.('(min-width: 761px)').matches) {
        asked = true;
        void el.requestFullscreen?.().catch(() => undefined);
      }
    } catch {
      /* no full screen here: the walk still fills the window */
    }
    const onChange = () => {
      if (asked && !document.fullscreenElement) onLeave();
    };
    document.addEventListener('fullscreenchange', onChange);
    return () => {
      document.removeEventListener('fullscreenchange', onChange);
      if (document.fullscreenElement) void document.exitFullscreen?.().catch(() => undefined);
    };
  }, [onLeave]);

  // With reduced motion, the arrow keys move on too: the film a line, the walk a step.
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!reduced || !(e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'PageDown') || e.target instanceof HTMLInputElement) return;
    e.preventDefault();
    if (phase === 'film') film.next();
    else if (phase === 'threshold') onBegin();
    else step();
  };

  const announcement = phase === 'film' ? film.announcement : phase === 'threshold' ? WALK_MEANING.join(' ') : walk.announcement;
  return createPortal(
    <div
      ref={ref}
      className={`hos-walk-full is-${phase}${reduced ? ' is-still' : ''}`}
      data-exhibition="holocaust"
      role="dialog"
      aria-modal="true"
      aria-label={phase === 'film' ? 'The film' : 'The walk'}
      tabIndex={-1}
      onKeyDown={onKey}
    >
      {phase === 'film' ? (
        <FilmScreen film={film} pictures={pictures} reduced={reduced} primaryRef={primaryRef} />
      ) : phase === 'threshold' ? (
        <WalkThreshold primaryRef={primaryRef} onBegin={onBegin} onLeave={onLeave} />
      ) : (
        <WalkHall walk={walk} primaryRef={primaryRef} onLeave={onLeave} opening />
      )}
      {/* Every source, and what the walk is inspired by: the full screen's own drawer, at its top left, clear of the buttons. */}
      <div className="hos-walk-sources">
        <SourcesDrawer groups={walkSourceGroups(walk.shown)} />
      </div>
      <p className="visually-hidden" role="status" aria-live="polite">{announcement}</p>
    </div>,
    document.body,
  );
}

export default function WalkRoom({ pictures = {}, sounds = NO_SOUNDS, music = null, pool }: { pictures?: WalkPictures; sounds?: WalkSounds; music?: string | null; pool?: readonly Victim[] }) {
  const reduced = usePrefersReducedMotion();
  const [phase, setPhase] = useState<Phase>('room');
  const [said, setSaid] = useState('');
  const walk = useWalk(sounds, reduced, pool ?? walkPool());
  const { start: startWalk, prime, leave: leaveWalk } = walk;
  /** The film's end, or its skip: the note on the walk, in silence. */
  const toThreshold = useCallback(() => setPhase('threshold'), []);
  /** The visitor begins the walk. */
  const toWalk = useCallback(() => {
    setPhase('walk');
    startWalk();
  }, [startWalk]);
  const film = useFilm({ music, reduced, onEnd: toThreshold });
  const { start: startFilm, stop: stopFilm } = film;

  /** Begin: the visitor's own press starts the film, and its music, and readies the walk's sound. */
  const begin = () => {
    setPhase('film');
    startFilm();
    prime();
  };
  const leave = useCallback(() => {
    stopFilm();
    leaveWalk();
    setPhase('room');
    setSaid('You leave the walk.');
  }, [stopFilm, leaveWalk]);

  return (
    <HolocaustRoom groups={walkSourceGroups(walk.shown)} fontHref={FILM_FONT_HREF}>
      <main className="hos-stage" data-tab="walk">
        <WalkBackdrop pictures={pictures} />
        <header className="hos-bar">
          {/* REVIEW (Verity): the room's title, as on its card. */}
          <h1 className="hos-title">The Walk</h1>
        </header>
        <section className="hos-panel hos-panel-walk" aria-label="The walk">
          <div className="hos-walk">
            <p className="hos-intro">{WALK_INTRO}</p>
            <p className="hos-walk-about">{WALK_ABOUT}</p>
            <button type="button" className="hos-button hos-button-primary" onClick={begin} aria-expanded={phase !== 'room'}>
              {WALK_BEGIN_LABEL}
            </button>
            <p className="visually-hidden" role="status" aria-live="polite">{phase === 'room' ? said : ''}</p>
          </div>
        </section>
      </main>
      {phase !== 'room' && <FullScreen phase={phase} film={film} walk={walk} pictures={pictures} onBegin={toWalk} onLeave={leave} />}
    </HolocaustRoom>
  );
}
