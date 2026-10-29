'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ChangeEvent, type KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import Keepsake, { KEEPSAKE_IDS, KEEPSAKE_NAMES } from './Keepsake';
import { downloadDataUrl, printCss, sheetToPng } from './exportTimeline';
import {
  LIMITS,
  MAX_STOPS,
  OWN_KEY,
  addStop,
  emptyTimeline,
  imageFileName,
  parse,
  promptFor,
  removeStop,
  serialize,
  shrinkPhoto,
  stopLabel,
  updateStop,
  type OwnTimeline as Timeline,
} from './yourTimeline';
import { useBox } from './useBox';
import { threadLayout, threadPath } from './violetLife';

/*
 * Make your own timeline: Violet's thread, for a woman in the visitor's own
 * life. Her card comes first (her name, who she is to you, a photograph if
 * you like), then a keepsake for each moment, with a year or age, a place
 * and a memory, and a question beside it to start from. The words are kept
 * in this browser only; a photograph only while the page is open. Print it,
 * or save it as a picture: both are made here, in the browser.
 */

type CssVars = CSSProperties & Record<`--${string}`, string>;

function read(): Timeline | null {
  try {
    return parse(localStorage.getItem(OWN_KEY));
  } catch {
    return null;
  }
}
function write(t: Timeline) {
  try {
    localStorage.setItem(OWN_KEY, serialize(t));
  } catch {
    /* storage unavailable: the timeline lasts as long as the page */
  }
}

/**
 * `announce` speaks through the room's one live region. `kept` and `keep`
 * hold the timeline in the room while Violet's life is open instead, so
 * coming back finds it as it was, photographs and all.
 */
export default function OwnTimeline({
  announce,
  kept,
  keep,
}: {
  announce: (message: string) => void;
  kept: Timeline | null;
  keep: (t: Timeline) => void;
}) {
  const [t, setT] = useState<Timeline>(() => kept ?? emptyTimeline());
  const [index, setIndex] = useState(0);
  const [turn, setTurn] = useState(0);
  const [saving, setSaving] = useState(false);
  const [bandRef, band] = useBox<HTMLDivElement>();
  const stopRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  // Back from Violet's life, the timeline is already here; on a first visit it waits for what this browser kept.
  const [ready, setReady] = useState(kept !== null);

  // What this browser kept from last time (words only), then keep each change.
  // Nothing is written until that has been read, so a blank first render never
  // writes over it (React runs this twice in development).
  useEffect(() => {
    if (ready) return;
    const stored = read();
    if (stored) setT(stored);
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // The keepsakes come in one by one as the room opens; a moment added after that comes at once.
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setSettled(true), 1500);
    return () => window.clearTimeout(id);
  }, []);
  useEffect(() => {
    if (!ready) return;
    write(t);
    keep(t);
  }, [t, ready, keep]);

  const count = t.stops.length + 1;
  const canAdd = t.stops.length < MAX_STOPS;
  const go = useCallback(
    (i: number, { focus = false, say = false } = {}) => {
      if (i < 0 || i >= count) return;
      setIndex(i);
      setTurn(0);
      if (focus) stopRefs.current[i]?.focus();
      if (say) announce(`${i === 0 ? 'Her card' : `Moment ${i}`}, ${i + 1} of ${count}`);
    },
    [count, announce],
  );

  const onStopKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const to =
      e.key === 'ArrowRight' || e.key === 'ArrowDown' ? Math.min(count - 1, index + 1)
      : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? Math.max(0, index - 1)
      : e.key === 'Home' ? 0
      : e.key === 'End' ? count - 1
      : -1;
    if (to < 0) return;
    e.preventDefault();
    go(to, { focus: true });
  };

  // A new moment goes in after the open one (or at the end, from her card), and opens.
  const add = () => {
    if (!canAdd) return;
    const after = index === 0 ? t.stops.length - 1 : index - 1;
    setT((cur) => addStop(cur, after));
    setIndex(after + 2);
    setTurn(0);
    announce(`Moment ${after + 2} added. Give it a year or an age, a place and a memory.`);
  };
  const remove = () => {
    if (index === 0 || t.stops.length <= 1) return;
    setT((cur) => removeStop(cur, index - 1));
    setIndex((i) => Math.max(1, i - 1));
    announce('That moment has been taken off the thread.');
  };

  const onPhoto = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const photo = await shrinkPhoto(file);
      setT((cur) => (index === 0 ? { ...cur, photo } : updateStop(cur, index - 1, { photo })));
      announce('Photograph added. It stays on this device.');
    } catch {
      announce('That file could not be opened as a picture.');
    }
  };
  const clearPhoto = () => {
    setT((cur) => (index === 0 ? { ...cur, photo: undefined } : updateStop(cur, index - 1, { photo: undefined })));
    announce('Photograph taken away.');
  };

  const onPrint = () => window.print();
  const onSave = async () => {
    const node = sheetRef.current;
    if (!node) return;
    setSaving(true);
    try {
      downloadDataUrl(await sheetToPng(node), imageFileName(t));
      announce('Your timeline has been saved as a picture.');
    } catch {
      announce('The picture could not be made just now. You can print the timeline instead.');
    } finally {
      setSaving(false);
    }
  };

  const slots = count + (canAdd ? 1 : 0);
  // On a phone the thread runs back on itself once it has more than a few keepsakes.
  const rows = band.w > 0 && band.w < 760 && slots > 5 ? 2 : 1;
  const points = useMemo(() => threadLayout(slots, band.w, band.h, rows), [slots, band, rows]);
  const fullPath = useMemo(() => threadPath(points), [points]);
  const sewnPath = useMemo(() => threadPath(points.slice(0, index + 1)), [points, index]);
  const addPoint = canAdd ? points[count] : undefined;

  const stop = index > 0 ? t.stops[index - 1] : null;
  const photo = stop ? stop.photo : t.photo;
  const herName = t.name.trim() || 'Her name';

  return (
    <>
      <div className="whv-band" ref={bandRef}>
        <svg className="whv-thread" width={band.w} height={band.h} aria-hidden="true" focusable="false">
          <path className="whv-thread-ahead" d={fullPath} />
          <path className="whv-thread-sewn" d={sewnPath} />
        </svg>
        <div className="whv-stops" role="tablist" aria-label="Your timeline" aria-orientation="horizontal">
          {[null, ...t.stops].map((s, i) => {
            const p = points[i];
            const label = s ? stopLabel(s, i - 1) : t.name.trim() || 'Her card';
            const pic = s ? s.photo : t.photo;
            return (
              <button
                key={s?.id ?? 'her'}
                ref={(el) => {
                  stopRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`whv-own-tab-${i}`}
                aria-controls="whv-own-sheet"
                aria-selected={i === index}
                tabIndex={i === index ? 0 : -1}
                className="whv-stop is-visited"
                style={p ? ({ left: p.x, top: p.y, '--i': settled ? '0' : String(i) } as CssVars) : { opacity: 0 }}
                onClick={() => go(i)}
                onKeyDown={onStopKey}
              >
                <span className={`whv-stop-button${pic ? ' has-photo' : ''}`}>
                  {pic ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="whv-stop-photo" src={pic} alt="" />
                  ) : (
                    <Keepsake id={s ? s.keepsake : 'spool'} className="whv-stop-art" />
                  )}
                </span>
                <span className="whv-stop-label">
                  {label}
                </span>
              </button>
            );
          })}
        </div>
        {addPoint && (
          <button type="button" className="whv-add" style={{ left: addPoint.x, top: addPoint.y }} onClick={add}>
            <span className="whv-add-plus" aria-hidden="true">+</span>
            <span className="whv-add-label">Add a moment</span>
          </button>
        )}
      </div>

      <section className="whv-sheet whv-own" id="whv-own-sheet" role="tabpanel" aria-labelledby={`whv-own-tab-${index}`}>
        <div className="whv-sheet-inner whv-own-inner" key={stop?.id ?? 'her'}>
          <div className="whv-side">
            <figure className={`whv-picture${photo ? ' whv-picture-photo' : ''}`}>
              {photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photo} alt={stop ? `Your photograph for ${stopLabel(stop, index - 1)}` : `Your photograph of ${herName}`} />
              ) : (
                <Keepsake id={stop ? stop.keepsake : 'spool'} className="whv-picture-art" />
              )}
            </figure>
            <div className="whv-photo-actions">
              <button type="button" className="whv-link" onClick={() => fileRef.current?.click()}>
                {photo ? 'Change the photo' : 'Add a photo'}
              </button>
              {photo && (
                <button type="button" className="whv-link" onClick={clearPhoto}>
                  Remove it
                </button>
              )}
              <input ref={fileRef} type="file" accept="image/*" className="visually-hidden" tabIndex={-1} aria-hidden="true" onChange={onPhoto} />
            </div>
          </div>

          <div className="whv-words whv-form">
            {stop ? (
              <>
                <div className="whv-form-head">
                  <h2 className="whv-heading">Moment {index}</h2>
                  {t.stops.length > 1 && (
                    <button type="button" className="whv-link" onClick={remove}>
                      Take it off the thread
                    </button>
                  )}
                </div>
                <p className="whv-prompt">
                  <span>{promptFor(index - 1, turn)}</span>
                  <button type="button" className="whv-link" onClick={() => setTurn((n) => n + 1)}>
                    Another question
                  </button>
                </p>
                <div className="whv-fields">
                  <label className="whv-field whv-field-when">
                    <span>A year or an age</span>
                    <input value={stop.when} maxLength={LIMITS.when} placeholder="1962, or At 14" onChange={(e) => setT((c) => updateStop(c, index - 1, { when: e.target.value }))} />
                  </label>
                  <label className="whv-field">
                    <span>A place</span>
                    <input value={stop.place} maxLength={LIMITS.place} placeholder="Where it happened" onChange={(e) => setT((c) => updateStop(c, index - 1, { place: e.target.value }))} />
                  </label>
                  <label className="whv-field whv-field-wide">
                    <span>A memory</span>
                    <textarea value={stop.memory} maxLength={LIMITS.memory} rows={3} placeholder="A few words about it" onChange={(e) => setT((c) => updateStop(c, index - 1, { memory: e.target.value }))} />
                  </label>
                </div>
                <fieldset className="whv-keepsakes">
                  <legend>A keepsake for it</legend>
                  {KEEPSAKE_IDS.filter((k) => k !== 'spool').map((k) => (
                    <label key={k} className="whv-keepsake">
                      <input type="radio" name={`keepsake-${stop.id}`} value={k} checked={stop.keepsake === k} onChange={() => setT((c) => updateStop(c, index - 1, { keepsake: k }))} />
                      <span className="whv-keepsake-disc">
                        <Keepsake id={k} className="whv-keepsake-art" />
                      </span>
                      <span className="whv-keepsake-name">{KEEPSAKE_NAMES[k]}</span>
                    </label>
                  ))}
                </fieldset>
              </>
            ) : (
              <>
                <h2 className="whv-heading">A woman in your life</h2>
                <p className="whv-own-intro">A grandmother, a mother, an aunt, a teacher… Make a timeline of her life, as Violet’s is made. Ask her, or someone who knows her.</p>
                <div className="whv-fields">
                  <label className="whv-field">
                    <span>Her name</span>
                    <input value={t.name} maxLength={LIMITS.name} placeholder="Her name" onChange={(e) => setT((c) => ({ ...c, name: e.target.value }))} />
                  </label>
                  <label className="whv-field">
                    <span>Who she is to you</span>
                    <input value={t.relation} maxLength={LIMITS.relation} placeholder="My grandmother" onChange={(e) => setT((c) => ({ ...c, relation: e.target.value }))} />
                  </label>
                </div>
                <p className="whv-own-privacy">Your words stay on this device. Photos are never uploaded, and are gone when you leave the page.</p>
              </>
            )}
          </div>
        </div>

        <nav className="whv-steps" aria-label="Along your thread">
          <div className="whv-steps-move">
            <button type="button" className="whv-step" onClick={() => go(index - 1, { say: true })} disabled={index === 0}>
              <span aria-hidden="true">&#8592;</span> Back
            </button>
            {index < count - 1 ? (
              <button type="button" className="whv-step whv-step-next" onClick={() => go(index + 1, { say: true })}>
                Next <span aria-hidden="true">&#8594;</span>
              </button>
            ) : (
              <button type="button" className="whv-step whv-step-next" onClick={add} disabled={!canAdd}>
                Add a moment
              </button>
            )}
          </div>
          <div className="whv-steps-keep">
            <button type="button" className="whv-step" onClick={onPrint}>
              Print
            </button>
            <button type="button" className="whv-step" onClick={onSave} disabled={saving} aria-label={saving ? 'Saving…' : 'Save as image'}>
              {saving ? 'Saving…' : <>Save<span className="whv-step-more"> as image</span></>}
            </button>
          </div>
        </nav>
      </section>

      {ready &&
        createPortal(
          <div className="whv-print-root" aria-hidden="true">
            <style>{printCss()}</style>
            <TimelineSheet t={t} sheetRef={sheetRef} />
          </div>,
          document.body,
        )}
    </>
  );
}

/** The timeline as it is printed and saved: her card, then each moment along the thread. */
function TimelineSheet({ t, sheetRef }: { t: Timeline; sheetRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div className="whv-own-sheet" ref={sheetRef}>
      <header className="whv-own-sheet-head">
        {t.photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="whv-own-sheet-portrait" src={t.photo} alt="" />
        )}
        <div>
          <p className="whv-own-sheet-name">{t.name.trim() || 'A woman in my life'}</p>
          {t.relation.trim() && <p className="whv-own-sheet-relation">{t.relation.trim()}</p>}
        </div>
      </header>
      <ol className="whv-own-sheet-stops">
        {t.stops.map((s) => (
          <li key={s.id} className="whv-own-sheet-stop">
            <span className={`whv-own-sheet-pic${s.photo ? ' is-photo' : ''}`}>
              {s.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={s.photo} alt="" />
              ) : (
                <Keepsake id={s.keepsake} className="whv-own-sheet-art" />
              )}
            </span>
            {s.when.trim() && <span className="whv-own-sheet-when">{s.when.trim()}</span>}
            {s.place.trim() && <span className="whv-own-sheet-place">{s.place.trim()}</span>}
            {s.memory.trim() && <span className="whv-own-sheet-memory">{s.memory.trim()}</span>}
          </li>
        ))}
      </ol>
      <p className="whv-own-sheet-foot">Women’s History Month · The Mini Museum</p>
    </div>
  );
}
