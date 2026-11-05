'use client';

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import Link from 'next/link';
import type { SourceGroup } from '@/components/exhibition/SourcesDrawer';
import { ROOM_PATHS } from '../roomPaths';
import { filmSourceGroups } from './filmText';
import { makeFootsteps, type Footsteps } from './footsteps';
import { makeMetal } from './metal';
import { NO_SOUNDS, WALK_LINES, slotSrc, type WalkPictures, type WalkSounds } from './walkLines';
import { STEP, drawFloor, easeStep, makeView, type View } from './walkScene';
import { drawWalkNames, loadShown, saveShown, victimDeath, victimText, walkPool, type Victim } from './victims';

/*
 * The walk: an original piece, inspired by Menashe Kadishman's Fallen Leaves
 * (Shalekhet) at the Jewish Museum Berlin, where visitors walk over iron
 * faces that cover the floor and hear them as they go, and by the iron
 * Shoes on the Danube Bank in Budapest. After the film (Film.tsx), the
 * visitor walks out of the dark into a high hall, strangely grey and
 * light, as the Memory Void where Fallen Leaves lies is: bare concrete
 * walls, a pale daylight from far above, and the floor covered with
 * cast-iron faces and empty iron shoes (walkScene.ts, drawn here, nothing
 * of theirs); and, as the walk nears its end, back into the dark
 * (darkness).
 *
 * The visitor walks on over the iron, and one at a time, ahead of them, a
 * child's name comes toward them and passes: their age, and the year they
 * died and where, as far as their record gives them (victims.ts). A name
 * every two or three footfalls, never two crowding: each new name comes
 * only as the last is passing. Each walk draws a fresh set of names,
 * avoiding those already shown in this browser. The walk lasts as long as
 * the walk over the faces in the Memory Void takes (WALK_MS, about a
 * minute and a quarter), then closes quietly, in the dark, and invites the
 * visitor to lay a stone.
 *
 * It walks on by itself, at a slow, uneven pace, until the visitor pauses
 * it: a footfall every second and a half or so, and now and then a longer
 * pause. Each footfall is heard, and nothing else: a clank of metal, with a
 * long rattle over about one in three (metal.ts, from the owner's
 * recordings; footsteps.ts makes a step in the browser until they are in
 * place). The sound is readied by the visitor's own press (Begin), starts
 * with the walk, and a button turns it off; turned off, it stays off when
 * they come back to the walk. With reduced motion nothing moves: the floor
 * is still, and the walk moves only a step at a time, by button (a name and
 * a clank each).
 *
 * Every name's record is in the walk's Sources drawer, as it is shown,
 * with the film's sources, the two works the walk is inspired by, and the
 * recordings its steps are cut from; never on the screen.
 */

/** A footfall: forward over the iron. */
export const MOVE_MS = 1000;
/** The walk's length: as long as the walk over the faces in the Memory Void takes, about a minute and a quarter (Verity's own walk: 1 min 15–30 s). */
export const WALK_MS = 75_000;
/** Walking on: the gap between footfalls, uneven, as a person walks; and now and then a longer one, a hesitation. */
export const GAP_MS: readonly [number, number] = [1150, 1750];
export const HESITATE_MS: readonly [number, number] = [2400, 3400];
export const HESITATE_CHANCE = 1 / 7;
/** The gap between footfalls, on average. */
export const MEAN_GAP_MS = (1 - HESITATE_CHANCE) * ((GAP_MS[0] + GAP_MS[1]) / 2) + HESITATE_CHANCE * ((HESITATE_MS[0] + HESITATE_MS[1]) / 2);
/** About how many footfalls the walk takes. */
export const WALK_FOOTFALLS = Math.round(WALK_MS / MEAN_GAP_MS);
/** A name comes toward the visitor over two or three footfalls, then passes. */
export const NAME_FEET: readonly [number, number] = [2, 3];
/** The first name comes on this footfall. */
export const FIRST_NAME_AT = 2;
/** As many names as a walk has room for, a name every two or three footfalls. */
export const NAMES_PER_WALK = Math.floor((WALK_FOOTFALLS - FIRST_NAME_AT) / ((NAME_FEET[0] + NAME_FEET[1]) / 2));
/** With reduced motion, a step a name, and never more steps than this. */
export const STILL_STEPS = NAMES_PER_WALK;
/** A press of "Take a step" can't be hurried. */
export const STILL_STEP_MS = 300;

/** The dark at the walk's start and end: never quite black, so the nearest iron is just seen. */
export const DARK_MOST = 0.96;
/** How much of the walk it takes to come out of the dark into the light, and, at the end, to go back into it. */
export const INTO_LIGHT = 0.28;
export const INTO_DARK = 0.28;
const smooth = (x: number) => {
  const k = Math.max(0, Math.min(1, x));
  return k * k * (3 - 2 * k);
};
/** How dark the hall is, this far through the walk (0 to 1): dark at the start, walking into the light, and dark again at the end. */
export function darkness(progress: number, ended = false): number {
  if (ended) return DARK_MOST;
  return DARK_MOST * (1 - Math.min(smooth(progress / INTO_LIGHT), smooth((1 - progress) / INTO_DARK)));
}

// REVIEW (Verity): the room's way in, under its title: at the owner's request (November 4, 2026), only this; the description, the line on what is to come and the length are gone.
export const WALK_ABOUT = 'You can pause or leave at any time.';
// REVIEW (Verity): the way in.
export const WALK_BEGIN_LABEL = 'Begin';
// REVIEW (Verity): shown as the hall opens out.
export const WALK_BEGIN = 'You walk on, slowly.';
/** With reduced motion, the walk is taken a step at a time. */
export const WALK_BEGIN_STILL = 'Take a step when you are ready.';
// REVIEW (Verity): the quiet close, and the invitation to lay a stone.
export const WALK_CLOSE = 'The walk ends here. Thank you for remembering them.';
export const WALK_STONE_INVITE = 'Lay a stone for them';
// REVIEW (Verity): the sound button, inviting the visitor to hear the iron.
export const WALK_SOUND = 'Hear your steps';
// REVIEW (Verity): the note on what the walk is, shown in silence after the film, before the walk begins (it also comes after "Skip to the walk").
export const WALK_MEANING: readonly string[] = [
  'This walk is inspired by Menashe Kadishman’s Fallen Leaves, at the Jewish Museum Berlin, and by the Shoes on the Danube Bank in Budapest.',
  'The floor is covered with iron faces, each one different, too many to count. They stand for the people who died in the Holocaust.',
  'Among them lie empty iron shoes, for the men, women and children who never came home.',
  'As you walk, the iron sounds under your feet. It is the sound of those who died, crying up from below.',
];
// REVIEW (Verity): the button that begins the walk, after the note.
export const WALK_GO = 'Begin the walk';
// REVIEW (Verity): the heading in the Sources drawer over the names' records.
export const WALK_NAMES_HEADING = 'The names on this walk';

/** The two works the walk is inspired by. REVIEW (Verity): wording, and the Danube link (Yad Vashem's article on the memorial). */
export const WALK_INSPIRED_BY = 'The walk is an original piece, inspired by';
export const WALK_INSPIRATION = [
  { label: 'Menashe Kadishman, *Fallen Leaves (Shalekhet)*, Jewish Museum Berlin', href: 'https://www.jmberlin.de/en/shalekhet-fallen-leaves' },
  { label: 'Can Togay and Gyula Pauer, *Shoes on the Danube Bank*, Budapest', href: 'https://www.yadvashem.org/articles/general/shoes-on-the-danube-promenade.html' },
] as const;

/** The recordings the steps are cut from. */
const WALK_SOUND_CREDITS = [
  { label: '“Japan_Matsudo_Stepping_on_Small_Manhole_Cover.wav” by RutgerMuller', href: 'https://freesound.org/s/365411/', note: 'The steps on iron' },
  { label: '“METLImpt_Metal Resonant Impact With Rattle” by SoundDesignForYou', href: 'https://freesound.org/s/697754/', note: 'The rattle' },
];

/**
 * The walk's Sources drawer: the film's sources, line by line; the record
 * of every name this walk has shown; the two works it is inspired by; and
 * the recordings its steps are cut from.
 */
export function walkSourceGroups(shown: readonly Victim[] = []): SourceGroup[] {
  return [
    ...filmSourceGroups(),
    { title: WALK_NAMES_HEADING, items: shown.map((v) => ({ ...v.source, note: victimText(v) })) },
    { title: WALK_INSPIRED_BY, items: WALK_INSPIRATION.map((s) => ({ ...s })) },
    { title: 'The walk’s sounds', items: WALK_SOUND_CREDITS.map((s) => ({ ...s, licence: 'CC0, via Freesound' })) },
  ];
}

/** How long until the next footfall: mostly an even, slow pace, sometimes a pause. */
export function nextGap(r1 = Math.random(), r2 = Math.random()): number {
  const [lo, hi] = r1 < HESITATE_CHANCE ? HESITATE_MS : GAP_MS;
  return lo + r2 * (hi - lo);
}

/** How many footfalls a name takes to come toward the visitor and pass: two or three. */
export const nameFeet = (r = Math.random()) => (r < 0.5 ? NAME_FEET[0] : NAME_FEET[1]);

/** Footfalls from one name to the next: as soon as the last is passing, or, with only a few names to show, spread through the walk. */
export function nameSpacing(names: number, feet: number): number {
  if (names <= 0) return Infinity;
  return Math.max(feet, Math.floor((WALK_FOOTFALLS - FIRST_NAME_AT) / names));
}

/** A name on the walk: who, the footfall it came on, and how many it takes to pass. */
export type NameOnWalk = { victim: Victim; at: number; feet: number };

export function useWalk(sounds: WalkSounds = NO_SOUNDS, reduced = false, pool: readonly Victim[] = walkPool()) {
  const [feet, setFeet] = useState(0);
  // How far through the walk, 0 to 1: by time walking, or under reduced motion, by steps.
  const [progress, setProgress] = useState(0);
  const [walking, setWalking] = useState(false);
  const [ended, setEnded] = useState(false);
  const [sound, setSound] = useState(false);
  const [names, setNames] = useState<NameOnWalk[]>([]);
  const [shown, setShown] = useState<Victim[]>([]);
  const [announcement, setAnnouncement] = useState('');
  const audio = useRef<Footsteps | null>(null);
  // Turned off by the visitor: it stays off when they come back to the walk.
  const muted = useRef(false);
  const feetRef = useRef(0);
  const elapsed = useRef(0);
  const plan = useRef<Victim[]>([]);
  const planAt = useRef(0);
  const nextAt = useRef(FIRST_NAME_AT);
  const remembered = useRef<string[]>([]);
  const busyUntil = useRef(0);
  const endedRef = useRef(false);

  const showName = useCallback((at: number) => {
    const victim = plan.current[planAt.current];
    if (!victim) return false;
    planAt.current += 1;
    const f = nameFeet();
    nextAt.current = at + nameSpacing(plan.current.length, f);
    setNames((ns) => [...ns.slice(-1), { victim, at, feet: f }]);
    setShown((s) => [...s, victim]);
    remembered.current = [...remembered.current, victim.id];
    saveShown(remembered.current);
    setAnnouncement(victimText(victim));
    return true;
  }, []);

  const footfall = useCallback(() => {
    const n = feetRef.current + 1;
    feetRef.current = n;
    setFeet(n);
    audio.current?.step(n % 2 === 0 ? 1 : -1);
    return n;
  }, []);

  const end = useCallback(() => {
    endedRef.current = true;
    setEnded(true);
    setWalking(false);
    setAnnouncement(WALK_CLOSE);
  }, []);

  /** A fresh walk: back to the beginning of the hall, with a fresh set of names. */
  const start = useCallback(() => {
    const drawn = drawWalkNames(pool, reduced ? STILL_STEPS : NAMES_PER_WALK, loadShown());
    plan.current = drawn.names;
    remembered.current = drawn.shown.filter((id) => !drawn.names.some((v) => v.id === id));
    planAt.current = 0;
    nextAt.current = FIRST_NAME_AT;
    feetRef.current = 0;
    elapsed.current = 0;
    busyUntil.current = 0;
    endedRef.current = false;
    setFeet(0);
    setProgress(0);
    setNames([]);
    setShown([]);
    setEnded(false);
    setWalking(!reduced);
    setAnnouncement(reduced ? WALK_BEGIN_STILL : WALK_BEGIN);
  }, [pool, reduced]);

  /** With reduced motion: one step, and the next name with it; past the last, the close. */
  const step = useCallback(() => {
    const now = performance.now();
    if (endedRef.current || now < busyUntil.current) return;
    busyUntil.current = now + STILL_STEP_MS;
    if (planAt.current >= plan.current.length || feetRef.current >= STILL_STEPS) {
      end();
      return;
    }
    const n = footfall();
    setProgress(Math.min(1, n / STILL_STEPS));
    showName(n);
  }, [footfall, showName, end]);

  // Walking on: footfalls at a slow, uneven pace, a name coming every two or three, until the visitor pauses, or the walk is done.
  useEffect(() => {
    if (!walking || reduced) return;
    let id: ReturnType<typeof setTimeout>;
    let gap = 0;
    const tick = () => {
      elapsed.current += gap;
      setProgress(Math.min(1, elapsed.current / WALK_MS));
      if (elapsed.current >= WALK_MS) {
        end();
        return;
      }
      const n = footfall();
      if (n >= nextAt.current) showName(n);
      gap = nextGap();
      id = setTimeout(tick, gap);
    };
    tick();
    return () => clearTimeout(id);
  }, [walking, reduced, footfall, showName, end]);

  const soundOn = useCallback(() => {
    if (!audio.current) audio.current = makeMetal(sounds.clanks, sounds.rattle) ?? makeFootsteps();
    setSound(!!audio.current);
    return !!audio.current;
  }, [sounds]);
  const soundOff = useCallback(() => {
    audio.current?.close();
    audio.current = null;
    setSound(false);
  }, []);

  /** Begin's press readies the sound, so it can start with the walk (unless the visitor has turned it off). */
  const prime = useCallback(() => {
    if (!muted.current) soundOn();
  }, [soundOn]);

  const toggleWalking = () => {
    setWalking((w) => !w);
    setAnnouncement(walking ? 'You pause.' : 'You walk on, slowly.');
  };

  const toggleSound = () => {
    if (sound) {
      muted.current = true;
      soundOff();
      setAnnouncement('Sound off.');
      return;
    }
    muted.current = false;
    setAnnouncement(soundOn() ? 'Sound on. Each step is heard.' : 'Sound is not available in this browser.');
  };

  const leave = useCallback(() => {
    setWalking(false);
    soundOff();
  }, [soundOff]);

  useEffect(() => () => audio.current?.close(), []);

  return { reduced, feet, progress, walking, ended, sound, names, shown, announcement, start, step, prime, toggleWalking, toggleSound, leave, setAnnouncement };
}

export type WalkState = ReturnType<typeof useWalk>;

/** Behind the room's title and panel: the film's first picture, very dim, in the dark; or just the dark. */
export function WalkBackdrop({ pictures }: { pictures: WalkPictures }) {
  const first = WALK_LINES[0];
  const file = pictures[first.slot];
  return (
    <div className="hos-scene hos-walk-backdrop" aria-hidden="true">
      {file && (
        // eslint-disable-next-line @next/next/no-img-element -- the owner's picture, as a dim backdrop
        <img src={slotSrc(first.slot, file)} alt="" />
      )}
      <span className="hos-walk-backdrop-veil" />
    </div>
  );
}

/**
 * The floor of the hall, on a canvas: the grey walls and the iron faces and
 * shoes, in the pale light, moving forward a footfall at a time. It draws
 * only while it moves, and once when the screen changes size; under
 * reduced motion it never moves, only jumps.
 */
function WalkFloor({ feet, reduced }: { feet: number; reduced: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const s = useRef({ ctx: null as CanvasRenderingContext2D | null, view: null as View | null, at: 0, from: 0, to: 0, moveT0: -1, raf: 0 });

  const kick = useCallback(() => {
    const st = s.current;
    if (st.raf) return;
    const frame = (now: number) => {
      st.raf = 0;
      let more = false;
      if (st.moveT0 >= 0) {
        const k = Math.min(1, (now - st.moveT0) / MOVE_MS);
        st.at = st.from + (st.to - st.from) * easeStep(k);
        if (k < 1) more = true;
        else st.moveT0 = -1;
      }
      if (st.ctx && st.view) drawFloor(st.ctx, st.view, st.at);
      if (more) st.raf = requestAnimationFrame(frame);
    };
    st.raf = requestAnimationFrame(frame);
  }, []);

  // The canvas, sized to the screen (no finer than twice its pixels).
  useEffect(() => {
    const c = canvas.current;
    const ctx = c?.getContext('2d') ?? null;
    if (!c || !ctx) return;
    const st = s.current;
    st.ctx = ctx;
    const size = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = c.clientWidth || window.innerWidth;
      const h = c.clientHeight || window.innerHeight;
      c.width = Math.round(w * dpr);
      c.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      st.view = makeView(w, h);
      kick();
    };
    size();
    window.addEventListener('resize', size);
    return () => {
      window.removeEventListener('resize', size);
      if (st.raf) cancelAnimationFrame(st.raf);
      st.raf = 0;
    };
  }, [kick]);

  // A footfall: forward over the iron, slowly; back to the beginning, at once.
  useEffect(() => {
    const st = s.current;
    const to = feet * STEP;
    if (to === st.to && st.moveT0 < 0 && st.at === to) return;
    if (reduced || to < st.at) {
      st.at = to;
      st.to = to;
      st.moveT0 = -1;
    } else {
      st.from = st.at;
      st.to = to;
      st.moveT0 = performance.now();
    }
    kick();
  }, [feet, reduced, kick]);

  return <canvas ref={canvas} className="hos-walk-floor" aria-hidden="true" />;
}

/** How far a name has come toward the visitor: 0 as it appears, far ahead; 1 as it passes. */
export const nameProgress = (n: NameOnWalk, feet: number) => Math.max(0, Math.min(1, (feet - n.at) / n.feet));

/** One name, ahead of the visitor: who they were, and below, their age's year and place, as far as they are known. */
function NameAhead({ n, feet, reduced }: { n: NameOnWalk; feet: number; reduced: boolean }) {
  const p = reduced ? 0.4 : nameProgress(n, feet);
  const death = victimDeath(n.victim);
  return (
    <div
      className={`how-name${!reduced && feet - n.at >= n.feet ? ' is-passing' : ''}`}
      style={{ '--p': p.toFixed(3) } as React.CSSProperties}
      data-name={n.victim.id}
      data-at={n.at}
    >
      <p className="how-name-who">
        {n.victim.name}
        {n.victim.age && (
          <>
            <span className="how-name-comma">, </span>
            <span className="how-name-age">{n.victim.age}</span>
          </>
        )}
      </p>
      {death && (
        <p className="how-name-death">
          <span className="visually-hidden"> · </span>
          {death}
        </p>
      )}
    </div>
  );
}

/** Between the film and the walk: the note on what the walk is, in the dark, in silence, until the visitor begins it. */
export function WalkThreshold({ primaryRef, onBegin, onLeave }: { primaryRef: RefObject<HTMLButtonElement | null>; onBegin: () => void; onLeave: () => void }) {
  return (
    <div className="how-threshold">
      <div className="how-meaning">
        {WALK_MEANING.map((p, i) => (
          <p key={i} className={i === 0 ? 'is-first' : undefined} style={{ animationDelay: `${0.6 + i * 1.2}s` }}>
            {p}
          </p>
        ))}
      </div>
      <div className="hos-walk-bar">
        <div className="hos-walk-bar-side">
          <button ref={primaryRef} type="button" className="hos-button hos-button-primary" onClick={onBegin}>
            {WALK_GO}
          </button>
        </div>
        <div className="hos-walk-bar-side">
          <button type="button" className="hos-button hos-walk-leave" onClick={onLeave}>
            Leave the walk
          </button>
        </div>
      </div>
    </div>
  );
}

/** The walk, full screen: out of the dark into the grey hall and its iron floor, and back into the dark; a name at a time ahead, a few quiet buttons; at the end, the close and its two ways on: walk again, or lay a stone. */
export function WalkHall({ walk, primaryRef, onLeave, opening }: { walk: WalkState; primaryRef: RefObject<HTMLButtonElement | null>; onLeave: () => void; opening: boolean }) {
  const { reduced, feet, progress, walking, ended, sound, names, step, toggleWalking, toggleSound, start } = walk;
  const dark = darkness(progress, ended);
  // Only the names still coming, or passing now: never more than two, one arriving as the other goes.
  const ahead = reduced ? names.slice(-1) : names.filter((n) => feet - n.at <= n.feet);
  return (
    <div className={`how-hall${dark > 0.5 ? ' is-dark' : ''}`} style={{ '--dark': dark.toFixed(3) } as React.CSSProperties} data-dark={dark.toFixed(2)}>
      <WalkFloor feet={feet} reduced={reduced} />
      <span className="how-sky" aria-hidden="true" />
      <span className="how-dark" aria-hidden="true" />
      {opening && !reduced && <span className="how-open" aria-hidden="true" />}

      <div className="how-names">
        {!ended && ahead.map((n) => <NameAhead key={`${n.victim.id}-${n.at}`} n={n} feet={feet} reduced={reduced} />)}
        {!ended && names.length === 0 && <p className="how-say is-intro">{reduced ? WALK_BEGIN_STILL : WALK_BEGIN}</p>}
      </div>

      {ended && (
        <div className="how-close" data-end="true">
          <p className="how-say is-close">{WALK_CLOSE}</p>
          <div className="hos-ways-on">
            <button ref={primaryRef} type="button" className="hos-button" onClick={start}>
              Walk again
            </button>
            <Link href={ROOM_PATHS.stones} className="hos-button hos-button-primary hos-stone-link">
              <span className="hos-stone-mark" aria-hidden="true" />
              {WALK_STONE_INVITE}
            </Link>
          </div>
        </div>
      )}

      <div className="hos-walk-bar">
        <div className="hos-walk-bar-side">
          {ended ? null : reduced ? (
            <button ref={primaryRef} type="button" className="hos-button hos-button-primary" onClick={step}>
              Take a step
            </button>
          ) : (
            <button ref={primaryRef} type="button" className="hos-button hos-button-primary" onClick={toggleWalking}>
              {walking ? 'Pause' : 'Walk on'}
            </button>
          )}
        </div>
        <div className="hos-walk-bar-side">
          <button type="button" className="hos-button hos-button-sound" aria-pressed={sound} onClick={toggleSound}>
            <span aria-hidden="true" className="hos-sound-mark">{sound ? '◉' : '○'}</span> {WALK_SOUND}
          </button>
          <button type="button" className="hos-button hos-walk-leave" onClick={onLeave}>
            Leave the walk
          </button>
        </div>
      </div>
    </div>
  );
}
