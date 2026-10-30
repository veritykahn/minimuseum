'use client';

import { useCallback, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import FactNote from '@/components/exhibition/FactNote';
import { usePrintSheet } from '../usePrintSheet';
import { GHOST_NOTES, GHOST_TEXT, GHOSTS, PLACES, SPOOKY_WORDS, STARTERS, STORY_MAX, WANTS, addToStory, insertAt, planLine } from './ghostText';

/*
 * Write your own Christmas ghost story, in Dickens' parlour. On the stage,
 * the story as it will print: a page headed "A Ghost Story of Christmas",
 * the title, the writer's name and the story under a dropped capital. In
 * the card: plan the story (a ghost, a place, what it wants), start it
 * from an opening line, write it, scatter in spooky words, and print it on
 * one page. Nothing written is stored or sent.
 */

export default function GhostStory() {
  const t = GHOST_TEXT;
  const [ghost, setGhost] = useState<string | null>(null);
  const [place, setPlace] = useState<string | null>(null);
  const [want, setWant] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [story, setStory] = useState('');
  const [status, setStatus] = useState('');
  const [printing, setPrinting] = useState(false);
  const box = useRef<HTMLTextAreaElement>(null);
  const done = useCallback(() => setPrinting(false), []);
  usePrintSheet(printing, done);

  const plan = planLine(ghost, place, want);

  const begin = (s: string) => {
    // An opening goes first; anything already written follows it.
    setStory((cur) => (cur.startsWith(s) ? cur : cur.trim() ? addToStory(s, cur.trimStart()) : s));
    caret.current = null;
    setStatus('Your story begins.');
    box.current?.focus();
  };
  // A spooky word goes in where the writer's cursor was last (or at the end), and the cursor follows it.
  const caret = useRef<number | null>(null);
  const add = (w: string) => {
    const r = insertAt(story, caret.current ?? story.length, w);
    setStory(r.story);
    caret.current = r.caret;
    setStatus(`Added “${w}”.`);
  };
  const keepCaret = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    caret.current = e.currentTarget.selectionStart;
  };

  return (
    <>
      <div className="vbr-scene vgs-scene">
        <div className="vgs-preview" aria-label="Your ghost story, as it will print" role="region">
          <StoryPage title={title} name={name} story={story} plan={plan} />
        </div>
      </div>

      <section className="vbr-card vgs-card" aria-label={t.heading}>
        <h2>{t.heading}</h2>
        <p className="vbr-intro">{t.intro}</p>
        <FactNote fact={GHOST_NOTES.fireside} className="vbr-fact" />

        <h3 className="vgs-h">1. {t.plan}</h3>
        <Choice legend="Who is the ghost?" options={GHOSTS} value={ghost} onChange={setGhost} />
        <Choice legend="Where does it appear?" options={PLACES} value={place} onChange={setPlace} />
        <Choice legend="What does it want?" options={WANTS} value={want} onChange={setWant} />
        {plan && <p className="vgs-plan">{plan}</p>}

        <h3 className="vgs-h">2. Begin with an opening</h3>
        <div className="vgs-starters" role="group" aria-label="Story openings">
          {STARTERS.map((s) => (
            <button key={s} type="button" className="vgs-starter" onClick={() => begin(s)}>
              {s}
            </button>
          ))}
        </div>

        <h3 className="vgs-h">3. {t.write}</h3>
        <label className="vbr-field">
          <span className="vbr-label">Title</span>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value.slice(0, 60))} maxLength={60} placeholder="The Ghost of …" autoComplete="off" />
        </label>
        <label className="vbr-field">
          <span className="vbr-label">Your story</span>
          <textarea ref={box} value={story} onChange={(e) => { setStory(e.target.value.slice(0, STORY_MAX)); keepCaret(e); }} onSelect={keepCaret} onKeyUp={keepCaret} onClick={keepCaret} rows={9} maxLength={STORY_MAX} />
        </label>
        <p className="vbr-note vgs-count">
          {story.length} of {STORY_MAX} letters
        </p>
        <div className="vgs-words" role="group" aria-label="Spooky words to add">
          <span className="vbr-label">Add a spooky word</span>
          <div className="vbr-options">
            {SPOOKY_WORDS.map((w) => (
              <button key={w} type="button" className="vbr-option" onClick={() => add(w)}>
                {w}
              </button>
            ))}
          </div>
        </div>
        <label className="vbr-field">
          <span className="vbr-label">Your name</span>
          <input type="text" value={name} onChange={(e) => setName(e.target.value.slice(0, 40))} maxLength={40} autoComplete="off" />
        </label>

        <div className="vbr-actions">
          <button
            type="button"
            className="vbr-button vbr-button-primary"
            onClick={() => {
              setPrinting(true);
              setStatus('Printing your ghost story.');
            }}
            disabled={!story.trim()}
          >
            Print my ghost story
          </button>
          <button
            type="button"
            className="vbr-button vbr-button-quiet"
            onClick={() => {
              setStory('');
              setTitle('');
              setGhost(null);
              setPlace(null);
              setWant(null);
              setStatus('A blank page.');
            }}
            disabled={!story && !title && !plan}
          >
            Start again
          </button>
        </div>
        <p className="vbr-note">{t.privacy}</p>
        <FactNote fact={GHOST_NOTES.carol} className="vbr-fact" />
        <FactNote fact={GHOST_NOTES.dickens} className="vbr-fact" />
      </section>

      <p className="vbr-status" role="status" aria-live="polite">{status}</p>

      {printing &&
        createPortal(
          <div className="vbr-print-root vgs-print-root" data-exhibition="victorian">
            <StoryPage title={title} name={name} story={story} plan={plan} />
          </div>,
          document.body,
        )}
    </>
  );
}

function Choice({ legend, options, value, onChange }: { legend: string; options: string[]; value: string | null; onChange: (v: string | null) => void }) {
  return (
    <fieldset className="vbr-choice">
      <legend>{legend}</legend>
      <div className="vbr-options">
        {options.map((o) => (
          <button key={o} type="button" className="vbr-option" aria-pressed={value === o} onClick={() => onChange(value === o ? null : o)}>
            {o}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

/** The story's page: the preview on the stage, and the page that prints. */
function StoryPage({ title, name, story, plan }: { title: string; name: string; story: string; plan: string }) {
  const paras = story.trim() ? story.trim().split(/\n\s*\n|\n/) : [];
  return (
    <article className="vgs-page">
      <p className="vgs-kicker">{GHOST_TEXT.sheetKicker}</p>
      <h1 className="vgs-title">{title.trim() || 'Untitled'}</h1>
      <p className="vgs-by">by {name.trim() || '______________'}</p>
      <div className="vgs-rule" aria-hidden="true">✦ ✦ ✦</div>
      {paras.length ? (
        <div className="vgs-text">
          {paras.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      ) : (
        <p className="vgs-empty">Your story will appear here as you write it…</p>
      )}
      {plan && <p className="vgs-page-plan">{plan}</p>}
      <p className="vgs-foot">{GHOST_TEXT.sheetFoot}</p>
    </article>
  );
}
