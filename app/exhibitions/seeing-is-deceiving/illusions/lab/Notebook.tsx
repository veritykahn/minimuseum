'use client';

import { forwardRef, useRef, useState } from 'react';
import { BENCHES, ILLUSIONS, type IllusionId } from './data';
import { fingerprint, fingerprintTitle, voteLine, type Fingerprint, type Results, type Votes } from './results';

/*
 * The Lab Notebook: each illusion's stamp beside the visitor's result, bench
 * by bench, and "My Illusion Fingerprint": six rings, one for each kind of
 * trick, each drawn as far round as that kind fooled them. It prints on US
 * Letter (the notebook, then the fingerprint, a page each) or saves the
 * fingerprint as a picture, as the doll and memorial cards do. Nothing is
 * stored or sent: it lives in the page until the page is closed.
 */

/** A small drawing of each illusion, stamped beside its result. */
export function Stamp({ id }: { id: IllusionId }) {
  const s = { fill: 'none', stroke: 'currentColor', strokeWidth: 3, strokeLinecap: 'round' as const };
  const body = (() => {
    switch (id) {
      case 'checker':
        return (
          <>
            <path d="M8 24 L24 14 L40 24 L24 34 Z" {...s} />
            <path d="M16 19 L32 29 M32 19 L16 29" {...s} strokeWidth={1.5} />
            <rect x="30" y="8" width="8" height="14" rx="3" fill="currentColor" />
          </>
        );
      case 'contrast':
        return (
          <>
            <rect x="4" y="12" width="20" height="24" fill="currentColor" />
            <rect x="24" y="12" width="20" height="24" {...s} strokeWidth={2} />
            <rect x="10" y="20" width="8" height="8" fill="#888" />
            <rect x="30" y="20" width="8" height="8" fill="#888" />
          </>
        );
      case 'lilac':
        return (
          <>
            {Array.from({ length: 8 }, (_, k) => {
              const a = (k / 8) * Math.PI * 2;
              return k ? <circle key={k} cx={24 + 15 * Math.cos(a)} cy={24 + 15 * Math.sin(a)} r="3.5" fill="currentColor" /> : null;
            })}
            <path d="M24 20 V28 M20 24 H28" {...s} strokeWidth={2} />
          </>
        );
      case 'muller-lyer':
        return <path d="M6 24 H42 M12 18 L6 24 L12 30 M18 18 L24 24 L18 30 M48 18 L42 24 L48 30" {...s} />;
      case 'ebbinghaus':
        return (
          <>
            <circle cx="14" cy="24" r="5" fill="currentColor" />
            {[0, 1, 2, 3].map((k) => (
              <circle key={k} cx={14 + 10 * Math.cos((k * Math.PI) / 2)} cy={24 + 10 * Math.sin((k * Math.PI) / 2)} r="4" {...s} strokeWidth={1.5} />
            ))}
            <circle cx="36" cy="24" r="5" fill="currentColor" />
          </>
        );
      case 'ponzo':
        return <path d="M12 44 L20 4 M36 44 L28 4 M18 14 H30 M14 36 H34" {...s} />;
      case 'jastrow':
        return <path d="M8 22 Q24 6 40 22 L34 26 Q24 16 14 26 Z M8 36 Q24 20 40 36 L34 40 Q24 30 14 40 Z" {...s} strokeWidth={2} />;
      case 'cafe-wall':
        return (
          <>
            {[0, 1, 2].map((r) => [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={4 + c * 16 + (r % 2) * 6} y={8 + r * 12} width="8" height="9" fill="currentColor" />))}
          </>
        );
      case 'fraser':
        return (
          <>
            <circle cx="24" cy="24" r="17" {...s} strokeDasharray="4 3" />
            <circle cx="24" cy="24" r="9" {...s} strokeDasharray="4 3" />
          </>
        );
      case 'poggendorff':
        return (
          <>
            <path d="M4 40 L20 30 M28 25 L44 15" {...s} />
            <rect x="19" y="4" width="10" height="40" fill="currentColor" opacity="0.5" />
          </>
        );
      case 'blind-spot':
        return (
          <>
            <path d="M10 18 V30 M4 24 H16" {...s} />
            <circle cx="36" cy="24" r="5" fill="currentColor" />
          </>
        );
      case 'kanizsa':
        return (
          <>
            {[
              [24, 8],
              [8, 38],
              [40, 38],
            ].map(([x, y], k) => (
              <circle key={k} cx={x} cy={y} r="6" fill="currentColor" />
            ))}
            <path d="M24 12 L11 35 H37 Z" fill="var(--pl-paper, #fff)" />
          </>
        );
      case 'troxler':
        return (
          <>
            <circle cx="24" cy="24" r="15" {...s} strokeWidth={6} opacity="0.35" />
            <circle cx="24" cy="24" r="2.5" fill="currentColor" />
          </>
        );
      case 'waterfall':
        return <path d="M24 24 m0 0 a3 3 0 0 1 6 0 a6 6 0 0 1 -12 0 a9 9 0 0 1 18 0 a12 12 0 0 1 -24 0 a15 15 0 0 1 30 0" {...s} strokeWidth={2.5} />;
      case 'snakes':
        return (
          <>
            <circle cx="24" cy="24" r="17" {...s} strokeWidth={6} strokeDasharray="5 4" />
            <circle cx="24" cy="24" r="7" {...s} strokeWidth={4} strokeDasharray="3 3" />
          </>
        );
      case 'stroop':
        return (
          <text x="24" y="31" textAnchor="middle" fontSize="18" fontWeight="700" fill="currentColor" fontFamily="sans-serif">
            RED
          </text>
        );
      case 'paris':
        return <path d="M24 6 L44 40 H4 Z M16 30 H32" {...s} strokeWidth={2.5} />;
      case 'rubin':
        return <path d="M16 6 H32 Q26 14 30 20 Q26 26 28 32 Q24 38 30 42 H18 Q24 38 20 32 Q22 26 18 20 Q22 14 16 6 Z" fill="currentColor" />;
      case 'ames':
        return <path d="M4 8 L20 14 V38 L4 44 Z M20 14 H44 V38 H20" {...s} strokeWidth={2.5} />;
    }
  })();
  return (
    <svg viewBox="0 0 48 48" className="pl-stamp" aria-hidden="true">
      {body}
    </svg>
  );
}

const RING_COLOURS = ['#e0a33a', '#e0703a', '#2e86c1', '#7a5cc4', '#2e9e6b', '#c2185b'];

/** The fingerprint: six rings round a centre, each drawn as far round as that kind of trick fooled you. */
export const FingerprintCard = forwardRef<SVGSVGElement, { fp: Fingerprint; title: string; name: string; heading?: string }>(function FingerprintCard({ fp, title, name, heading = 'My Illusion Fingerprint' }, ref) {
  return (
    <svg ref={ref} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" className="pl-fp-card" role="img" aria-label={`${heading}. ${title} ${fp.map((f) => `${f.label}: ${f.score === null ? 'not tried' : `${Math.round(f.score * 100)}%`}`).join('. ')}.`}>
      <rect width="600" height="800" fill="#fbf8f1" />
      <rect x="14" y="14" width="572" height="772" fill="none" stroke="#1a1a1a" strokeWidth="2" />
      <text x="300" y="66" textAnchor="middle" fontFamily="Georgia, serif" fontSize="34" fill="#1a1a1a">
        {heading}
      </text>
      <text x="300" y="100" textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontSize="17" fill="#555">
        {name ? `${name} · ` : ''}Perception Lab · Seeing is Deceiving · The Mini Museum
      </text>
      <g transform="translate(300 330)">
        {fp.map((f, i) => {
          const r = 50 + i * 30;
          const c = 2 * Math.PI * r;
          const share = f.score ?? 0;
          return (
            <g key={f.category}>
              <circle r={r} fill="none" stroke="#ddd6c8" strokeWidth="16" />
              {f.score !== null && (
                <circle r={r} fill="none" stroke={RING_COLOURS[i]} strokeWidth="16" strokeLinecap="round" strokeDasharray={`${Math.max(0.5, share * c)} ${c}`} transform="rotate(-90)" />
              )}
            </g>
          );
        })}
        <circle r="26" fill="#1a1a1a" />
      </g>
      <text x="300" y="580" textAnchor="middle" fontFamily="Georgia, serif" fontSize="24" fill="#1a1a1a">
        {title}
      </text>
      {fp.map((f, i) => (
        <g key={f.category} transform={`translate(${i % 2 ? 320 : 60} ${620 + Math.floor(i / 2) * 50})`}>
          <rect width="22" height="22" rx="4" fill={RING_COLOURS[i]} />
          <text x="34" y="18" fontFamily="Helvetica, Arial, sans-serif" fontSize="19" fill="#1a1a1a">
            {`${f.label}: ${f.score === null ? '–' : `${Math.round(f.score * 100)}%`}`}
          </text>
        </g>
      ))}
      <text x="300" y="770" textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontSize="14" fill="#777">
        {`Inner ring: brightness. Outer ring: brain against brain. The further round, the more it fooled ${heading.startsWith('Our') ? 'the class' : 'you'}.`}
      </text>
    </svg>
  );
});

async function toPng(svg: SVGSVGElement): Promise<Blob | null> {
  const xml = new XMLSerializer().serializeToString(svg);
  const url = URL.createObjectURL(new Blob([xml], { type: 'image/svg+xml;charset=utf-8' }));
  try {
    const img = new Image();
    await new Promise<void>((ok, no) => {
      img.onload = () => ok();
      img.onerror = () => no(new Error('draw'));
      img.src = url;
    });
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 1600;
    canvas.getContext('2d')!.drawImage(img, 0, 0, 1200, 1600);
    return await new Promise((ok) => canvas.toBlob(ok, 'image/png'));
  } catch {
    return null;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export default function Notebook({
  results,
  classFp,
  votes,
  onOpen,
}: {
  results: Results;
  /** In class mode, the hands-up tallies. */
  votes?: Votes;
  /** In class mode, the class's fingerprint from the hands-up tallies. */
  classFp?: Fingerprint;
  onOpen: (id: IllusionId) => void;
}) {
  const [name, setName] = useState('');
  const [said, setSaid] = useState('');
  const card = useRef<SVGSVGElement>(null);
  const fp = classFp ?? fingerprint(results);
  const title = fingerprintTitle(fp);
  // In class mode, each line is the class's hands; otherwise the visitor's own result.
  const lineFor = (id: IllusionId) => (classFp ? voteLine(ILLUSIONS.find((i) => i.id === id)!, votes?.[id]) : results[id]?.line ?? null);
  const done = ILLUSIONS.filter((i) => lineFor(i.id)).length;

  const save = async () => {
    if (!card.current) return;
    const png = await toPng(card.current);
    if (!png) return setSaid('The picture could not be made in this browser. Try Print instead.');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(png);
    a.download = `${(name.trim() || 'my-illusion-fingerprint').replace(/[^\w-]+/g, '-').toLowerCase()}.png`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    setSaid('Picture saved to your downloads.');
  };

  return (
    <section className="pl-notebook" aria-labelledby="pl-nb-title">
      <style>{'@page { size: 8.5in 11in; margin: 0.5in; }'}</style>
      <div className="pl-nb-tools">
        <label className="pl-name">
          <span>{classFp ? 'Class name (for printing)' : 'Scientist’s name (for printing)'}</span>
          <input type="text" value={name} onChange={(e) => setName(e.currentTarget.value)} maxLength={40} autoComplete="off" />
        </label>
        <div className="pl-choice-row">
          <button type="button" className="pl-btn pl-btn-primary" onClick={() => window.print()}>
            Print my notebook
          </button>
          <button type="button" className="pl-btn" onClick={save}>
            Save my fingerprint as a picture
          </button>
        </div>
        <p className="pl-tip" role="status">
          {said || 'Nothing here is saved or sent anywhere. It stays on this page until you close it.'}
        </p>
      </div>

      <div className="pl-print">
        <div className="pl-nb-page">
          <h2 id="pl-nb-title" className="pl-nb-title">
            {classFp ? 'Our class’s Lab Notebook' : 'My Lab Notebook'}
          </h2>
          <p className="pl-nb-meta">
            {name ? `${name} · ` : ''}Perception Lab · {done} of {ILLUSIONS.length} illusions tried
          </p>
          <div className="pl-nb-benches">
          {BENCHES.map((b) => (
            <div key={b.n} className="pl-nb-bench">
              <h3>{b.n < 7 ? `Bench ${b.n}: ${b.title}` : b.title}</h3>
              <ul>
                {ILLUSIONS.filter((i) => i.bench === b.n).map((i) => {
                  const line = lineFor(i.id);
                  return (
                    <li key={i.id} data-done={line ? 'yes' : undefined}>
                      <Stamp id={i.id} />
                      <div>
                        <button type="button" className="pl-nb-name" onClick={() => onOpen(i.id)}>
                          {i.name}
                        </button>
                        <p>{line ?? (classFp ? 'No hands counted yet.' : 'Not tried yet.')}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
          </div>
        </div>
        <div className="pl-nb-page pl-nb-fp">
          <FingerprintCard ref={card} fp={fp} title={title} name={name} heading={classFp ? 'Our Class’s Illusion Fingerprint' : 'My Illusion Fingerprint'} />
        </div>
      </div>
    </section>
  );
}


