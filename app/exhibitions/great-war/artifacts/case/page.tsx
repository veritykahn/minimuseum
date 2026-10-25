'use client';

import type { CSSProperties } from 'react';
import Link from 'next/link';
import ExhibitionNav from '@/components/ExhibitionNav';
import CasePlaceholder from '@/components/exhibition/CasePlaceholder';
import { emphasisRuns } from '@/components/exhibition/helpers';
import '@/components/exhibition/poster-exhibition.css';
import { GREAT_WAR, GREAT_WAR_CASE } from '../../greatWar';
import '../../great-war.css';

/*
 * The Great War's display case: photographs of the case (until it is
 * photographed, an empty case drawn in outline, "Display case — photographs
 * to come"), and the artifacts exactly as the Mini Museum record lists them.
 * No 3D viewers.
 */

type CssVars = CSSProperties & Record<`--${string}`, string>;

export default function GreatWarCase() {
  const { fonts, palette, name, subtitle } = GREAT_WAR;
  const style: CssVars = {
    background: palette.page,
    '--pe-display': fonts.display,
    '--pe-body': fonts.body,
    '--pe-ui': fonts.ui ?? fonts.body,
    '--pe-accent': palette.accent,
    '--pe-heading': palette.heading,
  };
  const [first, ...rest] = GREAT_WAR_CASE.photos;

  return (
    <div className="pe-root gw-case" data-exhibition={GREAT_WAR.slug} style={style}>
      <style>{`@import url('${fonts.href}');`}</style>

      <ExhibitionNav className="pe-nav pe-nav-left" href={`/exhibitions/${GREAT_WAR.slug}`}>
        <span className="pe-nav-text" aria-hidden="true">M</span>
        <span className="pe-nav-arrow pe-nav-arrow-left" aria-hidden="true">&#8592;</span>
        <span className="pe-nav-label">Exhibition</span>
      </ExhibitionNav>

      <main className="gw-case-main">
        <header className="gw-case-header">
          <p className="gw-case-label">{GREAT_WAR_CASE.label}</p>
          <h1 className="gw-case-title">{name}</h1>
          <p className="gw-case-subtitle">{subtitle}</p>
        </header>

        {first ? (
          <figure className="gw-case-lead">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={first.src} alt={first.alt} width={first.width} height={first.height} />
          </figure>
        ) : (
          <div className="gw-case-lead gw-case-awaiting">
            <CasePlaceholder size="page" />
          </div>
        )}

        <section className="gw-case-artifacts" aria-labelledby="gw-case-artifacts">
          <h2 id="gw-case-artifacts">{GREAT_WAR_CASE.title}</h2>
          <ul>
            {GREAT_WAR_CASE.artifacts.map((a) => (
              <li key={a}>
                {emphasisRuns(a).map((r, i) => (r.em ? <em key={i}>{r.text}</em> : <span key={i}>{r.text}</span>))}
              </li>
            ))}
          </ul>
        </section>

        {rest.length > 0 && (
          <section className="gw-case-photos" aria-labelledby="gw-case-photos">
            <h2 id="gw-case-photos">{GREAT_WAR_CASE.subtitle}</h2>
            <div className="gw-case-photo-row">
              {rest.map((p) => (
                <figure key={p.src}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.src} alt={p.alt} width={p.width} height={p.height} loading="lazy" />
                </figure>
              ))}
            </div>
          </section>
        )}

        <Link href={`/exhibitions/${GREAT_WAR.slug}`} className="gw-case-return">
          Return to Exhibition
        </Link>
      </main>
    </div>
  );
}
