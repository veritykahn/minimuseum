'use client';

import type { CSSProperties } from 'react';
import Link from 'next/link';
import ExhibitionNav from '@/components/ExhibitionNav';
import { emphasisRuns } from './helpers';
import type { CasePageData, ExhibitionConfig } from './types';
import './poster-exhibition.css';

/*
 * A display case page for a poster exhibition: photographs of the
 * installation, and the artifacts exactly as the Mini Museum record lists
 * them (*words* set in italics). The exhibition's faces and colors come from
 * its config, as on its landing page; its own stylesheet can restyle the
 * pe-case-page-* classes under [data-exhibition='<slug>'].
 */

type CssVars = CSSProperties & Record<`--${string}`, string>;

export default function CasePage({ config, data }: { config: ExhibitionConfig; data: CasePageData }) {
  const { fonts, palette, name, subtitle, slug } = config;
  const style: CssVars = {
    background: palette.page,
    '--pe-display': fonts.display,
    '--pe-body': fonts.body,
    '--pe-ui': fonts.ui ?? fonts.body,
    '--pe-accent': palette.accent,
    '--pe-heading': palette.heading,
  };
  const [first, ...rest] = data.photos;
  const home = `/exhibitions/${slug}`;

  return (
    <div className="pe-root pe-case-page" data-exhibition={slug} style={style}>
      <style>{`@import url('${fonts.href}');`}</style>

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

        {!first && data.placeholder && (
          <div className="pe-case-page-placeholder">
            <p>{data.placeholder}</p>
          </div>
        )}

        {first && (
          <figure className="pe-case-page-lead">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={first.src} alt={first.alt} width={first.width} height={first.height} />
          </figure>
        )}

        <section className="pe-case-page-artifacts" aria-labelledby={`${slug}-case-artifacts`}>
          <h2 id={`${slug}-case-artifacts`}>{data.title}</h2>
          <ul>
            {data.artifacts.map((a) => (
              <li key={a}>
                {emphasisRuns(a).map((r, i) => (r.em ? <em key={i}>{r.text}</em> : <span key={i}>{r.text}</span>))}
              </li>
            ))}
          </ul>
        </section>

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

        <Link href={home} className="pe-case-page-return">
          Return to Exhibition
        </Link>
      </main>
    </div>
  );
}
