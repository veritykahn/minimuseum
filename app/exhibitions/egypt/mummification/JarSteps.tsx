'use client';

import { useMemo, useState } from 'react';
import { DragGhost, useDragDrop } from '../dragKit';
import { playEgypt } from '../egyptSound';
import { Jar, JarHead, Organ, type HeadKind } from './JarArt';
import { ARM, BODY } from './MummyScene';
import { Picture, Task, Tray, boxIn, type StepKit } from './kit';
import { IN_BODY, jarOrder, judgeJar, type OrganId } from './mummyGame';
import { HEART_NOTE, JARS, JARS_ANSWER, stepNotes } from './steps';

/*
 * The canopic jars, in two steps: first learn, then do.
 *
 *   Meet the four gods   the four jars stand in a row; lifting each lid
 *                        meets its god (the head, the name, the organ he
 *                        guards, shown going in). Then a reminder of all
 *                        four, before the jars are mixed up.
 *   The organs           a close look into the body through the cut in its
 *                        left side: lungs, heart, liver, stomach and
 *                        intestines, where they lie. The jars now stand in a
 *                        new order, with no names on them, only the gods'
 *                        heads. Each organ is carried to its god's jar. A
 *                        wrong jar says whose it is and what he guards; a
 *                        second miss for the same organ shows the right
 *                        jar. The heart is caught if offered to a jar: it
 *                        stays inside.
 */

const head = (h: string) => h as HeadKind;

/* ───────────────────────── 3. Meet the four gods ───────────────────────── */

export function GodsStep({ kit }: { kit: StepKit }) {
  const [met, setMet] = useState<string[]>(kit.done ? JARS.map((j) => j.god) : []);
  const [meeting, setMeeting] = useState<string | null>(null);
  const all = met.length === JARS.length;
  const meet = (god: string) => {
    setMeeting(god);
    const next = met.includes(god) ? met : [...met, god];
    setMet(next);
    const j = JARS.find((x) => x.god === god)!;
    playEgypt('find');
    kit.say(`${j.god}, with a ${j.head}’s head, guards the ${j.organ}.${next.length === JARS.length && met.length < JARS.length ? ' You have met all four.' : ''}`);
    if (next.length === JARS.length && met.length < JARS.length) kit.finish();
  };
  const j = JARS.find((x) => x.god === meeting);

  return (
    <>
      <Task done={all}>{all ? 'You have met all four. Remember who guards what: next, the jars will be mixed up.' : 'Each jar’s lid is a god’s head. Lift each lid to meet its god, and see what he guards.'}</Task>
      <Picture
        label={`Four canopic jars in a row, their lids carved as gods’ heads: a human, a baboon, a jackal and a falcon${met.length ? `; met so far: ${met.join(', ')}` : ''}`}
        aspect="800 / 330"
        over={JARS.map((x, i) => (
          <button
            key={x.god}
            type="button"
            className={`egm-drop egm-meet ${met.includes(x.god) ? 'is-full' : ''}`}
            style={{ left: `${((100 + i * 200 - 70) / 800) * 100}%`, width: `${(140 / 800) * 100}%`, top: '14%', height: '80%' }}
            aria-pressed={meeting === x.god}
            onClick={() => meet(x.god)}
            aria-label={met.includes(x.god) ? `${x.god}, the ${x.head}-headed jar` : `Lift the lid of jar ${i + 1}, with a ${x.head}’s head`}
          >
            <span className="egm-drop-name">{met.includes(x.god) ? x.god : 'Lift me'}</span>
          </button>
        ))}
      >
        <svg className="egm-svg" viewBox="0 0 800 330" aria-hidden="true">
          <defs>
            <linearGradient id="egm-gods-wall" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#4a311b" />
              <stop offset="1" stopColor="#24170c" />
            </linearGradient>
            <radialGradient id="egm-gods-light" cx="50%" cy="40%" r="60%">
              <stop offset="0" stopColor="rgba(255, 200, 110, 0.22)" />
              <stop offset="1" stopColor="rgba(255, 200, 110, 0)" />
            </radialGradient>
          </defs>
          <rect width="800" height="330" fill="url(#egm-gods-wall)" />
          <rect width="800" height="330" fill="url(#egm-gods-light)" />
          <rect x="0" y="292" width="800" height="38" fill="#3a2614" />
          <rect x="0" y="290" width="800" height="4" fill="#d9a441" opacity="0.6" />
          {JARS.map((x, i) => (
            <g key={x.god} transform={`translate(${100 + i * 200} 300) scale(1.75)`}>
              <Jar id={`egm-god-${i}`} head={head(x.head)} organ={x.organ} open={meeting === x.god} full={met.includes(x.god) && meeting !== x.god} />
            </g>
          ))}
        </svg>
      </Picture>
      <Tray
        tools={
          all ? (
            <ul className="egm-gods-list" aria-label="The four gods and what they guard">
              {JARS.map((x) => (
                <li key={x.god}>
                  <svg viewBox="-34 -70 68 74" aria-hidden="true">
                    <JarHead kind={head(x.head)} />
                  </svg>
                  <span>
                    <strong>{x.god}</strong> <span className="egm-small">({x.head})</span>
                    <br />
                    the {x.organ}
                  </span>
                </li>
              ))}
            </ul>
          ) : j ? (
            <div className="egm-meeting" key={j.god}>
              <svg viewBox="-40 -80 80 84" className="egm-meeting-head" aria-hidden="true">
                <g transform="scale(1.3) translate(0 -2)">
                  <JarHead kind={head(j.head)} />
                </g>
              </svg>
              <p>
                <strong>{j.god}</strong>, with a {j.head}’s head, guards the <strong>{j.organ}</strong>.
              </p>
              <svg viewBox="-26 -22 52 44" className="egm-meeting-organ" aria-hidden="true">
                <Organ id={j.organ} />
              </svg>
            </div>
          ) : (
            <p className="egm-small">{met.length} of 4 gods met.</p>
          )
        }
        notes={all ? [JARS_ANSWER] : []}
      />
    </>
  );
}

/* ───────────────────────── 4. The organs into their jars ───────────────────────── */

const VIEW = { x: 0, y: 0, w: 640, h: 330 };
const box = boxIn(VIEW);
/** The figure's torso, a little over twice as large: x' = 2.2x - 500, y' = 2.2y - 470. */
const TORSO = 'translate(-500 -470) scale(2.2)';
const ORGAN_AT: Record<OrganId, { x: number; y: number; s: number }> = {
  lungs: { x: 132, y: 102, s: 1.5 },
  heart: { x: 202, y: 112, s: 1.15 },
  liver: { x: 272, y: 104, s: 1.45 },
  stomach: { x: 344, y: 102, s: 1.4 },
  intestines: { x: 426, y: 106, s: 1.45 },
};
const JAR_X = [104, 248, 392, 536];
const JAR_BASE = 322;
const JAR_SCALE = 0.95;

export function OrgansStep({ kit }: { kit: StepKit }) {
  const order = useMemo(() => jarOrder(kit.seed), [kit.seed]);
  const [filled, setFilled] = useState<Record<string, string>>(kit.done ? Object.fromEntries(JARS.map((j) => [j.god, j.organ])) : {});
  const [misses, setMisses] = useState<Record<string, number>>({});
  const [holding, setHolding] = useState<OrganId | null>(null);
  const [hint, setHint] = useState('');
  const [show, setShow] = useState<string | null>(null);
  const [heartTried, setHeartTried] = useState(false);
  const out = Object.values(filled);
  const all = out.length === JARS.length;

  const offer = (organ: OrganId, god: string) => {
    setHolding(null);
    if (filled[god]) {
      kit.say(`${god}’s jar is full already.`);
      return;
    }
    const v = judgeJar(organ, god, misses[organ] ?? 0);
    kit.say(v.message);
    if (v.ok) {
      const next = { ...filled, [god]: organ };
      setFilled(next);
      setHint('');
      setShow(null);
      playEgypt('find');
      if (Object.keys(next).length === JARS.length) {
        kit.say(`${v.message} All four jars are full, and one organ is still inside: the heart.`);
        kit.finish();
      }
      return;
    }
    playEgypt('miss');
    setHint(v.message);
    if (v.kind === 'heart') setHeartTried(true);
    else {
      setMisses((m) => ({ ...m, [organ]: (m[organ] ?? 0) + 1 }));
      setShow(v.reveal);
    }
  };

  const { drag, carrying, start } = useDragDrop<OrganId>((organ, at) => {
    if (at.target.startsWith('jar-')) offer(organ, at.target.slice(4));
  });
  const inside = IN_BODY.filter((o) => !out.includes(o));

  return (
    <>
      <Task done={all}>
        {all ? 'All four jars are full. The heart stays inside the body.' : 'The jars have been mixed up! Carry each organ out of the body, into the jar of the god who guards it.'}
      </Task>
      <Picture
        label={`Close up, the body opened at its left side: inside, ${inside.join(', ')}. Below, four canopic jars with gods’ heads, ${out.length} of them filled`}
        aspect="640 / 330"
        carrying={!!carrying || !!holding}
        over={
          <>
            {!all &&
              inside.map((o) => {
                const a = ORGAN_AT[o];
                return (
                  <button
                    key={o}
                    type="button"
                    className="egm-thing-over egk-carry"
                    style={box(a.x - 34, a.y - 30, 68, 60)}
                    aria-pressed={holding === o}
                    aria-label={`The ${o}`}
                    onPointerDown={(e) => start(o, e)}
                    onClick={() => setHolding((h) => (h === o ? null : o))}
                  />
                );
              })}
            {order.map((j, i) => {
              const full = !!filled[j.god];
              return (
                <button
                  key={j.god}
                  type="button"
                  data-drop={`jar-${j.god}`}
                  className={`egm-drop ${full ? 'is-full' : ''} ${holding && !full ? 'is-ready' : ''} ${show === j.god ? 'is-hint' : ''}`}
                  style={box(JAR_X[i] - 48, JAR_BASE - 130, 96, 134)}
                  aria-label={full ? `${j.god}’s jar, holding the ${filled[j.god]}` : `The jar with a ${j.head}’s head`}
                  onClick={() => (holding ? offer(holding, j.god) : kit.say('First pick up an organ from the body.'))}
                >
                  {full && <span className="egm-drop-name">{j.god}</span>}
                </button>
              );
            })}
          </>
        }
      >
        <svg className="egm-svg" viewBox="0 0 640 330" aria-hidden="true">
          <defs>
            <linearGradient id="egm-org-wall" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#4a311b" />
              <stop offset="1" stopColor="#24170c" />
            </linearGradient>
            <linearGradient id="egm-org-skin" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#c99066" />
              <stop offset="0.6" stopColor="#ad7448" />
              <stop offset="1" stopColor="#7d4f2e" />
            </linearGradient>
            <radialGradient id="egm-org-in" cx="50%" cy="40%" r="60%">
              <stop offset="0" stopColor="#7a3a2a" />
              <stop offset="1" stopColor="#4a1e14" />
            </radialGradient>
          </defs>
          <rect width="640" height="330" fill="url(#egm-org-wall)" />
          {/* the torso on the bed */}
          <rect x="0" y="164" width="640" height="16" fill="#8a5a2b" stroke="#4a2c12" strokeWidth="2" />
          <rect x="0" y="180" width="640" height="150" fill="#3a2614" />
          <g transform={TORSO}>
            <path d={BODY} fill="url(#egm-org-skin)" stroke="#5e3a20" strokeWidth="0.9" />
            <path d={ARM} fill="#a26a40" stroke="#5e3a20" strokeWidth="0.6" opacity="0.9" />
          </g>
          {/* the opened left side, and the organs where they lie */}
          <ellipse cx="282" cy="106" rx="206" ry="40" fill="url(#egm-org-in)" stroke="#5a2a1c" strokeWidth="3" />
          <ellipse cx="282" cy="106" rx="206" ry="40" fill="none" stroke="#e6c9a8" strokeWidth="1.5" strokeDasharray="2 6" opacity="0.6" />
          {IN_BODY.map((o) =>
            out.includes(o) || (drag && drag.item === o) ? null : (
              <g key={o} className={o === 'heart' ? `egm-heart-organ ${all ? 'is-shown' : ''}` : undefined} transform={`translate(${ORGAN_AT[o].x} ${ORGAN_AT[o].y}) scale(${ORGAN_AT[o].s})`}>
                <g className={holding === o ? 'egm-lifted' : undefined}>
                  <Organ id={o} />
                </g>
              </g>
            ),
          )}
          {/* the jars, mixed up, on the floor */}
          {order.map((j, i) => (
            <g key={j.god} transform={`translate(${JAR_X[i]} ${JAR_BASE}) scale(${JAR_SCALE})`}>
              <Jar id={`egm-jar-${i}`} head={head(j.head)} organ={filled[j.god] ?? j.organ} full={!!filled[j.god]} />
            </g>
          ))}
        </svg>
      </Picture>
      <Tray
        tools={
          !all && (
            <>
              <p className="egm-small">{holding ? `You are holding the ${holding}. Now tap its god’s jar.` : 'Drag an organ to a jar, or tap the organ and then the jar.'}</p>
              <p className="egm-hint">{hint}</p>
            </>
          )
        }
        notes={all ? [HEART_NOTE, stepNotes('organs')[0]] : heartTried ? [HEART_NOTE] : []}
      />
      <DragGhost at={drag}>
        {drag && (
          <svg className="egm-ghost" viewBox="-26 -22 52 44" width="80" height="68" aria-hidden="true">
            <Organ id={drag.item} />
          </svg>
        )}
      </DragGhost>
    </>
  );
}
