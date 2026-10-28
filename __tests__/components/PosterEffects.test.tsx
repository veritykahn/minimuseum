import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import PosterExhibition from '@/components/exhibition/PosterExhibition';
import { atmosphereName, colorsFor, entranceOf, sentences } from '@/components/exhibition/helpers';
import type { ExhibitionConfig, PosterItem } from '@/components/exhibition/types';
import { GREAT_WAR } from '@/app/exhibitions/great-war/greatWar';
import { EGYPT } from '@/app/exhibitions/egypt/egypt';

/*
 * The walkthrough's vocabulary of entrances and atmospheres, and the two
 * exhibitions that model it: every panel arrives its own way, no two in a row
 * alike and none dominating, each section stands in an atmosphere of the
 * exhibition's own, and each poster opens on its own lettering.
 */

const tick = (ms = 400) => act(() => { jest.advanceTimersByTime(ms); });
const MODELS: [string, ExhibitionConfig][] = [
  ['The Great War', GREAT_WAR as ExhibitionConfig],
  ['Ancient Egypt', EGYPT as ExhibitionConfig],
];

describe.each(MODELS)('%s: panels arrive in many ways', (_name, config) => {
  it.each(config.posters.map((p) => [p.id, p] as const))('%s: no two panels in a row enter alike, and no entrance dominates', (_id, poster) => {
    const entrances = poster.items.map(entranceOf);
    entrances.slice(1).forEach((e, i) => expect([i + 1, e]).not.toEqual([i + 1, entrances[i]]));
    const counts = new Map<string, number>();
    for (const e of entrances) counts.set(e, (counts.get(e) ?? 0) + 1);
    const most = Math.max(...counts.values());
    expect(most / entrances.length).toBeLessThanOrEqual(0.3);
    expect(counts.size).toBeGreaterThanOrEqual(Math.min(8, entrances.length - 1));
  });

  it('stands its sections in four to six atmospheres of its own, each one used', () => {
    const defined = Object.keys(config.atmospheres ?? {});
    expect(defined.length).toBeGreaterThanOrEqual(4);
    expect(defined.length).toBeLessThanOrEqual(6);
    const used = new Set(config.posters.flatMap((p) => p.items.map((it) => atmosphereName(p, it)).filter(Boolean)));
    expect([...used].sort()).toEqual([...defined].sort());
  });

  it('opens each poster on the poster’s own lettering, a picture that is on disk', () => {
    for (const p of config.posters) {
      const first = p.items[0];
      expect(first.type).toBe('title-image');
      if (first.type !== 'title-image') continue;
      expect(first.alt).toBe(p.title);
      expect(existsSync(join(process.cwd(), 'public', first.src))).toBe(true);
    }
  });

  it('uses only pictures that exist, and never a photograph of the installation', () => {
    const srcs = config.posters.flatMap((p) => p.items.flatMap((it) => ('src' in it ? [it.src] : 'figure' in it && it.figure ? [it.figure.src] : [])));
    const images = Object.values(config.atmospheres ?? {}).flatMap((a) => (a.images ?? []).map((i) => i.src));
    for (const src of [...srcs, ...images]) expect(existsSync(join(process.cwd(), 'public', src))).toBe(true);
    expect(JSON.stringify(config)).not.toMatch(/images\/mm\/|veteran\d?\.jpg|egypt\d\.jpg|installation/);
  });
});

it('gives the two exhibitions atmospheres of their own, not a shared set', () => {
  const a = Object.keys(GREAT_WAR.atmospheres ?? {});
  const b = Object.keys(EGYPT.atmospheres ?? {});
  expect(a.filter((n) => b.includes(n))).toEqual([]);
});

describe('the engine', () => {
  it('splits copy into sentences that join back into the copy exactly', () => {
    const text = 'They fought at Belleau Wood, where U.S. Marines fought hard. They pushed on! Some wept. Church bells rang across Europe.';
    const parts = sentences(text);
    expect(parts.join('')).toBe(text);
    expect(parts).toHaveLength(4);
    expect(sentences('One line only')).toEqual(['One line only']);
  });

  it('takes an atmosphere’s colors over its section’s, and the panel’s own over both', () => {
    const poster = GREAT_WAR.posters[1] as ExhibitionConfig['posters'][number];
    const item: PosterItem = { type: 'paragraph', section: 'dusk', atmosphere: 'telegram', text: 'x' };
    expect(colorsFor(poster, item, GREAT_WAR.atmospheres).bg).toBe(GREAT_WAR.atmospheres?.telegram.bg);
    expect(colorsFor(poster, { ...item, colors: { bg: '#123456' } }, GREAT_WAR.atmospheres).bg).toBe('#123456');
    expect(colorsFor(poster, { type: 'paragraph', section: 'dusk', text: 'x' }, GREAT_WAR.atmospheres).bg).toBe(poster.sections?.dusk.bg);
  });

  describe('in the walkthrough', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      window.history.replaceState(null, '', '/');
    });
    afterEach(() => jest.useRealTimers());

    it('sets the title lettering as the panel’s heading, draws the atmosphere behind it, and marks the entrance on the stage', () => {
      render(<PosterExhibition config={GREAT_WAR} />);
      fireEvent.click(screen.getByRole('button', { name: /When the Guns Fell Silent at the 11th Hour poster/ }));
      tick();
      const content = document.querySelector('.pe-walkthrough-content') as HTMLElement;
      expect(within(content).getByRole('heading', { level: 2 })).toHaveTextContent('When the Guns Fell Silent at the 11th Hour');
      const stage = document.querySelector('.pe-poster-walkthrough') as HTMLElement;
      expect(stage.dataset.entrance).toBe('rise-expand');
      expect(stage.dataset.atmosphere).toBe('smoke');
      const layer = document.querySelector('.pe-atmo-smoke');
      expect(layer).toHaveAttribute('aria-hidden', 'true');
    });

    it('types a line out but keeps it whole for assistive technology, and keeps the atmosphere as the panels change within it', () => {
      render(<PosterExhibition config={GREAT_WAR} />);
      fireEvent.click(screen.getByRole('button', { name: /When the Guns Fell Silent at the 11th Hour poster/ }));
      tick();
      const before = document.querySelector('.pe-atmo-smoke');
      fireEvent.keyDown(document, { key: 'ArrowRight' });
      tick();
      fireEvent.keyDown(document, { key: 'ArrowRight' });
      tick();
      const stage = document.querySelector('.pe-poster-walkthrough') as HTMLElement;
      expect(stage.dataset.entrance).toBe('typewriter');
      const typed = document.querySelector('.pe-typed') as HTMLElement;
      expect(typed).toHaveAttribute('aria-hidden', 'true');
      const line = GREAT_WAR.posters[1].items[2];
      expect('text' in line && document.querySelector('.pe-walkthrough-content .visually-hidden')?.textContent).toBe('text' in line && line.text);
      // Smoke again after a panel of film: a fresh layer, the same weather.
      expect(document.querySelector('.pe-atmo-smoke')).not.toBeNull();
      expect(before).not.toBeNull();
    });
  });
});
