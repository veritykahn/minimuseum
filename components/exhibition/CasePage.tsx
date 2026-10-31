'use client';

import Link from 'next/link';
import ExhibitionNav from '@/components/ExhibitionNav';
import CasePlaceholder from './CasePlaceholder';
import { CaseViewTabs, caseViewIds, useCaseView } from './CaseViews';
import { artifactPath } from './artifacts';
import { ArtifactGlyph, Emphasized, caseRootStyle } from './caseShared';
import type { CasePageData, ExhibitionConfig } from './types';
import './poster-exhibition.css';

/*
 * A display case page for a poster exhibition, laid out as the original
 * exhibitions' case listings are: the case's name and writing, then a card for
 * each artifact in it, each opening the artifact's own page (ArtifactPage).
 * Above them, a photograph of the case, or until it is photographed an empty
 * case drawn in outline, "Display case — photographs to come"; below them,
 * the record's lines about the display itself. A pair of tabs at the top
 * switches to the case's other view, "Interactives": a card for each of the
 * exhibition's rooms (its config's `interactives`), each with a picture of
 * the room as it looks, which open from the case rather than the landing
 * page (CaseViews; ?view=interactives opens it there). Every word is the
 * record's or the posters' (*words* set in italics).
 *
 * The exhibition's faces and colors come from its config, as on its landing
 * page; its own stylesheet can restyle the pe-case-page-*, pe-artifact-* and
 * pe-room-* classes under [data-exhibition='<slug>'].
 */

export default function CasePage({ config, data }: { config: ExhibitionConfig; data: CasePageData }) {
  const { name, subtitle, slug } = config;
  const [first, ...rest] = data.photos;
  const home = `/exhibitions/${slug}`;
  const display = data.display ?? [];
  // An exhibition has one case (artifacts/case), and its rooms open from it.
  const rooms = config.interactives ?? [];
  const [view, setView] = useCaseView();
  const artifactsIds = caseViewIds(`${slug}-case`, 'artifacts');
  const roomsIds = caseViewIds(`${slug}-case`, 'interactives');

  return (
    <div className="pe-root pe-case-page" data-exhibition={slug} style={caseRootStyle(config)}>
      <style>{`@import url('${config.fonts.href}');`}</style>

      <ExhibitionNav className="pe-nav pe-nav-left" href={home}>
        <span className="pe-nav-text" aria-hidden="true">M</span>
        <span className="pe-nav-arrow pe-nav-arrow-left" aria-hidden="true">&#8592;</span>
        <span className="pe-nav-label">Exhibition</span>
      </ExhibitionNav>

      <main className="pe-case-page-main">
        <header className="pe-case-page-header">
          <p className="pe-case-page-label">{data.label}</p>
          <h1 className="pe-case-page-title">{name}</h1>
          <p className="pe-case-page-subtitle">{subtitle}</p>
        </header>

        {rooms.length > 0 && (
          <CaseViewTabs
            view={view}
            onChange={setView}
            idPrefix={`${slug}-case`}
            className="pe-case-page-views"
            counts={{ artifacts: data.artifacts.length, interactives: rooms.length }}
          />
        )}

        <div
          className="pe-case-page-view pe-case-page-view-artifacts"
          {...(rooms.length > 0 ? { role: 'tabpanel', id: artifactsIds.panel, 'aria-labelledby': artifactsIds.tab } : {})}
          hidden={rooms.length > 0 && view !== 'artifacts'}
        >
          {first ? (
            <figure className="pe-case-page-lead">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={first.src} alt={first.alt} width={first.width} height={first.height} />
            </figure>
          ) : (
            <div className="pe-case-page-lead pe-case-page-awaiting">
              <CasePlaceholder size="page" />
            </div>
          )}

          <section className="pe-case-page-artifacts" aria-labelledby={`${slug}-case-artifacts`}>
            <h2 id={`${slug}-case-artifacts`}>{data.title}</h2>
            <ul className="pe-artifact-grid">
              {data.artifacts.map((a) => (
                <li key={a.id}>
                  <Link href={artifactPath(config, a)} className="pe-artifact-card">
                    <span className="pe-artifact-card-art">
                      <ArtifactGlyph />
                    </span>
                    <span className="pe-artifact-card-name">
                      <Emphasized text={a.name} />
                    </span>
                    <span className="pe-artifact-card-record">
                      <Emphasized text={a.record} />
                    </span>
                    <span className="pe-artifact-card-go">
                      View artifact <span aria-hidden="true">&#8594;</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {display.length > 0 && (
            <section className="pe-case-page-display" aria-labelledby={`${slug}-case-display`}>
              <h2 id={`${slug}-case-display`}>In the display</h2>
              <ul>
                {display.map((line) => (
                  <li key={line}>
                    <Emphasized text={line} />
                  </li>
                ))}
              </ul>
            </section>
          )}

          {rest.length > 0 && (
            <section className="pe-case-page-photos" aria-labelledby={`${slug}-case-photos`}>
              <h2 id={`${slug}-case-photos`}>{data.subtitle}</h2>
              <div className={`pe-case-page-photo-row ${rest.length === 1 ? 'is-single' : ''}`}>
                {rest.map((p) => (
                  <figure key={p.src}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.src} alt={p.alt} width={p.width} height={p.height} loading="lazy" />
                  </figure>
                ))}
              </div>
            </section>
          )}
        </div>

        {rooms.length > 0 && (
          <div
            className="pe-case-page-view pe-case-page-view-interactives"
            role="tabpanel"
            id={roomsIds.panel}
            aria-labelledby={roomsIds.tab}
            hidden={view !== 'interactives'}
          >
            <section className="pe-case-page-rooms" aria-label="Interactives">
              <ul className="pe-room-grid">
                {rooms.map((r) => (
                  <li key={r.href}>
                    <Link href={r.href} className="pe-room-card">
                      <span className={`pe-room-card-art ${r.image ? '' : 'is-emblem'}`} aria-hidden="true">
                        {r.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={r.image.src} alt="" />
                        ) : (
                          <span className="pe-room-card-emblem">{r.emblem}</span>
                        )}
                      </span>
                      <span className="pe-room-card-name">{r.title}</span>
                      {r.subtitle && <span className="pe-room-card-sub">{r.subtitle}</span>}
                      <span className="pe-room-card-go">
                        Enter the room <span aria-hidden="true">&#8594;</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        )}

        <Link href={home} className="pe-case-page-return">
          Return to Exhibition
        </Link>
      </main>
    </div>
  );
}
