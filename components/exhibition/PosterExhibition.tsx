'use client';

import { useMemo, type CSSProperties } from 'react';
import Link from 'next/link';
import ExhibitionNav from '@/components/ExhibitionNav';
import PosterNavHint from '@/components/PosterNavHint';
import { usePosterWalkthrough } from '@/lib/usePosterNavigation';
import PosterProjector from '@/components/projector/PosterProjector';
import TeachToggle from '@/components/projector/TeachToggle';
import type { TeachContent } from '@/components/projector/TeachSheet';
import { usePosterDeepLink, useProjectorMode } from '@/components/projector/useProjectorMode';
import { FxDefs, FxVeil, PosterProgress, chapterMarks, usePosterFxStage } from '@/components/poster-fx/PosterFx';
import PosterPanel from './PosterPanel';
import CasePlaceholder from './CasePlaceholder';
import LandingCredits from './LandingCredits';
import LandingRow from './LandingRow';
import AtmosphereLayer from './AtmosphereLayer';
import AudioGuide, { useAudioGuide } from './AudioGuide';
import { atmosphereName, colorsFor, entranceOf, fxKind, posterLengths, projectorPosters, veilFor } from './helpers';
import type { DisplayCase, ExhibitionConfig, PosterConfig } from './types';
import './poster-exhibition.css';

/*
 * A poster exhibition, drawn from its config: the landing page (title,
 * "Teach with this" and its sheet of lessons and materials, the posters and any display cases),
 * the step-by-step poster walkthrough with the exhibition's reveal, and
 * teacher projector mode around it. The behavior is the existing exhibition
 * pages': keyboard, swipe and tap navigation (usePosterWalkthrough), the
 * first-open hint, a polite live region, ?projector=1&poster=N&panel=N deep
 * links, focus handling, and reduced motion (poster-fx.css, and here).
 */

type CssVars = CSSProperties & Record<`--${string}`, string>;

export default function PosterExhibition<K extends string>({ config }: { config: ExhibitionConfig<K> }) {
  const { slug, name, subtitle, fonts, palette, back, corner, posters, cases = [], credits = [], atmospheres, fx: fxConfig, projector: projectorConfig } = config;

  const ids = useMemo(() => posters.map((p) => p.id), [posters]);
  const lengths = useMemo(() => posterLengths(posters), [posters]);
  const pjPosters = useMemo(() => projectorPosters(posters), [posters]);
  const teach = useMemo<TeachContent>(() => ({ slug, name, posters: pjPosters, links: projectorConfig.links }), [slug, name, pjPosters, projectorConfig.links]);
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
  const colors = poster ? colorsFor(poster, item, atmospheres) : { bg: palette.page, text: palette.heading, title: palette.heading };
  const atmosphere = poster ? atmosphereName(poster, item) : undefined;
  const atmo = atmosphere ? atmospheres?.[atmosphere] : undefined;
  const entrance = entranceOf(item);
  const kind = fxKind(item);
  const fx = usePosterFxStage(fxConfig.theme, direction, item?.type ?? '', colors.bg, colors.text);
  const veil = veilFor(fxConfig.veil, item, posterStep);
  const hasGuide = !!poster?.items.some((i) => i.audio);
  const guide = useAudioGuide(item?.audio);

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
    <button key={p.id} type="button" className="btn-reset pe-poster-frame pe-landing-poster" data-poster={p.id} onClick={() => openPoster(p.id)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={p.hero.src} alt={p.hero.alt} />
      <span className="pe-poster-hint">Click to explore</span>
    </button>
  );

  // A display case: the owner's cut-out photograph of it, or an empty case
  // drawn in outline, in the exhibition's own frame (pe-case-frame, drawn by
  // its stylesheet; decorative).
  const caseLink = (c: DisplayCase) => (
    <Link key={c.href} href={c.href} className={`pe-display-case pe-landing-case ${c.image ? 'has-photo' : 'is-awaiting'}`}>
      <span className="pe-case-frame" aria-hidden="true" />
      {c.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="pe-case-image" src={c.image.src} alt={c.image.alt} />
      ) : (
        <CasePlaceholder size="card" />
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
        <div className="pe-exhibition-main pe-landing">
          <div className="pe-exhibition-title pe-landing-head">
            <h1>{name}</h1>
            <p>{subtitle}</p>
            <div className="pe-teach-row">
              <TeachToggle onClick={() => setProjector(true)} style={teachStyle} teach={teach} />
            </div>
          </div>

          {/* The interactive rooms are in the display case (CasePage), not here. */}
          <LandingRow className="pe-exhibition-grid">
            {first && posterButton(first)}
            {cases.map(caseLink)}
            {rest.map(posterButton)}
          </LandingRow>

          <LandingCredits credits={credits} />
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
        audioGuide={hasGuide ? guide : undefined}
      >
        <>
          {poster && item && atmosphere && atmo && (
            // Outside the stage, so it carries on while the panels that share it change.
            <AtmosphereLayer key={`${poster.id}:${atmosphere}`} name={atmosphere} atmosphere={atmo} />
          )}
          {poster && item && (
            <div
              // The key comes before the spreads, so React builds the element with jsx() and not createElement().
              key={animationKey}
              {...stageProps}
              {...fx}
              className={`pe-poster-walkthrough ${fx.className} ${fadeIn ? '' : 'fade-out'}`}
              data-item={item.type}
              data-entrance={entrance}
              data-atmosphere={atmosphere}
              // Which poster is open, so the reveal can take that poster's own palette.
              data-poster-id={poster.id}
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
          {/* Outside the stage too; in projector mode the guide is in the tool bar instead. */}
          {hasGuide && !projector && <AudioGuide guide={guide} color={colors.text} bg={colors.bg} />}
        </>
      </PosterProjector>
    </div>
  );
}
