'use client';

import Link from 'next/link';
import ExhibitionNav from '@/components/ExhibitionNav';
import { casePath, artifactPath, neighbours, posterTitle } from './artifacts';
import { ArtifactGlyph, Emphasized, caseRootStyle } from './caseShared';
import type { CaseArtifact, CasePageData, ExhibitionConfig } from './types';
import './poster-exhibition.css';

/*
 * One artifact in a poster exhibition's display case, laid out as the original
 * exhibitions' artifact viewers are: a stage for the object's photogrammetry
 * 3D model, its name, and its writing; then a space for its interactive. The
 * model and the interactive are to come, and their spaces say so. The writing
 * is the owner's only: the record's line for the object, and any sentences
 * from the exhibition's posters about it, each under its poster's title.
 */

export default function ArtifactPage({ config, data, artifact }: { config: ExhibitionConfig; data: CasePageData; artifact: CaseArtifact }) {
  const { name: exhibition, slug } = config;
  const home = `/exhibitions/${slug}`;
  const caseHref = casePath(config);
  const { prev, next } = neighbours(data, artifact.id);

  // The posters' sentences, grouped under each poster in the order they come.
  const byPoster = new Map<string, string[]>();
  for (const w of artifact.writing ?? []) byPoster.set(w.poster, [...(byPoster.get(w.poster) ?? []), w.text]);

  return (
    <div className="pe-root pe-artifact-page" data-exhibition={slug} style={caseRootStyle(config)}>
      <style>{`@import url('${config.fonts.href}');`}</style>

      <ExhibitionNav className="pe-nav pe-nav-left" href={caseHref}>
        <span className="pe-nav-text" aria-hidden="true">M</span>
        <span className="pe-nav-arrow pe-nav-arrow-left" aria-hidden="true">&#8592;</span>
        <span className="pe-nav-label">{data.label}</span>
      </ExhibitionNav>

      <main className="pe-artifact-main">
        <nav className="pe-artifact-trail" aria-label="Breadcrumb">
          <Link href={home}>{exhibition}</Link>
          <span aria-hidden="true">/</span>
          <Link href={caseHref}>{data.label}</Link>
        </nav>

        <section className="pe-artifact-stage" aria-label="3D model">
          <span className="pe-artifact-stage-art">
            <ArtifactGlyph />
          </span>
          <p className="pe-artifact-soon">3D model to come</p>
        </section>

        <header className="pe-artifact-header">
          <h1 className="pe-artifact-name">
            <Emphasized text={artifact.name} />
          </h1>
        </header>

        <section className="pe-artifact-writing" aria-labelledby="pe-artifact-record">
          <h2 id="pe-artifact-record" className="pe-artifact-source">From the record</h2>
          <p className="pe-artifact-record">
            <Emphasized text={artifact.record} />
          </p>
          {[...byPoster].map(([poster, texts]) => (
            <div key={poster} className="pe-artifact-poster">
              <h2 className="pe-artifact-source">
                From the poster <cite>{posterTitle(config, poster) ?? poster}</cite>
              </h2>
              {texts.map((t) => (
                <p key={t}>
                  <Emphasized text={t} />
                </p>
              ))}
            </div>
          ))}
        </section>

        <section className="pe-artifact-interactive" aria-label="Interactive">
          <p className="pe-artifact-soon">Interactive to come</p>
        </section>

        {(prev || next) && (
          <nav className="pe-artifact-pager" aria-label="More in this case">
            {prev ? (
              <Link href={artifactPath(config, prev)} className="pe-artifact-pager-prev">
                <span aria-hidden="true">&#8592; </span>
                <Emphasized text={prev.name} />
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link href={artifactPath(config, next)} className="pe-artifact-pager-next">
                <Emphasized text={next.name} />
                <span aria-hidden="true"> &#8594;</span>
              </Link>
            )}
          </nav>
        )}

        <div className="pe-artifact-returns">
          <Link href={caseHref} className="pe-case-page-return">
            Back to the {data.label}
          </Link>
          <Link href={home} className="pe-case-page-return">
            Return to Exhibition
          </Link>
        </div>
      </main>
    </div>
  );
}
