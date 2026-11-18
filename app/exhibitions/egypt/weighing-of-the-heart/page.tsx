'use client';

import { useEffect, useRef, useState } from 'react';
import FactNote from '@/components/exhibition/FactNote';
import RoomShell, { RoomHeader, TombDoor } from '../RoomShell';
import Modal from '../Modal';
import { markDone } from '../tombState';
import Scales from './Scales';
import { CHAPTERS, DEEDS, FIGURES, HEART_WORDS, JUDGEMENT_NOTES, MY_CHOICES, PAPYRI, TIP, WEIGHING_SOURCES, wouldTip, type FigureId } from './judgement';
import './weighing.css';
import { playEgypt } from '../egyptSound';

/*
 * The Weighing of the Heart, told as a story in five chapters, each with
 * Back and Next in one place: it opens on the scales, with Ani's heart
 * going in and the first guess; then the hall and who is in it; Ani's
 * words to the judges, one deed at a time; the verdict; and, last, a quiet
 * look at the visitor's own good choices. The two papyri that show it
 * (Ani's and Hunefer's, which is which) are in the About card. The scales
 * start level, and say so only once the visitor has guessed. At each turn
 * the visitor predicts what they will do, and then they move
 * (judgement.ts). Nothing is scored, and nothing frightens. The guesses
 * come first in the panel, so they are always on screen.
 */

type Phase = 'speak' | 'predict' | 'shown';
type Guess = 'level' | 'tip';

export default function WeighingOfTheHeart() {
  const [chapter, setChapter] = useState(0);
  const [focus, setFocus] = useState<FigureId | null>(null);
  const [heartGuess, setHeartGuess] = useState<Guess | null>(null);
  const [deed, setDeed] = useState(0);
  const [phase, setPhase] = useState<Phase>('speak');
  const [spokeWrong, setSpokeWrong] = useState(false);
  const [guess, setGuess] = useState<Guess | null>(null);
  const [tilt, setTilt] = useState(0);
  const [mine, setMine] = useState<string[]>([]);
  const [status, setStatus] = useState('');
  const [about, setAbout] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const settle = useRef<ReturnType<typeof setTimeout> | null>(null);
  const id = CHAPTERS[chapter].id;
  const current = DEEDS[deed];
  const wordsDone = deed === DEEDS.length - 1 && phase === 'shown';

  useEffect(() => () => {
    if (settle.current) clearTimeout(settle.current);
  }, []);
  // The verdict reached: the tomb remembers the scales balanced.
  useEffect(() => {
    if (id === 'verdict') markDone('weighing');
  }, [id]);

  /** Tip the scales, then let them settle level again. */
  const tipThenSettle = (deg: number, after: string) => {
    if (settle.current) clearTimeout(settle.current);
    setTilt(deg);
    playEgypt('creak');
    settle.current = setTimeout(() => {
      setTilt(0);
      setStatus(after);
      playEgypt('settle');
    }, 1700);
  };

  const go = (i: number) => {
    const to = Math.max(0, Math.min(CHAPTERS.length - 1, i));
    if (settle.current) clearTimeout(settle.current);
    setTilt(0);
    setFocus(null);
    setChapter(to);
    setStatus(`Chapter ${to + 1} of ${CHAPTERS.length}: ${CHAPTERS[to].name}.`);
    heading.current?.focus();
  };

  const predictHeart = (g: Guess) => {
    setHeartGuess(g);
    tipThenSettle(4, 'The scales wobble, then settle perfectly level.');
    setStatus(g === 'level' ? 'Yes: the scales stay level.' : 'Good guess, but look: the scales stay level.');
  };

  const speak = (kind: 'never' | 'did') => {
    if (kind === current.kind) {
      setSpokeWrong(false);
      setPhase('predict');
      setStatus(`Ani says: ${current.quote}`);
    } else {
      setSpokeWrong(true);
      setStatus('Think again: is this something kind, or something unkind?');
    }
  };

  const predict = (g: Guess) => {
    setGuess(g);
    setPhase('shown');
    if (wouldTip(current)) {
      setStatus('If Ani had done this, the scales would tip out of balance.');
      tipThenSettle(TIP, 'But Ani never did it. The scales settle level again.');
    } else {
      setStatus('A good deed keeps the scales level.');
      tipThenSettle(3, 'The scales stay level.');
    }
  };

  const nextDeed = () => {
    if (deed >= DEEDS.length - 1) return;
    if (settle.current) clearTimeout(settle.current);
    setTilt(0);
    setDeed(deed + 1);
    setPhase('speak');
    setGuess(null);
    setSpokeWrong(false);
    setStatus(`Deed ${deed + 2} of ${DEEDS.length}.`);
  };

  const again = () => {
    setHeartGuess(null);
    setDeed(0);
    setPhase('speak');
    setGuess(null);
    setMine([]);
    go(0);
  };

  const guessed = id === 'heart' ? heartGuess !== null : id === 'words' ? phase === 'shown' : id === 'verdict' || id === 'you';
  const canGoOn = id === 'heart' ? heartGuess !== null : id === 'words' ? wordsDone : true;
  const right = guess !== null && (guess === 'tip') === wouldTip(current);

  return (
    <RoomShell className="eg-weighing" sources={WEIGHING_SOURCES} fit>
      <RoomHeader kicker="Interactive · The hall of judgement" title="The Weighing of the Heart">
        <p className="egr-lede">Follow the scribe Ani through his judgement, and guess what the scales will do.</p>
      </RoomHeader>

      <ol className="egw-chapters" aria-label="The story">
        {CHAPTERS.map((c, i) => (
          <li key={c.id} className={i === chapter ? 'is-here' : i < chapter ? 'is-past' : ''} aria-current={i === chapter ? 'step' : undefined}>
            <span aria-hidden="true">{i + 1}</span> {c.name}
          </li>
        ))}
      </ol>

      <div className="egr-layout egr-fill">
        <div className="egr-scene egw-hall egr-sizer" data-chapter={id}>
          <Scales tilt={tilt} heart focus={focus} balanced={id === 'verdict' || id === 'you'} />
          {/* What the scales show, said only once the visitor has guessed (or at the verdict). */}
          <p className="egw-reading" aria-hidden="true">
            {!guessed ? '' : tilt >= TIP ? 'Out of balance' : tilt === 0 ? 'Level' : ''}
          </p>
          {id === 'you' && mine.length > 0 && (
            <ul className="egw-mine" aria-label="Your good choices">
              {mine.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          )}
        </div>

        <section className="egr-panel egr-stepper egw-panel" aria-labelledby="egw-panel-heading">
          <div className="egr-step-body">
            <div className="egw-panel-top">
              <p className="egr-label">
                Chapter {chapter + 1} of {CHAPTERS.length}
              </p>
              <button type="button" className="egr-button egr-button-quiet" aria-haspopup="dialog" onClick={() => setAbout(true)}>
                <span className="egr-q" aria-hidden="true">i</span>About the papyri
              </button>
            </div>

            {id === 'hall' && (
              <>
                <h2 id="egw-panel-heading" ref={heading} tabIndex={-1}>
                  Into the Hall of Judgement
                </h2>
                <p>Ani’s papyrus shows who is waiting in the hall. Tap each one to meet them.</p>
                <div className="egr-options">
                  {(Object.keys(FIGURES) as FigureId[]).map((f) => (
                    <button key={f} type="button" className="egr-option" aria-pressed={focus === f} onClick={() => setFocus(f)}>
                      {FIGURES[f].name}
                    </button>
                  ))}
                </div>
                {focus && <FactNote fact={FIGURES[focus].fact} className="egr-fact egw-meet" />}
              </>
            )}

            {id === 'heart' && (
              <>
                <h2 id="egw-panel-heading" ref={heading} tabIndex={-1}>
                  Ani’s heart on the scales
                </h2>
                <fieldset className="egr-choice egw-guess">
                  <legend>Ani’s heart goes on the scales. Guess: if his heart is true, what will the scales do?</legend>
                  <div className="egr-options">
                    <button type="button" className="egr-option" aria-pressed={heartGuess === 'level'} onClick={() => predictHeart('level')}>
                      Stay level
                    </button>
                    <button type="button" className="egr-option" aria-pressed={heartGuess === 'tip'} onClick={() => predictHeart('tip')}>
                      Tip out of balance
                    </button>
                  </div>
                </fieldset>
                {heartGuess && (
                  <>
                    <p className="egw-result is-right">{heartGuess === 'level' ? 'You guessed it!' : 'Good guess, but look: they stay level.'}</p>
                    <FactNote fact={JUDGEMENT_NOTES.level} className="egr-fact" />
                  </>
                )}
                <FactNote fact={JUDGEMENT_NOTES.heartWords} className="egr-fact" />
                <blockquote className="egw-quote">“{HEART_WORDS}”</blockquote>
              </>
            )}

            {id === 'words' && (
              <>
                <h2 id="egw-panel-heading" ref={heading} tabIndex={-1}>
                  Ani’s words · {deed + 1} of {DEEDS.length}
                </h2>
                <p className="egw-deed" key={current.id}>
                  {current.label}
                </p>
                {phase === 'speak' && (
                  <fieldset className="egr-choice">
                    <legend>Help Ani speak. What does he tell the judges?</legend>
                    <div className="egr-actions egw-choices">
                      <button type="button" className="egr-button" onClick={() => speak('never')}>
                        “I have not …”
                      </button>
                      <button type="button" className="egr-button" onClick={() => speak('did')}>
                        “I have …”
                      </button>
                    </div>
                    {spokeWrong && <p className="egw-hint">Think again: is this something kind, or something unkind?</p>}
                  </fieldset>
                )}
                {deed === 0 && phase === 'speak' && <FactNote fact={JUDGEMENT_NOTES.confession} className="egr-fact" />}
                {phase === 'predict' && (
                  <fieldset className="egr-choice">
                    <legend>{current.kind === 'never' ? 'Ani never did this. But if he had, what would the scales do?' : 'Ani did this good deed. What will the scales do?'}</legend>
                    <div className="egr-options">
                      <button type="button" className="egr-option" onClick={() => predict('level')}>
                        Stay level
                      </button>
                      <button type="button" className="egr-option" onClick={() => predict('tip')}>
                        Tip out of balance
                      </button>
                    </div>
                  </fieldset>
                )}
                {phase !== 'speak' && <blockquote className="egw-quote">“{current.quote}”</blockquote>}
                {phase === 'shown' && (
                  <>
                    <p className={`egw-result ${right ? 'is-right' : 'is-kind'}`}>
                      {right ? 'You guessed it! ' : 'Not quite, and that’s fine. '}
                      {wouldTip(current) ? 'A wrong like this would tip the scales out of balance. But Ani says he never did it, so they settle level.' : 'A good deed keeps the scales level.'}
                    </p>
                    {deed < DEEDS.length - 1 ? (
                      <div className="egr-actions">
                        <button type="button" className="egr-button egr-button-primary" onClick={nextDeed}>
                          Next deed <span aria-hidden="true">→</span>
                        </button>
                      </div>
                    ) : (
                      <p className="egw-result is-right">Ani has spoken. Now for the verdict.</p>
                    )}
                    {deed === DEEDS.length - 1 && <FactNote fact={JUDGEMENT_NOTES.ani} className="egr-fact" />}
                  </>
                )}
              </>
            )}

            {id === 'verdict' && (
              <>
                <h2 id="egw-panel-heading" ref={heading} tabIndex={-1}>
                  The scales balance
                </h2>
                <FactNote fact={JUDGEMENT_NOTES.verdict} className="egr-fact" />
                <FactNote fact={JUDGEMENT_NOTES.reeds} className="egr-fact" />
                <FactNote fact={JUDGEMENT_NOTES.scales} className="egr-fact" lead="In Hunefer’s papyrus too:" />
                <FactNote fact={JUDGEMENT_NOTES.heart} className="egr-fact" />
              </>
            )}

            {id === 'you' && (
              <>
                <h2 id="egw-panel-heading" ref={heading} tabIndex={-1}>
                  Weigh your own choices
                </h2>
                {/* REVIEW: new text (a reflection). */}
                <p>Ani’s story asks a big question: did he live a good life? You can ask yourself the same thing, kindly. Tap the good choices you have made this week.</p>
                <div className="egr-options">
                  {MY_CHOICES.map((c) => (
                    <button key={c} type="button" className="egr-option" aria-pressed={mine.includes(c)} onClick={() => setMine((m) => (m.includes(c) ? m.filter((x) => x !== c) : [...m, c]))}>
                      {c}
                    </button>
                  ))}
                </div>
                {mine.length > 0 && <p className="egw-result is-right">Every one of those counts.</p>}
                <p>And if there is something you would do differently next time, that’s all right. Everyone makes mistakes, and every day is a new chance to choose again.</p>
                <p className="egw-small">Nothing you tap here is saved or sent.</p>
                <div className="egr-actions">
                  <TombDoor />
                  <button type="button" className="egr-button" onClick={again}>
                    Hear the story again
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="egr-step-nav">
            <button type="button" className="egr-button" onClick={() => go(chapter - 1)} disabled={chapter === 0}>
              <span aria-hidden="true">←</span> Back
            </button>
            <button type="button" className="egr-button egr-button-primary" onClick={() => go(chapter + 1)} disabled={chapter === CHAPTERS.length - 1 || !canGoOn}>
              Next <span aria-hidden="true">→</span>
            </button>
          </div>
        </section>
      </div>

      <Modal open={about} onClose={() => setAbout(false)} kicker="About this story" title="Two papyri, one story">
        <p>Two famous papyri in the British Museum show the weighing of the heart. They were made for two different men.</p>
        <article className="egw-papyrus">
          <p className="egr-label">EA 10470</p>
          <h3>The Papyrus of Ani</h3>
          <FactNote fact={PAPYRI.ani} className="egr-fact" />
        </article>
        <article className="egw-papyrus">
          <p className="egr-label">EA 9901</p>
          <h3>The Book of the Dead of Hunefer</h3>
          <FactNote fact={PAPYRI.hunefer} className="egr-fact" />
        </article>
      </Modal>

      <p className="egr-status" role="status" aria-live="polite">
        {status}
      </p>
    </RoomShell>
  );
}
