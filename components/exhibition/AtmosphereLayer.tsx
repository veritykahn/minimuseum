'use client';

import type { CSSProperties } from 'react';
import { scatter } from './helpers';
import type { Atmosphere } from './types';

type CssVars = CSSProperties & Record<`--${string}`, string | number>;

/**
 * The animated ground behind a walkthrough's panels: one of the exhibition's
 * own atmospheres (rain over a trench, sand on the wind). The engine draws
 * the pieces; the exhibition's stylesheet draws the weather, keyed on
 * `.pe-atmo-<name>`:
 *
 *   .pe-atmo-<name>                the layer (fixed behind the panel)
 *   .pe-atmo-part.pe-atmo-part-N   `parts` plain layers, for beams and washes
 *   .pe-atmo-img.<className>       `images`, decorative pictures
 *   .pe-atmo-p                     `particles`, each with --i, --x, --y, --r
 *
 * Decorative and hidden from assistive technology. Under
 * prefers-reduced-motion it is drawn still (poster-exhibition.css).
 */
export default function AtmosphereLayer({ name, atmosphere }: { name: string; atmosphere: Atmosphere }) {
  const { particles = 0, parts = 0, images = [] } = atmosphere;
  return (
    <div className={`pe-atmo pe-atmo-${name}`} aria-hidden="true">
      {Array.from({ length: parts }, (_, i) => (
        <b key={`part-${i}`} className={`pe-atmo-part pe-atmo-part-${i + 1}`} />
      ))}
      {images.map((img) => (
        // eslint-disable-next-line @next/next/no-img-element -- decorative, animated in CSS
        <img key={img.src + img.className} src={img.src} alt="" className={`pe-atmo-img ${img.className}`} />
      ))}
      {Array.from({ length: particles }, (_, i) => {
        const { x, y, r } = scatter(i);
        return <i key={`p-${i}`} className="pe-atmo-p" style={{ '--i': i, '--x': x, '--y': y, '--r': r } as CssVars} />;
      })}
    </div>
  );
}
