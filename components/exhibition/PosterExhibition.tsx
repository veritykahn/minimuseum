'use client';

import { useMemo, type CSSProperties } from 'react';
import Link from 'next/link';
import ExhibitionNav from '@/components/ExhibitionNav';
import PosterNavHint from '@/components/PosterNavHint';
import { usePosterWalkthrough } from '@/lib/usePosterNavigation';
import PosterProjector from '@/components/projector/PosterProjector';
import TeachToggle from '@/components/projector/TeachToggle';
import LessonsLink from '@/components/lesson/LessonsLink';
import { usePosterDeepLink, useProjectorMode } from '@/components/projector/useProjectorMode';
import { FxDefs, FxVeil, PosterProgress, chapterMarks, usePosterFxStage } from '@/components/poster-fx/PosterFx';
import PosterPanel from './PosterPanel';
import { colorsFor, emphasisRuns, fxKind, posterLengths, projectorPosters, veilFor } from './helpers';
import type { DisplayCase, ExhibitionConfig, PosterConfig } from './types';
import './poster-exhibition.css';

/*
 * A poster exhibition, drawn from its config: the landing page (title,
 * "Teach with this" and the lessons chip, the posters and any display cases),
 * the step-by-step poster walkthrough with the exhibition's reveal, and
 * teacher projector mode around it. The behavior is the existing exhibition
 * pages': keyboard, swipe and tap navigation (usePosterWalkthrough), the
 * first-open hint, a polite live region, ?projector=1&poster=N&panel=N deep
 * links, focus handling, and reduced motion (poster-fx.css, and here).
 */

type CssVars = CSSProperties & Record<`--${string}`, string>;

export default function PosterExhibition<K extends string>({ config }: { config: ExhibitionConfig<K> }) {
  const { slug, name, subtitle, fonts, palette, back, corner, posters, cases = [], interactives = [], credits = [], fx: fxConfig, projector: projectorConfig } = config;

  const ids = useMemo(() => posters.map((p) => p.id), [posters]);
  const lengths = useMemo(() => posterLengths(posters), [posters]);
  const pjPosters = useMemo(() => projectorPosters(posters), [posters]);
  const marks = useMemo(() => Object.fromEntries(posters.map((p) => [p.id, chapterMarks(p.items)])) as Record<K, number[]>, [posters]);

  const [projector, setProjector] = useProjectorMode();
  const {
    activeView,
    posterStep,
    fromStep,
    direction,
    fadeIn,
    animationKey,
    contentRef,
    openPoster,
    goToStep,
    nextStep,
    prevStep,
    returnToMain,
    stageProps,
    hintVisible,
    dismissHint,
    announcement,
  } = usePosterWalkthrough(lengths, { hint: !projector });
  usePosterDeepLink(ids, lengths, openPoster);

  const poster: PosterConfig<K> | undefined = activeView === 'main' ? undefined : posters.find((p) => p.id === activeView);
  const item = poster?.items[posterStep];
  const colors = poster ? colorsFor(poster, item) : { bg: palette.page, text: palette.heading, title: palette.heading };
  const kind = fxKind(item);
  const fx = usePosterFxStage(fxConfig.theme, direction, item?.type ?? '', colors.bg, colors.text);
  const veil = veilFor(fxConfig.veil, item, posterStep);

  const rememberFloorPosition = back.remember
    ? () => {
        try {
          sessionStorage.setItem(back.remember!.key, back.remember!.value);
        } catch {
          /* storage unavailable: the floor simply opens at its start */
        }
      }
    : undefined;

  const teachStyle = { '--teach-color': palette.teach.color, '--teach-border': palette.teach.border } as CssVars;
  const rootStyle: CssVars = {
    background: activeView === 'main' ? palette.page : colors.bg,
    '--pe-display': fonts.display,
    '--pe-body': fonts.body,
    '--pe-ui': fonts.ui ?? fonts.body,
    '--pe-accent': palette.accent,
    '--pe-heading': palette.heading,
  };

  const [first, ...rest] = posters;
  const posterButton = (p: PosterConfig<K>) => (
    <button key={p.id} type="button" className="btn-reset pe-poster-frame" data-poster={p.id} onClick={() => openPoster(p.id)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={p.hero.src} alt={p.hero.alt} />
      <span className="pe-poster-hint">Click to explore</span>
    </button>
  );

  const caseLink = (c: DisplayCase) => (
    <Link key={c.href} href={c.href} className={`pe-display-case ${c.image ? '' : 'pe-display-case-emblem'}`}>
      {c.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="pe-case-image" src={c.image.src} alt={c.image.alt} />
      ) : (
        c.emblem && (
          <span className="pe-case-emblem" aria-hidden="true">
            {c.emblem}
          </span>
        )
      )}
      <p className="pe-case-label">{c.label}</p>
      <p className="pe-case-title">{c.title}</p>
      {c.subtitle && <p className="pe-case-subtitle">{c.subtitle}</p>}
    </Link>
  );

  return (
    <div className="pe-root" data-exhibition={slug} style={rootStyle}>
      {/* The exhibition's faces, loaded as the other exhibitions load theirs. */}
      <style>{`@import url('${fonts.href}');`}</style>

      {!projector && (
        <>
          <ExhibitionNav
            className="pe-nav pe-nav-left"
            href={activeView === 'main' ? back.href : undefined}
            onClick={activeView === 'main' ? rememberFloorPosition : returnToMain}
          >
            <span className="pe-nav-text" aria-hidden="true">M</span>
            <span className="pe-nav-arrow pe-nav-arrow-left" aria-hidden="true">&#8592;</span>
            <span className="pe-nav-label">{activeView === 'main' ? back.label : 'Exhibition'}</span>
          </ExhibitionNav>

          {corner && (
            <ExhibitionNav className="pe-nav pe-nav-right" href={corner.href}>
              <span className="pe-nav-label">{corner.label}</span>
              <span className="pe-nav-arrow pe-nav-arrow-right" aria-hidden="true">&#8594;</span>
              <span className="pe-nav-text" aria-hidden="true">M</span>
            </ExhibitionNav>
          )}
        </>
      )}

      {activeView === 'main' && !projector && (
        <div className="pe-exhibition-main">
          <div className="pe-exhibition-title">
            <h1>{name}</h1>
            <p>{subtitle}</p>
            <div className="pe-teach-row">
              <TeachToggle onClick={() => setProjector(true)} style={teachStyle} />
              <LessonsLink exhibition={slug} style={teachStyle} />
            </div>
          </div>

          <div className="pe-exhibition-grid">
            {first && posterButton(first)}
            {cases.map(caseLink)}
            {rest.map(posterButton)}
          </div>

          {interactives.length > 0 && <div className="pe-exhibition-grid pe-interactives">{interactives.map(caseLink)}</div>}

          {credits.length > 0 && (
            <ul className="pe-credits" aria-label="Picture credits">
              {credits.map((c) => {
                const text = emphasisRuns(c.text).map((r, i) => (r.em ? <em key={i}>{r.text}</em> : <span key={i}>{r.text}</span>));
                return (
                  <li key={c.text}>
                    {c.href ? (
                      <a href={c.href} target="_blank" rel="noopener noreferrer">{text}</a>
                    ) : (
                      text
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      <p className="visually-hidden" aria-live="polite" aria-atomic="true">
        {announcement}
      </p>
      <PosterNavHint visible={hintVisible && !projector} onDismiss={dismissHint} />
      {poster && <h1 className="visually-hidden">{poster.title}</h1>}
      {fxConfig.theme === 'sid' && <FxDefs />}

      <PosterProjector
        on={projector}
        exhibitionSlug={slug}
        onExit={() => setProjector(false)}
        exhibition={name}
        theme={projectorConfig.theme}
        links={projectorConfig.links}
        posters={pjPosters}
        activeView={activeView}
        step={posterStep}
        openPoster={openPoster}
        goToStep={goToStep}
        nextStep={nextStep}
        prevStep={prevStep}
        returnToMain={returnToMain}
      >
        {poster && item && (
          <div
            {...stageProps}
            {...fx}
            className={`pe-poster-walkthrough ${fx.className} ${fadeIn ? '' : 'fade-out'}`}
            data-item={item.type}
            key={animationKey}
          >
            <div className="pe-walkthrough-content" ref={contentRef} tabIndex={-1} data-focus-target="">
              {veil && <FxVeil theme={fxConfig.theme} kind={veil} />}
              <PosterPanel
                config={config as ExhibitionConfig}
                poster={poster}
                item={item}
                colors={colors}
                kind={kind}
                projector={projector}
                returnToMain={returnToMain}
              />
            </div>

            {item.type !== 'end' && (
              <div className="pe-walkthrough-nav">
                <button
                  type="button"
                  className="pe-nav-arrow-btn"
                  onClick={prevStep}
                  disabled={posterStep === 0}
                  aria-label="Previous panel"
                  style={{ color: colors.text, borderColor: colors.text }}
                >
                  &#8592;
                </button>
                <PosterProgress
                  theme={fxConfig.theme}
                  step={posterStep}
                  fromStep={fromStep}
                  count={poster.items.length}
                  marks={marks[poster.id]}
                  color={colors.text}
                />
                <button
                  type="button"
                  className="pe-nav-arrow-btn"
                  onClick={nextStep}
                  disabled={posterStep === poster.items.length - 1}
                  aria-label="Next panel"
                  style={{ color: colors.text, borderColor: colors.text }}
                >
                  &#8594;
                </button>
              </div>
            )}
          </div>
        )}
      </PosterProjector>
    </div>
  );
}
