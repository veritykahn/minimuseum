'use client';

import Link from 'next/link';
import ExhibitionNav from '@/components/ExhibitionNav';
import { ARTIFACT_PHOTO_SIZE, NO_CASE_PHOTOS, type CasePhotosOnDisk } from './casePhotoPaths';
import { CaseViewTabs, caseViewIds, useCaseView } from './CaseViews';
import { artifactPath } from './artifacts';
import { roomsInOrder } from './roomsInOrder';
import { ArtifactGlyph, Emphasized, caseRootStyle } from './caseShared';
import type { CasePageData, ExhibitionConfig } from './types';
import './poster-exhibition.css';

/*
 * A display case page for a poster exhibition, laid out as the original
 * exhibitions' case listings are: the case's name and writing, then a card for
 * each artifact in it, in the middle, each opening the artifact's own page
 * (ArtifactPage); each card shows its photograph once the owner drops it in
 * (casePhotoPaths.ts: the route reads which are there and passes them as
 * `photos`). At the owner's request (November 5, 2026), for every exhibition:
 * nothing else, no photograph or drawing of the case and no list of what is
 * in the display (the record's lines stay in its data, unshown); the case's
 * cut-out photograph is for the landing page's card. A pair of tabs at the top
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

export default function CasePage({ config, data, photos = NO_CASE_PHOTOS }: { config: ExhibitionConfig; data: CasePageData; photos?: CasePhotosOnDisk }) {
  const { name, subtitle, slug } = config;
  const home = `/exhibitions/${slug}`;
  // An exhibition has one case (artifacts/case), and its rooms open from it,
  // in the order the landing page's Explore row lists them (roomsInOrder).
  const rooms = roomsInOrder(config.interactives);
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
          className="pe-case-page-view pe-case-page-view-artifacts is-artifacts-only"
          {...(rooms.length > 0 ? { role: 'tabpanel', id: artifactsIds.panel, 'aria-labelledby': artifactsIds.tab } : {})}
          hidden={rooms.length > 0 && view !== 'artifacts'}
        >
          {/* With the tabs above, the Artifacts tab already names this: no heading again here (owner, November 6, 2026). */}
          <section className="pe-case-page-artifacts" aria-labelledby={rooms.length > 0 ? undefined : `${slug}-case-artifacts`} aria-label={rooms.length > 0 ? data.title : undefined}>
            {rooms.length === 0 && <h2 id={`${slug}-case-artifacts`}>{data.title}</h2>}
            <ul className="pe-artifact-grid">
              {data.artifacts.map((a) => (
                <li key={a.id}>
                  <Link href={artifactPath(config, a)} className="pe-artifact-card">
                    <span className={`pe-artifact-card-art ${photos.artifacts[a.id] ? 'has-photo' : ''}`.trim()}>
                      {photos.artifacts[a.id] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={photos.artifacts[a.id]} alt="" width={ARTIFACT_PHOTO_SIZE.width} height={ARTIFACT_PHOTO_SIZE.height} loading="lazy" />
                      ) : (
                        <ArtifactGlyph />
                      )}
                    </span>
                    <span className="pe-artifact-card-name">
                      <Emphasized text={a.name} />
                    </span>
                    <span className="pe-artifact-card-record">
                      <Emphasized text={a.about?.text ?? a.record} />
                    </span>
                    <span className="pe-artifact-card-go">
                      View artifact <span aria-hidden="true">&#8594;</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

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
                      {r.start && <span className="pe-room-card-start">{r.start}</span>}
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

        {/* No "Return to Exhibition" here: the M at the top left goes back to the exhibition (owner, November 6, 2026). */}
      </main>
    </div>
  );
}
