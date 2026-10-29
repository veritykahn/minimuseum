import { artifactPath, plainText, recordLines } from '@/components/exhibition/artifacts';
import fs from 'fs';
import path from 'path';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import PosterExhibition from '@/components/exhibition/PosterExhibition';
import BlackHistoryCase from '@/app/exhibitions/black-history/artifacts/case/page';
import { posterChapters } from '@/components/projector/posterTalk';
import { getLevelConfig } from '@/components/museum-map/data/levels';
import { getRoomByPath } from '@/components/museum-map/data/rooms';
import { BLACK_HISTORY, BLACK_HISTORY_CASE, NMAAHC_CULTURAL_EXPRESSIONS_URL } from '@/app/exhibitions/black-history/blackHistory';
import { floorReturnFor } from '@/lib/floors';

/*
 * Black History Month: its config, the poster copy against the transcription
 * (with only the owner's approved decisions), the pictures (poster 1's
 * illustrated figures and the posters' own lettering; never the Mattel
 * photograph or the installation), the link out, the walkthrough, the display
 * case page (photographs to come), and the map.
 */

const poster = (id: string) => BLACK_HISTORY.posters.find((p) => p.id === id)!;
const allItems = BLACK_HISTORY.posters.flatMap((p) => p.items);
/** The copy as read: "*…*" marks italics and is not part of the words. */
const plain = (t: string) => t.replace(/\*/g, '');
/** A poster's copy in order: its section titles and paragraphs. */
const copy = (id: string) =>
  poster(id).items.flatMap((it) => (it.type === 'paragraph' || it.type === 'section-title' ? [plain(it.text)] : []));
const allText = allItems.map((it) => ('text' in it && it.text ? plain(it.text) : '')).join('\n');
const tick = (ms = 400) => act(() => { jest.advanceTimersByTime(ms); });

/** Poster 1's copy exactly as printed, from the transcription. */
const PRINTED_BH1 = `Carter G. Woodson played a crucial role in bringing Black history to national attention by creating Negro History Week in 1926, which later became Black History Month. A Harvard-trained historian, Woodson believed that African American history should not be confined to academics but serve as a tool for racial uplift. His organization, the Association for the Study of Negro Life and History, worked to make Black history widely accessible. Inspired by the cultural awakening of the Harlem Renaissance, Woodson established this week to educate schoolchildren and highlight Black contributions to American society, choosing February to align with the birthdays of Abraham Lincoln and Frederick Douglass. Despite significant progress in race relations, Black History Month remains a vital tool for transformation. It serves as a reminder of the struggles and achievements of African Americans, countering historical amnesia and ensuring that crucial aspects of history, like slavery and the fight for civil rights, are not forgotten. Surveys reveal a concerning lack of awareness about slavery's impact, even among African Americans. By fostering discussion and reflection, Black History Month can bridge these gaps, inspire a deeper connection to the past, and promote an understanding of the resilience and contributions of Black individuals throughout history. Beyond education, Black History Month reinforces the importance of preserving African American culture and heritage. From safeguarding historical sites to encouraging donations of artifacts to museums, cultural preservation ensures that Black history is recognized and valued. Additionally, the celebration provides inspiration by honoring figures like Martin Luther King Jr., Harriet Tubman, and Langston Hughes. As society evolves, Black History Month continues to be relevant, reminding all Americans that understanding the past is essential for shaping a more just and inclusive future.`;
/** Poster 2's copy exactly as printed, from the transcription. */
const PRINTED_BH2 = `The first Black Barbie doll, introduced by Mattel in 1980, marked a significant milestone in toy manufacturing and cultural representation. While Mattel had previously created two Black dolls—Christie in 1968 and Francie in 1967—these earlier efforts were problematic. Christie was presented as part of Barbie's friend group, while Francie was essentially a white doll design with darker skin. The first Black Barbie, however, was a groundbreaking creation designed by Kitty Black Perkins, a trailblazing Black fashion designer at Mattel. This doll broke away from past missteps, featuring Afrocentric facial features, natural hairstyles, and a glamorous design that celebrated Black beauty. Its launch addressed decades of criticism about the lack of diversity in toys and the harmful effects of Eurocentric beauty standards perpetuated by the original Barbie. The introduction of the first Black Barbie was a monumental step toward inclusivity, offering Black children a doll that reflected their identity and celebrated their cultural heritage. It challenged conventional beauty standards empoweringchildren to embrace their natural features. Beyond its immediate impact, Black Barbie became a symbol of progress, inspiring further diversification in the toy industry. Over the years, Mattel expanded its range to include dolls with diverse skin tones, facial features, hairstyles, and cultural identities. The success of Black Barbie pavedthe way for initiatives like the "So In Style" line and the AKA Centennial Barbie in 2009, which highlighted authentic Black features and realistic hair textures. Each new iteration built on the legacy of Christie, Francie, and the first Black Barbie, pushing for greater authenticity and representation. Today, Black Barbie is both a cherished collector's item and a symbol of the ongoing journey toward equality and representation in media and consumer products.`;

/** Applies a replacement that must match exactly once, so a fix that silently matches nothing fails. */
function fix(text: string, from: string, to: string) {
  expect(text.split(from)).toHaveLength(2);
  return text.replace(from, to);
}

describe('Black History Month', () => {
  it('has two posters, each opening on its own lettering and ending with Return to Exhibition, and one display case', () => {
    expect(BLACK_HISTORY.slug).toBe('black-history');
    expect(BLACK_HISTORY.name).toBe('Black History Month');
    expect(BLACK_HISTORY.subtitle).toBe('Black Barbie & Representation');
    expect(BLACK_HISTORY.posters.map((p) => p.id)).toEqual(['poster1', 'poster2']);
    expect(BLACK_HISTORY.posters.map((p) => p.title)).toEqual(['Black History Month', 'The Importance of Black Barbie']);
    for (const p of BLACK_HISTORY.posters) {
      expect(p.items[0]).toMatchObject({ type: 'title-image', alt: p.title });
      expect(p.items[p.items.length - 1].type).toBe('end');
      expect(p.hero.alt).toBeTruthy();
      expect(fs.existsSync(path.join(process.cwd(), 'public', p.hero.src))).toBe(true);
    }
    expect(BLACK_HISTORY.cases).toHaveLength(1);
    expect(BLACK_HISTORY.cases?.[0].href).toBe('/exhibitions/black-history/artifacts/case');
    expect(BLACK_HISTORY.fx.theme).toBe('bh');
  });

  it('goes back to the second floor, as its first Reflections room', () => {
    expect(BLACK_HISTORY.back).toEqual(floorReturnFor('black-history'));
    expect(BLACK_HISTORY.back).toEqual({ href: '/exhibitions/second-floor', label: 'Second Floor', remember: { key: 'secondFloorIndex', value: '0' } });
  });

  it('sets poster 1 exactly as printed', () => {
    expect(copy('poster1').join(' ')).toBe(PRINTED_BH1);
  });

  it('sets poster 2 exactly as printed, with only the approved fixes (decisions 1 and 4)', () => {
    let expected = fix(
      PRINTED_BH2,
      'the "So In Style" line and the AKA Centennial Barbie in 2009',
      'the AKA Centennial Barbie (2008) and the "So In Style" line (2009)',
    );
    expected = fix(expected, 'empoweringchildren', 'empowering children');
    expected = fix(expected, 'pavedthe', 'paved the');
    expect(copy('poster2').join(' ')).toBe(expected);
  });

  it('applies the approved decisions, and the replaced wording is gone', () => {
    expect(allText).toContain('the AKA Centennial Barbie (2008) and the "So In Style" line (2009), which highlighted authentic Black features and realistic hair textures.');
    expect(allText).not.toMatch(/Barbie in 2009|empoweringchildren|pavedthe/);
    expect(allText).not.toMatch(/Scan|QR/i);
    expect(allText).not.toMatch(/ {2}/);
  });

  it('splits paragraphs only between sentences', () => {
    for (const it of allItems) if (it.type === 'paragraph' || it.type === 'section-title') expect(plain(it.text)).toMatch(/[.!?]"?$/);
  });

  it.each(BLACK_HISTORY.posters.map((p) => [p.id, p] as const))('%s: one open question per chapter, and none left over', (_id, p) => {
    const chapters = posterChapters(p.items.map((it) => ({ type: it.type, text: 'text' in it ? it.text : undefined })), p.title);
    expect(chapters.length).toBeGreaterThan(0);
    expect(Object.keys(p.talk).sort()).toEqual(chapters.map((c) => c.key).sort());
    for (const c of chapters) expect(p.talk[c.key]).toMatch(/\?$/);
  });

  describe('the pictures (approved decision 2)', () => {
    const dir = path.join(process.cwd(), 'public/exhibitions/black-history');
    const files = (d: string): string[] =>
      fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? files(path.join(d, e.name)).map((f) => `${e.name}/${f}`) : [e.name]));

    it('holds only the posters, their lettering, poster 1’s illustrated figures and the owner’s illustrations for the rooms’ cards', () => {
      expect(files(dir).sort()).toEqual([
        'landing-barbie-timeline.webp',
        'landing-who-do-you-see.webp',
        'poster1.jpg',
        'poster2.jpg',
        'ring.webp',
        'titles/black-history-month.png',
        'titles/importance-of-black-barbie.png',
        'vignettes/atom.webp',
        'vignettes/musician.webp',
        'vignettes/notes.webp',
        'vignettes/scientist.webp',
        'vignettes/singer.webp',
        'vignettes/worker.webp',
      ]);
    });

    it('never crops the Mattel photograph from poster 2, and uses no photograph of the installation', () => {
      const json = JSON.stringify([BLACK_HISTORY, BLACK_HISTORY_CASE]);
      expect(json).not.toMatch(/barbie\d?\.jpg|images\/mm\/|installation|dolls?\.(jpg|png|webp)/i);
      // poster 2 is shown whole, as its hero, and nowhere else
      expect(json.split('/exhibitions/black-history/poster2.jpg')).toHaveLength(2);
      expect(BLACK_HISTORY.cases?.[0].image).toBeUndefined();
      expect(BLACK_HISTORY_CASE.photos).toEqual([]);
    });

    it('describes every picture in a panel', () => {
      for (const it of allItems) {
        if (it.type === 'paragraph' && it.figure) expect(it.figure.alt.length).toBeGreaterThan(20);
      }
    });
  });

  it('links the QR code to the Cultural Expressions exhibition at the NMAAHC (approved decision 3)', () => {
    const callouts = allItems.flatMap((it) => (it.type === 'callout' ? [{ text: it.text, url: it.url }] : []));
    expect(callouts).toEqual([{ text: 'Visit the *Cultural Expressions* exhibition at the National Museum of African American History & Culture', url: NMAAHC_CULTURAL_EXPRESSIONS_URL }]);
    expect(NMAAHC_CULTURAL_EXPRESSIONS_URL).toBe('https://nmaahc.si.edu/explore/exhibitions/cultural-expressions');
  });

  describe('the walkthrough', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      window.history.replaceState(null, '', '/');
    });
    afterEach(() => jest.useRealTimers());

    it('shows the posters and the display case on the landing page', () => {
      render(<PosterExhibition config={BLACK_HISTORY} />);
      expect(screen.getByRole('heading', { level: 1, name: 'Black History Month' })).toBeInTheDocument();
      const caseLink = screen.getByRole('link', { name: /display case/i });
      expect(caseLink).toHaveAttribute('href', '/exhibitions/black-history/artifacts/case');
      expect(caseLink).toHaveTextContent('Display case — photographs to come');
      expect(screen.getByRole('link', { name: 'Second Floor' })).toHaveAttribute('href', '/exhibitions/second-floor');
    });

    it('opens Black History Month on its lettering, and ends with the link to Cultural Expressions in italics', () => {
      render(<PosterExhibition config={BLACK_HISTORY} />);
      fireEvent.click(screen.getByRole('button', { name: /^Black History Month poster/ }));
      tick();
      const content = () => document.querySelector('.pe-walkthrough-content') as HTMLElement;
      expect(within(content()).getByRole('heading', { level: 2, name: 'Black History Month' })).toBeInTheDocument();
      expect(content().querySelector('.pe-title-image img')).toHaveAttribute('src', '/exhibitions/black-history/titles/black-history-month.png');

      const items = poster('poster1').items;
      const callout = items.findIndex((it) => it.type === 'callout');
      for (let i = 0; i < callout; i++) {
        fireEvent.keyDown(document, { key: 'ArrowRight' });
        tick();
      }
      const link = within(content()).getByRole('link', { name: /Visit the Cultural Expressions exhibition at the National Museum of African American History & Culture/ });
      expect(link).toHaveAttribute('href', NMAAHC_CULTURAL_EXPRESSIONS_URL);
      expect(link.querySelector('em')).toHaveTextContent('Cultural Expressions');
    });

    it('opens The Importance of Black Barbie on its bubble lettering', () => {
      render(<PosterExhibition config={BLACK_HISTORY} />);
      fireEvent.click(screen.getByRole('button', { name: /^The Importance of Black Barbie poster/ }));
      tick();
      const content = document.querySelector('.pe-walkthrough-content') as HTMLElement;
      expect(within(content).getByRole('heading', { level: 2, name: 'The Importance of Black Barbie' })).toBeInTheDocument();
      expect(document.querySelector('.pe-atmo-bubblegum-rays')).toHaveAttribute('aria-hidden', 'true');
    });
  });
});

describe('The Black History Month display case page', () => {
  it('keeps the record, with a card for each artifact, beside an empty case awaiting its photographs', () => {
    render(<BlackHistoryCase />);
    expect(screen.getByRole('heading', { level: 1, name: 'Black History Month' })).toBeInTheDocument();
    // Every line of the record is kept: the objects' lines (each object a card) and the display's.
    expect(recordLines(BLACK_HISTORY_CASE).map(plainText)).toEqual([
      'Original boxed Nigerian and Ghanaian editions',
      'Inspiring Women series: Bessie Coleman, Ida B. Wells, and Madam C. J. Walker',
      'Illustrated visual timeline detailing the history of Black representation in toy design',
    ]);
    const cards = screen.getAllByRole('link', { name: /View artifact/ });
    expect(cards.map((c) => c.getAttribute('href'))).toEqual([
      '/exhibitions/black-history/artifacts/case/nigerian-ghanaian-editions',
      '/exhibitions/black-history/artifacts/case/bessie-coleman',
      '/exhibitions/black-history/artifacts/case/ida-b-wells',
      '/exhibitions/black-history/artifacts/case/madam-c-j-walker',
    ]);
    expect(cards.map((c) => c.getAttribute('href'))).toEqual(BLACK_HISTORY_CASE.artifacts.map((a) => artifactPath({ slug: BLACK_HISTORY.slug }, a)));
    expect(screen.getByRole('heading', { level: 2, name: 'In the display' })).toBeInTheDocument();
    // No poster sentence is about these objects: each page has only its name and record line.
    for (const a of BLACK_HISTORY_CASE.artifacts) expect(a.writing).toBeUndefined();
    expect(BLACK_HISTORY_CASE.photos).toHaveLength(0);
    expect(screen.queryAllByRole('img')).toHaveLength(0);
    expect(screen.getByText('Display case — photographs to come')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Return to Exhibition' })).toHaveAttribute('href', '/exhibitions/black-history');
  });
});

describe('Black History Month on the museum map', () => {
  it('is a room on the Second Floor, with an Exhibition Hall, a Display Case and its two interactive rooms', () => {
    const level = getLevelConfig('/exhibitions/black-history/artifacts/case');
    expect(level.title).toBe('Black History Month');
    expect(level.backTarget?.path).toBe('/exhibitions/second-floor');
    expect(level.floorPlan?.rooms.map((r) => [r.label, r.path])).toEqual([
      ['Exhibition Hall', '/exhibitions/black-history'],
      ['Display Case', '/exhibitions/black-history/artifacts/case'],
      ['The Black Barbie Timeline', '/exhibitions/black-history/timeline'],
      ['Who Do You See?', '/exhibitions/black-history/representation'],
    ]);
    expect(getRoomByPath('/exhibitions/black-history')?.parent).toBe('second-floor');
    expect(getRoomByPath('/exhibitions/black-history/artifacts/case')?.parent).toBe('black-history');
    const room = getLevelConfig('/exhibitions/second-floor').rooms.find((r) => r.id === 'black-history')!;
    expect(room.comingSoon).toBeFalsy();
    expect(room.path).toBe('/exhibitions/black-history');
  });
});
