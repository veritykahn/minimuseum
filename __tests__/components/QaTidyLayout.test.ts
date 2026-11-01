import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/*
 * Readability fixes from the full-site QA pass (found in a browser at phone,
 * iPad and desktop sizes). Each is a rule or two of CSS, so each test reads
 * the stylesheet and checks it is still there.
 */

const read = (path: string) => readFileSync(join(process.cwd(), path), 'utf8');

/** The body of the last @media block that opens with `query`. */
function mediaBlock(css: string, query: string): string {
  const start = css.lastIndexOf(query);
  if (start < 0) return '';
  let depth = 0;
  for (let i = css.indexOf('{', start); i < css.length; i++) {
    if (css[i] === '{') depth++;
    else if (css[i] === '}' && --depth === 0) return css.slice(start, i + 1);
  }
  return css.slice(start);
}

describe('QA readability fixes', () => {
  it('Seeing is Deceiving: over a full-screen picture the corner links and arrows sit on a backing', () => {
    const page = read('app/exhibitions/seeing-is-deceiving/page.tsx');
    expect(page).toMatch(/const overImage = !isMain && currentItem\?\.type === 'full-image';/);
    expect(page).toMatch(/className=\{`nav-m nav-m-left \$\{overImage \? 'nav-m-backed' : ''\}`\}/);
    expect(page).toMatch(/className=\{`nav-m nav-m-right \$\{overImage \? 'nav-m-backed' : ''\}`\}/);
    expect(page).toMatch(/className=\{`walkthrough-nav \$\{overImage \? 'walkthrough-nav-backed' : ''\}`\}/);
  });

  it('The Fear Lab: the tower steps back behind "But these contemporary horrors"', () => {
    const css = read('app/exhibitions/fear-lab/fear-lab.css');
    expect(css).toMatch(/\[data-exhibition='fear-lab'\]:has\(\.pe-artwork-display\) \.pe-atmo-vampire-storm \.pe-atmo-part-3 \{\s*opacity: 0\.15;/);
  });

  it('The Fear Lab: on an upright iPad the vampire stands above a wider column of copy', () => {
    const upright = mediaBlock(read('app/exhibitions/fear-lab/fear-lab.css'), '@media (min-width: 701px) and (max-aspect-ratio: 1/1)');
    expect(upright).toMatch(/\.pe-artwork-display \{ flex-direction: column;/);
    expect(upright).toMatch(/\.pe-artwork-info \{ flex: 0 1 auto; width: min\(100%, 580px\); \}/);
  });

  it('landing pages: the row keeps clear of the Map button', () => {
    const css = read('components/exhibition/poster-exhibition.css');
    expect(mediaBlock(css, '@media (min-width: 641px) {')).toMatch(/\.pe-landing-row \{ width: min\(100%, calc\(100vw - 176px\)\); \}/);
    expect(mediaBlock(css, '@media (min-width: 641px) and (max-aspect-ratio: 5 / 6) {')).toMatch(/padding-bottom: max\(var\(--pe-landing-foot, clamp\(14px, 3dvh, 32px\)\), 88px\);/);
  });
});
