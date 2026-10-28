import { artifactPath, plainText, recordLines } from '@/components/exhibition/artifacts';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import PosterExhibition from '@/components/exhibition/PosterExhibition';
import { posterChapters } from '@/components/projector/posterTalk';
import { GREAT_WAR, GREAT_WAR_CASE } from '@/app/exhibitions/great-war/greatWar';
import GreatWarCase from '@/app/exhibitions/great-war/artifacts/case/page';
import { getLevelConfig } from '@/components/museum-map/data/levels';
import { getRoomByPath } from '@/components/museum-map/data/rooms';

/*
 * The Great War: its config, the walkthrough's running date and time, the
 * display case page, and its place on the map.
 */

const allItems = GREAT_WAR.posters.flatMap((p) => p.items);
const tick = (ms = 400) => act(() => { jest.advanceTimersByTime(ms); });

describe('The Great War', () => {
  it('has two posters, each ending with Return to Exhibition, and one display case', () => {
    expect(GREAT_WAR.posters.map((p) => p.id)).toEqual(['poster1', 'poster2']);
    for (const p of GREAT_WAR.posters) expect(p.items[p.items.length - 1].type).toBe('end');
    expect(GREAT_WAR.cases).toHaveLength(1);
    expect(GREAT_WAR.cases?.[0].href).toBe('/exhibitions/great-war/artifacts/case');
  });

  it.each(GREAT_WAR.posters.map((p) => [p.id, p] as const))('%s: one question per chapter, and none left over', (_id, p) => {
    const chapters = posterChapters(p.items.map((it) => ({ type: it.type, text: 'text' in it ? it.text : undefined })), p.title);
    expect(chapters.length).toBeGreaterThan(1);
    expect(Object.keys(p.talk).sort()).toEqual(chapters.map((c) => c.key).sort());
    for (const c of chapters) expect(p.talk[c.key]).toBeTruthy();
  });

  it('links the Imperial War Museum, and leaves out the Doughboys QR code', () => {
    const links = allItems.flatMap((it) => (it.type === 'callout' && it.url ? [{ text: it.text, url: it.url }] : []));
    expect(links).toEqual([{ text: 'Explore the collections at the Imperial War Museum', url: 'https://www.iwm.org.uk/collections' }]);
    const text = allItems.map((it) => ('text' in it ? it.text : '')).join('\n');
    expect(text).not.toMatch(/Scan here/);
  });

  it('every picture has alt text', () => {
    for (const p of GREAT_WAR.posters) expect(p.hero.alt).toBeTruthy();
    for (const it of allItems) if (it.type === 'full-image') expect(it.alt).toBeTruthy();
  });

  describe('the walkthrough', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      window.history.replaceState(null, '', '/');
    });
    afterEach(() => jest.useRealTimers());

    it('sets the date and time at the foot of the first poster’s title, and opens the display case from the landing page', () => {
      render(<PosterExhibition config={GREAT_WAR} />);
      expect(screen.getByRole('heading', { level: 1, name: 'The Great War' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /display case/i })).toHaveAttribute('href', '/exhibitions/great-war/artifacts/case');

      fireEvent.click(screen.getByRole('button', { name: /The Doughboys: America's Sons in The Great War poster/ }));
      tick();
      const content = document.querySelector('.pe-walkthrough-content') as HTMLElement;
      expect(within(content).getByRole('heading', { level: 2 })).toHaveTextContent("The Doughboys: America's Sons in The Great War");
      const marks = content.querySelector('.pe-marks-foot');
      expect(marks).toHaveTextContent('11.11.1918');
      expect(marks).toHaveTextContent('11:00');
    });
  });
});

describe('The Great War display case page', () => {
  it('keeps the record, with a card for each artifact, beside an empty case awaiting its photographs', () => {
    render(<GreatWarCase />);
    expect(screen.getByRole('heading', { level: 1, name: 'The Great War' })).toBeInTheDocument();
    // Every line of the record is kept: the objects' lines (each object a card) and the display's.
    expect(recordLines(GREAT_WAR_CASE).map(plainText)).toEqual([
      'M1917 Brodie doughboy helmet with American Legion decal',
      'US Army issue shaving kit and the Service for the Mobilized Soldier field manual',
      'Ammunition pouch and commemorative service pins',
      'Backlit silhouette display, take-away soldier profile cards, and an iPad Armistice audio station',
    ]);
    const cards = screen.getAllByRole('link', { name: /View artifact/ });
    expect(cards.map((c) => c.getAttribute('href'))).toEqual(GREAT_WAR_CASE.artifacts.map((a) => artifactPath({ slug: GREAT_WAR.slug }, a)));
    // No installation photographs: an empty case, drawn, stands in for them.
    expect(GREAT_WAR_CASE.photos).toHaveLength(0);
    expect(screen.queryAllByRole('img')).toHaveLength(0);
    expect(screen.getByText('Display case — photographs to come')).toBeInTheDocument();
    expect(JSON.stringify([GREAT_WAR, GREAT_WAR_CASE])).not.toMatch(/installation|case(-thumb|-table)?\.jpg|microscopes?(-sands)?\.jpg|sand-specimens\.jpg|moon-dust\.jpg/);
    expect(screen.getByRole('link', { name: 'Return to Exhibition' })).toHaveAttribute('href', '/exhibitions/great-war');
    expect(screen.getByRole('link', { name: 'Exhibition' })).toHaveAttribute('href', '/exhibitions/great-war');
  });

  it('is on the museum map, inside The Great War', () => {
    expect(getLevelConfig('/exhibitions/great-war').title).toBe('The Great War');
    expect(getLevelConfig('/exhibitions/great-war/artifacts/case').floorPlan?.rooms.map((r) => r.id)).toEqual(['gw-entrance', 'gw-case', 'gw-silence', 'gw-memorial']);
    expect(getRoomByPath('/exhibitions/great-war/artifacts/case')?.id).toBe('gw-case');
    expect(getRoomByPath('/exhibitions/great-war')?.comingSoon).toBeFalsy();
  });
});
