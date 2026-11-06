'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useCallback, useRef, useState } from 'react';
import ExhibitionNav from '@/components/ExhibitionNav';
import { useDialogFocus } from '@/lib/a11y';
import { artifactPath, casePath, neighbours, plainText, posterTitle } from './artifacts';
import FactNote from './FactNote';
import { Emphasized, caseRootStyle } from './caseShared';
import type { CaseArtifact, CasePageData, ExhibitionConfig } from './types';
import './poster-exhibition.css';

// three.js comes only with a page that has a model.
const ArtifactModel = dynamic(() => import('./ArtifactModel'), { ssr: false });

/*
 * An artifact with the owner's 3D scan, shown as the original exhibitions'
 * viewers show theirs (the Harlem Renaissance's, Seeing is Deceiving's): the
 * object turning, full screen, with no frame; at the top, the way back to the
 * case and an "i"; at the foot, its name; and the "i" opens its display card,
 * sliding in from the right, with the record's line for it and the posters'
 * words about it. Every color and face is the exhibition's own (its config, as
 * on its landing page). Every word is the record's or the posters'.
 */

export default function ArtifactFullView({
  config,
  data,
  artifact,
  model,
  photo,
}: {
  config: ExhibitionConfig;
  data: CasePageData;
  artifact: CaseArtifact;
  model: string;
  photo?: string;
}) {
  const { slug } = config;
  const caseHref = casePath(config);
  const { prev, next } = neighbours(data, artifact.id);
  const name = plainText(artifact.name);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useDialogFocus(panelRef, open, { onEscape: close, initialFocus: closeRef });

  // The posters' sentences, grouped under each poster in the order they come.
  const byPoster = new Map<string, string[]>();
  for (const w of artifact.writing ?? []) byPoster.set(w.poster, [...(byPoster.get(w.poster) ?? []), w.text]);

  return (
    <div className="pe-root pe-artifact-full" data-exhibition={slug} style={caseRootStyle(config)}>
      <style>{`@import url('${config.fonts.href}');`}</style>

      <header className="pe-artifact-full-bar">
        <ExhibitionNav className="pe-artifact-full-back" href={caseHref}>
          <span aria-hidden="true">&#8592;</span>
          <span>Back to the {data.label}</span>
        </ExhibitionNav>
        <button
          type="button"
          className={`pe-artifact-full-info${open ? ' is-open' : ''}`}
          onClick={() => setOpen(!open)}
          aria-label="About this artifact"
          aria-expanded={open}
          aria-controls="pe-artifact-card"
        >
          <span aria-hidden="true">i</span>
        </button>
      </header>

      <main className="pe-artifact-full-main">
        <ArtifactModel src={model} name={name} photo={photo} />
        <div className="pe-artifact-full-foot">
          <p className="pe-artifact-full-label">{config.name}</p>
          <h1 className="pe-artifact-full-name">
            <Emphasized text={artifact.name} />
          </h1>
        </div>
      </main>

      <div className={`pe-artifact-full-scrim${open ? ' is-open' : ''}`} onClick={close} aria-hidden="true" />
      <div
        id="pe-artifact-card"
        ref={panelRef}
        className={`pe-artifact-card-panel${open ? ' is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pe-artifact-card-title"
        inert={!open}
      >
        <button type="button" ref={closeRef} className="pe-artifact-card-close" onClick={close} aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
        <div className="pe-artifact-card-body">
          <p className="pe-artifact-card-label">Display Card</p>
          <h2 className="pe-artifact-card-title" id="pe-artifact-card-title">
            <Emphasized text={artifact.name} />
          </h2>
          <p className="pe-artifact-card-record">
            <Emphasized text={artifact.record} />
          </p>
          {artifact.about && <FactNote fact={artifact.about} className="pe-artifact-card-note" />}
          {[...byPoster].map(([poster, texts]) => (
            <div key={poster} className="pe-artifact-card-poster">
              <h3>
                From the poster <cite>{posterTitle(config, poster) ?? poster}</cite>
              </h3>
              {texts.map((t) => (
                <p key={t}>
                  <Emphasized text={t} />
                </p>
              ))}
            </div>
          ))}
          {(prev || next) && (
            <nav className="pe-artifact-card-pager" aria-label="More in this case">
              {prev && (
                <Link href={artifactPath(config, prev)}>
                  <span aria-hidden="true">&#8592; </span>
                  <Emphasized text={prev.name} />
                </Link>
              )}
              {next && (
                <Link href={artifactPath(config, next)}>
                  <Emphasized text={next.name} />
                  <span aria-hidden="true"> &#8594;</span>
                </Link>
              )}
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}
