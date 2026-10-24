'use client';

import { useState } from 'react';
import type { Soldier } from './soldiers';

/*
 * One soldier's card, printed like the installation's take-away cards: the
 * front gives who he was; the back, turned by the button (never by hover),
 * gives his story, where he lies, and the sources. The side facing away is
 * inert, so it is neither read out nor reachable by Tab.
 */

export default function SoldierCard({ soldier }: { soldier: Soldier }) {
  const [turned, setTurned] = useState(false);
  const s = soldier;
  const nameId = `gwm-card-${s.id}`;

  return (
    <article className={`gwm-card ${turned ? 'is-turned' : ''}`} aria-labelledby={nameId}>
      <div className="gwm-card-faces">
        <div className="gwm-card-face gwm-card-front" inert={turned || undefined} aria-hidden={turned || undefined}>
          <p className="gwm-card-kicker">The Great War · In memory</p>
          {s.rank && <p className="gwm-card-rank">{s.rank}</p>}
          <h3 className="gwm-card-name" id={nameId}>{s.name}</h3>
          {s.alsoKnownAs && <p className="gwm-card-aka">{s.alsoKnownAs}</p>}
          <span className="gwm-card-rule" aria-hidden="true" />
          <dl className="gwm-card-facts">
            <div>
              <dt>Unit</dt>
              <dd>{s.unit}</dd>
            </div>
            <div>
              <dt>Hometown</dt>
              <dd>{s.hometown}</dd>
            </div>
            {s.born && (
              <div>
                <dt>Born</dt>
                <dd>{s.born}</dd>
              </div>
            )}
            <div>
              <dt>Died</dt>
              <dd>{s.died}</dd>
            </div>
            {s.age && (
              <div>
                <dt>Age</dt>
                <dd>{s.age}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="gwm-card-face gwm-card-back" inert={!turned || undefined} aria-hidden={!turned || undefined}>
          <p className="gwm-card-kicker">{s.name}</p>
          {s.rankNote && <p className="gwm-card-ranknote">{s.rankNote}</p>}
          <div className="gwm-card-story">
            {s.story.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <dl className="gwm-card-facts gwm-card-facts-back">
            <div>
              <dt>Cause of death</dt>
              <dd>{s.cause}</dd>
            </div>
            {s.honours && (
              <div>
                <dt>Honors</dt>
                <dd>{s.honours}</dd>
              </div>
            )}
            {s.burial && (
              <div>
                <dt>Buried</dt>
                <dd>
                  {s.burial.place}
                  {s.burial.plot && <span className="gwm-card-plot">{s.burial.plot}</span>}
                  {s.burial.note && <span className="gwm-card-burial-note">{s.burial.note}</span>}
                </dd>
              </div>
            )}
            {s.memorial && (
              <div>
                <dt>Remembered</dt>
                <dd>{s.memorial}</dd>
              </div>
            )}
          </dl>
          {s.notes && s.notes.length > 0 && (
            <div className="gwm-card-notes">
              <p className="gwm-card-notes-head">Where the records differ</p>
              {s.notes.map((n) => (
                <p key={n}>{n}</p>
              ))}
            </div>
          )}
          <details className="gwm-card-sources">
            <summary>Sources ({s.sources.length})</summary>
            <ul>
              {s.sources.map((src) => (
                <li key={src.url}>
                  <a href={src.url} target="_blank" rel="noopener noreferrer">
                    {src.label}
                  </a>
                </li>
              ))}
            </ul>
          </details>
        </div>
      </div>

      <button type="button" className="gwm-card-turn" onClick={() => setTurned((t) => !t)}>
        {turned ? 'Turn back to the front' : 'Turn the card'}
        <span className="visually-hidden">{turned ? '' : `: the story of ${s.name}`}</span>
      </button>
    </article>
  );
}
