import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { panelEntrance } from '@/components/exhibition/helpers';
import { SEEING_ATMOSPHERES, poster1Content, poster2Content, type SidItem } from '@/app/exhibitions/seeing-is-deceiving/posters';
import SeeingIsDeceiving from '@/app/exhibitions/seeing-is-deceiving/page';

/*
 * Seeing is Deceiving stays hand-built (page.tsx), with its panels as data
 * (posters.ts). It is held to the same measure as the engine's exhibitions
 * (PosterEffects.test.tsx): every panel arrives its own way, no two in a row
 * alike and none dominating; its sections stand in four to six atmospheres
 * of its own; and each poster opens on its own lettering.
 */

const POSTERS: [string, string, SidItem[]][] = [
  ['poster1', 'Seeing is Deceiving: The Science of How We See', poster1Content],
  ['poster2', 'A History of Lies: From Magic Lanterns to AI Deepfakes', poster2Content],
];
const CSS = join(process.cwd(), 'app/exhibitions/seeing-is-deceiving/seeing.css');

/** Every file under a directory, for the site-wide check on atmosphere names. */
function files(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? files(p) : /\.(css|tsx?)$/.test(f) ? [p] : [];
  });
}

describe('Seeing is Deceiving: panels arrive in many ways', () => {
  it.each(POSTERS)('%s: no two panels in a row enter alike, and no entrance dominates', (_id, _title, items) => {
    const entrances = items.map(panelEntrance);
    entrances.slice(1).forEach((e, i) => expect([i + 1, e]).not.toEqual([i + 1, entrances[i]]));
    const counts = new Map<string, number>();
    for (const e of entrances) counts.set(e, (counts.get(e) ?? 0) + 1);
    expect(Math.max(...counts.values()) / entrances.length).toBeLessThanOrEqual(0.3);
    expect(counts.size).toBeGreaterThanOrEqual(Math.min(8, entrances.length - 1));
  });

  it('gives the writing many entrances, not one effect for every text panel', () => {
    const text = [...poster1Content, ...poster2Content].filter((it) => it.type === 'paragraph');
    const kinds = new Set(text.map(panelEntrance));
    expect(kinds.size).toBeGreaterThanOrEqual(8);
    expect(kinds.has('typewriter')).toBe(true);
    expect(kinds.has('line-by-line')).toBe(true);
  });

  it('stands its sections in four to six atmospheres of its own, each one used and each drawn', () => {
    const defined = Object.keys(SEEING_ATMOSPHERES);
    expect(defined.length).toBeGreaterThanOrEqual(4);
    expect(defined.length).toBeLessThanOrEqual(6);
    const used = new Set([...poster1Content, ...poster2Content].map((it) => it.atmosphere).filter(Boolean));
    expect([...used].sort()).toEqual([...defined].sort());
    const css = readFileSync(CSS, 'utf8');
    for (const name of defined) expect(css).toContain(`.pe-atmo-${name}`);
  });

  it('names its atmospheres uniquely across the site', () => {
    const others = [...files(join(process.cwd(), 'app')), ...files(join(process.cwd(), 'components'))].filter((f) => f !== CSS);
    for (const name of Object.keys(SEEING_ATMOSPHERES)) {
      const clash = others.filter((f) => new RegExp(`pe-atmo-${name}(?![\\w-])`).test(readFileSync(f, 'utf8')));
      expect([name, clash]).toEqual([name, []]);
    }
  });

  it('animates only inside its atmospheres, which the engine stills under reduced motion', () => {
    const css = readFileSync(CSS, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
    const rules = css.split('}').map((r) => r.split('{'));
    for (const [selector, body] of rules) {
      if (!body || !/\banimation\b/.test(body) || selector.includes('@keyframes')) continue;
      expect(selector.trim()).toMatch(/^\.pe-atmo-/);
    }
  });

  it.each(POSTERS)('%s opens on the poster’s own lettering, a picture that is on disk', (_id, title, items) => {
    const first = items[0];
    expect(first.type).toBe('title-image');
    expect(title.startsWith(first.alt ?? '—')).toBe(true);
    expect(existsSync(join(process.cwd(), 'public', first.src ?? ''))).toBe(true);
  });

  it('uses only pictures that exist, and never a photograph of the installation', () => {
    for (const it of [...poster1Content, ...poster2Content]) if (it.src) expect(existsSync(join(process.cwd(), 'public', it.src))).toBe(true);
    expect(JSON.stringify([poster1Content, poster2Content, SEEING_ATMOSPHERES])).not.toMatch(/images\/mm\/|installation/);
  });
});

describe('Seeing is Deceiving walkthrough', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    window.history.replaceState(null, '', '/');
  });
  afterEach(() => jest.useRealTimers());
  const tick = (ms = 400) => act(() => { jest.advanceTimersByTime(ms); });
  const step = () => { fireEvent.keyDown(document, { key: 'ArrowRight' }); tick(); };

  it('marks each panel’s entrance and atmosphere, types a line but keeps it whole for assistive technology', () => {
    render(<SeeingIsDeceiving />);
    fireEvent.click(screen.getByRole('button', { name: /A History of Lies: From Magic Lanterns to AI Deepfakes poster/ }));
    tick();
    const typed = poster2Content.findIndex((it) => it.effect === 'typewriter' && it.atmosphere);
    for (let i = 0; i < typed; i++) step();
    const stage = document.querySelector('[data-poster-stage]') as HTMLElement;
    expect(stage.dataset.entrance).toBe('typewriter');
    expect(stage.dataset.atmosphere).toBe(poster2Content[typed].atmosphere);
    expect(document.querySelector(`.pe-atmo-${poster2Content[typed].atmosphere}`)).toHaveAttribute('aria-hidden', 'true');
    expect(document.querySelector('.pe-typed')).toHaveAttribute('aria-hidden', 'true');
    expect(document.querySelector('.walkthrough-content .visually-hidden')?.textContent).toBe(poster2Content[typed].text);
  });
});
