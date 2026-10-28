import { artifactPath, plainText, recordLines } from '@/components/exhibition/artifacts';
import fs from 'fs';
import path from 'path';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import PosterExhibition from '@/components/exhibition/PosterExhibition';
import HolocaustCase from '@/app/exhibitions/holocaust/artifacts/case/page';
import { posterChapters } from '@/components/projector/posterTalk';
import { getLevelConfig } from '@/components/museum-map/data/levels';
import { getRoomByPath } from '@/components/museum-map/data/rooms';
import {
  COMMONS_PICTURES,
  HOLOCAUST,
  HOLOCAUST_CASE,
  USHMM_URL,
  creditFor,
} from '@/app/exhibitions/holocaust/holocaust';
import { floorReturnFor } from '@/lib/floors';

/*
 * Holocaust Memorial Day: its config, the poster copy against the
 * transcription (with only the owner's approved decisions), the pictures
 * (the posters' neutral photographs, and Wikimedia Commons replacements, each
 * credited with author and license), the link out, the walkthrough with its
 * quiet reveal, the display case page (photographs to come), and the map.
 */

const poster = (id: string) => HOLOCAUST.posters.find((p) => p.id === id)!;
const allItems = HOLOCAUST.posters.flatMap((p) => p.items);
/** The copy as read: "*…*" marks italics and is not part of the words. */
const plain = (t: string) => t.replace(/\*/g, '');
const paragraphs = (id: string) => poster(id).items.flatMap((it) => (it.type === 'paragraph' ? [plain(it.text)] : []));
const allText = allItems
  .map((it) => [('text' in it && it.text) ? plain(it.text) : '', ('cite' in it && it.cite) || ''].filter(Boolean).join(' '))
  .join('\n');
const tick = (ms = 400) => act(() => { jest.advanceTimersByTime(ms); });

/** Poster 1's copy exactly as printed, from the transcription. */
const PRINTED_1 = 'National Holocaust Memorial Day is observed annually on January 27th to commemorate the six million Jewish people who were murdered by the Nazi regime, as well as the millions of other victims who were persecuted. By 1945, over 67% of the European Jewish population had been eradicated in an act of genocide. The date marks the liberation of Auschwitz-Birkenau, the largest Nazi concentration and extermination camp, in 1945. This day also honors those affected by subsequent genocides in Cambodia, Rwanda, Bosnia and Darfur. It serves as a powerful reminder of the consequences of hatred, discrimination, and indifference, encouraging reflection, remembrance and a commitment to building a safer, more inclusive world.';
/** Poster 2's copy exactly as printed, from the transcription. */
const PRINTED_2 = 'The Holocaust, also known as the Shoah (a Hebrew word meaning “catastrophe”), was the systematic persecution and murder of six million Jewish men, women, and children by Nazi Germany and its collaborators between 1933 and 1945. While the Nazis specifically despised and persecuted Jews, other groups such as Roma, political prisoners, and people with disabilities were targeted. Before being deported to concentration and extermination camps, many Jewish people were confined to ghettos, overcrowded and walled-off sections of cities where living conditions were inhumane. Disease, starvation, and violence were rampant in ghettos such as those in Warsaw, Lodz, and Vilna. Jews deported to camps like Auschwitz often had identification numbers tattooed on their arms, stripping them of their identities and humanity. Despite the horrors, acts of bravery emerged as individuals and groups risked their lives to save Jews. These rescuers are honored as the Righteous Among the Nations, a title awarded by Yad Vashem, Israel’s Holocaust memorial, to recognize their courage and humanity in the face of unspeakable evil.';
const NIEMOLLER = '“First they came for the socialists, and I did not speak out—because I was not a socialist. Then they came for the trade unionists, and I did not speak out—because I was not a trade unionist. Then they came for the Jews, and I did not speak out—because I was not a Jew. Then they came for me—and there was no one left to speak for me.”';

/** Applies a replacement that must match exactly once, so a fix that silently matches nothing fails. */
function fix(text: string, from: string, to: string) {
  expect(text.split(from)).toHaveLength(2);
  return text.replace(from, to);
}

describe('Holocaust Memorial Day', () => {
  it('has two posters, each opening on its title and ending with Return to Exhibition, and one display case', () => {
    expect(HOLOCAUST.slug).toBe('holocaust');
    expect(HOLOCAUST.name).toBe('Holocaust Memorial Day');
    expect(HOLOCAUST.subtitle).toBe('Never Forget');
    expect(HOLOCAUST.posters.map((p) => p.id)).toEqual(['poster1', 'poster2']);
    expect(HOLOCAUST.posters.map((p) => p.title)).toEqual(['International Holocaust Remembrance Day', 'What Was the Holocaust?']);
    for (const p of HOLOCAUST.posters) {
      expect(p.items[0].type).toBe('title-text');
      expect(p.items[p.items.length - 1].type).toBe('end');
      expect(p.hero.alt).toBeTruthy();
    }
    expect(HOLOCAUST.cases).toHaveLength(1);
    expect(HOLOCAUST.cases?.[0].href).toBe('/exhibitions/holocaust/artifacts/case');
    expect(HOLOCAUST.fx.theme).toBe('ho');
  });

  it('names the day International Holocaust Remembrance Day (approved decision 1)', () => {
    const [t1, t2] = HOLOCAUST.posters.map((p) => p.items[0]);
    expect(t1).toMatchObject({ text: 'International Holocaust Remembrance Day', lines: ['INTERNATIONAL', 'HOLOCAUST', 'REMEMBRANCE', 'DAY'] });
    expect(t2).toMatchObject({ text: 'What Was the Holocaust?', lines: ['WHAT WAS THE', 'HOLOCAUST?'] });
    expect(paragraphs('poster1')[0]).toMatch(/^International Holocaust Remembrance Day is observed annually on January 27 to/);
    expect(allText).not.toMatch(/National Holocaust Memorial Day/);
  });

  it('goes back to the first floor, as its fourth Horizons room', () => {
    expect(HOLOCAUST.back).toEqual(floorReturnFor('holocaust'));
    expect(HOLOCAUST.back).toEqual({ href: '/exhibitions/first-floor', label: 'First Floor', remember: { key: 'firstFloorIndex', value: '3' } });
  });

  it('sets poster 1 exactly as printed, with only the new name and the US date', () => {
    let expected = fix(PRINTED_1, 'National Holocaust Memorial Day is observed', 'International Holocaust Remembrance Day is observed');
    expected = fix(expected, 'January 27th', 'January 27');
    expect(paragraphs('poster1').join(' ')).toBe(expected);
    const close = poster('poster1').items.find((it) => it.type === 'section-title');
    expect(close).toMatchObject({ text: 'Never Forget.' });
  });

  it('sets poster 2 exactly as printed, with only the approved fix (decision 2)', () => {
    const expected = fix(
      PRINTED_2,
      'Jews deported to camps like Auschwitz often had identification numbers tattooed on their arms',
      'Prisoners registered at Auschwitz had identification numbers tattooed on their arms',
    );
    expect(paragraphs('poster2').join(' ')).toBe(expected);
    const quote = poster('poster2').items.find((it) => it.type === 'quote');
    expect(quote).toMatchObject({ text: NIEMOLLER, cite: '— Martin Niemöller' });
  });

  it('applies the approved decisions, and the replaced wording is gone', () => {
    expect(allText).toContain('Prisoners registered at Auschwitz had identification numbers tattooed on their arms, stripping them of their identities and humanity.');
    expect(allText).not.toContain('Jews deported to camps like Auschwitz');
    expect(allText).not.toContain('often had identification numbers');
    expect(allText).not.toMatch(/January 27th|27th/);
    expect(allText).not.toMatch(/Scan|QR/i);
    expect(allText).not.toMatch(/ {2}/);
  });

  it('splits paragraphs only between sentences', () => {
    for (const it of allItems) if (it.type === 'paragraph') expect(plain(it.text)).toMatch(/[.!?]"?$/);
  });

  it('uses US spellings and the posters’ italics', () => {
    expect(allText).toMatch(/honors/);
    expect(allText).toMatch(/recognize/);
    expect(allText).not.toMatch(/honour|recognise|colour|centre\b|memorialisation/);
    const p2 = poster('poster2').items.flatMap((it) => (it.type === 'paragraph' ? [it.text] : [])).join(' ');
    expect(p2).toContain('*Shoah*');
    expect(p2).toContain('*Righteous Among the Nations*');
  });

  it.each(HOLOCAUST.posters.map((p) => [p.id, p] as const))('%s: one open question per chapter, and none left over', (_id, p) => {
    const chapters = posterChapters(p.items.map((it) => ({ type: it.type, text: 'text' in it ? it.text : undefined })), p.title);
    expect(chapters.length).toBeGreaterThan(0);
    expect(Object.keys(p.talk).sort()).toEqual(chapters.map((c) => c.key).sort());
    for (const c of chapters) expect(p.talk[c.key]).toMatch(/\?$/);
  });

  it('asks about remembrance, courage and speaking up, never to imagine being a victim or perpetrator', () => {
    const questions = HOLOCAUST.posters.flatMap((p) => Object.values(p.talk)).join(' ');
    expect(questions).toMatch(/remember/i);
    expect(questions).toMatch(/courage/i);
    expect(questions).toMatch(/speak up/i);
    expect(questions).not.toMatch(/imagine|pretend|if you were|you are a/i);
  });

  describe('the pictures (approved decision 3)', () => {
    const pictures = allItems.flatMap((it) => {
      if (it.type === 'full-image') return [{ src: it.src, alt: it.alt, credit: it.text, href: it.href }];
      if (it.type === 'paragraph' && it.figure) return [{ src: it.figure.src, alt: it.figure.alt, credit: it.figure.credit?.text, href: it.figure.credit?.href }];
      return [];
    });

    it('uses only the neutral photographs from the posters, and the Commons replacements', () => {
      expect(pictures.map((p) => p.src).sort()).toEqual([
        '/exhibitions/holocaust/commons-berlin-memorial.jpg',
        '/exhibitions/holocaust/commons-birkenau-monument.jpg',
        '/exhibitions/holocaust/commons-candles.jpg',
        '/exhibitions/holocaust/poster-barracks.jpg',
        '/exhibitions/holocaust/poster-block-24a.jpg',
        '/exhibitions/holocaust/poster-fence.jpg',
        '/exhibitions/holocaust/poster-stones.jpg',
      ]);
      for (const p of pictures) {
        expect(p.alt).toBeTruthy();
        expect(p.alt).not.toMatch(/tattoo|arm\b|Fallen Leaves|Kadishman|flag/i);
        expect(fs.existsSync(path.join(process.cwd(), 'public', p.src))).toBe(true);
      }
    });

    it('credits every Commons picture with its author and license, linked to its file page', () => {
      expect(COMMONS_PICTURES).toHaveLength(3);
      for (const c of COMMONS_PICTURES) {
        expect(c.author).toBeTruthy();
        expect(c.license).toMatch(/^(Public domain|CC0|CC BY(-SA)? \d\.\d)$/);
        expect(c.href).toMatch(/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/);
        const credit = creditFor(c);
        expect(credit).toContain(c.author);
        expect(credit).toContain(c.license);
        expect(credit).toContain('via Wikimedia Commons');
        const used = pictures.find((p) => p.src === c.src);
        expect(used).toMatchObject({ credit, href: c.href });
      }
      expect(HOLOCAUST.credits).toEqual(COMMONS_PICTURES.map((c) => ({ text: creditFor(c), href: c.href })));
    });

    it('takes no installation photographs', () => {
      expect(HOLOCAUST.cases?.[0].image).toBeUndefined();
      expect(HOLOCAUST_CASE.photos).toEqual([]);
      const dir = path.join(process.cwd(), 'public/exhibitions/holocaust');
      expect(fs.readdirSync(dir).filter((f) => /installation|case/.test(f))).toEqual([]);
    });
  });

  it('links the QR code to the Holocaust Encyclopedia at the USHMM (approved decision 4)', () => {
    const callouts = allItems.flatMap((it) => (it.type === 'callout' ? [{ text: it.text, url: it.url }] : []));
    expect(callouts).toEqual([{ text: 'Learn more about the Holocaust at the United States Holocaust Memorial Museum', url: USHMM_URL }]);
    expect(USHMM_URL).toBe('https://encyclopedia.ushmm.org/content/en/article/introduction-to-the-holocaust');
  });

  describe('the walkthrough', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      window.history.replaceState(null, '', '/');
    });
    afterEach(() => jest.useRealTimers());

    it('shows the posters, the display case and the picture credits on the landing page', () => {
      render(<PosterExhibition config={HOLOCAUST} />);
      expect(screen.getByRole('heading', { level: 1, name: 'Holocaust Memorial Day' })).toBeInTheDocument();
      const caseLink = screen.getByRole('link', { name: /display case/i });
      expect(caseLink).toHaveAttribute('href', '/exhibitions/holocaust/artifacts/case');
      expect(caseLink).toHaveTextContent('Display case — photographs to come');
      expect(screen.getByRole('link', { name: 'First Floor' })).toHaveAttribute('href', '/exhibitions/first-floor');
      const credits = within(screen.getByRole('list', { name: 'Picture credits' })).getAllByRole('link');
      expect(credits.map((a) => a.getAttribute('href'))).toEqual(COMMONS_PICTURES.map((c) => c.href));
    });

    it('opens International Holocaust Remembrance Day as the light comes up, with credited pictures', () => {
      render(<PosterExhibition config={HOLOCAUST} />);
      fireEvent.click(screen.getByRole('button', { name: /^National Holocaust Memorial Day poster/ }));
      tick();
      const content = () => document.querySelector('.pe-walkthrough-content') as HTMLElement;
      expect(within(content()).getByRole('heading', { level: 2, name: 'International Holocaust Remembrance Day' })).toBeInTheDocument();
      expect(content().querySelector('.pfx-ho-light')).toBeInTheDocument();
      expect(content().querySelectorAll('.pe-title-line')).toHaveLength(4);

      fireEvent.keyDown(document, { key: 'ArrowRight' });
      tick();
      expect(content().querySelector('.pe-figure img')).toHaveAttribute('src', '/exhibitions/holocaust/poster-stones.jpg');

      fireEvent.keyDown(document, { key: 'ArrowRight' });
      tick();
      const credit = content().querySelector('.pe-figure-credit a') as HTMLElement;
      expect(credit).toHaveAttribute('href', COMMONS_PICTURES[1].href);
      expect(credit).toHaveTextContent('Dietmar Rabich');
      expect(credit).toHaveTextContent('CC BY-SA 4.0');
    });

    it('opens What Was the Holocaust?, sets the Niemöller quotation, and links to the USHMM', () => {
      render(<PosterExhibition config={HOLOCAUST} />);
      fireEvent.click(screen.getByRole('button', { name: /^What Was the Holocaust\? poster/ }));
      tick();
      const content = () => document.querySelector('.pe-walkthrough-content') as HTMLElement;
      expect(within(content()).getByRole('heading', { level: 2, name: 'What Was the Holocaust?' })).toBeInTheDocument();

      const items = poster('poster2').items;
      const quote = items.findIndex((it) => it.type === 'quote');
      for (let i = 0; i < quote; i++) {
        fireEvent.keyDown(document, { key: 'ArrowRight' });
        tick();
      }
      expect(content().querySelector('blockquote')).toHaveTextContent('First they came for the socialists');
      expect(content().querySelector('.pe-quote-cite')).toHaveTextContent('— Martin Niemöller');

      fireEvent.keyDown(document, { key: 'ArrowRight' });
      tick();
      expect(within(content()).getByRole('link', { name: /Learn more about the Holocaust at the United States Holocaust Memorial Museum/ })).toHaveAttribute('href', USHMM_URL);
    });
  });
});

describe('The Holocaust Memorial Day display case page', () => {
  it('keeps the record, with a card for each artifact, beside an empty case awaiting its photographs', () => {
    render(<HolocaustCase />);
    expect(screen.getByRole('heading', { level: 1, name: 'Holocaust Memorial Day' })).toBeInTheDocument();
    // Every line of the record is kept: the objects' lines (each object a card) and the display's.
    expect(recordLines(HOLOCAUST_CASE).map(plainText)).toEqual([
      'Original 1 Krone Theresienstadt ghetto scrip',
      'Replica of a brass mezuzah recovered in Warsaw by a survivor',
      'Traditional brass and pottery Shabbat candle holders',
      'Educational panels on Holocaust history, resistance, and international memorialization',
    ]);
    const cards = screen.getAllByRole('link', { name: /View artifact/ });
    expect(cards.map((c) => c.getAttribute('href'))).toEqual([
      '/exhibitions/holocaust/artifacts/case/ghetto-scrip',
      '/exhibitions/holocaust/artifacts/case/mezuzah',
      '/exhibitions/holocaust/artifacts/case/shabbat-candle-holders',
    ]);
    expect(cards.map((c) => c.getAttribute('href'))).toEqual(HOLOCAUST_CASE.artifacts.map((a) => artifactPath({ slug: HOLOCAUST.slug }, a)));
    expect(screen.getByRole('heading', { level: 2, name: 'In the display' })).toBeInTheDocument();
    // No poster sentence is about these objects: each page has only its name and record line.
    for (const a of HOLOCAUST_CASE.artifacts) expect(a.writing).toBeUndefined();
    // No installation photographs: an empty case, drawn, stands in for them.
    expect(HOLOCAUST_CASE.photos).toHaveLength(0);
    expect(screen.queryAllByRole('img')).toHaveLength(0);
    expect(screen.getByText('Display case — photographs to come')).toBeInTheDocument();
    expect(JSON.stringify([HOLOCAUST, HOLOCAUST_CASE])).not.toMatch(/installation|case(-thumb|-table)?\.jpg/);
    expect(screen.getByRole('link', { name: 'Return to Exhibition' })).toHaveAttribute('href', '/exhibitions/holocaust');
    expect(screen.getByRole('link', { name: 'Exhibition' })).toHaveAttribute('href', '/exhibitions/holocaust');
  });
});

describe('Holocaust Memorial Day on the museum map', () => {
  it('is a room on the First Floor, with an Exhibition Hall and a Display Case', () => {
    const level = getLevelConfig('/exhibitions/holocaust/artifacts/case');
    expect(level.title).toBe('Holocaust Memorial Day');
    expect(level.backTarget?.path).toBe('/exhibitions/first-floor');
    expect(level.floorPlan?.rooms.map((r) => [r.label, r.path])).toEqual([
      ['Exhibition Hall', '/exhibitions/holocaust'],
      ['Display Case', '/exhibitions/holocaust/artifacts/case'],
    ]);
    expect(getRoomByPath('/exhibitions/holocaust')?.parent).toBe('first-floor');
    expect(getRoomByPath('/exhibitions/holocaust/artifacts/case')?.parent).toBe('holocaust');
    const room = getLevelConfig('/exhibitions/first-floor').rooms.find((r) => r.id === 'holocaust')!;
    expect(room.comingSoon).toBeFalsy();
    expect(room.path).toBe('/exhibitions/holocaust');
  });
});
