import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/*
 * Layout fixes from the second floor's QA pass (found in a browser at phone,
 * iPad and projector sizes). Each is a line of CSS, so each test reads the
 * stylesheet and checks the rule is still there.
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

describe('second floor layout', () => {
  it('Black History: on a phone the ring-panel copy takes the room between the corner vignettes', () => {
    const phone = mediaBlock(read('app/exhibitions/black-history/black-history.css'), '@media (max-width: 700px)');
    expect(phone).toMatch(/\[data-atmosphere='vignette-ring'\] \.pe-text-content-wrapper \.pe-paragraph-text \{ max-width: calc\(100vw - 2 \* 60px\); \}/);
  });

  it('Black History timeline: on an iPad the line sits above the Map button', () => {
    const css = read('app/exhibitions/black-history/timeline/timeline.css');
    expect(mediaBlock(css, '@media (min-width: 761px) and (max-width: 1240px)')).toMatch(/\.bht-track \{ padding-bottom: 84px; \}/);
  });

  it('The Fear Lab: on an upright screen the moon rises above the copy', () => {
    const upright = mediaBlock(read('app/exhibitions/fear-lab/fear-lab.css'), '@media (max-aspect-ratio: 1/1)');
    expect(upright).toMatch(/\.pe-atmo-vampire-storm \.pe-atmo-part-1 \{[^}]*top: 1\.5vh;[^}]*width: 12vmin;/);
  });

  it('Typing Station: Clear the board ends short of the Map button', () => {
    expect(read('app/exhibitions/writing-revolution/typing-station/typing.css')).toMatch(/@media \(min-width: 761px\) \{ \.wrb-foot \{ padding-right: 72px; \} \}/);
  });

  it('Seeing is Deceiving: the poster 1 title is never stretched to the screen height', () => {
    const page = read('app/exhibitions/seeing-is-deceiving/page.tsx');
    expect(page).toMatch(/\.full-bleed-image\.title-image\.poster1-title img \{[^}]*min-height: 0;/);
  });

  it('Seeing is Deceiving 3D viewers: the Map button steps aside while the info panel is open', () => {
    expect(read('app/exhibitions/seeing-is-deceiving/artifacts/artifact-viewer.tsx')).toMatch(/body:has\(\.info-panel\.open\) \.map-toggle-btn \{\s*display: none;/);
  });

  it('the page has no browser margin, so a full-screen page does not scroll', () => {
    expect(read('app/globals.css')).toMatch(/body \{[^}]*margin: 0;/);
  });
});
